/**
 * Từ vựng chặng 5 (7.5 → 8.0) — 30 mục, chọn theo tiêu chí khác hẳn bốn chặng trước.
 *
 * Ở đây KHÔNG có từ nào "mới" theo nghĩa bạn chưa từng gặp. Cả 30 mục đều là
 * chỗ người ở band 7.5 dùng CHƯA CHÍNH XÁC — sai sắc thái, sai kết hợp, hoặc
 * sai mức độ chắc chắn. Descriptor band 8 nói thẳng: "to convey PRECISE
 * meanings". Không phải nhiều từ hơn; chính xác hơn.
 *
 * Vì thế mỗi mục ở đây học theo CẶP hoặc theo CỤM, không học từ trơ. Học một
 * từ đơn ở chặng này gần như vô ích: bạn đã biết nghĩa của nó rồi, thứ bạn
 * chưa biết là nó đi với cái gì.
 */
import type { VocabTopic } from '../types';

export const VOCAB5: VocabTopic[] = [
  {
    id: 's5-pairs',
    title: 'Cặp dễ lẫn — sai một chữ là sai cả câu',
    icon: '⚖️',
    why: 'Đây là loại lỗi bị bắt gần như 100% vì nó nằm ở từ mang nghĩa chính. Người chấm không cần tìm — nó đập vào mắt. Mười cặp dưới đây gộp lại chiếm phần lớn lỗi từ vựng của bài band 7.5.',
    words: [
      { en: 'affect (v) ≠ effect (n)', ipa: '/əˈfekt/ · /ɪˈfekt/', vi: 'tác động (đt) ≠ hiệu ứng (dt)', pos: 'v/n', ex: 'The policy affected rural areas. · The policy had a marked effect on rural areas.', exVi: 'Chính sách tác động tới vùng nông thôn. · Chính sách có tác động rõ rệt tới vùng nông thôn.' },
      { en: 'economic ≠ economical', ipa: '/ˌiːkəˈnɒmɪk/ · /ˌiːkəˈnɒmɪkl/', vi: 'thuộc kinh tế ≠ tiết kiệm', pos: 'adj', ex: 'economic growth · an economical use of water', exVi: 'tăng trưởng kinh tế · cách dùng nước tiết kiệm' },
      { en: 'historic ≠ historical', ipa: '/hɪˈstɒrɪk/ · /hɪˈstɒrɪkl/', vi: 'trọng đại ≠ thuộc về lịch sử', pos: 'adj', ex: 'a historic agreement · historical records', exVi: 'một thoả thuận trọng đại · các tư liệu lịch sử' },
      { en: 'continual ≠ continuous', ipa: '/kənˈtɪnjuəl/ · /kənˈtɪnjuəs/', vi: 'lặp lại có quãng nghỉ ≠ liên tục không ngắt', pos: 'adj', ex: 'continual interruptions · continuous monitoring', exVi: 'những lần gián đoạn lặp đi lặp lại · giám sát liên tục' },
      { en: 'practical ≠ practicable', ipa: '/ˈpræktɪkl/ · /ˈpræktɪkəbl/', vi: 'thiết thực ≠ khả thi để thực hiện', pos: 'adj', ex: 'practical advice · The plan is not practicable within the budget.', exVi: 'lời khuyên thiết thực · Kế hoạch không khả thi trong ngân sách này.' },
      { en: 'classic ≠ classical', ipa: '/ˈklæsɪk/ · /ˈklæsɪkl/', vi: 'kinh điển, mẫu mực ≠ cổ điển', pos: 'adj', ex: 'a classic example of the problem · classical architecture', exVi: 'một ví dụ kinh điển của vấn đề · kiến trúc cổ điển' },
      { en: 'principal ≠ principle', ipa: '/ˈprɪnsəpl/ (cả hai)', vi: 'chính yếu (tt) ≠ nguyên tắc (dt)', pos: 'adj/n', ex: 'the principal cause · a matter of principle', exVi: 'nguyên nhân chính · một vấn đề nguyên tắc' },
      { en: 'comprise ≠ compose ≠ consist of', ipa: '/kəmˈpraɪz/ · /kəmˈpəʊz/ · /kənˈsɪst/', vi: 'gồm có (không dùng "of")', pos: 'v', ex: 'The team comprises six members. · The team consists of six members.', exVi: 'Nhóm gồm sáu thành viên. (KHÔNG viết "comprises of")' },
      { en: 'imply ≠ infer', ipa: '/ɪmˈplaɪ/ · /ɪnˈfɜː/', vi: 'ngụ ý (người nói) ≠ suy ra (người nghe)', pos: 'v', ex: 'The report implies a link. · We can infer a link from the report.', exVi: 'Báo cáo ngụ ý một mối liên hệ. · Ta có thể suy ra mối liên hệ từ báo cáo.' },
      { en: 'amount of ≠ number of', ipa: '/əˈmaʊnt/ · /ˈnʌmbə/', vi: 'lượng (không đếm được) ≠ số (đếm được)', pos: 'phr', ex: 'a large amount of waste · a large number of vehicles', exVi: 'một lượng lớn rác thải · một số lượng lớn phương tiện' },
    ],
  },
  {
    id: 's5-collocation',
    title: 'Kết hợp từ học thuật — cụm nào đi với cụm nào',
    icon: '🔗',
    why: 'Chỗ bài viết lộ ra rằng người viết đang dịch từ tiếng Việt. Câu không sai ngữ pháp, nghĩa vẫn hiểu, nhưng "không ai nói thế" — và descriptor band 8 gọi đúng tên nó: "inaccuracies in word choice and collocation".',
    words: [
      { en: 'conduct research into', ipa: '/kənˈdʌkt rɪˈsɜːtʃ ˈɪntuː/', vi: 'tiến hành nghiên cứu về', pos: 'phr', ex: 'Researchers conducted research into commuting patterns.', exVi: 'Các nhà nghiên cứu đã tiến hành nghiên cứu về thói quen đi lại. (KHÔNG "make research about")' },
      { en: 'address a problem', ipa: '/əˈdres ə ˈprɒbləm/', vi: 'giải quyết một vấn đề', pos: 'phr', ex: 'The scheme addresses only part of the problem.', exVi: 'Chương trình chỉ giải quyết được một phần vấn đề. (KHÔNG "raise the problem")' },
      { en: 'place emphasis on', ipa: '/pleɪs ˈemfəsɪs ɒn/', vi: 'đặt trọng tâm vào', pos: 'phr', ex: 'Schools place too much emphasis on test scores.', exVi: 'Trường học đặt quá nhiều trọng tâm vào điểm số.' },
      { en: 'draw a distinction between', ipa: '/drɔː ə dɪˈstɪŋkʃn/', vi: 'vạch ra sự phân biệt giữa', pos: 'phr', ex: 'It is worth drawing a distinction between cost and value.', exVi: 'Đáng để vạch ra sự phân biệt giữa chi phí và giá trị.' },
      { en: 'pose a threat to', ipa: '/pəʊz ə θret tuː/', vi: 'đặt ra mối đe doạ với', pos: 'phr', ex: 'Rising sea levels pose a threat to coastal cities.', exVi: 'Nước biển dâng đặt ra mối đe doạ với các thành phố ven biển.' },
      { en: 'meet a demand', ipa: '/miːt ə dɪˈmɑːnd/', vi: 'đáp ứng nhu cầu', pos: 'phr', ex: 'Supply has failed to meet demand.', exVi: 'Nguồn cung đã không đáp ứng được nhu cầu.' },
      { en: 'exert influence over', ipa: '/ɪɡˈzɜːt ˈɪnfluəns/', vi: 'gây ảnh hưởng lên', pos: 'phr', ex: 'Advertising exerts considerable influence over young consumers.', exVi: 'Quảng cáo gây ảnh hưởng đáng kể lên người tiêu dùng trẻ.' },
      { en: 'a marked improvement', ipa: '/ə mɑːkt ɪmˈpruːvmənt/', vi: 'một cải thiện rõ rệt', pos: 'phr', ex: 'There has been a marked improvement in air quality.', exVi: 'Đã có một cải thiện rõ rệt về chất lượng không khí.' },
      { en: 'bear little relation to', ipa: '/beə ˈlɪtl rɪˈleɪʃn/', vi: 'ít liên quan tới', pos: 'phr', ex: 'The figures bear little relation to what people experience.', exVi: 'Các con số ít liên quan tới điều người dân trải nghiệm.' },
      { en: 'come at the expense of', ipa: '/kʌm ət ði ɪkˈspens/', vi: 'phải đánh đổi bằng', pos: 'phr', ex: 'Speed often comes at the expense of accuracy.', exVi: 'Tốc độ thường phải đánh đổi bằng độ chính xác.' },
    ],
  },
  {
    id: 's5-argue',
    title: 'Động từ lập luận — nói chính xác mình đang làm gì',
    icon: '🧠',
    why: 'Ở Part 3 và Task 2, band 8 khác band 7 ở chỗ nêu rõ mình đang NHƯỢNG BỘ, đang PHẢN BÁC, hay đang HẠN ĐỊNH. Dùng đúng động từ lập luận làm cấu trúc suy nghĩ của bạn hiện ra thành lời — đó chính là "develops topics coherently".',
    words: [
      { en: 'concede', ipa: '/kənˈsiːd/', vi: 'thừa nhận (điểm của phía kia)', pos: 'v', ex: 'I would concede that the cost is significant.', exVi: 'Tôi thừa nhận rằng chi phí là đáng kể.' },
      { en: 'contend', ipa: '/kənˈtend/', vi: 'lập luận rằng, cho rằng', pos: 'v', ex: 'Critics contend that the policy has had the opposite effect.', exVi: 'Những người phê phán lập luận rằng chính sách đã có tác dụng ngược.' },
      { en: 'qualify (a claim)', ipa: '/ˈkwɒlɪfaɪ/', vi: 'hạn định lại một nhận định', pos: 'v', ex: 'I would qualify that: it holds for cities, not for rural areas.', exVi: 'Tôi xin hạn định lại: điều đó đúng với thành phố, không đúng với nông thôn.' },
      { en: 'refute', ipa: '/rɪˈfjuːt/', vi: 'bác bỏ (có bằng chứng)', pos: 'v', ex: 'The data refute the idea that costs have fallen.', exVi: 'Dữ liệu bác bỏ ý cho rằng chi phí đã giảm.' },
      { en: 'attribute A to B', ipa: '/əˈtrɪbjuːt/', vi: 'quy A cho nguyên nhân B', pos: 'v', ex: 'The decline is usually attributed to changing habits.', exVi: 'Mức giảm thường được quy cho thói quen thay đổi.' },
      { en: 'undermine', ipa: '/ˌʌndəˈmaɪn/', vi: 'làm suy yếu (lập luận, niềm tin)', pos: 'v', ex: 'This finding undermines the standard explanation.', exVi: 'Phát hiện này làm suy yếu cách giải thích thông thường.' },
      { en: 'corroborate', ipa: '/kəˈrɒbəreɪt/', vi: 'củng cố bằng bằng chứng độc lập', pos: 'v', ex: 'Later studies corroborated the original result.', exVi: 'Các nghiên cứu sau đã củng cố kết quả ban đầu.' },
      { en: 'overstate', ipa: '/ˌəʊvəˈsteɪt/', vi: 'nói quá lên', pos: 'v', ex: 'The benefits are often overstated in the press.', exVi: 'Lợi ích thường bị nói quá lên trên báo chí.' },
      { en: 'conflate', ipa: '/kənˈfleɪt/', vi: 'gộp nhầm hai thứ khác nhau', pos: 'v', ex: 'The argument conflates cost with value.', exVi: 'Lập luận này gộp nhầm chi phí với giá trị.' },
      { en: 'the causation runs the other way', ipa: '/kɔːˈzeɪʃn/', vi: 'quan hệ nhân quả đi chiều ngược lại', pos: 'phr', ex: 'It may be that the causation runs the other way.', exVi: 'Có thể quan hệ nhân quả đi theo chiều ngược lại.' },
    ],
  },
];
