/**
 * Chặng 4 — phần BỔ SUNG (đợt 5).
 *
 * Cùng lý do với `stage3/content-b.ts`: chặng 4 ban đầu chỉ có 1 bài đọc,
 * 1 bài nghe, 2 đề viết, 1 chủ đề nói — mỏng hơn hẳn chặng 1 và 2. Đợt này
 * thêm: +2 bài đọc độ khó passage 3 · +3 bài nghe phủ Section 1, 2 (có bản đồ)
 * và 3 · +2 đề viết (Task 1 dạng BẢNG, Task 2 dạng đồng ý/không đồng ý) ·
 * +2 chủ đề nói.
 *
 * Độ khó ở đây khác chặng 3 ở ba chỗ cụ thể, không phải ở "từ khó hơn":
 *  1. Bài đọc có HAI chuyên gia quan điểm GẦN nhau — phải phân biệt chi tiết,
 *     không thể nhớ kiểu "ai ủng hộ ai phản đối".
 *  2. Câu hỏi YNNG hỏi quan điểm TÁC GIẢ ở những đoạn mà tác giả tự bác bỏ
 *     kết luận dễ thấy của đoạn trước.
 *  3. Bài mẫu Writing KÉM ở đây là bài band 6.5 — đúng, đủ ý, không lỗi ngữ
 *     pháp; thứ thiếu là cân hai vế và điều kiện ở kết luận.
 */
import type {
  ReadingPassage, ListeningExercise, WritingTask, SpeakingTopic,
} from '../types';

/* ══════════════════════ ĐỌC ══════════════════════ */

