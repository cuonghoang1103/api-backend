/**
 * Bài viết chặng 2 — 4 đề đủ độ dài thi thật.
 *
 * Khác chặng 1 ở chỗ bài mẫu KÉM không còn là bài sai ngữ pháp be bét, mà là
 * bài band 5.0–5.5: câu đúng hết nhưng vẫn không lên được điểm. Đây mới đúng
 * là tình trạng của người ở chặng 2 — họ viết không sai, nhưng thiếu câu tổng
 * quan, thiếu ví dụ, lặp từ, hoặc không trả lời đủ vế của đề.
 *
 * Mỗi đề vì thế có hai bài mẫu để đối chiếu: một bài 5.0–5.5 và một bài 6.5.
 * Nhìn hai bài cạnh nhau thấy rõ khoảng cách hơn là đọc mô tả tiêu chí.
 */
import type { WritingTask } from '../types';

export const WRITINGS2: WritingTask[] = [
  /* ─────────────── ĐỀ 1: Task 1 line graph ─────────────── */
  {
    id: 's2w1',
    task: 'Task 1 (Academic)',
    title: 'Biểu đồ đường — số người dùng ba phương tiện',
    figure: {
      kind: 'line',
      title: 'Number of people using three types of transport, 1990–2020',
      note: 'Số liệu tự đặt cho bài luyện. Đơn vị: triệu người.',
      unit: 'triệu người',
      categories: ['1990', '2000', '2010', '2020'],
      series: [
        { name: 'Bus', values: [12, 9.5, 7, 6.5] },
        { name: 'Train', values: [4, 5, 7.5, 11] },
        { name: 'Private car', values: [8, 14, 19, 18] },
      ],
    },
    prompt:
      'The line graph below shows the number of people (in millions) using three types of transport in one '
      + 'country between 1990 and 2020.\n\n'
      + '| Năm | Xe buýt | Tàu | Ô tô riêng |\n'
      + '| 1990 | 12.0 | 4.0 | 8.0 |\n'
      + '| 2000 | 9.5 | 5.0 | 14.0 |\n'
      + '| 2010 | 7.0 | 7.5 | 19.0 |\n'
      + '| 2020 | 6.5 | 11.0 | 18.0 |\n\n'
      + 'Summarise the information by selecting and reporting the main features, and make comparisons where '
      + 'relevant. Write at least 150 words.',
    promptVi:
      'Biểu đồ đường cho biết số người (triệu) sử dụng ba loại phương tiện ở một quốc gia trong giai đoạn '
      + '1990–2020. Tóm tắt thông tin bằng cách chọn và tường thuật các đặc điểm chính, có so sánh khi cần.',
    minWords: 150,
    minutes: 20,
    outline: [
      { part: 'Câu mở', what: 'Viết lại đề bằng từ khác. Không chép nguyên — phần chép không tính vào số từ.' },
      { part: 'Câu tổng quan', what: 'BẮT BUỘC. "Overall," + xu hướng lớn nhất, TUYỆT ĐỐI không có số liệu.' },
      { part: 'Đoạn thân 1', what: 'Nhóm đi xuống: xe buýt. Nêu số đầu, số cuối, mức thay đổi.' },
      { part: 'Đoạn thân 2', what: 'Nhóm đi lên: tàu và ô tô. Chú ý ô tô có ĐỔI CHIỀU sau 2010 — phải nêu.' },
    ],
    phrases: [
      { en: 'The line graph illustrates…', vi: 'Biểu đồ đường minh hoạ…' },
      { en: 'Overall, the most striking trend was…', vi: 'Nhìn chung, xu hướng nổi bật nhất là…' },
      { en: 'fell steadily from 12 million to 6.5 million', vi: 'giảm đều từ 12 triệu xuống 6,5 triệu' },
      { en: 'rose sharply, more than doubling', vi: 'tăng mạnh, hơn gấp đôi' },
      { en: 'peaked at 19 million in 2010 before falling slightly', vi: 'đạt đỉnh 19 triệu năm 2010 rồi giảm nhẹ' },
      { en: 'overtook', vi: 'vượt qua (về số lượng)' },
      { en: 'over the thirty-year period', vi: 'trong suốt giai đoạn ba mươi năm' },
    ],
    sample: {
      band: 'Mức 6.5 — đủ tổng quan, có nhóm, có so sánh',
      text:
        'The line graph illustrates how many people in one country travelled by bus, by train and by private '
        + 'car over a thirty-year period from 1990 to 2020.\n\n'
        + 'Overall, private cars replaced buses as by far the most popular option, while rail travel grew '
        + 'steadily throughout. Bus use was the only category to decline across the whole period.\n\n'
        + 'In 1990, buses carried the largest number of passengers, at 12 million, compared with 8 million for '
        + 'cars and only 4 million for trains. Bus numbers then fell steadily, dropping to 9.5 million by 2000 '
        + 'and reaching just 6.5 million in 2020, little more than half the original figure.\n\n'
        + 'Car use moved in the opposite direction. It rose sharply from 8 million to 19 million between 1990 '
        + 'and 2010, overtaking buses at some point in the 1990s. After 2010, however, the figure fell slightly '
        + 'to 18 million, the only downturn in that category. Train passengers increased throughout, from 4 '
        + 'million to 11 million, with the fastest growth occurring after 2010.',
      note:
        '186 từ. Bốn điểm ăn điểm: (1) câu mở viết lại đề bằng từ khác, (2) câu Overall KHÔNG có số liệu, (3) '
        + 'nhóm theo XU HƯỚNG (giảm / tăng) chứ không liệt kê từng dòng, (4) nêu được chi tiết mà bài yếu bỏ '
        + 'sót: ô tô ĐỔI CHIỀU sau 2010, và mốc ô tô vượt xe buýt.',
    },
    weakSample: {
      band: 'Mức 5.0–5.5 — không sai ngữ pháp nhưng không lên điểm được',
      text:
        'The line graph shows the number of people using three types of transport in one country between 1990 '
        + 'and 2020. In 1990 bus was 12 million. In 2000 bus was 9.5 million. In 2010 bus was 7 million. In '
        + '2020 bus was 6.5 million. In 1990 train was 4 million. In 2000 train was 5 million. In 2010 train '
        + 'was 7.5 million. In 2020 train was 11 million. In 1990 car was 8 million. In 2000 car was 14 '
        + 'million. In 2010 car was 19 million. In 2020 car was 18 million.',
      problems: [
        'Câu mở CHÉP GẦN NGUYÊN đề bài — phần chép không được tính vào số từ, nên bài thực tế ngắn hơn nhiều.',
        'KHÔNG có câu tổng quan (Overall). Đây một mình nó đã chặn trần điểm, dù mọi số liệu đều đúng.',
        'Chỉ đọc lại bảng theo từng dòng, không nhóm, không so sánh. Đây là "đọc số" chứ không phải "tóm tắt".',
        'Lặp y hệt một cấu trúc câu 12 lần — bị trừ nặng ở tiêu chí ngữ pháp đa dạng.',
        'Bỏ sót đặc điểm quan trọng nhất: ô tô ĐỔI CHIỀU sau 2010, và thời điểm ô tô vượt xe buýt.',
        'Không hề dùng động từ mô tả xu hướng nào (rose, fell, peaked) — chỉ dùng "was" suốt bài.',
      ],
    },
    mistakes: [
      {
        wrong: 'Overall, bus use fell from 12 million to 6.5 million.',
        right: 'Overall, private cars replaced buses as the most popular option.',
        why:
          'Câu tổng quan KHÔNG được chứa số liệu cụ thể. Có số là nó thành câu thân bài, và bài coi như vẫn thiếu tổng quan.',
      },
      {
        wrong: 'In 1990 bus was 12 million.',
        right: 'In 1990, buses carried 12 million passengers.',
        why:
          'Viết cụt không thành câu hoàn chỉnh. Luôn viết đủ chủ ngữ + động từ có nghĩa, đừng dùng "was" cho mọi thứ.',
      },
      {
        wrong: 'Bỏ qua việc ô tô giảm sau 2010 vì "chỉ giảm ít".',
        right: 'Nêu rõ: "After 2010, however, the figure fell slightly to 18 million."',
        why:
          'Đổi chiều xu hướng là đặc điểm chính, dù mức thay đổi nhỏ. Bỏ sót là mất điểm ở tiêu chí chọn lọc thông tin.',
      },
    ],
  },

  /* ─────────────── ĐỀ 2: Task 2 opinion ─────────────── */
  {
    id: 's2w2',
    task: 'Task 2 (Nêu ý kiến)',
    title: 'Đồng ý hay không đồng ý — làm việc từ xa',
    prompt:
      'Some people believe that all office workers should be allowed to work from home whenever they wish. To '
      + 'what extent do you agree or disagree? Write at least 250 words.',
    promptVi:
      'Một số người cho rằng mọi nhân viên văn phòng nên được phép làm việc tại nhà bất cứ khi nào họ muốn. '
      + 'Bạn đồng ý hay không đồng ý ở mức độ nào?',
    minWords: 250,
    minutes: 40,
    outline: [
      { part: 'Mở bài (2 câu)', what: 'Câu 1 viết lại đề. Câu 2 nêu THẲNG lập trường — và chú ý đề hỏi "to what extent", nên trả lời có mức độ.' },
      { part: 'Thân 1', what: 'Bên bạn đồng tình: lợi ích của làm việc tại nhà. Câu chủ đề → giải thích → ví dụ.' },
      { part: 'Thân 2', what: 'Giới hạn: vì sao "bất cứ khi nào họ muốn" là quá đà. Đây là chỗ trả lời chữ "extent".' },
      { part: 'Kết bài', what: 'Nhắc lại lập trường có mức độ. Không thêm ý mới.' },
    ],
    phrases: [
      { en: 'I largely agree with this view, although with one important reservation.', vi: 'Tôi phần lớn đồng ý, dù có một điểm dè dặt quan trọng.' },
      { en: 'The most obvious benefit is that…', vi: 'Lợi ích rõ nhất là…' },
      { en: 'This is particularly true for…', vi: 'Điều này đặc biệt đúng với…' },
      { en: 'That said, …', vi: 'Dù vậy,…' },
      { en: 'a blanket rule', vi: 'một quy định áp dụng cho tất cả' },
      { en: 'strike a balance', vi: 'tìm được điểm cân bằng' },
      { en: 'For these reasons, I believe that…', vi: 'Vì những lý do đó, tôi cho rằng…' },
    ],
    sample: {
      band: 'Mức 6.5 — trả lời đúng "to what extent", có ví dụ cụ thể',
      text:
        'It is sometimes argued that everyone who works in an office should have an unrestricted right to work '
        + 'from home. I largely agree that remote working should be available, but I do not accept that it '
        + 'should be entirely a matter of individual choice.\n\n'
        + 'There are clear arguments in favour of home working. The most obvious is time: an employee who would '
        + 'otherwise spend two hours a day travelling gains those hours back, and much of that time tends to be '
        + 'spent either working or resting properly. Concentration also improves for tasks that require '
        + 'uninterrupted attention, since a home desk offers fewer interruptions than an open-plan office. This '
        + 'is particularly true for roles such as writing, analysis or programming, where a single hour of '
        + 'undisturbed work may be worth several fragmented ones.\n\n'
        + 'However, a blanket rule allowing anyone to stay at home at any time would create problems. New '
        + 'employees learn most of what they need informally, by overhearing colleagues and asking small '
        + 'questions that would never justify a scheduled video call. A team in which everyone chooses '
        + 'independently may also find that no two members are ever present on the same day, which makes '
        + 'planning almost impossible. Some coordination is therefore necessary, even if it slightly reduces '
        + 'individual freedom.\n\n'
        + 'For these reasons, I believe employers should offer home working as a genuine option rather than a '
        + 'privilege, while retaining the right to require attendance on a small number of agreed days. That '
        + 'approach strikes a balance between the flexibility employees value and the coordination that teams '
        + 'need.',
      note:
        '283 từ. Điểm quyết định: đề hỏi "to what extent" nên câu trả lời phải CÓ MỨC ĐỘ — bài này đồng ý phần '
        + 'lớn nhưng nêu rõ giới hạn, rồi đề xuất cụ thể ở kết bài. Mỗi đoạn thân có một ý được giải thích và có '
        + 'ví dụ cụ thể ("hai giờ đi lại", "nhân viên mới học bằng cách nghe lỏm").',
    },
    weakSample: {
      band: 'Mức 5.0–5.5 — đúng ngữ pháp nhưng nông và không trả lời đủ đề',
      text:
        'Nowadays, working from home is very popular in our modern society. Some people think office workers '
        + 'should work from home whenever they want. In my opinion, I agree with this idea.\n\n'
        + 'Firstly, working from home is very convenient. Workers do not need to travel, so they save a lot of '
        + 'time. It is very good for them. Also, they can save money because they do not pay for transport. '
        + 'This is very important nowadays.\n\n'
        + 'Secondly, working from home is more comfortable. Workers can wear comfortable clothes and they can '
        + 'make their own food. They feel happy and relaxed. When workers are happy, they work better. So '
        + 'companies also get benefit from this.\n\n'
        + 'In conclusion, I think working from home has many advantages and companies should allow it. It is '
        + 'good for workers and good for companies.',
      problems: [
        'Mở bài dùng câu sáo rỗng "Nowadays… very popular in our modern society" — tốn 12 từ mà không nói gì.',
        '"In my opinion, I agree" thừa — chọn một trong hai.',
        'KHÔNG trả lời chữ "to what extent". Đề hỏi mức độ mà bài chỉ đồng ý hoàn toàn, không nêu giới hạn nào.',
        'Không có mặt phản biện. Bài chỉ nêu ưu điểm, nên lập luận một chiều và nông.',
        'Lặp "very" 6 lần và "good" 4 lần — vốn từ nghèo, bị trừ ở Lexical Resource.',
        'Không có ví dụ cụ thể nào. Mọi câu đều chung chung, áp được cho bất kỳ ai.',
        'Chỉ 148 từ, dưới mức tối thiểu 250 — mất điểm nặng và không cứu được.',
      ],
    },
    mistakes: [
      {
        wrong: 'In my opinion, I agree with this idea.',
        right: 'I largely agree that remote working should be available, but I do not accept that it should be entirely a matter of individual choice.',
        why:
          'Đề hỏi "To what extent…?" nên bắt buộc trả lời CÓ MỨC ĐỘ. Đồng ý hoàn toàn mà không nêu giới hạn là '
          + 'chưa trả lời đủ đề — mất điểm Task Response.',
      },
      {
        wrong: 'It is very good for them. This is very important nowadays.',
        right: 'An employee who would otherwise spend two hours a day travelling gains those hours back.',
        why:
          'Câu "very good", "very important" không mang thông tin. Thay bằng chi tiết CỤ THỂ, vừa ăn điểm từ '
          + 'vựng vừa làm ý được triển khai.',
      },
      {
        wrong: 'Viết 148 từ cho đề yêu cầu 250.',
        right: 'Viết 260–290 từ.',
        why:
          'Thiếu số từ bị trừ chắc chắn. Trước ngày thi hãy đếm xem 250 từ chữ viết tay của bạn dài bao nhiêu dòng.',
      },
    ],
  },

  /* ─────────────── ĐỀ 3: Task 2 both views ─────────────── */
  {
    id: 's2w3',
    task: 'Task 2 (Bàn hai quan điểm)',
    title: 'Bàn cả hai quan điểm — học đại học hay học nghề',
    prompt:
      'Some people think that young people should go to university, while others believe they should learn a '
      + 'trade instead. Discuss both views and give your own opinion. Write at least 250 words.',
    promptVi:
      'Một số người cho rằng người trẻ nên vào đại học, số khác cho rằng nên học nghề. Hãy bàn cả hai quan '
      + 'điểm và nêu ý kiến của bạn.',
    minWords: 250,
    minutes: 40,
    outline: [
      { part: 'Mở bài', what: 'Viết lại đề + nêu ý kiến riêng NGAY, không để tới kết bài mới nói.' },
      { part: 'Thân 1', what: 'Quan điểm thứ nhất (đại học) — trình bày công bằng, dù bạn không theo nó.' },
      { part: 'Thân 2', what: 'Quan điểm thứ hai (học nghề) — cũng trình bày công bằng.' },
      { part: 'Kết bài', what: 'Nêu lại ý kiến riêng và LÝ DO chọn nó.' },
    ],
    phrases: [
      { en: 'Those who favour… argue that…', vi: 'Những người ủng hộ… lập luận rằng…' },
      { en: 'Supporters of the opposing view point out that…', vi: 'Phe ủng hộ quan điểm ngược lại chỉ ra rằng…' },
      { en: 'There is force in both positions.', vi: 'Cả hai lập trường đều có sức thuyết phục.' },
      { en: 'a shortage of skilled workers', vi: 'sự thiếu hụt lao động có tay nghề' },
      { en: 'graduate unemployment', vi: 'tình trạng thất nghiệp của cử nhân' },
      { en: 'In my own view, the choice should depend on…', vi: 'Theo tôi, lựa chọn nên tuỳ thuộc vào…' },
    ],
    sample: {
      band: 'Mức 6.5 — bàn công bằng cả hai phía, ý kiến riêng rõ ràng',
      text:
        'Opinions differ as to whether school leavers should continue to university or train directly for a '
        + 'specific trade. In my view both routes are legitimate, and the sensible choice depends on the '
        + 'individual and on what the labour market actually needs.\n\n'
        + 'Those who favour university education argue that it develops more than technical knowledge. A degree '
        + 'course requires students to read widely, evaluate evidence and defend an argument, and these habits '
        + 'transfer to almost any profession. Graduates also tend to have more room to change direction later: '
        + 'someone who studied economics can move into policy, journalism or management without retraining '
        + 'entirely. In many countries, average graduate earnings remain higher over a working life.\n\n'
        + 'Supporters of vocational training point out that these advantages are not guaranteed. University is '
        + 'expensive, and in several countries a significant proportion of graduates end up in work that does '
        + 'not require a degree at all. Meanwhile there is a genuine shortage of electricians, nurses and '
        + 'technicians, which means a trained plumber may find secure, well-paid work far sooner than a '
        + 'humanities graduate. Vocational courses are also shorter, so the cost of a wrong choice is lower.\n\n'
        + 'There is force in both positions, and the argument is usually presented as more of a contest than it '
        + 'needs to be. In my own view, the real problem is that vocational routes are treated as second best, '
        + 'which pushes students towards degrees they may not want. If both paths carried equal status, more '
        + 'young people would choose according to aptitude rather than prestige, which would benefit them and '
        + 'the economy alike.',
      note:
        '281 từ. Điểm quyết định của dạng "discuss both views": phải trình bày phía bạn KHÔNG theo một cách công '
        + 'bằng, không dựng bù nhìn để đánh. Ý kiến riêng nêu ngay ở mở bài rồi phát triển ở kết bài, chứ không '
        + 'để độc giả đoán.',
    },
    weakSample: {
      band: 'Mức 5.0–5.5 — bàn một phía, thiếu ý kiến riêng',
      text:
        'Education is very important for young people. Some people think they should go to university and other '
        + 'people think they should learn a trade. Both sides have advantages and disadvantages.\n\n'
        + 'On the one hand, going to university is very good. Students can learn a lot of knowledge and they can '
        + 'get a good job. University graduates earn more money than other people. Also they can meet many '
        + 'friends and have a good experience.\n\n'
        + 'On the other hand, learning a trade is also good. Students can work early and earn money early. They '
        + 'do not pay expensive tuition fee. Some trade jobs are very necessary in society.\n\n'
        + 'In conclusion, both going to university and learning a trade have advantages and disadvantages, so '
        + 'young people should think carefully before they decide.',
      problems: [
        'KHÔNG nêu ý kiến riêng. Đề bắt buộc "give your own opinion" — kết bài né bằng "should think carefully" là chưa hoàn thành đề.',
        'Mở bài "Education is very important" là câu rỗng, không viết lại đề.',
        'Mỗi phía chỉ có 3–4 câu liệt kê, không giải thích, không ví dụ cụ thể.',
        '"tuition fee" thiếu -s số nhiều; "a lot of knowledge" đúng nhưng "learn knowledge" là kết hợp từ vụng (nên là "gain knowledge").',
        'Lặp cấu trúc "…is very good / is also good" và lặp "advantages and disadvantages" ba lần.',
        'Chỉ 137 từ, dưới mức tối thiểu.',
      ],
    },
    mistakes: [
      {
        wrong: 'In conclusion, … so young people should think carefully before they decide.',
        right: 'In my own view, the real problem is that vocational routes are treated as second best.',
        why:
          'Đề yêu cầu "give your own opinion". Kết bài khuyên chung chung là né tránh, bị tính là chưa trả lời đủ đề.',
      },
      {
        wrong: 'Students can learn a lot of knowledge.',
        right: 'A degree course requires students to read widely and evaluate evidence.',
        why:
          '"learn knowledge" là kết hợp từ vụng (nên dùng "gain knowledge"). Nhưng tốt hơn là thay hẳn bằng câu '
          + 'CỤ THỂ nói rõ đại học rèn cái gì.',
      },
      {
        wrong: 'Bàn phía mình không theo một cách hời hợt để dễ bác bỏ.',
        right: 'Trình bày cả hai phía công bằng, rồi mới nêu ý kiến riêng có lý do.',
        why:
          'Dạng "discuss both views" chấm khả năng trình bày công bằng. Dựng bù nhìn để đánh là mất điểm Task Response.',
      },
    ],
  },

  /* ─────────────── ĐỀ 4: Task 2 problem–solution ─────────────── */
  {
    id: 's2w4',
    task: 'Task 2 (Nguyên nhân & giải pháp)',
    title: 'Nguyên nhân và giải pháp — ùn tắc giao thông đô thị',
    prompt:
      'Traffic congestion is becoming a serious problem in many large cities. What are the causes of this '
      + 'problem, and what measures could be taken to solve it? Write at least 250 words.',
    promptVi:
      'Ùn tắc giao thông đang trở thành vấn đề nghiêm trọng ở nhiều thành phố lớn. Nguyên nhân là gì và có '
      + 'thể làm gì để giải quyết?',
    minWords: 250,
    minutes: 40,
    outline: [
      { part: 'Mở bài', what: 'Viết lại đề + nói rõ bài sẽ bàn nguyên nhân rồi tới giải pháp.' },
      { part: 'Thân 1 — Nguyên nhân', what: 'Hai nguyên nhân được giải thích kỹ, hơn là bốn nguyên nhân liệt kê.' },
      { part: 'Thân 2 — Giải pháp', what: 'Giải pháp phải ỨNG với nguyên nhân đã nêu, không phải danh sách rời rạc.' },
      { part: 'Kết bài', what: 'Tóm lại nguyên nhân chính và giải pháp khả thi nhất.' },
    ],
    phrases: [
      { en: 'The principal cause is…', vi: 'Nguyên nhân chính là…' },
      { en: 'This is compounded by…', vi: 'Điều này còn bị làm trầm trọng thêm bởi…' },
      { en: 'One effective measure would be to…', vi: 'Một biện pháp hiệu quả sẽ là…' },
      { en: 'Unless… , the problem will only worsen.', vi: 'Nếu không…, vấn đề sẽ chỉ tệ thêm.' },
      { en: 'congestion charge', vi: 'phí ùn tắc' },
      { en: 'a viable alternative', vi: 'một lựa chọn thay thế khả thi' },
    ],
    sample: {
      band: 'Mức 6.5 — giải pháp ỨNG với nguyên nhân',
      text:
        'Severe traffic congestion has become a familiar feature of large cities across the world. This essay '
        + 'will examine the principal causes of the problem before considering what governments might '
        + 'realistically do about it.\n\n'
        + 'The most important cause is simply that private car ownership has grown faster than road capacity. As '
        + 'incomes rise, a car becomes affordable to far more households, yet the streets of an established city '
        + 'cannot easily be widened. This is compounded by a second factor: public transport in many cities is '
        + 'slow, crowded or unreliable, so driving remains the rational choice even for people who would prefer '
        + 'not to drive. Where buses share the same congested lanes as cars, they can never be faster than the '
        + 'traffic they are stuck in.\n\n'
        + 'The measures that follow from this analysis are reasonably clear. Since driving is chosen because the '
        + 'alternatives are worse, the alternatives must be improved first: dedicated bus lanes, more frequent '
        + 'services and integrated ticketing would make public transport a viable alternative rather than a last '
        + 'resort. Charging drivers to enter the city centre, as London and Singapore have done, can then reduce '
        + 'demand further, though such schemes are unpopular unless the revenue is visibly spent on transport. '
        + 'Encouraging employers to allow staggered or remote working would also spread demand across the day '
        + 'instead of concentrating it into two short peaks.\n\n'
        + 'In short, congestion arises because driving is convenient and the alternatives are not. Unless cities '
        + 'make those alternatives genuinely attractive before restricting cars, restrictions alone are likely '
        + 'to be resisted and to fail.',
      note:
        '278 từ. Điểm quyết định của dạng nguyên nhân–giải pháp: giải pháp phải ỨNG với nguyên nhân đã nêu. Bài '
        + 'này nêu nguyên nhân "phương tiện công cộng kém nên lái xe là lựa chọn hợp lý", rồi giải pháp đầu tiên '
        + 'chính là cải thiện phương tiện công cộng. Bài yếu thường liệt kê giải pháp không dính gì tới nguyên nhân.',
    },
    weakSample: {
      band: 'Mức 5.0–5.5 — liệt kê rời rạc, giải pháp không ứng với nguyên nhân',
      text:
        'Traffic jam is a big problem in many cities nowadays. There are many causes and many solutions.\n\n'
        + 'Firstly, there are too many cars. Everybody wants to buy a car because it is comfortable. Secondly, '
        + 'the roads are too small. Thirdly, many people do not obey the traffic rules. Fourthly, there are many '
        + 'people in the city because they come from the countryside to find a job.\n\n'
        + 'There are also many solutions. The government should build more roads. People should use bicycles. '
        + 'The government should punish people who break the rules. Students should learn about traffic at '
        + 'school. Companies should let people work at home.\n\n'
        + 'In conclusion, traffic jam is a serious problem and the government and the people should work '
        + 'together to solve it.',
      problems: [
        'Liệt kê BỐN nguyên nhân, mỗi cái một câu, không cái nào được giải thích. Ít mà sâu tốt hơn nhiều mà nông.',
        'Giải pháp KHÔNG ỨNG với nguyên nhân: nêu nguyên nhân "không tuân thủ luật" rồi lại đề xuất "xây thêm đường".',
        '"Traffic jam" nên là "traffic congestion" trong văn viết học thuật; và "traffic jam is" thiếu mạo từ.',
        'Lặp cấu trúc "The government should… People should… Companies should…" — sáu câu cùng một khuôn.',
        'Kết bài rỗng: "work together to solve it" không nói được gì cụ thể.',
        'Chỉ 133 từ, dưới mức tối thiểu.',
      ],
    },
    mistakes: [
      {
        wrong: 'Nêu 4 nguyên nhân, mỗi cái một câu.',
        right: 'Nêu 2 nguyên nhân, mỗi cái được giải thích kỹ và có ví dụ.',
        why:
          'Tiêu chí Task Response chấm ĐỘ TRIỂN KHAI của ý, không chấm số lượng ý. Bốn ý nông luôn thua hai ý sâu.',
      },
      {
        wrong: 'Nguyên nhân: người ta không tuân thủ luật. Giải pháp: xây thêm đường.',
        right: 'Nguyên nhân: phương tiện công cộng kém. Giải pháp: làm làn xe buýt riêng, tăng chuyến.',
        why:
          'Giải pháp phải ỨNG với nguyên nhân vừa nêu. Hai danh sách rời rạc bị chấm là bài thiếu mạch lạc.',
      },
      {
        wrong: 'Traffic jam is a big problem.',
        right: 'Traffic congestion has become a serious problem.',
        why:
          '"traffic jam" là từ nói chuyện; văn học thuật dùng "traffic congestion". Và danh từ đếm được số ít '
          + 'cần mạo từ.',
      },
    ],
  },
];
