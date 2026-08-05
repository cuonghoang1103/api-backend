/**
 * Từ vựng chặng 3 — 200 mục, nhưng khác hẳn hai chặng trước về BẢN CHẤT.
 *
 * Chặng 1 học từ đơn để đặt được câu. Chặng 2 học từ học thuật theo chủ đề.
 * Chặng 3 học **CỤM** — vì ở band 6.5, tiêu chí Lexical Resource không còn
 * hỏi "bạn biết bao nhiêu từ" mà hỏi "bạn ghép từ có tự nhiên không".
 *
 * Vì thế phần lớn mục ở đây là collocation và cụm cố định, không phải từ lẻ.
 * Học một cụm dùng được ngay hơn hẳn học ba từ lẻ rồi ghép sai.
 */
import type { VocabTopic } from '../types';

export const VOCAB3: VocabTopic[] = [
  {
    id: 's3-make-do',
    title: 'Kết hợp với make / do / take / have',
    icon: '🔗',
    why:
      'Bốn động từ gây lỗi kết hợp nhiều nhất. Tiếng Việt chỉ có "làm" nên người Việt chọn bừa giữa make và '
      + 'do — lỗi này xuất hiện ở gần như mọi bài band 6.0.',
    words: [
      { en: 'do research', ipa: '/duː rɪˈsɜːtʃ/', vi: 'làm nghiên cứu', pos: 'phr', ex: 'They did research into water quality.', exVi: 'Họ nghiên cứu chất lượng nước.' },
      { en: 'carry out a study', ipa: '/ˈkæri aʊt ə ˈstʌdi/', vi: 'tiến hành một nghiên cứu', pos: 'phr', ex: 'Researchers carried out a study in 2020.', exVi: 'Các nhà nghiên cứu tiến hành một nghiên cứu năm 2020.' },
      { en: 'make a decision', ipa: '/meɪk ə dɪˈsɪʒn/', vi: 'ra quyết định', pos: 'phr', ex: 'The council made a decision last week.', exVi: 'Hội đồng đã ra quyết định tuần trước.' },
      { en: 'make progress', ipa: '/meɪk ˈprəʊɡres/', vi: 'tiến bộ', pos: 'phr', ex: 'Students make progress at different rates.', exVi: 'Sinh viên tiến bộ với tốc độ khác nhau.' },
      { en: 'make an effort', ipa: '/meɪk ən ˈefət/', vi: 'nỗ lực', pos: 'phr', ex: 'Few companies make a real effort to recycle.', exVi: 'Ít công ty thật sự nỗ lực tái chế.' },
      { en: 'take action', ipa: '/teɪk ˈækʃn/', vi: 'hành động', pos: 'phr', ex: 'Governments must take action now.', exVi: 'Các chính phủ phải hành động ngay.' },
      { en: 'take measures', ipa: '/teɪk ˈmeʒəz/', vi: 'áp dụng biện pháp', pos: 'phr', ex: 'The city took measures to cut traffic.', exVi: 'Thành phố đã áp dụng biện pháp giảm ùn tắc.' },
      { en: 'take responsibility for', ipa: '/teɪk rɪˌspɒnsəˈbɪləti fə/', vi: 'chịu trách nhiệm về', pos: 'phr', ex: 'Manufacturers should take responsibility for packaging.', exVi: 'Nhà sản xuất nên chịu trách nhiệm về bao bì.' },
      { en: 'have an impact on', ipa: '/hæv ən ˈɪmpækt ɒn/', vi: 'có tác động tới', pos: 'phr', ex: 'Diet has a direct impact on concentration.', exVi: 'Chế độ ăn tác động trực tiếp tới sự tập trung.' },
      { en: 'have access to', ipa: '/hæv ˈækses tuː/', vi: 'tiếp cận được', pos: 'phr', ex: 'Rural families have limited access to specialists.', exVi: 'Gia đình ở nông thôn khó tiếp cận bác sĩ chuyên khoa.' },
      { en: 'meet a demand', ipa: '/miːt ə dɪˈmɑːnd/', vi: 'đáp ứng nhu cầu', pos: 'phr', ex: 'Supply cannot meet the demand.', exVi: 'Nguồn cung không đáp ứng nổi nhu cầu.' },
      { en: 'meet requirements', ipa: '/miːt rɪˈkwaɪəmənts/', vi: 'đạt yêu cầu', pos: 'phr', ex: 'The building meets safety requirements.', exVi: 'Toà nhà đạt yêu cầu an toàn.' },
      { en: 'play a role in', ipa: '/pleɪ ə rəʊl ɪn/', vi: 'đóng vai trò trong', pos: 'phr', ex: 'Schools play a central role in this.', exVi: 'Nhà trường đóng vai trò trung tâm trong việc này.' },
      { en: 'pose a threat to', ipa: '/pəʊz ə θret tuː/', vi: 'gây ra mối đe doạ cho', pos: 'phr', ex: 'Plastic poses a threat to marine life.', exVi: 'Nhựa đe doạ sinh vật biển.' },
      { en: 'raise awareness of', ipa: '/reɪz əˈweənəs əv/', vi: 'nâng cao nhận thức về', pos: 'phr', ex: 'The campaign raised awareness of recycling.', exVi: 'Chiến dịch nâng cao nhận thức về tái chế.' },
      { en: 'address a problem', ipa: '/əˈdres ə ˈprɒbləm/', vi: 'giải quyết một vấn đề', pos: 'phr', ex: 'This policy fails to address the real problem.', exVi: 'Chính sách này không giải quyết vấn đề thật.' },
      { en: 'tackle an issue', ipa: '/ˈtækl ən ˈɪʃuː/', vi: 'xử lý một vấn đề', pos: 'phr', ex: 'We must tackle the issue at its source.', exVi: 'Phải xử lý vấn đề từ gốc.' },
      { en: 'strike a balance', ipa: '/straɪk ə ˈbæləns/', vi: 'tìm điểm cân bằng', pos: 'phr', ex: 'Policy must strike a balance between growth and conservation.', exVi: 'Chính sách phải cân bằng giữa tăng trưởng và bảo tồn.' },
      { en: 'place a burden on', ipa: '/pleɪs ə ˈbɜːdn ɒn/', vi: 'đặt gánh nặng lên', pos: 'phr', ex: 'Ageing places a burden on health services.', exVi: 'Già hoá đặt gánh nặng lên ngành y tế.' },
      { en: 'bridge the gap', ipa: '/brɪdʒ ðə ɡæp/', vi: 'thu hẹp khoảng cách', pos: 'phr', ex: 'Scholarships help bridge the gap between rich and poor.', exVi: 'Học bổng giúp thu hẹp khoảng cách giàu nghèo.' },
    ],
  },
  {
    id: 's3-trend',
    title: 'Cụm mô tả số liệu — Task 1 band 6.5',
    icon: '📈',
    why:
      'Task 1 có bộ kết hợp gần như cố định. Thuộc rồi thì viết nhanh và không sai — mà Task 1 chỉ có 20 phút.',
    words: [
      { en: 'a sharp increase', ipa: '/ə ʃɑːp ˈɪnkriːs/', vi: 'mức tăng mạnh', pos: 'n', ex: 'There was a sharp increase after 2010.', exVi: 'Có mức tăng mạnh sau năm 2010.' },
      { en: 'a steady decline', ipa: '/ə ˈstedi dɪˈklaɪn/', vi: 'sự giảm đều', pos: 'n', ex: 'The chart shows a steady decline in bus use.', exVi: 'Biểu đồ cho thấy lượng đi xe buýt giảm đều.' },
      { en: 'a gradual rise', ipa: '/ə ˈɡrædʒuəl raɪz/', vi: 'mức tăng dần', pos: 'n', ex: 'A gradual rise continued until 2015.', exVi: 'Mức tăng dần tiếp tục tới năm 2015.' },
      { en: 'a slight fall', ipa: '/ə slaɪt fɔːl/', vi: 'mức giảm nhẹ', pos: 'n', ex: 'This was followed by a slight fall.', exVi: 'Sau đó là một mức giảm nhẹ.' },
      { en: 'reach a peak of', ipa: '/riːtʃ ə piːk əv/', vi: 'đạt đỉnh ở mức', pos: 'phr', ex: 'Numbers reached a peak of 40% in 2018.', exVi: 'Con số đạt đỉnh 40% vào năm 2018.' },
      { en: 'hit a low of', ipa: '/hɪt ə ləʊ əv/', vi: 'chạm đáy ở mức', pos: 'phr', ex: 'Sales hit a low of 12 million.', exVi: 'Doanh số chạm đáy 12 triệu.' },
      { en: 'account for', ipa: '/əˈkaʊnt fə(r)/', vi: 'chiếm (tỷ lệ)', pos: 'phr v', ex: 'Services account for 60% of the total.', exVi: 'Dịch vụ chiếm 60% tổng số.' },
      { en: 'the figure for', ipa: '/ðə ˈfɪɡə fə(r)/', vi: 'con số của', pos: 'phr', ex: 'The figure for France was much lower.', exVi: 'Con số của Pháp thấp hơn nhiều.' },
      { en: 'the proportion of', ipa: '/ðə prəˈpɔːʃn əv/', vi: 'tỷ lệ của', pos: 'phr', ex: 'The proportion of graduates doubled.', exVi: 'Tỷ lệ cử nhân tăng gấp đôi.' },
      { en: 'over the period', ipa: '/ˈəʊvə ðə ˈpɪəriəd/', vi: 'trong cả giai đoạn', pos: 'phr', ex: 'Over the period, the trend was upward.', exVi: 'Trong cả giai đoạn, xu hướng là đi lên.' },
      { en: 'by contrast', ipa: '/baɪ ˈkɒntrɑːst/', vi: 'ngược lại', pos: 'phr', ex: 'By contrast, rural areas saw no change.', exVi: 'Ngược lại, vùng nông thôn không đổi.' },
      { en: 'overtake', ipa: '/ˌəʊvəˈteɪk/', vi: 'vượt qua (về số lượng)', pos: 'v', ex: 'Cars overtook buses in the late 1990s.', exVi: 'Ô tô vượt xe buýt vào cuối thập niên 1990.' },
      { en: 'level off', ipa: '/ˈlevl ɒf/', vi: 'chững lại', pos: 'phr v', ex: 'Growth levelled off after 2015.', exVi: 'Tăng trưởng chững lại sau năm 2015.' },
      { en: 'plateau', ipa: '/ˈplætəʊ/', vi: 'đi ngang', pos: 'v/n', ex: 'The figure plateaued at around 30%.', exVi: 'Con số đi ngang quanh mức 30%.' },
      { en: 'more than double', ipa: '/mɔː ðən ˈdʌbl/', vi: 'hơn gấp đôi', pos: 'phr', ex: 'Rail use more than doubled.', exVi: 'Lượng đi tàu hơn gấp đôi.' },
      { en: 'a threefold increase', ipa: '/ə ˈθriːfəʊld ˈɪnkriːs/', vi: 'mức tăng gấp ba', pos: 'n', ex: 'There was a threefold increase in cycling.', exVi: 'Lượng đạp xe tăng gấp ba.' },
      { en: 'respectively', ipa: '/rɪˈspektɪvli/', vi: 'lần lượt', pos: 'adv', ex: 'The figures were 20% and 35% respectively.', exVi: 'Các con số lần lượt là 20% và 35%.' },
      { en: 'whereas', ipa: '/ˌweərˈæz/', vi: 'trong khi (đối lập)', pos: 'conj', ex: 'Bus use fell, whereas rail use rose.', exVi: 'Xe buýt giảm, trong khi tàu tăng.' },
      { en: 'marginally', ipa: '/ˈmɑːdʒɪnəli/', vi: 'không đáng kể', pos: 'adv', ex: 'The figure rose only marginally.', exVi: 'Con số chỉ tăng không đáng kể.' },
      { en: 'the most striking feature', ipa: '/ðə məʊst ˈstraɪkɪŋ ˈfiːtʃə/', vi: 'đặc điểm nổi bật nhất', pos: 'phr', ex: 'The most striking feature is the reversal after 2010.', exVi: 'Đặc điểm nổi bật nhất là sự đảo chiều sau năm 2010.' },
    ],
  },
  {
    id: 's3-argue',
    title: 'Cụm lập luận — Task 2 & Speaking Part 3',
    icon: '⚖️',
    why:
      'Ở band 6.5, khác biệt không nằm ở ý mà ở cách DIỄN ĐẠT ý. Bộ cụm này cho bạn khung để nêu, phản biện '
      + 'và giới hạn lập luận một cách tự nhiên.',
    words: [
      { en: 'a compelling argument', ipa: '/ə kəmˈpelɪŋ ˈɑːɡjumənt/', vi: 'một lập luận thuyết phục', pos: 'n', ex: 'There is a compelling argument for reform.', exVi: 'Có một lập luận thuyết phục cho việc cải cách.' },
      { en: 'the underlying cause', ipa: '/ði ˌʌndəˈlaɪɪŋ kɔːz/', vi: 'nguyên nhân sâu xa', pos: 'n', ex: 'The underlying cause is poor planning.', exVi: 'Nguyên nhân sâu xa là quy hoạch kém.' },
      { en: 'far from being', ipa: '/fɑː frɒm ˈbiːɪŋ/', vi: 'không hề là', pos: 'phr', ex: 'Far from being a solution, this makes things worse.', exVi: 'Không những không phải giải pháp, điều này còn làm mọi thứ tệ hơn.' },
      { en: 'it could be argued that', ipa: '/ɪt kʊd bi ˈɑːɡjuːd ðæt/', vi: 'có thể lập luận rằng', pos: 'phr', ex: 'It could be argued that the cost is justified.', exVi: 'Có thể lập luận rằng chi phí đó là xứng đáng.' },
      { en: 'this overlooks the fact that', ipa: '/ðɪs ˌəʊvəˈlʊks ðə fækt ðæt/', vi: 'điều này bỏ qua sự thật rằng', pos: 'phr', ex: 'This overlooks the fact that not everyone can drive.', exVi: 'Điều này bỏ qua sự thật là không phải ai cũng lái xe được.' },
      { en: 'to a certain extent', ipa: '/tuː ə ˈsɜːtn ɪkˈstent/', vi: 'ở một chừng mực', pos: 'phr', ex: 'To a certain extent, both sides are right.', exVi: 'Ở một chừng mực, cả hai bên đều đúng.' },
      { en: 'provided that', ipa: '/prəˈvaɪdɪd ðæt/', vi: 'với điều kiện là', pos: 'conj', ex: 'This works, provided that funding continues.', exVi: 'Cách này hiệu quả, với điều kiện là vẫn có kinh phí.' },
      { en: 'in the long term', ipa: '/ɪn ðə lɒŋ tɜːm/', vi: 'về dài hạn', pos: 'phr', ex: 'In the long term, prevention is cheaper.', exVi: 'Về dài hạn, phòng ngừa rẻ hơn.' },
      { en: 'at the expense of', ipa: '/ət ði ɪkˈspens əv/', vi: 'đánh đổi bằng', pos: 'phr', ex: 'Growth came at the expense of the environment.', exVi: 'Tăng trưởng đánh đổi bằng môi trường.' },
      { en: 'a trade-off between', ipa: '/ə ˈtreɪd ɒf bɪˈtwiːn/', vi: 'sự đánh đổi giữa', pos: 'n', ex: 'There is a trade-off between speed and accuracy.', exVi: 'Có sự đánh đổi giữa tốc độ và độ chính xác.' },
      { en: 'bear in mind that', ipa: '/beər ɪn maɪnd ðæt/', vi: 'cần lưu ý rằng', pos: 'phr', ex: 'We should bear in mind that data is limited.', exVi: 'Cần lưu ý rằng dữ liệu còn hạn chế.' },
      { en: 'be attributed to', ipa: '/bi əˈtrɪbjuːtɪd tuː/', vi: 'được quy cho', pos: 'phr', ex: 'The drop can be attributed to higher fares.', exVi: 'Mức giảm có thể quy cho việc giá vé tăng.' },
      { en: 'stem from', ipa: '/stem frɒm/', vi: 'bắt nguồn từ', pos: 'phr v', ex: 'The problem stems from decades of underinvestment.', exVi: 'Vấn đề bắt nguồn từ nhiều thập kỷ thiếu đầu tư.' },
      { en: 'give rise to', ipa: '/ɡɪv raɪz tuː/', vi: 'làm nảy sinh', pos: 'phr', ex: 'Rapid growth gave rise to housing shortages.', exVi: 'Tăng trưởng nhanh làm nảy sinh thiếu nhà ở.' },
      { en: 'be conducive to', ipa: '/bi kənˈdjuːsɪv tuː/', vi: 'thuận lợi cho', pos: 'phr', ex: 'A quiet room is conducive to study.', exVi: 'Phòng yên tĩnh thuận lợi cho việc học.' },
      { en: 'outweigh the drawbacks', ipa: '/ˌaʊtˈweɪ ðə ˈdrɔːbæks/', vi: 'lớn hơn các nhược điểm', pos: 'phr', ex: 'The benefits clearly outweigh the drawbacks.', exVi: 'Lợi ích rõ ràng lớn hơn nhược điểm.' },
      { en: 'a case in point', ipa: '/ə keɪs ɪn pɔɪnt/', vi: 'một ví dụ điển hình', pos: 'phr', ex: 'Singapore is a case in point.', exVi: 'Singapore là một ví dụ điển hình.' },
      { en: 'on the grounds that', ipa: '/ɒn ðə ɡraʊndz ðæt/', vi: 'với lý do rằng', pos: 'phr', ex: 'The plan was rejected on the grounds that it was too costly.', exVi: 'Kế hoạch bị bác với lý do quá tốn kém.' },
      { en: 'by and large', ipa: '/baɪ ənd lɑːdʒ/', vi: 'nhìn chung', pos: 'phr', ex: 'By and large, the policy has worked.', exVi: 'Nhìn chung, chính sách đã có hiệu quả.' },
      { en: 'a false dichotomy', ipa: '/ə fɔːls daɪˈkɒtəmi/', vi: 'sự phân đôi giả tạo', pos: 'n', ex: 'Presenting it as either/or is a false dichotomy.', exVi: 'Trình bày kiểu hoặc cái này hoặc cái kia là phân đôi giả tạo.' },
    ],
  },
  {
    id: 's3-confusable',
    title: 'Cặp từ dễ dùng nhầm',
    icon: '⚠️',
    why:
      'Nhóm này gây lỗi nhiều nhất ở band 6.0 vì từ điển cho nghĩa gần giống nhau nhưng cách dùng khác hẳn. '
      + 'Đưa cả nhóm vào sổ lỗi và kiểm mỗi lần soát bài.',
    words: [
      { en: 'affect (v)', ipa: '/əˈfekt/', vi: 'ảnh hưởng tới — ĐỘNG TỪ', pos: 'v', ex: 'Pollution affects health.', exVi: 'Ô nhiễm ảnh hưởng tới sức khoẻ.' },
      { en: 'effect (n)', ipa: '/ɪˈfekt/', vi: 'ảnh hưởng — DANH TỪ', pos: 'n', ex: 'Pollution has an effect on health.', exVi: 'Ô nhiễm có ảnh hưởng tới sức khoẻ.' },
      { en: 'economic', ipa: '/ˌiːkəˈnɒmɪk/', vi: 'thuộc kinh tế', pos: 'adj', ex: 'economic growth', exVi: 'tăng trưởng kinh tế' },
      { en: 'economical', ipa: '/ˌiːkəˈnɒmɪkl/', vi: 'tiết kiệm', pos: 'adj', ex: 'an economical car', exVi: 'một chiếc xe tiết kiệm nhiên liệu' },
      { en: 'raise (v, cần tân ngữ)', ipa: '/reɪz/', vi: 'nâng cái gì lên', pos: 'v', ex: 'The company raised prices.', exVi: 'Công ty đã nâng giá.' },
      { en: 'rise (v, không tân ngữ)', ipa: '/raɪz/', vi: 'tự tăng lên', pos: 'v', ex: 'Prices rose sharply.', exVi: 'Giá tăng mạnh.' },
      { en: 'amount of', ipa: '/əˈmaʊnt əv/', vi: 'lượng — KHÔNG đếm được', pos: 'phr', ex: 'a large amount of water', exVi: 'một lượng lớn nước' },
      { en: 'number of', ipa: '/ˈnʌmbər əv/', vi: 'số lượng — ĐẾM được', pos: 'phr', ex: 'a large number of cars', exVi: 'một số lượng lớn ô tô' },
      { en: 'fewer', ipa: '/ˈfjuːə(r)/', vi: 'ít hơn — ĐẾM được', pos: 'det', ex: 'fewer cars on the road', exVi: 'ít ô tô hơn trên đường' },
      { en: 'less', ipa: '/les/', vi: 'ít hơn — KHÔNG đếm được', pos: 'det', ex: 'less traffic in the centre', exVi: 'ít ùn tắc hơn ở trung tâm' },
      { en: 'practice (n)', ipa: '/ˈpræktɪs/', vi: 'sự thực hành — danh từ', pos: 'n', ex: 'Practice makes perfect.', exVi: 'Có công mài sắt có ngày nên kim.' },
      { en: 'practise (v)', ipa: '/ˈpræktɪs/', vi: 'thực hành — động từ (Anh-Anh)', pos: 'v', ex: 'I practise speaking daily.', exVi: 'Tôi luyện nói hằng ngày.' },
      { en: 'lie (nằm)', ipa: '/laɪ/', vi: 'nằm — không tân ngữ', pos: 'v', ex: 'The village lies in a valley.', exVi: 'Ngôi làng nằm trong một thung lũng.' },
      { en: 'lay (đặt)', ipa: '/leɪ/', vi: 'đặt cái gì — cần tân ngữ', pos: 'v', ex: 'They laid the foundations in May.', exVi: 'Họ đặt móng vào tháng Năm.' },
      { en: 'principal', ipa: '/ˈprɪnsəpl/', vi: 'chính, chủ yếu', pos: 'adj', ex: 'the principal cause', exVi: 'nguyên nhân chính' },
      { en: 'principle', ipa: '/ˈprɪnsəpl/', vi: 'nguyên tắc', pos: 'n', ex: 'a matter of principle', exVi: 'một vấn đề nguyên tắc' },
      { en: 'historic', ipa: '/hɪˈstɒrɪk/', vi: 'mang tính lịch sử (quan trọng)', pos: 'adj', ex: 'a historic decision', exVi: 'một quyết định mang tính lịch sử' },
      { en: 'historical', ipa: '/hɪˈstɒrɪkl/', vi: 'thuộc về lịch sử', pos: 'adj', ex: 'historical records', exVi: 'các ghi chép lịch sử' },
      { en: 'continual', ipa: '/kənˈtɪnjuəl/', vi: 'lặp đi lặp lại (có quãng nghỉ)', pos: 'adj', ex: 'continual interruptions', exVi: 'những lần ngắt quãng liên tiếp' },
      { en: 'continuous', ipa: '/kənˈtɪnjuəs/', vi: 'liên tục không ngắt', pos: 'adj', ex: 'continuous monitoring', exVi: 'giám sát liên tục' },
    ],
  },
];
