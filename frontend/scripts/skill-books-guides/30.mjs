import { guide } from '../skill-guide-builder.mjs';

export default [
  // ─────────────────────────────────────────────────────────────────────────
  // Chương 1 — Nền tảng giao tiếp
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Giao tiếp không kết thúc ở chỗ bạn nói xong hay bấm gửi. Nó chỉ hoàn tất khi người nhận dựng lại được trong đầu họ một phiên bản đủ giống với thứ bạn định truyền, đủ để họ hành động đúng. Vì vậy thước đo duy nhất đáng tin của giao tiếp không phải là bạn thấy mình diễn đạt trôi chảy ra sao, mà là việc người kia làm sau đó có khớp với điều bạn cần hay không. Người có kỹ năng nền tảng luôn thiết kế ngược: xác định hành vi mong muốn ở đầu bên kia trước, rồi mới chọn nội dung, kênh và thời điểm.',
    why: {
      work: 'Phần lớn việc phải làm lại trong công ty không sinh ra từ năng lực chuyên môn kém mà từ một câu dặn thiếu ngữ cảnh: thiếu hạn chót, thiếu tiêu chí xong, thiếu tên người quyết. Mỗi lần như vậy tiêu tốn nhiều giờ công hơn hẳn thời gian lẽ ra cần để viết thêm hai dòng ngay từ đầu.',
      interview:
        'Nhà tuyển dụng không quan sát được bạn làm việc, họ chỉ quan sát được cách bạn kể lại việc mình đã làm. Ứng viên trả lời lan man khiến người nghe phải tự ghép mảnh, và điểm số thực chất phản ánh công sức ghép mảnh đó. Ai nói được bối cảnh, vai trò riêng của mình, hành động và kết quả trong hai phút sẽ luôn được nhớ rõ hơn người có thành tích lớn hơn nhưng kể rối.',
      study:
        'Khi học nhóm hoặc hỏi thầy cô, chất lượng câu trả lời bạn nhận được bị chặn trên bởi chất lượng câu hỏi bạn đặt ra. Một câu hỏi có nêu rõ bạn đã thử gì, hiểu tới đâu và mắc ở bước nào sẽ nhận về lời giải đúng chỗ; một câu hỏi kiểu "em không hiểu bài này" buộc người trả lời phải giảng lại từ đầu và cả hai cùng mất thời gian.',
      life: 'Rất nhiều căng thẳng trong gia đình đến từ việc hai bên nói về hai chuyện khác nhau mà tưởng là một, hoặc nói vào lúc bên kia không còn năng lực nghe. Nhận ra kênh và thời điểm cũng là một phần của thông điệp giúp bạn tránh những cuộc cãi vã mà nội dung thực ra không mâu thuẫn.',
    },
    framework: [
      {
        name: 'Xác định hành vi đích',
        detail:
          'Trước khi soạn bất cứ câu nào, viết ra một dòng: sau khi nhận thông tin này, người kia phải làm gì, trước lúc nào. Nếu bạn không viết nổi dòng đó thì thông điệp chưa sẵn sàng để gửi, và việc gửi sớm chỉ chuyển gánh nặng suy nghĩ sang người nhận.',
      },
      {
        name: 'Đọc người nhận',
        detail:
          'Ghi ra ba điều: họ đã biết sẵn gì, họ quan tâm chỉ số nào, và họ sợ điều gì nhất trong việc này. Cùng một tin về chậm tiến độ, kế toán quan tâm dòng tiền, khách hàng quan tâm ngày nhận, sếp quan tâm ai đang xử lý — ba người cần ba phiên bản khác nhau của cùng một sự thật.',
      },
      {
        name: 'Chọn kênh theo hai trục',
        detail:
          'Trục thứ nhất là độ phức tạp, trục thứ hai là độ nhạy cảm. Việc đơn giản và không nhạy cảm thì nhắn tin; phức tạp nhưng không nhạy cảm thì viết tài liệu rồi gửi; nhạy cảm thì gọi hoặc gặp trực tiếp rồi mới tóm tắt lại bằng văn bản. Sai kênh làm hỏng cả nội dung đúng.',
      },
      {
        name: 'Đặt kết luận lên trước',
        detail:
          'Câu đầu tiên nói thẳng bạn cần gì hoặc chuyện gì đã xảy ra; phần giải thích, dữ liệu và lịch sử để phía sau. Người bận đọc ba dòng đầu rồi quyết định có đọc tiếp không, nên chôn kết luận ở cuối đồng nghĩa với việc chấp nhận rủi ro nó không bao giờ được đọc.',
      },
      {
        name: 'Đóng vòng phản hồi',
        detail:
          'Kết thúc bằng một thao tác kiểm chứng: nhờ người kia nhắc lại việc họ sẽ làm, hoặc gửi một dòng tóm tắt và xin xác nhận. Bước này tốn khoảng ba mươi giây và là bước duy nhất trong cả quy trình cho bạn bằng chứng rằng thông điệp đã tới, chứ không chỉ đã được gửi.',
      },
    ],
    scenario:
      'Một điều phối viên kho của công ty giao nhận nhắn cho tài xế: "Chiều lấy hàng ở kho B nhé". Tài xế tới lúc 17h20, bảo vệ đã khoá cửa, lô hàng lỡ chuyến bay và khách phạt hợp đồng. Sau vụ đó cô đổi mẫu tin nhắn cố định gồm bốn dòng: việc cần làm, khung giờ có mặt, tên và số người bàn giao tại chỗ, và câu "nhắn lại giờ dự kiến tới". Tài xế bắt buộc trả lời một dòng trước khi xuất phát. Ba tuần sau, nhóm không còn chuyến nào tới sau giờ đóng kho, và những lần vướng kẹt xe đều được báo trước ít nhất một giờ nên có thời gian đổi xe.',
    comparison: [
      {
        weak: 'Gửi một đoạn dài kể toàn bộ diễn biến rồi để người đọc tự rút ra việc phải làm.',
        mature: 'Câu đầu nêu yêu cầu và hạn, các đoạn sau mới là diễn biến cho ai cần kiểm chứng.',
      },
      {
        weak: 'Chọn kênh theo thói quen của bản thân, tin xấu cũng nhắn qua chat vì ngại gọi.',
        mature: 'Tin nhạy cảm thì gọi hoặc gặp trước, sau đó gửi văn bản tóm tắt để lưu vết và tránh hiểu sai.',
      },
      {
        weak: 'Coi im lặng của người nhận là đã hiểu và đã đồng ý.',
        mature: 'Xin một xác nhận cụ thể, ví dụ nhờ họ nói lại hạn chót bằng chính lời của họ, trước khi coi việc đã được giao.',
      },
      {
        weak: 'Dùng cùng một cách nói cho sếp, cho khách và cho đồng nghiệp cùng nhóm.',
        mature: 'Giữ nguyên sự thật nhưng đổi lát cắt theo mối quan tâm của từng người: rủi ro, ngày giao, hay đầu việc kỹ thuật.',
      },
    ],
    mistakes: [
      'Tin rằng nói rõ ràng là đủ, nên khi người khác hiểu sai thì kết luận họ không chú ý, thay vì xem lại thông điệp đã thiếu ngữ cảnh nào mà bản thân mình vô thức cho là hiển nhiên.',
      'Nhồi nhiều mục đích vào một lần nói: vừa báo tin, vừa xin duyệt, vừa góp ý cá nhân, khiến người nghe chỉ phản ứng với mục cuối cùng và hai mục kia rơi mất.',
      'Bỏ qua trạng thái của người nghe, ví dụ trình bày kế hoạch quý ngay sau khi cả nhóm vừa xử lý xong một sự cố kéo dài, rồi ngạc nhiên vì không ai có ý kiến gì.',
    ],
    worksheet: [
      'Chép lại nguyên văn tin nhắn hoặc email công việc gần nhất bạn gửi mà người nhận phải hỏi lại. Họ đã hỏi lại điều gì?',
      'Với thông điệp đó, hành vi đích bạn cần ở người nhận là gì và trước thời điểm nào? Viết đúng một dòng.',
      'Người nhận đó quan tâm nhất tới chỉ số hay hệ quả nào? Nếu bạn không chắc, ghi ra cách bạn sẽ tìm hiểu trong tuần này.',
      'Kênh bạn dùng có khớp với độ nhạy cảm của tin không? Nếu làm lại, bạn giữ kênh nào và đổi kênh nào?',
      'Viết lại thông điệp đó theo thứ tự kết luận trước, kèm một câu yêu cầu xác nhận cụ thể ở cuối.',
    ],
    exercises: [
      {
        label: 'Một dòng đích',
        text: 'Trong ba ngày, trước mỗi email công việc bạn gửi, viết ra giấy nháp một dòng "người nhận phải làm gì, trước khi nào" rồi mới soạn. Cuối ngày đếm bao nhiêu email bạn không viết nổi dòng đó và xem chúng có thực sự cần gửi không.',
        level: 'e',
      },
      {
        label: 'Đảo ngược thứ tự',
        text: 'Lấy năm tin nhắn dài bạn đã gửi tuần trước, viết lại mỗi tin sao cho câu đầu tiên chứa yêu cầu và hạn chót. So độ dài bản cũ và bản mới, ghi số chữ cắt được.',
        level: 'e',
      },
      {
        label: 'Ba phiên bản một sự thật',
        text: 'Chọn một tin cần báo trong công việc, ví dụ chậm hai ngày. Viết ba phiên bản cho ba người: quản lý trực tiếp, khách hàng, và đồng nghiệp phải điều chỉnh theo. Giữ nguyên dữ kiện, chỉ đổi phần được nhấn.',
        level: 'e',
      },
      {
        label: 'Bảng chọn kênh',
        text: 'Lập bảng bốn ô theo hai trục phức tạp và nhạy cảm, xếp mười tình huống giao tiếp thường gặp của bạn vào bốn ô đó. Đánh dấu những ô bạn đang chọn kênh sai theo thói quen.',
        level: 'm',
      },
      {
        label: 'Nhờ nhắc lại',
        text: 'Trong một tuần, mỗi lần giao việc bạn kết thúc bằng câu "để chắc là mình nói đủ, bạn nhắc lại giúp phần bạn sẽ làm nhé". Ghi lại số lần phần nhắc lại khác với ý bạn định nói.',
        level: 'm',
      },
      {
        label: 'Ghi âm và nghe lại',
        text: 'Ghi âm một cuộc gọi công việc của chính bạn khi được phép, nghe lại và đếm ba thứ: số câu dài trên hai mươi giây, số lần bạn nói lại cùng một ý, và số câu hỏi bạn đặt cho phía kia.',
        level: 'm',
      },
      {
        label: 'Rà lại tuần hỏng',
        text: 'Chọn tuần gần nhất có việc phải làm lại. Truy ngược từng việc và phân loại nguyên nhân: thiếu thông tin trong thông điệp, sai kênh, sai thời điểm, hay thực sự là lỗi chuyên môn. Tính tỷ lệ ba loại đầu.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: sổ hiểu nhầm',
        text: 'Bảy ngày liền, mỗi ngày ghi một lần bạn hoặc người khác hiểu sai một thông điệp, kèm câu nói gốc và chỗ hiểu lệch. Ngày thứ bảy phân loại xem lỗi nằm ở từ ngữ mơ hồ, ở giả định ngầm, hay ở kênh truyền, rồi chọn một loại để tập trung sửa trong tháng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao "tôi đã nói rồi" không phải là bằng chứng bạn đã giao tiếp thành công?',
        a: 'Vì nói là hành động của người gửi, còn kết quả nằm ở người nhận. Thông điệp có thể tới đúng chữ nhưng lệch nghĩa do người nhận thiếu ngữ cảnh mà bạn cho là hiển nhiên, hoặc tới đúng nghĩa nhưng sai thời điểm nên không được ghi nhớ. Bằng chứng thành công chỉ có thể là hành vi hoặc lời nhắc lại của người nhận, không phải trí nhớ của người nói.',
      },
      {
        q: 'Cùng một sự thật là dự án chậm hai ngày, vì sao phải soạn ba phiên bản cho sếp, khách hàng và đồng nghiệp?',
        a: 'Vì ba người phải ra ba quyết định khác nhau. Sếp cần biết ai đang xử lý và rủi ro có lan sang việc khác không, nên phiên bản của họ nhấn vào phương án và người chịu trách nhiệm. Khách hàng cần biết ngày nhận mới và mình phải làm gì, nên phiên bản của họ nhấn vào mốc và cam kết. Đồng nghiệp phía sau cần biết phần việc của họ dịch đi bao nhiêu. Đây không phải nói khác nhau về sự thật, mà là chọn lát cắt của cùng một sự thật theo quyết định mà từng người phải đưa ra.',
      },
      {
        q: 'Đặt kết luận lên đầu có làm mất tính lịch sự trong văn hoá giao tiếp Việt Nam không?',
        a: 'Không, nếu tách hai lớp: lớp quan hệ và lớp thông tin. Vẫn giữ một câu chào và một câu ghi nhận công sức phía kia, nhưng ngay sau đó là kết luận và yêu cầu, rồi mới tới diễn giải. Cái gây khó chịu thường không phải sự thẳng thắn mà là sự cộc lốc, và hai thứ đó tách được khỏi nhau bằng đúng một câu mở đầu.',
      },
    ],
    plan7:
      'Ngày 1: đọc lại mười thông điệp công việc gần nhất và đánh dấu cái nào không có hành vi đích rõ ràng. Ngày 2: viết mẫu tin nhắn giao việc bốn dòng của riêng bạn và dùng thử. Ngày 3: chỉ tập đặt kết luận lên câu đầu, chưa đổi gì khác. Ngày 4: lập bảng chọn kênh và áp dụng cho mọi trao đổi trong ngày. Ngày 5: mỗi lần giao việc đều xin một câu nhắc lại, ghi số lần lệch. Ngày 6: chọn một người bạn hay hiểu nhầm nhất và hỏi thẳng họ cần thêm thông tin gì mỗi lần bạn nhờ việc. Ngày 7: viết lại mẫu tin nhắn của bạn dựa trên những gì thu được và dán nó vào công cụ bạn dùng hằng ngày.',
    evidence:
      'Bằng chứng dễ trưng nhất cho kỹ năng nền tảng là một mẫu văn bản chuẩn do bạn thiết kế và cả nhóm đang dùng: mẫu giao việc, mẫu bàn giao ca, mẫu báo sự cố. Lưu lại bản trước và bản sau kèm một con số đo được, ví dụ số lần hỏi lại trên mỗi mười lần giao việc giảm từ bao nhiêu xuống bao nhiêu trong một tháng. Trong CV, ghi thành kết quả có chủ ngữ rõ: "Thiết kế mẫu bàn giao ca cho 12 tài xế, giảm số chuyến đến sai khung giờ từ 6 xuống 0 trong ba tuần". Trong phỏng vấn, mang theo đúng một mẫu đó và nói được vì sao mỗi dòng trong mẫu tồn tại — chi tiết này phân biệt người thực sự đã làm với người chỉ đọc về nó.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Communication', url: 'https://hbr.org/topic/subject/communication', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 2 — Lắng nghe chủ động — Active Listening
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Lắng nghe chủ động là việc tạm hoãn quá trình dựng câu trả lời trong đầu để dành toàn bộ năng lực xử lý cho việc tái dựng đúng ý người kia, rồi kiểm chứng bản tái dựng đó bằng lời trước khi phản hồi. Nó là kỹ năng vận động chứ không phải thái độ: có thao tác cụ thể, có thể quan sát từ bên ngoài, và người khác biết được bạn có làm hay không. Dấu hiệu nhận ra là người đối diện nói câu "đúng rồi, ý tôi là vậy" trước khi bạn đưa ra ý kiến của mình.',
    why: {
      work: 'Trong các buổi họp lấy yêu cầu, thứ đắt nhất không phải thời gian họp mà là những yêu cầu bị nghe thiếu rồi triển khai suốt nhiều tuần. Một lần phản chiếu lại yêu cầu bằng lời của mình mất chưa tới một phút và thường lôi ra được điều kiện ẩn mà chính người đặt yêu cầu chưa nói thành lời.',
      interview:
        'Nhiều ứng viên trượt vì trả lời câu hỏi mà họ tưởng người phỏng vấn đã hỏi. Thói quen nhắc lại ngắn gọn câu hỏi trước khi trả lời vừa mua thêm vài giây suy nghĩ, vừa cho phép người phỏng vấn chỉnh hướng ngay nếu bạn hiểu lệch, thay vì để bạn nói ba phút lạc đề rồi đánh giá thấp cả phần chuyên môn.',
      study:
        'Nghe giảng thụ động tạo ra cảm giác hiểu bài rất mạnh nhưng lưu lại rất ít. Nghe chủ động trong lớp nghĩa là liên tục tự diễn đạt lại ý thầy cô vừa nói bằng ngôn ngữ của mình và ghi chỗ mình không diễn đạt nổi, vì chính chỗ đó mới là phần chưa hiểu thật.',
      life: 'Khi người thân đang buồn, phản xạ đưa lời khuyên ngay thường bị tiếp nhận như sự phủ nhận cảm xúc. Nghe hết và gọi tên đúng điều họ đang trải qua trước khi bàn giải pháp là khác biệt giữa một cuộc trò chuyện làm nhẹ đi và một cuộc trò chuyện làm nặng thêm.',
    },
    framework: [
      {
        name: 'Dọn kênh trước khi nghe',
        detail:
          'Úp điện thoại, đóng tab đang mở, và nếu đang bận thì nói thẳng "cho mình mười phút nữa để nghe cho tử tế" thay vì nghe nửa vời. Nghe nửa vời tệ hơn hoãn lại vì nó tiêu tốn niềm tin mà không thu được thông tin.',
      },
      {
        name: 'Nghe hết một lượt',
        detail:
          'Không cắt ngang, không bắt đầu soạn phản biện. Nếu sợ quên ý mình, ghi một từ khoá ra giấy rồi quay lại nghe. Mục tiêu của lượt này là thu dữ liệu, không phải đánh giá dữ liệu.',
      },
      {
        name: 'Phản chiếu nội dung',
        detail:
          'Nói lại phần cốt lõi bằng ngôn ngữ của bạn, không lặp nguyên văn: "Nếu mình hiểu đúng, vấn đề là đơn hàng bị trừ kho hai lần khi khách bấm thanh toán lại, và nó xảy ra từ đợt cập nhật tuần trước". Lặp nguyên văn chứng minh bạn nghe được âm thanh, diễn đạt lại mới chứng minh bạn hiểu nghĩa.',
      },
      {
        name: 'Gọi tên mức độ và cảm xúc',
        detail:
          'Thêm một câu về trạng thái phía kia và mức độ nghiêm trọng theo góc nhìn của họ: "Nghe như việc này đang làm anh mất uy tín với khách chứ không chỉ là lỗi kỹ thuật". Câu này thường mở ra thông tin mà phần mô tả sự việc không chứa.',
      },
      {
        name: 'Đào bằng câu hỏi mở',
        detail:
          'Sau khi phía kia xác nhận bạn hiểu đúng, hỏi một câu mở dùng lại chính từ họ đã dùng để đi sâu thêm một lớp. Dùng từ của họ giữ cho cuộc trao đổi ở lại trên bản đồ của họ thay vì bị kéo sang bản đồ của bạn.',
      },
      {
        name: 'Chốt lại và giao vòng sau',
        detail:
          'Kết thúc bằng tóm tắt ba dòng: điều đã hiểu, điều còn chưa rõ, và việc mỗi bên sẽ làm tiếp. Không có bước này thì mọi công sức nghe ở trên chỉ tồn tại trong trí nhớ và biến mất trong hai ngày.',
      },
    ],
    scenario:
      'Một nhân viên hỗ trợ khách hàng của công ty phần mềm bán hàng nhận cuộc gọi từ chủ một chuỗi ba cửa hàng, giọng rất gắt, nói phần mềm tính sai tồn kho. Thay vì mở tài liệu hướng dẫn, cô để khách nói hết bốn phút, ghi lại từ khoá, rồi phản chiếu: "Anh đang thấy số tồn trên máy nhiều hơn ngoài kệ, và nó lệch nhiều nhất ở cửa hàng quận 7 vào cuối ngày, đúng không ạ". Khách xác nhận và bổ sung chi tiết chưa từng nói: chỉ lệch từ khi nhân viên mới bắt đầu dùng chức năng huỷ đơn. Câu hỏi mở tiếp theo lôi ra được rằng nhân viên huỷ đơn khi khách đã lấy hàng. Vấn đề không nằm ở phần mềm mà ở quy trình, và cuộc gọi chuyển từ phàn nàn sang cùng thiết kế lại thao tác cho nhân viên bán hàng.',
    comparison: [
      {
        weak: 'Vừa nghe vừa nghĩ câu phản bác, chờ người kia dứt lời để nói phần mình đã chuẩn bị.',
        mature: 'Nghe hết, phản chiếu lại, đợi phía kia xác nhận, rồi mới đưa quan điểm — quan điểm lúc này còn tính tới thông tin vừa nghe.',
      },
      {
        weak: 'Gật đầu và nói "ừ, hiểu rồi" liên tục để tỏ ra đang theo dõi.',
        mature: 'Nói lại nội dung bằng lời của mình, chấp nhận rủi ro bị sửa, vì bị sửa ngay lúc đó rẻ hơn nhiều so với hiểu sai suốt hai tuần.',
      },
      {
        weak: 'Nghe xong lập tức đưa giải pháp, kể cả khi người kia chỉ đang cần được ghi nhận.',
        mature: 'Hỏi một câu ngắn để phân loại nhu cầu: "Anh muốn mình cùng tìm cách xử lý luôn, hay muốn mình nghe cho hết đã".',
      },
    ],
    mistakes: [
      'Coi lắng nghe chủ động là bộ động tác xã giao: gật đầu, giữ giao tiếp mắt, ừ hử đúng nhịp, trong khi đầu vẫn đang chạy việc khác — người đối diện thường nhận ra qua chỗ bạn tóm tắt sai một chi tiết mà họ vừa nhấn mạnh.',
      'Phản chiếu bằng cách lặp nguyên văn câu vừa nghe, khiến người nói cảm thấy bị nhại lại chứ không phải được hiểu, nhất là khi họ đang bực.',
      'Dùng câu hỏi để dẫn dắt về kết luận có sẵn của mình, kiểu "vậy tức là do bên vận hành làm sai đúng không", biến việc nghe thành việc thu thập bằng chứng cho giả thuyết đã chốt từ trước.',
    ],
    worksheet: [
      'Nhớ lại cuộc trao đổi công việc gần nhất mà bạn cắt lời người khác. Bạn cắt vào lúc nào và vì lo mất điều gì?',
      'Trong cuộc đó, nếu phải phản chiếu lại ý họ bằng một câu không lặp từ nào của họ, bạn viết thế nào?',
      'Có chi tiết nào họ nhắc tới hai lần trở lên mà bạn đã bỏ qua không? Ghi lại chi tiết đó.',
      'Bạn thường mất tập trung nghe ở giây thứ bao nhiêu, và tín hiệu nào báo bạn đã trôi đi (nghĩ tới việc khác, mở màn hình, nhìn đồng hồ)?',
      'Viết ra một câu hỏi mở dùng đúng ba từ mà người kia đã dùng, để hỏi trong lần gặp tới.',
    ],
    exercises: [
      {
        label: 'Ba mươi giây im',
        text: 'Trong hai ngày, mỗi lần trò chuyện công việc, tự đặt luật không nói gì trong ba mươi giây đầu sau khi người kia bắt đầu, kể cả để đồng tình. Ghi lại điều bạn nghe được mà bình thường sẽ bị lời của chính bạn che mất.',
        level: 'e',
      },
      {
        label: 'Diễn đạt lại không lặp từ',
        text: 'Nghe một đoạn podcast hoặc bản tin dài ba phút, viết lại nội dung chính bằng năm câu không dùng lại các từ khoá của người nói. Kiểm bằng cách đọc cho một người chưa nghe và hỏi họ có hiểu không.',
        level: 'e',
      },
      {
        label: 'Đếm câu hỏi và câu khẳng định',
        text: 'Trong một cuộc họp, gạch đầu dòng mỗi lần bạn nói, phân loại là câu hỏi hay câu khẳng định. Cuối buổi tính tỷ lệ và so với vai trò bạn đảm nhiệm trong buổi đó.',
        level: 'e',
      },
      {
        label: 'Phản chiếu trước phản biện',
        text: 'Trong một tuần, mỗi khi định phản đối ai đó, bắt buộc phải nói trước một câu tóm tắt ý họ và đợi họ gật. Ghi lại số lần bạn phát hiện mình định phản đối một ý mà họ không hề nói.',
        level: 'm',
      },
      {
        label: 'Gọi tên cảm xúc',
        text: 'Trong năm cuộc trao đổi có căng thẳng, thêm đúng một câu nêu trạng thái phía kia theo cách phỏng đoán chứ không khẳng định. Ghi lại phản ứng: họ đính chính, họ xác nhận, hay họ nói thêm điều mới.',
        level: 'm',
      },
      {
        label: 'Phỏng vấn người dùng nội bộ',
        text: 'Chọn một đồng nghiệp ở phòng ban khác dùng kết quả công việc của bạn. Hẹn hai mươi phút, chỉ hỏi và nghe, không giải thích và không tự bào chữa lần nào. Cuối buổi gửi họ bản tóm tắt ba dòng và xin họ sửa.',
        level: 'm',
      },
      {
        label: 'Nghe lại cuộc họp của chính mình',
        text: 'Ghi âm hoặc xem lại bản ghi một cuộc họp bạn chủ trì. Đếm số lần bạn cắt lời, thời lượng nói của bạn trên tổng, và số lần bạn tóm tắt lại ý người khác. Đặt mục tiêu cụ thể cho ba con số đó ở cuộc họp sau.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: mỗi ngày một lần nghe trọn vẹn',
        text: 'Bảy ngày, mỗi ngày chọn một cuộc trò chuyện để thực hiện đủ sáu bước, từ dọn kênh tới chốt ba dòng, và viết nhật ký ngắn: bạn đã suýt cắt lời ở đâu, phản chiếu của bạn bị sửa chỗ nào, và thông tin mới nào xuất hiện sau khi bạn gọi tên cảm xúc. Ngày thứ bảy đọc lại và tìm dạng thông tin bạn hay bỏ sót nhất.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Phân biệt phản chiếu nội dung với nhại lại lời người nói.',
        a: 'Nhại lại là lặp gần nguyên văn, chứng minh bạn thu được âm thanh nhưng không chứng minh gì về mức hiểu. Phản chiếu là diễn đạt lại bằng cấu trúc và từ ngữ của bạn, có rút gọn và có sắp xếp lại theo quan hệ nguyên nhân kết quả, nên nó bộc lộ ngay chỗ bạn hiểu lệch và cho phía kia cơ hội sửa. Dấu hiệu phản chiếu tốt là người nói bổ sung thêm chi tiết mới ngay sau đó.',
      },
      {
        q: 'Khi người đối diện đang rất tức giận, vì sao không nên đưa giải pháp ngay dù bạn biết chắc cách xử lý?',
        a: 'Vì khi cảm xúc đang cao, phần lớn năng lực chú ý của họ dành cho việc được thừa nhận chứ không cho việc tiếp nhận quy trình mới. Giải pháp đưa ra lúc đó dễ bị nghe thành lời phủ nhận rằng chuyện này không đáng bực. Trình tự hiệu quả hơn là phản chiếu, gọi tên mức độ, đợi nhịp thở của họ chậm lại, rồi mới hỏi họ có muốn nghe hướng xử lý không.',
      },
      {
        q: 'Lắng nghe chủ động có làm cuộc họp dài ra không?',
        a: 'Trong từng cuộc thì có, thêm khoảng vài chục giây mỗi lượt. Trên tổng chu kỳ công việc thì thường ngược lại, vì phần lớn thời gian bị mất không nằm ở buổi họp mà nằm ở các vòng làm lại do hiểu sai yêu cầu. Cách kiểm chứng cho chính nhóm bạn là ghi lại trong một tháng số lần phải làm lại và nguyên nhân, rồi so với tháng có áp dụng bước phản chiếu.',
      },
    ],
    plan7:
      'Ngày 1: đo hiện trạng bằng cách đếm số lần bạn cắt lời trong một ngày làm việc. Ngày 2: chỉ luyện dọn kênh, mỗi cuộc trò chuyện đều úp điện thoại và đóng màn hình. Ngày 3: luyện phản chiếu nội dung trong ba cuộc trao đổi, chấp nhận cảm giác ngượng. Ngày 4: thêm bước gọi tên cảm xúc trong một cuộc có căng thẳng. Ngày 5: dùng câu hỏi mở lặp lại từ của người kia, ghi thông tin mới thu được. Ngày 6: chủ trì một cuộc họp ngắn với luật tự đặt là nói không quá một phần ba thời lượng. Ngày 7: gửi bản tóm tắt ba dòng cho ba người bạn đã trò chuyện trong tuần và xin họ sửa chỗ bạn hiểu lệch.',
    evidence:
      'Bằng chứng cho kỹ năng nghe là hiện vật do việc nghe sinh ra, không phải lời tự nhận. Giữ lại một bộ ghi chép phỏng vấn người dùng hoặc biên bản lấy yêu cầu do bạn viết, trong đó thấy rõ phần bạn tóm tắt lại và phần người kia đính chính — chính vết đính chính là bằng chứng bạn đã kiểm chứng thay vì đoán. Trong phỏng vấn, câu chuyện mạnh nhất là một lần bạn phát hiện yêu cầu thật khác hẳn yêu cầu ban đầu nhờ hỏi thêm một lớp, kèm hệ quả cụ thể như tránh được bao nhiêu ngày công đi sai hướng. Trong CV, viết thành vai trò và kết quả: "Phỏng vấn 15 chủ cửa hàng để làm rõ quy trình huỷ đơn, phát hiện nguyên nhân lệch tồn kho nằm ở thao tác người dùng, giảm số phiếu hỗ trợ cùng loại xuống một nửa trong hai tháng".',
    references: [
      { label: 'Center for Creative Leadership', url: 'https://www.ccl.org/', type: 'article' },
      { label: 'International Listening Association', url: 'https://listen.org/', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 3 — Giao tiếp rõ ràng, ngắn gọn
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Rõ ràng và ngắn gọn không phải là viết ít chữ, mà là làm cho công sức người đọc bỏ ra để lấy được ý chính giảm xuống mức thấp nhất có thể. Hai thứ này đôi khi mâu thuẫn: cắt bớt chữ mà bỏ mất điều kiện quan trọng thì ngắn nhưng không rõ. Nguyên tắc phân xử là ưu tiên rõ trước, ngắn sau, và mọi câu tồn tại được phải trả lời một trong ba câu hỏi của người đọc: chuyện gì, nó ảnh hưởng gì tới tôi, tôi phải làm gì.',
    why: {
      work: 'Người ra quyết định thường đọc tài liệu của bạn xen giữa hai cuộc họp, trên điện thoại. Một tài liệu bắt họ đọc tới trang ba mới biết bạn xin gì sẽ bị hoãn lại và thường không bao giờ được mở lại. Viết rõ là cách rẻ nhất để rút ngắn thời gian chờ quyết định.',
      interview:
        'Câu hỏi "giới thiệu về bản thân" là bài kiểm tra độ nén. Người kể tuần tự từ năm nhất đại học thường hết thời gian trước khi tới phần liên quan tới vị trí đang ứng tuyển. Người có kỹ năng nén nói được một câu định vị, ba mốc liên quan và một câu vì sao chỗ này, trong khoảng chín mươi giây.',
      study:
        'Bắt buộc mình tóm tắt một chương sách thành mười dòng là phép thử hiểu bài nghiêm khắc hơn đọc lại nhiều lần. Chỗ nào bạn không nén nổi mà phải chép lại nguyên văn chính là chỗ bạn mới thuộc chứ chưa hiểu.',
      life: 'Khi cần nhờ vả, khiếu nại hay hỏi thông tin từ một cơ quan, một tin nhắn nêu đúng đề nghị, mốc thời gian và thông tin định danh sẽ được xử lý nhanh hơn hẳn một đoạn kể dài. Người tiếp nhận cũng đang xử lý hàng chục yêu cầu và họ ưu tiên thứ dễ xử lý.',
    },
    framework: [
      {
        name: 'Nói kết luận trong một câu',
        detail:
          'Ép mình viết một câu duy nhất chứa toàn bộ điều quan trọng nhất, không có mệnh đề phụ. Nếu câu đó dài quá hai dòng nghĩa là bạn đang gộp hai thông điệp và cần tách thành hai văn bản riêng.',
      },
      {
        name: 'Một ý một câu',
        detail:
          'Tách các câu ghép dài thành nhiều câu ngắn, mỗi câu chỉ mang một mệnh đề. Cách kiểm nhanh là đếm số dấu phẩy: câu có quá ba dấu phẩy hầu như luôn cắt được thành hai câu mà không mất thông tin nào.',
      },
      {
        name: 'Thay trừu tượng bằng đo được',
        detail:
          'Đổi các từ co giãn thành con số hoặc mốc: "sớm" thành ngày cụ thể, "nhiều lỗi" thành số phiếu trên tổng, "một số khách hàng" thành mấy khách trên bao nhiêu. Mỗi từ co giãn còn sót lại là một chỗ người đọc buộc phải đoán, và họ sẽ đoán theo hướng bất lợi cho bạn.',
      },
      {
        name: 'Cắt phần không đổi được quyết định',
        detail:
          'Với từng đoạn, hỏi nếu xoá đoạn này thì người đọc có ra quyết định khác đi không. Nếu không, chuyển nó xuống phụ lục. Lịch sử công việc và quá trình vất vả của bạn hầu như luôn thuộc nhóm này.',
      },
      {
        name: 'Kiểm bằng người ngoài',
        detail:
          'Đưa bản nháp cho một người không làm cùng mảng, cho họ đọc trong sáu mươi giây rồi hỏi ba câu: mình đang xin gì, hạn khi nào, ai phải làm. Sai một câu là bản nháp chưa đạt, và bạn biết chính xác phải sửa ở đâu.',
      },
    ],
    scenario:
      'Một trợ lý dự án ở công ty xây dựng gửi email xin duyệt phát sinh vật tư dài hai trang, mở đầu bằng lịch sử ba tháng thi công. Email nằm im bốn ngày và công trình phải dừng chờ. Lần sau, cô viết lại theo một mẫu: dòng chủ đề ghi rõ cần duyệt gì và trước ngày nào, câu đầu tiên nêu số tiền và lý do trong hai dòng, tiếp theo là ba phương án kèm chi phí và thời gian, và phần diễn giải dài để trong tệp đính kèm. Email được duyệt trong buổi chiều cùng ngày, và chủ đầu tư còn trả lời thêm một câu chọn phương án hai vì tiến độ.',
    comparison: [
      {
        weak: 'Dòng chủ đề email ghi "Về vấn đề hôm qua" hoặc "Cập nhật dự án".',
        mature: 'Dòng chủ đề chứa hành động cần và mốc: "Duyệt phát sinh vật tư 84 triệu trước 15/9".',
      },
      {
        weak: 'Dùng từ mềm để giảm áp lực: sẽ cố gắng sớm nhất có thể, cơ bản là ổn, gần như xong.',
        mature: 'Nêu cam kết đo được kèm điều kiện: xong phần A trước thứ Sáu nếu nhận được dữ liệu từ kế toán trong hôm nay.',
      },
      {
        weak: 'Viết dài để thể hiện mức độ đầu tư và công sức đã bỏ ra.',
        mature: 'Viết ngắn phần chính và để phần công sức ở phụ lục, vì người đọc đánh giá bạn qua chất lượng quyết định họ ra được, không qua số chữ.',
      },
    ],
    mistakes: [
      'Nhầm ngắn gọn với cộc lốc: cắt luôn cả ngữ cảnh và phần đề nghị cụ thể, khiến người đọc phải viết thư hỏi lại và tổng số lượt trao đổi tăng lên thay vì giảm.',
      'Dùng thuật ngữ nội bộ hoặc từ viết tắt của phòng mình khi gửi ra ngoài phòng, làm người đọc dừng lại tra nghĩa và mất mạch ngay ở đoạn quan trọng nhất.',
      'Viết một văn bản phục vụ nhiều mục đích cùng lúc, vừa báo cáo vừa xin duyệt vừa xin ý kiến, khiến người đọc không biết mình được kỳ vọng phản hồi ở phần nào và thường chọn không phản hồi gì.',
    ],
    worksheet: [
      'Lấy văn bản công việc dài nhất bạn gửi trong tháng. Người nhận cần ra quyết định gì sau khi đọc nó?',
      'Viết lại toàn bộ ý chính của văn bản đó thành đúng một câu không có mệnh đề phụ.',
      'Gạch chân mọi từ co giãn trong văn bản (sớm, nhiều, đáng kể, một số, khá) và thay từng từ bằng con số hoặc mốc.',
      'Đoạn nào trong văn bản đó có thể xoá mà quyết định của người đọc không đổi? Liệt kê số thứ tự các đoạn.',
      'Viết lại dòng chủ đề sao cho chứa cả hành động cần và hạn chót, dài không quá mười hai chữ.',
    ],
    exercises: [
      {
        label: 'Nén còn một nửa',
        text: 'Chọn một email bạn đã gửi, đếm số chữ, rồi viết lại còn đúng một nửa số chữ mà không mất thông tin nào cần cho quyết định. Ghi lại loại nội dung nào bị cắt đầu tiên.',
        level: 'e',
      },
      {
        label: 'Săn từ co giãn',
        text: 'Trong ba ngày, mỗi lần định gõ các từ sớm, nhanh, nhiều, ổn, cơ bản, hãy dừng lại và thay bằng con số. Cuối ba ngày đếm số lần bạn không có con số để thay và ghi lại vì sao.',
        level: 'e',
      },
      {
        label: 'Một câu kết luận',
        text: 'Với năm tài liệu công việc đang có, viết cho mỗi tài liệu một câu kết luận đứng đầu. Đưa năm câu đó cho đồng nghiệp đọc và hỏi họ đoán nội dung tài liệu là gì.',
        level: 'e',
      },
      {
        label: 'Bài kiểm sáu mươi giây',
        text: 'Đưa bản nháp cho một người ngoài phòng ban, hẹn giờ đúng sáu mươi giây, rồi hỏi họ ba câu về đề nghị, hạn và người thực hiện. Sửa bản nháp đúng chỗ họ trả lời sai và lặp lại với người thứ hai.',
        level: 'm',
      },
      {
        label: 'Tách văn bản đa mục đích',
        text: 'Tìm một email bạn từng viết gộp nhiều mục đích. Tách thành các văn bản riêng, mỗi cái một mục đích và một người nhận chính. So thời gian nhận phản hồi giữa cách cũ và cách mới trong tháng tới.',
        level: 'm',
      },
      {
        label: 'Đọc to bản nháp',
        text: 'Đọc to mọi văn bản trước khi gửi trong một tuần. Đánh dấu mọi chỗ bạn phải lấy hơi giữa câu hoặc đọc lại mới hiểu, đó chính là các câu cần cắt đôi.',
        level: 'm',
      },
      {
        label: 'Viết lại tài liệu chuẩn của nhóm',
        text: 'Chọn một tài liệu mà cả nhóm phải đọc thường xuyên, ví dụ quy trình bàn giao hoặc hướng dẫn nội bộ. Viết lại theo năm bước trong chương, đo bằng cách hỏi ba người mới vào xem họ mất bao lâu để làm đúng theo bản cũ và bản mới.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: giới hạn chữ',
        text: 'Bảy ngày, mọi tin nhắn công việc của bạn không quá tám mươi chữ và mọi email không quá một trăm năm mươi chữ, trừ tài liệu kỹ thuật. Mỗi tối ghi lại lần nào giới hạn làm hại nội dung và lần nào nó buộc bạn nghĩ rõ hơn. Cuối tuần rút ra loại nội dung nào thực sự cần dài.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Khi nào ngắn gọn trở thành có hại?',
        a: 'Khi việc cắt chữ làm mất một trong bốn thứ: điều kiện áp dụng, mức độ chắc chắn, người chịu trách nhiệm, hoặc hệ quả nếu không làm. Ví dụ "hệ thống sẽ chậm vào cuối tháng" ngắn nhưng thiếu mức độ và điều kiện, nên người đọc không biết cần chuẩn bị gì. Quy tắc là cắt phần diễn giải và lịch sử trước, không bao giờ cắt phần điều kiện và trách nhiệm.',
      },
      {
        q: 'Vì sao đặt kết luận ở đầu lại giúp cả người viết chứ không chỉ người đọc?',
        a: 'Vì nó buộc bạn phải biết mình đang kết luận gì trước khi viết. Rất nhiều văn bản dài tồn tại chính vì người viết dùng việc viết để tự tìm ra ý của mình, rồi giữ nguyên cả quá trình mò mẫm đó trong bản gửi đi. Viết câu kết luận trước là một phép kiểm: không viết được nghĩa là chưa nghĩ xong, và lúc đó nên dừng lại nghĩ thay vì viết tiếp.',
      },
      {
        q: 'Làm sao biết một tài liệu đã đủ rõ mà không cần đợi phản hồi thực tế?',
        a: 'Dùng phép thử người ngoài: đưa cho một người không thuộc lĩnh vực đọc trong một phút rồi hỏi họ đề nghị là gì, hạn khi nào, ai làm. Ba câu này phải trả lời đúng mà không cần mở phần đính kèm. Đây là phép kiểm rẻ và diễn ra trước khi gửi, khác với việc chờ người nhận hỏi lại, lúc đó bạn đã mất một vòng trao đổi.',
      },
    ],
    plan7:
      'Ngày 1: đo độ dài trung bình các văn bản bạn gửi trong tuần trước bằng cách đếm chữ của năm cái gần nhất. Ngày 2: luyện viết câu kết luận đứng đầu cho mọi email. Ngày 3: săn và thay hết từ co giãn trong mọi thứ bạn gõ. Ngày 4: cắt đôi mọi câu có quá ba dấu phẩy. Ngày 5: áp dụng phép thử sáu mươi giây với hai người khác nhau. Ngày 6: viết lại một tài liệu dùng chung của nhóm và gửi bản nháp xin góp ý. Ngày 7: so số chữ và số lượt hỏi lại giữa tuần này và tuần trước, ghi lại loại nội dung bạn vẫn chưa nén được.',
    evidence:
      'Bằng chứng tốt nhất là một cặp trước và sau: bản gốc của một tài liệu quan trọng và bản bạn viết lại, kèm số đo thay đổi như thời gian từ lúc gửi tới lúc có quyết định, hoặc số lượt email hỏi lại. Loại hiện vật này rất hợp với hồ sơ ứng tuyển các vị trí điều phối, quản lý dự án, vận hành và chăm sóc khách hàng. Trong phỏng vấn, mô tả nguyên tắc bạn dùng khi cắt và nguyên tắc khi giữ, vì người phỏng vấn quan tâm bạn có phân biệt được phần được phép cắt hay không. Trong CV, dùng dạng: "Chuẩn hoá mẫu tờ trình phát sinh cho ba công trình, thời gian trung bình từ lúc trình tới lúc duyệt giảm từ bốn ngày xuống trong ngày".',
    references: [
      { label: 'PlainLanguage.gov — hướng dẫn viết rõ ràng của chính phủ Mỹ', url: 'https://www.plainlanguage.gov/', type: 'article' },
      { label: 'Nielsen Norman Group — chuyên mục Writing for the Web', url: 'https://www.nngroup.com/topic/writing-web/', type: 'article', needsReview: true },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 4 — Đặt câu hỏi hiệu quả
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Một câu hỏi tốt không phải câu hỏi thông minh mà là câu hỏi thay đổi được điều bạn làm tiếp theo tuỳ theo câu trả lời. Nếu cả hai câu trả lời có thể đều dẫn bạn tới cùng một hành động thì câu hỏi đó chỉ đang lấp khoảng trống. Người hỏi giỏi luôn biết mình đang hỏi để làm gì trong bốn mục đích: thu thập dữ kiện, kiểm chứng một giả định, mở rộng vùng chưa nghĩ tới, hay đẩy tới quyết định — và họ đổi dạng câu hỏi theo mục đích đó.',
    why: {
      work: 'Trong các buổi làm việc với khách hàng hoặc phòng ban khác, người nắm nhịp không phải người nói nhiều mà là người đặt câu hỏi định khung. Ai hỏi được câu làm cả phòng im lặng vài giây thường là người vừa chạm vào giả định chưa ai kiểm.',
      interview:
        'Phần cuối buổi phỏng vấn dành cho bạn hỏi lại là phần nhiều ứng viên bỏ phí bằng những câu tra được trên trang tuyển dụng. Hỏi được về cách nhóm xử lý bất đồng, về việc gì đã khiến người tiền nhiệm rời đi, hay về thước đo thành công sau sáu tháng, vừa cho bạn thông tin thật vừa cho thấy bạn đánh giá công việc chứ không chỉ xin việc.',
      study:
        'Khi tự học, phần lớn thời gian mất đi nằm ở chỗ hỏi sai loại câu: hỏi "cái này là gì" khi vấn đề thật là "khi nào dùng cái này thay vì cái kia". Biết phân loại câu hỏi giúp bạn chọn đúng nguồn để tra và biết khi nào cần hỏi người thay vì tra tài liệu.',
      life: 'Trước các quyết định lớn như chuyển nhà, chọn trường cho con hay ký một hợp đồng dài hạn, chất lượng quyết định phụ thuộc vào việc bạn có hỏi đủ những câu khó chịu hay không, đặc biệt là câu về điều gì sẽ khiến bạn hối hận và ai được lợi nếu bạn đồng ý.',
    },
    framework: [
      {
        name: 'Khai báo mục đích',
        detail:
          'Trước khi hỏi, tự trả lời: câu này để thu dữ kiện, kiểm giả định, mở rộng, hay chốt. Mỗi mục đích có dạng câu riêng, và nhầm mục đích tạo ra tình huống quen thuộc là hỏi rất nhiều mà cuối buổi không ai quyết được gì.',
      },
      {
        name: 'Đi theo phễu',
        detail:
          'Mở đầu bằng câu rộng cho phía kia tự chọn điểm bắt đầu, rồi thu hẹp dần vào chi tiết, và chỉ dùng câu hỏi đóng có hoặc không ở cuối để chốt. Bắt đầu bằng câu đóng sẽ khoá luôn những thông tin nằm ngoài khung bạn đã dựng sẵn.',
      },
      {
        name: 'Một câu một lần',
        detail:
          'Hỏi xong thì dừng hẳn, không thêm ví dụ, không gợi ý sẵn đáp án, không hỏi nối câu thứ hai. Hỏi ba câu liền một lúc gần như luôn nhận về câu trả lời cho câu cuối cùng, và câu đó thường là câu ít quan trọng nhất.',
      },
      {
        name: 'Giữ im lặng ba giây',
        detail:
          'Sau câu hỏi và sau câu trả lời đầu tiên, đếm thầm tới ba trước khi nói tiếp. Phần thông tin có giá trị nhất thường nằm ở đoạn người ta nói thêm để lấp khoảng lặng, không nằm ở câu trả lời phản xạ đầu tiên.',
      },
      {
        name: 'Đào bằng từ của họ',
        detail:
          'Chọn một từ chính người kia vừa dùng và hỏi tiếp quanh nó: họ nói "quy trình rối" thì hỏi "rối ở khâu nào nhất". Dùng lại từ của họ giữ cuộc trao đổi trên cách hiểu của họ, thay vì bạn thay từ và vô tình đổi luôn câu chuyện.',
      },
      {
        name: 'Hỏi ngược để kiểm giả định',
        detail:
          'Thêm một câu hướng phủ định trước khi chốt: điều gì sẽ khiến phương án này hỏng, trường hợp nào anh chị sẽ không dùng nó. Câu hỏi ngược thu về thông tin mà mọi câu hỏi thuận đều bỏ sót vì người trả lời có xu hướng chiều theo hướng người hỏi đang đi.',
      },
    ],
    scenario:
      'Một nhân viên kinh doanh phần mềm chấm công gặp giám đốc nhân sự một nhà máy. Kịch bản cũ của anh là hỏi ngay "chị có đang gặp khó khăn về chấm công không" và nhận về câu "cũng bình thường", rồi cuộc gặp chuyển sang giới thiệu tính năng. Lần này anh mở rộng: "Chị mô tả giúp em một ngày cuối tháng của bộ phận nhân sự diễn ra thế nào ạ". Chị kể mất bốn ngày đối chiếu bảng công vì ba xưởng dùng ba cách ghi tăng ca khác nhau. Anh dùng lại từ của chị và hỏi "ba cách khác nhau đó gây tranh cãi với công nhân ở chỗ nào nhất", lộ ra mỗi tháng có khoảng ba mươi khiếu nại tăng ca. Cuối buổi anh hỏi ngược: "Trường hợp nào chị sẽ không đổi hệ thống", và biết được rào cản thật là công nhân lớn tuổi ngại thao tác máy. Bản chào giá sau đó tập trung vào giảm khiếu nại và có kèm kế hoạch hướng dẫn tại xưởng.',
    comparison: [
      {
        weak: 'Hỏi "anh chị có gặp vấn đề gì không" và nhận về câu trả lời lịch sự rằng mọi thứ vẫn ổn.',
        mature: 'Hỏi họ mô tả một quy trình cụ thể diễn ra thế nào lần gần nhất, rồi tìm điểm nghẽn trong chính lời kể đó.',
      },
      {
        weak: 'Câu hỏi đã cài sẵn đáp án mong muốn: "chắc là do bên vận chuyển chậm phải không".',
        mature: 'Hỏi trung tính về trình tự sự việc trước, chỉ đưa giả thuyết ra sau khi đã có dữ kiện, và nói rõ đó là giả thuyết.',
      },
      {
        weak: 'Lấp mọi khoảng lặng bằng cách tự trả lời hoặc gợi ý lựa chọn cho người kia.',
        mature: 'Chịu được ba tới năm giây im lặng, coi khoảng lặng là thời gian phía kia đang lục lại thông tin thật.',
      },
    ],
    mistakes: [
      'Đặt câu hỏi để chứng minh mình đã biết sẵn câu trả lời, thường bắt đầu bằng "chẳng phải là" hoặc "anh có thấy vô lý không khi", khiến người đối diện chuyển sang thế phòng thủ và ngừng cung cấp thông tin.',
      'Hỏi tại sao liên tiếp với một người đang chịu trách nhiệm về sự việc, vì trong tiếng Việt câu hỏi tại sao rất dễ bị nghe thành lời quy trách nhiệm; đổi sang hỏi điều gì đã dẫn tới hoặc quy trình lúc đó ra sao thì thu được nhiều hơn.',
      'Chuẩn bị một danh sách hai mươi câu và bám cứng theo thứ tự, bỏ qua mọi manh mối mới xuất hiện trong câu trả lời, biến cuộc trò chuyện thành thủ tục điền biểu mẫu.',
    ],
    worksheet: [
      'Viết ra ba câu hỏi bạn định hỏi trong cuộc gặp tới. Với mỗi câu, ghi mục đích: thu dữ kiện, kiểm giả định, mở rộng, hay chốt.',
      'Với từng câu, nếu câu trả lời là có và nếu là không, bạn sẽ làm khác đi thế nào? Câu nào có cùng một hành động cho cả hai đáp án thì gạch bỏ.',
      'Câu hỏi nào trong danh sách đang cài sẵn đáp án bạn mong muốn? Viết lại nó ở dạng trung tính.',
      'Bạn đang giả định điều gì về người kia mà chưa kiểm? Viết một câu hỏi ngược để kiểm chính giả định đó.',
      'Trong lần trao đổi gần nhất, bạn đã bỏ qua từ khoá nào của họ mà lẽ ra nên đào sâu? Ghi lại từ đó và câu hỏi bạn sẽ dùng.',
    ],
    exercises: [
      {
        label: 'Phân loại bốn mục đích',
        text: 'Ghi lại hai mươi câu hỏi bạn đặt ra trong một ngày làm việc và phân loại vào bốn nhóm mục đích. Tính tỷ lệ từng nhóm và so với loại công việc bạn đang làm.',
        level: 'e',
      },
      {
        label: 'Cấm câu hỏi đóng',
        text: 'Trong một cuộc trao đổi hai mươi phút, tự cấm dùng câu hỏi có hoặc không. Ghi lại số lần bạn suýt vi phạm và chất lượng thông tin thu được so với thường lệ.',
        level: 'e',
      },
      {
        label: 'Đếm ba giây',
        text: 'Trong ba cuộc gặp, sau mỗi câu trả lời hãy đếm thầm tới ba trước khi nói. Ghi lại những gì người kia nói thêm trong khoảng lặng đó và đánh giá phần nào có giá trị hơn câu trả lời đầu.',
        level: 'e',
      },
      {
        label: 'Đào năm lớp',
        text: 'Chọn một vấn đề đang tồn tại và phỏng vấn một đồng nghiệp, mỗi lần chỉ hỏi tiếp bằng một từ họ vừa dùng, đủ năm lớp. Ghi lại lớp nào bắt đầu ra thông tin mới.',
        level: 'm',
      },
      {
        label: 'Câu hỏi ngược',
        text: 'Trước khi chốt ba quyết định trong tháng, bắt buộc hỏi thêm câu điều gì sẽ khiến phương án này hỏng. Ghi lại rủi ro mới phát hiện và cách bạn xử lý nó.',
        level: 'm',
      },
      {
        label: 'Bộ câu hỏi cho phỏng vấn',
        text: 'Soạn tám câu hỏi bạn sẽ hỏi nhà tuyển dụng, mỗi câu phải có tác dụng đổi quyết định nhận việc của bạn. Loại bỏ mọi câu tra được trên trang tuyển dụng và nhờ một người đã đi làm lâu năm nhận xét.',
        level: 'm',
      },
      {
        label: 'Chủ trì buổi lấy yêu cầu',
        text: 'Chủ trì một buổi làm việc với phòng ban khác, chỉ dùng câu hỏi trong nửa đầu và không đưa giải pháp nào. Cuối buổi gửi biên bản gồm ba phần: dữ kiện thu được, giả định cần kiểm, và câu hỏi còn mở.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: một câu hỏi khó mỗi ngày',
        text: 'Bảy ngày, mỗi ngày đặt đúng một câu hỏi mà bạn thấy hơi khó chịu khi hỏi, ví dụ về tiêu chí đánh giá, về việc ai là người quyết cuối cùng, hoặc về điều gì đang bị né tránh trong nhóm. Ghi lại phản ứng và thông tin thu được. Ngày thứ bảy đánh giá cái giá thực tế của việc hỏi so với cái giá của việc không hỏi.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao câu hỏi mở nên đi trước câu hỏi đóng trong một buổi tìm hiểu nhu cầu?',
        a: 'Vì câu hỏi đóng chỉ kiểm được những khả năng bạn đã nghĩ ra trước. Nếu vấn đề thật nằm ngoài danh sách của bạn, câu hỏi đóng sẽ không bao giờ chạm tới nó và bạn kết thúc buổi làm việc với cảm giác đã hỏi kỹ. Câu hỏi mở cho phía kia quyền chọn điểm bắt đầu, và chỗ họ chọn bắt đầu vốn đã là một dữ kiện về thứ họ quan tâm nhất.',
      },
      {
        q: 'Khi nào một câu hỏi trở thành phản tác dụng?',
        a: 'Khi nó buộc người trả lời phải thừa nhận sai trước mặt người khác, hoặc khi nó rơi vào lúc họ chưa có dữ liệu và câu trả lời chỉ có thể là phỏng đoán được ghi lại như cam kết. Cả hai trường hợp đều tạo ra câu trả lời tệ và làm hỏng khả năng hỏi tiếp lần sau. Cách xử lý là hỏi riêng, hoặc hỏi kèm lối thoát như "phần nào anh chưa có số thì mình ghi là cần kiểm thêm".',
      },
      {
        q: 'Làm sao biết một câu hỏi có đáng đặt không trước khi mở miệng?',
        a: 'Dùng phép thử đổi hành động: giả sử câu trả lời là A thì bạn làm gì, là B thì bạn làm gì. Nếu hai nhánh dẫn tới cùng một việc thì câu hỏi không đáng đặt trong bối cảnh đó, dù nó có thú vị tới đâu. Phép thử này đặc biệt hữu ích trong các cuộc họp đông người, nơi mỗi câu hỏi tiêu tốn thời gian của tất cả mọi người.',
      },
    ],
    plan7:
      'Ngày 1: ghi lại mọi câu hỏi bạn đặt trong một ngày và phân loại theo bốn mục đích. Ngày 2: áp phép thử đổi hành động cho mọi câu hỏi trước khi hỏi. Ngày 3: luyện phễu trong một cuộc trao đổi, mở rộng trước và chỉ đóng ở cuối. Ngày 4: luyện im lặng ba giây, không lấp khoảng trống. Ngày 5: đào năm lớp bằng chính từ của người đối diện. Ngày 6: đặt câu hỏi ngược trong một cuộc họp ra quyết định. Ngày 7: soạn bộ câu hỏi chuẩn cho loại cuộc gặp bạn làm nhiều nhất và lưu lại để dùng tiếp.',
    evidence:
      'Hiện vật cho kỹ năng này là bộ câu hỏi có cấu trúc do bạn soạn cho một loại tình huống lặp lại: bộ câu hỏi tìm hiểu nhu cầu khách hàng, bộ câu hỏi nhận bàn giao dự án, hay bộ câu hỏi sàng lọc ứng viên. Kèm theo nó là một ví dụ cho thấy một câu hỏi cụ thể đã đổi hướng quyết định thế nào. Trong phỏng vấn, kể lại một lần bạn phát hiện vấn đề thật khác vấn đề được nêu, nói rõ câu hỏi nào đã lộ ra điều đó — đây là câu chuyện rất mạnh cho vị trí kinh doanh, tư vấn, phân tích nghiệp vụ và quản lý sản phẩm. Trong CV, viết dạng: "Xây bộ câu hỏi khảo sát nhu cầu cho đội kinh doanh 6 người, tỷ lệ đơn chào giá đi tới vòng thương thảo tăng rõ rệt trong quý sau".',
    references: [
      { label: 'The Right Question Institute', url: 'https://rightquestion.org/', type: 'article' },
      { label: 'Harvard Business Review', url: 'https://hbr.org/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 5 — Giao tiếp quyết đoán — Assertive Communication
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Quyết đoán là nói ra nhu cầu và giới hạn của mình bằng lời rõ ràng, đồng thời vẫn để nguyên quyền từ chối của người kia. Nó nằm giữa hai cực dễ nhận ra: phục tùng là giấu nhu cầu rồi tích tụ ấm ức, hung hăng là áp đặt nhu cầu bằng cách hạ thấp người khác. Điểm mấu chốt kỹ thuật là tách bạch ba lớp trong một câu nói — dữ kiện quan sát được, tác động lên công việc hoặc lên bạn, và đề nghị cụ thể — và không để lớp thứ nhất bị nhiễm bởi phán xét về tính cách.',
    why: {
      work: 'Người không nói được giới hạn thường nhận thêm việc cho tới lúc chất lượng sụp, và cả nhóm chỉ biết khi đã trễ hạn. Nói sớm rằng nhận thêm việc này thì việc kia lùi hai ngày là hành động bảo vệ tiến độ chung, không phải hành động từ chối hợp tác.',
      interview:
        'Câu hỏi về bất đồng với sếp cũ là chỗ phân loại rất nhanh. Ứng viên kể theo hướng đổ lỗi bị đánh giá là khó hợp tác; ứng viên nói mình luôn nghe theo bị đánh giá là không có chính kiến. Câu trả lời tốt mô tả được bạn đã nêu quan điểm bằng dữ kiện, đã đề nghị gì, và đã hành xử ra sao sau khi quyết định cuối cùng không theo ý mình.',
      study:
        'Trong bài tập nhóm, thành viên im lặng chịu phần việc nặng thường là người bỏ cuộc giữa chừng hoặc nộp bài kém chất lượng. Nói rõ ngay từ buổi đầu mình nhận phần nào, tới ngày nào, và cần ai đưa gì trước đó là cách duy nhất để việc phân công không trôi về người ngại nói.',
      life: 'Từ chuyện người thân vay tiền tới chuyện hàng xóm mở nhạc khuya, phần lớn xung đột kéo dài vì một bên chịu đựng lâu rồi bùng nổ. Nói ngay lần đầu, bằng dữ kiện và đề nghị cụ thể, giữ được cả quan hệ lẫn giới hạn, trong khi chịu đựng thì mất dần cả hai.',
    },
    framework: [
      {
        name: 'Mô tả bằng dữ kiện',
        detail:
          'Nêu sự việc theo cách một máy quay có thể ghi lại được: "Ba lần trong hai tuần, yêu cầu sửa được gửi sau 21h và cần xong trước sáng hôm sau". Tránh mọi từ chỉ tính cách hoặc động cơ, vì chúng biến cuộc trao đổi thành cuộc tranh cãi về con người bạn.',
      },
      {
        name: 'Nêu tác động',
        detail:
          'Nói tác động cụ thể lên công việc, chất lượng hoặc bản thân bạn, ở dạng ngôi thứ nhất: "Việc này khiến tôi phải bỏ dở phần kiểm tra cuối và hai lần đã lọt lỗi tới khách". Tác động là thứ khiến người nghe có lý do thay đổi, còn cảm giác khó chịu đơn thuần thì không.',
      },
      {
        name: 'Đề nghị cụ thể',
        detail:
          'Đưa ra một hành vi thay thế đủ rõ để người ta biết chính xác phải làm gì: "Từ nay yêu cầu gửi trước 16h sẽ được xử lý trong ngày, gửi sau 16h sẽ vào ngày làm việc kế tiếp, trừ trường hợp sự cố hệ thống". Không có bước này thì cả hai bước trên chỉ là lời phàn nàn.',
      },
      {
        name: 'Nói rõ lựa chọn hai bên',
        detail:
          'Trình bày hệ quả như thông tin, không như lời doạ: nếu vẫn cần xử lý ban đêm thì cần thêm người trực hoặc chấp nhận bỏ bước kiểm tra. Điểm phân biệt là bạn đưa ra các lựa chọn cùng cái giá của chúng, và để người kia chọn.',
      },
      {
        name: 'Giữ nguyên khi bị đẩy lùi',
        detail:
          'Khi bị gây áp lực, lặp lại nội dung cốt lõi bằng câu ngắn và giọng bình thường, không thêm lý do mới. Mỗi lý do mới đưa thêm là một cánh cửa để tranh luận, còn một câu giữ nguyên lặp lại vài lần thường kết thúc cuộc đẩy lùi mà không cần cãi.',
      },
    ],
    scenario:
      'Một người làm thiết kế tự do nhận dự án bộ nhận diện với hợp đồng ghi hai vòng chỉnh sửa. Tới vòng thứ năm, khách vẫn nhắn sửa lúc nửa đêm và nói "chỉ chút xíu thôi". Thay vì im lặng làm tiếp như ba lần trước, cô gọi điện và nói: trong hai tuần qua đã có năm vòng sửa, vượt hai vòng trong hợp đồng, tổng thêm khoảng mười tám giờ làm; điều này khiến cô phải lùi lịch của một khách khác và không còn thời gian chuẩn bị bộ tệp bàn giao. Đề nghị của cô gồm hai lựa chọn: chốt phương án hiện tại và bàn giao trong ba ngày, hoặc ký phụ lục tính thêm theo giờ cho các vòng sau. Khách chọn phương án thứ nhất, và ở dự án sau chủ động hỏi trước còn bao nhiêu vòng sửa.',
    comparison: [
      {
        weak: 'Nói "anh lúc nào cũng gửi việc gấp" — một phán xét về tính cách, kích hoạt phản ứng chối bỏ.',
        mature: 'Nói "ba lần trong hai tuần yêu cầu tới sau 21h" — một dữ kiện đếm được, khó chối và dễ bàn cách xử lý.',
      },
      {
        weak: 'Im lặng nhận thêm việc, tự nhủ lần này thôi, rồi thể hiện sự khó chịu qua thái độ và tốc độ làm.',
        mature: 'Nói ngay từ lần đầu về sự đánh đổi tiến độ, kèm đề nghị thứ tự ưu tiên để người giao việc tự chọn.',
      },
      {
        weak: 'Từ chối bằng cách viện lý do chung chung như đang bận lắm, khiến người kia tiếp tục thuyết phục.',
        mature: 'Từ chối kèm ranh giới rõ và một phương án thay thế nếu có: không nhận trong tuần này, nhận từ thứ Hai, hoặc giới thiệu người khác.',
      },
      {
        weak: 'Xin lỗi liên tục khi nêu nhu cầu chính đáng, làm giảm trọng lượng của chính đề nghị mình đưa ra.',
        mature: 'Nói bình thường, giữ giọng và tốc độ như khi trao đổi chuyên môn, vì nêu ranh giới không phải hành vi cần xin lỗi.',
      },
    ],
    mistakes: [
      'Nhầm quyết đoán với thẳng thắn không lọc: nói ra mọi cảm xúc ngay lúc đang bực, rồi coi phản ứng khó chịu của người khác là bằng chứng họ không chịu được sự thật, trong khi vấn đề nằm ở thời điểm và cách diễn đạt.',
      'Chỉ nêu vấn đề mà không kèm đề nghị cụ thể, khiến người nghe hiểu rằng bạn đang trách móc và họ phải tự đoán bạn muốn gì, thường thì họ đoán sai hoặc không đoán.',
      'Đợi tích tụ đủ nhiều lần rồi mới nói một lượt, biến một cuộc trao đổi nhỏ đáng lẽ diễn ra từ tháng trước thành một cuộc đối chất nặng nề mà phía kia thấy hoàn toàn bất ngờ.',
    ],
    worksheet: [
      'Viết ra một tình huống trong tháng qua bạn đã đồng ý dù không muốn. Bạn đã sợ điều gì sẽ xảy ra nếu từ chối?',
      'Mô tả lại tình huống đó chỉ bằng dữ kiện quan sát được, không dùng từ nào chỉ tính cách hay động cơ của người kia.',
      'Tác động thật lên công việc hoặc lên bạn là gì? Ghi bằng số giờ, số việc bị lùi, hoặc hậu quả cụ thể đã xảy ra.',
      'Đề nghị cụ thể của bạn là gì? Viết thành một câu mà người kia biết ngay phải làm khác đi thế nào.',
      'Nếu người kia đẩy lùi ba lần, câu ngắn nào bạn sẽ lặp lại mà không thêm lý do mới? Viết sẵn câu đó.',
    ],
    exercises: [
      {
        label: 'Tách dữ kiện khỏi phán xét',
        text: 'Lấy năm câu phàn nàn bạn từng nói hoặc nghĩ về đồng nghiệp, viết lại mỗi câu thành hai phần riêng: phần máy quay ghi được và phần bạn suy diễn. Đọc lại và đánh dấu câu nào đang trộn hai phần.',
        level: 'e',
      },
      {
        label: 'Một lần nói không',
        text: 'Trong tuần này từ chối đúng một lời đề nghị nhỏ mà bình thường bạn sẽ nhận, dùng câu từ chối kèm ranh giới rõ. Ghi lại phản ứng thực tế và so với điều bạn đã lo sợ trước đó.',
        level: 'e',
      },
      {
        label: 'Viết trước câu giữ nguyên',
        text: 'Chọn một tình huống bạn hay bị thuyết phục ngược. Viết sẵn một câu giữ nguyên dài không quá mười lăm chữ và tập nói to ba lần với giọng bình thường.',
        level: 'e',
      },
      {
        label: 'Bốn lớp trong một cuộc',
        text: 'Áp dụng đủ bốn bước mô tả, tác động, đề nghị, lựa chọn trong một cuộc trao đổi thật. Sau đó ghi lại bước nào bạn bỏ qua dưới áp lực và điều gì đã xảy ra sau đó.',
        level: 'm',
      },
      {
        label: 'Đàm phán lại phạm vi',
        text: 'Chọn một cam kết bạn đang gánh quá sức. Chuẩn bị ba phương án chia lại phạm vi kèm cái giá của từng phương án, rồi trình bày cho người liên quan và để họ chọn.',
        level: 'm',
      },
      {
        label: 'Ghi nhật ký ranh giới',
        text: 'Trong hai tuần, ghi mỗi lần bạn nói có trong khi muốn nói không, kèm bối cảnh và người đề nghị. Cuối kỳ tìm xem có mẫu chung nào về người, thời điểm hay loại việc khiến bạn khó từ chối nhất.',
        level: 'm',
      },
      {
        label: 'Nói lại chuyện cũ',
        text: 'Chọn một vấn đề tồn tại đã lâu mà bạn chưa từng nêu. Chuẩn bị đủ bốn lớp, hẹn riêng người liên quan, nêu vấn đề và ghi lại toàn bộ diễn biến gồm cả phần bạn thấy khó nhất.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: nêu một nhu cầu mỗi ngày',
        text: 'Bảy ngày, mỗi ngày nêu một nhu cầu hoặc giới hạn bằng câu có đủ dữ kiện, tác động và đề nghị, dù là chuyện rất nhỏ như xin dời một cuộc họp. Ghi lại mức độ căng thẳng của bạn trước và sau mỗi lần theo thang mười điểm. Cuối tuần xem con số đó thay đổi ra sao và với loại người nào nó giảm chậm nhất.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao mô tả bằng dữ kiện lại hiệu quả hơn nói ra cảm nhận về tính cách người khác?',
        a: 'Vì dữ kiện quan sát được là thứ cả hai bên có thể cùng đứng nhìn và cùng đồng ý là đã xảy ra, nên cuộc trao đổi tập trung vào việc xử lý nó. Còn phán xét tính cách buộc người nghe phải bảo vệ hình ảnh bản thân, và toàn bộ năng lượng sẽ chuyển sang tranh cãi xem họ có phải là người như vậy không. Sự việc ban đầu bị bỏ lại và không ai xử lý.',
      },
      {
        q: 'Quyết đoán có mâu thuẫn với văn hoá coi trọng hoà khí và thứ bậc không?',
        a: 'Không nhất thiết, nếu điều chỉnh hình thức chứ không bỏ nội dung. Trong bối cảnh coi trọng thứ bậc, thường hiệu quả hơn khi nêu riêng thay vì trước đám đông, khung lại đề nghị theo lợi ích chung thay vì theo nhu cầu cá nhân, và trình bày dưới dạng các lựa chọn để người có thẩm quyền quyết. Phần không nên nhượng bộ là ba lớp dữ kiện, tác động và đề nghị cụ thể.',
      },
      {
        q: 'Khi nào nên chấp nhận và không nêu ranh giới?',
        a: 'Khi chi phí của việc chịu đựng thấp và không lặp lại, ví dụ một lần hỗ trợ ngoài giờ trong đợt cao điểm hiếm hoi. Vấn đề chỉ xuất hiện khi một ngoại lệ được lặp lại đủ nhiều để trở thành mặc định mà không ai từng quyết định như vậy. Nguyên tắc thực dụng là tự đặt ngưỡng đếm được từ trước, chẳng hạn tới lần thứ ba thì bắt buộc nêu.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê năm tình huống bạn đang chịu đựng và xếp theo mức tổn thất. Ngày 2: viết lại tình huống nặng nhất chỉ bằng dữ kiện. Ngày 3: tính và viết ra tác động cụ thể bằng số giờ hoặc hậu quả đã xảy ra. Ngày 4: soạn đề nghị cụ thể và hai lựa chọn kèm cái giá. Ngày 5: tập nói to trước gương hoặc với một người tin cậy, đo thời lượng dưới hai phút. Ngày 6: nói thật với người liên quan, hẹn riêng và chọn lúc cả hai không mệt. Ngày 7: ghi lại kết quả, phần bạn làm được và phần bạn né, rồi chọn tình huống thứ hai cho tuần sau.',
    evidence:
      'Kỹ năng này để lại dấu vết trong các thoả thuận bằng văn bản mà bạn tạo ra: phụ lục hợp đồng về số vòng chỉnh sửa, bản cam kết mức dịch vụ nội bộ về thời gian phản hồi, hay biên bản phân chia phạm vi được các bên xác nhận. Đó là hiện vật đưa vào hồ sơ freelance hoặc hồ sơ ứng tuyển vị trí có làm việc với khách hàng. Trong phỏng vấn, kể một tình huống bạn nêu bất đồng với người có quyền cao hơn, nói rõ bạn đã dùng dữ kiện gì, đề nghị gì, và bạn đã làm gì sau khi quyết định cuối cùng khác ý mình. Trong CV, thể hiện gián tiếp qua kết quả: "Chuẩn hoá phạm vi và số vòng chỉnh sửa cho toàn bộ hợp đồng thiết kế, thời gian bàn giao trung bình rút từ 6 tuần xuống 4 tuần".',
    references: [
      { label: 'Center for Nonviolent Communication', url: 'https://www.cnvc.org/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 6 — Giao tiếp phi ngôn ngữ
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Giao tiếp phi ngôn ngữ gồm mọi thứ đi kèm lời nói mà vẫn mang thông tin: tư thế, khoảng cách, hướng cơ thể, ánh mắt, nét mặt, cử chỉ tay, và toàn bộ phần giọng nói không phải từ ngữ như nhịp, âm lượng, khoảng lặng. Điều quan trọng nhất và hay bị nói sai là nó không phải bộ mã cố định để giải nghĩa người khác. Khoanh tay có thể là phòng thủ, có thể là lạnh, có thể là thói quen. Cách dùng đúng gồm hai vế: kiểm soát tín hiệu mình phát ra cho khớp với nội dung, và coi tín hiệu đọc được ở người khác là giả thuyết cần kiểm bằng lời chứ không phải kết luận.',
    why: {
      work: 'Trong họp, người ta quyết định có tin một đề xuất hay không trước khi hiểu hết nội dung của nó, dựa nhiều vào việc người trình bày có vẻ đang tin vào điều mình nói hay không. Giọng run, mắt dán vào slide và tư thế thu nhỏ làm giảm trọng lượng của cả những con số chắc chắn nhất.',
      interview:
        'Phỏng vấn trực tuyến làm mất gần hết tín hiệu cơ thể, chỉ còn khuôn mặt và giọng. Chi tiết rất thực dụng là đặt máy ảnh ngang tầm mắt, nhìn vào ống kính khi nói ý quan trọng, và giữ khoảng lặng thay vì lấp bằng từ đệm. Ba việc này đổi hẳn cảm giác của người phỏng vấn về mức độ vững vàng của bạn.',
      study:
        'Khi thuyết trình bài tập nhóm, việc quay lưng về phía lớp để đọc màn hình khiến người nghe rời đi trong vòng một phút. Đứng lệch sang bên, nhìn vào lớp và chỉ liếc màn hình là kỹ thuật học được trong một buổi tập nhưng ảnh hưởng tới điểm số suốt bốn năm.',
      life: 'Khi con cái hoặc người thân kể chuyện, việc bạn vẫn cầm điện thoại truyền đi thông điệp mạnh hơn mọi câu bạn nói. Ngược lại, ngồi ngang tầm mắt và im lặng gật đúng nhịp có thể làm dịu một cuộc trò chuyện căng mà không cần lời nào.',
    },
    framework: [
      {
        name: 'Lấy đường nền của từng người',
        detail:
          'Quan sát cách một người biểu hiện khi bình thường trước, rồi mới chú ý tới chỗ lệch khỏi mức bình thường ấy. Một người vốn nói nhanh mà hôm nay nói chậm mới là tín hiệu; nói nhanh với người vốn nói nhanh thì không có nghĩa gì.',
      },
      {
        name: 'Đọc theo cụm, không theo dấu hiệu lẻ',
        detail:
          'Chỉ coi là tín hiệu khi ít nhất ba yếu tố cùng đổi hướng một lúc: giọng nhỏ lại, hướng cơ thể xoay ra cửa, và câu trả lời ngắn đi. Bám vào một cử chỉ đơn lẻ để suy ra tâm trạng là cách nhanh nhất để đọc sai và hành xử sai theo.',
      },
      {
        name: 'Quản ba tín hiệu mình phát ra',
        detail:
          'Trong lúc nói, chỉ cần kiểm soát ba thứ là đủ: hướng cơ thể mở về phía người nghe, đôi tay để thấy được và cử động trong khoảng ngực, và nhịp giọng có khoảng lặng sau mỗi ý chính. Cố kiểm soát nhiều hơn ba thứ cùng lúc sẽ làm bạn trông cứng.',
      },
      {
        name: 'Đồng bộ lời và phi lời',
        detail:
          'Khi nội dung là tin xấu mà nét mặt vẫn cười xã giao, người nghe tin vào nét mặt và kết luận bạn không nghiêm túc. Trước những đoạn quan trọng, dừng nửa giây, hạ nhịp và bỏ nụ cười phản xạ, để hai kênh nói cùng một điều.',
      },
      {
        name: 'Kiểm giả thuyết bằng lời',
        detail:
          'Khi đọc được tín hiệu, đừng kết luận thầm rồi hành động. Nói ra ở dạng phỏng đoán: "Mình thấy phần này có vẻ khiến anh phân vân, có phải không". Câu này biến một suy diễn riêng thành thông tin được xác nhận, hoặc được sửa ngay.',
      },
    ],
    scenario:
      'Một giảng viên dạy lớp buổi tối cho học viên đi làm nhận thấy tới phút thứ hai mươi là lớp bắt đầu nhìn điện thoại. Ban đầu cô kết luận học viên lười. Thay vì đoán tiếp, cô thử ba thay đổi và quan sát: rời khỏi bục và đi xuống hai hàng ghế đầu, dừng bốn giây sau mỗi ý chính thay vì nói liền mạch, và mỗi mười phút đặt một câu hỏi rồi thực sự im lặng chờ. Sự chú ý kéo dài thêm rõ rệt, nhưng vẫn tụt ở đoạn cô trình bày phần lý thuyết trong khi quay mặt vào màn chiếu. Cô chuyển phần đó thành bài tập cặp đôi và hỏi thẳng lớp cuối buổi. Học viên trả lời rằng lúc cô quay lưng thì họ không biết nên nhìn đâu, và chính khoảng lặng mới khiến họ kịp ghi chép.',
    comparison: [
      {
        weak: 'Kết luận một người đang không đồng ý vì họ khoanh tay, rồi đổi hẳn cách trình bày dựa trên suy diễn đó.',
        mature: 'Ghi nhận cụm tín hiệu, giữ nguyên nội dung, và hỏi trực tiếp một câu ngắn để xác nhận trước khi đổi hướng.',
      },
      {
        weak: 'Đọc toàn bộ slide, mắt gần như không rời màn hình trong suốt buổi trình bày.',
        mature: 'Nhìn slide để lấy ý, quay lại nhìn người nghe khi nói, và dùng slide làm chỗ dựa chứ không làm bản đọc.',
      },
      {
        weak: 'Lấp mọi khoảng trống bằng à, ừm, kiểu như, để tránh cảm giác im lặng khó chịu.',
        mature: 'Coi khoảng lặng hai tới ba giây là dấu chấm câu, cho người nghe thời gian xử lý và cho mình thời gian chọn từ.',
      },
    ],
    mistakes: [
      'Tin vào con số phổ biến rằng phần lớn ý nghĩa của giao tiếp nằm ở phi ngôn ngữ và chỉ một phần rất nhỏ nằm ở từ ngữ; con số đó xuất phát từ một nghiên cứu về biểu đạt cảm xúc trong điều kiện rất hẹp và không áp dụng cho việc truyền đạt nội dung, nên dựa vào nó để coi nhẹ phần chuẩn bị nội dung là sai từ gốc.',
      'Học thuộc bảng ý nghĩa cử chỉ rồi dùng nó để đánh giá người khác, đặc biệt trong tuyển dụng, dẫn tới loại nhầm những ứng viên hướng nội hoặc thuộc nền văn hoá có quy ước ánh mắt khác.',
      'Tập tư thế và cử chỉ tới mức trông như diễn, khiến người nghe cảm thấy có gì đó không thật và chuyển sự chú ý từ nội dung sang việc quan sát bạn.',
    ],
    worksheet: [
      'Xem lại một đoạn ghi hình bạn nói trước người khác. Trong ba mươi giây đầu, tay bạn ở đâu và hướng cơ thể quay về đâu?',
      'Bạn hay dùng từ đệm nào nhất khi bí? Đếm số lần nó xuất hiện trong hai phút.',
      'Với một người bạn làm việc cùng hằng ngày, mô tả đường nền của họ: nhịp nói, khoảng cách, mức độ giao tiếp mắt thường ngày.',
      'Lần gần nhất bạn suy diễn thái độ ai đó từ cử chỉ, cụm tín hiệu bạn thấy gồm mấy yếu tố? Liệt kê ra.',
      'Chọn một câu quan trọng bạn sẽ nói tuần này. Đánh dấu chỗ bạn sẽ dừng và chỗ bạn sẽ hạ giọng.',
    ],
    exercises: [
      {
        label: 'Quay hai phút',
        text: 'Tự quay video hai phút trình bày một chủ đề quen thuộc, xem lại và ghi ba điều: số lần dùng từ đệm, thời gian nhìn vào ống kính, và vị trí đôi tay. Quay lại lần hai chỉ sửa một trong ba điều đó.',
        level: 'e',
      },
      {
        label: 'Tắt tiếng quan sát',
        text: 'Xem một cuộc phỏng vấn hoặc toạ đàm trong năm phút với chế độ tắt tiếng, viết ra bạn đoán không khí và quan hệ giữa hai người thế nào. Bật tiếng nghe lại và đối chiếu phần bạn đoán đúng, đoán sai.',
        level: 'e',
      },
      {
        label: 'Luyện khoảng lặng',
        text: 'Trong ba cuộc trao đổi, cố tình dừng hai giây sau mỗi ý chính thay vì nói liền. Ghi lại cảm giác của bạn về độ dài khoảng lặng và phản ứng thật của người nghe.',
        level: 'e',
      },
      {
        label: 'Ba yếu tố mới tính',
        text: 'Trong một tuần, mỗi lần bạn định kết luận về thái độ ai đó, buộc mình liệt kê đủ ba yếu tố cùng thay đổi mới được coi là tín hiệu. Ghi lại số lần bạn không đủ ba yếu tố.',
        level: 'm',
      },
      {
        label: 'Đồng bộ tin xấu',
        text: 'Chuẩn bị một tin không thuận lợi cần báo. Tập nói trước gương, loại bỏ nụ cười phản xạ, hạ nhịp ở câu chính. Sau khi báo thật, hỏi người nghe xem họ cảm nhận mức nghiêm trọng ra sao và so với ý bạn muốn truyền.',
        level: 'm',
      },
      {
        label: 'Sửa bối cảnh trực tuyến',
        text: 'Chỉnh vị trí máy ảnh ngang tầm mắt, nguồn sáng phía trước, khung hình lấy tới ngang ngực để thấy tay. Ghi lại hai cuộc họp trước và sau khi chỉnh, tự đánh giá và hỏi một đồng nghiệp nhận xét.',
        level: 'm',
      },
      {
        label: 'Đo sự chú ý của khán giả',
        text: 'Trong một buổi bạn trình bày dài hơn hai mươi phút, nhờ một người ngồi dưới ghi mốc thời gian mỗi khi có từ ba người trở lên nhìn xuống điện thoại. Đối chiếu các mốc đó với phần nội dung và cách bạn đứng lúc ấy.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: mỗi ngày một tín hiệu',
        text: 'Bảy ngày, mỗi ngày chọn đúng một tín hiệu để luyện: ngày hướng cơ thể, ngày ánh mắt, ngày đôi tay, ngày nhịp giọng, ngày khoảng lặng, ngày âm lượng, ngày đồng bộ nét mặt với nội dung. Mỗi tối ghi một dòng về chỗ khó nhất. Cuối tuần chọn hai tín hiệu yếu nhất để duy trì luyện thêm một tháng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao không nên dùng bảng ý nghĩa cử chỉ để đánh giá ứng viên trong phỏng vấn?',
        a: 'Vì cùng một cử chỉ có nhiều nguyên nhân khác nhau, trong đó có những nguyên nhân không liên quan gì tới nội dung: căng thẳng tình huống, thói quen cá nhân, quy ước văn hoá về giao tiếp mắt, hoặc đơn giản là lạnh. Dùng bảng cố định sẽ tạo ra đánh giá có hệ thống thiên lệch với những nhóm người có đường nền khác với người phỏng vấn, và điều đó vừa bất công vừa làm hỏng chất lượng tuyển dụng.',
      },
      {
        q: 'Khi lời nói và biểu hiện phi ngôn ngữ mâu thuẫn nhau, người nghe tin bên nào và điều đó gợi ý gì cho bạn?',
        a: 'Người nghe thường tin phần phi ngôn ngữ, vì họ giả định nó khó kiểm soát hơn nên thật hơn. Điều này gợi ý rằng khi cần truyền một thông điệp quan trọng, việc luyện nội dung là chưa đủ; phải kiểm tra xem nhịp giọng và nét mặt của bạn có đang nói cùng một điều không. Cách kiểm rẻ nhất là quay lại một đoạn ngắn và xem với chế độ tắt tiếng.',
      },
      {
        q: 'Trong họp trực tuyến, ba điều chỉnh nào cho hiệu quả cao nhất so với công sức bỏ ra?',
        a: 'Đặt máy ảnh ngang tầm mắt để người xem không nhìn từ dưới lên, đưa nguồn sáng ra phía trước mặt thay vì phía sau lưng, và mở rộng khung hình tới ngang ngực để cử chỉ tay được nhìn thấy. Cả ba đều làm một lần và có tác dụng cho mọi cuộc họp sau đó, khác với các kỹ thuật hành vi phải luyện lâu.',
      },
    ],
    plan7:
      'Ngày 1: quay hai phút và đếm từ đệm, đó là số đo gốc. Ngày 2: luyện hướng cơ thể và vị trí tay trong mọi cuộc trao đổi. Ngày 3: chỉ luyện khoảng lặng sau mỗi ý chính. Ngày 4: chỉnh lại bối cảnh làm việc trực tuyến, máy ảnh và ánh sáng. Ngày 5: quan sát đường nền của ba người bạn làm việc cùng và ghi lại. Ngày 6: thực hành kiểm giả thuyết bằng lời ít nhất hai lần. Ngày 7: quay lại hai phút với cùng chủ đề của ngày 1 và so hai bản ghi.',
    evidence:
      'Bằng chứng ở đây là bản ghi hình, thứ rất ít người chịu chuẩn bị nên nó tạo khác biệt lớn. Giữ hai đoạn video ngắn của chính bạn, một đoạn cũ và một đoạn sau khi luyện, cùng nói về một chủ đề, để thấy được thay đổi cụ thể về nhịp, khoảng lặng và tư thế. Với các vị trí đào tạo, bán hàng, chăm sóc khách hàng hay tư vấn, một video ba phút giới thiệu năng lực đính kèm hồ sơ thường có trọng lượng hơn cả trang mô tả kinh nghiệm. Trong phỏng vấn, nếu được hỏi về kỹ năng trình bày, kể lại cách bạn đo sự chú ý của khán giả và điều chỉnh dựa trên quan sát, chứ không nói chung rằng mình tự tin trước đám đông.',
    references: [
      { label: 'Paul Ekman Group — nghiên cứu biểu cảm khuôn mặt', url: 'https://www.paulekman.com/', type: 'article' },
      { label: 'Greater Good Science Center, UC Berkeley', url: 'https://greatergood.berkeley.edu/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 7 — Thấu cảm
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Thấu cảm là năng lực dựng lại chính xác trải nghiệm của người khác từ vị trí của họ, và nó gồm ba phần rất khác nhau: hiểu được họ đang nghĩ gì, cảm nhận được phần nào điều họ đang trải qua, và chuyển hiểu biết đó thành hành động có ích. Ba phần này không đi kèm nhau tự động. Người hiểu rất giỏi mà không hành động thì vô dụng với người đang cần; người cảm quá mạnh mà không tách được thì kiệt sức và mất khả năng giúp. Trong công việc, phần đáng luyện nhất là phần thứ nhất và thứ ba.',
    why: {
      work: 'Người quản lý không đọc được điều đang thực sự xảy ra với thành viên sẽ luôn bất ngờ khi nhận đơn xin nghỉ, và lúc đó mọi biện pháp giữ chân đều muộn và đắt. Thấu cảm là hệ thống cảnh báo sớm rẻ nhất mà một tổ chức có, nhưng chỉ hoạt động nếu người ta tin rằng nói ra sẽ không bị dùng để chống lại mình.',
      interview:
        'Nhiều vị trí có câu hỏi về xử lý khách hàng giận dữ hoặc đồng nghiệp bất hợp tác. Câu trả lời tốt cho thấy bạn dựng lại được lý do hợp lý phía sau hành vi khó chịu, chứ không dán nhãn người đó là vô lý. Người phỏng vấn nghe ra rất nhanh khác biệt giữa hai kiểu kể này.',
      study:
        'Khi giảng lại bài cho bạn học, cản trở lớn nhất là lời nguyền của kiến thức: bạn đã hiểu rồi nên không còn nhớ nổi cảm giác chưa hiểu. Chủ động dựng lại trạng thái đó, hỏi họ đang hình dung thế nào, giúp bạn tìm đúng chỗ tắc thay vì giảng lại từ đầu.',
      life: 'Trong gia đình, nhiều xung đột kéo dài vì mỗi bên đều tin phía kia thừa biết mình đang khó khăn. Nói ra điều mình hình dung về hoàn cảnh của người kia và để họ sửa lại là cách thoát khỏi vòng cả hai cùng chờ được hiểu.',
    },
    framework: [
      {
        name: 'Hoãn phán xét trong hai phút',
        detail:
          'Khi gặp hành vi khó hiểu, tạm treo câu hỏi ai đúng ai sai và giả định rằng người kia đang hành xử hợp lý theo thông tin và điều kiện họ có. Giả định này không phải lòng tốt, nó là công cụ tìm nguyên nhân, vì nếu bạn dán nhãn sớm thì việc tìm hiểu dừng lại ngay tại đó.',
      },
      {
        name: 'Dựng lại hoàn cảnh cụ thể',
        detail:
          'Viết ra ba điều về vị trí của họ: sức ép nào đang đè lên họ, họ bị đánh giá bằng thước đo gì, và họ mất gì nếu làm theo điều bạn muốn. Bước này dùng suy luận từ dữ kiện chứ không dùng cảm giác, nên làm được cả khi bạn đang bực.',
      },
      {
        name: 'Kiểm chứng bằng lời phỏng đoán',
        detail:
          'Nói ra bản dựng của bạn ở dạng chưa chắc chắn và mời họ sửa: "Mình đoán việc này khiến em phải giải trình với hai nơi cùng lúc, đúng không". Sai cũng có ích, vì lời đính chính của họ chính là thông tin bạn cần.',
      },
      {
        name: 'Hỏi họ cần gì trước khi đưa giải pháp',
        detail:
          'Phân loại nhu cầu bằng một câu: cần được nghe, cần thông tin, hay cần bạn can thiệp. Ba nhu cầu này đòi ba phản ứng khác hẳn nhau, và phần lớn hiểu lầm sinh ra từ việc đưa thứ thứ ba khi người ta cần thứ nhất.',
      },
      {
        name: 'Hành động trong quyền hạn và nói rõ giới hạn',
        detail:
          'Làm điều bạn thực sự làm được và nói thẳng phần bạn không quyết được, kèm việc bạn sẽ chuyển tiếp cho ai. Hứa vượt quyền hạn phá huỷ niềm tin nhanh hơn cả việc từ chối thẳng, vì nó khiến người ta ngừng tìm phương án khác.',
      },
    ],
    scenario:
      'Một quản lý cửa hàng bán lẻ nhận đơn xin nghỉ của nhân viên thu ngân giỏi nhất, lý do ghi là việc gia đình. Thay vì duyệt ngay hoặc thuyết phục bằng tăng lương, chị hẹn nói chuyện mười lăm phút và bắt đầu bằng một phỏng đoán: "Chị đoán ca tối liên tục trong hai tháng qua khiến em không sắp xếp được việc đón con, có phải không". Nhân viên đính chính rằng vấn đề không phải ca tối mà là lịch được xếp trước có ba ngày nên không thể nhờ ai trông con. Đó là điều chưa từng xuất hiện trong bất kỳ cuộc họp nào. Quản lý làm điều nằm trong quyền hạn: chốt lịch trước hai tuần cho toàn cửa hàng, và nói rõ phần tăng phụ cấp thì chị không quyết được nhưng sẽ đề xuất lên. Nhân viên rút đơn, và ba người khác cũng phản hồi rằng lịch xếp sát ngày là vấn đề của họ.',
    comparison: [
      {
        weak: 'Trả lời người đang khó khăn bằng cách kể chuyện của mình còn khó hơn để họ thấy nhẹ đi.',
        mature: 'Giữ toàn bộ khung cảnh ở phía họ, chỉ kể trải nghiệm của mình nếu họ hỏi hoặc nếu nó chứa thông tin hữu ích cho quyết định của họ.',
      },
      {
        weak: 'Nói "anh hiểu cảm giác của em" rồi chuyển ngay sang phần cần làm gì tiếp.',
        mature: 'Nêu cụ thể điều bạn hình dung họ đang trải qua và mời họ sửa, vì sự cụ thể mới chứng minh bạn thực sự đang hình dung.',
      },
      {
        weak: 'Nhận hết mọi cảm xúc của người khác vào mình, mang về nhà và mất ngủ, rồi dần tránh tiếp xúc với người đang gặp khó.',
        mature: 'Giữ khoảng cách vừa đủ để còn suy nghĩ được: hiểu và hành động, nhưng có nghi thức kết thúc rõ ràng sau mỗi cuộc trò chuyện nặng.',
      },
    ],
    mistakes: [
      'Dùng thấu cảm như một kỹ thuật để đạt mục tiêu của mình, ví dụ tỏ ra quan tâm rồi lập tức chuyển sang yêu cầu; người đối diện gần như luôn nhận ra và sau đó mọi biểu hiện quan tâm của bạn đều bị nghi ngờ, kể cả những lần thật lòng.',
      'Chỉ thấu cảm với những người giống mình về hoàn cảnh hoặc chuyên môn, và mặc định rằng người ở bộ phận khác đang gây khó dễ, trong khi họ chỉ đang bị đo bằng một thước đo khác.',
      'Vượt qua ranh giới nghề nghiệp khi câu chuyện chạm tới sức khoẻ tinh thần: cố tự tư vấn, tự chẩn đoán hoặc gây sức ép chia sẻ thêm, thay vì lắng nghe, giữ bí mật và giới thiệu tới người có chuyên môn phù hợp cùng các hỗ trợ chính thức của tổ chức.',
    ],
    worksheet: [
      'Chọn một người trong công việc mà bạn thấy khó hợp tác. Họ đang bị đánh giá bằng thước đo nào mà bạn không bị đánh giá?',
      'Nếu làm theo điều bạn đang đề nghị, họ mất gì? Viết ít nhất hai thứ cụ thể.',
      'Viết một câu phỏng đoán về hoàn cảnh của họ mà bạn sẽ nói ra và mời họ sửa.',
      'Trong ba nhu cầu được nghe, cần thông tin, cần can thiệp, lần gần nhất bạn đã đưa nhầm thứ gì cho ai?',
      'Với tình huống này, điều gì nằm trong quyền hạn của bạn và điều gì không? Viết thành hai cột.',
    ],
    exercises: [
      {
        label: 'Một ngày một phỏng đoán',
        text: 'Trong năm ngày, mỗi ngày nói ra một câu phỏng đoán về hoàn cảnh của một đồng nghiệp và mời họ sửa. Ghi lại tỷ lệ bạn đoán đúng và thông tin mới thu được từ những lần đoán sai.',
        level: 'e',
      },
      {
        label: 'Đổi ghế',
        text: 'Chọn một bất đồng đang có, viết một trang trình bày quan điểm của phía kia ở ngôi thứ nhất, đầy đủ tới mức họ đọc sẽ thấy công bằng. Gửi cho họ đọc và xin xác nhận.',
        level: 'e',
      },
      {
        label: 'Phân loại nhu cầu',
        text: 'Trong một tuần, mỗi khi ai đó kể chuyện khó khăn, hỏi một câu ngắn để phân loại họ cần nghe, cần thông tin hay cần can thiệp. Ghi lại phân bố ba loại và loại nào bạn hay đoán sai nhất.',
        level: 'e',
      },
      {
        label: 'Bản đồ thước đo',
        text: 'Vẽ bảng các phòng ban bạn hay làm việc cùng, mỗi phòng ghi chỉ số họ bị đánh giá và điều họ sợ nhất. Kiểm chứng bằng cách hỏi trực tiếp một người ở mỗi phòng.',
        level: 'm',
      },
      {
        label: 'Nghe không giải pháp',
        text: 'Thực hiện ba cuộc trò chuyện dài mười phút trong đó bạn tuyệt đối không đưa lời khuyên nào. Cuối mỗi cuộc hỏi họ thấy có ích không và ghi lại câu trả lời nguyên văn.',
        level: 'm',
      },
      {
        label: 'Nghi thức kết thúc',
        text: 'Thiết kế cho mình một nghi thức năm phút sau mỗi cuộc trò chuyện nặng, ví dụ viết ba dòng và đi bộ một vòng. Áp dụng trong hai tuần và tự chấm mức mệt trước sau theo thang mười điểm.',
        level: 'm',
      },
      {
        label: 'Rà lại một lần chia tay',
        text: 'Chọn một trường hợp người từng nghỉ việc hoặc khách từng bỏ đi mà bạn thấy bất ngờ. Truy ngược các tín hiệu đã có trước đó, ghi rõ bạn đã bỏ qua tín hiệu nào và vì lý do gì, rồi thiết kế một cơ chế hỏi định kỳ để lần sau nghe được sớm hơn.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: 15 phút với người bạn ít trò chuyện nhất',
        text: 'Bảy ngày, mỗi ngày dành mười lăm phút trò chuyện với một người bạn ít nói chuyện riêng, chỉ hỏi và nghe, kết thúc bằng câu hỏi họ cần gì từ bạn. Ghi lại một điều bạn không hề biết trước đó về từng người. Ngày thứ bảy nhìn lại bảy điều đó và đánh giá bạn đang thiếu thông tin về ai nhiều nhất.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Phân biệt thấu cảm với đồng cảm ở mức chìm hẳn vào cảm xúc của người khác, và vì sao khác biệt này quan trọng trong công việc?',
        a: 'Thấu cảm giữ được ranh giới giữa trải nghiệm của họ và của bạn, nên bạn vẫn còn năng lực suy nghĩ và hành động. Chìm hẳn vào cảm xúc của người khác làm bạn cùng bất lực với họ, và lặp lại nhiều lần sẽ dẫn tới kiệt sức rồi né tránh. Trong các nghề tiếp xúc nhiều với khó khăn của người khác, giữ được ranh giới chính là điều kiện để làm nghề lâu dài chứ không phải sự lạnh lùng.',
      },
      {
        q: 'Vì sao câu "tôi hiểu cảm giác của bạn" thường phản tác dụng?',
        a: 'Vì nó là một khẳng định không kiểm chứng được và người nghe không có cách nào biết bạn hiểu thật hay chỉ nói cho xong. Thay thế hiệu quả là nêu cụ thể điều bạn hình dung, ở dạng phỏng đoán để họ sửa. Sự cụ thể là bằng chứng, và việc bạn sẵn sàng bị sửa là bằng chứng thứ hai rằng bạn đang thực sự tìm hiểu chứ không đang làm thủ tục.',
      },
      {
        q: 'Khi nào cuộc trò chuyện vượt quá vai trò của đồng nghiệp hay quản lý và cần chuyển tiếp?',
        a: 'Khi nội dung chạm tới sức khoẻ tinh thần kéo dài, tới an toàn của bản thân hoặc người khác, tới pháp lý hoặc tài chính cá nhân nghiêm trọng. Lúc đó vai trò đúng của bạn là lắng nghe, giữ kín thông tin, nói rõ giới hạn của mình, và giới thiệu tới người có chuyên môn phù hợp cùng các kênh hỗ trợ chính thức. Cố tự giải quyết ở những vùng này thường làm chậm việc người ta nhận được giúp đỡ thật.',
      },
    ],
    plan7:
      'Ngày 1: chọn một người bạn thấy khó hợp tác và viết ra thước đo họ đang bị đánh giá. Ngày 2: viết một trang trình bày quan điểm của họ ở ngôi thứ nhất. Ngày 3: nói ra một câu phỏng đoán và để họ sửa. Ngày 4: luyện phân loại ba nhu cầu trong mọi cuộc trò chuyện. Ngày 5: thực hiện một cuộc nghe mười phút không đưa lời khuyên nào. Ngày 6: làm một việc cụ thể trong quyền hạn của bạn cho người đó và nói rõ phần bạn không quyết được. Ngày 7: thiết kế nghi thức kết thúc cho riêng mình và ghi lại tuần vừa qua đã thay đổi điều gì trong quan hệ công việc.',
    evidence:
      'Kỹ năng này để lại dấu vết ở những thay đổi cơ chế mà bạn tạo ra sau khi nghe được điều người khác không nói thành lời: quy định chốt lịch làm việc trước hai tuần, kênh phản hồi ẩn danh, buổi trao đổi riêng định kỳ, hoặc quy trình bàn giao giúp bộ phận khác đỡ việc. Đó là hiện vật cho hồ sơ quản lý, nhân sự, chăm sóc khách hàng và vận hành. Trong phỏng vấn, kể một trường hợp bạn hiểu sai động cơ của ai đó, phát hiện ra và điều chỉnh; câu chuyện này đáng tin hơn nhiều so với việc tự nhận mình là người biết lắng nghe. Trong CV, viết ở dạng kết quả: "Phát hiện nguyên nhân nghỉ việc thật là lịch xếp sát ngày, đổi quy trình xếp ca cho 18 nhân viên, tỷ lệ nghỉ việc trong sáu tháng sau giảm rõ".',
    references: [
      { label: 'Greater Good Science Center — chủ đề Empathy', url: 'https://greatergood.berkeley.edu/topic/empathy', type: 'article', needsReview: true },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 8 — Viết email và tin nhắn công việc
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Email và tin nhắn công việc là loại văn bản có ba đặc điểm mà văn bản thường không có: người đọc đang bận, nó được lưu lại lâu hơn bạn tưởng, và nó thường được chuyển tiếp cho người bạn không lường trước. Vì vậy tiêu chuẩn đúng không phải là viết hay, mà là viết sao cho người đọc trong ba mươi giây biết phải làm gì, và sao cho khi văn bản đó xuất hiện trước một người thứ ba sáu tháng sau, nó vẫn tự giải thích được bối cảnh và vẫn không làm ai mất mặt.',
    why: {
      work: 'Ở nhiều tổ chức, email là nơi trách nhiệm được xác lập chính thức. Một chuỗi thư có ghi rõ ai yêu cầu gì vào ngày nào là thứ bảo vệ bạn khi có tranh chấp, và cũng là thứ khiến bạn khó xử nếu viết lúc đang bực. Viết tốt ở đây vừa là hiệu suất vừa là quản trị rủi ro.',
      interview:
        'Rất nhiều quá trình tuyển dụng bắt đầu và kết thúc bằng email: thư ứng tuyển, thư xác nhận lịch, thư cảm ơn sau phỏng vấn, thư hỏi kết quả. Một email hỏi kết quả viết đúng mực, nêu rõ mã vị trí và mốc thời gian đã trao đổi, tạo ấn tượng chuyên nghiệp cụ thể hơn mọi tính từ trong CV.',
      study:
        'Email gửi giảng viên hoặc gửi ban tổ chức học bổng thường quyết định bạn có được phản hồi hay không. Thư nêu rõ bạn là ai, đang học gì, đã tự tìm hiểu tới đâu và cần đúng điều gì sẽ được trả lời; thư một dòng nhờ giúp đỡ chung chung thường bị bỏ qua vì người nhận không biết bắt đầu từ đâu.',
      life: 'Khi khiếu nại dịch vụ, đòi lại tiền cọc hay làm việc với cơ quan hành chính, văn bản viết có cấu trúc kèm mốc thời gian và số hồ sơ được xử lý nhanh hơn nhiều so với các cuộc gọi cảm tính, đồng thời để lại bằng chứng nếu cần đi tiếp.',
    },
    framework: [
      {
        name: 'Dòng chủ đề mang hành động',
        detail:
          'Viết chủ đề gồm loại việc, đối tượng và mốc: "Cần xác nhận số liệu công nợ tháng 8 của ba đại lý trước 12/9". Người nhận đọc danh sách thư theo chủ đề, nên chủ đề mơ hồ đồng nghĩa với việc thư của bạn bị xếp vào nhóm để đọc sau.',
      },
      {
        name: 'Cấu trúc năm phần',
        detail:
          'Một câu chào, một câu bối cảnh cho người có thể quên, phần yêu cầu rõ ràng kèm hạn, phần chi tiết hoặc dữ liệu, và một câu chốt việc tiếp theo. Giữ nguyên thứ tự này giúp người đọc quen với nhịp và tìm được thứ họ cần mà không phải đọc hết.',
      },
      {
        name: 'Đặt đúng vai người nhận',
        detail:
          'Chỉ để ở dòng nhận chính những người phải hành động, còn lại chuyển sang dòng đồng gửi. Nếu có nhiều người cùng phải làm, ghi rõ tên gắn với từng việc trong thân thư, vì một yêu cầu gửi cho bốn người mà không phân việc thường không ai làm.',
      },
      {
        name: 'Chọn ngưỡng chuyển kênh',
        detail:
          'Đặt trước một ngưỡng cho mình: quá ba lượt qua lại mà chưa chốt, hoặc nội dung động tới lỗi và trách nhiệm, thì dừng viết và gọi. Sau cuộc gọi, gửi một thư tóm tắt điều đã thống nhất — vừa lưu vết vừa tránh hiểu khác nhau.',
      },
      {
        name: 'Đọc lại bằng con mắt người thứ ba',
        detail:
          'Trước khi gửi, đọc lại và tự hỏi nếu thư này bị chuyển tiếp cho cấp trên của người nhận thì có câu nào bạn muốn xoá không. Nếu có, sửa ngay câu đó. Đây cũng là lý do nên soạn thư khi đang bực nhưng để tới sáng hôm sau mới gửi.',
      },
    ],
    scenario:
      'Một nhân viên công nợ tháng nào cũng phải nhắc các đại lý gửi chứng từ đối chiếu và tháng nào cũng trễ. Thư cũ của cô mở đầu bằng ba đoạn giải thích quy định kế toán rồi mới tới lời đề nghị ở cuối. Cô đổi cách viết: chủ đề ghi rõ hạn và số đại lý, câu đầu nêu đúng ba việc cần gửi và ngày, phần dưới là bảng liệt kê từng đại lý kèm số tiền chưa khớp, và câu cuối nói rõ nếu quá hạn thì hồ sơ sẽ chuyển sang kỳ sau và ảnh hưởng tới lịch thanh toán. Cô cũng chuyển những người chỉ cần biết xuống dòng đồng gửi. Kỳ đối chiếu tháng sau, số đại lý nộp đúng hạn tăng từ năm trên mười hai lên mười trên mười hai, và hai trường hợp còn lại chủ động báo trước lý do.',
    comparison: [
      {
        weak: 'Viết một email dài kể toàn bộ quy định rồi để lời đề nghị ở dòng cuối cùng.',
        mature: 'Nêu đề nghị và hạn ngay trong ba dòng đầu, đưa phần quy định xuống dưới cho ai cần tra.',
      },
      {
        weak: 'Đưa mười người vào dòng nhận chính để chắc chắn không ai bỏ sót thông tin.',
        mature: 'Chỉ để người phải hành động ở dòng nhận chính, ghi tên gắn với từng việc, những người còn lại chuyển sang đồng gửi.',
      },
      {
        weak: 'Gửi tin nhắn chỉ có một chữ chào rồi đợi người kia trả lời mới nói nội dung.',
        mature: 'Gộp chào và nội dung trong một tin, để người nhận trả lời ngay được thay vì phải chờ hai nhịp.',
      },
      {
        weak: 'Trả lời thư khi đang bực, dùng câu mỉa hoặc viết hoa để nhấn mạnh.',
        mature: 'Soạn nháp, để qua một đêm hoặc ít nhất một giờ, xoá mọi câu nói về con người và chỉ giữ dữ kiện cùng đề nghị.',
      },
    ],
    mistakes: [
      'Dùng thư để tranh luận đúng sai với người đang bất đồng, mỗi bên trả lời dài hơn bên kia và thêm người vào đồng gửi; chuỗi thư đó gần như luôn kết thúc bằng việc cả hai đều mất uy tín trong mắt người thứ ba.',
      'Bỏ hết phần bối cảnh vì nghĩ người nhận đương nhiên nhớ, trong khi họ đang xử lý hàng chục việc khác, khiến họ phải lục lại lịch sử thư trước khi làm được gì và thường thì họ hoãn lại.',
      'Nhắc lại việc quá hạn bằng cách chuyển tiếp nguyên thư cũ kèm một dòng thúc, mà không nêu lại yêu cầu và hạn mới, làm người nhận phải cuộn xuống tìm và tiếp tục hoãn.',
    ],
    worksheet: [
      'Mở hộp thư đã gửi và tìm ba thư chưa ai trả lời. Dòng chủ đề của chúng có chứa hành động và mốc không?',
      'Với thư quan trọng nhất trong ba thư đó, viết lại đủ năm phần theo đúng thứ tự trong chương.',
      'Trong thư đó, ai thực sự phải hành động? Xếp lại danh sách người nhận chính và người đồng gửi.',
      'Đặt ngưỡng chuyển kênh của riêng bạn: bao nhiêu lượt qua lại thì bạn sẽ gọi điện? Ghi con số cụ thể.',
      'Đọc lại thư và tìm câu nào bạn không muốn cấp trên của người nhận đọc thấy. Viết lại câu đó bằng dữ kiện.',
    ],
    exercises: [
      {
        label: 'Chữa mười dòng chủ đề',
        text: 'Lấy mười thư gần nhất bạn gửi, viết lại toàn bộ dòng chủ đề sao cho mỗi cái chứa việc cần và mốc thời gian, dài không quá mười hai chữ. Nhờ một đồng nghiệp đọc chỉ dòng chủ đề và đoán nội dung.',
        level: 'e',
      },
      {
        label: 'Ba dòng đầu',
        text: 'Trong ba ngày, mọi email của bạn phải nói xong đề nghị và hạn trong ba dòng đầu tiên. Ghi lại thư nào bạn thấy khó áp dụng và lý do.',
        level: 'e',
      },
      {
        label: 'Dọn dòng người nhận',
        text: 'Với năm thư sắp gửi, phân loại từng người nhận thành phải hành động, cần biết, hoặc không cần có mặt. Xoá nhóm thứ ba và ghi lại số người bạn đã bỏ ra khỏi thư.',
        level: 'e',
      },
      {
        label: 'Bộ mẫu thư',
        text: 'Soạn ba mẫu thư cho ba tình huống bạn viết nhiều nhất, ví dụ nhắc hạn, báo chậm tiến độ, xin duyệt. Dùng thử trong hai tuần và sửa lại dựa trên chỗ người nhận hay hỏi thêm.',
        level: 'm',
      },
      {
        label: 'Thư sau cuộc gọi',
        text: 'Trong tuần này, sau mỗi cuộc gọi công việc có kết luận, gửi ngay một thư tóm tắt ba dòng gồm điều đã thống nhất, việc mỗi bên làm và hạn. Ghi lại số lần người kia đính chính điều bạn tưởng đã thống nhất.',
        level: 'm',
      },
      {
        label: 'Thư khó viết',
        text: 'Chọn một thư bạn đang né viết, ví dụ báo tin không thuận lợi cho khách. Soạn nháp, để qua một đêm, sửa lại bỏ hết từ chỉ con người, rồi nhờ một người đọc trước khi gửi.',
        level: 'm',
      },
      {
        label: 'Đo lại một quy trình thư',
        text: 'Chọn một loại thư định kỳ của bạn, đo tỷ lệ phản hồi đúng hạn trong tháng hiện tại. Viết lại theo cấu trúc năm phần, áp dụng một tháng, rồi so hai con số và ghi phần nào của thư tạo ra thay đổi.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: hộp thư sạch nghĩa',
        text: 'Bảy ngày, mọi thư bạn gửi đều phải qua ba chốt trước khi bấm gửi: chủ đề có hành động và mốc, đề nghị nằm trong ba dòng đầu, và không có câu nào bạn ngại bị chuyển tiếp. Mỗi tối ghi số thư vi phạm từng chốt. Cuối tuần xem chốt nào bạn hay trượt nhất và vì sao.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Khi nào nên dừng trao đổi qua email và chuyển sang gọi điện?',
        a: 'Ba dấu hiệu: đã qua ba lượt qua lại mà điểm cần chốt vẫn chưa thu hẹp, nội dung động tới trách nhiệm hoặc lỗi của một cá nhân, hoặc bạn thấy mình đang soạn rồi xoá nhiều lần vì sợ bị hiểu sai. Cả ba đều cho thấy chi phí hiểu nhầm đã vượt chi phí một cuộc gọi. Sau khi gọi, luôn gửi lại một thư tóm tắt để giữ vết và thống nhất cách hiểu.',
      },
      {
        q: 'Vì sao nên hạn chế số người ở dòng nhận chính?',
        a: 'Vì trách nhiệm bị pha loãng theo số người được yêu cầu. Khi bốn người cùng nhận một yêu cầu không phân việc, mỗi người đều có lý do hợp lý để nghĩ người khác đang làm. Cách xử lý là chỉ để người phải hành động ở dòng nhận chính và ghi rõ tên gắn với từng đầu việc, còn những người chỉ cần biết thì chuyển xuống dòng đồng gửi.',
      },
      {
        q: 'Một thư báo tin không thuận lợi nên có những phần nào?',
        a: 'Bốn phần: nêu thẳng sự việc và mức ảnh hưởng ngay đầu thư, nói ngắn gọn nguyên nhân bằng dữ kiện chứ không đổ lỗi, nêu việc đã và đang làm để xử lý kèm mốc, và nêu điều bạn cần từ người nhận nếu có. Tránh mở đầu bằng một đoạn dài xin lỗi, vì nó khiến người đọc phải đọc thêm mới biết chuyện gì và làm tăng lo lắng một cách không cần thiết.',
      },
    ],
    plan7:
      'Ngày 1: rà mười thư đã gửi và chấm điểm dòng chủ đề. Ngày 2: viết lại ba dòng đầu cho mọi thư trong ngày. Ngày 3: dọn dòng người nhận và ghi số người đã bỏ ra. Ngày 4: soạn ba mẫu thư cho ba tình huống bạn viết nhiều nhất. Ngày 5: gửi thư tóm tắt sau mọi cuộc gọi có kết luận. Ngày 6: viết thư khó nhất bạn đang né, để qua đêm rồi mới gửi. Ngày 7: đo lại tỷ lệ phản hồi trong tuần và chọn một mẫu thư để chuẩn hoá cho cả nhóm.',
    evidence:
      'Hiện vật rõ nhất là bộ mẫu thư do bạn chuẩn hoá cho một quy trình lặp lại, kèm số đo trước và sau: tỷ lệ phản hồi đúng hạn, số lượt qua lại trung bình để chốt một việc, hoặc số ngày trung bình từ lúc yêu cầu tới lúc nhận đủ chứng từ. Loại bằng chứng này rất hợp cho hồ sơ ở các vị trí kế toán, hành chính, mua hàng, vận hành và chăm sóc khách hàng. Trong phỏng vấn, mang theo một mẫu đã ẩn thông tin nhạy cảm và giải thích vì sao từng phần tồn tại. Trong CV, viết dạng: "Chuẩn hoá quy trình thư đối chiếu công nợ cho 12 đại lý, tỷ lệ nộp chứng từ đúng hạn tăng từ 5/12 lên 10/12 sau một kỳ".',
    references: [
      { label: 'Purdue Online Writing Lab', url: 'https://owl.purdue.edu/', type: 'article' },
      { label: 'PlainLanguage.gov — bộ nguyên tắc viết rõ ràng', url: 'https://www.plainlanguage.gov/guidelines/', type: 'article', needsReview: true },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 9 — Viết báo cáo
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Báo cáo là văn bản tồn tại để phục vụ một quyết định, không phải để chứng minh bạn đã làm nhiều việc. Vì thế câu hỏi đầu tiên khi viết không phải là có những số liệu gì, mà là người đọc sẽ phải quyết định điều gì sau khi đọc. Một báo cáo đạt chuẩn tách bạch rõ ba lớp và không cho chúng lẫn vào nhau: dữ kiện đo được, cách bạn diễn giải dữ kiện, và đề xuất hành động của bạn. Lớp thứ nhất người khác kiểm được, lớp thứ hai người ta có thể không đồng ý, lớp thứ ba là ý kiến — trộn ba lớp là cách nhanh nhất làm mất niềm tin vào cả báo cáo.',
    why: {
      work: 'Ở cấp càng cao, người ta càng ra quyết định dựa trên báo cáo chứ không dựa trên quan sát trực tiếp. Một báo cáo trung thực về cả phần xấu giúp tổ chức chỉnh hướng sớm; một báo cáo chỉ có phần đẹp làm cả nhóm chạy thêm nhiều tháng theo hướng sai và người viết là người mất uy tín cuối cùng.',
      interview:
        'Khi ứng tuyển các vị trí phân tích, marketing, vận hành hay quản lý, một báo cáo thật do bạn viết là bằng chứng thuyết phục hơn mọi mô tả kinh nghiệm. Người phỏng vấn nhìn vào cách bạn chọn chỉ số, cách bạn nêu giới hạn dữ liệu và cách bạn kết luận có chừng mực.',
      study:
        'Báo cáo thực tập và khoá luận trượt phần lớn không phải vì thiếu số liệu mà vì không nêu rõ câu hỏi nghiên cứu và không phân biệt được đâu là kết quả đo được, đâu là suy luận của người viết. Cấu trúc ba lớp giải quyết đúng vấn đề này.',
      life: 'Khi tổng kết chi tiêu gia đình hay đánh giá một khoản mua lớn, việc viết ra dữ kiện trước rồi mới tới diễn giải giúp bạn phát hiện những kết luận mình đã tin sẵn từ trước. Đây là kiến thức chung để tự tổ chức thông tin; các quyết định tài chính có rủi ro cao vẫn nên tham vấn chuyên gia phù hợp.',
    },
    framework: [
      {
        name: 'Xác định quyết định phục vụ',
        detail:
          'Viết một dòng ở đầu bản nháp: báo cáo này giúp ai quyết định điều gì. Mọi mục không đóng góp cho dòng đó sẽ bị chuyển xuống phụ lục. Không có dòng này thì báo cáo có xu hướng phình ra theo lượng dữ liệu sẵn có chứ không theo nhu cầu.',
      },
      {
        name: 'Tóm tắt điều hành đứng đầu',
        detail:
          'Nửa trang đầu chứa: điều đã xảy ra, ý nghĩa của nó, và đề xuất kèm cái giá. Viết phần này sau cùng nhưng đặt lên trước, vì nhiều người chỉ đọc đúng phần này và họ vẫn phải quyết đúng được với chừng đó thông tin.',
      },
      {
        name: 'Số phải có mốc so sánh',
        detail:
          'Mọi con số đi kèm ít nhất một mốc: kỳ trước, mục tiêu, hoặc mức của nhóm tương tự. Một chỉ số đứng trơ không nói được gì; chỉ khi có mốc thì người đọc mới biết nên vui, nên lo, hay nên bỏ qua.',
      },
      {
        name: 'Tách ba lớp',
        detail:
          'Dùng nhãn rõ ràng trong văn bản cho phần dữ kiện, phần diễn giải và phần đề xuất. Cách trình bày này cho phép người đọc đồng ý với dữ kiện mà vẫn tranh luận diễn giải, thay vì bác bỏ toàn bộ báo cáo khi họ không đồng tình với kết luận.',
      },
      {
        name: 'Nêu giới hạn dữ liệu',
        detail:
          'Một đoạn ngắn nói rõ dữ liệu thiếu ở đâu, đo trong khoảng nào và điều gì có thể làm sai lệch. Đoạn này làm tăng chứ không giảm độ tin cậy, vì nó chứng minh bạn biết ranh giới của kết luận mình đưa ra.',
      },
      {
        name: 'Kết bằng việc và người',
        detail:
          'Kết thúc bằng bảng ba cột: việc cần làm, người chịu trách nhiệm, mốc thời gian. Một báo cáo không dẫn tới việc cụ thể sẽ được khen là đầy đủ rồi lưu vào thư mục và không đổi được gì.',
      },
    ],
    scenario:
      'Một nhân viên marketing của chuỗi cà phê viết báo cáo chiến dịch khuyến mãi hè dài mười tám trang, đầy biểu đồ, kết luận là chiến dịch thành công vì lượt tiếp cận tăng mạnh. Ban giám đốc đọc xong không quyết được gì và yêu cầu làm lại. Bản thứ hai bắt đầu bằng nửa trang: chiến dịch kéo doanh thu cửa hàng tăng chín phần trăm so với cùng kỳ nhưng biên lợi nhuận giảm vì mức giảm giá, tính ra lãi gộp gần như không đổi; đề xuất là giữ chương trình cho ba cửa hàng có tỷ lệ khách quay lại cao và dừng ở năm cửa hàng còn lại. Báo cáo tách rõ phần dữ kiện, phần diễn giải và một đoạn nêu giới hạn rằng dữ liệu khách quay lại chỉ có ở cửa hàng dùng ứng dụng tích điểm. Cuộc họp duyệt kéo dài hai mươi phút thay vì hai giờ, và có ba đầu việc kèm tên người phụ trách.',
    comparison: [
      {
        weak: 'Trình bày theo trình tự thời gian công việc đã làm, từ tuần một tới tuần cuối.',
        mature: 'Trình bày theo thứ tự quan trọng với người đọc: kết luận trước, bằng chứng sau, quá trình để phụ lục.',
      },
      {
        weak: 'Chọn chỉ số làm nổi bật kết quả tốt và im lặng về chỉ số xấu đi.',
        mature: 'Chốt bộ chỉ số từ trước khi có kết quả, báo cáo đủ cả chỉ số xấu, kèm giải thích và đề xuất xử lý.',
      },
      {
        weak: 'Viết "lượt tiếp cận tăng mạnh" mà không nói tăng so với cái gì và trong bao lâu.',
        mature: 'Viết "lượt tiếp cận 82 nghìn trong 6 tuần, gấp 2,1 lần cùng kỳ năm trước và vượt mục tiêu 60 nghìn".',
      },
    ],
    mistakes: [
      'Dùng biểu đồ để tạo ấn tượng thay vì để so sánh: cắt trục tung không bắt đầu từ mức hợp lý, đổi khoảng thời gian giữa các biểu đồ, hoặc dùng biểu đồ tròn cho nhiều hơn năm hạng mục khiến không ai đọc được tỷ lệ.',
      'Trộn suy luận vào phần dữ kiện bằng những cụm như rõ ràng là, cho thấy rằng, chứng tỏ, khiến người đọc không phân biệt được đâu là số đo và đâu là kết luận của người viết.',
      'Giấu phần kết quả kém xuống mục cuối hoặc phụ lục với hy vọng không ai đọc tới; khi bị phát hiện, toàn bộ những phần đúng trong báo cáo cũng mất giá trị vì người đọc không còn cơ sở tin phần nào.',
    ],
    worksheet: [
      'Báo cáo bạn sắp viết phục vụ ai quyết định điều gì? Viết đúng một dòng và giữ nó ở đầu bản nháp.',
      'Liệt kê các chỉ số bạn định đưa vào. Với từng chỉ số, ghi mốc so sánh sẽ dùng: kỳ trước, mục tiêu, hay nhóm tương tự.',
      'Trong bản nháp hiện tại, gạch chân mọi câu đang trộn dữ kiện với diễn giải và tách chúng thành hai câu riêng.',
      'Dữ liệu của bạn thiếu ở đâu và điều gì có thể làm nó sai lệch? Viết đoạn giới hạn dài ba tới năm câu.',
      'Viết bảng ba cột việc, người, hạn cho các đề xuất của bạn. Có đề xuất nào chưa có người chịu trách nhiệm không?',
    ],
    exercises: [
      {
        label: 'Nửa trang đứng một mình',
        text: 'Viết phần tóm tắt điều hành cho một báo cáo cũ của bạn, đưa riêng nửa trang đó cho một đồng nghiệp và hỏi họ quyết được gì. Sửa cho tới khi họ trả lời đúng mà không cần đọc phần còn lại.',
        level: 'e',
      },
      {
        label: 'Gắn mốc cho mọi số',
        text: 'Lấy một báo cáo đã nộp, đánh dấu mọi con số không có mốc so sánh và bổ sung mốc cho từng cái. Đếm bao nhiêu con số ban đầu đứng trơ.',
        level: 'e',
      },
      {
        label: 'Ba màu ba lớp',
        text: 'Dùng ba màu tô lên bản in báo cáo: dữ kiện, diễn giải, đề xuất. Nhìn tỷ lệ ba màu và các đoạn bị lẫn màu, đó chính là chỗ cần viết lại.',
        level: 'e',
      },
      {
        label: 'Viết đoạn giới hạn',
        text: 'Với báo cáo gần nhất, viết bổ sung một đoạn nêu rõ dữ liệu thiếu chỗ nào và điều gì có thể làm sai lệch. Gửi cho người nhận báo cáo và ghi lại phản ứng của họ.',
        level: 'm',
      },
      {
        label: 'Sửa biểu đồ gây hiểu nhầm',
        text: 'Tìm ba biểu đồ trong tài liệu nội bộ hoặc trên báo có trục bị cắt hoặc khoảng thời gian không nhất quán. Vẽ lại đúng cách và so sánh cảm nhận về thông điệp giữa hai bản.',
        level: 'm',
      },
      {
        label: 'Chốt chỉ số trước',
        text: 'Với một hoạt động sắp bắt đầu, viết và gửi trước bộ chỉ số cùng ngưỡng đánh giá cho người liên quan. Khi có kết quả, báo cáo đủ cả chỉ số xấu và ghi lại cảm giác của bạn khi làm việc đó.',
        level: 'm',
      },
      {
        label: 'Viết lại một báo cáo bị bỏ quên',
        text: 'Chọn một báo cáo từng nộp mà không dẫn tới hành động nào. Viết lại theo sáu bước trong chương, trình bày trong hai mươi phút và đo bằng số quyết định thực sự được đưa ra sau buổi đó.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: nhật ký chỉ số',
        text: 'Bảy ngày, mỗi ngày chọn một con số xuất hiện trong công việc và viết ba dòng: nó đo cái gì, đo trong khoảng nào, và mốc so sánh nào làm nó có nghĩa. Ngày thứ bảy đọc lại và đánh dấu những con số mà cả nhóm vẫn đang dùng dù không ai biết chính xác nó đo gì.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nêu giới hạn dữ liệu lại làm tăng độ tin cậy của báo cáo?',
        a: 'Vì người đọc có kinh nghiệm biết chắc mọi bộ dữ liệu đều có giới hạn. Nếu báo cáo không nêu, họ phải tự đoán bạn không biết hoặc bạn cố tình giấu, và cả hai khả năng đều làm giảm niềm tin. Khi bạn nêu rõ, họ chuyển sang đánh giá kết luận trong phạm vi bạn đã khoanh, đó là cuộc thảo luận có ích. Điều kiện là phần giới hạn phải cụ thể, ví dụ dữ liệu khách quay lại chỉ có ở nhóm cửa hàng dùng ứng dụng.',
      },
      {
        q: 'Đặt kết luận ở đầu báo cáo có làm người đọc bỏ qua phần phân tích không?',
        a: 'Người bận sẽ bỏ qua phần phân tích dù bạn đặt kết luận ở đâu, khác biệt chỉ là họ có ra được quyết định đúng hay không. Đặt kết luận ở đầu bảo đảm người chỉ đọc nửa trang vẫn nắm được điều quan trọng, còn người cần kiểm chứng vẫn đọc tiếp phần bằng chứng. Đặt kết luận ở cuối chỉ tạo cảm giác hồi hộp cho người viết, không mang lại lợi ích nào cho người đọc.',
      },
      {
        q: 'Một chỉ số tăng mạnh nhưng lợi nhuận không đổi thì nên báo cáo thế nào?',
        a: 'Nêu cả hai con số cạnh nhau ngay trong phần tóm tắt, kèm cách bạn hiểu vì sao chúng không đi cùng nhau, và tách rõ đâu là suy luận. Sau đó đề xuất phép kiểm tiếp theo để xác nhận hoặc bác bỏ cách hiểu đó. Chỉ báo cáo chỉ số đẹp là hành vi làm hỏng khả năng ra quyết định của cả tổ chức, và nó luôn bị phát hiện ở kỳ sau khi con số quan trọng không cải thiện.',
      },
    ],
    plan7:
      'Ngày 1: viết dòng quyết định phục vụ cho báo cáo đang làm. Ngày 2: liệt kê chỉ số và gán mốc so sánh cho từng cái. Ngày 3: viết phần tóm tắt điều hành nửa trang và nhờ một người kiểm. Ngày 4: tách ba lớp bằng cách tô màu bản nháp và viết lại đoạn bị lẫn. Ngày 5: viết đoạn nêu giới hạn dữ liệu. Ngày 6: lập bảng việc, người, hạn cho phần đề xuất. Ngày 7: trình bày trong hai mươi phút và ghi lại số quyết định được đưa ra.',
    evidence:
      'Giữ lại một báo cáo hoàn chỉnh đã ẩn thông tin nhạy cảm để làm mẫu trong hồ sơ, ưu tiên bản có đủ đoạn nêu giới hạn dữ liệu và bảng việc kèm người phụ trách, vì hai phần này hiếm gặp và cho thấy trình độ ngay lập tức. Kèm theo là bằng chứng báo cáo đã dẫn tới quyết định thật, ví dụ biên bản họp duyệt hoặc thay đổi được thực hiện sau đó. Trong phỏng vấn cho các vị trí phân tích và quản lý, kể lại một lần bạn phải báo cáo kết quả kém, cách bạn trình bày và điều đã xảy ra sau đó. Trong CV, viết dạng: "Viết báo cáo đánh giá chiến dịch khuyến mãi cho 8 cửa hàng, chỉ ra lãi gộp không đổi dù doanh thu tăng 9%, dẫn tới quyết định dừng chương trình ở 5 điểm bán".',
    references: [
      { label: 'UNC Writing Center — công cụ và mẹo viết học thuật', url: 'https://writingcenter.unc.edu/tips-and-tools/', type: 'article', needsReview: true },
      { label: 'Purdue Online Writing Lab', url: 'https://owl.purdue.edu/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 10 — Kể chuyện — Storytelling
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Kể chuyện trong công việc không phải là làm cho thông tin trở nên hoa mỹ, mà là sắp xếp thông tin theo cấu trúc mà trí nhớ con người bám được: một nhân vật cụ thể, một điều họ muốn, một cản trở, một quyết định, và một kết quả có thể kiểm chứng. Danh sách gạch đầu dòng truyền dữ liệu tốt nhưng bị quên nhanh; câu chuyện giữ được lâu vì người nghe phải tự dựng hình ảnh, và chính công sức dựng hình ấy tạo ra trí nhớ. Ranh giới đạo đức của kỹ năng này rất rõ: được phép chọn chi tiết và sắp xếp thứ tự, không được phép bịa sự kiện hay ghép kết quả của người khác thành của mình.',
    why: {
      work: 'Khi bảo vệ một đề xuất, phần số liệu thuyết phục lý trí nhưng phần câu chuyện mới làm người nghe nhớ tới nó ở cuộc họp tuần sau, lúc bạn không có mặt. Một câu chuyện về đúng một khách hàng cụ thể thường di chuyển trong tổ chức xa hơn cả một bảng dữ liệu đầy đủ.',
      interview:
        'Câu hỏi hành vi là bài kiểm tra kể chuyện trá hình. Ứng viên trả lời bằng khái quát chung chung không để lại gì; ứng viên kể một tình huống có bối cảnh, cản trở, hành động riêng của mình và kết quả đo được thì được nhớ tới khi hội đồng ngồi lại so sánh cuối ngày.',
      study:
        'Kiến thức trừu tượng bám vào trí nhớ tốt hơn nhiều khi được gắn với một trường hợp cụ thể có nhân vật và diễn biến. Khi tự học, tập kể lại mỗi khái niệm bằng một tình huống thật là cách kiểm tra xem bạn có hiểu điều kiện áp dụng của nó hay không.',
      life: 'Trong gia đình và cộng đồng, những giá trị bạn muốn truyền lại hầu như không đi qua lời khuyên mà đi qua chuyện kể. Trẻ con quên lời dặn nhưng nhớ chuyện, và người lớn cũng vậy.',
    },
    framework: [
      {
        name: 'Chọn một nhân vật cụ thể',
        detail:
          'Thay vì nói khách hàng nói chung, chọn một người có tên, có nghề, có hoàn cảnh: chị Hoa bán tạp hoá ở chợ Bà Chiểu, mở cửa từ năm giờ sáng. Người nghe không thể hình dung một tập hợp, nhưng hình dung được một người, và mọi cảm giác về vấn đề đều đi qua hình dung đó.',
      },
      {
        name: 'Nêu điều họ muốn và cản trở',
        detail:
          'Nói rõ mục tiêu của nhân vật và thứ chặn họ lại, càng cụ thể càng tốt. Đây là phần tạo ra sức căng; nếu không có cản trở thật thì phần còn lại chỉ là mô tả và người nghe không có lý do gì để theo dõi tiếp.',
      },
      {
        name: 'Dựng điểm ngoặt',
        detail:
          'Chỉ ra khoảnh khắc mọi thứ đổi chiều và ai đã làm gì tại khoảnh khắc đó. Điểm ngoặt phải là một hành động hoặc một phát hiện cụ thể, không phải một quá trình mờ như dần dần mọi thứ tốt lên.',
      },
      {
        name: 'Kết bằng số đo được',
        detail:
          'Kết quả phải kiểm chứng được: thời gian giảm bao nhiêu, số đơn tăng bao nhiêu, việc gì không còn phải làm nữa. Đây là chỗ câu chuyện công việc khác chuyện kể giải trí, và cũng là chỗ nhiều người kể mạnh phần cảm xúc lại đánh mất độ tin cậy.',
      },
      {
        name: 'Nối về hành động của người nghe',
        detail:
          'Một câu cuối chuyển từ câu chuyện sang điều bạn muốn người nghe làm hoặc hiểu. Không có câu này, người nghe thấy hay rồi đi ra và không ai biết bạn kể để làm gì.',
      },
    ],
    scenario:
      'Một cán bộ gây quỹ của tổ chức phi lợi nhuận về nước sạch chuẩn bị buổi vận động tài trợ. Bản trình bày đầu đầy số liệu về số hộ chưa có nước máy và ba biểu đồ tỷ lệ, nhà tài trợ nghe xong hỏi vài câu lịch sự rồi thôi. Bản thứ hai bắt đầu bằng một người cụ thể: cô giáo mầm non ở một điểm trường phải chở nước bằng can nhựa mỗi sáng, mất bốn mươi phút trước giờ đón trẻ, và những ngày mưa đường trơn thì lớp phải hoãn. Điểm ngoặt là khi một phụ huynh đề xuất góp công đào giếng nhưng thiếu chi phí lọc. Kết quả nêu bằng số: sau khi lắp hệ lọc, thời gian chuẩn bị của cô còn năm phút, và tỷ lệ đi học chuyên cần trong mùa mưa cải thiện thấy rõ theo sổ điểm danh. Câu cuối nói rõ một khoản tài trợ tương đương sẽ phủ được bao nhiêu điểm trường trong năm nay. Buổi làm việc kết thúc bằng một cam kết cụ thể chứ không phải lời hẹn xem xét.',
    comparison: [
      {
        weak: 'Mở đầu bằng bối cảnh chung của ngành và lịch sử tổ chức trong năm phút.',
        mature: 'Mở đầu bằng một người và một thời điểm cụ thể, đưa bối cảnh vào sau khi người nghe đã có chỗ để gắn thông tin.',
      },
      {
        weak: 'Kể một chuỗi sự việc liên tiếp mà không có gì cản trở, nên không ai biết vì sao mình phải nghe tiếp.',
        mature: 'Đặt cản trở rõ ràng ở phần đầu và trì hoãn phần giải quyết, để người nghe tự đặt câu hỏi trước khi bạn trả lời.',
      },
      {
        weak: 'Kết thúc bằng cảm xúc dâng cao nhưng không có con số nào kiểm chứng được.',
        mature: 'Kết thúc bằng cả hai: một hình ảnh cụ thể và một kết quả đo được, để câu chuyện vừa được nhớ vừa được tin.',
      },
    ],
    mistakes: [
      'Thêm chi tiết không có thật để câu chuyện hay hơn, hoặc gộp nhiều trường hợp thành một nhân vật rồi kể như một người có thật; khi người nghe phát hiện, họ sẽ nghi ngờ toàn bộ phần số liệu đi kèm và điều đó không sửa được bằng lời giải thích.',
      'Kể quá dài vì tiếc các chi tiết mình thấy thú vị, khiến điểm ngoặt tới quá muộn và người nghe đã rời đi trước khi hiểu vì sao câu chuyện liên quan tới họ.',
      'Đặt mình làm nhân vật chính trong mọi câu chuyện, kể cả những việc do cả nhóm làm, khiến người trong cuộc khó chịu và người ngoài dần nghi ngờ phần đóng góp thật của bạn.',
    ],
    worksheet: [
      'Chọn một kết quả công việc bạn muốn người khác nhớ. Ai là nhân vật cụ thể trong câu chuyện đó, tên gì, làm gì?',
      'Nhân vật đó muốn gì và điều gì đang chặn họ? Viết cản trở bằng một câu có chi tiết quan sát được.',
      'Điểm ngoặt là khoảnh khắc nào và ai đã làm gì tại đó? Ghi rõ hành động, không ghi quá trình chung.',
      'Kết quả đo được là gì? Viết ít nhất một con số kèm mốc so sánh.',
      'Câu cuối nối về hành động của người nghe là gì? Viết một câu duy nhất.',
    ],
    exercises: [
      {
        label: 'Chín mươi giây',
        text: 'Chọn một việc bạn đã làm và kể lại trong đúng chín mươi giây có đủ nhân vật, cản trở, điểm ngoặt, kết quả. Bấm giờ, ghi âm, nghe lại và cắt phần không phục vụ bốn thành phần đó.',
        level: 'e',
      },
      {
        label: 'Đổi từ tập hợp sang một người',
        text: 'Lấy ba câu bạn hay nói kiểu khách hàng thường hoặc người dùng nói chung, viết lại mỗi câu bằng một người cụ thể có nghề và hoàn cảnh. Kiểm bằng cách hỏi đồng nghiệp họ hình dung ra gì.',
        level: 'e',
      },
      {
        label: 'Tìm cản trở thật',
        text: 'Với một câu chuyện công việc bạn hay kể, viết ra cản trở thật sự khó nhất lúc đó. Nếu không tìm được cản trở nào, đó là dấu hiệu câu chuyện chưa đáng kể và nên chọn tình huống khác.',
        level: 'e',
      },
      {
        label: 'Kho năm câu chuyện',
        text: 'Xây kho gồm năm câu chuyện nghề nghiệp của bạn: một lần thất bại, một lần thuyết phục được người khác, một lần xử lý xung đột, một lần học nhanh, một lần dẫn dắt. Mỗi câu viết đủ năm thành phần và giới hạn dưới hai trăm chữ.',
        level: 'm',
      },
      {
        label: 'Số liệu thành cảnh',
        text: 'Lấy ba con số trong công việc và biến mỗi con số thành một cảnh cụ thể có người và hành động, giữ nguyên độ chính xác. Trình bày cả hai bản cho một nhóm nhỏ và hỏi họ nhớ được gì sau một ngày.',
        level: 'm',
      },
      {
        label: 'Kể lại chuyện của người khác',
        text: 'Phỏng vấn một đồng nghiệp về một việc họ đã làm, viết lại thành câu chuyện đủ cấu trúc, ghi rõ công của họ, rồi gửi cho họ duyệt trước khi dùng ở bất cứ đâu.',
        level: 'm',
      },
      {
        label: 'Mở đầu một buổi thuyết trình bằng chuyện',
        text: 'Trong một buổi trình bày thật, thay phần mở đầu bằng một câu chuyện chín mươi giây. Sau buổi đó hỏi ba người nghe xem họ nhớ điều gì nhất và so với thông điệp bạn định truyền.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: dựng kho chuyện dưới 200 chữ',
        text: 'Bảy ngày, mỗi ngày viết một câu chuyện dưới hai trăm chữ từ chính công việc của bạn, đủ năm thành phần, và đọc to cho một người nghe. Ghi lại câu hỏi đầu tiên họ hỏi sau khi nghe, vì câu hỏi đó cho biết chỗ nào trong câu chuyện còn thiếu. Cuối tuần chọn ba câu tốt nhất đưa vào kho dùng cho phỏng vấn.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao một nhân vật cụ thể lại hiệu quả hơn số liệu tổng hợp khi mở đầu?',
        a: 'Vì người nghe cần một chỗ để gắn thông tin vào trước khi tiếp nhận cái tổng quát. Một người cụ thể tạo ra hình dung, và mọi con số nói sau đó được hiểu như quy mô của cái đã hình dung được. Ngược lại, số liệu mở đầu buộc người nghe xử lý cái trừu tượng khi chưa có neo, nên nó trôi qua. Điều này không có nghĩa bỏ số liệu, mà là đặt nó sau chứ không trước.',
      },
      {
        q: 'Ranh giới giữa chọn lọc chi tiết và bóp méo sự thật nằm ở đâu?',
        a: 'Chọn lọc là bỏ bớt chi tiết không liên quan mà việc bỏ đi không làm người nghe hiểu sai bản chất sự việc, cũng không làm thay đổi phần công trạng và trách nhiệm. Bóp méo là thêm sự kiện không xảy ra, gộp nhiều người thành một mà vẫn kể như người thật, giấu điều kiện quan trọng khiến kết quả trông dễ đạt hơn thực tế, hoặc nhận công việc của người khác. Phép thử đơn giản là hỏi liệu người trong cuộc nghe câu chuyện này có thấy công bằng không.',
      },
      {
        q: 'Trong phỏng vấn, một câu trả lời hành vi tốt nên dài bao nhiêu và gồm những gì?',
        a: 'Khoảng một tới hai phút là đủ, gồm bối cảnh ngắn để người nghe hiểu độ khó, việc chính bạn làm chứ không phải việc cả nhóm làm, một khó khăn thật và cách bạn xử lý, và kết quả có con số hoặc hệ quả kiểm chứng được. Thêm một câu về điều bạn làm khác đi nếu gặp lại thường nâng chất lượng câu trả lời rõ rệt, vì nó cho thấy bạn đã rút ra được gì chứ không chỉ kể lại.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê mười việc đáng kể bạn đã làm và khoanh năm việc có cản trở rõ. Ngày 2: viết câu chuyện thứ nhất đủ năm thành phần dưới hai trăm chữ. Ngày 3: viết câu thứ hai và thứ ba, tập trung vào phần điểm ngoặt. Ngày 4: bổ sung con số kiểm chứng cho cả ba câu. Ngày 5: đọc to cho một người nghe và ghi câu hỏi đầu tiên họ hỏi. Ngày 6: viết hai câu còn lại cho đủ kho năm câu chuyện. Ngày 7: chọn một câu và dùng thật trong một buổi trình bày hoặc một cuộc trò chuyện nghề nghiệp.',
    evidence:
      'Kho năm câu chuyện được viết ra và cập nhật chính là hiện vật, và nó phục vụ trực tiếp cho phỏng vấn ở mọi cấp. Ngoài ra, một bài viết hoặc một video ngắn kể lại một dự án theo cấu trúc trên, đăng công khai trên hồ sơ nghề nghiệp của bạn, vừa là bằng chứng năng lực kể chuyện vừa là bằng chứng cho chính dự án đó. Với các vị trí bán hàng, gây quỹ, truyền thông và quản lý, hãy chuẩn bị sẵn một câu chuyện dưới hai phút về lần bạn thay đổi được quyết định của người khác. Trong CV, tránh viết tính từ về khả năng kể chuyện; thay vào đó dẫn liên kết tới bài viết hoặc ghi kết quả cụ thể mà phần trình bày của bạn đã tạo ra.',
    references: [
      { label: 'The Moth — kho chuyện kể trực tiếp và hướng dẫn kể chuyện', url: 'https://themoth.org/', type: 'article' },
      { label: 'StoryCorps', url: 'https://storycorps.org/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 11 — Thuyết trình
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Thuyết trình trong công việc là hoạt động thiết kế nhiều hơn là hoạt động biểu diễn. Phần lớn chất lượng được quyết định trước khi bạn mở miệng: bạn có biết ai là người quyết trong phòng, họ cần quyết điều gì, họ đang lo gì, và bạn có bao nhiêu phút thực sự. Slide đẹp không cứu nổi một bài không xác định được thông điệp chính; ngược lại một bài có thông điệp rõ, ba luận điểm chống đỡ và phần hỏi đáp chuẩn bị kỹ vẫn thắng dù trình bày mộc mạc.',
    why: {
      work: 'Ngân sách, nhân sự và cơ hội dự án thường được phân bổ trong những buổi trình bày dài không quá ba mươi phút. Người trình bày kém làm mất cơ hội cho cả nhóm dù công việc phía sau tốt, và điều đau nhất là họ thường không bao giờ biết mình đã mất vì lý do gì.',
      interview:
        'Nhiều vòng phỏng vấn cuối yêu cầu trình bày một bài toán hoặc một kế hoạch một trăm ngày. Người đánh giá quan tâm cấu trúc suy nghĩ và khả năng xử lý câu hỏi cắt ngang hơn là độ hoàn thiện của slide. Chuẩn bị ba câu hỏi khó nhất và trả lời được chúng thường tạo khác biệt lớn hơn thêm mười slide.',
      study:
        'Bảo vệ đồ án hay báo cáo môn học là bài kiểm tra khả năng nén: bạn có mười lăm phút cho công việc của cả học kỳ. Kỹ năng chọn cái gì bỏ đi quan trọng hơn kỹ năng nói, và nó luyện được bằng cách viết thông điệp chính ra một câu trước khi làm slide.',
      life: 'Trình bày trước ban quản trị chung cư, họp phụ huynh, hay thuyết phục một nhóm bạn cùng góp vốn đều dùng chung một bộ kỹ năng: biết người nghe cần quyết gì, nói ngắn, và trả lời câu hỏi khó mà không mất bình tĩnh.',
    },
    framework: [
      {
        name: 'Chốt quyết định và người quyết',
        detail:
          'Trước khi mở phần mềm làm slide, viết ra tên người sẽ quyết và câu hỏi họ phải trả lời sau buổi này. Nếu trong phòng có nhiều người nhưng chỉ một người ký, phần lớn nội dung phải nhắm vào mối bận tâm của người đó, còn những người khác được xử lý ở phần hỏi đáp.',
      },
      {
        name: 'Viết thông điệp chính một câu',
        detail:
          'Một câu duy nhất mà nếu người nghe chỉ nhớ được chừng đó thì bạn vẫn đạt mục tiêu. Ba luận điểm sau đó tồn tại chỉ để chống đỡ câu này; bất cứ slide nào không chống đỡ nó thì bỏ hoặc chuyển sang phụ lục.',
      },
      {
        name: 'Dựng xương ba phần',
        detail:
          'Mở đầu nêu tình huống và câu hỏi cần quyết trong chưa đầy hai phút, thân bài là ba luận điểm mỗi luận điểm có bằng chứng, kết thúc là đề xuất kèm cái giá và bước tiếp theo. Cấu trúc này chịu được việc bị cắt thời gian, vì bạn có thể bỏ bớt bằng chứng mà vẫn giữ nguyên khung.',
      },
      {
        name: 'Thiết kế slide cho mắt',
        detail:
          'Một ý một slide, tiêu đề slide viết thành câu khẳng định chứ không phải nhãn danh từ, và mọi biểu đồ chỉ có một thông điệp được làm nổi. Slide là công cụ hỗ trợ mắt người nghe, không phải bản ghi nhớ cho người nói; phần chữ chi tiết để trong tài liệu phát kèm.',
      },
      {
        name: 'Tập ba lượt khác nhau',
        detail:
          'Lượt một nói to một mình để phát hiện chỗ tắc, lượt hai bấm giờ và cắt cho vừa hai phần ba thời lượng được cấp, lượt ba trình bày cho một người ngoài mảng và nhờ họ hỏi. Tập trong đầu không có tác dụng vì nó bỏ qua đúng những chỗ bạn sẽ vấp.',
      },
      {
        name: 'Chuẩn bị hỏi đáp',
        detail:
          'Liệt kê năm câu hỏi khó nhất có thể bị hỏi, viết câu trả lời ngắn cho từng câu, và chuẩn bị sẵn một mẫu câu cho tình huống bạn không biết: nêu điều bạn biết chắc, nêu điều chưa có dữ liệu, và hẹn thời điểm cụ thể sẽ trả lời.',
      },
    ],
    scenario:
      'Một kỹ sư trưởng công trình phải trình bày phương án xử lý nền móng cho chủ đầu tư trong ba mươi phút. Bản đầu tiên có bốn mươi hai slide đầy bản vẽ và bảng tính, tới phút hai mươi mới nói tới chi phí và bị cắt ngang. Anh làm lại: xác định người quyết là chủ đầu tư và câu hỏi của họ là chọn phương án nào để không trễ tiến độ bàn giao. Thông điệp chính một câu là phương án cọc ép chậm hơn hai tuần nhưng giảm rủi ro lún không đều ở khu vực có nền yếu. Bài mới còn mười một slide, mỗi slide một ý, phần bản vẽ chi tiết chuyển vào tài liệu phát kèm. Anh chuẩn bị năm câu hỏi khó, trong đó có câu về chi phí phát sinh nếu gặp nước ngầm. Buổi trình bày kéo dài mười tám phút và quyết định được đưa ra ngay tại chỗ.',
    comparison: [
      {
        weak: 'Đặt tiêu đề slide là danh từ chung như Tổng quan, Hiện trạng, Giải pháp.',
        mature: 'Đặt tiêu đề là câu khẳng định mang thông điệp: "Nền yếu tập trung ở trục B, chiếm 40% diện tích móng".',
      },
      {
        weak: 'Chuẩn bị nội dung cho đủ thời lượng được cấp, rồi bị cắt và phải nói vội phần cuối.',
        mature: 'Chuẩn bị vừa hai phần ba thời lượng, để dành phần còn lại cho câu hỏi và cho tình huống bị cắt giờ.',
      },
      {
        weak: 'Trả lời câu hỏi không biết bằng cách nói vòng vo cho qua.',
        mature: 'Nói rõ phần biết chắc, phần chưa có dữ liệu, và cam kết một mốc cụ thể sẽ trả lời, rồi thực sự làm đúng mốc đó.',
      },
    ],
    mistakes: [
      'Dùng slide làm bản ghi nhớ cho chính mình, nhồi hết chữ cần nói lên màn hình, khiến người nghe đọc nhanh hơn bạn nói và không còn lý do gì để nghe bạn.',
      'Dành gần hết thời lượng cho phần mô tả quá trình đã làm rồi vội vàng nói đề xuất trong hai phút cuối, trong khi đề xuất mới là thứ duy nhất người quyết cần.',
      'Không tìm hiểu trước phòng họp và thiết bị, để rồi mất năm phút đầu loay hoay với dây kết nối hoặc phát hiện màu chữ nhạt không đọc được trên máy chiếu, mất luôn phần khán giả còn tỉnh táo nhất.',
    ],
    worksheet: [
      'Buổi trình bày sắp tới của bạn: ai là người thực sự ký quyết định, và câu hỏi họ cần trả lời là gì?',
      'Viết thông điệp chính thành đúng một câu dưới hai lăm chữ. Nếu người nghe chỉ nhớ câu này thì bạn có đạt mục tiêu không?',
      'Ba luận điểm chống đỡ thông điệp đó là gì, và mỗi luận điểm có bằng chứng nào?',
      'Liệt kê những slide hiện có không chống đỡ thông điệp chính. Bạn sẽ bỏ hay chuyển xuống phụ lục?',
      'Viết năm câu hỏi khó nhất có thể bị hỏi và câu trả lời ngắn cho từng câu.',
    ],
    exercises: [
      {
        label: 'Một câu thông điệp',
        text: 'Lấy ba bài trình bày cũ của bạn, viết cho mỗi bài một câu thông điệp chính. Nếu không viết được, ghi lại lý do — thường là do bài đó không có mục tiêu quyết định rõ ràng.',
        level: 'e',
      },
      {
        label: 'Đổi tiêu đề slide',
        text: 'Mở một bộ slide bất kỳ và viết lại toàn bộ tiêu đề thành câu khẳng định có thông điệp. Đọc riêng danh sách tiêu đề và kiểm xem chúng có kể thành một mạch hoàn chỉnh không.',
        level: 'e',
      },
      {
        label: 'Cắt còn một nửa',
        text: 'Lấy một bộ slide và cắt còn đúng một nửa số trang mà vẫn giữ nguyên khả năng ra quyết định của người nghe. Ghi lại loại slide bị cắt đầu tiên.',
        level: 'e',
      },
      {
        label: 'Tập có bấm giờ',
        text: 'Tập nói to bài của bạn ba lượt theo ba mức trong chương, ghi thời lượng từng lượt. Đánh dấu các đoạn thời lượng dao động nhiều nhất giữa các lượt, đó là chỗ bạn chưa nắm chắc.',
        level: 'm',
      },
      {
        label: 'Người ngoài hỏi',
        text: 'Trình bày cho một người không thuộc lĩnh vực và yêu cầu họ hỏi ít nhất năm câu. Ghi lại câu nào bạn không trả lời được và bổ sung vào phần chuẩn bị hỏi đáp.',
        level: 'm',
      },
      {
        label: 'Bản dự phòng ba phút',
        text: 'Chuẩn bị thêm một phiên bản ba phút của cùng bài, chỉ gồm thông điệp chính, một bằng chứng và đề xuất. Tập cho tới khi nói trôi mà không cần slide.',
        level: 'm',
      },
      {
        label: 'Trình bày thật và đo kết quả',
        text: 'Thực hiện một buổi trình bày thật theo đủ sáu bước. Đo bằng ba con số: thời gian thực tế, số quyết định được đưa ra tại chỗ, và số câu hỏi bạn đã chuẩn bị trước xuất hiện thật. Ghi lại phần nào cần sửa cho lần sau.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: dựng lại một bài từ đầu',
        text: 'Bảy ngày, mỗi ngày làm một bước: xác định người quyết, viết thông điệp một câu, dựng ba luận điểm, làm slide một ý một trang, tập lượt một, tập lượt hai có bấm giờ, tập lượt ba với người ngoài. Ghi nhật ký ngắn mỗi ngày về điều bạn phát hiện. Ngày cuối so bản đầu và bản cuối về số slide và thời lượng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên chuẩn bị nội dung ngắn hơn thời lượng được cấp?',
        a: 'Vì hầu như không buổi nào diễn ra đúng kế hoạch: người quyết tới muộn, thiết bị trục trặc, hoặc có câu hỏi cắt ngang ở giữa. Chuẩn bị vừa khít khiến bạn phải nói vội đúng phần đề xuất ở cuối, tức là phần quan trọng nhất. Chuẩn bị bằng khoảng hai phần ba thời lượng cho bạn khoảng đệm và biến phần hỏi đáp thành cơ hội thay vì mối đe doạ.',
      },
      {
        q: 'Khi bị hỏi một câu bạn không biết trả lời trước mặt nhiều người, nên xử lý thế nào?',
        a: 'Dùng cấu trúc ba phần: nêu điều bạn biết chắc và có dữ liệu, nói rõ phần bạn chưa có dữ liệu chứ không suy đoán, và cam kết một mốc cụ thể sẽ gửi câu trả lời. Sau đó phải thực sự gửi đúng hẹn, vì chính lần gửi đó mới xây được uy tín. Bịa một con số để lấp chỗ trống là rủi ro lớn nhất, bởi nó thường bị kiểm lại và làm mất giá trị mọi con số khác trong bài.',
      },
      {
        q: 'Slide và tài liệu phát kèm nên khác nhau thế nào?',
        a: 'Slide phục vụ người đang nghe bạn nói nên phải ít chữ, một ý một trang, biểu đồ chỉ nổi một thông điệp. Tài liệu phát kèm phục vụ người đọc một mình khi bạn không có mặt nên cần đầy đủ số liệu, giả định, phương pháp và phụ lục. Dùng chung một bộ cho cả hai mục đích luôn dẫn tới slide quá dày chữ và tài liệu thì thiếu ngữ cảnh.',
      },
    ],
    plan7:
      'Ngày 1: xác định người quyết và câu hỏi họ phải trả lời. Ngày 2: viết thông điệp chính một câu và ba luận điểm. Ngày 3: chọn bằng chứng cho từng luận điểm và loại bỏ phần thừa. Ngày 4: làm slide theo nguyên tắc một ý một trang, tiêu đề là câu khẳng định. Ngày 5: tập lượt một nói to và lượt hai có bấm giờ. Ngày 6: tập lượt ba với một người ngoài mảng và thu thập câu hỏi. Ngày 7: hoàn thiện phần hỏi đáp, chuẩn bị bản ba phút dự phòng và kiểm tra thiết bị tại phòng họp.',
    evidence:
      'Giữ lại bộ slide và tài liệu phát kèm của một buổi trình bày dẫn tới quyết định thật, kèm bằng chứng về quyết định đó như biên bản họp hay email phê duyệt. Nếu được phép, giữ thêm bản ghi hình để tự đánh giá và để nộp kèm hồ sơ cho các vị trí cần trình bày thường xuyên. Trong phỏng vấn, kể một buổi bạn bị cắt thời lượng hoặc bị hỏi một câu khó và cách bạn xử lý, vì đó là lúc kỹ năng lộ ra rõ nhất. Trong CV, viết thành kết quả chứ không phải hoạt động: "Trình bày phương án kỹ thuật cho chủ đầu tư, được duyệt ngay trong buổi, rút ngắn thời gian chờ quyết định từ 3 tuần xuống 1 buổi".',
    references: [
      { label: 'Duarte — phương pháp thiết kế bài trình bày', url: 'https://www.duarte.com/', type: 'article' },
      { label: 'TED', url: 'https://www.ted.com/', type: 'video' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 12 — Nói trước đám đông — Public Speaking
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Nói trước đám đông khác thuyết trình ở chỗ trọng tâm không nằm ở tài liệu mà nằm ở việc bạn giữ được năng lực suy nghĩ và điều khiển giọng nói trong khi hệ thần kinh đang phản ứng như trước một mối đe doạ. Hồi hộp không phải dấu hiệu bạn chưa sẵn sàng; nó là phản ứng sinh lý bình thường và nó không biến mất theo kinh nghiệm, chỉ trở nên dễ điều khiển hơn. Vì vậy mục tiêu luyện tập không phải hết run mà là vẫn nói được rõ ràng trong lúc run, thông qua chuẩn bị đủ sâu và một vài kỹ thuật cơ thể có thể thực hiện ngay tại chỗ.',
    why: {
      work: 'Cơ hội được nhìn thấy trong tổ chức thường đến từ những dịp phát biểu ngắn: giới thiệu kết quả nhóm trước toàn công ty, dẫn một buổi chia sẻ nội bộ, nói vài câu trong sự kiện khách hàng. Người từ chối những dịp này thường bị đánh giá thấp hơn năng lực thật của họ trong nhiều năm.',
      interview:
        'Một số vòng tuyển dụng có phần trình bày trước hội đồng đông người hoặc thuyết trình trước lớp trong các chương trình quản trị viên tập sự. Ứng viên biết cách xử lý khoảnh khắc mất trí nhớ giữa chừng, dừng lại, hít thở và quay lại đúng mạch, gây ấn tượng mạnh hơn người nói trôi chảy mà nhạt.',
      study:
        'Bảo vệ luận văn hay tham gia thi hùng biện là nơi phần lớn sinh viên gặp nỗi sợ này lần đầu ở mức nghiêm túc. Chuẩn bị một mở đầu thuộc lòng và một kịch bản phục hồi khi vấp là hai thứ giá trị nhất, vì hầu hết sự cố xảy ra trong hai phút đầu.',
      life: 'Phát biểu trong đám cưới, họp tổ dân phố, hay đại diện gia đình nói vài lời trong dịp trang trọng đều là những tình huống mà việc chuẩn bị ba mươi phút tạo ra khác biệt lớn về mức thoải mái của chính bạn.',
    },
    framework: [
      {
        name: 'Hạ kỳ vọng về sự hoàn hảo',
        detail:
          'Đổi mục tiêu từ nói thật hay sang truyền được đúng một điều cho người nghe. Kỳ vọng hoàn hảo làm tăng mức cảnh giác và chính nó gây ra hiện tượng quên bài; mục tiêu hẹp và cụ thể thì dễ đạt và làm giảm áp lực ngay từ khâu chuẩn bị.',
      },
      {
        name: 'Thuộc lòng hai phút đầu',
        detail:
          'Chỉ học thuộc phần mở đầu, không học thuộc cả bài. Hai phút đầu là lúc mức căng cao nhất và cũng là lúc người nghe hình thành ấn tượng; vượt qua được đoạn này thì nhịp thở ổn lại và phần sau có thể nói theo ý.',
      },
      {
        name: 'Dùng cơ thể trước khi dùng ý chí',
        detail:
          'Ngay trước khi lên, thở ra dài hơn thở vào trong khoảng một phút, thả lỏng vai và hàm, và đi lại một chút nếu có thể. Đây là những can thiệp tác động lên phản ứng sinh lý, hiệu quả hơn nhiều so với việc tự nhủ đừng lo lắng.',
      },
      {
        name: 'Neo vào người nghe cụ thể',
        detail:
          'Chọn trước ba người ở ba vị trí khác nhau trong phòng và luân phiên nói với từng người trong vài giây. Kỹ thuật này biến một đám đông trừu tượng thành ba cuộc trò chuyện, đồng thời làm ánh mắt bạn phân bố tự nhiên khắp phòng.',
      },
      {
        name: 'Có kịch bản phục hồi',
        detail:
          'Chuẩn bị trước điều sẽ làm khi quên bài: dừng lại, uống một ngụm nước, nhìn vào ghi chú, và nói một câu chuyển tiếp đã soạn sẵn như "phần quan trọng nhất tôi muốn nhấn ở đây là". Có kịch bản khiến sự cố trở thành một khoảng dừng bình thường thay vì một cú sụp.',
      },
      {
        name: 'Rút kinh nghiệm ngay sau đó',
        detail:
          'Trong vòng một giờ sau khi nói, viết ba dòng: điều đã chạy tốt, điều cần sửa, và một việc cụ thể cho lần sau. Trí nhớ về cảm giác phai rất nhanh, và không ghi lại thì mỗi lần nói đều bắt đầu lại từ con số không.',
      },
    ],
    scenario:
      'Một nhân viên phân tích dữ liệu hai năm kinh nghiệm được đề cử trình bày mười phút tại hội thảo ngành, khoảng hai trăm người dự. Lần đầu tập thử với đồng nghiệp, cô mất mạch ở phút thứ hai và phải mở lại ghi chú. Cô chuẩn bị lại theo ba hướng: học thuộc đúng hai phút mở đầu, in một tờ giấy chỉ có sáu từ khoá thay vì toàn văn, và soạn sẵn một câu chuyển tiếp để dùng khi quên. Cô cũng tới sớm ba mươi phút để đứng thử trên sân khấu và chọn trước ba điểm neo trong khán phòng. Trong buổi thật, cô vẫn quên một đoạn ở phút thứ sáu, dừng khoảng bốn giây, dùng câu chuyển tiếp đã soạn và đi tiếp. Sau buổi, ba người tới hỏi thêm về phương pháp, và không ai nhắc tới khoảng dừng đó.',
    comparison: [
      {
        weak: 'Học thuộc toàn bộ bài nói theo từng câu chữ.',
        mature: 'Học thuộc phần mở đầu và phần kết, còn lại nhớ theo cấu trúc và từ khoá, để khi quên một câu thì vẫn còn mạch.',
      },
      {
        weak: 'Cố che giấu sự hồi hộp bằng cách nói nhanh hơn để mau kết thúc.',
        mature: 'Chủ động nói chậm lại và thêm khoảng lặng, vì tốc độ chậm vừa hạ nhịp tim vừa giúp người nghe theo kịp.',
      },
      {
        weak: 'Nhìn lướt qua đầu khán giả hoặc nhìn vào tường phía cuối phòng để tránh giao tiếp mắt.',
        mature: 'Neo vào ba người cụ thể ở ba vị trí và nói với từng người vài giây một, giữ cho ánh mắt phân bố tự nhiên.',
      },
      {
        weak: 'Sau buổi nói chỉ nhớ cảm giác chung là tệ hoặc ổn, không ghi lại gì.',
        mature: 'Viết ba dòng trong vòng một giờ và chọn đúng một việc cụ thể để làm khác đi ở lần sau.',
      },
    ],
    mistakes: [
      'Coi hồi hộp là bằng chứng mình không phù hợp với việc nói trước đám đông, rồi né mọi cơ hội, khiến kỹ năng không bao giờ được luyện và nỗi sợ ngày càng lớn theo thời gian.',
      'Chuẩn bị nội dung tới phút chót và bỏ hẳn phần tập nói to, trong khi chính việc nói to là thứ duy nhất phát hiện được các câu khó phát âm, các đoạn chuyển tiếp bị hụt và thời lượng thật.',
      'Xin lỗi khán giả ngay từ câu đầu vì mình nói không hay hoặc chuẩn bị chưa kỹ, làm người nghe chuyển sang chú ý vào lỗi của bạn thay vào nội dung, và tự đặt mình vào thế yếu suốt phần còn lại.',
    ],
    worksheet: [
      'Lần gần nhất bạn nói trước nhiều người, mức căng thẳng của bạn cao nhất ở phút thứ mấy? Điều gì đã xảy ra ngay trước đó?',
      'Nếu người nghe chỉ nhớ được một điều duy nhất từ bài nói sắp tới, bạn muốn đó là điều gì?',
      'Viết ra hai phút mở đầu của bạn thành văn bản đầy đủ và đọc to ba lần, ghi lại thời lượng.',
      'Câu chuyển tiếp bạn sẽ dùng khi quên bài là gì? Viết ra và học thuộc đúng câu đó.',
      'Ba người hoặc ba vị trí trong phòng bạn sẽ neo ánh mắt vào là ở đâu? Nếu chưa biết phòng, bạn sẽ tới trước bao lâu để xem?',
    ],
    exercises: [
      {
        label: 'Nói to một mình',
        text: 'Chọn một chủ đề bạn thạo và nói to trong ba phút, không có người nghe, ghi âm lại. Nghe lại và đánh dấu các chỗ bạn hụt hơi hoặc lặp từ.',
        level: 'e',
      },
      {
        label: 'Thở ra dài',
        text: 'Tập kiểu thở có thời gian thở ra dài hơn thở vào trong một phút, làm hai lần mỗi ngày trong một tuần và một lần ngay trước bất kỳ tình huống căng thẳng nào. Ghi lại mức căng theo thang mười điểm trước và sau.',
        level: 'e',
      },
      {
        label: 'Sáu từ khoá',
        text: 'Chuyển một bài nói từ bản toàn văn sang tờ ghi chú chỉ có sáu từ khoá. Tập nói với tờ đó ba lần và ghi lại lần nào bạn còn phải liếc nhiều nhất.',
        level: 'e',
      },
      {
        label: 'Nói trước nhóm nhỏ',
        text: 'Xin năm phút trong một cuộc họp nội bộ để trình bày một chủ đề. Sau đó xin phản hồi từ hai người theo ba câu hỏi cố định: điều rõ nhất, điều khó theo dõi nhất, và một việc nên sửa.',
        level: 'm',
      },
      {
        label: 'Tập tình huống hỏng',
        text: 'Nhờ một đồng nghiệp cắt ngang bạn giữa bài, hoặc tự tắt slide đột ngột trong lúc tập. Luyện dùng kịch bản phục hồi cho tới khi khoảng dừng của bạn dưới năm giây.',
        level: 'm',
      },
      {
        label: 'Xem lại bản ghi hình',
        text: 'Quay lại một bài nói dài năm phút, xem hai lượt: lượt một tắt tiếng để quan sát tư thế, lượt hai chỉ nghe tiếng để đánh giá nhịp và khoảng lặng. Viết một việc cần sửa cho mỗi lượt.',
        level: 'm',
      },
      {
        label: 'Nói trước đám đông thật',
        text: 'Đăng ký nói ít nhất mười phút trong một sự kiện có khán giả ngoài công ty bạn, ví dụ buổi chia sẻ cộng đồng nghề nghiệp. Chuẩn bị theo đủ sáu bước và viết bản rút kinh nghiệm trong vòng một giờ sau khi kết thúc.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: tăng dần số người nghe',
        text: 'Bảy ngày, mỗi ngày nói to trước ít nhất một người trong ba phút về một chủ đề khác nhau, tăng dần số người nghe từ một lên năm. Mỗi ngày ghi mức căng theo thang mười điểm và một điều bạn làm khác so với hôm trước. Cuối tuần nhìn đường đi của con số đó và ghi lại kỹ thuật nào giúp nhiều nhất.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao học thuộc toàn bộ bài nói lại làm tăng rủi ro thay vì giảm?',
        a: 'Vì trí nhớ theo chuỗi câu chữ rất dễ đứt: chỉ cần quên một câu là mất luôn manh mối cho câu tiếp theo, và người nói rơi vào khoảng trống hoàn toàn. Nhớ theo cấu trúc và từ khoá thì mỗi ý là một điểm neo độc lập, quên một ý vẫn đi tiếp được ý sau. Ngoại lệ hợp lý là phần mở đầu và phần kết, nên thuộc kỹ vì đó là hai đoạn quyết định ấn tượng và cũng là hai đoạn dễ hoảng nhất.',
      },
      {
        q: 'Hồi hộp trước khi nói có nên bị coi là vấn đề cần loại bỏ hoàn toàn không?',
        a: 'Không. Đó là phản ứng sinh lý bình thường trước tình huống được đánh giá, và ở mức vừa phải nó làm tăng sự tỉnh táo. Mục tiêu thực tế là điều chỉnh mức, không phải triệt tiêu, bằng chuẩn bị kỹ, tập nói to và các kỹ thuật thở. Tuy nhiên nếu nỗi sợ ở mức khiến bạn né tránh cả những tình huống thiết yếu trong công việc và đời sống, hoặc kèm triệu chứng cơ thể nặng kéo dài, thì đó là lúc nên tìm tới chuyên gia tâm lý có chuyên môn thay vì tự luyện.',
      },
      {
        q: 'Khi quên bài giữa chừng, vì sao khoảng dừng lại ít gây hại hơn ta tưởng?',
        a: 'Vì người nghe không có bản gốc để đối chiếu nên họ không biết bạn bỏ sót gì; thứ họ cảm nhận được chỉ là thái độ của bạn trong khoảng dừng đó. Một khoảng dừng vài giây kèm động tác bình thường như uống nước được đọc là nhịp nghỉ, còn hoảng loạn và xin lỗi liên tục mới là thứ khiến họ nhận ra có sự cố. Vì vậy giá trị của kịch bản phục hồi nằm ở chỗ nó giữ cho thái độ của bạn không đổi.',
      },
    ],
    plan7:
      'Ngày 1: chọn chủ đề và viết ra một điều duy nhất bạn muốn người nghe nhớ. Ngày 2: viết và học thuộc hai phút mở đầu. Ngày 3: rút bài xuống tờ ghi chú sáu từ khoá và tập nói to có ghi âm. Ngày 4: luyện thở ra dài và tập nói trong trạng thái vừa vận động nhẹ để quen với nhịp tim cao. Ngày 5: nói cho một người nghe và xin phản hồi theo ba câu hỏi cố định. Ngày 6: tập tình huống hỏng và luyện kịch bản phục hồi. Ngày 7: nói trước nhóm từ ba tới năm người, quay hình, và viết bản rút kinh nghiệm ba dòng trong vòng một giờ.',
    evidence:
      'Bằng chứng cụ thể nhất là danh sách các lần bạn đã nói trước công chúng kèm bối cảnh và quy mô: buổi chia sẻ nội bộ, hội thảo ngành, buổi đào tạo cho khách hàng, kèm liên kết tới bản ghi hình nếu có. Một trang hồ sơ nghề nghiệp liệt kê ba tới năm lần như vậy có sức nặng hơn hẳn dòng mô tả tự nhận về sự tự tin. Với các vị trí đào tạo, tư vấn, kinh doanh và quản lý, hãy chuẩn bị sẵn một đoạn ghi hình dài dưới năm phút. Trong phỏng vấn, kể một lần bạn gặp sự cố khi nói và cách bạn xử lý tại chỗ, vì câu chuyện đó chứng minh khả năng giữ bình tĩnh, thứ nhà tuyển dụng thực sự quan tâm.',
    references: [
      { label: 'Toastmasters International', url: 'https://www.toastmasters.org/', type: 'article' },
      { label: 'Toastmasters — mẹo nói trước công chúng', url: 'https://www.toastmasters.org/resources/public-speaking-tips', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 13 — Giải thích vấn đề kỹ thuật cho người không chuyên
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Trở ngại chính khi giải thích chuyên môn cho người ngoài ngành không phải là người nghe kém mà là lời nguyền tri thức: khi đã hiểu một thứ, bạn không còn dựng lại được trạng thái chưa hiểu, nên bạn vô thức bỏ qua đúng những bước mà người nghe cần. Giải thích tốt vì thế bắt đầu bằng việc đo mức nền của người nghe chứ không bằng việc đơn giản hoá ngôn từ. Nguyên tắc dẫn đường là mọi khái niệm chuyên môn phải được dịch thành một hệ quả mà người nghe đo được trong công việc hoặc trong đời sống của chính họ.',
    why: {
      work: 'Ngân sách cho hạ tầng, bảo mật, thiết bị hay bảo trì thường bị cắt không phải vì không cần thiết mà vì người quyết không hiểu điều gì sẽ xảy ra nếu không chi. Người dịch được rủi ro kỹ thuật thành hệ quả kinh doanh là người giữ được nguồn lực cho nhóm mình.',
      interview:
        'Nhiều buổi phỏng vấn có phần yêu cầu bạn giải thích một khái niệm chuyên môn cho người không cùng mảng, đặc biệt khi vòng cuối có sự tham gia của lãnh đạo ngoài chuyên môn. Người dùng phép so sánh chính xác và kiểm lại xem người nghe có theo kịp không luôn được đánh giá cao hơn người trình bày đúng nhưng dày đặc thuật ngữ.',
      study:
        'Cách kiểm tra hiểu bài nghiêm khắc nhất là giải thích cho một người chưa học môn đó mà không dùng thuật ngữ của môn. Mọi chỗ bạn buộc phải mượn thuật ngữ để lấp là chỗ bạn mới thuộc định nghĩa chứ chưa nắm cơ chế.',
      life: 'Khi cần giải thích cho người thân về một quy trình hành chính, một hợp đồng dịch vụ hay cách dùng một thiết bị mới, cùng bộ kỹ năng này quyết định họ tự làm được hay phải gọi bạn mỗi lần. Với các vấn đề y tế, pháp lý hoặc tài chính có rủi ro cao, việc giải thích chỉ nên dừng ở mức giúp người thân hiểu để đặt câu hỏi đúng cho chuyên gia, không thay thế tư vấn chuyên môn.',
    },
    framework: [
      {
        name: 'Đo mức nền bằng một câu hỏi',
        detail:
          'Trước khi giải thích, hỏi một câu để biết họ đang đứng ở đâu: "Anh chị đã từng dùng qua thứ gì tương tự chưa" hoặc "Chị hình dung hiện tại nó đang hoạt động thế nào". Câu trả lời cho bạn điểm xuất phát và cả những hiểu nhầm cần gỡ trước.',
      },
      {
        name: 'Nói hệ quả trước cơ chế',
        detail:
          'Bắt đầu bằng điều sẽ xảy ra với họ, rồi mới tới cách nó hoạt động, và chỉ đi sâu nếu họ muốn. Người ngoài ngành cần biết mình phải quyết gì trước khi có động lực nghe phần kỹ thuật.',
      },
      {
        name: 'Dùng phép so sánh có ghi giới hạn',
        detail:
          'Chọn một hình ảnh từ đời sống của chính người nghe và nói luôn chỗ hình ảnh đó không còn đúng: "Giống như kho hàng có hai lối vào, nhưng khác ở chỗ đây thì hàng có thể ở cả hai kho cùng lúc". Phép so sánh không ghi giới hạn thường tạo ra hiểu nhầm mới còn khó gỡ hơn.',
      },
      {
        name: 'Giữ một thuật ngữ, bỏ phần còn lại',
        detail:
          'Mỗi lần giải thích chỉ giới thiệu tối đa một thuật ngữ mới, giải thích kỹ và dùng nó nhất quán. Nhồi năm thuật ngữ trong mười phút khiến người nghe mất mạch ở thuật ngữ thứ hai và những phần sau đều trôi qua vô ích.',
      },
      {
        name: 'Kiểm bằng cách nhờ họ giải thích lại',
        detail:
          'Nhờ người nghe nói lại bằng lời của họ, đóng khung để không ai mất mặt: "Để em chắc là em nói đủ, anh diễn đạt lại giúp em phần này với". Chính bản diễn đạt lại đó chỉ ra chỗ bạn giải thích hỏng, và nó rẻ hơn nhiều so với việc phát hiện qua một quyết định sai.',
      },
      {
        name: 'Để lại lối vào sâu hơn',
        detail:
          'Kết thúc bằng một tài liệu ngắn hoặc một sơ đồ một trang cho người muốn tìm hiểu thêm, và nói rõ họ có thể hỏi lại lúc nào. Điều này giữ cho việc giải thích không phải là màn trình diễn một lần mà là một quan hệ làm việc lâu dài.',
      },
    ],
    scenario:
      'Một chuyên viên công nghệ thông tin cần xin ngân sách sao lưu dữ liệu cho công ty sản xuất. Bản đề xuất đầu tiên nói về chu kỳ sao lưu, mức độ nén và thời gian khôi phục, và bị gạt với lý do chưa cấp thiết. Lần thứ hai anh bắt đầu bằng một câu hỏi cho giám đốc tài chính: nếu sáng mai toàn bộ dữ liệu công nợ và đơn hàng biến mất thì bộ phận kế toán mất bao lâu để dựng lại từ chứng từ giấy. Câu trả lời là khoảng ba tuần. Anh dịch tiếp thành hệ quả: ba tuần đó tương đương bao nhiêu ngày không xuất được hoá đơn và bao nhiêu đơn hàng chậm giao. Chỉ sau đó anh mới nói về giải pháp, giữ đúng một thuật ngữ là thời gian khôi phục mục tiêu, và dùng phép so sánh với việc giữ bản sao sổ sách ở một kho khác kèm ghi rõ chỗ phép so sánh không còn đúng. Ngân sách được duyệt trong kỳ đó.',
    comparison: [
      {
        weak: 'Mở đầu bằng cách mô tả kiến trúc và các thành phần kỹ thuật của giải pháp.',
        mature: 'Mở đầu bằng điều người nghe sẽ mất hoặc được, quy về thời gian, tiền hoặc rủi ro mà họ chịu trách nhiệm.',
      },
      {
        weak: 'Trả lời "cái này phức tạp lắm, giải thích cũng khó hiểu" khi bị hỏi.',
        mature: 'Chọn một mức giải thích phù hợp với quyết định họ cần ra, và nói rõ phần chi tiết hơn có ở đâu nếu họ muốn đọc.',
      },
      {
        weak: 'Dùng phép so sánh hấp dẫn nhưng không nói chỗ nó sai, ví dụ ví dữ liệu như nước chảy trong ống.',
        mature: 'Dùng phép so sánh kèm một câu chỉ rõ ranh giới, để người nghe không suy diễn tiếp vào vùng hình ảnh đó không còn đúng.',
      },
    ],
    mistakes: [
      'Đơn giản hoá tới mức làm sai bản chất, ví dụ nói một hệ thống là an toàn tuyệt đối cho dễ hiểu, rồi phải giải thích lại từ đầu khi có sự cố và mất luôn niềm tin đã xây được.',
      'Nhầm việc bỏ thuật ngữ với việc nói trịch thượng: dùng giọng dạy dỗ, gọi mọi thứ là đơn giản thôi mà, khiến người nghe ngại hỏi lại và giả vờ đã hiểu.',
      'Giải thích cùng một cách cho mọi đối tượng, không phân biệt người cần ra quyết định chi tiền với người sẽ trực tiếp thao tác hằng ngày, dù hai nhóm cần hai loại thông tin hoàn toàn khác nhau.',
    ],
    worksheet: [
      'Chọn một khái niệm chuyên môn bạn hay phải giải thích. Người nghe điển hình của bạn đã biết sẵn điều gì về nó?',
      'Hệ quả của khái niệm đó với công việc của họ là gì? Viết bằng thời gian, tiền, hoặc rủi ro mà họ chịu trách nhiệm.',
      'Viết một phép so sánh từ đời sống của họ, kèm một câu chỉ rõ chỗ phép so sánh không còn đúng.',
      'Nếu chỉ được giữ đúng một thuật ngữ, bạn giữ từ nào và bỏ những từ nào?',
      'Bạn sẽ nhờ họ diễn đạt lại bằng câu nào để không ai thấy bị kiểm tra?',
    ],
    exercises: [
      {
        label: 'Giải thích không thuật ngữ',
        text: 'Chọn một khái niệm trong nghề bạn và viết một đoạn giải thích một trăm năm mươi chữ không dùng bất kỳ thuật ngữ chuyên ngành nào. Đọc cho một người ngoài ngành và ghi lại chỗ họ hỏi lại.',
        level: 'e',
      },
      {
        label: 'Dịch sang hệ quả',
        text: 'Lấy năm câu mô tả kỹ thuật bạn hay dùng, viết lại mỗi câu thành một hệ quả đo được với người nghe, ví dụ số giờ dừng việc hoặc số đơn hàng bị ảnh hưởng.',
        level: 'e',
      },
      {
        label: 'Phép so sánh có ranh giới',
        text: 'Viết ba phép so sánh cho ba khái niệm khác nhau, mỗi cái kèm một câu chỉ rõ chỗ nó không còn đúng. Thử với hai người và ghi lại phép nào gây hiểu nhầm.',
        level: 'e',
      },
      {
        label: 'Đo mức nền trước',
        text: 'Trong một tuần, mỗi lần giải thích điều gì cho người ngoài mảng, bắt đầu bằng một câu hỏi đo mức nền. Ghi lại số lần câu trả lời của họ làm bạn phải đổi hẳn cách giải thích.',
        level: 'm',
      },
      {
        label: 'Sơ đồ một trang',
        text: 'Vẽ một sơ đồ một trang cho quy trình kỹ thuật mà bộ phận khác hay hỏi bạn. Đưa cho ba người dùng thử và sửa lại theo chỗ họ chỉ vào và hỏi.',
        level: 'm',
      },
      {
        label: 'Hai phiên bản hai đối tượng',
        text: 'Soạn hai bản giải thích cho cùng một vấn đề: một cho người quyết ngân sách, một cho người thao tác hằng ngày. So sánh xem hai bản khác nhau ở những phần nào và vì sao.',
        level: 'm',
      },
      {
        label: 'Trình bày xin nguồn lực',
        text: 'Chuẩn bị và thực hiện một buổi trình bày thật để xin ngân sách hoặc nhân lực cho một việc chuyên môn. Bắt buộc mở đầu bằng hệ quả với người nghe, giữ tối đa một thuật ngữ mới, và kết bằng lời nhờ diễn đạt lại. Ghi lại kết quả và phản hồi.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: một buổi dạy lại mỗi ngày',
        text: 'Bảy ngày, mỗi ngày giải thích một khái niệm nghề nghiệp cho một người khác nhau ngoài chuyên môn của bạn, trong dưới năm phút, và kết thúc bằng việc nhờ họ nói lại. Ghi lại chỗ họ hiểu sai. Cuối tuần gom các chỗ hiểu sai và tìm xem chúng có chung một nguyên nhân nào không, thường là một giả định bạn luôn bỏ qua.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao nên nói hệ quả trước rồi mới nói cơ chế?',
        a: 'Vì người ngoài ngành không có khung sẵn để cất giữ thông tin kỹ thuật, nên nghe cơ chế trước là nghe một chuỗi chi tiết rời rạc và họ sẽ quên gần hết. Hệ quả tạo ra lý do để nghe và tạo ra cái khung: khi đã biết mình có thể mất ba tuần công việc, mọi chi tiết kỹ thuật sau đó được xếp vào câu hỏi làm sao tránh ba tuần đó. Ngoài ra, hệ quả là thứ họ có thẩm quyền quyết, còn cơ chế thì không.',
      },
      {
        q: 'Một phép so sánh tốt cần thoả điều kiện gì?',
        a: 'Ba điều kiện: lấy từ trải nghiệm mà người nghe thực sự có, đúng ở phần cơ chế bạn đang muốn truyền, và được kèm một câu nói rõ chỗ nó không còn đúng. Điều kiện thứ ba hay bị bỏ và chính là nguồn gốc của những hiểu nhầm dai dẳng, vì người nghe sẽ tiếp tục suy diễn theo hình ảnh đó ở những tình huống bạn chưa nghĩ tới.',
      },
      {
        q: 'Làm sao biết người nghe đã thật sự hiểu chứ không chỉ gật đầu cho xong?',
        a: 'Chỉ có một cách đáng tin là nhờ họ diễn đạt lại bằng lời của họ, hoặc tốt hơn là nhờ họ áp dụng vào một trường hợp mới mà bạn vừa đặt ra. Gật đầu, nói hiểu rồi, hay không có câu hỏi nào đều không phải bằng chứng, vì người ta thường ngại thừa nhận chưa hiểu trước mặt người khác. Cách hỏi nên đóng khung sao cho trách nhiệm thuộc về người giải thích chứ không phải người nghe.',
      },
    ],
    plan7:
      'Ngày 1: chọn ba khái niệm bạn hay phải giải thích và viết mức nền điển hình của người nghe. Ngày 2: dịch từng khái niệm thành hệ quả đo được. Ngày 3: viết phép so sánh kèm ranh giới cho từng cái. Ngày 4: cắt xuống còn tối đa một thuật ngữ mới cho mỗi bản giải thích. Ngày 5: thử với hai người ngoài ngành và ghi chỗ họ hỏi lại. Ngày 6: vẽ một sơ đồ một trang cho khái niệm khó nhất. Ngày 7: dùng bản đã sửa trong một tình huống thật và nhờ người nghe diễn đạt lại.',
    evidence:
      'Hiện vật rõ nhất là tài liệu hoặc sơ đồ một trang do bạn viết để giải thích một vấn đề chuyên môn cho người ngoài ngành, kèm bằng chứng nó được dùng thật, ví dụ nó trở thành tài liệu hướng dẫn chung của công ty hoặc được dùng trong buổi duyệt ngân sách. Với các vị trí kỹ thuật muốn tiến lên vai trò dẫn dắt, đây là bằng chứng phân biệt rõ nhất so với các ứng viên cùng trình độ chuyên môn. Trong phỏng vấn, hãy chuẩn bị sẵn khả năng giải thích một dự án của bạn ở hai mức khác nhau và hỏi người phỏng vấn muốn nghe mức nào. Trong CV, viết dạng: "Viết tài liệu giải thích rủi ro mất dữ liệu cho ban điều hành, dẫn tới phê duyệt ngân sách sao lưu và giảm thời gian khôi phục dự kiến từ 3 tuần xuống dưới 1 ngày".',
    references: [
      { label: 'Nielsen Norman Group', url: 'https://www.nngroup.com/', type: 'article' },
      { label: 'PlainLanguage.gov', url: 'https://www.plainlanguage.gov/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 14 — Giao tiếp giữa các nền văn hóa
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Giao tiếp liên văn hoá không phải là học thuộc danh sách phong tục của từng nước, mà là nhận ra rằng những quy ước bạn coi là lẽ thường — mức trực tiếp khi phản hồi, cách thể hiện sự đồng ý, ai được phép nói trước, thế nào là đúng giờ — đều là lựa chọn của một nền văn hoá chứ không phải chuẩn phổ quát. Các khung phân tích như Culture Map của Erin Meyer hay các chiều văn hoá của Geert Hofstede hữu ích ở chỗ chúng cho bạn từ vựng để nói về khác biệt, nhưng chúng mô tả xu hướng trung bình của nhóm và không dự đoán được cá nhân trước mặt bạn. Kỹ năng thật nằm ở việc dùng khung để đặt giả thuyết, rồi thay giả thuyết bằng quy ước làm việc được thoả thuận rõ ràng trong nhóm.',
    why: {
      work: 'Rất nhiều đội ngũ Việt Nam làm việc với khách hàng và đối tác ở nhiều nước khác nhau. Phần lớn trục trặc không đến từ ngoại ngữ mà đến từ quy ước: một bên coi im lặng là đã đồng ý, bên kia coi im lặng là chưa hiểu; một bên viết phản hồi thẳng, bên kia đọc ra sự khó chịu không hề có.',
      interview:
        'Khi phỏng vấn với công ty đa quốc gia hoặc vị trí làm việc với thị trường nước ngoài, câu hỏi về làm việc với người khác văn hoá là câu thường gặp. Câu trả lời mạnh không phải là liệt kê phong tục mà là mô tả một lần bạn hiểu nhầm, phát hiện ra quy ước khác nhau, và thiết lập một thoả thuận cụ thể để tránh lặp lại.',
      study:
        'Trong lớp học quốc tế hoặc chương trình liên kết, sinh viên Việt Nam thường bị đánh giá là ít tham gia thảo luận trong khi thực chất họ đang chờ tới lượt theo thói quen. Nhận ra quy ước phát biểu khác nhau và chủ động thích nghi là điều có thể học trong vài buổi.',
      life: 'Khi đi làm ở nước ngoài, khi có đồng nghiệp hoặc hàng xóm là người nước khác, hoặc thậm chí giữa các vùng miền trong nước, nhiều mâu thuẫn xuất phát từ cách hiểu khác nhau về sự riêng tư, về việc hỏi thăm chuyện cá nhân, hoặc về mức độ thẳng thắn được coi là lịch sự.',
    },
    framework: [
      {
        name: 'Nhận diện quy ước của chính mình',
        detail:
          'Viết ra những điều bạn mặc định là hiển nhiên: gửi tin nhắn công việc lúc mấy giờ là bình thường, phản hồi thế nào là thẳng quá, im lặng trong họp nghĩa là gì. Bạn không thể nhận ra khác biệt nếu chưa biết đường nền của mình nằm ở đâu.',
      },
      {
        name: 'Dùng khung để đặt giả thuyết, không để dán nhãn',
        detail:
          'Các trục thường gặp gồm mức trực tiếp khi phê bình, mức phụ thuộc vào ngữ cảnh khi truyền tin, khoảng cách quyền lực, và cách nhìn về thời hạn. Dùng chúng để hình thành câu hỏi cần kiểm, không để kết luận rằng người này chắc chắn thế này vì họ đến từ nước kia.',
      },
      {
        name: 'Kiểm bằng quan sát cá nhân',
        detail:
          'Quan sát chính người bạn đang làm việc cùng trong vài lần trao đổi: họ phản hồi thẳng hay gián tiếp, họ có nói ra khi không đồng ý không, họ trả lời nhanh hay cần thời gian. Cá nhân trong cùng một nước khác nhau rất nhiều, và dữ liệu về đúng người trước mặt luôn thắng dữ liệu trung bình.',
      },
      {
        name: 'Thoả thuận quy ước chung của nhóm',
        detail:
          'Thay vì mong mọi người tự đoán, viết ra quy ước làm việc chung: phản hồi tiêu cực sẽ được nói trực tiếp trong họp một một, im lặng không được tính là đồng ý, mọi quyết định phải được ghi lại bằng văn bản. Quy ước rõ ràng làm giảm hẳn số hiểu nhầm mà không cần ai phải bỏ bản sắc của mình.',
      },
      {
        name: 'Xây thói quen kiểm chứng lại',
        detail:
          'Trong môi trường đa văn hoá, tăng tần suất tóm tắt lại và hỏi lại so với mức bạn quen. Một câu như "để chắc là mình hiểu giống nhau, mình tóm tắt lại nhé" tốn mười giây và bù được phần lớn khác biệt về quy ước ngầm.',
      },
    ],
    scenario:
      'Một nhóm phát triển ở Việt Nam làm việc cho khách hàng Nhật Bản và một khách hàng Mỹ. Với khách Nhật, nhóm nhiều lần nhận câu trả lời rằng phương án này cũng thú vị và hiểu là đã được duyệt, tới khi bàn giao mới biết đó là cách nói giảm cho việc chưa đồng ý. Với khách Mỹ, nhóm nhận bản đánh giá viết thẳng những chỗ chưa đạt và một số thành viên đọc ra sự phủ nhận toàn bộ công sức, dẫn tới mất tinh thần trong hai tuần. Trưởng nhóm xử lý bằng cách đặt ba quy ước: mọi kết luận trong cuộc họp phải được ghi thành biên bản và xin xác nhận bằng văn bản trong hai mươi bốn giờ; mọi phản hồi đều nêu rõ mức là bắt buộc sửa, nên cân nhắc, hay chỉ là ý kiến; và trước mỗi mốc bàn giao có một câu hỏi bắt buộc là còn điều gì chưa yên tâm không. Sau hai tháng, số việc phải làm lại sát ngày bàn giao giảm rõ, và các thành viên đọc phản hồi thẳng của khách Mỹ với ít căng thẳng hơn vì đã có nhãn mức độ.',
    comparison: [
      {
        weak: 'Coi cách giao tiếp của nền văn hoá mình là chuẩn và cách của người khác là lệch chuẩn cần thích nghi.',
        mature: 'Coi cả hai đều là quy ước, và xác định điểm gặp nhau bằng thoả thuận cụ thể cho nhóm làm việc chung.',
      },
      {
        weak: 'Học một danh sách phong tục rồi áp dụng cứng cho mọi người đến từ nước đó.',
        mature: 'Dùng hiểu biết chung làm giả thuyết ban đầu, rồi điều chỉnh nhanh dựa trên quan sát chính người đang làm việc cùng.',
      },
      {
        weak: 'Hiểu im lặng hoặc câu trả lời lấp lửng là đồng ý và ghi vào biên bản như một quyết định.',
        mature: 'Đặt luật rằng đồng ý phải được nói hoặc viết ra rõ ràng, và chủ động hỏi từng người khi cần quyết định quan trọng.',
      },
    ],
    mistakes: [
      'Dùng các khung phân tích văn hoá như một cách phân loại con người, dẫn tới định kiến kiểu người nước này thì không dám nói thẳng, và bỏ qua toàn bộ khác biệt cá nhân vốn thường lớn hơn khác biệt trung bình giữa các nước.',
      'Cố bắt chước phong cách của phía đối tác tới mức gượng gạo, ví dụ đột ngột chuyển sang phê bình rất thẳng vì nghĩ họ thích thế, làm hỏng quan hệ với chính đồng nghiệp trong nhóm mình.',
      'Đổ mọi trục trặc cho khác biệt văn hoá, kể cả những vấn đề thực chất là do yêu cầu mơ hồ, thiếu người chịu trách nhiệm hoặc năng lực chuyên môn chưa đủ, khiến nguyên nhân thật không bao giờ được xử lý.',
    ],
    worksheet: [
      'Viết ba điều bạn mặc định là hiển nhiên trong giao tiếp công việc, ví dụ về giờ giấc nhắn tin hoặc cách từ chối.',
      'Với đối tác hoặc đồng nghiệp khác văn hoá gần nhất của bạn, ba quy ước nào của họ khác với ba điều trên?',
      'Lần gần nhất bạn hiểu nhầm ý một người khác văn hoá, tín hiệu nào bạn đã đọc sai?',
      'Nhóm bạn đang có quy ước chung nào được viết ra? Nếu chưa có, ba quy ước đầu tiên bạn sẽ đề xuất là gì?',
      'Câu hỏi kiểm chứng bạn sẽ dùng trước mỗi mốc quan trọng là gì? Viết nguyên văn câu đó.',
    ],
    exercises: [
      {
        label: 'Bản đồ quy ước của tôi',
        text: 'Viết một trang mô tả quy ước giao tiếp mặc định của bạn trên bốn trục: mức thẳng thắn khi phê bình, cách thể hiện không đồng ý, thái độ với hạn chót, và khoảng cách với cấp trên. Đọc lại và đánh dấu điều bạn tưởng là phổ quát.',
        level: 'e',
      },
      {
        label: 'Đọc lại một chuỗi thư',
        text: 'Lấy một chuỗi thư với đối tác nước ngoài, đọc lại và tìm những chỗ bạn đã suy diễn thái độ từ cách dùng từ. Ghi lại cách hiểu khác cũng khớp với đúng câu chữ đó.',
        level: 'e',
      },
      {
        label: 'Hỏi trực tiếp về quy ước',
        text: 'Hỏi một đồng nghiệp hoặc đối tác khác văn hoá ba câu về cách làm việc của họ: họ muốn nhận phản hồi tiêu cực thế nào, im lặng trong họp với họ nghĩa là gì, và họ mong được trả lời trong bao lâu. Ghi lại câu trả lời nguyên văn.',
        level: 'e',
      },
      {
        label: 'Nhãn mức độ phản hồi',
        text: 'Trong một tháng, gắn nhãn cho mọi phản hồi bạn đưa ra là bắt buộc sửa, nên cân nhắc, hay chỉ là ý kiến. Hỏi người nhận xem việc gắn nhãn có làm họ đọc khác đi không.',
        level: 'm',
      },
      {
        label: 'Biên bản xác nhận',
        text: 'Áp dụng luật ghi biên bản và xin xác nhận bằng văn bản trong hai mươi bốn giờ cho mọi cuộc họp có quyết định. Sau một tháng, đếm số lần biên bản bị đính chính, đó là số hiểu nhầm bạn đã chặn được.',
        level: 'm',
      },
      {
        label: 'Câu hỏi trước mốc bàn giao',
        text: 'Trước ba mốc bàn giao liên tiếp, hỏi từng bên liên quan một câu về điều họ còn chưa yên tâm, hỏi riêng chứ không hỏi chung trong họp. So sánh thông tin thu được giữa hai cách hỏi.',
        level: 'm',
      },
      {
        label: 'Viết bộ quy ước cho nhóm',
        text: 'Soạn một trang quy ước làm việc chung cho nhóm đa văn hoá của bạn, gồm cách phản hồi, cách xác nhận đồng ý, thời gian phản hồi kỳ vọng và cách xử lý bất đồng. Đưa cả nhóm góp ý, chốt lại và áp dụng thử ba tháng rồi rà lại.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: mỗi ngày một giả định được kiểm',
        text: 'Bảy ngày, mỗi ngày chọn một điều bạn đang giả định về cách làm việc của một người khác văn hoá và đi kiểm bằng cách hỏi thẳng hoặc quan sát có chủ đích. Ghi lại giả định nào đúng, giả định nào sai. Cuối tuần đếm tỷ lệ sai và ghi lại loại giả định nào bạn hay sai nhất, thường là loại liên quan tới cách người ta nói không.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao các khung phân tích văn hoá hữu ích nhưng nguy hiểm nếu dùng sai?',
        a: 'Hữu ích vì chúng đặt tên cho những khác biệt mà nếu không có từ vựng thì người ta chỉ cảm thấy khó chịu mà không nói ra được, và vì chúng nhắc rằng quy ước của mình không phải chuẩn phổ quát. Nguy hiểm vì chúng mô tả xu hướng trung bình của nhóm, trong khi khác biệt giữa các cá nhân trong cùng một nhóm thường lớn hơn khác biệt giữa các nhóm. Dùng đúng là dùng để đặt câu hỏi cần kiểm, dùng sai là dùng để kết luận về một người trước khi gặp họ.',
      },
      {
        q: 'Trong nhóm đa văn hoá, vì sao im lặng không nên được tính là đồng ý?',
        a: 'Vì im lặng mang nghĩa rất khác nhau tuỳ quy ước: có nơi nó là đồng ý, có nơi là chưa hiểu, có nơi là không đồng ý nhưng không tiện nói trước đám đông, có nơi đơn giản là đang chờ tới lượt. Trong một nhóm trộn nhiều quy ước, không có cách nào suy ra nghĩa đúng từ im lặng. Giải pháp thực dụng là đặt luật rằng đồng ý phải được nói hoặc viết rõ, và hỏi riêng từng người với những quyết định quan trọng.',
      },
      {
        q: 'Khi nào một trục trặc thực sự do khác biệt văn hoá và khi nào không?',
        a: 'Cách phân biệt là thử gỡ các nguyên nhân thông thường trước: yêu cầu có mơ hồ không, người chịu trách nhiệm có rõ không, thông tin có tới đúng người đúng lúc không, năng lực chuyên môn có đủ không. Nếu sau khi làm rõ cả bốn thứ mà vấn đề vẫn lặp lại theo cùng một mẫu ở đúng một nhóm người, thì mới có cơ sở nghi ngờ khác biệt quy ước. Đổ lỗi cho văn hoá quá sớm là cách rất hiệu quả để không bao giờ sửa được nguyên nhân thật.',
      },
    ],
    plan7:
      'Ngày 1: viết bản đồ quy ước mặc định của chính bạn trên bốn trục. Ngày 2: đọc lại một chuỗi trao đổi cũ và tìm chỗ bạn đã suy diễn thái độ. Ngày 3: hỏi trực tiếp một đối tác khác văn hoá ba câu về cách làm việc của họ. Ngày 4: bắt đầu gắn nhãn mức độ cho mọi phản hồi bạn đưa ra. Ngày 5: áp dụng biên bản kèm xác nhận bằng văn bản cho mọi cuộc họp có quyết định. Ngày 6: hỏi riêng từng bên về điều họ còn chưa yên tâm trước một mốc quan trọng. Ngày 7: soạn bản nháp quy ước làm việc chung và gửi cả nhóm góp ý.',
    evidence:
      'Hiện vật tốt nhất là bộ quy ước làm việc chung do bạn soạn cho một nhóm hoặc một dự án đa văn hoá, kèm số đo trước và sau như số việc phải làm lại sát mốc bàn giao hoặc số lần biên bản bị đính chính. Kèm theo đó là một ví dụ cụ thể về hiểu nhầm đã được ngăn nhờ quy ước ấy. Đây là bằng chứng rất có giá cho hồ sơ ứng tuyển các công ty có khách hàng nước ngoài, các vị trí quản lý dự án gia công phần mềm, xuất nhập khẩu và du lịch. Trong phỏng vấn, kể một lần bạn hiểu sai tín hiệu của đối tác, cách bạn phát hiện và cơ chế bạn dựng lên sau đó. Trong CV, viết dạng: "Xây bộ quy ước phản hồi và xác nhận cho dự án với khách Nhật và khách Mỹ, giảm số hạng mục phải làm lại trong tuần bàn giao từ 9 xuống 2".',
    references: [
      { label: 'Erin Meyer — The Culture Map', url: 'https://erinmeyer.com/', type: 'article' },
      { label: 'Hofstede Insights — mô hình các chiều văn hoá', url: 'https://www.hofstede-insights.com/', type: 'article' },
    ],
  }),

  // ─────────────────────────────────────────────────────────────────────────
  // Chương 15 — Giao tiếp từ xa
  // ─────────────────────────────────────────────────────────────────────────
  guide({
    thesis:
      'Làm việc từ xa lấy đi hai thứ mà văn phòng cung cấp miễn phí: ngữ cảnh thu nhặt được một cách tình cờ, và tín hiệu quan hệ tích luỹ qua những tương tác nhỏ hằng ngày. Nếu không có gì thay thế, hai khoảng trống đó không tự lấp mà biến thành hiểu nhầm và cảm giác bị bỏ rơi. Nguyên tắc cốt lõi là chuyển từ mặc định nói sang mặc định viết: mọi quyết định, ngữ cảnh và trạng thái công việc được viết ra ở nơi ai cũng tìm được, còn các cuộc gặp trực tiếp được dành cho đúng những việc mà văn bản làm kém, tức là bàn bạc khi chưa rõ hướng và xử lý những chuyện có cảm xúc.',
    why: {
      work: 'Trong nhóm phân tán, người ngồi cùng phòng với sếp có lợi thế thông tin rất lớn nếu tổ chức không viết mọi thứ ra. Điều này tạo ra bất công thầm lặng về cơ hội và là nguyên nhân khiến nhiều người làm từ xa dần bị bỏ ngoài các quyết định quan trọng.',
      interview:
        'Ngày càng nhiều vị trí phỏng vấn hoàn toàn trực tuyến và có phần đánh giá khả năng làm việc bất đồng bộ. Người trả lời được mình đã viết tài liệu gì, chốt quy ước phản hồi ra sao và xử lý lệch múi giờ thế nào sẽ nổi bật hơn hẳn người chỉ nói mình quen làm việc từ xa.',
      study:
        'Học trực tuyến thất bại phần lớn vì thiếu cấu trúc và thiếu tương tác chứ không vì nội dung kém. Chủ động đặt nhịp cố định, viết ra cam kết học và tìm một người cùng học để báo cáo tiến độ là những biện pháp bù đắp đúng chỗ thiếu.',
      life: 'Khi gia đình sống xa nhau, chất lượng quan hệ phụ thuộc vào việc có nhịp liên lạc đều đặn hay không, chứ không phụ thuộc vào những cuộc gọi dài ngẫu hứng. Đặt một lịch cố định thường hiệu quả hơn nhiều so với việc chờ lúc nào rảnh thì gọi.',
    },
    framework: [
      {
        name: 'Mặc định viết',
        detail:
          'Mọi quyết định, lý do phía sau và trạng thái công việc phải tồn tại dưới dạng văn bản ở nơi cả nhóm truy cập được, không nằm trong tin nhắn riêng hay trí nhớ của người dự họp. Phép thử là hỏi một người mới vào có thể tự đọc và hiểu vì sao nhóm đang làm thế này hay không.',
      },
      {
        name: 'Viết kèm ngữ cảnh dư ra một lớp',
        detail:
          'Khi viết từ xa, thêm phần mà ở văn phòng bạn sẽ bỏ qua: lý do, thứ đã thử, mức độ chắc chắn, và điều bạn cần từ người đọc. Chi phí là thêm vài dòng, còn lợi ích là loại bỏ một vòng qua lại vốn có thể mất cả ngày nếu lệch múi giờ.',
      },
      {
        name: 'Định nghĩa mức khẩn và thời gian phản hồi',
        detail:
          'Thoả thuận rõ kênh nào dùng cho việc gì và trong bao lâu thì phải trả lời: tin nhắn nhóm trong ngày làm việc, thư trong hai mươi bốn giờ, gọi điện chỉ khi thật sự khẩn. Không có quy ước này thì mọi người mặc định phải trực liên tục và kiệt sức dần.',
      },
      {
        name: 'Dùng gặp mặt cho đúng việc',
        detail:
          'Chỉ họp khi cần bàn bạc lúc chưa rõ hướng, khi nội dung có cảm xúc, hoặc khi cần xây quan hệ. Những buổi chỉ để mỗi người báo cáo lần lượt nên chuyển thành văn bản, còn thời gian gặp dành cho phần hỏi và bàn.',
      },
      {
        name: 'Bù đắp tín hiệu quan hệ',
        detail:
          'Chủ động tạo những tương tác không phục vụ nhiệm vụ: mở đầu cuộc gọi bằng vài phút hỏi thăm, ghi nhận công khai việc người khác làm tốt, và giữ một buổi trao đổi riêng định kỳ với từng người. Ở văn phòng những thứ này xảy ra tự nhiên; từ xa thì phải đặt lịch.',
      },
      {
        name: 'Rà lại nhịp định kỳ',
        detail:
          'Mỗi vài tháng, hỏi cả nhóm hai câu: cuộc họp nào có thể bỏ, và thông tin nào bạn thường phải đi hỏi mới có. Câu trả lời cho bạn danh sách việc cần chuyển sang văn bản và danh sách cuộc họp cần cắt.',
      },
    ],
    scenario:
      'Một trưởng nhóm quản lý sáu người ở ba tỉnh và một cộng tác viên ở nước ngoài. Ban đầu nhóm họp trực tuyến mỗi sáng ba mươi phút để từng người báo cáo, và các quyết định được chốt trong cuộc họp mà không ai ghi lại. Người ở múi giờ khác thường xuyên không dự được và liên tục làm sai hướng. Trưởng nhóm đổi cách làm: bỏ họp báo cáo hằng ngày, thay bằng một trang cập nhật viết trước chín giờ mỗi ngày gồm ba dòng cho mỗi người; giữ lại một cuộc họp tuần chín mươi phút chỉ để bàn những việc chưa rõ hướng; mọi quyết định phải được ghi vào một trang chung kèm lý do và ngày. Anh cũng đặt quy ước phản hồi trong hai mươi bốn giờ và một buổi nói chuyện riêng ba mươi phút với từng người mỗi hai tuần. Sau một quý, tổng thời gian họp giảm khoảng một nửa, và cộng tác viên ở xa không còn phải làm lại vì thiếu thông tin.',
    comparison: [
      {
        weak: 'Chốt quyết định trong cuộc gọi và coi như ai có mặt thì biết, ai vắng thì tự hỏi lại.',
        mature: 'Ghi mọi quyết định kèm lý do và ngày vào một nơi cố định, để người vắng mặt tự đọc được mà không phải đi hỏi ai.',
      },
      {
        weak: 'Nhắn tin ngắn kiểu cái này sao thế và chờ người kia hỏi lại mới nói rõ.',
        mature: 'Viết một tin đầy đủ gồm bối cảnh, điều đã thử, câu hỏi cụ thể và mức khẩn, để người nhận trả lời được ngay trong một lượt.',
      },
      {
        weak: 'Giữ nguyên toàn bộ lịch họp của thời làm việc tại văn phòng và chuyển hết lên trực tuyến.',
        mature: 'Chuyển các buổi báo cáo thành văn bản, chỉ giữ lại những buổi cần bàn bạc, và rút ngắn thời lượng còn hai phần ba.',
      },
      {
        weak: 'Đánh giá mức độ chăm chỉ qua thời gian trạng thái trực tuyến sáng đèn.',
        mature: 'Đánh giá qua kết quả và cam kết đã thoả thuận trước, đồng thời nói rõ khung giờ mọi người được phép không trực.',
      },
    ],
    mistakes: [
      'Chuyển sang làm từ xa mà không đổi cách vận hành, giữ nguyên văn hoá quyết định bằng lời nói, khiến những người ở xa dần mất thông tin và sau vài tháng thì mất luôn cơ hội tham gia việc quan trọng.',
      'Lấp khoảng trống ngữ cảnh bằng cách tăng số cuộc họp trực tuyến, dẫn tới lịch kín cả ngày và không còn khoảng thời gian liền mạch nào để làm việc thật.',
      'Bỏ hẳn phần quan hệ vì cho rằng làm từ xa thì chỉ cần hiệu quả công việc, rồi ngạc nhiên khi phát hiện thành viên đã âm thầm tìm việc khác từ nhiều tháng trước.',
    ],
    worksheet: [
      'Ba quyết định gần nhất của nhóm bạn được ghi lại ở đâu? Một người mới vào có tự tìm được không?',
      'Cuộc họp định kỳ nào của bạn chỉ gồm việc từng người lần lượt báo cáo? Nó có thể chuyển thành văn bản không?',
      'Nhóm bạn đã thoả thuận thời gian phản hồi cho từng kênh chưa? Nếu chưa, hãy viết ra mức bạn đề xuất.',
      'Ai trong nhóm bạn ít xuất hiện nhất trong các cuộc trao đổi? Lần cuối bạn nói chuyện riêng với họ là khi nào?',
      'Trong tuần qua, có việc nào bạn đã phải đi hỏi mới có thông tin? Thông tin đó lẽ ra nên nằm ở đâu?',
    ],
    exercises: [
      {
        label: 'Một tin đủ ý',
        text: 'Trong ba ngày, mọi tin nhắn hỏi việc của bạn phải gồm bối cảnh, điều đã thử, câu hỏi cụ thể và mức khẩn. Đếm số lượt qua lại trung bình để giải quyết một việc, so với tuần trước.',
        level: 'e',
      },
      {
        label: 'Trang quyết định',
        text: 'Lập một trang chung ghi mọi quyết định của nhóm kèm ngày và lý do. Điền lại năm quyết định gần nhất và gửi cho cả nhóm kiểm xem có ai nhớ khác không.',
        level: 'e',
      },
      {
        label: 'Cập nhật viết thay họp',
        text: 'Thay một cuộc họp báo cáo bằng bản cập nhật viết ba dòng mỗi người. Sau hai tuần, hỏi cả nhóm thấy cách nào cho họ nhiều thông tin hơn và cách nào tốn ít thời gian hơn.',
        level: 'e',
      },
      {
        label: 'Bảng quy ước kênh',
        text: 'Soạn bảng ghi rõ kênh nào dùng cho loại việc gì và thời gian phản hồi kỳ vọng cho từng kênh. Đưa nhóm góp ý, chốt lại và dán ở nơi ai cũng thấy.',
        level: 'm',
      },
      {
        label: 'Cắt một phần ba lịch họp',
        text: 'Rà toàn bộ cuộc họp định kỳ trong tháng, đánh dấu cái nào chỉ để báo cáo. Cắt hoặc chuyển sang văn bản ít nhất một phần ba thời lượng và đo lại sau bốn tuần.',
        level: 'm',
      },
      {
        label: 'Trao đổi riêng định kỳ',
        text: 'Đặt lịch ba mươi phút mỗi hai tuần với từng người bạn làm việc gần nhất, không bàn tiến độ mà hỏi về khó khăn và điều họ cần. Ghi lại điều bạn không hề biết trước đó.',
        level: 'm',
      },
      {
        label: 'Viết sổ tay vận hành nhóm',
        text: 'Soạn một tài liệu vận hành cho nhóm từ xa gồm quy ước kênh, nơi lưu quyết định, nhịp cập nhật, cách xử lý lệch múi giờ và cách đưa người mới vào. Áp dụng một quý rồi rà lại cùng cả nhóm.',
        level: 'h',
      },
      {
        label: 'Thử thách 7 ngày: viết trước khi gọi',
        text: 'Bảy ngày, trước khi đề nghị bất kỳ cuộc gọi nào, bạn phải viết ra vấn đề và câu hỏi trước. Ghi lại số lần việc viết ra đã tự giải quyết vấn đề mà không cần gọi nữa, và số lần cuộc gọi vẫn cần nhưng ngắn hơn hẳn nhờ có bản viết. Cuối tuần rút ra loại việc nào thực sự cần nói trực tiếp.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao mặc định viết lại quan trọng hơn trong nhóm phân tán so với nhóm ngồi cùng phòng?',
        a: 'Vì ở văn phòng, phần lớn ngữ cảnh được thu nhặt tình cờ qua những câu nói trong lúc đi lại và những cuộc trao đổi mà bạn vô tình nghe được. Từ xa, kênh tình cờ đó biến mất hoàn toàn, nên nếu ngữ cảnh không được viết ra thì nó chỉ tồn tại trong đầu vài người. Hệ quả không chỉ là hiểu nhầm mà còn là bất công về cơ hội, vì người có kênh riêng với người ra quyết định sẽ luôn biết nhiều hơn.',
      },
      {
        q: 'Cuộc họp nào nên giữ khi làm việc từ xa và cuộc họp nào nên bỏ?',
        a: 'Nên giữ những buổi mà văn bản làm kém: bàn bạc khi chưa rõ hướng đi, xử lý bất đồng hoặc chuyện có cảm xúc, và những buổi phục vụ xây quan hệ. Nên bỏ hoặc chuyển thành văn bản những buổi mà mỗi người chỉ lần lượt trình bày trạng thái, vì nội dung đó đọc nhanh hơn nghe và không cần cả nhóm có mặt cùng lúc. Phép thử là hỏi buổi này có cần ai phản ứng ngay tại chỗ không.',
      },
      {
        q: 'Làm sao biết một nhóm từ xa đang mất kết nối quan hệ trước khi có người nghỉ việc?',
        a: 'Vài dấu hiệu quan sát được: số câu hỏi chủ động giảm dần, mọi trao đổi đều gói gọn trong nhiệm vụ và không ai nói gì ngoài việc, thời gian phản hồi kéo dài dần, và trong họp chỉ vài người luôn nói còn số còn lại im. Cách kiểm rẻ nhất là buổi trao đổi riêng định kỳ với câu hỏi mở về khó khăn; nếu câu trả lời luôn là mọi thứ đều ổn trong nhiều tháng liền, đó thường là dấu hiệu kênh này chưa đủ an toàn để nói thật chứ không phải mọi thứ đều ổn.',
      },
    ],
    plan7:
      'Ngày 1: kiểm tra ba quyết định gần nhất của nhóm xem chúng được ghi ở đâu. Ngày 2: lập trang quyết định chung và điền lại năm quyết định cũ. Ngày 3: viết mọi tin nhắn hỏi việc theo mẫu đủ bối cảnh và câu hỏi cụ thể. Ngày 4: soạn bảng quy ước kênh và thời gian phản hồi, gửi nhóm góp ý. Ngày 5: chuyển một cuộc họp báo cáo thành bản cập nhật viết. Ngày 6: đặt lịch trao đổi riêng với từng người và thực hiện ít nhất một buổi. Ngày 7: rà lịch họp cả tháng và cắt phần chỉ để báo cáo, ghi lại số giờ tiết kiệm được mỗi tuần.',
    evidence:
      'Hiện vật mạnh nhất là sổ tay vận hành nhóm từ xa do bạn viết: quy ước kênh, nơi lưu quyết định, nhịp cập nhật, cách xử lý lệch múi giờ và quy trình đưa người mới vào. Kèm theo là số đo trước và sau như tổng giờ họp mỗi tuần, thời gian phản hồi trung bình, hoặc thời gian để một người mới bắt đầu làm được việc. Loại tài liệu này rất có sức nặng khi ứng tuyển các vị trí quản lý nhóm phân tán hoặc làm việc với khách hàng nước ngoài, và cũng hữu ích cho người làm tự do muốn chứng minh mình vận hành có kỷ luật. Trong phỏng vấn, kể một lần bạn phát hiện một người ở xa đang bị bỏ ngoài luồng thông tin và cơ chế bạn dựng lên để sửa. Trong CV, viết dạng: "Thiết kế quy trình làm việc bất đồng bộ cho nhóm 7 người ở 4 địa điểm, giảm tổng thời lượng họp hằng tuần từ 6 giờ xuống 2,5 giờ".',
    references: [
      { label: 'Atlassian Team Playbook', url: 'https://www.atlassian.com/team-playbook', type: 'article' },
      { label: 'GitLab Handbook — mô hình làm việc hoàn toàn từ xa', url: 'https://handbook.gitlab.com/', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),
];
