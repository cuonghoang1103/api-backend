import { guide } from '../skill-guide-builder.mjs';

// Quyển 37 — Sự nghiệp, phỏng vấn và freelance (20 chương)
// Tạo bằng chứng năng lực, tìm cơ hội và tăng thu nhập

export default [
  // ── Chương 1 · Xác định hướng nghề nghiệp ─────────────────────────────────
  guide({
    thesis:
      'Hướng nghề nghiệp không phải một sự thật nằm sẵn trong bạn chờ được khám phá bằng cách suy nghĩ đủ lâu, mà là một giả thuyết được kiểm chứng bằng những thí nghiệm rẻ tiền. Dấu hiệu quan sát được của người đã xác định hướng không phải cảm giác chắc chắn, mà là khả năng nói ra ba điều: tên chính xác của hai đến ba vị trí trên thị trường lao động, tiêu chí bạn dùng để loại những vị trí còn lại, và bằng chứng thực nghiệm bạn đã thu được cho mỗi giả thuyết. Ai chỉ trả lời được "em muốn làm gì đó liên quan đến con người" là chưa có hướng, mới có cảm hứng.',
    why: {
      work:
        'Người không có hướng thì mọi cơ hội đều hấp dẫn ngang nhau, nên họ nhận việc theo lời mời chứ không theo chiến lược, và sau năm năm có một hồ sơ gồm năm mảnh không cộng lại thành gì. Người có hướng thì biết công việc trước mắt đang bồi thêm cho năng lực nào và bỏ qua cái gì mà không tiếc.',
      interview:
        'Câu "vì sao bạn ứng tuyển vị trí này" đo mức độ có chủ đích chứ không đo lòng nhiệt tình. Nhà tuyển dụng nghe được ngay sự khác nhau giữa "em thấy công ty mình rất tiềm năng" và "em đang xây năng lực về phân tích dữ liệu vận hành, vị trí này là nơi duy nhất trong ba nơi em ứng tuyển có cả kho dữ liệu thật lẫn người hướng dẫn".',
      study:
        'Học không có hướng thì bạn học cái dễ đăng ký chứ không học cái thị trường trả tiền. Một hướng rõ biến ngân sách học tập ít ỏi thành một chuỗi có thứ tự: học cái nào trước để mở được cánh cửa đầu tiên, cái nào để dành đến khi đã vào trong.',
      life:
        'Quyết định nghề nghiệp kéo theo quyết định sống ở đâu, ngủ mấy giờ, gặp ai và tiêu bao nhiêu. Chọn hướng mà bỏ qua các ràng buộc đời sống — chăm cha mẹ, con nhỏ, khoản vay đang trả — là cách nhanh nhất để bỏ ngang sau tám tháng và mất luôn cả khoản đầu tư ban đầu.',
    },
    framework: [
      {
        name: 'Kiểm kê dữ liệu đã có',
        detail:
          'Liệt kê mười hai tháng gần nhất: những việc bạn làm mà thời gian trôi nhanh, những việc làm xong thấy kiệt, những lời khen cụ thể bạn nhận được từ người không có nghĩa vụ khen bạn. Đây là dữ liệu thật về bạn, khác hẳn với những gì bạn tin về mình.',
      },
      {
        name: 'Dựng ba giả thuyết có tên thị trường',
        detail:
          'Chuyển mong muốn mơ hồ thành ba chức danh đang thật sự được đăng tuyển, ví dụ "Chuyên viên nhân sự tổng hợp", "Chuyên viên mua hàng", "Chuyên viên phân tích vận hành". Giả thuyết phải có tên tra được trên trang tuyển dụng, nếu không thì không kiểm chứng được.',
      },
      {
        name: 'Đối chiếu với thị trường thật',
        detail:
          'Với mỗi giả thuyết, đọc mười tin tuyển dụng thật, ghi ba con số: yêu cầu kinh nghiệm phổ biến, các kỹ năng lặp lại nhiều nhất, và khoảng lương công bố nếu có. Bước này loại được những hướng nghe hay nhưng ở thị trường của bạn gần như không có chỗ tuyển.',
      },
      {
        name: 'Chạy thí nghiệm rẻ nhất',
        detail:
          'Mỗi giả thuyết cần một thí nghiệm dưới hai mươi giờ: một cuộc trò chuyện nghề nghiệp với người đang làm đúng vị trí đó, một việc nhỏ làm thật (nhận một phần việc của phòng khác, làm một dự án dữ liệu nhỏ, dạy thử một buổi). Cảm giác sau khi làm thật đáng tin hơn cảm giác sau khi đọc mô tả.',
      },
      {
        name: 'Chốt và đặt ngày xem lại',
        detail:
          'Chọn một hướng chính, ghi hai tiêu chí sẽ khiến bạn từ bỏ nó, và đặt mốc đánh giá sau sáu tháng. Chốt không có nghĩa là khóa vĩnh viễn; nó có nghĩa là ngừng phân vân trong sáu tháng để tích lũy đủ chiều sâu cho một lần đánh giá có dữ liệu.',
      },
    ],
    scenario:
      'Hằng, 26 tuổi, tốt nghiệp Quản trị kinh doanh, hai năm làm hành chính tổng hợp cho một công ty xây dựng khoảng 120 người. Bạn thấy chán nhưng không biết chán cái gì, và kế hoạch duy nhất là "học thêm một khóa gì đó". Bạn ngồi lại và kiểm kê mười hai tháng: việc làm thấy nhanh hết giờ là dựng lại bảng theo dõi hợp đồng thầu phụ và tự động hóa phần nhắc hạn bảo lãnh; việc làm thấy kiệt là tiếp đón khách và tổ chức sự kiện nội bộ; lời khen cụ thể nhất đến từ kế toán trưởng, người nói bảng theo dõi của bạn giúp họ không phải hỏi lại hồ sơ ba lần một tuần. Ba giả thuyết được đặt tên: Chuyên viên nhân sự tổng hợp, Chuyên viên mua hàng, Chuyên viên phân tích vận hành. Đọc mười tin tuyển cho mỗi hướng, bạn phát hiện hướng phân tích vận hành ở thành phố của bạn hầu như chỉ tuyển từ hai năm kinh nghiệm chuyên trách trở lên, còn hướng mua hàng thì các nhà máy quanh khu công nghiệp tuyển liên tục và yêu cầu lặp lại nhiều nhất là Excel nâng cao cùng khả năng đọc hợp đồng — hai thứ bạn đã làm hằng ngày mà chưa từng gọi đúng tên. Bạn xin trưởng phòng cho tiếp quản phần theo dõi báo giá nhà cung cấp trong hai tháng, đồng thời trò chuyện nghề nghiệp với ba người làm mua hàng. Sau hai tháng bạn có một hiện vật thật: bảng so sánh báo giá ba nhà cung cấp vật tư phụ cùng ghi chú thương lượng. Bạn chốt hướng mua hàng, đặt tiêu chí từ bỏ là "sau sáu tháng vẫn không được giao đàm phán trực tiếp với nhà cung cấp nào". Điều đáng chú ý: bạn không đổi công ty, không học khóa nào, chỉ đổi cách gọi tên và đổi phần việc được giao.',
    comparison: [
      {
        weak: 'Đi tìm "đam mê" bằng cách nội quan và trắc nghiệm tính cách, rồi kết luận bằng những cụm rất rộng như "em hợp làm việc với con người".',
        mature:
          'Coi câu trả lời là giả thuyết, và mỗi giả thuyết phải quy về một chức danh có thật đang được đăng tuyển, kèm một thí nghiệm dưới hai mươi giờ để kiểm.',
      },
      {
        weak: 'Chọn hướng chỉ dựa vào mức lương nghe được từ bạn bè, bỏ qua điều kiện vào nghề và mật độ tuyển ở thành phố mình đang sống.',
        mature:
          'Xét đồng thời bốn yếu tố: mật độ tin tuyển ở nơi mình ở được, yêu cầu đầu vào so với vốn hiện có, khoảng thu nhập, và chi phí chuyển đổi tính bằng tháng không có thu nhập.',
      },
      {
        weak: 'Đổi hướng mỗi lần gặp một ngày làm việc tệ, nên hồ sơ ba năm có ba mảnh rời và không mảnh nào đủ sâu để kể thành câu chuyện.',
        mature:
          'Đặt trước hai tiêu chí từ bỏ có thể quan sát được và một ngày đánh giá cố định, nhờ đó phân biệt được một ngày tệ với một tín hiệu thật rằng hướng này sai.',
      },
    ],
    mistakes: [
      'Nhầm ngành học với hướng nghề: tin rằng học kế toán thì phải làm kế toán suốt đời, trong khi thị trường tuyển theo năng lực chứng minh được chứ không tuyển theo dòng chữ trên bằng. Bằng cấp mở cửa cho công việc đầu tiên; từ công việc thứ hai trở đi, bằng chứng nói to hơn.',
      'Chờ chắc chắn rồi mới hành động, nên dành sáu tháng đọc bài viết định hướng và không thực hiện nổi một cuộc trò chuyện nghề nghiệp nào. Cảm giác chắc chắn là kết quả của việc thử, không phải điều kiện để bắt đầu thử.',
      'Chỉ hỏi những người đã thành công rực rỡ trong nghề đó, nên nghe được phiên bản đẹp nhất và bỏ sót phần đông người làm nghề ấy ở mức bình thường — vốn mới là cuộc sống nhiều khả năng bạn sẽ có trong ba năm đầu.',
    ],
    worksheet: [
      'Trong mười hai tháng qua, ba việc cụ thể nào khiến bạn quên mất thời gian? Ghi tên việc thật, không ghi loại việc chung chung như "làm việc nhóm".',
      'Ba giả thuyết nghề nghiệp của bạn tên là gì, và bạn có tra được ít nhất năm tin tuyển thật cho từng cái không? Cái nào không tra ra tin nào?',
      'Với hướng bạn nghiêng nhất, yêu cầu lặp lại nhiều nhất trong mười tin tuyển là gì, và bạn đang có bằng chứng cho bao nhiêu phần trong số đó?',
      'Ràng buộc đời sống nào của bạn (tài chính, gia đình, địa lý, sức khỏe) sẽ quyết định hướng nào là bất khả thi dù bạn thích đến đâu?',
      'Thí nghiệm dưới hai mươi giờ nào bạn có thể bắt đầu ngay trong tuần này mà không cần xin phép ai, và bạn sẽ đo kết quả bằng dấu hiệu gì?',
    ],
    exercises: [
      {
        label: 'Nhật ký năng lượng nghề',
        text: 'Trong mười ngày làm việc, cuối mỗi ngày ghi hai dòng: việc nào hôm nay khiến bạn muốn làm tiếp, việc nào khiến bạn muốn dừng. Ngày thứ mười một, gom lại và tìm mẫu chung theo loại hoạt động (phân tích, thuyết phục, tổ chức, chăm sóc, chế tác) chứ không theo tên dự án.',
        level: 'e',
      },
      {
        label: 'Ba chức danh có thật',
        text: 'Viết ba hướng bạn đang cân nhắc bằng đúng chức danh xuất hiện trên trang tuyển dụng, không dùng cách gọi tự chế. Nếu một hướng không có chức danh tương ứng, hãy tìm xem thị trường gọi nó là gì hoặc chấp nhận rằng nó chưa tồn tại như một vị trí tuyển được.',
        level: 'e',
      },
      {
        label: 'Bảng mười tin tuyển',
        text: 'Chọn một hướng, đọc mười tin tuyển thật và lập bảng bốn cột: yêu cầu kinh nghiệm, ba kỹ năng lặp lại nhiều nhất, công cụ được nhắc tên, khoảng lương nếu công bố. Ghi lại điều làm bạn ngạc nhiên nhất sau khi hoàn thành bảng.',
        level: 'e',
      },
      {
        label: 'Trò chuyện nghề nghiệp có kịch bản',
        text: 'Liên hệ một người đang làm đúng vị trí bạn nhắm và xin hai mươi phút. Chuẩn bị năm câu hỏi về ngày làm việc thật, phần khó chịu nhất, con đường vào nghề của họ, kỹ năng họ ước có sớm hơn, và người nào ở vị trí đó thường bỏ nghề vì lý do gì. Ghi biên bản ngay sau cuộc gọi.',
        level: 'm',
      },
      {
        label: 'Ma trận bốn ràng buộc',
        text: 'Chấm ba hướng theo bốn cột: mật độ tuyển ở nơi bạn sống được, khoảng cách từ vốn hiện có tới yêu cầu đầu vào, khoảng thu nhập, và số tháng thu nhập giảm khi chuyển. Cộng điểm rồi viết một đoạn giải thích vì sao bạn vẫn không chọn hướng điểm cao nhất, nếu đúng là vậy.',
        level: 'm',
      },
      {
        label: 'Thí nghiệm hai mươi giờ',
        text: 'Chọn hướng đứng đầu và thiết kế một thí nghiệm dưới hai mươi giờ: nhận một phần việc thật của phòng khác, làm một sản phẩm nhỏ hoàn chỉnh, hoặc trợ giúp không công cho một dự án có thời hạn. Đặt trước hai dấu hiệu sẽ coi là tín hiệu tốt và hai dấu hiệu coi là tín hiệu xấu.',
        level: 'm',
      },
      {
        label: 'Bản đồ hướng nghề một trang',
        text: 'Gộp toàn bộ dữ liệu vào một trang duy nhất: ba giả thuyết, bằng chứng thu được cho từng cái, hướng được chọn, hai tiêu chí từ bỏ, ba việc cần làm trong sáu tháng và ngày đánh giá. Gửi trang này cho một người từng làm nghề đó và xin họ chỉ ra chỗ bạn đang lạc quan quá mức.',
        level: 'h',
      },
      {
        label: 'Kiểm chứng bằng ba người khác nhau',
        text: 'Với hướng đã chọn, phỏng vấn ba người ở ba mức khác nhau: một người mới vào nghề dưới hai năm, một người làm bảy năm trở lên, và một người đã rời nghề đó. Viết một trang tổng hợp nêu rõ ba điểm họ nói trùng nhau và hai điểm họ mâu thuẫn, kèm cách bạn sẽ tự kiểm chứng phần mâu thuẫn.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao câu hỏi "đam mê của tôi là gì" thường không dẫn tới quyết định nghề nghiệp nào?',
        a: 'Vì nó đòi một câu trả lời có sẵn trong đầu, trong khi hứng thú nghề nghiệp phần lớn hình thành sau khi làm và bắt đầu giỏi một việc. Câu hỏi dùng được phải chuyển thành dạng kiểm chứng được: "trong ba vị trí có thật này, vị trí nào tôi vẫn muốn làm sau khi đã thử hai mươi giờ và đã nghe phần khó chịu nhất từ người đang làm?".',
      },
      {
        q: 'Bạn có hai hướng điểm gần bằng nhau sau khi chấm ma trận ràng buộc. Nên làm gì tiếp?',
        a: 'Không cố chấm lại cho ra người thắng. Chọn hướng có thí nghiệm rẻ hơn và đảo ngược được dễ hơn, chạy thử trước, vì thông tin thu được từ một lần làm thật thường thay đổi bảng điểm nhiều hơn bất kỳ vòng cân nhắc nào trên giấy. Hai hướng ngang điểm là dấu hiệu bạn đang thiếu dữ liệu thực nghiệm, không phải thiếu tiêu chí.',
      },
      {
        q: 'Làm sao phân biệt một ngày làm việc tệ với tín hiệu thật rằng hướng nghề này sai?',
        a: 'Dựa vào tiêu chí từ bỏ đã đặt trước và đơn vị thời gian đủ dài. Tín hiệu thật thường mang ba đặc điểm: lặp lại đều đặn qua nhiều tháng, xuất hiện cả khi công việc đang thuận lợi, và gắn với phần lõi của nghề chứ không gắn với một người sếp hay một dự án cụ thể. Nếu đổi công ty là hết khó chịu thì vấn đề là môi trường, không phải hướng nghề.',
      },
    ],
    plan7:
      'Ngày 1: kiểm kê mười hai tháng, ghi việc giữ được năng lượng và việc làm bạn kiệt. Ngày 2: đặt tên ba giả thuyết bằng chức danh có thật trên trang tuyển dụng. Ngày 3-4: đọc mười tin tuyển cho hai hướng đứng đầu và lập bảng bốn cột. Ngày 5: gửi lời mời trò chuyện nghề nghiệp cho ba người, chuẩn bị sẵn năm câu hỏi. Ngày 6: chấm ma trận bốn ràng buộc và viết đoạn giải thích lựa chọn. Ngày 7: thiết kế thí nghiệm hai mươi giờ cho hướng đứng đầu, ghi rõ hai tín hiệu tốt và hai tín hiệu xấu, đặt ngày đánh giá sau sáu tháng vào lịch.',
    evidence:
      'Sản phẩm giữ lại là bản đồ hướng nghề một trang cộng với biên bản của ba đến năm cuộc trò chuyện nghề nghiệp. Trong phỏng vấn, khi được hỏi "vì sao bạn muốn chuyển sang mảng này", bạn không trả lời bằng cảm hứng mà bằng quy trình: đã cân nhắc ba hướng, đã hỏi ai, đã thử việc gì trong hai mươi giờ, và điều gì trong thí nghiệm đó khiến bạn chọn hướng này. Nhà tuyển dụng nghe được ở đó một người biết ra quyết định có bằng chứng — đúng thứ họ cần cho công việc chứ không chỉ cho việc chọn nghề. Kèm theo, hiện vật của thí nghiệm (bảng so sánh, sản phẩm nhỏ, báo cáo) là mục đầu tiên bạn đưa vào portfolio dù chưa từng làm đúng chức danh đó một ngày nào.',
    references: [
      { label: 'The Muse — chuyên mục lời khuyên nghề nghiệp', url: 'https://www.themuse.com/advice', type: 'article' },
      { label: 'U.S. Bureau of Labor Statistics — Occupational Outlook Handbook', url: 'https://www.bls.gov/ooh/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 2 · Phân tích mô tả công việc ──────────────────────────────────
  guide({
    thesis:
      'Một mô tả công việc (JD) không phải bản mô tả trung thực về công việc, mà là một văn bản thỏa hiệp giữa người quản lý đang thiếu người, bộ phận nhân sự muốn lọc bớt hồ sơ, và một khuôn mẫu cũ được sao chép lại từ lần tuyển trước. Đọc JD giỏi nghĩa là dịch ngược nó về ba câu hỏi thật: bài toán nào đang không ai giải nên họ phải mở vị trí này, ai trong công ty đang chịu đau vì bài toán đó, và trong danh sách yêu cầu thì đâu là điều kiện thật sự loại người còn đâu là chữ được chép lại. Ai đọc JD như một danh sách phải khớp đủ sẽ hoặc tự loại mình quá sớm, hoặc nộp một hồ sơ chung chung cho ba chục nơi.',
    why: {
      work:
        'Hiểu JD đúng giúp bạn nộp ít hơn và trúng nhiều hơn: thay vì rải năm mươi hồ sơ giống nhau, bạn nộp tám hồ sơ được điều chỉnh theo đúng bài toán từng nơi, và có nội dung thật để nói trong vòng đầu tiên.',
      interview:
        'Toàn bộ buổi phỏng vấn thường xoay quanh vài dòng cốt lõi của JD. Người đã bóc tách JD biết trước ba câu hỏi gần như chắc chắn sẽ được hỏi và chuẩn bị ba câu chuyện tương ứng, thay vì bị dẫn dắt suốt buổi.',
      study:
        'JD là bản đồ chương trình học miễn phí và cập nhật hơn mọi giáo trình: đọc hai mươi JD của vị trí bạn nhắm sẽ cho bạn danh sách kỹ năng và công cụ thị trường đang thật sự trả tiền, kèm thứ tự ưu tiên theo tần suất xuất hiện.',
      life:
        'Cùng một chức danh có thể là hai cuộc sống khác nhau. Đọc kỹ phần điều kiện làm việc, phạm vi đi lại, mô hình ca kíp và cấu trúc báo cáo giúp bạn tránh ký một hợp đồng mà ba tháng sau mới phát hiện nó không sống chung được với gia đình mình.',
    },
    framework: [
      {
        name: 'Tách bốn lớp',
        detail:
          'Chia JD thành bốn nhóm bằng bốn màu: nhiệm vụ thật sự phải làm, yêu cầu cứng có thể kiểm chứng, yêu cầu mềm mô tả tính cách, và tín hiệu văn hóa. Bốn nhóm cần bốn cách chuẩn bị khác nhau; trộn chung là lý do người ta chuẩn bị dàn trải và không sâu chỗ nào.',
      },
      {
        name: 'Truy nguyên cơn đau',
        detail:
          'Hỏi vì sao vị trí này tồn tại: thay người nghỉ, mở rộng đội, hay hoàn toàn mới. Dấu hiệu nằm trong chính JD — nhiệm vụ nào được mô tả chi tiết bất thường thường là chỗ đang đau nhất, còn nhiệm vụ liệt kê một dòng thường là phần chép lại từ mẫu.',
      },
      {
        name: 'Phân loại bắt buộc và trang trí',
        detail:
          'Một yêu cầu có xác suất cao là bắt buộc khi nó xuất hiện đồng thời ở tiêu đề, ở phần nhiệm vụ và ở phần yêu cầu; nó có xác suất cao là trang trí khi chỉ xuất hiện một lần trong một danh sách dài các tính từ. Đây là suy đoán có cơ sở, không phải luật, nên hãy xác nhận lại bằng câu hỏi ở vòng đầu.',
      },
      {
        name: 'Lập ma trận bằng chứng',
        detail:
          'Kẻ hai cột: mỗi yêu cầu bắt buộc ở cột trái, một hiện vật hoặc một câu chuyện có số liệu của bạn ở cột phải. Ô trống chính là danh sách việc phải làm trước khi nộp, hoặc là chỗ bạn phải chuẩn bị một câu trả lời trung thực về khoảng trống.',
      },
      {
        name: 'Viết lại JD bằng lời của bạn',
        detail:
          'Gói toàn bộ thành năm câu: công ty đang cần ai giải bài toán gì, thành công sau sáu tháng trông như thế nào, ba năng lực quyết định, hai chỗ bạn mạnh hơn mặt bằng, một chỗ bạn yếu và cách bù. Nếu không viết nổi năm câu này, bạn chưa hiểu vị trí đó đủ để nộp.',
      },
    ],
    scenario:
      'Trâm có năm năm làm marketing cho một thương hiệu mỹ phẩm bán qua đại lý, nay ứng tuyển vị trí Chuyên viên Marketing Thương mại điện tử cho một chuỗi bán lẻ đồ gia dụng. Đọc lướt, bạn thấy JD đòi kinh nghiệm chạy quảng cáo trên sàn, thành thạo công cụ phân tích, và "ưu tiên ứng viên có kinh nghiệm ngành hàng gia dụng" — bạn suýt bỏ qua vì thấy mình lệch hai trong ba. Đọc kỹ lần hai theo bốn lớp, bức tranh đổi: phần nhiệm vụ có một đoạn dài bất thường mô tả việc "chuẩn hóa nội dung mô tả sản phẩm cho hơn 4.000 mã hàng và phối hợp với bộ phận vận hành để đồng bộ tồn kho hiển thị", trong khi phần quảng cáo chỉ có hai dòng chung chung. Bạn suy đoán cơn đau thật nằm ở dữ liệu sản phẩm chứ không ở quảng cáo, và trong năm năm cũ bạn đã từng dựng bộ quy chuẩn nội dung cho 600 mã hàng phân phối qua đại lý. Bạn viết lại hồ sơ xoay quanh trục đó, và trong phần thư ngỏ đặt một câu hỏi: hiện tại việc cập nhật thông tin sản phẩm giữa hệ thống kho và trang bán hàng đang do ai chịu trách nhiệm. Ở vòng đầu tiên, người phỏng vấn dành hai phần ba thời gian nói về đúng vấn đề đó và thừa nhận đây là lý do vị trí được mở. Trâm không có kinh nghiệm ngành gia dụng và cũng không giấu điều đó; điều bạn có là bằng chứng đã giải đúng loại bài toán họ đang đau.',
    comparison: [
      {
        weak: 'Đọc JD như bảng chấm điểm và tự loại khi thấy mình thiếu hai trong tám gạch đầu dòng.',
        mature:
          'Xác định đâu là hai đến ba yêu cầu quyết định, dồn bằng chứng vào đó, và chuẩn bị một câu trả lời thẳng thắn kèm kế hoạch bù cho phần còn thiếu.',
      },
      {
        weak: 'Dùng một bản CV duy nhất cho mọi tin tuyển vì "nội dung thì vẫn thế cả".',
        mature:
          'Giữ nguyên sự thật nhưng đổi thứ tự và trọng số: đưa lên đầu đúng những kinh nghiệm trả lời cơn đau của nơi này, đẩy xuống dưới phần không liên quan.',
      },
      {
        weak: 'Bỏ qua hoàn toàn phần mô tả công ty, cấu trúc báo cáo và điều kiện làm việc vì cho rằng đó chỉ là phần giới thiệu.',
        mature:
          'Đọc phần đó để suy ra vị trí báo cáo cho ai, đứng cạnh những phòng ban nào, và mức độ tự chủ thật — ba yếu tố quyết định bạn có làm được việc trong nửa năm đầu hay không.',
      },
    ],
    mistakes: [
      'Tin rằng mọi con số trong JD là ngưỡng cứng, đặc biệt là số năm kinh nghiệm. Số năm thường là cách viết tắt cho một mức độ tự chủ; nếu bạn chứng minh được mức tự chủ đó bằng hiện vật, số năm thường được thương lượng — nhưng đây là suy đoán có xác suất, không phải bảo đảm, nên hãy chuẩn bị cả phương án bị loại vì tiêu chí lọc tự động.',
      'Coi những cụm như "chịu được áp lực", "năng động", "làm việc độc lập" là lời sáo rỗng nên bỏ qua hết. Chúng thường là dấu vết của một trải nghiệm thật gần đây — người trước nghỉ vì áp lực, hoặc vị trí này gần như không có ai hướng dẫn — và đó là thông tin đáng để hỏi lại ở vòng phỏng vấn.',
      'Chỉ đọc một JD của đúng công ty mình muốn vào, nên không có mặt bằng để so. Đọc mười JD cùng chức danh ở các công ty khác nhau mới cho biết yêu cầu nào là chuẩn ngành và yêu cầu nào là đặc thù của riêng nơi này — chính phần đặc thù mới là chỗ đáng chuẩn bị kỹ.',
    ],
    worksheet: [
      'Trong JD bạn đang nhắm, nhiệm vụ nào được mô tả dài và chi tiết hơn hẳn phần còn lại? Bạn suy ra được cơn đau gì từ độ dài đó?',
      'Liệt kê tám yêu cầu của JD và đánh dấu ba yêu cầu bạn tin là bắt buộc thật. Bạn dựa vào dấu hiệu nào để đánh dấu, ngoài cảm giác?',
      'Với mỗi yêu cầu bắt buộc, bạn có hiện vật hay câu chuyện có số liệu nào để đối chứng? Ô nào đang trống hoàn toàn?',
      'Vị trí này báo cáo cho ai và làm việc cạnh phòng ban nào? Nếu JD không nói, câu hỏi nào bạn sẽ dùng ở vòng đầu để hỏi ra điều đó?',
      'Viết năm câu tóm tắt vị trí bằng lời của bạn. Câu nào bạn viết ra mà tự thấy mình đang đoán chứ không dựa vào chữ trong JD?',
    ],
    exercises: [
      {
        label: 'Bốn màu trên một JD',
        text: 'In hoặc dán một JD vào tài liệu và tô bốn màu theo bốn lớp: nhiệm vụ, yêu cầu cứng, yêu cầu mềm, tín hiệu văn hóa. Đếm số dòng mỗi màu và ghi lại nhóm nào chiếm nhiều nhất, vì tỷ lệ đó nói lên nơi này đang tuyển theo năng lực hay theo tính cách.',
        level: 'e',
      },
      {
        label: 'Mười JD cùng chức danh',
        text: 'Thu thập mười JD cùng chức danh ở mười công ty và lập bảng tần suất các kỹ năng, công cụ, chứng chỉ được nhắc tên. Khoanh ba mục xuất hiện trên bảy lần trở lên: đó là chuẩn ngành mà bạn buộc phải có bằng chứng.',
        level: 'e',
      },
      {
        label: 'Dịch một dòng sáo rỗng',
        text: 'Chọn ba cụm mơ hồ trong JD như "chịu được áp lực cao" hoặc "tinh thần chủ động", và với mỗi cụm viết một giả thuyết cụ thể về thực tế đằng sau nó cùng một câu hỏi bạn sẽ dùng để kiểm chứng khi phỏng vấn.',
        level: 'e',
      },
      {
        label: 'Ma trận bằng chứng',
        text: 'Lập bảng hai cột cho một JD thật: mỗi yêu cầu bắt buộc ở cột trái, một hiện vật cụ thể hoặc câu chuyện có con số ở cột phải. Với mỗi ô trống, viết một hành động dưới hai tuần có thể lấp được phần nào khoảng trống đó.',
        level: 'm',
      },
      {
        label: 'Viết lại JD bằng năm câu',
        text: 'Gói JD thành năm câu: bài toán, hình dung thành công sau sáu tháng, ba năng lực quyết định, hai điểm mạnh vượt mặt bằng của bạn, một điểm yếu và cách bù. Gửi cho một người quen trong ngành và hỏi họ có thấy bạn đọc sai chỗ nào không.',
        level: 'm',
      },
      {
        label: 'Bảng so hai JD gần giống',
        text: 'Chọn hai JD cùng chức danh nhưng một ở công ty lớn và một ở công ty nhỏ. Lập bảng so sánh phạm vi công việc, mức tự chủ, số đầu mối phối hợp và những gì bạn sẽ học được. Kết luận bằng một đoạn nói rõ ở giai đoạn hiện tại nơi nào phù hợp hơn với bạn và vì sao.',
        level: 'm',
      },
      {
        label: 'Phỏng đoán rồi kiểm chứng',
        text: 'Trước khi phỏng vấn, viết ba phỏng đoán về vị trí: cơn đau thật, người bạn sẽ làm việc cùng nhiều nhất, và tiêu chí đánh giá sau sáu tháng. Trong buổi phỏng vấn, đặt câu hỏi để kiểm ba phỏng đoán đó, và sau buổi ghi lại phỏng đoán nào đúng, phỏng đoán nào sai và bạn đã bỏ sót manh mối nào trong JD.',
        level: 'h',
      },
      {
        label: 'Bộ hồ sơ theo JD trong bảy ngày',
        text: 'Chọn một tin tuyển thật bạn nghiêm túc muốn nộp. Trong bảy ngày, tạo trọn bộ: CV được sắp lại theo cơn đau đã suy ra, thư ngỏ nêu đúng một bài toán, và một hiện vật nhỏ liên quan trực tiếp (bản phân tích, bản đề xuất, mẫu công việc). Nộp thật và ghi lại thời gian phản hồi so với những lần nộp trước.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao không nên coi danh sách yêu cầu trong JD là điều kiện phải khớp đủ?',
        a: 'Vì JD thường được viết bằng cách gộp mong muốn của nhiều người và chép lại từ mẫu cũ, nên nó mô tả ứng viên lý tưởng chứ không mô tả ngưỡng tuyển thật. Việc cần làm là tìm ra hai đến ba yêu cầu quyết định — thường là những yêu cầu xuất hiện lặp lại ở nhiều phần của JD — rồi dồn bằng chứng vào đó, đồng thời chuẩn bị cách nói trung thực về phần còn thiếu.',
      },
      {
        q: 'JD viết rất chung chung, chỉ vài dòng. Bạn khai thác thế nào?',
        a: 'Chuyển sang các nguồn khác: trang tuyển dụng của chính công ty để xem họ đang mở những vị trí nào cùng lúc (cho biết họ đang mở rộng mảng nào), hồ sơ công khai của người đang giữ vị trí tương tự ở đó, và các JD cùng chức danh của đối thủ để lấy mặt bằng. Sau đó viết phỏng đoán và dùng vòng phỏng vấn đầu tiên để kiểm chứng thay vì đoán tiếp.',
      },
      {
        q: 'Bạn thiếu đúng một yêu cầu bắt buộc quan trọng. Nên xử lý thế nào trong hồ sơ?',
        a: 'Không giấu và cũng không xin lỗi. Nêu năng lực gần nhất bạn có kèm bằng chứng, nói rõ khoảng cách còn lại, và trình bày một kế hoạch bù cụ thể có mốc thời gian — ví dụ đã hoàn thành phần nào, đang làm dự án thực hành nào, mất bao lâu để đạt mức làm được việc độc lập. Cách này biến một điểm trừ thành bằng chứng về khả năng tự đánh giá và tự học, thứ khó tìm hơn nhiều so với một dòng kỹ năng.',
      },
    ],
    plan7:
      'Ngày 1: chọn một JD thật và tô bốn màu theo bốn lớp. Ngày 2: thu thập chín JD cùng chức danh khác và lập bảng tần suất yêu cầu. Ngày 3: xác định hai đến ba yêu cầu quyết định và ghi dấu hiệu bạn dựa vào. Ngày 4: lập ma trận bằng chứng, đánh dấu mọi ô trống. Ngày 5: với mỗi ô trống, viết một hành động dưới hai tuần để lấp. Ngày 6: viết lại JD bằng năm câu của riêng bạn và nhờ một người trong ngành phản biện. Ngày 7: viết ba phỏng đoán về vị trí kèm ba câu hỏi sẽ dùng để kiểm chứng ở vòng đầu.',
    evidence:
      'Hiện vật của chương này là bộ hồ sơ được thiết kế cho một tin tuyển cụ thể: bản JD đã tô bốn màu, ma trận bằng chứng có ô trống được ghi rõ, và bản tóm tắt năm câu. Bộ ba này không gửi cho nhà tuyển dụng, nhưng nó thay đổi mọi thứ bạn gửi. Trong phỏng vấn, khả năng nói "em đọc JD và đoán rằng vấn đề thật đang nằm ở chỗ này, anh chị xác nhận giúp em" tạo ra một cuộc trò chuyện giữa hai người cùng bàn về công việc, thay vì một cuộc thẩm tra. Nếu bạn đang làm quản lý, chính kỹ năng này còn là bằng chứng bạn viết được JD tốt cho đội của mình — một việc phần lớn quản lý làm qua loa bằng cách chép lại bản cũ.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Hiring and recruitment', url: 'https://hbr.org/topic/subject/hiring-and-recruitment', type: 'article' },
      { label: 'SHRM — hiệp hội nhân sự Hoa Kỳ, tài nguyên về tuyển dụng', url: 'https://www.shrm.org/', type: 'article' },
    ],
  }),

  // ── Chương 3 · Viết CV ────────────────────────────────────────────────────
  guide({
    thesis:
      'CV không phải bản tự truyện nghề nghiệp mà là một hồ sơ chứng cứ dài một đến hai trang, được đọc lần đầu trong khoảng nửa phút bởi một người đang tìm lý do để loại bớt. Vì vậy đơn vị cơ bản của CV không phải "công việc đã làm" mà là "dòng thành tích": một câu nêu bạn đã làm gì, trong bối cảnh nào, thay đổi được con số nào, và điều đó dẫn tới hệ quả gì. Một CV liệt kê nhiệm vụ chỉ chứng minh bạn từng giữ chức danh đó; một CV gồm các dòng thành tích chứng minh bạn từng tạo ra khác biệt trong chức danh đó — và đó là toàn bộ sự khác nhau giữa được gọi và không được gọi.',
    why: {
      work:
        'Việc viết CV ép bạn nhìn lại công việc dưới góc độ kết quả bàn giao được. Rất nhiều người phát hiện họ không có gì để viết cho hai năm gần nhất, và đó là thông tin quý: nó nói rằng công việc hiện tại đang không tạo ra dấu vết nào có thể mang đi.',
      interview:
        'Người phỏng vấn hầu như luôn lấy câu hỏi từ chính CV của bạn. Mỗi con số bạn viết ra là một lời mời đào sâu, nên CV tốt là CV mà bạn muốn bị hỏi kỹ từng dòng, không phải CV làm bạn hoảng khi có người hỏi "cụ thể chị đã làm gì trong dự án này".',
      study:
        'CV cập nhật hai lần một năm biến việc học thành thứ có thể kiểm đếm: khóa học nào đã dẫn tới một dòng thành tích thật, khóa nào chỉ nằm trong mục chứng chỉ mà không đổi được gì trong công việc.',
      life:
        'Một hồ sơ luôn sẵn sàng làm giảm đáng kể áp lực khi biến cố xảy ra — công ty cắt giảm, ngành gặp khó, hoặc một cơ hội tốt xuất hiện với hạn nộp trong ba ngày. Người phải viết CV từ đầu trong lúc hoảng loạn thường viết ra bản tệ nhất của mình.',
    },
    framework: [
      {
        name: 'Chốt một vị trí mục tiêu',
        detail:
          'Viết CV cho đúng một chức danh, không viết CV vạn năng. CV vạn năng buộc người đọc tự suy ra bạn hợp chỗ nào, mà người đọc đang có sáu chục hồ sơ khác nên họ sẽ không suy giúp.',
      },
      {
        name: 'Khai quật thành tích',
        detail:
          'Với mỗi giai đoạn, tự hỏi bốn câu: cái gì tốt hơn sau khi bạn đến, cái gì bạn làm mà không ai bảo, chỗ nào bạn tiết kiệm được thời gian hoặc tiền, và ai đã cảm ơn bạn vì việc gì. Bốn câu này moi ra được nhiều hơn hẳn so với việc ngồi nhớ lại nhiệm vụ.',
      },
      {
        name: 'Viết dòng theo cấu trúc bốn phần',
        detail:
          'Động từ hành động, bối cảnh có quy mô, con số thay đổi, hệ quả cho tổ chức. Không có số thì dùng quy mô hoặc tần suất — số lượng đầu mối, số hồ sơ, số buổi, số mã hàng — bởi vì "cải thiện quy trình" không đo được còn "rút thời gian lập báo cáo tháng từ sáu ngày xuống ba ngày" thì đo được.',
      },
      {
        name: 'Xếp theo mức liên quan',
        detail:
          'Trong mỗi mục, dòng liên quan nhất tới vị trí mục tiêu đứng trên cùng; phần kinh nghiệm không liên quan được gộp lại thành một dòng ngắn thay vì bị xóa hẳn, để tránh lỗ hổng thời gian không giải thích được.',
      },
      {
        name: 'Ba phép thử trước khi gửi',
        detail:
          'Phép thử ba mươi giây: đưa cho người lạ đọc nửa phút rồi hỏi họ bạn ứng tuyển vị trí gì. Phép thử ẩn danh: che tên công ty và chức danh, CV còn nói được gì. Phép thử người ngoài ngành: đưa cho người khác ngành, những chỗ họ không hiểu là những chỗ đầy thuật ngữ nội bộ cần viết lại.',
      },
    ],
    scenario:
      'Dũng làm bốn năm ở một công ty dịch vụ kế toán, phụ trách sổ sách cho nhiều khách hàng doanh nghiệp nhỏ, nay muốn chuyển sang làm kế toán tổng hợp trong một nhà máy nhựa. Bản CV đầu tiên của bạn có mười một gạch đầu dòng bắt đầu bằng "Thực hiện", "Hỗ trợ", "Tham gia", và không có con số nào. Sau khi làm bài khai quật bốn câu hỏi, bức tranh khác hẳn. Dòng "Thực hiện các công việc kế toán theo phân công" trở thành "Phụ trách trọn bộ sổ sách cho 14 doanh nghiệp nhỏ cùng lúc, hai kỳ quyết toán liên tiếp không phát sinh bút toán điều chỉnh sau đợt kiểm tra thuế". Dòng "Hỗ trợ cải tiến quy trình" trở thành "Chuẩn hóa bảng nhập liệu chứng từ dùng chung cho cả nhóm 5 người, rút thời gian lập báo cáo tháng từ 6 ngày xuống 3 ngày". Bạn cũng bổ sung một dòng chưa từng nghĩ là thành tích: "Đào tạo và kèm 3 nhân sự mới trong 2 năm, cả 3 đều tự phụ trách được danh mục khách riêng sau 4 tháng". Với vị trí nhà máy, bạn đưa lên đầu phần kinh nghiệm với khách hàng sản xuất và giá thành, đẩy phần dịch vụ thương mại xuống dưới. CV vẫn giữ nguyên một trang. Điều thay đổi không phải bạn đã làm gì, mà là việc bạn cuối cùng cũng viết ra được thứ mình đã làm bằng ngôn ngữ mà người tuyển kế toán nhà máy quan tâm.',
    comparison: [
      {
        weak: 'Mở đầu bằng đoạn mục tiêu nghề nghiệp nói về mong muốn của bạn: "tìm kiếm môi trường năng động để phát triển bản thân".',
        mature:
          'Mở đầu bằng ba dòng tóm tắt nói về giá trị bạn mang lại, có quy mô và chuyên môn cụ thể, để người đọc trong mười giây đầu biết được bạn là ai trên thị trường.',
      },
      {
        weak: 'Liệt kê nhiệm vụ được giao, tức mô tả lại chính JD của vị trí cũ.',
        mature:
          'Liệt kê thứ đã thay đổi nhờ có bạn: số liệu trước và sau, quy mô phụ trách, vấn đề đã xử lý mà trước đó tồn đọng.',
      },
      {
        weak: 'Ghi mục kỹ năng thành một dãy tính từ tự chấm điểm như "giao tiếp tốt, làm việc nhóm tốt, tin học văn phòng thành thạo".',
        mature:
          'Chỉ ghi kỹ năng có bằng chứng ở phần kinh nghiệm bên dưới, và ghi ở mức cụ thể đủ để kiểm chứng — tên phần mềm, phân hệ đã dùng, quy mô dữ liệu đã xử lý.',
      },
      {
        weak: 'Dùng một CV duy nhất cho mọi vị trí và mọi ngành để tiết kiệm thời gian.',
        mature:
          'Giữ một bản gốc đầy đủ làm kho, mỗi lần nộp thì cắt và sắp lại theo vị trí mục tiêu; thao tác này thường chỉ mất hai mươi phút nhưng đổi được tỷ lệ phản hồi.',
      },
    ],
    mistakes: [
      'Nhồi ba trang vì sợ bỏ sót, khiến những dòng mạnh nhất bị chôn ở trang hai. Người đọc lần đầu không đọc hết; họ quét. Cắt bớt là hành động làm cho phần còn lại được nhìn thấy, không phải hành động đánh mất thông tin.',
      'Bịa hoặc thổi phồng số liệu vì tin rằng không ai kiểm chứng. Người phỏng vấn có kinh nghiệm chỉ cần ba câu hỏi đào sâu là lộ, và mất niềm tin ở phút thứ mười thì mọi thứ nói sau đó đều bị nghi ngờ. Nếu không có số chính xác, hãy dùng quy mô hoặc khoảng ước lượng và nói rõ đó là ước lượng.',
      'Bỏ trống hoàn toàn khoảng thời gian gián đoạn (nghỉ chăm con, ốm, thất nghiệp, học toàn thời gian) và hy vọng không ai để ý. Khoảng trống luôn bị để ý; điều quyết định là bạn có một dòng giải thích ngắn gọn, bình thản hay không.',
    ],
    worksheet: [
      'Với công việc gần nhất, viết ra bốn câu trả lời: cái gì tốt hơn sau khi bạn đến, việc gì bạn làm mà không ai bảo, chỗ nào tiết kiệm được thời gian hay tiền, ai đã cảm ơn bạn vì việc gì?',
      'Đếm số dòng trong CV hiện tại bắt đầu bằng "Thực hiện", "Hỗ trợ", "Tham gia", "Chịu trách nhiệm". Tỷ lệ đó trên tổng số dòng là bao nhiêu?',
      'Chọn ba dòng yếu nhất và viết lại mỗi dòng theo cấu trúc bốn phần. Dòng nào bạn không tìm nổi con số nào để gắn vào?',
      'Nếu che hết tên công ty và chức danh trong CV của bạn, người đọc còn suy ra được bạn làm được việc gì không? Phần nào biến mất hoàn toàn?',
      'Có khoảng trống thời gian nào trong hồ sơ của bạn không? Bạn sẽ dùng đúng một câu nào để giải thích nó mà không phòng thủ?',
    ],
    exercises: [
      {
        label: 'Săn động từ yếu',
        text: 'Rà toàn bộ CV hiện tại, đánh dấu mọi dòng mở đầu bằng động từ mô tả nhiệm vụ thay vì kết quả. Với mỗi dòng, viết lại bằng một động từ nêu hành động cụ thể bạn khởi xướng, ví dụ chuẩn hóa, rút ngắn, thu hồi, đàm phán, dựng, đào tạo.',
        level: 'e',
      },
      {
        label: 'Kho thành tích thô',
        text: 'Mở một tài liệu riêng và viết ra ba mươi việc bạn đã làm trong hai năm gần nhất, không phân biệt lớn nhỏ và chưa cần viết hay. Đây là kho nguyên liệu; CV chỉ lấy ra tám đến mười hai mục phù hợp nhất với từng vị trí.',
        level: 'e',
      },
      {
        label: 'Gắn số cho năm dòng',
        text: 'Chọn năm dòng không có con số và tìm cho mỗi dòng một đại lượng đo được: số người, số hồ sơ, số mã hàng, số buổi, số ngày rút ngắn, số lần lặp giảm đi. Nếu thật sự không có, ghi quy mô bối cảnh để người đọc hình dung được độ lớn của việc.',
        level: 'e',
      },
      {
        label: 'Ba dòng tóm tắt đầu CV',
        text: 'Viết ba phiên bản khác nhau của đoạn tóm tắt ba dòng ở đầu CV cho cùng một vị trí mục tiêu, mỗi phiên bản nhấn một trục khác nhau: chuyên môn sâu, quy mô phụ trách, hoặc năng lực cải tiến. Đọc to cả ba và chọn phiên bản đúng nhất với bằng chứng bạn có bên dưới.',
        level: 'm',
      },
      {
        label: 'Phép thử ba mươi giây',
        text: 'Đưa CV cho hai người chưa biết công việc của bạn, cho họ đúng ba mươi giây, rồi hỏi ba câu: bạn ứng tuyển vị trí gì, điểm mạnh nổi bật nhất của bạn là gì, và họ nhớ được con số nào. Ghi lại câu trả lời và sửa mọi chỗ hai người hiểu khác nhau.',
        level: 'm',
      },
      {
        label: 'Bản cắt theo vị trí',
        text: 'Lấy CV gốc và tạo hai bản cắt cho hai vị trí khác nhau bạn thật sự quan tâm. Ghi lại bạn đã đưa dòng nào lên, đẩy dòng nào xuống, gộp phần nào, và giải thích quyết định đó dựa trên yêu cầu nào trong từng JD.',
        level: 'm',
      },
      {
        label: 'Tự phản biện từng dòng',
        text: 'Đóng vai người phỏng vấn khó tính, đi từng dòng trong CV và viết ra câu hỏi đào sâu bạn sẽ hỏi nếu ở phía bên kia. Đánh dấu những dòng bạn không trả lời nổi trong hai phút — hoặc sửa lại cho trung thực hơn, hoặc chuẩn bị câu chuyện đầy đủ cho nó.',
        level: 'h',
      },
      {
        label: 'Vòng phản hồi từ người trong ngành',
        text: 'Gửi bản đã sửa cho hai người đang làm đúng ngành và đúng cấp bậc bạn nhắm, kèm câu hỏi cụ thể: dòng nào họ sẽ bỏ nếu chỉ được giữ tám dòng, và họ nghi ngờ dòng nào nhất. Sửa theo phản hồi, ghi lại những chỗ hai người mâu thuẫn nhau và cách bạn quyết định.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao dòng "Chịu trách nhiệm quản lý fanpage của công ty" là một dòng yếu, và sửa thế nào?',
        a: 'Vì nó chỉ nói phạm vi được giao, không nói bạn đã tạo ra khác biệt gì — người tiền nhiệm bị sa thải cũng có thể viết đúng dòng đó. Bản sửa cần thêm bối cảnh có quy mô và kết quả đo được, ví dụ nêu số bài đăng mỗi tháng bạn duy trì, sự thay đổi của một chỉ số bạn theo dõi trong khoảng thời gian nào, và điều bạn đã thay đổi trong cách làm để dẫn tới thay đổi đó.',
      },
      {
        q: 'Bạn mới ra trường, chưa có kinh nghiệm đi làm. CV nên chứa gì cho một trang không bị trống?',
        a: 'Chứa những thứ có bằng chứng dù không phải việc làm chính thức: đồ án có mô tả vấn đề và kết quả, thực tập có nhiệm vụ thật, dự án cá nhân đã hoàn thành và có người dùng, công việc bán thời gian có quy mô (số ca, số khách, số tiền quản lý), hoạt động tổ chức có kết quả đếm được. Nguyên tắc không đổi: mọi mục phải có bối cảnh, hành động và kết quả, chứ không phải danh sách tên hoạt động.',
      },
      {
        q: 'Có nên viết CV khác nhau cho từng nơi nộp không, xét đến chi phí thời gian?',
        a: 'Nên, nhưng theo cách tiết kiệm: duy trì một bản gốc đầy đủ chứa mọi thành tích, và mỗi lần nộp chỉ làm ba thao tác — đổi đoạn tóm tắt ba dòng, sắp lại thứ tự các dòng theo yêu cầu quyết định của JD, và cắt bớt phần không liên quan cho đủ độ dài. Ba thao tác này thường mất dưới ba mươi phút, ít hơn nhiều so với chi phí của việc nộp năm mươi bản giống nhau và không nhận được phản hồi nào.',
      },
    ],
    plan7:
      'Ngày 1: dựng kho thành tích thô ba mươi mục, chưa cần viết hay. Ngày 2: chọn vị trí mục tiêu và đọc lại JD để biết cần nhấn gì. Ngày 3: viết lại tám dòng mạnh nhất theo cấu trúc bốn phần, có số. Ngày 4: viết ba phiên bản đoạn tóm tắt đầu CV và chọn một. Ngày 5: sắp xếp lại thứ tự theo mức liên quan, cắt xuống còn một đến hai trang. Ngày 6: chạy phép thử ba mươi giây với hai người và sửa theo phản hồi. Ngày 7: tự phản biện từng dòng như người phỏng vấn khó tính, đánh dấu dòng nào cần chuẩn bị câu chuyện đầy đủ.',
    evidence:
      'Chính CV là hiện vật, nhưng hiện vật có giá trị lâu dài hơn là kho thành tích thô mà bạn duy trì liên tục: một tài liệu ghi lại từng việc đã làm kèm ngày tháng, con số trước và sau, và tên người có thể xác nhận. Cập nhật kho này mỗi tháng một lần trong hai mươi phút, và bạn sẽ không bao giờ phải viết CV trong trạng thái hoảng loạn. Trong phỏng vấn, kho thành tích là nguồn để rút ra câu chuyện phù hợp với bất kỳ câu hỏi hành vi nào. Với người đang quản lý, cùng cách làm áp dụng cho hồ sơ đánh giá cuối năm của nhân viên: đội nào có kho thành tích thì kỳ đánh giá dựa trên bằng chứng, đội nào không thì kỳ đánh giá dựa trên trí nhớ của ba tuần gần nhất.',
    references: [
      { label: 'UNC Writing Center — bộ tài liệu hướng dẫn viết, gồm hồ sơ ứng tuyển', url: 'https://writingcenter.unc.edu/tips-and-tools/', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Managing yourself', url: 'https://hbr.org/topic/subject/managing-yourself', type: 'article' },
    ],
  }),

  // ── Chương 4 · Xây dựng portfolio ─────────────────────────────────────────
  guide({
    thesis:
      'Portfolio không phải bộ sưu tập sản phẩm đẹp nhất của bạn, mà là bằng chứng về cách bạn ra quyết định dưới ràng buộc. Người xem portfolio giỏi không hỏi "cái này trông thế nào" mà hỏi "vì sao lại chọn thế này, đã có phương án nào khác, cái gì đã bị hy sinh". Vì vậy một case study có ba trang giải thích bối cảnh, ràng buộc và các đánh đổi thường thắng hai mươi ảnh sản phẩm không lời. Và điều quan trọng: portfolio không phải đặc quyền của người làm sáng tạo — kế toán, vận hành, nhân sự, giáo viên đều có thể dựng hồ sơ bằng chứng theo đúng nguyên tắc đó.',
    why: {
      work:
        'Portfolio làm giảm rủi ro cho người tuyển. Khi họ nhìn thấy quá trình làm việc thật của bạn, quyết định tuyển bớt phụ thuộc vào cảm giác trong bốn mươi lăm phút phỏng vấn, và bạn được đánh giá bằng chất lượng công việc thay vì bằng khả năng nói trôi chảy.',
      interview:
        'Portfolio biến buổi phỏng vấn thành buổi review công việc, nơi bạn ở thế chủ động vì bạn hiểu tài liệu đó hơn bất kỳ ai trong phòng. Nhiều buổi phỏng vấn tốt nhất diễn ra khi người phỏng vấn dừng lại ở một trang của bạn và hỏi sâu suốt hai mươi phút.',
      study:
        'Ép mình viết case study cho mỗi dự án học tập biến việc học thành sản phẩm có thể kiểm tra. Bạn nhanh chóng phát hiện những dự án mình đã "hoàn thành" nhưng không thể giải thích được vì sao đã làm như thế.',
      life:
        'Nếu bạn nhận việc ngoài, dạy kèm, làm cộng đồng hay bán hàng nhỏ, portfolio là thứ thay thế cho lời giới thiệu miệng. Nó cho phép người lạ tin bạn ở mức đủ để trả tiền lần đầu.',
    },
    framework: [
      {
        name: 'Chọn ba, không chọn hết',
        detail:
          'Ba case study được kể kỹ tạo ấn tượng mạnh hơn mười lăm mục sơ sài. Tiêu chí chọn: một case thể hiện chiều sâu chuyên môn, một case thể hiện làm việc với ràng buộc thật (thời gian, ngân sách, con người), một case thể hiện điều bạn muốn làm nhiều hơn trong tương lai.',
      },
      {
        name: 'Dựng khung năm phần cho mỗi case',
        detail:
          'Bối cảnh và mục tiêu, ràng buộc thật, các phương án đã cân nhắc và lý do chọn, kết quả có số liệu, và phần bạn sẽ làm khác nếu lặp lại. Phần cuối cùng thường là phần thuyết phục nhất vì nó chứng minh bạn có khả năng tự đánh giá.',
      },
      {
        name: 'Chuẩn hóa bằng chứng',
        detail:
          'Mỗi case cần ít nhất một hiện vật xem được: ảnh trước và sau, đoạn trích bảng dữ liệu, sơ đồ quy trình, bản nháp bị loại. Bản nháp bị loại có sức thuyết phục cao bất ngờ vì nó cho thấy có quá trình chứ không phải một cú may mắn.',
      },
      {
        name: 'Xử lý bảo mật một cách chuyên nghiệp',
        detail:
          'Không đăng dữ liệu thuộc sở hữu công ty. Cách làm được chấp nhận rộng rãi: mô tả bài toán bằng ngôn ngữ trung tính, thay số thật bằng số đã chuẩn hóa theo tỷ lệ hoặc chỉ nêu mức thay đổi tương đối, làm mờ tên khách hàng, và nói rõ trong trang rằng dữ liệu đã được ẩn danh. Khi còn ràng buộc bảo mật rõ ràng, hãy hỏi lại người quản lý trước khi đăng.',
      },
      {
        name: 'Một đường dẫn duy nhất và nhịp cập nhật',
        detail:
          'Toàn bộ hồ sơ nên nằm sau đúng một đường dẫn bạn có thể gửi trong một dòng tin nhắn, và có một nhịp cập nhật cố định — ví dụ mỗi quý bổ sung một case. Portfolio bỏ hoang mười tám tháng gây ấn tượng xấu hơn không có portfolio.',
      },
    ],
    scenario:
      'Nam làm bốn năm thiết kế đồ họa cho một xưởng in bao bì, muốn chuyển sang thiết kế sản phẩm số. Portfolio cũ của bạn là một tệp PDF bốn mươi trang toàn ảnh nhãn hộp và tờ rơi, không có chữ nào. Ba nơi bạn nộp đều im lặng. Bạn dựng lại theo khung năm phần và chỉ giữ ba case. Case đầu tiên là bộ nhận diện cho một thương hiệu trà: bạn viết ra ràng buộc thật — máy in của xưởng chỉ chạy được bốn màu pha, ngân sách khuôn bế cố định, và chủ thương hiệu muốn dùng phông chữ viết tay khó đọc ở cỡ nhỏ. Bạn trình bày ba phương án đã làm, giải thích vì sao chọn phương án hai, và đưa cả ảnh phương án bị loại. Case thứ hai là việc bạn tự nhận: xưởng thường xuyên in sai vì file khách gửi thiếu tràn lề, nên bạn dựng một mẫu tài liệu kèm bản kiểm tra chín mục và hướng dẫn ngắn cho khách; bạn ghi lại số lần phải in lại trong sáu tháng trước và sáu tháng sau. Case thứ ba là một dự án tự làm hướng về tương lai: bạn thiết kế lại luồng đặt in trực tuyến của chính xưởng thành mười hai màn hình, có ghi lại năm cuộc phỏng vấn ngắn với khách quen và ba giả định đã bị bác bỏ khi thử. Case thứ ba yếu nhất về mặt kết quả kinh doanh vì nó chưa được triển khai, nhưng lại là case được hỏi nhiều nhất trong hai buổi phỏng vấn sau đó, vì nó cho thấy cách bạn nghĩ về người dùng chứ không chỉ về hình khối.',
    comparison: [
      {
        weak: 'Trưng bày sản phẩm cuối cùng không kèm lời giải thích, để người xem tự hiểu.',
        mature:
          'Kể quá trình: mục tiêu, ràng buộc, phương án đã loại và lý do, kết quả đo được. Sản phẩm cuối chỉ là một trong các bằng chứng, không phải toàn bộ câu chuyện.',
      },
      {
        weak: 'Đưa hết mọi thứ từng làm vào để chứng minh mình chăm chỉ và đa năng.',
        mature:
          'Chọn ba case có chủ đích, mỗi case phục vụ một mục tiêu khác nhau, và chấp nhận rằng mọi thứ bị loại vẫn tồn tại trong bản đầy đủ để dùng khi cần.',
      },
      {
        weak: 'Chỉ khoe những dự án thành công, giấu hoàn toàn phần vấp và phần chưa xong.',
        mature:
          'Có ít nhất một phần nói về giả định bị bác bỏ hoặc điều sẽ làm khác. Điều này không làm bạn yếu đi; nó phân biệt bạn với những hồ sơ bóng bẩy mà rỗng.',
      },
    ],
    mistakes: [
      'Chờ đến khi có dự án đủ hoành tráng mới bắt đầu làm portfolio, nên không bao giờ bắt đầu. Một case study viết kỹ về một việc nhỏ có thật vẫn hơn hẳn kế hoạch làm một portfolio hoàn hảo còn nằm trong đầu.',
      'Đăng nguyên dữ liệu, tài liệu hoặc mã nguồn thuộc sở hữu của công ty cũ vì nghĩ "đây là việc mình làm nên là của mình". Đây là rủi ro pháp lý và uy tín thật; quyền sở hữu sản phẩm công việc thường thuộc về bên thuê và còn tùy hợp đồng lao động cùng quy định nơi bạn làm việc. Khi không chắc, hãy hỏi người quản lý hoặc bộ phận pháp chế trước khi đăng.',
      'Thiết kế trang portfolio cầu kỳ với hiệu ứng chuyển động và nhạc nền, khiến người xem mất ba mươi giây mới tới được nội dung đầu tiên. Người xem hồ sơ thường mở mười lăm tab; trang tải chậm hoặc bắt cuộn lâu sẽ bị đóng trước khi nội dung kịp xuất hiện.',
    ],
    worksheet: [
      'Ba việc bạn đã làm trong hai năm qua mà bạn có thể giải thích được lý do của từng quyết định là gì? Việc nào bạn nhớ được cả những phương án đã loại?',
      'Với case bạn tự tin nhất, ràng buộc thật lúc đó là gì — thời gian, ngân sách, công nghệ, con người, hay ý kiến của một người có quyền quyết định?',
      'Bạn có hiện vật gì để chứng minh (ảnh, bản nháp, bảng số, sơ đồ, tin nhắn phê duyệt)? Case nào hiện đang không có hiện vật nào cả?',
      'Có dữ liệu nào trong các case của bạn thuộc sở hữu của công ty và không được công bố? Bạn sẽ ẩn danh nó bằng cách nào?',
      'Nếu chỉ được giữ một case duy nhất để gửi cho vị trí bạn muốn nhất, bạn giữ case nào và vì sao hai case còn lại thua nó?',
    ],
    exercises: [
      {
        label: 'Danh mục nguyên liệu',
        text: 'Liệt kê mọi thứ bạn đã làm trong ba năm mà còn giữ được dấu vết: file, ảnh, báo cáo, bản trình bày, tin nhắn khen, số liệu trước sau. Đánh dấu ba mục có nhiều dấu vết nhất — đó là ứng viên tự nhiên cho ba case đầu tiên.',
        level: 'e',
      },
      {
        label: 'Một trang khung năm phần',
        text: 'Chọn một việc nhỏ đã hoàn thành và viết một trang theo năm phần: bối cảnh, ràng buộc, phương án và lựa chọn, kết quả, điều sẽ làm khác. Giới hạn đúng một trang để buộc mình cắt phần kể lể.',
        level: 'e',
      },
      {
        label: 'Khôi phục phương án bị loại',
        text: 'Với một dự án cũ, cố nhớ và ghi lại hai phương án bạn đã cân nhắc rồi bỏ, kèm lý do bỏ. Nếu không nhớ nổi, đó là dấu hiệu bạn cần bắt đầu ghi nhật ký quyết định ngay từ dự án đang chạy.',
        level: 'e',
      },
      {
        label: 'Ẩn danh một case nhạy cảm',
        text: 'Lấy một case có dữ liệu thuộc sở hữu công ty và viết lại phiên bản công bố được: đổi số tuyệt đối thành mức thay đổi tương đối, mô tả ngành thay vì tên khách, và thêm một dòng ghi rõ dữ liệu đã được ẩn danh. Đọc lại và tự hỏi câu chuyện còn thuyết phục không.',
        level: 'm',
      },
      {
        label: 'Ba case có chủ đích',
        text: 'Dựng đủ ba case theo ba mục tiêu khác nhau: chiều sâu chuyên môn, làm việc dưới ràng buộc thật, và hướng bạn muốn đi tiếp. Với mỗi case, viết một câu nêu rõ nó đang chứng minh điều gì cho người tuyển, và bỏ mọi nội dung không phục vụ câu đó.',
        level: 'm',
      },
      {
        label: 'Bài kiểm tra hai phút',
        text: 'Nhờ ba người mở đường dẫn portfolio của bạn trong đúng hai phút rồi tắt đi. Hỏi họ nhớ được gì và họ nghĩ bạn giỏi nhất ở mảng nào. Nếu ba người trả lời ba kiểu khác nhau, cấu trúc trang của bạn đang chưa dẫn hướng được người đọc.',
        level: 'm',
      },
      {
        label: 'Case study có phần thất bại',
        text: 'Viết một case về dự án không đạt mục tiêu ban đầu, nêu rõ giả định sai, dấu hiệu bạn đã bỏ qua, thời điểm phát hiện, và điều bạn thay đổi sau đó. Đưa cho một người có kinh nghiệm đọc và hỏi họ nó làm bạn trông kém đi hay đáng tin hơn.',
        level: 'h',
      },
      {
        label: 'Dự án tự khởi xướng để lấp khoảng trống',
        text: 'Xác định một năng lực mà vị trí bạn nhắm đòi hỏi nhưng công việc hiện tại không cho cơ hội chứng minh. Thiết kế một dự án tự làm trong bốn đến sáu tuần tạo ra hiện vật thật cho năng lực đó, có người dùng hoặc người đánh giá bên ngoài, và viết case study đầy đủ khi hoàn thành.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Công việc của bạn là kế toán hoặc vận hành, không có "sản phẩm" để trưng bày. Portfolio khi đó gồm những gì?',
        a: 'Gồm chính những hiện vật của nghề đó: sơ đồ quy trình trước và sau khi bạn cải tiến, mẫu báo cáo bạn thiết kế, bản kiểm tra bạn xây để giảm sai sót, bảng theo dõi có cột số liệu trước và sau, tài liệu hướng dẫn bạn viết cho người mới. Nguyên tắc không đổi: mỗi mục kèm bối cảnh, ràng buộc và kết quả đo được, và mọi dữ liệu nhạy cảm được ẩn danh.',
      },
      {
        q: 'Vì sao nên đưa cả phương án đã bị loại vào case study?',
        a: 'Vì sản phẩm cuối chỉ cho biết bạn đã làm gì, còn phương án bị loại cho biết bạn đã nghĩ như thế nào. Người tuyển đang cố đoán bạn sẽ xử lý ra sao với những bài toán chưa có lời giải trong công ty họ, mà điều đó chỉ suy ra được từ cách bạn cân nhắc và loại trừ, không suy ra được từ một tấm ảnh đẹp.',
      },
      {
        q: 'Bao nhiêu case là đủ, và cập nhật với nhịp nào?',
        a: 'Ba case kể kỹ là điểm cân bằng tốt cho phần lớn trường hợp: đủ để thấy sự nhất quán, chưa đủ nhiều để làm loãng. Nhịp cập nhật hợp lý là mỗi quý thêm hoặc thay một case, đồng thời rà lại các case cũ để cập nhật kết quả dài hạn. Nhịp cố định quan trọng hơn số lượng, vì một hồ sơ được chăm sóc đều nói lên thói quen làm việc rõ hơn bất kỳ dòng mô tả nào.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê nguyên liệu ba năm và đánh dấu ba mục còn nhiều dấu vết nhất. Ngày 2: viết case đầu tiên theo khung năm phần, giới hạn một trang. Ngày 3: thu thập và chuẩn hóa hiện vật cho case đó, gồm cả một bản nháp bị loại. Ngày 4: viết case thứ hai, tập trung vào ràng buộc thật và đánh đổi. Ngày 5: rà toàn bộ về mặt bảo mật và ẩn danh dữ liệu cần ẩn. Ngày 6: dựng một đường dẫn duy nhất, sắp thứ tự và viết đoạn giới thiệu ba dòng ở đầu trang. Ngày 7: chạy bài kiểm tra hai phút với ba người, ghi phản hồi và lên lịch cập nhật cho quý sau.',
    evidence:
      'Portfolio chính là hình thức bằng chứng cô đọng nhất trong cả quyển sách này, nhưng phần thường bị bỏ quên lại là nhật ký quyết định: một tài liệu chạy song song với công việc, ghi lại mỗi lần bạn đứng trước hai phương án thì bạn đã chọn gì và vì sao. Không có nhật ký này, sáu tháng sau bạn chỉ còn nhớ kết quả và case study của bạn sẽ mất đúng phần có giá trị nhất. Trong phỏng vấn, hãy chủ động mở portfolio thay vì chờ được hỏi, chọn trước một case khớp với bài toán của họ, và nói trong ba mươi giây rằng case này chứng minh điều gì trước khi đi vào chi tiết. Với người chuyển ngành, portfolio là con đường nhanh nhất để bù cho việc chưa có chức danh tương ứng trên CV.',
    references: [
      { label: 'Nielsen Norman Group — nghiên cứu và hướng dẫn về UX, gồm cách trình bày case study', url: 'https://www.nngroup.com/', type: 'article' },
      { label: 'Open Source Guides — cách đóng góp công khai tạo dấu vết công việc kiểm chứng được', url: 'https://opensource.guide/', type: 'article' },
    ],
  }),
  // ── Chương 5 · Viết Cover Letter ──────────────────────────────────────────
  guide({
    thesis:
      'Thư ứng tuyển tồn tại để trả lời đúng một câu hỏi mà CV không trả lời được: vì sao chính bạn, chính vị trí này, chính lúc này. Nó là nơi duy nhất trong bộ hồ sơ bạn được nói bằng giọng người và được nối các mảnh rời của CV thành một lập luận. Dấu hiệu của một lá thư yếu rất dễ nhận: đổi tên công ty đi thì lá thư vẫn dùng được nguyên vẹn. Dấu hiệu của lá thư mạnh cũng dễ nhận không kém: nó nêu được một điều cụ thể về nơi đó mà chỉ người đã tìm hiểu mới biết, và nối điều đó với một bằng chứng cụ thể về bạn.',
    why: {
      work:
        'Với những vị trí có nhiều ứng viên ngang nhau trên giấy, lá thư là chỗ duy nhất bạn giải thích được một chuyển hướng nghề nghiệp, một khoảng trống thời gian, hoặc lý do bạn nộp cho một công ty nhỏ hơn nơi cũ — những điều mà CV chỉ trưng ra như dữ kiện đáng ngờ.',
      interview:
        'Lá thư định khung cho buổi gặp đầu tiên. Nếu bạn nêu một bài toán cụ thể của họ và một cách tiếp cận của bạn, người phỏng vấn thường mở đầu bằng chính chủ đề đó, và bạn bước vào cuộc trò chuyện trên phần sân mình đã chuẩn bị.',
      study:
        'Viết thư ứng tuyển học bổng, chương trình đào tạo hay vị trí nghiên cứu dùng cùng một cơ chế: nối động cơ của bạn với mục tiêu của chương trình bằng bằng chứng, thay vì bày tỏ nguyện vọng chung chung.',
      life:
        'Kỹ năng viết một trang thuyết phục có bằng chứng dùng được ở nhiều nơi ngoài tuyển dụng: đề nghị hợp tác, xin tài trợ cho hoạt động cộng đồng, thư gửi phụ huynh, hoặc đề xuất một thay đổi trong tổ dân phố.',
    },
    framework: [
      {
        name: 'Mở bằng một điều cụ thể về họ',
        detail:
          'Câu đầu tiên phải chứa một chi tiết chỉ có được nhờ tìm hiểu: một sản phẩm họ vừa ra, một vấn đề suy ra từ JD, một thay đổi trên thị trường của họ. Câu mở "Tôi rất quan tâm tới vị trí này tại quý công ty" là câu ai cũng viết được nên không mang thông tin nào.',
      },
      {
        name: 'Một bài toán, một bằng chứng',
        detail:
          'Chọn đúng một bài toán bạn tin họ đang có và ghép với đúng một câu chuyện của bạn, kể trong bốn đến năm câu có số liệu. Thư nêu bốn điểm mạnh sẽ bị nhớ bằng không; thư nêu một điểm mạnh có chứng cứ thì được nhớ.',
      },
      {
        name: 'Xử lý điểm yếu trong ba câu',
        detail:
          'Nếu bạn thiếu một yêu cầu lớn, đổi ngành hoặc có khoảng trống thời gian, hãy nói ra ngắn gọn và bình thản: sự thật, năng lực gần nhất đang bù cho nó, kế hoạch có mốc. Im lặng khiến người đọc tự điền vào chỗ trống bằng giả định xấu nhất.',
      },
      {
        name: 'Kết bằng một đề nghị nhỏ',
        detail:
          'Kết thúc bằng một hành động cụ thể và dễ chấp nhận: một cuộc trao đổi mười lăm phút, một bản phân tích ngắn bạn đã đính kèm, một câu hỏi mở về ưu tiên của họ trong quý này. Đề nghị nhỏ dễ được đồng ý hơn lời hứa cống hiến lớn.',
      },
      {
        name: 'Cắt xuống dưới ba trăm năm mươi từ',
        detail:
          'Đọc lại và xóa mọi câu không chứa thông tin mới về bạn hoặc về họ. Thông thường một phần ba lá thư đầu tiên là những câu lịch sự có thể bỏ mà không mất gì, ngoài việc lá thư trở nên đọc được.',
      },
    ],
    scenario:
      'Khoa quản lý một nhà hàng bốn mươi chỗ trong ba năm, nay muốn chuyển sang làm điều phối chuỗi cung ứng cho một công ty phân phối thực phẩm. CV của bạn nhìn qua thì lệch hoàn toàn: chức danh là quản lý nhà hàng, không có dòng nào nói tới chuỗi cung ứng. Lá thư đầu tiên bạn viết mở bằng "Tôi rất mong muốn được làm việc trong môi trường chuyên nghiệp của quý công ty" và liệt kê năm phẩm chất. Không có phản hồi. Bản viết lại bắt đầu bằng một quan sát cụ thể: công ty vừa mở thêm kho lạnh ở khu vực phía Đông thành phố, mà tin tuyển lại nhấn mạnh việc theo dõi hạn dùng và hao hụt — hai chỉ số bạn đã sống cùng ba năm. Phần thân kể một chuyện duy nhất: nhà hàng của bạn từng bỏ đi khoảng một phần tám lượng nguyên liệu tươi mỗi tuần; bạn dựng bảng đặt hàng theo dự báo khách của bảy ngày trước đó, chia đơn thành hai lần giao mỗi tuần thay vì một, và đặt quy tắc kiểm hạn dùng vào đầu mỗi ca; sau bốn tháng hao hụt còn khoảng một phần hai mươi và chi phí nguyên liệu giảm rõ trên báo cáo tháng. Đoạn tiếp theo nói thẳng phần thiếu: bạn chưa từng dùng phần mềm quản lý kho quy mô lớn, đang tự học một hệ thống phổ biến và sẽ hoàn thành phần cơ bản trong sáu tuần. Kết thư là một đề nghị nhỏ: xin mười lăm phút trao đổi, và một câu hỏi về việc họ đang đo hao hụt theo mã hàng hay theo nhóm hàng. Lá thư dài ba trăm mười từ. Bạn được gọi và câu đầu tiên trong buổi phỏng vấn là câu hỏi về cách bạn tính dự báo bảy ngày.',
    comparison: [
      {
        weak: 'Viết lại nội dung CV dưới dạng văn xuôi, khiến người đọc phải đọc hai lần cùng một thông tin.',
        mature:
          'Chọn đúng một điểm trong CV và đào sâu nó bằng bối cảnh, quyết định và kết quả — thứ mà định dạng gạch đầu dòng của CV không chứa nổi.',
      },
      {
        weak: 'Nói nhiều về việc vị trí này tốt cho sự phát triển của bạn như thế nào.',
        mature:
          'Nói về việc bạn giảm được rủi ro hoặc gánh nặng gì cho họ trong ba tháng đầu, vì đó là điều người tuyển thực sự đang mua.',
      },
      {
        weak: 'Dùng giọng văn trang trọng cứng nhắc với nhiều cụm khuôn sáo, làm lá thư nghe như văn bản hành chính.',
        mature:
          'Viết như một email công việc lịch sự mà rõ ràng: câu ngắn, chủ ngữ rõ, không sáo ngữ, đọc to lên nghe vẫn như người thật đang nói.',
      },
    ],
    mistakes: [
      'Gửi cùng một lá thư cho hai mươi nơi và chỉ thay tên công ty. Người đọc nhiều hồ sơ nhận ra ngay khuôn mẫu, và một lá thư khuôn còn tệ hơn không gửi thư, vì nó chứng minh bạn sẵn sàng làm cho có.',
      'Xin lỗi về những điều mình thiếu: "Tuy em chưa có nhiều kinh nghiệm nhưng em rất chăm chỉ". Câu này đặt trọng tâm vào khuyết điểm và không đưa ra bằng chứng nào. Nêu khoảng trống một lần, kèm cách bù, rồi chuyển ngay sang thứ bạn có.',
      'Viết dài hơn một trang vì nghĩ càng nhiều thông tin càng thuyết phục. Lá thư dài phát tín hiệu rằng bạn không phân biệt được đâu là điều quan trọng nhất — một điểm trừ trực tiếp cho gần như mọi vị trí.',
    ],
    worksheet: [
      'Nếu xóa tên công ty khỏi lá thư bạn đang viết, nó còn dùng được cho nơi khác không? Chỗ nào trong thư là chỗ duy nhất không thể tái sử dụng?',
      'Bài toán cụ thể nào bạn tin nơi này đang có, và bạn suy ra nó từ manh mối nào — dòng nào trong JD, tin tức nào, hay lời ai?',
      'Câu chuyện duy nhất bạn chọn kể là gì, và nó có con số nào để người đọc bám vào?',
      'Điểm yếu lớn nhất trong hồ sơ của bạn với vị trí này là gì? Viết ba câu xử lý nó mà không xin lỗi và không giấu.',
      'Đề nghị ở cuối thư của bạn dễ đồng ý đến mức nào? Người nhận cần bỏ ra bao nhiêu phút để đáp ứng nó?',
    ],
    exercises: [
      {
        label: 'Phép thử thay tên',
        text: 'Lấy lá thư gần nhất bạn từng gửi, thay tên công ty và chức danh bằng tên một nơi hoàn toàn khác, rồi đọc lại. Đánh dấu mọi câu vẫn dùng được nguyên vẹn — đó chính là phần cần viết lại hoặc xóa.',
        level: 'e',
      },
      {
        label: 'Ba câu mở đầu khác nhau',
        text: 'Viết ba câu mở đầu cho cùng một vị trí: một câu dựa trên quan sát về sản phẩm hoặc dịch vụ của họ, một câu dựa trên bài toán suy ra từ JD, một câu dựa trên một thay đổi trong ngành. Chọn câu mà chỉ người đã tìm hiểu mới viết được.',
        level: 'e',
      },
      {
        label: 'Nén một câu chuyện xuống năm câu',
        text: 'Chọn thành tích bạn tự hào nhất và kể lại trong đúng năm câu: bối cảnh, vấn đề, việc bạn làm, con số kết quả, hệ quả cho tổ chức. Đọc to và bấm giờ; nếu quá bốn mươi giây thì cắt tiếp.',
        level: 'e',
      },
      {
        label: 'Ba câu xử lý khoảng trống',
        text: 'Viết ba câu về điểm yếu lớn nhất trong hồ sơ của bạn theo cấu trúc: sự thật, năng lực gần nhất đang bù, kế hoạch có mốc thời gian. Đưa cho một người đọc và hỏi họ có cảm thấy bạn đang phòng thủ hay không.',
        level: 'm',
      },
      {
        label: 'Cắt xuống ba trăm năm mươi từ',
        text: 'Lấy một lá thư bạn đã viết và cắt xuống dưới ba trăm năm mươi từ mà không mất luận điểm nào. Ghi lại bạn đã bỏ những loại câu nào và đọc lại xem giọng văn có mạnh hơn không.',
        level: 'm',
      },
      {
        label: 'Ba biến thể cho ba loại công ty',
        text: 'Viết ba lá thư cho cùng một chức danh ở ba loại tổ chức khác nhau: công ty lớn, công ty nhỏ đang tăng trưởng, và tổ chức phi lợi nhuận. Ghi rõ bạn đã đổi luận điểm gì cho từng nơi và vì sao cùng một câu chuyện lại cần nhấn khác nhau.',
        level: 'm',
      },
      {
        label: 'Thư kèm một hiện vật nhỏ',
        text: 'Chọn một vị trí thật, viết thư và đính kèm một hiện vật ngắn dưới hai trang liên quan trực tiếp tới bài toán của họ — bản phân tích, đề xuất, hoặc mẫu công việc. Nộp thật và ghi lại tốc độ phản hồi so với những lần nộp không kèm gì.',
        level: 'h',
      },
      {
        label: 'Đọc chéo với người trong ngành',
        text: 'Nhờ một người đang làm ở vị trí tương đương đọc thư của bạn và trả lời hai câu hỏi: nếu là người tuyển, họ có gọi bạn không, và câu nào khiến họ ngờ vực nhất. Viết lại theo phản hồi và ghi lại điều bạn tưởng là mạnh mà người đọc lại thấy nhạt.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Nhiều nơi không bắt buộc nộp thư ứng tuyển. Vậy có nên viết không?',
        a: 'Nên viết khi hồ sơ của bạn cần một lời giải thích mà CV không chứa được: chuyển ngành, khoảng trống thời gian, thiếu một yêu cầu lớn, hoặc bạn muốn nhắm vào một bài toán cụ thể của nơi đó. Với vị trí bạn khớp hoàn toàn và nộp qua hệ thống lọc tự động, giá trị của thư thấp hơn nhiều. Nguyên tắc thực dụng: viết thư cho những nơi bạn thật sự muốn vào, đừng viết thư đại trà cho mọi nơi.',
      },
      {
        q: 'Bạn không biết tên người sẽ đọc thư. Xử lý thế nào?',
        a: 'Tìm trong khoảng năm phút qua trang tuyển dụng, trang giới thiệu đội ngũ hoặc mạng nghề nghiệp; nếu vẫn không ra thì dùng cách xưng hô theo bộ phận, ví dụ gửi tới bộ phận tuyển dụng hoặc tới người phụ trách nhóm vận hành. Tuyệt đối không dùng cách xưng hô mơ hồ kiểu gửi tới người có liên quan, và cũng không đoán bừa một cái tên — gọi nhầm tên gây thiệt hại lớn hơn nhiều so với việc xưng hô theo chức danh.',
      },
      {
        q: 'Làm sao biết lá thư đã đủ cụ thể?',
        a: 'Kiểm ba dấu hiệu. Một, có ít nhất một chi tiết về công ty mà đối thủ cạnh tranh của họ không dùng được. Hai, có ít nhất một con số hoặc quy mô thuộc về bạn. Ba, khi thay tên công ty thì lá thư trở nên vô nghĩa. Thiếu cả ba dấu hiệu này thì bạn đang gửi một mẫu chung được cá nhân hóa bề mặt.',
      },
    ],
    plan7:
      'Ngày 1: chọn một vị trí thật và tìm hiểu để ghi ra ba chi tiết cụ thể về nơi đó. Ngày 2: viết ba câu mở đầu và chọn một. Ngày 3: chọn một bài toán và nén câu chuyện tương ứng xuống năm câu có số. Ngày 4: viết ba câu xử lý điểm yếu lớn nhất. Ngày 5: ghép thành bản đầy đủ và cắt xuống dưới ba trăm năm mươi từ. Ngày 6: đọc to, sửa mọi câu nghe như văn bản hành chính, nhờ một người trong ngành đọc chéo. Ngày 7: gửi thật, lưu bản đã gửi và ghi ngày để đối chiếu tỷ lệ phản hồi sau này.',
    evidence:
      'Giữ một thư mục các lá thư đã gửi kèm kết quả: nơi nào phản hồi, sau bao nhiêu ngày, và câu nào trong thư được người phỏng vấn nhắc lại ở buổi gặp. Sau mười lăm lá thư bạn sẽ có dữ liệu thật về loại lập luận nào hiệu quả với ngành của mình, thay vì làm theo lời khuyên chung. Bản thân năng lực viết một trang thuyết phục có bằng chứng cũng là thứ đưa được vào hồ sơ: nhiều vị trí nhân sự, kinh doanh, truyền thông và quản lý sẽ yêu cầu bài viết mẫu, và một lá thư ứng tuyển tự viết đạt chuẩn là mẫu hợp lệ. Trong phỏng vấn, khi được hỏi vì sao bạn chọn nơi này, hãy nói đúng lập luận trong thư — sự nhất quán giữa văn bản và lời nói tự nó là một tín hiệu đáng tin.',
    references: [
      { label: 'Plain Language — nguyên tắc viết rõ ràng, ngắn gọn của chính phủ Hoa Kỳ', url: 'https://www.plainlanguage.gov/guidelines/', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Communication', url: 'https://hbr.org/topic/subject/communication', type: 'article' },
    ],
  }),

  // ── Chương 6 · Xây dựng thương hiệu cá nhân ───────────────────────────────
  guide({
    thesis:
      'Thương hiệu cá nhân trong nghề nghiệp không phải hình ảnh bạn tự tuyên bố, mà là câu người khác nói về bạn khi bạn không có mặt trong phòng. Bạn không kiểm soát được câu đó, nhưng bạn ảnh hưởng được nó bằng hai thứ: chất lượng công việc lặp đi lặp lại trong một lĩnh vực hẹp, và mức độ dễ nhìn thấy của công việc đó. Vì vậy xây thương hiệu cá nhân là bài toán ngược với việc đăng bài nhiều: chọn một lĩnh vực đủ hẹp để bạn thật sự có gì để nói, rồi để lại dấu vết công khai đều đặn về chính việc bạn đang làm.',
    why: {
      work:
        'Khi có việc mới cần người, người ta nghĩ tới ai đã để lại dấu vết trong lĩnh vực đó chứ không mở lại hồ sơ nhân sự. Một người được nhớ tới đúng lúc sẽ nhận được cơ hội mà chín người giỏi tương đương nhưng vô hình không bao giờ nghe nói tới.',
      interview:
        'Trước khi gặp bạn, phần lớn người tuyển sẽ tìm tên bạn trên mạng. Thứ họ tìm thấy — hoặc không tìm thấy gì — đã định sẵn một phần ấn tượng ban đầu, và bạn chỉ có bốn mươi lăm phút để sửa nó nếu nó bất lợi.',
      study:
        'Viết công khai về thứ đang học là một cơ chế học tập chứ không chỉ là quảng bá: viết cho người lạ đọc buộc bạn phải hiểu đủ sâu để giải thích, và phần bình luận thường chỉ ra chỗ bạn sai sớm hơn bất kỳ bài kiểm tra nào.',
      life:
        'Danh tiếng nghề nghiệp là tài sản tích lũy chậm nhưng hiếm khi mất trắng. Nó chính là thứ giúp bạn tìm được việc sau một lần công ty đóng cửa, hoặc mời được người giỏi tham gia dự án riêng khi bạn chưa có gì ngoài lời nói.',
    },
    framework: [
      {
        name: 'Chọn một lĩnh vực hẹp bạn có quyền nói',
        detail:
          'Hẹp tới mức bạn có thể mô tả bằng một cụm cụ thể, ví dụ kiểm soát chất lượng trong lắp ráp điện tử, hoặc kế toán cho hộ kinh doanh nhỏ. Chủ đề rộng như phát triển bản thân là chỗ bạn cạnh tranh với hàng chục nghìn người và không có lợi thế nào.',
      },
      {
        name: 'Xác định người nhận cụ thể',
        detail:
          'Viết cho ai: người mới vào nghề của bạn, đồng nghiệp cùng cấp ở công ty khác, hay người tuyển dụng của ngành. Ba nhóm này cần ba loại nội dung khác nhau, và cố viết cho cả ba cùng lúc thường ra nội dung không ai thấy hữu ích.',
      },
      {
        name: 'Rút nội dung từ công việc thật',
        detail:
          'Nguồn bền vững nhất là chính việc bạn làm mỗi ngày: một lỗi đã gặp và cách sửa, một quy trình đã cải tiến, một tài liệu đã viết cho người mới, một sai lầm đã trả giá. Nội dung sao chép lại lời khuyên chung sẽ cạn trong sáu tuần và không tạo được uy tín nào.',
      },
      {
        name: 'Đặt nhịp bền vững thay vì nhịp cao',
        detail:
          'Một bài mỗi hai tuần duy trì được trong một năm mạnh hơn hẳn mười bài trong ba tuần rồi im lặng. Chọn nhịp bạn giữ được cả trong tuần bận nhất, vì tính đều đặn mới là thứ tạo ra hiệu ứng tích lũy.',
      },
      {
        name: 'Đo bằng cơ hội, không đo bằng lượt xem',
        detail:
          'Chỉ số đáng theo dõi là số cuộc trò chuyện có ích được bắt đầu từ nội dung của bạn: lời mời trao đổi, câu hỏi từ người lạ trong ngành, lời giới thiệu việc. Lượt thích có thể tăng trong khi không có cơ hội nào xuất hiện, và ngược lại.',
      },
    ],
    scenario:
      'Vy làm kỹ sư đảm bảo chất lượng ở một nhà máy lắp ráp linh kiện điện tử được sáu năm, chuyên về phân tích lỗi hàn trên bo mạch. Bạn không thích quay video, không muốn kể chuyện đời và cũng không có thời gian. Bạn chọn cách hẹp nhất có thể: mỗi hai tuần đăng một bài ngắn khoảng bốn trăm từ trên trang mạng nghề nghiệp, mỗi bài mổ xẻ đúng một dạng lỗi thật đã gặp, kèm ảnh minh họa được vẽ lại chứ không chụp trong xưởng, và luôn theo cùng một khung: hiện tượng quan sát được, ba nguyên nhân thường bị nhầm lẫn, cách phân biệt bằng phép kiểm rẻ nhất, và chi phí nếu phát hiện muộn. Bạn không nói tên nhà máy, không đưa số liệu nội bộ, và tự đặt luật kiểm tra lại với quản lý trực tiếp trước khi đăng bài đầu tiên để tránh vướng bảo mật. Sau chín tháng và mười tám bài, lượt xem mỗi bài vẫn ở mức khiêm tốn, nhưng có ba việc đã xảy ra: một nhà cung cấp thiết bị kiểm tra mời bạn nói chuyện trong hội thảo khách hàng của họ; hai kỹ sư ở nhà máy khác nhắn hỏi cách xử lý một dạng lỗi và sau đó thành mối quan hệ trao đổi nghề thường xuyên; và một người tuyển dụng liên hệ về vị trí trưởng nhóm chất lượng ở một công ty khác, mở đầu bằng cách trích lại đúng bài bạn viết về lỗi rỗ chân hàn. Vy không nhận việc đó, nhưng dùng chính lời mời làm cơ sở để đề nghị mở rộng phạm vi công việc ở nơi đang làm.',
    comparison: [
      {
        weak: 'Đăng lời khuyên chung về thái độ và động lực, thứ ai cũng viết được và không chứng minh được năng lực nào.',
        mature:
          'Đăng thứ chỉ người làm nghề mới biết: một lỗi cụ thể, cách chẩn đoán, chi phí thật của việc phát hiện muộn.',
      },
      {
        weak: 'Coi thương hiệu cá nhân là việc tạo hình ảnh, nên đầu tư vào ảnh chân dung và câu khẩu hiệu trước khi có nội dung.',
        mature:
          'Coi nó là hệ quả của việc làm tốt được nhìn thấy, nên đầu tư vào việc tích lũy và trình bày công việc thật, còn phần hình thức chỉ cần đủ gọn gàng.',
      },
      {
        weak: 'Đăng dồn dập một tháng theo cảm hứng rồi biến mất nửa năm, khiến người theo dõi không hình thành được kỳ vọng nào.',
        mature:
          'Giữ một nhịp thấp nhưng đều, có sẵn ba bài dự trữ cho những tuần bận, và chấp nhận rằng hiệu quả xuất hiện sau nhiều tháng chứ không sau vài bài.',
      },
    ],
    mistakes: [
      'Vi phạm bảo mật hoặc làm lộ thông tin nhạy cảm của công ty khi kể chuyện nghề. Nguyên tắc an toàn: không số liệu nội bộ, không tên khách hàng, không ảnh chụp trong khu vực sản xuất hoặc màn hình hệ thống, và khi không chắc thì hỏi quản lý trước. Một bài viết hay không đáng để đánh đổi bằng một vi phạm hợp đồng lao động.',
      'Nói xấu công ty cũ hoặc đồng nghiệp để tạo nội dung gây chú ý. Nó hiệu quả trong ngắn hạn và gây thiệt hại dài hạn, vì người tuyển đọc được sẽ tự hỏi bạn sẽ nói gì về họ sau này.',
      'Xây thương hiệu quanh một hình ảnh không khớp với con người thật, ví dụ tự dựng hình ảnh chuyên gia trong lĩnh vực mới học được ba tháng. Khoảng cách sẽ lộ ra trong buổi phỏng vấn đầu tiên có người hỏi sâu, và thiệt hại lớn hơn nhiều so với lợi ích của việc gây chú ý.',
    ],
    worksheet: [
      'Nếu một đồng nghiệp cũ được hỏi bạn giỏi nhất việc gì, họ sẽ trả lời thế nào? Câu đó có trùng với điều bạn muốn được nhớ tới không?',
      'Lĩnh vực hẹp bạn có quyền nói là gì, diễn đạt trong một cụm dưới mười từ? Bạn có bao nhiêu kinh nghiệm thật trong đúng cụm đó?',
      'Tìm tên bạn trên mạng bằng chế độ ẩn danh. Ba kết quả đầu tiên nói gì về bạn, và có gì bạn muốn thay đổi?',
      'Trong ba tháng qua, bạn đã học được điều gì trong công việc mà người mới vào nghề của bạn sẽ thấy hữu ích? Liệt kê năm điều.',
      'Nhịp đăng nào bạn giữ được ngay cả trong tuần bận nhất, và bạn sẽ chuẩn bị trước bao nhiêu bài dự trữ để giữ nhịp đó?',
    ],
    exercises: [
      {
        label: 'Câu định vị một dòng',
        text: 'Viết một câu theo mẫu: tôi giúp nhóm người nào giải quyết vấn đề gì bằng năng lực nào. Viết năm phiên bản rồi chọn phiên bản hẹp nhất mà bạn vẫn có bằng chứng thật để đứng sau nó.',
        level: 'e',
      },
      {
        label: 'Kiểm kê dấu chân số',
        text: 'Tìm tên bạn trên máy tìm kiếm ở chế độ ẩn danh và ghi lại mười kết quả đầu tiên. Phân loại thành ba nhóm: có lợi, trung tính, bất lợi. Với nhóm bất lợi, ghi rõ bạn có thể gỡ, sửa hay chỉ có thể đẩy xuống bằng nội dung mới.',
        level: 'e',
      },
      {
        label: 'Danh sách hai mươi chủ đề từ công việc',
        text: 'Viết hai mươi chủ đề rút trực tiếp từ việc bạn đã làm trong sáu tháng: lỗi đã gặp, quy trình đã sửa, công cụ đã thử, câu hỏi người mới hay hỏi bạn. Đây là kho đủ cho gần một năm nếu bạn giữ nhịp hai tuần một bài.',
        level: 'e',
      },
      {
        label: 'Viết bài đầu tiên theo khung cố định',
        text: 'Chọn một chủ đề và viết bốn trăm từ theo khung: hiện tượng, các nguyên nhân dễ nhầm, cách phân biệt, chi phí nếu bỏ qua. Trước khi đăng, rà một lượt riêng để bỏ mọi thông tin có thể vi phạm bảo mật.',
        level: 'm',
      },
      {
        label: 'Dọn hồ sơ nghề nghiệp',
        text: 'Viết lại phần giới thiệu trên hồ sơ nghề nghiệp trực tuyến của bạn theo cấu trúc: bạn làm gì, cho ai, với bằng chứng nào, và bạn đang tìm loại trao đổi nào. Nhờ hai người trong ngành đọc và nói xem họ có hiểu bạn làm gì sau mười giây không.',
        level: 'm',
      },
      {
        label: 'Ba tháng giữ nhịp',
        text: 'Cam kết một nhịp cụ thể trong ba tháng, chuẩn bị trước ba bài dự trữ, và ghi vào lịch những ngày đăng. Cuối kỳ, đếm số cuộc trò chuyện có ích được bắt đầu từ nội dung của bạn thay vì đếm lượt xem.',
        level: 'm',
      },
      {
        label: 'Chuyển một bài viết thành bài nói',
        text: 'Lấy chủ đề được phản hồi tốt nhất và chuyển thành bài chia sẻ mười lăm phút cho nội bộ công ty hoặc một nhóm nghề. Ghi lại ba câu hỏi khó nhất bạn nhận được và viết bài tiếp theo trả lời chính những câu đó.',
        level: 'h',
      },
      {
        label: 'Sổ tay tham chiếu công khai',
        text: 'Chọn một chủ đề hẹp trong nghề và xây một tài liệu tham chiếu công khai hoàn chỉnh — bản kiểm tra, hướng dẫn xử lý sự cố, hoặc bộ mẫu — đủ tốt để người lạ dùng được mà không cần hỏi bạn. Theo dõi trong ba tháng xem có ai dùng lại và trích dẫn nó không.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Bạn không muốn xuất hiện trên mạng xã hội. Có thể xây thương hiệu cá nhân không?',
        a: 'Có, vì kênh không phải điều kiện bắt buộc. Các đường khác vẫn hiệu quả: viết tài liệu nội bộ chất lượng cao được các phòng khác dùng lại, chia sẻ trong hội nhóm nghề, nói ở hội thảo ngành, đóng góp cho một dự án mở, hoặc đơn giản là trở thành người mà đồng nghiệp cũ luôn giới thiệu khi ai đó hỏi. Điểm chung của mọi đường là để lại dấu vết kiểm chứng được về chuyên môn, không phải là có mặt trên một nền tảng cụ thể.',
      },
      {
        q: 'Vì sao chủ đề hẹp lại tốt hơn chủ đề rộng khi bắt đầu?',
        a: 'Vì ba lý do thực dụng. Một, bạn có đủ chất liệu thật để nói lâu dài mà không phải chép lại của người khác. Hai, người đọc nhớ được bạn gắn với cái gì, mà trí nhớ có tính phân loại. Ba, trong một chủ đề hẹp bạn có thể trở thành một trong vài người dễ tìm thấy, còn trong chủ đề rộng bạn cạnh tranh với những người đã đầu tư nhiều năm.',
      },
      {
        q: 'Đo hiệu quả của việc xây thương hiệu cá nhân bằng gì cho đúng?',
        a: 'Bằng số cơ hội có thật, không bằng chỉ số hiển thị. Cụ thể: số lời mời trao đổi từ người trong ngành, số câu hỏi chuyên môn nhận được từ người lạ, số lần được giới thiệu cho một việc, và số lần nội dung của bạn được người khác trích dẫn lại. Bốn con số này có thể rất nhỏ trong sáu tháng đầu; điều quan trọng là chúng khác không và có xu hướng tăng, chứ không phải chúng lớn.',
      },
    ],
    plan7:
      'Ngày 1: viết năm phiên bản câu định vị và chọn phiên bản hẹp nhất có bằng chứng. Ngày 2: kiểm kê dấu chân số và phân loại mười kết quả đầu. Ngày 3: liệt kê hai mươi chủ đề rút từ công việc sáu tháng qua. Ngày 4: viết bài đầu tiên theo khung cố định, rà bảo mật trước khi đăng. Ngày 5: dọn lại hồ sơ nghề nghiệp trực tuyến và nhờ hai người kiểm tra độ rõ. Ngày 6: đăng bài đầu tiên và ghi lại phản hồi đầu tiên. Ngày 7: đặt nhịp cho ba tháng tới vào lịch và viết trước một bài dự trữ.',
    evidence:
      'Bằng chứng ở đây có hai lớp. Lớp thứ nhất là chính chuỗi nội dung công khai: một đường dẫn tới mười lăm bài viết trong một chủ đề hẹp là thứ mà không CV nào giả được, và nó chứng minh cả chuyên môn lẫn tính kỷ luật. Lớp thứ hai là bảng theo dõi cơ hội: một tệp ghi mỗi lần có người liên hệ vì nội dung của bạn, họ hỏi gì, và điều đó dẫn tới đâu. Trong phỏng vấn, câu "em duy trì một chuỗi bài về chẩn đoán lỗi hàn suốt chín tháng, và ba trong số đó dẫn tới lời mời nói chuyện tại hội thảo khách hàng của nhà cung cấp thiết bị" nói lên nhiều thứ cùng lúc: chuyên môn, khả năng diễn đạt, sự bền bỉ và mức độ được ngành công nhận. Nếu bạn ứng tuyển vị trí quản lý, chuỗi nội dung đó còn là bằng chứng bạn biết đào tạo người khác.',
    references: [
      { label: 'Nielsen Norman Group — chuyên mục viết nội dung cho người đọc trên web', url: 'https://www.nngroup.com/topic/writing-web/', type: 'article' },
      { label: 'GitLab Handbook — ví dụ về làm việc công khai và ghi lại tri thức', url: 'https://handbook.gitlab.com/', type: 'article' },
    ],
  }),

  // ── Chương 7 · Networking ─────────────────────────────────────────────────
  guide({
    thesis:
      'Networking không phải nghệ thuật xin xỏ lịch sự, mà là việc chủ động tạo và duy trì một mạng lưới quan hệ nghề nghiệp mà bạn có ích cho người khác trước khi cần họ. Hai hiểu lầm giết chết kỹ năng này: tin rằng nó dành cho người hướng ngoại, và chỉ liên lạc khi đang cần việc. Thực tế phần lớn cơ hội đến từ những mối quan hệ không thân — người bạn gặp vài lần, đủ để họ nhớ bạn làm gì — vì họ đứng ở những mạng lưới khác với mạng lưới của bạn, nên biết những cơ hội mà bạn bè thân của bạn không biết.',
    why: {
      work:
        'Nhiều vị trí được lấp trước khi tin tuyển được đăng, và nhiều dự án hợp tác bắt đầu từ một lời giới thiệu. Người có mạng lưới rộng vừa phải nhưng được duy trì sẽ nghe về cơ hội sớm hơn vài tuần — khoảng thời gian đủ để chuẩn bị tử tế thay vì nộp vội.',
      interview:
        'Một lời giới thiệu nội bộ thường đưa hồ sơ của bạn qua vòng lọc đầu tiên và cho người phỏng vấn một điểm neo tích cực. Nó không thay được năng lực, nhưng nó mua cho bạn cơ hội được đánh giá bằng năng lực.',
      study:
        'Người đang học một lĩnh vực mới tiến nhanh gấp nhiều lần khi có người trong nghề chỉ ra cái gì đáng học trước và cái gì đang lỗi thời — thông tin này gần như không tồn tại trong giáo trình và mất giá rất nhanh.',
      life:
        'Mạng lưới nghề nghiệp cũng là mạng lưới an toàn. Khi công ty cắt giảm hoặc ngành gặp khó, người có quan hệ được duy trì thường có ba cuộc trò chuyện để bắt đầu, còn người không có phải bắt đầu bằng việc gửi hồ sơ vào hộp thư chung.',
    },
    framework: [
      {
        name: 'Vẽ bản đồ mạng lưới hiện có',
        detail:
          'Liệt kê những người bạn đã quen qua công việc, học hành, dự án và cộng đồng, chia làm ba vòng: thân thiết, quen biết, và từng gặp một lần. Hầu hết mọi người đánh giá thấp vòng thứ ba, trong khi đó lại là vòng chứa nhiều thông tin mới nhất.',
      },
      {
        name: 'Xác định khoảng trống',
        detail:
          'So bản đồ với hướng nghề bạn nhắm và tìm chỗ trống: bạn không quen ai trong ngành đó, hoặc chỉ quen người cùng cấp mà không quen ai ở cấp ra quyết định, hoặc mạng lưới của bạn toàn người cùng công ty. Khoảng trống định hướng cho việc bạn nên gặp ai.',
      },
      {
        name: 'Cho trước khi xin',
        detail:
          'Trước khi nhờ vả, hãy tìm cách có ích trước ở mức nhỏ: chia sẻ một tài liệu đúng lúc, giới thiệu hai người nên biết nhau, trả lời một câu hỏi trong nhóm nghề, ghi nhận công khai một việc tốt của ai đó. Đây không phải mánh khóe mà là cách xây quan hệ có thể chịu được một lời nhờ sau này.',
      },
      {
        name: 'Đề nghị nhỏ, cụ thể, dễ từ chối',
        detail:
          'Khi liên hệ người lạ, hãy xin một thứ nhỏ và rõ: mười lăm phút hỏi về một chủ đề cụ thể, hoặc câu trả lời cho đúng một câu hỏi qua tin nhắn. Câu "anh chị có thể cho em xin lời khuyên về sự nghiệp không" là đề nghị lớn và mơ hồ nên thường bị bỏ qua.',
      },
      {
        name: 'Duy trì bằng nhịp nhẹ',
        detail:
          'Đặt một nhịp liên lạc nhẹ mà bền: cập nhật ngắn hai đến ba lần một năm với những người quan trọng, kèm một thứ có ích cho họ chứ không kèm lời nhờ. Mạng lưới chết vì im lặng nhiều hơn là vì làm phiền.',
      },
    ],
    scenario:
      'Tuấn là kiến trúc sư ba năm kinh nghiệm làm cho một văn phòng thiết kế ở tỉnh, muốn chuyển vào một công ty lớn ở thành phố. Bạn không quen ai ở đó và cách duy nhất bạn từng dùng là gửi hồ sơ vào hộp thư tuyển dụng, sáu lần đều im lặng. Bạn vẽ bản đồ mạng lưới và phát hiện điều mình chưa nghĩ tới: vòng ngoài cùng của bạn có bốn người đáng chú ý — hai bạn cùng khóa đã vào thành phố, một giảng viên cũ đang làm phản biện cho các đồ án, và một kỹ sư kết cấu từng phối hợp với bạn trong một dự án trường học. Thay vì nhắn xin việc, bạn làm ba việc trong ba tháng. Một, bạn tổng hợp lại kinh nghiệm xử lý một chi tiết chống thấm sân thượng hay hỏng ở khí hậu miền Trung thành một ghi chú có hình vẽ và gửi cho kỹ sư kết cấu kia vì biết anh đang làm một dự án tương tự; anh dùng được và chuyển tiếp cho hai đồng nghiệp. Hai, bạn nhắn cho một bạn cùng khóa xin mười lăm phút để hỏi đúng một câu: các văn phòng lớn ở thành phố đánh giá hồ sơ của người làm ở tỉnh theo tiêu chí nào. Câu trả lời hữu ích và bất ngờ: họ ít quan tâm quy mô dự án mà quan tâm bạn có làm được hồ sơ bản vẽ thi công đầy đủ hay không, thứ mà người ở văn phòng lớn thường chỉ làm một phần. Ba, bạn nhờ giảng viên cũ giới thiệu tới một hội thảo nghề nhỏ và đến dự, nói chuyện với bốn người, và sau đó gửi cho mỗi người một tin nhắn ngắn nhắc lại nội dung đã trao đổi. Bảy tháng sau, một trong bốn người đó nhắn cho bạn khi văn phòng của họ cần thêm người làm hồ sơ kỹ thuật. Điều đáng chú ý: cơ hội đến từ người bạn gặp đúng một lần, không đến từ ba người thân nhất.',
    comparison: [
      {
        weak: 'Chỉ liên lạc khi đang cần việc, mở đầu bằng một đoạn dài kể hoàn cảnh và kết bằng lời nhờ chung chung.',
        mature:
          'Duy trì liên lạc nhẹ khi không cần gì, và khi cần thì gửi một đề nghị nhỏ, cụ thể, nói rõ bạn cần đúng cái gì và mất bao nhiêu thời gian của người kia.',
      },
      {
        weak: 'Đi sự kiện ngành để thu thập càng nhiều danh thiếp càng tốt rồi không bao giờ liên lạc lại.',
        mature:
          'Đặt mục tiêu ba cuộc trò chuyện có nội dung thật trong một sự kiện, và gửi tin nhắn nối tiếp trong bốn mươi tám giờ nhắc lại đúng điều đã trao đổi.',
      },
      {
        weak: 'Chỉ tìm cách quen người ở cấp cao hơn nhiều, vì tin rằng chỉ họ mới giúp được.',
        mature:
          'Đầu tư đều cho cả người cùng cấp và người mới vào nghề, vì trong năm đến mười năm chính họ mới là mạng lưới quyết định, và họ dễ có thời gian cho bạn hơn ngay bây giờ.',
      },
    ],
    mistakes: [
      'Nhắn cho người lạ một tin dài kể toàn bộ hoàn cảnh cá nhân rồi kết bằng câu nhờ giới thiệu việc. Người nhận phải bỏ nhiều công để hiểu và không biết chính xác bạn cần gì, nên phản ứng dễ nhất là không trả lời.',
      'Nhầm networking với việc gom quan hệ theo số lượng, nên có bốn nghìn kết nối trên mạng nghề nghiệp mà không có ba người sẵn sàng viết cho bạn một lời giới thiệu thật. Chiều sâu của vài chục quan hệ có giá trị hơn chiều rộng của vài nghìn.',
      'Coi việc nhờ giúp là làm phiền nên không bao giờ mở lời, rồi kết luận rằng networking không hiệu quả với mình. Phần lớn người có kinh nghiệm sẵn lòng dành mười lăm phút cho một câu hỏi rõ ràng; điều họ ngại là những đề nghị mơ hồ và không có giới hạn.',
    ],
    worksheet: [
      'Vẽ ba vòng quan hệ nghề nghiệp của bạn và đếm số người ở vòng ngoài cùng. Bạn đã liên lạc với bao nhiêu người trong số đó trong mười hai tháng qua?',
      'Với hướng nghề bạn nhắm, bạn đang không quen ai ở đâu — ngành nào, cấp nào, loại công ty nào?',
      'Trong sáu tháng qua, bạn đã chủ động có ích cho ai trong mạng lưới mà không kèm lời nhờ nào? Cụ thể là việc gì?',
      'Nếu phải nhắn cho một người lạ trong ngành ngay hôm nay, đề nghị nhỏ và cụ thể của bạn là gì, viết thành đúng ba câu?',
      'Năm người nào trong mạng lưới của bạn đáng được duy trì liên lạc chủ động, và bạn sẽ liên lạc theo nhịp nào trong năm tới?',
    ],
    exercises: [
      {
        label: 'Bản đồ ba vòng',
        text: 'Viết ra tên mọi người bạn đã quen qua công việc, học hành và cộng đồng, chia làm ba vòng theo mức thân. Đánh dấu những người bạn chưa liên lạc trên một năm nhưng vẫn nhớ rõ đã làm việc gì cùng nhau.',
        level: 'e',
      },
      {
        label: 'Ba câu giới thiệu bản thân',
        text: 'Viết một đoạn giới thiệu ba câu dùng khi gặp người mới trong ngành: bạn làm gì, cho ai, và đang quan tâm tới vấn đề gì. Đọc to nhiều lần cho tự nhiên, và chuẩn bị một biến thể ngắn hơn dùng khi người đối diện đang vội.',
        level: 'e',
      },
      {
        label: 'Một lần cho đi',
        text: 'Chọn một người trong mạng lưới và làm một việc có ích cho họ trong tuần này mà không kèm lời nhờ: gửi một tài liệu đúng nhu cầu, giới thiệu họ với người nên biết, hoặc ghi nhận công khai một việc họ làm tốt. Ghi lại phản ứng của họ.',
        level: 'e',
      },
      {
        label: 'Tin nhắn ba câu cho người lạ',
        text: 'Soạn tin nhắn liên hệ một người lạ trong ngành theo cấu trúc: bạn là ai và vì sao nhắn cho đúng họ, đề nghị nhỏ cụ thể có giới hạn thời gian, và một câu cho phép họ từ chối dễ dàng. Gửi thật cho ba người và ghi lại tỷ lệ trả lời.',
        level: 'm',
      },
      {
        label: 'Ba cuộc trò chuyện tại một sự kiện',
        text: 'Đến một sự kiện hoặc nhóm nghề với mục tiêu ba cuộc trò chuyện có nội dung thật thay vì gặp nhiều người. Chuẩn bị trước hai câu hỏi mở, và trong bốn mươi tám giờ sau đó gửi tin nhắn nối tiếp nhắc lại đúng điều đã trao đổi.',
        level: 'm',
      },
      {
        label: 'Sổ theo dõi quan hệ',
        text: 'Lập một bảng đơn giản gồm tên, nơi làm việc, lần liên lạc gần nhất, chủ đề họ quan tâm và điều bạn có thể giúp. Cập nhật sau mỗi cuộc trò chuyện và đặt lời nhắc cho những người bạn muốn giữ nhịp hai đến ba lần mỗi năm.',
        level: 'm',
      },
      {
        label: 'Chuỗi năm cuộc trò chuyện nghề',
        text: 'Trong sáu tuần, thực hiện năm cuộc trò chuyện mười lăm phút với năm người ở năm bối cảnh khác nhau trong lĩnh vực bạn nhắm. Sau mỗi cuộc, viết ba dòng: điều bất ngờ nhất, điều cần kiểm chứng thêm, và người họ gợi ý bạn nên gặp tiếp.',
        level: 'h',
      },
      {
        label: 'Trở thành người kết nối',
        text: 'Trong hai tháng, chủ động giới thiệu ba cặp người trong mạng lưới của bạn nên biết nhau, mỗi lần kèm một câu giải thích vì sao họ nên nói chuyện và hỏi ý cả hai bên trước. Theo dõi kết quả và ghi lại điều bạn học được về việc giới thiệu thế nào thì có ích thật.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Bạn hướng nội và thấy sợ khi phải bắt chuyện với người lạ. Networking có phù hợp không?',
        a: 'Phù hợp, nhưng nên đổi hình thức. Người hướng nội thường mạnh ở kênh viết và ở các cuộc trò chuyện một đối một sâu, cả hai đều là networking hợp lệ và thường hiệu quả hơn việc đứng giữa một phòng đông người. Cách làm thực dụng: liên hệ trước bằng tin nhắn có nội dung cụ thể, hẹn gặp riêng mười lăm phút, và ở sự kiện thì đặt mục tiêu ba cuộc trò chuyện thay vì cố gặp thật nhiều người.',
      },
      {
        q: 'Vì sao những mối quan hệ không thân lại hay mang đến cơ hội hơn bạn thân?',
        a: 'Vì bạn thân thường ở cùng mạng lưới thông tin với bạn: cùng công ty, cùng ngành, cùng nhóm bạn, nên họ biết gần đúng những gì bạn đã biết. Người quen sơ đứng ở mạng lưới khác nên mang thông tin mới. Hệ quả thực tiễn: đừng bỏ rơi vòng ngoài cùng, và hãy đảm bảo những người ở đó biết rõ bạn đang làm gì và đang tìm gì, vì họ chỉ nghĩ tới bạn khi họ nhớ được bạn làm gì.',
      },
      {
        q: 'Nhờ giới thiệu thế nào để người kia không khó xử?',
        a: 'Làm cho việc giúp trở nên rẻ và có đường lui. Cụ thể: nói rõ vị trí và công ty, gửi kèm một đoạn ngắn về bạn để họ chuyển tiếp mà không phải tự viết, nói rõ bạn chỉ cần một lời giới thiệu chứ không cần họ bảo lãnh, và thêm một câu cho phép họ từ chối nếu không đủ hiểu công việc của bạn. Sau đó, dù kết quả thế nào cũng báo lại cho họ biết — bước này ít người làm và nó quyết định lần nhờ tiếp theo.',
      },
    ],
    plan7:
      'Ngày 1: vẽ bản đồ ba vòng quan hệ và đếm số người ở vòng ngoài cùng. Ngày 2: so bản đồ với hướng nghề và ghi ra ba khoảng trống. Ngày 3: viết đoạn giới thiệu ba câu và một biến thể ngắn. Ngày 4: làm một việc có ích cho một người trong mạng lưới, không kèm lời nhờ. Ngày 5: soạn và gửi tin nhắn ba câu cho ba người lạ trong ngành. Ngày 6: lập sổ theo dõi quan hệ với năm người quan trọng nhất và đặt nhịp liên lạc. Ngày 7: đăng ký một sự kiện hoặc nhóm nghề và chuẩn bị hai câu hỏi mở để dùng.',
    evidence:
      'Bằng chứng của kỹ năng này không phải số lượng kết nối mà là sổ theo dõi quan hệ cùng biên bản các cuộc trò chuyện nghề: mỗi biên bản ghi ngày, người, chủ đề, điều bất ngờ nhất và việc bạn đã làm sau đó. Trong phỏng vấn cho các vị trí kinh doanh, đối tác, tuyển dụng hay quản lý, năng lực xây quan hệ được hỏi trực tiếp, và câu trả lời mạnh nhất là một chuỗi có thật: bạn đã chủ động gặp ai, đã có ích cho họ thế nào trước, và điều đó dẫn tới kết quả gì cho công việc. Một dạng bằng chứng khác cũng rất mạnh: những lời giới thiệu bằng văn bản mà người khác tự nguyện viết cho bạn trên hồ sơ nghề nghiệp — chúng chỉ xuất hiện khi bạn đã thật sự có ích cho ai đó.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Collaboration và quan hệ công việc', url: 'https://hbr.org/topic/subject/collaboration', type: 'article' },
      { label: 'Greater Good Science Center — chủ đề kết nối xã hội', url: 'https://greatergood.berkeley.edu/topic/social_connection', type: 'article' },
    ],
  }),

  // ── Chương 8 · Chuẩn bị phỏng vấn ─────────────────────────────────────────
  guide({
    thesis:
      'Chuẩn bị phỏng vấn không phải học thuộc câu trả lời mẫu, mà là xây một kho nguyên liệu và một bản đồ dự đoán. Kho nguyên liệu là mười hai đến mười lăm câu chuyện thật của bạn, mỗi câu chuyện có bối cảnh, hành động, con số và bài học. Bản đồ dự đoán là danh sách các câu hỏi có xác suất cao được rút ra từ chính JD và từ cấu trúc vòng phỏng vấn. Người chuẩn bị tốt không phải người không lo lắng, mà là người khi nghe một câu hỏi lạ vẫn nhận ra nó thuộc nhóm nào và biết lấy câu chuyện nào ra dùng.',
    why: {
      work:
        'Quá trình chuẩn bị buộc bạn hệ thống hóa toàn bộ kinh nghiệm của mình, và bản thân việc đó cải thiện cách bạn nói về công việc trong họp, trong báo cáo và trong đánh giá cuối năm, không chỉ trong phỏng vấn.',
      interview:
        'Phần lớn ứng viên trượt không vì thiếu năng lực mà vì không diễn đạt được năng lực trong bốn mươi lăm phút. Chuẩn bị là cách bù cho việc trí nhớ hoạt động kém dưới áp lực.',
      study:
        'Ôn phỏng vấn dùng chung cơ chế với ôn thi hiệu quả: truy hồi chủ động và luyện trong điều kiện gần giống thi thật. Đọc lại câu trả lời mẫu cho cảm giác đã thuộc nhưng không tạo được khả năng nói ra dưới áp lực.',
      life:
        'Cấu trúc chuẩn bị này dùng được cho mọi cuộc trò chuyện quan trọng có tính đánh giá: bảo vệ đồ án, gặp nhà đầu tư, họp phụ huynh, hoặc một cuộc thương lượng lớn trong đời sống.',
    },
    framework: [
      {
        name: 'Dựng kho mười hai câu chuyện',
        detail:
          'Viết mười hai đến mười lăm tình huống thật đã trải qua, phủ các chủ đề hay được hỏi: thành công lớn nhất, thất bại, xung đột với đồng nghiệp, deadline căng, thuyết phục người khác, học nhanh thứ mới, sai lầm phải sửa, làm việc thiếu thông tin. Một câu chuyện tốt thường dùng lại được cho ba câu hỏi khác nhau.',
      },
      {
        name: 'Nghiên cứu ba lớp về nơi tuyển',
        detail:
          'Lớp một là sản phẩm và khách hàng: họ bán gì, cho ai, thu tiền bằng cách nào. Lớp hai là bối cảnh: đối thủ, thay đổi gần đây, tin tức trong sáu tháng. Lớp ba là con người: ai sẽ phỏng vấn bạn, họ làm gì, vị trí của bạn báo cáo cho ai. Ba lớp cho ba loại câu hỏi ngược khác nhau.',
      },
      {
        name: 'Dự đoán mười câu hỏi',
        detail:
          'Rút mười câu hỏi có xác suất cao trực tiếp từ JD: mỗi yêu cầu quyết định sinh ra ít nhất một câu hỏi, mỗi khoảng trống trong hồ sơ của bạn sinh ra một câu, và mỗi chuyển việc trong CV sinh ra một câu. Danh sách này chính xác hơn nhiều so với danh sách câu hỏi phổ biến trên mạng.',
      },
      {
        name: 'Luyện nói thành tiếng, có bấm giờ',
        detail:
          'Nói to từng câu trả lời và bấm giờ để giữ trong khoảng hai phút. Tự ghi âm và nghe lại một lần là bài tập khó chịu nhưng hiệu quả nhất, vì nó phát hiện những chỗ bạn tưởng là rõ mà thực ra lan man.',
      },
      {
        name: 'Chuẩn bị hậu cần và phương án hỏng',
        detail:
          'Kiểm đường đi hoặc đường mạng, thiết bị, ánh sáng, âm thanh, bản CV in, sổ ghi. Chuẩn bị trước một câu xử lý khi có sự cố kỹ thuật hoặc khi bạn cần vài giây suy nghĩ. Phần này tưởng nhỏ nhưng là nguồn gây hoảng phổ biến trong mười phút đầu.',
      },
    ],
    scenario:
      'Linh có ba năm làm kiểm soát nội bộ, ứng tuyển vị trí Chuyên viên phân tích nghiệp vụ cho khối vận hành của một ngân hàng. Trong hai lần phỏng vấn trước ở nơi khác, bạn đều thấy mình trả lời lan man và quên mất những ví dụ tốt nhất, dù về nhà mới nhớ ra. Lần này bạn chuẩn bị khác. Bạn dựng kho mười ba câu chuyện, mỗi chuyện viết bốn dòng và một con số, trong đó có chuyện bạn phát hiện quy trình duyệt hạn mức đang bỏ sót một bước đối chiếu và mất năm tuần thuyết phục ba phòng ban chấp nhận thêm bước đó. Bạn đọc JD và rút ra mười câu hỏi khả năng cao, trong đó có ba câu bạn tự thấy sợ: vì sao chuyển từ kiểm soát sang phân tích nghiệp vụ, bạn xử lý thế nào khi bên nghiệp vụ không đồng ý với đề xuất, và bạn đã dùng công cụ phân tích dữ liệu nào ở mức nào. Bạn tra ba lớp về ngân hàng đó và phát hiện họ vừa triển khai một hệ thống lõi mới trong năm nay — điều này đổi hẳn cách bạn chuẩn bị, vì phần lớn công việc phân tích nghiệp vụ sắp tới nhiều khả năng xoay quanh chuyển đổi quy trình. Bạn luyện nói to sáu câu trả lời có bấm giờ và ghi âm hai lần; lần nghe lại đầu tiên bạn phát hiện mình mất bốn mươi giây kể bối cảnh trước khi tới hành động, nên bạn cắt bối cảnh xuống hai câu. Trong buổi phỏng vấn thật, sáu trong mười câu bạn dự đoán được hỏi gần đúng, và ở câu về hệ thống lõi mới bạn là ứng viên duy nhất chủ động nhắc tới nó. Bạn vẫn bị hỏi một câu hoàn toàn ngoài dự đoán về quản lý dữ liệu khách hàng, và bạn trả lời thẳng là chưa có kinh nghiệm trực tiếp, rồi nói về phần gần nhất mình từng làm.',
    comparison: [
      {
        weak: 'Học thuộc câu trả lời cho hai mươi câu hỏi phổ biến tìm trên mạng, rồi đọc lại như văn bản khi được hỏi.',
        mature:
          'Xây kho câu chuyện thật và luyện cách chọn nhanh câu chuyện phù hợp, nhờ đó câu trả lời vẫn tự nhiên khi câu hỏi được đặt theo cách khác.',
      },
      {
        weak: 'Nghiên cứu công ty bằng cách đọc lướt trang giới thiệu năm phút trước buổi gặp.',
        mature:
          'Tìm hiểu ba lớp — sản phẩm, bối cảnh, con người — và ghi ra ba điều bạn tin họ đang quan tâm nhất trong quý này, để dùng cả trong câu trả lời lẫn câu hỏi ngược.',
      },
      {
        weak: 'Luyện tập bằng cách đọc thầm trong đầu và thấy mọi thứ đều trôi chảy.',
        mature:
          'Nói to, bấm giờ và ghi âm ít nhất một lần, vì khoảng cách giữa suy nghĩ trôi chảy và lời nói mạch lạc chỉ lộ ra khi bạn nghe lại chính mình.',
      },
    ],
    mistakes: [
      'Chuẩn bị nội dung rất kỹ nhưng bỏ qua hoàn toàn phần hậu cần, rồi mất mười phút đầu để loay hoay với đường truyền, micro hoặc tìm chỗ đỗ xe. Mười phút đầu là lúc ấn tượng ban đầu hình thành, và trạng thái hoảng ở đó kéo dài suốt buổi.',
      'Cố tỏ ra biết mọi thứ nên trả lời vòng vo cho những câu mình không biết. Người phỏng vấn có kinh nghiệm nhận ra ngay, và họ thường đánh giá cao hơn câu trả lời thẳng thắn kèm cách bạn sẽ tìm hiểu, vì đó là điều bạn sẽ phải làm mỗi tuần khi vào việc.',
      'Chuẩn bị cho một buổi mà không hỏi trước cấu trúc quy trình tuyển. Vòng với nhân sự, vòng với quản lý trực tiếp và vòng với lãnh đạo cấp cao đánh giá ba thứ khác nhau; dùng chung một cách chuẩn bị cho cả ba là lãng phí và dễ nói lệch trọng tâm.',
    ],
    worksheet: [
      'Kho câu chuyện của bạn hiện có bao nhiêu tình huống thật, và chủ đề nào đang chưa có chuyện nào để kể — xung đột, thất bại, hay thuyết phục người khác?',
      'Đọc lại JD và viết ra mười câu hỏi bạn tin sẽ được hỏi. Ba câu nào làm bạn thấy khó chịu nhất khi nghĩ tới?',
      'Ba điều bạn biết về công ty này mà một ứng viên chỉ đọc lướt trang chủ sẽ không biết là gì?',
      'Bạn biết gì về những người sẽ phỏng vấn bạn — vai trò của họ, mối quan tâm của họ, và họ sẽ đánh giá bạn theo tiêu chí nào?',
      'Nếu được hỏi một câu hoàn toàn ngoài chuẩn bị, câu mở đầu nào bạn sẽ dùng để có thêm mười giây suy nghĩ mà không mất tự nhiên?',
    ],
    exercises: [
      {
        label: 'Kho mười hai câu chuyện',
        text: 'Viết mười hai tình huống thật, mỗi tình huống bốn dòng gồm bối cảnh, việc bạn làm, con số kết quả và bài học. Sau đó đánh dấu mỗi câu chuyện có thể dùng cho những loại câu hỏi nào để thấy chuyện nào đang gánh nhiều việc nhất.',
        level: 'e',
      },
      {
        label: 'Mười câu hỏi từ JD',
        text: 'Đọc JD và rút ra mười câu hỏi có xác suất cao: mỗi yêu cầu quyết định một câu, mỗi khoảng trống hồ sơ một câu, mỗi lần chuyển việc trong CV một câu. So danh sách này với danh sách câu hỏi chung trên mạng và ghi lại điểm khác nhau.',
        level: 'e',
      },
      {
        label: 'Ba lớp nghiên cứu',
        text: 'Dành bốn mươi phút tìm hiểu công ty theo ba lớp: sản phẩm và khách hàng, bối cảnh cạnh tranh và tin tức sáu tháng, con người sẽ phỏng vấn bạn. Kết thúc bằng ba câu tóm tắt điều bạn tin họ quan tâm nhất trong quý này.',
        level: 'e',
      },
      {
        label: 'Ghi âm và nghe lại',
        text: 'Chọn ba câu hỏi khó nhất, trả lời to có bấm giờ và ghi âm. Nghe lại và đếm ba thứ: giây bỏ ra cho phần bối cảnh, số lần dùng từ đệm, và thời điểm bạn bắt đầu lặp lại ý. Trả lời lại lần hai và so.',
        level: 'm',
      },
      {
        label: 'Phỏng vấn thử với người khác',
        text: 'Nhờ một người đóng vai người phỏng vấn trong ba mươi phút với danh sách mười câu bạn đã dự đoán, kèm yêu cầu họ hỏi đào sâu ít nhất hai lần cho mỗi câu trả lời. Xin phản hồi về ba điểm: độ rõ, độ tin, và chỗ họ thấy bạn né tránh.',
        level: 'm',
      },
      {
        label: 'Chuẩn bị theo từng vòng',
        text: 'Hỏi nhà tuyển dụng về cấu trúc quy trình, rồi viết một trang riêng cho từng vòng: vòng này ai gặp, họ đánh giá gì, bạn sẽ nhấn câu chuyện nào và hỏi ngược câu gì. Chuẩn bị khác nhau cho vòng nhân sự, vòng chuyên môn và vòng lãnh đạo.',
        level: 'm',
      },
      {
        label: 'Diễn tập điều kiện xấu',
        text: 'Tự dựng ba tình huống khó và luyện phản ứng: người phỏng vấn ngắt lời giữa chừng, một câu hỏi về điểm yếu lớn nhất trong hồ sơ, và một câu bạn hoàn toàn không biết. Viết trước câu mở đầu cho từng tình huống, luyện nói ba lần cho tới khi nghe bình thản.',
        level: 'h',
      },
      {
        label: 'Rút kinh nghiệm sau mỗi buổi',
        text: 'Sau mỗi buổi phỏng vấn thật, trong vòng hai giờ hãy viết lại toàn bộ câu hỏi được hỏi, câu trả lời của bạn, và ba chỗ bạn muốn sửa. Sau ba buổi, tổng hợp mẫu chung và cập nhật lại kho câu chuyện theo đó.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Nên chuẩn bị bao nhiêu câu chuyện, và vì sao không nên chuẩn bị theo từng câu hỏi?',
        a: 'Khoảng mười hai đến mười lăm câu chuyện là đủ cho phần lớn vòng phỏng vấn, vì các câu hỏi hành vi hội tụ về một số ít chủ đề và một câu chuyện tốt thường dùng lại được cho ba câu hỏi khác nhau. Chuẩn bị theo từng câu hỏi tạo ra hàng chục câu trả lời rời rạc, dễ quên và nghe như học thuộc; chuẩn bị theo kho câu chuyện cho bạn khả năng ghép linh hoạt khi câu hỏi được đặt theo cách bạn chưa gặp.',
      },
      {
        q: 'Bạn được hỏi một câu hoàn toàn không biết. Cách xử lý nào tốt nhất?',
        a: 'Nói thẳng phần bạn chưa có kinh nghiệm, rồi bắc cầu sang phần gần nhất bạn từng làm và cách bạn sẽ tiếp cận nếu gặp bài toán đó. Ba thành phần này biến một câu trả lời trống thành một mẫu tư duy quan sát được. Điều cần tránh là nói vòng vo để lấp thời gian, vì nó vừa không trả lời được câu hỏi vừa làm mất lòng tin ở những câu sau.',
      },
      {
        q: 'Luyện nói thành tiếng có thật sự khác luyện trong đầu không?',
        a: 'Khác rõ rệt, vì hai việc dùng cơ chế khác nhau. Nghĩ trong đầu diễn ra nhanh, bỏ qua các bước chuyển ý, và cho cảm giác trôi chảy sai lệch. Nói to buộc bạn thật sự sản xuất câu, và chính lúc đó mới lộ ra chỗ thiếu liên kết, chỗ lan man và chỗ bạn không có ví dụ cụ thể. Ghi âm nghe lại một lần thường tìm ra nhiều vấn đề hơn cả năm lần đọc thầm.',
      },
    ],
    plan7:
      'Ngày 1: viết kho mười hai câu chuyện, mỗi chuyện bốn dòng có số. Ngày 2: rút mười câu hỏi từ JD và đánh dấu ba câu khó nhất. Ngày 3: nghiên cứu ba lớp về công ty, viết ba câu tóm tắt mối quan tâm của họ. Ngày 4: luyện to có bấm giờ ba câu khó nhất, ghi âm và nghe lại. Ngày 5: phỏng vấn thử ba mươi phút với một người và xin phản hồi ba điểm. Ngày 6: chuẩn bị riêng cho từng vòng và soạn câu hỏi ngược. Ngày 7: kiểm hậu cần đầy đủ, diễn tập ba tình huống xấu, ngủ đủ.',
    evidence:
      'Kho câu chuyện chính là tài sản dùng được lâu hơn bất kỳ buổi phỏng vấn nào: nó là nguồn cho CV, cho hồ sơ đánh giá cuối năm, cho phần tự giới thiệu khi bắt đầu dự án mới, và cho các bài viết nghề nghiệp của bạn. Hãy giữ nó ở dạng tài liệu sống, thêm một mục mỗi khi hoàn thành việc gì đáng kể, và ghi kèm số liệu ngay lúc còn nhớ chứ không đợi tới lúc cần. Một hiện vật thứ hai đáng giữ là nhật ký rút kinh nghiệm sau mỗi buổi phỏng vấn: sau năm buổi, nó cho bạn dữ liệu thật về loại câu hỏi nào bạn hay hụt và loại câu chuyện nào luôn được hỏi đào sâu — thông tin này không thể lấy từ bất kỳ nguồn bên ngoài nào.',
    references: [
      { label: 'The Muse — chuyên mục lời khuyên nghề nghiệp và phỏng vấn', url: 'https://www.themuse.com/advice', type: 'article' },
      { label: 'Google re:Work — tài nguyên về tuyển dụng có cấu trúc', url: 'https://rework.withgoogle.com/', type: 'article' },
    ],
  }),
  // ── Chương 9 · Trả lời phỏng vấn hành vi ──────────────────────────────────
  guide({
    thesis:
      'Phỏng vấn hành vi dựa trên một giả định đơn giản: cách bạn đã hành xử trong quá khứ dự báo cách bạn sẽ hành xử sắp tới, tốt hơn là lời bạn tuyên bố về bản thân. Vì vậy câu trả lời phải là một sự việc có thật, xảy ra vào một thời điểm cụ thể, với những người cụ thể — chứ không phải một mô tả về thói quen chung của bạn. Khi được hỏi "kể một lần bạn phải xử lý mâu thuẫn", câu "em thường lắng nghe cả hai bên rồi tìm điểm chung" là câu trả lời sai thể loại: nó đúng ngữ pháp nhưng không chứa bằng chứng nào. Kỹ năng ở đây là kể một câu chuyện có cấu trúc trong hai phút, trong đó phần lớn thời gian dành cho hành động của chính bạn, không phải của nhóm.',
    why: {
      work:
        'Khả năng kể lại một việc đã làm theo cấu trúc rõ ràng cũng chính là khả năng viết báo cáo tốt, trình bày trong họp gọn gàng và bàn giao công việc mà người nhận hiểu ngay.',
      interview:
        'Đây là loại câu hỏi chiếm phần lớn thời lượng ở hầu hết vòng phỏng vấn, kể cả với vị trí kỹ thuật. Trượt ở đây thường không do thiếu trải nghiệm mà do kể lan man, để bối cảnh ăn hết thời gian và không nói rõ mình đã làm gì.',
      study:
        'Cấu trúc này ép bạn phản tư có kỷ luật: một trải nghiệm chỉ thành bài học khi bạn tách được bối cảnh, quyết định của mình và kết quả — nếu không, nó chỉ là một kỷ niệm.',
      life:
        'Cùng cấu trúc dùng được khi bạn cần thuyết phục ai đó rằng mình xử lý được một việc: xin chuyển ban, ứng cử vào một vai trò cộng đồng, hoặc giải thích với gia đình về một quyết định lớn bạn đã làm.',
    },
    framework: [
      {
        name: 'Bối cảnh trong hai câu',
        detail:
          'Chỉ nêu đủ để người nghe hiểu tình huống: bạn ở vai gì, tổ chức quy mô nào, vấn đề là gì. Đây là phần ngốn thời gian nhiều nhất ở người thiếu luyện tập; giới hạn cứng hai câu buộc bạn đi thẳng vào phần đáng nghe.',
      },
      {
        name: 'Nhiệm vụ và ràng buộc',
        detail:
          'Nói rõ trách nhiệm cụ thể của riêng bạn và các ràng buộc thật: thời hạn, nguồn lực, người phản đối, thông tin thiếu. Không có ràng buộc thì câu chuyện không có sức nặng, vì việc gì dễ cũng làm được.',
      },
      {
        name: 'Hành động của chính bạn',
        detail:
          'Phần dài nhất, chiếm khoảng một nửa thời lượng, và chủ ngữ phải là "tôi" chứ không phải "chúng tôi". Kể theo trình tự các bước bạn quyết định, kèm lý do chọn, để người nghe thấy được cách bạn nghĩ chứ không chỉ việc bạn làm.',
      },
      {
        name: 'Kết quả có số',
        detail:
          'Nêu kết quả đo được và cả phần không đạt nếu có. Nếu không có số tuyệt đối, dùng mức thay đổi, quy mô, hoặc phản hồi cụ thể từ người liên quan. Kết quả mơ hồ kiểu "mọi việc tốt đẹp hơn" xóa sạch giá trị của ba phần trước.',
      },
      {
        name: 'Bài học và ứng dụng lại',
        detail:
          'Kết bằng một câu về điều bạn làm khác đi từ đó, và nếu hợp lý thì nối sang bối cảnh của công ty đang phỏng vấn. Đây là phần phân biệt người có phản tư với người chỉ trải qua sự việc.',
      },
    ],
    scenario:
      'Ngọc quản lý một cửa hàng trong chuỗi bán lẻ thời trang được bốn năm, nay ứng tuyển vị trí quản lý khu vực phụ trách sáu cửa hàng. Ở câu hỏi "kể một lần chị phải xử lý xung đột trong nhóm", lần trả lời đầu tiên khi luyện tập của bạn kéo dài ba phút rưỡi, trong đó hai phút đầu là mô tả cơ cấu ca làm việc của cửa hàng. Bạn viết lại theo cấu trúc. Bối cảnh hai câu: cửa hàng có mười bốn nhân viên bán hàng chia ba ca, và hai nhân viên kỳ cựu nhất từ chối làm chung ca sau một mâu thuẫn về việc chia doanh số của một đơn hàng lớn. Nhiệm vụ và ràng buộc: bạn phải giữ đủ người cho ca cuối tuần cao điểm, không được tăng chi phí nhân sự, và cả hai đều là người bán tốt nhất nên không thể mất ai. Hành động, kể bằng "tôi": bạn gặp riêng từng người trước, hỏi cùng một câu là họ cho rằng cách chia doanh số nên như thế nào và vì sao; bạn phát hiện gốc rễ không phải cá nhân mà là quy tắc chia doanh số cho đơn hàng có nhiều người tham gia vốn chưa từng được viết ra; bạn soạn một quy tắc ba dòng, đưa cả hai cùng góp ý và sửa hai điểm theo đề nghị của họ; bạn công bố quy tắc cho cả cửa hàng và áp dụng cho cả những đơn cũ trong tháng đó; bạn xếp hai người vào cùng ca đầu tiên và trực tiếp có mặt ca đó. Kết quả: cả hai làm chung ca trở lại trong vòng hai tuần, không ai nghỉ việc, và quy tắc chia doanh số sau đó được hai cửa hàng khác trong chuỗi xin dùng lại. Bài học: bạn nhận ra phần lớn mâu thuẫn mà bạn từng coi là chuyện tính cách thực chất là chỗ trống trong quy tắc, và từ đó mỗi khi có xung đột bạn hỏi trước "quy tắc nào đang thiếu" rồi mới hỏi "ai đúng". Câu trả lời rút xuống còn hai phút mười giây.',
    comparison: [
      {
        weak: 'Trả lời bằng thói quen chung: "em luôn cố gắng lắng nghe và giữ hòa khí trong nhóm".',
        mature:
          'Trả lời bằng một sự việc có mốc thời gian, có tên vai trò cụ thể, có ràng buộc và có kết quả kiểm chứng được.',
      },
      {
        weak: 'Dùng "chúng tôi" suốt phần hành động, khiến người nghe không biết bạn đã làm gì và nhóm đã làm gì.',
        mature:
          'Ghi nhận công của nhóm ở một câu, còn phần hành động dùng "tôi" và nêu rõ quyết định nào là của bạn, kể cả quyết định sai.',
      },
      {
        weak: 'Chọn câu chuyện hoành tráng nhất bất kể có liên quan tới vị trí đang ứng tuyển hay không.',
        mature:
          'Chọn câu chuyện có bối cảnh gần nhất với công việc sắp làm, kể cả khi quy mô nhỏ hơn, vì mức độ liên quan thuyết phục hơn mức độ ấn tượng.',
      },
    ],
    mistakes: [
      'Kể chuyện thất bại mà đổ hết lỗi cho hoàn cảnh hoặc người khác. Câu hỏi về thất bại đo khả năng tự nhận trách nhiệm; câu trả lời không có phần nào bạn nhận lỗi sẽ bị đánh giá thấp hơn cả một thất bại lớn được kể trung thực.',
      'Nộp một câu chuyện đã được đánh bóng đến mức không còn ràng buộc nào: mọi thứ diễn ra suôn sẻ, ai cũng đồng ý, kết quả vượt mong đợi. Người phỏng vấn có kinh nghiệm sẽ đào sâu đúng vào chỗ đó và câu chuyện sụp.',
      'Chuẩn bị đúng một câu chuyện tủ rồi cố nhét nó vào mọi câu hỏi. Sự gượng ép lộ ra rất nhanh, và nó phát tín hiệu rằng bạn chỉ có một trải nghiệm đáng kể trong toàn bộ sự nghiệp.',
    ],
    worksheet: [
      'Chọn một câu chuyện của bạn và bấm giờ khi kể to. Bao nhiêu giây rơi vào phần bối cảnh, và bao nhiêu giây rơi vào phần hành động của chính bạn?',
      'Trong câu chuyện đó, ràng buộc thật là gì? Nếu bỏ ràng buộc đi thì việc bạn làm có còn đáng kể không?',
      'Đếm số lần bạn nói "chúng tôi" trong phần hành động. Có bao nhiêu quyết định trong đó thật sự là của riêng bạn?',
      'Kết quả bạn nêu có con số hoặc mức thay đổi nào không? Nếu không có, đại lượng nào khác có thể dùng thay?',
      'Nếu người phỏng vấn hỏi tiếp "nếu làm lại chị sẽ làm gì khác", bạn trả lời thế nào mà không phủ nhận toàn bộ việc mình đã làm?',
    ],
    exercises: [
      {
        label: 'Bối cảnh trong hai câu',
        text: 'Lấy ba câu chuyện trong kho của bạn và viết lại phần bối cảnh xuống đúng hai câu cho mỗi chuyện. Đọc to và kiểm xem người nghe có đủ thông tin để hiểu phần sau không, nếu thiếu thì thêm một mệnh đề chứ không thêm một câu.',
        level: 'e',
      },
      {
        label: 'Đổi chúng tôi thành tôi',
        text: 'Viết ra phần hành động của một câu chuyện, sau đó gạch dưới mọi từ "chúng tôi" và viết lại từng câu bằng chủ ngữ "tôi" kèm quyết định cụ thể. Nếu có câu không viết lại được, đó là phần bạn không thực sự tham gia và nên bỏ khỏi câu chuyện.',
        level: 'e',
      },
      {
        label: 'Săn ràng buộc',
        text: 'Với năm câu chuyện, viết ra ràng buộc thật của từng chuyện: thời hạn, ngân sách, người phản đối, thông tin thiếu, hoặc quyền hạn không có. Đánh dấu chuyện nào không có ràng buộc nào — đó là chuyện yếu, cần thay bằng chuyện khác.',
        level: 'e',
      },
      {
        label: 'Ma trận chuyện và chủ đề',
        text: 'Lập bảng với các cột là tám chủ đề hay được hỏi (thất bại, xung đột, thuyết phục, deadline, học nhanh, dẫn dắt, thiếu thông tin, sai lầm) và các hàng là câu chuyện của bạn. Đánh dấu ô dùng được và tìm cột nào đang trống hoàn toàn để bổ sung chuyện mới.',
        level: 'm',
      },
      {
        label: 'Câu chuyện thất bại trung thực',
        text: 'Viết một câu chuyện về việc bạn làm hỏng, trong đó có ít nhất hai câu nhận trách nhiệm cụ thể và một câu về thay đổi bạn đã thực hiện sau đó. Kể cho một người nghe và hỏi họ có thấy bạn đang né tránh chỗ nào không.',
        level: 'm',
      },
      {
        label: 'Chịu ba lớp đào sâu',
        text: 'Nhờ một người hỏi bạn một câu hành vi, rồi hỏi tiếp ba lần "cụ thể chị đã làm gì ở bước đó" và "nếu người kia không đồng ý thì sao". Ghi lại lớp nào bạn bắt đầu bí, vì đó là chỗ câu chuyện của bạn còn mỏng.',
        level: 'm',
      },
      {
        label: 'Bộ mười hai chuyện đã bấm giờ',
        text: 'Hoàn thiện mười hai câu chuyện, mỗi chuyện kể to trong khoảng hai phút, ghi âm toàn bộ và nghe lại. Với mỗi chuyện, ghi ba điểm cần sửa và luyện lại lần hai, so thời lượng và độ rõ giữa hai lần.',
        level: 'h',
      },
      {
        label: 'Đối chiếu với tiêu chí của vị trí',
        text: 'Lấy JD của vị trí bạn nhắm, rút ra năm năng lực họ đánh giá, và với mỗi năng lực chọn một câu chuyện tốt nhất trong kho. Nếu có năng lực nào không có chuyện tương xứng, lập kế hoạch trong ba tháng để tạo ra trải nghiệm đó ở công việc hiện tại.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao câu trả lời "em luôn xử lý mâu thuẫn bằng cách nói chuyện thẳng thắn" không được tính điểm?',
        a: 'Vì nó mô tả một chính sách chứ không phải một sự việc, nên không kiểm chứng được và ai cũng nói được. Phỏng vấn hành vi tìm bằng chứng ở dạng sự kiện có mốc thời gian, người thật, ràng buộc thật và kết quả quan sát được. Cách sửa là chuyển ngay sang một lần cụ thể: khi nào, với ai, ràng buộc là gì, bạn đã làm những bước nào, kết quả ra sao.',
      },
      {
        q: 'Bạn mới ra trường và chưa có tình huống công việc nào để kể. Lấy chất liệu ở đâu?',
        a: 'Từ mọi bối cảnh có ràng buộc thật và có người khác tham gia: đồ án nhóm mà một thành viên bỏ giữa chừng, công việc bán thời gian gặp khách hàng khó, hoạt động tổ chức sự kiện thiếu ngân sách, kỳ thực tập phải học công cụ mới trong một tuần. Điều quan trọng không phải quy mô mà là bạn nêu được ràng buộc, hành động của riêng bạn và kết quả — ba yếu tố đó tồn tại kể cả trong tình huống nhỏ.',
      },
      {
        q: 'Câu chuyện của bạn có kết quả không tốt. Có nên kể không?',
        a: 'Nên, nếu bạn kể trung thực và có phần rút kinh nghiệm rõ ràng. Người phỏng vấn hiểu rằng không phải dự án nào cũng thành công, và họ đang quan sát ba thứ: bạn có nhận ra vấn đề đủ sớm không, bạn có nhận phần trách nhiệm của mình không, và bạn có thay đổi cách làm sau đó không. Câu chuyện thất bại được kể tốt thường tạo lòng tin cao hơn một chuỗi thành công không tì vết.',
      },
    ],
    plan7:
      'Ngày 1: chọn ba câu chuyện và cắt phần bối cảnh xuống hai câu. Ngày 2: viết lại phần hành động bằng chủ ngữ "tôi" và gạch bỏ phần bạn không trực tiếp làm. Ngày 3: tìm ràng buộc thật cho năm câu chuyện, loại chuyện không có ràng buộc. Ngày 4: gắn số hoặc mức thay đổi cho phần kết quả của từng chuyện. Ngày 5: lập ma trận chuyện và chủ đề, tìm cột trống. Ngày 6: viết một câu chuyện thất bại trung thực và nhờ người nghe phản biện. Ngày 7: ghi âm kể to sáu chuyện có bấm giờ, nghe lại và ghi ba điểm sửa cho mỗi chuyện.',
    evidence:
      'Hiện vật ở đây là bộ mười hai câu chuyện đã được viết ra và bấm giờ, kèm ma trận đối chiếu với các năng lực trong JD. Giá trị của nó vượt ra ngoài phỏng vấn: chính bộ này là nguyên liệu cho phần tự đánh giá cuối năm, cho hồ sơ đề nghị thăng chức, và cho việc kèm người mới — vì khi bạn kể được câu chuyện có cấu trúc, người nghe học được cách bạn ra quyết định chứ không chỉ nghe kết luận. Ma trận đối chiếu còn có một tác dụng ít người dùng: nó cho biết năng lực nào bạn chưa có trải nghiệm nào, và đó là danh sách việc cần chủ động nhận trong sáu tháng tới ở chính công việc hiện tại.',
    references: [
      { label: 'Indeed Career Guide — hướng dẫn nghề nghiệp và phỏng vấn', url: 'https://www.indeed.com/career-advice', type: 'article', needsReview: true },
      { label: 'Harvard Business Review — chuyên mục Hiring and recruitment', url: 'https://hbr.org/topic/subject/hiring-and-recruitment', type: 'article' },
    ],
  }),

  // ── Chương 10 · Phỏng vấn chuyên môn ──────────────────────────────────────
  guide({
    thesis:
      'Phỏng vấn chuyên môn không đo lượng kiến thức bạn nhớ, mà đo độ sâu của mô hình nghề trong đầu bạn: bạn có phân biệt được nguyên tắc với thói quen, có biết vì sao quy định lại được đặt ra như vậy, và có nhận ra khi nào một cách làm chuẩn không còn phù hợp hay không. Dấu hiệu nhận biết rất rõ: người có kiến thức bề mặt trả lời trôi chảy câu hỏi "cái này là gì", nhưng bối rối ở câu "vì sao lại làm như vậy" và sụp ở câu "trong trường hợp nào thì không nên làm thế". Chuẩn bị cho vòng này vì thế không phải học lại giáo trình mà là tự chất vấn những thứ mình đang làm hằng ngày.',
    why: {
      work:
        'Người có mô hình nghề sâu xử lý được các tình huống chưa từng gặp, còn người thuộc quy trình chỉ xử lý được tình huống đã có mẫu — và phần lớn giá trị của một chuyên viên nằm ở nhóm tình huống thứ hai.',
      interview:
        'Đây là vòng phân loại thật, vì hai ứng viên có CV giống hệt sẽ tách nhau ngay ở ba câu hỏi đào sâu. Nó cũng là vòng bạn kiểm soát được nhiều nhất, vì nội dung nằm trong đúng lĩnh vực bạn làm mỗi ngày.',
      study:
        'Chuẩn bị cho vòng chuyên môn là dịp hiếm hoi bạn hệ thống lại kiến thức nghề theo trục nguyên nhân thay vì theo trục thời gian đã học, và thường phát hiện những chỗ mình vẫn làm đúng mà không hiểu vì sao.',
      life:
        'Thói quen hỏi "vì sao quy định này tồn tại" và "khi nào nó không còn đúng" là công cụ tự bảo vệ khi bạn phải ra quyết định trong lĩnh vực mình không chuyên: chọn bảo hiểm, đọc hợp đồng, hay nghe tư vấn.',
    },
    framework: [
      {
        name: 'Vẽ bản đồ lĩnh vực',
        detail:
          'Chia chuyên môn của bạn thành sáu đến tám mảng lớn, và với mỗi mảng ghi ba mức: điều bạn làm thành thạo, điều bạn biết nhưng chưa làm, điều bạn chỉ nghe tên. Bản đồ này cho biết bạn nên ôn chỗ nào và nên thừa nhận chỗ nào.',
      },
      {
        name: 'Đào ba lớp cho mỗi chủ đề',
        detail:
          'Với mỗi mảng, tự trả lời ba câu: nó là gì, vì sao lại làm như vậy, và trong trường hợp nào thì cách làm đó sai. Lớp thứ ba là lớp phân biệt người có kinh nghiệm thật, và cũng là lớp mà tài liệu hiếm khi dạy.',
      },
      {
        name: 'Chuẩn bị ví dụ cho mỗi nguyên tắc',
        detail:
          'Mỗi nguyên tắc bạn nêu cần một lần bạn đã áp dụng nó trong việc thật, kèm chi tiết đủ để chứng minh bạn không đọc ở đâu đó. Nguyên tắc không có ví dụ nghe như trích dẫn; nguyên tắc kèm ví dụ nghe như kinh nghiệm.',
      },
      {
        name: 'Luyện suy nghĩ thành tiếng',
        detail:
          'Với câu hỏi tình huống, hãy nói ra cách bạn phân tích trước khi đưa kết luận: giả định đang dùng, dữ liệu còn thiếu, các phương án, tiêu chí chọn. Người phỏng vấn chấm quá trình nhiều hơn đáp án, đặc biệt khi câu hỏi cố tình mơ hồ.',
      },
      {
        name: 'Vạch rõ ranh giới hiểu biết',
        detail:
          'Chuẩn bị sẵn cách nói cho phần bạn không biết: nói thẳng chưa có kinh nghiệm ở mảng đó, nêu phần gần nhất bạn từng làm, và mô tả cách bạn sẽ tìm hiểu. Cách này giữ được uy tín cho toàn bộ những gì bạn khẳng định là biết.',
      },
    ],
    scenario:
      'Hà làm kiểm toán nội bộ ba năm ở một doanh nghiệp chế biến thực phẩm, ứng tuyển vị trí tương đương ở một công ty lớn hơn trong cùng ngành. Vòng chuyên môn do trưởng phòng kiểm toán nội bộ trực tiếp hỏi. Câu đầu tiên là câu quen thuộc về ba tuyến phòng vệ, và bạn trả lời trôi chảy. Câu thứ hai đổi nhịp: nếu bộ phận sản xuất nói rằng thủ tục kiểm kê định kỳ làm gián đoạn dây chuyền và đề nghị giảm tần suất, bạn phản ứng thế nào. Bạn không trả lời ngay là được hay không được, mà nói ra cách mình phân tích: trước hết cần biết thủ tục đó đang giảm rủi ro nào, có bằng chứng gì cho thấy rủi ro đó còn cao, và có chốt kiểm soát nào khác đang phủ cùng rủi ro không; nếu có chốt bù đắp đủ mạnh thì giảm tần suất là hợp lý, còn nếu không thì phải tìm cách đổi hình thức kiểm kê thay vì đổi tần suất. Bạn kể luôn một lần thật: ở công ty cũ bạn đã thay việc kiểm kê toàn bộ kho bao bì hằng tháng bằng kiểm kê theo mẫu ngẫu nhiên có trọng số theo giá trị, giữ nguyên khả năng phát hiện sai lệch lớn mà giảm được thời gian dừng kho. Câu thứ ba là câu bạn không biết: về áp dụng phân tích dữ liệu liên tục trên hệ thống hoạch định nguồn lực doanh nghiệp. Bạn nói thẳng chưa từng triển khai, mô tả phần gần nhất mình đã làm là dùng bảng tính để đối chiếu toàn bộ giao dịch mua hàng trong quý thay vì chọn mẫu, và nêu cách bạn sẽ học nếu vào làm. Sau buổi, người phỏng vấn nói lại với bộ phận nhân sự rằng điều thuyết phục họ là câu trả lời thứ hai, không phải câu thứ nhất.',
    comparison: [
      {
        weak: 'Trả lời bằng định nghĩa thuộc lòng, dừng lại ngay khi đã nêu đúng khái niệm.',
        mature:
          'Nêu khái niệm ngắn gọn rồi đi tiếp tới lý do nó tồn tại và giới hạn của nó, vì đó mới là phần cho thấy bạn đã dùng nó trong thực tế.',
      },
      {
        weak: 'Nhận mọi câu hỏi tình huống bằng một đáp án dứt khoát, không nêu giả định nào.',
        mature:
          'Hỏi lại một đến hai câu để làm rõ, nêu giả định đang dùng, rồi đưa phương án kèm điều kiện — cách này đúng với thực tế công việc hơn nhiều.',
      },
      {
        weak: 'Cố kéo mọi câu hỏi về đúng phần mình mạnh, khiến người phỏng vấn không đo được các mảng còn lại.',
        mature:
          'Trả lời đúng phạm vi được hỏi, thừa nhận rõ phần chưa có kinh nghiệm, và chỉ chủ động dẫn sang thế mạnh khi nó thật sự liên quan.',
      },
    ],
    mistakes: [
      'Dùng thuật ngữ nghề nhiều hơn mức cần thiết để tỏ ra am hiểu, dẫn tới việc mất điểm khi người phỏng vấn hỏi lại đúng thuật ngữ đó ở mức sâu hơn. Thuật ngữ nên dùng khi nó rút ngắn câu, không nên dùng để trang trí.',
      'Chỉ ôn phần lý thuyết mà không rà lại chính công việc mình đã làm, nên khi được hỏi "chị đã xử lý ca đó như thế nào" thì không nhớ nổi chi tiết. Nguồn tốt nhất cho vòng chuyên môn là hồ sơ công việc của chính bạn trong hai năm gần nhất.',
      'Coi mọi câu hỏi đều có một đáp án đúng duy nhất, nên khi người phỏng vấn phản biện thì lập tức đổi ý theo họ. Đổi ý khi có lập luận mới là tốt, nhưng đổi ý ngay khi bị phản đối phát tín hiệu rằng bạn không thật sự tin vào phân tích của mình.',
    ],
    worksheet: [
      'Chia chuyên môn của bạn thành sáu mảng và tự chấm ba mức cho từng mảng: làm thành thạo, biết mà chưa làm, chỉ nghe tên. Mảng nào bạn ghi là thành thạo nhưng chỉ dựa vào một dự án duy nhất?',
      'Chọn một quy trình bạn làm hằng tuần và trả lời: vì sao nó được thiết kế như vậy? Bạn có biết câu trả lời thật hay đang đoán?',
      'Với chính quy trình đó, trong trường hợp nào thì làm theo nó là sai? Bạn đã từng gặp trường hợp đó chưa?',
      'Ba nguyên tắc nghề bạn hay nói tới là gì, và mỗi nguyên tắc có một ví dụ thật của bạn để chứng minh không?',
      'Mảng nào trong lĩnh vực của bạn mà nếu bị hỏi sâu hai lớp là bạn hết vốn? Bạn sẽ nói câu gì để thừa nhận điều đó một cách chuyên nghiệp?',
    ],
    exercises: [
      {
        label: 'Bản đồ sáu mảng',
        text: 'Vẽ bản đồ lĩnh vực của bạn thành sáu đến tám mảng và tự chấm ba mức cho từng mảng. Khoanh hai mảng có khoảng cách lớn nhất giữa mức bạn tự đánh giá và bằng chứng thật bạn có.',
        level: 'e',
      },
      {
        label: 'Ba lớp cho một chủ đề',
        text: 'Chọn một chủ đề trong nghề và tự viết câu trả lời cho ba lớp: nó là gì, vì sao làm như vậy, khi nào thì không nên làm thế. Đánh dấu lớp nào bạn viết được ngắn nhất, đó là chỗ hiểu biết còn mỏng.',
        level: 'e',
      },
      {
        label: 'Nguyên tắc kèm ví dụ',
        text: 'Liệt kê năm nguyên tắc nghề bạn tin là quan trọng, và với mỗi nguyên tắc viết một lần bạn đã áp dụng nó trong việc thật kèm kết quả. Nguyên tắc nào không tìm được ví dụ thì hãy tạm bỏ khỏi danh sách bạn sẽ nói khi phỏng vấn.',
        level: 'e',
      },
      {
        label: 'Rà lại hồ sơ hai năm',
        text: 'Mở lại các báo cáo, biên bản và hồ sơ công việc của bạn trong hai năm gần nhất, chọn ra sáu ca đáng nhớ và viết lại mỗi ca năm dòng: tình huống, cách phân tích, quyết định, kết quả, và điều sẽ làm khác. Đây là kho ví dụ đáng tin nhất của bạn.',
        level: 'm',
      },
      {
        label: 'Suy nghĩ thành tiếng',
        text: 'Nhờ một người trong nghề đưa cho bạn ba tình huống mở và trả lời to, nói rõ giả định, dữ liệu thiếu, các phương án và tiêu chí chọn trước khi kết luận. Ghi âm và nghe lại xem có chỗ nào bạn nhảy thẳng tới kết luận mà bỏ qua phần lập luận.',
        level: 'm',
      },
      {
        label: 'Chịu phản biện hai vòng',
        text: 'Với mỗi câu trả lời của bạn, nhờ người hỏi phản biện hai lần liên tiếp bằng lập luận ngược. Luyện phân biệt hai phản ứng: giữ quan điểm và giải thích thêm khi phản biện không có dữ liệu mới, hoặc thay đổi kết luận khi phản biện đưa ra thông tin bạn chưa tính tới.',
        level: 'm',
      },
      {
        label: 'Tự dựng đề thi cho chính mình',
        text: 'Viết hai mươi câu hỏi chuyên môn mà bạn sẽ dùng nếu bạn là người tuyển cho vị trí này, phủ đủ sáu mảng của bản đồ. Tự trả lời tất cả bằng cách viết, sau đó nhờ một người trong nghề chấm và chỉ ra ba chỗ bạn trả lời hời hợt.',
        level: 'h',
      },
      {
        label: 'Giải thích cho người ngoài ngành',
        text: 'Chọn ba khái niệm khó nhất trong lĩnh vực của bạn và giải thích mỗi khái niệm cho một người hoàn toàn ngoài ngành trong ba phút, không dùng thuật ngữ. Chỗ bạn buộc phải dùng thuật ngữ để lấp là chỗ bạn chưa hiểu tới gốc.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao câu hỏi "trong trường hợp nào thì không nên làm như vậy" lại phân loại được ứng viên tốt?',
        a: 'Vì nó đòi hỏi bạn phải biết giới hạn của phương pháp, mà giới hạn chỉ được học qua va chạm thật hoặc qua việc chủ động chất vấn cách làm quen thuộc. Người học từ tài liệu nắm được phần "làm thế nào", còn phần "khi nào không áp dụng" hầu như không nằm trong tài liệu — nó nằm trong những lần một cách làm chuẩn cho ra kết quả sai và ai đó phải tìm hiểu vì sao.',
      },
      {
        q: 'Người phỏng vấn phản biện lại câu trả lời của bạn. Nên giữ quan điểm hay nhận sai?',
        a: 'Tùy vào việc phản biện có mang thông tin mới hay không. Nếu họ nêu một dữ kiện hoặc ràng buộc bạn chưa tính tới, hãy nói rõ điều đó thay đổi phân tích của bạn ra sao rồi điều chỉnh kết luận — đó là hành vi đáng tin. Nếu họ chỉ nêu quan điểm ngược mà không thêm dữ liệu, hãy giữ lập luận và giải thích cơ sở của mình, đồng thời nêu điều kiện nào sẽ khiến bạn đổi ý. Nhiều người phỏng vấn phản biện chính là để kiểm bạn có chịu áp lực mà bỏ lập luận hay không.',
      },
      {
        q: 'Bạn nên ôn từ nguồn nào cho vòng chuyên môn?',
        a: 'Theo thứ tự ưu tiên: hồ sơ công việc của chính bạn trong hai năm gần nhất, vì đó là nơi có ví dụ thật; sau đó là các chuẩn mực, quy định hoặc tài liệu tham chiếu chính thức của ngành để chắc phần nguyên tắc; cuối cùng mới tới sách và khóa học tổng quát. Nhiều người làm ngược thứ tự này và kết quả là trả lời được lý thuyết nhưng không có ví dụ, đúng chỗ mà người phỏng vấn quan tâm nhất.',
      },
    ],
    plan7:
      'Ngày 1: vẽ bản đồ sáu mảng chuyên môn và tự chấm ba mức. Ngày 2: chọn hai mảng yếu nhất và đào ba lớp cho từng mảng. Ngày 3: rà lại hồ sơ công việc hai năm, chọn sáu ca và viết mỗi ca năm dòng. Ngày 4: liệt kê năm nguyên tắc nghề và gắn ví dụ thật cho từng nguyên tắc. Ngày 5: luyện suy nghĩ thành tiếng với ba tình huống mở, ghi âm và nghe lại. Ngày 6: nhờ một người trong nghề phản biện hai vòng cho ba câu trả lời. Ngày 7: tự dựng hai mươi câu hỏi như người tuyển và trả lời bằng cách viết.',
    evidence:
      'Hiện vật thuyết phục nhất của chương này là tập hồ sơ ca công việc: sáu đến mười ca thật bạn đã xử lý, mỗi ca một trang gồm tình huống, phân tích, quyết định, kết quả và điều sẽ làm khác, đã được ẩn danh dữ liệu nhạy cảm. Trong vòng chuyên môn, khi được hỏi về một tình huống, bạn không cần cố nhớ mà rút ra đúng ca gần nhất và kể có cấu trúc. Bộ hồ sơ này cũng là tài liệu bạn dùng để kèm người mới và để chứng minh chiều sâu khi đề nghị nâng bậc. Một dạng bằng chứng bổ sung có sức nặng riêng: tài liệu hướng dẫn hoặc bản kiểm tra bạn tự viết cho nghiệp vụ mình phụ trách, vì chỉ người hiểu tới gốc mới viết được thứ mà người khác dùng lại được.',
    references: [
      { label: 'The Institute of Internal Auditors — chuẩn mực và tài nguyên nghề kiểm toán nội bộ', url: 'https://www.theiia.org/', type: 'article', needsReview: true },
      { label: 'Farnam Street — mô hình tư duy và cách xây dựng hiểu biết theo chiều sâu', url: 'https://fs.blog/mental-models/', type: 'article' },
    ],
  }),

  // ── Chương 11 · Phỏng vấn lập trình ───────────────────────────────────────
  guide({
    thesis:
      'Phỏng vấn lập trình đo bốn thứ cùng lúc, và ứng viên thường chỉ luyện thứ nhất: khả năng tìm ra thuật toán đúng, khả năng viết mã chạy được dưới áp lực, khả năng nói ra suy nghĩ để người khác theo kịp, và khả năng tự kiểm tra để phát hiện lỗi trước khi bị chỉ ra. Một lời giải tối ưu được viết trong im lặng rồi có lỗi biên thường thua một lời giải chậm hơn được trình bày rõ ràng, kiểm thử tử tế và cải tiến dần. Vì vậy luyện tập đúng cách không phải giải càng nhiều bài càng tốt, mà là giải ít bài hơn nhưng mỗi bài đều nói to, viết mã hoàn chỉnh và tự kiểm bằng ví dụ.',
    why: {
      work:
        'Ba trong bốn năng lực trên chính là công việc hằng ngày: diễn đạt hướng giải cho đồng đội, viết mã chạy được, và tự kiểm trước khi gửi review. Chỉ riêng phần thuật toán khó là ít gặp hơn trong đa số công việc thực tế.',
      interview:
        'Đây là vòng loại của phần lớn quy trình tuyển kỹ sư phần mềm, và nó cũng là vòng công bằng nhất theo nghĩa kết quả phụ thuộc nhiều vào luyện tập có phương pháp hơn là vào quan hệ hay may mắn.',
      study:
        'Luyện thuật toán và cấu trúc dữ liệu theo lối chủ động — tự giải trước khi xem đáp án, giải lại sau ba ngày — là ví dụ điển hình của truy hồi chủ động và lặp lại ngắt quãng, hai kỹ thuật học tập có hiệu quả cao.',
      life:
        'Thói quen làm rõ đề bài trước khi bắt tay, nêu giả định thành lời, và kiểm lại kết quả bằng ví dụ ngược là thói quen tư duy dùng được cho mọi bài toán có ràng buộc, không riêng lập trình.',
    },
    framework: [
      {
        name: 'Làm rõ đề trước khi gõ',
        detail:
          'Hỏi về miền giá trị đầu vào, kích thước dữ liệu, dữ liệu có sắp xếp không, có trùng lặp không, có rỗng không, và kết quả mong đợi cho các trường hợp biên. Hai phút hỏi ở đây thường tiết kiệm mười phút viết lại sau.',
      },
      {
        name: 'Chạy tay một ví dụ nhỏ',
        detail:
          'Tự tạo một ví dụ vừa đủ nhỏ để chạy bằng tay và một ví dụ biên, rồi giải bằng tay trước. Bước này vừa giúp bạn hiểu bài, vừa cho người phỏng vấn thấy bạn không đoán mò, và thường tự nó gợi ra hướng giải.',
      },
      {
        name: 'Nêu hướng giải thô rồi cải tiến',
        detail:
          'Nói ra cách giải đơn giản nhất kèm độ phức tạp của nó, rồi chỉ ra chỗ lãng phí và đề xuất cải tiến. Trình tự này cho người phỏng vấn thấy cả quá trình, và bạn luôn có một lời giải chạy được trong tay nếu hết giờ.',
      },
      {
        name: 'Viết mã có cấu trúc, vừa viết vừa nói',
        detail:
          'Đặt tên biến rõ, tách hàm phụ khi cần, và nói ngắn gọn bạn đang làm gì ở mỗi khối. Im lặng năm phút liền khiến người phỏng vấn không biết bạn đang tiến hay đang bế tắc, và họ không thể giúp bạn đúng lúc.',
      },
      {
        name: 'Tự kiểm trước khi tuyên bố xong',
        detail:
          'Chạy tay lại bằng ví dụ ban đầu và ít nhất một ví dụ biên: mảng rỗng, một phần tử, giá trị trùng, giá trị âm, tràn số. Tìm ra lỗi của chính mình trước khi bị chỉ ra là một tín hiệu tích cực chứ không phải điểm trừ.',
      },
    ],
    scenario:
      'Sơn có hai năm làm lập trình viên phía máy chủ, trượt hai vòng phỏng vấn kỹ thuật liên tiếp dù ở nhà bạn giải được những bài tương tự. Bạn ghi lại buổi thứ hai và nhận ra vấn đề không nằm ở thuật toán: bạn nghe đề xong là gõ ngay, không hỏi gì; đến phút thứ mười hai bạn phát hiện dữ liệu có thể chứa phần tử trùng và phải xóa gần hết để viết lại; trong suốt quá trình bạn im lặng nên người phỏng vấn không có cơ hội gợi ý; và khi hết giờ bạn tuyên bố xong mà chưa chạy thử ví dụ nào. Bạn đổi cách luyện. Với mỗi bài, bạn bật đồng hồ và bắt buộc dành ba phút đầu chỉ để hỏi và ghi ra ràng buộc, kể cả khi luyện một mình thì cũng tự viết ra danh sách câu hỏi. Bạn nói to toàn bộ quá trình và ghi âm. Bạn viết lời giải đơn giản trước, ghi độ phức tạp, rồi mới cải tiến. Cuối mỗi bài, bạn bắt buộc chạy tay bốn trường hợp: bình thường, rỗng, một phần tử, và trường hợp có giá trị trùng. Bạn giảm số bài từ khoảng bốn mươi bài giải qua loa mỗi tháng xuống mười hai bài làm kỹ, và giải lại mỗi bài lần hai sau ba ngày mà không nhìn lời giải cũ. Ở vòng phỏng vấn tiếp theo, bạn gặp một bài bạn chưa từng thấy và không tìm ra lời giải tối ưu, nhưng bạn hỏi rõ đề, nêu lời giải thô kèm độ phức tạp, viết nó chạy được, tự phát hiện một lỗi biên và sửa, rồi nói ra hướng cải tiến còn dang dở. Bạn qua vòng đó. Phản hồi ghi lại là "trao đổi rõ ràng, tự kiểm tốt".',
    comparison: [
      {
        weak: 'Nghe đề xong là bắt đầu gõ ngay để tiết kiệm thời gian.',
        mature:
          'Dành hai đến ba phút hỏi ràng buộc và xác nhận cách hiểu đề, vì viết lại từ đầu ở phút thứ mười hai tốn nhiều hơn nhiều so với ba phút hỏi.',
      },
      {
        weak: 'Im lặng suy nghĩ cho tới khi có lời giải hoàn chỉnh mới mở miệng.',
        mature:
          'Nói ra hướng đang cân nhắc, kể cả hướng vừa bị loại và lý do loại, để người phỏng vấn theo kịp và có thể gợi ý đúng lúc.',
      },
      {
        weak: 'Đo tiến bộ bằng số bài đã giải, giải xong là chuyển bài mới ngay.',
        mature:
          'Đo bằng số bài giải lại được sau ba ngày mà không xem đáp án, và bằng số dạng bài bạn nhận ra ngay khi đọc đề.',
      },
      {
        weak: 'Tuyên bố xong ngay khi mã trông có vẻ đúng, để người phỏng vấn tự tìm lỗi.',
        mature:
          'Chủ động chạy tay hai đến ba trường hợp biên, tự nêu lỗi tìm được và sửa, coi đó là một phần của lời giải chứ không phải một sự cố.',
      },
    ],
    mistakes: [
      'Học thuộc lời giải của các bài phổ biến mà không hiểu vì sao nó đúng. Khi đề bị đổi một ràng buộc nhỏ, lời giải thuộc lòng không dùng được và bạn không có gì để bám vào, trong khi người hiểu nguyên lý vẫn tự suy ra được.',
      'Bỏ qua hoàn toàn việc luyện viết mã trên giấy hoặc trên trình soạn thảo không có gợi ý tự động. Nhiều buổi phỏng vấn không có công cụ hỗ trợ, và người quen phụ thuộc vào gợi ý thường mất nhiều thời gian cho những lỗi cú pháp vụn vặt.',
      'Cố tỏ ra đã biết bài khi thực tế đã từng đọc lời giải. Nếu bạn đã gặp bài này, hãy nói ra; người phỏng vấn thường sẽ đổi bài hoặc đổi ràng buộc, và điều đó tốt cho cả hai. Giả vờ suy nghĩ trong khi thực ra đang nhớ lại là điều dễ bị nhận ra và làm hỏng toàn bộ lòng tin.',
    ],
    worksheet: [
      'Trong lần luyện gần nhất, bạn dành bao nhiêu giây để làm rõ đề trước khi viết dòng mã đầu tiên?',
      'Bạn có nói to trong lúc giải không, và nếu ghi âm lại thì đoạn im lặng dài nhất của bạn kéo dài bao lâu?',
      'Với ba bài gần nhất, bạn đã kiểm thử những trường hợp biên nào? Trường hợp nào bạn thường xuyên quên?',
      'Trong số các bài bạn đã giải tháng trước, bao nhiêu bài bạn giải lại được sau ba ngày mà không xem đáp án?',
      'Dạng bài nào bạn nhận ra ngay khi đọc đề, và dạng nào bạn luôn phải mò từ đầu? Liệt kê ba dạng ở mỗi nhóm.',
    ],
    exercises: [
      {
        label: 'Ba phút làm rõ đề',
        text: 'Với năm bài bất kỳ, bắt buộc dành ba phút đầu chỉ để viết ra câu hỏi về ràng buộc và ví dụ biên, không viết một dòng mã nào. So số lần phải viết lại giữa năm bài này với năm bài bạn giải theo thói quen cũ.',
        level: 'e',
      },
      {
        label: 'Chạy tay trước khi gõ',
        text: 'Chọn ba bài và giải hoàn toàn bằng tay trên giấy với một ví dụ nhỏ trước khi mở trình soạn thảo. Ghi lại xem việc chạy tay có gợi ra hướng giải hay chỉ ra hiểu nhầm đề nào không.',
        level: 'e',
      },
      {
        label: 'Danh sách biên chuẩn',
        text: 'Lập một danh sách trường hợp biên dùng chung cho mọi bài: rỗng, một phần tử, phần tử trùng, giá trị âm, giá trị lớn nhất, dữ liệu đã sắp xếp, dữ liệu sắp xếp ngược. Dán nó cạnh màn hình và chạy qua toàn bộ danh sách sau mỗi bài.',
        level: 'e',
      },
      {
        label: 'Ghi âm khi giải',
        text: 'Giải ba bài trong khi nói to toàn bộ suy nghĩ và ghi âm lại. Nghe lại và đo hai thứ: đoạn im lặng dài nhất và số lần bạn nói ra một hướng rồi loại nó có lý do. Đặt mục tiêu giảm đoạn im lặng dài nhất xuống dưới ba mươi giây.',
        level: 'm',
      },
      {
        label: 'Thô trước, tối ưu sau',
        text: 'Với năm bài, bắt buộc viết xong lời giải đơn giản nhất và ghi độ phức tạp của nó trước khi được phép nghĩ tới tối ưu. Ghi lại số bài mà lời giải thô đã đủ tốt và số bài mà cải tiến thật sự cần thiết.',
        level: 'm',
      },
      {
        label: 'Giải lại sau ba ngày',
        text: 'Lập danh sách mười bài đã giải và giải lại toàn bộ sau ba ngày mà không xem đáp án cũ, ghi thời gian mỗi lần. Bài nào lần hai vẫn không giải được là bài bạn mới chỉ đọc hiểu chứ chưa thật sự học.',
        level: 'm',
      },
      {
        label: 'Phỏng vấn thử có người quan sát',
        text: 'Nhờ một đồng nghiệp đóng vai người phỏng vấn trong bốn mươi lăm phút với một bài bạn chưa từng thấy, yêu cầu họ chỉ gợi ý khi bạn hỏi và ghi lại mọi lúc họ không hiểu bạn đang làm gì. Xin phản hồi riêng về phần trình bày, không chỉ về lời giải.',
        level: 'h',
      },
      {
        label: 'Bản đồ dạng bài của riêng bạn',
        text: 'Sau ba mươi bài, tự phân loại chúng thành các dạng theo cấu trúc dữ liệu và kỹ thuật, viết cho mỗi dạng ba dấu hiệu nhận biết từ đề bài và một bài mẫu tiêu biểu. Kiểm bản đồ bằng cách đọc mười đề mới và chỉ đoán dạng, chưa giải.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Bạn không tìm ra lời giải tối ưu trong thời gian cho phép. Nên làm gì?',
        a: 'Hãy đảm bảo bạn có một lời giải chạy được, dù chậm, cùng với việc nêu rõ độ phức tạp của nó và hướng cải tiến bạn nhìn thấy nhưng chưa kịp làm. Phần lớn người phỏng vấn chấm theo thang nhiều tiêu chí, trong đó việc có lời giải đúng, trình bày rõ và tự đánh giá được giới hạn của mình đều có điểm. Nộp một lời giải tối ưu dở dang và không chạy được thường bị chấm thấp hơn.',
      },
      {
        q: 'Vì sao giải bốn mươi bài qua loa lại kém hơn giải mười hai bài kỹ?',
        a: 'Vì cái tạo ra năng lực là khả năng nhận ra dạng bài và tự sinh lại lời giải, mà cả hai chỉ hình thành khi bạn tự vật lộn với bài rồi truy hồi lại sau vài ngày. Đọc lời giải cho cảm giác hiểu ngay nhưng cảm giác đó tan rất nhanh. Phép kiểm đơn giản để biết mình đang ở nhóm nào: giải lại bài cũ sau ba ngày mà không nhìn gì cả — nếu không làm được thì bài đó chưa được học.',
      },
      {
        q: 'Có nên nói ra khi bạn đã từng gặp đúng bài này rồi không?',
        a: 'Nên, và nên nói ngay từ đầu. Người phỏng vấn thường sẽ đổi bài hoặc thêm ràng buộc, giúp họ đo đúng năng lực của bạn và giúp bạn tránh tình huống bị hỏi sâu vào một lời giải bạn chỉ nhớ chứ không hiểu. Ngoài ra, giả vờ đang suy nghĩ trong khi thực chất đang nhớ lại là điều khá dễ nhận ra qua tốc độ và cách bạn bỏ qua các bước trung gian, và một khi bị nghi ngờ thì mọi phần còn lại của buổi đều bị đặt dấu hỏi.',
      },
    ],
    plan7:
      'Ngày 1: lập danh sách trường hợp biên chuẩn và dán cạnh màn hình. Ngày 2-3: giải bốn bài với luật bắt buộc ba phút làm rõ đề và chạy tay trước khi gõ. Ngày 4: giải hai bài trong khi ghi âm nói to, nghe lại và đo đoạn im lặng dài nhất. Ngày 5: giải lại toàn bộ bài của ngày 2-3 mà không xem đáp án cũ, ghi thời gian. Ngày 6: phỏng vấn thử bốn mươi lăm phút với một người, xin phản hồi riêng về phần trình bày. Ngày 7: phân loại các bài đã làm thành dạng, viết ba dấu hiệu nhận biết cho mỗi dạng.',
    evidence:
      'Hiện vật ở đây không phải số bài đã giải mà là sổ luyện tập: mỗi bài một mục ghi ngày giải lần một, ngày giải lại, thời gian mỗi lần, lỗi biên đã bỏ sót, và dạng bài. Sau ba tháng, sổ này cho thấy đường cong tiến bộ thật và những dạng bạn liên tục hụt. Bằng chứng thứ hai, có sức nặng hơn với nhiều nơi tuyển, là mã nguồn công khai của bạn: một kho mã nhỏ nhưng có tài liệu hướng dẫn, có kiểm thử, có lịch sử commit sạch nói lên nhiều điều mà bốn mươi lăm phút giải thuật không nói được. Khi phỏng vấn, hãy chủ động nhắc tới cách bạn kiểm thử và cách bạn xử lý trường hợp biên, vì đó là thói quen mà người tuyển thật sự phải sống chung sau khi bạn vào làm.',
    references: [
      { label: 'Tech Interview Handbook — tài liệu mở về quy trình phỏng vấn kỹ thuật', url: 'https://www.techinterviewhandbook.org/', type: 'article', needsReview: true },
      { label: 'MDN Web Docs — tài liệu tham chiếu lập trình web của Mozilla', url: 'https://developer.mozilla.org/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 12 · Phỏng vấn System Design ───────────────────────────────────
  guide({
    thesis:
      'Phỏng vấn thiết kế hệ thống không có đáp án đúng, nên nó không đo kiến thức về công nghệ mà đo khả năng biến một yêu cầu mơ hồ thành một thiết kế có ràng buộc rõ và các đánh đổi được nói ra thành lời. Người làm tốt vòng này bắt đầu bằng câu hỏi chứ không bằng sơ đồ, quy mọi quyết định về một con số ước lượng, và ở mỗi ngã ba đều nêu ít nhất hai phương án cùng lý do chọn. Người làm kém thường vẽ ngay một kiến trúc đầy đủ với đủ các thành phần thời thượng và không giải thích được vì sao cần chúng — điều đó phát tín hiệu rằng họ đã học thuộc một hình vẽ chứ chưa từng phải chịu hậu quả của một lựa chọn kiến trúc.',
    why: {
      work:
        'Kỹ năng này chính là việc bạn làm khi đề xuất một thay đổi lớn trong hệ thống thật: làm rõ yêu cầu, ước lượng tải, nêu phương án và đánh đổi, rồi thuyết phục người khác. Bản thiết kế không thuyết phục được đồng đội thì không được triển khai dù nó đúng.',
      interview:
        'Từ mức trung cấp trở lên, đây thường là vòng quyết định bậc lương được đề xuất, vì nó cho thấy bạn tự chủ được ở mức nào và có nhìn được hệ quả vận hành hay không.',
      study:
        'Học thiết kế hệ thống hiệu quả nhất bằng cách đọc mô tả kiến trúc thật của các hệ thống lớn rồi tự hỏi vì sao họ chọn thế, thay vì học danh sách các thành phần và vai trò của chúng.',
      life:
        'Cách tiếp cận này áp dụng cho mọi bài toán thiết kế có ràng buộc và đánh đổi: tổ chức lại luồng công việc của một phòng ban, thiết kế quy trình phục vụ trong một cửa hàng, hay sắp xếp hệ thống lưu trữ hồ sơ cho một phòng khám.',
    },
    framework: [
      {
        name: 'Làm rõ phạm vi và tiêu chí thành công',
        detail:
          'Hỏi để chốt ba thứ: chức năng nào bắt buộc trong phạm vi bài, chức năng nào để ngoài, và thiết kế này ưu tiên gì — độ trễ thấp, tính sẵn sàng, tính nhất quán mạnh, hay chi phí thấp. Không có thứ tự ưu tiên thì mọi đánh đổi sau đó đều không có căn cứ.',
      },
      {
        name: 'Ước lượng bằng số thô',
        detail:
          'Tính nhanh số người dùng hoạt động, số yêu cầu mỗi giây ở mức trung bình và mức đỉnh, kích thước một bản ghi và tổng dung lượng sau một năm. Con số không cần chính xác, nhưng chính chúng quyết định thiết kế: một hệ thống trăm yêu cầu mỗi giây và một hệ thống trăm nghìn yêu cầu mỗi giây là hai bài toán khác nhau hoàn toàn.',
      },
      {
        name: 'Vẽ đường đi của dữ liệu trước',
        detail:
          'Bắt đầu từ một sơ đồ tối giản theo đúng hành trình một yêu cầu: từ máy khách, qua các lớp, tới nơi lưu trữ và quay lại. Chỉ thêm thành phần khi có một vấn đề cụ thể buộc phải thêm, và nói rõ vấn đề đó là gì.',
      },
      {
        name: 'Chọn mô hình dữ liệu và cách phân mảnh',
        detail:
          'Đây thường là quyết định có hệ quả sâu nhất và khó đảo ngược nhất. Nêu rõ các mẫu truy vấn chính, chọn kiểu lưu trữ theo mẫu truy vấn đó, và nếu cần phân mảnh thì nói rõ khóa phân mảnh cùng rủi ro dữ liệu lệch tải.',
      },
      {
        name: 'Nêu điểm hỏng và cách vận hành',
        detail:
          'Chỉ ra thành phần nào hỏng thì cả hệ thống dừng, dữ liệu mất tới mức nào khi có sự cố, hệ thống hồi phục ra sao, và bạn sẽ theo dõi bằng chỉ số nào. Phần này thường bị bỏ qua và cũng thường là phần phân biệt ứng viên có kinh nghiệm vận hành thật.',
      },
    ],
    scenario:
      'Trang có bốn năm làm kỹ sư phần mềm, phỏng vấn cho vị trí kỹ sư cấp trung tại một công ty thương mại điện tử. Đề bài chỉ có một câu: thiết kế tính năng thông báo cho người bán khi có đơn hàng mới. Trong buổi phỏng vấn thử trước đó, bạn đã mắc lỗi điển hình là vẽ ngay một sơ đồ có hàng đợi tin nhắn, bộ nhớ đệm và nhiều dịch vụ nhỏ, rồi không giải thích được vì sao cần từng cái. Lần này bạn bắt đầu bằng bảy câu hỏi và ghi câu trả lời lên góc bảng: thông báo qua kênh nào, có bắt buộc thời gian thực không hay trễ vài giây chấp nhận được, người bán lớn nhất có bao nhiêu đơn mỗi phút vào đợt khuyến mãi, mất một thông báo có nghiêm trọng không, gửi trùng có nghiêm trọng không, có cần lịch sử thông báo không, và hệ thống hiện tại đã có gì. Câu trả lời định hình toàn bộ thiết kế: trễ dưới năm giây là chấp nhận được, mất thông báo là nghiêm trọng, gửi trùng thì chỉ gây phiền, và cần giữ lịch sử ba mươi ngày. Bạn ước lượng thô và ra con số vài nghìn đơn mỗi phút ở mức đỉnh, tức khoảng vài chục yêu cầu mỗi giây, thấp hơn nhiều so với cảm giác ban đầu. Từ đó bạn kết luận không cần kiến trúc phức tạp: một hàng đợi bền để đảm bảo không mất, một tiến trình gửi có cơ chế thử lại kèm giãn cách, ghi lại trạng thái mỗi thông báo vào một bảng có khóa theo mã đơn để tra lịch sử, và chấp nhận rằng thiết kế này có thể gửi trùng trong trường hợp hiếm — bạn nói rõ đây là đánh đổi có chủ ý vì mất quan trọng hơn trùng. Bạn nêu điểm hỏng là tiến trình gửi và nhà cung cấp kênh gửi bên ngoài, mô tả cách theo dõi bằng độ dài hàng đợi và tỷ lệ gửi thất bại, và chỉ ra một rủi ro tương lai: nếu sau này bổ sung người bán rất lớn thì cần chia hàng đợi theo người bán để một người bán bận không làm chậm cả hệ thống. Người phỏng vấn nói phần thuyết phục nhất là bạn đã chủ động không thêm bộ nhớ đệm.',
    comparison: [
      {
        weak: 'Vẽ ngay kiến trúc đầy đủ với nhiều thành phần vì đó là hình vẽ đã học thuộc.',
        mature:
          'Bắt đầu bằng sơ đồ tối giản đủ chạy được, và chỉ thêm mỗi thành phần khi nêu được vấn đề cụ thể mà nó giải quyết.',
      },
      {
        weak: 'Bỏ qua phần ước lượng vì thấy nó tốn thời gian và không ai kiểm chứng con số.',
        mature:
          'Dành ba phút tính số thô, vì chính con số quy mô mới quyết định thiết kế nào là hợp lý và giúp bạn tránh cả thiết kế thừa lẫn thiết kế thiếu.',
      },
      {
        weak: 'Nói tên công nghệ cụ thể như một câu trả lời, ví dụ chọn ngay một hệ quản trị dữ liệu vì quen dùng.',
        mature:
          'Nói yêu cầu trước, chọn loại hệ thống lưu trữ theo mẫu truy vấn và ràng buộc nhất quán, rồi mới nêu một vài lựa chọn cụ thể kèm điều kiện.',
      },
      {
        weak: 'Kết thúc khi sơ đồ đã vẽ xong, coi như bài toán đã giải quyết.',
        mature:
          'Dành phần cuối cho điểm hỏng, cách hồi phục, chỉ số theo dõi và hướng mở rộng khi tải tăng mười lần — phần cho thấy bạn từng vận hành hệ thống thật.',
      },
    ],
    mistakes: [
      'Thiết kế thừa cho một quy mô không tồn tại: thêm phân mảnh, nhiều tầng đệm và hàng loạt dịch vụ nhỏ cho một hệ thống chỉ có vài chục yêu cầu mỗi giây. Đây là lỗi bị trừ điểm nặng vì trong công việc thật, độ phức tạp thừa là chi phí vận hành vĩnh viễn.',
      'Không nêu giả định nào rồi thiết kế trên một cách hiểu đề khác hẳn với ý người hỏi, và chỉ phát hiện ở phút thứ ba mươi. Mỗi giả định nên được nói ra và viết lên bảng để người phỏng vấn kịp đính chính.',
      'Bỏ qua hoàn toàn khía cạnh dữ liệu người dùng và bảo mật khi bài toán rõ ràng có liên quan — quyền truy cập, mã hóa khi truyền, thời hạn lưu trữ. Với các hệ thống xử lý dữ liệu cá nhân, đây không chỉ là điểm cộng kỹ thuật mà còn là nghĩa vụ tuân thủ, và quy định cụ thể thì khác nhau theo quốc gia nên cần xác nhận với bộ phận pháp chế trong công việc thật.',
    ],
    worksheet: [
      'Với đề bài bạn đang luyện, bảy câu hỏi làm rõ phạm vi của bạn là gì, và câu trả lời nào sẽ thay đổi thiết kế nhiều nhất?',
      'Ước lượng thô của bạn cho số yêu cầu mỗi giây ở mức đỉnh và tổng dung lượng sau một năm là bao nhiêu? Bạn dựa vào giả định nào?',
      'Trong sơ đồ bạn vừa vẽ, thành phần nào bạn thêm vào mà không nêu được vấn đề cụ thể nó giải quyết?',
      'Mẫu truy vấn chính của hệ thống này là gì, và cách lưu trữ bạn chọn có phục vụ trực tiếp mẫu đó không?',
      'Nếu một thành phần bất kỳ trong sơ đồ ngừng hoạt động lúc hai giờ sáng, chuyện gì xảy ra và bạn phát hiện ra bằng chỉ số nào?',
    ],
    exercises: [
      {
        label: 'Bảy câu hỏi làm rõ',
        text: 'Với ba đề bài thiết kế bất kỳ, viết ra bảy câu hỏi làm rõ cho mỗi đề trước khi vẽ bất cứ thứ gì. Đánh dấu hai câu mà câu trả lời sẽ thay đổi thiết kế nhiều nhất, đó là hai câu bắt buộc phải hỏi trước.',
        level: 'e',
      },
      {
        label: 'Tính số thô trong ba phút',
        text: 'Luyện ước lượng nhanh với năm bài toán: từ số người dùng suy ra yêu cầu mỗi giây trung bình và đỉnh, từ kích thước bản ghi suy ra dung lượng sau một năm. Không dùng máy tính, làm tròn mạnh, và ghi rõ giả định của từng bước.',
        level: 'e',
      },
      {
        label: 'Sơ đồ tối giản',
        text: 'Vẽ đường đi của một yêu cầu qua hệ thống bằng đúng bốn khối, không thêm gì. Sau đó với mỗi khối muốn thêm vào, viết một câu nêu vấn đề cụ thể nó giải quyết; nếu không viết được thì không thêm.',
        level: 'e',
      },
      {
        label: 'Bảng đánh đổi hai phương án',
        text: 'Chọn một quyết định trong thiết kế của bạn và lập bảng so hai phương án theo bốn tiêu chí: độ phức tạp vận hành, chi phí, hệ quả khi hỏng, và khả năng đảo ngược. Kết luận bằng một câu nêu điều kiện nào sẽ khiến bạn đổi sang phương án kia.',
        level: 'm',
      },
      {
        label: 'Mổ xẻ một hệ thống có thật',
        text: 'Chọn một sản phẩm bạn dùng hằng ngày và tự thiết kế lại phần lõi của nó trong bốn mươi lăm phút theo đủ năm bước. Sau đó tìm đọc mô tả kiến trúc công khai nếu có, và ghi ba chỗ họ làm khác bạn cùng lý do bạn đoán được.',
        level: 'm',
      },
      {
        label: 'Phần cuối về vận hành',
        text: 'Lấy một thiết kế đã vẽ và viết thêm một trang chỉ về vận hành: danh sách điểm hỏng đơn lẻ, dữ liệu mất tối đa khi sự cố, quy trình hồi phục, và bốn chỉ số bạn sẽ theo dõi cùng ngưỡng cảnh báo cho từng chỉ số.',
        level: 'm',
      },
      {
        label: 'Buổi thiết kế thử bốn mươi lăm phút',
        text: 'Nhờ một kỹ sư có kinh nghiệm hơn ra đề và đóng vai người phỏng vấn, giữ đúng bốn mươi lăm phút và yêu cầu họ phản biện ít nhất ba quyết định của bạn. Xin phản hồi riêng về hai điểm: bạn có bỏ sót bước ước lượng không, và có thành phần nào bạn thêm mà không biện minh được.',
        level: 'h',
      },
      {
        label: 'Đề xuất thay đổi trong hệ thống thật',
        text: 'Ở nơi bạn đang làm, chọn một điểm yếu có thật trong hệ thống và viết một đề xuất hai trang theo đúng cấu trúc của vòng thiết kế: vấn đề, ràng buộc, hai phương án, đánh đổi, kế hoạch triển khai từng bước và chỉ số đo thành công. Trình bày cho nhóm và ghi lại phản biện bạn nhận được.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao bước ước lượng bằng số thô lại quan trọng đến vậy dù con số không chính xác?',
        a: 'Vì độ lớn quyết định loại thiết kế, và sai một bậc độ lớn là thiết kế sai. Con số cho biết dữ liệu có nằm gọn trong một máy không, có cần phân mảnh không, có cần đệm không, và chi phí lưu trữ sau một năm có chấp nhận được không. Ngoài ra, nó bảo vệ bạn khỏi cả hai lỗi phổ biến: thiết kế thừa cho quy mô tưởng tượng, và thiết kế thiếu vì không nhận ra tải thật sự lớn.',
      },
      {
        q: 'Người phỏng vấn hỏi vì sao bạn không dùng bộ nhớ đệm. Trả lời thế nào cho đúng tinh thần?',
        a: 'Trả lời bằng ràng buộc chứ không bằng sở thích: nêu con số tải đã ước lượng, nêu mẫu truy vấn hiện tại, và giải thích rằng ở quy mô này lớp lưu trữ chính đã đáp ứng được nên thêm đệm chỉ làm tăng độ phức tạp và sinh ra vấn đề dữ liệu cũ. Sau đó nêu điều kiện cụ thể sẽ khiến bạn thêm đệm — ví dụ khi tỷ lệ đọc trên ghi vượt một ngưỡng nào đó hoặc khi độ trễ đo được vượt yêu cầu. Cách trả lời này cho thấy bạn quyết định theo dữ liệu, không theo thói quen.',
      },
      {
        q: 'Bạn không có kinh nghiệm với hệ thống quy mô lớn. Có thể chuẩn bị cho vòng này không?',
        a: 'Có, nhưng phải trung thực về phạm vi kinh nghiệm. Cách hiệu quả là ba việc: luyện quy trình năm bước cho nhiều đề khác nhau để thành thói quen, đọc kỹ vài mô tả kiến trúc công khai và tự hỏi vì sao họ chọn như vậy, và mang vào buổi phỏng vấn những đánh đổi thật bạn đã gặp ở quy mô nhỏ. Một ứng viên nói rõ "ở quy mô em từng làm thì vấn đề xuất hiện ở đây, còn ở quy mô lớn hơn em suy đoán vấn đề sẽ chuyển sang chỗ kia" thường được đánh giá cao hơn một ứng viên nói vanh vách về quy mô mình chưa từng chạm tới.',
      },
    ],
    plan7:
      'Ngày 1: luyện viết bảy câu hỏi làm rõ cho ba đề khác nhau. Ngày 2: luyện ước lượng số thô cho năm bài toán, không dùng máy tính. Ngày 3: vẽ sơ đồ tối giản bốn khối cho hai đề và biện minh từng khối thêm vào. Ngày 4: lập bảng đánh đổi hai phương án cho một quyết định lưu trữ. Ngày 5: viết một trang vận hành gồm điểm hỏng, hồi phục và chỉ số theo dõi. Ngày 6: buổi thiết kế thử bốn mươi lăm phút với một kỹ sư có kinh nghiệm hơn. Ngày 7: mổ xẻ một hệ thống có thật bạn dùng hằng ngày và so với mô tả kiến trúc công khai nếu có.',
    evidence:
      'Bằng chứng mạnh nhất cho năng lực này là một tài liệu thiết kế thật bạn đã viết và đã được triển khai, dù cho hệ thống nhỏ: nêu vấn đề, ràng buộc, các phương án, đánh đổi, kế hoạch triển khai theo bước và chỉ số đo thành công sau khi chạy. Kèm theo nó, phần có giá trị nhất lại là bản ghi nhận sau sáu tháng: điều gì đã đúng như dự đoán, điều gì sai, và bạn đã điều chỉnh ra sao. Rất ít ứng viên mang được thứ này vào phỏng vấn, và nó chứng minh điều mà bốn mươi lăm phút vẽ bảng không chứng minh nổi — rằng bạn đã sống với hậu quả của quyết định kiến trúc của chính mình. Nếu công việc hiện tại chưa cho bạn cơ hội đó, hãy viết đề xuất cho một điểm yếu có thật trong hệ thống nơi bạn làm và giữ lại cả phần phản biện bạn nhận được.',
    references: [
      { label: 'System Design Primer — kho tài liệu mở về thiết kế hệ thống', url: 'https://github.com/donnemartin/system-design-primer', type: 'article', needsReview: true },
      { label: 'Martin Fowler — bài viết về kiến trúc phần mềm và đánh đổi thiết kế', url: 'https://martinfowler.com/', type: 'article', needsReview: true },
    ],
  }),
  // ── Chương 13 · Phỏng vấn vị trí quản lý ──────────────────────────────────
  guide({
    thesis:
      'Phỏng vấn quản lý đo một loại bằng chứng khác hẳn phỏng vấn chuyên viên: không phải bạn làm được gì, mà là thông qua bạn thì người khác làm được gì. Vì vậy mọi câu chuyện bạn kể phải có nhân vật thứ hai — một người bạn tuyển, một người bạn giữ lại, một người bạn phải cho nghỉ, một người từ mức trung bình lên mức tự chủ nhờ cách bạn giao việc. Câu trả lời chỉ nói về thành tích của chính bạn, dù ấn tượng đến đâu, đều bị đọc thành tín hiệu rằng bạn vẫn đang làm việc như một chuyên viên giỏi chứ chưa chuyển sang vai quản lý. Và có một câu hỏi hầu như luôn xuất hiện, dưới hình thức này hay hình thức khác: bạn đã xử lý một người có hiệu suất thấp như thế nào.',
    why: {
      work:
        'Chuẩn bị cho vòng này buộc bạn nhìn lại đội mình bằng dữ liệu chứ không bằng cảm giác: ai đã tiến bộ, tiến bộ bao nhiêu, nhờ can thiệp nào — và phần lớn quản lý phát hiện họ không có dữ liệu đó.',
      interview:
        'Người tuyển quản lý sợ hai rủi ro cụ thể: tuyển phải người giỏi chuyên môn nhưng không dẫn được người, và tuyển phải người dễ chịu nhưng né mọi cuộc trò chuyện khó. Toàn bộ vòng phỏng vấn xoay quanh việc kiểm tra hai rủi ro đó.',
      study:
        'Việc hệ thống lại cách bạn quản lý theo các trục — tuyển, giao việc, phản hồi, xử lý hiệu suất thấp, phát triển người kế cận — biến kinh nghiệm rời rạc thành một khung có thể cải thiện được và dạy lại được.',
      life:
        'Cùng năng lực này xuất hiện ở mọi vai trò dẫn dắt ngoài công việc: điều hành một nhóm thiện nguyện, làm tổ trưởng dân phố, hay điều phối một dự án gia đình có nhiều người tham gia.',
    },
    framework: [
      {
        name: 'Dựng hồ sơ đội đã dẫn',
        detail:
          'Ghi lại quy mô đội theo từng giai đoạn, cơ cấu, tỷ lệ giữ người, số người bạn đã tuyển và đã cho nghỉ, số người được thăng tiến sau khi bạn kèm. Đây là bộ số nền tảng mà mọi câu chuyện quản lý dựa vào.',
      },
      {
        name: 'Chuẩn bị bốn câu chuyện lõi',
        detail:
          'Bốn tình huống gần như chắc chắn được hỏi: một người hiệu suất thấp bạn đã xử lý, một xung đột giữa hai người bạn giải quyết, một quyết định không được lòng đội mà bạn vẫn thực thi, và một người bạn phát triển thành công. Mỗi chuyện cần có phần bạn đã sai và đã điều chỉnh.',
      },
      {
        name: 'Nói rõ triết lý quản lý kèm bằng chứng',
        detail:
          'Nêu quan điểm của bạn về giao việc, mức độ can thiệp, cách cho phản hồi và cách ra quyết định, mỗi quan điểm gắn với một ví dụ thật. Triết lý không có ví dụ nghe như đọc sách; ví dụ không có triết lý nghe như kể chuyện rời rạc.',
      },
      {
        name: 'Chuẩn bị kế hoạch chín mươi ngày',
        detail:
          'Phác thảo bạn sẽ làm gì trong ba mươi ngày đầu (nghe, đo, không đổi gì lớn), sáu mươi ngày (chốt ưu tiên và cách làm việc chung), chín mươi ngày (thay đổi có kiểm chứng đầu tiên). Nêu rõ đây là giả định sẽ điều chỉnh sau khi có dữ liệu thật.',
      },
      {
        name: 'Hỏi ngược ở tầng quản lý',
        detail:
          'Câu hỏi của ứng viên quản lý phải khác câu hỏi của chuyên viên: về quyền quyết định thật với ngân sách và nhân sự, về tiêu chí đánh giá đội, về lý do vị trí này trống, và về mối quan hệ giữa đội này với các phòng ban khác.',
      },
    ],
    scenario:
      'Phong quản lý vận hành cho hai phòng khám nha khoa trong bốn năm, ứng tuyển vị trí Trưởng phòng Vận hành cho một chuỗi bảy phòng khám. Ở lần phỏng vấn trước cho một vị trí tương tự, bạn trượt với phản hồi rằng "ứng viên nói nhiều về quy trình, ít về con người". Lần này bạn chuẩn bị khác. Bạn dựng hồ sơ đội: hai phòng khám tổng cộng hai mươi ba nhân sự gồm điều dưỡng, lễ tân và kỹ thuật viên; trong bốn năm bạn tuyển mười một người, cho nghỉ hai, và ba người lên vị trí phụ trách ca. Bạn viết bốn câu chuyện lõi. Câu chuyện về hiệu suất thấp là trường hợp một lễ tân có thái độ tốt nhưng liên tục đặt lịch chồng giờ, gây trễ và làm khách phàn nàn: bạn kể rõ trình tự — trước hết bạn kiểm xem lỗi nằm ở người hay ở công cụ và phát hiện phần mềm đặt lịch cho phép chồng mà không cảnh báo; bạn sửa phần công cụ trước, đặt lại kỳ vọng bằng một con số cụ thể là không quá một ca chồng mỗi tuần, cho hai tháng theo dõi có gặp riêng hằng tuần; sau hai tháng tình hình cải thiện nhưng vẫn vượt ngưỡng, và bạn đã chuyển người này sang mảng chăm sóc khách hàng sau điều trị, nơi họ làm tốt hơn hẳn. Bạn cũng nói thẳng phần mình sai: lẽ ra phải kiểm công cụ ngay từ tuần đầu thay vì mất sáu tuần cho rằng đó là vấn đề thái độ. Câu chuyện về quyết định không được lòng đội là việc bạn bỏ chế độ thưởng theo số lượng bệnh nhân mỗi ca vì nó đang khuyến khích rút ngắn thời gian tư vấn; bạn kể cả phản ứng tiêu cực trong sáu tuần đầu và cách bạn xử lý. Trong buổi phỏng vấn, câu hỏi đầu tiên đúng là câu về hiệu suất thấp, và câu hỏi đào sâu là "nếu chuyển vị trí không hiệu quả thì anh làm gì tiếp" — bạn có sẵn câu trả lời vì đã nghĩ tới bước đó.',
    comparison: [
      {
        weak: 'Kể thành tích của đội như thành tích của mình, dùng "tôi" cho cả những việc do người khác làm.',
        mature:
          'Nói rõ ai làm gì, và phần của bạn là các quyết định về cấu trúc, ưu tiên, con người và tiêu chuẩn — kèm ví dụ về người đã tiến bộ nhờ những quyết định đó.',
      },
      {
        weak: 'Né câu hỏi về việc cho nhân viên nghỉ bằng cách nói mình chưa từng gặp trường hợp nào.',
        mature:
          'Kể một trường hợp thật với đầy đủ trình tự: dấu hiệu, cuộc trò chuyện làm rõ kỳ vọng, thời gian theo dõi, hỗ trợ đã cung cấp, và quyết định cuối cùng cùng cách bạn thông báo.',
      },
      {
        weak: 'Trình bày triết lý quản lý bằng những nguyên tắc chung mà bất kỳ ai cũng có thể tán thành.',
        mature:
          'Nêu quan điểm có tính chọn lựa, tức là quan điểm mà một người quản lý giỏi khác có thể không đồng ý, và giải thích bằng trải nghiệm dẫn bạn tới quan điểm đó.',
      },
    ],
    mistakes: [
      'Chứng minh giá trị bằng chuyên môn cũ, ví dụ kể rất kỹ việc mình tự xử lý một ca khó. Ở vị trí quản lý, điều đó bị đọc thành dấu hiệu bạn sẽ giành việc của cấp dưới thay vì xây năng lực cho họ.',
      'Trình bày kế hoạch chín mươi ngày như một danh sách thay đổi sẽ áp đặt ngay từ tuần đầu. Người tuyển hiểu rằng ai đó vào và đảo lộn mọi thứ trước khi hiểu bối cảnh thường tạo ra thiệt hại, nên kế hoạch tốt phải bắt đầu bằng giai đoạn nghe và đo.',
      'Nói về đội cũ với giọng đổ lỗi: đội yếu, cấp trên không hỗ trợ, công ty không đầu tư. Kể cả khi đúng, cách kể này phát tín hiệu rằng bạn sẽ nói tương tự về nơi mới, và người phỏng vấn hầu như luôn nghe ra điều đó.',
    ],
    worksheet: [
      'Quy mô đội bạn từng dẫn theo từng giai đoạn là bao nhiêu, và bạn có bao nhiêu người đã được thăng tiến hoặc mở rộng phạm vi sau khi làm việc với bạn?',
      'Trường hợp hiệu suất thấp gần nhất bạn xử lý diễn ra thế nào, và bạn mất bao lâu từ lúc nhận ra dấu hiệu tới lúc có cuộc trò chuyện đầu tiên?',
      'Quyết định không được lòng đội gần nhất của bạn là gì, và bạn đã làm gì để nó vẫn được thực thi mà không phá vỡ lòng tin?',
      'Nếu một thành viên trong đội cũ được hỏi làm việc với bạn thì học được gì, họ sẽ trả lời thế nào? Bạn có bằng chứng nào cho câu trả lời đó?',
      'Trong ba mươi ngày đầu ở vị trí mới, bạn sẽ đo những gì trước khi thay đổi bất cứ thứ gì, và bạn lấy dữ liệu đó từ đâu?',
    ],
    exercises: [
      {
        label: 'Hồ sơ đội bằng số',
        text: 'Lập bảng ghi quy mô đội theo từng giai đoạn, số người bạn tuyển, số người rời đi và lý do, số người được thăng tiến, và thời gian trung bình để một người mới làm việc độc lập. Đánh dấu con số nào bạn không có và cần bắt đầu ghi từ bây giờ.',
        level: 'e',
      },
      {
        label: 'Bốn câu chuyện lõi',
        text: 'Viết bốn tình huống bắt buộc: hiệu suất thấp, xung đột giữa hai người, quyết định không được lòng đội, và một người bạn phát triển thành công. Mỗi chuyện phải có một đoạn nói rõ bạn đã sai ở đâu và điều chỉnh thế nào.',
        level: 'e',
      },
      {
        label: 'Ba quan điểm có tính chọn lựa',
        text: 'Viết ba quan điểm quản lý mà một người giỏi khác có thể phản đối, ví dụ về mức độ can thiệp vào công việc chuyên môn hay về việc có nên công khai tiêu chí đánh giá. Với mỗi quan điểm, kể trải nghiệm đã dẫn bạn tới đó.',
        level: 'e',
      },
      {
        label: 'Kế hoạch chín mươi ngày',
        text: 'Viết kế hoạch ba giai đoạn cho vị trí bạn nhắm: ba mươi ngày nghe và đo, sáu mươi ngày chốt ưu tiên và cách làm việc, chín mươi ngày thay đổi đầu tiên có kiểm chứng. Nêu rõ ba giả định lớn nhất và cách bạn sẽ kiểm chúng.',
        level: 'm',
      },
      {
        label: 'Diễn tập câu hỏi khó',
        text: 'Nhờ một người quản lý khác hỏi bạn năm câu khó: lần bạn cho ai đó nghỉ, lần bạn giữ một người quá lâu, lần bạn mất một người giỏi, lần bạn bị cấp trên bác đề xuất, và lần bạn xử lý một khiếu nại nội bộ. Ghi âm và nghe lại phần bạn né tránh.',
        level: 'm',
      },
      {
        label: 'Bộ câu hỏi ngược tầng quản lý',
        text: 'Soạn tám câu hỏi bạn sẽ hỏi ngược, tập trung vào quyền quyết định thật với ngân sách và nhân sự, tiêu chí đánh giá đội, lý do vị trí trống, và mối quan hệ với các phòng ban khác. Sắp thứ tự để hỏi được ba câu quan trọng nhất nếu chỉ còn năm phút.',
        level: 'm',
      },
      {
        label: 'Thu thập bằng chứng từ người cũ',
        text: 'Liên hệ ba người từng làm việc dưới quyền bạn và hỏi thẳng hai câu: điều gì trong cách bạn quản lý giúp họ nhiều nhất, và điều gì cản trở họ. Ghi lại nguyên văn, tìm mẫu chung, và dùng chính những câu đó khi nói về phong cách quản lý của mình.',
        level: 'h',
      },
      {
        label: 'Nghiên cứu tình huống của nơi tuyển',
        text: 'Tìm hiểu đội bạn sẽ tiếp quản qua mọi nguồn công khai, viết ba giả thuyết về vấn đề lớn nhất của họ, và chuẩn bị cách bạn sẽ kiểm chứng từng giả thuyết trong ba mươi ngày đầu. Trình bày phần này trong buổi phỏng vấn như một đề xuất chứ không như một kết luận.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao câu hỏi về nhân viên hiệu suất thấp gần như luôn xuất hiện?',
        a: 'Vì đó là việc khó nhất và bị né nhiều nhất trong nghề quản lý, nên nó phân loại rất tốt. Người tuyển muốn biết bốn điều: bạn nhận ra dấu hiệu sớm hay muộn, bạn có phân biệt được vấn đề năng lực với vấn đề công cụ, quy trình hay kỳ vọng không, bạn có tiến hành cuộc trò chuyện khó một cách rõ ràng và có ghi chép không, và bạn có dám đưa ra quyết định cuối cùng khi cần không. Một câu trả lời tránh né ở đây thường đủ để loại, kể cả khi mọi câu khác đều tốt.',
      },
      {
        q: 'Bạn chưa từng chính thức làm quản lý nhưng muốn ứng tuyển vị trí quản lý. Chuẩn bị bằng gì?',
        a: 'Bằng những bằng chứng dẫn dắt không chính thức, miêu tả trung thực đúng phạm vi: bạn đã kèm bao nhiêu người mới và họ mất bao lâu để tự chủ, bạn đã điều phối dự án liên phòng ban nào mà không có quyền chỉ đạo, bạn đã xây quy trình nào được người khác dùng lại, bạn đã đưa ra phản hồi khó cho đồng nghiệp ngang cấp ra sao. Đồng thời phải nói rõ điều bạn chưa từng làm — chủ yếu là quyết định về lương, tuyển và cho nghỉ — kèm cách bạn dự định học. Nói quá phạm vi kinh nghiệm quản lý là thứ rất dễ bị phát hiện qua ba câu hỏi đào sâu.',
      },
      {
        q: 'Kế hoạch chín mươi ngày nên chi tiết đến mức nào khi bạn còn ở ngoài công ty?',
        a: 'Chi tiết ở phần phương pháp, thô ở phần kết luận. Cụ thể là nêu rõ bạn sẽ gặp ai, hỏi gì, đo chỉ số nào và trong bao lâu — đó là phần bạn kiểm soát được và nó cho thấy cách làm việc của bạn. Ngược lại, đừng khẳng định sẽ thay đổi cụ thể cái gì, vì bạn chưa có dữ liệu và một kế hoạch quá quyết đoán từ bên ngoài thường bị đọc là thiếu khiêm tốn. Cách trình bày an toàn và thuyết phục là nêu ba giả thuyết kèm cách kiểm chứng, rồi nói rõ bạn sẽ điều chỉnh theo kết quả.',
      },
    ],
    plan7:
      'Ngày 1: lập hồ sơ đội bằng số và đánh dấu con số còn thiếu. Ngày 2-3: viết bốn câu chuyện lõi, mỗi chuyện có phần bạn đã sai. Ngày 4: viết ba quan điểm quản lý có tính chọn lựa kèm trải nghiệm dẫn tới. Ngày 5: soạn kế hoạch chín mươi ngày với ba giả thuyết và cách kiểm chứng. Ngày 6: diễn tập năm câu hỏi khó với một quản lý khác, ghi âm và nghe lại. Ngày 7: soạn tám câu hỏi ngược ở tầng quản lý và sắp thứ tự ưu tiên.',
    evidence:
      'Bằng chứng đặc trưng của vai quản lý là hồ sơ phát triển con người: với mỗi người từng làm dưới quyền bạn, ghi lại mức khởi điểm, các can thiệp bạn đã thực hiện, và vị trí của họ sau đó. Kèm theo là những hiện vật bạn tạo ra cho đội mà vẫn còn được dùng sau khi bạn rời đi — quy trình nhận việc cho người mới, mẫu đánh giá, tài liệu bàn giao, cấu trúc cuộc họp một đối một. Trong phỏng vấn, câu "quy trình nhận việc em xây năm ngoái rút thời gian để một điều dưỡng mới tự chủ ca từ khoảng tám tuần xuống năm tuần, và hiện vẫn đang được cả hai phòng khám dùng" là loại câu không thể bịa và cũng không thể thay thế bằng tính từ. Với người chưa từng làm quản lý chính thức, hãy bắt đầu tích lũy dạng bằng chứng này ngay từ vai trò kèm cặp người mới.',
    references: [
      { label: 'Center for Creative Leadership — nghiên cứu và tài nguyên về phát triển lãnh đạo', url: 'https://www.ccl.org/', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Managing people', url: 'https://hbr.org/topic/subject/managing-people', type: 'article' },
    ],
  }),

  // ── Chương 14 · Đặt câu hỏi ngược cho nhà tuyển dụng ──────────────────────
  guide({
    thesis:
      'Phần cuối buổi phỏng vấn không phải nghi thức lịch sự mà là lần cuối bạn còn ảnh hưởng được tới quyết định, và cũng là lần duy nhất bạn thu thập được thông tin để tự quyết định. Câu hỏi bạn đặt bộc lộ mức độ bạn đã suy nghĩ về công việc: hỏi về giờ giấc và phúc lợi ngay từ vòng đầu bộc lộ một loại quan tâm, hỏi về cách đội xử lý một tình huống cụ thể bộc lộ một loại khác. Đồng thời, đây là công cụ tự bảo vệ quan trọng nhất trong cả quá trình tìm việc: phần lớn những lần nhận việc rồi hối hận đều bắt nguồn từ những câu không được hỏi.',
    why: {
      work:
        'Thói quen hỏi để làm rõ trước khi cam kết là thói quen của người làm việc tốt nói chung, và người phỏng vấn đọc trực tiếp tín hiệu đó từ chất lượng câu hỏi của bạn.',
      interview:
        'Sau bốn ứng viên có năng lực tương đương, thứ người tuyển nhớ nhất thường là ai đã hỏi một câu khiến họ phải dừng lại suy nghĩ. Một câu hỏi tốt có sức nặng ngang một câu trả lời tốt.',
      study:
        'Đặt câu hỏi tốt là kỹ năng học được: nó đòi hỏi bạn phải đọc trước, hình thành giả thuyết, và biết mình đang thiếu thông tin gì — cùng cơ chế với việc đọc tài liệu chủ động.',
      life:
        'Cùng kỹ năng dùng khi bạn cân nhắc một cam kết lớn nào khác: chọn trường cho con, ký hợp đồng dịch vụ dài hạn, hoặc nhận lời tham gia một dự án chung. Hỏi trước rẻ hơn rất nhiều so với rút lui sau.',
    },
    framework: [
      {
        name: 'Phân câu hỏi theo bốn tầng',
        detail:
          'Tầng công việc (ngày làm việc thật trông thế nào), tầng đội nhóm (ai, phối hợp ra sao, xử lý bất đồng thế nào), tầng tổ chức (ưu tiên, cách ra quyết định, tình hình), tầng bản thân (thành công sau sáu tháng được đo bằng gì). Bốn tầng giúp bạn không dồn hết vào một khía cạnh.',
      },
      {
        name: 'Hỏi bằng tình huống thay vì hỏi bằng tính từ',
        detail:
          'Thay câu "văn hóa công ty thế nào" bằng câu "lần gần nhất hai phòng ban bất đồng về ưu tiên, việc đó được giải quyết ra sao". Câu hỏi bằng tình huống buộc người trả lời phải kể sự việc thật, và sự việc thật khó tô vẽ hơn tính từ.',
      },
      {
        name: 'Chọn câu hỏi theo đúng người đối diện',
        detail:
          'Hỏi nhân sự về quy trình, lộ trình và chính sách; hỏi quản lý trực tiếp về kỳ vọng, cách làm việc và bài toán thật; hỏi đồng nghiệp tương lai về ngày làm việc thường nhật và điều họ ước biết trước khi vào; hỏi lãnh đạo cấp cao về hướng đi và cách đội này gắn với nó. Hỏi sai người sẽ nhận được câu trả lời chung chung.',
      },
      {
        name: 'Chuẩn bị hai câu hỏi tự bảo vệ',
        detail:
          'Luôn có sẵn hai câu để phát hiện dấu hiệu xấu: vì sao vị trí này đang trống, và người tiền nhiệm hiện ở đâu; cùng với câu về việc người ở vị trí này thường gặp khó khăn gì trong ba tháng đầu. Cách họ trả lời hai câu này thường nói nhiều hơn nội dung câu trả lời.',
      },
      {
        name: 'Nghe và ghi, rồi đối chiếu chéo',
        detail:
          'Hỏi cùng một câu cho hai người khác nhau ở hai vòng và so câu trả lời. Sự khác biệt lớn giữa câu trả lời của quản lý và của đồng nghiệp tương lai về cùng một chuyện là dữ liệu quan trọng, đôi khi quan trọng hơn cả nội dung.',
      },
    ],
    scenario:
      'My ứng tuyển vị trí Chuyên viên Truyền thông cho một tổ chức phi lợi nhuận hoạt động trong lĩnh vực giáo dục cho trẻ em vùng khó khăn. Bạn đã có kinh nghiệm ba năm ở một công ty truyền thông thương mại và đang muốn chuyển sang khu vực phi lợi nhuận. Ở vòng cuối bạn có mười phút để hỏi, và bạn đã chuẩn bị mười hai câu theo bốn tầng, sắp thứ tự để hỏi được ba câu quan trọng nhất nếu bị cắt thời gian. Câu đầu tiên bạn hỏi giám đốc chương trình: trong mười hai tháng qua, có nội dung truyền thông nào tổ chức đã quyết định không đăng vì lý do bảo vệ trẻ em, và quyết định đó được đưa ra như thế nào. Câu này khiến người đối diện dừng lại và trả lời khá dài, và câu trả lời cho bạn ba thông tin cùng lúc: tổ chức có quy tắc bảo vệ hình ảnh trẻ em thành văn, quyết định thuộc về trưởng bộ phận chương trình chứ không phải bộ phận truyền thông, và đã từng có mâu thuẫn giữa nhu cầu gây quỹ với quy tắc đó. Câu thứ hai bạn hỏi về việc thành công của vị trí này trong sáu tháng đầu được đo bằng gì, và nhận được câu trả lời mơ hồ, nên bạn hỏi lại nhẹ nhàng rằng nếu phải chọn một chỉ số duy nhất thì đó là gì; lần này câu trả lời là số lượng nhà tài trợ cá nhân duy trì đóng góp — một thông tin làm thay đổi hẳn hình dung của bạn về công việc, vốn bạn tưởng là làm nội dung. Câu thứ ba bạn hỏi vì sao vị trí đang trống, và biết rằng người tiền nhiệm chuyển sang bộ phận gây quỹ trong cùng tổ chức, một tín hiệu tích cực. Sau đó ở vòng với một đồng nghiệp tương lai, bạn hỏi lại đúng câu về chỉ số thành công và nhận được câu trả lời khác: theo họ, cái được nhắc nhiều nhất trong họp là số bài báo được đăng. Sự khác biệt này chính là điều bạn mang ra thảo luận khi nhận được lời mời, và nó dẫn tới việc mô tả công việc được viết lại rõ hơn trước khi bạn ký.',
    comparison: [
      {
        weak: 'Trả lời "em không có câu hỏi nào, anh chị đã giải thích rất đầy đủ rồi".',
        mature:
          'Luôn có ít nhất hai câu hỏi thật, và nếu mọi thứ đã được trả lời thì hỏi sâu thêm một tầng về điều họ vừa nói, hoặc hỏi một câu về bước tiếp theo trong quy trình.',
      },
      {
        weak: 'Hỏi những câu mà câu trả lời đã nằm sẵn trên trang chủ của công ty.',
        mature:
          'Bắt đầu bằng "em có đọc phần này và hiểu rằng...", rồi hỏi một câu chỉ có thể trả lời bởi người bên trong.',
      },
      {
        weak: 'Hỏi bằng tính từ: môi trường có thân thiện không, sếp có dễ chịu không, công việc có áp lực không.',
        mature:
          'Hỏi bằng tình huống có mốc thời gian: lần gần nhất đội phải làm ngoài giờ là khi nào và vì sao, và sau đó đã thay đổi gì để lần sau nhẹ hơn.',
      },
    ],
    mistakes: [
      'Đưa câu hỏi về lương, ngày nghỉ và làm việc từ xa vào vòng đầu tiên với người sàng lọc, trước khi giá trị của bạn được thiết lập. Những câu này hoàn toàn chính đáng và bắt buộc phải hỏi, nhưng thời điểm tốt nhất là khi đã có tín hiệu tiến triển hoặc khi họ chủ động mở chủ đề.',
      'Hỏi một chuỗi câu như đang thẩm vấn, không phản hồi gì với câu trả lời. Phần hỏi ngược là một cuộc trò chuyện; nghe và đào sâu một câu trả lời thú vị có giá trị hơn nhiều so với việc hỏi hết danh sách.',
      'Không ghi chép câu trả lời, nên sau ba buổi phỏng vấn ở ba nơi thì lẫn lộn thông tin và không so sánh được khi phải chọn. Ghi ngay sau buổi, trong vòng một giờ, khi trí nhớ còn chính xác.',
    ],
    worksheet: [
      'Bạn đã chuẩn bị bao nhiêu câu hỏi, và chúng phân bổ thế nào trên bốn tầng công việc, đội nhóm, tổ chức và bản thân?',
      'Có câu hỏi nào của bạn mà câu trả lời đã nằm trên trang web của họ không? Viết lại nó thành câu chỉ người bên trong trả lời được.',
      'Ba câu hỏi quan trọng nhất của bạn là gì, nếu bạn chỉ còn năm phút và không được hỏi hết?',
      'Hai câu hỏi tự bảo vệ của bạn là gì, và bạn sẽ coi những dấu hiệu nào trong câu trả lời là đèn đỏ?',
      'Sau buổi phỏng vấn gần nhất, bạn còn thiếu thông tin nào để ra quyết định nếu họ mời bạn vào ngày mai?',
    ],
    exercises: [
      {
        label: 'Mười hai câu theo bốn tầng',
        text: 'Soạn mười hai câu hỏi chia đều cho bốn tầng: công việc, đội nhóm, tổ chức, bản thân. Đánh dấu ba câu bạn sẽ ưu tiên hỏi trước nếu chỉ còn năm phút, và một câu bạn sẽ bỏ nếu không khí buổi phỏng vấn căng.',
        level: 'e',
      },
      {
        label: 'Đổi tính từ thành tình huống',
        text: 'Lấy năm câu hỏi dạng tính từ mà bạn hay dùng và viết lại thành câu hỏi tình huống có mốc thời gian. So hai phiên bản và ghi lại loại thông tin mà phiên bản mới moi ra được còn phiên bản cũ thì không.',
        level: 'e',
      },
      {
        label: 'Bộ câu theo từng người',
        text: 'Với một quy trình tuyển gồm bốn vòng, viết ba câu hỏi riêng cho từng loại người: nhân sự, quản lý trực tiếp, đồng nghiệp tương lai, lãnh đạo cấp cao. Kiểm lại xem có câu nào bạn đang hỏi sai người không.',
        level: 'e',
      },
      {
        label: 'Hai câu tự bảo vệ',
        text: 'Soạn hai câu hỏi phát hiện dấu hiệu xấu và viết ra trước ba loại câu trả lời bạn sẽ coi là đèn đỏ. Dùng thật ở buổi phỏng vấn tiếp theo và so câu trả lời nhận được với ba loại đã dự đoán.',
        level: 'm',
      },
      {
        label: 'Đối chiếu chéo hai vòng',
        text: 'Chọn một câu hỏi quan trọng và hỏi đúng câu đó cho hai người ở hai vòng khác nhau. Ghi lại hai câu trả lời và phân tích khoảng cách giữa chúng, vì khoảng cách đó thường tiết lộ nhiều hơn nội dung.',
        level: 'm',
      },
      {
        label: 'Sổ ghi sau phỏng vấn',
        text: 'Thiết kế một mẫu ghi chép để điền trong vòng một giờ sau mỗi buổi: câu hỏi đã hỏi, câu trả lời, dấu hiệu tích cực, dấu hiệu đáng lo, và thông tin còn thiếu. Dùng cho ba buổi liên tiếp và so sánh ba nơi bằng bảng.',
        level: 'm',
      },
      {
        label: 'Một câu hỏi khiến họ phải nghĩ',
        text: 'Với công ty bạn muốn nhất, nghiên cứu kỹ và soạn một câu hỏi mà người phỏng vấn nhiều khả năng chưa được hỏi bao giờ, dựa trên một mâu thuẫn có thật giữa hai mục tiêu của họ. Hỏi thật và ghi lại phản ứng cùng độ dài câu trả lời.',
        level: 'h',
      },
      {
        label: 'Bảng quyết định nhận việc',
        text: 'Trước khi phỏng vấn, lập bảng gồm sáu tiêu chí bạn thật sự quan tâm kèm trọng số, và xác định câu hỏi nào sẽ cung cấp dữ liệu cho từng tiêu chí. Sau các vòng, điền bảng và dùng nó để so sánh các lời mời thay vì quyết định bằng cảm giác.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao câu hỏi bằng tình huống lại lấy được thông tin thật hơn câu hỏi bằng tính từ?',
        a: 'Vì tính từ cho phép người trả lời chọn phiên bản đẹp nhất mà không cần bằng chứng, còn câu hỏi về một sự việc cụ thể buộc họ phải nhớ lại và kể, mà việc kể lại luôn để lộ chi tiết: ai ra quyết định, mất bao lâu, có được giải quyết không. Ngay cả khi họ chọn kể một sự việc thuận lợi, cách sự việc đó diễn ra vẫn cho bạn thông tin cấu trúc về nơi ấy.',
      },
      {
        q: 'Khi nào là thời điểm thích hợp để hỏi về lương và điều kiện làm việc?',
        a: 'Khi bên tuyển đã thể hiện sự quan tâm rõ ràng — thường là sau vòng chuyên môn hoặc khi họ chủ động nhắc tới bước tiếp theo — hoặc bất cứ lúc nào họ mở chủ đề trước. Riêng khoảng lương, nếu quy trình dài và bạn lo mất thời gian cho một vị trí lệch xa mong đợi, hoàn toàn hợp lý khi hỏi khoảng lương ngay ở vòng sàng lọc với cách diễn đạt trung tính, ví dụ đề nghị xác nhận khoảng ngân sách của vị trí để chắc chắn hai bên cùng hướng. Điều nên tránh là biến câu hỏi đầu tiên trong cả quy trình thành câu về phúc lợi.',
      },
      {
        q: 'Họ trả lời câu hỏi của bạn một cách mơ hồ. Nên làm gì?',
        a: 'Hỏi lại một lần theo hướng thu hẹp, ví dụ đề nghị họ chọn một chỉ số duy nhất hoặc kể một ví dụ gần nhất. Nếu lần thứ hai vẫn mơ hồ, hãy ghi nhận điều đó như một dữ liệu chứ đừng ép tiếp: nó có thể nghĩa là họ chưa xác định rõ, hoặc thông tin nhạy cảm, hoặc chính họ cũng không biết. Cả ba khả năng đều đáng để bạn cân nhắc khi ra quyết định, và bạn có thể quay lại chủ đề đó ở giai đoạn thương lượng.',
      },
    ],
    plan7:
      'Ngày 1: soạn mười hai câu hỏi chia đều bốn tầng. Ngày 2: đổi năm câu hỏi dạng tính từ thành câu hỏi tình huống. Ngày 3: phân bộ câu hỏi theo từng loại người trong quy trình. Ngày 4: soạn hai câu tự bảo vệ và ba loại câu trả lời được coi là đèn đỏ. Ngày 5: lập bảng sáu tiêu chí quyết định nhận việc kèm trọng số. Ngày 6: thiết kế mẫu ghi chép sau phỏng vấn. Ngày 7: nghiên cứu công ty mục tiêu và soạn một câu hỏi dựa trên mâu thuẫn có thật giữa hai mục tiêu của họ.',
    evidence:
      'Hiện vật ở đây là bảng quyết định nhận việc và sổ ghi sau phỏng vấn — hai thứ hầu như không ai làm và chúng thay đổi hẳn chất lượng lựa chọn nghề nghiệp của bạn. Bảng quyết định gồm các tiêu chí bạn thật sự quan tâm kèm trọng số, được điền bằng dữ liệu thu thập từ chính các câu hỏi ngược, cho phép bạn so ba lời mời một cách có căn cứ thay vì theo cảm giác của buổi gặp cuối cùng. Sổ ghi giúp bạn phát hiện những mâu thuẫn giữa các nguồn trong cùng một tổ chức. Ngoài ra, chính năng lực đặt câu hỏi tốt là thứ bạn có thể dùng làm bằng chứng ở chiều ngược lại: nếu sau này bạn tuyển người, bộ câu hỏi có cấu trúc mà bạn tự xây là một hiện vật quản lý đáng đưa ra.',
    references: [
      { label: 'Right Question Institute — phương pháp xây dựng câu hỏi tốt', url: 'https://rightquestion.org/', type: 'article' },
      { label: 'TED — chuyên mục Work', url: 'https://www.ted.com/topics/work', type: 'video' },
    ],
  }),

  // ── Chương 15 · Đàm phán lương ────────────────────────────────────────────
  guide({
    thesis:
      'Đàm phán lương không phải một cuộc đối đầu mà là một cuộc trao đổi thông tin để tìm điểm mà cả hai bên còn thấy hợp lý. Bạn không thắng bằng cách đòi cao, bạn thắng bằng cách có thông tin tốt hơn: bạn biết khoảng thị trường, bạn biết giá trị mình mang lại được diễn đạt bằng bằng chứng, và bạn biết mức thấp nhất mình sẽ từ chối. Cần nói rõ ngay: mọi con số trong chương này chỉ là con số minh họa trong một tình huống cụ thể, không phải chuẩn mực. Mức lương và biên độ thương lượng khác nhau rất lớn theo quốc gia, ngành, quy mô công ty, giai đoạn thị trường và cả chính sách nội bộ, nên hãy tra dữ liệu cho đúng thị trường của bạn tại thời điểm bạn đang đàm phán thay vì áp dụng bất kỳ tỷ lệ phần trăm nào nghe được ở đâu đó.',
    why: {
      work:
        'Mức lương khởi điểm thường là gốc để tính các lần tăng sau, nên chênh lệch ở lần đàm phán đầu tiên có xu hướng kéo dài. Nhưng cũng vì thế, đàm phán không nên đánh đổi bằng quan hệ với người quản lý tương lai — bạn sẽ làm việc với họ ngay tuần sau.',
      interview:
        'Cách bạn đàm phán là mẫu thử cho cách bạn sẽ đàm phán với khách hàng, nhà cung cấp và các phòng ban khác. Người tuyển quan sát điều đó, đặc biệt với các vị trí có yếu tố thương lượng.',
      study:
        'Chuẩn bị cho đàm phán buộc bạn định lượng giá trị công việc của mình — một bài tập khó và hữu ích, và cũng là nền cho mọi lần đề nghị tăng lương sau này.',
      life:
        'Cùng cấu trúc dùng cho mọi thương lượng có tiền: hợp đồng thuê nhà, giá dịch vụ, phân chia trách nhiệm tài chính trong gia đình. Điểm chung là chuẩn bị thông tin trước, và biết trước điểm mình sẽ dừng.',
    },
    framework: [
      {
        name: 'Thu thập ba nguồn dữ liệu thị trường',
        detail:
          'Báo cáo lương của các công ty tuyển dụng trong đúng thị trường và năm hiện tại, các tin tuyển có công bố khoảng lương cho vị trí tương đương, và trao đổi riêng với vài người trong ngành. Một nguồn duy nhất dễ lệch; ba nguồn cho bạn một khoảng thay vì một con số.',
      },
      {
        name: 'Định lượng giá trị bạn mang lại',
        detail:
          'Viết ba đến năm điểm bạn tạo ra giá trị đo được, gắn với bài toán của chính nơi đó. Đây là phần bạn kiểm soát hoàn toàn và nó chuyển cuộc trò chuyện từ "tôi muốn nhiều hơn" sang "đây là cơ sở cho con số này".',
      },
      {
        name: 'Xác định ba mốc trước khi nói chuyện',
        detail:
          'Mốc mong muốn, mốc chấp nhận được, và mốc từ chối. Mốc từ chối phải được xác định khi bạn còn bình tĩnh, vì trong cuộc trò chuyện thật thì áp lực và cảm giác ngại làm người ta xê dịch nó rất nhanh.',
      },
      {
        name: 'Để bên kia nêu số trước nếu có thể',
        detail:
          'Khi được hỏi mong muốn của bạn, một cách trả lời thường dùng là đề nghị họ chia sẻ khoảng ngân sách của vị trí trước, kèm lý do hợp lý là để chắc hai bên cùng hướng. Nếu buộc phải nêu, hãy nêu một khoảng dựa trên dữ liệu thị trường thay vì một con số đơn lẻ.',
      },
      {
        name: 'Đàm phán trọn gói, không chỉ lương cứng',
        detail:
          'Khi lương cứng bị chặn bởi khung nội bộ, các thành phần khác vẫn có thể thương lượng tùy nơi: thưởng ký hợp đồng, thời điểm xem xét tăng lương sớm hơn, ngân sách đào tạo, số ngày nghỉ, thiết bị, hoặc chức danh. Hỏi rõ thành phần nào có biên độ thay vì đoán.',
      },
    ],
    scenario:
      'Quyên có ba năm làm phân tích dữ liệu marketing, nhận lời mời từ một công ty bán lẻ với mức đề nghị bằng đúng mức bạn đang nhận. Thay vì trả lời ngay, bạn xin hai ngày để cân nhắc — một việc gần như luôn được chấp nhận. Bạn thu thập dữ liệu từ ba nguồn: hai báo cáo lương công bố trong năm cho vị trí tương đương ở cùng thành phố, sáu tin tuyển có công bố khoảng lương, và ba người quen trong ngành sẵn lòng nói về khoảng chứ không nói con số chính xác. Ba nguồn cho ra một khoảng, và mức đề nghị nằm ở nửa dưới của khoảng đó. Bạn viết ra bốn điểm giá trị gắn với bài toán của chính họ, trong đó có việc bạn đã tự động hóa báo cáo hiệu quả chiến dịch hằng tuần ở công ty cũ, giúp nhóm marketing bốn người khỏi mất khoảng một ngày công mỗi tuần cho việc gom số liệu thủ công — đúng thứ mà trong phỏng vấn họ đã than là đang tốn thời gian. Bạn đặt ba mốc: mong muốn, chấp nhận được, và mức bạn sẽ từ chối vì không bù được chi phí đổi việc. Cuộc trao đổi diễn ra trong mười phút: bạn cảm ơn lời mời, nói rõ bạn muốn nhận, nêu khoảng thị trường bạn tra được kèm tên nguồn, nêu bốn điểm giá trị, rồi đề nghị một con số cụ thể ở khoảng giữa. Bên tuyển trả lời rằng khung lương cứng của bậc này đã chạm trần và họ không thể vượt, nhưng có thể bổ sung hai thứ: một khoản thưởng ký hợp đồng, và một kỳ xem xét lương sau sáu tháng thay vì mười hai tháng với tiêu chí được ghi rõ trong thư mời. Quyên chấp nhận và yêu cầu ghi cả hai vào văn bản. Điều đáng chú ý: phần thắng thật không nằm ở khoản thưởng mà ở kỳ xem xét sớm kèm tiêu chí rõ, vì nó biến một lời hứa miệng thành một điều khoản đo được. Cần lưu ý rằng kết quả này phụ thuộc vào chính sách của nơi đó và không phải nơi nào cũng có biên độ tương tự.',
    comparison: [
      {
        weak: 'Nêu con số dựa trên nhu cầu chi tiêu cá nhân: "em cần mức này vì em đang trả góp nhà".',
        mature:
          'Nêu con số dựa trên dữ liệu thị trường và giá trị đo được bạn mang lại, vì đó là hai cơ sở mà bên kia có thể trình bày lại với cấp trên của họ.',
      },
      {
        weak: 'Chấp nhận ngay lời mời đầu tiên vì sợ nếu thương lượng thì họ rút lại lời mời.',
        mature:
          'Xin thời gian cân nhắc, chuẩn bị rồi trao đổi một lần với thái độ hợp tác — việc rút lại lời mời chỉ vì ứng viên thương lượng lịch sự là rất hiếm, và nếu xảy ra thì đó cũng là thông tin quan trọng về nơi đó.',
      },
      {
        weak: 'Chỉ tập trung vào lương cứng và bỏ qua mọi thành phần khác của gói đãi ngộ.',
        mature:
          'Hỏi rõ những thành phần nào còn biên độ, và cân nhắc cả kỳ xem xét lương sớm có tiêu chí rõ ràng, thứ thường có giá trị dài hạn cao hơn một khoản thưởng một lần.',
      },
      {
        weak: 'Đàm phán bằng cách so sánh với một lời mời khác mà bạn không thật sự có.',
        mature:
          'Chỉ nêu lời mời khác khi nó có thật và bạn sẵn sàng nhận nó; nói dối ở giai đoạn này là rủi ro không tương xứng và thường bị phát hiện qua chi tiết.',
      },
    ],
    mistakes: [
      'Nêu con số quá sớm khi chưa có dữ liệu thị trường, thường là ở vòng sàng lọc đầu tiên. Nếu bị hỏi sớm, có thể trả lời rằng bạn muốn hiểu rõ phạm vi công việc trước và đề nghị họ chia sẻ khoảng ngân sách của vị trí. Lưu ý rằng ở một số nơi, quy định pháp luật buộc bên tuyển phải công bố khoảng lương hoặc cấm hỏi lương hiện tại của ứng viên, và quy định này khác nhau theo quốc gia và thay đổi theo thời gian.',
      'Đàm phán qua nhiều vòng nhỏ lẻ, đòi thêm từng thứ một sau mỗi lần bên kia nhượng bộ. Cách này bào mòn thiện chí rất nhanh. Hãy gom mọi đề nghị vào một lần, nói rõ nếu đáp ứng được thì bạn nhận việc.',
      'Coi mọi thứ được hứa miệng là chắc chắn. Kỳ xem xét lương sớm, chức danh, ngân sách đào tạo hay điều kiện làm việc từ xa nên được ghi vào thư mời hoặc hợp đồng. Người hứa có thể chuyển việc, và bạn sẽ ở lại với một điều khoản không tồn tại trên giấy.',
    ],
    worksheet: [
      'Ba nguồn dữ liệu thị trường bạn đã tra là gì, chúng thuộc năm nào và có đúng thành phố cùng quy mô công ty bạn đang xét không?',
      'Bốn điểm giá trị bạn mang lại, diễn đạt bằng con số hoặc quy mô, gắn với bài toán cụ thể của nơi này là gì?',
      'Mốc mong muốn, mốc chấp nhận được và mốc từ chối của bạn là bao nhiêu? Bạn đã tính chi phí của việc đổi việc chưa?',
      'Ngoài lương cứng, ba thành phần nào trong gói đãi ngộ có giá trị thật với bạn, xếp theo thứ tự ưu tiên?',
      'Nếu họ nói khung lương đã chạm trần, câu tiếp theo của bạn là gì, và bạn sẽ đề nghị ghi những gì vào văn bản?',
    ],
    exercises: [
      {
        label: 'Bảng ba nguồn',
        text: 'Lập bảng dữ liệu lương cho vị trí bạn nhắm từ ba loại nguồn khác nhau, ghi rõ năm công bố, thành phố và quy mô công ty của từng nguồn. Kết luận bằng một khoảng chứ không phải một con số, và ghi rõ độ tin cậy của từng nguồn.',
        level: 'e',
      },
      {
        label: 'Bốn điểm giá trị',
        text: 'Viết bốn câu về giá trị bạn tạo ra, mỗi câu có con số hoặc quy mô và gắn với một bài toán cụ thể của nơi bạn ứng tuyển. Đọc to và bấm giờ, mục tiêu là trình bày cả bốn trong dưới chín mươi giây.',
        level: 'e',
      },
      {
        label: 'Ba mốc viết ra giấy',
        text: 'Viết ra mốc mong muốn, mốc chấp nhận được và mốc từ chối, kèm lý do cho từng mốc và chi phí thật của việc đổi việc. Ký tên và ghi ngày, để khi cuộc trò chuyện diễn ra bạn có một điểm neo được lập lúc còn bình tĩnh.',
        level: 'e',
      },
      {
        label: 'Kịch bản câu hỏi lương sớm',
        text: 'Soạn và luyện nói ba phiên bản câu trả lời khi bị hỏi mong muốn lương ngay ở vòng đầu: một phiên bản đề nghị họ nêu khoảng trước, một phiên bản nêu khoảng dựa trên dữ liệu, và một phiên bản dùng khi họ khăng khăng đòi con số cụ thể.',
        level: 'm',
      },
      {
        label: 'Diễn tập với người phản đối',
        text: 'Nhờ một người đóng vai bên tuyển và từ chối đề nghị của bạn hai lần với hai lý do khác nhau. Luyện giữ giọng hợp tác, không xin lỗi, và mỗi lần đưa ra một hướng thay thế thay vì rút lui hoặc lặp lại nguyên đề nghị cũ.',
        level: 'm',
      },
      {
        label: 'Danh sách thành phần ngoài lương',
        text: 'Liệt kê tám thành phần ngoài lương cứng và tự chấm giá trị thật của từng thứ với hoàn cảnh hiện tại của bạn. Chọn ba thứ bạn sẽ đề nghị nếu lương cứng bị chặn, và viết sẵn cách diễn đạt cho từng thứ.',
        level: 'm',
      },
      {
        label: 'Đàm phán thật có ghi chép',
        text: 'Thực hiện một cuộc đàm phán thật cho lời mời hoặc cho kỳ xem xét lương ở công ty hiện tại. Trước cuộc trò chuyện viết ra kịch bản mở đầu, trong lúc trao đổi ghi lại các con số và cam kết, và sau đó gửi một email tóm tắt lại những gì đã thống nhất.',
        level: 'h',
      },
      {
        label: 'Rà soát thư mời từng dòng',
        text: 'Lấy một thư mời làm việc thật hoặc mẫu, đọc từng dòng và đánh dấu mọi điều đã được hứa miệng nhưng không có trong văn bản, mọi điều khoản mơ hồ về thưởng và về điều kiện làm việc. Soạn danh sách câu hỏi làm rõ và gửi trước khi ký. Với các điều khoản có yếu tố pháp lý như thời gian thử việc, cam kết không cạnh tranh hay bồi hoàn chi phí đào tạo, hãy tra quy định lao động hiện hành ở nơi bạn làm việc hoặc hỏi người có chuyên môn pháp lý.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Có rủi ro bị rút lại lời mời nếu bạn thương lượng không?',
        a: 'Rủi ro tồn tại nhưng thấp khi bạn thương lượng một lần, có dữ liệu, giữ giọng hợp tác và nói rõ bạn muốn nhận việc. Điều làm tăng rủi ro là thái độ ra tối hậu thư, đòi thêm nhiều vòng liên tiếp, hoặc nêu con số cao hơn hẳn khoảng thị trường mà không có cơ sở. Nếu một nơi rút lời mời chỉ vì bạn hỏi lịch sự về khoảng lương, đó là thông tin đáng giá về cách họ đối xử với nhân viên sau này.',
      },
      {
        q: 'Bên tuyển nói khung lương của bậc này đã chạm trần. Còn gì để thương lượng?',
        a: 'Hỏi rõ thành phần nào còn biên độ thay vì tự đoán. Những hướng thường có: thưởng ký hợp đồng, kỳ xem xét lương sớm hơn kèm tiêu chí được ghi rõ, ngân sách đào tạo hoặc chứng chỉ, số ngày nghỉ, điều kiện làm việc linh hoạt, thiết bị, hoặc xét lại bậc và chức danh nếu phạm vi công việc thực tế rộng hơn mô tả. Mức độ khả thi của từng hướng phụ thuộc hoàn toàn vào chính sách nội bộ nơi đó, nên câu hỏi đúng là hỏi họ đâu là chỗ còn linh hoạt.',
      },
      {
        q: 'Vì sao không nên đưa ra con số dựa trên nhu cầu chi tiêu của mình?',
        a: 'Vì nó không phải cơ sở mà người đối diện có thể dùng để xin duyệt với cấp trên của họ. Bên tuyển cần một lập luận về giá trị công việc và mặt bằng thị trường để trình bày lại trong nội bộ. Nhu cầu cá nhân của bạn hoàn toàn chính đáng và nên dùng để xác định mốc từ chối của riêng bạn, nhưng nó thuộc về phần chuẩn bị nội bộ, không thuộc về phần lập luận bạn đưa ra bàn.',
      },
    ],
    plan7:
      'Ngày 1: tra dữ liệu lương từ ba loại nguồn cho đúng thị trường, thành phố và năm hiện tại. Ngày 2: viết bốn điểm giá trị có số, gắn với bài toán của nơi bạn nhắm. Ngày 3: xác định ba mốc và tính chi phí thật của việc đổi việc. Ngày 4: soạn ba phiên bản trả lời khi bị hỏi lương sớm và luyện nói. Ngày 5: lập danh sách tám thành phần ngoài lương và chọn ba thứ ưu tiên. Ngày 6: diễn tập với một người đóng vai bên tuyển từ chối hai lần. Ngày 7: soạn email tóm tắt mẫu để gửi sau khi thống nhất, và danh sách điều khoản cần có trong văn bản.',
    evidence:
      'Bằng chứng ở đây có hai lớp. Lớp thứ nhất phục vụ chính cuộc đàm phán: một trang gồm bảng dữ liệu thị trường có ghi nguồn và bốn điểm giá trị có số — tài liệu này bạn không đưa cho họ, nhưng nó giữ cho bạn nói đúng trọng tâm dưới áp lực. Lớp thứ hai là hồ sơ đóng góp bạn tích lũy liên tục trong công việc: mỗi quý ghi lại việc đã hoàn thành, con số trước và sau, và ai được lợi. Chính hồ sơ này là cơ sở cho mọi lần đề nghị tăng lương nội bộ, vốn diễn ra thường xuyên hơn nhiều so với đàm phán khi đổi việc. Cần nhắc lại rằng chương này cung cấp phương pháp chuẩn bị chứ không cung cấp tư vấn tài chính hay pháp lý; các điều khoản hợp đồng có yếu tố pháp lý cần được tra theo quy định hiện hành nơi bạn làm việc hoặc hỏi người có chuyên môn.',
    references: [
      { label: 'Program on Negotiation, Harvard Law School — tài nguyên về đàm phán', url: 'https://www.pon.harvard.edu/', type: 'article' },
      { label: 'Glassdoor — dữ liệu lương và đánh giá công ty do người dùng đóng góp', url: 'https://www.glassdoor.com/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 16 · Bắt đầu công việc mới ─────────────────────────────────────
  guide({
    thesis:
      'Chín mươi ngày đầu ở một nơi mới quyết định phần lớn cách bạn được nhìn nhận trong hai năm tiếp theo, và nghịch lý là bạn phải xây uy tín trong lúc còn hiểu biết ít nhất. Cách giải quyết không phải làm thật nhiều thật nhanh, mà là tách rõ ba giai đoạn: học và đo trước, chọn một chiến thắng nhỏ có thật, rồi mới đề xuất thay đổi lớn. Sai lầm phổ biến nhất của người có năng lực là mang nguyên cách làm ở chỗ cũ sang áp dụng trong tháng đầu, vì cách đó đã hiệu quả — mà quên rằng nó hiệu quả trong một hệ thống khác, với những người khác và những ràng buộc khác.',
    why: {
      work:
        'Ấn tượng hình thành trong tháng đầu rất bền và tốn nhiều công để sửa. Người bắt đầu tốt được giao việc quan trọng sớm hơn, và việc quan trọng lại tạo ra bằng chứng cho lần đánh giá đầu tiên.',
      interview:
        'Chính vì thế mà kế hoạch chín mươi ngày là câu hỏi thường gặp ở vòng cuối. Trả lời được câu này bằng một kế hoạch có giai đoạn cho thấy bạn hiểu rằng vào việc là một quá trình chứ không phải một sự kiện.',
      study:
        'Giai đoạn đầu ở nơi mới là bài tập học nhanh có áp lực thật: bạn phải xây bản đồ hệ thống, thuật ngữ nội bộ và mạng lưới quan hệ trong vài tuần, và cách bạn tổ chức việc học đó quyết định tốc độ.',
      life:
        'Cùng cấu trúc dùng khi bạn gia nhập bất kỳ nhóm mới nào: chuyển nhà tới khu phố mới, tham gia một câu lạc bộ, hay bước vào một gia đình mới. Nghe trước, hiểu quy tắc ngầm, rồi mới góp ý.',
    },
    framework: [
      {
        name: 'Ba mươi ngày đầu: nghe và vẽ bản đồ',
        detail:
          'Gặp riêng mọi người bạn sẽ làm việc cùng, hỏi cùng một bộ câu hỏi, và vẽ ba bản đồ: bản đồ quy trình thật (khác với quy trình trên giấy), bản đồ ai quyết định cái gì, và bản đồ những vấn đề mọi người đều nhắc tới. Chưa đề xuất thay đổi lớn nào trong giai đoạn này.',
      },
      {
        name: 'Chốt kỳ vọng bằng văn bản với quản lý',
        detail:
          'Trong hai tuần đầu, xin một cuộc trao đổi để chốt ba điều: thành công sau chín mươi ngày trông như thế nào, ba ưu tiên theo thứ tự, và cách bạn nên báo cáo. Sau đó gửi lại bằng văn bản để hai bên cùng nhìn một bản. Rất nhiều hiểu lầm về sau bắt nguồn từ việc không có bước này.',
      },
      {
        name: 'Chọn một chiến thắng nhỏ ở tuần thứ tư tới thứ tám',
        detail:
          'Tìm một việc nhỏ, có ích rõ ràng, nằm trong tầm kiểm soát của bạn và hoàn thành được trong vài tuần — thường là một việc mà mọi người đều khó chịu nhưng chưa ai có thời gian sửa. Mục tiêu là tạo bằng chứng rằng bạn làm được việc, không phải gây ấn tượng bằng quy mô.',
      },
      {
        name: 'Học ngôn ngữ nội bộ và quy tắc ngầm',
        detail:
          'Ghi lại từ viết tắt, tên hệ thống, cách gọi các quy trình, và cả các quy tắc không ai viết ra: ai cần được hỏi ý trước, cuộc họp nào là nơi ra quyết định thật, kênh nào dùng cho việc gấp. Không biết những thứ này khiến người giỏi trông như người vụng.',
      },
      {
        name: 'Đề xuất thay đổi sau ngày thứ sáu mươi, kèm dữ liệu',
        detail:
          'Khi đã có bản đồ và một chiến thắng nhỏ, hãy đề xuất thay đổi lớn hơn dựa trên dữ liệu bạn đã đo trong hai tháng đầu, và trình bày nó như một giả thuyết cần kiểm chứng chứ không như một kết luận. Trình tự này gần như luôn được đón nhận tốt hơn.',
      },
    ],
    scenario:
      'Hùng vào làm chuyên viên phân tích tài chính cho một công ty bảo hiểm sau bốn năm ở một công ty chứng khoán. Ở tuần thứ hai, bạn phát hiện quy trình lập báo cáo dự phòng hằng tháng đang được làm thủ công qua nhiều bảng tính nối nhau, và theo kinh nghiệm cũ thì việc này có thể rút ngắn đáng kể. Phản xạ tự nhiên là đề xuất ngay một cách làm mới trong cuộc họp phòng. Bạn kìm lại và làm theo trình tự. Trong ba mươi ngày, bạn gặp riêng chín người, hỏi mỗi người cùng ba câu: quy trình này thực tế chạy thế nào, chỗ nào hay sai nhất, và đã có ai từng thử sửa chưa. Câu thứ ba cho ra thông tin quan trọng nhất: hai năm trước đã có một người thử tự động hóa và bị dừng lại vì bộ phận kiểm soát nội bộ yêu cầu mọi bước tính toán phải có dấu vết kiểm tra được, mà công cụ khi đó không đáp ứng. Nếu bạn đề xuất ngay ở tuần thứ hai, bạn đã lặp lại đúng thất bại đó và mất uy tín. Ở tuần thứ ba, bạn chốt kỳ vọng bằng văn bản với trưởng phòng và biết rằng ưu tiên số một của quý này thực ra không phải báo cáo dự phòng mà là chuẩn bị số liệu cho một đợt rà soát của cơ quan quản lý. Bạn chọn chiến thắng nhỏ ở tuần thứ năm: dựng một bảng đối chiếu tự động cho phần số liệu phục vụ đợt rà soát, thứ nằm gọn trong phạm vi bạn phụ trách và có ích ngay. Đến ngày thứ bảy mươi, bạn quay lại bài toán báo cáo dự phòng, nhưng lần này với một đề xuất khác hẳn: giữ nguyên cách tính, chỉ thay đổi cách ghi lại dấu vết từng bước để đáp ứng yêu cầu kiểm soát, và đề nghị chạy song song hai tháng trước khi chuyển hẳn. Đề xuất được duyệt.',
    comparison: [
      {
        weak: 'Mang nguyên cách làm ở công ty cũ sang áp dụng trong tháng đầu vì nó đã chứng minh là hiệu quả.',
        mature:
          'Tìm hiểu vì sao nơi này lại làm khác, đặc biệt là hỏi xem đã có ai thử cách của bạn chưa và kết quả ra sao, trước khi đề xuất bất cứ điều gì.',
      },
      {
        weak: 'Chờ được giao việc và làm tốt việc được giao, tin rằng như vậy là đủ cho ba tháng đầu.',
        mature:
          'Chủ động chốt kỳ vọng bằng văn bản, tự vẽ bản đồ hệ thống và tìm một chiến thắng nhỏ, vì người mới hoàn toàn thụ động thường bị đánh giá là chưa hòa nhập dù không làm sai gì.',
      },
      {
        weak: 'Ghi nhớ mọi thứ trong đầu và hỏi lại nhiều lần cùng một câu vì không ghi chép.',
        mature:
          'Duy trì một tài liệu nhận việc của riêng mình gồm thuật ngữ, sơ đồ hệ thống, ai làm gì, và các câu hỏi chưa được trả lời — tài liệu này về sau thành tài liệu cho người mới tiếp theo.',
      },
    ],
    mistakes: [
      'Chê cách làm hiện tại trong những tuần đầu, kể cả khi nhận xét đúng. Người đang làm theo cách đó vẫn ở đây và thường có lý do bạn chưa biết; phê bình sớm khiến bạn mất chính những người sẽ giúp bạn hiểu hệ thống.',
      'Chỉ xây quan hệ trong phòng ban của mình và bỏ qua các phòng ban phối hợp. Phần lớn ma sát trong công việc thật nằm ở ranh giới giữa các bộ phận, và người mới không có ai quen bên kia sẽ mất rất nhiều thời gian cho những việc lẽ ra một tin nhắn là xong.',
      'Không hỏi lại khi không hiểu, vì sợ trông thiếu năng lực trong tháng đầu. Đây là giai đoạn duy nhất bạn được phép hỏi mọi thứ mà không ai lấy làm lạ; bỏ lỡ cửa sổ đó thì sáu tháng sau việc hỏi mới thật sự khó xử.',
    ],
    worksheet: [
      'Trong ba mươi ngày đầu, bạn sẽ gặp riêng những ai, và ba câu hỏi bạn hỏi mọi người là gì?',
      'Bạn đã chốt bằng văn bản với quản lý về ba ưu tiên và định nghĩa thành công sau chín mươi ngày chưa? Nếu chưa, bao giờ bạn sẽ xin cuộc trao đổi đó?',
      'Chiến thắng nhỏ bạn nhắm tới là gì, nó nằm trong tầm kiểm soát của bạn tới mức nào, và ai sẽ được lợi rõ ràng từ nó?',
      'Liệt kê mười từ viết tắt hoặc tên hệ thống nội bộ bạn đã nghe nhưng chưa hiểu. Bạn sẽ hỏi ai và bao giờ?',
      'Quy tắc ngầm nào bạn đã nhận ra ở nơi này — ai cần được hỏi ý trước, cuộc họp nào là nơi quyết định thật, kênh nào dùng cho việc gấp?',
    ],
    exercises: [
      {
        label: 'Bộ ba câu hỏi gặp riêng',
        text: 'Soạn ba câu hỏi bạn sẽ hỏi mọi người trong các cuộc gặp riêng tháng đầu, ví dụ về cách công việc thật sự chạy, chỗ hay trục trặc nhất, và điều họ ước người mới biết sớm hơn. Dùng đúng bộ câu này cho mọi người để so sánh được câu trả lời.',
        level: 'e',
      },
      {
        label: 'Từ điển nội bộ',
        text: 'Mở một tài liệu và ghi mọi từ viết tắt, tên hệ thống, tên quy trình bạn nghe được, kèm định nghĩa khi đã hỏi ra. Đặt mục tiêu ba mươi mục trong tháng đầu và đánh dấu những mục vẫn chưa hiểu để hỏi tiếp.',
        level: 'e',
      },
      {
        label: 'Bản đồ ai quyết định gì',
        text: 'Vẽ sơ đồ các loại quyết định thường gặp trong công việc của bạn và ghi ai là người quyết cuối cùng, ai cần được hỏi ý trước, ai chỉ cần được thông báo. Kiểm lại bản đồ này với quản lý của bạn sau ba tuần.',
        level: 'e',
      },
      {
        label: 'Văn bản chốt kỳ vọng',
        text: 'Sau cuộc trao đổi với quản lý, soạn một trang gồm ba ưu tiên theo thứ tự, định nghĩa thành công sau chín mươi ngày, cách báo cáo và những gì bạn cần được hỗ trợ. Gửi lại và xin xác nhận, sau đó xem lại trang này mỗi tháng.',
        level: 'm',
      },
      {
        label: 'Săn chiến thắng nhỏ',
        text: 'Liệt kê năm việc nhỏ mà nhiều người đều thấy khó chịu nhưng chưa ai sửa, chấm mỗi việc theo hai tiêu chí: nằm trong tầm kiểm soát của bạn và hoàn thành được dưới bốn tuần. Chọn một và hoàn thành, sau đó đo tác động bằng một con số.',
        level: 'm',
      },
      {
        label: 'Gặp mười người ngoài phòng ban',
        text: 'Trong sáu tuần, hẹn mười lăm phút với mười người ở các bộ phận phối hợp với bạn. Hỏi họ công việc của bạn ảnh hưởng tới họ ở điểm nào và điều gì từ phía bạn hay gây khó cho họ. Ghi lại và điều chỉnh cách làm việc theo phản hồi.',
        level: 'm',
      },
      {
        label: 'Báo cáo ba mươi ngày',
        text: 'Viết một trang gửi quản lý sau ba mươi ngày: những gì bạn đã học được về hệ thống, ba quan sát về chỗ có thể cải thiện kèm dữ liệu ban đầu, và những gì bạn dự định làm trong ba mươi ngày tới. Trình bày quan sát dưới dạng giả thuyết cần kiểm chứng.',
        level: 'h',
      },
      {
        label: 'Đề xuất sau ngày thứ sáu mươi',
        text: 'Chọn một vấn đề bạn đã đo trong hai tháng đầu và viết một đề xuất thay đổi gồm dữ liệu quan sát, nguyên nhân giả định, hai phương án, rủi ro, và kế hoạch chạy thử có thể đảo ngược. Hỏi ý ít nhất hai người liên quan trước khi trình bày chính thức.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Bạn thấy ngay một cách làm rõ ràng kém hiệu quả trong tuần đầu tiên. Nên làm gì?',
        a: 'Ghi lại, đặt câu hỏi để tìm hiểu, nhưng chưa đề xuất thay đổi. Câu hỏi hiệu quả nhất là hỏi xem đã có ai từng thử cách khác chưa và kết quả ra sao — nó thường lộ ra ràng buộc mà bạn chưa nhìn thấy, chẳng hạn yêu cầu kiểm soát, một sự cố trong quá khứ, hoặc một thỏa thuận với phòng ban khác. Nếu sau khi tìm hiểu mà vấn đề vẫn còn, bạn sẽ có một đề xuất mạnh hơn nhiều vào ngày thứ sáu mươi.',
      },
      {
        q: 'Vì sao nên chốt kỳ vọng bằng văn bản thay vì chỉ nói miệng?',
        a: 'Vì hai người rời cùng một cuộc trò chuyện với hai bản ghi nhớ khác nhau là chuyện rất thường, và khoảng cách đó chỉ lộ ra ở kỳ đánh giá đầu tiên, khi đã quá muộn để điều chỉnh. Một trang văn bản gửi lại sau cuộc trao đổi buộc cả hai phải nhìn cùng một bản, cho phép quản lý sửa những chỗ bạn hiểu lệch ngay lúc đó, và cho bạn một điểm neo để rà lại hằng tháng. Nó cũng là hiện vật rất hữu ích khi có thay đổi nhân sự cấp trên giữa chừng.',
      },
      {
        q: 'Chiến thắng nhỏ nên chọn theo tiêu chí nào?',
        a: 'Ba tiêu chí đồng thời: nằm trong tầm kiểm soát của bạn để không phụ thuộc vào người khác duyệt, có ích rõ ràng với người bạn làm việc cùng chứ không chỉ với riêng bạn, và hoàn thành được trong khoảng bốn tuần. Nên tránh những việc quá lớn cần nhiều bên đồng thuận, vì rủi ro không hoàn thành cao và thất bại đầu tiên tốn nhiều uy tín hơn giá trị của thành công. Mục tiêu của giai đoạn này là tạo bằng chứng, không phải tạo dấu ấn.',
      },
    ],
    plan7:
      'Ngày 1: soạn bộ ba câu hỏi gặp riêng và lập danh sách người cần gặp trong tháng đầu. Ngày 2: mở từ điển nội bộ và ghi mọi thuật ngữ nghe được. Ngày 3: đặt lịch gặp riêng cho hai tuần tới, ưu tiên người bạn phối hợp nhiều nhất. Ngày 4: xin cuộc trao đổi chốt kỳ vọng với quản lý và chuẩn bị ba câu hỏi cho cuộc đó. Ngày 5: vẽ bản đồ ai quyết định gì dựa trên những gì đã nghe. Ngày 6: liệt kê năm ứng viên cho chiến thắng nhỏ và chấm theo hai tiêu chí. Ngày 7: soạn văn bản chốt kỳ vọng gửi quản lý và đặt lịch xem lại hằng tháng.',
    evidence:
      'Hiện vật quan trọng nhất của giai đoạn này là tài liệu nhận việc do chính bạn viết: từ điển nội bộ, sơ đồ hệ thống, bản đồ ai quyết định gì, và danh sách câu hỏi thường gặp. Đến tháng thứ ba, hãy dọn nó lại và tặng cho phòng làm tài liệu cho người mới tiếp theo — đây là một trong những cách rẻ nhất để tạo giá trị hữu hình trong chín mươi ngày đầu, và nó được nhớ rất lâu. Hiện vật thứ hai là văn bản chốt kỳ vọng cùng báo cáo ba mươi ngày, hai thứ trở thành nền cho kỳ đánh giá đầu tiên và cho hồ sơ đề nghị tăng lương sau này. Trong các buổi phỏng vấn tương lai, câu hỏi "bạn hòa nhập với môi trường mới thế nào" sẽ được trả lời bằng chính quy trình này thay vì bằng một tính từ.',
    references: [
      { label: 'Atlassian Team Playbook — các bài thực hành cho nhóm mới và cách làm việc chung', url: 'https://www.atlassian.com/team-playbook', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Managing yourself', url: 'https://hbr.org/topic/subject/managing-yourself', type: 'article' },
    ],
  }),
  // ── Chương 17 · Thăng tiến ────────────────────────────────────────────────
  guide({
    thesis:
      'Thăng tiến không phải phần thưởng cho việc làm tốt vai trò hiện tại, mà là quyết định về rủi ro: người ra quyết định đang tự hỏi liệu bạn có làm được vai trò tiếp theo hay không, và bằng chứng duy nhất họ tin được là bạn đã làm những phần của vai trò đó trước khi được bổ nhiệm. Đây là chỗ hầu hết mọi người hiểu ngược: họ cố làm thật xuất sắc việc hiện tại và chờ được ghi nhận, trong khi tổ chức lại đang tìm dấu hiệu của cấp độ kế tiếp. Người xuất sắc ở vai trò hiện tại đôi khi còn khó được thăng tiến hơn, vì thay họ ở chỗ đó quá tốn kém.',
    why: {
      work:
        'Hiểu đúng cơ chế giúp bạn đầu tư đúng chỗ: thay vì làm nhiều hơn cùng loại việc, bạn chủ động nhận những phần việc thuộc cấp độ trên và tạo bằng chứng cho chúng.',
      interview:
        'Nếu con đường trong công ty bị chặn, chính bộ bằng chứng về cấp độ trên là thứ giúp bạn ứng tuyển thẳng vào bậc cao hơn ở nơi khác — và đó thường là con đường nhanh hơn.',
      study:
        'Việc đọc kỹ tiêu chí của bậc trên và tự chấm mình theo từng tiêu chí là một dạng tự đánh giá có cấu trúc, chỉ ra chính xác kỹ năng nào cần học tiếp thay vì học theo cảm hứng.',
      life:
        'Nguyên tắc "thể hiện năng lực của vai trò kế tiếp trước khi được trao vai trò đó" cũng đúng ở mọi tổ chức tự nguyện, nơi không ai bổ nhiệm bạn nhưng người ta vẫn dựa vào bạn hoặc không.',
    },
    framework: [
      {
        name: 'Lấy tiêu chí thật của bậc trên',
        detail:
          'Xin khung năng lực hoặc bản mô tả của bậc kế tiếp; nếu công ty không có, hãy dùng mô tả tuyển dụng cho chính vị trí đó ở các công ty tương đương làm bản tham chiếu. Không có tiêu chí thì mọi nỗ lực đều là đoán.',
      },
      {
        name: 'Tự chấm và tìm ba khoảng trống',
        detail:
          'Chấm bản thân theo từng tiêu chí với bằng chứng cụ thể, không chấm theo cảm giác. Chọn ba khoảng trống lớn nhất, vì cố lấp mọi khoảng trống cùng lúc thường dẫn tới không lấp được cái nào.',
      },
      {
        name: 'Nhận việc của bậc trên trong phạm vi cho phép',
        detail:
          'Tìm những phần việc thuộc cấp độ trên mà bạn có thể nhận mà không cần bổ nhiệm: dẫn dắt một dự án nhỏ liên bộ phận, kèm người mới, chủ trì một cuộc họp định kỳ, đại diện phòng làm việc với đối tác. Đây là cách tạo bằng chứng duy nhất được chấp nhận.',
      },
      {
        name: 'Làm cho công việc được nhìn thấy',
        detail:
          'Báo cáo tiến độ theo nhịp cố định, ghi nhận công của người khác, và trình bày kết quả ở nơi có mặt người ra quyết định. Việc tốt không được nhìn thấy vẫn là việc tốt, nhưng nó không tạo ra dữ liệu cho quyết định thăng tiến.',
      },
      {
        name: 'Nói ra mong muốn và xin tiêu chí cụ thể',
        detail:
          'Nhiều người chờ được đề nghị. Hãy chủ động nói với quản lý rằng bạn nhắm bậc kế tiếp và hỏi thẳng: cần thấy những bằng chứng gì, trong bao lâu, và ai là người quyết định. Sau đó ghi lại bằng văn bản và rà theo nhịp quý.',
      },
    ],
    scenario:
      'Thảo làm chuyên viên mua hàng bốn năm ở một nhà máy dệt may khoảng tám trăm lao động, phụ trách nhóm nguyên phụ liệu. Bạn làm rất tốt phần việc của mình, hai năm liền được đánh giá vượt kỳ vọng, nhưng hai lần vị trí trưởng nhóm mua hàng trống đều được lấp bằng người từ nơi khác. Bạn xin gặp trưởng phòng và hỏi thẳng cần bằng chứng gì. Câu trả lời khá khó nghe nhưng hữu ích: mọi bằng chứng của bạn đều thuộc loại thực thi cá nhân xuất sắc, còn vai trò trưởng nhóm cần ba thứ bạn chưa từng thể hiện — điều phối khi có mâu thuẫn giữa mua hàng và kế hoạch sản xuất, làm việc với nhà cung cấp ở cấp thương lượng khung năm chứ không phải từng đơn, và phát triển người trong nhóm. Bạn chọn ba việc để tạo bằng chứng trong sáu tháng, tất cả đều nằm trong phạm vi được phép. Một, bạn xin đứng ra chủ trì cuộc họp đối chiếu hằng tuần giữa mua hàng và kế hoạch sản xuất, vốn thường xuyên căng thẳng; bạn đổi cách chạy họp bằng cách gửi trước bảng số liệu chênh lệch và chỉ dành họp cho phần cần quyết định, và ghi lại số lần phải họp thêm ngoài lịch trước và sau. Hai, bạn đề nghị được tham gia cùng trưởng phòng trong hai đợt đàm phán khung năm với nhà cung cấp lớn, ban đầu chỉ chuẩn bị dữ liệu, tới đợt thứ hai thì trực tiếp trình bày phần phân tích giá. Ba, bạn nhận kèm một nhân sự mới và viết một bộ tài liệu hướng dẫn quy trình mua hàng nội bộ, đo bằng thời gian để người mới xử lý được đơn độc lập. Sau bảy tháng, khi vị trí trưởng nhóm trống lần thứ ba, hồ sơ của bạn có ba loại bằng chứng đúng với ba khoảng trống đã được nêu tên. Bạn được bổ nhiệm. Điều cần nói thêm: không phải mọi trường hợp đều kết thúc như vậy — có những tổ chức đơn giản không còn chỗ, và khi đó chính bộ bằng chứng này là thứ bạn mang đi nơi khác.',
    comparison: [
      {
        weak: 'Làm việc hiện tại thật xuất sắc và chờ được ghi nhận, tin rằng kết quả sẽ tự nói lên tất cả.',
        mature:
          'Chủ động nhận những phần việc thuộc bậc kế tiếp và tạo bằng chứng cho chúng, vì quyết định thăng tiến dựa trên dự đoán về vai trò mới chứ không dựa trên thành tích ở vai trò cũ.',
      },
      {
        weak: 'Nêu mong muốn thăng tiến bằng thâm niên: "em đã làm ở đây bốn năm rồi".',
        mature:
          'Nêu bằng bằng chứng đối chiếu với tiêu chí bậc trên, và hỏi cụ thể còn thiếu gì để hai bên cùng nhìn vào một danh sách kiểm tra.',
      },
      {
        weak: 'Coi mọi lần không được thăng tiến là bất công và giữ ấm ức trong im lặng.',
        mature:
          'Hỏi thẳng lý do và xin ba bằng chứng cụ thể còn thiếu; nếu câu trả lời mơ hồ nhiều lần thì coi đó là dữ liệu để tính đường khác, thay vì tiếp tục chờ.',
      },
    ],
    mistakes: [
      'Nhận thêm rất nhiều việc cùng cấp độ với hy vọng khối lượng sẽ chứng minh năng lực. Kết quả thường là quá tải và chất lượng giảm, trong khi bằng chứng cho cấp độ trên vẫn bằng không.',
      'Xây bằng chứng nhưng không ai biết, vì bạn ngại nói về việc mình làm. Có một khoảng giữa khoe khoang và im lặng, và nó là báo cáo tiến độ định kỳ có số liệu, trong đó ghi nhận cả công của người khác.',
      'Chỉ xây quan hệ với quản lý trực tiếp, trong khi quyết định thăng tiến ở nhiều nơi là quyết định tập thể có sự tham gia của các trưởng bộ phận khác. Nếu không ai ngoài phòng bạn biết bạn làm gì, quản lý của bạn sẽ phải bảo vệ bạn một mình.',
    ],
    worksheet: [
      'Bạn có bản mô tả hoặc khung năng lực của bậc kế tiếp chưa? Nếu chưa, bạn sẽ lấy nó từ đâu trong tuần này?',
      'Tự chấm theo từng tiêu chí của bậc trên kèm bằng chứng cụ thể. Ba tiêu chí nào bạn không có bằng chứng nào cả?',
      'Có phần việc nào thuộc cấp độ trên mà bạn có thể nhận ngay mà không cần được bổ nhiệm? Liệt kê ba việc.',
      'Trong sáu tháng qua, những ai ngoài quản lý trực tiếp của bạn đã trực tiếp thấy kết quả công việc của bạn?',
      'Bạn đã nói rõ mong muốn thăng tiến với quản lý chưa, và bạn có văn bản nào ghi lại tiêu chí họ đưa ra không?',
    ],
    exercises: [
      {
        label: 'Tự chấm theo khung bậc trên',
        text: 'Lấy mô tả bậc kế tiếp, lập bảng từng tiêu chí và tự chấm ba mức: có bằng chứng mạnh, có bằng chứng yếu, chưa có gì. Với mỗi ô, ghi tên hiện vật hoặc sự việc cụ thể chứ không ghi nhận định chung.',
        level: 'e',
      },
      {
        label: 'Ba việc của bậc trên',
        text: 'Liệt kê mười phần việc mà người ở bậc trên bạn đang làm, khoanh ba việc bạn có thể nhận mà không cần bổ nhiệm, và viết một câu về cách bạn sẽ đề nghị được nhận từng việc.',
        level: 'e',
      },
      {
        label: 'Nhật ký đóng góp hằng tuần',
        text: 'Mỗi thứ Sáu, ghi ba dòng: việc đã hoàn thành, con số kèm theo, và ai được lợi. Duy trì mười hai tuần liên tục để có nguyên liệu thật cho kỳ đánh giá thay vì cố nhớ lại vào phút cuối.',
        level: 'e',
      },
      {
        label: 'Cuộc trao đổi về lộ trình',
        text: 'Xin một cuộc trao đổi ba mươi phút với quản lý, chỉ về lộ trình chứ không về việc hằng ngày. Chuẩn bị ba câu: cần thấy bằng chứng gì, trong khoảng thời gian nào, và ai tham gia quyết định. Gửi lại tóm tắt bằng văn bản sau đó.',
        level: 'm',
      },
      {
        label: 'Chủ trì một cuộc họp định kỳ',
        text: 'Đề nghị được chủ trì một cuộc họp định kỳ mà bạn thường chỉ tham dự. Thiết kế lại cách chạy họp, đo hai chỉ số trước và sau như thời lượng họp và số quyết định được chốt ngay trong họp, rồi báo cáo kết quả.',
        level: 'm',
      },
      {
        label: 'Mở rộng phạm vi người biết bạn',
        text: 'Chọn ba người ở các bộ phận khác có ảnh hưởng tới quyết định về nhân sự, và trong ba tháng tạo ra ít nhất một lần hợp tác thật với mỗi người. Không phải để gây ấn tượng, mà để họ có cơ sở thật khi được hỏi ý kiến về bạn.',
        level: 'm',
      },
      {
        label: 'Hồ sơ đề nghị thăng tiến',
        text: 'Soạn một hồ sơ ba trang: đối chiếu từng tiêu chí bậc trên với bằng chứng của bạn, ba kết quả nổi bật có số liệu, phản hồi từ người đã làm việc cùng, và kế hoạch chín mươi ngày đầu nếu được bổ nhiệm. Nhờ một người ở bậc đó đọc và phản biện trước khi nộp.',
        level: 'h',
      },
      {
        label: 'Kế hoạch dự phòng sáu tháng',
        text: 'Nếu sau hai kỳ đánh giá mà lộ trình vẫn không rõ, hãy lập kế hoạch song song: tiếp tục tạo bằng chứng ở nơi hiện tại, đồng thời khảo sát thị trường cho bậc bạn nhắm và trò chuyện với ba người ở bậc đó tại các công ty khác. Đặt một mốc thời gian để quyết định.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao làm xuất sắc vai trò hiện tại đôi khi lại không dẫn tới thăng tiến?',
        a: 'Vì quyết định thăng tiến là dự đoán về vai trò mới, mà vai trò mới thường đòi hỏi những năng lực khác chứ không phải nhiều hơn cùng loại. Một chuyên viên xuất sắc chứng minh được khả năng thực thi cá nhân, còn bậc trên thường cần bằng chứng về điều phối, ra quyết định trong bất định và phát triển người khác. Ngoài ra còn một lực cản thực tế: người làm rất tốt ở một vị trí khó thay thế đôi khi bị giữ lại chính vì điều đó, và cách xử lý là chủ động đào tạo người kế cận để việc thay thế không còn là rào cản.',
      },
      {
        q: 'Quản lý của bạn nói chung chung rằng "em cứ làm tốt rồi sẽ tới lượt". Nên phản ứng thế nào?',
        a: 'Đề nghị cụ thể hóa bằng một câu hỏi khó né: nếu hôm nay phải quyết định, ba bằng chứng nào còn thiếu ở em. Nếu vẫn nhận được câu trả lời mơ hồ sau hai lần hỏi cách nhau vài tháng, hãy coi đó là dữ liệu chứ không phải là sự trì hoãn tạm thời — có thể ngân sách không có, có thể không có chỗ, hoặc có thể họ không nhìn bạn ở bậc đó. Cả ba trường hợp đều dẫn tới cùng một kết luận thực dụng: tiếp tục xây bằng chứng, nhưng đồng thời mở thêm đường ra bên ngoài.',
      },
      {
        q: 'Làm sao để công việc được nhìn thấy mà không bị coi là khoe khoang?',
        a: 'Chuyển từ nói về bản thân sang nói về kết quả và về người khác. Cụ thể: báo cáo theo nhịp cố định thay vì báo cáo khi có thành tích, dùng số liệu thay vì tính từ, luôn nêu tên những người đã đóng góp, và trình bày cả phần chưa đạt cùng cách xử lý. Một bản cập nhật ngắn hằng tháng có cấu trúc như vậy hiếm khi bị đọc là khoe khoang, vì nó cung cấp thông tin mà người đọc thật sự cần để ra quyết định.',
      },
    ],
    plan7:
      'Ngày 1: lấy hoặc dựng bản mô tả bậc kế tiếp từ nguồn nội bộ hay từ tin tuyển bên ngoài. Ngày 2: tự chấm theo từng tiêu chí kèm bằng chứng, khoanh ba khoảng trống lớn nhất. Ngày 3: liệt kê mười phần việc của bậc trên và chọn ba việc có thể nhận ngay. Ngày 4: mở nhật ký đóng góp hằng tuần và ghi mục đầu tiên. Ngày 5: xin cuộc trao đổi về lộ trình với quản lý và chuẩn bị ba câu hỏi. Ngày 6: chọn ba người ngoài phòng ban để tạo hợp tác thật trong quý. Ngày 7: phác thảo khung hồ sơ đề nghị thăng tiến và đặt mốc rà lại sau mỗi quý.',
    evidence:
      'Hiện vật quyết định là hồ sơ đề nghị thăng tiến: một tài liệu đối chiếu từng tiêu chí của bậc trên với bằng chứng thật của bạn, có số liệu và có tên người xác nhận được. Nuôi hồ sơ này bằng nhật ký đóng góp hằng tuần thì tới kỳ đánh giá bạn không phải cố nhớ lại. Giá trị của nó không dừng ở nội bộ: nếu công ty không còn chỗ, chính hồ sơ đó là bộ hồ sơ ứng tuyển thẳng vào bậc cao hơn ở nơi khác, và trong phỏng vấn nó trả lời trực tiếp câu hỏi khó nhất mà người tuyển đặt ra với ứng viên đang nhảy bậc: bạn đã làm những phần nào của vai trò này rồi. Kèm theo hồ sơ, hãy giữ lại các tài liệu bạn xây cho tổ chức — quy trình, hướng dẫn, cấu trúc họp — vì chúng còn tồn tại sau khi bạn đi và là bằng chứng khách quan nhất.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Leadership development', url: 'https://hbr.org/topic/subject/leadership-development', type: 'article' },
      { label: 'Gallup Workplace — nghiên cứu về hiệu suất và phát triển nhân sự', url: 'https://www.gallup.com/workplace/', type: 'article' },
    ],
  }),

  // ── Chương 18 · Chuyển nghề ───────────────────────────────────────────────
  guide({
    thesis:
      'Chuyển nghề thành công hiếm khi là một cú nhảy, mà thường là một chuỗi bước bắc cầu trong đó mỗi bước bạn giữ lại một phần vốn cũ và đổi một phần mới. Người đổi cả ba biến cùng lúc — ngành, chức năng và cấp bậc — phải bắt đầu gần như từ đầu và tỷ lệ bỏ cuộc rất cao. Người đổi một biến mỗi lần thì mỗi bước đều có câu chuyện hợp lý để kể với nhà tuyển dụng. Song song với đó là một bài toán không lãng mạn nhưng quyết định: bạn cần bao nhiêu tháng chi phí sinh hoạt để chịu được giai đoạn thu nhập giảm, và bạn sẽ dừng lại ở đâu nếu sau khoảng thời gian đó vẫn chưa có kết quả.',
    why: {
      work:
        'Chuyển nghề có phương pháp giúp bạn không vứt bỏ vốn liếng cũ. Phần lớn năng lực bạn tích lũy được vẫn dùng được ở nghề mới nếu bạn biết diễn đạt lại chúng bằng ngôn ngữ của nghề đó.',
      interview:
        'Câu hỏi khó nhất với người chuyển nghề luôn là "vì sao lại đổi, và vì sao chúng tôi nên tin bạn sẽ trụ được". Câu trả lời tốt cần ba thành phần: một lý do hướng tới chứ không phải chạy trốn, bằng chứng đã thử thật, và nhận thức rõ về cái giá phải trả.',
      study:
        'Chuyển nghề là bài toán học tập có ràng buộc thời gian và tiền bạc, nên nó buộc bạn chọn học đúng thứ nhỏ nhất đủ để vào được cánh cửa đầu tiên, thay vì học đủ mọi thứ của nghề mới.',
      life:
        'Quyết định này ảnh hưởng tới cả gia đình. Đưa các con số ra bàn — thu nhập giảm bao lâu, quỹ dự phòng còn mấy tháng, ai gánh phần nào — thường làm giảm căng thẳng hơn nhiều so với việc giữ kín cho tới khi mọi thứ đã rồi.',
    },
    framework: [
      {
        name: 'Tách ba biến và đổi một biến mỗi lần',
        detail:
          'Ba biến là ngành, chức năng và cấp bậc. Xác định bạn đang muốn đổi biến nào và thiết kế bước đi giữ nguyên hai biến còn lại. Ví dụ giữ nguyên ngành và cấp bậc, chỉ đổi chức năng — bước này dễ được chấp nhận hơn nhiều.',
      },
      {
        name: 'Dịch lại vốn cũ sang ngôn ngữ nghề mới',
        detail:
          'Lập bảng hai cột: năng lực bạn có, và tên gọi tương đương ở nghề mới. Rất nhiều năng lực chỉ khác tên: quản lý lớp học là quản lý nhóm và thiết kế trải nghiệm học tập; xử lý phàn nàn của phụ huynh là quản trị bên liên quan.',
      },
      {
        name: 'Tạo bằng chứng nhỏ trước khi rời chỗ cũ',
        detail:
          'Tìm cách làm việc thật của nghề mới ngay trong bối cảnh hiện tại: nhận một phần việc thuộc chức năng đó, làm dự án ngoài giờ, hoặc tình nguyện cho một tổ chức. Bằng chứng tạo được khi còn có thu nhập là bằng chứng rẻ nhất.',
      },
      {
        name: 'Tính ngân sách chuyển đổi và mốc dừng',
        detail:
          'Tính rõ: chi phí sinh hoạt hằng tháng, số tháng quỹ dự phòng chịu được, mức thu nhập tối thiểu chấp nhận ở nghề mới, và mốc thời gian bạn sẽ đánh giá lại. Đây là quyết định tài chính cá nhân có rủi ro thật; với các khoản vay hoặc bảo hiểm đang ràng buộc, nên tham khảo người có chuyên môn tài chính trước khi quyết.',
      },
      {
        name: 'Xây câu chuyện chuyển nghề một phút',
        detail:
          'Một đoạn nối được ba phần: điều bạn mang từ nghề cũ, lý do bạn hướng tới nghề mới, và bằng chứng đã thử. Câu chuyện phải hướng tới chứ không phải chạy trốn — "em chán nghề cũ" là câu nói thật nhưng làm người tuyển lo bạn cũng sẽ chán nghề mới.',
      },
    ],
    scenario:
      'Nhung dạy tiểu học chín năm, muốn chuyển sang làm đào tạo nội bộ cho doanh nghiệp. Bạn định nghỉ việc để đi học một khóa sáu tháng, và may là bạn đã ngồi tính trước. Chi phí sinh hoạt gia đình cần một mức nhất định mỗi tháng, quỹ dự phòng chịu được khoảng năm tháng, và chồng bạn cũng đang trong giai đoạn thu nhập không ổn định — nghĩa là phương án nghỉ hẳn để học rất rủi ro. Bạn đổi cách tiếp cận. Trước hết bạn tách ba biến và nhận ra mình đang muốn đổi cả ngành lẫn chức năng cùng lúc, nên bạn thiết kế một bước trung gian: vẫn ở lĩnh vực giáo dục nhưng đổi từ dạy trẻ sang thiết kế và triển khai chương trình đào tạo cho người lớn. Bạn lập bảng dịch vốn cũ: chín năm thiết kế bài giảng thành thiết kế chương trình học có mục tiêu đầu ra; quản lý lớp ba mươi lăm học sinh thành điều phối nhóm học viên; chấm và phản hồi bài thành đánh giá kết quả học tập; làm việc với phụ huynh thành quản trị bên liên quan. Trong khi vẫn đi dạy, bạn nhận thiết kế và trực tiếp chạy một chuỗi bốn buổi tập huấn kỹ năng trình bày cho giáo viên trong cụm trường, ghi lại đầy đủ: mục tiêu, thiết kế buổi học, phiếu đánh giá của người học, và điều bạn sửa giữa buổi hai và buổi ba. Đó trở thành case study đầu tiên. Bạn cũng nhận làm không công hai buổi đào tạo kỹ năng mềm cho nhân viên của một doanh nghiệp nhỏ quen biết, để có một dòng kinh nghiệm trong môi trường doanh nghiệp. Sau bảy tháng bạn ứng tuyển vị trí chuyên viên đào tạo ở một chuỗi bán lẻ, với một portfolio hai case study, một câu chuyện chuyển nghề rõ ràng và một mức lương khởi điểm thấp hơn kỳ vọng ban đầu nhưng vẫn nằm trên mức tối thiểu bạn đã tự đặt. Bạn không phải chạm vào quỹ dự phòng một ngày nào.',
    comparison: [
      {
        weak: 'Nghỉ việc trước rồi mới bắt đầu tìm hiểu nghề mới, với lý do cần toàn tâm toàn ý.',
        mature:
          'Tạo bằng chứng và kiểm chứng giả định trong khi vẫn còn thu nhập, và chỉ rời đi khi đã có một tín hiệu thật từ thị trường hoặc khi ngân sách chuyển đổi đã sẵn sàng.',
      },
      {
        weak: 'Giải thích lý do chuyển nghề bằng những gì bạn muốn thoát khỏi ở nghề cũ.',
        mature:
          'Giải thích bằng thứ bạn hướng tới, cụ thể đến mức nêu được loại bài toán bạn muốn giải và bằng chứng bạn đã thử giải nó.',
      },
      {
        weak: 'Coi toàn bộ kinh nghiệm cũ là bỏ đi và bắt đầu lại từ con số không.',
        mature:
          'Dịch lại vốn cũ sang ngôn ngữ nghề mới và tìm những vị trí ở giao điểm, nơi kinh nghiệm cũ là lợi thế chứ không phải gánh nặng.',
      },
    ],
    mistakes: [
      'Đầu tư trước vào một khóa học dài và đắt trước khi kiểm chứng rằng mình thật sự hợp với công việc đó. Thứ tự an toàn hơn là thử một việc thật nhỏ trước, rồi mới đầu tư vào đào tạo cho phần bạn đã biết chắc mình cần.',
      'Bỏ qua hoàn toàn phần tính toán tài chính vì cho rằng nói về tiền làm mất đi ý nghĩa của quyết định. Trên thực tế, phần lớn những lần quay đầu giữa chừng xảy ra vì hết tiền chứ không vì hết đam mê, và một bảng tính đơn giản có thể ngăn được điều đó.',
      'Chuyển nghề mà không nói chuyện với người đang làm nghề đó ở mức bình thường, chỉ nghe những người thành công nổi bật. Kết quả là kỳ vọng lệch, và cú va chạm với thực tế trong năm đầu tiên trở nên rất nặng.',
    ],
    worksheet: [
      'Trong ba biến ngành, chức năng và cấp bậc, bạn đang định đổi mấy biến cùng lúc? Bước trung gian nào cho phép bạn chỉ đổi một biến?',
      'Lập bảng dịch năm năng lực từ nghề cũ sang tên gọi tương đương ở nghề mới. Năng lực nào bạn không tìm được tên tương đương?',
      'Bằng chứng nhỏ nào bạn có thể tạo ra trong ba tháng tới mà vẫn giữ được công việc hiện tại?',
      'Chi phí sinh hoạt hằng tháng của bạn là bao nhiêu, quỹ dự phòng chịu được mấy tháng, và mức thu nhập tối thiểu bạn chấp nhận ở nghề mới là bao nhiêu?',
      'Câu chuyện chuyển nghề một phút của bạn có nêu được điều bạn hướng tới không, hay chủ yếu nói về điều bạn muốn thoát khỏi?',
    ],
    exercises: [
      {
        label: 'Tách ba biến',
        text: 'Vẽ ba trục ngành, chức năng và cấp bậc, đánh dấu vị trí hiện tại và vị trí mong muốn. Thiết kế hai lộ trình khác nhau đi từ điểm đầu tới điểm cuối bằng cách chỉ đổi một biến mỗi bước, và so sánh số bước cùng thời gian dự kiến.',
        level: 'e',
      },
      {
        label: 'Bảng dịch năng lực',
        text: 'Lập bảng hai cột với mười năng lực bạn có ở nghề cũ và tên gọi tương đương trong nghề mới. Kiểm bảng này với một người đang làm nghề mới và ghi lại những chỗ họ nói cách dịch của bạn chưa đúng.',
        level: 'e',
      },
      {
        label: 'Bảng tính chuyển đổi',
        text: 'Lập bảng tính đơn giản gồm chi phí sinh hoạt hằng tháng, quỹ dự phòng hiện có, số tháng chịu được, mức thu nhập tối thiểu chấp nhận và mốc thời gian đánh giá lại. Chia sẻ với người cùng chịu ảnh hưởng tài chính và thống nhất mốc dừng.',
        level: 'e',
      },
      {
        label: 'Ba cuộc trò chuyện ở ba mức',
        text: 'Trò chuyện với ba người trong nghề mới: một người mới vào dưới hai năm, một người đã lâu năm, và một người từng chuyển từ nghề giống bạn sang. Hỏi cụ thể về năm đầu tiên, mức thu nhập khởi điểm thực tế, và điều họ ước biết trước.',
        level: 'm',
      },
      {
        label: 'Thử nghiệm có thời hạn',
        text: 'Thiết kế một việc thật của nghề mới, hoàn thành trong sáu đến mười tuần mà vẫn giữ công việc hiện tại: nhận một dự án nhỏ, làm tình nguyện cho một tổ chức, hoặc nhận một khách hàng đầu tiên. Đặt trước hai tín hiệu tốt và hai tín hiệu xấu.',
        level: 'm',
      },
      {
        label: 'Câu chuyện chuyển nghề một phút',
        text: 'Viết và luyện nói một đoạn sáu mươi giây gồm ba phần: điều bạn mang theo, điều bạn hướng tới, và bằng chứng đã thử. Đọc cho ba người nghe và hỏi họ có thấy lý do của bạn là hướng tới hay chạy trốn.',
        level: 'm',
      },
      {
        label: 'Portfolio bắc cầu',
        text: 'Xây hai case study từ những việc thật bạn đã làm thuộc nghề mới, dù quy mô nhỏ, theo khung bối cảnh, ràng buộc, quyết định, kết quả và điều sẽ làm khác. Nhờ một người trong nghề mới đọc và chỉ ra chỗ nào chưa đạt chuẩn của nghề đó.',
        level: 'h',
      },
      {
        label: 'Kế hoạch chuyển đổi mười hai tháng',
        text: 'Viết kế hoạch có bốn cột theo quý: bằng chứng cần tạo, người cần gặp, kỹ năng cần học, và mốc tài chính. Đặt hai điểm kiểm tra để đánh giá lại toàn bộ, và ghi rõ điều kiện nào sẽ khiến bạn dừng hoặc đổi hướng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao đổi cả ba biến ngành, chức năng và cấp bậc cùng lúc lại rất khó?',
        a: 'Vì mỗi biến bạn giữ nguyên là một lý do để người tuyển tin bạn. Giữ nguyên ngành nghĩa là bạn hiểu bối cảnh, khách hàng và thuật ngữ; giữ nguyên chức năng nghĩa là bạn làm được việc ngay; giữ nguyên cấp bậc nghĩa là mức lương và kỳ vọng khớp nhau. Bỏ cả ba thì bạn cạnh tranh với những người mới ra trường vốn rẻ hơn và sẵn sàng học từ đầu, trong khi bạn lại có chi phí sinh hoạt của một người đã đi làm nhiều năm.',
      },
      {
        q: 'Có nên học một khóa dài và tốn kém trước khi chuyển nghề không?',
        a: 'Nên đảo thứ tự. Trước hết hãy làm một việc thật nhỏ của nghề mới để kiểm chứng bạn có hợp không và để biết chính xác mình thiếu gì; sau đó mới đầu tư vào đào tạo cho đúng phần thiếu. Có những nghề bắt buộc phải có chứng chỉ hay giấy phép hành nghề, và khi đó khóa học là điều kiện cần chứ không phải lựa chọn — nhưng ngay cả khi ấy, một lần thử tiếp xúc thực tế trước vẫn giúp bạn tránh được khoản đầu tư sai hướng.',
      },
      {
        q: 'Người phỏng vấn hỏi vì sao bạn bỏ nghề cũ sau nhiều năm. Trả lời thế nào?',
        a: 'Trả lời theo hướng tới, ngắn gọn và không chê nghề cũ. Cấu trúc dùng được gồm ba phần: điều bạn học được và mang theo từ nghề cũ, loại bài toán cụ thể ở nghề mới mà bạn muốn làm, và bằng chứng bạn đã thử làm nó thật. Tránh hai thái cực: kể lể những bất mãn ở chỗ cũ, và nói những lý do quá chung chung như muốn thử thách bản thân. Người tuyển đang lo một điều duy nhất là bạn sẽ lại rời đi sau một năm, nên mọi câu trả lời nên nhằm làm giảm nỗi lo đó.',
      },
    ],
    plan7:
      'Ngày 1: vẽ ba trục và thiết kế hai lộ trình chỉ đổi một biến mỗi bước. Ngày 2: lập bảng dịch mười năng lực sang ngôn ngữ nghề mới. Ngày 3: lập bảng tính chuyển đổi và thống nhất mốc dừng với người cùng chịu ảnh hưởng. Ngày 4: liên hệ ba người trong nghề mới ở ba mức khác nhau. Ngày 5: thiết kế một thử nghiệm sáu đến mười tuần làm được song song với việc hiện tại. Ngày 6: viết và luyện câu chuyện chuyển nghề một phút. Ngày 7: phác thảo kế hoạch mười hai tháng với bốn cột và hai điểm kiểm tra.',
    evidence:
      'Với người chuyển nghề, bằng chứng quan trọng hơn hẳn so với người đi tiếp trên đường cũ, vì chức danh trên CV đang nói ngược lại với điều bạn muốn thuyết phục. Bộ tối thiểu gồm ba thứ: hai case study từ việc thật thuộc nghề mới dù quy mô nhỏ, bảng dịch năng lực để bạn nói đúng ngôn ngữ của nghề đó, và câu chuyện chuyển nghề một phút đã được luyện. Ngoài ra, nếu nghề mới có sản phẩm công khai được, hãy tạo dấu vết sớm — một chuỗi bài viết, một tài liệu hướng dẫn, một dự án tình nguyện có kết quả đo được. Xin nhắc lại phần thận trọng: chương này bàn về phương pháp nghề nghiệp, không phải tư vấn tài chính hay pháp lý; các quyết định liên quan tới nghỉ việc, bảo hiểm xã hội, khoản vay hay điều kiện hợp đồng lao động cần được tra theo quy định hiện hành nơi bạn sinh sống và nên hỏi người có chuyên môn khi giá trị rủi ro lớn.',
    references: [
      { label: '80,000 Hours — nghiên cứu và hướng dẫn về lựa chọn, chuyển hướng nghề nghiệp', url: 'https://80000hours.org/', type: 'article', needsReview: true },
      { label: 'Coursera — nền tảng khóa học trực tuyến để bổ sung năng lực nghề mới', url: 'https://www.coursera.org/', type: 'article' },
    ],
  }),

  // ── Chương 19 · Làm freelance ─────────────────────────────────────────────
  guide({
    thesis:
      'Làm freelance không phải là làm cùng một công việc cũ ở nhà, mà là vận hành một doanh nghiệp một người trong đó bạn kiêm luôn phần bán hàng, định giá, quản lý dự án, thu tiền và tuân thủ nghĩa vụ hành chính. Đây là lý do phần lớn người thất bại không phải vì kém chuyên môn: chuyên môn thường chỉ chiếm khoảng một nửa quỹ thời gian, phần còn lại là những việc họ chưa bao giờ phải làm khi đi làm công. Một điều phải nói ngay và nói rõ: nghĩa vụ thuế, đăng ký kinh doanh và hợp đồng của người làm tự do khác nhau theo từng quốc gia và thay đổi theo thời gian. Chương này cung cấp thực hành nghề nghiệp phổ quát, không phải tư vấn thuế hay pháp lý; hãy tra quy định hiện hành tại nơi bạn cư trú và hỏi người có chuyên môn khi số tiền hoặc rủi ro đủ lớn.',
    why: {
      work:
        'Kỹ năng định giá, viết phạm vi công việc và quản lý kỳ vọng khách hàng cũng chính là những kỹ năng làm bạn mạnh hơn khi đi làm công, đặc biệt ở các vị trí phải làm việc với đối tác bên ngoài.',
      interview:
        'Giai đoạn làm tự do được kể tốt là một điểm mạnh chứ không phải khoảng trống: nó chứng minh bạn tự tìm được khách, tự quản lý được tiến độ và tự chịu trách nhiệm về kết quả — ba thứ mà nhiều ứng viên chưa từng phải làm.',
      study:
        'Làm tự do buộc bạn học rất nhanh những mảng ngoài chuyên môn và học theo nhu cầu thật, vì mỗi khoảng trống kiến thức đều quy đổi trực tiếp thành tiền hoặc thời gian mất đi.',
      life:
        'Thu nhập không đều là đặc trưng của nghề này, nên nó đòi hỏi kỷ luật tài chính cá nhân cao hơn hẳn: quỹ dự phòng dày hơn, tách bạch tiền cá nhân với tiền công việc, và chấp nhận rằng những tháng ít việc là một phần bình thường của chu kỳ.',
    },
    framework: [
      {
        name: 'Chọn phân khúc hẹp và định vị',
        detail:
          'Người nhận mọi loại việc cho mọi loại khách phải cạnh tranh bằng giá. Chọn một phân khúc hẹp — ví dụ biên tập nội dung cho các công ty phần mềm doanh nghiệp — cho phép bạn định giá theo giá trị và được giới thiệu qua lại trong cùng một nhóm khách.',
      },
      {
        name: 'Định giá theo giá trị, không theo giờ ngồi',
        detail:
          'Bắt đầu bằng việc tính chi phí sống và số giờ có thể tính tiền thực tế mỗi tháng để ra mức sàn; sau đó chuyển dần sang báo giá theo gói hoặc theo kết quả bàn giao. Báo giá theo giờ khiến bạn bị phạt vì làm nhanh và khiến khách theo dõi giờ thay vì kết quả.',
      },
      {
        name: 'Viết phạm vi công việc trước khi bắt đầu',
        detail:
          'Một văn bản ngắn nêu rõ: sản phẩm bàn giao là gì, không bao gồm những gì, bao nhiêu vòng chỉnh sửa, mốc thời gian, điều kiện thanh toán, và điều gì xảy ra khi phạm vi thay đổi. Đây là công cụ chống lại việc phình phạm vi, nguyên nhân số một khiến dự án lỗ.',
      },
      {
        name: 'Đặt kỷ luật dòng tiền',
        detail:
          'Yêu cầu đặt cọc trước với khách mới, chia thanh toán theo mốc với dự án dài, đặt hạn thanh toán rõ ràng và có quy trình nhắc nợ. Tách tài khoản công việc khỏi tài khoản cá nhân, và trích sẵn một phần cho nghĩa vụ thuế theo quy định áp dụng với bạn.',
      },
      {
        name: 'Xây dòng khách hàng đều, không chờ khách tới',
        detail:
          'Dành một khoảng cố định mỗi tuần cho việc tìm khách ngay cả khi đang bận, vì chu kỳ từ tiếp xúc tới ký hợp đồng thường kéo dài nhiều tuần. Nguồn bền vững nhất là khách cũ quay lại và giới thiệu, nên chăm sóc sau khi kết thúc dự án là một phần của công việc.',
      },
    ],
    scenario:
      'Duy làm biên tập viên nội dung sáu năm cho một công ty truyền thông, quyết định ra làm tự do. Ba tháng đầu bạn nhận mọi việc được mời: viết bài chuẩn tối ưu công cụ tìm kiếm, biên tập sách, viết kịch bản ngắn, làm nội dung mạng xã hội cho một quán cà phê. Thu nhập bằng khoảng hai phần ba lương cũ, và bạn làm nhiều giờ hơn hẳn. Bạn ngồi lại và tính hai con số chưa từng tính: số giờ thực sự tính được tiền mỗi tuần chỉ khoảng hai mươi hai trong tổng số hơn năm mươi giờ làm việc, và ba khách chiếm phần lớn thời gian lại đóng góp phần nhỏ doanh thu. Bạn thay đổi bốn thứ. Một, chọn phân khúc hẹp là biên tập và chuẩn hóa nội dung kỹ thuật cho các công ty phần mềm, dựa trên hai dự án cũ bạn làm tốt nhất. Hai, chuyển từ báo giá theo bài sang báo giá theo gói tháng có phạm vi rõ, kèm mức sàn tính từ chi phí sống chia cho số giờ tính tiền thực tế. Ba, soạn một mẫu phạm vi công việc hai trang, trong đó có đúng hai vòng chỉnh sửa và điều khoản rằng yêu cầu ngoài phạm vi sẽ được báo giá riêng — chính điều khoản này đã chấm dứt tình trạng một khách quen yêu cầu sửa tới bảy vòng. Bốn, đặt luật đặt cọc ba mươi phần trăm với khách mới sau khi một khách nợ bạn gần hai tháng. Bạn cũng dành sáng thứ Ba hằng tuần cho việc tìm khách bất kể đang bận hay rảnh, và bắt đầu gửi một email ngắn cho mọi khách cũ ba tháng một lần. Sau chín tháng, số khách giảm từ mười một xuống bốn, doanh thu vượt mức lương cũ, và số giờ làm việc giảm. Về phần nghĩa vụ hành chính, bạn không tự suy đoán mà tìm một người làm dịch vụ kế toán để được hướng dẫn theo đúng quy định đang áp dụng cho trường hợp của mình.',
    comparison: [
      {
        weak: 'Nhận mọi loại việc từ mọi loại khách để không bỏ lỡ cơ hội nào.',
        mature:
          'Chọn phân khúc hẹp và từ chối những việc lệch, vì mỗi việc lệch tiêu tốn thời gian lẽ ra dùng để làm sâu thêm ở phân khúc bạn muốn được nhớ tới.',
      },
      {
        weak: 'Báo giá theo giờ và ghi giờ, khiến việc làm nhanh và giỏi lại bị trả ít hơn.',
        mature:
          'Báo giá theo gói hoặc theo kết quả bàn giao, đồng thời vẫn theo dõi giờ nội bộ để biết dự án nào thực sự có lãi.',
      },
      {
        weak: 'Bắt đầu làm dựa trên trao đổi miệng vì thấy khách dễ chịu và không muốn tỏ ra khó khăn.',
        mature:
          'Luôn có văn bản phạm vi công việc, kể cả với khách quen, vì văn bản bảo vệ cả hai phía và thường làm quan hệ dễ chịu hơn chứ không căng hơn.',
      },
      {
        weak: 'Chỉ đi tìm khách khi hết việc, dẫn tới chu kỳ lên xuống rất mạnh về thu nhập.',
        mature:
          'Dành một khoảng cố định mỗi tuần cho việc tìm khách kể cả khi đang bận, và duy trì liên lạc định kỳ với khách cũ.',
      },
    ],
    mistakes: [
      'Định giá dựa trên cảm giác về mức khách chấp nhận được thay vì tính từ chi phí sống và số giờ tính tiền thực tế. Số giờ thực sự tính được tiền thường thấp hơn nhiều so với số giờ làm việc, và bỏ qua điều này là cách chắc chắn nhất để làm rất nhiều mà không đủ sống.',
      'Không dự trù nghĩa vụ thuế và các chi phí tự chi trả, rồi bị bất ngờ khi tới kỳ. Nghĩa vụ cụ thể khác nhau theo quốc gia và theo hình thức hoạt động, nên việc cần làm là tra quy định hiện hành áp dụng cho bạn hoặc hỏi người làm dịch vụ kế toán ngay từ tháng đầu, chứ không phải suy đoán từ kinh nghiệm của người khác.',
      'Phụ thuộc vào một khách chiếm phần lớn doanh thu. Điều này biến bạn thành nhân viên không có bảo đảm, và khi khách đó dừng thì thu nhập về gần bằng không trong khi bạn không còn mạng lưới khách khác để quay lại.',
    ],
    worksheet: [
      'Trong bốn tuần gần nhất, bao nhiêu giờ của bạn thực sự tính được tiền, và bao nhiêu giờ dành cho tìm khách, báo giá, hành chính và sửa ngoài phạm vi?',
      'Phân khúc hẹp bạn muốn được nhớ tới là gì, và hai dự án nào của bạn đang chứng minh cho phân khúc đó?',
      'Mức giá sàn của bạn tính từ chi phí sống và số giờ tính tiền thực tế là bao nhiêu? Bạn có báo giá nào đang dưới mức đó không?',
      'Văn bản phạm vi công việc hiện tại của bạn có nêu rõ số vòng chỉnh sửa, phần không bao gồm, và cách xử lý khi phạm vi thay đổi không?',
      'Khách lớn nhất chiếm bao nhiêu phần trăm doanh thu của bạn, và nếu họ dừng vào tháng sau thì bạn còn bao nhiêu tháng chi phí dự phòng?',
    ],
    exercises: [
      {
        label: 'Đo giờ tính tiền',
        text: 'Trong hai tuần, ghi lại toàn bộ thời gian làm việc và phân thành bốn loại: giờ tính được tiền, giờ tìm khách, giờ hành chính, giờ sửa ngoài phạm vi. Tính tỷ lệ và so với giả định ban đầu của bạn.',
        level: 'e',
      },
      {
        label: 'Tính mức giá sàn',
        text: 'Tính chi phí sống hằng tháng cộng với các chi phí công việc và khoản trích dự phòng cho nghĩa vụ tài chính, chia cho số giờ tính tiền thực tế mỗi tháng. Con số ra được là mức sàn tuyệt đối; ghi ra ba báo giá gần nhất của bạn và đối chiếu.',
        level: 'e',
      },
      {
        label: 'Câu định vị phân khúc',
        text: 'Viết một câu nêu rõ bạn làm gì, cho loại khách nào, và giải quyết vấn đề gì cho họ. Kiểm bằng cách hỏi hai khách cũ xem họ có mô tả bạn giống vậy không, và ghi lại khoảng cách giữa hai cách mô tả.',
        level: 'e',
      },
      {
        label: 'Mẫu phạm vi công việc',
        text: 'Soạn mẫu hai trang gồm: sản phẩm bàn giao, phần không bao gồm, số vòng chỉnh sửa, mốc thời gian, điều kiện thanh toán và cách xử lý khi phạm vi thay đổi. Dùng cho dự án tiếp theo và ghi lại phản ứng của khách.',
        level: 'm',
      },
      {
        label: 'Rà soát danh mục khách',
        text: 'Lập bảng mọi khách trong sáu tháng qua với ba cột: doanh thu, số giờ đã bỏ ra, và mức độ dễ chịu khi làm việc. Tính doanh thu trên mỗi giờ cho từng khách và quyết định ba khách bạn sẽ ngừng nhận hoặc báo giá lại.',
        level: 'm',
      },
      {
        label: 'Nhịp tìm khách cố định',
        text: 'Đặt một khối thời gian cố định mỗi tuần chỉ dành cho việc tìm khách và duy trì trong tám tuần bất kể đang bận hay rảnh. Ghi lại số cuộc tiếp xúc, số báo giá gửi đi và số hợp đồng ký được để biết tỷ lệ chuyển đổi thật của mình.',
        level: 'm',
      },
      {
        label: 'Buổi tư vấn về nghĩa vụ hành chính',
        text: 'Tìm hiểu quy định hiện hành áp dụng cho người làm tự do tại nơi bạn cư trú, lập danh sách câu hỏi cụ thể về hình thức hoạt động, kê khai và hóa đơn, rồi đặt một buổi tư vấn với người làm dịch vụ kế toán hoặc pháp lý. Ghi lại câu trả lời và các mốc thời hạn vào lịch.',
        level: 'h',
      },
      {
        label: 'Chuyển một khách sang gói định kỳ',
        text: 'Chọn một khách đang thuê bạn theo từng việc lẻ và thiết kế một đề xuất gói định kỳ hằng tháng có phạm vi rõ, kèm lợi ích cho họ về tính chủ động và cho bạn về thu nhập ổn định. Trình bày và ghi lại phản hồi, kể cả khi bị từ chối.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao báo giá theo giờ lại bất lợi cho người làm tự do có kinh nghiệm?',
        a: 'Vì nó gắn thu nhập với thời gian ngồi làm chứ không với giá trị tạo ra, nên càng thành thạo bạn càng bị trả ít cho cùng một kết quả. Nó cũng chuyển sự chú ý của khách sang việc theo dõi giờ thay vì kết quả bàn giao, và tạo ra tranh cãi về từng giờ. Báo giá theo gói hoặc theo kết quả giải quyết cả hai vấn đề, nhưng vẫn cần bạn theo dõi giờ nội bộ để biết dự án nào có lãi thật và để định giá cho lần sau.',
      },
      {
        q: 'Khách liên tục yêu cầu sửa ngoài phạm vi ban đầu. Xử lý thế nào mà không mất khách?',
        a: 'Quay lại văn bản phạm vi công việc, ghi nhận yêu cầu mới là hợp lý, rồi trình bày nó như một hạng mục bổ sung có báo giá và mốc thời gian riêng. Cách nói hiệu quả là đưa lựa chọn thay vì từ chối: hoặc thay thế một hạng mục trong phạm vi hiện tại, hoặc bổ sung với chi phí và thời gian tương ứng. Nếu chưa từng có văn bản phạm vi, hãy coi lần này là dịp để lập một bản cho giai đoạn tiếp theo, vì tình trạng này gần như chắc chắn lặp lại.',
      },
      {
        q: 'Cần chuẩn bị gì về mặt hành chính và pháp lý trước khi bắt đầu làm tự do?',
        a: 'Câu trả lời cụ thể phụ thuộc hoàn toàn vào nơi bạn cư trú và loại công việc, và các quy định này thay đổi theo thời gian, nên đây là chỗ bắt buộc phải tra nguồn chính thức hiện hành hoặc hỏi người có chuyên môn thay vì làm theo kinh nghiệm truyền miệng. Danh sách câu hỏi nên mang đi hỏi thường gồm: hình thức hoạt động phù hợp, ngưỡng và cách kê khai nghĩa vụ thuế, yêu cầu về hóa đơn chứng từ, các khoản bảo hiểm tự nguyện, và những điều khoản tối thiểu nên có trong hợp đồng dịch vụ. Song song đó, hãy làm ngay hai việc không phụ thuộc quy định: tách tài khoản công việc khỏi tài khoản cá nhân, và lưu trữ có hệ thống mọi hợp đồng cùng chứng từ thanh toán.',
      },
    ],
    plan7:
      'Ngày 1: bắt đầu đo giờ và phân loại bốn nhóm thời gian. Ngày 2: tính mức giá sàn từ chi phí sống và số giờ tính tiền thực tế. Ngày 3: viết câu định vị phân khúc và kiểm với hai khách cũ. Ngày 4: soạn mẫu phạm vi công việc hai trang. Ngày 5: rà soát danh mục khách và tính doanh thu trên mỗi giờ cho từng khách. Ngày 6: lập danh sách câu hỏi về nghĩa vụ hành chính và đặt lịch tư vấn với người có chuyên môn. Ngày 7: đặt khối thời gian tìm khách cố định hằng tuần vào lịch và tách tài khoản công việc.',
    evidence:
      'Người làm tự do có lợi thế lớn về bằng chứng vì mọi thứ đều thuộc về bạn: portfolio các dự án đã hoàn thành với kết quả đo được, lời chứng nhận bằng văn bản của khách hàng, và bộ tài liệu vận hành của chính bạn — mẫu phạm vi công việc, quy trình nhận việc, bảng theo dõi dòng tiền. Nếu sau này bạn quay lại làm công, ba thứ đó trả lời trực tiếp những gì nhà tuyển dụng lo ngại về giai đoạn tự do: bạn có tự tìm được việc không, có giao đúng hạn không, có làm việc với khách hàng chuyên nghiệp không. Trong phỏng vấn, hãy kể bằng số: bao nhiêu khách, tỷ lệ khách quay lại, dự án lớn nhất về giá trị và thời lượng, và một lần bạn xử lý phạm vi phình ra hoặc thanh toán chậm. Xin nhắc lại: phần nghĩa vụ thuế và pháp lý trong nghề này cần được xác nhận theo quy định hiện hành nơi bạn ở, chương này không thay thế tư vấn chuyên môn.',
    references: [
      { label: 'Freelancers Union — tài nguyên thực hành cho người làm việc độc lập', url: 'https://www.freelancersunion.org/', type: 'article', needsReview: true },
      { label: 'Thư viện pháp luật — tra cứu văn bản pháp luật Việt Nam hiện hành', url: 'https://thuvienphapluat.vn/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 20 · Làm việc từ xa và thị trường quốc tế ──────────────────────
  guide({
    thesis:
      'Làm việc từ xa cho một tổ chức ở nước khác đổi bản chất công việc theo ba hướng cùng lúc, và người chuẩn bị thiếu thường chỉ nhìn thấy hướng thứ nhất. Hướng thứ nhất là ngôn ngữ và múi giờ. Hướng thứ hai, quan trọng hơn, là chuyển từ giao tiếp đồng bộ sang giao tiếp bằng văn bản: giá trị của bạn được đánh giá qua thứ bạn viết ra và qua tiến độ hiển thị, chứ không qua sự có mặt. Hướng thứ ba là lớp hành chính phức tạp nhất — hình thức hợp đồng, nghĩa vụ thuế, cư trú thuế và cách nhận tiền xuyên biên giới — và đây là phần khác nhau theo từng cặp quốc gia, thay đổi theo thời gian, nên phải tra và hỏi chuyên gia chứ tuyệt đối không suy đoán.',
    why: {
      work:
        'Thị trường quốc tế mở rộng đáng kể số cơ hội và khoảng thu nhập, nhưng nó cũng mở rộng cạnh tranh: bạn không còn cạnh tranh với người trong thành phố mà với người ở nhiều nước. Điều bù lại là tiêu chí tuyển thường rõ ràng và dựa trên bằng chứng hơn.',
      interview:
        'Quy trình tuyển từ xa thường có bài tập thực tế và nhiều vòng viết. Người quen làm việc bằng văn bản có lợi thế rõ, còn người chỉ mạnh khi nói chuyện trực tiếp thường bị đánh giá thấp hơn thực lực.',
      study:
        'Tiếng Anh công việc ở môi trường này chủ yếu là đọc và viết chứ không phải hội thoại xã giao, nên chiến lược học hiệu quả là luyện viết tài liệu, tin nhắn cập nhật và tóm tắt, kèm luyện nghe các giọng khác nhau.',
      life:
        'Làm từ xa xuyên múi giờ có cái giá về đời sống: giờ giấc lệch, cảm giác tách biệt, và ranh giới công việc mờ đi. Những cái giá này quản lý được nhưng phải chủ động, vì không có tiếng chuông tan làm nào nhắc bạn dừng.',
    },
    framework: [
      {
        name: 'Xác định mô hình hợp tác và kiểm tra tính hợp lệ',
        detail:
          'Có nhiều mô hình khác nhau: hợp đồng dịch vụ trực tiếp, thông qua một tổ chức trung gian tuyển dụng hộ, hoặc qua nền tảng làm việc tự do. Mỗi mô hình khác nhau về nghĩa vụ thuế, bảo hiểm và mức bảo vệ pháp lý, và tính hợp lệ phụ thuộc vào luật của cả hai nước — hãy hỏi bên tuyển họ dùng mô hình nào và xác nhận nghĩa vụ phía bạn với người có chuyên môn.',
      },
      {
        name: 'Chuyển sang làm việc bằng văn bản',
        detail:
          'Luyện ba dạng viết dùng hằng ngày: cập nhật tiến độ ngắn có cấu trúc, tài liệu đề xuất nêu bối cảnh và phương án, và tin nhắn hỏi có đủ ngữ cảnh để người ở múi giờ khác trả lời được ngay mà không cần hỏi lại. Một vòng hỏi đáp thừa có thể tốn cả một ngày làm việc.',
      },
      {
        name: 'Thiết kế lịch chồng lấn và luật đáp ứng',
        detail:
          'Xác định số giờ chồng lấn thật với đội, chốt với quản lý khung giờ bạn có mặt và thời gian phản hồi cam kết cho từng loại việc, rồi bảo vệ phần còn lại. Không có thỏa thuận rõ, bạn sẽ trôi dần về múi giờ của họ và mất hẳn nhịp sinh hoạt.',
      },
      {
        name: 'Làm cho công việc hiển thị',
        detail:
          'Khi không ai nhìn thấy bạn làm, tiến độ phải tự nói. Cập nhật theo nhịp cố định, ghi lại quyết định ở nơi chung, và chủ động báo sớm khi có rủi ro trễ. Im lặng ở môi trường từ xa được diễn giải là có vấn đề, chứ không phải là đang tập trung.',
      },
      {
        name: 'Chuẩn hóa phần hành chính và nhận tiền',
        detail:
          'Trước khi ký, làm rõ đơn vị tiền tệ, kênh và chi phí chuyển tiền, chu kỳ thanh toán, ai chịu phí, và các nghĩa vụ khai báo phía bạn. Đây là phần khác nhau theo từng cặp quốc gia và thay đổi theo thời gian, nên hãy tra nguồn chính thức và hỏi người làm dịch vụ kế toán hoặc pháp lý; đừng dựa vào kinh nghiệm truyền miệng của người khác hoàn cảnh.',
      },
    ],
    scenario:
      'Vân làm chuyên viên hỗ trợ khách hàng bốn năm cho một công ty công nghệ trong nước, ứng tuyển vị trí hỗ trợ khách hàng cho một công ty phần mềm ở châu Âu, làm từ xa hoàn toàn. Quy trình tuyển gồm bốn bước và chỉ có một bước là gọi video: một bài kiểm tra viết trả lời ba tình huống khách hàng thật, một bài tập viết lại một bài hướng dẫn khó hiểu, một cuộc gọi bốn mươi lăm phút, và một buổi thử làm việc có trả phí trong ba ngày. Vân trượt vòng đầu ở lần ứng tuyển trước đó, và khi xin phản hồi thì nhận được nhận xét rằng câu trả lời đúng nhưng quá dài và không có cấu trúc. Lần này bạn chuẩn bị khác: luyện viết theo khuôn kết luận trước, chi tiết sau, và giới hạn mỗi câu trả lời dưới một trăm năm mươi từ. Bạn cũng làm rõ hai điều trước khi đi tiếp. Thứ nhất là múi giờ: chênh lệch khiến giờ chồng lấn tự nhiên chỉ khoảng ba tiếng buổi chiều của bạn, nên bạn hỏi thẳng đội kỳ vọng có mặt bao nhiêu giờ và thời gian phản hồi cam kết là bao lâu; câu trả lời là bốn giờ chồng lấn và phản hồi trong vòng một ngày làm việc cho việc thường, hai giờ cho việc khẩn. Thứ hai là mô hình hợp tác: công ty tuyển qua một tổ chức trung gian, và Vân không tự suy đoán về nghĩa vụ của mình mà hỏi cụ thể mô hình đó là gì rồi mang thông tin đi hỏi một người làm dịch vụ kế toán trong nước để hiểu phần khai báo phía mình. Trong buổi thử ba ngày, bạn làm một việc không ai yêu cầu: viết lại năm câu trả lời mẫu hay dùng nhất theo cấu trúc rõ hơn và gửi kèm ghi chú về lý do sửa. Đó là thứ được nhắc tới trong thư mời làm việc. Sáu tháng sau, khó khăn lớn nhất không phải ngôn ngữ mà là cảm giác tách biệt, và bạn xử lý bằng cách xin tham gia một cuộc họp nhóm hằng tuần dù không bắt buộc và chủ động nhận việc viết tài liệu chung.',
    comparison: [
      {
        weak: 'Coi làm từ xa là làm cùng công việc cũ ở nhà, giữ nguyên thói quen chờ được hỏi rồi mới báo cáo.',
        mature:
          'Chuyển sang chế độ chủ động hiển thị: cập nhật theo nhịp cố định, ghi quyết định ở nơi chung, và báo sớm khi có rủi ro trễ.',
      },
      {
        weak: 'Viết tin nhắn hỏi ngắn kiểu "anh xem giúp em cái này với" rồi chờ, làm mất trọn một ngày vì lệch múi giờ.',
        mature:
          'Viết tin nhắn tự chứa: bối cảnh, điều bạn đã thử, câu hỏi cụ thể, và phương án bạn nghiêng về — để người kia trả lời được ngay trong một lượt.',
      },
      {
        weak: 'Nhận lời làm việc mà chưa làm rõ mô hình hợp đồng, nghĩa vụ khai báo và cách nhận tiền, để tính sau.',
        mature:
          'Làm rõ toàn bộ phần hành chính trước khi ký, tra nguồn chính thức và hỏi người có chuyên môn, vì sửa sau khi đã phát sinh thu nhập luôn tốn kém hơn.',
      },
    ],
    mistakes: [
      'Đánh giá cơ hội chỉ bằng con số thu nhập quy đổi mà bỏ qua những khoản không có: bảo hiểm, các chế độ theo luật lao động sở tại, và sự bảo vệ khi hợp đồng chấm dứt. So sánh công bằng phải tính cả những khoản này, và mức bảo vệ cụ thể phụ thuộc vào mô hình hợp tác cùng luật áp dụng, nên cần xác nhận chứ không giả định.',
      'Cố duy trì trạng thái luôn sẵn sàng trả lời để chứng tỏ mình chăm chỉ, dẫn tới làm việc rải suốt mười sáu tiếng và kiệt sức trong vài tháng. Ở môi trường từ xa, thứ được đánh giá là độ tin cậy của cam kết chứ không phải tốc độ trả lời tức thì.',
      'Bỏ qua phần xây quan hệ vì cho rằng làm tốt việc là đủ. Trong đội phân tán, người không ai biết mặt là người đầu tiên bị bỏ qua khi có dự án tốt và là người dễ bị cắt nhất khi công ty thu hẹp.',
    ],
    worksheet: [
      'Số giờ chồng lấn thật giữa múi giờ của bạn và của đội là bao nhiêu, và bạn sẵn sàng làm việc trong khung giờ nào một cách bền vững?',
      'Bạn đã hỏi rõ mô hình hợp tác mà bên tuyển sử dụng chưa, và bạn đã xác nhận nghĩa vụ phía mình với người có chuyên môn chưa?',
      'Trong ba tin nhắn hỏi gần nhất của bạn, có bao nhiêu tin đủ ngữ cảnh để người nhận trả lời trong một lượt mà không cần hỏi lại?',
      'Nếu đội của bạn nhìn vào nơi lưu tài liệu chung, họ có thấy được bạn đang làm gì trong tuần này không, hay chỉ thấy khi bạn nhắn?',
      'Ngoài thu nhập, những khoản nào bạn sẽ không còn có khi làm từ xa cho tổ chức nước ngoài, và bạn dự định bù bằng cách nào?',
    ],
    exercises: [
      {
        label: 'Bản đồ múi giờ',
        text: 'Vẽ lịch một tuần với múi giờ của bạn và của đội, tô phần chồng lấn thật. Xác định khung giờ bạn có thể duy trì bền vững trong sáu tháng và viết một đề nghị cụ thể để thống nhất với quản lý.',
        level: 'e',
      },
      {
        label: 'Viết lại ba tin nhắn hỏi',
        text: 'Lấy ba tin nhắn hỏi gần nhất của bạn và viết lại thành dạng tự chứa: bối cảnh, điều đã thử, câu hỏi cụ thể, phương án bạn nghiêng về. So độ dài và ước lượng số lượt hỏi đáp tiết kiệm được.',
        level: 'e',
      },
      {
        label: 'Cập nhật tiến độ có cấu trúc',
        text: 'Soạn một mẫu cập nhật ngắn gồm bốn phần: đã xong, đang làm, vướng mắc cần hỗ trợ, và rủi ro trễ. Dùng đều đặn trong hai tuần ở công việc hiện tại và ghi lại số câu hỏi bạn nhận được trước và sau.',
        level: 'e',
      },
      {
        label: 'Danh sách câu hỏi hành chính',
        text: 'Soạn danh sách câu hỏi cần làm rõ trước khi ký: mô hình hợp tác, đơn vị tiền tệ, kênh và phí chuyển tiền, chu kỳ thanh toán, nghĩa vụ khai báo phía bạn, điều kiện chấm dứt. Mang danh sách này đi hỏi người làm dịch vụ kế toán hoặc pháp lý trước khi ký.',
        level: 'm',
      },
      {
        label: 'Luyện bài tập viết như vòng tuyển thật',
        text: 'Tìm ba tình huống công việc thật và viết câu trả lời cho mỗi tình huống dưới một trăm năm mươi từ theo cấu trúc kết luận trước, chi tiết sau. Nhờ một người có kinh nghiệm làm việc bằng tiếng Anh đọc và chỉ ra chỗ dài dòng hoặc mơ hồ.',
        level: 'm',
      },
      {
        label: 'Bảng so sánh tổng thu nhập',
        text: 'Lập bảng so sánh cơ hội quốc tế với công việc hiện tại trên đủ các cột: thu nhập, các khoản bảo hiểm và chế độ không còn, chi phí tự chi trả, nghĩa vụ khai báo, và mức bảo vệ khi chấm dứt hợp đồng. Ghi rõ những ô bạn chưa xác nhận được và cần hỏi ai.',
        level: 'm',
      },
      {
        label: 'Hồ sơ làm việc bằng văn bản',
        text: 'Xây một hồ sơ gồm ba mẫu viết thật của bạn: một tài liệu đề xuất, một bản cập nhật tiến độ, và một tài liệu hướng dẫn. Đây là thứ nhiều quy trình tuyển từ xa yêu cầu, và có sẵn giúp bạn nộp ngay khi cơ hội xuất hiện.',
        level: 'h',
      },
      {
        label: 'Kế hoạch chống tách biệt',
        text: 'Thiết kế một kế hoạch ba tháng để không bị vô hình trong đội phân tán: nhịp trò chuyện một đối một với những người bạn phối hợp, một việc chung bạn chủ động nhận, và một hình thức đóng góp cho tài liệu chung. Thực hiện và đánh giá lại sau ba tháng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao viết tốt lại quan trọng hơn nói tốt trong môi trường làm việc từ xa xuyên múi giờ?',
        a: 'Vì phần lớn trao đổi diễn ra không đồng bộ, nên chất lượng một tin nhắn quyết định số lượt qua lại cần thiết, mà mỗi lượt có thể tốn gần một ngày khi lệch múi giờ. Ngoài ra, văn bản là thứ tồn tại và được người khác đọc lại, nên nó cũng chính là cách bạn được biết tới trong tổ chức. Một người viết rõ ràng tạo ra ít ma sát và được tin tưởng giao việc lớn hơn, kể cả khi họ ít khi lên tiếng trong các cuộc họp.',
      },
      {
        q: 'Cần làm rõ những gì về mặt hợp đồng, thuế và thanh toán trước khi nhận việc từ tổ chức nước ngoài?',
        a: 'Đây là phần phức tạp nhất và cũng là phần không nên tự suy đoán, vì quy tắc phụ thuộc vào cặp quốc gia liên quan, vào mô hình hợp tác và vào tình trạng cư trú thuế của bạn, đồng thời thay đổi theo thời gian. Danh sách tối thiểu cần làm rõ gồm: mô hình hợp tác mà bên tuyển sử dụng, ai là bên trả tiền và theo hợp đồng nào, đơn vị tiền tệ cùng kênh và phí chuyển tiền, chu kỳ thanh toán, nghĩa vụ kê khai phía bạn, và điều kiện chấm dứt hợp đồng. Hãy tra nguồn chính thức của cơ quan thuế nơi bạn cư trú và hỏi người làm dịch vụ kế toán hoặc luật sư trước khi ký; nội dung ở đây là kiến thức phổ thông chứ không phải tư vấn pháp lý hay thuế.',
      },
      {
        q: 'Làm sao để không bị vô hình trong một đội phân tán?',
        a: 'Bằng ba việc chủ động và đều đặn. Một, cập nhật tiến độ theo nhịp cố định ở kênh chung thay vì báo cáo riêng cho quản lý, để nhiều người cùng thấy. Hai, đóng góp vào tài liệu chung — viết lại một hướng dẫn khó hiểu, ghi biên bản quyết định, dựng một bản kiểm tra — vì tài liệu tồn tại lâu hơn cuộc họp. Ba, duy trì các cuộc trò chuyện một đối một ngắn với những người bạn phối hợp, kể cả khi không có việc gấp. Ba việc này nghe đơn giản nhưng ít người làm đều, và chính sự đều đặn tạo ra khác biệt.',
      },
    ],
    plan7:
      'Ngày 1: vẽ bản đồ múi giờ và xác định khung giờ chồng lấn bền vững. Ngày 2: viết lại ba tin nhắn hỏi thành dạng tự chứa. Ngày 3: soạn mẫu cập nhật tiến độ bốn phần và bắt đầu dùng. Ngày 4: luyện ba bài viết tình huống dưới một trăm năm mươi từ theo cấu trúc kết luận trước. Ngày 5: soạn danh sách câu hỏi hành chính và tra nguồn chính thức về nghĩa vụ phía bạn. Ngày 6: đặt lịch hỏi người làm dịch vụ kế toán hoặc pháp lý về mô hình hợp tác dự kiến. Ngày 7: lập bảng so sánh tổng thu nhập đầy đủ các cột và đánh dấu những ô còn thiếu thông tin.',
    evidence:
      'Bằng chứng đặc thù cho thị trường từ xa là hồ sơ làm việc bằng văn bản: ba mẫu viết thật của bạn gồm một tài liệu đề xuất có bối cảnh và phương án, một bản cập nhật tiến độ có cấu trúc, và một tài liệu hướng dẫn mà người khác dùng lại được. Nhiều quy trình tuyển từ xa yêu cầu đúng những thứ này, và có sẵn cho phép bạn nộp ngay thay vì viết vội. Bổ sung thêm hai thứ có sức nặng riêng: bất kỳ đóng góp công khai nào có thể tra được, và một mô tả ngắn về cách bạn tổ chức công việc khi lệch múi giờ, gồm khung giờ chồng lấn, thời gian phản hồi cam kết và cách bạn báo rủi ro trễ. Cuối cùng, xin nhắc lại phần thận trọng của chương: quy tắc về thị thực, cư trú thuế, hợp đồng và thanh toán xuyên biên giới thực sự phức tạp, khác nhau theo từng cặp quốc gia và thay đổi theo thời gian; hãy coi nội dung ở đây là kiến thức phổ thông và tra nguồn chính thức hoặc hỏi chuyên gia trước mỗi quyết định có ràng buộc.',
    references: [
      { label: 'GitLab Handbook — bộ tài liệu công khai về vận hành tổ chức làm việc từ xa hoàn toàn', url: 'https://handbook.gitlab.com/', type: 'article' },
      { label: 'International Labour Organization — tài nguyên về tiêu chuẩn lao động và việc làm', url: 'https://www.ilo.org/', type: 'article', needsReview: true },
    ],
  }),
];
