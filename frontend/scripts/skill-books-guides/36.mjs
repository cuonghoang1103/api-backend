import { guide } from '../skill-guide-builder.mjs';

export default [
  // ─────────────────────────────────────────────────────────────────────────
  // Chương 1 — Nghiên cứu thị trường
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Nghiên cứu thị trường không phải là đi thu thập càng nhiều thông tin càng tốt, mà là hạ độ bất định của một quyết định cụ thể sắp phải ra: có thuê mặt bằng này không, có làm dòng sản phẩm này không, có đủ người sẵn sàng trả mức giá này không. Vì vậy mọi cuộc nghiên cứu tử tế đều bắt đầu bằng câu hỏi quyết định chứ không bắt đầu bằng bảng hỏi. Nếu bạn không viết được câu "nếu số ra dưới mức X thì tôi sẽ không làm", thì thứ bạn đang làm là sưu tầm dữ liệu cho yên tâm, không phải nghiên cứu.',
    why: {
      work: 'Trong công ty, phần lớn tranh cãi về chiến dịch hay dòng sản phẩm mới thực chất là tranh cãi giữa hai cảm tính không ai kiểm chứng được. Người mang được ba con số có nguồn và hai đoạn ghi âm khách hàng vào phòng họp sẽ kết thúc tranh cãi đó trong mười lăm phút, không phải vì họ nói to hơn mà vì lập luận của họ có thể bị bác bỏ bằng dữ kiện, còn cảm tính thì không.',
      interview:
        'Vị trí marketing hay product nào cũng có câu hỏi kiểu "nếu được giao thị trường mới, tuần đầu bạn làm gì". Ứng viên yếu trả lời bằng danh sách công cụ; ứng viên mạnh nói ra thứ tự: câu hỏi quyết định là gì, dữ liệu thứ cấp nào rẻ và nhanh nhất, ai là mười người cần gọi trước, và ngưỡng nào sẽ khiến họ khuyến nghị dừng.',
      study:
        'Làm khoá luận hay bài tập lớn về kinh doanh, sinh viên thường trích một con số thị trường lớn cho oai rồi không dùng nó vào bất cứ kết luận nào. Học cách phân biệt số dùng để trang trí và số dùng để ra quyết định là kỹ năng chuyển thẳng được từ ghế nhà trường sang công việc.',
      life: 'Trước khi mở một tiệm nhỏ, đổi nghề hay nhận một hợp đồng lớn, cùng một bộ thao tác này giúp bạn tránh việc đặt cược tiền tiết kiệm dựa trên vài lời động viên của người quen. Hỏi mười người lạ thuộc đúng nhóm khách hàng cho bạn nhiều thông tin hơn hỏi năm mươi người thân.',
    },
    framework: [
      {
        name: 'Viết câu hỏi quyết định và ngưỡng',
        detail:
          'Một câu duy nhất: tôi đang phải chọn giữa A và B, và tôi sẽ chọn A nếu chỉ số nào vượt ngưỡng nào. Ngưỡng phải viết trước khi nhìn dữ liệu, nếu không bạn sẽ vô thức hạ ngưỡng cho khớp với thứ mình đã muốn làm từ đầu.',
      },
      {
        name: 'Vét dữ liệu thứ cấp trước',
        detail:
          'Trước khi hỏi ai, đọc thứ đã có sẵn và miễn phí: số liệu dân cư và thu nhập theo địa bàn của cơ quan thống kê, báo cáo ngành công bố công khai, danh sách doanh nghiệp cùng ngành, giá niêm yết của bên đang bán. Bước này thường trả lời được một phần ba câu hỏi và giúp bạn hỏi phần còn lại thông minh hơn.',
      },
      {
        name: 'Phỏng vấn sơ cấp có cấu trúc',
        detail:
          'Tìm mười tới mười lăm người thuộc đúng nhóm bạn định phục vụ, hỏi về hành vi đã xảy ra chứ không hỏi ý định: lần gần nhất họ mua thứ tương tự là khi nào, họ đã cân nhắc những lựa chọn nào, cuối cùng vì sao chọn cái đó, họ trả bao nhiêu. Câu hỏi "anh chị có sẵn sàng dùng không" gần như luôn nhận được câu trả lời lịch sự và vô dụng.',
      },
      {
        name: 'Ước lượng quy mô từ dưới lên',
        detail:
          'Đừng lấy con số thị trường toàn quốc rồi nhân với một tỷ lệ thị phần tự nghĩ. Đi từ dưới: bao nhiêu khách tiềm năng trong bán kính phục vụ thật, bao nhiêu phần trăm trong đó thuộc nhóm bạn nhắm, họ mua bao nhiêu lần một năm, giá trị mỗi lần. Ghi rõ từng giả định thành một dòng riêng để người khác chỉ ra được chỗ nào bạn lạc quan quá.',
      },
      {
        name: 'Kiểm bằng một phép thử có tiền thật',
        detail:
          'Trước khi đầu tư lớn, tạo một tình huống buộc người ta phải bỏ ra thứ có giá: đặt cọc, đăng ký giữ chỗ, mua thử lô nhỏ. Ý kiến miễn phí và hành vi mất tiền là hai loại dữ liệu khác hẳn nhau về độ tin cậy.',
      },
      {
        name: 'Kết luận và ghi lại điều còn chưa biết',
        detail:
          'Viết một trang: quyết định, ba bằng chứng chính, ba giả định còn yếu nhất, và dấu hiệu nào trong ba tháng tới sẽ chứng minh bạn sai. Trang này quan trọng ở chỗ nó cho phép bạn phát hiện sai sớm thay vì bảo vệ quyết định cũ bằng mọi giá.',
      },
    ],
    scenario:
      'Chủ một quán bún bò có hai chi nhánh muốn mở chi nhánh thứ ba ở khu dân cư mới, giá thuê cao gấp rưỡi chỗ cũ. Anh viết câu hỏi quyết định: chỉ thuê nếu ước tính được ít nhất một trăm hai mươi tô mỗi ngày trong sáu tháng đầu. Anh đếm thủ công lượt người ra vào ba quán ăn sáng gần đó trong sáu buổi sáng khác nhau, hỏi mười hai người đang xếp hàng ở quán bên cạnh về thói quen ăn sáng và mức chi, và xin số liệu số căn hộ đã bàn giao từ ban quản lý toà nhà. Ước lượng từ dưới lên ra khoảng tám mươi tô mỗi ngày, thấp hơn ngưỡng rõ rệt vì phần lớn cư dân đi làm sớm và ăn sáng gần công ty. Anh không thuê, chuyển sang mở quầy bán mang đi trước cổng khu công nghiệp cách đó bốn cây số với chi phí bằng một phần tư, và giữ lại bảng tính để kiểm lại sau một năm khi khu dân cư lấp đầy hơn.',
    comparison: [
      {
        weak: 'Bắt đầu bằng bảng hỏi trăm câu gửi cho mọi người quen rồi mới nghĩ xem sẽ dùng kết quả vào việc gì.',
        mature: 'Bắt đầu bằng một câu hỏi quyết định có ngưỡng, và chỉ thu thập đúng dữ liệu có thể đẩy quyết định qua hoặc dưới ngưỡng đó.',
      },
      {
        weak: 'Hỏi khách hàng tiềm năng rằng họ có thích ý tưởng này không và ghi nhận số lượt gật đầu như bằng chứng nhu cầu.',
        mature: 'Hỏi về lần mua gần nhất trong quá khứ, số tiền đã trả, và lựa chọn nào bị loại — rồi kiểm lại bằng một phép thử có đặt cọc.',
      },
      {
        weak: 'Lấy quy mô thị trường toàn ngành rồi giả định giành được một phần trăm để ra doanh thu dự kiến.',
        mature: 'Cộng từ dưới lên bằng số khách thật trong tầm phục vụ, tần suất mua và giá trị mỗi lần, kèm danh sách giả định để người khác phản biện.',
      },
    ],
    mistakes: [
      'Chỉ phỏng vấn những người dễ tiếp cận nhất, thường là bạn bè và người trong ngành, rồi tưởng sự nhiệt tình của họ đại diện cho thị trường — nhóm này có động cơ làm bạn vui và gần như không bao giờ nói thẳng rằng họ sẽ không mua.',
      'Dừng nghiên cứu ngay khi gặp dữ liệu đầu tiên ủng hộ điều mình đã muốn làm, trong khi vẫn tiếp tục đào thêm mỗi khi gặp dữ liệu ngược lại — sự bất đối xứng này khó tự nhận ra nếu không viết ngưỡng ra giấy từ trước.',
      'Coi nghiên cứu là việc làm một lần trước khi khởi động, nên khi thị trường đổi thì vẫn điều hành bằng bản đồ cũ, và thường chỉ phát hiện ra khi doanh thu đã giảm vài tháng liền.',
    ],
    worksheet: [
      'Quyết định kinh doanh gần nhất bạn phải ra là gì, và ngưỡng nào sẽ khiến bạn nói không? Viết ngưỡng đó thành một con số cụ thể.',
      'Liệt kê ba nguồn dữ liệu thứ cấp miễn phí bạn có thể đọc trong hai giờ tới cho quyết định đó, kèm điều bạn hy vọng mỗi nguồn trả lời.',
      'Viết tên và cách tiếp cận mười người thuộc đúng nhóm khách hàng mục tiêu mà bạn chưa quen biết. Bạn sẽ mở lời với họ bằng câu gì?',
      'Soạn ba câu hỏi phỏng vấn chỉ hỏi về hành vi đã xảy ra, không câu nào chứa từ "sẽ" hay "có muốn".',
      'Bảng ước lượng từ dưới lên của bạn dựa trên bao nhiêu giả định? Ghi từng giả định một dòng và khoanh tròn cái mà nếu sai sẽ làm sập cả kết luận.',
    ],
    exercises: [
      {
        label: 'Một câu quyết định',
        text: 'Chọn một ý tưởng kinh doanh hoặc một chiến dịch bạn đang cân nhắc, viết đúng một câu theo mẫu "tôi sẽ làm X nếu ... vượt ..., ngược lại tôi dừng". Đưa cho một người khác đọc và nhờ họ chỉ ra chỗ ngưỡng còn mơ hồ.',
        level: 'e',
      },
      {
        label: 'Hai giờ dữ liệu thứ cấp',
        text: 'Đặt hẹn giờ hai tiếng, chỉ dùng nguồn công khai miễn phí để trả lời nhiều nhất có thể cho câu hỏi quyết định trên. Cuối buổi ghi lại: câu nào đã trả lời được, câu nào bắt buộc phải hỏi người thật.',
        level: 'e',
      },
      {
        label: 'Đếm hành vi ngoài đời',
        text: 'Chọn một địa điểm nơi khách hàng mục tiêu xuất hiện, đếm thủ công trong ba khung giờ khác nhau của hai ngày khác nhau. Ghi cả điều kiện quan sát: thời tiết, ngày trong tuần, sự kiện bất thường.',
        level: 'e',
      },
      {
        label: 'Năm cuộc phỏng vấn hành vi',
        text: 'Phỏng vấn năm người lạ đúng nhóm mục tiêu, mỗi cuộc mười lăm phút, chỉ hỏi về lần mua gần nhất. Ghi nguyên văn ba câu đắt nhất của mỗi người và đánh dấu chỗ họ tự nói ra con số tiền.',
        level: 'm',
      },
      {
        label: 'Bảng ước lượng có giả định',
        text: 'Dựng bảng tính ước lượng doanh thu năm đầu từ dưới lên, mỗi giả định một ô riêng có ghi nguồn. Làm thêm hai kịch bản bằng cách hạ giả định lớn nhất xuống một nửa và xem kết luận có đổi không.',
        level: 'm',
      },
      {
        label: 'Phép thử có tiền thật',
        text: 'Thiết kế một phép thử nhỏ buộc người quan tâm bỏ ra thứ có giá: đặt cọc giữ chỗ, trả trước lô nhỏ, hoặc đăng ký kèm số điện thoại và xác nhận lại. Chạy trong một tuần và so số người nói quan tâm với số người thật sự trả.',
        level: 'm',
      },
      {
        label: 'Phản biện chính mình',
        text: 'Viết một trang lập luận vì sao ý tưởng của bạn sẽ thất bại, dùng đúng dữ liệu bạn vừa thu thập. Nếu không viết nổi một trang, đó là dấu hiệu bạn chưa thu đủ dữ liệu bất lợi.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: nhật ký thị trường',
        text: 'Bảy ngày liền, mỗi ngày ghi một quan sát thị trường có nguồn rõ ràng: một mức giá đối thủ vừa đổi, một câu than phiền của khách trên mạng, một dòng số liệu công khai. Ngày thứ bảy xếp bảy quan sát đó vào ba nhóm — xác nhận giả định, phản bác giả định, chưa liên quan — và viết lại câu hỏi quyết định nếu cần.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao câu hỏi "anh chị có sẵn sàng dùng sản phẩm này không" hầu như không mang lại thông tin dùng được?',
        a: 'Vì nó hỏi về một hành vi tương lai không tốn kém gì để trả lời đồng ý, trong bối cảnh xã giao mà người được hỏi thường muốn giúp bạn vui. Người trả lời cũng không thực sự biết mình sẽ làm gì trong hoàn cảnh có giá, có lựa chọn thay thế và có sức ì. Thay thế bằng câu hỏi về quá khứ đã xảy ra — lần gần nhất mua gì, trả bao nhiêu, bỏ lựa chọn nào — vì hành vi đã xảy ra thì không thể lịch sự hoá được.',
      },
      {
        q: 'Ước lượng từ trên xuống và từ dưới lên khác nhau ở đâu, và vì sao bản từ dưới lên đáng tin hơn khi quyết định đầu tư?',
        a: 'Từ trên xuống lấy tổng quy mô ngành rồi nhân một tỷ lệ thị phần giả định, nên toàn bộ kết luận nằm gọn trong một con số tự nghĩ và không ai kiểm chứng được. Từ dưới lên cộng dồn các đại lượng có thể đếm được trong tầm với: số khách tiềm năng thật, tần suất mua, giá trị mỗi lần. Cách thứ hai cho ra con số thường nhỏ hơn nhưng có ưu điểm quyết định là mỗi giả định đứng riêng một dòng, nên người khác chỉ ra được chỗ sai và bạn sửa được từng phần thay vì bỏ cả bảng.',
      },
      {
        q: 'Khi nào nên dừng nghiên cứu và bắt đầu làm?',
        a: 'Khi thêm dữ liệu không còn khả năng đổi được quyết định. Cách kiểm cụ thể là tự hỏi: nếu tuần sau tôi có thêm mười cuộc phỏng vấn nữa, kết quả nào sẽ khiến tôi chọn khác đi? Nếu không hình dung được kết quả nào như vậy thì nghiên cứu thêm chỉ là hoãn quyết định. Lúc đó việc cần làm là chuyển sang một phép thử nhỏ có tiền thật, vì thị trường trả lời chính xác hơn bất kỳ bảng hỏi nào.',
      },
    ],
    plan7:
      'Ngày 1: viết câu hỏi quyết định và ngưỡng, dán lên chỗ dễ thấy. Ngày 2: hai giờ vét dữ liệu thứ cấp, ghi nguồn từng con số. Ngày 3: lập danh sách hai mươi người mục tiêu và cách tiếp cận, gửi lời mời phỏng vấn. Ngày 4 và 5: thực hiện năm cuộc phỏng vấn hành vi, ghi nguyên văn câu đắt. Ngày 6: dựng bảng ước lượng từ dưới lên với giả định tách dòng, chạy thêm kịch bản bi quan. Ngày 7: viết một trang kết luận gồm quyết định, ba bằng chứng, ba giả định yếu nhất và dấu hiệu chứng minh mình sai trong ba tháng tới.',
    evidence:
      'Hiện vật đáng trưng nhất của kỹ năng này là một tệp nghiên cứu gọn: một trang tóm tắt quyết định, bảng tính ước lượng có ghi nguồn từng ô, và bộ ghi chép phỏng vấn có trích nguyên văn. Trong phỏng vấn xin việc, mang theo đúng bảng tính đó và kể được vì sao bạn đặt ngưỡng ở mức ấy cùng lần bạn khuyến nghị dừng một dự án — người từng dám khuyến nghị dừng đáng tin hơn hẳn người chỉ có các dự án được duyệt. Trong CV, viết thành kết quả có chủ ngữ: "Khảo sát 14 khách hàng và dựng mô hình ước lượng từ dưới lên cho mặt bằng mới, khuyến nghị không thuê; phương án thay thế đạt điểm hoà vốn sau 5 tháng".',
    references: [
      { label: 'Pew Research Center — phương pháp khảo sát và đọc dữ liệu khảo sát', url: 'https://www.pewresearch.org/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 2 — Phân tích đối thủ
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Đối thủ của bạn không phải là công ty giống bạn nhất, mà là thứ khách hàng sẽ chọn nếu không chọn bạn — kể cả khi thứ đó là tự làm lấy, là dùng bảng tính, hay là không làm gì cả. Phân tích đối thủ có ích khi nó trả lời được một câu duy nhất: khi khách đứng trước hai lựa chọn, họ dùng tiêu chí nào để quyết, và trên tiêu chí đó ai đang thắng. Bảng so sánh tính năng dài ba trang mà không nói được điều này chỉ là tài liệu nội bộ để tự trấn an.',
    why: {
      work: 'Đội bán hàng thua đơn thường không thua vì sản phẩm kém mà vì không biết mình đang bị so với ai và bị so trên tiêu chí nào, nên trả lời lệch trọng tâm. Một trang so sánh đúng do marketing dựng giúp cả đội nói cùng một luận điểm thay vì mỗi người tự chế ra một cách chê đối thủ.',
      interview:
        'Trước buổi phỏng vấn ở một công ty, dành một giờ xem ba đối thủ trực tiếp của họ đang định vị ra sao là cách nhanh nhất để đặt được câu hỏi khiến người phỏng vấn ngồi thẳng lên. Nó cũng cho bạn chất liệu để trả lời "bạn nghĩ chúng tôi nên tập trung vào đâu" một cách có căn cứ chứ không nịnh.',
      study:
        'Khi làm bài tập phân tích ngành, đa số dừng ở việc liệt kê tên đối thủ. Kỹ năng thật nằm ở chỗ chọn được tiêu chí so sánh mà khách hàng thật sự dùng, rồi tìm bằng chứng công khai cho từng ô — đó cũng chính là kỹ năng nghiên cứu bạn sẽ cần cho mọi báo cáo sau này.',
      life: 'Khi bạn đi xin việc, mở dịch vụ riêng hay chào giá một hợp đồng, bạn luôn đang bị so với những lựa chọn khác mà bạn không nhìn thấy. Tập thói quen hỏi thẳng "ngoài em, anh chị đang cân nhắc phương án nào nữa" giúp bạn nói đúng thứ cần nói thay vì đoán.',
    },
    framework: [
      {
        name: 'Định nghĩa tập cạnh tranh theo việc khách cần làm',
        detail:
          'Viết ra công việc khách đang cần hoàn thành, rồi liệt kê mọi cách họ có thể hoàn thành nó, gồm cả cách thủ công và cách không làm gì. Tập này thường rộng hơn danh sách công ty cùng ngành và chính phần rộng thêm đó mới hay giết doanh thu của bạn.',
      },
      {
        name: 'Thu bằng chứng công khai, không thu tin đồn',
        detail:
          'Trang giá, trang tuyển dụng, đánh giá của khách trên nền tảng công khai, nội dung họ đăng, tính năng họ nhấn trong quảng cáo. Trang tuyển dụng đặc biệt hữu ích vì nó lộ ra hướng đầu tư sắp tới. Tuyệt đối không dùng cách giả danh khách hàng để moi thông tin nội bộ hay tiếp cận nhân sự đối thủ để hỏi bí mật kinh doanh — vừa sai đạo đức vừa có rủi ro pháp lý.',
      },
      {
        name: 'Chọn tiêu chí theo lời khách, không theo lời mình',
        detail:
          'Lấy đúng những tiêu chí xuất hiện trong câu khách nói khi họ giải thích vì sao chọn hoặc bỏ, ví dụ giờ mở cửa, thời gian phản hồi, có xuất hoá đơn hay không. Tiêu chí do nội bộ tự nghĩ ra thường tôn vinh đúng những thứ mình đang mạnh và làm bảng so sánh mất giá trị.',
      },
      {
        name: 'Chấm bằng bằng chứng, chấp nhận ô mình thua',
        detail:
          'Mỗi ô trong bảng phải kèm nguồn và ngày kiểm. Bảng nào cũng thấy mình thắng mọi tiêu chí là bảng sai, và nó nguy hiểm vì khiến cả đội ngừng học từ đối thủ.',
      },
      {
        name: 'Rút ra một nước đi, không rút ra một bản báo cáo',
        detail:
          'Kết thúc bằng đúng ba dòng: khoảng trống nào ta chiếm được, điểm thua nào phải vá gấp, và điểm thua nào ta cố ý chấp nhận không đuổi theo. Dòng thứ ba là dòng khó viết nhất và cũng là dòng cứu bạn khỏi việc sao chép đối thủ tới mức mất bản sắc.',
      },
    ],
    scenario:
      'Một trung tâm tiếng Anh ở thành phố cấp tỉnh thấy số học viên mới giảm ba tháng liền, và phản xạ đầu tiên của chủ trung tâm là đổi giáo trình vì tin rằng đối thủ lớn hơn có giáo trình xịn hơn. Trước khi chi tiền, quản lý học vụ gọi cho mười tám phụ huynh đã hỏi thông tin nhưng không ghi danh. Mười một người nói lý do là giờ học: trung tâm chỉ xếp lớp lúc mười chín giờ, trong khi hai nơi khác có ca mười bảy giờ ba mươi ngay sau giờ tan học nên phụ huynh chỉ phải đưa đón một lần. Không ai nhắc tới giáo trình. Trung tâm mở thêm ca sớm cho hai lớp thử trong sáu tuần, bố trí giáo viên trẻ dạy ca đó, và giữ nguyên giáo trình cũ. Hết sáu tuần, hai ca sớm lấp đầy trước ca tối, và khoản tiền định chi cho giáo trình được chuyển sang thuê thêm một trợ giảng.',
    comparison: [
      {
        weak: 'Chỉ so mình với hai ba công ty cùng ngành nổi tiếng nhất và bỏ qua giải pháp thủ công mà khách đang dùng.',
        mature: 'Liệt kê mọi cách khách hoàn thành công việc của họ, gồm cả bảng tính tự làm và phương án không làm gì, rồi xét xem mình thật sự đang thay thế cái nào.',
      },
      {
        weak: 'Dựng bảng so sánh bằng các tiêu chí mình đang mạnh, rồi dùng nó làm tài liệu bán hàng.',
        mature: 'Lấy tiêu chí từ nguyên văn lời khách khi họ giải thích lý do chọn hoặc từ chối, kể cả khi tiêu chí đó phơi bày điểm yếu của mình.',
      },
      {
        weak: 'Theo dõi đối thủ bằng cảm giác và tin đồn trong ngành, mỗi lần họ ra tính năng mới thì hoảng lên và bắt chước.',
        mature: 'Kiểm định kỳ các nguồn công khai theo lịch cố định, và chỉ phản ứng khi nước đi của họ chạm đúng tiêu chí khách dùng để quyết định.',
      },
    ],
    mistakes: [
      'Nhầm tính năng nhiều với lợi thế cạnh tranh, nên chạy đua bổ sung tính năng cho bằng đối thủ trong khi khách thật sự rời đi vì thời gian phản hồi hoặc vì thủ tục thanh toán rườm rà.',
      'Chỉ nói chuyện với khách đang dùng sản phẩm của mình, vốn là nhóm đã bị chọn lọc để hài lòng, và không bao giờ gọi cho những người đã hỏi rồi bỏ đi — nhóm đó nắm gần như toàn bộ thông tin về lý do thua.',
      'Biến phân tích đối thủ thành việc nói xấu đối thủ trước mặt khách; khách hiếm khi tin, thường thấy khó chịu, và bạn tự đẩy cuộc trò chuyện ra khỏi giá trị của chính mình.',
    ],
    worksheet: [
      'Viết công việc mà khách hàng thuê sản phẩm của bạn để hoàn thành, bằng một câu bắt đầu bằng động từ.',
      'Liệt kê năm cách khác nhau khách có thể hoàn thành công việc đó mà không cần tới bạn, trong đó ít nhất một cách không tốn tiền.',
      'Ba tiêu chí gần nhất mà khách thật sự nêu ra khi từ chối bạn là gì? Nếu chưa biết, ghi tên năm người bạn sẽ gọi để hỏi trong tuần này.',
      'Với mỗi tiêu chí đó, bạn có bằng chứng công khai nào về vị trí của đối thủ? Ghi nguồn và ngày kiểm.',
      'Điểm thua nào bạn quyết định không đuổi theo, và bạn sẽ nói câu gì với khách khi họ hỏi về điểm đó?',
    ],
    exercises: [
      {
        label: 'Bản đồ lựa chọn thay thế',
        text: 'Vẽ một trang liệt kê mọi phương án khách có thể chọn thay vì bạn, chia làm ba nhóm: đối thủ trực tiếp, cách làm thủ công, và không làm gì. Ước lượng tỷ lệ khách đang ở mỗi nhóm dựa trên các cuộc trò chuyện gần nhất.',
        level: 'e',
      },
      {
        label: 'Đọc trang tuyển dụng',
        text: 'Xem trang tuyển dụng của ba đối thủ, ghi lại các vị trí họ đang tuyển và suy ra hướng đầu tư sáu tháng tới của họ. So với hướng đầu tư của chính bạn và ghi chỗ khác biệt.',
        level: 'e',
      },
      {
        label: 'Mười đánh giá tiêu cực',
        text: 'Đọc mười đánh giá một hoặc hai sao của đối thủ trên nền tảng công khai, gom thành các nhóm than phiền. Đánh dấu nhóm nào bạn đang làm tốt hơn và có bằng chứng để chứng minh.',
        level: 'e',
      },
      {
        label: 'Gọi cho người đã từ chối',
        text: 'Gọi cho bảy khách hàng đã hỏi thông tin nhưng không mua trong ba tháng qua. Hỏi đúng hai câu: cuối cùng anh chị chọn phương án nào, và điều gì khiến phương án đó thắng. Ghi nguyên văn.',
        level: 'm',
      },
      {
        label: 'Bảng so sánh có nguồn',
        text: 'Dựng bảng năm tiêu chí lấy từ lời khách, ba cột đối thủ, mỗi ô kèm nguồn và ngày kiểm. Bắt buộc phải có ít nhất hai ô bạn thua, nếu không thì tiêu chí đang bị chọn thiên vị.',
        level: 'm',
      },
      {
        label: 'Mua thử của đối thủ',
        text: 'Với tư cách khách hàng thật và công khai danh tính khi được hỏi, trải nghiệm trọn quy trình mua của một đối thủ. Ghi thời gian từng bước và ba khoảnh khắc bạn thấy dễ chịu hơn quy trình của mình.',
        level: 'm',
      },
      {
        label: 'Ba dòng nước đi',
        text: 'Từ toàn bộ dữ liệu trên, viết đúng ba dòng: khoảng trống ta chiếm, điểm thua phải vá gấp, điểm thua cố ý bỏ qua. Trình bày cho người phụ trách bán hàng và ghi lại chỗ họ phản đối.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: theo dõi có kỷ luật',
        text: 'Bảy ngày, mỗi ngày dành mười lăm phút cho một đối thủ và một nguồn: hôm nay trang giá, mai nội dung mới, kia đánh giá khách. Ngày thứ bảy tổng hợp thành một trang và chỉ giữ lại những thay đổi có khả năng ảnh hưởng tới tiêu chí khách dùng để quyết định, bỏ hết phần còn lại.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao "không làm gì cả" phải được xem là một đối thủ?',
        a: 'Vì trong phần lớn giao dịch, thứ khách hàng thật sự cân nhắc không phải là chọn bạn hay chọn công ty khác, mà là có nên thay đổi hiện trạng hay không. Sức ì có chi phí bằng không, không cần thuyết phục ai trong nội bộ và không mang rủi ro mất mặt nếu sai. Nếu bạn chỉ chuẩn bị lập luận để thắng đối thủ cùng ngành, bạn sẽ không có gì để nói khi khách trả lời rằng hiện tại họ vẫn xoay được bằng cách cũ.',
      },
      {
        q: 'Vì sao dữ liệu quý nhất nằm ở khách đã từ chối chứ không ở khách đang hài lòng?',
        a: 'Vì khách đang dùng bạn là nhóm đã qua bộ lọc: họ chấp nhận được mọi nhược điểm của bạn, nếu không họ đã đi rồi. Hỏi họ chỉ củng cố những gì bạn đang làm đúng. Người đã hỏi rồi bỏ đi nắm chính xác tiêu chí khiến cán cân nghiêng, và họ thường sẵn sàng nói vì không còn ràng buộc gì. Cuộc gọi này khó chịu nên hiếm ai làm, đó cũng là lý do nó còn nhiều thông tin chưa ai lấy.',
      },
      {
        q: 'Ranh giới nào phân biệt nghiên cứu đối thủ hợp pháp với hành vi không chấp nhận được?',
        a: 'Nghiên cứu hợp pháp dựa trên thông tin công khai hoặc thông tin bạn thu được với tư cách khách hàng thật và không che giấu danh tính khi được hỏi. Vượt ranh giới là giả danh để moi tài liệu nội bộ, dụ nhân sự đối thủ tiết lộ bí mật kinh doanh, hay dùng thông tin thu được từ người vi phạm cam kết bảo mật của họ. Ngoài rủi ro pháp lý, các hành vi này còn tạo tiền lệ nội bộ rất khó gỡ; khi có nghi ngờ, hãy hỏi bộ phận pháp chế trước khi hành động.',
      },
    ],
    plan7:
      'Ngày 1: viết công việc khách cần hoàn thành và bản đồ lựa chọn thay thế. Ngày 2: đọc trang giá và trang tuyển dụng của ba đối thủ. Ngày 3: đọc và phân nhóm hai mươi đánh giá công khai của họ. Ngày 4: gọi bốn khách đã từ chối, ghi nguyên văn lý do. Ngày 5: gọi thêm ba người và bắt đầu dựng bảng tiêu chí lấy từ lời khách. Ngày 6: hoàn thiện bảng so sánh có nguồn, buộc mình ghi nhận ít nhất hai ô thua. Ngày 7: viết ba dòng nước đi và trình bày cho người bán hàng để lấy phản biện.',
    evidence:
      'Bằng chứng cụ thể ở đây là một trang so sánh cạnh tranh còn sống: mỗi ô có nguồn công khai và ngày kiểm, kèm nhật ký thay đổi theo tháng. Đi kèm là bộ ghi chép các cuộc gọi cho khách đã từ chối, trong đó thấy rõ tiêu chí quyết định được rút ra từ nguyên văn lời họ chứ không do bạn suy diễn. Trong phỏng vấn, câu chuyện mạnh nhất là một lần phân tích đối thủ khiến công ty bạn quyết định không làm điều đang định làm — vì nó chứng tỏ nghiên cứu của bạn có sức nặng thật với quyết định. Trong CV: "Phỏng vấn 18 khách hàng từ chối, xác định giờ học là tiêu chí quyết định thay vì giáo trình; mở ca sớm và lấp đầy 2 lớp trong 6 tuần mà không tăng chi phí giáo trình".',
    references: [
      { label: 'Harvard Business Review — chuyên mục Competitive strategy', url: 'https://hbr.org/topic/subject/competitive-strategy', type: 'article' },
      { label: 'HubSpot Blog — mục Marketing, bài hướng dẫn phân tích cạnh tranh', url: 'https://blog.hubspot.com/marketing', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 3 — Định vị — Positioning
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Định vị là quyết định về ngữ cảnh: bạn muốn khách xếp bạn vào loại nào trong đầu họ, so với những gì, và vì sao trong loại đó bạn là lựa chọn hiển nhiên. Nó không phải một câu khẩu hiệu hay do phòng marketing nghĩ ra, mà là một chuỗi lựa chọn có mất mát — chọn phục vụ nhóm này nghĩa là chấp nhận kém hấp dẫn với nhóm khác. Dấu hiệu định vị đã có hiệu lực là khi khách tự mô tả bạn cho người khác gần đúng cách bạn muốn được mô tả, và khi đội bán hàng biết rõ đơn nào nên từ chối.',
    why: {
      work: 'Khi định vị mờ, mọi thứ phía sau đều tốn hơn: quảng cáo phải nói nhiều hơn mới đủ hiểu, đội bán phải giải thích lại từ đầu ở mỗi cuộc gọi, sản phẩm bị kéo về mọi hướng vì khách nào cũng có vẻ đúng. Một quyết định định vị rõ ràng làm giảm chi phí ở tất cả các khâu đó cùng lúc.',
      interview:
        'Câu hỏi "sản phẩm của công ty bạn khác gì đối thủ" là bài kiểm tra định vị trá hình. Ứng viên nói được thị trường tham chiếu, nhóm khách được ưu tiên và điều gì bị cố ý hy sinh sẽ tạo ấn tượng khác hẳn người trả lời rằng sản phẩm mình toàn diện và phù hợp với mọi doanh nghiệp.',
      study:
        'Trong bài tập tình huống, sinh viên hay viết đối tượng mục tiêu là mọi người từ 18 đến 45 tuổi. Việc bắt mình chọn hẹp và viết ra cái giá phải trả cho lựa chọn hẹp đó là bài luyện tư duy đánh đổi, thứ mà mọi vị trí quản lý sau này đều yêu cầu.',
      life: 'Người làm nghề tự do định vị mờ thì phải cạnh tranh bằng giá với tất cả mọi người. Chọn một loại việc, một loại khách và một lý do để được chọn là cách hiệu quả nhất để thoát khỏi cuộc đua hạ giá mà không cần giỏi hơn ai về chuyên môn.',
    },
    framework: [
      {
        name: 'Liệt kê lựa chọn thay thế thật',
        detail:
          'Ghi ra thứ khách sẽ dùng nếu bạn biến mất ngày mai. Danh sách này quyết định thị trường tham chiếu, và thường không trùng với danh sách đối thủ mà nội bộ hay nhắc tới trong các buổi họp.',
      },
      {
        name: 'Tìm thuộc tính bạn có mà lựa chọn kia không có',
        detail:
          'Chỉ giữ những thuộc tính khách kiểm chứng được: bạn xuất hoá đơn trong ngày, bạn có kỹ thuật viên tới tận nơi trong hai giờ, bạn kết nối được với phần mềm kế toán họ đang dùng. Bỏ hết các tính từ như tận tâm, chuyên nghiệp, uy tín, vì đối thủ cũng viết đúng những chữ đó.',
      },
      {
        name: 'Dịch thuộc tính thành giá trị đo được',
        detail:
          'Mỗi thuộc tính phải trả lời "vậy thì sao" ít nhất một lần: kết nối phần mềm kế toán nghĩa là kế toán không phải nhập tay lại cuối tháng, tiết kiệm khoảng một buổi làm việc mỗi tháng. Nếu bạn không dịch được sang thứ khách cảm nhận được thì thuộc tính đó chưa dùng được để định vị.',
      },
      {
        name: 'Xác định ai quan tâm nhất tới giá trị đó',
        detail:
          'Nhóm khách nào mà giá trị này là quan trọng bậc nhất chứ không phải điểm cộng nhỏ? Nhìn vào tệp khách hiện có, tìm nhóm mua nhanh nhất, ít mặc cả nhất và ở lại lâu nhất, rồi mô tả đặc điểm chung có thể nhận diện từ bên ngoài.',
      },
      {
        name: 'Chọn thị trường tham chiếu và viết ra cái giá phải trả',
        detail:
          'Đặt tên loại mà bạn muốn được xếp vào, đủ quen để khách hiểu ngay, đủ hẹp để bạn là lựa chọn hiển nhiên. Viết kèm một dòng về nhóm khách bạn sẽ mất hoặc kém hấp dẫn với họ; định vị nào không mất gì thì thường là định vị chưa xảy ra.',
      },
    ],
    scenario:
      'Một nhóm bốn người làm phần mềm quản lý phòng khám suốt hai năm với thông điệp "giải pháp quản lý phòng khám toàn diện". Chu kỳ bán kéo dài, khách hỏi đủ thứ tính năng trái ngược nhau, và tỷ lệ thắng thấp. Khi rà lại ba mươi khách hiện có, họ thấy nhóm ở lại lâu nhất và ít yêu cầu tuỳ biến nhất đều là phòng khám nha khoa có hai tới năm ghế, vì phần mềm sẵn có sơ đồ răng và lịch tái khám theo liệu trình. Họ đổi cách tự giới thiệu thành phần mềm cho phòng khám nha khoa hai tới năm ghế, viết lại trang chủ quanh hai việc là quản lý liệu trình và nhắc tái khám, và ngừng theo đuổi bệnh viện đa khoa. Ba tháng sau, số buổi demo giảm nhưng tỷ lệ chuyển từ demo sang hợp đồng tăng rõ, thời gian mỗi buổi demo rút ngắn vì khách nhận ra ngôn ngữ nghề của chính mình, và đội ngũ ngừng tranh cãi về việc có làm module dược cho bệnh viện hay không.',
    comparison: [
      {
        weak: 'Mô tả sản phẩm là giải pháp toàn diện phù hợp với mọi quy mô doanh nghiệp.',
        mature: 'Nêu rõ loại khách được phục vụ tốt nhất và nói thẳng loại khách nào nên tìm giải pháp khác, kể cả khi điều đó làm hẹp phễu.',
      },
      {
        weak: 'Định vị bằng tính từ: tận tâm, hiện đại, chuyên nghiệp, uy tín hàng đầu.',
        mature: 'Định vị bằng thuộc tính kiểm chứng được và hệ quả đo được của thuộc tính đó đối với công việc hằng ngày của khách.',
      },
      {
        weak: 'Đổi thông điệp mỗi quý theo chiến dịch mới, hoặc theo yêu cầu của khách lớn vừa gặp.',
        mature: 'Giữ một định vị đủ lâu để thị trường kịp học, chỉ xem xét lại khi có tín hiệu rõ rằng nhóm khách lõi đã đổi hoặc lựa chọn thay thế đã đổi.',
      },
    ],
    mistakes: [
      'Nhầm định vị với khẩu hiệu, nên tổ chức một buổi nghĩ câu chữ thật kêu rồi treo lên tường, trong khi những quyết định thật về việc từ chối nhóm khách nào và ưu tiên tính năng nào vẫn diễn ra như cũ.',
      'Chọn thị trường tham chiếu quá lạ để tránh bị so sánh, ví dụ tự nhận là một loại hình hoàn toàn mới; hậu quả là khách không biết xếp bạn vào đâu, không biết ngân sách nào chi trả cho bạn và không biết so bạn với cái gì để thấy bạn đáng giá.',
      'Định vị dựa trên điều mình muốn trở thành thay vì điều mình đã chứng minh được, khiến đội bán hàng phải hứa những thứ sản phẩm chưa làm được và tạo ra làn sóng khách rời đi sau vài tháng.',
    ],
    worksheet: [
      'Nếu sản phẩm hoặc dịch vụ của bạn biến mất ngày mai, khách sẽ dùng gì thay thế? Liệt kê ba phương án cụ thể, có tên.',
      'Bạn có thuộc tính nào mà cả ba phương án đó đều không có, và khách kiểm chứng được nó bằng cách nào trong vòng một tuần dùng thử?',
      'Dịch thuộc tính đó sang một hệ quả đo được trong công việc của khách. Viết bằng một câu có đơn vị: giờ, đồng, số lần, ngày.',
      'Trong tệp khách hiện có, nhóm nào mua nhanh nhất và ở lại lâu nhất? Ba đặc điểm nhận diện được từ bên ngoài của nhóm đó là gì?',
      'Viết một dòng về nhóm khách mà định vị mới sẽ khiến bạn kém hấp dẫn. Bạn chấp nhận mất bao nhiêu phần doanh thu hiện tại cho lựa chọn này?',
    ],
    exercises: [
      {
        label: 'Danh sách thay thế',
        text: 'Hỏi năm khách hàng hiện tại câu duy nhất: trước khi chọn chúng tôi, anh chị đã cân nhắc hoặc đang dùng cái gì. Ghi nguyên văn và so với danh sách đối thủ mà nội bộ vẫn nhắc tới.',
        level: 'e',
      },
      {
        label: 'Cắt tính từ',
        text: 'Lấy trang giới thiệu hiện tại của bạn, gạch bỏ mọi tính từ khen ngợi không kiểm chứng được. Đọc lại phần còn lại và ghi nhận nó còn nói được điều gì cụ thể.',
        level: 'e',
      },
      {
        label: 'Vậy thì sao ba lần',
        text: 'Chọn ba tính năng bạn hay nhắc nhất, với mỗi tính năng tự hỏi "vậy thì sao" ba lần liên tiếp cho tới khi ra một hệ quả có đơn vị đo. Ghi lại tính năng nào không chịu nổi ba lần hỏi.',
        level: 'e',
      },
      {
        label: 'Phân nhóm khách hiện có',
        text: 'Lập bảng toàn bộ khách hàng đang có, thêm ba cột: thời gian từ lần gặp đầu tới lúc chốt, mức chiết khấu đã cho, và thời gian đã gắn bó. Sắp xếp và tìm đặc điểm chung của mười khách đứng đầu.',
        level: 'm',
      },
      {
        label: 'Thử tên loại',
        text: 'Viết ba cách tự giới thiệu dùng ba thị trường tham chiếu khác nhau. Nói từng cách cho năm người ngoài ngành và hỏi họ đoán bạn bán cho ai, giá khoảng bao nhiêu. Giữ cách nào tạo ra ít câu hỏi làm rõ nhất.',
        level: 'm',
      },
      {
        label: 'Viết ra cái giá',
        text: 'Với định vị bạn đang nghiêng về, viết một trang liệt kê những gì sẽ mất: nhóm khách nào không còn phù hợp, tính năng nào ngừng phát triển, kênh nào ngừng đầu tư. Trình bày cho người phụ trách doanh thu.',
        level: 'm',
      },
      {
        label: 'Kiểm chứng bằng lời khách',
        text: 'Nhờ bảy khách hàng mô tả sản phẩm của bạn cho một người bạn của họ, ghi âm khi được phép. Đếm bao nhiêu người dùng đúng thị trường tham chiếu bạn muốn, bao nhiêu người tự nghĩ ra loại khác.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: một câu định vị sống',
        text: 'Bảy ngày, mỗi ngày dùng cùng một câu tự giới thiệu cho một người khác nhau trong nhóm khách mục tiêu và ghi lại câu hỏi đầu tiên họ đặt sau khi nghe. Ngày thứ bảy gom các câu hỏi đó: câu nào lặp lại nhiều nhất chính là lỗ hổng của định vị hiện tại, sửa đúng lỗ hổng đó rồi chốt phiên bản dùng trong quý.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao một định vị "không mất gì" gần như chắc chắn là định vị chưa xảy ra?',
        a: 'Vì định vị là hành động chọn ngữ cảnh và chọn nhóm khách được ưu tiên, mà mọi ưu tiên đều kéo theo việc xếp thứ khác xuống sau. Nếu sau khi chọn xong bạn vẫn phục vụ đúng mọi nhóm như cũ, vẫn làm mọi tính năng như cũ và vẫn nói đúng những điều như cũ, thì thứ đã đổi chỉ là câu chữ trên trang chủ. Cách kiểm nhanh là hỏi đội bán hàng: từ hôm nay chúng ta từ chối loại đơn nào. Không trả lời được nghĩa là chưa có định vị.',
      },
      {
        q: 'Vì sao chọn thị trường tham chiếu quá mới lạ lại nguy hiểm hơn chọn một loại đã quen?',
        a: 'Vì khách hàng hiểu cái mới bằng cách so với cái họ đã biết. Khi bạn tự nhận là một loại hình chưa từng có, người nghe không biết đặt bạn cạnh cái gì, không biết mức giá nào là hợp lý, và trong tổ chức thì không có dòng ngân sách nào sẵn để chi cho bạn. Cách an toàn hơn là nhận một loại quen thuộc để được so sánh và được cấp ngân sách, rồi giành vị trí dẫn đầu trong một lát cắt hẹp của loại đó.',
      },
      {
        q: 'Bao lâu nên xem lại định vị một lần?',
        a: 'Không theo lịch cố định mà theo tín hiệu. Ba tín hiệu đáng xem lại là: danh sách lựa chọn thay thế mà khách nhắc tới đã đổi hẳn; nhóm khách gắn bó lâu nhất không còn là nhóm bạn đang nhắm; hoặc đội bán hàng liên tục phải giải thích lại từ đầu bạn là ai ở mỗi cuộc gọi. Đổi định vị theo quý làm thị trường không kịp học và xoá sạch phần trí nhớ mà bạn đã tốn tiền để tạo ra.',
      },
    ],
    plan7:
      'Ngày 1: hỏi năm khách về lựa chọn thay thế họ từng cân nhắc. Ngày 2: gạch tính từ khỏi toàn bộ trang giới thiệu và trang giá. Ngày 3: chạy bài tập vậy thì sao cho ba tính năng chủ lực. Ngày 4: phân nhóm tệp khách hiện có theo tốc độ chốt và thời gian gắn bó. Ngày 5: viết ba phiên bản thị trường tham chiếu và thử với năm người ngoài ngành. Ngày 6: viết trang cái giá phải trả và bàn với người phụ trách doanh thu. Ngày 7: chốt một câu định vị, cập nhật trang chủ và tài liệu bán hàng cho khớp, hẹn ngày kiểm lại sau một quý.',
    evidence:
      'Bằng chứng ở đây là một tài liệu định vị một trang có ngày tháng và có phần ghi rõ điều bị hy sinh, kèm ảnh chụp trang chủ trước và sau. Mạnh hơn nữa là bảng theo dõi hệ quả: tỷ lệ chuyển từ buổi tư vấn sang hợp đồng, độ dài chu kỳ bán, mức chiết khấu trung bình trước và sau khi đổi định vị. Trong phỏng vấn, hãy kể được nhóm khách bạn đã chủ động từ chối và vì sao — đây là chi tiết mà người chỉ đọc lý thuyết không bao giờ có. Trong CV: "Thu hẹp định vị từ phần mềm phòng khám nói chung sang phòng khám nha khoa 2-5 ghế; rút ngắn chu kỳ bán và nâng tỷ lệ chốt sau demo trong 1 quý".',
    references: [
      { label: 'April Dunford — tài liệu và bài viết về positioning cho sản phẩm B2B', url: 'https://www.aprildunford.com/', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Marketing', url: 'https://hbr.org/topic/subject/marketing', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 4 — Xây dựng thương hiệu — Branding
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Thương hiệu là tổng số ký ức mà người ngoài có về bạn, và ký ức đó được tạo ra bởi hành vi lặp lại nhiều hơn là bởi logo. Một lời hứa được giữ đúng ở mọi điểm chạm trong hai năm tạo ra thương hiệu; một bộ nhận diện đẹp gắn lên một dịch vụ thất hứa chỉ làm cho sự thất hứa dễ nhớ hơn. Vì vậy công việc xây thương hiệu bắt đầu ở chỗ chọn một lời hứa đủ hẹp để giữ được, rồi thiết kế quy trình bảo đảm nó được giữ kể cả vào ngày bận nhất.',
    why: {
      work: 'Thương hiệu mạnh làm giảm chi phí ở khâu bán: khách đã nghe tên thì cần ít bằng chứng hơn để tin, chấp nhận mức giá cao hơn chút và tha thứ cho một lần sai sót. Đó là tài sản tích luỹ chậm, nhưng cũng là tài sản mất rất nhanh nếu lời hứa bị phá vài lần liên tiếp trong thời gian ngắn.',
      interview:
        'Ứng viên marketing hay bị hỏi về thương hiệu và thường trả lời quanh màu sắc, font chữ, cảm hứng. Người có nghề nói được lời hứa cốt lõi, các điểm chạm mà lời hứa đó dễ vỡ nhất, và cách họ đã dựng quy trình để giữ nó — đó là câu trả lời của người đã làm thật.',
      study:
        'Khi phân tích một thương hiệu trong bài tập, phần dễ là mô tả nhận diện, phần khó và đáng học là truy xem hành vi nào của doanh nghiệp đã tạo ra liên tưởng trong đầu người tiêu dùng. Tập truy ngược từ liên tưởng về hành vi là cách học marketing sâu hơn là học thuộc mô hình.',
      life: 'Với người làm nghề tự do hay chủ tiệm nhỏ, thương hiệu cá nhân chính là câu người khác nói về bạn khi bạn không có mặt. Chọn một điều để nhất quán, ví dụ luôn báo trước khi trễ, thường tạo ra nhiều lượt giới thiệu hơn mọi nỗ lực quảng bá.',
    },
    framework: [
      {
        name: 'Chọn một lời hứa hẹp và giữ được',
        detail:
          'Một câu duy nhất, kiểm chứng được, và bạn dám cam kết ngay cả vào lúc quá tải. Ví dụ giao đúng ngày đã hẹn hoặc miễn phí vận chuyển lần sau, thay vì chất lượng cao và giá tốt nhất thị trường.',
      },
      {
        name: 'Liệt kê điểm chạm và tìm chỗ lời hứa dễ vỡ',
        detail:
          'Đi hết hành trình từ lúc khách nghe tên bạn tới lúc dùng xong và cần hỗ trợ. Đánh dấu ba điểm mà lời hứa dễ bị phá nhất, thường là lúc quá tải, lúc bàn giao giữa hai bộ phận, và lúc có sự cố ngoài dự kiến.',
      },
      {
        name: 'Biến lời hứa thành quy trình có người chịu trách nhiệm',
        detail:
          'Mỗi điểm dễ vỡ cần một thao tác bắt buộc và một cái tên: ai gọi báo khách khi biết sẽ trễ, chậm nhất bao lâu sau khi biết. Lời hứa không gắn với thao tác thì chỉ tồn tại trong tài liệu nội bộ.',
      },
      {
        name: 'Dựng bộ nhận diện tối thiểu và dùng nhất quán',
        detail:
          'Một logo dùng được ở kích thước nhỏ, một bảng màu, một cặp phông chữ, một giọng văn có ví dụ đúng và sai. Ít mà dùng đều đặn tạo nhận biết nhanh hơn nhiều so với nhiều mà mỗi nơi một kiểu.',
      },
      {
        name: 'Đo nhận biết và liên tưởng bằng lời khách',
        detail:
          'Định kỳ hỏi khách hai câu: anh chị biết tới chúng tôi qua đâu, và nếu phải mô tả chúng tôi bằng ba từ thì là ba từ nào. Ba từ đó là thước đo trực tiếp nhất cho việc lời hứa đã vào được trí nhớ chưa.',
      },
    ],
    scenario:
      'Một xưởng đồ gỗ nội thất mười hai thợ nhận đơn qua giới thiệu và mạng xã hội, tự mô tả mình là xưởng gỗ giá tốt. Cạnh tranh về giá liên tục kéo biên lợi nhuận xuống, và những đơn thắng nhờ giá rẻ lại hay bị đòi chỉnh sửa. Chủ xưởng rà lại một năm đơn hàng và thấy điều khách phàn nàn nhiều nhất không phải giá mà là trễ hẹn giao. Anh đổi lời hứa thành đúng hẹn hoặc giảm năm phần trăm giá trị đơn, kèm ba thao tác bắt buộc: chốt ngày giao sau khi trưởng xưởng xác nhận năng lực tuần đó, gọi báo khách trong vòng hai mươi bốn giờ kể từ khi phát hiện nguy cơ trễ, và gửi ảnh tiến độ vào giữa chặng. Sáu tháng sau, số đơn phải bồi hoàn còn rất ít, xưởng giữ được mức giá cao hơn mặt bằng khu vực, và phần lớn khách mới đến nói lý do là được người quen nói rằng xưởng này giao đúng hẹn.',
    comparison: [
      {
        weak: 'Bắt đầu xây thương hiệu bằng việc thuê thiết kế logo và bộ nhận diện trước khi biết mình hứa điều gì.',
        mature: 'Chốt lời hứa và quy trình giữ lời hứa trước, thiết kế nhận diện sau để bao lấy điều đã có thật.',
      },
      {
        weak: 'Hứa nhiều thứ cùng lúc: rẻ nhất, nhanh nhất, chất lượng cao nhất, phục vụ tận tình nhất.',
        mature: 'Hứa một điều hẹp có thể kiểm chứng và giữ được vào ngày bận nhất, các điều còn lại chỉ ở mức đủ tốt và nói thật về mức đó.',
      },
      {
        weak: 'Coi khủng hoảng nhỏ là chuyện phải giấu, im lặng chờ khách quên.',
        mature: 'Coi lần xử lý sự cố là điểm chạm tạo ký ức mạnh nhất: thừa nhận nhanh, nêu việc đang làm, và bù đắp theo đúng cam kết đã công bố.',
      },
    ],
    mistakes: [
      'Đồng nhất thương hiệu với bộ nhận diện, nên khi doanh số giảm thì phản ứng đầu tiên là làm lại logo, trong khi nguyên nhân nằm ở việc giao hàng trễ hoặc nhân viên đổi cách trả lời khách.',
      'Đổi giọng và đổi hứa hẹn theo từng chiến dịch để chạy theo xu hướng, làm cho ký ức của khách không tích luỹ được và mỗi đợt truyền thông lại phải bắt đầu từ con số không.',
      'Xây thương hiệu hướng vào việc gây ấn tượng với người trong ngành và giới quảng cáo thay vì với người sẽ trả tiền, dẫn tới những chiến dịch được khen sáng tạo nhưng không ai nhớ nổi doanh nghiệp bán cái gì.',
    ],
    worksheet: [
      'Viết lời hứa hiện tại của bạn bằng một câu mà khách có thể kiểm chứng đúng hay sai sau một lần mua.',
      'Đi qua hành trình khách hàng và đánh dấu ba thời điểm lời hứa đó dễ bị phá nhất. Chuyện gì thường xảy ra ở mỗi thời điểm?',
      'Với mỗi thời điểm, ai là người chịu trách nhiệm và thao tác bắt buộc của họ là gì? Ghi kèm mốc thời gian tối đa.',
      'Nếu hỏi mười khách gần nhất mô tả bạn bằng ba từ, bạn đoán ba từ nào xuất hiện nhiều nhất? Bạn muốn ba từ nào?',
      'Bộ nhận diện của bạn hiện đang bị dùng khác nhau ở những nơi nào? Liệt kê các nơi và chọn một nơi để sửa trước.',
    ],
    exercises: [
      {
        label: 'Một câu hứa',
        text: 'Viết ba phiên bản lời hứa cho doanh nghiệp hoặc dịch vụ của bạn, mỗi phiên bản phải kiểm chứng được đúng sai. Loại bỏ phiên bản nào bạn không dám cam kết vào tuần bận nhất trong năm.',
        level: 'e',
      },
      {
        label: 'Bản đồ điểm chạm',
        text: 'Vẽ toàn bộ hành trình khách hàng thành các ô, từ lần nghe tên đầu tiên tới sau khi dùng xong. Đánh dấu ô nào bạn chưa từng kiểm tra chất lượng lần nào.',
        level: 'e',
      },
      {
        label: 'Ba từ của khách',
        text: 'Nhắn cho mười khách hàng cũ, hỏi đúng một câu: nếu mô tả chúng tôi cho bạn bè bằng ba từ, anh chị sẽ dùng ba từ nào. Ghi lại và đếm tần suất từng từ.',
        level: 'e',
      },
      {
        label: 'Kiểm nhất quán nhận diện',
        text: 'Thu thập mười vật phẩm mang thương hiệu của bạn: biển hiệu, hoá đơn, bao bì, ảnh đại diện, chữ ký email, mẫu tin nhắn. Xếp cạnh nhau và ghi ra chỗ nào lệch màu, lệch logo, lệch giọng văn.',
        level: 'm',
      },
      {
        label: 'Quy trình cho điểm dễ vỡ',
        text: 'Chọn điểm chạm mà lời hứa hay vỡ nhất, viết quy trình một trang gồm điều kiện kích hoạt, người chịu trách nhiệm, thao tác, và mốc thời gian. Chạy thử hai tuần và đếm số lần quy trình được kích hoạt đúng.',
        level: 'm',
      },
      {
        label: 'Sổ tay giọng nói',
        text: 'Viết một trang hướng dẫn giọng văn gồm ba nguyên tắc và sáu cặp ví dụ nên viết thế này thay vì thế kia, lấy từ chính tin nhắn thật của bạn với khách. Gửi cho người trực kênh chat và nhờ họ dùng thử.',
        level: 'm',
      },
      {
        label: 'Diễn tập sự cố',
        text: 'Giả định một sự cố thật có thể xảy ra với bạn, viết kịch bản phản ứng trong hai mươi bốn giờ đầu: ai nói, nói ở đâu, nói gì, bù đắp ra sao. Đưa cho hai đồng nghiệp phản biện và sửa lại.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: giữ đúng một lời hứa',
        text: 'Bảy ngày, chọn đúng một lời hứa nhỏ và giữ nó không sai lần nào ở mọi giao dịch, ví dụ trả lời mọi tin nhắn khách trong vòng hai giờ giờ hành chính. Mỗi ngày ghi số lần giữ được, số lần suýt vỡ và nguyên nhân. Ngày thứ bảy quyết định lời hứa này có thể trở thành cam kết công khai hay cần sửa lại phạm vi.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao thay logo hiếm khi cứu được một thương hiệu đang mất khách?',
        a: 'Vì logo chỉ là nhãn dán lên tập ký ức đã có; đổi nhãn không đổi ký ức. Nếu khách rời đi vì giao trễ hoặc vì nhân viên trả lời cộc lốc, bộ nhận diện mới chỉ làm họ mất thêm một nhịp để nhận ra vẫn là chỗ cũ. Đổi nhận diện có ích khi nó đi kèm và đánh dấu một thay đổi thật trong hành vi phục vụ, và khi đó điều cần truyền thông là thay đổi hành vi, còn nhận diện chỉ là dấu hiệu nhận biết.',
      },
      {
        q: 'Vì sao hứa hẹp lại tạo thương hiệu mạnh hơn hứa nhiều?',
        a: 'Vì trí nhớ con người lưu được rất ít về một cái tên xa lạ, và một lời hứa duy nhất được lặp lại có cơ hội chiếm được ô nhớ đó. Hứa nhiều thứ cùng lúc khiến không điều nào đủ nổi bật để được nhớ, đồng thời làm tăng số cách để bạn thất hứa, mà mỗi lần thất hứa lại xoá đi nhiều hơn phần một lần giữ lời tạo ra. Hẹp cũng dễ thiết kế quy trình bảo vệ hơn, nên khả năng giữ được cao hơn hẳn.',
      },
      {
        q: 'Có thể đo thương hiệu bằng cách nào khi chưa có ngân sách nghiên cứu?',
        a: 'Ba phép đo rẻ và làm được ngay. Thứ nhất, hỏi mọi khách mới câu biết tới chúng tôi qua đâu và ghi lại nguyên văn, tỷ lệ được người quen giới thiệu là chỉ báo tốt. Thứ hai, hỏi ba từ mô tả và theo dõi ba từ đó đổi thế nào qua từng quý. Thứ ba, đếm số lần tên bạn được nhắc tự nhiên trong các nhóm cộng đồng nghề mà bạn không chủ động can thiệp. Ba phép đo này không thay được nghiên cứu bài bản nhưng đủ để phát hiện xu hướng sớm.',
      },
    ],
    plan7:
      'Ngày 1: viết ba phiên bản lời hứa và chọn một. Ngày 2: vẽ bản đồ điểm chạm và đánh dấu ba chỗ dễ vỡ. Ngày 3: viết quy trình cho chỗ dễ vỡ nhất, gán tên người chịu trách nhiệm. Ngày 4: nhắn hỏi mười khách cũ về ba từ mô tả. Ngày 5: kiểm nhất quán mười vật phẩm mang nhận diện và sửa hai chỗ lệch nặng nhất. Ngày 6: viết một trang sổ tay giọng nói với sáu cặp ví dụ. Ngày 7: công bố lời hứa với đội ngũ, dán quy trình ở nơi làm việc và hẹn ngày kiểm lại sau một tháng.',
    evidence:
      'Bằng chứng dùng được là bộ hồ sơ ba phần: tài liệu lời hứa kèm quy trình bảo vệ có tên người chịu trách nhiệm, bộ nhận diện tối thiểu và sổ tay giọng nói do bạn viết, và bảng theo dõi ba từ mô tả của khách theo từng quý. Trong phỏng vấn, hãy mang theo ví dụ trước và sau của cùng một điểm chạm — chẳng hạn mẫu tin nhắn báo trễ hẹn cũ và mới — và kể lại số lần sự cố được xử lý theo quy trình mới. Trong CV, viết: "Chuẩn hoá cam kết đúng hẹn và quy trình báo trước cho xưởng 12 người, giảm số đơn phải bồi hoàn và giữ được mức giá cao hơn mặt bằng khu vực trong 6 tháng".',
    references: [
      { label: 'Interbrand — phương pháp đánh giá và quản trị thương hiệu', url: 'https://interbrand.com/', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Brand management', url: 'https://hbr.org/topic/subject/brand-management', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 5 — Viết thông điệp sản phẩm
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Thông điệp sản phẩm là bản dịch từ ngôn ngữ của người xây sản phẩm sang ngôn ngữ của người phải sống với vấn đề. Nó khác định vị ở chỗ định vị quyết định bạn là ai trong đầu khách, còn thông điệp quyết định những câu cụ thể mà mọi người trong công ty sẽ nói ra để điều đó xảy ra. Một bộ thông điệp tốt kiểm được bằng phép thử đơn giản: đưa cho ba người ở ba phòng ban khác nhau, nếu họ giới thiệu sản phẩm bằng ba luận điểm khác hẳn nhau thì bộ thông điệp chưa tồn tại, dù tài liệu đã được duyệt.',
    why: {
      work: 'Không có bộ thông điệp chung thì mỗi bài đăng, mỗi email, mỗi cuộc gọi lại nói một kiểu, và khách gặp bạn ở ba nơi sẽ nhận ba ấn tượng rời rạc. Chi phí này không hiện ra trên báo cáo nào cả, nó ẩn trong việc phải giải thích lại từ đầu ở mỗi lần tiếp xúc.',
      interview:
        'Ở vị trí marketing sản phẩm, bài tập thường gặp khi phỏng vấn là viết lại trang giới thiệu cho một sản phẩm có sẵn. Người nắm nghề sẽ hỏi ngược về nhóm khách ưu tiên và bằng chứng có sẵn trước khi viết chữ nào, còn người chưa có nghề bắt tay vào viết câu hay ngay lập tức.',
      study:
        'Tập viết cùng một sản phẩm cho ba nhóm người đọc khác nhau là bài luyện tư duy đối tượng rất mạnh; nó buộc bạn tách phần dữ kiện không đổi ra khỏi phần diễn đạt thay đổi, kỹ năng dùng được cả trong viết luận lẫn thuyết trình.',
      life: 'Khi bạn cần thuyết phục gia đình về một quyết định lớn, hay giới thiệu dịch vụ của mình cho người lạ trong ba mươi giây, bạn đang làm đúng việc này: chọn một luận điểm chính, hai bằng chứng, và một lời mời hành động rõ ràng.',
    },
    framework: [
      {
        name: 'Thu ngôn ngữ gốc của khách',
        detail:
          'Gom lại nguyên văn cách khách mô tả vấn đề: câu trong email hỗ trợ, ghi âm cuộc gọi bán hàng, bình luận trên mạng. Thông điệp mạnh gần như luôn được ghép từ những cụm chữ khách đã tự dùng, không phải từ cụm chữ do nội bộ sáng tác.',
      },
      {
        name: 'Chốt một câu giá trị cốt lõi',
        detail:
          'Một câu trả lời được ba điều: dành cho ai, giúp họ đạt kết quả gì, và khác lựa chọn hiện tại của họ ở chỗ nào. Câu này là trần của toàn bộ nội dung phía sau, nên đừng chuyển sang bước tiếp khi nó còn mơ hồ.',
      },
      {
        name: 'Dựng ba trụ và bằng chứng cho từng trụ',
        detail:
          'Ba luận điểm ủng hộ câu cốt lõi, mỗi trụ bắt buộc kèm ít nhất một bằng chứng kiểm chứng được: một con số nội bộ đo được, một tính năng cụ thể có thể xem, một cam kết dịch vụ có ghi trong hợp đồng. Trụ không có bằng chứng thì phải bỏ, không phải viết hay hơn.',
      },
      {
        name: 'Tạo phiên bản theo vai trò người nghe',
        detail:
          'Giữ nguyên dữ kiện, đổi phần được nhấn theo mối bận tâm của từng vai: người dùng trực tiếp quan tâm thao tác hằng ngày, người ký duyệt quan tâm rủi ro và ngân sách, bộ phận kỹ thuật quan tâm tích hợp và dữ liệu. Đây không phải nói khác nhau, mà là chọn lát cắt khác nhau của cùng sự thật.',
      },
      {
        name: 'Thử ngoài đời và cắt phần không sống nổi',
        detail:
          'Đọc từng câu cho khách thật nghe và quan sát chỗ họ gật, chỗ họ hỏi lại, chỗ họ im lặng. Câu nào phải giải thích thêm mới hiểu thì câu đó chưa dùng được trong quảng cáo, dù nó rất đúng.',
      },
    ],
    scenario:
      'Một công ty làm ứng dụng chấm công cho nhà thầu xây dựng giới thiệu sản phẩm bằng danh sách mười bốn tính năng, đứng đầu là nhận diện khuôn mặt và báo cáo đa chiều. Chu kỳ bán dài và khách hay hỏi những câu lệch hướng. Người phụ trách marketing nghe lại hai mươi cuộc gọi bán hàng, gạch chân cụm chữ khách tự nói và thấy một cụm lặp lại rất nhiều: "cuối tháng chấm công cho công trường xa lại phải chờ bảng giấy gửi về". Bộ thông điệp mới được dựng quanh câu cốt lõi là chốt công cho công trường xa ngay trong ngày mà không cần chờ bảng giấy, với ba trụ là chấm công có toạ độ khi mất sóng, tổng hợp về một bảng duy nhất, và xuất được đúng biểu mẫu kế toán đang dùng. Nhận diện khuôn mặt bị đẩy xuống phần chi tiết kỹ thuật. Sau khi đổi, các buổi tư vấn đầu tiên chuyển từ hỏi về tính năng sang hỏi về cách triển khai ở công trường, và đội bán hàng cả bốn người bắt đầu mở đầu cuộc gọi bằng cùng một câu.',
    comparison: [
      {
        weak: 'Mở đầu bằng danh sách tính năng theo thứ tự đội phát triển tự hào nhất.',
        mature: 'Mở đầu bằng tình huống khách đang mắc kẹt, dùng đúng chữ khách hay dùng, rồi mới tới tính năng nào gỡ được tình huống đó.',
      },
      {
        weak: 'Viết một bộ thông điệp duy nhất và bắt mọi vai trò người nghe cùng đọc.',
        mature: 'Giữ chung một câu cốt lõi và một bộ dữ kiện, nhưng chuẩn bị sẵn ba lát cắt cho người dùng, người ký duyệt và bộ phận kỹ thuật.',
      },
      {
        weak: 'Dùng các cụm mạnh không kiểm chứng được như tiết kiệm tối đa chi phí, tăng hiệu quả vượt trội.',
        mature: 'Nêu con số có phạm vi và nguồn rõ ràng, ví dụ kết quả đo được ở một khách hàng cụ thể trong một khoảng thời gian cụ thể, kèm điều kiện áp dụng.',
      },
    ],
    mistakes: [
      'Viết thông điệp trong phòng họp bằng trí nhớ và cảm hứng, không mở lại một dòng ghi chép nào của khách, nên toàn bộ ngôn ngữ mang giọng nội bộ và khách phải dịch ngược mới hiểu.',
      'Nhồi cả năm trụ vào một trang vì không nỡ bỏ trụ nào, khiến người đọc không nhớ được trụ nào và bộ phận bán hàng mỗi người tự chọn một trụ khác nhau để nhấn.',
      'Trích một con số hiệu quả ấn tượng mà không nêu nguồn, phạm vi và điều kiện — điều này vừa dễ dẫn tới quảng cáo sai sự thật, vừa sụp đổ ngay khi một khách hàng thật hỏi số đó lấy từ đâu.',
    ],
    worksheet: [
      'Chép lại năm cụm chữ nguyên văn mà khách dùng để mô tả vấn đề của họ trong tháng qua. Nguồn của mỗi cụm là gì?',
      'Viết câu giá trị cốt lõi trả lời đủ ba phần: cho ai, đạt kết quả gì, khác cách làm hiện tại ở chỗ nào.',
      'Ba trụ của bạn là gì, và bằng chứng kiểm chứng được của từng trụ nằm ở đâu? Trụ nào đang không có bằng chứng?',
      'Ai là ba vai trò tham gia quyết định mua? Với mỗi vai, câu hỏi thầm trong đầu họ khi nghe bạn nói là gì?',
      'Câu nào trong tài liệu hiện tại mà bạn phải giải thích thêm mới có người hiểu? Viết lại câu đó bằng chữ của khách.',
    ],
    exercises: [
      {
        label: 'Ngân hàng chữ của khách',
        text: 'Mở hai mươi email hoặc tin nhắn khách gửi, trích ra mọi cụm mô tả vấn đề và dán vào một tệp. Đếm cụm nào lặp nhiều nhất và khoanh ba cụm đứng đầu.',
        level: 'e',
      },
      {
        label: 'Một câu ba phần',
        text: 'Viết mười phiên bản câu giá trị cốt lõi, mỗi phiên bản dưới hai mươi lăm chữ và đủ ba phần cho ai, kết quả gì, khác gì. Đọc to từng câu và loại các câu bạn thấy ngượng khi nói ra miệng.',
        level: 'e',
      },
      {
        label: 'Bỏ trụ không có bằng chứng',
        text: 'Liệt kê mọi luận điểm bạn đang dùng, viết cạnh mỗi luận điểm bằng chứng cụ thể. Xoá thẳng những luận điểm không có bằng chứng và đếm còn lại bao nhiêu.',
        level: 'e',
      },
      {
        label: 'Ba lát cắt',
        text: 'Chọn một tính năng, viết ba đoạn ngắn cho ba vai: người dùng hằng ngày, người ký duyệt ngân sách, người phụ trách kỹ thuật. Giữ nguyên dữ kiện, chỉ đổi phần nhấn và đơn vị đo.',
        level: 'm',
      },
      {
        label: 'Thử bằng tai người lạ',
        text: 'Đọc câu cốt lõi cho bảy người thuộc nhóm khách mục tiêu qua điện thoại, sau đó hỏi họ nhắc lại bằng lời của họ. Ghi lại chỗ họ nhớ sai và chỗ họ tự thêm vào.',
        level: 'm',
      },
      {
        label: 'Kiểm tính trung thực',
        text: 'Rà toàn bộ thông điệp hiện tại, đánh dấu mọi khẳng định về kết quả. Với mỗi khẳng định, ghi nguồn, phạm vi áp dụng và điều kiện. Cái nào không ghi nổi ba thứ đó thì viết lại cho đúng mức bạn chứng minh được.',
        level: 'm',
      },
      {
        label: 'Bài kiểm ba phòng ban',
        text: 'Nhờ ba đồng nghiệp ở ba bộ phận khác nhau giới thiệu sản phẩm trong ba mươi giây mà không xem tài liệu. Ghi lại luận điểm mỗi người chọn; nếu ba người nói ba hướng, sửa bộ thông điệp cho tới khi trùng nhau ở câu cốt lõi.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: một câu mở đầu',
        text: 'Bảy ngày, dùng đúng một câu mở đầu mới trong mọi cuộc trò chuyện với khách tiềm năng và ghi lại câu hỏi đầu tiên họ đặt sau đó. Ngày thứ bảy phân loại các câu hỏi: hỏi vì tò mò muốn biết thêm, hay hỏi vì chưa hiểu bạn nói gì. Tỷ lệ loại thứ hai chính là thước đo độ rõ của thông điệp, và nó phải giảm dần qua các phiên bản.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Thông điệp sản phẩm khác định vị ở điểm nào?',
        a: 'Định vị là quyết định chiến lược về ngữ cảnh và nhóm khách được ưu tiên; nó thường được viết ra một lần và giữ ổn định nhiều quý, chủ yếu dùng trong nội bộ để định hướng. Thông điệp là bộ câu chữ cụ thể để thực hiện quyết định đó ở từng kênh, từng vai trò người nghe, và nó được sửa thường xuyên hơn dựa trên phản hồi thật. Một định vị có thể sinh ra nhiều bộ thông điệp; nhưng nếu thông điệp mâu thuẫn với định vị thì thị trường sẽ nhớ theo thông điệp, vì đó mới là thứ họ nghe được.',
      },
      {
        q: 'Vì sao phải trích nguyên văn chữ của khách thay vì tự viết cho hay?',
        a: 'Vì người đọc nhận ra vấn đề của mình nhanh nhất khi thấy đúng cách họ vẫn mô tả nó trong đầu, và bước nhận ra đó xảy ra trước bước đánh giá giải pháp. Chữ do nội bộ sáng tác thường trừu tượng hơn một bậc vì người viết đã quen nghĩ theo cấu trúc sản phẩm. Ngoài ra, ngân hàng chữ của khách còn là nguồn từ khoá thật cho tìm kiếm và quảng cáo, nên nó có giá trị kép.',
      },
      {
        q: 'Khi một trụ thông điệp rất hấp dẫn nhưng chưa có bằng chứng, nên xử lý thế nào?',
        a: 'Hạ nó xuống thành giả thuyết cần kiểm chứng, không đưa vào tài liệu đối ngoại. Cách xử lý đúng là thiết kế phép đo để tạo bằng chứng: chọn hai khách hàng sẵn sàng hợp tác, đo trước và sau trong một khoảng thời gian xác định, ghi rõ điều kiện. Nếu số liệu ủng hộ thì trụ đó quay lại với nguồn và phạm vi kèm theo. Đưa khẳng định không bằng chứng ra thị trường vừa là rủi ro pháp lý về quảng cáo sai sự thật, vừa phá niềm tin ngay ở lần khách đầu tiên kiểm chứng.',
      },
    ],
    plan7:
      'Ngày 1: dựng ngân hàng chữ của khách từ hai mươi nguồn thật. Ngày 2: viết mười phiên bản câu cốt lõi và chọn ba. Ngày 3: liệt kê luận điểm và bằng chứng, xoá thẳng luận điểm thiếu bằng chứng. Ngày 4: viết ba lát cắt cho ba vai trò quyết định. Ngày 5: thử câu cốt lõi với bảy người thật và ghi chỗ họ nhớ sai. Ngày 6: rà tính trung thực của mọi khẳng định kết quả, bổ sung nguồn và điều kiện. Ngày 7: chạy bài kiểm ba phòng ban rồi chốt bản dùng chung, dán vào tài liệu bán hàng và trang giới thiệu.',
    evidence:
      'Hiện vật là một trang thông điệp gồm câu cốt lõi, ba trụ có bằng chứng và ba lát cắt theo vai trò, kèm phụ lục ngân hàng chữ của khách có trích nguồn từng cụm. Đi kèm nên có bản ghi kết quả bài kiểm ba phòng ban trước và sau. Trong phỏng vấn, hãy trình bày phiên bản đầu và phiên bản cuối của cùng một câu cốt lõi và giải thích dữ kiện nào khiến bạn đổi — người kể được lý do đổi mới chứng minh mình đã kiểm chứng thay vì chỉ viết lại cho mượt. Trong CV: "Xây bộ thông điệp cho ứng dụng chấm công công trường dựa trên 20 cuộc gọi khách; thống nhất câu mở đầu cho đội bán 4 người, chuyển trọng tâm buổi tư vấn từ hỏi tính năng sang bàn cách triển khai".',
    references: [
      { label: 'Nielsen Norman Group — nghiên cứu về cách người đọc quét và hiểu nội dung web', url: 'https://www.nngroup.com/', type: 'article' },
      { label: 'Plain Language — nguyên tắc viết rõ ràng cho người đọc không chuyên', url: 'https://www.plainlanguage.gov/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 6 — Copywriting
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Copywriting là viết để tạo ra một hành động cụ thể ở người đọc, trong điều kiện họ không có nghĩa vụ phải đọc bạn và có thể rời đi bất cứ lúc nào. Vì vậy nó bị chi phối bởi hai ràng buộc mà văn viết thông thường không có: mỗi câu phải mua được quyền tồn tại của câu tiếp theo, và mọi khẳng định phải đúng sự thật vì người đọc sẽ kiểm chứng nó bằng chính trải nghiệm mua hàng. Kỹ thuật thuyết phục dùng để làm rõ giá trị có thật; khi nó được dùng để tạo cảm giác sai, nó không còn là copywriting mà là một khoản nợ sẽ phải trả bằng tỷ lệ hoàn hàng và đánh giá xấu.',
    why: {
      work: 'Cùng một sản phẩm và cùng một ngân sách, cách viết tiêu đề và mô tả quyết định phần lớn số người bấm vào và số người hoàn tất mua. Đây là một trong ít kỹ năng mà cải thiện của bạn hiện ra trên số liệu trong vòng vài ngày.',
      interview:
        'Bài tập tuyển dụng phổ biến là viết lại một trang bán hàng. Người được đánh giá cao không phải người viết bay bổng nhất mà người trình bày được vì sao chọn góc tiếp cận này, đã cân nhắc và loại bỏ góc nào, và sẽ đo hiệu quả bằng chỉ số gì.',
      study:
        'Luyện viết ngắn có ràng buộc, ví dụ diễn đạt một ý phức tạp trong ba mươi chữ, cải thiện luôn khả năng viết tóm tắt, viết email học thuật và trả lời tự luận có giới hạn số từ.',
      life: 'Tin nhắn xin việc, bài đăng bán lại đồ cũ, lời mời tham gia một hoạt động chung — tất cả đều là bản sao thu nhỏ của cùng một bài toán: người đọc bận, và bạn có vài giây để cho họ lý do quan tâm.',
    },
    framework: [
      {
        name: 'Xác định một hành động và một người đọc',
        detail:
          'Trước khi viết chữ nào, ghi rõ ai đang đọc và bạn muốn họ làm đúng một việc gì sau khi đọc xong. Một trang cố gắng vừa xây dựng hình ảnh vừa bán vừa tuyển dụng thường không đạt được việc nào.',
      },
      {
        name: 'Chọn một lời hứa duy nhất',
        detail:
          'Trong tất cả những điều đúng bạn có thể nói, chọn một điều mà người đọc quan tâm nhất và bạn chứng minh được. Mọi phần còn lại tồn tại để phục vụ lời hứa đó, không phải để bổ sung thêm lời hứa mới.',
      },
      {
        name: 'Dựng theo mạch chú ý — liên quan — bằng chứng — hành động',
        detail:
          'Câu mở làm người đọc nhận ra chuyện này liên quan tới họ, phần giữa đưa bằng chứng kiểm chứng được, phần cuối nói rõ việc cần làm và điều gì xảy ra ngay sau đó. Nói rõ bước kế tiếp làm giảm lo lắng, và lo lắng mới là thứ chặn hành động nhiều hơn cả sự thiếu thuyết phục.',
      },
      {
        name: 'Cắt cho tới khi không cắt được nữa',
        detail:
          'Bỏ trạng từ nhấn mạnh, bỏ mệnh đề rào đón, bỏ câu chỉ để chuyển ý. Đọc to bản đã cắt; chỗ nào bạn hụt hơi hoặc phải đọc lại là chỗ người đọc sẽ bỏ đi.',
      },
      {
        name: 'Kiểm đạo đức trước khi kiểm hiệu quả',
        detail:
          'Đọc lại và tự hỏi ba câu: có khẳng định nào tôi không chứng minh được không, có yếu tố khan hiếm hay hạn chót nào không có thật không, có chi phí nào người đọc chỉ phát hiện ở bước cuối không. Một chữ có thì phải sửa, bất kể nó đang chạy tốt tới đâu.',
      },
      {
        name: 'Thử hai phiên bản và giữ cái thắng',
        detail:
          'So sánh có kiểm soát: đổi đúng một yếu tố mỗi lần, chạy đủ lâu để số liệu ổn định, và ghi lại kết luận vào sổ. Sổ này sau vài tháng trở thành tài sản riêng của bạn về nhóm khách của chính bạn, có giá trị hơn mọi mẹo viết chung chung.',
      },
    ],
    scenario:
      'Một cửa hàng trực tuyến bán đồ chơi gỗ cho trẻ mầm non có trang sản phẩm mở đầu bằng câu "Sản phẩm chất lượng cao, an toàn tuyệt đối cho bé yêu". Người bán đọc lại năm mươi câu hỏi khách nhắn trước khi mua và thấy hai lo lắng lặp đi lặp lại: sơn có an toàn khi trẻ ngậm không, và cạnh gỗ có sắc không. Cô viết lại phần đầu trang thành hai dòng trả lời đúng hai lo lắng đó, kèm ảnh chụp cận cạnh bo tròn, tên loại sơn gốc nước, và bản chụp giấy kiểm nghiệm của nhà cung cấp. Cô cũng gỡ dòng đếm ngược "ưu đãi kết thúc sau 2 giờ" vốn tự khởi động lại mỗi khi tải trang, vì nó không có thật. Trong tháng tiếp theo, số tin nhắn hỏi lại hai câu đó giảm rõ rệt, thời gian trả lời của nhân viên dồn được cho các đơn khó hơn, và tỷ lệ hoàn hàng vì kỳ vọng sai không tăng dù lượng đơn tăng.',
    comparison: [
      {
        weak: 'Mở đầu bằng lời tự khen sản phẩm và tên thương hiệu.',
        mature: 'Mở đầu bằng đúng nỗi lo hoặc mong muốn mà người đọc đang mang theo lúc họ tìm tới trang này.',
      },
      {
        weak: 'Tạo cảm giác gấp gáp bằng đồng hồ đếm ngược tự khởi động lại hoặc dòng chữ chỉ còn vài suất không dựa trên tồn kho thật.',
        mature: 'Chỉ nêu hạn chót và số lượng khi chúng có thật và kiểm chứng được, chấp nhận mất chút chuyển đổi ngắn hạn để giữ tỷ lệ hoàn hàng và đánh giá.',
      },
      {
        weak: 'Viết dài để chứng minh sự công phu, nhồi mọi tính năng vào cùng một trang.',
        mature: 'Chọn một lời hứa, đưa ba bằng chứng mạnh nhất, đẩy phần chi tiết xuống mục riêng cho người thật sự muốn đọc sâu.',
      },
      {
        weak: 'Giấu phí vận chuyển và điều kiện đổi trả tới bước thanh toán cuối cùng.',
        mature: 'Nêu tổng chi phí và điều kiện đổi trả ngay tại chỗ người đọc bắt đầu cân nhắc, vì bất ngờ ở bước cuối là nguyên nhân bỏ giỏ hàng và mất niềm tin lâu dài.',
      },
    ],
    mistakes: [
      'Coi copywriting là nghệ thuật chọn chữ đẹp nên dành phần lớn thời gian gọt câu, trong khi phần quyết định kết quả là chọn đúng lời hứa và đúng người đọc — việc phải làm xong trước khi viết.',
      'Sao chép công thức của một trang bán hàng nổi tiếng ở ngành khác mà không xét khác biệt về mức độ rủi ro khi mua: bán một món quà nhỏ và bán một hợp đồng dịch vụ dài hạn cần lượng bằng chứng khác hẳn nhau.',
      'Dùng các thủ thuật gây áp lực như khan hiếm giả, hạn chót giả, hay nút từ chối viết theo kiểu làm người đọc thấy mình dại dột — chúng có thể nâng số liệu tuần này nhưng tạo ra làn sóng hoàn hàng, đánh giá xấu và rủi ro vi phạm quy định về quảng cáo.',
    ],
    worksheet: [
      'Trang hoặc bài viết bạn sắp làm nhắm tới ai, và bạn muốn họ làm đúng một việc gì sau khi đọc?',
      'Trong tất cả điều đúng bạn có thể nói về sản phẩm, đâu là lời hứa duy nhất người đọc quan tâm nhất? Bạn chứng minh nó bằng gì?',
      'Liệt kê ba nỗi lo lớn nhất người đọc mang theo trước khi mua, lấy từ câu hỏi thật của khách chứ không phải phỏng đoán.',
      'Rà bản nháp và ghi ra mọi khẳng định bạn không có bằng chứng, mọi yếu tố khan hiếm không có thật, mọi chi phí bị đẩy xuống cuối.',
      'Nếu chỉ được giữ lại một phần ba số chữ hiện tại, bạn giữ phần nào? Viết lại bản ngắn đó và đọc to một lần.',
    ],
    exercises: [
      {
        label: 'Một hành động một người đọc',
        text: 'Lấy ba trang hoặc bài đăng bạn đã viết, ghi cạnh mỗi cái đúng một người đọc và một hành động mong muốn. Đánh dấu bài nào đang phục vụ hai mục đích trở lên và tách chúng ra.',
        level: 'e',
      },
      {
        label: 'Mười tiêu đề',
        text: 'Viết mười tiêu đề khác nhau cho cùng một sản phẩm, mỗi tiêu đề đi theo một góc khác nhau: nỗi lo, kết quả, đối tượng cụ thể, so sánh với cách làm cũ. Chọn ba cái để thử thật.',
        level: 'e',
      },
      {
        label: 'Cắt một phần ba',
        text: 'Lấy một đoạn mô tả sản phẩm đang dùng, cắt đúng một phần ba số chữ mà không mất thông tin nào. Ghi lại loại chữ bạn cắt nhiều nhất, đó là thói quen viết cần sửa.',
        level: 'e',
      },
      {
        label: 'Ba nỗi lo ba bằng chứng',
        text: 'Đọc năm mươi tin nhắn hoặc câu hỏi khách gửi trước khi mua, gom thành các nhóm lo lắng. Với ba nhóm lớn nhất, tìm một bằng chứng xem được cho mỗi nhóm và đưa lên phần đầu trang.',
        level: 'm',
      },
      {
        label: 'Rà đạo đức trang bán hàng',
        text: 'Rà toàn bộ trang bán hàng hiện có theo ba câu hỏi kiểm: khẳng định không chứng minh được, khan hiếm hoặc hạn chót không thật, chi phí ẩn tới bước cuối. Sửa mọi chỗ tìm được và ghi lại đã gỡ những gì.',
        level: 'm',
      },
      {
        label: 'Viết cho ba mức rủi ro',
        text: 'Viết ba bản mô tả cho ba mức giá khác nhau của cùng dòng sản phẩm, từ món rẻ mua theo cảm hứng tới gói đắt cần cân nhắc. Quan sát lượng bằng chứng cần thiết tăng lên thế nào theo mức giá.',
        level: 'm',
      },
      {
        label: 'Thử nghiệm một biến',
        text: 'Chạy so sánh hai phiên bản chỉ khác nhau đúng một yếu tố, ví dụ tiêu đề, trong thời gian đủ dài để số liệu ổn định. Ghi kết luận vào sổ kèm điều kiện chạy và số lượt quan sát.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: sổ câu chữ',
        text: 'Bảy ngày, mỗi ngày chép lại một câu quảng cáo bạn gặp ngoài đời và viết ba dòng phân tích: nó hứa gì, nó chứng minh bằng gì, và nó có dùng thủ thuật gây áp lực nào không. Ngày thứ bảy tự viết lại ba trong bảy câu đó theo hướng trung thực hơn mà vẫn thuyết phục, rồi rút ra nguyên tắc riêng cho chính bạn.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao khan hiếm giả và hạn chót giả là sai lầm nghiêm trọng chứ không chỉ là mẹo hiệu quả?',
        a: 'Vì chúng tạo ra chuyển đổi bằng cách làm người đọc quyết định trong trạng thái sợ mất, dựa trên thông tin không đúng sự thật. Hệ quả xuất hiện ở ba chỗ: người mua trong hoảng loạn thường hoàn hàng nhiều hơn; người phát hiện đồng hồ đếm ngược tự khởi động lại sẽ không quay lại và hay nói cho người khác; và ở nhiều nơi, thông tin sai lệch nhằm thúc đẩy mua bán bị điều chỉnh bởi pháp luật về quảng cáo và bảo vệ người tiêu dùng. Khi thật sự có giới hạn thật, hãy nêu và chứng minh; khi không có, hãy tìm lý do khác để hành động ngay, ví dụ nêu rõ điều gì xảy ra sau khi họ bấm.',
      },
      {
        q: 'Vì sao nói mỗi câu phải mua được quyền tồn tại của câu tiếp theo?',
        a: 'Vì người đọc không có nghĩa vụ đọc hết. Họ dừng lại ở bất cứ đâu thấy chán hoặc thấy không liên quan, và họ thường quyết định điều đó trong vài giây đầu ở mỗi đoạn. Cách viết theo nguyên tắc này rất cụ thể: câu đầu tiên chỉ có một việc là khiến người ta đọc câu thứ hai, tiêu đề phụ phải giữ được người đang lướt nhanh, và mọi câu chỉ để chuyển ý mà không thêm thông tin đều là chỗ để người đọc thoát ra.',
      },
      {
        q: 'Bằng chứng nào thuyết phục hơn: lời khen của khách hay con số?',
        a: 'Tuỳ vào việc người đọc đang nghi ngờ điều gì. Nếu họ nghi về kết quả thì con số có phạm vi và điều kiện rõ ràng mạnh hơn. Nếu họ nghi về rủi ro khi làm việc với bạn thì trải nghiệm cụ thể của một khách giống họ lại mạnh hơn, đặc biệt khi lời kể có chi tiết kiểm chứng được như tên đơn vị, thời gian, tình huống. Nguyên tắc chung là bằng chứng phải khớp với đúng nỗi nghi ngờ đang chặn hành động, còn bằng chứng chất đống không đúng chỗ thì chỉ làm trang dài thêm.',
      },
    ],
    plan7:
      'Ngày 1: chọn một trang cần sửa, viết ra một người đọc và một hành động. Ngày 2: đọc năm mươi câu hỏi khách và gom ba nhóm lo lắng lớn nhất. Ngày 3: viết mười tiêu đề theo các góc khác nhau, chọn ba. Ngày 4: viết lại phần đầu trang theo mạch chú ý, liên quan, bằng chứng, hành động. Ngày 5: cắt một phần ba số chữ và đọc to bản đã cắt. Ngày 6: rà đạo đức toàn trang và gỡ mọi yếu tố gây áp lực không có thật. Ngày 7: khởi động một so sánh hai phiên bản chỉ khác một yếu tố và mở sổ ghi kết luận.',
    evidence:
      'Bằng chứng của người viết quảng cáo là hồ sơ trước và sau: ảnh chụp bản cũ, bản mới, điều kiện thử nghiệm và số liệu kèm thời gian chạy. Giá trị hơn nữa là cuốn sổ thử nghiệm ghi cả những lần thất bại và bài học rút ra, vì nó chứng minh bạn làm việc bằng phương pháp chứ không bằng cảm hứng. Nên có thêm một mục ghi lại những yếu tố bạn đã chủ động gỡ bỏ vì không trung thực, kèm quan sát về tác động — đây là chi tiết hiếm và tạo ấn tượng rất mạnh trong phỏng vấn. Trong CV: "Viết lại trang sản phẩm dựa trên 50 câu hỏi thật trước khi mua, gỡ bỏ yếu tố đếm ngược không có thật; giảm số câu hỏi lặp lại của khách và giữ ổn định tỷ lệ hoàn hàng khi lượng đơn tăng".',
    references: [
      { label: 'Copyblogger — tài liệu nền tảng về viết nội dung bán hàng', url: 'https://copyblogger.com/', type: 'article' },
      { label: 'Cục Cạnh tranh và Bảo vệ người tiêu dùng — quy định về quảng cáo và bảo vệ người tiêu dùng tại Việt Nam', url: 'https://thuvienphapluat.vn/', type: 'article', needsReview: true },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 7 — Content Marketing
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Content marketing là đánh đổi: bạn cho đi phần kiến thức hữu ích nhất mà mình có, đều đặn và không kèm điều kiện, để đổi lấy sự chú ý và niềm tin của đúng nhóm người sẽ mua sau này. Nó chỉ hoạt động khi ba điều cùng đúng: bạn có quyền nói về chủ đề đó vì làm thật, bạn duy trì được nhịp xuất bản trong nhiều tháng, và bạn đo bằng hành vi dẫn tới kinh doanh chứ không bằng lượt xem. Thiếu điều thứ nhất thì nội dung nhạt, thiếu điều thứ hai thì không kịp tích luỹ, thiếu điều thứ ba thì bạn sẽ tối ưu nhầm hướng suốt một năm.',
    why: {
      work: 'Nội dung tốt làm việc cả khi bạn ngủ và tiếp tục mang khách về nhiều tháng sau khi đăng, khác hẳn quảng cáo trả tiền vốn dừng chi là dừng khách. Nó cũng làm giảm khối lượng giải thích lặp lại của đội bán hàng vì khách đã đọc trước khi gặp.',
      interview:
        'Một tuyển tập bài viết hoặc video do bạn làm là bằng chứng năng lực khó nguỵ tạo nhất khi ứng tuyển vị trí marketing, và nó cũng là thứ nhà tuyển dụng có thể tự kiểm chứng trước buổi gặp.',
      study:
        'Viết để dạy lại là một trong những cách học sâu nhất: bạn chỉ phát hiện mình chưa hiểu ở đúng chỗ không viết nổi câu giải thích. Duy trì một chuỗi bài về môn bạn đang học vừa củng cố kiến thức vừa tạo hồ sơ cá nhân.',
      life: 'Với người làm nghề tự do, chia sẻ đều đặn cách bạn giải quyết vấn đề thường mang lại khách hàng ổn định hơn là chào mời trực tiếp, vì người đọc đã tự thấy bạn làm được trước khi liên hệ.',
    },
    framework: [
      {
        name: 'Chọn một chủ đề bạn có quyền nói',
        detail:
          'Giao điểm giữa việc bạn làm hằng ngày và việc khách hàng mục tiêu đang loay hoay. Chọn hẹp tới mức một người trong ngành nghe xong biết ngay bạn dành cho ai; chủ đề rộng khiến bạn cạnh tranh với tất cả và không được ai nhớ.',
      },
      {
        name: 'Vẽ bản đồ câu hỏi theo giai đoạn',
        detail:
          'Liệt kê câu hỏi khách đặt khi họ chưa nhận ra vấn đề, khi đang so sánh giải pháp, và khi sắp quyết định. Mỗi giai đoạn cần dạng nội dung khác nhau, và phần lớn doanh nghiệp chỉ làm nội dung cho giai đoạn cuối rồi than không có người đọc.',
      },
      {
        name: 'Chốt nhịp xuất bản bền vững nhất có thể',
        detail:
          'Chọn nhịp bạn giữ được vào tháng bận nhất, kể cả khi đó là hai bài một tháng. Một bài mỗi tuần trong sáu tháng tạo tích luỹ; mười bài trong hai tuần rồi im lặng nửa năm thì không.',
      },
      {
        name: 'Làm sâu một lần rồi phân phối nhiều lần',
        detail:
          'Mỗi nội dung gốc nên đẻ ra được ít nhất ba định dạng phụ ở các kênh khác: một bài dài thành vài bài ngắn, một sơ đồ, một đoạn video. Phần lớn công sức nằm ở việc nghĩ, nên đăng một lần rồi bỏ là lãng phí phần đắt nhất.',
      },
      {
        name: 'Đo bằng hành vi có giá trị kinh doanh',
        detail:
          'Theo dõi số người đăng ký nhận tin, số yêu cầu tư vấn, số lần nội dung được đội bán hàng gửi cho khách trong quá trình chốt đơn. Lượt xem chỉ hữu ích khi nó gắn được với một trong các hành vi đó.',
      },
      {
        name: 'Rà lại và làm mới nội dung cũ',
        detail:
          'Định kỳ xem bài nào vẫn mang khách về, cập nhật số liệu và ví dụ, gộp các bài trùng chủ đề. Việc này thường rẻ hơn và hiệu quả hơn viết bài mới, nhưng ít ai làm vì nó không tạo cảm giác đang sản xuất.',
      },
    ],
    scenario:
      'Một công ty dịch vụ kế toán năm người phục vụ hộ kinh doanh và doanh nghiệp siêu nhỏ đăng đều đặn các bài chúc mừng ngày lễ và ảnh nội bộ, gần như không ai đọc. Họ đổi cách làm: mỗi tháng, người phụ trách tư vấn chọn ba câu hỏi mà khách gọi hỏi nhiều nhất trong tháng và viết ba bài trả lời tận cùng, kèm ảnh chụp mẫu biểu và các bước thao tác. Chủ đề thu hẹp lại quanh nghĩa vụ thuế của hộ kinh doanh chuyển lên doanh nghiệp. Mỗi bài được cắt thành ba đoạn ngắn đăng lại trên mạng xã hội và một sơ đồ một trang để gửi kèm khi tư vấn. Sau bốn tháng, số người điền biểu mẫu xin tư vấn tăng lên đều đặn, và đáng chú ý hơn, nhân viên tư vấn bắt đầu gửi chính các bài này cho khách trước buổi gặp, rút ngắn thời gian giải thích lại từ đầu. Họ chọn giữ nhịp ba bài mỗi tháng thay vì tăng lên hàng tuần vì đó là nhịp giữ được vào mùa quyết toán.',
    comparison: [
      {
        weak: 'Đăng nội dung theo cảm hứng và theo ngày lễ, chủ đề trải rộng từ tuyển dụng tới chúc mừng.',
        mature: 'Bám một chủ đề hẹp mà mình có quyền nói, xuất bản theo nhịp đã cam kết, và từ chối những nội dung nằm ngoài chủ đề đó.',
      },
      {
        weak: 'Chỉ làm nội dung giới thiệu sản phẩm và khuyến mãi, dành cho người đã sẵn sàng mua.',
        mature: 'Phủ cả ba giai đoạn, đặc biệt là nội dung cho người mới nhận ra vấn đề, vì đó là nơi tạo ra niềm tin trước khi có nhu cầu mua.',
      },
      {
        weak: 'Đánh giá thành công bằng lượt xem và lượt thích, tối ưu tiêu đề để có nhiều người bấm.',
        mature: 'Đánh giá bằng số yêu cầu tư vấn, số người đăng ký nhận tin và số lần nội dung được dùng trong quá trình bán, rồi mới xét tới lượt xem.',
      },
    ],
    mistakes: [
      'Giữ lại phần kiến thức giá trị nhất vì sợ khách đọc xong sẽ tự làm được và không thuê mình nữa; kết quả là nội dung nông, không ai nhớ, trong khi người thật sự thuê dịch vụ thường thuê vì không có thời gian chứ không vì thiếu thông tin.',
      'Cam kết nhịp đăng cao hơn năng lực thật vào lúc hào hứng ban đầu, rồi bỏ hẳn sau vài tuần — sự đứt quãng này xoá gần hết phần tích luỹ và khiến người theo dõi quên mất bạn.',
      'Sản xuất hàng loạt nội dung viết vội hoặc sinh tự động mà không kiểm chứng chuyên môn; với các lĩnh vực có rủi ro như thuế, y tế hay pháp lý, một hướng dẫn sai có thể gây thiệt hại thật cho người đọc và trách nhiệm thuộc về người đăng.',
    ],
    worksheet: [
      'Chủ đề nào bạn có quyền nói vì làm nó hằng ngày, và ai là người sẽ thấy nó hữu ích? Viết bằng một câu.',
      'Ba câu hỏi khách hay hỏi nhất trong tháng qua là gì? Bạn đã có nội dung trả lời chúng chưa?',
      'Nhịp xuất bản nào bạn chắc chắn giữ được vào tháng bận nhất trong năm? Ai là người viết và ai duyệt?',
      'Với một nội dung gốc gần nhất, bạn đã tạo ra bao nhiêu định dạng phụ và đăng ở bao nhiêu kênh?',
      'Bạn đang dùng chỉ số nào để đánh giá nội dung, và chỉ số đó nối với doanh thu qua mấy bước? Ghi rõ từng bước.',
    ],
    exercises: [
      {
        label: 'Thu hẹp chủ đề',
        text: 'Viết chủ đề hiện tại của bạn, sau đó viết ba phiên bản hẹp dần bằng cách thêm điều kiện về nhóm khách hoặc tình huống. Chọn phiên bản hẹp nhất mà bạn vẫn có đủ chất liệu cho hai mươi bài.',
        level: 'e',
      },
      {
        label: 'Bản đồ câu hỏi',
        text: 'Lập bảng ba cột theo ba giai đoạn nhận thức của khách, điền ít nhất năm câu hỏi thật cho mỗi cột, lấy từ tin nhắn và cuộc gọi. Đánh dấu cột nào bạn chưa có nội dung nào.',
        level: 'e',
      },
      {
        label: 'Một bài trả lời tận cùng',
        text: 'Chọn câu hỏi khách hỏi nhiều nhất và viết một bài trả lời đầy đủ tới mức người đọc tự làm được, kèm ảnh chụp thao tác hoặc mẫu biểu. Gửi cho ba khách cũ và hỏi họ còn thiếu gì.',
        level: 'e',
      },
      {
        label: 'Nhịp bền vững',
        text: 'Lập lịch xuất bản ba tháng với nhịp bạn chắc giữ được, ghi tên người viết và ngày duyệt cho từng mục. Thử áp nó vào tháng bận nhất năm ngoái xem có khả thi không.',
        level: 'm',
      },
      {
        label: 'Một gốc ba nhánh',
        text: 'Lấy một nội dung gốc đã có, tạo ba định dạng phụ cho ba kênh khác nhau và đăng trong hai tuần. So sánh phản hồi giữa các kênh và ghi lại định dạng nào hợp với chủ đề của bạn.',
        level: 'm',
      },
      {
        label: 'Nối chỉ số với doanh thu',
        text: 'Vẽ chuỗi từ lượt xem tới doanh thu, ghi rõ từng bước chuyển đổi và cách bạn đo mỗi bước. Tìm bước nào hiện chưa đo được và bổ sung cách đo, dù thủ công.',
        level: 'm',
      },
      {
        label: 'Làm mới kho cũ',
        text: 'Rà toàn bộ nội dung đã đăng, phân loại thành còn dùng tốt, cần cập nhật, và nên gộp hoặc bỏ. Cập nhật hai bài thuộc nhóm giữa và theo dõi thay đổi trong bốn tuần.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: một câu hỏi mỗi ngày',
        text: 'Bảy ngày, mỗi ngày ghi lại một câu hỏi có thật mà khách hoặc đồng nghiệp đặt cho bạn, kèm câu trả lời của bạn dài khoảng hai trăm chữ. Ngày thứ bảy chọn ba câu trả lời tốt nhất, gộp thành một bài hoàn chỉnh và đăng. Bạn sẽ có sẵn quy trình sản xuất nội dung không phụ thuộc cảm hứng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Cho đi kiến thức tốt nhất có làm mất khách hàng không?',
        a: 'Trong đa số trường hợp thì không, vì người trả tiền cho dịch vụ thường trả cho thời gian, trách nhiệm và sự an tâm chứ không chỉ cho thông tin. Người đọc xong tự làm được thường vốn không phải khách hàng của bạn, còn người vừa nhận ra việc này phức tạp hơn họ tưởng lại chính là khách tốt nhất. Ngoại lệ đáng cân nhắc là những mảng mà giá trị nằm gọn trong một bí quyết cụ thể; khi đó nên chia sẻ nguyên tắc và cách tư duy, giữ lại phần triển khai chi tiết mang tính chuyên biệt cho từng khách.',
      },
      {
        q: 'Vì sao lượt xem là chỉ số nguy hiểm nếu dùng làm mục tiêu chính?',
        a: 'Vì nó dễ tăng bằng những cách không liên quan tới kinh doanh: chọn chủ đề đang thịnh hành nhưng lệch khách hàng, viết tiêu đề gây tò mò quá mức, hoặc chạy quảng cáo đẩy lượt xem. Khi lượt xem trở thành mục tiêu, đội ngũ sẽ tối ưu đúng những cách đó và nội dung dần trôi khỏi nhóm người có khả năng mua. Cách lành mạnh là đặt mục tiêu ở hành vi gần doanh thu hơn, còn lượt xem chỉ giữ vai trò chỉ báo phụ để giải thích biến động.',
      },
      {
        q: 'Khi nào nên dừng một kênh nội dung?',
        a: 'Khi sau một khoảng đủ dài để tích luỹ, thường là vài tháng liên tục theo đúng nhịp đã cam kết, kênh đó không tạo ra hành vi có giá trị nào và bạn không tìm được giả thuyết nào chưa thử. Trước khi dừng hẳn, hãy kiểm hai khả năng: có thể chủ đề đúng nhưng định dạng sai với thói quen của nhóm khách, hoặc bạn đã dừng quá sớm khi mới đăng vài bài. Ghi lại lý do dừng vào sổ để sau này không lặp lại cùng một thử nghiệm trong vô thức.',
      },
    ],
    plan7:
      'Ngày 1: thu hẹp chủ đề và viết một câu mô tả người đọc mục tiêu. Ngày 2: lập bản đồ câu hỏi ba giai đoạn từ tin nhắn thật của khách. Ngày 3: viết một bài trả lời tận cùng cho câu hỏi phổ biến nhất. Ngày 4: cắt bài đó thành ba định dạng phụ cho ba kênh. Ngày 5: lập lịch xuất bản ba tháng với nhịp giữ được vào tháng bận nhất. Ngày 6: vẽ chuỗi chỉ số từ lượt xem tới doanh thu và bổ sung cách đo cho bước còn thiếu. Ngày 7: rà kho nội dung cũ, chọn hai bài để cập nhật và đặt lịch kiểm lại sau bốn tuần.',
    evidence:
      'Bằng chứng ở đây là một danh mục nội dung do bạn làm, kèm bảng theo dõi nối từng nội dung với hành vi kinh doanh: số yêu cầu tư vấn, số người đăng ký, số lần đội bán hàng gửi bài đó cho khách. Kèm theo nên có lịch xuất bản thật đã chạy nhiều tháng để chứng minh tính kỷ luật, vì nhịp đều là thứ khó giả nhất. Trong phỏng vấn, hãy chọn một bài, giải thích vì sao chọn đúng câu hỏi đó, nó ra đời từ nguồn nào và nó đã được dùng lại ở đâu trong quy trình bán. Trong CV: "Xây quy trình nội dung 3 bài/tháng cho công ty dịch vụ kế toán, chủ đề nghĩa vụ thuế của hộ kinh doanh; nội dung được đội tư vấn dùng làm tài liệu gửi trước buổi gặp, tăng đều số biểu mẫu xin tư vấn trong 4 tháng".',
    references: [
      { label: 'Content Marketing Institute — khung nghề và tài liệu content marketing', url: 'https://contentmarketinginstitute.com/', type: 'article' },
      { label: 'Ahrefs Blog — nghiên cứu và hướng dẫn về nội dung, tìm kiếm', url: 'https://ahrefs.com/blog/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 8 — Marketing trên mạng xã hội
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Mạng xã hội không phải kênh phát thanh mà là nơi bạn phải chen vào giữa những thứ người dùng vốn muốn xem, nên nội dung thắng là nội dung đứng vững nếu bỏ hết tên thương hiệu đi. Điểm khác biệt lớn nhất với các kênh khác là phần lớn giá trị kinh doanh sinh ra ở khu vực không ai nhìn thấy: phần trả lời bình luận và tin nhắn riêng. Doanh nghiệp nhỏ thường thua không phải vì đăng ít mà vì đăng nhiều rồi bỏ trống ô tin nhắn, tức là dựng cửa hàng xong không cử ai đứng bán.',
    why: {
      work: 'Với nhiều loại hình kinh doanh địa phương, đây là kênh rẻ nhất để đi từ người lạ tới cuộc hẹn có thật. Nó cũng là nơi phản hồi tới nhanh nhất, nên phù hợp để thử thông điệp trước khi đầu tư vào kênh đắt hơn.',
      interview:
        'Nhà tuyển dụng thường hỏi bạn đã tăng trưởng kênh nào và bằng cách nào. Người trả lời được cấu trúc nội dung, nhịp đăng, cách xử lý tin nhắn và tỷ lệ chuyển từ tin nhắn sang cuộc hẹn sẽ khác hẳn người chỉ khoe số người theo dõi.',
      study:
        'Vận hành một kênh nhỏ của chính bạn trong ba tháng dạy được nhiều hơn nhiều khoá học, vì bạn buộc phải đối diện với dữ liệu thật và với việc nội dung mình thích lại không phải nội dung được xem.',
      life: 'Hiểu cơ chế phân phối nội dung giúp bạn tiêu thụ mạng xã hội tỉnh táo hơn: biết vì sao mình nhìn thấy thứ đang nhìn thấy, và bớt tin rằng độ phổ biến của một nội dung phản ánh độ đúng của nó.',
    },
    framework: [
      {
        name: 'Chọn một nền tảng theo nơi khách đã ở sẵn',
        detail:
          'Hỏi mười khách gần nhất họ thường dùng ứng dụng nào và tìm thông tin loại này ở đâu. Làm tốt một nền tảng luôn thắng làm hời hợt bốn nền tảng, vì mỗi nơi có định dạng và nhịp riêng cần thời gian để học.',
      },
      {
        name: 'Tôn trọng định dạng gốc của nền tảng',
        detail:
          'Không lấy nguyên tấm ảnh in ấn đưa lên video ngắn, không dán nguyên một bài báo dài vào nơi người ta lướt bằng ngón cái. Nội dung phải trông như thứ vốn thuộc về nền tảng đó, nếu không nó bị bỏ qua ở giây đầu tiên.',
      },
      {
        name: 'Xây bộ định dạng lặp lại được',
        detail:
          'Chọn ba tới bốn kiểu nội dung bạn có thể sản xuất đều đặn: trước và sau, giải đáp một câu hỏi, hậu trường công việc, khách hàng thật kể lại. Có bộ khung sẵn thì việc đăng không phụ thuộc cảm hứng và người khác trong nhóm cũng làm được.',
      },
      {
        name: 'Coi ô tin nhắn là quầy bán hàng',
        detail:
          'Đặt mục tiêu thời gian trả lời, soạn sẵn câu trả lời cho năm câu hỏi phổ biến nhất, và luôn kết thúc bằng một đề nghị cụ thể như đặt lịch hoặc gửi địa chỉ. Mọi nỗ lực làm nội dung sẽ vô nghĩa nếu người quan tâm nhắn tin rồi chờ hai ngày.',
      },
      {
        name: 'Đo bằng số cuộc hẹn, không bằng số người theo dõi',
        detail:
          'Ghi thủ công cũng được: mỗi ngày bao nhiêu tin nhắn tới, bao nhiêu thành cuộc hẹn, bao nhiêu thành đơn. Số người theo dõi chỉ có ý nghĩa khi nó chuyển thành các con số này.',
      },
    ],
    scenario:
      'Một phòng tập nhỏ ở khu dân cư đăng đều đặn ảnh thiết bị và các câu trích dẫn động lực, có gần bốn nghìn người theo dõi nhưng hầu như không ai nhắn tin. Chủ phòng tập hỏi mười hai hội viên mới nhất và biết họ đều tìm phòng tập qua video ngắn và đều lo hai chuyện: sợ tập sai tư thế và ngại vì mình mới bắt đầu. Anh đổi sang ba định dạng cố định: video ba mươi giây sửa một lỗi tư thế thường gặp, video hội viên mới tuần đầu tập ra sao, và một buổi giải đáp câu hỏi mỗi tuần. Đồng thời anh đặt luật trả lời mọi tin nhắn trong vòng một giờ giờ hành chính và luôn kết bằng lời mời tập thử một buổi vào khung giờ cụ thể. Sau sáu tuần, số người theo dõi tăng không nhiều nhưng số tin nhắn hỏi tập thử tăng lên đều, và anh bắt đầu ghi bảng theo dõi thủ công tin nhắn, buổi tập thử, hội viên mới để biết định dạng nào thật sự mang người tới.',
    comparison: [
      {
        weak: 'Mở tài khoản trên năm nền tảng cùng lúc và đăng lại y nguyên một nội dung cho tất cả.',
        mature: 'Chọn một nền tảng nơi khách đã ở, học kỹ định dạng gốc của nó, và chỉ mở rộng khi kênh đầu tiên đã tạo ra kết quả kinh doanh ổn định.',
      },
      {
        weak: 'Đăng nội dung nói về mình: kỷ niệm thành lập, khen thiết bị mới, trích dẫn động lực chung chung.',
        mature: 'Đăng nội dung đứng vững cả khi bỏ tên thương hiệu: giải quyết một lo lắng cụ thể, cho thấy một quá trình thật, kể một tình huống người xem nhận ra mình trong đó.',
      },
      {
        weak: 'Coi bình luận và tin nhắn là việc phụ, trả lời khi rảnh hoặc để trợ lý trả lời bằng câu mẫu cụt lủn.',
        mature: 'Xem ô tin nhắn là nơi tạo doanh thu, có người trực, có mục tiêu thời gian phản hồi và luôn kết bằng một đề nghị cụ thể.',
      },
    ],
    mistakes: [
      'Mua lượt theo dõi hoặc dùng các nhóm tương tác chéo để làm đẹp số liệu, khiến hệ thống phân phối hiểu sai tệp khán giả và những nội dung sau đó bị đưa tới đúng nhóm người không bao giờ mua.',
      'Đăng bài xin lỗi hoặc tranh cãi tay đôi với một bình luận tiêu cực ngay khi vừa bực, biến một phản hồi lẻ thành sự kiện được nhiều người chứng kiến; cách xử lý an toàn hơn là trả lời ngắn, công khai, và chuyển tiếp sang tin nhắn riêng.',
      'Chạy theo mọi trào lưu đang thịnh hành để có lượt xem, kể cả những trào lưu chẳng liên quan gì tới sản phẩm, làm tệp người theo dõi loãng dần và tỷ lệ chuyển thành khách ngày càng thấp.',
    ],
    worksheet: [
      'Mười khách gần nhất của bạn tìm thấy dịch vụ tương tự ở đâu? Ghi số phiếu cho từng nền tảng.',
      'Ba lo lắng cụ thể của người xem trước khi họ nhắn tin cho bạn là gì? Lấy từ tin nhắn thật, không phỏng đoán.',
      'Chọn ba định dạng nội dung bạn sản xuất được đều đặn mỗi tuần với nguồn lực hiện có. Ai quay, ai duyệt, mất bao lâu?',
      'Thời gian trả lời tin nhắn trung bình của bạn hiện là bao lâu, và mục tiêu bạn cam kết được là bao nhiêu?',
      'Bạn đang ghi lại những con số nào mỗi tuần? Nếu chưa có, thiết kế bảng ba cột: tin nhắn, cuộc hẹn, đơn hàng.',
    ],
    exercises: [
      {
        label: 'Phiếu bầu nền tảng',
        text: 'Hỏi mười khách hàng gần nhất họ dùng ứng dụng nào nhiều nhất và tìm dịch vụ như của bạn ở đâu. Vẽ biểu đồ cột thủ công và chọn một nền tảng để tập trung trong ba tháng.',
        level: 'e',
      },
      {
        label: 'Bỏ tên thử xem',
        text: 'Lấy mười bài đăng gần nhất, che hết tên và logo thương hiệu rồi tự hỏi bài nào vẫn đáng xem. Đếm tỷ lệ và ghi lại điểm chung của những bài sống sót.',
        level: 'e',
      },
      {
        label: 'Ba câu trả lời sẵn',
        text: 'Liệt kê năm câu hỏi khách nhắn nhiều nhất, soạn câu trả lời mẫu cho từng câu, mỗi câu kết bằng một đề nghị cụ thể. Dùng thử một tuần và sửa lại theo phản ứng thật.',
        level: 'e',
      },
      {
        label: 'Bộ định dạng lặp lại',
        text: 'Thiết kế ba khung nội dung có cấu trúc cố định, mỗi khung ghi rõ mở đầu, phần giữa, kết. Sản xuất mỗi khung một nội dung trong tuần và ghi thời gian thực tế bỏ ra cho mỗi cái.',
        level: 'm',
      },
      {
        label: 'Ba giây đầu',
        text: 'Xem lại mười video của chính bạn, chỉ tính ba giây đầu, và viết ra điều người xem thấy và nghe trong khoảng đó. Làm lại ba giây đầu cho ba video yếu nhất rồi đăng lại và so sánh.',
        level: 'm',
      },
      {
        label: 'Bảng theo dõi thủ công',
        text: 'Trong bốn tuần, mỗi ngày ghi ba con số: tin nhắn tới, cuộc hẹn đặt được, đơn thành công, kèm nội dung đã đăng hôm đó. Cuối tháng tìm mối liên hệ giữa loại nội dung và số cuộc hẹn.',
        level: 'm',
      },
      {
        label: 'Kịch bản phản hồi tiêu cực',
        text: 'Viết quy trình xử lý một bình luận tiêu cực: ai trả lời, trong bao lâu, mẫu câu công khai, khi nào chuyển sang tin nhắn riêng, khi nào cần báo cấp trên. Diễn tập với hai tình huống giả định.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: bảy nội dung từ công việc thật',
        text: 'Bảy ngày, mỗi ngày lấy một khoảnh khắc có thật trong công việc và biến nó thành một nội dung ngắn: một câu hỏi khách vừa hỏi, một lỗi bạn vừa sửa cho khách, một bước hậu trường. Không dùng nội dung sưu tầm. Ngày thứ bảy so sánh bảy nội dung theo số tin nhắn nhận được và giữ lại hai dạng hiệu quả nhất làm khung cố định.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao số người theo dõi là chỉ số kém tin cậy cho doanh nghiệp nhỏ?',
        a: 'Vì nó cộng dồn tất cả những người đã từng bấm theo dõi vì bất cứ lý do gì, kể cả người ở xa ngoài vùng phục vụ và người chỉ tới vì một nội dung giải trí. Nó cũng không phản ánh khả năng tiếp cận hiện tại, vốn do hệ thống phân phối quyết định theo từng nội dung. Chỉ số gần với doanh thu hơn là số tin nhắn hỏi mua và tỷ lệ tin nhắn chuyển thành cuộc hẹn; hai con số này có thể ghi tay và chúng phản ứng ngay khi bạn đổi nội dung.',
      },
      {
        q: 'Nên xử lý một bình luận tiêu cực công khai như thế nào?',
        a: 'Trả lời nhanh, ngắn, đúng sự thật và công khai, gồm ba phần: ghi nhận trải nghiệm của họ, nêu việc bạn đang làm, và mời chuyển sang tin nhắn riêng để lấy thông tin cụ thể. Không tranh luận từng chi tiết ở chỗ công khai vì mọi câu qua lại đều làm chủ đề được đẩy lên và nhiều người thấy hơn. Không xoá bình luận trừ khi nó vi phạm quy tắc rõ ràng như xúc phạm cá nhân, vì việc xoá thường tạo ra phản ứng lớn hơn nhiều so với nội dung ban đầu.',
      },
      {
        q: 'Có nên chạy theo trào lưu đang thịnh hành không?',
        a: 'Chỉ khi bạn ghép được trào lưu đó với đúng chủ đề và nhóm khách của mình mà không phải bẻ cong cả hai. Phép thử là hỏi: nếu nội dung này đạt nhiều lượt xem, những người xem nó có phải nhóm sẽ mua không. Nếu câu trả lời là không, lượt xem đó không chỉ vô ích mà còn làm loãng tệp khán giả, khiến các nội dung sau đó tiếp cận sai người. Trào lưu là công cụ mượn sự chú ý, và sự chú ý chỉ có giá khi nó tới từ đúng người.',
      },
    ],
    plan7:
      'Ngày 1: hỏi mười khách gần nhất về nền tảng họ dùng, chọn một nơi để tập trung. Ngày 2: che tên thương hiệu và chấm lại mười bài đăng cũ. Ngày 3: thiết kế ba khung nội dung lặp lại được và ghi rõ ai làm. Ngày 4: soạn năm câu trả lời tin nhắn mẫu, mỗi câu kết bằng đề nghị cụ thể. Ngày 5: làm lại ba giây đầu cho ba nội dung yếu nhất. Ngày 6: dựng bảng theo dõi thủ công tin nhắn, cuộc hẹn, đơn hàng. Ngày 7: viết quy trình xử lý phản hồi tiêu cực và diễn tập với hai tình huống giả định.',
    evidence:
      'Bằng chứng thuyết phục là bảng theo dõi bốn tuần nối nội dung đã đăng với tin nhắn, cuộc hẹn và đơn hàng, kèm ảnh chụp ba khung nội dung do bạn thiết kế và bộ câu trả lời tin nhắn mẫu. Nếu có, thêm một ví dụ xử lý phản hồi tiêu cực từ lúc xuất hiện tới lúc khép lại. Trong phỏng vấn, đừng bắt đầu bằng số người theo dõi mà bắt đầu bằng bài toán: khách ở đâu, bạn chọn định dạng nào và vì sao, tỷ lệ tin nhắn thành cuộc hẹn thay đổi ra sao. Trong CV: "Thiết kế 3 khung nội dung cố định và quy trình trả lời tin nhắn dưới 1 giờ cho phòng tập; tăng đều số buổi tập thử đặt qua tin nhắn trong 6 tuần mà không tăng chi phí quảng cáo".',
    references: [
      { label: 'Buffer Resources — hướng dẫn vận hành kênh mạng xã hội', url: 'https://buffer.com/resources', type: 'article' },
      { label: 'Sprout Social Insights — nghiên cứu và thực hành mạng xã hội cho doanh nghiệp', url: 'https://sproutsocial.com/insights/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 9 — SEO
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'SEO là việc làm cho trang của bạn trở thành câu trả lời tốt nhất hiện có cho một truy vấn cụ thể, rồi loại bỏ các trở ngại kỹ thuật khiến máy tìm kiếm không đọc được hoặc không tin được điều đó. Nó không phải trò lách luật thuật toán: mọi mẹo dựa trên khai thác lỗ hổng đều có tuổi thọ ngắn và để lại hậu quả khó gỡ, trong khi phần bền vững — hiểu ý định tìm kiếm, viết nội dung thật sự giải quyết được việc, và giữ website sạch sẽ về kỹ thuật — gần như không đổi qua các đợt cập nhật. Với doanh nghiệp địa phương, phần lớn kết quả đến từ những thứ rất cơ bản mà ít ai làm đủ.',
    why: {
      work: 'Lưu lượng từ tìm kiếm là loại khách chủ động: họ đang có nhu cầu ngay lúc gõ. Một trang lên được vị trí tốt tiếp tục mang khách về hàng năm, nên chi phí trên mỗi khách giảm dần theo thời gian thay vì tăng như quảng cáo.',
      interview:
        'Ứng viên nói được sự khác nhau giữa truy vấn tìm hiểu và truy vấn sẵn sàng mua, và biết ưu tiên nhóm nào trước với ngân sách nhỏ, sẽ nổi bật hơn hẳn người chỉ kể tên công cụ hoặc nhắc tới việc nhồi từ khoá.',
      study:
        'Học SEO buộc bạn hiểu cách người khác diễn đạt vấn đề của họ bằng ngôn ngữ của chính họ. Đó là bài tập tốt cho mọi việc liên quan tới nghiên cứu người dùng và viết tài liệu.',
      life: 'Biết cách máy tìm kiếm xếp hạng giúp bạn đọc trang kết quả tỉnh táo hơn, phân biệt được nội dung được tối ưu để bán với nội dung thật sự có chuyên môn, và tìm thông tin nhanh hơn bằng truy vấn chính xác.',
    },
    framework: [
      {
        name: 'Bắt đầu từ ý định, không từ danh sách từ khoá',
        detail:
          'Với mỗi truy vấn, tự hỏi người gõ nó đang muốn gì: hiểu một khái niệm, so sánh lựa chọn, hay tìm chỗ mua ngay. Gõ thử truy vấn đó và xem loại trang nào đang đứng đầu — đó là câu trả lời trực tiếp về loại nội dung mà máy tìm kiếm đang cho là phù hợp.',
      },
      {
        name: 'Chọn truy vấn theo khả năng thắng, không theo lượng tìm',
        detail:
          'Với website mới hoặc ít uy tín, các truy vấn ngắn và phổ biến gần như không có cửa. Chọn truy vấn dài, cụ thể, gắn địa phương hoặc gắn tình huống hẹp; ít người tìm hơn nhưng tỷ lệ chuyển đổi cao hơn và bạn có cơ hội thật.',
      },
      {
        name: 'Viết trang đáp ứng đủ ý định trong một chỗ',
        detail:
          'Người tìm không muốn đọc bài của bạn, họ muốn xong việc. Trả lời thẳng ở phần đầu, sau đó mới tới chi tiết, và bổ sung những phần phụ mà các trang đang đứng đầu đều có vì đó là dấu hiệu người tìm cần chúng.',
      },
      {
        name: 'Dọn nền tảng kỹ thuật',
        detail:
          'Trang phải tải nhanh trên điện thoại, mỗi trang có tiêu đề riêng và mô tả riêng, không có nhiều trang trùng nội dung, cấu trúc liên kết nội bộ rõ ràng, và có sơ đồ site. Đây là phần ít hấp dẫn nhất nhưng thường là phần đang chặn kết quả.',
      },
      {
        name: 'Xây uy tín bằng cách đáng được nhắc tới',
        detail:
          'Liên kết từ trang khác vẫn là tín hiệu quan trọng, nhưng cách bền vững để có nó là tạo ra thứ đáng được nhắc: dữ liệu riêng, công cụ nhỏ hữu ích, hướng dẫn đầy đủ nhất trong ngành hẹp. Mua liên kết hàng loạt vi phạm nguyên tắc của máy tìm kiếm và có thể khiến toàn bộ website bị đánh tụt.',
      },
      {
        name: 'Đo bằng truy vấn thật và sửa lại',
        detail:
          'Dùng công cụ quản trị website của máy tìm kiếm để xem người ta thật sự gõ gì mà thấy bạn, trang nào hiển thị nhiều nhưng ít người bấm, và câu hỏi nào bạn đang trả lời nửa vời. Đây là nguồn ý tưởng nội dung chính xác hơn mọi công cụ ước lượng.',
      },
    ],
    scenario:
      'Một đơn vị sửa và bảo dưỡng máy lạnh tại nhà có website nhưng gần như không ai vào. Chủ đơn vị mở công cụ quản trị website và thấy trang duy nhất được hiển thị là trang chủ, chủ yếu với truy vấn chứa tên công ty. Anh làm ba việc theo thứ tự: cập nhật đầy đủ hồ sơ doanh nghiệp trên bản đồ với giờ mở cửa, khu vực phục vụ và ảnh thật của thợ; tạo bốn trang riêng cho bốn phường mà anh nhận việc, mỗi trang ghi rõ khu vực, thời gian có mặt cam kết và bảng giá dịch vụ cơ bản; và viết ba bài trả lời đúng những câu khách hay gọi hỏi trước khi đặt lịch, ví dụ máy lạnh chảy nước có tự xử lý được không. Anh cũng xoá sáu trang trùng nội dung do gói giao diện tự sinh ra và nén lại ảnh cho trang tải nhanh trên điện thoại. Sau khoảng ba tháng, cuộc gọi đến từ tìm kiếm bắt đầu tăng đều, phần lớn từ truy vấn có tên phường, và anh dùng danh sách truy vấn thật trong công cụ quản trị để chọn chủ đề cho các bài tiếp theo.',
    comparison: [
      {
        weak: 'Nhắm vào những truy vấn ngắn có lượng tìm lớn nhất trong ngành ngay từ khi website còn mới.',
        mature: 'Bắt đầu bằng truy vấn dài, hẹp, gắn địa phương hoặc tình huống cụ thể, tích luỹ uy tín rồi mới tiến dần lên các truy vấn cạnh tranh hơn.',
      },
      {
        weak: 'Lặp lại từ khoá dày đặc trong bài với hy vọng máy tìm kiếm hiểu bài nói về chủ đề đó.',
        mature: 'Viết đúng cách người trong nghề diễn đạt, bao phủ các khía cạnh mà người tìm thật sự cần, và để mật độ từ khoá tự nhiên theo nội dung.',
      },
      {
        weak: 'Mua gói liên kết giá rẻ hàng loạt để đẩy nhanh thứ hạng.',
        mature: 'Tạo ra thứ đáng được nhắc tới và chủ động giới thiệu nó tới nơi thật sự quan tâm, chấp nhận tốc độ chậm hơn nhưng không mang rủi ro bị phạt.',
      },
      {
        weak: 'Bỏ mặc phần kỹ thuật vì thấy khó, chỉ tập trung viết thêm bài mới.',
        mature: 'Dọn trang trùng lặp, tiêu đề trùng, tốc độ tải và cấu trúc liên kết nội bộ trước, vì bài mới sẽ không cứu được một nền tảng đang lỗi.',
      },
    ],
    mistakes: [
      'Kỳ vọng kết quả trong vài tuần rồi kết luận SEO không hiệu quả và bỏ dở; tìm kiếm là kênh tích luỹ nên phần lớn thay đổi cần vài tháng mới đủ dữ liệu để đánh giá, và việc bỏ dở giữa chừng xoá sạch phần đã tích luỹ.',
      'Sản xuất hàng loạt bài chất lượng thấp cho mọi biến thể từ khoá, tạo ra một website đầy trang mỏng và trùng lặp; điều này làm loãng tín hiệu của chính những trang tốt và có thể kéo tụt cả website.',
      'Viết tiêu đề gây tò mò nhưng không khớp nội dung để tăng lượt bấm, khiến người vào rời đi ngay; hệ quả là chỉ số trải nghiệm xấu đi và bạn cũng mất luôn cơ hội với đúng người đang cần.',
    ],
    worksheet: [
      'Viết năm truy vấn mà một khách hàng thật của bạn có thể gõ trước khi tìm ra dịch vụ như của bạn. Nguồn của mỗi truy vấn là gì?',
      'Với từng truy vấn, gõ thử và ghi lại loại trang nào đang đứng đầu: bài hướng dẫn, trang dịch vụ, danh sách so sánh hay bản đồ địa phương?',
      'Trang nào trên website bạn đang có nhiều lượt hiển thị nhưng ít lượt bấm? Tiêu đề của nó đang hứa gì?',
      'Website của bạn có bao nhiêu trang trùng nội dung hoặc trùng tiêu đề? Kiểm bằng cách nào và khi nào bạn dọn?',
      'Bạn có thứ gì đáng để người khác nhắc tới không: dữ liệu riêng, công cụ nhỏ, hướng dẫn đầy đủ nhất trong mảng hẹp? Nếu chưa, thứ nào khả thi nhất trong một tháng?',
    ],
    exercises: [
      {
        label: 'Đọc trang kết quả',
        text: 'Chọn ba truy vấn quan trọng với bạn, gõ thử và phân tích mười kết quả đầu: loại trang, độ dài, các mục con lặp lại ở nhiều kết quả. Ghi lại điểm chung và so với trang của bạn.',
        level: 'e',
      },
      {
        label: 'Danh sách truy vấn thật',
        text: 'Mở công cụ quản trị website của máy tìm kiếm, xuất danh sách truy vấn đã mang người tới trong ba tháng. Đánh dấu mười truy vấn bạn chưa có trang nào trả lời đàng hoàng.',
        level: 'e',
      },
      {
        label: 'Sửa tiêu đề và mô tả',
        text: 'Chọn năm trang có nhiều hiển thị nhưng ít lượt bấm, viết lại tiêu đề và mô tả sao cho nêu đúng thứ người tìm sẽ nhận được. Ghi ngày sửa để so sánh sau bốn tuần.',
        level: 'e',
      },
      {
        label: 'Trang cho từng khu vực',
        text: 'Nếu bạn phục vụ theo địa bàn, tạo một trang riêng cho mỗi khu vực với nội dung thật khác nhau: phạm vi, thời gian có mặt, ví dụ công việc đã làm ở đó. Tránh sao chép một mẫu rồi chỉ thay tên địa danh.',
        level: 'm',
      },
      {
        label: 'Dọn kỹ thuật',
        text: 'Kiểm ba thứ: tốc độ tải trên điện thoại, các trang trùng tiêu đề, và liên kết hỏng. Sửa toàn bộ lỗi tìm được trong một tuần và ghi lại danh sách đã sửa.',
        level: 'm',
      },
      {
        label: 'Bài trả lời tận cùng',
        text: 'Chọn một truy vấn cụ thể và viết trang trả lời đầy đủ hơn mọi kết quả hiện tại: thêm ví dụ thật, ảnh chụp, bảng so sánh. Theo dõi thứ hạng và lượt bấm trong tám tuần.',
        level: 'm',
      },
      {
        label: 'Tạo thứ đáng được nhắc',
        text: 'Xây một tài nguyên nhỏ mà người trong ngành sẽ muốn dẫn lại: bảng dữ liệu bạn tự thu thập, mẫu biểu dùng được ngay, hoặc công cụ tính đơn giản. Giới thiệu nó tới mười nơi thật sự liên quan.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: sổ truy vấn',
        text: 'Bảy ngày, mỗi ngày ghi lại một câu hỏi mà khách hàng hoặc người quen hỏi bạn về lĩnh vực của mình, viết đúng nguyên văn cách họ hỏi. Ngày thứ bảy đối chiếu bảy câu đó với danh sách truy vấn thật trong công cụ quản trị website, tìm chỗ trùng và chọn ba trang cần viết trong tháng tới.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao website mới không nên nhắm ngay vào truy vấn có lượng tìm lớn nhất?',
        a: 'Vì thứ hạng cho các truy vấn đó thường thuộc về những trang đã tích luỹ uy tín nhiều năm và có rất nhiều trang khác dẫn về. Một trang mới hiếm khi chen vào được, nên công sức bỏ ra không tạo ra lượt truy cập nào. Truy vấn dài và cụ thể có ít cạnh tranh, phản ánh ý định rõ hơn nên tỷ lệ liên hệ cao hơn, và khi bạn thắng được một nhóm truy vấn hẹp thì uy tín tích luỹ giúp bạn dần vươn tới các truy vấn rộng hơn.',
      },
      {
        q: 'Nhồi từ khoá và viết đúng ngôn ngữ của người tìm khác nhau ở đâu?',
        a: 'Nhồi từ khoá là lặp lại một cụm chữ với mật độ cao nhằm đánh lừa hệ thống xếp hạng, và nó làm câu văn khó đọc nên người thật rời trang sớm. Viết đúng ngôn ngữ người tìm là dùng chính cách họ diễn đạt vấn đề, bao gồm cả các cách nói gần nghĩa và các câu hỏi phụ họ thường kèm theo, nhằm giúp họ xong việc. Cách phân biệt thực dụng: đọc to đoạn văn, nếu nghe như một người đang giải thích cho đồng nghiệp thì ổn, nếu nghe như một danh sách cụm từ lặp lại thì đã sai.',
      },
      {
        q: 'Bao lâu mới nên đánh giá kết quả của một thay đổi SEO?',
        a: 'Tối thiểu vài tuần cho các thay đổi nhỏ như tiêu đề, và thường vài tháng cho nội dung mới hoặc thay đổi cấu trúc, vì máy tìm kiếm cần thời gian thu thập lại và vì dữ liệu ít ngày thì nhiễu quá lớn để kết luận. Điều cần làm trong lúc chờ là ghi ngày thực hiện từng thay đổi vào một nhật ký, để khi số liệu biến động bạn phân biệt được nguyên nhân từ việc mình làm với nguyên nhân từ mùa vụ hoặc từ đợt cập nhật của máy tìm kiếm.',
      },
    ],
    plan7:
      'Ngày 1: gõ thử năm truy vấn quan trọng và phân tích mười kết quả đầu của từng truy vấn. Ngày 2: xuất danh sách truy vấn thật từ công cụ quản trị website và đánh dấu khoảng trống. Ngày 3: viết lại tiêu đề và mô tả cho năm trang có nhiều hiển thị mà ít lượt bấm. Ngày 4: kiểm và sửa tốc độ tải trên điện thoại, trang trùng tiêu đề, liên kết hỏng. Ngày 5: cập nhật đầy đủ hồ sơ doanh nghiệp trên bản đồ nếu bạn phục vụ theo địa bàn. Ngày 6: viết một trang trả lời tận cùng cho truy vấn có ý định mua rõ nhất. Ngày 7: mở nhật ký thay đổi, ghi lại mọi việc đã làm kèm ngày và hẹn kiểm lại sau tám tuần.',
    evidence:
      'Bằng chứng tốt là nhật ký thay đổi có ngày tháng đặt cạnh biểu đồ hiển thị và lượt bấm theo truy vấn, cộng với ảnh chụp trước và sau của các trang bạn đã sửa. Mạnh hơn nữa là một danh sách các trang bạn đã gộp hoặc xoá kèm lý do, vì biết bỏ đi là dấu hiệu của người làm thật. Trong phỏng vấn, hãy trình bày một chuỗi nhân quả cụ thể: truy vấn nào, bạn quan sát thấy gì trên trang kết quả, bạn làm gì, sau bao lâu số liệu đổi thế nào, và bạn loại trừ nguyên nhân mùa vụ ra sao. Trong CV: "Tái cấu trúc website dịch vụ tại nhà: dọn 6 trang trùng lặp, tạo 4 trang khu vực và 3 bài trả lời câu hỏi trước khi đặt lịch; cuộc gọi từ tìm kiếm tăng đều trong 3 tháng".',
    references: [
      { label: 'Google Search Central — tài liệu chính thức về SEO cho chủ website', url: 'https://developers.google.com/search', type: 'article' },
      { label: 'Moz — Beginner Guide to SEO', url: 'https://moz.com/beginners-guide-to-seo', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 10 — Email Marketing
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Email là kênh duy nhất mà danh sách người nhận thuộc về bạn chứ không thuộc về một nền tảng có thể đổi luật bất cứ lúc nào. Đổi lại, nó đòi hỏi một thứ mà các kênh khác không đòi: sự cho phép. Mỗi lá thư bạn gửi là một lần rút từ tài khoản niềm tin đã được cấp; gửi đều đặn với nội dung có giá trị thì tài khoản ấy lớn dần, gửi dồn dập với nội dung chỉ để bán thì nó cạn kiệt và người ta rời đi vĩnh viễn. Chất lượng danh sách luôn quan trọng hơn kích thước danh sách.',
    why: {
      work: 'Email cho phép nhắm đúng nhóm nhỏ theo hành vi thật của họ, ví dụ người đã xem sản phẩm nhưng chưa mua. Chi phí trên mỗi lần gửi gần như không đổi khi danh sách lớn lên, nên đây thường là kênh có hiệu quả kinh tế tốt nhất khi được vận hành nghiêm túc.',
      interview:
        'Ứng viên trình bày được cấu trúc chuỗi thư tự động, cách phân đoạn theo hành vi và cách xử lý tỷ lệ huỷ đăng ký sẽ được đánh giá là người từng vận hành thật, khác hẳn người chỉ nói về việc soạn nội dung thư.',
      study:
        'Xây và duy trì một bản tin nhỏ về chủ đề bạn học là cách rèn kỷ luật viết đồng thời tạo mạng lưới quan hệ có chất lượng, vì người đăng ký là người chủ động chọn nghe bạn.',
      life: 'Hiểu cách các doanh nghiệp dùng email giúp bạn quản lý hộp thư của chính mình tốt hơn: biết khi nào nên huỷ đăng ký thay vì xoá từng thư, và nhận ra các dấu hiệu của thư lừa đảo mạo danh thương hiệu.',
    },
    framework: [
      {
        name: 'Xin phép rõ ràng và ghi lại nguồn',
        detail:
          'Người nhận phải chủ động đồng ý, và bạn phải lưu được họ đăng ký ở đâu, ngày nào. Tuyệt đối không mua danh sách hay lấy địa chỉ từ danh thiếp rồi thêm vào chiến dịch: ngoài rủi ro pháp lý về dữ liệu cá nhân, nó còn phá tỷ lệ gửi tới hộp thư của toàn bộ tên miền.',
      },
      {
        name: 'Đặt kỳ vọng ngay ở bước đăng ký',
        detail:
          'Nói rõ họ sẽ nhận gì và bao lâu một lần, rồi giữ đúng như vậy. Phần lớn phản ứng khó chịu đến từ việc người ta đăng ký để lấy một tài liệu rồi bất ngờ nhận thư bán hàng ba lần mỗi tuần.',
      },
      {
        name: 'Dựng chuỗi chào mừng tự động',
        detail:
          'Ba tới bốn thư đầu tiên là lúc người nhận quan tâm nhất. Dùng chúng để trao giá trị cụ thể trước, giới thiệu bạn là ai, rồi mới tới lời mời hành động. Chuỗi này viết một lần và chạy cho mọi người mới, nên nó là phần đáng đầu tư nhất.',
      },
      {
        name: 'Phân đoạn theo hành vi, không theo cảm tính',
        detail:
          'Chia theo những gì họ đã làm: đã mua gì, đã mở thư nào, đã bấm vào chủ đề nào, bao lâu rồi không tương tác. Một thư đúng chủ đề gửi cho ba trăm người phù hợp thường tạo doanh thu tốt hơn thư chung gửi cho ba nghìn người.',
      },
      {
        name: 'Mỗi thư một mục đích và một lời mời',
        detail:
          'Thư có ba lời mời hành động khác nhau thường không nhận được hành động nào. Viết như một người viết cho một người, nêu rõ vì sao họ nhận thư này, và kết bằng đúng một việc cần làm.',
      },
      {
        name: 'Dọn danh sách định kỳ',
        detail:
          'Tách nhóm không tương tác trong nhiều tháng, gửi một thư hỏi họ có muốn tiếp tục không, rồi ngừng gửi cho những ai không phản hồi. Danh sách nhỏ hơn nhưng sống sẽ vào hộp thư chính tốt hơn và cho số liệu trung thực hơn.',
      },
    ],
    scenario:
      'Một hiệu sách cũ có danh sách khoảng ba nghìn địa chỉ tích luỹ trong bốn năm, chủ yếu từ chương trình tặng phiếu giảm giá. Chủ hiệu gửi mỗi tuần một thư giới thiệu sách mới cho toàn bộ danh sách, tỷ lệ mở thấp dần và bắt đầu có thư rơi vào mục quảng cáo. Chị thay đổi ba việc. Thứ nhất, tách danh sách thành ba nhóm theo lịch sử mua: người mua sách thiếu nhi, người mua sách chuyên khảo, và người chưa từng mua. Thứ hai, viết một chuỗi ba thư chào mừng cho người mới đăng ký, trong đó thư đầu là hướng dẫn chọn sách cũ còn dùng tốt chứ không phải khuyến mãi. Thứ ba, gửi cho nhóm im lặng hơn tám tháng một thư duy nhất hỏi họ có muốn tiếp tục nhận không, và bỏ khỏi danh sách những ai không trả lời, chấp nhận danh sách giảm gần một phần ba. Sau hai tháng, tỷ lệ mở của các thư gửi ra tăng rõ, số thư bị báo là rác giảm, và doanh thu từ email không giảm dù gửi cho ít người hơn.',
    comparison: [
      {
        weak: 'Thu thập địa chỉ từ mọi nguồn có thể, gồm danh thiếp hội thảo và danh sách mua lại, rồi gửi hàng loạt.',
        mature: 'Chỉ gửi cho người đã chủ động đồng ý, lưu lại nguồn và ngày đăng ký, và coi mỗi lần huỷ đăng ký là phản hồi chứ không phải mất mát.',
      },
      {
        weak: 'Gửi cùng một nội dung cho toàn bộ danh sách để tiết kiệm công sức.',
        mature: 'Phân đoạn theo hành vi đã xảy ra và chấp nhận viết nhiều bản ngắn hơn cho các nhóm nhỏ hơn.',
      },
      {
        weak: 'Giấu nút huỷ đăng ký, để chữ nhỏ cùng màu nền hoặc bắt đăng nhập mới huỷ được.',
        mature: 'Đặt nút huỷ đăng ký dễ thấy và cho huỷ trong một lần bấm; người muốn đi mà không đi được sẽ bấm nút báo thư rác, thứ gây hại lớn hơn nhiều.',
      },
      {
        weak: 'Đặt tiêu đề gây tò mò hoặc mạo nhận là thư cá nhân để tăng tỷ lệ mở.',
        mature: 'Đặt tiêu đề mô tả trung thực nội dung bên trong, chấp nhận tỷ lệ mở thấp hơn nhưng giữ được tỷ lệ bấm và niềm tin.',
      },
    ],
    mistakes: [
      'Đo thành công chỉ bằng tỷ lệ mở, vốn là chỉ số ngày càng nhiễu do các cơ chế bảo vệ quyền riêng tư tự tải ảnh; nên nhìn thêm tỷ lệ bấm, tỷ lệ huỷ đăng ký và doanh thu quy về từng chiến dịch.',
      'Tăng tần suất gửi khi doanh số giảm, coi email là vòi nước có thể vặn to; hệ quả thường là tỷ lệ huỷ đăng ký và báo thư rác tăng vọt, làm hỏng khả năng vào hộp thư của cả những thư quan trọng sau này.',
      'Bỏ qua nghĩa vụ về dữ liệu cá nhân: không nói rõ dùng dữ liệu vào việc gì, không có cơ chế cho người ta rút lại đồng ý, không xoá khi được yêu cầu — đây là rủi ro pháp lý thật và nên tham vấn người phụ trách pháp chế khi xây quy trình.',
    ],
    worksheet: [
      'Danh sách hiện tại của bạn đến từ những nguồn nào? Ghi từng nguồn kèm tỷ lệ ước tính và cách người ta đồng ý nhận thư.',
      'Người mới đăng ký hôm nay sẽ nhận được gì trong bảy ngày đầu? Nếu không có gì, hãy phác ba thư đầu tiên.',
      'Bạn có thể chia danh sách thành mấy nhóm dựa trên hành vi đã xảy ra? Liệt kê tiêu chí của từng nhóm.',
      'Lá thư gần nhất bạn gửi có mấy lời mời hành động? Nếu nhiều hơn một, cái nào bạn sẽ giữ lại?',
      'Bao nhiêu phần trăm danh sách của bạn không mở thư nào trong sáu tháng qua? Bạn định làm gì với nhóm đó?',
    ],
    exercises: [
      {
        label: 'Kiểm nguồn danh sách',
        text: 'Rà toàn bộ danh sách hiện có, phân loại theo nguồn và cách nhận được sự đồng ý. Đánh dấu nhóm nào bạn không chứng minh được sự đồng ý và tách riêng ra để xử lý.',
        level: 'e',
      },
      {
        label: 'Viết lại lời hứa lúc đăng ký',
        text: 'Sửa biểu mẫu đăng ký để nói rõ ba điều: nhận gì, bao lâu một lần, và cách huỷ. Đo tỷ lệ đăng ký trước và sau khi sửa trong hai tuần.',
        level: 'e',
      },
      {
        label: 'Một thư một mục đích',
        text: 'Lấy ba thư đã gửi, đếm số lời mời hành động trong mỗi thư, viết lại thành ba thư chỉ còn một lời mời. So sánh độ dài và độ rõ của bản mới.',
        level: 'e',
      },
      {
        label: 'Chuỗi chào mừng ba thư',
        text: 'Viết chuỗi ba thư tự động cho người mới đăng ký: thư một trao giá trị cụ thể, thư hai kể bạn là ai và giúp được gì, thư ba mời một hành động nhỏ. Cài đặt và theo dõi trong bốn tuần.',
        level: 'm',
      },
      {
        label: 'Phân đoạn theo hành vi',
        text: 'Chia danh sách thành ba nhóm theo hành vi đã xảy ra, viết cho mỗi nhóm một thư ngắn khác nhau. So tỷ lệ bấm giữa các nhóm với thư chung trước đó.',
        level: 'm',
      },
      {
        label: 'Thư hỏi lại nhóm im lặng',
        text: 'Lọc nhóm không tương tác trên sáu tháng, gửi một thư duy nhất hỏi họ có muốn tiếp tục nhận không, với hai nút rõ ràng. Sau hai tuần, gỡ những người không phản hồi và ghi lại số lượng.',
        level: 'm',
      },
      {
        label: 'Rà tuân thủ và quyền riêng tư',
        text: 'Kiểm bốn thứ trong quy trình của bạn: bằng chứng đồng ý, thông báo mục đích sử dụng dữ liệu, cơ chế rút lại đồng ý, và quy trình xoá khi được yêu cầu. Ghi lại chỗ thiếu và hỏi người phụ trách pháp chế trước khi sửa.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: viết như viết cho một người',
        text: 'Bảy ngày, mỗi ngày viết một lá thư ngắn gửi cho đúng một khách hàng thật, không dùng mẫu, không chèn ảnh, chỉ trả lời một việc họ đang quan tâm. Ghi lại tỷ lệ được trả lời. Ngày thứ bảy tìm điểm chung của những thư nhận được hồi âm và biến chúng thành nguyên tắc viết cho các chiến dịch gửi hàng loạt.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao danh sách nhỏ mà sống lại tốt hơn danh sách lớn mà im lặng?',
        a: 'Vì các nhà cung cấp hộp thư quyết định đưa thư của bạn vào hộp thư chính hay mục quảng cáo dựa nhiều vào tín hiệu tương tác của chính người nhận. Một tỷ lệ lớn người không bao giờ mở sẽ kéo tín hiệu đó xuống, khiến cả những người thật sự muốn đọc cũng không thấy thư của bạn nữa. Ngoài ra, danh sách chứa nhiều địa chỉ chết còn làm mọi chỉ số phần trăm bị pha loãng nên bạn mất khả năng đánh giá nội dung nào thật sự hiệu quả.',
      },
      {
        q: 'Vì sao giấu nút huỷ đăng ký là quyết định tệ về mặt kinh doanh, không chỉ về đạo đức?',
        a: 'Vì người muốn thoát mà không thoát được sẽ chọn con đường thay thế là bấm nút báo thư rác. Một tỷ lệ báo rác cao ảnh hưởng tới uy tín gửi của cả tên miền, làm mọi thư sau đó khó vào hộp thư chính, kể cả thư giao dịch quan trọng như xác nhận đơn hàng. Người huỷ đăng ký chỉ rời khỏi danh sách; người báo rác gây thiệt hại cho toàn bộ hệ thống email của bạn. Chưa kể ở nhiều nơi, việc gây khó cho quyền rút lại đồng ý là hành vi bị điều chỉnh bởi pháp luật.',
      },
      {
        q: 'Tỷ lệ mở giảm sau khi bạn dọn danh sách và đổi cách viết tiêu đề, có phải dấu hiệu xấu không?',
        a: 'Không nhất thiết, và cần nhìn nhiều chỉ số cùng lúc. Nếu bạn vừa bỏ nhóm im lặng thì mẫu số nhỏ lại nên các tỷ lệ thường tăng chứ không giảm; còn nếu bạn đổi từ tiêu đề gây tò mò sang tiêu đề mô tả trung thực thì tỷ lệ mở có thể giảm trong khi tỷ lệ bấm trên số người mở và doanh thu lại tăng, vì người mở là người thật sự quan tâm. Chỉ số cần theo dõi cuối cùng là doanh thu hoặc hành vi có giá trị quy về từng chiến dịch, còn tỷ lệ mở chỉ là chỉ báo trung gian ngày càng nhiễu.',
      },
    ],
    plan7:
      'Ngày 1: rà nguồn danh sách và tách nhóm không chứng minh được sự đồng ý. Ngày 2: sửa biểu mẫu đăng ký để nói rõ nhận gì, bao lâu một lần, huỷ thế nào. Ngày 3: viết thư đầu tiên của chuỗi chào mừng, tập trung trao giá trị. Ngày 4: viết hai thư còn lại và cài đặt chuỗi tự động. Ngày 5: chia danh sách thành ba nhóm theo hành vi. Ngày 6: soạn thư hỏi lại nhóm im lặng và lên lịch gửi. Ngày 7: rà tuân thủ về dữ liệu cá nhân, ghi lại chỗ còn thiếu và người cần hỏi.',
    evidence:
      'Bằng chứng gồm sơ đồ chuỗi thư tự động do bạn thiết kế, ảnh chụp ba thư thật, và bảng số liệu theo chiến dịch có đủ bốn cột: tỷ lệ bấm, tỷ lệ huỷ đăng ký, tỷ lệ báo rác và doanh thu quy về. Đặc biệt giá trị là câu chuyện bạn đã chủ động thu nhỏ danh sách và giải thích được vì sao doanh thu không giảm — nó chứng tỏ bạn hiểu cơ chế phía sau chứ không chạy theo con số bề mặt. Trong phỏng vấn, hãy nói được cách bạn đảm bảo sự đồng ý và cách xử lý yêu cầu xoá dữ liệu. Trong CV: "Tái cấu trúc email cho hiệu sách 3.000 địa chỉ: phân đoạn theo lịch sử mua, dựng chuỗi chào mừng 3 thư, loại nhóm im lặng trên 8 tháng; tỷ lệ mở và tỷ lệ vào hộp thư chính cải thiện trong 2 tháng mà doanh thu giữ nguyên".',
    references: [
      { label: 'Mailchimp Resources — hướng dẫn vận hành email marketing', url: 'https://mailchimp.com/resources/', type: 'article' },
      { label: 'Federal Trade Commission — hướng dẫn về quảng cáo và tiếp thị', url: 'https://www.ftc.gov/business-guidance/advertising-marketing', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 11 — Paid Advertising
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Quảng cáo trả tiền là máy khuếch đại, không phải máy phát hiện. Nó nhân lên thứ bạn đã có: nếu thông điệp đúng và quy trình chốt đơn chạy được thì nó mua thêm khách với chi phí dự đoán được; nếu chưa có gì hoạt động thì nó chỉ giúp bạn tiêu tiền nhanh hơn và học được ít hơn. Quy tắc thực dụng cho người ít vốn là chỉ bật quảng cáo khi đã có ít nhất một cách bán hàng chứng minh được bằng đơn thật, và luôn đặt trước ngưỡng dừng bằng con số chứ không bằng cảm giác.',
    why: {
      work: 'Đây là kênh duy nhất bạn tăng được lượng khách trong vài ngày, nên nó có vai trò riêng khi cần kiểm chứng nhanh một thông điệp hay lấp một khoảng trống doanh thu. Nhưng nó cũng là kênh dễ mất tiền nhất nếu không có kỷ luật đo lường.',
      interview:
        'Người phỏng vấn thường hỏi bạn tối ưu chiến dịch thế nào. Câu trả lời cho thấy trình độ là cách bạn xác định một chuyển đổi có giá trị, cách bạn quyết định dừng, và cách bạn tránh kết luận vội trên số liệu quá ít.',
      study:
        'Chạy một chiến dịch nhỏ với ngân sách vài trăm nghìn dạy bạn nhiều điều về xác suất, mẫu nhỏ và sai lệch hơn là đọc lý thuyết, vì bạn buộc phải đối diện với dữ liệu ồn ào và tiền thật.',
      life: 'Hiểu cách quảng cáo nhắm mục tiêu hoạt động giúp bạn tự bảo vệ mình tốt hơn với tư cách người tiêu dùng, biết vì sao mình nhìn thấy một quảng cáo và biết chỉnh các thiết lập quyền riêng tư.',
    },
    framework: [
      {
        name: 'Kiểm điều kiện trước khi bật',
        detail:
          'Ba điều kiện tối thiểu: đã có bằng chứng ai đó chịu trả tiền cho thứ này, có trang hoặc kênh nhận khách chạy tốt trên điện thoại, và có người trực để trả lời trong ngày. Thiếu một trong ba thì tiền quảng cáo sẽ rơi vào lỗ hổng đó.',
      },
      {
        name: 'Định nghĩa một chuyển đổi đáng tiền',
        detail:
          'Chọn hành động gần doanh thu nhất mà bạn đo được: đơn hàng, cuộc gọi trên ba mươi giây, biểu mẫu có số điện thoại thật. Tối ưu vào lượt bấm hoặc lượt xem sẽ khiến hệ thống mang về đúng loại người bấm nhiều mà không mua.',
      },
      {
        name: 'Bắt đầu tối giản và cấu trúc rõ ràng',
        detail:
          'Một mục tiêu, một nhóm đối tượng, hai tới ba mẫu quảng cáo. Chia quá nhiều nhóm nhỏ khiến mỗi nhóm không đủ dữ liệu để hệ thống học và cũng không đủ để bạn kết luận điều gì.',
      },
      {
        name: 'Đặt ngân sách thử và tiêu chí dừng trước',
        detail:
          'Viết ra trước: tôi chi tối đa bao nhiêu, trong bao nhiêu ngày, và nếu chi phí cho mỗi chuyển đổi vượt mức nào thì tôi tắt. Không có ngưỡng viết trước, bạn sẽ luôn tìm được lý do chạy thêm vài ngày nữa.',
      },
      {
        name: 'Đọc số liệu theo tầng để tìm chỗ rò',
        detail:
          'Đi lần lượt: có ai thấy quảng cáo không, có ai bấm không, có ai làm hành động ở trang đích không, có ai được liên hệ lại không. Điểm rò lớn nhất thường không nằm ở quảng cáo mà ở trang đích hoặc ở khâu phản hồi.',
      },
      {
        name: 'Giữ chuẩn mực quảng cáo trung thực',
        detail:
          'Không hứa kết quả không chứng minh được, không dùng ảnh trước sau gây hiểu lầm, không nhắm vào các nhóm dễ tổn thương bằng nỗi sợ, và tuân thủ quy định về quảng cáo trong ngành của bạn. Một tài khoản bị khoá vì vi phạm còn tốn kém hơn nhiều so với phần lợi thu được.',
      },
    ],
    scenario:
      'Một dịch vụ dọn nhà theo giờ ở khu vực nội thành có bốn nhân sự và ngân sách thử ba triệu đồng. Chủ dịch vụ bắt đầu bằng cách kiểm ba điều kiện: đã có bốn mươi đơn từ giới thiệu nên nhu cầu là có thật, trang đặt lịch chạy được trên điện thoại, và có người trực điện thoại giờ hành chính. Anh chọn chuyển đổi là biểu mẫu đặt lịch có số điện thoại, đặt ngưỡng dừng là chi phí mỗi biểu mẫu không quá một trăm năm mươi nghìn đồng trong mười ngày. Chiến dịch chạy với một nhóm đối tượng theo bán kính phục vụ và ba mẫu quảng cáo khác nhau về câu mở đầu. Sau bốn ngày, số biểu mẫu rất ít dù lượt bấm nhiều. Anh xem theo tầng và phát hiện trang đặt lịch bắt điền chín trường, trong đó có địa chỉ chi tiết và mã căn hộ. Anh rút xuống ba trường và hẹn gọi lại để lấy phần còn lại. Sáu ngày sau, chi phí mỗi biểu mẫu về dưới ngưỡng, và anh giữ đúng nguyên tắc chỉ tăng ngân sách khi tỷ lệ biểu mẫu thành đơn thật vẫn ổn định.',
    comparison: [
      {
        weak: 'Bật quảng cáo ngay khi vừa có sản phẩm, coi đó là cách để biết thị trường có cần hay không.',
        mature: 'Chứng minh nhu cầu bằng vài chục đơn từ kênh không mất tiền trước, rồi mới dùng quảng cáo để nhân lên cái đã chạy được.',
      },
      {
        weak: 'Tối ưu theo lượt bấm hoặc giá mỗi lượt bấm vì đó là số dễ nhìn và luôn có sẵn.',
        mature: 'Tối ưu theo hành động gần doanh thu nhất mà bạn đo được, và chấp nhận rằng số lượng nhỏ hơn nhưng đúng người hơn.',
      },
      {
        weak: 'Chạy tới khi hết tiền rồi mới đánh giá, hoặc tắt sau hai ngày vì thấy chưa có đơn nào.',
        mature: 'Viết trước ngân sách thử, thời hạn và ngưỡng chi phí mỗi chuyển đổi, rồi tuân thủ đúng những gì đã viết.',
      },
      {
        weak: 'Đổ lỗi cho quảng cáo khi không ra đơn và liên tục thay mẫu quảng cáo mới.',
        mature: 'Đọc số liệu theo tầng để định vị chỗ rò, vì phần lớn thất bại nằm ở trang đích hoặc ở tốc độ phản hồi chứ không ở mẫu quảng cáo.',
      },
    ],
    mistakes: [
      'Kết luận trên mẫu quá nhỏ, ví dụ tắt một mẫu quảng cáo sau hai trăm lượt hiển thị vì chưa có chuyển đổi nào, trong khi khác biệt quan sát được ở mức đó hoàn toàn có thể do ngẫu nhiên.',
      'Chia nhỏ ngân sách cho nhiều chiến dịch và nhiều nhóm đối tượng cùng lúc để thử cho nhanh, làm mỗi nhánh không đủ dữ liệu và cuối cùng không kết luận được nhánh nào tốt.',
      'Dùng các thủ thuật gây áp lực trong mẫu quảng cáo như hứa kết quả chắc chắn, ảnh trước sau gây hiểu lầm hoặc khai thác nỗi sợ về sức khoẻ và tài chính; ngoài rủi ro bị khoá tài khoản, đây là những lĩnh vực có quy định pháp luật riêng và cần tham vấn chuyên môn trước khi chạy.',
    ],
    worksheet: [
      'Bạn đã có bằng chứng nào cho thấy có người trả tiền cho sản phẩm này mà không cần quảng cáo? Ghi số đơn và nguồn.',
      'Chuyển đổi bạn sẽ tối ưu là hành động nào, và bạn đo nó bằng cách nào? Ai kiểm tra số liệu đó mỗi ngày?',
      'Ngân sách thử của bạn là bao nhiêu, trong bao nhiêu ngày, và ngưỡng chi phí mỗi chuyển đổi nào sẽ khiến bạn tắt?',
      'Trang đích của bạn yêu cầu người ta điền bao nhiêu trường? Trường nào có thể hỏi sau qua điện thoại?',
      'Ai trả lời khách trong bao lâu sau khi họ để lại thông tin? Nếu chưa có quy định, hãy đặt ra một mốc cụ thể.',
    ],
    exercises: [
      {
        label: 'Kiểm ba điều kiện',
        text: 'Viết bằng chứng cho từng điều kiện trước khi bật quảng cáo: nhu cầu có thật, trang nhận khách chạy tốt, có người trực trả lời. Nếu thiếu điều kiện nào thì ghi việc cần làm trước.',
        level: 'e',
      },
      {
        label: 'Đo trang đích bằng chính điện thoại của bạn',
        text: 'Mở trang đích trên điện thoại bằng mạng di động, bấm giờ từ lúc chạm tới lúc hoàn tất hành động. Ghi mọi chỗ bạn phải phóng to, chờ đợi hoặc quay lại.',
        level: 'e',
      },
      {
        label: 'Viết ngưỡng dừng',
        text: 'Viết một câu trước khi bật chiến dịch: chi tối đa bao nhiêu, trong bao nhiêu ngày, tắt nếu chi phí mỗi chuyển đổi vượt mức nào. Dán câu đó ở nơi bạn nhìn thấy khi mở bảng điều khiển.',
        level: 'e',
      },
      {
        label: 'Ba mẫu một biến',
        text: 'Tạo ba mẫu quảng cáo chỉ khác nhau ở câu mở đầu, giữ nguyên ảnh và lời mời. Chạy đủ lâu để mỗi mẫu có lượng dữ liệu tối thiểu bạn đã định trước rồi mới so sánh.',
        level: 'm',
      },
      {
        label: 'Phân tích theo tầng',
        text: 'Vẽ phễu bốn tầng từ hiển thị tới khách được liên hệ lại, điền số thật của chiến dịch gần nhất. Tính tỷ lệ rơi ở mỗi tầng và khoanh tầng rơi nhiều nhất.',
        level: 'm',
      },
      {
        label: 'Rút gọn biểu mẫu',
        text: 'Cắt biểu mẫu hiện tại xuống còn nhiều nhất ba trường, chuyển phần còn lại sang cuộc gọi xác nhận. Chạy song song hai phiên bản trong một tuần và so số biểu mẫu hợp lệ, không chỉ số biểu mẫu gửi.',
        level: 'm',
      },
      {
        label: 'Rà chuẩn mực quảng cáo',
        text: 'Đọc lại toàn bộ mẫu quảng cáo đang chạy, đánh dấu mọi khẳng định kết quả, mọi hình ảnh so sánh, mọi câu khai thác nỗi sợ. Với ngành có quy định riêng, ghi lại câu hỏi cần hỏi người phụ trách pháp lý.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: nhật ký chi tiêu',
        text: 'Bảy ngày, mỗi ngày ghi bốn con số vào một bảng: chi tiêu, số chuyển đổi, chi phí mỗi chuyển đổi, và số khách đã được liên hệ lại. Không đổi bất cứ thiết lập nào trong bảy ngày đó. Ngày thứ bảy nhìn lại toàn bảng và tự đánh giá: nếu bạn đã đổi thiết lập vào ngày thứ hai theo bản năng, kết luận của bạn sẽ khác thế nào so với dữ liệu đủ bảy ngày?',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nói quảng cáo là máy khuếch đại chứ không phải máy phát hiện nhu cầu?',
        a: 'Vì nó chỉ đưa thông điệp có sẵn của bạn tới nhiều người hơn với tốc độ tỷ lệ thuận với tiền chi. Nếu thông điệp chưa đúng hoặc quy trình sau khi khách quan tâm còn đứt gãy, quảng cáo sẽ nhân lên chính sự đứt gãy đó và bạn nhận được kết luận sai rằng thị trường không có nhu cầu. Cách phát hiện nhu cầu rẻ hơn nhiều là bán thủ công cho vài chục người đầu tiên qua các kênh không mất tiền, vì ở quy mô đó bạn nghe được lý do từ chối thay vì chỉ thấy một tỷ lệ chuyển đổi thấp.',
      },
      {
        q: 'Vì sao tối ưu theo lượt bấm thường dẫn tới kết quả kinh doanh kém?',
        a: 'Vì hệ thống phân phối quảng cáo sẽ tìm chính xác nhóm người có xu hướng thực hiện hành động bạn đặt làm mục tiêu. Nếu mục tiêu là lượt bấm, nó tìm những người hay bấm, một nhóm không trùng với nhóm hay mua. Kết quả là bạn có nhiều lượt truy cập rẻ mà rất ít đơn hàng, và số liệu bề mặt trông lại rất đẹp nên sai lầm này tồn tại lâu. Cách sửa là đo được một hành động gần doanh thu và đặt nó làm mục tiêu, dù ban đầu số lượng ít và chi phí trên mỗi đơn vị trông cao hơn nhiều.',
      },
      {
        q: 'Bao nhiêu dữ liệu là đủ để kết luận một mẫu quảng cáo thua?',
        a: 'Không có con số chung, nhưng nguyên tắc thực dụng là đặt trước một mức tối thiểu cả về số chuyển đổi lẫn thời gian chạy, và không kết luận trước khi đạt cả hai. Với chuyển đổi hiếm, chênh lệch giữa hai mẫu ở mức vài đơn vị hầu như luôn nằm trong dao động ngẫu nhiên. Ngoài ra cần chạy đủ trọn chu kỳ tuần vì hành vi ngày thường và cuối tuần khác nhau. Nếu ngân sách quá nhỏ để đạt mức tối thiểu, hãy giảm số biến thể xuống thay vì rút ngắn thời gian.',
      },
    ],
    plan7:
      'Ngày 1: kiểm ba điều kiện trước khi bật và ghi bằng chứng cho từng điều kiện. Ngày 2: định nghĩa chuyển đổi đáng tiền và kiểm xem nó có được ghi nhận đúng không. Ngày 3: đo trang đích bằng điện thoại và rút gọn biểu mẫu. Ngày 4: viết ngưỡng dừng, dựng chiến dịch tối giản với ba mẫu khác nhau một biến. Ngày 5: kiểm tra việc ghi nhận chuyển đổi và tốc độ phản hồi khách. Ngày 6: vẽ phễu bốn tầng với số liệu ba ngày đầu, chưa đổi gì. Ngày 7: rà chuẩn mực quảng cáo trên toàn bộ mẫu đang chạy và ghi lại câu hỏi pháp lý cần hỏi.',
    evidence:
      'Bằng chứng ở đây là hồ sơ một chiến dịch trọn vẹn: bản viết ngưỡng dừng đề ngày trước khi chạy, phễu bốn tầng với số thật, quyết định bạn đã ra và lý do, cùng kết quả sau khi sửa điểm rò. Người tuyển dụng đánh giá cao nhất câu chuyện bạn tắt một chiến dịch đúng lúc và giải thích được vì sao, vì kỷ luật dừng khó hơn kỹ năng bật. Nên kèm cả ghi chép về một mẫu quảng cáo bạn đã từ chối chạy vì không trung thực. Trong CV: "Chạy chiến dịch thử 3 triệu đồng cho dịch vụ dọn nhà; phân tích phễu phát hiện điểm rò ở biểu mẫu 9 trường, rút còn 3 trường và đưa chi phí mỗi lượt đăng ký về dưới ngưỡng đặt trước trong 10 ngày".',
    references: [
      { label: 'Google Ads Help — tài liệu chính thức về thiết lập và đo lường chiến dịch', url: 'https://support.google.com/google-ads', type: 'article' },
      { label: 'Think with Google — tài liệu về hành vi người dùng và đo lường quảng cáo số', url: 'https://www.thinkwithgoogle.com/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 12 — Xây dựng cộng đồng
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Cộng đồng khác danh sách người theo dõi ở một điểm quyết định: thành viên nói chuyện với nhau chứ không chỉ nghe bạn nói. Vì vậy công việc của người xây cộng đồng không phải sản xuất nội dung mà là tạo lý do và điều kiện để người lạ có ích cho nhau, rồi bảo vệ không gian đó khỏi những thứ làm người ta im lặng. Cộng đồng là khoản đầu tư dài hạn có độ trễ lớn: nó gần như không mang lại doanh thu trong vài tháng đầu, nhưng khi đã sống, nó tạo ra sự tin cậy và lượng giới thiệu mà không kênh trả tiền nào mua được.',
    why: {
      work: 'Cộng đồng người dùng làm giảm tải cho bộ phận hỗ trợ vì thành viên trả lời nhau, đồng thời là nơi bạn nghe được vấn đề thật trước khi nó thành khiếu nại. Nó cũng là nguồn người thử nghiệm sản phẩm mới đáng tin cậy nhất.',
      interview:
        'Kinh nghiệm vận hành một nhóm nghề vài trăm người là bằng chứng rất mạnh cho năng lực tổ chức và giao tiếp, đặc biệt nếu bạn kể được cách xử lý một mâu thuẫn nội bộ và cách giữ nhịp hoạt động.',
      study:
        'Tham gia đúng một cộng đồng chuyên môn và đóng góp đều đặn thường học nhanh hơn tự học một mình, vì bạn tiếp cận được các tình huống thực tế mà sách không có và nhận phản hồi từ người đã làm.',
      life: 'Kỹ năng làm cho người khác kết nối với nhau, đặt quy tắc rõ và xử lý xung đột sớm dùng được cho mọi nhóm bạn tham gia, từ nhóm phụ huynh của lớp tới câu lạc bộ ở địa phương.',
    },
    framework: [
      {
        name: 'Xác định lý do thành viên ở lại, không phải lý do bạn muốn có cộng đồng',
        detail:
          'Viết một câu từ góc nhìn thành viên: tôi tham gia vì ở đây tôi nhận được điều gì mà chỗ khác không có. Nếu lý do duy nhất là để nhận khuyến mãi thì thứ bạn đang xây là danh sách gửi tin, không phải cộng đồng.',
      },
      {
        name: 'Bắt đầu bằng một nhóm hạt nhân rất nhỏ',
        detail:
          'Mời trực tiếp mười tới hai mươi người phù hợp và làm cho họ có trải nghiệm tốt trước khi mở rộng. Một nhóm ba nghìn người im lặng khó cứu hơn nhiều so với một nhóm ba mươi người đang trò chuyện.',
      },
      {
        name: 'Tạo nghi thức lặp lại theo lịch',
        detail:
          'Một hoạt động cố định để thành viên biết khi nào có gì: buổi hỏi đáp tối thứ năm, chủ đề chia sẻ ca khó đầu tháng, bản tổng hợp cuối tuần. Nghi thức làm giảm chi phí quyết định tham gia và tạo thói quen quay lại.',
      },
      {
        name: 'Đặt quy tắc rõ và điều tiết sớm',
        detail:
          'Ba tới năm quy tắc viết bằng ngôn ngữ đời thường, dán ở nơi ai cũng thấy, kèm hệ quả cụ thể. Xử lý vi phạm sớm và nhất quán quan trọng hơn việc có nhiều quy tắc; một thành viên công kích người khác mà không bị nhắc sẽ làm hàng chục người lặng lẽ rời đi.',
      },
      {
        name: 'Nuôi người đóng góp, đừng chỉ nuôi nội dung',
        detail:
          'Nhận ra và ghi nhận những người hay trả lời giúp người khác, trao cho họ vai trò và quyền nhất định. Cộng đồng sống được khi phần lớn giá trị do thành viên tạo ra, còn bạn chỉ giữ vai trò tạo điều kiện.',
      },
      {
        name: 'Nối với kinh doanh một cách trung thực',
        detail:
          'Không biến nhóm thành nơi bán hàng, nhưng cũng không giấu việc bạn là doanh nghiệp. Cách bền vững là giá trị kinh doanh đến gián tiếp: hiểu vấn đề khách sớm hơn, được giới thiệu, và có nơi để thử ý tưởng trước khi đầu tư lớn.',
      },
    ],
    scenario:
      'Một nhà cung cấp vật tư ngành điện lạnh muốn giữ chân nhóm thợ kỹ thuật vốn hay đổi nơi mua theo giá. Thay vì giảm giá, họ lập một nhóm nghề cho thợ điện lạnh trong khu vực với lý do tham gia rất cụ thể: nơi hỏi đáp ca khó và tra cứu mã lỗi máy. Họ mời trực tiếp mười tám thợ quen, đặt ba quy tắc gồm không công kích cá nhân, không rao bán hàng ngoài mục cho phép, và đăng ảnh thật khi hỏi ca khó. Nghi thức cố định là tối thứ năm có một kỹ thuật viên lâu năm trả lời câu hỏi trong một giờ, và đầu tháng có bài tổng hợp ba ca khó nhất. Nhà cung cấp không đăng bảng giá trong nhóm, chỉ trả lời khi được hỏi. Sau khoảng nửa năm, nhóm có vài trăm thành viên, phần lớn câu hỏi được chính các thợ trả lời cho nhau, và bộ phận kinh doanh nhận thấy khách mới thường nói được người trong nhóm giới thiệu. Quan trọng không kém, họ phát hiện sớm hai dòng linh kiện hay lỗi và đổi nhà sản xuất trước khi nhận khiếu nại diện rộng.',
    comparison: [
      {
        weak: 'Mở nhóm rồi mời hàng nghìn người vào ngay để có số lượng đẹp.',
        mature: 'Bắt đầu với vài chục người phù hợp, làm cho họ trò chuyện được với nhau, rồi mới mở rộng theo tốc độ mà không khí vẫn giữ được.',
      },
      {
        weak: 'Người quản trị trả lời mọi câu hỏi để chứng tỏ chuyên môn.',
        mature: 'Chờ và tạo điều kiện cho thành viên trả lời trước, ghi nhận người trả lời tốt, chỉ bổ sung khi cần đính chính hoặc khi không ai trả lời.',
      },
      {
        weak: 'Ngại xử lý một thành viên gây khó chịu vì họ hoạt động nhiều và mang lại tương tác.',
        mature: 'Nhắc riêng sớm, áp dụng quy tắc nhất quán kể cả với người có ảnh hưởng, vì sự an toàn của số đông quan trọng hơn tương tác của một người.',
      },
      {
        weak: 'Đo thành công bằng số thành viên và số bài đăng mỗi ngày.',
        mature: 'Đo bằng tỷ lệ thành viên có tham gia trong tháng, số câu hỏi được người khác trả lời, và số người quay lại sau lần đầu.',
      },
    ],
    mistakes: [
      'Xây cộng đồng với kỳ vọng nó thay thế kênh bán hàng trong quý này, rồi khi chưa thấy doanh thu thì bắt đầu đăng bài quảng cáo dày đặc, làm hỏng chính thứ khiến người ta ở lại.',
      'Để nhóm không có nghi thức và không có người dẫn dắt, chỉ dựa vào may mắn rằng thành viên sẽ tự nói chuyện; sau vài tuần im lặng, nhóm trở thành nơi chỉ còn tin rao vặt.',
      'Trộn lẫn vai trò doanh nghiệp và vai trò thành viên một cách mập mờ, ví dụ dùng tài khoản cá nhân giả làm người dùng bình thường để khen sản phẩm của chính mình — khi bị phát hiện, toàn bộ niềm tin đã xây mất trong một ngày.',
    ],
    worksheet: [
      'Viết một câu từ góc nhìn thành viên giải thích vì sao họ ở lại nhóm của bạn. Câu đó có đúng nếu bạn ngừng khuyến mãi không?',
      'Ai là mười lăm người bạn sẽ mời đầu tiên, và vì sao chính họ? Bạn sẽ mời bằng cách nào?',
      'Nghi thức lặp lại theo lịch của bạn là gì, diễn ra vào lúc nào, và ai chịu trách nhiệm giữ nhịp?',
      'Ba tới năm quy tắc của nhóm là gì, viết bằng ngôn ngữ đời thường, kèm hệ quả khi vi phạm?',
      'Ba thành viên hay giúp người khác nhất hiện nay là ai? Bạn ghi nhận họ bằng cách nào trong tháng này?',
    ],
    exercises: [
      {
        label: 'Câu lý do ở lại',
        text: 'Viết năm phiên bản câu lý do thành viên ở lại, đọc cho ba người thuộc nhóm mục tiêu và hỏi họ câu nào khiến họ muốn tham gia. Giữ câu được chọn nhiều nhất.',
        level: 'e',
      },
      {
        label: 'Mời tay đôi',
        text: 'Mời mười lăm người bằng tin nhắn riêng, mỗi tin viết riêng nêu rõ vì sao bạn nghĩ họ hợp và họ sẽ nhận được gì. Đếm tỷ lệ nhận lời và ghi lại lý do từ chối.',
        level: 'e',
      },
      {
        label: 'Bộ quy tắc một màn hình',
        text: 'Viết ba tới năm quy tắc gọn trong một màn hình điện thoại, mỗi quy tắc kèm một ví dụ vi phạm cụ thể và hệ quả. Nhờ hai thành viên đọc và chỉ chỗ khó hiểu.',
        level: 'e',
      },
      {
        label: 'Nghi thức thử bốn tuần',
        text: 'Chọn một nghi thức lặp lại, chạy đúng lịch trong bốn tuần liên tiếp không bỏ buổi nào. Ghi số người tham gia từng buổi và điều chỉnh khung giờ nếu cần.',
        level: 'm',
      },
      {
        label: 'Nhường sân cho thành viên',
        text: 'Trong hai tuần, mỗi khi có câu hỏi mới, chờ ít nhất bốn giờ trước khi tự trả lời và chủ động nhắc tên một thành viên có thể giúp. Đếm tỷ lệ câu hỏi được thành viên khác trả lời.',
        level: 'm',
      },
      {
        label: 'Ghi nhận người đóng góp',
        text: 'Lập danh sách năm người giúp đỡ nhiều nhất tháng qua, ghi nhận công khai và trao cho họ một vai trò nhỏ có ý nghĩa. Sau một tháng, xem mức độ hoạt động của họ thay đổi thế nào.',
        level: 'm',
      },
      {
        label: 'Xử lý một mâu thuẫn thật',
        text: 'Viết quy trình xử lý mâu thuẫn gồm bốn bước: nhắc riêng, cảnh báo công khai theo quy tắc, tạm hạn chế, và mời rời nhóm. Áp dụng vào một tình huống có thật hoặc diễn tập với đồng nghiệp.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: bảy cuộc trò chuyện riêng',
        text: 'Bảy ngày, mỗi ngày nhắn riêng cho một thành viên khác nhau, hỏi họ đang gặp khó khăn gì trong nghề và họ muốn thấy gì trong nhóm. Không bán bất cứ thứ gì. Ngày thứ bảy tổng hợp bảy cuộc trò chuyện thành ba việc cần làm cho nhóm trong tháng tới và công bố cho thành viên biết bạn đã nghe được gì.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Khác biệt cốt lõi giữa một cộng đồng và một danh sách người theo dõi là gì?',
        a: 'Ở chiều của các mối quan hệ. Danh sách theo dõi có cấu trúc hình nan hoa: mọi người nối với bạn, không nối với nhau, nên giá trị phụ thuộc hoàn toàn vào việc bạn đăng gì. Cộng đồng có các liên kết ngang giữa thành viên, nên giá trị tiếp tục được tạo ra kể cả khi bạn im lặng vài ngày, và người ta ở lại vì những người khác chứ không chỉ vì bạn. Phép thử đơn giản là ngừng đăng một tuần và xem có gì diễn ra không.',
      },
      {
        q: 'Vì sao nên bắt đầu với vài chục người thay vì mở rộng nhanh?',
        a: 'Vì không khí của một nhóm hình thành từ những tương tác đầu tiên và rất khó sửa về sau. Trong nhóm nhỏ, mỗi câu hỏi đều được trả lời nên người mới thấy đây là nơi đáng hỏi; trong nhóm lớn mà thưa thớt, một câu hỏi không ai trả lời sẽ dạy cho tất cả những người đang quan sát rằng ở đây hỏi cũng vô ích. Ngoài ra, nhóm nhỏ cho phép bạn biết tên từng người và mời đúng người trả lời đúng câu, điều không làm được ở quy mô lớn.',
      },
      {
        q: 'Làm sao để cộng đồng mang lại giá trị kinh doanh mà không biến thành nơi bán hàng?',
        a: 'Bằng cách chấp nhận giá trị đó là gián tiếp và có độ trễ. Ba đường dẫn lành mạnh là: bạn nghe được vấn đề thật sớm hơn nên làm sản phẩm đúng hơn; thành viên tin tưởng nên giới thiệu bạn cho người khác; và bạn có nơi để thử ý tưởng trước khi đầu tư. Về mặt thực hành, hãy công khai bạn là doanh nghiệp, dành một mục riêng có quy định rõ cho các nội dung thương mại, và tuyệt đối không dùng tài khoản giả để tự khen. Nếu bạn cần doanh thu trong tháng này, hãy dùng kênh khác và để cộng đồng chạy theo nhịp riêng của nó.',
      },
    ],
    plan7:
      'Ngày 1: viết câu lý do thành viên ở lại và thử với ba người mục tiêu. Ngày 2: chọn nền tảng và dựng bộ quy tắc gọn trong một màn hình. Ngày 3: mời riêng mười lăm người hạt nhân bằng tin nhắn viết riêng. Ngày 4: chốt nghi thức lặp lại và công bố lịch cụ thể. Ngày 5: chạy buổi nghi thức đầu tiên và ghi số người tham gia. Ngày 6: nhắn riêng cho ba thành viên hỏi họ cần gì, chưa bán gì cả. Ngày 7: viết quy trình bốn bước xử lý mâu thuẫn và thống nhất với người cùng quản trị.',
    evidence:
      'Bằng chứng gồm bộ quy tắc do bạn viết, lịch nghi thức đã chạy liên tục nhiều tuần, và bảng theo dõi các chỉ số sống của nhóm: tỷ lệ thành viên có hoạt động trong tháng, tỷ lệ câu hỏi được thành viên khác trả lời, số người quay lại. Rất giá trị nếu bạn giữ được một ví dụ ẩn danh về cách xử lý mâu thuẫn từ lúc phát sinh tới lúc khép lại. Trong phỏng vấn, hãy kể cách bạn kiềm chế không bán hàng trong nhóm và giá trị kinh doanh đã đến bằng đường nào — chi tiết này phân biệt người xây cộng đồng thật với người chỉ lập một nhóm chat. Trong CV: "Lập và vận hành nhóm nghề cho thợ điện lạnh: 3 quy tắc, nghi thức hỏi đáp hằng tuần; phần lớn câu hỏi được thành viên trả lời lẫn nhau và nhóm trở thành nguồn giới thiệu khách mới sau 6 tháng".',
    references: [
      { label: 'CMX — tài nguyên về nghề xây dựng và vận hành cộng đồng', url: 'https://cmxhub.com/', type: 'article' },
      { label: 'Paul Graham — Do Things that Do not Scale', url: 'https://paulgraham.com/ds.html', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 13 — Quan hệ công chúng — Public Relations
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Quan hệ công chúng là việc kiếm được sự chú ý mà bạn không mua được, bằng cách trở thành nguồn tin có ích cho người đang phải viết bài cho công chúng của họ. Khác quảng cáo ở chỗ bạn không kiểm soát nội dung cuối cùng; đổi lại, lời của bên thứ ba có sức thuyết phục cao hơn nhiều vì nó không phải do bạn tự nói về mình. Phần khó nhất của nghề này không phải viết thông cáo mà là phân biệt được điều bạn thấy quan trọng với điều thật sự đáng đưa tin đối với độc giả của tờ báo đó.',
    why: {
      work: 'Một bài viết trên nguồn uy tín có thể mở cửa cho những cuộc gặp mà cả năm gọi điện chào hàng không đạt được, và nó tồn tại lâu như một chứng thực khi khách hàng tìm kiếm tên bạn. Trong khủng hoảng, năng lực phát ngôn quyết định thiệt hại kéo dài vài ngày hay vài tháng.',
      interview:
        'Ứng viên hay bị hỏi cách xử lý một tình huống truyền thông xấu. Người có nghề nói được thứ tự việc phải làm trong giờ đầu tiên, ai là người phát ngôn duy nhất, và nguyên tắc chỉ nói điều đã xác minh — điều này thể hiện năng lực chịu áp lực rõ hơn mọi câu trả lời lý thuyết.',
      study:
        'Tập viết một thông cáo báo chí buộc bạn nén thông tin theo thứ tự quan trọng giảm dần và tách dữ kiện khỏi ý kiến. Đó là bài luyện viết học thuật và viết báo cáo rất hiệu quả.',
      life: 'Khi bạn hay tổ chức của bạn bị hiểu lầm công khai, phản xạ tự nhiên là im lặng hoặc tranh cãi. Biết một quy trình phát ngôn đơn giản giúp bạn phản ứng bình tĩnh và giữ được uy tín cá nhân lâu dài.',
    },
    framework: [
      {
        name: 'Tách điều đáng đưa tin khỏi điều bạn tự hào',
        detail:
          'Một tin có giá trị với báo chí thường có ít nhất một trong các yếu tố: mới thật sự, ảnh hưởng tới nhiều người, có số liệu chưa ai công bố, hoặc gắn với một câu chuyện con người cụ thể. Kỷ niệm thành lập và ra mắt phiên bản nội bộ hầu như không thuộc nhóm đó.',
      },
      {
        name: 'Chuẩn bị hồ sơ dữ kiện trước khi tiếp cận',
        detail:
          'Một trang gồm dữ kiện kiểm chứng được, ảnh chất lượng dùng được ngay, tên và chức danh người phát ngôn, cùng những gì bạn sẵn sàng nói và không sẵn sàng nói. Nhà báo làm việc trong hạn nộp bài, nên bên nào giúp họ hoàn thành bài nhanh hơn sẽ được chọn.',
      },
      {
        name: 'Tiếp cận đúng người theo mảng họ viết',
        detail:
          'Đọc ba bài gần nhất của người bạn định liên hệ và nêu rõ vì sao câu chuyện này hợp với mảng của họ. Thư gửi hàng loạt cho một trăm địa chỉ hầu như luôn bị bỏ qua và còn làm bạn mất cơ hội cho lần sau.',
      },
      {
        name: 'Xây quan hệ dài hạn bằng cách hữu ích khi chưa cần gì',
        detail:
          'Chủ động cung cấp bình luận chuyên môn, dữ liệu ngành hoặc đầu mối cho những bài không nhắc tới bạn. Quan hệ được xây trước lúc cần thì mới dùng được vào lúc cần.',
      },
      {
        name: 'Có sẵn quy trình phát ngôn khi sự cố xảy ra',
        detail:
          'Ba việc trong giờ đầu: xác định một người phát ngôn duy nhất, xác minh dữ kiện đã chắc chắn, và ra một thông điệp ngắn gồm điều đã biết, điều đang làm và thời điểm cập nhật tiếp theo. Không suy đoán, không đổ lỗi, không hứa điều chưa chắc.',
      },
      {
        name: 'Đo bằng chất lượng đề cập, không bằng số lượng',
        detail:
          'Theo dõi bài viết có nêu đúng thông điệp chính không, xuất hiện trên nguồn mà khách của bạn thật sự đọc không, và có dẫn tới liên hệ thật không. Một bài đúng chỗ giá trị hơn hai mươi bài đăng lại.',
      },
    ],
    scenario:
      'Một hợp tác xã nông sản chuyển sang bán trực tiếp cho người tiêu dùng thành phố và muốn được biết tới, nhưng không có ngân sách quảng cáo. Thay vì gửi thông cáo về việc thành lập, người phụ trách truyền thông nhận ra thứ thật sự đáng kể là dữ liệu họ đã ghi chép suốt hai vụ: nhật ký canh tác và giá bán tại vườn của bốn mươi hộ, cho thấy khoảng cách giữa giá tại vườn và giá bán lẻ. Anh dựng một trang dữ liệu công khai, viết một trang tóm tắt dữ kiện có ghi rõ phương pháp thu thập và giới hạn của số liệu, kèm ảnh chụp có thể dùng ngay và số điện thoại của một xã viên sẵn sàng trả lời phỏng vấn. Anh liên hệ riêng bốn phóng viên chuyên viết mảng nông nghiệp và tiêu dùng, mỗi thư nhắc tới một bài họ vừa viết. Hai người phản hồi, một bài được đăng và một người xin dữ liệu cho bài sau. Đơn hàng tăng trong hai tuần kế tiếp, nhưng giá trị lâu hơn là hai phóng viên đó về sau chủ động hỏi hợp tác xã mỗi khi cần bình luận về giá nông sản.',
    comparison: [
      {
        weak: 'Gửi cùng một thông cáo cho hàng trăm địa chỉ báo chí và chờ đợi.',
        mature: 'Chọn ít người, đọc bài họ đã viết, và giải thích trong ba câu vì sao câu chuyện này thuộc đúng mảng của họ.',
      },
      {
        weak: 'Coi mọi hoạt động nội bộ là tin: kỷ niệm thành lập, ra mắt bộ nhận diện, khen thưởng nhân viên.',
        mature: 'Chỉ đề xuất khi có yếu tố thật sự đáng đưa tin với độc giả, và biến những dịp còn lại thành nội dung trên kênh của chính mình.',
      },
      {
        weak: 'Khi có sự cố thì im lặng chờ qua, hoặc để nhiều người cùng phát ngôn theo cách khác nhau.',
        mature: 'Một người phát ngôn duy nhất, chỉ nói điều đã xác minh, nêu rõ đang làm gì và khi nào sẽ cập nhật tiếp.',
      },
      {
        weak: 'Trả tiền để có bài viết trông như tin tức nhưng không ghi rõ đây là nội dung được tài trợ.',
        mature: 'Nếu là nội dung trả tiền thì ghi nhãn minh bạch; phần quan hệ công chúng thật thì kiếm bằng giá trị thông tin, không mua bằng phong bì.',
      },
    ],
    mistakes: [
      'Đòi được duyệt bài trước khi đăng hoặc đòi sửa từng câu, điều mà các toà soạn nghiêm túc không chấp nhận; cách đúng là chuẩn bị kỹ trước phỏng vấn và nói rõ điều gì được phép trích, thay vì can thiệp sau.',
      'Nói với nhà báo rằng câu này chỉ nói riêng không đưa lên báo sau khi đã lỡ lời, trong khi thoả thuận về việc phát ngôn ngoài ghi âm phải được thống nhất trước khi nói chứ không phải sau.',
      'Trong khủng hoảng, đưa ra suy đoán về nguyên nhân khi chưa xác minh xong để tỏ ra minh bạch, rồi phải đính chính hai ngày sau; mỗi lần đính chính làm giảm mạnh độ tin cậy của mọi phát ngôn tiếp theo.',
    ],
    worksheet: [
      'Trong ba tháng tới, doanh nghiệp bạn có điều gì thật sự đáng đưa tin với người ngoài? Kiểm bằng bốn yếu tố: mới, ảnh hưởng rộng, số liệu chưa ai có, câu chuyện con người.',
      'Bạn có dữ liệu nội bộ nào có thể công bố mà không lộ thông tin nhạy cảm, và phương pháp thu thập của nó là gì?',
      'Kể tên năm nhà báo hoặc kênh viết đúng mảng của bạn, kèm một bài gần đây của mỗi người và lý do câu chuyện của bạn hợp với họ.',
      'Nếu ngày mai có sự cố, ai là người phát ngôn duy nhất và ai là người dự phòng? Số điện thoại của họ nằm ở đâu?',
      'Ba câu hỏi khó nhất mà một nhà báo có thể hỏi bạn là gì, và câu trả lời trung thực của bạn cho từng câu?',
    ],
    exercises: [
      {
        label: 'Kiểm tính đáng đưa tin',
        text: 'Liệt kê năm việc doanh nghiệp bạn sắp làm, chấm mỗi việc theo bốn yếu tố đáng đưa tin. Giữ lại việc nào đạt ít nhất hai yếu tố và bỏ phần còn lại khỏi kế hoạch báo chí.',
        level: 'e',
      },
      {
        label: 'Một trang dữ kiện',
        text: 'Viết một trang gồm dữ kiện kiểm chứng được, ảnh dùng được ngay, người phát ngôn và thông tin liên hệ. Đưa cho một người ngoài đọc và hỏi họ hiểu câu chuyện là gì sau ba mươi giây.',
        level: 'e',
      },
      {
        label: 'Đọc trước khi gửi',
        text: 'Chọn năm nhà báo phù hợp, đọc ba bài gần nhất của mỗi người, ghi một câu về mảng và góc nhìn của họ. So với câu chuyện bạn định đề xuất và loại những người không hợp.',
        level: 'e',
      },
      {
        label: 'Thư đề xuất ba câu',
        text: 'Viết thư đề xuất dài không quá ba câu cho một nhà báo cụ thể: vì sao là họ, câu chuyện là gì, bạn có sẵn gì cho họ. Gửi và ghi lại tỷ lệ phản hồi so với thư dài trước đây.',
        level: 'm',
      },
      {
        label: 'Diễn tập phỏng vấn khó',
        text: 'Nhờ đồng nghiệp đóng vai nhà báo và hỏi ba câu khó nhất trong danh sách của bạn. Ghi âm, nghe lại và đánh dấu chỗ bạn suy đoán hoặc nói điều chưa xác minh.',
        level: 'm',
      },
      {
        label: 'Công bố một dữ liệu',
        text: 'Chọn một tập dữ liệu nội bộ có thể công khai, viết rõ phương pháp thu thập, phạm vi và giới hạn, rồi công bố. Theo dõi ai trích dẫn nó trong hai tháng.',
        level: 'm',
      },
      {
        label: 'Sổ tay khủng hoảng',
        text: 'Viết quy trình bốn trang cho giờ đầu tiên khi có sự cố: ai làm gì, mẫu thông điệp đầu tiên, kênh công bố, nhịp cập nhật. Diễn tập với một tình huống giả định và bấm giờ.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: hữu ích trước khi cần',
        text: 'Bảy ngày, mỗi ngày làm một việc giúp một người viết hoặc một kênh truyền thông mà không xin gì cho mình: gửi một số liệu họ đang tìm, giới thiệu một nguồn tin, chỉ ra một sai sót nhỏ một cách lịch sự. Ngày thứ bảy ghi lại ai đã phản hồi và bạn học được gì về cách họ làm việc.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao gửi thông cáo hàng loạt lại phản tác dụng?',
        a: 'Vì người nhận đánh giá thư dựa trên mức độ liên quan tới mảng họ phụ trách, và một thư không nhắc gì tới công việc cụ thể của họ là tín hiệu rõ ràng rằng bạn chưa đọc họ. Ngoài việc bị bỏ qua, các thư như vậy còn khiến địa chỉ của bạn bị nhớ theo hướng tiêu cực, nên lần sau khi bạn có câu chuyện thật sự tốt thì cơ hội cũng thấp hơn. Ít mà đúng luôn hiệu quả hơn nhiều mà chung chung.',
      },
      {
        q: 'Trong giờ đầu tiên của một sự cố, nên nói gì khi chưa biết nguyên nhân?',
        a: 'Nói ba điều và chỉ ba điều: những gì đã xác minh chắc chắn, những việc đang được làm ngay lúc này, và thời điểm bạn sẽ cập nhật tiếp. Việc thừa nhận chưa biết nguyên nhân là chấp nhận được và thường được đánh giá cao hơn một lời giải thích vội. Điều cần tránh tuyệt đối là suy đoán nguyên nhân, đổ lỗi cho bên thứ ba khi chưa có kết luận, hoặc hứa một mốc khắc phục mà bộ phận kỹ thuật chưa xác nhận, vì mọi phát ngôn sai sau đó phải đính chính và mỗi lần đính chính làm hỏng độ tin cậy của cả những thông tin đúng.',
      },
      {
        q: 'Ranh giới giữa quan hệ công chúng và quảng cáo trá hình nằm ở đâu?',
        a: 'Ở hai chỗ: ai kiểm soát nội dung và người đọc có biết điều đó không. Quan hệ công chúng đúng nghĩa là bạn cung cấp thông tin còn toà soạn giữ toàn quyền biên tập, kể cả quyền viết điều bạn không thích. Khi bạn trả tiền để nội dung xuất hiện theo ý mình, đó là quảng cáo và nó phải được ghi nhãn rõ ràng để người đọc biết. Việc trả tiền để có bài trông giống tin tức mà không ghi nhãn vừa vi phạm chuẩn mực nghề báo vừa là hành vi gây nhầm lẫn cho người tiêu dùng, và ở nhiều nơi có quy định pháp luật điều chỉnh.',
      },
    ],
    plan7:
      'Ngày 1: chấm tính đáng đưa tin cho năm việc sắp làm và chọn một. Ngày 2: viết một trang dữ kiện kèm ảnh dùng được ngay. Ngày 3: chọn năm nhà báo và đọc ba bài gần nhất của từng người. Ngày 4: viết và gửi năm thư đề xuất riêng, mỗi thư ba câu. Ngày 5: chuẩn bị và diễn tập ba câu hỏi khó nhất, ghi âm nghe lại. Ngày 6: viết sổ tay khủng hoảng cho giờ đầu tiên và xác định người phát ngôn. Ngày 7: gửi một thứ hữu ích cho một người viết mà không xin gì, bắt đầu quan hệ dài hạn.',
    evidence:
      'Bằng chứng gồm bộ hồ sơ báo chí do bạn dựng, các thư đề xuất thật kèm tỷ lệ phản hồi, và danh sách bài viết đã xuất hiện có ghi rõ bài nào nêu đúng thông điệp chính. Nếu từng xử lý sự cố, giữ lại dòng thời gian ẩn danh: sự việc xảy ra lúc nào, thông điệp đầu tiên ra lúc nào, các mốc cập nhật, và kết quả. Trong phỏng vấn, hãy nói được một lần bạn khuyên tổ chức không phát ngôn vội vì dữ kiện chưa chắc — sự kiềm chế đó là dấu hiệu của người có nghề. Trong CV: "Xây hồ sơ dữ liệu công khai về giá nông sản của 40 hộ và tiếp cận 4 phóng viên đúng mảng; được đăng 1 bài chuyên đề và trở thành nguồn bình luận thường xuyên cho 2 kênh".',
    references: [
      { label: 'Public Relations Society of America — chuẩn mực nghề và tài nguyên PR', url: 'https://www.prsa.org/', type: 'article' },
      { label: 'Poynter Institute — chuẩn mực báo chí và cách làm việc với nhà báo', url: 'https://www.poynter.org/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 14 — Bán hàng — Sales
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Bán hàng là giúp người khác ra một quyết định mua mà họ sẽ vẫn thấy đúng sau sáu tháng. Định nghĩa này loại bỏ ngay hai hiểu lầm phổ biến: rằng bán hàng là nói cho hay, và rằng thành công đo bằng đơn ký được hôm nay. Người bán giỏi vận hành một quy trình có thể lặp lại: biết mình đang ở bước nào với từng khách, biết tiêu chí để chuyển sang bước sau, và biết loại sớm những cơ hội không phù hợp để dồn thời gian cho cơ hội thật. Doanh số ổn định là hệ quả của quy trình, không phải của cảm hứng.',
    why: {
      work: 'Dù bạn không mang chức danh bán hàng, mọi vị trí đều có lúc phải thuyết phục người khác đồng ý với một đề xuất có ràng buộc nguồn lực. Hiểu quy trình mua của phía bên kia làm giảm số vòng đi lại và số đề xuất chết ở giữa đường.',
      interview:
        'Người phỏng vấn thường hỏi về một đơn hàng khó. Ứng viên mạnh không kể chiến công mà mô tả quy trình: nguồn cơ hội, cách xác định người quyết, các bước và tiêu chí, lý do thua ở những đơn khác.',
      study:
        'Sinh viên đi thực tập thường phát hiện phần lớn công việc thực tế là thuyết phục nội bộ. Học sớm cách trình bày đề xuất theo mối bận tâm của người nghe rút ngắn rất nhiều thời gian hoà nhập.',
      life: 'Kỹ năng này dùng khi bạn thương lượng mua nhà, xin học bổng hay vận động người thân đồng ý một kế hoạch: xác định ai thật sự quyết, họ lo gì, và bước nhỏ tiếp theo là gì.',
    },
    framework: [
      {
        name: 'Mô tả quy trình mua của khách, không phải quy trình bán của bạn',
        detail:
          'Vẽ các bước mà khách phải đi qua trong tổ chức của họ: ai phát hiện nhu cầu, ai thẩm định, ai duyệt ngân sách, ai ký. Mọi giai đoạn trong hệ thống theo dõi của bạn nên tương ứng với một hành vi quan sát được ở phía khách, ví dụ đã có buổi làm việc với bộ phận kỹ thuật, chứ không phải cảm giác của người bán.',
      },
      {
        name: 'Tạo và phân loại nguồn cơ hội',
        detail:
          'Ghi rõ mỗi cơ hội đến từ đâu: giới thiệu, tìm kiếm, sự kiện, chủ động liên hệ. Sau vài tháng bạn sẽ thấy nguồn nào cho tỷ lệ thắng cao nhất và nên dồn công sức vào đâu, thay vì trải đều theo cảm tính.',
      },
      {
        name: 'Loại sớm bằng tiêu chí rõ ràng',
        detail:
          'Đặt vài câu hỏi lọc ngay đầu: vấn đề này có nằm trong ưu tiên năm nay không, ai sẽ duyệt ngân sách, đã có mốc thời gian chưa. Nói lời từ chối sớm với cơ hội không phù hợp là hành vi tôn trọng cả hai bên và là cách duy nhất để có thời gian cho cơ hội thật.',
      },
      {
        name: 'Mỗi lần tiếp xúc đều để lại một bước tiếp theo có ngày',
        detail:
          'Không kết thúc cuộc gặp bằng câu để tôi gửi thêm thông tin. Kết thúc bằng một việc cụ thể với ngày cụ thể mà cả hai bên đồng ý, và gửi lại bằng văn bản. Cơ hội chết nhiều nhất ở khoảng trống giữa hai lần tiếp xúc.',
      },
      {
        name: 'Rút kinh nghiệm từ đơn thua nhiều hơn từ đơn thắng',
        detail:
          'Với mỗi đơn thua, ghi lại lý do do khách nói và lý do bạn suy đoán, tách riêng hai thứ đó. Sau vài chục đơn, bảng này chỉ ra chính xác chỗ quy trình của bạn hỏng, còn đơn thắng thường chỉ củng cố những gì bạn đã tin.',
      },
    ],
    scenario:
      'Một công ty in bao bì có ba nhân viên kinh doanh, tất cả đều làm theo cách riêng và báo cáo bằng cảm nhận. Giám đốc kinh doanh ngồi lại vẽ quy trình mua của khách và nhận ra mọi đơn thắng đều đi qua đúng bốn bước: khách gửi mẫu và yêu cầu, bộ phận kỹ thuật của khách xác nhận thông số, khách chấp nhận bản in thử, rồi phòng mua đàm phán giá. Anh chuyển bảng theo dõi thành bốn giai đoạn tương ứng, mỗi giai đoạn có một tiêu chí kiểm chứng được. Kết quả đầu tiên rất khó chịu: hơn một nửa số cơ hội đang được báo là sắp ký thực ra chưa qua bước xác nhận thông số, tức là chưa có gì chắc chắn. Đội bán hàng thêm hai câu hỏi lọc ngay đầu về ưu tiên và người duyệt ngân sách, chủ động dừng bảy cơ hội không đủ điều kiện, và dồn thời gian cho những cơ hội đã có bản in thử. Sau một quý, dự báo doanh số sát thực tế hơn hẳn, và thời gian trung bình từ lần gặp đầu tới lúc ký rút ngắn vì mọi người biết bước kế tiếp phải làm gì.',
    comparison: [
      {
        weak: 'Đặt tên giai đoạn theo cảm giác của người bán: quan tâm, rất quan tâm, sắp ký.',
        mature: 'Đặt tên giai đoạn theo hành vi quan sát được ở phía khách, ví dụ đã xác nhận thông số kỹ thuật, đã nhận bản in thử.',
      },
      {
        weak: 'Theo đuổi mọi cơ hội đến tay vì sợ bỏ lỡ, chia nhỏ thời gian cho ba mươi khách cùng lúc.',
        mature: 'Lọc sớm bằng câu hỏi về ưu tiên, ngân sách và mốc thời gian, chủ động dừng những cơ hội không đủ điều kiện.',
      },
      {
        weak: 'Kết thúc cuộc gặp bằng lời hứa gửi thêm tài liệu rồi chờ khách liên hệ lại.',
        mature: 'Chốt một bước tiếp theo có ngày và có người chịu trách nhiệm ở cả hai phía, gửi lại bằng văn bản ngay sau buổi gặp.',
      },
      {
        weak: 'Bán mọi thứ cho mọi người, kể cả khi biết sản phẩm không giải quyết được vấn đề của họ.',
        mature: 'Từ chối và giới thiệu sang nơi phù hợp hơn khi không giải quyết được, vì một khách hàng sai sẽ tốn nhiều chi phí hỗ trợ và để lại đánh giá xấu.',
      },
    ],
    mistakes: [
      'Nhầm sự lịch sự của khách với tín hiệu mua: khách khen sản phẩm hay, hẹn sẽ trao đổi nội bộ, nhưng không ai xác nhận ngân sách hay mốc thời gian; những cơ hội này chiếm chỗ trong dự báo và làm cả đội tin rằng quý này sẽ ổn.',
      'Chỉ nói chuyện với một người ở phía khách, thường là người dễ gặp nhất, rồi bất ngờ khi quyết định bị chặn ở một bộ phận chưa từng tham gia cuộc trò chuyện nào.',
      'Giảm giá sớm khi thấy khách chần chừ, trong khi nguyên nhân thật là họ chưa thấy rõ giá trị hoặc chưa được duyệt ngân sách; việc này vừa không gỡ được nút thắt vừa dạy khách rằng cứ chờ là sẽ có giá thấp hơn.',
    ],
    worksheet: [
      'Vẽ các bước mà khách của bạn phải đi qua trong tổ chức của họ trước khi ký. Bạn biết chắc bước nào và đang đoán bước nào?',
      'Các giai đoạn trong bảng theo dõi hiện tại của bạn dựa trên hành vi nào của khách? Giai đoạn nào đang dựa vào cảm giác?',
      'Ba câu hỏi lọc bạn sẽ hỏi trong mười lăm phút đầu là gì, và câu trả lời nào sẽ khiến bạn dừng lại?',
      'Trong danh sách cơ hội hiện tại, cái nào không có bước tiếp theo với ngày cụ thể? Liệt kê và xử lý từng cái.',
      'Năm đơn thua gần nhất: lý do khách nói là gì, và lý do bạn tin là thật sự là gì? Ghi thành hai cột riêng.',
    ],
    exercises: [
      {
        label: 'Vẽ quy trình mua',
        text: 'Chọn ba khách hàng đã ký gần nhất, gọi hỏi họ mô tả lại các bước nội bộ từ lúc biết tới bạn đến lúc ký. Tìm các bước chung và vẽ thành một sơ đồ.',
        level: 'e',
      },
      {
        label: 'Đổi tên giai đoạn',
        text: 'Lấy bảng theo dõi hiện có, viết lại tên từng giai đoạn thành một hành vi quan sát được ở phía khách. Sau đó xếp lại toàn bộ cơ hội đang có theo định nghĩa mới và ghi số cơ hội bị tụt giai đoạn.',
        level: 'e',
      },
      {
        label: 'Ba câu hỏi lọc',
        text: 'Viết ba câu hỏi lọc về ưu tiên, người duyệt ngân sách và mốc thời gian. Dùng trong mười cuộc trò chuyện đầu tiên tuần này và ghi lại số cơ hội bạn quyết định dừng.',
        level: 'e',
      },
      {
        label: 'Dọn danh sách cơ hội',
        text: 'Rà toàn bộ cơ hội đang mở, đánh dấu cái nào không có tiếp xúc nào trong ba mươi ngày hoặc không có bước tiếp theo có ngày. Đóng chúng lại hoặc liên hệ dứt điểm trong tuần.',
        level: 'm',
      },
      {
        label: 'Bản đồ người quyết',
        text: 'Với ba cơ hội lớn nhất, vẽ sơ đồ những người tham gia quyết định: ai dùng, ai thẩm định, ai duyệt chi, ai có quyền phủ quyết. Đánh dấu người bạn chưa từng nói chuyện và lên kế hoạch tiếp cận.',
        level: 'm',
      },
      {
        label: 'Bảng lý do thua',
        text: 'Lập bảng cho mười đơn thua gần nhất với hai cột lý do khách nói và lý do bạn suy đoán. Tìm mẫu lặp lại và chọn một chỗ trong quy trình để sửa trước.',
        level: 'm',
      },
      {
        label: 'Tự chấm một chu kỳ bán',
        text: 'Ghi âm hoặc ghi chép toàn bộ các lần tiếp xúc của một cơ hội từ đầu tới kết thúc. Sau khi kết thúc, đọc lại và đánh dấu ba thời điểm bạn lẽ ra nên hỏi một câu khó nhưng đã bỏ qua.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: mỗi ngày một bước tiếp theo',
        text: 'Bảy ngày, mỗi cuộc trò chuyện với khách đều phải kết thúc bằng một bước tiếp theo có ngày và có tên người chịu trách nhiệm ở cả hai phía, gửi lại bằng tin nhắn hoặc email ngay sau đó. Ghi lại số lần khách không đồng ý bước tiếp theo. Ngày thứ bảy nhìn danh sách đó: những cơ hội mà khách không chịu cam kết bất cứ bước nhỏ nào chính là những cơ hội bạn đang tự lừa mình.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao giai đoạn trong bảng theo dõi phải dựa trên hành vi của khách chứ không dựa trên cảm giác của người bán?',
        a: 'Vì cảm giác không kiểm chứng được và có xu hướng lạc quan, nhất là khi người bán bị đánh giá theo dự báo. Khi giai đoạn được định nghĩa bằng hành vi quan sát được, chẳng hạn khách đã cử bộ phận kỹ thuật tham gia hoặc đã ký duyệt bản thử, thì mọi người nhìn cùng một sự thật và dự báo trở nên dùng được. Nó cũng cho biết chính xác việc cần làm tiếp theo là gì, vì mỗi giai đoạn ứng với một hành vi cần tạo ra ở phía khách.',
      },
      {
        q: 'Vì sao nói lời từ chối sớm lại làm tăng doanh số?',
        a: 'Vì thời gian là nguồn lực khan hiếm nhất của người bán, và mỗi cơ hội không phù hợp vẫn tiêu tốn các buổi họp, các bản đề xuất và sự chú ý. Loại sớm giải phóng thời gian cho những cơ hội có khả năng thắng thật, đồng thời giữ dự báo trung thực nên cả tổ chức lên kế hoạch sản xuất và nhân sự chính xác hơn. Ngoài ra, khách được nói thẳng rằng sản phẩm không phù hợp thường ghi nhớ tích cực và quay lại khi tình huống đổi hoặc giới thiệu người khác.',
      },
      {
        q: 'Khách nói cần thêm thời gian suy nghĩ, nên hiểu thế nào?',
        a: 'Thường đó là cách nói lịch sự cho một trong ba tình huống: họ chưa thấy đủ giá trị để ưu tiên, họ chưa có ngân sách hoặc thẩm quyền, hoặc còn một người chưa đồng ý mà bạn chưa gặp. Phản ứng sai là im lặng chờ hoặc giảm giá. Phản ứng đúng là hỏi một câu làm rõ và một câu chốt bước tiếp theo, ví dụ hỏi cụ thể điều gì họ cần cân nhắc thêm và ai cùng cân nhắc, rồi đề nghị một mốc gặp lại có ngày. Nếu khách không đồng ý bất kỳ bước nhỏ nào, đó là câu trả lời và nên ghi nhận trung thực vào bảng theo dõi.',
      },
    ],
    plan7:
      'Ngày 1: gọi ba khách đã ký để dựng lại quy trình mua thật của họ. Ngày 2: viết lại tên các giai đoạn theo hành vi và xếp lại toàn bộ cơ hội. Ngày 3: soạn ba câu hỏi lọc và dùng ngay trong ngày. Ngày 4: dọn danh sách cơ hội, đóng những cái đã chết. Ngày 5: vẽ bản đồ người quyết cho ba cơ hội lớn nhất. Ngày 6: lập bảng lý do thua cho mười đơn gần nhất. Ngày 7: chốt định nghĩa giai đoạn cho cả đội và thống nhất nguyên tắc mọi cuộc gặp đều kết thúc bằng bước tiếp theo có ngày.',
    evidence:
      'Bằng chứng gồm sơ đồ quy trình mua của khách do bạn dựng từ phỏng vấn thật, định nghĩa giai đoạn dựa trên hành vi, và bảng lý do thua nhiều chục dòng có phân loại. Bảng lý do thua là hiện vật thuyết phục nhất vì rất ít người chịu làm và nó chứng minh bạn học từ thất bại một cách có hệ thống. Trong phỏng vấn, hãy kể một lần bạn chủ động dừng một cơ hội lớn và điều gì xảy ra sau đó. Trong CV: "Chuẩn hoá 4 giai đoạn bán hàng theo hành vi của khách cho đội 3 người tại công ty in bao bì; loại sớm 7 cơ hội không đủ điều kiện, đưa dự báo doanh số sát thực tế và rút ngắn thời gian từ tiếp xúc đầu tới ký trong 1 quý".',
    references: [
      { label: 'HubSpot Blog — mục Sales: quy trình và phương pháp bán hàng', url: 'https://blog.hubspot.com/sales', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Sales', url: 'https://hbr.org/topic/subject/sales', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 15 — Khám phá nhu cầu khách hàng — Sales Discovery
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Khám phá nhu cầu là giai đoạn bạn chuyển từ đoán sang biết: biết hiện trạng của khách bằng con số, biết hệ quả của hiện trạng đó và ai đang chịu, biết họ đã thử gì và vì sao chưa xong, biết ai quyết và theo tiêu chí nào. Một buổi khám phá tốt có đặc điểm dễ nhận ra: khách nói nhiều hơn bạn, và cuối buổi họ hiểu vấn đề của chính mình rõ hơn lúc bắt đầu, kể cả khi họ không mua. Nếu bạn rời buổi gặp mà không viết được ba con số về tình trạng của họ, buổi đó chỉ là một buổi giới thiệu sản phẩm được đặt tên khác.',
    why: {
      work: 'Phần lớn đề xuất bị từ chối vì nó giải quyết một vấn đề mà khách không xếp vào ưu tiên. Khám phá kỹ giúp bạn viết đề xuất bằng chính ngôn ngữ và con số của khách, và biết trước sẽ vấp phải phản đối nào.',
      interview:
        'Khi ứng tuyển vị trí bán hàng hoặc tư vấn, nhà tuyển dụng hay yêu cầu đóng vai buổi gặp đầu tiên. Người kém sẽ thuyết trình sản phẩm; người giỏi sẽ hỏi bốn tới năm câu có thứ tự và tóm tắt lại điều nghe được trước khi nói bất cứ điều gì về giải pháp.',
      study:
        'Kỹ năng hỏi để hiểu bối cảnh trước khi đề xuất giải pháp là cốt lõi của mọi bài tập tình huống và mọi dự án tốt nghiệp có khách hàng thật.',
      life: 'Trong đời sống, đây là kỹ năng giúp bạn không đưa lời khuyên vội cho người thân: hỏi về hiện trạng, hệ quả và những gì họ đã thử, trước khi nói mình nghĩ gì.',
    },
    framework: [
      {
        name: 'Chuẩn bị giả thuyết trước khi gặp',
        detail:
          'Viết ra ba điều bạn đoán về vấn đề của họ dựa trên ngành, quy mô và những gì quan sát được từ bên ngoài. Có giả thuyết giúp bạn hỏi sắc hơn; nhưng phải nói rõ đó là giả thuyết và sẵn sàng bỏ khi dữ liệu ngược lại.',
      },
      {
        name: 'Hỏi hiện trạng bằng con số',
        detail:
          'Hiện nay việc đó đang diễn ra thế nào, bao lâu một lần, mất bao nhiêu thời gian, do ai làm, chi phí bao nhiêu. Con số biến cuộc trò chuyện từ cảm giác thành cơ sở, và về sau chính con số đó là phần quan trọng nhất trong đề xuất của bạn.',
      },
      {
        name: 'Đào tới hệ quả và người chịu hệ quả',
        detail:
          'Sau khi biết hiện trạng, hỏi điều gì xảy ra vì nó và ai là người gánh: bộ phận nào phải làm bù, khách hàng của họ phản ứng ra sao, con số nào của ai bị ảnh hưởng. Vấn đề chỉ được cấp ngân sách khi hệ quả chạm tới chỉ số của một người có quyền chi.',
      },
      {
        name: 'Hỏi về những gì đã thử và vì sao chưa xong',
        detail:
          'Hầu hết vấn đề tồn tại lâu đều đã có người thử giải quyết. Biết họ đã thử gì giúp bạn tránh đề xuất lại đúng thứ đã thất bại và hiểu rào cản thật, vốn thường mang tính tổ chức nhiều hơn kỹ thuật.',
      },
      {
        name: 'Làm rõ tiêu chí quyết định và quy trình mua',
        detail:
          'Hỏi thẳng: nếu chọn một giải pháp, anh chị sẽ so theo tiêu chí nào, ai cùng tham gia quyết định, các bước phê duyệt gồm những gì và mất bao lâu. Câu hỏi này thường bị né vì sợ đường đột, nhưng khách nghiêm túc luôn trả lời và câu trả lời quyết định toàn bộ chiến lược của bạn.',
      },
      {
        name: 'Tóm tắt lại và chốt bước sau',
        detail:
          'Cuối buổi, nói lại bằng lời của bạn: hiện trạng, hệ quả, tiêu chí, và bước tiếp theo có ngày. Gửi bản tóm tắt bằng văn bản trong ngày để khách sửa. Bản tóm tắt được khách xác nhận là tài sản có giá trị nhất bạn mang về từ buổi gặp.',
      },
    ],
    scenario:
      'Một công ty lắp điện mặt trời áp mái cho nhà máy có buổi gặp đầu với giám đốc một xưởng dệt. Nhân viên kinh doanh không mở máy chiếu. Anh hỏi hiện trạng bằng con số: tiền điện trung bình mỗi tháng, tỷ lệ dùng vào giờ cao điểm, diện tích mái còn trống, tuổi mái tôn. Rồi anh hỏi hệ quả: chi phí điện chiếm bao nhiêu phần trong giá thành, điều đó ảnh hưởng thế nào tới khả năng báo giá cho khách nước ngoài, ai là người bị hỏi về con số đó mỗi quý. Giám đốc nói ra một điều không có trong giả thuyết ban đầu: khách hàng châu Âu của họ bắt đầu yêu cầu số liệu về nguồn năng lượng, và đây mới là áp lực thật, lớn hơn cả tiền điện. Anh hỏi tiếp họ đã thử gì và biết công ty từng nhận báo giá hai năm trước nhưng dừng vì lo mái không chịu tải. Cuối buổi anh tóm tắt lại ba điều, hẹn bước tiếp theo là khảo sát kết cấu mái do kỹ sư thực hiện vào ngày cụ thể, và gửi biên bản trong chiều hôm đó. Đề xuất sau này được viết quanh yêu cầu báo cáo cho khách nước ngoài chứ không chỉ quanh tiết kiệm tiền điện.',
    comparison: [
      {
        weak: 'Mở đầu buổi gặp bằng phần giới thiệu công ty dài mười lăm phút và bộ slide năng lực.',
        mature: 'Xin phép hỏi trước, dành phần lớn thời gian cho câu hỏi, và chỉ nói về giải pháp sau khi đã hiểu hiện trạng và hệ quả.',
      },
      {
        weak: 'Hỏi những câu mà khách chỉ cần trả lời có hoặc không, ví dụ anh có muốn giảm chi phí không.',
        mature: 'Hỏi những câu buộc phải trả lời bằng dữ kiện: hiện đang mất bao nhiêu giờ mỗi tuần, ai làm việc đó, lần gần nhất xảy ra sự cố là khi nào.',
      },
      {
        weak: 'Nghe thấy một vấn đề khớp với sản phẩm của mình là lập tức chuyển sang trình bày tính năng.',
        mature: 'Ghi lại và tiếp tục đào thêm một lớp về hệ quả và người chịu, vì vấn đề đầu tiên khách nêu thường không phải vấn đề được cấp ngân sách.',
      },
      {
        weak: 'Né câu hỏi về ngân sách và quy trình phê duyệt vì sợ mất thiện cảm.',
        mature: 'Hỏi thẳng và giải thích lý do hỏi là để không làm mất thời gian của cả hai bên nếu chưa đúng thời điểm.',
      },
    ],
    mistakes: [
      'Biến buổi khám phá thành cuộc thẩm vấn với danh sách hai mươi câu hỏi đọc lần lượt, khiến khách cảm thấy đang bị điền biểu mẫu và ngừng chia sẻ những chi tiết quan trọng nhất vốn chỉ xuất hiện khi cuộc trò chuyện tự nhiên.',
      'Chỉ khám phá với một người dễ tiếp cận rồi coi bức tranh đã đủ, trong khi hệ quả và tiêu chí quyết định thường nằm ở một bộ phận khác chưa hề tham gia.',
      'Nghe ra một nhu cầu mà sản phẩm hiện tại không đáp ứng nhưng vẫn gật đầu và hứa sẽ làm được, tạo ra một hợp đồng chắc chắn dẫn tới tranh chấp và một khách hàng sẽ nói xấu bạn nhiều năm.',
    ],
    worksheet: [
      'Ba giả thuyết của bạn về vấn đề của khách trước buổi gặp là gì, và bạn dựa vào đâu để đưa ra chúng?',
      'Viết năm câu hỏi về hiện trạng buộc khách phải trả lời bằng con số hoặc tần suất, không câu nào trả lời được bằng có hoặc không.',
      'Với vấn đề khách nêu, hệ quả chạm tới chỉ số của ai trong tổ chức? Bạn đã nói chuyện với người đó chưa?',
      'Khách đã thử cách nào trước đây và vì sao chưa xong? Rào cản là kỹ thuật, ngân sách hay tổ chức?',
      'Tiêu chí quyết định và các bước phê duyệt của họ gồm những gì, mất bao lâu, và ai có quyền phủ quyết?',
    ],
    exercises: [
      {
        label: 'Năm câu hỏi con số',
        text: 'Viết năm câu hỏi hiện trạng cho ngành khách hàng của bạn, mỗi câu bắt buộc dẫn tới một con số. Thử với một khách quen và ghi lại con số thu được.',
        level: 'e',
      },
      {
        label: 'Đo tỷ lệ nói',
        text: 'Ghi âm một buổi gặp khi được phép, sau đó ước lượng tỷ lệ thời gian bạn nói so với khách. Đặt mục tiêu cụ thể cho buổi sau và đo lại.',
        level: 'e',
      },
      {
        label: 'Ba lớp hệ quả',
        text: 'Chọn một vấn đề khách vừa nêu, viết chuỗi ba lớp: vấn đề dẫn tới điều gì, điều đó dẫn tới điều gì, và cuối cùng chạm tới chỉ số của ai. Kiểm lại với khách ở buổi sau.',
        level: 'e',
      },
      {
        label: 'Hỏi về lần đã thử',
        text: 'Trong năm buổi gặp tới, luôn hỏi khách đã từng thử giải quyết việc này bằng cách nào và vì sao dừng. Ghi lại rào cản và phân loại thành kỹ thuật, ngân sách, hay tổ chức.',
        level: 'm',
      },
      {
        label: 'Hỏi về quy trình mua',
        text: 'Soạn cách hỏi thẳng về tiêu chí quyết định và các bước phê duyệt kèm một câu giải thích lý do hỏi. Dùng trong ba cơ hội và ghi lại phản ứng của khách.',
        level: 'm',
      },
      {
        label: 'Biên bản trong ngày',
        text: 'Sau mỗi buổi gặp, gửi bản tóm tắt gồm hiện trạng, hệ quả, tiêu chí và bước tiếp theo có ngày, xin khách sửa nếu sai. Theo dõi tỷ lệ khách phản hồi và số chỗ họ sửa.',
        level: 'm',
      },
      {
        label: 'Khám phá nhiều bên',
        text: 'Với một cơ hội đang mở, xin gặp thêm hai người ở bộ phận khác mà bạn chưa từng nói chuyện. So bức tranh của họ với bức tranh của người liên hệ đầu tiên và ghi lại chỗ mâu thuẫn.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: câu hỏi thay vì câu khẳng định',
        text: 'Bảy ngày, trong mọi cuộc trò chuyện với khách tiềm năng, tự đặt luật không được nói câu khẳng định nào về sản phẩm trước phút thứ mười lăm. Mỗi tối ghi lại điều bạn biết thêm mà nếu nói sớm bạn đã bỏ lỡ. Ngày thứ bảy đọc lại toàn bộ và rút ra ba câu hỏi hiệu quả nhất để đưa vào quy trình chuẩn.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao vấn đề đầu tiên khách nêu thường không phải vấn đề được cấp ngân sách?',
        a: 'Vì người ta thường nêu triệu chứng gần nhất với công việc hằng ngày của mình, còn ngân sách được duyệt dựa trên hệ quả chạm tới chỉ số mà một người có quyền chi phải chịu trách nhiệm. Một nhân viên nói phần mềm chậm; điều được duyệt chi lại là việc chậm đó khiến giao hàng trễ và làm mất một khách lớn. Vì vậy sau khi nghe vấn đề, việc cần làm không phải là trình bày giải pháp mà là đi thêm hai lớp để tìm ra hệ quả và tên người chịu hệ quả đó.',
      },
      {
        q: 'Hỏi thẳng về ngân sách và quy trình phê duyệt có làm mất thiện cảm không?',
        a: 'Không, nếu bạn nêu lý do và hỏi vào đúng thời điểm. Sau khi đã hiểu hiện trạng và hệ quả, một câu như để tránh làm mất thời gian của anh chị nếu chưa đúng lúc, cho em hỏi việc này thường được duyệt qua những bước nào là hợp lý và chuyên nghiệp. Khách nghiêm túc luôn trả lời vì họ cũng muốn tiết kiệm thời gian. Người né tránh câu hỏi này thường là dấu hiệu cơ hội chưa thật, và biết điều đó sớm chính là giá trị của câu hỏi.',
      },
      {
        q: 'Khi khám phá cho thấy sản phẩm của bạn không giải quyết được vấn đề, nên làm gì?',
        a: 'Nói thẳng, càng sớm càng tốt, và nếu có thể thì giới thiệu sang một hướng phù hợp hơn. Nhận đơn trong tình huống này gần như luôn dẫn tới ba chi phí: khối lượng hỗ trợ lớn, khả năng tranh chấp hợp đồng, và một khách hàng kể lại trải nghiệm xấu cho những người cùng ngành. Ngược lại, việc từ chối trung thực thường được nhớ rất lâu và tạo ra giới thiệu về sau. Hãy ghi lại nhu cầu đó vào hồ sơ sản phẩm, vì nếu nó lặp lại ở nhiều khách thì đó là dữ liệu quan trọng cho việc phát triển sản phẩm.',
      },
    ],
    plan7:
      'Ngày 1: viết ba giả thuyết và năm câu hỏi hiện trạng dẫn tới con số. Ngày 2: dùng bộ câu hỏi trong một buổi gặp thật và ghi âm khi được phép. Ngày 3: nghe lại, đo tỷ lệ nói và đánh dấu chỗ bạn cắt lời. Ngày 4: luyện chuỗi ba lớp hệ quả cho hai cơ hội đang mở. Ngày 5: hỏi về những gì khách đã thử và phân loại rào cản. Ngày 6: hỏi thẳng về tiêu chí quyết định và quy trình phê duyệt trong một cơ hội. Ngày 7: chuẩn hoá mẫu biên bản sau buổi gặp và gửi cho mọi khách đã gặp trong tuần.',
    evidence:
      'Bằng chứng gồm bộ câu hỏi khám phá do bạn thiết kế cho đúng ngành của mình và các biên bản sau buổi gặp đã được khách xác nhận — hiện vật thứ hai đặc biệt thuyết phục vì nó cho thấy bạn kiểm chứng lại hiểu biết thay vì đoán. Nên kèm một ví dụ ẩn danh về lần khám phá làm đổi hẳn cách viết đề xuất. Trong phỏng vấn, hãy nhận lời đóng vai buổi gặp đầu và thể hiện đúng thứ tự hỏi trước, tóm tắt, rồi mới nói giải pháp. Trong CV: "Thiết kế bộ câu hỏi khám phá cho khách hàng nhà máy; phát hiện yêu cầu báo cáo nguồn năng lượng từ đối tác xuất khẩu là động lực mua thật, viết lại đề xuất theo hướng đó và đưa cơ hội qua bước khảo sát kỹ thuật".',
    references: [
      { label: 'Gong Labs — phân tích dữ liệu các cuộc gọi bán hàng thực tế', url: 'https://www.gong.io/', type: 'article' },
      { label: 'Product Talk — kỹ thuật phỏng vấn khách hàng dựa trên câu chuyện có thật', url: 'https://www.producttalk.org/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 16 — Demo và trình bày sản phẩm
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Một buổi demo tốt không phải chuyến tham quan tính năng mà là màn tái hiện tương lai của khách sau khi vấn đề của họ được giải quyết. Nguyên tắc chi phối là demo ngược: bắt đầu từ khoảnh khắc có giá trị nhất với chính họ, dùng dữ liệu và ngôn ngữ của họ, và chỉ đi sâu vào phần họ hỏi. Chỉ số cần theo dõi không phải bạn đã trình bày được bao nhiêu phần trăm sản phẩm mà là khách đã nói bao nhiêu, đã tự thao tác chưa, và cuối buổi có bước tiếp theo cụ thể hay không.',
    why: {
      work: 'Với sản phẩm phức tạp, buổi demo thường là lần duy nhất nhiều người ở phía khách cùng ngồi lại. Một buổi tổ chức kém đốt cháy cơ hội tập hợp đó và rất khó xin lại lần thứ hai.',
      interview:
        'Nhiều vị trí kinh doanh giải pháp hoặc tư vấn triển khai yêu cầu ứng viên demo thử. Người phỏng vấn nhìn vào việc bạn có hỏi trước khi trình bày không, có bỏ qua các phần không liên quan không, và có kiểm soát được thời gian không.',
      study:
        'Bảo vệ đồ án cũng là một buổi demo: người nghe quan tâm bài toán và kết quả, không quan tâm bạn đã dùng bao nhiêu thư viện. Tập cắt bỏ phần không liên quan là kỹ năng chuyển thẳng sang mọi buổi thuyết trình sau này.',
      life: 'Khi bạn giới thiệu một công cụ cho gia đình hoặc hướng dẫn đồng nghiệp lớn tuổi dùng một ứng dụng, cùng nguyên tắc áp dụng: bắt đầu từ việc họ cần làm, để họ tự bấm, và đừng kể về những nút họ chưa cần.',
    },
    framework: [
      {
        name: 'Xác nhận lại hiểu biết trước khi trình bày',
        detail:
          'Mở đầu bằng ba câu tóm tắt điều bạn đã hiểu từ buổi khám phá và hỏi có gì cần sửa không. Việc này vừa chứng minh bạn đã nghe, vừa cho phép chỉnh hướng trước khi lỡ dành nửa giờ cho phần sai.',
      },
      {
        name: 'Bắt đầu từ khoảnh khắc giá trị nhất',
        detail:
          'Cho họ thấy ngay kết quả cuối cùng mà họ mong muốn, ví dụ bảng tổng hợp cuối tháng tự động ra đúng biểu mẫu họ đang phải làm tay. Sau đó mới đi ngược lại xem cần những gì để có kết quả đó. Đừng bắt đầu từ màn hình đăng nhập và phần thiết lập.',
      },
      {
        name: 'Dùng dữ liệu và từ ngữ của khách',
        detail:
          'Chuẩn bị dữ liệu mẫu mang tên sản phẩm, tên chi nhánh, tên biểu mẫu của chính họ. Chi phí chuẩn bị khoảng một giờ nhưng nó chuyển buổi demo từ trừu tượng sang cụ thể và làm giảm hẳn số câu hỏi kiểu liệu có áp dụng được cho chúng tôi không.',
      },
      {
        name: 'Ba cảnh, không phải ba mươi tính năng',
        detail:
          'Chọn tối đa ba tình huống công việc thật và diễn trọn từng cảnh từ đầu tới kết quả. Sau mỗi cảnh dừng lại hỏi cảnh này có giống việc của anh chị không và chỗ nào khác. Phần còn lại của sản phẩm chỉ nhắc khi được hỏi.',
      },
      {
        name: 'Chuyển tay điều khiển cho khách',
        detail:
          'Nếu có thể, để một người phía khách tự thao tác một tác vụ đơn giản ngay trong buổi. Một lần họ tự làm được có sức thuyết phục hơn hai mươi phút bạn thao tác giúp, và nó cũng phơi bày sớm những chỗ khó dùng mà bạn cần biết.',
      },
      {
        name: 'Kết bằng bước tiếp theo, không bằng câu hỏi mở',
        detail:
          'Đừng kết thúc bằng anh chị thấy thế nào. Hãy tóm tắt điều đã thống nhất, nêu điều còn phải kiểm chứng, và đề nghị một bước cụ thể có ngày, ví dụ chạy thử với dữ liệu thật của một chi nhánh trong hai tuần.',
      },
    ],
    scenario:
      'Một nhà cung cấp phần mềm quản lý kho cho các nhà phân phối hàng tiêu dùng có buổi demo với công ty phân phối bảy kho. Trước đây họ luôn bắt đầu bằng phần giới thiệu công ty và sau đó lần lượt qua mười một phân hệ, kết thúc bằng câu hỏi anh chị thấy thế nào. Lần này người phụ trách giải pháp làm khác. Anh xin trước một tệp danh mục hàng và một biên bản kiểm kê thật của khách, nạp vào bản chạy thử. Buổi demo mở đầu bằng ba câu tóm tắt lại vấn đề đã ghi trong biên bản khám phá: chênh lệch giữa tồn thực tế và tồn trên sổ ở hai kho miền Trung, và việc phải chờ tới cuối tháng mới phát hiện. Cảnh đầu tiên là màn hình cảnh báo chênh lệch theo ngày, hiện đúng tên các mã hàng của họ. Sau cảnh đó anh dừng và hỏi thủ kho có đúng không, và nhận được một chi tiết mới về việc hàng khuyến mãi ghép lốc bị đếm nhầm. Cảnh thứ hai chuyển thẳng sang xử lý đúng tình huống đó, và anh mời thủ kho tự thao tác một lần. Buổi demo kết thúc với thoả thuận chạy thử tại một kho trong hai tuần, có tên người phụ trách và ngày bắt đầu, thay vì lời hứa sẽ trao đổi nội bộ.',
    comparison: [
      {
        weak: 'Chạy cùng một kịch bản demo cho mọi khách hàng vì nó đã được chuẩn bị kỹ.',
        mature: 'Chọn ba cảnh theo đúng vấn đề đã ghi trong biên bản khám phá của khách đó và bỏ hết phần không liên quan.',
      },
      {
        weak: 'Dùng dữ liệu mẫu chung chung với tên sản phẩm ví dụ và các con số vô nghĩa.',
        mature: 'Xin trước dữ liệu thật đã ẩn phần nhạy cảm, nạp vào bản chạy thử để khách thấy đúng thế giới của họ trên màn hình.',
      },
      {
        weak: 'Trình bày liên tục bốn mươi phút rồi mới dành thời gian cho câu hỏi ở cuối.',
        mature: 'Dừng sau mỗi cảnh để hỏi có giống việc của anh chị không, và điều chỉnh phần còn lại theo câu trả lời.',
      },
      {
        weak: 'Khi được hỏi về một tính năng chưa có, trả lời rằng sắp có để giữ không khí tích cực.',
        mature: 'Nói thẳng hiện chưa có, nêu cách xử lý thay thế nếu có, và chỉ nhắc tới kế hoạch phát triển khi nó đã được cam kết nội bộ với mốc rõ ràng.',
      },
    ],
    mistakes: [
      'Coi buổi demo là dịp chứng minh sản phẩm nhiều tính năng, nên trình bày cả những phần khách không dùng; hệ quả là các câu hỏi lan man về những thứ không liên quan và thời gian dành cho phần quan trọng bị cắt mất.',
      'Không kiểm tra trước môi trường trình bày: dữ liệu chưa nạp, máy chiếu sai tỷ lệ, mạng yếu, tài khoản thử hết hạn; những sự cố này chiếm mất phần mở đầu quý giá nhất và tạo ấn tượng thiếu chuẩn bị.',
      'Hứa những tính năng chưa tồn tại để vượt qua một phản đối trong buổi; điều này tạo kỳ vọng sai, thường dẫn tới tranh chấp khi triển khai và làm bộ phận kỹ thuật mất niềm tin vào đội bán hàng.',
    ],
    worksheet: [
      'Ba câu tóm tắt hiểu biết bạn sẽ mở đầu buổi demo là gì? Chúng lấy từ biên bản khám phá nào?',
      'Khoảnh khắc giá trị nhất với khách này là màn hình hoặc kết quả nào? Vì sao bạn tin như vậy?',
      'Bạn cần dữ liệu gì của khách để buổi demo trở nên cụ thể, và bạn xin nó bằng cách nào, xử lý bảo mật ra sao?',
      'Ba cảnh bạn sẽ diễn là gì, mỗi cảnh kéo dài bao lâu, và bạn sẽ bỏ hẳn phần nào của sản phẩm?',
      'Bước tiếp theo bạn sẽ đề nghị ở cuối buổi là gì, ai chịu trách nhiệm hai phía, và ngày cụ thể nào?',
    ],
    exercises: [
      {
        label: 'Ba câu mở đầu',
        text: 'Viết ba câu tóm tắt vấn đề của một khách cụ thể lấy từ biên bản khám phá, đọc to và bấm giờ. Nếu quá bốn mươi giây, rút gọn tiếp.',
        level: 'e',
      },
      {
        label: 'Tìm khoảnh khắc giá trị',
        text: 'Với ba khách hàng khác nhau, viết ra màn hình hoặc kết quả nào bạn sẽ cho thấy đầu tiên và lý do. So ba câu trả lời và ghi nhận chúng khác nhau ở đâu.',
        level: 'e',
      },
      {
        label: 'Danh sách kiểm trước buổi',
        text: 'Lập danh sách kiểm mười mục trước mỗi buổi demo: dữ liệu đã nạp, tài khoản còn hạn, tỷ lệ màn hình, phương án dự phòng khi mất mạng. Dùng trong ba buổi liên tiếp.',
        level: 'e',
      },
      {
        label: 'Nạp dữ liệu của khách',
        text: 'Xin trước một tệp dữ liệu thật đã ẩn phần nhạy cảm, nạp vào bản chạy thử và diễn lại một cảnh. So phản ứng của khách với những buổi dùng dữ liệu mẫu chung.',
        level: 'm',
      },
      {
        label: 'Cắt xuống ba cảnh',
        text: 'Lấy kịch bản demo hiện tại, cắt xuống còn ba cảnh và đo tổng thời gian. Ghi lại những phần bạn thấy tiếc khi bỏ và kiểm xem có khách nào từng hỏi về chúng không.',
        level: 'm',
      },
      {
        label: 'Chuyển tay điều khiển',
        text: 'Trong ba buổi tới, mời một người phía khách tự thao tác một tác vụ. Ghi lại chỗ họ lúng túng và chuyển những chỗ đó cho bộ phận sản phẩm.',
        level: 'm',
      },
      {
        label: 'Diễn tập tình huống hỏng',
        text: 'Chuẩn bị phương án cho ba sự cố: mất mạng, dữ liệu chưa nạp, và một tính năng lỗi ngay trên màn hình. Diễn tập cách xử lý từng tình huống trước đồng nghiệp mà không nói dối về nguyên nhân.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: đo tỷ lệ khách nói',
        text: 'Bảy ngày, với mọi buổi trình bày lớn nhỏ, ghi lại hai con số: ước lượng phần trăm thời gian khách nói, và bước tiếp theo có ngày mà bạn chốt được. Ngày thứ bảy đối chiếu hai cột: những buổi khách nói nhiều hơn có cho ra bước tiếp theo cụ thể hơn không, và bạn cần đổi gì trong kịch bản để tăng tỷ lệ đó.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên bắt đầu demo từ kết quả cuối chứ không từ đầu quy trình?',
        a: 'Vì sự chú ý cao nhất nằm ở những phút đầu và người nghe cần một lý do để tiếp tục đầu tư sự chú ý đó. Bắt đầu từ màn hình đăng nhập và thiết lập là bắt họ trả trước một khoản chi phí nhận thức mà chưa nhận được gì. Khi họ đã nhìn thấy kết quả mà họ muốn, mọi bước phía trước đột nhiên trở nên đáng quan tâm vì chúng có đích rõ ràng. Đây cũng là lý do phần thiết lập nên được nhắc gọn và chỉ đào sâu khi khách hỏi.',
      },
      {
        q: 'Vì sao dừng lại hỏi sau mỗi cảnh lại quan trọng hơn việc trình bày trôi chảy?',
        a: 'Vì mục đích buổi demo không phải là biểu diễn mà là kiểm chứng xem giải pháp có khớp với công việc thật của họ không. Mỗi lần dừng là một cơ hội phát hiện điểm lệch, và điểm lệch phát hiện trong buổi thì sửa được ngay, còn nếu để tới lúc triển khai thì rất đắt. Ngoài ra, những chi tiết quan trọng nhất về quy trình nội bộ của khách thường chỉ xuất hiện khi họ phản ứng với một màn hình cụ thể, chứ không xuất hiện khi bạn hỏi chung chung ở buổi khám phá.',
      },
      {
        q: 'Khi khách hỏi một tính năng chưa có, nên trả lời thế nào?',
        a: 'Nói thẳng là hiện chưa có, rồi làm ba việc: hỏi lại họ cần nó để giải quyết việc gì, trình bày cách xử lý thay thế bằng những gì đang có, và ghi nhận yêu cầu vào hồ sơ sản phẩm với tên khách và bối cảnh. Chỉ nhắc tới kế hoạch phát triển khi nó đã được cam kết nội bộ với mốc cụ thể, và khi nhắc thì nói rõ đó là kế hoạch chứ không phải cam kết hợp đồng. Hứa cho xong buổi là cách nhanh nhất để tạo một dự án triển khai thất bại và một khách hàng cảm thấy bị lừa.',
      },
    ],
    plan7:
      'Ngày 1: đọc lại biên bản khám phá của ba cơ hội và viết ba câu mở đầu cho từng cơ hội. Ngày 2: xác định khoảnh khắc giá trị nhất cho mỗi khách. Ngày 3: xin dữ liệu thật đã ẩn phần nhạy cảm và nạp vào bản chạy thử. Ngày 4: cắt kịch bản hiện tại xuống ba cảnh và bấm giờ. Ngày 5: lập danh sách kiểm trước buổi và diễn tập ba tình huống hỏng. Ngày 6: chạy một buổi demo thật có mời khách tự thao tác. Ngày 7: viết lại kịch bản dựa trên phản ứng thu được và chuẩn hoá phần kết bằng bước tiếp theo có ngày.',
    evidence:
      'Bằng chứng gồm kịch bản demo ba cảnh do bạn thiết kế riêng cho một khách cụ thể, danh sách kiểm trước buổi, và bảng theo dõi kết quả sau mỗi buổi: tỷ lệ buổi có bước tiếp theo cụ thể, tỷ lệ buổi khách tự thao tác. Nếu giữ được phiên bản kịch bản cũ dạng tham quan tính năng để so sánh thì càng thuyết phục. Trong phỏng vấn, hãy nhận lời demo thử và thể hiện việc hỏi trước, cắt bỏ phần không liên quan, và kết bằng đề nghị cụ thể. Trong CV: "Thiết kế lại kịch bản demo cho phần mềm quản lý kho: từ 11 phân hệ xuống 3 cảnh dùng dữ liệu thật của khách; tăng tỷ lệ buổi demo kết thúc bằng cam kết chạy thử có ngày cụ thể".',
    references: [
      { label: 'Nielsen Norman Group — nguyên tắc về khả năng dùng được và cách người dùng học giao diện', url: 'https://www.nngroup.com/topic/web-usability/', type: 'article' },
      { label: 'Duarte — nguyên tắc thiết kế và dẫn dắt một buổi trình bày', url: 'https://www.duarte.com/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 17 — Xử lý từ chối và phản đối
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Phản đối là thông tin, không phải rào chắn. Khi khách nói đắt quá hay để năm sau tính, họ đang tiết lộ một thứ họ chưa nói trước đó: một so sánh trong đầu, một rủi ro chưa được gỡ, hoặc một người khác trong tổ chức chưa đồng ý. Vì vậy thao tác đầu tiên không bao giờ là trả lời, mà là làm rõ. Người xử lý phản đối giỏi có tỷ lệ hỏi lại cao và gần như không bao giờ tranh luận; họ hiểu rằng thắng một cuộc tranh luận với khách hàng là cách chắc chắn để mất đơn hàng đó.',
    why: {
      work: 'Phản đối xuất hiện ở mọi nơi chứ không chỉ trong bán hàng: khi bạn đề xuất ngân sách, khi bạn xin đổi quy trình, khi bạn bảo vệ một thiết kế. Cùng một bộ thao tác dùng được cho tất cả.',
      interview:
        'Người phỏng vấn hay nêu một phản đối thật với hồ sơ của bạn, ví dụ bạn thiếu kinh nghiệm ở mảng này. Ứng viên phản xạ tự vệ sẽ thua; ứng viên làm rõ mối lo cụ thể phía sau rồi trả lời bằng bằng chứng sẽ được nhớ.',
      study:
        'Khi bảo vệ đồ án, câu hỏi phản biện của hội đồng cũng là phản đối. Thói quen hỏi lại để hiểu đúng câu hỏi trước khi trả lời giúp bạn tránh trả lời lệch và mất điểm oan.',
      life: 'Trong gia đình, phản đối thường được nói bằng câu ngắn gọn che giấu một lo lắng lớn. Tập tách lời nói bề mặt khỏi mối lo bên dưới làm giảm rất nhiều xung đột không cần thiết.',
    },
    framework: [
      {
        name: 'Phân loại trước khi phản ứng',
        detail:
          'Bốn loại thường gặp: về giá và ngân sách, về thời điểm, về niềm tin đối với bạn hoặc sản phẩm, và về quyền quyết định. Mỗi loại cần một hướng xử lý khác nhau, nên đoán sai loại thì mọi câu trả lời sau đó đều lệch.',
      },
      {
        name: 'Làm rõ bằng một câu hỏi cụ thể',
        detail:
          'Hỏi lại để biến câu chung chung thành điều cụ thể: khi anh nói đắt, anh đang so với phương án nào; khi anh nói để năm sau, điều gì cần xảy ra trước đã. Câu hỏi làm rõ phải nhẹ nhàng và có lý do, tránh giọng chất vấn.',
      },
      {
        name: 'Xác nhận mối lo trước khi trả lời',
        detail:
          'Nói lại mối lo bằng lời của bạn và đợi họ gật. Bước này chỉ tốn vài giây nhưng nó ngăn bạn trả lời một câu hỏi không ai hỏi, và nó làm phía kia hạ phòng thủ vì thấy được nghe.',
      },
      {
        name: 'Trả lời bằng bằng chứng gần nhất với mối lo',
        detail:
          'Chọn đúng loại bằng chứng: lo về hiệu quả thì đưa số liệu có phạm vi; lo về rủi ro triển khai thì đưa quy trình và cam kết dịch vụ; lo về việc thuyết phục cấp trên thì đưa tài liệu một trang để họ mang đi. Đừng chất đống mọi bằng chứng bạn có.',
      },
      {
        name: 'Kiểm tra đã gỡ được chưa và chốt bước sau',
        detail:
          'Hỏi thẳng điều này đã giải toả được băn khoăn của anh chị chưa, và còn gì khác không. Nếu chưa gỡ được thì đừng chuyển sang chốt đơn; nếu đã gỡ thì đề nghị bước tiếp theo ngay lúc đó.',
      },
    ],
    scenario:
      'Một công ty tư vấn và đào tạo an toàn lao động chào gói huấn luyện cho một nhà máy cơ khí. Trưởng phòng hành chính nói ngắn gọn: chi phí cao hơn đơn vị năm ngoái nhiều quá. Nhân viên tư vấn không giảm giá và cũng không giải thích ngay về chất lượng. Anh hỏi một câu làm rõ: đơn vị năm ngoái báo giá cho bao nhiêu người, mấy buổi, và có kèm phần đánh giá lại sau ba tháng không. Câu trả lời hé lộ hai điều: gói cũ là lớp lý thuyết một buổi cho ba mươi người, còn gói mới gồm huấn luyện thực hành theo nhóm nhỏ và một buổi đánh giá lại. Anh xác nhận lại mối lo thật là ngân sách năm nay đã duyệt theo mức cũ chứ không phải nghi ngờ chất lượng. Từ đó cuộc trò chuyện chuyển sang tìm cấu trúc phù hợp: tách gói thành hai đợt qua hai kỳ ngân sách, giữ nguyên đơn giá cho mỗi học viên. Anh cũng gửi một tài liệu một trang so sánh phạm vi hai gói để trưởng phòng mang đi thuyết phục ban giám đốc, vì người phải bảo vệ ngân sách là chính người đó chứ không phải anh.',
    comparison: [
      {
        weak: 'Nghe đắt quá là lập tức đề nghị giảm giá hoặc tặng thêm dịch vụ.',
        mature: 'Hỏi đang so với phương án nào và trong phạm vi nào, vì phần lớn phản đối về giá thực chất là phản đối về phạm vi hoặc về ngân sách đã duyệt.',
      },
      {
        weak: 'Trả lời phản đối bằng cách giải thích dài về ưu điểm sản phẩm.',
        mature: 'Chỉ đưa đúng một bằng chứng khớp với mối lo đã được xác nhận, rồi im lặng để khách phản hồi.',
      },
      {
        weak: 'Coi câu để tôi suy nghĩ thêm là dấu hiệu tích cực và chờ khách liên hệ lại.',
        mature: 'Hỏi cụ thể điều gì cần cân nhắc và ai cùng cân nhắc, rồi đề nghị một mốc gặp lại có ngày.',
      },
      {
        weak: 'Dùng áp lực tâm lý để vượt qua phản đối: nhấn mạnh cơ hội sắp mất, tạo cảm giác người khác đều đã mua.',
        mature: 'Chấp nhận rằng có những phản đối chính đáng không thể gỡ, và ghi nhận trung thực rằng đây không phải khách phù hợp lúc này.',
      },
    ],
    mistakes: [
      'Chuẩn bị sẵn một câu trả lời thuộc lòng cho từng phản đối và bắn ra ngay khi nghe từ khoá quen thuộc, khiến khách cảm thấy đang nói chuyện với một kịch bản và ngừng nói ra mối lo thật.',
      'Coi mọi phản đối là chưa hiểu đúng nên cần giải thích thêm, trong khi nhiều phản đối là đánh giá đúng về sự không phù hợp, và việc cố vượt qua chỉ dẫn tới một khách hàng sai sẽ rời đi sau vài tháng.',
      'Trả lời phản đối trước mặt nhiều người mà quên rằng người nêu phản đối có thể đang bảo vệ vị thế của họ trong phòng; đôi khi cách đúng là ghi nhận công khai và hẹn trao đổi riêng để họ không phải rút lui trước đồng nghiệp.',
    ],
    worksheet: [
      'Liệt kê năm phản đối bạn nghe nhiều nhất trong ba tháng qua, ghi nguyên văn cách khách nói.',
      'Phân loại từng phản đối vào bốn nhóm: giá và ngân sách, thời điểm, niềm tin, quyền quyết định. Nhóm nào chiếm nhiều nhất?',
      'Với mỗi phản đối, viết một câu hỏi làm rõ mà bạn sẽ dùng thay cho việc trả lời ngay.',
      'Bằng chứng nào bạn đang có cho từng nhóm mối lo? Nhóm nào bạn chưa có bằng chứng gì và cần chuẩn bị?',
      'Trong ba đơn thua gần nhất, phản đối cuối cùng là gì và bạn có bao giờ xác nhận lại nó với khách không?',
    ],
    exercises: [
      {
        label: 'Bảng năm phản đối',
        text: 'Ghi nguyên văn năm phản đối gần nhất bạn nhận được, phân loại từng cái theo bốn nhóm và viết cạnh mỗi cái phản ứng bạn đã dùng lúc đó. Đánh dấu lần nào bạn trả lời trước khi hỏi.',
        level: 'e',
      },
      {
        label: 'Một câu hỏi thay một câu trả lời',
        text: 'Trong ba ngày, mỗi lần gặp phản đối bắt buộc phải hỏi ít nhất một câu làm rõ trước khi nói bất cứ điều gì. Ghi lại thông tin mới thu được ở mỗi lần.',
        level: 'e',
      },
      {
        label: 'Xác nhận lại mối lo',
        text: 'Luyện câu xác nhận cho năm phản đối phổ biến, mỗi câu bắt đầu bằng nếu tôi hiểu đúng thì điều anh chị lo là. Thử với đồng nghiệp đóng vai và ghi lại chỗ họ đính chính.',
        level: 'e',
      },
      {
        label: 'Ghép bằng chứng với mối lo',
        text: 'Lập bảng hai cột: mối lo và bằng chứng phù hợp nhất. Với mối lo chưa có bằng chứng, ghi việc cần làm để tạo ra bằng chứng đó trong một tháng.',
        level: 'm',
      },
      {
        label: 'Tài liệu một trang cho người bảo vệ nội bộ',
        text: 'Viết một trang giúp người liên hệ của bạn thuyết phục cấp trên của họ: vấn đề, phương án, chi phí, rủi ro và cách kiểm soát. Gửi cho một khách đang cân nhắc và hỏi họ còn cần thêm gì.',
        level: 'm',
      },
      {
        label: 'Diễn tập phản đối khó',
        text: 'Nhờ đồng nghiệp đóng vai khách khó tính với ba phản đối liên tiếp. Ghi âm, nghe lại và đếm số lần bạn tranh luận thay vì làm rõ.',
        level: 'm',
      },
      {
        label: 'Phân tích đơn thua theo phản đối cuối',
        text: 'Với mười đơn thua gần nhất, ghi lại phản đối cuối cùng trước khi mất đơn và phân loại. Tìm nhóm chiếm tỷ lệ cao nhất và thiết kế một cách xử lý mới cho nhóm đó.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: không tranh luận',
        text: 'Bảy ngày, đặt luật cho chính mình là không được nói câu bắt đầu bằng nhưng hoặc thực ra khi nghe phản đối, dù trong công việc hay đời sống. Thay vào đó phải hỏi hoặc xác nhận lại. Mỗi tối ghi số lần bạn suýt vi phạm và điều gì đã xảy ra khi bạn hỏi thay vì phản bác. Ngày thứ bảy tổng kết những thông tin mới bạn sẽ không bao giờ có nếu tiếp tục tranh luận.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao phản đối về giá thường không thật sự là về giá?',
        a: 'Vì giá chỉ có nghĩa khi đặt cạnh một thứ để so, và thứ đó nằm trong đầu khách chứ không nằm trong báo giá của bạn. Khi khách nói đắt, họ có thể đang so với một phương án phạm vi nhỏ hơn, so với ngân sách đã duyệt từ năm trước, so với chi phí không làm gì cả, hoặc đơn giản là chưa thấy đủ giá trị để mức giá đó hợp lý. Bốn tình huống này cần bốn cách xử lý khác nhau và chỉ một trong số đó liên quan tới việc điều chỉnh giá. Giảm giá ngay lập tức thường không gỡ được nút thắt thật và còn dạy khách rằng cứ chần chừ sẽ có giá tốt hơn.',
      },
      {
        q: 'Có phản đối nào không nên cố vượt qua không?',
        a: 'Có, và nhận ra chúng là dấu hiệu của người bán trưởng thành. Khi khách nêu một nhu cầu mà sản phẩm không đáp ứng được, khi ngân sách của họ thật sự không có trong năm nay, hoặc khi quy mô của họ nằm ngoài nhóm bạn phục vụ tốt, thì việc cố vượt qua chỉ tạo ra một khách hàng sai. Chi phí của khách hàng sai gồm khối lượng hỗ trợ lớn, khả năng chấm dứt sớm và những đánh giá tiêu cực lan trong ngành. Cách xử lý đúng là nói thẳng, ghi lại nhu cầu vào hồ sơ sản phẩm, và giữ liên hệ cho thời điểm phù hợp hơn.',
      },
      {
        q: 'Vì sao im lặng sau khi trả lời phản đối lại quan trọng?',
        a: 'Vì phản xạ tự nhiên khi thấy khách chưa phản ứng là nói thêm, và nói thêm thường làm loãng lập luận vừa đưa ra hoặc vô tình mở ra một phản đối mới. Im lặng vài giây trao lại lượt cho khách, cho họ thời gian xử lý thông tin, và thường thì chính họ sẽ nói ra mối lo còn lại — thứ bạn cần biết. Đây là kỹ năng khó vì im lặng gây khó chịu, nên cách luyện là đếm thầm tới năm sau khi kết thúc câu trả lời trước khi cho phép mình nói tiếp.',
      },
    ],
    plan7:
      'Ngày 1: ghi nguyên văn và phân loại năm phản đối gần nhất. Ngày 2: viết một câu hỏi làm rõ cho từng phản đối. Ngày 3: luyện câu xác nhận mối lo với đồng nghiệp đóng vai. Ngày 4: lập bảng ghép bằng chứng với mối lo và tìm chỗ thiếu. Ngày 5: viết tài liệu một trang cho người bảo vệ nội bộ ở phía khách. Ngày 6: diễn tập ba phản đối liên tiếp và nghe lại bản ghi âm. Ngày 7: phân tích mười đơn thua theo phản đối cuối cùng và chọn một nhóm để cải thiện trong tháng.',
    evidence:
      'Bằng chứng gồm bảng phản đối phân loại theo bốn nhóm với câu hỏi làm rõ và bằng chứng tương ứng, cùng tài liệu một trang bạn viết để người liên hệ phía khách mang đi thuyết phục nội bộ. Rất giá trị nếu có bản ghi ẩn danh một tình huống bạn xử lý phản đối bằng cách làm rõ và thu được thông tin đổi hẳn hướng đi. Trong phỏng vấn, hãy chuẩn bị để phản ứng đúng bài bản khi chính người phỏng vấn nêu phản đối về hồ sơ của bạn — đó là cơ hội thể hiện kỹ năng ngay tại chỗ. Trong CV: "Xây bảng xử lý phản đối 4 nhóm cho đội tư vấn đào tạo; thay giảm giá bằng tái cấu trúc phạm vi và tài liệu hỗ trợ bảo vệ ngân sách nội bộ của khách".',
    references: [
      { label: 'Program on Negotiation, Harvard Law School — kỹ thuật đặt câu hỏi và xử lý bất đồng', url: 'https://www.pon.harvard.edu/', type: 'article' },
      { label: 'Center for Nonviolent Communication — tách nhu cầu khỏi lời nói bề mặt khi có bất đồng', url: 'https://www.cnvc.org/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 18 — Chốt bán hàng — Closing
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Chốt không phải một kỹ thuật cuối cùng để lật ngược tình thế, mà là hệ quả tự nhiên của mọi bước làm đúng trước đó. Nếu khách đã thấy rõ vấn đề của họ, tin rằng bạn giải quyết được, biết mình phải trả gì và được gì, và có thẩm quyền để nói đồng ý, thì việc chốt chỉ là đưa ra một đề nghị rõ ràng và đường đi cụ thể. Ngược lại, khi thiếu một trong các điều kiện đó, mọi thủ thuật chốt đều chỉ tạo ra sự khó chịu, và nếu chúng có hiệu quả thì thường sinh ra một khách hàng sẽ hối hận.',
    why: {
      work: 'Rất nhiều cơ hội tốt chết ở giai đoạn cuối chỉ vì không ai đưa ra một đề nghị rõ ràng, hoặc vì hợp đồng và thủ tục kéo dài quá lâu. Đây là chỗ mà một quy trình gọn gàng tạo ra khác biệt lớn về doanh thu mà không cần thêm khách hàng mới.',
      interview:
        'Cuối buổi phỏng vấn, việc bạn nói rõ mình quan tâm vị trí này và hỏi về bước tiếp theo chính là hành vi chốt. Nó không hạ giá trị của bạn mà cho thấy sự chủ động.',
      study:
        'Khi xin hướng dẫn đề tài hoặc xin thực tập, phần lớn sinh viên trình bày xong rồi chờ. Đưa ra đề nghị cụ thể và bước tiếp theo có ngày là điều làm bạn khác đám đông.',
      life: 'Trong mọi thoả thuận đời thường, từ thuê nhà tới phân chia việc gia đình, việc phát biểu rõ đề nghị của mình và xác nhận lại điều hai bên đồng ý giúp tránh những tranh cãi về sau.',
    },
    framework: [
      {
        name: 'Kiểm bốn điều kiện đủ trước khi đề nghị',
        detail:
          'Vấn đề đã được xác nhận bằng lời của khách, giá trị đã được họ diễn đạt lại, chi phí và phạm vi đã rõ, và người ngồi trước mặt có thẩm quyền hoặc có đường đi tới người có thẩm quyền. Thiếu điều nào thì quay lại xử lý điều đó thay vì cố chốt.',
      },
      {
        name: 'Tóm tắt lại bằng ngôn ngữ của khách',
        detail:
          'Nhắc lại vấn đề, hệ quả và điều họ nói là quan trọng, dùng chính từ họ đã dùng. Bước này khiến đề nghị tiếp theo trở nên hiển nhiên thay vì đột ngột, và nó cũng là lần kiểm tra cuối xem bạn có hiểu sai chỗ nào không.',
      },
      {
        name: 'Đưa ra một đề nghị rõ ràng, không mập mờ',
        detail:
          'Nói cụ thể: phương án nào, giá bao nhiêu, gồm gì, bắt đầu khi nào, hai bên cần làm gì. Câu hỏi kiểu vậy anh chị thấy sao đẩy trách nhiệm sang khách; một đề nghị rõ ràng cho phép họ trả lời có, không, hoặc nêu điều còn vướng.',
      },
      {
        name: 'Chịu được im lặng sau khi đề nghị',
        detail:
          'Sau khi đưa đề nghị, dừng lại. Người đầu tiên phá vỡ im lặng thường là người tự thương lượng với chính mình, và trong bán hàng điều đó thường có nghĩa là tự giảm giá khi chưa ai yêu cầu.',
      },
      {
        name: 'Làm phẳng đường đi sau khi đồng ý',
        detail:
          'Rất nhiều đơn chết sau tiếng đồng ý vì thủ tục rườm rà: hợp đồng chờ ký nhiều nơi, hồ sơ thiếu, không ai đôn đốc. Chuẩn bị sẵn mẫu hợp đồng, danh sách hồ sơ cần thiết và người chịu trách nhiệm theo từng bước với mốc thời gian.',
      },
      {
        name: 'Ghi nhận trung thực khi câu trả lời là không',
        detail:
          'Hỏi lý do một lần, cảm ơn, ghi vào bảng lý do thua và giữ liên hệ ở nhịp hợp lý. Một lời không rõ ràng có giá trị hơn nhiều so với một cơ hội treo lơ lửng nhiều tháng.',
      },
    ],
    scenario:
      'Một công ty thi công nội thất căn hộ có tỷ lệ khách gật đầu tại buổi tư vấn cao nhưng rất nhiều hợp đồng không bao giờ được ký. Chủ công ty rà lại mười trường hợp và thấy hai điểm chung. Thứ nhất, buổi tư vấn luôn kết thúc bằng câu anh chị xem lại rồi báo em, không có đề nghị cụ thể. Thứ hai, sau khi khách đồng ý, họ phải chờ trung bình gần một tuần mới nhận được bản hợp đồng vì mỗi bản đều được soạn thủ công từ đầu. Anh thay đổi hai việc. Buổi tư vấn nay kết thúc bằng một đề nghị rõ: phương án đã chọn, tổng chi phí, thời gian thi công, mức tạm ứng, và ngày khảo sát hiện trạng nếu hai bên đồng ý. Song song, anh chuẩn bị mẫu hợp đồng có sẵn phụ lục vật tư để bộ phận văn phòng gửi trong vòng hai mươi bốn giờ. Anh cũng bỏ chính sách giảm giá nếu ký trong hôm nay vì thấy nó khiến khách nghi ngờ mức giá gốc. Sau hai tháng, khoảng cách giữa số khách đồng ý và số hợp đồng ký thu hẹp rõ rệt, và những khách nói không cũng nói sớm hơn nên đội bán hàng không còn theo đuổi các cơ hội đã chết.',
    comparison: [
      {
        weak: 'Kết thúc buổi tư vấn bằng câu anh chị suy nghĩ rồi báo em nhé.',
        mature: 'Kết thúc bằng đề nghị cụ thể gồm phương án, chi phí, thời gian và bước đầu tiên nếu hai bên đồng ý.',
      },
      {
        weak: 'Tạo áp lực bằng ưu đãi chỉ áp dụng hôm nay hoặc thông tin sai về việc sắp hết chỗ.',
        mature: 'Nếu có ràng buộc thật về lịch thi công hoặc tồn kho thì nêu và chứng minh; nếu không có thì tìm lý do khác để hành động sớm, ví dụ mốc bàn giao mong muốn của chính khách.',
      },
      {
        weak: 'Đồng ý mọi yêu cầu giảm giá vào phút cuối để giữ đơn.',
        mature: 'Gắn mọi nhượng bộ với một điều chỉnh tương ứng về phạm vi hoặc điều kiện thanh toán, và nói rõ nguyên tắc đó ngay từ đầu.',
      },
      {
        weak: 'Sau khi khách đồng ý thì thư giãn, để thủ tục tự chạy theo tốc độ của văn phòng.',
        mature: 'Coi khoảng thời gian từ đồng ý tới ký là giai đoạn rủi ro cao nhất, có người theo dõi và mốc thời gian cho từng bước.',
      },
    ],
    mistakes: [
      'Học thuộc các kỹ thuật chốt gây áp lực rồi dùng chúng khi khách chưa sẵn sàng, tạo cảm giác bị dồn ép; hậu quả không chỉ là mất đơn mà còn là những lời truyền miệng tiêu cực trong nhóm khách hàng vốn thường biết nhau.',
      'Không hỏi rõ ai sẽ ký và quy trình duyệt gồm những bước nào, nên tưởng đã chốt xong trong khi hồ sơ còn phải qua hai cấp nữa mà không ai chuẩn bị.',
      'Bỏ qua giai đoạn sau khi đồng ý: không xác nhận lại phạm vi bằng văn bản, không nêu rõ điều gì không bao gồm trong giá; đây là nguồn gốc của phần lớn tranh chấp khi thi công hoặc triển khai.',
    ],
    worksheet: [
      'Với cơ hội gần nhất, hãy chấm bốn điều kiện đủ. Điều kiện nào bạn không có bằng chứng rõ ràng?',
      'Viết câu đề nghị của bạn thành một đoạn có đủ: phương án, chi phí, phạm vi, thời gian bắt đầu, việc mỗi bên cần làm.',
      'Sau khi khách đồng ý, hồ sơ và thủ tục của bạn gồm mấy bước, ai làm, mất bao lâu? Bước nào chậm nhất?',
      'Bạn có chính sách nào tạo áp lực thời gian không có thật không? Nếu có, hãy ghi ra và quyết định bỏ hay chứng minh.',
      'Ba đơn thua gần nhất: bạn có nhận được lời từ chối rõ ràng không, hay chúng chỉ im lặng dần? Bạn sẽ hỏi thế nào lần sau?',
    ],
    exercises: [
      {
        label: 'Chấm bốn điều kiện',
        text: 'Lấy năm cơ hội đang mở, chấm từng cơ hội theo bốn điều kiện đủ với bằng chứng cụ thể cho mỗi ô. Xác định cơ hội nào chưa nên chốt và việc cần làm trước.',
        level: 'e',
      },
      {
        label: 'Viết câu đề nghị',
        text: 'Soạn sẵn đoạn đề nghị cho ba loại khách phổ biến của bạn, mỗi đoạn dưới sáu câu và có đủ năm thành phần. Đọc to và chỉnh cho tới khi nói được tự nhiên.',
        level: 'e',
      },
      {
        label: 'Đếm giây im lặng',
        text: 'Trong ba cuộc trao đổi, sau khi đưa đề nghị hãy đếm thầm tới mười trước khi cho phép mình nói tiếp. Ghi lại điều khách nói ra trong khoảng im lặng đó.',
        level: 'e',
      },
      {
        label: 'Đo thời gian từ đồng ý tới ký',
        text: 'Với mười đơn gần nhất, tính số ngày từ lúc khách nói đồng ý tới lúc ký. Tìm bước chậm nhất và thiết kế cách rút ngắn nó.',
        level: 'm',
      },
      {
        label: 'Bộ hồ sơ sẵn sàng',
        text: 'Chuẩn bị mẫu hợp đồng, phụ lục phạm vi, danh sách hồ sơ cần từ khách và bản ghi rõ những gì không bao gồm trong giá. Thử dùng cho một đơn và đo lại thời gian.',
        level: 'm',
      },
      {
        label: 'Nguyên tắc nhượng bộ',
        text: 'Viết ra trước các mức nhượng bộ bạn cho phép và điều kiện đổi lại cho mỗi mức. Áp dụng trong ba cuộc thương lượng và ghi lại lần nào bạn phá nguyên tắc của chính mình.',
        level: 'm',
      },
      {
        label: 'Rà bỏ áp lực giả',
        text: 'Rà toàn bộ chính sách và câu chữ đang dùng ở giai đoạn cuối, đánh dấu mọi yếu tố tạo gấp gáp không có thật. Bỏ chúng và theo dõi tỷ lệ chốt cùng tỷ lệ huỷ hợp đồng trong tám tuần.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: luôn có đề nghị',
        text: 'Bảy ngày, mọi cuộc trao đổi có tính thuyết phục — với khách, với sếp, với đối tác — đều phải kết thúc bằng một đề nghị cụ thể do bạn phát biểu, không đẩy sang phía kia bằng câu hỏi mở. Ghi lại phản ứng mỗi lần. Ngày thứ bảy đếm bao nhiêu lần bạn nhận được câu trả lời rõ ràng so với tuần trước đó, và bao nhiêu lần một lời không sớm giúp bạn tiết kiệm thời gian.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nói chốt là hệ quả chứ không phải kỹ thuật?',
        a: 'Vì quyết định mua được hình thành dần qua các bước trước đó: khách nhận ra vấn đề, tin rằng bạn giải quyết được, hiểu chi phí và phạm vi, và có thẩm quyền quyết. Khi bốn điều đó đã đủ, việc chốt chỉ còn là phát biểu đề nghị rõ ràng. Khi thiếu một điều, không kỹ thuật nào bù được, và nếu áp lực đủ mạnh để tạo ra chữ ký thì bạn thường nhận về một khách hàng hối hận, đòi huỷ hoặc để lại đánh giá xấu. Vì vậy khi thấy mình cần tới thủ thuật, đó là tín hiệu quay lại kiểm bốn điều kiện chứ không phải tín hiệu cần thêm áp lực.',
      },
      {
        q: 'Ưu đãi có thời hạn có phải lúc nào cũng là thủ thuật xấu không?',
        a: 'Không. Ranh giới nằm ở việc ràng buộc đó có thật và có kiểm chứng được hay không. Một lịch thi công chỉ còn trống trong tháng này, một lô vật tư nhập theo đợt, một mức giá gắn với hợp đồng nhà cung cấp sắp hết hạn đều là ràng buộc thật và nêu ra là chính đáng, thậm chí là có trách nhiệm. Ngược lại, ưu đãi chỉ hôm nay tự động lặp lại mỗi ngày, hoặc thông tin sai về số chỗ còn lại, là gây nhầm lẫn cho người tiêu dùng. Phép thử đơn giản: nếu khách hỏi tại sao lại có hạn đó, bạn có trả lời được bằng một lý do kiểm chứng được không.',
      },
      {
        q: 'Vì sao giai đoạn từ đồng ý tới ký lại rủi ro cao?',
        a: 'Vì trong khoảng thời gian đó, sự nhiệt tình của khách giảm dần trong khi các trở ngại thực tế bắt đầu xuất hiện: bộ phận pháp chế yêu cầu sửa điều khoản, người chưa từng tham gia đặt câu hỏi mới, ngân sách bị điều chỉnh, hoặc đối thủ đưa ra đề nghị mới. Mỗi ngày trôi qua làm tăng xác suất một trong các sự kiện đó xảy ra. Cách xử lý là chuẩn bị trước bộ hồ sơ để rút ngắn thời gian, xác định rõ ai đôn đốc ở cả hai phía, và giữ nhịp liên lạc bằng những cập nhật hữu ích thay vì im lặng chờ.',
      },
    ],
    plan7:
      'Ngày 1: chấm bốn điều kiện đủ cho năm cơ hội đang mở. Ngày 2: soạn ba đoạn đề nghị cho ba loại khách và luyện nói. Ngày 3: đo thời gian từ đồng ý tới ký của mười đơn gần nhất. Ngày 4: chuẩn bị bộ hồ sơ sẵn sàng gồm hợp đồng mẫu và danh sách phạm vi loại trừ. Ngày 5: viết nguyên tắc nhượng bộ và các điều kiện đổi lại. Ngày 6: rà bỏ mọi yếu tố tạo áp lực không có thật. Ngày 7: thực hành đề nghị rõ ràng trong mọi cuộc trao đổi và ghi lại phản ứng.',
    evidence:
      'Bằng chứng gồm mẫu đề nghị chốt do bạn viết, bộ hồ sơ chuẩn hoá giúp rút ngắn thời gian ký, và bảng số liệu hai cột theo tháng: số khách đồng ý và số hợp đồng ký, kèm thời gian trung bình giữa hai mốc. Rất giá trị nếu bạn ghi lại quyết định bỏ một chính sách tạo áp lực giả cùng theo dõi tác động. Trong phỏng vấn, hãy kể một lần bạn không chốt được và giải thích điều kiện nào đã thiếu — thể hiện tư duy chẩn đoán thay vì đổ lỗi cho khách. Trong CV: "Chuẩn hoá đề nghị chốt và bộ hồ sơ hợp đồng cho công ty thi công nội thất; rút ngắn thời gian từ khách đồng ý tới ký và thu hẹp khoảng cách giữa số khách đồng ý và số hợp đồng trong 2 tháng".',
    references: [
      { label: 'Harvard Business Review — chuyên mục Negotiations', url: 'https://hbr.org/topic/subject/negotiations', type: 'article' },
      { label: 'Program on Negotiation, Harvard Law School — nguyên tắc thương lượng có nguyên tắc', url: 'https://www.pon.harvard.edu/topics/business-negotiations/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 19 — Định giá — Pricing
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Giá là con số duy nhất trong doanh nghiệp vừa quyết định doanh thu, vừa quyết định bạn được xếp vào nhóm nào trong đầu khách, vừa quyết định loại khách hàng bạn thu hút. Đặt giá theo chi phí cộng lãi là cách phổ biến nhất và cũng là cách bỏ qua nhiều thông tin nhất, vì nó không hỏi khách nhận được bao nhiêu giá trị và họ đang so với cái gì. Định giá tốt bắt đầu từ giá trị kinh tế đối với khách và từ các lựa chọn thay thế của họ, còn chi phí chỉ đóng vai trò sàn: mức dưới đó thì không nên bán.',
    why: {
      work: 'Thay đổi giá thường là đòn bẩy nhanh nhất tới lợi nhuận vì nó không kéo theo chi phí tăng tương ứng như việc bán thêm sản lượng. Nhưng nó cũng là đòn bẩy nguy hiểm nhất nếu làm mà không hiểu khách đang so với gì.',
      interview:
        'Câu hỏi bạn sẽ định giá sản phẩm này thế nào là bài kiểm tra tư duy kinh doanh. Người trả lời bằng chi phí cộng phần trăm sẽ bị coi là mới; người hỏi ngược về giá trị với khách, lựa chọn thay thế và mục tiêu chiến lược sẽ được đánh giá cao.',
      study:
        'Bài toán định giá là nơi kiến thức kinh tế học nhập môn gặp thực tế: độ nhạy theo giá, chi phí biên, chi phí chìm. Làm một bài định giá cho tình huống thật giúp các khái niệm đó thôi trừu tượng.',
      life: 'Người làm nghề tự do thường đặt giá theo cảm giác và mặc cả theo cảm xúc. Có một khung định giá và một mức sàn viết ra giấy giúp bạn thương lượng bình tĩnh và ngừng nhận những việc làm xong thấy lỗ.',
    },
    framework: [
      {
        name: 'Xác định giá trị kinh tế với khách',
        detail:
          'Ước lượng khách tiết kiệm hoặc kiếm thêm bao nhiêu nhờ bạn, tính theo đơn vị đo được: giờ công, phế phẩm giảm, đơn hàng thêm. Con số này không quyết định giá nhưng nó cho biết trần và cho bạn lập luận khi thương lượng.',
      },
      {
        name: 'Xác định sàn bằng chi phí thật',
        detail:
          'Tính đủ chi phí trực tiếp, chi phí phục vụ khách sau bán và phần chi phí chung phân bổ. Nhiều dịch vụ lỗ ngầm vì bỏ quên thời gian hỗ trợ và sửa lại; hãy đo bằng dữ liệu thật chứ đừng ước lượng lạc quan.',
      },
      {
        name: 'Chọn trục thu tiền hợp lý',
        detail:
          'Quyết định bạn tính tiền theo cái gì: theo giờ, theo đầu người, theo số đơn xử lý, theo gói cố định. Trục tốt là trục tăng cùng với giá trị khách nhận được và khách dễ dự đoán được hoá đơn của mình. Trục sai khiến khách hàng thành công nhất lại thấy bị phạt vì dùng nhiều.',
      },
      {
        name: 'Thiết kế cấu trúc gói đơn giản',
        detail:
          'Hai tới ba gói với ranh giới rõ ràng theo nhu cầu chứ không theo mức độ hào phóng của bạn. Mỗi gói phải trả lời được câu ai nên chọn gói này. Quá nhiều gói làm khách tê liệt và kéo dài quyết định.',
      },
      {
        name: 'Minh bạch toàn bộ chi phí',
        detail:
          'Nêu rõ những gì không bao gồm, phí phát sinh có thể có, điều kiện gia hạn và cách huỷ. Phí ẩn phát hiện ở phút cuối là một trong những nguyên nhân mất niềm tin nhanh nhất và ở nhiều nơi còn là hành vi bị pháp luật bảo vệ người tiêu dùng điều chỉnh.',
      },
      {
        name: 'Thử thay đổi giá có kiểm soát',
        detail:
          'Đổi giá cho khách mới trước, giữ nguyên cho khách cũ trong một thời gian và thông báo sớm nếu sẽ thay đổi. Theo dõi ba chỉ số cùng lúc: tỷ lệ chốt, doanh thu trung bình mỗi khách, và tỷ lệ khách rời đi. Nhìn một chỉ số dễ dẫn tới kết luận sai.',
      },
    ],
    scenario:
      'Một xưởng in áo theo yêu cầu báo giá theo số lượng áo và mực in, cách làm đã dùng nhiều năm. Chủ xưởng nhận thấy các đơn nhỏ dưới ba mươi áo chiếm phần lớn thời gian của bộ phận thiết kế nhưng gần như không có lãi, trong khi các đơn doanh nghiệp lớn thì lại bị nơi khác giành vì giá. Anh ngồi tính lại chi phí thật cho mười đơn gần nhất, gồm cả thời gian trao đổi và sửa file thiết kế, và phát hiện trung bình mỗi đơn nhỏ tốn hơn hai giờ làm việc không được tính vào giá. Anh tách phần thiết kế ra khỏi phần in thành một khoản riêng có mức tối thiểu, và tạo hai gói rõ ràng: gói tự gửi file in đúng chuẩn với giá thấp, và gói có hỗ trợ thiết kế với số lần chỉnh sửa được ghi rõ. Anh cũng công bố bảng phụ phí cho các trường hợp gấp và đổi mẫu sau khi duyệt. Một số khách nhỏ rời đi, nhưng thời gian của bộ phận thiết kế được giải phóng cho các đơn lớn, và doanh thu trung bình mỗi đơn tăng. Anh theo dõi cùng lúc ba chỉ số trong ba tháng trước khi quyết định giữ cấu trúc mới.',
    comparison: [
      {
        weak: 'Lấy chi phí rồi cộng một tỷ lệ lãi cố định và coi đó là giá đúng.',
        mature: 'Dùng chi phí làm sàn, dùng giá trị với khách và các lựa chọn thay thế của họ để xác định vùng giá, rồi chọn điểm trong vùng đó theo mục tiêu chiến lược.',
      },
      {
        weak: 'Giảm giá để thắng đơn mà không đổi phạm vi, và không ghi lại lý do giảm.',
        mature: 'Mỗi nhượng bộ về giá đi kèm một điều chỉnh về phạm vi, thời hạn thanh toán hoặc cam kết số lượng, và mọi lần giảm đều được ghi lại để phân tích.',
      },
      {
        weak: 'Thiết kế năm gói với danh sách tính năng dài để khách nào cũng thấy có phần của mình.',
        mature: 'Hai tới ba gói với ranh giới theo nhu cầu rõ ràng, mỗi gói trả lời được câu ai nên chọn nó.',
      },
      {
        weak: 'Để phí phát sinh, điều kiện gia hạn và cách huỷ ở phần chữ nhỏ hoặc chỉ nói khi khách hỏi.',
        mature: 'Công bố đầy đủ ngay tại nơi khách quyết định, kể cả khi điều đó làm một số người dừng lại; người dừng vì biết trước tốt hơn người mua rồi thấy bị lừa.',
      },
    ],
    mistakes: [
      'Không đo chi phí phục vụ sau bán nên định giá dựa trên một bức tranh chi phí sai; những sản phẩm trông có lãi nhất trên giấy đôi khi là những sản phẩm ngốn nhiều giờ hỗ trợ nhất.',
      'Đổi giá đột ngột với khách hiện hữu mà không báo trước và không giải thích, tạo cảm giác bị đối xử tuỳ tiện; cách ít rủi ro hơn là áp dụng cho khách mới trước và thông báo sớm với lộ trình rõ ràng cho khách cũ.',
      'Dùng các kiểu trình bày giá gây nhầm lẫn như hiển thị giá chưa gồm thuế và phí bắt buộc, hoặc tự động gia hạn với mức cao hơn mà không nhắc trước; đây là những vấn đề có thể liên quan tới quy định bảo vệ người tiêu dùng và nên tham vấn người phụ trách pháp lý hoặc kế toán trước khi áp dụng.',
    ],
    worksheet: [
      'Khách của bạn tiết kiệm hoặc kiếm thêm bao nhiêu nhờ sản phẩm này? Ghi cách bạn ước lượng và giả định đi kèm.',
      'Chi phí thật cho một đơn hàng trung bình là bao nhiêu khi tính cả thời gian trao đổi, sửa lại và hỗ trợ sau bán?',
      'Bạn đang tính tiền theo trục nào? Trục đó tăng cùng giá trị khách nhận được hay tăng cùng mức độ vất vả của bạn?',
      'Nếu chỉ được giữ hai gói, bạn giữ gói nào và ai là người nên chọn mỗi gói? Viết một câu cho mỗi gói.',
      'Liệt kê mọi khoản phí có thể phát sinh mà khách chưa thấy ở bước quyết định. Bạn sẽ công bố chúng ở đâu?',
    ],
    exercises: [
      {
        label: 'Tính chi phí thật mười đơn',
        text: 'Lấy mười đơn gần nhất, ghi thêm thời gian trao đổi, sửa lại và hỗ trợ sau bán. Tính chi phí thật mỗi đơn và so với giá đã bán. Đánh dấu đơn nào lỗ ngầm.',
        level: 'e',
      },
      {
        label: 'Ước lượng giá trị với khách',
        text: 'Với một khách hàng cụ thể, viết ước lượng giá trị kinh tế họ nhận được, kèm ba giả định. Hỏi chính khách đó xem giả định nào sai.',
        level: 'e',
      },
      {
        label: 'Kiểm trục thu tiền',
        text: 'Viết ra trục tính tiền hiện tại và thử hình dung khách hàng thành công nhất của bạn: họ trả nhiều hơn hay ít hơn khi họ dùng hiệu quả hơn? Ghi lại điều bất hợp lý nếu có.',
        level: 'e',
      },
      {
        label: 'Rút gọn còn hai gói',
        text: 'Lấy bảng giá hiện tại, rút xuống hai gói với ranh giới theo nhu cầu và viết một câu ai nên chọn gói nào. Thử với năm khách và đếm số câu hỏi làm rõ họ đặt ra.',
        level: 'm',
      },
      {
        label: 'Công bố phần chưa bao gồm',
        text: 'Viết danh sách rõ ràng những gì không bao gồm trong giá và mọi khoản phụ phí có thể phát sinh. Đưa lên đúng nơi khách ra quyết định và theo dõi số tranh cãi về hoá đơn trong hai tháng.',
        level: 'm',
      },
      {
        label: 'Nhật ký giảm giá',
        text: 'Trong một tháng, ghi lại mọi lần giảm giá kèm lý do, người quyết định và điều nhận lại. Cuối tháng tính tổng phần đã cho đi và xem có bao nhiêu lần thật sự có điều kiện đổi lại.',
        level: 'm',
      },
      {
        label: 'Thử tăng giá có kiểm soát',
        text: 'Tăng giá cho khách mới ở một dòng sản phẩm, giữ nguyên cho khách cũ, theo dõi ba chỉ số trong tám tuần: tỷ lệ chốt, doanh thu trung bình mỗi khách, tỷ lệ rời đi. Viết kết luận kèm điều kiện áp dụng.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: nói giá không giải thích thêm',
        text: 'Bảy ngày, mỗi lần báo giá hãy nói con số rồi dừng lại, không tự động giải thích hay xin lỗi vì mức giá. Ghi lại phản ứng của khách và điều họ nói đầu tiên. Ngày thứ bảy đối chiếu: bao nhiêu lần khách thật sự phản đối giá, và bao nhiêu lần trước đây bạn tự giảm giá khi chưa ai yêu cầu.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao định giá theo chi phí cộng lãi lại bỏ sót thông tin quan trọng?',
        a: 'Vì nó chỉ nhìn vào phía bạn, trong khi giá được khách đánh giá dựa trên hai thứ hoàn toàn khác: giá trị họ nhận được và các lựa chọn thay thế họ đang cân nhắc. Hệ quả có hai chiều. Khi bạn tạo ra giá trị lớn hơn nhiều so với chi phí bỏ ra, cách này khiến bạn để lại rất nhiều tiền trên bàn. Khi chi phí của bạn cao vì kém hiệu quả, nó lại đẩy giá lên trên mức thị trường chấp nhận và bạn mất đơn. Chi phí vẫn cần thiết nhưng chỉ nên đóng vai trò sàn để biết đâu là mức không nên bán.',
      },
      {
        q: 'Vì sao trục thu tiền quan trọng không kém mức giá?',
        a: 'Vì nó quyết định hoá đơn của khách thay đổi thế nào khi họ dùng nhiều hơn hoặc thành công hơn. Một trục tốt tăng cùng giá trị họ nhận được, nên khi họ phát triển thì họ vui vẻ trả nhiều hơn. Một trục sai tạo ra cảm giác bị phạt vì thành công, ví dụ tính tiền theo số lần khách phải liên hệ hỗ trợ, và nó khuyến khích những hành vi ngược với mong muốn của cả hai bên. Trục cũng cần dễ dự đoán: khách không thích một hoá đơn mà họ không tính trước được, kể cả khi trung bình nó rẻ hơn.',
      },
      {
        q: 'Khi nào nên tăng giá và làm thế nào để giảm rủi ro?',
        a: 'Các tín hiệu thường gặp là gần như không ai phản đối mức giá hiện tại, đội bán hàng thắng quá dễ, hoặc chi phí phục vụ đã tăng mà giá giữ nguyên nhiều năm. Cách giảm rủi ro gồm: áp dụng cho khách mới trước để có dữ liệu, giữ nguyên cho khách hiện hữu trong một thời gian và thông báo sớm bằng văn bản với lý do rõ ràng, và theo dõi đồng thời tỷ lệ chốt, doanh thu trung bình và tỷ lệ rời đi. Ngoài ra hãy chuẩn bị sẵn phương án cho khách trung thành, ví dụ giữ giá cũ nếu cam kết dài hạn hơn. Với các thay đổi lớn về giá và điều khoản hợp đồng, nên hỏi ý kiến kế toán và người phụ trách pháp lý trước khi công bố.',
      },
    ],
    plan7:
      'Ngày 1: tính chi phí thật của mười đơn gần nhất kể cả thời gian hỗ trợ. Ngày 2: ước lượng giá trị kinh tế với một nhóm khách và ghi giả định. Ngày 3: kiểm trục thu tiền hiện tại và tìm điểm bất hợp lý. Ngày 4: rút bảng giá xuống hai gói với ranh giới rõ. Ngày 5: viết và công bố danh sách phần không bao gồm cùng phụ phí. Ngày 6: mở nhật ký giảm giá và thống nhất nguyên tắc nhượng bộ với đội bán. Ngày 7: thiết kế một phép thử tăng giá cho khách mới ở một dòng sản phẩm, ghi rõ ba chỉ số sẽ theo dõi.',
    evidence:
      'Bằng chứng gồm bảng tính chi phí thật theo đơn hàng, tài liệu cấu trúc giá do bạn thiết kế kèm lập luận về trục thu tiền, và nhật ký giảm giá có phân tích. Nếu đã thử thay đổi giá, giữ lại thiết kế phép thử và bảng ba chỉ số theo tuần cùng kết luận có nêu điều kiện áp dụng. Trong phỏng vấn, hãy trình bày vùng giá thay vì một con số, và giải thích bạn chọn điểm nào trong vùng đó vì mục tiêu gì. Trong CV: "Tái cấu trúc bảng giá cho xưởng in theo yêu cầu: tách phí thiết kế, rút còn 2 gói, công bố phụ phí; tăng doanh thu trung bình mỗi đơn và giải phóng thời gian bộ phận thiết kế cho đơn lớn".',
    references: [
      { label: 'Harvard Business Review — chuyên mục Pricing strategy', url: 'https://hbr.org/topic/subject/pricing-strategy', type: 'article' },
      { label: 'Paddle Resources — tài liệu về mô hình định giá và cấu trúc gói', url: 'https://www.paddle.com/resources', type: 'article', needsReview: true },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 20 — Chăm sóc và giữ chân khách hàng
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Giữ chân khách hàng không phải là gửi tin nhắn chúc mừng sinh nhật, mà là bảo đảm khách liên tục đạt được kết quả mà họ đã mua. Khách rời đi hiếm khi vì một sự cố lớn; họ rời sau một chuỗi những lần nhỏ không đạt được kết quả mong đợi, và họ thường im lặng suốt quá trình đó. Vì vậy công việc thật của việc giữ chân nằm ở hai chỗ ít ai nhìn: ba mươi ngày đầu sau khi mua, và hệ thống phát hiện tín hiệu nguội trước khi khách kịp quyết định rời.',
    why: {
      work: 'Bán cho khách hiện có thường rẻ hơn nhiều so với tìm khách mới vì bạn không phải trả lại chi phí thu hút và không phải xây lại niềm tin từ đầu. Với mô hình thu tiền định kỳ, tỷ lệ giữ chân quyết định gần như toàn bộ khả năng tăng trưởng.',
      interview:
        'Ứng viên mô tả được quy trình ba mươi ngày đầu và cách phát hiện khách sắp rời sẽ nổi bật hơn hẳn người chỉ nói về chăm sóc khách hàng theo nghĩa lịch sự và nhiệt tình.',
      study:
        'Phân tích theo nhóm khách vào cùng một thời điểm là bài tập thống kê ứng dụng rất tốt, dạy bạn thấy điều mà số trung bình che giấu.',
      life: 'Nguyên tắc tương tự áp dụng cho các mối quan hệ: những rạn nứt lớn hiếm khi bắt đầu bằng sự kiện lớn, và việc chủ động hỏi han trước khi có vấn đề rẻ hơn nhiều so với hàn gắn sau khi đã xa cách.',
    },
    framework: [
      {
        name: 'Định nghĩa kết quả đầu tiên khách cần đạt',
        detail:
          'Viết ra một cột mốc cụ thể chứng tỏ khách đã nhận được giá trị lần đầu, ví dụ đã chạy trọn một kỳ tính lương trên hệ thống, hoặc đã đưa xe đi bảo dưỡng đúng lịch lần thứ hai. Nếu bạn không định nghĩa được mốc này thì không thể biết ai đang gặp rủi ro.',
      },
      {
        name: 'Thiết kế ba mươi ngày đầu như một quy trình',
        detail:
          'Ai liên hệ, vào ngày nào, để kiểm tra điều gì, và điều gì kích hoạt can thiệp. Giai đoạn này quyết định phần lớn khả năng khách còn ở lại sau một năm, nhưng nó thường bị bỏ mặc vì đội bán đã chuyển sang khách mới còn bộ phận vận hành chỉ phản ứng khi có sự cố.',
      },
      {
        name: 'Xây tín hiệu cảnh báo sớm',
        detail:
          'Chọn hai tới ba dấu hiệu quan sát được cho thấy khách đang nguội: giảm tần suất sử dụng, không phản hồi hai lần liên tiếp, người liên hệ chính nghỉ việc, hoặc bỏ lỡ một mốc dịch vụ. Gắn mỗi tín hiệu với một hành động cụ thể và một người chịu trách nhiệm.',
      },
      {
        name: 'Liên hệ có giá trị theo nhịp, không chỉ khi cần tiền',
        detail:
          'Mỗi lần liên hệ nên mang lại thứ có ích: một báo cáo kết quả họ đang đạt được, một mẹo dùng tốt hơn, một lời nhắc đúng lúc. Nếu khách chỉ nghe thấy bạn khi tới hạn thanh toán hoặc khi bạn muốn bán thêm, mối quan hệ sẽ bị coi là giao dịch thuần tuý.',
      },
      {
        name: 'Phục hồi tốt sau sự cố',
        detail:
          'Khi có lỗi, thứ khách nhớ là tốc độ thừa nhận, sự rõ ràng về việc đang làm và cách bù đắp. Một sự cố được xử lý tử tế thường tạo ra khách trung thành hơn cả một chuỗi ngày trơn tru, nhưng chỉ khi bạn không tìm cách đổ lỗi hay giảm nhẹ.',
      },
      {
        name: 'Đo theo nhóm khách vào cùng thời điểm',
        detail:
          'Theo dõi các nhóm khách bắt đầu cùng tháng và xem bao nhiêu phần trăm còn lại sau ba, sáu, mười hai tháng. Cách đo này bộc lộ những vấn đề mà con số tổng luôn che đi, nhất là khi bạn đang có nhiều khách mới.',
      },
    ],
    scenario:
      'Một trung tâm chăm sóc xe ô tô bán gói bảo dưỡng một năm gồm bốn lần. Nhìn tổng doanh thu thì ổn, nhưng khi chủ trung tâm chia khách theo tháng mua gói và đếm số người thật sự dùng hết bốn lần, anh thấy phần lớn khách chỉ dùng hai lần rồi thôi, và gần như không ai trong nhóm đó mua lại gói năm sau. Anh định nghĩa mốc kết quả đầu tiên là khách hoàn tất lần bảo dưỡng thứ hai đúng lịch, vì dữ liệu cho thấy ai qua được mốc này thì thường dùng hết gói. Anh dựng quy trình cho ba mươi ngày đầu: sau lần một, kỹ thuật viên gửi ảnh và ghi chú tình trạng xe kèm mốc dự kiến cho lần hai; trước lần hai mười ngày, lễ tân gọi đặt lịch thay vì chờ khách gọi. Tín hiệu cảnh báo là quá hạn lần hai bảy ngày, và hành động tương ứng là một cuộc gọi hỏi thăm không kèm bán thêm. Sau nửa năm, tỷ lệ khách dùng hết gói ở các nhóm mới cao hơn hẳn nhóm cũ, và điều bất ngờ là số lượt giới thiệu người quen tăng theo, vì khách quay lại nhiều lần thì mới đủ quen để giới thiệu.',
    comparison: [
      {
        weak: 'Chăm sóc khách bằng tin nhắn chúc mừng dịp lễ và khuyến mãi định kỳ.',
        mature: 'Theo dõi xem khách có đạt được kết quả họ đã mua hay không, và can thiệp đúng lúc họ chững lại.',
      },
      {
        weak: 'Chỉ biết khách không hài lòng khi họ khiếu nại hoặc khi họ không gia hạn.',
        mature: 'Đặt tín hiệu cảnh báo sớm dựa trên hành vi quan sát được và giao cho một người cụ thể xử lý mỗi tín hiệu.',
      },
      {
        weak: 'Xem tỷ lệ giữ chân trên tổng số khách và thấy con số ổn định.',
        mature: 'Phân tích theo nhóm khách vào cùng thời điểm để thấy nhóm mới đang rời nhanh hơn hay chậm hơn nhóm cũ.',
      },
      {
        weak: 'Khi có sự cố thì giải thích dài về nguyên nhân khách quan và giảm nhẹ mức độ ảnh hưởng.',
        mature: 'Thừa nhận nhanh, nêu việc đang làm và mốc thời gian, đề xuất bù đắp cụ thể, rồi quay lại kiểm tra sau khi đã xử lý xong.',
      },
    ],
    mistakes: [
      'Dồn toàn bộ nguồn lực cho việc tìm khách mới vì con số khách mới dễ thấy và dễ khen thưởng, trong khi việc giữ chân không tạo ra sự kiện đáng ăn mừng nào nên luôn bị xếp sau.',
      'Chỉ liên hệ khách khi sắp hết hạn hợp đồng hoặc khi muốn bán thêm, khiến mọi cuộc gọi từ bạn đều bị mặc định là có mục đích bán và khách bắt đầu tránh.',
      'Giữ chân bằng cách gây khó cho việc rời đi: thủ tục huỷ phức tạp, tự động gia hạn không báo trước, ràng buộc phạt nặng; cách này giữ được vài tháng doanh thu nhưng tạo ra những khách hàng nói xấu bạn và ở nhiều nơi còn liên quan tới quy định bảo vệ người tiêu dùng.',
    ],
    worksheet: [
      'Cột mốc nào chứng tỏ khách của bạn đã nhận được giá trị lần đầu? Viết bằng một hành vi quan sát được.',
      'Trong ba mươi ngày đầu sau khi mua, ai liên hệ khách, vào ngày nào, và để kiểm tra điều gì?',
      'Hai tới ba tín hiệu cho thấy khách đang nguội là gì, bạn quan sát chúng bằng dữ liệu nào, và ai chịu trách nhiệm xử lý?',
      'Lần gần nhất bạn liên hệ khách mà không có mục đích bán thêm là khi nào và bạn mang lại điều gì cho họ?',
      'Trong nhóm khách bắt đầu cùng một tháng năm ngoái, bao nhiêu phần trăm còn lại sau sáu tháng? Nếu chưa biết, hãy ghi cách bạn sẽ tính.',
    ],
    exercises: [
      {
        label: 'Định nghĩa mốc giá trị đầu tiên',
        text: 'Xem lại dữ liệu khách cũ, tìm hành vi phân biệt rõ nhất giữa nhóm ở lại lâu và nhóm rời sớm. Viết mốc đó thành một câu và kiểm với ba nhân viên trực tiếp phục vụ khách.',
        level: 'e',
      },
      {
        label: 'Vẽ ba mươi ngày đầu',
        text: 'Vẽ dòng thời gian ba mươi ngày sau khi khách mua, đánh dấu mọi lần khách nghe thấy bạn hiện nay. Đánh dấu khoảng trống dài nhất và điền vào đó một điểm chạm có giá trị.',
        level: 'e',
      },
      {
        label: 'Gọi cho năm khách đã rời',
        text: 'Gọi cho năm khách đã ngừng sử dụng trong sáu tháng qua, hỏi hai câu: điều gì khiến họ dừng, và có dấu hiệu nào từ trước mà bạn lẽ ra phải thấy. Ghi nguyên văn.',
        level: 'e',
      },
      {
        label: 'Bảng tín hiệu và hành động',
        text: 'Lập bảng ba cột: tín hiệu, cách phát hiện, hành động và người chịu trách nhiệm. Chạy thử trong bốn tuần và đếm số lần tín hiệu được kích hoạt và được xử lý.',
        level: 'm',
      },
      {
        label: 'Phân tích theo nhóm thời điểm',
        text: 'Chia khách theo tháng bắt đầu trong mười hai tháng qua, tính tỷ lệ còn lại sau ba và sáu tháng cho từng nhóm. Vẽ thành bảng và tìm nhóm bất thường, rồi truy nguyên nhân.',
        level: 'm',
      },
      {
        label: 'Một liên hệ không bán gì',
        text: 'Thiết kế một điểm chạm định kỳ chỉ mang giá trị, ví dụ báo cáo kết quả khách đang đạt được. Gửi cho hai mươi khách và ghi lại tỷ lệ phản hồi cùng nội dung họ nói.',
        level: 'm',
      },
      {
        label: 'Quy trình phục hồi sau sự cố',
        text: 'Viết quy trình xử lý sự cố với khách gồm mốc thời gian thừa nhận, người liên hệ, mức bù đắp được phép, và bước kiểm tra lại sau đó. Áp dụng cho một sự cố thật và ghi lại phản ứng khách.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: bảy cuộc gọi kiểm tra sức khoẻ',
        text: 'Bảy ngày, mỗi ngày gọi cho một khách hàng đang dùng dịch vụ, không bán gì, chỉ hỏi họ đang đạt được kết quả gì và điều gì còn khó. Ghi lại mọi vấn đề nghe được. Ngày thứ bảy phân loại các vấn đề thành ba nhóm: sửa được ngay, cần đổi quy trình, cần đổi sản phẩm, rồi chuyển từng nhóm cho đúng người.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao ba mươi ngày đầu quan trọng hơn các tháng sau?',
        a: 'Vì đó là lúc khách còn đang quyết định xem quyết định mua của mình có đúng không, và là lúc họ phải thay đổi thói quen cũ để dùng thứ vừa mua. Nếu trong giai đoạn này họ chưa đạt được kết quả cụ thể nào, chi phí chuyển đổi trong đầu họ vẫn thấp và việc quay lại cách cũ là lựa chọn dễ dàng. Sau khi đã đạt kết quả lần đầu và đưa nó vào công việc hằng ngày, cả sức ì lẫn giá trị nhận được đều đứng về phía bạn. Đó là lý do một quy trình ba mươi ngày được thiết kế cẩn thận thường tạo ra tác động lớn hơn mọi chương trình khách hàng thân thiết.',
      },
      {
        q: 'Vì sao phải đo theo nhóm khách vào cùng thời điểm thay vì nhìn tỷ lệ tổng?',
        a: 'Vì tỷ lệ tổng bị chi phối bởi cơ cấu khách hiện tại. Khi bạn đang có nhiều khách mới, họ pha loãng phần khách cũ đang rời đi và tỷ lệ tổng trông ổn định trong khi chất lượng thực đang xấu đi; ngược lại, khi ngừng tuyển khách mới, tỷ lệ tổng có thể xấu đột ngột mà không có gì thay đổi về chất lượng. Phân tích theo nhóm bắt đầu cùng thời điểm loại bỏ ảnh hưởng này và cho phép so sánh công bằng giữa các nhóm, nhờ đó bạn thấy được thay đổi nào trong sản phẩm hoặc quy trình đã thật sự có tác dụng.',
      },
      {
        q: 'Có nên giữ chân bằng cách làm cho việc rời đi khó khăn không?',
        a: 'Không, trừ những ràng buộc hợp đồng minh bạch đã được thoả thuận rõ ngay từ đầu và có lý do chính đáng như đầu tư ban đầu lớn. Việc giấu nút huỷ, kéo dài thủ tục hoặc tự động gia hạn mà không nhắc trước tạo ra một nhóm khách bị mắc kẹt chứ không phải khách hài lòng; họ không dùng, không giới thiệu ai, và khi thoát được thì kể lại trải nghiệm cho nhiều người. Ngoài ra nhiều thực hành thuộc nhóm này chịu sự điều chỉnh của pháp luật bảo vệ người tiêu dùng, nên hãy tham vấn người phụ trách pháp lý khi thiết kế điều khoản gia hạn và huỷ.',
      },
    ],
    plan7:
      'Ngày 1: định nghĩa mốc giá trị đầu tiên dựa trên dữ liệu khách cũ. Ngày 2: vẽ dòng thời gian ba mươi ngày đầu và tìm khoảng trống dài nhất. Ngày 3: gọi cho năm khách đã rời và ghi nguyên văn lý do. Ngày 4: lập bảng tín hiệu cảnh báo sớm và gán người chịu trách nhiệm. Ngày 5: phân tích theo nhóm thời điểm cho mười hai tháng qua. Ngày 6: thiết kế một điểm chạm chỉ mang giá trị và gửi thử. Ngày 7: viết quy trình phục hồi sau sự cố và thống nhất mức bù đắp được phép.',
    evidence:
      'Bằng chứng gồm quy trình ba mươi ngày đầu do bạn thiết kế, bảng tín hiệu cảnh báo kèm hành động và người chịu trách nhiệm, và bảng phân tích theo nhóm khách vào cùng thời điểm trước và sau khi áp dụng. Ghi chép các cuộc gọi cho khách đã rời cũng rất giá trị vì rất ít nơi chịu làm việc này. Trong phỏng vấn, hãy trình bày mốc giá trị đầu tiên bạn đã định nghĩa và cách bạn tìm ra nó từ dữ liệu — đó là dấu hiệu của người làm việc bằng bằng chứng. Trong CV: "Thiết kế quy trình 30 ngày đầu và tín hiệu cảnh báo sớm cho gói bảo dưỡng xe; nâng tỷ lệ khách dùng hết gói ở các nhóm mới so với nhóm cũ trong 6 tháng".',
    references: [
      { label: 'Help Scout — thực hành hỗ trợ và giữ chân khách hàng', url: 'https://www.helpscout.com/blog/', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Customer service', url: 'https://hbr.org/topic/subject/customer-service', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 21 — Growth và Growth Loop
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Tăng trưởng bền vững đến từ những vòng lặp tự nuôi chính nó, chứ không từ chuỗi các chiến dịch rời rạc. Một phễu tiêu tốn đầu vào và kết thúc ở đơn hàng; một vòng lặp lấy đầu ra của bước cuối và biến nó thành đầu vào của bước đầu, ví dụ người dùng mới tạo ra nội dung, nội dung đó thu hút người dùng mới. Việc của người làm tăng trưởng là chọn một vòng, đo từng cạnh của nó, tìm cạnh đang rò rỉ và cải thiện đúng cạnh đó — mỗi lần một cạnh, để còn biết điều gì gây ra thay đổi.',
    why: {
      work: 'Vòng lặp giải thích vì sao hai doanh nghiệp có cùng ngân sách quảng cáo lại tăng trưởng khác nhau nhiều lần. Hiểu vòng lặp của chính mình giúp bạn biết nên đầu tư vào đâu để hiệu quả tích luỹ thay vì tan biến khi ngừng chi tiền.',
      interview:
        'Ứng viên vẽ được vòng lặp của công ty đang phỏng vấn và chỉ ra cạnh yếu nhất sẽ tạo ấn tượng rất mạnh, vì đó là bài tập đòi hỏi hiểu sản phẩm chứ không chỉ hiểu kênh truyền thông.',
      study:
        'Tư duy vòng lặp là tư duy hệ thống áp dụng vào kinh doanh: nhìn ra các mối phản hồi, độ trễ và giới hạn tăng trưởng. Nó chuyển được sang nhiều lĩnh vực khác.',
      life: 'Nguyên tắc tương tự giải thích vì sao một số thói quen tự duy trì còn số khác luôn cần nỗ lực: những thói quen tạo ra kết quả nuôi lại động lực sẽ tự chạy, còn những thói quen chỉ tiêu hao ý chí thì tắt ngay khi bạn bận.',
    },
    framework: [
      {
        name: 'Chọn đúng một vòng để tập trung',
        detail:
          'Các dạng phổ biến gồm vòng giới thiệu, vòng nội dung, vòng bán hàng lặp lại và vòng dữ liệu làm sản phẩm tốt lên. Chọn vòng phù hợp với bản chất sản phẩm và với hành vi có thật của khách hiện tại, thay vì bắt chước vòng của một công ty khác loại.',
      },
      {
        name: 'Vẽ vòng thành các cạnh có thể đo',
        detail:
          'Mỗi mũi tên là một tỷ lệ chuyển đổi hoặc một hệ số nhân, ví dụ bao nhiêu phần trăm khách mới giới thiệu ít nhất một người, và mỗi lời giới thiệu tạo ra bao nhiêu khách mới. Vòng chỉ có nghĩa khi mọi cạnh đều đo được, dù đo thủ công.',
      },
      {
        name: 'Đo tốc độ vòng, không chỉ đo tỷ lệ',
        detail:
          'Ngoài các tỷ lệ, hãy đo thời gian một vòng hoàn tất. Một vòng có hệ số tốt nhưng mất sáu tháng để quay hết sẽ tạo ra tăng trưởng chậm hơn nhiều so với vòng hệ số thấp hơn mà quay trong hai tuần.',
      },
      {
        name: 'Tìm cạnh yếu nhất và chỉ sửa một cạnh mỗi lần',
        detail:
          'Cải thiện cạnh yếu nhất thường cho hiệu quả cao hơn nhiều so với cải thiện cạnh đã tốt. Chỉ đổi một cạnh mỗi lần để còn quy được kết quả cho nguyên nhân; đổi ba thứ cùng lúc là mất khả năng học.',
      },
      {
        name: 'Kiểm xem vòng có thật sự tự nuôi không',
        detail:
          'Phép thử là ngừng chi tiền cho kênh trả phí một thời gian ngắn và xem lượng khách mới có tự duy trì ở mức nào. Nếu tất cả dừng lại, thứ bạn có là một phễu chạy bằng ngân sách chứ không phải một vòng lặp.',
      },
      {
        name: 'Giữ ranh giới đạo đức của cơ chế lan truyền',
        detail:
          'Không truy cập danh bạ để tự gửi lời mời, không gửi tin thay mặt người dùng, không đặt phần thưởng lớn tới mức khuyến khích mời người không có nhu cầu thật. Những cách này tạo con số đẹp trong ngắn hạn nhưng phá niềm tin và thường vi phạm quy định về dữ liệu cá nhân.',
      },
    ],
    scenario:
      'Một nền tảng kết nối gia sư với phụ huynh có hai phía và tăng trưởng phụ thuộc gần như hoàn toàn vào quảng cáo. Đội ngũ vẽ ra vòng lặp: phụ huynh hài lòng giới thiệu cho phụ huynh khác, số lượt học tăng làm thu nhập gia sư ổn định hơn, gia sư giỏi ở lại và giới thiệu đồng nghiệp, chất lượng nguồn gia sư tốt hơn lại làm phụ huynh hài lòng hơn. Họ đo từng cạnh bằng dữ liệu thật và phát hiện cạnh yếu nhất không nằm ở phía phụ huynh mà ở chỗ gia sư mới thường chỉ nhận được lượt học đầu tiên sau khá lâu, nên nhiều người bỏ nền tảng trước khi kịp có thu nhập. Thay vì tăng ngân sách quảng cáo, họ tập trung vào đúng một cạnh: rút ngắn thời gian từ lúc gia sư được duyệt tới lượt dạy đầu tiên, bằng cách ưu tiên hiển thị gia sư mới cho các yêu cầu phù hợp và hỗ trợ họ hoàn thiện hồ sơ trong tuần đầu. Sau ba tháng, tỷ lệ gia sư còn hoạt động sau ba mươi ngày tăng lên, nguồn cung ở các môn hiếm dày hơn, và tỷ lệ yêu cầu của phụ huynh được đáp ứng trong hai mươi bốn giờ cải thiện theo. Họ giữ nguyên ngân sách quảng cáo trong suốt thời gian này để có thể quy kết quả cho thay đổi đã làm.',
    comparison: [
      {
        weak: 'Coi tăng trưởng là chuỗi chiến dịch: tháng này khuyến mãi, tháng sau đổi kênh quảng cáo, tháng sau nữa thử một trào lưu mới.',
        mature: 'Xác định một vòng lặp, đo từng cạnh và cải thiện có hệ thống, để mỗi cải thiện tiếp tục có tác dụng ở các chu kỳ sau.',
      },
      {
        weak: 'Cải thiện cạnh đang mạnh nhất vì ở đó dễ thấy tiến bộ và dễ báo cáo.',
        mature: 'Xác định cạnh yếu nhất bằng dữ liệu và chấp nhận rằng việc sửa nó thường khó và kém hào nhoáng hơn.',
      },
      {
        weak: 'Đổi nhiều thứ cùng lúc để tăng tốc, rồi kết luận dựa trên tổng kết quả.',
        mature: 'Đổi một cạnh mỗi lần, giữ nguyên các yếu tố khác trong thời gian đủ dài để quy kết quả cho nguyên nhân.',
      },
      {
        weak: 'Thúc đẩy lan truyền bằng cách truy cập danh bạ, gửi tin thay mặt người dùng hoặc treo thưởng lớn cho việc mời bất kỳ ai.',
        mature: 'Chỉ tạo điều kiện để người thật sự hài lòng giới thiệu dễ dàng hơn, và thưởng ở mức không làm méo động cơ.',
      },
    ],
    mistakes: [
      'Sao chép vòng lặp của một mô hình kinh doanh khác hẳn về bản chất, ví dụ áp vòng lan truyền của ứng dụng mạng xã hội vào một dịch vụ mua một lần trong đời, rồi kết luận rằng tăng trưởng tự nhiên không khả thi.',
      'Chỉ nhìn hệ số của vòng mà bỏ qua thời gian quay vòng và điều kiện giới hạn, nên xây kế hoạch dựa trên tăng trưởng cấp số nhân trong khi thị trường mục tiêu thực tế nhỏ hơn nhiều lần.',
      'Đo tăng trưởng bằng những con số dễ tăng nhưng không gắn với giá trị thật, ví dụ số tài khoản đăng ký, khiến cả tổ chức tối ưu vào việc tạo tài khoản trong khi số người thật sự dùng không đổi.',
    ],
    worksheet: [
      'Vẽ vòng lặp hiện tại của bạn thành các bước nối lại với nhau. Nếu không nối lại được thành vòng, đó là dấu hiệu gì?',
      'Mỗi cạnh trong vòng có tỷ lệ hoặc hệ số nào? Cạnh nào bạn hiện chưa đo được và sẽ đo bằng cách gì?',
      'Một vòng của bạn mất bao lâu để hoàn tất, tính từ lúc một khách mới bắt đầu tới lúc họ tạo ra một khách mới khác?',
      'Cạnh yếu nhất là cạnh nào, và bạn dựa vào dữ liệu nào để khẳng định điều đó?',
      'Nếu ngừng toàn bộ chi tiêu quảng cáo trong hai tuần, bạn dự đoán lượng khách mới còn lại bao nhiêu phần? Bạn có dám thử không?',
    ],
    exercises: [
      {
        label: 'Vẽ vòng lặp',
        text: 'Vẽ vòng lặp của doanh nghiệp bạn trên một trang giấy, mỗi mũi tên ghi rõ hành vi nào dẫn tới hành vi nào. Đưa cho một đồng nghiệp và nhờ họ chỉ chỗ đứt.',
        level: 'e',
      },
      {
        label: 'Gán số cho từng cạnh',
        text: 'Với mỗi cạnh, tìm hoặc ước lượng một con số từ dữ liệu thật, ghi rõ nguồn và khoảng thời gian. Đánh dấu cạnh nào đang phải đoán.',
        level: 'e',
      },
      {
        label: 'Đo thời gian quay vòng',
        text: 'Chọn hai mươi khách hàng gần nhất, đo thời gian từ khi họ bắt đầu tới khi họ tạo ra một khách mới nếu có. Tính trung vị và ghi lại phân bố.',
        level: 'e',
      },
      {
        label: 'Tìm cạnh yếu nhất',
        text: 'So sánh các cạnh, tính xem cải thiện mỗi cạnh mười phần trăm sẽ tác động thế nào tới toàn vòng. Chọn cạnh có tác động lớn nhất và ghi lý do.',
        level: 'm',
      },
      {
        label: 'Một thay đổi một cạnh',
        text: 'Thiết kế một thay đổi duy nhất cho cạnh yếu nhất, giữ nguyên mọi yếu tố khác kể cả ngân sách quảng cáo, chạy trong thời gian đủ dài. Ghi lại giả thuyết trước khi bắt đầu.',
        level: 'm',
      },
      {
        label: 'Phép thử tắt kênh trả phí',
        text: 'Nếu điều kiện cho phép, giảm hoặc tạm dừng chi tiêu trả phí trong một khoảng ngắn đã tính toán rủi ro, và đo phần khách mới còn lại. Ghi kết quả và khôi phục.',
        level: 'h',
      },
      {
        label: 'Rà đạo đức cơ chế lan truyền',
        text: 'Rà mọi cơ chế mời và chia sẻ hiện có, đánh dấu chỗ nào lấy dữ liệu người dùng vượt quá điều họ đồng ý hoặc gửi tin thay mặt họ. Sửa hoặc gỡ bỏ và ghi lại tác động.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: hỏi nguồn mọi khách mới',
        text: 'Bảy ngày, hỏi mọi khách mới câu duy nhất về việc họ biết tới bạn qua đâu và ghi nguyên văn, không dùng danh sách chọn sẵn. Ngày thứ bảy phân loại các câu trả lời và so với giả định của bạn về vòng lặp; những nguồn xuất hiện mà bạn chưa từng đưa vào mô hình chính là các cạnh bạn đang bỏ qua.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Phễu và vòng lặp khác nhau ở đâu?',
        a: 'Phễu là một đường thẳng: bạn đưa đầu vào vào đầu này, một tỷ lệ nào đó đi ra ở đầu kia, và khi ngừng đưa đầu vào thì đầu ra dừng. Vòng lặp có một cạnh nối đầu ra trở lại đầu vào, nên mỗi chu kỳ tạo ra nguyên liệu cho chu kỳ sau và tác động của một cải thiện được tích luỹ theo thời gian. Điều này không có nghĩa phễu vô dụng: phễu vẫn cần thiết để mô tả và tối ưu một đoạn cụ thể. Nhưng chiến lược tăng trưởng dài hạn phải trả lời được câu hỏi khách hàng hôm nay tạo ra khách hàng ngày mai bằng cơ chế nào.',
      },
      {
        q: 'Vì sao thời gian quay vòng quan trọng ngang hệ số của vòng?',
        a: 'Vì tăng trưởng tích luỹ phụ thuộc vào cả hai. Một vòng mà mỗi khách tạo ra một phần tư khách mới nhưng quay hết trong hai tuần sẽ vượt xa một vòng có hệ số cao hơn nhưng mất nửa năm mới quay xong. Trong thực tế, rút ngắn thời gian quay vòng thường dễ hơn nâng hệ số, vì nó liên quan tới việc gỡ các nút thắt trong trải nghiệm như thời gian chờ duyệt, thời gian tới kết quả đầu tiên, hay độ khó của thao tác chia sẻ. Đó cũng là lý do các cải thiện tưởng chừng nhỏ về tốc độ lại có tác động lớn tới tăng trưởng.',
      },
      {
        q: 'Vì sao số tài khoản đăng ký là chỉ số tăng trưởng nguy hiểm?',
        a: 'Vì nó rất dễ tăng bằng những cách không tạo ra giá trị: bắt đăng ký mới xem được nội dung, tặng quà cho việc tạo tài khoản, hoặc chạy quảng cáo tới nhóm không có nhu cầu. Khi tổ chức bị đo bằng chỉ số này, mọi bộ phận sẽ tối ưu đúng theo nó và bạn có một cơ sở dữ liệu lớn gồm những người không bao giờ quay lại. Chỉ số lành mạnh hơn phải gắn với hành vi thể hiện giá trị thật, ví dụ số người hoàn tất một tác vụ cốt lõi trong tuần, vì hành vi đó khó tăng giả và nó là nguyên liệu thật cho vòng lặp.',
      },
    ],
    plan7:
      'Ngày 1: vẽ vòng lặp hiện tại và nhờ đồng nghiệp chỉ chỗ đứt. Ngày 2: gán số cho từng cạnh, đánh dấu cạnh đang phải đoán. Ngày 3: đo thời gian quay vòng cho hai mươi khách gần nhất. Ngày 4: tính tác động của việc cải thiện mười phần trăm từng cạnh và chọn cạnh yếu nhất. Ngày 5: viết giả thuyết và thiết kế đúng một thay đổi cho cạnh đó. Ngày 6: rà các cơ chế mời và chia sẻ theo tiêu chí đạo đức và dữ liệu cá nhân. Ngày 7: bắt đầu hỏi nguồn của mọi khách mới bằng câu hỏi mở và mở sổ ghi.',
    evidence:
      'Bằng chứng gồm sơ đồ vòng lặp có số thật trên từng cạnh, thiết kế của một thí nghiệm đổi đúng một cạnh kèm giả thuyết viết trước, và kết quả có nêu rõ điều kiện giữ nguyên. Rất giá trị nếu bạn ghi lại một cơ chế lan truyền đã chủ động gỡ bỏ vì lý do đạo đức hoặc dữ liệu cá nhân. Trong phỏng vấn, hãy vẽ vòng lặp của chính công ty đang tuyển và nêu giả thuyết về cạnh yếu nhất kèm cách bạn sẽ kiểm chứng nó trong bốn tuần đầu. Trong CV: "Mô hình hoá vòng tăng trưởng hai phía của nền tảng gia sư, xác định cạnh yếu là thời gian tới lượt dạy đầu tiên của gia sư mới; cải thiện đúng cạnh đó và nâng tỷ lệ gia sư còn hoạt động sau 30 ngày trong 1 quý, ngân sách quảng cáo giữ nguyên".',
    references: [
      { label: 'Andrew Chen — bài viết về tăng trưởng, hiệu ứng mạng và vòng lặp', url: 'https://andrewchen.com/', type: 'article' },
      { label: 'Y Combinator Library — tài liệu về tăng trưởng cho công ty giai đoạn đầu', url: 'https://www.ycombinator.com/library', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 22 — Đo hiệu quả kinh doanh
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Đo hiệu quả kinh doanh là việc chọn một số ít con số phản ánh đúng sức khoẻ thật của doanh nghiệp, hiểu chúng nối với nhau bằng quan hệ nào, và duy trì một nhịp xem xét đủ đều để phát hiện sớm khi có gì đó lệch. Cạm bẫy lớn nhất không phải thiếu số liệu mà là thừa: một bảng điều khiển ba mươi chỉ số làm mọi người nhìn vào nhưng không ai ra quyết định gì, vì không chỉ số nào đủ quan trọng để buộc hành động. Chỉ số tốt có ba đặc điểm: gắn với giá trị khách nhận được, khó tăng giả, và khi nó đổi thì có người phải làm gì đó.',
    why: {
      work: 'Không có hệ đo lường thống nhất thì mỗi phòng ban tự chọn con số làm mình trông đẹp nhất, và các cuộc họp trở thành nơi so sánh các bức tranh không tương thích. Một cây chỉ số chung làm cho tranh luận về chiến lược có cơ sở.',
      interview:
        'Câu hỏi bạn theo dõi chỉ số nào cho vị trí này là bài kiểm tra chiều sâu. Người trả lời được vì sao chọn chỉ số đó, nó nối với doanh thu qua mấy bước và có thể bị bóp méo thế nào sẽ được đánh giá là đã làm thật.',
      study:
        'Đọc và diễn giải số liệu, phân biệt tương quan với nhân quả, hiểu vì sao trung bình có thể đánh lừa — đây là những kỹ năng nền tảng cho mọi báo cáo và mọi luận văn có phần định lượng.',
      life: 'Cùng nguyên tắc dùng cho tài chính cá nhân: chọn vài con số đủ nói lên tình hình, xem lại theo nhịp cố định, và tránh nhìn quá nhiều thứ tới mức không hành động gì. Với các quyết định tài chính lớn, hãy tham vấn người có chuyên môn phù hợp.',
    },
    framework: [
      {
        name: 'Chọn một chỉ số dẫn dắt gắn với giá trị khách nhận được',
        detail:
          'Một con số duy nhất mà cả tổ chức hiểu và ảnh hưởng được, phản ánh việc khách thật sự nhận giá trị: số đơn giao đúng hẹn, số buổi học hoàn thành, số hồ sơ xử lý xong. Doanh thu là kết quả chứ không phải chỉ số dẫn dắt vì nó tới quá muộn để điều chỉnh.',
      },
      {
        name: 'Dựng cây chỉ số phân rã xuống việc làm được',
        detail:
          'Từ chỉ số dẫn dắt, phân rã thành các nhánh mà từng nhóm tác động trực tiếp: số khách tiềm năng, tỷ lệ chuyển đổi, giá trị trung bình mỗi đơn, tần suất mua lại. Mỗi nhánh phải có tên một người chịu trách nhiệm, nếu không nó chỉ là số liệu để ngắm.',
      },
      {
        name: 'Theo dõi đơn vị kinh tế của một khách hàng',
        detail:
          'Ba con số tối thiểu: chi phí để có một khách, lợi nhuận gộp trung bình từ một khách, và thời gian hoàn vốn. Doanh nghiệp có thể tăng trưởng nhanh mà vẫn hỏng nếu chi phí có khách vượt giá trị họ mang lại, và điều này chỉ hiện ra khi tính theo đơn vị.',
      },
      {
        name: 'Đặt nhịp xem xét và quy tắc hành động',
        detail:
          'Số liệu vận hành xem hằng tuần, số liệu chiến lược xem hằng tháng hoặc hằng quý. Với mỗi chỉ số, viết trước ngưỡng nào thì phải làm gì. Không có quy tắc hành động thì cuộc họp số liệu chỉ tạo cảm giác đang kiểm soát.',
      },
      {
        name: 'Phân biệt chỉ số phù phiếm và chỉ số dùng được',
        detail:
          'Chỉ số phù phiếm luôn tăng theo thời gian, không so sánh được và không dẫn tới hành động nào, ví dụ tổng số người đã từng đăng ký. Chỉ số dùng được có mẫu số, có kỳ so sánh, và khi nó xấu đi thì bạn biết ai cần làm gì.',
      },
      {
        name: 'Kiểm tra chất lượng dữ liệu trước khi kết luận',
        detail:
          'Trước mỗi kết luận quan trọng, kiểm ba thứ: cách ghi nhận có đổi trong kỳ không, có bị trùng hoặc thiếu dữ liệu không, và số mẫu có đủ để nói lên điều gì không. Rất nhiều quyết định sai bắt nguồn từ một thay đổi kỹ thuật trong cách đo chứ không từ thị trường.',
      },
    ],
    scenario:
      'Một chuỗi bốn cửa hàng bán đồ gia dụng bán cả tại quầy lẫn qua kênh trực tuyến, họp mỗi tuần với một bảng gồm hai mươi bảy chỉ số. Các buổi họp kéo dài, mọi người đọc số rồi ra về, và không ai nhớ tuần trước đã quyết định gì. Quản lý vận hành làm lại từ đầu: chọn chỉ số dẫn dắt là số đơn hàng được giao hoặc nhận đúng cam kết trong tuần, vì đó là điều khách hàng đánh giá và cả bốn cửa hàng đều tác động được. Anh phân rã thành bốn nhánh có chủ: lượng khách tới, tỷ lệ chốt tại quầy, tỷ lệ đơn trực tuyến giao đúng hẹn, và tỷ lệ khách quay lại trong chín mươi ngày. Anh cũng tính lại đơn vị kinh tế và phát hiện các đơn trực tuyến giá trị nhỏ giao nội thành đang lỗ sau khi tính chi phí giao và tỷ lệ hoàn. Bảng điều khiển rút xuống sáu chỉ số, mỗi chỉ số có ngưỡng và quy tắc hành động viết sẵn. Cuộc họp tuần rút còn ba mươi phút và kết thúc bằng danh sách việc có tên người. Sau hai tháng, tỷ lệ đơn đúng cam kết cải thiện và chuỗi đặt mức giá trị đơn tối thiểu cho giao hàng miễn phí, dựa trên con số chứ không dựa trên cảm tính.',
    comparison: [
      {
        weak: 'Xây bảng điều khiển đầy đủ nhất có thể để không bỏ sót thông tin nào.',
        mature: 'Giữ ít chỉ số, mỗi cái có chủ và có quy tắc hành động, phần còn lại đưa vào báo cáo tra cứu khi cần.',
      },
      {
        weak: 'Nhìn tổng doanh thu và tổng số khách để đánh giá sức khoẻ.',
        mature: 'Tính theo đơn vị một khách hàng: chi phí có khách, lợi nhuận gộp, thời gian hoàn vốn, và xem theo từng nhóm kênh hoặc nhóm sản phẩm.',
      },
      {
        weak: 'Kết luận ngay khi thấy một chỉ số biến động mạnh trong tuần.',
        mature: 'Kiểm chất lượng dữ liệu và yếu tố mùa vụ trước, xem chuỗi đủ dài, rồi mới quy nguyên nhân và hành động.',
      },
      {
        weak: 'Báo cáo bằng những con số làm bộ phận mình trông tốt nhất trong kỳ này.',
        mature: 'Dùng chung một định nghĩa chỉ số cho toàn tổ chức, công bố cả những chỉ số đang xấu, và ghi lại thay đổi định nghĩa nếu có.',
      },
    ],
    mistakes: [
      'Đặt chỉ số thưởng phạt vào một con số dễ bóp méo, ví dụ chỉ đo số cuộc gọi thực hiện, khiến nhân viên tối ưu đúng con số đó bằng cách gọi nhiều cuộc ngắn vô nghĩa và chất lượng thật xấu đi trong khi bảng số liệu đẹp lên.',
      'So sánh hai kỳ mà cách ghi nhận đã thay đổi ở giữa, ví dụ đổi công cụ đo hoặc đổi định nghĩa khách hàng hoạt động, rồi kết luận về xu hướng thị trường; đây là lỗi rất phổ biến và rất khó phát hiện nếu không có nhật ký thay đổi.',
      'Trình bày ước lượng nội bộ như thể là số liệu chắc chắn khi báo cáo lên cấp trên hoặc ra bên ngoài; hãy nêu rõ phạm vi, phương pháp và mức không chắc chắn, và với các con số tài chính có tính pháp lý thì phải đối chiếu với kế toán.',
    ],
    worksheet: [
      'Nếu chỉ được giữ một chỉ số cho quý này, bạn giữ chỉ số nào và vì sao nó phản ánh giá trị khách nhận được?',
      'Phân rã chỉ số đó thành ba tới bốn nhánh. Ai là người chịu trách nhiệm cho từng nhánh, tên cụ thể?',
      'Chi phí để có một khách hàng của bạn là bao nhiêu, lợi nhuận gộp trung bình từ một khách là bao nhiêu, và bao lâu thì hoàn vốn?',
      'Với mỗi chỉ số trên bảng của bạn, hãy viết một câu quy tắc: nếu vượt hoặc dưới ngưỡng nào thì ai làm gì?',
      'Trong ba tháng qua, đã có thay đổi nào về cách ghi nhận dữ liệu chưa? Nếu có, nó nằm ở đâu và ai biết về nó?',
    ],
    exercises: [
      {
        label: 'Cắt bảng điều khiển',
        text: 'Lấy bảng chỉ số hiện tại, đánh dấu chỉ số nào đã dẫn tới một hành động cụ thể trong ba tháng qua. Xoá phần còn lại khỏi bảng chính và đưa vào phụ lục tra cứu.',
        level: 'e',
      },
      {
        label: 'Chọn chỉ số dẫn dắt',
        text: 'Viết ba ứng viên cho chỉ số dẫn dắt, chấm mỗi cái theo ba tiêu chí: gắn với giá trị khách, khó tăng giả, có người tác động được. Chọn một và giải thích cho cả nhóm.',
        level: 'e',
      },
      {
        label: 'Vẽ cây chỉ số',
        text: 'Phân rã chỉ số dẫn dắt thành các nhánh trên một trang, ghi tên người chịu trách nhiệm cho từng nhánh. Nhánh nào không tìm được chủ thì đánh dấu để bàn lại.',
        level: 'e',
      },
      {
        label: 'Tính đơn vị kinh tế',
        text: 'Tính chi phí có một khách theo từng kênh, lợi nhuận gộp trung bình và thời gian hoàn vốn. Ghi rõ giả định và những chi phí bạn chưa phân bổ được.',
        level: 'm',
      },
      {
        label: 'Viết quy tắc hành động',
        text: 'Với mỗi chỉ số còn lại trên bảng, viết một câu nếu thì gồm ngưỡng, người hành động và hành động cụ thể. Dùng thử trong bốn tuần và ghi số lần quy tắc được kích hoạt.',
        level: 'm',
      },
      {
        label: 'Nhật ký thay đổi cách đo',
        text: 'Mở một nhật ký ghi mọi thay đổi về công cụ, định nghĩa và cách ghi nhận dữ liệu kèm ngày. Rà ngược ba tháng qua và điền những thay đổi bạn nhớ được.',
        level: 'm',
      },
      {
        label: 'Điều tra một biến động',
        text: 'Chọn một biến động mạnh gần đây, điều tra theo thứ tự: lỗi dữ liệu, thay đổi cách đo, yếu tố mùa vụ, thay đổi bên ngoài, rồi mới tới nguyên nhân nội bộ. Viết kết luận kèm mức độ chắc chắn.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: một số một hành động',
        text: 'Bảy ngày, mỗi ngày chọn đúng một con số của doanh nghiệp, viết ra nó nói lên điều gì và một hành động cụ thể bạn sẽ làm hoặc quyết định không làm gì kèm lý do. Ngày thứ bảy đọc lại bảy ghi chép: những con số không dẫn tới hành động nào trong cả tuần là ứng viên đầu tiên để loại khỏi bảng điều khiển.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao doanh thu không nên là chỉ số dẫn dắt hằng tuần?',
        a: 'Vì nó là kết quả cuối của một chuỗi dài các hành vi và thường tới quá muộn để điều chỉnh. Khi doanh thu tháng này giảm, nguyên nhân có thể đã xảy ra từ nhiều tuần trước ở khâu tạo cơ hội hoặc ở chất lượng phục vụ. Ngoài ra, doanh thu bị ảnh hưởng bởi nhiều yếu tố mà đội ngũ không tác động trực tiếp được, nên nó không hướng dẫn hành động. Chỉ số dẫn dắt tốt là chỉ số nằm trước doanh thu trong chuỗi nhân quả, gắn với giá trị khách nhận được, và đủ nhạy để thay đổi trong tuần.',
      },
      {
        q: 'Điều gì phân biệt một chỉ số phù phiếm với một chỉ số dùng được?',
        a: 'Ba dấu hiệu. Thứ nhất, chỉ số phù phiếm thường là con số cộng dồn chỉ có thể tăng, ví dụ tổng số tài khoản từng tạo, nên nó luôn đẹp bất kể tình hình. Thứ hai, nó không có mẫu số và không có kỳ so sánh, nên không nói được điều gì về hiệu quả. Thứ ba, và quan trọng nhất, khi nó thay đổi thì không ai biết phải làm gì khác đi. Chỉ số dùng được luôn có mẫu số hoặc khung thời gian, so sánh được giữa các kỳ và giữa các nhóm, và gắn với một quy tắc hành động đã viết trước.',
      },
      {
        q: 'Khi một chỉ số biến động mạnh, thứ tự kiểm tra nên là gì?',
        a: 'Kiểm dữ liệu trước, thị trường sau. Cụ thể: trước hết xem có lỗi ghi nhận, trùng lặp hay thiếu dữ liệu không; kế đến xem có ai đổi công cụ đo, đổi định nghĩa hoặc đổi cách gắn thẻ theo dõi trong kỳ không; rồi tới yếu tố mùa vụ và ngày lễ; rồi mới tới thay đổi bên ngoài như đối thủ hoặc chính sách; cuối cùng mới tới nguyên nhân nội bộ về sản phẩm hoặc vận hành. Đảo ngược thứ tự này là cách nhanh nhất để cả tổ chức lao vào sửa một vấn đề không tồn tại, và kinh nghiệm cho thấy tỷ lệ biến động bất thường đến từ chính hệ đo lường cao hơn nhiều so với trực giác.',
      },
    ],
    plan7:
      'Ngày 1: đánh dấu chỉ số nào trên bảng hiện tại đã từng dẫn tới hành động thật. Ngày 2: chọn chỉ số dẫn dắt theo ba tiêu chí và giải thích cho cả nhóm. Ngày 3: vẽ cây chỉ số và gán tên người cho từng nhánh. Ngày 4: tính đơn vị kinh tế theo kênh và ghi rõ giả định. Ngày 5: viết quy tắc hành động cho từng chỉ số còn lại. Ngày 6: mở nhật ký thay đổi cách đo và điền ngược ba tháng. Ngày 7: chạy cuộc họp số liệu theo bảng mới, giới hạn ba mươi phút và kết thúc bằng danh sách việc có tên người.',
    evidence:
      'Bằng chứng gồm cây chỉ số một trang có tên người chịu trách nhiệm, bảng quy tắc hành động theo ngưỡng, bảng tính đơn vị kinh tế có ghi giả định, và nhật ký thay đổi cách đo. Nếu bạn từng thu gọn một bảng điều khiển từ hàng chục chỉ số xuống dưới mười, hãy giữ cả bản trước và sau cùng ghi chép về thay đổi trong cách họp. Trong phỏng vấn, hãy kể một lần bạn phát hiện biến động là do lỗi đo lường chứ không do thị trường — câu chuyện này chứng minh kỷ luật kiểm chứng. Trong CV: "Thu gọn bảng chỉ số của chuỗi 4 cửa hàng từ 27 xuống 6, gắn mỗi chỉ số với ngưỡng và người chịu trách nhiệm; phát hiện nhóm đơn trực tuyến giá trị nhỏ lỗ sau chi phí giao và điều chỉnh chính sách giao hàng theo số liệu".',
    references: [
      { label: 'For Entrepreneurs — khung chỉ số và đơn vị kinh tế cho doanh nghiệp', url: 'https://www.forentrepreneurs.com/', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Analytics and data science', url: 'https://hbr.org/topic/subject/analytics-and-data-science', type: 'article' },
    ],
    diagram: 'cycle',
  }),
];
