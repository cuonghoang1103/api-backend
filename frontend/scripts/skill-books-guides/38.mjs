import { guide } from '../skill-guide-builder.mjs';

export default [
  // ─────────────────────────────────────────────────────────────────────────
  // Chương 1 — Tư duy doanh nhân
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Tư duy doanh nhân không phải là thích mạo hiểm hay ghét làm thuê. Nó là một tập hành vi quan sát được: nhìn khó chịu của người khác như một đơn hàng tiềm năng, tự bỏ tiền hoặc giờ của chính mình ra để kiểm một giả định thay vì tranh luận về nó, và nhận phần trách nhiệm cuối cùng khi không còn ai ở trên để duyệt. Phép thử nhanh nhất: trong ba mươi ngày vừa qua, bạn đã chi bao nhiêu tiền và bao nhiêu giờ để kiểm chứng một giả định về nhu cầu của người khác? Nếu con số là không, bạn đang có ý tưởng chứ chưa có tư duy doanh nhân.',
    why: {
      work: 'Ngay cả khi làm thuê, người được giao việc lớn thường là người mang tới đề xuất kèm ước lượng chi phí, kèm cách kiểm rẻ nhất và kèm một câu trả lời cho "nếu sai thì mất gì". Ba thứ đó chính là bộ đồ nghề của người khởi nghiệp, chỉ khác là tiền không phải của bạn.',
      interview:
        'Nhiều nhà tuyển dụng hỏi về một lần bạn tự khởi xướng thứ gì đó mà không ai giao. Câu trả lời yếu kể lại một ý tưởng hay. Câu trả lời mạnh kể lại giả định bạn đã nghi ngờ, cách kiểm bạn chọn vì nó rẻ nhất, con số thu được, và quyết định bạn thay đổi sau đó — kể cả khi kết luận là dừng lại.',
      study:
        'Học kinh doanh qua sách dễ tạo ảo giác hiểu, vì mọi case study đều được kể sau khi đã biết kết cục. Đọc với tư duy doanh nhân nghĩa là dừng ở giữa mỗi case, tự viết ra quyết định bạn sẽ chọn với đúng lượng thông tin nhân vật có lúc đó, rồi mới đọc tiếp.',
      life: 'Việc lớn trong đời — đổi nghề, chuyển thành phố, nhận nuôi thú, cưới — đều là quyết định thiếu thông tin và không có ai duyệt hộ. Thói quen đặt cược nhỏ có giới hạn thua trước khi đặt cược lớn dùng được nguyên vẹn ở đó: thử sống một tháng ở thành phố mới trước khi chuyển hẳn rẻ hơn nhiều so với chuyển rồi mới biết.',
    },
    framework: [
      {
        name: 'Đổi câu hỏi xuất phát',
        detail: 'Bỏ câu "tôi thích làm gì" và thay bằng "ai đang tốn tiền, tốn giờ hoặc tốn bực bội vì việc gì, và họ đang xoay xở bằng cách nào". Viết ra cách xoay xở hiện tại của họ, kể cả khi đó là làm bằng tay hay chịu đựng. Không có cách xoay xở hiện tại thì thường không có nhu cầu, chỉ có một mong muốn lịch sự.',
      },
      {
        name: 'Tách ba loại rủi ro và xếp thứ tự',
        detail: 'Rủi ro nhu cầu (có ai muốn không), rủi ro khả thi (ta làm được không), rủi ro sinh lời (làm rồi có còn tiền không). Người mới hầu như luôn đi kiểm rủi ro khả thi trước vì nó vui và nằm trong tầm kiểm soát. Nguyên tắc là kiểm loại rủi ro nào giết dự án nhanh nhất nếu câu trả lời là không — thường là rủi ro nhu cầu.',
      },
      {
        name: 'Đặt cược nhỏ có giới hạn thua viết trước',
        detail: 'Trước khi bắt đầu, viết ra ba con số: tối đa bao nhiêu tiền, tối đa bao nhiêu tuần, và dấu hiệu nào thì dừng. Viết trước lúc còn tỉnh táo, vì lúc đã bỏ vào sáu tháng thì không ai còn tỉnh táo để tự dừng. Đây là khác biệt giữa dám mạo hiểm và liều.',
      },
      {
        name: 'Giữ một sổ giả định',
        detail: 'Mỗi dòng gồm: giả định, mức độ tin hiện tại từ 0 tới 10, hậu quả nếu sai, và cách kiểm rẻ nhất. Cập nhật mức độ tin sau mỗi lần thu được dữ kiện mới. Sổ này quan trọng vì trí nhớ tự sửa lại quá khứ: sáu tháng sau, ai cũng nhớ rằng mình đã luôn biết điều đó.',
      },
      {
        name: 'Nhận phần trách nhiệm cuối',
        detail: 'Viết ra ai chịu thiệt nếu bạn sai: bản thân, gia đình, người bạn rủ làm cùng, khách trả tiền trước, nhân viên sẽ tuyển. Danh sách này quyết định bạn được phép mạo hiểm tới đâu. Mạo hiểm bằng tiền của mình và mạo hiểm bằng lương tháng của một người khác là hai việc khác nhau về đạo đức, không chỉ về tài chính.',
      },
    ],
    scenario:
      'Một giáo viên tiếng Anh cấp hai muốn mở lớp luyện nói cho người đi làm. Phản xạ đầu tiên của cô là thiết kế giáo trình mười hai buổi và tìm chỗ thuê phòng — tức là đi kiểm rủi ro khả thi. Cô dừng lại và viết sổ giả định, trong đó dòng đáng ngờ nhất là "người đi làm sẵn sàng trả một triệu tám cho tám buổi tối thứ Ba và thứ Năm". Cô đặt giới hạn thua: hai tuần và một triệu đồng. Cách kiểm cô chọn là đăng một bài mô tả lớp học kèm giá và lịch cụ thể vào ba nhóm cư dân gần văn phòng, yêu cầu người quan tâm chuyển khoản giữ chỗ hai trăm nghìn hoàn lại được. Sau mười ngày có hai mươi sáu người nhắn hỏi nhưng chỉ bốn người chuyển tiền, và ba trong bốn người đó hỏi liệu có lớp buổi sáng cuối tuần không. Cô không mở lớp tối như dự định ban đầu; cô mở một lớp sáng Chủ nhật với sáu người và giữ nguyên công việc chính. Kết quả quan trọng không phải lớp học đó, mà là cô đã mua được thông tin "khung giờ tối trong tuần là rào cản lớn hơn giá" với chi phí mười ngày và gần như không mất tiền.',
    comparison: [
      { weak: 'Giữ ý tưởng bí mật vì sợ bị lấy mất, nên chỉ hỏi bạn bè thân bằng câu "cậu thấy ý này hay không".', mature: 'Đem ý tưởng đi hỏi đúng người sẽ trả tiền, bằng câu hỏi về hành vi đã xảy ra: lần gần nhất bạn gặp vấn đề này là khi nào và bạn đã làm gì.' },
      { weak: 'Coi việc nghỉ hẳn công việc chính là bằng chứng của sự nghiêm túc và kể lại điều đó như một huy chương.', mature: 'Coi việc nghỉ là một quyết định về dòng tiền cá nhân, chỉ làm khi đã có dấu hiệu nhu cầu thật và đã tính được bao nhiêu tháng sống được nếu không có doanh thu.' },
      { weak: 'Khi thất bại thì kết luận "thị trường Việt Nam chưa sẵn sàng" và chuyển sang ý tưởng mới.', mature: 'Khi thất bại thì mở sổ giả định ra, đánh dấu đúng giả định nào đã sai, và ghi lại điều học được ở dạng có thể dùng cho ý tưởng sau.' },
    ],
    mistakes: [
      'Nhầm nhiệt tình với bằng chứng: đếm số người khen ý tưởng thay vì đếm số người đã bỏ ra thứ gì đó có giá — tiền, thời gian, hoặc thông tin liên lạc thật.',
      'Bắt đầu bằng việc đăng ký công ty, làm logo, in danh thiếp và mua tên miền, vì những việc đó dễ hoàn thành và cho cảm giác đã tiến bộ, trong khi chưa ai xác nhận có nhu cầu.',
      'Không viết giới hạn thua trước, nên mỗi lần cân nhắc dừng lại đều bị chi phí đã bỏ ra kéo ngược: đã tốn nhiều thế này rồi, bỏ thì phí.',
    ],
    worksheet: [
      'Viết ra một khó chịu cụ thể mà bạn đã trực tiếp nghe ít nhất ba người khác nhau nói ra trong ba tháng qua. Ghi nguyên văn câu họ nói.',
      'Với khó chịu đó, hiện tại họ đang xoay xở bằng cách nào và cách đó tốn của họ bao nhiêu tiền hoặc bao nhiêu giờ mỗi tháng?',
      'Trong ba loại rủi ro (nhu cầu, khả thi, sinh lời), loại nào nếu là không sẽ giết dự án nhanh nhất? Bạn định kiểm nó bằng cách nào trong hai tuần?',
      'Viết ba con số giới hạn thua của bạn: tối đa bao nhiêu tiền, tối đa bao nhiêu tuần, dấu hiệu cụ thể nào thì dừng.',
      'Liệt kê những người sẽ chịu hậu quả nếu bạn sai và mức thiệt hại của từng người. Ai trong danh sách đó chưa biết mình đang ở trong danh sách?',
    ],
    exercises: [
      { label: 'Nhật ký khó chịu bảy ngày', text: 'Bảy ngày liền, mỗi lần bạn hoặc người quanh bạn phàn nàn về một việc lặp lại, ghi một dòng gồm ai phàn nàn, việc gì, và họ đang xoay xở ra sao. Cuối tuần đếm xem khó chịu nào lặp nhiều nhất và ai là người có tiền để giải quyết nó.', level: 'e' },
      { label: 'Sổ giả định đầu tiên', text: 'Với một ý tưởng bạn đang nghĩ tới, viết ra bảy giả định đang ngầm nằm dưới nó. Chấm mức độ tin từ 0 tới 10 cho từng cái và khoanh tròn cái vừa quan trọng vừa ít bằng chứng nhất.', level: 'e' },
      { label: 'Ba loại rủi ro', text: 'Xếp bảy giả định vừa viết vào ba nhóm rủi ro nhu cầu, khả thi, sinh lời. Nếu nhóm nhu cầu trống hoặc chỉ có một dòng, viết thêm cho tới khi có ít nhất ba dòng — đó thường là nhóm bạn đang né.', level: 'e' },
      { label: 'Phỏng vấn năm người dùng thật', text: 'Tìm năm người thuộc nhóm bạn nhắm tới nhưng không phải bạn bè thân. Hỏi về lần gần nhất họ gặp vấn đề đó, không nhắc tới giải pháp của bạn. Ghi nguyên văn và đếm bao nhiêu người thực sự đã bỏ tiền hoặc công sức để tự xử lý.', level: 'm' },
      { label: 'Cược nhỏ có hạn', text: 'Chọn một cách kiểm rẻ nhất tốn dưới hai tuần và dưới một khoản tiền bạn mất được không tiếc. Viết tiêu chí thành công bằng con số trước khi bắt đầu, rồi thực hiện và ghi kết quả thật kể cả khi nó phủ định ý tưởng.', level: 'm' },
      { label: 'Đọc ngược một doanh nghiệp quanh bạn', text: 'Chọn một cửa hàng hoặc dịch vụ bạn hay dùng. Ước lượng doanh thu ngày, chi phí mặt bằng, số nhân sự và tiền còn lại. Rồi hỏi trực tiếp chủ nếu có thể, đối chiếu ước lượng của bạn với thực tế và ghi lại chỗ bạn sai nhiều nhất.', level: 'm' },
      { label: 'Kịch bản mất tiền', text: 'Viết ba trang mô tả chi tiết viễn cảnh dự án của bạn thất bại sau mười tám tháng: chuyện gì xảy ra theo trình tự, ai mất gì, bạn còn lại gì. Rồi liệt kê những quyết định hôm nay có thể làm viễn cảnh đó bớt tệ đi mà không làm giảm cơ hội thành công.', level: 'h' },
      { label: 'Thử thách 7 ngày: bảy người lạ, bảy câu hỏi', text: 'Bảy ngày, mỗi ngày tiếp cận một người lạ thuộc nhóm khách mục tiêu và hỏi đúng một câu về hành vi đã xảy ra của họ liên quan tới vấn đề bạn định giải. Không giới thiệu giải pháp. Ngày thứ bảy đọc lại bảy câu trả lời và viết ra giả định nào của bạn vừa bị lung lay.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao đếm số người khen ý tưởng lại là một phép đo tệ, trong khi hỏi ý kiến vẫn là việc cần làm?',
        a: 'Vì khen là hành vi gần như không có chi phí, còn mua là hành vi có chi phí. Người khen bạn đang tối ưu cho việc giữ quan hệ dễ chịu, không phải cho việc dự đoán hành vi tương lai của chính họ, và bản thân họ cũng thường không dự đoán được. Hỏi ý kiến vẫn hữu ích nhưng phải hỏi đúng loại câu: hỏi về việc đã xảy ra trong quá khứ (lần gần nhất bạn gặp việc này là khi nào, bạn đã làm gì, tốn bao nhiêu) thay vì hỏi về ý định tương lai (bạn có mua không). Bằng chứng mạnh nhất luôn là một hành động có giá: chuyển tiền giữ chỗ, để lại số điện thoại thật, dành một buổi tối tới dùng thử.',
      },
      {
        q: 'Một người nói: tôi phải làm xong sản phẩm rồi mới đi hỏi khách, chứ chưa có gì thì hỏi cái gì. Chỗ sai trong lập luận này nằm ở đâu?',
        a: 'Ở chỗ nhầm giữa hỏi về giải pháp và hỏi về vấn đề. Bạn không cần sản phẩm để hỏi người ta hôm nay đang xử lý việc đó thế nào, mất bao nhiêu thời gian, đã từng trả tiền cho ai chưa. Những câu đó thu được thông tin quyết định nhất và không cần một dòng mã hay một mét vuông mặt bằng nào. Ngoài ra, làm xong sản phẩm rồi mới hỏi nghĩa là đặt toàn bộ chi phí phát triển vào một giả định chưa kiểm — đúng thứ tự rủi ro bị đảo ngược.',
      },
      {
        q: 'Giới hạn thua viết trước có làm giảm khả năng thành công không?',
        a: 'Nó làm giảm khả năng thành công của một lần thử cụ thể nếu bạn đặt giới hạn quá chặt, nhưng làm tăng khả năng bạn còn ở trong cuộc chơi để thử lần thứ ba, thứ tư. Người không viết giới hạn thường không thua ở lần thử đầu, họ thua ở chỗ dồn hết nguồn lực vào lần thử đầu rồi không còn gì để thử tiếp khi phát hiện hướng đúng. Giới hạn cũng không phải bất di bất dịch: nó có thể được nới, nhưng phải nới bằng một quyết định có ý thức dựa trên dữ kiện mới, không phải trôi dần vì tiếc.',
      },
    ],
    plan7:
      'Ngày 1: ghi lại ba khó chịu lặp lại bạn nghe được và cách người ta đang xoay xở. Ngày 2: chọn một khó chịu và viết bảy giả định nằm dưới nó. Ngày 3: xếp bảy giả định vào ba loại rủi ro, khoanh cái nguy hiểm nhất. Ngày 4: viết ba con số giới hạn thua và thiết kế một cách kiểm dưới hai tuần. Ngày 5: nói chuyện với hai người thuộc nhóm khách mục tiêu, chỉ hỏi về hành vi quá khứ. Ngày 6: nói chuyện với ba người nữa và ghi lại chỗ khác biệt so với ngày 5. Ngày 7: cập nhật mức độ tin trong sổ giả định và viết quyết định tiếp theo bằng một câu.',
    evidence:
      'Hiện vật đáng giá nhất cho chương này là sổ giả định có dấu vết thời gian: cột mức độ tin thay đổi theo từng ngày kèm dữ kiện đã làm nó đổi. Nó chứng minh bạn ra quyết định bằng bằng chứng chứ không bằng cảm hứng, và nó khó bịa lại sau. Trong CV hoặc hồ sơ, đừng viết có tinh thần khởi nghiệp; viết việc bạn đã làm và số bạn đo được, ví dụ: kiểm chứng nhu cầu cho một lớp học bằng đặt chỗ có trả trước, thu 4 trên 26 người quan tâm, đổi khung giờ dựa trên dữ liệu và mở lớp đầu tiên với 6 học viên. Trong phỏng vấn, câu chuyện mạnh nhất thường là lần bạn tự dừng một ý tưởng mình rất thích vì dữ liệu nói không — vì nó cho thấy bạn phân biệt được ý muốn của mình với thực tế thị trường.',
    references: [
      { label: 'Y Combinator Startup Library', url: 'https://www.ycombinator.com/library', type: 'article' },
      { label: 'Paul Graham — tuyển tập tiểu luận về khởi nghiệp', url: 'https://paulgraham.com/articles.html', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 2 — Kiểm chứng ý tưởng kinh doanh
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Kiểm chứng ý tưởng là quá trình biến một câu khẳng định mơ hồ thành một dự đoán có thể sai, rồi tạo điều kiện cho nó sai một cách rẻ tiền. Điểm mấu chốt nằm ở chỗ thiết kế phép kiểm sao cho kết quả xấu vẫn đọc được: nếu mọi kết cục đều được bạn diễn giải thành tín hiệu tích cực thì bạn chưa kiểm gì cả, bạn đang đi tìm sự đồng thuận. Một phép kiểm hợp lệ phải có ba thứ viết trước khi chạy: con số ngưỡng, thời hạn, và câu mô tả bạn sẽ làm gì nếu không đạt ngưỡng.',
    why: {
      work: 'Trong công ty, phần lớn dự án chết không phải vì làm dở mà vì không ai đặt câu hỏi có ai cần thứ này không trước khi tiêu ngân sách sáu tháng. Người biết thiết kế một phép kiểm hai tuần trước khi xin ngân sách sáu tháng là người được tin giao ngân sách lần sau.',
      interview:
        'Với các vị trí sản phẩm, tăng trưởng hoặc khởi nghiệp nội bộ, nhà tuyển dụng thường hỏi bạn sẽ kiểm ý tưởng này thế nào. Điều họ nghe được không phải danh sách công cụ mà là bạn có tách được giả định nguy hiểm nhất ra và có dám đặt ngưỡng thất bại trước hay không.',
      study:
        'Kỹ năng này giống hệt kỷ luật khoa học ở mức thực dụng: nêu giả thuyết, chọn phép đo, xác định trước mức bác bỏ. Người quen làm việc này trong kinh doanh sẽ đọc một nghiên cứu hay một báo cáo thị trường sắc hơn hẳn, vì họ tự động tìm xem tác giả đã cho phép mình sai ở chỗ nào.',
      life: 'Trước khi cam kết một việc lớn về đời sống — học một chứng chỉ hai năm, mở quán cùng bạn, chuyển sang làm tự do — luôn tồn tại một phiên bản nhỏ có thể thử trong vài tuần. Người có thói quen kiểm chứng thường mất ít năm hơn cho những lựa chọn hoá ra không hợp với mình.',
    },
    framework: [
      {
        name: 'Viết ý tưởng thành một câu có thể sai',
        detail: 'Chuyển từ dạng tôi sẽ làm một ứng dụng giặt là sang dạng có thể sai: nhân viên văn phòng ở khu vực này sẵn sàng trả 55 nghìn cho mỗi ký đồ giặt sấy gấp có nhận và trả tận cửa trong 24 giờ, và ít nhất 8 trong 100 người thấy quảng cáo sẽ đặt đơn đầu tiên. Câu này có nhóm người cụ thể, hành vi cụ thể, giá cụ thể và một con số có thể không đạt.',
      },
      {
        name: 'Chọn giả định giết dự án nhanh nhất',
        detail: 'Xếp mọi giả định lên lưới hai trục: mức độ quan trọng nếu sai và lượng bằng chứng hiện có. Ô góc trên bên trái — rất quan trọng, gần như không có bằng chứng — là thứ duy nhất được kiểm trước. Người mới thường chọn giả định dễ kiểm thay vì giả định nguy hiểm, vì kết quả dễ chịu hơn.',
      },
      {
        name: 'Thiết kế phép kiểm rẻ nhất còn đọc được',
        detail: 'Với mỗi giả định có nhiều bậc chi phí: hỏi chuyện, trang giới thiệu có nút đặt trước, bán trước có thu tiền, làm thủ công đội lốt tự động, bản chạy thật quy mô nhỏ. Chọn bậc rẻ nhất mà kết quả vẫn phản ánh hành vi thật. Nút đăng ký nhận tin rẻ nhưng đo được rất ít; thu tiền trước đắt hơn nhưng đo đúng thứ cần đo.',
      },
      {
        name: 'Đặt ngưỡng và hạn trước khi chạy',
        detail: 'Viết vào giấy trước khi bắt đầu: chạy trong bao nhiêu ngày, mẫu tối thiểu bao nhiêu người, ngưỡng đạt là bao nhiêu, và nếu không đạt thì bước tiếp theo là bỏ, đổi phân khúc, hay đổi giá. Không có bước này thì mọi kết quả đều được diễn giải theo hướng có lợi, đó là bản chất của con người chứ không phải khuyết điểm cá nhân.',
      },
      {
        name: 'Chạy, đọc số và quyết một trong ba',
        detail: 'Sau khi có dữ liệu, bắt buộc chọn một trong ba: tiếp tục hướng cũ, xoay trục giữ nguyên một phần đã được xác nhận, hoặc dừng. Ghi lại quyết định kèm dữ kiện làm căn cứ, rồi bắt đầu vòng kiểm tiếp theo cho giả định nguy hiểm kế tiếp. Kiểm chứng là một vòng lặp, không phải một cửa ải qua một lần.',
      },
    ],
    scenario:
      'Hai người bạn định làm dịch vụ giặt sấy gấp có nhận và trả tận cửa cho dân văn phòng ở một quận đông chung cư. Giả định nguy hiểm nhất họ chọn không phải là làm được không, mà là có đủ người đặt lại lần thứ hai không, vì dịch vụ này chỉ sống được nhờ khách quay lại. Họ không mở xưởng. Họ thuê lại công suất của một tiệm giặt sẵn có theo ký, làm một trang một cột với bảng giá và khung giờ, chạy quảng cáo giới hạn bán kính hai cây số với ngân sách ba triệu, và tự đi xe máy nhận trả. Ngưỡng viết trước: trong ba tuần phải có tối thiểu 30 đơn đầu tiên và ít nhất 40 phần trăm khách đặt lần hai trong vòng 21 ngày. Kết quả: 41 đơn đầu tiên nhưng chỉ 27 phần trăm đặt lại. Khi gọi hỏi 12 khách không quay lại, 8 người nói cùng một lý do: họ ngại canh khung giờ nhận đồ buổi tối. Nhóm không bỏ dự án và cũng không giả vờ rằng 27 phần trăm là ổn. Họ xoay sang mô hình tủ nhận đồ đặt tại sảnh chung cư và chạy lại đúng phép kiểm cũ với cùng ngưỡng. Toàn bộ vòng đầu tốn ba tuần và khoảng chín triệu đồng, ít hơn nhiều so với chi phí một tháng thuê mặt bằng xưởng.',
    comparison: [
      { weak: 'Làm khảo sát trực tuyến 300 người với câu hỏi bạn có sẵn sàng dùng dịch vụ này không và nhận về 72 phần trăm chọn có.', mature: 'Đặt một nút đặt hàng thật với giá thật và đếm bao nhiêu người bấm rồi hoàn tất thanh toán, vì con số đó là hành vi chứ không phải dự đoán về hành vi.' },
      { weak: 'Chạy phép kiểm rồi khi số xấu thì kết luận do quảng cáo chưa tối ưu và chạy tiếp, lặp lại nhiều vòng không có điểm dừng.', mature: 'Viết trước ngưỡng và số vòng tối đa được phép tinh chỉnh, sau đó nếu vẫn không đạt thì kết luận về giả định chứ không kết luận về công cụ.' },
      { weak: 'Kiểm bằng cách mời bạn bè và người quen dùng thử miễn phí rồi hỏi cảm nhận.', mature: 'Kiểm với người không quen biết, thu tiền thật hoặc yêu cầu một cam kết có chi phí, và tách riêng số của nhóm quen ra khỏi kết luận.' },
    ],
    mistakes: [
      'Kiểm cùng lúc năm thay đổi (đổi giá, đổi thông điệp, đổi kênh, đổi phân khúc, đổi tính năng) rồi khi số tốt lên thì không biết nhờ cái nào, khi số xấu đi cũng không biết vì cái nào.',
      'Dùng mẫu quá nhỏ và quá thiên lệch — mười người quen trong một nhóm chat — rồi ngoại suy thành kết luận về cả thị trường, trong khi mười người đó chọn theo quan hệ chứ không theo nhu cầu.',
      'Nhầm việc bán được vài đơn đầu tiên nhờ chính người sáng lập đi thuyết phục từng người với việc thị trường có nhu cầu: nếu chỉ bạn bán được thì thứ đang được kiểm là kỹ năng thuyết phục của bạn, không phải sản phẩm.',
    ],
    worksheet: [
      'Viết lại ý tưởng của bạn thành một câu chứa: nhóm người cụ thể, hành vi cụ thể, mức giá cụ thể và một con số có thể không đạt.',
      'Liệt kê mọi giả định của câu đó rồi chấm hai điểm cho mỗi cái: mức thiệt hại nếu sai (1-5) và lượng bằng chứng đang có (1-5). Cái nào điểm thiệt hại cao nhất và bằng chứng thấp nhất?',
      'Với giả định vừa chọn, liệt kê ba cách kiểm ở ba mức chi phí khác nhau. Cách rẻ nhất mà kết quả vẫn phản ánh hành vi thật là cách nào?',
      'Viết ngưỡng đạt bằng con số, thời hạn chạy bằng ngày, và cỡ mẫu tối thiểu. Nếu không đạt ngưỡng, bước tiếp theo cụ thể của bạn là gì?',
      'Nếu kết quả nằm giữa — không đủ tốt để tiếp, không đủ xấu để bỏ — bạn đã định trước sẽ làm gì? Viết câu đó ra ngay bây giờ, trước khi biết kết quả.',
    ],
    exercises: [
      { label: 'Viết mười câu có thể sai', text: 'Lấy một ý tưởng và viết mười phát biểu về nó, mỗi phát biểu phải có một con số hoặc một nhóm người cụ thể để có thể bị chứng minh là sai. Gạch bỏ những câu không thể sai bằng bất kỳ dữ liệu nào.', level: 'e' },
      { label: 'Lưới rủi ro hai trục', text: 'Vẽ lưới quan trọng và bằng chứng, đặt tất cả giả định lên đó bằng giấy nhớ. Chụp lại. Sau mỗi vòng kiểm, di chuyển các giấy nhớ và chụp lại để có lịch sử thay đổi hiểu biết của bạn.', level: 'e' },
      { label: 'Đọc ngược một quảng cáo', text: 'Chọn ba quảng cáo dịch vụ bạn thấy trong tuần. Với mỗi cái, đoán xem doanh nghiệp đó đang kiểm giả định gì và họ đo bằng chỉ số nào. Ghi lại và đối chiếu với trang đích của họ.', level: 'e' },
      { label: 'Trang bán trước', text: 'Dựng một trang một cột mô tả sản phẩm với giá thật và một nút đặt trước có thu khoản giữ chỗ hoàn lại được. Đưa trước 50 người lạ tiếp cận. Ghi tỷ lệ xem, tỷ lệ bấm và tỷ lệ hoàn tất thanh toán.', level: 'm' },
      { label: 'Làm thủ công đội lốt tự động', text: 'Chạy dịch vụ trong hai tuần bằng cách bạn tự làm mọi bước phía sau bằng tay, không xây phần mềm nào. Ghi lại số giờ mỗi đơn tốn của bạn — con số này sẽ dùng lại ở chương Unit Economics.', level: 'm' },
      { label: 'Mười cuộc gọi cho người không mua', text: 'Gọi cho mười người đã xem hoặc đã hỏi nhưng không mua. Hỏi họ đã cân nhắc gì và cuối cùng chọn cách nào thay thế. Nhóm các lý do và đếm tần suất thay vì nhớ ấn tượng chung.', level: 'm' },
      { label: 'Kiểm hai phân khúc song song', text: 'Chạy cùng một chào hàng cho hai nhóm khách khác nhau rõ rệt, giữ nguyên mọi biến khác, cùng ngân sách và cùng thời gian. So sánh tỷ lệ chuyển đổi và giá mỗi đơn. Viết một trang kết luận về việc nên tập trung vào nhóm nào và vì sao.', level: 'h' },
      { label: 'Thử thách 7 ngày: một phép kiểm khép kín', text: 'Trong bảy ngày, đi trọn một vòng: ngày 1 viết câu có thể sai và ngưỡng, ngày 2-3 dựng phép kiểm, ngày 4-6 chạy và thu số, ngày 7 quyết một trong ba (tiếp, xoay, dừng) và viết căn cứ. Cấm sửa ngưỡng sau khi đã thấy số.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao ngưỡng đạt phải được viết trước khi chạy phép kiểm, chứ không phải sau khi nhìn thấy dữ liệu?',
        a: 'Vì sau khi thấy dữ liệu, não người rất giỏi tìm ra một cách diễn giải khiến con số vừa nhận trở thành đủ tốt. Ngưỡng viết sau luôn có xu hướng hạ xuống vừa đúng bằng kết quả thu được, và khi đó phép kiểm không còn khả năng bác bỏ điều gì. Ngưỡng viết trước cũng buộc bạn phải suy nghĩ nghiêm túc về việc con số bao nhiêu thì đủ để đáng đầu tư tiếp — một câu hỏi nhiều người bỏ qua và chỉ trả lời bằng cảm giác.',
      },
      {
        q: 'Một phép kiểm cho kết quả 27 phần trăm khách quay lại trong khi ngưỡng là 40 phần trăm. Vì sao kết luận nên là xoay trục chứ không nhất thiết là bỏ hẳn?',
        a: 'Vì con số đó gồm hai thông tin: một phần giả định bị bác bỏ và một phần được xác nhận. Có 41 người lạ chịu trả tiền lần đầu nghĩa là nhu cầu ban đầu có thật; chỉ có cơ chế giữ khách là hỏng. Quyết định đúng phụ thuộc vào việc bạn tìm được nguyên nhân cụ thể của phần hỏng hay chưa. Nếu phỏng vấn khách rời bỏ cho ra một lý do lặp lại và có cách xử lý rõ ràng, thì xoay trục vào đúng chỗ đó là hợp lý. Nếu lý do rời bỏ tản mạn và không có mẫu chung, khả năng cao vấn đề nằm ở giá trị cốt lõi và khi đó dừng là lựa chọn tỉnh táo.',
      },
      {
        q: 'Vì sao bán được cho mười khách đầu tiên chưa chứng minh sản phẩm có nhu cầu?',
        a: 'Vì mười khách đầu thường được người sáng lập bán trực tiếp, bằng quan hệ, bằng sự nhiệt tình và bằng những nhân nhượng không lặp lại được như giảm giá sâu hay hứa hỗ trợ vô hạn. Thứ đang được kiểm chứng trong tình huống đó là khả năng thuyết phục của một người, không phải sức hấp dẫn tự thân của sản phẩm. Dấu hiệu đáng tin hơn là khi có khách mua qua một kênh không có mặt bạn, hoặc khi có khách mua lần thứ hai mà không cần ai nhắc, hoặc khi một người bán khác trong đội bán được với tỷ lệ tương đương.',
      },
    ],
    plan7:
      'Ngày 1: viết ý tưởng thành câu có thể sai và liệt kê toàn bộ giả định. Ngày 2: đặt giả định lên lưới quan trọng và bằng chứng, chọn ô nguy hiểm nhất. Ngày 3: thiết kế ba phương án kiểm ở ba mức chi phí, chọn một, viết ngưỡng và hạn. Ngày 4: dựng công cụ tối thiểu cho phép kiểm, không làm đẹp. Ngày 5: đưa phép kiểm tới ít nhất 30 người lạ. Ngày 6: thu số và gọi cho năm người không chuyển đổi. Ngày 7: đối chiếu với ngưỡng, chọn tiếp hoặc xoay hoặc dừng, và viết căn cứ vào sổ giả định.',
    evidence:
      'Bằng chứng dùng được là một hồ sơ phép kiểm gọn gồm bốn phần: câu giả định gốc, thiết kế phép kiểm và ngưỡng viết trước, ảnh chụp dữ liệu thô (bảng đơn hàng, báo cáo quảng cáo, ghi chép phỏng vấn), và quyết định cuối kèm lý do. Hồ sơ này mạnh hơn bất kỳ bản kế hoạch kinh doanh nào vì nó cho thấy bạn đã dám để mình sai. Trong phỏng vấn vị trí sản phẩm hoặc tăng trưởng, kể một phép kiểm mà bạn dừng sau khi số không đạt sẽ phân biệt bạn với ứng viên chỉ kể những lần thành công. Trong CV, viết dạng: thiết kế và chạy 4 phép kiểm nhu cầu trong 10 tuần với tổng ngân sách dưới 20 triệu, dừng 2 hướng và giữ 1 hướng đạt tỷ lệ mua lại 44 phần trăm.',
    references: [
      { label: 'Y Combinator Startup Library — chủ đề tìm và kiểm chứng ý tưởng', url: 'https://www.ycombinator.com/library', type: 'article' },
      { label: 'First Round Review', url: 'https://review.firstround.com', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 3 — Mô hình kinh doanh
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Mô hình kinh doanh là câu trả lời cho ba câu hỏi nối với nhau: bạn tạo giá trị gì cho ai, bạn giao giá trị đó qua đường nào, và bạn giữ lại được bao nhiêu phần trong dòng tiền đi qua. Hai doanh nghiệp bán cùng một thứ có thể sống chết khác nhau hoàn toàn chỉ vì khác ở câu thứ ba. Điều nguy hiểm nhất là mô hình mặc định: rất nhiều người chọn cách kiếm tiền giống người bên cạnh mà chưa từng đặt câu hỏi liệu có cách khác phù hợp hơn với chi phí và năng lực của mình.',
    why: {
      work: 'Hiểu mô hình kinh doanh của chính công ty bạn giải thích được vì sao sếp ưu tiên việc này chứ không việc kia. Người biết đâu là nguồn tiền chính và đâu là chi phí lớn nhất sẽ đề xuất được thứ được duyệt, thay vì đề xuất thứ hay nhưng nằm ngoài mạch tiền của tổ chức.',
      interview:
        'Câu hỏi bạn biết gì về công ty chúng tôi thực chất là câu hỏi bạn có hiểu chúng tôi kiếm tiền bằng cách nào không. Ứng viên trả lời bằng sản phẩm thì bình thường; ứng viên nói được nguồn doanh thu chính, cấu trúc chi phí và điểm yếu của mô hình đó thì hiếm.',
      study:
        'Khi đọc về một ngành mới, mô hình kinh doanh là bộ khung nhét thông tin vào cho khỏi rời rạc. Cùng một ngành ăn uống, mô hình chuỗi tự vận hành, mô hình nhượng quyền và mô hình bếp trung tâm tạo ra ba bài toán khác hẳn nhau về vốn, nhân sự và rủi ro.',
      life: 'Cá nhân cũng có mô hình: bán giờ, bán sản phẩm, cho thuê tài sản, hoặc nhận phần trăm. Nhận ra mình đang ở mô hình bán giờ giải thích vì sao thu nhập chững lại dù làm giỏi hơn, và mở ra câu hỏi có phần nào công việc của mình chuyển sang dạng khác được không.',
    },
    framework: [
      {
        name: 'Xác định khách trả tiền và người dùng',
        detail: 'Hai vai này không phải lúc nào cũng là một người. Trong một trung tâm dạy thêm, người dùng là học sinh còn người trả tiền là phụ huynh; thông điệp và tiêu chí đánh giá của hai bên khác nhau. Viết rõ ai quyết chi tiền, ai dùng, ai có quyền phủ quyết — nhầm ba vai này là nguyên nhân phổ biến của việc làm ra sản phẩm được khen mà không bán được.',
      },
      {
        name: 'Viết giá trị bằng ngôn ngữ của khách',
        detail: 'Không viết chúng tôi cung cấp giải pháp toàn diện. Viết đúng thứ khách bớt được: bớt bao nhiêu giờ, bớt bao nhiêu tiền, bớt rủi ro gì. Nếu không viết được thành đại lượng, hãy viết thành một tình huống cụ thể mà khách thoát khỏi. Đây là chỗ phần lớn bản mô tả mô hình trở nên vô nghĩa.',
      },
      {
        name: 'Chọn cách thu tiền và giải thích vì sao chọn cách đó',
        detail: 'Các dạng thường gặp: bán đứt theo sản phẩm, thu theo mức sử dụng, thuê bao định kỳ, hoa hồng trên giao dịch, cho thuê tài sản, bán rẻ máy và lãi ở vật tư tiêu hao, miễn phí cơ bản và thu ở bản nâng cao. Mỗi cách kéo theo một kiểu dòng tiền và một kiểu rủi ro. Bắt buộc viết một câu vì sao cách này hợp với khách và với chi phí của bạn hơn hai cách còn lại.',
      },
      {
        name: 'Vẽ mạch tiền từ đầu tới cuối',
        detail: 'Với một đơn hàng điển hình: khách trả bao nhiêu, ai lấy đi phần nào trên đường (sàn, đối tác giao, hoa hồng người bán, chiết khấu đại lý), chi phí trực tiếp là bao nhiêu, còn lại bao nhiêu trước chi phí cố định. Nhiều mô hình nghe rất hay sụp ở bước này vì tổng phần bị lấy đi trên đường lớn hơn phần chênh lệch.',
      },
      {
        name: 'Kiểm bằng ba câu hỏi phòng thủ',
        detail: 'Nếu ngày mai một đối thủ có nhiều vốn hơn làm y hệt thì ai giữ được khách và vì sao. Nếu kênh bán chính bị chặn hoặc tăng giá gấp đôi thì mô hình còn sống không. Nếu khách lớn nhất chiếm bao nhiêu phần trăm doanh thu và họ rời đi thì chuyện gì xảy ra. Ba câu này lộ ra điểm gãy nhanh hơn mọi bản phân tích thị trường.',
      },
    ],
    scenario:
      'Một xưởng gốm thủ công sáu người ở ngoại thành bán chủ yếu qua các phiên chợ cuối tuần và vài đơn lẻ trên mạng xã hội. Doanh thu tháng nào cũng thất thường và phụ thuộc thời tiết. Chủ xưởng ngồi vẽ lại mạch tiền và phát hiện: giá bán trung bình một sản phẩm 180 nghìn, chi phí đất và men khoảng 35 nghìn, nhưng thời gian một thợ bỏ ra cho mỗi món quy đổi khoảng 60 nghìn, cộng phí gian hàng chợ phiên chia đều cho số món bán được lên tới 40 nghìn vào những phiên vắng. Anh thử ba hướng thu tiền khác nhau trong ba tháng. Hướng một, bán sỉ cho quán cà phê: giá chỉ còn 110 nghìn nhưng đơn lớn và đều, không mất phí gian hàng. Hướng hai, lớp trải nghiệm nặn gốm cuối tuần tại xưởng: 250 nghìn một người, chi phí vật liệu 30 nghìn, một buổi 12 người, và khách thường mua thêm sản phẩm sau đó. Hướng ba, giữ nguyên chợ phiên. Sau ba tháng, hướng hai tạo ra tiền còn lại trên mỗi giờ thợ cao gấp nhiều lần và quan trọng hơn là thu tiền trước theo lịch đặt chỗ, giúp xưởng có tiền mua nguyên liệu đầu tháng. Anh chuyển trọng tâm sang lớp trải nghiệm, giữ bán sỉ như nguồn nền, và chỉ giữ hai phiên chợ lớn nhất trong năm để tìm khách mới. Sản phẩm không đổi, cách kiếm tiền đổi.',
    comparison: [
      { weak: 'Mô tả mô hình bằng danh sách sản phẩm và dịch vụ mình có thể làm.', mature: 'Mô tả bằng một mạch tiền cụ thể: khách nào trả bao nhiêu vì lý do gì, tiền đi qua ai, còn lại bao nhiêu trên mỗi đơn.' },
      { weak: 'Chọn cách thu tiền giống hệt những người xung quanh trong ngành vì đó là cách ai cũng làm.', mature: 'Thử ít nhất hai cách thu tiền khác nhau trên cùng một sản phẩm trong một quý và so bằng tiền còn lại trên mỗi giờ hoặc mỗi đơn vị năng lực.' },
      { weak: 'Nhắm tới mọi người có thể dùng được sản phẩm, tin rằng thị trường càng rộng càng an toàn.', mature: 'Chọn một nhóm hẹp mà bạn giải quyết vấn đề tốt hơn hẳn, vì mô hình chỉ chạy được khi thông điệp, kênh bán và chi phí phục vụ cùng hướng về một nhóm.' },
    ],
    mistakes: [
      'Nhầm mô hình kinh doanh với mô tả sản phẩm: viết ba trang về tính năng và không có dòng nào nói về việc ai trả tiền, trả bao nhiêu và tiền bị chia cho ai trên đường đi.',
      'Bỏ quên chi phí phục vụ khác nhau giữa các nhóm khách: cùng một mức giá nhưng nhóm khách này tốn gấp bốn lần thời gian chăm sóc, khiến nhóm khách tưởng là lớn nhất lại là nhóm làm mất tiền nhiều nhất.',
      'Xây toàn bộ mô hình trên một kênh duy nhất do người khác kiểm soát — một sàn, một nền tảng quảng cáo, một nhà phân phối — mà không có phương án hai, nên mọi thay đổi chính sách của họ đều là rủi ro sống còn.',
    ],
    worksheet: [
      'Viết ba vai riêng biệt cho sản phẩm của bạn: ai dùng, ai trả tiền, ai có thể phủ quyết quyết định mua. Có phải cùng một người không?',
      'Với một đơn hàng điển hình, liệt kê mọi khoản bị lấy đi trên đường từ tay khách tới tay bạn và ghi số tiền của từng khoản.',
      'Bạn đang thu tiền theo cách nào? Viết một câu giải thích vì sao cách đó hợp hơn hai cách thay thế khác mà bạn đã cân nhắc.',
      'Khách hàng lớn nhất chiếm bao nhiêu phần trăm doanh thu ba tháng gần nhất? Nếu họ dừng vào tháng sau, bạn còn bao nhiêu tuần vận hành bình thường?',
      'Nếu kênh bán chính của bạn tăng phí gấp đôi trong tháng tới, mô hình còn dương không? Viết con số, không viết cảm nhận.',
    ],
    exercises: [
      { label: 'Giải phẫu ba doanh nghiệp quen', text: 'Chọn ba doanh nghiệp bạn hay mua hàng thuộc ba ngành khác nhau. Với mỗi cái, viết một trang: ai trả tiền, thu theo cách nào, chi phí lớn nhất đoán là gì, và điểm gãy dễ thấy nhất của mô hình.', level: 'e' },
      { label: 'Bảng mạch tiền một đơn', text: 'Vẽ sơ đồ một đơn hàng của chính bạn từ lúc khách bấm mua tới lúc tiền vào tài khoản, ghi rõ từng khoản bị trừ và số ngày tiền nằm ở mỗi chặng.', level: 'e' },
      { label: 'Bốn cách thu tiền cho một sản phẩm', text: 'Lấy đúng một sản phẩm hoặc dịch vụ bạn đang có và viết bốn cách thu tiền khác nhau cho nó. Với mỗi cách, ghi một ưu điểm và một rủi ro cụ thể về dòng tiền.', level: 'e' },
      { label: 'So hai nhóm khách bằng chi phí phục vụ', text: 'Lấy dữ liệu ba tháng, chia khách thành hai nhóm và tính riêng doanh thu trung bình cùng số giờ hoặc số lần hỗ trợ trung bình cho mỗi nhóm. Viết kết luận về nhóm nào thực sự đóng góp nhiều hơn.', level: 'm' },
      { label: 'Thử một mô hình phụ trong 30 ngày', text: 'Chọn một cách thu tiền khác với cách hiện tại và chạy thử trên quy mô nhỏ trong một tháng, giữ nguyên sản phẩm. Ghi lại doanh thu, chi phí trực tiếp và thời gian bạn bỏ ra, rồi so với mô hình cũ trên cùng một đơn vị so sánh.', level: 'm' },
      { label: 'Bài kiểm tra phụ thuộc kênh', text: 'Liệt kê mọi kênh mang khách tới cho bạn kèm tỷ trọng. Với kênh lớn nhất, viết kế hoạch một trang cho tình huống kênh đó biến mất trong 30 ngày: bạn làm gì tuần 1, tuần 2, tuần 3, tuần 4.', level: 'm' },
      { label: 'Thiết kế lại mô hình từ ràng buộc', text: 'Giả định bạn bị cấm dùng cách kiếm tiền hiện tại. Thiết kế lại toàn bộ mô hình với ràng buộc đó, tính lại mạch tiền cho một đơn, và trình bày cho một người trong ngành nghe rồi ghi lại phản đối của họ.', level: 'h' },
      { label: 'Thử thách 7 ngày: lần theo mạch tiền tới tận cùng', text: 'Bảy ngày, mỗi ngày trả lời bằng con số thật một câu: ngày 1 ai trả tiền, ngày 2 trung bình bao nhiêu một lần, ngày 3 bao nhiêu bị lấy đi trên đường, ngày 4 chi phí trực tiếp bao nhiêu, ngày 5 tần suất mua lại, ngày 6 chi phí có thêm một khách, ngày 7 tiền còn lại một khách trong 12 tháng. Ngày nào không có số thì ghi rõ đang thiếu dữ liệu gì và lấy ở đâu.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao hai doanh nghiệp bán cùng một sản phẩm lại có thể có kết quả tài chính rất khác nhau?',
        a: 'Vì phần lớn kết quả nằm ở cấu trúc chứ không ở sản phẩm. Khác nhau ở cách thu tiền quyết định thời điểm tiền vào và mức độ ổn định; khác nhau ở kênh quyết định bao nhiêu phần trăm bị lấy đi trước khi tới tay bạn; khác nhau ở nhóm khách quyết định chi phí phục vụ mỗi đơn. Một xưởng gốm bán lẻ tại chợ phiên và một xưởng gốm bán trải nghiệm tại chỗ có cùng cái lò, cùng loại đất, nhưng tiền còn lại trên mỗi giờ thợ và thời điểm nhận tiền hoàn toàn khác nhau.',
      },
      {
        q: 'Người dùng và người trả tiền là hai vai khác nhau kéo theo hệ quả gì trong thiết kế mô hình?',
        a: 'Nó kéo theo hai bộ tiêu chí đánh giá và hai thông điệp phải cùng đúng một lúc. Sản phẩm phải đủ tốt để người dùng không bỏ, và phải chứng minh được giá trị theo ngôn ngữ của người trả tiền để họ tiếp tục chi. Bỏ quên một trong hai gây ra hai kiểu thất bại quen thuộc: sản phẩm được người dùng yêu thích nhưng không ai chịu trả tiền, hoặc hợp đồng được ký nhưng người dùng không dùng và tới kỳ gia hạn thì bị cắt. Trong thực tế, việc cần làm là xác định rõ ai quyết chi, ai dùng, ai phủ quyết, rồi thiết kế bằng chứng giá trị riêng cho từng vai.',
      },
      {
        q: 'Vì sao phụ thuộc gần như toàn bộ vào một kênh bán lại nguy hiểm ngay cả khi kênh đó đang hiệu quả?',
        a: 'Vì hiệu quả hiện tại không phải là thứ bạn kiểm soát. Chủ kênh có thể đổi phí, đổi thuật toán phân phối, đổi chính sách danh mục hoặc mở dịch vụ cạnh tranh trực tiếp với bạn, và họ làm những việc đó vì lợi ích của họ chứ không vì bạn. Doanh nghiệp phụ thuộc một kênh thực chất đang thuê toàn bộ quan hệ khách hàng của mình. Việc cần làm không phải bỏ kênh đang hiệu quả mà là dùng nó để xây một tài sản bạn giữ được: danh sách khách hàng liên hệ trực tiếp được, một tỷ trọng doanh thu tối thiểu từ kênh riêng, và quan hệ đủ chặt để khách tìm lại bạn khi kênh trung gian biến mất.',
      },
    ],
    plan7:
      'Ngày 1: viết rõ ba vai người dùng, người trả tiền, người phủ quyết cho sản phẩm của bạn. Ngày 2: vẽ mạch tiền của một đơn hàng điển hình với số thật. Ngày 3: liệt kê bốn cách thu tiền thay thế và chọn hai cái đáng thử. Ngày 4: tính chi phí phục vụ tách theo hai nhóm khách. Ngày 5: trả lời ba câu hỏi phòng thủ về đối thủ, kênh và khách lớn nhất. Ngày 6: viết một trang mô tả mô hình mới bạn muốn thử kèm cách đo. Ngày 7: đưa bản mô tả cho một người trong ngành và ghi lại mọi phản đối của họ mà không tranh luận.',
    evidence:
      'Bằng chứng thuyết phục là một trang mô hình có số thật của chính bạn: mạch tiền một đơn hàng, tỷ trọng từng kênh, chi phí phục vụ tách theo nhóm khách, và bản so sánh trước sau khi bạn đổi cách thu tiền. Nếu bạn từng chuyển một phần doanh thu sang mô hình khác, hãy giữ lại số của cả hai giai đoạn — đó là thứ khó bịa nhất. Trong phỏng vấn cho vị trí quản lý hoặc sản phẩm, khả năng vẽ nhanh mạch tiền của chính công ty đang tuyển bạn trên một tờ giấy tạo ấn tượng mạnh hơn nhiều so với việc kể tên các khung lý thuyết. Trong CV: tái cấu trúc nguồn doanh thu của xưởng từ bán lẻ sự kiện sang lớp trải nghiệm thu tiền trước, nâng tiền còn lại trên mỗi giờ thợ và giảm phụ thuộc vào thời tiết cuối tuần.',
    references: [
      { label: 'Harvard Business Review — chủ đề mô hình kinh doanh', url: 'https://hbr.org/topic/subject/business-models', type: 'article', needsReview: true },
      { label: 'Y Combinator Startup Library', url: 'https://www.ycombinator.com/library', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 4 — Lập kế hoạch kinh doanh
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Kế hoạch kinh doanh có giá trị không nằm ở độ dày mà ở việc nó buộc bạn viết ra những con số và giả định mà sau này thực tế sẽ chấm điểm. Một bản kế hoạch tốt là bản có thể bị chứng minh là sai theo từng phần: nếu tháng thứ tư số đơn chỉ bằng một nửa dự báo, bạn phải biết ngay dòng nào trong bản kế hoạch đã sai và điều đó kéo theo phải sửa gì. Bản kế hoạch dài ba mươi trang toàn tính từ không làm được việc đó, nên nó chỉ là tài liệu trình bày, không phải công cụ điều hành.',
    why: {
      work: 'Mọi đề xuất ngân sách trong công ty đều là một bản kế hoạch kinh doanh thu nhỏ. Người viết được phần giả định, phần số và phần điều kiện dừng sẽ được duyệt nhanh hơn, vì người duyệt nhìn thấy rủi ro đã được nghĩ tới thay vì bị giấu đi.',
      interview:
        'Với vị trí trưởng nhóm trở lên, câu hỏi thường gặp là bạn sẽ triển khai mảng này trong sáu tháng đầu thế nào. Trả lời tốt cần có mốc thời gian, nguồn lực cần, giả định lớn nhất, và cách bạn biết mình đi chệch sớm — chính là bộ khung của một kế hoạch.',
      study:
        'Kế hoạch học tập cho một chứng chỉ hay một chuyển hướng nghề nghiệp có cùng cấu trúc: mục tiêu đo được, nguồn lực bỏ ra, mốc kiểm tra, và tiêu chí điều chỉnh. Người viết được kế hoạch kinh doanh thường viết được kế hoạch học tập không bị vỡ sau hai tuần.',
      life: 'Các dự định lớn của gia đình như mua nhà, sinh con, hay để một người tạm nghỉ việc đều cần cùng thứ: bảng dòng tiền theo tháng, giả định thu nhập, và ngưỡng an toàn. Viết ra khiến những cuộc trò chuyện khó trở nên bàn được thay vì tránh né.',
    },
    framework: [
      {
        name: 'Chốt mục tiêu và phạm vi bằng một câu',
        detail: 'Viết một câu duy nhất dạng: trong 12 tháng tới, phục vụ nhóm khách nào, ở đâu, đạt mức doanh thu và mức lợi nhuận trước chi phí cố định bao nhiêu, với bao nhiêu người. Nếu câu này không viết được thì mọi phần sau chỉ là liệt kê ước muốn. Đồng thời ghi rõ điều bạn sẽ không làm trong 12 tháng đó.',
      },
      {
        name: 'Viết giả định nền trước khi viết số',
        detail: 'Mọi con số dự báo đều là kết quả của giả định. Tách riêng danh sách giả định: bao nhiêu khách mỗi tháng, tỷ lệ chốt bao nhiêu, giá trung bình bao nhiêu, tỷ lệ quay lại bao nhiêu, chi phí có thêm một khách bao nhiêu. Ghi rõ giả định nào có dữ liệu thật, giả định nào là ước lượng, giả định nào là đoán.',
      },
      {
        name: 'Dựng ba kịch bản, không phải một',
        detail: 'Dựng cột thận trọng, cột cơ sở và cột thuận lợi bằng cách thay đổi hai đến ba giả định nhạy nhất, thường là số lượng khách và giá. Điều quan trọng không phải ba cột đẹp mà là câu trả lời cho một câu hỏi: ở cột thận trọng, tiền mặt có bao giờ về âm không và vào tháng thứ mấy.',
      },
      {
        name: 'Chuyển kế hoạch thành lịch hành động 90 ngày',
        detail: 'Kế hoạch 12 tháng chỉ định hướng; thứ điều hành được là 90 ngày. Với mỗi tháng viết: ba việc phải xong, ai chịu trách nhiệm, chi bao nhiêu, và chỉ số nào cho biết đã xong thật. Việc không có người tên cụ thể và không có ngày là việc sẽ không xảy ra.',
      },
      {
        name: 'Đặt điểm rà và điều kiện đổi hướng',
        detail: 'Viết trước: cuối tháng thứ 3 và thứ 6 sẽ nhìn lại chỉ số nào, ngưỡng nào thì tiếp tục, ngưỡng nào thì cắt giảm, ngưỡng nào thì dừng hẳn. Đây là phần hay bị bỏ nhất và cũng là phần cứu người viết khỏi việc bám vào một kế hoạch đã rõ ràng không chạy.',
      },
    ],
    scenario:
      'Một người có mười năm nấu bếp muốn mở dịch vụ cơm trưa văn phòng giao theo suất tại khu vực có nhiều toà nhà cho thuê, và cần vay ngân hàng một khoản để thuê bếp cùng mua thiết bị. Thay vì viết một bản kế hoạch mô tả tầm nhìn, anh viết bốn trang. Trang một: câu mục tiêu duy nhất, phục vụ ba toà nhà trong bán kính 1,5 km, mục tiêu 220 suất mỗi ngày làm việc vào tháng thứ 9, và ghi rõ không nhận tiệc và không mở cửa hàng ăn tại chỗ trong năm đầu. Trang hai: danh sách 14 giả định, trong đó chỉ có 3 giả định có dữ liệu thật từ hai tuần bán thử tại một toà nhà. Trang ba: ba kịch bản theo số suất mỗi ngày là 120, 180 và 240, với cùng bảng chi phí; cột thận trọng cho thấy tiền mặt về âm vào tháng thứ 5 nếu không giảm được chi phí bếp. Trang bốn: lịch 90 ngày với ba việc mỗi tháng và tên người phụ trách, cùng hai điểm rà. Ngân hàng hỏi đúng vào cột thận trọng và vào cách anh xử lý tháng thứ 5; vì đã tính trước, anh trả lời được bằng phương án thuê bếp chia ca thay vì thuê nguyên căn. Thực tế sáu tháng sau, số suất đạt gần cột cơ sở nhưng chi phí giao hàng cao hơn giả định 40 phần trăm — và vì chi phí giao hàng là một dòng riêng trong bảng giả định, anh phát hiện ra ngay ở kỳ rà tháng thứ 3 chứ không phải khi đã hết tiền.',
    comparison: [
      { weak: 'Dự báo doanh thu bằng cách lấy quy mô thị trường nhân với một phần trăm thị phần nghe hợp lý.', mature: 'Dự báo từ dưới lên: bao nhiêu khách tiếp cận được mỗi tuần, tỷ lệ chốt bao nhiêu, giá trung bình bao nhiêu, và mỗi con số đó lấy từ đâu.' },
      { weak: 'Viết một kịch bản duy nhất và mặc định nó sẽ xảy ra, nên khi lệch thì không có phương án nào chuẩn bị sẵn.', mature: 'Viết ba kịch bản và trả lời trước câu hỏi tiền mặt âm vào tháng nào ở kịch bản xấu, kèm hành động cắt giảm đã định sẵn.' },
      { weak: 'Coi bản kế hoạch là tài liệu để trình bày với ngân hàng hoặc nhà đầu tư rồi cất vào ngăn kéo.', mature: 'Coi bản kế hoạch là bảng tính sống, mỗi tháng điền số thực tế cạnh số dự báo và ghi lý do chênh lệch.' },
    ],
    mistakes: [
      'Bỏ quên chi phí không đều đặn nhưng chắc chắn xảy ra: sửa chữa thiết bị, hàng hỏng, thưởng cuối năm, chi phí đăng ký và tuân thủ, khiến bảng dự báo trông đẹp cho tới quý thứ hai.',
      'Đặt mọi mốc quan trọng vào cùng một tháng vì trên giấy chúng không xung đột, trong khi thực tế chúng cạnh tranh cùng một nguồn lực và cùng một người.',
      'Viết kế hoạch bằng con số tổng năm thay vì theo tháng, che mất chuyện mùa vụ và che mất tháng mà tiền mặt về âm — sai lầm này khiến nhiều doanh nghiệp có lãi trên giấy vẫn hết tiền.',
    ],
    worksheet: [
      'Viết một câu mục tiêu 12 tháng gồm nhóm khách, địa bàn, mức doanh thu, mức lợi nhuận trước chi phí cố định và số người. Kèm một câu về những gì bạn sẽ không làm.',
      'Liệt kê mọi giả định nằm dưới dự báo doanh thu của bạn và đánh dấu từng cái là có dữ liệu, ước lượng, hay đoán. Bao nhiêu phần trăm là đoán?',
      'Thay đổi hai giả định nhạy nhất theo hướng xấu đi 30 phần trăm. Tháng nào tiền mặt về âm? Bạn sẽ cắt khoản nào đầu tiên?',
      'Viết ba việc phải xong trong 30 ngày tới, mỗi việc kèm một tên người, một ngày, một số tiền và một dấu hiệu cho biết đã xong thật.',
      'Cuối tháng thứ 3 bạn sẽ nhìn vào đúng chỉ số nào? Ngưỡng nào thì tiếp, ngưỡng nào thì cắt giảm, ngưỡng nào thì dừng?',
    ],
    exercises: [
      { label: 'Một trang trước ba mươi trang', text: 'Nén toàn bộ kế hoạch của bạn vào đúng một trang gồm mục tiêu, khách hàng, cách kiếm tiền, ba con số chính và ba rủi ro lớn nhất. Đưa cho một người ngoài ngành đọc trong ba phút và nhờ họ kể lại; ghi lại chỗ họ hiểu sai.', level: 'e' },
      { label: 'Phân loại giả định', text: 'Lập bảng ba cột dữ liệu thật, ước lượng, đoán và xếp toàn bộ giả định của bạn vào. Đếm tỷ lệ mỗi cột và viết cách bạn sẽ chuyển hai giả định từ cột đoán sang cột ước lượng trong hai tuần.', level: 'e' },
      { label: 'Dự báo từ dưới lên', text: 'Bỏ mọi con số thị trường tổng thể. Xây lại dự báo doanh thu tháng đầu tiên bằng chuỗi: số người tiếp cận, tỷ lệ quan tâm, tỷ lệ mua, giá trung bình. Ghi nguồn của từng tỷ lệ.', level: 'e' },
      { label: 'Ba kịch bản trên bảng tính', text: 'Dựng bảng tính 12 tháng có ô đầu vào riêng cho các giả định để đổi một ô là cả bảng đổi theo. Tạo ba cột kịch bản và ghi lại tháng tiền mặt thấp nhất ở mỗi cột.', level: 'm' },
      { label: 'Kiểm tra bằng người thứ ba', text: 'Đưa bảng tính cho một người có kinh nghiệm tài chính hoặc một chủ doanh nghiệp cùng ngành và yêu cầu họ tìm ba giả định lạc quan nhất. Sửa lại và ghi mức chênh trước sau.', level: 'm' },
      { label: 'Lịch 90 ngày có chủ sở hữu', text: 'Chuyển kế hoạch năm thành 9 việc lớn cho 3 tháng tới, mỗi việc có người phụ trách, ngày hoàn thành, ngân sách và tiêu chí hoàn thành. Rà lại sau 30 ngày và ghi tỷ lệ đúng hạn.', level: 'm' },
      { label: 'Sổ chênh lệch dự báo và thực tế', text: 'Trong ba tháng, mỗi cuối tháng điền số thực tế cạnh số dự báo cho năm dòng quan trọng nhất và viết một câu giải thích cho mỗi chênh lệch lớn hơn 20 phần trăm. Cuối quý, đọc lại toàn bộ và rút ra hai điều bạn thường xuyên ước lượng sai.', level: 'h' },
      { label: 'Thử thách 7 ngày: dựng bảng tính điều hành', text: 'Bảy ngày, mỗi ngày hoàn thiện một phần: giả định, doanh thu, chi phí trực tiếp, chi phí cố định, dòng tiền theo tháng, ba kịch bản, và cuối cùng là bảng điểm rà. Ngày thứ bảy in ra một trang tóm tắt và dán ở chỗ bạn làm việc.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao dự báo doanh thu từ trên xuống bằng quy mô thị trường nhân thị phần lại là cách làm yếu?',
        a: 'Vì nó không nối với bất kỳ hành động nào bạn kiểm soát được. Con số thị phần một phần trăm không cho biết tuần này phải gặp bao nhiêu khách, cần bao nhiêu người bán, ngân sách tiếp cận là bao nhiêu. Khi thực tế lệch, bạn cũng không biết dòng nào sai để sửa. Dự báo từ dưới lên có nhược điểm là nhìn nhỏ và kém hấp dẫn, nhưng nó cho phép truy nguyên: nếu doanh thu chỉ bằng một nửa, bạn biết ngay là do số khách tiếp cận, do tỷ lệ chốt hay do giá trung bình, và mỗi nguyên nhân có cách xử lý khác nhau.',
      },
      {
        q: 'Một doanh nghiệp có lãi trên bảng dự báo cả năm nhưng vẫn hết tiền vào tháng thứ năm. Điều này xảy ra như thế nào?',
        a: 'Vì lãi và tiền là hai thứ khác nhau về thời điểm. Lãi cả năm là kết quả cộng dồn, còn tiền mặt là số dư tại từng thời điểm. Doanh nghiệp có thể phải trả trước tiền hàng, tiền thuê, tiền lương trong khi khách trả sau 30 tới 45 ngày; hoặc phải mua thiết bị một lần trong khi lợi ích trải ra hai năm. Đây chính là lý do bảng kế hoạch phải lập theo tháng và phải có dòng số dư tiền cuối tháng. Chương về dòng tiền sẽ đi sâu vào cơ chế này; ở mức kế hoạch, quy tắc tối thiểu là không bao giờ đọc dự báo dưới dạng tổng năm.',
      },
      {
        q: 'Điều kiện dừng viết trước có mâu thuẫn với sự kiên trì cần thiết trong kinh doanh không?',
        a: 'Không, vì hai thứ áp dụng cho hai loại quyết định khác nhau. Kiên trì có ích khi hướng đi đã được xác nhận bằng dữ liệu và thứ còn thiếu là thời gian cùng sự thực thi. Điều kiện dừng bảo vệ bạn ở tình huống khác: khi dữ liệu liên tục nói không nhưng bạn không nhận ra vì mỗi tháng chỉ tệ hơn một chút. Cách viết đúng không phải là một ngưỡng cứng duy nhất, mà là ngưỡng kèm câu hỏi chẩn đoán: nếu không đạt, nguyên nhân nằm ở giả định nào, ta đã thử sửa nguyên nhân đó chưa, và ta còn bao nhiêu tháng tiền mặt để thử tiếp.',
      },
    ],
    plan7:
      'Ngày 1: viết câu mục tiêu 12 tháng và danh sách những việc sẽ không làm. Ngày 2: liệt kê và phân loại toàn bộ giả định thành dữ liệu, ước lượng, đoán. Ngày 3: dựng dự báo doanh thu từ dưới lên theo tháng. Ngày 4: dựng bảng chi phí tách trực tiếp và cố định, thêm các khoản không đều đặn. Ngày 5: tạo ba kịch bản và tìm tháng tiền mặt thấp nhất ở kịch bản thận trọng. Ngày 6: viết lịch 90 ngày có tên người và tiêu chí hoàn thành. Ngày 7: đưa toàn bộ cho một người khó tính đọc và ghi lại ba giả định họ cho là lạc quan nhất.',
    evidence:
      'Bằng chứng ở đây là bảng tính điều hành có lịch sử: cột dự báo, cột thực tế và cột ghi chú lý do chênh lệch qua ít nhất sáu tháng. Nó chứng minh hai điều mà nhà tuyển dụng và người cho vay đều quan tâm: bạn lập kế hoạch bằng số và bạn học từ chênh lệch. Kèm theo là bản lịch 90 ngày có tên người và tỷ lệ hoàn thành đúng hạn. Trong phỏng vấn quản lý, hãy kể một lần dự báo của bạn sai và cách bạn phát hiện sớm nhờ tách giả định thành dòng riêng. Trong CV: xây bảng kế hoạch tài chính 12 tháng theo ba kịch bản cho một dịch vụ ăn uống, phát hiện lệch chi phí giao hàng 40 phần trăm ngay ở kỳ rà tháng thứ 3 và điều chỉnh trước khi ảnh hưởng tới dòng tiền.',
    references: [
      { label: 'U.S. Small Business Administration — Business Guide (hướng dẫn lập kế hoạch, bối cảnh Mỹ)', url: 'https://www.sba.gov/business-guide', type: 'article' },
      { label: 'Harvard Business Review — chủ đề chiến lược', url: 'https://hbr.org/topic/subject/strategy', type: 'article', needsReview: true },
    ],
  }),
  // ─────────────────────────────────────────────────────────────────────────
  // Chương 5 — Unit Economics
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Unit economics là phép soi doanh nghiệp ở mức một đơn vị: một đơn hàng, một khách hàng, một ghế, một chuyến giao. Câu hỏi duy nhất nó trả lời là bán thêm một đơn vị nữa thì bạn giàu lên hay nghèo đi. Nếu con số đó âm, mọi nỗ lực tăng trưởng chỉ làm bạn mất tiền nhanh hơn, và không có quy mô nào cứu được điều đó nếu chi phí không thực sự giảm theo quy mô. Lưu ý quan trọng: chương này trình bày cách tư duy và cách tự tính để điều hành, không phải chuẩn mực kế toán; khi cần con số dùng cho báo cáo tài chính, quyết toán thuế hay hồ sơ vay vốn, bạn phải làm việc với kế toán có chuyên môn vì cách phân bổ chi phí trong kế toán có quy định riêng.',
    why: {
      work: 'Trong công ty, người trình bày được lợi nhuận góp trên mỗi đơn vị của một sản phẩm sẽ thay đổi được cuộc tranh luận về việc nên đẩy dòng nào. Rất nhiều nhóm cãi nhau về doanh thu trong nhiều tháng vì chưa ai ngồi tính xem mỗi đơn hàng để lại bao nhiêu.',
      interview:
        'Với vị trí liên quan tới sản phẩm, tăng trưởng, vận hành hay bán hàng, câu hỏi làm sao bạn biết một kênh có hiệu quả gần như chắc chắn xuất hiện. Ứng viên nhắc tới chi phí có được một khách và giá trị vòng đời của khách bằng số cụ thể sẽ khác hẳn ứng viên nói về lượt tiếp cận.',
      study:
        'Học phân tích tài chính doanh nghiệp qua các bảng biểu lớn dễ mất phương hướng. Bắt đầu từ một đơn vị nhỏ nhất rồi nhân lên là cách dựng lại toàn bộ bức tranh mà vẫn kiểm tra được từng bước bằng trực giác.',
      life: 'Cùng logic dùng được cho quyết định cá nhân có tính lặp lại: chạy thêm một cuốc xe, nhận thêm một học viên kèm riêng, cho thuê thêm một phòng. Tính đủ chi phí biến đổi và thời gian bỏ ra thường cho kết quả khác hẳn cảm giác ban đầu.',
    },
    framework: [
      {
        name: 'Chọn đơn vị đúng và cố định nó',
        detail: 'Đơn vị phải là thứ nhân lên được và có ý nghĩa với mô hình: một đơn hàng cho bán lẻ, một khách thuê bao cho phần mềm, một mét vuông giờ cho không gian, một chuyến cho vận chuyển. Chọn sai đơn vị làm mọi phép so sánh về sau vô nghĩa. Ghi rõ định nghĩa đơn vị bằng một câu và giữ nguyên nó trong ít nhất một quý.',
      },
      {
        name: 'Tách chi phí biến đổi ra khỏi chi phí cố định',
        detail: 'Chi phí biến đổi là phần tăng thêm khi có thêm một đơn vị: nguyên liệu, phí giao, phí thanh toán, hoa hồng, chi phí bao bì, phần công lao động trực tiếp tính được theo đơn. Chi phí cố định là phần không đổi trong ngắn hạn: thuê mặt bằng, lương cố định, phần mềm trả theo tháng. Nhầm hai loại này là lỗi tính toán phổ biến nhất và luôn theo hướng làm mọi thứ trông đẹp hơn thực tế.',
      },
      {
        name: 'Tính lợi nhuận góp trên một đơn vị',
        detail: 'Lấy doanh thu trên một đơn vị trừ toàn bộ chi phí biến đổi trên đơn vị đó. Con số còn lại là phần dùng để trả chi phí cố định và tạo lợi nhuận. Đừng làm tròn đẹp và đừng bỏ sót các khoản nhỏ như phí cổng thanh toán, tỷ lệ hoàn hàng, hàng hỏng, quà tặng kèm — cộng lại chúng thường ăn hết phần chênh lệch mà bạn tưởng là lãi.',
      },
      {
        name: 'Tính chi phí có được một khách và giá trị vòng đời',
        detail: 'Chi phí có được một khách là toàn bộ tiền tiếp thị và bán hàng trong kỳ chia cho số khách mới thật trong kỳ đó, gồm cả lương người bán và chi phí khuyến mãi. Giá trị vòng đời là lợi nhuận góp trung bình mỗi lần mua nhân số lần mua kỳ vọng. Cả hai đều là ước lượng và đều thay đổi theo kênh, vì vậy phải tính riêng cho từng kênh chứ không tính gộp.',
      },
      {
        name: 'Tìm điểm hoà vốn và đòn bẩy để cải thiện',
        detail: 'Chia chi phí cố định tháng cho lợi nhuận góp một đơn vị, ra số đơn vị cần bán để hoà vốn. Sau đó xét bốn đòn bẩy theo thứ tự dễ làm: tăng giá, giảm chi phí biến đổi, tăng tần suất mua lại, giảm chi phí có được khách. Thử một đòn bẩy tại một thời điểm để còn biết cái nào có tác dụng.',
      },
    ],
    scenario:
      'Một shop bán đồ dùng nhà bếp trên sàn thương mại điện tử có doanh thu tăng đều và chủ shop tin rằng mình đang lãi vì tiền về tài khoản đều đặn. Khi ngồi tính trên một đơn hàng trung bình 285 nghìn, con số hiện ra như sau: giá vốn hàng 168 nghìn, phí sàn và phí thanh toán khoảng 12 phần trăm tương đương 34 nghìn, chi phí đóng gói 6 nghìn, phí vận chuyển shop hỗ trợ trung bình 15 nghìn, tỷ lệ hoàn hàng 7 phần trăm khiến mỗi đơn phải gánh thêm khoảng 12 nghìn chi phí chiều về và hàng hư hỏng. Lợi nhuận góp còn khoảng 50 nghìn một đơn. Nhưng chi phí quảng cáo tháng đó chia cho số đơn mới ra 62 nghìn. Nghĩa là mỗi đơn từ quảng cáo đang làm shop lỗ 12 nghìn, và càng đẩy ngân sách thì lỗ càng nhanh — điều bị che đi bởi doanh thu tăng và bởi các đơn từ khách cũ đang bù lỗ cho các đơn từ quảng cáo. Chủ shop tách riêng hai nhóm đơn, dừng ba nhóm sản phẩm giá thấp có tỷ lệ hoàn cao nhất, gộp bộ sản phẩm để nâng giá trị đơn trung bình lên 410 nghìn, và chuyển một phần ngân sách sang tin nhắn chăm khách cũ. Sau hai tháng, lợi nhuận góp một đơn lên khoảng 96 nghìn trong khi chi phí có được khách mới gần như không đổi. Doanh thu tăng chậm hơn trước, nhưng lần đầu tiên số dư cuối tháng dương ổn định.',
    comparison: [
      { weak: 'Đo sức khoẻ kinh doanh bằng doanh thu và bằng cảm giác tiền về đều.', mature: 'Đo bằng lợi nhuận góp trên một đơn vị và bằng quan hệ giữa chi phí có được khách với giá trị vòng đời của khách theo từng kênh.' },
      { weak: 'Tính chi phí có được khách bằng cách chia tiền quảng cáo cho tổng số đơn, gồm cả đơn của khách cũ.', mature: 'Chia cho số khách mới thật, và tính riêng cho từng kênh vì một kênh rẻ có thể mang về khách mua một lần rồi biến mất.' },
      { weak: 'Bỏ công của chính mình ra khỏi bảng tính vì đó là công nhà, nên mô hình trông có lãi khi thực ra chỉ đang tự trả lương cho mình dưới mức thị trường.', mature: 'Đưa một mức lương thị trường cho công việc mình đang làm vào chi phí, để biết doanh nghiệp có sống được khi bạn phải thuê người thay mình hay không.' },
    ],
    mistakes: [
      'Gộp chi phí cố định vào phép tính trên một đơn vị bằng cách chia đều theo số đơn hiện tại, khiến con số nhảy loạn mỗi tháng và không dùng được để ra quyết định về việc bán thêm một đơn.',
      'Tính giá trị vòng đời khách hàng bằng doanh thu thay vì bằng lợi nhuận góp, thổi phồng con số lên nhiều lần và dẫn tới việc chi quá tay cho quảng cáo trong nhiều tháng liền.',
      'Quên các khoản rò rỉ nhỏ nhưng đều: phí cổng thanh toán, tỷ lệ hoàn hàng, hàng vỡ, mã giảm giá, quà tặng kèm và chiết khấu cho khách quen — mỗi khoản vài phần trăm nhưng cộng lại đủ để biến lãi thành lỗ.',
    ],
    worksheet: [
      'Viết một câu định nghĩa đơn vị kinh tế của doanh nghiệp bạn và giải thích vì sao đó là đơn vị nhân lên được.',
      'Liệt kê mọi khoản chi phí tăng thêm khi bạn bán thêm đúng một đơn vị. Kiểm lại xem có bỏ sót phí thanh toán, hoàn hàng, hư hỏng, khuyến mãi không.',
      'Tính lợi nhuận góp trên một đơn vị bằng số thật của ba tháng gần nhất. Con số đó là bao nhiêu phần trăm doanh thu trên đơn vị?',
      'Tính chi phí có được một khách mới riêng cho từng kênh bạn đang dùng. Kênh nào đang lỗ trên mỗi khách mới?',
      'Với chi phí cố định hiện tại, bạn cần bán bao nhiêu đơn vị mỗi tháng để hoà vốn? Tháng gần nhất bạn bán được bao nhiêu?',
    ],
    exercises: [
      { label: 'Bóc tách một hoá đơn', text: 'Lấy một hoá đơn bán hàng thật gần nhất và bóc nó thành từng dòng chi phí biến đổi cho tới khi tổng khớp với số tiền thực nhận. Đánh dấu mọi khoản bạn phải đi tra mới biết.', level: 'e' },
      { label: 'Phân loại 20 khoản chi', text: 'Lấy 20 khoản chi tháng gần nhất và xếp vào hai cột biến đổi hoặc cố định. Với khoản nào lưỡng lự, viết câu hỏi kiểm: nếu tháng này không bán đơn nào thì khoản này còn phát sinh không?', level: 'e' },
      { label: 'Bảng lợi nhuận góp theo sản phẩm', text: 'Tính lợi nhuận góp cho từng nhóm sản phẩm hoặc dịch vụ bạn đang bán và sắp xếp giảm dần. Khoanh tròn nhóm có doanh thu cao nhưng lợi nhuận góp thấp nhất.', level: 'e' },
      { label: 'Chi phí có được khách theo kênh', text: 'Trong một tháng, gắn nguồn cho từng khách mới và tính chi phí có được khách riêng cho từng kênh. So sánh với lợi nhuận góp trung bình mỗi khách và viết kết luận nên dừng kênh nào.', level: 'm' },
      { label: 'Thử một đòn bẩy trong 30 ngày', text: 'Chọn đúng một đòn bẩy (tăng giá 10 phần trăm, hoặc gộp bộ để tăng giá trị đơn, hoặc đàm phán lại giá nhập) và chạy 30 ngày, giữ nguyên mọi thứ khác. Ghi lại lợi nhuận góp trước và sau cùng với thay đổi về số lượng bán.', level: 'm' },
      { label: 'Đưa lương của chính bạn vào bảng', text: 'Tính lại toàn bộ unit economics sau khi đã đưa vào một mức lương thị trường cho công việc bạn đang tự làm. Viết một đoạn về việc mô hình còn dương hay không và điều đó có ý nghĩa gì cho kế hoạch mở rộng.', level: 'm' },
      { label: 'Đường hoà vốn theo mùa', text: 'Dựng biểu đồ 12 tháng thể hiện số đơn vị bán được và số đơn vị hoà vốn theo từng tháng, có tính tới biến động chi phí cố định. Xác định các tháng âm và viết kế hoạch dự trữ tiền cho những tháng đó.', level: 'h' },
      { label: 'Thử thách 7 ngày: một con số mỗi ngày', text: 'Bảy ngày, mỗi ngày tính đúng một chỉ số bằng dữ liệu thật: giá trị đơn trung bình, giá vốn trên đơn, tổng phí nền tảng, tỷ lệ hoàn và chi phí kèm theo, lợi nhuận góp trên đơn, chi phí có được khách theo kênh, và cuối cùng là số đơn hoà vốn tháng. Ngày thứ bảy viết một trang kết luận về việc bạn nên đẩy hay nên siết.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao doanh thu tăng nhanh có thể là dấu hiệu nguy hiểm chứ không phải dấu hiệu tốt?',
        a: 'Vì nếu lợi nhuận góp trên một đơn vị âm sau khi trừ chi phí có được khách, thì mỗi đơn hàng mới là một khoản lỗ và tăng trưởng chỉ nhân khoản lỗ đó lên. Tình huống này rất dễ bị che giấu vì tiền vẫn về tài khoản đều đặn, còn các khoản chi thì rải rác và trả sau. Cách phát hiện là tách nhóm đơn từ khách mới ra khỏi nhóm đơn từ khách cũ rồi tính riêng: nếu nhóm khách cũ đang bù lỗ cho nhóm khách mới, doanh nghiệp thực chất đang mua tăng trưởng bằng lợi nhuận của chính mình.',
      },
      {
        q: 'Khi nào thì việc chấp nhận lỗ trên khách hàng đầu tiên là hợp lý, và điều kiện bắt buộc là gì?',
        a: 'Hợp lý khi khách hàng có tần suất mua lại đủ cao và tỷ lệ giữ chân đủ ổn định để tổng lợi nhuận góp qua vòng đời vượt chi phí có được khách trong một khoảng thời gian bạn chịu được. Ba điều kiện bắt buộc: một là tỷ lệ mua lại phải được đo bằng dữ liệu thật của chính bạn chứ không lấy từ chuẩn ngành; hai là bạn phải có đủ tiền mặt để sống qua khoảng thời gian hoàn vốn, vì đây là bài toán dòng tiền chứ không chỉ là bài toán lợi nhuận; ba là phải theo dõi theo từng nhóm khách vào cùng thời kỳ, vì tỷ lệ giữ chân của nhóm mới có thể xấu đi khi bạn mở rộng sang tệp khách kém phù hợp hơn.',
      },
      {
        q: 'Vì sao không nên phân bổ chi phí cố định vào phép tính lợi nhuận góp trên một đơn vị khi ra quyết định bán thêm?',
        a: 'Vì câu hỏi bán thêm một đơn vị nữa là câu hỏi về phần thay đổi, và chi phí cố định không thay đổi theo quyết định đó trong ngắn hạn. Nếu bạn phân bổ chi phí cố định theo số đơn hiện tại, con số sẽ nhảy mỗi khi sản lượng đổi và có thể khiến bạn từ chối một đơn hàng thực ra vẫn đóng góp dương vào chi phí cố định. Chi phí cố định thuộc về một câu hỏi khác, đó là câu hỏi hoà vốn: cần bao nhiêu đơn vị để phần đóng góp cộng lại phủ hết. Cần nói thêm rằng đây là logic ra quyết định quản trị; cách trình bày giá vốn và chi phí trong báo cáo tài chính chính thức tuân theo quy định kế toán riêng và nên do kế toán có chuyên môn thực hiện.',
      },
    ],
    plan7:
      'Ngày 1: định nghĩa đơn vị kinh tế và ghi lại bằng một câu. Ngày 2: bóc một hoá đơn thật thành từng dòng chi phí biến đổi. Ngày 3: phân loại toàn bộ chi phí tháng thành biến đổi và cố định. Ngày 4: tính lợi nhuận góp trên một đơn vị cho từng nhóm sản phẩm. Ngày 5: gắn nguồn cho khách mới và tính chi phí có được khách theo kênh. Ngày 6: tính điểm hoà vốn tháng và so với sản lượng thực tế. Ngày 7: chọn một đòn bẩy để thử trong 30 ngày và viết cách đo.',
    evidence:
      'Bằng chứng ở đây là một bảng unit economics của chính bạn với đủ ba lớp: bóc tách một đơn vị tới từng đồng, chi phí có được khách tách theo kênh, và bảng trước sau khi bạn kéo một đòn bẩy. Kèm theo là câu chuyện bạn đã dừng một nhóm sản phẩm hoặc một kênh vì số nói nó lỗ, dù nó đang đóng góp doanh thu — loại quyết định này rất khó và người phỏng vấn có kinh nghiệm nhận ra ngay giá trị của nó. Trong CV nên viết bằng cơ chế và kết quả: bóc tách unit economics cho 40 mã hàng, phát hiện chi phí có được khách vượt lợi nhuận góp ở kênh quảng cáo, tái cấu trúc danh mục và nâng lợi nhuận góp trên đơn từ khoảng 50 nghìn lên khoảng 96 nghìn trong 2 tháng.',
    references: [
      { label: 'First Round Review', url: 'https://review.firstround.com', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 6 — Quản lý dòng tiền
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Doanh nghiệp chết vì hết tiền, không phải vì hết lãi. Lãi là một con số kế toán tính theo kỳ, còn tiền mặt là thứ có hoặc không có vào đúng ngày phải trả lương và trả nhà cung cấp. Quản lý dòng tiền là công việc lặp lại hằng tuần: nhìn về phía trước mười ba tuần, biết trước tuần nào số dư xuống thấp nhất, và can thiệp khi còn kịp. Chương này trình bày cách làm mang tính điều hành; các con số dùng cho báo cáo tài chính, kê khai thuế hay hồ sơ tín dụng phải được kế toán có chuyên môn lập và kiểm, vì quy định về ghi nhận doanh thu, chi phí và thuế tại Việt Nam có yêu cầu cụ thể và thay đổi theo thời gian.',
    why: {
      work: 'Người quản lý một mảng có ngân sách mà biết dòng tiền vào ra theo tuần sẽ tránh được việc ký cam kết mua sắm rơi vào đúng tuần công ty căng tiền. Đây cũng là kỹ năng khiến bộ phận tài chính coi bạn là đồng minh thay vì nguồn rắc rối.',
      interview:
        'Ở vị trí điều hành, giám đốc vận hành hoặc quản lý cửa hàng, người phỏng vấn thường hỏi bạn xử lý thế nào khi khách chậm trả và nhà cung cấp đòi tiền. Câu trả lời có giá trị là câu có thứ tự ưu tiên chi rõ ràng và có hành động phòng ngừa từ trước, không phải câu nói sẽ cố xoay xở.',
      study:
        'Đọc báo cáo tài chính mà không hiểu chênh lệch giữa lãi và tiền là đọc một nửa. Nắm dòng tiền giúp bạn đọc được vì sao một công ty báo lãi vẫn phải đi vay, và vì sao một công ty lỗ vẫn sống khoẻ nhiều năm.',
      life: 'Ngân sách gia đình có đúng cấu trúc này ở quy mô nhỏ: thu nhập vào ngày nào, các khoản lớn rơi vào tháng nào, quỹ dự phòng bao nhiêu tháng. Người quen nhìn theo tuần thường không bị bất ngờ bởi những tháng có học phí và bảo hiểm rơi cùng nhau.',
    },
    framework: [
      {
        name: 'Dựng bảng dòng tiền mười ba tuần',
        detail: 'Một bảng đơn giản: cột là từng tuần trong ba tháng tới, hàng là tiền vào theo nguồn và tiền ra theo nhóm, dòng cuối là số dư cuối tuần. Mười ba tuần đủ dài để thấy vấn đề và đủ ngắn để ước lượng còn đáng tin. Cập nhật mỗi tuần vào cùng một ngày, đẩy cửa sổ về phía trước một tuần.',
      },
      {
        name: 'Rút ngắn chu kỳ tiền vào',
        detail: 'Các đòn bẩy cụ thể: yêu cầu đặt cọc theo phần trăm khi ký, chia thanh toán theo mốc thay vì trả một lần cuối, xuất hoá đơn ngay trong ngày hoàn thành thay vì gom cuối tháng, đặt chiết khấu nhỏ cho thanh toán sớm, và có quy trình nhắc nợ theo lịch cố định thay vì nhắc khi nhớ ra. Mỗi ngày rút ngắn được là một ngày bạn không phải đi vay.',
      },
      {
        name: 'Kéo dài và làm phẳng tiền ra',
        detail: 'Đàm phán kỳ hạn thanh toán với nhà cung cấp một cách minh bạch, chuyển các khoản mua lớn sang thuê hoặc trả góp khi chi phí tài chính hợp lý, dời các khoản chi không cấp bách ra khỏi tuần thấp điểm, và giữ lịch chi cố định để nhà cung cấp tin cậy. Kéo dài không có nghĩa là chây ì: mất uy tín thanh toán đắt hơn nhiều so với vài ngày lãi.',
      },
      {
        name: 'Giữ vùng đệm và xác định ngưỡng báo động',
        detail: 'Xác định số dư tối thiểu tuyệt đối không được chạm tới, thường tính bằng số tuần chi phí cố định. Đặt hai ngưỡng: ngưỡng vàng thì dừng mọi khoản chi có thể hoãn và tăng cường thu nợ; ngưỡng đỏ thì kích hoạt phương án đã chuẩn bị trước như hạn mức tín dụng, vay chủ sở hữu, hoặc giảm quy mô. Chuẩn bị hạn mức khi chưa cần, vì lúc cần thì rất khó xin.',
      },
      {
        name: 'Rà tuần và đối chiếu dự báo với thực tế',
        detail: 'Mỗi tuần dành ba mươi phút vào cùng một giờ: điền số thực tế của tuần vừa qua cạnh số đã dự báo, tìm mọi chênh lệch lớn và viết lý do, cập nhật mười ba tuần tiếp theo. Sau tám tuần bạn sẽ biết mình hay lạc quan ở khoản nào, và độ chính xác dự báo tăng lên rõ rệt.',
      },
    ],
    scenario:
      'Một xưởng in ấn và thi công biển hiệu phục vụ khách doanh nghiệp có doanh thu tốt và sổ sách báo lãi, nhưng tháng nào chủ xưởng cũng phải xoay tiền trả lương vào ngày mùng năm. Khi dựng bảng mười ba tuần, nguyên nhân hiện ra rõ ràng: khách doanh nghiệp thanh toán trung bình sau 52 ngày kể từ ngày nghiệm thu, trong khi vật tư phải trả nhà cung cấp trong 15 ngày và lương trả hằng tháng. Xưởng đang tài trợ vốn lưu động cho khách hàng của mình bằng tiền túi. Chủ xưởng làm bốn việc trong một quý: đưa điều khoản tạm ứng 40 phần trăm khi ký vào hợp đồng mới, tách nghiệm thu theo hạng mục để xuất hoá đơn sớm hơn thay vì đợi xong toàn bộ công trình, đặt lịch nhắc công nợ cố định vào thứ Ba hằng tuần với ba mức từ nhắn nhở tới gọi điện cho người phê duyệt, và mở một hạn mức thấu chi nhỏ ở ngân hàng vào lúc số liệu còn đẹp. Sau ba tháng, số ngày thu tiền trung bình giảm còn 31 ngày, tuần thấp nhất trong bảng không còn chạm ngưỡng đỏ, và điều bất ngờ với chính anh là hạn mức thấu chi gần như không phải dùng tới — nó chỉ cần tồn tại để anh ngủ được. Doanh thu quý đó không tăng, nhưng doanh nghiệp đã thôi ở trong trạng thái căng thẳng thường trực.',
    comparison: [
      { weak: 'Nhìn số dư tài khoản hôm nay để quyết định có chi khoản này không.', mature: 'Nhìn bảng mười ba tuần để biết tuần nào là tuần thấp nhất, rồi xếp khoản chi vào tuần chịu được.' },
      { weak: 'Nhắc khách trả tiền khi bắt đầu thấy thiếu tiền, và nhắc bằng cảm xúc.', mature: 'Có quy trình nhắc nợ chạy tự động theo lịch từ trước hạn, cùng một giọng chuyên nghiệp, không phụ thuộc vào việc bạn đang căng hay không.' },
      { weak: 'Đợi tới lúc khó khăn mới đi xin hạn mức tín dụng hoặc gọi vốn.', mature: 'Chuẩn bị nguồn dự phòng vào lúc số liệu còn tốt và bạn còn ở thế đàm phán, kể cả khi chưa cần dùng.' },
    ],
    mistakes: [
      'Nhầm doanh thu đã ghi nhận với tiền đã về: ký hợp đồng lớn rồi lập tức tăng chi phí cố định, trong khi tiền của hợp đồng đó chỉ về sau hai tháng và chỉ về nếu nghiệm thu đúng hẹn.',
      'Dùng tiền tạm ứng của dự án sau để trả chi phí của dự án trước, tạo ra một vòng quay chỉ đứng vững khi luôn có đơn mới — và sụp ngay ở tháng đầu tiên không có đơn.',
      'Cắt chi phí một cách đồng loạt theo tỷ lệ phần trăm khi thiếu tiền, làm hỏng cả những khoản đang tạo ra dòng tiền vào như chi phí bán hàng cho kênh đang hiệu quả.',
    ],
    worksheet: [
      'Số ngày trung bình từ lúc bạn hoàn thành công việc tới lúc tiền thật về tài khoản là bao nhiêu? Tính bằng mười hoá đơn gần nhất chứ không ước lượng.',
      'Trong mười ba tuần tới, tuần nào số dư dự kiến thấp nhất và thấp bao nhiêu? Khoản chi lớn nhất rơi vào tuần đó là gì?',
      'Số dư tối thiểu bạn cần giữ để yên tâm là bao nhiêu tuần chi phí cố định? Viết con số tuyệt đối bằng tiền.',
      'Liệt kê ba khoản chi trong tháng tới có thể dời sang tuần khác mà không gây thiệt hại thật. Bạn đã thử dời chưa?',
      'Nếu khách hàng lớn nhất chậm trả 45 ngày so với hẹn, bạn sẽ chi trả theo thứ tự ưu tiên nào? Viết danh sách theo thứ tự ngay bây giờ, trước khi chuyện đó xảy ra.',
    ],
    exercises: [
      { label: 'Dựng bảng mười ba tuần lần đầu', text: 'Tạo bảng tính với 13 cột tuần, điền tiền vào theo từng hợp đồng hoặc nguồn cụ thể và tiền ra theo nhóm. Đánh dấu ô số dư thấp nhất bằng màu và ghi ngày của tuần đó.', level: 'e' },
      { label: 'Đo số ngày thu tiền thật', text: 'Lấy mười hoá đơn gần nhất, tính số ngày từ ngày xuất tới ngày tiền về, rồi tính trung bình và giá trị lớn nhất. So sánh với điều khoản ghi trong hợp đồng.', level: 'e' },
      { label: 'Lịch nhắc nợ ba mức', text: 'Soạn ba mẫu tin nhắn hoặc thư nhắc công nợ tương ứng ba thời điểm: trước hạn ba ngày, đúng hạn, và quá hạn bảy ngày. Đặt lịch cố định hằng tuần để gửi.', level: 'e' },
      { label: 'Đàm phán một điều khoản thanh toán', text: 'Với một khách hoặc một nhà cung cấp, đề xuất thay đổi một điều khoản thanh toán cụ thể (tạm ứng, chia mốc, kéo dài kỳ hạn). Ghi lại lập luận bạn dùng và kết quả đàm phán.', level: 'm' },
      { label: 'Kịch bản căng tiền', text: 'Giả định doanh thu tháng tới giảm 40 phần trăm và một khách lớn chậm trả một tháng. Viết bảng mười ba tuần cho tình huống đó và liệt kê theo thứ tự ba mươi khoản bạn sẽ hoãn hoặc cắt.', level: 'm' },
      { label: 'Rà tuần trong tám tuần liên tiếp', text: 'Tám tuần liền, cùng một giờ, điền số thực tế cạnh số dự báo và ghi lý do cho mọi chênh lệch trên 15 phần trăm. Cuối chu kỳ, viết hai khoản mục bạn thường xuyên dự báo lạc quan.', level: 'm' },
      { label: 'Rút ngắn chu kỳ tiền mười ngày', text: 'Đặt mục tiêu giảm số ngày thu tiền trung bình đi mười ngày trong một quý bằng ít nhất ba biện pháp khác nhau. Đo trước và sau, và ghi lại biện pháp nào đóng góp nhiều nhất cùng chi phí đánh đổi của nó.', level: 'h' },
      { label: 'Thử thách 7 ngày: bảy ngày minh bạch tiền', text: 'Bảy ngày, mỗi sáng ghi lại số dư thật của mọi tài khoản và mọi khoản dự kiến vào ra trong ngày, mỗi tối đối chiếu với thực tế. Ngày thứ bảy viết ra ba điều bạn không hề biết về dòng tiền của mình trước tuần này.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Một doanh nghiệp báo lãi 200 triệu trong quý nhưng không có tiền trả lương tháng này. Những nguyên nhân có thể là gì?',
        a: 'Có vài nguyên nhân thường gặp cùng lúc. Thứ nhất, doanh thu đã ghi nhận nhưng tiền chưa về vì khách trả chậm, nên lợi nhuận nằm trong khoản phải thu chứ không nằm trong tài khoản. Thứ hai, tiền đã bị chuyển thành hàng tồn kho hoặc nguyên vật liệu mua trước. Thứ ba, doanh nghiệp mua tài sản lớn trong kỳ, khoản chi ra hết ngay nhưng chi phí trong báo cáo được phân bổ dần theo nhiều năm. Thứ tư, có các khoản trả nợ gốc vay không nằm trong chi phí nhưng ăn tiền mặt. Đây chính là lý do bảng dòng tiền phải được lập riêng và theo tuần, và vì sao mọi kết luận về tình hình tài chính chính thức nên có kế toán tham gia.',
      },
      {
        q: 'Vì sao nên chuẩn bị hạn mức tín dụng khi chưa cần dùng?',
        a: 'Vì điều kiện xét duyệt phụ thuộc vào tình trạng tài chính tại thời điểm nộp hồ sơ, không phải tại thời điểm bạn cần tiền. Khi doanh nghiệp đang ổn định, số liệu đẹp và bạn ở thế thương lượng tốt hơn về hạn mức, lãi suất và tài sản bảo đảm. Khi đã căng tiền, hồ sơ xấu đi đúng lúc bạn cần nhất, thời gian xử lý lại không đợi được, và bạn dễ phải chấp nhận điều kiện bất lợi. Cần nói rõ đây là nguyên tắc chuẩn bị chung; điều kiện tín dụng cụ thể, chi phí và rủi ro của từng sản phẩm vay khác nhau theo tổ chức tín dụng và theo thời điểm, nên trước khi ký bất kỳ hợp đồng vay nào bạn nên đọc kỹ toàn bộ điều khoản và tham vấn kế toán hoặc chuyên gia tài chính.',
      },
      {
        q: 'Khi buộc phải hoãn thanh toán, nguyên tắc nào giúp giảm thiệt hại dài hạn?',
        a: 'Nguyên tắc là chủ động thông báo trước và cam kết một ngày cụ thể, thay vì im lặng cho tới khi bị đòi. Về thứ tự ưu tiên, các nghĩa vụ với người lao động và các nghĩa vụ có ràng buộc pháp lý hoặc có hậu quả dây chuyền lớn phải được đặt lên trước, và bạn nên xác định thứ tự này bằng văn bản khi còn bình tĩnh chứ không quyết theo áp lực của người gọi to nhất. Một nhà cung cấp được báo trước năm ngày và được trả đúng lời hứa mới thường vẫn tiếp tục làm ăn với bạn; một nhà cung cấp bị lảng tránh thì sẽ yêu cầu trả trước toàn bộ trong tương lai, làm dòng tiền của bạn xấu thêm. Với các nghĩa vụ thuế, bảo hiểm và hợp đồng lao động, việc chậm trả có hệ quả pháp lý riêng nên phải trao đổi với kế toán và người tư vấn pháp lý trước khi quyết định.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê toàn bộ tài khoản và số dư thật, cộng mọi khoản phải thu và phải trả đã biết. Ngày 2: dựng bảng mười ba tuần phiên bản đầu tiên. Ngày 3: đo số ngày thu tiền thật từ mười hoá đơn gần nhất. Ngày 4: soạn ba mẫu nhắc nợ và đặt lịch gửi cố định. Ngày 5: chọn ba khoản chi có thể dời và dời chúng khỏi tuần thấp nhất. Ngày 6: viết ngưỡng vàng, ngưỡng đỏ và phương án tương ứng cho từng ngưỡng. Ngày 7: đặt lịch rà tuần cố định 30 phút và mời một người nữa cùng dự để có người hỏi lại bạn.',
    evidence:
      'Bằng chứng thuyết phục nhất là bảng dòng tiền mười ba tuần có lịch sử cập nhật hằng tuần, kèm cột dự báo và cột thực tế qua ít nhất một quý. Kèm theo là một chỉ số trước và sau: số ngày thu tiền trung bình, số lần chạm ngưỡng báo động, hoặc số ngày chi phí cố định mà quỹ dự phòng trang trải được. Trong phỏng vấn cho vị trí vận hành hoặc quản lý chi nhánh, kể lại một quý bạn giảm được số ngày thu tiền và nói rõ ba biện pháp cụ thể sẽ có sức nặng hơn mọi khẳng định về sự cẩn thận. Trong CV: xây quy trình theo dõi dòng tiền 13 tuần và nhắc công nợ ba mức, giảm số ngày thu tiền trung bình từ 52 xuống 31 ngày trong một quý mà không tăng chiết khấu.',
    references: [
      { label: 'U.S. Small Business Administration — Business Guide, phần quản lý tài chính (bối cảnh Mỹ)', url: 'https://www.sba.gov/business-guide', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 7 — Kế toán và tài chính căn bản
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Người chủ doanh nghiệp không cần biết định khoản, nhưng bắt buộc phải đọc được ba bảng và hiểu chúng nói gì về nhau: bảng kết quả kinh doanh cho biết trong kỳ vừa rồi lãi hay lỗ, bảng cân đối kế toán cho biết tại một thời điểm bạn có gì và nợ ai, báo cáo lưu chuyển tiền tệ cho biết tiền thực sự đi đâu. Nói thẳng ngay từ đầu: chương này là kiến thức phổ thông để bạn đối thoại được với kế toán và đặt câu hỏi đúng, hoàn toàn không thay thế kế toán viên hay dịch vụ kế toán có chuyên môn. Chế độ kế toán, chính sách thuế và nghĩa vụ báo cáo tại Việt Nam có quy định cụ thể và thay đổi theo thời gian; mọi việc lập sổ, kê khai, quyết toán và nộp báo cáo phải do người có chuyên môn thực hiện và bạn phải kiểm chứng với văn bản pháp luật hiện hành trước khi làm theo bất cứ điều gì đọc được ở đây.',
    why: {
      work: 'Ở bất kỳ vị trí nào có ngân sách, khả năng đọc con số quyết định bạn có tham gia được vào các cuộc bàn luận quan trọng hay chỉ ngồi nghe. Người hiểu vì sao giám đốc tài chính lo về hàng tồn kho sẽ đề xuất được thứ khả thi.',
      interview:
        'Vị trí quản lý cấp trung trở lên thường có câu hỏi về chỉ số bạn theo dõi hoặc về cách bạn đánh giá hiệu quả một sáng kiến. Nói được biên lợi nhuận gộp, vòng quay hàng tồn kho hay số ngày phải thu bằng số thật của nơi bạn từng làm là dấu hiệu của người đã thực sự điều hành.',
      study:
        'Kế toán là ngôn ngữ chung của kinh doanh. Khi đã đọc được ba bảng, mọi tài liệu về định giá, phân tích ngành hay đầu tư trở nên tiếp cận được thay vì phải tin lời người khác diễn giải hộ.',
      life: 'Ba bảng đó có phiên bản cá nhân: thu chi trong tháng, tài sản và nợ tại một thời điểm, và tiền thực sự vào ra. Người từng dựng bảng cân đối cá nhân một lần thường có quyết định vay mượn tỉnh táo hơn hẳn.',
    },
    framework: [
      {
        name: 'Tách bạch tiền cá nhân và tiền doanh nghiệp',
        detail: 'Đây là việc đầu tiên và không có ngoại lệ: tài khoản riêng, thẻ riêng, và mọi khoản chủ rút ra hay bỏ thêm vào đều được ghi thành giao dịch có tên gọi rõ ràng. Không có bước này thì mọi con số sau đó đều vô nghĩa, và khi cần vay vốn hay bán doanh nghiệp thì gần như không thể chứng minh được điều gì.',
      },
      {
        name: 'Hiểu ba bảng và mối liên hệ giữa chúng',
        detail: 'Kết quả kinh doanh trả lời câu hỏi kỳ này lãi bao nhiêu; cân đối kế toán trả lời câu hỏi tại ngày cuối kỳ ta có tài sản gì và nợ ai bao nhiêu; lưu chuyển tiền tệ nối hai bảng kia bằng cách giải thích vì sao lãi trên giấy và tiền trong tài khoản lệch nhau. Đọc một bảng mà bỏ hai bảng còn lại là nguồn gốc của gần như mọi hiểu lầm tài chính của chủ doanh nghiệp nhỏ.',
      },
      {
        name: 'Nắm bốn tầng lợi nhuận',
        detail: 'Từ doanh thu trừ giá vốn ra lợi nhuận gộp; trừ chi phí bán hàng và quản lý ra lợi nhuận từ hoạt động; trừ chi phí lãi vay và các khoản khác ra lợi nhuận trước thuế; trừ thuế ra lợi nhuận sau thuế. Biết mình đang nói về tầng nào tránh được những cuộc tranh luận mà hai người dùng cùng một từ lãi cho hai con số cách nhau rất xa.',
      },
      {
        name: 'Chọn năm chỉ số theo dõi hằng tháng',
        detail: 'Không cần ba mươi chỉ số. Với phần lớn doanh nghiệp nhỏ, năm chỉ số đủ dùng là: biên lợi nhuận gộp, tỷ lệ chi phí cố định trên doanh thu, số ngày phải thu, số ngày tồn kho, và số tháng chi phí mà tiền mặt hiện có trang trải được. Theo dõi cùng năm chỉ số qua nhiều tháng có giá trị hơn nhiều so với đổi chỉ số liên tục.',
      },
      {
        name: 'Thiết lập nhịp làm việc với kế toán',
        detail: 'Đặt lịch cố định hằng tháng để nhận báo cáo và hỏi lại; chuẩn bị sẵn ba câu hỏi mỗi kỳ; yêu cầu người làm kế toán giải thích mọi khoản mục bạn không hiểu bằng ngôn ngữ thường. Nếu bạn không hiểu báo cáo của chính doanh nghiệp mình thì vấn đề không nằm ở trí tuệ của bạn mà nằm ở cách trình bày, và bạn có quyền yêu cầu trình bày lại.',
      },
    ],
    scenario:
      'Một công ty dịch vụ thiết kế và truyền thông tám người có doanh thu năm khoảng bốn tỷ đồng. Chủ công ty tin rằng công ty đang lãi tốt vì tài khoản luôn có tiền, và anh vẫn rút tiền cá nhân từ tài khoản công ty khi cần. Khi thuê một kế toán dịch vụ và tách bạch tài khoản, bức tranh đổi hẳn. Trong bảng kết quả kinh doanh, giá vốn không chỉ có lương nhân sự sản xuất mà còn có chi phí thuê cộng tác viên, phần mềm bản quyền và chi phí mua hình ảnh, đưa biên lợi nhuận gộp về mức thấp hơn nhiều so với anh nghĩ. Trong bảng cân đối, có một khoản phải thu lớn tồn từ hai dự án của năm trước mà anh gần như đã quên, và một khoản phải trả cộng tác viên đang chậm. Trong báo cáo lưu chuyển tiền tệ, phần lớn tiền dương của năm đến từ khoản tạm ứng của một hợp đồng dài hạn chưa thực hiện xong, tức là tiền của công việc chưa làm. Anh giữ nguyên hoạt động kinh doanh nhưng đổi ba việc: đặt một mức lương cố định cho chính mình thay vì rút tuỳ tiện, đưa hai chỉ số biên lợi nhuận gộp và số ngày phải thu vào cuộc họp đầu tháng, và yêu cầu kế toán trình bày báo cáo kèm ba câu giải thích bằng ngôn ngữ thường. Sáu tháng sau, anh vẫn không tự làm sổ sách, nhưng anh đã từ chối hai dự án có biên lợi nhuận gộp dưới ngưỡng và thu hồi được phần lớn khoản phải thu cũ.',
    comparison: [
      { weak: 'Dùng chung tài khoản cá nhân và doanh nghiệp, giải thích rằng công ty là của mình nên tiền nào cũng như nhau.', mature: 'Tách bạch hoàn toàn và tự trả cho mình một mức lương cố định, ghi mọi khoản góp thêm hay rút ra thành giao dịch có tên.' },
      { weak: 'Chỉ nhìn số dư tài khoản và tổng doanh thu năm để đánh giá tình hình.', mature: 'Đọc cả ba bảng và theo dõi năm chỉ số cố định theo tháng để nhìn thấy xu hướng trước khi nó thành vấn đề.' },
      { weak: 'Giao toàn bộ cho kế toán và ký mà không hiểu, coi đó là chuyện chuyên môn không phải việc của mình.', mature: 'Giao phần chuyên môn cho người có chuyên môn nhưng giữ trách nhiệm hiểu: hỏi lại tới khi hiểu, vì trách nhiệm pháp lý của người đại diện không chuyển giao được theo hợp đồng dịch vụ.' },
    ],
    mistakes: [
      'Coi toàn bộ tiền trong tài khoản là tiền của mình mà quên rằng trong đó có tiền tạm ứng của khách cho công việc chưa làm, tiền thuế phải nộp và tiền lương sắp trả.',
      'Đặt giá bán bằng cách lấy giá vốn cộng một tỷ lệ mà không đưa vào chi phí gián tiếp và thời gian không tính được cho khách, dẫn tới càng nhận nhiều việc càng mệt mà không tích luỹ được gì.',
      'Chỉ nhìn báo cáo một lần mỗi năm khi quyết toán, khiến mọi vấn đề chỉ được phát hiện sau khi đã kéo dài mười hai tháng và không còn sửa được cho kỳ đó.',
    ],
    worksheet: [
      'Doanh nghiệp của bạn đã có tài khoản ngân hàng tách bạch với tài khoản cá nhân chưa? Nếu chưa, việc gì đang ngăn cản và bạn sẽ xử lý trong bao nhiêu ngày?',
      'Viết ra định nghĩa giá vốn cho chính doanh nghiệp bạn: những khoản nào được tính vào và những khoản nào không? Liệt kê ít nhất năm khoản.',
      'Biên lợi nhuận gộp của bạn trong ba tháng gần nhất là bao nhiêu phần trăm? Nếu chưa biết, bạn cần lấy dữ liệu gì và từ đâu?',
      'Tiền mặt hiện có trang trải được bao nhiêu tháng chi phí cố định nếu doanh thu về không? Viết con số tháng.',
      'Ba câu hỏi bạn sẽ hỏi kế toán trong kỳ báo cáo tới là gì? Viết cụ thể, không viết dạng tình hình thế nào.',
    ],
    exercises: [
      { label: 'Đọc ba bảng của một công ty niêm yết', text: 'Tải báo cáo tài chính của một công ty niêm yết trong ngành gần với bạn. Tìm doanh thu, lợi nhuận gộp, lợi nhuận sau thuế, tổng nợ và dòng tiền từ hoạt động kinh doanh. Viết ba câu nhận xét về mối quan hệ giữa lợi nhuận và dòng tiền của họ.', level: 'e' },
      { label: 'Bảng cân đối cá nhân', text: 'Lập bảng cân đối cho chính bạn tại thời điểm hôm nay: tài sản một bên, nợ một bên, chênh lệch là giá trị ròng. Cập nhật lại sau ba tháng và so sánh.', level: 'e' },
      { label: 'Định nghĩa giá vốn cho doanh nghiệp bạn', text: 'Viết danh sách đầy đủ những khoản thuộc giá vốn và những khoản thuộc chi phí quản lý trong hoạt động của bạn, rồi mang danh sách đó hỏi một người làm kế toán xem có khoản nào bạn xếp sai.', level: 'e' },
      { label: 'Bảng năm chỉ số theo tháng', text: 'Dựng bảng theo dõi năm chỉ số cố định trong 6 tháng gần nhất từ dữ liệu thật. Vẽ đường xu hướng cho từng chỉ số và khoanh tròn chỉ số đang xấu đi liên tục ba tháng.', level: 'm' },
      { label: 'Nối lãi với tiền', text: 'Lấy một kỳ gần nhất, bắt đầu từ con số lợi nhuận và cộng trừ từng khoản cho tới khi ra được thay đổi tiền mặt thực tế trong kỳ. Ghi lại khoản nào tạo ra chênh lệch lớn nhất.', level: 'm' },
      { label: 'Phiên hỏi kế toán', text: 'Đặt một buổi làm việc 45 phút với người làm kế toán của bạn, mang theo mười câu hỏi đã chuẩn bị. Yêu cầu giải thích lại mọi thuật ngữ bạn chưa nắm và ghi chép thành một trang từ điển riêng cho doanh nghiệp bạn.', level: 'm' },
      { label: 'Tính lại giá bán từ dưới lên', text: 'Chọn một dịch vụ hoặc sản phẩm chính, tính đầy đủ chi phí trực tiếp cộng phần chi phí gián tiếp phân bổ hợp lý cộng mức lợi nhuận mục tiêu để ra giá sàn. So với giá bạn đang bán và viết kế hoạch xử lý nếu giá hiện tại thấp hơn giá sàn.', level: 'h' },
      { label: 'Thử thách 7 ngày: dịch bảy thuật ngữ ra tiếng người', text: 'Bảy ngày, mỗi ngày chọn một khái niệm (biên lợi nhuận gộp, khấu hao, khoản phải thu, hàng tồn kho, vốn chủ sở hữu, dòng tiền hoạt động, điểm hoà vốn), tìm nó trong số liệu thật của chính doanh nghiệp bạn và viết ba câu giải thích cho một người không biết gì về kế toán. Ngày thứ bảy đọc lại toàn bộ và đánh dấu khái niệm bạn vẫn chưa thực sự hiểu để mang đi hỏi.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao việc tách bạch tài khoản cá nhân và tài khoản doanh nghiệp lại quan trọng tới mức không có ngoại lệ?',
        a: 'Có bốn lý do độc lập nhau. Về điều hành, khi hai dòng tiền trộn lẫn thì không thể biết doanh nghiệp có tự nuôi được mình không, vì mọi khoản bù đắp cá nhân đều ẩn đi. Về quan hệ với bên ngoài, ngân hàng, nhà đầu tư và người mua lại đều yêu cầu số liệu sạch, và số liệu trộn lẫn thường không dùng được. Về thuế và pháp lý, việc ghi nhận chi phí phải có căn cứ và phải phù hợp quy định hiện hành, việc trộn lẫn dễ dẫn tới rủi ro khi thanh kiểm tra. Về quan hệ với người đồng hành, nếu có đồng sáng lập hay nhân viên hưởng theo kết quả thì con số phải minh bạch mới giữ được lòng tin. Cách xử lý cụ thể theo loại hình doanh nghiệp của bạn nên được xác nhận với kế toán.',
      },
      {
        q: 'Bảng kết quả kinh doanh, bảng cân đối kế toán và báo cáo lưu chuyển tiền tệ trả lời ba câu hỏi khác nhau như thế nào?',
        a: 'Bảng kết quả kinh doanh trả lời trong khoảng thời gian này ta làm ra được bao nhiêu và tốn bao nhiêu, tức là một đoạn phim của cả kỳ. Bảng cân đối kế toán trả lời tại đúng ngày cuối kỳ ta đang nắm giữ những gì và đang nợ ai bao nhiêu, tức là một bức ảnh chụp tại một thời điểm. Báo cáo lưu chuyển tiền tệ trả lời tiền thật đã vào ra thế nào và chia theo ba nhóm hoạt động kinh doanh, đầu tư và tài chính, qua đó giải thích khoảng cách giữa lợi nhuận và tiền. Người chỉ đọc bảng đầu tiên rất dễ tự tin sai; người đọc cả ba mới thấy được toàn cảnh, và ngay cả khi đó vẫn nên nghe phần diễn giải của người có chuyên môn.',
      },
      {
        q: 'Một chủ doanh nghiệp nói: tôi thuê kế toán rồi nên không cần hiểu mấy con số này. Vấn đề ở đâu?',
        a: 'Ở chỗ nhầm giữa uỷ quyền công việc và uỷ quyền trách nhiệm. Kế toán làm phần chuyên môn: ghi sổ, lập báo cáo, kê khai theo quy định. Nhưng các quyết định kinh doanh dựa trên số liệu đó vẫn là của chủ doanh nghiệp, và ở nhiều loại hình thì trách nhiệm pháp lý của người đại diện theo pháp luật cũng không chuyển giao được bằng một hợp đồng dịch vụ. Ngoài ra, người ngoài không biết bối cảnh kinh doanh nên không thể phát hiện những bất thường mà chỉ chủ doanh nghiệp mới thấy vô lý. Mức hiểu tối thiểu cần có là đọc được ba bảng, biết năm chỉ số của mình, và đặt được câu hỏi khi một khoản mục thay đổi bất thường — không cần biết định khoản.',
      },
    ],
    plan7:
      'Ngày 1: mở hoặc xác nhận tài khoản ngân hàng riêng cho doanh nghiệp và liệt kê mọi giao dịch cá nhân đang lẫn trong đó. Ngày 2: viết định nghĩa giá vốn cho doanh nghiệp bạn và mang đi hỏi kế toán. Ngày 3: lấy số liệu ba tháng gần nhất và tính biên lợi nhuận gộp. Ngày 4: tính số ngày phải thu và số tháng chi phí mà tiền mặt trang trải được. Ngày 5: dựng bảng năm chỉ số và điền sáu tháng gần nhất. Ngày 6: chuẩn bị mười câu hỏi và đặt lịch làm việc với kế toán. Ngày 7: viết một trang từ điển thuật ngữ riêng cho doanh nghiệp bạn và đặt lịch rà báo cáo cố định hằng tháng.',
    evidence:
      'Bằng chứng dùng được là bảng năm chỉ số của chính doanh nghiệp bạn theo mười hai tháng, kèm biên bản các quyết định bạn đã đổi nhờ nhìn vào đó — ví dụ từ chối nhóm dự án dưới ngưỡng biên lợi nhuận gộp, hoặc đổi chính sách tạm ứng sau khi số ngày phải thu xấu đi. Kèm theo là bản từ điển thuật ngữ nội bộ bạn tự viết, thứ cho thấy bạn học một cách có hệ thống. Trong phỏng vấn cho vị trí quản lý có trách nhiệm ngân sách, việc bạn nói được biên lợi nhuận gộp và số ngày phải thu của nơi mình từng làm bằng con số cụ thể tạo khác biệt lớn. Trong CV: thiết lập bảng chỉ số tài chính hằng tháng và nhịp rà soát cùng kế toán, dẫn tới thay đổi chính sách nhận dự án theo ngưỡng biên lợi nhuận gộp. Lưu ý không trưng ra số liệu tài chính thuộc diện bảo mật của nơi cũ.',
    references: [
      { label: 'Hệ thống văn bản quy phạm pháp luật — tra cứu văn bản hiện hành về kế toán và thuế', url: 'https://vanban.chinhphu.vn', type: 'article', needsReview: true },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 8 — Pháp lý và hợp đồng căn bản
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Mục tiêu của chương này rất hẹp và cần nói rõ ngay: giúp bạn nhận ra khi nào phải hỏi luật sư, biết hỏi cái gì, và đọc được một bản hợp đồng đủ để đặt câu hỏi thay vì ký mù. Đây là kiến thức phổ thông, hoàn toàn không phải tư vấn pháp lý. Việc chọn loại hình doanh nghiệp, đăng ký kinh doanh, soạn và ký hợp đồng, sử dụng lao động, xử lý tranh chấp tại Việt Nam đều chịu điều chỉnh của các quy định cụ thể và các quy định đó thay đổi theo thời gian; với bất kỳ hợp đồng thật hay thủ tục thật nào, bạn phải làm việc với luật sư hoặc người tư vấn pháp lý có chứng chỉ hành nghề và tra cứu văn bản hiện hành. Rủi ro pháp lý có đặc điểm là im lặng rất lâu rồi phát tác cùng lúc, nên chi phí phòng ngừa gần như luôn rẻ hơn chi phí xử lý.',
    why: {
      work: 'Nhân viên cũng ký hoặc chuẩn bị hợp đồng: hợp đồng với nhà cung cấp, thoả thuận hợp tác, đơn đặt hàng. Người đọc được điều khoản thanh toán, phạm vi công việc và điều khoản chấm dứt sẽ tránh cho tổ chức những cam kết không thực hiện nổi.',
      interview:
        'Với vị trí quản lý dự án, mua hàng, đối tác hoặc vận hành, câu hỏi về việc bạn xử lý thế nào khi đối tác không thực hiện đúng cam kết là câu hỏi phổ biến. Trả lời tốt cần có việc bạn đã đọc gì trong hợp đồng, đã ghi nhận bằng chứng ra sao, và khi nào bạn chuyển việc cho bộ phận pháp chế.',
      study:
        'Đọc hợp đồng là một kỹ năng đọc hiểu đặc thù: cấu trúc chặt, từ ngữ có nghĩa xác định, và mọi điều khoản đều nối với nhau. Luyện nó cải thiện luôn khả năng đọc tài liệu kỹ thuật và quy chế nội bộ.',
      life: 'Hợp đồng thuê nhà, hợp đồng mua bảo hiểm, hợp đồng vay tiêu dùng, hợp đồng lao động của chính bạn đều là những văn bản có hậu quả thật. Thói quen đọc kỹ ba phần quan trọng nhất trước khi ký tiết kiệm được rất nhiều rắc rối về sau.',
    },
    framework: [
      {
        name: 'Xác định loại hình và nghĩa vụ trước khi bắt đầu',
        detail: 'Trước khi có doanh thu, cần trả lời: hoạt động này thuộc ngành nghề nào, có thuộc nhóm cần điều kiện riêng không, nên hoạt động dưới hình thức nào, và kéo theo nghĩa vụ đăng ký, kê khai, báo cáo gì. Mỗi lựa chọn có hệ quả khác nhau về trách nhiệm tài sản, thuế và thủ tục. Đây chính xác là loại câu hỏi phải hỏi người tư vấn có chuyên môn, vì một lựa chọn sai ở bước đầu rất tốn kém để sửa về sau.',
      },
      {
        name: 'Đọc hợp đồng theo năm khối bắt buộc',
        detail: 'Với mọi bản hợp đồng, tìm và đọc kỹ năm khối trước tiên: phạm vi công việc và tiêu chí nghiệm thu; giá, thời hạn và điều kiện thanh toán; quyền sở hữu kết quả công việc và dữ liệu; trách nhiệm khi vi phạm gồm phạt và bồi thường; và điều khoản chấm dứt cùng cơ chế giải quyết tranh chấp. Nếu một trong năm khối này mơ hồ, đó là chỗ tranh chấp sẽ nổ ra.',
      },
      {
        name: 'Chuyển mọi thoả thuận miệng thành văn bản có dấu vết',
        detail: 'Sau mỗi cuộc gặp hoặc cuộc gọi có thoả thuận, gửi một thư tóm tắt lại những gì đã thống nhất và đề nghị xác nhận. Việc này không cần luật sư, không tốn tiền, và trong rất nhiều tranh chấp thực tế nó là thứ duy nhất còn lại. Lưu trữ có tổ chức theo dự án và theo đối tác, kèm ngày tháng.',
      },
      {
        name: 'Dựng bộ hồ sơ mẫu và giới hạn quyền ký',
        detail: 'Chuẩn bị trước các mẫu bạn dùng thường xuyên — hợp đồng dịch vụ, đơn đặt hàng, thoả thuận bảo mật, hợp đồng cộng tác — và cho luật sư rà một lần thay vì thuê soạn từng bản. Đồng thời quy định rõ ai được ký cái gì, tới hạn mức nào, để tránh việc một người trong doanh nghiệp ràng buộc cả doanh nghiệp vào cam kết vượt khả năng.',
      },
      {
        name: 'Rà soát định kỳ và biết ngưỡng gọi luật sư',
        detail: 'Mỗi sáu tháng, rà lại danh mục hợp đồng đang hiệu lực, giấy phép cần gia hạn và nghĩa vụ báo cáo định kỳ. Đặt ngưỡng rõ ràng cho việc bắt buộc phải có luật sư trước khi ký: giá trị hợp đồng vượt một mức nhất định, cam kết dài hơn một khoảng thời gian nhất định, có điều khoản độc quyền, có chuyển giao quyền sở hữu trí tuệ, hoặc có yếu tố nước ngoài.',
      },
    ],
    scenario:
      'Một studio chụp ảnh cưới bốn người nhận một hợp đồng lớn với một khách sạn để chụp và quay toàn bộ sự kiện trong năm. Bản hợp đồng do phía khách sạn soạn, dài mười trang, và người chủ studio định ký ngay vì giá tốt. Anh dừng lại và đọc theo năm khối. Phạm vi công việc ghi là cung cấp dịch vụ hình ảnh cho các sự kiện của khách sạn mà không giới hạn số sự kiện hay số giờ, nghĩa là khối lượng có thể gấp ba lần anh hình dung với cùng một mức phí. Điều khoản thanh toán ghi thanh toán sau khi nghiệm thu toàn bộ vào cuối năm. Điều khoản bản quyền chuyển toàn bộ quyền sử dụng cho khách sạn và cấm studio dùng hình ảnh trong hồ sơ năng lực, thứ mà anh sống nhờ vào. Điều khoản phạt vi phạm chỉ có chiều một phía. Anh không tự sửa hợp đồng mà mang tới một luật sư, chi một khoản phí tư vấn nhỏ so với giá trị hợp đồng, và quay lại đàm phán bốn điểm: giới hạn số sự kiện trong năm kèm cơ chế tính thêm cho phần vượt, thanh toán theo từng sự kiện thay vì cuối năm, quyền sử dụng một số hình ảnh đã được duyệt cho hồ sơ năng lực, và điều khoản phạt hai chiều. Khách sạn chấp nhận ba trong bốn điểm. Hợp đồng ký muộn hơn hai tuần nhưng studio không rơi vào tình trạng làm nhiều gấp ba mà nhận tiền sau mười hai tháng.',
    comparison: [
      { weak: 'Làm việc với đối tác quen dựa trên tin tưởng, không có văn bản nào vì viết ra thì mất tình cảm.', mature: 'Vẫn giữ quan hệ tốt nhưng có một văn bản ngắn gọn ghi rõ phạm vi, giá và thời hạn, vì văn bản bảo vệ quan hệ chứ không phá quan hệ.' },
      { weak: 'Đọc lướt hợp đồng do đối tác soạn và tập trung duy nhất vào con số giá.', mature: 'Đọc năm khối bắt buộc và đàm phán những khối rủi ro nhất, vì giá chỉ có ý nghĩa khi gắn với một phạm vi công việc xác định.' },
      { weak: 'Thuê luật sư chỉ khi đã xảy ra tranh chấp.', mature: 'Chi một khoản nhỏ để rà bộ hợp đồng mẫu và các hợp đồng vượt ngưỡng giá trị từ trước, coi đó là chi phí vận hành chứ không phải chi phí bất thường.' },
    ],
    mistakes: [
      'Để phạm vi công việc mô tả bằng những từ co giãn như hỗ trợ đầy đủ, chỉnh sửa theo yêu cầu, bảo hành trọn đời, mà không có giới hạn số lần, số giờ hay tiêu chí nghiệm thu cụ thể.',
      'Bỏ qua điều khoản về quyền sở hữu kết quả công việc và dữ liệu khách hàng, dẫn tới việc không được dùng chính sản phẩm mình làm ra để chứng minh năng lực, hoặc mất quyền tiếp cận dữ liệu khi chấm dứt hợp tác.',
      'Tin rằng vì đã có hợp đồng nên mọi thứ được bảo đảm, mà quên rằng thứ quyết định trong tranh chấp là bằng chứng thực hiện: biên bản nghiệm thu, thư xác nhận, nhật ký công việc — không có chúng thì điều khoản hay tới đâu cũng khó chứng minh.',
    ],
    worksheet: [
      'Liệt kê mọi hợp đồng và thoả thuận đang có hiệu lực của bạn. Bao nhiêu trong số đó bạn có bản lưu đầy đủ và biết ngày hết hạn?',
      'Với hợp đồng có giá trị lớn nhất hiện tại, phạm vi công việc được mô tả bằng những từ nào có thể hiểu theo nhiều cách? Gạch chân và viết lại cho rõ.',
      'Điều khoản thanh toán trong hợp đồng lớn nhất của bạn quy định tiền về sau bao nhiêu ngày kể từ sự kiện nào? Điều đó khớp với bảng dòng tiền của bạn không?',
      'Kết quả công việc bạn tạo ra thuộc quyền sở hữu của ai theo hợp đồng hiện tại, và bạn có được dùng nó trong hồ sơ năng lực không?',
      'Viết ngưỡng của riêng bạn cho việc bắt buộc phải hỏi luật sư trước khi ký: mức giá trị, thời hạn cam kết, và các loại điều khoản nào.',
    ],
    exercises: [
      { label: 'Kiểm kê hồ sơ pháp lý', text: 'Lập một bảng liệt kê mọi giấy tờ, giấy phép, hợp đồng đang hiệu lực kèm ngày cấp, ngày hết hạn và nơi lưu. Đánh dấu những mục bạn không tìm thấy bản gốc.', level: 'e' },
      { label: 'Đọc một hợp đồng theo năm khối', text: 'Lấy một hợp đồng bạn đã ký, in ra và dùng năm màu bút khác nhau đánh dấu năm khối bắt buộc. Ghi lại khối nào không tìm thấy trong văn bản.', level: 'e' },
      { label: 'Thư xác nhận sau cuộc họp', text: 'Sau ba cuộc trao đổi công việc tiếp theo, gửi thư tóm tắt những gì đã thống nhất và đề nghị xác nhận lại. Lưu ba thư đó vào một thư mục theo đối tác.', level: 'e' },
      { label: 'Viết lại một điều khoản mơ hồ', text: 'Chọn một điều khoản co giãn trong hợp đồng của bạn và viết lại thành phiên bản có con số, có giới hạn và có tiêu chí nghiệm thu. Mang cả hai phiên bản đi hỏi người có chuyên môn xem cách diễn đạt của bạn có tạo rủi ro mới không.', level: 'm' },
      { label: 'Buổi tư vấn có chuẩn bị', text: 'Đặt một buổi tư vấn với luật sư và mang theo danh sách câu hỏi đã viết sẵn cùng các văn bản liên quan. Ghi chép lại và viết một trang tóm tắt những điều cần sửa trong cách làm hiện tại của bạn.', level: 'm' },
      { label: 'Bảng phân quyền ký', text: 'Viết quy định nội bộ về việc ai được ký loại văn bản nào tới hạn mức nào, ai phải duyệt trước. Thông báo cho cả nhóm và lưu thành văn bản có ngày ban hành.', level: 'm' },
      { label: 'Diễn tập tranh chấp', text: 'Chọn một hợp đồng đang thực hiện và giả định đối tác không thanh toán sau khi bạn đã hoàn thành. Viết ra theo trình tự: bạn có bằng chứng gì, điều khoản nào áp dụng, các bước bạn sẽ làm theo thứ tự, và ở bước nào bạn cần luật sư. Sau đó rà xem bạn thực sự đang thiếu bằng chứng nào và bổ sung ngay từ bây giờ.', level: 'h' },
      { label: 'Thử thách 7 ngày: dựng bộ hồ sơ tối thiểu', text: 'Bảy ngày, mỗi ngày hoàn thiện một phần của bộ hồ sơ pháp lý tối thiểu: ngày 1 kiểm kê giấy tờ, ngày 2 tập hợp mọi hợp đồng đang hiệu lực vào một nơi, ngày 3 lập bảng theo dõi hạn, ngày 4 soạn mẫu thư xác nhận, ngày 5 viết ngưỡng gọi luật sư, ngày 6 rà mẫu hợp đồng dịch vụ bạn hay dùng, ngày 7 đặt lịch tư vấn với người có chuyên môn và gửi trước danh sách câu hỏi.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao thoả thuận miệng với đối tác thân quen vẫn nên được ghi lại bằng văn bản, và cách làm nhẹ nhàng nhất là gì?',
        a: 'Vì trí nhớ hai bên phân kỳ theo thời gian một cách rất tự nhiên, và vì người trực tiếp thoả thuận có thể nghỉ việc, chuyển nơi khác hoặc gặp chuyện. Văn bản không phải là biểu hiện của sự nghi ngờ mà là cách bảo vệ quan hệ khỏi hiểu lầm về sau. Cách nhẹ nhàng nhất là một thư tóm tắt sau cuộc gặp, viết bằng giọng thân thiện, liệt kê những gì đã thống nhất và mời bên kia bổ sung nếu có chỗ chưa đúng. Nó không cần dạng hợp đồng trang trọng, không cần luật sư, nhưng tạo ra một mốc thời gian và một nội dung mà cả hai bên đã có cơ hội phản đối.',
      },
      {
        q: 'Trong năm khối cần đọc, vì sao phạm vi công việc thường là nguồn tranh chấp lớn nhất chứ không phải giá?',
        a: 'Vì giá là một con số nên hai bên khó hiểu khác nhau, còn phạm vi công việc là mô tả bằng lời nên rất dễ hiểu khác nhau, và mỗi bên tự nhiên sẽ hiểu theo hướng có lợi cho mình. Những cụm từ như chỉnh sửa theo yêu cầu, hỗ trợ trong quá trình sử dụng, hoàn thiện tới khi khách hài lòng đều không có giới hạn, nên chi phí thực hiện có thể vượt xa dự tính trong khi giá đã cố định. Cách xử lý là gắn phạm vi với các đại lượng đếm được: số lần chỉnh sửa, số giờ hỗ trợ, số hạng mục, tiêu chí nghiệm thu cụ thể, và quy định cơ chế tính thêm cho phần vượt. Cách diễn đạt cụ thể nên được người có chuyên môn rà lại vì câu chữ trong hợp đồng có hệ quả pháp lý.',
      },
      {
        q: 'Khi nào thì chi phí thuê tư vấn pháp lý là hợp lý với một doanh nghiệp nhỏ đang thiếu tiền?',
        a: 'Nguyên tắc thực dụng là so chi phí tư vấn với mức thiệt hại tối đa có thể xảy ra chứ không so với doanh thu hiện tại. Những tình huống gần như luôn đáng chi: chọn loại hình và thủ tục lúc thành lập, hợp đồng có giá trị lớn so với quy mô của bạn, hợp đồng ràng buộc dài hạn hoặc có điều khoản độc quyền, mọi việc liên quan tới chuyển giao quyền sở hữu trí tuệ, các thoả thuận giữa những người đồng sở hữu, và mọi việc có yếu tố nước ngoài. Một cách tiết kiệm là đầu tư một lần để có bộ hợp đồng mẫu được rà kỹ, sau đó tự dùng cho các giao dịch thông thường và chỉ hỏi lại khi có tình huống lệch khỏi mẫu. Ranh giới cụ thể nên được thống nhất với chính người tư vấn của bạn.',
      },
    ],
    plan7:
      'Ngày 1: kiểm kê toàn bộ giấy tờ, giấy phép và hợp đồng đang hiệu lực vào một bảng. Ngày 2: gom mọi hợp đồng vào một nơi lưu trữ có tổ chức theo đối tác và dự án. Ngày 3: đọc hợp đồng lớn nhất theo năm khối và ghi lại mọi chỗ mơ hồ. Ngày 4: soạn mẫu thư xác nhận sau cuộc họp và bắt đầu dùng. Ngày 5: viết ngưỡng bắt buộc hỏi luật sư và quy định phân quyền ký. Ngày 6: chuẩn bị danh sách câu hỏi cho buổi tư vấn. Ngày 7: đặt lịch làm việc với người tư vấn pháp lý có chuyên môn, gửi trước tài liệu và câu hỏi.',
    evidence:
      'Bằng chứng ở đây là bộ hồ sơ pháp lý gọn gàng của doanh nghiệp bạn: bảng theo dõi hợp đồng và hạn, bộ mẫu đã được rà, quy định phân quyền ký có ngày ban hành, và thói quen gửi thư xác nhận sau mỗi cuộc trao đổi. Thêm vào đó là một trường hợp cụ thể bạn đã phát hiện rủi ro trong bản hợp đồng đối tác soạn và đàm phán lại thành công, kể được cả điều khoản gốc lẫn điều khoản sau khi sửa. Trong phỏng vấn cho vị trí quản lý dự án hoặc đối tác, câu chuyện này chứng minh bạn đọc kỹ và biết khi nào phải nhờ chuyên môn — hai phẩm chất được đánh giá cao. Trong CV: chuẩn hoá bộ hợp đồng mẫu và quy trình xác nhận thoả thuận bằng văn bản cho một studio 4 người, giảm số tranh chấp về phạm vi công việc xuống mức không đáng kể. Lưu ý không tiết lộ nội dung hợp đồng thuộc diện bảo mật.',
    references: [
      { label: 'Cổng thông tin quốc gia về đăng ký doanh nghiệp', url: 'https://dangkykinhdoanh.gov.vn', type: 'article', needsReview: true },
      { label: 'Hệ thống văn bản quy phạm pháp luật của Chính phủ', url: 'https://vanban.chinhphu.vn', type: 'article', needsReview: true },
    ],
  }),
  // ─────────────────────────────────────────────────────────────────────────
  // Chương 9 — Xây dựng quy trình vận hành (SOP)
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Quy trình vận hành chuẩn là câu trả lời viết ra cho câu hỏi việc này làm thế nào để lần nào cũng ra kết quả như nhau, kể cả khi người làm là người mới hoặc là ca đêm. Nó không phải văn bản cho đẹp hồ sơ mà là công cụ giảm số lần bạn phải trả lời cùng một câu hỏi. Phép thử duy nhất cho một quy trình tốt: đưa cho người chưa từng làm việc đó, để họ tự làm theo, và đếm số lần họ phải hỏi. Mỗi câu hỏi là một lỗ hổng cần vá, và bản quy trình nào chưa từng bị đem ra thử theo cách này thì chưa được coi là hoàn thành.',
    why: {
      work: 'Người viết được quy trình cho phần việc của mình là người có thể được giao việc lớn hơn, vì tổ chức biết phần việc cũ sẽ không sụp khi họ chuyển đi. Nó cũng là cách chấm dứt trạng thái mọi thứ chỉ chạy khi có bạn.',
      interview:
        'Nhà tuyển dụng cho vị trí vận hành thường hỏi bạn đã chuẩn hoá được việc gì. Câu trả lời mạnh có ba phần: trước khi chuẩn hoá thì lỗi và thời gian ra sao, bạn viết gì và huấn luyện thế nào, sau đó con số thay đổi ra sao.',
      study:
        'Viết quy trình là bài kiểm tra tàn nhẫn cho việc bạn có thực sự hiểu một công việc hay không. Rất nhiều thứ ta tưởng đã nắm vững hoá ra chỉ là thói quen chưa được diễn đạt, và điều này lộ ra ngay khi phải viết cho người khác làm theo.',
      life: 'Việc lặp lại trong nhà cũng có quy trình: chuẩn bị đồ đi du lịch, bàn giao chăm sóc người thân giữa các thành viên, quy trình khi trẻ ốm. Viết ra một lần giúp giảm hẳn tranh cãi và giảm số việc bị quên.',
    },
    framework: [
      {
        name: 'Chọn việc đáng viết trước',
        detail: 'Ưu tiên theo công thức: tần suất nhân với hậu quả khi làm sai nhân với số người phải làm. Việc xảy ra mỗi ngày, nhiều người làm và sai thì mất tiền hoặc mất khách là việc phải viết đầu tiên. Đừng bắt đầu bằng những quy trình hiếm gặp và phức tạp, chúng tốn công viết mà ít được dùng.',
      },
      {
        name: 'Quay lại thực tế trước khi viết lý tưởng',
        detail: 'Đứng cạnh người đang làm giỏi nhất việc đó và ghi lại chính xác họ làm gì theo trình tự, gồm cả những bước họ không nghĩ là bước. Viết quy trình từ trong đầu quản lý luôn tạo ra một bản đẹp mà thực tế không chạy được, vì nó bỏ mất những chi tiết chỉ người trong việc mới biết.',
      },
      {
        name: 'Viết theo cấu trúc bảy phần',
        detail: 'Một bản dùng được cần: tên việc và khi nào áp dụng; người chịu trách nhiệm; điều kiện và dụng cụ cần trước khi bắt đầu; các bước đánh số bằng động từ hành động; tiêu chí biết là đã đúng; các tình huống ngoại lệ hay gặp và cách xử lý; và mốc thời gian cùng người liên hệ khi bí. Phần ngoại lệ là phần hay bị bỏ nhất và cũng là phần khiến người mới gọi điện nhiều nhất.',
      },
      {
        name: 'Thử với người chưa biết việc và sửa ngay',
        detail: 'Đưa bản nháp cho một người chưa từng làm, để họ thực hiện trong khi bạn ngồi im quan sát và chỉ ghi chép. Mỗi lần họ dừng lại, đoán mò hoặc hỏi là một chỗ phải sửa. Vòng thử này thường cắt được một phần ba số chữ và thêm được những chi tiết mà người viết không tưởng tượng nổi là cần thiết.',
      },
      {
        name: 'Đặt chủ sở hữu, ngày rà và cơ chế cập nhật',
        detail: 'Mỗi quy trình phải có một người chịu trách nhiệm bằng tên, một ngày ban hành và một ngày rà tiếp theo. Cho phép người thực hiện đề xuất sửa dễ dàng, và mỗi lần có sự cố thì hỏi ngay quy trình đã nói gì về tình huống này. Quy trình không được cập nhật sẽ bị bỏ qua trong im lặng và còn tệ hơn không có, vì nó tạo cảm giác an toàn giả.',
      },
    ],
    scenario:
      'Một tiệm bánh mì và cà phê mang đi mở thêm điểm bán thứ hai cách điểm đầu bốn cây số. Trong hai tháng đầu, điểm thứ hai liên tục có vấn đề: bánh hết vào giữa buổi sáng hoặc thừa cuối ngày, cà phê pha không đều tay, và mỗi ngày quản lý điểm hai gọi cho chủ ít nhất năm lần. Chủ tiệm dành ba buổi sáng đứng cạnh nhân viên giỏi nhất ở điểm một và ghi lại nguyên văn từng bước mở ca, gồm cả những việc không ai coi là bước như kiểm nhiệt độ tủ mát trước khi lấy bơ ra. Chị viết ba bản quy trình: mở ca, đặt hàng bánh cho ngày hôm sau, và đóng ca. Riêng bản đặt hàng có một bảng tính đơn giản lấy số bán ba ngày cùng thứ trong tuần trước làm cơ sở, cộng hệ số cho ngày lễ và ngày mưa. Chị đưa ba bản cho một nhân viên mới hoàn toàn và ngồi quan sát trong hai ca, ghi được mười bảy câu hỏi. Sau khi vá, số câu hỏi ở ca thứ ba còn bốn. Sau sáu tuần, số cuộc gọi từ điểm hai giảm còn khoảng một cuộc mỗi ngày và lượng bánh phải bỏ cuối ngày giảm rõ rệt. Điều quan trọng hơn với chị là chị có thể nghỉ một ngày mà tiệm vẫn mở đúng giờ.',
    comparison: [
      { weak: 'Viết quy trình bằng cách ngồi trong phòng và hình dung công việc lẽ ra nên diễn ra thế nào.', mature: 'Đứng cạnh người đang làm việc đó, ghi lại thực tế trước, rồi mới cải tiến và viết thành bản chuẩn.' },
      { weak: 'Đào tạo bằng cách để người mới đi theo người cũ và tự quan sát mà học.', mature: 'Đưa bản quy trình cho người mới tự làm dưới sự quan sát im lặng, dùng mọi câu hỏi của họ để vá bản viết.' },
      { weak: 'Ban hành quy trình rồi để đó, giả định mọi người đang làm theo vì đã có văn bản.', mature: 'Đặt lịch rà định kỳ, kiểm tra thực tế bằng cách quan sát một ca ngẫu nhiên, và cập nhật mỗi khi có sự cố hoặc có cách làm tốt hơn.' },
    ],
    mistakes: [
      'Viết quá dài và quá trang trọng khiến không ai đọc: một bản mở ca mười hai trang có giá trị thực tế thấp hơn một tờ danh sách kiểm tra dán ở nơi làm việc.',
      'Bỏ hẳn phần ngoại lệ, chỉ viết đường đi khi mọi thứ suôn sẻ, trong khi phần lớn cuộc gọi cầu cứu đến từ đúng những tình huống không suôn sẻ đó.',
      'Chuẩn hoá một quy trình đang sai: chép lại nguyên cách làm hiện tại mà không hỏi vì sao bước này tồn tại, khiến những bước thừa được đóng dấu thành chuẩn và tồn tại thêm nhiều năm.',
    ],
    worksheet: [
      'Liệt kê năm việc lặp lại nhiều nhất trong hoạt động của bạn và chấm cho mỗi việc ba điểm: tần suất, hậu quả khi sai, số người phải làm. Việc nào tổng cao nhất?',
      'Với việc đứng đầu, ai đang làm việc đó tốt nhất và bạn có thể đứng quan sát họ vào ngày nào tuần này?',
      'Trong tuần vừa rồi, những câu hỏi nào bạn phải trả lời nhiều hơn một lần? Mỗi câu là một quy trình còn thiếu hoặc một quy trình viết chưa rõ.',
      'Với một quy trình bạn đã có, liệt kê ba tình huống ngoại lệ thực tế đã xảy ra và kiểm xem văn bản có nói gì về chúng không.',
      'Mỗi quy trình hiện có của bạn ghi tên ai là người chịu trách nhiệm và ngày rà tiếp theo là ngày nào? Nếu không có, hãy điền ngay.',
    ],
    exercises: [
      { label: 'Đếm câu hỏi lặp lại', text: 'Trong năm ngày làm việc, ghi lại mọi câu hỏi người khác hỏi bạn về cách làm một việc. Cuối tuần nhóm lại và đếm tần suất; ba câu hỏi hàng đầu chính là ba quy trình cần viết trước.', level: 'e' },
      { label: 'Quan sát và ghi nguyên trạng', text: 'Chọn một việc lặp lại và đứng quan sát một người làm nó từ đầu tới cuối, ghi lại từng hành động theo trình tự mà không góp ý gì. So bản ghi với hình dung ban đầu của bạn.', level: 'e' },
      { label: 'Danh sách kiểm tra một trang', text: 'Chuyển một quy trình đang có thành một tờ kiểm tra vừa một trang với các ô đánh dấu, in ra và dán tại chỗ làm việc. Sau một tuần hỏi người dùng nó về hai điều họ muốn sửa.', level: 'e' },
      { label: 'Thử với người chưa biết việc', text: 'Đưa bản quy trình cho một người chưa từng làm và ngồi quan sát im lặng khi họ thực hiện. Ghi lại mọi lần họ dừng, hỏi hoặc đoán. Vá bản viết ngay trong ngày và thử lại với người thứ hai.', level: 'm' },
      { label: 'Bổ sung phần ngoại lệ', text: 'Với một quy trình quan trọng, phỏng vấn ba người từng thực hiện nó để thu thập mọi tình huống bất thường họ từng gặp. Viết thêm phần xử lý cho ít nhất năm tình huống phổ biến nhất.', level: 'm' },
      { label: 'Đo trước và sau', text: 'Chọn một chỉ số đo được cho một công việc (thời gian hoàn thành, tỷ lệ lỗi, số lần phải hỏi lại, lượng hàng bỏ đi). Đo hai tuần trước khi chuẩn hoá và hai tuần sau, rồi viết kết luận trung thực kể cả khi không cải thiện.', level: 'm' },
      { label: 'Xây thư viện quy trình cho một mảng', text: 'Chọn một mảng hoạt động và xây bộ quy trình hoàn chỉnh cho nó với mục lục, người chịu trách nhiệm, ngày rà và cơ chế đề xuất sửa. Chạy thử toàn bộ với một người mới trong một tuần và ghi lại tỷ lệ việc họ tự làm được.', level: 'h' },
      { label: 'Thử thách 7 ngày: viết, thử, vá, đo lại', text: 'Bảy ngày: ngày 1 chọn việc và đo hiện trạng, ngày 2 quan sát và ghi nguyên trạng, ngày 3 viết bản nháp theo bảy phần, ngày 4 thử với người chưa biết việc, ngày 5 vá và thử lại, ngày 6 gán người chịu trách nhiệm và ngày rà, ngày 7 đo lại và so với ngày 1.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao phải ghi lại thực tế đang diễn ra trước khi viết quy trình lý tưởng?',
        a: 'Vì bản lý tưởng viết từ trong đầu người quản lý luôn thiếu những chi tiết chỉ tồn tại ở hiện trường: thiết bị nào hay trục trặc vào buổi sáng, khách hay hỏi gì ở bước nào, thứ tự nào thực sự tiết kiệm được bước đi lại. Khi bản viết không khớp thực tế, người thực hiện sẽ âm thầm làm theo cách cũ và văn bản trở thành thứ trang trí. Ngoài ra, quan sát thực tế còn cho bạn biết vì sao có những bước tưởng là thừa: nhiều bước kỳ lạ tồn tại vì một sự cố trong quá khứ, và cắt chúng mà không hỏi sẽ làm sự cố đó quay lại.',
      },
      {
        q: 'Phép thử tốt nhất cho một bản quy trình là gì, và vì sao người viết không nên tự thử?',
        a: 'Phép thử tốt nhất là đưa cho một người chưa từng làm việc đó, để họ thực hiện thật trong khi người viết ngồi quan sát và chỉ ghi chép, rồi đếm số lần họ phải dừng lại hỏi hoặc đoán. Người viết không thể tự thử vì họ đã có toàn bộ ngữ cảnh trong đầu và sẽ tự động lấp mọi khoảng trống mà không nhận ra mình đang lấp. Đây cũng là lý do người viết phải im lặng trong lúc quan sát: chỉ cần một câu gợi ý là chỗ hổng đó biến mất khỏi kết quả thử mà vẫn còn nguyên trong văn bản.',
      },
      {
        q: 'Chuẩn hoá quá mức có hại gì, và làm sao biết mình đã đi quá?',
        a: 'Chuẩn hoá quá mức làm mất khả năng phán đoán tại chỗ và làm chậm những tình huống cần linh hoạt, đồng thời tạo ra chi phí duy trì lớn cho một đống văn bản ít dùng. Dấu hiệu đi quá gồm: có quy trình cho những việc hiếm gặp mà mỗi lần xảy ra người ta vẫn phải hỏi lại; nhân viên phải xin phép cho những quyết định nhỏ mà hậu quả thấp; số lượng văn bản tăng nhưng số lỗi không giảm. Nguyên tắc cân bằng là chuẩn hoá phần lặp lại và có hậu quả rõ, còn phần cần phán đoán thì thay bằng nguyên tắc và ngưỡng tự quyết, tức là nói rõ mục tiêu và giới hạn thay vì kê từng bước.',
      },
    ],
    plan7:
      'Ngày 1: đếm các câu hỏi lặp lại trong tuần trước và chọn việc đáng chuẩn hoá nhất, đo hiện trạng bằng một chỉ số. Ngày 2: đứng quan sát người làm tốt nhất và ghi nguyên trạng. Ngày 3: viết bản nháp theo bảy phần, giữ trong một trang nếu có thể. Ngày 4: đưa cho một người chưa biết việc và quan sát im lặng, ghi mọi câu hỏi. Ngày 5: vá bản viết và thử lại với người thứ hai. Ngày 6: gán tên người chịu trách nhiệm, ngày ban hành, ngày rà và cách đề xuất sửa. Ngày 7: đo lại chỉ số và dán bản rút gọn tại nơi làm việc.',
    evidence:
      'Bằng chứng ở đây rất cụ thể và dễ trưng ra: chính bản quy trình bạn viết, kèm bản ghi vòng thử với người chưa biết việc và số câu hỏi giảm qua từng vòng, cùng một chỉ số trước sau như thời gian hoàn thành hay tỷ lệ lỗi. Nếu bạn xây được một thư viện quy trình cho một mảng, hãy giữ mục lục của nó. Trong phỏng vấn vị trí vận hành hoặc quản lý cửa hàng, kể lại vòng thử và con số câu hỏi từ mười bảy xuống bốn thuyết phục hơn nhiều so với việc nói rằng bạn có tư duy hệ thống. Trong CV: chuẩn hoá 3 quy trình vận hành cho điểm bán thứ hai, giảm số cuộc gọi hỏi ý kiến từ khoảng 5 xuống 1 mỗi ngày và giảm rõ rệt lượng hàng bỏ cuối ngày trong 6 tuần.',
    references: [
      { label: 'Atlassian Team Playbook — các bài thực hành vận hành nhóm', url: 'https://www.atlassian.com/team-playbook', type: 'article' },
      { label: 'Asana Resources — hướng dẫn về quy trình và vận hành công việc', url: 'https://asana.com/resources', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 10 — Tuyển người đầu tiên
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Người đầu tiên bạn tuyển không phải là người giúp bạn làm nhiều hơn, mà là người nhận lấy trọn vẹn một phần trách nhiệm để bạn không còn phải nghĩ về nó. Vì vậy câu hỏi mở đầu không phải tôi cần thêm người không, mà là phần việc nào tôi đang làm chiếm nhiều giờ nhất, dạy được, và có thể mô tả bằng kết quả đo được. Người đầu tiên cũng định hình văn hoá mạnh hơn bất kỳ tài liệu nào bạn viết sau này, vì người thứ hai và thứ ba sẽ học cách làm việc từ họ chứ không từ bạn. Mọi thủ tục về hợp đồng lao động, bảo hiểm và nghĩa vụ với người lao động phải được thực hiện đúng quy định hiện hành và nên có kế toán cùng người tư vấn pháp lý tham gia.',
    why: {
      work: 'Ngay cả khi bạn không phải chủ, việc đề xuất tuyển thêm người trong nhóm đòi hỏi đúng những lập luận này: phần việc nào, đo bằng gì, chi phí bao nhiêu, và điều gì sẽ khác đi sau ba tháng. Đề xuất thiếu ba phần đó thường bị bác.',
      interview:
        'Ở phía ngược lại, hiểu người tuyển đang thực sự tìm gì giúp bạn trả lời trúng. Doanh nghiệp nhỏ tuyển người đầu tiên tìm sự chủ động và khả năng làm việc khi mọi thứ chưa rõ ràng, không tìm người chỉ giỏi thực hiện đúng quy trình đã có.',
      study:
        'Thiết kế bản mô tả công việc và bộ tiêu chí đánh giá là bài luyện tư duy vận hành rất tốt: nó buộc bạn chuyển từ mô tả cảm tính sang các hành vi quan sát được và các kết quả đo được.',
      life: 'Khi thuê người giúp việc nhà, người chăm sóc người thân hay gia sư cho con, cùng bộ nguyên tắc áp dụng: mô tả rõ kết quả mong muốn, thử việc có thời hạn, phản hồi sớm và cụ thể, và thoả thuận bằng văn bản dù là việc gia đình.',
    },
    framework: [
      {
        name: 'Xác định phần việc chuyển giao thay vì chức danh',
        detail: 'Trước khi nghĩ tới tên vị trí, ghi lại nhật ký thời gian của bạn trong hai tuần và tìm cụm việc chiếm nhiều giờ nhất mà không đòi hỏi chính bạn. Viết ra kết quả mong muốn của cụm việc đó bằng đại lượng đo được. Chức danh chỉ là cái nhãn đặt sau cùng; tuyển theo chức danh nghe hay mà không rõ phần việc là nguyên nhân phổ biến của việc ba tháng sau cả hai bên đều thất vọng.',
      },
      {
        name: 'Viết mô tả trung thực gồm cả phần khó',
        detail: 'Nói rõ quy mô thật của doanh nghiệp, mức độ hỗn loạn, những việc không có sẵn quy trình, và mức lương thật kèm cách tăng. Bản mô tả tô hồng thu hút nhiều hồ sơ hơn nhưng lọc sai người, và chi phí của một người nghỉ sau hai tháng lớn hơn nhiều so với chi phí tuyển chậm hơn hai tuần.',
      },
      {
        name: 'Đánh giá bằng bài làm thật, không chỉ bằng phỏng vấn',
        detail: 'Thiết kế một bài tập nhỏ giống công việc thật, có thời lượng hợp lý và được trả công nếu nó tạo ra giá trị sử dụng được. Quan sát cách họ hỏi lại khi đề bài thiếu thông tin — với người đầu tiên, cách xử lý sự mơ hồ quan trọng hơn kiến thức có sẵn.',
      },
      {
        name: 'Thiết kế 30 ngày đầu trước khi họ tới',
        detail: 'Chuẩn bị sẵn: ai hướng dẫn, tuần đầu làm gì, tài khoản và công cụ nào cần cấp, kết quả nào coi là đạt sau 30 ngày và sau 90 ngày. Người đầu tiên bước vào một nơi chưa có gì mà lại không có kế hoạch đón sẽ mất ba tuần loay hoay và cả hai bên đều kết luận sai về nhau.',
      },
      {
        name: 'Phản hồi sớm theo nhịp ngắn và chốt đúng hạn',
        detail: 'Gặp riêng hằng tuần trong ba tháng đầu, mỗi lần nói một điều đang tốt và một điều cần đổi, cụ thể tới mức hành vi. Tới mốc đã hẹn thì phải chốt thật: đạt thì nói rõ và bàn bước tiếp theo, chưa đạt thì nói thẳng cùng lý do có bằng chứng. Kéo dài trạng thái lấp lửng là cách gây tổn thương cho cả người lao động lẫn doanh nghiệp; các bước liên quan tới hợp đồng phải làm đúng quy định pháp luật lao động.',
      },
    ],
    scenario:
      'Hai vợ chồng vận hành một doanh nghiệp nhỏ bán khoá học nấu ăn trực tuyến và tổ chức lớp thực hành cuối tuần. Cả hai đều làm mọi việc, và điểm nghẽn rõ nhất là toàn bộ khâu chăm sóc học viên: trả lời tin nhắn, xử lý hoàn tiền, nhắc lịch, gom phản hồi. Người vợ ghi nhật ký thời gian hai tuần và đo được khoảng 22 giờ mỗi tuần rơi vào cụm việc này, phần lớn vào buổi tối. Thay vì đăng tin tuyển trợ lý chung chung, họ viết mô tả theo kết quả: thời gian phản hồi tin nhắn dưới 4 giờ trong khung 8 giờ tới 20 giờ, tỷ lệ học viên hoàn thành khoá tăng, và mỗi tháng một báo cáo tóm tắt các phàn nàn lặp lại. Bản tin tuyển nói rõ doanh nghiệp chỉ có hai người, chưa có quy trình cho phần lớn công việc, và mức lương cụ thể. Vòng đánh giá gồm một bài tập được trả công: xử lý mười tin nhắn thật đã ẩn danh, trong đó có hai tình huống chưa có chính sách. Trong sáu ứng viên, hai người trả lời trơn tru cả mười tin, nhưng người được chọn là người trả lời tám tin và với hai tin còn lại thì viết ra ba câu hỏi cần hỏi chủ doanh nghiệp trước khi trả lời — đúng hành vi cần có khi chưa có quy trình. Trước ngày đầu tiên, họ chuẩn bị sẵn tài khoản, một tài liệu về những câu hỏi thường gặp và lịch gặp hằng tuần. Sau 90 ngày, thời gian người vợ dành cho cụm việc này còn khoảng 4 giờ mỗi tuần, và bản báo cáo phàn nàn hằng tháng dẫn tới việc họ sửa lại hai bài học bị hiểu nhầm nhiều nhất.',
    comparison: [
      { weak: 'Tuyển người giống mình để dễ làm việc và vì cảm giác hợp nhau ngay từ buổi đầu.', mature: 'Tuyển theo phần việc cần chuyển giao và theo hành vi quan sát được, chấp nhận người khác mình về phong cách nếu họ tạo ra kết quả cần có.' },
      { weak: 'Đăng tin mô tả công việc hấp dẫn và giấu bớt phần hỗn loạn của doanh nghiệp nhỏ.', mature: 'Nói rõ phần khó ngay trong tin tuyển, chấp nhận ít hồ sơ hơn để có người phù hợp và ở lại lâu hơn.' },
      { weak: 'Đánh giá chủ yếu qua trò chuyện và cảm nhận về sự nhiệt tình trong một giờ phỏng vấn.', mature: 'Cho làm một bài tập giống việc thật có trả công và quan sát cách họ xử lý phần đề bài còn thiếu thông tin.' },
    ],
    mistakes: [
      'Tuyển một người làm tất cả mọi việc vì ngân sách hạn chế, dẫn tới một bản mô tả gồm sáu nhóm việc không liên quan mà không ai làm tốt được cả sáu, và người vào sẽ nghỉ khi nhận ra thực tế.',
      'Trì hoãn cuộc nói chuyện về việc chưa đạt trong thời gian thử việc vì ngại, để tới khi hết hạn mới thông báo, khiến người lao động mất cơ hội sửa và mất luôn cả thời gian tìm việc khác.',
      'Không chuẩn bị gì cho tuần đầu tiên rồi kết luận người mới thiếu chủ động, trong khi họ không có tài khoản, không biết hỏi ai và không biết tiêu chí đánh giá là gì.',
    ],
    worksheet: [
      'Ghi nhật ký thời gian hai tuần của bạn và tìm cụm việc chiếm nhiều giờ nhất mà không nhất thiết phải do bạn làm. Bao nhiêu giờ mỗi tuần?',
      'Viết ba kết quả đo được mà người mới phải tạo ra sau 90 ngày. Nếu không viết được bằng đại lượng, phần việc đó chưa đủ rõ để chuyển giao.',
      'Mức lương và chế độ thật bạn trả được là bao nhiêu, và doanh nghiệp cần tăng thêm bao nhiêu doanh thu hoặc tiết kiệm bao nhiêu giờ để khoản đó hợp lý?',
      'Bài tập giống việc thật bạn sẽ giao trong quá trình tuyển là gì, và bạn sẽ quan sát điều gì ở cách họ xử lý phần thiếu thông tin?',
      'Trước ngày đầu tiên của người mới, những gì phải sẵn sàng? Liệt kê tài khoản, tài liệu, người hướng dẫn và lịch gặp trong bốn tuần đầu.',
    ],
    exercises: [
      { label: 'Nhật ký thời gian hai tuần', text: 'Ghi lại thời gian của bạn theo khối 30 phút trong hai tuần và phân loại thành các cụm việc. Tính tổng giờ cho từng cụm và xếp hạng theo tiêu chí nhiều giờ nhưng không cần chính bạn.', level: 'e' },
      { label: 'Viết mô tả theo kết quả', text: 'Viết bản mô tả công việc trong đó phần chính là ba kết quả đo được sau 90 ngày, không phải danh sách nhiệm vụ. Đưa cho một người ngoài đọc và hỏi họ hiểu công việc này thành công nghĩa là gì.', level: 'e' },
      { label: 'Viết phần khó vào tin tuyển', text: 'Thêm vào tin tuyển một đoạn trung thực về những điều khó của công việc và của doanh nghiệp bạn. So sánh số lượng và chất lượng hồ sơ với lần tuyển trước nếu có.', level: 'e' },
      { label: 'Thiết kế bài tập giống việc thật', text: 'Soạn một bài tập dưới hai giờ dựa trên tình huống có thật đã ẩn danh, trong đó cố ý thiếu một số thông tin. Viết trước bảng chấm gồm những hành vi bạn muốn thấy, đặc biệt là cách họ hỏi lại.', level: 'm' },
      { label: 'Bộ câu hỏi phỏng vấn theo hành vi', text: 'Soạn sáu câu hỏi về việc đã xảy ra trong quá khứ tương ứng với các năng lực bạn cần, mỗi câu kèm ba câu hỏi đào sâu. Phỏng vấn thử với một người quen và ghi lại chỗ bạn hài lòng với câu trả lời chung chung.', level: 'm' },
      { label: 'Kế hoạch 30 và 90 ngày', text: 'Viết kế hoạch đón người mới gồm tuần đầu làm gì, ai hướng dẫn từng phần, kết quả kỳ vọng ở mốc 30 và 90 ngày, và lịch gặp hằng tuần. Rà lại xem có mục nào phụ thuộc hoàn toàn vào sự có mặt của bạn không.', level: 'm' },
      { label: 'Diễn tập cuộc trò chuyện khó', text: 'Viết kịch bản cho cuộc trò chuyện giữa kỳ thử việc khi kết quả chưa đạt: mở đầu bằng sự việc cụ thể, nêu khoảng cách so với tiêu chí đã thống nhất, hỏi nguyên nhân, và chốt điều gì sẽ khác trong hai tuần tới. Nhờ một người đóng vai và ghi lại chỗ bạn né tránh.', level: 'h' },
      { label: 'Thử thách 7 ngày: chuẩn bị đủ để tuyển', text: 'Bảy ngày: ngày 1-2 ghi nhật ký thời gian, ngày 3 xác định cụm việc chuyển giao và viết ba kết quả đo được, ngày 4 viết mô tả công việc trung thực, ngày 5 thiết kế bài tập giống việc thật và bảng chấm, ngày 6 viết kế hoạch 30 và 90 ngày, ngày 7 tính chi phí đầy đủ của vị trí này và xác nhận với kế toán về các nghĩa vụ đi kèm.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên tuyển theo phần việc cần chuyển giao thay vì theo chức danh?',
        a: 'Vì chức danh là một cái nhãn có nghĩa rất khác nhau giữa các doanh nghiệp, còn phần việc là thứ có thể mô tả bằng kết quả đo được và kiểm chứng được. Tuyển theo chức danh dẫn tới việc cả hai bên tự điền vào khoảng trống bằng hình dung riêng, và sau ba tháng phát hiện hai hình dung đó không trùng nhau. Tuyển theo phần việc còn cho bạn một tiêu chí đánh giá rõ ràng ngay từ đầu, và cho ứng viên cơ hội tự đánh giá mình có phù hợp hay không trước khi nộp hồ sơ, điều này lọc bớt cả hai loại sai lầm tuyển dụng.',
      },
      {
        q: 'Vì sao với người đầu tiên, cách xử lý sự mơ hồ lại quan trọng hơn kiến thức có sẵn?',
        a: 'Vì trong một doanh nghiệp nhỏ chưa có quy trình, phần lớn tình huống người mới gặp sẽ không có câu trả lời sẵn ở đâu cả. Người giỏi thực hiện theo quy trình có sẵn sẽ liên tục bị kẹt và liên tục phải hỏi, làm mất đúng thứ mà việc tuyển người lẽ ra phải giải phóng. Hành vi cần tìm là: nhận ra chỗ mình thiếu thông tin, đặt câu hỏi cụ thể thay vì hỏi chung chung, đưa ra đề xuất kèm lý do thay vì chỉ nêu vấn đề, và ghi lại cách xử lý để lần sau thành quy trình. Đây là những hành vi quan sát được trong một bài tập cố ý thiếu thông tin, nhưng gần như không quan sát được qua một cuộc trò chuyện thông thường.',
      },
      {
        q: 'Người quản lý nên xử lý thế nào khi kết quả thử việc chưa đạt, và ranh giới trách nhiệm nằm ở đâu?',
        a: 'Về phần chuyên môn, người quản lý có trách nhiệm nói sớm chứ không đợi tới hạn: nêu sự việc cụ thể, đối chiếu với tiêu chí đã thống nhất từ đầu, hỏi nguyên nhân trước khi kết luận, cung cấp hỗ trợ đã hứa và ghi chép trung thực quá trình. Nếu tới mốc vẫn chưa đạt thì phải nói thẳng kèm lý do có bằng chứng, thay vì kéo dài trạng thái lấp lửng gây thiệt cho cả hai. Về phần thủ tục, mọi vấn đề liên quan tới hợp đồng lao động, thời gian thử việc, thông báo và các nghĩa vụ đi kèm đều chịu điều chỉnh của pháp luật lao động và có yêu cầu cụ thể; đây là phần phải làm đúng quy định hiện hành với sự tham gia của người có chuyên môn về nhân sự hoặc pháp lý, không phải phần để tự suy luận.',
      },
    ],
    plan7:
      'Ngày 1: bắt đầu nhật ký thời gian theo khối 30 phút. Ngày 2: tiếp tục ghi và phân loại sơ bộ thành các cụm việc. Ngày 3: chọn cụm việc chuyển giao và viết ba kết quả đo được sau 90 ngày. Ngày 4: viết bản mô tả công việc có cả phần khó và mức lương thật. Ngày 5: thiết kế bài tập giống việc thật kèm bảng chấm hành vi. Ngày 6: viết kế hoạch đón người mới cho 30 và 90 ngày. Ngày 7: tính tổng chi phí thật của vị trí và trao đổi với kế toán về các nghĩa vụ phải thực hiện đúng quy định.',
    evidence:
      'Bằng chứng dùng được gồm bản mô tả công việc theo kết quả mà bạn viết, bài tập đánh giá kèm bảng chấm hành vi, kế hoạch 30 và 90 ngày, và kết quả thực tế: bao nhiêu giờ mỗi tuần được giải phóng, chỉ số của phần việc được chuyển giao thay đổi ra sao, người đó có ở lại và phát triển không. Trong phỏng vấn cho vị trí quản lý, câu chuyện có sức nặng nhất thường là lần bạn chọn ứng viên làm được ít hơn nhưng hỏi đúng câu, và lý do đằng sau lựa chọn đó. Trong CV: thiết kế quy trình tuyển và đón nhân sự đầu tiên dựa trên bài tập giống việc thật, chuyển giao trọn cụm việc chăm sóc khách hàng và giảm thời gian của người sáng lập cho mảng này từ khoảng 22 xuống 4 giờ mỗi tuần sau 90 ngày.',
    references: [
      { label: 'First Round Review — kinh nghiệm tuyển dụng cho công ty giai đoạn đầu', url: 'https://review.firstround.com', type: 'article' },
      { label: 'Y Combinator Startup Library', url: 'https://www.ycombinator.com/library', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 11 — Xây dựng hệ thống quản trị
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Hệ thống quản trị là bộ quy tắc trả lời ba câu hỏi trước khi tranh cãi xảy ra: ai được quyết cái gì, thông tin nào được nhìn bởi ai và vào lúc nào, và những bất đồng được xử lý theo cách nào. Nó khác quản lý hằng ngày ở chỗ nó là luật chơi chứ không phải nước đi. Doanh nghiệp nhỏ thường bỏ qua phần này vì thấy thừa khi chỉ có vài người, rồi phải xây nó trong lúc đang có xung đột — thời điểm tệ nhất để thiết kế luật, vì khi đó mọi quy tắc đều bị đọc như một nước đi nhắm vào ai đó.',
    why: {
      work: 'Trong tổ chức lớn, hiểu ai thực sự có quyền quyết định giúp bạn đưa đề xuất tới đúng chỗ thay vì thuyết phục nhầm người trong nhiều tháng. Người vẽ được bản đồ quyết định của tổ chức mình làm việc hiệu quả hơn hẳn.',
      interview:
        'Ứng viên cấp quản lý thường được hỏi về một lần bất đồng với đồng cấp hoặc với cấp trên. Câu trả lời có giá trị là câu cho thấy bạn phân biệt được bất đồng về dữ kiện, về mục tiêu và về thẩm quyền, vì ba loại có ba cách xử lý khác nhau.',
      study:
        'Nghiên cứu về tổ chức trở nên dễ hiểu hơn nhiều khi bạn nhìn qua lăng kính phân bổ quyền quyết định và luồng thông tin, thay vì học thuộc các mô hình cơ cấu.',
      life: 'Nhóm bạn góp vốn mở quán, hội đồng hương, ban phụ huynh lớp đều cần luật chơi: ai quyết chi tiêu tới mức nào, tiền bạc công khai ra sao, bất đồng giải quyết thế nào. Nhóm bỏ qua phần này thường tan rã vì tiền và vì cảm giác không công bằng chứ không vì thiếu năng lực.',
    },
    framework: [
      {
        name: 'Vẽ bản đồ quyết định',
        detail: 'Liệt kê 15 tới 25 loại quyết định thường xuyên xảy ra và với mỗi loại ghi rõ: ai đề xuất, ai được tham vấn, ai quyết cuối cùng, ai chỉ cần được thông báo. Việc phân biệt được tham vấn với quyết là điểm mấu chốt — rất nhiều xung đột đến từ việc một người tưởng mình đang quyết trong khi vai thật của họ là được hỏi ý.',
      },
      {
        name: 'Đặt ngưỡng tự quyết bằng con số',
        detail: 'Với các quyết định chi tiêu, tuyển dụng, giảm giá, hoàn tiền, hãy đặt hạn mức cụ thể cho từng cấp kèm nghĩa vụ báo lại. Ngưỡng phải đủ rộng để công việc chạy mà không phải chờ, và phải kèm quy tắc rõ về những trường hợp bắt buộc phải hỏi bất kể giá trị.',
      },
      {
        name: 'Thiết lập nhịp thông tin cố định',
        detail: 'Định rõ: những số nào được công bố, cho ai, với tần suất nào, ai chuẩn bị. Ví dụ một bảng chỉ số hằng tuần cho cả nhóm, một buổi rà tháng cho những người phụ trách, và một buổi rà quý cho các chủ sở hữu. Nhịp cố định quan trọng hơn nội dung hoàn hảo, vì nó biến việc trao đổi thông tin từ sự kiện thành thói quen.',
      },
      {
        name: 'Viết cơ chế xử lý bất đồng trước khi cần',
        detail: 'Quy định: bất đồng về dữ kiện thì đi lấy dữ liệu và ai là người có tiếng nói cuối về nguồn số; bất đồng về mục tiêu thì đưa lên cuộc họp nào; bất đồng về thẩm quyền thì tra bản đồ quyết định. Với những người đồng sở hữu, cần thoả thuận trước bằng văn bản về những vấn đề lớn như phân chia lợi nhuận, quyền chuyển nhượng phần vốn góp, cách xử lý khi một người muốn rút — và những nội dung này phải được người tư vấn pháp lý soạn hoặc rà vì chúng có hiệu lực ràng buộc.',
      },
      {
        name: 'Rà và cập nhật luật chơi định kỳ',
        detail: 'Mỗi quý, xem lại bản đồ quyết định và các ngưỡng: có loại quyết định nào đang tắc ở một người không, có ngưỡng nào đã lỗi thời so với quy mô mới không, có bất đồng nào lặp lại cho thấy luật chơi còn khoảng trống không. Sửa vào lúc bình thường, không sửa trong lúc đang tranh chấp.',
      },
    ],
    scenario:
      'Một doanh nghiệp xã hội sản xuất túi và phụ kiện từ vải tái chế do ba người đồng sáng lập lập ra: một người phụ trách sản xuất và làm việc với nhóm thợ, một người phụ trách bán hàng và thương hiệu, một người lo tài chính và các dự án tài trợ. Sau mười tám tháng, doanh thu ổn nhưng ba người liên tục căng thẳng. Ba mâu thuẫn lặp đi lặp lại: nhận hay không nhận một đơn hàng lớn có biên lợi nhuận thấp, mức giảm giá tối đa cho đại lý, và việc dùng tiền tài trợ cho hoạt động nào. Họ dành hai buổi để viết luật chơi thay vì tranh luận từng vụ. Kết quả gồm bản đồ 19 loại quyết định trong đó ghi rõ ai quyết cuối cùng cho từng loại; ba ngưỡng tự quyết bằng con số cho chi tiêu, giảm giá và cam kết sản lượng; một bảng chỉ số công bố cho cả nhóm vào sáng thứ Hai gồm bảy dòng; và một quy tắc cho bất đồng chưa giải quyết được, là bên phản đối phải nêu điều kiện cụ thể nào thay đổi thì họ sẽ đồng ý. Về phần thoả thuận giữa những người đồng sở hữu — tỷ lệ phần vốn góp, cách xử lý nếu một người muốn rút, phân chia kết quả — họ không tự viết mà mang tới một luật sư để soạn thành văn bản đúng quy định. Trong quý tiếp theo, số cuộc tranh luận kéo dài giảm rõ rệt; điều bất ngờ nhất với họ là hai trong ba mâu thuẫn cũ hoá ra không phải bất đồng về giá trị mà là bất đồng về thẩm quyền, và bản đồ quyết định giải quyết chúng chỉ trong một buổi.',
    comparison: [
      { weak: 'Ba người đồng sở hữu cùng quyết mọi việc bằng cách bàn cho tới khi nhất trí, vì như thế mới công bằng.', mature: 'Phân định rõ từng loại quyết định thuộc về ai, giữ nguyên tắc nhất trí chỉ cho một nhóm nhỏ các vấn đề lớn đã liệt kê sẵn.' },
      { weak: 'Giữ thông tin tài chính trong tay một người vì sợ người khác hiểu sai hoặc lo lắng.', mature: 'Công bố một bộ chỉ số cố định theo nhịp đều kèm giải thích, vì thiếu thông tin luôn được lấp đầy bằng suy đoán tệ hơn thực tế.' },
      { weak: 'Chờ tới khi có xung đột lớn mới ngồi lại bàn về nguyên tắc làm việc chung.', mature: 'Viết luật chơi vào lúc quan hệ còn tốt, và coi mỗi lần bất đồng lặp lại là tín hiệu để bổ sung luật chứ không phải để phân xử ai đúng ai sai.' },
    ],
    mistakes: [
      'Nhầm minh bạch với công bố mọi thứ không chọn lọc: gửi toàn bộ số liệu thô cho cả nhóm mà không kèm cách đọc, khiến người nhận hoặc bỏ qua hoặc hiểu sai rồi lo lắng vô ích.',
      'Xây bản đồ quyết định rất chi tiết nhưng không ai dùng, vì nó nằm trong một file không ai mở và vì lần đầu tiên có tranh cãi thì người có quyền lớn nhất vẫn quyết theo cách cũ.',
      'Trì hoãn việc thoả thuận bằng văn bản giữa những người đồng sở hữu vì đang là bạn bè thân thiết, khiến khi một người muốn rút hoặc khi có tiền lớn thì không có căn cứ nào ngoài trí nhớ mỗi bên.',
    ],
    worksheet: [
      'Liệt kê năm loại quyết định gần đây gây tranh luận kéo dài nhất. Với mỗi loại, ai thực sự đã quyết và điều đó có được thống nhất từ trước không?',
      'Trong doanh nghiệp của bạn, có loại quyết định nào mà mọi người đều nghĩ người khác chịu trách nhiệm không? Viết ra và gán tên ngay.',
      'Ngưỡng tự quyết hiện tại cho chi tiêu, giảm giá và cam kết với khách là bao nhiêu? Nếu chưa có, hãy đề xuất con số cho từng cấp.',
      'Những số nào đang được công bố cho cả nhóm, với tần suất nào? Ai không được thấy số nào và lý do là gì?',
      'Nếu một người đồng sở hữu muốn rút khỏi doanh nghiệp trong sáu tháng tới, hiện có văn bản nào quy định cách xử lý không? Nếu không, bạn dự định làm gì trong tháng này?',
    ],
    exercises: [
      { label: 'Bản đồ mười lăm quyết định', text: 'Liệt kê 15 loại quyết định thường gặp và điền bốn vai cho từng loại: đề xuất, tham vấn, quyết, được thông báo. Đưa bản nháp cho cả nhóm và ghi lại những chỗ họ hiểu khác bạn.', level: 'e' },
      { label: 'Bảng bảy dòng hằng tuần', text: 'Chọn đúng bảy chỉ số công bố cho cả nhóm hằng tuần, viết một câu giải thích cách đọc cho từng dòng, và gửi bản đầu tiên vào một ngày cố định.', level: 'e' },
      { label: 'Ba ngưỡng tự quyết', text: 'Viết ba ngưỡng bằng con số cho chi tiêu, giảm giá và cam kết thời hạn với khách, kèm nghĩa vụ báo lại. Thông báo cho nhóm và ghi ngày ban hành.', level: 'e' },
      { label: 'Rà quyết định tắc', text: 'Trong hai tuần, ghi lại mọi lần một công việc phải dừng để chờ ai đó quyết, kèm thời gian chờ. Nhóm lại theo loại quyết định và đề xuất chuyển ít nhất ba loại xuống cấp thấp hơn.', level: 'm' },
      { label: 'Quy tắc xử lý bất đồng', text: 'Viết quy tắc phân loại bất đồng thành ba nhóm dữ kiện, mục tiêu, thẩm quyền, kèm cách xử lý cho từng nhóm. Áp dụng thử cho ba bất đồng gần nhất và kiểm xem quy tắc có phân loại được không.', level: 'm' },
      { label: 'Buổi rà quý đầu tiên', text: 'Tổ chức một buổi rà quý có nghị trình viết trước gồm nhìn lại chỉ số, rà bản đồ quyết định, và một mục về những gì đang không hiệu quả. Ghi biên bản có tên người và hạn cho từng việc phát sinh.', level: 'm' },
      { label: 'Chuẩn bị thoả thuận giữa các chủ sở hữu', text: 'Soạn danh sách những nội dung cần được quy định giữa những người đồng sở hữu: tỷ lệ, quyền quyết định các vấn đề lớn, điều kiện chuyển nhượng, cách xử lý khi một người rút hoặc không đóng góp như cam kết. Mang danh sách này tới luật sư để được tư vấn và soạn thành văn bản đúng quy định, không tự viết rồi ký.', level: 'h' },
      { label: 'Thử thách 7 ngày: dựng khung quản trị tối thiểu', text: 'Bảy ngày: ngày 1 liệt kê các quyết định gây tranh luận, ngày 2 dựng bản đồ quyết định nháp, ngày 3 lấy phản hồi của nhóm và sửa, ngày 4 viết ba ngưỡng tự quyết, ngày 5 chọn bảy chỉ số và gửi bản đầu tiên, ngày 6 viết quy tắc xử lý bất đồng, ngày 7 đặt lịch rà quý và liệt kê các nội dung cần đưa cho luật sư.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên viết luật chơi vào lúc quan hệ đang tốt thay vì lúc đang có xung đột?',
        a: 'Vì trong lúc xung đột, mọi quy tắc được đề xuất đều bị đọc như một nước đi nhắm vào một người cụ thể, kể cả khi ý định hoàn toàn trung lập. Khi đó việc bàn về nguyên tắc biến thành việc phân xử một vụ việc, và kết quả thường là một quy tắc thiên lệch hoặc không có quy tắc nào. Ngoài ra, lúc quan hệ tốt là lúc mọi người còn đủ thiện chí để tưởng tượng các tình huống bất lợi cho chính mình, điều gần như không xảy ra khi đã có mâu thuẫn. Cái giá phải trả là cảm giác thừa thãi ở thời điểm viết, và đó là cái giá rẻ.',
      },
      {
        q: 'Phân biệt vai được tham vấn và vai quyết định quan trọng như thế nào trong thực tế?',
        a: 'Rất quan trọng, vì phần lớn cảm giác bị coi thường trong tổ chức đến từ việc một người tưởng mình có quyền quyết trong khi vai thật của họ là được hỏi ý kiến. Khi vai được nói rõ từ đầu, người được tham vấn vẫn đóng góp đầy đủ nhưng không kỳ vọng ý mình phải được chọn, còn người quyết có trách nhiệm giải thích lý do khi chọn khác. Ngược lại, nếu vai không rõ, mỗi quyết định trở thành một cuộc thương lượng ngầm về quyền lực, tốn thời gian và làm hỏng quan hệ. Điểm cần lưu ý là được tham vấn phải là thật: hỏi ý kiến rồi không bao giờ đọc sẽ phá lòng tin nhanh hơn là không hỏi.',
      },
      {
        q: 'Vì sao thoả thuận giữa những người đồng sở hữu nên được lập bằng văn bản có tư vấn pháp lý, ngay cả khi các bên là bạn thân?',
        a: 'Vì thoả thuận này chỉ thực sự được dùng tới trong những tình huống mà quan hệ đã căng thẳng hoặc hoàn cảnh đã thay đổi: một người muốn rút, một người không đóng góp như cam kết, có bên thứ ba muốn tham gia, hoặc có sự kiện ngoài dự tính xảy ra với một người. Đúng vào lúc đó thì thiện chí và trí nhớ không còn là căn cứ đáng tin, và nếu không có văn bản thì không có gì để dựa vào. Việc tự viết cũng rủi ro vì các nội dung như tỷ lệ phần vốn góp, quyền chuyển nhượng, thẩm quyền của người đại diện và cách xử lý khi chấm dứt đều chịu điều chỉnh của các quy định cụ thể; một điều khoản viết sai có thể vô hiệu hoặc gây hệ quả ngoài ý muốn. Đây là loại việc phải làm với luật sư ngay từ đầu, và nên coi chi phí đó là một phần của chi phí thành lập.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê những quyết định gây tranh luận nhiều nhất trong sáu tháng qua. Ngày 2: dựng bản đồ quyết định nháp cho 15 loại. Ngày 3: đưa cho từng người trong nhóm và ghi lại mọi chỗ họ hiểu khác. Ngày 4: chốt bản đồ và viết ba ngưỡng tự quyết bằng con số. Ngày 5: chọn bảy chỉ số công bố hằng tuần và gửi bản đầu tiên. Ngày 6: viết quy tắc phân loại và xử lý bất đồng. Ngày 7: đặt lịch rà quý và lập danh sách nội dung cần đưa cho luật sư soạn thành văn bản.',
    evidence:
      'Bằng chứng ở đây là bộ tài liệu quản trị có ngày ban hành và dấu vết sửa đổi: bản đồ quyết định, bảng ngưỡng tự quyết, mẫu báo cáo chỉ số hằng tuần, quy tắc xử lý bất đồng, và biên bản các buổi rà quý. Kèm theo là một chỉ số đo được như thời gian chờ quyết định trung bình hoặc số lần một công việc phải dừng để chờ phê duyệt. Trong phỏng vấn cho vị trí quản lý cấp cao hoặc đồng sáng lập, việc bạn kể được cách mình biến một mâu thuẫn lặp lại thành một quy tắc là dấu hiệu của người xây tổ chức chứ không chỉ vận hành nó. Trong CV: thiết kế khung quản trị cho doanh nghiệp ba người đồng sáng lập gồm bản đồ 19 loại quyết định, ngưỡng tự quyết và nhịp báo cáo tuần, giảm đáng kể số quyết định bị tắc chờ phê duyệt.',
    references: [
      { label: 'Harvard Business Review — chủ đề quản trị doanh nghiệp', url: 'https://hbr.org/topic/subject/corporate-governance', type: 'article', needsReview: true },
      { label: 'Atlassian Team Playbook — công cụ làm rõ vai trò và quyết định trong nhóm', url: 'https://www.atlassian.com/team-playbook', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 12 — Gọi vốn và trình bày với nhà đầu tư
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Gọi vốn là bán một phần tương lai doanh nghiệp để mua thời gian, và như mọi giao dịch, nó chỉ có lợi khi bạn biết mình đang mua gì bằng giá nào. Kỹ thuật trình bày thì học được và luyện được: cấu trúc câu chuyện, chuẩn bị số liệu, trả lời câu hỏi khó. Nhưng có một ranh giới phải nói rõ ngay: các phương pháp định giá, cấu trúc điều khoản và quy mô vòng vốn không có đáp án đúng phổ quát — chúng phụ thuộc ngành, giai đoạn, thời điểm thị trường và tương quan thương lượng giữa hai bên, và mọi con số bạn nghe được từ người khác đều là kết quả của một cuộc đàm phán cụ thể chứ không phải một chuẩn mực. Không ký bất kỳ điều khoản đầu tư nào khi chưa có luật sư có kinh nghiệm về giao dịch đầu tư đọc kỹ toàn bộ.',
    why: {
      work: 'Kỹ năng trình bày để xin nguồn lực dùng được ở mọi nơi: xin ngân sách cho một dự án nội bộ có cùng cấu trúc với gọi vốn, chỉ khác người nghe. Cả hai đều trả lời ba câu: vấn đề gì, vì sao là bạn, và tiền sẽ biến thành kết quả gì.',
      interview:
        'Khả năng trình bày một câu chuyện có số liệu trong mười phút và chịu được các câu hỏi phản biện là thứ được đánh giá trong hầu hết các vòng phỏng vấn cấp cao. Chuẩn bị cho một buổi gọi vốn là cách luyện kỹ năng đó ở mức khắt khe nhất.',
      study:
        'Đọc hiểu về cấu trúc vốn, pha loãng và các loại quyền lợi của cổ đông là phần kiến thức tài chính có tính ứng dụng cao, kể cả khi bạn không bao giờ gọi vốn — nó giúp bạn đọc tin tức doanh nghiệp mà không bị con số lớn đánh lừa.',
      life: 'Việc vay tiền người thân để làm ăn có cùng bản chất: bạn đang lấy nguồn lực của người khác với một lời hứa về tương lai. Thói quen viết rõ điều kiện, rủi ro và cách trả bảo vệ được quan hệ, và đó là thứ đáng giá hơn khoản tiền.',
    },
    framework: [
      {
        name: 'Trả lời trước câu hỏi có nên gọi vốn không',
        detail: 'Gọi vốn hợp lý khi có một cơ hội cần tiền để đi nhanh hơn và việc đi nhanh thực sự tạo lợi thế, đồng thời bạn chấp nhận đánh đổi: mất một phần quyền sở hữu, có thêm nghĩa vụ báo cáo, và chịu áp lực tăng trưởng theo kỳ vọng của người góp vốn. Nếu doanh nghiệp có thể tự tài trợ bằng dòng tiền và tốc độ không phải yếu tố sống còn, gọi vốn có thể là lựa chọn tệ hơn. Viết ra bằng văn bản lý do bạn cần tiền và số tiền đó mua được bao nhiêu tháng để làm gì.',
      },
      {
        name: 'Dựng câu chuyện theo trình tự vấn đề, bằng chứng, con đường',
        detail: 'Phần đầu nêu vấn đề của một nhóm người cụ thể và tại sao nó đáng giải. Phần giữa là bằng chứng bạn đã thu được: người dùng thật, doanh thu thật, tỷ lệ giữ chân thật, các phép kiểm đã chạy. Phần cuối là con đường: tiền này dùng vào ba việc gì, và sau bao nhiêu tháng thì đạt được cột mốc nào có thể kiểm chứng. Người nghe nhớ được ba điều là nhiều rồi, nên phải chọn trước ba điều đó là gì.',
      },
      {
        name: 'Chuẩn bị lớp số liệu phía sau',
        detail: 'Ngoài bộ trình bày, phải có sẵn bảng dữ liệu chi tiết: doanh thu theo tháng, nhóm khách theo thời kỳ và tỷ lệ giữ chân, unit economics, dòng tiền, cấu trúc chi phí, tình trạng pháp lý và sở hữu trí tuệ. Nhà đầu tư nghiêm túc sẽ hỏi tới lớp thứ ba của mọi con số. Không biết thì nói không biết và hẹn trả lời — đoán bừa một con số là cách nhanh nhất để mất tín nhiệm.',
      },
      {
        name: 'Luyện phần hỏi đáp khắc nghiệt',
        detail: 'Liệt kê hai mươi câu hỏi khó nhất về mô hình của bạn, đặc biệt những câu bạn không muốn nghe: vì sao khách rời đi, vì sao đối thủ lớn không làm được việc này, điều gì xảy ra nếu kênh chính đắt lên gấp đôi. Nhờ người có kinh nghiệm đóng vai người phản biện. Phần hỏi đáp thường quyết định nhiều hơn phần trình bày.',
      },
      {
        name: 'Đàm phán có tư vấn và không vội',
        detail: 'Khi có đề nghị, đọc toàn bộ điều khoản chứ không chỉ nhìn con số định giá và số tiền, vì các điều khoản về quyền biểu quyết, quyền ưu tiên khi thanh lý, điều kiện chống pha loãng và các cam kết ràng buộc có thể quan trọng hơn nhiều so với con số nổi bật. Mọi nội dung này phải do luật sư có kinh nghiệm về giao dịch đầu tư rà; đây không phải chỗ để tiết kiệm chi phí tư vấn, và cũng không phải chỗ để làm theo mẫu tìm được trên mạng vì bối cảnh pháp lý và thực tiễn từng nơi khác nhau.',
      },
    ],
    scenario:
      'Một nhóm bốn người xây phần mềm quản lý kho và đơn hàng cho các nhà bán lẻ vừa và nhỏ, sau hai năm có 90 khách trả tiền theo tháng và doanh thu định kỳ đủ trang trải chi phí ở mức tối thiểu. Họ quyết định gọi vốn để mở rộng đội bán hàng. Trước khi gặp ai, họ viết một trang trả lời câu hỏi vì sao cần tiền: hiện mỗi tháng chỉ tiếp cận được số khách tiềm năng hạn chế vì chỉ có một người bán, trong khi tỷ lệ khách còn sử dụng sau mười hai tháng của họ ở mức cao và chi phí có được một khách hoàn vốn trong khoảng thời gian họ đo được. Nghĩa là điểm nghẽn là năng lực bán chứ không phải sản phẩm, và tiền mua được điều đó. Bộ trình bày của họ mười hai trang, trong đó ba trang là số thật theo nhóm khách vào cùng thời kỳ. Họ chuẩn bị một tài liệu phụ lục dày hơn nhiều và luyện phần hỏi đáp với hai người từng làm trong ngành, thu về hai mươi ba câu hỏi trong đó có bốn câu họ không trả lời được và phải đi tìm dữ liệu. Khi nhận được đề nghị đầu tiên, con số định giá nghe hấp dẫn nhưng bản điều khoản có vài nội dung mà họ không hiểu hết hàm ý. Họ không ký ngay mà thuê một luật sư có kinh nghiệm về giao dịch đầu tư đọc toàn bộ, và dành hai tuần đàm phán lại một số điều khoản. Kết quả cuối cùng khác đáng kể so với bản đầu, và bài học họ ghi lại là con số nổi bật nhất trong một đề nghị hiếm khi là con số quan trọng nhất.',
    comparison: [
      { weak: 'Trình bày bằng dự báo tăng trưởng dựng đứng cho năm năm tới và quy mô thị trường tính bằng tỷ đô.', mature: 'Trình bày bằng bằng chứng đã có trong tay kèm cách bạn đo, rồi mới tới dự báo ngắn hạn có gắn với những cột mốc kiểm chứng được.' },
      { weak: 'Trả lời câu hỏi khó bằng cách nói vòng hoặc đưa ra một con số ước chừng cho có.', mature: 'Nói thẳng là chưa có dữ liệu, nêu cách bạn sẽ tìm ra và hẹn ngày trả lời, rồi thực sự gửi đúng hẹn.' },
      { weak: 'Chọn đề nghị đầu tư dựa trên con số định giá cao nhất và ký nhanh vì sợ mất cơ hội.', mature: 'Đọc toàn bộ điều khoản cùng luật sư, so sánh cả về quyền lợi và nghĩa vụ dài hạn, và chấp nhận mất một cơ hội còn hơn nhận một cấu trúc gây khó cho nhiều năm sau.' },
    ],
    mistakes: [
      'Giấu điểm yếu và các số liệu xấu trong lúc trình bày, để rồi chúng lộ ra trong quá trình thẩm định — mất niềm tin ở giai đoạn đó gần như luôn kết thúc thương vụ và ảnh hưởng cả tới các cuộc gặp sau.',
      'Coi các con số nghe được về định giá hay quy mô vòng vốn của doanh nghiệp khác như một chuẩn mực áp dụng được cho mình, trong khi mỗi giao dịch là kết quả của bối cảnh và tương quan đàm phán riêng và thường không được công bố đầy đủ.',
      'Bắt đầu gọi vốn khi chỉ còn đủ tiền cho hai tháng, khiến bạn đàm phán ở thế yếu nhất và buộc phải chấp nhận điều kiện bất lợi vì không còn lựa chọn nào khác.',
    ],
    worksheet: [
      'Viết một trang trả lời: vì sao doanh nghiệp bạn cần vốn bên ngoài thay vì tự tài trợ bằng dòng tiền, và số tiền đó mua được bao nhiêu tháng để làm gì cụ thể?',
      'Ba bằng chứng mạnh nhất bạn đang có trong tay là gì? Với mỗi bằng chứng, ghi rõ cách bạn đo và khoảng thời gian dữ liệu.',
      'Ba điểm yếu lớn nhất của doanh nghiệp bạn là gì, và bạn sẽ trình bày chúng như thế nào một cách trung thực mà vẫn kèm hướng xử lý?',
      'Viết hai mươi câu hỏi khó nhất mà một người phản biện có kinh nghiệm sẽ hỏi. Bạn hiện không trả lời được bao nhiêu câu?',
      'Nếu quá trình gọi vốn kéo dài chín tháng và không thành công, doanh nghiệp bạn còn sống được không? Viết số tháng tiền mặt hiện tại.',
    ],
    exercises: [
      { label: 'Một trang lý do cần vốn', text: 'Viết đúng một trang gồm điểm nghẽn hiện tại, vì sao tiền giải được điểm nghẽn đó, số tiền và số tháng nó mua được, và cột mốc kiểm chứng được ở cuối giai đoạn. Đưa cho một người ngoài đọc và hỏi họ có thấy mạch lập luận nào bị hổng không.', level: 'e' },
      { label: 'Ba điều muốn người nghe nhớ', text: 'Viết ba câu bạn muốn người nghe nhớ sau buổi gặp. Sau đó rà toàn bộ bộ trình bày và cắt mọi trang không phục vụ một trong ba câu đó.', level: 'e' },
      { label: 'Bảng số liệu phụ lục', text: 'Dựng tài liệu phụ lục gồm doanh thu theo tháng, nhóm khách theo thời kỳ, tỷ lệ giữ chân, unit economics và dòng tiền. Kiểm tra mọi con số có thể truy ngược về dữ liệu gốc.', level: 'e' },
      { label: 'Luyện trình bày mười phút', text: 'Trình bày trong đúng mười phút, quay lại video, xem lại và ghi ra ba chỗ bạn nói dài dòng và một chỗ người nghe sẽ mất mạch. Làm lại lần hai và so sánh.', level: 'm' },
      { label: 'Phiên phản biện khắc nghiệt', text: 'Nhờ hai người có kinh nghiệm trong ngành đóng vai người phản biện trong 45 phút, yêu cầu họ không nương tay. Ghi lại mọi câu bạn không trả lời được và tìm dữ liệu cho từng câu trong tuần tiếp theo.', level: 'm' },
      { label: 'Trình bày phần yếu trước', text: 'Viết lại phần nói về ba điểm yếu của doanh nghiệp sao cho trung thực, ngắn gọn và kèm hướng xử lý. Trình bày phần này riêng cho một người bạn tin cậy và hỏi họ cảm nhận về mức độ đáng tin của bạn.', level: 'm' },
      { label: 'Đọc một mẫu điều khoản cùng người có chuyên môn', text: 'Tìm một mẫu tài liệu điều khoản đầu tư công khai và ngồi cùng một người có kinh nghiệm để đi qua từng nhóm điều khoản, viết lại bằng ngôn ngữ thường ý nghĩa của từng nhóm với người sáng lập. Ghi rõ đây là bài học để hiểu khái niệm, còn với giao dịch thật thì bắt buộc phải có luật sư riêng của bạn rà.', level: 'h' },
      { label: 'Thử thách 7 ngày: từ trang đầu tới danh sách người cần gặp', text: 'Bảy ngày: ngày 1 viết một trang lý do cần vốn, ngày 2 tập hợp và kiểm chứng số liệu, ngày 3 dựng bộ trình bày không quá 12 trang, ngày 4 viết 20 câu hỏi khó, ngày 5 chạy một phiên phản biện, ngày 6 vá phần yếu và làm phụ lục, ngày 7 lập danh sách những người bạn muốn gặp cùng lý do vì sao họ phù hợp với giai đoạn và ngành của bạn.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao không nên coi các con số về định giá hay quy mô vòng vốn nghe được từ nơi khác như một chuẩn để áp cho mình?',
        a: 'Vì mỗi giao dịch là kết quả của một cuộc đàm phán trong bối cảnh riêng: giai đoạn phát triển, ngành, chất lượng bằng chứng đã có, số bên quan tâm cùng lúc, điều kiện thị trường tại thời điểm đó, và cả các điều khoản kèm theo mà bên ngoài không nhìn thấy. Hai doanh nghiệp có cùng doanh thu có thể nhận điều kiện rất khác nhau. Ngoài ra, những con số được nhắc tới công khai thường chỉ là phần nổi và bị chọn lọc, còn các điều khoản đi kèm — thứ quyết định giá trị thật của thoả thuận — thì hiếm khi được công bố. Việc đúng đắn là hiểu logic đằng sau cách hai bên định giá, chuẩn bị lập luận cho trường hợp của mình, và để luật sư cùng người tư vấn tài chính có kinh nghiệm đánh giá đề nghị cụ thể mà bạn nhận được.',
      },
      {
        q: 'Vì sao trình bày điểm yếu một cách chủ động lại làm tăng chứ không giảm khả năng thành công?',
        a: 'Vì người có kinh nghiệm đầu tư sẽ tìm ra những điểm yếu đó trong quá trình thẩm định, và cách bạn xử lý thông tin xấu là một trong những thứ họ đang đánh giá. Chủ động nêu ra kèm hướng xử lý cho thấy bạn hiểu doanh nghiệp của mình và trung thực về nó, hai phẩm chất quan trọng vì họ sẽ phải làm việc cùng bạn trong nhiều năm. Ngược lại, một điểm yếu bị phát hiện sau khi bạn đã trình bày mọi thứ đều màu hồng sẽ khiến toàn bộ các con số khác của bạn bị nghi ngờ, kể cả những con số hoàn toàn đúng. Cách trình bày hiệu quả là ngắn gọn, đúng bản chất, kèm điều bạn đang làm để xử lý và cách bạn sẽ biết nó có hiệu quả.',
      },
      {
        q: 'Vì sao thời điểm bắt đầu gọi vốn lại quan trọng ngang với chất lượng hồ sơ?',
        a: 'Vì vị thế đàm phán phụ thuộc gần như hoàn toàn vào việc bạn có sẵn sàng bước đi hay không, mà điều đó lại phụ thuộc vào số tháng tiền mặt còn lại. Người còn nhiều tháng hoạt động có thể từ chối một đề nghị có điều khoản bất lợi; người chỉ còn vài tuần thì không. Quá trình gọi vốn cũng thường kéo dài hơn dự tính vì bao gồm nhiều vòng gặp, thẩm định và thủ tục pháp lý. Nguyên tắc thực dụng là bắt đầu khi bạn vẫn còn đủ nguồn lực để tiếp tục vận hành bình thường trong suốt quá trình đó và thêm một khoảng dự phòng, đồng thời luôn có một phương án không gọi được vốn thì làm gì. Con số cụ thể tuỳ ngành và tuỳ mô hình, nhưng nguyên tắc thì không đổi: đừng để việc gọi vốn trở thành lựa chọn duy nhất.',
      },
    ],
    plan7:
      'Ngày 1: viết một trang lý do cần vốn, số tiền và cột mốc. Ngày 2: tập hợp toàn bộ số liệu và kiểm tra mỗi con số có truy ngược được về nguồn không. Ngày 3: dựng bộ trình bày theo trình tự vấn đề, bằng chứng, con đường. Ngày 4: viết 20 câu hỏi khó nhất và tự trả lời bằng văn bản. Ngày 5: chạy một phiên phản biện với người trong ngành và ghi lại chỗ hổng. Ngày 6: bổ sung phụ lục số liệu và viết lại phần trình bày điểm yếu. Ngày 7: lập danh sách người cần gặp kèm lý do phù hợp, và xác định trước ngưỡng điều khoản nào bạn sẽ không chấp nhận.',
    evidence:
      'Bằng chứng ở đây gồm bộ trình bày, tài liệu phụ lục số liệu có thể truy ngược, và danh sách câu hỏi phản biện kèm câu trả lời bạn đã chuẩn bị bằng dữ liệu. Nếu bạn đã gọi vốn thành công thì kết quả tự nói; nếu chưa, thứ vẫn dùng được là quá trình: bao nhiêu cuộc gặp, phản hồi lặp lại là gì, bạn đã sửa gì trong mô hình nhờ những phản hồi đó. Trong phỏng vấn cho vị trí cần thuyết phục và đàm phán, kể lại một lần bạn từ chối một đề nghị vì điều khoản, hoặc một lần bạn thay đổi kế hoạch nhờ một câu hỏi phản biện, cho thấy bạn quyết định bằng lập luận. Trong CV nên nói về năng lực chuẩn bị và kết quả có thể công bố, tránh tiết lộ các điều khoản thuộc diện bảo mật của thoả thuận.',
    references: [
      { label: 'Y Combinator Startup Library — tài liệu về gọi vốn giai đoạn đầu', url: 'https://www.ycombinator.com/library', type: 'article' },
      { label: 'Paul Graham — tuyển tập tiểu luận, gồm các bài về gọi vốn', url: 'https://paulgraham.com/articles.html', type: 'article' },
    ],
  }),
  // ─────────────────────────────────────────────────────────────────────────
  // Chương 13 — Quản lý đối tác
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Đối tác là những bên bạn không quản lý được bằng mệnh lệnh nhưng kết quả của bạn lại phụ thuộc vào họ: nhà cung cấp, đơn vị gia công, nhà phân phối, đơn vị vận chuyển, bên bán hàng hộ. Vì không có quyền chỉ đạo, công cụ duy nhất của bạn là thiết kế quan hệ: chọn đúng bên, viết rõ cam kết hai chiều, đo bằng chỉ số cả hai cùng nhìn, và có sẵn phương án hai. Nguyên tắc bao trùm là quan hệ đối tác bền không đến từ thiện chí mà đến từ việc cả hai bên đều có lợi khi làm đúng và đều chịu hậu quả tương xứng khi làm sai.',
    why: {
      work: 'Phần lớn công việc trong tổ chức lớn cũng diễn ra qua ranh giới phòng ban, nơi bạn không có quyền chỉ đạo. Cùng bộ kỹ năng áp dụng: làm rõ cam kết, đo bằng chỉ số chung, và có cơ chế nói chuyện khi lệch cam kết.',
      interview:
        'Với vị trí mua hàng, vận hành, quản lý dự án hoặc phát triển đối tác, câu hỏi thường gặp là bạn xử lý ra sao khi nhà cung cấp giao chậm nhiều lần. Câu trả lời tốt phải có bằng chứng đã ghi nhận, cuộc trò chuyện đã diễn ra, và phương án dự phòng đã chuẩn bị từ trước.',
      study:
        'Học về chuỗi cung ứng và quản trị nhà cung cấp qua một quan hệ thật của chính bạn hiệu quả hơn nhiều so với đọc mô hình, vì nó buộc bạn đối diện với những đánh đổi thật giữa giá, chất lượng và độ tin cậy.',
      life: 'Thuê thợ sửa nhà, chọn trường cho con, làm việc với người môi giới đều là quan hệ đối tác. Thói quen làm rõ phạm vi, mốc thời gian và cách xử lý khi sai giúp tránh phần lớn những vụ việc khó chịu về sau.',
    },
    framework: [
      {
        name: 'Phân loại đối tác theo mức phụ thuộc',
        detail: 'Chia thành ba nhóm: nhóm thay thế được trong một tuần, nhóm thay thế được trong vài tháng, và nhóm gần như không thay thế được. Mức đầu tư vào quan hệ, mức độ chặt chẽ của hợp đồng và nỗ lực tìm phương án hai phải tỷ lệ thuận với mức phụ thuộc. Sai lầm phổ biến là đối xử với mọi đối tác như nhau, tốn công cho nhóm dễ thay và lơ là nhóm sống còn.',
      },
      {
        name: 'Chọn bằng thử nghiệm nhỏ trước khi cam kết lớn',
        detail: 'Trước khi ký hợp đồng dài hạn hoặc đặt đơn lớn, chạy một đơn hàng nhỏ thật với đầy đủ các bước, gồm cả một tình huống khó cố ý như đổi yêu cầu giữa chừng hoặc một khiếu nại. Cách một bên xử lý sự cố cho biết nhiều hơn về họ so với báo giá và hồ sơ năng lực.',
      },
      {
        name: 'Viết cam kết hai chiều bằng đại lượng đo được',
        detail: 'Không chỉ ghi những gì đối tác phải làm mà ghi cả những gì bạn cam kết: thời hạn cung cấp thông tin, thời gian phản hồi duyệt mẫu, lịch thanh toán, khối lượng dự báo. Rất nhiều lỗi giao hàng chậm có nguyên nhân thực sự nằm ở phía đặt hàng. Mọi điều khoản có hiệu lực ràng buộc nên được người có chuyên môn pháp lý rà trước khi ký.',
      },
      {
        name: 'Đo bằng bảng chỉ số chung và rà theo nhịp',
        detail: 'Thống nhất ba tới năm chỉ số mà cả hai bên cùng nhìn cùng một số liệu: tỷ lệ giao đúng hạn, tỷ lệ đạt chất lượng lần đầu, thời gian phản hồi, số lần phải làm lại. Rà định kỳ hằng tháng hoặc hằng quý với biên bản, và tách rõ ba loại nguyên nhân: do đối tác, do bạn, do yếu tố bên ngoài.',
      },
      {
        name: 'Luôn có phương án hai đang sống',
        detail: 'Với mọi đối tác thuộc nhóm phụ thuộc cao, phải có ít nhất một bên thay thế đã được thử thật ở quy mô nhỏ, không phải chỉ nằm trong danh sách. Duy trì một tỷ lệ nhỏ đơn hàng qua bên thứ hai là chi phí bảo hiểm hợp lý: nó giữ cho phương án hai luôn sẵn sàng và giữ cho cuộc đàm phán với bên thứ nhất luôn có cơ sở.',
      },
    ],
    scenario:
      'Một thương hiệu mỹ phẩm nội địa quy mô nhỏ đặt gia công toàn bộ sản phẩm tại một xưởng duy nhất và phân phối qua bốn đại lý vùng. Trong một mùa cao điểm, xưởng gia công giao chậm ba tuần khiến hai đại lý hết hàng đúng dịp bán tốt nhất, và một đại lý bắt đầu nhập một thương hiệu cạnh tranh để lấp chỗ trống. Chủ thương hiệu ngồi rà lại thay vì chỉ trách xưởng. Khi dựng bảng số liệu chung với xưởng, hai bên phát hiện trong sáu lần chậm của mười tám tháng thì bốn lần nguyên nhân nằm ở phía thương hiệu: duyệt mẫu bao bì trung bình mất chín ngày trong khi cam kết là ba ngày, và dự báo sản lượng gửi cho xưởng thường thay đổi sát ngày. Họ viết lại thoả thuận theo hai chiều: xưởng cam kết thời gian sản xuất và tỷ lệ đạt chất lượng lần đầu, thương hiệu cam kết thời gian duyệt mẫu và gửi dự báo cuốn chiếu ba tháng cập nhật hằng tháng. Đồng thời, thương hiệu tìm một xưởng thứ hai và chuyển khoảng mười lăm phần trăm sản lượng của hai dòng sản phẩm đơn giản sang đó, chấp nhận giá cao hơn một chút. Với các đại lý, họ thay chính sách chiết khấu thuần tuý theo doanh số bằng một cơ chế có thêm điều kiện về trưng bày và báo cáo tồn kho, đồng thời cam kết ngược lại về thời gian giao và chính sách đổi trả. Sau hai mùa, tỷ lệ giao đúng hạn cải thiện rõ, và quan trọng hơn là khi xưởng thứ nhất gặp sự cố thiết bị vào năm sau, thương hiệu chuyển được một phần đơn hàng trong vòng mười ngày thay vì phải dừng bán.',
    comparison: [
      { weak: 'Chọn nhà cung cấp bằng cách so ba bảng báo giá và lấy bên rẻ nhất.', mature: 'Chạy một đơn thử thật có kèm một tình huống khó, và chấm cả cách họ xử lý sự cố bên cạnh giá.' },
      { weak: 'Chỉ ghi nghĩa vụ của đối tác trong thoả thuận và coi phần của mình là chuyện nội bộ.', mature: 'Viết cam kết hai chiều có đại lượng đo được, vì phần lớn sự cố giao hàng có nguyên nhân góp phần từ phía đặt hàng.' },
      { weak: 'Chỉ liên lạc với đối tác khi có vấn đề, thời gian còn lại im lặng.', mature: 'Duy trì nhịp rà định kỳ với bảng chỉ số chung, để những lệch nhỏ được nói khi còn nhỏ thay vì tích tụ thành khủng hoảng.' },
    ],
    mistakes: [
      'Dồn toàn bộ sản lượng cho một nhà cung cấp để có giá tốt nhất, biến một sự cố bình thường của họ thành sự cố sống còn của mình, và đồng thời mất luôn cơ sở đàm phán ở các kỳ ký lại.',
      'Chỉ trách đối tác khi có sự cố mà không rà phần đóng góp của chính mình, khiến nguyên nhân thật không bao giờ được xử lý và cùng sự cố lặp lại theo chu kỳ.',
      'Xây quan hệ dựa trên tình cảm cá nhân với một người ở phía đối tác mà không có văn bản và không có chỉ số, nên khi người đó chuyển việc thì toàn bộ quan hệ trở về vạch xuất phát.',
    ],
    worksheet: [
      'Liệt kê mọi đối tác của bạn và xếp vào ba nhóm theo thời gian cần để thay thế họ. Nhóm gần như không thay thế được có bao nhiêu bên?',
      'Với đối tác quan trọng nhất, bạn đã cam kết những gì với họ bằng đại lượng đo được? Bạn có đang thực hiện đúng không?',
      'Trong sáu sự cố gần nhất với đối tác, bao nhiêu vụ có nguyên nhân góp phần từ phía bạn? Hãy tra lại bằng dữ liệu chứ không bằng trí nhớ.',
      'Ba tới năm chỉ số nào bạn và đối tác cùng nhìn trên cùng một nguồn số liệu? Nếu chưa có, chỉ số đầu tiên bạn sẽ thống nhất là gì?',
      'Với đối tác thuộc nhóm phụ thuộc cao nhất, phương án hai của bạn đã từng chạy thật ở quy mô nhỏ chưa, hay mới chỉ nằm trong danh sách?',
    ],
    exercises: [
      { label: 'Bản đồ phụ thuộc', text: 'Vẽ sơ đồ mọi đối tác kèm tỷ trọng khối lượng hoặc doanh thu đi qua từng bên và thời gian ước tính để thay thế. Khoanh đỏ những bên vừa chiếm tỷ trọng lớn vừa khó thay.', level: 'e' },
      { label: 'Thu thập cam kết hiện có', text: 'Tập hợp mọi thoả thuận với đối tác và trích ra thành một bảng gồm cam kết của họ và cam kết của bạn. Đánh dấu những ô trống ở cột cam kết của bạn.', level: 'e' },
      { label: 'Bảng chỉ số chung nháp', text: 'Soạn ba chỉ số bạn muốn theo dõi cùng một đối tác, kèm định nghĩa chính xác cách tính và nguồn số liệu. Gửi cho họ và ghi lại chỗ họ đề nghị sửa cách tính.', level: 'e' },
      { label: 'Đơn thử có tình huống khó', text: 'Với một đối tác tiềm năng, chạy một đơn nhỏ trong đó bạn cố ý đưa vào một thay đổi yêu cầu giữa chừng. Chấm điểm cách họ phản hồi, thời gian xử lý và cách họ thông báo.', level: 'm' },
      { label: 'Buổi rà hai chiều', text: 'Tổ chức một buổi rà với đối tác quan trọng nhất trong đó nửa thời lượng dành cho việc bạn hỏi họ về những gì phía bạn đang gây khó cho họ. Ghi lại và xử lý ít nhất một điểm trong hai tuần.', level: 'm' },
      { label: 'Kích hoạt phương án hai', text: 'Chuyển một tỷ lệ nhỏ khối lượng sang một đối tác thứ hai trong một quý, dù giá có thể cao hơn. Đo chi phí tăng thêm và ghi lại thời gian cần để họ đạt mức chất lượng tương đương.', level: 'm' },
      { label: 'Thiết kế lại cơ chế khuyến khích', text: 'Với một kênh phân phối hoặc một đối tác bán hàng, thiết kế lại cơ chế thưởng sao cho nó khuyến khích những hành vi bạn thực sự cần chứ không chỉ khuyến khích doanh số ngắn hạn. Chạy thử một quý và đo cả chỉ số doanh số lẫn chỉ số hành vi.', level: 'h' },
      { label: 'Thử thách 7 ngày: rà toàn bộ mạng lưới đối tác', text: 'Bảy ngày: ngày 1 lập bản đồ phụ thuộc, ngày 2 thu thập cam kết hai chiều hiện có, ngày 3 tra lại sáu sự cố gần nhất và phân loại nguyên nhân, ngày 4 soạn bảng chỉ số chung, ngày 5 gặp hoặc gọi cho đối tác quan trọng nhất để thống nhất chỉ số, ngày 6 kiểm tra tình trạng thật của phương án hai, ngày 7 viết kế hoạch giảm rủi ro phụ thuộc cho quý tới.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao mức độ đầu tư vào một quan hệ đối tác nên tỷ lệ với mức phụ thuộc chứ không với quy mô chi tiêu?',
        a: 'Vì thứ có thể gây thiệt hại lớn nhất không phải khoản tiền bạn trả mà là khoảng thời gian bạn không hoạt động được nếu bên đó dừng. Một nhà cung cấp chiếm tỷ trọng chi tiêu nhỏ nhưng độc quyền một chi tiết không thay thế được có thể làm dừng toàn bộ dây chuyền, trong khi một nhà cung cấp chiếm tỷ trọng lớn nhưng có mười bên thay thế trong một tuần thì rủi ro thấp. Cách xử lý là xếp hạng theo thời gian thay thế và hậu quả khi gián đoạn, rồi dồn nỗ lực về hợp đồng, quan hệ và phương án dự phòng cho nhóm nguy hiểm nhất.',
      },
      {
        q: 'Khi đối tác liên tục không đạt cam kết, cần làm gì trước khi kết luận về họ?',
        a: 'Cần tra dữ liệu để tách ba loại nguyên nhân: do họ, do mình, do yếu tố bên ngoài. Rất thường xuyên, một phần đáng kể các lần chậm trễ có nguyên nhân góp phần từ phía đặt hàng như duyệt mẫu chậm, đổi yêu cầu sát ngày, dự báo không ổn định hoặc thanh toán trễ làm ảnh hưởng dòng tiền của họ. Nếu bỏ qua bước này, bạn có thể đổi đối tác và gặp lại đúng vấn đề cũ với bên mới. Sau khi đã tách nguyên nhân, cuộc trò chuyện nên dựa trên số liệu chung và tập trung vào cơ chế phòng ngừa cho lần sau, đồng thời xem lại điều khoản đã thoả thuận với sự tham gia của người có chuyên môn nếu cần điều chỉnh ràng buộc.',
      },
      {
        q: 'Vì sao duy trì một phương án hai đang hoạt động lại đáng chi phí, ngay cả khi đối tác chính đang làm tốt?',
        a: 'Vì có ba lợi ích cùng lúc và chỉ một trong ba liên quan tới sự cố. Thứ nhất, phương án hai đã chạy thật thì mới rút ngắn được thời gian chuyển đổi khi có gián đoạn; một cái tên trong danh sách chưa từng làm việc với bạn thường cần nhiều tháng để đạt mức chất lượng cần thiết. Thứ hai, nó cho bạn một điểm so sánh thật về giá, chất lượng và cách phục vụ, thứ mà báo giá không cho được. Thứ ba, nó thay đổi thế đàm phán ở mỗi kỳ ký lại, không phải bằng cách đe doạ mà đơn giản vì cả hai bên đều biết bạn có lựa chọn. Chi phí là phần chênh giá trên một tỷ lệ nhỏ khối lượng, thường nhỏ hơn nhiều so với thiệt hại của một lần gián đoạn trong mùa cao điểm.',
      },
    ],
    plan7:
      'Ngày 1: lập bản đồ phụ thuộc cho toàn bộ đối tác kèm tỷ trọng và thời gian thay thế. Ngày 2: tập hợp mọi cam kết hiện có thành bảng hai chiều. Ngày 3: tra lại sáu sự cố gần nhất bằng dữ liệu và phân loại nguyên nhân. Ngày 4: soạn ba chỉ số chung kèm định nghĩa cách tính. Ngày 5: trao đổi với đối tác quan trọng nhất về bảng chỉ số và nghe phần họ góp ý. Ngày 6: kiểm tra phương án hai đã thực sự chạy chưa và lên kế hoạch chạy thử. Ngày 7: viết kế hoạch quý cho việc giảm rủi ro phụ thuộc và bổ sung cam kết từ phía bạn.',
    evidence:
      'Bằng chứng dùng được gồm bản đồ phụ thuộc, bảng cam kết hai chiều, bộ chỉ số chung với đối tác và biên bản các buổi rà định kỳ, cùng một kết quả đo được như tỷ lệ giao đúng hạn trước và sau. Câu chuyện mạnh nhất là lần bạn tra dữ liệu và phát hiện phần lỗi nằm ở chính mình rồi sửa nó — nó cho thấy bạn quản lý đối tác bằng hệ thống chứ không bằng cách gây áp lực. Trong phỏng vấn vị trí mua hàng hoặc vận hành, hãy kể cả cách bạn xây phương án hai và chi phí bạn chấp nhận trả cho nó. Trong CV: xây bộ chỉ số chung và cơ chế cam kết hai chiều với xưởng gia công, đưa một phần sản lượng sang nhà cung cấp thứ hai và rút ngắn thời gian chuyển đổi khi có sự cố xuống khoảng 10 ngày.',
    references: [
      { label: 'Harvard Business Review — chủ đề quản trị chuỗi cung ứng và đối tác', url: 'https://hbr.org/topic/subject/supply-chain-management', type: 'article', needsReview: true },
      { label: 'Atlassian Team Playbook — công cụ làm rõ cam kết và phối hợp giữa các bên', url: 'https://www.atlassian.com/team-playbook', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 14 — Mở rộng doanh nghiệp (Scaling)
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Mở rộng khác với lớn lên. Lớn lên là làm nhiều hơn bằng cách thêm nguồn lực tương ứng; mở rộng là làm nhiều hơn mà chi phí và độ phức tạp không tăng theo cùng tỷ lệ. Điều kiện tiên quyết không phải nhiều tiền mà là một thứ đã lặp lại được: một cách bán ổn định, một quy trình phục vụ ra kết quả đều, và một đơn vị kinh tế dương. Mở rộng khi chưa có ba thứ đó chỉ nhân bản vấn đề, và nó nhân bản chúng nhanh hơn nhiều so với tốc độ bạn sửa. Câu hỏi phải trả lời trước mọi kế hoạch mở rộng là: điều gì hiện đang chỉ chạy được nhờ có mặt tôi.',
    why: {
      work: 'Nhân rộng một cách làm hiệu quả từ một nhóm ra toàn bộ tổ chức là dạng dự án được đánh giá cao ở cấp quản lý. Nó đòi hỏi đúng kỹ năng ở đây: tìm ra điều gì thực sự tạo ra kết quả, tách nó khỏi con người cụ thể, rồi kiểm chứng ở nơi khác.',
      interview:
        'Câu hỏi bạn từng nhân rộng thứ gì và gặp trở ngại gì phân biệt rất rõ người đã làm với người mới đọc. Người đã làm luôn kể được về chỗ mô hình gãy khi rời khỏi bối cảnh gốc.',
      study:
        'Khái niệm mở rộng giúp bạn đọc các câu chuyện doanh nghiệp một cách hoài nghi lành mạnh: phần lớn bài viết kể về giai đoạn tăng trưởng mà bỏ qua giai đoạn chuẩn bị dài phía trước, tạo ấn tượng sai về nhân quả.',
      life: 'Khi bạn muốn làm nhiều hơn trong cuộc sống — nhận thêm học trò, nhận thêm khách hàng tự do — bạn đối mặt cùng bài toán: cái gì có thể tăng mà không tăng tương ứng giờ của bạn, và cái gì thì không.',
    },
    framework: [
      {
        name: 'Kiểm ba điều kiện trước khi mở rộng',
        detail: 'Một, cách có được khách đã lặp lại được và đo được, không phụ thuộc vào một chiến dịch may mắn hay vào quan hệ cá nhân của người sáng lập. Hai, quy trình phục vụ đã viết ra và người mới làm theo được với chất lượng chấp nhận được. Ba, đơn vị kinh tế dương sau khi tính đủ chi phí, gồm cả lương thị trường cho công việc bạn đang tự làm. Thiếu bất kỳ điều nào thì việc cần làm là sửa nó chứ không phải mở thêm.',
      },
      {
        name: 'Tìm nút thắt thật thay vì mở rộng đều',
        detail: 'Trong bất kỳ hệ thống nào cũng có một điểm giới hạn toàn bộ năng lực. Đổ nguồn lực vào chỗ không phải nút thắt không làm tăng sản lượng mà chỉ tăng hàng chờ. Cách tìm: đi dọc luồng công việc và xem việc bị xếp hàng ở đâu, ai là người mà mọi thứ phải chờ, công đoạn nào luôn chạy hết công suất.',
      },
      {
        name: 'Tách con người khỏi kết quả',
        detail: 'Với mỗi việc chỉ chạy được nhờ một người cụ thể, hỏi: phần nào là kiến thức viết ra được, phần nào là quyết định có thể chuyển thành nguyên tắc và ngưỡng, phần nào thật sự cần phán đoán của người có kinh nghiệm. Chuyển hai phần đầu thành tài liệu và quy tắc, đào tạo cho phần thứ ba. Đây là công việc chậm và không có cách đi tắt.',
      },
      {
        name: 'Mở rộng bằng một bản sao kiểm chứng trước',
        detail: 'Trước khi mở năm điểm, mở một điểm ở bối cảnh khác với điểm gốc và coi nó như một phép kiểm: điều gì chạy nguyên vẹn, điều gì phải sửa, chi phí thật là bao nhiêu, mất bao lâu để đạt điểm hoà vốn. Bản sao đầu tiên luôn đắt hơn và chậm hơn dự tính, và đó chính là thông tin bạn cần trước khi cam kết nguồn lực lớn.',
      },
      {
        name: 'Xây lại hệ thống đo và nhịp trước khi tăng quy mô',
        detail: 'Cách quản lý bằng quan sát trực tiếp sẽ hỏng ngay khi bạn không còn nhìn thấy mọi thứ. Trước khi tăng quy mô, phải có bộ chỉ số theo từng đơn vị, nhịp báo cáo cố định, và ngưỡng cảnh báo tự động cho những sai lệch quan trọng. Nếu bạn chỉ phát hiện vấn đề khi đi thăm, bạn chưa sẵn sàng cho đơn vị thứ ba.',
      },
    ],
    scenario:
      'Một công ty dịch vụ vệ sinh công nghiệp hoạt động tốt tại một tỉnh với ba mươi nhân sự và các hợp đồng dài hạn với văn phòng, nhà xưởng. Chủ công ty muốn mở sang hai tỉnh lân cận cùng lúc. Trước khi làm, anh kiểm ba điều kiện và phát hiện hai vấn đề. Thứ nhất, gần như toàn bộ hợp đồng lớn đến từ quan hệ cá nhân của anh, tức là cách có được khách chưa lặp lại được bởi người khác. Thứ hai, chất lượng ca làm phụ thuộc nặng vào ba tổ trưởng lâu năm, và không có tài liệu nào mô tả cách họ phân công cũng như cách họ xử lý các tình huống phát sinh tại hiện trường. Anh hoãn kế hoạch mở hai tỉnh và dành sáu tháng cho ba việc: xây một quy trình bán không phụ thuộc anh gồm danh sách khách mục tiêu, kịch bản tiếp cận, bộ hồ sơ năng lực và một người bán được đào tạo, với mục tiêu là người đó tự ký được hợp đồng; viết bộ tài liệu vận hành ca dựa trên quan sát ba tổ trưởng, gồm cả phần xử lý ngoại lệ; và dựng bộ chỉ số theo từng hợp đồng gồm giờ công thực tế so với định mức, số lần khách phàn nàn, tỷ lệ nhân sự nghỉ việc. Sau đó anh mở đúng một tỉnh làm phép kiểm. Điểm mới đạt điểm hoà vốn chậm hơn dự kiến vài tháng, và nguyên nhân lộ ra là chi phí tuyển và giữ nhân sự tại địa bàn mới cao hơn hẳn — một biến số anh đã đánh giá thấp. Nhờ chỉ mở một điểm, anh sửa được mô hình chi phí nhân sự trước khi mở tỉnh thứ ba, thay vì phát hiện điều đó ở hai nơi cùng lúc.',
    comparison: [
      { weak: 'Coi tăng doanh thu là bằng chứng đã sẵn sàng mở rộng.', mature: 'Kiểm ba điều kiện độc lập: cách bán lặp lại được, quy trình phục vụ chuyển giao được, và đơn vị kinh tế dương sau khi tính đủ chi phí.' },
      { weak: 'Mở nhiều điểm cùng lúc để tận dụng đà và tiết kiệm thời gian.', mature: 'Mở một bản sao đầu tiên như một phép kiểm có ngưỡng và thời hạn, học từ nó rồi mới cam kết nguồn lực lớn.' },
      { weak: 'Giữ nguyên cách quản lý bằng quan sát trực tiếp và tăng số lần đi thăm khi quy mô tăng.', mature: 'Xây bộ chỉ số theo từng đơn vị cùng nhịp báo cáo và ngưỡng cảnh báo, để vấn đề nổi lên trước khi bạn kịp tới nơi.' },
    ],
    mistakes: [
      'Nhân bản một mô hình mà lợi nhuận thực ra đến từ việc người sáng lập tự làm phần đắt nhất không tính lương, nên bản sao có đủ chi phí thật thì lỗ ngay từ đầu.',
      'Tuyển ồ ạt trước khi có quy trình đào tạo và tài liệu, khiến người mới học lẫn nhau theo những cách sai và chất lượng giảm đồng loạt ở mọi đơn vị.',
      'Bỏ qua sự khác biệt của bối cảnh mới — chi phí nhân sự, thói quen khách hàng, mật độ khách, quy định địa phương — và áp nguyên bảng tính của điểm gốc cho địa bàn mới.',
    ],
    worksheet: [
      'Kênh mang về khách hiện nay có lặp lại được không? Nếu bạn không tham gia, tháng vừa rồi có bao nhiêu khách mới đến từ kênh đó?',
      'Liệt kê những việc hiện chỉ chạy được nhờ một người cụ thể. Với mỗi việc, phần nào viết ra được thành tài liệu và phần nào cần phán đoán thật sự?',
      'Trong luồng công việc của bạn, việc bị xếp hàng chờ ở công đoạn nào? Ai là người mà mọi thứ phải chờ?',
      'Nếu tính đủ lương thị trường cho công việc bạn đang tự làm, đơn vị kinh tế của bạn còn dương không? Viết lại con số.',
      'Với bản sao đầu tiên bạn định mở, ngưỡng nào cho biết nó thành công và trong bao nhiêu tháng? Nếu không đạt, bạn sẽ làm gì?',
    ],
    exercises: [
      { label: 'Kiểm ba điều kiện', text: 'Chấm điểm doanh nghiệp bạn trên ba điều kiện tiên quyết theo thang từ 1 tới 5 kèm bằng chứng cho từng điểm. Điều kiện thấp nhất chính là việc cần làm trước khi nghĩ tới mở rộng.', level: 'e' },
      { label: 'Danh sách phụ thuộc cá nhân', text: 'Liệt kê mọi việc mà nếu một người cụ thể nghỉ một tháng thì sẽ dừng hoặc giảm chất lượng rõ rệt. Sắp xếp theo mức thiệt hại và chọn hai việc để bắt đầu tách.', level: 'e' },
      { label: 'Đi dọc luồng công việc', text: 'Theo dõi một đơn hàng hoặc một hợp đồng từ đầu tới cuối và ghi lại thời gian chờ ở từng công đoạn. Xác định công đoạn có hàng chờ dài nhất và ghi nguyên nhân.', level: 'e' },
      { label: 'Bảng tính bản sao', text: 'Dựng bảng tính chi phí và doanh thu cho một đơn vị mới với các giả định riêng của địa bàn đó, không sao chép giả định của đơn vị gốc. Xác định tháng hoà vốn dự kiến và các giả định nhạy nhất.', level: 'm' },
      { label: 'Chuyển một việc thành tài liệu và ngưỡng', text: 'Chọn một việc đang phụ thuộc vào bạn, viết phần kiến thức thành tài liệu, chuyển phần quyết định lặp lại thành ngưỡng tự quyết, rồi giao cho người khác trong bốn tuần và đo số lần họ phải hỏi bạn.', level: 'm' },
      { label: 'Bộ chỉ số theo đơn vị', text: 'Thiết kế bộ năm chỉ số theo dõi riêng cho từng đơn vị hoặc từng hợp đồng, cùng nhịp báo cáo và ngưỡng cảnh báo. Chạy thử với đơn vị hiện có trong một tháng và kiểm xem chỉ số có phát hiện được vấn đề bạn đã biết không.', level: 'm' },
      { label: 'Mở bản sao đầu tiên như một phép kiểm', text: 'Viết đề cương cho đơn vị mới như một phép kiểm hoàn chỉnh: giả định, ngưỡng thành công, thời hạn, ngân sách tối đa, và các dấu hiệu buộc dừng. Sau khi chạy, viết một trang so sánh giả định với thực tế và liệt kê những điều phải sửa trước đơn vị tiếp theo.', level: 'h' },
      { label: 'Thử thách 7 ngày: chuẩn bị nền cho mở rộng', text: 'Bảy ngày: ngày 1 chấm ba điều kiện tiên quyết, ngày 2 lập danh sách phụ thuộc cá nhân, ngày 3 đi dọc luồng công việc và tìm nút thắt, ngày 4 tính lại đơn vị kinh tế có lương thị trường cho chính bạn, ngày 5 thiết kế bộ chỉ số theo đơn vị, ngày 6 dựng bảng tính cho bản sao đầu tiên với giả định riêng, ngày 7 viết kết luận trung thực về việc bạn đã sẵn sàng mở rộng chưa và nếu chưa thì việc cần làm trước là gì.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao doanh thu tăng không đủ để kết luận doanh nghiệp đã sẵn sàng mở rộng?',
        a: 'Vì doanh thu có thể tăng nhờ những thứ không nhân bản được: quan hệ cá nhân của người sáng lập, một cơ hội thị trường ngắn hạn, hoặc việc chính người chủ đang gánh phần việc đắt nhất mà không tính lương. Khi mở đơn vị thứ hai, những yếu tố đó không đi cùng, và bản sao phải đứng bằng chính chi phí đầy đủ của nó. Ba điều kiện cần kiểm là cách có được khách lặp lại được bởi người khác, quy trình phục vụ chuyển giao được, và đơn vị kinh tế dương sau khi tính đủ mọi chi phí. Doanh thu tăng chỉ là một dấu hiệu, không phải một trong ba điều kiện.',
      },
      {
        q: 'Vì sao đổ thêm nguồn lực vào chỗ không phải nút thắt lại không làm tăng sản lượng?',
        a: 'Vì năng lực của cả hệ thống bị giới hạn bởi công đoạn chậm nhất. Tăng năng lực ở công đoạn trước nút thắt chỉ tạo ra hàng chờ lớn hơn trước nút thắt đó, tốn thêm vốn nằm trong hàng chờ và thêm chi phí quản lý; tăng năng lực ở công đoạn sau nút thắt thì phần tăng thêm nằm không. Việc cần làm là xác định nút thắt bằng cách quan sát nơi công việc bị xếp hàng, rồi hoặc tăng năng lực đúng chỗ đó, hoặc giảm tải cho nó, hoặc thay đổi luồng để nó không còn là nút thắt. Sau khi xử lý xong, nút thắt sẽ dịch sang chỗ khác và bài toán lặp lại — đây là công việc liên tục chứ không phải một lần.',
      },
      {
        q: 'Vì sao nên mở một bản sao đầu tiên như một phép kiểm thay vì mở nhiều đơn vị cùng lúc?',
        a: 'Vì bản sao đầu tiên luôn cho ra thông tin mà bảng tính không có: chi phí thật ở bối cảnh mới, thời gian thật để đạt hoà vốn, những phần của mô hình không di chuyển được, và các biến số địa phương bạn chưa nghĩ tới như chi phí tuyển dụng, thói quen khách hàng hay đặc thù mặt bằng. Nếu mở nhiều nơi cùng lúc, bạn phải trả giá cho cùng một bài học nhiều lần và không kịp sửa giữa chừng. Ngoài ra, mở một nơi giữ cho tổ chức đủ sức chú ý để hỗ trợ nó thành công, trong khi mở nhiều nơi cùng lúc chia mỏng sự chú ý của những người vốn đã bận. Cái giá phải trả là chậm hơn vài tháng, và đó thường là khoản đầu tư rẻ nhất trong toàn bộ kế hoạch.',
      },
    ],
    plan7:
      'Ngày 1: chấm ba điều kiện tiên quyết kèm bằng chứng. Ngày 2: lập danh sách những việc phụ thuộc vào một người cụ thể. Ngày 3: đi dọc luồng công việc và xác định nút thắt bằng thời gian chờ. Ngày 4: tính lại đơn vị kinh tế sau khi đưa lương thị trường cho phần việc bạn tự làm. Ngày 5: thiết kế bộ chỉ số theo từng đơn vị và ngưỡng cảnh báo. Ngày 6: dựng bảng tính cho bản sao đầu tiên với giả định riêng của địa bàn mới. Ngày 7: viết kết luận về mức sẵn sàng và ba việc phải hoàn thành trước khi mở.',
    evidence:
      'Bằng chứng ở đây gồm bản đánh giá ba điều kiện có số liệu, bộ tài liệu và ngưỡng bạn đã dùng để tách một phần việc khỏi một cá nhân, bộ chỉ số theo đơn vị, và quan trọng nhất là hồ sơ bản sao đầu tiên: giả định ban đầu, kết quả thật, và danh sách những gì phải sửa trước đơn vị tiếp theo. Trong phỏng vấn cho vị trí quản lý vùng hoặc giám đốc vận hành, câu chuyện có giá trị nhất thường là lần bạn hoãn kế hoạch mở rộng vì một điều kiện chưa đạt, kèm điều gì đã xảy ra nhờ việc hoãn đó. Trong CV: chuẩn bị nền cho mở rộng bằng cách chuyển kênh bán khỏi phụ thuộc người sáng lập và tài liệu hoá vận hành ca, sau đó mở một đơn vị mới như phép kiểm và điều chỉnh mô hình chi phí nhân sự trước khi nhân rộng.',
    references: [
      { label: 'First Round Review — kinh nghiệm vận hành và mở rộng doanh nghiệp', url: 'https://review.firstround.com', type: 'article' },
      { label: 'Harvard Business Review — chủ đề tăng trưởng doanh nghiệp', url: 'https://hbr.org/topic/subject/growth-strategy', type: 'article', needsReview: true },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 15 — Quản trị khủng hoảng doanh nghiệp
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Khủng hoảng là tình huống mà tốc độ ra quyết định quan trọng hơn độ hoàn hảo của quyết định, và trong đó im lặng luôn bị hiểu là có điều gì đó đang bị giấu. Công việc của người điều hành gồm bốn phần chạy song song: chặn thiệt hại tiếp diễn, nói sự thật với đúng người theo đúng thứ tự, xử lý nguyên nhân gốc, và giữ cho tổ chức không kiệt sức trong quá trình đó. Cần nói rõ giới hạn của chương này: các tình huống liên quan tới an toàn sức khoẻ người dùng, thu hồi sản phẩm, sự cố dữ liệu cá nhân, cắt giảm nhân sự, mất khả năng thanh toán hay tranh chấp pháp lý đều là những quy trình có quy định pháp luật riêng và có thời hạn thông báo bắt buộc; ngay khi nhận diện được loại sự cố, việc đầu tiên phải làm là liên hệ luật sư và các chuyên gia phù hợp, và mọi hướng dẫn ở đây chỉ là khung tư duy chung chứ không thay thế tư vấn chuyên môn.',
    why: {
      work: 'Sự cố xảy ra ở mọi tổ chức, và cách một người xử lý ba giờ đầu tiên thường quyết định uy tín nghề nghiệp của họ trong nhiều năm. Người biết leo thang đúng lúc và báo cáo trung thực được tin giao việc quan trọng.',
      interview:
        'Câu hỏi về sự cố tệ nhất bạn từng gặp là câu hỏi kinh điển ở mọi cấp. Nhà tuyển dụng nghe hai thứ: bạn có che giấu không, và bạn có rút ra được thay đổi hệ thống nào không hay chỉ nói mình đã cố gắng.',
      study:
        'Đọc lại các sự cố công khai đã được phân tích đầy đủ là cách học rất hiệu quả, với điều kiện đọc theo trình tự thời gian với đúng lượng thông tin người trong cuộc có tại từng thời điểm, thay vì phán xét bằng hiểu biết có sau.',
      life: 'Gia đình cũng gặp khủng hoảng: bệnh nặng, mất việc, tai nạn. Cùng nguyên tắc giúp ích: xác định việc phải làm ngay trong 24 giờ, nói thật với người liên quan, phân công rõ ai lo phần nào, và giữ sức cho chặng dài.',
    },
    framework: [
      {
        name: 'Xác định loại sự cố và ai phải có mặt trong ba giờ đầu',
        detail: 'Trước hết phân loại: sự cố an toàn hoặc sức khoẻ, sự cố dữ liệu, sự cố tài chính, sự cố nhân sự, sự cố danh tiếng, sự cố vận hành. Mỗi loại có một nhóm người bắt buộc phải tham gia và một số loại có nghĩa vụ thông báo theo quy định pháp luật với thời hạn cụ thể. Việc đầu tiên là gọi đúng người, gồm cả người tư vấn pháp lý, chứ không phải tự xoay xở để giữ chuyện trong nội bộ.',
      },
      {
        name: 'Chặn thiệt hại đang tiếp diễn trước khi tìm nguyên nhân',
        detail: 'Trong giai đoạn đầu, ưu tiên là ngăn tình hình xấu thêm: dừng bán lô hàng nghi vấn, tạm ngắt tính năng đang gây lỗi, khoá quyền truy cập bị lộ, tạm dừng khoản chi lớn. Việc tìm nguyên nhân gốc quan trọng nhưng đến sau, vì mỗi giờ chậm chặn là thêm người bị ảnh hưởng. Ghi lại mọi hành động kèm thời gian ngay khi làm.',
      },
      {
        name: 'Truyền thông theo thứ tự và nói sự thật đã kiểm chứng',
        detail: 'Thứ tự thường là: người bị ảnh hưởng trực tiếp, nhân viên, đối tác và cơ quan liên quan theo quy định, rồi mới tới công chúng nếu cần. Nội dung gồm bốn phần: điều gì đã xảy ra ở mức đã xác nhận, ảnh hưởng tới ai, chúng tôi đang làm gì, và khi nào có thông tin tiếp theo. Không suy đoán, không hứa điều chưa chắc, và nội dung phát ra bên ngoài nên được người tư vấn pháp lý xem trước.',
      },
      {
        name: 'Lập nhịp làm việc trong khủng hoảng',
        detail: 'Đặt một người chỉ huy duy nhất, một người phụ trách truyền thông, một người ghi chép dòng thời gian. Họp ngắn theo nhịp cố định, mỗi lần cập nhật ba việc: điều mới biết, việc đang làm, việc cần quyết. Đồng thời phải phân ca và ép người ta nghỉ, vì sai lầm nghiêm trọng thứ hai thường xảy ra vào ngày thứ ba khi mọi người đã kiệt sức.',
      },
      {
        name: 'Rà soát sau sự cố không đổ lỗi và sửa hệ thống',
        detail: 'Sau khi ổn định, viết bản rà soát gồm dòng thời gian, những gì đã biết tại từng thời điểm, các quyết định và lý do, thiệt hại thực tế, và những thay đổi hệ thống sẽ thực hiện kèm người chịu trách nhiệm và hạn. Tập trung vào cơ chế chứ không vào cá nhân, vì mục tiêu là để lần sau tổ chức phản ứng tốt hơn, và vì văn hoá đổ lỗi khiến lần sau người ta giấu sự cố lâu hơn.',
      },
    ],
    scenario:
      'Một xưởng sản xuất thực phẩm khô quy mô vừa nhận được phản ánh từ hai khách hàng trong cùng một ngày về việc một lô hàng có dấu hiệu bất thường về cảm quan. Chủ xưởng không chờ xác minh xong mới hành động. Trong buổi sáng, anh làm ba việc song song: yêu cầu dừng xuất toàn bộ lô có cùng mã sản xuất và các lô liền kề, liên hệ ngay với đơn vị tư vấn pháp lý và chuyên gia về an toàn thực phẩm để xác định các nghĩa vụ phải thực hiện theo quy định và trình tự bắt buộc, và cử một người duy nhất ghi lại dòng thời gian mọi việc kèm giờ. Anh gọi trực tiếp cho các đại lý đã nhận lô đó trước khi có bất kỳ thông báo công khai nào, nói đúng những gì đã xác nhận và những gì chưa biết, đồng thời cam kết một mốc thời gian cụ thể cho lần cập nhật tiếp theo. Nội dung thông báo gửi ra ngoài được người tư vấn pháp lý xem trước. Về nguyên nhân, kết quả kiểm tra sau đó cho thấy sự cố đến từ một khâu bảo quản nguyên liệu trong đợt thời tiết bất thường mà quy trình hiện tại không lường tới. Bản rà soát sau sự cố dài bốn trang, không nêu tên người để quy trách nhiệm cá nhân, và dẫn tới bốn thay đổi hệ thống có người phụ trách và hạn cụ thể, trong đó có việc bổ sung một điểm kiểm tra bắt buộc và một quy trình xử lý khi điều kiện bảo quản vượt ngưỡng. Chi phí của đợt này rất đáng kể, nhưng hai trong ba đại lý lớn nói rằng chính cách xử lý minh bạch là lý do họ tiếp tục hợp tác.',
    comparison: [
      { weak: 'Chờ tới khi nắm đủ thông tin rồi mới thông báo, để tránh nói sai.', mature: 'Thông báo sớm ở mức đã xác nhận, nói rõ điều gì chưa biết, và cam kết một mốc cập nhật tiếp theo rồi giữ đúng mốc đó.' },
      { weak: 'Để mọi người cùng tham gia xử lý theo cảm tính, không ai chỉ huy và không ai ghi chép.', mature: 'Chỉ định một người chỉ huy, một người truyền thông, một người ghi dòng thời gian, và họp ngắn theo nhịp cố định.' },
      { weak: 'Sau khi mọi việc lắng xuống thì tìm người chịu trách nhiệm và coi đó là đã xử lý xong.', mature: 'Viết bản rà soát tập trung vào cơ chế, chốt các thay đổi hệ thống có người phụ trách và hạn, rồi kiểm lại sau ba tháng xem thay đổi có thực sự tồn tại không.' },
    ],
    mistakes: [
      'Cố giữ sự cố trong nội bộ để tránh ảnh hưởng danh tiếng, trong khi có những loại sự cố có nghĩa vụ thông báo theo quy định pháp luật với thời hạn cụ thể — việc chậm trễ tạo ra rủi ro pháp lý lớn hơn nhiều so với thiệt hại danh tiếng ban đầu.',
      'Phát ngôn theo cảm xúc hoặc suy đoán nguyên nhân khi chưa xác minh, khiến khi thông tin thật xuất hiện thì tổ chức mất uy tín hai lần: một vì sự cố và một vì đã nói sai.',
      'Ép cả đội làm liên tục nhiều ngày không nghỉ, dẫn tới sai lầm nghiêm trọng thứ hai xảy ra do kiệt sức, thường vào giai đoạn tình hình đã bắt đầu ổn định.',
    ],
    worksheet: [
      'Liệt kê năm loại sự cố có thể xảy ra với doanh nghiệp bạn. Với mỗi loại, ai là người bắt buộc phải được gọi trong ba giờ đầu?',
      'Với loại sự cố nghiêm trọng nhất, bạn có biết mình có nghĩa vụ thông báo cho ai theo quy định không? Nếu không chắc, khi nào bạn sẽ hỏi người tư vấn pháp lý?',
      'Hành động chặn thiệt hại đầu tiên cho từng loại sự cố là gì, và ai có quyền ra lệnh thực hiện nó mà không cần chờ bạn?',
      'Bạn có sẵn danh sách liên lạc khẩn gồm luật sư, kế toán, bảo hiểm, khách hàng lớn và cơ quan liên quan không? Lần cập nhật gần nhất là khi nào?',
      'Trong sự cố gần nhất của bạn, có ai ghi lại dòng thời gian không? Nếu không, hôm nay bạn còn dựng lại được nó chính xác tới mức nào?',
    ],
    exercises: [
      { label: 'Danh mục rủi ro và người phải gọi', text: 'Lập bảng các loại sự cố có thể xảy ra, mức nghiêm trọng, hành động chặn đầu tiên và danh sách người phải liên lạc trong ba giờ đầu. Kiểm tra mọi số điện thoại trong danh sách có còn dùng được không.', level: 'e' },
      { label: 'Mẫu thông báo bốn phần', text: 'Soạn trước mẫu thông báo gồm điều đã xác nhận, ảnh hưởng tới ai, đang làm gì, khi nào cập nhật tiếp. Viết ba phiên bản cho ba đối tượng khác nhau: khách hàng, nhân viên, đối tác.', level: 'e' },
      { label: 'Dựng lại dòng thời gian một sự cố cũ', text: 'Chọn một sự cố đã qua và cố gắng dựng lại dòng thời gian chi tiết theo giờ từ các bằng chứng còn lại. Ghi lại những chỗ bạn không tái hiện được và rút ra điều cần ghi chép ngay từ đầu lần sau.', level: 'e' },
      { label: 'Diễn tập trên bàn', text: 'Tập hợp nhóm trong 90 phút và diễn tập một kịch bản sự cố cụ thể: ai làm gì trong giờ đầu, ai gọi cho ai, ai phát ngôn. Ghi lại mọi chỗ nhóm lúng túng và bổ sung vào quy trình.', level: 'm' },
      { label: 'Xác định nghĩa vụ thông báo', text: 'Đặt một buổi làm việc với người tư vấn pháp lý để xác định với từng loại sự cố của ngành bạn thì có nghĩa vụ thông báo gì, cho ai, trong thời hạn nào. Ghi thành một trang và để ở nơi dễ lấy.', level: 'm' },
      { label: 'Kế hoạch phân ca trong khủng hoảng', text: 'Viết trước cách phân ca và nghỉ luân phiên cho một sự cố kéo dài năm ngày, gồm cả người thay thế cho từng vai chủ chốt. Rà lại xem có vai nào chỉ một người đảm nhận được không.', level: 'm' },
      { label: 'Bản rà soát không đổ lỗi', text: 'Với một sự cố thật đã xảy ra, viết bản rà soát đầy đủ gồm dòng thời gian, thông tin có tại từng thời điểm, các quyết định và lý do, thiệt hại, và các thay đổi hệ thống kèm người phụ trách và hạn. Đặt lịch kiểm lại sau ba tháng để xác nhận các thay đổi thực sự tồn tại.', level: 'h' },
      { label: 'Thử thách 7 ngày: dựng năng lực ứng phó tối thiểu', text: 'Bảy ngày: ngày 1 lập danh mục rủi ro, ngày 2 xác định hành động chặn đầu tiên cho từng loại, ngày 3 cập nhật danh sách liên lạc khẩn, ngày 4 soạn mẫu thông báo bốn phần, ngày 5 làm việc với người tư vấn pháp lý về nghĩa vụ thông báo, ngày 6 diễn tập một kịch bản trên bàn, ngày 7 viết quy trình ứng phó một trang và phổ biến cho cả nhóm.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên thông báo sớm ở mức thông tin đã xác nhận thay vì chờ nắm đủ mọi thứ?',
        a: 'Vì trong khủng hoảng, khoảng trống thông tin luôn được lấp đầy bằng suy đoán, và suy đoán hầu như luôn tệ hơn sự thật. Ngoài ra, những người bị ảnh hưởng cần biết sớm để tự bảo vệ mình, và việc để họ biết từ nguồn khác gây thiệt hại về lòng tin nặng hơn nhiều so với nội dung sự cố. Cách thông báo sớm mà vẫn an toàn là chỉ nói những gì đã xác nhận, nói rõ những gì chưa biết, không suy đoán nguyên nhân, và cam kết một mốc cập nhật cụ thể rồi giữ đúng mốc đó. Với những loại sự cố có nghĩa vụ thông báo theo quy định, thời hạn và nội dung phải theo đúng yêu cầu pháp luật và nên được người tư vấn pháp lý xác nhận trước khi phát ra.',
      },
      {
        q: 'Vì sao bản rà soát sau sự cố nên tránh quy trách nhiệm cá nhân?',
        a: 'Vì mục tiêu của bản rà soát là làm cho tổ chức phản ứng tốt hơn ở lần sau, và mục tiêu đó bị phá huỷ khi mọi người biết rằng nói ra sự thật sẽ dẫn tới hậu quả cho một cá nhân. Hệ quả là ở sự cố tiếp theo, thông tin sẽ đến chậm hơn, được làm mềm đi, hoặc bị giấu cho tới khi không giấu được nữa — thời điểm mà thiệt hại đã lớn. Không quy trách nhiệm cá nhân trong bản rà soát không có nghĩa là không có ai chịu trách nhiệm; các vấn đề về hiệu suất hay vi phạm được xử lý riêng theo quy trình nhân sự và theo quy định pháp luật. Hai việc này phải tách bạch về thời điểm và về tài liệu.',
      },
      {
        q: 'Vì sao phải phân ca và ép nghỉ ngay cả khi khủng hoảng chưa kết thúc?',
        a: 'Vì chất lượng phán đoán giảm rõ rệt sau nhiều ngày thiếu ngủ và căng thẳng liên tục, trong khi giai đoạn giữa và cuối của một khủng hoảng lại thường chứa những quyết định phức tạp nhất về khắc phục, bồi thường và truyền thông. Rất nhiều tổ chức xử lý tốt hai ngày đầu rồi mắc sai lầm nghiêm trọng vào ngày thứ ba hoặc thứ tư. Việc phân ca cũng buộc bạn phải viết ra tình trạng và bàn giao rõ ràng, điều này tự nó cải thiện chất lượng thông tin. Nguyên tắc thực tế là xác định ngay từ đầu rằng đây là chặng dài, sắp xếp người thay thế cho mọi vai chủ chốt, và người chỉ huy phải là người bắt buộc nghỉ đầu tiên chứ không phải người cuối cùng.',
      },
    ],
    plan7:
      'Ngày 1: lập danh mục các loại sự cố có thể xảy ra kèm mức nghiêm trọng. Ngày 2: viết hành động chặn thiệt hại đầu tiên cho từng loại và ai được quyền ra lệnh. Ngày 3: cập nhật danh sách liên lạc khẩn và kiểm tra từng số. Ngày 4: soạn mẫu thông báo bốn phần cho ba nhóm đối tượng. Ngày 5: làm việc với người tư vấn pháp lý để xác định nghĩa vụ thông báo theo từng loại sự cố. Ngày 6: diễn tập một kịch bản trên bàn trong 90 phút với cả nhóm. Ngày 7: viết quy trình ứng phó một trang, phân vai chỉ huy, truyền thông, ghi chép và phổ biến.',
    evidence:
      'Bằng chứng ở đây gồm quy trình ứng phó một trang có phân vai, danh mục rủi ro kèm hành động chặn đầu tiên, biên bản một buổi diễn tập, và nếu đã có sự cố thật thì bản rà soát không đổ lỗi cùng danh sách thay đổi hệ thống đã thực hiện. Khi trình bày ở bên ngoài, hãy ẩn danh thông tin nhạy cảm và tránh nêu chi tiết thuộc diện bảo mật hoặc đang có tranh chấp. Trong phỏng vấn, cách kể có sức nặng nhất là theo dòng thời gian với đúng lượng thông tin bạn có tại từng thời điểm, kèm một quyết định bạn đánh giá là sai và điều bạn đã đổi trong hệ thống sau đó. Trong CV: xây quy trình ứng phó sự cố có phân vai và diễn tập định kỳ, dẫn tới bốn thay đổi hệ thống được thực hiện sau lần rà soát gần nhất.',
    references: [
      { label: 'Harvard Business Review — chủ đề quản trị khủng hoảng', url: 'https://hbr.org/topic/subject/crisis-management', type: 'article', needsReview: true },
      { label: 'Hệ thống văn bản quy phạm pháp luật — tra cứu quy định liên quan tới nghĩa vụ thông báo và xử lý sự cố', url: 'https://vanban.chinhphu.vn', type: 'article', needsReview: true },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 16 — Chiến lược rút lui
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Rút lui không đồng nghĩa với thất bại: nó là việc chuyển doanh nghiệp sang một trạng thái khác một cách có trật tự, dù là bán lại, chuyển giao cho người kế nhiệm, sáp nhập, hay đóng cửa. Điểm chung của mọi hình thức là chúng cần thời gian chuẩn bị dài hơn nhiều so với hình dung của phần lớn người chủ, và giá trị thu về phụ thuộc chủ yếu vào những việc đã làm từ nhiều năm trước: sổ sách sạch, khách hàng không phụ thuộc cá nhân người chủ, quy trình viết ra, hồ sơ pháp lý đầy đủ. Cần nhấn mạnh: mua bán doanh nghiệp, chuyển nhượng phần vốn góp, giải thể và các thủ tục liên quan tới người lao động và chủ nợ đều là các quy trình pháp lý và tài chính chính thức, có trình tự và nghĩa vụ bắt buộc; mọi việc thực tế phải được thực hiện với luật sư, kế toán và người tư vấn có chuyên môn, và chương này chỉ là khung tư duy để bạn chuẩn bị và đặt câu hỏi đúng.',
    why: {
      work: 'Ngay cả người làm thuê cũng cần kỹ năng chuyển giao có trật tự khi rời một vị trí: bàn giao tài liệu, chuyển quan hệ, viết lại những gì chỉ mình biết. Người rời đi tử tế và đầy đủ để lại uy tín dùng được nhiều năm.',
      interview:
        'Với các vị trí cấp cao, câu hỏi về lý do bạn rời nơi cũ và cách bạn bàn giao là một phép thử về tính chuyên nghiệp. Người mô tả được kế hoạch chuyển giao mình đã thực hiện tạo ấn tượng rất khác với người chỉ nói lý do ra đi.',
      study:
        'Hiểu cách một doanh nghiệp được định giá và mua bán là mảnh ghép cuối để đọc được tin tức kinh tế một cách có phê phán, và nó soi ngược lại mọi quyết định vận hành hằng ngày.',
      life: 'Kết thúc có trật tự là một kỹ năng sống: rời một dự án cộng đồng, kết thúc một hợp tác, đóng lại một giai đoạn. Cách kết thúc quyết định phần lớn những gì bạn mang theo sang chặng sau, gồm cả quan hệ và danh tiếng.',
    },
    framework: [
      {
        name: 'Xác định rõ bạn muốn gì và trong bao lâu',
        detail: 'Viết ra mục tiêu thật: cần một khoản tiền, muốn thoát khỏi công việc hằng ngày nhưng giữ phần sở hữu, muốn doanh nghiệp tiếp tục tồn tại vì nhân viên, hay muốn dừng hẳn. Mỗi mục tiêu dẫn tới một con đường khác và một khoảng thời gian chuẩn bị khác. Nhầm lẫn ở bước này khiến người ta đàm phán nhiều tháng cho một thứ mà lẽ ra họ không muốn.',
      },
      {
        name: 'Làm cho doanh nghiệp không phụ thuộc vào bạn',
        detail: 'Đây là việc quyết định giá trị nhiều hơn mọi kỹ thuật đàm phán. Chuyển quan hệ khách hàng sang tổ chức thay vì cá nhân bạn, viết quy trình cho những việc chỉ bạn biết, xây đội ngũ có người thay thế được ở các vai chủ chốt, và thử nghỉ dài để kiểm chứng. Một doanh nghiệp mà người chủ không thể vắng mặt hai tuần rất khó chuyển giao.',
      },
      {
        name: 'Dọn sạch hồ sơ trước khi có người hỏi',
        detail: 'Sổ sách kế toán rõ ràng và tách bạch với tài chính cá nhân, hợp đồng đầy đủ và còn hiệu lực, giấy phép hợp lệ, hồ sơ lao động đúng quy định, quyền sở hữu tài sản và tài sản trí tuệ rõ ràng, không có tranh chấp treo. Đây chính là những thứ được soi kỹ trong quá trình thẩm định, và mỗi điểm chưa rõ đều biến thành lý do giảm giá hoặc thành điều kiện ràng buộc. Việc dọn dẹp này phải làm với kế toán và luật sư, và nên bắt đầu ít nhất một tới hai năm trước.',
      },
      {
        name: 'Hiểu logic định giá thay vì tin một con số',
        detail: 'Giá trị của một doanh nghiệp phụ thuộc vào khả năng tạo ra dòng tiền trong tương lai, mức độ ổn định của dòng tiền đó, mức độ phụ thuộc vào người chủ, chất lượng tệp khách và rủi ro còn treo. Không có một hệ số đúng phổ quát cho mọi ngành và mọi thời điểm; các con số nghe được đều là kết quả của những giao dịch cụ thể với điều kiện riêng. Việc đúng đắn là thuê người có chuyên môn định giá và tư vấn cho trường hợp của bạn, đồng thời hiểu rằng cấu trúc thanh toán và các cam kết kèm theo thường quan trọng ngang với con số tổng.',
      },
      {
        name: 'Lập kế hoạch chuyển giao và chăm sóc con người',
        detail: 'Dù là bán hay đóng, phải có kế hoạch cho nhân viên, khách hàng và nhà cung cấp: ai được biết vào lúc nào, quyền lợi của người lao động được bảo đảm ra sao theo đúng quy định, khách hàng được chuyển giao thế nào, các nghĩa vụ còn lại được thanh toán theo trình tự nào. Trong trường hợp đóng cửa hoặc mất khả năng thanh toán, trình tự và nghĩa vụ với người lao động cùng các chủ nợ được pháp luật quy định cụ thể và bắt buộc phải làm đúng với sự tham gia của luật sư và kế toán.',
      },
    ],
    scenario:
      'Chủ một công ty dịch vụ công nghệ thông tin mười tám người, sau mười một năm vận hành, quyết định chuyển giao để tập trung vào việc khác. Khi trao đổi lần đầu với một bên quan tâm mua lại, anh nhận ra ba vấn đề khiến thương vụ khó tiến triển: khoảng một nửa doanh thu đến từ bốn khách hàng mà quan hệ hoàn toàn do anh giữ; hai hợp đồng lớn đã hết hiệu lực từ lâu và các bên vẫn làm việc theo thoả thuận miệng; và phần lớn kiến thức về các hệ thống đã bàn giao cho khách nằm trong đầu hai kỹ sư lâu năm mà không có tài liệu. Anh dừng quá trình đàm phán và dành mười bốn tháng chuẩn bị. Anh chuyển dần quan hệ bốn khách hàng lớn sang hai người quản lý dự án bằng cách đưa họ vào mọi cuộc gặp rồi rút dần khỏi vai trò chính. Anh làm việc với luật sư để ký lại toàn bộ hợp đồng hết hạn và rà lại hồ sơ lao động cùng các giấy phép. Anh yêu cầu hai kỹ sư viết tài liệu bàn giao cho từng hệ thống, coi đó là một phần công việc có ngân sách chứ không phải việc làm thêm. Anh cũng thuê một đơn vị tư vấn để rà soát tình hình tài chính và chuẩn bị hồ sơ. Ở lần đàm phán tiếp theo với một bên khác, quá trình thẩm định diễn ra nhanh hơn hẳn và các điều kiện ràng buộc mà bên mua đề xuất ít hơn nhiều, chủ yếu vì rủi ro phụ thuộc cá nhân đã giảm rõ rệt. Điều anh ghi lại trong sổ của mình là toàn bộ giá trị tăng thêm đến từ những việc lẽ ra nên làm từ nhiều năm trước vì chúng cũng làm doanh nghiệp vận hành tốt hơn.',
    comparison: [
      { weak: 'Bắt đầu nghĩ tới việc chuyển giao khi đã mệt mỏi và muốn dừng càng sớm càng tốt.', mature: 'Chuẩn bị từ nhiều năm trước bằng những việc vốn cũng tốt cho vận hành, để khi cần rút thì có lựa chọn thay vì bị dồn.' },
      { weak: 'Giữ toàn bộ quan hệ khách hàng quan trọng trong tay mình vì đó là giá trị của mình.', mature: 'Chuyển quan hệ sang tổ chức và sang các cá nhân khác, hiểu rằng phụ thuộc vào người chủ làm giảm giá trị chuyển nhượng chứ không tăng.' },
      { weak: 'Thông báo cho nhân viên vào phút cuối để tránh xáo trộn.', mature: 'Lập kế hoạch truyền thông nội bộ theo trình tự, nói thật ở mức có thể nói và bảo đảm đầy đủ quyền lợi theo quy định, vì cách kết thúc quyết định danh tiếng của bạn trong ngành.' },
    ],
    mistakes: [
      'Trộn lẫn tài chính cá nhân với tài chính doanh nghiệp trong nhiều năm, khiến khi cần chứng minh khả năng sinh lời thì không có số liệu nào đứng vững được trước quá trình thẩm định.',
      'Coi con số tổng của một đề nghị là điều quan trọng duy nhất mà bỏ qua cấu trúc thanh toán và các cam kết kèm theo như thời gian ở lại làm việc, điều kiện thanh toán theo kết quả tương lai, hay các ràng buộc về việc không cạnh tranh.',
      'Trong trường hợp phải đóng cửa, cố kéo dài hoạt động bằng cách vay thêm hoặc trì hoãn nghĩa vụ, làm tăng thiệt hại cho người lao động và các chủ nợ, trong khi có những trình tự pháp lý và tài chính cần được kích hoạt sớm với sự tư vấn của người có chuyên môn.',
    ],
    worksheet: [
      'Viết ra mục tiêu thật của bạn khi rút lui: cần tiền, cần thoát khỏi công việc hằng ngày, muốn doanh nghiệp tiếp tục tồn tại, hay muốn dừng hẳn? Mỗi lựa chọn dẫn tới con đường nào?',
      'Nếu bạn vắng mặt hoàn toàn trong bốn tuần, những gì sẽ dừng lại? Danh sách đó chính là danh sách việc phải xử lý trước khi chuyển giao.',
      'Bao nhiêu phần trăm doanh thu đến từ những khách hàng mà quan hệ do đích thân bạn giữ? Ai có thể tiếp nhận từng quan hệ đó và trong bao lâu?',
      'Hồ sơ nào của doanh nghiệp bạn hiện chưa sạch: hợp đồng hết hạn, giấy phép, hồ sơ lao động, quyền sở hữu tài sản, tranh chấp treo? Liệt kê cụ thể.',
      'Nếu phải dừng hoạt động, những nghĩa vụ nào cần được thực hiện và theo trình tự nào? Bạn đã hỏi luật sư và kế toán về việc này chưa?',
    ],
    exercises: [
      { label: 'Viết mục tiêu rút lui một trang', text: 'Viết một trang trả lời bạn muốn gì, trong khoảng thời gian nào, và điều gì bạn không chấp nhận đánh đổi. Đọc lại sau một tuần và sửa, vì câu trả lời đầu tiên thường là câu trả lời xã giao với chính mình.', level: 'e' },
      { label: 'Bản đồ phụ thuộc vào người chủ', text: 'Liệt kê mọi việc, quan hệ và kiến thức hiện chỉ tồn tại ở bạn. Với mỗi mục, ghi người có thể tiếp nhận và thời gian cần để chuyển giao.', level: 'e' },
      { label: 'Kiểm kê hồ sơ trước thẩm định', text: 'Lập danh sách kiểm gồm sổ sách, hợp đồng, giấy phép, hồ sơ lao động, quyền sở hữu tài sản và tài sản trí tuệ. Đánh dấu mọi mục chưa hoàn chỉnh và gán hạn xử lý.', level: 'e' },
      { label: 'Thử vắng mặt bốn tuần', text: 'Lên kế hoạch và thực sự vắng mặt hoàn toàn khỏi vận hành trong bốn tuần, có người thay thế cho từng vai. Ghi lại chính xác việc gì dừng, ai đã tự quyết được và ai đã chờ.', level: 'm' },
      { label: 'Chuyển giao một quan hệ khách hàng lớn', text: 'Chọn một khách hàng quan trọng và thực hiện chuyển giao có kế hoạch trong ba tháng: đưa người tiếp nhận vào mọi cuộc gặp, rút dần vai trò chính, và sau đó không tham gia trong một tháng. Ghi lại phản ứng của khách và những chỗ cần bổ sung.', level: 'm' },
      { label: 'Buổi làm việc với người tư vấn', text: 'Đặt buổi làm việc với luật sư và kế toán để hiểu các phương án chuyển giao phù hợp với loại hình doanh nghiệp của bạn, các nghĩa vụ đi kèm và trình tự bắt buộc. Chuẩn bị trước danh sách câu hỏi và ghi lại thành một trang tóm tắt.', level: 'm' },
      { label: 'Hồ sơ chuẩn bị chuyển giao', text: 'Xây bộ hồ sơ đầy đủ như thể quá trình thẩm định bắt đầu vào tháng sau: số liệu tài chính nhiều năm, danh mục hợp đồng, cơ cấu khách hàng, tài liệu vận hành, hồ sơ nhân sự, tình trạng pháp lý. Nhờ một người có kinh nghiệm rà và ghi lại mọi điểm họ cho là rủi ro.', level: 'h' },
      { label: 'Thử thách 7 ngày: dựng lộ trình rút lui', text: 'Bảy ngày: ngày 1 viết mục tiêu rút lui, ngày 2 lập bản đồ phụ thuộc vào người chủ, ngày 3 kiểm kê hồ sơ và đánh dấu điểm chưa sạch, ngày 4 lập kế hoạch chuyển giao cho hai quan hệ khách hàng lớn nhất, ngày 5 viết danh sách câu hỏi cho luật sư và kế toán, ngày 6 lên lịch một đợt vắng mặt thử, ngày 7 viết lộ trình 24 tháng với các mốc và người chịu trách nhiệm.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao mức độ phụ thuộc vào người chủ lại ảnh hưởng lớn tới khả năng chuyển giao doanh nghiệp?',
        a: 'Vì bên tiếp nhận đang mua khả năng tạo ra kết quả trong tương lai, mà phần lớn kết quả đó lại gắn với một người sẽ rời đi thì thứ được chuyển giao thực chất rất ít. Điều này thể hiện thành nhiều hệ quả cụ thể: quá trình thẩm định kéo dài hơn, bên tiếp nhận đề xuất nhiều điều kiện ràng buộc hơn như yêu cầu người chủ ở lại một thời gian hoặc gắn một phần thanh toán với kết quả tương lai, và trong nhiều trường hợp thương vụ không diễn ra. Cách xử lý mất thời gian nhưng rõ ràng: chuyển quan hệ khách hàng sang tổ chức, tài liệu hoá kiến thức, xây người thay thế ở các vai chủ chốt, và kiểm chứng bằng một đợt vắng mặt thật. Điểm đáng chú ý là những việc này cũng làm doanh nghiệp vận hành tốt hơn ngay lập tức, nên chúng đáng làm kể cả khi bạn không có ý định rút lui.',
      },
      {
        q: 'Vì sao cấu trúc thanh toán và các cam kết kèm theo có thể quan trọng ngang hoặc hơn con số tổng trong một thương vụ chuyển nhượng?',
        a: 'Vì con số tổng chỉ có nghĩa khi gắn với điều kiện nhận được nó. Một đề nghị có tổng lớn nhưng phần lớn được trả dần theo kết quả kinh doanh trong nhiều năm tới, kèm yêu cầu người chủ ở lại điều hành và kèm các ràng buộc về việc không được làm ngành nghề tương tự, có thể kém hơn hẳn một đề nghị tổng thấp hơn nhưng thanh toán dứt điểm và ít ràng buộc. Ngoài ra còn các nội dung về trách nhiệm với những vấn đề phát sinh sau khi chuyển giao, về bảo đảm và cam kết của bên chuyển nhượng, và về xử lý các nghĩa vụ đang tồn tại. Tất cả những nội dung này có hệ quả pháp lý và tài chính kéo dài nhiều năm, nên phải được luật sư có kinh nghiệm về loại giao dịch này và kế toán cùng rà trước khi ký bất cứ điều gì, kể cả các văn bản ghi nhớ ban đầu.',
      },
      {
        q: 'Khi buộc phải dừng hoạt động, nguyên tắc nào giúp giảm thiệt hại cho những người liên quan?',
        a: 'Nguyên tắc bao trùm là nhận diện sớm và làm đúng trình tự thay vì kéo dài. Kéo dài bằng cách vay thêm hoặc trì hoãn nghĩa vụ thường làm tổng thiệt hại lớn hơn và mở rộng số người bị ảnh hưởng, đồng thời có thể tạo ra rủi ro pháp lý cho người điều hành. Việc cần làm ngay khi thấy khả năng này là làm việc với kế toán để có bức tranh chính xác về nghĩa vụ và tài sản, và làm việc với luật sư để hiểu các phương án cùng trình tự bắt buộc, đặc biệt là các nghĩa vụ đối với người lao động và đối với các chủ nợ, vì những nội dung này được pháp luật quy định cụ thể về thứ tự và thủ tục. Về phần con người, nguyên tắc là thông báo trung thực sớm nhất trong mức có thể, hỗ trợ nhân viên tìm việc mới, và bàn giao khách hàng cho những nơi có thể phục vụ họ tiếp. Cách kết thúc của bạn sẽ được nhớ lâu hơn nhiều so với lý do kết thúc.',
      },
    ],
    plan7:
      'Ngày 1: viết mục tiêu rút lui thật của bạn và khoảng thời gian mong muốn. Ngày 2: lập bản đồ mọi việc, quan hệ và kiến thức đang chỉ tồn tại ở bạn. Ngày 3: kiểm kê hồ sơ tài chính và pháp lý, đánh dấu mọi điểm chưa sạch. Ngày 4: lập kế hoạch chuyển giao cho hai quan hệ khách hàng lớn nhất. Ngày 5: chuẩn bị danh sách câu hỏi và đặt lịch với luật sư cùng kế toán. Ngày 6: lên lịch cho một đợt vắng mặt thử và phân vai thay thế. Ngày 7: viết lộ trình 24 tháng gồm các mốc, người chịu trách nhiệm và những việc phải hoàn thành trước khi bắt đầu bất kỳ cuộc đàm phán nào.',
    evidence:
      'Bằng chứng cho kỹ năng này là bộ hồ sơ chuẩn bị chuyển giao: bản đồ phụ thuộc vào người chủ cùng tiến độ giảm dần theo thời gian, danh sách kiểm hồ sơ pháp lý và tài chính đã được xử lý, tài liệu vận hành, và kết quả của một đợt vắng mặt thử có ghi chép. Nếu bạn đã thực hiện một cuộc chuyển giao, thứ đáng kể lại là quá trình: bạn chuẩn bị bao lâu, chuyển giao quan hệ khách hàng ra sao, và bạn đã xử lý phần con người thế nào. Trong phỏng vấn cho vị trí điều hành, khả năng nói về việc làm cho tổ chức không phụ thuộc vào chính mình là một chỉ dấu hiếm và được đánh giá cao. Trong CV: chuẩn hoá vận hành và chuyển giao quan hệ khách hàng chiếm khoảng một nửa doanh thu từ cá nhân người sáng lập sang đội ngũ trong 14 tháng, rút ngắn đáng kể quá trình thẩm định khi chuyển giao doanh nghiệp. Lưu ý không tiết lộ các điều khoản thuộc diện bảo mật.',
    references: [
      { label: 'Harvard Business Review — chủ đề mua bán và sáp nhập doanh nghiệp', url: 'https://hbr.org/topic/subject/mergers-and-acquisitions', type: 'article', needsReview: true },
      { label: 'Cổng thông tin quốc gia về đăng ký doanh nghiệp — thông tin về thủ tục thay đổi và chấm dứt hoạt động', url: 'https://dangkykinhdoanh.gov.vn', type: 'article', needsReview: true },
    ],
  }),
];
