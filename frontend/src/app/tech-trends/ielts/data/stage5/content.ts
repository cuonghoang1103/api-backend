/**
 * Chặng 5 (7.5 → 8.0) — ĐỌC và NGHE.
 *
 * Nguyên tắc riêng của chặng này: **nguồn vào phải KHÓ HƠN đề thi.** Ở 7.5,
 * luyện vừa đúng độ khó đề thi chỉ giữ bạn dao động quanh 32–35/40 và phụ
 * thuộc vào việc hôm đó đề dễ hay khó. Vì thế bài đọc dưới đây dài hơn và
 * lập luận rắc rối hơn passage 3 thật một bậc, còn bài nghe thì nói nhanh,
 * không nhắc lại, và có hai chỗ người nói tự đính chính giữa chừng — đúng
 * thứ Section 4 thật hay làm mà tài liệu luyện thi thường bỏ.
 *
 * Viết và nói nằm ở `content-b.ts`.
 */
import type {
  ReadingPassage, ListeningExercise, ListeningSource,
} from '../types';

/* ══════════════════ ĐỌC ══════════════════ */

export const READINGS5: ReadingPassage[] = [
  {
    id: 's5r1',
    title: 'Why Successful Pilots Fail to Scale',
    titleVi: 'Vì sao thí điểm thành công lại thất bại khi nhân rộng',
    level: 'C1+ — khó hơn passage 3 của đề thật một bậc',
    words: 486,
    minutes: 15,
    paragraphs: [
      { label: 'A', text: 'A programme is trialled in three schools, the results are encouraging, and the decision to extend it across a region follows almost automatically. Two years later the effect has vanished. This sequence is so common in education, medicine and public administration that researchers have given it a name — the scale-up problem — and yet the policy cycle that produces it continues largely unchanged.' },
      { label: 'B', text: 'The obvious explanation is that the original finding was simply wrong, a statistical accident dressed up as a discovery. This does happen, and the tightening of publication standards over the past decade has reduced it. But it cannot be the whole story, because the pattern persists in trials that were well designed, adequately powered and independently replicated at small scale.' },
      { label: 'C', text: 'Professor Amara Silva locates the difficulty in the people rather than the method. A pilot, she points out, is almost never staffed at random. It attracts practitioners who volunteered, who believe in the approach, and who are often supervised by the person who designed it. Scaling up replaces that group with everyone else — including those who are indifferent to the idea and those who resent being told to adopt it. On this account the pilot did not measure the programme; it measured the programme delivered by unusually motivated people.' },
      { label: 'D', text: 'Dr Tomas Reinhardt accepts this but regards it as secondary. His concern is with what he calls the supporting environment: the smaller class sizes, the additional coordinator, the shorter reporting chain that a pilot quietly enjoys and that no budget ever extends to the full rollout. Strip those away, he argues, and even wholly committed staff will produce weaker results, because the intervention was never the only thing being tested.' },
      { label: 'E', text: 'The distinction matters practically. If Silva is right, the remedy is to pilot with ordinary staff under ordinary supervision, accepting a smaller measured effect in exchange for a more honest one. If Reinhardt is right, the remedy is to cost the supporting environment properly and to abandon any programme that cannot be afforded at full scale — a far more expensive conclusion, and correspondingly less popular with the bodies that commission such trials.' },
      { label: 'F', text: 'What is striking is how rarely either remedy is adopted. Part of the reason is that a pilot serves a second function nobody states openly: it demonstrates that something is being done. A trial that reports a large effect is politically useful long before anyone asks whether the effect survives contact with the wider system, and by the time that question arrives the officials who commissioned it have usually moved on.' },
      { label: 'G', text: 'None of this argues against piloting. The alternative — imposing untested programmes on entire populations — is plainly worse. It argues instead for reading pilot results as an upper bound rather than an estimate, and for treating the gap between trial and rollout not as an unfortunate implementation failure but as the most informative part of the exercise.' },
    ],
    glossary: [
      { en: 'trial (v)', ipa: '/ˈtraɪəl/', vi: 'thí điểm, thử nghiệm' },
      { en: 'adequately powered', ipa: '/ˈædɪkwətli ˈpaʊəd/', vi: 'đủ cỡ mẫu để kết luận' },
      { en: 'indifferent to', ipa: '/ɪnˈdɪfrənt/', vi: 'thờ ơ với' },
      { en: 'resent', ipa: '/rɪˈzent/', vi: 'bực bội, phản ứng ngầm' },
      { en: 'rollout', ipa: '/ˈrəʊlaʊt/', vi: 'việc triển khai đại trà' },
      { en: 'commission (v)', ipa: '/kəˈmɪʃn/', vi: 'đặt hàng, uỷ nhiệm thực hiện' },
      { en: 'upper bound', ipa: '/ˈʌpə baʊnd/', vi: 'giới hạn trên' },
      { en: 'implementation', ipa: '/ˌɪmplɪmenˈteɪʃn/', vi: 'việc thực thi' },
    ],
    questions: [
      { kind: 'MATCH', q: 'Which person argues that a pilot measures the programme as delivered by unusually motivated staff?', options: ['Professor Amara Silva', 'Dr Tomas Reinhardt', 'The writer', 'Neither'], answer: 'Professor Amara Silva', why: 'Đoạn C, câu cuối: "the pilot did not measure the programme; it measured the programme delivered by unusually motivated people".', whyNot: 'Reinhardt CHẤP NHẬN ý này nhưng coi nó là thứ yếu (đoạn D, "accepts this but regards it as secondary") — đây là bẫy chính của dạng Matching Features ở độ khó này.' },
      { kind: 'MATCH', q: 'Which person is most concerned with resources that a pilot enjoys but a rollout does not?', options: ['Dr Tomas Reinhardt', 'Professor Amara Silva', 'The writer', 'Both equally'], answer: 'Dr Tomas Reinhardt', why: 'Đoạn D: "the supporting environment: the smaller class sizes, the additional coordinator, the shorter reporting chain that a pilot quietly enjoys and that no budget ever extends to the full rollout".', whyNot: 'Silva nói về CON NGƯỜI, Reinhardt nói về ĐIỀU KIỆN. Hai người đồng ý với nhau nhiều hơn là phản đối — phải bắt đúng chi tiết khác biệt.' },
      { kind: 'YNNG', q: 'The writer believes that pilot studies should be abandoned.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'NO', why: 'Đoạn G mở bằng "None of this argues against piloting" và nói thẳng phương án thay thế "is plainly worse".', whyNot: 'Bẫy lớn nhất của bài: sáu đoạn đầu toàn nêu vấn đề của thí điểm, rất dễ tưởng tác giả phản đối.' },
      { kind: 'YNNG', q: 'The writer thinks Reinhardt\'s remedy is less likely to be adopted than Silva\'s.', options: ['YES', 'NO', 'NOT GIVEN'], answer: 'YES', why: 'Đoạn E: giải pháp của Reinhardt là "a far more expensive conclusion, and correspondingly less popular with the bodies that commission such trials".', whyNot: 'Tác giả không nói thẳng "ít được áp dụng hơn" nhưng "less popular with the bodies that commission" là nhận định rõ ràng theo đúng hướng đó.' },
      { kind: 'MCQ', q: 'According to paragraph B, why is "the finding was simply wrong" an insufficient explanation?', options: ['Because the pattern persists in well-designed, replicated trials', 'Because publication standards have not changed', 'Because statisticians disagree', 'Because pilots are never replicated'], answer: 'Because the pattern persists in well-designed, replicated trials', why: 'Đoạn B câu cuối: "the pattern persists in trials that were well designed, adequately powered and independently replicated at small scale".', whyNot: 'B khẳng định publication standards ĐÃ siết lại ("the tightening… has reduced it") — phương án 2 nói ngược.' },
      { kind: 'GAP', q: 'The writer recommends reading pilot results as an upper ____________ rather than an estimate.', answer: 'bound', why: 'Đoạn G: "reading pilot results as an upper bound rather than an estimate".', whyNot: 'Chép nguyên văn một từ. Dạng GAP ở passage khó vẫn thường lấy nguyên văn — đừng tự diễn giải lại.' },
      { kind: 'GAP', q: 'Reinhardt calls the extra resources a pilot enjoys the supporting ____________.', answer: 'environment', why: 'Đoạn D: "what he calls the supporting environment".', whyNot: 'Cụm "what he calls" là biển chỉ đường cho một thuật ngữ — đề rất hay hỏi vào đó.' },
      { kind: 'MCQ', q: 'What second function of pilots does paragraph F identify?', options: ['It demonstrates that something is being done', 'It trains new staff', 'It reduces costs', 'It replaces academic research'], answer: 'It demonstrates that something is being done', why: 'Đoạn F: "a pilot serves a second function nobody states openly: it demonstrates that something is being done".', whyNot: 'Cụm "nobody states openly" báo hiệu một nhận định quan trọng sắp tới — chỗ này gần như luôn có câu hỏi.' },
      { kind: 'TFNG', q: 'Officials who commission pilots usually remain in post long enough to see the rollout results.', options: ['TRUE', 'FALSE', 'NOT GIVEN'], answer: 'FALSE', why: 'Đoạn F câu cuối: "by the time that question arrives the officials who commissioned it have usually moved on" — ngược hẳn với câu hỏi.', whyNot: 'FALSE chứ không phải NOT GIVEN: bài nói rõ điều ngược lại, không phải im lặng về nó.' },
      { kind: 'HEADING', q: 'Chọn tiêu đề đúng cho đoạn E.', options: ['Two remedies, and why one costs more', 'The origins of the scale-up problem', 'Evidence that pilots are unreliable', 'A defence of large-scale trials'], answer: 'Two remedies, and why one costs more', why: 'Đoạn E đặt hai phương án chữa tương ứng với hai cách giải thích, rồi so sánh cái giá của chúng.', whyNot: 'Nguồn gốc vấn đề nằm ở C và D; đoạn E chỉ nói tới HỆ QUẢ THỰC TIỄN của việc ai đúng.' },
    ],
    strategy: [
      'Bài có hai chuyên gia ĐỒNG Ý với nhau phần lớn, chỉ khác ở việc coi cái gì là chính. Đây là dạng khó nhất của Matching Features. Cách xử lý: ghi ra lề một từ khoá cho mỗi người ngay khi đọc tới họ — Silva = CON NGƯỜI, Reinhardt = ĐIỀU KIỆN.',
      'Với YNNG, đọc đoạn cuối TRƯỚC khi trả lời bất kỳ câu nào về quan điểm tác giả. Bài này dựng sáu đoạn nêu vấn đề rồi lật lại ở đoạn G — cấu trúc rất hay gặp và rất hay bẫy.',
      'Phân biệt FALSE với NOT GIVEN: FALSE là bài nói NGƯỢC LẠI; NOT GIVEN là bài KHÔNG NÓI GÌ. Câu về các quan chức là FALSE vì đoạn F nói thẳng họ đã chuyển đi.',
      'Cụm báo hiệu đáng gạch chân ở bài này: "The obvious explanation is… But", "What is striking is", "nobody states openly", "None of this argues against". Bốn cụm này dẫn thẳng tới bốn đáp án.',
      'Bấm giờ 15 phút cho cả bài 486 từ + 10 câu. Bài này NGẮN hơn passage 3 thật (khoảng 900 từ) nhưng lập luận rắc rối hơn — nên nếu quá 17 phút thì vấn đề nằm ở việc bóc lập luận, không phải ở tốc độ đọc thuần. Muốn luyện tốc độ thì lấy bài ngoài đề 900–1.200 từ như bài 10 của chặng chỉ.'
    ],
    translation:
      'A. Một chương trình được thí điểm ở ba trường, kết quả khả quan, và quyết định mở rộng ra cả một vùng gần như tự động theo sau. Hai năm sau, hiệu quả biến mất. Chuỗi sự việc này phổ biến tới mức trong giáo dục, y tế và hành chính công, giới nghiên cứu đã đặt cho nó một cái tên — vấn đề nhân rộng — vậy mà cái vòng chính sách sinh ra nó thì vẫn gần như không đổi.\n\n'
      + 'B. Cách giải thích hiển nhiên là phát hiện ban đầu vốn đã sai, một sự trùng hợp thống kê được khoác áo khám phá. Chuyện này có xảy ra, và việc siết chặt chuẩn công bố trong thập kỷ qua đã làm nó giảm đi. Nhưng đó không thể là toàn bộ câu chuyện, bởi khuôn mẫu ấy vẫn tồn tại ở những thử nghiệm được thiết kế tốt, đủ cỡ mẫu và đã được lặp lại độc lập ở quy mô nhỏ.\n\n'
      + 'C. Giáo sư Amara Silva định vị khó khăn ở CON NGƯỜI chứ không ở phương pháp. Bà chỉ ra rằng một cuộc thí điểm gần như không bao giờ được bố trí nhân sự ngẫu nhiên. Nó thu hút những người tình nguyện, những người tin vào cách làm đó, và thường được giám sát bởi chính người thiết kế ra nó. Nhân rộng thì thay nhóm ấy bằng tất cả những người còn lại — kể cả người thờ ơ với ý tưởng và người bực bội vì bị bắt áp dụng. Theo cách nhìn này, cuộc thí điểm đã không đo chương trình; nó đo chương trình khi được thực hiện bởi những người có động lực bất thường.\n\n'
      + 'D. Tiến sĩ Tomas Reinhardt chấp nhận điều đó nhưng coi nó là thứ yếu. Mối bận tâm của ông là thứ ông gọi là môi trường hỗ trợ: lớp học nhỏ hơn, có thêm một điều phối viên, chuỗi báo cáo ngắn hơn — những thứ một cuộc thí điểm âm thầm được hưởng và không ngân sách nào mở rộng được cho đợt triển khai đại trà. Bỏ những thứ đó đi, ông lập luận, thì ngay cả nhân viên hoàn toàn tận tâm cũng sẽ cho kết quả yếu hơn, bởi can thiệp ấy chưa bao giờ là thứ duy nhất được đem ra thử.\n\n'
      + 'E. Sự phân biệt này có ý nghĩa thực tiễn. Nếu Silva đúng, cách chữa là thí điểm với nhân sự bình thường dưới sự giám sát bình thường, chấp nhận một hiệu quả đo được nhỏ hơn để đổi lấy một con số trung thực hơn. Nếu Reinhardt đúng, cách chữa là tính đúng chi phí của môi trường hỗ trợ và từ bỏ mọi chương trình không kham nổi ở quy mô đầy đủ — một kết luận đắt hơn nhiều, và vì thế cũng kém được lòng các cơ quan đặt hàng những cuộc thử nghiệm ấy.\n\n'
      + 'F. Điều đáng chú ý là cả hai cách chữa đều hiếm khi được áp dụng. Một phần lý do là cuộc thí điểm còn phục vụ một chức năng thứ hai mà không ai nói thẳng: nó chứng tỏ rằng người ta đang làm một điều gì đó. Một thử nghiệm báo cáo hiệu quả lớn có ích về mặt chính trị từ rất lâu trước khi có ai hỏi liệu hiệu quả ấy có sống sót khi va vào hệ thống rộng hơn không, và tới lúc câu hỏi đó xuất hiện thì các quan chức đã đặt hàng nó thường đã chuyển đi nơi khác.\n\n'
      + 'G. Không điều nào ở trên là lý lẽ chống lại việc thí điểm. Phương án thay thế — áp đặt những chương trình chưa qua thử nghiệm lên toàn bộ dân cư — rõ ràng tệ hơn. Nó là lý lẽ để ĐỌC kết quả thí điểm như một giới hạn trên chứ không phải một ước lượng, và để coi khoảng cách giữa thử nghiệm và triển khai không phải là một thất bại thực thi đáng tiếc mà là phần cho ta biết nhiều nhất trong cả cuộc thử nghiệm.',
  },
];

/* ══════════════════ NGHE ══════════════════ */

export const LISTENINGS5: ListeningExercise[] = [
  {
    id: 's5l1',
    title: 'Lecture: The Economics of Repair',
    titleVi: 'Bài giảng: kinh tế học của việc sửa chữa',
    kind: 'Section 4 — bài giảng học thuật, nói liên tục, có tự đính chính',
    level: 'Khó hơn Section 4 thật · thuật ngữ dày, hai chỗ người nói tự sửa giữa chừng',
    context:
      'Section 4 ở độ khó band 8: nói nhanh, không nhắc lại, và có hai chỗ giảng viên TỰ ĐÍNH CHÍNH giữa câu — '
      + 'đúng thứ đề thật hay làm mà tài liệu luyện thi ít khi có. Nghe thấy "sorry, I should say…" hay "or rather" '
      + 'thì con số/từ ĐẦU TIÊN là bẫy, đáp án nằm ở vế sau. Đọc toàn bộ ghi chú và đoán loại từ trước khi nghe.',
    lines: [
      { who: 'Giảng viên', text: 'In the nineteen fifties, most households in Britain repaired their appliances. By the end of the century, almost none did. I want to look at why, because the usual explanation turns out to be incomplete.' },
      { who: 'Giảng viên', text: 'That usual explanation is labour cost. Repair is skilled work, wages rose, manufacturing costs fell, and so at some point the arithmetic simply flipped. That is broadly right, and it accounts for perhaps half the change.' },
      { who: 'Giảng viên', text: 'But it does not explain the timing. The crossover point — where repairing became more expensive than replacing — arrived twenty years, sorry, I should say thirty years before repair rates actually collapsed. Something else was holding the practice in place.' },
      { who: 'Giảng viên', text: 'That something was the local repair shop, and what disappeared was not demand but the network. Repair depends on diagnosis, and diagnosis depends on a person who has seen the same fault forty times. Once the shops closed, that knowledge was not written down anywhere; it simply left.' },
      { who: 'Giảng viên', text: 'The second factor is design, and here the change is measurable. A washing machine sold in nineteen seventy had roughly two hundred parts, most of them replaceable individually. A comparable machine today has fewer parts overall but a much higher proportion of sealed assemblies — units that cannot be opened without destroying them.' },
      { who: 'Giảng viên', text: 'Now, the interesting question is whether this was deliberate. The strong version of the argument, planned obsolescence, claims manufacturers designed products to fail. The evidence for that is weaker than most people assume.' },
      { who: 'Giảng viên', text: 'What the evidence does support is something less dramatic but more consequential: sealed assemblies are cheaper to manufacture, and repairability was not measured, so it was not optimised for. No conspiracy is required — only an accounting system that counted one thing and ignored another.' },
      { who: 'Giảng viên', text: 'And that is the point I want you to take away. When we ask why a practice disappeared, we tend to look for a decision. Very often what we find instead is an absence — something that stopped being counted, or rather, something that was never counted in the first place.' },
    ],
    questions: [
      { q: 'The usual explanation for the decline in repair is ____________ cost.', answer: 'labour', alt: ['labor'], why: '"That usual explanation is labour cost." Chấp nhận cả chính tả Anh-Mỹ.' },
      { q: 'The crossover point arrived about ____________ years before repair rates collapsed.', answer: 'thirty', alt: ['30'], why: 'BẪY ĐÍNH CHÍNH: giảng viên nói "twenty years, sorry, I should say thirty years". Đáp án là con số SAU khi sửa.' },
      { q: 'What disappeared was not demand but the ____________.', answer: 'network', why: '"what disappeared was not demand but the network". Cấu trúc "not X but Y" luôn là chỗ đề nhắm vào.' },
      { q: 'Repair depends on diagnosis, and diagnosis depends on a person who has seen the same ____________ many times.', answer: 'fault', why: '"a person who has seen the same fault forty times".' },
      { q: 'A washing machine sold in 1970 had roughly ____________ parts.', answer: 'two hundred', alt: ['200'], why: '"had roughly two hundred parts". Số viết chữ hay viết số đều được, nhưng phải đúng con số.' },
      { q: 'Modern machines have a higher proportion of ____________ assemblies.', answer: 'sealed', why: '"a much higher proportion of sealed assemblies — units that cannot be opened without destroying them".' },
      { q: 'The strong version of the argument is called planned ____________.', answer: 'obsolescence', why: '"The strong version of the argument, planned obsolescence". Từ khó đánh vần — chính tả sai là mất điểm dù nghe đúng.' },
      { q: 'Repairability was not ____________, so it was not optimised for.', answer: 'measured', why: '"repairability was not measured, so it was not optimised for". Đây là luận điểm trung tâm của cả bài giảng.' },
      { q: 'The lecturer concludes that what we often find is not a decision but an ____________.', answer: 'absence', why: '"Very often what we find instead is an absence". Câu chốt — đừng buông tai ở phút cuối.' },
    ],
    listenFor: [
      'sorry, I should say… / or rather… (ĐÍNH CHÍNH — đáp án nằm ở vế SAU)',
      'That is broadly right, and it accounts for perhaps half… (nhượng bộ có định lượng)',
      'But it does not explain… (chuyển sang luận điểm thật)',
      'Now, the interesting question is… (đặt câu hỏi rồi tự trả lời)',
      'And that is the point I want you to take away (ý tổng kết)',
    ],
    tips: [
      'Bẫy đính chính là điểm khác biệt lớn nhất giữa Section 4 thật và tài liệu luyện thi. Nghe "sorry", "or rather", "I should say" thì GẠCH BỎ thứ vừa nghe và chờ vế sau. Bài này có hai chỗ như vậy.',
      'Đoán loại từ trước khi nghe: chỗ trống trong "a higher proportion of ____ assemblies" chắc chắn là TÍNH TỪ. Biết vậy thì tai chỉ cần bắt một thứ.',
      '"obsolescence" là kiểu từ nghe ra nhưng viết sai. Ở band 8, chính tả sai = mất điểm hoàn toàn. Những từ dài gốc Latinh trong bài giảng học thuật đáng tập viết riêng.',
      'Cấu trúc "not X but Y" xuất hiện hai lần trong bài và cả hai lần đều có câu hỏi. Ghi nhớ: đề luôn hỏi vế Y.',
      'Bài giảng này nêu MỘT cách giải thích thông thường, bác bỏ một phần, rồi đưa ra cách giải thích thật. Nhận ra cấu trúc đó sớm thì biết được đáp án sẽ nằm ở nửa sau.',
    ],
  },
];

export const LISTENING_SOURCES5: ListeningSource[] = [
  { name: '6 Minute English (playlist)', channel: 'BBC Learning English', kind: 'playlist', ytId: 'PLcetZ6gSk96-FECmH9l7Vlx5VDigvgZpt', level: 'B2 — đã quá dễ ở chặng này', how: 'Ở chặng 5 nguồn này chỉ còn dùng để KHỞI ĐỘNG 5 phút đầu buổi. Nếu vẫn phải nghe hai lần mới hiểu thì bạn chưa sẵn sàng cho chặng 5 — quay lại chặng 4.' },
  { name: 'British Council IELTS (playlist chính thức)', channel: 'TakeIELTS Official — British Council', kind: 'playlist', ytId: 'PLrt2nkX3MUeBNAcBAap6B313_tlVRCAxz', level: 'Hướng dẫn tiêu chí', how: 'Xem phần mô tả band 8 cho Speaking và Writing. Ở chặng này bạn cần biết CHÍNH XÁC chữ trong descriptor, không phải diễn giải của trung tâm luyện thi.' },
];
