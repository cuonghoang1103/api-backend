/**
 * Cẩm nang 15 dạng câu hỏi — phần LÕI của chặng 2.
 *
 * Lộ trình ghi rõ việc quan trọng nhất chặng này là "học DẠNG câu hỏi trước
 * khi luyện tốc độ". Lý do rất thực tế: người học chặng 2 làm sai không phải
 * vì kém tiếng Anh mà vì không biết dạng đó đòi hỏi gì. Làm thêm mười đề nữa
 * vẫn sai y hệt, chỉ tốn thời gian và mất nhuệ khí.
 *
 * Cách dùng đúng: đọc hết một lượt để biết có những dạng nào, rồi MỖI TUẦN
 * luyện kỹ MỘT dạng. Học dàn trải cả 15 dạng cùng lúc thì không dạng nào chắc.
 *
 * Mọi ví dụ trong file đều tự viết, không trích đề thật (bản quyền).
 */
import type { QuestionTypeGuide } from '../types';

export const QUESTION_TYPES: QuestionTypeGuide[] = [
  /* ═══════════════════ NGHE ═══════════════════ */
  {
    id: 'l-form',
    skill: 'Nghe',
    name: 'Form / Note / Table / Flow-chart Completion',
    nameVi: 'Điền vào phiếu, ghi chú, bảng, sơ đồ',
    looks:
      'Một phiếu đăng ký, một tờ ghi chú hoặc một bảng có sẵn chữ, chừa chỗ trống đánh số. Bạn nghe rồi '
      + 'điền vào. Đề luôn ghi giới hạn số từ, ví dụ "NO MORE THAN TWO WORDS AND/OR A NUMBER".',
    frequency: 'Chiếm phần lớn Section 1, và hay gặp lại ở Section 4.',
    hard: 1,
    steps: [
      'Đọc giới hạn số từ TRƯỚC TIÊN và khoanh tròn nó. Viết quá giới hạn là 0 điểm dù ý đúng.',
      'Nhìn từng chỗ trống, đoán LOẠI thông tin sắp nghe: tên riêng? số? ngày tháng? giá tiền? danh từ?',
      'Gạch chân từ đứng ngay TRƯỚC và SAU chỗ trống — đó là mốc để biết đáp án sắp tới.',
      'Nghe và viết NGAY, viết tắt cũng được, chép lại cho đẹp sau.',
      'Cuối giờ soát: đúng chính tả chưa, số ít hay số nhiều, có vượt giới hạn từ không.',
    ],
    traps: [
      'Viết quá số từ cho phép. Đây là lỗi mất điểm oan phổ biến nhất của cả bài thi.',
      'Đơn vị đã in sẵn trong phiếu (£, kg, minutes) mà vẫn viết lại → thành thừa từ.',
      'Người nói SỬA LẠI thông tin: "It is on Tuesday… sorry, Wednesday." Đáp án là cái sau cùng.',
      'Sai chính tả tên riêng dù đã được đánh vần. Chép từng chữ cái ngay lúc nghe, đừng nhớ rồi viết sau.',
    ],
    example: {
      q: 'Nghe: "The deposit is one hundred and fifty pounds." — Phiếu ghi: Deposit: £__________',
      answer: '150',
      why:
        'Ô đã có sẵn ký hiệu £ nên chỉ viết con số. Viết "150 pounds" là thừa từ và có thể bị tính sai.',
    },
  },
  {
    id: 'l-mcq',
    skill: 'Nghe',
    name: 'Multiple Choice',
    nameVi: 'Trắc nghiệm',
    looks:
      'Một câu hỏi kèm ba lựa chọn A, B, C — chọn một. Có biến thể khó hơn: cho 5–7 lựa chọn và bắt chọn '
      + 'HAI hoặc BA đáp án.',
    frequency: 'Hay gặp ở Section 2 và Section 3.',
    hard: 3,
    steps: [
      'Đọc trước câu hỏi và cả ba lựa chọn trong lúc băng đọc phần hướng dẫn.',
      'Gạch chân từ KHÁC NHAU giữa ba lựa chọn — thường chúng chỉ khác nhau một chi tiết nhỏ.',
      'Nghe cả đoạn rồi mới chọn. Cả ba lựa chọn thường đều được NHẮC TỚI trong bài.',
      'Loại dần: nghe thấy phương án nào bị phủ định thì gạch bỏ ngay trên giấy.',
    ],
    traps: [
      'Cả ba phương án đều xuất hiện trong bài nghe — nghe thấy từ giống là chọn luôn thì sai chắc.',
      'Đáp án hay nằm SAU một từ đảo hướng: however, actually, but, in fact, on second thoughts.',
      'Dạng chọn nhiều đáp án: chọn thiếu hoặc thừa đều bị tính sai cả câu.',
      'Mải phân vân câu này nên trôi mất câu sau. Chọn tạm rồi bám theo bài, quay lại sau.',
    ],
    example: {
      q: 'Nghe: "I was going to study biology, but in the end I chose chemistry." — Người nói học ngành gì?',
      answer: 'Chemistry',
      why:
        '"was going to" là dự định CŨ, "but in the end" đảo hướng sang quyết định thật. Nghe thấy "biology" '
        + 'mà chọn luôn là rơi đúng bẫy.',
    },
  },
  {
    id: 'l-matching',
    skill: 'Nghe',
    name: 'Matching',
    nameVi: 'Nối thông tin',
    looks:
      'Một danh sách đánh số (tên người, địa điểm, đồ vật) và một hộp lựa chọn A–F. Nối mỗi mục với một '
      + 'lựa chọn. Lựa chọn có thể dùng nhiều lần hoặc không dùng đến.',
    frequency: 'Thường ở Section 2 hoặc Section 3.',
    hard: 2,
    steps: [
      'Đọc hộp lựa chọn TRƯỚC và hiểu rõ từng lựa chọn khác nhau chỗ nào.',
      'Đọc danh sách các mục — chúng xuất hiện trong bài nghe ĐÚNG THỨ TỰ như trên đề.',
      'Nghe và ghi chữ cái ngay cạnh mục tương ứng. Không kịp thì ghi vài chữ nghe được rồi đối chiếu sau.',
      'Kiểm xem đề có nói lựa chọn được dùng nhiều lần không — quyết định cách loại trừ.',
    ],
    traps: [
      'Tưởng mỗi lựa chọn chỉ dùng một lần rồi loại trừ sai. Phải đọc kỹ hướng dẫn.',
      'Bài nghe diễn đạt lại (paraphrase) chứ không dùng đúng từ trong hộp lựa chọn.',
      'Lỡ một mục rồi cố nhớ lại, kết quả trôi luôn hai mục sau. Bỏ và bám tiếp.',
    ],
  },
  {
    id: 'l-map',
    skill: 'Nghe',
    name: 'Plan / Map / Diagram Labelling',
    nameVi: 'Điền nhãn lên bản đồ, sơ đồ',
    looks:
      'Một bản đồ khu vực, sơ đồ toà nhà hoặc hình vẽ một vật, có các vị trí đánh số hoặc để trống. Nghe '
      + 'chỉ dẫn rồi điền tên vào đúng vị trí.',
    frequency: 'Gần như luôn có ở Section 2.',
    hard: 3,
    steps: [
      'Tìm điểm XUẤT PHÁT trên bản đồ (thường ghi "you are here", lối vào, hoặc cổng chính).',
      'Xác định hướng: đâu là trên/dưới, trái/phải so với điểm xuất phát.',
      'Đọc trước tên các địa điểm cần điền để biết sắp nghe những từ nào.',
      'Nghe và DI NGÓN TAY trên bản đồ theo lời chỉ dẫn. Đây là mẹo quan trọng nhất của dạng này.',
      'Ghi nhãn ngay khi nghe ra, đừng chờ nghe hết rồi mới điền.',
    ],
    traps: [
      'Không thuộc bộ giới từ chỉ hướng thì nghe hiểu vẫn không điền được: opposite, next to, behind, '
      + 'in front of, between, at the end of, on your left, take the second turning.',
      'Nghe "turn left" rồi mặc định mọi thứ sau đó đều ở bên trái. Mỗi mốc là một hướng riêng.',
      'Người nói đổi ý: "It is next to the café — no, sorry, behind it." Lấy thông tin sau cùng.',
      'Quên rằng hướng được mô tả theo góc nhìn NGƯỜI ĐI, không phải theo bản đồ nhìn từ trên.',
    ],
    example: {
      q: 'Nghe: "Go past the library and the café is at the end of the corridor, opposite the lift."',
      answer: 'Quán cà phê ở cuối hành lang, đối diện thang máy',
      why:
        'Ba giới từ trong một câu: past (đi qua), at the end of (ở cuối), opposite (đối diện). Thiếu một cái '
        + 'là điền sai vị trí.',
    },
  },
  {
    id: 'l-sentence',
    skill: 'Nghe',
    name: 'Sentence Completion',
    nameVi: 'Hoàn thành câu',
    looks:
      'Những câu chưa hoàn chỉnh, mỗi câu chừa một chỗ trống. Khác với Form Completion ở chỗ đây là CÂU '
      + 'hoàn chỉnh về ngữ pháp, nên từ điền vào phải vừa đúng nghĩa vừa đúng ngữ pháp.',
    frequency: 'Hay gặp ở Section 4 (bài giảng học thuật).',
    hard: 2,
    steps: [
      'Đọc cả câu và đoán LOẠI TỪ cần điền: danh từ? động từ? tính từ? số nhiều hay số ít?',
      'Gạch chân từ khoá quanh chỗ trống để biết khi nào đáp án sắp tới.',
      'Nghe và điền. Từ điền phải làm câu đúng ngữ pháp — đây là điểm khác Form Completion.',
      'Soát lại: đọc cả câu đã điền xem có xuôi không.',
    ],
    traps: [
      'Điền từ đúng nghĩa nhưng sai dạng ngữ pháp (điền danh từ vào chỗ cần tính từ) → sai.',
      'Section 4 nói LIÊN TỤC không nghỉ, không có hội thoại để bám. Lỡ là mất luôn.',
      'Bài nghe dùng từ đồng nghĩa với từ trong câu đề, không lặp lại y nguyên.',
    ],
  },
  {
    id: 'l-short',
    skill: 'Nghe',
    name: 'Short-answer Questions',
    nameVi: 'Trả lời ngắn',
    looks:
      'Câu hỏi trực tiếp (What…? Where…? How many…?), trả lời bằng vài từ lấy từ bài nghe. Luôn có giới '
      + 'hạn số từ.',
    frequency: 'Ít gặp hơn các dạng trên, rải rác ở mọi section.',
    hard: 1,
    steps: [
      'Đọc từ hỏi và xác định loại thông tin: What (vật), Where (nơi), When (thời gian), How many (số).',
      'Kiểm giới hạn số từ.',
      'Nghe và ghi đúng cụm từ trong bài, không diễn đạt lại bằng lời mình.',
    ],
    traps: [
      'Trả lời bằng câu đầy đủ → vượt giới hạn từ.',
      'Diễn đạt lại bằng từ của mình thay vì chép từ trong bài.',
      'Bỏ sót từ hỏi nên trả lời nhầm loại thông tin (hỏi ở đâu mà trả lời khi nào).',
    ],
  },

  /* ═══════════════════ ĐỌC ═══════════════════ */
  {
    id: 'r-tfng',
    skill: 'Đọc',
    name: 'True / False / Not Given',
    nameVi: 'Đúng / Sai / Không đề cập',
    looks:
      'Các câu khẳng định về THÔNG TIN trong bài. Bạn quyết định câu đó đúng với bài, trái với bài, hay '
      + 'bài không nhắc tới.',
    frequency: 'Rất hay gặp, thường 5–7 câu. Xuất hiện ở cả ba passage.',
    hard: 3,
    steps: [
      'Đọc câu hỏi, gạch chân từ khoá dễ quét: tên riêng, số, năm, từ viết hoa.',
      'Quét bài tìm đúng chỗ chứa thông tin đó. Câu hỏi đi ĐÚNG THỨ TỰ của bài nên dò từ trên xuống.',
      'Đọc kỹ câu trong bài, so từng chi tiết với câu hỏi.',
      'Hỏi theo thứ tự: bài có nhắc tới chuyện này không? KHÔNG → NOT GIVEN. CÓ → xuôi là TRUE, ngược là FALSE.',
    ],
    traps: [
      'Lẫn FALSE với NOT GIVEN. Quy tắc cứng: FALSE = bài nói NGƯỢC LẠI; NOT GIVEN = bài KHÔNG NHẮC TỚI.',
      'Bẫy so sánh: bài nhắc tên cả hai thứ nhưng không so sánh chúng → NOT GIVEN, dù bạn thấy "hợp lý".',
      'Từ tuyệt đối trong câu hỏi (all, only, always, never, the first) gần như luôn là dấu hiệu bẫy.',
      'Dùng kiến thức đời thường để suy. Chỉ được căn cứ vào BÀI, không căn cứ vào cái bạn biết.',
      'Viết tắt T/F/NG khi đề yêu cầu viết đủ chữ → có nơi chấm là sai. Cứ viết đủ TRUE/FALSE/NOT GIVEN.',
    ],
    example: {
      q: 'Bài: "Copenhagen and Amsterdam are both famous for their cycle lanes." — Câu hỏi: "Copenhagen has more cycle lanes than Amsterdam."',
      answer: 'NOT GIVEN',
      why:
        'Bài nhắc tên cả hai nhưng KHÔNG so sánh cái nào nhiều hơn. Thấy đủ hai tên rồi tưởng có thông tin '
        + 'là rơi đúng bẫy kinh điển của dạng này.',
    },
  },
  {
    id: 'r-ynng',
    skill: 'Đọc',
    name: 'Yes / No / Not Given',
    nameVi: 'Có / Không / Không đề cập',
    looks:
      'Nhìn giống True/False/Not Given nhưng hỏi về QUAN ĐIỂM của tác giả, không phải về thông tin thực tế.',
    frequency: 'Gặp ở các bài có tính tranh luận, nêu ý kiến.',
    hard: 3,
    steps: [
      'Xác định rõ đây là dạng hỏi Ý KIẾN — trả lời YES/NO chứ không phải TRUE/FALSE.',
      'Tìm chỗ tác giả bộc lộ quan điểm: các từ như argue, claim, believe, unfortunately, clearly, surprisingly.',
      'So quan điểm trong câu hỏi với quan điểm của tác giả.',
      'Tác giả không bày tỏ quan điểm về chuyện đó → NOT GIVEN.',
    ],
    traps: [
      'Viết TRUE/FALSE trong khi đề hỏi YES/NO → sai dù hiểu đúng bài.',
      'Nhầm quan điểm của NGƯỜI KHÁC được trích trong bài với quan điểm của TÁC GIẢ.',
      'Câu "Supporters argue…" và "Critics reply…" là quan điểm của phe khác, không phải của tác giả.',
    ],
  },
  {
    id: 'r-headings',
    skill: 'Đọc',
    name: 'Matching Headings',
    nameVi: 'Chọn tiêu đề cho đoạn',
    looks:
      'Một danh sách tiêu đề đánh số La Mã (i, ii, iii…), nhiều hơn số đoạn. Chọn tiêu đề đúng cho từng đoạn.',
    frequency: 'Thường đứng ĐẦU phần câu hỏi của một passage.',
    hard: 3,
    steps: [
      'LÀM DẠNG NÀY SAU CÙNG, dù nó in ở đầu. Lúc đó bạn đã đọc kỹ bài nên chọn nhanh hơn nhiều.',
      'Đọc câu ĐẦU và câu CUỐI mỗi đoạn — ý chính thường nằm ở đó.',
      'Hỏi: cả đoạn nói về cái gì? Không phải: đoạn có chứa từ nào giống tiêu đề.',
      'Chọn xong thì gạch tiêu đề đó khỏi danh sách để khỏi dùng lại.',
      'Còn phân vân giữa hai tiêu đề thì chọn cái bao được CẢ đoạn, không phải cái đúng với một câu.',
    ],
    traps: [
      'Chọn theo từ trùng lặp. Tiêu đề sai thường cố tình chứa một từ có trong đoạn.',
      'Chọn tiêu đề đúng với MỘT CÂU trong đoạn thay vì đúng với cả đoạn.',
      'Số tiêu đề luôn NHIỀU HƠN số đoạn — có tiêu đề thừa, đừng cố dùng hết.',
      'Làm dạng này trước rồi mất 20 phút mà chưa trả lời được câu nào.',
    ],
  },
  {
    id: 'r-info',
    skill: 'Đọc',
    name: 'Matching Information',
    nameVi: 'Đoạn nào chứa thông tin này',
    looks:
      'Các câu mô tả một thông tin, hỏi thông tin đó nằm ở đoạn nào (A, B, C…). Đoạn có thể được chọn nhiều lần.',
    frequency: '4–6 câu, hay gặp ở passage 2 và 3.',
    hard: 3,
    steps: [
      'Đọc hết các câu hỏi trước để biết mình đang đi tìm những gì.',
      'Quét từng đoạn một, mỗi lần quét thì soát cùng lúc mọi câu hỏi còn lại.',
      'Chú ý các dấu hiệu dễ quét: ví dụ cụ thể, con số, tên riêng, năm, so sánh.',
      'Làm câu dễ trước (câu có tên riêng hoặc số), để lại câu trừu tượng sau cùng.',
    ],
    traps: [
      'Câu hỏi KHÔNG theo thứ tự của bài — khác hẳn dạng True/False/Not Given.',
      'Một đoạn có thể là đáp án của nhiều câu, đừng loại nó sau khi dùng một lần.',
      'Đây là dạng ngốn thời gian nhất. Đặt hạn cho mình, quá thì đoán rồi đi tiếp.',
    ],
  },
  {
    id: 'r-features',
    skill: 'Đọc',
    name: 'Matching Features',
    nameVi: 'Nối phát biểu với người / vật',
    looks:
      'Danh sách phát biểu và một hộp tên người (nhà nghiên cứu, chuyên gia) hoặc tên vật/nơi. Nối phát '
      + 'biểu với đúng tên.',
    frequency: 'Hay gặp ở bài có trích dẫn nhiều nhà nghiên cứu.',
    hard: 2,
    steps: [
      'Quét bài khoanh tròn TẤT CẢ tên riêng trong hộp lựa chọn — tên viết hoa nên rất dễ tìm.',
      'Đọc kỹ phần bài viết quanh mỗi tên đó.',
      'Nối phát biểu với tên. Chú ý bài diễn đạt lại chứ không dùng đúng từ trong phát biểu.',
      'Kiểm xem đề có cho phép dùng một tên nhiều lần không.',
    ],
    traps: [
      'Hai nhà nghiên cứu có quan điểm gần giống nhau — phải đọc kỹ chi tiết khác biệt.',
      'Bài viết: "Unlike Smith, Jones argued that…" — câu này cho biết quan điểm của CẢ HAI, ngược nhau.',
      'Câu hỏi không theo thứ tự bài.',
    ],
  },
  {
    id: 'r-sentence',
    skill: 'Đọc',
    name: 'Sentence Completion',
    nameVi: 'Hoàn thành câu',
    looks:
      'Câu chưa hoàn chỉnh, điền từ LẤY TỪ BÀI vào chỗ trống. Luôn có giới hạn số từ.',
    frequency: 'Rất hay gặp, mọi passage.',
    hard: 1,
    steps: [
      'Đọc giới hạn số từ và khoanh lại.',
      'Đoán loại từ cần điền dựa vào ngữ pháp của câu.',
      'Quét tìm chỗ tương ứng trong bài (câu hỏi theo đúng thứ tự bài).',
      'Chép NGUYÊN VĂN từ trong bài, giữ nguyên số ít/số nhiều.',
    ],
    traps: [
      'Đổi từ trong bài sang từ đồng nghĩa của mình → sai, dù nghĩa đúng.',
      'Đổi dạng từ (thêm -s, đổi thì) → sai.',
      'Vượt giới hạn số từ.',
    ],
    example: {
      q: 'Bài: "Separated lanes, with a physical barrier, work much better." — Đề: "Cycle lanes with a physical __________ protect riders better."',
      answer: 'barrier',
      why:
        'Chép đúng từ trong bài. Viết "wall" hay "fence" tuy nghĩa gần vẫn bị tính sai vì dạng này bắt lấy '
        + 'nguyên văn.',
    },
  },
  {
    id: 'r-summary',
    skill: 'Đọc',
    name: 'Summary / Note / Table Completion',
    nameVi: 'Điền vào đoạn tóm tắt, ghi chú, bảng',
    looks:
      'Một đoạn tóm tắt lại một phần của bài, chừa chỗ trống. Có hai kiểu: điền từ lấy từ bài, hoặc chọn '
      + 'từ trong một hộp cho sẵn.',
    frequency: 'Rất hay gặp.',
    hard: 2,
    steps: [
      'Đọc cả đoạn tóm tắt MỘT LƯỢT trước khi điền, để nắm ý chung.',
      'Xác định đoạn tóm tắt này ứng với phần nào của bài — thường chỉ gói gọn một hai đoạn.',
      'Đoán loại từ cho từng chỗ trống.',
      'Có hộp từ cho sẵn thì loại dần: hộp luôn có nhiều từ hơn số chỗ trống.',
    ],
    traps: [
      'Kiểu có hộp từ: từ trong hộp ĐÃ ĐƯỢC ĐỔI so với bài, nên đừng tìm từ giống hệt.',
      'Kiểu không có hộp: phải chép nguyên văn, không được đổi từ.',
      'Đoạn tóm tắt dùng cấu trúc khác bài gốc — bám nghĩa, đừng bám hình thức câu.',
    ],
  },
  {
    id: 'r-mcq',
    skill: 'Đọc',
    name: 'Multiple Choice',
    nameVi: 'Trắc nghiệm',
    looks: 'Câu hỏi kèm bốn lựa chọn A–D, chọn một. Có biến thể chọn hai trong năm.',
    frequency: 'Hay gặp, thường ở cuối phần câu hỏi của một passage.',
    hard: 2,
    steps: [
      'Đọc câu hỏi TRƯỚC KHI đọc các lựa chọn — tránh bị lựa chọn dẫn dắt.',
      'Tìm chỗ tương ứng trong bài, đọc kỹ cả đoạn quanh đó.',
      'Tự trả lời trong đầu, rồi mới xem lựa chọn nào khớp.',
      'Loại từng phương án và ghi lý do loại ra bên cạnh.',
    ],
    traps: [
      'Phương án "đúng ngoài đời nhưng bài không nói" — đây là bẫy chiếm phần lớn lỗi sai.',
      'Phương án đúng một nửa: nửa đầu khớp bài, nửa sau sai một chi tiết.',
      'Phương án dùng lại nhiều từ giống hệt trong bài thường là bẫy; đáp án thật hay được diễn đạt lại.',
    ],
  },
  {
    id: 'r-diagram',
    skill: 'Đọc',
    name: 'Diagram Label Completion',
    nameVi: 'Điền nhãn vào hình vẽ',
    looks:
      'Một hình vẽ (bộ phận máy móc, cấu tạo sinh vật, quy trình) có các phần để trống. Điền từ lấy từ bài.',
    frequency: 'Ít gặp hơn, thường ở bài mô tả quy trình hoặc cấu tạo.',
    hard: 2,
    steps: [
      'Tìm phần bài mô tả đúng hình đó — thường gói trong một hai đoạn.',
      'Xác định hình được mô tả theo thứ tự nào: từ trên xuống, từ trái sang, hay theo dòng chảy.',
      'Điền từ nguyên văn, giữ giới hạn số từ.',
    ],
    traps: [
      'Bài mô tả theo thứ tự khác với thứ tự đánh số trên hình.',
      'Nhầm tên bộ phận với chức năng của nó.',
    ],
  },
];

