import { guide } from '../skill-guide-builder.mjs';

export default [
  // ─────────────────────────────────────────────────────────────────────────
  // Chương 1 — Tư duy phản biện — Critical Thinking
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Tư duy phản biện là việc đánh giá một khẳng định bằng năm thứ có thể kiểm được: định nghĩa của các từ trong đó, bằng chứng đứng sau, nguồn của bằng chứng, giả định ngầm, và những cách giải thích khác cũng khớp với dữ liệu đó. Nó không phải thói quen phản đối, cũng không phải giọng điệu hoài nghi. Dấu hiệu nhận ra một người có kỹ năng này là họ kết thúc bằng một kết luận có mức độ chắc chắn nói rõ ra, kèm điều kiện sẽ khiến họ đổi ý.',
    why: {
      work: 'Phần lớn quyết định ở công ty dựa trên vài câu khẳng định được lặp lại đủ nhiều để không ai hỏi nữa — "khách hàng không quan tâm giá", "team sale bảo tính năng này chốt được deal". Người phản biện được là người dám hỏi con số đó đo trên bao nhiêu khách và đo lúc nào, trước khi cả phòng đầu tư ba tháng vào một tiền đề chưa ai kiểm.',
      interview:
        'Câu hỏi case trong phỏng vấn hầu như luôn cố tình thiếu dữ kiện. Ứng viên nhảy thẳng vào giải pháp sẽ lộ ra mình đoán; ứng viên nói được "tôi đang giả định X, nếu X sai thì hướng của tôi đổi thành Y" cho người phỏng vấn thấy đúng thứ họ cần thấy — cách bạn xử lý khi chưa biết đủ.',
      study:
        'Khi tự học, thứ nguy hiểm nhất không phải kiến thức khó mà là kiến thức sai nghe rất hợp lý: một bài blog viết mượt, một video triệu view. Phản biện giúp bạn tách "tác giả này đang trình bày kết quả đo được" khỏi "tác giả này đang kể trải nghiệm cá nhân của một người", trước khi bạn xây cả lộ trình học lên nó.',
      life: 'Tin nhắn về thuốc, về khoản đầu tư "cam kết 3%/tháng", về một chính sách mới — đều đến kèm áp lực phải phản ứng ngay. Kỹ năng này mua cho bạn khoảng lặng để hỏi ai được lợi nếu bạn tin điều này, và con số kia được đo trên nhóm nào.',
    },
    framework: [
      { name: 'Làm rõ khẳng định', detail: 'Viết lại khẳng định thành một câu mà hai người đọc sẽ hiểu giống nhau. Định nghĩa các từ mờ: "tăng trưởng" là tổng hay theo khách, "nhanh" là bao nhiêu giây, "nhiều người phàn nàn" là mấy người trên tổng bao nhiêu.' },
      { name: 'Truy nguồn bằng chứng', detail: 'Hỏi bằng chứng đến từ đâu, ai đo, đo bằng công cụ nào, trên mẫu nào và lúc nào. Phân biệt số liệu quan sát trực tiếp với số liệu đi qua nhiều lần kể lại — mỗi lần kể lại là một lần thông tin bị làm tròn theo hướng có lợi cho người kể.' },
      { name: 'Dựng cách giải thích đối lập', detail: 'Ép mình tìm ít nhất một câu chuyện khác cũng khớp với đúng bộ dữ liệu đó. Nếu không dựng nổi cách giải thích đối lập nào, thường là bạn chưa hiểu dữ liệu chứ không phải kết luận đã chắc.' },
      { name: 'Kết luận có mức độ', detail: 'Phát biểu kết luận kèm độ chắc và kèm điều kiện đảo ngược: "Tôi nghiêng về A khoảng 70%; nếu số liệu tháng sau cho thấy nhóm mới cũng rời bỏ thì tôi bỏ A." Một phản biện không dẫn tới quyết định hoặc phép thử tiếp theo là phản biện dở dang.' },
    ],
    scenario:
      'Một chủ tiệm bánh nhỏ thấy doanh thu tháng tăng 20% sau khi chạy quảng cáo Facebook, định tăng ngân sách gấp đôi. Trước khi tăng, chị ngồi tách sổ: tăng đến từ tổng đơn hay từ một đơn đặt tiệc cưới 12 triệu; doanh thu đã trừ phần huỷ đơn chưa; tháng trước có phải mùa thấp điểm không. Kết quả: bỏ đơn tiệc cưới ra, phần còn lại chỉ tăng 3%, thấp hơn cả chi phí quảng cáo. Chị giữ nguyên ngân sách và chuyển sang đo số khách mới quay lại lần hai.',
    comparison: [
      { weak: 'Nghe một con số, phản ứng ngay theo cảm giác nó lớn hay nhỏ.', mature: 'Hỏi mẫu số trước tử số: 200 lượt phàn nàn là nhiều hay ít phụ thuộc vào tổng 2.000 hay 2 triệu người dùng.' },
      { weak: 'Đánh giá khẳng định theo mức độ tự tin và chức danh của người nói.', mature: 'Tách nội dung khỏi người nói: cùng một khẳng định, nếu người mới vào nói thì mình có tin không? Nếu không thì lý do tin lúc này là gì?' },
      { weak: 'Hỏi liên tục để chứng tỏ mình sắc sảo, cuộc họp tan mà không ai quyết gì.', mature: 'Đặt trần cho việc hỏi: tối đa ba câu hỏi có thể đổi được quyết định, rồi chốt một kết luận tạm và một việc đi kiểm.' },
    ],
    mistakes: [
      'Nhầm phản biện với phản đối: mặc định vai "người bắt lỗi" trong mọi cuộc họp, khiến đồng nghiệp ngừng chia sẻ bản nháp và bạn mất luôn cơ hội sửa sớm.',
      'Áp tiêu chuẩn bằng chứng lệch nhau: đòi ba nguồn cho ý kiến trái với mình nhưng chấp nhận một câu nghe được cho ý kiến hợp với mình.',
      'Dừng lại ở "cần thêm dữ liệu" mà không nói rõ dữ liệu nào, lấy bằng cách nào, trong bao lâu — biến sự cẩn trọng thành cái cớ hoãn quyết định vô thời hạn.',
    ],
    worksheet: [
      'Chép nguyên văn một khẳng định bạn nghe trong 48 giờ qua và tin ngay không hỏi lại. Ghi cả người nói và bối cảnh.',
      'Trong câu đó, từ nào chưa có định nghĩa đo được? Viết lại câu ấy với các từ đã được thay bằng con số hoặc hành vi cụ thể.',
      'Bằng chứng cho câu đó là quan sát trực tiếp, số liệu có nguồn, hay lời kể qua người thứ ba? Ghi rõ mắt xích bạn không kiểm được.',
      'Viết một cách giải thích khác cũng khớp hoàn toàn với bằng chứng hiện có. Nếu không viết nổi, ghi lý do vì sao.',
      'Bạn đang chắc bao nhiêu phần trăm, và quan sát cụ thể nào trong tháng tới sẽ khiến bạn hạ con số đó xuống dưới 50%?',
    ],
    exercises: [
      { label: 'Bóc từ mờ', text: 'Lấy ba câu trong một bài báo hoặc bài đăng LinkedIn bạn đọc hôm nay, gạch chân mọi từ định lượng mơ hồ ("đáng kể", "hầu hết", "nhanh chóng") và viết lại từng câu ở dạng có thể kiểm được.', level: 'e' },
      { label: 'Truy ba lớp nguồn', text: 'Chọn một thống kê đang lan trên mạng xã hội. Lần ngược: bài đăng dẫn báo nào, báo dẫn nghiên cứu nào, nghiên cứu đo trên bao nhiêu người. Ghi lại lớp nào bạn không lần tới được.', level: 'e' },
      { label: 'Đối lập bắt buộc', text: 'Với một kết luận bạn đang tin chắc trong công việc, viết đúng 150 chữ bảo vệ kết luận ngược lại, dùng chỉ dữ liệu hai bên đều đồng ý là có thật.', level: 'e' },
      { label: 'Hồ sơ khẳng định', text: 'Trong một tuần làm việc, ghi lại năm khẳng định được nêu trong họp mà không ai hỏi nguồn. Cuối tuần chọn một cái đi kiểm thật và ghi kết quả.', level: 'm' },
      { label: 'Ba câu hỏi trước khi duyệt', text: 'Lần tới khi được đề nghị duyệt một khoản chi hoặc một kế hoạch, bắt buộc bản thân hỏi đủ: số này đo trên ai, ai được lợi nếu tôi đồng ý, điều gì sẽ khiến ta biết mình sai. Ghi phản ứng của người trình bày.', level: 'm' },
      { label: 'Đọc chéo hai phía', text: 'Chọn một chủ đề gây tranh cãi trong ngành bạn. Đọc một bài ủng hộ và một bài phản đối, lập bảng ba cột: dữ kiện cả hai công nhận, dữ kiện chỉ một bên có, chỗ hai bên định nghĩa từ khác nhau.', level: 'm' },
      { label: 'Biên bản kết luận có mức độ', text: 'Trong hai cuộc họp tới, thay vì phát biểu "tôi nghĩ nên làm X", nói theo mẫu "tôi nghiêng về X khoảng N%, giả định chính là G, và dữ liệu D sẽ khiến tôi đổi". Ghi lại phản ứng của người khác và xem cuộc thảo luận đi tới đâu.', level: 'h' },
      { label: 'Thử thách 7 ngày: sổ khẳng định', text: 'Bảy ngày liền, mỗi ngày ghi đúng một khẳng định bạn suýt tin ngay, kèm cột "nếu điều này sai, tôi mất gì". Ngày thứ bảy, đếm xem bao nhiêu cái đáng bỏ công kiểm và bao nhiêu cái tin cũng không sao — đó là cách bạn học phân bổ nghi ngờ.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Một đồng nghiệp nói "khảo sát cho thấy 80% người dùng muốn tính năng này". Ba câu hỏi đầu tiên bạn hỏi là gì?',
        a: 'Khảo sát gửi cho ai và bao nhiêu người trả lời trên tổng bao nhiêu người nhận (tỷ lệ trả lời thấp thường chỉ thu về nhóm sẵn thiện cảm); câu hỏi được đặt bằng chữ gì (câu dẫn dắt kiểu "bạn có muốn thêm X miễn phí không" gần như luôn ra 80%); và người trả lời có phải nhóm mà quyết định này nhắm tới không.',
      },
      {
        q: 'Vì sao "tôi không tìm thấy bằng chứng nào chống lại điều này" là một lý do yếu để tin?',
        a: 'Vì nó phụ thuộc vào việc bạn đã tìm ở đâu và tìm bằng từ khoá nào. Không tìm thấy phản chứng có thể do phản chứng không tồn tại, nhưng cũng có thể do bạn chỉ đọc nguồn cùng phía, do chủ đề chưa ai nghiên cứu, hoặc do kết quả âm tính ít được công bố. Cần nói rõ đã tìm ở đâu thì phát biểu đó mới có trọng lượng.',
      },
      {
        q: 'Phân biệt "kết luận có mức độ" với "trả lời nước đôi cho an toàn".',
        a: 'Kết luận có mức độ vẫn nêu một hướng nghiêng và một hành động cụ thể, chỉ kèm thêm độ chắc và điều kiện đảo ngược đo được. Trả lời nước đôi thì không nghiêng về đâu, không có hành động, và không có dữ liệu nào có thể làm nó sai — nên nó không bao giờ chịu trách nhiệm.',
      },
    ],
    plan7:
      'Ngày 1: chọn một quyết định đang chờ trong công việc và viết ra ba khẳng định nó dựa vào. Ngày 2: định nghĩa lại từng khẳng định bằng từ đo được. Ngày 3: truy nguồn khẳng định quan trọng nhất, ghi rõ mắt xích không kiểm được. Ngày 4: viết cách giải thích đối lập cho khẳng định đó. Ngày 5: hỏi một đồng nghiệp không cùng phòng phản biện giúp, ghi điểm mù họ chỉ ra. Ngày 6: viết kết luận có mức độ kèm điều kiện đảo ngược và gửi cho người ra quyết định. Ngày 7: đọc lại cả tuần, đánh dấu bước nào bạn né nhiều nhất — đó là bước cần luyện tiếp.',
    evidence:
      'Giữ một "sổ khẳng định" và trích ra hai mục cho hồ sơ năng lực: một lần bạn ngăn được quyết định tốn kém vì đã kiểm lại con số (ghi số tiền hoặc số ngày công tiết kiệm được), và một lần bạn tự sai — bạn đã tin gì, dữ liệu nào làm bạn đổi, và bạn thêm bước kiểm nào sau đó. Trong CV, viết dưới dạng kết quả chứ không phải tính từ: "Rà lại định nghĩa metric doanh thu trước khi tăng ngân sách quảng cáo, phát hiện 17/20 điểm tăng đến từ một hợp đồng không lặp lại". Trong phỏng vấn, mục thứ hai (lần tự sai) thường ghi điểm cao hơn mục thứ nhất.',
    references: [
      { label: 'Critical Thinking — Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/critical-thinking/', type: 'article' },
      { label: 'Foundation for Critical Thinking', url: 'https://www.criticalthinking.org/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 2 — Tư duy logic
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Logic trả lời đúng một câu hỏi: kết luận có thật sự đi ra từ các tiền đề hay không. Nó tách bạch hai thứ mà đời thường hay trộn lẫn — lập luận hợp lệ (valid: nếu tiền đề đúng thì kết luận buộc phải đúng) và lập luận đúng thật (sound: hợp lệ và tiền đề cũng đúng). Một câu nói nghe rất thuyết phục vẫn có thể hỏng ở chỗ nối giữa hai câu, và chính chỗ nối đó là nơi phần lớn sai lầm đắt tiền trú ngụ.',
    why: {
      work: 'Tài liệu thiết kế, đề xuất ngân sách, báo cáo sự cố — tất cả đều là chuỗi lập luận. Khi bạn nhìn ra chỗ một tài liệu dùng chữ "do đó" để nhảy qua một bước chưa chứng minh, bạn tiết kiệm cho cả nhóm hàng tuần đi sai hướng mà không cần cãi nhau về quan điểm.',
      interview:
        'Người phỏng vấn kỹ thuật thường quan tâm cấu trúc lập luận hơn đáp án: điều kiện nào phải đúng để giải pháp của bạn hoạt động, và nếu điều kiện đó gãy thì sao. Trả lời được nghĩa là bạn biết giới hạn của chính câu trả lời mình.',
      study:
        'Khi học một môn mới, phần khó nhất thường không phải nhớ định lý mà là biết định lý áp dụng được trong điều kiện nào. Đọc theo cấu trúc tiền đề — suy luận — kết luận giúp bạn phát hiện ngay khi mình đang dùng một công thức ngoài phạm vi của nó.',
      life: 'Các cuộc cãi nhau trong gia đình hay trên mạng thường không phải bất đồng về sự thật mà là hai bên dùng cùng một từ với hai nghĩa khác nhau ("công bằng", "tôn trọng", "đắt"). Tách được nghĩa của từ ra khỏi tranh luận thường làm tan biến một nửa mâu thuẫn.',
    },
    framework: [
      { name: 'Tách tiền đề', detail: 'Viết mỗi mệnh đề thành một dòng riêng, đánh số, và tách hẳn dòng kết luận xuống dưới. Chỉ riêng thao tác này đã làm lộ những tiền đề chưa từng được nói ra thành lời nhưng vẫn đang gánh cả lập luận.' },
      { name: 'Nêu tiền đề ẩn', detail: 'Hỏi: để đi từ dòng số 2 sang kết luận, cần thêm câu nào nữa mới đủ? Câu bạn phải thêm vào chính là giả định ngầm — và nó thường là chỗ yếu nhất vì chưa ai từng kiểm nó.' },
      { name: 'Xác định loại quan hệ', detail: 'Với mỗi bước, dán nhãn: điều kiện cần, điều kiện đủ, tương quan, hay nhân quả. Nhầm "cần" thành "đủ" là lỗi phổ biến nhất trong các lập luận nội bộ công ty.' },
      { name: 'Săn phản ví dụ', detail: 'Tìm một trường hợp cụ thể trong đó tất cả tiền đề đúng nhưng kết luận sai. Một phản ví dụ duy nhất đủ để bác một mệnh đề tổng quát, và tìm nó thường nhanh hơn tranh luận trừu tượng.' },
      { name: 'Thu hẹp kết luận', detail: 'Viết lại kết luận sao cho nó chỉ còn phủ đúng phạm vi mà tiền đề chống đỡ nổi: đổi "khách hàng thích X" thành "trong 40 khách đã phỏng vấn ở phân khúc doanh nghiệp nhỏ, 31 người chọn X khi được ghép cặp với Y".' },
    ],
    scenario:
      'Trưởng nhóm tuyển dụng đề xuất bỏ vòng bài test vì "các bạn giỏi nhất năm ngoái đều làm bài test rất nhanh, nên tốc độ làm bài dự đoán được năng lực, mà phỏng vấn trực tiếp cũng thấy được tốc độ tư duy". Một thành viên tách câu ra ba dòng và chỉ ra: dữ liệu chỉ có nhóm đã được nhận, không ai biết những người làm nhanh mà bị loại hoặc người làm chậm mà giỏi. Nhóm giữ bài test thêm hai quý, ghi thêm điểm cho cả ứng viên bị loại, và phát hiện tốc độ hầu như không tương quan với đánh giá sau sáu tháng — trong khi phần bài test về đọc mã người khác thì có.',
    comparison: [
      { weak: 'Coi một ví dụ sinh động là bằng chứng cho mệnh đề tổng quát ("anh tôi hút thuốc vẫn thọ 90 tuổi").', mature: 'Hỏi ví dụ đó đại diện cho bao nhiêu trường hợp và có bao nhiêu trường hợp ngược lại không ai kể lại được vì họ đã không còn để kể.' },
      { weak: 'Trả lời một lập luận bằng cách công kích động cơ của người nói.', mature: 'Tách hẳn hai việc: lập luận có hợp lệ không, và người nói có xung đột lợi ích không. Cả hai đều đáng nói nhưng không thay thế cho nhau.' },
      { weak: 'Dựng lại ý đối phương ở phiên bản dễ đánh nhất rồi bác nó.', mature: 'Diễn đạt lại ý đối phương ở phiên bản mạnh nhất, đợi họ xác nhận "đúng, đó là ý tôi", rồi mới phản bác — nếu vẫn bác được thì kết luận mới đáng tin.' },
    ],
    mistakes: [
      'Khẳng định hậu quả: "Nếu hệ thống quá tải thì log đầy lỗi timeout; log đang đầy timeout, vậy hệ thống quá tải" — bỏ qua mọi nguyên nhân khác cũng sinh ra timeout, chẳng hạn một dịch vụ phụ thuộc đang chậm.',
      'Đánh tráo nghĩa giữa hai câu: dùng "người dùng hoạt động" ở câu đầu theo nghĩa đăng nhập trong 30 ngày, rồi ở câu sau lại theo nghĩa có thao tác tạo dữ liệu, và kết luận rút ra từ hai định nghĩa khác nhau.',
      'Đặt sai gánh nặng chứng minh: yêu cầu người phản đối chứng minh phương án mới không hoạt động, thay vì người đề xuất chứng minh nó có hoạt động.',
    ],
    worksheet: [
      'Chép lại một đoạn lập luận bạn đã viết trong email hoặc tài liệu tuần này, tách thành các dòng đánh số: tiền đề 1, tiền đề 2, ..., kết luận.',
      'Câu nào bạn phải thêm vào để chuỗi trên khép kín? Viết nó ra — đó là giả định ngầm của chính bạn.',
      'Dán nhãn từng bước nối: cần / đủ / tương quan / nhân quả. Đánh dấu bước nào bạn đang dùng nhãn mạnh hơn bằng chứng cho phép.',
      'Nghĩ ra một tình huống cụ thể trong đó mọi tiền đề của bạn đúng nhưng kết luận vẫn sai. Nếu nghĩ được, ghi ra; nếu không, ghi bạn đã thử theo hướng nào.',
      'Viết lại kết luận ở phạm vi hẹp hơn cho tới khi bạn sẵn sàng đặt cược tiền thật vào nó. Câu cuối cùng đó chính là điều bạn thực sự chứng minh được.',
    ],
    exercises: [
      { label: 'Ba dòng và một mũi tên', text: 'Lấy tiêu đề của năm bài báo trong ngày. Với mỗi tiêu đề, viết tiền đề mà nó ngụ ý và kết luận nó muốn bạn rút ra, rồi đánh dấu tiêu đề nào có khoảng trống giữa hai phần đó.', level: 'e' },
      { label: 'Cần hay đủ', text: 'Liệt kê năm câu dạng "muốn A thì phải B" bạn nghe trong công việc. Với mỗi câu, xác định B là điều kiện cần, điều kiện đủ, hay chỉ là thói quen của tổ chức.', level: 'e' },
      { label: 'Từ điển tranh luận', text: 'Chọn một từ hay gây cãi trong nhóm bạn ("xong", "ưu tiên cao", "ổn định"). Hỏi ba đồng nghiệp định nghĩa nó, ghi ba câu trả lời cạnh nhau và tìm chỗ lệch.', level: 'm' },
      { label: 'Săn phản ví dụ trong tài liệu cũ', text: 'Mở một tài liệu thiết kế hoặc đề xuất đã được duyệt sáu tháng trước. Tìm một kết luận trong đó và dựng một tình huống thực tế đã xảy ra khiến kết luận ấy không còn đúng.', level: 'm' },
      { label: 'Dựng lại ý đối phương', text: 'Trong một bất đồng đang có, viết lập luận của phía kia mạnh đến mức họ đọc xong sẽ nói "đúng ý tôi". Gửi cho họ xác nhận trước khi bạn phản biện.', level: 'm' },
      { label: 'Bảng nhân quả và tương quan', text: 'Lấy ba biểu đồ trong dashboard công ty có hai đường đi cùng chiều. Với mỗi cặp, viết ba lời giải thích: A gây ra B, B gây ra A, và một biến thứ ba C gây ra cả hai.', level: 'h' },
      { label: 'Rà một quyết định lớn', text: 'Chọn một quyết định quan trọng nhóm bạn sắp chốt. Viết toàn bộ lập luận ủng hộ nó thành dạng đánh số, đưa cho người ngoài nhóm đọc và nhờ họ chỉ ra bước nhảy. Ghi lại bước nào bị bắt.', level: 'h' },
      { label: 'Thử thách 7 ngày: một chỗ nhảy mỗi ngày', text: 'Mỗi ngày trong bảy ngày, tìm đúng một chỗ dùng "do đó", "rõ ràng là", "ai cũng biết" trong tài liệu hoặc tin nhắn quanh bạn, và viết ra câu bị nuốt mất ở chỗ đó. Cuối tuần phân loại các câu bị nuốt xem chúng có chung dạng nào không.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Một lập luận hợp lệ (valid) có thể cho kết luận sai không? Cho ví dụ.',
        a: 'Có, khi tiền đề sai. "Mọi công ty tăng trưởng đều có sản phẩm miễn phí; công ty X tăng trưởng; vậy X có sản phẩm miễn phí" là cấu trúc đúng nhưng tiền đề đầu sai, nên kết luận không đáng tin. Hợp lệ chỉ bảo đảm phần nối, không bảo đảm phần đầu vào.',
      },
      {
        q: 'Phân biệt điều kiện cần và điều kiện đủ bằng một ví dụ trong công việc.',
        a: 'Có tài khoản trả phí là điều kiện cần để dùng tính năng xuất báo cáo, nhưng không đủ — còn phải được cấp quyền admin. Nhầm hai loại này dẫn tới những câu như "chúng ta cứ làm sản phẩm tốt thì khách sẽ tới": sản phẩm tốt là cần, không phải đủ, vì còn thiếu kênh phân phối.',
      },
      {
        q: 'Vì sao một phản ví dụ đủ để bác mệnh đề tổng quát, còn một ví dụ ủng hộ thì không đủ để chứng minh nó?',
        a: 'Vì mệnh đề tổng quát khẳng định về mọi trường hợp, nên chỉ cần một trường hợp trái là nó sai. Ngược lại, một ví dụ hợp chỉ chứng minh mệnh đề đúng ở đúng trường hợp đó, còn vô số trường hợp chưa xét. Đây là lý do trong công việc nên hỏi "có trường hợp nào ngược không" trước khi hỏi "còn ví dụ nào ủng hộ không".',
      },
    ],
    plan7:
      'Ngày 1: học thuộc ba dạng lỗi hay gặp nhất của chính mình bằng cách đọc lại năm email cũ. Ngày 2: tách một lập luận trong công việc thành dòng đánh số. Ngày 3: chỉ luyện việc nêu tiền đề ẩn, không phản biện gì. Ngày 4: dán nhãn cần/đủ/tương quan/nhân quả cho mọi khẳng định trong một cuộc họp. Ngày 5: viết phiên bản mạnh nhất cho ý kiến bạn phản đối nhất. Ngày 6: tìm phản ví dụ cho một niềm tin nghề nghiệp của bạn. Ngày 7: viết lại một kết luận cũ ở phạm vi hẹp hơn và ghi cảm giác khi phải bỏ đi phần đã quen nói.',
    evidence:
      'Bằng chứng cho kỹ năng này không nằm ở chứng chỉ mà ở tài liệu bạn viết. Giữ lại một tài liệu đề xuất trong đó bạn tách rõ phần "dữ kiện đã kiểm", phần "giả định chưa kiểm" và phần "điều kiện khiến đề xuất này hỏng" — đây là thứ có thể đưa vào portfolio và cho người phỏng vấn đọc trực tiếp. Kể kèm một lần bạn ngăn được một bước nhảy logic trong tài liệu của người khác và điều đó đổi kết quả thế nào. Trong CV, ghi vai trò cụ thể ("người phản biện được chỉ định cho tài liệu thiết kế") thay vì ghi tính từ "tư duy logic tốt".',
    references: [
      { label: 'Informal Logic — Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/logic-informal/', type: 'article' },
      { label: 'Fallacies — Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/fallacies/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 3 — Nhận diện thiên kiến nhận thức — Cognitive Biases
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Thiên kiến nhận thức là những sai lệch có quy luật trong phán đoán — không ngẫu nhiên, mà lệch cùng một hướng ở hầu hết mọi người trong cùng một loại tình huống. Điểm quan trọng và hay bị bỏ qua: biết tên thiên kiến gần như không giúp bạn tránh nó, vì thiên kiến vận hành trước khi ý thức kịp can thiệp. Thứ có tác dụng là thiết kế lại quy trình quyết định sao cho sai lệch bị chặn bằng cơ chế, chứ không dựa vào ý chí lúc đó.',
    why: {
      work: 'Những quyết định tốn kém nhất của một tổ chức thường không đến từ thiếu thông tin mà từ việc đã lỡ đầu tư quá nhiều để dừng lại. Có cơ chế chặn sai lệch — tiêu chí chốt trước, người phản biện được chỉ định, điểm dừng định sẵn — là khác biệt giữa một đội biết cắt lỗ và một đội đổ thêm tiền vào hố.',
      interview:
        'Câu "kể về một quyết định bạn làm sai" là chỗ thiên kiến lộ rõ nhất. Ứng viên đổ cho hoàn cảnh sẽ nghe giống mọi ứng viên khác; ứng viên chỉ ra được sai lệch cụ thể trong phán đoán của mình và cơ chế đã thêm vào sau đó thì cho thấy họ học được từ chính mình.',
      study:
        'Ảo giác thông thạo là kẻ thù chính của tự học: đọc lại ghi chú thấy quen thuộc nên tưởng đã nắm, tới lúc thi mới biết chưa nhớ được gì. Nhận ra nó đổi hẳn cách ôn — từ đọc lại sang tự kiểm tra khi chưa mở tài liệu.',
      life: 'Chiêu bán hàng, tin giả và lừa đảo tài chính đều được thiết kế để kích hoạt đúng các thiên kiến này: khan hiếm giả, mỏ neo giá, bằng chứng xã hội. Biết chúng hoạt động ra sao giúp bạn nhận ra cảm giác gấp gáp là do người khác tạo ra, không phải do tình huống.',
    },
    framework: [
      { name: 'Đánh dấu vùng nguy hiểm', detail: 'Không thể canh mọi quyết định. Chọn ra trước những loại quyết định có ba dấu hiệu: bạn đã đầu tư nhiều, kết quả khó đảo ngược, và bạn có lợi ích cá nhân trong một hướng. Chỉ những loại đó mới cần bộ chốt nặng.' },
      { name: 'Chốt tiêu chí trước', detail: 'Viết tiêu chí đánh giá và trọng số trước khi nhìn các phương án. Khi đã biết phương án nào là của ai, tiêu chí có xu hướng bị điều chỉnh sao cho phương án ưa thích thắng, mà người điều chỉnh thật lòng không thấy mình đang làm thế.' },
      { name: 'Chỉ định người phản biện', detail: 'Giao chính thức cho một người vai trò tìm lý do phương án chính sẽ thất bại, và bảo vệ họ khỏi hậu quả xã hội của việc phản đối. Vai trò được giao khác hẳn với lời mời chung chung "mọi người cứ góp ý thoải mái".' },
      { name: 'Đặt điểm dừng định trước', detail: 'Trước khi bắt đầu, viết ra điều kiện cụ thể sẽ khiến dừng hoặc đổi hướng: "nếu sau 6 tuần tỷ lệ dùng lại dưới 15% thì dừng". Định trước để quyết định dừng không phải cạnh tranh với cảm giác tiếc công đã bỏ ra.' },
    ],
    scenario:
      'Một nhóm bốn người làm ứng dụng đặt lịch cho phòng khám đã bỏ ba tháng vào tính năng nhắc lịch bằng cuộc gọi tự động. Số liệu cho thấy chỉ 4% phòng khách bật nó, và trong nhóm bật thì tỷ lệ bệnh nhân đến không khác nhóm không bật. Nhóm định làm tiếp "vì đã gần xong". Người quản lý sản phẩm mở lại tài liệu kick-off nơi họ từng viết ngưỡng "20% bật sau 8 tuần thì tiếp tục", và đặt câu hỏi lại: nếu hôm nay mới bắt đầu, có ai bỏ ba tháng cho tính năng này không? Không ai giơ tay. Nhóm dừng, chuyển hai tuần còn lại sang rút ngắn luồng đặt lịch, và số lịch hoàn tất tăng thấy được trong tháng đó.',
    comparison: [
      { weak: 'Chấm bài test tuyển dụng sau khi đã đọc CV và biết ứng viên tốt nghiệp trường nào.', mature: 'Chấm bài ẩn danh, ghi điểm và nhận xét xong rồi mới mở thông tin ứng viên, và không cho phép sửa điểm sau khi mở.' },
      { weak: 'Sau sự cố, kết luận "lẽ ra phải thấy ngay từ đầu" dựa trên thông tin chỉ có sau khi mọi chuyện đã xảy ra.', mature: 'Dựng lại đúng những gì biết được tại thời điểm quyết định, đánh giá quy trình theo thông tin lúc đó, rồi mới bàn cách thu tín hiệu sớm hơn.' },
      { weak: 'Họp brainstorm mở đầu bằng ý kiến của người có chức vụ cao nhất.', mature: 'Mỗi người viết độc lập trong 8 phút, nộp trước khi thảo luận, và người chủ trì phát biểu sau cùng.' },
    ],
    mistakes: [
      'Dùng tên thiên kiến làm vũ khí trong tranh luận: nói "bạn đang bị confirmation bias" thay vì hỏi bằng chứng nào sẽ làm bạn đổi ý — kết quả là đối phương phòng thủ và cuộc trao đổi đóng lại.',
      'Tin rằng biết nhiều thiên kiến thì miễn nhiễm với chúng; thực tế người tự tin vào tính khách quan của mình lại ít kiểm tra lại quyết định hơn, nên sai lệch chạy thoải mái hơn.',
      'Đặt bộ chốt chống thiên kiến cho mọi quyết định lớn nhỏ, khiến quy trình nặng tới mức mọi người tìm cách đi vòng và cuối cùng không còn chốt nào hoạt động.',
    ],
    worksheet: [
      'Kể tên một quyết định bạn đang tiếp tục chủ yếu vì đã bỏ nhiều công sức vào nó. Ghi số tiền và số giờ đã bỏ ra.',
      'Nếu hôm nay bạn mới biết tới cơ hội này, chưa từng bỏ đồng nào vào, bạn có bắt đầu không? Trả lời có hoặc không, và một câu lý do.',
      'Ai là người duy nhất trong nhóm đã nói ngược với hướng đang đi? Lần cuối bạn hỏi kỹ ý họ là khi nào?',
      'Viết ba con số hoặc quan sát cụ thể sẽ khiến bạn dừng. Ghi kèm ngày sẽ kiểm.',
      'Bạn có lợi ích cá nhân nào (uy tín, thưởng, đã trót hứa với ai) gắn với một trong các phương án không? Viết thẳng ra, không cần cho ai đọc.',
    ],
    exercises: [
      { label: 'Nhật ký linh cảm', text: 'Trong năm ngày, mỗi khi bạn có phán đoán tức thì về một người hoặc một tình huống, ghi lại phán đoán đó cùng dữ kiện thực sự có lúc ấy. Cuối tuần đối chiếu xem phán đoán nào đúng và nó dựa vào gì.', level: 'e' },
      { label: 'Thử mỏ neo', text: 'Trước khi xem báo giá của một nhà cung cấp, tự viết ra con số bạn cho là hợp lý. Sau khi xem, viết lại con số bạn thấy hợp lý. So hai con số và ghi độ dịch chuyển.', level: 'e' },
      { label: 'Đọc phía đối lập một tuần', text: 'Chọn một quan điểm nghề nghiệp bạn giữ chắc. Trong một tuần chỉ đọc nguồn phản đối nó, ghi ba luận điểm bạn thấy khó bác nhất.', level: 'e' },
      { label: 'Pre-mortem 30 phút', text: 'Với một dự án đang chạy, tập hợp nhóm và giả định sáu tháng nữa nó đã thất bại hoàn toàn. Mỗi người viết độc lập lý do thất bại trong 10 phút rồi gom lại, xếp theo mức độ có thể phòng ngừa.', level: 'm' },
      { label: 'Chấm ẩn danh', text: 'Lần tới khi nhóm phải chọn giữa nhiều đề xuất, gỡ tên tác giả khỏi tài liệu, chốt tiêu chí trước, chấm xong mới mở tên. Ghi lại có kết quả nào khác với dự đoán ban đầu không.', level: 'm' },
      { label: 'Điểm dừng viết trước', text: 'Với một sáng kiến bạn sắp bắt đầu, viết ngay hôm nay ngưỡng dừng và ngày kiểm, gửi cho một người khác giữ. Đến ngày đó, để họ hỏi bạn kết quả.', level: 'm' },
      { label: 'Đo sai lệch của chính mình', text: 'Ghi 10 dự đoán có thể kiểm được trong công việc (ngày giao hàng, kết quả một cuộc gọi, số đăng ký tuần tới) kèm mức tin cậy phần trăm. Sau 4 tuần, tính xem trong các dự đoán bạn ghi 80% thì thực tế đúng bao nhiêu phần trăm.', level: 'h' },
      { label: 'Thử thách 7 ngày: một câu hỏi ngược mỗi ngày', text: 'Bảy ngày, mỗi ngày chọn một điều bạn tin chắc trong công việc và đi hỏi đúng một người có khả năng nghĩ khác bạn nhất. Ghi lại câu họ nói mà bạn không chuẩn bị trước để nghe. Cuối tuần đánh giá xem niềm tin nào bị lung lay thật.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao chi phí đã bỏ ra (sunk cost) không nên vào phép tính quyết định tiếp tục hay dừng?',
        a: 'Vì quyết định chỉ ảnh hưởng được tương lai: bạn đang chọn giữa chi phí còn lại và giá trị còn lại. Tiền và thời gian đã tiêu là như nhau ở cả hai lựa chọn, nên chúng không tạo ra khác biệt nào. Đưa chúng vào chỉ khiến bạn tiếp tục đầu tư vào phương án tệ để tránh cảm giác lãng phí — và làm phần lãng phí lớn thêm.',
      },
      {
        q: 'Hai cơ chế nào chặn hiệu ứng hào quang (halo effect) khi tuyển dụng, và vì sao chúng hiệu quả hơn việc "cố gắng khách quan"?',
        a: 'Chấm ẩn danh trước khi biết danh tính, và chấm từng tiêu chí độc lập bởi nhiều người trước khi họp gộp. Chúng hiệu quả hơn vì tác động lên thứ tự thông tin đến với người chấm, chứ không dựa vào việc người chấm nhận ra mình đang thiên vị — điều mà theo định nghĩa họ thường không nhận ra.',
      },
      {
        q: 'Khi nào thì không nên dựng bộ chốt chống thiên kiến?',
        a: 'Khi quyết định đảo ngược được dễ dàng và chi phí sai thấp. Ví dụ chọn tiêu đề cho một bài đăng: cứ thử rồi đổi. Bộ chốt tốn thời gian và uy tín nội bộ, nên để dành cho quyết định khó đảo ngược, tốn kém, hoặc có xung đột lợi ích rõ.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê ba quyết định đang mở và đánh dấu cái nào rơi vào vùng nguy hiểm (đã đầu tư nhiều, khó đảo, có lợi ích cá nhân). Ngày 2: với cái nguy hiểm nhất, viết tiêu chí và trọng số trước khi mở lại các phương án. Ngày 3: chạy pre-mortem 30 phút, tự làm hoặc với một người. Ngày 4: đi hỏi người phản đối hướng hiện tại và chỉ nghe, không phản biện. Ngày 5: viết điểm dừng kèm ngày kiểm, gửi cho một người giữ. Ngày 6: ghi 10 dự đoán kèm mức tin cậy để đo hiệu chỉnh về sau. Ngày 7: rà lại tuần và chọn đúng một cơ chế bạn sẽ giữ lâu dài — nhiều hơn một thường không sống nổi.',
    evidence:
      'Thứ trưng ra được là cơ chế, không phải kiến thức. Lưu lại một biên bản pre-mortem thật, một bảng tiêu chí chấm được chốt trước khi mở phương án, hoặc một tài liệu ghi ngưỡng dừng đã dùng để cắt một dự án — đây là hiện vật đưa vào portfolio quản lý sản phẩm hoặc quản lý dự án. Trong phỏng vấn, câu chuyện mạnh nhất là một lần bạn dừng thứ chính mình đã đầu tư: nêu số tiền hoặc thời gian còn lại được cứu, và cơ chế đã cho phép quyết định đó xảy ra mà không cần ai phải mất mặt.',
    references: [
      { label: 'Farnam Street — Mental Models', url: 'https://fs.blog/mental-models/', type: 'article' },
      { label: 'The Decision Lab — thư viện thiên kiến nhận thức (cognitive biases)', url: 'https://thedecisionlab.com/biases', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 4 — Tư duy giải quyết vấn đề — Problem Solving
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Giải quyết vấn đề là một vòng học có kỷ luật chứ không phải khoảnh khắc loé sáng: mô tả khoảng cách giữa hiện trạng và mong muốn bằng số, tìm cơ chế đang tạo ra khoảng cách đó, can thiệp nhỏ nhất đủ để kiểm chứng cơ chế, đo, rồi cập nhật hiểu biết. Điều phân biệt người làm nghề với người xoay xở là họ tách rõ ba thứ hay bị trộn: triệu chứng, cơ chế và giải pháp — và không cho phép mình nhảy thẳng từ thứ nhất sang thứ ba.',
    why: {
      work: 'Giá trị bạn tạo ra ở công ty gần như bằng độ khó của những vấn đề bạn xử lý được mà không cần ai gỡ hộ. Một quy trình lặp lại được cũng có nghĩa bạn bàn giao được: người khác đọc lại quá trình bạn làm và tiếp tục được, thay vì mọi thứ phụ thuộc vào trực giác của riêng bạn.',
      interview:
        'Ở vòng case, người phỏng vấn chấm chủ yếu quá trình: bạn có làm rõ đề bài trước không, có phân đoạn dữ liệu không, có so sánh phương án theo chi phí và rủi ro không. Đưa ra đáp án đúng bằng cách đoán thường được điểm thấp hơn đi đúng quy trình và ra đáp án gần đúng.',
      study:
        'Khi bí một bài tập khó, đa số người học đọc lại lý thuyết từ đầu — cách tốn thời gian nhất. Quy trình chẩn đoán dạy bạn khoanh vùng: mình sai ở hiểu đề, ở chọn công cụ, hay ở thao tác tính toán, rồi chỉ ôn đúng phần đó.',
      life: 'Từ chuyện xe hay chết máy đến chuyện tháng nào cũng hết tiền trước ngày lương, cách tiếp cận là một: đo trước khi sửa, sửa một thứ một lần, và giữ lại bản ghi để lần sau không phải dò lại từ đầu.',
    },
    framework: [
      { name: 'Đo khoảng cách', detail: 'Viết hiện trạng và mong muốn bằng cùng một đơn vị, kèm mốc thời gian: "tỷ lệ hoàn tất đơn 62%, mục tiêu 75% trong quý này". Không có con số thì mọi tranh luận sau đó chỉ là tranh luận về cảm giác.' },
      { name: 'Phân đoạn để khoanh vùng', detail: 'Cắt dữ liệu theo các trục có khả năng giải thích: thiết bị, kênh, khu vực, thời điểm, nhóm người dùng, phiên bản. Mục tiêu là tìm lát cắt trong đó vấn đề tập trung, vì nó chỉ thẳng vào cơ chế.' },
      { name: 'Nêu giả thuyết cơ chế', detail: 'Viết câu dạng "X gây ra Y thông qua Z" và kèm một dự đoán kiểm được: nếu giả thuyết đúng thì ta phải thấy thêm dấu hiệu gì. Giả thuyết không kèm dự đoán thì không loại bỏ được.' },
      { name: 'Can thiệp nhỏ nhất', detail: 'Chọn thay đổi rẻ nhất, đảo ngược được, tác động tới đúng một biến. Thay đổi năm thứ cùng lúc thì dù kết quả tốt bạn cũng không biết nhờ cái nào, và lần sau không lặp lại được.' },
      { name: 'Đo và chuẩn hoá', detail: 'So kết quả với đường nền, quyết định giữ, bỏ hay quay lại bước chẩn đoán. Nếu giữ, viết lại thành quy trình hoặc chốt kiểm tự động để vấn đề không quay lại theo cách cũ.' },
    ],
    scenario:
      'Một cửa hàng bán đồ thể thao online thấy tỷ lệ hoàn tất thanh toán tụt từ 3,1% xuống 2,4% trong hai tuần. Phản xạ đầu tiên của nhóm là "thiết kế lại trang thanh toán". Người phụ trách vận hành đề nghị phân đoạn trước: theo thiết bị, theo trình duyệt, theo phương thức thanh toán. Số liệu cho thấy sụt tập trung hoàn toàn ở Safari trên iPhone, bắt đầu đúng ngày phát hành phiên bản web mới. Giả thuyết: một thư viện mới không chạy trên phiên bản Safari cũ khiến nút thanh toán không phản hồi. Họ bật lại phiên bản cũ cho riêng nhóm đó trong một ngày để kiểm, tỷ lệ trở lại 3,0%. Bản vá thật mất hai giờ, và nhóm thêm một chốt kiểm tự động chạy trên ba trình duyệt trước mỗi lần phát hành.',
    comparison: [
      { weak: 'Bắt đầu bằng câu "chắc là do..." rồi đi tìm dữ liệu ủng hộ câu đó.', mature: 'Bắt đầu bằng ba giả thuyết cạnh tranh và tìm lát cắt dữ liệu có thể loại bớt ít nhất một cái.' },
      { weak: 'Sửa năm thứ cùng lúc cho nhanh, kết quả tốt lên nhưng không ai biết nhờ đâu.', mature: 'Sửa từng thứ một, ghi lại đường nền trước mỗi lần sửa, chấp nhận chậm hơn một chút để lần sau lặp lại được.' },
      { weak: 'Báo cáo tiến độ bằng hoạt động: "đã họp 4 buổi, đã rà 12 module".', mature: 'Báo cáo bằng trạng thái tri thức: "đã loại được 2/4 giả thuyết, giả thuyết còn lại sẽ được kiểm bằng phép thử X vào thứ Năm".' },
    ],
    mistakes: [
      'Nhảy từ triệu chứng sang giải pháp yêu thích: nghe "khách phàn nàn chậm" là lập tức đề xuất viết lại hệ thống, trong khi chưa ai đo xem chậm ở khâu nào và với bao nhiêu phần trăm người dùng.',
      'Đo hoạt động thay vì kết quả — đếm số cuộc họp, số ticket đã đóng, số dòng tài liệu — nên nhóm bận rộn suốt mà khoảng cách ban đầu không hề thu hẹp.',
      'Không ghi lại đường nền trước khi can thiệp, nên sau đó không thể phân biệt cải thiện thật với dao động bình thường của số liệu.',
    ],
    worksheet: [
      'Viết vấn đề bạn đang giải bằng đúng một câu có số: hiện trạng bao nhiêu, mong muốn bao nhiêu, hạn nào.',
      'Liệt kê ba trục có thể cắt dữ liệu này. Trục nào bạn chưa cắt thử vì lười lấy dữ liệu hơn là vì nó không liên quan?',
      'Viết ba giả thuyết cơ chế theo mẫu "X gây ra Y thông qua Z", xếp theo mức độ dễ kiểm chứ không theo mức độ bạn tin.',
      'Với giả thuyết đứng đầu, phép thử rẻ nhất để loại nó là gì? Ghi chi phí, thời gian và ai làm.',
      'Đường nền hiện tại là con số nào, đo trong khoảng thời gian nào? Ghi ra trước khi bạn động vào bất cứ thứ gì.',
    ],
    exercises: [
      { label: 'Một câu có số', text: 'Lấy ba vấn đề đang được nói tới trong nhóm bạn dưới dạng mơ hồ và viết lại mỗi cái thành một câu có hiện trạng, mong muốn và hạn thời gian.', level: 'e' },
      { label: 'Cắt bốn trục', text: 'Chọn một chỉ số đang xấu đi. Cắt nó theo bốn trục khác nhau và ghi lại trục nào cho thấy chênh lệch lớn nhất giữa các nhóm.', level: 'e' },
      { label: 'Ba giả thuyết cạnh tranh', text: 'Với một vấn đề trong công việc, viết ba giả thuyết cơ chế khác nhau và với mỗi cái ghi một quan sát sẽ xuất hiện nếu nó đúng nhưng không xuất hiện nếu hai cái kia đúng.', level: 'e' },
      { label: 'Phép thử một ngày', text: 'Thiết kế một can thiệp có thể triển khai và đảo ngược trong 24 giờ, tác động đúng một biến. Chạy nó và ghi kết quả so với đường nền.', level: 'm' },
      { label: 'Nhật ký chẩn đoán', text: 'Với một vấn đề kéo dài hơn một tuần, giữ một trang ghi ngày, giả thuyết đang kiểm, dữ liệu thu được và giả thuyết bị loại. Đưa cho một đồng nghiệp đọc và hỏi họ có theo được mạch không.', level: 'm' },
      { label: 'Đóng vai người mới', text: 'Trình bày lại vấn đề bạn đang giải cho một người hoàn toàn ngoài lĩnh vực trong 5 phút. Ghi lại ba câu hỏi họ hỏi mà bạn chưa từng tự hỏi.', level: 'm' },
      { label: 'Gỡ một vấn đề tồn đọng', text: 'Chọn một vấn đề nhóm bạn đã sống chung nhiều tháng vì "không có thời gian". Chạy đủ năm bước trong hai tuần và viết một trang tổng kết gồm cơ chế, can thiệp, kết quả đo và chốt kiểm chống tái diễn.', level: 'h' },
      { label: 'Thử thách 7 ngày: một khoảng cách mỗi ngày', text: 'Mỗi ngày trong bảy ngày, chọn một khoảng cách nhỏ trong công việc hoặc đời sống (thời gian chuẩn bị buổi sáng, số email tồn, thời gian build), đo nó, đưa ra một giả thuyết, thử một can thiệp và đo lại. Cuối tuần, so sánh xem loại vấn đề nào bạn hay bỏ qua bước đo nhất.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao phải phân đoạn dữ liệu trước khi đề xuất giải pháp?',
        a: 'Vì một chỉ số tổng là trung bình của nhiều nhóm rất khác nhau. Nếu vấn đề chỉ nằm ở một nhóm nhỏ, giải pháp áp cho toàn bộ vừa tốn kém vừa có thể làm hỏng trải nghiệm của nhóm đang bình thường. Phân đoạn thường biến một dự án ba tháng thành một bản vá hai giờ.',
      },
      {
        q: 'Thế nào là một giả thuyết tốt trong giải quyết vấn đề?',
        a: 'Là giả thuyết nêu cơ chế ("X gây ra Y thông qua Z"), dự đoán một quan sát cụ thể sẽ có nếu nó đúng, và quan trọng nhất là có thể sai — tức tồn tại dữ liệu sẽ loại bỏ nó. Câu như "trải nghiệm chưa tốt" không phải giả thuyết vì không có dữ liệu nào bác được nó.',
      },
      {
        q: 'Sau khi can thiệp và chỉ số cải thiện, còn bước nào chưa xong?',
        a: 'Ba việc: kiểm xem cải thiện có vượt dao động bình thường của chỉ số không; xác nhận không có tác dụng phụ ở chỉ số khác; và chuẩn hoá — biến can thiệp thành quy trình hoặc chốt kiểm tự động, kèm ghi lại cơ chế, để vấn đề không quay lại và người sau không phải dò lại từ đầu.',
      },
    ],
    plan7:
      'Ngày 1: chọn một vấn đề thật và viết nó thành một câu có số kèm đường nền. Ngày 2: cắt dữ liệu theo bốn trục, ghi trục nào lộ chênh lệch. Ngày 3: viết ba giả thuyết cơ chế kèm dự đoán kiểm được. Ngày 4: thiết kế phép thử rẻ nhất loại bỏ được một giả thuyết. Ngày 5: chạy phép thử và ghi dữ liệu thô, chưa diễn giải. Ngày 6: diễn giải, quyết định giữ hay quay lại chẩn đoán. Ngày 7: viết một trang bàn giao gồm cơ chế, can thiệp, kết quả và chốt kiểm chống tái diễn.',
    evidence:
      'Nhật ký chẩn đoán chính là bằng chứng. Chọn hai vấn đề bạn đã gỡ, viết mỗi cái một trang theo cấu trúc: khoảng cách bằng số → lát cắt lộ ra vấn đề → giả thuyết và cách loại bỏ → can thiệp → kết quả đo → chốt chống tái diễn. Đưa được hai trang này cho người phỏng vấn đọc mạnh hơn mọi cách kể miệng, và dùng lại được cho portfolio ở gần như mọi ngành. Trong CV, ghi kết quả kèm cơ chế: "Khoanh vùng sụt thanh toán về một trình duyệt bằng phân đoạn dữ liệu, vá trong ngày, khôi phục 0,7 điểm phần trăm tỷ lệ hoàn tất".',
    references: [
      { label: 'Farnam Street — Second-Order Thinking', url: 'https://fs.blog/second-order-thinking/', type: 'article' },
      { label: 'Foundation for Critical Thinking', url: 'https://www.criticalthinking.org/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 5 — Xác định đúng vấn đề — Problem Framing
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Framing là hành động quyết định thứ gì được coi là vấn đề, ai được tính là người chịu ảnh hưởng, và cái gì sẽ được gọi là thành công. Nó xảy ra dù bạn có ý thức hay không — mọi câu mô tả vấn đề đều đã chứa sẵn một tập giải pháp và loại bỏ mọi thứ ngoài tập đó. Vì thế đổi khung thường mở ra phương án rẻ hơn nhiều so với việc tối ưu hết sức trong khung cũ, và một giờ dành cho việc viết lại câu vấn đề thường đáng giá hơn một tuần lập trình.',
    why: {
      work: 'Rất nhiều yêu cầu đến với bạn dưới dạng giải pháp đã đóng gói: "làm cho tôi một chatbot", "thêm nút xuất Excel". Người biết framing lùi lại một bước hỏi công việc thật đằng sau, và thường giao được thứ vừa rẻ hơn vừa giải quyết đúng hơn — đó là khác biệt giữa người thực thi yêu cầu và người được tin để giao vấn đề.',
      interview:
        'Các case phỏng vấn hay được ra dưới dạng mơ hồ có chủ đích ("doanh thu giảm, bạn làm gì"). Người vội vẽ giải pháp thường trượt; người hỏi ai bị ảnh hưởng, mức độ bao nhiêu, ràng buộc là gì trước khi đề xuất thường được đánh giá cao hơn hẳn, kể cả khi thời gian không đủ để đi tới lời giải.',
      study:
        'Học một chủ đề rộng dễ trôi vô định. Đặt khung dưới dạng câu hỏi cụ thể ("tôi cần đọc được biểu đồ trong báo cáo tài chính của công ty mình" thay vì "học tài chính") biến việc học thành thứ có điểm dừng và có cách kiểm.',
      life: 'Trong xung đột gia đình, phần lớn thời gian bị tiêu vào việc tranh cãi trong một khung sai ("ai đúng ai sai"). Đặt lại thành "chúng ta đang cùng muốn gì và điều gì đang cản" không phải mẹo mềm mỏng — nó thực sự đổi tập giải pháp có sẵn trên bàn.',
    },
    framework: [
      { name: 'Viết khoảng cách trần trụi', detail: 'Một câu: ai, gặp chuyện gì, khi nào, mức độ bao nhiêu, hậu quả ra sao. Chỉ dùng thứ quan sát được. Nếu trong câu đã có tên một công cụ hoặc một tính năng thì đó là giải pháp trá hình, phải viết lại.' },
      { name: 'Tách công việc khỏi yêu cầu', detail: 'Hỏi người yêu cầu: nếu có thứ này rồi thì bạn sẽ làm được gì mà giờ chưa làm được? Câu trả lời cho biết công việc thật họ đang cố hoàn thành, và thường có nhiều đường tới nó rẻ hơn cách họ đề xuất.' },
      { name: 'Xoay bốn góc nhìn', detail: 'Viết lại vấn đề lần lượt bằng ngôn ngữ của người dùng cuối, của bộ phận vận hành, của tài chính, và của người chịu rủi ro. Bốn phiên bản gần như luôn khác nhau, và chỗ chúng mâu thuẫn chính là chỗ cần quyết định.' },
      { name: 'Đổi biên và đổi bậc', detail: 'Thử nới rộng khung (vấn đề này có phải một phần của vấn đề lớn hơn không) và thu hẹp khung (có phải nó chỉ xảy ra với một nhóm nhỏ không). Đổi bậc thường lộ ra rằng khung ban đầu vừa quá rộng để giải vừa quá hẹp để đáng giải.' },
      { name: 'Chốt khung kiểm chứng được', detail: 'Chọn phiên bản có thể gắn với một chỉ số và một ngày. Viết thành câu "Chúng ta coi là thành công nếu ... đạt ... trước ngày ...", và cho những người liên quan xác nhận bằng văn bản trước khi ai bắt tay làm.' },
    ],
    scenario:
      'Một công ty giao đồ ăn nhận nhiều phàn nàn và giám đốc vận hành yêu cầu "làm chatbot chăm sóc khách hàng". Trưởng nhóm hỗ trợ không từ chối, mà xin ba ngày đọc 300 hội thoại gần nhất và phân loại. Kết quả: 61% câu hỏi chỉ là "đơn của tôi tới đâu rồi". Anh viết lại khung từ "cần chatbot" thành "khách không biết trạng thái đơn sau khi đặt, nên nhắn tin hỏi, tạo 61% khối lượng hỗ trợ vào giờ cao điểm". Với khung mới, phương án rẻ nhất là gửi tin nhắn tự động ở ba mốc và một trang tra cứu bằng số điện thoại. Hai tuần triển khai, khối lượng hội thoại giảm hơn một nửa, và ý tưởng chatbot được hoãn lại vì phần còn lại quá đa dạng để tự động hoá.',
    comparison: [
      { weak: 'Nhận yêu cầu "thêm tính năng X" và bắt tay ước lượng công sức ngay.', mature: 'Hỏi trước: nếu có X, bạn sẽ làm được gì mà nay chưa làm được, và hiện bạn đang xoay xở bằng cách nào?' },
      { weak: 'Câu vấn đề dùng từ bao trùm như "cải thiện trải nghiệm người dùng".', mature: 'Câu vấn đề chỉ đích danh một nhóm, một khoảnh khắc và một con số: "người mua lần đầu bỏ giỏ hàng ở bước nhập địa chỉ, 43% trên di động".' },
      { weak: 'Ai có chức vụ cao nhất trong phòng thì khung của người đó thắng.', mature: 'Đặt song song ba khung do ba vai trò khác nhau viết, rồi chọn bằng tiêu chí đã thống nhất: đo được, kiểm chứng được, gắn với kết quả.' },
    ],
    mistakes: [
      'Nhét sẵn giải pháp vào câu vấn đề ("vấn đề là chúng ta chưa có app di động"), khiến mọi cuộc thảo luận sau đó chỉ còn bàn cách làm app chứ không bàn xem app có phải đường đi đúng không.',
      'Đóng khung quá sớm để có cảm giác tiến triển, rồi ba tháng sau phát hiện chỉ số cải thiện nhưng người dùng vẫn rời bỏ vì vấn đề thật nằm chỗ khác.',
      'Đổi khung liên tục giữa chừng mà không ghi lại, khiến nhóm mất phương hướng và không ai còn biết đang đo cái gì so với cái gì.',
    ],
    worksheet: [
      'Chép nguyên văn một yêu cầu bạn vừa nhận. Khoanh tròn mọi danh từ chỉ công cụ hoặc tính năng trong đó.',
      'Nếu người yêu cầu có ngay thứ họ xin, ngày làm việc của họ sẽ khác đi cụ thể ở chỗ nào? Viết một câu bắt đầu bằng "họ sẽ có thể...".',
      'Hiện tại họ đang xoay xở bằng cách gì? Cách xoay xở đó tốn bao nhiêu phút mỗi ngày, cho bao nhiêu người?',
      'Viết lại vấn đề ba lần: bằng lời người dùng cuối, bằng lời bộ phận vận hành, bằng lời người giữ ngân sách. Chỗ nào ba phiên bản mâu thuẫn?',
      'Hoàn thành câu: "Chúng ta coi là thành công nếu ___ đạt ___ trước ngày ___". Ai phải xác nhận câu này trước khi bắt đầu?',
    ],
    exercises: [
      { label: 'Lột giải pháp khỏi yêu cầu', text: 'Lấy năm yêu cầu gần nhất trong hộp thư hoặc backlog. Với mỗi cái, viết lại thành câu vấn đề không chứa tên bất kỳ công cụ hay tính năng nào.', level: 'e' },
      { label: 'Năm câu hỏi làm rõ', text: 'Chuẩn bị sẵn một bộ năm câu hỏi bạn sẽ hỏi trước mọi yêu cầu mới (ai, bao nhiêu người, tần suất, hậu quả, đang xoay xở ra sao). Dùng nó cho ba yêu cầu tới và ghi câu trả lời.', level: 'e' },
      { label: 'Ba khung cho một chuyện', text: 'Chọn một vấn đề trong đời sống cá nhân (tiền, sức khoẻ, quan hệ) và viết ba khung khác nhau cho nó. Ghi xem mỗi khung mở ra những phương án nào mà hai khung kia không có.', level: 'e' },
      { label: 'Phỏng vấn công việc thật', text: 'Ngồi với một người vừa yêu cầu bạn làm gì đó, hỏi liên tiếp "để làm gì" ba lần một cách lịch sự. Ghi lại câu trả lời ở lớp thứ ba và so với yêu cầu ban đầu.', level: 'm' },
      { label: 'Đọc 50 phản hồi thô', text: 'Lấy 50 phản hồi, ticket hoặc bình luận gần nhất, phân loại thủ công thành nhóm và đếm. Viết lại câu vấn đề của nhóm bạn dựa trên phân bố thực tế thay vì ấn tượng.', level: 'm' },
      { label: 'Đổi bậc khung', text: 'Với một vấn đề đang xử lý, viết một phiên bản rộng hơn một bậc và một phiên bản hẹp hơn một bậc. Đánh giá cả ba theo chi phí giải và giá trị nếu giải được.', level: 'm' },
      { label: 'Biên bản chốt khung', text: 'Soạn một trang gồm câu vấn đề, phạm vi loại trừ, tiêu chí thành công có số và ngày, rồi lấy chữ ký hoặc xác nhận của ba bên liên quan trước khi khởi động một việc thật.', level: 'h' },
      { label: 'Thử thách 7 ngày: mỗi ngày một khung sai', text: 'Bảy ngày, mỗi ngày tìm một câu mô tả vấn đề đang lưu hành quanh bạn có chứa giải pháp trá hình, viết lại nó cho đúng, và gửi cho người đã nói. Cuối tuần ghi lại phản ứng nào hữu ích nhất và khung nào thực sự được đổi.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Làm sao nhận ra một câu "vấn đề" thực chất là một giải pháp trá hình?',
        a: 'Kiểm ba dấu hiệu: câu đó chứa tên một công cụ hoặc tính năng; nó không nêu ai đang chịu thiệt và mức độ bao nhiêu; và không thể tưởng tượng một cách khác để giải nó. Ví dụ "vấn đề là chúng ta chưa có CRM" hội đủ cả ba — viết lại phải thành "đội sale không biết ai đã liên hệ khách nào, dẫn tới trung bình 3 lần gọi trùng mỗi tuần".',
      },
      {
        q: 'Khi nào nên nới rộng khung và khi nào nên thu hẹp?',
        a: 'Nới rộng khi các giải pháp trong khung hiện tại đều nhỏ giọt và bạn nghi vấn đề này chỉ là triệu chứng của thứ lớn hơn. Thu hẹp khi vấn đề mô tả quá chung nên không đo được, hoặc khi dữ liệu cho thấy nó chỉ tập trung ở một nhóm — lúc đó khung hẹp cho phép giải rẻ và kiểm chứng nhanh.',
      },
      {
        q: 'Vì sao cần lấy xác nhận bằng văn bản về tiêu chí thành công trước khi bắt đầu?',
        a: 'Vì tiêu chí thành công có xu hướng trôi theo kết quả: khi kết quả tốt, mọi người nhớ mình đã kỳ vọng đúng thế; khi kết quả xấu, mọi người nhớ mình đã kỳ vọng khác. Bản chốt trước biến cuộc tranh luận cuối dự án từ "ai nhớ đúng" thành "so với dòng đã viết, ta đạt hay không đạt".',
      },
    ],
    plan7:
      'Ngày 1: thu thập năm yêu cầu gần nhất bạn nhận được, nguyên văn. Ngày 2: khoanh giải pháp trá hình trong từng cái và viết lại thành câu khoảng cách. Ngày 3: chọn một cái và đi hỏi người yêu cầu ba lớp "để làm gì". Ngày 4: viết lại vấn đề đó theo bốn góc nhìn. Ngày 5: thử một khung rộng hơn và một khung hẹp hơn, ước lượng chi phí giải cho từng khung. Ngày 6: soạn biên bản chốt khung với tiêu chí có số và ngày. Ngày 7: gửi cho các bên liên quan xác nhận, ghi lại điều họ sửa — chỗ họ sửa là chỗ bạn hiểu sai bối cảnh của họ.',
    evidence:
      'Hiện vật mạnh nhất là một trang so sánh "khung ban đầu" và "khung sau khi làm rõ", kèm chênh lệch chi phí giữa hai đường đi. Ví dụ: yêu cầu ban đầu ước lượng 3 tháng làm chatbot, khung sau khi phân loại 300 hội thoại dẫn tới giải pháp 2 tuần và giảm 61% khối lượng hỗ trợ. Trong phỏng vấn, kể theo trình tự: yêu cầu nhận được → điều bạn hỏi thêm → dữ liệu đã đi lấy → khung mới → chi phí tiết kiệm. Trong CV, tránh viết "kỹ năng phân tích yêu cầu"; viết thẳng "Phân loại 300 hội thoại hỗ trợ để định nghĩa lại yêu cầu, thay dự án 3 tháng bằng giải pháp 2 tuần".',
    references: [
      { label: 'Design Thinking — IDEO', url: 'https://designthinking.ideo.com/', type: 'article' },
      { label: 'Farnam Street — Mental Models', url: 'https://fs.blog/mental-models/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 6 — Phân tích nguyên nhân gốc — Root Cause Analysis
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Nguyên nhân gốc không phải "nguyên nhân sâu xa nhất" mà là điểm can thiệp thoả hai điều kiện: nếu thay đổi nó thì xác suất sự cố tái diễn giảm rõ rệt, và tổ chức thực sự có quyền thay đổi nó. Vì thế đi mãi xuống dưới cho tới "văn hoá công ty chưa tốt" là đi quá xa và mất tác dụng, còn dừng ở "bạn A quên bước 3" là chưa tới, vì con người sẽ còn quên. Phân tích tốt luôn kết thúc bằng thay đổi trong hệ thống, không phải trong lời hứa của một cá nhân.',
    why: {
      work: 'Đội nào không làm việc này tử tế thì sống trong vòng lặp: cùng một loại sự cố quay lại mỗi quý, mỗi lần lại "rút kinh nghiệm sâu sắc". Một bản phân tích nghiêm túc đổi vòng lặp đó thành một danh sách chốt kiểm ngày càng dài ra, và số sự cố lặp lại giảm dần một cách đo được.',
      interview:
        'Câu "kể về một sự cố bạn từng xử lý" là chỗ dễ lộ nhất. Người kể theo hướng đổ lỗi hoặc kể mình anh hùng đều bị trừ điểm. Người dựng được dòng thời gian, nêu giả thuyết đã loại, phân biệt việc chữa cháy với việc sửa hệ thống, thì cho thấy họ dùng được ở môi trường vận hành thật.',
      study:
        'Khi làm sai một bài kiểm tra, câu hỏi hữu ích không phải "sai câu nào" mà "cơ chế nào khiến tôi sai": đọc lướt đề, thuộc công thức mà không biết điều kiện áp dụng, hay hết giờ vì phân bổ sai. Mỗi cơ chế cần một cách sửa khác nhau, và sửa nhầm cơ chế thì học thêm bao nhiêu cũng vô ích.',
      life: 'Chuyện đi làm muộn ba lần một tuần hiếm khi vì "thiếu ý chí". Lần ngược chuỗi thường ra một mắt xích cụ thể — ngủ muộn vì xem điện thoại trên giường, hoặc chuẩn bị đồ vào buổi sáng thay vì tối hôm trước — và mắt xích đó sửa được bằng bố trí, không cần nghị lực.',
    },
    framework: [
      { name: 'Đóng băng bằng chứng', detail: 'Trước khi phán đoán, thu và khoá lại: log, ảnh chụp màn hình, mốc thời gian chính xác, phiên bản đang chạy, phạm vi ảnh hưởng, ai làm gì lúc mấy giờ. Bằng chứng bị ghi đè hoặc bị nhớ lại theo trí nhớ là lý do phổ biến nhất khiến phân tích đi vào ngõ cụt.' },
      { name: 'Dựng dòng thời gian', detail: 'Xếp mọi sự kiện theo trục thời gian có ghi nguồn: thay đổi nào được triển khai lúc nào, cảnh báo đầu tiên kêu lúc nào, ai phát hiện, phát hiện bằng cách nào. Khoảng cách giữa "sự cố bắt đầu" và "có người biết" thường là phát hiện giá trị nhất của cả buổi.' },
      { name: 'Kiểm giả thuyết hai chiều', detail: 'Với mỗi giả thuyết, tìm cả bằng chứng ủng hộ lẫn bằng chứng bác bỏ. Nếu không có dữ liệu nào có thể bác một giả thuyết thì nó chưa dùng được, và nhóm đang xây kết luận trên một câu chuyện dễ chịu.' },
      { name: 'Hỏi tại sao có điều kiện dừng', detail: 'Đi ngược chuỗi nguyên nhân, nhưng dừng ở tầng cuối cùng mà tổ chức còn có quyền thay đổi trong quý này. Ghi rõ các tầng dưới nữa để không mất thông tin, nhưng không biến chúng thành hành động.' },
      { name: 'Sửa ba lớp', detail: 'Mỗi kết luận phải sinh ra ba loại việc: khôi phục ngay, ngăn tái diễn (đổi thứ tự, thêm ràng buộc, tự động hoá), và rút ngắn thời gian phát hiện (cảnh báo, chốt kiểm). Thiếu lớp thứ ba thì lần sau vẫn mất từng ấy giờ để biết mình đang hỏng.' },
    ],
    scenario:
      'Một chuỗi nhà hàng bốn chi nhánh mất hai giờ không nhận được đơn online vào tối thứ Bảy. Quản lý ban đầu kết luận "bạn thu ngân quên bật máy in đơn". Người phụ trách vận hành dựng dòng thời gian từ log của phần mềm đặt món: đơn vẫn vào hệ thống lúc 18:12, máy in ngừng phản hồi lúc 18:15, nhưng phải tới 20:10 mới có người phát hiện — vì cách duy nhất để biết là có ai đó nhìn vào máy in. Ba lớp sửa được viết ra: khôi phục là in tay từ màn hình; ngăn tái diễn là chuyển sang hiển thị đơn trên màn hình bếp không phụ thuộc máy in; rút ngắn phát hiện là báo động trên điện thoại quản lý nếu 10 phút không có đơn nào được xác nhận trong khung giờ cao điểm. Quý sau, sự cố tương tự xảy ra ở một chi nhánh khác và được xử lý trong 11 phút.',
    comparison: [
      { weak: 'Kết luận "do lỗi con người" rồi kết thúc bằng nhắc nhở và một buổi đào tạo lại.', mature: 'Coi lỗi con người là dữ liệu đầu vào: hỏi vì sao thao tác sai lại dễ làm hơn thao tác đúng, rồi đổi thiết kế để thao tác đúng là mặc định.' },
      { weak: 'Hỏi "tại sao" năm lần cho tới khi ra một câu nghe rất sâu sắc rồi dừng, không kiểm chứng gì.', mature: 'Mỗi lần "tại sao" phải kèm bằng chứng cụ thể; tầng nào không có bằng chứng thì ghi là giả thuyết và giao người đi kiểm.' },
      { weak: 'Báo cáo sự cố viết xong, gửi email, không ai đọc lại và không sinh ra việc nào có người chịu trách nhiệm.', mature: 'Mỗi kết luận sinh ra một việc có tên người, hạn ngày và cách xác nhận đã xong; tháng sau rà lại xem việc nào chưa làm và vì sao.' },
    ],
    mistakes: [
      'Dừng phân tích ngay khi tìm thấy một nguyên nhân đủ hợp lý, trong khi sự cố thật thường cần nhiều điều kiện xảy ra đồng thời — sửa một cái vẫn để lại bẫy cho lần sau.',
      'Biến buổi phân tích thành phiên truy trách nhiệm, khiến người nắm rõ chi tiết nhất trở thành người có động cơ giấu chi tiết nhất, và chất lượng dữ liệu sụp ngay từ đầu.',
      'Chỉ sửa lớp ngăn tái diễn mà bỏ lớp phát hiện, nên lần sự cố tiếp theo (dạng khác) vẫn chạy âm thầm hàng giờ trước khi ai đó tình cờ nhìn thấy.',
    ],
    worksheet: [
      'Ghi dòng thời gian sự cố gần nhất của bạn theo bốn cột: mốc giờ, chuyện gì xảy ra, ai biết, biết bằng cách nào.',
      'Khoảng cách giữa lúc sự cố bắt đầu và lúc có người biết là bao lâu? Nếu khoảng đó rút một nửa thì thiệt hại đổi thế nào?',
      'Liệt kê mọi điều kiện phải đồng thời đúng thì sự cố mới xảy ra. Nếu chỉ có một điều kiện, hãy nghi ngờ mình còn thiếu dữ liệu.',
      'Với nguyên nhân bạn tin nhất, viết ra một bằng chứng sẽ bác bỏ nó. Bạn có dữ liệu đó không, và nếu không thì lấy ở đâu?',
      'Điền ba lớp việc: khôi phục ___ (ai, khi nào); ngăn tái diễn ___; rút ngắn phát hiện ___. Lớp nào bạn đang bỏ trống?',
    ],
    exercises: [
      { label: 'Dòng thời gian bốn cột', text: 'Chọn một sự cố nhỏ trong tuần (giao hàng trễ, file gửi sai, cuộc họp bị hỏng) và dựng dòng thời gian bốn cột đầy đủ, kể cả các mốc bạn phải đi hỏi người khác mới biết.', level: 'e' },
      { label: 'Đếm điều kiện đồng thời', text: 'Lấy ba sự cố đã xảy ra ở nơi bạn làm và với mỗi cái, liệt kê tất cả điều kiện phải cùng đúng thì nó mới xảy ra. Đánh dấu điều kiện nào rẻ nhất để gỡ.', level: 'e' },
      { label: 'Đổi lỗi thành thiết kế', text: 'Tìm một quy trình mà thao tác sai dễ làm hơn thao tác đúng. Viết ra một thay đổi bố trí, thứ tự hoặc mặc định khiến làm đúng trở thành đường ít trở ngại nhất.', level: 'm' },
      { label: 'Kiểm hai chiều', text: 'Với một giả thuyết nguyên nhân đang được nhóm tin, viết ra dữ liệu sẽ bác bỏ nó và đi lấy dữ liệu đó thật. Ghi kết quả kể cả khi nó xác nhận giả thuyết cũ.', level: 'm' },
      { label: 'Đo thời gian phát hiện', text: 'Với ba loại hỏng hóc có thể xảy ra trong hệ thống hoặc quy trình của bạn, ước lượng bao lâu thì có người biết nếu nó xảy ra lúc 2 giờ sáng thứ Bảy. Xếp hạng theo mức nguy hiểm.', level: 'm' },
      { label: 'Viết bản phân tích không đổ lỗi', text: 'Soạn một bản phân tích hoàn chỉnh cho một sự cố thật, dài tối đa hai trang, không nêu tên cá nhân ở phần nguyên nhân, và kết thúc bằng ba lớp việc có tên người chịu trách nhiệm và hạn ngày.', level: 'h' },
      { label: 'Rà việc tồn từ các bản cũ', text: 'Tìm ba bản báo cáo sự cố cũ tại nơi bạn làm. Kiểm xem các hành động đề xuất trong đó đã được làm chưa. Viết một ghi chú ngắn về tỷ lệ hoàn thành và lý do những việc chưa làm bị bỏ.', level: 'h' },
      { label: 'Thử thách 7 ngày: một chuỗi mỗi ngày', text: 'Bảy ngày, mỗi ngày lấy một chuyện bực mình nhỏ (tìm không thấy file, trễ 10 phút, gửi nhầm người) và lần ngược đúng ba mắt xích, rồi đổi đúng một thứ trong bố trí chứ không hứa cố gắng hơn. Cuối tuần đếm xem có mắt xích nào lặp lại ở nhiều chuyện khác nhau.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao "nhân viên bất cẩn" hầu như không bao giờ là kết luận dùng được?',
        a: 'Vì nó không sinh ra thay đổi nào kiểm chứng được — người khác cũng sẽ bất cẩn trong cùng điều kiện. Kết luận dùng được phải chỉ ra vì sao thao tác sai dễ xảy ra: thiếu xác nhận, hai nút giống nhau đặt cạnh nhau, quy trình đòi trí nhớ ở thời điểm mệt. Sửa những thứ đó mới làm giảm xác suất tái diễn.',
      },
      {
        q: 'Nêu ba loại hành động phải có trong một bản phân tích và cho ví dụ mỗi loại.',
        a: 'Khôi phục (bật lại dịch vụ, in tay đơn hàng tồn), ngăn tái diễn (đổi thứ tự triển khai để migration chạy trước, thêm ràng buộc dữ liệu), và rút ngắn phát hiện (cảnh báo khi không có đơn nào trong 10 phút giờ cao điểm). Thiếu loại thứ ba là lỗi phổ biến nhất, và nó chính là thứ quyết định thiệt hại của lần sau.',
      },
      {
        q: 'Khi nào nên dừng chuỗi "tại sao"?',
        a: 'Dừng ở tầng cuối cùng mà nhóm bạn có quyền và có nguồn lực thay đổi trong chu kỳ hiện tại, và tầng đó phải có bằng chứng chứ không chỉ suy đoán. Các tầng sâu hơn (ưu tiên của công ty, văn hoá, ngân sách) nên được ghi lại và chuyển lên cấp có thẩm quyền, chứ không biến thành hành động của nhóm.',
      },
    ],
    plan7:
      'Ngày 1: chọn một sự cố đã xảy ra trong 30 ngày qua và thu thập bằng chứng còn lại. Ngày 2: dựng dòng thời gian bốn cột, đánh dấu chỗ phải hỏi người khác. Ngày 3: liệt kê điều kiện đồng thời và viết ba giả thuyết. Ngày 4: đi tìm bằng chứng bác bỏ cho giả thuyết mạnh nhất. Ngày 5: xác định tầng dừng và viết lý do dừng ở đó. Ngày 6: viết ba lớp hành động, gắn tên và hạn. Ngày 7: trình bày cho nhóm trong 15 phút, không nêu tên cá nhân ở phần nguyên nhân, và ghi lại phản ứng.',
    evidence:
      'Bản phân tích sự cố là một trong ít hiện vật công việc có thể chia sẻ mà không lộ dữ liệu nhạy cảm sau khi ẩn danh. Giữ hai bản: một cho sự cố kỹ thuật hoặc vận hành, một cho sự cố quy trình hay giao tiếp, mỗi bản đủ dòng thời gian, giả thuyết đã loại, ba lớp hành động và kết quả theo dõi sau đó. Trong phỏng vấn, con số thuyết phục nhất không phải "đã khắc phục trong 2 giờ" mà "thời gian phát hiện loại sự cố này giảm từ 2 giờ xuống 11 phút, đo trên lần tái diễn thật". Trong CV, ghi rõ bạn là người viết bản phân tích và theo dõi các hành động tới lúc đóng.',
    references: [
      { label: 'Causal Models — Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/causal-models/', type: 'article' },
      { label: 'Foundation for Critical Thinking', url: 'https://www.criticalthinking.org/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 7 — Tư duy hệ thống — Systems Thinking
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Tư duy hệ thống là thói quen giải thích kết quả bằng cấu trúc quan hệ thay vì bằng sự kiện đơn lẻ hay tính cách con người. Ba thứ nó bắt bạn nhìn mà tư duy tuyến tính bỏ qua: vòng phản hồi (kết quả quay lại làm thay đổi nguyên nhân), độ trễ (hậu quả tới sau khi ta đã kết luận), và động lực (người trong hệ thống hành xử hợp lý theo cái họ được đo). Hệ quả thực tế khó chịu nhất là: tối ưu từng bộ phận đến mức tốt nhất vẫn có thể làm cả hệ thống tệ đi.',
    why: {
      work: 'Mọi chỉ số bạn đặt ra đều sẽ được người ta tối ưu, kể cả theo cách bạn không muốn. Nhìn được vòng phản hồi giúp bạn dự đoán hành vi sinh ra từ chỉ số trước khi ban hành nó, thay vì phát hiện sau sáu tháng khi con số đẹp mà kết quả thật xấu đi.',
      interview:
        'Ở câu hỏi thiết kế hệ thống hoặc thiết kế quy trình, người phỏng vấn chờ nghe tác động bậc hai: bộ nhớ đệm làm nhanh nhưng sinh vấn đề dữ liệu cũ; rút ngắn hạn giao làm nhanh nhưng đẩy chi phí sửa lại về sau. Nói được đánh đổi đó phân biệt người từng vận hành thật với người mới đọc lý thuyết.',
      study:
        'Kiến thức rời rạc dễ quên vì không có gì neo nó. Khi bạn buộc mình vẽ quan hệ giữa các khái niệm — cái gì làm tăng cái gì, cái gì bù trừ cái gì — bạn nhớ ít hơn nhưng dùng được nhiều hơn, vì cấu trúc cho phép suy ra chi tiết đã quên.',
      life: 'Kiểu vòng lặp "càng bận càng không tập thể dục, càng không tập càng mệt, càng mệt càng làm chậm nên càng bận" không gỡ được bằng quyết tâm ở một điểm. Nhìn ra vòng lặp cho phép bạn chọn điểm cắt rẻ nhất thay vì gồng lên ở điểm khó nhất.',
    },
    framework: [
      { name: 'Liệt kê phần tử và dòng chảy', detail: 'Ghi ra các kho (thứ tích luỹ được: khách hàng, tồn kho, nợ kỹ thuật, uy tín, sức khoẻ) và các dòng làm chúng tăng hoặc giảm. Phân biệt kho với dòng là bước hay bị bỏ qua nhất, và nhầm hai thứ này dẫn tới kỳ vọng sai về tốc độ thay đổi.' },
      { name: 'Nối quan hệ có dấu', detail: 'Vẽ mũi tên giữa các yếu tố và ghi dấu: cùng chiều hay ngược chiều. Chỉ vẽ mũi tên khi bạn nói được cơ chế cụ thể, nếu không sơ đồ sẽ đẹp mà rỗng.' },
      { name: 'Tìm vòng lặp và độ trễ', detail: 'Đi theo mũi tên xem có đường nào quay về điểm xuất phát không. Vòng khuếch đại làm mọi thứ chạy nhanh theo cả hai hướng tốt xấu; vòng cân bằng kéo hệ về mức đặt trước. Ghi độ trễ trên mỗi cạnh — độ trễ là lý do người ta hành động quá tay rồi phải chữa.' },
      { name: 'Soi động lực của người trong hệ', detail: 'Với mỗi vai trò, hỏi họ đang được đo bằng gì và hành vi nào tối đa hoá con số đó. Hành vi bạn thấy khó hiểu thường là hành vi hoàn toàn hợp lý dưới cái thước họ đang bị đo.' },
      { name: 'Chọn điểm can thiệp', detail: 'Xếp hạng các can thiệp theo mức đòn bẩy: đổi thông số (yếu nhất), đổi độ trễ, đổi luồng thông tin ai biết gì, đổi quy tắc và động lực, đổi mục tiêu của hệ (mạnh nhất). Đa số tổ chức chỉ loay hoay ở tầng thông số vì nó dễ đo nhất.' },
    ],
    scenario:
      'Một trung tâm chăm sóc khách hàng thưởng nhân viên theo số ticket đóng trong ngày. Sáu tháng sau, số ticket đóng mỗi người tăng 40% nhưng tổng khối lượng công việc lại tăng, và điểm hài lòng giảm. Trưởng bộ phận vẽ vòng lặp: thưởng theo số ticket → đóng nhanh khi chưa giải quyết xong → khách mở lại ticket mới → tổng ticket tăng → áp lực tăng → càng đóng vội. Độ trễ hai đến năm ngày giữa lúc đóng và lúc khách quay lại khiến không ai nối được hai sự kiện với nhau. Họ đổi thước đo sang tỷ lệ giải quyết trong lần liên hệ đầu tiên đo sau 14 ngày, và công bố cả hai chỉ số song song trong ba tháng để mọi người thấy quan hệ. Số ticket mở lại giảm hơn một phần ba, tổng khối lượng giảm theo, dù số ticket đóng mỗi ngày trên đầu người thấp đi.',
    comparison: [
      { weak: 'Thấy một bộ phận chậm thì tăng nhân sự cho đúng bộ phận đó.', mature: 'Kiểm xem chậm là do năng lực bộ phận đó hay do nó phải chờ đầu vào từ chỗ khác; thêm người vào nút không phải nút thắt chỉ làm hàng đợi dài hơn.' },
      { weak: 'Đặt một chỉ số duy nhất cho một vai trò vì như thế dễ quản.', mature: 'Đặt một chỉ số chính kèm ít nhất một chỉ số bảo vệ chống lại cách tối ưu hoá phá hoại, và công bố cả hai cùng lúc.' },
      { weak: 'Thấy kết quả không đổi sau can thiệp thì lập tức tăng liều can thiệp.', mature: 'Ước lượng độ trễ của hệ thống trước, rồi mới quyết định là chưa tới lúc thấy kết quả hay can thiệp thật sự không hiệu quả.' },
    ],
    mistakes: [
      'Vẽ sơ đồ hệ thống rất công phu nhưng không dùng nó để đổi bất kỳ quyết định nào — sơ đồ trở thành tài liệu trang trí, và lần sau không ai muốn bỏ công vẽ nữa.',
      'Quy hành vi khó hiểu của người khác cho tính cách hoặc thái độ, trong khi họ đang phản ứng hoàn toàn hợp lý với cái thước đo và ràng buộc mà chính bạn đặt ra.',
      'Bỏ qua độ trễ nên đánh giá can thiệp quá sớm, kết luận sai rằng nó không hiệu quả, rồi đổi hướng liên tục và tạo ra một hệ thống dao động mạnh hơn cả lúc đầu.',
    ],
    worksheet: [
      'Kể tên một kết quả tồi đang lặp lại quanh bạn dù ai cũng đang làm đúng việc của mình.',
      'Vẽ nhanh năm yếu tố liên quan và nối chúng bằng mũi tên có dấu. Chỉ giữ lại mũi tên nào bạn nói được cơ chế cụ thể.',
      'Có đường nào quay về điểm xuất phát không? Nếu có, nó khuếch đại hay kéo về cân bằng, và mất bao lâu để chạy hết một vòng?',
      'Mỗi vai trò trong sơ đồ đang được đánh giá bằng con số nào? Hành vi nào làm con số đó đẹp nhất mà vẫn hại tổng thể?',
      'Trong năm tầng can thiệp (thông số, độ trễ, thông tin, quy tắc, mục tiêu), bạn đang can thiệp ở tầng nào? Tầng nào cao hơn mà bạn còn quyền động vào?',
    ],
    exercises: [
      { label: 'Kho hay dòng', text: 'Liệt kê mười khái niệm bạn theo dõi trong công việc và phân loại từng cái là kho (tích luỹ) hay dòng (tốc độ). Ghi lại cái nào bạn từng nhầm và hậu quả của việc nhầm đó.', level: 'e' },
      { label: 'Sơ đồ năm mũi tên', text: 'Chọn một hiện tượng lặp đi lặp lại ở nơi bạn làm và vẽ đúng năm mũi tên có dấu giải thích nó. Giới hạn năm mũi tên buộc bạn chọn cái quan trọng nhất.', level: 'e' },
      { label: 'Săn vòng lặp cá nhân', text: 'Tìm một vòng lặp trong đời sống riêng của bạn (giấc ngủ, chi tiêu, quan hệ) và viết ra ba điểm có thể cắt nó, kèm ước lượng công sức cho từng điểm.', level: 'e' },
      { label: 'Đọc động lực từ thước đo', text: 'Lấy ba chỉ số đang được dùng để đánh giá người ở tổ chức bạn. Với mỗi cái, viết ra cách tối ưu nó mà vẫn gây hại tổng thể, và kiểm xem hành vi đó có đang xảy ra không.', level: 'm' },
      { label: 'Ước lượng độ trễ', text: 'Với một thay đổi nhóm bạn vừa triển khai, ước lượng bao lâu mới thấy được tác động thật và ghi ngày sẽ đánh giá. Đặt lời nhắc và không đánh giá trước ngày đó.', level: 'm' },
      { label: 'Chỉ số bảo vệ', text: 'Chọn một chỉ số chính đang dùng và thiết kế một chỉ số bảo vệ đi kèm. Trình bày cặp đó cho người quản lý và ghi lại phản đối bạn nhận được.', level: 'm' },
      { label: 'Leo tầng đòn bẩy', text: 'Với một vấn đề dai dẳng, viết bốn phương án can thiệp ở bốn tầng khác nhau (thông số, thông tin, quy tắc, mục tiêu). So sánh chi phí chính trị và tác động dự kiến của từng phương án, rồi đề xuất một cái.', level: 'h' },
      { label: 'Thử thách 7 ngày: mỗi ngày một tác động bậc hai', text: 'Bảy ngày, mỗi ngày lấy một đề xuất đang được bàn quanh bạn và viết ba câu: nó giải quyết gì, nó tạo ra hành vi mới nào, và sáu tháng sau ai sẽ chịu chi phí của hành vi đó. Cuối tuần chọn đề xuất có tác động bậc hai đáng lo nhất và nói ra trong cuộc họp.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao tối ưu từng bộ phận có thể làm cả hệ thống tệ đi? Cho một ví dụ ngoài lĩnh vực phần mềm.',
        a: 'Vì các bộ phận chia sẻ nguồn lực và nối với nhau bằng hàng đợi, nên tăng năng suất ở nơi không phải nút thắt chỉ làm tồn kho dồn về phía trước. Ví dụ: bếp một nhà hàng nấu nhanh gấp đôi trong khi chỉ có hai người chạy bàn — món ra nhiều hơn nhưng nguội trước khi tới bàn, khách hài lòng ít hơn dù bếp đạt kỷ lục.',
      },
      {
        q: 'Phân biệt vòng khuếch đại và vòng cân bằng, mỗi loại một ví dụ.',
        a: 'Vòng khuếch đại đẩy hệ đi xa hơn theo hướng đang đi: khách hài lòng giới thiệu thêm khách, có thêm doanh thu để phục vụ tốt hơn. Vòng cân bằng kéo hệ về một mức đặt trước: giá tăng thì cầu giảm, kéo giá xuống. Vòng khuếch đại nguy hiểm vì nó chạy tốt theo cả hai chiều, còn vòng cân bằng gây bực bội vì nó vô hiệu hoá các nỗ lực thay đổi.',
      },
      {
        q: 'Bạn đề xuất một thay đổi quy trình và ba tuần sau chỉ số chưa nhúc nhích. Cần kiểm gì trước khi kết luận thất bại?',
        a: 'Kiểm ba thứ theo thứ tự: độ trễ của hệ thống có dài hơn ba tuần không (nếu có thì đánh giá lúc này là vô nghĩa); thay đổi có thực sự được áp dụng không hay mọi người vẫn làm theo cách cũ; và có vòng cân bằng nào đang trung hoà tác động không, ví dụ người ta bù lại bằng cách khác. Chỉ khi ba câu này đã rõ mới bàn tới việc bỏ hay tăng liều.',
      },
    ],
    plan7:
      'Ngày 1: chọn một kết quả tồi lặp lại và viết mô tả không nhắc tên ai. Ngày 2: liệt kê kho và dòng liên quan. Ngày 3: vẽ sơ đồ năm mũi tên có dấu. Ngày 4: tìm vòng lặp và ghi độ trễ trên từng cạnh. Ngày 5: viết ra thước đo của từng vai trò và hành vi tối ưu hoá tương ứng. Ngày 6: xếp bốn phương án can thiệp theo tầng đòn bẩy. Ngày 7: trình bày sơ đồ cho một người trong hệ thống đó và ghi lại chỗ họ nói bạn vẽ sai — chỗ đó thường là cơ chế bạn chưa biết.',
    evidence:
      'Sơ đồ vòng lặp kèm quyết định đã đổi vì nó là hiện vật hiếm và dễ nhớ trong phỏng vấn. Giữ lại một trường hợp bạn chỉ ra được rằng một chỉ số đang sinh hành vi phá hoại, kèm số liệu trước và sau khi đổi thước đo. Với vị trí quản lý hoặc vận hành, câu chuyện có sức nặng nhất là bạn chấp nhận một chỉ số bề mặt xấu đi (số ticket đóng mỗi ngày giảm) để đổi lấy kết quả tổng tốt lên, và bạn đã thuyết phục người khác bằng cách nào. Trong CV, mô tả cặp chỉ số bạn thiết kế, không viết "tư duy hệ thống".',
    references: [
      { label: 'The Donella Meadows Project — Systems Thinking Resources', url: 'https://donellameadows.org/systems-thinking-resources/', type: 'article', needsReview: true },
      { label: 'Farnam Street — Second-Order Thinking', url: 'https://fs.blog/second-order-thinking/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 8 — Tư duy từ nguyên lý đầu tiên — First-principles Thinking
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Tư duy từ nguyên lý đầu tiên là tách một niềm tin đang chi phối hành động thành ba loại: ràng buộc thật (vật lý, pháp lý, toán học, kinh tế), thông lệ tích luỹ theo lịch sử, và ưa thích cá nhân được nói ra như quy luật. Chỉ loại thứ nhất là không thể thương lượng. Mục đích không phải phá bỏ mọi thứ để xây lại từ số không — đó là cách lãng phí tri thức của người đi trước — mà là biết chính xác phần nào bắt buộc, để dồn sáng tạo vào phần còn lại.',
    why: {
      work: 'Mỗi tổ chức tích luỹ hàng trăm quy tắc mà lý do ban đầu đã biến mất, nhưng chi phí thì còn nguyên. Người biết phân loại ràng buộc là người đề xuất được thay đổi mà không bị bác ngay, vì họ nói rõ được cái gì họ không đụng tới.',
      interview:
        'Khi được hỏi cải tiến một thứ đang chạy, câu trả lời hay nhất không phải một ý tưởng táo bạo mà một bảng phân loại: đây là ràng buộc không đổi được, đây là giả định tôi muốn kiểm, và đây là phép thử nhỏ tôi sẽ chạy trước. Nó cho thấy bạn không phá đồ của người khác một cách vô trách nhiệm.',
      study:
        'Với môn khó, học thuộc quy trình giải giúp qua bài tập mẫu nhưng gãy ngay khi đề đổi dạng. Truy về nguyên lý — công thức này ra từ đâu, giả định gì để nó đúng — mất thời gian gấp đôi lúc đầu nhưng cho phép tự dựng lại khi quên, và nhận ra khi đề đang phá giả định.',
      life: 'Nhiều quyết định lớn của đời người được đưa ra dựa trên thông lệ chưa ai kiểm: phải mua nhà trước tuổi ba mươi, phải làm đúng ngành đã học. Tách được đâu là ràng buộc tài chính thật, đâu là kỳ vọng xã hội, giúp bạn chọn theo hoàn cảnh của mình chứ không theo hoàn cảnh trung bình.',
    },
    framework: [
      { name: 'Chép nguyên văn niềm tin', detail: 'Viết lại đúng câu mà người ta hay nói, không diễn giải mềm đi: "Onboarding phải có một cuộc gọi 60 phút", "Báo giá không được dưới 20 triệu". Câu ở dạng thô mới lộ ra phần tuyệt đối hoá.' },
      { name: 'Phân loại ba ngăn', detail: 'Đặt từng thành phần vào một trong ba ngăn: ràng buộc thật (có thể chỉ ra định luật, điều luật, hợp đồng, hoặc phép tính chứng minh), thông lệ (có lý do lịch sử, có thể tìm được thời điểm nó ra đời), ưa thích (không có gì đứng sau ngoài thói quen).' },
      { name: 'Truy nguồn thông lệ', detail: 'Với mỗi thông lệ, đi hỏi ai đặt ra nó và để giải quyết chuyện gì. Rất nhiều quy tắc được lập để xử lý một sự cố cụ thể đã không còn tồn tại — biết được lý do gốc cho phép bỏ nó mà không mất lớp bảo vệ nào.' },
      { name: 'Dựng lại từ ràng buộc', detail: 'Chỉ giữ ngăn thứ nhất và hỏi: nếu bắt đầu hôm nay với đúng những ràng buộc này và mục tiêu này, tôi sẽ thiết kế thế nào? Viết ra ít nhất hai phương án khác hẳn cách đang làm.' },
      { name: 'Thử có giới hạn', detail: 'Chọn phương án rẻ nhất, chạy trên một phạm vi nhỏ và có ngày kết thúc, kèm điều kiện quay về cách cũ. Đây là bước phân biệt tư duy nguyên lý với việc phá bỏ liều lĩnh.' },
    ],
    scenario:
      'Một người làm thiết kế tự do tin rằng "phải tính theo giờ, và không thể tính trên 400 nghìn một giờ vì thị trường không chịu". Anh ngồi phân loại: ràng buộc thật là khách hàng có ngân sách hữu hạn và anh có 30 giờ làm việc hiệu quả mỗi tuần; thông lệ là tính theo giờ, vốn xuất phát từ thời anh làm bán thời gian và cần chứng minh mình có mặt; ưa thích là cảm giác an toàn khi được trả cho từng giờ. Anh thử trên hai dự án: báo giá trọn gói theo kết quả bàn giao, kèm phạm vi ghi rõ và hai vòng chỉnh sửa. Một khách từ chối, một khách đồng ý với mức tương đương 600 nghìn một giờ theo thời gian anh thực bỏ ra, và quan trọng hơn là hai bên hết cãi nhau về việc anh làm bao nhiêu giờ. Anh giữ cách mới cho loại dự án có phạm vi rõ, giữ cách cũ cho việc tư vấn dài hạn.',
    comparison: [
      { weak: 'Nghe "chỗ nào cũng làm thế" là coi như đã có lý do chính đáng.', mature: 'Hỏi lý do gốc và kiểm xem điều kiện sinh ra lý do đó còn tồn tại ở hoàn cảnh của mình không.' },
      { weak: 'Trộn ràng buộc pháp lý với quy định nội bộ vào cùng một danh sách "không thể đổi".', mature: 'Tách hai loại rõ ràng, vì thứ nhất cần luật sư còn thứ hai chỉ cần một cuộc trao đổi với người có quyền.' },
      { weak: 'Kết luận "xây lại từ đầu sẽ sạch hơn" mà không tính chi phí chuyển đổi và tri thức đang nằm trong hệ thống cũ.', mature: 'Liệt kê những bài học đã được mã hoá vào hệ thống cũ dưới dạng các trường hợp đặc biệt, rồi mới quyết định giữ hay bỏ từng cái.' },
    ],
    mistakes: [
      'Áp tư duy nguyên lý vào chỗ đã có tiêu chuẩn tốt và rẻ (mã hoá, kế toán, an toàn), tự dựng lại rồi mắc đúng những lỗi mà tiêu chuẩn kia sinh ra để tránh.',
      'Gọi mọi ràng buộc mình không thích là "thông lệ" — đặc biệt với các ràng buộc pháp lý hoặc an toàn — và biến một bài tập tư duy thành rủi ro thật cho người khác.',
      'Dừng ở phần phân tích thú vị mà không bao giờ chạy phép thử, nên kết luận vẫn chỉ là quan điểm và không có gì đổi trong thực tế.',
    ],
    worksheet: [
      'Chép nguyên văn một câu "phải" hoặc "không thể" đang giới hạn cách bạn làm việc.',
      'Gạch câu đó thành các mệnh đề nhỏ và xếp mỗi mệnh đề vào một trong ba ngăn: ràng buộc thật / thông lệ / ưa thích. Ghi bằng chứng cho ngăn thứ nhất.',
      'Với mệnh đề nằm ở ngăn thông lệ, ai là người đầu tiên đặt ra nó và để tránh chuyện gì? Nếu không tra ra được, ghi "không rõ" — đó đã là một phát hiện.',
      'Nếu chỉ còn ngăn ràng buộc thật, viết hai cách làm khác hẳn hiện tại để đạt cùng mục tiêu.',
      'Chọn một cách để thử: phạm vi nhỏ nào, trong bao lâu, dấu hiệu nào khiến bạn quay về cách cũ ngay?',
    ],
    exercises: [
      { label: 'Ba ngăn cho năm quy tắc', text: 'Lấy năm quy tắc bất thành văn ở nơi bạn làm việc và phân loại từng cái vào ba ngăn, kèm bằng chứng cho những cái bạn xếp vào ngăn ràng buộc thật.', level: 'e' },
      { label: 'Truy nguồn một quy trình', text: 'Chọn một bước trong quy trình mà không ai thích nhưng ai cũng làm. Đi hỏi ít nhất hai người xem nó có từ bao giờ và để giải quyết chuyện gì. Ghi lại nếu không ai biết.', level: 'e' },
      { label: 'Bóc một con số', text: 'Lấy một con số cố định trong công việc (thời hạn 5 ngày, tồn kho 200 đơn vị, họp 60 phút) và tìm cách nó được tính ra ban đầu. Nếu không có phép tính nào, đề xuất một phép tính.', level: 'e' },
      { label: 'Dựng lại chi phí từ đáy', text: 'Chọn một thứ bạn đang mua hoặc thuê ngoài. Ước lượng chi phí từ các thành phần cấu thành nó thay vì từ giá thị trường, rồi so hai con số và giải thích khoảng chênh.', level: 'm' },
      { label: 'Nếu bắt đầu hôm nay', text: 'Với một hệ thống hoặc quy trình bạn đang vận hành, viết một trang thiết kế giả định bạn khởi động lại hôm nay với đúng ràng buộc hiện tại. Đánh dấu ba khác biệt lớn nhất so với hiện trạng.', level: 'm' },
      { label: 'Danh sách bài học đã mã hoá', text: 'Trước khi đề xuất bỏ một quy trình cũ, liệt kê mọi trường hợp đặc biệt nó đang xử lý. Với mỗi cái, quyết định giữ, bỏ hay chuyển sang cơ chế khác, và ghi lý do.', level: 'm' },
      { label: 'Phép thử có ngày kết thúc', text: 'Chạy một cách làm khác trên phạm vi nhỏ trong bốn tuần, với tiêu chí đo và điều kiện quay lui viết sẵn từ đầu. Viết một trang tổng kết kể cả khi kết quả là quay lui.', level: 'h' },
      { label: 'Thử thách 7 ngày: một chữ "phải" mỗi ngày', text: 'Bảy ngày, mỗi ngày bắt đúng một câu chứa "phải", "bắt buộc" hoặc "không thể" trong môi trường của bạn, phân loại nó vào ba ngăn và ghi câu hỏi bạn sẽ hỏi để kiểm. Cuối tuần đếm tỷ lệ giữa ba ngăn — con số đó nói khá nhiều về tổ chức bạn đang ở.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Làm sao phân biệt một ràng buộc thật với một thông lệ lâu năm?',
        a: 'Ràng buộc thật chỉ ra được nguồn cụ thể: một định luật vật lý, một điều khoản pháp lý, một điều khoản hợp đồng, hoặc một phép tính cho thấy vượt qua thì lỗ. Thông lệ thì chỉ dẫn được tới thói quen hoặc tới việc "trước giờ vẫn thế". Phép thử nhanh: hỏi "nếu ta làm ngược lại thì chuyện gì cụ thể xảy ra, và ai đã từng thử chưa" — thông lệ thường không trả lời được câu thứ hai.',
      },
      {
        q: 'Vì sao "xây lại từ đầu cho sạch" thường tốn hơn dự kiến?',
        a: 'Vì hệ thống cũ đã mã hoá vô số trường hợp đặc biệt sinh ra từ những sự cố thật, và những trường hợp đó không được viết ở đâu ngoài chính mã lệnh hoặc quy trình. Bản mới sạch sẽ gặp lại từng cái một trong sản xuất. Trước khi xây lại, cần trích ra danh sách các trường hợp đặc biệt và quyết định có ý thức với từng cái.',
      },
      {
        q: 'Khi nào KHÔNG nên dùng tư duy từ nguyên lý đầu tiên?',
        a: 'Khi đã tồn tại một tiêu chuẩn tốt, được kiểm nghiệm rộng và có chi phí áp dụng thấp — mật mã học, an toàn điện, kế toán, quy chuẩn xây dựng. Ở đó, tự dựng lại từ đầu chỉ có nghĩa là bạn sẽ tự phát hiện lại các lỗi mà cộng đồng đã trả giá để biết. Cũng không nên dùng khi quyết định nhỏ và đảo ngược được, vì chi phí phân tích lớn hơn giá trị.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê mười câu "phải/không thể" bạn nghe thường xuyên. Ngày 2: phân loại chúng vào ba ngăn. Ngày 3: chọn một thông lệ tốn kém nhất và đi truy nguồn gốc của nó. Ngày 4: dựng lại chi phí hoặc thiết kế từ ràng buộc thật, viết hai phương án. Ngày 5: liệt kê những trường hợp đặc biệt mà cách cũ đang xử lý mà cách mới chưa. Ngày 6: thiết kế một phép thử phạm vi nhỏ có ngày kết thúc và điều kiện quay lui. Ngày 7: trình bày cho người có quyền quyết định, mở đầu bằng danh sách những thứ bạn KHÔNG đụng tới.',
    evidence:
      'Hiện vật thuyết phục là bảng ba ngăn cho một quyết định thật, kèm kết quả phép thử — kể cả khi phép thử thất bại và bạn quay về cách cũ, vì nó chứng minh bạn thử có kỷ luật chứ không liều. Trong phỏng vấn, mở đầu bằng ràng buộc bạn xác định là không đổi được và lý do, rồi mới tới phần bạn thay đổi; thứ tự này khiến người nghe tin bạn hơn hẳn. Trong CV, viết dạng: "Định giá lại dịch vụ theo kết quả bàn giao thay vì theo giờ sau khi dựng lại cấu trúc chi phí; áp dụng cho nhóm dự án có phạm vi rõ, thu nhập trên mỗi giờ thực làm tăng khoảng 50%".',
    references: [
      { label: 'Farnam Street — First Principles', url: 'https://fs.blog/first-principles/', type: 'article' },
      { label: 'James Clear — First Principles: cách tư duy như nhà khoa học', url: 'https://jamesclear.com/first-principles', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 9 — Tư duy phân tích — Analytical Thinking
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Tư duy phân tích là năng lực chia một câu hỏi lớn thành các phần nhỏ hơn sao cho chúng không chồng lấn nhau và cộng lại thì phủ hết vấn đề, rồi dùng dữ liệu để tìm phần nào đang tạo ra phần lớn khác biệt. Giá trị của nó không nằm ở việc chia được đẹp mà ở việc chia đúng trục: cùng một câu hỏi, cắt theo trục có sức giải thích thì hai giờ ra kết quả, cắt theo trục tiện lấy dữ liệu thì hai tuần vẫn mờ mịt.',
    why: {
      work: 'Khi sếp hỏi "vì sao con số này xấu", người trả lời bằng cảm nhận sẽ luôn thua người mở ra được cây phân rã và chỉ vào một nhánh chiếm 70% chênh lệch. Đây cũng là kỹ năng khiến báo cáo của bạn được đọc hết thay vì bị lướt qua.',
      interview:
        'Trong case phỏng vấn, việc vẽ nhanh một cây vấn đề và nói rõ vì sao kiểm nhánh này trước cho thấy bạn quản lý được không gian tìm kiếm. Ngay cả khi hết giờ trước lúc ra kết luận, cấu trúc đó vẫn được chấm điểm.',
      study:
        'Ôn thi hiệu quả bắt đầu bằng phân rã: đề gồm những dạng nào, mình mất điểm ở dạng nào, và trong dạng đó mất vì hiểu sai hay vì tính sai. Học đều tay tất cả các phần là cách phân bổ thời gian tệ nhất khi thời gian hữu hạn.',
      life: 'Câu "tháng nào cũng hết tiền" không giải được. Cắt chi tiêu theo nhóm, theo tần suất, theo cái cố định và cái tuỳ ý, thường lộ ra hai ba khoản chiếm phần lớn chênh lệch — và chỉ cần xử lý chúng, không cần thắt lưng buộc bụng toàn diện.',
    },
    framework: [
      { name: 'Chốt câu hỏi và biến đích', detail: 'Viết một câu hỏi có thể trả lời bằng số, và nêu rõ biến kết quả kèm khoảng thời gian. "Vì sao doanh thu giảm" là chủ đề; "vì sao doanh thu tháng 8 thấp hơn tháng 7 khoảng 12%" là câu hỏi phân tích được.' },
      { name: 'Phân rã theo trục có giả thuyết', detail: 'Chọn trục cắt dựa trên giả thuyết về cơ chế, không dựa trên dữ liệu nào dễ lấy: theo bước trong phễu, theo nhóm khách, theo thời điểm, theo kênh, theo cấu phần của công thức tính. Viết trước điều bạn kỳ vọng thấy ở mỗi nhánh.' },
      { name: 'Định lượng từng nhánh', detail: 'Gán cho mỗi nhánh phần đóng góp vào tổng chênh lệch, tính bằng số tuyệt đối chứ không chỉ bằng phần trăm nội bộ nhánh. Một nhánh giảm 60% nhưng chỉ chiếm 2% quy mô thì không phải chỗ đáng đầu tư.' },
      { name: 'Đào sâu nhánh trọng yếu', detail: 'Chọn nhánh có tích của hai yếu tố lớn nhất: phần đóng góp vào chênh lệch, và mức độ bạn còn chưa hiểu nó. Nhánh lớn mà đã hiểu rõ thì không cần đào; nhánh mờ mà nhỏ thì để sau.' },
      { name: 'Gộp về một kết luận hành động', detail: 'Kết thúc bằng ba dòng: chuyện gì đang xảy ra, mức độ chắc chắn tới đâu, và việc gì nên làm tiếp. Một phân tích không dẫn tới hành động hoặc tới phép kiểm tiếp theo thì mới xong một nửa.' },
    ],
    scenario:
      'Bộ phận nhân sự của một công ty 180 người báo cáo tỷ lệ nghỉ việc năm nay 22%, cao hơn năm ngoái 14%. Đề xuất đầu tiên là tăng lương toàn công ty. Trưởng phòng nhân sự phân rã trước: theo thâm niên, theo phòng ban, theo người quản lý trực tiếp, theo lý do ghi trong phỏng vấn nghỉ việc. Kết quả: 60% số người nghỉ có thâm niên dưới 9 tháng, và trong đó hơn một nửa thuộc hai nhóm do cùng một mô hình bàn giao công việc mới. Cắt tiếp theo lý do, phần lớn nói không rõ mình được kỳ vọng gì trong 90 ngày đầu. Chi phí của việc sửa quy trình nhận việc thấp hơn nhiều so với tăng lương toàn công ty, và tác động nhắm đúng nhóm đang rời đi. Sau hai quý, tỷ lệ nghỉ trong nhóm dưới 9 tháng giảm rõ, trong khi các nhóm khác giữ nguyên — chính điều này xác nhận chẩn đoán ban đầu.',
    comparison: [
      { weak: 'Cắt dữ liệu theo trục nào có sẵn trong công cụ báo cáo.', mature: 'Viết giả thuyết trước, chọn trục theo giả thuyết, và chấp nhận bỏ công lấy dữ liệu thủ công nếu trục đó là trục quan trọng.' },
      { weak: 'Báo cáo phần trăm thay đổi trong từng nhánh và để người đọc tự ghép.', mature: 'Quy mọi nhánh về cùng đơn vị đóng góp tuyệt đối, xếp hạng, và nói thẳng nhánh nào giải thích bao nhiêu phần của tổng chênh lệch.' },
      { weak: 'Chia nhỏ tới mức có 40 ô, mỗi ô vài quan sát, rồi tìm ra "phát hiện" trong ô nhỏ nhất.', mature: 'Dừng chia khi số quan sát mỗi ô không còn đủ để phân biệt tín hiệu với dao động, và ghi rõ ngưỡng đó trong báo cáo.' },
    ],
    mistakes: [
      'Phân rã tạo ra các nhánh chồng lấn (ví dụ vừa chia theo kênh vừa chia theo chiến dịch trong khi một chiến dịch chạy nhiều kênh), khiến việc cộng phần đóng góp trở nên vô nghĩa mà bảng vẫn nhìn rất gọn.',
      'Đào rất sâu vào nhánh dễ lấy dữ liệu và bỏ hẳn một nhánh lớn chỉ vì dữ liệu nằm ở phòng khác — báo cáo trông kỹ lưỡng nhưng kết luận lệch ngay từ nền.',
      'Dừng ở mô tả ("nhóm A giảm 30%") mà không đi tới cơ chế, nên người đọc không biết làm gì tiếp và phân tích chỉ trở thành một slide đẹp.',
    ],
    worksheet: [
      'Viết câu hỏi phân tích của bạn dưới dạng có biến đích, có con số và có khoảng thời gian so sánh.',
      'Liệt kê bốn trục cắt khả dĩ. Với mỗi trục, ghi một câu giả thuyết: nếu vấn đề nằm ở trục này thì tôi sẽ thấy gì?',
      'Trục nào bạn định bỏ qua? Viết thẳng lý do — nếu lý do là "khó lấy dữ liệu" thì đánh dấu đây là điểm mù của báo cáo.',
      'Với trục đã chọn, mỗi nhánh đóng góp bao nhiêu vào tổng chênh lệch tính bằng đơn vị tuyệt đối? Xếp hạng chúng.',
      'Nhánh đứng đầu: bạn hiểu cơ chế đằng sau nó ở mức nào từ 1 đến 5, và câu hỏi tiếp theo cần trả lời là gì?',
    ],
    exercises: [
      { label: 'Viết lại thành câu hỏi đo được', text: 'Lấy ba câu hỏi mơ hồ đang được bàn ở nơi bạn làm và viết lại từng cái thành câu hỏi có biến đích, con số và mốc so sánh.', level: 'e' },
      { label: 'Bốn trục và bốn dự đoán', text: 'Với một chỉ số đang biến động, liệt kê bốn trục cắt và viết trước điều bạn kỳ vọng thấy ở mỗi trục. Sau khi cắt xong, đối chiếu dự đoán với thực tế.', level: 'e' },
      { label: 'Quy về đóng góp tuyệt đối', text: 'Lấy một bảng báo cáo hiện có toàn phần trăm và tính lại phần đóng góp tuyệt đối của mỗi dòng vào tổng thay đổi. Ghi lại dòng nào đổi thứ hạng sau khi tính lại.', level: 'm' },
      { label: 'Cây vấn đề không chồng lấn', text: 'Vẽ cây phân rã hai tầng cho một vấn đề thật, rồi tự kiểm hai điều kiện: có nhánh nào chứa cùng một quan sát không, và cộng tất cả nhánh có ra tổng không.', level: 'm' },
      { label: 'Ngưỡng dừng chia', text: 'Với một tập dữ liệu bạn đang làm việc, xác định số quan sát tối thiểu mỗi ô để bạn còn dám kết luận. Đánh dấu mọi ô dưới ngưỡng đó trong báo cáo hiện tại của bạn.', level: 'm' },
      { label: 'Đi lấy dữ liệu ở phòng khác', text: 'Chọn một trục quan trọng mà bạn vẫn bỏ qua vì dữ liệu nằm ngoài tầm với. Đi xin nó, dù thủ công, và ghi lại kết luận có đổi không sau khi có dữ liệu đó.', level: 'h' },
      { label: 'Một trang phân tích hoàn chỉnh', text: 'Viết một trang gồm câu hỏi, cây phân rã, bảng đóng góp tuyệt đối, cơ chế của nhánh trọng yếu, mức độ chắc chắn và việc đề xuất. Đưa cho người ra quyết định và ghi lại câu hỏi họ hỏi.', level: 'h' },
      { label: 'Thử thách 7 ngày: mỗi ngày một cây hai tầng', text: 'Bảy ngày, mỗi ngày lấy một con số bất kỳ bạn gặp (hoá đơn điện, thời gian di chuyển, số lượt xem một bài viết) và phân rã nó thành cây hai tầng trong 10 phút. Cuối tuần xem lại, đánh dấu lần nào bạn chọn trục vì tiện chứ không vì có sức giải thích.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Hai điều kiện của một phân rã tốt là gì, và vì sao vi phạm chúng làm hỏng kết luận?',
        a: 'Các nhánh không chồng lấn và cộng lại phủ hết vấn đề. Chồng lấn khiến một quan sát bị đếm hai lần nên phần đóng góp cộng vượt quá 100% và không so sánh được giữa các nhánh. Không phủ hết khiến phần chênh lệch lớn nhất có thể đang nằm trong khoảng bạn quên, và bạn sẽ đi tối ưu nhánh nhỏ trong khi vấn đề thật ở chỗ chưa được nhìn.',
      },
      {
        q: 'Vì sao xếp hạng nhánh theo phần trăm thay đổi có thể dẫn tới quyết định sai?',
        a: 'Vì phần trăm bỏ mất quy mô. Một phân khúc giảm 50% nhưng chỉ chiếm 1% doanh thu đóng góp ít hơn nhiều so với một phân khúc giảm 4% nhưng chiếm 60% doanh thu. Cần quy về đơn vị tuyệt đối cùng loại rồi mới xếp hạng, sau đó dùng phần trăm để hiểu cơ chế trong từng nhánh.',
      },
      {
        q: 'Khi nào nên dừng đào sâu?',
        a: 'Khi thoả một trong ba điều: số quan sát mỗi ô không còn đủ để phân biệt tín hiệu với dao động; nhánh còn lại quá nhỏ để dù giải quyết hoàn toàn cũng không đổi kết luận; hoặc bạn đã đủ hiểu cơ chế để đề xuất một hành động hoặc một phép thử. Đào tiếp sau điểm đó thường sinh ra phát hiện giả từ nhiễu.',
      },
    ],
    plan7:
      'Ngày 1: chọn một câu hỏi thật và viết lại nó ở dạng có biến đích và mốc so sánh. Ngày 2: liệt kê bốn trục cắt kèm dự đoán cho từng trục. Ngày 3: lấy dữ liệu và cắt theo hai trục đầu. Ngày 4: quy mọi nhánh về đóng góp tuyệt đối và xếp hạng. Ngày 5: đi tìm cơ chế của nhánh đứng đầu, kể cả bằng cách hỏi người trong cuộc. Ngày 6: viết một trang phân tích với ba dòng kết luận. Ngày 7: trình bày và ghi lại câu hỏi đầu tiên người nghe hỏi — nó cho biết bạn bỏ sót trục nào.',
    evidence:
      'Một trang phân tích thật, đã ẩn danh dữ liệu, là hiện vật portfolio dùng được cho gần như mọi ngành: nhân sự, vận hành, marketing, sản phẩm hay tài chính. Chọn trường hợp mà phân rã của bạn đổi hướng quyết định — ví dụ thay đề xuất tăng lương toàn công ty bằng sửa quy trình nhận việc — và nêu chênh lệch chi phí giữa hai đường đi. Trong phỏng vấn, vẽ lại cây phân rã đó lên bảng trong hai phút và giải thích vì sao bạn kiểm nhánh nào trước. Trong CV, ghi hành động và kết quả, kèm quy mô dữ liệu bạn xử lý.',
    references: [
      { label: 'OpenIntro — tài liệu thống kê nhập môn mở', url: 'https://www.openintro.org/', type: 'article' },
      { label: 'Farnam Street — Mental Models', url: 'https://fs.blog/mental-models/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 10 — Tư duy sáng tạo — Creative Thinking
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Sáng tạo dùng được trong công việc không phải trạng thái cảm hứng mà là một quy trình hai pha tách rời: pha phân kỳ sinh ra nhiều phương án thật sự khác nhau, và pha hội tụ chọn theo tiêu chí đã định. Sai lầm phổ biến là trộn hai pha — vừa nghĩ vừa chấm — khiến ý tưởng nào cũng chết trước khi kịp thành hình, và cuối cùng nhóm chỉ có vài biến thể quanh ý tưởng đầu tiên được nói to nhất. Chất lượng của phương án tốt nhất tăng theo số phương án thật sự khác biệt được xét, không tăng theo thời gian ngồi nghĩ.',
    why: {
      work: 'Khi ngân sách và thời gian bị siết, thứ cứu bạn không phải làm việc chăm hơn mà là tìm ra một cách khác rẻ hơn để đạt cùng mục tiêu. Người thường xuyên mang tới bàn họp ba hướng khác nhau thay vì một hướng duy nhất sẽ dần trở thành người được hỏi ý trước.',
      interview:
        'Ở câu hỏi mở, người đưa một ý tưởng rồi bảo vệ nó tới cùng thường bị đánh giá là cứng nhắc. Đưa ba hướng khác biệt kèm tiêu chí chọn cho thấy bạn có thể làm việc trong môi trường mà ràng buộc thay đổi giữa chừng.',
      study:
        'Học sáng tạo không phải học thêm mẹo mà là ép mình giải một bài theo hai cách khác nhau. Cách thứ hai luôn khó hơn và chính nó dạy bạn cấu trúc của bài toán, thứ mà cách thứ nhất chỉ cho bạn đáp số.',
      life: 'Với các quyết định cá nhân, cái bẫy lớn nhất là chỉ nhìn thấy hai lựa chọn ("nhận việc này hay ở lại"). Kỹ thuật sinh phương án thường lộ ra lựa chọn thứ ba mà không ai nghĩ tới, chẳng hạn thương lượng một dạng làm việc khác ở chính nơi hiện tại.',
    },
    framework: [
      { name: 'Đặt quota trước', detail: 'Ấn định số lượng phương án phải có trước khi được phép đánh giá — ví dụ 15 phương án trong 20 phút. Quota buộc bạn đi qua vùng cạn ý tưởng dễ, nơi mà các phương án thú vị thường mới bắt đầu xuất hiện.' },
      { name: 'Viết độc lập trước khi nói', detail: 'Mỗi người viết riêng, không nói gì, rồi mới gom. Nếu để thảo luận mở đầu, mọi ý tưởng sau đó sẽ neo vào ý đầu tiên, và người có chức vụ cao vô tình thu hẹp không gian tìm kiếm của cả nhóm.' },
      { name: 'Đổi kích thích có hệ thống', detail: 'Dùng các cú hích cố định thay vì chờ cảm hứng: đảo ngược mục tiêu (làm sao để tệ nhất), lấy ràng buộc cực đoan (nếu chỉ có 1% ngân sách, nếu phải xong trong một ngày), mượn giải pháp từ ngành khác, hoặc bỏ đi một thành phần tưởng như bắt buộc.' },
      { name: 'Ghép các mảnh yếu', detail: 'Lấy hai phương án đều không đủ tốt và tìm cách ghép phần mạnh của chúng. Rất nhiều giải pháp dùng được sinh ra ở bước này chứ không ở bước sinh ý tưởng thuần tuý.' },
      { name: 'Hội tụ bằng tiêu chí viết trước', detail: 'Chấm theo bộ tiêu chí đã thống nhất trước khi nhìn danh sách: giá trị nếu đúng, chi phí thử, tốc độ học được điều gì đó, và mức rủi ro không đảo ngược. Chọn hai phương án để thử chứ không một, vì phương án đứng đầu bảng thường không phải phương án thắng cuối cùng.' },
    ],
    scenario:
      'Một nhóm sáu người tốn khoảng 9 giờ họp mỗi tuần và ai cũng thấy quá nhiều. Thay vì tranh luận cắt cuộc nào, người điều phối đặt quota 20 phương án trong 25 phút, mỗi người viết riêng trước. Danh sách gom lại có những thứ hiển nhiên (rút ngắn còn 25 phút) lẫn những thứ lạ (cấm họp thứ Tư, ghi âm thay vì họp, ai không phát biểu thì rời đi sau 10 phút, viết quyết định vào một sổ chung và chỉ họp khi có bất đồng). Chấm theo bốn tiêu chí đã viết trước, hai phương án được chọn thử trong ba tuần: sổ quyết định chung, và họp trạng thái chuyển thành cập nhật văn bản. Kết quả đo được là 9 giờ xuống còn khoảng 4 giờ, nhưng cũng lộ ra một tác dụng phụ: người mới vào mất kênh học nghề không chính thức, nên nhóm bổ sung một buổi 45 phút mỗi tuần dành riêng cho hỏi đáp.',
    comparison: [
      { weak: 'Họp brainstorm mở đầu bằng "ai có ý gì không" rồi im lặng, sau đó người nói to nhất định hướng toàn bộ.', mature: 'Phát giấy, 8 phút viết im lặng, nộp ẩn danh, đọc to toàn bộ trước khi bình luận bất cứ ý nào.' },
      { weak: 'Vừa nêu ý vừa phản biện ngay tại chỗ để tiết kiệm thời gian.', mature: 'Đặt luật rõ: trong 20 phút đầu không ai được nói "nhưng"; mọi phản biện dồn về pha hội tụ có tiêu chí.' },
      { weak: 'Danh sách 30 ý tưởng thực chất là 30 biến thể của cùng một hướng.', mature: 'Nhóm ý tưởng theo hướng tiếp cận, đếm số hướng thật sự khác nhau, và nếu dưới ba thì quay lại sinh tiếp bằng kích thích khác.' },
    ],
    mistakes: [
      'Coi số lượng ý tưởng là mục tiêu cuối, nên nhóm kết thúc với một danh sách dài không ai ưu tiên và không có gì được thử — cảm giác đã làm việc sáng tạo mà thực tế không có gì thay đổi.',
      'Bỏ pha hội tụ hoặc làm nó bằng cách bỏ phiếu cảm tính, khiến ý tưởng dễ hiểu nhất thắng chứ không phải ý tưởng có tỷ lệ giá trị trên chi phí thử tốt nhất.',
      'Làm prototype đẹp và tốn công tới mức cả nhóm ngại loại bỏ nó, biến công cụ để học thành thứ phải bảo vệ.',
    ],
    worksheet: [
      'Viết mục tiêu bạn đang cần phương án cho, ở dạng kết quả mong muốn chứ không phải giải pháp.',
      'Đặt quota: bạn sẽ viết bao nhiêu phương án, trong bao nhiêu phút, và bắt đầu lúc mấy giờ?',
      'Áp bốn kích thích và ghi ít nhất một ý cho mỗi cái: nếu chỉ có 1% ngân sách; nếu phải xong trong một ngày; nếu bắt buộc bỏ đi thành phần trung tâm; nếu ngành khác giải bài này thì họ làm sao.',
      'Gom nhóm danh sách theo hướng tiếp cận. Bạn có bao nhiêu hướng thật sự khác nhau, không tính biến thể?',
      'Viết bốn tiêu chí chấm trước khi đọc lại danh sách, rồi chọn hai phương án để thử và ghi cách bạn sẽ biết chúng có tác dụng.',
    ],
    exercises: [
      { label: 'Quota mười trong mười', text: 'Chọn một vấn đề nhỏ đang gây khó chịu và viết đúng 10 phương án trong 10 phút, không được dừng để đánh giá. Đánh dấu ý thứ 7 trở đi — đó là vùng bạn hiếm khi đi tới.', level: 'e' },
      { label: 'Đảo ngược mục tiêu', text: 'Lấy một mục tiêu đang theo đuổi và liệt kê 10 cách chắc chắn làm nó thất bại. Sau đó lật từng cách thành một hành động phòng ngừa hoặc một ý tưởng cải tiến.', level: 'e' },
      { label: 'Mượn từ ngành khác', text: 'Chọn một vấn đề trong công việc và tìm hiểu cách một ngành hoàn toàn khác xử lý tình huống tương tự (hàng không, bệnh viện, nhà hàng, thư viện). Viết hai ý tưởng mượn được.', level: 'e' },
      { label: 'Ràng buộc cực đoan', text: 'Giải lại một bài toán quen thuộc với ràng buộc chỉ còn 1% ngân sách và một ngày thời gian. Ghi lại thành phần nào bạn buộc phải bỏ và có thật sự cần nó không.', level: 'm' },
      { label: 'Ghép hai ý yếu', text: 'Lấy hai phương án bị loại vì không đủ tốt và tìm cách ghép chúng thành một phương án thứ ba. Viết ra phần mạnh của từng cái và phần bạn phải bỏ đi.', level: 'm' },
      { label: 'Điều phối một buổi viết im lặng', text: 'Tổ chức một buổi sinh ý tưởng 30 phút cho nhóm bạn theo đúng thứ tự viết riêng, gom, đọc, rồi mới bình luận. So sánh số hướng khác nhau thu được với những buổi trước.', level: 'm' },
      { label: 'Thử hai phương án song song', text: 'Chọn hai phương án khác hướng nhau, chạy thử cả hai ở quy mô nhỏ trong ba tuần với tiêu chí đo giống nhau, và viết một trang so sánh kể cả tác dụng phụ ngoài dự kiến.', level: 'h' },
      { label: 'Thử thách 7 ngày: hướng thứ ba mỗi ngày', text: 'Bảy ngày, mỗi khi bạn thấy mình đang chọn giữa hai lựa chọn, dừng lại và bắt buộc viết ra lựa chọn thứ ba và thứ tư trước khi quyết. Cuối tuần đếm bao nhiêu lần lựa chọn thứ ba hoá ra tốt hơn cả hai cái ban đầu.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao phải tách hoàn toàn pha sinh ý tưởng khỏi pha đánh giá?',
        a: 'Vì hai pha đòi hai chế độ tư duy trái ngược: một bên cần chấp nhận ý chưa hoàn chỉnh, một bên cần loại bỏ nghiêm khắc. Khi trộn, phản biện xuất hiện sớm làm người ta tự kiểm duyệt và chỉ nêu những ý an toàn, nên không gian tìm kiếm thu hẹp lại đúng lúc cần mở rộng nhất. Tách ra không làm ý tưởng dở biến mất, nó chỉ dời việc loại bỏ về sau tiêu chí.',
      },
      {
        q: 'Làm sao biết một danh sách ý tưởng là đa dạng thật hay chỉ đa dạng bề mặt?',
        a: 'Gom nhóm theo hướng tiếp cận cơ bản, không theo cách diễn đạt. Nếu 30 ý quy về hai hướng thì đó là danh sách biến thể. Một dấu hiệu khác: nếu mọi ý đều giữ nguyên cùng một thành phần trung tâm (vẫn phải có cuộc họp, vẫn phải có ứng dụng), thì thành phần đó đang là giả định chưa ai thử bỏ.',
      },
      {
        q: 'Tiêu chí nào nên có khi hội tụ, ngoài "ý tưởng này có tốt không"?',
        a: 'Ít nhất bốn: giá trị nếu nó đúng, chi phí để thử (không phải chi phí triển khai đầy đủ), tốc độ học được điều gì đó dù đúng hay sai, và mức độ khó đảo ngược. Bộ tiêu chí này thường đưa lên đầu những phương án không hào nhoáng nhưng rẻ để kiểm, và đó chính là thứ nên thử trước.',
      },
    ],
    plan7:
      'Ngày 1: chọn một vấn đề và viết mục tiêu ở dạng kết quả, không phải giải pháp. Ngày 2: chạy quota 15 ý trong 20 phút, viết một mình. Ngày 3: áp bốn kích thích và bổ sung ít nhất tám ý nữa. Ngày 4: gom nhóm theo hướng, đếm số hướng thật sự khác nhau, sinh tiếp nếu dưới ba. Ngày 5: viết bốn tiêu chí chấm và chấm toàn bộ danh sách. Ngày 6: ghép thử hai ý bị loại thành phương án mới và chấm lại. Ngày 7: chọn hai phương án, viết kế hoạch thử ba tuần với tiêu chí đo và ngày dừng.',
    evidence:
      'Bằng chứng cho sáng tạo là dấu vết quá trình chứ không phải kết quả cuối. Giữ lại ảnh chụp danh sách ý tưởng thô, bảng tiêu chí chấm, và ghi chú về phương án bị loại kèm lý do — bộ ba này cho thấy bạn có phương pháp, không phải may mắn. Trong phỏng vấn, kể được một phương án bạn tự loại dù mình thích nó, và lý do dựa trên tiêu chí, sẽ đáng tin hơn kể một ý tưởng thành công. Trong CV, mô tả kết quả kèm cách đạt: "Điều phối quy trình sinh và chọn phương án cho vấn đề thời lượng họp; giảm từ khoảng 9 giờ xuống 4 giờ mỗi tuần cho nhóm 6 người, có bổ sung buổi hỏi đáp sau khi phát hiện tác dụng phụ với người mới".',
    references: [
      { label: 'IDEO — Design Thinking', url: 'https://designthinking.ideo.com/', type: 'article' },
      { label: 'Creativity — Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/creativity/', type: 'article', needsReview: true },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 11 — Tư duy thiết kế — Design Thinking
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Design Thinking là cách giảm rủi ro làm ra thứ đúng về kỹ thuật nhưng sai về nhu cầu, bằng cách đặt quan sát người dùng ở đầu chuỗi thay vì ở cuối. Cốt lõi của nó không phải năm bước có tên đẹp mà là một cam kết khó chịu: dữ liệu về nhu cầu đến từ việc nhìn người ta làm, không từ việc nghe người ta nói mình muốn gì, và mọi bản mẫu tồn tại để bị bác bỏ rẻ chứ không để được khen.',
    why: {
      work: 'Chi phí sửa một hiểu lầm về nhu cầu tăng theo cấp số nhân theo giai đoạn: rẻ khi còn là bản vẽ tay, đắt khi đã lên bản chính thức, rất đắt khi đã có người dùng thật phụ thuộc vào nó. Quan sát sớm là cách mua bảo hiểm rẻ nhất cho phần công việc tốn kém nhất.',
      interview:
        'Khi trình bày dự án, phần được đánh giá cao thường không phải sản phẩm cuối mà là insight bạn thu được từ hành vi thật và bản mẫu bạn đã loại bỏ. Nó chứng minh bạn học từ người dùng chứ không chỉ thi công theo yêu cầu.',
      study:
        'Thiết kế tài liệu học, khoá học nội bộ hay bài hướng dẫn cho đồng nghiệp đều là bài toán thiết kế. Ngồi cạnh một người thật khi họ làm theo hướng dẫn của bạn, im lặng và ghi chỗ họ khựng lại, dạy bạn nhiều hơn mười lần đọc lại bản thảo.',
      life: 'Sắp xếp lại bếp, tổ chức một chuyến đi cho nhóm bạn, bố trí góc học cho con — đều cải thiện rõ nếu bạn quan sát cách mọi người thực sự di chuyển và thao tác trước khi mua đồ hoặc lập lịch.',
    },
    framework: [
      { name: 'Quan sát tại chỗ', detail: 'Tới nơi công việc thật diễn ra, vào đúng khung giờ khó nhất, và ghi những gì camera quay được: thao tác, thời điểm khựng lại, cách người ta lách quy trình. Ghi riêng "điều tôi thấy" và "điều tôi suy ra" thành hai cột.' },
      { name: 'Định nghĩa nhu cầu', detail: 'Tổng hợp quan sát thành câu dạng "người X cần một cách để Y, bởi vì Z", trong đó Z là lý do rút ra từ hành vi quan sát được chứ không từ lời khai. Mỗi câu phải chỉ được về ít nhất ba quan sát cụ thể.' },
      { name: 'Sinh phương án và làm mẫu thô', detail: 'Tạo nhiều hướng và dựng bản mẫu ở mức rẻ nhất còn kiểm được giả thuyết: vẽ tay, đóng vai, một bảng tính, một tờ giấy dán lên máy. Bản mẫu càng thô càng dễ bị góp ý thẳng.' },
      { name: 'Kiểm với người thật', detail: 'Đưa cho người dùng một nhiệm vụ chứ không phải một câu hỏi, rồi im lặng nhìn. Ghi chỗ họ dừng, chỗ họ hỏi, chỗ họ làm khác dự đoán. Không giải thích hộ, vì trong đời thật sẽ không có bạn ngồi cạnh.' },
      { name: 'Cập nhật và lặp', detail: 'Sau mỗi vòng, viết rõ giả thuyết nào bị bác, giả thuyết nào còn sống, và cái gì sẽ kiểm ở vòng sau. Vòng lặp chỉ dừng khi các phát hiện mới không còn đổi quyết định nữa.' },
    ],
    scenario:
      'Một kho hàng ghi nhận tỷ lệ nhập sai mã hàng khoảng 4%, và ban quản lý cho rằng do nhân viên thiếu cẩn thận nên tổ chức đào tạo lại. Con số không đổi. Một người phụ trách cải tiến xin làm ca đêm hai buổi và chỉ đứng nhìn. Hai quan sát nổi lên: nhân viên đeo găng dày nên bấm trượt trên màn hình cảm ứng, và khu vực nhập liệu chỉ có một bóng đèn cách 4 mét nên các mã có 8 và B rất khó phân biệt. Bản mẫu đầu tiên là một tờ giấy in phóng to các mã dễ nhầm dán cạnh màn hình — chi phí gần bằng không, và giảm được một phần lỗi trong hai đêm. Bản mẫu thứ hai là mượn tạm một đầu đọc mã vạch cầm tay. Sau ba tuần thử, kho đầu tư đầu đọc cho cả ba vị trí và đổi giao diện sang nút to hơn; tỷ lệ nhập sai còn dưới 1%. Không có buổi đào tạo nào được tổ chức thêm.',
    comparison: [
      { weak: 'Hỏi người dùng "bạn muốn tính năng gì" và coi câu trả lời là kết quả nghiên cứu.', mature: 'Hỏi về lần gần nhất họ gặp vấn đề đó: chuyện gì xảy ra, họ đã làm gì, mất bao lâu — rồi rút nhu cầu từ câu chuyện có thật.' },
      { weak: 'Mang bản mẫu đi thử và giải thích cách dùng trước khi người ta bắt đầu.', mature: 'Giao nhiệm vụ, ngồi im, đếm số lần họ khựng, chỉ trả lời sau khi buổi thử kết thúc.' },
      { weak: 'Đầu tư làm bản mẫu tinh xảo để gây ấn tượng với cấp trên.', mature: 'Giữ bản mẫu ở mức thô đủ để trả lời đúng câu hỏi đang cần, và cố tình để nó trông chưa hoàn thiện để người thử dám chê.' },
    ],
    mistakes: [
      'Nhầm thứ người dùng nói với thứ họ làm: họ khai sẽ dùng tính năng mới hàng ngày, nhưng dữ liệu sau đó cho thấy tỷ lệ dùng gần bằng không, và không ai quay lại kiểm chứng lời khai ban đầu.',
      'Chạy đủ năm bước như một nghi thức bắt buộc cho mọi việc, kể cả những việc đã biết rõ nhu cầu, khiến quy trình bị coi là màn trình diễn và lần sau không ai muốn làm nữa.',
      'Chỉ quan sát nhóm người dùng dễ tiếp cận nhất (đồng nghiệp, khách hàng thân thiết), rồi thiết kế cho họ trong khi vấn đề nằm ở nhóm khó gặp — người mới, người ở ca đêm, người ở tỉnh xa.',
    ],
    worksheet: [
      'Bạn định thiết kế cho ai? Viết tên một người thật bạn đã gặp, không phải một chân dung tổng hợp.',
      'Kể lại một lần bạn nhìn thấy tận mắt người đó làm công việc này. Nếu chưa từng nhìn thấy, ghi ngày bạn sẽ đi xem.',
      'Chia đôi tờ giấy: cột trái ghi ba điều bạn quan sát được, cột phải ghi điều bạn suy ra từ mỗi quan sát. Chỗ nào cột phải dài hơn cột trái là chỗ bạn đang đoán.',
      'Viết câu nhu cầu theo mẫu "người ___ cần một cách để ___ vì ___", trong đó phần "vì" phải trỏ về được quan sát ở câu trên.',
      'Bản mẫu rẻ nhất kiểm được câu nhu cầu đó là gì, làm trong bao lâu, và bạn sẽ giao cho người thử nhiệm vụ nào?',
    ],
    exercises: [
      { label: 'Hai cột quan sát và suy luận', text: 'Dành 30 phút quan sát một người làm công việc bạn định cải thiện, ghi hai cột tách bạch. Sau đó đếm tỷ lệ dòng có quan sát thật so với dòng chỉ có suy luận.', level: 'e' },
      { label: 'Hỏi về lần gần nhất', text: 'Phỏng vấn ba người bằng đúng một câu hỏi: kể lại lần gần nhất bạn gặp tình huống này, từ đầu tới cuối. Không hỏi họ muốn gì. Ghi lại ba chi tiết bạn không hề dự đoán.', level: 'e' },
      { label: 'Bản mẫu giấy trong 20 phút', text: 'Dựng một bản mẫu bằng giấy hoặc bảng tính trong tối đa 20 phút cho một ý tưởng bạn đang có, rồi đưa cho một người thử ngay trong ngày.', level: 'e' },
      { label: 'Đi ca khó nhất', text: 'Sắp xếp để có mặt ở nơi công việc diễn ra vào khung giờ căng thẳng nhất (cuối tháng, ca đêm, giờ cao điểm). Ghi ba khác biệt so với những gì bạn thấy vào giờ bình thường.', level: 'm' },
      { label: 'Kiểm im lặng', text: 'Chạy một buổi thử với ba người, giao nhiệm vụ và tuyệt đối không giải thích. Đếm số lần mỗi người khựng lại và ghi chính xác chỗ đó. So với dự đoán bạn viết trước buổi thử.', level: 'm' },
      { label: 'Tìm nhóm khó gặp', text: 'Xác định nhóm người dùng bạn chưa từng quan sát vì khó tiếp cận. Tìm cách gặp ít nhất một người trong nhóm đó và ghi lại nhu cầu khác biệt của họ.', level: 'm' },
      { label: 'Ba vòng lặp trong ba tuần', text: 'Chạy ba vòng quan sát — làm mẫu — kiểm cho một vấn đề thật, mỗi vòng một tuần. Sau mỗi vòng viết ba dòng: giả thuyết bị bác, giả thuyết còn sống, điều sẽ kiểm tiếp.', level: 'h' },
      { label: 'Thử thách 7 ngày: một quan sát mỗi ngày', text: 'Bảy ngày, mỗi ngày dành 15 phút nhìn ai đó dùng một sản phẩm, dịch vụ hoặc quy trình mà không can thiệp, và ghi đúng một khoảnh khắc họ phải xoay xở ngoài thiết kế. Cuối tuần xem bảy khoảnh khắc đó có mô-típ chung nào không.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao hỏi "bạn muốn tính năng gì" thường cho dữ liệu kém?',
        a: 'Vì người trả lời phải dự đoán hành vi tương lai của chính mình trong tình huống giả định, việc mà con người làm rất tệ; họ cũng có xu hướng nói ra giải pháp quen thuộc và muốn làm hài lòng người hỏi. Hỏi về một lần đã xảy ra cho dữ liệu tốt hơn vì nó là ký ức về sự kiện thật, có chi tiết kiểm chéo được.',
      },
      {
        q: 'Bản mẫu nên thô tới mức nào?',
        a: 'Vừa đủ để trả lời câu hỏi đang cần trả lời, và không hơn. Nếu câu hỏi là "người ta có hiểu luồng này không" thì mấy tờ giấy vẽ tay là đủ. Bản mẫu tinh xảo tốn công, làm người thử ngại chê, và làm chính nhóm gắn bó với thứ lẽ ra nên bỏ. Nguyên tắc kiểm: nếu vứt bản mẫu này đi mà bạn thấy tiếc thì nó đã quá đắt.',
      },
      {
        q: 'Khi nào Design Thinking không phải công cụ phù hợp?',
        a: 'Khi nhu cầu đã rõ và ràng buộc nằm ở kỹ thuật, chi phí hoặc pháp lý — lúc đó vấn đề là tối ưu chứ không phải khám phá. Cũng không phù hợp khi quyết định phải ra trong vài giờ, hoặc khi không có cách nào tiếp cận người dùng thật; chạy hình thức mà không có quan sát thật chỉ tạo ra ảo giác đã nghiên cứu.',
      },
    ],
    plan7:
      'Ngày 1: chọn một quy trình có người thật dùng và xin phép tới quan sát. Ngày 2: quan sát 45 phút, ghi hai cột. Ngày 3: phỏng vấn hai người theo kiểu "kể lần gần nhất". Ngày 4: viết ba câu nhu cầu, mỗi câu trỏ về ba quan sát. Ngày 5: dựng một bản mẫu giấy trong 30 phút. Ngày 6: kiểm với ba người, im lặng, đếm chỗ khựng. Ngày 7: viết ba dòng tổng kết giả thuyết bị bác, còn sống và sẽ kiểm tiếp, rồi quyết định có chạy vòng hai không.',
    evidence:
      'Bộ hồ sơ cần ba thứ, và thứ thứ ba là thứ hiếm: ghi chú quan sát thô, ảnh các bản mẫu qua từng vòng, và danh sách những gì bạn đã loại bỏ kèm lý do. Người phỏng vấn đọc portfolio thiết kế hay sản phẩm thường lướt qua phần kết quả và dừng lại ở phần bản mẫu bị loại, vì đó là chỗ khó dựng lên nếu không làm thật. Trong CV, nêu số người bạn quan sát hoặc phỏng vấn và tác động đo được: "Quan sát ca đêm tại 3 kho, thiết kế lại thao tác nhập liệu, tỷ lệ nhập sai mã giảm từ 4% xuống dưới 1% trong 3 tuần".',
    references: [
      { label: 'IDEO — Design Thinking', url: 'https://designthinking.ideo.com/', type: 'article' },
      { label: 'Nielsen Norman Group — Design Thinking 101', url: 'https://www.nngroup.com/articles/design-thinking/', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 12 — Ra quyết định — Decision-making
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Một quyết định tốt và một kết quả tốt là hai thứ khác nhau, vì giữa chúng có may rủi. Bạn kiểm soát được quy trình — thông tin đã thu, tiêu chí đã đặt, phương án đã xét, giả định đã ghi — chứ không kiểm soát được kết quả. Vì vậy cách duy nhất để cải thiện năng lực ra quyết định là ghi lại quy trình tại thời điểm quyết, rồi về sau đánh giá quy trình đó theo những gì bạn biết được lúc ấy, chứ không theo những gì bạn biết bây giờ.',
    why: {
      work: 'Ở vị trí càng cao, phần lớn thời gian không dành để làm mà để chọn. Người có quy trình rõ ràng ra quyết định nhanh hơn ở việc nhỏ và cẩn thận hơn ở việc lớn, thay vì dành lượng lo lắng như nhau cho mọi thứ.',
      interview:
        'Câu hỏi "kể về một quyết định khó" chấm ba thứ: bạn có nêu được đánh đổi không, có nêu phương án bạn đã bỏ và vì sao không, và khi kết quả xấu bạn có phân biệt được lỗi quy trình với xui rủi không. Người kể lại lịch sử theo hướng có lợi cho mình thường lộ ra ở câu hỏi phụ.',
      study:
        'Chọn học gì cũng là quyết định có đánh đổi: mỗi khoá học là vài trăm giờ không dùng cho việc khác. Ghi tiêu chí trước khi so sánh các lựa chọn giúp bạn khỏi bị cuốn theo khoá học nào có trang bán hàng thuyết phục nhất.',
      life: 'Các quyết định lớn của đời — chuyển việc, chuyển thành phố, mua nhà — thường được đưa ra trong trạng thái cảm xúc mạnh rồi biện minh sau. Một bảng tiêu chí viết trước khi cảm xúc lên đỉnh không làm bạn bớt cảm xúc, nhưng cho bạn một điểm neo để quay về.',
    },
    framework: [
      { name: 'Phát biểu quyết định', detail: 'Viết một câu: đang chọn giữa những gì, ai là người quyết, và hạn chót là ngày nào. Nếu không viết được hạn chót, quyết định sẽ tự trôi và bạn sẽ chọn bằng cách hết thời gian.' },
      { name: 'Đặt tiêu chí và trọng số', detail: 'Liệt kê tiêu chí trước khi nhìn kỹ các phương án, tách riêng ràng buộc bắt buộc (không đạt là loại) với tiêu chí có trọng số. Ghi cả những tiêu chí khó chịu như "tôi sẽ phải giải thích với ai".' },
      { name: 'Mở rộng tập phương án', detail: 'Bắt buộc có ít nhất ba phương án và luôn tính "không làm gì" như một phương án thật, có chi phí và lợi ích riêng. Phần lớn quyết định tồi là quyết định nhị phân giả tạo.' },
      { name: 'Ghi giả định và mức chắc', detail: 'Với phương án dẫn đầu, ghi ba giả định nó dựa vào và mức tin cậy của bạn. Đây là phần sau này cho phép phân biệt "tôi suy nghĩ sai" với "thế giới diễn ra khác dự kiến".' },
      { name: 'Chốt, hẹn ngày xem lại', detail: 'Quyết, viết ngày sẽ xem lại và điều kiện sẽ khiến bạn đổi hướng sớm hơn. Với quyết định đảo ngược được, ưu tiên chốt nhanh; với quyết định khó đảo, thêm một vòng kiểm và một người phản biện.' },
    ],
    scenario:
      'Một xưởng in nhỏ phải chọn giữa ba nhà cung cấp giấy. Chủ xưởng ban đầu định lấy nhà rẻ nhất, chênh khoảng 7% so với nhà thứ hai. Trước khi ký, anh viết bảng tiêu chí: giá, thời gian giao trung bình, tỷ lệ giao thiếu trong sáu tháng, khả năng đổi lô khi lỗi, và mức phụ thuộc nếu họ ngừng bán. Anh gọi cho ba khách hàng cũ của từng nhà cung cấp. Nhà rẻ nhất có hai lần giao thiếu và không nhận đổi lô. Với xưởng của anh, mỗi lần giao thiếu là một đơn hàng trễ và thường mất luôn khách đó. Anh chọn nhà thứ hai, ghi giả định "tỷ lệ đơn trễ sẽ dưới 2%" và hẹn xem lại sau bốn tháng. Đến hạn, tỷ lệ trễ là 1,4%, và anh cũng ghi lại một điều không lường trước: nhà thứ hai giao vào buổi sáng nên xưởng phải đổi ca nhận hàng.',
    comparison: [
      { weak: 'Đánh giá quyết định cũ bằng kết quả: thắng thì "tôi đã đúng", thua thì "lẽ ra phải biết".', mature: 'Đánh giá bằng thông tin có tại thời điểm quyết, tách riêng câu hỏi "quy trình có sót gì không" khỏi câu hỏi "kết quả có tốt không".' },
      { weak: 'Dành lượng thời gian phân tích như nhau cho mọi quyết định.', mature: 'Phân loại theo mức đảo ngược: cái đảo được thì chốt trong ngày; cái khó đảo thì thêm phản biện, thêm dữ liệu và thêm thời gian ngủ một đêm.' },
      { weak: 'So sánh phương án bằng cảm giác tổng thể "cái này ổn hơn".', mature: 'Cho điểm từng tiêu chí riêng lẻ trước khi cộng, để một điểm mạnh nổi bật không nhuộm màu toàn bộ đánh giá.' },
    ],
    mistakes: [
      'Điều chỉnh tiêu chí sau khi đã nhìn thấy phương án ưa thích — làm rất tự nhiên và gần như không ai tự nhận ra, nên bảng tiêu chí chỉ còn là nghi lễ hợp thức hoá lựa chọn đã có sẵn.',
      'Bỏ qua "không làm gì" và chi phí của việc chờ, nên mọi so sánh đều diễn ra giữa các phương án hành động, và nhóm chọn hành động ngay cả khi đứng yên là tốt nhất.',
      'Không ghi lại giả định lúc quyết, nên khi kết quả xấu cả nhóm rơi vào tranh cãi trí nhớ và không rút được bài học nào dùng lại được.',
    ],
    worksheet: [
      'Quyết định của bạn là gì? Viết một câu gồm các lựa chọn, người quyết cuối cùng và hạn chót cụ thể.',
      'Liệt kê tiêu chí, đánh dấu cái nào là ràng buộc loại trừ và cái nào có trọng số. Làm bước này xong hãy mới đọc tiếp.',
      'Ghi ba phương án trở lên, trong đó có "không làm gì". Chi phí của không làm gì trong ba tháng tới là bao nhiêu?',
      'Với phương án bạn nghiêng về, viết ba giả định và mức tin cậy phần trăm cho từng cái.',
      'Ngày nào bạn sẽ xem lại quyết định này, và dấu hiệu nào khiến bạn xem lại sớm hơn ngày đó?',
    ],
    exercises: [
      { label: 'Phân loại đảo ngược', text: 'Liệt kê mười quyết định bạn đang treo và đánh dấu từng cái là đảo ngược được hay khó đảo. Chốt ngay trong ngày toàn bộ nhóm đảo ngược được.', level: 'e' },
      { label: 'Tiêu chí trước, phương án sau', text: 'Với một lựa chọn sắp tới (mua thiết bị, chọn nhà cung cấp, chọn khoá học), viết đủ tiêu chí và trọng số trước khi mở bất kỳ trang so sánh nào. Lưu bản đó lại.', level: 'e' },
      { label: 'Thêm phương án thứ ba', text: 'Lấy ba quyết định đang được đặt ở dạng có hoặc không quanh bạn và với mỗi cái viết thêm hai phương án khác, kể cả phương án làm một phần hoặc hoãn có điều kiện.', level: 'e' },
      { label: 'Sổ quyết định', text: 'Mở một sổ ghi mỗi quyết định đáng kể theo bốn dòng: lựa chọn, tiêu chí, giả định kèm mức chắc, ngày xem lại. Duy trì trong bốn tuần với ít nhất tám mục.', level: 'm' },
      { label: 'Gọi cho người đã đi trước', text: 'Trước một quyết định lớn, tìm hai người đã từng ở tình huống tương tự và hỏi họ điều gì họ ước biết trước. Ghi lại và đối chiếu với bảng tiêu chí của bạn.', level: 'm' },
      { label: 'Chi phí của việc chờ', text: 'Với một quyết định bạn đang trì hoãn, tính bằng số tiền hoặc số giờ chi phí của mỗi tuần chờ thêm. Đặt con số đó cạnh giá trị thông tin bạn hy vọng thu được khi chờ.', level: 'm' },
      { label: 'Rà lại quyết định cũ', text: 'Chọn ba quyết định bạn đã ra hơn sáu tháng trước, dựng lại thông tin bạn có lúc đó và chấm quy trình chứ không chấm kết quả. Xếp mỗi cái vào một trong bốn ô: quy trình tốt hay xấu, kết quả tốt hay xấu.', level: 'h' },
      { label: 'Thử thách 7 ngày: một mục sổ mỗi ngày', text: 'Bảy ngày, mỗi ngày ghi vào sổ quyết định một lựa chọn bạn đã đưa ra kèm giả định và mức chắc, dù nhỏ. Cuối tuần đọc lại và đánh dấu mục nào bạn viết tiêu chí sau khi đã chọn — đó là thói quen cần chữa trước tiên.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao không nên đánh giá chất lượng quyết định bằng kết quả?',
        a: 'Vì kết quả là hàm của quyết định cộng với may rủi. Một quyết định cẩn trọng vẫn có thể ra kết quả xấu, và một quyết định liều lĩnh vẫn có thể trúng. Nếu chỉ học từ kết quả, bạn sẽ củng cố những thói quen liều đã may mắn và bỏ đi những thói quen tốt vừa gặp xui. Cách đúng là chấm quy trình theo thông tin có tại thời điểm quyết, rồi mới hỏi riêng kết quả nói lên điều gì mới.',
      },
      {
        q: 'Vì sao phải viết tiêu chí trước khi xem kỹ các phương án?',
        a: 'Vì khi đã có cảm tình với một phương án, người ta điều chỉnh trọng số một cách vô thức để nó thắng — thêm tiêu chí nó mạnh, hạ tiêu chí nó yếu. Viết trước biến bảng tiêu chí thành một cam kết kiểm chứng được: nếu sau đó bạn muốn sửa trọng số, ít nhất bạn phải nói ra lý do và người khác nghe được.',
      },
      {
        q: 'Với quyết định đảo ngược được, chiến lược nào hợp lý và vì sao?',
        a: 'Chốt nhanh, chi phí phân tích thấp, và coi việc thực hiện chính là cách thu thông tin. Vì chi phí sai là chi phí quay đầu, thường nhỏ hơn nhiều so với chi phí của việc trì hoãn và của những giờ họp bàn. Ngược lại với quyết định khó đảo — tuyển người, ký hợp đồng dài hạn, chọn nền tảng công nghệ — thì đầu tư thêm một vòng phản biện là xứng đáng.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê mọi quyết định đang treo, phân loại đảo ngược được hay không. Ngày 2: chốt hết nhóm đảo ngược được. Ngày 3: với quyết định lớn nhất, viết tiêu chí và trọng số trước khi xem phương án. Ngày 4: mở rộng tập phương án lên ít nhất ba, gồm cả không làm gì. Ngày 5: gọi cho hai người đã từng ở tình huống tương tự. Ngày 6: cho điểm từng tiêu chí riêng lẻ, ghi ba giả định và mức chắc. Ngày 7: chốt, viết ngày xem lại, và bắt đầu sổ quyết định để dùng lâu dài.',
    evidence:
      'Sổ quyết định duy trì từ sáu tháng trở lên là một trong ít bằng chứng khó nguỵ tạo về năng lực phán đoán. Trích ra ba mục đã tới ngày xem lại, mỗi mục gồm bối cảnh, tiêu chí, giả định lúc đó và kết quả thực tế, trong đó ít nhất một mục có kết quả xấu. Trong phỏng vấn, mục có kết quả xấu được kể theo cách tách quy trình khỏi may rủi sẽ thuyết phục hơn hẳn một chuỗi thành công. Trong CV, thể hiện bằng vai trò và quy mô: "Chủ trì lựa chọn nhà cung cấp cho hạng mục chiếm 30% chi phí đầu vào, áp bảng tiêu chí chốt trước, tỷ lệ đơn giao trễ giữ dưới 2% trong 4 tháng đầu".',
    references: [
      { label: 'Decision Theory — Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/decision-theory/', type: 'article' },
      { label: 'Farnam Street — Decision Journal', url: 'https://fs.blog/decision-journal/', type: 'article', needsReview: true },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 13 — Ra quyết định khi thiếu thông tin
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Thiếu thông tin là trạng thái bình thường của mọi quyết định đáng kể, không phải trường hợp ngoại lệ cần xoá bỏ trước khi hành động. Việc cần làm không phải chờ cho hết bất định mà là xác định điều chưa biết nào thực sự có thể đổi lựa chọn, mua đúng phần thông tin đó với chi phí hợp lý, và thiết kế bước đi sao cho nếu sai thì quay lại được. Câu hỏi trung tâm không phải "tôi đã biết đủ chưa" mà "biết thêm điều gì thì tôi sẽ chọn khác đi".',
    why: {
      work: 'Thị trường, đối thủ và cả nhu cầu nội bộ đều thay đổi nhanh hơn tốc độ bạn thu thập dữ liệu. Đội nào chỉ hành động khi đã chắc chắn thì luôn đi sau; đội nào hành động bừa thì đốt nguồn lực. Kỹ năng này là đường ở giữa: bước nhỏ, có ngưỡng, có đường lui.',
      interview:
        'Người phỏng vấn thường cố tình giấu dữ kiện để xem bạn phản ứng ra sao. Câu trả lời mạnh là nêu giả định rõ ràng, chỉ ra dữ kiện nào bạn sẽ đi hỏi trước và vì sao, rồi đưa ra một quyết định tạm kèm điểm xem lại — thay vì đứng im hoặc bịa ra sự chắc chắn.',
      study:
        'Khi bắt đầu một lĩnh vực mới, bạn không đủ hiểu biết để lập lộ trình tối ưu. Cách hiệu quả là chọn một dự án nhỏ có thể hoàn thành trong hai tuần để lộ ra mình thiếu gì, thay vì dành hai tháng đọc lý thuyết cho một bản đồ mà bạn còn chưa biết đúng hay sai.',
      life: 'Trước những chuyện lớn như đổi nghề, hầu như không bao giờ có đủ dữ liệu. Thay vì chờ chắc chắn, có thể mua thông tin bằng bước nhỏ: làm thử một dự án ngoài giờ, nói chuyện với năm người đang làm nghề đó, thử một tuần theo lịch sinh hoạt mới.',
    },
    framework: [
      { name: 'Liệt kê điều chưa biết', detail: 'Viết ra mọi thứ bạn không biết, rồi lọc bằng một câu hỏi duy nhất: nếu biết điều này thì lựa chọn của tôi có đổi không? Những gì trả lời "không" thì bỏ khỏi danh sách, dù chúng thú vị tới đâu.' },
      { name: 'Chấm hai trục cho mỗi ẩn số', detail: 'Với các ẩn số còn lại, chấm mức ảnh hưởng tới quyết định và chi phí để biết. Ưu tiên ô ảnh hưởng cao và rẻ; ô ảnh hưởng cao nhưng đắt thì tìm cách đo gián tiếp thay vì đo trực tiếp.' },
      { name: 'Phân loại theo khả năng lui', detail: 'Tách quyết định đảo ngược được (thử rồi rút, chi phí quay đầu nhỏ) khỏi quyết định khó đảo (hợp đồng dài, tuyển người, tuyên bố công khai). Với nhóm đầu, hành động chính là cách rẻ nhất để thu thông tin.' },
      { name: 'Thiết kế phép thử rẻ nhất', detail: 'Chọn cách kiểm nào giảm được nhiều bất định nhất trên mỗi đồng bỏ ra, và ưu tiên phép thử đòi người ta bỏ ra thứ gì đó thật (thời gian, tiền cọc, một cam kết) thay vì chỉ trả lời câu hỏi.' },
      { name: 'Viết ngưỡng trước khi chạy', detail: 'Trước khi có dữ liệu, viết ba ngưỡng: kết quả nào thì tiếp tục, kết quả nào thì đổi cách, kết quả nào thì dừng hẳn. Không có ngưỡng viết trước thì mọi kết quả đều sẽ được diễn giải theo hướng bạn đang muốn đi.' },
    ],
    scenario:
      'Hai người định mở một lớp dạy đàn cho trẻ em ở khu dân cư mới, cần thuê mặt bằng 12 tháng và mua nhạc cụ. Điều chưa biết lớn nhất không phải "cha mẹ có thích ý tưởng này không" — hỏi ai cũng nói thích — mà là "có bao nhiêu gia đình sẵn sàng trả trước học phí tháng đầu". Thay vì thuê ngay, họ mượn phòng sinh hoạt cộng đồng hai buổi cuối tuần, mở lớp thử 6 buổi với mức giá thật, và yêu cầu đóng trước một nửa. Ngưỡng viết trước: từ 12 học viên trở lên thì thuê mặt bằng, 6 đến 11 thì tiếp tục dạy cuối tuần thêm một quý, dưới 6 thì dừng. Kết quả 9 học viên. Họ không thuê, dạy cuối tuần thêm ba tháng, và trong thời gian đó phát hiện phần lớn phụ huynh quan tâm khung giờ sau 17h ngày thường chứ không phải cuối tuần — thông tin mà nếu ký hợp đồng ngay họ sẽ trả giá đắt hơn nhiều để biết.',
    comparison: [
      { weak: 'Dùng "chưa đủ dữ liệu" như lý do hoãn, không nói rõ cần dữ liệu gì và bao lâu thì có.', mature: 'Nêu đích danh ba ẩn số, cách lấy từng cái, chi phí và ngày có kết quả — biến việc chờ thành một kế hoạch có hạn.' },
      { weak: 'Hỏi khách hàng tiềm năng "anh chị có thấy ý tưởng này hay không".', mature: 'Đề nghị họ làm một hành động tốn kém nhỏ: đặt cọc, ghi danh, dành một buổi, giới thiệu cho người khác — lời nói rẻ, hành vi mới là dữ liệu.' },
      { weak: 'Chạy thử rồi nhìn số liệu và tự quyết xem thế là tốt hay xấu.', mature: 'Viết ngưỡng tiếp tục, đổi và dừng trước khi chạy, gửi cho một người khác giữ để mình khỏi tự nới ngưỡng.' },
    ],
    mistakes: [
      'Đi thu thập những thông tin dễ lấy và thú vị nhưng không đổi được quyết định, khiến báo cáo dày lên mà bất định thực sự vẫn nguyên vẹn.',
      'Đối xử với mọi quyết định như thể khó đảo ngược, nên áp quy trình nặng cho cả những việc thử một tuần là biết — chi phí lớn nhất ở đây là số phép thử đã không bao giờ được chạy.',
      'Chạy phép thử mà không định nghĩa trước thế nào là thất bại, rồi diễn giải kết quả mập mờ theo hướng có lợi, biến cả bài kiểm thành nghi thức xác nhận điều đã muốn làm.',
    ],
    worksheet: [
      'Viết ra quyết định đang chờ và liệt kê tất cả những gì bạn không biết về nó, chưa cần sắp xếp.',
      'Gạch bỏ mọi dòng mà nếu biết cũng không đổi lựa chọn của bạn. Còn lại bao nhiêu dòng?',
      'Với từng dòng còn lại, ghi hai con số: mức ảnh hưởng tới quyết định từ 1 đến 5, và chi phí để biết tính bằng tiền hoặc ngày.',
      'Quyết định này đảo ngược được không? Nếu sai, chi phí quay đầu là bao nhiêu và mất bao lâu?',
      'Viết phép thử rẻ nhất cho ẩn số quan trọng nhất, kèm ba ngưỡng: tiếp tục nếu ___, đổi cách nếu ___, dừng nếu ___.',
    ],
    exercises: [
      { label: 'Lọc ẩn số vô ích', text: 'Với một quyết định đang treo, liệt kê 10 điều bạn chưa biết rồi gạch bỏ những cái không đổi được lựa chọn. Ghi lại tỷ lệ bị gạch — nó thường cao hơn bạn nghĩ.', level: 'e' },
      { label: 'Bảng hai trục', text: 'Đặt các ẩn số còn lại lên lưới ảnh hưởng và chi phí để biết. Chọn ô cao và rẻ, viết cách lấy thông tin đó trong vòng một tuần.', level: 'e' },
      { label: 'Đảo hay không đảo', text: 'Lấy năm quyết định gần đây của bạn và tính chi phí quay đầu cho từng cái bằng tiền và thời gian. Đối chiếu với lượng thời gian bạn đã dành để cân nhắc chúng.', level: 'e' },
      { label: 'Đổi lời nói lấy hành vi', text: 'Thiết kế lại một câu hỏi khảo sát bạn định gửi thành một hành động nhỏ mà người ta phải bỏ công thực hiện. Chạy cả hai và so tỷ lệ phản hồi với tỷ lệ hành động.', level: 'm' },
      { label: 'Ngưỡng gửi cho người khác giữ', text: 'Trước một phép thử sắp chạy, viết ba ngưỡng và gửi cho một đồng nghiệp. Sau khi có kết quả, để họ đọc ngưỡng ra trước khi bạn diễn giải số liệu.', level: 'm' },
      { label: 'Đo gián tiếp', text: 'Chọn một ẩn số quan trọng nhưng đắt để đo trực tiếp. Nghĩ ra hai chỉ báo gián tiếp rẻ hơn và đánh giá mức độ chúng thật sự liên quan tới thứ bạn cần biết.', level: 'm' },
      { label: 'Cửa một chiều và hai chiều', text: 'Phân loại toàn bộ quyết định của nhóm bạn trong một tháng thành cửa một chiều và cửa hai chiều, rồi đề xuất quy trình khác nhau cho hai nhóm. Thử áp dụng trong bốn tuần và ghi thời gian ra quyết định trung bình.', level: 'h' },
      { label: 'Thử thách 7 ngày: mỗi ngày một phép thử rẻ', text: 'Bảy ngày, mỗi ngày chọn một điều bạn đang phỏng đoán và thiết kế cách kiểm nó trong dưới 30 phút hoặc dưới 100 nghìn đồng. Chạy luôn trong ngày. Cuối tuần đếm bao nhiêu phỏng đoán của bạn hoá ra sai — con số đó là thước đo mức bạn đang dựa vào cảm giác.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Câu hỏi nào giúp lọc ra thông tin đáng đi thu thập?',
        a: '"Nếu biết điều này, lựa chọn của tôi có đổi không?" Nếu câu trả lời là không thì thông tin đó, dù thú vị, không có giá trị quyết định và không đáng bỏ chi phí. Câu hỏi này thường loại được phần lớn danh sách và làm lộ ra một hoặc hai ẩn số thật sự quan trọng mà trước đó bị lấp giữa những thứ dễ tra cứu hơn.',
      },
      {
        q: 'Vì sao lời nói của khách hàng là dữ liệu yếu hơn hành vi, và cách khắc phục?',
        a: 'Vì trả lời "có, tôi sẽ dùng" không tốn gì cả, còn quyết định thật luôn có chi phí cơ hội. Khắc phục bằng cách thiết kế phép thử đòi một cam kết nhỏ nhưng thật: đặt cọc, ghi danh có thời gian cụ thể, cho số điện thoại để hẹn lịch, hoặc bỏ ra một buổi. Tỷ lệ người vượt qua rào cản nhỏ đó là dự báo tốt hơn nhiều so với tỷ lệ người nói thích.',
      },
      {
        q: 'Vì sao ngưỡng phải được viết trước khi có dữ liệu?',
        a: 'Vì sau khi thấy số, việc diễn giải luôn bị kéo về phía điều bạn đã muốn làm — một kết quả trung bình sẽ được đọc thành "có tín hiệu" nếu bạn thích dự án, hoặc "không đủ" nếu bạn đã chán nó. Viết trước biến phép thử thành thứ có thể thất bại thật, và đó là điều kiện để nó có giá trị thông tin.',
      },
    ],
    plan7:
      'Ngày 1: chọn một quyết định đang treo vì thiếu thông tin và liệt kê mọi ẩn số. Ngày 2: lọc bằng câu hỏi "biết rồi có đổi lựa chọn không". Ngày 3: chấm hai trục ảnh hưởng và chi phí, chọn một ẩn số. Ngày 4: tính chi phí quay đầu để biết đây là cửa một chiều hay hai chiều. Ngày 5: thiết kế phép thử rẻ nhất và viết ba ngưỡng, gửi cho một người giữ. Ngày 6: chạy phép thử. Ngày 7: đọc ngưỡng trước, đọc kết quả sau, rồi ghi quyết định tạm kèm ngày xem lại.',
    evidence:
      'Hiện vật cần có là bản thiết kế phép thử viết trước khi chạy, kèm ba ngưỡng và kết quả thực tế — đặc biệt giá trị nếu kết quả là dừng hoặc đổi hướng, vì nó chứng minh ngưỡng của bạn không phải trang trí. Trong phỏng vấn, kể một lần bạn hành động sớm với thông tin không đầy đủ nhưng đã giữ được đường lui, nêu rõ chi phí quay đầu bạn đã tính trước. Trong CV, ghi bằng quy mô tránh được: "Kiểm nhu cầu bằng lớp thử 6 buổi trước khi cam kết thuê mặt bằng 12 tháng; ngưỡng đặt trước dẫn tới quyết định hoãn, tránh cam kết dài hạn khi cầu chỉ đạt 75% mức cần thiết".',
    references: [
      { label: 'Bayesian Epistemology — Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/epistemology-bayesian/', type: 'article' },
      { label: 'Farnam Street — Mental Models', url: 'https://fs.blog/mental-models/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 14 — Tư duy xác suất và thống kê cơ bản
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Xác suất là ngôn ngữ để nói về mức độ tin chắc mà không phải giả vờ chắc chắn; thống kê là bộ công cụ để học từ dữ liệu có nhiễu mà không bị nhiễu dẫn dắt. Bạn không cần thành thạo công thức để dùng được hai thứ này — bốn thói quen là đủ để tránh phần lớn sai lầm đắt tiền: luôn hỏi tỷ lệ nền, luôn hỏi cỡ mẫu và cách lấy mẫu, luôn nói bằng khoảng thay vì một con số, và luôn tách tương quan khỏi nhân quả.',
    why: {
      work: 'Gần như mọi báo cáo bạn nhận đều là một mẫu chứ không phải toàn bộ sự thật: 30 phản hồi, hai tuần dữ liệu, một nhóm thử nghiệm. Biết mẫu nhỏ dao động tới mức nào giúp bạn không đảo chiều chiến lược vì một biến động hoàn toàn bình thường.',
      interview:
        'Ở các vị trí liên quan tới dữ liệu, sản phẩm hoặc vận hành, câu hỏi thường không phải tính toán mà là phản xạ: được đưa một kết quả, bạn có hỏi cỡ mẫu, đường nền và lời giải thích thay thế không. Người hỏi được ba câu đó thường vượt qua vòng này kể cả khi không nhớ công thức.',
      study:
        'Đọc bất kỳ nghiên cứu hay bài báo khoa học phổ thông nào cũng cần ba câu hỏi cơ bản này. Không có chúng, bạn sẽ nhớ những kết luận giật gân nhất — vốn cũng là những kết luận dễ không lặp lại được nhất.',
      life: 'Chẩn đoán y tế, kiểm tra an ninh, cảnh báo lừa đảo đều là bài toán tỷ lệ nền. Hiểu vì sao một xét nghiệm chính xác 99% vẫn có thể cho nhiều kết quả dương tính sai hơn dương tính thật là kiến thức bảo vệ bạn khỏi hoảng loạn không cần thiết — dù mọi quyết định y tế cụ thể vẫn phải hỏi bác sĩ.',
    },
    framework: [
      { name: 'Xác định mẫu và tổng thể', detail: 'Hỏi con số này đo trên ai, và nhóm đó có đại diện cho nhóm bạn muốn kết luận không. Mẫu tự chọn — người tự nguyện trả lời khảo sát, người tự nguyện để lại đánh giá — gần như luôn lệch về phía những người có cảm xúc mạnh.' },
      { name: 'Hỏi tỷ lệ nền trước', detail: 'Trước khi diễn giải một tín hiệu, hỏi hiện tượng đó vốn phổ biến tới mức nào trong nhóm. Khi tỷ lệ nền thấp, ngay cả một phép kiểm rất chính xác cũng sinh ra nhiều báo động sai hơn báo động thật — đây là nguồn của phần lớn hiểu lầm về xét nghiệm và về các hệ thống cảnh báo.' },
      { name: 'Nói bằng khoảng', detail: 'Thay một con số duy nhất bằng một khoảng phản ánh mức bất định: "khoảng 3% đến 7%" thay vì "5%". Với mẫu nhỏ, khoảng này rộng tới mức thường tự nó trả lời câu hỏi có nên hành động hay chưa.' },
      { name: 'Tách nhiễu khỏi tín hiệu', detail: 'Nhìn dữ liệu trước can thiệp để biết chỉ số này vốn dao động bao nhiêu. Một thay đổi nằm trong biên độ dao động lịch sử thì chưa phải bằng chứng, dù nó rơi đúng sau việc bạn vừa làm.' },
      { name: 'Kiểm bốn lời giải thích thay thế', detail: 'Trước khi kết luận A gây ra B, xét: B gây ra A, một biến C gây cả hai, cách chọn mẫu tạo ra mối liên hệ giả, và trùng hợp ngẫu nhiên. Chỉ khi cả bốn đều khó tin thì suy luận nhân quả mới có chỗ đứng.' },
    ],
    scenario:
      'Một cửa hàng trực tuyến đổi màu nút thanh toán và thấy tỷ lệ mua tăng từ 4,0% lên 4,6% trong tuần đầu, nhóm định áp dụng cho toàn bộ trang. Người phụ trách dữ liệu lấy 12 tuần trước đó ra xem: tỷ lệ hàng tuần dao động từ 3,7% đến 4,8% mà không có thay đổi nào. Nói cách khác, 4,6% nằm gọn trong dao động thường ngày. Với lưu lượng hiện tại, để phân biệt được một cải thiện thật cỡ 0,5 điểm phần trăm cần khoảng bốn tuần dữ liệu chứ không phải một. Nhóm giữ nguyên thử nghiệm thêm ba tuần, và kết quả cuối cùng là 4,1% — không khác gì đường nền. Họ chuyển sang thử một thay đổi lớn hơn ở bước nhập địa chỉ, nơi có 28% người dùng bỏ ngang.',
    comparison: [
      { weak: 'Thấy hai trong mười khách rời bỏ sau thay đổi và kết luận thay đổi gây hại.', mature: 'So với tỷ lệ rời bỏ của các nhóm tương đương trước đó; nếu nó vốn dao động 10–25% thì mười quan sát chưa nói lên điều gì.' },
      { weak: 'Báo cáo mức trung bình như thể nó mô tả được đa số người dùng.', mature: 'Kèm phân phối và vài phân vị: trung bình thời gian phản hồi 2 giây có thể che một nhóm 5% phải chờ 30 giây, và chính nhóm đó là người rời đi.' },
      { weak: 'Dừng thử nghiệm ngay khi thấy kết quả có lợi cho giả thuyết mình thích.', mature: 'Định trước thời lượng và cỡ mẫu, rồi mới nhìn kết quả; dừng sớm khi thấy số đẹp là cách chắc chắn để thu về các phát hiện không lặp lại được.' },
    ],
    mistakes: [
      'Bỏ qua tỷ lệ nền: nghe "công cụ phát hiện gian lận chính xác 99%" và cho rằng ai bị đánh dấu thì 99% là gian lận, trong khi nếu gian lận chỉ chiếm 0,1% giao dịch thì phần lớn cảnh báo là sai.',
      'Coi tương quan là nhân quả vì câu chuyện nghe hợp lý, đặc biệt khi mối liên hệ ủng hộ điều nhóm đang muốn làm — và bỏ hẳn việc tìm biến thứ ba giải thích được cả hai.',
      'Đọc p-value như xác suất giả thuyết sai, hoặc coi kết quả "không có ý nghĩa thống kê" là bằng chứng rằng không có tác động, trong khi thường nó chỉ có nghĩa là mẫu quá nhỏ để nói được gì.',
    ],
    worksheet: [
      'Chép lại một con số bạn đang dựa vào để quyết định. Nó đo trên bao nhiêu quan sát?',
      'Những quan sát đó được chọn thế nào? Ai có nhiều khả năng lọt vào mẫu hơn người khác, và điều đó kéo con số về hướng nào?',
      'Chỉ số này dao động bao nhiêu trong 8–12 kỳ trước khi có bất kỳ can thiệp nào? Ghi giá trị nhỏ nhất và lớn nhất.',
      'Viết lại kết luận của bạn dưới dạng một khoảng thay vì một con số. Khoảng đó có còn dẫn tới cùng một hành động không?',
      'Liệt kê bốn lời giải thích thay thế cho mối liên hệ bạn đang tin, và ghi cách loại bỏ ít nhất một cái.',
    ],
    exercises: [
      { label: 'Đường nền 12 kỳ', text: 'Chọn một chỉ số bạn theo dõi và vẽ 12 kỳ gần nhất trước bất kỳ can thiệp nào. Ghi biên độ dao động tự nhiên và dán con số đó lên chỗ dễ thấy.', level: 'e' },
      { label: 'Ai lọt vào mẫu', text: 'Lấy ba nguồn dữ liệu bạn hay dùng (khảo sát, đánh giá, phản hồi hỗ trợ) và với mỗi cái viết ra ai có nhiều khả năng xuất hiện trong đó hơn và điều đó làm lệch kết luận theo hướng nào.', level: 'e' },
      { label: 'Trung bình che gì', text: 'Với một chỉ số đang được báo cáo bằng trung bình, tính thêm phân vị 50, 90 và 99. Viết một câu mô tả nhóm ở đuôi mà trung bình đang che đi.', level: 'e' },
      { label: 'Bài toán tỷ lệ nền', text: 'Giả sử một dấu hiệu xuất hiện ở 1% số trường hợp và bộ kiểm phát hiện đúng 95% với 5% báo động sai. Trên 10.000 trường hợp, tính số cảnh báo đúng và sai bằng bảng đếm đơn giản, rồi diễn giải ý nghĩa cho công việc của bạn.', level: 'm' },
      { label: 'Bốn lời giải thích', text: 'Chọn một mối liên hệ đang được nhóm bạn coi là nhân quả và viết đủ bốn lời giải thích thay thế. Đề xuất một cách kiểm để loại bỏ ít nhất một trong số đó.', level: 'm' },
      { label: 'Ước lượng có khoảng', text: 'Trong hai tuần, mỗi lần đưa ra một con số dự báo trong công việc, ghi kèm khoảng bạn tin 80%. Cuối kỳ đếm bao nhiêu lần giá trị thật rơi ngoài khoảng.', level: 'm' },
      { label: 'Định trước cỡ mẫu', text: 'Trước một thử nghiệm sắp chạy, ước lượng thô cần bao nhiêu quan sát để phân biệt được mức cải thiện bạn quan tâm với dao động thường ngày. Nếu không đủ lưu lượng, viết ra điều đó và đề xuất thử một thay đổi lớn hơn.', level: 'h' },
      { label: 'Thử thách 7 ngày: ba câu hỏi mỗi ngày', text: 'Bảy ngày, mỗi khi gặp một con số trong công việc hoặc trên báo, hỏi đủ ba câu: đo trên bao nhiêu, chọn mẫu thế nào, so với đường nền nào. Ghi lại con số nào không trả lời được cả ba. Cuối tuần đếm tỷ lệ — nó cho biết bạn đang ra quyết định trên nền dữ liệu chắc tới đâu.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao một phép kiểm chính xác 99% vẫn có thể cho phần lớn cảnh báo là sai?',
        a: 'Vì kết quả phụ thuộc tỷ lệ nền. Nếu chỉ 0,1% trong 100.000 trường hợp là thật, tức 100 ca, phép kiểm bắt được khoảng 99 ca đúng. Nhưng 1% báo động sai trên 99.900 ca còn lại tạo ra khoảng 999 cảnh báo sai. Vậy trong hơn 1.000 cảnh báo, chỉ khoảng 9% là thật. Bài học thực tế: khi thứ bạn tìm rất hiếm, hãy chuẩn bị quy trình xác minh bước hai thay vì hành động ngay theo cảnh báo.',
      },
      {
        q: 'Vì sao dừng một thử nghiệm ngay khi thấy kết quả đẹp là sai lầm?',
        a: 'Vì trong lúc dữ liệu còn ít, chỉ số dao động mạnh và sẽ có lúc tình cờ vượt ngưỡng bạn mong. Nếu bạn liên tục nhìn và dừng ở đúng khoảnh khắc đó, bạn đã chọn ra nhiễu chứ không phải tín hiệu. Cách xử lý là định trước thời lượng hoặc cỡ mẫu và chỉ đọc kết quả khi đạt, hoặc dùng phương pháp thiết kế riêng cho việc theo dõi liên tục.',
      },
      {
        q: '"Không có ý nghĩa thống kê" có nghĩa là không có tác động không?',
        a: 'Không. Nó chỉ có nghĩa là dữ liệu hiện có không đủ để phân biệt tác động quan sát được với dao động ngẫu nhiên. Với mẫu nhỏ, ngay cả tác động thật khá lớn cũng có thể không đạt ngưỡng. Cách đọc đúng là nhìn khoảng ước lượng: nếu khoảng đó bao gồm cả những giá trị đủ lớn để đổi quyết định, kết luận đúng là "chưa biết", không phải "không có".',
      },
    ],
    plan7:
      'Ngày 1: lấy một chỉ số quan trọng và dựng đường nền 12 kỳ, ghi biên độ dao động. Ngày 2: rà ba nguồn dữ liệu bạn hay dùng và viết cơ chế lệch mẫu của từng cái. Ngày 3: làm bài toán tỷ lệ nền bằng bảng đếm trên 10.000 trường hợp. Ngày 4: chuyển một chỉ số trung bình sang phân vị và mô tả nhóm ở đuôi. Ngày 5: viết bốn lời giải thích thay thế cho một mối liên hệ nhóm bạn đang tin. Ngày 6: ước lượng cỡ mẫu cần cho một thử nghiệm sắp chạy. Ngày 7: viết lại ba kết luận gần đây của bạn dưới dạng khoảng và xem có kết luận nào đổi hành động không.',
    evidence:
      'Thứ dùng được làm bằng chứng là những lần bạn ngăn một quyết định dựa trên nhiễu. Giữ lại phân tích đường nền cho thấy một "cải thiện" nằm trong dao động thường ngày, kèm quyết định hoãn triển khai và kết quả về sau. Một hiện vật khác rất ít người có: bảng theo dõi hiệu chỉnh dự đoán của chính bạn — ghi 20 đến 30 dự đoán kèm mức tin cậy và đối chiếu thực tế. Trong phỏng vấn, nêu ba câu hỏi phản xạ của bạn khi nhận một con số. Trong CV, viết bằng hành động cụ thể: "Xây đường nền dao động cho 6 chỉ số chính, đặt quy tắc cỡ mẫu tối thiểu trước khi kết luận thử nghiệm".',
    references: [
      { label: 'OpenIntro Statistics — sách thống kê nhập môn mở', url: 'https://www.openintro.org/book/os/', type: 'article' },
      { label: 'Interpretations of Probability — Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/probability-interpret/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 15 — Đọc và diễn giải dữ liệu
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Đọc dữ liệu là ba việc xảy ra trước khi nhìn đường xu hướng: hiểu dữ liệu này được sinh ra thế nào, hiểu chỉ số được định nghĩa ra sao, và nhận ra biểu đồ đang nhấn mạnh hay che giấu điều gì qua cách chọn trục, mẫu số và khoảng thời gian. Một hình vẽ đẹp không sửa được một định nghĩa sai, và phần lớn hiểu lầm tốn kém trong doanh nghiệp không đến từ số liệu bịa mà từ số liệu thật bị đọc trong một khung sai.',
    why: {
      work: 'Bạn nhận dashboard mỗi ngày và phần lớn thời gian không có ai giải thích kèm. Người biết đọc mẫu số và định nghĩa trước sẽ phát hiện những chỗ mà cả phòng đang lạc quan hoặc bi quan vì lý do kỹ thuật chứ không phải vì thực tế đổi.',
      interview:
        'Nhiều vòng phỏng vấn đưa cho bạn một biểu đồ và hỏi "bạn thấy gì". Người mô tả đường đi lên đi xuống được điểm trung bình; người hỏi trục bắt đầu từ đâu, mẫu số là gì, dữ liệu thu thế nào rồi mới nêu một kết luận kèm một giới hạn thì nổi bật hẳn.',
      study:
        'Tài liệu học ngày càng nhiều biểu đồ, và biểu đồ là nơi dễ ghi nhớ sai nhất vì hình ảnh in vào trí nhớ mạnh hơn chú thích. Tập đọc chú thích và đơn vị trước khi nhìn hình là một thói quen rẻ nhưng đổi hẳn chất lượng ghi nhớ.',
      life: 'Tin tức về giá cả, dịch bệnh hay giao thông đều đi kèm biểu đồ được chọn để tạo cảm xúc. Nhận ra một trục y bị cắt hoặc một so sánh đổi mẫu số giúp bạn giữ được phản ứng tương xứng với thực tế.',
    },
    framework: [
      { name: 'Đọc chú thích trước hình', detail: 'Bắt đầu từ tiêu đề, đơn vị, khoảng thời gian, nguồn và ghi chú nhỏ ở chân biểu đồ. Chỉ khi đã biết mình đang nhìn cái gì mới cho phép mắt đi theo đường xu hướng, vì hình dạng đường sẽ định khung cách bạn đọc mọi thứ sau đó.' },
      { name: 'Truy định nghĩa chỉ số', detail: 'Hỏi chính xác cái gì được đếm và cái gì bị loại: "người dùng hoạt động" tính theo phiên hay theo thiết bị, "doanh thu" đã trừ hoàn tiền và chiết khấu chưa, "đơn hoàn tất" tính lúc đặt hay lúc giao. Hai bộ phận dùng cùng một tên cho hai định nghĩa là nguồn tranh cãi kinh điển.' },
      { name: 'Kiểm mẫu số và cách thu', detail: 'Xem tử số và mẫu số có đi cùng nhau không, và dữ liệu được thu tự động hay nhập tay. Chỉ số tuyệt đối giảm trong khi quy mô cũng giảm thì tỷ lệ có thể đang tăng, và ngược lại.' },
      { name: 'Soi thủ thuật trình bày', detail: 'Trục y không bắt đầu từ 0 khi so sánh độ lớn, hai trục y ghép hai chuỗi không liên quan, đổi khoảng thời gian giữa các cột, gộp nhóm để làm mờ khác biệt, chọn ngày mốc có lợi. Không phải lúc nào cũng cố ý, nhưng luôn cần kiểm.' },
      { name: 'Kết luận kèm giới hạn và bước kiểm', detail: 'Kết thúc bằng ba câu: điều dữ liệu này ủng hộ, điều nó không nói được, và phép kiểm tiếp theo. Đây là cách một bản đọc dữ liệu trở thành đầu vào cho quyết định thay vì một nhận xét trôi qua.' },
    ],
    scenario:
      'Bộ phận hỗ trợ của một công ty phần mềm báo cáo tin vui: số ticket trong quý giảm từ 1.180 xuống 1.020. Biểu đồ có trục y bắt đầu ở 980 nên trông như một cú lao dốc. Người quản lý mở dữ liệu thô ra và đặt hai câu hỏi. Thứ nhất, số khách hàng hoạt động trong quý cũng giảm từ 4.100 xuống 3.400 — tính theo số ticket trên mỗi 1.000 khách thì con số thực ra tăng từ 288 lên 300. Thứ hai, định nghĩa "ticket" vừa đổi giữa quý: các yêu cầu gửi qua kênh chat mới không còn được tạo ticket tự động. Sau khi tính lại và cộng cả kênh chat, khối lượng hỗ trợ trên mỗi khách tăng khoảng 12%. Báo cáo được viết lại kèm một dòng ghi rõ ngày đổi định nghĩa, và bộ phận sản phẩm bắt đầu tìm nguyên nhân thay vì ăn mừng.',
    comparison: [
      { weak: 'Nhìn hình dạng đường trước rồi mới đọc chú thích nếu còn thời gian.', mature: 'Che phần hình lại, đọc tiêu đề, đơn vị, mẫu số và nguồn trước, tự đoán hình sẽ ra sao rồi mới mở ra xem.' },
      { weak: 'Chấp nhận tên chỉ số như một khái niệm ai cũng hiểu giống nhau.', mature: 'Yêu cầu bản định nghĩa bằng chữ và ngày định nghĩa đó có hiệu lực, đặc biệt khi so sánh hai giai đoạn.' },
      { weak: 'Trình bày một biểu đồ và để người nghe tự rút kết luận.', mature: 'Viết sẵn ba câu: dữ liệu ủng hộ điều gì, không nói được điều gì, cần kiểm gì tiếp — và nói ra trước khi ai kịp diễn giải theo ý họ.' },
    ],
    mistakes: [
      'So sánh hai giai đoạn mà định nghĩa chỉ số đã đổi ở giữa, nên toàn bộ mức thay đổi quan sát được là do cách đo chứ không do thực tế — và không ai phát hiện vì tên chỉ số vẫn y nguyên.',
      'Chỉ nhìn số tổng trên dashboard mà không bao giờ mở phân đoạn, nên các nhóm nhỏ có vấn đề nghiêm trọng bị trung hoà hoàn toàn trong con số trung bình.',
      'Chọn biểu đồ sau khi đã biết câu chuyện muốn kể, rồi thử vài cách trình bày cho tới khi một cách làm câu chuyện đó nổi bật — một dạng gian lận vô thức rất khó tự phát hiện.',
    ],
    worksheet: [
      'Lấy một biểu đồ bạn vừa nhìn thấy. Không đọc hình, hãy ghi ra: tiêu đề, đơn vị, khoảng thời gian và nguồn.',
      'Chỉ số trong đó được định nghĩa chính xác thế nào? Ai giữ định nghĩa này và nó đổi lần cuối vào ngày nào?',
      'Tử số và mẫu số là gì? Nếu quy mô nền thay đổi trong kỳ, con số này còn nói lên điều đó không?',
      'Trục y bắt đầu từ đâu, có hai trục không, khoảng thời gian giữa các điểm có đều không? Ghi mọi lựa chọn trình bày có thể phóng đại hoặc làm dịu.',
      'Viết ba câu: dữ liệu này ủng hộ ___; nó không nói được gì về ___; bước kiểm tiếp theo là ___.',
    ],
    exercises: [
      { label: 'Che hình đọc chú thích', text: 'Với năm biểu đồ trong báo cáo nội bộ hoặc trên báo, che phần hình và chỉ đọc chú thích, tự vẽ đường bạn dự đoán rồi so với thực tế.', level: 'e' },
      { label: 'Từ điển chỉ số', text: 'Chọn ba chỉ số quan trọng nhất ở nơi bạn làm và viết định nghĩa chính xác cho từng cái, gồm cái gì được tính, cái gì bị loại và từ ngày nào. Đối chiếu với hai đồng nghiệp khác phòng.', level: 'e' },
      { label: 'Săn trục cắt', text: 'Tìm ba biểu đồ có trục y không bắt đầu từ 0. Vẽ lại chúng với trục từ 0 và ghi lại mức thay đổi trong ấn tượng thị giác.', level: 'e' },
      { label: 'Đổi mẫu số', text: 'Lấy một chỉ số tuyệt đối đang được theo dõi và tính lại nó theo một mẫu số hợp lý (trên mỗi khách hàng, trên mỗi đơn, trên mỗi giờ vận hành). Ghi lại trường hợp kết luận đảo chiều.', level: 'm' },
      { label: 'Mở phân đoạn', text: 'Với một chỉ số tổng đang ổn định, cắt theo ba trục và tìm nhóm nào đang xấu đi bị che bởi trung bình. Viết một đoạn ngắn báo cáo phát hiện đó.', level: 'm' },
      { label: 'Nhật ký đổi định nghĩa', text: 'Lập một trang ghi mọi lần định nghĩa chỉ số hoặc cách thu dữ liệu thay đổi, kèm ngày. Rà lại ba tháng qua và bổ sung những thay đổi đã xảy ra mà chưa ai ghi.', level: 'm' },
      { label: 'Viết lại một báo cáo', text: 'Chọn một báo cáo định kỳ ở nơi bạn làm và viết lại nó theo cấu trúc ba câu kết luận, kèm mục ghi chú về giới hạn dữ liệu. Gửi cho người nhận thường xuyên và hỏi bản nào dễ dùng hơn.', level: 'h' },
      { label: 'Thử thách 7 ngày: một biểu đồ mỗi ngày', text: 'Bảy ngày, mỗi ngày chọn một biểu đồ trên báo chí hoặc mạng xã hội và viết ba dòng: nó muốn bạn kết luận gì, lựa chọn trình bày nào giúp kết luận đó nổi lên, và dữ liệu nào còn thiếu để kết luận đó đứng vững. Cuối tuần xếp bảy trường hợp theo mức độ gây hiểu lầm.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao trục y không bắt đầu từ 0 không phải lúc nào cũng sai, nhưng luôn phải được để ý?',
        a: 'Với dữ liệu dao động quanh một mức cao — nhiệt độ, tỷ giá, tỷ lệ chuyển đổi — cắt trục là cách hợp lý để thấy biến động có ý nghĩa. Vấn đề nảy sinh khi biểu đồ dùng chiều cao cột để so sánh độ lớn giữa các nhóm: lúc đó trục cắt phóng đại chênh lệch một cách thị giác. Nguyên tắc thực dụng: cắt trục thì được, nhưng phải ghi rõ và không dùng cột.',
      },
      {
        q: 'Bạn nhận một báo cáo cho thấy chỉ số cải thiện mạnh. Hai câu hỏi đầu tiên nên là gì?',
        a: 'Thứ nhất: định nghĩa chỉ số hoặc cách thu dữ liệu có thay đổi trong kỳ so sánh không — đây là nguyên nhân phổ biến nhất của những bước nhảy đột ngột. Thứ hai: mẫu số có thay đổi không, vì một tỷ lệ có thể cải thiện chỉ vì nhóm nền thu hẹp lại. Chỉ khi hai câu này đã rõ mới bàn tới nguyên nhân thực tế.',
      },
      {
        q: 'Vì sao "chọn biểu đồ sau khi đã biết câu chuyện" là vấn đề, và cách phòng?',
        a: 'Vì bạn sẽ vô thức thử nhiều cách trình bày cho tới khi một cách làm câu chuyện nổi bật, và bản thân quá trình chọn đó đã lọc bỏ những cách trình bày trung thực hơn. Cách phòng: quyết định trước sẽ vẽ chỉ số nào theo dạng nào và trong khoảng thời gian nào, ghi lại trước khi mở dữ liệu, và nếu đổi thì ghi rõ lý do đổi trong chính báo cáo.',
      },
    ],
    plan7:
      'Ngày 1: chọn ba chỉ số chính và viết định nghĩa chính xác cho từng cái. Ngày 2: đối chiếu định nghĩa đó với hai người ở phòng khác, ghi chỗ lệch. Ngày 3: lập nhật ký đổi định nghĩa cho ba tháng qua. Ngày 4: tính lại một chỉ số tuyệt đối theo mẫu số phù hợp. Ngày 5: cắt một chỉ số tổng theo ba trục và tìm nhóm bị che. Ngày 6: rà các biểu đồ trong báo cáo định kỳ, đánh dấu mọi lựa chọn trình bày gây phóng đại. Ngày 7: viết lại báo cáo đó theo cấu trúc ba câu kết luận và gửi đi.',
    evidence:
      'Từ điển chỉ số và nhật ký đổi định nghĩa là hai tài liệu nhỏ nhưng gần như không tổ chức nào có sẵn, nên việc bạn tự lập chúng là bằng chứng rõ ràng về cách làm việc. Kèm theo đó, giữ một trường hợp bạn phát hiện một "cải thiện" là do đổi cách đo chứ không do thực tế, kèm hệ quả nếu không phát hiện. Trong phỏng vấn, khi được đưa một biểu đồ, hãy nói to quy trình đọc của bạn theo thứ tự chú thích, định nghĩa, mẫu số, trình bày, rồi mới kết luận — bản thân trình tự đó là thứ được chấm. Trong CV: "Chuẩn hoá định nghĩa 12 chỉ số vận hành và lập nhật ký thay đổi, chấm dứt tranh cãi định kỳ giữa hai bộ phận về cùng một con số".',
    references: [
      { label: 'OpenIntro — tài liệu thống kê và trực quan hoá dữ liệu mở', url: 'https://www.openintro.org/', type: 'article' },
      { label: 'Our World in Data — hướng dẫn đọc dữ liệu và biểu đồ', url: 'https://ourworldindata.org/', type: 'article', needsReview: true },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 16 — Tư duy chiến lược — Strategic Thinking
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Chiến lược là một tập lựa chọn gắn kết về nơi tham gia, cách thắng ở đó, và quan trọng nhất là những gì sẽ không làm — trong điều kiện nguồn lực luôn ít hơn cơ hội. Dấu hiệu nhận biết một tài liệu không phải chiến lược: nó không loại bỏ thứ gì, ai đọc cũng gật đầu, và đối thủ cũng có thể ký tên vào đó mà không thấy sai. Một danh sách mục tiêu đầy tham vọng không phải chiến lược; nó chỉ là cách phát biểu lại mong muốn.',
    why: {
      work: 'Ở mọi cấp, thời gian và ngân sách là hữu hạn, nên câu hỏi thật không phải "cái này có tốt không" mà "cái này có tốt hơn thứ ta sẽ phải bỏ để làm nó không". Người tư duy chiến lược là người nói được đánh đổi đó thành lời, nên các cuộc họp ưu tiên với họ ngắn hơn.',
      interview:
        'Với vị trí quản lý hoặc chuyên gia cấp cao, câu hỏi "nếu vào đây bạn sẽ ưu tiên gì trong 90 ngày" là câu chiến lược. Trả lời bằng danh sách năm việc đều quan trọng sẽ thua trả lời nêu một trọng tâm, lý do chọn nó, và những gì bạn cố ý chưa đụng tới.',
      study:
        'Với thời gian học hữu hạn, chiến lược học là chọn một năng lực đích và chấp nhận học nông ở những phần không phục vụ nó. Học đều tất cả là chiến lược của người không phải trả giá cho thời gian.',
      life: 'Chọn nơi sống, chọn nghề, chọn dành thời gian cho ai — đều là bài toán phân bổ nguồn lực không hoàn lại được. Viết ra điều mình cố ý không theo đuổi trong năm nay khó chịu hơn viết mục tiêu, nhưng nó mới là phần quyết định.',
    },
    framework: [
      { name: 'Chẩn đoán tình hình', detail: 'Viết một đoạn nêu điều gì đang thực sự quyết định kết quả trong bối cảnh của bạn: thay đổi trong nhu cầu, thay đổi công nghệ, điểm nghẽn nội bộ, hành vi đối thủ. Chẩn đoán tốt loại bỏ phần lớn phương án ngay từ đầu vì chúng không chạm tới lực chính.' },
      { name: 'Chọn nơi tham gia', detail: 'Xác định phân khúc, địa bàn, loại khách hàng hoặc loại công việc bạn nhắm tới, và nêu rõ những nơi bạn chủ động không tham gia. Nếu danh sách "không tham gia" trống thì bạn chưa chọn.' },
      { name: 'Xác lập cách thắng', detail: 'Nói cụ thể vì sao khách hàng ở nơi đó chọn bạn thay vì lựa chọn tốt nhất tiếp theo của họ, và điều gì khiến lợi thế đó không bị sao chép trong sáu tháng. Nếu câu trả lời là "chúng tôi làm tốt hơn" thì chưa có lợi thế nào.' },
      { name: 'Dựng hệ hành động củng cố nhau', detail: 'Liệt kê ba đến năm hành động chính và kiểm xem chúng có làm mạnh lẫn nhau không. Một tập hành động rời rạc, mỗi cái phục vụ một logic khác, sẽ tiêu hết nguồn lực mà không tạo được ưu thế ở đâu cả.' },
      { name: 'Đặt giả định và chỉ báo đổi hướng', detail: 'Ghi ba giả định mà chiến lược này phụ thuộc vào, kèm chỉ báo quan sát được cho từng cái và tần suất kiểm. Chiến lược không có chỉ báo là chiến lược không thể sai, tức là không thể học được gì từ nó.' },
    ],
    scenario:
      'Một công ty phần mềm kế toán năm người cạnh tranh với các nhà cung cấp lớn có hàng trăm tính năng. Suốt hai năm họ chạy theo danh sách tính năng của đối thủ và luôn thua. Nhóm ngồi lại làm chẩn đoán: khách hàng của họ chủ yếu là kế toán làm tự do phục vụ 10 đến 30 doanh nghiệp nhỏ, và điểm đau lớn nhất là chuyển dữ liệu hoá đơn giữa nhiều khách hàng, chứ không phải thiếu tính năng báo cáo. Họ chọn nơi tham gia là đúng nhóm này và viết ra danh sách không làm: không xây phân hệ nhân sự, không phục vụ doanh nghiệp trên 100 nhân viên, không làm ứng dụng di động trong năm nay. Ba hành động củng cố nhau: nhập hoá đơn hàng loạt cho nhiều khách hàng cùng lúc, hỗ trợ trả lời trong hai giờ vào mùa quyết toán, và hợp tác với hai cộng đồng kế toán tự do. Giả định ghi lại: nhóm này chịu trả theo tháng, và họ giới thiệu cho nhau. Sau ba quý, doanh thu tăng chủ yếu từ giới thiệu, và tỷ lệ khách rời giảm — trong khi số tính năng vẫn ít hơn đối thủ.',
    comparison: [
      { weak: 'Tài liệu chiến lược gồm sáu mục tiêu, mục nào cũng "tăng trưởng, chất lượng, hiệu quả".', mature: 'Tài liệu có một chẩn đoán, một trọng tâm, và một danh sách rõ những việc sẽ không làm trong kỳ này.' },
      { weak: 'Sao chép động thái của đối thủ lớn hơn vì họ chắc đã tính kỹ.', mature: 'Hỏi lợi thế của họ đến từ đâu và mình có nền tảng đó không; nếu không thì bắt chước chỉ chuyển cuộc chơi về sân họ mạnh nhất.' },
      { weak: 'Đặt mục tiêu cả năm rồi chỉ xem lại vào cuối năm.', mature: 'Gắn mỗi giả định với một chỉ báo và một nhịp kiểm, để đổi hướng khi còn kịp thay vì tổng kết khi đã hết ngân sách.' },
    ],
    mistakes: [
      'Nhầm kế hoạch với chiến lược: liệt kê chi tiết ai làm gì khi nào mà chưa trả lời được vì sao khách hàng sẽ chọn ta — kế hoạch chi tiết cho một hướng sai chỉ giúp đi sai nhanh hơn.',
      'Cố phục vụ mọi phân khúc để không bỏ lỡ cơ hội nào, kết quả là sản phẩm trung bình cho tất cả và không đủ tốt cho ai, trong khi chi phí hỗ trợ nhân lên theo số nhóm khách.',
      'Viết chiến lược xong cất đi, không ai dựa vào nó để từ chối việc — nên trong thực tế mọi yêu cầu đến đều được nhận, và chiến lược thật của tổ chức là "ai kêu to nhất thì được".',
    ],
    worksheet: [
      'Viết một đoạn chẩn đoán: lực nào đang thực sự quyết định kết quả trong lĩnh vực của bạn ngay lúc này?',
      'Bạn chọn phục vụ ai hoặc tham gia ở đâu? Ghi kèm ít nhất ba nhóm hoặc ba hướng bạn chủ động không tham gia trong 12 tháng tới.',
      'Vì sao người ta chọn bạn thay vì lựa chọn tốt thứ hai của họ? Trả lời bằng một câu mà đối thủ không thể nói y hệt.',
      'Liệt kê ba đến năm hành động chính. Với mỗi cặp, ghi chúng củng cố nhau ở điểm nào — cặp nào không nối được thì xem lại.',
      'Ba giả định mà toàn bộ điều trên phụ thuộc vào là gì? Chỉ báo nào cho biết một giả định đang sai, và bao lâu bạn kiểm một lần?',
    ],
    exercises: [
      { label: 'Danh sách không làm', text: 'Viết ra mười việc nhóm bạn đang làm hoặc định làm và chọn ba việc sẽ dừng trong quý này. Ghi lý do bằng nguồn lực được giải phóng, không bằng chê việc đó vô ích.', level: 'e' },
      { label: 'Thử câu ngược', text: 'Lấy từng câu trong tài liệu chiến lược hiện có và thử viết câu ngược lại. Nếu câu ngược nghe vô lý với mọi công ty thì câu gốc là lời sáo rỗng chứ không phải lựa chọn.', level: 'e' },
      { label: 'Lựa chọn tốt thứ hai', text: 'Đi hỏi năm khách hàng hoặc năm người dùng nội bộ rằng nếu không có bạn thì họ sẽ dùng gì. Ghi lại câu trả lời và đối chiếu với điều bạn vẫn nghĩ là đối thủ.', level: 'e' },
      { label: 'Chẩn đoán một trang', text: 'Viết một trang chẩn đoán cho lĩnh vực của bạn, chỉ gồm quan sát và cơ chế, tuyệt đối không có đề xuất hành động nào. Đưa cho hai người trong ngành đọc và ghi chỗ họ phản đối.', level: 'm' },
      { label: 'Kiểm tính gắn kết', text: 'Vẽ ba đến năm hành động chính của nhóm bạn thành các ô và nối mũi tên chỉ ra chúng củng cố nhau ở đâu. Ô nào không có mũi tên nào là ứng viên để cắt.', level: 'm' },
      { label: 'Bảng giả định và chỉ báo', text: 'Lập bảng ba cột: giả định, chỉ báo quan sát được, tần suất kiểm. Điền cho chiến lược hiện tại và đặt lịch kiểm thật trong bốn tuần tới.', level: 'm' },
      { label: 'Từ chối bằng chiến lược', text: 'Trong một tháng, mỗi lần từ chối một yêu cầu, viết một câu giải thích dựa trên tài liệu chiến lược. Cuối tháng đếm số lần bạn không viết được câu đó — đó là mức tài liệu chưa đủ rõ.', level: 'h' },
      { label: 'Thử thách 7 ngày: mỗi ngày một đánh đổi', text: 'Bảy ngày, mỗi ngày ghi lại một quyết định trong ngày và viết ra thứ bạn đã phải bỏ để làm nó — thời gian, tiền, hoặc một cơ hội khác. Cuối tuần xem bảy thứ bị bỏ có tạo thành mô-típ nào không; mô-típ đó thường chính là chiến lược thật của bạn, dù có viết ra hay không.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Phân biệt mục tiêu, kế hoạch và chiến lược.',
        a: 'Mục tiêu nói ta muốn tới đâu (tăng doanh thu 30%). Chiến lược nói ta sẽ thắng bằng cách nào và ở đâu, kèm điều ta không làm (chỉ phục vụ kế toán tự do, không xây phân hệ nhân sự). Kế hoạch nói ai làm gì, khi nào, với nguồn lực nào. Nhiều tổ chức có mục tiêu và kế hoạch nhưng thiếu hẳn phần ở giữa, nên hoạt động rất nhiều mà không tích luỹ được ưu thế.',
      },
      {
        q: 'Một phép kiểm nhanh xem tài liệu của bạn có phải chiến lược thật không?',
        a: 'Thử viết mệnh đề ngược lại của từng câu. Nếu câu ngược là điều không công ty nào chọn ("chúng tôi nhắm tới doanh nghiệp trên 100 nhân viên" là ngược của "chỉ phục vụ nhóm nhỏ" — cả hai đều là lựa chọn hợp lý), thì câu gốc là một lựa chọn thật. Nếu câu ngược nghe vô lý ("chúng tôi hướng tới chất lượng thấp"), thì câu gốc chỉ là lời sáo rỗng và không loại bỏ được gì.',
      },
      {
        q: 'Vì sao "làm tốt hơn đối thủ" không phải một cách thắng?',
        a: 'Vì nó không nêu cơ chế và không bền: nếu chỉ dựa vào làm tốt hơn cùng một việc, đối thủ có nhiều nguồn lực hơn sẽ vượt bạn khi họ chú ý tới. Cách thắng thật phải chỉ ra điều bạn làm được mà họ khó sao chép trong sáu tháng vì lý do cấu trúc: vị trí gần một nhóm khách cụ thể, dữ liệu tích luỹ, quan hệ phân phối, hoặc một đánh đổi mà mô hình của họ không cho phép chấp nhận.',
      },
    ],
    plan7:
      'Ngày 1: viết một trang chẩn đoán chỉ gồm quan sát, không có đề xuất. Ngày 2: đưa cho hai người trong ngành đọc và ghi phản đối của họ. Ngày 3: viết nơi tham gia kèm danh sách ba việc không làm. Ngày 4: hỏi năm khách hàng về lựa chọn tốt thứ hai của họ. Ngày 5: viết câu cách thắng và thử phép kiểm mệnh đề ngược. Ngày 6: vẽ ba đến năm hành động và kiểm chúng có củng cố nhau không. Ngày 7: lập bảng giả định, chỉ báo và nhịp kiểm, đặt lịch thật cho lần kiểm đầu tiên.',
    evidence:
      'Tài liệu chiến lược một trang có phần "không làm" là hiện vật hiếm và dễ nhận ra chất lượng. Kèm theo nó, giữ lại bằng chứng bạn đã thật sự dùng nó để từ chối: ba yêu cầu bị từ chối kèm lý do trích từ tài liệu, và kết quả của việc dồn nguồn lực vào trọng tâm. Trong phỏng vấn cho vị trí quản lý, câu chuyện mạnh nhất thường là một lần bạn dừng một mảng đang có doanh thu để dồn cho mảng khác, kèm số liệu trước sau và cách bạn xử lý phản đối nội bộ. Trong CV, viết bằng lựa chọn: "Thu hẹp phân khúc mục tiêu từ 4 nhóm xuống 1, dừng 3 hạng mục sản phẩm; tỷ lệ khách rời giảm và phần lớn tăng trưởng mới đến từ giới thiệu trong 3 quý".',
    references: [
      { label: 'Harvard Business Review — chuyên mục Strategy', url: 'https://hbr.org/topic/subject/strategy', type: 'article', needsReview: true },
      { label: 'Farnam Street — Mental Models', url: 'https://fs.blog/mental-models/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 17 — Tư duy phản tư — Reflective Thinking
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Phản tư là thao tác biến trải nghiệm thành năng lực bằng cách đối chiếu bốn thứ: điều bạn định làm, điều bạn thực sự làm, điều đã xảy ra, và giả định nào đã dẫn bạn tới đó. Thiếu bước cuối, phản tư dừng lại ở kể chuyện và bạn có thể lặp lại cùng một năm kinh nghiệm nhiều lần mà tưởng mình đang tiến bộ. Sản phẩm của một buổi phản tư đúng nghĩa không phải cảm giác thấu suốt mà là một hành vi cụ thể đã được viết ra cho lần sau, đủ rõ để người khác quan sát được bạn có làm hay không.',
    why: {
      work: 'Kinh nghiệm không tự động thành năng lực; nó chỉ thành năng lực khi có vòng phản hồi. Người phản tư có kỷ luật tiến nhanh hơn hẳn người làm nhiều hơn nhưng không bao giờ dừng lại xem cái gì đã thực sự tạo ra kết quả.',
      interview:
        'Câu "bạn học được gì" xuất hiện trong hầu hết mọi cuộc phỏng vấn, và đa số ứng viên trả lời bằng bài học chung chung. Người nêu được một thay đổi hành vi cụ thể, đã áp dụng ở lần sau, kèm bằng chứng nó tốt hơn, tạo ra khác biệt rõ rệt.',
      study:
        'Sau mỗi bài kiểm tra hay dự án học tập, việc rà lại vì sao mình sai — hiểu sai đề, thiếu kiến thức, hay sai kỹ thuật làm bài — quyết định lần ôn tiếp theo có hiệu quả không. Không rà thì mọi lần ôn đều bắt đầu lại từ đầu.',
      life: 'Các mô-típ lặp lại trong quan hệ, chi tiêu hay sức khoẻ chỉ lộ ra khi có bản ghi. Trí nhớ tự nhiên có xu hướng làm dịu quá khứ và giữ lại kết luận có lợi cho hình ảnh bản thân, nên phản tư bằng văn bản khác hẳn phản tư bằng suy nghĩ.',
    },
    framework: [
      { name: 'Ghi lại không tô vẽ', detail: 'Viết chuyện đã xảy ra chỉ bằng thứ camera quay được: ai nói gì, làm gì, lúc nào. Tách hẳn phần diễn giải xuống dưới. Trộn hai phần ngay từ đầu là cách nhanh nhất để phản tư biến thành tự bào chữa hoặc tự trách.' },
      { name: 'So ý định với hành động', detail: 'Đặt cạnh nhau: bạn định làm gì trước khi bắt đầu, và bạn đã thực sự làm gì. Khoảng cách giữa hai cột này thường chứa nhiều thông tin hơn cả kết quả, vì nó chỉ ra điều gì đã kéo bạn lệch khỏi kế hoạch.' },
      { name: 'Truy giả định', detail: 'Hỏi: tôi đã tin điều gì để thấy hành động đó là hợp lý lúc ấy? Giả định thường vô hình vì nó có vẻ hiển nhiên. Viết nó ra rồi kiểm xem nó có còn đúng trong bối cảnh hiện tại không.' },
      { name: 'Tách kỹ năng khỏi may rủi', detail: 'Với cả kết quả tốt lẫn xấu, hỏi phần nào do quyết định của bạn và phần nào do yếu tố nằm ngoài. Không tách thì bạn sẽ học sai bài học từ những lần may mắn, và bỏ đi những thói quen tốt chỉ vì một lần xui.' },
      { name: 'Viết hành vi cho lần sau', detail: 'Kết thúc bằng một câu dạng "lần tới khi gặp tình huống X, tôi sẽ làm Y trước bước Z", đủ cụ thể để người khác quan sát được bạn có làm hay không. "Sẽ chuẩn bị kỹ hơn" không đạt tiêu chuẩn này; "sẽ chạy thử toàn bộ demo trên dữ liệu thật một ngày trước" thì đạt.' },
    ],
    scenario:
      'Một người quản lý dự án vừa có buổi demo thất bại trước khách hàng: phần mềm treo ở bước tải dữ liệu và buổi họp kết thúc sớm. Ghi chép đầu tiên của anh là "cần chuẩn bị kỹ hơn" — một câu không quan sát được. Anh viết lại theo bốn bước. Cột sự việc: demo chạy trên dữ liệu mẫu 200 dòng, khách hàng yêu cầu thử trên file của họ 40.000 dòng, hệ thống treo sau 90 giây. Cột ý định và hành động: anh đã định chạy thử với dữ liệu lớn nhưng bỏ qua vì tối hôm trước còn hai việc khác. Giả định: "khách sẽ xem theo kịch bản mình chuẩn bị". Tách may rủi: việc khách mang file riêng là điều hoàn toàn có thể lường trước, không phải xui. Hành vi cho lần sau, viết cụ thể: một ngày trước mọi buổi demo, chạy toàn bộ kịch bản trên bản sao dữ liệu thật của khách, và luôn có sẵn một video ghi màn hình dài ba phút làm phương án dự phòng. Ba tháng sau, quy tắc này cứu một buổi demo khác khi mạng hội trường hỏng.',
    comparison: [
      { weak: 'Retrospective biến thành phiên kể lỗi của nhau hoặc phiên tự trách.', mature: 'Tách sự việc khỏi diễn giải, cấm dùng tên người ở phần nguyên nhân, và bắt buộc mỗi kết luận sinh ra một hành vi quan sát được.' },
      { weak: 'Chỉ phản tư khi thất bại, còn thành công thì ăn mừng rồi bỏ qua.', mature: 'Rà cả lần thành công để tách phần do quyết định và phần do may — nếu không, thói quen liều từng gặp may sẽ được củng cố mà không ai biết.' },
      { weak: 'Bài học ghi ở dạng "cần giao tiếp tốt hơn với các bên liên quan".', mature: 'Bài học ghi ở dạng "mỗi thứ Sáu gửi một đoạn cập nhật ba dòng cho ba người này, kể cả khi không có tiến triển".' },
    ],
    mistakes: [
      'Phản tư ngay trong lúc cảm xúc còn mạnh, nên toàn bộ bản ghi bị nhuộm bởi cảm giác của thời điểm đó — quá gay gắt nếu vừa thất bại, quá dễ dãi nếu vừa thắng.',
      'Sinh ra danh sách bài học chung chung không có người chịu trách nhiệm và không có thời hạn, nên chúng không bao giờ được kiểm lại và buổi phản tư trở thành nghi thức tiêu tốn thời gian.',
      'Chỉ dựa vào trí nhớ mà không có bản ghi tại thời điểm hành động, nên bạn phản tư trên một phiên bản quá khứ đã được trí nhớ chỉnh sửa cho hợp với kết quả đã biết.',
    ],
    worksheet: [
      'Chọn một sự việc trong hai tuần qua. Viết lại nó chỉ bằng thứ camera quay được, tối đa năm câu, không tính từ đánh giá.',
      'Trước khi bắt đầu, bạn định làm gì? Bạn đã thực sự làm gì? Viết hai cột và khoanh chỗ lệch lớn nhất.',
      'Bạn đã tin điều gì để hành động đó có vẻ hợp lý lúc ấy? Điều đó còn đúng trong bối cảnh hôm nay không?',
      'Phần nào của kết quả đến từ quyết định của bạn, phần nào từ yếu tố ngoài tầm? Nếu quay lại với đúng thông tin lúc đó, bạn có làm khác không?',
      'Hoàn thành: "Lần tới khi gặp ___, tôi sẽ làm ___ trước khi ___". Ai sẽ nhìn thấy bạn có làm hay không, và khi nào bạn kiểm lại câu này?',
    ],
    exercises: [
      { label: 'Năm câu camera', text: 'Viết lại ba sự việc gần đây, mỗi cái tối đa năm câu và không chứa tính từ đánh giá nào. Ghi lại cảm giác khi phải bỏ hết các từ như "tệ", "may mắn", "lộn xộn".', level: 'e' },
      { label: 'Hai cột ý định và hành động', text: 'Với một tuần làm việc vừa qua, lập bảng hai cột cho ba việc lớn nhất và khoanh chỗ lệch. Tìm nguyên nhân chung của các chỗ lệch.', level: 'e' },
      { label: 'Đổi bài học thành hành vi', text: 'Lấy năm bài học chung chung từ các buổi tổng kết cũ ở nơi bạn làm và viết lại từng cái thành một hành vi quan sát được, có người và có nhịp lặp.', level: 'e' },
      { label: 'Phản tư sau 48 giờ', text: 'Với sự việc tiếp theo có cảm xúc mạnh, ghi lại sự kiện ngay trong ngày nhưng hoãn phần diễn giải tới 48 giờ sau. So bản viết ngay và bản viết sau, ghi khác biệt.', level: 'm' },
      { label: 'Rà một lần thành công', text: 'Chọn một kết quả tốt gần đây và tách rõ phần do quyết định của bạn, phần do người khác, phần do may. Viết ra thói quen nào bạn suýt củng cố sai.', level: 'm' },
      { label: 'Xin dữ liệu từ người khác', text: 'Hỏi hai người đã cùng trải qua sự việc đó rằng họ nhớ chuyện gì xảy ra. Ghi ba chi tiết khác với bản của bạn và không tranh cãi, chỉ ghi.', level: 'm' },
      { label: 'Vòng phản tư 30 ngày', text: 'Duy trì bản ghi hằng tuần trong bốn tuần theo đủ năm bước, mỗi tuần kết thúc bằng một hành vi cụ thể. Cuối tháng đọc lại toàn bộ và tìm mô-típ lặp lại giữa các tuần.', level: 'h' },
      { label: 'Thử thách 7 ngày: ba dòng cuối ngày', text: 'Bảy ngày, mỗi tối viết đúng ba dòng: chuyện gì đã xảy ra hôm nay đáng chú ý, tôi đã giả định gì, và lần tới tôi sẽ làm gì khác. Không quá năm phút. Ngày thứ bảy đọc lại cả bảy mục và chọn đúng một hành vi để giữ trong tháng tới.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao phải tách "sự việc" khỏi "diễn giải" ngay từ đầu bản ghi?',
        a: 'Vì khi trộn lẫn, diễn giải đầu tiên sẽ định khung mọi thứ viết sau đó và bạn không còn tiếp cận được dữ liệu thô. Tách ra cho phép bạn — hoặc người khác — thử một diễn giải khác trên cùng bộ sự kiện, và đó chính là chỗ bài học mới xuất hiện. Đây cũng là cách giữ cho một buổi tổng kết nhóm không trượt sang truy trách nhiệm.',
      },
      {
        q: 'Vì sao cần phản tư cả những lần thành công?',
        a: 'Vì thành công cũng có thể đến từ may mắn hoặc từ một quyết định tồi vừa gặp điều kiện thuận lợi. Nếu chỉ rà thất bại, bạn sẽ vô tình củng cố những thói quen rủi ro đã từng trúng, và chúng sẽ hỏng đúng vào lần quan trọng nhất. Rà thành công cũng giúp nhận ra yếu tố nào thực sự tạo ra kết quả để có thể lặp lại một cách chủ động.',
      },
      {
        q: 'Thế nào là một kết luận phản tư đạt chuẩn?',
        a: 'Nó nêu tình huống kích hoạt cụ thể, hành vi cụ thể sẽ làm, và thời điểm làm, đủ rõ để một người ngoài quan sát được bạn có thực hiện hay không. "Sẽ cẩn thận hơn" không đạt. "Trước mọi buổi demo, một ngày trước, chạy toàn bộ kịch bản trên bản sao dữ liệu thật của khách và chuẩn bị video dự phòng ba phút" thì đạt, vì có thể kiểm được.',
      },
    ],
    plan7:
      'Ngày 1: chọn một sự việc và viết bản ghi năm câu chỉ gồm sự kiện. Ngày 2: lập hai cột ý định và hành động, khoanh chỗ lệch. Ngày 3: viết ba giả định đã dẫn bạn tới hành động đó. Ngày 4: hỏi hai người cùng trải qua để bổ sung dữ kiện bạn không thấy. Ngày 5: tách phần do quyết định và phần do may rủi. Ngày 6: viết một hành vi cụ thể cho lần sau và nói cho một người biết để họ nhắc. Ngày 7: xem lại toàn bộ, chọn đúng một hành vi để duy trì và đặt lịch kiểm sau 30 ngày.',
    evidence:
      'Bản ghi phản tư duy trì đều đặn là bằng chứng năng lực học tập, thứ mà nhà tuyển dụng ở mọi cấp đều tìm nhưng hiếm khi thấy được. Trích ra hai mục hoàn chỉnh: một lần thất bại và một lần thành công, mỗi mục đủ bốn phần và kết thúc bằng hành vi cụ thể, kèm bằng chứng hành vi đó đã được dùng ở lần sau và tạo ra kết quả khác. Trong phỏng vấn, đây là câu trả lời cho "bạn học được gì": kể sự việc, giả định đã sai, hành vi mới, và lần áp dụng tiếp theo. Trong CV, thể hiện qua cơ chế bạn xây cho cả nhóm: "Thiết lập quy trình tổng kết sau mỗi đợt phát hành, mỗi kết luận gắn với một hành vi kiểm được; danh sách chốt kiểm trước demo ra đời từ đó và được dùng cho toàn bộ đội".',
    references: [
      { label: 'Self-Knowledge — Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/self-knowledge/', type: 'article' },
      { label: 'Foundation for Critical Thinking', url: 'https://www.criticalthinking.org/', type: 'article' },
    ],
    diagram: 'cycle',
  }),
];
