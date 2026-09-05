/**
 * Sổ tay TRA CỨU — dữ liệu tra nhanh, dùng chung cho cả năm chặng.
 *
 * Vì sao tách riêng khỏi `stageN/`: những bảng dưới đây không thuộc chặng nào
 * cả. Người ở chặng 2 cần bảng quy đổi điểm y hệt người ở chặng 5, và mô tả
 * band thì càng học lên càng phải đọc lại. Nhét chúng vào một chặng nghĩa là
 * bốn chặng còn lại không thấy.
 *
 * ⚠️ Hai điều phải nói thẳng về độ tin cậy của số liệu ở đây:
 *
 *  1. **Bảng quy đổi điểm thô → band là bảng CHỈ BÁO**, không phải quy tắc cố
 *     định. IELTS cân bằng độ khó giữa các đề, nên ranh giới xê dịch nhẹ theo
 *     từng bản đề. Dùng nó để biết mình đang ở đâu, đừng dùng để cãi điểm.
 *  2. **Phần mô tả band là bản TÓM TẮT bằng tiếng Việt**, giữ nguyên vài cụm
 *     tiếng Anh then chốt vì chính chữ đó mới là thứ giám khảo dùng. Bản đầy
 *     đủ, chính thức và miễn phí nằm ở ielts.org — đọc bản gốc, đừng học thuộc
 *     bản tóm tắt này.
 */

/* ═══════════════ MÔ TẢ BAND (tóm tắt) ═══════════════ */

export interface BandCriterion {
  skill: 'Viết' | 'Nói';
  /** Tên tiêu chí đúng như trong tài liệu chính thức. */
  criterion: string;
  /** Tên tiếng Việt ngắn gọn. */
  criterionVi: string;
  /** Một câu: tiêu chí này thật ra đo cái gì. */
  measures: string;
  bands: { band: string; text: string }[];
}

