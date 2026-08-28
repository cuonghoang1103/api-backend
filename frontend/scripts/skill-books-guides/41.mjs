import { guide } from '../skill-guide-builder.mjs';

export default [
  // ── Chương 1 · Đánh giá năng lực ban đầu ──────────────────────────────────
  guide({
    thesis:
      'Đánh giá năng lực ban đầu không phải là tự cho mình mấy điểm trên thang mười, mà là dựng một đường nền (baseline) có ngày tháng, dựa trên bằng chứng hành vi gần nhất và neo vào một khung tham chiếu bên ngoài. Một bản đánh giá dùng được phải trả lời cho từng năng lực: lần gần nhất bạn làm việc đó là bao giờ, trong điều kiện nào, ai kiểm chứng được kết quả. Chỗ nào không có sự việc để dẫn ra thì chỗ đó là giả định — và phải được ghi thẳng là giả định, chứ không được làm tròn lên thành năng lực.',
    why: {
      work:
        'Không có đường nền thì mọi cuộc trao đổi về việc bạn xứng đáng nhận dự án nào, ở mức lương nào, đều chạy bằng cảm giác của hai bên. Có đường nền, bạn nói được "phần này tôi làm một mình được, phần kia tôi cần người rà lại trong ba tháng đầu" — câu đó vừa thật vừa làm người giao việc yên tâm hơn hẳn một lời khẳng định chung chung.',
      interview:
        'Câu "điểm yếu lớn nhất của bạn là gì" chỉ dở khi bạn không có dữ liệu. Người có đường nền trả lời được bằng mức hiện tại, bằng chứng của mức đó, việc đang làm để nâng lên và cách sẽ tự kiểm chứng — thay vì công thức mòn "em hơi cầu toàn" mà ai ngồi tuyển vài chục buổi đều đã nghe.',
      study:
        'Học mà không đo đầu vào thì không bao giờ biết khóa học vừa rồi có tác dụng gì: bạn chỉ còn cảm giác "hình như hiểu hơn". Đo trước một lần, đo lại đúng bài đó sau ba tháng, bạn có một con số so được và biết nên học tiếp hay đổi cách học.',
      life:
        'Những quyết định đắt tiền — nghỉ việc để đi học toàn thời gian, chuyển ngành, vay để mở một dịch vụ nhỏ — đều dựa trên giả định về năng lực hiện tại của chính mình. Sai giả định đó vài bậc thì mọi tính toán sau nó lệch theo, và cái giá trả bằng tiền lẫn thời gian của gia đình.',
    },
    framework: [
      {
        name: 'Lấy khung từ bên ngoài',
        detail:
          'Mở ba mô tả công việc thật đang tuyển cho vị trí bạn nhắm tới, hoặc ba bộ tiêu chí đánh giá thật đang dùng ở nơi bạn làm, rút ra 12–18 năng lực. Danh sách tự nghĩ theo trí nhớ luôn thiếu đúng những thứ bạn chưa biết là mình chưa biết.',
      },
      {
        name: 'Chấm theo thang bốn bậc hành vi',
        detail:
          'B0 mới đọc hoặc nghe qua; B1 làm được khi có người kèm hoặc có mẫu để bắt chước; B2 làm được một mình trong điều kiện quen thuộc; B3 làm được cả khi điều kiện lạ và sửa được lỗi của người khác. Một bậc chỉ được chấm nếu bạn dẫn ra được một sự việc cụ thể trong 12 tháng gần nhất.',
      },
      {
        name: 'Kiểm chéo với hai người',
        detail:
          'Gửi bảng cho một người từng làm ngang hàng và một người từng nhận kết quả của bạn, kèm đúng một câu hỏi: "ba chỗ tôi đang chấm cao hơn thực tế là chỗ nào". Câu hỏi hẹp và hơi khó chịu này cho thông tin dùng được, còn "cho mình xin nhận xét" thì gần như luôn nhận về lời động viên.',
      },
      {
        name: 'Làm một bài kiểm tra thật',
        detail:
          'Chọn hai đến ba năng lực quan trọng nhất và tự ra một đề có kết quả xem được, làm trong 90 phút có bấm giờ. Ghi lại ba thứ: thời gian hoàn thành, số lần phải dừng để tra cứu, và lỗi bạn chỉ phát hiện sau khi đã coi là xong.',
      },
      {
        name: 'Đóng băng đường nền',
        detail:
          'Gộp bảng bậc, bằng chứng, bài kiểm tra và phiếu kiểm chéo vào một file đặt tên theo ngày, rồi không sửa nữa. Bản đánh giá sau là một file mới; giữ cả hai để so. Đường nền bị sửa liên tục sẽ mất đúng thứ làm nên giá trị của nó là khả năng đối chiếu.',
      },
    ],
    scenario:
      'Một chuyên viên hành chính nhân sự bốn năm kinh nghiệm ở công ty sản xuất khoảng 300 người muốn chuyển sang vị trí chuyên viên vận hành nhân sự có làm việc với số liệu. Chị tự chấm bảng tính ở mức "khá, 7/10" vì hằng tháng vẫn làm báo cáo nhân sự. Thay vì tin con số đó, chị tự ra một đề 90 phút: lấy file chấm công ba tháng đã che tên, yêu cầu ra bảng tỷ lệ đi muộn theo bộ phận kèm một biểu đồ xu hướng. Kết quả thật: mất hai tiếng rưỡi, phải tra cứu cú pháp ba lần, và bảng sai vì chị không xử lý dòng trùng do nhân viên bấm vân tay hai lần trong một ca. Hai người kiểm chéo chỉ ra cùng một điều chị không tự thấy: chị đọc số rất nhanh nhưng chưa bao giờ tự làm sạch dữ liệu, vì lâu nay file luôn được phòng IT xuất ra sẵn. Đường nền chị ghi lại không còn là "7/10" mà là bốn dòng: dựng bảng tổng hợp B2, hàm tra cứu B1, làm sạch dữ liệu B0, kể chuyện bằng số B1. Ba tháng sau chị làm lại đúng đề đó trong cùng điều kiện: 55 phút, không sai dòng trùng, vẫn phải tra cứu một lần. Con số đáng giá trong hồ sơ của chị không phải "7/10" mà là "hai tiếng rưỡi xuống 55 phút trên cùng một đề, cùng một bộ dữ liệu".',
    comparison: [
      {
        weak: 'Chấm bản thân theo thang 1–10 dựa vào cảm giác chung, mỗi lần chấm lại ra một kết quả khác mà không hiểu vì sao.',
        mature:
          'Chấm theo bậc có định nghĩa hành vi, mỗi bậc bắt buộc kèm một sự việc có ngày và có người chứng kiến; hai người khác nhau chấm hộ bạn sẽ ra kết quả gần giống nhau.',
      },
      {
        weak: 'Chỉ đánh giá những năng lực bạn nghĩ ra được, nên vùng mù vẫn nguyên vẹn sau khi đánh giá xong.',
        mature:
          'Lấy danh sách năng lực từ ba mô tả công việc thật hoặc ba bộ tiêu chí thật, nhờ đó những mục bạn chưa từng nghĩ tới lại hiện ra ngay ở lần đầu.',
      },
      {
        weak: 'Đánh giá xong thì cất đi, không ai phản biện và không có bài đo nào để đối chiếu về sau.',
        mature:
          'Đưa cho hai người kiểm chéo, ghi lại đúng chỗ lệch từ một bậc trở lên, và hẹn sẵn ngày làm lại cùng một bài đo sau 90 ngày.',
      },
    ],
    mistakes: [
      'Chấm cao cho kỹ năng đã lâu không dùng, vì trí nhớ giữ lại cảm giác "hồi đó mình làm được" chứ không giữ lại độ khó thật. Kỹ năng nghề nghiệp rơi bậc khá nhanh khi không dùng — an toàn nhất là hạ một bậc cho mọi thứ đã trên 12 tháng không chạm tới, rồi xác nhận lại bằng một bài kiểm tra ngắn.',
      'Đánh giá đúng lúc tâm trạng cực đoan: vừa bị chê thì cả bảng bị kéo xuống một bậc và bạn bỏ luôn một hướng đi vẫn còn phù hợp; vừa được khen thì ngược lại. Cách chặn là chấm bằng sự việc chứ không bằng cảm giác, và ghi ở đầu file tâm trạng lúc chấm để lần sau đọc lại còn biết đường trừ hao.',
      'Trộn năng lực với đặc điểm tính cách: các mục kiểu "cẩn thận", "chăm chỉ", "có trách nhiệm" không quan sát được, không đo được và không sinh ra bài tập nào. Chúng chiếm chỗ của những mục thật sự luyện được như "viết được biên bản họp mà người vắng mặt đọc là hiểu".',
    ],
    worksheet: [
      'Mở ba mô tả công việc thật của vị trí bạn nhắm tới và gạch chân mọi động từ chỉ việc phải làm. Trong số đó, bao nhiêu động từ bạn dẫn ra được một sự việc trong 12 tháng qua?',
      'Với năng lực bạn tự tin nhất, viết sự việc gần nhất chứng minh nó: ngày nào, ai chứng kiến, kết quả cụ thể ra sao. Nếu bạn chỉ viết được câu chung chung thì bậc thật của nó thấp hơn bạn nghĩ.',
      'Kỹ năng nào bạn từng làm tốt nhưng đã hơn một năm không dùng tới? Bạn định giữ nó ở bậc nào, và bài kiểm tra 30 phút nào sẽ xác nhận bậc đó?',
      'Hai người biết rõ chất lượng công việc của bạn và dám nói thẳng là ai? Bạn sẽ hỏi họ chính xác câu gì, và bao giờ gửi?',
      'Nếu ngày mai phải chứng minh một năng lực bằng bài kiểm tra 90 phút, bạn chọn năng lực nào, đề bài là gì, và thứ xem được ở cuối 90 phút đó là thứ gì?',
    ],
    exercises: [
      {
        label: 'Rút khung từ ba tin tuyển dụng',
        text: 'Lấy ba tin tuyển dụng thật đang mở của vị trí bạn nhắm tới, cắt phần yêu cầu vào một file, gộp các mục trùng nghĩa, giữ lại 12–18 năng lực. Đánh dấu những mục xuất hiện ở cả ba tin — đó là phần lõi không thể né.',
        level: 'e',
      },
      {
        label: 'Bảng bốn bậc có bằng chứng',
        text: 'Chấm toàn bộ danh sách theo B0–B3, mỗi mục kèm một dòng sự việc và ngày tháng. Đếm số mục bạn không viết nổi sự việc: tỷ lệ đó chính là phần giả định trong bản đánh giá của bạn, và nên ghi ngay lên đầu file.',
        level: 'e',
      },
      {
        label: 'Danh sách kỹ năng rỉ sét',
        text: 'Liệt kê mọi kỹ năng bạn không dùng trong 12 tháng qua, hạ mỗi cái xuống một bậc, rồi viết cho ba cái quan trọng nhất một bài kiểm tra 30 phút để xác nhận hoặc bác bỏ bậc mới. Ghi lại cái nào rơi nhiều hơn bạn tưởng.',
        level: 'e',
      },
      {
        label: 'Bài kiểm tra 90 phút tự ra đề',
        text: 'Chọn năng lực quan trọng nhất, tự ra một đề có sản phẩm xem được ở cuối, bấm giờ và làm thật. Ghi ba con số: thời gian, số lần dừng lại tra cứu, số lỗi phát hiện sau khi đã coi là xong. Lưu cả sản phẩm lẫn ba con số.',
        level: 'm',
      },
      {
        label: 'Hai phiếu kiểm chéo',
        text: 'Gửi bảng bậc cho một người ngang hàng và một người từng nhận kết quả của bạn, kèm duy nhất câu hỏi về ba chỗ bạn đang chấm cao hơn thực tế. Ghi lại mọi chỗ lệch từ một bậc trở lên và hỏi họ sự việc nào dẫn tới đánh giá đó.',
        level: 'm',
      },
      {
        label: 'Đóng gói file đường nền',
        text: 'Gộp bảng bậc, bằng chứng, sản phẩm bài kiểm tra và hai phiếu kiểm chéo vào một file duy nhất, đặt tên có ngày, rồi khóa lại không sửa. Đặt luôn một lời nhắc trong lịch để mở lại sau 90 ngày.',
        level: 'm',
      },
      {
        label: 'Đo lại sau 90 ngày',
        text: 'Làm lại đúng đề kiểm tra cũ, cùng dữ liệu, cùng điều kiện, không xem lại bài cũ trước khi làm. So ba con số và viết một trang giải thích phần cải thiện đến từ đâu: kiến thức mới, quen tay, hay chỉ vì lần này bạn nhớ đề.',
        level: 'h',
      },
      {
        label: 'Đối chiếu với tiêu chuẩn ngoài',
        text: 'Đưa sản phẩm bài kiểm tra cho một người đang làm đúng nghề ở mức bạn nhắm tới, xin họ chấm theo tiêu chuẩn riêng của họ và hỏi thẳng: nếu đây là bài của ứng viên thì sẽ bị loại ở vòng nào và vì lý do gì. Ghi nguyên văn câu trả lời, kể cả phần khó nghe.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao thang tự chấm 1–10 gần như vô dụng khi lập kế hoạch học?',
        a: 'Vì nó không neo vào hành vi nào cả. Hai người cùng chấm 7 có thể cách nhau hai năm kinh nghiệm, và chính bạn của tháng sau cũng sẽ chấm khác chỉ vì tâm trạng khác. Thang có định nghĩa hành vi thì ngược lại: nó cho ra kết quả gần giống nhau khi người khác chấm hộ, và mỗi bậc tự gợi ra bài tập để lên bậc kế tiếp — từ B1 lên B2 là "làm lại một mình không có mẫu", từ B2 lên B3 là "làm trong điều kiện lạ và rà lỗi cho người khác".',
      },
      {
        q: 'Bạn tự chấm B2 ở một năng lực, đồng nghiệp chấm bạn B1. Xử lý thế nào?',
        a: 'Không tranh cãi về bậc, đi tìm sự việc. Hỏi họ nhớ tình huống nào khiến họ chấm như vậy. Phần lớn chênh lệch đến từ chỗ hai người nghĩ đến hai điều kiện khác nhau: bạn nhớ lần làm trong điều kiện quen, họ nhớ lần dữ liệu bẩn hoặc hạn gấp. Cách ghi đúng là tách đôi trong đường nền — "B2 điều kiện quen, B1 điều kiện lạ" — vì chính khoảng cách giữa hai điều kiện đó mới là nội dung cần luyện.',
      },
      {
        q: 'Đang thất nghiệp hoặc làm một mình, không có ai kiểm chéo thì làm gì?',
        a: 'Thay người bằng tiêu chuẩn bên ngoài. Nộp sản phẩm vào một nơi có phán xét thật: một bài thi tiêu chuẩn hóa, một cộng đồng nghề nghiêm túc, một người đang tuyển đúng vị trí đó xin mười lăm phút nhận xét, hoặc chính người dùng thật của sản phẩm. Đường nền tự chấm hoàn toàn một mình vẫn có ích để so bạn với bạn sau 90 ngày, nhưng không đủ để kết luận bạn đã đạt mức của một vị trí — kết luận đó cần một con mắt ngoài.',
      },
    ],
    plan7:
      'Ngày 1: thu ba mô tả công việc thật và rút danh sách 12–18 năng lực. Ngày 2: chấm bậc B0–B3 kèm sự việc, để trống chỗ nào không có bằng chứng. Ngày 3: đánh dấu phần giả định và danh sách kỹ năng rỉ sét, hạ một bậc cho chúng. Ngày 4: ra đề bài kiểm tra 90 phút cho năng lực quan trọng nhất và chuẩn bị dữ liệu. Ngày 5: làm bài thật có bấm giờ, ghi ba con số và lưu sản phẩm. Ngày 6: gửi hai phiếu kiểm chéo, xin trả lời trong 48 giờ. Ngày 7: gộp mọi thứ thành file đường nền có ngày, đặt lịch đo lại sau 90 ngày và chọn đúng hai năng lực mang sang chương 2.',
    evidence:
      'Đường nền cộng với bản đo lại là loại bằng chứng khó dựng giả nhất, vì nó đòi hỏi hai lần đo cách nhau vài tháng trên cùng một đề. Nó chứng minh được thứ mà một hiện vật đơn lẻ không chứng minh nổi: tốc độ tiến bộ của bạn, chứ không chỉ mức hiện tại. Khi được hỏi "bạn tự đánh giá mình đến đâu", người trả lời bằng tính từ nghe giống hệt nhau; người mở ra một bảng bốn bậc kèm hai bài đo cùng đề cách nhau ba tháng đang trả lời hai câu hỏi cùng lúc, trong đó câu thứ hai là câu người tuyển thật sự quan tâm khi nhận người chưa đủ kinh nghiệm. Với hồ sơ freelance, đặt bản đường nền ở phần mô tả cách làm việc: nó báo cho khách rằng bạn biết rõ ranh giới năng lực của mình và sẽ không nhận bừa việc ngoài tầm.',
    references: [
      { label: 'Positive Psychology — chuyên mục Self-awareness và công cụ tự đánh giá', url: 'https://positivepsychology.com/self-awareness/', type: 'article' },
      { label: 'U.S. Bureau of Labor Statistics — Occupational Outlook Handbook: mô tả yêu cầu năng lực theo từng nghề', url: 'https://www.bls.gov/ooh/', type: 'article' },
    ],
  }),

  // ── Chương 2 · Lập bản đồ kỹ năng cá nhân ─────────────────────────────────
  guide({
    thesis:
      'Bản đồ kỹ năng khác danh sách kỹ năng ở hai chỗ: nó có trục và có quan hệ. Danh sách trả lời câu "tôi biết những gì"; bản đồ trả lời hai câu khó hơn — kỹ năng nào đang chặn phần còn lại phát huy, và tổ hợp nào của tôi hiếm khi cùng xuất hiện ở một người. Giá trị nghề nghiệp hầu như không đến từ một kỹ năng đứng đầu bảng, nó đến từ một cụm ba đến bốn kỹ năng ở mức khá cộng lại mà thị trường ít khi tìm được đủ trong cùng một người.',
    why: {
      work:
        'Bản đồ quyết định bạn nên xin vào dự án nào và nhận việc nào trong sáu tháng tới: chọn việc lấp được ô trống trong cụm chính, thay vì chọn việc làm dày thêm ô vốn đã dày và vì thế dễ chịu hơn để làm.',
      interview:
        'Với câu "vì sao chọn bạn thay vì người nhiều năm kinh nghiệm hơn", câu trả lời mạnh không phải kể thêm kỹ năng, mà là mô tả một cụm khép kín: bạn nhận đầu vào từ ai, đi qua những bước nào, giao ra kết quả gì, và vì sao cụm đó hiếm.',
      study:
        'Chọn khóa học theo nút thắt cho lợi tức cao hơn hẳn chọn theo thứ đang được nói nhiều. Cùng bốn mươi giờ học, đổ vào mắt xích yếu nhất của một cụm thì cả cụm lên hạng; đổ vào mắt xích vốn đã mạnh thì người nhận kết quả gần như không thấy khác biệt.',
      life:
        'Bản đồ chỉ ra những kỹ năng dùng chung giữa công việc và đời sống — thương lượng, sắp xếp ngân sách, giải thích cho người không cùng chuyên môn — nên một lần luyện phục vụ được hai chỗ, điều rất đáng giá khi quỹ thời gian eo hẹp.',
    },
    framework: [
      {
        name: 'Liệt kê ngược từ việc đã xong',
        detail:
          'Bắt đầu từ mười việc gần nhất bạn thực sự hoàn thành và có người nhận kết quả, rồi rút ra kỹ năng đã dùng cho từng việc. Danh sách nghĩ theo tên kỹ năng thường là bản sao của mô tả tuyển dụng, không phải bản đồ của đời bạn.',
      },
      {
        name: 'Đặt lên hai trục',
        detail:
          'Trục dọc là mức thành thạo theo bậc B0–B3 đã chấm ở chương 1. Trục ngang là mức nhu cầu của con đường bạn chọn, đo bằng cách đếm số lần kỹ năng đó xuất hiện trong mười tin tuyển dụng hoặc mười mô tả dự án của đúng thị trường bạn nhắm.',
      },
      {
        name: 'Gom thành cụm bàn giao được',
        detail:
          'Mỗi cụm phải phát biểu được thành một kết quả trọn gói giao cho người khác, ví dụ "nhận dữ liệu thô hằng tháng và trả lại một báo cáo vận hành có nhận định". Kỹ năng lẻ khó đổi thành cơ hội; cụm khép kín thì đổi được.',
      },
      {
        name: 'Tìm mắt xích yếu nhất',
        detail:
          'Trong mỗi cụm, chất lượng đầu ra bị chặn bởi bước yếu nhất chứ không được nâng bởi bước mạnh nhất. Ô vừa nhu cầu cao, vừa thành thạo thấp, vừa nằm trong cụm chính là nơi một quý đầu tư tạo ra khác biệt lớn nhất.',
      },
      {
        name: 'Chốt ba ô và ghi phần cố ý bỏ',
        detail:
          'Bản đồ chỉ có ích khi có phần tô xám: những kỹ năng bạn quyết định không học năm nay, kèm lý do và kèm cách bù chỗ trống đó — thuê ngoài, đổi việc với đồng nghiệp, hoặc dùng công cụ thay thế.',
      },
    ],
    scenario:
      'Một người tự học thiết kế đồ họa, hai năm nhận việc lẻ qua các nhóm mạng xã hội, mỗi việc từ năm trăm nghìn đến một triệu rưỡi. Anh tin vấn đề của mình là chưa đủ giỏi phần mềm nên liên tục xem hướng dẫn kỹ thuật mới. Khi liệt kê ngược từ mười việc gần nhất, bản đồ hiện ra một điều khác: chín trong mười hai kỹ năng anh dùng đều nằm ở nhánh thao tác phần mềm, còn cụm "đưa được một bộ nhận diện có lý do bảo vệ được" thì thiếu hẳn hai mắt xích — khai thác yêu cầu từ khách và trình bày bảo vệ phương án. Anh đối chiếu với hai mươi tin tuyển và mô tả dự án: cả hai mắt xích thiếu đều xuất hiện dày đặc trong phần yêu cầu bắt buộc. Anh chọn hai quý. Quý một luyện đúng một việc: sau mỗi cuộc trao đổi với khách, viết bản tóm tắt yêu cầu một trang gửi khách xác nhận trước khi vẽ. Quý hai luyện việc thứ hai: luôn trình bày ba phương án kèm lý do lựa chọn thay vì gửi một file kèm câu "chị xem giúp em". Sau sáu tháng, số vòng sửa trung bình anh đếm được trong hộp thư giảm từ khoảng năm sáu vòng xuống hai ba vòng, và anh bắt đầu nhận việc theo gói có bản tóm tắt yêu cầu ký xác nhận. Kỹ năng phần mềm của anh gần như không đổi trong sáu tháng đó.',
    comparison: [
      {
        weak: 'Danh sách kỹ năng chép lại từ tin tuyển dụng, đọc lên nghe giống hồ sơ của bất kỳ ai khác trong ngành.',
        mature:
          'Bản đồ đi ngược từ mười việc đã hoàn thành, nên mỗi ô đều truy được về một sản phẩm cụ thể có người nhận, và không ai chép được vì nó là lịch sử riêng của bạn.',
      },
      {
        weak: 'Tiếp tục đổ giờ vào kỹ năng đã mạnh nhất, vì học nó dễ chịu và có tiến bộ thấy ngay.',
        mature:
          'Đổ giờ vào mắt xích yếu nhất của cụm chính, chấp nhận vài tuần đầu vụng về, đổi lại chất lượng của cả gói bàn giao nhảy một bậc.',
      },
      {
        weak: 'Bản đồ chỉ có phần "sẽ học thêm", nên năm nào cũng dài thêm và không năm nào chạy hết.',
        mature:
          'Bản đồ có phần tô xám ghi rõ những gì cố ý không học năm nay kèm cách bù, nhờ đó phần còn lại đủ nhỏ để thật sự làm được.',
      },
    ],
    mistakes: [
      'Biến bản đồ thành bản kê khai để trưng ra: nhồi vào đó mọi thứ từng chạm tới, kể cả công cụ dùng đúng một lần ba năm trước. Bản đồ sáu mươi ô không chỉ ra được nút thắt nào, nên nó không dẫn tới quyết định nào — mà bản đồ tồn tại là để ra quyết định.',
      'Lấy nhu cầu thị trường từ cảm giác mạng xã hội, tức từ thứ đang được nói nhiều nhất, thay vì đếm trong mười tin tuyển dụng hoặc mười mô tả dự án thật của đúng thị trường mình nhắm. Hai nguồn này thường lệch nhau rất xa, và chỉ nguồn thứ hai đang trả tiền.',
      'Vẽ một lần rồi treo đó, không gắn ngày rà lại. Sau sáu tháng bản đồ mô tả một người không còn tồn tại: bạn đã lên bậc ở vài ô, thị trường đã đổi ở vài ô khác, và bạn vẫn đang ra quyết định bằng bức tranh cũ.',
    ],
    worksheet: [
      'Viết ra mười việc gần nhất bạn hoàn thành trọn vẹn và có người nhận kết quả. Kỹ năng nào xuất hiện ở nhiều việc nhất, và kỹ năng nào bạn tưởng mình dùng nhiều nhưng thực ra chỉ xuất hiện một lần?',
      'Trong mười tin tuyển dụng hoặc mười mô tả dự án của hướng bạn nhắm, kỹ năng nào xuất hiện ở ít nhất bảy nơi? Bạn đang ở bậc nào với kỹ năng đó?',
      'Phát biểu một cụm kỹ năng của bạn thành một kết quả trọn gói giao được cho người khác. Trong cụm đó, mắt xích nào bạn vẫn phải nhờ người khác làm hộ?',
      'Kỹ năng nào bạn giỏi nhưng gần như không ai trong hướng đi hiện tại cần đến? Bạn giữ nó ở chế độ duy trì, chuyển nó sang một hướng khác, hay chấp nhận buông?',
      'Năm nay bạn cố ý không học thứ gì? Viết tên nó ra, kèm người hoặc công cụ sẽ bù vào chỗ đó khi công việc đòi hỏi.',
    ],
    exercises: [
      {
        label: 'Mười việc đã xong',
        text: 'Liệt kê mười việc gần nhất bạn hoàn thành và có người nhận kết quả, mỗi việc kèm ba đến năm kỹ năng đã thực sự dùng. Đếm tần suất từng kỹ năng và khoanh ba cái xuất hiện nhiều nhất.',
        level: 'e',
      },
      {
        label: 'Đếm nhu cầu thật',
        text: 'Mở mười tin tuyển dụng đang mở hoặc mười mô tả dự án của khách hàng bạn nhắm, lập bảng đếm tần suất từng kỹ năng, tách riêng phần "yêu cầu bắt buộc" và phần "ưu tiên". Đánh dấu ba kỹ năng tần suất cao mà bạn chưa từng làm một mình.',
        level: 'e',
      },
      {
        label: 'Lưới hai trục',
        text: 'Vẽ lưới bốn ô theo hai trục thành thạo và nhu cầu, đặt mười lăm đến hai mươi kỹ năng vào đúng ô. Đếm số kỹ năng rơi vào ô thành thạo cao mà nhu cầu thấp, rồi ước tính bạn đã dành bao nhiêu giờ cho ô đó trong năm ngoái.',
        level: 'e',
      },
      {
        label: 'Định nghĩa một cụm bán được',
        text: 'Viết mô tả trọn gói cho một kết quả bạn giao được: nhận đầu vào gì từ ai, đi qua những bước nào, giao ra cái gì, cam kết trong bao lâu. Ghi kỹ năng cần cho từng bước và đánh dấu bước bạn phải nhờ người khác.',
        level: 'm',
      },
      {
        label: 'Thử nghiệm nút thắt hai tuần',
        text: 'Chọn mắt xích yếu nhất của cụm chính và thiết kế một thử nghiệm hai tuần có đầu ra xem được, ví dụ làm đúng bước đó năm lần liên tiếp trong việc thật. Ghi lại chất lượng lần một và lần năm để biết đường học của bạn dốc hay phẳng.',
        level: 'm',
      },
      {
        label: 'Phỏng vấn hai người đi trước',
        text: 'Hỏi hai người đang làm đúng vị trí bạn nhắm, cách nhau ít nhất một bậc thâm niên, ba câu: kỹ năng nào họ từng tưởng quan trọng mà hóa ra không, kỹ năng nào ngược lại, và việc gì họ vẫn phải nhờ người khác. Đối chiếu ba câu trả lời với bản đồ của bạn.',
        level: 'm',
      },
      {
        label: 'Bản đồ một trang có phần tô xám',
        text: 'Hoàn thiện bản đồ gói gọn trong một trang: ba ô đầu tư quý này, phần duy trì, phần cố ý bỏ kèm cách bù, và ngày rà lại. Gửi cho một người biết nghề, xin họ chỉ ra đúng một ô mà họ nghĩ bạn đang tự lừa mình.',
        level: 'h',
      },
      {
        label: 'Lời chào 60 giây từ bản đồ',
        text: 'Chuyển bản đồ thành một lời giới thiệu 60 giây: bạn giao trọn được kết quả gì, dựa trên cụm nào, đang chủ động nâng mắt xích nào. Nói thử với hai người khác nghề và ghi lại chỗ họ phải hỏi lại — đó là chỗ bản đồ của bạn còn mơ hồ.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao kỹ năng mạnh nhất thường không phải nơi nên đầu tư tiếp?',
        a: 'Vì đầu ra của một cụm bị chặn bởi mắt xích yếu nhất chứ không được nâng bởi mắt xích mạnh nhất. Nâng một kỹ năng đã ở B3 lên cao hơn tốn rất nhiều giờ và người nhận kết quả gần như không thấy khác biệt; nâng một mắt xích B0–B1 trong cùng cụm đổi hẳn chất lượng bàn giao. Ngoại lệ có thật: khi chính kỹ năng mạnh nhất là thứ tạo ra sự khác biệt trên thị trường và bạn chủ đích đi hướng chuyên sâu — nhưng đó phải là lựa chọn có ý thức, kèm chấp nhận cửa hẹp hơn.',
      },
      {
        q: 'Bản đồ của bạn có bốn mươi lăm kỹ năng. Điều đó nói lên gì?',
        a: 'Gần như chắc chắn bạn đang liệt kê những thứ từng chạm tới chứ không phải những thứ đang tạo ra kết quả. Rút gọn bằng một luật: chỉ giữ lại kỹ năng đã dùng trong 12 tháng qua để làm ra một thứ có người nhận. Phần còn lại chuyển sang danh sách "đã từng biết" — vẫn hữu ích khi cần huy động, nhưng không được tham gia vào quyết định phân bổ thời gian của năm nay.',
      },
      {
        q: 'Làm sao phân biệt nhu cầu thật của thị trường với một trào lưu?',
        a: 'Ba dấu hiệu quan sát được. Một, nó nằm ở phần yêu cầu bắt buộc của nhiều tin tuyển dụng chứ không chỉ ở phần ưu tiên. Hai, đang có người trả tiền cho kết quả tạo ra từ nó ngay lúc này, không phải sẽ trả trong tương lai. Ba, người đang hành nghề nhắc tới nó khi kể công việc hằng ngày, chứ không chỉ khi bàn về tương lai của ngành. Thiếu cả ba mà vẫn muốn học thì cứ học, nhưng với ngân sách nhỏ và một mốc dừng đã định trước.',
      },
    ],
    plan7:
      'Ngày 1: liệt kê mười việc đã hoàn thành và rút kỹ năng cho từng việc. Ngày 2: đếm tần suất trong mười tin tuyển dụng hoặc mô tả dự án thật, tách bắt buộc và ưu tiên. Ngày 3: vẽ lưới hai trục và đặt hai mươi kỹ năng vào ô. Ngày 4: phát biểu một cụm bàn giao được và đánh dấu mắt xích yếu nhất. Ngày 5: hỏi hai người đi trước ba câu và đối chiếu với bản đồ. Ngày 6: viết phần tô xám — cố ý bỏ gì, ai hoặc cái gì bù vào. Ngày 7: gói bản đồ vào một trang, gửi xin phản biện và đặt ngày rà lại sau một quý.',
    evidence:
      'Bản đồ hiếm khi được gửi kèm hồ sơ, nhưng nó là nguồn cho hai thứ luôn được gửi: đoạn tóm tắt đầu CV và câu trả lời cho "kế hoạch phát triển của bạn là gì". Viết tóm tắt theo cụm kết quả — "nhận dữ liệu thô, trả lại báo cáo vận hành có nhận định" — thay vì liệt kê công cụ, và bạn lập tức khác phần lớn hồ sơ cùng vị trí. Giữ hai phiên bản bản đồ cách nhau sáu tháng, tô màu những ô đã đổi bậc: đó là bằng chứng bạn tự điều hướng được sự nghiệp mà không cần ai xếp lịch học hộ. Nếu bạn đang quản lý người khác, chạy đúng khung này cho từng thành viên và lưu lại — hồ sơ phát triển nhóm là chất liệu hiếm và mạnh cho vòng phỏng vấn vị trí quản lý.',
    references: [
      { label: '80,000 Hours — khung phân tích vốn nghề nghiệp và lựa chọn hướng đi', url: 'https://80000hours.org/', type: 'article' },
      { label: 'Indeed Career Advice — mô tả kỹ năng theo từng nhóm nghề', url: 'https://www.indeed.com/career-advice', type: 'article' },
    ],
  }),

  // ── Chương 3 · Xây kế hoạch học 12 tháng ──────────────────────────────────
  guide({
    thesis:
      'Kế hoạch học một năm hỏng gần như luôn vì cùng hai lỗi: nó được lập bằng số giờ mong muốn thay vì số giờ có thật, và nó không có đường lùi. Một kế hoạch sống được qua tháng thứ năm gồm bốn thứ: ngân sách giờ đo từ những tuần đã sống chứ không phải tuần lý tưởng; đúng một mũi nhọn tại một thời điểm; mỗi quý một sản phẩm bàn giao cho một người nhận có tên; và một mức tối thiểu định sẵn để tháng bận bạn tụt xuống chứ không rơi hẳn về không.',
    why: {
      work:
        'Việc học chỉ sống sót nếu nó nối được vào công việc đang làm — nếu không, mỗi lần công việc căng lên nó là thứ bị cắt đầu tiên và không ai phản đối. Kế hoạch có sản phẩm quý dùng được ngay tại chỗ làm thì việc học tự bảo vệ được chỗ của nó.',
      interview:
        'Câu "bạn học một thứ mới bằng cách nào" đo khả năng tự vận hành. Người kể được mốc quý, sản phẩm, và một lần đổi hướng có lý do thì đang chứng minh rằng giao cho họ một mảng chưa ai làm cũng không sao — đó chính là thứ vị trí tự chủ cần.',
      study:
        'Mười hai tháng đủ dài để đổi được nghề, nhưng cũng đủ dài để quên vì sao mình bắt đầu. Các mốc quý giữ lại mục đích, và bài đo lặp lại cho biết bạn đang tiến hay chỉ đang bận rộn với tài liệu.',
      life:
        'Giờ học luôn lấy từ gia đình hoặc từ giấc ngủ, không có nguồn thứ ba. Kế hoạch nói rõ lấy từ đâu, kéo dài bao lâu, người bị ảnh hưởng được gì — và được họ biết trước — thì mới đi qua nổi tháng thứ ba mà không kèm theo một cuộc cãi nhau.',
    },
    framework: [
      {
        name: 'Đo ngân sách bằng bốn tuần đã sống',
        detail:
          'Mở lịch bốn tuần gần nhất và đếm số giờ thật sự trống của từng tuần. Lấy con số của tuần thấp nhất làm ngân sách nền, không lấy trung bình: kế hoạch vỡ ở tuần tệ nhất chứ không vỡ ở tuần trung bình.',
      },
      {
        name: 'Viết kết quả năm bằng hành vi bạn kiểm soát được',
        detail:
          '"Được nhận vào vị trí X" phụ thuộc quyết định của người khác; "làm trọn được cụm Y trong điều kiện thật, có ba sản phẩm chứng minh" thì phụ thuộc bạn. Viết cái thứ hai làm mục tiêu, giữ cái thứ nhất làm động cơ.',
      },
      {
        name: 'Bốn quý, bốn sản phẩm có người nhận',
        detail:
          'Mỗi quý kết thúc bằng một thứ giao được cho một người thật — đồng nghiệp, người dùng, khách, hoặc một nhóm học. Người nhận là thứ tạo ra hạn chót thật; không có họ thì mốc quý chỉ là ngày ghi trong file của riêng bạn.',
      },
      {
        name: 'Hai mức nhịp và đường lùi',
        detail:
          'Định trước mức đủ (ví dụ sáu giờ mỗi tuần) và mức tối thiểu giữ nhịp (ví dụ bốn mươi lăm phút, làm đúng một việc nhỏ đã ghi sẵn). Tháng bận thì tụt xuống mức tối thiểu, không nghỉ hẳn — nối lại một mạch còn sống dễ hơn nhiều so với khởi động lại từ số không.',
      },
      {
        name: 'Viết trước điều kiện đổi hướng',
        detail:
          'Ghi sẵn dấu hiệu cho phép bạn dừng hoặc chuyển: hết hai quý mà chưa sản phẩm nào có người dùng thật, hoặc bài đo lặp lại không nhúc nhích. Kế hoạch không có điều kiện dừng biến mọi lần rẽ hướng thành thất bại cá nhân thay vì một quyết định có căn cứ.',
      },
      {
        name: 'Rà quý nửa buổi, chỉ viết chi tiết quý gần nhất',
        detail:
          'Cuối mỗi quý dành ba đến bốn tiếng: so sản phẩm thật với dự kiến, đo lại đúng bài kiểm tra ở chương 1, cập nhật bản đồ, rồi mới viết chi tiết quý kế. Viết chi tiết cho quý ba và quý tư ngay từ tháng giêng chỉ tạo cảm giác kiểm soát và làm bạn ngại sửa.',
      },
    ],
    scenario:
      'Một người từng làm kế toán, nghỉ bốn năm để chăm hai con nhỏ, muốn quay lại thị trường ở mảng dịch vụ kế toán cho hộ kinh doanh. Kế hoạch đầu tiên chị viết là "học hai tiếng mỗi tối". Khi đếm thật bốn tuần đã sống, chỉ có ba buổi tối khả dụng và tuần thấp nhất còn đúng ba tiếng rưỡi — chị lấy ba tiếng rưỡi làm nền thay vì mười bốn tiếng như dự tính ban đầu. Kết quả năm được viết lại thành thứ chị tự kiểm soát: làm trọn bộ sổ sách và hồ sơ khai báo cho ba hộ kinh doanh thật trong một quý, có xác nhận của chủ hộ. Quý một chị làm lại bộ sổ mẫu cho một hộ giả lập, người nhận là một kế toán đang hành nghề nhận lời đọc và nhận xét. Quý hai chị nhận làm không lấy phí cho một hộ thật là người quen, đây là lần đầu có dữ liệu bẩn thật và hạn thật. Quý ba hai hộ trả phí. Quý bốn chị đóng gói quy trình và bảng giá. Tháng thứ năm con ốm ba tuần liền, chị tụt xuống mức tối thiểu bốn mươi lăm phút mỗi tuần chỉ để đọc và ghi chú một thay đổi quy định — mốc quý hai lùi ba tuần nhưng mạch không đứt. Một lưu ý chị ghi ngay đầu kế hoạch, và người đọc sách này nên ghi theo: quy định về thuế và hóa đơn thay đổi theo từng năm và có khác biệt theo địa phương, nên mọi mốc học liên quan tới nghĩa vụ pháp lý của người khác đều phải tra văn bản đang hiệu lực và hỏi cơ quan thuế hoặc người hành nghề có chứng chỉ trước khi tư vấn cho ai.',
    comparison: [
      {
        weak: 'Lập kế hoạch bằng số giờ của tuần rảnh nhất, nên tuần bình thường đã trượt chỉ tiêu và tuần bận thì bỏ hẳn.',
        mature:
          'Lấy tuần bận nhất trong bốn tuần gần nhất làm ngân sách nền; mọi tuần khá hơn đều là phần dôi ra, và cảm giác vượt chỉ tiêu là thứ nuôi nhịp suốt mười hai tháng.',
      },
      {
        weak: 'Học ba thứ song song vì thứ nào cũng thấy cần, kết quả là ba đường tiến bộ đều nông và không thứ nào tới được mức dùng được.',
        mature:
          'Một mũi nhọn mỗi quý, hai thứ còn lại ở chế độ duy trì đúng một việc nhỏ mỗi tuần, chấp nhận chúng đứng yên trong ba tháng.',
      },
      {
        weak: 'Đo tiến độ bằng số khóa học đã xem hết và số trang đã đọc, hai chỉ số tăng đều kể cả khi năng lực không đổi.',
        mature:
          'Đo bằng sản phẩm quý đã giao cho người nhận có tên, cộng với kết quả bài đo lặp lại từ chương 1 — hai thứ không tăng được nếu năng lực đứng yên.',
      },
    ],
    mistakes: [
      'Kế hoạch chỉ có phần tăng tốc mà không có đường lùi, nên một tháng bận là mất trắng và cảm giác thất bại kéo theo cả những tháng sau. Đường lùi phải được viết ra trước khi cần, vì lúc đang quá tải thì không ai ngồi thiết kế mức tối thiểu cho tử tế.',
      'Viết chi tiết cả bốn quý ngay từ đầu năm, gồm cả tên tài liệu sẽ đọc vào tháng mười một. Chi tiết ở vùng chưa có thông tin không làm kế hoạch chắc hơn, nó chỉ làm bạn ngại sửa khi thực tế đổi, vì sửa nghĩa là phá bỏ một thứ trông rất công phu.',
      'Lấy mốc chính là thứ do người khác quyết — được nhận việc, được thăng chức, đạt một kỳ thi có hội đồng chấm — rồi kết luận cả năm học vô ích khi kết quả đó không đến đúng hạn, dù năng lực đã lên thật và đo được.',
    ],
    worksheet: [
      'Mở lịch bốn tuần gần nhất, đếm số giờ thật sự trống của từng tuần và viết cả bốn con số ra. Tuần thấp nhất là bao nhiêu giờ, và bạn đã tưởng mình có bao nhiêu?',
      'Viết kết quả mười hai tháng của bạn. Nếu trong câu có bất kỳ phần nào phụ thuộc quyết định của người khác, hãy viết lại thành thứ bạn tự làm và tự kiểm chứng được.',
      'Bốn sản phẩm bàn giao của bốn quý là gì, và tên người nhận thật của từng sản phẩm là ai? Chỗ nào bạn chưa điền được tên, mốc đó chưa có hạn chót thật.',
      'Mức tối thiểu giữ nhịp của bạn là việc gì cụ thể, mất bao nhiêu phút, làm vào thời điểm nào trong tuần, và gắn ngay sau hoạt động nào đã có sẵn?',
      'Dấu hiệu nào sẽ cho phép bạn chính thức đổi hướng giữa năm mà không coi đó là bỏ cuộc? Viết ra ngay bây giờ, khi bạn còn chưa cần đến nó.',
    ],
    exercises: [
      {
        label: 'Bốn tuần đã sống',
        text: 'Đếm số giờ trống thật của bốn tuần gần nhất từ lịch chứ không từ trí nhớ. Viết ba con số cạnh nhau: tuần cao nhất, tuần thấp nhất, và số giờ bạn vẫn tin là mình có. Khoảng cách giữa con số thứ hai và thứ ba giải thích phần lớn các kế hoạch đã hỏng của bạn.',
        level: 'e',
      },
      {
        label: 'Viết lại mục tiêu thành hành vi',
        text: 'Lấy mục tiêu năm nay bạn đang có, gạch bỏ mọi phần phụ thuộc quyết định của người khác, viết lại thành thứ bạn tự làm và tự kiểm chứng. Đặt hai bản cạnh nhau và ghi lại điều bạn nhận ra khi so chúng.',
        level: 'e',
      },
      {
        label: 'Chọn mũi nhọn của quý',
        text: 'Đặt ba ứng viên cạnh nhau và chấm mỗi cái theo ba câu hỏi: có nằm ở mắt xích yếu của cụm chính không, có sản phẩm bàn giao rõ ràng không, có người nhận thật không. Chọn một và viết ra lý do loại hai cái kia để quý sau khỏi phải cân nhắc lại từ đầu.',
        level: 'e',
      },
      {
        label: 'Thỏa thuận giờ với người bị ảnh hưởng',
        text: 'Dành mười lăm phút nói chuyện với người chịu ảnh hưởng nhất khi bạn học — bạn đời, cha mẹ, người ở chung, hoặc đồng nghiệp trực tiếp: giờ học lấy từ đâu, kéo dài bao lâu, họ được gì và họ mất gì. Ghi lại thỏa thuận cùng ngày sẽ xem lại nó.',
        level: 'm',
      },
      {
        label: 'Lịch quý một trang',
        text: 'Viết chi tiết duy nhất cho quý gần nhất: sản phẩm, người nhận, ngày giao, các buổi cố định trong tuần, mức đủ và mức tối thiểu. Ba quý còn lại mỗi quý chỉ được viết đúng một dòng. Dán trang này ở chỗ bạn nhìn thấy hằng ngày.',
        level: 'm',
      },
      {
        label: 'Diễn tập tuần bận',
        text: 'Chọn một tuần bất kỳ và cố ý chỉ làm đúng mức tối thiểu, dù tuần đó bạn rảnh. Cuối tuần trả lời: mức tối thiểu này có thật sự giữ được mạch không, hay nó nhỏ tới mức tuần sau bạn phải khởi động lại từ đầu? Điều chỉnh trước khi tháng bận thật ập tới.',
        level: 'm',
      },
      {
        label: 'Giao sản phẩm quý đầu tiên',
        text: 'Hoàn thành và giao thật sản phẩm quý cho người nhận đã hẹn, đúng ngày đã ghi trong lịch, kèm một câu hỏi hẹp về chỗ chưa dùng được. Ghi lại chênh lệch giữa ngày dự kiến và ngày giao thật — con số này là dữ liệu về khả năng ước lượng của bạn, dùng lại ở chương 5.',
        level: 'h',
      },
      {
        label: 'Rà quý nửa buổi',
        text: 'Dành ba đến bốn tiếng cuối quý: so sản phẩm với dự kiến, làm lại bài đo của chương 1, cập nhật bản đồ kỹ năng, rồi viết chi tiết quý kế tiếp. Kết thúc bằng đúng một quyết định được phát biểu rõ — giữ hướng, thu hẹp hướng, hay đổi hướng — kèm dữ kiện dẫn tới quyết định đó.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao lấy tuần bận nhất làm ngân sách nền lại tốt hơn lấy trung bình?',
        a: 'Vì trung bình che mất phương sai. Hai tuần mười giờ và hai tuần một giờ cho trung bình năm giờ rưỡi, nhưng bạn sẽ trượt mốc ở hai tuần kia, và chuỗi trượt mới là thứ giết kế hoạch chứ không phải tổng số giờ thiếu. Dựng trên tuần tệ nhất thì mọi tuần bình thường bạn đều vượt chỉ tiêu; cảm giác vượt chỉ tiêu lặp lại là nhiên liệu rẻ nhất cho một chương trình dài mười hai tháng.',
      },
      {
        q: 'Đến tháng thứ tư bạn thấy hướng đã chọn không còn phù hợp. Bỏ hay đi tiếp?',
        a: 'Đừng quyết trong tuần đang mệt. Kiểm ba dữ kiện đã ghi sẵn: sản phẩm quý một có người nhận thật không và họ nói gì, bài đo lặp lại có nhúc nhích không, và điều kiện đổi hướng bạn viết từ đầu năm đã xảy ra chưa. Trường hợp hay gặp nhất là năng lực có tiến bộ nhưng động lực mất — khi đó vấn đề thường nằm ở người nhận sản phẩm chứ không ở chủ đề, và nên đổi bối cảnh dùng trước khi đổi cả hướng.',
      },
      {
        q: 'Không có ai để nhận sản phẩm quý thì làm thế nào?',
        a: 'Hạ tiêu chuẩn "người nhận" chứ đừng bỏ nó. Mức tối thiểu là một người thật đọc hoặc dùng và trả lời được hai câu: chỗ nào không hiểu, chỗ nào không dùng được. Có thể là một người trong cộng đồng nghề, một người quen khác nghề đóng vai người dùng, hoặc một nhóm ba người luân phiên nhận sản phẩm của nhau theo lịch. Đăng công khai cũng được, nhưng bắt buộc kèm một câu hỏi hẹp — đăng kèm câu "mọi người góp ý giúp em" thì thứ bạn nhận về sẽ là lời khen lịch sự, không phải thông tin.',
      },
    ],
    plan7:
      'Ngày 1: đếm giờ trống thật của bốn tuần gần nhất và chốt ngân sách nền. Ngày 2: viết lại kết quả mười hai tháng thành hành vi bạn kiểm soát được. Ngày 3: chọn mũi nhọn của quý và ghi lý do loại hai ứng viên kia. Ngày 4: đặt tên bốn sản phẩm quý và điền tên người nhận của từng cái. Ngày 5: nói chuyện thỏa thuận giờ với người bị ảnh hưởng nhất và ghi lại kết quả. Ngày 6: thiết kế mức đủ, mức tối thiểu và viết sẵn điều kiện đổi hướng. Ngày 7: gói thành lịch quý một trang, dán chỗ nhìn thấy và đặt sẵn lịch rà quý ba tiếng vào cuối quý.',
    evidence:
      'Bản kế hoạch tự nó không phải bằng chứng — ai cũng viết được một kế hoạch đẹp trong một buổi tối. Thứ có sức nặng là bộ bốn sản phẩm quý kèm ngày giao thật và tên người nhận, cộng với bản kế hoạch gốc chưa sửa đặt cạnh bản cuối. Cặp tài liệu đó cho thấy hai điều cùng lúc: bạn tự chạy được một chương trình dài không ai giám sát, và bạn biết điều chỉnh theo thực tế thay vì bám kế hoạch một cách mù quáng. Với vị trí đòi tự chủ cao — làm từ xa, làm tự do, hoặc là người đầu tiên của một mảng mới — đây thường là dấu hiệu người tuyển tìm mà không biết cách hỏi thẳng. Trong hồ sơ, đừng dán cả kế hoạch; dán dòng thời gian bốn mốc kèm một câu về lần đổi hướng và lý do của nó.',
    references: [
      { label: 'The Learning Scientists — nguyên tắc học có bằng chứng và cách rải việc học theo thời gian', url: 'https://www.learningscientists.org/', type: 'article' },
      { label: 'James Clear — Goal setting: mục tiêu, hệ thống và nhịp duy trì', url: 'https://jamesclear.com/goal-setting', type: 'article' },
    ],
  }),

  // ── Chương 4 · Xây dựng bằng chứng năng lực ───────────────────────────────
  guide({
    thesis:
      'Bằng chứng năng lực là thứ người khác kiểm tra được mà không cần tin lời bạn, và nó có bốn bậc rõ rệt: lời tự nhận ("thành thạo bảng tính") thấp nhất; rồi tới mô tả có số ("rút thời gian lập báo cáo từ ba ngày xuống một ngày"); rồi tới hiện vật xem được là chính cái file, bản ghi màn hình, tài liệu quy trình; cao nhất là hiện vật đang được người khác dùng thật và có người đó xác nhận. Phần lớn hồ sơ dừng ở bậc một. Khoảng cách giữa bậc một và bậc bốn lớn hơn khoảng cách giữa hai ứng viên chênh nhau hai năm kinh nghiệm.',
    why: {
      work:
        'Khi đề nghị tăng lương hay xin nhận một mảng lớn hơn, bên kia phải cân một rủi ro. Ba hiện vật có số đo làm rủi ro đó nhỏ đi ngay trong buổi nói chuyện, còn một danh sách tính từ thì đẩy toàn bộ việc phán đoán về phía họ, và người ta thường phán đoán an toàn.',
      interview:
        'Người phỏng vấn đang tìm cách giảm xác suất tuyển nhầm. Một hiện vật mở ra trong ba mươi giây làm việc đó nhanh hơn mọi cách diễn đạt, và nó còn đổi hẳn nội dung buổi phỏng vấn: câu hỏi chuyển từ "bạn đã làm ở đâu" sang "vì sao bạn chọn cách này".',
      study:
        'Khi tự học không có bằng cấp đi kèm, bằng chứng thay thế cho tấm bằng. Nó cũng là cách duy nhất để chính bạn biết mình đã học xong một phần hay chưa: chừng nào chưa làm ra được thứ đưa cho người khác dùng, phần đó vẫn còn nằm ở mức đọc hiểu.',
      life:
        'Hồ sơ vay vốn cho một dịch vụ nhỏ, hồ sơ xin học bổng, hồ sơ xin thị thực làm việc, hay đơn giản là thuyết phục gia đình về một quyết định lớn — tất cả đều mạnh lên khi có hiện vật thay cho lời hứa. Lưu ý mỗi loại hồ sơ có yêu cầu riêng do chính nơi nhận quy định, hãy đọc quy định của họ thay vì suy từ kinh nghiệm nộp hồ sơ khác.',
    },
    framework: [
      {
        name: 'Bắt đầu từ tuyên bố, không từ hiện vật',
        detail:
          'Viết trước câu bạn muốn người khác tin, ví dụ "tôi làm sạch được dữ liệu bẩn của bộ phận vận hành". Mỗi tuyên bố chỉ cần đúng một bằng chứng tốt. Đi ngược lại — gom hết những thứ đã làm rồi tìm xem chúng chứng minh điều gì — cho ra một đống lộn xộn không tuyên bố nào đứng vững.',
      },
      {
        name: 'Chọn hiện vật rẻ nhất mà đủ',
        detail:
          'Một bản ghi màn hình ba phút, một trang quy trình, một cặp ảnh trước và sau, một biên bản họp bạn viết — thường đã đủ. Dựng một dự án lớn chỉ để chứng minh một tuyên bố nhỏ là cách phổ biến nhất để không bao giờ có hiện vật nào, vì dự án lớn không kịp xong.',
      },
      {
        name: 'Làm sạch bảo mật trước khi chia sẻ',
        detail:
          'Thay dữ liệu thật bằng dữ liệu giả cùng cấu trúc và cùng độ khó, bỏ tên khách hàng và số liệu tài chính nội bộ, đọc lại thỏa thuận bảo mật đã ký. Một hiện vật đẹp làm lộ dữ liệu công ty cũ là bằng chứng ngược: nó nói với người xem rằng bạn sẽ làm y hệt với dữ liệu của họ.',
      },
      {
        name: 'Gắn bối cảnh và số đo',
        detail:
          'Mỗi hiện vật kèm đúng năm dòng: vấn đề, ràng buộc, phần bạn tự làm và phần người khác làm, kết quả có số, và điều bạn sẽ làm khác nếu làm lại. Dòng cuối là dòng người có kinh nghiệm đọc kỹ nhất, vì nó cho biết bạn có rút ra được nguyên tắc hay chỉ vừa gặp may.',
      },
      {
        name: 'Xin xác nhận ngay khi việc vừa xong',
        detail:
          'Một câu từ người thụ hưởng — "nhóm tôi vẫn dùng bảng này hằng tháng" — nâng bằng chứng lên bậc cao nhất. Xin lúc việc vừa xong thì dễ và tự nhiên; xin sau một năm khi bạn cần đi phỏng vấn thì vừa khó vừa lộ ý đồ.',
      },
    ],
    scenario:
      'Một sinh viên năm cuối ngành marketing, chưa từng đi làm chính thức, có hồ sơ toàn những dòng như "khả năng làm việc nhóm tốt, sử dụng thành thạo công cụ thiết kế". Bạn ấy chọn ba tuyên bố và mỗi tuyên bố dựng đúng một hiện vật. Tuyên bố một là làm được nội dung cho một cửa hàng nhỏ thật: bạn nhận làm không lấy phí sáu tuần cho quán bún của người quen, và giữ lại hai thứ — bảng theo dõi số lượt đặt món qua tin nhắn theo tuần, và bản kế hoạch nội dung đã chạy. Tuyên bố hai là viết được bản tóm tắt yêu cầu: giữ lại bản một trang mà chủ quán đã đọc và xác nhận trước khi bắt đầu. Tuyên bố ba là biết đo và rút kinh nghiệm: một trang tổng kết nêu hai bài đăng thất bại, giả thuyết về lý do, và thay đổi đã áp dụng ở đợt sau kèm kết quả. Ở vòng phỏng vấn thực tập, bạn ấy chủ động mở đúng trang tổng kết thất bại. Buổi phỏng vấn kéo dài gấp đôi dự kiến và toàn bộ phần sau xoay quanh cách bạn ấy suy luận — "nếu ngân sách gấp ba thì em làm gì khác" — chứ không còn quay lại chuyện chưa có kinh nghiệm. Bạn ấy không nhận được vị trí đó vì họ cần người làm được ngay từ tháng đầu, nhưng người phỏng vấn giữ hồ sơ lại và giới thiệu sang một nhóm khác vào kỳ sau. Hiện vật không bảo đảm kết quả; nó chỉ đảm bảo bạn được đánh giá bằng những gì mình làm được thay vì bằng dòng kinh nghiệm còn trống.',
    comparison: [
      {
        weak: 'Liệt kê công cụ và tính từ trong hồ sơ, để người đọc tự tưởng tượng ra năng lực phía sau.',
        mature:
          'Mỗi dòng năng lực trỏ tới một hiện vật mở ra xem được trong ba mươi giây, và hiện vật đó tự nói phần mà tính từ đang cố nói hộ.',
      },
      {
        weak: 'Đợi đến khi có một dự án đủ lớn và đủ đẹp mới bắt đầu làm hồ sơ, nên năm nào cũng chưa đến lúc.',
        mature:
          'Lưu hiện vật ngay khi việc vừa xong, kể cả việc nhỏ; hồ sơ là thói quen lưu trữ chạy quanh năm, không phải một chiến dịch làm gấp trước khi nộp đơn.',
      },
      {
        weak: 'Kể kết quả của cả nhóm bằng đại từ "chúng tôi" mà không tách phần mình, để người đọc tự hiểu là bạn làm hết.',
        mature:
          'Nói rõ ranh giới: phần này tôi làm, phần kia hai đồng nghiệp làm, tôi phụ trách ghép và bảo vệ phương án. Việc tách phần làm tăng độ tin cậy của toàn bộ phần còn lại chứ không làm giảm công của bạn.',
      },
    ],
    mistakes: [
      'Mang file thật của công ty cũ ra làm mẫu hồ sơ. Đây vừa là vi phạm cam kết bảo mật vừa là tín hiệu xấu rõ ràng với nơi tuyển mới. Cần nhớ cả cấu trúc bảng và tên trường dữ liệu cũng có thể là thông tin bảo mật, nên xóa tên khách chưa chắc đã đủ — hãy dựng lại bằng dữ liệu giả hoặc xin phép bằng văn bản.',
      'Đưa hiện vật ra mà không có bối cảnh: một biểu đồ đẹp không cho biết bạn giải quyết vấn đề gì, trong ràng buộc nào, với bao nhiêu thời gian. Người xem không suy ra được năng lực từ một tấm ảnh, họ chỉ kết luận là bạn biết dùng công cụ vẽ biểu đồ.',
      'Dùng số liệu thổi phồng hoặc không truy được nguồn, kiểu "tăng ba trăm phần trăm doanh thu". Người có kinh nghiệm sẽ hỏi mẫu số và cách đo trong vòng hai câu; trả lời không được thì mọi bằng chứng còn lại trong hồ sơ mất giá trị cùng lúc, kể cả những cái hoàn toàn thật.',
    ],
    worksheet: [
      'Viết ba tuyên bố bạn muốn nhà tuyển dụng hoặc khách hàng tin về mình. Tuyên bố nào hiện chưa có bất kỳ hiện vật nào đỡ lưng, và tuyên bố nào bạn đang lặp lại chỉ vì thấy người khác cũng viết thế?',
      'Với việc bạn hoàn thành gần đây nhất, hiện vật rẻ nhất còn giữ lại được là gì — file, ảnh chụp màn hình, tin nhắn xác nhận, hay biên bản?',
      'Trong những thứ bạn định đưa ra ngoài, mục nào chứa dữ liệu không được phép chia sẻ, kể cả ở dạng cấu trúc và tên trường? Bạn sẽ thay bằng gì mà vẫn giữ nguyên độ khó của bài toán?',
      'Với hiện vật quan trọng nhất, con số trước và sau là gì, đo bằng cách nào, và ai kiểm chứng được con số đó ngoài bạn?',
      'Ai có thể viết cho bạn một câu xác nhận ngay trong tuần này, và bạn sẽ nhắn họ chính xác câu gì để họ trả lời được trong hai phút?',
    ],
    exercises: [
      {
        label: 'Ba tuyên bố và ba lỗ hổng',
        text: 'Viết ba tuyên bố năng lực quan trọng nhất với hướng đi hiện tại, rồi ghi cạnh mỗi cái bằng chứng mạnh nhất bạn đang có và bậc của nó theo thang bốn bậc. Khoanh tuyên bố yếu nhất — đó là việc đầu tiên phải làm trong tháng này.',
        level: 'e',
      },
      {
        label: 'Lục lại chín mươi ngày',
        text: 'Rà hộp thư, tin nhắn và các thư mục của chín mươi ngày gần nhất, thu về mọi thứ có thể thành hiện vật. Đặt tất cả vào một thư mục duy nhất theo ngày, chưa biên tập gì. Mục tiêu là thấy bạn đã vứt đi bao nhiêu thứ vốn dùng được.',
        level: 'e',
      },
      {
        label: 'Năm dòng bối cảnh',
        text: 'Chọn một hiện vật và viết đúng năm dòng: vấn đề, ràng buộc, phần bạn làm, kết quả có số, điều sẽ làm khác. Đưa cho một người không cùng nghề đọc và hỏi họ kể lại bạn đã làm gì — chỗ họ kể sai là chỗ năm dòng của bạn còn thiếu.',
        level: 'e',
      },
      {
        label: 'Bản khử dữ liệu nhạy cảm',
        text: 'Tạo phiên bản chia sẻ được của một hiện vật thật: thay số liệu bằng dữ liệu giả cùng cấu trúc và cùng độ khó, đổi tên riêng, giữ nguyên logic xử lý. Nhờ một người rà lại xem còn sót thông tin nhận dạng nào trong tên file, siêu dữ liệu hay chú thích không.',
        level: 'm',
      },
      {
        label: 'Xin ba câu xác nhận',
        text: 'Nhắn ba người từng nhận kết quả của bạn, mỗi tin nêu rõ việc cụ thể và xin một câu mô tả kết quả họ đã dùng. Lưu nguyên văn kèm ngày và vai trò của họ. Nếu ai đó không trả lời, đừng nhắc lại quá một lần — ghi nhận và chuyển sang người khác.',
        level: 'm',
      },
      {
        label: 'Bản ghi màn hình ba phút',
        text: 'Quay lại ba phút bạn xử lý một việc thật từ đầu đến cuối, có thuyết minh lý do ở mỗi chỗ rẽ quyết định. Đây là loại bằng chứng khó dựng giả nhất và gần như không ứng viên nào làm, nên nó cũng là loại được nhớ lâu nhất.',
        level: 'm',
      },
      {
        label: 'Một trang chỉ mục bằng chứng',
        text: 'Dựng một trang duy nhất liệt kê năm đến bảy tuyên bố, mỗi tuyên bố kèm một liên kết tới hiện vật và một câu xác nhận. Gửi cho hai người trong nghề và hỏi họ dừng lại ở mục nào, bỏ qua mục nào — thứ tự chú ý của họ là thứ tự bạn nên sắp lại trang.',
        level: 'h',
      },
      {
        label: 'Phiên bảo vệ hai mươi phút',
        text: 'Nhờ một người có kinh nghiệm chất vấn bạn hai mươi phút về một hiện vật: đo bằng cách nào, ai làm phần nào, thứ gì sẽ hỏng nếu quy mô gấp mười lần. Ghi lại ba câu bạn trả lời yếu nhất và bổ sung đúng ba chỗ đó vào hồ sơ, không sửa lan man chỗ khác.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Bạn làm ở nơi mọi thứ đều là dữ liệu nội bộ không được đưa ra ngoài. Xây bằng chứng kiểu gì?',
        a: 'Có ba đường hợp lệ. Một, dựng lại bài toán bằng dữ liệu giả cùng cấu trúc rồi công bố cách giải, không công bố dữ liệu. Hai, xin xác nhận từ người trong công ty ở mức không lộ số nhạy cảm, kiểu "giảm thời gian chốt sổ khoảng một nửa". Ba, làm một việc nhỏ ngoài công ty — cho một tổ chức phi lợi nhuận, cửa hàng của người quen, hoặc cộng đồng nghề — để có hiện vật công khai được. Không đường nào cho phép mang file thật ra ngoài, kể cả khi đã xóa tên.',
      },
      {
        q: 'Vì sao dòng "điều tôi sẽ làm khác" lại quan trọng đến vậy?',
        a: 'Vì nó phân biệt người vừa làm xong một việc với người đã rút ra được nguyên tắc. Ai cũng kể được một kết quả tốt, kể cả khi kết quả đó đến phần lớn nhờ may mắn hoặc nhờ người khác gánh. Câu "nếu làm lại tôi sẽ đo trước khi sửa, vì lần đó tôi không chứng minh được phần cải thiện đến từ thay đổi nào" cho thấy bạn hiểu quan hệ nhân quả trong chính công việc của mình — và đó là thứ dự đoán được chất lượng những lần sau, thứ mà người tuyển thật sự đang mua.',
      },
      {
        q: 'Nên có bao nhiêu hiện vật trong hồ sơ?',
        a: 'Ít mà sâu. Ba đến năm hiện vật, mỗi cái có bối cảnh, số đo và xác nhận, mạnh hơn hai mươi mục nông. Người xem hồ sơ thường chỉ đọc kỹ một hoặc hai mục đầu, hiện vật thứ mười lăm gần như không bao giờ được mở. Đặt cái gần nhất với công việc đang nhắm ở vị trí đầu tiên, và mạnh tay bỏ hẳn những mục không còn đại diện cho mức hiện tại của bạn — giữ chúng lại chỉ kéo mức trung bình của hồ sơ xuống.',
      },
    ],
    plan7:
      'Ngày 1: viết ba tuyên bố và chấm bậc bằng chứng hiện có cho từng cái. Ngày 2: lục lại chín mươi ngày và gom mọi hiện vật tiềm năng vào một chỗ. Ngày 3: chọn hiện vật mạnh nhất, viết năm dòng bối cảnh và nhờ một người ngoài nghề đọc thử. Ngày 4: làm bản khử dữ liệu nhạy cảm cho hiện vật đó và nhờ người rà lại. Ngày 5: nhắn xin ba câu xác nhận. Ngày 6: quay một bản ghi màn hình ba phút cho một việc bạn làm quen tay. Ngày 7: dựng trang chỉ mục một trang, gửi cho hai người trong nghề kèm câu hỏi họ dừng lại ở mục nào.',
    evidence:
      'Chương này dạy cách dựng bằng chứng; phần khó hơn là bảo trì nó và kể nó khi không ai chịu mở liên kết. Ba việc bảo trì: cứ chín mươi ngày mở lại chỉ mục một lần, gỡ bỏ hiện vật không còn đại diện cho mức hiện tại, và bổ sung một cái mới từ quý vừa rồi — hồ sơ cũ dần trở thành bằng chứng ngược về việc bạn đã đứng yên. Chuẩn bị sẵn ba độ dài để kể: một câu cho lúc gặp tình cờ, chín mươi giây cho vòng sàng lọc, và mười phút có mở hiện vật cho vòng chuyên môn. Với những nghề mà công việc gần như vô hình — hành chính, hỗ trợ khách hàng, vận hành — thứ đóng vai hiện vật thường là quy trình bạn viết ra, bảng theo dõi bạn dựng, hoặc số liệu trước và sau của một thay đổi nhỏ bạn đề xuất; hãy chủ động tạo ra chúng, vì loại công việc này không tự để lại dấu vết như một sản phẩm nhìn thấy được.',
    references: [
      { label: 'The Muse — Advice: hướng dẫn dựng hồ sơ, portfolio và cách trình bày kết quả', url: 'https://www.themuse.com/advice', type: 'article' },
      { label: 'Harvard Business Review — chuyên mục Managing yourself', url: 'https://hbr.org/topic/subject/managing-yourself', type: 'article' },
    ],
  }),

  // ── Chương 5 · Nhật ký thực hành ──────────────────────────────────────────
  guide({
    diagram: 'cycle',
    thesis:
      'Nhật ký thực hành khác nhật ký cảm xúc ở đúng một chi tiết, nhưng chi tiết đó quyết định tất cả: bạn ghi dự đoán trước khi biết kết quả. Không có con số ghi trước, mọi bản ghi viết sau sự việc đều bị trí nhớ chỉnh lại cho hợp lý — bạn sẽ nhớ rằng mình "đã linh cảm chuyện đó từ đầu" và rút ra một bài học giả không đổi được hành vi nào. Bốn dòng viết trong mười phút — tình huống, dự đoán, điều đã xảy ra, điều chỉnh cụ thể — có giá trị hơn ba trang cảm nghĩ viết vào tối chủ nhật.',
    why: {
      work:
        'Những quyết định lặp lại — ước lượng thời gian, chọn nhà cung cấp, chọn người vào việc, xử lý sự cố — chỉ tốt lên khi có bản ghi để đối chiếu. Trí nhớ nghề nghiệp giữ lại ấn tượng và vài lần thất bại nặng, nó không giữ lại phân bố của các lần bình thường, mà phân bố mới là thứ dự đoán được lần sau.',
      interview:
        'Câu "kể một thất bại và bạn học được gì" phân loại rất nhanh. Người không có nhật ký kể một câu chuyện tròn trịa với bài học chung chung; người có nhật ký nêu được dự đoán ban đầu, khoảng lệch thật, thay đổi đã áp dụng và kết quả của lần sau đó — cấu trúc này gần như không bịa nổi.',
      study:
        'Luyện tập chỉ tiến bộ khi có vòng phản hồi ngắn. Khi tự học và không có ai đứng cạnh sửa, nhật ký là vòng phản hồi tự cấp duy nhất bạn có, và nó chỉ hoạt động nếu có dự đoán ghi trước để so.',
      life:
        'Các quyết định lớn trong đời — đổi chỗ ở, chọn trường cho con, một khoản chi đáng kể — diễn ra thưa tới mức không thể học bằng lặp lại. Chỉ có ghi lại lý do và kỳ vọng ngay lúc quyết mới cho bạn cơ hội học được điều gì từ chúng, vài năm sau khi kết quả đã rõ.',
    },
    framework: [
      {
        name: 'Bắt sự kiện trong hai mươi bốn giờ',
        detail:
          'Luật cứng: ghi trong vòng một ngày, tối đa mười phút, chỉ ghi sự việc và con số, không viết văn. Quá hai mươi bốn giờ thì thứ bạn ghi đã là bản dựng lại của trí nhớ chứ không còn là quan sát.',
      },
      {
        name: 'Ghi dự đoán trước khi có kết quả',
        detail:
          'Với mọi việc chưa ngã ngũ — một ước lượng, một đề xuất, một cuộc nói chuyện khó — viết trước ba thứ: bạn nghĩ kết quả sẽ ra sao, mức tự tin theo phần trăm, và dấu hiệu nào sẽ chứng minh bạn đã sai. Dấu hiệu sai phải viết ra trước, vì sau đó bạn sẽ không nghĩ ra được nữa.',
      },
      {
        name: 'Mở lại và đối chiếu khi kết quả về',
        detail:
          'Quay về đúng mục cũ, ghi điều đã xảy ra và khoảng lệch tính bằng đơn vị đo được: giờ, ngày, tiền, số vòng sửa. Đây là bước gần như ai cũng bỏ, và bỏ nó thì cả hệ thống chỉ còn là một kho lưu trữ đẹp mà không sinh ra bài học nào.',
      },
      {
        name: 'Rút đúng một luật mỗi lần',
        detail:
          'Mỗi lần đối chiếu chỉ viết một câu theo dạng "khi gặp X tôi có xu hướng Y, lần sau tôi sẽ Z". Luật phải cụ thể đến mức tuần sau có người kiểm được là bạn đã làm hay chưa. Rút mười bài học một lúc nghĩa là không áp dụng bài nào.',
      },
      {
        name: 'Rà theo hai nhịp',
        detail:
          'Hai mươi phút cuối tuần đọc lại các mục có khoảng lệch lớn; sáu mươi phút cuối quý đếm xem loại lỗi nào lặp lại nhiều nhất và chọn đúng một loại để chặn bằng thay đổi cấu trúc — một mẫu, một danh sách kiểm, một luật của nhóm — chứ không bằng lời hứa sẽ chú ý hơn.',
      },
    ],
    scenario:
      'Một trưởng nhóm kỹ thuật quản tám người, tháng nào cũng cam kết ngày bàn giao với bộ phận kinh doanh rồi trễ, và mỗi lần trễ đều giải thích được bằng một lý do nghe rất hợp lý nhưng khác nhau. Anh bắt đầu ghi bốn dòng cho mỗi lần ước lượng: việc gì, ước lượng của anh, mức tự tin, và ngày xong thật khi kết quả về. Sau mười một lần trong hai tháng, bảng cho thấy một điều không lý do nào trước đó nhắc tới: những việc nhóm anh đã làm quen thì ước lượng lệch rất ít, còn những việc phải chờ một bộ phận khác trả lời thì trễ trung bình gấp đôi — và toàn bộ các lần trễ đều rơi vào nhóm thứ hai. Luật anh rút ra vì thế không phải "ước lượng rộng tay hơn", vốn là điều anh đã tự nhủ nhiều lần mà không đổi được gì. Luật cụ thể hơn nhiều: mọi cam kết có phụ thuộc bên ngoài phải nêu tên người phụ thuộc và ngày cần câu trả lời của họ, và nếu chưa có ngày đó thì chỉ được báo hạn dưới dạng khoảng, không được báo một ngày cụ thể. Ba tháng sau, số cam kết trễ giảm rõ và những lần còn trễ đều đã được báo trước ít nhất một tuần. Anh còn phát hiện một điều không định tìm: các lần ước lượng chính xác nhất đều là lần anh hỏi trực tiếp người sẽ làm trước khi trả lời, chứ không phải lần anh có nhiều thời gian cân nhắc nhất.',
    comparison: [
      {
        weak: 'Chỉ viết khi có cảm xúc mạnh — vừa bị chê hoặc vừa được khen — nên hồ sơ chỉ có các đỉnh và không có dữ liệu của ngày thường.',
        mature:
          'Ghi theo loại sự kiện đã định trước: mỗi lần ước lượng, mỗi lần trình bày, mỗi lần xử lý sự cố, bất kể hôm đó bạn thấy thế nào.',
      },
      {
        weak: 'Chỉ ghi sau khi đã biết kết quả, nên bản ghi là một câu chuyện kể lại và luôn có vẻ hợp lý.',
        mature:
          'Ghi dự đoán trước, để khoảng lệch giữa dự đoán và thực tế trở thành một con số đo được mà trí nhớ không sửa được.',
      },
      {
        weak: 'Viết dài, đổi mẫu liên tục, và không bao giờ đọc lại — nhật ký thành một nghĩa trang của những buổi tối chăm chỉ.',
        mature:
          'Viết ngắn theo một cấu trúc cố định đủ lâu để so sánh được theo thời gian, và có lịch đọc lại thật nằm trong lịch chứ không nằm trong ý định.',
      },
    ],
    mistakes: [
      'Biến nhật ký thành nơi tự trách: mục nào cũng kết thúc bằng "lần sau phải cẩn thận hơn". Đó không phải điều chỉnh, vì không ai kiểm được tuần sau bạn đã cẩn thận hơn hay chưa. Điều chỉnh dùng được luôn có hình dạng của một hành động cụ thể trong một tình huống cụ thể.',
      'Chỉ ghi những lần hỏng. Bạn mất luôn dữ liệu về những lần làm đúng, nên không biết thứ gì đang có tác dụng để giữ lại, và quyển sổ dần trở thành thứ bạn né tránh mở ra vì mở ra chỉ thấy toàn thất bại.',
      'Đổi cấu trúc ghi liên tục — tuần này ba dòng, tuần sau bảng bảy cột — làm mất khả năng so sánh theo thời gian. Giá trị của nhật ký nằm ở một chuỗi dài cùng định dạng, không nằm ở việc tìm ra mẫu ghi hoàn hảo.',
    ],
    worksheet: [
      'Loại quyết định nào bạn lặp lại ít nhất mỗi tuần và có kết quả kiểm chứng được trong vòng một tháng? Đó là ứng viên đầu tiên để bắt đầu ghi dự đoán.',
      'Lần gần nhất bạn ước lượng sai đáng kể, bạn còn nhớ mức tự tin của mình lúc đó không? Nếu không nhớ, điều đó nói gì về khả năng học từ trí nhớ của bạn?',
      'Viết mẫu ghi bốn dòng của riêng bạn ra đây. Bạn sẽ ghi vào đâu, và mất bao nhiêu giây để mở nó ra kể từ lúc sự việc vừa kết thúc?',
      'Chọn một câu điều chỉnh bạn từng viết cho mình. Tuần sau có ai kiểm được là bạn đã làm hay chưa không? Nếu không, hãy viết lại cho tới khi kiểm được.',
      'Bạn sẽ đọc lại nhật ký vào lúc nào trong tuần, và việc gì có khả năng cao nhất sẽ chiếm mất khung giờ đó? Bạn định làm gì khi điều đó xảy ra?',
    ],
    exercises: [
      {
        label: 'Mẫu bốn dòng',
        text: 'Tạo mẫu ghi cố định gồm bốn dòng và ghi ba mục đầu tiên ngay hôm nay, mỗi mục dưới mười phút. Không sửa câu chữ, không thêm cột nào. Mục tiêu của bài này là chạm tay vào việc ghi, không phải thiết kế hệ thống.',
        level: 'e',
      },
      {
        label: 'Ba dự đoán trong tuần',
        text: 'Với ba việc chưa có kết quả, ghi trước dự đoán kèm mức tự tin theo phần trăm và một dấu hiệu sẽ chứng minh bạn sai. Ghi luôn ngày kết quả dự kiến sẽ về, và đặt lời nhắc vào đúng ngày đó.',
        level: 'e',
      },
      {
        label: 'Ghi cả những lần làm đúng',
        text: 'Trong năm ngày, ghi ít nhất hai mục về việc diễn ra tốt, nêu rõ bạn đã làm khác thường ngày ở chỗ nào. Cuối tuần đọc lại hai mục đó và tìm điểm chung — đó là thứ bạn nên cố ý lặp lại thay vì để nó xảy ra ngẫu nhiên.',
        level: 'e',
      },
      {
        label: 'Mở lại và đối chiếu',
        text: 'Khi kết quả về, mở lại đúng mục cũ và ghi khoảng lệch bằng đơn vị đo được: giờ, ngày, tiền, hoặc số vòng sửa. Làm với năm mục rồi xếp chúng theo độ lệch giảm dần và xem ba mục đầu có gì giống nhau.',
        level: 'm',
      },
      {
        label: 'Một luật mỗi tuần',
        text: 'Cuối tuần chỉ rút đúng một luật dạng "khi gặp X tôi có xu hướng Y, lần sau tôi sẽ Z", và dán nó ở nơi bạn nhìn thấy đúng lúc sắp gặp tình huống X. Cuối tuần kế tiếp tự chấm bạn đã áp dụng được mấy lần trên tổng số lần gặp.',
        level: 'm',
      },
      {
        label: 'Bảng lỗi lặp bốn tuần',
        text: 'Sau bốn tuần, phân loại các mục có khoảng lệch thành nhóm nguyên nhân và đếm số lần từng nhóm. Lấy nhóm đông nhất và thiết kế một chặn bằng cấu trúc — danh sách kiểm, mẫu điền sẵn, hoặc một luật của nhóm — thay vì bằng quyết tâm cá nhân.',
        level: 'm',
      },
      {
        label: 'Nhật ký cho một quyết định lớn',
        text: 'Với một quyết định lớn sắp tới, viết trước một trang: các lựa chọn, thông tin đang có, giả định chính, kết quả kỳ vọng, và ngày sẽ mở lại để đối chiếu. Đặt lời nhắc đúng ngày đó. Nếu quyết định dính tới vay nợ, thuế hay pháp lý, trang này chỉ là ghi chép cá nhân, không thay được ý kiến của người có chuyên môn.',
        level: 'h',
      },
      {
        label: 'Rà quý sáu mươi phút',
        text: 'Đọc toàn bộ nhật ký của một quý và trả lời bốn câu: loại lỗi nào lặp nhiều nhất, luật nào đã thật sự đổi được hành vi, dự đoán của bạn đang lệch theo hướng nào một cách hệ thống, và thay đổi cấu trúc nào bạn mang sang quý sau. Viết kết luận ra một trang riêng để quý sau có thứ để so.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Vì sao ghi dự đoán trước lại quan trọng hơn ghi bài học sau?',
        a: 'Vì trí nhớ sửa lại quá khứ cho khớp với kết quả đã biết. Sau khi biết dự án trễ, bạn gần như chắc chắn sẽ nhớ rằng mình đã thấy rủi ro đó từ đầu, nên bài học rút ra thường là bài học giả và không đổi được hành vi nào. Con số dự đoán ghi trước là thứ duy nhất trí nhớ không chạm vào được: nó cho bạn khoảng lệch thật, và chỉ khoảng lệch mới luyện được.',
      },
      {
        q: 'Nhật ký của bạn đã hai tháng không mở. Khởi động lại thế nào?',
        a: 'Đừng đọc bù và đừng dựng mẫu mới — cả hai đều là cách trì hoãn trông giống chăm chỉ. Làm ba việc theo thứ tự: ghi một mục về chính việc bỏ nhịp, chuyện gì đã chiếm chỗ và mất bao lâu; hạ ngưỡng xuống mức không thể trượt, ví dụ một mục mỗi tuần ba dòng; và gắn nó ngay sau một hoạt động đã cố định trong lịch, chẳng hạn cuộc họp nhóm hằng tuần. Nhật ký chết vì tiêu chuẩn quá cao nhiều hơn là vì thiếu động lực.',
      },
      {
        q: 'Nên ghi bằng giấy hay bằng phần mềm?',
        a: 'Câu hỏi đúng không phải công cụ mà là hai thuộc tính: mở được trong hai mươi giây kể từ lúc sự việc kết thúc, và tìm lại được theo lô sau ba tháng. Giấy thắng ở vế đầu, phần mềm thắng ở vế sau. Nếu công việc của bạn di chuyển nhiều, một cuốn sổ nhỏ trong túi cộng với một lần chép sang phần mềm mỗi tuần là tổ hợp thực tế. Thứ gần như luôn hỏng là dùng ba nơi cùng lúc, vì đến lúc cần đọc lại bạn không biết mở cái nào.',
      },
    ],
    plan7:
      'Ngày 1: dựng mẫu bốn dòng và ghi ba mục đầu tiên. Ngày 2: chọn loại quyết định lặp lại của bạn và ghi ba dự đoán kèm mức tự tin. Ngày 3: ghi một mục về việc diễn ra tốt, nêu rõ bạn đã làm khác gì. Ngày 4: mở lại mục đầu tiên có kết quả và ghi khoảng lệch bằng số. Ngày 5: ghi tiếp và bắt đầu chú ý xem bạn đang lệch theo hướng lạc quan hay bi quan. Ngày 6: rút đúng một luật và dán nó ở nơi sẽ nhìn thấy đúng lúc cần. Ngày 7: đọc lại cả tuần trong hai mươi phút, chọn một chỗ sẽ chặn bằng cấu trúc và đặt lịch rà tuần cố định cho các tuần sau.',
    evidence:
      'Bản thân quyển nhật ký là tài liệu riêng tư và không nên đưa cho ai, nhưng ba thứ rút ra từ nó thì đưa được. Một, bảng khoảng lệch ước lượng theo thời gian, đã ẩn nội dung dự án — nó cho thấy bạn biết mình sai lệch theo hướng nào và đã sửa được bao nhiêu. Hai, danh sách các luật đã áp dụng kèm thay đổi cấu trúc đi theo. Ba, một trang tổng kết quý. Khi được hỏi kể về một thất bại, hãy trả lời bằng đúng một mục nhật ký theo trình tự dự đoán, thực tế, khoảng lệch, thay đổi, kết quả lần sau — cấu trúc này khó dựng giả và người nghe nhận ra ngay sự khác biệt so với một câu chuyện được kể tròn. Nếu bạn đang hoặc sắp quản lý người khác, việc duy trì được vòng ghi và rút luật cho chính mình là bằng chứng gián tiếp rằng bạn sẽ dựng được vòng tương tự cho cả nhóm.',
    references: [
      { label: 'Farnam Street — Decision journal: cách ghi và đối chiếu quyết định', url: 'https://fs.blog/decision-journal/', type: 'article' },
      { label: 'TED — Eduardo Briceño: tách vùng học và vùng thể hiện trong luyện tập', url: 'https://www.ted.com/talks/eduardo_briceno_how_to_get_better_at_the_things_you_care_about', type: 'video' },
    ],
  }),

  // ── Chương 6 · Hệ thống nhận phản hồi ─────────────────────────────────────
  guide({
    diagram: 'cycle',
    thesis:
      'Phản hồi không phải thứ bạn ngồi chờ người khác trao, mà là một hệ thống bạn tự thiết kế: có nguồn, có câu hỏi, có nhịp và có bước đóng vòng. Người nhận được nhiều phản hồi hữu ích thường không phải người dễ mến hơn, mà là người đã hạ chi phí của việc góp ý xuống thấp — hỏi câu hẹp, hỏi đúng giai đoạn còn sửa được, cho người kia cách trả lời rẻ nhất, và cho họ thấy lần góp ý trước đã dẫn tới một thay đổi cụ thể.',
    why: {
      work:
        'Câu "anh thấy sao" gần như luôn nhận lại "ổn mà" — không phải vì người kia không có ý kiến, mà vì trả lời tử tế cho một câu hỏi rộng tốn quá nhiều công và mang rủi ro quan hệ. Hỏi hẹp là cách bạn trả phần chi phí đó thay cho họ.',
      interview:
        'Rất nhiều vòng phỏng vấn hỏi thẳng về lần gần nhất bạn nhận phản hồi tiêu cực. Người có hệ thống kể được nguồn, câu hỏi đã đặt, phản hồi nhận về và thay đổi sau đó; người không có thì kể một câu chuyện trong đó họ luôn là người hiểu ra vấn đề sau cùng.',
      study:
        'Khi tự học, thứ thiếu nhất không phải tài liệu — tài liệu miễn phí nhiều hơn thời gian bạn có — mà là người chỉ ra bạn đang sai ở đâu. Thiết kế nguồn phản hồi vì thế quan trọng hơn chọn khóa học.',
      life:
        'Trong quan hệ gia đình và bạn bè, phản hồi hầu như không được nói ra cho tới khi đã muộn. Một câu hỏi hẹp và định kỳ, kiểu "tháng này có việc gì anh làm khiến em phải nhắc lại lần thứ hai không", mở được cửa sớm hơn nhiều so với đợi tới lúc có chuyện.',
    },
    framework: [
      {
        name: 'Đặt câu hỏi hẹp',
        detail:
          'Thay "cho mình xin góp ý" bằng "trong ba phút mở đầu, chỗ nào bạn thấy mất mạch". Câu hẹp vừa giảm chi phí trả lời vừa cho ra thông tin dùng được ngay, và nó còn báo cho người kia biết bạn đã tự nghĩ đến đâu.',
      },
      {
        name: 'Chọn nguồn theo loại thông tin cần',
        detail:
          'Bốn nguồn cho bốn loại thông tin: người dùng thật cho biết có dùng được không; người ngang hàng cho chi tiết nghề; người giỏi hơn một bậc cho thứ bạn chưa biết là mình chưa biết; dữ liệu cho thứ không ai chịu nói ra. Hỏi nguồn này thứ chỉ nguồn kia biết là nguyên nhân phổ biến nhất của phản hồi vô dụng.',
      },
      {
        name: 'Hạ chi phí cho người cho phản hồi',
        detail:
          'Gửi bản đã gọn, nói rõ cần bao nhiêu phút, nói rõ bản này đang ở giai đoạn nào — nháp hay gần cuối — và cho họ cách trả lời rẻ nhất: nhắn thoại, gạch đầu dòng, hoặc đánh dấu thẳng lên tài liệu.',
      },
      {
        name: 'Phân loại trước khi phản ứng',
        detail:
          'Chia mọi phản hồi thành ba nhóm: sự việc quan sát được, diễn giải về nguyên nhân, và sở thích cá nhân. Ba nhóm cần ba cách xử lý khác nhau; trộn chúng lại là gốc rễ của cả việc tự ái lẫn việc sửa sai chỗ.',
      },
      {
        name: 'Đóng vòng trong một tuần',
        detail:
          'Báo lại cho người đã góp ý: bạn đổi gì, bỏ qua gì và vì sao. Đây là bước quyết định họ có góp ý cho bạn lần thứ hai hay không, và nó tốn của bạn đúng ba dòng tin nhắn.',
      },
    ],
    scenario:
      'Một giáo viên dạy thêm môn Hóa cấp ba, lớp hai mươi hai học sinh, cuối mỗi khóa đều xin đánh giá và luôn nhận về "thầy dạy dễ hiểu ạ". Anh thay lời xin đánh giá bằng một hệ thống ba nguồn. Nguồn thứ nhất là người dùng thật: cuối mỗi buổi, một phiếu ẩn danh chín mươi giây với đúng hai câu — chỗ nào trong buổi hôm nay em nghe mà không theo kịp, và bài tập nào em không biết bắt đầu từ đâu. Nguồn thứ hai là người ngang hàng: hai tuần một lần anh nhờ một đồng nghiệp dự hai mươi phút với một câu hỏi hẹp đặt trước, chỗ nào tôi nói nhanh hơn tốc độ ghi của học sinh. Nguồn thứ ba là dữ liệu: thay vì chỉ tính điểm trung bình bài kiểm tra, anh đếm dạng bài bị sai nhiều nhất. Sau bốn tuần, cả ba nguồn chỉ về cùng một chỗ mà sáu tháng hỏi cảm nhận trước đó không hề chạm tới: phần biến đổi phương trình anh viết trên bảng nhanh gần gấp đôi phần lý thuyết, vì với anh đó là bước hiển nhiên. Anh đổi cấu trúc buổi học, tách riêng phần đó ra và cho học sinh làm trước một bước mẫu. Hai thứ anh đo được sau đó: số câu hỏi lặp lại về dạng bài này trong nhóm chat giảm rõ rệt, và tỷ lệ học sinh bỏ trống câu cuối trong bài kiểm tra tuần giảm. Điều đáng chú ý nhất không phải kết quả, mà là suốt sáu tháng trước đó không một học sinh nào tự nói ra chỗ này khi được hỏi thấy thầy dạy thế nào.',
    comparison: [
      {
        weak: 'Hỏi rộng và hỏi vào cuối chu kỳ, khi đã quá muộn để sửa bất cứ thứ gì đáng kể.',
        mature:
          'Hỏi hẹp và hỏi sớm, ở giai đoạn còn sửa được, kèm câu nói rõ bản này đang ở mức nháp hay sắp giao để người kia biết nên góp ý vào tầng nào.',
      },
      {
        weak: 'Phản bác ngay tại chỗ để giải thích bối cảnh, khiến người góp ý hiểu rằng lần sau nói ra cũng chỉ tốn thời gian.',
        mature:
          'Ghi lại nguyên văn, chỉ hỏi thêm để làm rõ sự việc, rồi để hai mươi bốn giờ trôi qua mới quyết giữ hay sửa.',
      },
      {
        weak: 'Hoặc làm theo mọi góp ý, hoặc tự vệ trước mọi góp ý — cả hai đều là phản xạ chứ không phải quyết định.',
        mature:
          'Phân loại thành sự việc, diễn giải và sở thích, rồi có tiêu chí công khai để nói không với nhóm sở thích mà vẫn giữ được quan hệ.',
      },
    ],
    mistakes: [
      'Chỉ hỏi những người có khả năng đồng ý với mình — bạn thân, người cùng gu, người đang chịu ơn mình — rồi kết luận là sản phẩm ổn. Một hệ thống phản hồi không có người khó tính thực chất đang đo mức độ dễ chịu của chính bạn, không đo chất lượng công việc.',
      'Xin góp ý mà không nói bản đang ở giai đoạn nào: người khác chăm chú sửa lỗi chính tả trong khi bạn cần biết cấu trúc có sai không, hoặc ngược lại họ đề nghị làm lại từ đầu khi bạn còn hai ngày là phải giao.',
      'Không đóng vòng. Sau ba lần góp ý mà không thấy gì thay đổi và không nhận được một dòng hồi đáp nào, người cho sẽ chuyển sang trả lời cho xong — và bạn sẽ kết luận nhầm rằng mọi thứ đều ổn, đúng vào lúc nguồn thông tin của bạn vừa tắt.',
    ],
    worksheet: [
      'Trong ba tháng qua, phản hồi có ích nhất bạn nhận được đến từ ai? Bạn đã làm gì để nó xảy ra, và nếu nó đến ngẫu nhiên thì làm sao để lần sau không phải chờ may?',
      'Trong bốn nguồn — người dùng, người ngang hàng, người giỏi hơn, và dữ liệu — nguồn nào bạn đang thiếu hẳn? Tên cụ thể nào có thể lấp chỗ trống đó trong tháng này?',
      'Viết lại câu xin góp ý gần nhất của bạn thành một câu hẹp: nhắm vào một phần cụ thể, giới hạn thời lượng, và nói rõ giai đoạn của bản gửi đi.',
      'Có phản hồi nào bạn đã nghe từ ít nhất ba người khác nhau mà vẫn chưa làm gì không? Điều gì đang cản — bạn không đồng ý, không biết bắt đầu từ đâu, hay không muốn thừa nhận?',
      'Với người góp ý cho bạn gần đây nhất, bạn đã báo lại mình đổi gì chưa? Nếu chưa, hãy soạn ngay tin nhắn ba dòng và gửi trước khi đọc tiếp.',
    ],
    exercises: [
      {
        label: 'Ba câu hỏi hẹp',
        text: 'Với việc đang làm dở, viết ba câu hỏi hẹp nhắm vào ba chỗ bạn nghi ngờ nhất. Mỗi câu phải trả lời được trong dưới ba phút và không được chứa từ "nói chung" hay "tổng thể".',
        level: 'e',
      },
      {
        label: 'Bản đồ bốn nguồn',
        text: 'Lập bảng bốn nguồn và điền tên người hoặc kênh cụ thể cho từng nguồn, không điền vai trò chung chung. Đánh dấu ô trống và viết một hành động để lấp mỗi ô trong vòng ba mươi ngày.',
        level: 'e',
      },
      {
        label: 'Phiếu chín mươi giây',
        text: 'Thiết kế một phiếu hai câu ẩn danh cho người thụ hưởng công việc của bạn — học viên, đồng nghiệp, khách hàng. Phát ngay trong tuần này, đếm tỷ lệ trả lời, và ghi lại điều bất ngờ nhất bạn đọc được.',
        level: 'e',
      },
      {
        label: 'Phân loại ba nhóm',
        text: 'Lấy toàn bộ phản hồi bạn nhận gần đây và xếp vào ba nhóm. Với nhóm sự việc, viết hành động cụ thể; với nhóm diễn giải, viết câu hỏi làm rõ sẽ gửi lại; với nhóm sở thích, viết lý do bạn giữ nguyên để lần sau khỏi phải nghĩ lại.',
        level: 'm',
      },
      {
        label: 'Luật hai mươi bốn giờ',
        text: 'Trong hai tuần, mỗi lần nhận phản hồi khó nghe, bạn chỉ được nói đúng một câu tại chỗ — cảm ơn, cho tôi hỏi thêm một chi tiết — rồi ghi lại và đợi một ngày mới quyết. Đếm số lần phản ứng đầu tiên của bạn khác với quyết định sau đó.',
        level: 'm',
      },
      {
        label: 'Xin hai mươi phút của người giỏi hơn',
        text: 'Nhắn một người giỏi hơn bạn rõ rệt, xin hai mươi phút, gửi trước một hiện vật cùng đúng một câu hỏi. Sau buổi đó gửi lại bản tóm tắt những gì bạn hiểu được và điều bạn sẽ đổi — bước này biến một lần giúp đỡ thành một quan hệ lâu dài.',
        level: 'm',
      },
      {
        label: 'Ba nguồn chạy song song bốn tuần',
        text: 'Chạy đồng thời ba nguồn cho cùng một phần công việc trong bốn tuần: phiếu người dùng, một buổi dự hoặc đọc chéo của đồng nghiệp, và một số đo. Cuối kỳ tìm chỗ cả ba cùng chỉ tới và chỗ chúng mâu thuẫn nhau; xử lý chỗ trùng trước, chỗ mâu thuẫn để lại và đi tìm thêm dữ liệu.',
        level: 'h',
      },
      {
        label: 'Đóng vòng công khai',
        text: 'Sau khi sửa theo phản hồi, gửi cho tất cả những người đã góp ý một bản tóm tắt: đổi gì, bỏ gì, vì sao. Đếm bao nhiêu người tiếp tục góp ý ở vòng sau — con số này là chỉ số sức khỏe của hệ thống phản hồi của bạn, và nó chỉ tăng khi bạn đóng vòng đều.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Một người chê nặng, năm người khen. Nên tin ai?',
        a: 'Đừng đếm phiếu, hãy xem người đó là ai và họ đang nói về loại gì. Nếu người chê đúng là chân dung người dùng bạn nhắm tới, hoặc là người duy nhất có chuyên môn về chỗ đó, thì một phiếu của họ nặng hơn năm lời khen từ những người không dùng sản phẩm. Nếu chuyện đang bàn thuộc nhóm sở thích thì ngược lại. Cách tách nhanh: hỏi họ mô tả sự việc cụ thể, chỗ nào bạn dừng lại — người có tín hiệu thật chỉ ra được thời điểm, người phát biểu cảm tính thì không.',
      },
      {
        q: 'Vì sao câu "cho mình xin góp ý thẳng thắn" hầu như không có tác dụng?',
        a: 'Vì nó đẩy hai chi phí sang phía người kia: chi phí tự chọn nên nói về cái gì, và rủi ro quan hệ khi nói thật. Câu hỏi hẹp giải quyết chi phí thứ nhất; việc nêu rõ giai đoạn và cho cách trả lời rẻ giải quyết một phần chi phí thứ hai; phần còn lại chỉ được giải quyết bằng lịch sử — họ đã từng thấy bạn nhận phản hồi và đóng vòng tử tế. "Thẳng thắn" là một lời mời, không phải một điều kiện; điều kiện là bạn đã chứng minh nói thật với bạn thì có ích và không tốn kém.',
      },
      {
        q: 'Sếp bạn hầu như không bao giờ cho phản hồi. Làm gì?',
        a: 'Chuyển từ xin đánh giá chung sang xin một quyết định nhỏ có bối cảnh: gửi trước bản làm và hỏi giữa hai cách này anh chọn cách nào, vì sao. Người bận trả lời một lựa chọn dễ hơn nhiều so với ngồi viết nhận xét. Song song, đừng đặt toàn bộ nhu cầu phản hồi vào một người: bổ sung nguồn ngang hàng và nguồn dữ liệu. Nếu sau ba tháng vẫn không có tín hiệu nào từ bất kỳ hướng nào, bản thân điều đó đã là một thông tin về nơi bạn đang làm việc, và nó đáng được đưa vào quyết định nghề nghiệp chứ không chỉ vào danh sách phàn nàn.',
      },
    ],
    plan7:
      'Ngày 1: viết ba câu hỏi hẹp cho việc đang làm dở. Ngày 2: lập bản đồ bốn nguồn và đánh dấu ô đang trống. Ngày 3: thiết kế và phát phiếu hai câu cho người thụ hưởng công việc của bạn. Ngày 4: gửi một yêu cầu góp ý có nêu rõ giai đoạn và thời lượng, kèm cách trả lời rẻ nhất. Ngày 5: phân loại mọi phản hồi đã nhận thành ba nhóm và viết hành động cho nhóm sự việc. Ngày 6: áp dụng luật hai mươi bốn giờ với phản hồi khó nghe nhất và ghi lại chênh lệch giữa phản ứng đầu tiên và quyết định cuối. Ngày 7: đóng vòng — nhắn lại cho tất cả những người đã góp ý, nói rõ bạn đổi gì và giữ gì.',
    evidence:
      'Thứ chứng minh bạn làm việc được với phản hồi không phải câu "em tiếp thu tốt", mà là một chuỗi có thể trình ra: bản gốc, danh sách phản hồi đã phân loại, bản đã sửa, và tin nhắn đóng vòng. Giữ một bộ như vậy cho hiện vật quan trọng nhất của bạn; nó trả lời được cùng lúc hai câu hỏi phỏng vấn hay gặp là bạn xử lý thế nào khi bị chê và bạn làm gì khi không đồng ý với góp ý của người khác — vì trong bộ đó có cả những mục bạn cố ý không sửa kèm lý do. Nếu bạn nhận công việc tự do, chính hệ thống phản hồi là điểm bán hàng: nói với khách rằng bạn sẽ hỏi họ hai câu hẹp ở giữa chặng thay vì gửi một bản cuối rồi chờ nhận xét, và bạn vừa giảm rủi ro cho họ vừa giảm số vòng sửa cho mình.',
    references: [
      { label: 'Harvard Business Review — chuyên mục Giving feedback', url: 'https://hbr.org/topic/subject/giving-feedback', type: 'article' },
      { label: 'Center for Creative Leadership — tài nguyên về phản hồi và đánh giá nhiều nguồn', url: 'https://www.ccl.org/', type: 'article' },
    ],
  }),

  // ── Chương 7 · Dự án tốt nghiệp: Từ ý tưởng đến khách hàng ────────────────
  guide({
    thesis:
      'Dự án tốt nghiệp của bộ sách này không phải một bài tập lớn để nộp, mà là một lát cắt mỏng chạy hết một vòng đời thật: có một người thật đang gặp một vấn đề thật, bạn giao cho họ một thứ dùng được, họ dùng trước mặt bạn, họ chỉ ra chỗ chưa được, bạn sửa, rồi bạn giữ lại bằng chứng của cả chặng đường. Thước đo không phải quy mô sản phẩm mà là ba mốc: một người thật đồng ý dùng, một lần dùng thật xảy ra mà bạn chỉ ngồi quan sát, và ít nhất một thay đổi bạn làm vì phản hồi chứ không vì ý thích của mình.',
    why: {
      work:
        'Mọi việc trong một tổ chức đều là một lát của vòng này, chỉ khác là bạn thường chỉ nhìn thấy đoạn của mình. Người đã tự chạy trọn một vòng nhỏ hiểu vì sao các bước trung gian tồn tại, nên hợp tác với các bộ phận khác dễ hơn hẳn và ít đòi bỏ bớt quy trình một cách hồn nhiên.',
      interview:
        'Một dự án có người dùng thật cho bạn khoảng bốn mươi phút nội dung để nói: chọn vấn đề thế nào, cắt phạm vi ra sao, hỏng ở đâu, sửa gì. Một dự án làm cho đẹp hồ sơ thì cạn sau ba câu hỏi, và cả hai bên đều biết điều đó ngay tại bàn.',
      study:
        'Đây là nơi các kỹ năng rời rạc buộc phải kết hợp trong cùng một tuần — hiểu vấn đề, ưu tiên, làm ra, giao tiếp, nhận phản hồi — và cũng là nơi bạn phát hiện mắt xích yếu thật của mình, thường không phải mắt xích bạn đã đoán ở chương 2.',
      life:
        'Kỹ năng biến một ý muốn thành thứ có người dùng được dùng chung cho việc mở một dịch vụ nhỏ, tổ chức một hoạt động cho khu phố, hay giải quyết dứt điểm một chuyện lặp đi lặp lại trong gia đình. Điểm chung là đều cần một người thật ở đầu bên kia.',
    },
    framework: [
      {
        name: 'Tuần 0–1 · Chọn người, không chọn chủ đề',
        detail:
          'Điều kiện vào cuộc: bạn kể được tên ba người đang gặp cùng một vấn đề, và ít nhất một người nhận lời nói chuyện ba mươi phút. Vấn đề đáng làm là vấn đề họ đang xử lý bằng cách thủ công tốn công, vì như vậy nghĩa là nó đủ đau để họ đã bỏ tiền hoặc bỏ thời gian ra chịu đựng.',
      },
      {
        name: 'Tuần 1 · Năm cuộc nói chuyện về quá khứ',
        detail:
          'Hỏi về lần gần nhất họ gặp vấn đề: đã làm gì, mất bao lâu, chỗ nào bực nhất, đã thử cách nào rồi bỏ. Tuyệt đối không mô tả giải pháp của bạn — người ta lịch sự khen ý tưởng, và lời khen đó là thứ giết dự án ở tuần thứ tư. Kết thúc bằng một trang: vấn đề phát biểu bằng chính lời của họ, cách làm hiện tại, chi phí hiện tại.',
      },
      {
        name: 'Tuần 2 · Cắt lát mỏng và định nghĩa xong',
        detail:
          'Chọn đúng một tình huống hẹp và viết tiêu chí xong dưới dạng quan sát được, có tên người và có số: "chị Hà tự nhập số liệu tuần và in ra bảng trong mười phút mà không cần hỏi tôi". Ghi kèm danh sách những gì bản một cố ý không làm — danh sách này quan trọng ngang phần sẽ làm.',
      },
      {
        name: 'Tuần 3–5 · Làm bản một và giao tận tay',
        detail:
          'Giới hạn cứng: bản một phải giao được trong ba tuần với ngân sách giờ thật của bạn ở chương 3. Giao tận tay nghĩa là ngồi cùng người dùng ở lần đầu tiên, im lặng quan sát, ghi lại từng chỗ họ khựng, và không giải thích hộ dù rất muốn.',
      },
      {
        name: 'Tuần 6 · Đo rồi sửa đúng ba chỗ',
        detail:
          'Chọn hai số đo trước khi động vào sửa, ví dụ thời gian họ mất và số lần họ phải hỏi bạn. Sửa ba chỗ khựng lớn nhất rồi đo lại trong cùng điều kiện. Nếu ba chỗ đó sửa không nổi trong một tuần thì lát cắt vẫn còn quá dày, hãy cắt tiếp thay vì kéo dài.',
      },
      {
        name: 'Tuần 7–8 · Người thứ hai và gói bằng chứng',
        detail:
          'Đưa cho một người thứ hai ít thân với bạn hơn — đây mới là phép thử thật, vì người quen sẽ cố dùng cho bạn vui. Sau đó đóng gói: một trang tóm tắt, hiện vật đã khử dữ liệu nhạy cảm, hai câu xác nhận, và một trang điều tôi sẽ làm khác.',
      },
    ],
    scenario:
      'Một nhân viên hành chính ở công ty xây dựng, tự học bảng tính, muốn chuyển sang vị trí vận hành. Anh chọn vấn đề từ ba người quen là chủ nhà trọ nhỏ, mỗi nhà tám đến mười lăm phòng: hằng tháng họ ghi số điện nước vào sổ tay rồi tính tay từng phòng. Tuần một anh nói chuyện với năm người, chỉ hỏi về lần gần nhất — hai người dùng sổ, hai người chụp ảnh công tơ rồi tính sau, một người từng thử một ứng dụng và bỏ vì phải nhập quá nhiều thứ không cần. Chi phí thật đo được từ lời họ: mỗi tháng mất hai đến ba tiếng, và trung bình một lần phải cãi nhau với khách thuê về số nước. Lát cắt anh chọn rất hẹp: chỉ làm phần nhập số công tơ và in ra phiếu thu từng phòng, cố ý bỏ hẳn phần hợp đồng và phần nhắc nợ. Bản một là một bảng tính có ô nhập và nút in, giao tận tay cho chị chủ nhà thứ nhất. Buổi quan sát đầu tiên cho anh hai thứ mà anh không thể đoán ra khi ngồi làm: chị khựng vì phải cuộn ngang mới thấy cột tháng, và gõ nhầm số phòng vì danh sách không xếp theo tầng. Anh sửa ba chỗ, đo lại: từ khoảng hai tiếng xuống khoảng hai mươi lăm phút cho mười hai phòng, và tháng kế tiếp chị tự làm không nhắn hỏi lần nào. Người thứ hai — một chủ nhà không thân — dùng được nhưng đòi thêm phần ghi nợ tháng trước; đó là thông tin cho bản hai chứ không phải lỗi của bản một. Dự án này không trở thành một sản phẩm kinh doanh, và anh ghi thẳng điều đó vào trang tổng kết. Giá trị của nó nằm ở chỗ khác: nó chạy trọn một vòng, để lại bằng chứng nói được trong bốn mươi phút, và nó chỉ ra mắt xích yếu thật của anh — anh dựng bảng rất nhanh nhưng gần như không chịu nổi việc ngồi im khi người dùng đang loay hoay.',
    comparison: [
      {
        weak: 'Chọn đề tài theo thứ nghe hay khi kể lại, kiểu một hệ thống quản lý toàn diện cho một lĩnh vực nào đó.',
        mature:
          'Chọn theo người thật có mặt được, có vấn đề đo được bằng thời gian hoặc tiền, và sẵn sàng dành ba mươi phút nói chuyện ngay tuần này.',
      },
      {
        weak: 'Làm sáu tuần trong im lặng rồi mới cho ai đó xem, vì muốn lần ra mắt phải chỉn chu.',
        mature:
          'Đưa bản thô nhất còn dùng được vào tay người dùng sớm nhất có thể, chấp nhận nó xấu, vì thứ bạn cần lúc này là thông tin chứ không phải lời khen.',
      },
      {
        weak: 'Hỏi người dùng thấy ý tưởng này thế nào, rồi lấy câu trả lời lịch sự làm căn cứ để đi tiếp.',
        mature:
          'Hỏi về lần gần nhất họ gặp vấn đề và quan sát họ dùng thật, vì lời nói về tương lai thì rẻ còn hành vi đã xảy ra thì không nói dối được.',
      },
      {
        weak: 'Coi dự án kết thúc khi bản một chạy được trên máy của bạn.',
        mature:
          'Coi dự án kết thúc khi có người thứ hai dùng được mà không cần bạn ngồi cạnh, và gói bằng chứng đã đóng xong.',
      },
    ],
    mistakes: [
      'Chọn vấn đề của một người dùng giả định không có tên và không có số điện thoại. Mọi quyết định sau đó đều dựa vào tưởng tượng, không có ai đợi bản giao, và dự án chết lặng lẽ ở tuần thứ tư mà không ai nhận ra kể cả bạn.',
      'Mở rộng phạm vi sau mỗi cuộc nói chuyện: mỗi người dùng nêu một nhu cầu và bạn nhận hết vì cái nào nghe cũng hợp lý, nên bản một không bao giờ xong. Nhu cầu mới phải đi vào một danh sách chờ có ngày xem lại, không được đi thẳng vào bản một.',
      'Giao sản phẩm qua tin nhắn kèm câu "chị dùng thử nhé" rồi ngồi đợi. Kết quả gần như luôn là im lặng, và bạn sẽ diễn giải sự im lặng đó thành "chắc là ổn". Buổi dùng đầu tiên bắt buộc phải có mặt bạn, và bạn phải im lặng chứ không phải hướng dẫn.',
    ],
    worksheet: [
      'Viết tên và cách liên hệ của ba người thật đang gặp vấn đề bạn định giải quyết. Nếu chưa điền đủ ba tên, dự án chưa nên bắt đầu — hãy đi tìm người trước khi nghĩ tiếp về giải pháp.',
      'Theo lời chính họ chứ không theo ước đoán của bạn, vấn đề này đang tốn của họ bao nhiêu thời gian hoặc bao nhiêu tiền mỗi tháng?',
      'Viết tiêu chí xong của bản một thành một câu quan sát được, có tên người dùng và có con số. Ai đó đứng ngoài đọc câu đó có tự phán được là đã xong hay chưa không?',
      'Ba thứ bản một cố ý không làm là gì, và bạn sẽ trả lời thế nào khi người dùng hỏi tới chúng ngay trong buổi giao đầu tiên?',
      'Ngày nào trong lịch bạn sẽ ngồi cạnh người dùng khi họ dùng lần đầu, và trong lúc im lặng đó bạn định ghi lại chính xác những gì?',
    ],
    exercises: [
      {
        label: 'Ba cái tên trong bốn mươi tám giờ',
        text: 'Trong hai ngày, viết ra ba người thật có tên và cách liên hệ đang gặp cùng một vấn đề lặp lại, rồi nhắn cho một người xin ba mươi phút nói chuyện. Không được thay tên người bằng mô tả nhóm kiểu "các chủ shop nhỏ".',
        level: 'e',
      },
      {
        label: 'Cuộc nói chuyện đầu tiên',
        text: 'Thực hiện cuộc nói chuyện ba mươi phút chỉ hỏi về quá khứ: lần gần nhất là khi nào, họ đã làm gì, mất bao lâu, đã thử cách nào và vì sao bỏ. Viết lại một trang bằng chính từ ngữ của họ, không diễn giải và không chèn giải pháp của bạn vào.',
        level: 'e',
      },
      {
        label: 'Một trang vấn đề',
        text: 'Sau ba cuộc nói chuyện, viết một trang gồm phát biểu vấn đề, cách làm hiện tại, chi phí hiện tại và điểm chung giữa ba người. Gửi lại cho chính họ kèm câu hỏi tôi hiểu đúng chưa, và sửa theo chỗ họ đính chính.',
        level: 'e',
      },
      {
        label: 'Lát cắt mỏng và tiêu chí xong',
        text: 'Viết tiêu chí xong quan sát được cho bản một kèm danh sách những thứ cố ý bỏ. Ước lượng số giờ cần và so với ngân sách giờ thật của bạn; nếu vượt, cắt tiếp cho tới khi vừa, và ghi lại bạn đã phải cắt mấy vòng.',
        level: 'm',
      },
      {
        label: 'Ba tuần dựng bản một',
        text: 'Chia ba tuần thành ba mốc, mỗi mốc có một thứ chạy được vào cuối tuần chứ không phải một phần việc làm dở. Cuối mỗi tuần ghi vào nhật ký thực hành dự đoán tuần tới sẽ xong gì và mức tự tin, để cuối dự án bạn có dữ liệu về khả năng ước lượng của chính mình.',
        level: 'm',
      },
      {
        label: 'Buổi dùng đầu tiên có mặt bạn',
        text: 'Ngồi cùng người dùng khi họ mở sản phẩm lần đầu, không hướng dẫn trước, chỉ ghi thời điểm họ khựng và câu họ buột miệng nói ra. Mục tiêu tối thiểu là ghi được năm chỗ khựng; nếu bạn không ghi nổi năm chỗ, khả năng cao là bạn đã nói quá nhiều.',
        level: 'm',
      },
      {
        label: 'Vòng sửa có số đo',
        text: 'Chọn hai số đo trước khi sửa, sửa đúng ba chỗ khựng lớn nhất, cho họ dùng lại trong cùng điều kiện và đo lại. Viết một trang so trước và sau, nói rõ phần cải thiện nào bạn chắc là do thay đổi của mình và phần nào bạn không chắc vì có thể chỉ do họ đã quen tay.',
        level: 'h',
      },
      {
        label: 'Người thứ hai và gói bằng chứng',
        text: 'Đưa bản đã sửa cho một người thứ hai ít thân với bạn hơn, hỗ trợ ở mức tối thiểu, và ghi lại những chỗ họ hỏi mà người thứ nhất không hỏi. Sau đó đóng gói bốn thứ: trang tóm tắt, hiện vật đã khử dữ liệu nhạy cảm, hai câu xác nhận, và trang điều tôi sẽ làm khác.',
        level: 'h',
      },
    ],
    checkpoints: [
      {
        q: 'Không tìm được người dùng thật thì có nên bỏ dự án không?',
        a: 'Không bỏ, mà đổi phạm vi — đi từ vòng trong ra vòng ngoài. Vòng gần nhất là một vấn đề ngay tại nơi bạn làm việc, nơi đồng nghiệp là người dùng thật và có mặt hằng ngày. Xa hơn là một hoạt động cộng đồng hoặc lớp học bạn tham gia, rồi tới một cửa hàng hay hộ kinh doanh trong bán kính đi bộ. Thứ không được đổi là yêu cầu phải có một người có tên chịu trách nhiệm dùng thử. Nếu sau hai tuần không ai chịu dành ba mươi phút, đó là tín hiệu về mức độ đau của vấn đề chứ không phải về khả năng của bạn — hãy đổi vấn đề, đừng đổi cách thuyết phục.',
      },
      {
        q: 'Người dùng khen nhiều nhưng không dùng lại. Kết luận gì?',
        a: 'Lời khen là dữ liệu về quan hệ, việc dùng lại là dữ liệu về giá trị, và chỉ cái thứ hai đáng tin. Đi tìm chỗ nghẽn theo đúng thứ tự này: họ có nhớ ra sản phẩm vào đúng lúc cần không, đây là vấn đề nhắc nhở và thói quen; nếu nhớ thì có mở được trong ba mươi giây không, đây là vấn đề ma sát; nếu mở được mà vẫn thôi thì cách làm cũ vẫn rẻ hơn với họ, đây mới là vấn đề giá trị. Chỉ trường hợp thứ ba mới đòi làm lại sản phẩm, hai trường hợp đầu thường sửa được bằng thay đổi nhỏ.',
      },
      {
        q: 'Có nhất thiết phải thu tiền thì mới coi là đã đến được khách hàng?',
        a: 'Không nhất thiết, nhưng phải có một cái giá nào đó người kia thật sự trả. Tiền là dạng rõ nhất và cũng khó chối nhất. Các dạng khác vẫn đáng tin: họ bỏ thời gian dùng thật nhiều lần, họ nhập dữ liệu thật của chính họ vào, họ giới thiệu cho người khác, hoặc họ đồng ý để tên mình vào phần xác nhận. Thứ không tính là lời hứa sẽ dùng. Nếu bạn có thu tiền, dù chỉ vài trăm nghìn, hãy tìm hiểu trước nghĩa vụ hóa đơn và thuế theo quy định đang hiệu lực, và hỏi người có chuyên môn khi số tiền đủ lớn — phần này nằm ngoài phạm vi cuốn sách và thay đổi theo từng thời kỳ.',
      },
    ],
    plan7:
      'Ngày 1: viết ba cái tên và nhắn xin cuộc nói chuyện đầu tiên. Ngày 2: thực hiện cuộc nói chuyện thứ nhất, chỉ hỏi về quá khứ, ghi lại bằng lời của họ. Ngày 3: cuộc nói chuyện thứ hai, chú ý xem hai người có mô tả cùng một vấn đề hay hai vấn đề khác nhau. Ngày 4: cuộc thứ ba và viết một trang vấn đề, gửi lại cho cả ba người để họ đính chính. Ngày 5: liệt kê năm lát cắt khả dĩ và chấm theo hai tiêu chí, hẹp và giao được trong ba tuần. Ngày 6: viết tiêu chí xong quan sát được cùng danh sách những thứ cố ý bỏ. Ngày 7: đặt ba mốc tuần vào lịch, hẹn luôn ngày giao bản một với người dùng thứ nhất và nói ngày đó ra thành lời với họ.',
    evidence:
      'Đây là hiện vật mạnh nhất mà cả bộ sách này dẫn tới, nhưng chỉ khi được đóng gói đúng: đặt vấn đề của người dùng ở dòng đầu chứ không đặt công cụ bạn dùng, kèm số trước và sau, kèm cả phần bạn làm sai và đã sửa. Chuẩn bị ba độ dài để kể — sáu mươi giây, năm phút, và hai mươi phút có mở hiện vật — vì bạn không chọn được người ta có bao nhiêu thời gian cho bạn. Điểm mạnh riêng của dự án này so với mọi bằng chứng khác trong sách là nó liên kết nhiều mảng trong cùng một câu chuyện: khi người phỏng vấn hỏi về giao tiếp, về cách ưu tiên, hay về xử lý phản hồi, bạn lấy ba đoạn khác nhau của cùng một dự án thay vì ba câu chuyện rời rạc mà người nghe phải tự ghép. Với người nhận việc tự do, chính hồ sơ này là bản chào hàng đầu tiên, vì nó chứng minh bạn giao được cho tới khi có người dùng thật, không chỉ làm được.',
    references: [
      { label: 'Y Combinator Startup Library — nói chuyện với người dùng và thu hẹp phạm vi sản phẩm đầu tiên', url: 'https://www.ycombinator.com/library', type: 'article' },
      { label: 'Nielsen Norman Group — vì sao chỉ cần quan sát năm người dùng cho mỗi vòng kiểm thử', url: 'https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/', type: 'article' },
    ],
  }),
];
