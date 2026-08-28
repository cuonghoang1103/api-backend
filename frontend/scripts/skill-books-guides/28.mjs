import { guide } from '../skill-guide-builder.mjs';

export default [
  // ── Chương 1 ─────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Học hiệu quả là tạo ra một thay đổi bền vững trong khả năng nhớ lại, giải thích hoặc thực hiện. Cảm giác trơn tru khi đọc lại chỉ chứng minh mắt bạn đã quen mặt chữ, không chứng minh não bạn lấy ra được thông tin khi tài liệu đã đóng. Toàn bộ chương này xoay quanh việc tách hai thứ đó ra và thiết kế vòng học để chính bạn nhìn thấy sự khác biệt.',
    why: {
      work:
        'Công việc thay đổi nhanh hơn tốc độ mở một khoá học: mỗi lần đổi công cụ, đổi quy trình hay tiếp quản mảng mới, người học nhanh sẽ tạo ra kết quả dùng được sau vài ngày thay vì vài tháng.',
      interview:
        'Câu “tôi học nhanh” trong CV không có sức nặng; điều có sức nặng là kể được quy trình bạn dùng lần gần nhất khi tiếp cận lĩnh vực lạ, kèm sản phẩm bạn làm ra ở cuối quá trình đó.',
      study:
        'Biết cơ chế học giúp bạn ngừng trả tiền cho thói quen tô màu tài liệu và chuyển ngân sách thời gian sang những việc thực sự tạo trí nhớ: tự trả lời, tự giải thích, tự làm lại.',
      life:
        'Từ học lái xe, học nấu ăn tới học chơi một nhạc cụ, cùng một nguyên tắc áp dụng: chọn đầu ra quan sát được, luyện có phản hồi, và chấp nhận cảm giác khó chịu vừa phải là dấu hiệu đang tiến bộ.',
    },
    framework: [
      { name: 'Chốt đầu ra', detail: 'Viết ra một câu duy nhất mô tả bạn sẽ LÀM được gì mà hôm nay chưa làm được, ở mức chi tiết đủ để một người khác chấm đúng/sai.' },
      { name: 'Mã hoá', detail: 'Nối kiến thức mới vào thứ bạn đã biết: một ví dụ có thật, một phép so sánh, một sơ đồ tự vẽ. Thông tin không có móc nối thì không có đường lấy ra.' },
      { name: 'Truy xuất', detail: 'Đóng tài liệu, tự nói hoặc tự viết lại. Chính hành động lôi thông tin ra khỏi trí nhớ mới củng cố nó, không phải hành động nhìn thấy thông tin thêm một lần.' },
      { name: 'Chuyển giao', detail: 'Dùng kiến thức trong một bối cảnh khác bối cảnh học: dữ liệu khác, khách hàng khác, con số khác. Nếu đổi bối cảnh mà tắc, bạn mới học được mẫu bài chứ chưa học được nguyên lý.' },
    ],
    scenario:
      'Một nhân viên vận hành kho được giao làm báo cáo tồn kho hằng tuần bằng Power BI. Anh xem hết 10 giờ video, thấy chỗ nào cũng hiểu, nhưng khi mở file rỗng thì không biết kéo cái gì trước. Anh đổi cách: mỗi 15 phút dừng video, tắt màn hình hướng dẫn và tự dựng lại biểu đồ vừa xem trên chính dữ liệu kho của công ty. Tiến độ xem chậm đi ba lần, nhưng sau tuần thứ hai anh tự ra được báo cáo đầu tiên mà không mở lại video.',
    comparison: [
      { weak: 'Đo tiến độ học bằng số giờ đã xem và số trang đã đọc.', mature: 'Đo tiến độ bằng số bài đã tự giải xong khi đóng tài liệu, và số lần giải thích lại đúng cho người khác.' },
      { weak: 'Chọn tài liệu vì nó dễ hiểu, mượt và làm mình thấy giỏi.', mature: 'Chọn tài liệu theo đầu ra cần đạt, chấp nhận đoạn khó và giải quyết nó bằng ví dụ tự làm.' },
      { weak: 'Học một mạch tới khi thuộc rồi bỏ hẳn chủ đề đó.', mature: 'Học từng đợt ngắn, quay lại sau vài ngày để kiểm tra xem còn nhớ bao nhiêu, rồi vá đúng chỗ rơi.' },
    ],
    mistakes: [
      'Nhầm cảm giác quen thuộc với năng lực: đọc lại lần thứ ba thấy dễ nên kết luận đã hiểu, trong khi chưa một lần thử viết lại từ trí nhớ.',
      'Tô màu và chép nguyên văn tài liệu, tạo ra một bản sao đẹp mắt nhưng không tạo ra một liên kết nào mới trong đầu.',
      'Đổi phương pháp liên tục sau mỗi hai ngày vì thấy chưa hiệu quả, trong khi phương pháp truy xuất luôn khó chịu ở giai đoạn đầu và chỉ lộ ra kết quả sau vài chu kỳ.',
    ],
    worksheet: [
      'Chủ đề bạn đang học là gì, và câu “tôi làm được X” cụ thể nào bạn muốn nói thật sau 3 tuần nữa?',
      'Trong 7 ngày qua, bạn đã dành bao nhiêu phút cho việc NHÌN tài liệu và bao nhiêu phút cho việc TỰ TẠO câu trả lời? Ghi hai con số cạnh nhau.',
      'Kể tên một thứ bạn tin là mình đã hiểu; đóng tài liệu và viết 5 câu giải thích nó ngay bây giờ. Chỗ nào bạn phải viết mơ hồ?',
      'Kiến thức mới này móc vào cái gì bạn đã biết từ trước? Viết một phép so sánh của riêng bạn, không lấy từ tài liệu.',
      'Bối cảnh khác nào bạn có thể mang kiến thức này sang thử trong tuần này (dữ liệu khác, dự án khác, người khác)?',
    ],
    exercises: [
      { label: 'Hai cột thời gian', text: 'Ghi lại 3 buổi học gần nhất theo hai cột: phút NHÌN tài liệu và phút TỰ TẠO câu trả lời. Tính tỷ lệ và viết một câu nhận xét về nó.', level: 'e' },
      { label: 'Đóng sách viết lại', text: 'Chọn một trang tài liệu bạn vừa đọc. Đóng lại, viết ra tất cả những gì nhớ được trong 5 phút, rồi mở ra tô đỏ những chỗ bạn bỏ sót hoặc nhớ sai.', level: 'e' },
      { label: 'Câu đầu ra', text: 'Viết lại mục tiêu học hiện tại thành một câu bắt đầu bằng động từ quan sát được, kèm điều kiện và mức chất lượng. So sánh với cách bạn phát biểu nó hôm qua.', level: 'e' },
      { label: 'Dừng và dựng lại', text: 'Trong một video hướng dẫn 30 phút, dừng ở mỗi mốc 10 phút, tắt hình và tự làm lại thao tác vừa xem. Ghi lại số lần bạn phải tua ngược.', level: 'm' },
      { label: 'Đổi bối cảnh', text: 'Lấy một bài tập bạn đã làm đúng theo mẫu và thay dữ liệu, thay yêu cầu đầu ra. Ghi lại chính xác bước đầu tiên bạn bị tắc.', level: 'm' },
      { label: 'Bản đồ móc nối', text: 'Vẽ tay sơ đồ nối 8-12 khái niệm của chủ đề đang học, mỗi mũi tên phải kèm động từ giải thích quan hệ. Không mở tài liệu trong lúc vẽ.', level: 'm' },
      { label: 'Vòng học 7 ngày', text: 'Thử thách 7 ngày: mỗi ngày 25 phút, dành đúng 5 phút đầu để trả lời không nhìn các câu của ngày hôm trước, 20 phút còn lại học phần mới. Ngày 7 tổng kết còn nhớ bao nhiêu phần trăm.', level: 'h' },
      { label: 'Chứng minh cho người khác', text: 'Chọn một người không cùng chuyên môn và dạy lại chủ đề trong 10 phút không nhìn tài liệu. Ghi lại ba câu hỏi họ đặt ra mà bạn không trả lời được, rồi học đúng ba chỗ đó.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao đọc lại lần thứ ba lại tạo cảm giác hiểu bài mạnh hơn thực tế?',
        a: 'Vì bộ não dùng độ trôi chảy khi xử lý làm tín hiệu thay thế cho độ thành thạo. Lần thứ ba, việc đọc trở nên dễ dàng nên bạn diễn giải sự dễ dàng đó thành hiểu. Muốn có tín hiệu thật, phải đóng tài liệu và tự tạo lại nội dung.',
      },
      {
        q: 'Đầu ra “hiểu về quản lý dự án” hỏng ở chỗ nào, và sửa thế nào?',
        a: 'Nó không cho biết ai chấm được đúng/sai và chấm khi nào. Sửa thành hành vi quan sát được: “lập được WBS cho một dự án 6 tuần, kèm bảng phụ thuộc và một danh sách rủi ro có phương án ứng phó, và bảo vệ được nó trước một người có kinh nghiệm”.',
      },
      {
        q: 'Bạn học xong một chủ đề, làm bài mẫu đúng hết, nhưng khi đổi đề thì tắc. Đó là vấn đề ở bước nào trong bốn bước?',
        a: 'Ở bước Chuyển giao, và thường có gốc từ bước Mã hoá. Bạn đã ghi nhớ mẫu bài chứ chưa gắn kiến thức vào nguyên lý, nên khi bề mặt bài toán đổi thì không nhận ra đó vẫn là bài cũ. Cách chữa là luyện với các biến thể trộn lẫn thay vì làm liên tiếp cùng một dạng.',
      },
    ],
    plan7:
      'Ngày 1: viết câu đầu ra và đo tỷ lệ nhìn/tự tạo hiện tại. Ngày 2: học một phần mới rồi đóng tài liệu viết lại trong 5 phút. Ngày 3: lặp lại ngày 2 nhưng mở đầu bằng việc trả lời các câu của ngày 2. Ngày 4: vẽ sơ đồ móc nối toàn bộ những gì đã học, không mở tài liệu. Ngày 5: làm một bài đổi bối cảnh và ghi lại điểm tắc. Ngày 6: dạy lại 10 phút cho một người ngoài chuyên môn. Ngày 7: đo lại tỷ lệ nhìn/tự tạo, so với ngày 1 và quyết định giữ hay bỏ từng thói quen.',
    evidence:
      'Giữ một learning log công khai (repo, Notion hoặc blog) ghi theo cột: đầu ra đặt ra, phương pháp dùng, bằng chứng đã đạt, thời gian thực tế. Sau ba chu kỳ, bạn có một bảng cho thấy mình rút ngắn được thời gian từ “không biết gì” đến “ra sản phẩm đầu tiên” — đây là câu trả lời có số cho câu hỏi phỏng vấn “bạn học công nghệ/mảng mới như thế nào”.',
    references: [
      { label: 'Learning How to Learn (Barbara Oakley, Coursera)', url: 'https://www.coursera.org/learn/learning-how-to-learn', type: 'article' },
      { label: 'The Learning Scientists — blog về phương pháp học có bằng chứng', url: 'https://www.learningscientists.org/blog', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 2 ─────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Một mục tiêu học tập dùng được phải mô tả ba thứ: hành vi quan sát được, điều kiện thực hiện và mức chất lượng chấp nhận. “Hiểu React” thiếu cả ba nên không giúp bạn chọn bài tập nào, không cho biết hôm nay nên học gì, và quan trọng nhất là không bao giờ báo cho bạn biết khi nào đã xong.',
    why: {
      work:
        'Khi xin sếp thời gian hoặc ngân sách để học, một mục tiêu có tiêu chí nghiệm thu sẽ được duyệt nhanh hơn hẳn một nguyện vọng chung chung, vì nó nói rõ công ty nhận lại được gì.',
      interview:
        'Nhà tuyển dụng hỏi “trong 3 tháng tới bạn muốn học gì” để đo khả năng tự định hướng; trả lời bằng năng lực đích gắn với yêu cầu vị trí cho thấy bạn đã đọc kỹ JD chứ không chỉ nộp đại.',
      study:
        'Mục tiêu rõ biến một môn học mông lung thành danh sách bài tập cụ thể, nhờ đó bạn biết bỏ qua phần nào của giáo trình mà không thấy áy náy.',
      life:
        'Ở việc học ngoài công việc — bơi, đàn, ngoại ngữ — mục tiêu có mức chất lượng giúp bạn thoát khỏi trạng thái học mãi không thấy đích và biết ăn mừng đúng lúc.',
    },
    framework: [
      { name: 'Chọn năng lực đích', detail: 'Bắt đầu từ một việc thật bạn muốn làm được, không bắt đầu từ tên một công nghệ hay tên một cuốn sách.' },
      { name: 'Viết bằng động từ', detail: 'Thay các động từ mờ (hiểu, nắm, biết) bằng động từ chấm được: dựng, sửa, giải thích, so sánh, tối ưu, bảo vệ trước phản biện.' },
      { name: 'Gắn điều kiện', detail: 'Nêu rõ làm trong hoàn cảnh nào: có hay không được tra tài liệu, trong bao lâu, trên dữ liệu thật hay dữ liệu mẫu.' },
      { name: 'Đặt mức đạt', detail: 'Định nghĩa ngưỡng chấp nhận bằng con số hoặc bằng nhận xét của một người cụ thể, để không tự nới tiêu chuẩn khi mệt.' },
      { name: 'Chia cột mốc tuần', detail: 'Cắt thành các mốc mỗi tuần một sản phẩm nhìn thấy được, để phát hiện sớm nếu mục tiêu quá to hoặc đặt sai hướng.' },
    ],
    scenario:
      'Một chuyên viên marketing đặt mục tiêu “học SQL trong một tháng”, mua khoá học và bỏ dở ở tuần thứ hai vì không biết mình đang tiến bộ hay không. Cô viết lại mục tiêu: “tự lấy được báo cáo chuyển đổi theo kênh trong 30 phút, có JOIN 3 bảng và một hàm window, không nhờ đội dữ liệu”. Ngay lập tức cô bỏ qua các chương về quản trị cơ sở dữ liệu và tập trung vào JOIN, GROUP BY, window function. Đến tuần thứ ba, cô nộp báo cáo tự làm đầu tiên.',
    comparison: [
      { weak: 'Mục tiêu là tiêu thụ hết nội dung: “xem hết khoá 40 giờ”, “đọc xong cuốn 500 trang”.', mature: 'Mục tiêu là tạo ra sản phẩm: “ra được bản báo cáo X”, “sửa được lỗi loại Y mà không cần hỏi”.' },
      { weak: 'Đặt 6 mục tiêu học song song, cái nào cũng quan trọng ngang nhau.', mature: 'Đặt một mục tiêu chính có ngày nghiệm thu, các mục tiêu còn lại xuống mức nền và ghi rõ là đang tạm hoãn.' },
      { weak: 'Không có tiêu chí dừng, nên học tới khi chán thì tự nhận là chưa đủ kỷ luật.', mature: 'Có ngưỡng đạt viết sẵn từ đầu, chạm ngưỡng thì đóng mục tiêu và mở mục tiêu tiếp theo.' },
    ],
    mistakes: [
      'Dùng động từ không chấm được — hiểu, nắm vững, làm quen — khiến không ai, kể cả chính bạn, phân xử được là đã đạt hay chưa.',
      'Đặt mục tiêu theo tên công nghệ thay vì theo việc cần làm, dẫn tới học cả những phần của công nghệ đó mà công việc thật không bao giờ chạm tới.',
      'Bỏ qua phần điều kiện: tự nhận là làm được vì đã làm được khi mở tài liệu và không giới hạn thời gian, trong khi tình huống thật luôn có sức ép về cả hai.',
    ],
    worksheet: [
      'Việc thật nào bạn muốn tự làm được mà hôm nay còn phải nhờ người khác? Viết tên người bạn đang phải nhờ.',
      'Viết lại việc đó thành câu có dạng: “Tôi sẽ [động từ chấm được] + [đối tượng cụ thể] + [trong điều kiện gì] + [đạt mức nào]”.',
      'Ai sẽ là người chấm, và họ cần nhìn thấy đúng vật gì để nói “đạt”?',
      'Ngày nghiệm thu là ngày nào? Ghi ngày dương lịch thật, không ghi “trong khoảng một tháng”.',
      'Liệt kê 3 phần của tài liệu/khoá học mà mục tiêu này cho phép bạn BỎ QUA. Nếu không bỏ được phần nào, mục tiêu vẫn còn quá rộng.',
    ],
    exercises: [
      { label: 'Chuyển ngữ động từ', text: 'Lấy 5 mục tiêu học bạn từng viết trong quá khứ và gạch dưới mọi động từ mờ. Viết lại từng cái bằng động từ có thể chấm đúng/sai.', level: 'e' },
      { label: 'Thêm điều kiện', text: 'Chọn một mục tiêu vừa viết và bổ sung phần điều kiện: được tra gì, cấm tra gì, trong bao nhiêu phút, trên loại dữ liệu nào.', level: 'e' },
      { label: 'Danh sách bỏ qua', text: 'Mở mục lục một khoá học bạn đang theo, đánh dấu những chương mục tiêu hiện tại KHÔNG cần. Đếm số giờ bạn vừa tiết kiệm.', level: 'e' },
      { label: 'Thang ba mức', text: 'Với một năng lực đích, viết ba mô tả hành vi tương ứng mức mới bắt đầu, mức làm được có giám sát, mức làm độc lập. Tự chấm mình đang ở đâu.', level: 'm' },
      { label: 'Ngược từ JD', text: 'Lấy một mô tả công việc thật bạn muốn ứng tuyển, trích 5 yêu cầu và biến mỗi yêu cầu thành một mục tiêu học có tiêu chí nghiệm thu.', level: 'm' },
      { label: 'Lịch cột mốc', text: 'Cắt mục tiêu chính thành 4 mốc tuần, mỗi mốc kèm đúng một sản phẩm nhìn thấy được. Ghi rõ mốc nào sẽ bị bỏ nếu tuần đó bận đột xuất.', level: 'm' },
      { label: 'Bảo vệ mục tiêu', text: 'Trình bày mục tiêu học của bạn cho một đồng nghiệp và nhờ họ tìm cách chứng minh nó vẫn còn mơ hồ. Sửa lại theo mọi chỗ họ chọc thủng được.', level: 'h' },
      { label: 'Bảy ngày một mốc', text: 'Thử thách 7 ngày: chọn đúng mốc tuần đầu tiên và giao nộp sản phẩm của nó vào cuối ngày 7 cho một người thật, kèm bảng tự chấm theo tiêu chí đã viết trước.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao mục tiêu “đọc xong cuốn sách về quản lý thời gian trong tháng này” là một mục tiêu học yếu?',
        a: 'Vì nó đo lượng nội dung tiêu thụ chứ không đo thay đổi hành vi. Bạn có thể đọc xong mà lịch làm việc không đổi một dòng nào. Mục tiêu mạnh hơn: “trong 4 tuần, mỗi tuần lập kế hoạch trước bằng time-block và cuối tuần đối chiếu kế hoạch với thực tế, đạt sai lệch dưới 30%”.',
      },
      {
        q: 'Phần “điều kiện” trong mục tiêu học có tác dụng gì mà không thể bỏ?',
        a: 'Nó quyết định độ khó thật và độ tương đồng với tình huống sử dụng. Viết được một truy vấn khi có ChatGPT và 2 giờ khác hẳn viết được nó trong 15 phút trên bảng trắng. Không nêu điều kiện thì hai người cùng nói “tôi làm được” mà nói về hai năng lực khác nhau.',
      },
      {
        q: 'Bạn đạt mốc tuần 1 và tuần 2 nhưng thấy càng học càng xa việc thật ở công ty. Nên làm gì?',
        a: 'Dừng lại và sửa năng lực đích chứ không sửa lịch học. Đây là dấu hiệu bạn chọn đích từ tên công nghệ chứ không từ việc cần làm. Cách chữa là hỏi ngược: việc nào ở công ty tôi đang phải nhờ người khác, và mục tiêu này có gỡ được nó không.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê những việc bạn đang phải nhờ người khác và chọn một việc làm năng lực đích. Ngày 2: viết mục tiêu đủ bốn thành phần và chọn người sẽ chấm. Ngày 3: rà mục lục tài liệu, đánh dấu phần bỏ qua. Ngày 4: cắt thành 4 mốc tuần với sản phẩm cụ thể từng mốc. Ngày 5: đưa mục tiêu cho một đồng nghiệp phản biện và sửa. Ngày 6: làm phần đầu của mốc 1 để kiểm tra mục tiêu có khả thi về thời gian không. Ngày 7: điều chỉnh phạm vi lần cuối và chốt ngày nghiệm thu lên lịch.',
    evidence:
      'Lưu bản mục tiêu gốc, bản sửa sau phản biện, và bản tự chấm ở ngày nghiệm thu vào cùng một tài liệu. Bộ ba đó là bằng chứng cực mạnh trong phỏng vấn: nó cho thấy bạn tự đặt tiêu chí, tự chịu chấm theo tiêu chí đó, và biết điều chỉnh phạm vi khi phát hiện đặt sai — ba thứ mà một chứng chỉ hoàn thành khoá học không nói lên được.',
    references: [
      { label: 'James Clear — Goal Setting: hướng dẫn khoa học về đặt và đạt mục tiêu', url: 'https://jamesclear.com/goal-setting', type: 'article' },
      { label: 'PositivePsychology.com — Goal Setting Theory (lý thuyết đặt mục tiêu của Locke)', url: 'https://positivepsychology.com/goal-setting-theory/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ── Chương 3 ─────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Học chủ động là mọi cách học buộc bạn phải TẠO RA một thứ gì đó trong lúc học: một dự đoán, một lời giải thích, một bản vẽ, một đoạn mã chạy được. Điểm mấu chốt không phải là hoạt động nhiều tay chân, mà là bộ não phải sinh ra nội dung thay vì tiếp nhận nội dung có sẵn.',
    why: {
      work:
        'Tài liệu nội bộ và tài liệu nhà cung cấp thường viết cho người đã hiểu; đọc chủ động — dự đoán rồi kiểm chứng — là cách duy nhất để rút ra hành động đúng mà không phải chờ người khác giảng lại.',
      interview:
        'Ở vòng kỹ thuật hay vòng tình huống, người phỏng vấn muốn nghe bạn nghĩ thành tiếng: nêu giả thuyết, tự phản biện, chọn cách kiểm chứng. Đó chính là học chủ động thực hiện trước mặt người khác.',
      study:
        'Cùng một tài liệu, nhóm dự đoán trước khi xem đáp án nhớ được nhiều hơn nhóm chỉ đọc — vì mỗi lần đoán sai tạo ra một chỗ trống mà đáp án sẽ lấp vào rất chặt.',
      life:
        'Khi lắp đồ, sửa chữa hay học công thức nấu ăn, thói quen đoán trước bước tiếp theo rồi đối chiếu sẽ giúp bạn nhớ quy trình sau một lần làm thay vì phải mở hướng dẫn mỗi lần.',
    },
    framework: [
      { name: 'Dự đoán trước', detail: 'Trước khi xem đáp án hay chạy thử, viết ra bạn nghĩ kết quả sẽ thế nào và vì sao. Đoán sai không mất gì, còn đoán rồi mới xem thì nhớ lâu hơn hẳn.' },
      { name: 'Giải thích tự sinh', detail: 'Sau mỗi đoạn, tự nói lại bằng lời của mình và tự hỏi “vì sao lại thế” chứ không phải “nó là gì”. Câu hỏi vì sao ép bộ não nối kiến thức mới với nền cũ.' },
      { name: 'Làm xen kẽ', detail: 'Trộn các loại bài với nhau thay vì làm 20 bài cùng dạng liên tiếp. Trộn khiến bạn phải nhận diện dạng bài — đúng thứ tình huống thật đòi hỏi.' },
      { name: 'Đối chiếu và sửa', detail: 'So sản phẩm của bạn với mẫu, nhưng chỉ ghi lại phần KHÁC BIỆT và lý do khác biệt, không chép lại toàn bộ mẫu.' },
    ],
    scenario:
      'Một lập trình viên đọc tài liệu về HTTP cache. Thay vì đọc một mạch, với mỗi tổ hợp header anh viết trước vào giấy dự đoán trình duyệt sẽ gọi lại server hay dùng bản lưu, rồi chạy curl để đối chiếu. Hai lần đoán sai liên tiếp ở phần must-revalidate khiến anh nhớ khác biệt đó lâu hơn cả buổi đọc trước đó. Cuối buổi anh có một bảng gồm 6 tình huống và 6 kết quả thật, dùng lại được khi cấu hình CDN ba tháng sau.',
    comparison: [
      { weak: 'Đọc hết tài liệu rồi mới thử làm, vì sợ làm sai khi chưa hiểu đủ.', mature: 'Thử làm sớm ở quy mô nhỏ và an toàn, coi mỗi lần sai là một câu hỏi có địa chỉ để mang ngược lại tài liệu.' },
      { weak: 'Ghi chép bằng cách chép lại lời giảng gần như nguyên văn.', mature: 'Ghi bằng lời của mình, mỗi ý kèm một câu hỏi “vì sao” hoặc một ví dụ tự nghĩ ra.' },
      { weak: 'Làm hết bài dạng A rồi mới sang dạng B để “khỏi rối”.', mature: 'Trộn A và B ngay từ buổi thứ hai, chấp nhận làm chậm hơn để luyện năng lực nhận diện dạng bài.' },
    ],
    mistakes: [
      'Nhầm bận rộn với chủ động: highlight, chép, làm slide đẹp đều là hoạt động tay chân nhưng không buộc bộ não sinh ra nội dung mới.',
      'Chỉ dự đoán trong đầu mà không viết ra, nên khi xem đáp án dễ tự nhủ “tôi cũng nghĩ vậy” dù thực tế đã nghĩ khác.',
      'Sợ đoán sai trước mặt người khác nên chờ có đáp án rồi mới phát biểu, tự tước mất chính khoảnh khắc tạo trí nhớ mạnh nhất.',
    ],
    worksheet: [
      'Buổi học gần nhất của bạn: bạn đã tạo ra vật gì mà trước đó chưa tồn tại? Nếu không có gì, buổi đó là học thụ động.',
      'Chọn một đoạn tài liệu sắp đọc; trước khi đọc, viết 3 dự đoán về nội dung của nó. Sau khi đọc, đánh dấu đúng/sai từng dự đoán.',
      'Ba câu hỏi “vì sao” nào bạn có thể đặt cho chủ đề đang học mà tài liệu không trả lời trực tiếp?',
      'Bạn đang luyện dạng bài nào lặp đi lặp lại? Ghép nó với một dạng khác nào để tạo bài trộn cho buổi tới?',
      'Lần gần nhất bạn đoán sai một điều gì trong lúc học, bạn đã ghi lại lý do sai chưa? Nếu chưa, ghi lại ngay bây giờ.',
    ],
    exercises: [
      { label: 'Ba dự đoán', text: 'Trước khi mở một chương mới, đọc mỗi tiêu đề mục và viết một câu dự đoán nội dung. Sau khi đọc, đối chiếu và đếm số dự đoán trúng.', level: 'e' },
      { label: 'Nói vì sao', text: 'Với 5 sự kiện vừa học, biến mỗi cái thành một câu hỏi bắt đầu bằng “vì sao” và tự trả lời trong hai câu, không mở tài liệu.', level: 'e' },
      { label: 'Ghi bằng lời mình', text: 'Lấy nửa trang ghi chép cũ và viết lại hoàn toàn bằng ngôn ngữ của bạn, không được dùng lại quá 5 từ liên tiếp của bản gốc.', level: 'e' },
      { label: 'Bảng dự đoán - thực tế', text: 'Chọn một công cụ hoặc quy trình bạn đang học, lập bảng 6 tình huống, cột dự đoán viết trước, cột kết quả thật viết sau khi chạy thử. Ghi lý do cho mỗi ô lệch.', level: 'm' },
      { label: 'Bài trộn', text: 'Tạo một bộ 12 bài tập trộn từ 3 dạng khác nhau, xáo ngẫu nhiên rồi làm. So thời gian và tỷ lệ đúng với lần làm theo từng khối.', level: 'm' },
      { label: 'Phá ví dụ mẫu', text: 'Lấy một ví dụ mẫu trong tài liệu, cố tình sửa một tham số và dự đoán hậu quả trước khi chạy. Lặp với 4 tham số khác nhau.', level: 'm' },
      { label: 'Học nhóm đối kháng', text: 'Cùng một đồng nghiệp học một chủ đề, mỗi người chuẩn bị 5 câu hỏi khó cho người kia. Ghi lại những câu cả hai đều không trả lời được và tra cùng nhau.', level: 'h' },
      { label: 'Bảy ngày đoán trước', text: 'Thử thách 7 ngày: mỗi buổi học bắt buộc mở đầu bằng 3 dự đoán viết ra giấy và kết thúc bằng việc chấm chúng. Ngày 7, đọc lại toàn bộ dự đoán sai để tìm mẫu chung trong cách bạn hay nhầm.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao viết dự đoán ra giấy lại quan trọng hơn là chỉ nghĩ trong đầu?',
        a: 'Vì trí nhớ tự chỉnh sửa. Khi thấy đáp án, bạn rất dễ tin rằng mình đã nghĩ đúng như vậy từ đầu, nên mất tín hiệu về chỗ mình thật sự hổng. Bản viết là bằng chứng cố định để đối chiếu và tìm ra mẫu lỗi lặp lại của chính mình.',
      },
      {
        q: 'Làm bài trộn khiến bạn làm chậm hơn và sai nhiều hơn. Vậy tại sao vẫn nên trộn?',
        a: 'Vì tình huống thật không báo trước đây là bài dạng nào. Làm theo khối luyện kỹ năng giải khi đã biết dạng; làm trộn luyện thêm kỹ năng nhận diện dạng. Kết quả trong buổi tập kém hơn nhưng khả năng dùng lại về sau tốt hơn.',
      },
      {
        q: 'Một người vừa nghe giảng vừa gõ lại gần như nguyên văn lời giảng. Đó là học chủ động hay thụ động, vì sao?',
        a: 'Thụ động, dù tay rất bận. Việc chép nguyên văn có thể thực hiện gần như không cần hiểu nghĩa, nên không tạo liên kết mới. Chuyển thành chủ động bằng cách chỉ ghi từ khoá trong lúc nghe, rồi sau buổi học viết lại đầy đủ bằng lời của mình khi tài liệu đã đóng.',
      },
    ],
    plan7:
      'Ngày 1: chọn chủ đề và lập bảng dự đoán - thực tế trống. Ngày 2-3: mỗi buổi điền 3 dòng của bảng, ghi lý do cho mỗi ô lệch. Ngày 4: viết lại toàn bộ ghi chép hai ngày trước bằng lời của mình. Ngày 5: tạo bộ 12 bài trộn từ 3 dạng và làm hết. Ngày 6: trao đổi 5 câu hỏi khó với một người cùng học. Ngày 7: đọc lại mọi dự đoán sai trong tuần, tìm mẫu nhầm lặp lại và viết một câu tự nhắc cho tuần sau.',
    evidence:
      'Bảng dự đoán - thực tế và bộ câu hỏi “vì sao” bạn tự đặt là hai tài liệu rất dễ mang vào phỏng vấn: khi được hỏi bạn tiếp cận công nghệ mới ra sao, bạn mở đúng bảng đó ra và chỉ vào những ô mình đoán sai. Nó chứng minh bạn kiểm chứng bằng thực nghiệm chứ không tin tài liệu một cách thụ động — điều mà nhà tuyển dụng kỹ thuật đánh giá rất cao.',
    references: [
      { label: 'Retrieval Practice — nguồn về học chủ động và truy xuất', url: 'https://www.retrievalpractice.org/', type: 'article' },
      { label: 'The Learning Scientists — sáu chiến lược học có bằng chứng', url: 'https://www.learningscientists.org/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 4 ─────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Active Recall luyện đường lấy thông tin ra khỏi trí nhớ; Spaced Repetition sắp lịch để mỗi lần lấy ra diễn ra đúng lúc bạn sắp quên. Hai kỹ thuật này rất mạnh với kiến thức cần nhớ chính xác và nhớ lâu — thuật ngữ, cú pháp, quy định, từ vựng — và gần như vô dụng nếu bạn dùng chúng để thay cho việc thực hành kỹ năng.',
    why: {
      work:
        'Có những thứ tra Google mỗi lần thì quá chậm: mã lỗi hay gặp, điều khoản trong hợp đồng mẫu, ngưỡng cảnh báo của hệ thống. Nhớ sẵn những mảnh đó giúp bạn phản ứng trong cuộc họp thay vì hẹn trả lời sau.',
      interview:
        'Vòng hỏi nhanh về khái niệm không cho bạn thời gian tra cứu; một bộ thẻ ôn 20 phút mỗi ngày trong ba tuần trước phỏng vấn tạo khác biệt rõ hơn nhiều so với đọc lại tài liệu đêm hôm trước.',
      study:
        'Với các môn có lượng thuật ngữ lớn, lịch ôn giãn dần cắt được phần lớn thời gian nhồi trước kỳ thi, và quan trọng hơn là giữ lại kiến thức sau khi thi xong.',
      life:
        'Học ngoại ngữ, học tên thuốc trong đơn của người thân, nhớ quy trình an toàn — mọi thứ cần nhớ chính xác trong thời gian dài đều hưởng lợi từ lịch ôn giãn.',
    },
    framework: [
      { name: 'Rút câu hỏi', detail: 'Biến mục tiêu học thành câu hỏi có một đáp án rõ, thay vì cắt dán nguyên đoạn văn vào mặt trước thẻ.' },
      { name: 'Trả lời che đáp án', detail: 'Nói hoặc viết ra đáp án đầy đủ TRƯỚC khi lật. Nhìn lướt rồi tự nhủ “biết rồi” là hình thức tự lừa phổ biến nhất.' },
      { name: 'Chấm trung thực', detail: 'Chỉ tính là nhớ khi bạn nói ra được toàn bộ ý chính. Nhớ lờ mờ thì đánh dấu quên và sửa lại câu chữ của thẻ ngay.' },
      { name: 'Giãn dần, trộn chủ đề', detail: 'Thẻ đúng thì đẩy khoảng cách ra xa, thẻ sai thì kéo về gần. Mỗi phiên ôn trộn nhiều chủ đề để tránh học vẹt theo thứ tự.' },
    ],
    scenario:
      'Một chuyên viên nhân sự ôn thi chứng chỉ về luật lao động phải nhớ hàng chục mốc thời hạn và ngưỡng. Ban đầu cô chép cả điều khoản vào thẻ và ôn 90 phút mỗi tối, kết quả là ôn không hết vòng. Cô cắt mỗi thẻ xuống một câu hỏi một đáp án, thêm một tình huống ngắn ở mặt sau, và để phần mềm giãn khoảng. Thời gian ôn xuống còn 20 phút mỗi ngày, nhưng số câu trả lời đúng ở đề thử tăng đều qua bốn tuần.',
    comparison: [
      { weak: 'Thẻ có mặt trước là một đoạn dài, mặt sau là nửa trang chép từ tài liệu.', mature: 'Thẻ có một câu hỏi hẹp, một đáp án nói được trong 15 giây, và một ví dụ ngữ cảnh kèm theo.' },
      { weak: 'Ôn dồn 3 tiếng vào tối trước kỳ thi rồi bỏ hẳn chủ đề.', mature: 'Ôn 15-25 phút mỗi ngày theo lịch giãn, chấp nhận mỗi ngày chạm ít nhưng chạm đều.' },
      { weak: 'Đo tiến bộ bằng số thẻ đã tạo và tổng số thẻ trong bộ.', mature: 'Đo bằng tỷ lệ trả lời đúng ở lần ôn đầu tiên của mỗi ngày, và bằng kết quả trên đề thử độc lập.' },
      { weak: 'Dùng flashcard cho mọi thứ, kể cả kỹ năng cần thao tác.', mature: 'Dùng thẻ cho phần cần nhớ chính xác, và dùng bài tập thực hành cho phần cần làm được.' },
    ],
    mistakes: [
      'Xây bộ thẻ khổng lồ quá chi tiết rồi dành nhiều thời gian quản lý bộ thẻ hơn thời gian thực sự dùng kiến thức vào việc gì đó.',
      'Nhận diện thay vì truy xuất: nhìn mặt trước thấy quen nên lật luôn, tự chấm là nhớ, trong khi chưa hề nói ra đáp án.',
      'Dùng Spaced Repetition để thay thế thực hành: thuộc lòng định nghĩa design pattern nhưng chưa từng viết một dòng code áp dụng nó.',
    ],
    worksheet: [
      'Trong chủ đề đang học, phần nào BẮT BUỘC phải nhớ chính xác, và phần nào chỉ cần biết chỗ tra? Chia thành hai cột.',
      'Lấy 3 thẻ hiện có của bạn — hoặc 3 ý bạn định làm thẻ — và viết lại mặt trước sao cho mỗi thẻ chỉ hỏi đúng một thứ.',
      'Hôm nay bạn ôn bao nhiêu phút và trả lời đúng bao nhiêu phần trăm ở lần đầu? Ghi cặp số này mỗi ngày trong một tuần.',
      'Thẻ nào bạn đã sai từ 3 lần trở lên? Viết lại nó theo cách khác hoặc tách nó thành hai thẻ nhỏ hơn.',
      'Kiến thức nào bạn đang cố nhồi bằng thẻ nhưng thật ra cần một bài tập thực hành? Ghi bài tập thay thế cho nó.',
    ],
    exercises: [
      { label: 'Cắt thẻ béo', text: 'Chọn 5 thẻ dài nhất trong bộ của bạn và tách mỗi thẻ thành các thẻ con chỉ hỏi một ý. Đếm số thẻ trước và sau.', level: 'e' },
      { label: 'Nói to đáp án', text: 'Ôn một phiên 15 phút với quy tắc bắt buộc nói thành tiếng đáp án trước khi lật. Ghi lại số thẻ bạn tưởng nhớ nhưng thực ra không nói ra được.', level: 'e' },
      { label: 'Hai cột nhớ - tra', text: 'Với chủ đề hiện tại, phân loại 20 mục kiến thức vào hai cột: cần nhớ thuộc và chỉ cần biết chỗ tra. Chỉ làm thẻ cho cột thứ nhất.', level: 'e' },
      { label: 'Thẻ có ngữ cảnh', text: 'Viết lại 10 thẻ sao cho mặt sau có thêm một tình huống thật một dòng, để đáp án không tồn tại lơ lửng ngoài bối cảnh sử dụng.', level: 'm' },
      { label: 'Nhật ký tỷ lệ đúng', text: 'Trong 10 ngày, ghi cặp số phút ôn và tỷ lệ đúng lần đầu. Vẽ hai đường và tìm ngày mà tăng thời gian không còn tăng kết quả.', level: 'm' },
      { label: 'Trộn chủ đề', text: 'Gộp thẻ của ba chủ đề vào một phiên ôn ngẫu nhiên. So tỷ lệ đúng với khi ôn từng chủ đề riêng và giải thích chênh lệch.', level: 'm' },
      { label: 'Đề thử độc lập', text: 'Tự làm một đề 20 câu do người khác ra hoặc lấy từ nguồn ngoài bộ thẻ của bạn. Đối chiếu điểm với cảm giác tự tin trước khi làm.', level: 'h' },
      { label: 'Bảy ngày 20 phút', text: 'Thử thách 7 ngày: đúng 20 phút ôn mỗi ngày, không hơn, không dồn bù. Ngày 7 làm lại đề thử của ngày 1 và so hai kết quả.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao lấy ra khỏi trí nhớ lại củng cố trí nhớ tốt hơn là nhìn lại thông tin thêm một lần?',
        a: 'Vì mỗi lần truy xuất thành công là một lần bạn luyện chính con đường mà sau này bạn sẽ phải đi lại. Nhìn lại chỉ làm mạnh việc nhận diện. Đó cũng là lý do một lần ôn khó khăn có giá trị hơn ba lần đọc lướt dễ chịu.',
      },
      {
        q: 'Khi nào KHÔNG nên dùng flashcard, dù nội dung có vẻ hợp?',
        a: 'Khi mục tiêu là làm được chứ không phải nói ra được: viết code, thương lượng, chạy một quy trình vận hành, thuyết trình. Với những thứ đó, thẻ chỉ giúp phần từ vựng và tham số; phần còn lại phải luyện bằng bài tập có phản hồi.',
      },
      {
        q: 'Bộ thẻ của bạn phình lên 800 thẻ và mỗi ngày ôn mất một tiếng. Xử lý thế nào?',
        a: 'Cắt theo mục tiêu chứ không cố ôn nhanh hơn. Rà lại từng nhóm thẻ và xoá những gì chỉ cần biết chỗ tra, gộp các thẻ trùng ý, và tạm đình chỉ những chủ đề không phục vụ mục tiêu ba tháng tới. Bộ thẻ là công cụ, phình to là dấu hiệu mục tiêu chưa được cắt gọt.',
      },
    ],
    plan7:
      'Ngày 1: chia kiến thức thành hai cột nhớ - tra và làm một đề thử để có mốc so sánh. Ngày 2: tạo hoặc cắt gọn 30 thẻ, mỗi thẻ một câu hỏi. Ngày 3-6: ôn đúng 20 phút mỗi ngày, ghi cặp số phút - tỷ lệ đúng, mỗi ngày sửa lại 3 thẻ hay sai nhất. Ngày 5 thêm việc trộn chủ đề trong phiên ôn. Ngày 7: làm lại đề thử ngày 1, so kết quả và quyết định thẻ nào bỏ hẳn.',
    evidence:
      'Xuất bộ thẻ của bạn (Anki, Quizlet hoặc một bảng tính) kèm biểu đồ tỷ lệ đúng theo ngày và hai kết quả đề thử đầu - cuối. Khi phỏng vấn hỏi bạn chuẩn bị cho chứng chỉ hoặc kỳ đánh giá nội bộ thế nào, một biểu đồ có xu hướng đi lên nói thay bạn rằng bạn quản lý việc học bằng dữ liệu chứ không bằng cảm giác.',
    references: [
      { label: 'Retrieval Practice — thư viện hướng dẫn về active recall', url: 'https://www.retrievalpractice.org/', type: 'article' },
      { label: 'How to Remember Anything Forever-ish (Nicky Case) — mô phỏng tương tác về spaced repetition', url: 'https://ncase.me/remember/', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 5 ─────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Kỹ thuật Feynman dùng việc giải thích cho người chưa biết như một máy dò lỗ hổng: chỗ nào bạn buộc phải nói bằng thuật ngữ hoặc phải quay lại tài liệu, chỗ đó bạn chưa hiểu. Mục tiêu không phải làm mọi thứ trở nên trẻ con, mà là giữ nguyên độ chính xác trong khi bỏ đi những từ đang che giấu việc bạn chưa hiểu.',
    why: {
      work:
        'Phần lớn công việc bị chậm ở chỗ bàn giao: người viết tài liệu hiểu, người đọc không. Ai giải thích được cho người ngoài chuyên môn sẽ giảm số vòng hỏi đi hỏi lại và được mời vào những cuộc họp quan trọng hơn.',
      interview:
        'Câu “hãy giải thích X cho tôi” xuất hiện ở gần như mọi vòng chuyên môn. Người luyện Feynman trả lời có cấu trúc, có ví dụ, có giới hạn — thay vì đọc thuộc định nghĩa rồi im lặng khi bị hỏi vặn.',
      study:
        'Giải thích lại là bài kiểm tra rẻ nhất và khắc nghiệt nhất bạn có thể tự tổ chức, dùng được ngay sau mỗi buổi học mà không cần đề bài hay đáp án.',
      life:
        'Khi phải giải thích một quyết định tài chính, một chẩn đoán sức khoẻ hay một điều khoản hợp đồng cho người thân, khả năng nói đơn giản mà không sai bản chất chính là thứ quyết định họ có hiểu đúng rủi ro hay không.',
    },
    framework: [
      { name: 'Chốt câu hỏi', detail: 'Bắt đầu bằng một câu hỏi hẹp có thể trả lời trong 3-5 phút, ví dụ “vì sao chia phân số lại nhân nghịch đảo”, chứ không phải cả một chủ đề.' },
      { name: 'Giải thích từ trí nhớ', detail: 'Nói hoặc viết lời giải thích với tài liệu đã đóng, hướng tới một người cụ thể có nền kiến thức xác định.' },
      { name: 'Đánh dấu chỗ trượt', detail: 'Ghi lại mọi chỗ bạn dùng từ mơ hồ, nói nhanh cho qua, hoặc phải mở tài liệu. Đó là bản đồ lỗ hổng chính xác nhất bạn có.' },
      { name: 'Vá và viết lại', detail: 'Học đúng những chỗ vừa đánh dấu, rồi viết lại lời giải thích kèm một ví dụ, một phản ví dụ và một câu nêu giới hạn của cách hiểu đó.' },
    ],
    scenario:
      'Một gia sư toán tin rằng mình hiểu rõ phép chia phân số. Khi một học sinh lớp 5 hỏi “vì sao lại lật ngược rồi nhân”, cô chỉ trả lời được “quy tắc là vậy”. Cô ngồi viết lại lời giải thích bằng bài toán chia một tấm bìa dài 3/4 mét thành các đoạn 1/8 mét và đếm số đoạn. Lần dạy sau, học sinh tự giải thích lại được quy tắc, và bản thân cô phát hiện mình cũng chưa từng hiểu vì sao phép chia lại tương đương phép đếm đoạn.',
    comparison: [
      { weak: 'Thay thuật ngữ bằng một ẩn dụ nghe hay nhưng làm sai bản chất.', mature: 'Chọn ẩn dụ rồi tự hỏi ẩn dụ đó sai ở đâu, và nói luôn phần sai đó cho người nghe.' },
      { weak: 'Mở tài liệu trong lúc đang giải thích để nói cho trôi chảy.', mature: 'Đóng tài liệu, chấp nhận vấp, đánh dấu chỗ vấp và coi đó là kết quả chính của buổi tập.' },
      { weak: 'Đo thành công bằng việc mình nói hết mà không bị ngắt.', mature: 'Đo bằng việc người nghe diễn đạt lại được ý chính và đặt ra câu hỏi đúng trọng tâm.' },
    ],
    mistakes: [
      'Đơn giản hoá tới mức sai: bỏ mất điều kiện áp dụng khiến người nghe mang một hiểu biết lệch đi dùng vào việc thật.',
      'Coi Feynman là buổi thuyết trình đã chuẩn bị sẵn slide, trong khi giá trị nằm ở việc nói vo và để lộ ra chỗ mình chưa vững.',
      'Chọn người nghe quá dễ tính, gật đầu suốt và không hỏi lại, khiến bài tập mất hoàn toàn chức năng dò lỗ hổng.',
    ],
    worksheet: [
      'Viết một câu hỏi hẹp bắt đầu bằng “vì sao” về chủ đề bạn đang học, và ước lượng bạn cần bao nhiêu phút để trả lời.',
      'Người nghe của bạn là ai, họ đã biết sẵn những gì, và một từ chuyên môn nào bạn chắc chắn không được dùng với họ?',
      'Sau khi giải thích không nhìn tài liệu: liệt kê mọi từ bạn đã dùng mà chính bạn không định nghĩa được ngay.',
      'Ví dụ nào cho thấy điều bạn vừa giải thích ĐÚNG, và phản ví dụ nào cho thấy nó KHÔNG áp dụng được?',
      'Nếu người nghe chỉ nhớ được một câu duy nhất, bạn muốn đó là câu nào? Viết chính xác câu đó ra.',
    ],
    exercises: [
      { label: 'Năm phút nói vo', text: 'Chọn một khái niệm và ghi âm lời giải thích 5 phút với tài liệu đóng. Nghe lại và đếm số lần bạn nói “kiểu như là” hoặc bỏ lửng câu.', level: 'e' },
      { label: 'Danh sách từ mù', text: 'Gạch dưới mọi thuật ngữ trong bản ghi của bạn và tự định nghĩa từng cái trong một câu. Cái nào không định nghĩa nổi là lỗ hổng thật.', level: 'e' },
      { label: 'Một câu ghi nhớ', text: 'Rút toàn bộ chủ đề thành một câu duy nhất dưới 25 từ, chính xác và không có thuật ngữ. Viết ba phiên bản rồi chọn một.', level: 'e' },
      { label: 'Phản ví dụ', text: 'Với mỗi trong ba khái niệm đang học, tìm một tình huống mà cách hiểu thông thường sẽ dẫn tới kết luận sai. Giải thích vì sao.', level: 'm' },
      { label: 'Đổi người nghe', text: 'Giải thích cùng một nội dung cho ba đối tượng: một người trong nghề, một sinh viên năm nhất, và một người hoàn toàn ngoài ngành. Ghi lại phần bạn phải bỏ và phần bạn phải thêm.', level: 'm' },
      { label: 'Vẽ trước, nói sau', text: 'Vẽ sơ đồ chủ đề trên một trang giấy chỉ dùng hình và mũi tên, không quá 10 chữ. Sau đó giải thích dựa hoàn toàn vào hình vẽ đó.', level: 'm' },
      { label: 'Người nghe khó tính', text: 'Nhờ một đồng nghiệp nghe bạn giải thích với nhiệm vụ hỏi “vì sao” ba lần liên tiếp cho mỗi ý. Ghi lại ý đầu tiên bạn không đi tiếp được.', level: 'h' },
      { label: 'Bảy ngày một khái niệm', text: 'Thử thách 7 ngày: mỗi ngày chọn một khái niệm, giải thích 5 phút không nhìn tài liệu, vá lỗ hổng và viết lại. Ngày 7, ghép 7 bản viết lại thành một bài hướng dẫn ngắn cho người mới.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Kỹ thuật Feynman đo cái gì mà việc đọc lại tài liệu không đo được?',
        a: 'Nó đo khả năng tạo ra nội dung từ trí nhớ và kết nối các ý theo trình tự có nghĩa. Đọc lại chỉ kiểm tra được rằng bạn nhận ra thông tin khi nhìn thấy nó. Giải thích để lộ ra cả những chỗ bạn tưởng đã hiểu nhưng chỉ nhớ hình dạng câu chữ.',
      },
      {
        q: 'Vì sao “giải thích như cho trẻ con” là một cách hiểu sai về kỹ thuật này?',
        a: 'Vì mục tiêu là bỏ thuật ngữ mà giữ nguyên độ chính xác, không phải hạ độ chính xác để câu văn nghe dễ. Một lời giải thích tốt vẫn nêu điều kiện áp dụng và giới hạn; nó chỉ thay từ khó bằng ví dụ và cơ chế mà người nghe đã có sẵn trong đầu.',
      },
      {
        q: 'Bạn giải thích trôi chảy và người nghe gật đầu liên tục. Đó có phải bằng chứng bạn đã hiểu?',
        a: 'Chưa đủ. Gật đầu có thể chỉ là lịch sự hoặc là ảo giác trôi chảy của người nghe. Bằng chứng thật là khi họ diễn đạt lại bằng lời của họ, áp dụng vào một ví dụ mới, hoặc nêu được điều kiện mà cách giải thích đó không còn đúng.',
      },
    ],
    plan7:
      'Ngày 1: chọn 7 khái niệm và viết 7 câu hỏi “vì sao” tương ứng. Ngày 2-6: mỗi ngày lấy một khái niệm, ghi âm 5 phút giải thích với tài liệu đóng, liệt kê từ mù, học đúng phần thiếu và viết lại bản thứ hai. Ngày 5 đổi người nghe sang một người ngoài ngành. Ngày 7: nhờ một người hỏi “vì sao” ba tầng cho hai khái niệm bất kỳ, rồi ghép tất cả bản viết lại thành một hướng dẫn ngắn.',
    evidence:
      'Biến các bản viết lại thành một chuỗi bài giải thích ngắn đăng công khai — blog nội bộ, LinkedIn, hoặc mục hướng dẫn trong repo của nhóm. Trong phỏng vấn, đường dẫn tới ba bài giải thích của chính bạn về ba khái niệm khó là bằng chứng trực tiếp cho năng lực truyền đạt, và thường được người phỏng vấn đọc trước khi gặp mặt.',
    references: [
      { label: 'The Learning Scientists — elaboration và giải thích để học', url: 'https://www.learningscientists.org/blog', type: 'article' },
      { label: 'Farnam Street — The Feynman Technique', url: 'https://fs.blog/feynman-technique/', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 6 ─────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Đọc hiểu hiệu quả không phải là đọc nhanh hơn mà là biết đọc phần nào, với mục đích gì, và dừng ở đâu. Một tài liệu 40 trang hiếm khi cần 40 trang chú ý ngang nhau: bạn vào với một câu hỏi cụ thể, tìm đúng phần trả lời câu hỏi đó, và rời đi khi đã có đủ căn cứ để hành động hoặc để đặt câu hỏi tiếp theo.',
    why: {
      work:
        'Hợp đồng, đặc tả kỹ thuật, báo cáo phân tích và tài liệu quy trình đều dài và viết chán; ai rút được điều khoản quan trọng trong 30 phút sẽ tránh cho cả nhóm những cam kết không nên nhận.',
      interview:
        'Bài tập về nhà thường kèm một tập tài liệu dài. Nêu rõ bạn tìm phần chuẩn ở đâu, ghi lại giả định nào và kiểm chứng bằng cách nào sẽ tạo ấn tượng mạnh hơn bản nộp không kèm lý do.',
      study:
        'Giáo trình được viết để đầy đủ, không phải để học nhanh. Đọc theo câu hỏi cho phép bạn bỏ qua phần chưa cần mà vẫn kiểm soát được mình đang bỏ qua cái gì.',
      life:
        'Điều khoản bảo hiểm, hợp đồng thuê nhà, hướng dẫn sử dụng thiết bị — thói quen tìm mục có nghĩa vụ và ngoại lệ trước tiên giúp bạn phát hiện những điều bất lợi trước khi ký, không phải sau.',
    },
    framework: [
      { name: 'Vào với câu hỏi', detail: 'Viết trước 2-4 câu hỏi bạn cần tài liệu trả lời. Không có câu hỏi thì mọi câu đều quan trọng như nhau và bạn sẽ đọc từ đầu tới cuối một cách vô định.' },
      { name: 'Quét cấu trúc', detail: 'Đọc mục lục, tiêu đề, phần kết luận và các bảng biểu trước phần thân. Chỉ mất vài phút nhưng cho biết câu trả lời nằm ở đâu và tài liệu có đáng đọc tiếp không.' },
      { name: 'Đọc có biên', detail: 'Đọc kỹ đúng những mục liên quan, vừa đọc vừa ghi bên lề: đây là dữ kiện, đây là suy luận của tác giả, đây là chỗ tôi chưa đồng ý.' },
      { name: 'Đóng và tóm tắt', detail: 'Đóng tài liệu, viết câu trả lời cho từng câu hỏi ban đầu bằng lời của mình, và ghi rõ câu nào tài liệu KHÔNG trả lời được.' },
    ],
    scenario:
      'Một freelancer nhận bản mô tả công việc dài 38 trang từ khách hàng mới và định đọc hết trước khi báo giá. Anh đổi cách: viết ra bốn câu hỏi — phạm vi bàn giao gồm gì, ai nghiệm thu, số vòng sửa tối đa, điều kiện thanh toán — rồi dùng mục lục và tìm kiếm để tới thẳng bốn phần đó trong 25 phút. Anh phát hiện tài liệu không nói gì về số vòng sửa, hỏi lại khách và đưa giới hạn ba vòng vào hợp đồng. Dự án kết thúc đúng ngân sách trong khi hai dự án trước đó đều tràn ở khâu sửa.',
    comparison: [
      { weak: 'Đọc tuần tự từ trang 1, tô vàng bất cứ câu nào nghe quan trọng.', mature: 'Quét cấu trúc trước, chọn 3-5 mục để đọc kỹ, phần còn lại chỉ lướt tiêu đề và ghi vị trí để quay lại nếu cần.' },
      { weak: 'Kết thúc buổi đọc với một tài liệu đầy vệt màu và không có ghi chú riêng nào.', mature: 'Kết thúc với một trang tóm tắt bằng lời của mình, có phần “tài liệu không trả lời được” viết tách riêng.' },
      { weak: 'Đọc thấy có lý là ghi nhận như dữ kiện.', mature: 'Tách rõ trong ghi chú: câu nào là số liệu, câu nào là suy luận của tác giả, câu nào là ý kiến không có căn cứ kèm theo.' },
    ],
    mistakes: [
      'Tô màu quá nhiều đến mức nửa trang đều vàng, khiến việc tô mất hết chức năng phân biệt và tạo cảm giác đã xử lý xong trong khi chưa hiểu gì thêm.',
      'Đọc một mạch không dừng vì sợ mất mạch, nên không bao giờ kiểm tra xem mình còn nhớ được gì từ mười trang trước.',
      'Nhầm cảm giác đồng tình với việc đã hiểu: văn phong tự tin của tác giả khiến bạn bỏ qua bước hỏi bằng chứng nào đứng sau khẳng định đó.',
    ],
    worksheet: [
      'Tài liệu bạn sắp đọc là gì, và bạn cần ra quyết định gì sau khi đọc xong?',
      'Viết 4 câu hỏi bạn muốn tài liệu trả lời, sắp theo thứ tự quan trọng giảm dần.',
      'Sau khi quét mục lục và kết luận: những mục nào bạn quyết định ĐỌC KỸ, mục nào chỉ lướt, mục nào bỏ hẳn?',
      'Với mỗi câu hỏi ban đầu, tài liệu trả lời ở trang nào, và câu trả lời đó là dữ kiện hay suy luận của tác giả?',
      'Câu hỏi nào tài liệu không trả lời được, và bạn sẽ hỏi ai hoặc tra ở đâu để lấp chỗ đó?',
    ],
    exercises: [
      { label: 'Bốn câu hỏi', text: 'Trước khi mở một tài liệu công việc thật, viết 4 câu hỏi cần được trả lời. Sau khi đọc, đánh dấu câu nào đã có đáp án và câu nào chưa.', level: 'e' },
      { label: 'Quét năm phút', text: 'Chỉ trong 5 phút, đọc mục lục, các tiêu đề và phần kết luận của một tài liệu dài, rồi viết ba câu đoán nội dung chính. Đọc kỹ sau đó để kiểm.', level: 'e' },
      { label: 'Ghi biên ba màu', text: 'Đọc 5 trang và đánh dấu bằng ba ký hiệu khác nhau: dữ kiện có nguồn, suy luận của tác giả, ý kiến không kèm căn cứ. Đếm tỷ lệ ba loại.', level: 'e' },
      { label: 'Tóm tắt đóng sách', text: 'Sau mỗi mục, đóng tài liệu và viết ba câu tóm tắt bằng lời của bạn. Mở lại và bổ sung chính xác những gì bạn bỏ sót.', level: 'm' },
      { label: 'Săn điều khoản', text: 'Lấy một hợp đồng hoặc chính sách thật và trong 20 phút tìm cho ra: nghĩa vụ của bạn, các ngoại lệ, điều kiện chấm dứt. Ghi số trang từng mục.', level: 'm' },
      { label: 'Ba tầng đọc', text: 'Với một bài dài, đọc lần một chỉ tiêu đề, lần hai câu đầu mỗi đoạn, lần ba toàn văn phần bạn chọn. Ghi lại lần nào cho bạn nhiều thông tin nhất trên mỗi phút.', level: 'm' },
      { label: 'Bản đọc bảo vệ được', text: 'Đọc một báo cáo dài và viết một trang tóm tắt cho sếp hoặc khách hàng, trong đó nêu rõ ba kết luận, căn cứ của từng kết luận và hai điểm còn chưa chắc chắn.', level: 'h' },
      { label: 'Bảy ngày một tài liệu', text: 'Thử thách 7 ngày: mỗi ngày đọc một tài liệu chuyên môn theo đúng bốn bước và nộp một trang tóm tắt. Ngày 7, so trang tóm tắt cuối với trang đầu về độ ngắn và độ rõ.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên viết câu hỏi TRƯỚC khi đọc, thay vì đọc rồi mới biết cần hỏi gì?',
        a: 'Vì câu hỏi tạo ra bộ lọc chú ý: bạn sẽ nhận ra thông tin liên quan ngay khi lướt qua nó, và biết chỗ nào có thể bỏ. Không có câu hỏi thì mọi đoạn đều có vẻ đáng đọc, và bạn kết thúc với cảm giác đã đọc rất nhiều mà không rút ra được quyết định nào.',
      },
      {
        q: 'Phân biệt dữ kiện và suy luận của tác giả trong lúc đọc để làm gì?',
        a: 'Để biết chỗ nào có thể trích dẫn và chỗ nào phải tự kiểm chứng. Một con số có nguồn thì bạn dùng lại được; một kết luận tác giả rút ra từ con số đó có thể sai dù con số đúng. Nếu ghi chú trộn lẫn hai loại, ba tháng sau bạn sẽ trích dẫn ý kiến như thể nó là dữ liệu.',
      },
      {
        q: 'Bạn đọc xong 40 trang nhưng không nhớ gì. Hỏng ở bước nào?',
        a: 'Ở bước đóng và tóm tắt, và thường cũng ở bước vào với câu hỏi. Đọc không có điểm dừng nào để tự truy xuất thì không tạo trí nhớ. Cách chữa rẻ nhất là cứ sau mỗi mục thì đóng tài liệu và viết ba câu bằng lời mình trước khi đi tiếp.',
      },
    ],
    plan7:
      'Ngày 1: chọn một tài liệu công việc thật, viết 4 câu hỏi và quét cấu trúc trong 5 phút. Ngày 2: đọc kỹ các mục đã chọn với ghi biên ba loại. Ngày 3: viết trang tóm tắt đầu tiên và ghi rõ phần tài liệu không trả lời được. Ngày 4: đi hỏi hoặc tra để lấp phần thiếu. Ngày 5: áp dụng bài săn điều khoản lên một hợp đồng hoặc chính sách thật. Ngày 6: thử ba tầng đọc trên một bài dài và đo thông tin thu được mỗi phút. Ngày 7: viết một trang tóm tắt gửi cho một người thật và xin họ chỉ ra chỗ chưa rõ.',
    evidence:
      'Giữ lại các trang tóm tắt một trang bạn viết cho tài liệu thật, đặc biệt những bản có phần “điểm còn chưa chắc chắn”. Đó là mẫu vật cho thấy bạn đọc để ra quyết định chứ không đọc để cho xong, và trong phỏng vấn nó trả lời trực tiếp câu “bạn xử lý một đống tài liệu chưa quen thế nào” bằng một sản phẩm cụ thể thay vì bằng lời mô tả.',
    references: [
      { label: 'Cornell Learning Strategies Center — kỹ thuật đọc và ghi chép', url: 'https://lsc.cornell.edu/', type: 'article', needsReview: true },
    ],
    diagram: 'flow',
  }),

  // ── Chương 7 ─────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Ghi chép có giá trị khi nó được dùng lại, không phải khi nó được lưu. Một hệ thống tri thức cá nhân tốt trả lời nhanh ba câu hỏi: chuyện gì đã được quyết, vì sao quyết như vậy, và tôi đã học được gì mà lần sau nên làm khác. Mọi thứ không phục vụ ba câu đó chỉ là gánh nặng bảo trì.',
    why: {
      work:
        'Trong nhóm nhiều người và nhiều tháng, thứ đắt nhất không phải là thông tin bị mất mà là tranh luận lại một quyết định đã từng cân nhắc kỹ; một decision log ngắn cắt hẳn loại lãng phí đó.',
      interview:
        'Portfolio kèm ghi chép quyết định cho thấy cách bạn suy nghĩ, không chỉ sản phẩm cuối. Người phỏng vấn hỏi “vì sao chọn phương án này” thì bạn có sẵn cả các phương án đã loại và lý do loại.',
      study:
        'Ghi chép nối được với nhau biến một học kỳ rời rạc thành một mạng khái niệm, nhờ đó ôn tập là đi lại các liên kết chứ không phải đọc lại từng chương.',
      life:
        'Ghi lại các quyết định lớn của đời sống — chọn trường cho con, đổi chỗ ở, mua một khoản lớn — kèm lý do tại thời điểm đó giúp bạn học từ chính mình thay vì viết lại lịch sử theo kết quả.',
    },
    framework: [
      { name: 'Bắt nhanh', detail: 'Ghi thô ngay lúc gặp: nguồn, ý chính, và một câu vì sao nó liên quan tới bạn. Đừng chỉnh sửa ở bước này, chỉ cần không mất.' },
      { name: 'Viết lại', detail: 'Trong vòng 48 giờ, viết lại bằng lời của bạn ở dạng một ý một ghi chú, có tiêu đề là một khẳng định chứ không phải một chủ đề.' },
      { name: 'Nối', detail: 'Gắn ghi chú mới với ít nhất một ghi chú cũ và một dự án đang chạy. Ghi chú không có liên kết nào gần như chắc chắn sẽ không bao giờ được đọc lại.' },
      { name: 'Tách quyết định', detail: 'Rút riêng ra decision log: quyết định gì, ngày nào, người quyết, các phương án đã loại, và điều kiện nào sẽ khiến xem lại quyết định đó.' },
      { name: 'Dọn định kỳ', detail: 'Mỗi tháng xoá hoặc gộp những ghi chú chưa dùng lần nào, để kích thước hệ thống phản ánh lượng kiến thức đang sống chứ không phải lượng đã thu thập.' },
    ],
    scenario:
      'Một trưởng nhóm kỹ thuật nhận thấy mỗi biên bản họp dài 12 trang mà không ai đọc lại. Anh đổi cấu trúc: biên bản diễn biến để riêng, còn ba dòng quyết định — nội dung, người chịu trách nhiệm, hạn — được tách sang một decision log chung. Hai tuần sau, khi một thành viên mới đề nghị đổi lại kiến trúc lưu trữ, anh mở decision log ra trong 20 giây và cả nhóm đọc được cả hai phương án đã bị loại kèm lý do. Cuộc họp đáng lẽ mất một giờ kết thúc trong mười phút.',
    comparison: [
      { weak: 'Lưu lại mọi bài viết hay, mọi ảnh chụp màn hình, mọi tab thú vị.', mature: 'Chỉ lưu thứ gắn với một câu hỏi hoặc một dự án đang có, phần còn lại chấp nhận để mất.' },
      { weak: 'Ghi chú đặt tên theo chủ đề, ví dụ “Kiến trúc hệ thống”.', mature: 'Ghi chú đặt tên bằng một khẳng định, ví dụ “Tách đọc và ghi làm tăng chi phí đồng bộ dữ liệu”.' },
      { weak: 'Trộn diễn biến cuộc họp với các quyết định trong cùng một văn bản.', mature: 'Tách decision log riêng, mỗi dòng có ngày, người quyết và điều kiện xem lại.' },
      { weak: 'Đổi công cụ ghi chép mỗi khi thấy một ứng dụng mới hấp dẫn.', mature: 'Giữ nguyên công cụ ít nhất sáu tháng và chỉ đổi khi chỉ ra được thao tác cụ thể mà công cụ hiện tại không làm được.' },
    ],
    mistakes: [
      'Xây phân loại nhiều tầng ngay từ đầu, tốn nhiều thời gian sắp xếp hơn thời gian viết và đọc lại nội dung thực sự.',
      'Sưu tầm công cụ thay vì sưu tầm thói quen: cài năm ứng dụng ghi chú trong một năm mà không có tuần nào thật sự viết lại ghi chú bằng lời của mình.',
      'Không bao giờ dọn, khiến sau hai năm hệ thống chứa hàng nghìn mẩu chưa xử lý và bạn tin rằng tìm trên Google còn nhanh hơn tìm trong kho của mình — điều đó thường đúng, và đó là dấu hiệu hệ thống đã chết.',
    ],
    worksheet: [
      'Lần gần nhất bạn MỞ LẠI một ghi chú cũ là khi nào, và ghi chú đó thuộc loại gì?',
      'Liệt kê ba quyết định quan trọng nhóm bạn đã ra trong tháng qua. Với mỗi cái, bạn có ghi lại phương án bị loại và lý do không?',
      'Chọn một ghi chú hiện có và đổi tiêu đề của nó thành một câu khẳng định. Câu đó có còn đúng không?',
      'Ghi chú nào trong kho của bạn chưa từng được liên kết tới bất cứ ghi chú nào khác? Chọn ba cái và nối hoặc xoá.',
      'Nếu ngày mai bạn bàn giao công việc cho người khác, tài liệu nào của bạn họ sẽ đọc đầu tiên, và nó có đủ để họ bắt đầu không?',
    ],
    exercises: [
      { label: 'Đổi tiêu đề', text: 'Lấy 10 ghi chú cũ và đổi tiêu đề từ danh từ chủ đề sang một câu khẳng định có thể đúng hoặc sai. Đánh dấu cái nào giờ nhìn ra là mơ hồ.', level: 'e' },
      { label: 'Ba dòng quyết định', text: 'Sau cuộc họp gần nhất, viết ra đúng ba dòng: quyết định, người chịu trách nhiệm, hạn chót. Gửi cho những người dự họp và xem có ai phản đối cách hiểu của bạn không.', level: 'e' },
      { label: 'Viết lại 48 giờ', text: 'Chọn ba mẩu bắt nhanh trong tuần và viết lại bằng lời của bạn, mỗi mẩu một ý, kèm nguồn gốc. Ghi thời gian bạn cần cho mỗi mẩu.', level: 'e' },
      { label: 'Nối mạng', text: 'Với 15 ghi chú gần nhất, buộc mỗi cái phải liên kết tới ít nhất một ghi chú khác. Cái nào không nối được thì hỏi lý do bạn giữ nó.', level: 'm' },
      { label: 'Decision log một tháng', text: 'Dựng bảng decision log cho nhóm với các cột: ngày, quyết định, phương án loại, lý do, điều kiện xem lại. Nhập ngược lại mọi quyết định của tháng vừa qua.', level: 'm' },
      { label: 'Bài kiểm tra tìm lại', text: 'Nhờ đồng nghiệp hỏi bạn 5 câu về việc nhóm đã làm trong quý. Bấm giờ xem bạn tìm được câu trả lời trong kho ghi chép mất bao lâu mỗi câu.', level: 'm' },
      { label: 'Sổ tay bàn giao', text: 'Viết một tài liệu onboarding cho người thay bạn trong một mảng: các quyết định nền, các cạm bẫy đã gặp, những chỗ tài liệu chính thức nói sai. Nhờ một người thật đọc thử và ghi lại mọi chỗ họ hỏi thêm.', level: 'h' },
      { label: 'Bảy ngày dọn kho', text: 'Thử thách 7 ngày: mỗi ngày 20 phút, xử lý dứt điểm phần bắt nhanh chưa xử lý — viết lại, nối, hoặc xoá. Ngày 7 báo cáo số ghi chú đã xoá và số ghi chú đã trở nên dùng được.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao đặt tiêu đề ghi chú bằng một khẳng định lại tốt hơn đặt bằng tên chủ đề?',
        a: 'Vì khẳng định có thể đúng hoặc sai, nên nó ép bạn viết một nội dung có lập trường và có thể kiểm chứng. Tiêu đề chủ đề như “Cache” cho phép mọi thứ được nhét vào bên dưới, dẫn tới những ghi chú dài không có kết luận và không dùng lại được.',
      },
      {
        q: 'Decision log khác biên bản họp ở điểm nào, và vì sao phải tách?',
        a: 'Biên bản ghi diễn biến, decision log ghi kết quả cùng lý do và điều kiện xem lại. Tách ra vì hai thứ có tuổi thọ khác nhau: diễn biến hết giá trị sau một tuần, còn quyết định được tra lại nhiều tháng sau. Trộn lẫn khiến phần đáng giá bị chôn trong phần không đáng đọc.',
      },
      {
        q: 'Làm sao biết hệ thống ghi chép của bạn đang chết?',
        a: 'Khi bạn tìm Google trước và tìm kho của mình sau, khi nhiều tháng liền không có ghi chú cũ nào được mở lại, và khi phần lớn nội dung vẫn ở dạng bắt nhanh chưa viết lại. Ba dấu hiệu đó nói rằng bạn đang trả chi phí lưu trữ mà không nhận lại giá trị nào.',
      },
    ],
    plan7:
      'Ngày 1: kiểm kê xem có bao nhiêu mẩu bắt nhanh chưa xử lý và lần cuối bạn mở ghi chú cũ là khi nào. Ngày 2: đổi tiêu đề 10 ghi chú sang dạng khẳng định. Ngày 3: dựng decision log và nhập ngược quyết định của tháng qua. Ngày 4: viết lại ba mẩu bắt nhanh bằng lời của mình. Ngày 5: buộc 15 ghi chú gần nhất phải có liên kết. Ngày 6: nhờ đồng nghiệp kiểm tra tốc độ tìm lại thông tin. Ngày 7: dọn — xoá hoặc gộp mọi thứ chưa dùng lần nào và ghi lại con số.',
    evidence:
      'Một decision log thật (đã ẩn thông tin nhạy cảm) và một tài liệu onboarding do bạn viết là hai vật chứng mạnh trong portfolio. Chúng cho thấy bạn để lại tài sản dùng được cho người sau chứ không chỉ hoàn thành phần việc của mình — đây chính là tiêu chí phân biệt ứng viên cấp trung và ứng viên cấp cao ở phần lớn thang đánh giá.',
    references: [
      { label: 'Zettelkasten.de — phương pháp ghi chép liên kết', url: 'https://zettelkasten.de/', type: 'article', needsReview: true },
      { label: 'Andy Matuschak — Evergreen notes (ghi chú viết để dùng lại)', url: 'https://notes.andymatuschak.org/', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 8 ─────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Nghiên cứu là một quy trình có điểm dừng, không phải hoạt động đọc mãi cho tới khi hết lo lắng. Bạn định nghĩa câu hỏi và tiêu chí đủ trước khi tìm, ưu tiên nguồn gần gốc nhất, và kết thúc bằng một ghi chép nêu rõ bạn biết gì, biết nhờ đâu, và còn chưa biết gì.',
    why: {
      work:
        'Chọn nhà cung cấp, chọn thư viện, chọn cách làm — mọi quyết định loại này đều đứng trên chất lượng nghiên cứu; một bảng so sánh có nguồn giúp cả nhóm tranh luận về tiêu chí thay vì tranh luận về cảm tính.',
      interview:
        'Khi được hỏi một vấn đề chuyên môn bạn chưa nắm chắc, câu trả lời tốt nhất thường là nêu đâu là nguồn chuẩn và bạn sẽ kiểm chứng bằng thử nghiệm nào — điều đó đáng tin hơn một câu khẳng định lấy từ trí nhớ mờ.',
      study:
        'Làm tiểu luận hay đồ án, kỹ năng đi từ tổng quan tới nguồn sơ cấp quyết định việc bài của bạn có nội dung riêng hay chỉ là tập hợp lại các bài blog đã có.',
      life:
        'Trước một quyết định lớn của cá nhân — chọn khoá học cho con, mua thiết bị đắt tiền, so sánh gói dịch vụ — cùng quy trình đó giúp bạn tránh mua theo bài viết được tài trợ.',
    },
    framework: [
      { name: 'Đóng khung câu hỏi', detail: 'Viết câu hỏi ở dạng có thể trả lời được, kèm luôn tiêu chí dừng: cần bao nhiêu nguồn độc lập, cần trả lời được mấy điểm thì đủ để ra quyết định.' },
      { name: 'Dựng bộ từ khoá', detail: 'Liệt kê từ đồng nghĩa, thuật ngữ tiếng Anh, tên riêng của sản phẩm và tên tiêu chuẩn. Chất lượng kết quả tìm phụ thuộc vào bộ từ này nhiều hơn phụ thuộc vào công cụ tìm.' },
      { name: 'Leo về gốc', detail: 'Từ blog đi ngược tới tài liệu chính thức, mã nguồn, biên bản, tiêu chuẩn hoặc bài nghiên cứu gốc. Bài viết trung gian dùng để tìm đường, không dùng làm căn cứ cuối.' },
      { name: 'Ghi hồ sơ', detail: 'Với mỗi nguồn: đường dẫn, ngày truy cập, phiên bản, phát hiện chính, giới hạn. Ba tháng sau bạn sẽ không nhớ nổi vì sao mình tin điều đó.' },
      { name: 'Kết luận có mức tin', detail: 'Viết câu trả lời kèm mức độ chắc chắn và ghi rõ những khoảng trống còn lại, thay vì trình bày mọi thứ với cùng một giọng khẳng định.' },
    ],
    scenario:
      'Một người làm sản phẩm cần chọn cổng thanh toán cho ứng dụng bán hàng. Ban đầu cô đọc năm bài so sánh trên blog và gần như chốt theo bài xếp hạng đầu tiên. Cô dừng lại, viết bốn câu hỏi — phí thực tế trên mỗi giao dịch nội địa, thời gian đối soát, tài liệu hoàn tiền, giới hạn ngành hàng — rồi tra thẳng trang tài liệu chính thức và bảng phí của từng nhà cung cấp, ghi ngày truy cập vì phí có thể đổi. Kết quả: hai trong năm bài blog dẫn mức phí đã cũ, và lựa chọn cuối cùng khác hẳn phương án cô suýt chốt.',
    comparison: [
      { weak: 'Dừng ở đoạn trích ngắn hiện ra trong trang kết quả tìm kiếm.', mature: 'Mở nguồn, xác định ai viết, viết khi nào, và đối chiếu với tài liệu gốc mà nguồn đó dẫn.' },
      { weak: 'Chỉ đọc tiếp những nguồn xác nhận điều mình đã nghiêng về.', mature: 'Chủ động tìm bằng một truy vấn ngược lại giả thuyết của mình và đọc kỹ nguồn nào phản bác.' },
      { weak: 'Nghiên cứu tới khi hết cảm giác bất an, thường là không bao giờ.', mature: 'Đặt tiêu chí dừng ngay từ đầu và dừng đúng lúc đạt, ghi rõ phần chưa chắc thay vì đọc thêm vô hạn.' },
    ],
    mistakes: [
      'Không ghi phiên bản và ngày truy cập, nên sáu tháng sau không phân biệt được thông tin đã lỗi thời với thông tin bạn nhớ nhầm.',
      'Coi số lượng nguồn là bằng chứng: mười bài blog cùng chép lại một thông cáo báo chí vẫn chỉ là một nguồn duy nhất.',
      'Bỏ qua bước viết ra khoảng trống, khiến báo cáo trình bày mọi kết luận với cùng một mức tự tin và người đọc không biết chỗ nào cần thận trọng.',
    ],
    worksheet: [
      'Câu hỏi nghiên cứu của bạn là gì, và quyết định nào sẽ thay đổi tuỳ theo câu trả lời?',
      'Viết tiêu chí dừng: bạn cần bao nhiêu nguồn độc lập và trả lời được mấy điểm thì coi là đủ để quyết?',
      'Liệt kê ít nhất 8 từ khoá gồm cả biến thể tiếng Anh, tên riêng và tên tiêu chuẩn liên quan.',
      'Với mỗi nguồn đã thu: ai viết, viết khi nào, họ được lợi gì nếu bạn tin theo, và họ dẫn lại từ đâu?',
      'Sau khi dừng: viết ba câu kết luận kèm mức tin cậy, và một danh sách những gì bạn vẫn chưa biết.',
    ],
    exercises: [
      { label: 'Đóng khung lại', text: 'Lấy một chủ đề bạn đang tìm hiểu và viết lại nó thành câu hỏi có thể trả lời được, kèm tiêu chí dừng bằng con số.', level: 'e' },
      { label: 'Bộ từ khoá', text: 'Với một câu hỏi cụ thể, viết 10 từ khoá gồm biến thể tiếng Việt, tiếng Anh và tên riêng. So số kết quả hữu ích giữa từ khoá đầu và từ khoá thứ mười.', level: 'e' },
      { label: 'Leo một bậc', text: 'Chọn một bài blog bạn tin và truy cho ra nguồn nó dẫn. Ghi lại thông tin có bị đổi nghĩa khi chuyển từ nguồn gốc sang bài blog không.', level: 'e' },
      { label: 'Hồ sơ nguồn', text: 'Dựng bảng năm cột — đường dẫn, ngày truy cập, phiên bản, phát hiện, giới hạn — và điền cho 6 nguồn của một câu hỏi thật.', level: 'm' },
      { label: 'Truy vấn ngược', text: 'Viết một truy vấn tìm kiếm nhằm chứng minh giả thuyết của bạn SAI. Đọc ba kết quả đầu và ghi lại điều gì làm bạn phải điều chỉnh.', level: 'm' },
      { label: 'So sánh có tiêu chí', text: 'Lập bảng so sánh 3 lựa chọn theo 5 tiêu chí, mỗi ô phải kèm nguồn. Đánh dấu những ô bạn không tìm được nguồn chính thức.', level: 'm' },
      { label: 'Báo cáo nửa trang', text: 'Viết báo cáo nghiên cứu nửa trang cho một quyết định thật, gồm kết luận, mức tin cậy, ba nguồn chính và phần chưa biết. Gửi cho người sẽ dùng nó và ghi lại phản hồi.', level: 'h' },
      { label: 'Bảy ngày một câu hỏi', text: 'Thử thách 7 ngày: mỗi ngày 30 phút cho đúng một câu hỏi nghiên cứu, dừng khi đạt tiêu chí đã viết. Ngày 7 nhìn lại xem có ngày nào bạn phá vỡ tiêu chí dừng và vì sao.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao mười bài viết cùng nói một điều chưa chắc mạnh hơn một nguồn duy nhất?',
        a: 'Vì chúng có thể cùng dẫn lại một nguồn gốc, thậm chí chép lẫn nhau. Bằng chứng chỉ mạnh lên khi các nguồn độc lập về dữ liệu và phương pháp. Cách kiểm nhanh là truy ngược từng bài xem chúng có hội tụ về một tài liệu duy nhất hay không.',
      },
      {
        q: 'Tiêu chí dừng có tác dụng gì trong nghiên cứu?',
        a: 'Nó chuyển việc dừng từ trạng thái cảm xúc sang một điều kiện kiểm được. Không có tiêu chí, bạn đọc tới khi mệt hoặc tới khi hết thời gian, và cả hai đều không liên quan tới việc đã đủ thông tin để quyết chưa. Có tiêu chí, bạn biết mình dừng vì đủ, hoặc biết rõ mình đang dừng sớm.',
      },
      {
        q: 'Vì sao phải ghi ngày truy cập và phiên bản cho nguồn kỹ thuật?',
        a: 'Vì tài liệu sản phẩm, bảng giá và API thay đổi liên tục mà đường dẫn thì không đổi. Không có ngày và phiên bản, bạn không phân biệt được giữa “tài liệu đã cập nhật” và “tôi đọc sai”, và không thể tái lập lại kết luận cũ để kiểm tra.',
      },
    ],
    plan7:
      'Ngày 1: chọn một quyết định thật, viết câu hỏi và tiêu chí dừng. Ngày 2: dựng bộ từ khoá và thu 8 nguồn thô. Ngày 3: leo về gốc cho từng nguồn, loại những nguồn chỉ chép lại. Ngày 4: điền hồ sơ nguồn năm cột. Ngày 5: chạy truy vấn ngược để tìm bằng chứng phản bác. Ngày 6: lập bảng so sánh có tiêu chí, mỗi ô kèm nguồn. Ngày 7: viết báo cáo nửa trang kèm mức tin cậy và phần chưa biết, gửi cho người sẽ dùng nó.',
    evidence:
      'Một báo cáo nghiên cứu nửa trang kèm bảng hồ sơ nguồn là thứ bạn có thể đính thẳng vào portfolio hoặc mang tới vòng phỏng vấn tình huống. Điểm gây ấn tượng không nằm ở kết luận mà ở phần “tôi chưa biết” và ở việc bạn ghi ngày truy cập — hai chi tiết cho thấy bạn làm việc với thông tin một cách có kỷ luật.',
    references: [
      { label: 'Google Scholar — tìm nguồn nghiên cứu sơ cấp', url: 'https://scholar.google.com/', type: 'article', needsReview: true },
      { label: 'MIT Libraries — hướng dẫn hỗ trợ nghiên cứu', url: 'https://libraries.mit.edu/research-support/', type: 'article', needsReview: true },
    ],
    diagram: 'flow',
  }),

  // ── Chương 9 ─────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Kiểm chứng nguồn tin là thói quen hỏi ba câu trước khi tin hoặc chia sẻ: con số này đo cái gì, ai đo và trên mẫu nào, và người công bố được lợi gì nếu tôi tin. Kỹ năng này không đòi hỏi bạn thành chuyên gia thống kê; nó chỉ đòi hỏi bạn chịu dừng lại vài phút trước khi để một khẳng định bước vào quyết định của mình.',
    why: {
      work:
        'Một con số sai trong slide chiến lược có thể dẫn tới đầu tư sai nhiều tháng; người dám hỏi “số này lấy từ đâu” trong cuộc họp thường tiết kiệm cho công ty nhiều hơn bất kỳ ai trình bày trơn tru.',
      interview:
        'Nếu bạn dẫn số liệu trong câu trả lời, hãy sẵn sàng nói định nghĩa, cỡ mẫu và giới hạn. Khả năng nói “dữ liệu chưa đủ để kết luận” là điểm cộng chứ không phải điểm trừ.',
      study:
        'Bài viết học thuật, luận văn hay bài đăng đều đòi hỏi bạn tách khẳng định khỏi bằng chứng; ai không làm được sẽ trích dẫn một ý kiến như thể nó là kết quả nghiên cứu.',
      life:
        'Tin về sức khoẻ, đầu tư và giáo dục lan rất nhanh dưới dạng infographic không nguồn. Vài phút kiểm chứng ngăn bạn ra một quyết định gia đình dựa trên một khảo sát do chính bên bán dịch vụ thực hiện.',
    },
    framework: [
      { name: 'Dừng lại', detail: 'Trước khi tin hoặc chia sẻ, dừng đúng một nhịp và nhận diện phản ứng cảm xúc của mình. Nội dung càng làm bạn phấn khích hoặc phẫn nộ thì càng đáng kiểm.' },
      { name: 'Truy về gốc', detail: 'Tìm bản gốc của khẳng định: bài nghiên cứu, báo cáo, thông cáo. Bài đang đọc thường chỉ là bản dẫn lại thứ ba hoặc thứ tư, và mỗi lần dẫn lại là một lần nghĩa bị bóp méo.' },
      { name: 'Soi phương pháp', detail: 'Xem ai tài trợ, cỡ mẫu bao nhiêu, chọn mẫu thế nào, đo bằng chỉ số gì, khảo sát vào thời điểm nào. Một khảo sát 80 khách hàng của chính công ty bán khoá học không nói được gì về thị trường.' },
      { name: 'Đối chiếu độc lập', detail: 'Tìm ít nhất một nguồn độc lập về dữ liệu, và cố tình tìm cả nguồn phản bác. Nếu chỉ có một nơi duy nhất nói điều đó, hãy hạ mức tin xuống.' },
      { name: 'Gắn mức tin', detail: 'Kết luận bằng một trong bốn nhãn: chắc chắn, có khả năng, chưa đủ bằng chứng, hoặc sai — và nói nhãn đó ra khi chia sẻ lại.' },
    ],
    scenario:
      'Một nhân viên marketing thấy infographic viết “90% nhà tuyển dụng ưu tiên kỹ năng mềm hơn bằng cấp” và định đưa vào bài đăng của công ty. Cô truy ngược: infographic dẫn một bài báo, bài báo dẫn một thông cáo, thông cáo dẫn khảo sát 80 khách hàng của chính đơn vị bán khoá học kỹ năng mềm, thực hiện ba năm trước. Cô bỏ con số khỏi bài đăng và thay bằng một ví dụ cụ thể của chính công ty. Bài vẫn chạy, và tránh được nguy cơ bị một ứng viên phản bác công khai.',
    comparison: [
      { weak: 'Đánh giá độ tin cậy bằng tên miền nghe uy tín hoặc bằng số lượt chia sẻ.', mature: 'Đánh giá bằng phương pháp: ai đo, đo cái gì, trên mẫu nào, có xung đột lợi ích không.' },
      { weak: 'Nói “nghiên cứu cho thấy” mà không biết là nghiên cứu nào.', mature: 'Dẫn tên nghiên cứu, năm, cỡ mẫu, và nêu luôn giới hạn mà chính tác giả thừa nhận.' },
      { weak: 'Coi việc không tìm thấy bằng chứng phản bác là bằng chứng ủng hộ.', mature: 'Phân biệt rõ “chưa đủ bằng chứng” với “đã có bằng chứng cho thấy đúng”, và dám dừng ở nhãn thứ nhất.' },
    ],
    mistakes: [
      'Kiểm chứng chọn lọc: soi rất kỹ những thông tin trái với quan điểm của mình và cho qua ngay những thông tin thuận theo nó.',
      'Nhầm tương quan với nhân quả khi đọc kết quả khảo sát, rồi rút ra khuyến nghị hành động mà dữ liệu không hề đỡ được.',
      'Dùng uy tín cá nhân người nói làm bằng chứng thay cho phương pháp, kể cả khi người đó phát biểu ngoài lĩnh vực chuyên môn của họ.',
    ],
    worksheet: [
      'Khẳng định bạn đang định tin hoặc chia sẻ là gì? Chép nguyên văn nó ra.',
      'Nguồn gốc thật sự của khẳng định này là gì — bạn đã leo được mấy bậc trước khi tới tài liệu gốc?',
      'Ai bỏ tiền cho nghiên cứu hoặc khảo sát này, và họ được lợi gì nếu bạn tin theo?',
      'Con số này đo chính xác cái gì, trên bao nhiêu người, chọn thế nào và vào thời điểm nào?',
      'Bạn gắn nhãn nào cho khẳng định này — chắc chắn, có khả năng, chưa đủ bằng chứng, hay sai — và bạn sẽ nói nhãn đó ra khi chia sẻ chứ?',
    ],
    exercises: [
      { label: 'Leo ba bậc', text: 'Chọn một con số bạn thấy trên mạng xã hội tuần này và truy ngược tối đa ba bậc. Ghi lại nghĩa bị đổi ở mỗi bậc.', level: 'e' },
      { label: 'Ba câu hỏi', text: 'Với ba tin tức bất kỳ hôm nay, trả lời bộ ba câu: đo cái gì, ai đo trên mẫu nào, ai được lợi. Bao nhiêu tin bạn trả lời được cả ba?', level: 'e' },
      { label: 'Gắn nhãn', text: 'Lấy 5 khẳng định trong một bài viết và gắn cho mỗi cái một trong bốn nhãn tin cậy. Viết một dòng lý do cho mỗi nhãn.', level: 'e' },
      { label: 'Soi phương pháp', text: 'Tìm một báo cáo ngành có công bố phần phương pháp và đọc riêng phần đó. Ghi lại cỡ mẫu, cách chọn mẫu và ba giới hạn tác giả tự nêu.', level: 'm' },
      { label: 'Tìm bên phản bác', text: 'Chọn một quan điểm bạn tin và dành 20 phút tìm nguồn nghiêm túc phản bác nó. Viết lại quan điểm của bạn sau khi đọc.', level: 'm' },
      { label: 'Bóc infographic', text: 'Lấy một infographic không ghi nguồn và dựng lại bảng: mỗi số, nguồn tìm được hoặc “không truy được”. Tính tỷ lệ số liệu không truy được.', level: 'm' },
      { label: 'Hỏi trong cuộc họp', text: 'Trong một cuộc họp thật, hỏi một câu về nguồn của một con số theo cách không tấn công người trình bày. Ghi lại phản ứng và điều bạn học được về cách đặt câu hỏi đó.', level: 'h' },
      { label: 'Bảy ngày ba câu hỏi', text: 'Thử thách 7 ngày: mỗi ngày chọn một tin gây phản ứng mạnh với bạn và chạy đủ năm bước kiểm chứng. Ngày 7 thống kê bao nhiêu tin đổi nhãn sau khi kiểm.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nội dung khiến bạn phẫn nộ hoặc phấn khích lại cần kiểm chứng kỹ hơn?',
        a: 'Vì phản ứng cảm xúc mạnh làm giảm khả năng đặt câu hỏi, đồng thời làm tăng khả năng bạn chia sẻ lại ngay. Nội dung được thiết kế để lan truyền thường nhắm chính xác vào phản ứng đó, nên xác suất nó đã bị cắt gọt cho giật gân cao hơn mức trung bình.',
      },
      {
        q: 'Một khảo sát có cỡ mẫu 5.000 người thì đã đáng tin chưa?',
        a: 'Chưa chắc. Cỡ mẫu lớn không sửa được lỗi chọn mẫu: 5.000 người tự nguyện trả lời trên trang của một nhãn hàng vẫn chỉ đại diện cho nhóm khách hàng của nhãn đó. Câu hỏi quan trọng hơn là mẫu được chọn thế nào và ai bị bỏ sót khỏi mẫu.',
      },
      {
        q: 'Khi nào bạn nên dừng ở nhãn “chưa đủ bằng chứng” thay vì cố kết luận?',
        a: 'Khi bạn chỉ tìm được một nguồn duy nhất, khi các nguồn đều dẫn lại cùng một gốc, hoặc khi nguồn gốc không công bố phương pháp. Nói ra nhãn này không phải là né tránh; nó cho người nghe biết mức rủi ro thật của quyết định dựa trên thông tin đó.',
      },
    ],
    plan7:
      'Ngày 1: chọn một khẳng định đang lan truyền và chép nguyên văn, ghi phản ứng cảm xúc của bạn. Ngày 2: truy ngược tới nguồn gốc, ghi số bậc phải leo. Ngày 3: đọc phần phương pháp của nguồn gốc và ghi cỡ mẫu, cách chọn mẫu, nhà tài trợ. Ngày 4: tìm một nguồn độc lập. Ngày 5: dành 20 phút tìm bằng chứng phản bác. Ngày 6: gắn nhãn tin cậy và viết lại khẳng định theo mức đó. Ngày 7: chia sẻ bản đã hiệu chỉnh cho một người và quan sát họ phản ứng thế nào với phần “chưa chắc”.',
    evidence:
      'Viết một bài ngắn dạng bóc tách: nêu khẳng định đang lan truyền, các bậc bạn đã leo, phương pháp thật của nguồn gốc, và kết luận có nhãn tin cậy. Một hoặc hai bài như vậy trên blog cá nhân hoặc trên kênh nội bộ chứng minh bạn không lan truyền thông tin thiếu kiểm chứng — điều rất có giá trị với các vị trí liên quan tới nội dung, dữ liệu, truyền thông và quản lý.',
    references: [
      { label: 'Poynter — International Fact-Checking Network', url: 'https://www.poynter.org/ifcn/', type: 'article', needsReview: true },
      { label: 'Snopes — kho kiểm chứng tin đồn và tin sai', url: 'https://www.snopes.com/', type: 'article', needsReview: true },
    ],
    diagram: 'flow',
  }),

  // ── Chương 10 ────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Tự học một kỹ năng mới là bài toán thiết kế chứ không phải bài toán ý chí. Bạn nhìn vào đầu ra thật của người đã làm được, chẩn đoán khoảng cách giữa họ và bạn, rồi dựng một chu kỳ học - làm - nhận phản hồi đủ ngắn để mỗi tuần đều có một sản phẩm thô. Số khoá học đã mua không dự đoán được kết quả; số vòng phản hồi đã đi qua thì có.',
    why: {
      work:
        'Khi công ty triển khai công cụ mới hoặc bạn được giao mảng lạ, người tự dựng được lộ trình sẽ ra kết quả dùng được sau vài tuần thay vì chờ một khoá đào tạo nội bộ có thể không bao giờ diễn ra.',
      interview:
        'Kế hoạch 30 ngày gắn với đúng công việc ứng tuyển, kèm một sản phẩm demo ở cuối, là câu trả lời mạnh nhất cho câu hỏi kinh điển “bạn học một thứ hoàn toàn mới như thế nào”.',
      study:
        'Chương trình học chính quy hiếm khi phủ hết những gì nghề đòi hỏi; năng lực tự thiết kế lộ trình quyết định phần chênh lệch giữa bằng cấp và khả năng làm việc.',
      life:
        'Học bơi, học đàn, học sửa xe đạp cho con — cùng một cấu trúc chu kỳ giúp bạn không bỏ dở ở tuần thứ hai, vì mỗi tuần đều có một thứ nhìn thấy được.',
    },
    framework: [
      { name: 'Soi đầu ra mẫu', detail: 'Tìm 3-5 sản phẩm thật của người đã thành thạo và liệt kê những năng lực cụ thể mà mỗi sản phẩm đòi hỏi. Đây là bản mô tả đích chính xác hơn bất kỳ mục lục khoá học nào.' },
      { name: 'Chẩn đoán', detail: 'Làm ngay một bài thử nhỏ để biết bạn hiện đứng ở đâu. Không có mốc xuất phát thì không có cách nào biết tuần sau bạn có tiến bộ hay không.' },
      { name: 'Cắt lát tối thiểu', detail: 'Chọn lát mỏng nhất của kỹ năng đủ để tạo ra một sản phẩm hoàn chỉnh xấu xí, và học đúng phần cần cho lát đó — bỏ hẳn phần chưa cần.' },
      { name: 'Chu kỳ tuần', detail: 'Mỗi tuần: học vừa đủ, làm một sản phẩm, đưa cho một người có kinh nghiệm hơn nhận xét, ghi lại đúng thứ đang chặn bạn.' },
      { name: 'Nâng độ khó', detail: 'Sau mỗi vòng, tăng một chiều khó: thời gian ngắn hơn, dữ liệu thật hơn, khán giả khó hơn — chứ không phải làm lại thứ cũ nhiều lần.' },
    ],
    scenario:
      'Một nhân viên hành chính được giao làm video ngắn giới thiệu công ty, chưa từng dựng phim. Thay vì mua ba khoá học, cô xem 5 video của các công ty tương tự và liệt kê ra: kịch bản 45 giây, quay bằng điện thoại có ánh sáng ổn, cắt theo nhịp, phụ đề. Tuần 1 cô làm một video 30 giây xấu về đúng phòng mình và gửi cho một người bạn làm truyền thông; phản hồi duy nhất là âm thanh quá tệ. Tuần 2 cô chỉ học về micro và thu tiếng. Đến tuần 5, video tuyển dụng của công ty do cô làm được duyệt mà không cần thuê ngoài.',
    comparison: [
      { weak: 'Bắt đầu bằng việc mua và sưu tầm tài nguyên: ba khoá học, mười cuốn sách, hai mươi video lưu lại.', mature: 'Bắt đầu bằng một sản phẩm xấu trong tuần đầu, và chỉ tìm tài nguyên cho đúng thứ đang chặn.' },
      { weak: 'Học theo thứ tự mục lục từ chương 1 tới chương cuối rồi mới dám làm.', mature: 'Học theo thứ tự nhu cầu của sản phẩm đang làm, chấp nhận mục lục bị nhảy cóc.' },
      { weak: 'Đổi tài nguyên liên tục vì thấy khoá đang học chưa đủ hay.', mature: 'Giữ một tài nguyên chính cho tới hết một chu kỳ, và chỉ đổi khi chỉ ra được câu hỏi cụ thể nó không trả lời được.' },
      { weak: 'Chờ tới khi đủ giỏi mới cho người khác xem.', mature: 'Cho xem từ bản xấu nhất, vì phản hồi sớm rẻ hơn nhiều so với sửa một sản phẩm đã đi sai hướng ba tuần.' },
    ],
    mistakes: [
      'Nhầm việc sưu tầm tài nguyên với việc học: cảm giác an tâm khi lưu một khoá học vào danh sách không tạo ra bất kỳ năng lực nào.',
      'Chọn lát đầu tiên quá dày, ví dụ đặt sản phẩm tuần 1 là một video hoàn chỉnh ba phút có đồ hoạ, dẫn tới không hoàn thành và mất đà.',
      'Không có ai xem sản phẩm, nên bạn tự chấm bằng chính tiêu chuẩn còn non và lặp lại cùng một lỗi qua nhiều tuần.',
    ],
    worksheet: [
      'Kỹ năng bạn muốn tự học là gì, và sản phẩm cuối cùng bạn muốn làm ra trông như thế nào?',
      'Chép ra 3 sản phẩm thật của người đã thành thạo. Mỗi sản phẩm đòi hỏi những năng lực cụ thể nào?',
      'Bài thử 30 phút nào bạn có thể làm ngay hôm nay để biết mình đang đứng ở đâu?',
      'Lát mỏng nhất tạo ra một sản phẩm hoàn chỉnh nhưng xấu là gì? Viết nó ra dưới dạng “tuần này tôi sẽ làm xong ___”.',
      'Ai sẽ xem sản phẩm tuần 1 của bạn và cho một nhận xét thẳng? Viết tên và ngày bạn sẽ gửi.',
    ],
    exercises: [
      { label: 'Ba sản phẩm mẫu', text: 'Sưu tầm 3 sản phẩm thật của người thành thạo trong lĩnh vực bạn học và liệt kê 5 năng lực cụ thể mà mỗi cái đòi hỏi.', level: 'e' },
      { label: 'Bài thử xuất phát', text: 'Làm một bài thử 30 phút ngay hôm nay ở mức bạn đang có. Lưu lại kết quả làm mốc so sánh, kể cả khi nó rất tệ.', level: 'e' },
      { label: 'Cắt lát', text: 'Viết ba phiên bản của sản phẩm tuần 1 theo độ dày giảm dần, rồi chọn phiên bản mỏng nhất vẫn còn là một sản phẩm hoàn chỉnh.', level: 'e' },
      { label: 'Sản phẩm xấu tuần 1', text: 'Hoàn thành một sản phẩm hoàn chỉnh nhưng thô trong tối đa 5 giờ và gửi cho một người có kinh nghiệm. Ghi lại nhận xét đầu tiên họ đưa ra.', level: 'm' },
      { label: 'Nhật ký điểm chặn', text: 'Trong hai tuần, mỗi buổi làm ghi lại đúng một câu: hôm nay tôi bị chặn ở đâu. Cuối hai tuần nhóm các điểm chặn lại và tìm chủ đề chung.', level: 'm' },
      { label: 'Học theo nhu cầu', text: 'Từ danh sách điểm chặn, chọn đúng một mục và tìm tài nguyên chỉ cho mục đó. Đo thời gian từ lúc bị chặn tới lúc gỡ được.', level: 'm' },
      { label: 'Bốn chu kỳ liên tiếp', text: 'Chạy bốn chu kỳ tuần liên tiếp, mỗi tuần một sản phẩm và một người nhận xét khác nhau. Xếp bốn sản phẩm cạnh nhau và viết những gì thay đổi giữa chúng.', level: 'h' },
      { label: 'Bảy ngày ra sản phẩm', text: 'Thử thách 7 ngày: từ con số không tới một sản phẩm hoàn chỉnh công bố được, dù nhỏ. Ngày 7 công bố nó ở nơi có người thật nhìn thấy và ghi lại phản hồi.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên làm một sản phẩm xấu trong tuần đầu thay vì học cho vững rồi mới làm?',
        a: 'Vì sản phẩm xấu tạo ra danh sách điểm chặn cụ thể, và danh sách đó mới là chương trình học đúng cho bạn. Học trước theo mục lục thì bạn học đều tay mọi phần, phần lớn trong đó không phải là thứ đang cản trở bạn.',
      },
      {
        q: 'Chọn lát đầu tiên bao mỏng thì được coi là hợp lý?',
        a: 'Đủ mỏng để hoàn thành trong một tuần với quỹ thời gian thật của bạn, nhưng vẫn phải là một sản phẩm hoàn chỉnh có người xem được. Nếu bạn phải nói “nó chưa xong nhưng ý tưởng là...”, lát vẫn còn quá dày.',
      },
      {
        q: 'Bạn đã đi bốn tuần nhưng cảm giác không tiến bộ. Kiểm tra điều gì trước tiên?',
        a: 'Kiểm tra xem bạn có tăng độ khó qua từng vòng không, và có ai nhận xét bên ngoài không. Lặp lại cùng một mức khó với người chấm duy nhất là chính mình sẽ tạo ra bốn tuần hoạt động mà không có bốn vòng học thật.',
      },
    ],
    plan7:
      'Ngày 1: soi 3 sản phẩm mẫu và liệt kê năng lực đòi hỏi. Ngày 2: làm bài thử xuất phát 30 phút và lưu kết quả. Ngày 3: cắt lát và chốt sản phẩm tuần này, tìm người sẽ nhận xét. Ngày 4-5: làm sản phẩm thô, ghi nhật ký điểm chặn mỗi buổi. Ngày 6: gửi cho người nhận xét và chỉ học đúng phần họ chỉ ra. Ngày 7: sửa theo phản hồi, công bố ở một nơi có người thật nhìn thấy, và viết lát tiếp theo.',
    evidence:
      'Đặt bốn sản phẩm của bốn tuần cạnh nhau trong một trang portfolio, kèm nhật ký điểm chặn và các nhận xét bạn nhận được. Chuỗi này chứng minh tốc độ học của bạn bằng vật chứng có mốc thời gian — thứ mà một chứng chỉ hoàn thành khoá học không thể hiện được, và là thứ người phỏng vấn có thể lật xem ngay trong buổi nói chuyện.',
    references: [
      { label: 'Coursera — thư viện khoá học theo kỹ năng', url: 'https://www.coursera.org/', type: 'article' },
      { label: 'The first 20 hours — how to learn anything (Josh Kaufman, TEDxCSU)', url: 'https://www.youtube.com/watch?v=5MgBikgcWnY', type: 'video', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 11 ────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Luyện tập có chủ đích khác luyện tập thông thường ở ba điểm: bạn nhắm vào một vi kỹ năng đang giới hạn kết quả, bạn luyện ở mức khó vừa vượt khả năng hiện tại, và bạn nhận phản hồi ngay sát thời điểm thực hiện. Thiếu một trong ba, bạn chỉ đang lặp lại thứ mình đã làm được và củng cố cả những lỗi sẵn có.',
    why: {
      work:
        'Mười năm kinh nghiệm có thể chỉ là một năm lặp lại mười lần; luyện có chủ đích là cách duy nhất để thâm niên biến thành năng lực thật sự tăng theo thời gian.',
      interview:
        'Khi kể về việc mình đã cải thiện điều gì, nêu đúng vi kỹ năng, nguồn phản hồi và số vòng sửa sẽ đáng tin hơn nhiều lần so với câu “tôi luyện rất nhiều”.',
      study:
        'Với môn khó, luyện đúng chỗ yếu trong 30 phút thường hiệu quả hơn ba giờ làm lại những bài bạn vốn đã làm được.',
      life:
        'Thể thao, nhạc cụ, nấu ăn — nguyên tắc giống nhau: tách vi kỹ năng, luyện riêng, đo bằng tiêu chí, rồi ghép lại vào bài hoàn chỉnh.',
    },
    framework: [
      { name: 'Tách vi kỹ năng', detail: 'Chia kỹ năng lớn thành các mảnh nhỏ luyện riêng được, và chọn đúng mảnh đang giới hạn kết quả tổng thể chứ không phải mảnh bạn thích luyện nhất.' },
      { name: 'Đặt tiêu chí', detail: 'Trước mỗi lượt, viết ra tiêu chí chấm cụ thể — thời lượng, số lỗi cho phép, dấu hiệu quan sát được — để sau đó có thứ để so, không chấm bằng cảm giác.' },
      { name: 'Luyện ở rìa', detail: 'Chọn độ khó vừa vượt khả năng: đủ để sai vài lần, không quá đến mức sai liên tục và mất tín hiệu. Nếu bạn làm đúng hết, bài tập đang quá dễ.' },
      { name: 'Phản hồi sát', detail: 'Nhận nhận xét càng gần thời điểm thực hiện càng tốt: quay video xem lại ngay, dùng rubric, hoặc nhờ người có kinh nghiệm chấm ngay sau lượt.' },
      { name: 'Lặp và nghỉ', detail: 'Lặp với một thay đổi mỗi lần, và dừng khi chất lượng lượt bắt đầu tụt. Luyện tới kiệt sức chỉ ghi vào trí nhớ những lượt tệ.' },
    ],
    scenario:
      'Một trưởng nhóm bị đánh giá là thuyết trình lan man trong các buổi họp quý. Thay vì nói lại toàn bộ bài mỗi lần tập, anh tách ra và luyện riêng ba vi kỹ năng: mở đầu 60 giây, chuyển ý giữa các phần, và xử lý câu hỏi khó. Mỗi buổi anh chỉ luyện một mảnh, quay video và chấm theo một rubric bốn tiêu chí. Sau chín buổi, thời lượng phần mở đầu giảm từ hơn ba phút xuống dưới một phút và ba người dự họp độc lập nhận xét là dễ theo dõi hơn hẳn.',
    comparison: [
      { weak: 'Tập bằng cách chạy lại toàn bộ bài từ đầu tới cuối mỗi lần.', mature: 'Tách ra luyện riêng đoạn yếu nhất nhiều lượt, rồi mới ghép lại vào bài hoàn chỉnh.' },
      { weak: 'Chấm bằng cảm giác “lần này thấy ổn hơn”.', mature: 'Chấm bằng rubric viết sẵn với các dấu hiệu quan sát được, và ghi điểm từng lượt để nhìn xu hướng.' },
      { weak: 'Luyện càng nhiều giờ càng tốt, tới khi mệt mới nghỉ.', mature: 'Luyện các phiên ngắn có chất lượng cao, dừng ngay khi chất lượng lượt bắt đầu giảm.' },
    ],
    mistakes: [
      'Luyện việc khó nhưng không có phản hồi nào, nên lặp lại chính lỗi của mình hàng chục lần và khắc nó sâu hơn.',
      'Chọn vi kỹ năng theo sở thích thay vì theo chỗ đang chặn kết quả — luyện mãi phần mình vốn đã khá vì nó cho cảm giác tiến bộ dễ chịu.',
      'Nhầm khối lượng với chất lượng: ghi nhận số giờ luyện như một thành tích, trong khi nửa số giờ đó ở mức quá dễ hoặc đã quá mệt.',
    ],
    worksheet: [
      'Kết quả tổng thể bạn muốn cải thiện là gì, và ba vi kỹ năng nào tạo nên nó?',
      'Trong ba vi kỹ năng đó, cái nào đang GIỚI HẠN kết quả nhiều nhất? Bằng chứng nào cho biết như vậy?',
      'Viết rubric bốn tiêu chí để chấm vi kỹ năng đó, mỗi tiêu chí phải là dấu hiệu quan sát được.',
      'Bài tập ngắn nào cho phép bạn lặp vi kỹ năng đó ít nhất 5 lượt trong 30 phút?',
      'Phản hồi sẽ đến từ đâu và trong bao lâu sau mỗi lượt? Nếu quá 24 giờ, bạn thay bằng cách nào?',
    ],
    exercises: [
      { label: 'Bản đồ vi kỹ năng', text: 'Chia một kỹ năng lớn bạn đang luyện thành ít nhất 6 vi kỹ năng luyện riêng được, rồi xếp hạng theo mức chúng đang chặn kết quả.', level: 'e' },
      { label: 'Rubric bốn dòng', text: 'Viết rubric bốn tiêu chí cho một vi kỹ năng, mỗi tiêu chí có mô tả mức đạt và mức chưa đạt bằng dấu hiệu quan sát được.', level: 'e' },
      { label: 'Năm lượt ngắn', text: 'Luyện đúng một vi kỹ năng trong 30 phút với ít nhất 5 lượt, chấm điểm từng lượt theo rubric. Ghi lượt nào cao nhất và vì sao.', level: 'e' },
      { label: 'Tự quay lại', text: 'Quay video hoặc ghi âm ba lượt liên tiếp và xem lại ngay sau mỗi lượt, mỗi lần chỉ sửa một thứ. Ghi lại thứ bạn chọn sửa ở mỗi vòng.', level: 'm' },
      { label: 'Điều chỉnh độ khó', text: 'Chạy cùng bài tập ở ba mức khó khác nhau và ghi tỷ lệ thành công. Chọn mức mà bạn đúng khoảng hai phần ba số lượt làm mức luyện chính.', level: 'm' },
      { label: 'Nhật ký xu hướng', text: 'Trong hai tuần, ghi điểm rubric mỗi buổi và vẽ đường xu hướng. Đánh dấu những ngày điểm tụt và tìm nguyên nhân chung.', level: 'm' },
      { label: 'Người chấm ngoài', text: 'Nhờ một người có kinh nghiệm hơn chấm ba lượt của bạn theo đúng rubric. So điểm của họ với điểm bạn tự chấm và phân tích chỗ lệch lớn nhất.', level: 'h' },
      { label: 'Bảy ngày một vi kỹ năng', text: 'Thử thách 7 ngày: mỗi ngày 25 phút luyện đúng một vi kỹ năng, chấm theo rubric, mỗi ngày đổi đúng một biến. Ngày 7 so lượt đầu tiên của ngày 1 với lượt cuối và viết ra khác biệt cụ thể.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao thâm niên không tự động biến thành năng lực?',
        a: 'Vì làm việc hằng ngày thường diễn ra ở mức đã thành thạo, có ít phản hồi cụ thể và không nhắm vào chỗ yếu. Đó là điều kiện để duy trì trình độ, không phải điều kiện để tăng. Muốn tăng, phải cố tình tạo ra các phiên có mục tiêu hẹp, có độ khó ở rìa và có phản hồi.',
      },
      {
        q: 'Làm sao biết bạn đang luyện ở đúng độ khó?',
        a: 'Khi tỷ lệ thành công rơi vào khoảng đủ để bạn sai vài lượt nhưng vẫn hiểu vì sao sai — thường quanh mức hai phần ba đúng. Đúng gần hết nghĩa là quá dễ và bạn chỉ đang lặp lại; sai gần hết nghĩa là quá khó và bạn mất tín hiệu để điều chỉnh.',
      },
      {
        q: 'Bạn không có ai đủ giỏi để chấm. Có thể luyện có chủ đích không?',
        a: 'Có, nhưng phải tự dựng nguồn phản hồi: quay video xem lại như người ngoài, dùng rubric viết trước khi làm để tránh chấm theo cảm giác, hoặc dùng kết quả khách quan như thời gian, số lỗi, phản ứng thật của người nghe. Điều không thể bỏ là phản hồi phải đến sớm và cụ thể.',
      },
    ],
    plan7:
      'Ngày 1: lập bản đồ vi kỹ năng và chọn cái đang chặn kết quả nhiều nhất. Ngày 2: viết rubric bốn tiêu chí và làm một lượt để lấy mốc. Ngày 3-6: mỗi ngày 25 phút, ít nhất 5 lượt, quay lại và chấm theo rubric, mỗi ngày chỉ đổi một biến. Ngày 5 thêm việc thử ba mức khó để tìm mức phù hợp. Ngày 7: nhờ một người ngoài chấm ba lượt, so với điểm tự chấm và chốt vi kỹ năng cho tuần sau.',
    evidence:
      'Giữ lại rubric, bảng điểm theo ngày và bản ghi của lượt đầu tiên cùng lượt cuối cùng. Khi phỏng vấn hỏi bạn từng nhận phản hồi tiêu cực nào và xử lý ra sao, bạn có một câu chuyện đầy đủ: phản hồi nhận được, vi kỹ năng đã tách ra, số vòng đã luyện, và bằng chứng trước - sau nghe được hoặc xem được.',
    references: [
      { label: 'Farnam Street — Deliberate Practice: hướng dẫn thực hành', url: 'https://fs.blog/deliberate-practice-guide/', type: 'article', needsReview: true },
      { label: 'How to get better at the things you care about (Eduardo Briceno, TED)', url: 'https://www.ted.com/talks/eduardo_briceno_how_to_get_better_at_the_things_you_care_about', type: 'video', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 12 ────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Học qua dự án hiệu quả khi dự án có một người dùng thật và một rủi ro thật. Chính ràng buộc từ bên ngoài — người dùng phàn nàn, dữ liệu bẩn, hạn chót — mới ép bạn học những thứ mà bài tập trong khoá học luôn khéo léo tránh đi, và cũng chính chúng biến sản phẩm thành thứ kể được trong phỏng vấn.',
    why: {
      work:
        'Đề xuất một dự án nhỏ giải quyết nỗi đau có thật của phòng ban là cách nhanh nhất để vừa học vừa tạo uy tín, vì kết quả được đo bằng thời gian tiết kiệm chứ không bằng số dòng công việc bạn đã làm.',
      interview:
        'Người phỏng vấn quan tâm tới vấn đề bạn chọn, vai trò thật của bạn, các đánh đổi bạn cân nhắc và kết quả đo được — một đường dẫn tới kho mã không tự kể được những thứ đó.',
      study:
        'Đồ án có người dùng thật buộc bạn tích hợp nhiều môn lại với nhau, đúng cách công việc thật vận hành, thay vì học rời từng môn rồi không nối được.',
      life:
        'Làm một dự án nhỏ cho gia đình hay cho một nhóm bạn — sắp xếp ảnh, quản lý chi tiêu chung, tổ chức một sự kiện — cho bạn đúng bộ ràng buộc thật với chi phí thất bại thấp.',
    },
    framework: [
      { name: 'Chọn vấn đề thật', detail: 'Bắt đầu từ một nhóm người đang chịu đựng một cách làm dở, và nói chuyện với ít nhất hai người trong số đó trước khi viết dòng đầu tiên.' },
      { name: 'Chốt tiêu chí', detail: 'Định nghĩa sản phẩm ở mức nhỏ nhất có ích, kèm tiêu chí thành công đo được: tiết kiệm bao nhiêu phút, giảm bao nhiêu lỗi, bao nhiêu người dùng lại tuần sau.' },
      { name: 'Chia mốc theo rủi ro', detail: 'Xếp các mốc sao cho mốc sớm nhất kiểm tra giả định nguy hiểm nhất, không phải làm phần dễ nhất trước.' },
      { name: 'Demo và sửa', detail: 'Cho người dùng thật chạm vào bản thô sớm, quan sát họ dùng thay vì hỏi họ nghĩ gì, và sửa theo chỗ họ vấp.' },
      { name: 'Viết case study', detail: 'Kết thúc bằng một trang: bối cảnh, vai trò, các phương án đã cân nhắc, quyết định và lý do, kết quả đo được, và điều bạn sẽ làm khác lần sau.' },
    ],
    scenario:
      'Một sinh viên năm ba định làm ứng dụng ghi chú thứ mười để bổ sung hồ sơ. Thay vào đó, cậu nhận thấy câu lạc bộ của mình quản lý điểm danh 120 thành viên bằng bảng tính và mỗi buổi mất khoảng 20 phút để tổng hợp. Cậu phỏng vấn hai người phụ trách, làm một công cụ điểm danh bằng mã QR, nhập dữ liệu thật của ba buổi cũ để kiểm, và đo lại: thời gian tổng hợp còn dưới 3 phút. Case study một trang của cậu, kèm phần nói thẳng về lần dữ liệu bị trùng và cách xử lý, trở thành nội dung chính trong buổi phỏng vấn thực tập.',
    comparison: [
      { weak: 'Làm lại một dự án mẫu phổ biến vì có sẵn hướng dẫn từng bước.', mature: 'Chọn một vấn đề chưa có hướng dẫn sẵn, chấp nhận phải tự quyết định và tự chịu trách nhiệm về các đánh đổi.' },
      { weak: 'Dồn phần lớn thời gian vào giao diện đẹp vì nó dễ thấy tiến độ.', mature: 'Dồn thời gian vào phần rủi ro nhất — dữ liệu thật, trường hợp biên, việc người dùng có quay lại không.' },
      { weak: 'Case study chỉ kể phần thành công và giấu chỗ đã hỏng.', mature: 'Case study nêu cả sự cố, nguyên nhân và cách xử lý, vì đó chính là phần người phỏng vấn tin nhất.' },
      { weak: 'Chọn dự án quá lớn để trông ấn tượng, rồi bỏ dở ở 40 phần trăm.', mature: 'Chọn phạm vi hoàn thành được trong 4-6 tuần và mở rộng sau nếu người dùng thật sự cần.' },
    ],
    mistakes: [
      'Không có người dùng thật, nên mọi quyết định thiết kế đều là giả định và không bao giờ bị kiểm chứng bởi thực tế.',
      'Để phần khó nhất tới cuối vì muốn thấy tiến độ sớm, dẫn tới phát hiện giả định sai khi đã hết thời gian và không xoay kịp.',
      'Kết thúc dự án mà không viết case study, khiến toàn bộ suy nghĩ và các đánh đổi biến mất và bạn chỉ còn lại một sản phẩm câm.',
    ],
    worksheet: [
      'Nhóm người nào đang chịu đựng một cách làm dở mà bạn tiếp cận được? Ghi tên hai người bạn sẽ hỏi chuyện.',
      'Cách làm hiện tại của họ tốn bao nhiêu thời gian hoặc gây bao nhiêu lỗi mỗi tuần? Ghi con số ước lượng và cách bạn sẽ đo lại.',
      'Sản phẩm nhỏ nhất còn có ích là gì? Viết một câu mô tả nó và một tiêu chí thành công đo được.',
      'Giả định nguy hiểm nhất trong dự án này là gì, và mốc nào sẽ kiểm nó sớm nhất?',
      'Ai sẽ chạm vào bản thô đầu tiên, khi nào, và bạn sẽ QUAN SÁT gì trong lúc họ dùng?',
    ],
    exercises: [
      { label: 'Săn nỗi đau', text: 'Liệt kê 5 quy trình thủ công quanh bạn ở nơi làm việc, trường học hoặc một nhóm bạn tham gia. Ước lượng thời gian mỗi cái tiêu tốn mỗi tuần.', level: 'e' },
      { label: 'Hai cuộc trò chuyện', text: 'Nói chuyện 15 phút với hai người đang chịu đựng quy trình đó. Ghi lại nguyên văn ba câu than phiền của họ, không diễn giải.', level: 'e' },
      { label: 'Câu tiêu chí', text: 'Viết một câu duy nhất định nghĩa thành công của dự án bằng con số đo được, và ghi cách bạn sẽ đo trước và sau.', level: 'e' },
      { label: 'Xếp mốc theo rủi ro', text: 'Liệt kê 4 giả định của dự án, xếp theo mức nguy hiểm, và thiết kế mốc đầu tiên sao cho nó kiểm giả định nguy hiểm nhất.', level: 'm' },
      { label: 'Chạy với dữ liệu thật', text: 'Nhập dữ liệu thật (đã ẩn thông tin nhạy cảm) thay vì dữ liệu mẫu. Ghi lại mọi trường hợp biên mà dữ liệu thật làm lộ ra.', level: 'm' },
      { label: 'Quan sát người dùng', text: 'Ngồi cạnh một người dùng thật khi họ dùng bản thô, chỉ quan sát và không hướng dẫn. Ghi lại ba chỗ họ vấp và một câu họ nói ra thành tiếng.', level: 'm' },
      { label: 'Case study một trang', text: 'Viết case study đủ sáu phần: bối cảnh, vai trò, phương án cân nhắc, quyết định và lý do, kết quả đo được, bài học. Nhờ một người ngoài dự án đọc và chỉ chỗ khó hiểu.', level: 'h' },
      { label: 'Bảy ngày một lát', text: 'Thử thách 7 ngày: giao được một lát chạy được cho người dùng thật, gồm cả bước đo trước và đo sau. Ngày 7 báo cáo con số thay đổi, dù thay đổi rất nhỏ hoặc bằng không.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao dự án có người dùng thật dạy nhiều hơn dự án làm theo hướng dẫn?',
        a: 'Vì hướng dẫn đã dọn sẵn dữ liệu, đã chọn sẵn kiến trúc và đã tránh sẵn các trường hợp biên. Người dùng thật mang tới dữ liệu bẩn, yêu cầu mâu thuẫn và các thói quen bạn không đoán được — đó chính là phần công việc thật, và cũng là phần bạn kể được trong phỏng vấn.',
      },
      {
        q: 'Vì sao mốc đầu tiên nên kiểm giả định nguy hiểm nhất thay vì làm phần dễ trước?',
        a: 'Vì giá trị của một mốc nằm ở lượng bất định nó xoá bỏ. Nếu giả định nguy hiểm sai, bạn muốn biết ở tuần 1 khi còn xoay kịp, chứ không phải tuần 5. Làm phần dễ trước cho cảm giác tiến độ nhưng không giảm rủi ro nào.',
      },
      {
        q: 'Case study nên nói về thất bại tới mức nào?',
        a: 'Nói đủ để người đọc hiểu chuyện gì đã hỏng, vì sao, bạn phát hiện thế nào và sửa ra sao. Giấu hoàn toàn khiến case study nghe như quảng cáo và mất độ tin cậy; ngược lại, một sự cố được kể có cấu trúc thường là phần khiến người phỏng vấn đặt câu hỏi tiếp và nhớ tới bạn.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê 5 quy trình thủ công quanh bạn và chọn một. Ngày 2: nói chuyện với hai người dùng thật và ghi nguyên văn than phiền. Ngày 3: viết câu tiêu chí thành công và đo mốc trước. Ngày 4: liệt kê giả định, xếp theo rủi ro, thiết kế lát đầu tiên. Ngày 5: làm lát đó với dữ liệu thật. Ngày 6: ngồi quan sát một người dùng chạm vào nó và ghi ba chỗ vấp. Ngày 7: sửa hai chỗ vấp lớn nhất, đo lại và viết case study một trang.',
    evidence:
      'Case study một trang có đủ sáu phần, kèm hai con số đo trước và sau, là tài sản chính bạn thu được từ chương này. Đặt nó ngay cạnh đường dẫn tới sản phẩm trong portfolio, và dùng chính cấu trúc đó để trả lời câu hỏi phỏng vấn hành vi — bối cảnh, hành động của riêng bạn, kết quả đo được, bài học rút ra.',
    references: [
      { label: 'PBLWorks — thiết kế học qua dự án', url: 'https://www.pblworks.org/', type: 'article', needsReview: true },
      { label: 'Open Source Guide — cách trình bày, viết tài liệu và duy trì một dự án', url: 'https://opensource.guide/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ── Chương 13 ────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Tiếng Anh cho công việc là một tập hợp hẹp: các cụm từ lặp lại trong đúng những tình huống bạn gặp, cộng với khả năng nói rõ ý dưới sức ép thời gian. Rõ và đúng quan trọng hơn phong phú và hoa mỹ; một email năm câu không lỗi nghĩa có giá trị hơn một đoạn văn phức tạp mà người nhận phải đọc hai lần.',
    why: {
      work:
        'Phần lớn tài liệu kỹ thuật, thông báo thay đổi và trao đổi với đối tác nước ngoài diễn ra bằng tiếng Anh; đọc và viết được ở mức đủ giúp bạn không phải chờ người khác dịch lại và không mất thông tin ở khâu trung gian.',
      interview:
        'Vòng phỏng vấn tiếng Anh không đo độ trôi chảy mà đo khả năng hiểu câu hỏi, nói có cấu trúc và hỏi lại khi chưa rõ — ba thứ luyện được bằng bài tập ngắn hằng ngày.',
      study:
        'Nguồn học tốt nhất trong hầu hết lĩnh vực xuất hiện bằng tiếng Anh trước; đọc được bản gốc giúp bạn tránh những sai lệch phát sinh ở bản dịch lại.',
      life:
        'Đi du lịch, xử lý giấy tờ quốc tế, hỗ trợ con học — cùng bộ cụm từ theo tình huống giúp bạn xoay xở mà không cần vốn từ rộng.',
    },
    framework: [
      { name: 'Thu cụm theo tình huống', detail: 'Gom cụm từ theo hoạt động thật bạn phải làm — báo cáo tiến độ, xin gia hạn, báo lỗi, từ chối lịch sự — thay vì học từ rời theo bảng chữ cái.' },
      { name: 'Đọc nguồn thật', detail: 'Đọc tài liệu chuyên môn đúng lĩnh vực của bạn mỗi ngày một đoạn ngắn và tóm tắt bằng lời của mình, thay vì học qua giáo trình chung chung.' },
      { name: 'Luyện đầu ra ngắn', detail: 'Mỗi ngày tạo một đầu ra thật và nhỏ: một email năm câu, một bản cập nhật một phút, một câu hỏi rõ ràng trong cuộc họp.' },
      { name: 'Xin sửa lỗi nghĩa', detail: 'Nhờ người sửa chỉ những lỗi làm sai hoặc mờ nghĩa, bỏ qua lỗi nhỏ về phong cách. Sửa quá nhiều thứ cùng lúc sẽ không có thứ nào được sửa thật.' },
      { name: 'Xây glossary riêng', detail: 'Giữ một sổ thuật ngữ của chính ngành bạn, mỗi mục kèm một câu ví dụ có thật lấy từ tài liệu công ty hoặc từ email đã gửi.' },
    ],
    scenario:
      'Một nhân viên hỗ trợ kỹ thuật phải trả lời email cho khách hàng nước ngoài và thường mất 40 phút cho mỗi thư vì dịch từng câu từ tiếng Việt. Anh đổi cách: mỗi ngày đọc một phiếu hỗ trợ tiếng Anh có sẵn trong hệ thống, ghi lại các cụm lặp đi lặp lại — xác nhận đã nhận, xin thêm thông tin, thông báo đã khắc phục — và dựng một bộ mẫu năm câu cho từng loại. Anh cũng ghi âm một bản cập nhật một phút mỗi ngày. Sau tám tuần, thời gian mỗi thư còn dưới 10 phút và anh bắt đầu tham gia trực tiếp các cuộc gọi với khách.',
    comparison: [
      { weak: 'Học danh sách 1.000 từ vựng phổ thông theo thứ tự bảng chữ cái.', mature: 'Học 80 cụm từ xuất hiện trong đúng năm tình huống bạn gặp hằng tuần, mỗi cụm kèm một ví dụ thật.' },
      { weak: 'Dịch từng chữ từ câu tiếng Việt đã nghĩ sẵn trong đầu.', mature: 'Nghĩ thẳng bằng cấu trúc câu đơn giản của tiếng Anh, chấp nhận câu ngắn hơn nhưng đúng nghĩa.' },
      { weak: 'Cố dùng câu dài và từ hiếm để nghe chuyên nghiệp.', mature: 'Viết câu ngắn, một ý một câu, và kiểm bằng câu hỏi người nhận có phải đọc lại lần hai không.' },
      { weak: 'Chỉ luyện đầu vào — nghe và đọc — vì nó thoải mái hơn.', mature: 'Bắt buộc mỗi buổi có một đầu ra thật được người khác đọc hoặc nghe.' },
    ],
    mistakes: [
      'Ám ảnh về phát âm giống người bản xứ trong khi rào cản thật nằm ở việc thiếu cụm từ cho đúng tình huống công việc của mình.',
      'Im lặng khi chưa hiểu câu hỏi vì ngại, thay vì dùng một câu hỏi lại đơn giản — điều mà người bản xứ cũng làm thường xuyên.',
      'Học tiếng Anh tách rời khỏi công việc thật, nên sau sáu tháng vẫn không viết nổi một email cập nhật tiến độ trong 10 phút.',
    ],
    worksheet: [
      'Năm tình huống tiếng Anh nào bạn thật sự gặp mỗi tuần? Liệt kê theo tần suất giảm dần.',
      'Với tình huống đứng đầu danh sách, chép lại ba câu tiếng Anh thật bạn đã nhận được từ người khác trong tình huống đó.',
      'Bạn thường mất bao nhiêu phút cho một email tiếng Anh hiện nay? Ghi con số và đặt mục tiêu cho bốn tuần tới.',
      'Ba thuật ngữ chuyên ngành nào bạn dùng hằng ngày mà chưa chắc cách diễn đạt tiếng Anh? Viết chúng cùng một câu ví dụ.',
      'Ai có thể sửa lỗi nghĩa cho bạn mỗi tuần một lần, và bạn sẽ gửi họ đúng loại đầu ra nào?',
    ],
    exercises: [
      { label: 'Bản đồ tình huống', text: 'Liệt kê 5 tình huống tiếng Anh bạn gặp hằng tuần và với mỗi cái thu thập 5 cụm từ có thật từ email hoặc tài liệu bạn đã nhận.', level: 'e' },
      { label: 'Email năm câu', text: 'Viết một email công việc đúng năm câu: bối cảnh, việc đã làm, việc đang chặn, đề nghị cụ thể, mốc thời gian. Đếm số từ và cố giảm 20 phần trăm.', level: 'e' },
      { label: 'Glossary mười mục', text: 'Dựng sổ thuật ngữ 10 mục của riêng ngành bạn, mỗi mục kèm một câu ví dụ trích từ tài liệu thật, không tự bịa câu.', level: 'e' },
      { label: 'Cập nhật một phút', text: 'Ghi âm bản cập nhật tiến độ 60 giây mỗi ngày trong 5 ngày. Nghe lại và đếm số lần bạn dừng quá 3 giây để tìm từ.', level: 'm' },
      { label: 'Tóm tắt nguồn thật', text: 'Mỗi ngày đọc một tài liệu chuyên môn tiếng Anh ngắn và viết 5 câu tóm tắt bằng lời của bạn, không sao chép cụm nào dài hơn 4 từ.', level: 'm' },
      { label: 'Ba câu hỏi lại', text: 'Học thuộc ba mẫu câu hỏi lại khi chưa hiểu và dùng ít nhất một lần trong một cuộc họp hoặc cuộc gọi thật. Ghi lại phản ứng của người đối diện.', level: 'm' },
      { label: 'Mô phỏng phỏng vấn', text: 'Chuẩn bị phần tự giới thiệu 90 giây và ba câu chuyện STAR bằng tiếng Anh, rồi nhờ một người phỏng vấn thử có bấm giờ. Ghi lại câu hỏi khiến bạn tắc.', level: 'h' },
      { label: 'Bảy ngày một đầu ra', text: 'Thử thách 7 ngày: mỗi ngày một đầu ra tiếng Anh thật được người khác đọc hoặc nghe, và mỗi ngày xin sửa đúng những lỗi làm sai nghĩa. Ngày 7 so đầu ra ngày 1 và ngày 7 về độ dài, độ rõ và thời gian bạn cần để tạo ra nó.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao học cụm từ theo tình huống hiệu quả hơn học từ rời?',
        a: 'Vì trí nhớ lấy ra được thông tin nhờ bối cảnh gợi nhắc. Một cụm gắn với tình huống “báo lỗi cho khách” sẽ tự hiện ra khi bạn ở đúng tình huống đó, còn một từ đứng một mình trong danh sách thì không có gì kích hoạt nó. Ngoài ra, cụm mang sẵn cấu trúc ngữ pháp đúng nên bạn tránh được lỗi khi ghép câu.',
      },
      {
        q: 'Khi nào nên bỏ qua lỗi ngữ pháp và tập trung vào việc khác?',
        a: 'Khi lỗi đó không làm sai hoặc mờ nghĩa. Một mạo từ thiếu hiếm khi khiến người đọc hiểu sai; ngược lại, dùng sai thì của động từ trong một câu về hạn chót có thể khiến cả nhóm hiểu nhầm lịch. Hãy ưu tiên sửa nhóm thứ hai và chấp nhận sống chung với nhóm thứ nhất một thời gian.',
      },
      {
        q: 'Bạn nghe hiểu tốt nhưng nói ra rất chậm. Nên luyện gì?',
        a: 'Luyện đầu ra có giới hạn thời gian và có bối cảnh lặp lại: bản cập nhật 60 giây mỗi ngày, câu hỏi lại chuẩn bị sẵn, mẫu email năm câu. Vấn đề thường không phải vốn từ mà là thiếu các mẫu sẵn dùng, khiến bạn phải xây câu từ đầu mỗi lần và mất thời gian ở khâu đó.',
      },
    ],
    plan7:
      'Ngày 1: lập bản đồ 5 tình huống và thu 25 cụm từ có thật. Ngày 2: viết mẫu email năm câu cho tình huống hay gặp nhất. Ngày 3: dựng glossary 10 thuật ngữ ngành kèm ví dụ thật. Ngày 4-6: mỗi ngày đọc một tài liệu ngắn, viết 5 câu tóm tắt và ghi âm bản cập nhật 60 giây; ngày 5 dùng một câu hỏi lại trong cuộc họp thật. Ngày 7: gửi toàn bộ đầu ra của tuần cho một người sửa lỗi nghĩa và so đầu ra ngày 1 với ngày 7.',
    evidence:
      'Tập hợp một bộ hồ sơ nhỏ: bộ mẫu email theo tình huống, glossary ngành của riêng bạn, và hai bản ghi âm cập nhật ở tuần đầu và tuần cuối. Trong hồ sơ ứng tuyển vào vị trí có yếu tố quốc tế, hai bản ghi cách nhau tám tuần nói lên tốc độ tiến bộ rõ hơn bất kỳ điểm số nào, và bộ mẫu email cho thấy bạn đã làm việc thật bằng tiếng Anh chứ không chỉ học nó.',
    references: [
      { label: 'Cambridge English — Khung tham chiếu ngôn ngữ CEFR', url: 'https://www.cambridgeenglish.org/exams-and-tests/cefr/', type: 'article' },
      { label: 'BBC Learning English — tài nguyên luyện nghe nói theo tình huống', url: 'https://www.bbc.co.uk/learningenglish', type: 'article', needsReview: true },
    ],
    diagram: 'flow',
  }),
];