export const BAND_CRITERIA: BandCriterion[] = [
  {
    skill: 'Viết',
    criterion: 'Task Response (Task 2)',
    criterionVi: 'Trả lời đúng đề',
    measures: 'Bạn có trả lời ĐÚNG câu được hỏi, đủ mọi phần của đề, và có phát triển ý tới nơi không.',
    bands: [
      { band: '6', text: 'Có nêu lập trường nhưng chưa nhất quán; ý có liên quan nhưng phát triển chưa đủ, đôi chỗ lan man.' },
      { band: '7', text: 'Lập trường rõ và giữ được suốt bài; ý chính rõ ràng, nhưng có ý còn phát triển thiếu hoặc chi tiết chưa thật trúng.' },
      { band: '8', text: '"Sufficiently addresses ALL parts of the task" — trả lời đủ MỌI phần; ý được "extended and supported", tức là kéo dài bằng lập luận và có chỗ tựa cụ thể.' },
    ],
  },
  {
    skill: 'Viết',
    criterion: 'Coherence & Cohesion',
    criterionVi: 'Mạch lạc & liên kết',
    measures: 'Người đọc có đi theo được mạch không, và bạn nối ý bằng NỘI DUNG hay bằng nhãn dán đầu câu.',
    bands: [
      { band: '6', text: 'Có sắp xếp mạch lạc nhìn chung; dùng từ nối nhưng đôi khi máy móc hoặc sai; đoạn văn chưa phải lúc nào cũng đúng chỗ.' },
      { band: '7', text: 'Sắp xếp thông tin logic; dùng đa dạng phương tiện liên kết nhưng đôi khi thừa hoặc thiếu; mỗi đoạn có một ý trung tâm rõ.' },
      { band: '8', text: '"Manages all aspects of cohesion well" — liên kết mượt tới mức không thấy, và phân đoạn hợp lý. Ở mức này, mạch lạc đến từ ý nối được với ý, không đến từ Firstly/Moreover.' },
    ],
  },
  {
    skill: 'Viết',
    criterion: 'Lexical Resource',
    criterionVi: 'Vốn từ',
    measures: 'Không phải bạn biết bao nhiêu từ, mà bạn dùng từ có CHÍNH XÁC không.',
    bands: [
      { band: '6', text: 'Vốn từ đủ dùng; có cố dùng từ ít gặp nhưng còn thiếu chính xác; sai chính tả/cấu tạo từ nhưng chưa cản người đọc.' },
      { band: '7', text: 'Vốn từ đủ linh hoạt để nói chính xác; có dùng từ ít gặp và nhận thức được văn phong; đôi chỗ sai từ hoặc sai kết hợp từ.' },
      { band: '8', text: '"Conveys PRECISE meanings"; "SKILFULLY uses uncommon lexical items" — dùng khéo, không dùng nhiều. Vẫn được phép sai đôi chỗ về chọn từ và kết hợp từ, và lỗi chính tả phải HIẾM.' },
    ],
  },
  {
    skill: 'Viết',
    criterion: 'Grammatical Range & Accuracy',
    criterionVi: 'Ngữ pháp',
    measures: 'Tỷ lệ câu KHÔNG LỖI — tiêu chí duy nhất bạn tự đếm được bằng tay.',
    bands: [
      { band: '6', text: 'Trộn câu đơn và câu phức; có lỗi ngữ pháp và dấu câu nhưng hiếm khi gây khó hiểu.' },
      { band: '7', text: '"Produces FREQUENT error-free sentences" — thường xuyên có câu không lỗi; kiểm soát tốt nhưng vẫn còn vài lỗi. Thực tế: khoảng 60–70% câu sạch.' },
      { band: '8', text: '"The MAJORITY of sentences are error-free" — phần lớn câu không lỗi, chỉ còn lỗi rất lẻ tẻ. Thực tế: trên 80% câu sạch.' },
    ],
  },
  {
    skill: 'Nói',
    criterion: 'Fluency & Coherence',
    criterionVi: 'Độ trôi chảy',
    measures: 'Bạn dừng vì NGHĨ hay dừng vì TÌM TỪ — hai chuyện khác hẳn nhau.',
    bands: [
      { band: '6', text: 'Nói dài được nhưng mất mạch vì lặp, tự sửa hoặc do dự; dùng được từ nối tuy đôi khi chưa mượt.' },
      { band: '7', text: 'Nói dài không mấy khó khăn; đôi khi còn do dự vì cân nhắc ngôn ngữ, nhưng ít lặp và ít tự sửa.' },
      { band: '8', text: '"Hesitation is usually CONTENT-RELATED, and only rarely to search for language" — được phép dừng để nghĩ; dừng để tìm từ mới bị trừ. Triển khai chủ đề mạch lạc.' },
    ],
  },
  {
    skill: 'Nói',
    criterion: 'Lexical Resource',
    criterionVi: 'Vốn từ',
    measures: 'Có nói vòng được khi bí từ không — đây là kỹ năng được nêu thẳng trong mô tả band 8.',
    bands: [
      { band: '6', text: 'Đủ từ để bàn dài về mọi chủ đề dù đôi khi chưa chính xác; nói vòng được nhưng chưa gọn.' },
      { band: '7', text: 'Bàn được nhiều chủ đề một cách linh hoạt; dùng được từ ít gặp và thành ngữ dù đôi khi chưa chuẩn; nói vòng hiệu quả.' },
      { band: '8', text: '"Uses less common and idiomatic vocabulary SKILFULLY"; "uses paraphrase effectively as required" — nói vòng tốt là một phần của band 8, không phải dấu hiệu yếu.' },
    ],
  },
  {
    skill: 'Nói',
    criterion: 'Grammatical Range & Accuracy',
    criterionVi: 'Ngữ pháp',
    measures: 'Cũng là tỷ lệ câu sạch, nhưng chấm khoan dung hơn viết vì nói là thời gian thực.',
    bands: [
      { band: '6', text: 'Trộn câu đơn và phức nhưng câu phức còn hạn chế; hay mắc lỗi tuy hiếm khi gây hiểu nhầm.' },
      { band: '7', text: 'Dùng đa dạng cấu trúc linh hoạt; thường xuyên có câu không lỗi tuy vẫn còn lỗi ngữ pháp lặp.' },
      { band: '8', text: '"A MAJORITY of error-free sentences with only very occasional inappropriacies or basic/non-systematic errors" — lỗi còn lại phải là lỗi lẻ, không thành hệ thống.' },
    ],
  },
  {
    skill: 'Nói',
    criterion: 'Pronunciation',
    criterionVi: 'Phát âm',
    measures: 'Người nghe có phải CỐ GẮNG không. Giọng Việt không bị trừ; khó hiểu mới bị trừ.',
    bands: [
      { band: '6', text: 'Dùng được một số đặc điểm phát âm nhưng chưa đều; nhìn chung hiểu được, đôi chỗ phát âm sai làm giảm độ rõ.' },
      { band: '7', text: 'Dùng được nhiều đặc điểm phát âm và kiểm soát khá tốt; đôi chỗ còn lỗi nhưng nhìn chung dễ hiểu.' },
      { band: '8', text: '"Is easy to understand throughout; L1 ACCENT has minimal effect on intelligibility" — KHÔNG yêu cầu bỏ giọng Việt. Với người Việt, thứ ảnh hưởng nhiều nhất theo thứ tự: phụ âm cuối → trọng âm từ → ngữ điệu câu.' },
    ],
  },
];

