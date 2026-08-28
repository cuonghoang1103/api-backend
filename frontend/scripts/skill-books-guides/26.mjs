import { guide } from '../skill-guide-builder.mjs';

export default [
  // ── Chương 1 · Tự nhận thức — Self-awareness ──────────────────────────────
  guide({
    thesis:
      'Tự nhận thức không phải là nghĩ nhiều về bản thân, mà là khả năng mô tả tương đối chính xác mình đang cảm thấy gì, làm tốt việc gì, thường hỏng ở đâu và hành vi của mình tạo ra ảnh hưởng nào lên người khác. Thước đo của nó không nằm trong đầu bạn: nó nằm ở chỗ mô tả của bạn về bản thân trùng bao nhiêu phần với những gì người xung quanh quan sát được và với dữ liệu kết quả thật.',
    why: {
      work:
        'Biết mình hay hụt ở khâu nào (ước lượng thời gian, làm rõ phạm vi, hay nhận quá nhiều việc) giúp bạn đặt chốt kiểm ngay tại khâu đó thay vì hứa "lần sau sẽ cố hơn" rồi lặp lại đúng lỗi cũ.',
      interview:
        'Câu "điểm yếu lớn nhất của bạn là gì" chỉ ghi điểm khi bạn nêu được một điểm yếu cụ thể, nguồn thông tin phát hiện ra nó (phản hồi của ai, số liệu nào) và cơ chế bạn đã dựng để nó không tái phát.',
      study:
        'Người học có tự nhận thức phân biệt được "đã hiểu bài giảng" với "làm được bài không nhìn lời giải", nên họ đo bằng bài kiểm tra tự tạo chứ không đo bằng cảm giác quen thuộc khi đọc lại.',
      life:
        'Nhận ra mình đang mệt hay đang đói trước khi ra một quyết định lớn giúp bạn dời quyết định lại vài giờ — rẻ hơn nhiều so với việc gánh hậu quả của một câu nói buột miệng lúc kiệt sức.',
    },
    framework: [
      {
        name: 'Ghi sự kiện',
        detail:
          'Chép lại tình huống bằng ngôn ngữ camera: ai nói gì, bạn làm gì, lúc mấy giờ. Cấm dùng tính từ đánh giá ("tôi lười", "sếp khó tính") ở bước này vì nhãn dán làm bạn ngừng tìm nguyên nhân.',
      },
      {
        name: 'Gọi tên bên trong',
        detail:
          'Với mỗi sự kiện, viết cảm xúc (giận, xấu hổ, lo, tủi), nhu cầu chưa được đáp ứng (được công nhận, được rõ ràng, được nghỉ) và giả định bạn đang tin là đúng.',
      },
      {
        name: 'Đối chiếu ngoài',
        detail:
          'Hỏi 2–3 người làm việc gần bạn một câu hẹp: "Trong cuộc họp hôm qua, lúc nào bạn thấy tôi khó tiếp thu nhất?" Rồi so câu trả lời với dữ liệu kết quả (số lần trễ hạn, số vòng review, số việc bị trả lại).',
      },
      {
        name: 'Thử một hành vi',
        detail:
          'Chọn đúng một hành vi thay thế, đủ nhỏ để làm được trong tuần, và định trước dấu hiệu nào chứng tỏ nó có tác dụng. Không có dấu hiệu định trước thì bạn sẽ tự chấm điểm theo tâm trạng.',
      },
    ],
    scenario:
      'Một kỹ sư backend trễ hạn bốn sprint liên tiếp và tự kết luận "mình thiếu kỷ luật". Anh ghi nhật ký sự kiện hai tuần theo mẫu ba cột (việc — điều tôi đã giả định — điều thực tế xảy ra). Nhật ký cho thấy anh không hề lười: mọi lần trễ đều bắt đầu bằng việc nhận ticket có mô tả mơ hồ, tự đoán phạm vi, rồi âm thầm xử lý phần phát sinh mà không báo. Anh đổi một hành vi duy nhất: trước khi kéo ticket vào In Progress, viết ba dòng Definition of Done và dán vào ticket để PO xác nhận. Ba sprint sau đó anh đúng hạn mà không làm thêm giờ, và phần "phát sinh" trở thành ticket riêng có người ước lượng lại.',
    comparison: [
      {
        weak: 'Kết luận về bản thân bằng nhãn tính cách: "tôi là người hay trì hoãn", "tôi vốn hướng nội nên không thuyết trình được".',
        mature:
          'Kết luận bằng câu có điều kiện: "tôi trì hoãn khi việc chưa có bước đầu tiên rõ ràng và không có hạn giữa kỳ" — dạng câu này chỉ ngay chỗ để can thiệp.',
      },
      {
        weak: 'Chỉ soi mình bằng nội tâm: ngồi nghĩ lại, viết dài, rồi tin bản tường thuật do chính mình dựng lên.',
        mature:
          'Bắt buộc có ít nhất một nguồn ngoài cho mỗi kết luận quan trọng: phản hồi của người cụ thể, bản ghi cuộc họp, hoặc số liệu kết quả.',
      },
      {
        weak: 'Hỏi phản hồi bằng câu rộng "anh thấy em thế nào?", nhận về "ổn mà", rồi kết luận là không có vấn đề gì.',
        mature:
          'Hỏi hẹp theo tình huống và mốc thời gian: "trong bản thiết kế tôi gửi thứ Ba, chỗ nào anh phải đọc lại hai lần mới hiểu?"',
      },
    ],
    mistakes: [
      'Nhầm tự nhận thức với tự phê bình: viết nhật ký toàn những câu chê mình, thấy day dứt rồi tưởng đó là tiến bộ, trong khi không có bất kỳ hành vi nào được đổi.',
      'Tin rằng ai càng suy nghĩ nhiều về bản thân thì càng hiểu mình — nhưng suy nghĩ vòng quanh (rumination) chủ yếu củng cố bản tường thuật cũ chứ không tạo dữ liệu mới.',
      'Xin phản hồi rồi giải thích ngay tại chỗ vì sao mình đã làm đúng; sau hai lần như vậy người ta ngừng nói thật và bạn mất luôn nguồn dữ liệu ngoài duy nhất.',
    ],
    worksheet: [
      'Ba tình huống gần nhất khiến bạn khó chịu kéo dài hơn một giờ là gì? Viết mỗi tình huống bằng đúng hai câu, không dùng tính từ đánh giá.',
      'Với mỗi tình huống trên, giả định nào bạn đã coi là sự thật mà chưa hề kiểm chứng với người liên quan?',
      'Nếu chọn ba người quan sát bạn nhiều nhất (một ở công việc, một ở nhà, một là bạn thân), mỗi người sẽ mô tả điểm mạnh của bạn khác nhau ở chỗ nào — và vì sao khác?',
      'Có việc nào bạn thấy mình làm tốt nhưng kết quả thật (số liệu, phản hồi, kết quả đánh giá) lại không xác nhận điều đó? Ghi cả hai vế cạnh nhau.',
      'Một hành vi nhỏ bạn sẽ thử trong 7 ngày tới là gì, và dấu hiệu nào — quan sát được bởi người khác — sẽ cho biết nó có tác dụng?',
    ],
    exercises: [
      {
        label: 'Nhật ký ba cột',
        text: 'Trong 5 ngày làm việc, mỗi cuối ngày ghi một dòng theo ba cột: sự kiện (ngôn ngữ camera) — cảm xúc và nhu cầu — giả định của tôi. Ngày thứ 6 đọc lại và khoanh giả định nào lặp lại nhiều nhất.',
        level: 'e',
      },
      {
        label: 'Tách dữ kiện khỏi diễn giải',
        text: 'Lấy một email hoặc tin nhắn từng khiến bạn khó chịu. Kẻ đôi tờ giấy: bên trái chép nguyên văn những gì người kia thật sự viết, bên phải chép những gì bạn đã thêm vào khi đọc. So độ dài hai cột.',
        level: 'e',
      },
      {
        label: 'Bản đồ điểm mạnh có bằng chứng',
        text: 'Liệt kê 5 việc bạn tin mình làm tốt. Với mỗi việc, ghi một bằng chứng ngoài trong 6 tháng qua (ai đó nhờ bạn làm đúng việc đó, một kết quả đo được, một lời khen cụ thể). Việc nào không có bằng chứng nào thì đánh dấu là "giả thuyết".',
        level: 'e',
      },
      {
        label: 'Ba câu hỏi hẹp',
        text: 'Soạn ba câu hỏi phản hồi gắn với một sự kiện cụ thể trong tuần qua (không hỏi chung chung), gửi cho ba người khác nhau, và cam kết chỉ trả lời "cảm ơn, cho tôi ví dụ nữa được không" chứ không giải thích.',
        level: 'm',
      },
      {
        label: 'Đối chiếu tự đánh giá',
        text: 'Chấm điểm bản thân từ 1–5 trên năm tiêu chí công việc (rõ ràng khi viết, đúng hạn, chủ động báo rủi ro, nghe hết ý người khác, xử lý bất đồng). Nhờ một đồng nghiệp chấm cùng bộ tiêu chí. Chỉ phân tích những ô lệch từ 2 điểm trở lên.',
        level: 'm',
      },
      {
        label: 'Nghe lại chính mình',
        text: 'Ghi âm (có xin phép) một cuộc họp bạn chủ trì, hoặc tự quay 5 phút trình bày. Nghe lại và đếm ba con số: số lần bạn cắt lời, số câu bạn nói mà không ai hỏi lại, thời lượng bạn nói so với tổng thời lượng.',
        level: 'm',
      },
      {
        label: 'Bảy ngày một giả định',
        text: 'Chọn một giả định về bản thân xuất hiện nhiều nhất trong nhật ký ("tôi không hợp việc ngoại giao"). Trong 7 ngày, mỗi ngày làm một hành động nhỏ đi ngược giả định đó và ghi kết quả thật. Cuối tuần viết một đoạn kết luận có dẫn chứng.',
        level: 'h',
      },
      {
        label: 'Hồ sơ vận hành cá nhân',
        text: 'Viết một trang "cách làm việc với tôi": tôi làm tốt nhất khi nào, tôi thường hỏng ở khâu nào, muốn phản hồi cho tôi thì nói kiểu gì hiệu quả nhất. Gửi cho hai người cùng nhóm và sửa lại theo phần họ thấy chưa đúng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao chỉ tự suy ngẫm một mình lại không đủ để có tự nhận thức chính xác?',
        a: 'Vì bạn không quan sát được tác động của mình lên người khác, và bộ nhớ có xu hướng dựng lại câu chuyện theo hướng nhất quán với hình ảnh sẵn có về bản thân. Cần nguồn ngoài (phản hồi cụ thể, bản ghi, số liệu kết quả) để phát hiện chỗ lệch.',
      },
      {
        q: 'Phân biệt hai câu: "Tôi là người nóng tính" và "Tôi to tiếng khi bị hỏi dồn trước mặt nhóm". Câu nào dùng được và vì sao?',
        a: 'Câu thứ hai. Nó nêu hành vi cụ thể và điều kiện kích hoạt, nên có thể can thiệp (xin dời câu hỏi sang trao đổi riêng, chuẩn bị trước câu trả lời). Câu thứ nhất là nhãn tính cách, không chỉ ra chỗ nào để thay đổi.',
      },
      {
        q: 'Bạn xin phản hồi và nhận được "em ổn mà, không có gì". Hỏi lại thế nào cho ra dữ liệu?',
        a: 'Thu hẹp vào một sự kiện và một khía cạnh, đồng thời hạ chi phí xã hội cho người trả lời: "Trong bản kế hoạch em gửi thứ Ba, nếu phải bỏ một phần vì khó hiểu thì anh bỏ phần nào?" Câu hỏi buộc chọn dễ trả lời hơn câu hỏi mở.',
      },
    ],
    plan7:
      'Ngày 1: chọn một tình huống lặp lại đang gây tốn kém và ghi baseline bằng con số (số lần xảy ra trong tháng qua). Ngày 2–3: ghi nhật ký ba cột mỗi tối, không sửa, không phán xét. Ngày 4: đọc lại và khoanh đúng một giả định lặp nhiều nhất. Ngày 5: gửi ba câu hỏi phản hồi hẹp cho ba người, chỉ nghe và ghi. Ngày 6: chọn một hành vi thay thế và thực hiện trong đúng một tình huống thật. Ngày 7: viết một trang gồm bốn phần — điều tôi đã tin, dữ liệu tôi thu được, chỗ hai thứ đó lệch nhau, hành vi tôi giữ cho tuần sau.',
    evidence:
      'Biến nhật ký thành một câu chuyện STAR dài 90 giây cho phần "điểm yếu / bài học": tình huống (trễ 4 sprint), điều bạn đã làm để tìm nguyên nhân thật (nhật ký 2 tuần + hỏi PO), thay đổi cụ thể (viết Definition of Done trước khi bắt đầu), kết quả có số (3 sprint đúng hạn, số ticket phát sinh được ước lượng lại). Trong portfolio, đính kèm bản "cách làm việc với tôi" một trang — đây là tài liệu hiếm khi ứng viên có và nó cho thấy bạn quen làm việc với phản hồi.',
    references: [
      { label: 'Greater Good Science Center (UC Berkeley) — chuyên mục Mindfulness', url: 'https://greatergood.berkeley.edu/topic/mindfulness', type: 'article' },
      { label: 'PositivePsychology.com — sách và bài tập về tự nhận thức', url: 'https://positivepsychology.com/self-awareness/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 2 · Xác định giá trị sống — Personal Values ────────────────────
  guide({
    thesis:
      'Giá trị sống là bộ nguyên tắc bạn dùng để chọn khi hai điều tốt loại trừ nhau, không phải danh sách từ đẹp treo lên tường. Một giá trị chỉ được coi là có thật khi nó đã từng khiến bạn từ chối một thứ mình cũng muốn: một khoản tiền, một cơ hội, một lời khen. Nếu nó chưa bao giờ tốn của bạn thứ gì, nó mới là sở thích chứ chưa phải giá trị.',
    why: {
      work:
        'Khi phải chọn giữa dự án lương cao mà học được ít và dự án lương thấp hơn nhưng mở ra năng lực mới, danh sách giá trị đã xếp hạng cho bạn một tiêu chí quyết định thay vì để bạn xoay theo người vừa tư vấn gần nhất.',
      interview:
        'Nhà tuyển dụng hỏi "vì sao bạn rời công ty cũ" hoặc "điều gì quan trọng với bạn ở nơi làm việc" để đo mức phù hợp. Trả lời bằng một đánh đổi thật bạn đã chấp nhận thuyết phục hơn nhiều so với ba tính từ chung chung.',
      study:
        'Giá trị quyết định bạn bỏ môn nào khi quỹ thời gian không đủ. Người không xếp hạng trước sẽ rải đều rồi trung bình yếu ở tất cả, trong khi người đã chọn sẽ chấp nhận điểm B ở phần phụ để lấy điểm A ở phần quyết định nghề.',
      life:
        'Những quyết định lớn của đời sống — chuyển thành phố, kết hôn, chăm bố mẹ, đổi nghề — không có đáp án tối ưu chung; chúng chỉ có đáp án nhất quán với thứ bạn thật sự coi trọng và sẵn sàng trả giá.',
    },
    framework: [
      {
        name: 'Khai quật',
        detail:
          'Lấy chất liệu từ trải nghiệm chứ không từ danh sách mẫu: ba lúc bạn tự hào nhất, ba lúc bạn tức giận nhất vì bị xúc phạm điều gì đó, và ba lúc bạn ân hận vì đã nhượng bộ.',
      },
      {
        name: 'Gom nhóm',
        detail:
          'Nhiều câu chuyện chỉ là một giá trị nhìn từ các góc khác nhau. Gom về 5–7 nhóm thật sự khác biệt và đặt tên bằng ngôn ngữ của bạn, không dùng từ sáo như "chính trực" nếu bạn không định nghĩa được nó bằng hành vi.',
      },
      {
        name: 'Ép xếp hạng',
        detail:
          'So từng cặp: nếu chỉ giữ được một trong hai, bạn giữ cái nào? Xếp hạng chỉ có nghĩa khi nó gây khó chịu — danh sách nào cũng "quan trọng như nhau" là danh sách chưa dùng được.',
      },
      {
        name: 'Chuyển thành tiêu chí',
        detail:
          'Với mỗi giá trị trong top 3, viết một câu quan sát được: "tự chủ = tôi được quyết cách làm và lịch làm việc của phần tôi phụ trách" — rồi ghi ngưỡng tối thiểu để nói không.',
      },
      {
        name: 'Đối chiếu lịch và ví',
        detail:
          'Đối chiếu top 3 với nơi thời gian và tiền của bạn thật sự đi trong 30 ngày qua. Lệch lớn thì hoặc bạn ghi sai giá trị, hoặc bạn đang sống lệch — cả hai đều cần xử lý, nhưng cách xử lý khác nhau.',
      },
    ],
    scenario:
      'Một chuyên viên marketing 4 năm kinh nghiệm nhận hai lời mời cùng lúc: agency trả cao hơn 25% nhưng làm 6 tài khoản một lúc, và một công ty sản phẩm trả ngang mức cũ nhưng cho cô sở hữu toàn bộ mảng nội dung. Cô liệt kê hai tuần rồi rút ra top 3: tự chủ, học sâu, an toàn tài chính. Bước quyết định là ép xếp hạng: cô đặt ngưỡng an toàn tài chính thành một con số cụ thể (đủ chi tiêu 6 tháng + trả góp), thấy cả hai lựa chọn đều vượt ngưỡng, nên tiêu chí này không còn phân biệt được nữa. Sau khi loại nó ra, quyết định trở nên rõ. Cô chọn công ty sản phẩm và ghi rõ trong nhật ký rằng mình đã chủ động từ bỏ 25% thu nhập để đổi lấy quyền quyết định — nhờ vậy, 8 tháng sau khi công việc có giai đoạn chán, cô không rơi vào cảm giác "mình đã chọn sai" mà nhớ chính xác mình đã mua cái gì bằng cái gì.',
    comparison: [
      {
        weak: 'Chọn giá trị từ danh sách 100 từ trên mạng, khoanh những từ nghe hay và dừng lại ở đó.',
        mature:
          'Rút giá trị ngược từ các quyết định đã làm và các lần tức giận thật của mình, rồi mới đặt tên — tên đến sau bằng chứng chứ không đến trước.',
      },
      {
        weak: 'Giữ 12 giá trị và nói tất cả đều quan trọng như nhau, nên khi xung đột thì quyết định theo cảm xúc lúc đó.',
        mature:
          'Giữ 3 giá trị có thứ tự, chấp nhận rằng xếp hạng nghĩa là 9 thứ còn lại sẽ có lúc bị hy sinh, và biết trước mình sẽ hy sinh cái nào.',
      },
      {
        weak: 'Dùng giá trị để phán xét người khác ("người này không có chính trực").',
        mature:
          'Dùng giá trị làm bộ lọc cho lựa chọn của chính mình và làm ngôn ngữ để thương lượng: "phần này tôi cần được tự quyết, đổi lại tôi nhận trách nhiệm về kết quả".',
      },
    ],
    mistakes: [
      'Nhầm giá trị với mục tiêu: "kiếm 50 triệu/tháng" là mục tiêu có ngày hoàn thành; "an toàn tài chính cho gia đình" là giá trị định hướng suốt đời — lẫn lộn hai thứ khiến bạn hụt hẫng ngay sau khi đạt mục tiêu.',
      'Viết danh sách giá trị bằng ngôn ngữ mà bạn nghĩ người phỏng vấn hoặc mạng xã hội muốn nghe, rồi chính bạn không nhận ra nó khi phải quyết định lúc 11 giờ đêm.',
      'Coi danh sách giá trị là bất biến: không xem lại sau khi có con, sau khi đổi nghề, hay sau một biến cố sức khỏe — trong khi trọng số giữa các giá trị thay đổi rõ rệt qua các giai đoạn sống.',
    ],
    worksheet: [
      'Kể lại ba lần bạn thấy tức giận thật sự trong hai năm qua. Trong mỗi lần, điều gì của bạn đã bị xâm phạm? (Cơn giận thường chỉ đúng vào giá trị.)',
      'Lần gần nhất bạn từ chối tiền, cơ hội hoặc lời khen là khi nào, và bạn đã bảo vệ điều gì khi từ chối?',
      'Viết ba giá trị hàng đầu của bạn, rồi với mỗi giá trị ghi một câu bắt đầu bằng "tôi sẵn sàng mất..." — nếu không điền được vế này, giá trị đó chưa được kiểm chứng.',
      'Mở lịch 30 ngày qua và sao kê chi tiêu 30 ngày qua. Ba khoản mục ngốn nhiều thời gian/tiền nhất phục vụ giá trị nào? Có khoản nào không phục vụ giá trị nào trong top 3 không?',
      'Quyết định lớn nào bạn đang trì hoãn? Viết nó dưới dạng xung đột giữa đúng hai giá trị của bạn, rồi nói rõ giá trị nào bạn chọn đặt cao hơn lần này và bạn chấp nhận trả giá gì.',
    ],
    exercises: [
      {
        label: 'Mười khoảnh khắc',
        text: 'Viết 10 khoảnh khắc trong đời khiến bạn thấy "đúng là mình" — không cần to tát. Với mỗi khoảnh khắc, ghi một từ chỉ điều đang được thoả mãn. Đếm từ nào xuất hiện lặp lại.',
        level: 'e',
      },
      {
        label: 'Bài kiểm cơn giận',
        text: 'Liệt kê 5 việc người khác làm khiến bạn khó chịu bất thường (nói lời hứa suông, cắt lời, khoe thành tích của người khác...). Với mỗi việc, viết giá trị bị vi phạm ở dạng khẳng định.',
        level: 'e',
      },
      {
        label: 'Loại bỏ dần',
        text: 'Viết 12 giá trị ứng viên lên 12 mẩu giấy. Bỏ đi 4 mẩu, chỉ giữ 8 — rồi tiếp tục còn 5, rồi còn 3. Ghi lại cảm giác khi bỏ mẩu nào khó nhất; sự khó chịu đó là dữ liệu, không phải nhiễu.',
        level: 'e',
      },
      {
        label: 'So sánh từng cặp',
        text: 'Lấy 5 giá trị còn lại, so tất cả các cặp (10 cặp) bằng câu hỏi "chỉ giữ được một, tôi giữ cái nào". Đếm số lần thắng của mỗi giá trị để ra thứ tự, và ghi chú những cặp bạn phải suy nghĩ hơn 30 giây.',
        level: 'm',
      },
      {
        label: 'Chuyển giá trị thành ngưỡng',
        text: 'Với top 3, viết một ngưỡng số hoặc điều kiện có thể kiểm: mức thu nhập tối thiểu, số giờ tự chủ mỗi tuần, số buổi tối được ở nhà. Ngưỡng biến giá trị trừu tượng thành thứ dùng được lúc thương lượng.',
        level: 'm',
      },
      {
        label: 'Đối chiếu lịch và ví',
        text: 'Xuất lịch 30 ngày và sao kê chi tiêu 30 ngày, phân loại mọi mục vào một trong ba giá trị hàng đầu hoặc vào cột "không thuộc giá trị nào". Tính tỷ lệ phần trăm của cột cuối và đặt một mục tiêu giảm cụ thể.',
        level: 'm',
      },
      {
        label: 'Bảy ngày quyết theo tiêu chí',
        text: 'Trong 7 ngày, mọi lời mời/đề nghị đều phải đi qua top 3 trước khi trả lời; ghi lại quyết định, giá trị đã dùng và cảm giác sau 24 giờ. Cuối tuần đánh giá tiêu chí nào thực sự giúp bạn quyết nhanh hơn.',
        level: 'h',
      },
      {
        label: 'Tuyên ngôn một trang',
        text: 'Viết một trang gồm: 3 giá trị, định nghĩa hành vi cho từng giá trị, một quyết định trong quá khứ chứng minh nó, và một điều bạn từ chối dù có lợi. Đưa cho một người biết rõ bạn và hỏi: "chỗ nào anh thấy không giống tôi thật?"',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Làm sao phân biệt một giá trị thật với một giá trị chỉ nói cho hay?',
        a: 'Tìm bằng chứng đánh đổi: giá trị thật đã từng khiến bạn từ chối tiền, cơ hội, sự thoải mái hoặc sự tán thành của người khác. Nếu không truy được lần nào nó tốn của bạn thứ gì, hãy xếp nó vào loại "chưa kiểm chứng".',
      },
      {
        q: 'Hai giá trị của bạn xung đột trong cùng một quyết định. Xử lý ra sao?',
        a: 'Không tìm cách thoả mãn cả hai bằng lời. Đặt ngưỡng tối thiểu cho giá trị xếp dưới (mức không được phép phá), rồi tối ưu cho giá trị xếp trên trong phạm vi còn lại. Ghi lại lựa chọn và cái giá đã trả để lần sau không tự trách oan.',
      },
      {
        q: 'Danh sách giá trị của bạn nên được xem lại khi nào?',
        a: 'Khi hoàn cảnh sống đổi cấu trúc: có con, đổi nghề, chuyển nơi ở, có biến cố sức khỏe hoặc tài chính — và tối thiểu mỗi năm một lần, bằng cách đối chiếu với các quyết định thật bạn đã làm trong năm chứ không bằng cách đọc lại danh sách cũ.',
      },
    ],
    plan7:
      'Ngày 1: viết 10 khoảnh khắc "đúng là mình" và 5 lần tức giận thật. Ngày 2: rút thành 12 giá trị ứng viên bằng ngôn ngữ của bạn. Ngày 3: loại dần 12 → 8 → 5, ghi chú các lần bỏ khó nhất. Ngày 4: so từng cặp trong 5 giá trị để ra top 3 có thứ tự. Ngày 5: viết ngưỡng quan sát được cho từng giá trị top 3. Ngày 6: đối chiếu top 3 với lịch và sao kê 30 ngày, khoanh một chỗ lệch lớn nhất. Ngày 7: viết tuyên ngôn một trang và đưa cho một người thân đọc để phản biện.',
    evidence:
      'Chuyển tuyên ngôn giá trị thành hai công cụ dùng được: (1) một đoạn 60 giây trả lời "bạn tìm gì ở công việc tiếp theo" nêu đúng ba tiêu chí kèm một đánh đổi có thật bạn từng chấp nhận — điều này cũng giúp bạn tự lọc công ty không hợp; (2) một danh sách câu hỏi ngược cho nhà tuyển dụng, mỗi câu kiểm một giá trị ("một quyết định về sản phẩm gần nhất được chốt bởi ai, dựa trên gì?"). Trong hồ sơ cá nhân hoặc trang giới thiệu, một dòng nêu nguyên tắc làm việc kèm ví dụ cụ thể có sức nặng hơn nhiều so với danh sách tính từ.',
    references: [
      { label: 'Self-Determination Theory — lý thuyết động lực và giá trị cá nhân', url: 'https://selfdeterminationtheory.org/theory/', type: 'article' },
      { label: 'VIA Institute on Character — trắc nghiệm và tài liệu về điểm mạnh tính cách', url: 'https://www.viacharacter.org/', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ── Chương 3 · Tư duy phát triển — Growth Mindset ─────────────────────────
  guide({
    thesis:
      'Growth mindset không nói rằng ai cũng làm được mọi thứ nếu cố đủ lâu. Nó nói rằng năng lực hiện tại chưa phải kết luận cuối cùng, và tiến bộ phụ thuộc vào ba biến bạn kiểm soát được: chiến lược luyện tập, chất lượng phản hồi và thời gian tích lũy. Điểm khác biệt thực hành nằm ở chỗ khi thất bại, bạn hỏi "cách tập này sai ở đâu" thay vì hỏi "mình có tố chất không".',
    why: {
      work:
        'Khi được giao việc vượt tầm hiện tại, người có tư duy phát triển sẽ tách việc đó thành phần biết làm và phần chưa biết, rồi đi tìm người hoặc tài liệu cho phần chưa biết — thay vì từ chối sớm hoặc nhận rồi im lặng cho đến hạn.',
      interview:
        'Câu hỏi "kể về một lần bạn thất bại" là chỗ tư duy cố định lộ ra rõ nhất: người có tư duy phát triển nêu được giả thuyết sai, cách họ đổi chiến lược, và kết quả lần thử tiếp theo — có hay không có kết quả tốt đều kể được.',
      study:
        'Điểm kém trở thành bản đồ lỗi thay vì bản án. Người học phân loại được lỗi hiểu đề, lỗi kiến thức nền, lỗi cẩu thả sẽ dành thời gian đúng chỗ, thay vì làm lại thêm 50 bài cùng dạng đã đúng.',
      life:
        'Trong các kỹ năng đời sống mà người lớn hay né vì sợ dở — bơi, ngoại ngữ, nhảy, nói trước đám đông — tư duy phát triển hạ ngưỡng xấu hổ của giai đoạn đầu xuống mức chịu được, đủ để bạn ở lại đến lúc có tiến bộ.',
    },
    framework: [
      {
        name: 'Bắt câu kết luận',
        detail:
          'Ghi lại nguyên văn câu bạn tự nói khi gặp khó: "mình không có đầu óc kỹ thuật", "mình vốn dở tiếng Anh". Không bắt được câu đó thì không sửa được gì, vì nó chạy ngầm.',
      },
      {
        name: 'Hạ xuống thành giả thuyết',
        detail:
          'Viết lại câu đó thành giả thuyết có điều kiện và có thể kiểm: "với cách học hiện tại (nghe podcast thụ động), sau 3 tháng tôi chưa nói được" — bản viết lại này chỉ vào chiến lược chứ không chỉ vào con người.',
      },
      {
        name: 'Phân loại lỗi',
        detail:
          'Chia lỗi gần nhất thành các nhóm: chưa hiểu đề bài, thiếu kiến thức nền, sai chiến thuật, hết giờ, cẩu thả. Tỷ lệ giữa các nhóm quyết định bạn phải tập gì tiếp theo.',
      },
      {
        name: 'Đổi chiến lược',
        detail:
          'Nếu sau hai chu kỳ mà nhóm lỗi lớn nhất không giảm, đổi cách tập (thêm phản hồi, giảm độ khó, tách kỹ năng con) chứ đừng nhân đôi số giờ của đúng cách cũ.',
      },
    ],
    scenario:
      'Một sinh viên năm cuối trượt ba vòng phỏng vấn thuật toán và kết luận mình "không có tư duy giải thuật". Việc cày thêm 60 bài không giúp gì vì em không biết mình hỏng ở đâu. Em đổi cách: mỗi bài làm sai được ghi vào một bảng bốn cột — đọc sai đề, không nghĩ ra cấu trúc dữ liệu, cài đặt sai, quên kiểm biên. Sau 25 bài, bảng cho thấy 16 lỗi nằm ở cột "không nghĩ ra cấu trúc dữ liệu", trong khi cột cài đặt gần như sạch. Em ngừng làm bài mới trong hai tuần và chỉ làm một việc: đọc 30 bài đã có lời giải, che phần code, tự nói ra chọn cấu trúc nào và vì sao. Vòng phỏng vấn tiếp theo em vẫn không giải xong một bài khó, nhưng nói rõ được hướng tiếp cận và các đánh đổi — và đó là lần đầu em qua vòng.',
    comparison: [
      {
        weak: 'Coi phản hồi tiêu cực là đánh giá về giá trị con người, nên phản ứng bằng cách phòng thủ hoặc tránh mặt người đưa phản hồi.',
        mature:
          'Coi phản hồi là dữ liệu về khoảng cách giữa sản phẩm hiện tại và tiêu chuẩn, nên hỏi thêm cho đến khi biết chính xác phải sửa cái gì.',
      },
      {
        weak: 'Khen (và tự khen) bằng nhãn thông minh, có khiếu, giỏi sẵn — khiến việc gặp bài khó trở thành mối đe doạ với danh tính đó.',
        mature:
          'Khen quá trình cụ thể: chọn chiến lược nào, thử mấy cách, sửa gì sau lần hỏng — nhãn này không bị bài khó phủ định.',
      },
      {
        weak: 'Nói "tôi đang cố hết sức" như bằng chứng của tư duy phát triển, trong khi vẫn lặp lại đúng một cách tập đã không hiệu quả suốt ba tháng.',
        mature:
          'Đặt mốc kiểm: nếu sau N buổi mà chỉ số lỗi không giảm thì bắt buộc đổi phương pháp — nỗ lực không có phản hồi chỉ là nỗ lực, chưa phải luyện tập.',
      },
    ],
    mistakes: [
      'Biến growth mindset thành khẩu hiệu an ủi: dán chữ "chưa" vào mọi thất bại nhưng không hề thay đổi cách luyện tập, nên ba tháng sau vẫn ở đúng chỗ cũ với tinh thần vui vẻ hơn.',
      'Dùng tư duy phát triển để phủ nhận giới hạn thật của hoàn cảnh (thời gian, sức khỏe, tài chính, điểm xuất phát), dẫn đến tự trách khi không đạt được thứ vốn cần nguồn lực mà bạn chưa có.',
      'Chỉ đo nỗ lực (số giờ, số bài) mà không đo tiến bộ (tỷ lệ lỗi theo nhóm, tốc độ, chất lượng), nên không bao giờ nhận ra lúc cần đổi chiến lược.',
    ],
    worksheet: [
      'Viết nguyên văn ba câu bạn hay tự nói khi gặp việc khó. Câu nào trong đó nói về con người bạn thay vì về cách bạn đang làm?',
      'Chọn một kỹ năng bạn tin mình "không có khiếu". Bạn đã luyện nó bao nhiêu giờ có phản hồi từ người biết nghề — không tính số giờ tự mò?',
      'Lấy năm lỗi gần nhất trong việc bạn đang học. Xếp chúng vào các nhóm: hiểu sai yêu cầu / thiếu nền / sai chiến thuật / hết giờ / cẩu thả. Nhóm nào chiếm đa số?',
      'Cách luyện tập hiện tại của bạn cho phản hồi sau bao lâu? Nếu vòng phản hồi dài hơn một tuần, rút ngắn nó bằng cách nào?',
      'Nếu sau bốn tuần nữa nhóm lỗi lớn nhất không giảm, bạn sẽ đổi cụ thể điều gì trong cách tập — viết trước ngay bây giờ để lúc đó không tự thương lượng.',
    ],
    exercises: [
      {
        label: 'Sổ bắt câu',
        text: 'Mang theo một mẩu giấy trong ba ngày và chép lại nguyên văn mọi câu tự phán xét khi bạn gặp việc khó. Cuối ngày viết lại mỗi câu thành dạng giả thuyết về chiến lược, không về con người.',
        level: 'e',
      },
      {
        label: 'Bảng phân loại lỗi',
        text: 'Tạo bảng bốn hoặc năm cột theo nhóm lỗi của lĩnh vực bạn đang học, và ghi mọi lỗi trong hai tuần vào đúng cột. Không đánh giá gì cho đến khi đủ 20 dòng.',
        level: 'e',
      },
      {
        label: 'Phỏng vấn người từng dở',
        text: 'Tìm một người nay làm tốt kỹ năng bạn đang thấy khó và hỏi ba câu: giai đoạn đầu họ dở đến mức nào, họ đổi cách tập ở thời điểm nào, và điều gì họ ước mình biết sớm hơn. Ghi lại thành nửa trang.',
        level: 'e',
      },
      {
        label: 'Rút ngắn vòng phản hồi',
        text: 'Thiết kế lại một buổi luyện tập của bạn sao cho có phản hồi ngay trong buổi (tự chấm theo rubric, so với lời giải mẫu, nhờ người xem 10 phút cuối) thay vì đợi kết quả cuối kỳ.',
        level: 'm',
      },
      {
        label: 'Thử một cách hoàn toàn khác',
        text: 'Chọn kỹ năng đang chững và đổi phương pháp trong hai tuần: nếu đang học một mình thì học có bạn kiểm; nếu đang làm bài dễ thì làm bài khó có lời giải; nếu đang đọc thì chuyển sang tự giảng lại. Đo bằng cùng một bài kiểm trước và sau.',
        level: 'm',
      },
      {
        label: 'Ghi lại lần bị chê',
        text: 'Lấy một lần bị góp ý gần đây khiến bạn khó chịu. Viết ba phần: phần góp ý đúng, phần góp ý sai hoặc thiếu ngữ cảnh, và một hành động cụ thể bạn rút ra từ phần đúng. Gửi lại người góp ý bản tóm tắt hành động đó.',
        level: 'm',
      },
      {
        label: 'Bảy ngày làm việc mình dở',
        text: 'Chọn một việc bạn tránh vì sợ dở (nói tiếng Anh, viết, thuyết trình). Mỗi ngày làm 15 phút trước một người khác và xin đúng một góp ý. Ngày 7, so bản ghi ngày 1 và ngày 7 để tìm khác biệt cụ thể.',
        level: 'h',
      },
      {
        label: 'Kế hoạch 8 tuần có mốc bỏ',
        text: 'Viết kế hoạch luyện một kỹ năng trong 8 tuần, trong đó ghi rõ chỉ số đo hàng tuần và một "mốc bỏ chiến lược": nếu đến tuần 4 chỉ số không cải thiện thì đổi cách gì. Cuối 8 tuần, viết báo cáo một trang về những gì dữ liệu cho thấy.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Tư duy phát triển có nghĩa là mọi người đều có thể đạt trình độ như nhau nếu cố gắng đủ nhiều không?',
        a: 'Không. Nó nói rằng năng lực có thể thay đổi đáng kể nhờ chiến lược, phản hồi và thời gian, chứ không tuyên bố mọi người sẽ tiến tới cùng một điểm đến. Xem nó là lời hứa thành công là hiểu sai và dễ dẫn tới tự trách.',
      },
      {
        q: 'Bạn đã học một kỹ năng ba tháng, số giờ tăng nhưng kết quả không đổi. Bước đúng tiếp theo là gì?',
        a: 'Ngừng tăng giờ và đi phân loại lỗi. Xác định nhóm lỗi chiếm đa số rồi đổi phương pháp nhắm đúng nhóm đó, đồng thời rút ngắn vòng phản hồi để biết sớm hơn cách mới có tác dụng hay không.',
      },
      {
        q: 'Vì sao khen "con thông minh quá" lại có thể gây hại, trong khi khen "con thử được ba cách khác nhau" thì không?',
        a: 'Lời khen thứ nhất gắn thành tích vào một đặc điểm cố định, nên lần gặp bài khó sẽ đe doạ chính hình ảnh đó và người ta có xu hướng né việc khó để bảo vệ nhãn. Lời khen thứ hai gắn vào quá trình — thứ có thể lặp lại và tăng lên ngay cả khi kết quả lần này chưa tốt.',
      },
    ],
    plan7:
      'Ngày 1: chọn một kỹ năng đang chững và làm một bài kiểm nhỏ để có baseline. Ngày 2–3: ghi mọi lỗi vào bảng phân loại, tối thiểu 15 dòng, chưa sửa gì. Ngày 4: tính tỷ lệ theo nhóm và chọn nhóm lỗi lớn nhất. Ngày 5: thiết kế một cách tập mới nhắm đúng nhóm đó và có phản hồi trong buổi. Ngày 6: chạy thử cách mới hai buổi, ghi cảm giác khó chịu và kết quả riêng ra hai cột. Ngày 7: làm lại đúng bài kiểm ngày 1, so kết quả và viết ba dòng về việc sẽ giữ gì, bỏ gì.',
    evidence:
      'Bảng phân loại lỗi chính là hiện vật mạnh nhất: mang nó vào phỏng vấn (ẩn thông tin nhạy cảm) để trả lời "bạn học một thứ mới thế nào" bằng dữ liệu thay vì bằng tính từ. Trong CV, thay dòng "ham học hỏi" bằng một dòng có cấu trúc: học X trong Y tuần, đo bằng chỉ số Z, kết quả trước–sau. Nếu bạn có blog hoặc repo, một bài viết dạng "tôi đã tập sai suốt 3 tháng và đổi cách như thế nào" thường được đọc kỹ hơn một bài tổng hợp kiến thức, vì nó cho thấy cách bạn xử lý lúc bế tắc.',
    references: [
      { label: 'TED — Carol Dweck: The power of believing that you can improve', url: 'https://www.ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve', type: 'video' },
      { label: 'TED — Carol Dweck: sức mạnh của niềm tin rằng bạn có thể cải thiện', url: 'https://www.ted.com/talks/carol_dweck_the_power_of_believing_that_you_can_improve', type: 'video' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 4 · Kỷ luật bản thân — Self-discipline ─────────────────────────
  guide({
    thesis:
      'Kỷ luật đáng tin cậy được thiết kế chứ không được kêu gọi: nó nằm ở môi trường, cam kết và chuẩn tối thiểu, còn ý chí chỉ là lớp dự phòng cho những ngày hệ thống hỏng. Người kỷ luật không phải lúc nào cũng muốn làm — họ đã làm cho việc bắt đầu rẻ đi và việc bỏ cuộc đắt lên, nên quyết định lúc mệt vẫn nghiêng về phía đúng.',
    why: {
      work:
        'Chất lượng công việc phụ thuộc vào những phần không ai giám sát: viết tài liệu, dọn nợ kỹ thuật, gọi lại khách hàng khó. Kỷ luật là thứ giữ những phần đó không bị bỏ khi lịch bận.',
      interview:
        'Nhà tuyển dụng đo kỷ luật gián tiếp qua các dấu vết: bạn có duy trì được một dự án cá nhân qua tháng thứ ba không, có nộp bài tập đúng hạn không, có bảng theo dõi tiến độ nào không. Một chuỗi 12 tuần liên tục thuyết phục hơn một câu tự nhận là chăm chỉ.',
      study:
        'Học thi cần lượng lặp lại đều đặn mà cảm hứng không cung cấp nổi. Ai đặt phiên tối thiểu 25 phút cố định giờ sẽ tích lũy nhiều hơn hẳn người chờ ngày rảnh dài, vì ngày rảnh dài hiếm khi tới.',
      life:
        'Những việc quan trọng nhưng không khẩn (tập thể dục, khám định kỳ, tiết kiệm, gọi cho bố mẹ) luôn thua các việc khẩn nếu không có cơ chế. Kỷ luật là cơ chế bảo vệ nhóm việc này.',
    },
    framework: [
      {
        name: 'Chuẩn tối thiểu',
        detail:
          'Định nghĩa phiên bản nhỏ nhất vẫn được tính là hoàn thành: 25 phút, 200 chữ, một hiệp. Chuẩn này phải nhỏ đến mức bạn làm được cả ngày ốm nhẹ, vì nhiệm vụ của nó là giữ chuỗi chứ không phải tạo thành tích.',
      },
      {
        name: 'Neo vào lịch và chỗ',
        detail:
          'Ghi rõ lúc nào, ở đâu, dài bao lâu, ngay sau việc gì. "Học buổi tối" là mong muốn; "20:00, bàn bếp, ngay sau khi rửa bát, 25 phút" là một cuộc hẹn.',
      },
      {
        name: 'Giảm ma sát khởi động',
        detail:
          'Chuẩn bị sẵn bước đầu tiên từ tối hôm trước: mở sẵn file, đặt sẵn giày, viết sẵn câu mở đầu. Đa số thất bại xảy ra ở phút đầu tiên chứ không ở phút thứ hai mươi.',
      },
      {
        name: 'Tăng giá của việc bỏ',
        detail:
          'Thêm ràng buộc ngoài: hẹn tập cùng người khác, công bố tiến độ hằng tuần, đặt cọc, hoặc đặt điện thoại ngoài phòng. Ràng buộc phải do bạn tự chọn lúc tỉnh táo, để áp dụng cho bạn lúc mệt.',
      },
      {
        name: 'Xem lại hằng tuần',
        detail:
          'Mỗi tuần, nhìn số buổi đạt chuẩn tối thiểu. Nếu tỷ lệ dưới 70%, sửa hệ thống (đổi giờ, hạ chuẩn, bớt việc khác) chứ đừng tự hứa cố hơn — lời hứa không thay đổi biến số nào.',
      },
    ],
    scenario:
      'Một freelancer thiết kế nhận việc theo mùa và luôn nói sẽ dựng portfolio "khi rảnh", suốt 14 tháng không có trang nào. Anh bỏ mục tiêu "mỗi tối làm portfolio 2 tiếng" và thay bằng ba thay đổi cấu trúc: chuẩn tối thiểu là 25 phút, khung giờ cố định 7:30–7:55 sáng trước khi mở email khách, và tối hôm trước luôn để máy ở màn hình file portfolio đang mở. Anh thêm một ràng buộc: mỗi Chủ nhật gửi ảnh chụp màn hình tiến độ cho một đồng nghiệp cùng nghề. Trong 10 tuần, anh đạt chuẩn tối thiểu 61/70 ngày; nhiều buổi kéo dài hơn 25 phút nhưng anh không tính đó là yêu cầu. Portfolio hoàn thành ở tuần 11 — điểm đáng chú ý là ba tuần bận nhất anh vẫn giữ chuỗi ở mức tối thiểu thay vì dừng hẳn rồi mất đà như những lần trước.',
    comparison: [
      {
        weak: 'Đặt mục tiêu theo ngày lý tưởng: "mỗi ngày học 3 tiếng" — làm được vài hôm, trượt một hôm rồi bỏ luôn vì thấy chuỗi đã hỏng.',
        mature:
          'Đặt chuẩn tối thiểu chịu được ngày tệ và cho phép ngày tốt vượt lên, cộng quy tắc "không bỏ hai ngày liên tiếp" để một lần trượt không kéo theo sụp đổ.',
      },
      {
        weak: 'Dựa vào cảm hứng và động lực: chờ đến lúc thấy muốn làm mới bắt đầu.',
        mature:
          'Dựa vào cuộc hẹn cố định và bước đầu tiên đã chuẩn bị sẵn; động lực nếu có thì được coi là phần thưởng, không phải điều kiện khởi động.',
      },
      {
        weak: 'Khi trượt thì tự trách và hứa quyết tâm hơn, giữ nguyên mọi điều kiện đã dẫn tới việc trượt.',
        mature:
          'Khi trượt thì mở nhật ký ra tìm biến số hỏng (giờ sai, chuẩn quá cao, chỗ ngồi ồn, hôm đó ngủ 5 tiếng) và sửa đúng biến số đó trong tuần tiếp theo.',
      },
    ],
    mistakes: [
      'Coi kỷ luật là một phẩm chất bẩm sinh nên hoặc tự hào hoặc tự ti về nó, thay vì coi nó là kết quả của một bộ điều kiện có thể dựng lại được ở người khác.',
      'Đặt chuẩn tối thiểu quá cao vì sợ mình lười, khiến những ngày mệt trở thành ngày trượt — trong khi mục đích của chuẩn tối thiểu chính là để sống sót qua đúng những ngày đó.',
      'Chồng cùng lúc bốn thói quen mới trong một tuần; cả bốn cùng cạnh tranh một quỹ chú ý hạn hẹp và thường thì cả bốn cùng chết ở tuần thứ hai.',
    ],
    worksheet: [
      'Việc quan trọng nào bạn đã hoãn quá 30 ngày? Viết chuẩn tối thiểu cho nó nhỏ đến mức bạn làm được ngay cả hôm ngủ 5 tiếng.',
      'Khung giờ nào trong ngày ít bị người khác chiếm nhất? Ghi giờ bắt đầu, địa điểm cụ thể và việc đứng ngay trước nó trong chuỗi thói quen hiện có.',
      'Ba phút đầu tiên của việc đó gồm những thao tác nào? Cái nào có thể chuẩn bị từ tối hôm trước để sáng ra chỉ còn việc ngồi xuống?',
      'Điều gì thường xuyên kéo bạn ra khỏi việc (thông báo, người nhà hỏi, một tab, cơn buồn ngủ)? Với mỗi thứ, viết một biện pháp vật lý chứ không phải một lời nhắc bản thân.',
      'Nếu tuần này bạn trượt, bạn sẽ xem lại chỉ số nào để biết hệ thống hỏng ở đâu, và ai là người bạn báo cáo tiến độ?',
    ],
    exercises: [
      {
        label: 'Định nghĩa chuẩn sàn',
        text: 'Viết ba việc quan trọng đang bị hoãn, và với mỗi việc đặt một chuẩn tối thiểu đo được bằng thời lượng hoặc số lượng. Kiểm bằng câu hỏi: hôm mệt nhất tháng trước, tôi có làm nổi mức này không?',
        level: 'e',
      },
      {
        label: 'Dọn đường khởi động',
        text: 'Đêm nay, chuẩn bị vật lý cho việc của sáng mai: mở sẵn tài liệu, để dụng cụ ra chỗ nhìn thấy, viết sẵn một câu đầu tiên. Sáng hôm sau ghi lại mất bao nhiêu giây từ lúc ngồi xuống đến lúc bắt đầu thật.',
        level: 'e',
      },
      {
        label: 'Bảng chấm chuỗi',
        text: 'Vẽ lịch 4 tuần trên giấy dán chỗ dễ thấy, mỗi ngày đạt chuẩn tối thiểu thì tô một ô. Quy ước rõ: chỉ tô khi đạt chuẩn, và không bao giờ bỏ hai ngày liên tiếp.',
        level: 'e',
      },
      {
        label: 'Kiểm toán cám dỗ',
        text: 'Trong ba ngày, mỗi lần bạn bỏ dở việc đang làm thì ghi lại giờ, thứ đã kéo bạn đi và trạng thái cơ thể lúc đó. Sau đó xử lý thứ xuất hiện nhiều nhất bằng một rào chắn vật lý, không bằng quyết tâm.',
        level: 'm',
      },
      {
        label: 'Ràng buộc có người chứng',
        text: 'Chọn một người và một nhịp báo cáo cố định (ảnh chụp tiến độ mỗi Chủ nhật). Viết trước ba câu bạn sẽ nhắn nếu tuần đó không đạt — soạn sẵn để lúc xấu hổ bạn không im lặng rồi biến mất.',
        level: 'm',
      },
      {
        label: 'Thử nghiệm đổi khung giờ',
        text: 'Chạy hai tuần cùng một việc ở hai khung giờ khác nhau (sáng sớm và tối muộn), giữ nguyên chuẩn tối thiểu. So tỷ lệ hoàn thành và chất lượng tự chấm để chọn khung giờ thắng dựa trên dữ liệu.',
        level: 'm',
      },
      {
        label: 'Bảy ngày không thương lượng',
        text: 'Chọn đúng một việc và làm ở mức chuẩn tối thiểu bảy ngày liên tiếp, kể cả ngày đi công tác hay ốm nhẹ. Mỗi ngày ghi một dòng: giờ bắt đầu, cản trở lớn nhất, cách bạn vượt qua. Ngày 7 rút ra hai điều kiện quyết định.',
        level: 'h',
      },
      {
        label: 'Thiết kế lại một tháng hỏng',
        text: 'Lấy một tháng bạn đã bỏ cuộc trong quá khứ, dựng lại dòng thời gian và chỉ ra ba biến số cấu trúc đã hỏng (không phải "tôi lười"). Viết lại kế hoạch mới đã vá đúng ba biến số đó và chạy thử 4 tuần, có bảng chấm chuỗi.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao chuẩn tối thiểu nên đặt thấp hơn mức bạn thực sự muốn làm?',
        a: 'Vì vai trò của nó là giữ chuỗi trong những ngày tệ nhất, chứ không phải tạo ra khối lượng. Ngày khỏe bạn tự nhiên làm nhiều hơn; ngày tệ mà chuẩn quá cao thì bạn trượt, và mất chuỗi thường tốn kém hơn nhiều so với một buổi làm ít.',
      },
      {
        q: 'Tuần này bạn trượt 4/7 buổi. Phản ứng đúng là gì?',
        a: 'Không tự hứa cố gắng hơn, mà tìm biến số hỏng: khung giờ có bị việc khác chiếm không, chuẩn tối thiểu có quá cao không, bước khởi động có bị kéo dài không, ngủ và tải công việc tuần đó thế nào. Sửa đúng một biến rồi chạy lại một tuần nữa.',
      },
      {
        q: 'Ý chí có vai trò gì trong hệ thống kỷ luật?',
        a: 'Là lớp dự phòng dùng khi môi trường bất ngờ thay đổi (đi công tác, nhà có việc). Nếu ngày nào bạn cũng phải dùng ý chí để bắt đầu thì đó là dấu hiệu hệ thống đang thiếu — chi phí khởi động còn quá cao hoặc lịch đang đặt sai chỗ.',
      },
    ],
    plan7:
      'Ngày 1: chọn một việc duy nhất, viết chuẩn tối thiểu và ghi khung giờ + địa điểm cố định. Ngày 2: dọn đường khởi động từ tối hôm trước và làm buổi đầu tiên, bấm giờ xem mất bao lâu để thật sự bắt đầu. Ngày 3: thêm một rào chắn vật lý cho cám dỗ lớn nhất (điện thoại ra khỏi phòng, chặn trang). Ngày 4: báo tiến độ cho một người đã hẹn trước. Ngày 5: giữ chuỗi trong điều kiện xấu — cố ý làm vào một ngày bận, chỉ ở mức tối thiểu. Ngày 6: đọc lại nhật ký 5 ngày và sửa đúng một biến số. Ngày 7: chốt phiên bản hệ thống cho 4 tuần tới và vẽ bảng chấm chuỗi.',
    evidence:
      'Kỷ luật để lại dấu vết đo được, và dấu vết đó chính là bằng chứng: bảng chấm chuỗi 8–12 tuần, lịch sử commit đều đặn, chuỗi bài viết hằng tuần, hoặc bản ghi tiến độ gửi cho người theo dõi. Trong phỏng vấn, dùng nó cho câu "kể về một mục tiêu dài hạn bạn tự đặt": nêu hệ thống bạn dựng (chuẩn tối thiểu, khung giờ, ràng buộc), tỷ lệ hoàn thành thật kể cả các tuần trượt, và điều bạn sửa sau khi trượt — kể cả tuần hỏng cũng là bằng chứng, miễn là bạn nói được mình đã sửa biến số nào.',
    references: [
      { label: 'James Clear — Habits: hướng dẫn về hành vi và hệ thống duy trì', url: 'https://jamesclear.com/habits', type: 'article' },
      { label: 'APA — chuyên mục Stress (tải và khả năng tự điều chỉnh)', url: 'https://www.apa.org/topics/stress', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ── Chương 5 · Xây dựng sự tự tin ─────────────────────────────────────────
  guide({
    thesis:
      'Tự tin bền vững là một dự đoán có căn cứ rằng mình đủ sức bắt đầu, học tiếp hoặc tìm được trợ giúp — chứ không phải niềm tin rằng mình chắc chắn thắng. Nó được xây bằng ba nguyên liệu: một kho bằng chứng đã làm được, một mức khó tăng dần đủ để thắng nhiều hơn thua, và một cách diễn giải thất bại không biến sự cố thành phán quyết về con người bạn.',
    why: {
      work:
        'Người thiếu tự tin thường im lặng đúng lúc cần lên tiếng: không báo rủi ro sớm, không phản đối một ước lượng phi thực tế, không xin thêm nguồn lực. Cái giá là dự án hỏng muộn thay vì được sửa sớm.',
      interview:
        'Phỏng vấn là tình huống bạn phải tự nói về mình trong 45 phút với người lạ. Tự tin có căn cứ giúp bạn kể thành tích bằng dữ kiện, thừa nhận điều chưa biết mà không hoảng, và hỏi ngược một cách bình đẳng.',
      study:
        'Tự tin đúng mức giữ bạn ở lại trong vùng khó — nơi việc học thực sự xảy ra. Thiếu nó, người học rút về làm lại những bài đã thạo; thừa nó, người học bỏ qua nền tảng và vỡ ở kỳ thi.',
      life:
        'Trong các cuộc thương lượng đời thường — giá thuê nhà, chia việc trong gia đình, từ chối một lời nhờ vả quá sức — tự tin quyết định bạn nói ra nhu cầu của mình hay nuốt nó rồi ấm ức về sau.',
    },
    framework: [
      {
        name: 'Kiểm kê bằng chứng',
        detail:
          'Dựng một danh sách những việc bạn đã hoàn thành và những phản hồi đáng tin đã nhận, kèm ngày tháng. Trí nhớ khi lo lắng có xu hướng chỉ lấy ra được các lần hỏng, nên danh sách phải nằm ngoài đầu bạn.',
      },
      {
        name: 'Chọn bậc thang',
        detail:
          'Xếp tình huống theo mức rủi ro xã hội từ thấp đến cao (phát biểu 2 phút trong nhóm 4 người → họp nhóm lớn → trình bày với khách). Bậc đúng là bậc bạn thấy hồi hộp nhưng vẫn làm được.',
      },
      {
        name: 'Diễn tập hành vi',
        detail:
          'Tập chính xác thứ bạn sẽ làm — câu mở đầu, cách xử lý khi bị hỏi khó, câu thoát khi không biết — thay vì tự động viên chung chung. Não cần một kịch bản vận động, không cần một khẩu hiệu.',
      },
      {
        name: 'Hành động khi còn lo',
        detail:
          'Đặt quy tắc: quyết định làm hay không được chốt từ hôm trước, còn cảm giác ngay trước giờ G không có quyền phủ quyết. Chờ hết lo mới bắt đầu là chờ một điều kiện gần như không đến.',
      },
      {
        name: 'Chấm điểm sau khi làm',
        detail:
          'Ngay sau khi làm, ghi ba dòng: điều đã diễn ra đúng, điều lệch so với dự đoán tệ nhất, và một điều cần sửa. Đây là bước nạp bằng chứng mới cho vòng sau; bỏ bước này thì trải nghiệm không tích lũy.',
      },
    ],
    scenario:
      'Một nhân viên chăm sóc khách hàng được đề bạt làm trưởng nhóm nhỏ nhưng né mọi buổi trình bày trước phòng ban, tự nhận "không có khiếu nói trước đám đông". Cô dựng bậc thang bốn nấc: (1) cập nhật 3 phút trong họp nhóm 5 người, (2) trình bày 10 phút cho phòng ban với slide có sẵn, (3) chủ trì buổi đào tạo nội bộ 30 phút, (4) trình bày báo cáo quý trước ban giám đốc. Mỗi nấc lặp lại ba lần trước khi lên nấc kế, và sau mỗi lần cô ghi ba dòng đánh giá cùng một câu hỏi cố định cho một đồng nghiệp: "chỗ nào em nói mà anh phải nghe lại lần hai?". Sau bốn tháng cô hoàn thành nấc 4. Điều thay đổi không phải là hết run — cô vẫn hồi hộp — mà là cô đã có 14 lần dữ liệu cho thấy mình vẫn nói được khi hồi hộp, và cô biết trước mình sẽ xử lý thế nào nếu quên ý.',
    comparison: [
      {
        weak: 'Chờ đến khi thấy sẵn sàng mới nhận việc khó, nên vùng an toàn ngày càng hẹp vì không có dữ liệu mới nào được nạp vào.',
        mature:
          'Nhận việc khó hơn một bậc so với hiện tại, kèm điều kiện an toàn (người hỗ trợ, thời gian chuẩn bị, quyền hỏi lại) và ghi kết quả để lần sau có căn cứ.',
      },
      {
        weak: 'Xây tự tin bằng câu khẳng định lặp lại ("mình làm được") mà không có bằng chứng nào phía sau, nên nó vỡ ngay lần đầu gặp phản hồi tiêu cực.',
        mature:
          'Xây bằng chuỗi thành công nhỏ có ghi chép, để khi bị chê bạn vẫn đối chiếu được lời chê với 12 dữ kiện khác thay vì chỉ có nó.',
      },
      {
        weak: 'Sau một lần trình bày vấp, kết luận "mình không hợp việc này" và rút lui vĩnh viễn khỏi loại tình huống đó.',
        mature:
          'Sau một lần vấp, khoanh vùng cụ thể phần hỏng (mở đầu lan man, không xử lý được câu hỏi số liệu) và chuẩn bị riêng phần đó cho lần sau.',
      },
      {
        weak: 'Che giấu mọi khoảng trống kiến thức vì sợ bị đánh giá, nên phải đoán và dễ nói sai trước người có chuyên môn.',
        mature:
          'Nói thẳng "chỗ này tôi chưa nắm, tôi kiểm rồi trả lời trước chiều mai" — và làm đúng lời hứa đó, vì độ tin cậy là nền của tự tin lâu dài.',
      },
    ],
    mistakes: [
      'Nhầm tự tin với việc không còn cảm thấy lo. Người làm nhiều vẫn hồi hộp trước những việc quan trọng; khác biệt là họ vẫn thực hiện đúng hành vi đã diễn tập trong lúc hồi hộp.',
      'Chuẩn bị bằng cách đọc thêm tài liệu thay vì diễn tập hành vi thật, nên đến lúc đứng trước người thật thì kiến thức có nhưng thao tác không có.',
      'Đặt bậc thang quá cao ngay từ đầu (lần đầu nói trước 200 người), thất bại một cách có thể dự đoán được, rồi lấy chính thất bại đó làm bằng chứng khẳng định mình không làm được.',
    ],
    worksheet: [
      'Kể tên năm việc trong 12 tháng qua mà bạn đã hoàn thành dù lúc bắt đầu không chắc mình làm nổi. Ghi kèm ngày để danh sách này có thể tra lại lúc bạn đang lo.',
      'Tình huống nào bạn đang né tránh có hệ thống? Chia nó thành bốn nấc theo mức rủi ro và khoanh nấc bạn thấy hồi hộp nhưng vẫn làm được ngay tuần này.',
      'Viết ra kịch bản tệ nhất bạn sợ xảy ra ở tình huống đó, rồi viết cạnh nó xác suất bạn ước tính và cách bạn sẽ xử lý nếu nó thật sự xảy ra.',
      'Khi bị hỏi một câu bạn không biết trả lời, câu thoát chuẩn bị sẵn của bạn là gì? Viết nguyên văn để đọc trơn được.',
      'Sau lần thử tiếp theo, ba dòng đánh giá của bạn sẽ ghi vào đâu và bạn hỏi ai một câu phản hồi cụ thể nào?',
    ],
    exercises: [
      {
        label: 'Kho bằng chứng',
        text: 'Mở một ghi chú tên "đã làm được" và nạp 15 mục đầu tiên: việc hoàn thành, lời khen cụ thể có tên người, kết quả đo được. Đặt lịch nhắc bổ sung mỗi thứ Sáu để kho không đứng yên.',
        level: 'e',
      },
      {
        label: 'Bốn nấc thang',
        text: 'Chọn một loại tình huống bạn né và viết bốn nấc rủi ro tăng dần, mỗi nấc kèm điều kiện an toàn cụ thể (ai hỗ trợ, chuẩn bị bao lâu, thời lượng bao nhiêu phút).',
        level: 'e',
      },
      {
        label: 'Câu mở đầu và câu thoát',
        text: 'Viết và đọc to 10 lần hai câu: câu mở đầu cho phần trình bày sắp tới, và câu dùng khi bạn không biết trả lời. Ghi âm lần thứ 10 để nghe lại tốc độ và độ rõ.',
        level: 'e',
      },
      {
        label: 'Diễn tập có khán giả',
        text: 'Nhờ một người nghe bạn trình bày 5 phút và ngắt bạn hai lần bằng câu hỏi khó đã soạn trước. Mục tiêu không phải trả lời hay, mà là tập giữ nhịp sau khi bị ngắt.',
        level: 'm',
      },
      {
        label: 'Kiểm chứng kịch bản tệ nhất',
        text: 'Viết ra điều tệ nhất bạn sợ, rồi phỏng vấn hai người từng ở tình huống đó xem thực tế đã xảy ra gì. So sánh dự đoán của bạn với dữ liệu họ kể và ghi lại độ lệch.',
        level: 'm',
      },
      {
        label: 'Nói ra một nhu cầu',
        text: 'Trong tuần này, nêu một yêu cầu chính đáng mà bạn thường nuốt: xin thêm thời gian, xin làm rõ phạm vi, đề nghị đổi cách họp. Ghi lại phản ứng thật của người nghe so với phản ứng bạn đã tưởng tượng.',
        level: 'm',
      },
      {
        label: 'Bảy ngày lên tiếng sớm',
        text: 'Mỗi ngày trong 7 ngày, phát biểu một ý trong 10 phút đầu của một cuộc trao đổi nhóm — sớm, ngắn, không cần xuất sắc. Ghi lại số lần bạn định nói mà rồi thôi, và lý do.',
        level: 'h',
      },
      {
        label: 'Leo hết bậc thang trong 6 tuần',
        text: 'Chạy cả bốn nấc trong 6 tuần, mỗi nấc lặp tối thiểu hai lần, mỗi lần ghi ba dòng đánh giá và xin một câu phản hồi hẹp. Cuối kỳ viết một trang đối chiếu dự đoán ban đầu với kết quả thật.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao lặp lại các câu khẳng định tích cực thường không tạo được tự tin bền?',
        a: 'Vì nó không thêm dữ liệu mới. Tự tin bền là một dự đoán dựa trên kinh nghiệm; khi gặp phản hồi tiêu cực, dự đoán chỉ đứng vững nếu có nhiều lần thực hiện được ghi lại để đối chiếu. Câu khẳng định không cung cấp thứ đó.',
      },
      {
        q: 'Chọn bậc khó thế nào là hợp lý cho một lần luyện?',
        a: 'Chọn mức khiến bạn hồi hộp nhưng vẫn hoàn thành được với chuẩn bị hợp lý — tỷ lệ thành công đủ cao để nạp bằng chứng, đủ khó để tạo thông tin mới. Quá dễ thì không có gì để học; quá khó thì thất bại có thể đoán trước và củng cố nỗi sợ.',
      },
      {
        q: 'Bạn vừa trình bày vấp và thấy xấu hổ. Việc đầu tiên nên làm là gì?',
        a: 'Ghi lại ngay ba dòng khi trí nhớ còn nóng: đoạn nào thực sự hỏng, đoạn nào bạn tưởng hỏng nhưng người nghe không nhận ra, và một điều sẽ chuẩn bị khác cho lần sau. Việc khoanh vùng cụ thể ngăn một sự cố hẹp bị mở rộng thành kết luận về năng lực.',
      },
    ],
    plan7:
      'Ngày 1: mở kho bằng chứng và nạp 15 mục có ngày tháng. Ngày 2: chọn một tình huống đang né và chia thành bốn nấc rủi ro. Ngày 3: viết và luyện to câu mở đầu cùng câu thoát khi bí. Ngày 4: diễn tập 5 phút trước một người, có hai câu hỏi ngắt giữa chừng. Ngày 5: thực hiện nấc 1 trong tình huống thật, ghi ba dòng ngay sau đó. Ngày 6: xin một câu phản hồi hẹp từ người đã dự và bổ sung vào kho bằng chứng. Ngày 7: đặt lịch cho nấc 2 trong hai tuần tới và viết trước điều kiện an toàn cho nó.',
    evidence:
      'Tự tin được chứng minh bằng dấu vết của việc dám làm, không bằng lời tự mô tả. Hãy tích lũy: bản ghi hoặc slide của các buổi trình bày nội bộ, danh sách các lần bạn chủ động nêu rủi ro và điều đó giúp tránh được gì, một buổi đào tạo nội bộ bạn từng đứng lớp. Trong phỏng vấn, dùng cho câu "kể về lần bạn phải làm điều mình chưa từng làm": mô tả bậc thang bạn đã dựng, số lần lặp, phản hồi thu được và kết quả cuối. Người phỏng vấn quan tâm phương pháp mở rộng năng lực của bạn hơn là mức tự tin bạn tuyên bố.',
    references: [
      { label: 'PositivePsychology.com — Self-confidence là gì và cách xây dựng', url: 'https://positivepsychology.com/self-confidence/', type: 'article' },
      { label: 'TED — chuyên mục Psychology', url: 'https://www.ted.com/topics/psychology', type: 'video' },
    ],
    diagram: 'flow',
  }),

  // ── Chương 6 · Quản lý cảm xúc — Emotional Regulation ─────────────────────
  guide({
    thesis:
      'Quản lý cảm xúc không phải là ép cảm xúc biến mất hay giả vờ bình thản; đó là năng lực nhận ra tín hiệu sớm trong cơ thể, tách dữ kiện khỏi câu chuyện mình vừa dựng lên, rồi chọn hành vi không phá hỏng mục tiêu dài hạn. Cảm xúc là dữ liệu về thứ đang quan trọng với bạn — vấn đề nằm ở hành vi tự động đi kèm nó, và đó mới là phần có thể huấn luyện.',
    why: {
      work:
        'Một email trả lời trong cơn giận có thể tốn nhiều tháng quan hệ công việc. Kỹ năng này quyết định bạn gửi ngay hay để nháp 30 phút rồi đọc lại — khác biệt nhỏ về thời gian, khác biệt lớn về hậu quả.',
      interview:
        'Người phỏng vấn thường cố ý hỏi dồn hoặc phản biện gay gắt để xem bạn phản ứng thế nào. Giữ được nhịp thở, hỏi lại cho rõ trước khi trả lời, và không chuyển sang giọng phòng thủ là một tín hiệu rất dễ nhận ra.',
      study:
        'Cảm giác nản khi làm sai nhiều bài là thứ đẩy người học rời bàn học. Điều tiết được nó — nghỉ 10 phút đúng cách rồi quay lại thay vì bỏ cả buổi — quyết định lượng luyện tập tích lũy được.',
      life:
        'Phần lớn các cuộc cãi vã trong gia đình leo thang không vì nội dung mà vì nhịp: hai người cùng nói lúc đang bị kích hoạt. Biết dừng đúng 20 phút rồi quay lại chủ đề giữ được cả vấn đề lẫn quan hệ.',
    },
    framework: [
      {
        name: 'Bắt tín hiệu cơ thể',
        detail:
          'Học thuộc dấu hiệu riêng của bạn xuất hiện trước lời nói: hàm siết, tim nhanh, nóng mặt, giọng cao lên. Đây là cửa sổ can thiệp duy nhất, vì sau khi câu nói bật ra thì chỉ còn khắc phục hậu quả.',
      },
      {
        name: 'Hạ kích hoạt',
        detail:
          'Dùng một thao tác cơ thể ngắn: thở ra dài hơn hít vào trong 60–90 giây, đứng dậy đi 20 bước, uống nước. Mục tiêu không phải hết cảm xúc mà là hạ đủ để phần suy nghĩ hoạt động lại.',
      },
      {
        name: 'Gọi đúng tên',
        detail:
          'Phân biệt giận, xấu hổ, lo, thất vọng, tủi thân và đơn giản là mệt. Gọi sai tên dẫn tới chữa sai bệnh: nhiều cơn "giận" buổi tối thực chất là kiệt sức và không cần một cuộc nói chuyện nào cả.',
      },
      {
        name: 'Tách dữ kiện',
        detail:
          'Viết hai cột: người kia đã thật sự nói/làm gì, và bạn đã thêm ý nghĩa gì vào đó. Phần lớn cường độ cảm xúc nằm ở cột thứ hai, và cột thứ hai thì kiểm chứng được bằng một câu hỏi.',
      },
      {
        name: 'Chọn hành vi',
        detail:
          'Hỏi: sau chuyện này tôi muốn quan hệ và kết quả ở đâu? Rồi chọn một trong ba: hoãn phản hồi có báo trước, hỏi lại để làm rõ, hoặc nói thẳng nhu cầu bằng câu bắt đầu từ "tôi".',
      },
    ],
    scenario:
      'Chủ một tiệm bánh nhỏ nhận đánh giá một sao kèm lời lẽ nặng nề về một đơn giao trễ, viết ngay một phản hồi công khai dài giải thích lỗi thuộc về đơn vị vận chuyển. Trước khi bấm gửi, chị áp dụng quy tắc tự đặt: mọi phản hồi khi tim đập nhanh đều phải nằm ở nháp 60 phút. Sau một tiếng, chị tách hai cột và thấy dữ kiện thật chỉ là "khách nhận bánh muộn 2 giờ và hộp bị móp", còn phần "khách này cố tình dìm hàng" là do chị thêm vào. Bản gửi đi cuối cùng dài bốn câu: xin lỗi về trải nghiệm, nêu nguyên nhân ngắn gọn không đổ lỗi, đề nghị làm lại đơn miễn phí, và cách liên hệ trực tiếp. Khách sửa đánh giá lên bốn sao và quay lại đặt hàng; quan trọng hơn, chị biến quy tắc 60 phút thành quy trình cố định cho cả hai nhân viên trực trang.',
    comparison: [
      {
        weak: 'Phản ứng ngay khi đang bị kích hoạt vì thấy "phải nói cho rõ ngay bây giờ", rồi dành vài ngày sau để sửa hậu quả của câu nói đó.',
        mature:
          'Có một khoảng trễ được thiết kế sẵn (nháp 60 phút, hẹn nói chuyện chiều mai) và báo cho người kia biết mình sẽ quay lại chủ đề — hoãn có hẹn khác hẳn né tránh.',
      },
      {
        weak: 'Nén cảm xúc và tỏ ra bình thường, để nó rò rỉ sau đó qua giọng nói, sự lạnh nhạt hoặc một cơn bùng phát không liên quan.',
        mature:
          'Thừa nhận cảm xúc bằng lời ở mức phù hợp bối cảnh ("tôi đang thấy khó chịu về việc này, cho tôi mười phút") — cảm xúc được đặt tên thường giảm cường độ nhanh hơn cảm xúc bị chối bỏ.',
      },
      {
        weak: 'Xem cảm xúc mạnh là bằng chứng cho việc mình đúng: càng giận thì càng chắc chắn người kia sai.',
        mature:
          'Xem cường độ cảm xúc là chỉ báo về mức quan trọng của vấn đề với mình, còn tính đúng sai thì kiểm bằng dữ kiện và bằng cách hỏi lại người trong cuộc.',
      },
    ],
    mistakes: [
      'Tin rằng người trưởng thành thì không nên có cảm xúc mạnh, nên dồn năng lượng vào việc che giấu thay vì vào việc chọn hành vi — kết quả là mất cả thông tin lẫn sự tự chủ.',
      'Xả cảm xúc như một cách "giải toả": kể lại vụ việc năm lần cho năm người, mỗi lần lại hâm nóng câu chuyện và củng cố cách diễn giải ban đầu thay vì kiểm chứng nó.',
      'Bỏ qua các nguyên nhân sinh lý: thiếu ngủ, đói, đau, quá tải liên tục — rồi đi tìm nguyên nhân tâm lý cho một cơn cáu vốn chỉ cần một bữa ăn và một giấc ngủ.',
    ],
    worksheet: [
      'Dấu hiệu cơ thể nào xuất hiện đầu tiên khi bạn sắp mất bình tĩnh? Mô tả nó cụ thể đến mức người khác cũng nhận ra được ở bạn.',
      'Trong lần bùng nổ gần nhất, hãy viết hai cột: người kia thật sự nói/làm gì, và bạn đã thêm ý nghĩa gì. Cột nào dài hơn?',
      'Ba tình huống nào lặp đi lặp lại kích hoạt bạn mạnh nhất? Điểm chung giữa chúng là gì — bị hạ thấp, bị mất kiểm soát, hay bị nghi ngờ về năng lực?',
      'Thao tác hạ kích hoạt nào bạn thực sự làm được ngay tại chỗ làm việc mà không cần rời khỏi phòng? Viết đúng một thao tác và tập trước khi cần đến.',
      'Câu nào bạn sẽ nói để xin một khoảng trễ mà không làm người kia thấy bị bỏ rơi? Viết nguyên văn và học thuộc.',
    ],
    exercises: [
      {
        label: 'Bản đồ tín hiệu sớm',
        text: 'Trong bốn ngày, mỗi lần cảm thấy bực bội hãy dừng 15 giây và ghi ba dấu hiệu cơ thể đang có. Cuối kỳ, khoanh dấu hiệu xuất hiện sớm nhất và đáng tin nhất của riêng bạn.',
        level: 'e',
      },
      {
        label: 'Thở ra dài',
        text: 'Tập hai lần mỗi ngày, mỗi lần 90 giây: hít 4 nhịp, thở ra 6–8 nhịp. Tập lúc bình thường để lúc căng thẳng cơ thể đã quen thao tác — kỹ thuật chưa tập thì lúc cần sẽ không dùng được.',
        level: 'e',
      },
      {
        label: 'Từ điển cảm xúc',
        text: 'Liệt kê 12 từ chỉ cảm xúc khác nhau và với mỗi từ viết một tình huống của riêng bạn. Trong tuần, mỗi tối chọn đúng một từ mô tả trạng thái nổi bật trong ngày thay vì dùng "ổn" hoặc "mệt".',
        level: 'e',
      },
      {
        label: 'Quy tắc nháp',
        text: 'Đặt quy tắc: mọi tin nhắn hoặc email viết khi tim đập nhanh đều phải nằm nháp ít nhất 60 phút. Áp dụng ít nhất ba lần trong tuần và ghi lại bản gửi cuối khác bản nháp đầu ở chỗ nào.',
        level: 'm',
      },
      {
        label: 'Hai cột dữ kiện',
        text: 'Lấy ba xung đột gần đây, mỗi vụ tách thành cột dữ kiện và cột diễn giải. Với mỗi diễn giải, viết một câu hỏi bạn có thể hỏi để kiểm chứng — rồi thực sự hỏi trong ít nhất một trường hợp.',
        level: 'm',
      },
      {
        label: 'Tập nhận phản hồi khó',
        text: 'Nhờ đồng nghiệp góp ý thẳng về một sản phẩm của bạn với yêu cầu không giảm nhẹ. Nhiệm vụ của bạn: chỉ ghi chép và hỏi làm rõ trong toàn bộ buổi, không giải thích câu nào. Sau đó ghi lại mức khó chịu và điều học được.',
        level: 'm',
      },
      {
        label: 'Bảy ngày ghi nhật ký kích hoạt',
        text: 'Mỗi ngày ghi một dòng cho lần bị kích hoạt mạnh nhất: giờ, tình huống, giấc ngủ đêm trước, mức đói, cảm xúc gọi tên, hành vi đã chọn. Cuối tuần tìm mối liên hệ giữa yếu tố sinh lý và cường độ phản ứng.',
        level: 'h',
      },
      {
        label: 'Sửa lại một cuộc trao đổi hỏng',
        text: 'Chọn một cuộc trao đổi từng đổ vỡ, viết lại kịch bản với ba điểm can thiệp: chỗ bạn sẽ hạ kích hoạt, chỗ bạn sẽ hỏi thay vì khẳng định, chỗ bạn sẽ nêu nhu cầu. Nếu quan hệ còn, hãy mở lại chủ đề đó theo kịch bản mới và ghi kết quả.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao "xả cho hết giận" bằng cách kể lại nhiều lần thường không giúp ích?',
        a: 'Vì mỗi lần kể lại là một lần diễn tập chính cách diễn giải ban đầu, khiến câu chuyện chắc chắn hơn và cảm xúc được hâm nóng thay vì hạ xuống. Hữu ích hơn là mô tả sự việc một lần với người có thể phản biện, rồi chuyển sang câu hỏi "tôi muốn kết cục nào".',
      },
      {
        q: 'Điểm can thiệp hiệu quả nhất trong chuỗi cảm xúc nằm ở đâu?',
        a: 'Ở giai đoạn tín hiệu cơ thể sớm, trước khi hành vi tự động kịp bật ra. Càng để muộn, chi phí điều chỉnh càng cao: sau khi lời nói đã phát ra thì việc còn lại là sửa quan hệ chứ không còn là điều tiết cảm xúc.',
      },
      {
        q: 'Hoãn phản hồi khác né tránh ở điểm nào?',
        a: 'Hoãn có hẹn: bạn nói rõ mình cần thời gian và ấn định lúc quay lại ("chiều mai 4 giờ tôi trả lời anh"). Né tránh là im lặng không thời hạn, khiến người kia phải tự đoán và thường làm vấn đề leo thang.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê ba tình huống hay kích hoạt bạn nhất và dấu hiệu cơ thể đi kèm. Ngày 2: tập thở ra dài hai lần, lúc đang bình thường. Ngày 3: áp dụng quy tắc nháp 60 phút cho ít nhất một tin nhắn. Ngày 4: tách hai cột dữ kiện/diễn giải cho một xung đột cũ và soạn câu hỏi kiểm chứng. Ngày 5: dùng câu xin khoảng trễ trong một tình huống thật. Ngày 6: nhận một phản hồi khó mà chỉ ghi chép, không giải thích. Ngày 7: đọc lại nhật ký tuần, đối chiếu cường độ phản ứng với giờ ngủ và mức đói, rồi chọn một thay đổi sinh hoạt cho tuần sau.',
    evidence:
      'Bằng chứng của kỹ năng này là các tình huống căng mà bạn xử lý được, kèm cách bạn thiết kế quy trình để không phụ thuộc vào trạng thái nhất thời: quy tắc nháp trước khi gửi, quy ước tạm dừng trong họp căng, cách bạn xử lý một khách hàng hoặc đồng nghiệp giận dữ. Trong phỏng vấn, đây là chất liệu cho câu "kể về lần bạn bất đồng với đồng nghiệp/quản lý": mô tả bạn đã nhận ra mình đang bị kích hoạt như thế nào, đã hoãn ra sao, đã hỏi gì để kiểm chứng, và kết quả cả về công việc lẫn quan hệ.',
    references: [
      { label: 'APA — chuyên mục Anger và cách kiểm soát', url: 'https://www.apa.org/topics/anger', type: 'article' },
      { label: 'Greater Good Science Center — khoa học về cảm xúc và hạnh phúc', url: 'https://greatergood.berkeley.edu/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 7 · Trí tuệ cảm xúc — Emotional Intelligence ───────────────────
  guide({
    thesis:
      'Trí tuệ cảm xúc là năng lực dùng thông tin cảm xúc — của mình và của người khác — để ra quyết định và hành động hiệu quả hơn trong các tình huống có con người. Nó khác quản lý cảm xúc ở chỗ hướng ra ngoài: đọc được điều người kia thực sự cần, chọn cách nói khiến thông điệp đến được, và giữ quan hệ đủ tốt để lần sau còn nói chuyện được. Nó không đồng nghĩa với dễ tính hay luôn làm hài lòng người khác.',
    why: {
      work:
        'Phần lớn công việc bị tắc không vì thiếu năng lực kỹ thuật mà vì hai bên hiểu sai ý nhau và không ai kiểm chứng. Người có trí tuệ cảm xúc hỏi lại sớm và diễn đạt lại ý người kia trước khi phản biện.',
      interview:
        'Câu hỏi tình huống về đồng đội khó tính, khách hàng giận dữ hoặc một dự án có xung đột đều đo kỹ năng này. Điều được chấm là bạn có tìm hiểu động cơ của người kia trước khi kết luận hay không.',
      study:
        'Học nhóm, làm đồ án chung và xin hướng dẫn từ giảng viên đều là bài toán quan hệ. Biết chọn thời điểm và cách hỏi giúp bạn nhận được hỗ trợ mà người khác không thấy bị làm phiền.',
      life:
        'Trong gia đình và bạn bè, phần lớn tổn thương đến từ việc phản ứng với hành vi bề mặt mà bỏ qua nhu cầu phía sau — ví dụ đọc một câu trách móc thành sự tấn công thay vì thành lời cầu cứu sự chú ý.',
    },
    framework: [
      {
        name: 'Đọc mình trước',
        detail:
          'Trước một cuộc trao đổi quan trọng, xác định bạn đang mang cảm xúc gì vào phòng và nó có thể bóp méo cách bạn nghe ra sao. Cảm xúc chưa được nhận diện sẽ trở thành bộ lọc vô hình.',
      },
      {
        name: 'Quan sát tín hiệu',
        detail:
          'Chú ý ba lớp: nội dung nói, cách nói (nhịp, giọng, ngập ngừng) và những gì không nói. Ghi nhận như giả thuyết chứ không như kết luận — "tôi thấy anh im từ nãy" là quan sát, "anh đang giận" là suy diễn.',
      },
      {
        name: 'Kiểm chứng bằng câu hỏi',
        detail:
          'Nói ra quan sát và hỏi lại: "tôi thấy phần này anh nhắc hai lần, có phải đó là chỗ rủi ro nhất không?" Kiểm chứng biến suy diễn thành thông tin, và cũng cho người kia biết họ đang được lắng nghe.',
      },
      {
        name: 'Chọn cách nói',
        detail:
          'Cùng một nội dung có nhiều cách trình bày: có người cần số liệu trước, có người cần biết ảnh hưởng tới đội, có người cần thời gian đọc trước khi họp. Điều chỉnh hình thức không phải là giả tạo, đó là giảm tổn thất khi truyền tin.',
      },
      {
        name: 'Chốt bước tiếp theo',
        detail:
          'Kết thúc bằng việc thống nhất ai làm gì trước khi nào, và một câu ghi nhận đóng góp của người kia. Cuộc trao đổi có kết luận rõ ràng ít để lại ấm ức hơn cuộc trao đổi "vui vẻ" nhưng mơ hồ.',
      },
    ],
    scenario:
      'Một trưởng nhóm dự án thấy một thành viên giỏi bỗng im lặng suốt ba cuộc họp và bắt đầu nộp việc sát hạn. Phản xạ đầu tiên của anh là gắn nhãn "mất động lực" và định nhắc nhở trong họp chung. Thay vào đó, anh hẹn một buổi riêng 20 phút, mở đầu bằng quan sát trung tính ("ba buổi gần đây anh phát biểu ít hơn hẳn, tôi muốn hiểu chuyện gì đang xảy ra") rồi im lặng chờ. Hoá ra thành viên này đã bị cắt lời ở hai buổi đầu và kết luận rằng ý kiến của mình không được cần đến; song song đó anh đang lo về một quyết định kiến trúc mà không dám nêu vì sợ làm chậm tiến độ. Nhóm đổi hai thứ: gửi agenda trước 24 giờ và dành 5 phút cuối mỗi buổi cho vòng phát biểu bắt buộc. Hai tuần sau, chính rủi ro kiến trúc đó được nêu ra sớm và tiết kiệm cho nhóm một đợt làm lại.',
    comparison: [
      {
        weak: 'Giải thích hành vi người khác bằng tính cách: "cô ấy thiếu chủ động", "anh này bảo thủ" — nhãn dán làm bạn ngừng tìm nguyên nhân tình huống.',
        mature:
          'Giả định trước rằng có một lý do hợp lý bạn chưa biết, rồi đi tìm nó bằng một cuộc trao đổi riêng và một câu hỏi mở.',
      },
      {
        weak: 'Đồng cảm dừng ở cảm thông: nghe, gật đầu, nói "tôi hiểu mà", rồi không có gì thay đổi trong cách làm việc.',
        mature:
          'Đồng cảm kèm hành động: sau khi hiểu, đổi một điều cụ thể trong quy trình hoặc trong cách phân công, rồi hỏi lại sau hai tuần xem thay đổi có tác dụng không.',
      },
      {
        weak: 'Coi trí tuệ cảm xúc là luôn giữ hoà khí, nên né các cuộc trao đổi khó và để vấn đề tích tụ.',
        mature:
          'Nói được điều khó bằng cách giữ tôn trọng: nêu tác động cụ thể, hỏi góc nhìn của người kia, và tách vấn đề khỏi con người.',
      },
    ],
    mistakes: [
      'Dùng khả năng đọc cảm xúc để điều khiển người khác — biết ai dễ ngại từ chối rồi nhắm vào đó; kỹ năng này mất tác dụng rất nhanh khi người ta nhận ra và nó phá huỷ uy tín lâu dài.',
      'Nhầm suy diễn với quan sát: kể lại "sếp không hài lòng với tôi" như một dữ kiện, trong khi dữ kiện chỉ là "sếp trả lời email chậm hơn bình thường".',
      'Cố đọc cảm xúc qua tin nhắn văn bản rồi hành động theo suy đoán đó, trong khi văn bản đã lược mất giọng điệu, nét mặt và bối cảnh — đây là nguồn hiểu lầm lớn nhất trong làm việc từ xa.',
    ],
    worksheet: [
      'Người nào trong nhóm bạn khó hiểu nhất hiện nay? Viết ba giả thuyết khác nhau giải thích hành vi của họ, trong đó ít nhất một giả thuyết không liên quan gì đến bạn.',
      'Ghi lại nguyên văn một câu bạn từng nói ra mà sau đó thấy nó gây tổn thương. Nếu viết lại, phần nội dung nào giữ nguyên và phần cách nói nào bạn đổi?',
      'Trong cuộc họp gần nhất, ai nói ít nhất? Bạn có dữ kiện gì về lý do, hay bạn chỉ có suy diễn?',
      'Với ba người bạn làm việc thường xuyên nhất, mỗi người cần thông tin ở dạng nào để ra quyết định — số liệu, ảnh hưởng tới người dùng, hay rủi ro với tiến độ?',
      'Cuộc trao đổi khó nào bạn đang trì hoãn? Viết câu mở đầu bằng một quan sát trung tính, không kèm đánh giá, rồi viết câu hỏi mở tiếp theo.',
    ],
    exercises: [
      {
        label: 'Ba giả thuyết',
        text: 'Với một hành vi khó hiểu của đồng nghiệp trong tuần, viết ba lời giải thích khác nhau trước khi phản ứng. Chọn giả thuyết rộng lượng nhất còn hợp lý và hành động theo nó, rồi ghi lại điều thực sự xảy ra.',
        level: 'e',
      },
      {
        label: 'Phân loại quan sát và suy diễn',
        text: 'Lấy năm câu bạn đã nói hoặc nghĩ về người khác trong tuần và đánh dấu mỗi câu là quan sát hay suy diễn. Với mỗi suy diễn, viết lại thành cặp quan sát + câu hỏi kiểm chứng.',
        level: 'e',
      },
      {
        label: 'Nhắc lại trước khi phản biện',
        text: 'Trong ba cuộc trao đổi, trước khi nêu ý kiến trái chiều hãy tóm tắt lại ý người kia và hỏi "tôi hiểu đúng chưa". Ghi lại số lần bạn tóm tắt sai ở lần đầu.',
        level: 'e',
      },
      {
        label: 'Buổi nói chuyện riêng 20 phút',
        text: 'Hẹn riêng một người đang có dấu hiệu thu mình hoặc căng thẳng, mở đầu bằng một quan sát trung tính rồi im lặng chờ ít nhất 8 giây. Ghi lại tỷ lệ thời gian nói của bạn so với họ.',
        level: 'm',
      },
      {
        label: 'Điều chỉnh thông điệp theo người nghe',
        text: 'Lấy một đề xuất bạn cần trình bày và viết ba phiên bản mở đầu cho ba đối tượng: quản lý trực tiếp, đồng nghiệp bị ảnh hưởng, và một bộ phận khác. Giữ nguyên kết luận, chỉ đổi thứ tự thông tin và ví dụ.',
        level: 'm',
      },
      {
        label: 'Sửa một tin nhắn dễ gây hiểu lầm',
        text: 'Tìm trong lịch sử chat một tin nhắn công việc của bạn có thể bị đọc lệch giọng điệu. Viết lại bằng cách thêm ngữ cảnh, nêu ý định và một câu hỏi mở, rồi so hai bản.',
        level: 'm',
      },
      {
        label: 'Bảy ngày lắng nghe không giải pháp',
        text: 'Trong 7 ngày, mỗi khi ai đó kể một khó khăn, hãy hỏi "bạn muốn tôi nghe hay muốn tôi góp ý" trước khi nói gì thêm. Ghi lại họ chọn gì và cuộc trò chuyện đi theo hướng nào.',
        level: 'h',
      },
      {
        label: 'Cuộc trao đổi khó đã hoãn lâu',
        text: 'Chọn một vấn đề bạn đã né trên 30 ngày. Chuẩn bị theo bốn phần: quan sát trung tính, tác động cụ thể lên công việc, câu hỏi lấy góc nhìn của họ, đề xuất bước tiếp. Thực hiện và viết một trang tổng kết: điều bạn dự đoán, điều thật sự xảy ra, khoảng cách giữa hai bên.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Trí tuệ cảm xúc và sự dễ chịu, tử tế có phải một thứ không?',
        a: 'Không. Người có trí tuệ cảm xúc cao vẫn nói ra những điều khó nghe khi cần, chỉ khác ở chỗ họ chọn thời điểm, hình thức và mức độ phù hợp để thông điệp đến được. Luôn dễ chịu và né xung đột thường là dấu hiệu của kỹ năng thấp, không phải cao.',
      },
      {
        q: 'Bạn thấy một đồng nghiệp trả lời cộc lốc trong chat. Bước đầu tiên nên làm gì?',
        a: 'Tách quan sát khỏi suy diễn: dữ kiện là câu trả lời ngắn, còn "họ khó chịu với mình" là giả thuyết. Kiểm chứng bằng kênh giàu thông tin hơn (gọi thoại một phút, hỏi trực tiếp) thay vì suy đoán tiếp qua văn bản.',
      },
      {
        q: 'Đồng cảm dừng ở mức nào thì trở nên vô ích trong công việc?',
        a: 'Khi nó dừng ở việc thể hiện sự thông cảm mà không dẫn tới thay đổi nào trong cách làm việc. Đồng cảm có ích khi kết thúc bằng một điều chỉnh cụ thể — đổi cách họp, đổi phân công, đổi hạn — và một lần kiểm lại sau vài tuần.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê ba người bạn tương tác nhiều nhất và ghi cách mỗi người thích nhận thông tin. Ngày 2: đánh dấu quan sát/suy diễn cho năm nhận định của bạn về người khác. Ngày 3: tập nhắc lại ý người kia trước khi phản biện trong hai cuộc trao đổi. Ngày 4: hẹn riêng 20 phút với người đang có dấu hiệu thu mình, mở bằng quan sát trung tính. Ngày 5: viết lại một thông điệp quan trọng theo ba phiên bản cho ba đối tượng. Ngày 6: hỏi "muốn tôi nghe hay muốn tôi góp ý" ít nhất ba lần. Ngày 7: thực hiện cuộc trao đổi khó đã hoãn lâu và viết một trang tổng kết.',
    evidence:
      'Hiện vật cho kỹ năng này thường là các thay đổi quy trình bạn tạo ra sau khi hiểu người khác: agenda gửi trước, vòng phát biểu cuối họp, mẫu 1-1, quy ước phản hồi. Hãy lưu lại trước–sau bằng chỉ số quan sát được (số ý kiến nêu trong họp, số rủi ro được báo sớm, tỷ lệ giữ chân thành viên). Khi phỏng vấn cho vai trò cần phối hợp hoặc quản lý, dùng nó cho câu "kể về một mâu thuẫn trong nhóm bạn đã xử lý": nhấn vào bước bạn đã đi tìm nguyên nhân thật thay vì bước bạn thuyết phục người khác.',
    references: [
      { label: 'Consortium for Research on Emotional Intelligence in Organizations', url: 'https://www.eiconsortium.org/', type: 'article' },
      { label: 'Greater Good Science Center — chuyên mục Empathy', url: 'https://greatergood.berkeley.edu/topic/empathy', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ── Chương 8 · Khả năng thích nghi — Adaptability ─────────────────────────
  guide({
    thesis:
      'Thích nghi tốt không phải là đổi hướng theo mọi tín hiệu mới, mà là giữ chặt mục tiêu cốt lõi trong khi thả lỏng các giả định, phương pháp và vai trò khi bối cảnh thay đổi. Nó đòi hai việc trái nhau phải cùng tồn tại: biết cái gì không được đổi, và sẵn sàng vứt bỏ nhanh những cách làm đã hết tác dụng — kể cả những cách chính bạn từng dựng lên và tự hào về nó.',
    why: {
      work:
        'Công cụ, quy trình và cơ cấu tổ chức thay đổi thường xuyên hơn nhiều so với mục tiêu kinh doanh. Ai chuyển đổi nhanh mà không mất chất lượng sẽ được giao những phần việc mới, còn ai bám cách cũ dần bị đẩy ra rìa.',
      interview:
        'Gần như mọi buổi phỏng vấn đều có câu hỏi về một lần thay đổi lớn: đổi yêu cầu giữa chừng, đổi sếp, đổi công nghệ. Câu trả lời tốt cho thấy bạn phân biệt được phần cốt lõi giữ nguyên và phần phương pháp đã bỏ.',
      study:
        'Chương trình học, hình thức thi và tài liệu thay đổi liên tục. Người thích nghi được sẽ đổi chiến lược ôn tập khi format đề đổi, thay vì làm lại đúng bộ đề cũ vì đã quen.',
      life:
        'Chuyển nhà, đổi thành phố, thay đổi trong gia đình hay sức khỏe đều buộc phải sắp xếp lại thói quen. Thích nghi giúp giai đoạn chuyển tiếp ngắn lại và ít mất mát hơn.',
    },
    framework: [
      {
        name: 'Xác nhận điều đã đổi',
        detail:
          'Viết bằng câu cụ thể cái gì thật sự khác đi và từ bao giờ, tách khỏi tin đồn và cảm giác bất an. Nhiều "thay đổi lớn" khi viết ra chỉ là một điều kiện thay đổi cộng với nhiều lo lắng chưa có cơ sở.',
      },
      {
        name: 'Khoanh phần lõi',
        detail:
          'Ghi rõ mục tiêu, cam kết và nguyên tắc nào không đổi dù bối cảnh nào. Không có phần lõi thì mọi thay đổi đều thành xoay chiều, và đội của bạn sẽ mất khả năng dự đoán bạn.',
      },
      {
        name: 'Soát giả định hết hạn',
        detail:
          'Với cách làm hiện tại, hãy viết ra những điều bạn vẫn ngầm cho là đúng ("khách hàng luôn muốn gặp trực tiếp", "duyệt phải qua ba cấp"). Thích nghi bắt đầu bằng việc phát hiện giả định nào vừa hết hiệu lực.',
      },
      {
        name: 'Tạo hai phương án',
        detail:
          'Không bao giờ dừng ở một phương án, vì phương án duy nhất khiến bạn bảo vệ nó thay vì đánh giá nó. Hai phương án buộc bạn nêu tiêu chí so sánh.',
      },
      {
        name: 'Thử nhỏ trước',
        detail:
          'Chạy thử trong phạm vi hẹp và thời hạn ngắn, định trước chỉ số quyết định giữ hay bỏ. Thử nghiệm không có tiêu chí dừng thường biến thành trạng thái nửa vời kéo dài nhiều tháng.',
      },
    ],
    scenario:
      'Một trưởng phòng kinh doanh có 9 nhân viên bị yêu cầu chuyển toàn bộ quy trình sang một CRM mới trong 6 tuần. Phản ứng đầu tiên của cả phòng là tái tạo y nguyên cách làm cũ trên công cụ mới, và hai tuần đầu năng suất tụt vì mọi thao tác đều nhiều bước hơn. Anh dừng lại và viết ra ba giả định đang chi phối cách làm cũ: báo cáo phải làm thủ công cuối tuần, mọi cơ hội đều phải qua anh duyệt, và ghi chú cuộc gọi lưu trong file riêng của từng người. Công cụ mới làm hai giả định đầu hết hiệu lực. Anh giữ nguyên phần lõi — chỉ tiêu doanh số và cam kết phản hồi khách trong 24 giờ — nhưng bỏ buổi báo cáo cuối tuần (thay bằng dashboard), phân quyền duyệt cho hai trưởng nhóm, và bắt buộc ghi chú vào hệ thống. Anh thử trên đúng một nhóm ba người trong hai tuần với chỉ số quyết định là thời gian phản hồi khách. Chỉ số cải thiện, cách làm mới được nhân ra cả phòng ở tuần thứ năm.',
    comparison: [
      {
        weak: 'Chuyển sang công cụ hoặc quy trình mới nhưng bê nguyên thói quen cũ vào, rồi kết luận rằng cái mới tệ hơn.',
        mature:
          'Hỏi trước "cái mới làm giả định nào của tôi hết hiệu lực", rồi thiết kế lại luồng việc theo năng lực mới thay vì mô phỏng luồng cũ.',
      },
      {
        weak: 'Đổi hướng mỗi khi có tín hiệu mới, khiến đội không biết đâu là ưu tiên và mọi việc đều dở dang.',
        mature:
          'Cố định phần lõi bằng văn bản và chỉ cho phép thay đổi phương pháp; mọi lần đổi hướng đều nói rõ điều gì trong dữ liệu đã kích hoạt việc đổi.',
      },
      {
        weak: 'Chờ đến khi có đủ thông tin mới hành động, nên khi quyết định thì cửa sổ cơ hội đã đóng.',
        mature:
          'Chạy một thử nghiệm nhỏ có thời hạn để tự tạo thông tin, chấp nhận rằng chi phí của thử nghiệm nhỏ thấp hơn chi phí của việc đứng yên.',
      },
    ],
    mistakes: [
      'Coi thích nghi là phẩm chất mềm dẻo chung chung, nên không viết ra phần lõi — kết quả là dễ bị cuốn theo yêu cầu của người nói to nhất và mất phương hướng dài hạn.',
      'Bỏ cách làm cũ mà không lưu lại lý do nó từng tồn tại; vài tháng sau đội gặp lại đúng vấn đề mà cách cũ vốn đang phòng ngừa.',
      'Nhầm sự bận rộn khi chuyển đổi với tiến bộ: học công cụ mới, dự họp về thay đổi, viết tài liệu mới nhưng không có chỉ số nào cho thấy kết quả thật đã đổi.',
    ],
    worksheet: [
      'Thay đổi nào đang diễn ra quanh bạn? Viết một câu dữ kiện về nó và một câu về phần bạn đang lo mà chưa có bằng chứng.',
      'Ba điều gì trong công việc của bạn không được phép đổi dù bối cảnh thế nào? Đây là phần lõi — nếu viết ra hơn năm điều, bạn chưa thực sự chọn.',
      'Cách làm hiện tại của bạn dựa trên những giả định ngầm nào? Liệt kê bốn giả định và đánh dấu cái nào vừa hết hiệu lực trong 6 tháng qua.',
      'Với tình huống đang thay đổi, hãy viết hai phương án khác nhau về bản chất (không phải hai biến thể của cùng một cách) và tiêu chí bạn dùng để so sánh.',
      'Thử nghiệm nhỏ nào bạn có thể chạy trong hai tuần? Ghi phạm vi, chỉ số quyết định và ngày bạn sẽ chốt giữ hay bỏ.',
    ],
    exercises: [
      {
        label: 'Tách dữ kiện khỏi tin đồn',
        text: 'Với một thay đổi đang được bàn tán ở nơi bạn làm việc, lập hai cột: điều đã được thông báo chính thức và điều bạn nghe qua người khác. Với mỗi mục cột hai, ghi cách kiểm chứng.',
        level: 'e',
      },
      {
        label: 'Tuyên bố phần lõi',
        text: 'Viết ba dòng "dù thay đổi thế nào, tôi vẫn giữ...", áp dụng cho vai trò công việc hiện tại. Đọc lại sau một tuần và xoá dòng nào bạn thấy không thật sự bảo vệ được.',
        level: 'e',
      },
      {
        label: 'Săn giả định hết hạn',
        text: 'Chọn một quy trình bạn làm hằng tuần và hỏi với từng bước: "bước này tồn tại vì giả định nào, giả định đó còn đúng không?" Đánh dấu bước nào chỉ còn tồn tại do quán tính.',
        level: 'e',
      },
      {
        label: 'Hai phương án khác bản chất',
        text: 'Với một vấn đề đang phải quyết, viết hai phương án dựa trên hai logic khác nhau, kèm ba tiêu chí so sánh và dự đoán kết quả. Đưa cho một đồng nghiệp chọn và hỏi lý do họ chọn.',
        level: 'm',
      },
      {
        label: 'Thử nghiệm hai tuần',
        text: 'Chạy một thay đổi trong phạm vi nhỏ nhất có thể (một nhóm, một khách hàng, một loại việc), định trước chỉ số quyết định và ngày chốt. Viết kết quả kể cả khi phải bỏ.',
        level: 'm',
      },
      {
        label: 'Học một công cụ mới bằng luồng việc thật',
        text: 'Khi phải dùng công cụ mới, đừng học theo menu. Chọn ba luồng việc thật bạn làm nhiều nhất và tìm cách làm chúng bằng cách của công cụ mới, ghi lại chỗ nào cách mới ít bước hơn.',
        level: 'm',
      },
      {
        label: 'Bảy ngày phá một thói quen làm việc',
        text: 'Chọn một thói quen công việc bạn làm tự động (họp đầu ngày, báo cáo mẫu cũ, một tuyến duyệt) và tạm dừng nó trong 7 ngày. Ghi lại điều gì thực sự hỏng và điều gì không ai nhớ tới.',
        level: 'h',
      },
      {
        label: 'Kịch bản ba tương lai',
        text: 'Viết ba kịch bản cho lĩnh vực của bạn trong 12 tháng tới (thuận lợi, giữ nguyên, xấu đi). Với mỗi kịch bản, ghi một kỹ năng cần bổ sung và một dấu hiệu sớm cho biết kịch bản đó đang tới. Rà lại danh sách sau mỗi quý.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Phân biệt thích nghi với dao động (thay đổi liên tục theo mọi tín hiệu) bằng dấu hiệu nào?',
        a: 'Bằng sự tồn tại của phần lõi được viết ra và bằng lý do của mỗi lần đổi. Thích nghi giữ nguyên mục tiêu và nguyên tắc, chỉ đổi phương pháp khi có dữ liệu cho thấy phương pháp cũ hết tác dụng. Dao động là đổi cả mục tiêu và không nêu được dữ liệu nào đã kích hoạt việc đổi.',
      },
      {
        q: 'Vì sao bê nguyên quy trình cũ sang công cụ mới thường thất bại?',
        a: 'Vì quy trình cũ được thiết kế quanh các giới hạn của công cụ cũ. Khi giới hạn đó biến mất, nhiều bước trở thành thừa và làm cái mới trông chậm hơn. Cách đúng là tìm giả định nào vừa hết hiệu lực rồi thiết kế lại luồng việc.',
      },
      {
        q: 'Một thử nghiệm nhỏ cần có gì để không kéo dài vô hạn?',
        a: 'Phạm vi hẹp, thời hạn cụ thể, một chỉ số quyết định được chọn trước, và cam kết chốt giữ hay bỏ vào đúng ngày đã hẹn — kể cả khi kết quả không rõ ràng, vì "không rõ ràng" cũng là một kết luận cần được ghi lại.',
      },
    ],
    plan7:
      'Ngày 1: viết một trang mô tả thay đổi đang diễn ra, tách dữ kiện khỏi tin đồn. Ngày 2: tuyên bố ba điều thuộc phần lõi không đổi. Ngày 3: rà một quy trình hằng tuần và đánh dấu các bước chỉ còn do quán tính. Ngày 4: viết hai phương án khác bản chất kèm ba tiêu chí so sánh. Ngày 5: chọn phạm vi nhỏ nhất và khởi động một thử nghiệm hai tuần, ghi rõ chỉ số quyết định. Ngày 6: hỏi hai người đang chịu ảnh hưởng xem cách làm mới gây khó ở đâu. Ngày 7: viết một trang gồm phần lõi, giả định đã bỏ, thử nghiệm đang chạy và ngày chốt.',
    evidence:
      'Bằng chứng thuyết phục nhất là một lần chuyển đổi có số liệu trước–sau và có mô tả rõ bạn đã bỏ cái gì. Hãy lưu: tài liệu quyết định (điều gì đổi, vì sao, chỉ số nào theo dõi), kết quả thử nghiệm nhỏ kể cả lần thất bại, và bản so sánh quy trình cũ–mới. Trong phỏng vấn, đây là chất liệu cho câu "kể về một thay đổi lớn bạn từng trải qua": kể phần lõi bạn giữ, giả định bạn phát hiện đã hết hạn, thử nghiệm bạn chạy và kết quả — cấu trúc này cho thấy bạn thích nghi có phương pháp chứ không chỉ chịu đựng được thay đổi.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Managing yourself', url: 'https://hbr.org/topic/subject/managing-yourself', type: 'article', needsReview: true },
      { label: 'TED — chuyên mục Work', url: 'https://www.ted.com/topics/work', type: 'video' },
    ],
    diagram: 'flow',
  }),

  // ── Chương 9 · Khả năng phục hồi — Resilience ─────────────────────────────
  guide({
    thesis:
      'Resilience không phải là chịu đựng vô hạn hay không bị tổn thương. Đó là năng lực hấp thụ một cú sốc cụ thể — mất việc, dự án đổ, một thất bại công khai — rồi khôi phục lại chức năng sống và làm việc trong thời gian hợp lý, rút ra bài học đúng, và dựng thêm lớp bảo vệ để lần sau tổn thất nhỏ hơn. Thước đo của nó là thời gian phục hồi và chất lượng hệ thống sau đó, không phải mức độ bạn tỏ ra ổn.',
    why: {
      work:
        'Sự nghiệp dài luôn có ít nhất vài cú vấp lớn: dự án bị huỷ, sản phẩm không có người dùng, bị cắt giảm. Người phục hồi nhanh quay lại thị trường sớm hơn nhiều tháng, và tháng nào cũng có giá.',
      interview:
        'Câu "kể về thất bại lớn nhất của bạn" đo đúng kỹ năng này. Người kể được cả cú sốc, cách mình xử lý giai đoạn tệ nhất, bài học rút ra và thay đổi sau đó sẽ thuyết phục hơn người chỉ có một thất bại đã được làm nhẹ đi.',
      study:
        'Trượt một kỳ thi hoặc bị từ chối học bổng dễ khiến người học rời bỏ hẳn con đường. Khả năng phục hồi giữ khoảng cách giữa "lần này hỏng" và "tôi không hợp với lĩnh vực này".',
      life:
        'Bệnh tật, mất người thân, đổ vỡ quan hệ là những cú sốc không thể tránh. Có sẵn một quy trình phục hồi giúp bạn không phải nghĩ ra cách xoay xở đúng vào lúc ít sáng suốt nhất.',
    },
    framework: [
      {
        name: 'Ổn định phần nền',
        detail:
          'Trong 72 giờ đầu, ưu tiên duy nhất là ngủ, ăn, uống nước và giữ liên lạc với vài người tin cậy. Hoãn mọi quyết định lớn không có hạn gấp — phán đoán trong giai đoạn này không đáng tin và các quyết định đó thường tốn kém.',
      },
      {
        name: 'Thu hẹp phạm vi',
        detail:
          'Viết ra chính xác cái gì đã mất và cái gì còn nguyên. Cú sốc có xu hướng lan ra toàn bộ bản sắc ("tôi thất bại") trong khi thiệt hại thật thường có biên giới rõ ràng.',
      },
      {
        name: 'Tách phần kiểm soát được',
        detail:
          'Chia nguyên nhân thành ba nhóm: do quyết định của tôi, do người khác, do hoàn cảnh. Chỉ nhóm đầu mới cho ra bài học hành động; nhận hết ba nhóm về mình là cách chắc chắn nhất để kéo dài giai đoạn tê liệt.',
      },
      {
        name: 'Khôi phục bằng nhịp nhỏ',
        detail:
          'Quay lại bằng những việc có kích thước nhỏ và tỷ lệ thành công cao trong 1–2 tuần đầu, để hệ thống của bạn nạp lại bằng chứng rằng mình vẫn vận hành được.',
      },
      {
        name: 'Dựng lớp bảo vệ',
        detail:
          'Sau khi ổn định, thay đổi một điều trong hệ thống để cùng cú sốc lần sau ít đau hơn: quỹ dự phòng, đa dạng nguồn thu, kiểm chứng nhu cầu trước khi xây, hoặc một mạng lưới quan hệ được duy trì đều.',
      },
    ],
    scenario:
      'Một chuyên viên phân tích bị cắt giảm sau khi công ty đóng một mảng kinh doanh, dù đánh giá năng lực năm trước của anh vẫn tốt. Tuần đầu anh chỉ làm ba việc: giữ giờ ngủ, đi bộ 30 phút mỗi sáng và báo tin cho năm người anh tin. Anh hoãn mọi quyết định lớn (bán xe, chuyển về quê) sang sau 30 ngày. Sang tuần hai, anh viết bảng phân loại nguyên nhân và thấy phần thuộc quyết định của mình chỉ có hai điểm: anh đã không cập nhật hồ sơ suốt ba năm và toàn bộ quan hệ nghề nghiệp đều nằm trong một công ty. Anh khôi phục bằng nhịp nhỏ: mỗi ngày một việc duy nhất, có thể là sửa một mục CV hoặc nhắn cho một người quen cũ. Sau bảy tuần anh có việc mới; điểm thay đổi lâu dài là hai lớp bảo vệ anh dựng lên — quỹ dự phòng sáu tháng và lịch mỗi tháng nói chuyện với hai người ngoài công ty, duy trì cả khi đang yên ổn.',
    comparison: [
      {
        weak: 'Lao ngay vào hành động lớn để "vượt qua nhanh": nộp 80 hồ sơ trong ba ngày, hoặc quyết định đổi nghề trong tuần đầu.',
        mature:
          'Dành 72 giờ đầu cho việc ổn định sinh lý và hoãn quyết định lớn, vì chất lượng quyết định trong giai đoạn này thấp và hậu quả thì kéo dài nhiều năm.',
      },
      {
        weak: 'Diễn giải sự kiện thành bản sắc: "tôi là kẻ thất bại", khiến mọi lĩnh vực khác của cuộc sống cùng bị kéo xuống.',
        mature:
          'Mô tả sự kiện có biên giới thời gian và phạm vi: "dự án X thất bại vì giả định về nhu cầu sai, trong bối cảnh Y" — đủ để rút bài học mà không phá huỷ nền tảng để đứng dậy.',
      },
      {
        weak: 'Coi việc nhờ giúp đỡ là dấu hiệu yếu đuối nên chịu đựng một mình cho tới khi kiệt.',
        mature:
          'Chủ động kích hoạt mạng lưới bằng những đề nghị cụ thể ("cho tôi 30 phút xem lại CV", "giới thiệu tôi với một người trong ngành") — cụ thể thì dễ được giúp hơn nhiều so với lời than chung.',
      },
      {
        weak: 'Sau khi vượt qua thì đóng hồ sơ, không thay đổi gì trong hệ thống, nên cú sốc cùng loại lần sau gây thiệt hại y hệt.',
        mature:
          'Kết thúc chu kỳ bằng một thay đổi cấu trúc cụ thể và kiểm lại sau ba tháng xem lớp bảo vệ đó có thật sự tồn tại không.',
      },
    ],
    mistakes: [
      'Nhầm resilience với việc không cho phép mình buồn: ép quay lại làm việc ngay ngày hôm sau, rồi phải trả giá bằng một giai đoạn sụp đổ dài hơn vài tuần sau đó.',
      'Rút bài học sai vì làm hồi cứu quá sớm, lúc còn đang đau — kết luận thường quá nặng nề với chính mình hoặc quá đổ lỗi cho người khác, và cả hai đều không dùng được.',
      'Chỉ tập trung phục hồi tinh thần mà bỏ qua phần hạ tầng: tiền mặt, chỗ ở, bảo hiểm, hồ sơ năng lực — trong khi sự bấp bênh của những thứ này chính là nguồn duy trì lo lắng.',
    ],
    worksheet: [
      'Cú sốc gần nhất của bạn là gì? Viết một danh sách "đã mất" và một danh sách "vẫn còn nguyên", cả hai đều phải cụ thể.',
      'Chia nguyên nhân của sự kiện đó thành ba nhóm: quyết định của tôi, hành động của người khác, hoàn cảnh. Tỷ lệ ước tính mỗi nhóm là bao nhiêu phần trăm?',
      'Trong giai đoạn tệ nhất, ba việc nhỏ nào bạn vẫn duy trì được (giờ ngủ, một bữa ăn tử tế, đi bộ, một cuộc gọi)? Đây là bộ khung tối thiểu của bạn — hãy viết ra để lần sau không phải nghĩ lại.',
      'Ai là năm người bạn sẽ báo tin và nhờ giúp? Với mỗi người, viết một đề nghị cụ thể thay vì một lời than.',
      'Lớp bảo vệ nào bạn sẽ dựng trong 90 ngày tới để cùng cú sốc lần sau bớt đau hơn, và bạn kiểm lại nó vào ngày nào?',
    ],
    exercises: [
      {
        label: 'Bộ khung tối thiểu',
        text: 'Viết ra bốn việc bạn cam kết vẫn làm kể cả trong tuần tệ nhất (giờ dậy, một bữa nấu, 20 phút đi bộ, một cuộc gọi cho người thân). Dán ở chỗ dễ thấy để không phải quyết định lại lúc đang kiệt.',
        level: 'e',
      },
      {
        label: 'Danh sách hai cột',
        text: 'Với một mất mát trong hai năm qua, lập cột "đã mất" và cột "còn nguyên", mỗi cột tối thiểu năm dòng cụ thể. Đọc lại và ghi một câu nhận xét về độ dài thực tế của hai cột.',
        level: 'e',
      },
      {
        label: 'Danh bạ cứu hộ',
        text: 'Lập danh sách 5–8 người kèm số điện thoại và một dòng ghi họ giúp được việc gì (nghe, cho lời khuyên nghề, giới thiệu, hỗ trợ thực tế). Cập nhật mỗi quý và chủ động giữ liên lạc khi chưa cần đến.',
        level: 'e',
      },
      {
        label: 'Phân loại nguyên nhân',
        text: 'Chọn một thất bại đã đủ xa để nhìn lại, chia nguyên nhân thành ba nhóm và chỉ rút bài học hành động từ nhóm "quyết định của tôi". Viết đúng hai bài học, mỗi bài kèm một hành vi cụ thể.',
        level: 'm',
      },
      {
        label: 'Hồi cứu không đổ lỗi',
        text: 'Tổ chức (hoặc tự làm) một buổi hồi cứu theo bốn câu hỏi: điều gì đã xảy ra, chúng ta đã tin gì lúc đó, tín hiệu nào đã có mà bị bỏ qua, lần sau sẽ đổi quy trình nào. Ghi thành một trang và chia sẻ.',
        level: 'm',
      },
      {
        label: 'Kiểm tra hạ tầng',
        text: 'Rà bốn thứ: số tháng chi tiêu quỹ dự phòng đang gánh được, tình trạng bảo hiểm, mức cập nhật của CV/hồ sơ, số người ngoài công ty bạn còn giữ liên lạc. Viết một hành động cải thiện cho mục yếu nhất.',
        level: 'm',
      },
      {
        label: 'Bảy ngày khởi động lại',
        text: 'Sau một giai đoạn chững, chọn mỗi ngày đúng một việc nhỏ có tỷ lệ hoàn thành cao và ghi lại cảm giác trước–sau. Mục tiêu của tuần là chuỗi bảy dấu tích, không phải khối lượng công việc.',
        level: 'h',
      },
      {
        label: 'Kế hoạch 90 ngày dựng lớp bảo vệ',
        text: 'Chọn một lớp bảo vệ (quỹ dự phòng, nguồn thu thứ hai, mạng lưới, kỹ năng dự phòng) và viết kế hoạch 90 ngày có mốc hằng tháng và chỉ số kiểm. Đặt lịch rà lại ngày thứ 30, 60 và 90.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên hoãn các quyết định lớn trong những ngày đầu sau một cú sốc?',
        a: 'Vì thiếu ngủ, căng thẳng cấp tính và cảm xúc mạnh làm hẹp tầm nhìn và đẩy bạn về phía các lựa chọn cực đoan. Những quyết định đó (bán tài sản, cắt đứt quan hệ, đổi nghề) có hậu quả nhiều năm, trong khi chi phí để chờ vài tuần thường rất nhỏ.',
      },
      {
        q: 'Phân biệt "mô tả sự kiện" và "mô tả bản sắc", vì sao khác biệt này quan trọng?',
        a: '"Dự án thất bại vì tôi sai giả định về nhu cầu" là mô tả sự kiện, có biên giới và chỉ ra chỗ sửa. "Tôi là kẻ thất bại" là mô tả bản sắc, lan ra mọi lĩnh vực và không cho hành động nào. Cách diễn giải quyết định thời gian phục hồi nhiều hơn bản thân độ lớn của sự kiện.',
      },
      {
        q: 'Một chu kỳ phục hồi được coi là hoàn tất khi nào?',
        a: 'Khi bạn đã khôi phục chức năng làm việc và sinh hoạt, đã rút được bài học từ phần mình kiểm soát, và đã dựng thêm ít nhất một lớp bảo vệ có thể kiểm chứng. Nếu không có bước cuối, bạn mới trở lại trạng thái cũ chứ chưa hạ được thiệt hại của lần sau.',
      },
    ],
    plan7:
      'Ngày 1: viết bộ khung tối thiểu bốn việc và thực hiện đủ ngay hôm nay. Ngày 2: lập hai cột "đã mất" và "còn nguyên". Ngày 3: báo tin và đưa một đề nghị cụ thể cho hai người trong danh bạ cứu hộ. Ngày 4: phân loại nguyên nhân theo ba nhóm, chưa rút bài học. Ngày 5: rút đúng hai bài học từ nhóm mình kiểm soát, mỗi bài kèm một hành vi. Ngày 6: rà hạ tầng (tiền, bảo hiểm, hồ sơ, quan hệ) và chọn mục yếu nhất. Ngày 7: viết kế hoạch 90 ngày cho một lớp bảo vệ, đặt lịch rà ngày 30/60/90.',
    evidence:
      'Kể một thất bại có cấu trúc là một trong những cách nhanh nhất tạo ấn tượng đáng tin trong phỏng vấn: bối cảnh và mức thiệt hại thật, cách bạn ổn định giai đoạn đầu, phân tích nguyên nhân tách phần mình kiểm soát, và thay đổi hệ thống sau đó — nếu có số liệu ở lần làm lại thì càng tốt. Trong portfolio, một bài viết hồi cứu trung thực về một dự án đổ vỡ thường được người trong nghề đánh giá cao hơn một trang liệt kê thành tích, vì nó cho thấy bạn học được từ chi phí đã trả.',
    references: [
      { label: 'APA — chuyên mục Resilience', url: 'https://www.apa.org/topics/resilience', type: 'article' },
      { label: 'Greater Good Science Center — chuyên mục Social connection', url: 'https://greatergood.berkeley.edu/topic/social_connection', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ── Chương 10 · Quản lý căng thẳng ────────────────────────────────────────
  guide({
    thesis:
      'Căng thẳng xuất hiện khi bạn cảm nhận yêu cầu đặt lên mình lớn hơn nguồn lực đang có. Vì vậy có đúng ba chỗ để can thiệp, và bỏ sót chỗ nào cũng làm hỏng kết quả: cơ thể (hạ mức kích hoạt sinh lý), cách diễn giải (đánh giá lại mức đe doạ và nguồn lực thật sự có), và chính nguồn gây tải (thương lượng phạm vi, hạn, nhân sự). Kỹ thuật thư giãn mà không đụng tới nguồn tải chỉ giúp bạn chịu đựng lâu hơn một tình huống lẽ ra phải sửa.',
    why: {
      work:
        'Dưới căng thẳng kéo dài, chất lượng ra quyết định và khả năng nhớ chi tiết giảm rõ rệt, trong khi khối lượng sai sót cần sửa lại tăng — nghĩa là căng thẳng không kiểm soát tự tạo thêm việc cho chính nó.',
      interview:
        'Nhà tuyển dụng hỏi "bạn xử lý áp lực thế nào" để tìm phương pháp cụ thể chứ không phải lời tuyên bố chịu được áp lực. Người mô tả được cách mình phân loại tải và thương lượng phạm vi sẽ khác hẳn người nói "em quen làm việc cường độ cao".',
      study:
        'Lo lắng thi cử tiêu tốn đúng nguồn lực trí nhớ làm việc mà bài thi cần. Kỹ thuật hạ kích hoạt trước và trong lúc thi thường lấy lại được phần điểm bị mất do luống cuống, không phải do thiếu kiến thức.',
      life:
        'Căng thẳng kéo dài rò rỉ ra quan hệ gia đình dưới dạng cáu gắt và mất kiên nhẫn. Xử lý sớm bảo vệ những quan hệ mà bạn không muốn trả giá bằng chúng.',
    },
    framework: [
      {
        name: 'Ghi tải thực tế',
        detail:
          'Liệt kê mọi việc đang mở kèm hạn và người phụ thuộc, cộng thêm các dấu hiệu cơ thể trong tuần (giấc ngủ, đau đầu, tiêu hoá). Cảm giác quá tải thường mờ; danh sách viết ra thì hữu hạn và xử lý được.',
      },
      {
        name: 'Phân loại bốn cửa',
        detail:
          'Mỗi việc chỉ đi vào một trong bốn cửa: bỏ hẳn, thu nhỏ phạm vi, chuyển cho người khác, hoặc chấp nhận và làm. Cửa thứ tư chỉ dành cho việc đã qua ba cửa trước — nếu cái gì cũng vào cửa bốn thì bạn chưa thực sự phân loại.',
      },
      {
        name: 'Hạ kích hoạt trong ngày',
        detail:
          'Đặt vài điểm hồi phục ngắn có thật trong lịch: thở chậm 2 phút giữa hai cuộc họp, đi bộ 10 phút sau bữa trưa, rời màn hình mỗi 90 phút. Ngắn và đều có tác dụng hơn một buổi nghỉ dài vào cuối tuần.',
      },
      {
        name: 'Đánh giá lại đe doạ',
        detail:
          'Viết ra điều xấu nhất bạn đang sợ, xác suất ước tính, và nguồn lực bạn thật sự có nếu nó xảy ra. Phần lớn cường độ căng thẳng đến từ việc đánh giá thấp nguồn lực chứ không từ việc đánh giá cao rủi ro.',
      },
      {
        name: 'Thương lượng nguồn tải',
        detail:
          'Đưa cho người ra quyết định một lựa chọn có cấu trúc: "với nguồn lực hiện tại tôi giao được A và B đúng hạn; C cần dời một tuần hoặc cần thêm người — anh chọn phương án nào?" Nêu lựa chọn dễ được chấp nhận hơn nêu khó khăn.',
      },
    ],
    scenario:
      'Một kế toán tổng hợp bước vào tuần quyết toán quý với ba việc cùng hạn: báo cáo thuế, đối chiếu công nợ và một yêu cầu số liệu đột xuất từ ban giám đốc. Cô làm đến 23 giờ ba đêm liền và bắt đầu mắc lỗi nhập liệu, phải làm lại. Cô dừng lại và viết bảng tải: mỗi việc một dòng, có hạn thật, hậu quả nếu trễ, và ai đang chờ. Bảng cho thấy chỉ báo cáo thuế có hạn pháp lý không dời được; đối chiếu công nợ có thể thu hẹp phạm vi xuống nhóm khách hàng trên 100 triệu trong đợt này; yêu cầu đột xuất thực chất cần một con số tổng chứ không cần bản chi tiết. Cô gửi một tin nhắn năm dòng nêu hai phương án cho ban giám đốc và được duyệt trong 20 phút. Tuần đó cô về nhà trước 20 giờ bốn ngày, và số lỗi phải sửa lại giảm hẳn — cuộc trao đổi 20 phút có tác dụng hơn ba đêm thức.',
    comparison: [
      {
        weak: 'Phản ứng với quá tải bằng cách kéo dài giờ làm, coi thời gian là nguồn lực vô hạn duy nhất mình kiểm soát được.',
        mature:
          'Coi phạm vi, chất lượng, hạn và nhân sự đều là biến số có thể thương lượng, và đưa ra lựa chọn cho người quyết định thay vì âm thầm hy sinh giấc ngủ.',
      },
      {
        weak: 'Giữ toàn bộ danh sách việc trong đầu, nên lúc nào cũng có cảm giác mơ hồ rằng mình đang quên một thứ quan trọng.',
        mature:
          'Ghi ra hết thành danh sách hữu hạn có hạn và hậu quả, để nỗi lo chuyển từ dạng khuếch tán sang dạng có thể xử lý từng dòng.',
      },
      {
        weak: 'Chỉ dùng kỹ thuật thư giãn (thở, thiền, tập gym) trong khi nguồn tải vẫn nguyên vẹn, rồi kết luận rằng các kỹ thuật đó vô dụng.',
        mature:
          'Dùng kỹ thuật hạ kích hoạt để lấy lại khả năng suy nghĩ, rồi dùng chính khả năng đó để đi sửa nguồn tải — hai việc bổ sung nhau chứ không thay thế nhau.',
      },
    ],
    mistakes: [
      'Đợi đến cuối tuần mới hồi phục, trong khi cơ thể cần các quãng nghỉ ngắn rải trong ngày; hai ngày nghỉ không bù được năm ngày ở trạng thái kích hoạt liên tục.',
      'Dùng cà phê, thuốc lá hoặc rượu như công cụ điều tiết chính, khiến giấc ngủ xấu đi và tạo vòng xoáy: ngủ kém làm căng thẳng tăng, căng thẳng tăng lại làm ngủ kém hơn.',
      'Im lặng chịu tải vì sợ bị đánh giá là yếu, cho đến khi lỡ hạn thật — lúc đó tổn thất về uy tín lớn hơn nhiều so với việc báo sớm và đề xuất phương án.',
    ],
    worksheet: [
      'Liệt kê mọi việc đang mở của bạn kèm hạn thật và hậu quả nếu trễ. Có bao nhiêu việc trong đó thực sự có hậu quả nghiêm trọng?',
      'Với ba việc gây căng thẳng nhất, mỗi việc đi vào cửa nào: bỏ, thu nhỏ, chuyển giao hay chấp nhận? Ghi lý do một dòng cho mỗi lựa chọn.',
      'Trong tuần qua, cơ thể bạn đã báo hiệu gì (ngủ, ăn, đau mỏi, tần suất ốm vặt)? Ghi cụ thể số giờ ngủ trung bình thay vì "ngủ ít".',
      'Điều tệ nhất bạn đang sợ là gì, bạn ước tính xác suất bao nhiêu, và nếu nó xảy ra thì bạn có sẵn những nguồn lực nào (tiền, người, thời gian, kỹ năng)?',
      'Viết nguyên văn tin nhắn thương lượng bạn sẽ gửi cho người ra quyết định, trong đó nêu đúng hai phương án cụ thể để họ chọn.',
    ],
    exercises: [
      {
        label: 'Bảng tải một trang',
        text: 'Kẻ bảng năm cột: việc, hạn thật, hậu quả nếu trễ, ai đang chờ, cửa xử lý. Điền hết mọi việc đang mở, kể cả việc cá nhân. Đếm số việc có hậu quả nghiêm trọng thật sự.',
        level: 'e',
      },
      {
        label: 'Nhật ký cơ thể',
        text: 'Trong bảy ngày, ghi ba con số mỗi tối: giờ ngủ, mức căng thẳng 1–10, số quãng nghỉ thật sự rời màn hình. Cuối tuần vẽ chúng cạnh nhau để nhìn mối liên hệ.',
        level: 'e',
      },
      {
        label: 'Hai phút giữa họp',
        text: 'Đặt lịch chèn 2 phút thở chậm giữa các cuộc họp liên tiếp trong ba ngày. Ghi lại mức tỉnh táo trước và sau cuộc họp cuối ngày so với những ngày không làm.',
        level: 'e',
      },
      {
        label: 'Bốn cửa xử lý',
        text: 'Lấy 10 việc trong bảng tải và bắt buộc phân bổ: ít nhất một việc vào cửa "bỏ", một vào "thu nhỏ", một vào "chuyển giao". Thực hiện ba quyết định đó trong 48 giờ.',
        level: 'm',
      },
      {
        label: 'Kịch bản tệ nhất có số',
        text: 'Viết điều bạn sợ nhất, gán xác suất ước tính, liệt kê nguồn lực bạn có nếu nó xảy ra và bước đầu tiên bạn sẽ làm. Đọc lại sau một tuần và ghi xem ước tính có thay đổi không.',
        level: 'm',
      },
      {
        label: 'Tin nhắn hai phương án',
        text: 'Soạn và gửi thật một tin nhắn thương lượng phạm vi hoặc hạn, nêu đúng hai phương án kèm hệ quả của mỗi phương án. Ghi lại thời gian nhận phản hồi và kết quả.',
        level: 'm',
      },
      {
        label: 'Bảy ngày một quãng nghỉ có bảo vệ',
        text: 'Đặt một quãng 20 phút mỗi ngày không màn hình, không việc, và bảo vệ nó như một cuộc họp với khách hàng. Ghi lại số ngày giữ được và thứ đã lấn vào những ngày hỏng.',
        level: 'h',
      },
      {
        label: 'Rà soát nguồn tải hằng quý',
        text: 'Liệt kê mọi cam kết định kỳ (họp lặp, báo cáo, nhóm chat, việc ngoài giờ) và với mỗi cái hỏi: nếu dừng lại thì ai bị ảnh hưởng và ảnh hưởng thế nào. Đề xuất cắt hoặc gộp ít nhất hai cam kết và theo dõi hậu quả trong bốn tuần.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao chỉ tập thở và tập thể dục thường không đủ để giải quyết căng thẳng ở công việc?',
        a: 'Vì chúng chỉ tác động lên phần kích hoạt sinh lý, trong khi nguồn tải (khối lượng việc, hạn phi thực tế, thiếu người) vẫn nguyên. Chúng khôi phục khả năng suy nghĩ, nhưng phải dùng khả năng đó để thương lượng phạm vi thì tình trạng mới thay đổi.',
      },
      {
        q: 'Khi báo với quản lý rằng bạn quá tải, cách trình bày nào hiệu quả hơn?',
        a: 'Trình bày dưới dạng lựa chọn có hệ quả: nêu những gì giao được đúng hạn với nguồn lực hiện tại, việc nào phải dời hoặc thu nhỏ, và hai phương án để người kia chọn. Cách này chuyển cuộc trao đổi từ đánh giá cá nhân sang quyết định phân bổ nguồn lực.',
      },
      {
        q: 'Nghỉ ngắn rải trong ngày và nghỉ dài cuối tuần khác nhau thế nào về tác dụng?',
        a: 'Nghỉ ngắn ngăn mức kích hoạt tích tụ trong ngày, giữ chất lượng chú ý và giảm sai sót ngay tại thời điểm làm việc. Nghỉ dài cuối tuần có vai trò riêng nhưng không bù được cho năm ngày liên tục ở trạng thái căng, và thường bị chính sự mệt mỏi tích tụ làm hỏng.',
      },
    ],
    plan7:
      'Ngày 1: lập bảng tải một trang cho mọi việc đang mở. Ngày 2: phân bổ bốn cửa, bắt buộc có ít nhất một việc bị bỏ và một việc bị thu nhỏ. Ngày 3: thực hiện quyết định chuyển giao hoặc thu nhỏ đó và thông báo cho những người liên quan. Ngày 4: chèn hai điểm hồi phục ngắn vào lịch và giữ đúng. Ngày 5: viết kịch bản tệ nhất kèm xác suất và nguồn lực, đọc lại vào cuối ngày. Ngày 6: gửi một tin nhắn thương lượng hai phương án. Ngày 7: đối chiếu nhật ký giấc ngủ với mức căng thẳng cả tuần và chọn một thay đổi giữ cho tuần sau.',
    evidence:
      'Hiện vật ở đây là các quyết định phân bổ mà bạn đã tạo ra dưới áp lực: bảng tải kèm phương án bạn từng trình bày, tin nhắn thương lượng phạm vi và kết quả, hoặc một quy trình bạn dựng để cả nhóm báo tải sớm. Trong phỏng vấn, dùng cho câu về áp lực và ưu tiên: kể một tuần cụ thể có ba việc cùng hạn, cách bạn phân loại và điều bạn đã chủ động cắt, kèm kết quả đo được (đúng hạn phần quan trọng, số lỗi giảm, không phải làm lại). Nêu được thứ mình đã cắt là dấu hiệu bạn biết ưu tiên thật.',
    references: [
      { label: 'APA — chuyên mục Stress', url: 'https://www.apa.org/topics/stress', type: 'article' },
      { label: 'Greater Good Science Center — chuyên mục Mindfulness', url: 'https://greatergood.berkeley.edu/topic/mindfulness', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 11 · Phòng tránh kiệt sức — Burnout Prevention ─────────────────
  guide({
    thesis:
      'Burnout được Tổ chức Y tế Thế giới mô tả như một hiện tượng nghề nghiệp gắn với căng thẳng nơi làm việc kéo dài không được xử lý, biểu hiện ở ba mặt: cạn kiệt năng lượng, xa cách hoặc hoài nghi với công việc, và cảm giác hiệu quả nghề nghiệp giảm sút. Điều quan trọng cần nhớ: đây là vấn đề của mối quan hệ giữa người và điều kiện làm việc, nên phòng tránh phải can thiệp vào điều kiện — khối lượng, quyền kiểm soát, sự ghi nhận, sự công bằng, cộng đồng và ý nghĩa — chứ không chỉ vào cá nhân.',
    why: {
      work:
        'Kiệt sức không chỉ làm bạn mệt; nó làm giảm chất lượng phán đoán và khiến bạn rút khỏi những việc cần sự chủ động nhất. Đội mất người theo cách này thường mất luôn cả tri thức tích luỹ nhiều năm.',
      interview:
        'Khi được hỏi vì sao rời công việc trước hoặc vì sao có khoảng trống trong CV, người hiểu về kiệt sức trả lời được bằng ngôn ngữ điều kiện làm việc và những gì mình thay đổi sau đó, thay vì bằng lời than hoặc bằng việc giấu.',
      study:
        'Sinh viên và người vừa học vừa làm dễ rơi vào trạng thái này ở cuối kỳ kéo dài. Nhận ra sớm giúp điều chỉnh khối lượng đăng ký thay vì bỏ dở giữa chừng cả một học kỳ.',
      life:
        'Người chăm sóc người thân dài ngày cũng có nguy cơ tương tự. Thiết kế sẵn nhịp nghỉ và chia sẻ trách nhiệm là điều kiện để duy trì việc chăm sóc trong nhiều tháng chứ không chỉ vài tuần.',
    },
    framework: [
      {
        name: 'Đo ba trục',
        detail:
          'Hằng tháng tự chấm 1–10 trên ba trục: mức cạn kiệt, mức hoài nghi/xa cách, và cảm nhận về hiệu quả của mình. Xu hướng ba tháng quan trọng hơn con số một lần, vì kiệt sức là quá trình chứ không phải sự kiện.',
      },
      {
        name: 'Khoanh sáu yếu tố',
        detail:
          'Rà lần lượt: khối lượng việc, mức tự chủ, sự ghi nhận, sự công bằng, chất lượng quan hệ trong đội, và mức xung đột giữa công việc với giá trị của bạn. Xác định đúng yếu tố nào đang hỏng quyết định biện pháp — nghỉ phép không sửa được vấn đề công bằng.',
      },
      {
        name: 'Can thiệp sớm',
        detail:
          'Chọn một thay đổi có thể thực hiện trong hai tuần: trả lại một dự án, huỷ một báo cáo không ai dùng, xin quyền quyết định trong phạm vi của mình, hoặc đặt một ngày không họp. Hành động nhỏ nhưng chạm đúng yếu tố hơn là nghỉ dài rồi quay lại nguyên trạng.',
      },
      {
        name: 'Thiết kế lại nhịp',
        detail:
          'Dựng các ranh giới có thể quan sát được: giờ ngừng nhận tin nhắn công việc, một buổi mỗi tuần không họp, ngày nghỉ đã đặt trước từ đầu quý. Ranh giới chỉ tồn tại nếu nó được ghi vào lịch và người khác biết.',
      },
      {
        name: 'Đặt cảnh báo tái phát',
        detail:
          'Chọn 2–3 dấu hiệu sớm của riêng bạn (mất hứng với việc từng thích, cáu với đồng nghiệp, ngủ dậy vẫn mệt) và một hành động bắt buộc khi chúng xuất hiện trong hai tuần liên tiếp.',
      },
    ],
    scenario:
      'Một giáo viên chủ nhiệm dạy 22 tiết mỗi tuần cộng ba nhóm phụ huynh trên mạng xã hội bắt đầu thấy mình cáu với học sinh, làm hồ sơ đến khuya và mất hoàn toàn hứng thú với việc soạn bài — thứ trước đây cô thích nhất. Thay vì chỉ xin nghỉ vài ngày, cô rà sáu yếu tố và thấy hai điểm hỏng rõ nhất là khối lượng ngoài giờ và mức tự chủ (mọi việc đều phát sinh đột xuất qua tin nhắn). Cô thực hiện ba thay đổi trong hai tuần: thống nhất với ban giám hiệu chuyển hai nhóm phụ huynh sang một kênh thông báo có khung giờ trả lời 17–18 giờ; gộp việc chấm bài vào hai buổi cố định thay vì rải khắp tuần; và trả lại một hoạt động ngoại khoá cho giáo viên khác. Sau sáu tuần, điểm tự chấm trục "hoài nghi" của cô giảm từ 8 xuống 4. Cô cũng ghi hai dấu hiệu cảnh báo sớm cho riêng mình và quy ước: nếu cả hai xuất hiện hai tuần liền thì bắt buộc trao đổi với tổ trưởng, không đợi đến lúc kiệt.',
    comparison: [
      {
        weak: 'Xử lý kiệt sức bằng một kỳ nghỉ dài rồi quay lại đúng khối lượng và điều kiện cũ; triệu chứng trở lại sau vài tuần và người ta kết luận rằng "nghỉ cũng không ăn thua".',
        mature:
          'Dùng thời gian nghỉ để hồi phục, nhưng bắt buộc kèm ít nhất một thay đổi cấu trúc trong công việc trước khi quay lại, vì điều kiện không đổi thì kết quả không đổi.',
      },
      {
        weak: 'Coi kiệt sức là dấu hiệu của sự yếu đuối cá nhân, nên giấu và cố gồng cho đến khi buộc phải nghỉ dài ngày.',
        mature:
          'Coi nó là tín hiệu về sự mất cân đối giữa yêu cầu và nguồn lực, nên nêu sớm bằng ngôn ngữ công việc: khối lượng nào, quyền quyết định nào, và đề xuất gì.',
      },
      {
        weak: 'Chỉ đo bằng cảm giác "dạo này hơi mệt", nên không nhận ra xu hướng đi xuống kéo dài nhiều tháng.',
        mature:
          'Chấm ba trục hằng tháng và giữ lại số liệu, để phát hiện xu hướng và có dữ liệu cụ thể khi cần trao đổi với quản lý hoặc chuyên gia.',
      },
    ],
    mistakes: [
      'Nhầm kiệt sức với mệt thông thường: mệt thì ngủ bù một tuần là hồi, còn kiệt sức có thêm sự hoài nghi với công việc và cảm giác mình làm gì cũng không hiệu quả — hai dấu hiệu này không biến mất nhờ ngủ.',
      'Chỉ can thiệp vào cá nhân (thiền, thể thao, quản lý thời gian) trong khi nguyên nhân nằm ở khối lượng hoặc sự bất công trong phân công; điều này còn khiến người trong cuộc tự trách vì "đã cố mà vẫn không ổn".',
      'Bỏ qua ngưỡng y tế: xem nhẹ các dấu hiệu kéo dài như mất ngủ nhiều tuần, thay đổi cân nặng rõ rệt, mất hứng thú với mọi hoạt động — đây là lúc cần gặp bác sĩ hoặc chuyên gia sức khoẻ tâm thần chứ không phải lúc tự điều chỉnh lịch làm việc.',
    ],
    worksheet: [
      'Tự chấm 1–10 ba trục hôm nay: cạn kiệt, hoài nghi/xa cách với công việc, cảm nhận hiệu quả. Ghi ngày để tháng sau chấm lại và so.',
      'Trong sáu yếu tố (khối lượng, tự chủ, ghi nhận, công bằng, cộng đồng, giá trị), hai yếu tố nào đang hỏng nhất với bạn? Viết một ví dụ cụ thể cho mỗi cái.',
      'Việc gì trong lịch tuần của bạn không ai thực sự dùng đến kết quả? Kiểm bằng cách hỏi thẳng người nhận, đừng phỏng đoán.',
      'Bạn có ranh giới nào đang tồn tại trên thực tế (không phải trong ý định)? Ghi giờ cụ thể và cách người khác biết về nó.',
      'Hai dấu hiệu cảnh báo sớm của riêng bạn là gì, và hành động bắt buộc khi cả hai xuất hiện trong hai tuần liên tiếp là gì — nói chuyện với ai, cắt việc gì?',
    ],
    exercises: [
      {
        label: 'Ba trục hằng tháng',
        text: 'Tạo một bảng ghi ba điểm số mỗi tháng cùng một ngày cố định, kèm một dòng ghi chú bối cảnh. Sau ba tháng, nhìn xu hướng thay vì nhìn từng con số.',
        level: 'e',
      },
      {
        label: 'Bản đồ sáu yếu tố',
        text: 'Viết sáu yếu tố lên giấy và chấm mỗi yếu tố từ 1–5 theo trải nghiệm ba tháng qua, kèm một ví dụ cụ thể. Khoanh yếu tố thấp nhất — đó là chỗ can thiệp có hiệu quả nhất.',
        level: 'e',
      },
      {
        label: 'Săn việc không ai dùng',
        text: 'Chọn ba báo cáo hoặc cuộc họp định kỳ bạn tham gia và hỏi người nhận: kết quả này anh dùng vào việc gì, lần gần nhất là khi nào. Ghi câu trả lời nguyên văn.',
        level: 'e',
      },
      {
        label: 'Một ranh giới có thể quan sát',
        text: 'Đặt một ranh giới cụ thể trong hai tuần (không trả lời tin nhắn công việc sau 20 giờ, một buổi không họp mỗi tuần), thông báo cho những người liên quan và ghi lại số lần bị phá cùng lý do.',
        level: 'm',
      },
      {
        label: 'Đề xuất thay đổi khối lượng',
        text: 'Soạn một đề xuất ngắn cho quản lý gồm: danh sách việc đang gánh, đề xuất trả lại hoặc chuyển giao một việc, và lợi ích cho đội nếu làm vậy. Trình bày và ghi lại phản hồi.',
        level: 'm',
      },
      {
        label: 'Khôi phục một nguồn ý nghĩa',
        text: 'Xác định phần công việc từng khiến bạn thấy có ý nghĩa nhưng nay đã biến mất khỏi lịch. Sắp xếp để dành ít nhất hai giờ mỗi tuần cho nó trong bốn tuần, rồi chấm lại trục hoài nghi.',
        level: 'm',
      },
      {
        label: 'Bảy ngày tách rời thật sự',
        text: 'Trong 7 ngày, mỗi ngày có ít nhất 90 phút hoàn toàn không tiếp xúc kênh công việc (điện thoại để chế độ không làm phiền, ứng dụng công việc đăng xuất). Ghi lại điều gì thực sự đã hỏng vì bạn vắng mặt 90 phút đó.',
        level: 'h',
      },
      {
        label: 'Kế hoạch phòng tái phát',
        text: 'Viết một trang gồm: hai dấu hiệu cảnh báo sớm, ngưỡng kích hoạt, ba hành động bắt buộc theo thứ tự, người bạn sẽ báo, và ngưỡng cần tìm hỗ trợ chuyên môn. Chia sẻ với một người tin cậy để họ nhắc bạn khi bạn không tự nhận ra.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Kiệt sức khác mệt mỏi thông thường ở điểm nào?',
        a: 'Mệt thông thường chủ yếu là cạn năng lượng và hồi phục được sau khi ngủ bù, nghỉ ngơi. Kiệt sức kèm thêm sự xa cách hoặc hoài nghi với chính công việc và cảm giác hiệu quả nghề nghiệp suy giảm — hai thành phần này không mất đi nhờ nghỉ nếu điều kiện làm việc giữ nguyên.',
      },
      {
        q: 'Vì sao các biện pháp chỉ nhắm vào cá nhân thường không đủ?',
        a: 'Vì nguyên nhân thường nằm ở điều kiện: khối lượng quá tải kéo dài, thiếu quyền tự chủ, phân công bất công, mâu thuẫn với giá trị cá nhân. Kỹ thuật cá nhân giúp chịu đựng tốt hơn nhưng không thay đổi các biến số đó, và còn dễ khiến người trong cuộc tự trách khi vẫn không khá lên.',
      },
      {
        q: 'Khi nào nên chuyển từ tự điều chỉnh sang tìm hỗ trợ chuyên môn?',
        a: 'Khi các dấu hiệu kéo dài nhiều tuần và ảnh hưởng tới giấc ngủ, ăn uống, sức khoẻ thể chất hoặc khiến bạn mất hứng thú với mọi hoạt động kể cả ngoài công việc — hoặc bất cứ khi nào bạn có ý nghĩ làm hại bản thân. Đây là lúc cần bác sĩ hoặc chuyên gia sức khoẻ tâm thần; nội dung trong sách chỉ mang tính giáo dục phổ thông.',
      },
    ],
    plan7:
      'Ngày 1: chấm ba trục và ghi ngày làm mốc. Ngày 2: lập bản đồ sáu yếu tố, khoanh yếu tố thấp nhất kèm ví dụ cụ thể. Ngày 3: hỏi ba người nhận xem kết quả công việc định kỳ của bạn có thực sự được dùng không. Ngày 4: chọn một việc để trả lại hoặc huỷ, và thông báo. Ngày 5: đặt một ranh giới quan sát được và cho những người liên quan biết. Ngày 6: dành hai giờ cho phần công việc từng có ý nghĩa với bạn. Ngày 7: viết kế hoạch phòng tái phát một trang, kèm ngưỡng cần tìm hỗ trợ chuyên môn, và chia sẻ với một người tin cậy.',
    evidence:
      'Với vai trò quản lý hoặc trưởng nhóm, bằng chứng mạnh nhất là các thay đổi bạn tạo ra cho người khác chứ không chỉ cho mình: bỏ một loại báo cáo không ai dùng, đặt quy ước giờ nhắn tin, phân bổ lại khối lượng và có số liệu về tỷ lệ nghỉ việc hoặc chất lượng trước–sau. Với vai trò cá nhân, đây là cách trả lời trung thực và chuyên nghiệp cho câu hỏi về khoảng trống trong CV hoặc lý do rời việc: mô tả bằng ngôn ngữ điều kiện làm việc, nêu điều bạn đã thử thay đổi, và những ranh giới bạn dựng để làm việc bền hơn ở nơi mới.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Burnout', url: 'https://hbr.org/topic/subject/burnout', type: 'article' },
      { label: 'APA — chuyên mục Stress tại nơi làm việc', url: 'https://www.apa.org/topics/stress', type: 'article' },
    ],
    diagram: 'flow',
  }),

  // ── Chương 12 · Xây dựng thói quen ────────────────────────────────────────
  guide({
    thesis:
      'Thói quen là hành vi được kích hoạt bởi bối cảnh và ngày càng ít cần cân nhắc sau mỗi lần lặp. Vì thế cách đáng tin để có một thói quen mới không phải là tăng quyết tâm mà là thiết kế ba thứ: một tín hiệu luôn xuất hiện, một hành vi nhỏ tới mức không cần thương lượng với bản thân, và một phần thưởng đủ gần để bộ não nối được nhân với quả. Bỏ một thói quen cũ đi theo cùng logic ngược lại: xoá tín hiệu, tăng ma sát, và cấy một hành vi thay thế vào đúng chỗ trống.',
    why: {
      work:
        'Những việc tạo ra khác biệt dài hạn — viết tài liệu, dọn nợ kỹ thuật, ghi lại quyết định, hỏi thăm khách hàng cũ — đều là việc không ai nhắc. Chỉ khi chúng thành thói quen gắn với một tín hiệu cố định thì chúng mới tồn tại qua các tuần bận.',
      interview:
        'Thói quen để lại dấu vết đều đặn có thể kiểm chứng: chuỗi bài viết, lịch sử đóng góp, sổ ghi chép nhiều tháng. Đây là loại bằng chứng khó ngụy tạo và nói nhiều về bạn hơn một dòng tự nhận xét.',
      study:
        'Trí nhớ dài hạn cần lặp lại giãn cách, mà lặp lại giãn cách chỉ khả thi khi việc ôn nằm trong một khung cố định hằng ngày thay vì phụ thuộc vào việc bạn có nhớ ra hay không.',
      life:
        'Sức khoẻ, tiền tiết kiệm và các quan hệ thân thiết đều là kết quả cộng dồn của những hành vi nhỏ lặp lại, không phải kết quả của vài quyết định lớn. Đây chính là địa hạt của thói quen.',
    },
    framework: [
      {
        name: 'Định nghĩa bằng động từ',
        detail:
          'Viết hành vi ở dạng quan sát được và nhỏ tới mức khó từ chối: "mở sổ và viết ba dòng" chứ không phải "viết nhật ký đều đặn". Mong muốn không phải là hành vi, và chỉ hành vi mới lặp được.',
      },
      {
        name: 'Neo vào tín hiệu',
        detail:
          'Gắn hành vi mới ngay sau một việc bạn đã làm ổn định hằng ngày (pha cà phê xong, đóng laptop, đánh răng). Tín hiệu tốt là tín hiệu tự xuất hiện mà không cần bạn nhớ.',
      },
      {
        name: 'Sửa môi trường trước',
        detail:
          'Đặt thứ cần dùng vào tầm với và đẩy cám dỗ ra xa thêm vài bước: sách trên gối, giày cạnh cửa, điện thoại sạc ngoài phòng, gỡ ứng dụng khỏi màn hình chính. Mỗi bước ma sát đều có giá.',
      },
      {
        name: 'Phần thưởng ngay',
        detail:
          'Thêm một tín hiệu hoàn thành ngay lập tức: tô ô trên lịch, gạch một dòng, hoặc một khoảnh khắc dễ chịu ngay sau đó. Phần thưởng xa vài tháng không đủ để hình thành thói quen.',
      },
      {
        name: 'Nâng cấp có điều kiện',
        detail:
          'Chỉ tăng độ khó khi hành vi đã đều ít nhất hai tuần. Tăng sớm là nguyên nhân phổ biến nhất khiến một thói quen mới chết ở tuần thứ ba.',
      },
    ],
    scenario:
      'Một nhân viên kinh doanh nhận ra mỗi sáng mở laptop là mở mạng xã hội và mất 40 phút trước khi làm việc thật. Anh không đặt mục tiêu "bớt dùng mạng xã hội" mà xử lý theo chuỗi tín hiệu. Tín hiệu là màn hình đăng nhập trống, nên anh đổi màn hình nền thành một danh sách ba việc của ngày và đặt trình duyệt mặc định mở thẳng vào CRM. Anh tăng ma sát: đăng xuất tài khoản mạng xã hội trên máy tính và gỡ ứng dụng khỏi màn hình chính điện thoại, giữ lại quyền truy cập nhưng thêm ba bước. Chỗ trống được cấy hành vi thay thế: 10 phút gọi lại cho hai khách hàng cũ, ngay sau khi ngồi xuống. Phần thưởng gần là gạch tên khách vào một tờ giấy dán cạnh màn hình. Sau bốn tuần, thời gian dùng mạng xã hội buổi sáng gần như biến mất, nhưng điểm đáng chú ý là anh không hề dùng ý chí — anh chỉ đổi thứ xuất hiện đầu tiên trước mắt mình.',
    comparison: [
      {
        weak: 'Bắt đầu bằng phiên bản lớn của hành vi: chạy 5km ngay ngày đầu, viết 1000 chữ mỗi tối — tạo cảm giác nghiêm túc nhưng chết sau vài ngày.',
        mature:
          'Bắt đầu bằng phiên bản nhỏ đến mức buồn cười và giữ nó qua 14 ngày trước khi tăng, vì mục tiêu giai đoạn đầu là gắn tín hiệu với hành vi chứ không phải tạo khối lượng.',
      },
      {
        weak: 'Chống lại thói quen xấu bằng cách nhắc bản thân không được làm, trong khi tín hiệu kích hoạt vẫn nằm nguyên trước mắt.',
        mature:
          'Xoá hoặc thay tín hiệu và cấy một hành vi thay thế vào đúng khoảnh khắc đó — chỗ trống bỏ không thì hành vi cũ sẽ quay lại lấp.',
      },
      {
        weak: 'Đo bằng cảm giác: "dạo này mình đọc nhiều hơn" — không kiểm chứng được và dễ tự huyễn hoặc.',
        mature:
          'Đo bằng dấu vết vật lý: ô đã tô, số buổi, số trang; dữ liệu này cũng cho biết bạn thường trượt vào ngày nào trong tuần để mà sửa.',
      },
    ],
    mistakes: [
      'Khởi động bốn thói quen cùng lúc vào đầu năm; chúng cạnh tranh một quỹ chú ý hạn hẹp và thường cùng tắt trong vòng ba tuần, để lại kết luận sai rằng bản thân không đủ nghị lực.',
      'Chọn tín hiệu là một thời điểm trừu tượng ("buổi tối") thay vì một sự kiện cụ thể ("ngay sau khi rửa bát"), khiến hành vi phụ thuộc vào việc bạn tình cờ nhớ ra.',
      'Coi một ngày lỡ là chuỗi đã hỏng rồi bỏ luôn; trong khi tác động của một ngày lỡ gần như bằng không, còn tác động của việc bỏ hẳn thì rất lớn.',
    ],
    worksheet: [
      'Viết thói quen bạn muốn có dưới dạng một câu duy nhất: "Sau khi [tín hiệu có sẵn], tôi sẽ [hành vi nhỏ] ở [địa điểm]".',
      'Hành vi đó nhỏ đến mức nào? Nếu hôm nay bạn ốm nhẹ và bận, bạn có làm nổi không? Nếu không, hãy cắt nó nhỏ thêm một nửa.',
      'Ba thứ nào trong môi trường hiện tại đang cản trở hành vi này? Với mỗi thứ, viết một thay đổi vật lý cụ thể (di chuyển đồ vật, đổi cài đặt, đổi chỗ ngồi).',
      'Thói quen cũ nào bạn muốn bỏ? Tín hiệu kích hoạt nó là gì, và hành vi nào bạn sẽ cấy vào đúng khoảnh khắc đó để thay thế?',
      'Bạn ghi dấu hoàn thành ở đâu để nhìn thấy hằng ngày, và quy tắc của bạn khi lỡ một ngày là gì (viết trước để lúc lỡ không phải nghĩ)?',
    ],
    exercises: [
      {
        label: 'Câu công thức',
        text: 'Viết ba thói quen muốn có theo mẫu "sau khi X, tôi sẽ Y ở Z". Đọc lại và kiểm: X có tự xuất hiện hằng ngày không, Y có nhỏ hơn 2 phút không, Z có cụ thể không.',
        level: 'e',
      },
      {
        label: 'Đếm bước ma sát',
        text: 'Với một hành vi bạn muốn làm nhiều hơn và một hành vi muốn làm ít hơn, đếm số thao tác cần để bắt đầu mỗi cái. Sắp xếp lại đồ đạc và cài đặt để chênh lệch đảo chiều ít nhất ba bước.',
        level: 'e',
      },
      {
        label: 'Lịch tô ô',
        text: 'In hoặc vẽ lịch bốn tuần và dán ở nơi bạn đi qua nhiều lần mỗi ngày. Tô ô ngay sau khi làm xong, không tô trước, không tô bù.',
        level: 'e',
      },
      {
        label: 'Truy tín hiệu của thói quen xấu',
        text: 'Trong ba ngày, mỗi lần rơi vào thói quen muốn bỏ hãy ghi ngay: đang ở đâu, vừa làm gì xong, cảm thấy gì. Sau ba ngày, tìm tín hiệu lặp nhiều nhất và xử lý đúng nó.',
        level: 'm',
      },
      {
        label: 'Cấy hành vi thay thế',
        text: 'Chọn một hành vi thay thế cho đúng khoảnh khắc trống mà thói quen cũ để lại, và làm nó trong hai tuần. Ghi lại số lần thay thế thành công so với số lần tín hiệu xuất hiện.',
        level: 'm',
      },
      {
        label: 'Ngày lỡ có quy trình',
        text: 'Viết trước quy tắc phục hồi khi lỡ (không bao giờ lỡ hai ngày liền; hôm sau chỉ làm mức tối thiểu). Cố ý bỏ một ngày trong tuần này để tập chính quy trình quay lại, và ghi lại cảm giác.',
        level: 'm',
      },
      {
        label: 'Bảy ngày một thói quen duy nhất',
        text: 'Chọn đúng một thói quen và chạy bảy ngày liên tiếp ở mức nhỏ nhất, mỗi ngày ghi ba thông tin: tín hiệu có xuất hiện không, bạn làm sau bao lâu, có gì cản trở. Ngày 7 sửa một yếu tố trong thiết kế.',
        level: 'h',
      },
      {
        label: 'Chuỗi thói quen buổi sáng',
        text: 'Thiết kế một chuỗi 3–4 hành vi nối tiếp nhau, mỗi hành vi là tín hiệu của hành vi sau, tổng cộng dưới 20 phút. Chạy bốn tuần và ghi tỷ lệ hoàn thành từng mắt xích để tìm mắt xích hay đứt nhất.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao "sau khi rửa bát xong" là tín hiệu tốt hơn "buổi tối"?',
        a: 'Vì nó là một sự kiện cụ thể, tự xuất hiện và có ranh giới rõ ràng, nên bạn không cần nhớ hay quyết định gì thêm. "Buổi tối" là một khoảng thời gian trừu tượng, khiến hành vi phụ thuộc vào việc bạn tình cờ nghĩ ra vào lúc còn năng lượng.',
      },
      {
        q: 'Bạn đã có chuỗi 20 ngày rồi lỡ một ngày. Điều đúng cần làm là gì?',
        a: 'Quay lại ngay hôm sau ở mức tối thiểu và giữ nguyên tắc không lỡ hai ngày liên tiếp. Một ngày lỡ hầu như không ảnh hưởng tới kết quả tích luỹ; thứ gây thiệt hại là việc coi chuỗi đã hỏng rồi bỏ hẳn.',
      },
      {
        q: 'Muốn bỏ một thói quen xấu, vì sao chỉ "quyết tâm không làm nữa" thường thất bại?',
        a: 'Vì tín hiệu kích hoạt vẫn còn và khoảnh khắc trống vẫn còn, nên hành vi cũ được gợi lại mỗi ngày và bạn phải trả chi phí kháng cự liên tục. Cách bền hơn là xoá hoặc đổi tín hiệu, tăng ma sát vật lý, và cấy một hành vi thay thế vào đúng chỗ trống đó.',
      },
    ],
    plan7:
      'Ngày 1: viết câu công thức "sau khi X, tôi sẽ Y ở Z" và cắt Y xuống dưới hai phút. Ngày 2: sắp xếp lại môi trường để chênh lệch ma sát đảo chiều ít nhất ba bước. Ngày 3: dán lịch tô ô ở nơi đi qua nhiều lần và tô ô đầu tiên. Ngày 4: ghi tín hiệu của thói quen bạn muốn bỏ trong cả ngày. Ngày 5: cấy hành vi thay thế vào đúng khoảnh khắc trống đó. Ngày 6: viết trước quy tắc phục hồi khi lỡ và thử vận hành nó. Ngày 7: xem lại bảy ô đã tô, sửa đúng một yếu tố (tín hiệu, kích thước hành vi, hoặc môi trường) cho bốn tuần tới.',
    evidence:
      'Thói quen là kỹ năng dễ chứng minh nhất bằng hiện vật vì nó để lại chuỗi: lịch tô ô nhiều tuần, sổ ghi chép liên tục, chuỗi bài viết hằng tuần, lịch sử luyện tập. Hãy chụp lại hoặc lưu bản gốc kèm mốc thời gian. Trong phỏng vấn, dùng nó cho câu "bạn tự học hoặc tự cải thiện như thế nào": mô tả hệ thống bạn thiết kế (tín hiệu, hành vi tối thiểu, cách đo), tỷ lệ hoàn thành thật kể cả các tuần trượt, và một điều bạn đã sửa trong thiết kế sau khi phát hiện mắt xích hay đứt.',
    references: [
      { label: 'James Clear — Habits: hướng dẫn về tín hiệu, hành vi và môi trường', url: 'https://jamesclear.com/habits', type: 'article' },
      { label: 'James Clear — Atomic Habits', url: 'https://jamesclear.com/atomic-habits', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 13 · Sức khỏe thể chất phục vụ hiệu suất ───────────────────────
  guide({
    thesis:
      'Khả năng chú ý, ghi nhớ và điều chỉnh cảm xúc đều chạy trên một cơ thể có giới hạn sinh học. Giấc ngủ, vận động, ăn uống và các quãng nghỉ không phải phần thưởng dành cho người đã làm xong việc — chúng là hạ tầng quyết định chất lượng của phần việc đó. Chương này chỉ bàn kiến thức phổ thông ở mức hành vi hằng ngày; mọi triệu chứng kéo dài hoặc quyết định liên quan tới thuốc men, bệnh lý, chế độ ăn đặc biệt đều cần bác sĩ hoặc chuyên gia dinh dưỡng.',
    why: {
      work:
        'Sau một đêm ngủ kém, thứ hỏng trước tiên là khả năng giữ nhiều thông tin trong đầu cùng lúc và khả năng kìm phản ứng — đúng hai thứ mà việc phức tạp và các cuộc trao đổi khó cần nhất.',
      interview:
        'Phỏng vấn là 45–90 phút tập trung cao độ vào buổi sáng hoặc cuối chiều. Chuẩn bị thể chất cho ngày đó (ngủ đủ hai đêm trước, ăn nhẹ trước giờ, đi bộ ngắn) thường tạo khác biệt lớn hơn việc thức khuya ôn thêm.',
      study:
        'Củng cố trí nhớ diễn ra mạnh trong giấc ngủ, nên đánh đổi giờ ngủ để học thêm thường là một giao dịch lỗ: bạn nạp thêm nhưng giữ lại được ít hơn.',
      life:
        'Mức năng lượng buổi tối quyết định phần lớn chất lượng thời gian bạn dành cho gia đình. Nhiều "vấn đề quan hệ" thực chất là vấn đề kiệt sức thể chất lặp lại mỗi tối.',
    },
    framework: [
      {
        name: 'Đo nền hai tuần',
        detail:
          'Ghi bốn con số mỗi ngày: giờ đi ngủ, giờ dậy, mức tỉnh táo buổi chiều (1–10), số phút vận động. Đo trước khi đổi bất cứ thứ gì, nếu không bạn sẽ không biết thay đổi có tác dụng hay chỉ là cảm giác.',
      },
      {
        name: 'Chọn đúng một đòn bẩy',
        detail:
          'Với đa số người làm việc trí óc, đòn bẩy lớn nhất là sự ổn định của giờ ngủ và giờ dậy, không phải tổng số giờ. Sửa một yếu tố mỗi lần để biết yếu tố nào tạo ra thay đổi.',
      },
      {
        name: 'Gắn vào lịch',
        detail:
          'Đặt các mốc cụ thể: giờ tắt màn hình, giờ cà phê cuối cùng trong ngày, thời điểm đi bộ, khung giờ ăn. Một mốc trong lịch có sức nặng khác hẳn một dự định.',
      },
      {
        name: 'Nghỉ theo nhịp làm việc',
        detail:
          'Chèn quãng nghỉ ngắn giữa các khối tập trung, và trong quãng đó thực sự rời màn hình. Nghỉ mà vẫn cuộn điện thoại thì hệ thống chú ý không được hồi phục.',
      },
      {
        name: 'Đọc theo xu hướng',
        detail:
          'Đánh giá sau tối thiểu hai tuần và nhìn đường xu hướng. Một ngày tệ có thể do rất nhiều nguyên nhân ngẫu nhiên và không nói được gì về hiệu quả của thay đổi.',
      },
    ],
    scenario:
      'Một chuyên viên vận hành hệ thống trực theo ca ngủ trung bình 5,5 giờ và bù bằng bốn ly cà phê rải đến 17 giờ, rồi lại khó vào giấc trước 1 giờ sáng. Anh đo nền hai tuần và thấy điều bất ngờ: những ngày tỉnh táo nhất không phải ngày ngủ nhiều nhất, mà là ngày giờ dậy ổn định. Anh đổi đúng ba thứ, mỗi thứ cách nhau một tuần để biết cái nào có tác dụng: (1) giữ giờ dậy cố định kể cả cuối tuần, chênh không quá 60 phút; (2) ly cà phê cuối cùng trước 12 giờ trưa; (3) đi bộ 15 phút ngoài trời sau bữa trưa. Sau sáu tuần, giờ vào giấc sớm hơn khoảng một tiếng và điểm tỉnh táo buổi chiều tăng từ trung bình 4 lên 7. Với các ca đêm không tránh được, anh không cố "ngủ bù cho hết" mà lên lịch một giấc ngắn cố định trước ca và giữ nguyên giờ dậy vào ngày sau ca.',
    comparison: [
      {
        weak: 'Coi giấc ngủ là biến số linh hoạt nhất, nên mỗi khi thiếu thời gian thì cắt ngủ trước tiên.',
        mature:
          'Coi giấc ngủ là ràng buộc cố định và điều chỉnh khối lượng công việc quanh nó, vì hiệu suất mất đi do thiếu ngủ thường lớn hơn số giờ vay được.',
      },
      {
        weak: 'Đổi năm thứ cùng lúc (bỏ cà phê, tập gym, ăn kiêng, thiền, dậy sớm) rồi không biết thứ nào có tác dụng và bỏ tất cả sau hai tuần.',
        mature:
          'Đổi một yếu tố mỗi lần với thời gian quan sát tối thiểu hai tuần, giữ nguyên cách đo, và chỉ giữ lại những thay đổi có dữ liệu ủng hộ.',
      },
      {
        weak: 'Xử lý cơn buồn ngủ buổi chiều bằng thêm cà phê và đồ ngọt, tạo vòng lặp làm giấc ngủ đêm xấu đi.',
        mature:
          'Xử lý bằng ánh sáng ngoài trời, vận động ngắn và điều chỉnh giờ cà phê cuối ngày, đồng thời chấp nhận rằng cơn buồn ngủ chiều là hiện tượng bình thường cần được lên lịch chứ không cần bị đè.',
      },
    ],
    mistakes: [
      'Đặt mục tiêu vận động theo hình mẫu của người khác (chạy 10km, tập 6 buổi/tuần) thay vì theo mức duy trì được suốt nhiều tháng; kết quả là chấn thương hoặc bỏ cuộc trong tháng đầu.',
      'Tự chẩn đoán và tự dùng thực phẩm chức năng cho các triệu chứng kéo dài như mất ngủ, mệt mỏi mạn tính, đau đầu thường xuyên — trong khi đây là những dấu hiệu cần được bác sĩ đánh giá.',
      'Đánh giá một thay đổi chỉ sau hai ba ngày rồi kết luận nó không có tác dụng, trong khi cơ thể cần vài tuần để điều chỉnh và dữ liệu ngắn ngày bị nhiễu rất mạnh.',
    ],
    worksheet: [
      'Bảy ngày qua bạn đi ngủ và thức dậy lúc mấy giờ? Ghi số thật; độ dao động giữa các ngày là bao nhiêu phút?',
      'Vào những ngày bạn làm việc hiệu quả nhất tháng này, ba yếu tố nào khác biệt (giờ dậy, bữa sáng, vận động, khối lượng họp)?',
      'Ly cà phê hoặc trà cuối cùng của bạn thường vào lúc nào, và bạn mất bao lâu để vào giấc vào những ngày đó?',
      'Trong một ngày làm việc điển hình, bạn rời màn hình thật sự mấy lần và mỗi lần bao lâu? Ghi con số, không ghi ước lượng lạc quan.',
      'Một đòn bẩy duy nhất bạn sẽ thay đổi trong hai tuần tới là gì, bạn đo nó bằng chỉ số nào, và ngày nào bạn sẽ đánh giá?',
    ],
    exercises: [
      {
        label: 'Bảng bốn số',
        text: 'Trong 14 ngày, ghi bốn con số mỗi ngày: giờ ngủ, giờ dậy, điểm tỉnh táo buổi chiều, phút vận động. Không thay đổi gì trong giai đoạn này — đây là đường nền để so sánh.',
        level: 'e',
      },
      {
        label: 'Cố định giờ dậy',
        text: 'Chọn một giờ dậy và giữ nó bảy ngày liên tiếp, chênh không quá 30–60 phút kể cả ngày nghỉ. Ghi lại thời gian vào giấc mỗi tối để xem nó dịch chuyển thế nào.',
        level: 'e',
      },
      {
        label: 'Dịch giờ cà phê',
        text: 'Chuyển toàn bộ đồ uống có caffeine về trước buổi trưa trong 10 ngày, giữ nguyên tổng lượng. So thời gian vào giấc và điểm tỉnh táo chiều với đường nền.',
        level: 'e',
      },
      {
        label: 'Nghỉ rời màn hình',
        text: 'Chèn bốn quãng 5–10 phút không màn hình vào ngày làm việc, tốt nhất là ra ngoài trời hoặc đi lại. Ghi điểm tỉnh táo cuối ngày và so với những ngày không làm.',
        level: 'm',
      },
      {
        label: 'Vận động mức duy trì được',
        text: 'Chọn mức vận động bạn chắc chắn giữ được ba tháng (ví dụ đi bộ nhanh 20 phút, ba buổi mỗi tuần) và chạy bốn tuần, ghi số buổi thực hiện. Chỉ tăng khi đạt trên 80% số buổi kế hoạch.',
        level: 'm',
      },
      {
        label: 'Bữa ăn và đường năng lượng',
        text: 'Trong bảy ngày, ghi bữa trưa và điểm tỉnh táo lúc 15 giờ. Tìm mối liên hệ giữa loại bữa trưa và mức tụt năng lượng buổi chiều, rồi thử đổi một thành phần trong tuần sau.',
        level: 'm',
      },
      {
        label: 'Bảy ngày tắt màn hình sớm',
        text: 'Đặt giờ tắt màn hình cố định trước khi ngủ 45–60 phút trong bảy ngày, và chuẩn bị sẵn hoạt động thay thế (đọc sách giấy, chuẩn bị đồ cho hôm sau). Ghi thời gian vào giấc và số lần thức giấc.',
        level: 'h',
      },
      {
        label: 'Thí nghiệm một biến trong 6 tuần',
        text: 'Chọn một đòn bẩy duy nhất, giữ mọi thứ khác không đổi, chạy 6 tuần và ghi cùng bốn chỉ số. Cuối kỳ vẽ đường xu hướng và viết kết luận có điều kiện, kèm ghi chú về những yếu tố nhiễu bạn không kiểm soát được.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao đổi nhiều thói quen sức khoẻ cùng lúc lại khó rút ra kết luận?',
        a: 'Vì khi có nhiều biến thay đổi đồng thời, bạn không thể quy kết cải thiện hay xấu đi cho yếu tố nào. Đổi một yếu tố mỗi lần với ít nhất hai tuần quan sát và cách đo không đổi mới cho phép bạn giữ lại đúng thứ có tác dụng.',
      },
      {
        q: 'Học thêm hai giờ bằng cách ngủ ít đi hai giờ có phải một giao dịch có lợi không?',
        a: 'Thường là không, vì việc củng cố trí nhớ diễn ra mạnh trong giấc ngủ và khả năng tập trung ngày hôm sau giảm rõ. Bạn nạp thêm tài liệu nhưng giữ lại được ít hơn và làm chậm hơn — hiệu quả ròng thường âm, trừ những tình huống hạn chót thật sự không thể dời.',
      },
      {
        q: 'Khi nào các dấu hiệu về sức khoẻ vượt quá phạm vi tự điều chỉnh?',
        a: 'Khi triệu chứng kéo dài nhiều tuần và không cải thiện dù đã điều chỉnh sinh hoạt: mất ngủ dai dẳng, mệt mỏi bất thường, đau kéo dài, thay đổi cân nặng rõ rệt, hoặc bất kỳ dấu hiệu nào khiến bạn lo lắng. Lúc đó cần khám bác sĩ, không nên tự tra cứu và tự dùng sản phẩm bổ sung.',
      },
    ],
    plan7:
      'Ngày 1: bắt đầu bảng bốn số và không đổi gì khác. Ngày 2: chọn một giờ dậy cố định và giữ từ hôm nay. Ngày 3: dời toàn bộ caffeine về trước trưa. Ngày 4: chèn bốn quãng nghỉ rời màn hình vào lịch làm việc. Ngày 5: đi bộ 15–20 phút ngoài trời sau bữa trưa và ghi điểm tỉnh táo lúc 15 giờ. Ngày 6: đặt giờ tắt màn hình trước ngủ và chuẩn bị hoạt động thay thế. Ngày 7: nhìn lại bảy dòng dữ liệu, chọn đúng một đòn bẩy để chạy tiếp trong sáu tuần và đặt lịch đánh giá.',
    evidence:
      'Ở đây bằng chứng phục vụ chính bạn nhiều hơn nhà tuyển dụng, nhưng vẫn có chỗ dùng được: khi trả lời câu hỏi về cách bạn duy trì hiệu suất trong giai đoạn cao điểm, hãy mô tả hệ thống cụ thể (đo nền, đổi một biến, chỉ số theo dõi) thay vì nói mình khoẻ và chịu được áp lực. Nếu bạn ở vai trò quản lý, bằng chứng mạnh hơn là những gì bạn thiết kế cho đội: khung giờ không họp, quy ước về tin nhắn ngoài giờ, lịch trực xoay ca có tính đến hồi phục — kèm chỉ số trước–sau về sai sót hoặc tỷ lệ nghỉ việc.',
    references: [
      { label: 'NHS — Exercise: lợi ích và hướng dẫn vận động thể chất', url: 'https://www.nhs.uk/live-well/exercise/', type: 'article' },
      { label: 'APA — chuyên mục Sleep', url: 'https://www.apa.org/topics/sleep', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 14 · Đạo đức, chính trực và trách nhiệm ────────────────────────
  guide({
    thesis:
      'Chính trực là sự nhất quán giữa điều bạn nói, điều bạn làm và tiêu chuẩn bạn tuyên bố — đặc biệt trong những lúc không ai kiểm tra và việc làm đúng có giá. Trách nhiệm là việc nhận phần mình kiểm soát được và đi sửa hậu quả, thay vì đi tìm người để quy lỗi. Cả hai đều không đo bằng ý định tốt mà đo bằng dấu vết: quyết định được ghi lại, xung đột lợi ích được công khai, và những lần bạn tự báo sai sót trước khi có ai phát hiện.',
    why: {
      work:
        'Uy tín là tài sản tích luỹ chậm và mất rất nhanh. Một lần che giấu sai sót bị phát hiện sẽ khiến mọi báo cáo sau đó của bạn bị soi lại, kể cả những báo cáo hoàn toàn đúng.',
      interview:
        'Nhiều nơi hỏi tình huống có xung đột lợi ích hoặc áp lực làm sai để xem bạn nhận ra vấn đề ở mức nào. Người kể được cả cái giá mình đã trả khi làm đúng thuyết phục hơn người chỉ khẳng định mình luôn trung thực.',
      study:
        'Ranh giới giữa tham khảo và đạo văn, giữa dùng công cụ hỗ trợ và nộp bài không phải của mình, quyết định giá trị của tấm bằng bạn nhận. Đây cũng là nơi thói quen được hình thành trước khi vào nghề.',
      life:
        'Trong các quan hệ lâu dài, khả năng nhận lỗi cụ thể và sửa là thứ giữ được lòng tin. Người luôn giải thích để mình không sai sẽ dần chỉ còn lại những quan hệ nông.',
    },
    framework: [
      {
        name: 'Nhận diện bên liên quan',
        detail:
          'Liệt kê ai được lợi và ai chịu thiệt từ quyết định này, kể cả những người không có mặt trong phòng: khách hàng, đồng nghiệp tuyến sau, người dùng cuối, những người không đủ tiếng nói để phản đối.',
      },
      {
        name: 'Đối chiếu ràng buộc',
        detail:
          'Kiểm ba lớp: quy định pháp luật, cam kết đã ký hoặc đã hứa, và nguyên tắc bạn tự đặt. Ba lớp này không phải lúc nào cũng trùng nhau và chỗ chúng lệch nhau chính là chỗ cần suy nghĩ kỹ.',
      },
      {
        name: 'Công khai xung đột',
        detail:
          'Nếu có bất kỳ lợi ích cá nhân nào gắn với kết quả, hãy nói ra với người có thẩm quyền trước khi quyết định. Xung đột được công khai là một điều kiện quản trị được; xung đột bị giấu là một quả bom hẹn giờ.',
      },
      {
        name: 'Quyết và ghi lý do',
        detail:
          'Viết ngắn: quyết định gì, dựa trên thông tin nào, ai đã biết. Bản ghi này bảo vệ bạn khi bối cảnh sau này thay đổi và người ta đánh giá quyết định bằng thông tin mà lúc đó bạn không có.',
      },
      {
        name: 'Báo sớm, sửa hậu quả',
        detail:
          'Khi phát hiện sai, thứ tự đúng là: chặn thiệt hại đang lan, báo cho người bị ảnh hưởng, rồi mới tìm nguyên nhân gốc. Báo sớm luôn rẻ hơn nhiều so với để người khác phát hiện.',
      },
    ],
    scenario:
      'Một nhân viên mua hàng của công ty sản xuất nhận được đề nghị riêng từ một nhà cung cấp: nếu chọn họ cho hợp đồng bao bì năm tới, anh sẽ có một khoản "cảm ơn" cá nhân, và giá chào của họ thực tế cũng nằm trong nhóm tốt nhất. Anh không tự xử lý một mình. Anh viết một email cho trưởng phòng và bộ phận kiểm soát nội bộ trong ngày, nêu đúng ba việc: nội dung đề nghị, việc anh chưa và sẽ không nhận, và yêu cầu chuyển quyền chấm thầu phần này cho người khác để tránh nghi ngờ. Anh cũng đề xuất bổ sung một tiêu chí đánh giá công khai (bảng điểm giá — chất lượng — thời gian giao) để lần sau quyết định không phụ thuộc vào phán đoán của một người. Kết quả: nhà cung cấp đó vẫn được chọn nhờ điểm số cao nhất, nhưng bằng một quy trình mà không ai có thể đặt câu hỏi, và bảng chấm điểm trở thành quy định chung của phòng. Chính trực ở đây không phải là từ chối trong im lặng, mà là đưa việc ra chỗ sáng và thay đổi cơ chế.',
    comparison: [
      {
        weak: 'Nói vòng khi bị hỏi về một sai sót: nhấn mạnh hoàn cảnh, nhắc đến người khác cũng liên quan, để người nghe tự hiểu.',
        mature:
          'Nói thẳng phần mình chịu trách nhiệm, phạm vi thiệt hại, biện pháp đã làm để chặn, và bước tiếp theo — rồi mới bàn tới các yếu tố hoàn cảnh nếu cần thiết.',
      },
      {
        weak: 'Xử lý xung đột lợi ích bằng cách tự hứa với bản thân là sẽ khách quan, không nói với ai.',
        mature:
          'Công khai xung đột với người có thẩm quyền và tự rút khỏi phần quyết định liên quan, vì tính chính đáng của quyết định không chỉ nằm ở kết quả mà còn ở chỗ nó chịu được sự soi xét.',
      },
      {
        weak: 'Trình bày số liệu bằng cách chọn phạm vi và cách chia nhóm sao cho câu chuyện đẹp lên, mà không nói ra tiêu chí đã dùng.',
        mature:
          'Nêu rõ tiêu chí lọc, khoảng thời gian và phần dữ liệu bị loại; nếu con số xấu thì trình bày kèm phân tích nguyên nhân, vì một báo cáo trung thực xấu vẫn dẫn tới quyết định tốt hơn một báo cáo đẹp sai.',
      },
      {
        weak: 'Coi im lặng trước một việc sai của người khác là chuyện không phải của mình, miễn là mình không tham gia.',
        mature:
          'Nêu vấn đề qua kênh phù hợp, bắt đầu từ mức nhẹ nhất có thể (hỏi riêng người trong cuộc), và ghi lại việc mình đã nêu — kể cả khi kết quả không thay đổi ngay.',
      },
    ],
    mistakes: [
      'Trì hoãn việc báo sai sót với hy vọng tự khắc phục kịp trước khi ai đó phát hiện; xác suất thất bại cao và khi vỡ lở thì lỗi che giấu bị đánh giá nặng hơn nhiều so với lỗi gốc.',
      'Đánh đồng chính trực với sự cứng nhắc: biến mọi bất đồng nhỏ thành vấn đề đạo đức, khiến người khác né tránh trao đổi và bạn mất đúng cơ hội can thiệp vào những việc thực sự nghiêm trọng.',
      'Chỉ dựa vào cảm giác đúng sai tại chỗ mà không có quy trình ghi chép, nên khi hoàn cảnh thay đổi hoặc trí nhớ mờ đi thì không còn cách nào chứng minh mình đã quyết định trên cơ sở nào.',
    ],
    worksheet: [
      'Trong công việc hiện tại của bạn, quyết định nào có người chịu ảnh hưởng nhưng không có mặt lúc quyết định? Ai là những người đó?',
      'Bạn đang có lợi ích cá nhân nào (quan hệ, tiền, thành tích cá nhân) gắn với một quyết định sắp tới? Nếu có, bạn sẽ nói với ai và nói lúc nào?',
      'Lần gần nhất bạn mắc một sai sót có ảnh hưởng đến người khác, bạn đã báo sau bao lâu và ai là người phát hiện trước?',
      'Bạn có ghi lại lý do cho các quyết định quan trọng ở đâu không? Nếu sáu tháng sau có người hỏi "vì sao lúc đó chọn phương án này", bạn tra ở đâu?',
      'Ranh giới nào bạn cam kết không vượt qua dù có áp lực gì? Viết ba dòng cụ thể, và ghi cả điều bạn sẵn sàng mất để giữ chúng.',
    ],
    exercises: [
      {
        label: 'Bản đồ bên liên quan',
        text: 'Với một quyết định bạn sắp làm, liệt kê tất cả các bên chịu ảnh hưởng và đánh dấu ai không có mặt trong phòng. Với hai bên vắng mặt quan trọng nhất, viết một câu họ sẽ phản đối điều gì.',
        level: 'e',
      },
      {
        label: 'Ba lớp ràng buộc',
        text: 'Chọn một tình huống khó và kiểm lần lượt ba lớp: quy định, cam kết đã hứa, nguyên tắc cá nhân. Ghi rõ chỗ nào ba lớp không trùng nhau và bạn xử lý phần lệch đó thế nào.',
        level: 'e',
      },
      {
        label: 'Sổ quyết định',
        text: 'Mở một tài liệu ghi quyết định và bắt đầu bằng ba quyết định gần nhất: ngày, nội dung, thông tin có lúc đó, ai đã biết. Duy trì trong bốn tuần và đọc lại để xem bạn thường thiếu thông tin loại nào.',
        level: 'e',
      },
      {
        label: 'Báo một sai sót nhỏ trong 24 giờ',
        text: 'Chọn một lỗi nhỏ bạn đang định im lặng cho qua và báo cho người liên quan trong 24 giờ, kèm biện pháp khắc phục. Ghi lại phản ứng thật của họ so với phản ứng bạn đã tưởng tượng.',
        level: 'm',
      },
      {
        label: 'Rà lại một báo cáo của mình',
        text: 'Lấy một báo cáo hoặc bản trình bày bạn từng làm và kiểm ba điều: tiêu chí lọc dữ liệu có được nêu không, phần dữ liệu bị loại là gì, cách chia nhóm có làm thay đổi kết luận không. Viết lại phần ghi chú phương pháp.',
        level: 'm',
      },
      {
        label: 'Viết lại một lời xin lỗi',
        text: 'Lấy một lần bạn từng nhận lỗi nửa vời và viết lại theo bốn phần: hành vi cụ thể của tôi, ảnh hưởng lên bạn, điều tôi đã làm để khắc phục, điều tôi sẽ đổi. Không có từ "nếu" và "nhưng" ở phần đầu.',
        level: 'm',
      },
      {
        label: 'Bảy ngày giữ đúng lời hứa nhỏ',
        text: 'Trong 7 ngày, ghi lại mọi lời hứa bạn nói ra (kể cả "để tôi gửi anh trong chiều nay") và đánh dấu cái nào thực hiện đúng hạn. Cuối tuần tính tỷ lệ và viết một quy tắc để không hứa thứ mình không kiểm soát được.',
        level: 'h',
      },
      {
        label: 'Dựng một cơ chế thay cho phán đoán cá nhân',
        text: 'Chọn một loại quyết định trong công việc đang phụ thuộc vào ý kiến một người (chọn nhà cung cấp, phân bổ thưởng, ưu tiên yêu cầu) và đề xuất một bộ tiêu chí công khai kèm cách chấm. Trình bày với người có thẩm quyền và ghi lại phản hồi cùng phần được áp dụng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao báo sai sót sớm lại rẻ hơn, ngay cả khi việc báo khiến bạn bị đánh giá?',
        a: 'Vì thiệt hại thường lan theo thời gian và chi phí khắc phục tăng nhanh, còn lỗi che giấu khi bị phát hiện sẽ làm hỏng độ tin cậy của toàn bộ những gì bạn báo cáo sau này. Một lỗi kỹ thuật có thể sửa được; một nghi ngờ về sự trung thực thì đi theo bạn rất lâu.',
      },
      {
        q: 'Bạn có lợi ích cá nhân trong một quyết định nhưng tin rằng mình vẫn khách quan. Có cần nói ra không?',
        a: 'Có. Tính chính đáng của quyết định không chỉ nằm ở việc nó đúng, mà còn ở việc nó chịu được sự soi xét về sau. Công khai xung đột và rút khỏi phần liên quan bảo vệ cả kết quả lẫn uy tín của bạn, kể cả khi phán đoán của bạn thực sự khách quan.',
      },
      {
        q: 'Nhận trách nhiệm khác nhận lỗi tất cả về mình ở điểm nào?',
        a: 'Nhận trách nhiệm là nêu chính xác phần bạn kiểm soát được, hậu quả của phần đó và biện pháp sửa. Nhận hết mọi thứ về mình nghe có vẻ cao thượng nhưng làm mờ nguyên nhân thật, khiến tổ chức không sửa được các yếu tố hệ thống và sự việc dễ lặp lại.',
      },
    ],
    plan7:
      'Ngày 1: mở sổ quyết định và ghi lại ba quyết định gần nhất kèm thông tin có lúc đó. Ngày 2: vẽ bản đồ bên liên quan cho một quyết định sắp tới, đánh dấu ai không có mặt. Ngày 3: rà ba lớp ràng buộc cho tình huống khó nhất bạn đang gặp. Ngày 4: báo một sai sót nhỏ mà bạn đang định im lặng, kèm biện pháp khắc phục. Ngày 5: rà lại phương pháp của một báo cáo cũ và bổ sung phần ghi chú tiêu chí. Ngày 6: viết ba ranh giới bạn cam kết không vượt qua, kèm cái giá bạn chấp nhận trả. Ngày 7: đề xuất một cơ chế công khai thay cho một quyết định đang phụ thuộc phán đoán cá nhân.',
    evidence:
      'Đây là kỹ năng dễ nói suông nhất nên chỉ hiện vật mới có sức nặng: sổ quyết định có ghi thông tin tại thời điểm quyết định, một email công khai xung đột lợi ích, phần ghi chú phương pháp trong báo cáo (tiêu chí lọc, dữ liệu bị loại), hoặc một bộ tiêu chí chấm mà bạn đề xuất và được áp dụng. Trong phỏng vấn, dùng cho câu "kể về một lần bạn phải làm điều đúng nhưng bất lợi cho mình": nêu tình huống, việc bạn đã làm, cái giá thật bạn trả, và cơ chế bạn dựng lên để lần sau không phụ thuộc vào lòng tốt của một cá nhân. Chi tiết về cái giá đã trả là phần khiến câu chuyện đáng tin.',
    references: [
      { label: 'APA — Ethical Principles of Psychologists and Code of Conduct', url: 'https://www.apa.org/ethics/code', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Business ethics', url: 'https://hbr.org/topic/subject/business-ethics', type: 'article', needsReview: true },
    ],
    diagram: 'flow',
  }),
];
