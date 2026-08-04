/**
 * Phần NÓI chặng 1 — ngân hàng câu hỏi Part 1 + hai đề Part 2 nhập môn.
 *
 * Cách trình bày cố ý đặt CÂU TRẢ LỜI CỤT cạnh CÂU TRẢ LỜI ĐỦ. Lý do: người
 * mới học gần như luôn trả lời đúng ngữ pháp nhưng quá ngắn, rồi không hiểu
 * vì sao điểm thấp. Nhìn hai câu cạnh nhau thì thấy ngay khoảng cách.
 *
 * Công thức áp cho mọi câu Part 1 ở chặng này: TRẢ LỜI → LÝ DO → VÍ DỤ.
 * Ba vế, khoảng 20–30 từ. Ngắn hơn thì bị chấm là không phát triển được ý;
 * dài hơn ở chặng 1 thường sẽ sai ngữ pháp.
 */
import type { SpeakingTopic } from '../types';

export const SPEAKINGS: SpeakingTopic[] = [
  /* ─────────────── PART 1 ─────────────── */
  {
    id: 'sp1',
    part: 'Part 1',
    title: 'Work and Study',
    titleVi: 'Công việc & học hành',
    phrases: [
      { en: 'I am currently studying …', vi: 'Hiện tôi đang học…' },
      { en: 'The main reason is that …', vi: 'Lý do chính là…' },
      { en: 'For instance, …', vi: 'Ví dụ,…' },
      { en: 'To be honest, …', vi: 'Thành thật mà nói,…' },
      { en: 'It depends on …', vi: 'Cái đó còn tuỳ vào…' },
    ],
    questions: [
      {
        q: 'Do you work or are you a student?',
        qVi: 'Bạn đi làm hay là sinh viên?',
        weak: 'I am a student.',
        good:
          'I am a student. I am in my second year at a university in Da Nang, and I am studying graphic '
          + 'design. I chose it because I have enjoyed drawing since I was a child.',
        goodVi:
          'Tôi là sinh viên. Tôi học năm hai ở một trường đại học tại Đà Nẵng, ngành thiết kế đồ hoạ. Tôi '
          + 'chọn ngành này vì tôi thích vẽ từ nhỏ.',
        why:
          'Câu cụt đúng ngữ pháp nhưng chỉ 4 từ — giám khảo không có gì để chấm. Câu đủ có ba lớp: trả lời → '
          + 'chi tiết (năm mấy, ở đâu, ngành gì) → lý do. Lại dùng được hiện tại hoàn thành ("have enjoyed… since").',
      },
      {
        q: 'Why did you choose that subject?',
        qVi: 'Vì sao bạn chọn ngành đó?',
        weak: 'Because I like it.',
        good:
          'Mainly because it combines art and technology, which suits me. I have always liked drawing, but '
          + 'I also wanted a subject that would help me find a job, and design does both.',
        goodVi:
          'Chủ yếu vì nó kết hợp nghệ thuật và công nghệ, hợp với tôi. Tôi vốn thích vẽ, nhưng tôi cũng muốn '
          + 'một ngành giúp tìm được việc, và thiết kế đáp ứng cả hai.',
        why:
          '"Because I like it" là câu bị dùng nhiều nhất và cho thấy ít nhất. Câu đủ nêu HAI lý do và nối '
          + 'chúng bằng "but also" — cho thấy khả năng lập luận chứ không chỉ khả năng trả lời.',
      },
      {
        q: 'What do you find most difficult about your studies?',
        qVi: 'Bạn thấy điều gì khó nhất khi học?',
        weak: 'English is difficult.',
        good:
          'Probably the fact that most of our materials are in English. I can read them, but it takes me '
          + 'much longer than it takes my classmates, so I often have to study at night.',
        goodVi:
          'Có lẽ là việc phần lớn tài liệu bằng tiếng Anh. Tôi đọc được, nhưng mất nhiều thời gian hơn các '
          + 'bạn, nên tôi thường phải học buổi tối.',
        why:
          'Câu đủ có so sánh ("much longer than"), có kết quả ("so I often…"), và trả lời đúng trọng tâm câu '
          + 'hỏi. Ba yếu tố này là thứ nâng điểm Fluency và Grammar.',
      },
      {
        q: 'Do you prefer studying in the morning or in the evening?',
        qVi: 'Bạn thích học buổi sáng hay buổi tối?',
        weak: 'In the morning.',
        good:
          'Definitely in the morning. My mind is clearer then, so I can concentrate on difficult tasks. In '
          + 'the evening I get tired quickly, so I usually keep easy work like reviewing vocabulary for that time.',
        goodVi:
          'Chắc chắn là buổi sáng. Lúc đó đầu óc tôi minh mẫn hơn nên tập trung vào việc khó được. Buổi tối '
          + 'tôi nhanh mệt, nên thường để dành việc nhẹ như ôn từ vựng cho lúc đó.',
        why:
          'Câu hỏi lựa chọn thì phải chọn RÕ một bên rồi giải thích cả hai. Trả lời "both are good" là mất '
          + 'cơ hội nói và bị chấm là né tránh.',
      },
      {
        q: 'What would you like to do after you graduate?',
        qVi: 'Sau khi tốt nghiệp bạn muốn làm gì?',
        weak: 'I want to get a good job.',
        good:
          'I would like to work for a design studio for a few years to gain experience. After that, I hope '
          + 'to work as a freelancer, because I would have more control over the projects I take.',
        goodVi:
          'Tôi muốn làm cho một studio thiết kế vài năm để lấy kinh nghiệm. Sau đó tôi hy vọng làm tự do, vì '
          + 'như vậy tôi chủ động hơn với các dự án mình nhận.',
        why:
          '"A good job" là câu rỗng. Câu đủ có kế hoạch hai giai đoạn và dùng đúng các cách nói tương lai '
          + 'khác nhau (would like to, hope to, would have) thay vì lặp "will".',
      },
    ],
  },

  {
    id: 'sp2',
    part: 'Part 1',
    title: 'Hometown and Home',
    titleVi: 'Quê nhà & nơi ở',
    phrases: [
      { en: 'I was born and raised in …', vi: 'Tôi sinh ra và lớn lên ở…' },
      { en: 'It is about … kilometres from …', vi: 'Nó cách… khoảng… ki-lô-mét.' },
      { en: 'What I like most about it is …', vi: 'Điều tôi thích nhất ở đó là…' },
      { en: 'The only drawback is …', vi: 'Nhược điểm duy nhất là…' },
    ],
    questions: [
      {
        q: 'Where are you from?',
        qVi: 'Bạn đến từ đâu?',
        weak: 'I am from Hue.',
        good:
          'I am from Hue, a city in central Vietnam. It is quite small compared with Hanoi, but it is famous '
          + 'for its old buildings and its food, so a lot of tourists come every year.',
        goodVi:
          'Tôi đến từ Huế, một thành phố ở miền Trung Việt Nam. Nó khá nhỏ so với Hà Nội, nhưng nổi tiếng về '
          + 'kiến trúc cổ và ẩm thực, nên hằng năm có nhiều khách du lịch.',
        why:
          'Thêm một cụm đồng vị ("a city in central Vietnam") là cách rẻ nhất để câu dài ra mà không sai. '
          + 'Rồi thêm so sánh và lý do là đủ ba lớp.',
      },
      {
        q: 'Do you live in a house or a flat?',
        qVi: 'Bạn sống trong nhà riêng hay căn hộ?',
        weak: 'I live in a house.',
        good:
          'I live in a house with my parents and my younger brother. It has three bedrooms and a small '
          + 'garden at the back, where my mother grows vegetables. It is not modern, but it is comfortable.',
        goodVi:
          'Tôi sống trong một ngôi nhà với bố mẹ và em trai. Nhà có ba phòng ngủ và một mảnh vườn nhỏ phía '
          + 'sau, nơi mẹ tôi trồng rau. Nhà không hiện đại nhưng thoải mái.',
        why:
          'Dùng được mệnh đề quan hệ với "where", có chi tiết cụ thể (ba phòng ngủ, vườn rau) và một câu '
          + 'nhượng bộ ("not modern, but comfortable") — đúng thứ cần cho điểm từ vựng.',
      },
      {
        q: 'What do you like about your neighbourhood?',
        qVi: 'Bạn thích điều gì ở khu bạn sống?',
        weak: 'It is very nice and convenient.',
        good:
          'What I like most is that everything is within walking distance. There is a market at the end of '
          + 'the street, and the bus stop is just opposite our house, so I rarely need a motorbike.',
        goodVi:
          'Điều tôi thích nhất là mọi thứ đều đi bộ tới được. Có một cái chợ ở cuối phố, và điểm dừng xe buýt '
          + 'ngay đối diện nhà tôi, nên tôi hiếm khi cần xe máy.',
        why:
          '"nice and convenient" là hai tính từ rỗng. Câu đủ CHỨNG MINH sự tiện lợi bằng ví dụ cụ thể — đây '
          + 'chính là khác biệt giữa band 4 và band 6 ở tiêu chí từ vựng.',
      },
      {
        q: 'Would you like to move to another city?',
        qVi: 'Bạn có muốn chuyển tới thành phố khác không?',
        weak: 'Yes, I want to move to Ho Chi Minh City.',
        good:
          'Possibly, yes. There are more job opportunities in Ho Chi Minh City, especially in my field. On '
          + 'the other hand, living costs are much higher there, so I would only move if I found a good job first.',
        goodVi:
          'Có thể là có. Ở Thành phố Hồ Chí Minh có nhiều cơ hội việc làm hơn, nhất là trong ngành của tôi. '
          + 'Mặt khác, chi phí sống ở đó cao hơn nhiều, nên tôi chỉ chuyển nếu tìm được việc tốt trước đã.',
        why:
          'Câu đủ nêu được HAI CHIỀU và dùng câu điều kiện ("I would only move if I found…"). Ở chặng 1 chưa '
          + 'cần dùng nhiều câu điều kiện, nhưng học sẵn một câu để dùng đúng chỗ là rất đáng.',
      },
    ],
  },

  {
    id: 'sp3',
    part: 'Part 1',
    title: 'Daily Routine and Free Time',
    titleVi: 'Sinh hoạt hằng ngày & thời gian rảnh',
    phrases: [
      { en: 'On a typical weekday, I …', vi: 'Vào một ngày thường, tôi…' },
      { en: 'I try to … as often as I can.', vi: 'Tôi cố gắng… thường xuyên nhất có thể.' },
      { en: 'It helps me relax after …', vi: 'Nó giúp tôi thư giãn sau khi…' },
      { en: 'I used to …, but now I …', vi: 'Trước đây tôi…, nhưng giờ tôi…' },
    ],
    questions: [
      {
        q: 'What do you usually do at weekends?',
        qVi: 'Cuối tuần bạn thường làm gì?',
        weak: 'I stay at home and sleep.',
        good:
          'It depends. On Saturday I usually meet my friends for coffee, and we sometimes go to the beach '
          + 'if the weather is good. Sunday is quieter — I help my mother with the cooking and finish my '
          + 'homework for the week.',
        goodVi:
          'Còn tuỳ. Thứ Bảy tôi thường gặp bạn bè đi cà phê, và thỉnh thoảng chúng tôi ra biển nếu trời đẹp. '
          + 'Chủ nhật yên tĩnh hơn — tôi phụ mẹ nấu ăn và làm nốt bài tập cho tuần.',
        why:
          '"It depends" là cụm mở bài cực kỳ hữu dụng: nó cho bạn một giây suy nghĩ và tự nhiên dẫn tới việc '
          + 'nói về hai trường hợp — tức là nói được gấp đôi.',
      },
      {
        q: 'Do you have any hobbies?',
        qVi: 'Bạn có sở thích gì không?',
        weak: 'Yes, I like music.',
        good:
          'Yes, I am quite keen on photography. I got my first camera two years ago and now I take photos '
          + 'almost every weekend, mostly of streets and people. It is relaxing because I have to slow down '
          + 'and look carefully.',
        goodVi:
          'Có, tôi khá mê nhiếp ảnh. Tôi có chiếc máy ảnh đầu tiên cách đây hai năm và giờ gần như cuối tuần '
          + 'nào cũng chụp, chủ yếu là phố xá và con người. Nó thư giãn vì tôi phải chậm lại và quan sát kỹ.',
        why:
          'Thay "like" bằng "be keen on" là nâng từ vựng ngay. Câu đủ còn có mốc thời gian, tần suất, và lý '
          + 'do — ba thứ luôn dùng được cho bất kỳ câu hỏi sở thích nào.',
      },
      {
        q: 'How do you usually get to school or work?',
        qVi: 'Bạn thường tới trường hoặc chỗ làm bằng gì?',
        weak: 'By motorbike.',
        good:
          'Usually by motorbike, because it only takes about fifteen minutes. When it rains heavily, I take '
          + 'the bus instead, although it is much slower and I have to leave home earlier.',
        goodVi:
          'Thường bằng xe máy, vì chỉ mất khoảng mười lăm phút. Khi mưa to thì tôi đi xe buýt, dù chậm hơn '
          + 'nhiều và phải ra khỏi nhà sớm hơn.',
        why:
          'Nêu thêm một TRƯỜNG HỢP KHÁC ("when it rains") là mẹo đơn giản nhất để kéo dài câu trả lời một '
          + 'cách tự nhiên, đồng thời dùng thêm được mệnh đề thời gian và câu nhượng bộ.',
      },
      {
        q: 'Do you think you have enough free time?',
        qVi: 'Bạn có thấy mình đủ thời gian rảnh không?',
        weak: 'No, I am very busy.',
        good:
          'Not really, no. Between classes and my part-time job, I only have a few hours free each day. I '
          + 'used to play badminton twice a week, but I had to give it up last semester, which I regret.',
        goodVi:
          'Thật ra là không. Giữa việc học và việc làm thêm, mỗi ngày tôi chỉ có vài tiếng rảnh. Trước đây '
          + 'tôi chơi cầu lông hai lần một tuần, nhưng học kỳ trước phải bỏ, điều đó tôi thấy tiếc.',
        why:
          '"used to" là cấu trúc ăn điểm và rất dễ dùng: so sánh trước đây với bây giờ. Ở chặng 1, học một '
          + 'câu "used to" dùng được cho hàng chục đề khác nhau.',
      },
    ],
  },

  /* ─────────────── PART 2 ─────────────── */
  {
    id: 'sp4',
    part: 'Part 2',
    title: 'Describe a person you admire',
    titleVi: 'Tả một người bạn ngưỡng mộ',
    phrases: [
      { en: 'I would like to talk about …', vi: 'Tôi muốn nói về…' },
      { en: 'The main reason I admire … is that …', vi: 'Lý do chính tôi ngưỡng mộ… là…' },
      { en: 'I remember one occasion when …', vi: 'Tôi nhớ có lần…' },
      { en: 'Because of this, I have learned to …', vi: 'Nhờ vậy, tôi đã học được cách…' },
    ],
    questions: [
      {
        q: 'Describe a person you admire. You should say: who this person is, how you know them, what they are like, and explain why you admire them. (Nói 1–2 phút)',
        qVi:
          'Tả một người bạn ngưỡng mộ: người đó là ai, bạn biết họ thế nào, họ ra sao, và vì sao bạn ngưỡng '
          + 'mộ họ. Ở chặng 1, đạt 1 phút liên tục là đủ; 2 phút để dành chặng sau.',
        weak:
          'I want to talk about my mother. She is very kind. She is very good. She works very hard. I love '
          + 'her very much. That is all.',
        good:
          'I would like to talk about my grandmother, who lives in a village near Hue. I have known her all '
          + 'my life, and I stayed with her every summer when I was a child.\n\n'
          + 'She is a small, quiet woman in her seventies. She is far more patient than anyone else in my '
          + 'family — I have never seen her get angry, even when we were noisy.\n\n'
          + 'The main reason I admire her is that she raised five children on her own after my grandfather '
          + 'died. She had very little money, but all five of them finished school. I remember one occasion '
          + 'when she walked six kilometres to the market because she wanted to save the bus fare.\n\n'
          + 'Because of this, I have learned to complain less about small problems.',
        goodVi:
          'Tôi muốn nói về bà tôi, người sống ở một làng gần Huế. Tôi biết bà từ khi sinh ra, và hồi bé hè '
          + 'nào tôi cũng ở với bà. Bà là một người phụ nữ nhỏ nhắn, trầm tính, ngoài bảy mươi. Bà kiên nhẫn '
          + 'hơn bất kỳ ai trong nhà — tôi chưa từng thấy bà nổi giận, kể cả khi chúng tôi ồn ào. Lý do chính '
          + 'tôi ngưỡng mộ bà là bà một mình nuôi năm người con sau khi ông mất. Bà rất ít tiền, nhưng cả năm '
          + 'người đều học hết phổ thông. Tôi nhớ có lần bà đi bộ sáu ki-lô-mét ra chợ vì muốn tiết kiệm tiền '
          + 'xe buýt. Nhờ vậy, tôi học được cách bớt than phiền về những chuyện nhỏ.',
        why:
          'Ba khác biệt quyết định. (1) Bài kém dùng toàn "very + tính từ rỗng"; bài đạt dùng tính từ cụ thể '
          + 'và một câu so sánh. (2) Bài đạt trả lời ĐỦ bốn gạch đầu dòng của đề — thiếu một gạch là mất điểm. '
          + '(3) Bài đạt có MỘT CÂU CHUYỆN CỤ THỂ (đi bộ sáu ki-lô-mét). Chi tiết cụ thể là thứ nâng điểm '
          + 'nhanh nhất ở Part 2, vì nó vừa cho thấy vốn từ vừa giúp bạn nói tiếp mà không bí.',
      },
    ],
  },

  {
    id: 'sp5',
    part: 'Part 2',
    title: 'Describe a place you like to go',
    titleVi: 'Tả một nơi bạn thích đến',
    phrases: [
      { en: 'The place I want to describe is …', vi: 'Nơi tôi muốn tả là…' },
      { en: 'It is located about … from my house.', vi: 'Nó nằm cách nhà tôi khoảng…' },
      { en: 'I usually go there when …', vi: 'Tôi thường tới đó khi…' },
      { en: 'What makes it special is …', vi: 'Điều làm nó đặc biệt là…' },
    ],
    questions: [
      {
        q: 'Describe a place you like to go in your free time. You should say: where it is, how often you go there, what you do there, and explain why you like it. (Nói 1–2 phút)',
        qVi: 'Tả một nơi bạn thích đến lúc rảnh: ở đâu, bao lâu đi một lần, làm gì ở đó, và vì sao thích.',
        weak:
          'I like to go to the coffee shop. It is very nice. I go there with my friends. We drink coffee '
          + 'and talk. It is very fun. I like it very much.',
        good:
          'The place I want to describe is a small café by the river, about ten minutes from my house on foot.\n\n'
          + 'I go there two or three times a week, usually in the late afternoon when it is not too hot. It '
          + 'is on the first floor, so you can sit by the window and watch the boats going past.\n\n'
          + 'I normally take my laptop and work there for a couple of hours. The wifi is fast and, unlike '
          + 'the cafés near my university, it is never crowded, so I can concentrate. Sometimes I meet a '
          + 'friend there instead and we just talk.\n\n'
          + 'What makes it special is the atmosphere. It is quiet, the staff know me now, and the coffee is '
          + 'cheaper than in the city centre. It has become the place I go when I need to think.',
        goodVi:
          'Nơi tôi muốn tả là một quán cà phê nhỏ bên sông, cách nhà tôi khoảng mười phút đi bộ. Tôi tới đó '
          + 'hai ba lần mỗi tuần, thường vào cuối buổi chiều khi trời không quá nóng. Quán ở tầng hai nên có '
          + 'thể ngồi cạnh cửa sổ ngắm thuyền đi qua. Tôi thường mang laptop tới làm việc chừng hai tiếng. '
          + 'Wifi nhanh và, khác với các quán gần trường tôi, quán không bao giờ đông nên tôi tập trung được. '
          + 'Đôi khi tôi hẹn bạn ở đó và chỉ ngồi nói chuyện. Điều làm nó đặc biệt là không khí. Quán yên '
          + 'tĩnh, nhân viên giờ đã quen mặt tôi, và cà phê rẻ hơn ở trung tâm. Nó thành nơi tôi tới mỗi khi '
          + 'cần suy nghĩ.',
        why:
          'Bài đạt trả lời đủ bốn gạch đầu dòng, và quan trọng hơn: mọi câu đều CỤ THỂ. "Ten minutes on foot", '
          + '"two or three times a week", "by the window", "the staff know me now" — không câu nào có thể áp '
          + 'cho một quán bất kỳ. Bài kém thì mọi câu đều đúng với mọi quán cà phê trên đời, nên không cho '
          + 'thấy vốn từ nào.',
      },
    ],
  },
];