/** Chiến lược làm bài chung, đọc trước khi vào từng dạng. */
export const STRATEGY_NOTES: { title: string; body: string }[] = [
  {
    title: 'Thứ tự làm bài Reading: KHÔNG làm từ trên xuống',
    body:
      'Làm trước các dạng có câu hỏi đi theo thứ tự bài và dễ quét (Sentence Completion, True/False/Not '
      + 'Given). Để sau các dạng ngốn thời gian và không theo thứ tự (Matching Information, Matching '
      + 'Headings). Làm đúng thứ tự in trên đề là cách chắc chắn hết giờ.',
  },
  {
    title: 'Phân bổ thời gian Reading: 17 – 20 – 23 phút',
    body:
      'Passage 1 dễ nhất nên chỉ dùng 17 phút, passage 3 khó nhất được 23 phút. Chia đều 20 phút mỗi bài '
      + 'là sai lầm phổ biến: bạn sẽ tiêu quá nhiều cho bài dễ rồi không đủ giờ cho bài khó.',
  },
  {
    title: 'Reading KHÔNG có thời gian chép đáp án',
    body:
      'Khác Listening, Reading không cho thêm 10 phút chép sang phiếu. Phải viết đáp án vào phiếu NGAY khi '
      + 'làm xong từng câu. Rất nhiều người mất cả chục điểm chỉ vì để dành việc chép tới cuối.',
  },
  {
    title: 'Listening: đọc trước câu hỏi trong lúc băng đọc hướng dẫn',
    body:
      'Phần hướng dẫn đầu mỗi section luôn giống nhau và không chứa thông tin gì. Dùng khoảng thời gian đó '
      + 'để đọc trước câu hỏi của section kế tiếp — đây là mẹo ăn điểm nhiều nhất ở Listening.',
  },
  {
    title: 'Lỡ một câu thì BỎ LUÔN câu đó',
    body:
      'Bài nghe chỉ phát một lần và không chờ ai. Cố nhớ lại câu đã lỡ là mất thêm hai câu sau. Đánh dấu '
      + 'câu đó rồi bám tiếp; cuối giờ quay lại đoán.',
  },
  {
    title: 'Không bỏ trống câu nào',
    body:
      'Listening và Reading KHÔNG trừ điểm câu sai. Câu nào không biết cũng phải viết một đáp án hợp lý. '
      + 'Với True/False/Not Given, đoán bừa vẫn có 1/3 cơ hội đúng.',
  },
  {
    title: 'Đọc lướt để hiểu bố cục, không đọc từng chữ',
    body:
      'Ở chặng này bạn không đủ thời gian đọc kỹ cả bài. Đọc câu đầu mỗi đoạn để biết đoạn đó nói gì, rồi '
      + 'quay lại quét tìm khi làm câu hỏi. Kỹ năng này gọi là skimming và scanning.',
  },
  {
    title: 'Mỗi tuần chỉ luyện kỹ MỘT dạng',
    body:
      'Học dàn trải cả 15 dạng trong một tuần thì không dạng nào chắc. Chọn một dạng, đọc kỹ phần hướng '
      + 'dẫn ở đây, làm 3–4 bài của riêng dạng đó, ghi lại lỗi mình mắc, rồi tuần sau mới sang dạng khác.',
  },
];
