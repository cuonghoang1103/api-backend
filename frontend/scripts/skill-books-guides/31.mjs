import { guide } from '../skill-guide-builder.mjs';

export default [
  // ── Chương 1 — Làm việc nhóm — Teamwork ──────────────────────────────────
  guide({
    thesis:
      'Làm việc nhóm không phải là hoà thuận. Nó là năng lực làm cho phần việc của bạn dễ nối vào phần việc người khác: đầu ra đủ rõ để người sau dùng được ngay mà không phải hỏi lại, trạng thái đủ minh bạch để không ai phải đi dò, và bất đồng được đưa lên bàn lúc sửa còn rẻ. Một nhóm dễ chịu mà mỗi lần bàn giao đều phải hỏi lại ba lượt là nhóm yếu; một nhóm hay tranh luận nhưng mọi điểm nối đều rõ là nhóm mạnh.',
    why: {
      work:
        'Phần lớn thời gian bị đốt trong công việc không nằm ở lúc làm mà nằm ở lúc chờ, lúc hỏi lại và lúc làm lại vì hiểu sai bàn giao. Người biết làm việc nhóm cắt được đúng ba khoản đó, nên cùng một năng lực chuyên môn lại ra kết quả sớm hơn.',
      interview:
        'Câu hỏi “kể về một lần làm việc nhóm khó khăn” không đo mức độ dễ chịu của bạn, nó đo bạn có nhìn thấy cấu trúc phối hợp hay không: ai sở hữu cái gì, thông tin tắc ở đâu, bạn đã đổi cách làm việc chứ không chỉ đổi thái độ.',
      study:
        'Đồ án nhóm ở trường thường hỏng vì chia bài theo số trang chứ không theo phần việc có ranh giới; hiểu nguyên tắc chia theo giao diện giúp bạn tránh cảnh đêm cuối phải ghép năm phong cách viết khác nhau thành một bài.',
      life:
        'Ban tổ chức đám cưới, hội phụ huynh lớp, nhóm chơi bóng cuối tuần — chỗ nào có nhiều người cùng lo một việc thì chỗ đó cần một chỗ ghi ai làm gì và một nhịp hỏi lại, nếu không mọi thứ dồn hết lên một người nhiệt tình nhất.',
    },
    framework: [
      { name: 'Chốt đầu ra chung', detail: 'Viết một câu duy nhất mô tả nhóm sẽ giao cái gì, cho ai, vào ngày nào, và người nhận sẽ dùng nó để làm gì tiếp. Không có câu này thì mỗi người tối ưu một hướng khác nhau mà vẫn tin là mình đúng.' },
      { name: 'Chia theo giao diện, không chia theo lượng', detail: 'Cắt việc ở chỗ ranh giới bàn giao mỏng nhất: mỗi mảnh có đầu vào rõ, đầu ra rõ, và người khác kiểm tra được mà không cần hiểu bên trong. Chia đều số lượng nhưng cắt trúng chỗ dính nhau sẽ tạo ra một chuỗi chờ đợi.' },
      { name: 'Công khai trạng thái theo mặc định', detail: 'Mọi việc đang chạy phải nhìn thấy được ở một chỗ chung mà không cần hỏi ai: bảng việc, kênh chung, file dùng chung. Thông tin nằm trong tin nhắn riêng là thông tin nhóm không có.' },
      { name: 'Nhịp đồng bộ cố định', detail: 'Định sẵn khi nào cả nhóm gặp nhau và gặp bao lâu, để không phải triệu tập ngẫu hứng mỗi lần có vướng. Nhịp cố định biến việc phối hợp thành thói quen thay vì thành một sự kiện gây gián đoạn.' },
      { name: 'Rà lại sau mỗi mốc', detail: 'Sau mỗi lần giao hàng, dành 30 phút hỏi ba câu: chỗ nào phải hỏi lại nhiều nhất, chỗ nào phải làm lại, và ta đổi một thứ gì cho mốc sau. Không rà thì nhóm lặp lại đúng chỗ tắc cũ.' },
    ],
    scenario:
      'Một trung tâm tiếng Anh giao cho năm người tổ chức hội thảo tuyển sinh trong ba tuần. Tuần đầu ai cũng bận nhưng không ai biết người khác đang làm gì; đến ngày thứ mười thì phát hiện hai người cùng liên hệ một địa điểm và không ai làm nội dung slide. Người quản lý dừng lại nửa buổi, viết lên một bảng Google Sheet năm dòng: địa điểm, nội dung, truyền thông, đăng ký, hậu cần — mỗi dòng đúng một cái tên, một ngày giao và một ô “xong nghĩa là gì”. Từ đó mỗi sáng thứ Ba họp 20 phút chỉ để soát năm dòng. Hội thảo diễn ra đúng hạn, và điều nhóm giữ lại cho lần sau chính là cái bảng năm dòng đó chứ không phải kinh nghiệm riêng của từng người.',
    comparison: [
      { weak: 'Chia việc bằng cách chia đều khối lượng cho công bằng, ai cũng làm một phần bằng nhau.', mature: 'Chia việc ở chỗ ranh giới bàn giao rõ nhất, chấp nhận khối lượng không bằng nhau, và ghi rõ đầu vào — đầu ra của từng mảnh.' },
      { weak: 'Trao đổi công việc trong tin nhắn riêng vì nhanh và đỡ làm phiền người khác.', mature: 'Trao đổi ở kênh chung theo mặc định, chỉ chuyển sang riêng khi thật sự là chuyện cá nhân, để người thứ ba đọc lại được mà không phải hỏi.' },
      { weak: 'Khi thấy một người chậm thì im lặng làm hộ phần của họ cho kịp hạn.', mature: 'Nêu lệch tiến độ ở nhịp đồng bộ gần nhất, hỏi họ cần gì, và nếu phải nhận hộ thì ghi lại việc chuyển giao đó công khai chứ không âm thầm.' },
    ],
    mistakes: [
      'Coi tinh thần nhóm là thứ tạo ra bằng ăn uống và hoạt động gắn kết, trong khi chỗ hỏng thật nằm ở việc không ai biết ai đang sở hữu phần nào.',
      'Nhầm “không có ai phàn nàn” với “nhóm đang chạy tốt”, trong khi im lặng thường chỉ có nghĩa là mọi người đã bỏ cuộc việc nêu vấn đề.',
      'Cho rằng chỉ trưởng nhóm mới có trách nhiệm phối hợp, nên khi thấy hai phần việc đang chồng lên nhau thì đứng nhìn thay vì nói ra ngay.',
    ],
    worksheet: [
      'Viết một câu mô tả đầu ra chung của nhóm bạn hiện tại. Đưa cho một thành viên khác viết câu của họ mà không xem của bạn — hai câu khác nhau ở chỗ nào?',
      'Liệt kê mọi phần việc đang chạy và ghi đúng MỘT cái tên cạnh mỗi phần. Có phần nào không ghi được tên, hoặc ghi được hai tên không?',
      'Trong 7 ngày qua, bạn phải hỏi lại người khác bao nhiêu lần chỉ để biết trạng thái một việc? Mỗi lần hỏi đó lẽ ra phải nhìn thấy ở đâu?',
      'Nhịp đồng bộ hiện tại của nhóm là gì (ngày nào, dài bao lâu, ai bắt buộc có mặt)? Nếu không có nhịp cố định, việc phối hợp đang xảy ra lúc nào?',
      'Ở mốc gần nhất, phần bàn giao nào phải làm lại? Nguyên nhân là đầu ra mô tả chưa đủ rõ, hay là người nhận không được hỏi trước khi làm?',
    ],
    exercises: [
      { label: 'Bảng chủ sở hữu', text: 'Lập bảng mọi hạng mục đang chạy của nhóm, mỗi dòng một chủ sở hữu duy nhất và một ô “xong nghĩa là gì”. Gửi bảng cho cả nhóm và đếm số dòng bị ai đó sửa lại — mỗi lần sửa là một hiểu nhầm bạn vừa chặn được.', level: 'e' },
      { label: 'Đếm lần hỏi lại', text: 'Trong ba ngày, mỗi lần bạn phải nhắn hỏi trạng thái của việc gì đó thì ghi một gạch. Cuối ngày thứ ba, nhìn danh sách và chọn ra một thông tin đáng được hiển thị công khai thay vì phải hỏi.', level: 'e' },
      { label: 'Một câu đầu ra', text: 'Nhờ ba người trong nhóm viết riêng câu trả lời cho “ba tuần nữa nhóm mình giao cái gì, cho ai”. Dán ba câu cạnh nhau và khoanh mọi chỗ khác biệt.', level: 'e' },
      { label: 'Cắt lại ranh giới', text: 'Chọn một hạng mục đang bị hai người cùng đụng vào. Vẽ đường cắt mới sao cho mỗi bên có đầu vào và đầu ra kiểm tra được, rồi thoả thuận lại bằng lời với cả hai người đó.', level: 'm' },
      { label: 'Nhịp 20 phút', text: 'Thiết lập một buổi đồng bộ 20 phút cố định trong hai tuần, chỉ soát bảng chủ sở hữu chứ không bàn giải pháp. Ghi lại số vấn đề được phát hiện trong buổi đó thay vì phát hiện lúc gần hạn.', level: 'm' },
      { label: 'Nhật ký bàn giao', text: 'Ghi lại năm lần bàn giao gần nhất trong nhóm: ai giao cho ai, người nhận có phải hỏi thêm không, hỏi mấy câu. Tìm mẫu chung trong các câu hỏi đó và bổ sung trước vào mô tả đầu ra.', level: 'm' },
      { label: 'Rà mốc 30 phút', text: 'Sau mốc gần nhất, chủ trì một buổi 30 phút với đúng ba câu hỏi: hỏi lại nhiều nhất ở đâu, làm lại ở đâu, đổi một thứ gì. Kết thúc bằng một thay đổi duy nhất có người chịu trách nhiệm và ngày kiểm.', level: 'h' },
      { label: 'Bảy ngày minh bạch', text: 'Thử thách 7 ngày: mọi trao đổi công việc của bạn chuyển hết sang kênh chung, không nhắn riêng về công việc trừ khi là chuyện cá nhân. Ngày 7, hỏi hai đồng nghiệp xem họ có nắm việc dễ hơn không và ghi lại nguyên văn câu trả lời.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Nhóm bạn rất hoà thuận, không ai cãi nhau, nhưng luôn trễ hạn. Nên nhìn vào đâu trước?',
        a: 'Nhìn vào ranh giới bàn giao và độ minh bạch trạng thái, không nhìn vào quan hệ. Nhóm hoà thuận mà trễ thường vì không ai muốn nói ra việc mình đang chậm, và vì đầu ra được mô tả mơ hồ nên ai cũng tưởng mình đã xong phần của mình. Bắt đầu bằng bảng chủ sở hữu có ô “xong nghĩa là gì”.',
      },
      {
        q: 'Vì sao chia đều khối lượng cho “công bằng” lại thường tạo ra nhóm chậm hơn?',
        a: 'Vì công bằng về khối lượng không nói gì về chỗ cắt. Nếu đường cắt đi ngang một phần việc dính chặt, hai người phải liên tục chờ nhau và trao đổi qua lại, chi phí phối hợp ăn hết phần tiết kiệm được. Cắt ở chỗ giao diện mỏng nhất có thể tạo ra khối lượng lệch, nhưng tổng thời gian tới đích ngắn hơn.',
      },
      {
        q: 'Một thành viên luôn trả lời “đang làm, sắp xong” suốt hai tuần. Cách xử lý theo hướng cấu trúc là gì?',
        a: 'Đừng đòi họ cam kết mạnh hơn, hãy làm nhỏ đơn vị bàn giao. Đề nghị chia phần việc thành các mảnh giao được trong 1-2 ngày, mỗi mảnh có sản phẩm nhìn thấy được. Khi đơn vị đủ nhỏ, “sắp xong” tự động biến thành một vật cụ thể hoặc thành một điểm tắc có tên, và cả hai đều hành động được.',
      },
    ],
    plan7:
      'Ngày 1: viết câu đầu ra chung và đối chiếu với câu của hai đồng nghiệp. Ngày 2: lập bảng chủ sở hữu, mỗi dòng một tên và một ô “xong nghĩa là gì”. Ngày 3: gửi bảng cho cả nhóm, ghi lại mọi chỗ bị sửa. Ngày 4: chọn một hạng mục bị chồng lấn và cắt lại ranh giới với hai người liên quan. Ngày 5: chốt lịch nhịp đồng bộ 20 phút và chạy buổi đầu tiên. Ngày 6: chuyển toàn bộ trao đổi công việc sang kênh chung, đếm số lần bị hỏi riêng. Ngày 7: rà lại tuần bằng ba câu hỏi và chốt đúng một thay đổi cho tuần sau.',
    evidence:
      'Giữ lại bảng chủ sở hữu ở hai phiên bản: bản đầu tuần và bản sau khi cả nhóm sửa, cùng biên bản buổi rà mốc ghi rõ thay đổi được chọn và kết quả sau đó. Khi phỏng vấn hỏi “bạn đóng góp gì cho nhóm ngoài phần chuyên môn”, bạn mở đúng hai vật này ra: nó cho thấy bạn thay đổi được cách nhóm vận hành chứ không chỉ hoàn thành phần được giao — và đây là tín hiệu mà nhà tuyển dụng dùng để phân biệt một thành viên tốt với một người sắp lên được vị trí dẫn dắt.',
    references: [
      { label: 'Atlassian Team Playbook — bộ bài tập vận hành nhóm', url: 'https://www.atlassian.com/team-playbook', type: 'article' },
      { label: 'Gallup Workplace — nghiên cứu về gắn kết và hiệu quả đội nhóm', url: 'https://www.gallup.com/workplace/', type: 'article' },
    ],
  }),

  // ── Chương 2 — Xây dựng niềm tin ─────────────────────────────────────────
  guide({
    thesis:
      'Niềm tin trong công việc không phải là cảm tình, nó là mức độ người khác dám dựa vào bạn mà không cần kiểm tra lại. Nó được xây bằng những đơn vị rất nhỏ và rất chán: đúng giờ đã hẹn, báo sớm khi trễ, nói rõ chỗ mình không biết, và không đổi lời khi có mặt người khác. Mất thì nhanh, xây lại thì chỉ có một con đường là lặp lại hành vi đủ nhiều lần để người ta không cần nhớ nữa.',
    why: {
      work:
        'Người được tin sẽ nhận được thông tin sớm hơn và nhận được việc quan trọng hơn, đơn giản vì người giao không phải trả thêm chi phí giám sát. Đó là lợi thế cộng dồn, không phải phần thưởng đạo đức.',
      interview:
        'Người phỏng vấn đo độ tin cậy qua cách bạn nói về thất bại và về đồng nghiệp cũ: người dám nêu phần trách nhiệm của mình và không đổ lỗi công ty cũ tạo cảm giác an toàn hơn hẳn một hồ sơ toàn thắng lợi.',
      study:
        'Trong nhóm học hay đồ án, người giữ được lời hứa nhỏ sẽ được chọn làm chỗ dựa, và chính vị trí đó cho họ cơ hội chạm vào phần khó nhất của bài — nơi học được nhiều nhất.',
      life:
        'Với gia đình, bạn bè và các quan hệ dài hạn, độ tin cậy là thứ quyết định người ta có kể với bạn tin xấu sớm hay không — mà tin xấu nghe sớm luôn rẻ hơn tin xấu nghe muộn.',
    },
    framework: [
      { name: 'Nói đúng năng lực thật', detail: 'Phân biệt rõ ba mức khi nhận việc: tôi làm được, tôi làm được nếu có X, tôi chưa từng làm. Người phóng đại mức một lần sẽ phải trả bằng một lần trễ hạn không giải thích được.' },
      { name: 'Giữ những lời hứa nhỏ', detail: 'Độ tin cậy được đo bằng tần suất chứ không bằng độ lớn. Gửi file lúc 4 giờ như đã hẹn có tác dụng lớn hơn một lần thức đêm cứu dự án, vì nó lặp lại và dự đoán được.' },
      { name: 'Minh bạch lý do đằng sau quyết định', detail: 'Khi bạn chọn phương án A, nói luôn bạn đã cân nhắc B và bỏ vì lý do gì. Người khác không cần đồng ý, họ cần thấy quyết định của bạn có logic ổn định chứ không tuỳ hứng.' },
      { name: 'Báo hỏng sớm, kèm phương án', detail: 'Ngay khi biết sẽ trễ hoặc sai, nói ngay trong ngày, kèm ảnh hưởng và hai lựa chọn. Báo sớm làm bạn mất một chút mặt mũi, giấu đến phút chót làm bạn mất toàn bộ độ tin cậy.' },
      { name: 'Nhất quán khi vắng mặt người đó', detail: 'Nói về đồng nghiệp lúc họ không có mặt đúng như lúc họ có mặt. Người nghe luôn ngầm suy ra rằng bạn cũng sẽ nói về họ theo cách y hệt khi họ vắng.' },
    ],
    scenario:
      'Một cửa hàng trưởng của chuỗi bán lẻ tiếp quản cửa hàng đang có tỷ lệ nghỉ việc cao. Nhân viên cũ đã quen nghe hứa rồi thôi, nên không ai tin lịch nghỉ được duyệt. Chị không hứa gì lớn; chị chọn đúng một việc nhỏ: lịch ca của tuần sau luôn dán trước 17 giờ thứ Năm, không có ngoại lệ. Tuần nào có sự cố thì 17 giờ vẫn dán bản tạm kèm ghi chú chỗ chưa chốt. Sau sáu tuần, nhân viên bắt đầu chủ động báo trước lịch bận cá nhân thay vì xin nghỉ đột xuất — vì họ đã có bằng chứng rằng nói trước thì được xử lý, và điều đó rẻ hơn cho cả hai bên.',
    comparison: [
      { weak: 'Nhận mọi yêu cầu để giữ hình ảnh nhiệt tình, rồi thương lượng lại hạn khi đã trễ.', mature: 'Nói rõ ngay lúc nhận: làm được phần nào trước ngày nào, phần nào cần thêm nguồn lực hoặc phải bỏ.' },
      { weak: 'Giấu sai sót và cố sửa âm thầm, hy vọng không ai kịp nhận ra.', mature: 'Báo trong ngày phát hiện, nêu phạm vi ảnh hưởng và phương án khắc phục, rồi mới bắt tay sửa.' },
      { weak: 'Xây quan hệ bằng ăn uống, quà cáp và lời khen, nhưng lịch hẹn thì thường xuyên lùi.', mature: 'Xây quan hệ bằng độ dự đoán được: đúng giờ, đúng phạm vi đã hứa, và báo trước mỗi khi có thay đổi.' },
    ],
    mistakes: [
      'Tin rằng một hành động lớn — thức đêm cứu deadline — bù được cho hai mươi lần trễ hẹn nhỏ, trong khi người khác đánh giá bạn bằng phần lặp lại chứ không bằng phần ngoại lệ.',
      'Nhầm sự cởi mở với sự tin cậy: kể nhiều chuyện cá nhân tạo cảm giác thân, nhưng không thay được bằng chứng rằng việc giao cho bạn sẽ về đúng hẹn.',
      'Cho rằng đã mất niềm tin thì phải xin lỗi thật nhiều lần, trong khi thứ duy nhất tái lập được nó là một chuỗi hành vi đúng hẹn đủ dài để người kia không phải nhớ tới lỗi cũ nữa.',
    ],
    worksheet: [
      'Ba lời hứa nhỏ gần nhất bạn đưa ra ở nơi làm việc là gì, và bao nhiêu trong số đó bạn thực hiện đúng ngày đã nói?',
      'Có việc nào bạn đang nhận mà thật ra thuộc nhóm “chưa từng làm” nhưng bạn chưa nói ra? Nói ra bây giờ tốn gì, nói ra lúc trễ hạn tốn gì?',
      'Lần gần nhất bạn phát hiện mình sai, bao nhiêu giờ trôi qua trước khi người liên quan biết? Điều gì khiến khoảng đó dài ra?',
      'Viết tên một người mà bạn thấy khó tin tưởng. Cụ thể họ đã làm hoặc không làm hành vi nào? Ghi hành vi, không ghi tính cách.',
      'Nếu tuần sau bạn chỉ được chọn đúng MỘT thói quen để người khác dự đoán được bạn, bạn chọn thói quen nào và nó xảy ra vào thứ mấy, giờ nào?',
    ],
    exercises: [
      { label: 'Ba mức khi nhận việc', text: 'Trong tuần này, mỗi lần được giao việc hãy trả lời theo đúng một trong ba mức: làm được, làm được nếu có X, chưa từng làm. Ghi lại phản ứng của người giao ở mức thứ ba — thường nó nhẹ hơn bạn tưởng nhiều.', level: 'e' },
      { label: 'Một lời hứa lặp lại', text: 'Chọn một việc nhỏ có thể lặp hằng tuần vào một giờ cố định (gửi bản cập nhật, dán lịch, trả lời tin nhắn tồn). Làm đúng bốn tuần liền và đánh dấu mỗi tuần vào lịch.', level: 'e' },
      { label: 'Đồng hồ báo hỏng', text: 'Đặt cho mình quy tắc: mọi tin xấu phải đến tai người liên quan trong vòng 4 giờ kể từ lúc bạn biết. Ghi lại ba lần áp dụng gần nhất và khoảng thời gian thật.', level: 'e' },
      { label: 'Nhật ký lời hứa', text: 'Lập bảng hai cột trong hai tuần: cột trái ghi mọi lời hứa bạn nói ra kèm ngày, cột phải ghi ngày thực hiện thật. Tính tỷ lệ đúng hẹn và tìm loại hứa nào bạn hay lỡ nhất.', level: 'm' },
      { label: 'Giải thích lý do bỏ', text: 'Với ba quyết định gần nhất của bạn, viết thêm đoạn “tôi đã cân nhắc phương án B và bỏ vì…”. Gửi kèm khi thông báo quyết định và quan sát số câu hỏi phản đối giảm đi thế nào.', level: 'm' },
      { label: 'Kiểm tra khi vắng mặt', text: 'Ghi lại ba lần gần nhất bạn nói về một đồng nghiệp lúc họ không có mặt. Với mỗi lần, tự hỏi bạn có nói y hệt khi họ ngồi đó không; nếu không, viết lại câu đó theo phiên bản nói được trước mặt.', level: 'm' },
      { label: 'Sửa một quan hệ đã hỏng', text: 'Chọn một người bạn từng thất hứa. Gặp riêng, nêu đúng hành vi của mình chứ không phân trần hoàn cảnh, và đề nghị một cam kết nhỏ có thể kiểm chứng trong hai tuần. Thực hiện đủ hai tuần trước khi nhắc lại chuyện cũ.', level: 'h' },
      { label: 'Bảy ngày dự đoán được', text: 'Thử thách 7 ngày: mỗi sáng viết ra ba việc bạn cam kết xong trong ngày và gửi công khai cho nhóm; mỗi tối báo lại kết quả thật, kể cả khi không xong. Ngày 7, đọc lại chuỗi bảy ngày và tìm mẫu chung ở những việc bạn hay hứa quá tay.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao giữ một lời hứa nhỏ lặp lại hằng tuần lại tạo niềm tin mạnh hơn một lần cứu dự án ngoạn mục?',
        a: 'Vì niềm tin thực chất là khả năng dự đoán. Một lần xuất sắc không cho người khác cơ sở để đoán lần sau bạn ra sao, còn hai mươi lần đúng hẹn cho họ một tỷ lệ để dựa vào. Ngoài ra, việc cứu dự án thường xuất hiện chính ở những nhóm quản trị kém, nên nó không phải tín hiệu tốt như người ta tưởng.',
      },
      {
        q: 'Bạn vừa phát hiện một sai sót của mình có thể ảnh hưởng tới khách hàng, nhưng chưa chắc chắn mức độ. Nên báo ngay hay điều tra xong rồi báo?',
        a: 'Báo ngay, nhưng báo đúng mức chắc chắn hiện có: nêu điều đã biết, điều chưa biết, thời điểm sẽ có thông tin đầy đủ và việc bạn đang làm. Chờ cho chắc rồi mới báo khiến người khác mất cơ hội hành động sớm, và khi họ phát hiện bạn đã biết từ trước thì thiệt hại về độ tin cậy lớn hơn nhiều lần bản thân sai sót.',
      },
      {
        q: 'Một đồng nghiệp nói: “Tôi tin cậu, nhưng cứ gửi cho tôi xem trước mọi thứ nhé.” Câu đó nói lên điều gì và bạn nên đọc nó thế nào?',
        a: 'Lời nói và hành vi lệch nhau, và hành vi mới là dữ liệu thật: họ vẫn đang trả chi phí kiểm tra. Đừng tranh luận về chữ “tin”; hãy hỏi cụ thể phần nào khiến họ thấy cần xem trước, rồi thoả thuận một tiêu chí để giảm dần — ví dụ sau ba lần liên tiếp không có lỗi ở phần đó thì bỏ bước duyệt. Niềm tin được trả lại theo phạm vi, không trả lại theo lời cam đoan.',
      },
    ],
    plan7:
      'Ngày 1: lập nhật ký lời hứa và ghi lại mọi cam kết bạn nói ra. Ngày 2: chọn một lời hứa nhỏ lặp hằng tuần và đặt lịch cố định cho nó. Ngày 3: áp dụng ba mức khi nhận việc cho mọi yêu cầu mới. Ngày 4: bổ sung đoạn “đã cân nhắc và bỏ phương án B vì…” vào một thông báo quyết định. Ngày 5: đặt quy tắc báo tin xấu trong 4 giờ và áp dụng ít nhất một lần. Ngày 6: soát lại mọi câu bạn nói về người vắng mặt trong tuần. Ngày 7: tính tỷ lệ đúng hẹn của cả tuần và chọn một loại lời hứa bạn sẽ ngừng đưa ra.',
    evidence:
      'Xây một hồ sơ “độ tin cậy có số”: bảng nhật ký lời hứa với tỷ lệ đúng hẹn theo tháng, cộng với hai ví dụ bạn báo hỏng sớm kèm nguyên văn tin nhắn bạn đã gửi và cách sự việc được xử lý. Trong phỏng vấn, khi được hỏi “kể về một lần bạn mắc lỗi”, thứ tạo khác biệt không phải lỗi đó là gì mà là khoảng thời gian từ lúc bạn biết đến lúc người liên quan biết — con số đó nói lên bạn là loại đồng nghiệp nào rõ hơn mọi tính từ trong CV.',
    references: [
      { label: 'Trusted Advisor (Charles H. Green) — nguồn về công thức niềm tin trong quan hệ nghề nghiệp', url: 'https://trustedadvisor.com/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 3 — Phân công trách nhiệm ─────────────────────────────────────
  guide({
    thesis:
      'Phân công tốt không phải là chia việc cho hết, mà là làm cho mỗi hạng mục có đúng một người mất ngủ vì nó. Khi hai người cùng chịu trách nhiệm, thực tế là không ai chịu; khi trách nhiệm được ghi mà quyền quyết định không được ghi, người nhận sẽ kẹt giữa việc phải chịu hậu quả mà không được chọn cách làm. Bảng phân công chỉ có giá trị khi nó nói được cả ba thứ: ai làm, ai quyết, ai phải được hỏi.',
    why: {
      work:
        'Phần lớn việc rơi giữa khe không phải vì ai đó lười, mà vì nó nằm ở vùng “chắc người kia làm”. Một bảng phân công rõ biến vùng xám đó thành các ô có tên, và đó là cách rẻ nhất để giảm số lần chữa cháy.',
      interview:
        'Ở vị trí quản lý hoặc trưởng nhóm, câu hỏi “bạn chia việc thế nào” là câu hỏi lọc: người trả lời bằng cảm giác và sự công bằng khác hẳn người mô tả được cách tách quyền quyết định ra khỏi việc thực thi.',
      study:
        'Đồ án nhóm ở trường hay chết ở chỗ không ai được quyền chốt: bốn người có bốn ý kiến về cấu trúc bài, và bài chỉ được ghép vào đêm cuối. Ghi rõ ai là người quyết cấu trúc từ tuần đầu giải quyết được phần lớn chuyện đó.',
      life:
        'Trong nhà, việc chăm người ốm hay lo đám giỗ thường dồn hết lên một người rồi sinh ra oán trách âm ỉ; nói rõ ai lo mảng nào và ai được quyết chi tiêu đến đâu làm cho sự bất công trở nên nhìn thấy được và sửa được.',
    },
    framework: [
      { name: 'Liệt kê theo sản phẩm giao được', detail: 'Ghi ra các vật cụ thể phải giao (bản báo giá, trang đích, danh sách khách mời), không ghi các hoạt động chung chung như “hỗ trợ marketing”. Chỉ vật giao được mới gán chủ được.' },
      { name: 'Một chủ sở hữu cho mỗi vật', detail: 'Mỗi dòng đúng một cái tên. Người này không phải người làm hết, mà là người chịu trách nhiệm cuối cùng việc đó về đích và là người bạn hỏi khi muốn biết trạng thái.' },
      { name: 'Tách quyền quyết khỏi việc thực thi', detail: 'Ghi rõ ai quyết khi có tranh cãi, ai bắt buộc phải được hỏi ý kiến trước, ai chỉ cần được thông báo. Đây là phần mà các mô hình như RACI hay DACI được lập ra để giải quyết, và cũng là phần hay bị bỏ nhất.' },
      { name: 'Xác nhận lại bằng lời người nhận', detail: 'Yêu cầu người nhận nói lại bằng ngôn ngữ của họ: họ sẽ giao gì, ngày nào, thế nào là xong. Bất đồng về phạm vi luôn lộ ra ở bước này, và lộ bây giờ thì rẻ.' },
      { name: 'Công khai và rà theo nhịp', detail: 'Đặt bảng ở chỗ ai cũng mở được, và soát lại mỗi khi có việc mới hoặc có người rời nhóm. Bảng phân công không cập nhật sau hai tháng sẽ nói dối bạn.' },
    ],
    scenario:
      'Một nhóm sinh viên năm ba làm đồ án hệ thống quản lý thư viện, năm người chia theo bốn chức năng và một người “làm chung”. Đến tuần thứ năm, phần báo cáo không ai viết vì ai cũng tưởng bạn “làm chung” lo, còn giao diện thì có hai bản do hai người tự quyết theo hai hướng. Nhóm dừng lại một buổi, viết bảng bảy dòng theo sản phẩm giao được: bốn module, một báo cáo, một bản thuyết trình, một bộ dữ liệu mẫu — mỗi dòng một tên; riêng dòng giao diện ghi thêm “người quyết: Trang, phải hỏi: Nam”. Bản ghép cuối kỳ chỉ mất một buổi thay vì ba đêm, và điểm phần trình bày là phần cao nhất của nhóm.',
    comparison: [
      { weak: 'Ghi phân công theo mảng chung chung: “Hùng lo phần kỹ thuật, Lan lo phần nội dung”.', mature: 'Ghi theo vật giao được kèm ngày: “Hùng: API tra cứu chạy trên môi trường thử, 12/9”, “Lan: bản thảo 5 trang giới thiệu, 10/9”.' },
      { weak: 'Khi hai người bất đồng thì đưa lên trưởng nhóm quyết từng lần một, mỗi lần mất nửa ngày.', mature: 'Ghi sẵn ai là người quyết ở từng loại tranh cãi, để bất đồng được giải trong cuộc trao đổi chứ không leo lên một cấp.' },
      { weak: 'Giao việc xong hỏi “ổn chứ?” và nhận cái gật đầu là coi như đã thống nhất.', mature: 'Đề nghị người nhận mô tả lại bằng lời của họ đầu ra và tiêu chí xong, rồi sửa ngay chỗ hai bên hiểu khác nhau.' },
    ],
    mistakes: [
      'Ghi hai hoặc ba cái tên vào cùng một hạng mục để thể hiện tinh thần tập thể, kết quả là trách nhiệm bị hoà tan và không ai thấy mình phải trả lời khi việc trễ.',
      'Giao trách nhiệm mà giữ lại quyền quyết định, khiến người nhận phải xin phép từng bước và cuối cùng chỉ làm đúng phần được chỉ định thay vì lo cho kết quả.',
      'Lập bảng phân công một lần đầu dự án rồi không bao giờ mở lại, nên khi phạm vi thay đổi hoặc có người nghỉ thì bảng trở thành tài liệu mô tả một dự án không còn tồn tại.',
    ],
    worksheet: [
      'Liệt kê 8 vật cụ thể nhóm bạn phải giao trong tháng này. Có bao nhiêu vật hiện chưa gắn được một cái tên duy nhất?',
      'Với hạng mục quan trọng nhất, ai là người quyết khi có hai ý kiến trái ngược? Người đó có biết mình đang giữ vai trò đó không?',
      'Việc nào trong nhóm đang rơi vào vùng “chắc người kia làm”? Viết ra và đặt tên chủ sở hữu ngay bây giờ.',
      'Lần gần nhất bạn giao việc, người nhận đã nói lại bằng lời của họ chưa? Nếu chưa, hôm nay hỏi lại họ và ghi chỗ khác biệt.',
      'Bảng phân công hiện tại của nhóm được cập nhật lần cuối khi nào, và có ai rời đi hoặc gia nhập từ đó tới nay?',
    ],
    exercises: [
      { label: 'Chuyển sang vật giao được', text: 'Lấy bản phân công hiện tại và viết lại mọi dòng thành vật cụ thể có thể cầm lên xem được. Đếm số dòng bạn không viết lại nổi — đó chính là những chỗ mơ hồ nhất.', level: 'e' },
      { label: 'Tìm dòng hai tên', text: 'Rà bảng phân công và khoanh mọi dòng có nhiều hơn một chủ sở hữu. Với mỗi dòng, hoặc tách làm hai dòng, hoặc chọn một người chịu trách nhiệm cuối và ghi người kia là người hỗ trợ.', level: 'e' },
      { label: 'Ba câu xác nhận', text: 'Lần giao việc tới, kết thúc bằng ba câu hỏi: bạn sẽ giao cái gì, ngày nào, thế nào là xong. Ghi lại nguyên văn câu trả lời và so với ý bạn định giao.', level: 'e' },
      { label: 'Bảng ba cột quyền', text: 'Với năm hạng mục lớn nhất, lập bảng: người làm, người quyết, người bắt buộc được hỏi. Gửi cho các bên và ghi lại mọi chỗ họ không đồng ý — đó là các xung đột bạn vừa phát hiện sớm.', level: 'm' },
      { label: 'Săn việc mồ côi', text: 'Đọc lại biên bản ba cuộc họp gần nhất, gạch chân mọi việc được nhắc đến mà không có tên người. Đưa hết vào bảng và gán chủ trong vòng 24 giờ.', level: 'm' },
      { label: 'Thử nghiệm trao quyền', text: 'Chọn một hạng mục bạn đang giữ quyền quyết. Chuyển quyền đó cho người đang làm trong hai tuần, ghi rõ giới hạn ngân sách hoặc phạm vi. Cuối hai tuần, ghi lại số lần họ hỏi bạn và chất lượng quyết định.', level: 'm' },
      { label: 'Phân công lại giữa dự án', text: 'Giả định người phụ trách hạng mục quan trọng nhất nghỉ đột xuất một tuần. Viết bản phân công thay thế trong 30 phút, rồi so với bảng hiện tại để tìm những chỗ chỉ một người biết cách làm.', level: 'h' },
      { label: 'Bảy ngày không việc mồ côi', text: 'Thử thách 7 ngày: mọi việc phát sinh phải có tên chủ trước khi kết thúc cuộc trao đổi tạo ra nó. Ngày 7, đếm số việc đã gán và số việc bạn phải quay lại gán muộn.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao ghi hai người cùng chịu trách nhiệm một hạng mục lại nguy hiểm hơn ghi một người có thể quá tải?',
        a: 'Vì trách nhiệm chia đôi tạo ra khoảng trống mà cả hai đều tin bên kia đang lấp. Người quá tải ít nhất còn phát tín hiệu để bạn kịp điều chỉnh, còn hạng mục hai chủ thường im lặng cho tới lúc trễ. Nếu cần hai người, hãy ghi một người chịu trách nhiệm cuối và một người hỗ trợ, chứ đừng ghi ngang hàng.',
      },
      {
        q: 'Bạn giao một việc, người nhận gật đầu, hai tuần sau kết quả khác hẳn mong đợi. Lỗi nằm ở bước nào của quy trình?',
        a: 'Ở bước xác nhận bằng lời người nhận. Cái gật đầu chỉ chứng minh họ nghe thấy, không chứng minh họ hiểu cùng một thứ. Cách chữa là bắt buộc người nhận diễn đạt lại đầu ra và tiêu chí xong bằng ngôn ngữ của chính họ — và khi họ nói khác bạn, sửa ngay tại chỗ chứ đừng cho qua vì ngại.',
      },
      {
        q: 'Người phụ trách một hạng mục liên tục hỏi ý kiến bạn trước mọi bước nhỏ. Vấn đề thường nằm ở đâu?',
        a: 'Ở chỗ bạn giao trách nhiệm nhưng chưa giao quyền quyết định, hoặc chưa nói rõ ranh giới quyền đó. Hãy viết ra cụ thể họ được tự quyết trong phạm vi nào (ngân sách bao nhiêu, ảnh hưởng tới ai) và chuyện gì bắt buộc phải hỏi. Khi ranh giới rõ, số lần hỏi giảm mạnh mà không cần bạn phải nhắc họ chủ động hơn.',
      },
    ],
    plan7:
      'Ngày 1: viết lại bảng phân công theo vật giao được, mỗi dòng một ngày hạn. Ngày 2: rà và xoá mọi dòng có nhiều hơn một chủ sở hữu. Ngày 3: lập bảng ba cột người làm / người quyết / người phải hỏi cho năm hạng mục lớn. Ngày 4: gửi bảng cho các bên và ghi lại mọi phản đối. Ngày 5: đọc biên bản ba cuộc họp gần nhất và gán chủ cho mọi việc mồ côi. Ngày 6: chọn một hạng mục để trao quyền quyết định kèm ranh giới viết rõ. Ngày 7: đưa bảng lên chỗ công khai và đặt lịch rà lại hai tuần một lần.',
    evidence:
      'Lưu bảng phân công ba cột ở phiên bản đầu và phiên bản sau khi các bên phản hồi, kèm một danh sách “việc mồ côi đã tìm ra” với ngày phát hiện. Đây là bằng chứng rất cụ thể cho vòng phỏng vấn vị trí trưởng nhóm hoặc quản lý dự án: bạn không kể rằng mình “tổ chức công việc tốt”, bạn đưa ra một hiện vật cho thấy bạn phát hiện được vùng xám trước khi nó thành sự cố, và cho thấy bạn dám tách quyền quyết định ra khỏi tay mình.',
    references: [
      { label: 'Asana Resources — hướng dẫn về vai trò, trách nhiệm và quản lý công việc nhóm', url: 'https://asana.com/resources', type: 'article' },
      { label: 'Project Management Institute (PMI) — chuẩn và tài liệu về vai trò trong dự án', url: 'https://www.pmi.org/', type: 'article' },
    ],
  }),

  // ── Chương 4 — Hợp tác liên phòng ban ────────────────────────────────────
  guide({
    thesis:
      'Khi bạn cần một phòng ban khác giúp, bạn không đang xin một ân huệ, bạn đang đề nghị họ dùng nguồn lực có hạn của họ cho một chỉ số không thuộc về họ. Hợp tác liên phòng ban thành công khi bạn dịch được đề nghị của mình sang ngôn ngữ chỉ số của phía bên kia, tìm đúng người thực sự quyết được, và biến thoả thuận thành một giao diện có ngày và có định nghĩa hoàn thành — chứ không phải một lời hứa trong hành lang.',
    why: {
      work:
        'Càng lên cao, tỷ lệ việc bạn tự làm được càng giảm và tỷ lệ việc phải qua phòng khác càng tăng. Người biết làm việc xuyên phòng ban gỡ được những nút mà người giỏi chuyên môn thuần tuý đứng chờ.',
      interview:
        'Nhà tuyển dụng hỏi “kể về lần bạn phải thuyết phục một bộ phận không chịu sự quản lý của bạn” để đo khả năng ảnh hưởng không quyền lực — kỹ năng bắt buộc ở mọi vị trí điều phối.',
      study:
        'Trong các dự án liên khoa hoặc câu lạc bộ phối hợp nhiều ban, ai hiểu được mối bận tâm riêng của từng bên sẽ ghép được lịch và nguồn lực, còn người chỉ nói về mục tiêu của mình sẽ bị hoãn vô thời hạn.',
      life:
        'Làm việc với ngân hàng, cơ quan hành chính hay nhà trường cũng là làm việc liên bộ phận: biết bộ phận nào giữ quyền quyết định thật và họ đang bị đo bằng gì giúp bạn rút ngắn hồ sơ từ nhiều tuần xuống vài ngày.',
    },
    framework: [
      { name: 'Đọc chỉ số của họ trước', detail: 'Trước khi đề nghị, tìm hiểu bộ phận kia đang bị đo bằng gì trong quý này. Một đề nghị làm họ tệ đi trên chỉ số của chính họ sẽ bị từ chối một cách rất lịch sự và rất vô thời hạn.' },
      { name: 'Tìm người quyết thật', detail: 'Người trả lời email nhanh nhất chưa chắc là người ký được. Hỏi thẳng: “để việc này được duyệt thì ai cần đồng ý?” Sai người là mất hai tuần mà không ai làm gì sai cả.' },
      { name: 'Đề nghị dạng chi phí — lợi ích của họ', detail: 'Nói rõ bạn xin bao nhiêu công, trong bao lâu, và họ được lại cái gì đo được. Nếu họ không được gì, hãy nói thật điều đó và đề nghị một khoản đổi lại ở việc khác.' },
      { name: 'Chốt giao diện, không chốt thiện chí', detail: 'Biến thoả thuận thành một thứ kiểm tra được: ai gửi gì, định dạng nào, hạn nào, ai nhận. Câu “bọn mình sẽ phối hợp chặt chẽ” không có ngày nên không bao giờ trễ và cũng không bao giờ xong.' },
      { name: 'Đóng vòng bằng phản hồi có ích cho họ', detail: 'Sau khi xong, gửi lại kết quả mà đóng góp của họ tạo ra, dưới dạng con số họ dùng được trong báo cáo của chính họ. Đây là thứ khiến lần sau bạn được ưu tiên.' },
    ],
    scenario:
      'Một chuyên viên kinh doanh của công ty phần mềm cần phòng kế toán rút thời gian xuất hoá đơn từ năm ngày xuống một ngày để chốt hợp đồng cuối quý. Yêu cầu gửi qua email hai tuần không ai trả lời. Anh đổi cách: gặp trưởng phòng kế toán, hỏi quý này phòng đang bị đo bằng gì, và biết họ đang bị khiển trách vì tỷ lệ hoá đơn phải điều chỉnh cao. Anh đề nghị: đội kinh doanh sẽ nộp kèm một bản kiểm thông tin khách hàng đã đối chiếu sẵn, đổi lại kế toán ưu tiên xử lý trong 24 giờ cho các hồ sơ có bản kiểm đó. Hai bên chốt mẫu bản kiểm, hạn nộp trước 15 giờ, và người nhận cụ thể. Sau một quý, tỷ lệ hoá đơn phải điều chỉnh giảm và cả hai phòng đều có số để báo cáo.',
    comparison: [
      { weak: 'Gửi yêu cầu qua email chung của phòng khác và chờ, rồi kết luận là họ không hợp tác.', mature: 'Xác định người quyết được, gặp trực tiếp một lần để hiểu ràng buộc của họ, rồi mới gửi văn bản chốt lại điều đã thống nhất.' },
      { weak: 'Trình bày đề nghị bằng lợi ích của dự án mình: “việc này rất quan trọng cho công ty”.', mature: 'Trình bày bằng chỉ số của phía kia: giảm bao nhiêu lần làm lại cho họ, hoặc thẳng thắn nói họ không được gì và đề nghị đổi lại việc khác.' },
      { weak: 'Khi bị từ chối thì leo thang lên sếp của họ ngay để tạo sức ép.', mature: 'Hỏi rõ lý do từ chối là do nguồn lực, ưu tiên hay rủi ro, rồi thu hẹp đề nghị xuống mức họ nhận được; chỉ leo thang khi hai bên đã bế tắc và cùng biết sẽ leo thang.' },
    ],
    mistakes: [
      'Giả định rằng bộ phận kia đang rảnh và chỉ thiếu thiện chí, trong khi thực tế họ đang có hàng đợi riêng mà bạn không nhìn thấy và một danh sách ưu tiên do sếp họ đặt.',
      'Chốt thoả thuận bằng lời trong hành lang rồi không gửi lại bản tóm tắt, nên một tháng sau hai bên nhớ hai phiên bản khác nhau và không ai sai.',
      'Chỉ liên hệ khi cần xin, không bao giờ quay lại báo kết quả, khiến mối quan hệ chỉ toàn giao dịch một chiều và lần sau bị xếp xuống cuối hàng đợi.',
    ],
    worksheet: [
      'Bộ phận nào bạn đang phụ thuộc nhiều nhất để hoàn thành việc của mình? Quý này họ đang bị đo bằng chỉ số gì — bạn biết chắc hay đang đoán?',
      'Với đề nghị hiện tại của bạn, phía kia mất bao nhiêu giờ công và được lại cái gì đo được? Nếu không được gì, bạn định đổi lại bằng gì?',
      'Ai là người thực sự ký được cho việc này? Bạn đã trao đổi trực tiếp với người đó lần nào chưa?',
      'Thoả thuận gần nhất giữa hai bộ phận đã được viết lại thành ai gửi gì, định dạng nào, hạn nào chưa? Nếu chưa, viết ba dòng đó ngay bây giờ.',
      'Lần gần nhất một phòng khác giúp bạn, bạn có gửi lại kết quả dưới dạng con số họ dùng được không? Nếu không, viết bản tóm tắt đó hôm nay.',
    ],
    exercises: [
      { label: 'Bản đồ chỉ số', text: 'Với ba bộ phận bạn hay làm việc cùng, viết ra chỉ số chính mà mỗi bên đang bị đo. Sau đó đi hỏi một người trong mỗi bộ phận để kiểm lại, và ghi những chỗ bạn đoán sai.', level: 'e' },
      { label: 'Câu hỏi ai ký', text: 'Với yêu cầu liên phòng ban gần nhất, hỏi thẳng người liên hệ: “để việc này được duyệt thì cần ai đồng ý, và thường mất bao lâu?” Ghi lại câu trả lời và so với giả định ban đầu của bạn.', level: 'e' },
      { label: 'Viết lại đề nghị', text: 'Lấy một email đề nghị bạn đã gửi và viết lại toàn bộ theo góc nhìn lợi ích và chi phí của phía nhận. Đọc to hai bản và chọn bản bạn sẽ đồng ý nếu ở phía bên kia.', level: 'e' },
      { label: 'Bản tóm tắt sau trao đổi', text: 'Sau mỗi cuộc trao đổi liên phòng ban trong hai tuần, gửi trong vòng một giờ một email năm dòng: đã thống nhất gì, ai làm gì, hạn nào, chỗ nào chưa chốt. Đếm số lần bên kia sửa lại nội dung — mỗi lần là một hiểu nhầm được chặn.', level: 'm' },
      { label: 'Thiết kế giao diện làm việc', text: 'Chọn một luồng công việc hay tắc giữa hai bộ phận và viết đặc tả giao diện: đầu vào gồm những trường nào, ai gửi, khi nào, phía nhận cam kết phản hồi trong bao lâu. Chạy thử hai tuần và đo thời gian chờ trước và sau.', level: 'm' },
      { label: 'Đổi việc lấy việc', text: 'Tìm một thứ nhỏ bạn có thể làm giúp bộ phận kia mà tốn ít công của bạn nhưng gỡ nhiều cho họ. Làm trước, không kèm điều kiện, rồi quan sát tốc độ phản hồi ở yêu cầu tiếp theo của bạn.', level: 'm' },
      { label: 'Gỡ một bế tắc thật', text: 'Chọn một yêu cầu đang bị treo trên một tháng. Gặp trực tiếp người quyết, hỏi lý do thật của việc treo, rồi đưa ra ba phương án có phạm vi nhỏ dần. Ghi lại phương án được chọn và lý do.', level: 'h' },
      { label: 'Bảy ngày đóng vòng', text: 'Thử thách 7 ngày: mỗi ngày gửi cho một người ở bộ phận khác một thông tin có ích cho chỉ số của họ mà bạn tình cờ có được. Ngày 7, ghi lại những thay đổi trong cách họ phản hồi bạn.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Một phòng ban trả lời “để chúng tôi sắp xếp” suốt ba tuần. Cách đọc đúng tín hiệu này là gì?',
        a: 'Đó gần như luôn có nghĩa là yêu cầu của bạn đang nằm dưới đáy danh sách ưu tiên của họ, chứ không phải họ đang xử lý. Đừng nhắc lại cùng một yêu cầu; hãy hỏi họ đang xếp việc này ở đâu trong hàng đợi và cần điều kiện gì để nó lên trên — thường là bạn phải thu hẹp phạm vi, đổi hạn, hoặc làm sẵn phần đầu vào cho họ.',
      },
      {
        q: 'Vì sao leo thang lên sếp của phòng khác lại thường phản tác dụng, dù nó có thể giải quyết được việc trước mắt?',
        a: 'Vì nó chuyển chi phí sang người bạn còn phải làm việc cùng lâu dài: họ bị sếp hỏi, mất uy tín, và lần sau sẽ xử lý bạn đúng theo quy trình chậm nhất mà không sai gì. Leo thang chỉ nên dùng khi hai bên đã cùng xác nhận là bế tắc và cùng biết trước rằng việc sẽ được đưa lên, chứ không dùng như một nước đi bất ngờ.',
      },
      {
        q: 'Bạn và một bộ phận khác đã thống nhất miệng, nhưng hai tháng sau mỗi bên nhớ một phiên bản. Nên rút ra điều gì?',
        a: 'Rằng thoả thuận không được viết lại thì không tồn tại, và đây là lỗi quy trình chứ không phải lỗi trung thực của ai. Cách chữa rất rẻ: gửi ngay sau cuộc trao đổi một bản tóm tắt năm dòng và đề nghị người kia sửa nếu sai. Bên kia im lặng cũng được coi là đồng ý, nhưng phải có văn bản để im lặng đó có nghĩa.',
      },
    ],
    plan7:
      'Ngày 1: viết bản đồ chỉ số của ba bộ phận bạn phụ thuộc nhiều nhất. Ngày 2: đi hỏi một người ở mỗi bộ phận để kiểm lại và sửa chỗ đoán sai. Ngày 3: xác định đúng người ký được cho yêu cầu đang treo lâu nhất. Ngày 4: viết lại đề nghị theo góc nhìn lợi ích và chi phí của họ. Ngày 5: gặp trực tiếp người quyết và đưa ba phương án phạm vi nhỏ dần. Ngày 6: gửi bản tóm tắt năm dòng chốt lại thoả thuận. Ngày 7: gửi cho một bộ phận từng giúp bạn một bản kết quả có con số họ dùng được.',
    evidence:
      'Xây một hồ sơ “giao diện liên phòng ban”: đặc tả luồng làm việc bạn đã thiết kế giữa hai bộ phận (đầu vào, người gửi, hạn phản hồi) kèm số đo thời gian chờ trước và sau khi áp dụng. Trong phỏng vấn cho vị trí điều phối, quản lý dự án hay vận hành, đây là câu trả lời có sức nặng cho “bạn ảnh hưởng thế nào tới người không thuộc quyền quản lý của mình”: bạn không nói mình khéo léo, bạn cho thấy mình đã đổi cấu trúc phối hợp và có con số chứng minh.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Collaboration', url: 'https://hbr.org/topic/subject/collaboration', type: 'article', needsReview: true },
      { label: 'Atlassian Agile — tài liệu về phối hợp giữa các nhóm và luồng công việc', url: 'https://www.atlassian.com/agile', type: 'article' },
    ],
  }),

  // ── Chương 5 — Tổ chức cuộc họp hiệu quả ─────────────────────────────────
  guide({
    thesis:
      'Một cuộc họp là khoản chi lớn nhất mà không ai ghi vào sổ: tám người ngồi một tiếng là tám giờ công. Cuộc họp chỉ xứng đáng khi nó làm được thứ mà một văn bản không làm được — tức là cần tranh luận trực tiếp hoặc cần chốt một quyết định có bất đồng. Mọi cuộc họp chỉ để cập nhật thông tin đều là một tài liệu bị đọc to lên với giá tám giờ công.',
    why: {
      work:
        'Người tổ chức được cuộc họp gọn sẽ lấy lại cho nhóm hàng chục giờ mỗi tháng, và quan trọng hơn là giữ được những khoảng thời gian dài không bị cắt vụn — thứ mà công việc cần suy nghĩ sâu bắt buộc phải có.',
      interview:
        'Khi bạn kể mình từng điều phối một cuộc họp có ba bên bất đồng và ra được quyết định trong 45 phút, người phỏng vấn nghe thấy năng lực điều phối; khi bạn kể mình “tham gia nhiều cuộc họp”, họ không nghe thấy gì.',
      study:
        'Buổi họp nhóm đồ án thường mất ba tiếng mà không ra kết luận vì không ai đặt câu hỏi cần quyết là gì; áp dụng đúng một quy tắc “cuộc họp phải có câu hỏi quyết định” cắt nó xuống còn một tiếng.',
      life:
        'Họp phụ huynh, họp tổ dân phố hay bàn việc gia đình cũng theo cùng cơ chế: khi không rõ ai quyết và quyết cái gì, cuộc gặp biến thành nơi mỗi người phát biểu quan điểm rồi ai về nhà nấy.',
    },
    framework: [
      { name: 'Viết câu hỏi cần quyết', detail: 'Trước khi đặt lịch, viết một câu hỏi mà cuối buổi phải có câu trả lời, dạng “chúng ta chọn A hay B cho X”. Nếu không viết nổi câu đó, việc này chưa cần họp.' },
      { name: 'Mời theo vai trò, không theo phép lịch sự', detail: 'Chỉ mời người quyết, người có dữ liệu và người sẽ thực thi. Người cần biết thì gửi biên bản. Mỗi cái tên thừa làm cuộc họp dài thêm và làm quyết định loãng đi.' },
      { name: 'Gửi tài liệu trước và đọc tại chỗ', detail: 'Gửi một trang bối cảnh trước, rồi dành 5-10 phút đầu buổi để mọi người đọc im lặng — cách này được Amazon mô tả công khai và có ưu điểm là không ai phải giả vờ đã đọc.' },
      { name: 'Điều phối theo thời gian và theo lượt', detail: 'Chia thời lượng cho từng mục và nói ra khi sắp hết giờ mục đó. Chủ động hỏi người chưa nói, và cắt vòng lặp bằng câu “ta đã nghe cả hai hướng, giờ chốt tiêu chí chọn”.' },
      { name: 'Kết bằng ai làm gì trước ngày nào', detail: 'Ba phút cuối đọc to danh sách hành động kèm tên và ngày, và gửi trong vòng một giờ. Cuộc họp không có danh sách này thì hôm sau không tồn tại.' },
    ],
    scenario:
      'Trưởng phòng nhân sự của một nhà máy 300 công nhân duy trì cuộc họp giao ban thứ Hai kéo dài 90 phút với 12 người dự. Chị đo thử trong bốn tuần và thấy 70% thời lượng là mỗi bộ phận đọc lại số liệu đã có trên bảng chung. Chị đổi: số liệu phải nhập vào bảng trước 8 giờ sáng thứ Hai, cuộc họp rút xuống 40 phút với 6 người và chỉ bàn những dòng lệch quá 10% so với kế hoạch, mỗi cuộc họp mở đầu bằng một câu hỏi cần quyết viết sẵn trong thư mời. Sau hai tháng, tổng thời gian họp giảm hơn một nửa, và số việc tồn đọng được xử lý ngay trong buổi tăng lên vì thời gian được dồn vào phần có bất đồng.',
    comparison: [
      { weak: 'Đặt lịch họp với tiêu đề chung chung như “trao đổi về dự án X”.', mature: 'Đặt tiêu đề là câu hỏi cần quyết: “Chọn nhà cung cấp A hay B cho X — quyết trong buổi này”.' },
      { weak: 'Mời rộng cho chắc, ai quan tâm thì dự, để không ai cảm thấy bị bỏ ra ngoài.', mature: 'Mời tối thiểu theo vai trò, ghi rõ trong thư mời ai bắt buộc và ai tuỳ chọn, rồi gửi biên bản cho tất cả những người còn lại.' },
      { weak: 'Kết thúc bằng câu “vậy nhé, mọi người triển khai nhé”.', mature: 'Kết thúc bằng việc đọc to từng hành động kèm tên người và ngày, và hỏi từng người có xác nhận không.' },
    ],
    mistakes: [
      'Dùng cuộc họp làm nơi cập nhật trạng thái, trong khi trạng thái là thứ nên nhìn thấy được mọi lúc trên một bảng chung mà không cần tập hợp người.',
      'Để cuộc họp trôi theo người nói to nhất, rồi kết luận theo ý người phát biểu cuối cùng, khiến người có dữ liệu nhưng ít nói không đóng góp được gì.',
      'Không gửi biên bản vì tin rằng ai dự cũng nhớ, nên hai tuần sau cả nhóm tranh cãi lại đúng vấn đề đã chốt mà không ai chứng minh được.',
    ],
    worksheet: [
      'Mở lịch tuần trước và cộng tổng số giờ công đã tiêu cho họp (số người × thời lượng). Con số đó có làm bạn ngạc nhiên không?',
      'Với cuộc họp định kỳ bạn hay dự nhất, câu hỏi cần quyết của nó là gì? Nếu không có, nó nên bị thay bằng cái gì?',
      'Trong cuộc họp gần nhất bạn chủ trì, ai là người không nói câu nào? Họ có mặt vì vai trò gì?',
      'Danh sách hành động của cuộc họp gần nhất được gửi sau bao lâu, và có bao nhiêu dòng ghi rõ tên người kèm ngày?',
      'Có cuộc họp định kỳ nào bạn có thể thử huỷ trong hai tuần để xem điều gì thực sự hỏng? Ghi tên nó ra.',
    ],
    exercises: [
      { label: 'Tính giá cuộc họp', text: 'Với ba cuộc họp định kỳ bạn dự, tính số giờ công mỗi tháng (số người × thời lượng × số lần). Viết con số đó vào ngay tiêu đề lịch để cả nhóm nhìn thấy.', level: 'e' },
      { label: 'Tiêu đề là câu hỏi', text: 'Đổi tiêu đề ba lời mời họp tiếp theo của bạn thành một câu hỏi cần quyết. Ghi lại cuộc nào bạn không viết nổi câu hỏi — đó là cuộc đáng huỷ.', level: 'e' },
      { label: 'Danh sách mời tối thiểu', text: 'Lấy danh sách mời của cuộc họp gần nhất và gạch tên từng người kèm lý do giữ lại: quyết, có dữ liệu, hay thực thi. Người không rơi vào ba nhóm đó chuyển sang nhận biên bản.', level: 'e' },
      { label: 'Đọc im lặng đầu buổi', text: 'Chuẩn bị một trang bối cảnh và dành 7 phút đầu buổi cho mọi người đọc im lặng thay vì trình bày. So chất lượng câu hỏi trong buổi đó với buổi trước.', level: 'm' },
      { label: 'Điều phối theo lượt', text: 'Trong một cuộc họp có bất đồng, chủ động gọi tên hai người chưa phát biểu và hỏi một câu cụ thể. Ghi lại thông tin mới xuất hiện nhờ hai câu hỏi đó.', level: 'm' },
      { label: 'Biên bản một giờ', text: 'Trong hai tuần, mọi cuộc họp bạn chủ trì đều có biên bản gửi trong vòng một giờ, gồm quyết định, hành động kèm tên và ngày, và mục còn treo. Đếm số lần có người sửa lại nội dung.', level: 'm' },
      { label: 'Huỷ thử một cuộc họp', text: 'Chọn một cuộc họp định kỳ và huỷ trong hai tuần, thay bằng một bản cập nhật viết. Ghi lại chính xác điều gì hỏng và điều gì không ai nhớ tới — rồi quyết định giữ, rút gọn hay bỏ hẳn.', level: 'h' },
      { label: 'Bảy ngày họp có quyết định', text: 'Thử thách 7 ngày: bạn chỉ nhận lời mời họp nào có câu hỏi cần quyết hoặc tài liệu gửi trước; với những lời mời khác, hỏi lịch sự người tổ chức về mục tiêu buổi họp. Ngày 7, thống kê tỷ lệ lời mời không trả lời được câu hỏi đó.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao cuộc họp cập nhật trạng thái hằng tuần lại thường là dạng lãng phí lớn nhất?',
        a: 'Vì thông tin trạng thái có tính một chiều và đọc được bất đồng bộ, nên nhân nó với số người dự là nhân chi phí lên nhiều lần mà không tạo thêm giá trị nào. Cách thay thế là để trạng thái hiển thị công khai và chỉ tập hợp người khi có dòng lệch cần bàn — tức là chuyển từ “báo cáo cho nhau nghe” sang “xử lý ngoại lệ”.',
      },
      {
        q: 'Cuộc họp của bạn luôn kéo dài quá giờ và không ra kết luận. Đâu là chỗ đáng sửa trước tiên?',
        a: 'Câu hỏi cần quyết. Không có nó thì không có tiêu chí để biết khi nào được phép dừng, nên mọi ý kiến đều hợp lệ và cuộc họp trôi vô hạn. Viết câu hỏi vào tiêu đề, tuyên bố ở đầu buổi, và khi tranh luận lặp lại thì kéo về đúng câu đó bằng cách hỏi: “thông tin này đổi câu trả lời của chúng ta thế nào?”',
      },
      {
        q: 'Bạn không phải người chủ trì nhưng thấy cuộc họp đang chạy lệch. Bạn làm được gì mà không giẫm chân người tổ chức?',
        a: 'Ba can thiệp nhẹ và hiệu quả: hỏi lại mục tiêu (“mình đang cần chốt gì trong buổi này?”), tóm tắt lại hai luồng ý kiến để lộ ra điểm khác biệt thật, và ở phút cuối đề nghị điểm danh hành động (“ai làm gì trước ngày nào?”). Cả ba đều là hành vi hỗ trợ chứ không phải giành quyền điều phối.',
      },
    ],
    plan7:
      'Ngày 1: tính giá bằng giờ công của mọi cuộc họp định kỳ bạn dự. Ngày 2: đổi tiêu đề mọi lời mời của bạn thành câu hỏi cần quyết. Ngày 3: rà lại danh sách mời và chuyển người chỉ cần biết sang nhận biên bản. Ngày 4: chuẩn bị một trang bối cảnh và thử đọc im lặng đầu buổi. Ngày 5: thực hành điều phối theo lượt, gọi tên hai người chưa nói. Ngày 6: gửi biên bản trong một giờ và đếm số lần bị sửa. Ngày 7: chọn một cuộc họp định kỳ để huỷ thử trong hai tuần tới.',
    evidence:
      'Giữ một bộ ba hiện vật cho một cuộc họp bạn đã cải tổ: thư mời cũ, thư mời mới có câu hỏi cần quyết và danh sách mời rút gọn, cùng bảng tính giờ công trước và sau. Đây là bằng chứng hiếm và rất dễ kiểm chứng trong phỏng vấn vị trí quản lý hoặc điều phối: nó cho thấy bạn nhìn thấy chi phí ẩn của tổ chức, dám cắt một nghi thức đã tồn tại lâu, và đo được kết quả bằng con số thay vì bằng cảm nhận.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Meeting Management', url: 'https://hbr.org/topic/subject/meeting-management', type: 'article', needsReview: true },
      { label: 'Asana Resources — hướng dẫn chuẩn bị chương trình họp và ghi hành động', url: 'https://asana.com/resources', type: 'article' },
    ],
  }),

  // ── Chương 6 — Cập nhật tiến độ ──────────────────────────────────────────
  guide({
    thesis:
      'Cập nhật tiến độ không phải là chứng minh mình đang bận, mà là giúp người nhận ra quyết định sớm hơn. Một bản cập nhật dùng được trả lời bốn câu trong ba mươi giây đọc: đang ở đâu so với kế hoạch, cái gì đang chặn, việc gì làm tiếp, và tôi cần gì từ bạn. Bản cập nhật liệt kê mọi việc đã làm mà không nói chênh lệch so với kế hoạch là một danh sách công, không phải một bản cập nhật.',
    why: {
      work:
        'Người quản lý phải phân bổ nguồn lực dựa trên thông tin bạn cung cấp; cập nhật rõ giúp họ can thiệp lúc còn kịp, và giúp bạn không bị hỏi dồn vào những lúc bạn đang tập trung nhất.',
      interview:
        'Ứng viên mô tả được nhịp báo cáo mình duy trì và ví dụ một lần báo rủi ro sớm cho thấy họ tự vận hành được, đây là tín hiệu quan trọng cho mọi vị trí làm việc từ xa hoặc ít giám sát.',
      study:
        'Khi làm luận văn hoặc đồ án dài, gửi cho giảng viên hướng dẫn một bản cập nhật ngắn theo nhịp cố định giúp bạn nhận phản hồi khi còn sửa được, thay vì bị chỉ ra sai hướng ở tuần cuối.',
      life:
        'Khi bạn sửa nhà, chăm sóc một người thân hay lo giấy tờ cho cả gia đình, một tin nhắn cập nhật ngắn theo tuần cho những người liên quan cắt được phần lớn các câu hỏi lo lắng và những lần hiểu nhầm.',
    },
    framework: [
      { name: 'Nêu trạng thái bằng một màu', detail: 'Mở đầu bằng một từ: đúng hạn, có rủi ro, hoặc trễ. Người bận đọc từ đó rồi mới quyết định đọc tiếp hay không; giấu kết luận ở cuối là bắt họ tự đi tìm.' },
      { name: 'Nói chênh lệch, không nói khối lượng', detail: 'So với kế hoạch, bạn đang sớm hay muộn bao nhiêu ngày và ở hạng mục nào. Danh sách mười việc đã làm không cho biết bạn còn cách đích bao xa.' },
      { name: 'Gọi tên vật cản kèm chủ sở hữu', detail: 'Mỗi vật cản phải có tên người có thể gỡ và ngày cần gỡ trước. Câu “đang chờ bên kia” không phải một vật cản, nó là một lời than.' },
      { name: 'Nêu việc tiếp theo có thể kiểm chứng', detail: 'Ghi hai đến ba việc sẽ xong trước kỳ cập nhật sau, đủ cụ thể để lần sau người đọc tự đối chiếu được. Đây cũng là cách bạn tự tạo cam kết ngắn hạn cho mình.' },
      { name: 'Kết bằng điều bạn cần', detail: 'Nói rõ bạn cần quyết định gì, cần ai duyệt, cần thêm nguồn lực nào. Bản cập nhật không có yêu cầu cụ thể sẽ nhận lại một câu “ok, cảm ơn” và không thay đổi gì.' },
    ],
    scenario:
      'Một freelancer thiết kế nhận làm bộ nhận diện cho quán cà phê trong sáu tuần. Ba tuần đầu chị chỉ nhắn “em vẫn đang làm ạ”, và khách bắt đầu nhắn hỏi mỗi hai ngày vì lo. Chị đổi sang gửi cập nhật cố định chiều thứ Sáu theo năm dòng: trạng thái, chênh lệch so với lịch, vật cản, việc tuần tới, và điều cần khách quyết. Tuần thứ tư dòng “cần khách quyết” ghi rõ: chọn một trong hai hướng màu trước thứ Ba, nếu sau thứ Ba thì lịch giao lùi ba ngày. Khách trả lời trong ngày. Số tin nhắn hỏi thăm giảm gần hết, và khi dự án phát sinh thêm hạng mục, việc gia hạn được chấp nhận không tranh cãi vì mọi mốc đều đã có văn bản.',
    comparison: [
      { weak: 'Cập nhật bằng danh sách dài mọi việc đã làm trong tuần, xếp theo thứ tự thời gian.', mature: 'Cập nhật bằng vị trí hiện tại so với kế hoạch, chỉ nêu những việc làm đổi vị trí đó hoặc đổi rủi ro.' },
      { weak: 'Chỉ báo cáo khi có kết quả đẹp, im lặng trong những tuần vướng mắc.', mature: 'Giữ nhịp cố định bất kể tin tốt hay xấu, vì chính sự đều đặn mới làm cho tin xấu được tin và được xử lý.' },
      { weak: 'Viết “đang chờ phòng IT” rồi để đó, coi như trách nhiệm đã chuyển sang người khác.', mature: 'Ghi rõ chờ ai, chờ cái gì, đã nhắc lần nào, và nếu không có trước ngày nào thì hậu quả là gì.' },
    ],
    mistakes: [
      'Dùng phần trăm hoàn thành tự ước lượng làm thước đo, khiến một hạng mục nằm ở mức 90% suốt ba tuần mà không ai phát hiện ra là nó đang tắc.',
      'Chỉ báo tin xấu khi đã hết đường lùi, vì sợ bị đánh giá, làm mất luôn khoảng thời gian mà người khác còn có thể giúp được.',
      'Viết cập nhật cho chính mình xem: dày đặc thuật ngữ nội bộ và chi tiết kỹ thuật, nên người nhận không rút ra được quyết định nào và dần bỏ đọc.',
    ],
    worksheet: [
      'Bản cập nhật gần nhất của bạn: người đọc mất bao lâu để biết dự án đang đúng hạn hay trễ? Thông tin đó nằm ở dòng thứ mấy?',
      'Hiện có vật cản nào bạn đang ghi là “đang chờ” mà chưa gắn tên người và ngày? Gắn ngay bây giờ.',
      'Bạn đang đo tiến độ bằng gì — phần trăm tự ước lượng hay số hạng mục đã giao xong? Nếu là phần trăm, thay bằng gì được?',
      'Trong bản cập nhật gần nhất, bạn có nêu điều mình cần từ người đọc không? Nếu không, họ đã có thể giúp bạn việc gì?',
      'Nhịp cập nhật của bạn là gì (thứ mấy, mấy giờ)? Nếu chưa cố định, chọn ngay một khung giờ và đặt lịch nhắc.',
    ],
    exercises: [
      { label: 'Viết lại theo năm dòng', text: 'Lấy bản cập nhật gần nhất và viết lại đúng năm dòng: trạng thái, chênh lệch, vật cản, việc tiếp, điều cần. Đưa cả hai bản cho một người đọc và hỏi bản nào giúp họ quyết nhanh hơn.', level: 'e' },
      { label: 'Một từ mở đầu', text: 'Trong hai tuần, mọi bản cập nhật của bạn mở đầu bằng đúng một từ: đúng hạn / có rủi ro / trễ. Ghi lại phản ứng của người nhận ở lần đầu bạn dùng từ “trễ”.', level: 'e' },
      { label: 'Gắn tên cho vật cản', text: 'Liệt kê mọi thứ bạn đang chờ và với mỗi thứ ghi: chờ ai, chờ cái gì, hạn cần, đã nhắc mấy lần. Gửi danh sách này kèm bản cập nhật tuần.', level: 'e' },
      { label: 'Bỏ phần trăm', text: 'Thay chỉ số phần trăm bằng danh sách hạng mục có trạng thái nhị phân xong / chưa xong. Theo dõi hai tuần và ghi lại những hạng mục trước đây bị kẹt ở mức 90%.', level: 'm' },
      { label: 'Nhịp cố định', text: 'Chọn một khung giờ cố định hằng tuần và gửi cập nhật đúng giờ đó bốn tuần liên tiếp, kể cả tuần không có tiến triển. Ghi lại số câu hỏi hỏi thăm bạn nhận được mỗi tuần.', level: 'm' },
      { label: 'Cập nhật cho hai đối tượng', text: 'Viết hai phiên bản cho cùng một tuần: một cho người quản lý trực tiếp, một cho khách hàng hoặc lãnh đạo cấp trên. Đánh dấu những thông tin xuất hiện ở bản này mà không cần ở bản kia, và giải thích vì sao.', level: 'm' },
      { label: 'Báo rủi ro sớm', text: 'Chọn một rủi ro bạn đang thấy nhưng chưa nói ra. Viết một bản báo ngắn gồm: rủi ro là gì, xác suất theo cảm nhận của bạn, ảnh hưởng, và hai phương án. Gửi đi và ghi lại điều xảy ra sau đó.', level: 'h' },
      { label: 'Bảy ngày minh bạch tiến độ', text: 'Thử thách 7 ngày: mỗi cuối ngày ghi công khai ba dòng — hôm nay đổi gì so với kế hoạch, gì đang chặn, mai làm gì. Ngày 7, đọc lại bảy ngày và tìm mẫu chung ở những việc bạn hay ước lượng thiếu.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao “hoàn thành 90%” là một con số nguy hiểm trong báo cáo tiến độ?',
        a: 'Vì nó là ước lượng chủ quan về phần đã làm chứ không phải bằng chứng về phần còn lại, và phần cuối cùng thường chứa những việc khó nhất: tích hợp, sửa lỗi, chờ duyệt. Cách chữa là chuyển sang các hạng mục nhỏ có trạng thái nhị phân — hoặc xong và giao được, hoặc chưa — để tiến độ không thể tự phồng lên bằng cảm giác.',
      },
      {
        q: 'Bạn sợ rằng báo “trễ” sớm sẽ khiến sếp đánh giá thấp năng lực. Nên cân nhắc thế nào?',
        a: 'Hãy so hai kịch bản. Báo sớm: người khác còn dư địa để đổi phạm vi, thêm người hoặc dời hạn, và bạn được ghi nhận là người kiểm soát được tình hình. Báo muộn: không còn phương án nào ngoài chịu hậu quả, và điều bị đánh giá không còn là việc trễ mà là việc bạn đã biết mà không nói. Về dài hạn, độ tin cậy của kênh báo cáo có giá trị cao hơn một tuần đẹp trong mắt người khác.',
      },
      {
        q: 'Bản cập nhật của bạn đầy đủ nhưng không ai phản hồi, và cũng không có gì thay đổi. Nên sửa ở đâu?',
        a: 'Ở phần cuối: bạn chưa yêu cầu gì cụ thể. Bản cập nhật thuần mô tả không tạo ra nghĩa vụ cho người đọc. Thêm một dòng dạng “tôi cần anh/chị quyết X trước ngày Y, nếu sau ngày đó thì hệ quả là Z” — nêu rõ quyết định, người quyết, hạn và hậu quả của việc không quyết.',
      },
    ],
    plan7:
      'Ngày 1: viết lại bản cập nhật gần nhất theo cấu trúc năm dòng. Ngày 2: lập danh sách vật cản có tên người và hạn cho từng mục. Ngày 3: thay mọi con số phần trăm bằng hạng mục nhị phân xong / chưa xong. Ngày 4: chọn khung giờ cố định hằng tuần và đặt lịch nhắc. Ngày 5: viết hai phiên bản cập nhật cho hai đối tượng khác nhau. Ngày 6: chọn một rủi ro đang giấu và báo sớm kèm hai phương án. Ngày 7: đọc lại cả tuần, đếm số câu hỏi hỏi thăm nhận được và so với tuần trước.',
    evidence:
      'Lưu một chuỗi tám bản cập nhật liên tiếp của cùng một dự án, trong đó có ít nhất một bản mở đầu bằng “có rủi ro” và một bản báo trễ kèm phương án. Chuỗi đó chứng minh hai thứ mà lời nói không chứng minh được: bạn duy trì được nhịp mà không cần ai nhắc, và bạn báo tin xấu đúng lúc còn xử lý được. Với các vị trí làm từ xa hoặc freelance, đây gần như là bằng chứng năng lực quan trọng nhất sau chính sản phẩm.',
    references: [
      { label: 'Scrum.org — tài liệu về nhịp làm việc, minh bạch và kiểm tra tiến độ', url: 'https://www.scrum.org/', type: 'article' },
      { label: 'Project Management Institute (PMI) — tài liệu về báo cáo trạng thái dự án', url: 'https://www.pmi.org/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 7 — Cho và nhận phản hồi — Feedback ───────────────────────────
  guide({
    thesis:
      'Phản hồi hữu ích là mô tả một hành vi quan sát được và tác động của nó, đủ cụ thể để người nghe biết lần sau làm khác đi thế nào. Mọi câu bắt đầu bằng “em hơi thiếu chủ động” đều là một nhãn dán chứ không phải phản hồi: nó không nói được người ta đã làm gì, ở đâu, và điều gì đã xảy ra sau đó. Phần khó hơn nằm ở chiều ngược lại — nhận phản hồi mà không bật chế độ phòng thủ là một kỹ năng phải luyện riêng.',
    why: {
      work:
        'Không có phản hồi thì người ta lặp lại cùng một lỗi hàng năm trời và chỉ biết khi bị đánh giá thấp; một câu phản hồi cụ thể đúng lúc rẻ hơn nhiều so với một kỳ đánh giá gay gắt cuối năm.',
      interview:
        'Câu hỏi “kể về một lần bạn nhận phản hồi tiêu cực” đo khả năng tự điều chỉnh: người kể được nguyên văn lời phê bình, việc mình đã đổi và kết quả sau đó tạo ấn tượng mạnh hơn hẳn một câu trả lời khiêm tốn chung chung.',
      study:
        'Người học tiến nhanh nhất không phải người luyện nhiều nhất mà là người có vòng phản hồi ngắn nhất; biết cách xin phản hồi cụ thể từ thầy cô hoặc người đi trước rút ngắn hàng tháng dò dẫm.',
      life:
        'Trong quan hệ gia đình và bạn bè, thay lời trách chung chung bằng mô tả hành vi và tác động là khác biệt giữa một cuộc nói chuyện đổi được điều gì đó và một cuộc cãi vã lặp lại lần thứ mười.',
    },
    framework: [
      { name: 'Xin phép và chọn thời điểm', detail: 'Hỏi một câu ngắn: “Em có vài quan sát về buổi họp sáng nay, giờ nói tiện không?” Người đang bị dồn việc hoặc vừa bị phê bình sẽ không nghe được gì, và bạn mất luôn cơ hội.' },
      { name: 'Nêu tình huống cụ thể', detail: 'Chỉ đúng lúc và đúng chỗ: buổi họp nào, email nào, ngày nào. Tình huống mơ hồ khiến người nghe dành toàn bộ năng lượng để đoán bạn đang nói về lần nào.' },
      { name: 'Mô tả hành vi, không gán nhãn', detail: 'Nói “anh ngắt lời Lan ba lần trong 20 phút” thay vì “anh áp đặt”. Hành vi thì kiểm chứng được và sửa được; nhãn tính cách thì chỉ mời gọi tranh cãi. Đây chính là hai chữ đầu của mô hình SBI mà Center for Creative Leadership phổ biến.' },
      { name: 'Nêu tác động thật', detail: 'Nói điều đã xảy ra sau đó: ai im lặng, việc gì phải làm lại, khách phản ứng ra sao. Tác động là phần cho người nghe lý do để thay đổi, và cũng là phần bạn phải trung thực nhất.' },
      { name: 'Chốt một thay đổi và hẹn rà lại', detail: 'Kết thúc bằng một điều chỉnh duy nhất, cụ thể, có thể quan sát trong hai tuần, và hẹn lúc nào cùng nhìn lại. Phản hồi không có điểm hẹn rà lại sẽ tan sau ba ngày.' },
    ],
    scenario:
      'Một giáo viên chủ nhiệm trẻ nhận xét học sinh trong sổ liên lạc bằng những câu như “cần cố gắng hơn”, và phụ huynh không biết phải làm gì. Cô đổi cách: với mỗi học sinh, cô ghi đúng một tình huống có thật trong tuần, hành vi quan sát được và hệ quả — ví dụ “Thứ Ba, em nộp bài tập toán sau hai ngày, nên không kịp được chữa cùng lớp; đề nghị tuần này nộp trước sáng thứ Hai và cô sẽ chữa riêng nếu vướng”. Số phụ huynh nhắn hỏi lại giảm rõ rệt, và điều bất ngờ là chính học sinh bắt đầu tự nhắc nhau về hạn nộp, vì lần đầu tiên yêu cầu được nói bằng một hành vi cụ thể chứ không phải một lời chê chung.',
    comparison: [
      { weak: 'Gói lời chê giữa hai lời khen cho dễ nghe, khiến người nghe chỉ nhớ hai lời khen.', mature: 'Nói thẳng vào quan sát và tác động, giữ giọng bình thản, và tách lời khen ra một dịp khác để nó không bị dùng làm lớp bọc.' },
      { weak: 'Gom hết mọi điều chưa hài lòng suốt sáu tháng để nói một lần trong kỳ đánh giá.', mature: 'Nói từng việc trong vòng vài ngày kể từ lúc quan sát, để người nghe còn nhớ tình huống và còn sửa được.' },
      { weak: 'Khi nhận phản hồi thì lập tức giải thích hoàn cảnh và lý do mình đã làm vậy.', mature: 'Nghe hết, hỏi thêm một ví dụ cụ thể, tóm tắt lại điều mình vừa nghe, rồi mới xin thời gian để nghĩ và trả lời sau.' },
    ],
    mistakes: [
      'Phản hồi về con người thay vì về hành vi, khiến người nghe phải bảo vệ danh tính của mình và không còn khả năng bàn về việc cần sửa.',
      'Cho rằng im lặng là tử tế, nên để một đồng nghiệp lặp lại cùng một lỗi trước khách hàng suốt nhiều tháng rồi mới nói khi đã thành hồ sơ kỷ luật.',
      'Khi nhận phản hồi thì đánh giá người nói trước khi đánh giá nội dung — nghĩ “người này có tư cách gì” — và bỏ mất phần đúng nằm trong một lời góp ý vụng về.',
    ],
    worksheet: [
      'Nhớ lại lời góp ý gần nhất bạn đưa ra: bạn đã nêu tình huống cụ thể hay nói chung chung? Viết lại nó theo dạng tình huống — hành vi — tác động.',
      'Có điều gì bạn đang khó chịu với một đồng nghiệp mà chưa nói suốt trên một tháng không? Vì sao chưa nói, và cái giá của việc để thêm một tháng nữa là gì?',
      'Lần gần nhất bạn nhận phản hồi khó nghe, phản ứng đầu tiên trong đầu bạn là gì? Bạn có nói ra phản ứng đó không?',
      'Viết ra một câu hỏi cụ thể bạn sẽ dùng để xin phản hồi trong tuần này (không dùng câu “anh thấy em làm thế nào ạ”).',
      'Người nào ở nơi làm việc nói thật với bạn nhất? Lần cuối bạn chủ động hỏi ý kiến họ là khi nào?',
    ],
    exercises: [
      { label: 'Bóc nhãn', text: 'Lấy năm nhận xét bạn từng nói hoặc nghe dạng nhãn dán (chủ động, cẩu thả, thiếu trách nhiệm). Với mỗi cái, viết ra hành vi quan sát được nào đã dẫn tới nhãn đó.', level: 'e' },
      { label: 'Xin phản hồi hẹp', text: 'Thay câu hỏi chung bằng một câu hẹp: “trong bản đề xuất em gửi hôm qua, phần nào anh thấy khó theo dõi nhất?” Dùng ba lần trong tuần và so chất lượng câu trả lời với cách hỏi cũ.', level: 'e' },
      { label: 'Câu xin phép', text: 'Chuẩn bị sẵn một câu mở đầu để xin phép trước khi góp ý và dùng đủ ba lần trong tuần. Ghi lại phản ứng khác biệt so với những lần bạn vào thẳng vấn đề.', level: 'e' },
      { label: 'Ba phần đầy đủ', text: 'Viết ra giấy ba phản hồi bạn định nói, mỗi cái đủ tình huống, hành vi, tác động. Đọc to và cắt mọi tính từ đánh giá con người khỏi bản viết trước khi nói.', level: 'm' },
      { label: 'Dừng ba giây', text: 'Trong hai tuần, mỗi lần nhận phản hồi hãy đếm thầm tới ba trước khi mở miệng, và câu đầu tiên phải là một câu hỏi làm rõ chứ không phải một câu giải thích. Ghi lại số lần bạn suýt phản xạ tự vệ.', level: 'm' },
      { label: 'Đóng vòng sau hai tuần', text: 'Với một phản hồi bạn đã đưa, hẹn gặp lại sau hai tuần chỉ để cùng nhìn lại hành vi đó đã đổi chưa. Ghi lại điều bạn học được về cách mình diễn đạt lần đầu.', level: 'm' },
      { label: 'Phản hồi lên trên', text: 'Chuẩn bị và đưa một phản hồi cho người quản lý của bạn theo đúng cấu trúc tình huống — hành vi — tác động, kèm một đề nghị cụ thể. Ghi lại cách bạn chọn thời điểm và kết quả.', level: 'h' },
      { label: 'Bảy ngày xin và nhận', text: 'Thử thách 7 ngày: mỗi ngày xin đúng một phản hồi hẹp từ một người khác nhau và ghi lại nguyên văn. Ngày 7, tìm điểm chung xuất hiện từ hai người trở lên — đó là thứ đáng sửa trước tiên.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao cách kẹp lời chê giữa hai lời khen lại thường phản tác dụng?',
        a: 'Vì nó làm loãng thông điệp và làm hỏng giá trị của lời khen. Người nghe hoặc chỉ nhớ hai lời khen và không nhận ra có vấn đề, hoặc học được rằng mọi lời khen của bạn đều là dấu hiệu sắp có lời chê. Cách tốt hơn là tách bạch: khen khi có lý do khen, và khi cần góp ý thì đi thẳng vào tình huống, hành vi, tác động với giọng bình thản.',
      },
      {
        q: 'Người nhận phản hồi lập tức giải thích hoàn cảnh. Bạn nên phản ứng thế nào?',
        a: 'Đừng tranh cãi về hoàn cảnh, vì thường hoàn cảnh họ nêu là có thật. Hãy công nhận nó rồi kéo về tác động: “Anh hiểu hôm đó em bị dồn ba việc. Nhưng khách vẫn phải chờ thêm hai ngày và họ đã gọi cho sếp. Vậy lần sau khi bị dồn như thế, em báo cho ai và báo lúc nào?” Cách này giữ được sự tôn trọng mà không đánh mất điều cần thay đổi.',
      },
      {
        q: 'Bạn nhận một lời góp ý mà bạn tin là sai. Xử lý thế nào cho có ích?',
        a: 'Tách hai câu hỏi: nội dung có đúng không, và vì sao người ta lại nhìn thấy như vậy. Kể cả khi nội dung sai, việc họ nhìn thấy như vậy vẫn là dữ liệu thật về ấn tượng bạn tạo ra. Hãy hỏi thêm hai ví dụ cụ thể; nếu không có ví dụ nào, bạn có thể ghi nhận rồi bỏ qua. Nếu có ví dụ, phần cần sửa có thể không phải hành vi mà là cách bạn thông tin về hành vi đó.',
      },
    ],
    plan7:
      'Ngày 1: viết lại năm nhãn dán thành hành vi quan sát được. Ngày 2: chuẩn bị câu xin phép và dùng lần đầu. Ngày 3: đưa một phản hồi đủ ba phần tình huống — hành vi — tác động. Ngày 4: luyện dừng ba giây và hỏi làm rõ khi nhận phản hồi. Ngày 5: xin ba phản hồi hẹp từ ba người khác nhau. Ngày 6: chuẩn bị và đưa một phản hồi lên cấp trên. Ngày 7: đối chiếu các phản hồi nhận được trong tuần, tìm điểm trùng và chọn một hành vi để đổi trong hai tuần tới.',
    evidence:
      'Duy trì một sổ phản hồi hai chiều: cột trái ghi nguyên văn phản hồi bạn nhận kèm ngày và người nói, cột phải ghi việc bạn đã đổi và bằng chứng đổi được (kết quả, nhận xét sau đó). Khi phỏng vấn hỏi “bạn xử lý phê bình thế nào”, mở đúng sổ này ra và kể một dòng có đủ ba phần: lời phê bình gốc, thay đổi cụ thể, kết quả đo được. Một mục lục như vậy khó làm giả và nói lên nhiều hơn bất kỳ tính từ tự mô tả nào.',
    references: [
      { label: 'Center for Creative Leadership — tài liệu về mô hình phản hồi SBI', url: 'https://www.ccl.org/', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Giving Feedback', url: 'https://hbr.org/topic/subject/giving-feedback', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 8 — Xử lý mâu thuẫn ───────────────────────────────────────────
  guide({
    thesis:
      'Mâu thuẫn trong công việc gần như luôn là mâu thuẫn về nguồn lực, ưu tiên hoặc thông tin, chứ hiếm khi là mâu thuẫn về nhân cách — nhưng nếu để lâu, nó sẽ biến thành mâu thuẫn cá nhân và lúc đó khó gỡ hơn nhiều. Kỹ năng ở đây không phải là dàn hoà cho êm, mà là bóc được lợi ích thật nằm dưới lập trường của mỗi bên, rồi biến bất đồng thành một thử nghiệm có ngày rà lại. Với những việc nghiêm trọng như quấy rối, đe doạ hay phân biệt đối xử, đây không còn là kỹ năng giao tiếp: hãy đưa lên quản lý hoặc bộ phận nhân sự và tìm hỗ trợ chuyên môn phù hợp.',
    why: {
      work:
        'Mâu thuẫn không xử lý sẽ chuyển thành chi phí ẩn: thông tin ngừng chảy giữa hai người, mọi việc phải đi vòng, và cuối cùng một trong hai nghỉ việc vì một lý do được ghi khác trong đơn.',
      interview:
        'Câu hỏi “kể về một xung đột với đồng nghiệp” là câu hỏi loại: người kể được lợi ích của phía bên kia bằng ngôn ngữ công bằng cho thấy họ xử lý được va chạm, còn người mô tả đối phương như kẻ vô lý cho thấy họ sẽ mang xung đột đó sang chỗ mới.',
      study:
        'Trong nhóm học, xung đột thường nổ ra ở tuần cuối vì cách đánh giá đóng góp; nói ra tiêu chí chia việc và cách xử lý khi có người không nộp từ tuần đầu là cách phòng ngừa rẻ nhất.',
      life:
        'Bất đồng về tiền bạc, thời gian và cách nuôi dạy con trong gia đình cũng theo cùng cấu trúc: hai lập trường trái ngược thường che giấu hai nỗi lo khác nhau, và chỉ khi gọi tên được hai nỗi lo đó mới có phương án thứ ba.',
    },
    framework: [
      { name: 'Hạ nhiệt trước khi bàn nội dung', detail: 'Khi giọng đã lên cao thì mọi lý lẽ đều bị nghe như tấn công. Hoãn lại vài giờ, đổi kênh (từ tin nhắn sang gặp trực tiếp), và mở đầu bằng việc công nhận cảm giác của bên kia trước khi tranh luận đúng sai.' },
      { name: 'Tách người khỏi vấn đề', detail: 'Đặt vấn đề lên bàn và hai người ngồi cùng phía nhìn vào nó. Cách nói đổi từ “anh làm hỏng lịch” sang “lịch đang lệch hai tuần, mình xử lý sao” — đây là nguyên tắc trung tâm của phương pháp đàm phán do Fisher và Ury trình bày.' },
      { name: 'Đào lợi ích dưới lập trường', detail: 'Hỏi “vì sao điều đó quan trọng với anh” cho tới khi chạm được nỗi lo thật: sợ trễ báo cáo với sếp, sợ bị đổ lỗi, sợ mất khách. Hai lập trường có thể loại trừ nhau, nhưng hai lợi ích thì thường không.' },
      { name: 'Sinh nhiều phương án trước khi chọn', detail: 'Bắt buộc liệt kê ít nhất ba phương án, kể cả phương án dở, trước khi bàn chọn cái nào. Bàn luôn phương án đầu tiên là cách nhanh nhất để biến cuộc trao đổi thành cuộc tranh thắng thua.' },
      { name: 'Chốt thử nghiệm có ngày rà', detail: 'Thay vì tìm giải pháp vĩnh viễn, chốt một cách làm thử trong hai đến bốn tuần kèm tiêu chí đánh giá. Chữ “thử” hạ được rào cản tâm lý cho cả hai bên vì không ai phải thừa nhận mình sai ngay lúc đó.' },
    ],
    scenario:
      'Ở một công ty giao vận, bộ phận điều phối và bộ phận kho cãi nhau kéo dài về việc đơn hàng chậm. Điều phối nói kho đóng gói chậm; kho nói điều phối dồn đơn vào cuối giờ. Người quản lý vận hành mời cả hai ngồi lại, không hỏi ai sai, mà hỏi mỗi bên: điều gì làm ngày của anh trở nên tệ. Kho nói họ sợ bị phạt vì đơn tồn qua đêm; điều phối nói họ bị khách gọi thẳng nên phải nhận đơn muộn. Hai nỗi lo đó không loại trừ nhau. Nhóm chốt thử ba tuần: điều phối khoá nhận đơn thường lúc 16 giờ và mở một luồng riêng cho đơn gấp có ghi rõ số lượng tối đa mỗi ngày; kho cam kết luồng gấp xong trong 90 phút. Sau ba tuần, số đơn tồn qua đêm giảm và hai bên tiếp tục giữ cách làm đó — nhưng điều quan trọng hơn là họ đã có một quy trình để bàn tiếp lần sau.',
    comparison: [
      { weak: 'Tránh né và hy vọng thời gian sẽ làm nguôi, trong khi vẫn tiếp tục làm việc chung mỗi ngày.', mature: 'Hẹn một cuộc trao đổi riêng trong vòng vài ngày, khi cả hai đã hạ nhiệt nhưng sự việc còn nhớ rõ chi tiết.' },
      { weak: 'Tranh luận ai đúng ai sai về chuyện đã xảy ra tuần trước.', mature: 'Chuyển câu hỏi sang tương lai: lần tới gặp tình huống này thì hai bên làm gì khác đi, và ai báo cho ai lúc nào.' },
      { weak: 'Nhượng bộ toàn bộ cho xong chuyện rồi âm thầm giảm hợp tác ở những việc khác.', mature: 'Nói rõ giới hạn mình chấp nhận được, đề nghị một phương án đổi lại, và nếu vẫn không xong thì đưa lên cấp trên một cách công khai chứ không trả đũa ngầm.' },
    ],
    mistakes: [
      'Chẩn đoán tính cách đối phương — cho rằng họ tự ái, ái kỷ hay lười — thay vì mô tả hành vi và tìm ràng buộc đang tạo ra hành vi đó, khiến cuộc trao đổi thành cuộc kết tội.',
      'Xử lý mâu thuẫn qua tin nhắn hoặc email dài, nơi giọng điệu bị hiểu sai và mỗi bên có thời gian soạn ra một bản luận tội hoàn chỉnh.',
      'Kéo người thứ ba vào để tìm đồng minh trước khi nói chuyện trực tiếp với người trong cuộc, biến một bất đồng hai người thành một cuộc chia phe cả nhóm.',
    ],
    worksheet: [
      'Mâu thuẫn hiện tại của bạn: viết lập trường của bên kia bằng một câu, rồi viết lợi ích có thể nằm dưới lập trường đó bằng một câu khác.',
      'Nếu người ngoài nhìn vào, họ sẽ mô tả vấn đề này là tranh chấp về nguồn lực, về ưu tiên, hay về thông tin? Bằng chứng nào cho lựa chọn của bạn?',
      'Bạn đã nói chuyện trực tiếp với người đó chưa, hay mới chỉ nói với người khác về họ? Ghi số lần của mỗi loại.',
      'Liệt kê ba phương án cho tình huống này, trong đó bắt buộc có một phương án bạn thấy không thích nhưng bên kia sẽ đồng ý ngay.',
      'Nếu chốt một cách làm thử ba tuần, tiêu chí nào sẽ cho biết nó có tác dụng? Ghi con số hoặc dấu hiệu quan sát được.',
    ],
    exercises: [
      { label: 'Tách lập trường và lợi ích', text: 'Với một bất đồng đang có, kẻ bảng hai cột: bên trái ghi điều mỗi bên đòi, bên phải ghi điều mỗi bên sợ mất. Tìm xem hai cột bên phải có thật sự loại trừ nhau không.', level: 'e' },
      { label: 'Viết lại câu buộc tội', text: 'Lấy ba câu bạn định nói và viết lại thành mô tả sự việc không có chủ ngữ đổ lỗi. Ví dụ đổi “anh không bao giờ báo trước” thành “ba lần gần nhất mình biết tin sau khi việc đã xảy ra”.', level: 'e' },
      { label: 'Câu hỏi vì sao ba lớp', text: 'Trong một cuộc trao đổi, hỏi “điều đó quan trọng với anh vì sao” ba lần liên tiếp một cách tự nhiên. Ghi lại lý do thứ ba — nó thường khác hẳn lý do đầu tiên.', level: 'e' },
      { label: 'Ba phương án bắt buộc', text: 'Trước cuộc trao đổi tiếp theo, viết sẵn ba phương án gồm một phương án có lợi cho bạn, một có lợi cho họ, một ở giữa. Mở đầu bằng việc đặt cả ba lên bàn thay vì bảo vệ một cái.', level: 'm' },
      { label: 'Đổi kênh', text: 'Chọn một bất đồng đang diễn ra qua tin nhắn và chủ động đề nghị nói chuyện trực tiếp 20 phút. Ghi lại điều bạn hiểu thêm được mà tin nhắn không truyền tải được.', level: 'm' },
      { label: 'Thử nghiệm ba tuần', text: 'Chốt một cách làm thử có ngày bắt đầu, ngày rà lại và một tiêu chí đo được. Viết thoả thuận đó thành năm dòng và gửi cho cả hai bên xác nhận.', level: 'm' },
      { label: 'Hoà giải cho người khác', text: 'Khi hai đồng nghiệp bất đồng, đề nghị làm người điều phối: mỗi bên nói ba phút không bị ngắt, bạn tóm tắt lại lợi ích của từng bên, rồi cả nhóm sinh phương án. Ghi lại chỗ khó nhất khi giữ vai trò trung lập.', level: 'h' },
      { label: 'Bảy ngày không nói sau lưng', text: 'Thử thách 7 ngày: mọi điều bạn muốn nói về một người, bạn chỉ nói với chính người đó hoặc không nói. Ngày 7, ghi lại bao nhiêu lần bạn suýt vi phạm và những cuộc trao đổi trực tiếp nào đã xảy ra nhờ quy tắc này.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên hỏi “điều gì quan trọng với anh ở đây” thay vì tranh luận trực tiếp vào đòi hỏi của đối phương?',
        a: 'Vì đòi hỏi là một phương án cụ thể mà họ tự nghĩ ra để bảo vệ một lợi ích, và thường có nhiều phương án khác cũng bảo vệ được lợi ích đó. Hai đòi hỏi có thể loại trừ nhau hoàn toàn trong khi hai lợi ích lại tương thích. Khi đã gọi tên được lợi ích, bạn có không gian để thiết kế phương án thứ ba mà cả hai đều chấp nhận được.',
      },
      {
        q: 'Đối phương lớn tiếng và công kích cá nhân bạn giữa cuộc họp. Phản ứng nào hữu ích nhất tại chỗ?',
        a: 'Không đáp trả nội dung công kích và không phòng thủ dài dòng. Hạ nhịp và giới hạn phạm vi: “Mình dừng phần này ở đây, sau họp anh và em nói riêng 15 phút được không?” Điều này bảo vệ cuộc họp, tránh biến bất đồng thành trận đấu công khai, và cho cả hai thời gian hạ nhiệt. Nếu hành vi lặp lại hoặc mang tính xúc phạm nghiêm trọng, đó là việc cần báo cho quản lý hoặc bộ phận nhân sự chứ không tự xử lý.',
      },
      {
        q: 'Bạn đã trao đổi hai lần mà bên kia vẫn không đổi. Khi nào thì nên leo thang lên cấp trên?',
        a: 'Khi ba điều kiện cùng đúng: bạn đã trao đổi trực tiếp và có ghi nhận lại, tác động lên công việc là cụ thể chứ không phải cảm giác khó chịu, và bạn đã đề xuất ít nhất một phương án bị từ chối. Khi leo thang, hãy báo trước cho người kia biết là bạn sẽ đưa lên — leo thang bất ngờ sẽ phá luôn phần quan hệ còn lại, kể cả khi bạn thắng lần đó.',
      },
    ],
    plan7:
      'Ngày 1: chọn một bất đồng đang có và lập bảng lập trường — lợi ích cho cả hai bên. Ngày 2: viết lại mọi câu buộc tội thành mô tả sự việc. Ngày 3: đề nghị gặp trực tiếp và chọn thời điểm cả hai đều không bị dồn việc. Ngày 4: trong cuộc gặp, dùng câu hỏi vì sao ba lớp và ghi lại lợi ích thật của họ. Ngày 5: cùng sinh ba phương án trước khi bàn chọn. Ngày 6: viết thoả thuận thử nghiệm năm dòng có ngày rà lại. Ngày 7: gửi bản thoả thuận cho cả hai xác nhận và đặt lịch rà.',
    evidence:
      'Lưu lại bản thoả thuận thử nghiệm năm dòng (vấn đề, lợi ích hai bên, cách làm thử, tiêu chí đánh giá, ngày rà lại) cùng ghi chú kết quả sau kỳ rà. Trong phỏng vấn, khi được hỏi về xung đột, bạn kể câu chuyện dựa trên hiện vật này và đặc biệt nêu được lợi ích của phía bên kia bằng ngôn ngữ công bằng. Đó là tín hiệu mạnh nhất cho thấy bạn xử lý va chạm bằng cấu trúc chứ không bằng việc thắng người khác — điều mà mọi vị trí có phối hợp đều cần.',
    references: [
      { label: 'Program on Negotiation, Harvard Law School — tài liệu về giải quyết xung đột', url: 'https://www.pon.harvard.edu/', type: 'article' },
      { label: 'Mediate.com — thư viện về hoà giải và xử lý bất đồng', url: 'https://www.mediate.com/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 9 — Đàm phán — Negotiation ────────────────────────────────────
  guide({
    thesis:
      'Đàm phán là quá trình tìm ra một thoả thuận tốt hơn phương án tốt nhất mà mỗi bên có nếu không thoả thuận. Vì vậy sức mạnh trên bàn đàm phán không đến từ giọng nói cứng rắn mà đến từ việc bạn đã chuẩn bị sẵn một lựa chọn thay thế đủ tốt và biết rõ mình sẵn sàng bỏ đi ở đâu. Người không biết điểm bỏ đi của mình sẽ luôn ký ở mức mà đối phương cảm thấy vừa đủ để mình không đứng dậy.',
    why: {
      work:
        'Bạn đàm phán nhiều hơn bạn tưởng: hạn giao hàng, phạm vi công việc, ai gánh phần rủi ro, ai được thêm một người. Không đàm phán không có nghĩa là hoà nhã, nó có nghĩa là bạn nhận mọi điều khoản mặc định do người khác đặt.',
      interview:
        'Vòng thương lượng lương và phúc lợi là bài kiểm tra đàm phán trực tiếp mà hầu hết ứng viên không chuẩn bị; biết tách gói đãi ngộ thành nhiều biến số ngoài lương cơ bản thường tạo ra khác biệt lớn hơn cả việc kỳ kèo con số.',
      study:
        'Sinh viên đàm phán về gia hạn nộp bài, về đề tài, về phân chia trong nhóm; ai biết chuẩn bị dữ liệu và đưa phương án thay vì xin xỏ sẽ được đối xử như một bên có trách nhiệm.',
      life:
        'Mua bán nhà, thuê phòng, thoả thuận với nhà thầu sửa nhà — những giao dịch ít lặp lại nhưng giá trị lớn — là nơi vài giờ chuẩn bị tạo ra khác biệt tiền bạc lớn nhất trong đời một người.',
    },
    framework: [
      { name: 'Xác định phương án thay thế của mình', detail: 'Trước khi đàm phán, viết ra bạn sẽ làm gì nếu không đạt thoả thuận — khái niệm BATNA trong phương pháp Harvard. Phương án đó càng cụ thể thì bạn càng ít bị dẫn dắt bởi áp lực phải ký.' },
      { name: 'Ước lượng phương án thay thế của họ', detail: 'Đặt câu hỏi: nếu không có mình thì họ làm gì, và việc đó tốn cho họ bao nhiêu. Người bán đang cuối quý và người bán đầu quý ở hai vị thế khác nhau dù giá niêm yết giống nhau.' },
      { name: 'Mở rộng số biến số', detail: 'Đừng đàm phán một con số duy nhất. Liệt kê mọi biến có thể trao đổi: thời hạn, phạm vi, điều khoản thanh toán, bảo hành, đào tạo, ngày bắt đầu. Nhiều biến số cho phép hai bên đổi thứ mình ít quý lấy thứ mình quý hơn.' },
      { name: 'Trao đổi có điều kiện', detail: 'Không bao giờ nhượng bộ trơn. Luôn dùng cấu trúc “nếu bên anh làm X thì bên em có thể làm Y”. Nhượng bộ vô điều kiện dạy cho phía kia rằng cứ ép thêm là sẽ được thêm.' },
      { name: 'Chốt bằng văn bản trong ngày', detail: 'Ngay sau khi thống nhất, gửi bản tóm tắt điều khoản và hỏi có gì cần sửa. Khoảng trống giữa cái bắt tay và bản hợp đồng là nơi mọi hiểu nhầm đắt tiền sinh ra.' },
    ],
    scenario:
      'Một nhân viên mua hàng của công ty thực phẩm cần gia hạn hợp đồng bao bì nhưng nhà cung cấp đòi tăng giá 12%. Thay vì mặc cả quanh con số, cô dành hai buổi chuẩn bị: lấy báo giá của hai nhà cung cấp khác để biết phương án thay thế của mình, và tìm hiểu được rằng đối tác hiện tại đang chạy chưa hết công suất vào các tháng thấp điểm. Trên bàn, cô mở rộng biến số: chấp nhận tăng 7% nhưng đổi lại chuyển 60% đơn hàng vào tháng thấp điểm của họ, kéo dài hợp đồng lên 18 tháng và giãn thanh toán thêm 15 ngày. Đối tác đồng ý vì nó lấp được chỗ trống công suất. Bản tóm tắt điều khoản được gửi ngay chiều hôm đó, và hợp đồng chính thức ký sau một tuần không phát sinh tranh cãi.',
    comparison: [
      { weak: 'Bước vào cuộc trao đổi với một con số mong muốn và một hy vọng.', mature: 'Bước vào với ba con số viết sẵn: mức mong muốn, mức chấp nhận được, và điểm bỏ đi kèm phương án thay thế cụ thể.' },
      { weak: 'Coi mọi nhượng bộ là dấu hiệu thiện chí và trao đi để tạo không khí tốt.', mature: 'Gắn mỗi nhượng bộ với một điều kiện đổi lại, kể cả khi điều kiện đó nhỏ, để giữ cấu trúc trao đổi hai chiều.' },
      { weak: 'Tập trung toàn bộ vào giá vì đó là con số dễ so sánh nhất.', mature: 'Đưa thêm bốn đến sáu biến số lên bàn và hỏi bên kia biến nào họ quý nhất, để tìm chỗ trao đổi mà cả hai đều thấy được lợi.' },
    ],
    mistakes: [
      'Không chuẩn bị phương án thay thế nên mọi lời đe doạ rời bàn của mình đều rỗng, và đối phương thường nhận ra điều đó trước bạn.',
      'Nói con số đầu tiên khi chưa biết gì về thị trường hoặc về ràng buộc của phía kia, tự khoá mình vào một khoảng mà lẽ ra có thể rộng hơn nhiều.',
      'Nhầm đàm phán cứng với đàm phán tốt: ép được một lần rồi mất luôn quan hệ dài hạn, trong khi phần lớn đàm phán trong công việc là với người bạn sẽ còn gặp lại nhiều lần.',
    ],
    worksheet: [
      'Cuộc thương lượng sắp tới của bạn: nếu không đạt thoả thuận, chính xác bạn sẽ làm gì vào ngày hôm sau? Viết ra thành hành động cụ thể.',
      'Phía bên kia có phương án nào khác ngoài bạn? Nó tốn cho họ bao nhiêu thời gian, tiền hoặc rủi ro?',
      'Liệt kê tất cả các biến có thể trao đổi ngoài con số chính. Bạn tìm được bao nhiêu — dưới bốn là bạn chưa tìm đủ.',
      'Trong các biến đó, biến nào bạn ít quý nhất nhưng có thể có giá trị lớn với họ?',
      'Điểm bỏ đi của bạn là con số nào, và ai sẽ là người nhắc bạn giữ nó khi bạn bị cuốn vào lúc trao đổi?',
    ],
    exercises: [
      { label: 'Viết phương án thay thế', text: 'Với một cuộc thương lượng đang tới, viết ra kế hoạch chi tiết bạn sẽ thực hiện nếu không có thoả thuận, gồm bước đầu tiên và ngày thực hiện. Đánh giá xem nó tốt hơn hay tệ hơn bạn nghĩ.', level: 'e' },
      { label: 'Danh sách biến số', text: 'Liệt kê ít nhất sáu biến có thể trao đổi trong tình huống của bạn và xếp hạng chúng theo mức bạn quý. Đánh dấu ba biến bạn sẵn sàng nhường.', level: 'e' },
      { label: 'Ba con số', text: 'Viết ra mức mong muốn, mức chấp nhận được và điểm bỏ đi trước khi bước vào trao đổi. Dán ba con số đó ở nơi bạn nhìn thấy trong lúc gọi điện hoặc họp.', level: 'e' },
      { label: 'Câu nếu — thì', text: 'Soạn năm câu trao đổi có điều kiện cho tình huống của bạn theo mẫu “nếu bên anh… thì bên em có thể…”. Đọc to và cắt bỏ những câu thực chất là nhượng bộ trơn.', level: 'm' },
      { label: 'Nghiên cứu phía bên kia', text: 'Dành một giờ tìm hiểu ràng buộc của đối tác: chu kỳ kinh doanh, đối thủ của họ, thứ họ đang cần gấp. Viết ba giả thuyết về điều họ quý nhất và cách bạn sẽ kiểm chứng ngay trong cuộc trao đổi.', level: 'm' },
      { label: 'Diễn tập đổi vai', text: 'Nhờ một đồng nghiệp đóng vai phía bên kia và tấn công vào điểm yếu nhất trong đề nghị của bạn trong 20 phút. Ghi lại câu hỏi khiến bạn lúng túng nhất và chuẩn bị câu trả lời.', level: 'm' },
      { label: 'Đàm phán thật có ghi chép', text: 'Thực hiện một cuộc đàm phán thật (gia hạn, phạm vi công việc, giá dịch vụ) và ghi lại: bạn mở đầu thế nào, họ phản ứng ra sao, những nhượng bộ đã trao đổi, và kết quả so với ba con số đặt trước.', level: 'h' },
      { label: 'Bảy ngày mở rộng biến số', text: 'Thử thách 7 ngày: mỗi lần có ai đó đưa cho bạn một đề nghị dạng một chiều, thay vì đồng ý hoặc từ chối hãy đặt một câu hỏi mở rộng biến số. Ngày 7, tổng kết những thoả thuận tốt hơn bạn đạt được nhờ câu hỏi đó.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao phương án thay thế lại quyết định sức mạnh đàm phán nhiều hơn kỹ thuật nói chuyện?',
        a: 'Vì nó xác định mức tệ nhất bạn có thể chấp nhận. Người có phương án thay thế tốt sẽ từ chối được những đề nghị dưới mức đó một cách bình thản và thật lòng, và sự bình thản đó được đối phương đọc thấy. Ngược lại, mọi kỹ thuật nói chuyện đều sụp khi bạn biết rằng mình không thể rời bàn — và điều đó rất khó giấu qua nhiều vòng trao đổi.',
      },
      {
        q: 'Chỉ đàm phán quanh một con số duy nhất có hại gì?',
        a: 'Nó biến cuộc trao đổi thành trò chơi tổng bằng không: mỗi đồng bạn được là một đồng họ mất, nên cả hai đều phải cứng và quan hệ bị bào mòn. Khi có nhiều biến số, hai bên có thể trao đổi những thứ mình định giá khác nhau — bạn nhường thời hạn để đổi lấy phạm vi, họ nhường giá để đổi lấy hợp đồng dài — và tổng giá trị thoả thuận thật sự tăng lên.',
      },
      {
        q: 'Đối phương nói “đây là giá cuối cùng, không thương lượng được”. Bạn kiểm chứng câu đó thế nào?',
        a: 'Đừng phản đối câu nói đó, hãy đổi trục. Chấp nhận giá tạm thời và hỏi về các biến khác: thời hạn thanh toán, phạm vi bao gồm, thời gian bảo hành, khối lượng tối thiểu. Nếu mọi biến đều cứng thì đó thật sự là giới hạn của họ và bạn đối chiếu với phương án thay thế của mình để quyết. Nếu có biến mềm ra, câu “không thương lượng được” chỉ đúng với đúng một biến.',
      },
    ],
    plan7:
      'Ngày 1: chọn một cuộc thương lượng sắp tới và viết phương án thay thế của bạn thành hành động cụ thể. Ngày 2: nghiên cứu ràng buộc và phương án thay thế của phía bên kia. Ngày 3: liệt kê sáu biến số và xếp hạng theo mức bạn quý. Ngày 4: viết ba con số mong muốn — chấp nhận — bỏ đi. Ngày 5: soạn năm câu trao đổi có điều kiện. Ngày 6: diễn tập đổi vai với một đồng nghiệp trong 20 phút. Ngày 7: thực hiện cuộc trao đổi và gửi bản tóm tắt điều khoản ngay trong ngày.',
    evidence:
      'Giữ một hồ sơ chuẩn bị đàm phán cho hai đến ba lần thương lượng thật: bảng biến số có xếp hạng, ba con số đặt trước, và bản đối chiếu kết quả thực tế với mục tiêu. Khi ứng tuyển vào các vị trí mua hàng, kinh doanh, quản lý dự án hoặc khi tự làm freelance, đây là hiện vật cho thấy bạn tiếp cận thương lượng bằng chuẩn bị chứ không bằng cảm tính — và nó cũng là thứ giúp chính bạn thương lượng lương của mình một cách bình tĩnh, dựa trên dữ liệu thay vì dựa trên hy vọng.',
    references: [
      { label: 'Program on Negotiation, Harvard Law School', url: 'https://www.pon.harvard.edu/', type: 'article' },
      { label: 'Harvard Business Review — bài viết và nghiên cứu về đàm phán trong kinh doanh', url: 'https://hbr.org/', type: 'article' },
    ],
  }),

  // ── Chương 10 — Quản lý người khó làm việc cùng ──────────────────────────
  guide({
    thesis:
      'Cụm từ “người khó làm việc cùng” thường mô tả một trải nghiệm của bạn chứ không mô tả một sự thật về họ. Việc của bạn không phải là chẩn đoán tâm lý hay tìm cách sửa tính cách người khác — bạn không có công cụ và cũng không có tư cách để làm điều đó. Việc của bạn là mô tả chính xác hành vi gây khó, tìm điều kiện làm nó xuất hiện, rồi đổi cách hai bên làm việc với nhau để hành vi đó ít có cơ hội xảy ra. Với các trường hợp nghiêm trọng — quấy rối, bắt nạt, phân biệt đối xử — hãy dừng cách tiếp cận này lại và đưa lên quản lý hoặc bộ phận nhân sự.',
    why: {
      work:
        'Bạn không chọn được đồng nghiệp, nhưng bạn chọn được giao diện làm việc với họ: kênh nào, tần suất nào, ghi lại ra sao. Đổi giao diện thường hiệu quả hơn nhiều so với chờ người kia thay đổi.',
      interview:
        'Nhà tuyển dụng hỏi về đồng nghiệp khó tính để nghe cách bạn mô tả người khác. Ứng viên mô tả hành vi và cách mình điều chỉnh cho thấy sự chuyên nghiệp; ứng viên dán nhãn và kể tội cho thấy họ sẽ nói về công ty này y như vậy ở nơi tiếp theo.',
      study:
        'Trong nhóm học có người không nộp bài hoặc luôn phản bác mọi ý kiến, biết cách chuyển từ tranh cãi sang thoả thuận cách làm việc bằng văn bản giúp nhóm về đích mà không cần ai phải nhượng bộ về danh dự.',
      life:
        'Với hàng xóm, họ hàng hoặc phụ huynh khác trong lớp con, cùng một nguyên tắc: mô tả cụ thể việc đã xảy ra, nói tác động, đề nghị một cách làm khác, và giữ ranh giới rõ ràng thay vì mong người kia tự hiểu.',
    },
    framework: [
      { name: 'Đổi nhãn thành hành vi', detail: 'Viết ra đúng những gì camera sẽ ghi được: ngắt lời bao nhiêu lần, trả lời email sau bao nhiêu ngày, đổi yêu cầu mấy lần. Nhãn “khó tính” không hành động được, hành vi thì có.' },
      { name: 'Tìm điều kiện kích hoạt', detail: 'Quan sát hành vi đó xuất hiện khi nào: chỉ trong họp đông người, chỉ khi gần hạn, chỉ với chủ đề ngân sách. Hành vi hiếm khi xuất hiện đều — chỗ nó tập trung thường chỉ ra ràng buộc hoặc nỗi lo đằng sau.' },
      { name: 'Đổi giao diện làm việc', detail: 'Trước khi cố đổi con người, hãy đổi cách tương tác: chuyển từ họp sang văn bản, gửi trước tài liệu, chốt bằng email tóm tắt, giảm số điểm tiếp xúc không cần thiết. Nhiều xung đột biến mất chỉ nhờ đổi kênh.' },
      { name: 'Một cuộc trao đổi riêng, đúng cấu trúc', detail: 'Nói một lần, riêng tư, theo cấu trúc tình huống — hành vi — tác động — đề nghị. Nói một lần rõ ràng có tác dụng hơn mười lần bóng gió, và cũng công bằng hơn với người kia.' },
      { name: 'Giữ ranh giới và ghi chép', detail: 'Nếu hành vi vẫn tiếp diễn và ảnh hưởng tới công việc, ghi lại theo sự việc có ngày tháng, giữ trao đổi bằng văn bản, và đưa lên quản lý với dữ liệu chứ không với cảm xúc. Đây là bước bảo vệ bạn, không phải bước trả đũa.' },
    ],
    scenario:
      'Một nhân viên hỗ trợ khách hàng làm việc cùng một đồng nghiệp kỳ cựu hay bác bỏ đề xuất của cô ngay giữa cuộc họp, khiến cô ngại phát biểu. Thay vì kết luận anh ta coi thường mình, cô ghi lại ba tuần: bảy lần bị bác bỏ, cả bảy đều xảy ra trong họp đông người và đều với các đề xuất đụng tới quy trình anh ta xây dựng từ trước. Cô đổi giao diện: gửi trước đề xuất cho riêng anh một ngày, kèm câu hỏi “anh thấy chỗ nào sẽ vỡ khi áp dụng thật?”. Ba lần đầu anh trả lời bằng những phản biện rất chi tiết mà cô dùng để sửa đề xuất; đến cuộc họp thì chính anh là người ủng hộ. Cô không thay đổi con người anh — cô thay đổi thứ tự và kênh trao đổi để anh không phải bảo vệ công trình của mình trước đám đông.',
    comparison: [
      { weak: 'Kết luận về động cơ: “anh ta ghen tị”, “chị ấy thích quyền lực”, rồi hành xử theo kết luận đó.', mature: 'Ghi lại hành vi và bối cảnh trong vài tuần, rồi tìm giả thuyết đơn giản nhất giải thích được dữ liệu — thường là một ràng buộc hoặc một nỗi lo rất trần trụi.' },
      { weak: 'Phàn nàn với đồng nghiệp khác để tìm sự đồng cảm và xác nhận rằng mình đúng.', mature: 'Nói trực tiếp một lần với người đó theo cấu trúc rõ ràng; chỉ trao đổi với người thứ ba khi cần lời khuyên về cách nói, không phải để lập phe.' },
      { weak: 'Chịu đựng và né tránh cho tới khi bùng nổ hoặc xin chuyển bộ phận.', mature: 'Đặt ranh giới sớm bằng lời và bằng cách làm việc, ghi chép các sự việc ảnh hưởng tới công việc, và leo thang có dữ liệu khi cần.' },
    ],
    mistakes: [
      'Tự chẩn đoán tâm lý đồng nghiệp bằng những nhãn học lỏm từ mạng xã hội, vừa không chính xác vừa đóng luôn khả năng tìm ra nguyên nhân thật nằm trong cách tổ chức công việc.',
      'Nói bóng gió, mỉa mai hoặc để lộ khó chịu qua thái độ thay vì nói thẳng một lần, khiến người kia biết có vấn đề nhưng không biết là vấn đề gì và cũng không sửa được.',
      'Chờ tới kỳ đánh giá cuối năm mới nêu, khi đó mọi việc đã thành một danh sách dài và người nghe chỉ thấy mình bị phục kích chứ không thấy cơ hội thay đổi.',
    ],
    worksheet: [
      'Viết ra ba hành vi cụ thể của người đó mà một camera sẽ ghi được, kèm ngày và bối cảnh. Bỏ hết tính từ.',
      'Ba hành vi đó xuất hiện nhiều nhất trong tình huống nào (loại cuộc họp, giai đoạn dự án, chủ đề)? Điểm chung là gì?',
      'Nếu giả định họ đang lo mất một thứ gì đó, thứ đó có thể là gì? Liệt kê hai khả năng bạn kiểm chứng được.',
      'Bạn có thể đổi giao diện làm việc nào ngay tuần này (kênh, thời điểm, gửi trước, ghi lại) mà không cần họ đồng ý?',
      'Nếu sau bốn tuần không có gì thay đổi, dấu hiệu nào cho bạn biết đã đến lúc đưa lên quản lý, và bạn cần chuẩn bị sẵn những ghi chép nào?',
    ],
    exercises: [
      { label: 'Nhật ký hành vi ba tuần', text: 'Trong ba tuần, mỗi lần xảy ra hành vi gây khó hãy ghi một dòng: ngày, bối cảnh, việc đã xảy ra, ảnh hưởng lên công việc. Cuối kỳ đọc lại và đếm — con số thường khác xa cảm giác của bạn.', level: 'e' },
      { label: 'Xoá tính từ', text: 'Viết một đoạn mô tả người đó theo cách bạn vẫn nghĩ, rồi gạch bỏ mọi tính từ và mọi suy đoán động cơ. Đọc lại phần còn lại và xem bạn thật sự có bao nhiêu dữ liệu.', level: 'e' },
      { label: 'Tìm ngoại lệ', text: 'Tìm ba lần người đó hợp tác dễ dàng. Ghi lại bối cảnh của ba lần đó và tìm điểm chung — đây thường là công thức để lặp lại.', level: 'e' },
      { label: 'Thử một giao diện mới', text: 'Chọn một thay đổi trong cách làm việc chung (gửi tài liệu trước một ngày, chuyển từ gọi sang email, hỏi ý kiến riêng trước khi họp) và áp dụng bốn lần. Ghi lại kết quả từng lần.', level: 'm' },
      { label: 'Soạn cuộc trao đổi riêng', text: 'Viết ra kịch bản một cuộc nói chuyện riêng gồm: tình huống cụ thể, hành vi, tác động lên công việc, đề nghị thay đổi. Đọc to cho một người tin cậy nghe và nhờ họ chỉ ra chỗ nghe như buộc tội.', level: 'm' },
      { label: 'Ranh giới bằng lời', text: 'Chuẩn bị ba câu giữ ranh giới lịch sự nhưng rõ ràng cho các tình huống hay lặp lại (bị ngắt lời, bị giao thêm việc ngoài phạm vi, bị đổi yêu cầu sát hạn). Dùng thật ít nhất một lần trong tuần.', level: 'm' },
      { label: 'Hồ sơ leo thang', text: 'Nếu tình hình không cải thiện sau bốn tuần, chuẩn bị một trang gửi quản lý gồm: các sự việc có ngày, ảnh hưởng cụ thể lên công việc, các cách bạn đã thử, và đề nghị của bạn. Không đưa suy đoán về tính cách vào trang này.', level: 'h' },
      { label: 'Bảy ngày giả định thiện chí', text: 'Thử thách 7 ngày: mỗi lần khó chịu với người đó, viết ra một cách giải thích hành vi của họ mà không cần giả định ác ý, rồi tìm một cách kiểm chứng nhanh. Ngày 7, đếm bao nhiêu giả định thiện chí hoá ra đúng.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên bắt đầu bằng việc đổi giao diện làm việc thay vì đổi con người?',
        a: 'Vì giao diện nằm trong tầm kiểm soát của bạn và cho kết quả trong vài ngày, còn con người thì không thuộc quyền của bạn và thay đổi rất chậm. Nhiều hành vi gây khó thực chất là phản ứng với một cấu trúc: bị bất ngờ trước đám đông, bị hỏi lúc đang quá tải, không có thời gian chuẩn bị. Đổi thứ tự và kênh trao đổi giải quyết được phần lớn những trường hợp đó mà không cần ai phải nhận mình sai.',
      },
      {
        q: 'Bạn có nên nói với quản lý về một đồng nghiệp khó làm việc cùng không, và khi nào?',
        a: 'Có, khi hành vi đó gây ảnh hưởng đo được lên công việc và bạn đã thử ít nhất một lần trao đổi trực tiếp. Khi trình bày, hãy đưa ghi chép sự việc có ngày tháng, ảnh hưởng cụ thể, các cách bạn đã thử và đề nghị của bạn — chứ không đưa suy đoán tính cách. Riêng với quấy rối, đe doạ hay phân biệt đối xử thì không có ngưỡng chờ đợi nào cả: báo ngay cho quản lý hoặc nhân sự và tìm hỗ trợ chuyên môn phù hợp.',
      },
      {
        q: 'Bạn đã nói chuyện riêng một lần, người đó tỏ ra tiếp thu nhưng hai tuần sau lặp lại. Nên hiểu thế nào?',
        a: 'Đừng vội kết luận họ không thành thật. Thói quen làm việc rất khó đổi nếu không có tín hiệu nhắc tại chỗ. Hãy thoả thuận một cách nhắc nhẹ đã được đồng ý trước — một câu ngắn hoặc một ký hiệu trong họp — và giữ nguyên các thay đổi giao diện bạn đã áp dụng. Nếu sau chu kỳ thứ hai vẫn không đổi và ảnh hưởng công việc vẫn còn, đó là lúc chuyển sang bước leo thang có dữ liệu.',
      },
    ],
    plan7:
      'Ngày 1: viết ba hành vi cụ thể có ngày và bối cảnh, bỏ hết tính từ. Ngày 2: tìm điểm chung của các bối cảnh đó và ghi hai giả thuyết về ràng buộc phía sau. Ngày 3: tìm ba lần người đó hợp tác dễ dàng và ghi công thức chung. Ngày 4: chọn và áp dụng một thay đổi giao diện làm việc. Ngày 5: soạn kịch bản cuộc trao đổi riêng và nhờ người tin cậy góp ý. Ngày 6: thực hiện cuộc trao đổi riêng. Ngày 7: bắt đầu nhật ký hành vi cho bốn tuần tới và định trước dấu hiệu cần leo thang.',
    evidence:
      'Giữ nhật ký hành vi ba tuần cùng bản ghi thay đổi giao diện làm việc bạn đã áp dụng và kết quả trước — sau. Trong phỏng vấn, câu hỏi về đồng nghiệp khó tính có một cái bẫy: ứng viên nào cũng kể được một câu chuyện, nhưng rất ít người kể được mình đã thử nghiệm cách làm việc nào và đo kết quả ra sao. Kể chuyện dựa trên hiện vật này giúp bạn nói về người khác một cách công bằng — và chính sự công bằng đó là thứ nhà tuyển dụng đang nghe.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Difficult Conversations', url: 'https://hbr.org/topic/subject/difficult-conversations', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 11 — An toàn tâm lý — Psychological Safety ────────────────────
  guide({
    thesis:
      'An toàn tâm lý là niềm tin rằng nói ra một câu hỏi ngớ ngẩn, một sai sót hoặc một ý kiến trái chiều sẽ không khiến bạn bị trả giá về mặt hình ảnh hay cơ hội. Đây là khái niệm được Amy Edmondson nghiên cứu và định nghĩa, và điểm hay bị hiểu sai nhất là: nó không có nghĩa là dễ chịu, không có nghĩa là hạ chuẩn, và không có nghĩa là ai nói gì cũng được. Nó chỉ có nghĩa là chi phí của việc nói thật thấp hơn chi phí của việc im lặng.',
    why: {
      work:
        'Nhóm không có an toàn tâm lý vẫn có thể chạy tốt khi mọi thứ suôn sẻ; nó chỉ lộ ra khi có sự cố, vì đó là lúc thông tin xấu cần đi lên nhanh nhất mà lại không ai muốn là người mang tin.',
      interview:
        'Ứng viên vị trí quản lý được hỏi “bạn làm gì để người trong nhóm dám nói thật” — trả lời bằng hành vi cụ thể của chính mình (thừa nhận giới hạn, phản ứng ra sao khi nghe tin xấu) thuyết phục hơn nhiều so với nói về văn hoá cởi mở.',
      study:
        'Trong lớp học hoặc nhóm nghiên cứu, người không dám hỏi lại phần chưa hiểu sẽ tích tụ lỗ hổng suốt kỳ; một môi trường mà câu hỏi cơ bản được đón nhận sẽ rút ngắn thời gian học của mọi người.',
      life:
        'Trong gia đình, an toàn tâm lý là điều quyết định con cái có kể chuyện khó khăn với bố mẹ hay không, và cách người lớn phản ứng ở lần đầu tiên gần như quyết định có lần thứ hai hay không.',
    },
    framework: [
      { name: 'Đặt khung công việc là học chứ không phải thi hành', detail: 'Nói rõ ngay từ đầu: việc này có phần chưa ai biết trước, nên chúng ta sẽ sai vài lần và cần nghe sớm. Người không được nói trước điều này sẽ mặc định coi mọi sai sót là lỗi cá nhân cần giấu.' },
      { name: 'Người dẫn nói ra giới hạn của mình trước', detail: 'Câu “phần này tôi không chắc, ai biết rõ hơn nói giúp” của người có quyền lực nhất trong phòng có sức mở khoá lớn hơn mọi lời kêu gọi đóng góp ý kiến.' },
      { name: 'Hỏi câu hỏi thật và chịu được im lặng', detail: 'Hỏi cụ thể và mở: “chỗ nào trong kế hoạch này dễ vỡ nhất?” rồi im lặng đủ mười giây. Đa số người dẫn phá vỡ khoảng im lặng đó và tự trả lời, và đó là lúc họ dạy cả nhóm rằng câu hỏi chỉ là hình thức.' },
      { name: 'Phản ứng với tin xấu bằng lời cảm ơn trước', detail: 'Phản ứng đầu tiên của bạn khi nghe tin xấu quyết định lần sau có ai báo nữa hay không. Cảm ơn vì đã báo sớm, hỏi thông tin, và để phần truy trách nhiệm cho một thời điểm khác với một quy trình khác.' },
      { name: 'Đóng vòng bằng thay đổi nhìn thấy được', detail: 'Khi ai đó nêu vấn đề, hãy cho họ thấy điều gì đã đổi nhờ lời của họ, kể cả khi câu trả lời là không đổi kèm lý do. Không có vòng đóng này thì mọi lời mời góp ý sẽ tắt sau vài lần.' },
    ],
    scenario:
      'Một tổ trưởng ca sản xuất trong nhà máy nhận thấy các lỗi chất lượng chỉ được báo khi đã thành lô hỏng, dù công nhân thường phát hiện dấu hiệu từ sớm. Anh thử đổi ba thứ trong hai tháng: đầu mỗi ca anh nói ra một điều chính mình chưa chắc; anh lập một bảng “dấu hiệu bất thường” mà công nhân ghi ẩn danh được; và mỗi khi có người báo, việc đầu tiên anh làm trước mặt cả tổ là cảm ơn và ghi tên vấn đề lên bảng, không hỏi ai gây ra. Số báo cáo dấu hiệu sớm tăng lên rõ rệt trong tháng thứ hai — nghe như tình hình xấu đi, nhưng số lô phải huỷ thì giảm. Điều đáng chú ý là chỉ một lần anh phản ứng gắt với một báo cáo sai, số lượt ghi bảng tụt xuống gần bằng không trong hai tuần sau đó.',
    comparison: [
      { weak: 'Kêu gọi “mọi người cứ thoải mái góp ý” trong cuộc họp rồi phản bác ngay ý kiến đầu tiên.', mature: 'Hỏi một câu cụ thể, chờ im lặng, ghi lại ý kiến nhận được, và nói rõ ý kiến đó dẫn tới thay đổi gì.' },
      { weak: 'Khi có sự cố, câu hỏi đầu tiên là “ai làm việc này?”.', mature: 'Câu hỏi đầu tiên là “chuyện gì đã xảy ra và điều gì trong cách chúng ta làm khiến nó xảy ra được?”; phần trách nhiệm cá nhân xử lý riêng, sau, và không trước mặt cả nhóm.' },
      { weak: 'Coi việc không ai phản đối trong họp là dấu hiệu mọi người đồng thuận.', mature: 'Chủ động đi tìm ý kiến trái chiều: hỏi riêng, đề nghị một người đóng vai phản biện, hoặc thu ý kiến bằng hình thức viết trước khi thảo luận miệng.' },
    ],
    mistakes: [
      'Nhầm an toàn tâm lý với sự dễ chịu, nên né tránh mọi tranh luận thẳng thắn và cuối cùng tạo ra một nhóm lịch sự nhưng không ai nói ra vấn đề thật.',
      'Nghĩ rằng an toàn tâm lý là thứ tuyên bố được bằng một buổi nói chuyện về văn hoá, trong khi nó được quyết định bởi phản ứng của người có quyền trong khoảng ba giây sau khi nghe tin xấu.',
      'Đo bằng số lượt phát biểu trong họp mà không nhận ra một vài người nói nhiều có thể đang lấp hết khoảng trống của những người khác, khiến sự im lặng bị che giấu.',
    ],
    worksheet: [
      'Lần gần nhất có người trong nhóm báo tin xấu, phản ứng đầu tiên của bạn hoặc của người dẫn là gì? Viết lại nguyên văn câu nói đó.',
      'Trong cuộc họp gần nhất, ai không nói câu nào? Bạn đã hỏi riêng họ sau đó chưa?',
      'Có vấn đề nào cả nhóm đều biết nhưng chưa ai nói ra trong cuộc họp không? Điều gì đang ngăn nó được nói?',
      'Lần gần nhất bạn nói “tôi không chắc” hoặc “tôi sai” trước nhóm là khi nào? Nếu không nhớ nổi, đó là một dữ kiện.',
      'Chọn một ý kiến ai đó đã nêu trong tháng này: bạn đã cho họ thấy điều gì thay đổi nhờ ý kiến đó chưa?',
    ],
    exercises: [
      { label: 'Ghi lại ba giây đầu', text: 'Trong hai tuần, mỗi lần nghe tin xấu hãy ghi lại nguyên văn câu đầu tiên bạn nói ra. Cuối kỳ đọc lại và đếm bao nhiêu câu bắt đầu bằng việc truy nguyên nhân cá nhân.', level: 'e' },
      { label: 'Nói ra một giới hạn', text: 'Trong cuộc họp tới, nói ra một điều bạn thật sự không chắc và mời người biết rõ hơn bổ sung. Ghi lại có bao nhiêu người lên tiếng sau đó.', level: 'e' },
      { label: 'Đếm người im lặng', text: 'Trong ba cuộc họp, ghi tên những người không phát biểu câu nào. Hỏi riêng một người trong số đó về nội dung cuộc họp và ghi lại điều họ nói mà cuộc họp đã bỏ lỡ.', level: 'e' },
      { label: 'Mười giây im lặng', text: 'Sau khi đặt một câu hỏi mở trong họp, đếm thầm tới mười trước khi nói thêm bất cứ điều gì. Làm năm lần và ghi lại số câu trả lời xuất hiện sau giây thứ năm.', level: 'm' },
      { label: 'Thu ý kiến bằng viết', text: 'Trước một quyết định quan trọng, đề nghị mỗi người viết riêng rủi ro lớn nhất họ nhìn thấy rồi mới thảo luận miệng. So sánh danh sách viết với những gì được nói ra trong họp.', level: 'm' },
      { label: 'Vòng đóng công khai', text: 'Chọn ba ý kiến được nêu trong tháng và gửi cho cả nhóm một bản ngắn: ý kiến là gì, đã dẫn tới thay đổi gì, hoặc vì sao chưa thay đổi. Quan sát số ý kiến nhận được trong tháng kế tiếp.', level: 'm' },
      { label: 'Rà sự cố không truy tội', text: 'Sau một sự cố, chủ trì một buổi rà tập trung vào chuỗi sự việc và điều kiện hệ thống, cấm mọi câu hỏi dạng “ai làm”. Kết thúc bằng hai thay đổi về quy trình có người chịu trách nhiệm.', level: 'h' },
      { label: 'Bảy ngày hỏi thật', text: 'Thử thách 7 ngày: mỗi ngày hỏi một người trong nhóm đúng một câu hỏi thật mà bạn chưa biết câu trả lời và ghi lại nguyên văn. Ngày 7, tìm những thông tin bạn đã không biết dù chúng luôn ở ngay đó.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Số lượng báo cáo sự cố trong nhóm bạn tăng gấp đôi sau ba tháng. Đó là tin tốt hay tin xấu?',
        a: 'Không thể kết luận nếu chỉ nhìn con số đó. Nó có thể là chất lượng đang xấu đi, hoặc là người ta bắt đầu dám báo những thứ trước đây bị giấu. Hãy đối chiếu với chỉ số hậu quả cuối nguồn — số lô phải huỷ, số khách phàn nàn, số việc phải làm lại. Nếu báo cáo tăng mà hậu quả giảm thì bạn đang thấy tác dụng của an toàn tâm lý chứ không phải sự xuống cấp.',
      },
      {
        q: 'An toàn tâm lý có mâu thuẫn với việc đặt tiêu chuẩn cao không?',
        a: 'Không, và đây là hiểu nhầm phổ biến nhất. Hai thứ này là hai trục độc lập: tiêu chuẩn cao mà không an toàn tạo ra nhóm sợ hãi và giấu lỗi; an toàn mà tiêu chuẩn thấp tạo ra nhóm dễ chịu nhưng không tiến. Kết hợp cả hai — đòi hỏi cao về kết quả nhưng an toàn khi nói ra vấn đề — mới là điều kiện để một nhóm học nhanh.',
      },
      {
        q: 'Bạn không phải quản lý. Bạn ảnh hưởng gì được tới an toàn tâm lý của nhóm?',
        a: 'Nhiều hơn bạn nghĩ, vì an toàn tâm lý được tạo ra bởi phản ứng của tất cả mọi người chứ không chỉ của người dẫn. Ba hành vi hiệu quả: là người đầu tiên hỏi câu cơ bản để mở đường cho người khác, cảm ơn công khai người vừa báo tin xấu, và khi ai đó bị ngắt lời thì mời họ nói tiếp. Ba việc này không cần chức danh nào cả và thay đổi rõ rệt bầu không khí trong phòng.',
      },
    ],
    plan7:
      'Ngày 1: ghi lại nguyên văn câu đầu tiên bạn nói khi nghe tin xấu. Ngày 2: nói ra một điều bạn không chắc trước nhóm và ghi phản ứng. Ngày 3: đếm người im lặng trong họp và hỏi riêng một người sau đó. Ngày 4: luyện mười giây im lặng sau mỗi câu hỏi mở. Ngày 5: thu ý kiến bằng viết trước một quyết định quan trọng. Ngày 6: gửi bản vòng đóng cho ba ý kiến đã nhận trong tháng. Ngày 7: đọc lại cả tuần và chọn một hành vi bạn sẽ giữ lâu dài.',
    evidence:
      'Xây một hồ sơ gồm: bản ghi vòng đóng ý kiến gửi cho nhóm (ý kiến — thay đổi — lý do), biên bản một buổi rà sự cố không truy tội với hai thay đổi quy trình cụ thể, và số liệu đối chiếu báo cáo sớm với hậu quả cuối nguồn. Với vị trí tổ trưởng, trưởng nhóm hay quản lý, đây là câu trả lời hiếm cho câu hỏi “bạn xây văn hoá nhóm thế nào”: bạn không mô tả giá trị, bạn đưa ra cơ chế bạn đã dựng và số đo cho thấy nó hoạt động.',
    references: [
      { label: 'The Fearless Organization (Amy Edmondson) — trang chính thức về an toàn tâm lý', url: 'https://fearlessorganization.com/', type: 'article' },
      { label: 'Google re:Work — thư viện tài liệu về hiệu quả nhóm', url: 'https://rework.withgoogle.com/', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 12 — Làm việc trong nhóm đa chuyên môn ────────────────────────
  guide({
    thesis:
      'Nhóm đa chuyên môn mạnh không phải vì mỗi người giỏi lĩnh vực của mình, mà vì họ trả được ba loại chi phí dịch: dịch thuật ngữ, dịch tiêu chuẩn chất lượng, và dịch khái niệm “xong”. Cùng một câu “gần xong rồi” có nghĩa khác nhau hoàn toàn với người thiết kế, người lập trình, người pháp chế và người bán hàng. Phần lớn thất bại của các nhóm loại này không nằm ở chuyên môn mà nằm ở chỗ không ai chịu trả ba chi phí dịch đó.',
    why: {
      work:
        'Mọi sản phẩm thật đều đi qua nhiều nghề. Người dịch được giữa các nghề trở thành điểm nối mà tổ chức không thay thế được, kể cả khi họ không phải người giỏi nhất ở bất kỳ nghề đơn lẻ nào.',
      interview:
        'Ứng viên kể được cách mình làm việc với người ngoài chuyên môn — dịch yêu cầu, thoả thuận định nghĩa hoàn thành — sẽ nổi bật hơn ứng viên chỉ nói về kỹ thuật, vì tổ chức nào cũng đang thiếu chỗ nối.',
      study:
        'Đồ án liên ngành hoặc cuộc thi khởi nghiệp thường ghép sinh viên từ các khoa khác nhau; nhóm nào lập được từ điển thuật ngữ chung ngay tuần đầu sẽ tránh được hai tháng nói chuyện lệch pha.',
      life:
        'Khi bạn làm việc với bác sĩ, luật sư, kiến trúc sư hay thợ, cùng một kỹ năng dịch giúp bạn hỏi đúng câu và hiểu đúng ràng buộc — dù các quyết định chuyên môn vẫn phải để người có chuyên môn đưa ra.',
    },
    framework: [
      { name: 'Lập từ điển thuật ngữ chung', detail: 'Ghi ra 10-20 từ mà các bên dùng khác nghĩa nhau: khách hàng, đơn hàng, hoàn thành, ưu tiên cao, bản thử. Với mỗi từ chốt một nghĩa duy nhất dùng trong dự án này và dán ở chỗ công khai.' },
      { name: 'Vẽ bản đồ quyền quyết định theo lĩnh vực', detail: 'Ghi rõ ai quyết cuối cùng ở mỗi vùng: trải nghiệm người dùng, kiến trúc kỹ thuật, thông điệp truyền thông, rủi ro pháp lý. Không có bản đồ này thì mỗi quyết định đều bị bàn lại bởi người không đủ dữ kiện.' },
      { name: 'Thoả thuận định nghĩa hoàn thành chung', detail: 'Viết một danh sách kiểm mà mọi bên cùng ký: cái gì phải có thì hạng mục mới được gọi là xong. Đây là chỗ rẻ nhất để phát hiện rằng bốn nghề đang dùng bốn tiêu chuẩn khác nhau.' },
      { name: 'Trao đổi bằng hiện vật, không bằng mô tả', detail: 'Đưa bản phác, bản mẫu, dữ liệu thật, màn hình thật ra bàn càng sớm càng tốt. Một bản vẽ nháp cắt được nhiều hiểu nhầm hơn ba cuộc họp mô tả bằng lời.' },
      { name: 'Rà lại giao diện sau mỗi mốc', detail: 'Sau mỗi lần giao, hỏi từng nghề: chỗ nào anh phải hỏi lại nhiều nhất, và anh cần gì sớm hơn ở lần sau. Trả lời hai câu này lặp lại vài vòng là cách nhóm đa chuyên môn tự học cách phối hợp.' },
    ],
    scenario:
      'Một nhóm ra mắt tính năng thanh toán trả góp gồm người làm sản phẩm, lập trình viên, thiết kế, marketing và một chuyên viên pháp chế. Trong hai tuần đầu, mỗi bên dùng từ “ra mắt” theo một nghĩa: marketing hiểu là ngày chạy quảng cáo, lập trình hiểu là ngày mã lên môi trường thật, pháp chế hiểu là ngày điều khoản được duyệt. Nhóm dừng lại một buổi, viết từ điển 14 từ và một danh sách kiểm định nghĩa hoàn thành mà cả năm bên cùng ký, trong đó ghi rõ điều khoản phải được duyệt trước ngày chạy quảng cáo ít nhất bảy ngày. Chính dòng đó cứu họ: bản duyệt pháp chế quay lại với hai yêu cầu sửa giao diện, và vì phát hiện trước một tuần nên chỉ phải dời một hạng mục thay vì hoãn cả đợt ra mắt.',
    comparison: [
      { weak: 'Mỗi nghề làm phần của mình rồi ghép ở cuối, tin rằng ai cũng hiểu yêu cầu chung.', mature: 'Đưa hiện vật thô ra bàn sớm và cho các nghề chạm vào nhau từ tuần đầu, chấp nhận bản đầu xấu để phát hiện lệch sớm.' },
      { weak: 'Người ngoài chuyên môn nêu ý kiến bị gạt bằng câu “anh không hiểu kỹ thuật đâu”.', mature: 'Chuyển ý kiến của họ thành một câu hỏi về ràng buộc hoặc rủi ro, trả lời bằng ngôn ngữ hệ quả chứ không bằng thuật ngữ nghề.' },
      { weak: 'Coi pháp chế, bảo mật hay vận hành là trạm kiểm tra ở cuối đường.', mature: 'Mời họ vào từ giai đoạn phác thảo với một câu hỏi hẹp, để ràng buộc của họ trở thành đầu vào thiết kế chứ không thành lệnh dừng ở phút chót.' },
    ],
    mistakes: [
      'Giả định rằng những từ quen thuộc như “xong”, “ưu tiên cao” hay “bản thử” có nghĩa giống nhau với mọi nghề, nên bỏ qua bước lập từ điển và trả giá bằng nhiều tuần làm lại.',
      'Dùng thuật ngữ nghề như một hàng rào để khỏi phải giải thích, khiến các nghề khác ngừng đặt câu hỏi và ngừng phát hiện rủi ro giúp bạn.',
      'Để việc dịch giữa các nghề phụ thuộc hoàn toàn vào một cá nhân duy nhất, nên khi người đó nghỉ thì nhóm mất luôn khả năng phối hợp mà không ai biết vì sao.',
    ],
    worksheet: [
      'Liệt kê năm từ mà các nghề trong nhóm bạn đang dùng theo nghĩa khác nhau. Hỏi hai người từ hai nghề định nghĩa từng từ và ghi chỗ lệch.',
      'Với hạng mục đang làm, ai là người quyết cuối ở mỗi vùng chuyên môn? Có vùng nào chưa ai được ghi tên không?',
      'Định nghĩa hoàn thành hiện tại của nhóm gồm bao nhiêu mục, và có mục nào của nghề khác nghề bạn không?',
      'Hiện vật gần nhất bạn đưa ra bàn là gì (bản phác, mẫu, số liệu)? Nếu tuần này chưa có, tuần tới bạn đưa được cái gì?',
      'Nghề nào trong nhóm được mời vào muộn nhất? Nếu mời họ sớm hơn một mốc, bạn cần hỏi họ đúng câu hỏi nào?',
    ],
    exercises: [
      { label: 'Từ điển 10 từ', text: 'Thu thập 10 thuật ngữ đang gây hiểu nhầm, hỏi mỗi nghề định nghĩa riêng, rồi chốt một nghĩa chung và dán công khai. Ghi lại số cặp định nghĩa lệch nhau bạn tìm được.', level: 'e' },
      { label: 'Dịch một câu', text: 'Lấy một câu chuyên môn bạn hay nói và viết lại bằng ngôn ngữ hệ quả cho người ngoài nghề: chuyện gì xảy ra, ảnh hưởng ai, tốn bao lâu. Thử với một đồng nghiệp khác nghề và sửa theo phản ứng của họ.', level: 'e' },
      { label: 'Bản đồ người quyết', text: 'Vẽ bảng bốn đến sáu vùng chuyên môn của dự án và ghi tên người quyết cuối ở mỗi vùng. Gửi cho cả nhóm và ghi lại những vùng có tranh chấp.', level: 'e' },
      { label: 'Danh sách kiểm chung', text: 'Cùng các nghề soạn một danh sách kiểm định nghĩa hoàn thành, trong đó mỗi nghề đóng góp ít nhất hai mục. Áp dụng cho hạng mục tiếp theo và đếm số mục bị bỏ sót lần đầu.', level: 'm' },
      { label: 'Đưa hiện vật sớm', text: 'Với việc đang làm, đưa ra một bản thô — phác tay, dữ liệu mẫu, màn hình giả — sớm hơn thói quen của bạn ít nhất một tuần. Ghi lại những hiểu nhầm được phát hiện nhờ bản thô đó.', level: 'm' },
      { label: 'Mời nghề bị mời muộn', text: 'Xác định nghề thường được mời vào cuối cùng (pháp chế, vận hành, hỗ trợ khách hàng) và mời họ vào giai đoạn phác thảo với một câu hỏi hẹp. Ghi lại ràng buộc mới bạn biết được.', level: 'm' },
      { label: 'Một ngày đổi ghế', text: 'Dành nửa ngày ngồi cạnh một người thuộc nghề khác trong nhóm và quan sát công việc thật của họ. Viết ba điều bạn đã hiểu sai về ràng buộc của nghề đó và chia sẻ lại với nhóm.', level: 'h' },
      { label: 'Bảy ngày không thuật ngữ', text: 'Thử thách 7 ngày: trong mọi trao đổi với người ngoài nghề, bạn không dùng thuật ngữ chuyên môn nào mà không kèm một câu giải thích bằng hệ quả. Ngày 7, hỏi hai người xem họ có theo được các trao đổi tuần này dễ hơn không.', level: 'h' },
    ],
    checkpoints: [
      {
        q: 'Vì sao lập từ điển thuật ngữ lại đáng thời gian, khi ai cũng nghĩ mình hiểu các từ đó rồi?',
        a: 'Chính vì ai cũng nghĩ mình hiểu nên không ai hỏi lại, và sự lệch nghĩa chỉ lộ ra khi đã tốn công làm sai. Các từ nguy hiểm nhất không phải thuật ngữ khó mà là những từ quen thuộc như “xong”, “bản thử”, “ưu tiên cao” — vì chúng đủ thông dụng để không ai nghi ngờ. Một buổi 60 phút lập từ điển thường cắt được nhiều tuần làm lại.',
      },
      {
        q: 'Một người ngoài chuyên môn phản đối phương án kỹ thuật của bạn. Cách xử lý có ích là gì?',
        a: 'Đừng phòng thủ bằng thuật ngữ. Hãy dịch phản đối của họ thành câu hỏi về ràng buộc: họ đang lo chi phí, thời gian, rủi ro pháp lý hay trải nghiệm khách hàng? Rồi trả lời bằng hệ quả đo được chứ không bằng cơ chế kỹ thuật. Rất thường xuyên, họ đang nhìn thấy một ràng buộc thật mà bạn không có tầm nhìn tới, và cách diễn đạt vụng về của họ che mất điều đó.',
      },
      {
        q: 'Vì sao mời pháp chế hoặc vận hành vào sớm lại rẻ hơn để họ duyệt ở cuối, dù nó làm giai đoạn đầu chậm hơn?',
        a: 'Vì ràng buộc của họ hầu như không thương lượng được, nên nếu xuất hiện ở cuối thì cách duy nhất là làm lại hoặc hoãn. Đưa ràng buộc đó vào từ lúc phác thảo biến nó thành một điều kiện thiết kế, chi phí gần như bằng không. Mẹo thực hành là mời họ với một câu hỏi hẹp — “có điều gì trong hướng này chắc chắn không được phép?” — thay vì đề nghị họ duyệt cả phương án chưa hoàn chỉnh.',
      },
    ],
    plan7:
      'Ngày 1: thu thập 10 thuật ngữ gây hiểu nhầm và hỏi mỗi nghề định nghĩa riêng. Ngày 2: chốt từ điển chung và dán công khai. Ngày 3: vẽ bản đồ người quyết cuối theo từng vùng chuyên môn. Ngày 4: cùng các nghề soạn danh sách kiểm định nghĩa hoàn thành. Ngày 5: đưa một hiện vật thô ra bàn sớm hơn thói quen. Ngày 6: mời nghề hay bị mời muộn vào với một câu hỏi hẹp. Ngày 7: chạy buổi rà giao diện, hỏi từng nghề chỗ nào phải hỏi lại nhiều nhất.',
    evidence:
      'Giữ ba hiện vật: từ điển thuật ngữ chung có ghi các định nghĩa lệch nhau bạn phát hiện, danh sách kiểm định nghĩa hoàn thành có đóng góp của từng nghề, và biên bản buổi rà giao diện sau mốc. Trong phỏng vấn cho vị trí sản phẩm, quản lý dự án hoặc kỹ sư cấp cao, bộ này trả lời trực tiếp câu hỏi “bạn làm việc với người ngoài chuyên môn thế nào”: nó cho thấy bạn coi việc dịch giữa các nghề là một phần công việc có sản phẩm cụ thể, chứ không phải một phẩm chất mềm khó kiểm chứng.',
    references: [
      { label: 'Silicon Valley Product Group (Marty Cagan) — bài viết về nhóm sản phẩm đa chuyên môn', url: 'https://www.svpg.com/', type: 'article' },
      { label: 'Nielsen Norman Group — nghiên cứu về phối hợp giữa thiết kế, kỹ thuật và kinh doanh', url: 'https://www.nngroup.com/', type: 'article' },
    ],
  }),
];