/** Bốn quy tắc dùng chung cho mọi câu trả lời ở chặng này. */
export const SPEAKING_RULES: { title: string; body: string }[] = [
  {
    title: 'Công thức ba lớp: TRẢ LỜI → LÝ DO → VÍ DỤ',
    body:
      'Trả lời thẳng câu hỏi trước (đừng vòng vo), rồi thêm một câu lý do, rồi một chi tiết cụ thể. Khoảng '
      + '20–30 từ là vừa cho Part 1. Chỉ cần thuộc công thức này là đã thoát khỏi kiểu trả lời một câu cụt lủn.',
  },
  {
    title: 'Được phép nói "It depends"',
    body:
      'Khi chưa nghĩ ra ngay, mở đầu bằng "It depends…", "That is an interesting question…" hoặc "Well, let '
      + 'me think…". Vừa có thêm hai giây suy nghĩ, vừa nghe tự nhiên. Im lặng mới là thứ bị trừ điểm, không '
      + 'phải các cụm câu giờ này.',
  },
  {
    title: 'Chi tiết cụ thể ăn điểm hơn từ hoa mỹ',
    body:
      '"My grandmother walked six kilometres to save the bus fare" ăn điểm hơn hẳn "My grandmother is a very '
      + 'wonderful person". Ở chặng 1 đừng cố dùng từ khó — hãy nói ra CHI TIẾT THẬT. Chi tiết thật vừa dễ '
      + 'nói vừa giúp bạn không bí giữa chừng.',
  },
  {
    title: 'Thu âm mỗi ngày, nghe lại chính mình',
    body:
      'Đây là việc người học ghét nhất và cũng hiệu quả nhất. Nghe lại và đếm ba thứ: số lần dừng quá 3 giây, '
      + 'số lần dùng "I think", số lần nói "very". Chỉ cần giảm ba con số đó là bài nói khác hẳn, không cần '
      + 'học thêm từ nào.',
  },
];