export const READINGS4B: ReadingPassage[] = [
  {
    id: 's4r2',
    title: 'The Uses of Forgetting',
    titleVi: 'Công dụng của sự quên',
    level: 'C1 — passage 3, hai chuyên gia bất đồng ở chi tiết',
    words: 624,
    minutes: 17,
    paragraphs: [
      { label: 'A', text: 'Memory is usually described as a store, and forgetting as the failure of that store to hold what was put into it. The metaphor is so familiar that it is rarely examined, yet almost every claim it carries has been questioned over the past two decades. On the account now favoured by many researchers, forgetting is not the breakdown of memory but one of its operations, and a brain that retained everything would work considerably worse than one that does not.' },
      { label: 'B', text: 'The most striking evidence comes from the small number of people who remember their own lives in extraordinary detail. Asked what they were doing on an arbitrary date twenty years ago, they answer accurately and without apparent effort, and the answers can often be checked against diaries or newspapers. What such individuals do not display, according to several studies, is any corresponding advantage in the tasks that ordinary memory is thought to serve. They are no better at drawing general lessons from experience, no better at recognising that two situations are essentially the same, and some report that the past intrudes on the present in ways they would prefer to prevent. A grievance that most people find fading after a decade remains available to them in its original form.' },
      { label: 'C', text: 'A simpler illustration is spatial. Most drivers can recall where they parked this morning and cannot recall where they parked a fortnight ago, and this is exactly the arrangement they need. A memory system that offered every previous parking space with equal clarity would make the current one harder to identify rather than easier, because the difficulty would no longer be holding the information but choosing among versions of it. Updating requires that the superseded version fade, and fading is therefore not a defect in the process but part of it. The same holds for a telephone number that has changed, or a route altered by roadworks: the old version does not merely become useless, it becomes an obstacle.' },
      { label: 'D', text: 'Dr Helena Sørensen has developed this line of argument furthest. In her view the brain behaves less like an archive than like an editor working under a deadline, discarding what has not proved useful in order to keep what has. The cost of retaining everything, she argues, is not storage space, which is effectively unlimited, but retrieval: the more nearly identical records a system holds, the longer it takes to find the one that matters, and beyond a certain density it cannot reliably find any of them.' },
      { label: 'E', text: 'Professor Adam Fitzgerald accepts the findings while objecting to the language. An editor, he points out, has intentions, and describing forgetting in those terms smuggles in the idea that something is choosing what to discard. The observed pattern, he suggests, is equally consistent with ordinary decay that happens to look purposeful in retrospect, since we notice the occasions when forgetting served us and rarely notice the rest. His warning is methodological rather than empirical: a theory that can explain both remembering and forgetting as adaptive explains rather too much.' },
      { label: 'F', text: 'Sørensen does not dispute that the danger is real, and the disagreement between the two is narrower than it first appears. Both accept that some forgetting is simple decay; the argument is over how much of it is not. What has proved harder to dislodge is the everyday assumption underneath, which is that remembering more would always be better. Teachers see the consequences of that assumption most clearly. Students who reread material until it feels familiar perform worse in later tests than students who put it aside and struggle to recall it, and the second group finds the experience distinctly unpleasant, because the effort of retrieval feels like failure at precisely the moment it is doing the most good.' },
    ],
    glossary: [
      { en: 'metaphor', ipa: '/ˈmetəfə/', vi: 'phép ẩn dụ' },
      { en: 'arbitrary', ipa: '/ˈɑːbɪtrəri/', vi: 'bất kỳ, tuỳ tiện' },
      { en: 'intrude on', ipa: '/ɪnˈtruːd ɒn/', vi: 'xâm nhập, chen vào' },
      { en: 'superseded', ipa: '/ˌsuːpəˈsiːdɪd/', vi: 'đã bị thay thế' },
      { en: 'retrieval', ipa: '/rɪˈtriːvl/', vi: 'sự truy xuất, lấy lại' },
      { en: 'smuggle in', ipa: '/ˈsmʌɡl ɪn/', vi: 'lén đưa vào' },
      { en: 'in retrospect', ipa: '/ɪn ˈretrəspekt/', vi: 'khi nhìn lại' },
      { en: 'dislodge', ipa: '/dɪsˈlɒdʒ/', vi: 'gỡ bỏ, làm lung lay' },
    ],
    questions: [
      { kind: 'MATCH', q: 'Which person argues that the cost of keeping everything is the difficulty of finding anything?', options: ['Dr Helena Sørensen', 'Professor Adam Fitzgerald', 'The writer', 'Neither'], answer: 'Dr Helena Sørensen', why: 'Đoạn D: Sørensen nói chi phí không nằm ở dung lượng lưu trữ mà ở TRUY XUẤT — càng nhiều bản ghi gần giống nhau thì càng khó tìm ra bản cần.', whyNot: 'Fitzgerald không bàn về chi phí lưu trữ; ông bàn về CÁCH DÙNG TỪ để mô tả hiện tượng.' },
      { kind: 'MATCH', q: 'Which person warns that a theory explaining too much is a weakness rather than a strength?', options: ['Professor Adam Fitzgerald', 'Dr Helena Sørensen', 'The writer', 'Neither'], answer: 'Professor Adam Fitzgerald', why: 'Câu cuối đoạn E: một lý thuyết giải thích được cả việc nhớ lẫn việc quên đều là thích nghi thì "explains rather too much" — cảnh báo về PHƯƠNG PHÁP.', whyNot: 'Bẫy của bài: hai người KHÔNG đối lập nhau về dữ liệu. Fitzgerald chấp nhận kết quả nghiên cứu, chỉ phản đối cách diễn đạt.' },
      { kind: 'YNNG', q: 'The writer believes that people with exceptional memories have a clear advantage in daily life.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', why: 'Đoạn B nói ngược: họ không hề giỏi hơn trong việc rút ra bài học chung, và một số còn thấy quá khứ chen vào hiện tại theo cách họ không mong muốn.', whyNot: 'Đọc lướt đoạn B rất dễ chỉ nhớ vế "nhớ chính xác đến kinh ngạc" mà bỏ mất vế "what such individuals do NOT display".' },
      { kind: 'YNNG', q: 'The writer thinks the disagreement between the two researchers is fundamental.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', why: 'Đoạn F câu đầu: bất đồng giữa hai người "is narrower than it first appears" — cả hai đều chấp nhận một phần sự quên là suy giảm thuần tuý.', whyNot: 'Đây là dạng câu YNNG khó nhất: bài dựng lên vẻ đối lập ở đoạn D và E rồi tự thu hẹp nó ở đoạn F.' },
      { kind: 'YNNG', q: 'The writer accepts that Fitzgerald concern is a legitimate one.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'YES', why: 'Đoạn F: "Sørensen does not dispute that the danger is real" — chính người bị phản biện cũng công nhận, và tác giả thuật lại mà không bác bỏ.', whyNot: 'Chú ý phân biệt quan điểm TÁC GIẢ với quan điểm người được trích. Ở đây tác giả trình bày sự đồng thuận, không nêu nghi ngờ nào.' },
      { kind: 'MCQ', q: 'According to paragraph C, why is the parking example useful?', options: ['It shows that drivers have poor memories', 'It shows that updating a memory requires the older version to fade', 'It shows that spatial memory works differently from other kinds', 'It shows that people remember recent events better than old ones'], answer: 'It shows that updating a memory requires the older version to fade', why: 'Đoạn C: "Updating requires that the superseded version fade, and fading is therefore not a defect in the process but part of it."', whyNot: 'D đúng về mặt sự việc nhưng KHÔNG phải điều đoạn C dùng ví dụ để chứng minh — bẫy "đúng nhưng không phải điều được hỏi", rất hay gặp ở passage 3.' },
      { kind: 'MCQ', q: 'What does Fitzgerald object to in Sørensen account?', options: ['The evidence she relies on', 'The word "editor" and what it implies', 'Her claim that storage is unlimited', 'The studies of people with exceptional memory'], answer: 'The word "editor" and what it implies', why: 'Đoạn E: ông chấp nhận kết quả nhưng phản đối CÁCH NÓI — "editor" hàm ý có ai đó đang chọn cái để bỏ đi.', whyNot: 'A sai vì câu đầu đoạn E nói rõ ông "accepts the findings".' },
      { kind: 'GAP', q: 'Sørensen argues the real cost of retaining everything is not storage space but ____________.', answer: 'retrieval', why: 'Đoạn D: "is not storage space, which is effectively unlimited, but retrieval".', whyNot: 'Chép nguyên văn một từ, giữ nguyên dạng danh từ.' },
      { kind: 'GAP', q: 'Fitzgerald says the pattern is equally consistent with ordinary ____________ that looks purposeful in retrospect.', answer: 'decay', why: 'Đoạn E: "equally consistent with ordinary decay that happens to look purposeful in retrospect".', whyNot: 'Viết "decline" hay "fading" đều không được tính — dạng GAP bắt đúng từ của bài.' },
      { kind: 'MCQ', q: 'What do teachers observe, according to the final paragraph?', options: ['Students who reread material do better in later tests', 'Students who struggle to recall material do better, though it feels worse', 'Students remember more when material feels familiar', 'Students should avoid difficult material'], answer: 'Students who struggle to recall material do better, though it feels worse', why: 'Đoạn F: nhóm đọc đi đọc lại tới khi thấy quen thuộc lại làm bài kém hơn nhóm cất tài liệu đi rồi vật lộn nhớ lại, dù nhóm sau thấy khó chịu.', whyNot: 'A và C đảo ngược kết quả — đúng loại bẫy mà câu cuối bài hay dùng, vì thí sinh đã mệt và đọc nhanh.' },
    ],
    strategy: [
      'Bài này gài ở chỗ hai chuyên gia KHÔNG đối lập hoàn toàn. Ghi cạnh mỗi tên đúng một dòng: Sørensen = quên là biên tập có ích; Fitzgerald = chấp nhận dữ liệu, phản đối chữ "biên tập". Không ghi thì tới câu Matching sẽ lẫn.',
      'Câu YNNG ở passage 3 gần như luôn hỏi vào chỗ tác giả TỰ THU HẸP lập luận. Đọc đoạn cuối trước khi trả lời nhóm câu quan điểm.',
      'Cảnh giác với phương án "đúng ngoài đời nhưng không phải điều đoạn đó chứng minh" — câu về ví dụ chỗ đỗ xe là ví dụ mẫu.',
      'Từ báo hiệu đáng khoanh tròn: "What such individuals do not display…", "while objecting to…", "narrower than it first appears". Mỗi cụm dẫn thẳng tới một đáp án.',
    ],
    translation:
      'A. Trí nhớ thường được mô tả như một cái kho, còn sự quên là việc cái kho ấy không giữ nổi thứ đã bỏ vào. Phép ẩn dụ này quen tới mức hiếm khi bị đem ra xem xét, vậy mà gần như mọi khẳng định nó mang theo đều đã bị chất vấn trong hai thập kỷ qua. Theo cách hiểu mà nhiều nhà nghiên cứu hiện ưa dùng, quên không phải là sự hỏng hóc của trí nhớ mà là một trong các thao tác của nó, và một bộ não giữ lại mọi thứ sẽ vận hành kém hơn hẳn một bộ não không làm vậy.\n\n'
      + 'B. Bằng chứng gây chú ý nhất đến từ số ít người nhớ được đời mình chi tiết đến phi thường. Hỏi họ đang làm gì vào một ngày bất kỳ hai mươi năm trước, họ trả lời chính xác mà dường như không cần gắng sức, và câu trả lời thường đối chiếu được với nhật ký hay báo chí. Điều mà những người ấy KHÔNG thể hiện, theo vài nghiên cứu, là bất kỳ lợi thế tương ứng nào trong những việc mà trí nhớ thông thường vốn để phục vụ. Họ không giỏi hơn trong việc rút ra bài học chung từ trải nghiệm, cũng không giỏi hơn trong việc nhận ra hai tình huống về bản chất là một, và một số người kể rằng quá khứ chen vào hiện tại theo cách mà chính họ muốn ngăn lại. Một nỗi oán giận mà phần lớn người ta thấy nhạt dần sau một thập kỷ thì với họ vẫn còn nguyên vẹn như lúc đầu.\n\n'
      + 'C. Một minh hoạ đơn giản hơn nằm ở không gian. Phần lớn tài xế nhớ được sáng nay mình đỗ xe ở đâu và không nhớ nổi hai tuần trước đỗ ở đâu — mà đó đúng là sắp xếp họ cần. Một hệ thống trí nhớ đưa ra mọi chỗ đỗ xe trước đây với độ rõ như nhau sẽ làm chỗ đỗ hiện tại KHÓ nhận ra hơn chứ không dễ hơn, bởi khó khăn khi ấy không còn là giữ được thông tin mà là chọn giữa các phiên bản của nó. Việc cập nhật đòi hỏi phiên bản đã bị thay thế phải mờ đi, nên mờ đi không phải là lỗi của quá trình mà là một phần của nó. Điều tương tự đúng với một số điện thoại đã đổi, hay một lộ trình bị công trường làm chệch đi: phiên bản cũ không chỉ trở nên vô dụng, nó trở thành vật cản.\n\n'
      + 'D. Tiến sĩ Helena Sørensen là người đẩy hướng lập luận này đi xa nhất. Theo bà, bộ não hành xử ít giống một kho lưu trữ mà giống một người biên tập đang chạy hạn nộp: vứt đi thứ chưa tỏ ra hữu dụng để giữ lại thứ đã tỏ ra hữu dụng. Cái giá của việc giữ lại mọi thứ, bà lập luận, không phải là dung lượng — thứ gần như vô hạn — mà là việc TRUY XUẤT: một hệ thống càng chứa nhiều bản ghi gần như giống hệt nhau thì càng mất thời gian tìm ra bản đáng quan tâm, và vượt quá một mật độ nhất định thì nó không tìm nổi bản nào một cách đáng tin.\n\n'
      + 'E. Giáo sư Adam Fitzgerald chấp nhận các kết quả nhưng phản đối cách dùng từ. Ông chỉ ra rằng một người biên tập thì có CHỦ ĐÍCH, và mô tả sự quên bằng những từ như vậy là lén đưa vào ý rằng có cái gì đó đang chọn thứ để bỏ đi. Ông gợi ý rằng khuôn mẫu quan sát được cũng phù hợp không kém với sự suy giảm thông thường mà tình cờ trông có vẻ có mục đích khi ta nhìn lại, bởi ta chỉ để ý những lần quên có lợi cho mình và hiếm khi để ý phần còn lại. Cảnh báo của ông thiên về phương pháp hơn là về dữ liệu: một lý thuyết giải thích được cả việc nhớ lẫn việc quên như là thích nghi thì giải thích hơi quá nhiều.\n\n'
      + 'F. Sørensen không phủ nhận rằng mối nguy ấy là có thật, và bất đồng giữa hai người hẹp hơn vẻ ban đầu nhiều. Cả hai đều chấp nhận rằng một phần sự quên chỉ là suy giảm thuần tuý; tranh luận nằm ở chỗ phần KHÔNG phải như vậy lớn tới đâu. Thứ khó lung lay hơn cả lại là giả định đời thường nằm bên dưới: rằng nhớ được nhiều hơn thì bao giờ cũng tốt hơn. Giáo viên là người thấy hệ quả của giả định đó rõ nhất. Học sinh đọc đi đọc lại tài liệu cho tới khi thấy quen thuộc làm bài kiểm tra về sau kém hơn học sinh cất tài liệu đi rồi vật lộn nhớ lại, và nhóm thứ hai thấy trải nghiệm ấy rõ ràng là khó chịu — vì nỗ lực nhớ lại mang cảm giác thất bại đúng vào lúc nó đang có ích nhất.',
  },
  {
    id: 's4r3',
    title: 'Why Nobody Fixes Things Any More',
    titleVi: 'Vì sao không ai sửa đồ nữa',
    level: 'C1 — passage 3, nhiều dạng nối thông tin với đoạn',
    words: 578,
    minutes: 16,
    paragraphs: [
      { label: 'A', text: 'Within living memory most towns had a shop where a broken radio or kettle could be taken to be mended. The work was unglamorous and the shops were rarely prosperous, but they existed in numbers, and their disappearance has been almost total. The usual explanation is that goods are no longer built to last, an account that is emotionally satisfying and largely wrong, or at least one that describes a symptom rather than a cause. Products have in fact become more reliable by most measures; what has changed is what happens when they do fail.' },
      { label: 'B', text: 'The decisive change is a ratio. Repair is labour, and the price of an hour of skilled labour has risen steadily for a century, while the price of manufactured goods has fallen sharply relative to earnings. A household appliance that once cost several weeks of wages may now cost a few hours of them. Once the price of the object approaches the price of an hour spent examining it, repair stops being a rational choice for the owner, whatever their attachment to the object or their views about waste.' },
      { label: 'C', text: 'Design has followed that logic rather than driven it. Components are bonded rather than screwed, housings are sealed, and diagnostic information is held in software that is not published. Manufacturers did not need a conspiracy to arrive here; each individual decision made the product cheaper, thinner or more reliable, and repairability was simply not among the criteria being optimised. The cumulative effect, however, is a device that a competent technician cannot open without destroying it.' },
      { label: 'D', text: 'Campaigns for a right to repair have won real changes, obliging manufacturers in several jurisdictions to supply parts and manuals for a fixed number of years. Dr Yusuf Karim, who has evaluated some of these schemes, describes the results as genuine but partial. Parts and manuals address the supply of components, he notes, while the binding constraint in most repairs is diagnosis: knowing which component has failed, which takes experience that legislation cannot distribute.' },
      { label: 'E', text: 'Professor Lena Brandt reads the same evidence differently. Measured product lifetimes in countries with repair legislation have risen only modestly, which she takes as a sign that the policy is aimed at the wrong point in the chain. Her preferred alternative is fiscal: taxing new goods to reflect their disposal cost while removing tax from repair services, so that the ratio described earlier is corrected directly rather than through obligations that manufacturers have every incentive to satisfy formally and undermine in practice.' },
      { label: 'F', text: 'What both accept is that the skills themselves are the fragile part. A repair trade requires a population of technicians who see enough failures to build a mental catalogue of them, and that population sustains itself only if repair is common enough to provide a living. The knowledge in question is not written down and largely cannot be: it consists of recognising, from a smell or a pattern of behaviour, which of a dozen possible faults is the likely one. Once the number of shops falls below a certain level that knowledge stops being transmitted, and rebuilding it takes far longer than passing a law, because the first generation of new technicians has nobody to learn from and must rediscover by trial what their predecessors knew by sight. Several European cities now subsidise repair cafés partly for this reason, on the grounds that keeping a few hundred people in practice is cheaper than recreating a trade that has been allowed to lapse entirely.' },
    ],
    glossary: [
      { en: 'mend', ipa: '/mend/', vi: 'sửa chữa' },
      { en: 'ratio', ipa: '/ˈreɪʃiəʊ/', vi: 'tỷ lệ' },
      { en: 'bonded', ipa: '/ˈbɒndɪd/', vi: 'dán/gắn liền' },
      { en: 'jurisdiction', ipa: '/ˌdʒʊərɪsˈdɪkʃn/', vi: 'khu vực tài phán, hệ pháp lý' },
      { en: 'binding constraint', ipa: '/ˈbaɪndɪŋ kənˈstreɪnt/', vi: 'nút thắt quyết định' },
      { en: 'fiscal', ipa: '/ˈfɪskl/', vi: 'thuộc về thuế khoá' },
      { en: 'undermine', ipa: '/ˌʌndəˈmaɪn/', vi: 'làm suy yếu ngầm' },
      { en: 'lapse', ipa: '/læps/', vi: 'mai một, thất truyền' },
    ],
    questions: [
      { kind: 'MATCH', q: 'Đoạn nào nêu rằng thiết kế là HỆ QUẢ của kinh tế chứ không phải nguyên nhân?', options: ['Đoạn C', 'Đoạn B', 'Đoạn D', 'Đoạn F'], answer: 'Đoạn C', why: 'Đoạn C mở bằng "Design has followed that logic rather than driven it" — thiết kế đi theo logic kinh tế ở đoạn B chứ không tạo ra nó.', whyNot: 'Đoạn B nêu chính cái logic đó (tỷ lệ giá lao động trên giá hàng hoá), nhưng không nói về thiết kế.' },
      { kind: 'MATCH', q: 'Đoạn nào đề xuất dùng công cụ THUẾ thay cho nghĩa vụ pháp lý?', options: ['Đoạn E', 'Đoạn D', 'Đoạn F', 'Đoạn A'], answer: 'Đoạn E', why: 'Đoạn E: Brandt đề xuất đánh thuế hàng mới theo chi phí thải bỏ và bỏ thuế cho dịch vụ sửa chữa.', whyNot: 'Đoạn D nói về quyền được sửa chữa (nghĩa vụ cung cấp linh kiện và tài liệu) — đúng thứ Brandt cho là nhắm sai chỗ.' },
      { kind: 'MATCH', q: 'Đoạn nào giải thích vì sao tri thức nghề có thể biến mất hoàn toàn?', options: ['Đoạn F', 'Đoạn C', 'Đoạn B', 'Đoạn D'], answer: 'Đoạn F', why: 'Đoạn F: dưới một ngưỡng số tiệm nhất định thì tri thức thôi được truyền lại, và dựng lại tốn thời gian hơn nhiều so với ban hành một đạo luật.', whyNot: 'Đoạn D có nói tới kinh nghiệm chẩn đoán nhưng bàn về giới hạn của luật, không bàn về sự mai một của cả nghề.' },
      { kind: 'TFNG', q: 'The writer believes goods today are deliberately designed to break quickly.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE', why: 'Đoạn A gọi lời giải thích quen thuộc đó là "largely wrong", và đoạn C nói rõ các hãng "did not need a conspiracy" — mỗi quyết định riêng lẻ nhằm mục tiêu khác.', whyNot: 'NOT GIVEN sai: bài bàn thẳng vào giả thuyết này và bác bỏ nó.' },
      { kind: 'TFNG', q: 'Repair legislation has produced large increases in how long products last.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE', why: 'Đoạn E: tuổi thọ sản phẩm đo được ở các nước có luật sửa chữa chỉ tăng "modestly" — khiêm tốn, tức là ngược với "large increases".', whyNot: 'Bẫy mức độ: bài CÓ nói tuổi thọ tăng, nhưng tăng ít. Đọc lướt thấy "risen" là chọn TRUE ngay.' },
      { kind: 'TFNG', q: 'Repair cafés in European cities are funded entirely by the manufacturers of the goods being repaired.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'NOT GIVEN', why: 'Đoạn F chỉ nói các thành phố TRỢ CẤP cho repair café. Bài không hề nói ai khác góp tiền hay không.', whyNot: 'Đừng suy ra từ chỗ trống. Không nhắc tới nhà sản xuất trong câu đó thì là NOT GIVEN, không phải FALSE.' },
      { kind: 'MCQ', q: 'According to Dr Karim, what is the main limitation of right-to-repair schemes?', options: ['Parts are still too expensive', 'They do not address diagnosis, which requires experience', 'Manufacturers ignore them completely', 'They only last a fixed number of years'], answer: 'They do not address diagnosis, which requires experience', why: 'Đoạn D: linh kiện và tài liệu giải quyết khâu CUNG CẤP, còn nút thắt thật là chẩn đoán — thứ cần kinh nghiệm mà luật không phân phát được.', whyNot: 'D mô tả đúng một đặc điểm của các chương trình đó nhưng KHÔNG phải điều Karim coi là hạn chế chính.' },
      { kind: 'GAP', q: 'Repair stops being rational once the price of the object approaches the price of an hour spent ____________ it.', answer: 'examining', why: 'Đoạn B: "the price of an hour spent examining it".', whyNot: 'Chép nguyên văn, giữ dạng V-ing sau giới từ.' },
      { kind: 'GAP', q: 'Brandt describes her alternative approach as ____________ rather than legislative.', answer: 'fiscal', why: 'Đoạn E: "Her preferred alternative is fiscal" — dùng thuế thay vì nghĩa vụ pháp lý.', whyNot: 'Viết "tax" là sai dạng từ: câu cần TÍNH TỪ đứng trước "rather than legislative".' },
      { kind: 'MCQ', q: 'Why do several cities subsidise repair cafés, according to the final paragraph?', options: ['To reduce the amount of waste sent to landfill', 'To keep a body of practical knowledge alive', 'To provide employment for retired technicians', 'To compete with manufacturers'], answer: 'To keep a body of practical knowledge alive', why: 'Đoạn F: giữ vài trăm người còn tay nghề rẻ hơn việc dựng lại cả một nghề đã thất truyền.', whyNot: 'A nghe rất hợp lý và đúng ngoài đời, nhưng đoạn F nêu lý do KHÁC. Bẫy kinh điển của câu hỏi cuối bài.' },
    ],
    strategy: [
      'Bài trộn Matching Information (nối với ĐOẠN) và MCQ về hai chuyên gia. Làm Matching trước: nó bắt bạn quét cả bài một lượt và nhờ vậy nắm được bố cục cho các câu sau.',
      'Chú ý bẫy MỨC ĐỘ ở câu TFNG: "risen only modestly" so với "large increases". Ở passage 3, nhiều câu sai không nằm ở nội dung mà ở lượng từ (only, largely, entirely, modestly).',
      'Phân biệt "bài bác bỏ giả thuyết X" (FALSE) với "bài không nhắc tới X" (NOT GIVEN). Bài này có cả hai kiểu, cách nhau đúng một câu hỏi.',
      'Câu cuối bài luôn là chỗ dễ mất điểm nhất vì đã hết sức. Đọc lại đúng câu chứa đáp án trước khi chọn, đừng chọn theo cái nghe hợp lý.',
    ],
    translation:
      'A. Trong ký ức của những người còn sống, phần lớn thị trấn từng có một cửa hàng nơi ta mang chiếc radio hay ấm điện hỏng tới để sửa. Công việc ấy chẳng hào nhoáng gì và các tiệm đó hiếm khi khá giả, nhưng chúng tồn tại với số lượng đáng kể, và sự biến mất của chúng gần như là toàn diện. Lời giải thích quen thuộc là hàng hoá ngày nay không còn được làm để dùng lâu — một cách giải thích thoả mãn về mặt cảm xúc và phần lớn là sai, hoặc ít nhất chỉ mô tả một triệu chứng chứ không phải nguyên nhân. Thực tế là sản phẩm đã bền hơn theo hầu hết thước đo; thứ đã thay đổi là chuyện gì xảy ra KHI chúng hỏng.\n\n'
      + 'B. Thay đổi quyết định là một TỶ LỆ. Sửa chữa là lao động, và giá một giờ lao động lành nghề đã tăng đều suốt một thế kỷ, trong khi giá hàng công nghiệp lại giảm mạnh so với thu nhập. Một thiết bị gia dụng từng tốn vài tuần lương nay có thể chỉ tốn vài giờ lương. Một khi giá của món đồ tiệm cận giá của một giờ bỏ ra để xem xét nó, việc sửa thôi là lựa chọn hợp lý với người chủ, bất kể họ gắn bó với món đồ đến đâu hay nghĩ gì về rác thải.\n\n'
      + 'C. Thiết kế đi theo logic đó chứ không tạo ra nó. Linh kiện được dán thay vì bắt vít, vỏ máy được hàn kín, và thông tin chẩn đoán nằm trong phần mềm không công bố. Các nhà sản xuất không cần một âm mưu nào để đi tới đây; mỗi quyết định riêng lẻ làm sản phẩm rẻ hơn, mỏng hơn hoặc bền hơn, còn khả năng sửa chữa đơn giản là không nằm trong các tiêu chí được tối ưu. Tuy nhiên hiệu ứng cộng dồn là một thiết bị mà một thợ giỏi không thể mở ra mà không phá hỏng nó.\n\n'
      + 'D. Các chiến dịch đòi quyền được sửa chữa đã giành được thay đổi thật, buộc nhà sản xuất ở vài hệ pháp lý phải cung cấp linh kiện và tài liệu trong một số năm nhất định. Tiến sĩ Yusuf Karim, người đã đánh giá vài chương trình như vậy, mô tả kết quả là có thật nhưng chỉ một phần. Ông lưu ý rằng linh kiện và tài liệu xử lý khâu CUNG CẤP, trong khi nút thắt quyết định ở phần lớn ca sửa chữa lại là CHẨN ĐOÁN: biết linh kiện nào đã hỏng — thứ đòi kinh nghiệm mà luật pháp không phân phát được.\n\n'
      + 'E. Giáo sư Lena Brandt đọc cùng bằng chứng đó theo cách khác. Tuổi thọ sản phẩm đo được ở các nước có luật sửa chữa chỉ tăng khiêm tốn, và bà coi đó là dấu hiệu cho thấy chính sách đang nhắm sai mắt xích. Phương án bà ưa hơn là công cụ thuế: đánh thuế hàng mới sao cho phản ánh chi phí thải bỏ, đồng thời bỏ thuế cho dịch vụ sửa chữa, để cái tỷ lệ nói ở trên được chỉnh thẳng thay vì chỉnh qua những nghĩa vụ mà nhà sản xuất có đủ động cơ để đáp ứng trên hình thức và vô hiệu hoá trên thực tế.\n\n'
      + 'F. Điều cả hai đều chấp nhận là chính TAY NGHỀ mới là phần mong manh. Một nghề sửa chữa cần một lớp thợ nhìn thấy đủ nhiều ca hỏng để dựng lên trong đầu một cuốn danh mục các kiểu hỏng, và lớp người ấy chỉ tự duy trì được nếu việc sửa chữa phổ biến đủ để nuôi sống họ. Thứ tri thức đó không được ghi ra giấy và phần lớn là không thể ghi: nó nằm ở chỗ nhận ra, từ một mùi khét hay một kiểu chạy bất thường, rằng trong cả tá lỗi có thể xảy ra thì lỗi nào mới là lỗi khả dĩ. Một khi số cửa hàng rơi xuống dưới một ngưỡng nhất định, tri thức ấy thôi được truyền lại, và dựng lại nó mất thời gian hơn nhiều so với thông qua một đạo luật — vì lứa thợ mới đầu tiên không còn ai để học và phải mò mẫm khám phá lại thứ mà lớp trước chỉ cần nhìn là biết. Vài thành phố châu Âu nay trợ cấp cho các "repair café" một phần vì lý do này, trên cơ sở rằng giữ cho vài trăm người còn tay nghề thì rẻ hơn tái tạo cả một nghề đã bị để cho thất truyền hoàn toàn.',
  },
];

/* ══════════════════════ NGHE ══════════════════════ */

export const LISTENINGS4B: ListeningExercise[] = [
  {
    id: 's4l2',
    title: 'Reporting a Lost Bag at a Station',
    titleVi: 'Khai báo mất hành lý ở ga tàu',
    kind: 'Section 1 — điền biểu mẫu, nhiều số và mã',
    level: 'Vừa về nội dung · KHÓ về độ chính xác',
    context:
      'Ở band 7.5, Section 1 không khó về nội dung mà khó về việc KHÔNG ĐƯỢC SAI CÂU NÀO. Mất một câu ở đây là mất '
      + 'đúng nửa band. Bài này gài dày các thứ hay sai: mã có chữ và số, giờ được nói theo hai kiểu, một lần tự sửa, '
      + 'và một con số nói bằng hai cách khác nhau.',
    lines: [
      { who: 'Nhân viên', text: 'Lost property office, good evening. How can I help?' },
      { who: 'Khách', text: 'I left a bag on a train this afternoon. A dark green rucksack.' },
      { who: 'Nhân viên', text: 'I can take the details. Which service were you travelling on?' },
      { who: 'Khách', text: 'The fourteen forty from Bristol. It was due in at sixteen oh five, but we were about ten minutes late.' },
      { who: 'Nhân viên', text: 'So arriving around quarter past four. Which coach were you in?' },
      { who: 'Khách', text: 'Coach C, seat forty-two. Actually no, forty-two was on the way out. Coming back I was in seat twenty-four.' },
      { who: 'Nhân viên', text: 'Coach C, seat twenty-four. And what was in the bag?' },
      { who: 'Khách', text: 'A laptop, some course notes, and a pair of running shoes. The laptop is the thing I care about.' },
      { who: 'Nhân viên', text: 'Is there anything on the outside that identifies it?' },
      { who: 'Khách', text: 'There is a luggage tag with my initials, T dot N dot, and a university sticker.' },
      { who: 'Nhân viên', text: 'That helps. Your full name, please?' },
      { who: 'Khách', text: 'Tran Ngoc Bao. The first name for your form is Bao, B-A-O.' },
      { who: 'Nhân viên', text: 'Thank you. And a mobile number?' },
      { who: 'Khách', text: 'Oh seven double three one, four oh six, nine eight two.' },
      { who: 'Nhân viên', text: 'Let me repeat that: oh seven double three one, four oh six, nine eight two. I am giving you a reference of LP dash nine four seven.' },
      { who: 'Khách', text: 'LP nine four seven. How long do you keep items?' },
      { who: 'Nhân viên', text: 'Three months for most things, but only twenty-eight days for electronic items, so I would ring us on Thursday if you have not heard.' },
      { who: 'Khách', text: 'Is there a charge?' },
      { who: 'Nhân viên', text: 'There is a handling fee of six pounds fifty, and it goes up to twelve pounds if the item has to be posted to you.' },
    ],
    questions: [
      { q: 'Departure time of the service: ____________', answer: '14:40', alt: ['1440', '14.40', '2.40pm', '2:40pm', 'fourteen forty'], why: '"The fourteen forty from Bristol." Giờ 24 tiếng: viết lại đúng dạng đề in sẵn, đừng đổi qua lại nếu không chắc.' },
      { q: 'Coach: ____________', answer: 'C', why: '"Coach C, seat…". Một chữ cái thôi — nhưng vẫn phải viết hoa cho rõ.' },
      { q: 'Seat number: ____________', answer: '24', alt: ['twenty-four', 'twenty four'], why: 'BẪY CHÍNH: 42 là ghế chiều ĐI. Người nói tự sửa: "Actually no… Coming back I was in seat twenty-four". Đáp án luôn là thông tin đã sửa.' },
      { q: 'Initials on the luggage tag: ____________', answer: 'T.N.', alt: ['TN', 'T N', 'T.N'], why: '"a luggage tag with my initials, T dot N dot".' },
      { q: 'First name for the form: ____________', answer: 'Bao', why: 'Được đánh vần B-A-O. Người gọi nói rõ tên nào cần điền vào ô "first name" — đó là chi tiết mà đề cố tình đặt.' },
      { q: 'Mobile number: ____________', answer: '07331406982', alt: ['0733 1406 982', '07331 406 982'], why: '"Oh seven double three one, four oh six, nine eight two". "double three" = 33, "oh" = 0. Nhân viên đọc lại một lần — dùng lần đó để soát.' },
      { q: 'Reference number: ____________', answer: 'LP-947', alt: ['LP947', 'LP 947'], why: '"a reference of LP dash nine four seven". Mã có cả chữ và số là dạng đề rất hay dùng ở Section 1.' },
      { q: 'Electronic items are kept for ____________ days.', answer: '28', alt: ['twenty-eight', 'twenty eight'], why: 'Ba tháng là cho hầu hết đồ, nhưng đồ điện tử chỉ 28 ngày. Đề hỏi ĐỒ ĐIỆN TỬ — bẫy nếu chỉ nghe thấy con số đầu tiên.' },
      { q: 'Handling fee: £____________', answer: '6.50', alt: ['6,50', 'six pounds fifty', '£6.50'], why: '"a handling fee of six pounds fifty". Mức 12 bảng là cho trường hợp GỬI BƯU ĐIỆN, không phải phí xử lý.' },
    ],
    listenFor: ['Actually no… (dấu hiệu tự sửa)', 'double three (= 33)', 'dash (dấu gạch nối trong mã)', 'but only twenty-eight days for…', 'and it goes up to… if…'],
    tips: [
      'Bài có BA cặp số gài nhau: 42/24, 3 tháng/28 ngày, 6,50/12 bảng. Với mỗi cặp, cái đúng là cái gắn với ĐÚNG ĐIỀU KIỆN mà đề hỏi. Gạch chân điều kiện trong đề trước khi nghe.',
      'Cách đọc số của người Anh: "oh" = 0, "double/treble" = lặp, "dash" = dấu gạch. Không quen ba thứ này thì mất điểm ở Section 1 dù nghe rõ từng chữ.',
      'Khi nhân viên đọc lại thông tin, đó là món quà của đề: dùng để soát chứ đừng nghỉ tai.',
      'Giờ 24 tiếng (fourteen forty) và 12 tiếng (twenty to three) đều xuất hiện trong đề thật. Viết theo đúng dạng mà biểu mẫu đã in sẵn.',
    ],
  },
  {
    id: 's4l3',
    title: 'Tour of the Old Dock Quarter',
    titleVi: 'Tham quan khu cảng cũ',
    kind: 'Section 2 — độc thoại + BẢN ĐỒ (Map Labelling)',
    level: 'Khó · chỉ dẫn dài, mốc định vị đổi liên tục',
    context:
      'Bản đồ thứ hai của khoá, khó hơn bản đồ chặng 3 ở hai chỗ: người nói KHÔNG đi theo thứ tự A–E, và có một chỗ '
      + 'ông ta định vị bằng một toà nhà VỪA MỚI nhắc chứ không phải bằng mốc in sẵn. Mất dấu một câu là trôi luôn hai câu.',
    figure: {
      kind: 'map',
      title: 'Old Dock Quarter — điền tên vào các ô viền đứt (A–E)',
      note: 'Bắt đầu từ Visitor centre ở góc dưới bên trái. Kênh nước chạy ngang giữa bản đồ.',
      map: {
        cols: 13,
        rows: 10,
        paths: [
          { x: 0.5, y: 4.5, w: 12, h: 1.4, label: 'canal' },
          { x: 3.4, y: 0.8, w: 0.9, h: 8.6, label: '' },
        ],
        boxes: [
          { x: 0.6, y: 7.4, w: 2.4, h: 1.8, label: 'Visitor centre' },
          { x: 4.6, y: 7.4, w: 2.2, h: 1.8, blank: 'A' },
          { x: 7.4, y: 7.4, w: 2.2, h: 1.8, blank: 'B' },
          { x: 10, y: 7.4, w: 2.4, h: 1.8, label: 'Car park' },
          { x: 0.6, y: 2.2, w: 2.4, h: 1.8, label: 'Crane museum' },
          { x: 4.6, y: 2.2, w: 2.2, h: 1.8, blank: 'C' },
          { x: 7.4, y: 2.2, w: 2.2, h: 1.8, blank: 'D' },
          { x: 10, y: 2.2, w: 2.4, h: 1.8, blank: 'E' },
          { x: 4.6, y: 0.3, w: 5, h: 1.4, label: 'Fish market (closed)' },
        ],
        pins: [
          { x: 1.8, y: 9.6, label: 'Bạn đang ở đây' },
        ],
      },
    },
    lines: [
      { who: 'Hướng dẫn viên', text: 'Welcome to the Old Dock Quarter. Before we set off, let me show you what is where, because the site is larger than it looks.' },
      { who: 'Hướng dẫn viên', text: 'We are outside the visitor centre, bottom left on your map. The canal runs straight across the middle of the site, and there is one footbridge, which you can see crossing it on the left of the map.' },
      { who: 'Hướng dẫn viên', text: 'Let me start on the far side of the canal, at the top. Directly across the footbridge from the crane museum, on the same row, is the boat workshop, where the small wooden vessels are restored.' },
      { who: 'Hướng dẫn viên', text: 'Now, two doors along to the right of the boat workshop, at the end of that row, is the archive. It holds the shipping records, and it is open by appointment only.' },
      { who: 'Hướng dẫn viên', text: 'Between the boat workshop and the archive there is one more building. That is the rope walk, which is the oldest structure still standing here.' },
      { who: 'Hướng dẫn viên', text: 'The long building above all of those, at the top of the map, is the old fish market. It is closed to the public, so please do not go in.' },
      { who: 'Hướng dẫn viên', text: 'Back on this side of the canal now. Immediately to the right of the visitor centre, on our row, is the ticket office. Buy your ticket there before joining any tour.' },
      { who: 'Hướng dẫn viên', text: 'And next to the ticket office, still on our side, between it and the car park, is the cafe. It closes at four, earlier than the rest of the site.' },
      { who: 'Hướng dẫn viên', text: 'A few practical notes. The full tour lasts ninety minutes and leaves on the hour. Photography is fine everywhere except inside the archive.' },
      { who: 'Hướng dẫn viên', text: 'The footbridge is the only crossing, so if you are on the far side at closing time you will need about ten minutes to walk back.' },
      { who: 'Hướng dẫn viên', text: 'Finally, the site closes at half past five in winter and seven in summer, and the last tour leaves ninety minutes before closing.' },
    ],
    questions: [
      { q: 'A = ____________', answer: 'ticket office', alt: ['the ticket office'], why: '"Immediately to the right of the visitor centre, on our row, is the ticket office." Ô A nằm cùng dãy với visitor centre, ngay bên phải.' },
      { q: 'B = ____________', answer: 'cafe', alt: ['the cafe', 'café'], why: '"next to the ticket office, still on our side, between it and the car park, is the cafe" — định vị bằng HAI mốc cùng lúc.' },
      { q: 'C = ____________', answer: 'boat workshop', alt: ['the boat workshop', 'workshop'], why: '"Directly across the footbridge from the crane museum, on the same row, is the boat workshop." Cầu đi bộ là dải dọc bên trái bản đồ — nó chia hàng trên thành hai phần.' },
      { q: 'D = ____________', answer: 'rope walk', alt: ['the rope walk', 'ropewalk'], why: '"Between the boat workshop and the archive there is one more building. That is the rope walk." Câu này nhắc SAU cùng nhưng chỉ vào ô ở GIỮA — đúng chỗ dễ điền nhầm.' },
      { q: 'E = ____________', answer: 'archive', alt: ['the archive'], why: '"two doors along to the right of the boat workshop, at the end of that row, is the archive".' },
      { q: 'The full tour lasts ____________ minutes.', answer: '90', alt: ['ninety', 'ninety minutes'], why: '"The full tour lasts ninety minutes and leaves on the hour."' },
      { q: 'Photography is not allowed inside the ____________.', answer: 'archive', why: '"Photography is fine everywhere except inside the archive." Nghe "except" là biết đáp án nằm ngay sau.' },
      { q: 'In winter the site closes at ____________.', answer: '5.30', alt: ['5:30', 'half past five', '17:30', '5.30pm'], why: '"the site closes at half past five in winter and seven in summer". Đề hỏi MÙA ĐÔNG — hai giờ đóng cửa nằm liền nhau là bẫy cố ý.' },
      { q: 'It takes about ____________ minutes to walk back across the footbridge.', answer: '10', alt: ['ten'], why: '"you will need about ten minutes to walk back". Chú ý con số này khác 90 phút của tour.' },
    ],
    listenFor: ['on the far side / back on this side (đổi bên kênh)', 'directly opposite / two doors along / between … and …', 'except inside the…', 'in winter and … in summer', 'the last tour leaves ninety minutes before closing'],
    tips: [
      'Người nói KHÔNG đi theo thứ tự A, B, C. Ông ta sang bờ bên kia trước rồi mới quay lại bờ này. Bám theo NGÓN TAY trên bản đồ, đừng bám theo chữ cái.',
      'Ô D được định vị bằng hai toà nhà vừa nhắc ("between the boat workshop and the archive") chứ không bằng mốc in sẵn. Đây là kiểu chỉ dẫn khó nhất của Section 2: nếu hai câu trước sai thì câu này chắc chắn sai theo.',
      'Nghe "Back on this side of the canal now" là biết sắp đổi khu vực — đánh dấu ngay để không điền nhầm sang bờ kia.',
      'Câu hỏi cuối đoạn thường gài hai con số cùng loại (ở đây: 90 phút tour, 10 phút đi bộ, giờ đóng cửa mùa đông và mùa hè). Luôn hỏi lại "con số này gắn với cái gì".',
    ],
  },
  {
    id: 's4l4',
    title: 'Seminar: Reviewing a Field Study',
    titleVi: 'Buổi trao đổi: rà lại một nghiên cứu thực địa',
    kind: 'Section 3 — ba người nói, nối ý kiến với người',
    level: 'Rất khó · ý kiến trái chiều, có nhượng bộ và đổi ý',
    context:
      'Section 3 ở độ khó band 7.5 hỏi AI NGHĨ GÌ chứ không chỉ hỏi nội dung. Có nhượng bộ ("that is fair, but…"), '
      + 'có đổi ý, và có chỗ hai người cùng đồng ý với người thứ ba. Ghi tên tắt bên cạnh từng ý ngay khi nghe.',
    lines: [
      { who: 'Giảng viên', text: 'So, your pilot study. I have read the draft. Mai, let us start with the sample.' },
      { who: 'Mai', text: 'We surveyed sixty households, which we thought was reasonable for a pilot.' },
      { who: 'Giảng viên', text: 'The number is fine. My concern is how you reached them — all through one community centre.' },
      { who: 'Dan', text: 'I did raise that at the time. Anyone who never goes near the centre is invisible to us, and those are probably the households that matter most.' },
      { who: 'Mai', text: 'That is fair, Dan, although the centre is genuinely used by a wide range of people. But I accept it is not the same as a proper sample.' },
      { who: 'Giảng viên', text: 'Good. Now, the questionnaire. Dan, you were unhappy with the wording.' },
      { who: 'Dan', text: 'Two questions ask about satisfaction and about cost in the same sentence. If somebody answers low, we cannot tell which half they mean.' },
      { who: 'Mai', text: 'I would defend those, actually. We tested them on a small group first and nobody was confused.' },
      { who: 'Giảng viên', text: 'Testing helps, Mai, but it does not solve a double-barrelled question. I am with Dan on that one.' },
      { who: 'Mai', text: 'All right. We can split them for the main study.' },
      { who: 'Giảng viên', text: 'What about the response rate? You reported forty per cent.' },
      { who: 'Dan', text: 'Forty-three, actually, once we included the late returns.' },
      { who: 'Giảng viên', text: 'Either way it is respectable for door-to-door work. Do not apologise for it in the write-up — students always do, and it reads as a lack of confidence.' },
      { who: 'Mai', text: 'What about the interviews? We were planning twenty for the main study.' },
      { who: 'Giảng viên', text: 'Twenty is more than you can analyse properly alongside the survey. Fifteen at most, and transcribe as you go rather than leaving it all to the end.' },
      { who: 'Dan', text: 'Fifteen suits me. I was worried about the transcription time.' },
      { who: 'Giảng viên', text: 'One more thing. Your literature review reads like a list. Group the studies by what they disagree about, not by date.' },
      { who: 'Mai', text: 'That is more useful than what we were told last term, which was to go chronologically.' },
      { who: 'Giảng viên', text: 'Chronological order works when the field has moved in one direction. Yours has not. Send me the revised design by the fifteenth.' },
    ],
    questions: [
      { q: 'Who first raised the problem with how the households were contacted?', answer: 'Dan', why: '"I did raise that at the time" — Dan nói chính ông đã nêu vấn đề từ trước. Giảng viên nêu mối lo, nhưng người ĐẦU TIÊN nêu là Dan.' },
      { q: 'How many households were surveyed?', answer: '60', alt: ['sixty'], why: '"We surveyed sixty households." Con số này KHÔNG bị ai phản đối — giảng viên nói "The number is fine".' },
      { q: 'What did the tutor say was the real problem with the sample?', answer: 'how they were reached', alt: ['all through one community centre', 'they were all reached through one community centre', 'the recruitment method'], why: '"My concern is how you reached them — all through one community centre." Vấn đề là CÁCH tiếp cận, không phải số lượng.' },
      { q: 'Who defended the questionnaire wording?', answer: 'Mai', why: '"I would defend those, actually. We tested them on a small group first." Bẫy: Mai bảo vệ NHƯNG sau đó chịu sửa — câu hỏi hỏi ai bảo vệ, nên đáp án vẫn là Mai.' },
      { q: 'Whose view did the tutor support on the wording?', answer: 'Dan', why: '"I am with Dan on that one." Cụm "I am with X" là cách nói đứng về phía ai — dạng Section 3 rất hay dùng.' },
      { q: 'The correct response rate is ____________ per cent.', answer: '43', alt: ['forty-three', 'forty three'], why: 'Mai báo cáo 40, Dan sửa thành 43 sau khi tính cả phiếu trả muộn. Đáp án là con số ĐÃ SỬA.' },
      { q: 'How many interviews should they now do?', answer: '15', alt: ['fifteen'], why: 'Kế hoạch là 20; giảng viên nói "Fifteen at most" và Dan đồng ý. Bẫy: 20 được nhắc TRƯỚC.' },
      { q: 'When should they transcribe the interviews?', answer: 'as they go', alt: ['as you go', 'while doing them', 'straight away'], why: '"transcribe as you go rather than leaving it all to the end".' },
      { q: 'The literature review should be grouped by ____________.', answer: 'what they disagree about', alt: ['disagreement', 'what the studies disagree about'], why: '"Group the studies by what they disagree about, not by date." Đây cũng là lời khuyên đáng dùng cho chính bài viết của bạn.' },
      { q: 'The revised design is due on the ____________.', answer: '15th', alt: ['fifteenth', '15'], why: '"Send me the revised design by the fifteenth." Chú ý bài có hai lần số 15 (15 phỏng vấn và ngày 15) — hai thứ khác nhau.' },
    ],
    listenFor: ['I did raise that at the time (ai nêu trước)', 'That is fair, although… (nhượng bộ rồi vẫn giữ ý)', 'I am with Dan on that one (đứng về phía ai)', 'Forty-three, actually (sửa số)', 'Fifteen at most'],
    tips: [
      'Bài có ba lần thông tin bị SỬA: cách tiếp cận mẫu, tỷ lệ phản hồi 40 thành 43, và số phỏng vấn 20 xuống 15. Ở Section 3, đáp án gần như luôn là bản đã sửa.',
      'Cụm chỉ lập trường phải thuộc: "I am with X on that", "That is fair, although…", "I would defend those, actually", "Fifteen suits me". Chúng cho biết AI nghĩ gì — thứ mà dạng Matching People hỏi thẳng.',
      'Nhượng bộ không phải đổi ý. Mai nói "That is fair, although…" — bà vẫn giữ một phần ý mình. Nghe nhầm chỗ này là nối sai người.',
      'Bài có hai lần số 15 gắn với hai thứ khác nhau (số phỏng vấn và hạn nộp). Luôn ghi kèm ĐƠN VỊ hoặc ngữ cảnh bên cạnh con số.',
    ],
  },
];

/* ══════════════════════ VIẾT ══════════════════════ */

export const WRITINGS4B: WritingTask[] = [
  {
    id: 's4w3',
    task: 'Task 1 (Academic)',
    title: 'Bảng số liệu — thời gian dùng trong ngày theo nhóm tuổi',
    figure: {
      kind: 'table',
      title: 'Average time spent on selected activities per day, by age group (minutes)',
      note: 'Số liệu tự đặt cho bài luyện. Bảng có 16 ô số — đề dạng bảng ăn nhau ở việc CHỌN, không ở việc đọc hết.',
      unit: 'phút',
      categories: ['16–24', '25–44', '45–64', '65+'],
      series: [
        { name: 'Paid work', values: [186, 312, 268, 34] },
        { name: 'Housework and care', values: [52, 145, 132, 118] },
        { name: 'Screen entertainment', values: [214, 128, 156, 232] },
        { name: 'Sleep', values: [512, 462, 448, 486] },
      ],
    },
    prompt: 'The table below shows the average number of minutes per day that people in four age groups spent on selected activities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    promptVi: 'Bảng dưới đây cho biết số phút trung bình mỗi ngày mà người thuộc bốn nhóm tuổi dành cho các hoạt động được chọn. Tóm tắt bằng cách chọn và tường thuật các đặc điểm chính, có so sánh khi cần.',
    minWords: 150,
    minutes: 20,
    outline: [
      { part: 'Câu mở', what: 'Viết lại đề. Nêu rõ đơn vị (phút/ngày) và bốn nhóm tuổi — với dạng bảng, người chấm muốn thấy bạn hiểu bảng đang đo gì.' },
      { part: 'Câu tổng quan', what: 'BẮT BUỘC. Với bảng 16 ô, tổng quan nên nêu KHUÔN MẪU chung: hoạt động nào chiếm nhiều thời gian nhất ở mọi nhóm, và biến thiên theo tuổi mạnh nhất ở hoạt động nào.' },
      { part: 'Thân 1', what: 'Nhóm số liệu theo TRỤC MẠNH NHẤT — ở đây là công việc có lương, thứ thay đổi dữ dội nhất theo tuổi (34 tới 312 phút).' },
      { part: 'Thân 2', what: 'Khuôn mẫu chữ U của giải trí màn hình và tính ổn định của giấc ngủ. TUYỆT ĐỐI không đọc lại đủ 16 con số.' },
    ],
    phrases: [
      { en: 'The table compares how four age groups divided their day between…', vi: 'Bảng so sánh cách bốn nhóm tuổi phân chia thời gian trong ngày cho…' },
      { en: 'The clearest variation by age is found in…', vi: 'Biến thiên theo tuổi rõ nhất nằm ở…' },
      { en: 'peaked at 312 minutes among…', vi: 'đạt đỉnh 312 phút ở nhóm…' },
      { en: 'followed a U-shaped pattern', vi: 'theo khuôn mẫu hình chữ U' },
      { en: 'varied comparatively little across the groups', vi: 'thay đổi tương đối ít giữa các nhóm' },
      { en: 'at the opposite end of the scale', vi: 'ở đầu kia của thang' },
    ],
    sample: {
      band: 'Mức 7.5 — chọn ba khuôn mẫu, bỏ hẳn phần thừa',
      text: 'The table compares the average number of minutes that four age groups devoted each day to paid work, domestic responsibilities, screen entertainment and sleep.\n\nOverall, sleep took up more time than any other activity in every group and varied comparatively little, whereas paid work showed by far the sharpest differences by age. Screen entertainment followed a distinctive U-shaped pattern, being highest among the youngest and oldest groups.\n\nPaid work rose steeply from 186 minutes among 16 to 24 year olds to a peak of 312 minutes in the 25 to 44 group, before falling back to 268 minutes and then collapsing to just 34 minutes after the age of 65. Housework and care moved in a narrower band, though it almost tripled between the youngest group and those aged 25 to 44, which is where the two demands evidently overlap.\n\nThe pattern for screen entertainment was the reverse. The youngest and oldest groups recorded 214 and 232 minutes respectively, between two thirds and four fifths more than the 128 minutes reported by 25 to 44 year olds. Sleep, at between 448 and 512 minutes, was the most stable figure in the table, with the youngest group sleeping around an hour longer than the 45 to 64 group.',
      note: '196 từ. Bốn dấu hiệu band 7.5 với dạng bảng: (1) tổng quan nêu BA khuôn mẫu (ngủ ổn định, việc làm biến thiên mạnh, giải trí hình chữ U) thay vì nêu số lớn nhất; (2) chỉ trích ra 9 trong 16 con số — chọn lọc là tiêu chí chấm, không phải đầy đủ; (3) so sánh bằng tỷ lệ ("almost tripled", "between two thirds and four fifths more", "an hour longer") chứ không chỉ bằng hiệu số; (4) một nhận xét diễn giải rất ngắn ("which is where the two demands evidently overlap") — đủ để thấy có tư duy, chưa tới mức bình luận ngoài bảng.',
    },
    weakSample: {
      band: 'Mức 6.5 — đúng hết, đủ hết, nhưng đọc lại cả bảng',
      text: 'The table shows the average number of minutes per day spent on four activities by four age groups.\n\nIn the 16 to 24 group, people spent 186 minutes on paid work, 52 minutes on housework and care, 214 minutes on screen entertainment and 512 minutes on sleep. In the 25 to 44 group, the figures were 312, 145, 128 and 462 minutes respectively. In the 45 to 64 group, they were 268, 132, 156 and 448 minutes. In the 65 and over group, they were 34, 118, 232 and 486 minutes.\n\nOverall, it can be seen that different age groups spend their time in different ways, and that sleep takes the most time in all four groups.',
      problems: [
        'Đọc lại toàn bộ 16 con số theo đúng thứ tự bảng. Không có con số nào bị bỏ, và cũng không có con số nào được CHỌN — đây chính là định nghĩa của việc thiếu chọn lọc.',
        'Câu tổng quan đặt ở cuối và nửa đầu rỗng: "different age groups spend their time in different ways" đúng với mọi bảng số liệu từng tồn tại.',
        'Không có so sánh nào giữa các nhóm, dù đề yêu cầu rõ. Liệt kê cạnh nhau không phải là so sánh.',
        'Bỏ sót ba khuôn mẫu đáng viết nhất: việc làm sụp xuống sau 65 tuổi, giải trí hình chữ U, giấc ngủ ổn định.',
        'Lặp đúng một cấu trúc "In the … group, the figures were …" bốn lần liền.',
        'Bài này KHÔNG sai ngữ pháp câu nào — và đó chính là điểm cần thấy: ở band 6.5 lên 7.5, thứ chặn bạn không còn là lỗi mà là cách chọn thông tin.',
      ],
    },
    mistakes: [
      { wrong: 'Đọc lần lượt cả 16 ô số.', right: 'Chọn 8–10 số minh hoạ cho 3 khuôn mẫu, bỏ hẳn phần còn lại.', why: 'Task Achievement chấm "selecting the main features". Bảng càng nhiều số thì việc BỎ BỚT càng là kỹ năng được chấm — viết đủ hết là tự chặn mình ở 6.5.' },
      { wrong: 'Overall, different age groups spend their time differently.', right: 'Overall, sleep took up more time than any other activity in every group, whereas paid work showed by far the sharpest differences by age.', why: 'Câu tổng quan phải nêu được khuôn mẫu SO SÁNH ĐƯỢC. Câu "khác nhau" đúng với mọi bảng nên không mang thông tin nào.' },
      { wrong: 'Paid work was 312 minutes and 34 minutes.', right: 'Paid work peaked at 312 minutes before collapsing to just 34 minutes after the age of 65.', why: 'Ở band 7.5, con số phải đi kèm ĐỘNG TỪ mô tả quan hệ (peaked, collapsed, almost tripled). Số trơ chỉ chứng minh bạn đọc được bảng.' },
      { wrong: 'The 65+ group spent 232 minutes and the 25–44 group spent 128 minutes.', right: '…between two thirds and four fifths more than the 128 minutes reported by 25 to 44 year olds.', why: 'So sánh bằng TỶ LỆ cho thấy bạn xử lý số liệu chứ không chép lại. Đây là điểm khác biệt dễ thấy nhất giữa 6.5 và 7.5 ở Task 1.' },
    ],
  },
  {
    id: 's4w4',
    task: 'Task 2 (Đồng ý / không đồng ý)',
    title: 'Đại học để làm gì',
    prompt: 'Some people believe that the main purpose of a university education is to prepare students for employment. To what extent do you agree or disagree? Write at least 250 words.',
    promptVi: 'Một số người cho rằng mục đích chính của giáo dục đại học là chuẩn bị cho sinh viên đi làm. Bạn đồng ý hay không đồng ý ở mức độ nào?',
    minWords: 250,
    minutes: 40,
    outline: [
      { part: 'Mở bài', what: 'Viết lại đề + nêu MỨC ĐỘ đồng ý ngay. Đề hỏi "to what extent" nên câu trả lời phải có mức độ, không phải có/không.' },
      { part: 'Thân 1', what: 'Công nhận phần đúng của quan điểm kia — và công nhận cho có sức nặng, không phải cho có lệ.' },
      { part: 'Thân 2', what: 'Lý do chính khiến bạn chỉ đồng ý một phần, triển khai tới tầng hệ quả.' },
      { part: 'Thân 3 hoặc Kết bài', what: 'Nêu điều gì QUYẾT ĐỊNH việc bạn nghiêng về đâu (ở đây: khoảng thời gian ta xét). Đây là chỗ ăn điểm 7.5.' },
    ],
    phrases: [
      { en: 'I agree with this only in part, and the qualification matters.', vi: 'Tôi chỉ đồng ý một phần, và phần hạn định ấy mới là điều đáng nói.' },
      { en: 'There is a good deal of force in this position.', vi: 'Quan điểm này có khá nhiều sức nặng.' },
      { en: 'The difficulty is one of timescale.', vi: 'Khó khăn nằm ở thang thời gian.' },
      { en: 'It does not follow that…', vi: 'Từ đó không suy ra được rằng…' },
      { en: 'What is being measured is…', vi: 'Thứ đang được đo là…' },
      { en: 'On that reading, …', vi: 'Hiểu theo cách đó thì…' },
    ],
    sample: {
      band: 'Mức 7.5 — nêu MỨC ĐỘ, nhượng bộ thật, có tiêu chí phân định',
      text: 'It is often argued that universities exist chiefly to make graduates employable. I agree with this only in part, and the qualification matters more than the agreement does.\n\nThere is a good deal of force in the employment argument, and it deserves better than the dismissal it usually receives from academics. Most students borrow substantial sums, or their families do, and a degree that leaves them no more able to earn a living is a poor return on that money. Nor is the demand a purely material one: a graduate who cannot find work does not become free to pursue knowledge for its own sake, but anxious, and anxiety is not the condition in which anybody thinks well.\n\nThe difficulty is one of timescale. Employers ask for the skills that are scarce this year, and universities that respond directly to those requests produce graduates trained for a labour market that has since moved. A course built around a particular framework or piece of software is obsolete within a decade, whereas the capacity to read a difficult argument, to notice when evidence has been selected, or to learn an unfamiliar system without instruction does not expire. Employers themselves say as much whenever they are asked what they actually value, which is rarely what their job advertisements specify.\n\nOn that reading, the disagreement is less about purpose than about how far ahead we are looking. If the question is what a graduate can do in the first year after leaving, vocational preparation is decisive. If it is what they can do at forty, the general capacities matter more, and a university that abandons them in order to be useful is being useful only briefly.',
      note: '283 từ. Năm dấu hiệu band 7.5: (1) trả lời đúng dạng câu hỏi — "only in part" là MỨC ĐỘ, không phải có/không; (2) đoạn nhượng bộ mạnh tới mức đọc riêng ra tưởng bài đồng ý — nhượng bộ có sức nặng mới là nhượng bộ thật; (3) lập luận chính không dừng ở "kỹ năng mềm quan trọng" mà chỉ ra CƠ CHẾ khiến việc chạy theo yêu cầu tuyển dụng tự thất bại; (4) kết bài đưa ra một TIÊU CHÍ phân định (thang thời gian) giải thích được vì sao cả hai phía đều thấy mình đúng; (5) câu cuối gói lại bằng một nghịch lý ngắn thay vì lặp lại mở bài.',
    },
    weakSample: {
      band: 'Mức 6.5 — không sai gì, nhưng chỉ có hai danh sách và một lập trường lửng',
      text: 'It is often said that the main purpose of university is to prepare students for work. In my opinion, I partly agree with this statement because university has other purposes as well.\n\nOn the one hand, preparing students for employment is very important. Firstly, university is expensive and students want a good job after graduation. Secondly, companies need skilled workers. Thirdly, practical courses such as engineering and medicine are clearly designed for a career. Therefore, employability should be a priority for universities.\n\nOn the other hand, university also has other purposes. It develops critical thinking and it teaches students to work independently. Moreover, it allows students to study subjects they are interested in, such as history or philosophy, which may not lead directly to a job but which are valuable for society.\n\nIn conclusion, I believe that university should prepare students for work but should also develop their minds. Universities should try to balance these two purposes.',
      problems: [
        'Bài KHÔNG có lỗi ngữ pháp nào và vẫn chỉ ở 6.5 — đây là điều quan trọng nhất cần thấy ở chặng 4.',
        'Trả lời "partly agree" ở mở bài rồi không bao giờ nói RÕ phần nào đồng ý, phần nào không. Đề hỏi "to what extent" nên mức độ phải được định lượng bằng lý lẽ.',
        'Hai đoạn thân là hai danh sách song song, không đoạn nào đối thoại với đoạn kia.',
        'Ý "phát triển tư duy phản biện" được nêu mà không giải thích vì sao nó bền hơn kỹ năng nghề — thiếu đúng cái cơ chế làm nên lập luận.',
        'Kết bài dùng "should try to balance" — công thức an toàn, không cho biết cân theo tiêu chí gì.',
        'Lặp nhãn: Firstly, Secondly, Thirdly, Therefore, Moreover, In conclusion.',
      ],
    },
    mistakes: [
      { wrong: 'In my opinion, I partly agree with this statement.', right: 'I agree with this only in part, and the qualification matters more than the agreement does.', why: '"In my opinion, I…" thừa chủ ngữ kép và là công thức học thuộc. Câu thay thế nêu ngay rằng phần HẠN ĐỊNH mới là nội dung của bài — người chấm biết bài sẽ đi đâu.' },
      { wrong: 'Universities should try to balance these two purposes.', right: 'If the question is what a graduate can do in the first year, vocational preparation is decisive; if it is what they can do at forty, the general capacities matter more.', why: '"Cân bằng" là kết luận không nói gì. Ở band 7.5, kết bài phải đưa ra TIÊU CHÍ để biết khi nào nghiêng về bên nào.' },
      { wrong: 'Nhượng bộ một câu cho có rồi vội chuyển sang ý mình.', right: 'Dành trọn một đoạn cho phía kia, mạnh tới mức đọc riêng ra tưởng mình đồng ý.', why: 'Nhượng bộ yếu bị chấm là bài một chiều. Nhượng bộ mạnh rồi mới phản biện là dấu hiệu rõ nhất của tư duy chín ở Task 2.' },
      { wrong: 'It develops critical thinking and it teaches students to work independently.', right: 'A course built around a particular framework is obsolete within a decade, whereas the capacity to notice when evidence has been selected does not expire.', why: 'Cùng một ý nhưng bản sau nêu được CƠ CHẾ và có tương phản thời gian. Ở band 7.5, ý đúng chưa đủ — phải cho thấy vì sao nó đúng.' },
    ],
  },
];

/* ══════════════════════ NÓI ══════════════════════ */

export const SPEAKINGS4B: SpeakingTopic[] = [
  {
    id: 's4sp2',
    part: 'Part 2 — Cue card (nói 2 phút)',
    title: 'A decision you later changed your mind about',
    titleVi: 'Một quyết định mà sau đó bạn đổi ý',
    phrases: [
      { en: 'The decision itself was straightforward enough; what changed was…', vi: 'Bản thân quyết định thì đơn giản; thứ thay đổi là…' },
      { en: 'At the time it seemed like the obvious thing to do.', vi: 'Lúc đó nó có vẻ là việc hiển nhiên phải làm.' },
      { en: 'What I had not accounted for was…', vi: 'Thứ tôi đã không tính tới là…' },
      { en: 'I am still not sure it was the wrong call, to be honest.', vi: 'Thành thật thì tôi vẫn không chắc đó là quyết định sai.' },
      { en: 'It taught me something I have applied since.', vi: 'Nó dạy tôi một điều mà từ đó tôi vẫn áp dụng.' },
    ],
    questions: [
      {
        q: 'Describe a decision you made that you later changed your mind about. You should say: what the decision was; why you made it; what made you change your mind; and explain how you feel about it now.',
        qVi: 'Mô tả một quyết định bạn từng đưa ra rồi sau đó đổi ý. Nói rõ: đó là quyết định gì; vì sao bạn quyết định như vậy; điều gì khiến bạn đổi ý; và giải thích bây giờ bạn thấy thế nào về nó.',
        weak: 'I decided to study economics at university because my parents wanted me to. After one year I changed my mind and moved to computer science. I felt happier because I liked programming more. Now I think it was a good decision and I do not regret it.',
        good: 'The decision itself was straightforward enough — I chose economics rather than computer science when I applied to university, mainly because my parents were confident it led somewhere and I was not confident about anything. At the time it seemed like the obvious thing to do. What I had not accounted for was how much of my week would be spent on material I could follow perfectly well but had no curiosity about. That sounds minor, and for the first term it was; by the second, it was affecting how much work I did, because you can force yourself to attend lectures but you cannot force yourself to think about them at eleven at night. The turning point was oddly specific. I spent a weekend helping a friend debug something for a project I was not even taking, and I noticed I had not looked at the clock once. I switched after that year. What is interesting looking back is that the year was not wasted at all — most of what I now do professionally involves explaining technical work to people who think in terms of cost, and I would be much worse at that without it. So I am glad I changed, and also glad I did not change sooner, which is not a conclusion I expected to reach.',
        goodVi: 'Bản thân quyết định thì đơn giản — tôi chọn kinh tế thay vì khoa học máy tính khi nộp hồ sơ đại học, chủ yếu vì cha mẹ tôi tin chắc ngành đó dẫn đi đâu đó, còn tôi thì chẳng chắc chắn về điều gì cả. Lúc đó nó có vẻ là việc hiển nhiên phải làm. Thứ tôi đã không tính tới là sẽ có bao nhiêu phần trong tuần của mình trôi vào những nội dung mà tôi theo được hoàn toàn nhưng chẳng có chút tò mò nào. Nghe thì nhỏ, và học kỳ đầu đúng là nhỏ thật; tới học kỳ hai thì nó ảnh hưởng tới khối lượng việc tôi làm, vì bạn có thể ép mình tới lớp chứ không ép mình nghĩ về bài lúc mười một giờ đêm được. Bước ngoặt lại rất cụ thể một cách kỳ lạ. Tôi dành trọn một cuối tuần giúp bạn dò lỗi cho một đồ án mà tôi thậm chí không học, và tôi nhận ra mình chưa nhìn đồng hồ lấy một lần. Tôi chuyển ngành sau năm đó. Điều thú vị khi nhìn lại là năm ấy hoàn toàn không phí: phần lớn công việc chuyên môn của tôi bây giờ là giải thích chuyện kỹ thuật cho những người tư duy bằng chi phí, và nếu không có năm đó thì tôi sẽ làm việc ấy tệ hơn nhiều. Nên tôi mừng vì đã đổi, và cũng mừng vì đã không đổi sớm hơn — một kết luận mà chính tôi không ngờ mình đi tới.',
        why: 'Câu yếu trả lời đủ bốn gạch đầu dòng nhưng hết trong 40 giây và mọi câu đều là kết luận, không có cảnh nào. Câu 7.5 khác ở bốn chỗ: (1) có MỘT cảnh cụ thể làm bước ngoặt (cuối tuần dò lỗi, không nhìn đồng hồ) thay vì nói chung là "tôi thích lập trình hơn"; (2) chi tiết chọn lọc chứ không kể lể — "bạn ép mình tới lớp được nhưng không ép mình nghĩ lúc mười một giờ đêm" vừa cụ thể vừa là quan sát; (3) câu chốt là một NGHỊCH LÝ có lý ("mừng vì đã đổi, và mừng vì không đổi sớm hơn") — đúng loại kết mà giám khảo ghi nhận; (4) toàn bài không dùng từ vựng hiếm nào, sức mạnh nằm ở cấu trúc câu chuyện. Đó là điều cần thấy ở band 7.5.',
      },
      {
        q: 'Follow-up: Do you think people change their minds too rarely?',
        qVi: 'Câu hỏi nối: bạn có nghĩ người ta quá hiếm khi đổi ý không?',
        weak: 'Yes, I think many people are stubborn and do not want to admit they are wrong, especially older people.',
        good: 'I would separate two things: how often people actually change their minds, and how willing they are to say so. My impression is that people change their minds fairly often but very quietly, and then rewrite the history so that they always thought the new thing. What is rare is doing it out loud, and I think that is a reasonable response to how we treat public figures who do it — we call it a U-turn rather than learning. So if I wanted people to change their minds more visibly, I would probably start by not punishing the ones who do.',
        goodVi: 'Tôi sẽ tách hai chuyện: người ta thật sự đổi ý thường xuyên đến đâu, và họ sẵn lòng NÓI RA điều đó đến đâu. Cảm nhận của tôi là người ta đổi ý khá thường xuyên nhưng rất lặng lẽ, rồi viết lại lịch sử sao cho như thể mình vẫn luôn nghĩ như thế. Thứ hiếm là làm điều đó công khai, và tôi nghĩ đó là phản ứng hợp lý trước cách chúng ta đối xử với những người của công chúng khi họ làm vậy — ta gọi đó là "quay xe" chứ không gọi là học hỏi. Nên nếu muốn người ta đổi ý một cách công khai hơn, có lẽ tôi sẽ bắt đầu bằng việc thôi trừng phạt những ai đã làm vậy.',
        why: 'Ba kỹ thuật band 7.5 trong một câu trả lời ngắn: TÁCH câu hỏi thành hai câu hỏi con; đưa ra một giả thuyết ngược với câu trả lời hiển nhiên (người ta đổi ý nhiều, chỉ là không nói ra); và kết bằng một hệ quả thực tiễn. Cũng lưu ý câu trả lời KHÔNG dài — ở Part 3, dài không bằng có cấu trúc.',
      },
    ],
  },
  {
    id: 's4sp3',
    part: 'Part 3',
    title: 'Skills, machines and what gets lost',
    titleVi: 'Kỹ năng, máy móc và những thứ mất đi',
    phrases: [
      { en: 'It depends what we count as a skill.', vi: 'Còn tuỳ ta coi cái gì là kỹ năng.' },
      { en: 'The loss is real, but it is not evenly distributed.', vi: 'Mất mát là có thật, nhưng không chia đều.' },
      { en: 'I think the causation runs both ways there.', vi: 'Tôi nghĩ ở đó nhân quả đi cả hai chiều.' },
      { en: 'We tend to notice what disappears and not what replaces it.', vi: 'Ta hay để ý cái mất đi mà không để ý cái thế chỗ nó.' },
      { en: 'That is easy to say from where I am sitting.', vi: 'Nói vậy thì dễ, khi tôi đang ngồi ở vị trí của mình.' },
    ],
    questions: [
      {
        q: 'Is it a problem that fewer people can repair things themselves?',
        qVi: 'Việc ngày càng ít người tự sửa được đồ đạc có phải là vấn đề không?',
        weak: 'Yes, it is a problem because people waste money buying new things and it is bad for the environment.',
        good: 'The loss is real, but I think it is not evenly distributed, and that is the part worth talking about. For most of us it is an inconvenience and an expense. For people on low incomes it is closer to a structural problem, because being unable to repair anything means every failure becomes a purchase, and purchases have to be financed. What I would resist is the nostalgic version of the argument, where everybody used to be capable and now nobody is. My grandfather could repair a radio because radios were built to be opened and because he had seen fifty of them; he could not do anything with a modern one, and neither could a technician without the diagnostic software. So the skill did not decay so much as the object changed underneath it, which points to a different solution — access to information rather than exhortation to learn.',
        goodVi: 'Mất mát là có thật, nhưng tôi nghĩ nó không chia đều, và chính chỗ đó mới đáng bàn. Với phần lớn chúng ta thì đó là chuyện bất tiện và tốn kém. Với người thu nhập thấp thì nó gần với một vấn đề mang tính cấu trúc, vì không sửa được gì nghĩa là mỗi lần hỏng đều biến thành một lần mua, mà mua thì phải có tiền. Thứ tôi muốn phản đối là phiên bản hoài niệm của lập luận này, kiểu ngày xưa ai cũng khéo còn giờ thì chẳng ai biết gì. Ông tôi sửa được radio vì radio hồi đó được làm ra để mở được, và vì ông đã nhìn thấy năm mươi cái như thế; ông sẽ chẳng làm gì được với một cái radio hiện đại, mà một người thợ không có phần mềm chẩn đoán cũng vậy. Nên kỹ năng không mai một cho bằng việc chính món đồ đã thay đổi bên dưới nó — và điều đó chỉ tới một giải pháp khác: tiếp cận được thông tin, chứ không phải hô hào người ta chịu khó học.',
        why: 'Ba thứ kéo câu này lên 7.5: (1) không trả lời có/không mà chỉ ra sự PHÂN BỐ không đều của vấn đề; (2) tự bác bỏ phiên bản dễ dãi của chính lập luận mình đang ủng hộ (bản hoài niệm) — dấu hiệu rõ nhất của tư duy độc lập; (3) một ví dụ cá nhân rất cụ thể (ông và cái radio) dùng để CHỨNG MINH một luận điểm trừu tượng, chứ không phải kể cho có. Ý này lấy lại từ bài đọc "Why Nobody Fixes Things Any More" — đọc và nói dùng chung kho ý là cách học tiết kiệm nhất.',
      },
      {
        q: 'Do you think schools should teach practical skills as well as academic subjects?',
        qVi: 'Bạn có nghĩ nhà trường nên dạy cả kỹ năng thực hành bên cạnh môn học thuật không?',
        weak: 'Yes, definitely. Students should learn cooking, basic repairs and how to manage money, because these skills are useful in real life.',
        good: 'In principle yes, though I am wary of how that usually goes in practice. Every few years somebody proposes adding financial literacy or cooking to the timetable, and it gets one lesson a fortnight taught by whoever has a free period, which is worse than not doing it because it lets everyone believe the problem has been addressed. If I had to choose, I would rather schools taught fewer things properly. And I would question the assumption underneath the question slightly — the academic subjects are practical, if they are taught well. Learning to read a statistical claim carefully is exactly the skill you need when somebody sells you a loan. It is just not labelled as practical, because we reserve that word for things involving your hands.',
        goodVi: 'Về nguyên tắc thì có, dù tôi khá dè chừng chuyện đó thường diễn ra thế nào trên thực tế. Cứ vài năm lại có người đề xuất thêm giáo dục tài chính hay nấu ăn vào thời khoá biểu, rồi nó được xếp hai tuần một tiết do bất cứ ai đang rảnh dạy — và như thế còn tệ hơn là không làm, vì nó khiến mọi người tin rằng vấn đề đã được xử lý. Nếu phải chọn, tôi thà nhà trường dạy ít thứ hơn nhưng dạy cho ra. Và tôi cũng hơi nghi ngờ giả định nằm dưới câu hỏi — các môn học thuật VỐN đã thực hành, nếu được dạy tử tế. Học cách đọc kỹ một khẳng định thống kê chính là kỹ năng bạn cần khi có người chào bán cho bạn một khoản vay. Chỉ là nó không được dán nhãn "thực hành", vì ta dành từ đó cho những việc dùng tới đôi tay.',
        why: 'Điểm mạnh nhất là ở câu áp chót: THÁCH THỨC giả định của chính câu hỏi ("các môn học thuật vốn đã thực hành nếu dạy tử tế"). Ở Part 3, đặt lại vấn đề luôn ăn điểm cao hơn trả lời trong khung có sẵn — miễn là bạn vẫn trả lời câu được hỏi, chứ không lảng sang chuyện khác. Câu này làm đủ cả hai.',
      },
    ],
  },
];