/* ═══════════════ QUY ĐỔI ĐIỂM THÔ → BAND ═══════════════ */

/**
 * ⚠️ SỐ LIỆU NÀY CÒN NẰM Ở MỘT CHỖ NỮA: `data/stage1/exam.ts`, khối
 * "Bảng quy đổi số câu đúng → band" của tab Cẩm nang thi. Bảng ở đó gọn hơn
 * (chỉ 7.0/7.5/8.0) nhưng phải KHỚP với bảng đầy đủ dưới đây — sửa một chỗ mà
 * quên chỗ kia thì hai tab của cùng một trang nói hai con số khác nhau, và
 * người học không có cách nào biết tin cái nào.
 */

export interface ScoreTable {
  id: string;
  title: string;
  note: string;
  rows: { band: string; raw: string }[];
}

export const SCORE_TABLES: ScoreTable[] = [
  {
    id: 'listening',
    title: 'Nghe — 40 câu (Academic và General giống nhau)',
    note: 'Bảng chỉ báo do British Council và IDP công bố. Ranh giới xê dịch nhẹ theo từng bản đề.',
    rows: [
      { band: '9.0', raw: '39 – 40' },
      { band: '8.5', raw: '37 – 38' },
      { band: '8.0', raw: '35 – 36' },
      { band: '7.5', raw: '32 – 34' },
      { band: '7.0', raw: '30 – 31' },
      { band: '6.5', raw: '26 – 29' },
      { band: '6.0', raw: '23 – 25' },
      { band: '5.5', raw: '18 – 22' },
      { band: '5.0', raw: '16 – 17' },
      { band: '4.5', raw: '13 – 15' },
      { band: '4.0', raw: '10 – 12' },
    ],
  },
  {
    id: 'reading-ac',
    title: 'Đọc — Academic, 40 câu',
    note: 'Khó hơn General ở cùng một band: cần ít câu đúng hơn để đạt cùng điểm.',
    rows: [
      { band: '9.0', raw: '39 – 40' },
      { band: '8.5', raw: '37 – 38' },
      { band: '8.0', raw: '35 – 36' },
      { band: '7.5', raw: '33 – 34' },
      { band: '7.0', raw: '30 – 32' },
      { band: '6.5', raw: '27 – 29' },
      { band: '6.0', raw: '23 – 26' },
      { band: '5.5', raw: '19 – 22' },
      { band: '5.0', raw: '15 – 18' },
      { band: '4.5', raw: '13 – 14' },
    ],
  },
  {
    id: 'reading-gt',
    title: 'Đọc — General Training, 40 câu',
    note: 'Bài dễ hơn nên yêu cầu số câu đúng CAO hơn hẳn. Đừng lấy điểm luyện đề Academic để tự ước lượng cho General.',
    rows: [
      { band: '9.0', raw: '40' },
      { band: '8.5', raw: '39' },
      { band: '8.0', raw: '37 – 38' },
      { band: '7.5', raw: '36' },
      { band: '7.0', raw: '34 – 35' },
      { band: '6.5', raw: '32 – 33' },
      { band: '6.0', raw: '30 – 31' },
      { band: '5.5', raw: '27 – 29' },
      { band: '5.0', raw: '23 – 26' },
      { band: '4.5', raw: '19 – 22' },
    ],
  },
];

/** Cách làm tròn điểm tổng — chỗ rất hay bị hiểu sai. */
export const ROUNDING_NOTES: { k: string; v: string }[] = [
  { k: 'Điểm tổng', v: 'Trung bình cộng bốn kỹ năng, làm tròn tới 0,5 gần nhất.' },
  { k: 'Đuôi .25', v: 'Làm tròn LÊN nửa band. Ví dụ 6,25 → 6,5.' },
  { k: 'Đuôi .75', v: 'Làm tròn LÊN nguyên band. Ví dụ 6,75 → 7,0.' },
  { k: 'Đuôi .125 hoặc .375', v: 'Làm tròn XUỐNG. Ví dụ 6,375 → 6,0 — đây là chỗ nhiều người mất nửa band mà không hiểu vì sao.' },
  { k: 'Ví dụ thật', v: 'L 8.0 · R 8.0 · W 6.5 · S 7.0 = 29,5 ÷ 4 = 7,375 → 7,0. Một kỹ năng 6.5 kéo cả bộ xuống 7.0.' },
];

