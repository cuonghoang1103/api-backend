/**
 * PHẦN 2 — Tiếng Anh cho lập trình viên.
 *
 * Dựng trên lộ trình gốc ENGLISH_LEARNING_ROADMAP_FOR_DEV, nhưng viết lại
 * theo hướng DÙNG ĐƯỢC NGAY: thay vì mô tả "tuần 21–36 học phỏng vấn", ở đây
 * là câu chữ cụ thể để đọc lên trong buổi phỏng vấn, trong buổi họp với khách,
 * và trong lúc quay video khoá học.
 *
 * Thứ tự các khối theo đúng ba việc người học đặt ra: (1) trao đổi công việc
 * với khách, (2) phỏng vấn, (3) quay video nói tiếng Anh 100%.
 */

export interface DevPhrase {
  en: string;
  vi: string;
  note?: string;
}

/** Một khối mẫu câu theo tình huống. */
export interface DevSection {
  id: string;
  icon: string;
  title: string;
  intro: string;
  groups: { label: string; phrases: DevPhrase[] }[];
}

/** Từ vựng kỹ thuật theo chủ đề. */
export interface TechVocabGroup {
  key: string;
  name: string;
  icon: string;
  words: { en: string; ipa: string; vi: string }[];
}

/* ═══════════════ TỪ VỰNG KỸ THUẬT ═══════════════ */

