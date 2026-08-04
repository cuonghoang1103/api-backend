/**
 * Phần Nói chặng 2 — Part 2 (cue card) và Part 3 (câu hỏi trừu tượng).
 *
 * Chặng 1 tập trung Part 1 (nói về bản thân). Chặng 2 chuyển sang hai phần khó
 * hơn hẳn:
 *   - **Part 2**: nói MỘT MÌNH đủ 2 phút. Vấn đề của người chặng 2 không phải
 *     ngữ pháp mà là HẾT Ý sau 40 giây.
 *   - **Part 3**: bàn chuyện xã hội trừu tượng, không nói về mình nữa. Đây là
 *     phần kéo điểm Speaking xuống thấp nhất.
 *
 * Vẫn giữ cách bày "câu cụt cạnh câu đủ" của chặng 1, nhưng câu cụt ở đây
 * không còn sai ngữ pháp — nó chỉ NGẮN và NÔNG, đúng như bài nói mức 5.0.
 */
import type { SpeakingTopic } from '../types';

export const SPEAKINGS2: SpeakingTopic[] = [
  /* ─────────────── PART 2 ─────────────── */
  {
    id: 's2sp1',
    part: 'Part 2',
    title: 'Describe a skill you learned',
    titleVi: 'Tả một kỹ năng bạn đã học được',
    phrases: [
      { en: 'I would like to talk about…', vi: 'Tôi muốn nói về…' },
      { en: 'I picked it up when…', vi: 'Tôi học được nó khi…' },
      { en: 'At first I found it quite difficult because…', vi: 'Ban đầu tôi thấy khá khó vì…' },
      { en: 'What helped most was…', vi: 'Thứ giúp tôi nhiều nhất là…' },
      { en: 'I remember one occasion when…', vi: 'Tôi nhớ có lần…' },
      { en: 'Looking back, …', vi: 'Nhìn lại thì…' },
    ],
    questions: [
      {
        q: 'Describe a skill you learned that has been useful to you. You should say: what the skill is, when and how you learned it, how difficult it was, and explain why it has been useful. (Nói 2 phút)',
        qVi:
          'Tả một kỹ năng hữu ích bạn đã học: đó là kỹ năng gì, học khi nào và bằng cách nào, khó tới đâu, và '
          + 'vì sao nó hữu ích. Mốc chặng 2: nói đủ 2 phút, không dừng quá 5 giây.',
        weak:
          'I want to talk about cooking. I learned it from my mother when I was young. It was quite difficult '
          + 'at first but now I can cook many dishes. It is useful because I can save money. That is all.',
        good:
          'I would like to talk about touch typing — typing without looking at the keyboard.\n\n'
          + 'I picked it up in my first year at university, when I realised I was spending more time hunting for '
          + 'keys than actually thinking. I used a free website that gives you drills of about ten minutes a day, '
          + 'and I forced myself to keep my eyes on the screen even when it slowed me down.\n\n'
          + 'At first it was genuinely frustrating. My speed dropped to maybe fifteen words a minute, which was '
          + 'far slower than my old two-finger method, and for about two weeks I was tempted to give up. What '
          + 'helped most was tracking my speed each day, because even a small improvement was visible.\n\n'
          + 'I remember one occasion when I had to write a two-thousand-word report overnight. I finished it in '
          + 'about three hours, which would have been impossible a year earlier.\n\n'
          + 'Looking back, it is probably the single most useful hour-per-day investment I have made, because '
          + 'almost everything I do now involves a keyboard.',
        goodVi:
          'Tôi muốn nói về gõ mười ngón — gõ mà không nhìn bàn phím. Tôi học nó năm nhất đại học, khi nhận ra '
          + 'mình tốn thời gian mò phím hơn là suy nghĩ. Tôi dùng một trang miễn phí cho bài tập khoảng mười phút '
          + 'mỗi ngày, và ép mình nhìn màn hình kể cả khi việc đó làm chậm lại. Ban đầu thật sự bực. Tốc độ tụt '
          + 'xuống khoảng mười lăm từ một phút, chậm hơn hẳn cách gõ hai ngón cũ, và suốt hai tuần tôi muốn bỏ. '
          + 'Thứ giúp nhiều nhất là ghi lại tốc độ mỗi ngày, vì tiến bộ dù nhỏ cũng nhìn thấy được. Tôi nhớ có lần '
          + 'phải viết báo cáo hai nghìn từ trong một đêm. Tôi xong trong khoảng ba tiếng, điều mà một năm trước '
          + 'là bất khả. Nhìn lại, đó có lẽ là khoản đầu tư một giờ mỗi ngày hữu ích nhất tôi từng bỏ ra, vì gần '
          + 'như mọi việc tôi làm bây giờ đều cần bàn phím.',
        why:
          'Bài yếu không sai ngữ pháp câu nào — nó chỉ NGẮN (khoảng 40 giây) và NÔNG. Bài đạt hơn ở bốn chỗ: '
          + '(1) chọn kỹ năng CỤ THỂ (gõ mười ngón) thay vì chung chung (nấu ăn); (2) có con số thật — mười phút, '
          + 'mười lăm từ/phút, hai nghìn từ, ba tiếng; (3) có một câu chuyện riêng kéo dài 30 giây; (4) trả lời '
          + 'đủ CẢ BỐN gạch đầu dòng của đề. Chi tiết cụ thể vừa ăn điểm từ vựng vừa giúp bạn không bí giữa chừng.',
      },
    ],
  },
  {
    id: 's2sp2',
    part: 'Part 2',
    title: 'Describe a change in your area',
    titleVi: 'Tả một thay đổi ở nơi bạn sống',
    phrases: [
      { en: 'The change I want to describe is…', vi: 'Thay đổi tôi muốn tả là…' },
      { en: 'It happened about three years ago.', vi: 'Nó xảy ra khoảng ba năm trước.' },
      { en: 'Before that, …', vi: 'Trước đó,…' },
      { en: 'The main difference now is that…', vi: 'Khác biệt chính bây giờ là…' },
      { en: 'Not everyone was happy about it, though.', vi: 'Tuy vậy không phải ai cũng vui với chuyện đó.' },
      { en: 'On the whole, I think it was a change for the better.', vi: 'Nhìn chung tôi nghĩ đó là thay đổi theo hướng tốt.' },
    ],
    questions: [
      {
        q: 'Describe a change that has taken place in the area where you live. You should say: what the change was, when it happened, how people reacted, and explain whether you think it was a good change. (Nói 2 phút)',
        qVi:
          'Tả một thay đổi ở khu bạn sống: thay đổi gì, xảy ra khi nào, mọi người phản ứng ra sao, và bạn nghĩ '
          + 'đó là thay đổi tốt hay không.',
        weak:
          'In my area they built a new shopping mall. It happened two years ago. People like it very much '
          + 'because they can buy many things. I think it is a good change because it is convenient.',
        good:
          'The change I want to describe is the pedestrianisation of the street where I grew up — cars were '
          + 'banned from it completely.\n\n'
          + 'It happened about three years ago. Before that, it was a fairly narrow road with parking on both '
          + 'sides, and walking there with a bicycle was genuinely unpleasant. The council removed the parking, '
          + 'widened the pavements and planted about twenty trees along the middle.\n\n'
          + 'Reactions were mixed at first. The shopkeepers were the most worried — several of them signed a '
          + 'petition against it, because they assumed customers would stop coming if they could not park '
          + 'outside. A few residents complained about deliveries.\n\n'
          + 'What actually happened surprised most people. Two cafés put tables outside, foot traffic went up '
          + 'noticeably, and I am told that the shops that opposed it most loudly now do better than before.\n\n'
          + 'On the whole I think it was a clear improvement, although I would add that it worked partly because '
          + 'there is a car park two minutes away. The same change on a street without that would probably have '
          + 'failed.',
        goodVi:
          'Thay đổi tôi muốn tả là việc biến con phố tôi lớn lên thành phố đi bộ — ô tô bị cấm hoàn toàn. Chuyện '
          + 'xảy ra khoảng ba năm trước. Trước đó nó là con đường khá hẹp có chỗ đỗ xe hai bên, và đi bộ ở đó cùng '
          + 'chiếc xe đạp thật sự khó chịu. Hội đồng thành phố bỏ chỗ đỗ xe, mở rộng vỉa hè và trồng khoảng hai '
          + 'mươi cây dọc giữa phố. Ban đầu phản ứng trái chiều. Các chủ cửa hàng lo nhất — vài người ký đơn phản '
          + 'đối, vì cho rằng khách sẽ không tới nữa nếu không đỗ xe được ngay trước cửa. Vài cư dân phàn nàn về '
          + 'việc giao hàng. Điều thật sự xảy ra làm phần lớn mọi người bất ngờ. Hai quán cà phê kê bàn ra ngoài, '
          + 'lượng người đi bộ tăng rõ rệt, và tôi nghe nói những cửa hàng phản đối to nhất giờ làm ăn tốt hơn '
          + 'trước. Nhìn chung tôi cho rằng đó là cải thiện rõ ràng, dù tôi phải nói thêm là nó thành công một '
          + 'phần vì có bãi đỗ xe cách đó hai phút. Cùng thay đổi đó ở con phố không có bãi xe thì có lẽ đã thất bại.',
        why:
          'Hai điểm nâng bài này lên. Thứ nhất, có XUNG ĐỘT: người phản đối, lý do họ phản đối, rồi kết quả thật '
          + 'khác dự đoán. Câu chuyện có mâu thuẫn thì tự nó dài ra mà không phải cố. Thứ hai, câu cuối nêu ĐIỀU '
          + 'KIỆN ("nó thành công một phần vì có bãi đỗ xe gần đó") — cách nói có mức độ này chính là thứ phân '
          + 'biệt band 6.5 với band 5.5.',
      },
    ],
  },

  /* ─────────────── PART 3 ─────────────── */
  {
    id: 's2sp3',
    part: 'Part 3',
    title: 'Work and technology',
    titleVi: 'Công việc và công nghệ',
    phrases: [
      { en: 'It depends largely on…', vi: 'Cái đó phụ thuộc nhiều vào…' },
      { en: 'In the past… whereas nowadays…', vi: 'Trước đây… trong khi ngày nay…' },
      { en: 'That said, there is a downside.', vi: 'Dù vậy, cũng có mặt trái.' },
      { en: 'I would say the main effect has been…', vi: 'Tôi cho rằng tác động chính là…' },
      { en: 'It is hard to generalise, but…', vi: 'Khó nói chung được, nhưng…' },
    ],
    questions: [
      {
        q: 'Do you think technology has made people work more or less?',
        qVi: 'Bạn nghĩ công nghệ khiến người ta làm việc nhiều hơn hay ít hơn?',
        weak: 'I think less, because technology helps us do things faster.',
        good:
          'It depends largely on the type of work. In manufacturing, machines have clearly reduced the number of '
          + 'hours a person needs to spend, and quite a few factory jobs have disappeared altogether. In office '
          + 'work, though, I would say the effect has been the opposite. Because email and messaging follow '
          + 'people home, the working day has effectively become longer, even if it does not appear so on paper. '
          + 'So technology has cut physical labour but expanded mental availability, which is not quite the same '
          + 'thing as working less.',
        goodVi:
          'Cái đó phụ thuộc nhiều vào loại công việc. Trong sản xuất, máy móc rõ ràng đã giảm số giờ một người '
          + 'phải bỏ ra, và khá nhiều việc làm trong nhà máy đã biến mất hẳn. Nhưng với công việc văn phòng, tôi '
          + 'cho rằng tác động lại ngược lại. Vì email và tin nhắn theo người ta về tận nhà, ngày làm việc thực tế '
          + 'đã dài ra, dù trên giấy tờ thì không. Vậy nên công nghệ cắt giảm lao động chân tay nhưng mở rộng thời '
          + 'gian phải sẵn sàng về đầu óc — không hẳn giống với việc làm ít đi.',
        why:
          'Câu cụt đúng ngữ pháp nhưng chỉ một dòng, giám khảo không có gì để chấm. Câu đủ dùng ba kỹ thuật mở '
          + 'rộng của bài 20: nêu hai phía (sản xuất vs văn phòng), cho ví dụ cụ thể (email theo về nhà), và nêu '
          + 'hệ quả ở câu cuối. Mở đầu bằng "It depends" vừa mua thời gian vừa dẫn tự nhiên sang việc so sánh.',
      },
      {
        q: 'Should governments control how much people work?',
        qVi: 'Chính phủ có nên kiểm soát thời gian làm việc của người dân không?',
        weak: 'Yes, I think so. It is good for health.',
        good:
          'To some extent, yes. There is a reasonable argument that individuals cannot really negotiate on equal '
          + 'terms with a large employer, so a legal limit protects the people with the least bargaining power. '
          + 'Most countries already accept this in principle — they set a maximum working week and require paid '
          + 'leave. That said, I would be cautious about going much further, because rules that are too rigid '
          + 'tend to push work into the informal economy, where there is no protection at all. So I would favour '
          + 'a clear minimum standard rather than detailed control.',
        goodVi:
          'Ở một mức độ nào đó thì có. Có một lập luận hợp lý là cá nhân không thể thương lượng ngang bằng với '
          + 'một chủ lao động lớn, nên giới hạn pháp lý bảo vệ những người có ít vị thế mặc cả nhất. Phần lớn các '
          + 'nước đã chấp nhận điều này trên nguyên tắc — họ đặt số giờ làm tối đa mỗi tuần và yêu cầu nghỉ có '
          + 'lương. Dù vậy, tôi sẽ thận trọng với việc đi xa hơn nhiều, vì quy định quá cứng thường đẩy công việc '
          + 'sang khu vực phi chính thức, nơi chẳng có bảo vệ nào cả. Nên tôi nghiêng về một chuẩn tối thiểu rõ '
          + 'ràng hơn là kiểm soát chi tiết.',
        why:
          'Điểm mạnh nhất là nói CÓ MỨC ĐỘ: "to some extent", "I would be cautious about going much further". '
          + 'Cách nói giảm nhẹ (hedging) này ăn điểm ở cả Speaking lẫn Writing — nó cho thấy bạn nhận ra vấn đề '
          + 'có nhiều mặt, thay vì trả lời tuyệt đối.',
      },
      {
        q: 'Will offices still exist in fifty years?',
        qVi: 'Năm mươi năm nữa văn phòng có còn tồn tại không?',
        weak: 'I think yes, offices will still exist.',
        good:
          'It is hard to predict that far ahead, but my guess is that they will exist, just in a different form. '
          + 'The reason people went to an office was originally practical — that is where the files and the '
          + 'telephone were. That reason has gone. What has not gone is the social function: people still seem to '
          + 'need somewhere to meet, and new employees in particular learn a great deal simply by being near '
          + 'experienced colleagues. So I would expect offices to become smaller and to be used for collaboration '
          + 'rather than for routine work.',
        goodVi:
          'Khó dự đoán xa đến vậy, nhưng tôi đoán là chúng sẽ còn, chỉ ở dạng khác. Lý do người ta tới văn phòng '
          + 'ban đầu là thực tế — đó là nơi có hồ sơ và điện thoại. Lý do đó đã mất. Thứ chưa mất là chức năng xã '
          + 'hội: người ta vẫn có vẻ cần một nơi để gặp nhau, và nhân viên mới đặc biệt học được rất nhiều chỉ nhờ '
          + 'ở gần đồng nghiệp có kinh nghiệm. Nên tôi cho rằng văn phòng sẽ nhỏ đi và được dùng để hợp tác thay '
          + 'vì làm việc thường ngày.',
        why:
          'Câu hỏi dự đoán tương lai rất dễ bí. Mẹo ở đây: thay vì đoán bừa, hãy phân tích LÝ DO trong quá khứ '
          + 'rồi xem lý do đó còn không. Cách này luôn cho bạn ít nhất bốn câu để nói, dù bạn chưa từng nghĩ về '
          + 'chủ đề đó.',
      },
    ],
  },
  {
    id: 's2sp4',
    part: 'Part 3',
    title: 'Education and society',
    titleVi: 'Giáo dục và xã hội',
    phrases: [
      { en: 'On the one hand… on the other hand…', vi: 'Một mặt… mặt khác…' },
      { en: 'A good example would be…', vi: 'Một ví dụ hay sẽ là…' },
      { en: 'This is partly because…', vi: 'Điều này một phần là vì…' },
      { en: 'I am not entirely convinced that…', vi: 'Tôi không hoàn toàn tin rằng…' },
      { en: 'It varies from country to country.', vi: 'Chuyện đó khác nhau tuỳ nước.' },
    ],
    questions: [
      {
        q: 'Is it better to learn in a group or alone?',
        qVi: 'Học nhóm hay học một mình tốt hơn?',
        weak: 'I think group is better because you can ask your friends.',
        good:
          'On the one hand, groups are useful for anything that involves discussion — explaining an idea to '
          + 'someone else is one of the fastest ways to find out whether you actually understand it. On the other '
          + 'hand, for memorising material or working through problems, I think alone is more efficient, simply '
          + 'because you can go at your own pace without waiting. So I would say the right answer depends on the '
          + 'task rather than on the person, and most students probably need both.',
        goodVi:
          'Một mặt, học nhóm hữu ích cho những gì cần thảo luận — giải thích một ý cho người khác là cách nhanh '
          + 'nhất để biết mình có thật sự hiểu hay không. Mặt khác, với việc ghi nhớ hoặc làm bài tập, tôi nghĩ '
          + 'học một mình hiệu quả hơn, đơn giản vì bạn đi theo nhịp của mình mà không phải chờ ai. Nên tôi cho '
          + 'rằng câu trả lời đúng phụ thuộc vào loại công việc chứ không phải vào con người, và phần lớn sinh '
          + 'viên có lẽ cần cả hai.',
        why:
          'Dùng đúng khuôn "On the one hand… on the other hand…" rồi kết bằng một câu chốt có điều kiện. Chú ý '
          + 'câu chốt KHÔNG né tránh — nó nói rõ điều gì quyết định (loại công việc), chứ không phải "cả hai đều tốt".',
      },
      {
        q: 'Should schools teach subjects that are not related to jobs?',
        qVi: 'Trường học có nên dạy những môn không liên quan tới nghề nghiệp không?',
        weak: 'Yes, because students need general knowledge.',
        good:
          'I would argue yes, for two reasons. First, we are quite bad at predicting which subjects will turn '
          + 'out to be useful — a lot of people end up working in fields that did not exist when they were at '
          + 'school, so a narrow education is a risk rather than a safe choice. Second, subjects like history and '
          + 'music teach ways of thinking rather than facts, and those transfer. That said, I am not entirely '
          + 'convinced by the version of this argument that treats employability as unimportant. Schools do have '
          + 'a duty to make sure students can find work.',
        goodVi:
          'Tôi cho rằng có, vì hai lý do. Thứ nhất, chúng ta khá dở trong việc dự đoán môn nào rồi sẽ hữu ích — '
          + 'rất nhiều người kết thúc ở những ngành chưa tồn tại khi họ còn đi học, nên học hẹp là một rủi ro chứ '
          + 'không phải lựa chọn an toàn. Thứ hai, các môn như lịch sử và âm nhạc dạy CÁCH NGHĨ chứ không dạy sự '
          + 'kiện, và cách nghĩ thì chuyển được sang việc khác. Dù vậy, tôi không hoàn toàn tin vào phiên bản lập '
          + 'luận coi khả năng có việc làm là không quan trọng. Nhà trường có trách nhiệm bảo đảm học sinh tìm '
          + 'được việc.',
        why:
          'Cấu trúc "for two reasons. First… Second…" giúp bạn không bí giữa chừng vì đã tự hứa sẽ nói hai ý. Câu '
          + 'cuối tự phản biện chính mình ("I am not entirely convinced by…") — đây là dấu hiệu tư duy sắc, ăn điểm '
          + 'rõ ở Part 3.',
      },
      {
        q: 'How has education changed compared with your parents’ generation?',
        qVi: 'Giáo dục đã thay đổi thế nào so với thế hệ bố mẹ bạn?',
        weak: 'Now we have computers and the internet, so it is easier.',
        good:
          'The most obvious difference is access to information. In my parents’ time, if you wanted to check '
          + 'something you had to find a library, whereas now the difficulty is the opposite — there is too much '
          + 'material and the skill is deciding what to trust. A second change is that education has become far '
          + 'more competitive: my mother could get a stable job with a school certificate, which would be almost '
          + 'impossible today. I am not sure the teaching itself has changed as much as people assume, though. '
          + 'From what she describes, a lot of classrooms still work in much the same way.',
        goodVi:
          'Khác biệt rõ nhất là khả năng tiếp cận thông tin. Thời bố mẹ tôi, muốn tra cứu gì thì phải tìm tới thư '
          + 'viện, trong khi bây giờ khó khăn lại ngược lại — có quá nhiều tài liệu và kỹ năng cần có là quyết '
          + 'định tin cái nào. Thay đổi thứ hai là giáo dục đã cạnh tranh hơn nhiều: mẹ tôi có thể có việc ổn định '
          + 'với bằng phổ thông, điều gần như bất khả ngày nay. Dù vậy tôi không chắc bản thân việc dạy đã thay '
          + 'đổi nhiều như người ta tưởng. Theo những gì mẹ tôi kể, nhiều lớp học vẫn vận hành khá giống trước.',
        why:
          'Dùng khuôn so sánh quá khứ – hiện tại (cách mở rộng số 2 ở bài 20) và có ví dụ từ gia đình thật. Câu '
          + 'cuối lại tự phản biện — không đồng ý hoàn toàn với chính tiền đề của câu hỏi. Đây là cách trả lời '
          + 'khiến giám khảo thấy bạn đang NGHĨ chứ không đọc bài học thuộc.',
      },
    ],
  },
];

