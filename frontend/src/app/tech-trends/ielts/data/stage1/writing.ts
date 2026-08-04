/**
 * Phần VIẾT chặng 1 — 6 đề, đi từ viết câu lên viết bài.
 *
 * Nguyên tắc xếp đề: chặng 1 KHÔNG bắt đầu bằng Task 2 hoàn chỉnh. Bắt người
 * mới viết luận 250 từ khi chưa viết nổi một đoạn đúng ngữ pháp chỉ tạo ra bài
 * dài mà sai đều — và thói quen sai thì càng viết nhiều càng khó sửa.
 *
 * Thứ tự: câu → đoạn → thư (General Task 1, dễ nhất trong các dạng thi thật)
 * → mô tả biểu đồ đơn giản (Academic Task 1) → bài luận rút gọn 150 từ →
 * bài Task 2 đủ 250 từ ở cuối chặng.
 *
 * Mỗi đề đều có bài mẫu ĐẠT và bài mẫu KÉM. Nhìn bài kém rồi đọc phần "vấn đề"
 * là cách nhanh nhất để nhận ra chính lỗi của mình — người học thường không
 * thấy lỗi của mình cho tới khi thấy nó trong bài người khác.
 */
import type { WritingTask } from '../types';

export const WRITINGS: WritingTask[] = [
  /* ─────────────── ĐỀ 1 ─────────────── */
  {
    id: 'w1',
    task: 'Nền tảng',
    title: 'Viết 8 câu đúng về bản thân',
    prompt:
      'Write eight sentences about yourself. Use each of these once: the present simple, the past simple, '
      + 'the present continuous, "there is/there are", a comparative, "because", "who/which", and a future form.',
    promptVi:
      'Viết tám câu về bản thân. Mỗi cấu trúc sau dùng đúng một lần: hiện tại đơn, quá khứ đơn, hiện tại '
      + 'tiếp diễn, there is/there are, so sánh hơn, because, who/which, và một dạng tương lai.',
    minWords: 80,
    minutes: 15,
    outline: [
      { part: 'Câu 1–2', what: 'Hiện tại đơn: nghề nghiệp/việc học và một thói quen. Nhớ -s ngôi thứ ba.' },
      { part: 'Câu 3', what: 'Quá khứ đơn: một việc đã làm tuần trước.' },
      { part: 'Câu 4', what: 'Hiện tại tiếp diễn: việc đang làm giai đoạn này.' },
      { part: 'Câu 5', what: 'There is/There are: tả nơi bạn đang sống hoặc học.' },
      { part: 'Câu 6', what: 'So sánh hơn: so hai thứ bất kỳ trong đời bạn.' },
      { part: 'Câu 7', what: 'Because: một lý do thật.' },
      { part: 'Câu 8', what: 'Who/which + một dạng tương lai (will hoặc be going to).' },
    ],
    phrases: [
      { en: 'At the moment I am …', vi: 'Hiện tại tôi đang…' },
      { en: 'Last week I …', vi: 'Tuần trước tôi…' },
      { en: 'There are three … in my …', vi: 'Có ba… trong…' },
      { en: '… is more difficult than …', vi: '… khó hơn…' },
      { en: 'I chose … because …', vi: 'Tôi chọn… vì…' },
      { en: 'I am going to … next …', vi: 'Tôi sẽ… vào… tới' },
    ],
    sample: {
      band: 'Đạt yêu cầu chặng 1',
      text:
        'I am a second-year student at a university in Da Nang. My sister works in a hospital and she '
        + 'finishes work at six every evening. Last week I visited my grandparents in the countryside. '
        + 'At the moment I am studying for the IELTS test. There are four people in my family and two of '
        + 'them are teachers. Writing is more difficult than reading for me. I want to improve my English '
        + 'because I hope to study abroad. My best friend, who lives in Hanoi, is going to visit me next month.',
      note:
        'Tám câu, tám cấu trúc, không câu nào sai. Chú ý: "she finishes" có -s, "visited" đúng quá khứ, '
        + '"There are four people" hợp số nhiều, "more difficult" đúng vì difficult là tính từ dài.',
    },
    weakSample: {
      band: 'Chưa đạt',
      text:
        'I student at university. My sister work in hospital. Last week I visit my grandparent. I studying '
        + 'IELTS now. In my family have four people. Writing is more difficulter than reading. I want improve '
        + 'my English because so I want study abroad. My best friend he live in Hanoi will visit me.',
      problems: [
        'Câu 1 thiếu động từ to be: "I student" → "I am a student". Thiếu cả mạo từ "a".',
        'Câu 2 quên -s ngôi thứ ba: "My sister work" → "works". Thiếu mạo từ: "in a hospital".',
        'Câu 3 không chia quá khứ: "I visit" → "I visited". Thiếu -s số nhiều: "grandparent" → "grandparents".',
        'Câu 4 thiếu trợ động từ: "I studying" → "I am studying".',
        'Câu 5 dịch thẳng từ tiếng Việt: "In my family have" → "There are four people in my family".',
        'Câu 6 dùng đồng thời more và -er: "more difficulter" → "more difficult".',
        'Câu 7 dùng cả because và so trong một câu, và thiếu "to": → "because I want to study abroad".',
        'Câu 8 câu chạy, thừa chủ ngữ: "My best friend he live" → "My best friend, who lives in Hanoi, will visit me".',
      ],
    },
    mistakes: [
      {
        wrong: 'In my family have four people.',
        right: 'There are four people in my family.',
        why: 'Tiếng Việt "trong gia đình tôi CÓ" dịch thẳng thành "have" là câu không có chủ ngữ. Phải dùng There is/There are.',
      },
      {
        wrong: 'I want improve my English.',
        right: 'I want to improve my English.',
        why: 'want luôn đi với "to + động từ" (bài 24 phần Bài học).',
      },
      {
        wrong: 'My friend he lives in Hanoi.',
        right: 'My friend lives in Hanoi. / My friend, who lives in Hanoi, …',
        why: 'Đã có chủ ngữ "My friend" thì không thêm "he". Đây là lỗi lặp chủ ngữ, rất phổ biến.',
      },
    ],
  },

  /* ─────────────── ĐỀ 2 ─────────────── */
  {
    id: 'w2',
    task: 'Nền tảng',
    title: 'Viết một đoạn 100 từ: nơi bạn sống',
    prompt: 'Write one paragraph of about 100 words describing the place where you live.',
    promptVi: 'Viết một đoạn khoảng 100 từ miêu tả nơi bạn đang sống.',
    minWords: 100,
    minutes: 20,
    outline: [
      { part: 'Câu chủ đề', what: 'Nói thẳng ý chính của cả đoạn ngay câu đầu. Ví dụ: "I live in a small flat in the centre of Hue."' },
      { part: 'Triển khai 1', what: 'Mô tả cụ thể: bao nhiêu phòng, ở tầng mấy, có gì. Dùng There is/There are.' },
      { part: 'Triển khai 2', what: 'Khu vực xung quanh: gần cái gì, ồn hay yên. Dùng giới từ nơi chốn.' },
      { part: 'Ví dụ / chi tiết', what: 'Một chi tiết cụ thể làm đoạn văn thật hơn — một quán, một con phố, một thói quen.' },
      { part: 'Câu chốt', what: 'Cảm nghĩ của bạn, kèm lý do bằng "because".' },
    ],
    phrases: [
      { en: 'I live in a … in …', vi: 'Tôi sống trong một… ở…' },
      { en: 'It has two bedrooms and a small kitchen.', vi: 'Nó có hai phòng ngủ và một bếp nhỏ.' },
      { en: 'The building is opposite / next to …', vi: 'Toà nhà đối diện / bên cạnh…' },
      { en: 'It is within walking distance of …', vi: 'Đi bộ tới… được.' },
      { en: 'What I like most is …', vi: 'Điều tôi thích nhất là…' },
      { en: 'The only problem is that …', vi: 'Vấn đề duy nhất là…' },
    ],
    sample: {
      band: 'Đạt yêu cầu chặng 1',
      text:
        'I live in a small flat on the fourth floor of an old building in Hue. The flat has two bedrooms, '
        + 'a kitchen and a narrow balcony where my mother grows herbs. There is a market at the end of our '
        + 'street, so we can buy fresh vegetables every morning. The university is within walking distance, '
        + 'which saves me a lot of money on transport. The only problem is the noise, because the street is '
        + 'busy until late at night. Even so, I like living here because I know all our neighbours and the '
        + 'area feels safe.',
      note:
        '108 từ. Câu đầu là câu chủ đề rõ ràng. Có đủ There is, giới từ nơi chốn, một mệnh đề quan hệ '
        + '("which saves me"), hai lần "because" có lý do thật, và một câu nhượng bộ ("Even so") — đủ đa dạng '
        + 'mà không câu nào gượng.',
    },
    weakSample: {
      band: 'Chưa đạt',
      text:
        'My house is very nice. It is very beautiful. I like it very much. It has many room. The room is '
        + 'very big and very nice. My family have four people. We live happy. Near my house have a market '
        + 'and a school. I love my house very much because it is very nice and beautiful.',
      problems: [
        'Không có câu chủ đề cụ thể — "very nice" không cho người đọc biết gì.',
        'Lặp "very" 7 lần và "nice" 3 lần. Vốn từ nghèo là tiêu chí bị trừ điểm nặng nhất ở đây.',
        'Không có chi tiết cụ thể nào: bao nhiêu phòng thật, ở đâu, tầng mấy.',
        '"many room" thiếu -s số nhiều.',
        '"Near my house have a market" — lại là lỗi dịch thẳng, phải là "There is a market near my house".',
        '"We live happy" — cần trạng từ: "We live happily".',
        'Câu cuối lặp lại y hệt câu đầu, không thêm thông tin gì.',
      ],
    },
    mistakes: [
      {
        wrong: 'My house is very nice and very beautiful.',
        right: 'My flat is small but bright, with a balcony facing the river.',
        why:
          '"nice", "beautiful", "very" là từ rỗng. Thay bằng chi tiết CỤ THỂ — vừa cho thấy vốn từ vừa làm '
          + 'bài đáng đọc.',
      },
      {
        wrong: 'Near my house have a market.',
        right: 'There is a market near my house.',
        why: 'Lỗi "có" dịch thành "have" lặp lại lần nữa. Đây là lỗi số một của người Việt ở band 4.',
      },
      {
        wrong: 'We live happy.',
        right: 'We live happily.',
        why: 'Bổ nghĩa cho động từ "live" phải dùng trạng từ (bài 29).',
      },
    ],
  },

  /* ─────────────── ĐỀ 3 ─────────────── */
  {
    id: 'w3',
    task: 'Task 1 (General)',
    title: 'Viết thư — dạng dễ nhất trong đề thi thật',
    prompt:
      'You have just moved to a new city and started a new course. Write a letter to a friend. In your '
      + 'letter: say where you are living now, describe your course, and invite your friend to visit you. '
      + 'Write at least 150 words. Begin "Dear …".',
    promptVi:
      'Bạn vừa chuyển đến thành phố mới và bắt đầu một khoá học. Viết thư cho một người bạn: nói bạn đang '
      + 'sống ở đâu, tả khoá học, và mời bạn ấy tới chơi. Viết ít nhất 150 từ.',
    minWords: 150,
    minutes: 20,
    outline: [
      { part: 'Chào hỏi', what: '"Dear Minh," + một câu hỏi thăm. KHÔNG viết "Dear friend".' },
      { part: 'Lý do viết', what: '"I am writing to tell you about…" — nói ngay mục đích.' },
      { part: 'Ý 1', what: 'Nơi ở mới: loại nhà, khu vực, một chi tiết cụ thể.' },
      { part: 'Ý 2', what: 'Khoá học: học gì, mấy buổi một tuần, thấy thế nào.' },
      { part: 'Ý 3', what: 'Lời mời: mời cụ thể (khi nào, làm gì cùng nhau), không mời chung chung.' },
      { part: 'Kết', what: '"Write back soon." + "Best wishes," + tên. Thư thân mật thì kết bằng Best wishes / Love.' },
    ],
    phrases: [
      { en: 'How are you? I hope you are well.', vi: 'Bạn khoẻ không? Mong bạn vẫn ổn.' },
      { en: 'I am writing to tell you about …', vi: 'Tôi viết thư này để kể cho bạn về…' },
      { en: 'I have just moved to …', vi: 'Tôi vừa chuyển tới…' },
      { en: 'The course is harder than I expected.', vi: 'Khoá học khó hơn tôi tưởng.' },
      { en: 'Why do not you come and visit me in …?', vi: 'Sao bạn không tới thăm tôi vào…?' },
      { en: 'Let me know if you can come.', vi: 'Cho tôi biết bạn có tới được không nhé.' },
      { en: 'Write back soon. Best wishes, …', vi: 'Sớm hồi âm nhé. Thân mến,…' },
    ],
    sample: {
      band: 'Đạt yêu cầu chặng 1 (đủ 3 ý, ngữ pháp chắc)',
      text:
        'Dear Minh,\n\n'
        + 'How are you? I hope you and your family are well. I am writing to tell you about my new life in Da Nang.\n\n'
        + 'I moved here three weeks ago and I am renting a small flat near the beach. It has one bedroom and '
        + 'a balcony, and there is a good coffee shop downstairs. The rent is higher than in our hometown, '
        + 'but the area is quiet and I can walk to my classes in ten minutes.\n\n'
        + 'My course is in graphic design. We have lessons four days a week, and most of them are practical, '
        + 'so I spend a lot of time drawing on the computer. It is harder than I expected because everything '
        + 'is in English, but the teachers are patient and my classmates are friendly.\n\n'
        + 'Why do not you come and visit me during the summer holiday? We could swim in the morning and I '
        + 'could show you the old town in the evening. There is space for you in my flat.\n\n'
        + 'Let me know if you can come. Write back soon.\n\n'
        + 'Best wishes,\nLan',
      note:
        '196 từ, đủ CẢ BA ý đề yêu cầu (nơi ở, khoá học, lời mời) — thiếu một ý là bị trừ nặng dù viết hay. '
        + 'Giọng văn thân mật đúng với việc viết cho bạn. Có so sánh hơn, mệnh đề because, và lời mời CỤ THỂ '
        + '(mùa hè, bơi buổi sáng, đi phố cổ buổi tối) chứ không phải "come to my house".',
    },
    weakSample: {
      band: 'Chưa đạt',
      text:
        'Dear friend,\n\nI am fine. I move to new city. It is very nice. I study very hard. My course is '
        + 'very good and very interesting. I like it very much. You should come to visit me. It will be very '
        + 'fun.\n\nYour friend.',
      problems: [
        'Quá ngắn — 48 từ trong khi yêu cầu tối thiểu 150. Thiếu số từ bị trừ điểm rất nặng, không cứu được.',
        '"Dear friend" là lỗi: thư thân mật phải có TÊN người nhận.',
        'Không nói nơi ở cụ thể — thiếu hẳn một trong ba ý đề yêu cầu.',
        '"I move" phải là "I have moved" hoặc "I moved".',
        'Lời mời chung chung, không nói khi nào và làm gì.',
        'Kết thư sai quy ước: phải là "Best wishes," rồi xuống dòng ghi tên.',
      ],
    },
    mistakes: [
      {
        wrong: 'Dear friend,',
        right: 'Dear Minh,',
        why: 'Đề nói viết cho MỘT người bạn — phải tự đặt một cái tên. "Dear friend" là dấu hiệu bài học thuộc mẫu.',
      },
      {
        wrong: 'You should come to visit me. It will be very fun.',
        right: 'Why do not you come during the summer holiday? We could visit the old town together.',
        why:
          'Lời mời phải CỤ THỂ: khi nào, làm gì. Lời mời chung chung bị chấm là chưa hoàn thành yêu cầu đề.',
      },
      {
        wrong: 'Viết 90 từ cho đề yêu cầu 150.',
        right: 'Luôn viết dư 10–20 từ so với mức tối thiểu.',
        why:
          'Thiếu số từ là mất điểm chắc chắn. Trước ngày thi, hãy đếm xem 150 từ chữ viết tay của bạn dài '
          + 'bao nhiêu dòng, để trong phòng thi chỉ cần nhìn là biết đã đủ chưa.',
      },
    ],
  },

  /* ─────────────── ĐỀ 4 ─────────────── */
  {
    id: 'w4',
    task: 'Task 1 (Academic)',
    title: 'Mô tả bảng số liệu đơn giản',
    prompt:
      'The table below shows how students at one university travelled to campus in 2015 and 2025.\n\n'
      + '| Means of transport | 2015 | 2025 |\n'
      + '| Motorbike | 62% | 40% |\n'
      + '| Bus | 20% | 27% |\n'
      + '| Bicycle | 8% | 21% |\n'
      + '| Car | 10% | 12% |\n\n'
      + 'Summarise the information by selecting and reporting the main features. Write at least 150 words.',
    promptVi:
      'Bảng dưới đây cho biết sinh viên một trường đại học đi tới trường bằng phương tiện gì vào năm 2015 và '
      + '2025. Tóm tắt thông tin bằng cách chọn và tường thuật các đặc điểm chính. Viết ít nhất 150 từ.',
    minWords: 150,
    minutes: 20,
    outline: [
      { part: 'Câu mở', what: 'Viết lại đề bằng từ của bạn (paraphrase). KHÔNG chép nguyên đề — chép nguyên không được tính vào số từ.' },
      { part: 'Câu tổng quan', what: 'BẮT BUỘC có, bắt đầu bằng "Overall,". Nêu xu hướng lớn nhất, KHÔNG có số liệu ở câu này.' },
      { part: 'Đoạn thân 1', what: 'Nhóm số liệu giảm: xe máy.' },
      { part: 'Đoạn thân 2', what: 'Nhóm số liệu tăng: xe buýt, xe đạp, ô tô.' },
    ],
    phrases: [
      { en: 'The table compares … in 2015 and 2025.', vi: 'Bảng so sánh… vào năm 2015 và 2025.' },
      { en: 'Overall, the most striking change was …', vi: 'Nhìn chung, thay đổi đáng chú ý nhất là…' },
      { en: 'The figure for … fell from 62% to 40%.', vi: 'Con số của… giảm từ 62% xuống 40%.' },
      { en: '… rose sharply, from 8% to 21%.', vi: '… tăng mạnh, từ 8% lên 21%.' },
      { en: '… remained almost unchanged.', vi: '… gần như không đổi.' },
      { en: 'nearly three times as many', vi: 'nhiều gần gấp ba lần' },
      { en: 'whereas', vi: 'trong khi (đối lập)' },
    ],
    sample: {
      band: 'Đạt yêu cầu chặng 1',
      text:
        'The table compares the means of transport used by students at one university to reach the campus '
        + 'in 2015 and in 2025.\n\n'
        + 'Overall, the motorbike remained the most common choice in both years, but it became much less '
        + 'popular, while every other form of transport was used by more students in 2025 than a decade earlier.\n\n'
        + 'In 2015, 62% of students travelled by motorbike, which was more than all the other methods '
        + 'combined. By 2025 this figure had fallen to 40%. Although this was still the highest percentage '
        + 'in the table, the drop of 22 percentage points was by far the largest change.\n\n'
        + 'The three remaining categories all increased. The clearest rise was in cycling, which grew from '
        + '8% to 21%, so nearly three times as many students cycled in 2025. Bus use also rose, from 20% to '
        + '27%. Travel by car changed least, moving from 10% to only 12% over the ten-year period.',
      note:
        '178 từ. Bốn điểm ăn điểm: (1) câu mở viết lại đề bằng từ khác, (2) có câu Overall và KHÔNG kèm số '
        + 'liệu, (3) nhóm số liệu theo XU HƯỚNG (giảm / tăng) chứ không liệt kê từng dòng, (4) có so sánh '
        + '("more than all the other methods combined", "nearly three times as many").',
    },
    weakSample: {
      band: 'Chưa đạt',
      text:
        'The table shows how students at one university travelled to campus in 2015 and 2025. In 2015 '
        + 'motorbike is 62%. In 2025 motorbike is 40%. In 2015 bus is 20%. In 2025 bus is 27%. In 2015 '
        + 'bicycle is 8%. In 2025 bicycle is 21%. In 2015 car is 10%. In 2025 car is 12%. I think students '
        + 'should use bicycle because it is good for health.',
      problems: [
        'Câu mở CHÉP NGUYÊN đề bài — phần chép không được tính vào số từ, nên bài thực tế còn ngắn hơn nữa.',
        'KHÔNG có câu Overall. Thiếu câu tổng quan là bị chặn trần điểm ngay, dù phần còn lại đúng hết.',
        'Chỉ liệt kê từng dòng bảng, không nhóm, không so sánh. Đây là "đọc bảng" chứ không phải "tóm tắt".',
        'Dùng thì hiện tại "is" cho số liệu năm 2015 — phải dùng quá khứ "was".',
        'Câu cuối nêu Ý KIẾN cá nhân. Task 1 tuyệt đối KHÔNG được nêu ý kiến, chỉ mô tả dữ liệu.',
        'Lặp y hệt một cấu trúc câu 8 lần liền.',
      ],
    },
    mistakes: [
      {
        wrong: 'I think students should use bicycles because it is good for health.',
        right: '(Bỏ hẳn câu này khỏi Task 1.)',
        why:
          'Task 1 chỉ tường thuật dữ liệu. Nêu ý kiến, đoán nguyên nhân, hay đề xuất giải pháp đều bị trừ vì '
          + 'lạc yêu cầu. Ý kiến để dành cho Task 2.',
      },
      {
        wrong: 'In 2015 motorbike is 62%.',
        right: 'In 2015, 62% of students travelled by motorbike.',
        why:
          'Hai lỗi: dùng sai thì (số liệu quá khứ phải dùng quá khứ), và viết cụt không thành câu hoàn chỉnh. '
          + 'Luôn viết đủ "…% of students + động từ".',
      },
      {
        wrong: 'Viết lại từng dòng của bảng theo đúng thứ tự.',
        right: 'Nhóm lại: cái nào giảm viết chung một đoạn, cái nào tăng viết chung một đoạn.',
        why:
          'Giám khảo chấm khả năng CHỌN LỌC và nhóm thông tin. Liệt kê máy móc chứng tỏ bạn không nhìn ra xu hướng.',
      },
    ],
  },

  /* ─────────────── ĐỀ 5 ─────────────── */
  {
    id: 'w5',
    task: 'Task 2 (rút gọn)',
    title: 'Bài luận ngắn 150 từ — tập cấu trúc trước, độ dài sau',
    prompt:
      'Some people think that students should study only subjects that will be useful for their future job. '
      + 'Do you agree or disagree? Write about 150 words.',
    promptVi:
      'Một số người cho rằng học sinh chỉ nên học những môn có ích cho công việc tương lai. Bạn đồng ý hay '
      + 'không đồng ý? Viết khoảng 150 từ.',
    minWords: 150,
    minutes: 25,
    outline: [
      { part: 'Mở bài (2 câu)', what: 'Câu 1: viết lại đề bằng từ khác. Câu 2: nêu THẲNG quan điểm của bạn.' },
      { part: 'Thân 1 (3–4 câu)', what: 'Lý do thứ nhất + giải thích + MỘT ví dụ cụ thể.' },
      { part: 'Thân 2 (3–4 câu)', what: 'Lý do thứ hai + giải thích + ví dụ.' },
      { part: 'Kết (1 câu)', what: 'Nhắc lại quan điểm bằng từ khác. Không thêm ý mới.' },
    ],
    phrases: [
      { en: 'It is sometimes argued that …', vi: 'Đôi khi có ý kiến cho rằng…' },
      { en: 'In my opinion, / I partly agree that …', vi: 'Theo tôi, / Tôi đồng ý một phần rằng…' },
      { en: 'The main reason for this is that …', vi: 'Lý do chính là…' },
      { en: 'For example, …', vi: 'Ví dụ,…' },
      { en: 'On the other hand, …', vi: 'Mặt khác,…' },
      { en: 'For these reasons, I believe that …', vi: 'Vì những lý do đó, tôi cho rằng…' },
    ],
    sample: {
      band: 'Đạt yêu cầu chặng 1',
      text:
        'It is sometimes argued that young people should only study subjects which will help them find a '
        + 'job. I partly agree with this idea, but I think it is too narrow.\n\n'
        + 'On the one hand, practical subjects clearly matter. Students spend many years at school, and if '
        + 'they leave without useful skills, they may struggle to find work. For example, a student who '
        + 'learns computer skills at school can start working in an office immediately after graduating.\n\n'
        + 'On the other hand, subjects such as history and music are not useless. They teach young people '
        + 'how to think and how to understand other cultures, which is important in almost every job. In '
        + 'addition, many people change their career several times, so a narrow education can become a '
        + 'problem later.\n\n'
        + 'For these reasons, I believe schools should teach practical subjects, but they should not remove '
        + 'the others.',
      note:
        '156 từ. Điểm mạnh: mở bài nêu quan điểm rõ ngay câu thứ hai; mỗi đoạn thân có đúng một ý chính kèm '
        + 'MỘT ví dụ cụ thể; câu kết nhắc lại quan điểm chứ không thêm ý mới. Ở chặng 1, viết được đúng khung '
        + 'này đã là đạt — ý sâu sắc để dành chặng 3.',
    },
    weakSample: {
      band: 'Chưa đạt',
      text:
        'Nowadays, education is very important in our modern society. Everybody knows that education is '
        + 'very necessary for all people in the world. Some people think students should study only useful '
        + 'subjects but other people think different. In my opinion, I think both sides have their own '
        + 'advantages and disadvantages. Firstly, useful subject is very good. Secondly, other subject is '
        + 'also good. In conclusion, I think education is very important for everybody.',
      problems: [
        'Mở bài toàn câu rỗng: "Nowadays… very important… everybody knows" không mang thông tin nào, mà lại tốn 30 từ.',
        'KHÔNG nêu rõ quan điểm. "Both sides have advantages and disadvantages" là né tránh, đề hỏi đồng ý hay không.',
        'Các đoạn thân chỉ có câu chủ đề mà không giải thích, không ví dụ.',
        '"useful subject is" thiếu -s số nhiều và mạo từ.',
        'Kết bài không nhắc lại quan điểm vì bài chưa từng có quan điểm.',
        'Dưới số từ tối thiểu.',
      ],
    },
    mistakes: [
      {
        wrong: 'Nowadays, education is very important in our modern society.',
        right: 'It is sometimes argued that young people should only study subjects which will help them find a job.',
        why:
          'Câu mở kiểu "Nowadays… very important" là câu rỗng bị dùng mòn, giám khảo nhận ra ngay là câu học '
          + 'thuộc. Mở bài phải viết lại ĐỀ, không nói chuyện chung chung.',
      },
      {
        wrong: 'In my opinion, I think both sides have advantages and disadvantages.',
        right: 'I partly agree with this idea, but I think it is too narrow.',
        why:
          'Hai vấn đề: "In my opinion, I think" là thừa (chọn một), và câu này KHÔNG trả lời câu hỏi. Đề hỏi '
          + 'đồng ý hay không thì phải trả lời rõ ngay mở bài.',
      },
      {
        wrong: 'Firstly, useful subject is very good.',
        right: 'Practical subjects clearly matter, because students who leave school without useful skills may struggle to find work.',
        why:
          'Mỗi ý phải có GIẢI THÍCH và VÍ DỤ. Nêu ý rồi bỏ đó là lỗi bị trừ ở tiêu chí Task Response — lỗi '
          + 'khiến nhiều người kẹt ở 5.5 rất lâu.',
      },
    ],
  },

  /* ─────────────── ĐỀ 6 ─────────────── */
  {
    id: 'w6',
    task: 'Task 2 (đủ độ dài)',
    title: 'Bài luận 250 từ — bài kiểm tra cuối chặng',
    prompt:
      'In many countries, more people are moving from the countryside to large cities. What are the reasons '
      + 'for this? Do the advantages outweigh the disadvantages? Write at least 250 words.',
    promptVi:
      'Ở nhiều nước, ngày càng nhiều người chuyển từ nông thôn ra thành phố lớn. Nguyên nhân là gì? Lợi ích '
      + 'có lớn hơn bất lợi không? Viết ít nhất 250 từ.',
    minWords: 250,
    minutes: 40,
    outline: [
      { part: 'Mở bài', what: '2 câu: viết lại đề + trả lời THẲNG cả hai câu hỏi của đề (có nguyên nhân, và lợi hay hại nhiều hơn).' },
      { part: 'Thân 1', what: 'Nguyên nhân: việc làm và giáo dục. Có ví dụ cụ thể.' },
      { part: 'Thân 2', what: 'Lợi ích: thu nhập cao hơn, dịch vụ tốt hơn.' },
      { part: 'Thân 3', what: 'Bất lợi: giá nhà, tắc đường, ô nhiễm, xa gia đình.' },
      { part: 'Kết bài', what: '1–2 câu: chốt lại lợi hay hại nhiều hơn, không thêm ý mới.' },
    ],
    phrases: [
      { en: 'There are several reasons for this trend.', vi: 'Có vài nguyên nhân cho xu hướng này.' },
      { en: 'The most important factor is …', vi: 'Yếu tố quan trọng nhất là…' },
      { en: 'This is mainly because …', vi: 'Điều này chủ yếu là vì…' },
      { en: 'A further advantage is that …', vi: 'Một lợi ích nữa là…' },
      { en: 'However, this trend also creates problems.', vi: 'Tuy nhiên, xu hướng này cũng tạo ra vấn đề.' },
      { en: 'On balance, I believe that …', vi: 'Cân nhắc tất cả, tôi cho rằng…' },
    ],
    sample: {
      band: 'Đạt yêu cầu chặng 1 (khung đúng, ngữ pháp chắc)',
      text:
        'In many parts of the world, large numbers of people are leaving rural areas and moving to big '
        + 'cities. This essay will explain why this is happening and will argue that, despite some serious '
        + 'problems, the benefits are greater.\n\n'
        + 'The main reason for this movement is work. Farming employs fewer people than it did in the past, '
        + 'because machines now do jobs that once needed many workers. At the same time, factories, offices '
        + 'and hotels are concentrated in cities. A young person in a village may have only two or three '
        + 'possible jobs, whereas the same person in a city can choose from hundreds. Education is a second '
        + 'reason: most universities and training centres are located in urban areas, so students have to '
        + 'move in order to continue studying.\n\n'
        + 'There are clear advantages. Salaries in cities are usually higher, and workers can send money '
        + 'back to their families. Hospitals are better equipped, and children have access to better schools. '
        + 'For many families, moving is the fastest way to improve their standard of living.\n\n'
        + 'However, the disadvantages should not be ignored. Housing in large cities is expensive, so new '
        + 'arrivals often live in small or crowded rooms. Traffic and air pollution damage health, and people '
        + 'who move may see their parents only once or twice a year. Villages also suffer, because they lose '
        + 'their young workers.\n\n'
        + 'On balance, I believe the advantages outweigh the disadvantages, mainly because the opportunities '
        + 'that cities offer can change a family’s future permanently, while problems such as traffic can be '
        + 'reduced by better planning.',
      note:
        '271 từ. Bài trả lời ĐỦ CẢ HAI câu hỏi của đề — đây là điểm nhiều người bỏ sót và mất điểm oan. Mỗi '
        + 'đoạn một ý rõ, có ví dụ cụ thể ("two or three possible jobs, whereas… hundreds"). Câu kết không '
        + 'chỉ chốt mà còn nêu LÝ DO vì sao lợi nhiều hơn hại.',
    },
    weakSample: {
      band: 'Chưa đạt',
      text:
        'Nowadays many people move to city. There are many reasons. Firstly, city have many job. Secondly, '
        + 'city have good school and good hospital. So people want to move. But city also have many problem. '
        + 'For example traffic jam and pollution and expensive house. Many people live in small room. In my '
        + 'hometown, many young people go to Ho Chi Minh City to work in factory. They send money to their '
        + 'family. In conclusion, I think move to city have advantage and disadvantage, so people should '
        + 'think carefully before they decide.',
      problems: [
        'Chỉ 95 từ trên yêu cầu 250 — mất điểm rất nặng, không cách nào bù lại.',
        '"city have" sai chia động từ, lặp 3 lần. Phải là "cities have" hoặc "a city has".',
        '"many job", "many problem", "good school" thiếu -s số nhiều.',
        'KHÔNG trả lời câu hỏi thứ hai của đề (lợi có lớn hơn hại không). Câu kết né tránh bằng "should think carefully".',
        'Không chia đoạn — cả bài là một khối chữ.',
        'Có một ví dụ tốt (Hồ Chí Minh) nhưng đặt lạc chỗ, nằm ở đoạn nói về bất lợi.',
      ],
    },
    mistakes: [
      {
        wrong: 'In conclusion, people should think carefully before they decide.',
        right: 'On balance, I believe the advantages outweigh the disadvantages, mainly because …',
        why:
          'Đề hỏi "Do the advantages outweigh the disadvantages?" — phải TRẢ LỜI. Kết bài né tránh bằng lời '
          + 'khuyên chung chung bị tính là chưa hoàn thành yêu cầu đề.',
      },
      {
        wrong: 'City have many job.',
        right: 'Cities have many jobs. / A city has many jobs.',
        why:
          'Ba lỗi trong bốn từ: thiếu -s ở "cities", sai chia "have/has", thiếu -s ở "jobs". Kiểm bằng bảng '
          + 'soát 8 điểm ở bài 39.',
      },
      {
        wrong: 'Viết cả bài thành một khối chữ liền.',
        right: 'Chia rõ 4–5 đoạn, mỗi đoạn một ý, cách nhau một dòng trống.',
        why:
          'Không chia đoạn là mất điểm Coherence ngay lập tức, kể cả khi nội dung tốt. Giám khảo cần nhìn '
          + 'thấy cấu trúc bài chỉ trong vài giây.',
      },
    ],
  },
];