export const TECH_VOCAB: TechVocabGroup[] = [
  {
    key: 'basics',
    name: 'Lập trình cơ bản',
    icon: '⌨️',
    words: [
      { en: 'variable', ipa: '/ˈveəriəbl/', vi: 'biến' },
      { en: 'function', ipa: '/ˈfʌŋkʃn/', vi: 'hàm' },
      { en: 'parameter', ipa: '/pəˈræmɪtər/', vi: 'tham số (khai báo)' },
      { en: 'argument', ipa: '/ˈɑːɡjumənt/', vi: 'đối số (truyền vào)' },
      { en: 'return value', ipa: '/rɪˈtɜːn ˈvæljuː/', vi: 'giá trị trả về' },
      { en: 'loop', ipa: '/luːp/', vi: 'vòng lặp' },
      { en: 'array', ipa: '/əˈreɪ/', vi: 'mảng' },
      { en: 'string', ipa: '/strɪŋ/', vi: 'chuỗi' },
      { en: 'boolean', ipa: '/ˈbuːliən/', vi: 'kiểu đúng/sai' },
      { en: 'statement', ipa: '/ˈsteɪtmənt/', vi: 'câu lệnh' },
      { en: 'condition', ipa: '/kənˈdɪʃn/', vi: 'điều kiện' },
      { en: 'recursion', ipa: '/rɪˈkɜːʃn/', vi: 'đệ quy' },
      { en: 'exception', ipa: '/ɪkˈsepʃn/', vi: 'ngoại lệ' },
      { en: 'throw an error', ipa: '/θrəʊ ən ˈerər/', vi: 'ném lỗi' },
      { en: 'edge case', ipa: '/edʒ keɪs/', vi: 'trường hợp biên' },
      { en: 'refactor', ipa: '/ˌriːˈfæktər/', vi: 'tái cấu trúc mã' },
    ],
  },
  {
    key: 'oop',
    name: 'Hướng đối tượng & mẫu thiết kế',
    icon: '🧩',
    words: [
      { en: 'class', ipa: '/klɑːs/', vi: 'lớp' },
      { en: 'object', ipa: '/ˈɒbdʒekt/', vi: 'đối tượng' },
      { en: 'instance', ipa: '/ˈɪnstəns/', vi: 'thể hiện' },
      { en: 'inheritance', ipa: '/ɪnˈherɪtəns/', vi: 'kế thừa' },
      { en: 'polymorphism', ipa: '/ˌpɒliˈmɔːfɪzəm/', vi: 'đa hình' },
      { en: 'encapsulation', ipa: '/ɪnˌkæpsjuˈleɪʃn/', vi: 'đóng gói' },
      { en: 'abstraction', ipa: '/æbˈstrækʃn/', vi: 'trừu tượng hoá' },
      { en: 'interface', ipa: '/ˈɪntəfeɪs/', vi: 'giao diện (hợp đồng)' },
      { en: 'dependency injection', ipa: '/dɪˈpendənsi ɪnˈdʒekʃn/', vi: 'tiêm phụ thuộc' },
      { en: 'singleton', ipa: '/ˈsɪŋɡltən/', vi: 'mẫu đơn thể' },
      { en: 'coupling', ipa: '/ˈkʌplɪŋ/', vi: 'độ phụ thuộc lẫn nhau' },
      { en: 'maintainable', ipa: '/meɪnˈteɪnəbl/', vi: 'dễ bảo trì' },
    ],
  },
  {
    key: 'db',
    name: 'Cơ sở dữ liệu & SQL',
    icon: '🗄️',
    words: [
      { en: 'query', ipa: '/ˈkwɪəri/', vi: 'truy vấn' },
      { en: 'schema', ipa: '/ˈskiːmə/', vi: 'lược đồ' },
      { en: 'index', ipa: '/ˈɪndeks/', vi: 'chỉ mục' },
      { en: 'join', ipa: '/dʒɔɪn/', vi: 'phép nối bảng' },
      { en: 'foreign key', ipa: '/ˈfɒrən kiː/', vi: 'khoá ngoại' },
      { en: 'transaction', ipa: '/trænˈzækʃn/', vi: 'giao dịch' },
      { en: 'rollback', ipa: '/ˈrəʊlbæk/', vi: 'hoàn tác' },
      { en: 'migration', ipa: '/maɪˈɡreɪʃn/', vi: 'di trú lược đồ' },
      { en: 'normalization', ipa: '/ˌnɔːməlaɪˈzeɪʃn/', vi: 'chuẩn hoá' },
      { en: 'deadlock', ipa: '/ˈdedlɒk/', vi: 'khoá chết' },
      { en: 'replication', ipa: '/ˌreplɪˈkeɪʃn/', vi: 'nhân bản dữ liệu' },
      { en: 'backup', ipa: '/ˈbækʌp/', vi: 'sao lưu' },
    ],
  },
  {
    key: 'web',
    name: 'Web & API',
    icon: '🌐',
    words: [
      { en: 'endpoint', ipa: '/ˈendpɔɪnt/', vi: 'điểm cuối API' },
      { en: 'request', ipa: '/rɪˈkwest/', vi: 'yêu cầu' },
      { en: 'response', ipa: '/rɪˈspɒns/', vi: 'phản hồi' },
      { en: 'payload', ipa: '/ˈpeɪləʊd/', vi: 'dữ liệu gửi kèm' },
      { en: 'authentication', ipa: '/ɔːˌθentɪˈkeɪʃn/', vi: 'xác thực (bạn là ai)' },
      { en: 'authorization', ipa: '/ˌɔːθəraɪˈzeɪʃn/', vi: 'phân quyền (được làm gì)' },
      { en: 'token', ipa: '/ˈtəʊkən/', vi: 'mã thông hành' },
      { en: 'middleware', ipa: '/ˈmɪdlweər/', vi: 'lớp trung gian' },
      { en: 'rate limit', ipa: '/reɪt ˈlɪmɪt/', vi: 'giới hạn tần suất' },
      { en: 'caching', ipa: '/ˈkæʃɪŋ/', vi: 'lưu đệm' },
      { en: 'latency', ipa: '/ˈleɪtənsi/', vi: 'độ trễ' },
      { en: 'timeout', ipa: '/ˈtaɪmaʊt/', vi: 'hết thời gian chờ' },
    ],
  },
  {
    key: 'devops',
    name: 'DevOps & vận hành',
    icon: '🚀',
    words: [
      { en: 'deploy', ipa: '/dɪˈplɔɪ/', vi: 'triển khai' },
      { en: 'rollback', ipa: '/ˈrəʊlbæk/', vi: 'quay về bản cũ' },
      { en: 'container', ipa: '/kənˈteɪnər/', vi: 'vùng chứa' },
      { en: 'image', ipa: '/ˈɪmɪdʒ/', vi: 'ảnh máy (Docker)' },
      { en: 'pipeline', ipa: '/ˈpaɪplaɪn/', vi: 'quy trình tự động' },
      { en: 'staging', ipa: '/ˈsteɪdʒɪŋ/', vi: 'môi trường thử' },
      { en: 'production', ipa: '/prəˈdʌkʃn/', vi: 'môi trường thật' },
      { en: 'downtime', ipa: '/ˈdaʊntaɪm/', vi: 'thời gian ngừng hoạt động' },
      { en: 'monitoring', ipa: '/ˈmɒnɪtərɪŋ/', vi: 'giám sát' },
      { en: 'scale up / out', ipa: '/skeɪl ʌp/', vi: 'mở rộng theo chiều dọc/ngang' },
      { en: 'load balancer', ipa: '/ləʊd ˈbælənsər/', vi: 'bộ cân bằng tải' },
      { en: 'incident', ipa: '/ˈɪnsɪdənt/', vi: 'sự cố' },
    ],
  },
  {
    key: 'work',
    name: 'Nghề nghiệp & quy trình',
    icon: '📋',
    words: [
      { en: 'requirement', ipa: '/rɪˈkwaɪəmənt/', vi: 'yêu cầu' },
      { en: 'scope', ipa: '/skəʊp/', vi: 'phạm vi công việc' },
      { en: 'estimate', ipa: '/ˈestɪmət/', vi: 'ước lượng thời gian' },
      { en: 'sprint', ipa: '/sprɪnt/', vi: 'chu kỳ làm việc ngắn' },
      { en: 'backlog', ipa: '/ˈbæklɒɡ/', vi: 'danh sách việc tồn' },
      { en: 'code review', ipa: '/kəʊd rɪˈvjuː/', vi: 'duyệt mã' },
      { en: 'merge', ipa: '/mɜːdʒ/', vi: 'gộp nhánh' },
      { en: 'trade-off', ipa: '/ˈtreɪd ɒf/', vi: 'sự đánh đổi' },
      { en: 'technical debt', ipa: '/ˈteknɪkl det/', vi: 'nợ kỹ thuật' },
      { en: 'stakeholder', ipa: '/ˈsteɪkhəʊldər/', vi: 'bên liên quan' },
      { en: 'handover', ipa: '/ˈhændəʊvər/', vi: 'bàn giao' },
      { en: 'onboarding', ipa: '/ˈɒnbɔːdɪŋ/', vi: 'quá trình hoà nhập việc mới' },
    ],
  },
];

