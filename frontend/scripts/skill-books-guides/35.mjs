import { guide } from '../skill-guide-builder.mjs';

export default [
  // ── Chương 1 · Tư duy sản phẩm — Product Thinking ─────────────────────────
  guide({
    thesis:
      'Tư duy sản phẩm là thói quen giữ ba câu hỏi dính liền nhau trong mọi quyết định: ai đang cố hoàn thành việc gì trong hoàn cảnh nào, thứ ta định làm giúp họ tiến bộ ở chỗ nào so với cách họ đang xoay xở, và ta sẽ nhận ra bằng dấu hiệu quan sát được nào rằng nó thật sự giúp. Người có tư duy sản phẩm không tự chấm điểm mình bằng số tính năng đã giao mà bằng hành vi đã đổi ở người dùng; đó là lý do họ dám gỡ bỏ thứ mình vừa xây, còn người chỉ có tư duy dự án thì coi việc giao đúng hạn là đã xong nhiệm vụ.',
    why: {
      work:
        'Khi cấp trên nói “làm thêm nút xuất Excel”, người có tư duy sản phẩm hỏi được ba câu trước khi ước lượng: ai sẽ bấm nút đó, xuất xong họ làm gì với file, và hôm nay khi chưa có nút thì họ đang xoay xở ra sao. Rất nhiều yêu cầu tan biến hoặc đổi hình dạng ngay ở câu thứ ba.',
      interview:
        'Câu hỏi “kể về một tính năng bạn đã làm” phân loại ứng viên rất nhanh. Người mô tả giao diện và công nghệ đứng thấp hơn hẳn người kể được vấn đề gốc, giả định đã đặt, số liệu trước và sau, và quyết định giữ hay gỡ tính năng đó sau ba tháng.',
      study:
        'Đồ án và bài tập lớn thường được chấm cao ở phần “có người dùng thật”. Một sinh viên nói chuyện với năm người dùng thật rồi trình bày ba nhu cầu quan sát được luôn thuyết phục hơn một sinh viên trình bày mười lăm chức năng tự nghĩ ra.',
      life:
        'Khi mua một công cụ hay đăng ký một dịch vụ cho bản thân, câu hỏi “việc mình cần xong là gì” tiết kiệm nhiều tiền hơn mọi bảng so sánh tính năng: phần lớn thứ ta mua vì thấy nhiều chức năng đều nằm im sau hai tuần.',
    },
    framework: [
      {
        name: 'Viết việc cần xong',
        detail:
          'Dùng khuôn Jobs-to-be-Done (khung do Clayton Christensen phổ biến): khi <hoàn cảnh cụ thể>, tôi muốn <điều cần làm>, để <kết quả tôi mong>. Hoàn cảnh phải là thứ có thể bắt gặp trong đời thật — “khi ca sáng đổi người vào phút chót” — chứ không phải một đặc điểm nhân khẩu.',
      },
      {
        name: 'Tách vấn đề khỏi giải pháp',
        detail:
          'Viết vấn đề ở một trang riêng, không chứa danh từ chỉ giải pháp nào (không có chữ app, nút, màn hình, AI). Nếu bạn không viết nổi trang này, nghĩa là bạn đang bảo vệ một giải pháp mình thích chứ chưa hiểu vấn đề.',
      },
      {
        name: 'Nêu ba loại giả định',
        detail:
          'Giả định giá trị (họ có thật sự cần và chịu đổi thói quen không), giả định khả thi (đội có làm nổi trong ngân sách này không), giả định kinh doanh (nếu chạy được thì nó nuôi được ai). Ghi rõ giả định nào chưa có bằng chứng nào ngoài trực giác.',
      },
      {
        name: 'Chọn thước đo hành vi',
        detail:
          'Trước khi xây, chốt một chỉ số hành vi và mức hiện tại của nó: số lần dùng mỗi tuần, thời gian hoàn thành một việc, tỉ lệ bỏ dở giữa chừng. Chỉ số ý kiến (mọi người nói thích) không được coi là bằng chứng vì nó không tốn gì để nói ra.',
      },
      {
        name: 'Đóng vòng sau khi giao',
        detail:
          'Đặt sẵn một ngày sau ba đến sáu tuần để xem số thật và ra một trong ba quyết định: giữ nguyên, sửa, hoặc gỡ. Một đội không bao giờ gỡ thứ gì là dấu hiệu đội đó chưa từng đo, chứ không phải mọi thứ họ làm đều đúng.',
      },
    ],
    scenario:
      'Một chuỗi chín tiệm bánh mì có yêu cầu từ phòng kế toán: “làm app chấm công nhận diện khuôn mặt”. Người phụ trách sản phẩm hoãn ước lượng và dành hai buổi sáng đứng ở ba tiệm lúc năm giờ. Anh thấy nhân viên vẫn ký vào sổ giấy, và cái tốn kém thật nằm ở cuối tháng: kế toán mất khoảng ba ngày đối chiếu sổ giấy với lịch ca trong nhóm chat, và tháng nào cũng có bốn đến sáu vụ cãi nhau về ca đổi giữa chừng vì không ai ghi lại. Việc cần xong hoá ra là “biết chắc ai đã làm ca nào” chứ không phải “xác thực khuôn mặt”. Đội bỏ nhận diện khuôn mặt, làm một màn hình duy nhất cho ca trưởng: chốt ca cuối buổi, ghi người đổi ca kèm lý do, và một bản tổng hợp gửi kế toán mỗi tuần. Thước đo chốt trước: thời gian đối chiếu cuối tháng và số vụ khiếu nại công. Sau hai tháng, đối chiếu còn khoảng nửa ngày, khiếu nại còn một đến hai vụ, và yêu cầu nhận diện khuôn mặt tự rơi khỏi danh sách vì lý do gốc của nó đã biến mất.',
    comparison: [
      {
        weak: 'Nhận yêu cầu dưới dạng giải pháp và chuyển thẳng thành đầu việc kỹ thuật, vì hỏi lại sợ bị coi là chậm hoặc cãi cấp trên.',
        mature:
          'Hỏi ba câu về hoàn cảnh, cách xoay xở hiện tại và hậu quả khi không có gì thay đổi, rồi trình bày lại yêu cầu dưới dạng vấn đề để cả hai bên cùng xác nhận trước khi ước lượng.',
      },
      {
        weak: 'Đánh giá thành công của một tính năng bằng việc nó đã lên bản phát hành đúng hạn và không có lỗi nghiêm trọng.',
        mature:
          'Đánh giá bằng một chỉ số hành vi đã đo trước lúc xây, kèm một ngày hẹn xem lại để quyết định giữ, sửa hay gỡ.',
      },
      {
        weak: 'Cho rằng người dùng biết mình muốn gì, nên gom yêu cầu bằng cách hỏi “anh chị muốn có thêm chức năng nào”.',
        mature:
          'Hỏi về lần gần nhất họ gặp khó và họ đã làm gì để vượt qua, vì cách xoay xở thủ công đang tồn tại là bằng chứng đáng tin hơn mọi mong muốn được nói ra.',
      },
    ],
    mistakes: [
      'Coi tư duy sản phẩm là việc riêng của người mang chức danh Product Manager, nên kỹ sư và người vận hành chỉ nhận đầu việc; hệ quả là những người hiểu hệ thống nhất lại không có quyền đặt câu hỏi vì sao, và các yêu cầu vô lý đi thẳng vào bản phát hành.',
      'Nhầm phản hồi to tiếng với nhu cầu phổ biến: ba khách hàng gọi điện gay gắt đủ sức đẩy một tính năng lên đầu hàng đợi, trong khi hàng nghìn người im lặng đang vướng ở một chỗ khác mà không ai đo.',
      'Đặt mục tiêu “làm sản phẩm tốt hơn” rồi đo bằng số tính năng phát hành mỗi quý, khiến đội bị thưởng vì bận rộn và bị phạt vì dọn dẹp, dù dọn dẹp thường tạo ra nhiều giá trị hơn.',
    ],
    worksheet: [
      'Viết việc cần xong của người dùng bạn phục vụ theo khuôn: khi <hoàn cảnh>, tôi muốn <điều cần làm>, để <kết quả>. Hoàn cảnh của bạn có phải một tình huống bắt gặp được không?',
      'Hôm nay, khi chưa có sản phẩm của bạn, người đó đang xoay xở bằng cách gì? Mô tả cụ thể công cụ, số bước và thời gian họ tốn.',
      'Ba giả định của bạn về giá trị, khả thi và kinh doanh là gì? Giả định nào hiện chỉ dựa vào trực giác, không có dữ liệu hay lời kể nào chống lưng?',
      'Chỉ số hành vi nào sẽ cho bạn biết tính năng sắp làm có tác dụng? Mức hiện tại của nó là bao nhiêu và bạn lấy số đó ở đâu?',
      'Ngày nào bạn sẽ xem lại số thật, và mức nào thì bạn chấp nhận gỡ bỏ thứ mình vừa xây?',
    ],
    exercises: [
      {
        label: 'Dịch yêu cầu về vấn đề',
        text: 'Lấy năm yêu cầu gần nhất trong hàng đợi của bạn, tất cả đang viết dưới dạng giải pháp. Viết lại mỗi cái thành một câu vấn đề không chứa từ chỉ giải pháp, rồi đánh dấu cái nào bạn không đủ thông tin để viết.',
        level: 'e',
      },
      {
        label: 'Ghi cách xoay xở thủ công',
        text: 'Chọn một nhóm người dùng và tìm ba cách xoay xở thủ công họ đang dùng (bảng tính tự lập, nhóm chat, sổ giấy, ảnh chụp màn hình). Chụp lại hoặc mô tả từng cái và ghi nó tốn bao nhiêu phút mỗi ngày.',
        level: 'e',
      },
      {
        label: 'Bảng ba giả định',
        text: 'Với một việc bạn sắp làm, viết ba giả định giá trị, khả thi, kinh doanh. Chấm mỗi cái theo hai trục: mức chắc chắn và thiệt hại nếu sai. Khoanh giả định vừa mơ hồ vừa đắt.',
        level: 'e',
      },
      {
        label: 'Đo mức nền trước khi xây',
        text: 'Chọn một chỉ số hành vi cho tính năng sắp làm và đi tìm con số hiện tại của bốn tuần gần nhất. Ghi rõ nguồn dữ liệu, công thức tính và ai xác nhận. Nếu không đo được, viết một đoạn giải thích vì sao và cần thêm gì để đo được.',
        level: 'm',
      },
      {
        label: 'Một trang trước khi ước lượng',
        text: 'Viết bản một trang cho yêu cầu tiếp theo gồm bốn khối: việc cần xong, cách xoay xở hiện tại, giả định lớn nhất, chỉ số và ngày xem lại. Gửi cho người đề xuất và ghi lại họ chỉnh chỗ nào.',
        level: 'm',
      },
      {
        label: 'Đi thực địa nửa buổi',
        text: 'Dành nửa buổi ngồi cạnh một người dùng thật trong lúc họ làm việc có liên quan tới sản phẩm. Chỉ quan sát và ghi thời gian từng bước, không hướng dẫn. Sau đó liệt kê ba chỗ họ dừng lại lâu nhất và so với danh sách ưu tiên hiện tại của bạn.',
        level: 'h',
      },
      {
        label: 'Rà soát gỡ bỏ',
        text: 'Liệt kê mọi tính năng đã phát hành trong sáu tháng qua. Với mỗi cái, tìm số liệu sử dụng thực tế. Đề xuất gỡ hoặc ẩn ít nhất một tính năng và viết kèm dữ liệu, rủi ro và kế hoạch thông báo cho người còn dùng.',
        level: 'h',
      },
      {
        label: 'Báo cáo trước và sau',
        text: 'Chọn một thứ bạn đã giao gần đây. Dựng báo cáo hai trang: mức chỉ số trước, sau bốn tuần, phần chênh không giải thích được bằng mùa vụ hay chiến dịch, và kết luận giữ hay sửa. Trình bày cho đội và ghi lại phản biện mạnh nhất bạn nhận được.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao câu hỏi “anh chị muốn thêm chức năng gì” thường cho ra dữ liệu kém tin cậy?',
        a: 'Vì nói ra một mong muốn không tốn gì và người trả lời có xu hướng chiều lòng người hỏi. Ngược lại, cách họ đang xoay xở thủ công là hành vi đã tốn thời gian thật, nên nó chứng minh nhu cầu mạnh hơn bất kỳ câu trả lời nào về tương lai.',
      },
      {
        q: 'Đội của bạn phát hành đều đặn, đúng hạn, ít lỗi, nhưng các chỉ số kinh doanh đứng yên. Điều đó nói lên gì về tư duy sản phẩm của đội?',
        a: 'Đội đang mạnh về năng lực giao hàng nhưng vòng lặp học hỏi bị đứt: không ai chốt chỉ số hành vi trước khi xây và không ai xem lại sau khi giao. Việc cần sửa không phải tăng tốc độ mà là gắn mỗi hạng mục với một giả định và một ngày kiểm chứng.',
      },
      {
        q: 'Một tính năng chỉ có 2% người dùng chạm tới. Khi nào thì con số đó vẫn chấp nhận được?',
        a: 'Khi tính năng đó phục vụ một nhóm nhỏ nhưng quan trọng có chủ đích — ví dụ chức năng xuất dữ liệu cho khách doanh nghiệp lớn, hoặc thao tác khôi phục dùng khi có sự cố. Điều kiện là mục tiêu đã được ghi từ đầu là phục vụ nhóm hẹp, và chi phí duy trì nó vẫn nhỏ hơn giá trị nhóm đó mang lại.',
      },
    ],
    plan7:
      'Ngày 1: viết việc cần xong cho ba nhóm người dùng chính, mỗi nhóm một câu. Ngày 2: đi tìm và chụp lại ba cách xoay xở thủ công đang tồn tại. Ngày 3: chọn một yêu cầu trong hàng đợi và viết lại thành trang vấn đề không chứa giải pháp. Ngày 4: liệt kê ba giả định và chấm điểm. Ngày 5: đo mức nền của một chỉ số hành vi. Ngày 6: viết bản một trang và gửi cho người đề xuất yêu cầu. Ngày 7: hẹn lịch xem lại số sau bốn tuần và ghi trước ba mức quyết định giữ, sửa, gỡ.',
    evidence:
      'Bằng chứng thuyết phục nhất cho tư duy sản phẩm là một tài liệu hai mặt cho cùng một tính năng: mặt trước là bản một trang viết trước khi xây (việc cần xong, giả định, chỉ số, mức nền), mặt sau là kết quả đo sau bốn đến sáu tuần kèm quyết định giữ, sửa hay gỡ. Trong portfolio, đặt hai mặt cạnh nhau mạnh hơn nhiều so với ảnh chụp giao diện. Trong phỏng vấn, hãy chuẩn bị sẵn một câu chuyện về lần bạn thuyết phục đội bỏ một giải pháp đã được yêu cầu sẵn vì tìm ra vấn đề gốc khác — kèm con số trước và sau, vì chi tiết này không thể bịa trôi chảy khi bị hỏi sâu.',
    references: [
      { label: 'Silicon Valley Product Group — bài viết của Marty Cagan về nghề sản phẩm', url: 'https://www.svpg.com/articles/', type: 'article' },
    ],
  }),

  // ── Chương 2 · Khám phá vấn đề người dùng ─────────────────────────────────
  guide({
    thesis:
      'Khám phá vấn đề là việc thu thập bằng chứng về những gì người dùng đã thật sự làm, chứ không phải thu thập ý kiến về những gì họ sẽ làm. Một cuộc phỏng vấn tốt gần như không có câu hỏi nào bắt đầu bằng “anh chị có muốn” hay “anh chị nghĩ sao nếu”; nó đi dọc theo một câu chuyện đã xảy ra, hỏi ngày giờ, hỏi việc họ đã bấm và đã gọi cho ai, hỏi họ đã bỏ ra bao nhiêu tiền và bao nhiêu phút để vá tạm. Khám phá là việc làm hằng tuần chứ không phải một giai đoạn nằm ở đầu dự án rồi kết thúc.',
    why: {
      work:
        'Đội có nhịp khám phá đều đặn tranh cãi ít hơn hẳn, vì mọi lập luận đều quy về một câu trích dẫn có ngày tháng và tên người, thay vì quy về ai có chức danh cao hơn.',
      interview:
        'Nhà tuyển dụng thường hỏi “bạn biết vấn đề đó là có thật nhờ đâu”. Người kể được cách tuyển người phỏng vấn, số cuộc đã làm, câu hỏi mở đầu và những trích dẫn khiến mình đổi ý sẽ vượt xa người trả lời rằng nhóm đã họp và cùng thấy hợp lý.',
      study:
        'Nghiên cứu người dùng cho đồ án thường hỏng vì bảng hỏi trực tuyến toàn câu giả định. Chỉ cần năm cuộc trò chuyện 30 phút đúng cách là bạn có dữ liệu định tính đủ để dựng chương phân tích nhu cầu thật sự đứng vững trước hội đồng.',
      life:
        'Kỹ năng này dùng được ngoài công việc: trước khi mở một quán nhỏ hay nhận một dự án tự do, hỏi năm người đã từng ở đúng hoàn cảnh đó về lần gần nhất họ chi tiền sẽ cho bạn nhiều thông tin hơn ba tuần đọc báo cáo thị trường.',
    },
    framework: [
      {
        name: 'Chọn đúng người và tuyển được họ',
        detail:
          'Xác định tiêu chí sàng lọc theo hành vi, không theo nhân khẩu: người đã làm việc X trong 30 ngày qua. Chuẩn bị sẵn kênh tuyển (danh sách khách cũ, nhóm cộng đồng, nhân viên tuyến đầu giới thiệu) và một lời mời ngắn nói rõ mất bao lâu, hỏi về cái gì và không bán gì.',
      },
      {
        name: 'Hỏi câu chuyện gần nhất',
        detail:
          'Mở đầu bằng “kể cho tôi nghe lần gần nhất anh chị gặp việc này”, rồi đi theo dòng thời gian: trước đó điều gì xảy ra, anh chị làm gì tiếp, lúc đó có ai khác tham gia không. Nguyên tắc này được Rob Fitzpatrick trình bày trong The Mom Test: hỏi về quá khứ cụ thể thay vì hỏi về ý kiến hoặc tương lai.',
      },
      {
        name: 'Đào tới chi phí đang trả',
        detail:
          'Mọi vấn đề đáng làm đều đang có giá: thời gian, tiền, sự bực bội, hoặc rủi ro. Hỏi thẳng họ đã tốn bao nhiêu phút, đã trả cho ai, đã bỏ lỡ gì. Nếu không moi ra được chi phí nào, khả năng cao đây là điều gây khó chịu nhẹ chứ không phải nhu cầu.',
      },
      {
        name: 'Ghi nguyên văn và gắn thẻ',
        detail:
          'Lưu trích dẫn nguyên văn kèm tên, ngày, hoàn cảnh; đừng lưu bản tóm tắt đã diễn giải. Gắn mỗi trích dẫn vào một thẻ cơ hội. Sau mười cuộc, các thẻ trùng nhau sẽ tự nổi lên và cho thấy đâu là mẫu hình lặp lại chứ không phải ý kiến của một người nói to.',
      },
      {
        name: 'Dựng cây cơ hội và chọn nhánh',
        detail:
          'Xếp các cơ hội thành cây dưới một mục tiêu kết quả duy nhất — cách làm được Teresa Torres gọi là opportunity solution tree. Chọn đúng một nhánh cho chu kỳ này dựa trên mức phổ biến, mức đau và khả năng ta tác động, rồi mới nghĩ tới giải pháp.',
      },
    ],
    scenario:
      'Một nhóm ba người làm nền tảng ôn thi vào lớp 10 tin rằng học sinh cần thêm ngân hàng đề. Trước khi xây, họ đặt lịch mười hai cuộc trò chuyện 30 phút: sáu phụ huynh, sáu học sinh, tuyển qua danh sách người đã đăng ký dùng thử trong ba mươi ngày. Câu mở đầu luôn là “kể cho tôi nghe buổi tối gần nhất con học môn Toán ở nhà”. Sáu trên sáu phụ huynh kể một chi tiết mà đội chưa từng nghĩ tới: họ chụp bài kiểm tra trên lớp gửi cho gia sư qua tin nhắn và hỏi “con hổng chỗ nào”. Chi phí đang trả lộ ra rõ: mỗi tuần khoảng 20 đến 40 phút chụp và nhắn, cộng thêm tiền hỏi gia sư ngoài giờ. Không phụ huynh nào nhắc tới việc thiếu đề. Đội gác lại ngân hàng đề, làm một thứ nhỏ hơn nhiều: sau mỗi bài luyện 20 câu, hệ thống trả về một trang “ba chủ đề đang hổng, kèm hai bài mẫu cho mỗi chủ đề”, và cho phép gửi trang đó sang tin nhắn cho phụ huynh. Chỉ số theo dõi là tỉ lệ phụ huynh mở trang đó trong tuần thứ hai. Đội giữ nhịp hai cuộc phỏng vấn mỗi tuần, và chính nhịp này về sau phát hiện tiếp một vấn đề khác: học sinh giấu kết quả kém nên không bấm gửi.',
    comparison: [
      {
        weak: 'Gửi một bảng hỏi trực tuyến 20 câu cho 300 người rồi kết luận theo tỉ lệ phần trăm của những câu trả lời giả định.',
        mature:
          'Làm mười tới mười lăm cuộc trò chuyện có dẫn dắt về chuyện đã xảy ra, dùng bảng hỏi diện rộng chỉ để đo độ phổ biến của mẫu hình đã tìm thấy trước đó.',
      },
      {
        weak: 'Mô tả ý tưởng sản phẩm ngay ở phút thứ ba của cuộc phỏng vấn rồi hỏi người ta thấy thế nào.',
        mature:
          'Giữ ý tưởng của mình lại tới cuối, dành phần lớn thời gian đi dọc câu chuyện của họ; nếu buộc phải kiểm phản ứng thì đưa vào cuối và ghi rõ đây là dữ liệu yếu.',
      },
      {
        weak: 'Coi khám phá là giai đoạn đầu dự án, làm xong một đợt rồi đóng lại để tập trung xây.',
        mature:
          'Giữ nhịp cố định một tới hai cuộc mỗi tuần suốt vòng đời sản phẩm, để mỗi quyết định lớn đều có dữ liệu mới không quá hai tuần tuổi.',
      },
    ],
    mistakes: [
      'Phỏng vấn người dễ gặp nhất thay vì người đúng hoàn cảnh nhất — hỏi đồng nghiệp, bạn bè, người trong ngành — rồi ngạc nhiên vì sản phẩm ra thị trường không ai cần; nhóm dễ gặp thường quá hiểu bối cảnh nên bỏ qua đúng những chỗ người thật sẽ vấp.',
      'Ghi chép bằng cách tóm tắt theo cách hiểu của mình ngay trong lúc nghe, nên trích dẫn gốc biến mất và nửa năm sau không ai kiểm chứng được kết luận đến từ đâu.',
      'Dừng lại ở lời than phiền đầu tiên thay vì hỏi tiếp họ đã làm gì sau đó; than phiền cho biết chỗ khó chịu, còn hành động vá tạm mới cho biết mức độ cấp thiết và mức tiền họ sẵn sàng bỏ ra.',
    ],
    worksheet: [
      'Tiêu chí sàng lọc theo hành vi của bạn là gì — người đã làm việc gì, trong khoảng thời gian nào, ở hoàn cảnh nào?',
      'Viết ba câu hỏi mở đầu dẫn về một câu chuyện đã xảy ra, không câu nào chứa từ “nếu”, “sẽ” hay “có muốn”.',
      'Trong ba cuộc gần nhất bạn nghe được, chi phí người dùng đang trả cho vấn đề này là gì — bao nhiêu phút, bao nhiêu tiền, rủi ro nào?',
      'Liệt kê ba trích dẫn nguyên văn khiến bạn phải đổi một giả định. Nếu chưa có trích dẫn nào như vậy, khả năng cao bạn đang phỏng vấn để xác nhận điều mình tin sẵn — vì sao?',
      'Cây cơ hội của bạn dưới mục tiêu kết quả hiện tại gồm những nhánh nào, và nhánh nào bạn chọn cho chu kỳ này với lý do gì?',
    ],
    exercises: [
      {
        label: 'Chữa bộ câu hỏi',
        text: 'Lấy mười câu hỏi bạn định dùng. Đánh dấu mọi câu hỏi về tương lai, ý kiến hoặc chứa gợi ý trả lời. Viết lại từng câu thành câu hỏi về một sự kiện đã xảy ra kèm mốc thời gian.',
        level: 'e',
      },
      {
        label: 'Lời mời phỏng vấn',
        text: 'Viết lời mời dài dưới 80 từ nói rõ mất bao lâu, chủ đề, và cam kết không bán gì. Gửi cho mười người thuộc tiêu chí sàng lọc và ghi lại tỉ lệ nhận lời để biết lời mời của bạn có vấn đề hay không.',
        level: 'e',
      },
      {
        label: 'Dòng thời gian một câu chuyện',
        text: 'Trong một cuộc trò chuyện, dựng lại đầy đủ dòng thời gian của lần gần nhất người đó gặp vấn đề: mốc bắt đầu, từng bước họ làm, ai tham gia, kết thúc ra sao. Vẽ lại thành một đường thẳng có mốc giờ.',
        level: 'm',
      },
      {
        label: 'Bảng chi phí đang trả',
        text: 'Với năm người đã trò chuyện, lập bảng ba cột: phút mỗi tuần, tiền mỗi tháng, rủi ro chịu được. Tính khoảng dao động và ghi ai là người trả giá cao nhất.',
        level: 'm',
      },
      {
        label: 'Thư viện trích dẫn',
        text: 'Dựng một bảng lưu trích dẫn gồm cột nguyên văn, người, ngày, hoàn cảnh, thẻ cơ hội. Nhập lại toàn bộ ghi chép cũ của bạn vào đó và tìm ba mẫu hình lặp lại ít nhất ba lần.',
        level: 'm',
      },
      {
        label: 'Nhịp hai tuần',
        text: 'Đặt lịch cố định hai cuộc phỏng vấn mỗi tuần trong bốn tuần, mời một kỹ sư và một người thiết kế dự thính luân phiên. Sau mỗi cuộc, cả nhóm viết riêng ba điều bất ngờ rồi so kết quả để thấy mức lệch giữa các cách nghe.',
        level: 'h',
      },
      {
        label: 'Cây cơ hội',
        text: 'Chọn một mục tiêu kết quả duy nhất và dựng cây cơ hội ba tầng từ thư viện trích dẫn. Chấm mỗi cơ hội theo mức phổ biến, mức đau và khả năng tác động, rồi bảo vệ nhánh bạn chọn trước hai đồng nghiệp đóng vai phản biện.',
        level: 'h',
      },
      {
        label: 'Kiểm chứng bằng dữ liệu định lượng',
        text: 'Lấy mẫu hình mạnh nhất tìm được từ phỏng vấn và thiết kế một phép đo định lượng cho nó: một câu hỏi trong bảng khảo sát diện rộng, một truy vấn dữ liệu sử dụng, hoặc một phép đếm thủ công. Viết trước mức nào thì coi là bác bỏ mẫu hình đó.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao câu hỏi “nếu có tính năng X thì anh chị có dùng không” gần như luôn cho câu trả lời sai lệch?',
        a: 'Vì người trả lời phải dự đoán hành vi tương lai của chính mình trong một hoàn cảnh chưa xảy ra, và họ có xu hướng trả lời lịch sự với người hỏi. Dữ liệu đáng tin nằm ở hành vi quá khứ đã tốn thời gian hoặc tiền bạc, hoặc ở một phép thử mà họ phải bỏ ra thứ gì đó thật.',
      },
      {
        q: 'Sau bao nhiêu cuộc phỏng vấn thì có thể dừng, và dừng dựa vào dấu hiệu gì?',
        a: 'Không có con số cố định; dấu hiệu thực tế là bão hoà — hai tới ba cuộc liên tiếp không mang lại mẫu hình mới nào cho nhóm người dùng bạn đang tìm hiểu. Nếu đổi sang nhóm khác hoặc hoàn cảnh khác, đồng hồ bão hoà bắt đầu lại từ đầu.',
      },
      {
        q: 'Người dùng nói rất rõ họ muốn một tính năng cụ thể. Bạn xử lý thông tin này thế nào?',
        a: 'Coi đó là một manh mối chứ không phải yêu cầu. Hỏi ngược về lần gần nhất họ cần tới nó, họ đã xoay xở ra sao và mất gì; nếu không có câu chuyện nào phía sau thì đó chỉ là gợi ý giải pháp. Nếu có, hãy lấy vấn đề gốc, vì thường có cách giải rẻ hơn và đúng hơn cái họ đề nghị.',
      },
    ],
    plan7:
      'Ngày 1: viết tiêu chí sàng lọc theo hành vi và lời mời dưới 80 từ. Ngày 2: gửi lời mời cho hai mươi người và đặt lịch. Ngày 3: chữa bộ câu hỏi, loại mọi câu hỏi giả định. Ngày 4 và 5: thực hiện bốn cuộc trò chuyện, ghi trích dẫn nguyên văn ngay sau mỗi cuộc. Ngày 6: nhập trích dẫn vào bảng và gắn thẻ cơ hội. Ngày 7: dựng cây cơ hội, chọn một nhánh và đặt lịch cố định cho nhịp phỏng vấn hằng tuần từ tuần sau.',
    evidence:
      'Hãy giữ lại một hồ sơ khám phá gọn: bộ câu hỏi đã chữa, danh sách tiêu chí sàng lọc, bảng trích dẫn ẩn danh hoá tên, cây cơ hội và một trang ghi rõ quyết định nào đã đổi vì dữ liệu nào. Trong portfolio, phần mạnh nhất là dòng “giả định ban đầu của chúng tôi sai ở chỗ này, đây là trích dẫn khiến chúng tôi đổi ý”. Khi phỏng vấn xin việc, hãy mang theo con số cụ thể: bao nhiêu cuộc, tuyển người bằng kênh nào, tỉ lệ nhận lời bao nhiêu — chi tiết vận hành này chứng minh bạn đã thật sự làm, không chỉ đọc về nó.',
    references: [
      { label: 'Product Talk — Teresa Torres, khám phá sản phẩm liên tục', url: 'https://www.producttalk.org/', type: 'article' },
      { label: 'Nielsen Norman Group — nghiên cứu người dùng và UX', url: 'https://www.nngroup.com/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 3 · Xác định khách hàng mục tiêu ───────────────────────────────
  guide({
    thesis:
      'Khách hàng mục tiêu không phải một mô tả nhân khẩu học mà là một nhóm người có chung hoàn cảnh, chung việc cần xong và chung cách bạn tiếp cận được họ. Định nghĩa chỉ dùng được khi nó trả lời được đủ bốn câu: họ ở đâu để mình gặp, họ đang trả giá bao nhiêu cho vấn đề này, ai là người thật sự ký chi tiền, và nhóm này có đủ lớn để nuôi mô hình của bạn không. Phần khó nhất của việc chọn khách hàng mục tiêu là viết ra cho rõ ai không phải khách hàng của mình, và giữ được quyết định đó khi có đơn hàng lạ gõ cửa.',
    why: {
      work:
        'Khi nhóm mục tiêu mơ hồ, mọi tranh luận về tính năng đều bế tắc vì mỗi người đang nghĩ tới một người dùng khác nhau trong đầu; chốt nhóm mục tiêu là cách rẻ nhất để kết thúc các cuộc họp vòng quanh.',
      interview:
        'Ở vị trí sản phẩm hay marketing, câu “khách hàng của sản phẩm cũ của bạn là ai” thường nhận được câu trả lời rộng đến vô nghĩa. Người trả lời được bằng hoàn cảnh, kênh tiếp cận và người ra quyết định chi tiền lập tức tạo khác biệt.',
      study:
        'Bài tập lớn về khởi nghiệp hay dự án môn marketing thường mất điểm vì phần thị trường mục tiêu viết theo kiểu độ tuổi 18 đến 35, sống ở thành phố. Chuyển sang mô tả theo hoàn cảnh và hành vi là cách nâng chất lượng bài nhanh nhất.',
      life:
        'Người làm nghề tự do dùng kỹ năng này để chọn loại khách nên nhận: xác định rõ nhóm mình phục vụ tốt nhất giúp báo giá cao hơn, làm nhanh hơn và giảm hẳn số dự án kéo dài mệt mỏi.',
    },
    framework: [
      {
        name: 'Phân khúc theo hoàn cảnh, không theo nhân khẩu',
        detail:
          'Nhóm người dùng theo tình huống họ ở trong đó và việc họ cần xong: người vừa chuyển tới nơi ở mới, hộ kinh doanh vừa vượt ngưỡng phải xuất hoá đơn, nhà hàng mở thêm chi nhánh thứ hai. Tuổi tác và giới tính chỉ ghi kèm khi nó thật sự đổi hành vi.',
      },
      {
        name: 'Đo ba đại lượng cho từng phân khúc',
        detail:
          'Với mỗi phân khúc, ước lượng số lượng có thể tiếp cận được (không phải quy mô thị trường trên báo cáo), mức chi trả sẵn có, và độ khó tiếp cận. Ghi rõ bạn lấy con số từ đâu: danh sách hội nhóm, số hộ đăng ký trên bản đồ, số đơn hàng thực tế.',
      },
      {
        name: 'Chọn một đầu cầu',
        detail:
          'Chọn đúng một phân khúc để đánh trước, ưu tiên nhóm đau nhiều nhất và dễ tiếp cận nhất chứ không phải nhóm to nhất. Đầu cầu tốt cho bạn nhóm người dùng chịu nói chuyện, chịu tha thứ cho bản đầu tiên, và giới thiệu người giống họ.',
      },
      {
        name: 'Tách vai trò trong quyết định mua',
        detail:
          'Với sản phẩm bán cho tổ chức hoặc gia đình, hãy tách rõ người dùng, người ảnh hưởng, người trả tiền và người có quyền phủ quyết. Rất nhiều sản phẩm chết vì làm hài lòng người dùng mà quên người ký duyệt, hoặc ngược lại.',
      },
      {
        name: 'Viết danh sách ai không phải khách hàng',
        detail:
          'Ghi thẳng ba nhóm bạn sẽ từ chối phục vụ trong sáu tháng tới, kèm lý do. Danh sách này là công cụ làm việc: khi có yêu cầu từ nhóm ngoài danh mục, bạn có căn cứ để nói không mà không phải tranh luận lại từ đầu.',
      },
    ],
    scenario:
      'Một cơ sở giặt sấy nhận và giao tận nơi ở khu vực gần ba trường đại học ban đầu mô tả khách hàng là “người bận rộn từ 20 đến 40 tuổi”. Với định nghĩa đó, họ chạy quảng cáo rải rác, giá bị so sánh liên tục và tài xế chạy lòng vòng. Chủ cơ sở ngồi lại phân khúc theo hoàn cảnh và thấy ba nhóm rất khác nhau: sinh viên ở trọ ghép, gia đình trẻ có con nhỏ, và các nhà nghỉ mini cần giặt ga gối theo lô. Đo ba đại lượng cho từng nhóm: sinh viên đông nhưng đơn nhỏ và nhạy giá; gia đình trẻ đơn vừa nhưng khó gom tuyến; nhà nghỉ mini chỉ khoảng ba mươi cơ sở trong bán kính hai kilômét nhưng đơn đều, khối lượng lớn, và người quyết định là chủ hoặc quản lý — gặp trực tiếp được. Cơ sở chọn nhà nghỉ mini làm đầu cầu, đổi cách bán từ quảng cáo sang đi gõ cửa từng nơi với bảng giá theo lô và cam kết giao trước 11 giờ. Danh sách “không phục vụ trong sáu tháng” ghi rõ: giặt đồ da và đồ cưới, đơn lẻ dưới ba kilôgam ngoài tuyến. Sau ba tháng, doanh thu tuyến ổn định hơn nhờ đơn lặp lại hằng tuần, và nhóm gia đình trẻ về sau được phục vụ ké theo đúng tuyến đã có.',
    comparison: [
      {
        weak: 'Nhận mọi khách để không bỏ lỡ doanh thu, kết quả là quy trình phải chiều theo từng ca ngoại lệ và không nhóm nào được phục vụ tốt.',
        mature:
          'Chọn một đầu cầu, tối ưu vận hành cho nhóm đó, và từ chối có lễ độ những đơn nằm ngoài kèm gợi ý nơi khác phù hợp hơn.',
      },
      {
        weak: 'Dựng chân dung khách hàng bằng ảnh minh hoạ và các tính từ như năng động, hiện đại, yêu công nghệ.',
        mature:
          'Dựng chân dung từ dữ liệu thật: mười trích dẫn của khách, số đơn trung bình, khung giờ đặt, lý do rời bỏ đã ghi nhận.',
      },
      {
        weak: 'Coi quy mô thị trường trên báo cáo ngành là bằng chứng cho cơ hội của mình.',
        mature:
          'Ước lượng phần thị trường mình thật sự tiếp cận được bằng kênh mình có, rồi kiểm bằng một đợt tiếp cận thử để biết tỉ lệ trả lời thực tế.',
      },
    ],
    mistakes: [
      'Chọn phân khúc theo mức độ dễ chịu khi tiếp xúc thay vì theo mức độ đau và khả năng chi trả, nên đội dành nhiều tháng phục vụ nhóm rất thích nói chuyện nhưng không bao giờ trả tiền.',
      'Đổi nhóm mục tiêu ba lần trong một quý vì mỗi khách hàng lớn xuất hiện lại kéo lộ trình đi hướng khác; hệ quả là sản phẩm mang hình dạng chắp vá và không nhóm nào coi nó là dành cho mình.',
      'Bỏ qua người trả tiền khi sản phẩm bán cho tổ chức: đội làm hài lòng nhân viên trực tiếp dùng, tới lúc gia hạn thì người ký duyệt không thấy bằng chứng nào về giá trị và cắt hợp đồng.',
    ],
    worksheet: [
      'Liệt kê ba phân khúc của bạn theo hoàn cảnh, mỗi phân khúc một câu bắt đầu bằng chữ “khi”.',
      'Với mỗi phân khúc, bạn tiếp cận được bao nhiêu người bằng kênh đang có, và bạn lấy con số ấy từ nguồn nào?',
      'Nhóm nào đang trả giá cao nhất cho vấn đề này — bằng tiền, thời gian hay rủi ro? Ghi bằng chứng cụ thể.',
      'Trong nhóm đầu cầu bạn chọn, ai là người dùng, ai ảnh hưởng, ai trả tiền và ai có quyền phủ quyết?',
      'Ba nhóm bạn sẽ không phục vụ trong sáu tháng tới là ai, và bạn sẽ trả lời họ như thế nào khi họ tìm đến?',
    ],
    exercises: [
      {
        label: 'Viết lại chân dung theo hoàn cảnh',
        text: 'Lấy chân dung khách hàng hiện có của bạn và viết lại hoàn toàn bằng hoàn cảnh và hành vi, xoá mọi tính từ và mọi mô tả nhân khẩu không đổi hành vi. So hai bản và ghi phần nào biến mất.',
        level: 'e',
      },
      {
        label: 'Đếm số người tiếp cận được',
        text: 'Với một phân khúc, đếm thủ công số cá nhân hoặc cơ sở bạn thật sự có đường liên lạc: danh sách hội nhóm, bản đồ, danh bạ khách cũ. Ghi con số và cách đếm; không dùng số liệu ngành.',
        level: 'e',
      },
      {
        label: 'Bảng ba đại lượng',
        text: 'Lập bảng cho ba phân khúc với ba cột: số lượng tiếp cận được, mức chi trả ước lượng, độ khó tiếp cận từ 1 đến 5. Điền và ghi rõ mức tin cậy của từng ô.',
        level: 'm',
      },
      {
        label: 'Bản đồ vai trò quyết định',
        text: 'Chọn một khách hàng tổ chức đã có. Vẽ sơ đồ ai dùng, ai ảnh hưởng, ai trả tiền, ai phủ quyết được, và ghi mỗi người quan tâm tới điều gì. Kiểm lại bằng một cuộc gọi với người liên hệ chính.',
        level: 'm',
      },
      {
        label: 'Phép thử tiếp cận 20 người',
        text: 'Chọn phân khúc đầu cầu và liên hệ hai mươi người bằng kênh trực tiếp trong một tuần. Ghi tỉ lệ trả lời, tỉ lệ đồng ý nói chuyện, và ba lý do từ chối phổ biến nhất.',
        level: 'h',
      },
      {
        label: 'Danh sách từ chối',
        text: 'Viết danh sách ba nhóm không phục vụ kèm lý do và một mẫu câu trả lời lịch sự có gợi ý phương án khác. Thống nhất danh sách này với bộ phận bán hàng hoặc chăm sóc khách hàng và dán ở nơi họ làm việc.',
        level: 'h',
      },
      {
        label: 'Đối chiếu khách thật với nhóm mục tiêu',
        text: 'Lấy năm mươi khách hàng gần nhất, phân loại từng người vào phân khúc. Tính tỉ lệ khách nằm ngoài nhóm mục tiêu, doanh thu và chi phí phục vụ của họ, rồi viết một trang kết luận nên mở rộng hay siết lại định nghĩa.',
        level: 'h',
      },
      {
        label: 'Phỏng vấn khách đã rời bỏ',
        text: 'Liên hệ năm khách đã ngừng dùng trong ba tháng qua và hỏi lý do bằng câu hỏi về sự việc, không phải ý kiến. Xếp lý do vào hai nhóm: sai nhóm mục tiêu ngay từ đầu, hay đúng nhóm nhưng sản phẩm chưa đủ tốt.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nhóm mục tiêu to nhất thường không phải nhóm nên chọn làm đầu cầu?',
        a: 'Vì nhóm to thường đã có nhiều lựa chọn, mức đau trung bình thấp và chi phí tiếp cận cao. Đầu cầu tốt là nhóm đau nhiều, dễ gặp và chịu dùng bản chưa hoàn thiện; họ cho bạn vòng phản hồi nhanh và lời giới thiệu tới những người giống họ.',
      },
      {
        q: 'Sản phẩm nội bộ trong công ty thì ai là khách hàng mục tiêu?',
        a: 'Vẫn phải tách vai trò như với sản phẩm bán ra: người thao tác hằng ngày là người dùng, trưởng bộ phận thường là người ảnh hưởng, người duyệt ngân sách hoặc chịu trách nhiệm chỉ số vận hành là người trả tiền. Bỏ qua vai trò nào thì công cụ hoặc bị ép dùng mà không ai thích, hoặc được thích mà không được cấp nguồn lực duy trì.',
      },
      {
        q: 'Khi nào thì nên mở rộng ra khỏi nhóm đầu cầu?',
        a: 'Khi nhóm đầu cầu đã có dấu hiệu giữ chân ổn định và bạn hiểu rõ vì sao họ ở lại, đồng thời tốc độ tăng trưởng bị chặn bởi kích thước nhóm chứ không phải bởi chất lượng sản phẩm. Mở rộng sớm khi còn chưa giữ được nhóm đầu chỉ làm loãng nguồn lực và che mất tín hiệu.',
      },
    ],
    plan7:
      'Ngày 1: viết ba phân khúc theo hoàn cảnh. Ngày 2: đếm số người tiếp cận được cho từng phân khúc bằng kênh có sẵn. Ngày 3: ước lượng mức chi trả và độ khó tiếp cận, điền bảng ba đại lượng. Ngày 4: chọn đầu cầu và viết lý do trong nửa trang. Ngày 5: vẽ bản đồ vai trò quyết định cho đầu cầu đó. Ngày 6: liên hệ hai mươi người trong nhóm và ghi tỉ lệ trả lời. Ngày 7: viết danh sách ba nhóm không phục vụ kèm mẫu câu từ chối và chia sẻ với cả đội.',
    evidence:
      'Hãy dựng một trang định nghĩa khách hàng mục tiêu có ngày tháng, trong đó ghi rõ phân khúc đã chọn, số liệu tiếp cận thật, bản đồ vai trò quyết định và danh sách nhóm bị loại. Kèm theo kết quả một đợt tiếp cận thử với tỉ lệ trả lời thực tế. Trong CV, một dòng như “thu hẹp nhóm mục tiêu từ ba phân khúc xuống một, đưa tỉ lệ đơn lặp lại hằng tuần lên mức ổn định trong ba tháng” đáng giá hơn nhiều so với việc kể tên các công cụ. Trong phỏng vấn, hãy kể cụ thể một lần bạn từ chối một nhóm khách và điều đó đã giúp gì cho vận hành.',
    references: [
      { label: 'Y Combinator Startup Library — tài nguyên về khách hàng và thị trường sớm', url: 'https://www.ycombinator.com/library', type: 'article' },
      { label: 'Strategyzer — bộ công cụ mô hình kinh doanh và phân khúc khách hàng', url: 'https://www.strategyzer.com/', type: 'article' },
    ],
  }),

  // ── Chương 4 · Xác lập giá trị — Value Proposition ────────────────────────
  guide({
    thesis:
      'Tuyên bố giá trị là câu trả lời cho một câu hỏi rất khó chịu: vì sao một người đang xoay xở được bằng cách hiện tại lại phải bỏ công đổi sang cách của bạn. Nó chỉ đứng vững khi có đủ ba phần: nêu đúng việc cần xong của một nhóm cụ thể, nêu điểm khác biệt so với phương án hiện tại của chính nhóm đó, và nêu bằng chứng khiến người nghe tin lời hứa ấy. Một câu giá trị hay nghe thì hấp dẫn nhưng đúng với mọi đối thủ cùng ngành là một câu vô dụng.',
    why: {
      work:
        'Cùng một câu giá trị dùng lại được ở nhiều nơi: trang chủ, thư chào hàng, phần mở đầu buổi demo, và cả tiêu chí để loại bỏ tính năng không phục vụ lời hứa đó.',
      interview:
        'Ở vòng phỏng vấn sản phẩm hoặc marketing, đề bài phổ biến là “giới thiệu sản phẩm hiện tại của bạn trong 60 giây”. Người nói được lời hứa cụ thể, đối tượng hẹp và bằng chứng sẽ được nhớ; người liệt kê tính năng thì không.',
      study:
        'Khi bảo vệ đồ án hoặc thi ý tưởng khởi nghiệp, phần bị hỏi nhiều nhất luôn là “khác gì cái đã có”. Chuẩn bị bằng so sánh với phương án hiện tại của người dùng, kể cả phương án thủ công, giúp bạn không bị vặn ngã.',
      life:
        'Người làm tự do dùng chính khung này cho hồ sơ năng lực của mình: nói rõ mình giúp loại khách nào giải quyết việc gì, khác gì cách họ đang làm, và bằng chứng nào chống lưng.',
    },
    framework: [
      {
        name: 'Liệt kê việc cần xong, nỗi đau và lợi ích mong đợi',
        detail:
          'Dùng khung Value Proposition Canvas của Alexander Osterwalder: bên hồ sơ khách hàng ghi việc cần xong, nỗi đau và lợi ích mong đợi; bên bản đồ giá trị ghi sản phẩm giúp giảm đau ra sao và tạo lợi ích ra sao. Điền bên khách hàng trước, tuyệt đối không điền ngược.',
      },
      {
        name: 'Chọn một điểm neo, không phải năm',
        detail:
          'Chọn đúng một nỗi đau lớn nhất để làm trục cho lời hứa. Sản phẩm có thể giải quyết nhiều thứ, nhưng thông điệp có nhiều trục thì người nghe không giữ được cái nào; các lợi ích còn lại chuyển xuống làm bằng chứng hỗ trợ.',
      },
      {
        name: 'So với phương án hiện tại, không phải với đối thủ',
        detail:
          'Đối thủ thật của bạn thường là bảng tính, tin nhắn, sổ giấy hoặc thói quen không làm gì cả. Viết rõ khách đang tốn gì với phương án đó và bạn giảm được bao nhiêu, để lời hứa có mốc so sánh mà người nghe tự nhận ra.',
      },
      {
        name: 'Định lượng lời hứa',
        detail:
          'Chuyển lời hứa thành đại lượng người nghe tự kiểm được: số phút mỗi tuần, số bước bỏ bớt, số tiền tiết kiệm mỗi tháng, số ngày rút ngắn. Nếu chưa có số thật, hãy nói phạm vi và ghi rõ đo trên bao nhiêu trường hợp, đừng làm tròn thành lời khoe.',
      },
      {
        name: 'Kiểm bằng một phép thử tốn kém với người nghe',
        detail:
          'Đưa câu giá trị vào một tình huống buộc người ta phải bỏ ra thứ gì đó: một cuộc hẹn demo, một khoản đặt cọc, một lần điền biểu mẫu dài. Phản ứng khi phải trả giá mới là dữ liệu; lời khen trong hành lang thì không.',
      },
    ],
    scenario:
      'Một công ty phần mềm nhỏ bán hệ thống quản lý công nợ cho các nhà phân phối hàng tiêu dùng. Câu giới thiệu cũ là “nền tảng quản trị bán hàng toàn diện cho doanh nghiệp phân phối” — nghe đúng với cả chục sản phẩm khác và không ai nhớ. Đội ngồi lại điền hồ sơ khách hàng trước, dựa trên tám cuộc trao đổi với kế toán công nợ và giám sát bán hàng. Nỗi đau lớn nhất lộ ra rất cụ thể: cuối tháng, kế toán phải đối chiếu tay giữa phiếu giao hàng của nhân viên bán hàng và tiền về tài khoản, và công nợ quá hạn thường bị phát hiện muộn hơn ba tuần. Phương án hiện tại của họ là hai tệp bảng tính và một nhóm tin nhắn. Đội chọn một điểm neo và viết lại: “Cho nhà phân phối biết công nợ quá hạn ngay trong ngày phát sinh, thay vì cuối tháng — nhân viên chốt phiếu trên điện thoại, hệ thống đối chiếu với sao kê và cảnh báo theo từng tuyến bán hàng.” Bằng chứng đi kèm là ba khách đầu tiên rút thời gian phát hiện quá hạn từ khoảng ba tuần xuống trong ngày. Phép thử tốn kém: thay vì hỏi khách thấy thế nào, đội đề nghị đặt lịch một buổi đối chiếu thử với dữ liệu thật của họ; số nhà phân phối đồng ý gửi dữ liệu là thước đo thật của lời hứa.',
    comparison: [
      {
        weak: 'Câu giá trị viết bằng những từ có thể gắn cho bất kỳ sản phẩm nào: toàn diện, tối ưu, thông minh, dễ dùng.',
        mature:
          'Câu giá trị nêu tên nhóm khách hẹp, một nỗi đau cụ thể và một mốc thời gian hoặc con số mà đối thủ không nói được y hệt.',
      },
      {
        weak: 'Liệt kê mười hai tính năng trong trang giới thiệu và để người đọc tự suy ra lợi ích.',
        mature:
          'Nêu một lời hứa ở trên, ba bằng chứng ở giữa, và danh sách tính năng ở cuối cho người muốn kiểm tra chi tiết.',
      },
      {
        weak: 'Kiểm tuyên bố giá trị bằng cách hỏi bạn bè và đồng nghiệp xem câu chữ nghe có hay không.',
        mature:
          'Kiểm bằng hành vi của đúng nhóm mục tiêu trước một quyết định có giá: đặt lịch, gửi dữ liệu, đặt cọc, hoặc đăng ký danh sách chờ có xác thực.',
      },
    ],
    mistakes: [
      'Viết tuyên bố giá trị dựa trên điều đội tự hào về mặt kỹ thuật, ví dụ kiến trúc mới hay mô hình AI, trong khi khách hàng không mua kiến trúc mà mua kết quả cuối cùng đo được trong công việc của họ.',
      'Hứa quá mức so với bằng chứng đang có, khiến khách vào dùng với kỳ vọng sai; hậu quả không chỉ là mất khách mà còn là các đánh giá tiêu cực làm hỏng vòng bán hàng tiếp theo.',
      'Giữ nguyên một câu giá trị suốt hai năm dù nhóm khách hàng chính đã đổi, nên đội bán hàng tự chế thông điệp riêng và mỗi người nói một kiểu khi gặp khách.',
    ],
    worksheet: [
      'Việc cần xong quan trọng nhất của nhóm khách bạn chọn là gì, viết theo lời của họ chứ không theo ngôn ngữ nội bộ?',
      'Phương án hiện tại họ đang dùng là gì, và nó tốn của họ bao nhiêu thời gian hoặc tiền mỗi tháng?',
      'Điểm neo duy nhất trong lời hứa của bạn là gì, và điều gì khiến nó khó bị đối thủ nói lại nguyên văn?',
      'Ba bằng chứng chống lưng cho lời hứa của bạn là gì — số liệu, khách hàng cụ thể, hay phần trình diễn nào?',
      'Phép thử tốn kém nào bạn sẽ dùng trong hai tuần tới để kiểm câu giá trị, và mức phản hồi nào bị coi là thất bại?',
    ],
    exercises: [
      {
        label: 'Điền hồ sơ khách hàng trước',
        text: 'Điền nửa hồ sơ khách hàng của Value Proposition Canvas cho một nhóm cụ thể, chỉ dùng dữ liệu từ trao đổi thật. Để trống ô nào bạn không có bằng chứng và đánh dấu đó là việc cần đi hỏi.',
        level: 'e',
      },
      {
        label: 'Thử nghiệm câu đối thủ',
        text: 'Viết câu giá trị hiện tại của bạn, rồi thử thay tên sản phẩm bằng tên hai đối thủ. Nếu câu vẫn đúng, viết lại cho tới khi việc thay tên làm câu đó sai.',
        level: 'e',
      },
      {
        label: 'Bảng so với phương án hiện tại',
        text: 'Lập bảng ba cột: bước công việc, cách khách đang làm hôm nay, cách với sản phẩm của bạn. Điền thời gian ước lượng cho từng dòng và tính tổng chênh lệch mỗi tuần.',
        level: 'm',
      },
      {
        label: 'Ba phiên bản thông điệp',
        text: 'Viết ba phiên bản câu giá trị theo ba điểm neo khác nhau (tiết kiệm thời gian, giảm rủi ro, tăng doanh thu). Đem cả ba đi hỏi năm khách thuộc nhóm mục tiêu và ghi phiên bản nào khiến họ kể tiếp câu chuyện của mình.',
        level: 'm',
      },
      {
        label: 'Trang đích một màn hình',
        text: 'Dựng một trang đích chỉ gồm lời hứa, ba bằng chứng và một hành động. Đưa cho năm người ngoài ngành đọc trong 15 giây rồi hỏi họ nghĩ sản phẩm này dành cho ai và giúp việc gì.',
        level: 'm',
      },
      {
        label: 'Phép thử tốn kém',
        text: 'Thiết kế một phép thử buộc người quan tâm phải bỏ ra thứ gì đó thật: đặt lịch demo, gửi mẫu dữ liệu, hoặc đặt cọc hoàn lại được. Chạy trong hai tuần với ba mươi người và ghi tỉ lệ chuyển đổi từng bước.',
        level: 'h',
      },
      {
        label: 'Sổ tay thông điệp cho cả đội',
        text: 'Viết tài liệu hai trang gồm câu giá trị chính, ba câu cho ba nhóm khách khác nhau, danh sách từ cấm dùng, và ba câu trả lời cho phản đối phổ biến nhất. Đào tạo lại cho bộ phận bán hàng và ghi lại chỗ họ thấy khó dùng.',
        level: 'h',
      },
      {
        label: 'Đối chiếu lời hứa với thực tế sản phẩm',
        text: 'Lấy câu giá trị hiện tại và tự đi qua toàn bộ hành trình người dùng mới trong sản phẩm. Đánh dấu mọi chỗ trải nghiệm không giữ đúng lời hứa và xếp thứ tự sửa theo mức làm hỏng niềm tin.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên so sánh với phương án hiện tại của khách thay vì so với đối thủ trực tiếp?',
        a: 'Vì phần lớn khách chưa dùng sản phẩm nào cùng loại; họ đang xoay xở bằng bảng tính, tin nhắn hoặc thói quen cũ. Nếu chỉ so với đối thủ, bạn bỏ qua rào cản thật là chi phí đổi thói quen, và thông điệp sẽ không chạm tới người chưa từng tìm mua giải pháp nào.',
      },
      {
        q: 'Một câu giá trị nghe rất hay nhưng tỉ lệ đặt lịch demo gần bằng không. Bạn kết luận gì?',
        a: 'Có ba khả năng cần tách: câu hứa không đúng nỗi đau của nhóm đang nghe, người nghe không tin lời hứa vì thiếu bằng chứng, hoặc thông điệp đúng nhưng đang đến sai kênh và sai thời điểm. Cách tách là giữ nguyên kênh và đổi thông điệp, rồi giữ nguyên thông điệp và đổi kênh, chứ không đổi cả hai cùng lúc.',
      },
      {
        q: 'Có nên đưa con số vào tuyên bố giá trị khi mới chỉ đo được trên ba khách hàng?',
        a: 'Có, nhưng phải ghi rõ phạm vi và cỡ mẫu: “với ba nhà phân phối đầu tiên, thời gian phát hiện công nợ quá hạn rút từ khoảng ba tuần xuống trong ngày”. Nói rõ cỡ mẫu vừa giữ được sự trung thực vừa mạnh hơn một con số phần trăm chung chung không ai kiểm chứng được.',
      },
    ],
    plan7:
      'Ngày 1: điền nửa hồ sơ khách hàng bằng dữ liệu thật, để trống chỗ thiếu bằng chứng. Ngày 2: gọi hai khách để lấp chỗ trống. Ngày 3: lập bảng so với phương án hiện tại và tính chênh lệch thời gian. Ngày 4: viết ba phiên bản câu giá trị theo ba điểm neo. Ngày 5: thử với năm khách mục tiêu, ghi phản ứng. Ngày 6: dựng trang đích một màn hình theo phiên bản thắng. Ngày 7: khởi động phép thử tốn kém và định trước ngưỡng coi là thất bại.',
    evidence:
      'Giữ lại ba phiên bản câu giá trị kèm ghi chú vì sao chọn phiên bản cuối, bảng so sánh với phương án hiện tại của khách, và số liệu của phép thử tốn kém (bao nhiêu người tiếp cận, bao nhiêu đặt lịch, bao nhiêu gửi dữ liệu thật). Trong portfolio, đặt trang đích cũ cạnh trang đích mới kèm hai con số chuyển đổi là cách trình bày gọn và khó bắt bẻ. Khi phỏng vấn, hãy kể được lần bạn phải bỏ một thông điệp mà nội bộ rất thích vì dữ liệu hành vi không ủng hộ.',
    references: [
      { label: 'Strategyzer — Value Proposition Canvas', url: 'https://www.strategyzer.com/library/the-value-proposition-canvas', type: 'article', needsReview: true },
      { label: 'Silicon Valley Product Group — bài viết về giá trị sản phẩm', url: 'https://www.svpg.com/articles/', type: 'article' },
    ],
  }),

  // ── Chương 5 · Product–Market Fit ─────────────────────────────────────────
  guide({
    thesis:
      'Product–Market Fit không phải một cảm giác hưng phấn của đội ngũ mà là một trạng thái quan sát được: có một nhóm người cụ thể quay lại dùng đều mà bạn không phải thúc, và họ khó chịu thật sự nếu sản phẩm biến mất. Vì vậy nó được đo bằng đường giữ chân theo nhóm người vào cùng thời điểm, bằng tỉ lệ dùng lặp lại tự nhiên và bằng lời của những người sẽ mất mát khi mất sản phẩm — chứ không đo bằng lượt tải, lượt đăng ký hay số tiền vừa gọi được. Trước khi đạt trạng thái đó, mọi nỗ lực tăng trưởng chỉ là đổ nước vào một cái thùng thủng.',
    why: {
      work:
        'Biết mình chưa có PMF giúp đội chọn đúng loại việc: tiếp tục thu hẹp nhóm khách và sửa lõi sản phẩm, thay vì tuyển thêm người bán hàng và chi tiền quảng cáo — hai việc rất đắt khi làm sai thời điểm.',
      interview:
        'Ở các công ty giai đoạn sớm, câu hỏi thường gặp là “bạn biết sản phẩm cũ của bạn có phù hợp thị trường chưa dựa vào đâu”. Người dẫn ra đường giữ chân theo nhóm và mô tả nhóm người dùng trung thành sẽ khác hẳn người nói doanh thu tăng.',
      study:
        'Khi làm dự án môn học hoặc cuộc thi khởi nghiệp, phần yếu nhất thường là bằng chứng nhu cầu. Chỉ cần một biểu đồ giữ chân bốn tuần của ba mươi người dùng thật cũng đủ tách bài của bạn khỏi phần lớn bài dự thi.',
      life:
        'Cùng cách nghĩ này áp dụng cho kênh nội dung, lớp học nhỏ hay quán ăn của bạn: câu hỏi đáng giá không phải bao nhiêu người ghé lần đầu mà bao nhiêu người quay lại lần thứ ba mà không cần khuyến mãi.',
    },
    framework: [
      {
        name: 'Chốt một nhóm và một hành vi lõi',
        detail:
          'Chọn đúng một nhóm khách và một hành vi thể hiện giá trị đã được nhận: ghi xong một tuần chi tiêu, gửi xong một báo giá, hoàn thành một buổi học. Mọi phép đo PMF sau đó đều tính trên nhóm này và hành vi này, nếu trộn nhiều nhóm thì tín hiệu bị hoà tan.',
      },
      {
        name: 'Vẽ đường giữ chân theo nhóm vào',
        detail:
          'Chia người dùng theo tuần họ bắt đầu, rồi vẽ tỉ lệ còn thực hiện hành vi lõi ở tuần 1, 2, 4, 8. Điều cần tìm không phải con số cao mà là đường cong phẳng dần: nếu nó vẫn đi xuống thẳng tới gần không thì chưa có ai coi sản phẩm là cần thiết.',
      },
      {
        name: 'Hỏi câu hỏi mức độ thất vọng',
        detail:
          'Sean Ellis đề xuất một câu hỏi khảo sát: bạn sẽ thấy thế nào nếu không còn được dùng sản phẩm này nữa — rất thất vọng, hơi thất vọng, hay không sao. Đây là chỉ dấu tham khảo chứ không phải định luật; giá trị lớn nhất của nó là giúp bạn tách ra nhóm trả lời “rất thất vọng” để đi hỏi tiếp.',
      },
      {
        name: 'Mổ xẻ nhóm trung thành',
        detail:
          'Phỏng vấn riêng nhóm quay lại đều: họ làm nghề gì, hoàn cảnh nào, họ dùng sản phẩm thay cho cái gì, họ sẽ mất gì nếu mất nó. Rất thường xuyên, PMF nằm ở một phân khúc hẹp hơn nhiều so với nhóm bạn đang nhắm, và việc cần làm là thu hẹp lại chứ không mở rộng ra.',
      },
      {
        name: 'Ra quyết định kiên trì, thu hẹp hay xoay trục',
        detail:
          'Đặt trước một khung thời gian và ba lựa chọn: kiên trì cải thiện lõi, thu hẹp về nhóm trung thành, hoặc xoay trục sang bài toán khác. Không đặt trước thì đội sẽ trôi theo quán tính và luôn tìm được lý do để chạy tiếp thêm một quý.',
      },
    ],
    scenario:
      'Một đội hai người làm ứng dụng ghi chép chi tiêu cá nhân có 9.000 lượt tải sau sáu tháng và coi đó là dấu hiệu tốt. Khi vẽ đường giữ chân theo tuần vào, bức tranh khác hẳn: tỉ lệ người còn ghi chép ở tuần thứ tư rơi xuống gần như bằng không cho hầu hết các nhóm — trừ một nhóm nhỏ vẫn phẳng quanh một phần năm. Đội xuất danh sách nhóm phẳng đó ra và gọi mười một người. Điểm chung không nằm ở độ tuổi hay thu nhập mà ở hoàn cảnh: họ là người bán hàng nhỏ lẻ tự do, thu và chi lẫn giữa tiền cá nhân và tiền hàng, và họ dùng ứng dụng chủ yếu để biết cuối tháng còn thật sự bao nhiêu. Đội quyết định thu hẹp: bỏ phần biểu đồ đầu tư và mục tiêu tiết kiệm, thêm cách tách nhanh khoản tiền hàng và khoản cá nhân, và cho phép ghi bằng một thao tác trong ba giây. Đội cũng đặt một lằn ranh về nội dung: ứng dụng chỉ ghi chép và tổng hợp số liệu, không đưa lời khuyên đầu tư hay vay nợ, và mọi nội dung liên quan tới thuế đều dẫn người dùng tới người làm kế toán. Sau tám tuần, đường giữ chân của nhóm mới vào phẳng ở mức cao hơn hẳn dù tổng lượt tải giảm, và đó mới là lúc chi tiền cho kênh thu hút.',
    comparison: [
      {
        weak: 'Coi số lượt tải, lượt đăng ký hoặc số người dùng cộng dồn là bằng chứng sản phẩm đã phù hợp thị trường.',
        mature:
          'Đo bằng đường giữ chân theo nhóm vào cho một hành vi lõi, và chỉ tính là tín hiệu khi đường đó phẳng dần chứ không rơi về không.',
      },
      {
        weak: 'Khi số liệu xấu thì tăng ngân sách quảng cáo và khuyến mãi để kéo người mới vào bù phần rơi rụng.',
        mature:
          'Khi số liệu xấu thì dừng chi tiền thu hút, thu hẹp về nhóm còn ở lại và đi tìm hiểu vì sao chính họ ở lại.',
      },
      {
        weak: 'Hỏi cả cơ sở người dùng xem họ thấy sản phẩm thế nào rồi lấy tỉ lệ hài lòng trung bình làm thước đo.',
        mature:
          'Tách riêng nhóm sẽ rất thất vọng nếu mất sản phẩm, mô tả kỹ hoàn cảnh của họ và dùng chính hoàn cảnh đó để định nghĩa lại nhóm mục tiêu.',
      },
    ],
    mistakes: [
      'Tuyên bố đã đạt PMF dựa trên một tháng tăng trưởng đến từ một chiến dịch hoặc một bài viết lan truyền, rồi tuyển thêm người và mở rộng chi phí cố định ngay trước khi đường giữ chân của nhóm mới lộ ra sự thật.',
      'Trộn mọi nhóm khách vào chung một biểu đồ, khiến một nhóm nhỏ có sự phù hợp thật bị che lấp bởi đám đông vào rồi đi; đây là lý do nhiều đội bỏ lỡ chính cái phân khúc đáng lẽ nên tập trung.',
      'Đối xử với câu hỏi mức độ thất vọng như một kỳ thi phải đạt điểm sàn, nên đội đi tìm cách hỏi sao cho đẹp số thay vì dùng nó để tìm và hiểu nhóm trung thành.',
    ],
    worksheet: [
      'Hành vi lõi thể hiện giá trị trong sản phẩm của bạn là gì, và nó xảy ra bao lâu một lần với người dùng khoẻ mạnh?',
      'Vẽ nhanh đường giữ chân bốn tuần cho hai nhóm vào gần nhất: nó đang phẳng dần hay rơi về gần không?',
      'Ai là nhóm còn ở lại sau tuần thứ tư, và ba điểm chung về hoàn cảnh của họ là gì?',
      'Nếu sản phẩm biến mất ngày mai, nhóm đó sẽ phải quay lại dùng gì, và việc đó tốn của họ bao nhiêu?',
      'Trong mười hai tuần tới, mức nào của đường giữ chân khiến bạn chọn kiên trì, mức nào khiến bạn thu hẹp, mức nào khiến bạn xoay trục?',
    ],
    exercises: [
      {
        label: 'Định nghĩa hành vi lõi',
        text: 'Viết định nghĩa hành vi lõi kèm điều kiện đếm rõ ràng (sự kiện nào, trong bao lâu, tính một lần hay nhiều lần). Đưa cho một đồng nghiệp và nhờ họ đếm thủ công trên mười người dùng để kiểm định nghĩa có mơ hồ không.',
        level: 'e',
      },
      {
        label: 'Bảng giữ chân thủ công',
        text: 'Nếu chưa có công cụ phân tích, xuất dữ liệu thô ra bảng tính và tự dựng bảng giữ chân cho sáu tuần vào gần nhất. Ghi lại từng bước tính để lần sau lặp lại được.',
        level: 'e',
      },
      {
        label: 'Tách nhóm theo hoàn cảnh',
        text: 'Chia người dùng thành ba nhóm theo hoàn cảnh sử dụng chứ không theo nhân khẩu, rồi vẽ ba đường giữ chân riêng. Ghi lại nhóm nào phẳng nhất và chênh lệch bao nhiêu so với nhóm thấp nhất.',
        level: 'm',
      },
      {
        label: 'Khảo sát mức độ thất vọng',
        text: 'Gửi câu hỏi mức độ thất vọng cho những người đã thực hiện hành vi lõi ít nhất hai lần. Tách riêng nhóm trả lời rất thất vọng và mời năm người trong đó trò chuyện 20 phút.',
        level: 'm',
      },
      {
        label: 'Chân dung người dùng trung thành',
        text: 'Từ năm cuộc trò chuyện, viết một trang mô tả nhóm trung thành: hoàn cảnh, việc cần xong, thứ họ thay thế, câu nói tiêu biểu. Đối chiếu trang này với định nghĩa nhóm mục tiêu hiện tại và ghi mọi điểm lệch.',
        level: 'm',
      },
      {
        label: 'Phân tích người rời bỏ',
        text: 'Lấy ba mươi người ngừng dùng sau tuần đầu. Tìm điểm rơi chung trong hành trình bằng dữ liệu sự kiện, rồi liên hệ mười người hỏi chuyện đã xảy ra. Xếp nguyên nhân thành ba nhóm: sai đối tượng, vướng khi bắt đầu, giá trị không đủ.',
        level: 'h',
      },
      {
        label: 'Thử nghiệm thu hẹp',
        text: 'Chọn nhóm trung thành và làm một phiên bản sản phẩm thu hẹp phục vụ riêng họ trong bốn tuần: bớt tính năng, đổi lời chào, đổi hành trình bắt đầu. Đo đường giữ chân của các nhóm vào mới và so với nền cũ.',
        level: 'h',
      },
      {
        label: 'Biên bản quyết định',
        text: 'Viết biên bản một trang cho quyết định kiên trì, thu hẹp hay xoay trục: dữ liệu đang có, ba lựa chọn, tiêu chí chọn, ngày xem lại. Trình bày với người đồng sáng lập hoặc cấp trên và ghi lại phản biện họ đưa ra.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao đường giữ chân phẳng quan trọng hơn tỉ lệ giữ chân cao ở tuần đầu?',
        a: 'Vì tuần đầu luôn có phần tò mò và có thể được đẩy lên bằng khuyến mãi hoặc quảng cáo. Đường phẳng ở tuần thứ tư trở đi cho thấy tồn tại một nhóm coi sản phẩm là một phần thói quen; đó mới là nền để chi tiền thu hút mà không bị rò rỉ hết.',
      },
      {
        q: 'Doanh thu tháng này tăng gấp đôi. Điều đó có chứng minh đã đạt PMF không?',
        a: 'Không tự nó chứng minh. Doanh thu có thể tăng nhờ một hợp đồng lớn, một chiến dịch giảm giá, hoặc nhờ tăng giá trên nền khách cũ. Câu hỏi kiểm chứng là các nhóm khách vào theo tháng có giữ được hành vi lõi qua tuần thứ tư và thứ tám hay không, và tỉ lệ gia hạn của nhóm cũ đang ra sao.',
      },
      {
        q: 'Đội bạn có một nhóm nhỏ rất trung thành nhưng nhóm đó chỉ vài trăm người. Nên làm gì?',
        a: 'Trước hết mô tả cho được hoàn cảnh chung của họ, rồi đi tìm xem còn bao nhiêu người ở đúng hoàn cảnh đó mà bạn tiếp cận được. Nếu nhóm hoàn cảnh đủ lớn thì đây là đầu cầu và việc cần làm là mở kênh tới họ. Nếu bản chất nhóm rất hẹp và không nhân rộng được, hãy tính lại mô hình: hoặc tăng giá phục vụ nhóm hẹp, hoặc tìm bài toán liền kề rộng hơn.',
      },
    ],
    plan7:
      'Ngày 1: viết định nghĩa hành vi lõi và điều kiện đếm. Ngày 2: dựng bảng giữ chân theo nhóm vào cho sáu tuần gần nhất. Ngày 3: tách ba nhóm theo hoàn cảnh và vẽ ba đường riêng. Ngày 4: gửi khảo sát mức độ thất vọng cho người đã dùng thật. Ngày 5: trò chuyện với ba người trả lời rất thất vọng. Ngày 6: viết chân dung nhóm trung thành và đối chiếu với nhóm mục tiêu đang tuyên bố. Ngày 7: viết biên bản quyết định kiên trì, thu hẹp hay xoay trục kèm ngày xem lại.',
    evidence:
      'Bằng chứng có sức nặng nhất là một trang phân tích giữ chân do chính bạn dựng: biểu đồ theo nhóm vào, định nghĩa hành vi lõi, và phần diễn giải nói rõ quyết định nào đã đổi vì biểu đồ đó. Kèm theo là chân dung nhóm trung thành viết từ năm cuộc trò chuyện thật. Trong phỏng vấn, câu chuyện mạnh nhất thường là lần bạn khuyên đội dừng chi tiền thu hút vì đường giữ chân chưa phẳng — nó cho thấy bạn dám nói điều khó nghe dựa trên dữ liệu, thứ mà nhà tuyển dụng ở công ty giai đoạn sớm rất cần.',
    references: [
      { label: 'Y Combinator Library — tài nguyên về giai đoạn tìm kiếm phù hợp thị trường', url: 'https://www.ycombinator.com/library', type: 'article' },
      { label: 'Lean Startup — trang chính thức của Eric Ries về vòng lặp học hỏi', url: 'https://theleanstartup.com/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 6 · Xây dựng MVP ───────────────────────────────────────────────
  guide({
    thesis:
      'MVP không phải phiên bản rút gọn của sản phẩm mơ ước, mà là thí nghiệm rẻ nhất trả lời được câu hỏi đắt nhất bạn đang treo. Vì vậy trước khi bàn xây gì, phải viết ra giả định nào nếu sai thì toàn bộ kế hoạch đổ, rồi chọn hình thức thí nghiệm phù hợp — có khi là một bảng tính và một nhóm tin nhắn chạy tay, có khi là một trang giới thiệu, có khi mới là phần mềm thật. Tiêu chí thành công và mức bị coi là bác bỏ phải được viết trước khi chạy, nếu không mọi kết quả đều sẽ được diễn giải theo hướng có lợi cho thứ ta đã trót thích.',
    why: {
      work:
        'Khi ngân sách bị cắt hoặc thời gian bị ép, người biết thiết kế MVP vẫn trả lời được câu hỏi quan trọng nhất trong hai tuần, thay vì xin thêm ba tháng để xây một bản đầy đủ mà chưa chắc ai cần.',
      interview:
        'Đề bài phỏng vấn kiểu “bạn có bốn tuần và hai người, làm gì trước” là bài kiểm tra tư duy MVP. Người trả lời tốt bắt đầu bằng giả định rủi ro nhất và cách kiểm nó, chứ không bắt đầu bằng danh sách màn hình.',
      study:
        'Với đồ án hoặc cuộc thi, một bản chạy tay có mười người dùng thật thường thuyết phục hội đồng hơn một hệ thống hoàn chỉnh chưa ai chạm vào, vì nó chứng minh được nhu cầu chứ không chỉ chứng minh khả năng lập trình.',
      life:
        'Trước khi mở lớp dạy thêm, mở quán hay nhận một dòng dịch vụ mới, cách rẻ nhất luôn là chạy thủ công cho vài khách đầu tiên và đo xem có ai chịu trả tiền, thay vì đầu tư mặt bằng và thiết bị trước.',
    },
    framework: [
      {
        name: 'Xác định giả định rủi ro nhất',
        detail:
          'Liệt kê giả định và chấm hai trục: nếu sai thì thiệt hại bao nhiêu, và hiện có bao nhiêu bằng chứng. Giả định vừa đắt vừa trống bằng chứng chính là câu hỏi mà MVP phải trả lời. Mỗi lần chỉ nhắm một giả định, gộp nhiều thứ vào một bản thử sẽ khiến kết quả không diễn giải được.',
      },
      {
        name: 'Chọn hình thức thí nghiệm rẻ nhất',
        detail:
          'Có nhiều dạng: chạy tay hoàn toàn cho vài khách, dựng mặt tiền tự động nhưng phía sau người làm, trang giới thiệu để đo lượng đăng ký, bán trước khi có hàng, hoặc bản dùng được rất hẹp. Chọn dạng rẻ nhất còn trả lời được đúng câu hỏi, đừng chọn dạng oai nhất.',
      },
      {
        name: 'Viết tiêu chí thành công trước',
        detail:
          'Ghi trước con số: bao nhiêu người trong bao lâu, làm hành vi gì thì coi là ủng hộ, dưới mức nào thì coi là bác bỏ. Viết thêm một câu về việc bạn sẽ làm gì với từng kết quả, để tránh cảnh dữ liệu về rồi mới đi tìm cách đọc cho thuận.',
      },
      {
        name: 'Giữ chất lượng ở phần khách chạm vào',
        detail:
          'Tối thiểu là ở phạm vi, không phải ở sự cẩu thả. Nếu bạn hứa giao hàng trước 8 giờ thì phải giao đúng, dù phía sau là người chạy tay. Một MVP làm mất niềm tin sẽ giết cả cơ hội lẫn nhóm khách sớm quý giá nhất.',
      },
      {
        name: 'Đóng vòng học hỏi và quyết định',
        detail:
          'Sau thời hạn đã định, họp một buổi để đọc dữ liệu và ra một trong ba quyết định: mở rộng, sửa và thử lại, hoặc dừng. Ghi biên bản gồm giả định, thiết kế thí nghiệm, dữ liệu, kết luận — đây chính là vòng xây dựng, đo lường, học hỏi mà Lean Startup mô tả.',
      },
    ],
    scenario:
      'Hai người muốn làm sàn kết nối nhà vườn ở Lâm Đồng với các nhà hàng ở thành phố. Giả định rủi ro nhất không phải là kỹ thuật mà là: nhà hàng có chịu đổi nhà cung cấp rau đang quen để lấy hàng theo ngày từ một nguồn mới hay không. Thay vì xây sàn, họ chạy tay bốn tuần: một bảng tính danh mục hàng theo ngày, một nhóm tin nhắn cho tám nhà hàng, và mỗi tối gửi bảng giá cho hôm sau; đơn nhận qua tin nhắn, họ tự gom và thuê xe khách chở xuống, tự chia hàng lúc bốn giờ sáng. Tiêu chí viết trước: trong bốn tuần, ít nhất năm trong tám nhà hàng đặt lại ít nhất ba lần, và tỉ lệ giao đúng trước 6 giờ đạt trên 90 phần trăm; dưới mức đó thì coi là bác bỏ. Kết quả: sáu nhà hàng đặt lại đều, nhưng tỉ lệ giao đúng giờ chỉ khoảng 70 phần trăm, và nguyên nhân đều nằm ở khâu gom hàng ở vườn chứ không nằm ở đặt hàng. Kết luận là nhu cầu có thật nhưng nút thắt nằm ở vận hành, nên phần mềm đầu tiên họ xây không phải giao diện đặt hàng đẹp mà là công cụ chốt sản lượng với nhà vườn từ chiều hôm trước. Nếu họ xây sàn trước, sáu tháng công sức đã đổ vào đúng phần không phải nút thắt.',
    comparison: [
      {
        weak: 'Hiểu MVP là làm đủ mọi tính năng nhưng mỗi thứ làm sơ sài, kết quả là một sản phẩm dở đều và không kiểm chứng được điều gì.',
        mature:
          'Thu hẹp phạm vi tới một luồng duy nhất, làm luồng đó chạy thật tốt cho một nhóm nhỏ, và chấp nhận phía sau là công việc thủ công.',
      },
      {
        weak: 'Chạy thử rồi mới bàn xem kết quả thế nào là đạt, nên mọi con số đều được diễn giải theo hướng nên đi tiếp.',
        mature:
          'Viết trước ngưỡng ủng hộ và ngưỡng bác bỏ cùng hành động tương ứng, ký nhận trong biên bản trước khi bắt đầu.',
      },
      {
        weak: 'Đưa bản thử cho bạn bè, người quen và người trong nhóm dùng vì dễ mời, rồi coi phản hồi tích cực là tín hiệu.',
        mature:
          'Đưa cho đúng nhóm mục tiêu trong hoàn cảnh thật, tốt nhất là ở tình huống họ phải bỏ tiền hoặc bỏ công đáng kể.',
      },
    ],
    mistakes: [
      'Coi việc chạy tay là kém chuyên nghiệp nên vội tự động hoá từ đầu; hệ quả là đội mất nhiều tuần lập trình cho một quy trình chưa ai chứng minh là đúng, và sau đó rất ngại đổi vì đã tốn công.',
      'Nhét ba giả định vào cùng một bản thử để tiết kiệm thời gian, đến khi kết quả xấu thì không biết phần nào sai, buộc phải chạy lại từ đầu và mất nhiều hơn phần tưởng đã tiết kiệm.',
      'Để MVP sống mãi thành sản phẩm chính thức mà không bao giờ trả nợ kỹ thuật hay nợ quy trình, cho tới lúc số khách tăng gấp mười thì phần chạy tay sụp và cả đội chữa cháy suốt nhiều tháng.',
    ],
    worksheet: [
      'Giả định nào nếu sai thì cả kế hoạch của bạn đổ, và hiện bạn có bằng chứng gì cho nó ngoài trực giác?',
      'Hình thức thí nghiệm rẻ nhất trả lời được giả định đó là gì, chạy trong bao lâu và tốn khoảng bao nhiêu?',
      'Bao nhiêu người, làm hành vi gì, trong bao lâu thì bạn coi là ủng hộ? Dưới mức nào thì coi là bác bỏ?',
      'Phần nào trong trải nghiệm khách hàng bạn tuyệt đối không được làm ẩu dù đang chạy tay phía sau?',
      'Nếu kết quả bác bỏ giả định, bước tiếp theo cụ thể của bạn là gì — và ai là người có quyền ra quyết định đó?',
    ],
    exercises: [
      {
        label: 'Xếp hạng giả định',
        text: 'Liệt kê tám giả định của dự án, chấm mỗi cái theo thiệt hại nếu sai và lượng bằng chứng đang có. Khoanh đúng một giả định nằm ở góc đắt và trống, viết nó thành một câu kiểm chứng được.',
        level: 'e',
      },
      {
        label: 'Chọn dạng thí nghiệm',
        text: 'Với giả định đã khoanh, viết ba phương án thí nghiệm khác nhau kèm chi phí và thời gian ước lượng. Chọn phương án rẻ nhất còn trả lời được câu hỏi và giải thích vì sao hai phương án kia bị loại.',
        level: 'e',
      },
      {
        label: 'Bản mô tả thí nghiệm một trang',
        text: 'Viết một trang gồm: giả định, cách chạy, người tham gia, thời hạn, ngưỡng ủng hộ, ngưỡng bác bỏ, hành động ứng với mỗi kết quả. Xin chữ ký hoặc xác nhận của người ra quyết định trước khi bắt đầu.',
        level: 'm',
      },
      {
        label: 'Chạy tay một tuần',
        text: 'Thực hiện thủ công toàn bộ dịch vụ cho ba tới năm khách trong một tuần, tự tay làm mọi bước phía sau. Ghi nhật ký thời gian từng bước và đánh dấu bước nào tốn nhiều công nhất — đó là ứng viên tự động hoá đầu tiên.',
        level: 'm',
      },
      {
        label: 'Trang giới thiệu đo nhu cầu',
        text: 'Dựng một trang giới thiệu mô tả trung thực thứ bạn định làm, kèm một hành động thật (đăng ký danh sách chờ có xác thực hoặc đặt lịch). Đưa lưu lượng từ đúng nhóm mục tiêu và ghi tỉ lệ chuyển đổi cùng nguồn.',
        level: 'm',
      },
      {
        label: 'Bán trước một lô nhỏ',
        text: 'Nếu sản phẩm có thể bán trước, hãy chào bán cho mười khách mục tiêu với cam kết hoàn tiền và ngày giao rõ ràng. Ghi số người đồng ý, số người trả tiền thật và những lý do từ chối nghe được.',
        level: 'h',
      },
      {
        label: 'Biên bản đóng vòng',
        text: 'Sau khi thí nghiệm kết thúc, viết biên bản bốn phần: giả định, thiết kế, dữ liệu thô, kết luận và quyết định. Trình bày trong 15 phút cho những người không tham gia và ghi lại câu hỏi họ đặt ra mà bạn không trả lời được.',
        level: 'h',
      },
      {
        label: 'Kế hoạch trả nợ MVP',
        text: 'Liệt kê mọi chỗ đang chạy tay hoặc chắp vá trong MVP, ước lượng ngưỡng số lượng mà mỗi chỗ sẽ vỡ, và xếp lịch xử lý theo thứ tự ngưỡng gần nhất. Đưa danh sách này vào lộ trình chính thức thay vì giữ trong đầu.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao chạy tay phía sau lại là một MVP hợp lệ chứ không phải gian lận?',
        a: 'Vì mục tiêu của MVP là kiểm chứng nhu cầu và cách vận hành, không phải trình diễn công nghệ. Miễn là bạn không nói dối về những gì khách nhận được và giữ đúng cam kết chất lượng, việc con người làm thay máy giúp bạn học nhanh hơn và phát hiện các ngoại lệ mà bản tự động hoá sớm sẽ giấu mất.',
      },
      {
        q: 'Thế nào là một tiêu chí bác bỏ tốt?',
        a: 'Là một mức cụ thể, đo được, gắn với hành vi tốn kém của người dùng, và được viết trước khi chạy — ví dụ dưới năm trong tám nhà hàng đặt lại ba lần trong bốn tuần. Nó phải đủ chặt để có thể sai, nếu mọi kết quả có thể xảy ra đều nằm trong vùng chấp nhận thì đó không phải tiêu chí.',
      },
      {
        q: 'Kết quả MVP tốt ở quy mô năm khách. Có thể suy ra sẽ tốt ở quy mô năm trăm khách không?',
        a: 'Không suy ra trực tiếp. Ở quy mô nhỏ, người sáng lập bù đắp mọi thiếu sót bằng công sức cá nhân, nên kết quả phản ánh nhu cầu chứ chưa phản ánh khả năng vận hành. Bước tiếp theo là xác định phần nào không nhân rộng được và thiết kế thí nghiệm mới cho chính phần đó.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê và chấm điểm giả định, khoanh một cái. Ngày 2: viết ba phương án thí nghiệm và chọn phương án rẻ nhất. Ngày 3: viết bản mô tả thí nghiệm một trang với ngưỡng ủng hộ và bác bỏ, xin xác nhận. Ngày 4 và 5: chạy thí nghiệm với khách thật, ghi nhật ký thời gian từng bước. Ngày 6: tổng hợp dữ liệu thô, không diễn giải vội. Ngày 7: họp đóng vòng, ra quyết định mở rộng, sửa hay dừng và viết biên bản.',
    evidence:
      'Hãy lưu bộ hồ sơ ba mảnh cho một MVP bạn từng chạy: bản mô tả thí nghiệm viết trước có ngưỡng bác bỏ, ảnh chụp hoặc bản ghi cách bạn chạy tay, và biên bản đóng vòng có quyết định cuối. Bộ này chứng minh bạn làm việc theo giả định chứ không theo cảm hứng. Trong phỏng vấn, một câu chuyện về lần thí nghiệm bác bỏ chính ý tưởng bạn đề xuất và bạn đã tự đề nghị dừng thường tạo ấn tượng mạnh hơn mọi câu chuyện thành công, vì nó cho thấy bạn không gắn cái tôi vào giải pháp.',
    references: [
      { label: 'Lean Startup — vòng lặp xây dựng, đo lường, học hỏi', url: 'https://theleanstartup.com/', type: 'article', needsReview: true },
      { label: 'Y Combinator — kênh YouTube chính thức với các bài giảng cho người khởi sự', url: 'https://www.youtube.com/@ycombinator', type: 'video', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 7 · Viết yêu cầu sản phẩm — PRD ────────────────────────────────
  guide({
    thesis:
      'Tài liệu yêu cầu sản phẩm tồn tại để giảm số lần hiểu nhầm đắt tiền, chứ không để chứng minh người viết đã suy nghĩ kỹ. Một PRD dùng được luôn nói rõ bốn thứ mà đội thi công cần trước khi gõ dòng mã đầu tiên: bài toán và người chịu ảnh hưởng, phạm vi lần này gồm gì và không gồm gì, hành vi hệ thống ở các trường hợp biên và trường hợp lỗi, và tiêu chí nghiệm thu mà hai người đọc độc lập vẫn kết luận giống nhau. Độ dài không quyết định chất lượng; số câu hỏi mà tài liệu chặn trước được mới quyết định.',
    why: {
      work:
        'Phần lớn thời gian mất mát trong một chu kỳ phát triển không nằm ở việc viết mã mà nằm ở việc làm lại vì hiểu sai. PRD rõ ràng là cách rẻ nhất để chuyển những cuộc tranh luận đó lên trước khi tốn công.',
      interview:
        'Nhiều vòng phỏng vấn sản phẩm yêu cầu ứng viên viết một tài liệu ngắn cho một tính năng giả định. Người biết viết phần ngoài phạm vi, trường hợp biên và tiêu chí nghiệm thu nổi bật ngay, vì đó là phần hầu hết ứng viên bỏ trống.',
      study:
        'Khi làm dự án nhóm ở trường, phần lớn mâu thuẫn đến từ việc mỗi người hiểu đề bài một kiểu. Một trang yêu cầu thống nhất từ tuần đầu tiết kiệm hàng chục giờ tranh luận về sau.',
      life:
        'Khi thuê người sửa nhà, làm biển hiệu hay thiết kế đồ hoạ, chính khung này giúp bạn viết yêu cầu đủ rõ để nghiệm thu: cái gì có, cái gì không, đo bằng gì, sửa lại bao nhiêu lần.',
    },
    framework: [
      {
        name: 'Mở đầu bằng bài toán và người chịu ảnh hưởng',
        detail:
          'Nửa trang đầu nêu ai đang gặp khó, khó ở đâu, và hậu quả nếu không làm gì. Kèm một chỉ số hiện tại. Người đọc phải hiểu vì sao việc này đáng làm trước khi đọc mô tả giải pháp.',
      },
      {
        name: 'Viết phạm vi hai nửa',
        detail:
          'Liệt kê rõ những gì lần này làm và những gì cố ý không làm, kèm lý do ngắn cho phần bị loại. Nửa thứ hai chính là nơi ngăn phạm vi phình ra, và nó cũng là nơi người đọc dễ phát hiện bạn đang bỏ sót điều gì quan trọng.',
      },
      {
        name: 'Mô tả hành vi qua luồng và trường hợp biên',
        detail:
          'Với mỗi luồng, ghi điều kiện bắt đầu, các bước, kết quả, và đầy đủ các nhánh xấu: dữ liệu thiếu, mất mạng, quyền không đủ, thao tác lặp lại, số liệu bằng không hoặc âm. Danh sách trường hợp biên là phần phân biệt tài liệu nghiệp dư với tài liệu dùng được.',
      },
      {
        name: 'Chốt tiêu chí nghiệm thu và cách đo',
        detail:
          'Viết tiêu chí dưới dạng có thể kiểm: khi <điều kiện> thì <hệ thống làm gì>. Thêm phần đo lường sau khi phát hành: chỉ số nào, mức nền bao nhiêu, xem lại ngày nào. Không có phần này thì tính năng phát hành xong sẽ không ai biết nó có tác dụng hay không.',
      },
      {
        name: 'Ghi phụ thuộc, rủi ro và câu hỏi mở',
        detail:
          'Liệt kê phụ thuộc vào đội khác hoặc bên thứ ba, rủi ro pháp lý hoặc vận hành, và danh sách câu hỏi chưa có câu trả lời kèm tên người sẽ trả lời và hạn. Một tài liệu trung thực về chỗ mình chưa biết đáng tin hơn một tài liệu trông trơn tru.',
      },
    ],
    scenario:
      'Một công ty làm phần mềm bán hàng cho hộ kinh doanh nhận yêu cầu bổ sung tính năng phát hành hoá đơn điện tử. Bản mô tả đầu tiên dài hai dòng: “tích hợp hoá đơn điện tử với nhà cung cấp X”. Người viết tài liệu ngồi lại và dựng một PRD sáu trang. Phần bài toán nêu rõ chủ hộ đang phải mở phần mềm của bên phát hành hoá đơn riêng, nhập lại từng dòng hàng, và mỗi tháng có vài lần sai lệch giữa hoá đơn và sổ bán hàng. Phần ngoài phạm vi ghi thẳng: lần này không xử lý hoá đơn điều chỉnh, không xử lý hàng hoá có nhiều mức thuế suất khác nhau trong cùng một đơn, và không tự động nộp báo cáo. Phần trường hợp biên chiếm nhiều nhất: đơn bị huỷ sau khi đã phát hành, mất kết nối giữa lúc gửi, mã số thuế người mua sai định dạng, và trường hợp hệ thống bên phát hành trả về chậm quá 30 giây. Vì đây là lĩnh vực có quy định pháp luật thay đổi theo thời gian, tài liệu có thêm một mục riêng: liệt kê văn bản quy định đã tra, ngày tra, đường dẫn tới nguồn chính thức, và tên người làm kế toán đã xác nhận cách hiểu; kèm ghi chú rằng đội sản phẩm không đưa ra tư vấn thuế và mọi thay đổi quy định phải được kiểm lại với đại lý thuế trước khi phát hành. Nhờ mục này, khi quy định về thời điểm phát hành thay đổi, đội biết chính xác chỗ nào trong tài liệu phải cập nhật thay vì rà lại toàn bộ.',
    comparison: [
      {
        weak: 'Tài liệu chỉ mô tả màn hình và nút bấm, để đội thi công tự đoán hành vi ở các trường hợp bất thường.',
        mature:
          'Tài liệu mô tả hành vi theo luồng và liệt kê đầy đủ nhánh xấu, còn hình ảnh giao diện chỉ là phụ lục minh hoạ.',
      },
      {
        weak: 'Viết một tài liệu dài ba mươi trang rồi gửi qua thư và coi như đã thống nhất vì không ai phản hồi.',
        mature:
          'Viết ngắn hơn nhưng tổ chức một buổi rà soát 45 phút với kỹ sư, người thiết kế, vận hành và hỗ trợ khách hàng, ghi lại mọi câu hỏi phát sinh ngay vào tài liệu.',
      },
      {
        weak: 'Đóng băng tài liệu sau khi bắt đầu thi công, mọi thay đổi trao đổi miệng trong nhóm chat.',
        mature:
          'Giữ tài liệu sống với nhật ký thay đổi có ngày và lý do, để người đọc sau ba tháng vẫn hiểu vì sao hành vi hiện tại khác bản đầu.',
      },
    ],
    mistakes: [
      'Viết yêu cầu bằng ngôn ngữ giải pháp kỹ thuật ngay từ đầu, ví dụ mô tả cấu trúc bảng dữ liệu, khiến đội kỹ thuật mất quyền đề xuất cách làm rẻ hơn và tài liệu trở nên lỗi thời ngay khi kiến trúc thay đổi.',
      'Bỏ trống phần ngoài phạm vi vì sợ mất lòng người đề xuất; kết quả là mỗi buổi rà soát lại có thêm yêu cầu chen vào và không ai chỉ ra được thời điểm phạm vi bắt đầu phình.',
      'Dùng những từ không kiểm chứng được như nhanh, mượt, thân thiện trong tiêu chí nghiệm thu, nên khâu kiểm thử và khâu phát triển tranh cãi bằng cảm nhận cá nhân thay vì bằng ngưỡng đã thống nhất.',
    ],
    worksheet: [
      'Bài toán bạn đang giải là gì, ai chịu ảnh hưởng, và chỉ số nào hôm nay cho thấy nó có thật?',
      'Ba việc bạn cố ý không làm trong phiên bản này là gì, và lý do loại từng cái?',
      'Liệt kê năm trường hợp biên hoặc lỗi mà hệ thống phải xử lý. Với mỗi cái, hành vi mong muốn là gì?',
      'Viết ba tiêu chí nghiệm thu theo dạng khi... thì..., không dùng bất kỳ tính từ cảm tính nào.',
      'Có phụ thuộc hoặc rủi ro pháp lý, tài chính, an toàn nào không? Ai là người có chuyên môn sẽ xác nhận, và trước ngày nào?',
    ],
    exercises: [
      {
        label: 'Viết nửa trang bài toán',
        text: 'Với một yêu cầu đang chờ, viết nửa trang chỉ về bài toán: ai, khó ở đâu, hậu quả, chỉ số hiện tại. Không được nhắc tới bất kỳ giải pháp nào. Đưa cho người đề xuất đọc và ghi lại chỗ họ thấy chưa đúng.',
        level: 'e',
      },
      {
        label: 'Danh sách ngoài phạm vi',
        text: 'Viết danh sách năm mục ngoài phạm vi cho tính năng sắp làm, mỗi mục kèm một câu lý do và ghi rõ dự kiến xử lý ở đâu hoặc bao giờ. Gửi cho các bên liên quan trước buổi rà soát.',
        level: 'e',
      },
      {
        label: 'Săn trường hợp biên',
        text: 'Với một luồng chính, liệt kê ít nhất mười hai trường hợp biên theo bốn nhóm: dữ liệu bất thường, quyền và trạng thái tài khoản, lỗi kết nối và thời gian chờ, thao tác lặp hoặc song song. Đánh dấu cái nào bắt buộc xử lý lần này.',
        level: 'm',
      },
      {
        label: 'Chuyển tính từ thành ngưỡng',
        text: 'Tìm mọi tính từ trong một tài liệu yêu cầu cũ (nhanh, dễ, ổn định, rõ ràng) và viết lại thành ngưỡng đo được hoặc thành mô tả hành vi cụ thể. Đếm số chỗ phải sửa.',
        level: 'm',
      },
      {
        label: 'Buổi rà soát chéo bộ phận',
        text: 'Tổ chức buổi rà soát 45 phút với kỹ sư, thiết kế, vận hành và hỗ trợ khách hàng. Yêu cầu mỗi người nêu ít nhất một trường hợp tài liệu chưa nói tới. Cập nhật tài liệu ngay trong buổi và ghi tên người nêu.',
        level: 'm',
      },
      {
        label: 'Phần đo lường sau phát hành',
        text: 'Bổ sung vào tài liệu một mục gồm chỉ số chính, chỉ số bảo vệ không được xấu đi, mức nền hiện tại, và ngày xem lại. Đặt sẵn lịch cho ngày đó và mời những người đã dự buổi rà soát.',
        level: 'h',
      },
      {
        label: 'Mục tuân thủ và chuyên gia xác nhận',
        text: 'Nếu tính năng chạm tới thuế, hợp đồng, dữ liệu cá nhân hoặc sức khoẻ, viết một mục riêng liệt kê quy định đã tra kèm ngày tra và đường dẫn nguồn chính thức, tên chuyên gia đã xác nhận cách hiểu, và câu ghi rõ tài liệu này không thay thế tư vấn chuyên môn.',
        level: 'h',
      },
      {
        label: 'Kiểm tài liệu bằng người lạ',
        text: 'Đưa tài liệu cho một kỹ sư chưa từng tham gia dự án và nhờ họ ước lượng công việc chỉ dựa trên tài liệu. Ghi lại mọi câu hỏi họ phải hỏi thêm; mỗi câu hỏi là một lỗ hổng cần vá trong bản sau.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao phần ngoài phạm vi lại quan trọng ngang phần trong phạm vi?',
        a: 'Vì khoảng trống không được viết ra sẽ được mỗi bên tự lấp bằng kỳ vọng riêng, và mâu thuẫn chỉ lộ ra lúc nghiệm thu khi việc sửa đã đắt. Viết rõ những gì không làm cũng cho phép bạn từ chối yêu cầu chen ngang bằng một tài liệu đã được thống nhất, thay vì bằng thái độ cá nhân.',
      },
      {
        q: 'Tài liệu yêu cầu nên dài bao nhiêu?',
        a: 'Đủ dài để chặn trước những câu hỏi đắt tiền, và không dài hơn. Phép đo thực tế là số câu hỏi mà một kỹ sư ngoài dự án phải hỏi thêm sau khi đọc; nếu con số đó lớn thì tài liệu còn thiếu, còn nếu không ai đọc hết vì quá dài thì phần thừa cần cắt.',
      },
      {
        q: 'Tính năng của bạn liên quan tới quy định về hoá đơn và thuế. Trách nhiệm của người viết tài liệu tới đâu?',
        a: 'Người viết chịu trách nhiệm ghi rõ nguồn quy định đã tra, ngày tra, cách hiểu đang áp dụng và tên chuyên gia đã xác nhận, đồng thời thiết kế hệ thống sao cho cách hiểu đó dễ cập nhật khi quy định đổi. Người viết không thay thế vai trò của kế toán, đại lý thuế hoặc luật sư, và điều này phải được nêu rõ trong tài liệu để tránh mọi hiểu nhầm về trách nhiệm.',
      },
    ],
    plan7:
      'Ngày 1: viết nửa trang bài toán, không nhắc giải pháp. Ngày 2: viết phạm vi hai nửa và gửi phần ngoài phạm vi cho các bên. Ngày 3: mô tả luồng chính và luồng phụ. Ngày 4: săn ít nhất mười hai trường hợp biên. Ngày 5: viết tiêu chí nghiệm thu và mục đo lường sau phát hành. Ngày 6: tổ chức buổi rà soát chéo bộ phận và cập nhật tại chỗ. Ngày 7: đưa tài liệu cho một người ngoài dự án đọc và vá mọi lỗ hổng họ chỉ ra.',
    evidence:
      'Giữ lại một tài liệu yêu cầu thật đã được dùng để thi công, kèm nhật ký thay đổi và danh sách câu hỏi phát sinh trong buổi rà soát cùng tên người nêu. Nếu tài liệu thuộc về công ty cũ và không chia sẻ được, hãy viết lại một bản ẩn danh cho một tính năng tương tự. Trong phỏng vấn, phần tạo khác biệt gần như luôn là danh sách trường hợp biên và phần ngoài phạm vi — hãy chủ động chỉ vào chúng và kể một lần cụ thể mà một trường hợp biên bạn ghi trước đã ngăn được sự cố sau khi phát hành.',
    references: [
      { label: 'Atlassian — hướng dẫn về yêu cầu sản phẩm và tài liệu đội phát triển', url: 'https://www.atlassian.com/agile/product-management/requirements', type: 'article', needsReview: true },
      { label: 'Silicon Valley Product Group — tài nguyên về cách làm việc của đội sản phẩm', url: 'https://www.svpg.com/', type: 'article' },
    ],
  }),

  // ── Chương 8 · Ưu tiên tính năng ──────────────────────────────────────────
  guide({
    thesis:
      'Ưu tiên không phải việc sắp xếp danh sách theo mức độ hay ho mà là việc phân bổ một nguồn lực có hạn giữa những nhu cầu đều chính đáng, rồi chịu trách nhiệm công khai về thứ bị bỏ lại. Một hệ ưu tiên dùng được phải có ba thành phần: một tiêu chí chấm điểm mà mọi người hiểu giống nhau, một ngân sách công suất được ghi rõ theo loại việc, và một quy tắc xử lý khi có yêu cầu chen ngang. Thiếu ngân sách công suất thì mọi bảng chấm điểm chỉ tạo ra cảm giác khách quan trong khi hàng đợi vẫn dài ra mãi.',
    why: {
      work:
        'Khi có tiêu chí và ngân sách viết ra, việc từ chối một yêu cầu trở thành một cuộc thảo luận về đánh đổi thay vì một cuộc đối đầu giữa hai người; bạn hỏi được câu “nếu đưa việc này vào thì bỏ việc nào ra” mà không làm ai mất mặt.',
      interview:
        'Câu hỏi kinh điển ở vòng phỏng vấn sản phẩm là “bạn ưu tiên như thế nào”. Người nêu được cả cách chấm điểm lẫn cách chia ngân sách công suất và cách xử lý yêu cầu khẩn cấp sẽ vượt xa người chỉ nhắc tên một mô hình.',
      study:
        'Khi ôn thi hoặc làm đồ án, cùng một cơ chế: liệt kê chưa bao giờ là vấn đề, vấn đề là chấp nhận rằng thời gian có hạn nên phải bỏ hẳn vài phần và chịu điểm thấp ở đó để bảo vệ phần trọng số cao.',
      life:
        'Người làm tự do có nhiều đầu việc cùng lúc dùng chính khung này để chọn nhận dự án nào, và quan trọng hơn là để có cơ sở trả lời khách rằng việc mới chỉ bắt đầu được sau ngày nào.',
    },
    framework: [
      {
        name: 'Chuẩn hoá mục trong hàng đợi',
        detail:
          'Mọi mục phải viết ở cùng cấp độ: một câu vấn đề, nhóm người ảnh hưởng, bằng chứng, và ước lượng thô. Hàng đợi trộn lẫn một tính năng lớn với một lỗi chính tả thì không thể chấm điểm so sánh, và người ta sẽ luôn chọn theo cảm tính.',
      },
      {
        name: 'Chấm điểm bằng một công thức công khai',
        detail:
          'Có thể dùng RICE (số người ảnh hưởng, mức tác động, độ tin cậy, công sức) do Intercom giới thiệu, hoặc MoSCoW để chia bắt buộc, nên có, có thì tốt, lần này không làm. Điều quan trọng không phải chọn mô hình nào mà là cả đội dùng chung một cách chấm và ghi lại căn cứ cho từng điểm số.',
      },
      {
        name: 'Chia ngân sách công suất theo loại việc',
        detail:
          'Chia trước phần trăm công suất cho các loại: phát triển mới, sửa lỗi và nợ kỹ thuật, việc bắt buộc do tuân thủ hoặc hạ tầng, và phần dự phòng cho việc phát sinh. Ưu tiên chỉ diễn ra bên trong từng túi, nhờ vậy nợ kỹ thuật không bao giờ bị bỏ đói vô hạn.',
      },
      {
        name: 'Cân nhắc chi phí của sự chậm trễ',
        detail:
          'Với mỗi mục lớn, hỏi hoãn ba tháng thì mất gì: mất doanh thu theo mùa, mất cơ hội trước đối thủ, hay không mất gì cả. Nhiều việc điểm số trung bình nhưng có tính thời vụ rõ ràng phải làm trước một việc điểm cao nhưng làm lúc nào cũng được.',
      },
      {
        name: 'Định trước quy tắc chen ngang',
        detail:
          'Thống nhất từ đầu: yêu cầu khẩn cấp phải kèm việc bị đẩy ra, ai có quyền quyết định, và bao lâu thì xem lại. Không có quy tắc này thì kế hoạch quý sẽ bị bào mòn từng chút và không ai nhận ra tới lúc trượt hạn.',
      },
    ],
    scenario:
      'Đội sản phẩm của một hãng xe khách vận hành ứng dụng đặt vé bước vào quý mới với ba mươi bảy mục trong hàng đợi, đến từ bốn nguồn: tổng đài, phòng kinh doanh, đội vận hành bến xe và báo lỗi từ người dùng. Việc đầu tiên là chuẩn hoá: mỗi mục viết lại thành một câu vấn đề kèm số lượt ảnh hưởng ước lượng, nhờ đó bốn mục hoá ra trùng nhau và ba mục biến mất vì không ai nêu được bằng chứng. Đội chia ngân sách công suất trước: 55 phần trăm cho phát triển mới, 25 phần trăm cho lỗi và nợ kỹ thuật, 10 phần trăm cho việc bắt buộc từ đối tác thanh toán, 10 phần trăm dự phòng. Chấm điểm theo RICE cho thấy tính năng chọn chỗ ngồi trên sơ đồ xe đứng đầu, còn tính năng đổi vé trực tuyến chỉ đứng thứ sáu. Nhưng khi hỏi chi phí của sự chậm trễ, bức tranh đổi: cao điểm lễ tết chỉ còn bảy tuần, và mỗi mùa cao điểm tổng đài nhận rất nhiều cuộc gọi xin đổi vé, đủ để phải thuê thêm người trực. Đội đẩy đổi vé trực tuyến lên trước, đưa chọn chỗ ngồi xuống chu kỳ sau. Khi phòng kinh doanh đề nghị chèn thêm một chương trình khuyến mãi giữa quý, quy tắc chen ngang được áp dụng: yêu cầu được nhận nhưng kèm theo bảng ghi rõ mục nào bị đẩy ra và ai đã đồng ý, và biên bản đó được gửi cho cả bốn nguồn yêu cầu.',
    comparison: [
      {
        weak: 'Sắp xếp hàng đợi theo người đề xuất: yêu cầu của ai chức vụ cao hơn hoặc gọi nhiều lần hơn thì lên trước.',
        mature:
          'Sắp xếp theo tiêu chí công khai có bằng chứng, và khi ưu tiên bị ghi đè vì lý do chiến lược thì ghi rõ ai quyết định và vì sao.',
      },
      {
        weak: 'Nhận thêm việc mà không bỏ việc nào ra, với lý do đội sẽ cố gắng làm thêm một chút.',
        mature:
          'Áp dụng quy tắc vào một ra một trong cùng một túi công suất, để hàng đợi luôn phản ánh đúng năng lực thật.',
      },
      {
        weak: 'Chấm điểm ưu tiên một lần đầu quý rồi giữ nguyên bảng đó suốt ba tháng dù thông tin mới liên tục xuất hiện.',
        mature:
          'Xem lại bảng ưu tiên theo nhịp cố định hai tuần một lần, chỉ chấm lại những mục có thông tin mới, và giữ lịch sử thay đổi.',
      },
    ],
    mistakes: [
      'Tin rằng công thức chấm điểm tạo ra tính khách quan, trong khi mọi tham số đều do người nhập; nếu không ghi căn cứ cho từng con số thì bảng điểm chỉ hợp thức hoá thiên kiến sẵn có bằng vẻ ngoài toán học.',
      'Bỏ hẳn túi ngân sách cho nợ kỹ thuật và lỗi vì quý này cần tăng trưởng, rồi vài quý sau tốc độ giao hàng chậm lại rõ rệt mà không ai nối được nguyên nhân với quyết định cũ.',
      'Ưu tiên chỉ dựa vào số lượng yêu cầu nhận được, khiến sản phẩm luôn phục vụ nhóm khách hàng ồn ào nhất, còn nhóm im lặng nhưng đông hơn thì rời bỏ dần và không để lại dấu vết nào trong hàng đợi.',
    ],
    worksheet: [
      'Hàng đợi của bạn hiện có bao nhiêu mục, đến từ những nguồn nào, và bao nhiêu mục thiếu bằng chứng để chấm điểm?',
      'Ngân sách công suất chu kỳ này của bạn chia thế nào giữa việc mới, lỗi và nợ, việc bắt buộc, và dự phòng?',
      'Ba mục đứng đầu theo cách chấm điểm là gì, và bạn ghi căn cứ nào cho từng tham số?',
      'Mục nào có tính thời vụ hoặc có chi phí chậm trễ rõ ràng, và điều đó có làm đổi thứ tự không?',
      'Quy tắc chen ngang của đội bạn là gì: ai được quyết, phải đẩy gì ra, và thông báo cho ai?',
    ],
    exercises: [
      {
        label: 'Chuẩn hoá hàng đợi',
        text: 'Lấy hai mươi mục đầu trong hàng đợi và viết lại mỗi mục thành một câu vấn đề kèm nhóm ảnh hưởng và bằng chứng. Đánh dấu mục trùng nhau và mục không có bằng chứng nào.',
        level: 'e',
      },
      {
        label: 'Chấm điểm thử',
        text: 'Chấm mười mục theo một công thức duy nhất, ghi căn cứ cho từng tham số vào cột ghi chú. Nhờ một đồng nghiệp chấm độc lập mười mục đó rồi so hai bảng và thảo luận những chỗ lệch nhiều nhất.',
        level: 'e',
      },
      {
        label: 'Chia túi công suất',
        text: 'Đề xuất tỉ lệ ngân sách công suất cho chu kỳ tới, kèm lý lẽ dựa trên tình trạng hiện tại của sản phẩm. Trình bày với đội kỹ thuật và ghi lại tỉ lệ họ cho là hợp lý và vì sao khác bạn.',
        level: 'm',
      },
      {
        label: 'Tính chi phí chậm trễ',
        text: 'Chọn năm mục lớn và ước lượng thiệt hại nếu hoãn ba tháng, quy về tiền hoặc về số giờ vận hành. Ghi rõ mục nào phụ thuộc thời vụ và mốc thời gian không thể lùi.',
        level: 'm',
      },
      {
        label: 'Buổi ưu tiên có mặt các bên',
        text: 'Tổ chức một buổi 60 phút với đại diện các nguồn yêu cầu. Trình bày công suất thật rồi cùng xếp thứ tự trên bảng chung. Yêu cầu mỗi người chỉ ra thứ họ sẵn sàng bỏ, không chỉ thứ họ muốn thêm.',
        level: 'm',
      },
      {
        label: 'Viết quy tắc chen ngang',
        text: 'Soạn quy tắc một trang cho yêu cầu khẩn cấp: định nghĩa thế nào là khẩn cấp, ai quyết, mẫu biên bản đẩy việc ra, và cách thông báo. Áp dụng thử cho ba yêu cầu tiếp theo và ghi lại phản ứng.',
        level: 'h',
      },
      {
        label: 'Dọn hàng đợi',
        text: 'Đóng mọi mục quá sáu tháng không được ai nhắc lại, kèm thư ngắn giải thích cho người đề xuất và cách mở lại nếu vẫn cần. Đếm số mục đã đóng và số người phản hồi xin mở lại.',
        level: 'h',
      },
      {
        label: 'Đối chiếu dự đoán với kết quả',
        text: 'Với năm mục đã hoàn thành ở chu kỳ trước, so mức tác động dự đoán lúc chấm điểm với số liệu thật sau khi phát hành. Tính độ lệch và rút ra quy tắc hiệu chỉnh cho lần chấm sau.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao chia ngân sách công suất theo loại việc lại quan trọng hơn bản thân công thức chấm điểm?',
        a: 'Vì công thức chỉ sắp thứ tự bên trong một danh sách, còn ngân sách quyết định loại việc nào chắc chắn có phần. Nếu không chia túi, các việc phòng ngừa như nợ kỹ thuật và ổn định hệ thống sẽ luôn thua các việc có lợi ích thấy được ngay, cho tới khi hậu quả xuất hiện dưới dạng sự cố.',
      },
      {
        q: 'Một tính năng có điểm ưu tiên thấp nhưng giám đốc yêu cầu làm ngay. Xử lý thế nào cho đúng?',
        a: 'Không tranh cãi về điểm số mà đưa ra bảng đánh đổi: nếu đưa mục này vào thì mục nào bị đẩy ra và hệ quả là gì. Ghi lại quyết định cùng tên người quyết định vào biên bản. Người có quyền vẫn có thể ghi đè ưu tiên, nhưng quyết định đó phải hiển thị và có chi phí rõ ràng, chứ không âm thầm rút bớt của việc khác.',
      },
      {
        q: 'Đội bạn liên tục hoàn thành ít hơn kế hoạch dù đã chấm điểm cẩn thận. Nguyên nhân thường nằm ở đâu?',
        a: 'Thường không nằm ở thứ tự ưu tiên mà ở việc lấy toàn bộ công suất danh nghĩa làm công suất khả dụng: không trừ họp, hỗ trợ, sự cố, nghỉ phép và việc chen ngang. Cách sửa là đo tỉ lệ công suất thật đã dùng cho việc kế hoạch trong ba chu kỳ gần nhất rồi lập kế hoạch theo con số đó.',
      },
    ],
    plan7:
      'Ngày 1: chuẩn hoá hai mươi mục đầu hàng đợi. Ngày 2: chấm điểm mười mục và ghi căn cứ. Ngày 3: nhờ một đồng nghiệp chấm độc lập rồi đối chiếu. Ngày 4: đề xuất tỉ lệ ngân sách công suất và thống nhất với đội kỹ thuật. Ngày 5: tính chi phí chậm trễ cho năm mục lớn. Ngày 6: tổ chức buổi ưu tiên có mặt các bên và chốt thứ tự. Ngày 7: viết quy tắc chen ngang một trang và công bố cho các nguồn yêu cầu.',
    evidence:
      'Bằng chứng tốt cho kỹ năng này là một bảng ưu tiên thật có cột ghi căn cứ, kèm biên bản một buổi ưu tiên nhiều bên và một trang quy tắc chen ngang do bạn soạn. Mạnh hơn nữa là bảng đối chiếu dự đoán và kết quả thật của năm mục đã làm, vì nó cho thấy bạn hiệu chỉnh cách chấm điểm dựa trên phản hồi thực tế. Khi phỏng vấn, hãy kể một lần bạn từ chối hoặc hoãn một yêu cầu từ cấp cao bằng bảng đánh đổi và mọi bên vẫn giữ được quan hệ làm việc tốt.',
    references: [
      { label: 'Intercom — blog về sản phẩm, nơi giới thiệu cách chấm điểm RICE', url: 'https://www.intercom.com/blog/product-management/', type: 'article', needsReview: true },
      { label: 'Mind the Product — cộng đồng và bài viết về quản trị sản phẩm', url: 'https://www.mindtheproduct.com/', type: 'article' },
    ],
  }),

  // ── Chương 9 · Trải nghiệm người dùng — UX ────────────────────────────────
  guide({
    thesis:
      'Trải nghiệm người dùng là tổng của những gì người ta phải nghĩ, phải nhớ và phải chịu đựng để hoàn thành việc của họ — không phải là màu sắc và bố cục. Vì vậy nó được cải thiện bằng cách cắt bớt bước, giảm số quyết định phải đưa ra, viết chữ đúng ngôn ngữ người dùng, xử lý tử tế các trạng thái lỗi và trạng thái trống, và bảo đảm ai cũng dùng được kể cả khi mắt kém hay tay đang bận. Thước đo của UX là hành vi quan sát được: tỉ lệ hoàn thành, thời gian hoàn thành, số lỗi mắc phải và số lần phải gọi hỗ trợ.',
    why: {
      work:
        'Rất nhiều vấn đề bị gán nhãn “người dùng không chịu học” thực chất là lỗi thiết kế; nhìn ra điều đó giúp bạn sửa được nguyên nhân thay vì viết thêm tài liệu hướng dẫn mà không ai đọc.',
      interview:
        'Ứng viên sản phẩm hoặc thiết kế thường được đưa một màn hình và hỏi nhận xét. Người trả lời theo cấu trúc — mục tiêu người dùng, tải nhận thức, trạng thái lỗi, khả năng tiếp cận — nghe chuyên nghiệp hơn hẳn người chỉ nói cảm nhận thẩm mỹ.',
      study:
        'Với đồ án có giao diện, điểm số thường tăng rõ khi bạn trình bày được hành trình người dùng và các trạng thái đặc biệt, thay vì chỉ trình bày ảnh chụp màn hình ở trạng thái lý tưởng.',
      life:
        'Kỹ năng này còn dùng cho những thứ ngoài phần mềm: viết một biểu mẫu đăng ký ở câu lạc bộ, sắp xếp thực đơn quán, hay hướng dẫn nhân viên mới — nguyên tắc giảm số quyết định và nói bằng ngôn ngữ người dùng là như nhau.',
    },
    framework: [
      {
        name: 'Vẽ hành trình theo mục tiêu người dùng',
        detail:
          'Ghi lại mục tiêu, các bước thực tế, và điểm chuyển giao giữa các kênh (điện thoại, quầy, giấy tờ). Trải nghiệm hỏng thường nằm ở chỗ chuyển giao chứ không nằm trong một màn hình đơn lẻ, nên chỉ nhìn giao diện sẽ không thấy.',
      },
      {
        name: 'Cắt bước và giảm số quyết định',
        detail:
          'Với mỗi bước hỏi ba câu: có thể bỏ không, có thể điền sẵn không, có thể lùi sang sau không. Mỗi trường nhập liệu là một cơ hội gây bỏ dở, nên bắt buộc phải có lý do tồn tại được nêu bằng câu trả lời cho việc sẽ dùng dữ liệu đó vào đâu.',
      },
      {
        name: 'Viết chữ trước khi vẽ giao diện',
        detail:
          'Nhãn, câu hỏi và thông báo lỗi quyết định phần lớn trải nghiệm. Dùng đúng từ người dùng nói, tránh thuật ngữ nội bộ, và bảo đảm mỗi thông báo lỗi nói rõ chuyện gì xảy ra và bước tiếp theo là gì, chứ không chỉ báo là có lỗi.',
      },
      {
        name: 'Thiết kế đủ các trạng thái',
        detail:
          'Với mỗi màn hình, thiết kế ít nhất năm trạng thái: trống, đang tải, có dữ liệu, lỗi, và không có quyền. Trạng thái trống là cơ hội hướng dẫn tốt nhất mà phần lớn sản phẩm bỏ phí bằng một dòng chữ mờ nhạt.',
      },
      {
        name: 'Bảo đảm khả năng tiếp cận và đo lại',
        detail:
          'Kiểm độ tương phản màu, kích thước vùng chạm, thao tác bằng bàn phím, nhãn cho trình đọc màn hình theo hướng dẫn WCAG của W3C. Sau đó đo bằng hành vi: tỉ lệ hoàn thành, thời gian trung vị, số lỗi nhập liệu và số cuộc gọi hỗ trợ liên quan.',
      },
    ],
    scenario:
      'Một phòng khám đa khoa đưa biểu mẫu đăng ký khám lên trang web để giảm tải quầy tiếp nhận, nhưng sau hai tháng chỉ một phần nhỏ bệnh nhân dùng, phần còn lại vẫn xếp hàng. Đội sản phẩm ngồi quan sát tại quầy hai buổi sáng và nhận ra ba chuyện: biểu mẫu có hai mươi ba trường, trong đó nhiều trường chỉ dùng cho báo cáo nội bộ; trường chọn chuyên khoa dùng đúng tên chuyên khoa trong ngành nên người lớn tuổi không biết chọn gì; và khi nhập sai định dạng số bảo hiểm, hệ thống xoá sạch dữ liệu đã điền. Nhóm sửa theo thứ tự: cắt còn tám trường bắt buộc và chuyển phần còn lại sang bước sau khi đã đến khám; thay danh sách chuyên khoa bằng câu hỏi bằng ngôn ngữ đời thường về triệu chứng chính kèm ví dụ, đồng thời ghi rõ trên màn hình rằng lựa chọn này chỉ để sắp xếp lịch và việc phân loại cuối cùng do nhân viên y tế thực hiện khi tiếp nhận, hệ thống không đưa ra bất kỳ chẩn đoán nào; sửa lỗi mất dữ liệu và viết lại thông báo lỗi nói rõ số bảo hiểm gồm bao nhiêu ký tự. Họ đo ba chỉ số trước và sau: tỉ lệ hoàn thành biểu mẫu, thời gian trung vị điền, và số cuộc gọi tới tổng đài hỏi cách đăng ký. Cả ba đều cải thiện, và điều bất ngờ là nhóm hưởng lợi rõ nhất lại là người nhà đăng ký hộ người lớn tuổi.',
    comparison: [
      {
        weak: 'Coi UX là việc làm đẹp giao diện ở cuối dự án, sau khi luồng nghiệp vụ đã chốt cứng.',
        mature:
          'Đưa câu hỏi về hành trình, số bước và trạng thái lỗi vào ngay lúc định nghĩa yêu cầu, khi việc thay đổi còn rẻ.',
      },
      {
        weak: 'Giải thích tỉ lệ bỏ dở cao bằng nhận định rằng người dùng thiếu kiên nhẫn hoặc thiếu kỹ năng công nghệ.',
        mature:
          'Ngồi xem năm người thật làm thao tác đó và đếm chính xác họ dừng ở bước nào, rồi sửa bước đó trước khi kết luận về người dùng.',
      },
      {
        weak: 'Chỉ thiết kế trạng thái lý tưởng khi mọi thứ đầy đủ và thành công.',
        mature:
          'Thiết kế đủ trạng thái trống, đang tải, lỗi, không có quyền, và coi thông báo lỗi là một phần nội dung sản phẩm cần được viết cẩn thận.',
      },
    ],
    mistakes: [
      'Thêm phần hướng dẫn, video và chú thích để vá một luồng khó dùng, thay vì cắt bớt bước; kết quả là giao diện càng chật và người dùng vẫn hỏng ở đúng chỗ cũ.',
      'Bỏ qua khả năng tiếp cận vì cho rằng nhóm người dùng của mình không có nhu cầu đó, trong khi độ tương phản kém, chữ nhỏ và vùng chạm hẹp gây hại cho mọi người dùng khi họ đang vội, đang ở ngoài nắng hoặc dùng một tay.',
      'Đo trải nghiệm bằng điểm hài lòng chung chung thu thập ngay sau khi phát hành, thay vì đo hành vi cụ thể như tỉ lệ hoàn thành và số lỗi nhập liệu, nên không biết phải sửa chỗ nào.',
    ],
    worksheet: [
      'Viết mục tiêu người dùng cho một luồng quan trọng, bằng lời của họ. Bao nhiêu bước và bao nhiêu quyết định họ phải đưa ra để đạt mục tiêu đó?',
      'Với biểu mẫu hoặc luồng này, trường nào có thể bỏ, trường nào có thể điền sẵn, trường nào có thể hỏi sau? Mỗi trường còn lại sẽ được dùng vào việc gì?',
      'Liệt kê ba thông báo lỗi hiện tại và viết lại mỗi cái sao cho nói rõ chuyện gì xảy ra và bước tiếp theo cần làm.',
      'Màn hình chính của bạn có đủ năm trạng thái chưa? Trạng thái trống hiện đang nói gì với người mới?',
      'Ba chỉ số hành vi nào sẽ cho biết trải nghiệm đã tốt lên, và mức hiện tại của chúng là bao nhiêu?',
    ],
    exercises: [
      {
        label: 'Đếm bước và quyết định',
        text: 'Tự thực hiện một luồng quan trọng trong sản phẩm và đếm chính xác số màn hình, số trường nhập và số quyết định. Ghi mục tiêu cắt giảm cụ thể cho từng con số.',
        level: 'e',
      },
      {
        label: 'Viết lại nhãn và thông báo',
        text: 'Chọn mười nhãn hoặc thông báo dùng thuật ngữ nội bộ và viết lại bằng từ mà người dùng thật sự nói. Kiểm bằng cách đọc to cho một người ngoài ngành nghe và hỏi họ hiểu gì.',
        level: 'e',
      },
      {
        label: 'Bảng năm trạng thái',
        text: 'Với ba màn hình quan trọng nhất, lập bảng năm trạng thái và mô tả nội dung cho từng ô. Đánh dấu ô nào hiện chưa được thiết kế và ước lượng công sửa.',
        level: 'm',
      },
      {
        label: 'Rà theo bộ nguyên tắc',
        text: 'Dùng bộ mười nguyên tắc heuristic của Jakob Nielsen để rà một luồng, ghi mỗi vi phạm kèm ảnh chụp và mức nghiêm trọng từ 1 đến 3. Xếp danh sách theo mức nghiêm trọng nhân với tần suất gặp.',
        level: 'm',
      },
      {
        label: 'Kiểm khả năng tiếp cận cơ bản',
        text: 'Kiểm bốn điểm trên một trang: độ tương phản chữ và nền, thao tác toàn bộ bằng bàn phím, kích thước vùng chạm trên điện thoại, và nhãn cho các ô nhập. Ghi lại mọi chỗ không đạt kèm hướng sửa.',
        level: 'm',
      },
      {
        label: 'Quan sát tại chỗ',
        text: 'Dành nửa buổi quan sát người dùng thật thao tác trong hoàn cảnh thật của họ, không can thiệp. Ghi lại mọi lần họ dừng quá năm giây, hỏi người khác, hoặc quay lại bước trước.',
        level: 'h',
      },
      {
        label: 'Cắt một nửa số trường',
        text: 'Chọn một biểu mẫu và đề xuất phương án cắt một nửa số trường: trường nào bỏ, trường nào lấy từ dữ liệu đã có, trường nào hỏi ở bước sau. Thương lượng với các bộ phận đang cần dữ liệu đó và ghi lại lập luận hai bên.',
        level: 'h',
      },
      {
        label: 'Báo cáo trước và sau',
        text: 'Sau khi sửa, đo lại ba chỉ số hành vi trong bốn tuần và viết báo cáo so sánh với mức nền, kèm phần bàn về các yếu tố khác có thể gây nhiễu như mùa vụ hay chiến dịch truyền thông.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao thêm hướng dẫn thường không cứu được một luồng khó dùng?',
        a: 'Vì người dùng đến để hoàn thành việc của họ chứ không đến để học sản phẩm, và phần lớn sẽ bỏ qua hướng dẫn. Hướng dẫn cũng che mất tín hiệu: khi luồng khó vẫn ở đó, đội mất động lực sửa gốc. Cách đúng là giảm số bước và số quyết định, chỉ giữ hướng dẫn cho phần thật sự phức tạp về nghiệp vụ.',
      },
      {
        q: 'Trạng thái trống nên chứa những gì?',
        a: 'Nên nói rõ vì sao chưa có dữ liệu, việc đầu tiên nên làm là gì, và cung cấp ngay hành động đó; nếu được thì thêm một ví dụ mẫu để người mới hình dung kết quả. Đó là màn hình mà người dùng mới gặp nhiều nhất, nên bỏ trống nó là bỏ phí cơ hội hướng dẫn tốt nhất.',
      },
      {
        q: 'Sản phẩm của bạn dùng trong bối cảnh y tế. Ranh giới nào cần giữ khi thiết kế trải nghiệm?',
        a: 'Sản phẩm có thể thu thập thông tin, sắp xếp lịch và trình bày dữ liệu, nhưng không được tạo cảm giác đang chẩn đoán hay khuyên điều trị; mọi phân loại chuyên môn phải do nhân viên y tế xác nhận và điều đó cần được nói rõ trên giao diện. Ngoài ra dữ liệu sức khoẻ là dữ liệu nhạy cảm, nên phần quyền truy cập và lưu trữ phải được xem xét cùng bộ phận pháp lý và chuyên môn y tế trước khi phát hành.',
      },
    ],
    plan7:
      'Ngày 1: vẽ hành trình một luồng quan trọng và đếm bước, quyết định. Ngày 2: rà theo bộ nguyên tắc heuristic và ghi mức nghiêm trọng. Ngày 3: viết lại mười nhãn và thông báo lỗi. Ngày 4: lập bảng năm trạng thái cho ba màn hình chính. Ngày 5: kiểm bốn điểm khả năng tiếp cận. Ngày 6: quan sát ba người dùng thật thao tác. Ngày 7: chốt danh sách sửa xếp theo mức nghiêm trọng nhân tần suất và đo mức nền cho ba chỉ số hành vi.',
    evidence:
      'Hãy dựng một hồ sơ trước và sau cho một luồng thật: ảnh chụp bản cũ có đánh dấu vi phạm, bản mới, và ba chỉ số hành vi đo trong bốn tuần. Kèm theo bảng năm trạng thái và kết quả kiểm khả năng tiếp cận. Trong portfolio, phần kể lại lý do cắt bỏ từng trường trong biểu mẫu và cách bạn thương lượng với bộ phận đang cần dữ liệu đó có sức nặng hơn nhiều so với ảnh giao diện đẹp. Trong phỏng vấn, hãy dùng chính hồ sơ này để trả lời câu hỏi về cách bạn cân bằng nhu cầu nội bộ và trải nghiệm người dùng.',
    references: [
      { label: 'Nielsen Norman Group — 10 nguyên tắc heuristic về khả năng dùng', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/', type: 'article' },
      { label: 'W3C WAI — tổng quan chuẩn khả năng tiếp cận WCAG', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', type: 'article' },
    ],
  }),

  // ── Chương 10 · Prototype và kiểm thử người dùng ──────────────────────────
  guide({
    thesis:
      'Prototype là công cụ để mua thông tin với giá rẻ, nên độ trung thực của nó phải vừa đủ để trả lời câu hỏi đang treo, không hơn. Kiểm thử người dùng không phải buổi trình diễn sản phẩm mà là buổi giao nhiệm vụ và im lặng quan sát: bạn đưa một việc thật, không hướng dẫn, và ghi lại chính xác chỗ người ta khựng lại. Giá trị nằm ở chỗ mỗi buổi thử đều trả lời được câu hỏi đã đặt trước, và mọi phát hiện đều được xếp hạng theo mức nghiêm trọng để biến thành việc sửa cụ thể.',
    why: {
      work:
        'Một buổi thử với năm người có thể chặn được hàng tuần thi công sai hướng; đây là cách rẻ nhất để chấm dứt tranh cãi nội bộ về việc cách nào dễ hiểu hơn.',
      interview:
        'Nhà tuyển dụng thường hỏi bạn kiểm chứng thiết kế bằng cách nào. Người kể được kịch bản nhiệm vụ, cách tuyển người tham gia, quy tắc không gợi ý và cách xếp hạng phát hiện sẽ khác hẳn người nói đã cho vài đồng nghiệp xem thử.',
      study:
        'Đồ án có phần kiểm thử người dùng với dữ liệu quan sát cụ thể luôn mạnh hơn phần trình bày thiết kế thuần tuý, vì hội đồng thấy được bằng chứng thay vì chỉ thấy ý tưởng.',
      life:
        'Cùng nguyên tắc áp dụng khi bạn làm biển hiệu, thực đơn, hay tờ hướng dẫn: đưa cho năm người chưa biết gì và nhờ họ làm một việc, bạn sẽ thấy ngay chỗ mình viết khó hiểu mà bản thân không nhận ra.',
    },
    framework: [
      {
        name: 'Viết câu hỏi cần trả lời trước',
        detail:
          'Mỗi buổi thử phải có một tới ba câu hỏi cụ thể: người ta có tự tìm được chỗ đổi món không, họ hiểu giá hiển thị là đã gồm thuế hay chưa. Không có câu hỏi thì buổi thử biến thành buổi xin lời khen.',
      },
      {
        name: 'Chọn độ trung thực thấp nhất còn dùng được',
        detail:
          'Bản vẽ tay kiểm được cấu trúc và cách gọi tên; bản bấm được kiểm được luồng; bản chạy thật mới kiểm được tốc độ và cảm giác thao tác. Chọn mức cao hơn cần thiết chỉ làm chậm và khiến người thử ngại chê vì thấy công sức bỏ ra đã nhiều.',
      },
      {
        name: 'Soạn kịch bản nhiệm vụ, không phải câu hỏi',
        detail:
          'Giao việc theo tình huống: bạn đang đứng chờ, hãy đặt một phần cơm gà không hành và trả bằng thẻ. Tránh chỉ dẫn ngầm như nhấn vào nút màu cam, vì như vậy bạn đang thử trí nhớ chứ không thử thiết kế.',
      },
      {
        name: 'Điều phối bằng im lặng và câu hỏi trung tính',
        detail:
          'Nhắc người tham gia nói to suy nghĩ, rồi im lặng. Khi họ khựng lại, chỉ hỏi những câu trung tính như bạn đang tìm gì, bạn nghĩ điều gì sẽ xảy ra nếu bấm vào đó. Tuyệt đối không giải thích cách dùng cho tới khi kết thúc nhiệm vụ.',
      },
      {
        name: 'Xếp hạng phát hiện và sửa rồi thử lại',
        detail:
          'Ghi mỗi phát hiện kèm số người gặp và mức nghiêm trọng: chặn hoàn toàn, gây chậm, gây khó chịu. Sửa nhóm chặn trước, rồi chạy vòng thử tiếp với người mới. Jakob Nielsen từng chỉ ra rằng thử với khoảng năm người mỗi vòng và lặp nhiều vòng hiệu quả hơn dồn hết vào một vòng đông người.',
      },
    ],
    scenario:
      'Một chuỗi quán cơm văn phòng lắp máy gọi món tự phục vụ ở ba cửa hàng để giảm hàng chờ giờ trưa. Trước khi đặt hàng làm phần mềm, đội in bảy màn hình ra giấy A3, dán lên tường cạnh quầy và nhờ khách đi ngang thử: nhiệm vụ là gọi một suất cơm sườn, bỏ hành, thêm canh, rồi trả bằng thẻ. Câu hỏi cần trả lời được viết trước: khách có tự tìm được chỗ tuỳ chỉnh món không, và họ có hiểu bước xác nhận cuối cùng không. Trong tám người thử, sáu người không tìm ra chỗ bỏ hành vì nút tuỳ chỉnh nằm sau khi đã thêm món vào giỏ, và bốn người bấm xác nhận rồi vẫn đứng chờ vì màn hình không nói rõ phải ra quầy lấy số. Đội sửa ngay trên giấy trong buổi chiều, dán bản mới và thử tiếp với sáu người khác. Vòng hai lộ ra một vấn đề mới không ai đoán trước: khách bưng khay bằng hai tay nên chỉ chạm được bằng khuỷu tay hoặc mu bàn tay, khiến các nút nhỏ ở góc dưới gần như không dùng được. Phát hiện đó dẫn tới thay đổi bố cục đưa các nút chính lên vùng giữa màn hình và tăng kích thước vùng chạm. Toàn bộ hai vòng tốn hai ngày và tiền in giấy, trong khi phát hiện tương tự sau khi đã lắp máy sẽ đắt hơn nhiều lần.',
    comparison: [
      {
        weak: 'Trình bày bản thiết kế cho người tham gia và hỏi họ thấy thế nào, có dễ dùng không.',
        mature:
          'Giao một nhiệm vụ có bối cảnh và quan sát họ tự làm, chỉ hỏi cảm nhận sau khi nhiệm vụ đã kết thúc.',
      },
      {
        weak: 'Chờ tới khi sản phẩm gần hoàn thiện mới thử, vì sợ bản thô làm mất hình ảnh chuyên nghiệp.',
        mature:
          'Thử sớm với bản vẽ tay hoặc bản bấm được, khi việc sửa còn tính bằng giờ chứ chưa tính bằng tuần.',
      },
      {
        weak: 'Ghi lại phát hiện dưới dạng danh sách nhận xét rời rạc rồi để đó vì không biết bắt đầu từ đâu.',
        mature:
          'Xếp hạng theo số người gặp và mức nghiêm trọng, chuyển thành các mục sửa có người phụ trách, rồi chạy vòng thử tiếp để xác nhận đã hết.',
      },
    ],
    mistakes: [
      'Mời đồng nghiệp và người quen làm người thử vì tiện, trong khi họ đã biết trước từ vựng nội bộ và logic hệ thống, nên buổi thử cho kết quả dễ dãi và bỏ sót đúng những chỗ người mới sẽ vấp.',
      'Người điều phối không kìm được và giải thích ngay khi thấy người thử loay hoay, làm mất chính dữ liệu quý nhất của buổi thử là hành vi khi bế tắc.',
      'Chỉ ghi những phát hiện ủng hộ phương án mà đội đã thích sẵn, hoặc gạt bỏ một vấn đề vì cho rằng người tham gia đó không đại diện, mà không kiểm lại bằng vòng thử khác.',
    ],
    worksheet: [
      'Ba câu hỏi cụ thể mà buổi thử sắp tới phải trả lời là gì?',
      'Độ trung thực thấp nhất còn trả lời được ba câu hỏi đó là gì: bản giấy, bản bấm được, hay bản chạy thật?',
      'Viết hai nhiệm vụ theo tình huống, không chứa tên nút hay chỉ dẫn thao tác nào.',
      'Bạn sẽ tuyển người thử ở đâu, tiêu chí sàng lọc theo hành vi là gì, và bạn cảm ơn họ bằng cách nào?',
      'Bạn sẽ ghi phát hiện theo mẫu nào, và ngưỡng nào khiến một phát hiện được xếp là chặn hoàn toàn?',
    ],
    exercises: [
      {
        label: 'Viết câu hỏi nghiên cứu',
        text: 'Với thiết kế đang làm, viết ba câu hỏi cụ thể mà bạn chưa biết câu trả lời và một buổi thử có thể giải quyết. Loại bỏ mọi câu hỏi mà bạn đã có dữ liệu hoặc chỉ nhằm xác nhận điều mình tin.',
        level: 'e',
      },
      {
        label: 'Bản giấy trong một giờ',
        text: 'Vẽ tay năm màn hình chính của một luồng trong vòng một giờ, mỗi màn hình một tờ. Không dùng công cụ thiết kế nào. Đặt chúng theo thứ tự và tự đi qua luồng một lượt để phát hiện chỗ thiếu.',
        level: 'e',
      },
      {
        label: 'Soạn kịch bản nhiệm vụ',
        text: 'Viết hai nhiệm vụ có bối cảnh rõ, kèm câu mở đầu chuẩn và ba câu hỏi trung tính dùng khi người thử khựng lại. Nhờ đồng nghiệp đọc và chỉ ra mọi chỗ bạn vô tình gợi ý thao tác.',
        level: 'm',
      },
      {
        label: 'Tuyển năm người đúng đối tượng',
        text: 'Tuyển năm người thoả tiêu chí hành vi, không phải người trong công ty. Ghi lại kênh tuyển, tỉ lệ nhận lời và cách cảm ơn. Sắp lịch mỗi buổi 30 phút cách nhau đủ để ghi chép.',
        level: 'm',
      },
      {
        label: 'Điều phối và ghi chép',
        text: 'Chạy ba buổi thử với vai trò điều phối, có một người ghi chép riêng. Sau mỗi buổi, hai người viết độc lập ba phát hiện chính rồi so sánh để thấy mức lệch trong cách diễn giải.',
        level: 'm',
      },
      {
        label: 'Bảng xếp hạng phát hiện',
        text: 'Tổng hợp tất cả phát hiện thành bảng gồm mô tả, số người gặp, mức nghiêm trọng, đề xuất sửa và người phụ trách. Xếp thứ tự và trình bày trong 15 phút cho đội thi công.',
        level: 'h',
      },
      {
        label: 'Hai vòng liên tiếp',
        text: 'Sửa các phát hiện mức chặn ngay trong ngày và chạy vòng thử thứ hai với năm người mới. So sánh số phát hiện mức chặn giữa hai vòng và ghi lại vấn đề mới xuất hiện mà vòng đầu chưa lộ ra.',
        level: 'h',
      },
      {
        label: 'Thử trong hoàn cảnh thật',
        text: 'Đưa bản thử ra đúng bối cảnh sử dụng: ngoài trời, chỗ ồn, lúc đông người, hoặc khi người dùng đang bận tay. Ghi lại những khó khăn chỉ xuất hiện trong hoàn cảnh đó và so với danh sách phát hiện trong phòng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao thử với năm người mỗi vòng và lặp nhiều vòng thường tốt hơn thử một lần với hai mươi người?',
        a: 'Vì các vấn đề nghiêm trọng nhất lặp lại rất nhanh giữa những người đầu tiên, nên người thứ sáu trở đi chủ yếu xác nhận điều đã biết. Chia thành nhiều vòng cho phép sửa giữa các vòng, nhờ đó vòng sau phát hiện được lớp vấn đề mới bị lớp cũ che khuất. Đây là hướng dẫn thực hành của Nielsen Norman Group, không phải một định luật cứng.',
      },
      {
        q: 'Người thử làm được nhiệm vụ nhưng mất rất lâu và trông bối rối. Ghi nhận thế nào?',
        a: 'Đây là phát hiện mức gây chậm, vẫn phải ghi kèm thời gian và mô tả chỗ họ do dự. Nếu chỉ ghi thành công hay thất bại, bạn sẽ bỏ sót phần lớn vấn đề trải nghiệm; ở quy mô lớn, sự do dự đó biến thành tỉ lệ bỏ dở và cuộc gọi hỗ trợ.',
      },
      {
        q: 'Đội nói không có thời gian và ngân sách cho kiểm thử người dùng. Phương án tối thiểu là gì?',
        a: 'Một bản giấy, ba người đúng đối tượng, mỗi người 20 phút, tổng cộng một buổi chiều. Chi phí gần như bằng không so với chi phí thi công sai. Nếu vẫn không được, hãy ít nhất quan sát ba người dùng hiện tại thao tác trên bản đang chạy và ghi lại chỗ họ vấp.',
      },
    ],
    plan7:
      'Ngày 1: viết ba câu hỏi nghiên cứu và chọn độ trung thực. Ngày 2: dựng bản thử ở mức thấp nhất còn dùng được. Ngày 3: soạn kịch bản nhiệm vụ và nhờ đồng nghiệp soi chỗ gợi ý. Ngày 4: tuyển và xếp lịch năm người đúng đối tượng. Ngày 5: chạy ba buổi thử, có người ghi chép riêng. Ngày 6: tổng hợp và xếp hạng phát hiện, sửa nhóm chặn. Ngày 7: chạy vòng thử thứ hai với người mới và viết báo cáo hai trang.',
    evidence:
      'Hãy giữ một hồ sơ kiểm thử gọn gồm: câu hỏi nghiên cứu, kịch bản nhiệm vụ, bảng phát hiện có số người gặp và mức nghiêm trọng, ảnh bản thử trước và sau, cùng kết quả vòng hai. Nếu được phép, một đoạn ghi hình ngắn có che mặt và ẩn danh sẽ rất thuyết phục. Trong phỏng vấn, câu chuyện đáng kể nhất thường là một phát hiện hoàn toàn bất ngờ đã làm đổi thiết kế — hãy chuẩn bị kể rõ nó xuất hiện ở người thứ mấy, bạn xác nhận lại thế nào, và đội đã sửa gì.',
    references: [
      { label: 'Nielsen Norman Group — vì sao chỉ cần thử với 5 người dùng', url: 'https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/', type: 'article' },
      { label: 'Interaction Design Foundation — tài liệu học về tạo mẫu và kiểm thử', url: 'https://www.interaction-design.org/literature', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 11 · Đo lường sản phẩm ─────────────────────────────────────────
  guide({
    thesis:
      'Đo lường sản phẩm là việc chọn ít chỉ số nhưng chọn đúng, định nghĩa chúng chặt tới mức hai người tính độc lập ra cùng con số, và luôn đặt cạnh chúng những chỉ số bảo vệ để biết mình có đang tăng cái này bằng cách phá cái kia hay không. Một hệ đo lường tốt phải trả lời được ba câu: hôm nay sản phẩm khoẻ hay yếu, nếu yếu thì yếu ở khâu nào của hành trình, và thay đổi vừa rồi có phải nguyên nhân hay chỉ là trùng hợp. Bảng điều khiển nhiều biểu đồ mà không ai hành động theo là chi phí, không phải tài sản.',
    why: {
      work:
        'Khi có chỉ số bắc cầu rõ ràng, các cuộc họp chuyển từ tranh luận cảm tính sang bàn về nguyên nhân; và khi phải cắt việc, bạn có căn cứ chỉ ra khâu nào đang rò rỉ nhiều nhất.',
      interview:
        'Câu hỏi “bạn đo thành công của tính năng đó bằng gì” xuất hiện ở hầu hết vòng phỏng vấn sản phẩm. Người nêu được chỉ số chính, chỉ số bảo vệ và cách loại nhiễu sẽ vượt xa người chỉ nói tới lượt truy cập.',
      study:
        'Kỹ năng định nghĩa chỉ số và đọc số theo nhóm rất hữu ích cho bài nghiên cứu và đồ án phân tích dữ liệu, nơi phần lớn lỗi đến từ định nghĩa mơ hồ chứ không từ công cụ.',
      life:
        'Cùng nguyên tắc dùng cho mục tiêu cá nhân: chọn một chỉ số hành vi thay vì nhiều chỉ số cảm tính, và luôn kèm một chỉ số bảo vệ như giấc ngủ hoặc sức khoẻ để không tối ưu một thứ bằng cách hy sinh thứ khác.',
    },
    framework: [
      {
        name: 'Chọn một chỉ số dẫn đường',
        detail:
          'Chọn một chỉ số phản ánh giá trị người dùng nhận được và có liên hệ với doanh thu dài hạn, ví dụ số buổi nghe trọn vẹn mỗi tuần thay vì lượt cài đặt. Chỉ số này không nhằm để khoe mà để cả công ty biết mình đang kéo cùng một hướng.',
      },
      {
        name: 'Dựng cây chỉ số',
        detail:
          'Phân rã chỉ số dẫn đường thành các nhánh có thể tác động: số người vào, tỉ lệ vượt qua từng bước, tần suất quay lại, độ dài mỗi phiên. Cây này biến một con số tổng thành bản đồ nơi từng đội biết mình chịu trách nhiệm nhánh nào.',
      },
      {
        name: 'Định nghĩa chặt và kiểm dữ liệu',
        detail:
          'Mỗi chỉ số cần một tài liệu định nghĩa: sự kiện nào tính, ai bị loại, múi giờ nào, xử lý trùng lặp ra sao. Trước khi tin bất kỳ biểu đồ nào, hãy đếm tay một mẫu nhỏ và so với hệ thống; sai lệch về ghi nhận sự kiện phổ biến hơn nhiều người tưởng.',
      },
      {
        name: 'Luôn kèm chỉ số bảo vệ',
        detail:
          'Với mỗi chỉ số chính, chọn hai chỉ số không được xấu đi: tỉ lệ huỷ đăng ký, số lượt báo lỗi, thời gian phản hồi hệ thống, tỉ lệ hoàn tiền. Không có chúng thì mọi mục tiêu đều đạt được bằng cách gây hại ở chỗ khác mà báo cáo không nhìn thấy.',
      },
      {
        name: 'Tách tương quan khỏi nhân quả',
        detail:
          'Khi có thể, dùng thử nghiệm A/B với nhóm chia ngẫu nhiên, chốt trước thời lượng và không kết luận giữa chừng. Khi không thể, hãy so với nhóm đối chứng gần nhất, xét mùa vụ, và ghi rõ trong báo cáo rằng đây là quan sát chứ không phải bằng chứng nhân quả.',
      },
    ],
    scenario:
      'Một ứng dụng nghe sách nói báo cáo tăng trưởng bằng số lượt tải và số tài khoản đăng ký, cả hai đều đẹp. Nhưng doanh thu gói thuê bao đứng yên. Đội đổi chỉ số dẫn đường sang số người có ít nhất ba buổi nghe từ mười lăm phút trở lên trong một tuần, vì phỏng vấn cho thấy người gia hạn gói gần như luôn có thói quen nghe lúc đi làm. Cây chỉ số được dựng ra và lộ rõ chỗ rò: trong số người mở ứng dụng lần đầu, phần lớn dừng ngay ở bước chọn sách vì màn hình đầu tiên có quá nhiều danh mục và không có gợi ý theo thời lượng. Đội thử một thay đổi: đưa ra ba gợi ý theo độ dài quãng đường di chuyển ngay ở lần mở đầu tiên. Thử nghiệm chia ngẫu nhiên chạy đủ hai tuần đã định, với hai chỉ số bảo vệ là tỉ lệ gỡ ứng dụng trong bảy ngày và số lượt báo lỗi phát âm thanh. Chỉ số chính tăng, chỉ số bảo vệ không xấu đi, nên thay đổi được giữ. Một tháng sau, đội phát hiện một bài học khác: có tuần số liệu tăng vọt trùng với đợt nghỉ lễ, và nếu không xét mùa vụ thì họ đã kết luận nhầm về hiệu quả của một thay đổi khác được phát hành đúng tuần đó.',
    comparison: [
      {
        weak: 'Theo dõi hàng chục chỉ số trên một bảng điều khiển mà không ai quy định chỉ số nào dẫn tới hành động gì.',
        mature:
          'Giữ một chỉ số dẫn đường, một cây phân rã và hai chỉ số bảo vệ; mỗi chỉ số có người sở hữu và ngưỡng kích hoạt hành động.',
      },
      {
        weak: 'Đọc biểu đồ tổng theo ngày rồi kết luận về hiệu quả của thay đổi vừa phát hành hôm qua.',
        mature:
          'So sánh theo nhóm người vào cùng thời điểm hoặc theo nhóm thử nghiệm, đủ thời lượng đã định trước, có xét mùa vụ và các chiến dịch chạy song song.',
      },
      {
        weak: 'Tin vào con số hệ thống trả về mà chưa bao giờ đếm tay để đối chiếu.',
        mature:
          'Kiểm mẫu nhỏ bằng tay khi mới dựng chỉ số và mỗi khi có thay đổi lớn về cách ghi nhận sự kiện, rồi ghi kết quả kiểm vào tài liệu định nghĩa.',
      },
    ],
    mistakes: [
      'Chọn chỉ số dễ tăng thay vì chỉ số phản ánh giá trị, ví dụ đếm lượt bấm thông báo đẩy; đội sẽ tối ưu đúng thứ được đo và sản phẩm dần trở nên phiền phức trong khi báo cáo vẫn xanh.',
      'Nhìn kết quả thử nghiệm mỗi ngày rồi dừng ngay khi thấy chênh lệch có lợi, khiến kết luận chủ yếu phản ánh dao động ngẫu nhiên chứ không phải tác động thật.',
      'Đổi định nghĩa chỉ số giữa kỳ mà không ghi lại, nên các so sánh theo thời gian mất ý nghĩa và nửa năm sau không ai giải thích được vì sao đường biểu đồ có một bậc nhảy.',
    ],
    worksheet: [
      'Chỉ số dẫn đường của sản phẩm bạn là gì, và vì sao nó phản ánh giá trị người dùng nhận được chứ không chỉ mức độ bận rộn?',
      'Vẽ cây phân rã chỉ số đó thành bốn nhánh. Nhánh nào hiện yếu nhất và bạn biết điều đó nhờ số liệu nào?',
      'Tài liệu định nghĩa cho chỉ số chính của bạn đã ghi rõ sự kiện nào tính, ai bị loại, múi giờ và cách xử lý trùng lặp chưa?',
      'Hai chỉ số bảo vệ của bạn là gì, và ngưỡng nào thì bạn dừng hoặc quay lui một thay đổi?',
      'Thay đổi gần nhất bạn kết luận là có hiệu quả — bạn đã loại trừ mùa vụ, chiến dịch song song và thay đổi cách ghi nhận dữ liệu chưa?',
    ],
    exercises: [
      {
        label: 'Viết tài liệu định nghĩa chỉ số',
        text: 'Chọn chỉ số quan trọng nhất và viết tài liệu định nghĩa một trang: sự kiện tính, điều kiện loại trừ, múi giờ, cách xử lý trùng lặp, chủ sở hữu. Nhờ một người khác tính lại theo tài liệu và so kết quả.',
        level: 'e',
      },
      {
        label: 'Đếm tay đối chiếu',
        text: 'Lấy mẫu ba mươi người dùng và đếm tay hành vi của họ từ dữ liệu thô, rồi so với con số hệ thống báo. Ghi lại độ lệch và nguyên nhân tìm được.',
        level: 'e',
      },
      {
        label: 'Dựng cây chỉ số',
        text: 'Phân rã chỉ số dẫn đường thành hai tầng nhánh và gắn số liệu hiện tại cho từng nhánh. Đánh dấu nhánh có mức rơi lớn nhất và ước lượng giá trị nếu cải thiện nhánh đó 10 phần trăm.',
        level: 'm',
      },
      {
        label: 'Chọn chỉ số bảo vệ',
        text: 'Với mục tiêu quý này, liệt kê năm cách có thể đạt số bằng con đường gây hại. Chuyển ba cách nguy hiểm nhất thành ba chỉ số bảo vệ đo được và định ngưỡng cảnh báo.',
        level: 'm',
      },
      {
        label: 'Thiết kế một thử nghiệm',
        text: 'Viết kế hoạch thử nghiệm cho một thay đổi: giả thuyết, cách chia nhóm, chỉ số chính, chỉ số bảo vệ, thời lượng cố định, và cam kết không kết luận trước hạn. Ghi trước hành động ứng với mỗi kết quả.',
        level: 'm',
      },
      {
        label: 'Dọn bảng điều khiển',
        text: 'Rà bảng điều khiển hiện có, đánh dấu biểu đồ nào chưa từng dẫn tới một quyết định nào trong ba tháng qua. Đề xuất bỏ chúng và viết lại bảng chỉ còn chỉ số dẫn đường, cây một tầng và chỉ số bảo vệ.',
        level: 'h',
      },
      {
        label: 'Báo cáo có xét nhiễu',
        text: 'Viết báo cáo về một thay đổi đã phát hành, trong đó có mục riêng liệt kê các yếu tố gây nhiễu đã xét: mùa vụ, chiến dịch, thay đổi cách ghi nhận, sự cố hệ thống. Kết luận rõ đây là bằng chứng mạnh hay chỉ là quan sát.',
        level: 'h',
      },
      {
        label: 'Rà soát độ tin cậy của số liệu hằng tháng',
        text: 'Lập một quy trình kiểm hằng tháng: đối chiếu số liệu chính với một nguồn độc lập, kiểm sự kiện bị mất, kiểm bản ứng dụng cũ không gửi dữ liệu. Chạy một vòng và ghi lại các vấn đề phát hiện được.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao lượt tải hoặc lượt đăng ký không nên làm chỉ số dẫn đường?',
        a: 'Vì chúng chỉ đo lượng người bước vào, không đo giá trị nhận được, và có thể mua bằng tiền quảng cáo. Chỉ số dẫn đường nên là hành vi cho thấy người dùng đã nhận được thứ họ tới tìm, vì đó mới là thứ dự báo được việc họ ở lại và trả tiền.',
      },
      {
        q: 'Chỉ số chính tăng 8 phần trăm sau khi phát hành. Cần kiểm gì trước khi kết luận thành công?',
        a: 'Kiểm bốn thứ: có chiến dịch hay sự kiện mùa vụ nào trùng thời điểm không; cách ghi nhận dữ liệu có thay đổi không; hai chỉ số bảo vệ có xấu đi không; và mức tăng có lớn hơn dao động thường thấy giữa các tuần trước đó không. Nếu không có nhóm đối chứng, phải ghi rõ đây là quan sát chứ chưa phải bằng chứng nhân quả.',
      },
      {
        q: 'Sản phẩm của bạn có quá ít người dùng để chạy thử nghiệm A/B. Đo lường thế nào cho có ích?',
        a: 'Chuyển trọng tâm sang dữ liệu định tính và các phép đo thô nhưng chắc: quan sát trực tiếp, phỏng vấn, đếm tay tỉ lệ hoàn thành theo từng khâu, so trước và sau với ghi chú đầy đủ về bối cảnh. Ở quy mô nhỏ, năm cuộc trò chuyện thường cho hướng đi tốt hơn một phép kiểm thống kê không đủ mẫu.',
      },
    ],
    plan7:
      'Ngày 1: chọn chỉ số dẫn đường và viết lý do trong nửa trang. Ngày 2: viết tài liệu định nghĩa chỉ số đó. Ngày 3: đếm tay mẫu ba mươi người để đối chiếu. Ngày 4: dựng cây chỉ số hai tầng với số liệu hiện tại. Ngày 5: chọn hai chỉ số bảo vệ và định ngưỡng. Ngày 6: dọn bảng điều khiển, bỏ biểu đồ không dẫn tới hành động. Ngày 7: viết kế hoạch cho một thử nghiệm sắp tới, chốt thời lượng và cam kết không kết luận sớm.',
    evidence:
      'Hãy giữ lại tài liệu định nghĩa chỉ số do bạn viết, cây chỉ số có số liệu thật, và một báo cáo thử nghiệm đầy đủ gồm giả thuyết, thiết kế, kết quả và phần bàn về yếu tố gây nhiễu. Rất có giá trị là câu chuyện về một lần bạn phát hiện dữ liệu sai và sửa cách ghi nhận, vì nó chứng minh bạn không tin biểu đồ một cách mù quáng. Trong phỏng vấn, hãy chuẩn bị kể về một thử nghiệm cho kết quả âm và bạn đã đề nghị quay lui thay đổi dù đội đã tốn công làm.',
    references: [
      { label: 'Amplitude — blog và hướng dẫn về phân tích sản phẩm', url: 'https://amplitude.com/blog', type: 'article', needsReview: true },
      { label: 'Mind the Product — bài viết về chỉ số và phân tích sản phẩm', url: 'https://www.mindtheproduct.com/', type: 'article' },
    ],
  }),

  // ── Chương 12 · Phân tích phản hồi ────────────────────────────────────────
  guide({
    thesis:
      'Phản hồi của người dùng là nguyên liệu thô, không phải kết luận. Việc của bạn là biến hàng trăm câu than phiền rời rạc thành một bảng có cấu trúc: mỗi phản hồi được gắn nhãn theo vấn đề gốc chứ không theo giải pháp người ta đề nghị, được đếm theo tần suất, được chấm theo mức đau, và được nối với dữ liệu hành vi để biết nó ảnh hưởng bao nhiêu người thật. Sau đó phải đóng vòng: báo lại cho người đã góp ý biết điều gì đã thay đổi, vì đó là thứ quyết định họ có tiếp tục nói với bạn nữa hay không.',
    why: {
      work:
        'Bộ phận hỗ trợ khách hàng nắm nhiều tín hiệu sớm nhất về sản phẩm nhưng thường không có kênh chuyển hoá thành việc sửa; kỹ năng này là chiếc cầu giữa hai bên và nó tiết kiệm rất nhiều tiền.',
      interview:
        'Câu hỏi “bạn xử lý phản hồi trái chiều thế nào” rất phổ biến. Người mô tả được hệ phân loại, cách đếm và cách nối với dữ liệu hành vi sẽ nổi bật hơn người trả lời rằng mình lắng nghe khách hàng.',
      study:
        'Trong nghiên cứu định tính ở trường, chính kỹ năng mã hoá dữ liệu này quyết định chất lượng chương phân tích: mã hoá theo vấn đề gốc và kiểm chéo giữa hai người là chuẩn thực hành cơ bản.',
      life:
        'Ai bán hàng hay làm dịch vụ đều nhận phản hồi mỗi ngày; ghi lại có cấu trúc trong ba tháng sẽ cho bạn thấy mẫu hình mà cảm giác hằng ngày không bao giờ nhìn ra.',
    },
    framework: [
      {
        name: 'Gom mọi nguồn về một chỗ',
        detail:
          'Phiếu hỗ trợ, đánh giá trên cửa hàng ứng dụng, tin nhắn mạng xã hội, ghi chú của nhân viên bán hàng, khảo sát khi rời bỏ. Mỗi mục lưu kèm nguồn, ngày, hồ sơ người dùng và nguyên văn. Thiếu nguyên văn thì mọi phân tích về sau đều là diễn giải chồng diễn giải.',
      },
      {
        name: 'Gắn nhãn theo vấn đề gốc',
        detail:
          'Người dùng thường phát biểu bằng giải pháp: hãy thêm nút này, hãy làm như ứng dụng kia. Nhiệm vụ của bạn là hỏi hoặc suy ra vấn đề phía sau và gắn nhãn theo đó, đồng thời giữ nguyên văn để kiểm lại. Bộ nhãn nên nhỏ, có định nghĩa và được thống nhất trước.',
      },
      {
        name: 'Đếm tần suất và chấm mức đau',
        detail:
          'Tần suất cho biết bao nhiêu người nói, mức đau cho biết chuyện gì xảy ra với họ: mất tiền, mất dữ liệu, phải làm lại, hay chỉ khó chịu. Một vấn đề ít người nói nhưng gây mất dữ liệu vẫn phải đứng trên một vấn đề nhiều người phàn nàn nhưng chỉ gây bất tiện nhẹ.',
      },
      {
        name: 'Nối với dữ liệu hành vi',
        detail:
          'Với mỗi nhãn lớn, đi tìm dấu vết trong dữ liệu: bao nhiêu người gặp lỗi đó, tỉ lệ bỏ dở ở bước liên quan, tỉ lệ rời bỏ của nhóm đã than phiền. Bước này biến câu chuyện thành quy mô và ngăn việc cả đội chạy theo vài giọng nói to.',
      },
      {
        name: 'Đóng vòng với người góp ý',
        detail:
          'Khi một vấn đề được sửa, báo lại cho những người đã nêu, kể cả khi phải nói rằng lần này chưa làm và vì sao. Việc đóng vòng vừa giữ được nguồn tín hiệu vừa biến người từng bực bội thành người ủng hộ; bỏ qua nó thì lần sau họ im lặng rồi rời đi.',
      },
    ],
    scenario:
      'Một công ty bán thiết bị định vị lắp trên xe máy kèm ứng dụng theo dõi nhận khoảng chín trăm phản hồi mỗi quý từ ba nguồn: tổng đài, đánh giá trên cửa hàng ứng dụng và các cửa hàng lắp đặt. Trước đây mỗi bộ phận tự đọc và tự kết luận, nên phòng kỹ thuật tin rằng vấn đề lớn nhất là pin, còn tổng đài tin rằng đó là ứng dụng chậm. Đội sản phẩm gom tất cả về một bảng, thống nhất mười hai nhãn có định nghĩa, và hai người mã hoá độc lập hai trăm mục đầu để kiểm mức đồng thuận trước khi mã hoá phần còn lại. Kết quả khác cả hai giả định: nhãn lớn nhất là “vị trí hiển thị sai lệch khi xe dừng trong hầm hoặc dưới tán cây”, và điều đáng chú ý là mức đau rất cao vì vài trường hợp chủ xe đã báo mất trộm nhầm. Nối với dữ liệu hành vi cho thấy nhóm người gặp hiện tượng này có tỉ lệ ngừng gia hạn dịch vụ cao hơn hẳn. Hướng xử lý cuối cùng không phải đổi phần cứng mà là đổi cách hiển thị: khi độ tin cậy tín hiệu thấp, ứng dụng hiện vùng ước lượng kèm dòng giải thích thay vì một điểm chính xác giả tạo. Sau khi phát hành, đội gửi tin nhắn tới hơn hai trăm người từng phản ánh đúng vấn đề đó, và một phần trong số họ sửa lại đánh giá cũ.',
    comparison: [
      {
        weak: 'Mỗi bộ phận tự đọc phản hồi của kênh mình và tự rút ra kết luận, nên các cuộc họp trở thành cuộc thi kể giai thoại.',
        mature:
          'Gom mọi nguồn vào một bảng chung với bộ nhãn thống nhất, để mọi tranh luận đều quy về cùng một tập dữ liệu đếm được.',
      },
      {
        weak: 'Xếp thứ tự xử lý theo số lượt nhắc tới, nên vấn đề gây hại nặng cho một nhóm nhỏ bị bỏ lại phía sau mãi.',
        mature:
          'Xếp theo tích của tần suất và mức đau, có xét thêm quy mô ảnh hưởng tìm được trong dữ liệu hành vi.',
      },
      {
        weak: 'Sửa xong thì đóng phiếu, không ai quay lại báo cho người đã góp ý.',
        mature:
          'Duy trì danh sách người đã nêu từng vấn đề và gửi thông báo khi có thay đổi, kể cả thông báo rằng lần này chưa làm kèm lý do.',
      },
    ],
    mistakes: [
      'Gắn nhãn theo giải pháp người dùng đề nghị thay vì theo vấn đề gốc, khiến bảng thống kê đầy những mục như thêm nút tải về mà không ai biết họ đang cần làm gì với dữ liệu đó.',
      'Chỉ đọc phản hồi của những người còn ở lại và bỏ qua người đã rời bỏ, nên bức tranh luôn lạc quan hơn thực tế và những vấn đề khiến người ta bỏ đi không bao giờ lộ ra.',
      'Để một khách hàng lớn hoặc một bài đăng lan truyền định hình toàn bộ thứ tự công việc trong quý, mà không kiểm xem vấn đề đó ảnh hưởng bao nhiêu phần trăm người dùng thật.',
    ],
    worksheet: [
      'Bạn đang nhận phản hồi từ những nguồn nào, và nguồn nào hiện chưa được gom về bảng chung?',
      'Bộ nhãn của bạn gồm bao nhiêu mục, mỗi mục đã có định nghĩa một câu chưa, và ai là người mã hoá?',
      'Ba nhãn có tần suất cao nhất là gì, và ba nhãn có mức đau cao nhất là gì? Chúng có trùng nhau không?',
      'Với nhãn đứng đầu, dữ liệu hành vi cho thấy bao nhiêu người thật sự gặp phải, và họ rời bỏ nhiều hơn mức chung bao nhiêu?',
      'Bạn đóng vòng với người góp ý bằng cách nào, và lần gần nhất bạn làm việc đó là khi nào?',
    ],
    exercises: [
      {
        label: 'Gom nguồn và chuẩn hoá',
        text: 'Xuất phản hồi từ ba nguồn khác nhau về một bảng chung với các cột nguồn, ngày, nguyên văn, hồ sơ người dùng. Ghi lại nguồn nào thiếu trường nào và cần sửa quy trình thu thập ở đâu.',
        level: 'e',
      },
      {
        label: 'Soạn bộ nhãn',
        text: 'Đọc năm mươi phản hồi và soạn bộ nhãn tối đa mười lăm mục, mỗi mục kèm định nghĩa một câu và một ví dụ. Kiểm bằng cách gắn nhãn hai mươi mục mới xem có phải thêm nhãn mới không.',
        level: 'e',
      },
      {
        label: 'Mã hoá kiểm chéo',
        text: 'Cùng một đồng nghiệp mã hoá độc lập một trăm phản hồi. Tính tỉ lệ trùng khớp, thảo luận các mục lệch nhau và sửa lại định nghĩa nhãn cho tới khi mức trùng khớp chấp nhận được.',
        level: 'm',
      },
      {
        label: 'Bảng tần suất nhân mức đau',
        text: 'Chấm mức đau cho từng nhãn theo thang bốn mức có định nghĩa: mất tiền hoặc dữ liệu, phải làm lại, gây chậm, gây khó chịu. Lập bảng xếp hạng theo tích của tần suất và mức đau.',
        level: 'm',
      },
      {
        label: 'Nối với dữ liệu hành vi',
        text: 'Chọn ba nhãn hàng đầu và tìm dấu vết tương ứng trong dữ liệu: số người gặp lỗi, tỉ lệ bỏ dở ở bước liên quan, tỉ lệ rời bỏ. Ghi rõ nhãn nào không tìm được dấu vết và vì sao.',
        level: 'm',
      },
      {
        label: 'Phỏng vấn người rời bỏ',
        text: 'Liên hệ mười người đã ngừng dùng và hỏi về sự việc cụ thể dẫn tới quyết định đó. Mã hoá câu trả lời bằng cùng bộ nhãn và so bảng xếp hạng của nhóm rời bỏ với nhóm còn ở lại.',
        level: 'h',
      },
      {
        label: 'Nhịp phản hồi hằng tháng',
        text: 'Thiết lập quy trình định kỳ: ai gom, ai mã hoá, họp 30 phút mỗi tháng, đầu ra là ba mục đưa vào hàng đợi có người phụ trách. Chạy hai vòng và ghi lại chỗ quy trình bị nghẽn.',
        level: 'h',
      },
      {
        label: 'Chiến dịch đóng vòng',
        text: 'Với một vấn đề vừa sửa, dựng danh sách người đã từng nêu và gửi thông báo cá nhân hoá. Đo tỉ lệ mở, số người phản hồi lại và số đánh giá được sửa; viết một trang rút kinh nghiệm cho lần sau.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao phải gắn nhãn theo vấn đề gốc thay vì theo giải pháp người dùng đề nghị?',
        a: 'Vì cùng một vấn đề sinh ra rất nhiều đề nghị khác nhau, nên gắn theo giải pháp sẽ chia nhỏ tín hiệu và làm vấn đề lớn trông như nhiều vấn đề vụn vặt. Gắn theo vấn đề gốc còn giữ cho đội quyền tìm cách giải rẻ hơn và đúng hơn cái được đề nghị.',
      },
      {
        q: 'Một vấn đề chỉ có bảy phản hồi trong quý. Khi nào nó vẫn xứng đáng được ưu tiên cao?',
        a: 'Khi mức đau rất cao — gây mất tiền, mất dữ liệu, gây rủi ro an toàn hoặc pháp lý — hoặc khi dữ liệu hành vi cho thấy số người thật sự gặp lớn hơn nhiều so với số người chịu khó nói ra. Số lượt phản hồi luôn là phần nổi rất nhỏ, nên nó không được dùng làm thước đo duy nhất.',
      },
      {
        q: 'Đóng vòng với người góp ý mang lại lợi ích gì ngoài phép lịch sự?',
        a: 'Nó giữ cho nguồn tín hiệu tiếp tục chảy: người thấy góp ý của mình dẫn tới thay đổi sẽ báo tiếp lần sau, còn người bị im lặng thì thôi nói và thường rời đi lặng lẽ. Ngoài ra đây là dịp rẻ nhất để thu hồi các đánh giá tiêu cực cũ và biến người từng bực bội thành người giới thiệu sản phẩm.',
      },
    ],
    plan7:
      'Ngày 1: gom phản hồi từ mọi nguồn về một bảng chung. Ngày 2: đọc năm mươi mục và soạn bộ nhãn có định nghĩa. Ngày 3: mã hoá kiểm chéo một trăm mục cùng đồng nghiệp và chỉnh định nghĩa. Ngày 4: mã hoá phần còn lại và lập bảng tần suất. Ngày 5: chấm mức đau và xếp hạng theo tích. Ngày 6: nối ba nhãn hàng đầu với dữ liệu hành vi. Ngày 7: chốt ba mục đưa vào hàng đợi và soạn kế hoạch đóng vòng cho vấn đề vừa sửa gần nhất.',
    evidence:
      'Bằng chứng cụ thể cho kỹ năng này là bộ nhãn có định nghĩa do bạn soạn, kết quả kiểm chéo giữa hai người mã hoá, bảng xếp hạng theo tần suất nhân mức đau, và một trang cho thấy nhãn nào đã trở thành việc sửa nào cùng kết quả sau đó. Rất mạnh nếu bạn kèm được ví dụ một chiến dịch đóng vòng với số liệu phản hồi. Trong phỏng vấn, hãy kể một lần dữ liệu phản hồi bác bỏ giả định của chính ban lãnh đạo hoặc của phòng kỹ thuật, và bạn đã trình bày điều đó thế nào để mọi người chấp nhận.',
    references: [
      { label: 'Nielsen Norman Group — trang chính thức về nghiên cứu người dùng', url: 'https://www.nngroup.com/', type: 'article' },
      { label: 'Intercom — blog về hỗ trợ khách hàng và tín hiệu từ người dùng', url: 'https://www.intercom.com/blog/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 13 · Lộ trình sản phẩm — Product Roadmap ───────────────────────
  guide({
    thesis:
      'Lộ trình sản phẩm là công cụ giao tiếp về ý định và mức độ chắc chắn, không phải bản cam kết ngày giao cho mọi thứ trong mười hai tháng tới. Một lộ trình dùng được sắp xếp theo bài toán cần giải và kết quả mong muốn, chia theo mức độ tin cậy giảm dần — phần gần thì cụ thể và có ngày, phần xa thì chỉ có chủ đề và câu hỏi cần trả lời — đồng thời nói rõ những gì sẽ không làm trong kỳ này. Lộ trình liệt kê hai mươi tính năng kèm ngày chính xác cho cả năm chỉ tạo ra một trong hai kết quả: hoặc nó sai, hoặc đội đã chọn không học gì mới trong suốt năm đó.',
    why: {
      work:
        'Lộ trình là chỗ để dàn xếp kỳ vọng giữa kinh doanh, kỹ thuật và khách hàng trước khi mâu thuẫn nổ ra ở phút chót; nó cũng là công cụ để nói không một cách có căn cứ.',
      interview:
        'Ứng viên quản lý sản phẩm thường được hỏi cách xây lộ trình và cách xử lý khi khách hàng lớn đòi cam kết ngày. Câu trả lời tốt phân biệt rõ cam kết, dự định và ý tưởng đang xem xét.',
      study:
        'Với đồ án nhiều tháng, việc chia lộ trình theo mức độ chắc chắn giúp bạn trình bày tiến độ trung thực với giảng viên và tránh phải hứa những mốc mà bạn chưa đủ thông tin để hứa.',
      life:
        'Kế hoạch cá nhân dài hạn cũng nên viết theo cách này: phần ba tháng tới chi tiết, phần một năm tới chỉ là chủ đề, và ghi rõ những việc bạn chủ động không làm trong giai đoạn này.',
    },
    framework: [
      {
        name: 'Neo vào một tới ba kết quả của kỳ',
        detail:
          'Trước khi có bất kỳ dòng nào, chốt kết quả cần đạt trong kỳ, có chỉ số và mức đích. Mọi mục trên lộ trình phải nối được vào một kết quả; mục nào không nối được thì hoặc là việc bắt buộc phải ghi riêng, hoặc là thứ nên bỏ.',
      },
      {
        name: 'Sắp theo ba tầng chắc chắn',
        detail:
          'Tầng đang làm: có phạm vi, người phụ trách, khoảng thời gian. Tầng kế tiếp: đã biết bài toán, chưa chốt giải pháp, chỉ nêu quý. Tầng đang xem xét: mới là chủ đề và câu hỏi cần trả lời. Cách gọi tên này gần với mô hình now, next, later được nhiều đội sản phẩm sử dụng.',
      },
      {
        name: 'Viết bằng bài toán, không bằng tên tính năng',
        detail:
          'Ghi “giảm thời gian điểm danh buổi sáng cho giáo viên” thay vì “làm màn hình điểm danh mới”. Cách viết này giữ được không gian giải pháp và giúp lộ trình vẫn đúng khi cách làm thay đổi.',
      },
      {
        name: 'Ghi rõ phần sẽ không làm và các phụ thuộc',
        detail:
          'Thêm một khối cố định liệt kê những chủ đề bị hoãn kèm lý do, và một khối phụ thuộc vào đội khác hoặc bên thứ ba. Hai khối này là thứ khiến lộ trình có thể dùng để thương lượng chứ không chỉ để trình chiếu.',
      },
      {
        name: 'Cập nhật theo nhịp và có phiên bản',
        detail:
          'Đặt nhịp xem lại cố định, mỗi tháng hoặc mỗi kỳ, và lưu phiên bản có ngày. Khi một mục bị đẩy lùi, ghi lý do vào nhật ký thay vì lặng lẽ sửa; lịch sử thay đổi là thứ xây dựng niềm tin với các bên liên quan.',
      },
    ],
    scenario:
      'Một công ty làm phần mềm quản lý trường mầm non phục vụ khoảng bốn mươi trường tư có lộ trình cũ là bảng gồm hai mươi ba tính năng kèm tháng dự kiến. Sau hai kỳ trượt liên tiếp, bộ phận kinh doanh mất niềm tin vào bảng đó còn đội kỹ thuật thì mệt vì phải giải thích mãi. Người phụ trách sản phẩm viết lại theo kết quả: kỳ này chỉ có hai kết quả, giảm thời gian giáo viên làm sổ sách mỗi ngày, và giảm tỉ lệ phụ huynh gọi hỏi thông tin đã có trên ứng dụng. Tầng đang làm có ba mục cụ thể, gồm việc điểm danh bằng một thao tác và bản tin ảnh cuối ngày gửi tự động. Tầng kế tiếp ghi bài toán chưa chốt giải pháp, ví dụ việc thu học phí theo kỳ nhiều mức miễn giảm. Tầng đang xem xét chỉ ghi chủ đề và câu hỏi, như tích hợp với phần mềm kế toán của trường: câu hỏi cần trả lời là bao nhiêu trường đang dùng phần mềm nào. Khối sẽ không làm ghi rõ: không phát triển ứng dụng riêng cho hiệu trưởng trong kỳ này. Khi một chuỗi ba trường lớn đòi cam kết ngày cho tính năng học phí, câu trả lời không phải là gật đầu hay từ chối, mà là đề nghị một buổi làm rõ bài toán và một phép thử nhỏ trong sáu tuần với chính họ, đổi lại công ty cam kết ngày cho phần đã chốt phạm vi. Lộ trình được lưu phiên bản theo tháng, và sau hai kỳ, số lần bộ phận kinh doanh phải hỏi lại giảm rõ vì họ đọc được mức chắc chắn ngay trên tài liệu.',
    comparison: [
      {
        weak: 'Trình bày lộ trình như một dòng thời gian có ngày chính xác cho mọi mục trong bốn quý tới.',
        mature:
          'Trình bày theo ba tầng chắc chắn, chỉ cam kết ngày cho phần đã chốt phạm vi và nói rõ mức tin cậy của các phần còn lại.',
      },
      {
        weak: 'Lộ trình là danh sách tên tính năng, nên khi cách làm thay đổi thì cả tài liệu trở nên sai và phải viết lại.',
        mature:
          'Lộ trình là danh sách bài toán và kết quả, nên nó vẫn đúng khi giải pháp thay đổi và người đọc hiểu được vì sao đội làm việc đó.',
      },
      {
        weak: 'Giữ hai bản lộ trình: một bản đẹp cho khách hàng và một bản thật cho nội bộ.',
        mature:
          'Giữ một bản duy nhất, điều chỉnh mức chi tiết theo đối tượng nhưng không đổi nội dung cam kết, để không có ai bị bất ngờ khi hai bản gặp nhau.',
      },
    ],
    mistakes: [
      'Biến lộ trình thành nơi chứa mọi ý tưởng đã từng được nhắc tới, khiến tài liệu dài tới mức không ai đọc và mọi mục đều có vẻ đã được hứa với một ai đó.',
      'Cam kết ngày cho một mục ở tầng xa để làm hài lòng một khách hàng lớn, rồi phải rút bớt phạm vi của các mục đã chốt để giữ lời hứa đó, gây thiệt hại lan sang những khách hàng không liên quan.',
      'Không bao giờ ghi lý do khi đẩy lùi một mục, nên các bên liên quan chỉ thấy lộ trình lặng lẽ thay đổi và dần coi tài liệu này là thứ không đáng tin.',
    ],
    worksheet: [
      'Một tới ba kết quả của kỳ này là gì, kèm chỉ số và mức đích cho từng cái?',
      'Trong lộ trình hiện tại, mục nào không nối được vào kết quả nào? Bạn xử lý chúng ra sao?',
      'Viết lại ba mục đang ghi bằng tên tính năng thành câu bài toán kèm kết quả mong muốn.',
      'Những chủ đề nào bị hoãn sang kỳ sau, bạn giải thích với người đề xuất bằng lý lẽ nào, và bao giờ sẽ xem lại?',
      'Nhịp cập nhật lộ trình của bạn là bao lâu một lần, ai tham gia, và lịch sử thay đổi được lưu ở đâu?',
    ],
    exercises: [
      {
        label: 'Viết kết quả của kỳ',
        text: 'Soạn một tới ba kết quả cho kỳ tới, mỗi cái có chỉ số, mức nền và mức đích. Kiểm bằng cách hỏi từng thành viên trong đội xem họ nhắc lại được các kết quả này không sau một tuần.',
        level: 'e',
      },
      {
        label: 'Dịch tính năng thành bài toán',
        text: 'Lấy mười dòng trong lộ trình hiện tại và viết lại thành câu bài toán kèm kết quả mong muốn. Đánh dấu dòng nào bạn không viết lại được vì không rõ nó phục vụ ai.',
        level: 'e',
      },
      {
        label: 'Xếp ba tầng chắc chắn',
        text: 'Phân loại toàn bộ mục hiện có vào ba tầng đang làm, kế tiếp, đang xem xét. Ghi rõ tiêu chí để một mục được chuyển lên tầng trên và ai có quyền quyết định việc chuyển đó.',
        level: 'm',
      },
      {
        label: 'Khối sẽ không làm',
        text: 'Viết khối liệt kê ba tới năm chủ đề bị hoãn kèm lý do và thời điểm sẽ xem lại. Gửi cho bộ phận kinh doanh và hỗ trợ khách hàng, ghi lại phản ứng và các trường hợp họ cho là không thể hoãn.',
        level: 'm',
      },
      {
        label: 'Bản đồ phụ thuộc',
        text: 'Liệt kê mọi phụ thuộc vào đội khác, đối tác hoặc quy định bên ngoài cho các mục ở tầng đang làm. Với mỗi phụ thuộc, ghi người liên hệ, ngày cần có và phương án nếu trễ.',
        level: 'm',
      },
      {
        label: 'Trình bày cho ba đối tượng',
        text: 'Chuẩn bị ba cách trình bày cùng một lộ trình cho ban lãnh đạo, đội thi công và khách hàng, khác nhau về mức chi tiết nhưng không khác về cam kết. Trình bày thật cho ít nhất hai nhóm và ghi câu hỏi họ đặt ra.',
        level: 'h',
      },
      {
        label: 'Xử lý yêu cầu cam kết ngày',
        text: 'Soạn kịch bản trả lời cho tình huống khách hàng lớn đòi cam kết ngày cho một mục ở tầng xa: câu hỏi làm rõ bài toán, phương án thử nhỏ, điều kiện để công ty cam kết. Diễn tập với đồng nghiệp đóng vai khách hàng.',
        level: 'h',
      },
      {
        label: 'Rà lộ trình cũ',
        text: 'Lấy lộ trình của hai kỳ trước và đối chiếu với những gì thật sự được giao. Tính tỉ lệ mục đúng hạn, mục bị đẩy lùi, mục bị bỏ, và viết một trang phân tích nguyên nhân theo ba nhóm: ước lượng sai, ưu tiên đổi, phụ thuộc trễ.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao lộ trình nên viết theo bài toán thay vì theo tên tính năng?',
        a: 'Vì tên tính năng khoá sẵn một giải pháp trước khi đội hiểu đủ, và làm tài liệu trở nên sai ngay khi tìm được cách giải tốt hơn. Viết theo bài toán giữ được không gian lựa chọn, đồng thời giúp các bên liên quan hiểu vì sao việc đó đáng làm chứ không chỉ biết đội sẽ xây gì.',
      },
      {
        q: 'Khách hàng lớn đòi cam kết ngày cho một mục còn ở tầng đang xem xét. Trả lời thế nào cho vừa trung thực vừa giữ được quan hệ?',
        a: 'Nói rõ ba mức trên lộ trình và mục đó đang ở mức nào, giải thích rằng cam kết ngày chỉ được đưa ra sau khi chốt phạm vi. Đề nghị một bước trung gian có giá trị thật với họ: một buổi làm rõ bài toán, một phép thử nhỏ, hoặc cam kết ngày cho phần hẹp hơn mà đội đủ tự tin. Trung thực về mức chắc chắn tạo niềm tin bền hơn một lời hứa dễ chịu rồi trượt.',
      },
      {
        q: 'Lộ trình nên được cập nhật bao lâu một lần?',
        a: 'Tầng đang làm nên được xem theo nhịp hai tuần hoặc theo chu kỳ phát triển; toàn bộ lộ trình nên xem lại mỗi tháng hoặc mỗi kỳ, và cập nhật ngay khi có thông tin đủ lớn để đổi thứ tự. Điều quan trọng hơn nhịp là việc mỗi thay đổi đều có ngày, lý do và người quyết định được ghi lại.',
      },
    ],
    plan7:
      'Ngày 1: viết một tới ba kết quả của kỳ kèm chỉ số. Ngày 2: dịch mười dòng lộ trình hiện tại thành câu bài toán. Ngày 3: xếp toàn bộ mục vào ba tầng chắc chắn. Ngày 4: viết khối sẽ không làm và gửi cho kinh doanh, hỗ trợ. Ngày 5: lập bản đồ phụ thuộc cho tầng đang làm. Ngày 6: chuẩn bị ba cách trình bày và trình bày cho ít nhất một nhóm. Ngày 7: thiết lập nhịp cập nhật, lưu phiên bản đầu tiên có ngày và mở nhật ký thay đổi.',
    evidence:
      'Hãy giữ lại một lộ trình thật ở dạng ba tầng, kèm khối sẽ không làm, bản đồ phụ thuộc và nhật ký thay đổi có lý do. Kèm theo là bảng đối chiếu lộ trình kỳ trước với những gì đã giao cùng phân tích nguyên nhân trượt. Trong phỏng vấn, tình huống được hỏi nhiều nhất là xử lý áp lực cam kết ngày từ kinh doanh hoặc khách hàng lớn — hãy kể một trường hợp cụ thể bạn đã thương lượng thành một phạm vi hẹp hơn có cam kết chắc chắn, và điều gì đã xảy ra sau đó.',
    references: [
      { label: 'ProductPlan — thư viện bài viết về lộ trình sản phẩm', url: 'https://www.productplan.com/learn/', type: 'article', needsReview: true },
      { label: 'Mind the Product — bài viết về lộ trình và giao tiếp với các bên liên quan', url: 'https://www.mindtheproduct.com/', type: 'article' },
    ],
  }),

  // ── Chương 14 · Ra mắt sản phẩm — Product Launch ──────────────────────────
  guide({
    thesis:
      'Ra mắt là một phép kiểm về mức độ sẵn sàng của cả tổ chức chứ không phải một sự kiện truyền thông. Trước ngày công bố, ba câu hỏi phải có câu trả lời viết ra: sản phẩm đã đủ tốt cho ai và trong hoàn cảnh nào, những bộ phận sẽ gánh hệ quả — bán hàng, hỗ trợ, kho vận, kỹ thuật — đã có kịch bản và tài liệu chưa, và nếu có sự cố thì đường lui là gì, ai quyết định, trong bao lâu. Ra mắt lớn không làm sản phẩm tốt hơn; nó chỉ khuếch đại thứ đang có, kể cả phần chưa xong.',
    why: {
      work:
        'Phần lớn sự cố ra mắt không đến từ sản phẩm mà đến từ khoảng trống giữa các bộ phận: tổng đài chưa biết trả lời, kho chưa biết mã hàng, đội kỹ thuật chưa biết ai trực. Một danh mục kiểm chéo bộ phận là công cụ rẻ nhất để bịt các khoảng trống đó.',
      interview:
        'Câu hỏi “kể về một lần ra mắt bạn tham gia” là dịp để thể hiện tư duy vận hành. Người kể được cách phân tầng ra mắt, tiêu chí sẵn sàng và kịch bản lui sẽ khác hẳn người chỉ kể về chiến dịch truyền thông.',
      study:
        'Khi bảo vệ đồ án hoặc trình bày dự án khởi nghiệp, phần kế hoạch đưa sản phẩm ra thị trường thường bị bỏ trống; chỉ cần một bảng phân tầng và một danh mục kiểm là bài của bạn đã khác biệt.',
      life:
        'Người mở quán, mở lớp hoặc bán một dòng hàng mới đều đối mặt cùng bài toán: chạy thử với nhóm nhỏ, kiểm năng lực phục vụ, rồi mới mở rộng — thay vì mời đông ngay ngày đầu và hỏng ấn tượng đầu tiên.',
    },
    framework: [
      {
        name: 'Phân tầng quy mô ra mắt',
        detail:
          'Không phải thứ gì cũng cần công bố lớn. Chia ba mức: âm thầm phát hành cho một nhóm nhỏ, ra mắt có chọn lọc cho một phân khúc hoặc một khu vực, và ra mắt rộng. Mỗi mức có điều kiện chuyển tiếp riêng dựa trên dữ liệu chứ không dựa trên lịch marketing.',
      },
      {
        name: 'Định tiêu chí sẵn sàng',
        detail:
          'Viết danh sách điều kiện phải đạt trước khi mở rộng: mức lỗi dưới ngưỡng, thời gian phản hồi hệ thống, tồn kho và năng lực giao hàng, tài liệu hướng dẫn, kịch bản trả lời cho hỗ trợ. Tiêu chí phải đo được và có người ký xác nhận từng mục.',
      },
      {
        name: 'Chuẩn bị các bộ phận sẽ gánh hệ quả',
        detail:
          'Trước ngày công bố, bán hàng cần thông điệp và bảng giá, hỗ trợ cần danh sách câu hỏi thường gặp và cách xử lý ba tình huống xấu nhất, vận hành cần quy trình đổi trả và bảo hành, kỹ thuật cần lịch trực. Diễn tập một vòng bằng vài tình huống giả định trước khi mở.',
      },
      {
        name: 'Viết kịch bản lui và ngưỡng kích hoạt',
        detail:
          'Định trước dấu hiệu buộc phải dừng hoặc thu hẹp: tỉ lệ lỗi vượt ngưỡng, số ca hỗ trợ vượt năng lực, sự cố an toàn. Ghi rõ ai có quyền bấm dừng mà không cần xin phép thêm, và các bước thông báo cho khách hàng.',
      },
      {
        name: 'Đo trong ba mươi ngày và tổng kết',
        detail:
          'Ra mắt chưa kết thúc vào ngày công bố. Theo dõi chỉ số chính, chỉ số bảo vệ, khối lượng hỗ trợ và tỉ lệ hoàn trả trong ba mươi ngày, rồi họp tổng kết để ghi lại điều gì nên làm khác lần sau.',
      },
    ],
    scenario:
      'Một xưởng nội thất ở Bình Dương chuẩn bị ra mắt dòng bàn làm việc nâng hạ điện đầu tiên của mình. Phương án ban đầu là mở bán rộng đúng dịp lễ với chiến dịch quảng cáo lớn. Người phụ trách sản phẩm đề nghị phân tầng lại: bán trước cho ba mươi khách đã từng mua bàn gỗ của xưởng, giao và lắp tận nơi, kèm cam kết đổi mới trong sáu mươi ngày. Tiêu chí sẵn sàng được viết ra và ký xác nhận theo từng bộ phận: mỗi bàn phải qua kiểm nâng hạ hai trăm chu kỳ, thợ lắp phải qua buổi huấn luyện một buổi, tổng đài phải có kịch bản cho ba tình huống thường gặp nhất, và kho phải có sẵn phụ kiện thay thế cho chân bàn. Đợt nhỏ này phát hiện hai điều mà bản vẽ không cho thấy: bộ điều khiển đặt ở cạnh phải gây vướng với người thuận tay trái, và mặt bàn dày làm khe kẹp dây không đóng được khi khách dùng loại ổ cắm phổ biến. Cả hai được sửa trước khi mở rộng. Ngưỡng dừng cũng được viết trước: nếu tỉ lệ ca bảo hành trong ba mươi ngày đầu vượt năm phần trăm thì dừng bán và rà lại lô hàng, và trưởng xưởng có quyền bấm dừng ngay. Khi mở bán rộng ở tầng thứ ba, đội đã có sẵn tài liệu hướng dẫn, kịch bản hỗ trợ và số liệu thật để viết nội dung quảng cáo, thay vì phải hứa những thứ chưa kiểm chứng.',
    comparison: [
      {
        weak: 'Chốt ngày ra mắt theo lịch truyền thông rồi ép mọi thứ khác chạy theo, kể cả khi tiêu chí chất lượng chưa đạt.',
        mature:
          'Chốt tiêu chí sẵn sàng trước, ngày ra mắt là hệ quả của việc đạt tiêu chí; nếu phải giữ ngày thì thu hẹp phạm vi hoặc thu hẹp nhóm khách.',
      },
      {
        weak: 'Chỉ đội sản phẩm và marketing biết kế hoạch, các bộ phận khác nhận tin cùng lúc với khách hàng.',
        mature:
          'Chuẩn bị chéo bộ phận với danh mục kiểm có người ký từng mục, kèm một buổi diễn tập tình huống trước ngày mở.',
      },
      {
        weak: 'Coi ngày công bố là vạch đích, đội chuyển ngay sang việc khác sau khi ra mắt.',
        mature:
          'Giữ nhịp theo dõi ba mươi ngày với chỉ số và khối lượng hỗ trợ, kết thúc bằng buổi tổng kết ghi lại bài học.',
      },
    ],
    mistakes: [
      'Ra mắt rộng khi năng lực phục vụ chưa kiểm chứng, khiến nhóm khách hàng đầu tiên — vốn là nhóm sẵn lòng ủng hộ nhất — nhận trải nghiệm tệ và để lại đánh giá tiêu cực tồn tại rất lâu.',
      'Không viết kịch bản lui vì cho rằng nói tới thất bại là thiếu tự tin; tới lúc có sự cố thì mất nhiều giờ chỉ để tranh luận ai được quyền quyết định dừng.',
      'Truyền thông hứa những khả năng mà bản phát hành đầu chưa có, dẫn tới làn sóng yêu cầu hoàn tiền và khiến bộ phận hỗ trợ phải gánh hậu quả của một quyết định họ không tham gia.',
    ],
    worksheet: [
      'Đợt ra mắt này thuộc tầng nào: âm thầm, chọn lọc hay rộng? Điều kiện nào cho phép chuyển lên tầng tiếp theo?',
      'Liệt kê năm tiêu chí sẵn sàng đo được và ghi tên người ký xác nhận cho từng cái.',
      'Bộ phận nào sẽ gánh hệ quả của đợt ra mắt này, và mỗi bộ phận cần tài liệu hoặc kịch bản gì trước ngày mở?',
      'Ba dấu hiệu nào buộc bạn phải dừng hoặc thu hẹp, ngưỡng cụ thể là bao nhiêu, và ai có quyền bấm dừng?',
      'Trong ba mươi ngày sau ra mắt, bạn theo dõi những chỉ số nào, ai xem, và bao lâu một lần?',
    ],
    exercises: [
      {
        label: 'Chọn tầng ra mắt',
        text: 'Với thứ bạn sắp phát hành, viết lập luận nửa trang cho tầng ra mắt phù hợp, kèm điều kiện chuyển tầng. Trình bày cho một người ở bộ phận vận hành và ghi lại phản biện của họ.',
        level: 'e',
      },
      {
        label: 'Danh sách tiêu chí sẵn sàng',
        text: 'Soạn danh sách ít nhất tám tiêu chí sẵn sàng đo được, chia theo bộ phận, mỗi tiêu chí có ngưỡng và người xác nhận. Gửi cho từng bộ phận để họ bổ sung mục còn thiếu.',
        level: 'e',
      },
      {
        label: 'Bộ tài liệu cho hỗ trợ',
        text: 'Viết danh sách mười câu hỏi thường gặp kèm câu trả lời mẫu và ba tình huống xấu nhất kèm cách xử lý. Nhờ một nhân viên hỗ trợ đọc thử và trả lời một cuộc gọi giả định để tìm chỗ thiếu.',
        level: 'm',
      },
      {
        label: 'Kịch bản lui',
        text: 'Viết kịch bản lui một trang: dấu hiệu kích hoạt, ngưỡng cụ thể, người có quyền quyết định, các bước kỹ thuật và vận hành, mẫu thông báo cho khách hàng. Xin xác nhận của người có thẩm quyền.',
        level: 'm',
      },
      {
        label: 'Diễn tập tình huống',
        text: 'Tổ chức buổi diễn tập 60 phút với ba tình huống: lỗi nghiêm trọng phát hiện sau hai giờ, khối lượng yêu cầu hỗ trợ gấp ba dự kiến, và một khách hàng lớn phản ứng công khai. Ghi lại thời gian ra quyết định và các chỗ lúng túng.',
        level: 'm',
      },
      {
        label: 'Ra mắt cho nhóm nhỏ',
        text: 'Thực hiện đợt phát hành cho một nhóm nhỏ đúng đối tượng, thu thập phản hồi có cấu trúc và đo các tiêu chí sẵn sàng trên dữ liệu thật. Viết báo cáo quyết định có mở rộng hay không kèm bằng chứng.',
        level: 'h',
      },
      {
        label: 'Bảng theo dõi ba mươi ngày',
        text: 'Dựng bảng theo dõi gồm chỉ số chính, chỉ số bảo vệ, khối lượng hỗ trợ, tỉ lệ hoàn trả hoặc huỷ, và ghi chú sự kiện theo ngày. Duy trì trong bốn tuần và trình bày hằng tuần cho các bên liên quan.',
        level: 'h',
      },
      {
        label: 'Buổi tổng kết ra mắt',
        text: 'Tổ chức buổi tổng kết với đủ các bộ phận đã tham gia. Đầu ra là một trang gồm ba việc nên giữ, ba việc phải làm khác, và các mục sửa vào danh mục kiểm cho lần ra mắt sau, kèm người phụ trách.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên ra mắt theo tầng thay vì mở rộng ngay từ đầu?',
        a: 'Vì ở tầng nhỏ, chi phí của một sai sót còn thấp và bạn vẫn kịp sửa trước khi nó chạm tới đông người. Tầng nhỏ cũng cho dữ liệu thật về năng lực vận hành — thời gian giao, khối lượng hỗ trợ, tỉ lệ lỗi — thứ mà không cuộc họp nào ước lượng chính xác được.',
      },
      {
        q: 'Ngày ra mắt đã hứa với đối tác nhưng một tiêu chí sẵn sàng chưa đạt. Xử lý thế nào?',
        a: 'Trình bày ba lựa chọn kèm hệ quả thay vì hỏi có nên lùi hay không: giữ ngày nhưng thu hẹp phạm vi hoặc thu hẹp nhóm khách; giữ nguyên phạm vi và lùi ngày; hoặc giữ cả hai và chấp nhận rủi ro đã lượng hoá kèm kịch bản lui. Quyết định thuộc về người có thẩm quyền, nhưng phải được ghi lại cùng phần rủi ro đã nêu.',
      },
      {
        q: 'Sau khi ra mắt, chỉ số chính tăng nhưng khối lượng yêu cầu hỗ trợ cũng tăng mạnh. Nên hiểu thế nào?',
        a: 'Đây là dấu hiệu cần tách nguyên nhân trước khi ăn mừng: hỗ trợ tăng có thể chỉ vì có thêm người dùng, hoặc vì sản phẩm khó hiểu ở một khâu cụ thể. Cách kiểm là tính số ca hỗ trợ trên một trăm người dùng mới và phân loại theo chủ đề; nếu tỉ lệ đó tăng, phần trải nghiệm đang có vấn đề và cần sửa trước khi đẩy thêm lưu lượng.',
      },
    ],
    plan7:
      'Ngày 1: chọn tầng ra mắt và viết điều kiện chuyển tầng. Ngày 2: soạn danh sách tiêu chí sẵn sàng theo bộ phận và gửi đi lấy bổ sung. Ngày 3: viết bộ câu hỏi thường gặp và ba tình huống xấu nhất cho hỗ trợ. Ngày 4: viết kịch bản lui và xin xác nhận thẩm quyền. Ngày 5: tổ chức buổi diễn tập tình huống. Ngày 6: chốt bảng theo dõi ba mươi ngày và người xem hằng tuần. Ngày 7: rà lần cuối danh mục kiểm, thu thập chữ ký xác nhận và ấn định ngày mở cho nhóm nhỏ.',
    evidence:
      'Hãy lưu lại danh mục kiểm sẵn sàng có chữ ký từng bộ phận, kịch bản lui, biên bản buổi diễn tập, bảng theo dõi ba mươi ngày và một trang tổng kết ra mắt. Bộ hồ sơ này cho thấy bạn làm việc được với nhiều bộ phận chứ không chỉ với đội kỹ thuật, và đó chính là năng lực mà các vị trí sản phẩm cấp cao tìm kiếm. Trong phỏng vấn, hãy kể một lần bạn đề nghị thu hẹp phạm vi hoặc lùi mở rộng vì một tiêu chí chưa đạt, nêu rõ bạn trình bày đánh đổi thế nào và kết quả sau đó ra sao.',
    references: [
      { label: 'First Round Review — bài viết thực chiến về vận hành và ra mắt', url: 'https://review.firstround.com/', type: 'article', needsReview: true },
      { label: 'Atlassian — cẩm nang quản lý sự cố và trực vận hành', url: 'https://www.atlassian.com/incident-management', type: 'article' },
    ],
  }),
];
