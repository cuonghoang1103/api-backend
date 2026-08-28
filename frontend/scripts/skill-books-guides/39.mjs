import { guide } from '../skill-guide-builder.mjs';

export default [
  // ── Chương 1 — Digital Literacy ───────────────────────────────────────────
  guide({
    thesis:
      'Năng lực số không đo bằng số phần mềm bạn từng cài, mà đo bằng việc bạn có hiểu đủ ba thứ nền — tệp nằm ở đâu, ai có quyền gì, dữ liệu đang ở định dạng nào — để tự gỡ phần lớn sự cố hằng ngày và tự học một công cụ lạ mà không cần người cầm tay. Người thiếu nền này không phải là người "kém công nghệ"; họ chỉ đang thao tác theo trí nhớ vị trí nút bấm, nên mỗi lần giao diện đổi là mất luôn khả năng làm việc.',
    why: {
      work:
        'Phần lớn thời gian chết trong văn phòng không đến từ việc khó, mà từ những việc lặt vặt: gửi nhầm bản cũ, không mở được tệp đối tác gửi, sửa một giờ trên bản sao rồi phát hiện bản chính đã đổi. Hiểu cơ chế lưu trữ và phân quyền cắt gần hết nhóm sự cố này.',
      interview:
        'Nhiều vị trí văn phòng hiện phỏng vấn bằng bài thực hành ngay trên máy: mở một tệp dữ liệu thô, làm sạch, xuất ra bản chia sẻ được. Người phải hỏi "file này mở bằng gì" đã lộ khoảng trống trước khi chạm tới nghiệp vụ.',
      study:
        'Tài liệu học hiện nằm rải trên nhiều nền tảng, nhiều định dạng và nhiều tài khoản. Không có thói quen tổ chức và sao lưu thì mỗi kỳ học lại mất một phần tài liệu cũ, và thời gian đi tìm ăn mất thời gian đáng lẽ để học.',
      life:
        'Từ khai báo giấy tờ trực tuyến, đặt lịch khám, tới lưu ảnh gia đình — người hiểu tài khoản, quyền và bản sao lưu sẽ không mất dữ liệu chỉ vì đổi điện thoại, và không phụ thuộc vào một người thân "rành máy tính" cho mọi việc.',
    },
    framework: [
      { name: 'Định vị nơi lưu', detail: 'Với mỗi tệp quan trọng, trả lời được: nó nằm trên ổ máy này, trên thư mục đám mây đang đồng bộ, hay chỉ tồn tại trên web. Ba nơi này hỏng theo ba kiểu khác nhau và cứu theo ba cách khác nhau.' },
      { name: 'Đọc quyền trước khi gửi', detail: 'Mỗi liên kết chia sẻ mang một mức quyền: xem, góp ý, sửa, hoặc mở cho bất kỳ ai có link. Kiểm mức quyền trước khi bấm gửi rẻ hơn rất nhiều so với việc thu hồi một tài liệu đã lan ra ngoài.' },
      { name: 'Hiểu định dạng', detail: 'Phân biệt tệp trình bày (PDF, DOCX) với tệp dữ liệu (CSV, JSON) và biết mỗi lần chuyển đổi thì mất gì: xuất bảng tính sang PDF là mất công thức, dán bảng vào email là mất kiểu số.' },
      { name: 'Tự chẩn đoán lỗi', detail: 'Khi có sự cố, tách ba khả năng: mạng, quyền, hay phiên bản/định dạng. Sau đó tìm kiếm bằng nguyên văn thông báo lỗi thay vì mô tả cảm tính "máy bị lỗi".' },
      { name: 'Học công cụ bằng bản nháp', detail: 'Với công cụ mới, tạo một bản sao của dữ liệu thật rồi thử phá trên bản sao đó, đồng thời đọc mục trợ giúp chính chủ thay vì video của bên thứ ba đã cũ.' },
    ],
    scenario:
      'Một kế toán tại công ty phân phối vật tư xây dựng gửi bảng quyết toán công nợ qua email, mỗi lần sửa lại đính kèm một bản mới. Đến cuối tháng, hộp thư có chín tệp cùng tên với các đuôi "final", "final-2", "sua-lai". Kế toán trưởng duyệt nhầm bản thiếu hai hoá đơn. Chị đổi cách: đưa toàn bộ bảng vào một thư mục dùng chung, chỉ cấp quyền sửa cho ba người, đặt tên tệp theo dạng ngày đảo 2026-03-14_congno, và bật lịch sử phiên bản. Từ tháng sau, mọi người mở đúng một đường dẫn duy nhất; khi có tranh cãi về con số, lịch sử phiên bản cho biết ai sửa ô nào và lúc nào, nên cuộc họp đối chiếu rút từ một buổi xuống còn mười lăm phút.',
    comparison: [
      { weak: 'Nhớ đường tới tệp bằng danh sách "gần đây" và ô tìm kiếm, không biết nó thực sự nằm ở đâu.', mature: 'Biết đường dẫn đầy đủ của tệp và biết nó có đang được đồng bộ lên đám mây hay không, nên khi máy hỏng vẫn nói được cái gì còn cái gì mất.' },
      { weak: 'Chia sẻ bằng cách bật "bất kỳ ai có liên kết đều sửa được" cho nhanh, vì đó là lựa chọn ít bị hỏi lại nhất.', mature: 'Cấp quyền theo đúng nhu cầu từng người, đặt hạn cho liên kết tạm, và rà lại danh sách người có quyền sau khi dự án kết thúc.' },
      { weak: 'Gặp lỗi là chụp màn hình gửi cho đồng nghiệp rành máy tính, không đọc nội dung thông báo.', mature: 'Đọc thông báo, chép nguyên văn đi tra, thử tách nguyên nhân bằng một phép thử đơn giản, rồi mới hỏi kèm thông tin đã thử.' },
    ],
    mistakes: [
      'Coi thư mục đồng bộ đám mây là bản sao lưu: khi bạn xoá nhầm hoặc tệp bị mã hoá hỏng, nó đồng bộ luôn trạng thái hỏng đó lên mọi máy, nên đây là sao chép chứ không phải sao lưu.',
      'Gõ dữ liệu vào ô có định dạng sai rồi kết luận phần mềm bị lỗi — số điện thoại mất số 0 đầu, mã hàng biến thành ngày tháng đều là hệ quả của định dạng ô, không phải hỏng dữ liệu.',
      'Nghĩ rằng học công nghệ nghĩa là học thuộc từng nút bấm của một phiên bản, nên mỗi lần giao diện được cập nhật lại thấy mình quay về vạch xuất phát.',
    ],
    worksheet: [
      'Liệt kê 5 tệp quan trọng nhất bạn đang dùng cho công việc; với mỗi tệp ghi rõ nó nằm ở đâu và ai đang có quyền sửa nó.',
      'Nếu chiếc máy bạn đang dùng hỏng hoàn toàn trong đêm nay, thứ gì bạn mất vĩnh viễn? Viết ra danh sách đó, không viết "chắc là không mất gì".',
      'Mở một liên kết chia sẻ bạn đã gửi trong tháng qua: nó đang ở mức quyền nào, và mức đó có còn cần thiết không?',
      'Ghi lại nguyên văn thông báo lỗi gần nhất bạn gặp. Bạn đã tra nó chưa, hay chỉ khởi động lại máy?',
      'Quy ước đặt tên tệp hiện tại của bạn là gì? Nếu chưa có, viết một quy ước gồm ngày, nội dung và người phụ trách rồi áp dụng ngay cho thư mục tháng này.',
    ],
    exercises: [
      { label: 'Bản đồ ba nơi', text: 'Vẽ một bảng ba cột: trên máy, trên đám mây đồng bộ, chỉ trên web. Xếp 15 tệp hoặc thư mục bạn dùng thường xuyên vào đúng cột, và đánh dấu những thứ chỉ tồn tại ở một cột duy nhất.', level: 'e' },
      { label: 'Đổi định dạng có kiểm soát', text: 'Lấy một bảng tính có công thức, xuất ra CSV rồi mở lại. Ghi ra chính xác những gì đã mất so với bản gốc và giải thích vì sao mất.', level: 'e' },
      { label: 'Đặt tên lại một thư mục', text: 'Chọn một thư mục đang lộn xộn, áp dụng quy ước tên gồm ngày đảo và nội dung cho toàn bộ tệp trong đó, rồi đo thời gian tìm một tệp cụ thể trước và sau.', level: 'e' },
      { label: 'Rà soát quyền', text: 'Mở danh sách tài liệu bạn đã chia sẻ, liệt kê những liên kết đang mở cho bất kỳ ai và thu hẹp lại đúng người cần. Ghi số liên kết bạn đã đóng.', level: 'm' },
      { label: 'Diễn tập mất máy', text: 'Giả định máy chính không dùng được: chỉ với điện thoại và một máy mượn, thử làm lại một công việc thường ngày. Ghi lại chỗ bạn bị chặn và chuẩn bị sẵn cho lần thật.', level: 'm' },
      { label: 'Tra lỗi tự thân', text: 'Trong hai tuần, mỗi lần gặp sự cố hãy tự tra và tự thử trước 15 phút, ghi vào một sổ sự cố: triệu chứng, giả thuyết, cách thử, kết quả. Chỉ hỏi người khác sau 15 phút đó.', level: 'm' },
      { label: 'Hướng dẫn cho người sau', text: 'Chọn một quy trình số bạn làm hằng tuần và viết một hướng dẫn kèm ảnh chụp màn hình đủ để người mới làm đúng mà không hỏi. Nhờ một người thật làm theo và sửa mọi chỗ họ mắc kẹt.', level: 'h' },
      { label: 'Bảy ngày dọn nền số', text: 'Thử thách 7 ngày: mỗi ngày 30 phút xử lý đúng một hạng mục — thư mục dùng chung, quyền chia sẻ, quy ước tên, sao lưu, mật khẩu trình duyệt, dọn tệp trùng, viết sổ sự cố. Ngày cuối tổng kết ba thứ đã đỡ tốn thời gian nhất.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao "tệp của tôi luôn có trên đám mây" chưa đủ để gọi là an toàn dữ liệu?',
        a: 'Vì đồng bộ nhân bản mọi thay đổi, kể cả thay đổi sai. Xoá nhầm hay ghi đè một tệp thì bản trên đám mây cũng đổi theo trong vài giây. An toàn cần thêm một trong hai thứ: lịch sử phiên bản đủ dài để quay lại, hoặc một bản sao độc lập không đồng bộ tự động.',
      },
      {
        q: 'Đối tác gửi một tệp mà máy bạn không mở được. Ba khả năng đầu tiên nên nghĩ tới là gì?',
        a: 'Một, sai định dạng — máy chưa có phần mềm đọc loại tệp đó, giải quyết bằng công cụ chuyển đổi hoặc xin bản định dạng phổ thông. Hai, tệp hỏng trong lúc truyền, kiểm bằng cách so dung lượng với bản gốc. Ba, quyền — tệp có mật khẩu hoặc liên kết chỉ mở cho tài khoản nội bộ của họ. Hỏi lại một câu đúng trọng tâm nhanh hơn thử mù.',
      },
      {
        q: 'Một đồng nghiệp nói "tôi không có khiếu công nghệ" sau khi giao diện phần mềm được cập nhật và mọi nút đổi chỗ. Chẩn đoán thật là gì?',
        a: 'Họ đang ghi nhớ vị trí thao tác chứ chưa hiểu mô hình bên dưới: dữ liệu này là gì, được lưu ở đâu, thao tác này thực chất làm gì. Cách chữa không phải học lại giao diện mới, mà đặt câu hỏi về mục tiêu — "tôi cần biến bảng này thành tệp gửi được cho khách" — rồi tìm chức năng tương ứng, vì mục tiêu thì không đổi theo phiên bản.',
      },
    ],
    plan7:
      'Ngày 1: lập bản đồ ba nơi lưu cho 15 tệp quan trọng. Ngày 2: chọn và áp dụng quy ước đặt tên cho một thư mục đang lộn xộn. Ngày 3: rà toàn bộ liên kết đã chia sẻ và thu hẹp quyền. Ngày 4: thiết lập một bản sao lưu độc lập cho nhóm tệp không thể mất. Ngày 5: thử chuyển đổi định dạng và ghi lại những gì bị mất. Ngày 6: mở sổ sự cố và tự xử lý mọi lỗi trong ngày trước khi hỏi ai. Ngày 7: viết một hướng dẫn ngắn cho quy trình số bạn làm nhiều nhất và nhờ một người kiểm thử.',
    evidence:
      'Sản phẩm mang đi được là một "sổ tay vận hành số" của nhóm bạn: sơ đồ thư mục dùng chung kèm bảng ai có quyền gì, quy ước đặt tên tệp, quy tắc sao lưu, và nhật ký mười sự cố bạn đã tự chẩn đoán kèm cách xử lý. Trong phỏng vấn, đó là câu trả lời cụ thể cho "bạn có tổ chức không" — bạn đưa ra một tài liệu người khác đang dùng thật, kèm con số thời gian tìm tệp trước và sau khi áp dụng.',
    references: [
      { label: 'GCFGlobal — khoá học miễn phí về kỹ năng máy tính và internet căn bản', url: 'https://edu.gcfglobal.org/en/', type: 'article' },
      { label: 'Google Workspace Learning Center — hướng dẫn chính chủ về chia sẻ và phân quyền tài liệu', url: 'https://support.google.com/a/users', type: 'article' },
    ],
  }),

  // ── Chương 2 — An toàn thông tin cá nhân ──────────────────────────────────
  guide({
    thesis:
      'An toàn thông tin cá nhân không phải là trạng thái "không thể bị tấn công", mà là một tập thói quen hạ thấp xác suất bị lộ và rút ngắn thiệt hại khi đã lộ. Ba trụ đủ dùng cho gần như mọi người đi làm: mật khẩu không dùng lại và có nơi quản lý, xác thực hai lớp cho các tài khoản gốc, và một bản sao lưu mà kẻ chiếm được tài khoản của bạn không xoá được. Mọi thứ còn lại là chi tiết bổ sung.',
    why: {
      work:
        'Một tài khoản email công việc bị chiếm không chỉ mất thư của bạn: nó là chìa mở lại mật khẩu của hàng chục dịch vụ khác, và là danh tính để gửi yêu cầu chuyển tiền cho đồng nghiệp bằng chính giọng văn của bạn.',
      interview:
        'Với các vị trí chạm dữ liệu khách hàng — nhân sự, kế toán, chăm sóc khách hàng, vận hành — người phỏng vấn thường hỏi bạn xử lý dữ liệu nhạy cảm thế nào. Trả lời được bằng thói quen cụ thể tạo cảm giác an tâm hơn hẳn một lời hứa cẩn thận.',
      study:
        'Tài khoản học tập gắn với điểm, bài nộp và giấy tờ cá nhân. Mất quyền truy cập giữa kỳ vì dùng lại mật khẩu từ một diễn đàn đã bị lộ là tai nạn xảy ra thường xuyên và hoàn toàn tránh được.',
      life:
        'Phần lớn lừa đảo nhắm vào cá nhân không dùng kỹ thuật cao, mà dùng sự vội và sự sợ: một tin nhắn báo tài khoản sắp khoá, một cuộc gọi giả người quen. Có sẵn quy tắc xác minh giúp bạn chậm lại đúng lúc cần chậm.',
    },
    framework: [
      { name: 'Kiểm kê tài sản số', detail: 'Liệt kê tài khoản theo mức độ thiệt hại nếu mất: nhóm gốc (email chính, tài khoản ngân hàng, số điện thoại), nhóm quan trọng, nhóm còn lại. Bảo vệ mạnh nhất dồn vào nhóm gốc chứ không rải đều.' },
      { name: 'Một mật khẩu một nơi', detail: 'Dùng trình quản lý mật khẩu để mỗi dịch vụ có một mật khẩu khác nhau, đủ dài, và bạn chỉ phải nhớ một mật khẩu chính. Việc dùng lại mật khẩu mới là thứ biến một vụ lộ dữ liệu ở đâu đó thành mất tài khoản của bạn.' },
      { name: 'Lớp xác thực thứ hai', detail: 'Bật xác thực hai lớp cho nhóm gốc, ưu tiên ứng dụng sinh mã hoặc khoá vật lý hơn tin nhắn SMS, và lưu mã dự phòng ở nơi ngoại tuyến để không tự khoá chính mình.' },
      { name: 'Quy tắc chậm lại', detail: 'Với mọi yêu cầu gấp liên quan tới tiền, mật khẩu hoặc dữ liệu, xác minh qua một kênh khác kênh nhận yêu cầu. Người gửi thật không bao giờ mất gì vì bạn gọi lại một cuộc; kẻ giả mạo thì mất tất cả.' },
      { name: 'Sao lưu 3-2-1 rút gọn', detail: 'Giữ ít nhất hai bản sao ở hai nơi khác nhau, trong đó một bản không đăng nhập cùng tài khoản với bản chính, để một tài khoản bị chiếm không kéo theo mất hết dữ liệu.' },
      { name: 'Kịch bản khi đã lộ', detail: 'Viết trước các bước: đổi mật khẩu nhóm gốc, đăng xuất mọi phiên, kiểm địa chỉ chuyển tiếp thư lạ, báo cho người có thể bị mạo danh. Viết lúc bình tĩnh thì lúc hoảng còn dùng được.' },
    ],
    scenario:
      'Một nhân viên hành chính của trường trung học nhận email mang tên hiệu trưởng, gửi từ một địa chỉ gần giống địa chỉ thật, yêu cầu gấp danh sách lương giáo viên để "kịp báo cáo chiều nay". Chị làm theo quy tắc chậm lại: không trả lời email, gọi máy nội bộ của hiệu trưởng và biết ông không gửi gì. Sau đó chị so hai địa chỉ, phát hiện một chữ cái bị thay, chuyển email cho bộ phận kỹ thuật và thông báo cho toàn trường. Hai tuần sau, một trường khác trong cùng địa bàn mất bảng lương vì đúng mẫu email này. Chi phí phòng ngừa là một cuộc gọi ba mươi giây.',
    comparison: [
      { weak: 'Một mật khẩu mạnh dùng cho mọi dịch vụ, tự tin vì nó dài và có ký tự đặc biệt.', mature: 'Mỗi dịch vụ một mật khẩu ngẫu nhiên do trình quản lý sinh ra, vì độ mạnh không cứu được khi chính dịch vụ kia làm lộ cơ sở dữ liệu của họ.' },
      { weak: 'Đánh giá email thật hay giả bằng cảm giác: nhìn logo đẹp, chữ ký đầy đủ nên tin.', mature: 'Đánh giá bằng ba dấu hiệu kiểm được: địa chỉ người gửi đầy đủ, đường dẫn thật khi rê chuột, và tính hợp lý của yêu cầu so với quy trình đã có.' },
      { weak: 'Coi bảo mật là việc của bộ phận kỹ thuật, phần mình chỉ cần không bấm vào link lạ.', mature: 'Coi mình là một điểm ra vào dữ liệu, có danh sách tài khoản, có sao lưu riêng và có kịch bản báo sự cố trong vòng một giờ.' },
    ],
    mistakes: [
      'Bật xác thực hai lớp rồi lưu mã dự phòng ngay trong chính hộp thư đang được bảo vệ, nên khi mất quyền vào hộp thư thì mất luôn đường cứu.',
      'Tin rằng tin nhắn SMS là lớp bảo vệ đủ mạnh, trong khi số điện thoại có thể bị chiếm qua thủ tục cấp lại SIM và khi đó lớp thứ hai không còn là lớp thứ hai.',
      'Chỉ đổi mật khẩu của đúng tài khoản bị lộ, quên rằng mật khẩu đó đang được dùng lại ở năm dịch vụ khác, nên vá một chỗ mà bỏ ngỏ bốn chỗ.',
    ],
    worksheet: [
      'Viết ra ba tài khoản mà nếu mất, mọi tài khoản khác của bạn đều có thể bị lấy lại bởi người chiếm được chúng.',
      'Bạn đang dùng lại một mật khẩu ở bao nhiêu nơi? Nếu không trả lời được con số, đó chính là câu trả lời.',
      'Mã dự phòng xác thực hai lớp của bạn hiện nằm ở đâu, và bạn có lấy được nó khi điện thoại mất không?',
      'Nếu ai đó đang gửi email mạo danh bạn ngay lúc này, ai là người đầu tiên bạn cần báo và bằng kênh nào?',
      'Chọn một dữ liệu bạn không thể mất; nó đang có bao nhiêu bản sao và có bản nào nằm ngoài tài khoản chính của bạn không?',
    ],
    exercises: [
      { label: 'Xếp hạng tài khoản', text: 'Lập bảng tài khoản chia ba nhóm theo mức thiệt hại nếu mất, và đánh dấu nhóm nào đã bật xác thực hai lớp. Bắt đầu bật cho nhóm gốc trước.', level: 'e' },
      { label: 'Tra vết lộ dữ liệu', text: 'Tra địa chỉ email chính của bạn trên một dịch vụ kiểm lộ dữ liệu công khai, ghi lại các dịch vụ từng bị lộ và đổi mật khẩu đúng những nơi đó.', level: 'e' },
      { label: 'Chuyển nhà mật khẩu', text: 'Cài một trình quản lý mật khẩu và chuyển 10 tài khoản dùng nhiều nhất sang mật khẩu ngẫu nhiên riêng biệt. Ghi lại thời gian thực tế bạn tốn cho việc này.', level: 'e' },
      { label: 'Mổ xẻ một email lừa đảo', text: 'Lấy một email đáng ngờ trong hộp thư rác, phân tích và ghi ra năm dấu hiệu: địa chỉ gửi, tên miền của link, lời lẽ gấp gáp, yêu cầu bất thường, lỗi trình bày.', level: 'm' },
      { label: 'Diễn tập mất điện thoại', text: 'Giả định điện thoại bị mất ngay bây giờ: liệt kê theo thứ tự các bước bạn sẽ làm trong 60 phút đầu, rồi kiểm xem bạn có thực hiện được bước đầu tiên mà không cần chính chiếc điện thoại đó không.', level: 'm' },
      { label: 'Sao lưu ngoài tài khoản', text: 'Tạo một bản sao lưu dữ liệu quan trọng ở nơi không đăng nhập bằng tài khoản chính, rồi thử phục hồi một tệp từ đó để chắc chắn bản sao thực sự đọc được.', level: 'm' },
      { label: 'Quy trình xác minh cho nhóm', text: 'Soạn một quy tắc một trang cho phòng ban của bạn về việc xác minh mọi yêu cầu liên quan tới tiền hoặc dữ liệu nhân sự, gồm kênh xác minh phụ và người chịu trách nhiệm. Trình bày và lấy ý kiến ít nhất hai người.', level: 'h' },
      { label: 'Bảy ngày siết tài khoản', text: 'Thử thách 7 ngày: mỗi ngày xử lý một việc — kiểm kê tài khoản, cài trình quản lý mật khẩu, bật hai lớp cho nhóm gốc, cất mã dự phòng ngoại tuyến, dựng sao lưu độc lập, viết kịch bản sự cố, diễn tập kịch bản đó với một người thân.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao dùng lại một mật khẩu rất mạnh ở nhiều nơi vẫn là rủi ro lớn?',
        a: 'Vì rủi ro không nằm ở việc ai đó đoán ra mật khẩu của bạn, mà ở việc một trong các dịch vụ bạn từng đăng ký làm lộ dữ liệu người dùng. Khi đó mật khẩu của bạn nằm sẵn trong tay kẻ khác dù nó dài bao nhiêu, và họ chỉ việc thử cặp email–mật khẩu đó ở các dịch vụ phổ biến khác.',
      },
      {
        q: 'Một tin nhắn báo "tài khoản của bạn sẽ bị khoá trong 2 giờ, bấm vào đây để xác minh". Bạn kiểm tra thế nào mà không cần biết kỹ thuật?',
        a: 'Không bấm link trong tin nhắn. Tự mở ứng dụng hoặc tự gõ địa chỉ chính thức của dịch vụ đó và kiểm tra thông báo trong tài khoản; nếu có vấn đề thật thì nó sẽ hiện ở đó. Yếu tố thời hạn gấp là công cụ tâm lý để bạn không kịp kiểm chứng, nên chính nó là dấu hiệu đáng ngờ nhất.',
      },
      {
        q: 'Bạn phát hiện tài khoản email chính đã bị người khác đăng nhập. Ba việc đầu tiên theo thứ tự là gì?',
        a: 'Một, đổi mật khẩu và đăng xuất toàn bộ phiên đang hoạt động, vì đổi mật khẩu mà không đăng xuất thì phiên cũ có thể vẫn còn. Hai, kiểm tra các thiết lập đã bị cài cắm: địa chỉ chuyển tiếp thư, bộ lọc tự xoá, ứng dụng được cấp quyền, số điện thoại khôi phục. Ba, báo cho những người có thể nhận được thư mạo danh từ bạn, và chỉ sau đó mới đi đổi mật khẩu các dịch vụ liên quan.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê tài khoản và xếp ba nhóm thiệt hại. Ngày 2: cài trình quản lý mật khẩu, chuyển nhóm gốc sang mật khẩu riêng. Ngày 3: bật xác thực hai lớp cho nhóm gốc và in mã dự phòng cất ngoại tuyến. Ngày 4: tra vết lộ dữ liệu và đổi mật khẩu ở những nơi trúng. Ngày 5: dựng một bản sao lưu độc lập rồi thử phục hồi thật một tệp. Ngày 6: viết kịch bản một trang cho tình huống mất tài khoản hoặc mất điện thoại. Ngày 7: diễn tập kịch bản đó cùng một đồng nghiệp và sửa những bước không chạy được.',
    evidence:
      'Bằng chứng dùng được là bản quy tắc xác minh một trang mà phòng ban bạn đã áp dụng thật, kèm nhật ký các email đáng ngờ đã được chặn nhờ nó. Trong phỏng vấn cho vị trí chạm dữ liệu nhân sự, kế toán hay khách hàng, bạn kể được: bối cảnh, quy tắc bạn đề xuất, số người áp dụng, và một sự việc cụ thể quy tắc đó đã ngăn được — mạnh hơn nhiều so với việc nói mình cẩn thận.',
    references: [
      { label: 'NCSC (Anh) — hướng dẫn an toàn thông tin cho cá nhân và tổ chức nhỏ', url: 'https://www.ncsc.gov.uk/', type: 'article' },
      { label: 'Have I Been Pwned — tra cứu email đã xuất hiện trong các vụ lộ dữ liệu công khai', url: 'https://haveibeenpwned.com/', type: 'article' },
    ],
  }),

  // ── Chương 3 — AI Literacy ───────────────────────────────────────────────
  guide({
    thesis:
      'Hiểu biết về AI ở mức dùng được nghĩa là biết mô hình đang làm gì về bản chất: nó dự đoán phần tiếp theo hợp lý dựa trên mẫu học được từ dữ liệu, chứ không tra cứu một kho sự thật và cũng không có ý định. Từ nhận thức đó suy ra hai hệ quả thực dụng: nó có thể sai một cách rất trôi chảy và tự tin, và chất lượng đầu ra phụ thuộc mạnh vào việc bạn đưa vào những gì. Người hiểu điều này dùng AI như một cộng sự nhanh nhưng cần kiểm; người không hiểu thì dao động giữa sùng bái và tẩy chay.',
    why: {
      work:
        'Quyết định "có nên đưa AI vào khâu này không" đang được hỏi ở mọi phòng ban. Người trả lời được bằng đặc tính công việc — dữ liệu có sẵn không, sai thì hậu quả ra sao, ai chịu trách nhiệm cuối — sẽ định hình cách cả nhóm làm việc trong nhiều năm.',
      interview:
        'Câu hỏi "bạn dùng AI thế nào trong công việc" đang xuất hiện ở cả vị trí phi kỹ thuật. Câu trả lời hời hợt là kể tên công cụ; câu trả lời có trọng lượng là nêu việc nào bạn giao, việc nào bạn giữ, và vì sao ranh giới đó.',
      study:
        'Biết vì sao mô hình có thể bịa giúp bạn dùng nó đúng chỗ: gợi ý hướng tiếp cận, giải thích lại khái niệm khó, tạo bài luyện — và không dùng nó làm nguồn cuối cho dữ kiện phải chính xác.',
      life:
        'Tin tức, quảng cáo và cả nội dung mạng xã hội đang trộn lẫn phần do người viết và phần do máy tạo. Hiểu cơ chế sinh nội dung giúp bạn giữ được thái độ vừa phải: không hoảng vì mọi thứ đều giả, cũng không tin ngay vì nó nghe rất thuyết phục.',
    },
    framework: [
      { name: 'Phân loại bài toán', detail: 'Tách ba nhóm: hệ dự đoán từ dữ liệu số (chấm điểm tín dụng, dự báo tồn kho), hệ nhận dạng (ảnh, giọng nói, chữ viết), và hệ sinh nội dung (văn bản, hình, mã). Ba nhóm có cách sai và cách kiểm hoàn toàn khác nhau.' },
      { name: 'Truy nguồn dữ liệu', detail: 'Hỏi mô hình học từ đâu và dữ liệu đó đại diện cho ai. Một hệ được huấn luyện chủ yếu trên dữ liệu của một nhóm sẽ hoạt động kém trên nhóm khác, và điều này không hiện ra trong các con số tổng.' },
      { name: 'Đặt tên cho giới hạn', detail: 'Ba giới hạn ổn định qua các thế hệ công cụ: mô hình có thể bịa nội dung nghe hợp lý, kiến thức của nó dừng ở một mốc dữ liệu nào đó, và nó không tự biết mình đang sai. Coi đây là đặc tính cần thiết kế xung quanh, không phải lỗi sẽ được vá xong.' },
      { name: 'Cân hậu quả sai', detail: 'Xếp việc theo trục: sai thì tốn công sửa, hay sai thì gây thiệt hại không đảo ngược được cho người khác. Nhóm đầu giao cho AI thoải mái; nhóm sau luôn cần người quyết định cuối và một quy trình kiểm.' },
      { name: 'Thử trên việc đã biết đáp án', detail: 'Trước khi tin một công cụ cho việc mới, cho nó làm lại 5-10 việc bạn đã có kết quả đúng. Tỷ lệ trúng trên tập quen thuộc là ước lượng thực tế duy nhất bạn có.' },
    ],
    scenario:
      'Một trưởng nhóm chăm sóc khách hàng của chuỗi cửa hàng mỹ phẩm được đề nghị dùng trợ lý AI trả lời tin nhắn khách. Thay vì bật ngay cho toàn bộ, anh lấy 60 hội thoại đã đóng trong tháng trước, cho công cụ trả lời lại và so với câu trả lời thật của nhân viên. Kết quả tách rõ hai vùng: với câu hỏi giờ mở cửa, chính sách đổi trả, tra đơn hàng, tỷ lệ dùng được rất cao; với câu hỏi thành phần sản phẩm và da nhạy cảm, công cụ đưa ra khẳng định chắc chắn nhưng sai ở bốn trên mười trường hợp. Anh triển khai AI cho nhóm câu hỏi thứ nhất, chặn hẳn nhóm thứ hai và bắt buộc chuyển cho người. Điều làm quyết định này vững không phải niềm tin vào công nghệ, mà là 60 hội thoại có đáp án đúng để đối chiếu.',
    comparison: [
      { weak: 'Đánh giá một công cụ AI bằng vài câu thử ngẫu hứng, thấy trả lời trôi chảy là kết luận dùng được.', mature: 'Đánh giá bằng một bộ việc mẫu có đáp án đúng đã biết, ghi tỷ lệ trúng theo từng loại việc thay vì một nhận xét chung.' },
      { weak: 'Coi mọi câu trả lời là tra cứu từ một kho dữ liệu chính xác, nên tin cả những con số và tên riêng nó đưa ra.', mature: 'Coi đầu ra là bản nháp có xác suất sai, tách phần cần kiểm (số liệu, tên, trích dẫn, điều khoản) khỏi phần chỉ cần đọc là biết đúng sai.' },
      { weak: 'Hoặc cấm tiệt AI trong nhóm, hoặc mở tự do không giới hạn, vì chưa có cách phân loại việc.', mature: 'Có một danh sách phân loại: việc được giao hẳn, việc AI làm nháp và người duyệt, việc cấm dùng vì chạm dữ liệu nhạy cảm hoặc rủi ro không đảo ngược.' },
    ],
    mistakes: [
      'Nhầm sự trôi chảy với độ đúng: văn phong tự tin, cấu trúc mạch lạc và giọng chuyên gia là thứ mô hình học rất tốt, trong khi tính đúng của dữ kiện lại là chuyện khác hẳn.',
      'Hỏi chính mô hình "bạn có chắc không" rồi lấy câu khẳng định của nó làm bằng chứng, trong khi nó không có cơ chế tự kiểm tra sự thật mà chỉ đang sinh tiếp một câu trả lời nghe hợp lý.',
      'Kết luận về năng lực của cả lĩnh vực AI từ một lần thử một công cụ ở một thời điểm, rồi giữ kết luận đó làm chân lý trong khi cả công cụ lẫn cách dùng đều thay đổi liên tục.',
    ],
    worksheet: [
      'Kể ba việc trong tuần làm việc của bạn mà nếu AI làm sai thì chỉ tốn công sửa, và ba việc mà sai sẽ gây thiệt hại thật cho người khác.',
      'Với một công cụ AI bạn đang dùng, bạn có bộ việc mẫu nào có đáp án đúng để đối chiếu không? Nếu chưa, việc nào bạn có thể lấy làm bộ mẫu?',
      'Lần gần nhất bạn phát hiện AI đưa thông tin sai, bạn phát hiện nhờ đâu? Cơ chế phát hiện đó có lặp lại được không?',
      'Dữ liệu nào của công ty hoặc khách hàng bạn tuyệt đối không được dán vào công cụ bên ngoài? Viết danh sách đó ra thành quy tắc.',
      'Nếu phải giải thích cho một đồng nghiệp lớn tuổi vì sao AI có thể bịa, bạn dùng phép so sánh nào của riêng mình?',
    ],
    exercises: [
      { label: 'Ba nhóm bài toán', text: 'Liệt kê 6 ứng dụng AI bạn từng nghe hoặc dùng, xếp mỗi cái vào nhóm dự đoán, nhận dạng hay sinh nội dung, và viết một câu về kiểu sai đặc trưng của nhóm đó.', level: 'e' },
      { label: 'Bắt lỗi tự tin', text: 'Hỏi một trợ lý AI về một chủ đề bạn thực sự thành thạo, gồm ít nhất một câu hỏi chi tiết ít người biết. Ghi lại chỗ nó sai và mức độ chắc chắn trong giọng văn khi sai.', level: 'e' },
      { label: 'Ranh giới dữ liệu', text: 'Viết danh sách ba loại thông tin bạn sẽ không đưa vào công cụ bên ngoài, kèm lý do cụ thể cho từng loại, rồi kiểm lại lịch sử sử dụng của mình xem có vi phạm không.', level: 'e' },
      { label: 'Bộ việc mẫu có đáp án', text: 'Chọn một loại việc lặp lại trong công việc bạn, thu 10 trường hợp đã có kết quả đúng, cho công cụ làm lại và tính tỷ lệ trúng theo từng loại câu hỏi.', level: 'm' },
      { label: 'Thay đổi đầu vào', text: 'Lấy cùng một yêu cầu, chạy ba lần với ba mức thông tin nền khác nhau: không có bối cảnh, có bối cảnh, có bối cảnh kèm tài liệu thật. So ba kết quả và ghi phần chênh lệch.', level: 'm' },
      { label: 'Bảng phân loại việc', text: 'Lập bảng ba cột cho nhóm của bạn: giao hẳn cho AI, AI làm nháp và người duyệt, cấm dùng. Xếp ít nhất 12 đầu việc thật vào bảng và ghi lý do cho các trường hợp gây tranh cãi.', level: 'm' },
      { label: 'Báo cáo đánh giá công cụ', text: 'Viết một báo cáo hai trang đánh giá một công cụ AI cho một khâu cụ thể: bộ mẫu đã thử, tỷ lệ trúng theo loại việc, rủi ro, chi phí, đề xuất phạm vi triển khai và điều kiện dừng. Trình bày cho quản lý và ghi lại phản biện.', level: 'h' },
      { label: 'Bảy ngày đối chiếu', text: 'Thử thách 7 ngày: mỗi ngày ghi lại một lần bạn dùng AI, đánh dấu phần bạn đã kiểm và phần bạn tin không kiểm. Ngày 7, xem lại toàn bộ phần đã tin mà không kiểm và kiểm hết chúng một lượt để biết tỷ lệ sai thật của mình.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao một mô hình ngôn ngữ có thể tạo ra một tên tài liệu, một tác giả và một năm xuất bản hoàn toàn không tồn tại?',
        a: 'Vì nó sinh nội dung theo mẫu ngôn ngữ chứ không tra cứu một danh mục. Một trích dẫn học thuật có cấu trúc rất đều — tên người, tên tạp chí, năm, số trang — nên mô hình có thể ghép ra một chuỗi đúng dạng mà không có thật. Đúng dạng và có thật là hai chuyện khác nhau, và mô hình chỉ được tối ưu cho vế đầu.',
      },
      {
        q: 'Hai bộ phận cùng dùng một công cụ AI, một bên khen rất tốt, một bên chê vô dụng. Cách giải thích hợp lý nhất là gì?',
        a: 'Nhiều khả năng họ đang giao cho nó hai loại việc khác nhau, hoặc cung cấp lượng bối cảnh khác nhau. Việc có nhiều cách chấp nhận được và dễ kiểm — soạn nháp, tóm tắt, đổi giọng văn — thường cho kết quả tốt; việc đòi một đáp án đúng duy nhất dựa trên dữ liệu nội bộ mà không đưa dữ liệu đó vào thì gần như chắc chắn thất bại. Kết luận nên gắn với loại việc, không gắn với công cụ.',
      },
      {
        q: 'Vì sao "chờ thế hệ công cụ sau sẽ hết bịa" là một chiến lược làm việc rủi ro?',
        a: 'Vì nó biến quy trình của bạn thành thứ phụ thuộc vào một lời hứa bạn không kiểm soát. Kể cả khi tỷ lệ sai giảm, tỷ lệ ấy không về không, và sai càng hiếm thì con người càng mất cảnh giác nên hậu quả mỗi lần sai lại nặng hơn. Thiết kế đúng là dựng bước kiểm cho những khẳng định quan trọng, độc lập với việc công cụ hiện tại tốt tới đâu.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê các đầu việc trong tuần và xếp theo trục hậu quả nếu sai. Ngày 2: thu thập 10 trường hợp đã có đáp án đúng làm bộ mẫu. Ngày 3: chạy bộ mẫu qua công cụ và ghi tỷ lệ trúng theo loại. Ngày 4: thử cùng một yêu cầu với ba mức bối cảnh khác nhau. Ngày 5: viết danh sách dữ liệu cấm đưa ra ngoài. Ngày 6: lập bảng phân loại ba cột cho nhóm. Ngày 7: trình bày bảng đó cho một đồng nghiệp, ghi lại điểm họ phản đối và điều chỉnh.',
    evidence:
      'Hiện vật cụ thể là bộ việc mẫu có đáp án của riêng bạn kèm bảng tỷ lệ trúng theo từng loại việc, và bảng phân loại ba cột đã được nhóm áp dụng. Khi phỏng vấn hỏi bạn dùng AI ra sao, bạn không kể cảm nhận mà mở đúng bảng đó: đây là việc tôi giao, đây là việc tôi giữ, và đây là số liệu tôi dựa vào để chia như vậy. Cách trả lời này cho thấy bạn ra quyết định bằng phép đo chứ không bằng xu hướng.',
    references: [
      { label: 'Elements of AI — khoá học nhập môn AI miễn phí của Đại học Helsinki', url: 'https://www.elementsofai.com/', type: 'article' },
      { label: 'Stanford HAI — viện nghiên cứu AI lấy con người làm trung tâm, nơi công bố báo cáo AI Index thường niên', url: 'https://hai.stanford.edu/', type: 'article' },
    ],
  }),

  // ── Chương 4 — Viết yêu cầu cho AI (Prompting) ────────────────────────────
  guide({
    thesis:
      'Viết yêu cầu cho AI gần với việc giao việc cho một cộng tác viên rất nhanh, rất chịu khó, nhưng chưa từng làm ở công ty bạn và không được phép hỏi lại. Vì vậy chất lượng đầu ra phụ thuộc vào bốn thứ bạn cung cấp: bối cảnh, dữ liệu thật, mô tả đầu ra mong muốn, và ràng buộc. Kỹ năng ở đây không phải học thuộc các câu thần chú, mà là thói quen chuyển một yêu cầu mơ hồ trong đầu thành một bản giao việc đủ để người lạ làm đúng.',
    why: {
      work:
        'Cùng một công cụ, người viết yêu cầu tốt lấy ra bản nháp dùng được sau một lượt, người viết kém sửa qua sửa lại năm lượt rồi tự viết tay. Chênh lệch năng suất này lớn hơn nhiều so với chênh lệch giữa các công cụ.',
      interview:
        'Ngày càng nhiều bài kiểm tra thực hành cho phép dùng AI và chấm chính cách bạn giao việc, đọc kết quả và sửa. Nó bộc lộ tư duy phân rã vấn đề rõ hơn một câu hỏi lý thuyết.',
      study:
        'Khi học, yêu cầu viết đúng cách biến trợ lý thành người ra đề và người phản biện: yêu cầu nó hỏi ngược, tạo bài luyện có đáp án, hoặc chỉ ra chỗ lập luận của bạn hổng — hữu ích hơn nhiều so với xin nó tóm tắt.',
      life:
        'Từ soạn thư khiếu nại, lập kế hoạch chuyến đi tới đọc hiểu một hợp đồng dài, khả năng mô tả rõ mình muốn gì và ràng buộc nào phải giữ giúp bạn nhận được thứ dùng được ngay thay vì một bài viết chung chung.',
    },
    framework: [
      { name: 'Nêu bối cảnh và người đọc', detail: 'Nói rõ bạn là ai, đang làm gì, kết quả này ai sẽ đọc và họ đã biết những gì. Cùng một nội dung viết cho khách hàng lần đầu khác hẳn viết cho đồng nghiệp đã theo dự án sáu tháng.' },
      { name: 'Đưa dữ liệu thật vào', detail: 'Dán số liệu, đoạn trích, mẫu cũ, ràng buộc thật thay vì mô tả chúng. Mô hình không biết gì về nội bộ của bạn, nên thiếu dữ liệu thì nó buộc phải điền bằng thứ chung chung hoặc bịa.' },
      { name: 'Mô tả đầu ra như một đơn hàng', detail: 'Nêu dạng (bảng, thư, danh sách kiểm), độ dài, giọng văn, và cả những thứ không được có. Nếu bạn có một bản mẫu đạt chuẩn, đưa nó vào làm ví dụ còn hiệu quả hơn mọi tính từ mô tả.' },
      { name: 'Bắt nó hỏi lại trước khi làm', detail: 'Yêu cầu liệt kê những thông tin còn thiếu trước khi viết. Câu hỏi nó đặt ra thường phơi bày chính chỗ bạn chưa nghĩ rõ, và điều đó có giá trị kể cả khi bạn tự viết lấy.' },
      { name: 'Sửa theo vòng có tiêu chí', detail: 'Đừng nói "chưa hay, viết lại". Chỉ ra đúng chỗ chưa đạt và tiêu chí đạt: đoạn hai quá chung, cần một ví dụ có số; câu mở đầu quá dài, tối đa hai mươi chữ. Vòng sửa có tiêu chí hội tụ sau hai lượt.' },
    ],
    scenario:
      'Một chuyên viên tuyển dụng cần đăng tin cho vị trí nhân viên kho biết dùng phần mềm quản lý tồn. Lượt đầu chị gõ một câu: "viết tin tuyển nhân viên kho". Kết quả là một bản mẫu chung chung, đủ dùng cho mọi công ty và vì thế không thu hút ai. Lượt sau chị dán vào: mô tả ca làm thật, mức lương dải thật, ba việc chiếm nhiều thời gian nhất trong ngày của vị trí này theo lời người đang làm, hai lý do người cũ nghỉ, và một tin tuyển dụng cũ mà công ty từng tuyển được người tốt. Chị yêu cầu ba phiên bản với ba giọng khác nhau, mỗi bản dưới 250 chữ, không dùng các cụm sáo rỗng như "môi trường năng động". Bản chị chọn chỉ phải sửa hai câu. Điểm quyết định không phải cách đặt câu lệnh, mà là lượng thông tin thật chị chịu bỏ ra mười phút để gom.',
    comparison: [
      { weak: 'Gõ một câu ngắn rồi đánh giá công cụ dựa trên kết quả của câu ngắn đó.', mature: 'Coi lượt đầu là bản giao việc: bối cảnh, dữ liệu thật, dạng đầu ra, ràng buộc — rồi mới đánh giá.' },
      { weak: 'Yêu cầu sửa bằng cảm nhận: "chưa ổn", "làm hay hơn đi", "thiếu chiều sâu".', mature: 'Yêu cầu sửa bằng địa chỉ và tiêu chí: đoạn nào, thiếu gì, thay bằng gì, giới hạn bao nhiêu chữ.' },
      { weak: 'Nhét năm việc khác nhau vào một yêu cầu dài và nhận về một kết quả trung bình cho cả năm.', mature: 'Tách thành các lượt nối tiếp, mỗi lượt một mục tiêu, dùng đầu ra đã duyệt của lượt trước làm đầu vào cho lượt sau.' },
    ],
    mistakes: [
      'Sưu tầm các mẫu câu lệnh được cho là hiệu nghiệm rồi dùng lại nguyên văn cho mọi việc, trong khi thứ quyết định kết quả là dữ liệu và ràng buộc riêng của việc đó.',
      'Mô tả đầu ra bằng tính từ — chuyên nghiệp, thuyết phục, tự nhiên — mà không đưa một mẫu đạt chuẩn nào, nên mỗi lượt lại nhận về một cách hiểu khác nhau về các tính từ ấy.',
      'Giao việc mà quên nói những gì không được xuất hiện: thông tin bịa, cam kết về pháp lý, con số không có trong dữ liệu đưa vào — rồi phải mất công dò và cắt ở khâu duyệt.',
    ],
    worksheet: [
      'Lấy yêu cầu gần nhất bạn gõ cho một trợ lý AI và đếm: bạn đã cung cấp bao nhiêu câu bối cảnh và bao nhiêu dòng dữ liệu thật?',
      'Với công việc bạn định giao, ai là người đọc kết quả cuối và họ đã biết trước những gì?',
      'Bạn có một bản mẫu đạt chuẩn của loại kết quả này không? Nếu có, tại sao nó chưa được đưa vào yêu cầu?',
      'Ba thứ tuyệt đối không được xuất hiện trong đầu ra lần này là gì?',
      'Nếu chỉ được sửa đúng một vòng nữa, tiêu chí đạt mà bạn sẽ viết ra là gì — viết nó thành câu có thể chấm đúng sai.',
    ],
    exercises: [
      { label: 'Một câu thành một bản giao việc', text: 'Lấy một yêu cầu ngắn bạn từng dùng và viết lại thành bản giao việc đủ bốn phần: bối cảnh, dữ liệu, đầu ra mong muốn, ràng buộc. Chạy cả hai và so kết quả.', level: 'e' },
      { label: 'Bắt hỏi ngược', text: 'Trước khi cho làm, yêu cầu công cụ liệt kê 5 thông tin còn thiếu để làm tốt việc này. Trả lời từng câu rồi mới cho chạy, và ghi lại câu hỏi nào bạn thấy đúng chỗ mình chưa nghĩ tới.', level: 'e' },
      { label: 'Ràng buộc phủ định', text: 'Viết một yêu cầu có phần "không được có" gồm ít nhất bốn mục cụ thể. Chạy và đếm số lần vi phạm, rồi siết lại cách diễn đạt cho các mục bị vi phạm.', level: 'e' },
      { label: 'Ví dụ mẫu thay tính từ', text: 'Chọn một loại văn bản bạn viết thường xuyên, đưa vào một bản cũ đạt chuẩn làm ví dụ và yêu cầu bám theo giọng đó. So sánh với lượt chỉ mô tả bằng tính từ.', level: 'm' },
      { label: 'Chuỗi ba lượt', text: 'Chia một việc lớn thành ba lượt nối tiếp: lượt một lập dàn ý, bạn duyệt và sửa; lượt hai viết theo dàn ý đã duyệt; lượt ba rà lỗi theo danh sách kiểm bạn đưa. Ghi lại tổng thời gian so với cách làm một lượt.', level: 'm' },
      { label: 'Hai vai phản biện', text: 'Yêu cầu công cụ đóng vai người khó tính nhất sẽ đọc tài liệu của bạn và nêu năm điểm sẽ bị chất vấn, kèm dữ liệu cần chuẩn bị cho từng điểm. Dùng danh sách đó để bổ sung bản thật.', level: 'm' },
      { label: 'Bộ mẫu giao việc cho phòng ban', text: 'Soạn 5 bản giao việc chuẩn cho 5 loại công việc lặp lại của phòng bạn, mỗi bản có chỗ trống để điền dữ liệu thật. Cho hai đồng nghiệp dùng thử và sửa theo phản hồi của họ.', level: 'h' },
      { label: 'Bảy ngày một vòng sửa', text: 'Thử thách 7 ngày: mỗi ngày làm một việc thật với AI theo quy tắc chỉ được sửa tối đa hai vòng, và mỗi vòng sửa phải viết tiêu chí đạt trước khi gửi. Ngày 7 đọc lại các tiêu chí đã viết để tìm mẫu chung trong thứ bạn hay bỏ sót ở lượt đầu.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao đưa một bản mẫu đạt chuẩn thường hiệu quả hơn mô tả "viết cho chuyên nghiệp"?',
        a: 'Vì tính từ là thứ mỗi người hiểu một kiểu, còn bản mẫu chứa đồng thời rất nhiều tín hiệu cụ thể: độ dài câu, cách xưng hô, mức chi tiết, trật tự thông tin, những thứ được nói và những thứ được bỏ qua. Một ví dụ tốt truyền tải nhiều ràng buộc hơn cả một đoạn mô tả dài, và không gây tranh cãi về cách hiểu.',
      },
      {
        q: 'Yêu cầu của bạn đã đủ bối cảnh nhưng kết quả vẫn chung chung và không dùng được. Nên kiểm tra điều gì trước tiên?',
        a: 'Kiểm xem bạn đã đưa dữ liệu thật hay mới chỉ mô tả về dữ liệu. Nói "dựa trên số liệu bán hàng quý vừa rồi" không đưa được số nào vào; mô hình chỉ có thể viết những câu đúng với mọi bộ số liệu, và đó chính là định nghĩa của chung chung. Dán bảng số thật vào là thay đổi đơn lẻ có tác dụng lớn nhất.',
      },
      {
        q: 'Khi nào nên tách một yêu cầu lớn thành nhiều lượt thay vì viết một yêu cầu thật đầy đủ?',
        a: 'Khi công việc có điểm cần bạn ra quyết định ở giữa. Nếu dàn ý sai thì mọi câu chữ phía sau đều lãng phí, nên hãy duyệt dàn ý trước rồi mới cho viết. Ngược lại, với việc một chiều và tiêu chí rõ — chuẩn hoá định dạng, dịch, rà chính tả — thì một lượt đầy đủ lại nhanh hơn và ít lệch hơn.',
      },
    ],
    plan7:
      'Ngày 1: viết lại một yêu cầu cũ thành bản giao việc bốn phần và so hai kết quả. Ngày 2: luyện bắt công cụ hỏi ngược trước khi làm. Ngày 3: thêm phần ràng buộc phủ định và đếm vi phạm. Ngày 4: đưa bản mẫu đạt chuẩn vào thay cho tính từ. Ngày 5: chia một việc lớn thành chuỗi ba lượt có điểm duyệt ở giữa. Ngày 6: dùng vai phản biện để tìm lỗ hổng trong tài liệu thật. Ngày 7: gói những gì hiệu quả thành hai bản giao việc chuẩn cho việc bạn làm nhiều nhất.',
    evidence:
      'Bằng chứng thuyết phục là bộ bản giao việc chuẩn của phòng ban bạn: mỗi bản gồm phần cố định và chỗ điền dữ liệu thật, kèm ghi chú về những gì đã thử và bị loại. Đi kèm là một bảng đối chiếu trước và sau cho một loại việc cụ thể — số vòng sửa trung bình, thời gian tới bản duyệt được. Đây là loại hiện vật hiếm gặp trong hồ sơ ứng viên, vì nó cho thấy bạn không chỉ dùng công cụ mà còn chuẩn hoá cách dùng cho người khác.',
    references: [
      { label: 'Learn Prompting — tài liệu mở về cách viết yêu cầu cho mô hình ngôn ngữ', url: 'https://learnprompting.org/', type: 'article' },
      { label: 'Prompt Engineering Guide (DAIR.AI) — tổng hợp kỹ thuật và ví dụ theo từng loại tác vụ', url: 'https://www.promptingguide.ai/', type: 'article' },
    ],
  }),

  // ── Chương 5 — Xác minh nội dung do AI tạo ────────────────────────────────
  guide({
    thesis:
      'Xác minh không phải là thái độ hoài nghi chung chung, mà là một quy trình có địa chỉ: tách các khẳng định trong bản nháp thành từng mệnh đề, xếp chúng theo mức thiệt hại nếu sai, rồi kiểm đúng những mệnh đề nằm trên ngưỡng bằng nguồn độc lập với công cụ đã tạo ra chúng. Điểm mấu chốt là nội dung sai của AI thường không trông như sai — nó trôi chảy, đúng ngữ pháp, đúng định dạng — nên chỉ có kiểm theo quy trình mới bắt được, chứ đọc lại kỹ hơn thì không.',
    why: {
      work:
        'Một con số bịa lọt vào báo cáo gửi khách hàng hoặc một điều khoản không tồn tại lọt vào thư trả lời làm hỏng uy tín của cả nhóm, và người ký tên chịu trách nhiệm chứ không phải công cụ.',
      interview:
        'Nhà tuyển dụng ngày càng hỏi bạn kiểm chứng đầu ra của AI thế nào, vì đó là ranh giới phân biệt người dùng công cụ có trách nhiệm với người chuyển tiếp nội dung máy sinh ra mà không đọc.',
      study:
        'Trích dẫn không tồn tại là lỗi nặng trong môi trường học thuật và cũng là kiểu lỗi mô hình sinh ra dễ nhất, vì trích dẫn có cấu trúc rất đều nên rất dễ được ghép ra đúng dạng mà không có thật.',
      life:
        'Nội dung do máy tạo đã tràn vào tin tức, đánh giá sản phẩm, tư vấn sức khoẻ và tài chính. Có thói quen truy về nguồn sơ cấp bảo vệ bạn khỏi những quyết định tốn kém dựa trên thông tin nghe rất thuyết phục.',
    },
    framework: [
      { name: 'Tách thành mệnh đề', detail: 'Đọc bản nháp và gạch chân từng khẳng định có thể đúng hoặc sai: con số, tên riêng, ngày tháng, quy định, quan hệ nhân quả. Phần ý kiến và phần văn phong không cần kiểm; trộn chúng lại là lý do người ta thấy việc kiểm quá nặng.' },
      { name: 'Xếp theo thiệt hại', detail: 'Với mỗi mệnh đề, hỏi: nếu sai thì ai chịu và sửa được không. Mệnh đề đi vào hợp đồng, báo cáo tài chính, hướng dẫn an toàn hay tư vấn cho khách luôn nằm trên ngưỡng phải kiểm, bất kể nó nghe hiển nhiên tới đâu.' },
      { name: 'Truy về nguồn sơ cấp', detail: 'Kiểm bằng nơi phát ra thông tin gốc: văn bản của cơ quan ban hành, tài liệu chính chủ của nhà cung cấp, số liệu trên hệ thống nội bộ. Một bài viết khác nhắc lại cùng con số không phải là xác nhận độc lập.' },
      { name: 'Kiểm trích dẫn có tồn tại', detail: 'Với mọi tài liệu được viện dẫn, tìm chính tài liệu đó qua danh mục hoặc mã định danh, mở ra và xem nó có thực sự nói điều được gán cho nó không. Tồn tại và nói đúng điều đó là hai lần kiểm khác nhau.' },
      { name: 'Chạy thử thứ chạy được', detail: 'Với mã, công thức bảng tính, truy vấn, cấu hình hay quy trình thao tác, đừng đọc để đánh giá — hãy chạy trên dữ liệu mẫu có kết quả đã biết. Thứ chạy được là loại nội dung duy nhất tự tố cáo cái sai của nó.' },
      { name: 'Ghi lại dấu vết kiểm', detail: 'Lưu ngay cạnh bản cuối: mệnh đề nào đã kiểm, kiểm bằng nguồn nào, ngày kiểm. Dấu vết này là thứ bảo vệ bạn khi có tranh cãi và là thứ giúp người sau không kiểm lại từ đầu.' },
    ],
    scenario:
      'Một biên tập viên nội dung của công ty phần mềm giáo dục nhận bản nháp bài viết về phương pháp học, trong đó có ba trích dẫn nghiên cứu kèm tên tác giả và năm rất cụ thể. Anh làm ba bước: tra từng tên bài trên một danh mục nghiên cứu công khai, mở bản tóm tắt, và đối chiếu kết luận thật với câu được gán trong bài. Kết quả: một bài có thật nhưng kết luận bị diễn giải ngược chiều, một bài có tác giả thật nhưng tên bài không tồn tại, một bài đúng hoàn toàn. Anh giữ trích dẫn đúng, sửa phần diễn giải sai, bỏ hẳn trích dẫn không tồn tại và thay bằng một nguồn anh tự tìm. Sau đó anh biến ba bước này thành một mục bắt buộc trong danh sách kiểm trước khi xuất bản, mất thêm khoảng mười lăm phút mỗi bài.',
    comparison: [
      { weak: 'Đọc lại bản nháp thật kỹ và tin vào cảm giác trôi chảy, không có chỗ nào gợn.', mature: 'Gạch chân từng khẳng định kiểm được rồi kiểm từng cái, vì nội dung sai của máy vốn không tạo ra cảm giác gợn.' },
      { weak: 'Hỏi lại chính công cụ đó xem nội dung có chính xác không và lấy lời khẳng định của nó làm bằng chứng.', mature: 'Kiểm bằng nguồn nằm ngoài công cụ: văn bản gốc, hệ thống nội bộ, thực nghiệm, hoặc một người thực sự có chuyên môn.' },
      { weak: 'Kiểm mọi thứ ngang nhau nên thấy quá tốn thời gian rồi bỏ kiểm hoàn toàn.', mature: 'Phân tầng theo thiệt hại: kiểm kỹ nhóm rủi ro cao, kiểm nhanh nhóm trung bình, bỏ qua phần văn phong và ý kiến.' },
    ],
    mistakes: [
      'Coi việc nội dung có định dạng chuẩn — có mã số, có năm, có đơn vị đo — là dấu hiệu của độ chính xác, trong khi đúng định dạng chính là thứ mô hình tái tạo tốt nhất.',
      'Kiểm một trích dẫn bằng cách tìm thấy tên bài xuất hiện đâu đó trên mạng, mà không mở tài liệu gốc để xem nó có nói đúng điều đang được gán cho nó không.',
      'Đánh giá một đoạn mã hoặc một công thức bằng cách đọc thấy hợp lý, trong khi loại nội dung này có thể chạy sai âm thầm và chỉ lộ ra khi gặp trường hợp biên mà mắt thường không hình dung ra.',
    ],
    worksheet: [
      'Lấy một bản nháp do AI tạo gần đây và đếm số khẳng định kiểm được trong đó. Bạn đã kiểm bao nhiêu phần trăm?',
      'Trong công việc của bạn, loại khẳng định nào mà sai một lần là không sửa lại được với người nhận?',
      'Nguồn sơ cấp cho lĩnh vực của bạn là những nơi nào? Liệt kê ba địa chỉ cụ thể bạn sẽ mở khi cần kiểm.',
      'Lần gần nhất bạn phát hiện một nội dung máy tạo bị sai, bạn phát hiện nhờ quy trình hay nhờ may mắn?',
      'Danh sách kiểm trước khi gửi của bạn hiện có bao nhiêu mục? Nếu chưa có, viết ba mục đầu tiên ngay bây giờ.',
    ],
    exercises: [
      { label: 'Gạch chân mệnh đề', text: 'Lấy một trang nội dung do AI viết, gạch chân mọi con số, tên riêng, ngày tháng và quy định. Đếm tổng số và xếp chúng thành hai nhóm cần kiểm và không cần kiểm.', level: 'e' },
      { label: 'Săn trích dẫn ma', text: 'Yêu cầu một trợ lý AI viết một đoạn có ba trích dẫn nghiên cứu về chủ đề bạn quan tâm, rồi tự tra từng trích dẫn xem có tồn tại không. Ghi lại tỷ lệ.', level: 'e' },
      { label: 'Ba địa chỉ nguồn gốc', text: 'Viết ra ba nguồn sơ cấp của lĩnh vực bạn làm, kèm đường dẫn và loại thông tin mỗi nguồn có thẩm quyền. Đặt chúng vào thanh dấu trang để không phải tìm lại.', level: 'e' },
      { label: 'Kiểm hai lớp', text: 'Chọn một trích dẫn có thật và kiểm hai lớp: tài liệu có tồn tại không, và nó có nói đúng điều được gán cho nó không. Ghi lại trường hợp lớp một đạt nhưng lớp hai trượt.', level: 'm' },
      { label: 'Chạy trước khi tin', text: 'Lấy một công thức bảng tính hoặc một đoạn mã do AI viết, chuẩn bị ba bộ dữ liệu mẫu đã biết kết quả gồm một trường hợp biên, rồi chạy và đối chiếu.', level: 'm' },
      { label: 'Bẫy nhân quả', text: 'Tìm trong một bản nháp những câu khẳng định A gây ra B. Với mỗi câu, tra xem nguồn gốc chỉ nói hai thứ đi cùng nhau hay thực sự nói về nguyên nhân, và sửa lại cách diễn đạt cho đúng mức.', level: 'm' },
      { label: 'Danh sách kiểm cho nhóm', text: 'Soạn danh sách kiểm trước khi xuất bản cho loại tài liệu nhóm bạn hay gửi ra ngoài, gồm mục kiểm số liệu, kiểm trích dẫn, kiểm cam kết pháp lý và ghi dấu vết. Áp dụng cho ba tài liệu thật và đo thời gian tăng thêm.', level: 'h' },
      { label: 'Bảy ngày ghi dấu vết', text: 'Thử thách 7 ngày: mọi tài liệu bạn gửi đi trong tuần đều kèm một ghi chú nội bộ liệt kê mệnh đề đã kiểm, nguồn và ngày kiểm. Ngày 7, xem lại và tìm loại khẳng định nào bạn hay bỏ sót nhất.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao "hỏi lại AI xem thông tin đó có đúng không" không phải là một bước xác minh?',
        a: 'Vì câu trả lời thứ hai được sinh ra bằng chính cơ chế đã sinh ra câu trả lời thứ nhất, dựa trên cùng mẫu ngôn ngữ và không có kênh nào nối tới sự thật bên ngoài. Nó có thể đổi ý theo cách bạn đặt câu hỏi, nên vừa xác nhận vừa phủ nhận đều không mang thông tin. Xác minh đòi hỏi một nguồn độc lập: văn bản gốc, hệ thống thật, thực nghiệm, hoặc người có chuyên môn.',
      },
      {
        q: 'Một bản nháp trích dẫn tài liệu có thật và tài liệu đó đúng là tồn tại. Vì sao vẫn cần thêm một bước nữa?',
        a: 'Vì tồn tại không đồng nghĩa với nói đúng điều đang được gán cho nó. Kiểu lỗi phổ biến là gán cho một tài liệu có thật một kết luận mạnh hơn, hẹp hơn hoặc ngược chiều với điều nó thực sự nói. Bước còn thiếu là mở tài liệu và đọc đúng phần được viện dẫn, ít nhất là phần tóm tắt và phần kết luận.',
      },
      {
        q: 'Sếp phàn nàn rằng kiểm chứng làm chậm tiến độ. Bạn trả lời và điều chỉnh quy trình thế nào?',
        a: 'Không tranh luận về việc có kiểm hay không, mà đưa ra phân tầng: chỉ những khẳng định gây thiệt hại không đảo ngược mới kiểm kỹ, phần còn lại kiểm nhanh hoặc bỏ. Kèm theo là số đo: thời gian tăng thêm trên mỗi tài liệu, và số lỗi đã chặn được trong tháng. Cuộc thảo luận khi đó chuyển từ cảm tính sang một quyết định về ngưỡng rủi ro mà cấp trên có thể tự chọn.',
      },
    ],
    plan7:
      'Ngày 1: gạch chân mệnh đề trên một bản nháp thật và đếm tỷ lệ đã kiểm. Ngày 2: lập danh sách ba nguồn sơ cấp của lĩnh vực và lưu dấu trang. Ngày 3: thực hành săn trích dẫn ma và ghi tỷ lệ bịa. Ngày 4: kiểm hai lớp cho ba trích dẫn trong tài liệu đang làm. Ngày 5: chạy thử mọi công thức hoặc đoạn mã bạn đã nhận từ AI tuần này. Ngày 6: soạn danh sách kiểm trước khi gửi cho loại tài liệu bạn làm nhiều nhất. Ngày 7: áp dụng danh sách đó cho một tài liệu thật, đo thời gian tăng thêm và số lỗi bắt được.',
    evidence:
      'Hiện vật là danh sách kiểm trước khi xuất bản do bạn soạn, cộng với nhật ký các lỗi đã chặn: mỗi dòng ghi loại lỗi, tài liệu, cách phát hiện. Sau vài tháng bạn có một bảng cho thấy loại sai nào hay xảy ra nhất và bước kiểm nào bắt được chúng. Trong phỏng vấn, đưa ra được một quy trình kiểm mình tự dựng, kèm ví dụ một lỗi cụ thể nó đã chặn trước khi tới tay khách hàng, là cách chứng minh tính cẩn trọng mà không cần tự khen.',
    references: [
      { label: 'Crossref — tra cứu DOI để kiểm một tài liệu khoa học có thật sự tồn tại', url: 'https://www.crossref.org/', type: 'article' },
      { label: 'International Fact-Checking Network (Poynter) — chuẩn nghề của giới kiểm chứng thông tin', url: 'https://www.poynter.org/ifcn/', type: 'article' },
    ],
  }),

  // ── Chương 6 — Tự động hóa công việc ──────────────────────────────────────
  guide({
    thesis:
      'Tự động hoá là chuyển một công việc lặp lại từ trí nhớ và tay người sang một quy tắc chạy được. Giá trị thật không nằm ở số phút tiết kiệm mỗi lần, mà ở việc kết quả trở nên nhất quán và không còn phụ thuộc vào việc hôm nay ai trực. Nhưng tự động hoá cũng nhân bản sai sót với cùng tốc độ nó nhân bản kết quả đúng, nên một luồng tự động chưa có chốt kiểm và chưa có người nhận cảnh báo thì nguy hiểm hơn việc làm tay.',
    why: {
      work:
        'Những việc như tổng hợp báo cáo hằng tuần, gửi nhắc hạn, đồng bộ dữ liệu giữa hai công cụ chiếm một phần lớn thời gian nhưng không tạo ra khác biệt nào khi làm bằng tay. Chuyển được chúng đi là giải phóng đúng phần thời gian dành cho việc cần suy nghĩ.',
      interview:
        'Kể được một luồng tự động bạn tự dựng, kèm số lần chạy và số lỗi nó đã chặn, là bằng chứng về tư duy quy trình. Nó cho thấy bạn nhìn công việc như hệ thống chứ không chỉ như danh sách việc phải làm.',
      study:
        'Tự động hoá phần cơ học của việc học — thu bài đọc về một chỗ, tạo thẻ ôn từ ghi chú, nhắc lịch ôn tập — giữ cho hệ thống học không sụp khi bạn bận, vì phần duy trì không còn cần ý chí.',
      life:
        'Nhắc đóng tiền định kỳ, sao lưu ảnh, lọc thư quảng cáo, theo dõi chi tiêu: đây là những việc nhỏ mà quên một lần thì trả giá lớn, và đúng là loại việc máy làm tốt hơn người.',
    },
    framework: [
      { name: 'Chọn đúng ứng viên', detail: 'Một việc đáng tự động hoá phải hội đủ ba điều kiện: lặp lại đủ thường xuyên, có quy tắc phát biểu được thành nếu-thì, và đầu vào ở dạng máy đọc được. Thiếu điều kiện thứ hai thì bạn sẽ dành nhiều thời gian sửa luồng hơn là làm tay.' },
      { name: 'Viết quy trình thủ công trước', detail: 'Ghi lại chính xác từng bước bạn đang làm tay, gồm cả các ngoại lệ mà bạn xử lý theo phản xạ. Chính danh sách ngoại lệ này quyết định luồng tự động có sống nổi tháng thứ hai hay không.' },
      { name: 'Dựng bản nhỏ nhất', detail: 'Tự động hoá đúng một mắt xích tốn công nhất trước, chạy song song với cách làm tay trong vài chu kỳ và đối chiếu kết quả. Đừng thay cả quy trình trong một lần.' },
      { name: 'Đặt chốt kiểm và cảnh báo', detail: 'Mỗi luồng cần trả lời được ba câu: nó có chạy không, nó có chạy đúng không, ai được báo khi hỏng. Một luồng im lặng khi hỏng còn tệ hơn không có luồng, vì mọi người vẫn tin dữ liệu vẫn đang được cập nhật.' },
      { name: 'Bàn giao và ghi tài liệu', detail: 'Viết một trang: luồng làm gì, chạy lúc nào, chạm vào dữ liệu nào, cách tắt khẩn cấp, và ai hiểu nó. Luồng không có tài liệu là nợ kỹ thuật gắn với một cá nhân, và nó phát nổ đúng lúc người đó nghỉ.' },
    ],
    scenario:
      'Một nhân viên vận hành đơn hàng của cửa hàng bán đồ gia dụng trực tuyến mỗi sáng mất chín mươi phút để gộp đơn từ ba sàn về một bảng, chuẩn hoá địa chỉ và gửi danh sách cho bộ phận đóng gói. Chị viết ra toàn bộ các bước, kể cả bốn ngoại lệ thường gặp như đơn thiếu số nhà hay đơn khách nhắn đổi mẫu. Chị tự động hoá đúng phần gộp và chuẩn hoá, giữ nguyên phần xử lý ngoại lệ cho người, và thêm một quy tắc: mọi đơn không khớp mẫu địa chỉ sẽ rơi vào một bảng riêng chờ người xem, thay vì bị bỏ qua âm thầm. Chị chạy song song hai tuần, đối chiếu từng ngày, phát hiện luồng bỏ sót đơn có ký tự đặc biệt trong tên và vá lại. Sau đó thời gian buổi sáng còn khoảng hai mươi phút, và quan trọng hơn là bảng chờ xử lý cho thấy rõ mỗi ngày có bao nhiêu đơn cần người can thiệp — một con số trước đây không ai biết.',
    comparison: [
      { weak: 'Tự động hoá cả quy trình ngay từ đầu vì thấy bước nào cũng lặp lại.', mature: 'Tự động hoá một mắt xích, chạy song song với cách cũ vài chu kỳ để đối chiếu, rồi mới mở rộng sang mắt xích tiếp theo.' },
      { weak: 'Coi luồng chạy được là xong việc, không ai theo dõi nữa cho tới lúc có người phàn nàn.', mature: 'Gắn cảnh báo khi luồng không chạy hoặc chạy ra kết quả bất thường, và có người cụ thể nhận cảnh báo đó.' },
      { weak: 'Ngoại lệ được xử lý bằng cách bỏ qua bản ghi không khớp để luồng không bị dừng.', mature: 'Ngoại lệ được đẩy vào một hàng chờ có người xem, để cái bất thường trở nên nhìn thấy được thay vì biến mất.' },
    ],
    mistakes: [
      'Tính hiệu quả chỉ bằng số phút tiết kiệm mỗi lần chạy, quên trừ đi thời gian dựng, thời gian sửa khi công cụ đầu nguồn đổi giao diện, và thời gian người khác học cách dùng.',
      'Tự động hoá một quy trình vốn đã sai hoặc đã thừa, khiến cái sai được lặp lại nhanh hơn và đều hơn — sắp xếp lại quy trình phải đến trước, tự động hoá đến sau.',
      'Để toàn bộ luồng chạy dưới tài khoản cá nhân của người dựng, nên khi người đó đổi mật khẩu, đổi vai trò hoặc nghỉ việc thì cả dây chuyền dừng mà không ai biết vì sao.',
    ],
    worksheet: [
      'Liệt kê ba việc bạn làm lặp lại ít nhất mỗi tuần và ước lượng thời gian thật cho mỗi lần, đo bằng đồng hồ chứ không ước chừng.',
      'Với việc tốn thời gian nhất trong ba việc đó, quy tắc của nó có phát biểu được thành các câu nếu-thì không? Viết thử ba câu.',
      'Những ngoại lệ nào bạn đang xử lý theo phản xạ mà chưa từng viết ra? Kể ít nhất bốn.',
      'Nếu luồng tự động hỏng vào một sáng thứ Hai, ai là người phát hiện đầu tiên và sau bao lâu?',
      'Việc này đang chạy dưới tài khoản nào, và ngoài bạn thì ai có thể tắt hoặc sửa nó?',
    ],
    exercises: [
      { label: 'Bấm giờ việc lặp', text: 'Trong một tuần, bấm giờ thật cho ba công việc lặp lại và ghi số lần chạy. Xếp hạng theo tổng thời gian tháng thay vì theo cảm giác phiền toái.', level: 'e' },
      { label: 'Viết quy tắc nếu-thì', text: 'Chọn việc đứng đầu bảng xếp hạng và viết toàn bộ quy tắc thành các câu nếu-thì. Đánh dấu những chỗ bạn phải viết "tuỳ trường hợp" — đó là phần chưa tự động hoá được.', level: 'e' },
      { label: 'Danh sách ngoại lệ', text: 'Ghi lại mọi ngoại lệ bạn gặp trong hai tuần cho việc đó, kèm tần suất. Quyết định ngoại lệ nào sẽ được xử lý tự động và ngoại lệ nào đẩy sang người.', level: 'e' },
      { label: 'Một mắt xích', text: 'Dựng luồng tự động cho đúng một bước tốn công nhất, để nguyên các bước còn lại. Chạy song song với cách làm tay trong năm lần và đối chiếu kết quả từng lần.', level: 'm' },
      { label: 'Hàng chờ ngoại lệ', text: 'Thêm vào luồng một nhánh đưa mọi bản ghi không khớp quy tắc vào một bảng chờ riêng, rồi theo dõi bảng đó trong một tuần để biết tỷ lệ cần người can thiệp.', level: 'm' },
      { label: 'Cảnh báo khi im lặng', text: 'Thiết lập một cơ chế báo cho bạn khi luồng không chạy đúng lịch, rồi cố tình làm nó hỏng để kiểm tra cảnh báo có thật sự tới nơi không.', level: 'm' },
      { label: 'Bàn giao thật', text: 'Viết tài liệu một trang cho luồng của bạn và nhờ một đồng nghiệp vận hành nó trong ba ngày mà không hỏi bạn. Ghi lại mọi câu hỏi họ phải hỏi và bổ sung vào tài liệu.', level: 'h' },
      { label: 'Bảy ngày dựng một luồng', text: 'Thử thách 7 ngày: ngày 1-2 đo và viết quy trình thủ công, ngày 3 liệt kê ngoại lệ, ngày 4 dựng bản nhỏ nhất, ngày 5 chạy song song và đối chiếu, ngày 6 thêm chốt kiểm và cảnh báo, ngày 7 viết tài liệu bàn giao và tính lại thời gian tiết kiệm thật sau khi trừ chi phí dựng.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao phải chạy song song luồng tự động với cách làm tay trong vài chu kỳ trước khi bỏ hẳn cách cũ?',
        a: 'Vì đó là cách duy nhất có sẵn đáp án đúng để đối chiếu. Luồng mới thường đúng ở các trường hợp phổ biến và sai ở trường hợp biên, mà trường hợp biên chỉ xuất hiện sau vài chu kỳ dữ liệu thật. Chạy song song tốn thêm công trong ngắn hạn nhưng biến việc phát hiện lỗi thành có kế hoạch, thay vì phát hiện khi khách hàng phàn nàn.',
      },
      {
        q: 'Một luồng bỏ qua các bản ghi lỗi để không bị dừng giữa chừng. Vấn đề nằm ở đâu?',
        a: 'Ở chỗ nó biến cái bất thường thành vô hình. Người dùng thấy luồng chạy trơn tru nên tin dữ liệu đã đầy đủ, trong khi một phần đang rơi ra ngoài mà không ai đếm. Cách sửa là chuyển từ bỏ qua sang đẩy vào hàng chờ có người xem, kèm một con số hiển thị mỗi ngày có bao nhiêu bản ghi rơi vào đó.',
      },
      {
        q: 'Khi nào nên quyết định không tự động hoá một việc dù nó rất lặp lại?',
        a: 'Khi quy tắc của nó chưa ổn định, khi mỗi lần làm đều cần một phán đoán không phát biểu được, hoặc khi hệ thống đầu nguồn thay đổi thường xuyên tới mức bạn sẽ sửa luồng nhiều hơn là dùng nó. Trường hợp này việc nên làm trước là chuẩn hoá quy trình và định dạng dữ liệu đầu vào; tự động hoá chỉ có nghĩa sau khi đã có một quy tắc đứng yên đủ lâu.',
      },
    ],
    plan7:
      'Ngày 1: bấm giờ và xếp hạng ba việc lặp lại theo tổng thời gian mỗi tháng. Ngày 2: viết toàn bộ quy trình thủ công của việc đứng đầu thành các câu nếu-thì. Ngày 3: ghi danh sách ngoại lệ và quyết định cái nào giao cho người. Ngày 4: dựng bản tự động nhỏ nhất cho một mắt xích. Ngày 5: chạy song song và đối chiếu kết quả, ghi mọi chênh lệch. Ngày 6: thêm hàng chờ ngoại lệ và cảnh báo khi luồng không chạy. Ngày 7: viết tài liệu một trang và tính hiệu quả thật sau khi trừ chi phí dựng.',
    evidence:
      'Bằng chứng mạnh là một hồ sơ luồng gồm: sơ đồ quy trình trước và sau, tài liệu vận hành một trang, và bảng số liệu ba tháng — số lần chạy, thời gian tiết kiệm, số bản ghi rơi vào hàng chờ, số lần cảnh báo phát ra. Khi phỏng vấn hỏi bạn đã cải tiến được gì, bảng đó trả lời bằng con số và cho thấy bạn nghĩ cả tới phần hỏng hóc, chứ không chỉ khoe phần chạy tốt.',
    references: [
      { label: 'Zapier Blog — chuyên mục về tự động hoá quy trình cho người không lập trình', url: 'https://zapier.com/blog', type: 'article' },
      { label: 'Microsoft Learn — tài liệu chính chủ về Power Automate', url: 'https://learn.microsoft.com/power-automate/', type: 'article' },
    ],
  }),

  // ── Chương 7 — Phân tích dữ liệu hỗ trợ quyết định ────────────────────────
  guide({
    thesis:
      'Phân tích dữ liệu phục vụ quyết định bắt đầu từ câu hỏi "chúng ta sẽ làm khác đi điều gì tuỳ theo kết quả", chứ không bắt đầu từ bộ dữ liệu đang có. Một phân tích đúng kỹ thuật nhưng không gắn với một quyết định nào chỉ tạo ra biểu đồ đẹp và cảm giác đã làm việc nghiêm túc. Ngược lại, một phép so sánh đơn giản nhưng định nghĩa chỉ số rõ ràng, nêu được giới hạn dữ liệu và chỉ ra hành động tiếp theo lại thay đổi được cách cả nhóm vận hành.',
    why: {
      work:
        'Trong hầu hết cuộc họp, bên nào đưa được con số có định nghĩa rõ ràng sẽ dẫn dắt kết luận. Không phải vì con số luôn đúng, mà vì nó là thứ duy nhất mọi người có thể cùng phản biện thay vì tranh cãi bằng cảm nhận cá nhân.',
      interview:
        'Với vị trí vận hành, marketing, nhân sự hay quản lý, câu hỏi thường gặp là "bạn dựa vào gì để quyết định". Trình bày được một lần bạn đổi quyết định vì dữ liệu, kèm cách bạn định nghĩa chỉ số, có sức nặng hơn mọi khẳng định về tư duy phân tích.',
      study:
        'Đọc được một bảng số và biết hỏi mẫu này lấy từ đâu, thiếu ai, đo trong bao lâu là kỹ năng nền cho mọi môn có số liệu, và cũng là hàng rào chống lại việc bị thuyết phục bởi những biểu đồ được vẽ có chủ đích.',
      life:
        'Chọn trường cho con, so sánh gói vay, đánh giá một lời quảng cáo về hiệu quả sản phẩm — tất cả đều là bài toán đọc số có bối cảnh, và điểm chung là con số bị cắt khỏi bối cảnh thì nói được gần như bất cứ điều gì.',
    },
    framework: [
      { name: 'Bắt đầu từ quyết định', detail: 'Viết trước câu: nếu kết quả là A chúng ta làm X, nếu là B chúng ta làm Y. Nếu mọi kết quả đều dẫn tới cùng một hành động thì phân tích này không cần làm.' },
      { name: 'Định nghĩa chỉ số chặt', detail: 'Một chỉ số cần rõ tử số, mẫu số, khoảng thời gian và điều kiện loại trừ. "Tỷ lệ khách quay lại" là một cái tên, không phải một định nghĩa; hai phòng ban dùng cùng tên với hai định nghĩa khác nhau là nguồn gốc của phần lớn tranh cãi vô ích.' },
      { name: 'Khám dữ liệu trước khi tính', detail: 'Đếm số dòng, số ô trống, giá trị trùng, khoảng thời gian bao phủ, và các giá trị bất thường. Phần lớn kết luận sai không đến từ phép tính sai mà từ dữ liệu không như bạn tưởng.' },
      { name: 'So sánh có mốc', detail: 'Một con số đứng một mình không có nghĩa. Đặt cạnh kỳ trước, cạnh nhóm khác, hoặc cạnh mục tiêu đã đặt. Và nói rõ những khác biệt nào giữa hai nhóm có thể giải thích chênh lệch ngoài giả thuyết bạn đang tin.' },
      { name: 'Trình bày kèm giới hạn', detail: 'Báo cáo tốt nêu rõ dữ liệu này không nói được điều gì: cỡ mẫu nhỏ, thiếu một kênh, có thay đổi cách ghi nhận giữa kỳ. Nêu giới hạn làm tăng độ tin cậy của phần còn lại chứ không làm giảm.' },
    ],
    scenario:
      'Một trưởng phòng nhân sự của công ty gia công cơ khí báo cáo tỷ lệ nghỉ việc tăng và đề xuất tăng lương toàn bộ khối sản xuất. Trước khi trình, chị tách dữ liệu theo thâm niên và theo tổ. Hình ảnh đổi hẳn: tỷ lệ nghỉ tăng gần như hoàn toàn nằm ở nhóm dưới ba tháng và tập trung ở hai tổ có cùng một quản đốc, trong khi nhóm trên một năm gần như không đổi. Chị kiểm thêm chất lượng dữ liệu và phát hiện các trường hợp chuyển tổ nội bộ đang bị đếm nhầm thành nghỉ việc, làm con số tổng cao hơn thực tế. Sau khi loại nhóm này, chị trình một đề xuất khác hẳn: rà lại quy trình hướng dẫn tháng đầu và phỏng vấn nhóm mới nghỉ ở hai tổ đó, với chi phí thấp hơn nhiều so với phương án ban đầu. Chị cũng ghi rõ giới hạn: mẫu chỉ có hai mươi mốt người nghỉ trong quý, đủ để chỉ hướng điều tra nhưng chưa đủ để kết luận nguyên nhân.',
    comparison: [
      { weak: 'Bắt đầu bằng việc mở dữ liệu ra xem có gì thú vị, rồi tìm câu chuyện phù hợp với thứ tìm thấy.', mature: 'Bắt đầu bằng quyết định đang chờ, viết trước hành động ứng với từng kết quả có thể, rồi mới lấy dữ liệu.' },
      { weak: 'Báo cáo một con số tổng và một mũi tên tăng giảm, để người nghe tự diễn giải.', mature: 'Tách con số theo các nhóm có ý nghĩa vận hành và chỉ ra nhóm nào tạo ra phần lớn thay đổi.' },
      { weak: 'Giấu điểm yếu của dữ liệu vì sợ bị chất vấn và mất tính thuyết phục.', mature: 'Nói trước giới hạn và mức tin cậy, nhờ đó phần kết luận còn lại được chấp nhận nhanh hơn và không sụp khi bị hỏi sâu.' },
    ],
    mistakes: [
      'Đọc hai đại lượng cùng tăng thành quan hệ nhân quả, trong khi cả hai có thể cùng bị kéo bởi một yếu tố thứ ba như mùa vụ, chiến dịch khuyến mãi hay thay đổi cách ghi nhận.',
      'Tính trung bình trên dữ liệu có phân bố lệch nặng, khiến vài giá trị cực lớn kéo con số đại diện đi rất xa mức mà đa số thực sự trải qua.',
      'So sánh hai nhóm được hình thành theo cách khác nhau — ví dụ nhóm tự nguyện tham gia với nhóm còn lại — rồi quy chênh lệch cho can thiệp, trong khi khác biệt có sẵn từ trước mới là lời giải thích đơn giản hơn.',
    ],
    worksheet: [
      'Quyết định nào đang chờ bạn, và bạn sẽ làm gì khác đi tuỳ theo kết quả phân tích? Viết hai nhánh hành động cụ thể.',
      'Viết định nghĩa đầy đủ cho chỉ số chính bạn đang dùng, gồm tử số, mẫu số, khoảng thời gian và các trường hợp bị loại.',
      'Dữ liệu bạn định dùng bao phủ khoảng thời gian nào, và trong khoảng đó có sự kiện bất thường nào có thể bóp méo kết quả?',
      'Ai hoặc nhóm nào không xuất hiện trong dữ liệu này dù họ có liên quan tới câu hỏi?',
      'Nếu kết quả trái với điều bạn đang tin, bạn có sẵn sàng đổi đề xuất không? Nếu không, hãy viết ra điều gì đang giữ bạn lại.',
    ],
    exercises: [
      { label: 'Viết định nghĩa chỉ số', text: 'Chọn ba chỉ số nhóm bạn hay nhắc tới và viết định nghĩa đầy đủ cho từng cái. Hỏi hai đồng nghiệp cùng viết rồi so ba bản để phát hiện chỗ hiểu khác nhau.', level: 'e' },
      { label: 'Khám dữ liệu mười phút', text: 'Với một bảng dữ liệu thật, đếm số dòng, ô trống, dòng trùng, khoảng thời gian và năm giá trị lớn nhất. Ghi lại ít nhất hai điều bất ngờ so với hình dung ban đầu.', level: 'e' },
      { label: 'Trung bình và trung vị', text: 'Trên một cột số có phân bố lệch, tính cả trung bình và trung vị rồi giải thích vì sao chúng lệch nhau, và con số nào phản ánh đúng hơn trải nghiệm của đa số.', level: 'e' },
      { label: 'Bóc tách theo nhóm', text: 'Lấy một chỉ số tổng đang thay đổi và tách theo ít nhất ba cách chia khác nhau. Xác định nhóm nào đóng góp phần lớn thay đổi và viết một câu kết luận cho từng cách chia.', level: 'm' },
      { label: 'Săn lời giải thích khác', text: 'Với một kết luận bạn đang tin từ dữ liệu, liệt kê ba cách giải thích khác cho cùng chênh lệch đó, rồi tìm dữ liệu để loại bớt ít nhất một cách.', level: 'm' },
      { label: 'Biểu đồ trung thực', text: 'Vẽ cùng một dữ liệu theo hai cách: một cách cường điệu chênh lệch bằng trục cắt và một cách trung thực. Viết ra kỹ thuật nào đã tạo ra ấn tượng sai để nhận ra nó khi người khác dùng.', level: 'm' },
      { label: 'Một trang cho người quyết định', text: 'Viết báo cáo một trang gồm: câu hỏi quyết định, định nghĩa chỉ số, phát hiện chính, giới hạn dữ liệu và đề xuất hành động. Trình bày cho người thực sự có quyền quyết và ghi lại mọi câu hỏi họ đặt.', level: 'h' },
      { label: 'Bảy ngày một câu hỏi', text: 'Thử thách 7 ngày: chọn một câu hỏi quyết định thật, mỗi ngày làm một bước — viết nhánh hành động, định nghĩa chỉ số, thu dữ liệu, khám dữ liệu, bóc tách theo nhóm, tìm lời giải thích khác, viết báo cáo một trang. Ngày cuối trình bày và ghi lại quyết định thực tế được đưa ra.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên viết trước hành động ứng với từng kết quả có thể, trước khi nhìn dữ liệu?',
        a: 'Vì nó ngăn hai lỗi cùng lúc. Thứ nhất, nó loại bỏ những phân tích không dẫn tới hành động nào, tức là không đáng làm. Thứ hai, nó khoá tiêu chí trước khi bạn thấy kết quả, nên bạn khó tự nới ngưỡng để bảo vệ phương án mình vốn thích. Đây là cách rẻ nhất để giữ cho phân tích không biến thành trang trí cho một quyết định đã có sẵn.',
      },
      {
        q: 'Số đơn hàng và chi phí quảng cáo cùng tăng trong ba tháng. Vì sao chưa thể kết luận quảng cáo tạo ra đơn hàng?',
        a: 'Vì ít nhất ba lời giải thích khác cùng phù hợp với dữ liệu đó: mùa vụ đẩy cả nhu cầu lẫn ngân sách lên, ngân sách được tăng vì đơn đã tăng chứ không phải ngược lại, hoặc một hoạt động khác trong cùng kỳ mới là nguyên nhân. Muốn tiến gần tới nhân quả cần một so sánh có đối chứng: giữ nguyên ở một khu vực hoặc một nhóm khách và so với nhóm được tăng.',
      },
      {
        q: 'Một báo cáo nêu rõ cỡ mẫu nhỏ và dữ liệu thiếu một kênh bán. Điều đó làm báo cáo yếu đi hay mạnh lên?',
        a: 'Mạnh lên, nếu phần kết luận được điều chỉnh cho khớp với giới hạn đó. Nêu giới hạn cho người đọc biết kết quả này dùng được tới đâu, nhờ vậy quyết định dựa trên nó sẽ có quy mô tương xứng — ví dụ chạy thử ở một tổ thay vì triển khai toàn công ty. Báo cáo giấu giới hạn chỉ mạnh cho tới câu hỏi đầu tiên của người có kinh nghiệm, sau đó mất toàn bộ độ tin cậy.',
      },
    ],
    plan7:
      'Ngày 1: chọn một quyết định đang chờ và viết hai nhánh hành động. Ngày 2: viết định nghĩa đầy đủ cho chỉ số chính và đối chiếu với đồng nghiệp. Ngày 3: thu dữ liệu và khám dữ liệu trong mười phút, ghi những bất ngờ. Ngày 4: bóc tách chỉ số theo ba cách chia. Ngày 5: liệt kê ba lời giải thích khác và tìm cách loại bớt. Ngày 6: viết báo cáo một trang kèm phần giới hạn. Ngày 7: trình bày cho người có quyền quyết và ghi lại quyết định thực tế.',
    evidence:
      'Hiện vật là bộ ba tài liệu cho một câu hỏi thật: bản định nghĩa chỉ số đã được nhóm thống nhất, ghi chú khám dữ liệu chỉ ra các vấn đề chất lượng bạn phát hiện, và báo cáo một trang có phần giới hạn. Nếu quyết định cuối cùng khác với giả định ban đầu, hãy giữ cả hai bản để kể lại. Trong phỏng vấn, câu chuyện "tôi định đề xuất tăng lương, dữ liệu chỉ ra vấn đề nằm ở khâu hướng dẫn tháng đầu, và đây là tài liệu" chứng minh năng lực phân tích rõ hơn bất cứ danh sách công cụ nào.',
    references: [
      { label: 'Our World in Data — kho dữ liệu và biểu đồ công khai, kèm ghi chú về nguồn và giới hạn', url: 'https://ourworldindata.org/', type: 'article' },
      { label: 'Storytelling with Data — blog về cách trình bày dữ liệu cho người ra quyết định', url: 'https://www.storytellingwithdata.com/blog', type: 'article' },
    ],
  }),

  // ── Chương 8 — No-code và Low-code ────────────────────────────────────────
  guide({
    thesis:
      'Công cụ no-code và low-code cho phép người không lập trình dựng được ứng dụng nội bộ, biểu mẫu, cơ sở dữ liệu nhỏ và quy trình duyệt trong vài ngày. Chúng không xoá bỏ tư duy kỹ thuật mà chuyển nó sang chỗ khác: bạn không viết mã, nhưng vẫn phải thiết kế mô hình dữ liệu, phân quyền, xử lý trường hợp lỗi và tính đường thoát khi công cụ chạm giới hạn. Người bỏ qua phần này dựng rất nhanh một thứ chạy được trong tuần đầu và không thể sửa được trong tháng thứ sáu.',
    why: {
      work:
        'Rất nhiều nhu cầu nội bộ quá nhỏ để đội kỹ thuật ưu tiên nhưng đủ lớn để hành hạ một phòng ban mỗi tuần. Người tự dựng được giải pháp cho những khoảng trống đó tạo ra giá trị nhìn thấy ngay và thường trở thành đầu mối cải tiến của bộ phận.',
      interview:
        'Một ứng dụng nội bộ đang được đồng nghiệp dùng thật là loại portfolio hiếm với người phi kỹ thuật: nó có người dùng, có dữ liệu, có phản hồi và có phiên bản. Nó chứng minh khả năng đi từ vấn đề tới sản phẩm.',
      study:
        'Dựng một công cụ nhỏ cho chính việc học — theo dõi bài tập, thu thập dữ liệu cho đồ án, chấm trắc nghiệm tự động — dạy bạn về mô hình dữ liệu và quy trình nhanh hơn nhiều so với đọc lý thuyết.',
      life:
        'Quản lý một câu lạc bộ, tổ chức đám cưới, theo dõi chi tiêu chung của nhóm bạn: những việc này thường được làm bằng chuỗi tin nhắn và một bảng tính lộn xộn, trong khi một biểu mẫu nối với một bảng có cấu trúc giải quyết gọn hơn nhiều.',
    },
    framework: [
      { name: 'Chọn bài toán vừa tầm', detail: 'Ứng viên tốt là bài toán có ít người dùng, dữ liệu không quá nhạy cảm, quy tắc đơn giản và hậu quả sai có thể sửa được. Đừng bắt đầu bằng thứ chạm tiền lương, hồ sơ y tế hay dữ liệu định danh khách hàng.' },
      { name: 'Thiết kế dữ liệu trước giao diện', detail: 'Vẽ ra các bảng và quan hệ giữa chúng trước khi kéo thả bất cứ thứ gì: cái gì là một bản ghi, cái gì là danh sách chọn, cái gì lặp lại nên phải tách bảng. Sửa mô hình dữ liệu sau khi đã có dữ liệu thật là phần đắt nhất của mọi dự án loại này.' },
      { name: 'Dựng bản dùng được nhỏ nhất', detail: 'Làm đủ cho một quy trình chạy từ đầu tới cuối với một người dùng thật, rồi mới thêm tính năng. Bản demo đẹp mà không ai nhập dữ liệu thật vào thì chưa kiểm chứng được gì.' },
      { name: 'Phân quyền và dấu vết', detail: 'Xác định ai xem được gì, ai sửa được gì, và mọi thay đổi quan trọng có để lại dấu vết không. Đây là phần người mới hay bỏ qua nhất và cũng là phần khiến công cụ bị cấm dùng khi tổ chức rà soát.' },
      { name: 'Biết điểm dừng và lối thoát', detail: 'Ghi trước các dấu hiệu cho biết bài toán đã vượt khả năng công cụ: số bản ghi tăng làm chậm hẳn, quy tắc phải lồng nhiều tầng, cần tích hợp mà công cụ không hỗ trợ. Kèm theo là cách xuất toàn bộ dữ liệu ra định dạng chuẩn để chuyển đi.' },
    ],
    scenario:
      'Chủ một phòng khám nha khoa hai ghế đang nhận lịch hẹn qua tin nhắn, mỗi ngày lễ tân chép lại vào sổ giấy và tuần nào cũng có ít nhất một ca trùng giờ. Anh dựng một biểu mẫu đặt lịch nối với một bảng dữ liệu, nhưng trước khi kéo thả anh vẽ ba bảng: bệnh nhân, lịch hẹn, và loại dịch vụ kèm thời lượng. Chính việc tách bảng loại dịch vụ cho phép hệ thống tự chặn trùng giờ theo thời lượng thật của từng loại. Anh chỉ cho lễ tân quyền xem và sửa lịch, không cho xem ghi chú lâm sàng; số điện thoại bệnh nhân được lưu trong hệ thống chứ không xuất hiện trong bảng chia sẻ công khai. Sau một tháng dùng thật, anh ghi lại hai giới hạn đã chạm: chưa gửi được nhắc hẹn tự động và bảng bắt đầu chậm khi lọc theo nhiều điều kiện. Anh viết sẵn cách xuất toàn bộ dữ liệu ra tệp chuẩn, để nếu sau này chuyển sang phần mềm chuyên dụng thì không phải nhập tay lại từ đầu.',
    comparison: [
      { weak: 'Bắt đầu bằng việc kéo thả giao diện cho đẹp rồi nhét dữ liệu vào sau.', mature: 'Bắt đầu bằng sơ đồ bảng và quan hệ, coi giao diện là lớp hiển thị của mô hình đó.' },
      { weak: 'Nhồi mọi thứ vào một bảng rất rộng vì như thế nhìn giống bảng tính quen thuộc.', mature: 'Tách những thứ lặp lại thành bảng riêng và nối bằng quan hệ, nhờ đó sửa một chỗ là đúng ở mọi nơi.' },
      { weak: 'Cấp cho mọi người quyền sửa toàn bộ vì phân quyền phức tạp và ai cũng cần dùng.', mature: 'Cấp quyền theo vai trò, tách riêng dữ liệu nhạy cảm, và bật dấu vết thay đổi cho những bảng quan trọng.' },
    ],
    mistakes: [
      'Dựng một công cụ giải quyết đúng thói quen của riêng người dựng, không hỏi người sẽ dùng hằng ngày, nên nó bị bỏ sau hai tuần và mọi người quay lại bảng tính cũ.',
      'Đưa dữ liệu nhạy cảm như thông tin định danh, hồ sơ sức khoẻ hay bảng lương vào một nền tảng bên ngoài mà chưa kiểm điều khoản lưu trữ và chưa hỏi người phụ trách tuân thủ trong tổ chức.',
      'Không có kế hoạch xuất dữ liệu, nên khi công cụ tăng giá, đổi chính sách hoặc không còn đáp ứng thì toàn bộ dữ liệu vận hành bị kẹt lại trong đó.',
    ],
    worksheet: [
      'Bài toán bạn định dựng có bao nhiêu người dùng thật, và ai trong số đó sẽ nhập dữ liệu mỗi ngày?',
      'Liệt kê các bảng dữ liệu bạn cần và vẽ quan hệ giữa chúng; thứ gì đang lặp lại nhiều lần trong bảng tính hiện tại thì nhiều khả năng phải tách riêng.',
      'Dữ liệu nào trong hệ thống này là nhạy cảm, và ai tuyệt đối không được nhìn thấy nó?',
      'Nếu công cụ ngừng hoạt động vào tháng sau, bạn lấy dữ liệu ra bằng cách nào và mất bao lâu?',
      'Dấu hiệu cụ thể nào sẽ cho bạn biết bài toán đã vượt khả năng của cách làm hiện tại? Viết ít nhất hai ngưỡng đo được.',
    ],
    exercises: [
      { label: 'Sơ đồ ba bảng', text: 'Chọn một bảng tính đang dùng ở nơi bạn làm và vẽ lại nó thành ít nhất ba bảng có quan hệ. Chỉ ra dữ liệu nào đang bị lặp trong bản gốc.', level: 'e' },
      { label: 'Biểu mẫu thay tin nhắn', text: 'Dựng một biểu mẫu thu thập thay cho một quy trình đang chạy bằng tin nhắn hoặc email, thu thật ít nhất mười lượt và so sánh chất lượng dữ liệu thu được.', level: 'e' },
      { label: 'Danh sách chọn thay ô tự do', text: 'Tìm trong dữ liệu hiện tại một trường đang nhập tự do và có nhiều cách viết khác nhau cho cùng một thứ. Chuyển nó thành danh sách chọn và đếm số biến thể đã bị loại bỏ.', level: 'e' },
      { label: 'Quy trình chạy đủ vòng', text: 'Dựng bản nhỏ nhất cho một quy trình từ lúc phát sinh tới lúc kết thúc, có ít nhất một bước duyệt. Cho một người thật chạy đủ một vòng và ghi lại mọi chỗ họ ngập ngừng.', level: 'm' },
      { label: 'Bảng phân quyền', text: 'Lập bảng ai xem được gì và ai sửa được gì cho công cụ bạn dựng, rồi đăng nhập bằng tài khoản của một vai trò khác để kiểm tra thực tế có đúng như bảng không.', level: 'm' },
      { label: 'Thử phá bằng dữ liệu xấu', text: 'Nhập vào hệ thống các trường hợp khó: ngày sai định dạng, tên có ký tự đặc biệt, trường bắt buộc để trống, hai bản ghi trùng. Ghi lại cái nào lọt qua và bổ sung ràng buộc.', level: 'm' },
      { label: 'Bàn giao cho người dùng thật', text: 'Viết hướng dẫn sử dụng một trang, đào tạo hai đồng nghiệp trong ba mươi phút, rồi để họ dùng độc lập một tuần. Thu phản hồi, xếp thứ tự và sửa ba vấn đề lớn nhất.', level: 'h' },
      { label: 'Bảy ngày một ứng dụng nội bộ', text: 'Thử thách 7 ngày: ngày 1 chọn bài toán và phỏng vấn người dùng, ngày 2 vẽ mô hình dữ liệu, ngày 3-4 dựng bản nhỏ nhất, ngày 5 thêm phân quyền và thử phá bằng dữ liệu xấu, ngày 6 cho người thật dùng và ghi phản hồi, ngày 7 viết hướng dẫn kèm cách xuất dữ liệu và danh sách giới hạn đã biết.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao thiết kế mô hình dữ liệu trước lại quan trọng hơn chọn công cụ nào?',
        a: 'Vì mô hình dữ liệu là thứ khó sửa nhất khi đã có dữ liệu thật, còn giao diện và công cụ thì đổi được. Nếu bạn nhét mọi thứ vào một bảng rộng, thì mỗi lần một giá trị thay đổi bạn phải sửa ở hàng chục dòng, và các báo cáo bắt đầu mâu thuẫn nhau. Tách bảng đúng ngay từ đầu tốn thêm một buổi và tiết kiệm nhiều tháng.',
      },
      {
        q: 'Khi nào một giải pháp no-code nên được thay bằng phần mềm viết riêng hoặc phần mềm chuyên dụng?',
        a: 'Khi chạm một trong ba ngưỡng: hiệu năng không còn chịu nổi khối lượng dữ liệu thật, quy tắc nghiệp vụ phải lồng nhiều tầng tới mức không ai đọc hiểu được cấu hình, hoặc yêu cầu về tuân thủ và tích hợp vượt quá thứ nền tảng cung cấp. Điều quan trọng là ghi trước các ngưỡng này thành số đo được, để quyết định chuyển đổi diễn ra có kế hoạch chứ không diễn ra vào lúc hệ thống đã sập.',
      },
      {
        q: 'Bạn dựng xong một công cụ nội bộ rất tiện nhưng sau một tháng không ai dùng. Nên kiểm tra điều gì đầu tiên?',
        a: 'Kiểm xem nó có nằm trên đường đi tự nhiên của công việc hằng ngày không. Công cụ đòi người dùng mở thêm một trang, nhớ thêm một mật khẩu và nhập lại thứ họ đã nhập ở nơi khác sẽ thua thói quen cũ dù tốt hơn về lý thuyết. Cách sửa thường là giảm số bước nhập, nối vào nơi họ vốn đã làm việc, và bỏ những trường không ai dùng tới trong báo cáo.',
      },
    ],
    plan7:
      'Ngày 1: chọn bài toán và phỏng vấn hai người sẽ dùng hằng ngày. Ngày 2: vẽ mô hình dữ liệu gồm các bảng và quan hệ. Ngày 3: dựng biểu mẫu thu thập và bảng lưu trữ. Ngày 4: nối thành một quy trình chạy đủ vòng có bước duyệt. Ngày 5: lập bảng phân quyền và thử phá bằng dữ liệu xấu. Ngày 6: cho người thật dùng, quan sát và ghi mọi chỗ họ ngập ngừng. Ngày 7: viết hướng dẫn một trang, ghi các giới hạn đã biết và thử xuất toàn bộ dữ liệu ra tệp chuẩn.',
    evidence:
      'Bằng chứng là chính ứng dụng nội bộ đang được dùng thật, kèm ba thứ đi cùng: sơ đồ mô hình dữ liệu, bảng phân quyền, và bản ghi phản hồi người dùng cùng các phiên bản bạn đã sửa theo phản hồi đó. Thêm một con số vận hành — số bản ghi mỗi tháng, số lỗi trùng lịch đã giảm, thời gian xử lý một yêu cầu trước và sau. Bộ hồ sơ này biến bạn từ người biết dùng công cụ thành người đã giao được một sản phẩm có người dùng.',
    references: [
      { label: 'Airtable Support — tài liệu chính chủ về xây bảng dữ liệu và quy trình', url: 'https://support.airtable.com/', type: 'article' },
      { label: 'Google Apps Script — tài liệu chính chủ để mở rộng bảng tính khi no-code chạm giới hạn', url: 'https://developers.google.com/apps-script', type: 'article' },
    ],
  }),

  // ── Chương 9 — Đạo đức AI và quyền riêng tư ───────────────────────────────
  guide({
    thesis:
      'Đạo đức AI ở cấp độ người đi làm không phải là một cuộc tranh luận triết học, mà là một chuỗi câu hỏi rất cụ thể trước mỗi lần bấm nút: dữ liệu này đi đâu, ai đã đồng ý cho dùng nó, hệ thống này có thể đối xử khác nhau với các nhóm người không, và người nhận kết quả có được biết đây là nội dung do máy tạo không. Đây là chương mô tả vấn đề và cách tự đặt câu hỏi, không phải tư vấn pháp lý: quy định về dữ liệu và AI khác nhau giữa các quốc gia và vẫn đang thay đổi, nên với việc có rủi ro cao hãy hỏi bộ phận pháp chế hoặc luật sư am hiểu địa bàn của bạn.',
    why: {
      work:
        'Một lần dán dữ liệu khách hàng vào công cụ bên ngoài, một lần dùng giọng nói hoặc hình ảnh của người khác mà chưa hỏi, có thể tạo ra rắc rối mà cả năm làm tốt không bù lại được — và người chịu trách nhiệm là người thao tác, không phải nhà cung cấp công cụ.',
      interview:
        'Với các vị trí chạm dữ liệu người dùng, người phỏng vấn thường thử bằng một tình huống xám. Trả lời được bằng cách nêu câu hỏi cần làm rõ và người cần hỏi cho thấy bạn hiểu ranh giới, thay vì trả lời tuyệt đối hoá theo hướng cấm hết hoặc thoải mái.',
      study:
        'Quy định về liêm chính học thuật với nội dung do AI hỗ trợ đang được các trường cập nhật theo những hướng khác nhau. Thói quen chủ động hỏi và ghi rõ phần nào có AI tham gia bảo vệ bạn tốt hơn nhiều so với suy đoán.',
      life:
        'Ảnh, giọng nói và thông tin cá nhân của bạn và người thân đang lan đi dễ hơn bao giờ hết, đồng thời nội dung giả mạo người thật ngày càng khó phân biệt bằng mắt. Hiểu cơ chế giúp bạn vừa tự bảo vệ vừa không lan truyền thứ mình chưa kiểm.',
    },
    framework: [
      { name: 'Lần theo đường đi của dữ liệu', detail: 'Trước khi đưa bất cứ thứ gì vào một công cụ, trả lời: dữ liệu này được lưu ở đâu, giữ bao lâu, có được dùng để cải thiện mô hình không, ai trong nhà cung cấp có thể xem. Điều khoản của từng dịch vụ và từng gói khác nhau, nên phải đọc chứ không suy đoán.' },
      { name: 'Kiểm tra cơ sở đồng ý', detail: 'Hỏi người có dữ liệu đã đồng ý cho mục đích nào. Một người gửi ảnh để làm hồ sơ nhân sự không đồng nghĩa với việc đồng ý cho ảnh đó dùng làm dữ liệu huấn luyện hay làm quảng cáo. Đồng ý luôn gắn với một mục đích cụ thể.' },
      { name: 'Soi tác động lệch nhóm', detail: 'Với mọi hệ thống tham gia phân loại hoặc sàng lọc con người — hồ sơ ứng tuyển, hồ sơ vay, chấm điểm chất lượng — hãy kiểm kết quả tách theo nhóm, vì một mô hình học từ quyết định trong quá khứ sẽ học luôn cả các thiên lệch từng có trong đó.' },
      { name: 'Minh bạch với người nhận', detail: 'Nêu rõ khi nội dung do AI tạo hoặc khi một quyết định có sự tham gia của hệ thống tự động, đặc biệt trong các tình huống ảnh hưởng tới quyền lợi của người khác. Việc che giấu thường gây thiệt hại lớn hơn chính nội dung đó.' },
      { name: 'Đặt điểm dừng và người chịu trách nhiệm', detail: 'Với mỗi ứng dụng, ghi rõ ai là người ký tên vào kết quả cuối và trường hợp nào bắt buộc dừng lại chuyển cho người. Trách nhiệm không thể chuyển sang một công cụ, nên nó phải có tên người ngay từ khi thiết kế.' },
    ],
    scenario:
      'Một nhóm marketing của công ty thực phẩm muốn dựng video quảng cáo có giọng đọc mô phỏng giọng của một nhân viên bán hàng quen thuộc với khách quen, và muốn dùng lại các đoạn tin nhắn khen ngợi của khách làm lời chứng thực. Trưởng nhóm dừng lại và tách thành ba câu hỏi. Với giọng nói: người nhân viên đó đã đồng ý cho dùng giọng vào mục đích quảng cáo chưa, và phạm vi thời gian bao lâu — nhóm quyết định xin đồng ý bằng văn bản, ghi rõ mục đích và thời hạn. Với tin nhắn khách hàng: khách viết trong bối cảnh riêng tư, nên nhóm hỏi lại từng người và chỉ dùng những ai đồng ý, có ẩn danh theo yêu cầu. Với phần hình ảnh do AI tạo: nhóm ghi chú rõ trong nội dung rằng hình minh hoạ được tạo bằng AI, để không tạo ấn tượng đây là ảnh chụp sản phẩm thật. Chiến dịch chậm hơn kế hoạch một tuần và không có sự cố nào phải xử lý sau đó.',
    comparison: [
      { weak: 'Mặc định rằng dữ liệu nội bộ dán vào công cụ bên ngoài thì chỉ mình mình thấy.', mature: 'Đọc điều khoản của đúng gói dịch vụ đang dùng và phân loại trước dữ liệu nào được phép ra ngoài, dữ liệu nào không.' },
      { weak: 'Coi việc không nêu vai trò của AI là chuyện nhỏ, miễn nội dung có chất lượng tốt.', mature: 'Ghi rõ phần do AI tạo trong những bối cảnh mà người nhận có lý do quan tâm tới nguồn gốc: quảng cáo, báo cáo, bài nộp, tư vấn.' },
      { weak: 'Tin rằng hệ thống chấm bằng thuật toán thì khách quan hơn con người vì máy không có định kiến.', mature: 'Hiểu rằng mô hình học từ dữ liệu do người tạo ra, nên kiểm kết quả tách theo nhóm là việc bắt buộc chứ không phải tuỳ chọn.' },
    ],
    mistakes: [
      'Ẩn danh dữ liệu một cách hình thức bằng cách bỏ tên nhưng vẫn giữ đủ các trường khác để dễ dàng xác định lại từng người, rồi coi như đã hết trách nhiệm bảo vệ.',
      'Suy ra từ một bài báo về luật ở nước ngoài rằng nơi mình đang làm cũng áp dụng quy định tương tự, trong đó cả nội dung lẫn phạm vi áp dụng đều đang thay đổi theo từng địa bàn.',
      'Chỉ nghĩ về rủi ro pháp lý cho công ty mà bỏ qua câu hỏi đơn giản hơn: nếu người có dữ liệu này biết chúng ta đang dùng nó theo cách này, họ sẽ thấy thế nào.',
    ],
    worksheet: [
      'Liệt kê những loại dữ liệu bạn thường xuyên xử lý và đánh dấu loại nào chứa thông tin nhận dạng được một người cụ thể.',
      'Với công cụ AI bạn dùng nhiều nhất, bạn đã đọc phần điều khoản nói về việc dữ liệu nhập vào có được dùng để huấn luyện hay không chưa?',
      'Trong công việc của bạn có khâu nào hệ thống tham gia sàng lọc hoặc xếp hạng con người không? Nếu có, kết quả đã bao giờ được tách theo nhóm để xem xét chưa?',
      'Nội dung do AI tạo mà bạn gửi ra ngoài trong tháng qua có được nêu rõ nguồn gốc không? Nếu không, người nhận có lý do để quan tâm không?',
      'Với ứng dụng AI trong nhóm bạn, ai là người ký tên vào kết quả cuối cùng và trường hợp nào bắt buộc dừng lại?',
    ],
    exercises: [
      { label: 'Bảng phân loại dữ liệu', text: 'Lập bảng ba mức cho dữ liệu bạn xử lý: được đưa ra công cụ ngoài, chỉ dùng nội bộ, tuyệt đối không rời hệ thống. Xếp ít nhất mười loại dữ liệu vào bảng.', level: 'e' },
      { label: 'Đọc điều khoản', text: 'Mở điều khoản của một công cụ AI bạn đang dùng, tìm và chép lại đoạn nói về lưu trữ dữ liệu và việc dùng dữ liệu để huấn luyện. Tóm tắt bằng ba câu cho đồng nghiệp hiểu.', level: 'e' },
      { label: 'Thử ẩn danh ngược', text: 'Lấy một bảng đã bỏ cột tên và thử xác định lại một người cụ thể chỉ bằng các cột còn lại. Ghi lại bao nhiêu cột là đủ để nhận ra ai.', level: 'e' },
      { label: 'Câu hỏi đồng ý', text: 'Chọn một cách dùng dữ liệu hiện tại của nhóm bạn và viết ra câu hỏi xin đồng ý đúng mục đích, đúng thời hạn, đủ rõ để người đọc hiểu họ đang đồng ý cho việc gì.', level: 'm' },
      { label: 'Soi lệch nhóm', text: 'Với một quy trình sàng lọc đang chạy, tách kết quả theo ít nhất hai cách chia nhóm và xem tỷ lệ có chênh lệch bất thường không. Ghi lại các cách giải thích khả dĩ trước khi kết luận.', level: 'm' },
      { label: 'Nhận diện nội dung giả mạo', text: 'Tìm hai ví dụ nội dung mạo danh người thật đã được các tổ chức kiểm chứng công bố, phân tích cách chúng được phát hiện và rút ra ba dấu hiệu bạn có thể tự kiểm.', level: 'm' },
      { label: 'Quy tắc dùng AI cho phòng ban', text: 'Soạn quy tắc một trang gồm: dữ liệu được phép và bị cấm, khi nào phải nêu rõ có AI tham gia, ai duyệt kết quả cuối, và trường hợp nào bắt buộc dừng. Lấy ý kiến ít nhất ba người ở các vai trò khác nhau và ghi lại chỗ họ bất đồng.', level: 'h' },
      { label: 'Bảy ngày rà đạo đức dữ liệu', text: 'Thử thách 7 ngày: mỗi ngày rà một khía cạnh — phân loại dữ liệu, điều khoản công cụ, cơ sở đồng ý, ẩn danh, lệch nhóm, minh bạch với người nhận, người chịu trách nhiệm cuối. Ngày 7 tổng hợp thành danh sách các việc cần sửa và gửi cho người quản lý.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao bỏ cột tên chưa đủ để coi một tập dữ liệu là ẩn danh?',
        a: 'Vì danh tính có thể được khôi phục bằng cách ghép nhiều trường còn lại. Ngày sinh, mã bưu chính, chức danh, phòng ban hay lịch sử giao dịch kết hợp lại thường chỉ ứng với một người duy nhất, nhất là trong một tổ chức không lớn. Ẩn danh thật đòi hỏi giảm độ chi tiết hoặc gộp nhóm, và luôn phải kiểm bằng cách thử nhận diện ngược.',
      },
      {
        q: 'Một hệ thống lọc hồ sơ ứng tuyển được huấn luyện trên các quyết định tuyển dụng của công ty trong năm năm qua. Rủi ro đạo đức chính là gì?',
        a: 'Nó học lại các mẫu quyết định cũ, bao gồm cả những thiên lệch từng tồn tại trong đó, rồi áp dụng chúng nhất quán và ở quy mô lớn hơn. Điều nguy hiểm là kết quả trông khách quan vì do máy đưa ra, nên ít bị chất vấn hơn quyết định của một người. Biện pháp tối thiểu là tách kết quả theo nhóm để theo dõi, giữ người ra quyết định cuối, và ghi lại lý do cho các trường hợp bị loại.',
      },
      {
        q: 'Đồng nghiệp nói rằng chưa có quy định cấm nên cứ dùng thoải mái. Bạn phản hồi thế nào cho có tính xây dựng?',
        a: 'Tách hai câu hỏi: cái gì đang bị cấm và cái gì nên làm. Quy định về dữ liệu và AI khác nhau theo quốc gia và vẫn đang được bổ sung, nên việc chưa có điều khoản cụ thể hôm nay không đảm bảo an toàn cho việc đã làm hôm nay. Đề xuất thực dụng hơn là dùng phép thử công khai: nếu người có dữ liệu, hoặc khách hàng, biết chính xác chúng ta đang làm gì với nó thì họ có phản ứng thế nào. Kèm theo đó là hỏi bộ phận pháp chế cho những việc chạm dữ liệu cá nhân hoặc ảnh hưởng quyền lợi người khác.',
      },
    ],
    plan7:
      'Ngày 1: lập bảng phân loại dữ liệu ba mức. Ngày 2: đọc và tóm tắt điều khoản của công cụ AI dùng nhiều nhất. Ngày 3: thử ẩn danh ngược trên một tập dữ liệu thật. Ngày 4: rà lại cơ sở đồng ý cho các cách dùng dữ liệu hiện tại. Ngày 5: tách kết quả một quy trình sàng lọc theo nhóm và xem chênh lệch. Ngày 6: rà những nội dung do AI tạo đã gửi ra ngoài và bổ sung phần nêu rõ nguồn gốc khi cần. Ngày 7: soạn quy tắc một trang cho phòng ban và lấy ý kiến ba người ở ba vai trò.',
    evidence:
      'Hiện vật là bản quy tắc sử dụng AI và dữ liệu một trang cho phòng ban của bạn, kèm bảng phân loại dữ liệu và biên bản các ý kiến phản đối cùng cách bạn xử lý chúng. Nếu bạn từng dừng hoặc sửa một việc vì lý do đạo đức hay riêng tư, hãy ghi lại tình huống, câu hỏi bạn đặt ra và quyết định cuối. Trong phỏng vấn cho vị trí chạm dữ liệu người dùng, đây là loại bằng chứng khó dựng giả và được đánh giá rất cao, vì nó cho thấy bạn nhận ra vấn đề trước khi có ai yêu cầu.',
    references: [
      { label: 'OECD.AI Policy Observatory — nguyên tắc AI và theo dõi chính sách của các quốc gia', url: 'https://oecd.ai/', type: 'article' },
      { label: 'Electronic Frontier Foundation — tổ chức phi lợi nhuận về quyền riêng tư và quyền số', url: 'https://www.eff.org/', type: 'article' },
    ],
  }),

  // ── Chương 10 — Hợp tác hiệu quả giữa con người và AI ─────────────────────
  guide({
    thesis:
      'Hợp tác tốt với AI là bài toán phân vai, không phải bài toán công cụ. Nguyên tắc chia việc bền vững qua mọi thế hệ công cụ: giao cho máy phần rộng và nhanh — sinh phương án, chuyển định dạng, rà soát cơ học, tóm tắt khối lượng lớn; giữ cho người phần hẹp và nặng trách nhiệm — chọn mục tiêu, cung cấp bối cảnh nội bộ, phán đoán giá trị, và ký tên vào kết quả cuối. Rủi ro lớn nhất không phải máy làm sai, mà là bạn dần mất khả năng nhận ra nó sai vì đã lâu không tự làm phần đó.',
    why: {
      work:
        'Khi cả nhóm dùng AI, chênh lệch không còn nằm ở ai biết dùng, mà ở ai biết giao đúng việc và giữ lại đúng việc. Người giao sai sẽ tạo ra khối lượng đầu ra lớn mà chất lượng phán đoán trong đó giảm dần.',
      interview:
        'Câu hỏi phân biệt ứng viên hiện nay không phải bạn có dùng AI không, mà bạn giữ lại việc gì cho mình và vì sao. Câu trả lời có ranh giới rõ ràng cho thấy bạn hiểu trách nhiệm nghề nghiệp của mình nằm ở đâu.',
      study:
        'Dùng AI để bỏ qua phần luyện tập khiến bài nộp đẹp lên trong khi năng lực đứng yên, và khoảng cách chỉ lộ ra ở kỳ thi hoặc ở công việc thật. Phân vai đúng là dùng nó làm người ra đề và người phản biện, còn phần tự nghĩ vẫn phải tự làm.',
      life:
        'Trong các quyết định cá nhân quan trọng, AI giúp bạn liệt kê phương án và tìm những điều bạn chưa nghĩ tới, nhưng việc cân giữa các giá trị — an toàn hay cơ hội, gần nhà hay thu nhập — thì không ai làm thay được, vì đó là câu hỏi bạn muốn sống thế nào.',
    },
    framework: [
      { name: 'Phân vai theo trách nhiệm cuối', detail: 'Với mỗi đầu việc, hỏi ai chịu hậu quả nếu sai. Việc mà tên bạn đứng cuối thì bạn phải hiểu được toàn bộ nội dung, kể cả khi bản nháp do máy viết; việc chỉ tốn công sửa thì giao thoải mái.' },
      { name: 'Đầu tư vào đầu vào', detail: 'Phần lớn khác biệt về chất lượng đến từ bối cảnh và dữ liệu bạn cung cấp, không từ cách gọt câu lệnh. Mười lăm phút gom tài liệu thật thường có giá trị hơn nhiều lượt thử lại với cùng lượng thông tin nghèo nàn.' },
      { name: 'Lấy nó làm đối thủ, không chỉ làm thợ', detail: 'Sau khi tự nghĩ xong, yêu cầu nó phản biện lập luận của bạn, liệt kê những gì bạn bỏ sót, hoặc đưa ra phương án ngược lại. Thứ tự này giữ được suy nghĩ độc lập của bạn rồi mới mở rộng nó.' },
      { name: 'Giữ cơ bắp gốc', detail: 'Định kỳ tự làm một việc từ đầu tới cuối mà không dùng trợ giúp, để biết năng lực nền của mình đang ở đâu. Nếu không còn tự làm được thì bạn cũng không còn đánh giá được chất lượng thứ mình nhận về.' },
      { name: 'Đo bằng kết quả cuối', detail: 'Đo hiệu quả hợp tác bằng chất lượng và thời gian tới kết quả được chấp nhận, không bằng số chữ sinh ra hay số lượt dùng. Nhiều luồng công việc tạo ra rất nhiều bản nháp mà thời gian tới bản duyệt được lại dài hơn trước.' },
    ],
    scenario:
      'Một chuyên viên phân tích tài chính ở công ty bán lẻ phải làm báo cáo giải trình chênh lệch chi phí hằng tháng. Anh chia lại việc thay vì giao trọn gói. Anh tự nêu giả thuyết về nguyên nhân dựa trên những gì chỉ người trong công ty biết, rồi giao cho AI phần rà soát cơ học: đối chiếu các khoản mục giữa hai kỳ, đánh dấu mọi chênh lệch vượt ngưỡng, và chuyển bảng thô thành cấu trúc thống nhất. Sau đó anh yêu cầu nó đóng vai giám đốc tài chính và đặt mười câu hỏi khó nhất cho bản giải trình của anh — ba câu trong đó anh chưa chuẩn bị dữ liệu, nên anh bổ sung trước cuộc họp. Phần kết luận và khuyến nghị anh tự viết, vì đó là phần anh sẽ phải bảo vệ. Mỗi quý, anh làm một báo cáo hoàn toàn thủ công để kiểm tra mình còn nắm được cấu trúc số liệu hay không.',
    comparison: [
      { weak: 'Giao trọn một việc từ đầu tới cuối rồi đọc lướt kết quả và gửi đi, vì nhìn có vẻ ổn.', mature: 'Chia việc thành các đoạn, tự làm đoạn cần phán đoán, giao đoạn cơ học, và duyệt từng đoạn với tiêu chí đã viết trước.' },
      { weak: 'Hỏi AI trước khi tự nghĩ, nên phương án đầu tiên nó đưa ra trở thành khung suy nghĩ của bạn.', mature: 'Tự phác ý kiến của mình trước, rồi mới dùng nó để phản biện và mở rộng, nhờ đó giữ được góc nhìn riêng.' },
      { weak: 'Đánh giá thành công bằng việc làm xong nhanh hơn trước.', mature: 'Đánh giá bằng thời gian tới bản được người có thẩm quyền chấp nhận, số vòng sửa, và số lỗi bị phát hiện sau khi gửi.' },
    ],
    mistakes: [
      'Để công cụ định khung vấn đề ngay từ câu đầu tiên, nên mọi phương án về sau đều xoay quanh cách hiểu của nó và bạn không bao giờ biết mình đã bỏ lỡ hướng tiếp cận nào.',
      'Ngừng tự làm những việc nền tảng trong thời gian dài, tới lúc cần thẩm định một kết quả quan trọng thì không còn đủ cảm giác nghề để nhận ra chỗ bất thường.',
      'Dùng khối lượng đầu ra làm thước đo năng suất, dẫn tới việc nhóm nhận về nhiều tài liệu hơn nhưng số quyết định được đưa ra và chất lượng của chúng thì không đổi.',
    ],
    worksheet: [
      'Trong tuần qua, đầu việc nào bạn đã giao trọn gói cho AI mà tên bạn vẫn đứng ở kết quả cuối?',
      'Với việc quan trọng nhất sắp tới, phần nào bạn sẽ tự làm trước khi hỏi bất cứ công cụ nào? Viết ra ranh giới đó.',
      'Kỹ năng nền nào của bạn đã lâu không tự luyện vì luôn có trợ giúp? Bao giờ bạn kiểm tra lại nó?',
      'Bạn đang đo hiệu quả của việc dùng AI bằng gì? Nếu chưa đo bằng thời gian tới kết quả được chấp nhận, hãy viết cách đo mới.',
      'Lần gần nhất bạn dùng AI để phản biện chính mình thay vì để làm hộ, kết quả thu được là gì?',
    ],
    exercises: [
      { label: 'Bảng chia vai', text: 'Lấy một dự án đang làm và chia mọi đầu việc thành ba cột: máy làm, người làm, làm chung. Viết một câu lý do cho mỗi mục ở cột người làm.', level: 'e' },
      { label: 'Tự nghĩ trước', text: 'Với ba việc trong tuần, viết ý kiến của riêng bạn ra giấy trước khi mở bất kỳ công cụ nào, rồi mới hỏi. Ghi lại phần nó bổ sung và phần bạn giữ nguyên.', level: 'e' },
      { label: 'Mười câu hỏi khó', text: 'Yêu cầu công cụ đóng vai người sẽ chất vấn bạn và đặt mười câu hỏi khó nhất cho tài liệu sắp trình. Đánh dấu những câu bạn chưa có dữ liệu và chuẩn bị trước cuộc họp.', level: 'e' },
      { label: 'Gom bối cảnh mười lăm phút', text: 'Chọn một việc bạn từng nhận kết quả chung chung. Dành mười lăm phút gom tài liệu và số liệu thật rồi giao lại. So hai kết quả và ghi phần chênh lệch cụ thể.', level: 'm' },
      { label: 'Đo thời gian tới bản duyệt', text: 'Trong hai tuần, ghi cho mỗi tài liệu: thời gian tới bản được người có thẩm quyền chấp nhận và số vòng sửa. So sánh giữa các cách chia việc khác nhau.', level: 'm' },
      { label: 'Ngày không trợ giúp', text: 'Chọn một ngày làm việc hoàn toàn không dùng trợ lý AI cho một loại việc bạn thường giao. Ghi lại chỗ chậm hơn và chỗ bạn phát hiện mình đã quên.', level: 'm' },
      { label: 'Chuẩn hợp tác cho nhóm', text: 'Soạn tài liệu chuẩn cho nhóm gồm: bảng chia vai theo loại việc, yêu cầu về kiểm chứng trước khi gửi ra ngoài, và cách ghi nhận phần có AI tham gia. Áp dụng thử một tháng rồi sửa theo những va vấp thực tế.', level: 'h' },
      { label: 'Bảy ngày phân vai', text: 'Thử thách 7 ngày: mỗi ngày ghi lại một việc theo ba cột — tôi làm gì, máy làm gì, tôi đã kiểm gì. Ngày 7 xem lại toàn bộ và tìm những việc bạn đã giao đi mà lẽ ra phải tự làm, cùng những việc bạn ôm mà giao đi được.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên tự phác ý kiến của mình trước khi hỏi AI về một vấn đề mở?',
        a: 'Vì phương án đầu tiên bạn nhìn thấy sẽ neo cách bạn nghĩ về toàn bộ vấn đề. Nếu hỏi trước, bạn có xu hướng đánh giá mọi hướng khác dựa trên khung mà nó đưa ra, và những hướng nằm ngoài khung đó gần như không bao giờ được xem xét. Tự phác trước tốn thêm mười lăm phút và giữ lại thứ khó thay thế nhất là góc nhìn riêng của người trong cuộc.',
      },
      {
        q: 'Nhóm bạn tạo ra nhiều tài liệu hơn hẳn từ khi dùng AI nhưng cấp trên nói chất lượng quyết định không đổi. Điều gì đã sai trong cách đo?',
        a: 'Nhóm đang đo sản lượng thay vì đo kết quả. Số bản nháp không phải giá trị; giá trị nằm ở quyết định được đưa ra nhanh hơn và đúng hơn. Cách đo nên chuyển sang thời gian từ lúc đặt câu hỏi tới lúc có bản được chấp nhận, số vòng sửa, và số lỗi phát hiện sau khi gửi. Rất có thể phần nút thắt thật nằm ở khâu duyệt và ra quyết định, mà tăng sản lượng đầu vào chỉ làm nút thắt đó nghẽn thêm.',
      },
      {
        q: 'Làm sao biết bạn đang phụ thuộc quá mức vào công cụ chứ không phải đang dùng nó hiệu quả?',
        a: 'Có ba dấu hiệu kiểm được. Một, bạn không còn tự làm được từ đầu tới cuối một việc thuộc chuyên môn của mình trong thời gian hợp lý. Hai, bạn không phát hiện được lỗi trong kết quả nhận về cho tới khi người khác chỉ ra. Ba, bạn không giải thích nổi vì sao kết quả lại như vậy khi bị hỏi sâu. Phép thử đơn giản là định kỳ làm một việc hoàn toàn thủ công và xem cảm giác nghề của mình còn nhạy tới đâu.',
      },
    ],
    plan7:
      'Ngày 1: lập bảng chia vai ba cột cho dự án đang làm. Ngày 2: luyện tự phác ý kiến trước khi hỏi, cho ba việc. Ngày 3: dùng vai phản biện để tìm mười câu hỏi khó cho một tài liệu thật. Ngày 4: dành mười lăm phút gom bối cảnh cho một việc từng cho kết quả chung chung và so lại. Ngày 5: bắt đầu đo thời gian tới bản duyệt và số vòng sửa. Ngày 6: làm một ngày không trợ giúp cho loại việc bạn thường giao đi. Ngày 7: tổng hợp thành một trang chuẩn hợp tác cho nhóm và đề xuất áp dụng thử.',
    evidence:
      'Bằng chứng gồm hai phần bổ sung cho nhau. Phần một là tài liệu chuẩn hợp tác của nhóm bạn: bảng chia vai theo loại việc, yêu cầu kiểm chứng, cách ghi nhận phần có AI tham gia. Phần hai là số liệu trước và sau cho một loại công việc cụ thể: thời gian tới bản được chấp nhận, số vòng sửa, số lỗi phát hiện sau khi gửi. Khi phỏng vấn hỏi bạn làm việc với AI thế nào, hai phần này cho câu trả lời mà rất ít ứng viên đưa ra được: bạn không kể mình dùng gì, bạn cho thấy mình đã thiết kế cách làm việc cho cả nhóm và đo được nó có tác dụng hay không.',
    references: [
      { label: 'MIT Technology Review — chuyên mục trí tuệ nhân tạo', url: 'https://www.technologyreview.com/topic/artificial-intelligence/', type: 'article', needsReview: true },
      { label: 'NIST AI Risk Management Framework — khung quản trị rủi ro khi đưa AI vào quy trình làm việc', url: 'https://www.nist.gov/itl/ai-risk-management-framework', type: 'article' },
    ],
    diagram: 'cycle',
  }),
];