/* ═══════════════ MẪU CÂU THEO TÌNH HUỐNG ═══════════════ */

export const DEV_SECTIONS: DevSection[] = [
  {
    id: 'client',
    icon: '🤝',
    title: 'Trao đổi với khách hàng',
    intro:
      'Bộ câu cho họp online và email với khách nước ngoài. Nguyên tắc xuyên suốt: nói rõ tình '
      + 'trạng, báo xấu SỚM, và luôn chốt bước tiếp theo trước khi kết thúc.',
    groups: [
      {
        label: 'Mở đầu buổi họp',
        phrases: [
          { en: 'Hi everyone, thanks for joining. Can you hear me okay?', vi: 'Chào mọi người, cảm ơn đã tham gia. Mọi người nghe tôi rõ chứ?' },
          { en: 'Let me share my screen.', vi: 'Để tôi chia sẻ màn hình.' },
          { en: 'Today I’d like to walk you through the progress and then discuss next steps.', vi: 'Hôm nay tôi muốn trình bày tiến độ rồi bàn các bước tiếp theo.', note: '"walk you through" = dẫn bạn đi qua từng phần. Rất chuyên nghiệp.' },
        ],
      },
      {
        label: 'Báo cáo tiến độ',
        phrases: [
          { en: 'We’ve completed the login and payment modules.', vi: 'Chúng tôi đã hoàn thành phần đăng nhập và thanh toán.' },
          { en: 'We’re currently working on the reporting feature.', vi: 'Hiện chúng tôi đang làm tính năng báo cáo.' },
          { en: 'We’re on track to deliver by the end of the month.', vi: 'Chúng tôi đúng tiến độ để bàn giao cuối tháng.' },
          { en: 'One thing I’d like to flag: the third-party API is slower than expected.', vi: 'Có một điểm tôi muốn lưu ý: API bên thứ ba chậm hơn dự kiến.', note: '"flag" = nêu lên để mọi người chú ý. Dùng khi báo rủi ro.' },
        ],
      },
      {
        label: 'Làm rõ yêu cầu',
        phrases: [
          { en: 'Just to make sure I understand correctly — you want the report to run daily?', vi: 'Để chắc là tôi hiểu đúng — bạn muốn báo cáo chạy hằng ngày?' },
          { en: 'Could you clarify what you mean by "fast"? Do you have a target number?', vi: 'Bạn nói rõ "nhanh" là thế nào được không? Bạn có con số mục tiêu chứ?', note: 'Luôn quy yêu cầu mơ hồ về con số cụ thể.' },
          { en: 'Let me confirm the scope before we start.', vi: 'Để tôi xác nhận phạm vi công việc trước khi bắt đầu.' },
        ],
      },
      {
        label: 'Báo tin xấu (trễ hạn, phát sinh)',
        phrases: [
          { en: 'I want to give you a heads-up: we may need two extra days.', vi: 'Tôi muốn báo trước: chúng tôi có thể cần thêm hai ngày.', note: '"heads-up" = báo trước. Báo sớm luôn tốt hơn im lặng.' },
          { en: 'We ran into an unexpected issue with the payment provider.', vi: 'Chúng tôi gặp vấn đề phát sinh với bên cung cấp thanh toán.' },
          { en: 'Here’s our plan to fix it, and I’ll update you on Thursday.', vi: 'Đây là kế hoạch khắc phục, và tôi sẽ cập nhật bạn vào thứ Năm.', note: 'Báo xấu phải LUÔN kèm giải pháp và mốc cập nhật.' },
        ],
      },
      {
        label: 'Từ chối / thương lượng phạm vi',
        phrases: [
          { en: 'That’s definitely possible, but it would add about a week to the timeline.', vi: 'Điều đó hoàn toàn làm được, nhưng sẽ thêm khoảng một tuần vào tiến độ.', note: 'KHÔNG nói "không làm được". Hãy nói cái giá của nó.' },
          { en: 'We could do that in phase two, so we don’t delay the launch.', vi: 'Chúng ta có thể làm ở giai đoạn hai, để không trễ ngày ra mắt.' },
          { en: 'Which of these two would you prioritize?', vi: 'Trong hai việc này bạn ưu tiên cái nào?', note: 'Đẩy quyết định ưu tiên về phía khách — cách xử lý phạm vi phình to.' },
        ],
      },
      {
        label: 'Chốt cuộc họp',
        phrases: [
          { en: 'So to summarize: we’ll finish the API this week and you’ll send the designs.', vi: 'Tóm lại: chúng tôi xong API tuần này và bạn gửi bản thiết kế.' },
          { en: 'I’ll send meeting notes right after this call.', vi: 'Tôi sẽ gửi biên bản ngay sau cuộc gọi này.' },
          { en: 'Does that work for everyone?', vi: 'Vậy ổn với mọi người chứ?' },
        ],
      },
    ],
  },
  {
    id: 'interview',
    icon: '🎯',
    title: 'Phỏng vấn tiếng Anh',
    intro:
      'Câu hỏi hay gặp nhất kèm câu trả lời mẫu. Mọi câu hỏi hành vi đều trả lời theo STAR '
      + '(Tình huống → Nhiệm vụ → Hành động → Kết quả) đã học ở Ngày 20.',
    groups: [
      {
        label: 'Mở đầu',
        phrases: [
          {
            en: 'Tell me about yourself. → I’m a back-end developer with three years of experience, mainly with Node.js and PostgreSQL. Recently I built a learning platform serving thousands of users. I also create coding tutorials, which pushed me to explain technical ideas clearly.',
            vi: 'Kể về bản thân bạn. → Tôi là lập trình viên back-end với ba năm kinh nghiệm, chủ yếu với Node.js và PostgreSQL. Gần đây tôi xây một nền tảng học tập phục vụ hàng nghìn người dùng. Tôi cũng làm video hướng dẫn lập trình, việc đó rèn cho tôi khả năng giải thích ý tưởng kỹ thuật rõ ràng.',
            note: 'CÔNG THỨC: nghề + số năm → công nghệ chính → thành tựu gần nhất → một điểm khác biệt.',
          },
          { en: 'Why are you interested in this role?', vi: 'Vì sao bạn quan tâm tới vị trí này?' },
          { en: 'What do you know about our company?', vi: 'Bạn biết gì về công ty chúng tôi?' },
        ],
      },
      {
        label: 'Câu hỏi kỹ thuật',
        phrases: [
          {
            en: 'What happens when you type a URL in the browser? → First, the browser resolves the domain through DNS. Then it opens a TCP connection and does a TLS handshake for HTTPS. It sends an HTTP request, the server responds with HTML, and the browser parses it, requests the CSS and JavaScript, and renders the page.',
            vi: 'Điều gì xảy ra khi bạn gõ một URL? → Đầu tiên trình duyệt phân giải tên miền qua DNS. Rồi nó mở kết nối TCP và bắt tay TLS cho HTTPS. Nó gửi yêu cầu HTTP, máy chủ trả về HTML, và trình duyệt phân tích, tải CSS/JavaScript rồi vẽ trang.',
          },
          {
            en: 'SQL or NoSQL — how do you choose? → It depends on the data. I choose SQL when the data is relational and I need transactions and consistency, like payments. I choose NoSQL when the shape varies or I need to scale reads horizontally, like activity logs.',
            vi: 'Chọn SQL hay NoSQL? → Còn tuỳ dữ liệu. Tôi chọn SQL khi dữ liệu có quan hệ và cần giao dịch, tính nhất quán, ví dụ thanh toán. Tôi chọn NoSQL khi cấu trúc thay đổi hoặc cần mở rộng đọc theo chiều ngang, ví dụ nhật ký hoạt động.',
            note: 'Mẫu trả lời vàng: "It depends on…" rồi nêu tiêu chí. Đừng trả lời tuyệt đối.',
          },
          { en: 'How would you improve the performance of a slow API?', vi: 'Bạn sẽ cải thiện một API chậm thế nào?' },
        ],
      },
      {
        label: 'Câu hỏi hành vi (trả lời theo STAR)',
        phrases: [
          {
            en: 'Tell me about a difficult bug you fixed. → (S) Our site went down during a launch. (T) I had to find the cause quickly. (A) I checked the logs, found a database connection leak, and fixed the pool configuration. (R) The site recovered in under an hour, and we added monitoring so it wouldn’t repeat.',
            vi: 'Kể về một lỗi khó bạn từng sửa. → (Tình huống) Trang web sập giữa đợt ra mắt. (Nhiệm vụ) Tôi phải tìm nguyên nhân thật nhanh. (Hành động) Tôi xem log, phát hiện rò rỉ kết nối cơ sở dữ liệu, và sửa cấu hình pool. (Kết quả) Trang phục hồi dưới một tiếng, và chúng tôi thêm giám sát để không lặp lại.',
          },
          { en: 'Tell me about a time you disagreed with a teammate.', vi: 'Kể về lần bạn bất đồng với đồng đội.', note: 'Nhấn vào cách bạn lắng nghe và tìm giải pháp chung, đừng nói xấu ai.' },
          { en: 'What is your biggest weakness?', vi: 'Điểm yếu lớn nhất của bạn là gì?', note: 'Nêu điểm yếu THẬT + việc bạn đang làm để khắc phục.' },
        ],
      },
      {
        label: 'Câu giữ nhịp khi cần nghĩ',
        phrases: [
          { en: 'That’s a good question. Let me think for a second.', vi: 'Câu hỏi hay đấy. Để tôi nghĩ một chút.', note: 'Được phép im lặng 2–3 giây. Im lặng có chuẩn bị tốt hơn ậm ừ.' },
          { en: 'Just to make sure I understand — are you asking about X or Y?', vi: 'Để chắc là tôi hiểu đúng — bạn hỏi về X hay Y?' },
          { en: 'I haven’t worked with that directly, but here’s how I’d approach it.', vi: 'Tôi chưa làm trực tiếp với cái đó, nhưng đây là cách tôi sẽ tiếp cận.', note: 'Cách trả lời khi KHÔNG biết — trung thực rồi thể hiện tư duy. Đừng bịa.' },
        ],
      },
      {
        label: 'Câu bạn nên HỎI LẠI',
        phrases: [
          { en: 'What does a typical day look like for this role?', vi: 'Một ngày điển hình ở vị trí này trông thế nào?' },
          { en: 'How does the team handle code reviews and deployments?', vi: 'Nhóm xử lý duyệt mã và triển khai ra sao?' },
          { en: 'What would success look like in the first three months?', vi: 'Thành công trong ba tháng đầu được đo thế nào?', note: 'Câu hỏi này gây ấn tượng rất tốt.' },
        ],
      },
    ],
  },
  {
    id: 'video',
    icon: '🎥',
    title: 'Quay video khoá học bằng tiếng Anh',
    intro:
      'Kịch bản để bạn nói tiếng Anh 100% trong video. Học thuộc phần mở và phần kết — chúng lặp '
      + 'lại ở mọi video, thuộc rồi thì chỉ còn phải nghĩ phần giữa.',
    groups: [
      {
        label: 'Mở đầu video (30 giây đầu quyết định người xem ở lại)',
        phrases: [
          { en: 'Hey everyone, welcome back to the channel.', vi: 'Chào mọi người, chào mừng quay lại kênh.' },
          { en: 'In this video, I’ll show you how to build a login system from scratch.', vi: 'Trong video này, tôi sẽ chỉ bạn cách xây hệ thống đăng nhập từ đầu.', note: 'Nói NGAY người xem sẽ nhận được gì.' },
          { en: 'By the end of this video, you’ll be able to deploy your own API.', vi: 'Đến cuối video, bạn sẽ tự triển khai được API của mình.' },
          { en: 'If you’re new here, I make videos about back-end development every week.', vi: 'Nếu bạn mới tới đây, tôi làm video về lập trình back-end mỗi tuần.' },
        ],
      },
      {
        label: 'Dẫn dắt giữa video',
        phrases: [
          { en: 'Let’s start by looking at the folder structure.', vi: 'Hãy bắt đầu bằng việc xem cấu trúc thư mục.' },
          { en: 'Now, let’s move on to the next part.', vi: 'Bây giờ, chuyển sang phần tiếp theo.' },
          { en: 'Here’s what’s happening under the hood.', vi: 'Đây là những gì đang diễn ra bên trong.', note: '"under the hood" = bên trong, phần ngầm. Rất tự nhiên khi giải thích kỹ thuật.' },
          { en: 'Notice that the function returns a promise, not a value.', vi: 'Để ý rằng hàm này trả về một promise, không phải một giá trị.' },
          { en: 'A quick heads-up: this part can be tricky, so watch closely.', vi: 'Lưu ý nhanh: phần này hơi rối, nên hãy xem kỹ.' },
          { en: 'If you’re following along, pause the video here and try it yourself.', vi: 'Nếu bạn đang làm theo, hãy tạm dừng ở đây và tự thử.' },
        ],
      },
      {
        label: 'Giải thích khái niệm (công thức 3 bước)',
        phrases: [
          { en: 'So what exactly is caching? In simple terms, it means storing a result so you don’t have to compute it again.', vi: 'Vậy caching chính xác là gì? Nói đơn giản, đó là lưu lại kết quả để bạn không phải tính lại.', note: 'BƯỚC 1: định nghĩa bằng lời đơn giản.' },
          { en: 'Think of it like keeping a phone number on your desk instead of looking it up every time.', vi: 'Hãy hình dung như giữ số điện thoại trên bàn thay vì tra lại mỗi lần.', note: 'BƯỚC 2: một phép so sánh đời thường.' },
          { en: 'Let me show you what that looks like in code.', vi: 'Để tôi chỉ bạn nó trông thế nào trong mã.', note: 'BƯỚC 3: chuyển sang ví dụ thật.' },
        ],
      },
      {
        label: 'Xử lý khi quay hỏng / nói nhầm',
        phrases: [
          { en: 'Sorry, let me rephrase that.', vi: 'Xin lỗi, để tôi nói lại.' },
          { en: 'Actually, that’s not quite right — here’s the correct version.', vi: 'Thật ra chỗ đó chưa chuẩn — đây mới là bản đúng.' },
          { en: 'What I meant to say is…', vi: 'Ý tôi muốn nói là…' },
        ],
      },
      {
        label: 'Kết video',
        phrases: [
          { en: 'And that’s it! We built a working login system from scratch.', vi: 'Vậy là xong! Chúng ta đã xây một hệ thống đăng nhập hoạt động từ đầu.' },
          { en: 'If this helped you, hit like and subscribe.', vi: 'Nếu video này hữu ích, hãy nhấn thích và đăng ký.' },
          { en: 'Let me know in the comments what you’d like to see next.', vi: 'Hãy cho tôi biết trong phần bình luận bạn muốn xem gì tiếp theo.' },
          { en: 'Thanks for watching, and I’ll see you in the next one!', vi: 'Cảm ơn bạn đã xem, và hẹn gặp lại ở video sau!' },
        ],
      },
    ],
  },
  {
    id: 'review',
    icon: '🔍',
    title: 'Code review & làm việc nhóm',
    intro:
      'Góp ý mã nguồn bằng tiếng Anh sao cho thẳng thắn mà không làm mất lòng — và cách nhận '
      + 'góp ý một cách chuyên nghiệp.',
    groups: [
      {
        label: 'Góp ý nhẹ nhàng (gợi ý)',
        phrases: [
          { en: 'Nit: could we rename this variable to something clearer?', vi: 'Góp ý nhỏ: đổi tên biến này cho rõ hơn được không?', note: '"Nit" (nitpick) = góp ý vặt, không chặn merge. Từ này rất phổ biến.' },
          { en: 'What do you think about extracting this into a helper function?', vi: 'Bạn nghĩ sao về việc tách phần này thành một hàm phụ trợ?' },
          { en: 'Minor: this could be simplified with optional chaining.', vi: 'Nhỏ thôi: chỗ này có thể gọn hơn bằng optional chaining.' },
        ],
      },
      {
        label: 'Nêu vấn đề thật (cần sửa)',
        phrases: [
          { en: 'I think this will break when the array is empty. Could we add a check?', vi: 'Tôi nghĩ chỗ này sẽ lỗi khi mảng rỗng. Thêm kiểm tra được không?', note: 'Nêu HẬU QUẢ cụ thể thay vì nói "cái này sai".' },
          { en: 'This query might be slow without an index on user_id.', vi: 'Truy vấn này có thể chậm nếu không có chỉ mục trên user_id.' },
          { en: 'Blocking: this exposes the API key to the client.', vi: 'Chặn merge: chỗ này để lộ khoá API ra phía client.', note: '"Blocking" = phải sửa trước khi gộp. Chỉ dùng khi thật sự nghiêm trọng.' },
        ],
      },
      {
        label: 'Nhận góp ý',
        phrases: [
          { en: 'Good catch, thanks! I’ll fix it.', vi: 'Bạn phát hiện hay đấy, cảm ơn! Tôi sẽ sửa.', note: '"Good catch" = câu đáp chuẩn khi ai đó tìm ra lỗi của bạn.' },
          { en: 'That makes sense. Let me update it.', vi: 'Hợp lý. Để tôi cập nhật.' },
          { en: 'I did it this way because of X, but I’m open to changing it.', vi: 'Tôi làm vậy vì lý do X, nhưng tôi sẵn sàng đổi.', note: 'Giải thích lý do mà không phòng thủ.' },
          { en: 'Could you explain a bit more? I want to make sure I understand.', vi: 'Bạn giải thích thêm được không? Tôi muốn chắc là mình hiểu đúng.' },
        ],
      },
    ],
  },
];