/* ═══════════════ CẤU TRÚC ĐỀ THI ═══════════════ */

export const TEST_FORMAT: { part: string; time: string; detail: string }[] = [
  { part: 'Nghe', time: '30 phút + 10 phút chép đáp án (bản giấy)', detail: '4 phần, 40 câu. Phần 1–2 tình huống đời thường, phần 3–4 học thuật. Bản máy tính KHÔNG có 10 phút chép, chỉ có 2 phút soát.' },
  { part: 'Đọc', time: '60 phút, không có thời gian chép thêm', detail: '3 passage, 40 câu. Academic: văn bản học thuật. General: thông báo, quảng cáo, tài liệu công việc. Phân bổ đề nghị: 17 – 20 – 23 phút.' },
  { part: 'Viết', time: '60 phút', detail: 'Task 1 (150 từ, 20 phút) + Task 2 (250 từ, 40 phút). Task 2 chiếm 2/3 điểm phần Viết — nhưng làm Task 1 TRƯỚC.' },
  { part: 'Nói', time: '11 – 14 phút', detail: 'Part 1 giới thiệu (4–5 phút) · Part 2 nói một mình theo cue card (1 phút chuẩn bị + 2 phút nói) · Part 3 thảo luận sâu (4–5 phút).' },
  { part: 'Thi giấy hay máy', time: 'Kết quả 3–5 ngày (máy) · 13 ngày (giấy)', detail: 'Nội dung và cách chấm giống hệt nhau. Khác: bản máy phải gõ Writing (xem tab Gõ đoạn văn) và không có 10 phút chép đáp án Listening.' },
];

/* ═══════════════ CHECKLIST SOÁT BÀI ═══════════════ */

export interface ProofItem {
  label: string;
  /** Vì sao lỗi này đáng soát riêng một lượt. */
  why: string;
  examples: { wrong: string; right: string }[];
}

/**
 * Soát theo LOẠI LỖI, mỗi loại một lượt quét — không đọc trôi cả bài.
 * Mắt chỉ tìm được một thứ mỗi lượt; đọc trôi bỏ sót nhiều hơn hẳn.
 */
export const PROOF_CHECKLIST: ProofItem[] = [
  {
    label: 'Mạo từ (a / an / the)',
    why: 'Lỗi số một của người Việt vì tiếng Việt không có mạo từ, nên không có phản xạ. Quét riêng một lượt chỉ nhìn danh từ.',
    examples: [
      { wrong: 'invest in the education', right: 'invest in education' },
      { wrong: 'The research shows… (nói chung)', right: 'Research shows…' },
      { wrong: 'Government should act.', right: 'Governments should act. / The government should act.' },
    ],
  },
  {
    label: 'Số ít / số nhiều',
    why: 'Bị trừ ở Ngữ pháp, và với Listening/Reading thì điền sai số nhiều là mất trọn câu dù nghe đúng.',
    examples: [
      { wrong: 'researches, evidences, informations, advices', right: 'research, evidence, information, advice (không đếm được)' },
      { wrong: 'a large amount of vehicles', right: 'a large number of vehicles' },
      { wrong: 'One of the reason is…', right: 'One of the reasons is…' },
    ],
  },
  {
    label: 'Giới từ',
    why: 'Không suy ra được từ nghĩa, phải nhớ theo cụm. Đây là loại lỗi còn sót lại nhiều nhất ở band 7.5.',
    examples: [
      { wrong: 'research about the problem', right: 'research into the problem' },
      { wrong: 'discuss about the issue', right: 'discuss the issue (không có "about")' },
      { wrong: 'depend of', right: 'depend on' },
    ],
  },
  {
    label: 'Hợp chủ ngữ – động từ',
    why: 'Hay sai khi chủ ngữ dài, có mệnh đề chen giữa — mắt nhìn từ gần nhất thay vì nhìn chủ ngữ thật.',
    examples: [
      { wrong: 'The number of students are rising.', right: 'The number of students is rising.' },
      { wrong: 'Each of the countries have…', right: 'Each of the countries has…' },
      { wrong: 'The impact of these policies are…', right: 'The impact of these policies is…' },
    ],
  },
  {
    label: 'Thì của động từ',
    why: 'Task 1 mô tả quá khứ phải nhất quán quá khứ; Task 2 bàn chung phải nhất quán hiện tại. Trộn thì là lỗi dễ thấy.',
    examples: [
      { wrong: 'The figure rises in 1990 and then fell.', right: 'The figure rose in 1990 and then fell.' },
      { wrong: 'Since 2000, the number increased.', right: 'Since 2000, the number has increased.' },
    ],
  },
  {
    label: 'Chính tả Anh-Anh / Anh-Mỹ',
    why: 'Cả hai đều được chấp nhận, nhưng phải NHẤT QUÁN trong một bài. Trộn hai hệ bị tính là lỗi.',
    examples: [
      { wrong: 'organise … organization (trộn hai hệ)', right: 'organise … organisation (Anh-Anh) HOẶC organize … organization (Anh-Mỹ)' },
      { wrong: 'analyse / analyze trong cùng một bài', right: 'chọn một hệ và giữ suốt' },
    ],
  },
];

