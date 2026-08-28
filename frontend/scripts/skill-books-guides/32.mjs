import { guide } from '../skill-guide-builder.mjs';

export default [
  // ── Chương 1 · Xác định mục tiêu ──────────────────────────────────────────
  guide({
    thesis:
      'Một câu chỉ trở thành mục tiêu khi nó nêu được năm phần: đại lượng nào sẽ đổi, đổi từ mức nào lên mức nào, trước ngày nào, ai chịu trách nhiệm, và bạn chấp nhận đánh đổi gì để có nó. Thiếu một trong năm phần thì đó vẫn là mong muốn — nghe hợp lý trong cuộc họp nhưng không dùng được để phân bổ người và tiền, không dùng được để từ chối một yêu cầu chen ngang, và tới cuối kỳ không ai chứng minh nổi là đã đạt hay chưa.',
    why: {
      work:
        'Khi mục tiêu mơ hồ thì mọi đề xuất đều có vẻ hợp lý nên nhóm ôm hết; khi mục tiêu có con số và mốc, bạn có căn cứ để nói "việc này không phục vụ mục tiêu quý này" mà không biến nó thành xung đột cá nhân.',
      interview:
        'Câu "dự án lớn nhất bạn từng làm là gì" phân loại ứng viên rất nhanh: người kể hoạt động (chúng tôi làm A, B, C) đứng thấp hơn hẳn người kể đại lượng đổi (đưa thời gian xử lý đơn từ 48 giờ xuống 12 giờ trong bốn tháng, với đội ba người).',
      study:
        'Mục tiêu kiểu "học tốt tiếng Anh" không sinh ra được lịch học nào. Mục tiêu "đọc và tóm tắt được một bài 800 từ trong 15 phút, đo bằng 10 bài thử cuối tháng" thì tự nó chỉ ra phải luyện gì mỗi ngày.',
      life:
        'Với việc cá nhân — tiết kiệm, sửa nhà, chạy bộ — phần lớn thất bại không đến từ lười mà từ chỗ mục tiêu không có mốc kiểm giữa kỳ, nên bạn chỉ phát hiện mình chệch vào lúc đã quá muộn để chỉnh.',
    },
    framework: [
      {
        name: 'Viết đại lượng đổi',
        detail:
          'Câu mục tiêu phải có dạng: đưa <chỉ số> từ <mức hiện tại có ngày đo> lên <mức đích> trước <ngày>. Nếu bạn không biết mức hiện tại, việc đầu tiên của dự án là đo nó, chứ không phải đoán rồi viết bừa vào slide.',
      },
      {
        name: 'Tách kết quả khỏi đầu ra',
        detail:
          'Kết quả (outcome) là thứ thay đổi ở khách hàng, doanh thu, thời gian, chất lượng. Đầu ra (output) là thứ bạn giao: bài đăng, tính năng, bản báo cáo. Đầu ra chỉ được coi là phương tiện; ghi rõ đầu ra nào phục vụ kết quả nào để sau này còn cắt được.',
      },
      {
        name: 'Đặt lan can',
        detail:
          'Viết thẳng những thứ không được hy sinh để đạt số: không tăng chi phí nhân sự quá 5%, không hạ điểm hài lòng dưới 4,5, không nợ kỹ thuật thêm. Không có lan can thì mọi mục tiêu đều đạt được bằng cách phá một thứ khác.',
      },
      {
        name: 'Kiểm bằng phép tính ngược',
        detail:
          'Chia mục tiêu ra thành các thừa số vận hành và xem con số cuối có khả thi không: cần thêm bao nhiêu đơn mỗi ngày, bao nhiêu cuộc gọi, bao nhiêu giờ máy. Nếu phép tính ngược đòi hỏi một thừa số vượt xa kỷ lục từng có, hãy sửa mục tiêu ngay bây giờ thay vì sửa niềm tin của nhóm vào tháng thứ hai.',
      },
      {
        name: 'Chốt chủ sở hữu và nhịp kiểm',
        detail:
          'Mỗi chỉ số có đúng một tên người và một nhịp xem lại cố định (tuần hoặc hai tuần), kèm ngưỡng báo động định trước: đến ngày X mà chưa đạt mức Y thì kích hoạt phương án B đã viết sẵn.',
      },
    ],
    scenario:
      'Chủ một chuỗi bốn quán trà sữa đặt mục tiêu đầu quý là "tăng doanh thu". Sau ba tuần không ai biết mình đang thắng hay thua, chị viết lại thành: đưa doanh thu khung 14h-17h của hai cửa hàng số 2 và số 3 từ mức 6 triệu đồng mỗi ngày (đo trung bình 30 ngày trước) lên 9 triệu đồng, trước 30 tháng 11, lan can là không tăng giờ công quá 5% và không để điểm đánh giá trên ứng dụng giao đồ ăn tụt dưới 4,5. Phép tính ngược cho thấy cần thêm khoảng 60 ly mỗi ngày mỗi quán — vượt xa mức tăng tự nhiên, nên chị bỏ hướng "chạy quảng cáo mạnh hơn" và chọn hướng bán combo cho khối văn phòng gần đó với đơn đặt trước theo nhóm. Quản lý mỗi quán sở hữu một chỉ số, họp 15 phút mỗi sáng thứ Hai, và mốc báo động đặt ở tuần 4: chưa đạt 7,2 triệu thì dừng combo, chuyển sang bán buổi chiều cho hai trường học. Cuối quý số thật là 8,6 triệu — chưa đạt đích nhưng biết rõ đã kẹt ở đâu.',
    comparison: [
      {
        weak: 'Viết mục tiêu bằng động từ hoạt động: "đẩy mạnh truyền thông", "cải thiện quy trình", "nâng cao chất lượng dịch vụ".',
        mature:
          'Viết bằng đại lượng có mức đầu, mức cuối và ngày, để hai người đọc độc lập vẫn kết luận giống nhau về việc đã đạt hay chưa.',
      },
      {
        weak: 'Đặt bảy mục tiêu ngang hàng cho một quý vì mục nào cũng thấy quan trọng, rồi phân bổ mỏng cho tất cả.',
        mature:
          'Chọn một mục tiêu bậc một, hạ các mục còn lại thành ràng buộc phải giữ nguyên mức hiện tại — nhờ vậy khi thiếu nguồn lực bạn biết cắt cái nào trước.',
      },
      {
        weak: 'Giao mục tiêu cho cả phòng ban để "cùng nhau cố gắng", nên khi trượt thì không có ai để hỏi và cũng không có ai để hỗ trợ đúng lúc.',
        mature:
          'Mỗi chỉ số gắn đúng một tên người sở hữu; người đó không nhất thiết tự làm hết, nhưng chịu trách nhiệm báo sớm khi số đi sai hướng.',
      },
    ],
    mistakes: [
      'Đặt mục tiêu theo đầu ra rồi báo cáo hoàn thành 100% — đã xuất bản 40 bài, đã phát hành 12 tính năng — trong khi chỉ số kinh doanh phía sau không nhúc nhích, và không ai dám nói ra vì trên giấy tờ mọi thứ đều xanh.',
      'Bỏ qua bước đo mức hiện tại vì "ai cũng biết đại khái nó thế nào", để rồi cuối kỳ tranh cãi về điểm xuất phát thay vì tranh luận về cách làm.',
      'Gắn mục tiêu tham vọng trực tiếp vào đánh giá lương thưởng theo kiểu đạt thì thưởng, trượt thì phạt; hệ quả rất dễ đoán là năm sau mọi người đặt mục tiêu thấp hơn khả năng thật và tô số cho đẹp.',
    ],
    worksheet: [
      'Viết lại mục tiêu quan trọng nhất của bạn quý này theo đúng khuôn: đưa <chỉ số> từ <mức đo được, kèm ngày đo> lên <mức đích> trước <ngày>.',
      'Ba đầu ra bạn đang định giao là gì, và mỗi đầu ra tác động vào chỉ số trên qua con đường nào? Đầu ra nào không nối được vào chỉ số thì đánh dấu để xem xét cắt.',
      'Hai lan can của mục tiêu này là gì — thứ tuyệt đối không được xấu đi kể cả khi số chính đang tăng?',
      'Làm phép tính ngược: mục tiêu này quy ra bao nhiêu đơn vị mỗi ngày hoặc mỗi tuần? So con số đó với mức cao nhất bạn từng đạt và ghi lại tỷ lệ chênh.',
      'Ngày nào là mốc báo động giữa kỳ, ngưỡng nào coi là chệch, và phương án B đã viết sẵn của bạn gồm những bước gì?',
    ],
    exercises: [
      {
        label: 'Lọc mong muốn khỏi mục tiêu',
        text: 'Lấy 10 dòng trong biên bản họp gần nhất của nhóm bạn. Đánh dấu dòng nào có đủ đại lượng, mức đầu, mức đích và ngày. Viết lại ba dòng thiếu nhiều nhất theo khuôn năm phần.',
        level: 'e',
      },
      {
        label: 'Đo mức hiện tại',
        text: 'Chọn một chỉ số bạn hay nhắc tới nhưng chưa từng đo. Trong hai ngày, tìm cách lấy con số thật của 30 ngày gần nhất, ghi rõ nguồn dữ liệu và cách tính, rồi dán vào tài liệu dự án.',
        level: 'e',
      },
      {
        label: 'Tách kết quả khỏi đầu ra',
        text: 'Kẻ bảng hai cột cho dự án đang chạy: cột trái liệt kê mọi thứ nhóm sẽ giao, cột phải ghi kết quả mà mỗi thứ nhắm tới. Khoanh các dòng cột trái không nối được sang cột phải và tính xem chúng chiếm bao nhiêu phần trăm công sức.',
        level: 'e',
      },
      {
        label: 'Phép tính ngược trên một trang',
        text: 'Phân rã mục tiêu chính thành ba đến bốn thừa số vận hành (lượt khách, tỷ lệ chuyển đổi, giá trị đơn, số ngày). Điền số hiện tại và số cần đạt cho từng thừa số, rồi ghi một câu về thừa số nào là chỗ khó nhất.',
        level: 'm',
      },
      {
        label: 'Viết lan can',
        text: 'Với mục tiêu chính, liệt kê năm cách bẩn có thể đạt số mà vẫn gây hại (giảm giá sâu, ép nhân sự làm thêm, bỏ kiểm tra chất lượng...). Chuyển ba cách nguy hiểm nhất thành ba lan can đo được và ghi cách theo dõi từng lan can.',
        level: 'm',
      },
      {
        label: 'Phỏng vấn ngược người sở hữu số',
        text: 'Hỏi người đang chịu trách nhiệm một chỉ số ba câu: anh chị lấy số này ở đâu, con số hôm nay là bao nhiêu, và mức nào thì anh chị coi là báo động. Ghi lại chỗ nào ba câu trả lời khớp hoặc lệch với hiểu biết của bạn.',
        level: 'm',
      },
      {
        label: 'Bảy ngày chốt một mục tiêu thật',
        text: 'Trong một tuần, dẫn nhóm đi từ một mong muốn chung chung tới một mục tiêu đủ năm phần: đo mức hiện tại, làm phép tính ngược, thống nhất lan can, chốt chủ sở hữu, và gửi bản một trang cho người ra quyết định để lấy xác nhận bằng văn bản.',
        level: 'h',
      },
      {
        label: 'Đối chiếu mục tiêu cũ với thực tế',
        text: 'Lấy bộ mục tiêu của kỳ trước. Với mỗi mục, ghi ba dòng: số cam kết, số thật, và nguyên nhân chênh lệch phân loại theo mục tiêu sai từ đầu, kế hoạch sai, hay thực thi sai. Tổng hợp thành một trang bài học và trình bày trong buổi lập mục tiêu kỳ tới.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao mục tiêu chỉ có đầu ra (số bài, số tính năng) lại nguy hiểm hơn là vô hại?',
        a: 'Vì nó tạo cảm giác kiểm soát giả: nhóm vẫn báo cáo hoàn thành đúng hạn trong khi kết quả thật không đổi. Nguy hiểm hơn, nó khoá nguồn lực vào việc sản xuất đầu ra và làm mất động lực đặt câu hỏi liệu đầu ra đó có tác dụng hay không.',
      },
      {
        q: 'Phép tính ngược dùng để làm gì, và khi nào nó buộc bạn phải sửa mục tiêu?',
        a: 'Nó quy mục tiêu về các thừa số vận hành hằng ngày để kiểm tính khả thi. Khi một thừa số đòi hỏi mức cao hơn nhiều lần kỷ lục từng đạt mà không có thay đổi nào về cách làm, đó là dấu hiệu phải hạ mục tiêu hoặc đổi hẳn phương án, ngay lúc lập kế hoạch chứ không phải giữa kỳ.',
      },
      {
        q: 'Một quản lý nói: mục tiêu của phòng là nâng cao chất lượng dịch vụ. Bạn hỏi lại như thế nào để câu đó dùng được?',
        a: 'Hỏi ba câu hẹp: chất lượng ở đây đo bằng chỉ số nào có sẵn số liệu, số hiện tại là bao nhiêu và đo trong khoảng thời gian nào, và tới ngày nào thì anh chị muốn thấy số đó bằng bao nhiêu. Nếu chưa có chỉ số nào, việc đầu tiên là chọn và đo, chứ chưa bàn giải pháp.',
      },
    ],
    plan7:
      'Ngày 1: chọn đúng một mục tiêu quan trọng nhất và viết nó ra bằng khuôn năm phần, chấp nhận còn ô trống. Ngày 2: đi tìm số hiện tại thật, ghi nguồn và cách tính. Ngày 3: làm phép tính ngược trên một trang giấy, đánh dấu thừa số khó nhất. Ngày 4: viết ba lan can và cách theo dõi. Ngày 5: gặp riêng người sẽ sở hữu chỉ số, thống nhất nhịp kiểm và ngưỡng báo động. Ngày 6: rà lại danh sách đầu ra và cắt những thứ không nối được vào chỉ số. Ngày 7: gửi bản một trang cho cấp trên hoặc khách hàng và xin xác nhận bằng văn bản.',
    evidence:
      'Giữ lại bản mục tiêu một trang có chữ ký hoặc email xác nhận, kèm ảnh chụp số ở thời điểm bắt đầu và số ở thời điểm kết thúc. Trong CV, mỗi gạch đầu dòng nên là một cặp trước-sau có mốc thời gian và quy mô đội. Trong phỏng vấn, chuẩn bị một câu chuyện 90 giây kể về lần bạn viết lại một mục tiêu mơ hồ thành mục tiêu đo được, nêu rõ phép tính ngược đã làm bạn đổi cách tiếp cận ra sao — đây là chi tiết mà người kể chuyện tô vẽ không bao giờ có.',
    references: [
      { label: 'What Matters — tài nguyên về OKR (John Doerr)', url: 'https://www.whatmatters.com/resources', type: 'article' },
    ],
  }),

  // ── Chương 2 · Chuyển mục tiêu thành kế hoạch ─────────────────────────────
  guide({
    thesis:
      'Kế hoạch không phải là danh sách việc phải làm; đó là một chuỗi lập luận có thể sai: nếu ta làm A thì B xảy ra, B dẫn tới C, và C tạo ra kết quả mong muốn. Giá trị của kế hoạch nằm ở chỗ nó phơi bày những giả định mà toàn bộ dự án đang treo lên, rồi sắp xếp công việc sao cho các giả định đắt tiền nhất được kiểm sớm nhất — chứ không nằm ở độ dày của tài liệu hay số dòng trong bảng tính.',
    why: {
      work:
        'Khi lãnh đạo hỏi "vì sao lại làm theo hướng này", một kế hoạch dạng chuỗi lập luận cho bạn câu trả lời trong 60 giây, còn một danh sách 80 đầu việc thì không trả lời được câu nào.',
      interview:
        'Người phỏng vấn thường đưa một mục tiêu mơ hồ và xem bạn dựng kế hoạch ra sao. Người dựng được ba đến năm kết quả trung gian và nêu được giả định nào nếu sai thì đổ cả kế hoạch sẽ nổi bật hơn hẳn người liệt kê đầu việc.',
      study:
        'Kế hoạch ôn thi thường hỏng vì được viết theo chương sách chứ không theo năng lực cần đạt. Đặt kết quả trung gian ("làm được dạng bài tích phân từng phần trong 6 phút") giúp bạn biết khi nào được phép rời một chủ đề.',
      life:
        'Với việc lớn của cá nhân như mua nhà hay chuyển nghề, phần khó không phải liệt kê việc mà là nhận ra giả định nền — về thu nhập, về thời gian, về sự đồng thuận trong gia đình — và tìm cách kiểm nó trước khi tiêu tiền.',
    },
    framework: [
      {
        name: 'Vẽ chuỗi kết quả',
        detail:
          'Từ mục tiêu cuối, đi ngược lại ba đến năm kết quả trung gian, mỗi cái là một trạng thái quan sát được chứ không phải một hoạt động. Ví dụ "có 40 khách hàng thử dùng bản mẫu và 12 người quay lại tuần thứ hai" là trạng thái; "chạy chương trình dùng thử" là hoạt động.',
      },
      {
        name: 'Nêu giả định quyết định',
        detail:
          'Với mỗi mắt xích, viết câu "điều này chỉ đúng nếu...". Rồi chấm hai điểm cho mỗi giả định: mức chắc chắn và mức thiệt hại nếu sai. Những giả định vừa không chắc vừa đắt là thứ quyết định thứ tự công việc.',
      },
      {
        name: 'So sánh ít nhất hai đường đi',
        detail:
          'Không bao giờ trình bày một phương án duy nhất. Với mỗi đường đi, ước lượng thời gian, chi phí, rủi ro chính và thứ bạn phải từ bỏ. Việc đặt cạnh nhau làm lộ ra rằng nhiều khi phương án rẻ hơn chỉ chậm hơn hai tuần.',
      },
      {
        name: 'Xếp lịch quanh việc kiểm giả định',
        detail:
          'Đưa các phép kiểm rẻ và nhanh lên đầu, ngay cả khi trực giác nói nên làm phần dễ trước. Mục tiêu của bốn tuần đầu không phải hoàn thành nhiều nhất, mà là biết sớm nhất liệu kế hoạch có sai nền hay không.',
      },
      {
        name: 'Chốt mốc quyết định',
        detail:
          'Mỗi mốc phải kèm một câu hỏi và ba lựa chọn định sẵn: tiếp tục, đổi hướng, dừng. Mốc không có quyền quyết định thì chỉ là ngày báo cáo, và dự án sẽ trôi bằng quán tính.',
      },
    ],
    scenario:
      'Một trung tâm tiếng Anh ở Đà Nẵng đặt mục tiêu tuyển thêm 120 học viên trong quý. Bản kế hoạch đầu tiên là danh sách 60 đầu việc quảng cáo. Người phụ trách viết lại theo chuỗi kết quả và phát hiện toàn bộ kế hoạch treo lên một giả định chưa ai kiểm: khoảng 60% học viên mới sẽ đến từ giới thiệu của học viên cũ. Thay vì chi tiền quảng cáo tuần đầu, nhóm dành ba ngày gọi 40 học viên cũ và hỏi một câu hẹp: nếu có bạn hỏi chỗ học, anh chị có giới thiệu trung tâm không, và vì sao. Chỉ 5 người trả lời sẵn sàng, phần lớn ngần ngại vì lớp đông và giáo viên đổi liên tục. Giả định nền sai, nên kế hoạch được viết lại: quý này ưu tiên giữ giáo viên và giảm sĩ số lớp, mục tiêu tuyển hạ xuống 70 học viên, phần ngân sách quảng cáo cắt một nửa chuyển sang lương giáo viên. Kết quả cuối quý là 78 học viên và tỷ lệ tái đăng ký tăng — thấp hơn tham vọng ban đầu nhưng không đốt tiền vào một cái phễu thủng.',
    comparison: [
      {
        weak: 'Kế hoạch là bảng 80 dòng công việc sắp theo thứ tự thời gian, không nói được vì sao dòng này đứng trước dòng kia.',
        mature:
          'Kế hoạch mở đầu bằng một trang chuỗi kết quả, phần bảng công việc chỉ là phụ lục triển khai của trang đó.',
      },
      {
        weak: 'Trình một phương án duy nhất cho cấp trên, kèm ngụ ý rằng không còn cách nào khác.',
        mature:
          'Trình hai đến ba phương án có so sánh thời gian, chi phí, rủi ro, kèm khuyến nghị rõ ràng của bạn và lý do — người quyết định vẫn thấy được không gian lựa chọn.',
      },
      {
        weak: 'Xếp việc dễ và quen tay lên đầu để nhóm có cảm giác tiến độ, đẩy phần bất định về cuối.',
        mature:
          'Xếp phép kiểm rẻ cho giả định đắt lên đầu, chấp nhận vài tuần đầu trông ít thành quả để đổi lấy khả năng đổi hướng khi còn kịp.',
      },
    ],
    mistakes: [
      'Nhầm độ chi tiết với độ chắc chắn: dành hai tuần làm một bảng kế hoạch 300 dòng cho một dự án mà giả định gốc còn chưa kiểm, rồi bảo vệ bảng đó vì đã tốn công làm ra nó.',
      'Viết kế hoạch bằng ngôn ngữ hoạt động nên không có mốc nào có thể trả lời sai đúng; mọi cuộc họp tiến độ biến thành báo cáo bận rộn thay vì kiểm chứng lập luận.',
      'Coi kế hoạch là cam kết bất biến với cấp trên, nên khi dữ liệu mới cho thấy hướng đi hỏng thì nhóm giấu và chạy tiếp cho hết quý, vì đổi hướng bị xem là thừa nhận thất bại.',
    ],
    worksheet: [
      'Viết mục tiêu cuối của bạn, rồi đi ngược ba đến năm kết quả trung gian dưới dạng trạng thái quan sát được, không dùng động từ hoạt động.',
      'Với mỗi mắt xích, câu "điều này chỉ đúng nếu..." của bạn là gì? Gạch chân giả định mà bạn ít chắc chắn nhất.',
      'Nếu giả định gạch chân đó sai, dự án mất bao nhiêu tiền và bao nhiêu tuần? Trả lời bằng con số ước lượng, không bằng tính từ.',
      'Phép kiểm rẻ nhất cho giả định đó là gì, làm trong bao lâu, cần ai giúp, và kết quả thế nào thì bạn coi là giả định sai?',
      'Ba mốc quyết định của kế hoạch nằm ở ngày nào, mỗi mốc trả lời câu hỏi gì, và ba lựa chọn tại mốc đó là gì?',
    ],
    exercises: [
      {
        label: 'Đi ngược từ kết quả',
        text: 'Lấy một mục tiêu đang theo đuổi. Trên giấy, viết ô kết quả cuối ở bên phải rồi lùi dần sang trái ba ô trạng thái trung gian. Kiểm lại bằng câu hỏi: nếu ba ô trái đều đúng thì ô phải có bắt buộc xảy ra không?',
        level: 'e',
      },
      {
        label: 'Danh mục giả định',
        text: 'Liệt kê 10 giả định mà kế hoạch hiện tại đang dựa vào, gồm cả giả định về người (ai sẽ rảnh), về ngoại cảnh (giá nguyên liệu, mùa vụ) và về khách hàng. Chấm mỗi giả định hai điểm từ 1 đến 5: độ chắc chắn và thiệt hại nếu sai.',
        level: 'e',
      },
      {
        label: 'Hai đường đi',
        text: 'Viết phương án thứ hai cho dự án của bạn, cố ý theo triết lý ngược với phương án hiện tại (rẻ và chậm so với nhanh và đắt). Lập bảng bốn dòng so sánh: thời gian, chi phí, rủi ro lớn nhất, thứ phải từ bỏ.',
        level: 'm',
      },
      {
        label: 'Phép kiểm bốn ngày',
        text: 'Chọn giả định vừa không chắc vừa đắt nhất và thiết kế một phép kiểm hoàn thành trong bốn ngày với chi phí dưới một phần mười ngân sách. Viết trước tiêu chí: kết quả nào coi là ủng hộ, kết quả nào coi là bác bỏ.',
        level: 'm',
      },
      {
        label: 'Mốc có quyền dừng',
        text: 'Chọn một mốc trong kế hoạch và viết lại thành mốc quyết định: câu hỏi cần trả lời, dữ liệu sẽ có vào lúc đó, và ba hành động định sẵn. Gửi cho người có thẩm quyền để họ biết trước rằng ngày đó có thể phải dừng.',
        level: 'm',
      },
      {
        label: 'Kế hoạch một trang',
        text: 'Nén toàn bộ kế hoạch vào một trang A4 gồm bốn khối: mục tiêu đo được, chuỗi kết quả, ba giả định lớn kèm cách kiểm, và ba mốc quyết định. Đưa cho một người ngoài dự án đọc trong 3 phút rồi nhờ họ kể lại; chỗ họ kể sai là chỗ bạn viết chưa rõ.',
        level: 'h',
      },
      {
        label: 'Diễn tập đổi hướng',
        text: 'Giả sử tại mốc đầu tiên dữ liệu bác bỏ giả định chính. Viết trước kịch bản đổi hướng: phần việc nào dừng, người nào chuyển sang đâu, chi phí đã tiêu coi là mất bao nhiêu, và thông điệp gửi các bên liên quan gồm những câu nào.',
        level: 'h',
      },
      {
        label: 'Khám nghiệm kế hoạch cũ',
        text: 'Lấy một kế hoạch bạn từng thực hiện xong. Đối chiếu chuỗi lập luận ban đầu với chuyện thật đã xảy ra, chỉ ra mắt xích nào đứt trước tiên và lẽ ra phép kiểm nào sẽ phát hiện nó sớm hơn ít nhất một tháng. Viết một trang bài học và áp ngay vào kế hoạch đang chạy.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Khác biệt cốt lõi giữa kết quả trung gian và hoạt động là gì, và vì sao nó quan trọng khi lập kế hoạch?',
        a: 'Kết quả trung gian là một trạng thái có thể quan sát và xác nhận đúng sai, còn hoạt động chỉ mô tả việc mình bận. Nếu kế hoạch chỉ có hoạt động, không mốc nào có thể chứng minh là lập luận đã sai, nên dự án cứ chạy tiếp cho tới khi hết tiền hoặc hết hạn.',
      },
      {
        q: 'Vì sao nên xếp việc kiểm giả định lên trước, dù nó làm mấy tuần đầu trông ít thành quả?',
        a: 'Vì chi phí của việc đổi hướng tăng theo thời gian và theo số tiền đã tiêu. Kiểm sớm mua cho bạn quyền chọn lại khi mọi lựa chọn còn rẻ; kiểm muộn chỉ còn giá trị giải thích thất bại.',
      },
      {
        q: 'Cấp trên yêu cầu một bản kế hoạch chi tiết đến từng tuần cho dự án kéo dài chín tháng có nhiều bất định. Bạn xử lý thế nào?',
        a: 'Đề xuất chi tiết theo tầng: sáu đến tám tuần đầu chi tiết tới cấp tuần vì đã đủ thông tin, phần còn lại giữ ở mức mốc và khoảng ước lượng, kèm cam kết làm mịn dần sau mỗi mốc quyết định. Trình bày rõ rằng chi tiết giả tạo cho tháng thứ bảy không làm giảm rủi ro mà chỉ tạo cảm giác an tâm sai.',
      },
    ],
    plan7:
      'Ngày 1: viết chuỗi kết quả từ mục tiêu đi ngược, tối đa năm ô. Ngày 2: liệt kê 10 giả định và chấm hai điểm cho mỗi cái. Ngày 3: dựng phương án thứ hai theo triết lý ngược và lập bảng so sánh bốn dòng. Ngày 4: thiết kế phép kiểm bốn ngày cho giả định đắt nhất, ghi trước tiêu chí bác bỏ. Ngày 5: chạy phép kiểm, chỉ thu dữ liệu, không kết luận sớm. Ngày 6: đọc dữ liệu và cập nhật chuỗi kết quả. Ngày 7: viết kế hoạch một trang cùng ba mốc quyết định và gửi xin xác nhận.',
    evidence:
      'Bằng chứng mạnh nhất cho kỹ năng này là hai phiên bản kế hoạch đặt cạnh nhau: bản đầu và bản sau khi một giả định bị dữ liệu bác bỏ, kèm ghi chú ngày và dữ liệu đã làm bạn đổi ý. Trong portfolio, một trang kế hoạch có khối giả định và mốc quyết định gây ấn tượng hơn nhiều so với ảnh chụp bảng Gantt. Trong phỏng vấn, dùng nó để trả lời câu "kể về lần bạn phải thay đổi hướng đi giữa dự án" — nhấn vào việc bạn đã thiết kế sẵn điểm dừng chứ không phải bị hoàn cảnh ép dừng.',
    references: [
      { label: 'Atlassian — hướng dẫn quản lý dự án theo hướng Agile', url: 'https://www.atlassian.com/agile/project-management', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Project Management', url: 'https://hbr.org/topic/subject/project-management', type: 'article' },
    ],
  }),

  // ── Chương 3 · Xác định phạm vi — Scope Management ────────────────────────
  guide({
    thesis:
      'Phạm vi là đường biên được viết thành văn, gồm hai nửa bắt buộc: danh sách những gì dự án sẽ giao và danh sách những gì dự án không giao. Phần lớn tranh chấp cuối dự án không sinh ra từ nửa thứ nhất mà từ nửa thứ hai bị bỏ trống, vì mỗi bên tự điền vào khoảng trống đó bằng kỳ vọng riêng, và cả hai đều tin rằng mình đang nói điều hiển nhiên.',
    why: {
      work:
        'Không có phạm vi viết ra, mọi yêu cầu thêm đều trở thành thử thách về quan hệ: từ chối thì mang tiếng khó tính, đồng ý thì tự lấy thời gian và tiền của mình bù vào.',
      interview:
        'Nhà tuyển dụng hay hỏi cách bạn xử lý khách hàng liên tục đòi thêm. Câu trả lời tốt bắt đầu từ tài liệu phạm vi và tiêu chí nghiệm thu chứ không phải từ mẹo giao tiếp mềm mỏng.',
      study:
        'Làm đồ án hoặc luận văn hỏng nhiều nhất ở chỗ đề tài phình ra theo từng buổi gặp giảng viên. Một trang giới hạn phạm vi được duyệt sớm giúp bạn bảo vệ được thời gian và cũng bảo vệ được chất lượng phần lõi.',
      life:
        'Sửa nhà, tổ chức đám cưới, đi du lịch nhóm — cùng một cơ chế: khi không ai viết ra cái gì nằm ngoài gói, chi phí và mâu thuẫn đều nở ra theo cấp số cộng của những lần thêm chút nữa.',
    },
    framework: [
      {
        name: 'Chốt kết quả cần đạt',
        detail:
          'Viết một đoạn về tình trạng sau khi dự án xong, dưới góc nhìn người sử dụng. Đây là chỗ neo cho mọi tranh luận sau này: một yêu cầu mới được đánh giá bằng câu hỏi nó có phục vụ đoạn mô tả này không.',
      },
      {
        name: 'Liệt kê sản phẩm bàn giao',
        detail:
          'Chuyển kết quả thành danh sách vật thể hoặc dịch vụ cụ thể có thể chỉ tay vào: bản vẽ, thiết bị lắp đặt, tài khoản bàn giao, buổi đào tạo, tài liệu hướng dẫn. Mỗi mục có một dòng mô tả số lượng và mức hoàn thiện.',
      },
      {
        name: 'Viết tiêu chí nghiệm thu',
        detail:
          'Với mỗi sản phẩm bàn giao, ghi điều kiện để được coi là xong, đo được bằng quan sát hoặc phép thử. Không có tiêu chí thì nghiệm thu biến thành cuộc thương lượng cảm tính vào đúng lúc cả hai bên đều mệt.',
      },
      {
        name: 'Viết danh sách không bao gồm',
        detail:
          'Ghi thẳng những hạng mục người ta hay mặc định là có: hạ tầng liên quan, giấy phép, chuyển dữ liệu cũ, bảo trì sau bàn giao, chỉnh sửa không giới hạn. Danh sách này là phần đắt giá nhất của tài liệu phạm vi.',
      },
      {
        name: 'Định trước đường đi cho yêu cầu mới',
        detail:
          'Nêu rõ: yêu cầu mới gửi cho ai, được đánh giá tác động trong bao lâu, và chỉ được thực hiện sau khi có xác nhận về thời gian, chi phí. Nói trước quy trình khi quan hệ còn tốt dễ hơn nhiều so với nói lúc đang căng.',
      },
    ],
    scenario:
      'Một công ty thiết kế nội thất nhận cải tạo văn phòng 300 mét vuông. Ở dự án trước, họ lỗ vì khách xin thêm liên tục, nên lần này bản hợp đồng có phụ lục phạm vi hai trang, trong đó riêng phần không bao gồm có 12 dòng: hệ thống phòng cháy chữa cháy, xin phép ban quản lý toà nhà, đường điện từ tủ tổng tới tầng, di chuyển máy chủ, và thay đổi bố cục sau khi đã duyệt bản vẽ 3D. Tuần thứ năm, khách yêu cầu thêm một phòng pantry và dời hai vách kính. Thay vì từ chối hay im lặng làm, quản lý dự án gửi trong 48 giờ một phiếu đánh giá tác động: chi phí phát sinh, số ngày kéo dài, và hệ quả là hạng mục trần sẽ lùi sau ngày khai trương dự kiến. Khách chọn làm pantry, bỏ phần vách kính. Dự án kết thúc chậm sáu ngày so với hợp đồng gốc nhưng đúng theo mốc đã ký lại, và biên lợi nhuận giữ nguyên. Điều quan trọng là cuộc trao đổi diễn ra quanh một tờ giấy, không quanh câu hỏi ai đang gây khó cho ai.',
    comparison: [
      {
        weak: 'Chỉ ghi những gì sẽ làm, coi mọi thứ không ghi là hiển nhiên nằm ngoài; đến lúc nghiệm thu thì mỗi bên hiểu chữ hiển nhiên một kiểu.',
        mature:
          'Ghi cả hai nửa và đọc to phần không bao gồm trong buổi ký kết, để sự khó chịu nếu có xảy ra ngay lúc đầu thay vì vào ngày bàn giao.',
      },
      {
        weak: 'Đồng ý các yêu cầu nhỏ vì mỗi cái chỉ tốn nửa ngày, không ghi lại, và ngạc nhiên khi tổng cộng chúng ăn hết ba tuần.',
        mature:
          'Ghi mọi yêu cầu vào một nhật ký, kể cả khi quyết định làm miễn phí, để cuối kỳ có thể chỉ ra tổng khối lượng đã tặng thêm bằng số ngày công.',
      },
      {
        weak: 'Nghiệm thu bằng câu hỏi anh chị thấy ổn chưa, phụ thuộc vào tâm trạng và độ mệt của người duyệt.',
        mature:
          'Nghiệm thu bằng bảng tiêu chí đã ký từ đầu, đi từng dòng, ghi rõ dòng nào đạt, dòng nào cần sửa và sửa trong bao lâu.',
      },
    ],
    mistakes: [
      'Viết tiêu chí nghiệm thu bằng tính từ như đẹp, mượt, chuyên nghiệp, thân thiện — những chữ không ai chứng minh được là đạt hay không đạt, nên chúng luôn nghiêng về phía người trả tiền.',
      'Nghĩ rằng bàn về phần không bao gồm sẽ làm khách mất thiện cảm, nên bỏ qua để ký cho nhanh, rồi trả giá bằng vài tuần làm không công và một quan hệ xấu đi hẳn.',
      'Để phạm vi nằm rải rác trong hàng chục email và tin nhắn thay vì một tài liệu có phiên bản, khiến mỗi lần tranh luận đều phải đi tìm bằng chứng và không bên nào tin bên nào.',
    ],
    worksheet: [
      'Viết một đoạn năm câu mô tả tình trạng sau khi dự án xong dưới góc nhìn người sử dụng cuối, không dùng thuật ngữ nội bộ.',
      'Liệt kê toàn bộ sản phẩm bàn giao kèm số lượng và mức hoàn thiện; đánh dấu mục nào bạn chưa dám cam kết và ghi lý do.',
      'Với ba sản phẩm bàn giao quan trọng nhất, tiêu chí nghiệm thu đo được của bạn là gì? Viết dưới dạng phép thử ai cũng làm được.',
      'Liệt kê 10 thứ mà bên kia có thể mặc định là có trong gói nhưng bạn không định làm. Sắp theo mức thiệt hại nếu hiểu nhầm.',
      'Yêu cầu mới sẽ đi qua ai, được đánh giá trong bao nhiêu giờ, và cần chữ ký của ai trước khi nhóm bắt tay làm?',
    ],
    exercises: [
      {
        label: 'Hai cột biên giới',
        text: 'Với dự án đang làm, kẻ hai cột bao gồm và không bao gồm, mỗi cột tối thiểu tám dòng. Đưa cho một đồng nghiệp chưa biết dự án đọc và nhờ họ chỉ ra dòng nào còn có thể hiểu hai nghĩa.',
        level: 'e',
      },
      {
        label: 'Dịch tính từ thành phép thử',
        text: 'Thu thập năm tiêu chí đang viết bằng tính từ trong tài liệu hiện có. Với mỗi cái, viết lại thành một phép thử có số hoặc có thao tác quan sát được, ví dụ trang chủ tải xong dưới ba giây trên mạng 4G ở máy Android tầm trung.',
        level: 'e',
      },
      {
        label: 'Nhật ký yêu cầu thêm',
        text: 'Mở một bảng ghi mọi yêu cầu phát sinh trong hai tuần: ngày, người đề nghị, nội dung, ước lượng công, quyết định. Cuối kỳ tính tổng số ngày công đã tặng thêm và trình bày con số đó trong cuộc họp nội bộ.',
        level: 'e',
      },
      {
        label: 'Phiếu đánh giá tác động',
        text: 'Thiết kế biểu mẫu một trang cho yêu cầu mới gồm sáu ô: mô tả, lý do, tác động thời gian, tác động chi phí, hạng mục bị đẩy lùi, và ba lựa chọn cho người duyệt. Dùng thử ngay với yêu cầu phát sinh gần nhất.',
        level: 'm',
      },
      {
        label: 'Duyệt phạm vi cùng bên kia',
        text: 'Tổ chức một buổi 45 phút đọc to phần không bao gồm với khách hàng hoặc phòng ban đặt hàng. Ghi lại những dòng khiến họ ngạc nhiên — đó chính là những chỗ suýt trở thành tranh chấp cuối dự án.',
        level: 'm',
      },
      {
        label: 'Ma trận truy vết yêu cầu',
        text: 'Lập bảng nối từng yêu cầu gốc tới sản phẩm bàn giao, tiêu chí nghiệm thu và người xác nhận. Tìm những yêu cầu không nối được vào sản phẩm nào, hoặc sản phẩm không phục vụ yêu cầu nào, và xử lý cả hai loại.',
        level: 'h',
      },
      {
        label: 'Diễn tập nghiệm thu sớm',
        text: 'Ở giữa dự án, tổ chức một buổi nghiệm thu thử theo đúng bảng tiêu chí, dù sản phẩm mới hoàn thành một phần. Mục tiêu là phát hiện tiêu chí nào không đo được trong thực tế, khi vẫn còn thời gian sửa lại tiêu chí.',
        level: 'h',
      },
      {
        label: 'Giải phẫu một vụ tranh chấp cũ',
        text: 'Chọn một dự án từng cãi nhau lúc bàn giao. Tìm lại các văn bản và xác định chính xác câu nào, hoặc khoảng trống nào, đã cho phép hai cách hiểu. Viết lại đoạn đó thành phiên bản không thể hiểu hai nghĩa và đưa vào mẫu hợp đồng của nhóm.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao danh sách không bao gồm lại quan trọng hơn danh sách bao gồm trong nhiều dự án dịch vụ?',
        a: 'Vì phần bao gồm thường được hai bên bàn kỹ và ghi rõ, còn phần còn lại được mỗi bên tự điền bằng kỳ vọng riêng mà không ai phát hiện sự khác biệt cho tới lúc bàn giao. Viết ra danh sách không bao gồm chính là chuyển xung đột từ cuối dự án về đầu dự án, nơi nó rẻ hơn nhiều.',
      },
      {
        q: 'Khách hàng nói yêu cầu mới rất nhỏ, chỉ nửa ngày là xong. Cách phản hồi chuyên nghiệp là gì?',
        a: 'Không tranh cãi về độ lớn, mà đưa nó qua đúng quy trình đã thoả thuận: ghi nhận, đánh giá tác động trong thời hạn đã cam kết, trả lời bằng ba con số là công, tiền và hạng mục nào bị lùi. Nhiều yêu cầu nửa ngày cộng lại mới là vấn đề, và chỉ nhật ký mới cho thấy được điều đó.',
      },
      {
        q: 'Tiêu chí nghiệm thu tốt khác tiêu chí kém ở điểm nào?',
        a: 'Tiêu chí tốt có thể được kiểm bởi một người thứ ba không tham gia dự án và cho ra cùng một kết luận. Nó nêu phép thử, điều kiện và ngưỡng; tiêu chí kém dựa vào cảm nhận nên kết quả phụ thuộc vào người duyệt và thời điểm duyệt.',
      },
    ],
    plan7:
      'Ngày 1: viết đoạn mô tả tình trạng sau dự án dưới góc nhìn người dùng. Ngày 2: liệt kê sản phẩm bàn giao kèm số lượng, mức hoàn thiện. Ngày 3: viết tiêu chí nghiệm thu đo được cho ba sản phẩm quan trọng nhất. Ngày 4: soạn danh sách 10 dòng không bao gồm. Ngày 5: thiết kế phiếu đánh giá tác động một trang. Ngày 6: họp 45 phút với bên đặt hàng, đọc to phần không bao gồm và ghi lại phản ứng. Ngày 7: chốt phiên bản 1.0 của tài liệu phạm vi, gửi kèm ngày hiệu lực và quy trình cho yêu cầu mới.',
    evidence:
      'Giữ lại một tài liệu phạm vi thật đã được ký, đã che thông tin nhạy cảm, trong đó thấy rõ ba khối: sản phẩm bàn giao, tiêu chí nghiệm thu đo được và danh sách không bao gồm. Kèm theo một phiếu đánh giá tác động đã dùng thật cùng quyết định cuối cùng của khách. Trong phỏng vấn, đây là vật chứng cho câu hỏi về quản lý kỳ vọng: bạn kể được rằng dự án vẫn nhận thay đổi, nhưng mỗi thay đổi đều đi kèm một con số và một chữ ký, nên không ai phải làm không công trong im lặng.',
    references: [
      { label: 'Project Management Institute (PMI) — trang chính thức', url: 'https://www.pmi.org/', type: 'article' },
      { label: 'Atlassian — thư viện hướng dẫn về Agile và quản lý công việc', url: 'https://www.atlassian.com/agile', type: 'article' },
    ],
  }),

  // ── Chương 4 · Phân rã công việc — Work Breakdown Structure ───────────────
  guide({
    thesis:
      'Cấu trúc phân rã công việc là phép chia phạm vi thành các gói nhỏ dần theo sản phẩm cần giao, chứ không phải theo trình tự thời gian hay theo phòng ban. Nó tuân thủ một quy tắc duy nhất và nghiêm khắc: các nhánh con cộng lại phải bằng đúng nhánh cha, không thiếu và không thừa. Mỗi gói lá phải nhỏ đủ để một người ước lượng được, có một chủ sở hữu, và có dấu hiệu xong rõ ràng.',
    why: {
      work:
        'Ước lượng cho một khối lớn luôn sai theo hướng lạc quan; ước lượng cho các gói nhỏ có sai số bù trừ nhau và quan trọng hơn là làm lộ ra những phần việc mà nếu nhìn tổng thể bạn sẽ quên mất.',
      interview:
        'Bài kiểm tra thường gặp cho vị trí quản lý dự án là đưa một yêu cầu lớn và yêu cầu phân rã trong 20 phút. Người phân rã theo sản phẩm bàn giao và giữ được quy tắc cộng đủ 100% thấy rõ khác hẳn người liệt kê việc theo cảm hứng.',
      study:
        'Phân rã một môn học thành các năng lực cần đạt kèm bài kiểm tự tạo cho từng năng lực giúp bạn biết mình còn nợ phần nào, thay vì học lại từ đầu mỗi lần thấy lo.',
      life:
        'Chuẩn bị một đám cưới hay một chuyến đi dài ngày cũng vậy: cây phân rã theo hạng mục cho thấy ai lo phần nào, và làm hiện ra những hạng mục mà không ai nghĩ tới cho tới sát ngày.',
    },
    framework: [
      {
        name: 'Đặt sản phẩm cuối lên gốc cây',
        detail:
          'Gốc cây là kết quả cuối cùng của dự án, viết bằng danh từ chứ không phải động từ. Cách đặt tên này giữ cho mọi nhánh phía dưới trả lời câu hỏi giao cái gì, thay vì trả lời câu hỏi làm việc gì.',
      },
      {
        name: 'Chia theo sản phẩm, không chia theo phòng ban',
        detail:
          'Tầng hai nên là các cấu phần của sản phẩm hoặc các hạng mục bàn giao lớn. Chia theo phòng ban dẫn tới việc bỏ sót đúng những khoảng nối giữa hai phòng, và đó luôn là nơi dự án chậm.',
      },
      {
        name: 'Giữ quy tắc cộng đủ',
        detail:
          'Sau mỗi lần chia, đọc lại các nhánh con và hỏi: cộng chúng lại có ra đủ nhánh cha không, và có nhánh nào lẽ ra thuộc chỗ khác không. Việc kiểm này bắt được các khoảng trống như nghiệm thu, đào tạo người dùng, hay dọn dẹp dữ liệu cũ.',
      },
      {
        name: 'Dừng ở mức ước lượng được',
        detail:
          'Chia tới khi mỗi gói lá đủ nhỏ để ước lượng trong khoảng vài ngày làm việc và giao được cho một người chịu trách nhiệm. Chia nhỏ hơn nữa chỉ tạo chi phí quản lý mà không tăng độ chính xác.',
      },
      {
        name: 'Viết định nghĩa xong cho mỗi gói lá',
        detail:
          'Một dòng cho biết khi nào gói được coi là hoàn thành: có bản gì, ai xác nhận, thử bằng cách nào. Không có dòng này, một gói có thể ở trạng thái gần xong suốt ba tuần liền.',
      },
    ],
    scenario:
      'Một nhóm bốn người sản xuất khoá học trực tuyến gồm 40 bài cho một trung tâm đào tạo. Kế hoạch ban đầu chỉ có ba dòng: quay video, dựng hậu kỳ, đưa lên hệ thống. Sau sáu tuần họ nhận ra tiến độ đứng yên ở 30% dù ai cũng bận. Nhóm dựng lại cây phân rã với gốc là khoá học hoàn chỉnh, tầng hai gồm sáu nhánh: kịch bản, tài sản hình ảnh, video quay, hậu kỳ, bài tập và ngân hàng câu hỏi, trang khoá học trên hệ thống. Ngay khi vẽ tới nhánh thứ năm, họ phát hiện chưa ai nhận việc soạn 240 câu hỏi trắc nghiệm và cũng chưa ai nhận việc kiểm tra bản quyền hình ảnh — hai hạng mục cộng lại nặng hơn cả phần dựng hậu kỳ. Cây được chia tới mức gói lá khoảng ba đến năm ngày công, mỗi gói có một tên người và một dòng định nghĩa xong. Ước lượng lại cho ra 19 tuần thay vì 12 tuần như hứa ban đầu; nhóm thương lượng phát hành theo hai đợt, đợt một 20 bài đúng hạn cũ. Điều cứu dự án không phải làm nhanh hơn, mà là nhìn thấy toàn bộ khối lượng thật trước khi hứa lần thứ hai.',
    comparison: [
      {
        weak: 'Phân rã theo giai đoạn thời gian: tháng 1 làm gì, tháng 2 làm gì — nên không biết được tổng khối lượng và không phát hiện phần bỏ sót.',
        mature:
          'Phân rã theo sản phẩm bàn giao trước, xếp lịch sau; nhờ vậy nếu lịch phải đổi thì cây công việc vẫn còn nguyên giá trị.',
      },
      {
        weak: 'Gói lá kiểu "xây dựng hệ thống" hoặc "làm nội dung" — quá lớn nên ước lượng chỉ là con số cảm tính và tiến độ báo cáo luôn quanh quẩn ở 80%.',
        mature:
          'Gói lá cỡ vài ngày công, có định nghĩa xong rõ ràng, nên trạng thái chỉ có hai giá trị là chưa xong hoặc xong, không có vùng xám kéo dài.',
      },
      {
        weak: 'Bỏ qua các hạng mục không hào nhoáng: nghiệm thu, đào tạo, chuyển dữ liệu, viết tài liệu, dọn dẹp môi trường — rồi chúng nuốt mất tháng cuối.',
        mature:
          'Coi các hạng mục đó là nhánh chính thức trên cây và ước lượng đàng hoàng, vì đó là phần thường quyết định dự án về đích được hay không.',
      },
    ],
    mistakes: [
      'Trộn công việc với sản phẩm trong cùng một tầng, ví dụ đặt cạnh nhau nhánh giao diện người dùng và nhánh họp hằng tuần, khiến cây mất khả năng kiểm tra quy tắc cộng đủ.',
      'Chia quá sâu tới mức mỗi gói chỉ một hai giờ, làm chi phí cập nhật trạng thái lớn hơn giá trị thông tin thu được, và nhóm bỏ cập nhật sau tuần thứ hai.',
      'Xây cây một mình rồi công bố cho nhóm, nên những người thật sự làm việc không có cơ hội chỉ ra hạng mục bị thiếu, và họ cũng không thấy mình có trách nhiệm với con số ước lượng.',
    ],
    worksheet: [
      'Gốc cây của bạn viết bằng danh từ là gì, và ai là người xác nhận rằng gốc đó đã hoàn thành?',
      'Sáu nhánh tầng hai của bạn là gì? Kiểm quy tắc cộng đủ bằng cách hỏi: nếu sáu nhánh này xong hết thì còn thiếu gì để bàn giao được?',
      'Những hạng mục ít hào nhoáng nào đang chưa có mặt trên cây: nghiệm thu, đào tạo, tài liệu, chuyển dữ liệu, bản quyền, dọn dẹp?',
      'Gói lá lớn nhất của bạn ước lượng bao nhiêu ngày công? Nếu vượt năm ngày, hãy chia tiếp và ghi lại lý do trước đó nó bị gộp.',
      'Với ba gói lá quan trọng nhất, dòng định nghĩa xong của bạn viết ra sao, và ai là người ký xác nhận?',
    ],
    exercises: [
      {
        label: 'Cây ba tầng trên giấy dán',
        text: 'Dùng giấy dán tường, xây cây ba tầng cho dự án đang chạy trong 40 phút. Quy tắc: mỗi tờ giấy là một danh từ sản phẩm, không được viết động từ. Chụp ảnh lại làm bản gốc để đối chiếu về sau.',
        level: 'e',
      },
      {
        label: 'Săn hạng mục bị bỏ quên',
        text: 'Đọc lại cây và cố ý đi tìm sáu loại việc hay bị quên: nghiệm thu, đào tạo người dùng, viết tài liệu, chuyển dữ liệu cũ, giấy phép và pháp lý, dọn dẹp sau bàn giao. Bổ sung mọi thứ còn thiếu và ghi ước lượng thô.',
        level: 'e',
      },
      {
        label: 'Kiểm quy tắc cộng đủ',
        text: 'Chọn ba nhánh bất kỳ và với mỗi nhánh hỏi hai câu: các con cộng lại có đủ cha chưa, và có con nào thuộc về nhánh khác không. Ghi lại số lỗi tìm được, đây là thước đo chất lượng cây của bạn.',
        level: 'm',
      },
      {
        label: 'Định nghĩa xong cho gói lá',
        text: 'Viết dòng định nghĩa xong cho 10 gói lá, mỗi dòng phải nêu bằng chứng và người xác nhận. Sau đó nhờ một thành viên khác đọc và đánh dấu dòng nào họ vẫn có thể hiểu khác đi.',
        level: 'm',
      },
      {
        label: 'Phân rã cùng nhóm',
        text: 'Tổ chức buổi phân rã 90 phút với tất cả những người sẽ thực hiện. Bạn chỉ điều phối và ghi chép, không đề xuất nội dung. Cuối buổi, đếm số hạng mục do người khác nêu ra mà bản nháp của bạn không có.',
        level: 'm',
      },
      {
        label: 'Từ cây sang bảng công việc',
        text: 'Chuyển toàn bộ gói lá thành danh sách công việc trong công cụ nhóm đang dùng, giữ nguyên mã số nhánh để truy vết ngược lên cây. Kiểm ngẫu nhiên 10 công việc xem có công việc nào không thuộc gói lá nào không.',
        level: 'h',
      },
      {
        label: 'Ước lượng theo gói và so với tổng thể',
        text: 'Ước lượng độc lập hai lần: một lần đoán tổng thời gian cả dự án, một lần cộng dồn từ các gói lá. Ghi lại chênh lệch giữa hai con số và viết một đoạn phân tích vì sao chúng lệch nhau.',
        level: 'h',
      },
      {
        label: 'Đối chiếu cây với thực tế sau bốn tuần',
        text: 'Sau bốn tuần thực hiện, đánh dấu lên cây những gói phát sinh không có trong bản gốc và những gói hoá ra không cần thiết. Tính tỷ lệ phần trăm khối lượng phát sinh và dùng nó làm hệ số dự phòng cho dự án tiếp theo.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Quy tắc cộng đủ trong phân rã công việc nói gì và nó giúp phát hiện loại lỗi nào?',
        a: 'Nó nói rằng các nhánh con cộng lại phải đúng bằng nhánh cha, không thiếu không thừa. Áp dụng nó buộc bạn rà lại từng tầng và thường làm lộ ra hai lỗi: hạng mục bị bỏ quên như nghiệm thu, đào tạo, và hạng mục bị đặt nhầm nhánh nên sau này không ai nhận trách nhiệm.',
      },
      {
        q: 'Vì sao không nên phân rã theo phòng ban?',
        a: 'Vì rủi ro lớn nhất của dự án thường nằm ở chỗ nối giữa các phòng, mà cách chia theo phòng ban lại làm những chỗ nối đó biến mất khỏi bản kế hoạch. Chia theo sản phẩm giữ cho các phần ghép nối hiện diện như một hạng mục có chủ sở hữu.',
      },
      {
        q: 'Chia nhỏ tới mức nào là đủ?',
        a: 'Đủ khi mỗi gói lá có thể ước lượng tương đối tự tin, giao cho một người chịu trách nhiệm, và có định nghĩa xong kiểm được. Chia sâu hơn làm chi phí theo dõi tăng nhanh trong khi độ chính xác gần như không cải thiện, và thường dẫn tới việc nhóm bỏ cập nhật trạng thái.',
      },
    ],
    plan7:
      'Ngày 1: viết gốc cây bằng danh từ và sáu nhánh tầng hai. Ngày 2: chia tiếp tầng ba cho hai nhánh nặng nhất. Ngày 3: săn hạng mục bị bỏ quên theo sáu loại việc hay quên. Ngày 4: tổ chức buổi phân rã cùng nhóm và bổ sung phần họ nêu. Ngày 5: viết định nghĩa xong cho 10 gói lá quan trọng nhất. Ngày 6: ước lượng từng gói lá và cộng dồn, so với con số đoán tổng thể. Ngày 7: chuyển cây vào công cụ theo dõi, giữ mã số truy vết và chốt bản 1.0.',
    evidence:
      'Bằng chứng tốt là ảnh chụp cây phân rã có mã số nhánh, đi kèm bảng gói lá gồm chủ sở hữu, ước lượng và định nghĩa xong. Sức nặng nằm ở phần bạn kể được: cây đã làm lộ ra hạng mục nào bị bỏ sót và điều đó đã đổi cam kết tiến độ ra sao. Trong phỏng vấn, khi được hỏi cách bạn ước lượng một dự án lớn, hãy trình bày đúng chuỗi này — phân rã tới gói lá, ước lượng theo gói, cộng dồn rồi so với con số trực giác — vì nó cho thấy bạn có phương pháp thay vì có tự tin.',
    references: [
      { label: 'PMI — thư viện tài liệu và bài viết về quản lý dự án', url: 'https://www.pmi.org/learning/library', type: 'article' },
      { label: 'Asana — thư viện tài nguyên về lập kế hoạch và quản lý công việc', url: 'https://asana.com/resources', type: 'article' },
    ],
  }),

  // ── Chương 5 · Lập lịch và quản lý phụ thuộc ──────────────────────────────
  guide({
    thesis:
      'Lịch dự án không phải là dãy ngày tháng đẹp mắt mà là mô hình về thứ tự bắt buộc: việc nào không thể bắt đầu trước khi việc nào xong, và chuỗi nào dài nhất trong các chuỗi đó sẽ quyết định ngày kết thúc thật. Ai không xác định được đường găng thì đang tăng tốc ngẫu nhiên: làm cật lực ở những việc có dự trữ thời gian trong khi một mắt xích duy nhất đang kéo lùi cả dự án.',
    why: {
      work:
        'Khi cấp trên hỏi có thể rút ngắn hai tuần không, chỉ người biết đường găng mới trả lời được là rút ở đâu và mất gì, thay vì hứa cả nhóm sẽ cố gắng nhiều hơn.',
      interview:
        'Người phỏng vấn hay hỏi bạn xử lý thế nào khi một nhà cung cấp giao trễ. Câu trả lời có chất lượng nêu được ảnh hưởng lên đường găng, phần dự trữ còn lại và các phương án như làm song song hay đổi trình tự.',
      study:
        'Lịch ôn thi cũng có phụ thuộc: không luyện được đề tổng hợp khi chưa xong phần nền, và phần nền đó chính là đường găng cho cả đợt ôn.',
      life:
        'Sửa nhà là bài học kinh điển về phụ thuộc: sơn không thể làm trước khi xong điện âm tường, và một lần thợ điện tới muộn ba ngày đẩy lùi toàn bộ các khâu phía sau.',
    },
    framework: [
      {
        name: 'Liệt kê việc và thời lượng',
        detail:
          'Lấy các gói lá từ cây phân rã, gán thời lượng thực hiện chứ không phải thời gian trôi. Ghi rõ đơn vị là ngày công hay ngày lịch, vì lẫn lộn hai thứ này là nguồn sai lệch phổ biến nhất trong lập lịch.',
      },
      {
        name: 'Nối phụ thuộc và phân loại',
        detail:
          'Với mỗi việc, hỏi việc nào phải xong trước. Phân biệt phụ thuộc bắt buộc do bản chất kỹ thuật, phụ thuộc do lựa chọn của nhóm, và phụ thuộc bên ngoài như chờ giấy phép hay chờ hàng về. Loại thứ hai là chỗ có thể tháo ra để rút ngắn lịch.',
      },
      {
        name: 'Tính đường găng và dự trữ',
        detail:
          'Chuỗi nối dài nhất từ đầu tới cuối là đường găng; các việc ngoài chuỗi đó có dự trữ, tức là trễ một chút không ảnh hưởng ngày về đích. Ghi rõ mỗi việc có bao nhiêu ngày dự trữ để nhóm biết chỗ nào được phép chậm.',
      },
      {
        name: 'Đặt đệm ở chỗ đúng',
        detail:
          'Không rải đệm vào từng việc, vì đệm rải ra sẽ bị tiêu hết theo thói quen làm vừa đủ hạn. Gom đệm thành một khối đặt trước các mốc cam kết và trước những việc phụ thuộc bên ngoài, rồi theo dõi mức tiêu đệm như theo dõi tiền.',
      },
      {
        name: 'Cập nhật theo nhịp cố định',
        detail:
          'Mỗi tuần cập nhật ngày hoàn thành dự kiến của các việc trên đường găng, và kiểm xem đường găng có chuyển sang chuỗi khác không. Một lịch không được cập nhật sẽ trở thành tài liệu trang trí trong vòng ba tuần.',
      },
    ],
    scenario:
      'Một đoàn làm phim quảng cáo 30 giây có 25 ngày từ lúc ký hợp đồng tới ngày phát sóng. Bản lịch đầu tiên xếp tuần tự: viết kịch bản, casting, dựng bối cảnh, quay, hậu kỳ, duyệt, phát sóng — cộng lại vừa khít 25 ngày, không dư ngày nào. Đạo diễn sản xuất vẽ lại sơ đồ phụ thuộc và thấy hai điều. Thứ nhất, casting và dựng bối cảnh không phụ thuộc nhau nên chạy song song được, tiết kiệm bốn ngày. Thứ hai, đường găng thật sự đi qua khâu duyệt của khách hàng, vốn được ghi là hai ngày nhưng lịch sử ba dự án trước cho thấy trung bình năm ngày vì phải qua hai cấp. Nhóm làm ba việc: chốt trước với khách một khung giờ duyệt cố định và người có thẩm quyền cuối, gửi bản dựng thô ngay khi quay xong thay vì đợi hoàn thiện, và gom bốn ngày tiết kiệm được thành đệm đặt ngay trước khâu duyệt. Khách duyệt mất sáu ngày như dự đoán, đệm hấp thụ hết, phim lên sóng đúng hạn. Không ai phải thức đêm, và điều tạo ra kết quả đó là đặt đệm đúng chỗ chứ không phải làm nhanh hơn.',
    comparison: [
      {
        weak: 'Xếp mọi việc nối đuôi nhau vì như vậy dễ vẽ, dù thực tế nhiều việc có thể chạy song song.',
        mature:
          'Chỉ nối những việc thật sự phụ thuộc, ghi rõ lý do phụ thuộc, và định kỳ hỏi lại xem phụ thuộc nào là do thói quen chứ không do bản chất công việc.',
      },
      {
        weak: 'Rải đệm vào từng việc bằng cách nhân đôi ước lượng, khiến tổng lịch dài phi lý mà vẫn trễ vì đệm bị tiêu âm thầm.',
        mature:
          'Ước lượng trung thực từng việc, gom đệm thành khối trước các mốc, và công khai mức tiêu đệm hằng tuần như một chỉ số sức khoẻ dự án.',
      },
      {
        weak: 'Theo dõi tiến độ bằng phần trăm hoàn thành do người thực hiện tự báo, con số này thường đứng ở 90% rất lâu.',
        mature:
          'Theo dõi bằng ngày hoàn thành dự kiến còn lại của từng việc trên đường găng, vì con số này buộc người ta nói ra dự báo chứ không mô tả cảm giác.',
      },
    ],
    mistakes: [
      'Coi đường găng là bất biến: tính một lần lúc lập kế hoạch rồi không tính lại, trong khi chỉ cần một việc ngoài chuỗi trễ quá phần dự trữ là đường găng đã chuyển sang nhánh khác mà không ai để ý.',
      'Bỏ qua thời gian chờ đợi không phải làm việc: chờ duyệt, chờ hàng, chờ hợp đồng, chờ phòng ban khác phản hồi — những khoảng này thường chiếm phần lớn thời gian trôi nhưng lại không xuất hiện trên lịch.',
      'Ép lịch bằng cách rút thời lượng từng việc cho vừa hạn của cấp trên, tạo ra một bản lịch mà chính người lập cũng không tin, khiến sau đó không ai coi việc trễ là chuyện nghiêm trọng nữa.',
    ],
    worksheet: [
      'Liệt kê 15 việc lớn nhất kèm thời lượng, ghi rõ bạn đang tính bằng ngày công hay ngày lịch và hệ số quy đổi giữa hai đơn vị.',
      'Với mỗi việc, việc nào phải xong trước nó? Đánh dấu phụ thuộc nào là bắt buộc kỹ thuật, phụ thuộc nào chỉ do cách nhóm quen làm.',
      'Chuỗi dài nhất trong sơ đồ của bạn đi qua những việc nào, và tổng độ dài chuỗi đó là bao nhiêu ngày?',
      'Các khoảng chờ bên ngoài (duyệt, giấy phép, giao hàng) đang được ghi bao nhiêu ngày, và số liệu thật của ba lần gần nhất là bao nhiêu?',
      'Bạn đang có bao nhiêu ngày đệm, đặt ở đâu, và ai được quyền quyết định tiêu đệm?',
    ],
    exercises: [
      {
        label: 'Sơ đồ mũi tên trên giấy',
        text: 'Vẽ sơ đồ phụ thuộc cho 12 việc bằng ô vuông và mũi tên, không dùng phần mềm. Tự đi bộ qua mọi đường từ đầu tới cuối, cộng thời lượng, và khoanh đường dài nhất.',
        level: 'e',
      },
      {
        label: 'Truy tìm khoảng chờ',
        text: 'Lập bảng mọi điểm mà dự án phải chờ bên ngoài. Với mỗi điểm, tìm số liệu thật của ba lần gần nhất trong lịch sử nhóm và thay ước lượng lạc quan bằng con số trung vị đó.',
        level: 'e',
      },
      {
        label: 'Tháo phụ thuộc giả',
        text: 'Rà toàn bộ phụ thuộc và hỏi từng cái: nếu bỏ mũi tên này thì hỏng ở đâu. Với mỗi phụ thuộc không giải thích được bằng lý do kỹ thuật, thử tách việc thành hai phần để phần đầu chạy song song, và tính lại lịch.',
        level: 'm',
      },
      {
        label: 'Gom đệm về mốc',
        text: 'Lấy tổng phần dự phòng đang rải rác trong các ước lượng, cắt về mức trung thực, cộng số cắt được thành một khối đệm đặt trước mốc cam kết gần nhất. Thiết lập bảng theo dõi mức đệm còn lại theo tuần.',
        level: 'm',
      },
      {
        label: 'Bảng ngày hoàn thành dự kiến',
        text: 'Thay cột phần trăm hoàn thành bằng cột ngày hoàn thành dự kiến. Trong ba tuần, ghi lại mỗi tuần con số này thay đổi thế nào cho các việc trên đường găng, và ai là người đưa dự báo.',
        level: 'm',
      },
      {
        label: 'Diễn tập trễ hạn',
        text: 'Chọn một việc trên đường găng và giả định nó trễ năm ngày. Tính lại ngày về đích, xác định đường găng mới, và viết ba phương án ứng phó kèm chi phí của từng phương án.',
        level: 'h',
      },
      {
        label: 'Rút ngắn có tính toán',
        text: 'Cấp trên yêu cầu rút lịch 15%. Dựng bảng ba cột: việc có thể rút, cách rút (thêm người, thuê ngoài, làm song song, giảm phạm vi), chi phí và rủi ro kèm theo. Trình bày khuyến nghị kèm phương án bạn không chọn và lý do.',
        level: 'h',
      },
      {
        label: 'Đối chiếu lịch với thực tế',
        text: 'Sau khi dự án kết thúc, lập bảng so ngày dự kiến và ngày thật của 15 việc chính. Tính sai số trung bình theo từng loại việc và dùng hệ số đó để hiệu chỉnh ước lượng cho dự án sau, ghi lại thành một trang chuẩn của nhóm.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Đường găng là gì và vì sao biết nó lại thay đổi cách bạn phân bổ sự chú ý?',
        a: 'Đó là chuỗi việc nối nhau dài nhất quyết định ngày kết thúc sớm nhất của dự án. Biết đường găng cho bạn biết chỗ nào một ngày trễ là một ngày trễ của cả dự án, và chỗ nào còn dự trữ nên có thể chờ. Không biết nó thì mọi nỗ lực tăng tốc đều là đánh cược.',
      },
      {
        q: 'Vì sao gom đệm về trước mốc tốt hơn rải đệm vào từng việc?',
        a: 'Vì đệm rải ra thường bị tiêu hết do công việc có xu hướng giãn cho vừa thời gian được cấp, mà phần tiết kiệm được ở việc xong sớm lại không chuyển sang việc khác. Gom lại thành khối cho phép chia sẻ rủi ro giữa các việc và giúp bạn nhìn thấy mức tiêu đệm như một chỉ số cảnh báo sớm.',
      },
      {
        q: 'Một nhà cung cấp báo giao hàng trễ bốn ngày. Ba câu hỏi đầu tiên bạn cần trả lời là gì?',
        a: 'Việc đó có nằm trên đường găng không; nếu không thì phần dự trữ của nó còn bao nhiêu ngày; và nếu có thì đệm trước mốc gần nhất còn đủ hấp thụ không. Ba câu này quyết định bạn chỉ ghi nhận, hay phải đổi trình tự, hay phải báo lùi mốc cho các bên liên quan ngay hôm nay.',
      },
    ],
    plan7:
      'Ngày 1: chuyển gói lá thành danh sách việc có thời lượng và thống nhất đơn vị đo. Ngày 2: vẽ sơ đồ phụ thuộc bằng tay và phân loại từng mũi tên. Ngày 3: tính đường găng và ghi dự trữ cho các việc ngoài chuỗi. Ngày 4: tìm số liệu thật cho mọi khoảng chờ bên ngoài và thay ước lượng lạc quan. Ngày 5: tháo thử ba phụ thuộc do thói quen và tính lại lịch. Ngày 6: gom đệm về trước mốc cam kết, lập bảng theo dõi mức tiêu đệm. Ngày 7: đổi cách báo cáo sang ngày hoàn thành dự kiến và chạy thử một vòng cập nhật với nhóm.',
    evidence:
      'Hãy giữ lại sơ đồ phụ thuộc có đánh dấu đường găng cùng bảng so ngày dự kiến với ngày thật sau khi kết thúc, kèm một đoạn ngắn nói bạn đã rút ra hệ số hiệu chỉnh nào. Trong phỏng vấn, câu chuyện mạnh nhất là lần bạn phát hiện đường găng thật nằm ở khâu duyệt hoặc khâu chờ hàng chứ không nằm ở phần việc nhóm mình làm, và bạn đã đàm phán được cách rút ngắn khâu đó. Nó cho thấy bạn quản lý hệ thống chứ không chỉ đốc thúc con người.',
    references: [
      { label: 'PMI — thư viện bài viết chuyên môn về lập lịch dự án', url: 'https://www.pmi.org/learning/library', type: 'article' },
      { label: 'ProjectManagement.com — cộng đồng và tài nguyên thực hành (thuộc PMI)', url: 'https://www.projectmanagement.com/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 6 · Ước lượng nguồn lực và ngân sách ───────────────────────────
  guide({
    thesis:
      'Ước lượng là một dự báo có khoảng tin cậy, không phải một lời hứa. Một con số đơn lẻ luôn che giấu điều quan trọng nhất là độ bất định, nên cách làm trưởng thành là đưa ra khoảng, nêu rõ nó dựa trên giả định nào, và tách bạch ba thứ hay bị trộn lẫn: ước lượng công việc, dự phòng cho rủi ro đã biết, và cam kết đối ngoại mà bạn đưa ra sau khi đã cân nhắc.',
    why: {
      work:
        'Người đưa được khoảng ước lượng kèm giả định sẽ không bị mắc kẹt giữa hai lựa chọn tệ là hứa liều hoặc từ chối trả lời, và họ giữ được uy tín qua nhiều dự án nhờ dự báo có thể kiểm chứng.',
      interview:
        'Câu hỏi phổ biến cho vị trí quản lý là bạn ước lượng thế nào khi thông tin còn thiếu. Nêu được phương pháp ba điểm, cách dùng dữ liệu lịch sử và cách tách dự phòng khỏi ước lượng gốc là dấu hiệu người đã làm thật.',
      study:
        'Sinh viên hay ước lượng thời gian làm đồ án bằng thời gian ngồi ở bàn, quên phần đọc tài liệu, chờ phản hồi giảng viên và sửa lại. Ghi lại thời gian thật của vài bài tập cho ra hệ số hiệu chỉnh dùng được cả năm.',
      life:
        'Ngân sách cho việc lớn của gia đình thường vỡ vì thiếu ba khoản: chi phí lặp lại hằng tháng sau khi mua, chi phí phát sinh do đổi ý, và tiền dự phòng. Tách ba khoản này ra làm giảm hẳn căng thẳng khi chi tiêu vượt mức.',
    },
    framework: [
      {
        name: 'Chọn đơn vị và phạm vi ước lượng',
        detail:
          'Xác định rõ bạn ước lượng cái gì: ngày công, giờ máy, hay tiền; có gồm thời gian quản lý, họp, sửa lỗi hay không. Hai người ước lượng cùng một việc nhưng khác định nghĩa sẽ ra hai con số lệch nhau hai lần mà không ai sai.',
      },
      {
        name: 'Dùng dữ liệu lịch sử trước khi dùng trực giác',
        detail:
          'Tìm ba việc tương tự đã làm và lấy số thật. Trực giác chỉ dùng cho phần chưa từng làm bao giờ. Một nhóm ghi lại số thật trong sáu tháng có nền dữ liệu tốt hơn mọi công thức đi mượn.',
      },
      {
        name: 'Ước lượng ba điểm',
        detail:
          'Với mỗi hạng mục lớn, đưa ba số: lạc quan, khả dĩ nhất, bi quan. Đây là kỹ thuật gắn với phương pháp PERT trong quản lý dự án truyền thống. Khoảng cách giữa số lạc quan và bi quan chính là bản đồ chỉ ra chỗ bất định nhất, và đó là nơi cần thêm thông tin.',
      },
      {
        name: 'Tách dự phòng khỏi ước lượng gốc',
        detail:
          'Giữ ước lượng gốc trung thực, rồi cộng thêm một khoản dự phòng riêng có tên và có chủ. Dự phòng cho rủi ro đã nhận diện do quản lý dự án nắm; dự phòng cho phần chưa biết do chủ đầu tư nắm. Trộn chung là cách nhanh nhất để tiêu hết mà không ai biết đã tiêu vào đâu.',
      },
      {
        name: 'Làm mịn theo nhịp',
        detail:
          'Công bố rằng ước lượng sẽ được cập nhật tại các mốc, kèm lý do và mức thay đổi. Ước lượng đầu dự án luôn rộng; hứa giữ nguyên nó tới cuối là hứa điều không thể làm được.',
      },
    ],
    scenario:
      'Bộ phận công nghệ thông tin nội bộ của một công ty 400 nhân sự được giao triển khai hệ thống chấm công mới. Câu hỏi từ ban giám đốc là bao nhiêu tiền và bao lâu. Trưởng nhóm không trả lời ngay bằng một con số mà làm ba việc trong bốn ngày. Thứ nhất, lấy dữ liệu thật của hai dự án nội bộ gần nhất và thấy phần tích hợp với hệ thống lương luôn tốn gấp đôi ước lượng ban đầu. Thứ hai, ước lượng ba điểm cho từng hạng mục, phát hiện khoảng lạc quan tới bi quan của riêng khâu chuyển dữ liệu nhân sự cũ trải từ 8 tới 30 ngày công vì không ai biết chất lượng dữ liệu hiện tại. Thứ ba, dành hai ngày lấy mẫu 200 bản ghi để thu hẹp chính khoảng đó, kết quả cho thấy 17% bản ghi thiếu trường bắt buộc, và ước lượng thu về khoảng 14 tới 18 ngày. Báo cáo cuối cùng gồm ba dòng: ước lượng công việc 96 ngày công, dự phòng rủi ro đã biết 14 ngày do trưởng nhóm quản lý, và đề xuất ban giám đốc giữ thêm 10 ngày cho phần chưa biết. Ban giám đốc duyệt, và khi khâu tích hợp thật sự vượt, việc tiêu dự phòng được ghi nhận công khai thay vì trở thành một cuộc tranh cãi về năng lực.',
    comparison: [
      {
        weak: 'Trả lời câu hỏi bao lâu bằng một con số duy nhất ngay tại cuộc họp để tránh mang tiếng né tránh.',
        mature:
          'Trả lời bằng khoảng kèm giả định và hẹn ngày thu hẹp khoảng đó, ví dụ sau ba ngày khảo sát dữ liệu sẽ đưa khoảng hẹp hơn.',
      },
      {
        weak: 'Cộng thầm 30% vào mọi ước lượng cho an toàn, không nói với ai, nên khi bị ép giảm thì cắt luôn phần đệm mà không ai hiểu hậu quả.',
        mature:
          'Giữ ước lượng gốc trung thực và đặt dự phòng thành dòng riêng có tên, có chủ sở hữu, có quy tắc tiêu — nhờ vậy việc cắt giảm trở thành quyết định có ý thức.',
      },
      {
        weak: 'Ước lượng chỉ tính công làm ra sản phẩm, bỏ quên họp, phỏng vấn người dùng, sửa lỗi, đào tạo và thời gian chờ phản hồi.',
        mature:
          'Ước lượng theo tổng chi phí sở hữu của hạng mục, gồm cả phần vận hành sau bàn giao trong ba tháng đầu, vì đó là phần chi phí sẽ thật sự phát sinh.',
      },
    ],
    mistakes: [
      'Coi người ước lượng và người cam kết là một: đội thực hiện đưa số kỹ thuật, rồi chính con số đó bị mang đi ký hợp đồng mà không qua bước cân nhắc rủi ro thương mại, nên mọi sai số đều đổ lên đầu người làm.',
      'Ép nhóm ước lượng trước mặt cấp trên, nơi ai cũng chịu áp lực xã hội phải nói con số nhỏ; kết quả là một bảng số đẹp mà không ai tin, kể cả người vừa đọc nó lên.',
      'Không ghi lại số thật sau khi xong, nên năm nào cũng ước lượng bằng trực giác và năm nào cũng lệch theo cùng một hướng, mà không có dữ liệu để phát hiện quy luật lệch đó.',
    ],
    worksheet: [
      'Bạn đang ước lượng theo đơn vị nào, và ước lượng đó có bao gồm họp, sửa lỗi, đào tạo, thời gian chờ phản hồi hay không?',
      'Ba việc tương tự đã làm trong quá khứ là gì, số thật của chúng là bao nhiêu, và bạn tìm số đó ở đâu?',
      'Với ba hạng mục nặng nhất, ba số lạc quan, khả dĩ và bi quan của bạn là bao nhiêu? Hạng mục nào có khoảng rộng nhất?',
      'Việc gì bạn có thể làm trong ba ngày tới để thu hẹp khoảng bất định lớn nhất đó, và chi phí của việc thu hẹp là bao nhiêu?',
      'Dự phòng của bạn là bao nhiêu, ai giữ, và quy tắc nào cho phép tiêu nó — ai duyệt, ghi lại ở đâu?',
    ],
    exercises: [
      {
        label: 'Bảng số thật',
        text: 'Lập bảng lịch sử cho năm việc nhóm bạn đã làm xong: ước lượng ban đầu, số thật, tỷ lệ lệch, nguyên nhân chính. Tính tỷ lệ lệch trung bình và giữ nó làm hệ số tham chiếu.',
        level: 'e',
      },
      {
        label: 'Ba điểm cho mười hạng mục',
        text: 'Chọn 10 hạng mục của dự án hiện tại và điền ba số lạc quan, khả dĩ, bi quan cho từng cái. Sắp xếp theo độ rộng khoảng và viết một câu giải thích vì sao ba hạng mục rộng nhất lại bất định như vậy.',
        level: 'e',
      },
      {
        label: 'Kiểm kê khoản bị quên',
        text: 'Rà ngân sách hiện tại và tìm sáu loại chi phí hay thiếu: giấy phép và bản quyền, hạ tầng vận hành, đào tạo người dùng, phí bảo trì năm đầu, chi phí đi lại, và thời gian của nhân sự phòng ban khác. Ước lượng thô cho từng loại.',
        level: 'm',
      },
      {
        label: 'Thu hẹp một khoảng',
        text: 'Chọn hạng mục có khoảng rộng nhất và thiết kế một hoạt động dưới ba ngày để thu hẹp nó: lấy mẫu dữ liệu, làm bản thử nhỏ, hoặc gọi hai nhà cung cấp lấy báo giá. Ghi khoảng trước và sau để đo giá trị của việc thu hẹp.',
        level: 'm',
      },
      {
        label: 'Ước lượng ẩn danh',
        text: 'Cho ba thành viên ước lượng độc lập cùng một danh sách việc mà không thấy số của nhau, sau đó mới so. Với mỗi hạng mục lệch quá hai lần, tổ chức thảo luận ngắn để tìm ra hai người đang hiểu phạm vi khác nhau ở chỗ nào.',
        level: 'm',
      },
      {
        label: 'Tách ba dòng ngân sách',
        text: 'Viết lại đề xuất ngân sách thành ba dòng riêng biệt: ước lượng công việc, dự phòng rủi ro đã biết, dự phòng cho phần chưa biết. Ghi rõ ai quản lý từng dòng và quy tắc tiêu, rồi trình bày cho người duyệt.',
        level: 'h',
      },
      {
        label: 'Theo dõi tiêu dự phòng',
        text: 'Trong sáu tuần, cập nhật hằng tuần biểu đồ mức dự phòng còn lại so với phần trăm công việc đã hoàn thành. Viết một đoạn phân tích khi hai đường lệch nhau bất thường và hành động bạn đề xuất.',
        level: 'h',
      },
      {
        label: 'Đối chiếu cuối kỳ',
        text: 'Khi dự án kết thúc, so ước lượng gốc, dự phòng đã tiêu và số thật cho từng hạng mục lớn. Xác định ba hạng mục lệch nhiều nhất, tìm nguyên nhân chung, và viết một trang hướng dẫn ước lượng riêng cho loại dự án đó của nhóm.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên tách dự phòng thành dòng riêng thay vì cộng ngầm vào ước lượng?',
        a: 'Vì khi cộng ngầm, không ai biết dự án đang tiêu vào phần công việc hay đang tiêu vào phần rủi ro, nên cũng không ai cảnh báo được sớm. Tách ra cho phép theo dõi mức tiêu dự phòng như một chỉ số sức khoẻ, và giúp việc cắt giảm ngân sách trở thành lựa chọn có ý thức thay vì cắt nhầm vào phần đệm bảo vệ.',
      },
      {
        q: 'Khoảng ước lượng của một hạng mục rất rộng nói lên điều gì và bạn nên làm gì tiếp?',
        a: 'Nó nói rằng bạn đang thiếu thông tin ở chính chỗ đó chứ không phải nhóm đang lười suy nghĩ. Hành động đúng là đầu tư một hoạt động ngắn để thu hẹp bất định, ví dụ lấy mẫu dữ liệu hoặc làm một bản thử nhỏ, rồi ước lượng lại — rẻ hơn nhiều so với gánh rủi ro đó suốt dự án.',
      },
      {
        q: 'Cấp trên nói ước lượng của bạn quá cao và yêu cầu giảm 30%. Cách phản hồi có trách nhiệm là gì?',
        a: 'Không sửa con số mà đưa ra lựa chọn: giảm phạm vi phần nào, chấp nhận rủi ro nào, hoặc thêm nguồn lực nào. Trình bày rằng ước lượng là dự báo về công việc hiện có, nên muốn số nhỏ đi thì phải đổi một trong ba biến là phạm vi, nguồn lực hoặc mức rủi ro chấp nhận được.',
      },
    ],
    plan7:
      'Ngày 1: định nghĩa đơn vị và phạm vi ước lượng, viết thành nửa trang. Ngày 2: dựng bảng số thật của năm việc đã làm và tính tỷ lệ lệch. Ngày 3: ước lượng ba điểm cho 10 hạng mục nặng nhất. Ngày 4: kiểm kê sáu loại chi phí hay bị quên. Ngày 5: chạy một hoạt động thu hẹp bất định cho hạng mục rộng nhất. Ngày 6: tổ chức ước lượng ẩn danh với nhóm và xử lý các chỗ lệch quá hai lần. Ngày 7: viết đề xuất ngân sách ba dòng kèm quy tắc tiêu dự phòng và gửi người duyệt.',
    evidence:
      'Vật chứng thuyết phục nhất là bảng đối chiếu ước lượng và số thật của một dự án đã kết thúc, kèm hệ số hiệu chỉnh bạn rút ra và cách bạn áp nó vào dự án tiếp theo. Thêm một trang đề xuất ngân sách có ba dòng tách bạch cùng quy tắc tiêu dự phòng. Trong phỏng vấn, hãy kể lần bạn đã thu hẹp một khoảng bất định bằng vài ngày khảo sát và điều đó tránh cho tổ chức một khoản chi lớn — đây là loại chi tiết mà người chưa từng chịu trách nhiệm ngân sách không nghĩ ra được.',
    references: [
      { label: 'Atlassian — hướng dẫn ước lượng trong Agile', url: 'https://www.atlassian.com/agile/project-management/estimation', type: 'article' },
      { label: 'PMI — trang chính thức của Project Management Institute', url: 'https://www.pmi.org/', type: 'article' },
    ],
  }),

  // ── Chương 7 · Quản lý rủi ro ─────────────────────────────────────────────
  guide({
    thesis:
      'Quản lý rủi ro là biến những nỗi lo mơ hồ thành một danh sách có tên, có chủ, có dấu hiệu nhận biết sớm và có hành động đã được quyết định trước. Điểm mấu chốt không nằm ở bảng tính đẹp mà ở hai câu hỏi cho mỗi dòng: dấu hiệu nào cho biết nó đang xảy ra, và ai được quyền bấm nút hành động khi thấy dấu hiệu đó.',
    why: {
      work:
        'Đội có sổ rủi ro sẽ mất vài giờ để phản ứng thay vì vài ngày, vì phương án đã được nghĩ sẵn lúc đầu óc còn tỉnh táo chứ không phải lúc đang cháy.',
      interview:
        'Khi bạn kể một dự án suôn sẻ, người phỏng vấn khó đánh giá. Khi bạn kể mình đã nhận diện rủi ro nào từ đầu, dấu hiệu nào đã bật lên và bạn đã kích hoạt phương án nào, họ thấy được cách bạn suy nghĩ dưới áp lực.',
      study:
        'Kế hoạch ôn thi cũng cần dự phòng cho các rủi ro quen thuộc như ốm, việc đột xuất, đề thi đổi cấu trúc; ai có phương án rút gọn viết sẵn thì không mất cả tuần để lấy lại nhịp.',
      life:
        'Trong tài chính cá nhân, quỹ dự phòng và bảo hiểm chính là quản lý rủi ro. Đây là kiến thức phổ thông chứ không phải tư vấn đầu tư, và với các quyết định lớn nên tham vấn chuyên gia tài chính có chứng chỉ hành nghề.',
    },
    framework: [
      {
        name: 'Nhận diện có phương pháp',
        detail:
          'Không hỏi chung chung có rủi ro gì. Đi theo các nhóm cố định: con người, nhà cung cấp, kỹ thuật, pháp lý, tài chính, thời tiết và ngoại cảnh, cùng nhóm rủi ro từ chính các giả định trong kế hoạch. Mỗi rủi ro viết theo mẫu nguyên nhân dẫn tới sự kiện dẫn tới hậu quả.',
      },
      {
        name: 'Chấm điểm và xếp hạng',
        detail:
          'Cho mỗi rủi ro hai điểm từ 1 đến 5 về khả năng xảy ra và mức tác động, rồi nhân lại để xếp thứ tự. Điểm số không cần chính xác tuyệt đối, nó chỉ cần đủ để tách ra năm đến bảy dòng đáng để tiêu thời gian.',
      },
      {
        name: 'Chọn cách xử lý',
        detail:
          'Với mỗi rủi ro quan trọng, chọn một trong bốn hướng: né tránh bằng cách đổi cách làm, giảm nhẹ bằng hành động phòng ngừa, chuyển giao qua hợp đồng hoặc bảo hiểm, hoặc chấp nhận có ý thức kèm dự phòng. Chấp nhận là lựa chọn hợp lệ, miễn là được ghi ra.',
      },
      {
        name: 'Đặt dấu hiệu cảnh báo sớm',
        detail:
          'Mỗi rủi ro cần một chỉ báo quan sát được kèm ngưỡng, ví dụ nhà cung cấp chưa xác nhận đơn hàng trước ngày 10, hoặc số người đăng ký sau tuần đầu dưới 40% mục tiêu. Không có ngưỡng thì mọi người sẽ tranh cãi xem tình hình đã đủ xấu chưa.',
      },
      {
        name: 'Rà theo nhịp và đóng dòng',
        detail:
          'Mỗi hai tuần xem lại sổ: rủi ro nào đã qua thì đóng, rủi ro mới thì thêm, điểm nào đổi thì cập nhật. Sổ rủi ro lập một lần rồi để đó là dấu hiệu chắc chắn rằng nó chưa bao giờ được dùng.',
      },
    ],
    scenario:
      'Ban tổ chức một giải chạy bán marathon 3.000 người ở một tỉnh miền Trung lập sổ rủi ro tám tuần trước ngày thi đấu. Dòng nặng nhất không phải mưa bão như mọi người đoán, mà là rủi ro giao thông: cung đường đi qua một đoạn quốc lộ và giấy chấp thuận phân luồng phụ thuộc vào một cơ quan bên ngoài, thường trả lời sát ngày. Nhóm chọn hai hướng đồng thời: giảm nhẹ bằng cách nộp hồ sơ sớm bốn tuần và cử một người theo sát hằng tuần, và chuẩn bị phương án né tránh là một cung đường thay thế hoàn toàn trong khu đô thị, đã đo và đã có bản đồ. Dấu hiệu cảnh báo được đặt rõ: nếu trước ngày thứ 20 vẫn chưa có văn bản chấp thuận thì tự động chuyển sang cung đường thay thế, người có quyền quyết định là trưởng ban tổ chức. Rủi ro thời tiết được xử lý bằng ngưỡng khác: có cảnh báo bão trong 48 giờ thì rút cự ly và lùi giờ xuất phát, thông báo theo mẫu đã soạn sẵn. Thực tế văn bản về vào ngày thứ 22, cung đường đã được chuyển đổi từ hai ngày trước; việc đổi sớm gây tiếc nuối nhưng bảo toàn được toàn bộ khâu truyền thông và hậu cần, và không ai phải ra quyết định lớn trong 48 giờ cuối.',
    comparison: [
      {
        weak: 'Ghi rủi ro dưới dạng một cụm từ như thời tiết xấu hay thiếu nhân sự, không rõ hậu quả nên cũng không rõ phải làm gì.',
        mature:
          'Viết theo mẫu nguyên nhân, sự kiện, hậu quả, nhờ đó nhìn vào là biết can thiệp ở đâu: chặn nguyên nhân hay giảm hậu quả.',
      },
      {
        weak: 'Chờ tới khi vấn đề nổ ra rồi mới họp bàn phương án, trong điều kiện thiếu thời gian và mọi người đang căng thẳng.',
        mature:
          'Quyết định trước ngưỡng nào thì làm gì, khi đầu óc còn tỉnh, để lúc dấu hiệu bật lên chỉ còn việc thực hiện theo điều đã thống nhất.',
      },
      {
        weak: 'Sổ rủi ro do một mình người quản lý dự án viết, các bên liên quan không biết nên không ai theo dõi dấu hiệu.',
        mature:
          'Mỗi dòng có chủ sở hữu là người ở gần dấu hiệu nhất, và người đó báo cáo trạng thái dòng của mình trong nhịp rà định kỳ.',
      },
    ],
    mistakes: [
      'Nhầm rủi ro với vấn đề: đưa vào sổ những thứ đã xảy ra rồi, khiến sổ biến thành danh sách việc phải xử lý và mất hẳn chức năng cảnh báo sớm.',
      'Chấm điểm cho có rồi không dùng điểm để làm gì; ba mươi dòng đều được xử lý như nhau, nên nguồn lực bị rải đều và những rủi ro thật sự nguy hiểm không nhận thêm sự chú ý nào.',
      'Chỉ tập trung vào rủi ro kỹ thuật quen thuộc mà bỏ qua rủi ro con người và tổ chức: người chủ chốt nghỉ việc, người ra quyết định đổi, hai phòng ban tranh nhau nguồn lực — đây thường là nhóm gây thiệt hại lớn nhất.',
    ],
    worksheet: [
      'Liệt kê tám rủi ro theo mẫu nguyên nhân dẫn tới sự kiện dẫn tới hậu quả, phủ đủ các nhóm con người, nhà cung cấp, kỹ thuật, pháp lý, tài chính và ngoại cảnh.',
      'Chấm hai điểm cho từng dòng và ghi ra năm dòng có tích số cao nhất; với mỗi dòng viết một câu vì sao nó xứng đáng đứng ở đó.',
      'Với năm dòng đó, bạn chọn hướng xử lý nào trong bốn hướng, và hành động cụ thể tuần này là gì?',
      'Dấu hiệu cảnh báo sớm cho từng dòng là gì, đo bằng cách nào, ai là người nhìn thấy nó đầu tiên?',
      'Ngưỡng nào thì kích hoạt phương án, ai có quyền bấm nút, và thông báo gửi cho ai trong vòng bao nhiêu giờ?',
    ],
    exercises: [
      {
        label: 'Duyệt theo nhóm rủi ro',
        text: 'Dành 45 phút đi qua bảy nhóm rủi ro cố định và với mỗi nhóm buộc mình viết ít nhất hai dòng, kể cả khi cảm thấy nhóm đó không liên quan. Đánh dấu những dòng nảy ra chỉ nhờ việc duyệt có hệ thống.',
        level: 'e',
      },
      {
        label: 'Chuyển giả định thành rủi ro',
        text: 'Lấy danh sách giả định trong kế hoạch của bạn và chuyển mỗi giả định quan trọng thành một dòng rủi ro tương ứng với trường hợp nó sai. Ghi hậu quả bằng con số ngày hoặc tiền.',
        level: 'e',
      },
      {
        label: 'Bản đồ hai chiều',
        text: 'Vẽ lưới khả năng và tác động, dán mọi rủi ro lên đúng ô. Chụp lại và cùng nhóm tranh luận trong 20 phút về ba dòng gây bất đồng nhất về vị trí, ghi lại lý lẽ của cả hai phía.',
        level: 'm',
      },
      {
        label: 'Chỉ báo và ngưỡng',
        text: 'Với năm rủi ro hàng đầu, viết chỉ báo cụ thể kèm ngưỡng số và tần suất theo dõi. Kiểm tra tính khả thi bằng câu hỏi: dữ liệu cho chỉ báo này lấy ở đâu và ai sẽ nhìn nó vào thứ mấy hằng tuần.',
        level: 'm',
      },
      {
        label: 'Bốn hướng xử lý',
        text: 'Chọn ba rủi ro và với mỗi cái viết cả bốn phương án né tránh, giảm nhẹ, chuyển giao, chấp nhận, kèm chi phí ước lượng. Chọn một phương án và ghi lý do vì sao ba cái còn lại bị loại.',
        level: 'm',
      },
      {
        label: 'Khám nghiệm trước khi chết',
        text: 'Họp 60 phút với giả định dự án đã thất bại hoàn toàn vào ngày kết thúc. Mỗi người viết độc lập trong 10 phút câu chuyện vì sao nó hỏng, sau đó gom lại và đối chiếu với sổ rủi ro; mọi nguyên nhân chưa có trong sổ đều được bổ sung ngay hôm đó.',
        level: 'h',
      },
      {
        label: 'Rủi ro con người và tổ chức',
        text: 'Lập danh sách các vai trò mà nếu người đó rời đi thì dự án đứng, và với mỗi vai trò viết phương án giảm phụ thuộc: viết tài liệu, ghép cặp làm việc, hoặc chuẩn bị người thay thế. Thực hiện một hành động ngay trong tuần.',
        level: 'h',
      },
      {
        label: 'Sổ rủi ro sống trong sáu tuần',
        text: 'Duy trì nhịp rà hai tuần một lần trong sáu tuần: đóng dòng đã qua, thêm dòng mới, cập nhật điểm. Cuối kỳ thống kê bao nhiêu dòng đã bật dấu hiệu, bao nhiêu phương án được kích hoạt, và viết một trang đánh giá chất lượng dự báo của chính bạn.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Phân biệt rủi ro và vấn đề, và vì sao trộn lẫn hai thứ này làm hỏng sổ rủi ro?',
        a: 'Rủi ro là sự kiện chưa xảy ra và có xác suất; vấn đề là sự kiện đã xảy ra và cần xử lý ngay. Trộn chung khiến sổ đầy những dòng phải hành động ngay, người ta bắt đầu dùng nó như danh sách việc, và chức năng nhìn về phía trước biến mất.',
      },
      {
        q: 'Vì sao mỗi rủi ro cần một dấu hiệu cảnh báo có ngưỡng số?',
        a: 'Vì không có ngưỡng thì việc kích hoạt phương án phụ thuộc vào cảm nhận và vào người dũng cảm lên tiếng, thường muộn hơn mức cần thiết. Ngưỡng định trước biến quyết định khó thành quy tắc đã thống nhất, giảm cả thời gian phản ứng lẫn chi phí chính trị của việc lên tiếng.',
      },
      {
        q: 'Chấp nhận rủi ro có phải là bỏ mặc không?',
        a: 'Không. Chấp nhận là quyết định có ý thức rằng chi phí phòng ngừa lớn hơn thiệt hại kỳ vọng, và nó phải đi kèm ba thứ: ghi vào sổ, thông báo cho người có thẩm quyền, và dành một khoản dự phòng tương ứng. Bỏ mặc là không có cả ba thứ đó.',
      },
    ],
    plan7:
      'Ngày 1: duyệt bảy nhóm rủi ro và viết ít nhất 15 dòng theo mẫu ba phần. Ngày 2: chuyển các giả định trong kế hoạch thành dòng rủi ro tương ứng. Ngày 3: chấm điểm cùng hai đồng nghiệp và chốt năm dòng hàng đầu. Ngày 4: viết chỉ báo, ngưỡng và người theo dõi cho năm dòng đó. Ngày 5: chọn hướng xử lý và bắt đầu một hành động phòng ngừa thật. Ngày 6: chuẩn bị phương án dự phòng cho rủi ro số một, đủ chi tiết để người khác thực hiện được. Ngày 7: chốt lịch rà hai tuần một lần và gửi sổ rủi ro cho các bên liên quan cùng phần việc của họ.',
    evidence:
      'Giữ lại sổ rủi ro có dấu vết cập nhật theo thời gian: dòng nào được thêm ngày nào, dòng nào đã đóng, dấu hiệu nào từng bật và phương án nào đã kích hoạt. Một sổ có lịch sử chứng minh bạn dùng nó thật, khác hẳn một bảng đẹp lập một lần. Trong phỏng vấn, đây là nguyên liệu cho câu hỏi về lần dự án suýt hỏng: bạn kể được rằng mình đã nhìn thấy dấu hiệu từ trước và đã có sẵn đường lui, thay vì kể về một pha xoay xở may mắn vào phút chót.',
    references: [
      { label: 'PMI — thư viện tài liệu về quản lý rủi ro dự án', url: 'https://www.pmi.org/learning/library', type: 'article' },
    ],
  }),

  // ── Chương 8 · Quản lý thay đổi ───────────────────────────────────────────
  guide({
    thesis:
      'Quản lý thay đổi trong dự án không nhằm ngăn thay đổi mà nhằm làm cho mỗi thay đổi trở nên nhìn thấy được và có giá. Cơ chế của nó gồm ba phần: một đường cơ sở đã được chốt và đánh phiên bản, một quy trình đánh giá tác động có thời hạn trả lời, và một người hoặc nhóm có thẩm quyền quyết định. Thiếu đường cơ sở thì không thể biết cái gì đang đổi; thiếu thời hạn trả lời thì quy trình trở thành nơi chôn yêu cầu; thiếu thẩm quyền rõ ràng thì ai to tiếng hơn sẽ thắng.',
    why: {
      work:
        'Phần lớn dự án không chết vì một thay đổi lớn mà vì hàng chục thay đổi nhỏ không ai ghi lại, nên đến cuối không ai giải thích được vì sao trễ và vì sao vượt ngân sách.',
      interview:
        'Nhà tuyển dụng đánh giá cao ứng viên phân biệt được ba việc: nhận yêu cầu, đánh giá tác động, và ra quyết định — vì người mới thường gộp cả ba vào một câu trả lời ngay tại chỗ.',
      study:
        'Khi giảng viên hướng dẫn đề nghị đổi hướng đồ án ở tuần thứ tám, sinh viên biết cách trình bày tác động lên thời gian và phần đã làm sẽ thương lượng được phạm vi hợp lý thay vì làm lại từ đầu.',
      life:
        'Trong việc sửa nhà hay tổ chức sự kiện gia đình, mỗi lần đổi ý đều có giá. Ghi lại và báo giá sòng phẳng ngay lúc phát sinh giúp giữ được quan hệ tốt hơn nhiều so với im lặng gánh rồi ấm ức về sau.',
    },
    framework: [
      {
        name: 'Chốt đường cơ sở',
        detail:
          'Ba thứ phải được chốt và đánh số phiên bản kèm ngày: phạm vi, lịch, ngân sách. Mọi so sánh về sau đều dựa vào bản này, nên nó phải nằm ở một nơi duy nhất mà cả hai bên truy cập được, không nằm rải rác trong email.',
      },
      {
        name: 'Tiếp nhận theo một cửa',
        detail:
          'Mọi yêu cầu thay đổi đi vào qua một kênh duy nhất và được ghi số. Yêu cầu nói miệng ở hành lang vẫn được chào đón, nhưng người nhận có trách nhiệm chuyển nó thành phiếu trong ngày, nếu không nó sẽ tồn tại như một lời hứa không ai nhớ.',
      },
      {
        name: 'Đánh giá tác động ba chiều',
        detail:
          'Trả lời trong thời hạn cam kết, thường là 48 giờ: thay đổi này ảnh hưởng gì tới phạm vi, tới lịch, tới chi phí; và hạng mục nào phải lùi lại nếu chấp nhận. Luôn đưa kèm phương án giữ nguyên tổng nguồn lực bằng cách đổi ngang một hạng mục khác.',
      },
      {
        name: 'Quyết định đúng cấp',
        detail:
          'Định trước ngưỡng thẩm quyền: dưới một mức nào thì quản lý dự án tự quyết, trên mức đó cần người phê duyệt cấp cao hơn hoặc ban kiểm soát thay đổi. Ngưỡng rõ ràng giúp việc nhỏ đi nhanh và việc lớn không bị quyết vội.',
      },
      {
        name: 'Cập nhật đường cơ sở và thông báo',
        detail:
          'Khi thay đổi được duyệt, cập nhật phiên bản mới của phạm vi, lịch, ngân sách, rồi gửi bản tóm tắt cho tất cả những người bị ảnh hưởng. Bước này hay bị bỏ, và hậu quả là nửa nhóm vẫn làm theo bản cũ.',
      },
    ],
    scenario:
      'Một công ty phần mềm nhỏ nhận làm website thương mại điện tử cho chuỗi cửa hàng thời trang, hợp đồng bốn tháng. Đường cơ sở được chốt ở phiên bản 1.0 gồm 42 màn hình và ba tích hợp. Tới tuần thứ sáu, phía khách có giám đốc marketing mới, và trong ba tuần có 17 yêu cầu thay đổi đổ về qua bốn kênh khác nhau. Quản lý dự án làm hai việc. Thứ nhất, thống nhất một cửa duy nhất là biểu mẫu trực tuyến, mọi yêu cầu nói miệng đều được chính người nhận nhập vào trong ngày và gửi lại số phiếu cho người đề nghị. Thứ hai, cam kết trả lời tác động trong 48 giờ với ba con số và một câu hỏi đổi ngang. Kết quả sau bốn tuần: 6 yêu cầu bị chính khách rút lại khi thấy hạng mục phải lùi, 8 yêu cầu được duyệt theo hình thức đổi ngang mà không tăng ngân sách, 3 yêu cầu được duyệt kèm phụ lục hợp đồng bổ sung. Đường cơ sở lên phiên bản 1.3, mỗi lần cập nhật đều kèm một bản tóm tắt một trang gửi cả hai bên. Dự án kết thúc chậm chín ngày so với hợp đồng gốc nhưng cả hai bên đều biết chính xác chín ngày đó đến từ đâu, nên buổi nghiệm thu không có tranh cãi nào.',
    comparison: [
      {
        weak: 'Nhận yêu cầu và trả lời ngay tại chỗ rằng được, để giữ không khí dễ chịu, rồi tự tìm cách nhét vào lịch.',
        mature:
          'Nhận yêu cầu bằng thái độ tích cực nhưng tách bạch: ghi nhận hôm nay, trả lời tác động trong 48 giờ, quyết định sau khi hai bên nhìn cùng một bảng số.',
      },
      {
        weak: 'Từ chối mọi thay đổi với lý do đã chốt phạm vi, khiến bên đặt hàng phải đi đường vòng và nhóm nhận về một sản phẩm không còn phù hợp thực tế.',
        mature:
          'Mở cửa cho thay đổi nhưng luôn kèm cái giá và lựa chọn đổi ngang, nhờ vậy dự án thích nghi được mà tổng nguồn lực vẫn nằm trong tầm kiểm soát.',
      },
      {
        weak: 'Duyệt thay đổi trong một cuộc trò chuyện riêng rồi không cập nhật tài liệu, nên nửa nhóm vẫn làm theo bản cũ và phải làm lại.',
        mature:
          'Mỗi lần duyệt là một lần lên phiên bản đường cơ sở kèm thông báo tóm tắt, để mọi người luôn biết bản nào đang có hiệu lực.',
      },
    ],
    mistakes: [
      'Dùng quy trình thay đổi như công cụ phòng thủ để làm nản lòng người đề nghị bằng biểu mẫu rườm rà, khiến các bên chuyển sang trao đổi ngầm và quy trình mất hết giá trị.',
      'Không cam kết thời hạn trả lời, nên các yêu cầu nằm chờ vô hạn; người đề nghị mất kiên nhẫn và bắt đầu tác động trực tiếp lên thành viên nhóm, phá vỡ cả kế hoạch lẫn kỷ luật.',
      'Chỉ tính tác động về chi phí và bỏ qua tác động lên chất lượng và tinh thần nhóm: nhận thêm việc mà giữ nguyên hạn thường được bù bằng cắt kiểm thử và làm thêm giờ, và cái giá đó chỉ hiện ra sau khi bàn giao.',
    ],
    worksheet: [
      'Đường cơ sở hiện tại của bạn là phiên bản nào, chốt ngày nào, gồm những tài liệu nào và lưu ở đâu để cả hai bên truy cập được?',
      'Trong bốn tuần qua đã có bao nhiêu yêu cầu thay đổi, chúng đi vào qua những kênh nào, và bao nhiêu phần trăm được ghi lại bằng văn bản?',
      'Thời hạn cam kết trả lời tác động của bạn là bao lâu, ai làm phần đánh giá, và người đó cần thông tin gì để làm được trong thời hạn đó?',
      'Ngưỡng thẩm quyền của bạn nằm ở đâu — mức nào tự quyết, mức nào phải trình, ai là người phê duyệt cuối cùng?',
      'Sau khi một thay đổi được duyệt, ai cập nhật tài liệu nào, và bản thông báo tóm tắt gửi cho những ai trong bao lâu?',
    ],
    exercises: [
      {
        label: 'Chốt và đánh số đường cơ sở',
        text: 'Gom phạm vi, lịch và ngân sách hiện tại thành một bộ tài liệu duy nhất, ghi phiên bản 1.0 kèm ngày, và gửi cho các bên xác nhận rằng đây là bản đang có hiệu lực.',
        level: 'e',
      },
      {
        label: 'Kiểm kê kênh yêu cầu',
        text: 'Trong một tuần, ghi lại mọi yêu cầu thay đổi cùng kênh nó đi vào: họp, tin nhắn, email, hành lang. Đếm tỷ lệ đi ngoài quy trình và trình bày con số này trong buổi họp nhóm.',
        level: 'e',
      },
      {
        label: 'Mẫu phiếu thay đổi',
        text: 'Thiết kế biểu mẫu tối đa tám ô: người đề nghị, mô tả, lý do nghiệp vụ, mức khẩn, tác động phạm vi, lịch, chi phí, và hạng mục đề xuất đổi ngang. Thử điền cho ba yêu cầu gần nhất và đo thời gian điền.',
        level: 'e',
      },
      {
        label: 'Đánh giá tác động trong 48 giờ',
        text: 'Chọn một yêu cầu thật và làm đánh giá đầy đủ đúng trong hai ngày. Trình bày kết quả bằng ba con số và một câu hỏi lựa chọn cho người quyết định, không kèm ý kiến cảm tính.',
        level: 'm',
      },
      {
        label: 'Bảng đổi ngang',
        text: 'Lập danh sách các hạng mục có thể hoãn hoặc cắt cùng giá trị tương ứng bằng ngày công. Khi có yêu cầu mới, dùng bảng này để đưa ngay một phương án giữ nguyên tổng nguồn lực.',
        level: 'm',
      },
      {
        label: 'Thoả thuận ngưỡng thẩm quyền',
        text: 'Soạn một trang quy định ai quyết cái gì theo ba mức giá trị, đưa ra thống nhất với người bảo trợ dự án và bên đặt hàng, rồi dán nó vào tài liệu khởi động dự án.',
        level: 'm',
      },
      {
        label: 'Nhật ký thay đổi có số liệu',
        text: 'Duy trì nhật ký trong sáu tuần và cuối kỳ tổng hợp bốn con số: số yêu cầu nhận, số duyệt, tổng ngày công phát sinh, tổng ngày công đã đổi ngang. Trình bày bảng này trong họp với bên đặt hàng.',
        level: 'h',
      },
      {
        label: 'Phân tích một dự án đã trễ',
        text: 'Lấy một dự án từng vượt tiến độ. Tái dựng dòng thời gian các thay đổi và cố gắng quy đổi phần trễ về từng thay đổi cụ thể. Xác định cái nào lẽ ra phải qua phê duyệt cấp cao hơn, và viết đề xuất chỉnh ngưỡng thẩm quyền cho lần sau.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao đường cơ sở có phiên bản lại là điều kiện tiên quyết của quản lý thay đổi?',
        a: 'Vì thay đổi chỉ có nghĩa khi so với một mốc xác định. Không có đường cơ sở được chốt và đánh số, mỗi bên sẽ so với ký ức riêng của mình, và cuộc thảo luận trượt từ chỗ dữ liệu sang chỗ ai nhớ đúng hơn.',
      },
      {
        q: 'Vì sao cam kết thời hạn trả lời tác động lại quan trọng ngang với bản thân quy trình?',
        a: 'Vì một quy trình không có thời hạn sẽ bị người ta đi vòng qua. Khi người đề nghị biết chắc trong 48 giờ có câu trả lời kèm số liệu, họ sẵn sàng đi đúng cửa; khi không biết bao giờ có hồi âm, họ sẽ tác động trực tiếp lên thành viên nhóm và kỷ luật dự án sụp đổ.',
      },
      {
        q: 'Người đặt hàng nói yêu cầu này chỉ là làm rõ chứ không phải thay đổi. Bạn xử lý thế nào?',
        a: 'Đối chiếu với đường cơ sở: nếu nội dung đã nằm trong phạm vi và tiêu chí nghiệm thu thì đúng là làm rõ, ghi nhận và thực hiện. Nếu nó thêm khối lượng hoặc đổi tiêu chí thì đó là thay đổi, dù nhỏ, và vẫn đi qua đánh giá tác động — có thể kết luận là không tốn thêm gì, nhưng phải được ghi lại.',
      },
    ],
    plan7:
      'Ngày 1: gom và chốt đường cơ sở phiên bản 1.0, gửi xác nhận. Ngày 2: kiểm kê các kênh yêu cầu đang tồn tại và chọn một cửa duy nhất. Ngày 3: thiết kế biểu mẫu tám ô và thử điền cho ba yêu cầu cũ. Ngày 4: thống nhất thời hạn trả lời và phân công người đánh giá tác động. Ngày 5: lập bảng đổi ngang các hạng mục có thể hoãn. Ngày 6: thoả thuận ngưỡng thẩm quyền với người bảo trợ dự án. Ngày 7: chạy thử toàn bộ quy trình với một yêu cầu thật và gửi thông báo cập nhật đường cơ sở.',
    evidence:
      'Bằng chứng cụ thể là nhật ký thay đổi có số liệu tổng hợp: bao nhiêu yêu cầu nhận, bao nhiêu duyệt, bao nhiêu ngày công phát sinh và bao nhiêu được xử lý bằng đổi ngang, kèm lịch sử phiên bản đường cơ sở. Trong phỏng vấn, đây là cách trả lời câu hỏi kinh điển về khách hàng hay đổi ý mà không rơi vào giọng than phiền: bạn cho thấy mình đã dựng một cơ chế khiến việc đổi ý trở nên minh bạch và có giá, và chính khách hàng là người rút lại một phần yêu cầu khi nhìn thấy cái giá đó.',
    references: [
      { label: 'Atlassian Team Playbook — các bài tập điều phối và thống nhất trong nhóm', url: 'https://www.atlassian.com/team-playbook', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Change Management', url: 'https://hbr.org/topic/subject/change-management', type: 'article' },
    ],
  }),

  // ── Chương 9 · Agile và Scrum ─────────────────────────────────────────────
  guide({
    thesis:
      'Agile là một tập giá trị được nêu trong Tuyên ngôn Agile năm 2001, còn Scrum là một khung làm việc cụ thể được mô tả trong Scrum Guide với ba vai trò, một số sự kiện và ba hiện vật. Điểm chung của cả hai là đặt cược vào vòng lặp ngắn: giao một lát sản phẩm dùng được, thu phản hồi thật, rồi điều chỉnh. Cái làm nên hiệu quả không phải là các nghi thức mà là việc mỗi vòng lặp thật sự tạo ra thông tin mới và thật sự dẫn tới thay đổi cách làm ở vòng sau.',
    why: {
      work:
        'Khi yêu cầu còn nhiều bất định, chu kỳ ngắn giới hạn được thiệt hại của một quyết định sai xuống còn vài tuần, thay vì phát hiện sai lầm sau sáu tháng khi đã tiêu hết ngân sách.',
      interview:
        'Rất nhiều tổ chức tự nhận làm Agile nhưng làm nửa vời. Ứng viên phân biệt được đâu là vòng lặp thật và đâu là chỉ đổi tên cuộc họp sẽ trả lời được câu hỏi khó nhất: nhóm cũ của bạn làm Scrum kiểu gì và chỗ nào chưa ổn.',
      study:
        'Học theo vòng lặp hai tuần với một sản phẩm nhỏ hoàn chỉnh mỗi vòng cho phản hồi nhanh hơn hẳn kiểu học hết lý thuyết rồi mới thực hành ở cuối kỳ.',
      life:
        'Với các việc cá nhân dài hơi như tập luyện hay học nhạc cụ, đặt chu kỳ hai tuần có một buổi tự đánh giá và một điều chỉnh duy nhất giúp bạn tiến bộ theo dữ liệu chứ không theo cảm hứng.',
    },
    framework: [
      {
        name: 'Chuẩn bị danh sách việc theo giá trị',
        detail:
          'Product Backlog là danh sách sắp thứ tự theo giá trị, do một người chịu trách nhiệm về thứ tự đó. Mục ở đầu danh sách phải đủ rõ để bắt tay làm, mục ở cuối được phép còn thô — làm mịn toàn bộ danh sách là lãng phí.',
      },
      {
        name: 'Lập kế hoạch chu kỳ',
        detail:
          'Đầu mỗi chu kỳ, nhóm chọn lượng việc theo năng lực thật đã đo ở các chu kỳ trước, và phát biểu một mục tiêu chu kỳ bằng một câu về kết quả. Không có mục tiêu chung, chu kỳ chỉ là một cái hộp đựng việc rời rạc.',
      },
      {
        name: 'Đồng bộ hằng ngày',
        detail:
          'Cuộc gặp ngắn mỗi ngày không nhằm báo cáo cho quản lý mà nhằm trả lời một câu: hôm nay có gì đang chặn mục tiêu chu kỳ. Nếu nội dung chỉ là ba câu lặp lại theo mẫu thì buổi gặp đó đã mất chức năng.',
      },
      {
        name: 'Trình bày kết quả cho người dùng thật',
        detail:
          'Cuối chu kỳ, giao một lát sản phẩm chạy được và cho người dùng thật hoặc người đại diện sử dụng, không phải xem trình chiếu. Phản hồi thu ở đây là đầu vào để sắp lại thứ tự danh sách việc.',
      },
      {
        name: 'Nhìn lại và đổi một điều',
        detail:
          'Buổi nhìn lại chỉ có giá trị khi kết thúc bằng đúng một đến hai hành động có người chịu trách nhiệm và hạn hoàn thành, được đưa ngay vào chu kỳ sau. Danh sách 12 điều cần cải thiện tương đương với không cải thiện gì.',
      },
    ],
    scenario:
      'Một nhóm bảy người trong công ty dịch vụ tài chính xây ứng dụng nội bộ cho bộ phận chăm sóc khách hàng. Nhóm nói mình làm Scrum: có chu kỳ hai tuần, có họp đứng, có bảng công việc. Nhưng ba chu kỳ liền không có gì được đưa vào sử dụng thật, vì mọi thứ chờ tới bản phát hành lớn cuối quý. Người điều phối làm ba điều chỉnh. Thứ nhất, mỗi chu kỳ phải có ít nhất một lát dùng được thật cho năm nhân viên chăm sóc khách hàng, dù nhỏ tới đâu. Thứ hai, buổi trình bày cuối chu kỳ chuyển từ trình chiếu sang cho chính năm người đó ngồi thao tác trong 30 phút và nhóm ngồi quan sát, không hướng dẫn. Thứ ba, mỗi buổi nhìn lại chỉ chốt một hành động duy nhất. Ngay chu kỳ đầu tiên áp dụng, việc quan sát người dùng thật cho thấy màn hình tra cứu bị dùng sai cách hoàn toàn: nhân viên không tìm theo mã khách như nhóm giả định mà tìm theo số điện thoại người gọi. Thay đổi nhỏ đó đã nằm sẵn trong kế hoạch ở vị trí thứ 30 của danh sách, được kéo lên đầu, và thời gian xử lý một cuộc gọi giảm rõ rệt sau hai chu kỳ. Bài học không phải là nhóm cần thêm nghi thức mà là vòng lặp trước đó chưa hề khép kín.',
    comparison: [
      {
        weak: 'Giữ nguyên cách làm tuần tự nhưng đổi tên: giai đoạn gọi là chu kỳ, báo cáo tiến độ gọi là họp đứng, và kế hoạch cả năm vẫn cố định.',
        mature:
          'Mỗi chu kỳ khép kín thật: có lát sản phẩm dùng được, có người dùng thật chạm vào, và thứ tự danh sách việc thay đổi theo những gì học được.',
      },
      {
        weak: 'Đo hiệu quả nhóm bằng số điểm hoàn thành mỗi chu kỳ, dẫn tới việc thổi phồng điểm và tránh những việc khó không ghi điểm.',
        mature:
          'Đo bằng kết quả với người dùng và bằng thời gian từ lúc có ý tưởng tới lúc dùng được, còn số điểm chỉ dùng nội bộ để dự báo năng lực.',
      },
      {
        weak: 'Buổi nhìn lại chỉ để than phiền hoặc để khen nhau, kết thúc không có hành động nào được ghi tên và hạn.',
        mature:
          'Kết thúc bằng một hành động cụ thể, có chủ, có hạn, được kiểm ở đầu buổi nhìn lại kế tiếp — làm được ba lần liên tiếp là nhóm đã có cơ chế tự sửa.',
      },
    ],
    mistakes: [
      'Nhét vào chu kỳ đúng lượng việc bằng năng lực tối đa từng đạt, không chừa chỗ cho lỗi phát sinh và việc hỗ trợ, nên chu kỳ nào cũng dở dang và nhóm mất niềm tin vào chính cam kết của mình.',
      'Để danh sách việc không có thứ tự rõ ràng hoặc có nhiều người cùng quyền chen việc vào đầu; hậu quả là nhóm liên tục đổi hướng giữa chu kỳ và không hoàn thành mục tiêu nào.',
      'Coi Agile là lý do để không viết tài liệu và không lập kế hoạch dài hạn; thực tế Tuyên ngôn Agile nói ưu tiên phần mềm chạy được hơn tài liệu, chứ không nói bỏ hẳn tài liệu, và các dự án có ràng buộc pháp lý vẫn cần hồ sơ đầy đủ.',
    ],
    worksheet: [
      'Mục tiêu của chu kỳ hiện tại phát biểu bằng một câu về kết quả là gì, và ai có thể xác nhận rằng nó đã đạt?',
      'Chu kỳ vừa rồi đã giao được lát sản phẩm nào tới tay người dùng thật? Nếu chưa có, điều gì đã chặn?',
      'Ai là người quyết định thứ tự trong danh sách việc, và trong bốn tuần qua có bao nhiêu lần thứ tự bị người khác chen ngang?',
      'Năng lực thật của nhóm bốn chu kỳ gần nhất là bao nhiêu, và bạn đang lập kế hoạch dựa trên con số nào?',
      'Hành động cải tiến chốt ở buổi nhìn lại gần nhất là gì, ai chịu trách nhiệm, và tới nay nó ở trạng thái nào?',
    ],
    exercises: [
      {
        label: 'Viết mục tiêu chu kỳ',
        text: 'Viết lại mục tiêu chu kỳ hiện tại thành một câu nói về kết quả cho người dùng, không liệt kê danh sách tính năng. Hỏi ba thành viên xem nếu phải cắt bớt việc để đạt mục tiêu đó thì họ cắt cái nào.',
        level: 'e',
      },
      {
        label: 'Đo năng lực thật',
        text: 'Lập bảng bốn chu kỳ gần nhất: lượng việc cam kết, lượng hoàn thành, phần trăm thời gian dành cho việc ngoài kế hoạch. Dùng trung bình ba chu kỳ gần nhất làm mức cam kết cho chu kỳ tới.',
        level: 'e',
      },
      {
        label: 'Làm mịn mục đầu danh sách',
        text: 'Chọn năm mục ở đầu danh sách việc và viết cho mỗi mục tiêu chí chấp nhận theo dạng có thể kiểm được. Đánh dấu mục nào sau khi viết mới lộ ra là còn thiếu thông tin từ bên ngoài nhóm.',
        level: 'e',
      },
      {
        label: 'Quan sát người dùng thật',
        text: 'Tổ chức 30 phút cho ba người dùng thật thao tác với lát sản phẩm mới, nhóm chỉ quan sát và ghi chép, tuyệt đối không hướng dẫn. Ghi lại ba chỗ họ ngập ngừng và đưa vào danh sách việc trong ngày.',
        level: 'm',
      },
      {
        label: 'Nhìn lại có một hành động',
        text: 'Điều phối một buổi nhìn lại kết thúc bằng đúng một hành động có chủ và có hạn. Ở buổi kế tiếp, mở đầu bằng việc kiểm hành động cũ trước khi bàn bất kỳ điều gì mới.',
        level: 'm',
      },
      {
        label: 'Chia nhỏ một mục lớn',
        text: 'Lấy một hạng mục cần hơn một chu kỳ và chia thành các lát dọc, mỗi lát tự nó đã có giá trị dùng được, thay vì chia theo tầng kỹ thuật. Trình bày cách chia cho nhóm và ghi lại phản đối để cải thiện lần sau.',
        level: 'm',
      },
      {
        label: 'Chẩn đoán vòng lặp có khép kín không',
        text: 'Trong ba chu kỳ, theo dõi hai con số: bao nhiêu quyết định trong danh sách việc thay đổi nhờ phản hồi người dùng, và bao nhiêu ngày trung bình từ khi một ý tưởng vào danh sách tới khi được dùng thật. Viết một trang kết luận về mức độ khép kín của vòng lặp.',
        level: 'h',
      },
      {
        label: 'Thiết kế lại nhịp làm việc của nhóm',
        text: 'Dựa trên dữ liệu ba chu kỳ, đề xuất một điều chỉnh về nhịp: độ dài chu kỳ, cách chia việc, hoặc cách nghiệm thu. Thử trong hai chu kỳ, đo bằng chỉ số đã chọn từ trước, rồi quyết định giữ hay bỏ dựa trên số liệu.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Điều gì phân biệt một nhóm thật sự làm việc theo vòng lặp với một nhóm chỉ đổi tên các cuộc họp?',
        a: 'Vòng lặp thật có ba dấu hiệu: mỗi chu kỳ giao được một lát dùng được cho người dùng thật, phản hồi từ đó làm thay đổi thứ tự công việc của chu kỳ sau, và buổi nhìn lại tạo ra thay đổi quan sát được trong cách làm việc. Thiếu cả ba thì các nghi thức chỉ là chi phí thêm.',
      },
      {
        q: 'Tuyên ngôn Agile nói ưu tiên phần mềm chạy được hơn tài liệu đầy đủ. Hiểu thế nào cho đúng?',
        a: 'Bản tuyên ngôn nói rõ rằng vế bên phải vẫn có giá trị, chỉ là vế bên trái được ưu tiên hơn khi phải chọn. Nghĩa là không viết tài liệu thừa chỉ để có tài liệu, nhưng vẫn phải viết đủ những gì cần cho vận hành, bàn giao và tuân thủ pháp lý.',
      },
      {
        q: 'Nhóm cam kết 40 điểm mỗi chu kỳ nhưng ba chu kỳ liền chỉ đạt 25. Bạn xử lý thế nào?',
        a: 'Hạ mức cam kết về đúng năng lực đo được là khoảng 25 và đi tìm phần thời gian bị ăn mất: việc hỗ trợ đột xuất, họp, sửa lỗi cũ. Ép cam kết cao hơn năng lực thật chỉ tạo ra tồn đọng dở dang và làm hỏng khả năng dự báo, thứ có giá trị hơn nhiều so với một con số đẹp.',
      },
    ],
    plan7:
      'Ngày 1: viết lại mục tiêu chu kỳ thành một câu về kết quả và dán ở nơi cả nhóm nhìn thấy. Ngày 2: dựng bảng năng lực bốn chu kỳ gần nhất. Ngày 3: làm mịn năm mục đầu danh sách việc kèm tiêu chí chấp nhận. Ngày 4: chia một hạng mục lớn thành các lát dọc dùng được. Ngày 5: tổ chức buổi quan sát ba người dùng thật, chỉ ghi chép. Ngày 6: đưa phát hiện vào danh sách việc và sắp lại thứ tự cùng người chịu trách nhiệm sản phẩm. Ngày 7: điều phối buổi nhìn lại kết thúc bằng đúng một hành động có chủ và hạn.',
    evidence:
      'Bằng chứng có sức thuyết phục là một chuỗi ba đến bốn chu kỳ được ghi lại: mục tiêu từng chu kỳ, thứ đã giao, phản hồi thu được từ người dùng thật và thay đổi mà phản hồi đó tạo ra ở chu kỳ sau. Thêm bảng năng lực thật và các hành động cải tiến đã hoàn thành. Trong phỏng vấn, tránh trả lời bằng cách kể tên các nghi thức; hãy kể một lần quan sát người dùng làm bạn đảo thứ tự công việc, vì đó là dấu hiệu bạn hiểu vòng lặp chứ không thuộc lòng khung.',
    references: [
      { label: 'Tuyên ngôn Agile — bản gốc 2001, có bản dịch tiếng Việt', url: 'https://agilemanifesto.org/', type: 'article' },
      { label: 'Scrum Guide — tài liệu chính thức của Scrum', url: 'https://scrumguides.org/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 10 · Kanban ────────────────────────────────────────────────────
  guide({
    thesis:
      'Kanban là cách quản lý luồng công việc dựa trên ba trụ: làm cho công việc trở nên nhìn thấy được trên một bảng phản ánh đúng quy trình thật, giới hạn số việc đang làm dở ở mỗi cột, và quản lý dòng chảy bằng các chỉ số thời gian thay vì bằng số việc đã bắt đầu. Nghịch lý mà mọi nhóm phải trải qua để tin: giảm số việc làm cùng lúc thì tổng lượng việc hoàn thành lại tăng, vì phần lớn thời gian của một hạng mục là thời gian nằm chờ chứ không phải thời gian được làm.',
    why: {
      work:
        'Với đội vận hành hoặc đội nhận yêu cầu liên tục, chu kỳ cố định không phù hợp; Kanban cho phép luồng liên tục nhưng vẫn có kỷ luật nhờ giới hạn việc đang làm và chỉ số thời gian hoàn thành.',
      interview:
        'Khi được hỏi cách bạn xử lý tình trạng ai cũng bận mà không có gì xong, câu trả lời dựa trên giới hạn việc đang làm và đo thời gian chờ cho thấy bạn nhìn được hệ thống chứ không chỉ nhìn con người.',
      study:
        'Bảng ba cột cho việc học cá nhân với giới hạn tối đa hai môn đang học dở giúp bạn kết thúc trọn vẹn từng chủ đề thay vì mở tám chủ đề và bỏ dở cả tám.',
      life:
        'Việc nhà và việc cá nhân cũng chịu cùng quy luật: mở quá nhiều dự án cùng lúc làm mọi thứ kéo dài; giới hạn ba việc đang làm dở là cách rẻ nhất để thấy tiến độ.',
    },
    framework: [
      {
        name: 'Vẽ đúng quy trình thật',
        detail:
          'Bảng phải phản ánh các bước thật sự tồn tại, gồm cả các bước chờ như chờ duyệt, chờ thông tin khách, chờ triển khai. Bảng ba cột chung chung sẽ giấu đi chính những chỗ công việc nằm im lâu nhất.',
      },
      {
        name: 'Đặt giới hạn việc đang làm',
        detail:
          'Mỗi cột có một số trần cho lượng thẻ được phép nằm trong đó. Khi cột đầy, không ai được kéo thêm việc vào; cả nhóm phải giúp đẩy việc đang tắc đi trước. Đây là điểm gây khó chịu nhất và cũng là điểm tạo ra toàn bộ hiệu quả.',
      },
      {
        name: 'Định nghĩa điều kiện chuyển cột',
        detail:
          'Viết rõ một thẻ cần thoả mãn gì để rời cột này sang cột kia. Không có điều kiện, mỗi người hiểu chữ xong một kiểu và thẻ chạy tới cột cuối rồi bị trả ngược, tạo ra dòng chảy giả.',
      },
      {
        name: 'Đo thời gian, không đo số lượng',
        detail:
          'Theo dõi thời gian từ lúc bắt đầu làm tới lúc xong và thời gian từ lúc yêu cầu được nhận tới lúc xong. Nhìn phân bố chứ không chỉ nhìn trung bình, vì phần đuôi dài mới là thứ khách hàng nhớ.',
      },
      {
        name: 'Họp theo dòng chảy',
        detail:
          'Cuộc gặp hằng ngày đọc bảng từ phải sang trái, ưu tiên đẩy việc gần xong nhất và xử lý thẻ bị chặn, thay vì đi vòng hỏi từng người hôm nay làm gì. Cách đọc này tự nó hướng sự chú ý vào chỗ tắc.',
      },
    ],
    scenario:
      'Phòng marketing sáu người của một công ty đồ gia dụng nhận yêu cầu từ bốn phòng ban khác nhau: nội dung mạng xã hội, tờ rơi, trang đích, video ngắn. Ai cũng làm việc liên tục, nhưng các phòng ban đặt hàng đều phàn nàn rằng chờ quá lâu và không biết bao giờ có. Nhóm dựng bảng Kanban sáu cột theo quy trình thật, trong đó có hai cột chờ vốn trước đây vô hình là chờ duyệt nội dung của phòng pháp chế và chờ ảnh sản phẩm từ kho. Đo hai tuần đầu cho kết quả bất ngờ: thời gian trung bình từ lúc nhận yêu cầu tới lúc giao là 19 ngày, trong đó chỉ khoảng 4 ngày là thời gian thật sự có người làm. Nhóm đặt giới hạn ba thẻ cho cột đang thực hiện và hai thẻ cho cột duyệt, đồng thời thoả thuận với phòng pháp chế một khung duyệt cố định vào sáng thứ Ba và thứ Năm. Sau sáu tuần, thời gian trung bình còn 9 ngày và số yêu cầu hoàn thành mỗi tháng tăng, dù không ai làm thêm giờ và nhóm không tuyển thêm người. Điều gây tranh cãi nhất trong nội bộ vẫn là quy tắc không được nhận việc mới khi cột đã đầy, và nó chỉ trụ được nhờ có số liệu để nhìn.',
    comparison: [
      {
        weak: 'Đánh giá năng suất bằng số việc đã bắt đầu và bằng cảm giác ai cũng đang bận rộn.',
        mature:
          'Đánh giá bằng số việc thật sự hoàn thành và bằng thời gian trung vị từ lúc nhận yêu cầu tới lúc giao, kèm phân bố để thấy phần đuôi dài.',
      },
      {
        weak: 'Nhận mọi yêu cầu vào bảng ngay khi có, để danh sách đang làm phình lên hàng chục thẻ, ai cũng nhảy qua nhảy lại giữa các việc.',
        mature:
          'Giữ hàng chờ ở ngoài, chỉ kéo việc mới vào khi có chỗ trống theo giới hạn đã đặt, và thứ tự trong hàng chờ được rà lại hằng tuần.',
      },
      {
        weak: 'Bảng chỉ có ba cột cần làm, đang làm, đã xong nên không nhìn thấy các khoảng chờ, và mọi cuộc thảo luận về chậm trễ đều quay về việc trách người.',
        mature:
          'Bảng có cột riêng cho từng khoảng chờ thật, nhờ đó thảo luận chuyển sang chỗ tắc nằm ở đâu và cần thoả thuận gì với bên liên quan.',
      },
    ],
    mistakes: [
      'Đặt giới hạn việc đang làm rồi phá lệ ngay lần đầu có yêu cầu gấp từ cấp trên; sau hai lần như vậy giới hạn mất hiệu lực và bảng trở lại thành danh sách việc thông thường.',
      'Đo mỗi số trung bình rồi kết luận mọi thứ ổn, trong khi phân bố cho thấy một phần tư số yêu cầu mất gấp ba lần thời gian đó, và chính nhóm này tạo ra toàn bộ sự bất mãn của các bên.',
      'Dùng bảng như công cụ giám sát cá nhân, treo tên người kèm số thẻ hoàn thành để so sánh; hệ quả là mọi người chọn việc dễ, tránh việc khó, và ngừng giúp nhau gỡ thẻ bị chặn.',
    ],
    worksheet: [
      'Vẽ lại quy trình thật của nhóm bạn thành các cột, trong đó ghi rõ mọi khoảng chờ đang bị giấu; bạn tìm ra bao nhiêu cột chờ?',
      'Thời điểm nào được tính là bắt đầu và thời điểm nào là kết thúc cho mỗi thẻ, và ai chịu trách nhiệm ghi hai mốc đó?',
      'Giới hạn việc đang làm bạn định đặt cho mỗi cột là bao nhiêu, và bạn dựa vào căn cứ nào để chọn con số đó?',
      'Điều kiện để một thẻ rời khỏi cột quan trọng nhất của bạn là gì, viết thành ba gạch đầu dòng kiểm được?',
      'Khi cột đã đầy mà có yêu cầu gấp từ cấp trên, quy tắc xử lý đã thoả thuận trước của nhóm là gì?',
    ],
    exercises: [
      {
        label: 'Bảng phản ánh quy trình thật',
        text: 'Cùng nhóm vẽ lại bảng trong 45 phút, buộc phải thêm ít nhất hai cột chờ mà bảng cũ không có. Dán bảng mới ở nơi ai cũng thấy và chạy thử một tuần trước khi chỉnh tiếp.',
        level: 'e',
      },
      {
        label: 'Đo thời gian hai tuần',
        text: 'Ghi ngày bắt đầu và ngày kết thúc cho mọi thẻ trong hai tuần. Tính thời gian trung vị và vẽ biểu đồ phân tán để thấy các thẻ ngoại lệ, rồi tìm điểm chung của những thẻ chậm nhất.',
        level: 'e',
      },
      {
        label: 'Tách thời gian làm và thời gian chờ',
        text: 'Với 10 thẻ đã xong, ước lượng bao nhiêu ngày thật sự có người làm và bao nhiêu ngày nằm chờ. Tính tỷ lệ thời gian chờ trên tổng thời gian và trình bày con số đó cho nhóm.',
        level: 'm',
      },
      {
        label: 'Thử giới hạn trong ba tuần',
        text: 'Đặt giới hạn cho hai cột bận nhất, cam kết không phá lệ trong ba tuần. Ghi lại mỗi lần cả nhóm phải dừng nhận việc mới và điều gì đã xảy ra sau đó.',
        level: 'm',
      },
      {
        label: 'Thoả thuận với bên gây tắc',
        text: 'Xác định khoảng chờ dài nhất và tổ chức một buổi 30 phút với bên liên quan để thoả thuận nhịp cố định hoặc thời hạn phản hồi. Ghi thoả thuận thành văn bản ngắn và theo dõi trong bốn tuần.',
        level: 'm',
      },
      {
        label: 'Chính sách của mỗi cột',
        text: 'Viết điều kiện vào và điều kiện ra cho từng cột, tối đa ba gạch đầu dòng mỗi cái. Kiểm bằng cách nhờ một người mới đọc và tự phân loại năm thẻ; chỗ họ phân loại sai là chỗ chính sách còn mơ hồ.',
        level: 'h',
      },
      {
        label: 'Xử lý loại việc gấp một cách có hệ thống',
        text: 'Thiết kế một làn riêng cho việc khẩn với quy tắc rõ ràng: tối đa bao nhiêu thẻ cùng lúc, ai được quyền gắn nhãn khẩn, và việc gì bị tạm dừng khi đó. Theo dõi bốn tuần và thống kê tỷ lệ việc khẩn thật sự khẩn.',
        level: 'h',
      },
      {
        label: 'Báo cáo dòng chảy hằng tháng',
        text: 'Lập báo cáo một trang gồm ba chỉ số: số việc hoàn thành, thời gian trung vị, và tỷ lệ việc vượt quá ngưỡng cam kết. Trình bày cho các phòng ban đặt hàng và dùng nó để thương lượng lại kỳ vọng thay vì hứa nhanh hơn.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao giới hạn số việc đang làm lại làm tăng lượng việc hoàn thành, dù nghe có vẻ ngược đời?',
        a: 'Vì mỗi hạng mục dở dang đều tạo chi phí chuyển ngữ cảnh và thường nằm chờ ở đâu đó. Khi giảm số việc mở cùng lúc, thời gian chờ trung bình giảm mạnh và cả nhóm dồn sức đẩy nốt những việc gần xong, nên dòng chảy nhanh hơn dù tổng công sức không đổi.',
      },
      {
        q: 'Vì sao nên nhìn phân bố thời gian hoàn thành thay vì chỉ nhìn trung bình?',
        a: 'Vì trải nghiệm của bên đặt hàng bị định hình bởi những lần chờ lâu bất thường. Trung bình có thể đẹp trong khi một phần tư số yêu cầu mất gấp ba lần thời gian đó. Nhìn phân bố cho phép bạn cam kết theo kiểu phần lớn yêu cầu xong trong bao nhiêu ngày, và đi tìm nguyên nhân của phần đuôi.',
      },
      {
        q: 'Cấp trên đưa một việc khẩn khi các cột đã đầy. Cách xử lý giữ được kỷ luật của hệ thống là gì?',
        a: 'Áp dụng quy tắc đã thoả thuận từ trước thay vì thương lượng lại từ đầu: hoặc dùng làn khẩn có trần cố định, hoặc yêu cầu chỉ rõ thẻ nào sẽ bị đẩy ra khỏi cột để nhường chỗ. Điều then chốt là mọi lần chen ngang đều nhìn thấy được và đều có cái giá được nói ra.',
      },
    ],
    plan7:
      'Ngày 1: cùng nhóm vẽ lại bảng theo quy trình thật, thêm các cột chờ đang bị giấu. Ngày 2: định nghĩa mốc bắt đầu và mốc kết thúc, bắt đầu ghi ngày cho mọi thẻ. Ngày 3: viết điều kiện vào và ra cho ba cột quan trọng nhất. Ngày 4: chọn giới hạn việc đang làm cho hai cột bận nhất và công bố. Ngày 5: đổi cách họp hằng ngày sang đọc bảng từ phải sang trái. Ngày 6: ước lượng tỷ lệ thời gian chờ trên 10 thẻ đã xong. Ngày 7: gặp bên gây tắc lớn nhất để thoả thuận nhịp phản hồi cố định.',
    evidence:
      'Vật chứng tốt nhất là bộ số liệu trước và sau: thời gian trung vị từ lúc nhận yêu cầu tới lúc giao, số việc hoàn thành mỗi tháng, và tỷ lệ thời gian chờ trên tổng thời gian, kèm ảnh bảng cũ và bảng mới. Trong phỏng vấn, hãy kể lại con số gây sốc nhất mà việc đo lường phơi bày ra, chẳng hạn phần lớn thời gian một yêu cầu là nằm chờ chứ không phải được làm, rồi mô tả thoả thuận bạn đã đàm phán để rút ngắn khoảng chờ đó. Đây là câu chuyện cải tiến hệ thống, loại bằng chứng hiếm và dễ kiểm chứng.',
    references: [
      { label: 'Atlassian — hướng dẫn về Kanban', url: 'https://www.atlassian.com/agile/kanban', type: 'article' },
      { label: 'Kanban University — tài nguyên về phương pháp Kanban', url: 'https://kanban.university/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 11 · Quản lý chất lượng ────────────────────────────────────────
  guide({
    thesis:
      'Quản lý chất lượng là làm cho sản phẩm đáp ứng đúng những yêu cầu đã được nêu ra, chứ không phải làm cho nó tốt nhất có thể. Nó gồm hai phần khác hẳn nhau mà nhiều nhóm gộp làm một: đảm bảo chất lượng là những việc tác động vào quy trình để lỗi ít sinh ra, còn kiểm soát chất lượng là những việc phát hiện lỗi trên sản phẩm đã làm. Nhóm nào chỉ có phần thứ hai sẽ luôn ở trong trạng thái vá lỗi, vì kiểm tra chỉ đếm được lỗi chứ không làm giảm lỗi.',
    why: {
      work:
        'Chi phí sửa một lỗi tăng nhanh theo thời điểm phát hiện: sửa lúc còn trong bản vẽ rẻ hơn nhiều so với sửa khi hàng đã ra thị trường, và rẻ hơn nữa so với việc mất khách.',
      interview:
        'Ứng viên phân biệt được đảm bảo và kiểm soát chất lượng, và nêu được một thay đổi quy trình cụ thể đã giảm tỷ lệ lỗi, nổi bật hơn hẳn người chỉ kể mình kiểm tra kỹ.',
      study:
        'Áp dụng vào việc học nghĩa là thay vì đọc lại bài nhiều lần rồi hy vọng không sai, bạn dựng bảng kiểm cho các lỗi mình hay mắc và chạy nó trước khi nộp bài.',
      life:
        'Trong việc gia đình như nấu ăn cho nhiều người hay chuẩn bị giấy tờ, một bảng kiểm ngắn viết một lần dùng nhiều lần loại bỏ được đúng những sai sót lặp lại vì quên chứ không vì không biết.',
    },
    framework: [
      {
        name: 'Định nghĩa chất lượng bằng yêu cầu đo được',
        detail:
          'Chất lượng luôn phải quy về một tiêu chuẩn nêu trước: dung sai kích thước, thời gian phản hồi, tỷ lệ lỗi cho phép, mức độ đầy đủ hồ sơ. Không có tiêu chuẩn thì mọi tranh luận về chất lượng đều là tranh luận về khẩu vị.',
      },
      {
        name: 'Đặt chốt kiểm gần nơi sinh lỗi',
        detail:
          'Đưa việc kiểm về càng gần khâu tạo ra lỗi càng tốt, ví dụ kiểm mẫu đầu tiên của một lô trước khi chạy cả lô, hoặc rà bản thiết kế trước khi mua vật tư. Chốt kiểm ở cuối dây chuyền chỉ chặn được hàng lỗi chứ không cứu được chi phí đã tiêu.',
      },
      {
        name: 'Chuẩn hoá bằng bảng kiểm ngắn',
        detail:
          'Với các lỗi lặp lại, viết bảng kiểm tối đa bảy dòng cho khâu đó, gắn vào đúng thời điểm thực hiện. Bảng kiểm dài quá sẽ bị tích cho xong; bảng kiểm ngắn nhắm vào các lỗi thật thì được dùng thật.',
      },
      {
        name: 'Phân tích nguyên nhân của lỗi lặp',
        detail:
          'Với mỗi lỗi xuất hiện lần thứ ba, dừng lại và truy nguyên nhân tới mức có thể sửa được bằng thay đổi quy trình, công cụ hay đào tạo. Nếu kết luận dừng ở chỗ người làm bất cẩn thì gần như chắc chắn bạn chưa đào đủ sâu.',
      },
      {
        name: 'Theo dõi chi phí của chất lượng',
        detail:
          'Ghi hai nhóm số: chi phí phòng ngừa và kiểm tra, so với chi phí do lỗi gây ra gồm làm lại, phế phẩm, đền bù, mất khách. Chính bảng so sánh này là lập luận để xin nguồn lực cho phần phòng ngừa.',
      },
    ],
    scenario:
      'Một xưởng đóng gói thực phẩm khô 40 nhân sự bị khách hàng lớn nhất trả lại ba lô hàng trong hai tháng vì sai nhãn hạn sử dụng và túi hàn không kín. Phản ứng đầu tiên của quản đốc là tăng người kiểm ở cuối chuyền, nhưng tỷ lệ trả hàng chỉ giảm nhẹ trong khi chi phí nhân công tăng. Nhóm cải tiến làm khác: họ ghi lại 60 lỗi gần nhất theo khâu phát sinh và thấy 70% lỗi nhãn bắt nguồn từ một thao tác duy nhất là nhập ngày thủ công vào máy in mỗi đầu ca, và phần lớn lỗi hàn túi xuất hiện trong 20 phút đầu sau khi đổi cuộn màng. Hai biện pháp phòng ngừa được đưa vào: kiểm mẫu đầu ca bắt buộc với một túi in thử được hai người ký xác nhận, và quy định chạy thử ba túi kiểm độ kín sau mỗi lần đổi cuộn màng, có ghi vào sổ ca. Bảng kiểm cho mỗi việc chỉ năm dòng, dán ngay tại máy. Sau ba tháng, số lô bị trả về không, số phế phẩm nội bộ giảm rõ, và chi phí thêm cho phòng ngừa chỉ khoảng vài phút mỗi ca. Điều đáng chú ý là các biện pháp này do chính hai công nhân đứng máy đề xuất trong buổi phân tích, sau khi họ được xem bảng thống kê lỗi theo khâu.',
    comparison: [
      {
        weak: 'Nói về chất lượng bằng tính từ như hàng phải đẹp, dịch vụ phải chỉn chu, không có ngưỡng nào để đo.',
        mature:
          'Quy chất lượng về tiêu chuẩn cụ thể có ngưỡng và cách đo, được thống nhất với bên nhận trước khi bắt đầu sản xuất hay thi công.',
      },
      {
        weak: 'Phản ứng với lỗi bằng cách tăng người kiểm ở cuối và nhắc nhở nhân viên cẩn thận hơn.',
        mature:
          'Truy nguyên nhân tới khâu sinh lỗi và thay đổi quy trình hoặc công cụ tại đó, để cùng một người làm việc theo cách mới sẽ ít sai hơn.',
      },
      {
        weak: 'Coi mọi lỗi là như nhau và xử lý theo thứ tự phát hiện, nên nguồn lực bị phân tán vào những lỗi hiếm và ít thiệt hại.',
        mature:
          'Xếp lỗi theo tần suất và thiệt hại, tập trung vào nhóm nhỏ gây phần lớn tổn thất trước, và ghi lại kết quả để chứng minh hiệu quả.',
      },
    ],
    mistakes: [
      'Nhầm chất lượng với mức độ hoàn hảo, dẫn tới đầu tư quá mức vào những đặc tính mà bên nhận không hề yêu cầu và không sẵn sàng trả tiền, trong khi tiêu chuẩn họ thật sự quan tâm lại không đạt.',
      'Xây bảng kiểm dài hàng chục dòng cho mọi khâu; nhân viên tích hết trong hai phút mà không thật sự kiểm, và bảng kiểm biến thành bằng chứng giả tạo cho việc đã kiểm.',
      'Chỉ đo lỗi mà không đo chi phí do lỗi gây ra, nên không bao giờ chứng minh được giá trị của phòng ngừa và luôn bị cắt ngân sách cho phần này khi công ty siết chi.',
    ],
    worksheet: [
      'Ba tiêu chuẩn chất lượng quan trọng nhất của sản phẩm hoặc dịch vụ bạn đang làm là gì, đo bằng cách nào, ngưỡng chấp nhận là bao nhiêu?',
      'Liệt kê 10 lỗi gần nhất theo khâu phát sinh, không phải theo khâu phát hiện; hai khâu nào đang sinh nhiều lỗi nhất?',
      'Với hai khâu đó, biện pháp phòng ngừa nào có thể đặt ngay tại chỗ, tốn bao nhiêu thời gian mỗi lần thực hiện?',
      'Bảng kiểm năm dòng của bạn cho khâu nguy hiểm nhất gồm những dòng nào, ai ký xác nhận và ghi vào đâu?',
      'Trong ba tháng qua, chi phí do lỗi gây ra ước tính bao nhiêu, gồm làm lại, phế phẩm, đền bù và thời gian xử lý khiếu nại?',
    ],
    exercises: [
      {
        label: 'Viết tiêu chuẩn đo được',
        text: 'Chọn ba yêu cầu chất lượng đang được mô tả bằng tính từ và viết lại thành tiêu chuẩn có phương pháp đo, dụng cụ hoặc phép thử, và ngưỡng chấp nhận. Đưa cho bên nhận xác nhận.',
        level: 'e',
      },
      {
        label: 'Thống kê lỗi theo khâu sinh',
        text: 'Ghi 30 lỗi gần nhất vào bảng gồm mô tả, khâu phát sinh, khâu phát hiện, thiệt hại ước tính. Vẽ biểu đồ cột theo khâu phát sinh và khoanh hai cột cao nhất.',
        level: 'e',
      },
      {
        label: 'Bảng kiểm năm dòng',
        text: 'Viết bảng kiểm tối đa năm dòng cho khâu sinh nhiều lỗi nhất, dán tại chỗ làm việc, và chạy thử hai tuần. Ghi lại số lần bảng kiểm thật sự bắt được lỗi.',
        level: 'e',
      },
      {
        label: 'Dời chốt kiểm về phía trước',
        text: 'Chọn một chốt kiểm đang nằm ở cuối quy trình và thiết kế phương án kiểm sớm hơn, ví dụ kiểm mẫu đầu tiên hoặc rà bản thiết kế. Ước lượng chi phí sửa lỗi ở hai thời điểm và so sánh.',
        level: 'm',
      },
      {
        label: 'Truy nguyên nhân một lỗi lặp',
        text: 'Chọn một lỗi đã xuất hiện ít nhất ba lần và hỏi vì sao năm lần liên tiếp, ghi lại chuỗi trả lời. Dừng khi chạm tới nguyên nhân có thể sửa bằng quy trình, công cụ hoặc đào tạo, rồi thực hiện một biện pháp.',
        level: 'm',
      },
      {
        label: 'Bảng chi phí chất lượng',
        text: 'Lập bảng hai cột cho quý gần nhất: chi phí phòng ngừa và kiểm tra, chi phí do lỗi. Dùng bảng này viết một đề xuất nửa trang xin nguồn lực cho một biện pháp phòng ngừa cụ thể.',
        level: 'm',
      },
      {
        label: 'Rà chéo giữa hai người',
        text: 'Thiết lập cơ chế rà chéo cho các sản phẩm rủi ro cao: người thứ hai kiểm theo danh mục cố định, ghi phát hiện vào sổ chung. Sau bốn tuần, thống kê số lỗi bắt được và thời gian bỏ ra để đánh giá xem cơ chế có đáng duy trì không.',
        level: 'h',
      },
      {
        label: 'Chương trình giảm lỗi 60 ngày',
        text: 'Chọn nhóm lỗi gây thiệt hại lớn nhất, đặt mục tiêu giảm theo con số, triển khai hai biện pháp phòng ngừa và theo dõi hằng tuần. Cuối kỳ viết báo cáo hai trang gồm số trước, số sau, chi phí bỏ ra và bài học.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Phân biệt đảm bảo chất lượng và kiểm soát chất lượng, và vì sao chỉ có kiểm soát là không đủ?',
        a: 'Đảm bảo chất lượng tác động vào quy trình để lỗi ít sinh ra; kiểm soát chất lượng phát hiện lỗi trên sản phẩm đã làm. Chỉ có kiểm soát nghĩa là bạn vẫn trả toàn bộ chi phí tạo ra sản phẩm lỗi và chỉ tránh được việc giao nó đi, nên chi phí không giảm và nhóm mãi ở trạng thái chữa cháy.',
      },
      {
        q: 'Vì sao nói chất lượng là đáp ứng yêu cầu chứ không phải càng tốt càng tốt?',
        a: 'Vì mọi mức chất lượng đều có chi phí, và vượt quá tiêu chuẩn đã thoả thuận là tiêu tiền cho thứ bên nhận không yêu cầu, thường trong khi các tiêu chuẩn họ thật sự quan tâm còn chưa đạt. Xác định yêu cầu trước giúp phân bổ nỗ lực đúng chỗ và giúp việc nghiệm thu có căn cứ.',
      },
      {
        q: 'Một lỗi lặp lại lần thứ ba và kết luận điều tra là nhân viên bất cẩn. Vấn đề của kết luận này ở đâu?',
        a: 'Nó dừng ở người thay vì ở hệ thống, nên biện pháp duy nhất còn lại là nhắc nhở, thứ không có tác dụng lâu dài. Cần đào tiếp: thao tác đó có dễ làm sai không, có tín hiệu phản hồi ngay không, có bảng kiểm hay công cụ chống nhầm không, và điều kiện làm việc lúc đó thế nào.',
      },
    ],
    plan7:
      'Ngày 1: viết lại ba tiêu chuẩn chất lượng thành dạng đo được và gửi bên nhận xác nhận. Ngày 2: thống kê 30 lỗi gần nhất theo khâu phát sinh. Ngày 3: chọn khâu sinh nhiều lỗi nhất và quan sát trực tiếp tại chỗ trong một ca. Ngày 4: cùng người trực tiếp làm viết bảng kiểm năm dòng và dán tại chỗ. Ngày 5: truy nguyên nhân một lỗi lặp bằng chuỗi câu hỏi vì sao và chọn một biện pháp. Ngày 6: lập bảng chi phí chất lượng cho quý gần nhất. Ngày 7: trình bày cho quản lý một đề xuất phòng ngừa kèm số liệu và cách đo kết quả sau 60 ngày.',
    evidence:
      'Bằng chứng thuyết phục nhất là bộ số trước và sau của một chương trình giảm lỗi cụ thể: tỷ lệ lỗi, số lô bị trả, chi phí làm lại, kèm mô tả biện pháp phòng ngừa đã áp dụng và chi phí của nó. Giữ lại bảng kiểm bạn đã thiết kế cùng ghi chú về những lỗi nó bắt được. Trong phỏng vấn, hãy nhấn vào chỗ bạn chuyển từ tăng cường kiểm tra sang thay đổi quy trình, và nêu con số chứng minh; đây là dấu hiệu bạn hiểu chất lượng ở tầng hệ thống chứ không ở tầng nhắc nhở.',
    references: [
      { label: 'ISO — giới thiệu bộ tiêu chuẩn quản lý chất lượng ISO 9001', url: 'https://www.iso.org/iso-9001-quality-management.html', type: 'article', needsReview: true },
      { label: 'ASQ — Hiệp hội Chất lượng Hoa Kỳ, tài nguyên về công cụ chất lượng', url: 'https://asq.org/quality-resources', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 12 · Quản lý stakeholder ───────────────────────────────────────
  guide({
    thesis:
      'Stakeholder là bất kỳ ai có thể ảnh hưởng tới dự án hoặc bị dự án ảnh hưởng, kể cả người không nằm trong sơ đồ tổ chức và không ký bất cứ giấy tờ nào. Quản lý stakeholder là công việc nhận diện đầy đủ những người đó, hiểu điều mỗi bên thật sự cần và điều họ sợ, rồi thiết kế nhịp trao đổi phù hợp cho từng nhóm. Dự án hiếm khi chết vì kỹ thuật; nó chết vì một bên có quyền phủ quyết được mời vào quá muộn, khi mọi thứ đã lỡ được quyết theo hướng họ không chấp nhận.',
    why: {
      work:
        'Cùng một kết quả kỹ thuật có thể được coi là thành công hay thất bại tuỳ theo kỳ vọng của các bên đã được quản lý ra sao trong suốt quá trình.',
      interview:
        'Câu hỏi về lần bạn phải làm việc với một bên khó tính là cơ hội thể hiện phương pháp: bạn đã tìm hiểu mối quan tâm thật của họ thế nào và đã thay đổi cách trao đổi ra sao, thay vì kể chuyện chịu đựng.',
      study:
        'Làm đồ án nhóm có giảng viên hướng dẫn, hội đồng chấm và doanh nghiệp đặt hàng chính là bài tập thu nhỏ: ba bên có tiêu chí khác nhau và cần được cập nhật theo cách khác nhau.',
      life:
        'Trong việc chung của gia đình hoặc khu dân cư, việc hỏi trước ý kiến người bị ảnh hưởng nhiều nhất thường quyết định kế hoạch có đi được tới cuối hay không.',
    },
    framework: [
      {
        name: 'Liệt kê rộng trước khi lọc',
        detail:
          'Đi qua ba hướng để không sót ai: theo dòng công việc từ đầu vào tới người dùng cuối, theo sơ đồ tổ chức, và theo câu hỏi ai sẽ phải đổi thói quen làm việc vì dự án này. Nhóm thứ ba là nhóm hay bị quên nhất và cũng hay phản đối mạnh nhất.',
      },
      {
        name: 'Xếp theo quyền và mức quan tâm',
        detail:
          'Đặt mỗi bên lên lưới hai chiều quyền ảnh hưởng và mức quan tâm để chọn cách đối xử: người quyền cao quan tâm cao thì cùng làm việc chặt, quyền cao quan tâm thấp thì giữ hài lòng bằng thông tin gọn, quan tâm cao quyền thấp thì cập nhật đều, còn lại thì theo dõi.',
      },
      {
        name: 'Tìm mối quan tâm thật',
        detail:
          'Gặp riêng và hỏi ba câu: điều gì làm anh chị coi dự án này là thành công, điều gì anh chị lo nhất, và anh chị muốn nghe tin theo cách nào. Câu trả lời thường khác hẳn những gì họ phát biểu trong cuộc họp đông người.',
      },
      {
        name: 'Thiết kế nhịp trao đổi riêng',
        detail:
          'Mỗi nhóm có kênh, tần suất và định dạng riêng: một trang mỗi tuần cho lãnh đạo, buổi demo hai tuần một lần cho người dùng, tin nhắn ngắn khi có mốc cho bên hỗ trợ. Cùng một nội dung nhưng sai định dạng thì coi như chưa truyền đạt.',
      },
      {
        name: 'Cập nhật khi bàn cờ thay đổi',
        detail:
          'Khi có người mới thay thế, khi cơ cấu tổ chức đổi hoặc khi dự án bước sang giai đoạn khác, danh sách và bản đồ phải được vẽ lại. Một người vốn ở nhóm theo dõi có thể đột nhiên trở thành người có quyền phủ quyết.',
      },
    ],
    scenario:
      'Một quỹ từ thiện tài trợ lắp hệ thống lọc nước cho một trường tiểu học vùng cao. Bản kế hoạch ban đầu chỉ nhắc tới ba bên: nhà tài trợ, nhà thầu lắp đặt và ban giám hiệu. Người điều phối dự án dành hai ngày đi thực địa và liệt kê lại theo câu hỏi ai phải đổi thói quen vì dự án này, danh sách nở ra thành bảy bên, trong đó có hai bên chưa từng được hỏi ý kiến: các cô nuôi phụ trách bếp ăn, những người sẽ phải vận hành và vệ sinh hệ thống mỗi ngày, và phòng giáo dục huyện, đơn vị phải phê duyệt việc lắp đặt thay đổi hạ tầng. Việc gặp riêng cho ra hai thông tin quyết định: các cô nuôi lo nhất là hệ thống phức tạp và không có ai sửa khi hỏng, còn phòng giáo dục cần hồ sơ theo mẫu và cần ít nhất ba tuần xử lý. Kế hoạch được sửa: chọn thiết bị đơn giản hơn nhưng có đại lý bảo trì trong tỉnh, thêm một buổi hướng dẫn vận hành và một bảng hướng dẫn dán tại chỗ, đồng thời nộp hồ sơ sớm bốn tuần. Nhịp trao đổi được thiết kế riêng: nhà tài trợ nhận báo cáo ảnh và chi phí hằng tháng, ban giám hiệu nhận tin nhắn theo mốc, các cô nuôi được tham gia buổi nghiệm thu. Hệ thống chạy đúng hạn và sáu tháng sau vẫn được vận hành đều — kết quả mà bản kế hoạch ba bên ban đầu khó có được.',
    comparison: [
      {
        weak: 'Chỉ làm việc với người ký duyệt, coi những người thực thi và người bị ảnh hưởng là chuyện của nội bộ bên kia.',
        mature:
          'Nhận diện cả người có quyền lẫn người phải đổi thói quen, và dành thời gian riêng cho nhóm thứ hai vì họ quyết định kết quả có sống sót sau bàn giao hay không.',
      },
      {
        weak: 'Gửi một bản cập nhật giống hệt nhau cho tất cả mọi người, dài và đầy chi tiết kỹ thuật.',
        mature:
          'Cùng một sự thật nhưng khác định dạng theo nhóm: lãnh đạo nhận một trang có quyết định cần lấy, người dùng nhận bản demo, đội hỗ trợ nhận mốc và việc cần chuẩn bị.',
      },
      {
        weak: 'Chỉ liên hệ khi cần xin phê duyệt hoặc khi có sự cố, khiến mỗi lần xuất hiện đều mang tin xấu hoặc mang yêu cầu.',
        mature:
          'Duy trì nhịp đều đặn kể cả khi không có gì bất thường, để lúc cần một quyết định gấp thì quan hệ và bối cảnh đã sẵn có.',
      },
    ],
    mistakes: [
      'Lập bản đồ stakeholder một lần ở giai đoạn khởi động rồi không cập nhật, trong khi nhân sự thay đổi và một người mới có thể mang theo tiêu chí đánh giá hoàn toàn khác.',
      'Nhầm sự im lặng với sự đồng thuận: một bên không phản đối trong cuộc họp đông người thường chỉ có nghĩa là họ chưa nói, và họ sẽ nói vào lúc bất lợi nhất cho dự án.',
      'Chỉ ghi nhận yêu cầu bề mặt mà không tìm mối quan tâm phía sau, nên đưa ra giải pháp đúng chữ nhưng sai ý, và bên kia vẫn không hài lòng dù bạn đã làm đúng điều họ nói.',
    ],
    worksheet: [
      'Liệt kê tất cả các bên theo ba hướng: dòng công việc, sơ đồ tổ chức, và ai phải đổi thói quen; bạn có bao nhiêu tên và bao nhiêu tên mới xuất hiện nhờ hướng thứ ba?',
      'Đặt từng bên lên lưới quyền ảnh hưởng và mức quan tâm; ai đang ở ô quyền cao mà bạn ít trao đổi nhất?',
      'Với ba bên quan trọng nhất, điều họ coi là thành công và điều họ lo nhất là gì — bạn biết điều này nhờ họ nói hay nhờ bạn suy đoán?',
      'Kênh, tần suất và định dạng cập nhật cho từng nhóm là gì, và lần gần nhất bạn kiểm xem định dạng đó có được đọc thật hay không là khi nào?',
      'Sự kiện nào sắp tới có thể làm bàn cờ thay đổi — nhân sự mới, tái cơ cấu, đổi giai đoạn dự án — và bạn sẽ vẽ lại bản đồ vào lúc nào?',
    ],
    exercises: [
      {
        label: 'Liệt kê theo ba hướng',
        text: 'Dành 30 phút liệt kê các bên theo ba hướng riêng biệt, mỗi hướng làm thành một danh sách. Hợp nhất và đánh dấu những tên chỉ xuất hiện ở đúng một hướng, vì đó là nhóm dễ bị bỏ quên nhất.',
        level: 'e',
      },
      {
        label: 'Lưới quyền và quan tâm',
        text: 'Vẽ lưới hai chiều và đặt mọi bên lên đó bằng giấy dán. Nhờ một đồng nghiệp đặt độc lập rồi so hai bản; các vị trí lệch nhau là chỗ cần đi hỏi thêm thay vì tranh luận.',
        level: 'e',
      },
      {
        label: 'Ba câu hỏi gặp riêng',
        text: 'Gặp riêng ba bên quan trọng trong tuần, mỗi buổi 20 phút, hỏi đúng ba câu về định nghĩa thành công, nỗi lo lớn nhất và cách họ muốn nhận tin. Ghi nguyên văn và so với những gì bạn từng giả định.',
        level: 'm',
      },
      {
        label: 'Ma trận trách nhiệm',
        text: 'Lập bảng phân vai cho 10 quyết định lớn của dự án, ghi rõ ai làm, ai chịu trách nhiệm cuối, ai cần hỏi ý kiến, ai chỉ cần được thông báo. Gửi bảng đi và xử lý mọi chỗ có người phản đối vai của mình.',
        level: 'm',
      },
      {
        label: 'Kế hoạch trao đổi một trang',
        text: 'Viết bảng gồm bốn cột: nhóm, nội dung họ cần, định dạng, tần suất. Thử chạy hai tuần rồi hỏi mỗi nhóm một câu duy nhất là bản cập nhật vừa rồi có thứ gì thừa và thiếu thứ gì.',
        level: 'm',
      },
      {
        label: 'Tìm mối quan tâm phía sau yêu cầu',
        text: 'Chọn một yêu cầu bạn thấy vô lý từ một bên liên quan. Đặt câu hỏi điều gì khiến việc đó quan trọng với anh chị, ít nhất ba lần theo chiều sâu. Đề xuất một giải pháp khác đáp ứng mối quan tâm đó với chi phí thấp hơn.',
        level: 'h',
      },
      {
        label: 'Đưa bên phản đối vào sớm',
        text: 'Xác định bên có khả năng phản đối mạnh nhất và mời họ tham gia một buổi thiết kế phương án ở giai đoạn còn sớm. Ghi lại những điều chỉnh sinh ra từ buổi đó và ước lượng chi phí nếu phát hiện muộn hơn ba tháng.',
        level: 'h',
      },
      {
        label: 'Rà bản đồ sau mỗi giai đoạn',
        text: 'Đặt lịch vẽ lại bản đồ stakeholder tại mỗi mốc lớn. Sau ba lần, thống kê bao nhiêu bên đã đổi vị trí trên lưới và bao nhiêu tên mới xuất hiện, rồi viết một đoạn về ý nghĩa của con số đó với cách bạn phân bổ thời gian.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nhóm người phải đổi thói quen làm việc lại quan trọng ngang với người ký duyệt?',
        a: 'Vì người ký duyệt quyết định dự án có được bắt đầu hay không, còn nhóm phải đổi thói quen quyết định kết quả có được dùng thật sau bàn giao hay không. Rất nhiều hệ thống được nghiệm thu xong rồi bị bỏ xó vì những người vận hành hằng ngày chưa bao giờ được hỏi ý kiến.',
      },
      {
        q: 'Vì sao im lặng trong cuộc họp không nên được hiểu là đồng thuận?',
        a: 'Vì chi phí xã hội của việc phản đối trước đông người rất cao, nhất là khi có mặt cấp trên. Người ta thường chọn im lặng rồi bày tỏ sau, qua kênh khác hoặc vào thời điểm phê duyệt. Cách kiểm là gặp riêng và hỏi thẳng điều họ lo nhất, hoặc mời họ nêu rủi ro thay vì nêu phản đối.',
      },
      {
        q: 'Một bên yêu cầu thêm một báo cáo mà bạn cho là không cần thiết. Cách xử lý tốt hơn việc từ chối hoặc chấp nhận ngay là gì?',
        a: 'Tìm mối quan tâm phía sau bằng câu hỏi điều gì khiến báo cáo này quan trọng với họ. Thường thì nhu cầu thật là được biết sớm khi có rủi ro chứ không phải bản báo cáo. Khi đã rõ nhu cầu, bạn có thể đề xuất cách đáp ứng rẻ hơn, chẳng hạn một cuộc gọi 10 phút mỗi tuần hoặc quyền truy cập bảng theo dõi.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê các bên theo ba hướng và hợp nhất thành một danh sách. Ngày 2: đặt tất cả lên lưới quyền và quan tâm, so với bản của một đồng nghiệp. Ngày 3 và 4: gặp riêng ba bên quan trọng nhất với ba câu hỏi cố định. Ngày 5: lập ma trận trách nhiệm cho 10 quyết định lớn. Ngày 6: viết kế hoạch trao đổi một trang theo bốn cột. Ngày 7: gửi bản cập nhật đầu tiên theo đúng định dạng riêng của từng nhóm và xin phản hồi về nội dung thừa thiếu.',
    evidence:
      'Giữ lại bản đồ stakeholder có ít nhất hai phiên bản theo thời gian cùng kế hoạch trao đổi một trang, và quan trọng hơn là ghi chú về một điều chỉnh trong dự án sinh ra từ việc gặp riêng một bên liên quan. Trong phỏng vấn, câu chuyện có sức nặng là lần bạn phát hiện một bên quan trọng chưa từng được hỏi, đã mời họ vào sớm, và điều đó đã đổi thiết kế phương án như thế nào. Nó cho thấy bạn coi việc lập bản đồ là công cụ làm việc chứ không phải một mục trong hồ sơ.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Managing People', url: 'https://hbr.org/topic/subject/managing-people', type: 'article' },
    ],
  }),

  // ── Chương 13 · Báo cáo trạng thái dự án ──────────────────────────────────
  guide({
    thesis:
      'Một báo cáo trạng thái tốt không nhằm chứng minh nhóm đang bận mà nhằm giúp người đọc ra quyết định. Nó trả lời bốn câu theo đúng thứ tự: dự án đang ở đâu so với cam kết, điều gì đã đổi kể từ lần báo trước, rủi ro nào đang lớn lên, và tôi cần anh chị quyết hoặc gỡ giúp việc gì. Thước đo chất lượng của báo cáo không phải độ dài mà là việc tin xấu có xuất hiện trong đó sớm hay không, vì báo cáo chỉ toàn màu xanh là báo cáo đã mất chức năng cảnh báo.',
    why: {
      work:
        'Người ra quyết định thường đọc trong hai phút giữa hai cuộc họp; báo cáo nào bắt họ tự đi tìm ý chính sẽ bị bỏ qua, và lần sau bạn mất luôn kênh xin hỗ trợ.',
      interview:
        'Nhà tuyển dụng cho vị trí quản lý hay hỏi bạn báo tin xấu cho cấp trên thế nào. Người có phương pháp trả lời bằng cấu trúc và bằng thời điểm báo, không bằng cách chọn từ ngữ nhẹ đi.',
      study:
        'Báo cáo tiến độ cho giảng viên hướng dẫn theo bốn câu này giúp buổi gặp đi thẳng vào chỗ cần gỡ, thay vì trôi hết thời gian vào việc kể lại những gì đã làm.',
      life:
        'Cùng nguyên tắc khi cập nhật cho gia đình về một việc chung: nêu trạng thái so với dự kiến, thay đổi mới, điều đáng lo, và điều bạn cần người khác quyết — ngắn nhưng đủ để không ai bất ngờ.',
    },
    framework: [
      {
        name: 'Mở bằng kết luận',
        detail:
          'Dòng đầu tiên nói trạng thái tổng thể và ngày về đích dự kiến hiện tại, kèm chênh lệch so với cam kết. Người đọc phải nắm được tình hình ngay cả khi chỉ đọc đúng một dòng đó.',
      },
      {
        name: 'Nêu thay đổi kể từ lần trước',
        detail:
          'Chỉ báo cáo phần đã đổi: mốc nào đã đạt, mốc nào dịch chuyển và vì sao, quyết định nào đã được đưa ra. Lặp lại toàn bộ bối cảnh mỗi tuần làm loãng chính phần thông tin mới.',
      },
      {
        name: 'Trình bày số liệu ít nhưng ổn định',
        detail:
          'Chọn ba đến năm chỉ số và giữ nguyên bộ đó suốt dự án: tiến độ so với kế hoạch, chi tiêu so với ngân sách, số hạng mục đã nghiệm thu, mức dự phòng còn lại. Đổi chỉ số giữa chừng làm mất khả năng so sánh theo thời gian.',
      },
      {
        name: 'Đưa rủi ro kèm dấu hiệu và đề xuất',
        detail:
          'Mỗi rủi ro nêu trong báo cáo phải có dấu hiệu đã quan sát được, tác động ước lượng và đề xuất hành động. Nêu nỗi lo mà không kèm đề xuất sẽ đẩy toàn bộ gánh nặng suy nghĩ sang người đọc và thường không dẫn tới hành động nào.',
      },
      {
        name: 'Kết bằng yêu cầu cụ thể',
        detail:
          'Ghi rõ bạn cần gì, từ ai, trước ngày nào: một quyết định, một nguồn lực, một cuộc gọi gỡ tắc với phòng ban khác. Báo cáo không có phần này chỉ là thông tin một chiều và không tạo ra thay đổi nào.',
      },
    ],
    scenario:
      'Quản lý dự án mở rộng dây chuyền của một nhà máy chế biến nông sản gửi báo cáo tuần cho ban giám đốc. Trong sáu tuần đầu, báo cáo dài bốn trang, liệt kê mọi việc đã làm, và trạng thái tuần nào cũng ghi màu xanh. Tới tuần thứ bảy, anh phải thông báo rằng thiết bị nhập khẩu sẽ về chậm năm tuần, và ban giám đốc phản ứng rất gay gắt vì họ hoàn toàn bất ngờ. Nhìn lại, dấu hiệu đã xuất hiện từ tuần thứ tư khi nhà cung cấp chưa xác nhận lịch tàu, nhưng nó nằm ở trang ba, dưới một mục tên là thông tin khác. Anh thiết kế lại báo cáo còn đúng một trang với năm khối cố định: một dòng kết luận và ngày về đích hiện tại, các thay đổi từ tuần trước, bốn chỉ số giữ nguyên suốt dự án, tối đa ba rủi ro kèm dấu hiệu và đề xuất, và phần cần ban giám đốc quyết trước ngày cụ thể. Anh cũng thêm một quy tắc riêng: bất kỳ tin xấu nào ảnh hưởng tới ngày về đích đều được gọi điện báo trong 24 giờ, báo cáo chỉ ghi nhận lại. Từ đó, hai lần dịch mốc tiếp theo đều được xử lý bằng quyết định điều chỉnh sớm chứ không bằng tranh cãi, và ban giám đốc bắt đầu dùng chính bản một trang này để trao đổi với ngân hàng cấp vốn.',
    comparison: [
      {
        weak: 'Bắt đầu báo cáo bằng danh sách công việc đã làm trong tuần, để phần trạng thái và phần rủi ro nằm ở cuối.',
        mature:
          'Bắt đầu bằng kết luận và ngày về đích hiện tại, các chi tiết bổ trợ nằm phía sau cho ai muốn đọc sâu.',
      },
      {
        weak: 'Giữ trạng thái màu xanh cho tới khi không thể giấu được nữa, vì sợ bị đánh giá là quản lý kém.',
        mature:
          'Chuyển trạng thái sang cảnh báo ngay khi dấu hiệu xuất hiện, kèm đề xuất phương án — người quản lý được đánh giá qua thời điểm báo, không qua màu của ô trạng thái.',
      },
      {
        weak: 'Đổi bộ chỉ số theo từng giai đoạn tuỳ theo cái nào đang đẹp, khiến không ai so sánh được tuần này với tháng trước.',
        mature:
          'Giữ nguyên một bộ chỉ số nhỏ suốt dự án, kể cả khi có tuần chúng cho thấy tình hình xấu, vì giá trị nằm ở tính so sánh được.',
      },
    ],
    mistakes: [
      'Viết báo cáo cho chính mình thay vì cho người đọc: đầy thuật ngữ nội bộ, tên hạng mục viết tắt, không có ngày cụ thể, khiến người ngoài nhóm phải hỏi lại mới hiểu.',
      'Báo cáo phần trăm hoàn thành do từng người tự ước lượng và cộng lại, tạo ra con số nghe khoa học nhưng không dựa trên hạng mục nào đã được nghiệm thu thật.',
      'Dùng báo cáo như kênh duy nhất để truyền tin xấu, nên tin quan trọng phải chờ tới ngày gửi định kỳ; những việc ảnh hưởng tới ngày về đích cần một cuộc gọi ngay, còn báo cáo chỉ để ghi nhận.',
    ],
    worksheet: [
      'Dòng kết luận một câu cho tuần này của bạn là gì, gồm trạng thái tổng thể và ngày về đích dự kiến hiện tại?',
      'Bốn chỉ số bạn sẽ giữ nguyên suốt dự án là gì, lấy số từ đâu, và ai chịu trách nhiệm cập nhật chúng?',
      'Ba rủi ro đưa vào báo cáo tuần này là gì, dấu hiệu nào đã quan sát được, và đề xuất của bạn cho từng cái?',
      'Bạn cần người đọc quyết hoặc gỡ giúp điều gì, trước ngày nào, và nếu không có quyết định đó thì hậu quả là gì?',
      'Tin xấu gần nhất bạn đã báo cách bao lâu kể từ khi biết? Nếu quá 48 giờ, điều gì đã khiến bạn trì hoãn?',
    ],
    exercises: [
      {
        label: 'Rút gọn về một trang',
        text: 'Lấy báo cáo gần nhất và viết lại thành đúng một trang theo năm khối cố định. Đưa cho một người không trong dự án đọc trong hai phút rồi hỏi họ tóm tắt tình hình; chỗ họ tóm sai là chỗ bạn viết chưa rõ.',
        level: 'e',
      },
      {
        label: 'Viết dòng kết luận',
        text: 'Trong bốn tuần liên tiếp, viết dòng kết luận trước khi viết bất kỳ phần nào khác của báo cáo. So bốn dòng đó cạnh nhau và xem chúng có kể được một câu chuyện mạch lạc về dự án không.',
        level: 'e',
      },
      {
        label: 'Chốt bộ chỉ số',
        text: 'Chọn bốn chỉ số và với mỗi cái ghi nguồn dữ liệu, cách tính, người cập nhật và ngày cập nhật hằng tuần. Cam kết không đổi bộ này trong ba tháng và dán cam kết đó vào đầu tài liệu.',
        level: 'e',
      },
      {
        label: 'Đổi cách đo tiến độ',
        text: 'Thay cột phần trăm tự ước lượng bằng số hạng mục đã được nghiệm thu trên tổng số hạng mục. Chạy song song hai cách trong ba tuần và ghi lại chênh lệch giữa hai con số.',
        level: 'm',
      },
      {
        label: 'Rủi ro kèm đề xuất',
        text: 'Viết lại ba rủi ro theo mẫu bốn phần: dấu hiệu đã thấy, tác động ước lượng bằng ngày hoặc tiền, đề xuất hành động, và người cần quyết. Gửi đi và ghi lại bao nhiêu đề xuất được phản hồi trong một tuần.',
        level: 'm',
      },
      {
        label: 'Quy tắc báo tin xấu 24 giờ',
        text: 'Thoả thuận với cấp trên một quy tắc: mọi thông tin ảnh hưởng tới ngày về đích hoặc ngân sách được gọi báo trong 24 giờ. Thực hiện đủ bốn tuần và ghi lại phản ứng thật so với điều bạn đã lo sợ.',
        level: 'm',
      },
      {
        label: 'Phỏng vấn người đọc báo cáo',
        text: 'Gặp ba người nhận báo cáo và hỏi họ dùng nó để làm gì, đọc phần nào trước, phần nào chưa bao giờ đọc. Cắt bỏ những phần không ai đọc và bổ sung thứ họ đang phải hỏi thêm qua kênh khác.',
        level: 'h',
      },
      {
        label: 'Bộ báo cáo cho ba đối tượng',
        text: 'Từ cùng một nguồn dữ liệu, tạo ba bản: một trang cho lãnh đạo, bảng chi tiết cho nhóm thực hiện, và bản tóm tắt cho bên đặt hàng. Chạy hai tuần và đo thời gian bạn bỏ ra cho toàn bộ bộ ba, rồi tối ưu để không quá 90 phút mỗi tuần.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao báo cáo luôn màu xanh lại là dấu hiệu xấu chứ không phải dấu hiệu tốt?',
        a: 'Vì mọi dự án đều có bất định, nên một chuỗi dài toàn màu xanh thường nghĩa là các dấu hiệu cảnh báo không được đưa vào báo cáo. Khi đó báo cáo mất chức năng chính là cảnh báo sớm, và tin xấu sẽ xuất hiện muộn, đúng lúc chi phí xử lý đã cao nhất.',
      },
      {
        q: 'Vì sao đo tiến độ bằng số hạng mục đã nghiệm thu tốt hơn đo bằng phần trăm tự ước lượng?',
        a: 'Vì phần trăm tự ước lượng phụ thuộc vào cảm nhận và có xu hướng đứng lâu ở mức gần xong, còn hạng mục nghiệm thu là sự kiện có bằng chứng và có người xác nhận. Con số thứ hai khó tô vẽ hơn và tương quan tốt hơn với giá trị thật đã tạo ra.',
      },
      {
        q: 'Bạn vừa biết một tin có thể làm dự án trễ ba tuần nhưng chưa có đủ thông tin để đề xuất phương án. Nên chờ hay báo ngay?',
        a: 'Báo ngay, nhưng phải nói rõ mức độ chắc chắn và thời điểm sẽ có phương án. Cấu trúc gọn là: điều tôi biết, điều tôi chưa biết, việc tôi đang làm để biết, và ngày tôi sẽ quay lại với đề xuất. Chờ cho đủ thông tin thường đồng nghĩa với việc lấy đi cơ hội xử lý sớm của người có thẩm quyền.',
      },
    ],
    plan7:
      'Ngày 1: phỏng vấn ba người nhận báo cáo về cách họ dùng nó. Ngày 2: chốt bộ bốn chỉ số kèm nguồn dữ liệu và người cập nhật. Ngày 3: thiết kế mẫu một trang với năm khối cố định. Ngày 4: chuyển cách đo tiến độ sang số hạng mục đã nghiệm thu. Ngày 5: viết lại ba rủi ro theo mẫu bốn phần kèm đề xuất. Ngày 6: thoả thuận quy tắc báo tin xấu trong 24 giờ với cấp trên. Ngày 7: gửi bản báo cáo mới và xin phản hồi về phần thừa, phần thiếu.',
    evidence:
      'Giữ lại một chuỗi bốn đến sáu bản báo cáo một trang liên tiếp, đã che thông tin nhạy cảm, trong đó thấy được trạng thái chuyển sang cảnh báo trước khi vấn đề nổ ra và thấy được đề xuất của bạn dẫn tới quyết định gì. Đó là bằng chứng khó làm giả cho năng lực cảnh báo sớm. Trong phỏng vấn, dùng nó cho câu hỏi về báo tin xấu: kể quy tắc 24 giờ bạn tự đặt, phản ứng thật của cấp trên, và điều đã thay đổi trong cách tổ chức ra quyết định nhờ báo cáo ngắn hơn.',
    references: [
      { label: 'Atlassian — hướng dẫn báo cáo và theo dõi tiến độ dự án', url: 'https://www.atlassian.com/agile/project-management', type: 'article' },
      { label: 'ProjectManagement.com — tài nguyên và mẫu tài liệu quản lý dự án', url: 'https://www.projectmanagement.com/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 14 · Kết thúc và rút kinh nghiệm dự án ─────────────────────────
  guide({
    thesis:
      'Kết thúc dự án là một công đoạn có khối lượng công việc thật, không phải khoảnh khắc bàn giao xong rồi ai về chỗ nấy. Nó gồm bốn phần: đóng phần cam kết với bên nhận, đóng phần hành chính và tài chính, chuyển giao cho đội vận hành, và rút kinh nghiệm thành thứ dùng được cho dự án sau. Phần thứ tư là phần bị bỏ nhiều nhất và cũng là phần duy nhất biến chi phí đã trả bằng thời gian và tiền thành tài sản cho lần sau.',
    why: {
      work:
        'Dự án không được đóng đúng cách để lại đuôi kéo dài hàng tháng: hoá đơn chưa quyết toán, tài khoản chưa thu hồi, người dùng vẫn gọi cho nhóm cũ, và không ai còn thời gian được phân bổ cho những việc đó.',
      interview:
        'Ứng viên kể được một buổi rút kinh nghiệm dẫn tới thay đổi quy trình cụ thể ở dự án kế tiếp cho thấy khả năng học có hệ thống, thứ hiếm hơn nhiều so với khả năng chạy dự án.',
      study:
        'Sau mỗi kỳ thi hoặc mỗi đồ án, một buổi tự rà soát 45 phút với ba câu hỏi cố định thường tạo ra nhiều cải thiện hơn cả chục giờ học thêm không có định hướng.',
      life:
        'Sau một chuyến đi hoặc một sự kiện gia đình, mười phút ghi lại thứ nên giữ và thứ nên bỏ giúp lần tổ chức sau nhẹ hơn hẳn, vì phần lớn rắc rối là lặp lại chứ không mới.',
    },
    framework: [
      {
        name: 'Nghiệm thu và đóng cam kết',
        detail:
          'Đi qua từng dòng tiêu chí nghiệm thu đã thoả thuận, ghi rõ đạt hay chưa, phần chưa đạt thì ghi hạn xử lý và người chịu trách nhiệm. Kết thúc bằng một biên bản có chữ ký, kể cả với dự án nội bộ.',
      },
      {
        name: 'Đóng hành chính và tài chính',
        detail:
          'Quyết toán chi phí, đóng hợp đồng với nhà cung cấp, thu hồi tài khoản và thiết bị, lưu trữ tài liệu vào nơi tra cứu được. Lập bảng kiểm cho phần này vì đây là chỗ dễ quên nhất khi mọi người đã chuyển sang việc mới.',
      },
      {
        name: 'Chuyển giao cho vận hành',
        detail:
          'Bàn giao gồm tài liệu hướng dẫn, đào tạo người vận hành, danh sách sự cố đã biết, và một khoảng thời gian hỗ trợ có thời hạn rõ ràng. Ghi rõ ngày kết thúc hỗ trợ để tránh tình trạng đội dự án bị níu vô thời hạn.',
      },
      {
        name: 'Rút kinh nghiệm không đổ lỗi',
        detail:
          'Tổ chức buổi nhìn lại dựa trên dòng thời gian sự kiện và dữ liệu thật, tập trung vào điều kiện đã khiến quyết định lúc đó có vẻ hợp lý, thay vì vào người ra quyết định. Người tham dự phải gồm cả những vai ngoài nhóm lõi.',
      },
      {
        name: 'Biến bài học thành thay đổi có địa chỉ',
        detail:
          'Mỗi bài học phải kết thúc ở một trong ba chỗ: sửa mẫu tài liệu, sửa bảng kiểm, hoặc sửa quy tắc làm việc, kèm người chịu trách nhiệm và ngày. Bài học chỉ nằm trong biên bản thì gần như chắc chắn sẽ lặp lại nguyên vẹn ở dự án sau.',
      },
    ],
    scenario:
      'Một công ty 300 nhân sự tổ chức lễ kỷ niệm 10 năm thành lập với 500 khách. Sự kiện diễn ra thành công, và theo thói quen mọi người giải tán ngay sau đó. Ba tuần sau, phòng kế toán vẫn còn 11 hoá đơn chưa rõ thuộc hạng mục nào, hai thiết bị thuê chưa trả và bị tính thêm phí, còn kho ảnh thì nằm rải rác trong máy của bốn người. Trưởng ban tổ chức quyết định làm lại phần kết thúc cho đàng hoàng: một buổi hai giờ với bảng kiểm đóng dự án gồm 18 dòng, phân công dứt điểm từng dòng trong ba ngày. Sau đó là buổi rút kinh nghiệm 90 phút với 12 người, gồm cả hai bạn hậu cần và một người của nhà cung cấp âm thanh. Nhóm dựng dòng thời gian sự kiện và tìm ra ba điểm nghẽn thật: khâu đón khách bị dồn vì chỉ có một cửa kiểm tra danh sách, kịch bản sân khấu được chốt trước giờ diễn có 90 phút, và việc thanh toán tạm ứng phải qua ba chữ ký nên hai nhà cung cấp suýt không giao hàng. Ba bài học được chuyển thành ba thay đổi có địa chỉ: mẫu kế hoạch sự kiện thêm mục sơ đồ đón khách với tối thiểu hai luồng, quy tắc chốt kịch bản trước 48 giờ, và đề xuất phòng tài chính cấp hạn mức tạm ứng riêng cho sự kiện. Năm sau, cả ba đều được áp dụng và không tái diễn.',
    comparison: [
      {
        weak: 'Coi ngày bàn giao là ngày kết thúc, không phân bổ thời gian cho phần đóng hành chính, nên phần việc đó rơi vào lúc rảnh của một vài người và kéo dài hàng tháng.',
        mature:
          'Đưa hẳn một gói công việc đóng dự án vào kế hoạch với thời lượng và người chịu trách nhiệm, hoàn thành theo bảng kiểm trong một khoảng thời gian xác định.',
      },
      {
        weak: 'Buổi rút kinh nghiệm biến thành nơi truy trách nhiệm, nên những người biết rõ vấn đề nhất chọn im lặng và thông tin quan trọng nhất không bao giờ được nói ra.',
        mature:
          'Đặt luật rõ ngay đầu buổi là tập trung vào điều kiện và hệ thống, dùng dòng thời gian và dữ liệu làm nền, mời cả người ngoài nhóm lõi để có nhiều góc nhìn.',
      },
      {
        weak: 'Ghi bài học vào biên bản rồi lưu vào thư mục, không ai đọc lại khi khởi động dự án tiếp theo.',
        mature:
          'Chuyển mỗi bài học thành sửa đổi cụ thể trong mẫu tài liệu, bảng kiểm hoặc quy tắc, và kiểm tra việc áp dụng ở buổi khởi động dự án sau.',
      },
    ],
    mistakes: [
      'Chỉ mời nhóm lõi vào buổi rút kinh nghiệm, bỏ qua người vận hành, nhà cung cấp và người dùng cuối, nên bức tranh thiếu đúng những đoạn mà nhóm lõi không nhìn thấy.',
      'Chỉ rút kinh nghiệm từ thất bại mà bỏ qua thành công, nên nhóm không biết điều gì đã thật sự tạo ra kết quả tốt và vô tình bỏ đi những cách làm hiệu quả ở dự án sau.',
      'Tổ chức buổi nhìn lại quá muộn, khi mọi người đã chuyển sang dự án khác và trí nhớ về chi tiết đã mờ, nên buổi họp chỉ còn những nhận xét chung chung không dùng được.',
    ],
    worksheet: [
      'Bảng kiểm đóng dự án của bạn gồm những dòng nào về nghiệm thu, tài chính, hợp đồng, tài khoản, thiết bị và lưu trữ tài liệu?',
      'Việc chuyển giao cho vận hành gồm những gì, ai được đào tạo, và ngày kết thúc giai đoạn hỗ trợ là ngày nào?',
      'Buổi rút kinh nghiệm của bạn sẽ mời những ai ngoài nhóm lõi, và bạn làm gì để họ nói thật?',
      'Ba điều đã diễn ra tốt và bạn muốn lặp lại là gì — nêu điều kiện đã làm chúng xảy ra, không chỉ nêu kết quả?',
      'Mỗi bài học rút ra sẽ kết thúc ở đâu: mẫu tài liệu nào, bảng kiểm nào, quy tắc nào; ai sửa và trước ngày nào?',
    ],
    exercises: [
      {
        label: 'Bảng kiểm đóng dự án',
        text: 'Viết bảng kiểm 15 tới 20 dòng cho việc đóng một dự án của nhóm bạn, chia bốn nhóm là nghiệm thu, tài chính, tài sản và tài liệu. Áp dụng ngay cho dự án gần nhất và ghi lại số dòng bị bỏ sót trước đó.',
        level: 'e',
      },
      {
        label: 'Dòng thời gian sự kiện',
        text: 'Dựng dòng thời gian của dự án với các mốc và sự cố chính, dùng dữ liệu thật từ email, biên bản, bảng theo dõi. Dán lên tường và để mọi người bổ sung sự kiện còn thiếu trước buổi nhìn lại.',
        level: 'e',
      },
      {
        label: 'Ba câu hỏi rút kinh nghiệm',
        text: 'Điều phối một buổi 60 phút quanh ba câu: điều gì đã diễn ra như mong đợi và vì sao, điều gì bất ngờ, và nếu quay lại thời điểm đó với thông tin lúc ấy thì ta sẽ làm gì khác. Ghi biên bản theo đúng ba khối này.',
        level: 'm',
      },
      {
        label: 'Rút kinh nghiệm từ điều tốt',
        text: 'Chọn ba việc diễn ra tốt và truy ngược điều kiện đã tạo ra chúng: ai đã chuẩn bị gì, quyết định nào từ sớm, công cụ nào. Chuyển ít nhất một điều kiện thành quy tắc mặc định cho dự án sau.',
        level: 'm',
      },
      {
        label: 'Phỏng vấn bên ngoài nhóm lõi',
        text: 'Gặp riêng ba người ngoài nhóm lõi gồm người vận hành, nhà cung cấp và người dùng cuối, mỗi buổi 20 phút. Hỏi họ điều gì khó nhất khi làm việc với dự án này và điều gì họ mong khác đi.',
        level: 'm',
      },
      {
        label: 'Chuyển bài học thành thay đổi',
        text: 'Lấy năm bài học của dự án gần nhất và với mỗi cái chỉ ra chính xác tài liệu, bảng kiểm hoặc quy tắc sẽ được sửa, người sửa và hạn. Sau ba tuần, kiểm lại và ghi tỷ lệ đã thực hiện.',
        level: 'h',
      },
      {
        label: 'Chuyển giao vận hành trọn vẹn',
        text: 'Soạn gói bàn giao gồm tài liệu vận hành, danh sách sự cố đã biết, đầu mối liên hệ và lịch hỗ trợ có ngày kết thúc. Tổ chức một buổi đào tạo và kiểm bằng cách để người vận hành tự xử lý hai tình huống giả định.',
        level: 'h',
      },
      {
        label: 'Kiểm tra ở dự án kế tiếp',
        text: 'Ở buổi khởi động dự án mới, dành 20 phút đọc lại các thay đổi rút ra từ dự án trước và xác nhận từng cái đã được áp dụng. Ghi lại thay đổi nào bị bỏ qua và tìm hiểu vì sao nó không sống được trong thực tế.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao buổi rút kinh nghiệm nên tập trung vào điều kiện và hệ thống thay vì vào cá nhân?',
        a: 'Vì mục tiêu là ngăn lỗi tái diễn, mà điều đó chỉ đạt được khi thay đổi được quy trình, công cụ hoặc quy tắc. Khi trọng tâm là cá nhân, người biết rõ vấn đề nhất sẽ tự bảo vệ và ngừng chia sẻ, nên buổi họp mất đúng nguồn thông tin có giá trị nhất.',
      },
      {
        q: 'Vì sao nên rút kinh nghiệm cả từ những việc diễn ra tốt?',
        a: 'Vì thành công cũng có nguyên nhân, và nếu không truy ra thì nhóm không biết mình đang giữ gì. Ở dự án sau, những cách làm hiệu quả có thể bị cắt bỏ vì tưởng là thừa, hoặc kết quả tốt bị quy cho may mắn nên không được lặp lại một cách chủ ý.',
      },
      {
        q: 'Làm sao để bài học không dừng lại ở biên bản?',
        a: 'Bắt buộc mỗi bài học phải chỉ đích danh một hiện vật sẽ thay đổi là mẫu tài liệu, bảng kiểm hoặc quy tắc, kèm người sửa và hạn, rồi kiểm lại việc áp dụng ở buổi khởi động dự án kế tiếp. Không có địa chỉ cụ thể thì bài học chỉ là một cảm giác đã học được điều gì đó.',
      },
    ],
    plan7:
      'Ngày 1: viết bảng kiểm đóng dự án và phân công từng dòng. Ngày 2: hoàn tất phần nghiệm thu, ghi rõ hạng mục chưa đạt kèm hạn xử lý. Ngày 3: dựng dòng thời gian sự kiện từ dữ liệu thật. Ngày 4: phỏng vấn ba người ngoài nhóm lõi. Ngày 5: điều phối buổi rút kinh nghiệm 90 phút theo ba câu hỏi cố định. Ngày 6: chuyển bài học thành thay đổi có địa chỉ, người và hạn. Ngày 7: hoàn tất gói chuyển giao vận hành và công bố ngày kết thúc hỗ trợ.',
    evidence:
      'Hai vật chứng đi cùng nhau: bảng kiểm đóng dự án đã dùng thật, và một trang bài học trong đó mỗi dòng chỉ rõ hiện vật đã được sửa kèm ngày. Mạnh nhất là khi bạn cho thấy được thay đổi đó đã sống qua dự án kế tiếp, ví dụ mẫu kế hoạch mới có thêm mục mà lần trước còn thiếu. Trong phỏng vấn, đây là cách trả lời câu hỏi bạn học được gì từ dự án gần nhất mà không rơi vào những câu chung chung: bạn kể được lỗi cụ thể, thay đổi cụ thể, và bằng chứng rằng lỗi đó không lặp lại.',
    references: [
      { label: 'Atlassian — hướng dẫn tổ chức buổi retrospective', url: 'https://www.atlassian.com/team-playbook/plays/retrospective', type: 'article' },
      { label: 'PMI — thư viện tài liệu về kết thúc dự án và bài học kinh nghiệm', url: 'https://www.pmi.org/learning/library', type: 'article' },
    ],
  }),

  // ── Chương 15 · Quản lý khủng hoảng ───────────────────────────────────────
  guide({
    thesis:
      'Khủng hoảng là tình huống mà thiệt hại tăng theo từng giờ, thông tin thiếu và mâu thuẫn, còn nhiều người cùng muốn ra quyết định. Ba thứ quyết định kết cục không phải là sự bình tĩnh cá nhân mà là cấu trúc: một người chỉ huy duy nhất được chỉ định rõ, một nhịp cập nhật cố định cho cả bên trong lẫn bên ngoài, và nguyên tắc ưu tiên chặn thiệt hại trước rồi mới đi tìm nguyên nhân gốc. Với các khủng hoảng chạm tới pháp lý, an toàn con người hoặc nghĩa vụ báo cáo với cơ quan quản lý, việc tham vấn chuyên gia đúng lĩnh vực phải nằm trong quy trình chứ không phải là lựa chọn để cân nhắc sau.',
    why: {
      work:
        'Tổ chức có quy trình xử lý sự cố mất vài chục phút để vào đội hình, còn tổ chức không có sẽ mất vài giờ chỉ để thống nhất ai đang chỉ huy và ai được phát ngôn.',
      interview:
        'Câu hỏi về lần tệ nhất bạn từng gặp trong công việc là cơ hội cho thấy bạn phân biệt được xử lý ngay và sửa gốc, và bạn đã học được gì thành quy trình sau đó.',
      study:
        'Khi mất dữ liệu bài làm hoặc hỏng kế hoạch ôn sát ngày thi, người có sẵn phương án tối thiểu viết trước sẽ giữ được phần lớn kết quả thay vì mất cả kỳ vì hoảng loạn.',
      life:
        'Trong sự cố gia đình liên quan tới sức khoẻ hoặc tai nạn, việc biết trước số cần gọi, giấy tờ cần mang và ai lo phần nào tiết kiệm được thời gian quý giá; các quyết định y tế thì phải theo hướng dẫn của nhân viên y tế, không tự phán đoán.',
    },
    framework: [
      {
        name: 'Tuyên bố khủng hoảng và chỉ định chỉ huy',
        detail:
          'Có ngưỡng viết trước để tuyên bố, và ngay khi tuyên bố thì một người được nêu tên làm chỉ huy sự cố, người khác làm thư ký ghi dòng thời gian. Chỉ huy không tự đi sửa; việc của họ là điều phối, ra quyết định và giữ nhịp.',
      },
      {
        name: 'Chặn thiệt hại trước',
        detail:
          'Ưu tiên hành động giảm thiệt hại ngay cả khi chưa hiểu nguyên nhân: dừng dây chuyền, tạm khoá tính năng, chuyển sang phương án thủ công, thu hồi lô hàng. Việc tìm nguyên nhân gốc là quan trọng nhưng thuộc giai đoạn sau.',
      },
      {
        name: 'Giữ nhịp thông tin cố định',
        detail:
          'Cập nhật theo chu kỳ đã hẹn, ví dụ mỗi 30 hoặc 60 phút, kể cả khi chưa có tiến triển. Nói rõ điều đã biết, điều chưa biết và thời điểm cập nhật tiếp theo. Khoảng lặng luôn được lấp bằng tin đồn hoặc bằng suy đoán tệ nhất.',
      },
      {
        name: 'Phân tách vai trò',
        detail:
          'Tách rõ ba việc: người xử lý kỹ thuật, người liên lạc với các bên bị ảnh hưởng, và người ra quyết định về chi phí hoặc pháp lý. Một người ôm cả ba là công thức chắc chắn dẫn tới bỏ sót, nhất là ở giờ thứ ba trở đi khi mệt mỏi bắt đầu tích tụ.',
      },
      {
        name: 'Đóng sự cố và học',
        detail:
          'Chỉ tuyên bố kết thúc khi thiệt hại đã dừng và các bên đã được thông báo. Sau đó viết bản tường thuật không đổ lỗi trong vòng một tuần, gồm dòng thời gian, quyết định đã đưa ra với thông tin có lúc đó, và các thay đổi phòng ngừa có người chịu trách nhiệm.',
      },
    ],
    scenario:
      'Một sàn thương mại điện tử cỡ vừa gặp sự cố vào 20 giờ ngày cao điểm khuyến mãi: một phần đơn hàng bị ghi nhận sai giá do lỗi trong cấu hình chương trình giảm giá, và trong 40 phút đã có hơn 900 đơn được đặt ở mức giá thấp bất thường. Cách xử lý cũ có lẽ là tranh luận xem lỗi của ai. Lần này nhóm chạy theo quy trình đã diễn tập: trực ca tuyên bố sự cố mức nghiêm trọng, chỉ định chỉ huy là trưởng ca vận hành, một người ghi dòng thời gian. Hành động đầu tiên không phải sửa mã mà là chặn thiệt hại: tạm dừng chương trình khuyến mãi đang lỗi trong bốn phút, chấp nhận mất doanh thu của cả chương trình. Song song, người liên lạc chuẩn bị thông báo cho khách và bộ phận chăm sóc khách hàng nhận kịch bản trả lời; người phụ trách thương mại và pháp chế cùng quyết định phương án với 900 đơn đã đặt, chọn hướng giữ nguyên giá cho khách và chịu phần lỗ, vì chi phí huỷ đơn hàng loạt về uy tín được đánh giá lớn hơn. Cập nhật nội bộ 30 phút một lần, thông báo cho khách trong vòng 90 phút. Nguyên nhân gốc được tìm ra vào hôm sau: cấu hình khuyến mãi không có bước kiểm mức giảm tối đa. Bản tường thuật một tuần sau dẫn tới ba thay đổi có địa chỉ, trong đó có việc thêm chốt chặn ngưỡng giảm giá và quy định người thứ hai duyệt cấu hình trước mỗi đợt lớn.',
    comparison: [
      {
        weak: 'Mọi người cùng nhảy vào sửa, nhiều người cùng thao tác trên hệ thống, không ai ghi lại đã làm gì lúc mấy giờ.',
        mature:
          'Một chỉ huy điều phối, một thư ký ghi dòng thời gian, các thay đổi được nói ra trước khi thực hiện để tránh hai người sửa chồng lên nhau.',
      },
      {
        weak: 'Im lặng với khách hàng và với nội bộ cho tới khi khắc phục xong, vì sợ nói ra sẽ làm mọi chuyện tệ hơn.',
        mature:
          'Thông báo sớm phần đã biết chắc, nêu rõ điều chưa biết và hẹn giờ cập nhật tiếp theo; giữ đúng lời hẹn đó ngay cả khi chưa có gì mới.',
      },
      {
        weak: 'Lao vào tìm nguyên nhân gốc ngay từ phút đầu trong khi thiệt hại vẫn đang tăng theo từng phút.',
        mature:
          'Chặn thiệt hại trước bằng biện pháp tạm thời, chấp nhận mất mát nhỏ có kiểm soát, rồi mới điều tra nguyên nhân trong điều kiện bình tĩnh hơn.',
      },
    ],
    mistakes: [
      'Để người giỏi kỹ thuật nhất vừa sửa vừa làm chỉ huy vừa trả lời điện thoại; sau một giờ họ quá tải, thông tin không ai tổng hợp và các quyết định lớn bị đưa ra một cách vội vàng.',
      'Không định nghĩa trước ngưỡng tuyên bố khủng hoảng, nên nhóm mất nhiều thời gian tranh luận xem tình hình đã đủ nghiêm trọng chưa, trong khi đồng hồ thiệt hại vẫn chạy.',
      'Viết bản tường thuật sau sự cố theo hướng tìm người chịu trách nhiệm, khiến lần sau không ai dám tuyên bố sự cố sớm và mọi người có xu hướng chờ xem tình hình có tự tốt lên không.',
    ],
    worksheet: [
      'Ngưỡng nào thì tuyên bố khủng hoảng trong công việc của bạn, ai có quyền tuyên bố, và điều đó đã được viết ra ở đâu?',
      'Ba biện pháp chặn thiệt hại có thể thực hiện trong 15 phút đầu là gì, ai được phép thực hiện mà không cần xin phép thêm?',
      'Nhịp cập nhật của bạn là bao lâu một lần, cho những ai, và ai là người viết bản cập nhật đó?',
      'Ba vai trò xử lý, liên lạc và ra quyết định trong tổ chức bạn hiện do những ai đảm nhiệm, và ai là người thay thế khi họ không có mặt?',
      'Loại sự cố nào của bạn cần tham vấn chuyên gia pháp lý, an toàn hoặc y tế ngay từ đầu, và số liên hệ đó nằm ở đâu để lấy được trong hai phút?',
    ],
    exercises: [
      {
        label: 'Viết ngưỡng tuyên bố',
        text: 'Định nghĩa ba mức nghiêm trọng cho sự cố trong công việc của bạn, mỗi mức kèm ví dụ cụ thể và người có quyền tuyên bố. Gửi cho nhóm và thu phản hồi về những trường hợp khó phân loại.',
        level: 'e',
      },
      {
        label: 'Thẻ vai trò',
        text: 'Làm ba thẻ ghi rõ nhiệm vụ của chỉ huy, người liên lạc và thư ký ghi dòng thời gian, mỗi thẻ tối đa năm gạch đầu dòng. Để sẵn ở nơi trực ca lấy được ngay khi cần.',
        level: 'e',
      },
      {
        label: 'Danh bạ khẩn một trang',
        text: 'Lập trang liên hệ khẩn gồm nội bộ, nhà cung cấp, chuyên gia pháp lý hoặc an toàn nếu lĩnh vực của bạn cần. Kiểm tính đúng của mọi số bằng cách gọi thử một vòng trong giờ hành chính.',
        level: 'e',
      },
      {
        label: 'Mẫu thông báo soạn trước',
        text: 'Soạn ba mẫu thông báo cho ba tình huống hay gặp nhất, mỗi mẫu ba đoạn: điều đã biết, việc đang làm, thời điểm cập nhật tiếp theo. Nhờ một người ngoài đọc và chỉ ra chỗ nghe như đang né tránh.',
        level: 'm',
      },
      {
        label: 'Diễn tập 45 phút',
        text: 'Tổ chức diễn tập trên bàn với một kịch bản thật có thể xảy ra. Bạn đọc tình huống theo mốc thời gian, nhóm ra quyết định thật và thư ký ghi dòng thời gian. Cuối buổi liệt kê mọi chỗ nhóm bị vướng vì thiếu quyền hoặc thiếu thông tin.',
        level: 'm',
      },
      {
        label: 'Danh mục biện pháp chặn thiệt hại',
        text: 'Liệt kê các biện pháp tạm thời có thể dùng để chặn thiệt hại trong lĩnh vực của bạn, kèm cái giá của từng biện pháp và người được phép quyết. Rà lại xem có biện pháp nào hiện đang cần quá nhiều cấp phê duyệt để dùng được trong 15 phút.',
        level: 'm',
      },
      {
        label: 'Bản tường thuật không đổ lỗi',
        text: 'Viết bản tường thuật cho một sự cố đã xảy ra, gồm dòng thời gian, thông tin có tại mỗi thời điểm, quyết định đã đưa ra và vì sao lúc đó nó hợp lý. Kết thúc bằng ba thay đổi phòng ngừa có người và hạn, không có tên ai bị quy trách nhiệm.',
        level: 'h',
      },
      {
        label: 'Đóng vòng lặp phòng ngừa',
        text: 'Theo dõi ba thay đổi phòng ngừa từ sự cố gần nhất trong sáu tuần cho tới khi hoàn thành, rồi kiểm chứng hiệu quả bằng một phép thử hoặc một lần diễn tập lại đúng kịch bản đó. Ghi lại kết quả để chứng minh vòng lặp đã khép.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao phải chặn thiệt hại trước khi tìm nguyên nhân gốc?',
        a: 'Vì trong khủng hoảng, thiệt hại tích luỹ theo thời gian, còn việc điều tra thường mất hàng giờ. Một biện pháp tạm thời có cái giá nhỏ và biết trước sẽ rẻ hơn nhiều so với phần thiệt hại phát sinh trong lúc chờ hiểu rõ nguyên nhân. Điều tra vẫn phải làm, nhưng ở giai đoạn sau và trong điều kiện bình tĩnh hơn.',
      },
      {
        q: 'Vì sao vẫn phải cập nhật đúng nhịp ngay cả khi chưa có tiến triển mới?',
        a: 'Vì khoảng lặng luôn bị lấp bằng suy đoán, và suy đoán thường tệ hơn sự thật. Một bản cập nhật ghi rõ điều đã biết, điều chưa biết và giờ cập nhật tiếp theo giữ được lòng tin, giảm số cuộc gọi hỏi thăm làm phân tán nhóm xử lý, và tránh việc mỗi người tự đưa ra một phiên bản thông tin khác nhau.',
      },
      {
        q: 'Vì sao bản tường thuật sau sự cố cần theo hướng không đổ lỗi?',
        a: 'Vì mục tiêu là làm cho lần sau ít thiệt hại hơn, điều đó cần thông tin đầy đủ từ chính những người ở gần sự cố nhất. Khi bản tường thuật được dùng để quy trách nhiệm cá nhân, người ta sẽ giấu chi tiết và trì hoãn việc tuyên bố sự cố, làm tổ chức mất đi lớp phòng vệ quan trọng nhất là phát hiện sớm.',
      },
    ],
    plan7:
      'Ngày 1: viết ba mức nghiêm trọng kèm ngưỡng tuyên bố và người có quyền tuyên bố. Ngày 2: làm thẻ vai trò cho chỉ huy, người liên lạc và thư ký. Ngày 3: lập danh bạ khẩn một trang và gọi thử kiểm tra. Ngày 4: liệt kê các biện pháp chặn thiệt hại kèm cái giá và người được quyền quyết. Ngày 5: soạn ba mẫu thông báo theo cấu trúc ba đoạn. Ngày 6: tổ chức diễn tập trên bàn 45 phút và ghi lại mọi chỗ vướng. Ngày 7: vá những chỗ vướng đó vào quy trình và hẹn lịch diễn tập lại sau ba tháng.',
    evidence:
      'Bằng chứng cụ thể là một bản tường thuật sau sự cố do bạn viết, đã che thông tin nhạy cảm, có dòng thời gian theo phút, các quyết định kèm thông tin có lúc đó, và ba thay đổi phòng ngừa đã hoàn thành với ngày tháng. Kèm theo là quy trình xử lý sự cố một trang và biên bản một buổi diễn tập. Trong phỏng vấn, hãy kể phần khó nhất là quyết định chặn thiệt hại sớm và chấp nhận một mất mát có kiểm soát, vì đó là chỗ phân biệt người từng chỉ huy thật với người chỉ đọc về quy trình.',
    references: [
      { label: 'PagerDuty — tài liệu mở về quy trình ứng phó sự cố', url: 'https://response.pagerduty.com/', type: 'article' },
      { label: 'Atlassian — cẩm nang quản lý sự cố', url: 'https://www.atlassian.com/incident-management', type: 'article' },
    ],
  }),
];