/** Lịch học gợi ý cho phần 2 — đặt ngay sau 20 ngày giao tiếp. */
export const DEV_PLAN: { phase: string; weeks: string; focus: string; goal: string }[] = [
  {
    phase: 'Giai đoạn 1 — Nền',
    weeks: 'Tuần 1–4 (ngay sau 20 ngày)',
    focus: 'Từ vựng lập trình cơ bản + Web/API · đọc to tài liệu tiếng Anh 15 phút/ngày',
    goal: 'Đọc hiểu tài liệu kỹ thuật không cần dịch; nói được mình đang làm gì bằng tiếng Anh.',
  },
  {
    phase: 'Giai đoạn 2 — Viết',
    weeks: 'Tuần 5–10',
    focus: 'Viết mô tả pull request, bình luận code review, email khách hàng bằng tiếng Anh',
    goal: 'Viết được email công việc và mô tả kỹ thuật rõ ràng mà không cần công cụ dịch.',
  },
  {
    phase: 'Giai đoạn 3 — Phỏng vấn',
    weeks: 'Tuần 11–18',
    focus: 'Luyện 30 câu hỏi phỏng vấn theo STAR · ghi âm và nghe lại · quay 4 video ngắn',
    goal: 'Trả lời trôi chảy câu hỏi kỹ thuật và hành vi trong 2 phút mỗi câu.',
  },
  {
    phase: 'Giai đoạn 4 — Khách hàng & video',
    weeks: 'Tuần 19–26',
    focus: 'Họp với khách bằng tiếng Anh · quay video khoá học nói 100% tiếng Anh',
    goal: 'Chủ trì được buổi họp với khách nước ngoài và quay trọn một video không cần cắt ghép nhiều.',
  },
];