/* ═══════════════ TỪ NỐI THEO CHỨC NĂNG ═══════════════ */

/**
 * Xếp theo VIỆC CẦN LÀM, không xếp theo bảng chữ cái — vì lúc viết bạn biết
 * mình muốn làm gì, chứ không biết mình cần từ nào.
 *
 * Cảnh báo đi kèm: ở band 8, mạch lạc đến từ ý nối được với ý. Danh sách này
 * là lưới an toàn, không phải khuôn để dán vào đầu mỗi đoạn.
 */
export const LINKERS: { fn: string; note: string; items: string[] }[] = [
  { fn: 'Thêm ý cùng hướng', note: 'Tránh lặp "Moreover" ba lần trong một bài.', items: ['What is more', 'In addition to this', 'A further consideration is', 'Equally important'] },
  { fn: 'Nhượng bộ rồi phản biện', note: 'Khuôn ăn điểm nhất ở Task 2 — nhượng bộ phải có sức nặng thật.', items: ['There is a good deal of force in that argument, but', 'This is true up to a point', 'I would concede that … even so', 'While it is fair to say that … the difficulty is'] },
  { fn: 'Nêu hệ quả', note: '"So" quá đời thường cho bài viết học thuật.', items: ['Consequently', 'The result is that', 'This is why', 'It follows that'] },
  { fn: 'Hạn định phạm vi', note: 'Dấu hiệu tư duy band 8: khẳng định có điều kiện thay vì khẳng định chung chung.', items: ['only where', 'provided that', 'to the extent that', 'in cases where'] },
  { fn: 'Đưa ví dụ', note: 'Ví dụ cụ thể luôn mạnh hơn "many studies have shown".', items: ['A case in point is', 'This can be seen in', 'Consider the case of', 'Take … as an example'] },
  { fn: 'Đối lập', note: '', items: ['By contrast', 'On the other hand', 'Whereas', 'Conversely'] },
  { fn: 'Mô tả xu hướng (Task 1)', note: 'Bắt buộc phải đa dạng — lặp "then" bốn lần là bị trừ nặng.', items: ['rose steadily to', 'peaked at … before', 'fell back to', 'levelled off at', 'having first risen from … to'] },
];

/* ═══════════════ NGUỒN CHÍNH THỐNG ═══════════════ */

export const OFFICIAL_LINKS: { name: string; url: string; what: string }[] = [
  { name: 'Band descriptors — Speaking (PDF)', url: 'https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf', what: 'Bản gốc, miễn phí. Tài liệu quan trọng nhất của cả khoá — đọc nó trước khi mua bất cứ thứ gì.' },
  { name: 'Band descriptors & key assessment criteria — Writing', url: 'https://ielts.org/news-and-insights/ielts-writing-band-descriptors-and-key-assessment-criteria', what: 'Mô tả band Writing cộng phần giải thích chi tiết hơn mà Cambridge công bố kèm.' },
  { name: 'Cách chấm điểm IELTS', url: 'https://ielts.org/take-a-test/your-results/ielts-scoring-in-detail', what: 'Giải thích chính thức về thang điểm và cách làm tròn.' },
  { name: 'IELTS Ready — British Council', url: 'https://takeielts.britishcouncil.org/take-ielts/prepare/ielts-ready', what: 'Đề thi thử đầy đủ, khoá ngắn và webinar, miễn phí.' },
  { name: 'IELTS Prepare — IDP', url: 'https://ielts.idp.com/prepare', what: 'Khoá chuẩn bị miễn phí đi qua từng phần thi và từng dạng câu hỏi.' },
  { name: 'Write & Improve — Cambridge', url: 'https://www.cambridgeenglish.org/learning-english/free-resources/write-and-improve/', what: 'Chấm bài viết miễn phí theo thang CEFR, có sẵn đề IELTS. Nguồn phản hồi miễn phí tốt nhất hiện có.' },
];