/** Quy tắc riêng cho chặng 2, bổ sung cho bốn quy tắc đã học ở chặng 1. */
export const SPEAKING_RULES2: { title: string; body: string }[] = [
  {
    title: 'Part 2: dùng 1 phút chuẩn bị để ghi TỪ KHOÁ, không viết câu',
    body:
      'Viết câu hoàn chỉnh thì lúc nói bạn sẽ đọc, và giám khảo nghe ra ngay — bị chấm rất thấp ở Fluency. Ghi '
      + '6–8 từ khoá theo bốn gạch đầu dòng của đề, cộng một từ nhắc bạn nhớ câu chuyện cụ thể định kể.',
  },
  {
    title: 'Hết ý là vấn đề lớn hơn sai ngữ pháp',
    body:
      'Ở Part 2, nói 40 giây rồi im bị trừ nặng hơn là nói 2 phút có vài lỗi nhỏ. Hai thứ luôn kéo dài được mà '
      + 'không cần chuẩn bị: một câu chuyện cụ thể ("I remember one occasion when…") và một câu điều kiện ở cuối '
      + '("It worked partly because…, otherwise it would have failed").',
  },
  {
    title: 'Part 3: trả lời CÓ MỨC ĐỘ, đừng tuyệt đối',
    body:
      '"To some extent", "It depends largely on…", "I am not entirely convinced that…" — cách nói giảm nhẹ này '
      + 'cho thấy bạn nhận ra vấn đề nhiều mặt. Trả lời tuyệt đối (luôn luôn, không bao giờ) nghe non và dễ bị '
      + 'giám khảo hỏi ngược lại.',
  },
  {
    title: 'Không biết gì về chủ đề thì phân tích LÝ DO',
    body:
      'Gặp câu hỏi Part 3 về lĩnh vực bạn chưa từng nghĩ tới, đừng đoán bừa. Hỏi: trước đây chuyện này thế nào, '
      + 'vì sao, và lý do đó còn không? Khuôn này luôn cho bạn ít nhất bốn câu, dù bạn không có kiến thức gì về '
      + 'chủ đề. Nội dung không bị chấm đúng sai — chỉ chấm cách bạn nói.',
  },
  {
    title: 'Tự phản biện chính mình là dấu hiệu band cao',
    body:
      'Sau khi nêu quan điểm, thêm một câu kiểu "That said, I am not sure this applies everywhere". Nó cho thấy '
      + 'bạn đang tư duy chứ không đọc bài học thuộc, và tự nhiên kéo dài câu trả lời thêm 15 giây.',
  },
];
