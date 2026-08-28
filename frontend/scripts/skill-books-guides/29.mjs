import { guide } from '../skill-guide-builder.mjs';

export default [
  // ── Chương 1 · Quản lý thời gian ──────────────────────────────────────────
  guide({
    thesis:
      'Không ai quản lý được thời gian: một tuần luôn có đúng 168 giờ và con số đó không thương lượng được. Thứ thật sự quản lý được là ba biến khác — số cam kết bạn nhận, thứ tự bạn thực hiện chúng, và mức chú ý bạn đặt vào việc đang làm. Vì vậy thước đo của kỹ năng này không phải cảm giác bận rộn hay số giờ ngồi tại chỗ, mà là tỷ lệ những việc bạn tuyên bố là quan trọng thật sự có một chỗ trong lịch tuần và thật sự đã xảy ra.',
    why: {
      work:
        'Người quản lý được thời gian không phải người làm nhiều hơn, mà là người trả lời được câu "tuần này em bỏ việc gì để làm việc anh vừa giao". Nhờ câu đó, bạn và người giao việc cùng nhìn một bức tranh, thay vì bạn im lặng nhận rồi trễ và mất uy tín ở cả hai việc.',
      interview:
        'Câu hỏi "bạn xử lý thế nào khi có ba việc cùng gấp" đo cách ra quyết định chứ không đo sức chịu đựng. Câu trả lời ghi điểm nêu được tiêu chí đã dùng, người bạn đã hỏi để xác nhận thứ tự, và việc bạn đã chủ động hoãn kèm lý do — chứ không phải chuyện bạn thức đến 2 giờ sáng làm hết.',
      study:
        'Người vừa đi làm vừa học thêm hầu như luôn hỏng ở cùng một chỗ: xếp việc học vào "thời gian rảnh còn lại", trong khi thời gian rảnh còn lại là đại lượng biến mất đầu tiên mỗi khi công việc căng lên.',
      life:
        'Thời gian cho gia đình, sức khỏe và bạn bè hiếm khi có deadline, nên nó luôn thua trong cuộc cạnh tranh với việc có deadline — trừ khi bạn cấp cho nó một chỗ cố định trong lịch và bảo vệ chỗ đó y như bảo vệ một cuộc hẹn với khách hàng.',
    },
    framework: [
      {
        name: 'Đo năm ngày',
        detail:
          'Ghi thời gian thật theo ô 30 phút trong 5 ngày làm việc, ghi ngay lúc chuyển việc chứ không nhớ lại vào cuối ngày. Mục tiêu không phải chấm điểm bản thân mà là tìm ra ba khoảng lớn nhất bạn không giải thích được.',
      },
      {
        name: 'Kiểm kê cam kết',
        detail:
          'Liệt kê mọi lời hứa đang mở — với sếp, đồng nghiệp, khách hàng, gia đình và với chính mình — mỗi lời hứa kèm tên người đang chờ và hạn thật. Phần lớn cảm giác quá tải đến từ những cam kết chưa bao giờ được viết ra ở đâu cả.',
      },
      {
        name: 'Tính trần giờ chủ động',
        detail:
          'Lấy tổng giờ làm trong tuần trừ giờ họp cố định, trừ giờ dành cho việc phản ứng (email, tin nhắn, sự cố). Con số còn lại — thường nhỏ hơn nhiều so với tưởng tượng — mới là ngân sách thật để nhận việc mới.',
      },
      {
        name: 'Đặt chỗ trước',
        detail:
          'Đưa hai đến ba việc quan trọng nhất vào lịch tuần trước khi người khác kịp lấp lịch của bạn, xếp vào khung giờ bạn tỉnh táo nhất, và đặt tên khối bằng kết quả bàn giao được chứ không bằng tên chủ đề.',
      },
      {
        name: 'Đối soát cuối tuần',
        detail:
          'Cuối tuần so lịch kế hoạch với lịch thực tế và ghi ba con số: số khối giữ được, số khối bị lấn, nguyên nhân lấn hay gặp nhất. Thiếu bước này thì bốn bước trên chỉ là một lần dọn dẹp, không thành hệ thống.',
      },
    ],
    scenario:
      'Một kế toán tổng hợp ở công ty thương mại khoảng 60 người tháng nào cũng chốt sổ trễ ba đến bốn ngày và ngồi lại tới 21 giờ trong tuần chốt. Chị tin nguyên nhân là khối lượng việc quá lớn. Sau một tuần ghi thời gian thật theo ô 30 phút, bức tranh khác hẳn: buổi sáng của chị bị cắt vụn bởi các yêu cầu tra cứu hóa đơn từ phòng kinh doanh — mỗi yêu cầu chỉ vài phút, nhưng kéo theo mười lăm phút để tìm lại đúng dòng trong file đối chiếu đang làm dở. Chị đổi ba thứ: gom mọi yêu cầu tra cứu vào một biểu mẫu và trả lời tập trung hai lần mỗi ngày lúc 10h30 và 16h00; khóa khung 8h00-10h00 làm giờ đối chiếu không nhận yêu cầu; báo trước với trưởng phòng kinh doanh rằng yêu cầu gửi sau 16h sẽ được trả lời sáng hôm sau. Tháng tiếp theo chị chốt sổ đúng hạn nội bộ và muộn nhất về lúc 18h30 trong tuần chốt. Điều đáng chú ý: số yêu cầu tra cứu gần như không giảm, chỉ đổi cách đến.',
    comparison: [
      {
        weak: 'Đo mức làm việc bằng cảm giác bận và số giờ ngồi tại bàn; hết ngày thấy mệt là coi như ngày đó hiệu quả.',
        mature:
          'Đo bằng kết quả bàn giao được của từng khối: cuối buổi sáng có thứ gì tồn tại mà đầu buổi sáng chưa có? Không trả lời được nghĩa là khối đó cần thiết kế lại, chứ không phải bạn cần cố hơn.',
      },
      {
        weak: 'Nhận thêm việc bằng câu "để em cố sắp xếp", không nói ra việc nào sẽ bị đẩy lùi vì nó.',
        mature:
          'Nhận việc kèm phần đánh đổi hiện rõ: "em nhận được, nhưng báo cáo tuần sẽ lùi sang thứ Năm — anh chọn giúp em thứ tự trước khi em bắt đầu".',
      },
      {
        weak: 'Coi lịch là nơi chỉ ghi cuộc hẹn với người khác; việc của chính mình thì nằm trong đầu hoặc trong một danh sách rời.',
        mature:
          'Coi lịch là nơi phân bổ toàn bộ quỹ giờ; việc quan trọng có chỗ với tên gọi cụ thể, nên khi ai đó xin họp chồng lên, bạn nhìn thấy ngay mình đang đánh đổi cái gì để nhận lời.',
      },
    ],
    mistakes: [
      'Đổi công cụ thay vì đổi cam kết: cài ứng dụng mới, dựng bảng theo dõi rất đẹp, rồi vẫn nhận đúng số việc cũ trong đúng số giờ cũ. Công cụ chỉ hiển thị vấn đề rõ hơn chứ không giảm tải hộ bạn.',
      'Lập kế hoạch cho một ngày lý tưởng không gián đoạn, trong khi tuần nào cũng có một phần đáng kể thời gian bị việc bất ngờ chiếm; kế hoạch vỡ ngay ngày thứ hai rồi bị bỏ hẳn vì bạn kết luận là "lập kế hoạch không hợp với công việc của mình".',
      'Chỉ tối ưu tốc độ thao tác (phím tắt, mẫu sẵn, gõ nhanh hơn) mà không rà lại danh sách việc, nên bạn làm nhanh hơn những việc lẽ ra không nên làm.',
    ],
    worksheet: [
      'Trong 5 ngày làm việc gần nhất, ba khoảng thời gian lớn nhất mà bạn không giải thích được là gì? Ghi khung giờ cụ thể, không ghi chung chung là "buổi chiều".',
      'Liệt kê mọi lời hứa đang mở kèm tên người đang chờ. Có bao nhiêu lời hứa mà người kia vẫn đang đợi nhưng chưa hề có mặt trong lịch của bạn?',
      'Tổng giờ làm tuần này, trừ giờ họp cố định, trừ giờ xử lý việc phản ứng, còn lại bao nhiêu? Con số đó có khớp với lượng việc bạn đã nhận không?',
      'Tuần trước, việc quan trọng nhất của bạn chiếm bao nhiêu ô 30 phút trong lịch thực tế? Nếu bằng không, cụ thể việc gì đã chiếm chỗ của nó?',
      'Nếu tuần tới bạn phải trả lại đúng một cam kết cho người khác, đó là cam kết nào, bạn nói với ai, và câu mở đầu bạn sẽ dùng là gì?',
    ],
    exercises: [
      {
        label: 'Nhật ký ô 30 phút',
        text: 'Trong 5 ngày làm việc, ghi thời gian thật theo ô 30 phút ngay tại thời điểm đổi việc. Ngày thứ 6 tô ba màu: việc tạo ra kết quả, việc duy trì vận hành, việc bị động. Tính tỷ lệ ba nhóm và ghi nhóm nào lớn hơn bạn tưởng.',
        level: 'e',
      },
      {
        label: 'Bảng 168 giờ',
        text: 'Vẽ bảng 168 ô cho một tuần, điền trước những thứ gần như cố định: ngủ, ăn, di chuyển, giờ làm, chăm sóc gia đình. Số ô còn trống chính là ngân sách thật cho mọi kế hoạch tự học và dự án cá nhân bạn đang ấp ủ.',
        level: 'e',
      },
      {
        label: 'Kiểm kê cam kết mở',
        text: 'Đặt hẹn giờ 20 phút, viết ra mọi lời hứa đang mở ở bốn nhóm: sếp, đồng nghiệp, khách hàng hoặc đối tác, gia đình và bản thân. Đánh dấu những cam kết bạn đã quên mất là mình có cho tới lúc viết ra.',
        level: 'e',
      },
      {
        label: 'Hai khối bất khả xâm phạm',
        text: 'Đặt hai khối 90 phút vào lịch tuần tới cho việc quan trọng nhất, đặt tên khối bằng kết quả cụ thể (ví dụ "xong bản nháp báo cáo quý"), và báo trước cho một người có khả năng xin họp chồng lên khối đó.',
        level: 'm',
      },
      {
        label: 'Ba dòng đánh đổi',
        text: 'Lần tới có việc mới, trước khi trả lời hãy viết ba dòng: việc mới cần bao nhiêu giờ, số giờ đó lấy từ đâu, ai bị ảnh hưởng khi lấy. Gửi ba dòng đó cho người giao việc và để họ chọn phương án.',
        level: 'm',
      },
      {
        label: 'Gom việc vụn',
        text: 'Chọn một loại yêu cầu vụn hay cắt ngang bạn (tra cứu, duyệt, xác nhận). Thiết kế một điểm gom duy nhất và hai khung giờ xử lý cố định. Chạy một tuần rồi so số lần bị cắt ngang mỗi buổi sáng trước và sau.',
        level: 'm',
      },
      {
        label: 'Tuần đối soát đầy đủ',
        text: 'Chạy trọn một tuần theo lịch kế hoạch, cuối tuần chụp lại lịch thực tế và so từng khối. Viết một trang: khối nào giữ được, khối nào bị lấn, nguyên nhân lấn phổ biến nhất, và một thay đổi cấu trúc cho tuần sau — thay đổi cấu trúc, không phải lời hứa cố gắng hơn.',
        level: 'h',
      },
      {
        label: 'Thương lượng lại một cam kết',
        text: 'Chọn cam kết đang nặng nhất và không còn xứng đáng với chi phí của nó. Chuẩn bị một cuộc trao đổi 10 phút gồm: hiện trạng, lý do đề nghị đổi, hai phương án thay thế cho người kia, và ngày bàn giao mới. Thực hiện thật và ghi lại phản ứng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao cụm từ "quản lý thời gian" dễ dẫn người ta đi sai hướng?',
        a: 'Vì thời gian là hằng số không co giãn — ai cũng có 168 giờ mỗi tuần. Thứ thay đổi được là số cam kết đã nhận, thứ tự thực hiện và mức chú ý. Gọi đúng tên giúp bạn ngừng đi tìm mẹo tiết kiệm vài phút và bắt đầu xử lý gốc rễ: bạn đang nhận nhiều việc hơn quỹ giờ cho phép.',
      },
      {
        q: 'Bạn ghi nhật ký thời gian một tuần và thấy một phần ba thời gian rơi vào "việc lặt vặt". Bước tiếp theo đúng là gì?',
        a: 'Phân loại trước khi cắt. Việc lặt vặt gồm bốn nhóm khác nhau: việc chỉ mình bạn làm được, việc có thể gom lô, việc có thể chuyển cho người khác, việc có thể bỏ hẳn. Bốn nhóm cần bốn cách xử lý; cắt đồng loạt sẽ vô tình bỏ mất những việc duy trì quan hệ hoặc nghĩa vụ vận hành mà hậu quả chỉ hiện ra sau vài tháng.',
      },
      {
        q: 'Kế hoạch tuần của bạn tuần nào cũng vỡ vào thứ Tư. Sửa thế nào cho đúng gốc?',
        a: 'Đừng ép mình bám kế hoạch chặt hơn, hãy sửa giả định đầu vào. Đo phần thời gian thực tế bị việc bất ngờ chiếm trong ba đến bốn tuần gần nhất, rồi chỉ lập kế hoạch cho phần còn lại và chừa sẵn một khối đệm mỗi ngày. Kế hoạch vỡ đều đặn là dấu hiệu kế hoạch quá đầy, không phải dấu hiệu bạn thiếu ý chí.',
      },
    ],
    plan7:
      'Ngày 1: ghi nhật ký ô 30 phút và không đổi bất cứ thứ gì — đây là đường nền. Ngày 2-3: tiếp tục ghi, đồng thời kiểm kê toàn bộ cam kết đang mở. Ngày 4: tính trần giờ chủ động của tuần và so với lượng việc đã nhận, khoanh phần chênh. Ngày 5: đặt hai khối 90 phút cho việc quan trọng nhất của tuần sau và báo trước cho người hay xin họp chồng. Ngày 6: chọn một loại việc vụn để gom lô và thiết kế điểm gom. Ngày 7: đối soát lịch kế hoạch với lịch thực tế, ghi ba con số và chọn đúng một thay đổi cấu trúc mang sang tuần kế tiếp.',
    evidence:
      'Giữ lại ba hiện vật của tuần đối soát: ảnh chụp nhật ký thời gian, bản so lịch kế hoạch với lịch thực tế, và một trang mô tả thay đổi cấu trúc bạn đã áp dụng kèm số liệu trước và sau (số lần bị cắt ngang mỗi buổi sáng, ngày chốt sổ, số khối giữ được). Trong phỏng vấn, dùng đúng bộ ba này để trả lời câu "bạn tự tổ chức công việc thế nào" — mô tả một hệ thống kèm số đo có sức nặng hơn hẳn tính từ "em quản lý thời gian tốt". Nếu bạn đang quản lý người khác, chính bộ ba đó là bằng chứng bạn biết bảo vệ quỹ thời gian của cả nhóm chứ không chỉ của mình.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Time management', url: 'https://hbr.org/topic/subject/time-management', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 2 · Xác định ưu tiên ───────────────────────────────────────────
  guide({
    thesis:
      'Ưu tiên là một động từ, không phải một nhãn dán. Nó chỉ có nghĩa khi bạn hạ một thứ xuống để nâng một thứ khác lên, và có người biết về việc hạ đó. Một danh sách mà mọi mục đều gắn nhãn "cao" là danh sách chưa được ưu tiên, mới chỉ được tô màu. Kỹ năng thật nằm ở chỗ quy những thứ khó so sánh — việc gấp của sếp, việc quan trọng dài hạn, việc nhỏ làm hài lòng khách — về cùng một thước đo: hậu quả nếu chậm, và giá trị tạo ra trên mỗi giờ bỏ vào.',
    why: {
      work:
        'Nguồn lực không bao giờ đủ cho mọi việc. Người biết ưu tiên biến một cuộc tranh cãi cảm tính giữa các phòng ban thành một bảng có tiêu chí, nhờ đó chốt được trong hai mươi phút thay vì kéo qua ba cuộc họp và một chuỗi tin nhắn.',
      interview:
        'Câu "kể một lần bạn phải chọn giữa hai việc đều quan trọng" chấm điểm ở tiêu chí bạn đã dùng và cách bạn thông báo cho bên bị hoãn, chứ không chấm ở việc bạn đã xoay xở làm được cả hai bằng cách thức khuya.',
      study:
        'Ôn thi là bài toán ưu tiên điển hình: với cùng số giờ, đầu tư vào phần chiếm nhiều điểm mà bạn đang yếu cho lợi nhuận cao hơn nhiều so với ôn lại phần đã chắc — dù phần đã chắc mang lại cảm giác dễ chịu hơn.',
      life:
        'Ngân sách gia đình, thời gian cho con, việc chăm sóc cha mẹ và kế hoạch sức khỏe cạnh tranh nhau trong một quỹ hữu hạn. Không xếp thứ tự trước thì thứ tự sẽ do việc khẩn cấp nhất trong ngày quyết định thay bạn, hết ngày này sang ngày khác.',
    },
    framework: [
      {
        name: 'Đưa hết về một chỗ',
        detail:
          'Không thể so sánh khi các lựa chọn nằm rải rác ở email, tin nhắn và trong đầu. Đưa mọi ứng viên về một danh sách phẳng, mỗi mục một dòng, chưa xếp hạng gì cả — bước này thường đã làm giảm cảm giác quá tải.',
      },
      {
        name: 'Gắn hậu quả nếu chậm',
        detail:
          'Với mỗi mục, viết một câu: nếu việc này lùi một tuần thì điều gì xảy ra, ai chịu ảnh hưởng, mất bao nhiêu tiền hoặc uy tín. Đây là cách quy mọi mục về một thước đo chung, quen gọi là chi phí của sự chậm trễ (cost of delay).',
      },
      {
        name: 'Chấm công sức thô',
        detail:
          'Chấm mỗi mục theo ba mức S, M, L — dưới nửa ngày, một đến hai ngày, hơn hai ngày. Không cần chính xác, chỉ cần đủ để nhìn ra mục nào cho nhiều giá trị với ít giờ và mục nào ngược lại.',
      },
      {
        name: 'Tách khẩn khỏi quan trọng',
        detail:
          'Dùng ma trận Eisenhower (khẩn × quan trọng) để tách bốn nhóm. Nhóm quan trọng nhưng không khẩn là nhóm hay bị bỏ rơi nhất, đồng thời là nhóm quyết định kết quả của cả quý.',
      },
      {
        name: 'Chốt ba việc và công bố',
        detail:
          'Chọn đúng ba việc cho tuần, viết ra những việc bị hoãn kèm ngày xem lại, rồi gửi cho người liên quan. Ưu tiên chưa được công bố thì chưa tồn tại: người kia vẫn đang tin việc của họ đang chạy.',
      },
    ],
    scenario:
      'Một trưởng nhóm chăm sóc khách hàng của công ty phần mềm kế toán có 5 nhân sự và hàng đợi hơn 400 yêu cầu, thời gian phản hồi trung bình trượt từ nửa buổi lên gần hai ngày. Phản xạ đầu tiên của chị là xin tuyển thêm người. Trước khi xin, chị dành một buổi phân loại hàng đợi theo hậu quả nếu chậm: nhóm chặn khách không dùng được phần mềm, nhóm gây khó chịu nhưng có đường vòng, nhóm hỏi cách sử dụng, và nhóm đề nghị tính năng mới. Nhóm hỏi cách sử dụng chiếm phần lớn số yêu cầu nhưng gần như không có hậu quả nếu chậm nửa ngày, và mười hai câu hỏi lặp lại chiếm phần lớn nhóm đó. Trong hai tuần chị làm ba việc: viết mười hai bài hướng dẫn kèm ảnh và gắn liên kết vào câu trả lời mẫu; đặt luật nhóm chặn phải được xử lý trong hai giờ; chuyển nhóm đề nghị tính năng sang một bảng gửi bộ phận sản phẩm mỗi thứ Sáu thay vì trả lời từng cái. Hàng đợi vẫn dài, nhưng nhóm chặn được phản hồi dưới hai giờ và đề nghị tuyển thêm người được hoãn lại một quý. Cái thay đổi không phải khối lượng, mà là thứ tự.',
    comparison: [
      {
        weak: 'Xếp thứ tự theo người vừa hỏi to nhất hoặc nhắn gần nhất; ai gửi tin sau cùng thì việc đó lên đầu.',
        mature:
          'Xếp theo hậu quả nếu chậm và người chịu hậu quả. Khi bị thúc, bạn đưa bảng ra và hỏi lại: "việc này nên đứng trên việc nào trong ba việc đang chạy?"',
      },
      {
        weak: 'Gắn nhãn ưu tiên cao cho mười lăm việc để tránh phải làm động tác loại bỏ khó chịu.',
        mature:
          'Ép giới hạn cứng: tối đa ba việc ở mức cao tại một thời điểm. Muốn thêm một việc vào nhóm cao thì phải có một việc rời khỏi nhóm đó, có tên cụ thể và có người được báo.',
      },
      {
        weak: 'Ưu tiên xong thì giữ trong đầu, không nói với ai, rồi ngạc nhiên khi bị trách là bỏ bê việc của phòng khác.',
        mature:
          'Công bố ưu tiên bằng một tin nhắn ngắn đầu tuần: đang làm ba việc gì, hoãn hai việc gì, ngày xem lại việc bị hoãn là bao giờ — đủ để người khác tự điều chỉnh kỳ vọng.',
      },
    ],
    mistakes: [
      'Nhầm khẩn với quan trọng: mọi thứ có tiếng chuông đều được xử lý trước, nên nhóm quan trọng nhưng không khẩn — dựng quy trình, viết tài liệu, học kỹ năng mới — không bao giờ được bắt đầu, năm này qua năm khác.',
      'Ưu tiên theo công sức thay vì theo giá trị: chọn việc dễ làm trước cho danh sách ngắn lại nhanh, rồi cuối tuần nhìn lại thấy đã xong mười bốn việc nhỏ trong khi việc quyết định kết quả quý vẫn ở vạch xuất phát.',
      'Quên rằng ưu tiên có hạn dùng: vẫn bám danh sách xếp từ đầu quý dù khách hàng lớn nhất đã đổi yêu cầu từ tháng trước. Ưu tiên phải được xem lại theo nhịp cố định, không phải xếp một lần rồi thôi.',
    ],
    worksheet: [
      'Viết tất cả việc đang mở ra một danh sách phẳng và đếm số mục. Nếu quá hai mươi lăm, bạn đang cố ưu tiên trong tình trạng không nhìn thấy hết — thứ gì hay bị bỏ sót nhất?',
      'Với ba việc đứng đầu danh sách, viết câu "nếu lùi một tuần thì..." cho từng việc. Câu nào bạn không viết nổi hậu quả cụ thể?',
      'Việc nào trong danh sách bạn còn giữ chỉ vì đã lỡ bắt đầu, chứ không vì giá trị còn lại của nó?',
      'Trong tuần vừa rồi, ai thực tế đã quyết định thứ tự công việc của bạn? Nếu người đó không phải bạn, cơ chế nào đã cho phép điều đó xảy ra?',
      'Chọn đúng ba việc cho tuần tới và viết tên hai việc bạn chính thức hoãn, kèm ngày xem lại và tên người bạn sẽ báo.',
    ],
    exercises: [
      {
        label: 'Danh sách phẳng 15 phút',
        text: 'Đặt hẹn giờ 15 phút, gom mọi việc đang mở từ email, tin nhắn, sổ tay và trí nhớ về một danh sách duy nhất. Không phân loại, không sửa câu chữ. Đếm số mục và ghi lại cảm giác trước và sau khi nhìn thấy toàn bộ.',
        level: 'e',
      },
      {
        label: 'Mười câu hậu quả',
        text: 'Lấy mười việc bất kỳ trong danh sách, viết cho mỗi việc một câu hậu quả nếu chậm một tuần. Khoanh những việc bạn phải nghĩ mãi mới ra hậu quả — đó là những ứng viên đầu tiên để bỏ hoặc chuyển cho người khác.',
        level: 'e',
      },
      {
        label: 'Bốn ô Eisenhower',
        text: 'Xếp mười việc đó vào ma trận khẩn × quan trọng. Đếm số việc rơi vào ô quan trọng nhưng không khẩn, và ghi lại lần gần nhất bạn dành trọn một khối thời gian cho ô này là khi nào.',
        level: 'e',
      },
      {
        label: 'Giá trị trên mỗi giờ',
        text: 'Chấm giá trị từ 1 đến 5 và công sức S/M/L cho mười hai việc, rồi sắp lại theo tỷ lệ giá trị chia công sức. So thứ tự mới với thứ tự bạn đang thực sự làm và giải thích ba chỗ lệch lớn nhất.',
        level: 'm',
      },
      {
        label: 'Quy tắc ba chỗ',
        text: 'Dựng một bảng chỉ có ba ô "đang làm". Trong hai tuần, mỗi lần muốn thêm việc vào bảng, bạn phải viết ra tên việc bị đẩy khỏi bảng. Cuối kỳ đếm số lần phải đẩy và xem việc nào bị đẩy nhiều nhất — đó là việc bạn nói là quan trọng nhưng luôn nhường chỗ.',
        level: 'm',
      },
      {
        label: 'Tin nhắn công bố ưu tiên',
        text: 'Soạn tin nhắn năm dòng gửi sếp hoặc nhóm vào sáng thứ Hai: ba việc tuần này, hai việc hoãn, ngày xem lại, và một câu xin xác nhận thứ tự. Gửi thật và lưu lại phản hồi để so với giả định ban đầu của bạn.',
        level: 'm',
      },
      {
        label: 'Phân loại một hàng đợi thật',
        text: 'Chọn một hàng đợi thật bạn đang gánh (yêu cầu hỗ trợ, đơn hàng, đề nghị nội bộ, bài tập). Phân loại theo hậu quả nếu chậm thành bốn nhóm, tính tỷ lệ từng nhóm, rồi đề xuất một thay đổi quy trình cho nhóm đông nhất mà hậu quả thấp nhất.',
        level: 'h',
      },
      {
        label: 'Phiên đàm phán thứ tự',
        text: 'Khi hai bên cùng đòi bạn làm trước, tổ chức một cuộc trao đổi mười lăm phút có mặt cả hai, mang theo bảng hậu quả và lịch khả dụng, để họ chọn thứ tự trước mặt nhau. Ghi lại quyết định bằng văn bản ngay sau đó và gửi cho cả hai.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao ma trận khẩn/quan trọng rất hay bị dùng sai?',
        a: 'Vì phần lớn người dùng nó để phân loại một lần rồi vẫn tiếp tục làm theo tiếng chuông. Ma trận chỉ có tác dụng khi đi kèm hai luật vận hành: ô quan trọng-không khẩn phải có chỗ cố định trong lịch tuần, và mọi việc rơi vào ô khẩn-không quan trọng phải được truy nguyên xem vì sao nó lại đến tay bạn ngay từ đầu.',
      },
      {
        q: 'Sếp giao thêm một việc gấp trong khi bạn đã có ba việc ưu tiên cao. Phản hồi thế nào để giữ được cả quan hệ lẫn thứ tự?',
        a: 'Không từ chối, cũng không im lặng nhận. Trình bày ba việc đang chạy kèm hạn của chúng, nói rõ việc mới cần bao nhiêu giờ, rồi đề nghị sếp chọn việc bị lùi. Quyết định vẫn thuộc về sếp, nhưng nay là quyết định có thông tin, và bạn không đơn phương gánh rủi ro trễ hạn của cả bốn việc.',
      },
      {
        q: 'Làm sao biết một danh sách đã thật sự được ưu tiên chứ không chỉ được tô màu?',
        a: 'Kiểm hai dấu hiệu. Một, có ít nhất một việc bị hạ xuống kèm ngày xem lại cụ thể. Hai, người liên quan đến việc bị hạ đã biết chuyện đó. Nếu không ai mất gì và không ai được báo, bạn mới chỉ sắp xếp lại giao diện của danh sách.',
      },
    ],
    plan7:
      'Ngày 1: gom toàn bộ việc đang mở về một danh sách phẳng, đếm số mục. Ngày 2: viết câu hậu quả nếu chậm một tuần cho mười lăm mục lớn nhất. Ngày 3: chấm công sức S/M/L và sắp theo tỷ lệ giá trị trên công sức. Ngày 4: xếp vào bốn ô Eisenhower, đặt một khối cố định cho ô quan trọng-không khẩn. Ngày 5: chốt ba việc của tuần và soạn tin nhắn công bố kèm hai việc hoãn. Ngày 6: gửi tin nhắn, ghi lại phản hồi và điều chỉnh thứ tự nếu người khác có thông tin bạn thiếu. Ngày 7: rà lại bốn ngày vừa qua, đếm số lần bạn làm việc ngoài top ba và tìm nguyên nhân chung.',
    evidence:
      'Chuyển việc ưu tiên thành một hiện vật xem được: bảng phân loại một hàng đợi thật, kèm cột hậu quả nếu chậm, tỷ lệ mỗi nhóm trước và sau khi bạn đổi quy trình. Trong phỏng vấn, đây là chất liệu cho câu trả lời STAR mạnh nhất về ưu tiên — bạn nêu được tiêu chí, con số, và cả cái giá đã trả (nhóm nào bị chấp nhận chậm và bạn báo cho ai). Nếu công việc của bạn không có hàng đợi rõ ràng, hãy giữ lại chuỗi tin nhắn công bố ưu tiên hàng tuần trong ba tháng: nó chứng minh bạn quen làm việc minh bạch về đánh đổi, thứ mà cấp quản lý nào cũng thiếu người làm được.',
    references: [
      { label: 'Asana Resources — hướng dẫn về ma trận Eisenhower', url: 'https://asana.com/resources/eisenhower-matrix', type: 'article', needsReview: true },
      { label: 'Harvard Business Review — chuyên mục Managing yourself', url: 'https://hbr.org/topic/subject/managing-yourself', type: 'article' },
    ],
  }),

  // ── Chương 3 · Lập kế hoạch ngày, tuần, tháng và quý ──────────────────────
  guide({
    thesis:
      'Kế hoạch tốt không phải kế hoạch chi tiết nhất, mà là kế hoạch có bốn nhịp lồng vào nhau và mỗi nhịp trả lời đúng một câu hỏi khác nhau: quý hỏi "kết quả nào đáng đánh đổi", tháng hỏi "mốc bàn giao nào chứng minh ta đang tiến", tuần hỏi "cam kết nào có chỗ trong lịch", ngày hỏi "khối đầu tiên làm gì". Sai lầm phổ biến nhất là để một nhịp làm việc của nhịp khác — lên kế hoạch quý chi tiết theo giờ, hoặc chỉ lập kế hoạch ngày rồi tự hỏi vì sao ba tháng trôi qua mà không có gì lớn hoàn thành.',
    why: {
      work:
        'Khi có bốn nhịp, mỗi lần bị việc bất ngờ chen ngang bạn biết chính xác mình đang hy sinh mốc nào ở tháng nào, nên phần đàm phán với sếp hoặc khách hàng dựa trên hậu quả cụ thể chứ không dựa trên cảm giác "em đang rất bận".',
      interview:
        'Nhiều vị trí hỏi "bạn lập kế hoạch cho một quý như thế nào". Người trả lời tốt phân biệt được kết quả (điều thay đổi ngoài thực tế) với hoạt động (điều bạn làm), và nêu được cách họ xử lý khi giữa quý thị trường hoặc ưu tiên công ty đổi.',
      study:
        'Một chứng chỉ hay một môn khó chỉ hoàn thành được nếu chia thành mốc tháng có bài kiểm tra thật; kế hoạch chỉ ghi "học 1 tiếng mỗi ngày" không cho bạn biết đến tháng thứ hai mình đang đi đúng hay đã lệch.',
      life:
        'Những việc lớn của đời sống — sửa nhà, tiết kiệm cho một mục tiêu, chuẩn bị cho con vào lớp một, chăm sức khỏe — đều cần nhịp quý và tháng, vì chúng không đủ gấp để lọt vào kế hoạch ngày nhưng lại đủ lớn để hối tiếc nếu bỏ trôi.',
    },
    framework: [
      {
        name: 'Quý: chọn ba kết quả',
        detail:
          'Viết đúng ba kết quả có thể kiểm chứng vào cuối quý, mỗi kết quả nêu điều gì thay đổi ngoài thực tế chứ không phải bạn đã làm gì. Ba là con số ép bạn từ chối; danh sách bảy kết quả quý gần như luôn kết thúc bằng bảy thứ dở dang.',
      },
      {
        name: 'Tháng: cắt thành mốc bàn giao',
        detail:
          'Mỗi kết quả quý được cắt thành hai đến ba mốc theo tháng, mỗi mốc là một thứ đưa cho người khác xem được: bản nháp, bản chạy thử, số liệu đầu tiên. Mốc không bàn giao được thì không kiểm chứng được tiến độ.',
      },
      {
        name: 'Tuần: đổi mốc thành cam kết có chỗ',
        detail:
          'Đầu tuần lấy mốc tháng gần nhất, tách thành ba đến năm cam kết cụ thể, rồi đặt chúng vào các khối trong lịch. Cam kết không có khối thời gian tương ứng chỉ là nguyện vọng.',
      },
      {
        name: 'Ngày: chốt ba việc, mở bằng việc khó',
        detail:
          'Tối hôm trước hoặc đầu giờ sáng, chốt ba việc của ngày và xếp việc khó nhất vào khối đầu tiên. Danh sách ngày dài hơn ba việc quan trọng sẽ tự động biến thành danh sách việc dễ.',
      },
      {
        name: 'Rà theo bốn nhịp',
        detail:
          'Ngày 5 phút, tuần 30 phút, tháng 60 phút, quý nửa ngày. Mỗi lần rà đều hỏi ba câu giống nhau nhưng ở độ phóng khác nhau: cái gì đã xong, cái gì lệch, cái gì phải bỏ để phần còn lại sống sót.',
      },
    ],
    scenario:
      'Chủ một tiệm bánh có hai điểm bán ở Hà Nội luôn ở trạng thái chữa cháy: hết nguyên liệu giữa ca, nhân viên nghỉ đột xuất, khách đặt tiệc báo sát ngày. Chị lập kế hoạch theo ngày rất chăm, nhưng hết năm nhìn lại thì cửa hàng vẫn y như năm trước. Chị dựng bốn nhịp. Quý bốn chị chọn ba kết quả: doanh thu đặt tiệc chiếm ít nhất một phần tư tổng doanh thu, có một quản lý ca tự chốt được cuối ngày mà không cần gọi chị, và định mức nguyên liệu cho mười món bán chạy được viết thành bảng. Tháng đầu chị cắt ra ba mốc bàn giao: bảng định mức cho ba món trước, một mẫu hợp đồng đặt tiệc, và danh sách năm ứng viên quản lý ca. Mỗi thứ Hai chị dành nửa tiếng đổi mốc tháng thành cam kết tuần và đặt hai khối sáng thứ Ba, thứ Năm — hai buổi tiệm vắng nhất — làm giờ không đứng quầy. Cuối quý, hai trong ba kết quả đạt, kết quả về quản lý ca không đạt vì hai ứng viên nghỉ sau hai tuần. Điều quan trọng là chị biết chính xác nó hỏng ở khâu nào (không có quy trình bàn giao ca để người mới bám vào) nên quý sau chị đặt lại mốc từ chỗ đó thay vì lại đi tuyển tiếp.',
    comparison: [
      {
        weak: 'Lập kế hoạch quý bằng một danh sách mười lăm việc muốn làm, không xếp hạng và không ai xác nhận.',
        mature:
          'Lập kế hoạch quý bằng ba kết quả kiểm chứng được cùng câu trả lời cho "nếu chỉ đạt một trong ba thì tôi muốn đó là cái nào".',
      },
      {
        weak: 'Chỉ có nhịp ngày: mỗi sáng viết to-do list và chạy hết ngày, không có mốc tháng nào để biết mình đang tiến hay đứng yên.',
        mature:
          'Có bốn nhịp lồng nhau, mỗi nhịp có buổi rà riêng, nên việc lệch được phát hiện ở tuần thứ hai thay vì ở tuần thứ mười một.',
      },
      {
        weak: 'Coi kế hoạch là lời hứa với bản thân, nên khi lệch thì cảm thấy có lỗi và tránh nhìn lại nó.',
        mature:
          'Coi kế hoạch là giả thuyết về tương lai, nên khi lệch thì ngồi xuống sửa giả thuyết: ước lượng sai, ưu tiên đổi, hay nguồn lực không có như dự tính.',
      },
    ],
    mistakes: [
      'Viết kết quả quý bằng ngôn ngữ hoạt động ("tăng cường marketing", "cải thiện quy trình") nên đến cuối quý không ai nói được là đã đạt hay chưa; hãy viết bằng thứ đo được hoặc bằng một hiện vật cụ thể phải tồn tại.',
      'Lên kế hoạch cho một tuần không có gì bất ngờ, rồi khi thực tế chen vào thì bỏ luôn cả kế hoạch thay vì cắt bớt phạm vi và giữ mốc.',
      'Bỏ buổi rà quý vì "đang bận" — trong khi đó là buổi duy nhất trong ba tháng bạn được phép đặt câu hỏi mình có đang leo đúng cái thang hay không, và cũng là buổi rẻ nhất để hủy một hướng đi sai.',
    ],
    worksheet: [
      'Viết ba kết quả bạn muốn có vào cuối quý này, mỗi kết quả bằng một câu mô tả điều thay đổi ngoài thực tế. Câu nào bạn không biết sẽ kiểm chứng bằng gì?',
      'Với kết quả quan trọng nhất, hai đến ba mốc bàn giao theo tháng là gì, và mỗi mốc bạn sẽ đưa cho ai xem?',
      'Nhìn lại lịch bốn tuần vừa qua: mỗi tuần có bao nhiêu giờ thực sự dành cho kết quả quý, không tính họp và việc phản ứng?',
      'Buổi rà nào trong bốn nhịp (ngày, tuần, tháng, quý) bạn đang không có? Lý do thật sự khiến nó chưa tồn tại là gì?',
      'Nếu giữa quý bạn buộc phải bỏ một trong ba kết quả, bạn bỏ cái nào, và dấu hiệu nào cho biết đã đến lúc phải bỏ?',
    ],
    exercises: [
      {
        label: 'Ba kết quả quý',
        text: 'Viết mười thứ bạn muốn hoàn thành quý này, rồi ép xuống còn ba bằng cách so từng cặp. Với ba cái còn lại, viết cách kiểm chứng vào ngày cuối quý — số liệu nào, hiện vật nào, ai xác nhận.',
        level: 'e',
      },
      {
        label: 'Cắt mốc theo tháng',
        text: 'Lấy kết quả quý quan trọng nhất và cắt thành các mốc tháng, mỗi mốc là một thứ bàn giao được. Đặt tên mốc bằng danh từ ("bản nháp quy trình bàn giao ca") chứ không bằng động từ ("làm quy trình").',
        level: 'e',
      },
      {
        label: 'Nửa tiếng thứ Hai',
        text: 'Đặt lịch định kỳ nửa tiếng vào sáng thứ Hai để đổi mốc tháng thành ba đến năm cam kết tuần và đặt chúng vào lịch. Chạy bốn tuần liên tiếp và ghi lại tuần nào bạn bỏ buổi này cùng hậu quả của nó.',
        level: 'e',
      },
      {
        label: 'Kế hoạch ngày ba dòng',
        text: 'Trong mười ngày làm việc, tối hôm trước viết đúng ba việc cho hôm sau và đánh dấu việc khó nhất. Sáng hôm sau bắt đầu bằng việc đó. Cuối kỳ đếm số ngày bạn thật sự bắt đầu bằng việc khó.',
        level: 'm',
      },
      {
        label: 'Buổi rà tháng',
        text: 'Dành 60 phút cuối tháng trả lời ba câu: mốc nào đã xong, mốc nào lệch và lệch bao nhiêu ngày, điều gì phải bỏ để phần còn lại sống sót. Viết ra và giữ lại — đến cuối quý bạn sẽ có ba bản để so.',
        level: 'm',
      },
      {
        label: 'Kế hoạch chịu được cú sốc',
        text: 'Lấy kế hoạch tuần hiện tại và giả định mất hai ngày vì việc bất ngờ. Viết phiên bản rút gọn giữ được mốc tháng: cắt phạm vi gì, hoãn gì, báo cho ai. Cất sẵn phiên bản này để dùng khi cú sốc xảy ra thật.',
        level: 'm',
      },
      {
        label: 'Chạy trọn một chu kỳ tháng',
        text: 'Chạy đủ bốn nhịp trong một tháng: rà ngày mỗi tối, rà tuần mỗi thứ Sáu, rà tháng cuối tháng. Cuối tháng viết hai trang: tỷ lệ cam kết tuần hoàn thành, ba nguyên nhân lệch lớn nhất, và một thay đổi cho tháng sau.',
        level: 'h',
      },
      {
        label: 'Phiên hoạch định quý nửa ngày',
        text: 'Dành nửa ngày làm phiên quý gồm bốn phần: nhìn lại quý cũ bằng số liệu, chọn ba kết quả mới, cắt mốc tháng, và viết ra ba thứ bạn cố ý không làm trong quý này. Chia sẻ phần cuối cho một người sẽ nhắc bạn khi bạn định làm chúng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao chỉ lập kế hoạch ngày là không đủ, dù bạn làm rất đều?',
        a: 'Vì kế hoạch ngày tối ưu cho việc trước mắt và luôn ưu ái việc có tiếng chuông. Không có nhịp tháng và quý thì không có chỗ nào đặt câu hỏi "việc này có phục vụ kết quả nào không", nên bạn có thể chạy đúng ba trăm ngày rất kỷ luật mà cuối năm không có gì lớn hoàn thành.',
      },
      {
        q: 'Kết quả quý viết thế nào để cuối quý không tranh cãi được là đạt hay không?',
        a: 'Viết bằng thay đổi ngoài thực tế kèm cách kiểm chứng: một con số có nguồn (doanh thu nhóm nào, tỷ lệ nào), hoặc một hiện vật phải tồn tại và được ai đó xác nhận (bảng định mức đã dùng trong bếp, quy trình đã có người chạy theo). Tránh động từ mơ hồ như tăng cường, cải thiện, đẩy mạnh.',
      },
      {
        q: 'Giữa quý, ưu tiên của công ty đổi khiến một kết quả quý của bạn không còn ý nghĩa. Làm gì?',
        a: 'Hủy nó một cách công khai chứ đừng để nó chết âm thầm: ghi lý do hủy, phần công sức đã bỏ ra và thứ học được, rồi thông báo cho người liên quan. Sau đó quyết định thay bằng kết quả mới hay dồn lực cho hai kết quả còn lại. Kế hoạch là giả thuyết; sửa giả thuyết khi có dữ liệu mới là dấu hiệu tốt, không phải thất bại.',
      },
    ],
    plan7:
      'Ngày 1: nhìn lại quý vừa qua bằng số liệu và hiện vật, không bằng trí nhớ. Ngày 2: viết mười ứng viên kết quả rồi ép xuống ba, kèm cách kiểm chứng. Ngày 3: cắt kết quả quan trọng nhất thành mốc theo tháng, đặt tên bằng danh từ. Ngày 4: đặt lịch định kỳ cho bốn buổi rà và mời người liên quan nếu cần. Ngày 5: đổi mốc tháng gần nhất thành cam kết tuần và đặt vào lịch. Ngày 6: viết phiên bản kế hoạch rút gọn dùng khi mất hai ngày vì việc bất ngờ. Ngày 7: viết ba thứ bạn cố ý không làm quý này và gửi cho một người sẽ nhắc bạn.',
    evidence:
      'Bộ hiện vật mạnh nhất của chương này là ba bản rà tháng liên tiếp cộng một bản tổng kết quý, trong đó thấy rõ mốc nào đạt, mốc nào lệch, và bạn đã cắt phạm vi ở đâu để giữ được cam kết quan trọng. Trong phỏng vấn vị trí có yếu tố tự chủ (quản lý, chủ doanh nghiệp, freelancer, trưởng nhóm), bộ này trả lời được câu hỏi khó nhất: bạn xử lý thế nào khi kế hoạch không diễn ra như dự tính. Trong hồ sơ cá nhân, một trang tổng kết quý có số liệu và có phần "điều tôi đã hủy và vì sao" cho thấy bạn phân biệt được kỷ luật với cố chấp.',
    references: [
      { label: 'James Clear — Goal setting: cách đặt và theo đuổi mục tiêu', url: 'https://jamesclear.com/goal-setting', type: 'article' },
      { label: 'Asana Resources — thư viện bài viết về lập kế hoạch và quản lý công việc', url: 'https://asana.com/resources', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 4 · Time Blocking ──────────────────────────────────────────────
  guide({
    thesis:
      'Time blocking là chuyển từ câu hỏi "hôm nay tôi phải làm những gì" sang câu hỏi "mỗi giờ hôm nay dùng cho việc gì", bằng cách gán trước từng khoảng thời gian cho một việc cụ thể. Giá trị của nó không nằm ở chỗ bạn tuân thủ lịch chính xác đến từng phút — điều đó gần như không bao giờ xảy ra — mà ở chỗ nó buộc bạn đối mặt với sự thật số học: danh sách việc của bạn cần bao nhiêu giờ, và bạn thật sự có bao nhiêu giờ.',
    why: {
      work:
        'Khi việc đã có khối cụ thể, câu trả lời cho lời mời họp không còn là cảm tính mà là một phép so: cuộc họp này đáng giá hơn hay kém hơn khối đang chiếm chỗ đó. Đây cũng là cách duy nhất để việc sâu tồn tại được trong một lịch nhiều họp.',
      interview:
        'Với các vị trí làm việc từ xa hoặc tự chủ cao, nhà tuyển dụng muốn biết bạn tự cấu trúc ngày làm việc ra sao khi không ai đứng sau lưng. Mô tả được cách chia khối, cách xử lý khi khối bị vỡ, và cách đối chiếu cuối ngày là câu trả lời cụ thể hơn hẳn lời hứa "em rất tự giác".',
      study:
        'Việc học cần khối liên tục để đi qua giai đoạn khó chịu ban đầu. Ba lần hai mươi phút rải rác trong ngày hiếm khi tương đương một khối sáu mươi phút, vì mỗi lần bắt đầu lại phải trả một khoản phí khởi động.',
      life:
        'Đặt khối cho những việc không ai nhắc — tập thể dục, gọi cho bố mẹ, học cùng con — là cách biến ý định thành một cuộc hẹn mà bạn phải chủ động hủy nếu muốn bỏ, và việc phải chủ động hủy đã đủ để cứu nhiều buổi.',
    },
    framework: [
      {
        name: 'Phân bốn loại khối',
        detail:
          'Chia ngày thành bốn loại: khối sâu (một việc, không gián đoạn), khối hành chính (gom email, duyệt, trả lời), khối đệm (dành cho việc bất ngờ), khối hồi phục (ăn, đi lại, nghỉ thật sự). Không phân loại thì mọi khối đều trở thành khối hành chính.',
      },
      {
        name: 'Ghép khối với đường năng lượng',
        detail:
          'Xác định hai đến ba giờ tỉnh táo nhất trong ngày của bạn bằng quan sát một tuần, rồi đặt khối sâu vào đó và đẩy khối hành chính sang giờ tụt năng lượng. Đặt việc khó vào giờ mệt là cách chắc chắn nhất để kết luận nhầm rằng mình không làm nổi việc đó.',
      },
      {
        name: 'Đặt tên khối bằng kết quả',
        detail:
          'Viết tên khối là thứ sẽ tồn tại khi khối kết thúc — "xong ba mục đầu của giáo án Unit 5" — chứ không phải chủ đề như "soạn bài". Tên bằng kết quả cho bạn một tiêu chí dừng rõ ràng và ngăn khối tự nở ra.',
      },
      {
        name: 'Chừa đệm và cho phép lịch dịch',
        detail:
          'Để trống khoảng một phần năm ngày làm khối đệm và chấp nhận rằng lịch sẽ dịch. Time blocking không phải hợp đồng; đó là một dự toán được sửa lại nhiều lần trong ngày.',
      },
      {
        name: 'Đóng khối bằng một nghi thức ngắn',
        detail:
          'Cuối mỗi khối sâu, dành hai phút ghi: đã xong đến đâu, bước tiếp theo là gì, chỗ nào bị vướng. Nghi thức này giúp lần vào khối sau không mất mười lăm phút để nhớ lại mình đang ở đâu.',
      },
      {
        name: 'Đối chiếu dự kiến với thực tế',
        detail:
          'Cuối ngày, so lịch dự kiến với lịch thực tế và ghi độ lệch của từng khối. Sau hai tuần bạn sẽ có hệ số cá nhân — thường là bạn cần nhiều hơn dự kiến một tỷ lệ khá ổn định — và từ đó lập lịch sát hơn.',
      },
    ],
    scenario:
      'Một giáo viên tiếng Anh dạy thêm ngoài giờ nhận mười hai học viên luyện thi, dạy chủ yếu buổi tối và cuối tuần, còn ban ngày thì "tự do". Thực tế ban ngày của cô bị nuốt sạch bởi việc trả lời tin nhắn học viên, tìm tài liệu và chấm bài rải rác, nên giáo án cho khóa mới bị dời tám tuần liên tiếp. Cô chuyển sang chia khối: 8h30-10h00 khối sâu duy nhất trong ngày dành cho biên soạn, tên khối luôn viết bằng kết quả ("xong phần nghe của buổi 3"); 10h15-11h00 khối hành chính gom toàn bộ tin nhắn học viên và trả lời một lượt, kèm một tin nhắn tự động báo giờ phản hồi; 14h00-15h30 khối chấm bài theo lô; chiều để một khối đệm 60 phút trống hẳn. Tuần đầu cô vỡ khối sâu ba lần vì học viên gọi gấp. Cô không bỏ hệ thống mà đổi một chi tiết: chuyển điện thoại sang chế độ chỉ nhận cuộc gọi từ danh sách ưu tiên trong khối sâu, và thông báo khung giờ phản hồi trong nhóm chat. Sau sáu tuần, giáo án khóa mới hoàn thành và cô phát hiện một điều bất ngờ khi đối chiếu lịch: mỗi buổi biên soạn thực tế cần khoảng gấp rưỡi thời gian cô vẫn dự tính, nên cô lập lịch lại theo hệ số đó thay vì tự trách mình chậm.',
    comparison: [
      {
        weak: 'Chia khối kín đặc từ 8 giờ đến 18 giờ, không chừa chỗ trống nào, rồi bỏ toàn bộ lịch khi có một việc bất ngờ làm đổ domino.',
        mature:
          'Chừa khoảng một phần năm ngày làm khối đệm, và khi có việc bất ngờ thì dịch khối chứ không hủy hệ thống; cuối ngày ghi lại việc bất ngờ đó thuộc loại nào để lần sau dự trù đúng hơn.',
      },
      {
        weak: 'Đặt tên khối theo chủ đề: "làm dự án", "học", "viết" — nên khối trôi qua mà không rõ đã xong cái gì.',
        mature:
          'Đặt tên khối theo kết quả bàn giao được, nhờ đó bạn có tiêu chí dừng và có thể trả lời được câu hỏi khối này thành công hay không.',
      },
      {
        weak: 'Xếp việc khó vào cuối chiều vì buổi sáng bận họp, rồi kết luận rằng mình không có khả năng làm việc sâu.',
        mature:
          'Quan sát đường năng lượng một tuần, giành lấy hai giờ tỉnh táo nhất cho khối sâu và chủ động đề nghị dời họp ra khỏi khung đó, kể cả khi phải thương lượng.',
      },
    ],
    mistakes: [
      'Coi lịch khối là cam kết đạo đức: lệch ba mươi phút thì thấy mình thất bại rồi bỏ cả tuần. Lịch khối là dự toán, và dự toán được sửa là chuyện bình thường trong mọi ngành.',
      'Chia khối quá nhỏ, mười lăm đến hai mươi phút cho việc cần suy nghĩ, nên phần lớn thời gian bị tiêu vào phí khởi động và không khối nào đủ dài để tạo ra kết quả.',
      'Chỉ chia khối cho công việc mà không chia cho ăn, đi lại và nghỉ, nên lịch trông rất đẹp trên màn hình nhưng không thể xảy ra trong đời thật, và mọi khối đều bắt đầu muộn từ khối thứ hai trở đi.',
    ],
    worksheet: [
      'Hôm qua bạn mất bao nhiêu phút cho việc di chuyển, ăn trưa và chuyển tiếp giữa các việc? Những phút đó có xuất hiện trong lịch không, hay lịch của bạn ngầm coi chúng bằng không?',
      'Lịch hôm qua của bạn có bao nhiêu phần trăm là khối sâu, khối hành chính, khối đệm, khối hồi phục? Nhóm nào bằng không?',
      'Ba tên khối gần nhất bạn đã viết là gì? Viết lại chúng bằng kết quả bàn giao được thay vì bằng chủ đề.',
      'Việc bất ngờ nào hay làm vỡ khối của bạn nhất, và nó đến qua kênh nào (điện thoại, chat nhóm, người ghé bàn)?',
      'Nếu phải bảo vệ một khối duy nhất trong tuần tới bằng mọi giá, đó là khối nào, và bạn sẽ nói gì với người xin họp chồng lên nó?',
    ],
    exercises: [
      {
        label: 'Bản đồ năng lượng bảy ngày',
        text: 'Trong bảy ngày, ghi điểm tỉnh táo từ 1 đến 5 vào ba mốc: 9h, 14h, 20h. Cuối tuần vẽ đường trung bình và khoanh hai giờ cao nhất — đó là khung bạn phải giành cho khối sâu.',
        level: 'e',
      },
      {
        label: 'Bốn màu một ngày',
        text: 'Tô lịch hôm qua bằng bốn màu tương ứng bốn loại khối. Tính tỷ lệ từng màu và ghi ra loại khối nào đang bị nuốt bởi loại khác.',
        level: 'e',
      },
      {
        label: 'Đổi tên khối',
        text: 'Lấy năm khối trong lịch tuần này và viết lại tên bằng kết quả cụ thể có thể nhìn thấy khi khối kết thúc. So cảm giác khi bắt đầu khối với tên cũ và tên mới.',
        level: 'e',
      },
      {
        label: 'Một khối sâu mỗi ngày',
        text: 'Trong mười ngày làm việc, đặt đúng một khối sâu 90 phút vào giờ tỉnh táo nhất và bảo vệ nó. Ghi mỗi ngày một dòng: giữ được hay không, nếu không thì thứ gì đã lấy mất nó.',
        level: 'm',
      },
      {
        label: 'Nghi thức đóng khối',
        text: 'Cuối mỗi khối sâu trong hai tuần, viết ba dòng: đã tới đâu, bước kế tiếp, chỗ đang vướng. Đến cuối kỳ, so thời gian cần để bắt nhịp lại ở đầu khối sau giữa những ngày có ghi và những ngày quên ghi.',
        level: 'm',
      },
      {
        label: 'Khối gom việc phản ứng',
        text: 'Gom toàn bộ email và tin nhắn công việc vào hai khối cố định trong ngày, tắt thông báo ngoài hai khối đó, và báo trước cho những người hay cần bạn gấp. Chạy một tuần, ghi số việc thật sự không thể chờ được — thường ít hơn bạn tưởng.',
        level: 'm',
      },
      {
        label: 'Hai tuần đo hệ số cá nhân',
        text: 'Với mọi khối, ghi thời gian dự kiến và thời gian thực tế. Sau hai tuần, tính tỷ lệ trung bình thực tế trên dự kiến theo từng loại việc. Lập lịch tuần kế tiếp bằng hệ số đó và xem tỷ lệ khối hoàn thành thay đổi thế nào.',
        level: 'h',
      },
      {
        label: 'Thiết kế lại một ngày điển hình',
        text: 'Chọn một ngày trong tuần bạn kiểm soát được nhiều nhất và thiết kế lại toàn bộ: khối sâu vào giờ đỉnh, khối hành chính vào giờ trũng, đệm 20%, khối hồi phục có tên. Chạy bản thiết kế đó bốn tuần liên tiếp, giữ nguyên khung, chỉ đổi nội dung, rồi viết một trang đánh giá.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Lịch khối của bạn vỡ ngay từ khối thứ hai gần như mỗi ngày. Nguyên nhân hay gặp nhất là gì?',
        a: 'Thường không phải do thiếu kỷ luật mà do lịch không có khối đệm và không tính thời gian chuyển tiếp: đi lại, ăn, xử lý dư âm cuộc họp trước. Thêm khối đệm, kéo giãn khoảng giữa các khối, và dùng hệ số thực tế trên dự kiến đo được từ chính bạn thay vì con số lạc quan.',
      },
      {
        q: 'Có phải càng chia nhỏ khối thì càng kiểm soát tốt thời gian không?',
        a: 'Không. Việc cần suy nghĩ có phí khởi động đáng kể, nên chia thành các khối mười lăm đến hai mươi phút khiến phần lớn thời gian bị tiêu vào việc bắt nhịp lại. Việc sâu cần khối đủ dài (thường 60-120 phút); chỉ việc hành chính mới hợp với khối ngắn và nên được gom lô.',
      },
      {
        q: 'Đồng nghiệp liên tục đặt họp chồng lên khối sâu của bạn. Xử lý thế nào mà không gây căng thẳng?',
        a: 'Đặt khối trong lịch chung với tên nêu kết quả chứ không để trống, công bố khung giờ bạn luôn rảnh để họp, và khi có lời mời chồng thì đề xuất hai khung thay thế thay vì từ chối suông. Cách này biến việc bảo vệ thời gian thành một đề nghị hợp tác, và phần lớn cuộc họp thật sự có thể dời được.',
      },
    ],
    plan7:
      'Ngày 1: ghi điểm tỉnh táo ba mốc trong ngày, chưa đổi lịch. Ngày 2: tiếp tục ghi và tô bốn màu cho lịch hôm trước. Ngày 3: xác định khung hai giờ đỉnh và đặt một khối sâu 90 phút cho ngày mai, đặt tên bằng kết quả. Ngày 4: chạy khối sâu đầu tiên, áp dụng nghi thức đóng khối ba dòng. Ngày 5: gom email và tin nhắn vào hai khối cố định, tắt thông báo ngoài khung đó. Ngày 6: thêm khối đệm 60 phút và khối hồi phục có tên vào lịch, chạy thử. Ngày 7: đối chiếu dự kiến với thực tế cả tuần, tính hệ số của bạn và lập lịch tuần sau theo hệ số đó.',
    evidence:
      'Hiện vật cụ thể của chương này là bảng đối chiếu dự kiến với thực tế trong hai tuần, kèm hệ số cá nhân bạn rút ra theo từng loại việc, và ảnh chụp lịch trước và sau khi thiết kế lại. Đây là câu trả lời rất mạnh cho phỏng vấn vị trí làm từ xa hoặc freelance: bạn không nói mình tự giác, bạn cho thấy mình đo được. Với người làm nghề tự do, bảng hệ số này còn dùng trực tiếp để báo giá và hẹn ngày giao — bạn nói được "phần biên soạn thường cần gấp rưỡi ước lượng ban đầu, nên tôi cộng sẵn vào lịch" thay vì hứa rồi xin lùi.',
    references: [
      { label: 'Cal Newport — trang chính thức về deep work và time blocking', url: 'https://calnewport.com/', type: 'article' },
      { label: 'Todoist — tổng hợp các phương pháp năng suất', url: 'https://todoist.com/productivity-methods', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 5 · Quản lý danh sách công việc ────────────────────────────────
  guide({
    thesis:
      'Danh sách công việc không phải chỗ chứa mong muốn, nó là bộ nhớ ngoài cho những cam kết bạn đã nhận. Một danh sách dùng được phải thỏa ba điều kiện: mọi thứ đã hứa đều nằm trong đó và không còn cái nào chỉ tồn tại trong đầu; mỗi dòng bắt đầu bằng một hành động kế tiếp làm được ngay; và có một buổi rà định kỳ để dòng đã chết được xóa. Thiếu điều kiện thứ ba, danh sách biến thành nghĩa địa, bạn ngừng tin nó, và bộ nhớ lại lặng lẽ quay về trong đầu — nơi nó gây lo lắng nhiều nhất và bảo quản kém nhất.',
    why: {
      work:
        'Người có danh sách đáng tin trả lời được ngay câu "việc em nhờ đang ở đâu rồi" bằng trạng thái cụ thể, thay vì bằng câu "để em kiểm tra lại" — và chính khả năng trả lời ngay đó tạo ra phần lớn uy tín nghề nghiệp trong các vai trò hỗ trợ, vận hành, hành chính.',
      interview:
        'Với vị trí phải giữ nhiều đầu việc nhỏ cho người khác (trợ lý, hành chính nhân sự, điều phối, chăm sóc khách hàng), câu hỏi thật sự là "làm sao anh chị đảm bảo không rơi việc". Mô tả được hệ thống thu thập một cửa và buổi rà tuần là câu trả lời có trọng lượng.',
      study:
        'Kỳ học nào cũng có hàng chục đầu việc nhỏ với hạn khác nhau. Một danh sách phân theo môn và theo ngữ cảnh giúp bạn không phải nhớ, và phần não được giải phóng đó dùng cho việc học thay vì cho việc lo lắng.',
      life:
        'Việc nhà, giấy tờ, lịch tiêm cho con, hạn đóng phí — những thứ không quan trọng nhưng phạt nặng nếu quên — cần một chỗ ở ngoài đầu. Đây là loại việc mà chi phí của một lần quên lớn hơn nhiều so với chi phí duy trì danh sách cả năm.',
    },
    framework: [
      {
        name: 'Một hộp thu duy nhất',
        detail:
          'Mọi đầu vào — email, tin nhắn, lời nhờ ngoài hành lang, ý nghĩ lúc đi đường — đều đi về đúng một chỗ. Nhiều hộp nghĩa là không hộp nào đáng tin, và mỗi lần muốn biết mình đang nợ gì bạn lại phải quét năm nơi rồi vẫn không chắc.',
      },
      {
        name: 'Làm rõ thành hành động kế tiếp',
        detail:
          'Đổi "báo cáo nhân sự" thành "hỏi chị Hoa số ngày nghỉ phép tháng 8 qua email". Dòng nào không viết nổi hành động kế tiếp thì đó là một dự án chứ chưa phải một việc, và cần một dòng khác đứng trước nó.',
      },
      {
        name: 'Gắn ngữ cảnh và người đang chờ',
        detail:
          'Ghi điều kiện để làm được (cần máy tính, cần gặp trực tiếp, cần ra ngoài) và ai đang chờ kết quả. Duy trì riêng một danh sách "đang chờ người khác" — đây là phần hay bị bỏ quên nhất và cũng là phần làm mất uy tín nhanh nhất khi im lặng.',
      },
      {
        name: 'Tách kho việc khỏi danh sách hôm nay',
        detail:
          'Kho chứa tất cả; danh sách hôm nay chỉ chứa những gì vừa với quỹ giờ thật của ngày. Nhìn cả kho mỗi lần ngồi vào bàn là cách nhanh nhất để tê liệt và quay sang làm việc dễ nhất trong tầm mắt.',
      },
      {
        name: 'Rà soát tuần ba mươi phút',
        detail:
          'Mỗi tuần: dọn hộp thu về rỗng, đọc lại toàn bộ kho, xóa việc đã chết, cập nhật danh sách chờ người khác, và kéo việc cho tuần tới. Đây là bước quyết định danh sách còn đáng tin hay không — bỏ nó thì hai tuần sau hệ thống tự sụp.',
      },
    ],
    scenario:
      'Một chuyên viên hành chính nhân sự ở công ty 120 người nhận yêu cầu từ sáu nguồn: email, tin nhắn riêng, ba nhóm chat phòng ban, phiếu giấy, và lời nhờ giữa hành lang. Chị ghi lại ở ba chỗ khác nhau — sổ tay, giấy nhớ dán màn hình, và thư nháp gửi cho chính mình. Trong một quý có hai lần hồ sơ bảo hiểm của nhân viên mới bị nộp muộn, cả hai lần đều là lời nhờ miệng không được ghi lại. Chị dựng một hệ thống rất đơn giản: một biểu mẫu nội bộ làm cửa duy nhất cho mọi yêu cầu, và luật riêng cho lời nhờ miệng là "em ghi vào biểu mẫu ngay bây giờ trước mặt anh chị". Mỗi dòng được viết lại thành hành động kế tiếp có động từ và tên người. Chị tách thêm một danh sách "đang chờ" cho những việc bị kẹt ở người khác, kèm ngày sẽ nhắc lại. Chiều thứ Sáu chị dành ba mươi phút dọn hộp thu về rỗng và đọc lại toàn bộ kho. Sau hai tháng, số việc bị rơi về không, và điều bất ngờ có ích nhất lại là danh sách "đang chờ": nó cho thấy trung bình mỗi tuần có khoảng mười việc của phòng chị bị kẹt ở phòng khác — dữ liệu này giúp chị đề xuất đổi quy trình duyệt thay vì tiếp tục bị coi là bên làm chậm.',
    comparison: [
      {
        weak: 'Viết dòng việc bằng danh từ hoặc chủ đề: "hợp đồng Minh Anh", "bảo hiểm", "báo cáo".',
        mature:
          'Viết bằng hành động kế tiếp cụ thể kèm người và kênh: "gửi bản hợp đồng đã sửa điều 4 cho anh Minh qua email, đính kèm phụ lục giá" — đọc là làm được ngay, không phải suy nghĩ lại từ đầu.',
      },
      {
        weak: 'Giữ mọi thứ trong một danh sách dài duy nhất và mỗi sáng đọc lại từ trên xuống, quyết định theo cảm giác.',
        mature:
          'Tách kho việc và danh sách hôm nay, đồng thời lọc theo ngữ cảnh: khi đang ở ngoài thì chỉ nhìn nhóm việc làm được ở ngoài, khi có hai mươi phút trống thì chỉ nhìn nhóm việc ngắn.',
      },
      {
        weak: 'Không theo dõi việc đã giao đi hoặc đang chờ người khác, rồi bị hỏi ngược lại đúng vào hôm đã quá hạn.',
        mature:
          'Có danh sách "đang chờ" ghi rõ chờ ai, từ ngày nào, hẹn nhắc ngày nào — và nhắc trước hạn chứ không nhắc sau khi đã hỏng.',
      },
    ],
    mistakes: [
      'Đổi công cụ theo mùa: mỗi quý chuyển sang một ứng dụng mới và thấy nhẹ nhõm vì danh sách mới trông sạch sẽ — nhưng cảm giác nhẹ đó đến từ chỗ nó chưa chứa hết cam kết cũ, chứ không phải từ việc bạn nợ ít đi.',
      'Trộn mong muốn xa với cam kết đã nhận trong cùng một danh sách, nên mỗi lần mở ra bạn phải đọc qua "học tiếng Nhật" và "đọc 20 cuốn sách" trước khi tới việc phải nộp trong hôm nay; hai loại này cần hai chỗ riêng.',
      'Bỏ buổi rà soát tuần vì tuần đó bận. Chỉ cần bỏ hai lần liên tiếp là danh sách mất đồng bộ với thực tế, bạn bắt đầu nhớ bằng đầu để bù, và toàn bộ hệ thống mất tác dụng trong lặng lẽ.',
    ],
    worksheet: [
      'Liệt kê mọi nơi hiện đang chứa việc của bạn (ứng dụng, sổ, giấy nhớ, hộp thư, tin nhắn ghim). Có bao nhiêu nơi? Nơi nào bạn thật sự mở mỗi ngày?',
      'Lấy mười dòng đầu trong danh sách hiện tại: bao nhiêu dòng đọc xong là làm được ngay, bao nhiêu dòng còn phải suy nghĩ mới biết bắt đầu từ đâu?',
      'Bạn đang chờ ai điều gì? Viết ra tất cả, kèm ngày bạn đã đề nghị và ngày bạn định nhắc lại.',
      'Lần gần nhất bạn để rơi một việc đã hứa là khi nào, và việc đó đã đi vào hệ thống của bạn qua kênh nào — hay chưa bao giờ vào?',
      'Ba mươi phút cố định trong tuần để rà soát nên đặt vào lúc nào của bạn, và điều gì sẽ khiến bạn hủy nó? Viết trước cách xử lý điều đó.',
    ],
    exercises: [
      {
        label: 'Đếm số hộp thu',
        text: 'Trong hai ngày, mỗi lần nhận một yêu cầu mới, ghi lại nó đến qua kênh nào. Cuối hai ngày đếm số kênh và số yêu cầu mỗi kênh. Chọn một kênh để dẹp hoặc chuyển hướng về cửa chung.',
        level: 'e',
      },
      {
        label: 'Viết lại thành động từ',
        text: 'Lấy hai mươi dòng trong danh sách hiện tại, viết lại tất cả thành hành động kế tiếp có động từ, đối tượng và kênh. Đánh dấu những dòng cần tách thành dự án nhiều bước.',
        level: 'e',
      },
      {
        label: 'Danh sách đang chờ',
        text: 'Dựng một danh sách riêng cho mọi việc đang kẹt ở người khác, mỗi dòng ghi: chờ ai, việc gì, từ ngày nào, nhắc lại ngày nào. Sau một tuần đếm số dòng và số ngày trung bình một việc nằm chờ.',
        level: 'e',
      },
      {
        label: 'Dọn hộp thu về rỗng',
        text: 'Dành 45 phút xử lý toàn bộ hộp thu về rỗng theo bốn cách duy nhất: làm ngay nếu dưới hai phút, đưa vào kho kèm hành động kế tiếp, giao cho người khác và ghi vào danh sách đang chờ, hoặc xóa. Ghi lại số mục mỗi loại.',
        level: 'm',
      },
      {
        label: 'Lọc theo ngữ cảnh',
        text: 'Gắn nhãn ngữ cảnh cho toàn bộ kho việc (cần máy tính, cần gọi điện, cần gặp trực tiếp, cần ra ngoài, việc dưới mười lăm phút). Trong một tuần, mỗi khi có khoảng trống bất ngờ thì mở đúng một nhãn phù hợp và làm. Đếm số việc dọn được nhờ cách này.',
        level: 'm',
      },
      {
        label: 'Danh sách hôm nay có trần',
        text: 'Mỗi sáng, kéo từ kho ra số việc vừa đúng quỹ giờ thật của ngày và không được thêm sau đó, trừ việc khẩn cấp thật. Chạy mười ngày, ghi số ngày bạn hoàn thành hết danh sách hôm nay và số lần phải phá luật.',
        level: 'm',
      },
      {
        label: 'Bốn tuần rà soát',
        text: 'Chạy buổi rà soát tuần bốn lần liên tiếp, mỗi lần theo cùng một trình tự và ghi ba con số: số mục trong hộp thu, số việc bị xóa vì đã chết, số việc trong danh sách đang chờ. Vẽ ba con số đó theo tuần và giải thích xu hướng.',
        level: 'h',
      },
      {
        label: 'Bàn giao được hệ thống',
        text: 'Viết một trang mô tả hệ thống danh sách của bạn đủ để người khác thay bạn trong hai tuần nghỉ phép: cửa nhận việc ở đâu, việc đang chờ ai, nhịp rà soát thế nào. Đưa cho một đồng nghiệp đọc và nhờ họ chỉ ra chỗ họ sẽ mắc kẹt.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao dòng việc viết bằng danh từ lại khiến bạn trì hoãn nhiều hơn?',
        a: 'Vì mỗi lần đọc nó bạn phải quyết định lại từ đầu là bắt đầu từ đâu, và bộ não có xu hướng né việc phải quyết định khi đang mệt. Một hành động kế tiếp cụ thể loại bỏ chi phí quyết định đó, nên khoảng cách từ lúc đọc tới lúc bắt tay ngắn hơn hẳn.',
      },
      {
        q: 'Danh sách của bạn đã phình lên hơn hai trăm mục và bạn ngại mở nó. Xử lý thế nào?',
        a: 'Không xóa sạch làm lại, vì bạn sẽ mất luôn các cam kết thật. Hãy tách ba nhóm: cam kết có người đang chờ (giữ và xử lý trước), việc chỉ mình bạn muốn làm (chuyển sang danh sách "một ngày nào đó"), và việc đã hết ý nghĩa (xóa, có ghi lý do). Sau đó khôi phục buổi rà soát tuần để tình trạng phình không lặp lại.',
      },
      {
        q: 'Tại sao cần danh sách "đang chờ" riêng, trong khi việc đó đã giao đi rồi?',
        a: 'Vì trách nhiệm về kết quả thường vẫn thuộc về bạn dù việc thực thi đã ở người khác. Danh sách đang chờ cho phép bạn nhắc trước hạn, phát hiện chỗ nghẽn lặp lại giữa các bộ phận, và trả lời được câu hỏi tiến độ mà không phải đi hỏi vòng quanh.',
      },
    ],
    plan7:
      'Ngày 1: đếm và ghi lại mọi nơi đang chứa việc của bạn. Ngày 2: chọn một cửa duy nhất và dồn toàn bộ về đó, chấp nhận danh sách trông đáng sợ trong một ngày. Ngày 3: viết lại tất cả thành hành động kế tiếp có động từ. Ngày 4: tách danh sách đang chờ và gắn ngày nhắc cho từng dòng. Ngày 5: gắn nhãn ngữ cảnh và tách kho khỏi danh sách hôm nay. Ngày 6: chạy một ngày chỉ làm theo danh sách hôm nay có trần, ghi lại số lần muốn phá luật. Ngày 7: chạy buổi rà soát tuần đầu tiên, ghi ba con số nền để tuần sau so sánh.',
    evidence:
      'Bằng chứng thuyết phục nhất ở đây là bản mô tả hệ thống một trang mà người khác có thể tiếp quản khi bạn nghỉ, cộng với ba đến bốn kỳ số liệu rà soát tuần (số mục hộp thu, số việc chết bị xóa, số việc đang chờ). Trong phỏng vấn các vị trí điều phối, hành chính, trợ lý, vận hành, hãy dùng bộ này để trả lời câu "làm sao chị đảm bảo không rơi việc" — và nếu danh sách đang chờ của bạn từng chỉ ra một điểm nghẽn liên phòng ban rồi dẫn tới thay đổi quy trình, đó là câu chuyện cho thấy bạn không chỉ giữ việc mà còn cải tiến hệ thống.',
    references: [
      { label: 'Getting Things Done — trang chính thức của phương pháp GTD (David Allen)', url: 'https://gettingthingsdone.com/', type: 'article' },
      { label: 'Todoist Inspiration — bài viết về cách tổ chức danh sách công việc', url: 'https://todoist.com/inspiration', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 6 · Làm việc sâu — Deep Work ───────────────────────────────────
  guide({
    thesis:
      'Làm việc sâu, theo cách Cal Newport đặt tên trong cuốn Deep Work, là làm việc đòi hỏi nhận thức cao trong trạng thái không bị phân tán, đủ lâu để tạo ra thứ khó sao chép. Điểm quan trọng cho người thực hành là hai điều: nó có trần theo ngày, và theo kinh nghiệm phổ biến của những người thực hành thì trần đó thấp hơn nhiều so với số giờ làm việc — người mới thường chỉ giữ được khoảng một giờ mỗi ngày, và ngay cả người rèn lâu cũng hiếm khi duy trì quá vài giờ chất lượng cao (bạn nên tự đo trần của chính mình thay vì tin con số của người khác); và nó không phải trạng thái tự đến khi bạn có hứng, mà là kết quả của một cấu trúc được dựng trước: giờ cố định, môi trường cố định, nghi thức vào và ra cố định.',
    why: {
      work:
        'Phần lớn công việc tạo ra khác biệt trong sự nghiệp — thiết kế một quy trình mới, viết một tài liệu định hướng, dựng một mô hình phân tích — không thể làm bằng những mẩu mười lăm phút giữa các cuộc họp. Ai giữ được vài giờ sâu mỗi tuần sẽ tích lũy loại kết quả mà người khác không có thời gian để làm.',
      interview:
        'Khi nhà tuyển dụng hỏi về thành tựu bạn tự hào nhất, câu trả lời mạnh thường là một sản phẩm cần nhiều giờ tập trung liên tục. Kể được cả cách bạn giành được số giờ đó trong một môi trường nhiều gián đoạn còn thuyết phục hơn bản thân kết quả.',
      study:
        'Những phần khó nhất của việc học — hiểu một khái niệm trừu tượng, giải một bài lớn, viết luận — đòi hỏi giữ nhiều mảnh thông tin trong đầu cùng lúc. Mỗi lần bị ngắt, các mảnh đó rơi và bạn phải xếp lại từ đầu.',
      life:
        'Những dự án cá nhân có ý nghĩa nhất — viết một cuốn sách, học một nhạc cụ tới mức chơi được, dựng một sản phẩm riêng — sống hay chết phụ thuộc vào việc bạn có bảo vệ được vài khối sâu mỗi tuần trong nhiều tháng hay không.',
    },
    framework: [
      {
        name: 'Chọn việc xứng đáng làm sâu',
        detail:
          'Không phải việc nào cũng cần trạng thái sâu. Sàng bằng một câu hỏi: nếu việc này được làm trong hai giờ liên tục không gián đoạn, chất lượng có khác rõ so với làm rải rác không? Trả lời không thì đó là việc nên gom lô, không nên tốn khối sâu.',
      },
      {
        name: 'Chọn nhịp phù hợp hoàn cảnh',
        detail:
          'Cal Newport mô tả vài kiểu triết lý làm việc sâu; với người đi làm bình thường, kiểu nhịp đều (một khối cố định mỗi ngày, cùng giờ) thường bền hơn kiểu dồn cả ngày, vì nó không đòi hỏi bạn phải dọn sạch lịch mới bắt đầu được.',
      },
      {
        name: 'Dựng nghi thức vào',
        detail:
          'Một chuỗi ba đến năm động tác giống nhau mỗi lần: cùng chỗ ngồi, tắt thông báo, mở đúng tài liệu cần, viết một dòng mục tiêu của khối, đặt đồng hồ. Nghi thức thay thế cho ý chí, vì ý chí là thứ cạn nhanh nhất trong ngày.',
      },
      {
        name: 'Đặt trần và tăng dần',
        detail:
          'Bắt đầu ở mức bạn chắc chắn làm được (thường 45-60 phút) và tăng dần theo tuần thay vì đặt ngay bốn giờ rồi thất bại. Trần bị vượt liên tục sẽ dẫn đến kiệt sức và bạn sẽ bỏ hệ thống, đổ lỗi cho phương pháp.',
      },
      {
        name: 'Đo bằng giờ sâu, không bằng giờ ngồi',
        detail:
          'Ghi số phút thực sự ở trạng thái không gián đoạn mỗi ngày và vẽ theo tuần. Con số này trung thực hơn nhiều so với cảm giác bận, và nó là chỉ số duy nhất cho biết bạn đang tiến bộ hay chỉ đang bận rộn hơn.',
      },
      {
        name: 'Nghi thức tắt việc',
        detail:
          'Cuối ngày, rà lại việc còn mở, ghi bước kế tiếp cho từng việc, rồi tuyên bố kết thúc bằng một câu hoặc một động tác cố định. Không có bước này, việc dở dang tiếp tục chiếm chỗ trong đầu cả buổi tối và làm hỏng khối sâu ngày hôm sau.',
      },
    ],
    scenario:
      'Một biên tập viên nội dung ở agency phụ trách tám khách hàng, mỗi ngày phải viết hoặc biên tập ba bài dài, đồng thời trực nhóm chat với các quản lý dự án. Cô đo một tuần và thấy khối liên tục dài nhất của mình chỉ khoảng hai mươi phút, do trung bình cứ mười lăm phút lại có một tin nhắn cần trả lời. Cô đề xuất một thỏa thuận với trưởng nhóm, không phải bằng lý lẽ chung mà bằng một con số: mỗi bài dài của cô đang mất trung bình hai ngày rưỡi để hoàn thành, và cô tin phần lớn thời gian đó là chi phí bắt nhịp lại. Thỏa thuận gồm ba điều: khung 9h00-11h00 cô không trực chat, có một người trong nhóm nhận thay việc gấp; mọi yêu cầu không khẩn đi qua bảng công việc chứ không qua chat; và cô cam kết trả lời toàn bộ trong vòng ba mươi phút sau 11h00. Sau bốn tuần, số phút sâu trung bình mỗi ngày tăng từ khoảng bốn mươi lên hơn một trăm, thời gian hoàn thành một bài dài rút xuống còn khoảng một ngày rưỡi. Cô cũng ghi lại một điều thành thật: hai tuần đầu cô thấy bất an vì sợ bị coi là khó liên lạc, và điều làm cô yên tâm không phải năng suất mà là việc trưởng nhóm công khai xác nhận thỏa thuận trong nhóm chat.',
    comparison: [
      {
        weak: 'Chờ có hứng và có một ngày rảnh trọn vẹn rồi mới bắt đầu việc lớn; ngày đó gần như không bao giờ đến trong một lịch làm việc bình thường.',
        mature:
          'Đặt một khối cố định mỗi ngày ở cùng khung giờ và chấp nhận bắt đầu khi chưa có hứng, vì với việc nhận thức thì hứng thường đến sau khi bắt đầu chứ không đến trước.',
      },
      {
        weak: 'Coi mọi việc đều xứng đáng làm sâu, nên đem cả việc trả lời email vào khối quý giá nhất trong ngày.',
        mature:
          'Sàng trước bằng câu hỏi chất lượng có khác không nếu làm liên tục; việc hành chính bị đẩy sang khối gom lô ở giờ năng lượng thấp.',
      },
      {
        weak: 'Kết thúc ngày bằng cách đóng máy giữa chừng, mang theo mười việc dở trong đầu, rồi tối nằm nghĩ về chúng mà không làm được gì.',
        mature:
          'Chạy nghi thức tắt việc: rà việc mở, ghi bước kế tiếp, tuyên bố kết thúc — nhờ đó phần dở dang được giao lại cho hệ thống thay vì cho trí nhớ.',
      },
    ],
    mistakes: [
      'Nhầm làm việc sâu với làm việc nhiều: kéo dài giờ ngồi mà vẫn để chat mở, rồi kết luận rằng phương pháp không hiệu quả — trong khi chưa có phút nào thật sự liên tục.',
      'Đặt ngay mục tiêu bốn giờ sâu mỗi ngày từ tuần đầu; ba ngày sau thấy kiệt và bỏ hẳn, thay vì bắt đầu ở mức chắc chắn giữ được và tăng dần.',
      'Bảo vệ khối sâu bằng cách im lặng biến mất, không báo ai, không có phương án cho việc thật sự gấp — điều này làm đồng nghiệp mất tin và thỏa thuận sẽ bị thu hồi ngay sự cố đầu tiên.',
    ],
    worksheet: [
      'Trong bảy ngày qua, khoảng thời gian liên tục dài nhất bạn làm một việc mà không chuyển sang thứ khác là bao nhiêu phút? Bạn biết con số đó nhờ đâu?',
      'Liệt kê ba việc trong công việc hiện tại mà chất lượng thật sự khác đi nếu được làm liên tục hai giờ. Ba việc đó hiện đang được làm vào lúc nào trong ngày?',
      'Nguồn gián đoạn lớn nhất của bạn là người, thiết bị hay chính bạn? Đếm trong một buổi sáng để trả lời bằng số chứ không bằng phỏng đoán.',
      'Nếu bạn muốn xin một khung hai giờ không trực chat, ai là người phải đồng ý, họ lo ngại điều gì, và bạn bù lại bằng cam kết nào?',
      'Nghi thức vào khối sâu của bạn gồm những động tác nào? Viết ra đúng thứ tự, ngắn thôi, và thử nó vào ngày mai.',
    ],
    exercises: [
      {
        label: 'Đo khối liên tục',
        text: 'Trong ba ngày, mỗi lần chuyển việc thì ghi giờ. Cuối ba ngày tính khoảng liên tục dài nhất và trung bình của bạn. Đây là đường nền, chưa cần thay đổi gì.',
        level: 'e',
      },
      {
        label: 'Sàng việc theo tiêu chí sâu',
        text: 'Lấy mười việc trong tuần, với mỗi việc trả lời có hoặc không cho câu hỏi: chất lượng có khác rõ nếu làm liên tục hai giờ? Xếp nhóm có sang khối sâu, nhóm không sang khối gom lô.',
        level: 'e',
      },
      {
        label: 'Nghi thức vào bốn bước',
        text: 'Thiết kế nghi thức vào gồm bốn động tác cố định và dùng nó năm ngày liên tiếp trước mỗi khối sâu. Ghi lại thời gian từ lúc ngồi xuống đến lúc thật sự vào việc, so ngày đầu với ngày cuối.',
        level: 'e',
      },
      {
        label: 'Bốn mươi lăm phút mỗi ngày',
        text: 'Trong hai tuần, giữ đúng một khối 45 phút mỗi ngày ở cùng khung giờ, không thêm không bớt. Ghi số ngày giữ được và lý do của những ngày hỏng — mục tiêu là tỷ lệ ổn định, chưa phải độ dài.',
        level: 'm',
      },
      {
        label: 'Thỏa thuận không trực chat',
        text: 'Soạn đề nghị một trang xin một khung không trực chat: con số hiện trạng, khung giờ đề nghị, phương án cho việc gấp, cam kết phản hồi sau khung. Trình bày với người quản lý và ghi lại phản hồi thật.',
        level: 'm',
      },
      {
        label: 'Nghi thức tắt việc',
        text: 'Trong mười ngày, cuối mỗi ngày rà việc còn mở, ghi bước kế tiếp cho từng việc và tuyên bố kết thúc. Chấm mức bận tâm về công việc buổi tối theo thang 1-5 và so với mười ngày trước đó.',
        level: 'm',
      },
      {
        label: 'Tăng trần theo tuần',
        text: 'Bắt đầu ở mức bạn giữ được 90% số ngày, mỗi tuần tăng 15 phút, dừng tăng ngay khi tỷ lệ giữ được tụt dưới 80%. Chạy sáu tuần và vẽ hai đường: độ dài khối và tỷ lệ giữ được.',
        level: 'h',
      },
      {
        label: 'Một sản phẩm bằng giờ sâu',
        text: 'Chọn một sản phẩm cụ thể chỉ hoàn thành được bằng làm việc sâu (tài liệu định hướng, bản phân tích, chương sách, khóa học nhỏ). Hoàn thành nó trong sáu tuần chỉ bằng các khối sâu đã lên lịch, và ghi lại tổng số giờ sâu đã bỏ ra để có nó.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao không nên đặt mục tiêu bốn giờ làm việc sâu ngay từ tuần đầu?',
        a: 'Vì khả năng duy trì tập trung cao có giới hạn theo ngày và tăng dần theo rèn luyện, giống sức bền thể lực. Đặt mức quá cao dẫn tới ba ngày quá tải rồi bỏ hẳn, và bạn sẽ kết luận nhầm rằng phương pháp không hợp với mình. Bắt đầu ở mức giữ được gần như mọi ngày, rồi tăng khi tỷ lệ giữ được còn cao.',
      },
      {
        q: 'Bạn không thể tắt chat vì công việc đòi hỏi trực. Còn cách nào làm việc sâu không?',
        a: 'Có, nhưng phải đàm phán chứ không thể im lặng biến mất. Ba cách thường dùng được: luân phiên trực trong nhóm để mỗi người có một khung không trực; thu hẹp yêu cầu trực xuống chỉ một kênh cho việc thật sự khẩn; hoặc dời khối sâu ra khỏi giờ cao điểm yêu cầu. Điểm chung là bạn phải nêu con số hiện trạng và đưa ra phương án cho việc gấp, nếu không đề nghị sẽ bị từ chối.',
      },
      {
        q: 'Làm sao biết một khối sâu là thành công, khi kết quả chưa nhìn thấy được ngay?',
        a: 'Dùng hai chỉ số. Chỉ số quá trình: số phút thật sự liên tục và số lần bạn tự chuyển sang việc khác. Chỉ số kết quả: mục tiêu của khối được viết trước khi bắt đầu đã đạt đến đâu. Không đặt mục tiêu trước thì cuối khối bạn chỉ còn cách chấm điểm theo cảm giác, và cảm giác thì luôn tệ vào những ngày việc khó.',
      },
    ],
    plan7:
      'Ngày 1: đo khối liên tục dài nhất và trung bình, chưa đổi gì. Ngày 2: sàng mười việc để tách nhóm xứng đáng làm sâu. Ngày 3: thiết kế nghi thức vào bốn bước và chạy một khối 45 phút. Ngày 4: chạy khối thứ hai cùng khung giờ, ghi số lần tự chuyển việc. Ngày 5: soạn và gửi đề nghị một khung không trực chat kèm phương án cho việc gấp. Ngày 6: thêm nghi thức tắt việc cuối ngày và chấm mức bận tâm buổi tối. Ngày 7: tổng kết số phút sâu cả tuần, đặt trần cho tuần sau và ghi tên sản phẩm bạn sẽ dùng các khối đó để hoàn thành.',
    evidence:
      'Bằng chứng ở đây là một sản phẩm cụ thể cộng với nhật ký giờ sâu đã tạo ra nó — ví dụ một tài liệu hướng dẫn nội bộ, một bản phân tích, một khóa học ngắn, kèm bảng ghi tổng số giờ sâu và biểu đồ số phút sâu theo tuần. Trong phỏng vấn, dùng bộ này khi được hỏi về thành tựu hoặc về cách bạn làm việc trong môi trường nhiều gián đoạn: bạn kể được cả sản phẩm lẫn cơ chế đã tạo ra nó, kể cả cuộc đàm phán để có khung giờ. Với người làm nội dung, thiết kế, phân tích hay nghiên cứu, chính danh mục sản phẩm sinh ra từ các khối sâu là portfolio.',
    references: [
      { label: 'Cal Newport — blog về deep work và năng suất trí óc', url: 'https://calnewport.com/blog/', type: 'article', needsReview: true },
      { label: 'TED — chuyên mục Work', url: 'https://www.ted.com/topics/work', type: 'video' },
    ],
  }),

  // ── Chương 7 · Quản lý sự chú ý ───────────────────────────────────────────
  guide({
    thesis:
      'Thời gian là thứ bạn có sẵn và không đổi được; sự chú ý là thứ bạn tiêu và có thể cạn giữa ngày. Vì vậy hai người có cùng tám giờ có thể cho ra kết quả chênh nhau nhiều lần. Quản lý sự chú ý là công việc thiết kế: cắt nguồn gián đoạn từ bên ngoài bằng cách sửa môi trường chứ không bằng cách gồng ý chí, và xử lý nguồn gián đoạn từ bên trong — những ý nghĩ tự bật lên — bằng một chỗ để ghi ra thay vì bằng cách cấm mình nghĩ.',
    why: {
      work:
        'Sai sót trong công việc chi tiết — nhập sai số, gửi nhầm người, bỏ sót một điều khoản — hầu như luôn xảy ra ở đoạn bị cắt ngang. Quản lý chú ý vì thế không chỉ là chuyện năng suất, nó là chuyện chất lượng và rủi ro.',
      interview:
        'Câu "bạn làm gì để tránh sai sót khi làm nhiều việc cùng lúc" là câu hỏi về quản lý chú ý. Trả lời bằng cơ chế cụ thể (danh sách kiểm, khung giờ không nhận yêu cầu, quy tắc kiểm tra chéo trước khi gửi) tốt hơn nhiều so với câu "em rất cẩn thận".',
      study:
        'Học với điện thoại úp bên cạnh vẫn khác học với điện thoại ở phòng khác, vì một phần chú ý luôn dành cho việc canh chừng. Người học hiệu quả xử lý bằng khoảng cách vật lý chứ không bằng lời hứa sẽ không cầm lên.',
      life:
        'Chú ý là thứ người thân cảm nhận rõ nhất: bữa tối có mặt mà mắt ở màn hình được ghi nhận rất khác bữa tối có mặt thật sự. Đây là lĩnh vực mà cải thiện nhỏ trong chú ý đổi lấy khác biệt lớn trong quan hệ.',
    },
    framework: [
      {
        name: 'Vẽ bản đồ xao nhãng',
        detail:
          'Trong hai buổi làm việc, mỗi lần bị kéo ra khỏi việc thì gạch một vạch và ghi nguồn: người, thiết bị, hay chính ý nghĩ của bạn. Hầu hết mọi người ngạc nhiên vì tỷ lệ nguồn bên trong cao hơn họ tưởng.',
      },
      {
        name: 'Sửa môi trường trước, sửa ý chí sau',
        detail:
          'Với nguồn bên ngoài, giải pháp là thiết kế: tắt thông báo theo nhóm ứng dụng, để điện thoại ngoài tầm với, đóng tab không liên quan, dùng tín hiệu vật lý cho đồng nghiệp biết bạn đang trong khối. Ý chí dùng để dựng hàng rào một lần, không dùng để chống đỡ mỗi phút.',
      },
      {
        name: 'Bắt ý nghĩ bằng giấy nháp',
        detail:
          'Đặt một tờ giấy bên cạnh; mỗi ý nghĩ chen ngang được ghi một dòng rồi quay lại việc ngay. Bạn không cấm được não sinh ra ý nghĩ, nhưng có thể tách việc ghi nhận khỏi việc đuổi theo chúng.',
      },
      {
        name: 'Một việc, một đồng hồ',
        detail:
          'Chọn một việc, đặt đồng hồ, và trong khoảng đó không mở thứ gì khác. Nếu quen làm nhiều thứ song song, bắt đầu bằng khoảng ngắn — kỹ thuật Pomodoro của Francesco Cirillo là một cách quen thuộc để tập nhịp này.',
      },
      {
        name: 'Phục hồi có chủ đích',
        detail:
          'Chú ý cần được nạp lại chứ không chỉ được tiết kiệm. Nghỉ mà vẫn cuộn mạng xã hội thì hệ thống chú ý không phục hồi; đi lại, ra ngoài trời, nhìn xa, hoặc ngồi yên vài phút mới là nghỉ theo nghĩa có tác dụng.',
      },
    ],
    scenario:
      'Một nhân viên kinh doanh B2B phụ trách ba mươi khách hàng doanh nghiệp thường xuyên gửi nhầm báo giá — hai lần trong một quý gửi sai bảng giá cho khách, một lần suýt mất hợp đồng. Anh tự cho là mình bất cẩn. Khi vẽ bản đồ xao nhãng trong hai buổi sáng, anh thấy trung bình mỗi mười phút có một lần bị kéo ra: điện thoại khách, tin nhắn nhóm, đồng nghiệp ghé bàn, và đáng chú ý là gần một nửa số lần là do chính anh mở chat khi đang chờ file tải. Cả hai lần gửi nhầm báo giá đều xảy ra ngay sau một cuộc gọi cắt ngang. Anh đổi ba thứ: soạn báo giá chỉ trong khung 14h00-15h30 với điện thoại chuyển tiếp sang tổng đài, dùng một danh sách kiểm bốn dòng bắt buộc trước khi bấm gửi (đúng khách, đúng bảng giá, đúng hiệu lực, đúng người nhận CC), và để một tờ giấy bên cạnh ghi mọi ý nghĩ chen ngang. Trong quý tiếp theo anh không gửi nhầm lần nào. Anh cũng thừa nhận một chi phí thật: thời gian phản hồi cuộc gọi của khách chậm hơn trước khoảng một tiếng trong khung đó, và anh phải báo trước điều này cho những khách quen gọi buổi chiều.',
    comparison: [
      {
        weak: 'Chống xao nhãng bằng quyết tâm: tự hứa sẽ không mở mạng xã hội, rồi mở lại sau hai mươi phút và tự trách mình yếu đuối.',
        mature:
          'Chống xao nhãng bằng khoảng cách và ma sát: điện thoại ở phòng khác, đăng xuất khỏi tài khoản, chặn theo khung giờ — dùng một quyết định để loại bỏ hàng trăm quyết định nhỏ về sau.',
      },
      {
        weak: 'Coi mọi ý nghĩ bật ra trong lúc làm việc là thứ phải xử lý ngay, nên mỗi ý nghĩ kéo theo mười phút lạc đề.',
        mature:
          'Ghi ý nghĩ vào giấy nháp trong năm giây rồi quay lại; cuối khối mới đọc lại và quyết định cái nào đáng làm — phần lớn hóa ra không đáng.',
      },
      {
        weak: 'Nghỉ giải lao bằng cách chuyển từ màn hình công việc sang màn hình giải trí, rồi thấy sau giờ nghỉ càng khó tập trung hơn.',
        mature:
          'Nghỉ bằng cách rời màn hình thật sự: đi lại, nhìn xa, ra ngoài vài phút — mục tiêu của nghỉ là nạp lại chú ý chứ không phải đổi loại kích thích.',
      },
    ],
    mistakes: [
      'Tin rằng mình thuộc nhóm người làm nhiều việc cùng lúc vẫn tốt, trong khi thứ thực sự đang xảy ra là chuyển qua lại rất nhanh và trả phí bắt nhịp mỗi lần — cái giá này thường lộ ra ở tỷ lệ sai sót chứ không ở cảm giác.',
      'Chỉ cắt nguồn xao nhãng bên ngoài mà không xử lý nguồn bên trong, nên sau khi tắt hết thông báo bạn vẫn tự mở trình duyệt sau mười phút vì không có chỗ nào để trút những ý nghĩ chen ngang.',
      'Dùng nhạc hoặc video làm nền cho việc đòi hỏi ngôn ngữ (viết, đọc kỹ, soát số liệu) rồi kết luận là mình tập trung kém; loại việc này cạnh tranh trực tiếp với lời hát và giọng nói trong nền.',
    ],
    worksheet: [
      'Trong một buổi sáng làm việc, bạn bị kéo ra khỏi việc bao nhiêu lần? Chia theo ba nguồn: người, thiết bị, ý nghĩ của chính bạn.',
      'Lần gần nhất bạn mắc một lỗi cẩu thả trong công việc: ngay trước đó có gì cắt ngang bạn không? Viết lại chuỗi sự kiện.',
      'Ba thông báo nào trên điện thoại và máy tính bạn có thể tắt vĩnh viễn ngay hôm nay mà không ai bị ảnh hưởng?',
      'Khi cần tập trung, môi trường quanh bạn có gì đang mời gọi bạn rời đi? Liệt kê theo thứ tự dễ loại bỏ nhất.',
      'Bạn nghỉ giải lao bằng cách gì? Sau khi nghỉ, bạn thấy dễ vào việc hơn hay khó hơn — và bạn dựa vào đâu để nói vậy?',
    ],
    exercises: [
      {
        label: 'Đếm vạch xao nhãng',
        text: 'Trong hai buổi làm việc, mỗi lần bị kéo ra khỏi việc thì gạch một vạch vào cột tương ứng: người, thiết bị, ý nghĩ. Cuối buổi cộng ba cột và ghi nguồn lớn nhất.',
        level: 'e',
      },
      {
        label: 'Dọn thông báo',
        text: 'Mở phần cài đặt thông báo trên điện thoại và máy tính, tắt tất cả trừ cuộc gọi và tối đa hai ứng dụng thật sự khẩn. Sau ba ngày, ghi lại có việc gì bị lỡ thật không, và bao nhiêu lần bạn tự kiểm tra bù.',
        level: 'e',
      },
      {
        label: 'Giấy nháp bắt ý',
        text: 'Đặt một tờ giấy bên cạnh trong ba ngày làm việc, ghi mỗi ý nghĩ chen ngang thành một dòng rồi quay lại việc ngay. Cuối mỗi ngày đếm số dòng và đánh dấu những dòng thật sự đáng làm — thường là thiểu số.',
        level: 'e',
      },
      {
        label: 'Một việc một đồng hồ',
        text: 'Chạy bốn phiên 25 phút trong ngày, mỗi phiên đúng một việc, không mở gì khác, nghỉ 5 phút rời màn hình giữa các phiên. Ghi số lần bạn suýt chuyển việc trong mỗi phiên và xem con số đó giảm dần thế nào.',
        level: 'm',
      },
      {
        label: 'Danh sách kiểm trước khi gửi',
        text: 'Chọn một loại việc bạn từng làm sai vì bị cắt ngang. Viết danh sách kiểm ba đến năm dòng phải rà trước khi hoàn tất, dán ngay cạnh màn hình, và dùng trong hai tuần. Ghi số lần danh sách bắt được lỗi.',
        level: 'm',
      },
      {
        label: 'Khoảng cách vật lý',
        text: 'Trong năm ngày, để điện thoại ở phòng khác hoặc trong ngăn kéo đóng trong khối tập trung. So số lần cầm điện thoại và tổng thời gian dùng với năm ngày trước đó theo thống kê của máy.',
        level: 'm',
      },
      {
        label: 'Thí nghiệm nền âm thanh',
        text: 'Trong hai tuần, luân phiên làm cùng một loại việc ngôn ngữ với ba nền: im lặng, nhạc không lời, nhạc có lời. Ghi số lượng công việc hoàn thành và số lỗi phải sửa lại. Kết luận cho riêng bạn, không theo lời khuyên chung.',
        level: 'h',
      },
      {
        label: 'Thiết kế lại một môi trường làm việc',
        text: 'Chọn nơi bạn làm việc nhiều nhất và thiết kế lại: vị trí ngồi, hướng nhìn, thứ để trên bàn, tín hiệu cho người khác biết bạn đang bận, quy ước với đồng nghiệp hoặc gia đình. Chạy hai tuần rồi viết một trang so sánh số lần bị cắt ngang trước và sau.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao "làm nhiều việc cùng lúc" gần như luôn tốn hơn làm lần lượt?',
        a: 'Vì với việc cần suy nghĩ, não không chạy song song mà chuyển qua lại, và mỗi lần chuyển đều để lại dư âm của việc trước cũng như tốn thời gian bắt nhịp việc sau. Chi phí này ít khi cảm nhận được trực tiếp; nó lộ ra ở tổng thời gian hoàn thành dài hơn và ở tỷ lệ sai sót cao hơn, đặc biệt trong việc chi tiết.',
      },
      {
        q: 'Bạn đã tắt hết thông báo nhưng vẫn tự mở trình duyệt sau mười phút. Vấn đề nằm ở đâu?',
        a: 'Ở nguồn xao nhãng bên trong. Tắt thông báo chỉ xử lý phía ngoài; những ý nghĩ tự bật lên cần một chỗ để trút. Dùng giấy nháp bắt ý, đồng thời tăng ma sát cho hành vi mở (đăng xuất, chặn theo khung giờ) để mỗi lần muốn mở lại phải trả một chi phí nhỏ đủ để bạn kịp nhận ra mình đang làm gì.',
      },
      {
        q: 'Công việc của bạn buộc phải phản hồi nhanh. Có thể quản lý chú ý trong điều kiện đó không?',
        a: 'Có, bằng cách phân tầng thay vì đòi tập trung tuyệt đối. Xác định loại yêu cầu nào thật sự cần phản hồi trong vài phút và tách nó ra một kênh riêng, phần còn lại gom lô theo khung. Kèm theo đó là công bố thời gian phản hồi cam kết, để người khác không phải hỏi dồn vì lo bạn quên.',
      },
    ],
    plan7:
      'Ngày 1: đếm vạch xao nhãng trong hai buổi, phân ba nguồn, chưa sửa gì. Ngày 2: tắt thông báo không cần thiết trên cả điện thoại và máy tính. Ngày 3: đặt giấy nháp bắt ý và dùng cả ngày, cuối ngày đếm số dòng. Ngày 4: chạy bốn phiên một việc một đồng hồ, ghi số lần suýt chuyển việc. Ngày 5: viết danh sách kiểm cho loại việc bạn hay sai và dán cạnh màn hình. Ngày 6: thử để điện thoại ngoài tầm với trong hai khối và đối chiếu thống kê sử dụng. Ngày 7: đếm lại vạch xao nhãng và so với ngày 1, giữ lại hai thay đổi có tác dụng rõ nhất.',
    evidence:
      'Hiện vật dùng được ở đây là danh sách kiểm bạn tự viết cho loại việc dễ sai, kèm thống kê số lỗi trước và sau khi áp dụng, và bản so sánh số lần bị cắt ngang trước và sau khi thiết kế lại môi trường. Trong phỏng vấn các vị trí đòi hỏi độ chính xác — kế toán, kinh doanh có báo giá, vận hành, kiểm soát chất lượng — đây là câu trả lời cụ thể cho câu hỏi về sai sót: bạn không hứa sẽ cẩn thận hơn, bạn cho thấy đã dựng cơ chế và đo được kết quả. Nếu bạn đề xuất được một quy ước cho cả nhóm (khung giờ không làm phiền, kênh riêng cho việc khẩn), hãy giữ lại tài liệu đề xuất đó.',
    references: [
      { label: 'Nir Eyal — tài liệu về sự xao nhãng và cách trở nên khó bị phân tâm', url: 'https://www.nirandfar.com/', type: 'article', needsReview: true },
      { label: 'Greater Good Science Center — chuyên mục Mindfulness và rèn luyện chú ý', url: 'https://greatergood.berkeley.edu/topic/mindfulness', type: 'article' },
    ],
  }),

  // ── Chương 8 · Chống trì hoãn ─────────────────────────────────────────────
  guide({
    thesis:
      'Trì hoãn hiếm khi là vấn đề lười biếng hay thiếu thông tin — bằng chứng là người trì hoãn thường biết rất rõ mình phải làm gì và vẫn đi làm việc khác một cách bận rộn. Nó là một cách né cảm xúc khó chịu gắn với việc đó: sợ làm dở, mơ hồ không biết bắt đầu từ đâu, chán, hoặc giận vì bị ép làm. Do đó cách chữa hiệu quả không phải thêm quyết tâm, mà là hạ mức khó chịu ở phút đầu tiên xuống đủ thấp để bắt đầu, vì với hầu hết mọi người, cảm giác khó chịu giảm mạnh sau khi đã bắt đầu chứ không giảm trước đó.',
    why: {
      work:
        'Trì hoãn làm hỏng chất lượng theo cách kín đáo: việc vẫn nộp đúng hạn nhưng không còn thời gian để rà soát, hỏi ý kiến hay sửa. Người ngoài chỉ thấy kết quả trung bình chứ không thấy nguyên nhân, nên cái giá thường trả bằng cơ hội chứ không bằng lời phê bình.',
      interview:
        'Không ai hỏi thẳng "bạn có trì hoãn không", nhưng câu "kể về một lần bạn suýt trễ hạn" đo đúng điều đó. Câu trả lời tốt nêu được bạn phát hiện mình đang né lúc nào, đã làm gì để bắt đầu, và cơ chế bạn dựng để nó không lặp lại.',
      study:
        'Bài lớn có hạn xa là môi trường sinh trì hoãn hoàn hảo: không có sức ép hàng ngày, không có bước đầu tiên rõ ràng, và kết quả bị đánh giá. Đây cũng là nơi các mốc trung gian tự đặt phát huy tác dụng lớn nhất.',
      life:
        'Những việc bị hoãn lâu nhất trong đời sống thường là việc gắn với cảm xúc khó: gọi điện xin lỗi, đi khám sức khỏe, xử lý giấy tờ thừa kế, nói chuyện thẳng thắn với người thân. Nhận ra mình đang né cảm xúc chứ không né công việc là bước đầu để xử lý.',
    },
    framework: [
      {
        name: 'Bắt đúng khoảnh khắc né',
        detail:
          'Trì hoãn có một khoảnh khắc rất ngắn khi bạn vừa nghĩ đến việc đó và tay đã chuyển sang thứ khác. Tập nhận ra khoảnh khắc đó và nói thành lời: "mình vừa né việc X". Không bắt được nó thì mọi kỹ thuật phía sau đều không có chỗ để áp dụng.',
      },
      {
        name: 'Gọi tên cảm xúc đang né',
        detail:
          'Hỏi một câu hẹp: việc này làm mình thấy gì — sợ bị chê, không biết bắt đầu từ đâu, chán, hay ức chế? Mỗi loại có cách xử lý khác nhau, và chẩn đoán sai dẫn tới thuốc sai: mơ hồ thì cần làm rõ, sợ dở thì cần hạ chuẩn bản nháp đầu.',
      },
      {
        name: 'Thu nhỏ bước đầu tiên',
        detail:
          'Nhỏ tới mức gần như buồn cười: mở file và viết một câu, gọi và chỉ hỏi giờ hẹn, xếp ba tài liệu ra bàn. Mục tiêu không phải hoàn thành mà là phá vỡ trạng thái đứng yên, vì phần lớn khó chịu nằm ở việc bắt đầu chứ không ở việc tiếp tục.',
      },
      {
        name: 'Viết ý định thực thi',
        detail:
          'Chuyển "sẽ làm luận văn" thành câu nếu-thì có nơi chốn và thời gian: "9h sáng thứ Ba, ở thư viện tầng 3, mình mở chương 2 và viết phần phương pháp trong 45 phút". Câu này loại bỏ chỗ cho việc thương lượng lại với chính mình.',
      },
      {
        name: 'Gắn hạn xã hội',
        detail:
          'Hạn tự đặt rất dễ hủy vì không ai biết. Hạn có người chờ — gửi bản nháp cho một người bạn học vào tối thứ Năm, hẹn báo cáo tiến độ với người hướng dẫn — tạo ra một chi phí nhỏ nhưng thật cho việc bỏ cuộc.',
      },
    ],
    scenario:
      'Một sinh viên năm cuối phải nộp khóa luận sau bốn tháng. Trong sáu tuần đầu, cứ mỗi lần ngồi vào bàn là bạn ấy chuyển sang đọc thêm tài liệu — hành vi trông rất giống làm việc nên không ai, kể cả bạn ấy, nhận ra đó là né. Khi tự hỏi việc này làm mình thấy gì, câu trả lời là sợ viết ra và bị người hướng dẫn chê là ngây thơ. Bạn ấy làm bốn thay đổi. Một, hạ chuẩn bản nháp đầu xuống mức tự gọi là bản xấu, cho phép viết câu vụng và ghi chú "chỗ này cần kiểm lại". Hai, viết ý định thực thi cho ba buổi mỗi tuần với địa điểm và giờ cố định. Ba, thu nhỏ bước đầu tiên thành "mở file và viết 150 từ, viết xong được phép dừng". Bốn, hẹn gửi bất cứ thứ gì mình có cho một bạn cùng lớp vào 21h tối thứ Năm hằng tuần, kể cả khi nó dở. Trong tám tuần sau đó bạn ấy có bản nháp đầy đủ, dù bốn chương phải viết lại phần lớn. Điều đáng chú ý: số giờ ngồi bàn không tăng nhiều so với sáu tuần đầu, thứ thay đổi là những giờ đó tạo ra chữ thay vì tạo ra thêm tài liệu tham khảo chưa đọc.',
    comparison: [
      {
        weak: 'Chờ đến khi thấy sẵn sàng hoặc có cảm hứng rồi mới bắt đầu, và coi việc chưa thấy sẵn sàng là lý do chính đáng để hoãn thêm.',
        mature:
          'Bắt đầu ở mức nhỏ nhất bất kể cảm giác, dựa trên quan sát rằng động lực thường xuất hiện sau vài phút làm chứ không xuất hiện trước.',
      },
      {
        weak: 'Trừng phạt bản thân sau mỗi lần trì hoãn bằng tự trách, khiến việc đó gắn thêm cảm xúc tiêu cực và lần sau càng dễ né hơn.',
        mature:
          'Xử lý lần trì hoãn như một dữ liệu: ghi lại việc gì, cảm xúc gì, lúc mấy giờ, rồi sửa thiết kế — hạ bước đầu, làm rõ yêu cầu, hoặc đổi giờ làm việc đó.',
      },
      {
        weak: 'Né việc khó bằng cách làm hàng loạt việc nhỏ có ích, rồi kết thúc ngày với cảm giác đã làm việc chăm chỉ mà việc quan trọng không nhúc nhích.',
        mature:
          'Đặt việc khó vào khối đầu tiên và coi mọi việc nhỏ là phần thưởng đến sau, đồng thời ghi rõ trong nhật ký khi bạn dùng việc nhỏ để trốn việc lớn.',
      },
    ],
    mistakes: [
      'Coi trì hoãn là lỗi tính cách rồi đi tìm động lực bằng video truyền cảm hứng; cảm hứng tan sau vài giờ trong khi nguyên nhân thật — sự mơ hồ hoặc nỗi sợ bị đánh giá — vẫn nguyên vẹn.',
      'Đặt mục tiêu quá lớn cho buổi đầu tiên ("hôm nay viết xong chương 2") khiến bước bắt đầu trở nên đáng sợ, và ngày nào cũng hoãn vì không bao giờ có đủ điều kiện để bắt đầu một việc lớn như thế.',
      'Dựa vào sức ép sát hạn như một chiến lược thường xuyên: nó có tạo ra kết quả, nhưng lấy đi toàn bộ thời gian rà soát và phản hồi, đồng thời khiến bạn không phân biệt được việc mình làm tốt với việc mình vừa kịp làm xong.',
    ],
    worksheet: [
      'Việc nào bạn đang hoãn lâu nhất? Viết tên nó ra và ghi con số ngày đã trôi qua kể từ khi bạn biết mình phải làm.',
      'Khi nghĩ đến việc đó, cảm xúc đầu tiên xuất hiện là gì — sợ làm dở, mơ hồ, chán, hay ức chế vì bị ép?',
      'Bước đầu tiên nhỏ nhất mà bạn chắc chắn làm được trong năm phút, ngay hôm nay, là gì? Nếu vẫn thấy nặng, hãy chia nhỏ hơn nữa.',
      'Viết một câu ý định thực thi cho việc đó: mấy giờ, ở đâu, làm chính xác cái gì, trong bao lâu.',
      'Ai là người bạn có thể hẹn gửi kết quả cho họ trong tuần này, kể cả khi kết quả còn dở? Bạn sẽ nhắn họ câu gì?',
    ],
    exercises: [
      {
        label: 'Nhật ký khoảnh khắc né',
        text: 'Trong ba ngày, mỗi lần bắt gặp mình vừa chuyển sang việc khác khi nghĩ đến một việc cụ thể, ghi một dòng: mấy giờ, việc gì, mình chuyển sang làm gì. Cuối ba ngày tìm giờ và loại việc lặp lại.',
        level: 'e',
      },
      {
        label: 'Câu hỏi cảm xúc',
        text: 'Với ba việc đang bị hoãn, viết cảm xúc gắn với từng việc bằng một từ, rồi viết cách xử lý tương ứng: mơ hồ thì làm rõ đầu ra, sợ dở thì hạ chuẩn bản đầu, chán thì rút ngắn phiên, ức chế thì làm rõ lý do phải làm.',
        level: 'e',
      },
      {
        label: 'Bước đầu năm phút',
        text: 'Chọn việc đang hoãn lâu nhất và làm đúng năm phút, hẹn giờ, cho phép dừng ngay khi chuông reo. Ghi lại bạn có muốn làm tiếp không sau khi chuông reo — lặp lại bài này năm ngày liên tiếp.',
        level: 'e',
      },
      {
        label: 'Ba câu nếu-thì',
        text: 'Viết ba câu ý định thực thi cho tuần tới, mỗi câu có giờ, địa điểm, hành động cụ thể và thời lượng. Dán ở nơi bạn nhìn thấy và đánh dấu câu nào thực sự xảy ra.',
        level: 'm',
      },
      {
        label: 'Bản nháp xấu có chủ đích',
        text: 'Với một việc bạn đang né vì sợ làm dở, đặt hẹn giờ 30 phút và cố ý tạo ra một bản nháp xấu, cho phép viết câu vụng và để lại ghi chú cần kiểm lại. Sau đó ghi cảm giác trước và sau, và ước lượng phần trăm bản nháp đó dùng được.',
        level: 'm',
      },
      {
        label: 'Hạn có người chờ',
        text: 'Hẹn gửi một sản phẩm dở dang cho một người cụ thể vào một giờ cụ thể trong tuần này. Gửi đúng hẹn dù chưa hài lòng, và ghi lại phản hồi thật của họ so với nỗi lo bạn tưởng tượng trước đó.',
        level: 'm',
      },
      {
        label: 'Bốn tuần mốc trung gian',
        text: 'Lấy một việc lớn có hạn xa, chia thành bốn mốc tuần, mỗi mốc có sản phẩm bàn giao được và một người sẽ nhận nó. Chạy bốn tuần, ghi mốc nào trễ và nguyên nhân, rồi sửa kích thước mốc cho phù hợp thực tế của bạn.',
        level: 'h',
      },
      {
        label: 'Truy nguyên một chuỗi trì hoãn',
        text: 'Chọn một việc bạn đã hoãn trên một tháng. Viết lại toàn bộ chuỗi: lần đầu biết phải làm, những lần định làm rồi thôi, việc gì đã chen vào, cảm xúc mỗi lần. Kết thúc bằng chẩn đoán nguyên nhân chính và một thay đổi thiết kế cụ thể, rồi thực hiện nó trong tuần tới.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao gọi trì hoãn là vấn đề quản lý cảm xúc lại hữu ích hơn gọi nó là lười?',
        a: 'Vì nhãn lười không chỉ ra chỗ nào để can thiệp, và còn thêm cảm giác xấu hổ khiến việc đó càng bị né. Nhìn nó như cách né một cảm xúc cụ thể — sợ bị đánh giá, mơ hồ, chán — cho bạn ba cách chữa khác nhau và có thể thử được: hạ chuẩn bản nháp, làm rõ đầu ra, hoặc rút ngắn phiên làm việc.',
      },
      {
        q: 'Bạn hay trì hoãn vì không biết bắt đầu từ đâu. Cách xử lý đúng là gì?',
        a: 'Đây là loại trì hoãn do mơ hồ, và thuốc là làm rõ chứ không phải quyết tâm. Viết ra đầu ra cần có, hỏi người giao việc một câu hẹp để xác nhận, rồi định nghĩa hành động kế tiếp nhỏ tới mức làm được trong năm phút. Nếu vẫn không rõ, hành động kế tiếp chính là đi hỏi.',
      },
      {
        q: 'Sức ép sát hạn giúp bạn làm được việc. Vậy có nên duy trì cách đó không?',
        a: 'Nó hoạt động nhưng có ba chi phí ít khi được tính: mất thời gian rà soát và xin phản hồi nên chất lượng thấp hơn khả năng thật của bạn; không có chỗ dự phòng khi xảy ra sự cố; và mức căng thẳng dồn vào cuối kỳ. Cách thay thế là tạo ra nhiều hạn nhỏ có người chờ, để vẫn tận dụng được sức ép nhưng ở liều nhỏ và có thời gian sửa.',
      },
    ],
    plan7:
      'Ngày 1: viết tên việc đang hoãn lâu nhất và số ngày đã trôi qua. Ngày 2: ghi nhật ký khoảnh khắc né và gọi tên cảm xúc gắn với việc đó. Ngày 3: làm bước đầu năm phút, cho phép dừng khi chuông reo. Ngày 4: viết ba câu ý định thực thi cho các buổi còn lại của tuần. Ngày 5: tạo một bản nháp xấu có chủ đích trong 30 phút. Ngày 6: hẹn gửi sản phẩm dở dang cho một người và gửi đúng hẹn. Ngày 7: nhìn lại cả tuần, ghi chẩn đoán nguyên nhân chính và chia việc lớn thành bốn mốc tuần có người nhận.',
    evidence:
      'Bằng chứng tốt nhất cho kỹ năng này là một việc lớn từng bị hoãn lâu và nay đã hoàn thành, kèm lịch sử các mốc trung gian có ngày gửi và người nhận thật. Trong phỏng vấn, dùng nó cho câu hỏi về áp lực hạn chót hoặc về một dự án dài: bạn kể được cách bạn nhận ra mình đang né, cơ chế đã dựng, và cả những mốc bị trễ cùng lý do — sự thành thật này thường được đánh giá cao hơn một câu chuyện hoàn hảo. Với người học hoặc làm nghề tự do, chuỗi bản nháp theo tuần cũng là bằng chứng cho thấy bạn giao được sản phẩm đều đặn chứ không chỉ khi có hứng.',
    references: [
      { label: 'TED — Tim Urban: Bên trong tâm trí của một người trì hoãn bậc thầy', url: 'https://www.ted.com/talks/tim_urban_inside_the_mind_of_a_master_procrastinator', type: 'video', needsReview: true },
      { label: 'James Clear — Habits: bắt đầu nhỏ và thiết kế môi trường hành vi', url: 'https://jamesclear.com/habits', type: 'article' },
    ],
  }),

  // ── Chương 9 · Ước lượng thời gian ────────────────────────────────────────
  guide({
    thesis:
      'Ước lượng là một dự báo, không phải một lời hứa, và cũng không phải mục tiêu bạn muốn đạt. Con người có xu hướng dự báo thời gian hoàn thành ngắn hơn thực tế một cách khá đều đặn — hiện tượng được Daniel Kahneman và Amos Tversky gọi là ngụy biện lập kế hoạch (planning fallacy) — và điều đáng chú ý là biết về nó không tự động chữa được nó. Thứ chữa được là dữ liệu của chính bạn: giữ sổ ước lượng và thực tế cho từng loại việc, rồi dự báo lần sau dựa trên những lần tương tự đã đo, thay vì dựa trên hình dung về một lần chạy suôn sẻ.',
    why: {
      work:
        'Ước lượng sai khiến cả dây chuyền sai theo: người khác lên lịch dựa trên ngày bạn nói, khách hàng hứa lại với khách của họ. Một ước lượng trung thực kèm khoảng dao động ít gây tổn thất hơn nhiều so với một con số đẹp rồi xin lùi ba lần.',
      interview:
        'Nhiều vị trí hỏi thẳng "bạn ước lượng công việc thế nào". Câu trả lời tốt nêu cách bạn phân rã, cách bạn nói bằng khoảng thay vì một con số, và cách bạn cập nhật khi thông tin thay đổi — kèm ví dụ một lần bạn ước lượng sai và điều bạn đã sửa sau đó.',
      study:
        'Kế hoạch ôn thi hỏng chủ yếu vì ước lượng số buổi cần cho mỗi phần quá lạc quan. Đo thời gian thật cho một chương rồi nhân lên cho các chương tương tự chính xác hơn nhiều so với chia đều số ngày còn lại.',
      life:
        'Sửa nhà, chuẩn bị đám cưới, làm thủ tục giấy tờ — những việc này gần như luôn dài hơn dự tính vì chúng phụ thuộc vào người khác. Ước lượng có tính đến phần chờ đợi giúp bạn không đặt lịch nối đuôi nhau và không rơi vào thế bị động.',
    },
    framework: [
      {
        name: 'Tách ba thứ hay bị trộn',
        detail:
          'Ước lượng (tôi nghĩ nó cần bao lâu), mục tiêu (tôi muốn xong lúc nào) và cam kết (tôi hứa gì với người khác) là ba con số khác nhau. Trộn chúng lại là nguồn gốc của phần lớn ước lượng vô dụng, vì mong muốn sẽ lặng lẽ kéo dự báo xuống.',
      },
      {
        name: 'Nhìn từ ngoài trước khi nhìn từ trong',
        detail:
          'Trước khi phân tích chi tiết việc này, hãy hỏi: những lần tương tự trước đây tôi mất bao lâu? Cách dự báo dựa trên lớp việc tương tự thường sát hơn cách cộng dồn từng bước, vì nó tự động chứa cả những rắc rối bạn không nghĩ ra được lúc lập kế hoạch.',
      },
      {
        name: 'Phân rã tới mức đo được',
        detail:
          'Chia nhỏ đến khi mỗi phần có kích thước bạn từng làm và từng đo. Phần nào không chia nhỏ được là phần bạn chưa hiểu, và đó chính là chỗ rủi ro lớn nhất — hãy đánh dấu nó thay vì gán cho nó một con số cho có.',
      },
      {
        name: 'Ước lượng ba điểm, nói bằng khoảng',
        detail:
          'Với mỗi phần, ghi ba số: thuận lợi, khả dĩ nhất, trục trặc. Khi báo cho người khác, nói bằng khoảng kèm điều kiện ("3 đến 5 ngày, với giả định nhận được dữ liệu trong hôm nay") thay vì một con số trần trụi.',
      },
      {
        name: 'Đệm ở cấp dự án, không đệm từng việc',
        detail:
          'Đệm rải vào từng việc thường bị tiêu hết vì công việc nở ra vừa đủ thời gian được cấp. Gom đệm thành một khoản chung ở cuối dự án và theo dõi mức tiêu thụ của nó — đây cũng là chỉ báo sớm cho biết dự án đang đi lệch.',
      },
      {
        name: 'Đối chiếu và giữ sổ',
        detail:
          'Ghi lại ước lượng ban đầu và thời gian thực tế cho từng việc trong sổ riêng. Sau mười đến mười lăm mục, bạn có tỷ lệ lệch theo từng loại việc — dữ liệu này đáng giá hơn mọi kỹ thuật ước lượng đọc được ở đâu đó.',
      },
    ],
    scenario:
      'Một người làm thiết kế tự do nhận làm trang giới thiệu sản phẩm trọn gói, báo giá theo gói năm ngày công. Sáu dự án liên tiếp đều kéo dài gấp đôi, và vì báo giá trọn gói nên phần vượt là tiền anh tự trả. Anh mở lại lịch sử tám dự án gần nhất và ghi ba cột: ngày công ước lượng, ngày công thực tế, và nguyên nhân chính của phần vượt. Kết quả rất rõ: phần dựng giao diện gần đúng dự tính, còn phần vượt gần như toàn bộ nằm ở vòng sửa — trung bình mỗi dự án có bốn đến sáu vòng, trong khi anh luôn ngầm giả định hai vòng. Anh đổi ba thứ trong cách báo giá: nêu rõ gói bao gồm ba vòng sửa, vòng thứ tư trở đi tính theo giờ; tách phần nội dung do khách cung cấp thành mốc riêng có hạn, vì chờ nội dung là nguyên nhân kéo dài thứ hai; và báo thời gian bằng khoảng kèm điều kiện thay vì một con số. Bốn dự án sau đó, hai dự án đúng khoảng đã báo, một dự án vượt nhẹ, một dự án khách trả thêm cho hai vòng sửa ngoài gói. Anh cũng nói thật rằng một khách đã bỏ đi vì thấy điều khoản vòng sửa quá chặt — đó là cái giá của việc nói rõ ràng, và anh chấp nhận đánh đổi đó.',
    comparison: [
      {
        weak: 'Đưa một con số duy nhất cho ngày hoàn thành, thường là kịch bản mọi thứ diễn ra suôn sẻ và không ai nghỉ ốm.',
        mature:
          'Đưa một khoảng kèm giả định và điều kiện, và nói rõ điều gì sẽ khiến khoảng đó thay đổi — nhờ vậy khi có sự cố, việc cập nhật là chuyện đã được dự liệu chứ không phải một lời xin lỗi.',
      },
      {
        weak: 'Ước lượng bằng cảm giác dựa trên hình dung về việc sắp làm, không tham chiếu lần nào đã làm tương tự.',
        mature:
          'Bắt đầu từ dữ liệu lớp việc tương tự đã đo, rồi mới điều chỉnh theo đặc thù lần này — cách này tự động tính đến những rắc rối lặp lại mà bạn luôn quên khi hình dung.',
      },
      {
        weak: 'Khi phát hiện sẽ trễ thì im lặng cố làm bù, và chỉ báo vào ngày đến hạn.',
        mature:
          'Báo ngay khi tín hiệu lệch xuất hiện, kèm ba thông tin: lệch bao nhiêu, nguyên nhân, và hai phương án (giảm phạm vi hoặc dời hạn) để bên kia chọn.',
      },
    ],
    mistakes: [
      'Trộn cam kết vào ước lượng: sếp hỏi bao lâu, bạn nghe ra rằng ông ấy muốn nghe con số nhỏ, nên đưa con số nhỏ và biến nó thành lời hứa ngay tại chỗ — sau đó cả hai đều lên kế hoạch trên một dự báo không ai tin.',
      'Chỉ ước lượng phần bạn tự làm, bỏ qua thời gian chờ người khác duyệt, chờ dữ liệu, chờ phản hồi của khách — trong nhiều dự án, phần chờ đợi mới là phần dài nhất.',
      'Ước lượng lại từ đầu mỗi lần mà không giữ sổ đối chiếu, nên năm này qua năm khác bạn lặp lại đúng một mức lệch mà không bao giờ biết mức đó là bao nhiêu.',
    ],
    worksheet: [
      'Lấy ba việc bạn hoàn thành tháng trước: ước lượng ban đầu là bao nhiêu, thực tế là bao nhiêu, tỷ lệ lệch của từng việc?',
      'Trong ước lượng gần nhất của bạn, phần nào là dự báo và phần nào thực chất là mong muốn cho kịp hạn?',
      'Với việc bạn sắp làm, phần nào bạn không chia nhỏ được? Viết ra và ghi rõ đó là chỗ rủi ro chưa hiểu rõ.',
      'Việc sắp tới của bạn phụ thuộc vào ai và vào cái gì? Ước lượng riêng phần thời gian chờ đợi đó.',
      'Nếu phải nói ngày hoàn thành bằng một khoảng kèm điều kiện, bạn sẽ nói câu gì? Viết nguyên văn câu đó ra.',
    ],
    exercises: [
      {
        label: 'Sổ ước lượng và thực tế',
        text: 'Trong hai tuần, với mọi việc lớn hơn một giờ, ghi ước lượng trước khi làm và thời gian thực tế sau khi làm. Cuối kỳ tính tỷ lệ thực tế trên ước lượng cho từng loại việc và ghi loại nào lệch nhiều nhất.',
        level: 'e',
      },
      {
        label: 'Ba điểm cho một việc',
        text: 'Chọn một việc sắp làm, viết ba con số: thuận lợi, khả dĩ nhất, trục trặc, kèm lý do cho con số trục trặc. Sau khi làm xong, so kết quả thật với ba con số đó.',
        level: 'e',
      },
      {
        label: 'Tách ba khái niệm',
        text: 'Lấy hai cam kết bạn đang có và viết tách bạch ba con số cho mỗi cái: ước lượng của bạn, mục tiêu bạn muốn, và cam kết bạn đã nói ra. Ghi khoảng cách giữa chúng và nhận diện xem áp lực nào tạo ra khoảng cách đó.',
        level: 'e',
      },
      {
        label: 'Dự báo từ lớp tương tự',
        text: 'Trước khi ước lượng một việc mới, liệt kê ba đến năm lần bạn làm việc tương tự và thời gian thực tế của chúng. Lấy con số ở giữa làm điểm xuất phát, rồi mới điều chỉnh, và ghi rõ lý do điều chỉnh.',
        level: 'm',
      },
      {
        label: 'Ước lượng phần chờ',
        text: 'Với một dự án đang chạy, vẽ dòng thời gian và tô riêng những đoạn bạn phải chờ người khác. Ước lượng riêng tổng thời gian chờ dựa trên lịch sử phản hồi thật của những người đó, không dựa trên lời hứa của họ.',
        level: 'm',
      },
      {
        label: 'Câu báo khoảng kèm điều kiện',
        text: 'Soạn và dùng thật ba lần trong tuần câu báo tiến độ dạng khoảng kèm điều kiện. Ghi lại phản ứng của người nghe — nhiều người thấy nó đáng tin hơn một con số chắc nịch, nhưng cũng có người sẽ ép bạn cho một con số duy nhất.',
        level: 'm',
      },
      {
        label: 'Đệm cấp dự án',
        text: 'Với một dự án nhiều bước, bỏ toàn bộ đệm khỏi từng bước và gom thành một khoản đệm chung ở cuối. Theo dõi mỗi tuần: đã tiêu bao nhiêu phần trăm đệm so với đã hoàn thành bao nhiêu phần trăm công việc. Viết nhận xét khi hai tỷ lệ lệch nhau.',
        level: 'h',
      },
      {
        label: 'Hồi cứu ước lượng một dự án',
        text: 'Chọn một dự án đã kết thúc và trễ. Dựng lại bảng ba cột: ước lượng, thực tế, nguyên nhân lệch cho từng phần. Phân loại nguyên nhân thành ba nhóm (phạm vi nở ra, phần chờ đợi, ước lượng thuần sai) và viết một quy tắc mới cho lần sau ứng với nhóm lớn nhất.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao biết về ngụy biện lập kế hoạch vẫn không đủ để ước lượng chính xác hơn?',
        a: 'Vì khi hình dung một công việc, bạn hình dung kịch bản diễn ra trơn tru và không thể liệt kê hết những trục trặc chưa biết. Cách khắc phục không phải cố nghĩ kỹ hơn mà là thay nguồn dữ liệu: dùng thời gian thực tế của những lần tương tự đã đo, vì các con số đó đã bao gồm sẵn phần trục trặc trung bình.',
      },
      {
        q: 'Người quản lý ép bạn đưa một con số duy nhất thay vì một khoảng. Ứng xử thế nào?',
        a: 'Đưa con số nhưng kèm loại con số. Ví dụ: "nếu anh cần một ngày để cam kết với khách thì em lấy đầu trên của khoảng, ngày 20; còn ngày sớm nhất có thể là 15 với điều kiện dữ liệu về trong tuần này". Như vậy bạn vẫn cho một con số dùng được, đồng thời giữ nguyên thông tin về độ bất định thay vì để nó biến mất.',
      },
      {
        q: 'Vì sao không nên cộng đệm vào từng đầu việc nhỏ?',
        a: 'Vì công việc có xu hướng nở ra cho vừa thời gian được cấp, nên đệm rải nhỏ thường bị tiêu hết mà không ai nhận ra, và khi có sự cố thật thì không còn dự trữ. Gom thành đệm chung ở cấp dự án cho bạn một chỉ báo sớm: nếu đã tiêu 60% đệm khi mới xong 30% công việc, bạn có bằng chứng để báo sớm thay vì báo vào ngày đến hạn.',
      },
    ],
    plan7:
      'Ngày 1: mở sổ ước lượng, ghi ước lượng cho mọi việc lớn hơn một giờ. Ngày 2-3: tiếp tục ghi cả ước lượng lẫn thực tế, không sửa hành vi. Ngày 4: với một việc mới, liệt kê ba lần tương tự và dự báo từ lớp đó trước khi phân rã. Ngày 5: viết ước lượng ba điểm cho việc đó và soạn câu báo dạng khoảng kèm điều kiện. Ngày 6: tách và ước lượng riêng phần thời gian chờ người khác. Ngày 7: tính tỷ lệ thực tế trên ước lượng của cả tuần theo loại việc và ghi hệ số khởi điểm cho tuần sau.',
    evidence:
      'Hiện vật thuyết phục nhất là sổ ước lượng và thực tế kéo dài vài tháng, kèm bảng tỷ lệ lệch theo loại việc và một ví dụ cho thấy bạn đã đổi cách báo giá hoặc cách cam kết dựa trên dữ liệu đó. Trong phỏng vấn, đây là câu trả lời hiếm cho câu hỏi về ước lượng: hầu hết ứng viên nói lý thuyết, còn bạn đưa được con số của chính mình và một quyết định đã thay đổi vì nó. Với người làm nghề tự do, chính bảng này là công cụ định giá và là lý do bạn ngừng phải tự trả cho phần vượt.',
    references: [
      { label: 'Wikipedia — Planning fallacy (ngụy biện lập kế hoạch)', url: 'https://en.wikipedia.org/wiki/Planning_fallacy', type: 'article', needsReview: true },
      { label: 'Project Management Institute — tài nguyên về ước lượng và quản lý tiến độ', url: 'https://www.pmi.org/', type: 'article' },
    ],
  }),

  // ── Chương 10 · Quản lý nhiều công việc đồng thời ─────────────────────────
  guide({
    thesis:
      'Làm nhiều việc đồng thời là điều kiện làm việc bình thường của hầu hết mọi người, nên câu hỏi hữu ích không phải "làm sao để chỉ có một việc" mà là "làm sao để nhiều dòng việc cùng chạy mà không dòng nào chết âm thầm". Ba thứ quyết định: số việc được phép ở trạng thái đang làm cùng lúc, cách bạn gom việc theo dòng thay vì nhảy qua lại, và chất lượng của ghi chú bàn giao mà bạn để lại cho chính mình khi rời một dòng.',
    why: {
      work:
        'Người phụ trách nhiều dự án bị đánh giá không phải qua nỗ lực mà qua việc có dòng nào bị bỏ quên hay không. Một dòng im lặng hai tuần thường gây thiệt hại lớn hơn ba dòng chậm nhưng được cập nhật đều.',
      interview:
        'Câu "bạn xử lý thế nào khi chạy nhiều dự án cùng lúc" là câu hỏi về cơ chế: bảng trạng thái, trần việc đang làm, nhịp cập nhật cho từng bên liên quan. Kể được cơ chế cụ thể tách bạn khỏi những ứng viên chỉ nói mình chịu được áp lực.',
      study:
        'Học nhiều môn song song hỏng ở chỗ chuyển môn quá thường xuyên, mỗi lần lại mất thời gian bắt nhịp. Gom theo buổi cho từng môn giữ được lợi ích của việc học rải nhiều môn mà không phải trả phí chuyển liên tục.',
      life:
        'Vừa đi làm vừa chăm con nhỏ vừa lo việc gia đình là chạy nhiều dòng thật sự. Điều cứu bạn không phải làm nhanh hơn, mà là có chỗ ghi lại trạng thái từng dòng để không phải giữ tất cả trong đầu cùng lúc.',
    },
    framework: [
      {
        name: 'Liệt kê dòng việc và người phụ thuộc',
        detail:
          'Viết ra mọi dòng đang chạy, mỗi dòng ghi ai đang chờ nó và điều gì đang chặn nó. Phần lớn cảm giác hỗn loạn đến từ chỗ số dòng thật lớn hơn nhiều so với số dòng bạn nghĩ mình đang có.',
      },
      {
        name: 'Đặt trần cho việc đang làm',
        detail:
          'Giới hạn số việc ở trạng thái đang làm — nhiều người thấy hợp lý ở mức hai hoặc ba. Trần này là công cụ chẩn đoán: khi muốn vượt trần, bạn buộc phải nói rõ việc nào tạm dừng và ai được báo, thay vì để mọi thứ cùng dở dang.',
      },
      {
        name: 'Gom theo dòng, không xen kẽ',
        detail:
          'Dành nguyên buổi hoặc nguyên ngày cho một dòng thay vì rải mỗi dòng một tiếng. Với việc cần bối cảnh (nhớ dữ liệu, nhớ lịch sử trao đổi), chi phí bắt nhịp lại thường lớn hơn lợi ích của việc chạm vào mọi dòng mỗi ngày.',
      },
      {
        name: 'Ghi sổ bàn giao cho chính mình',
        detail:
          'Khi rời một dòng, viết ba dòng: đang ở đâu, bước kế tiếp là gì, đang chờ ai. Đây là thứ rẻ nhất và bị bỏ qua nhiều nhất — không có nó, mỗi lần quay lại bạn phải đọc lại toàn bộ lịch sử trao đổi để nhớ mình đang làm gì.',
      },
      {
        name: 'Một bảng trạng thái ai cũng xem được',
        detail:
          'Mỗi dòng có một dòng trạng thái công khai với ngày cập nhật gần nhất. Khi bảng tồn tại, số câu hỏi hỏi thăm tiến độ giảm hẳn, và bạn không còn phải kể lại cùng một câu chuyện cho bốn người.',
      },
    ],
    scenario:
      'Một chuyên viên vận hành ở công ty logistics phụ trách ba dự án cải tiến — đổi nhà cung cấp bao bì, số hóa phiếu giao nhận, và chuẩn hóa quy trình kiểm đếm kho — song song với việc xử lý sự cố hằng ngày. Anh cố chạm vào cả ba dự án mỗi ngày, mỗi cái khoảng một tiếng, và sau hai tháng thì cả ba đều dở dang trong khi mỗi bên liên quan đều nghĩ dự án của mình đang bị bỏ rơi. Anh đổi cách làm: dựng một bảng ba dòng với trạng thái và ngày cập nhật, đặt trần chỉ hai dự án được chạy song song và dự án thứ ba chính thức ở trạng thái tạm dừng có thông báo, gán mỗi dự án một ngày cố định trong tuần (thứ Ba và thứ Năm là ngày dự án, các ngày còn lại cho vận hành), và mỗi cuối ngày dự án viết ba dòng bàn giao cho chính mình. Sáu tuần sau, dự án bao bì hoàn thành, dự án số hóa phiếu đi được hai phần ba, dự án kiểm đếm vẫn dừng nhưng bên liên quan biết rõ lý do và ngày dự kiến khởi động lại. Anh ghi nhận một tác dụng phụ không ngờ: việc công khai trạng thái tạm dừng khiến trưởng kho chủ động đề nghị cử người hỗ trợ, điều chưa từng xảy ra trong hai tháng anh im lặng cố gắng.',
    comparison: [
      {
        weak: 'Chạm vào mọi dự án mỗi ngày để cảm thấy không bỏ rơi cái nào, và trả phí bắt nhịp lại nhiều lần mỗi ngày.',
        mature:
          'Gán ngày hoặc buổi cố định cho từng dòng, chấp nhận rằng mỗi dòng chỉ được chạm hai lần mỗi tuần nhưng mỗi lần đủ sâu để tiến thật.',
      },
      {
        weak: 'Để dự án thứ ba trôi trong im lặng và hy vọng không ai hỏi, vì thừa nhận không làm được nghe như thất bại.',
        mature:
          'Chuyển nó sang trạng thái tạm dừng công khai với lý do và ngày xem lại — cách này thường mở ra hỗ trợ hoặc quyết định bỏ hẳn, cả hai đều tốt hơn tình trạng lửng lơ.',
      },
      {
        weak: 'Giữ trạng thái của tất cả các dòng trong đầu, và trả lời câu hỏi tiến độ bằng cách nhớ lại.',
        mature:
          'Duy trì bảng trạng thái có ngày cập nhật, nên trả lời được ngay và nhìn được dòng nào lâu nhất chưa động tới — thường đó chính là dòng sắp có vấn đề.',
      },
    ],
    mistakes: [
      'Coi số dự án đang chạy là thước đo giá trị bản thân, nên nhận thêm dòng mới trong khi các dòng cũ chưa đóng; kết quả là tổng thời gian hoàn thành của mọi dòng đều dài ra và không có gì được giao sớm.',
      'Không phân biệt việc bị chặn với việc đang chạy: một dòng đang chờ người khác vẫn chiếm chỗ trong đầu bạn như thể nó đang chạy, dù bạn không thể làm gì thêm cho nó lúc này.',
      'Bỏ qua ghi chú bàn giao vì thấy mất thời gian, rồi mỗi lần quay lại một dòng phải mất hai mươi phút đọc lại chuỗi email để nhớ mình đang ở đâu — nhân với số lần chuyển dòng, đây thường là khoản lãng phí lớn nhất.',
    ],
    worksheet: [
      'Viết ra mọi dòng việc đang mở của bạn kèm tên người đang chờ từng dòng. Con số đó lớn hơn hay nhỏ hơn bạn tưởng?',
      'Dòng nào lâu nhất chưa được cập nhật? Bao nhiêu ngày rồi, và người liên quan có biết điều đó không?',
      'Trong tuần qua, bạn chuyển giữa các dòng bao nhiêu lần một ngày? Ước lượng thời gian bắt nhịp lại mỗi lần chuyển.',
      'Nếu buộc phải tạm dừng một dòng trong ba tuần, bạn dừng dòng nào, và bạn sẽ báo cho ai bằng câu gì?',
      'Ba dòng bàn giao cho chính mình ở dòng việc quan trọng nhất hiện tại là gì? Viết luôn bây giờ: đang ở đâu, bước kế tiếp, đang chờ ai.',
    ],
    exercises: [
      {
        label: 'Bản đồ dòng việc',
        text: 'Vẽ một bảng liệt kê mọi dòng đang mở, mỗi dòng ghi: người chờ, trạng thái, ngày cập nhật gần nhất, thứ đang chặn. Khoanh những dòng quá bảy ngày chưa cập nhật.',
        level: 'e',
      },
      {
        label: 'Đếm số lần chuyển dòng',
        text: 'Trong hai ngày, mỗi lần chuyển sang một dòng việc khác thì gạch một vạch. Cuối hai ngày, nhân số vạch với thời gian bắt nhịp ước lượng của bạn để ra tổng chi phí chuyển đổi.',
        level: 'e',
      },
      {
        label: 'Ba dòng bàn giao',
        text: 'Trong năm ngày, mỗi lần rời một dòng việc, viết ba dòng: đang ở đâu, bước kế tiếp, đang chờ ai. Ghi lại thời gian cần để vào việc ở lần quay lại kế tiếp và so với trước khi có thói quen này.',
        level: 'e',
      },
      {
        label: 'Đặt trần và thử phá',
        text: 'Đặt trần hai việc đang làm trong hai tuần. Mỗi lần muốn thêm việc thứ ba, phải viết ra việc nào tạm dừng và báo cho ai. Cuối kỳ đếm số lần phải chọn và xem việc nào liên tục bị đẩy sang trạng thái dừng.',
        level: 'm',
      },
      {
        label: 'Ngày theo chủ đề',
        text: 'Gán mỗi dòng việc lớn một ngày cố định trong tuần và chạy ba tuần. Ghi lại tiến độ từng dòng và so với giai đoạn trước khi gom, đồng thời ghi những lần bạn buộc phải phá quy tắc và lý do.',
        level: 'm',
      },
      {
        label: 'Tách việc bị chặn',
        text: 'Rà toàn bộ dòng việc và tách rõ hai nhóm: đang chạy và đang bị chặn. Với nhóm bị chặn, viết một câu nhắc cho người đang giữ nút chặn và đặt ngày nhắc lại. Cuối tuần đếm số nút chặn đã được gỡ.',
        level: 'm',
      },
      {
        label: 'Bảng trạng thái công khai',
        text: 'Dựng bảng trạng thái cho mọi dòng bạn phụ trách, chia sẻ cho các bên liên quan, và cập nhật đúng lịch trong ba tuần. Đếm số câu hỏi hỏi thăm tiến độ bạn nhận được trước và sau khi có bảng.',
        level: 'h',
      },
      {
        label: 'Đóng hoặc dừng chính thức một dòng',
        text: 'Chọn một dòng đang lửng lơ nhiều tháng. Chuẩn bị đề nghị gồm: hiện trạng, chi phí đang phát sinh khi giữ nó mở, ba lựa chọn (đóng, tạm dừng có ngày, tiếp tục với nguồn lực bổ sung). Trình bày với người quyết định và ghi lại kết quả.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao giảm số việc đang làm cùng lúc lại làm mọi việc xong sớm hơn, dù tổng khối lượng không đổi?',
        a: 'Vì khi chạy song song nhiều dòng, mỗi dòng đều kéo dài do phải chia thời gian và do chi phí chuyển đổi, nên tất cả cùng về đích muộn. Khi giới hạn số dòng đang chạy, những dòng được chọn kết thúc sớm hơn và giải phóng chỗ cho dòng tiếp theo — tổng thời gian trung bình để một việc đi từ lúc bắt đầu đến lúc xong giảm xuống.',
      },
      {
        q: 'Bạn không được phép từ chối bất kỳ dự án nào. Trần việc đang làm còn dùng được không?',
        a: 'Còn, nhưng nó chuyển vai trò từ công cụ từ chối thành công cụ minh bạch. Bạn vẫn nhận tất cả vào hàng đợi, nhưng chỉ hai đến ba dòng ở trạng thái đang chạy, phần còn lại ở trạng thái chờ có ngày dự kiến. Điều này biến cuộc trao đổi từ "anh có làm không" thành "anh muốn cái nào chạy trước", và người quyết định thấy được hậu quả của việc chất thêm.',
      },
      {
        q: 'Một dòng việc đang bị chặn vì chờ phòng khác. Xử lý thế nào cho đúng?',
        a: 'Đưa nó ra khỏi nhóm đang chạy để nó không chiếm chỗ trong đầu và trong trần, đồng thời gán một hành động duy nhất: nhắc ai, vào ngày nào. Ghi thời điểm bắt đầu chờ để sau vài lần bạn có dữ liệu về thời gian phản hồi trung bình của bên đó — dữ liệu này rất hữu ích khi ước lượng dự án sau và khi đề xuất sửa quy trình.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê mọi dòng việc đang mở kèm người chờ và thứ đang chặn. Ngày 2: đếm số lần chuyển dòng trong ngày và ước lượng chi phí chuyển đổi. Ngày 3: đặt trần hai việc đang chạy và chuyển phần còn lại sang trạng thái chờ có ngày. Ngày 4: tách nhóm bị chặn, gửi nhắc cho từng nút chặn. Ngày 5: gán ngày theo chủ đề cho hai dòng lớn nhất trong tuần tới. Ngày 6: bắt đầu viết ba dòng bàn giao mỗi lần rời một dòng việc. Ngày 7: dựng bảng trạng thái công khai, chia sẻ cho các bên liên quan và hẹn nhịp cập nhật.',
    evidence:
      'Hiện vật ở đây là bảng trạng thái nhiều dòng việc bạn đã duy trì trong vài tháng, kèm lịch sử cập nhật, và một trường hợp bạn đã chính thức tạm dừng hoặc đóng một dòng thay vì để nó chết âm thầm. Trong phỏng vấn cho các vị trí điều phối, vận hành, quản lý dự án hoặc trưởng nhóm, đây là câu trả lời cho câu hỏi khó nhất về đa nhiệm: bạn cho thấy mình quản lý được kỳ vọng của nhiều bên, chứ không chỉ chịu được khối lượng. Nếu bạn còn có số liệu về thời gian trung bình một việc đi từ lúc nhận đến lúc xong trước và sau khi đặt trần, đó là bằng chứng định lượng hiếm gặp.',
    references: [
      { label: 'Atlassian — hướng dẫn về Kanban và giới hạn công việc đang làm', url: 'https://www.atlassian.com/agile/kanban', type: 'article', needsReview: true },
      { label: 'Personal Kanban — phương pháp trực quan hóa công việc cá nhân', url: 'https://personalkanban.com/', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 11 · Quản lý năng lượng ────────────────────────────────────────
  guide({
    thesis:
      'Thời gian là mẫu số cố định, còn năng lượng là tử số thay đổi trong ngày — hai giờ lúc bạn tỉnh táo và hai giờ lúc bạn kiệt sức cho ra kết quả hoàn toàn khác nhau. Quản lý năng lượng là việc quan sát đường năng lượng của chính mình bằng số liệu thay vì bằng cảm tưởng, rồi xếp việc theo đường đó và thiết kế các quãng phục hồi có chủ đích. Đây là chương về hiệu suất bền vững, không phải chương y khoa: mọi dấu hiệu kéo dài như mệt mỏi triền miên, mất ngủ nhiều tuần hay tim đập bất thường đều cần được bác sĩ đánh giá chứ không tự xử lý bằng mẹo năng suất.',
    why: {
      work:
        'Xếp việc khó vào giờ năng lượng thấp là cách chắc chắn nhất để làm chậm và làm sai, rồi kết luận nhầm rằng bạn không đủ năng lực cho việc đó. Đổi thứ tự việc trong ngày thường tạo ra khác biệt lớn hơn nhiều so với cố gắng thêm.',
      interview:
        'Với vị trí có cường độ cao — tuyển dụng, tư vấn, chăm sóc khách hàng, vận hành ca — nhà tuyển dụng quan tâm bạn có duy trì được phong độ qua nhiều tháng không. Mô tả được cách bạn phục hồi và cách bạn nhận biết dấu hiệu quá tải là câu trả lời trưởng thành.',
      study:
        'Học vào giờ đầu óc tỉnh nhất với thời lượng ngắn thường hiệu quả hơn học lâu vào lúc đã mệt, đặc biệt với phần đòi hỏi hiểu khái niệm mới thay vì luyện lại thứ đã quen.',
      life:
        'Người thân thường nhận phần năng lượng còn lại sau khi công việc lấy hết. Chủ động giữ lại một phần cho buổi tối là một quyết định phân bổ, và nó cần được lên lịch chứ không thể trông chờ vào phần dư.',
    },
    framework: [
      {
        name: 'Nhìn năng lượng theo nhiều nguồn',
        detail:
          'Không chỉ có mệt về thể chất. Có mệt cảm xúc (sau các cuộc trò chuyện căng), mệt tinh thần (sau khi ra nhiều quyết định), và cạn ý nghĩa (làm nhiều việc mà không thấy chúng dẫn tới đâu). Bốn loại này cần bốn cách phục hồi khác nhau — đây là cách phân loại được Tony Schwartz phổ biến trong các tài liệu về năng lượng làm việc.',
      },
      {
        name: 'Đo đường năng lượng hai tuần',
        detail:
          'Chấm mức năng lượng theo thang 1-5 vào ba đến bốn mốc cố định mỗi ngày, kèm một từ về nguyên nhân. Hai tuần đủ để thấy dạng lặp lại, và dạng lặp lại của mỗi người khác nhau đáng kể nên không thể mượn lịch của người khác.',
      },
      {
        name: 'Xếp việc theo đường đã đo',
        detail:
          'Việc cần sáng tạo và quyết định vào đỉnh, việc lặp lại và hành chính vào trũng, việc cần cảm xúc tích cực vào đoạn bạn ổn định nhất. Nếu lịch không cho phép, ít nhất hãy tránh xếp việc quan trọng nhất vào trũng sâu nhất.',
      },
      {
        name: 'Thiết kế phục hồi theo nhịp',
        detail:
          'Nhiều người thấy mình làm việc tập trung tốt trong quãng khoảng 60-90 phút rồi cần nghỉ thật. Quãng nghỉ có tác dụng phải rời màn hình và tốt nhất là có vận động nhẹ hoặc ra ngoài; nghỉ bằng cách đổi loại màn hình gần như không phục hồi được gì.',
      },
      {
        name: 'Bảo vệ hai ranh giới cứng',
        detail:
          'Giờ ngủ và một khoảng ngắt việc cuối ngày là hai thứ nên được coi là ràng buộc chứ không phải biến số linh hoạt. Khi thiếu thời gian, chúng luôn là thứ bị cắt đầu tiên, và đó cũng là lý do vòng xoáy mệt mỏi hình thành.',
      },
      {
        name: 'Rà lại theo tháng và biết khi nào cần chuyên gia',
        detail:
          'Mỗi tháng nhìn lại đường năng lượng và các thay đổi đã thử. Nếu mức năng lượng thấp kéo dài nhiều tuần dù đã ngủ đủ, hoặc kèm dấu hiệu bất thường khác, đó là lúc gặp bác sĩ chứ không phải lúc thử thêm một kỹ thuật năng suất.',
      },
    ],
    scenario:
      'Một chuyên viên tuyển dụng ở công ty công nghệ thường có năm đến sáu buổi phỏng vấn mỗi ngày, xen kẽ với việc viết đánh giá ứng viên và trao đổi với các trưởng bộ phận. Sau ba tháng cao điểm, chị nhận ra các bản đánh giá viết sau 16 giờ luôn sơ sài và có hai lần chị nhớ nhầm chi tiết giữa hai ứng viên. Chị chấm năng lượng bốn mốc mỗi ngày trong hai tuần và thấy dạng khá rõ: mức tụt mạnh không tương ứng với số giờ đã làm mà tương ứng với số cuộc trò chuyện liên tiếp không có quãng nghỉ. Chị đề xuất ba thay đổi với trưởng bộ phận: tối đa ba buổi phỏng vấn liên tiếp rồi phải có quãng bốn mươi lăm phút; viết đánh giá ngay trong mười phút sau mỗi buổi thay vì dồn cuối ngày; và không xếp buổi phỏng vấn nào sau 16 giờ vào ngày có từ bốn buổi trở lên. Sau sáu tuần, chất lượng bản đánh giá được các trưởng bộ phận phản hồi là chi tiết hơn, và số buổi mỗi tuần chỉ giảm nhẹ vì phần lớn buổi được dồn về khung sáng. Chị cũng lưu ý một điều: giai đoạn đầu chị vẫn mệt như cũ, và phải sau khi ngủ đủ trở lại trong hai tuần thì thay đổi lịch mới phát huy tác dụng — nếu vấn đề nằm ở giấc ngủ thì sắp lịch khéo đến mấy cũng chỉ bù được một phần.',
    comparison: [
      {
        weak: 'Xếp lịch theo chỗ trống: việc nào cũng có thể nhét vào bất kỳ giờ nào miễn là lịch còn ô trống.',
        mature:
          'Xếp lịch theo loại năng lượng mà việc đó đòi hỏi, và giữ khung đỉnh cho loại việc không thể làm lại được nếu làm dở.',
      },
      {
        weak: 'Bù mệt bằng cà phê và làm tiếp, coi cơn tụt năng lượng là thứ phải vượt qua bằng ý chí.',
        mature:
          'Coi cơn tụt là tín hiệu đến hạn phục hồi, xử lý bằng nghỉ ngắn thật sự hoặc đổi loại việc, và chỉ dùng cà phê như công cụ có giới hạn chứ không như chiến lược.',
      },
      {
        weak: 'Đánh giá một thay đổi về nhịp làm việc chỉ sau hai ba ngày rồi bỏ vì chưa thấy khác biệt.',
        mature:
          'Giữ cách đo không đổi và quan sát ít nhất hai đến bốn tuần, vì dữ liệu ngắn ngày bị nhiễu rất mạnh bởi ngủ, bệnh vặt và biến động công việc.',
      },
    ],
    mistakes: [
      'Chỉ nghĩ về năng lượng thể chất mà bỏ qua mệt cảm xúc và mệt vì ra quá nhiều quyết định; hệ quả là bạn ngủ đủ mà vẫn cạn, rồi không hiểu vì sao.',
      'Sao chép lịch sinh hoạt của một người nổi tiếng nào đó, kể cả giờ dậy, mà không đo đường năng lượng của chính mình — dạng lặp lại của mỗi người khác nhau và bị chi phối bởi ca làm, gia đình, sức khỏe.',
      'Coi mệt kéo dài là chuyện đương nhiên của người đi làm và tự xử lý bằng thực phẩm chức năng hay uống nhiều cà phê hơn, trong khi mệt mỏi dai dẳng nhiều tuần là dấu hiệu nên được bác sĩ kiểm tra.',
    ],
    worksheet: [
      'Trong bảy ngày qua, thời điểm nào bạn thấy tỉnh táo nhất và thời điểm nào tụt sâu nhất? Bạn dựa vào quan sát nào để nói vậy?',
      'Loại việc nào làm bạn cạn nhanh nhất: việc thể chất, cuộc trò chuyện căng, việc phải ra nhiều quyết định, hay việc bạn không thấy ý nghĩa?',
      'Việc quan trọng nhất tuần này hiện đang nằm ở khung giờ nào? Khung đó thuộc đỉnh hay trũng của bạn?',
      'Bạn nghỉ giữa các phiên làm việc như thế nào? Ghi ra ba lần nghỉ gần nhất và điều bạn thực sự làm trong đó.',
      'Ranh giới cuối ngày của bạn là mấy giờ, và điều gì thường phá vỡ nó? Viết trước một cách xử lý cho tình huống đó.',
    ],
    exercises: [
      {
        label: 'Bốn mốc mỗi ngày',
        text: 'Trong mười bốn ngày, chấm mức năng lượng 1-5 vào bốn mốc cố định kèm một từ về nguyên nhân. Không thay đổi gì trong giai đoạn này; đây là đường nền để so sánh về sau.',
        level: 'e',
      },
      {
        label: 'Phân loại nguồn cạn',
        text: 'Liệt kê mười hoạt động trong tuần và gắn nhãn loại năng lượng bị tiêu: thể chất, cảm xúc, tinh thần, ý nghĩa. Ghi hoạt động nào tiêu nhiều nhất ở mỗi loại và cách phục hồi tương ứng bạn định thử.',
        level: 'e',
      },
      {
        label: 'Đổi chỗ hai việc',
        text: 'Chọn một việc quan trọng đang nằm ở khung trũng và một việc hành chính đang nằm ở khung đỉnh, rồi đổi chỗ chúng trong một tuần. Ghi lại chất lượng và thời gian hoàn thành của cả hai việc trước và sau khi đổi.',
        level: 'e',
      },
      {
        label: 'Nghỉ rời màn hình',
        text: 'Trong mười ngày, sau mỗi phiên tập trung dài, nghỉ 5-10 phút rời hẳn màn hình, tốt nhất là đi lại hoặc ra ngoài. Chấm năng lượng cuối ngày và so với giai đoạn đường nền.',
        level: 'm',
      },
      {
        label: 'Giới hạn chuỗi cuộc trò chuyện',
        text: 'Đặt trần số cuộc họp hoặc cuộc trò chuyện căng liên tiếp trong ngày và chèn quãng phục hồi giữa các chuỗi. Chạy hai tuần và ghi lại chất lượng công việc làm sau chuỗi cuối cùng.',
        level: 'm',
      },
      {
        label: 'Ranh giới cuối ngày',
        text: 'Chọn một giờ ngắt việc cố định và giữ trong mười ngày, kèm nghi thức đóng ngày ngắn. Ghi số ngày giữ được, lý do những ngày hỏng, và mức bận tâm về công việc trong buổi tối theo thang 1-5.',
        level: 'm',
      },
      {
        label: 'Một thay đổi trong bốn tuần',
        text: 'Chọn đúng một đòn bẩy (giờ ngủ cố định, nghỉ giữa phiên, hoặc trần cuộc họp liên tiếp), giữ mọi thứ khác không đổi và chạy bốn tuần với cùng cách đo. Vẽ đường xu hướng và viết kết luận có điều kiện kèm những yếu tố nhiễu bạn không kiểm soát được.',
        level: 'h',
      },
      {
        label: 'Thiết kế lại một tuần theo năng lượng',
        text: 'Dựa trên đường năng lượng đã đo, thiết kế lại toàn bộ tuần làm việc: loại việc nào vào khung nào, quãng phục hồi đặt ở đâu, ranh giới cứng là gì. Trình bày phần cần người khác đồng ý (lịch họp, giờ trực) và ghi lại kết quả thương lượng.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao hai người có cùng số giờ làm việc lại cho kết quả rất khác nhau?',
        a: 'Vì kết quả phụ thuộc vào tích của thời gian và mức năng lượng trong khoảng thời gian đó, chứ không chỉ vào thời gian. Cùng hai giờ, một người làm ở đỉnh tỉnh táo với việc phù hợp, người kia làm ở trũng sau một chuỗi cuộc họp căng; chênh lệch đầu ra có thể rất lớn dù bảng chấm công giống nhau.',
      },
      {
        q: 'Bạn ngủ đủ nhưng vẫn cạn năng lượng vào giữa buổi chiều. Nên xem xét điều gì?',
        a: 'Xem lại các nguồn cạn ngoài thể chất: số cuộc trò chuyện căng liên tiếp, số quyết định phải ra, và mức ý nghĩa của công việc đang làm. Đồng thời xem cách bạn nghỉ — nghỉ mà vẫn nhìn màn hình gần như không phục hồi. Nếu tình trạng kéo dài nhiều tuần dù đã điều chỉnh, hãy đi khám để loại trừ nguyên nhân sức khỏe.',
      },
      {
        q: 'Lịch làm việc của bạn do người khác quyết định phần lớn. Còn quản lý năng lượng được không?',
        a: 'Được, nhưng ở phạm vi hẹp hơn và cần thương lượng cụ thể. Ba đòn bẩy thường vẫn nằm trong tầm tay: chọn thứ tự các việc bạn tự chủ được trong ngày, chèn quãng phục hồi ngắn giữa các chuỗi căng, và đề nghị một thay đổi lịch duy nhất kèm lý do dựa trên dữ liệu chất lượng công việc — đề nghị có số liệu dễ được chấp nhận hơn nhiều so với đề nghị dựa trên cảm giác mệt.',
      },
    ],
    plan7:
      'Ngày 1-2: chấm năng lượng bốn mốc mỗi ngày, không thay đổi gì. Ngày 3: phân loại mười hoạt động theo bốn nguồn cạn. Ngày 4: đổi chỗ một việc quan trọng ra khỏi khung trũng. Ngày 5: chèn quãng nghỉ rời màn hình sau mỗi phiên dài và ghi năng lượng cuối ngày. Ngày 6: đặt một ranh giới cuối ngày và nghi thức đóng ngày. Ngày 7: nhìn lại bảy ngày, chọn đúng một đòn bẩy để chạy tiếp bốn tuần và ghi cách bạn sẽ đo nó.',
    evidence:
      'Hiện vật của chương này là bảng đường năng lượng bốn tuần kèm một thay đổi lịch làm việc bạn đã đề xuất và được chấp nhận, cùng bằng chứng về chất lượng công việc trước và sau (ví dụ phản hồi về chất lượng tài liệu, số lỗi phải sửa, số buổi xử lý được mỗi tuần). Trong phỏng vấn các vị trí cường độ cao, đây là cách trả lời câu hỏi về áp lực mà không rơi vào hai cực dở: khoe chịu được mọi thứ, hoặc kể khổ. Nếu bạn quản lý nhóm, một đề xuất về nhịp làm việc dựa trên dữ liệu là bằng chứng bạn biết giữ cho đội bền chứ không chỉ chạy nhanh một quý.',
    references: [
      { label: 'American Psychological Association — chuyên mục Sleep và ảnh hưởng tới hiệu suất', url: 'https://www.apa.org/topics/sleep', type: 'article' },
      { label: 'NHS — hướng dẫn vận động thể chất cho người trưởng thành', url: 'https://www.nhs.uk/live-well/exercise/', type: 'article' },
    ],
    diagram: 'cycle',
  }),

  // ── Chương 12 · Nói "không" và đặt ranh giới ──────────────────────────────
  guide({
    thesis:
      'Nói không không phải kỹ năng ngôn từ mà là kỹ năng số học cộng với kỹ năng chịu đựng một khoảnh khắc khó chịu. Số học ở chỗ: nếu bạn không biết mình còn bao nhiêu giờ và đang cam kết những gì, mọi lời từ chối đều nghe như tùy hứng và mọi lời đồng ý đều là lời hứa mù. Chịu đựng ở chỗ: phần khó nhất của việc từ chối không phải câu nói, mà là vài giây im lặng sau đó và cảm giác sợ bị coi là không nhiệt tình. Ranh giới bền là ranh giới được cài vào quy trình, không phải ranh giới phải phòng thủ lại mỗi lần.',
    why: {
      work:
        'Người nhận mọi việc thường bị đánh giá thấp hơn người biết chọn, vì kết quả của họ dàn mỏng và không có gì nổi bật. Từ chối có phương án thay thế còn làm tăng độ tin cậy: đồng nghiệp biết rằng khi bạn nhận thì bạn thật sự làm.',
      interview:
        'Câu "kể về một lần bạn phải từ chối yêu cầu của cấp trên hoặc khách hàng" xuất hiện nhiều hơn người ta tưởng, và nó đo mức chín chắn: bạn có nêu được lý do dựa trên năng lực thực tế, có đưa phương án, và có giữ được quan hệ sau đó hay không.',
      study:
        'Người học thường thất bại vì nhận quá nhiều: hai khóa cùng lúc, một câu lạc bộ, một việc làm thêm. Từ chối bớt một thứ là điều kiện để phần còn lại đủ sâu để tạo ra kết quả có thể mang đi xin việc.',
      life:
        'Ranh giới trong đời sống — với họ hàng, bạn bè, hàng xóm, hoặc với chính điện thoại của bạn buổi tối — quyết định phần lớn chất lượng thời gian riêng. Không có ranh giới thì thời gian riêng chỉ là phần còn thừa sau khi mọi người khác đã lấy phần của họ.',
    },
    framework: [
      {
        name: 'Biết trần trước khi bị hỏi',
        detail:
          'Nắm sẵn số giờ chủ động còn lại trong tuần và danh sách cam kết đang chạy. Người không biết trần của mình luôn trả lời theo cảm giác lúc đó, và cảm giác lúc được nhờ thường là muốn giúp.',
      },
      {
        name: 'Mua thời gian trước khi trả lời',
        detail:
          'Một câu cố định: "để tôi xem lại lịch và trả lời anh trước 4 giờ chiều". Khoảng trễ này tách quyết định ra khỏi áp lực xã hội tại chỗ, và trong phần lớn trường hợp không ai phiền lòng vì chờ vài giờ.',
      },
      {
        name: 'Từ chối theo ba phần',
        detail:
          'Ghi nhận yêu cầu và cho thấy bạn đã hiểu nó; nêu ràng buộc thật bằng dữ kiện chứ không bằng cảm giác bận; đưa ít nhất một phương án — làm sau, làm một phần, người khác làm, hoặc đổi việc khác ra. Thiếu phần thứ ba, lời từ chối dễ bị hiểu là không hợp tác.',
      },
      {
        name: 'Đặt ranh giới bằng quy trình',
        detail:
          'Thay vì từ chối lặp lại từng lần, hãy đổi luật: yêu cầu phải đi qua biểu mẫu, có ngày cắt hạn nhận việc trong tuần, có mức tối thiểu cho việc nhận ngoài kế hoạch. Quy trình chịu áp lực xã hội thay bạn.',
      },
      {
        name: 'Chịu khoảnh khắc khó chịu và theo dõi hậu quả thật',
        detail:
          'Sau khi từ chối, ghi lại điều bạn sợ sẽ xảy ra và điều thật sự đã xảy ra sau một tuần. Đa số nỗi sợ không thành hiện thực, và bảng đối chiếu này là thứ giúp bạn từ chối dễ hơn ở lần sau chứ không phải lời khuyên hãy tự tin lên.',
      },
    ],
    scenario:
      'Một chuyên viên marketing in-house là người duy nhất biết dùng công cụ thiết kế trong công ty, nên mọi phòng ban đều nhắn nhờ làm ảnh gấp: hôm nay là ba ảnh cho phòng kinh doanh, mai là banner cho sự kiện nội bộ. Chị nhận hết vì sợ bị coi là khó tính, và hệ quả là chiến dịch chính của quý luôn bị đẩy lùi. Chị không bắt đầu bằng việc tập nói không, mà bắt đầu bằng đếm: trong bốn tuần chị ghi lại mọi yêu cầu ngoài kế hoạch cùng thời gian thực tế đã bỏ ra. Con số cho thấy loại việc này chiếm hơn một phần ba quỹ giờ chủ động của chị. Chị mang số liệu đó cho trưởng phòng và đề xuất một quy trình thay vì xin quyền từ chối: mọi yêu cầu thiết kế đi qua một biểu mẫu, hạn nhận là thứ Tư hằng tuần cho tuần kế tiếp, có ba mẫu sẵn cho các nhu cầu lặp lại để phòng ban tự dùng, và mỗi tuần chừa một suất cho việc thật sự gấp. Sau hai tháng, số yêu cầu ngoài kế hoạch giảm rõ vì phần lớn người nhờ chỉ cần một mẫu có sẵn. Chị cũng thừa nhận phần khó: trong ba tuần đầu chị vẫn phải từ chối trực tiếp bốn lần, hai lần bị phản ứng khó chịu, và điều giúp chị đứng vững không phải sự tự tin mà là việc trưởng phòng đã đồng ý bằng văn bản với quy trình mới.',
    comparison: [
      {
        weak: 'Từ chối bằng lý do chung chung "dạo này em bận quá", nghe như lời than và dễ bị lật lại bằng câu "cái này nhanh thôi mà".',
        mature:
          'Từ chối bằng dữ kiện cụ thể: đang có ba việc với hạn nào, quỹ giờ còn bao nhiêu, việc mới cần bao nhiêu — rồi mời người kia cùng chọn thứ tự.',
      },
      {
        weak: 'Đồng ý ngay tại chỗ để tránh khó xử, rồi âm thầm làm ngoài giờ hoặc trễ một việc khác mà không ai được báo.',
        mature:
          'Mua thời gian bằng một câu chuẩn, kiểm tra lịch, rồi trả lời trong ngày — kể cả khi câu trả lời cuối cùng vẫn là đồng ý, nó là đồng ý có tính toán.',
      },
      {
        weak: 'Từ chối lặp đi lặp lại cùng một loại yêu cầu bằng ý chí cá nhân, mỗi lần lại tốn năng lượng và tạo cảm giác căng thẳng với người nhờ.',
        mature:
          'Đổi luật một lần: quy trình, hạn nhận việc, mẫu tự phục vụ — sau đó người ta điều chỉnh theo quy trình chứ không phải va vào cá nhân bạn.',
      },
    ],
    mistakes: [
      'Giải thích quá dài khi từ chối; càng nhiều lý do càng nhiều điểm để người kia phản bác, và bản thân độ dài phát tín hiệu rằng quyết định còn có thể lay chuyển.',
      'Nói không mà không đưa phương án nào, khiến người nhờ mắc kẹt và ghi nhận bạn là người gây tắc — trong khi chỉ cần thêm một câu gợi ý hướng khác là quan hệ được giữ nguyên.',
      'Đặt ranh giới rồi tự phá lần đầu tiên vì thấy áy náy; một lần phá làm mất toàn bộ giá trị của ranh giới, vì từ đó mọi người biết rằng nó thương lượng được nếu đủ kiên trì.',
    ],
    worksheet: [
      'Trong bốn tuần qua, bạn đã nhận bao nhiêu yêu cầu ngoài kế hoạch, và tổng thời gian thực tế chúng chiếm là bao nhiêu?',
      'Loại yêu cầu nào lặp lại nhiều nhất? Có thể xử lý bằng một mẫu sẵn hoặc một hướng dẫn tự phục vụ không?',
      'Câu mua thời gian của bạn sẽ là câu gì? Viết nguyên văn và tập nói nó một lần thành tiếng.',
      'Lần gần nhất bạn đồng ý trong khi thật ra muốn từ chối: điều gì khiến bạn đồng ý, và hậu quả cụ thể là gì?',
      'Ranh giới nào bạn muốn thiết lập trong tháng này, ai cần biết về nó, và bạn sẽ cài nó vào quy trình nào để không phải bảo vệ nó mỗi ngày?',
    ],
    exercises: [
      {
        label: 'Đếm yêu cầu ngoài kế hoạch',
        text: 'Trong hai tuần, ghi lại mọi yêu cầu đến ngoài kế hoạch: ai nhờ, việc gì, thời gian thực tế đã bỏ ra. Cuối kỳ tính tổng số giờ và tỷ lệ trên quỹ giờ chủ động của bạn.',
        level: 'e',
      },
      {
        label: 'Câu mua thời gian',
        text: 'Soạn một câu cố định để không trả lời ngay và dùng nó ít nhất năm lần trong tuần. Ghi lại có ai tỏ ra khó chịu vì phải chờ vài giờ không, và bao nhiêu yêu cầu tự biến mất trong khoảng chờ đó.',
        level: 'e',
      },
      {
        label: 'Viết ba lời từ chối',
        text: 'Lấy ba yêu cầu bạn đã nhận nhưng lẽ ra nên từ chối, viết lại câu trả lời theo cấu trúc ba phần: ghi nhận, ràng buộc bằng dữ kiện, phương án thay thế. Đọc to và rút gọn mỗi câu xuống dưới bốn dòng.',
        level: 'e',
      },
      {
        label: 'Từ chối thật một lần',
        text: 'Chọn một yêu cầu thật trong tuần và từ chối theo cấu trúc ba phần. Trước khi nói, viết ra điều bạn sợ sẽ xảy ra; sau một tuần, viết điều thật sự đã xảy ra và so hai bản.',
        level: 'm',
      },
      {
        label: 'Bảng đối chiếu nỗi sợ',
        text: 'Trong một tháng, mỗi lần từ chối hoặc đặt ranh giới, ghi hai cột: nỗi sợ trước và hậu quả thật sau bảy ngày. Cuối tháng đếm tỷ lệ nỗi sợ thành hiện thực và dùng con số đó khi do dự lần sau.',
        level: 'm',
      },
      {
        label: 'Đề xuất một quy trình',
        text: 'Chọn loại yêu cầu lặp lại nhiều nhất và soạn đề xuất một trang: hiện trạng bằng số liệu, quy trình mới, mẫu tự phục vụ, và cách xử lý việc thật sự gấp. Trình bày với người quản lý và xin xác nhận bằng văn bản.',
        level: 'm',
      },
      {
        label: 'Ranh giới ngoài công việc',
        text: 'Chọn một ranh giới trong đời sống cá nhân (giờ ngừng nhận tin nhắn công việc, buổi tối không mang máy tính về, một buổi cố định cho gia đình). Giữ nó ba tuần, ghi những lần bị thử thách và cách bạn phản hồi.',
        level: 'h',
      },
      {
        label: 'Rà soát toàn bộ cam kết',
        text: 'Liệt kê mọi cam kết định kỳ bạn đang giữ (họp, nhóm, việc phụ, giúp đỡ định kỳ). Với từng cái, viết giá trị nhận được và chi phí thời gian. Chọn hai cái để rút lui và thực hiện việc rút lui đó một cách đàng hoàng: báo trước, bàn giao, đề xuất người thay.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao "dạo này em hơi bận" là một lời từ chối yếu?',
        a: 'Vì nó không nêu dữ kiện nên không kiểm chứng được, và nó đặt cuộc trao đổi lên bình diện cảm giác, nơi người kia dễ phản bác bằng "việc này nhanh thôi". Thay bằng ràng buộc cụ thể: các cam kết đang chạy, hạn của chúng, số giờ còn lại, rồi mời họ tham gia vào quyết định thứ tự.',
      },
      {
        q: 'Bạn từ chối và người kia tỏ ra khó chịu. Điều đó có nghĩa là bạn đã làm sai không?',
        a: 'Không nhất thiết. Một lời từ chối đúng vẫn có thể gây khó chịu tức thời, vì người kia phải tự giải quyết vấn đề của họ. Thước đo hợp lý là hậu quả sau vài tuần: quan hệ công việc, mức độ tin cậy, và chất lượng những việc bạn đã nhận. Nếu bạn liên tục bị phản ứng nặng ở mọi lời từ chối, vấn đề có thể nằm ở cách nói hoặc ở môi trường làm việc, và cả hai đều cần được xem xét riêng.',
      },
      {
        q: 'Làm sao để không phải từ chối cùng một loại việc mãi?',
        a: 'Chuyển từ quyết định cá nhân sang thiết kế hệ thống: biểu mẫu tiếp nhận, hạn nhận việc trong tuần, mẫu tự phục vụ cho nhu cầu lặp lại, và một suất dự trữ cho việc thật sự gấp. Khi luật rõ và được cấp trên xác nhận, phần lớn yêu cầu sẽ tự đi theo luật, và bạn chỉ còn phải xử lý các ngoại lệ thật.',
      },
    ],
    plan7:
      'Ngày 1: đếm và ghi lại mọi yêu cầu ngoài kế hoạch cùng thời gian thực tế. Ngày 2: tính quỹ giờ chủ động còn lại và danh sách cam kết đang chạy để biết trần của mình. Ngày 3: soạn câu mua thời gian và dùng nó ít nhất hai lần. Ngày 4: viết lại ba lời từ chối theo cấu trúc ba phần. Ngày 5: từ chối thật một yêu cầu, ghi trước nỗi sợ của bạn. Ngày 6: soạn đề xuất quy trình cho loại yêu cầu lặp lại nhiều nhất. Ngày 7: trình bày đề xuất, và ghi lại hậu quả thật của lời từ chối ngày thứ năm.',
    evidence:
      'Bằng chứng mạnh nhất ở đây không phải câu chuyện bạn đã dám nói không, mà là quy trình bạn đã thiết kế và được duyệt: bản đề xuất một trang có số liệu hiện trạng, luật mới, mẫu tự phục vụ, và kết quả sau vài tháng (số yêu cầu ngoài kế hoạch giảm, thời gian dành cho việc chính tăng). Trong phỏng vấn, dùng nó cho câu hỏi về từ chối hoặc về việc bảo vệ trọng tâm công việc — bạn cho thấy mình giải quyết vấn đề ở cấp hệ thống thay vì chịu đựng ở cấp cá nhân. Giữ thêm bảng đối chiếu nỗi sợ và hậu quả thật; nó không đưa vào CV nhưng là thứ giúp bạn trả lời tự tin.',
    references: [
      { label: 'PositivePsychology.com — Assertiveness: kỹ năng giao tiếp quyết đoán', url: 'https://positivepsychology.com/assertiveness/', type: 'article' },
      { label: 'The Muse — chuyên mục lời khuyên nghề nghiệp và ứng xử nơi làm việc', url: 'https://www.themuse.com/advice', type: 'article', needsReview: true },
    ],
  }),

  // ── Chương 13 · Đánh giá hiệu suất cá nhân ────────────────────────────────
  guide({
    thesis:
      'Đánh giá hiệu suất cá nhân là việc biến cảm giác "tháng này mình làm được nhiều" thành một vài con số và hiện vật có thể kiểm chứng, rồi đọc chúng theo xu hướng chứ không theo từng điểm. Hai cái bẫy đối xứng cần tránh: đo những thứ dễ đếm nhưng không nói lên giá trị (số giờ ngồi, số việc đã tích, số tin nhắn trả lời), và không đo gì cả rồi để cấp trên hoặc tâm trạng của chính bạn quyết định câu chuyện. Mục tiêu cuối cùng không phải chấm điểm bản thân, mà là biết nên thay đổi đúng một thứ nào trong kỳ tới.',
    why: {
      work:
        'Đến kỳ đánh giá, người có sổ ghi kết quả theo tuần trình bày được câu chuyện có bằng chứng, còn người không có sẽ chỉ nhớ được vài tuần gần nhất — và trí nhớ ngắn hạn đó thường không chứa những đóng góp lớn nhất của cả năm.',
      interview:
        'Gần như mọi cuộc phỏng vấn đều hỏi về thành tựu kèm con số. Người có thói quen tự đo trả lời được ngay bằng dữ kiện; người không có sẽ phải ước lượng tại chỗ, và những con số ước lượng tại chỗ thường nghe không đáng tin hoặc bị hỏi ngược đến chỗ không trả lời được.',
      study:
        'Tự đánh giá việc học bằng kết quả bài kiểm tra tự tạo chính xác hơn nhiều so với cảm giác quen thuộc khi đọc lại tài liệu, vì cảm giác quen thuộc tăng nhanh hơn năng lực thật.',
      life:
        'Các mục tiêu cá nhân dài hạn — sức khỏe, tài chính, quan hệ — cần chỉ số đơn giản và nhịp xem lại, nếu không chúng sẽ chỉ được nhớ đến vào dịp cuối năm, khi đã quá muộn để điều chỉnh.',
    },
    framework: [
      {
        name: 'Chọn ít chỉ số, đủ hai loại',
        detail:
          'Mỗi vai trò chỉ cần khoảng ba đến năm chỉ số, gồm chỉ số kết quả (thứ người khác nhận được) và chỉ số dẫn (hành vi của bạn tạo ra kết quả đó). Chỉ có chỉ số kết quả thì bạn biết mình tụt mà không biết vì sao; chỉ có chỉ số dẫn thì bạn có thể rất bận mà không tạo ra giá trị.',
      },
      {
        name: 'Ghi sổ kết quả hằng tuần',
        detail:
          'Mỗi tuần năm phút, viết: đã giao được gì, ai nhận, phản hồi ra sao, con số nếu có. Viết ngay trong tuần vì chi tiết phai rất nhanh, và chính những chi tiết đó làm nên sức nặng của câu chuyện khi phỏng vấn hoặc đánh giá.',
      },
      {
        name: 'Đọc theo xu hướng, không theo điểm đơn',
        detail:
          'Một tuần tệ có thể do ốm, do một sự cố, do lịch họp bất thường. Chỉ đưa ra kết luận khi nhìn ít nhất bốn đến sáu kỳ liên tiếp, và luôn ghi chú các yếu tố nhiễu đã biết bên cạnh số liệu.',
      },
      {
        name: 'Lấy ít nhất một nguồn ngoài',
        detail:
          'Tự chấm điểm dễ trôi theo tâm trạng. Ghép thêm dữ liệu ngoài: phản hồi cụ thể từ hai người làm việc gần bạn, số liệu từ hệ thống, hoặc kết quả nghiệm thu của người nhận sản phẩm. Chỗ lệch giữa tự đánh giá và nguồn ngoài mới là chỗ đáng phân tích nhất.',
      },
      {
        name: 'Kết luận có điều kiện và một thay đổi duy nhất',
        detail:
          'Kết thúc mỗi kỳ bằng một câu dạng "khi X thì tôi thường Y" và đúng một thay đổi cho kỳ sau. Nhiều thay đổi cùng lúc khiến kỳ sau không quy kết được cải thiện cho cái nào, và thường không thay đổi nào sống sót.',
      },
    ],
    scenario:
      'Một chuyên viên phân tích nghiệp vụ ở công ty bảo hiểm bước vào kỳ đánh giá cuối năm với cảm giác mình làm rất nhiều nhưng không nói được cụ thể là gì, và bị xếp mức trung bình hai năm liền. Năm sau anh làm ba việc. Một, chọn bốn chỉ số: số tài liệu yêu cầu được các bên duyệt trong vòng một lần chỉnh sửa (kết quả), số ngày trung bình từ lúc nhận yêu cầu tới lúc có bản đầu tiên (kết quả), số buổi làm việc trực tiếp với người dùng cuối mỗi tháng (dẫn), và số lần phát hiện sớm mâu thuẫn yêu cầu trước khi vào giai đoạn phát triển (dẫn). Hai, mỗi chiều thứ Sáu anh dành năm phút ghi sổ kết quả tuần. Ba, mỗi quý anh xin phản hồi hẹp từ hai người: một trưởng nhóm phát triển và một người dùng nghiệp vụ, với câu hỏi cụ thể về chỗ tài liệu của anh gây hiểu nhầm. Cuối năm, sổ của anh cho thấy tỷ lệ tài liệu duyệt một lần tăng rõ ở nửa cuối năm, và điều bất ngờ là chỉ số dẫn về số buổi làm việc với người dùng cuối tương quan chặt với chỉ số đó — số buổi tăng vào các tháng tỷ lệ duyệt cao. Anh không kết luận rằng cái này gây ra cái kia, nhưng anh có đủ cơ sở để đề xuất giữ tối thiểu bốn buổi mỗi tháng như một phần công việc chính thức, và bản tự đánh giá của anh năm đó lần đầu tiên có bằng chứng thay vì tính từ.',
    comparison: [
      {
        weak: 'Đo bằng những gì dễ đếm: số giờ làm, số việc đã tích, số email đã trả lời — rồi tối ưu đúng những con số đó và bận rộn hơn mà không giá trị hơn.',
        mature:
          'Đo bằng thứ người nhận thật sự quan tâm (chất lượng, thời gian chờ, số lần phải làm lại), kèm một vài chỉ số dẫn giải thích được vì sao kết quả lên hay xuống.',
      },
      {
        weak: 'Đến kỳ đánh giá mới ngồi nhớ lại cả năm, nên phần lớn câu chuyện đến từ hai tháng gần nhất và những việc gây ấn tượng nhất thời.',
        mature:
          'Có sổ ghi hằng tuần nên bản tự đánh giá chỉ là việc tổng hợp; các đóng góp đầu năm không bị mất và các con số có thể truy lại nguồn.',
      },
      {
        weak: 'Chỉ dựa vào tự cảm nhận, nên tháng tâm trạng tốt thì thấy mình giỏi, tháng mệt thì thấy mình vô dụng.',
        mature:
          'Ghép tự đánh giá với ít nhất một nguồn ngoài, và coi phần lệch giữa hai nguồn là chủ đề chính để tìm hiểu chứ không phải điều để tự bảo vệ.',
      },
    ],
    mistakes: [
      'Chọn quá nhiều chỉ số vì sợ bỏ sót, dẫn tới việc đo trở thành gánh nặng rồi bị bỏ sau ba tuần; ba đến năm chỉ số duy trì được cả năm có giá trị hơn mười lăm chỉ số duy trì được một tháng.',
      'Kết luận từ một kỳ duy nhất: một tuần kết quả kém liền đổi cách làm việc, rồi tuần sau lại đổi tiếp, nên không thay đổi nào có đủ thời gian để cho thấy tác dụng.',
      'Chỉ ghi thành công vào sổ kết quả và bỏ qua các lần thất bại cùng bài học; sổ như vậy không dùng được để cải thiện, và khi phỏng vấn bạn cũng không kể được câu chuyện về việc học từ sai lầm — vốn là câu hỏi gần như chắc chắn sẽ được hỏi.',
    ],
    worksheet: [
      'Nếu phải chứng minh giá trị công việc của bạn trong sáu tháng qua bằng ba con số, đó là ba con số nào và bạn lấy chúng ở đâu?',
      'Với mỗi chỉ số kết quả vừa nêu, hành vi nào của bạn tạo ra nó? Đó chính là ứng viên cho chỉ số dẫn.',
      'Bạn đang đo thứ gì chỉ vì nó dễ đếm? Điều gì sẽ xảy ra nếu bạn tối đa hóa đúng con số đó?',
      'Hai người nào làm việc gần bạn nhất có thể cho phản hồi cụ thể? Câu hỏi hẹp bạn sẽ gửi cho từng người là gì?',
      'Sau kỳ đánh giá gần nhất, đúng một thay đổi bạn sẽ thực hiện trong kỳ tới là gì, và dấu hiệu nào cho biết nó có tác dụng?',
    ],
    exercises: [
      {
        label: 'Chọn bốn chỉ số',
        text: 'Viết mười thứ có thể đo trong vai trò của bạn, rồi ép xuống bốn: hai chỉ số kết quả và hai chỉ số dẫn. Với mỗi chỉ số, ghi nguồn dữ liệu và tần suất thu thập.',
        level: 'e',
      },
      {
        label: 'Sổ kết quả năm phút',
        text: 'Mỗi chiều thứ Sáu trong bốn tuần, viết bốn dòng: đã giao gì, ai nhận, phản hồi ra sao, con số nếu có. Cuối bốn tuần đọc lại và đánh dấu những mục bạn đã quên nếu không ghi.',
        level: 'e',
      },
      {
        label: 'Truy nguồn một con số',
        text: 'Lấy một con số bạn hay nói về công việc của mình và truy xem nó đến từ đâu, tính thế nào, có ai xác nhận không. Nếu không truy được, hãy tìm cách thay bằng con số có nguồn.',
        level: 'e',
      },
      {
        label: 'Ba câu hỏi phản hồi hẹp',
        text: 'Gửi cho hai đồng nghiệp mỗi người một câu hỏi hẹp gắn với một sản phẩm cụ thể bạn đã giao trong tháng, ví dụ chỗ nào trong tài liệu khiến họ phải đọc lại hai lần. Ghi lại nguyên văn câu trả lời, không giải thích lại.',
        level: 'm',
      },
      {
        label: 'Đối chiếu trong và ngoài',
        text: 'Tự chấm 1-5 trên bốn tiêu chí công việc, rồi nhờ một người làm việc gần bạn chấm cùng bộ tiêu chí. Chỉ phân tích những ô lệch từ hai điểm trở lên và viết giả thuyết cho từng chỗ lệch.',
        level: 'm',
      },
      {
        label: 'Đọc xu hướng sáu tuần',
        text: 'Vẽ bốn chỉ số của bạn theo sáu tuần liên tiếp, ghi chú các yếu tố nhiễu đã biết bên cạnh từng tuần. Viết một đoạn kết luận có điều kiện và nêu rõ điều gì bạn chưa kết luận được với dữ liệu hiện có.',
        level: 'm',
      },
      {
        label: 'Bản tự đánh giá có bằng chứng',
        text: 'Viết bản tự đánh giá một trang cho quý vừa qua gồm: kết quả kèm số liệu và nguồn, hai thất bại kèm bài học, phản hồi ngoài đã nhận, và một đề xuất cho kỳ tới. Đưa cho quản lý trực tiếp và ghi lại phần họ bổ sung hoặc phản bác.',
        level: 'h',
      },
      {
        label: 'Một thay đổi, một quý',
        text: 'Chọn đúng một thay đổi trong cách làm việc dựa trên dữ liệu bạn có, giữ nguyên bộ chỉ số và cách đo, chạy trọn một quý. Cuối quý viết kết luận nêu rõ điều gì đã cải thiện, điều gì không, và những nguyên nhân khác có thể giải thích kết quả.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao chỉ đo chỉ số kết quả là chưa đủ?',
        a: 'Vì chỉ số kết quả thường trễ và chịu ảnh hưởng của nhiều yếu tố ngoài tầm kiểm soát của bạn, nên khi nó xấu đi bạn biết có vấn đề nhưng không biết can thiệp vào đâu. Chỉ số dẫn mô tả hành vi bạn kiểm soát được và thường thay đổi sớm hơn, nên nó cho bạn chỗ để tác động và cho tín hiệu sớm khi mọi thứ bắt đầu lệch.',
      },
      {
        q: 'Điều gì nguy hiểm khi chọn chỉ số dễ đếm như số việc hoàn thành?',
        a: 'Chỉ số được đo sẽ được tối ưu, kể cả khi nó không phản ánh giá trị. Đếm số việc hoàn thành khuyến khích chọn việc nhỏ và dễ, chia nhỏ việc để có nhiều dòng hơn, và né việc lớn không chắc chắn. Cách phòng là luôn ghép một chỉ số về chất lượng hoặc về giá trị người nhận, và định kỳ hỏi chỉ số này đang khuyến khích tôi làm gì.',
      },
      {
        q: 'Tự đánh giá của bạn cao hơn hẳn phản hồi từ đồng nghiệp. Xử lý chỗ lệch đó thế nào?',
        a: 'Không vội kết luận ai đúng. Tìm dữ kiện cụ thể phía sau phản hồi bằng câu hỏi hẹp gắn với một sản phẩm và một thời điểm. Thường chỗ lệch không nằm ở năng lực mà ở phần công việc người khác không nhìn thấy, hoặc ở tiêu chí khác nhau về thế nào là xong. Cả hai khả năng đó đều dẫn tới hành động cụ thể: làm cho công việc dễ nhìn thấy hơn, hoặc thống nhất lại tiêu chí nghiệm thu.',
      },
    ],
    plan7:
      'Ngày 1: viết mười thứ có thể đo trong vai trò của bạn và ép xuống bốn chỉ số, hai loại. Ngày 2: xác định nguồn dữ liệu và tần suất cho từng chỉ số. Ngày 3: dựng sổ kết quả và ghi bù bốn tuần gần nhất từ email, lịch và tin nhắn. Ngày 4: gửi hai câu hỏi phản hồi hẹp cho hai người làm việc gần bạn. Ngày 5: tự chấm bốn tiêu chí và nhờ một người chấm cùng bộ đó. Ngày 6: phân tích các ô lệch từ hai điểm trở lên, viết giả thuyết. Ngày 7: viết bản tự đánh giá một trang có bằng chứng và chọn đúng một thay đổi cho quý tới.',
    evidence:
      'Chương này tạo ra chính hiện vật mà cả cuốn sách hướng tới: một bản tự đánh giá một trang có số liệu truy được nguồn, hai thất bại kèm bài học, phản hồi ngoài nguyên văn, và một đề xuất cho kỳ tới. Từ sổ kết quả hằng tuần, bạn rút ra được ba đến năm câu chuyện STAR đã có sẵn con số cho phỏng vấn, và cập nhật CV bằng dòng mô tả kết quả thay vì mô tả nhiệm vụ. Nếu bạn đang đề nghị tăng lương hay thăng tiến, chính bộ dữ liệu theo tuần này là thứ biến cuộc trao đổi từ chuyện cảm nhận thành chuyện bằng chứng — và nó phải được tích lũy trước đó nhiều tháng, không thể dựng lại vào tuần trước cuộc họp.',
    references: [
      { label: 'Farnam Street — nhật ký quyết định và cách tự đánh giá có bằng chứng', url: 'https://fs.blog/decision-journal/', type: 'article' },
      { label: 'Gallup Workplace — nghiên cứu về hiệu suất và quản lý hiệu suất', url: 'https://www.gallup.com/workplace/', type: 'article', needsReview: true },
    ],
    diagram: 'cycle',
  }),
];
