/**
 * Bài học chặng 4 (6.5 → 7.5) — 15 bài, 3 chủ điểm.
 *
 * Lộ trình nói rất rõ: "Từ 6.5 lên 7.5 không phải học thêm kiến thức mới, mà
 * là GIẢM LỖI." Vì thế chặng này KHÔNG có ngữ pháp mới. Cả 15 bài đều xoay
 * quanh ba việc:
 *
 *   1. Diệt lỗi lặp của riêng bạn — một lỗi nhỏ lặp vài lần đủ kéo Writing
 *      từ 7.0 xuống 6.5.
 *   2. Dùng từ CHÍNH XÁC chứ không chỉ đúng nghĩa — đây là ranh giới thật
 *      giữa 6.5 và 7.5 ở tiêu chí từ vựng.
 *   3. Nói và viết tự nhiên: nhịp điệu, nối âm, cách nói giảm nhẹ.
 *
 * Ít bài hơn chặng trước là cố ý. Ở đây làm ít mà kỹ mới có tác dụng; thêm
 * bài mới chỉ làm loãng đúng thứ cần tập trung.
 */
import type { LessonUnit } from '../types';

export const UNITS4: LessonUnit[] = [
  {
    id: 's4-errors',
    title: 'Diệt lỗi của riêng bạn',
    subtitle: 'Bài 1–5 · Một lỗi nhỏ lặp vài lần kéo cả band xuống',
    icon: '🎯',
    lessons: [
      {
        id: 'e1', n: 1, title: 'Vì sao lỗi NHỎ mới là thứ chặn 7.0',
        goal: 'Hiểu đúng cái gì đang giữ bạn ở 6.5, để không đi học thêm cấu trúc mới một cách vô ích.',
        blocks: [{
          explain:
            'Ở band 6.5 bạn đã viết được câu phức, đã có ý, đã đủ số từ. Thứ còn lại chặn bạn không phải kiến '
            + 'thức thiếu mà là LỖI VẶT LẶP LẠI: mạo từ, số nhiều, giới từ, hợp chủ–vị.\n\n'
            + 'Mô tả band 7 dùng cụm "produces frequent error-free sentences". Nghĩa là giám khảo đếm số CÂU '
            + 'KHÔNG LỖI. Một câu hay có một lỗi mạo từ thì vẫn là câu có lỗi. Đó là lý do người viết hay mà '
            + 'ẩu lại thua người viết đơn giản mà sạch.',
          examples: [
            { en: 'Câu hay nhưng có lỗi: The government should invest in the education.', vi: 'thừa "the" → vẫn tính là câu có lỗi' },
            { en: 'Câu đơn giản mà sạch: Governments should invest in education.', vi: 'không lỗi → được tính' },
          ],
          mistake: {
            wrong: 'Học thêm cấu trúc phức tạp để "nâng band".',
            right: 'Đếm xem trong bài gần nhất có bao nhiêu câu KHÔNG LỖI, rồi tăng con số đó.',
            why: 'Ở chặng này thêm cấu trúc mới thường làm tăng số lỗi chứ không tăng điểm.',
          },
        }],
        practice: [
          'Lấy bài viết gần nhất, đánh dấu MỌI câu có ít nhất một lỗi. Đếm tỷ lệ câu sạch.',
          'Mục tiêu chặng này: nâng tỷ lệ câu sạch lên trên 70%, không phải viết câu phức hơn.',
        ],
      },
      {
        id: 'e2', n: 2, title: 'Mạo từ — lỗi số một ở band 6.5',
        goal: 'Giảm hẳn lỗi a/an/the, thứ chiếm phần lớn lỗi vặt của người Việt.',
        blocks: [{
          formula: 'Nói CHUNG CHUNG số nhiều/không đếm được → KHÔNG mạo từ · Đã xác định → the',
          explain:
            'Tiếng Việt không có mạo từ nên người Việt không có phản xạ này. Ba quy tắc giải quyết khoảng 80% '
            + 'trường hợp trong bài viết học thuật.',
          examples: [
            { en: 'Education is important. (nói chung — KHÔNG "the")', vi: 'giáo dục nói chung' },
            { en: 'The education system in Vietnam is changing. (đã xác định — có "the")', vi: 'hệ thống giáo dục cụ thể' },
            { en: 'Governments should act. (số nhiều, nói chung — không mạo từ)', vi: '' },
            { en: 'The government of Japan introduced a new law. (xác định — có "the")', vi: '' },
            { en: 'Research shows… (không đếm được, nói chung — không mạo từ)', vi: '' },
          ],
          mistake: {
            wrong: 'The government should invest in the education to solve the poverty.',
            right: 'Governments should invest in education to reduce poverty.',
            why: 'Ba mạo từ thừa trong một câu. Danh từ trừu tượng nói chung (education, poverty, research) KHÔNG có "the".',
          },
        }],
        practice: [
          'Lấy 2 bài cũ, khoanh MỌI "the". Với từng cái hỏi: danh từ này đã xác định chưa? Chưa thì xoá.',
          'Đếm số "the" thừa. Đó là con số cần đưa về 0 trong bốn tuần.',
        ],
      },
      {
        id: 'e3', n: 3, title: 'Danh từ số nhiều và danh từ không đếm được',
        goal: 'Hết lỗi -s — lỗi vặt nhiều thứ hai và dễ sửa nhất.',
        blocks: [{
          explain:
            'Hai nhóm gây lỗi. **Nhóm 1**: danh từ đếm được nói chung phải ở số nhiều (a car → cars). **Nhóm 2**: '
            + 'danh từ không đếm được không bao giờ có -s.\n\n'
            + 'Nhóm 2 ở trình độ học thuật gồm: research, evidence, advice, information, knowledge, equipment, '
            + 'progress, feedback, staff, machinery, legislation.',
          examples: [
            { en: 'Cars cause pollution. (không phải "Car causes pollution")', vi: 'nói chung → số nhiều' },
            { en: 'Recent research suggests… (không phải "researches")', vi: '' },
            { en: 'The evidence is limited. (không phải "evidences are")', vi: 'không đếm được → động từ số ít' },
            { en: 'Two pieces of equipment (muốn đếm thì dùng "pieces of")', vi: '' },
          ],
          mistake: {
            wrong: 'Recent researches show that these evidences are strong.',
            right: 'Recent research shows that this evidence is strong.',
            why: 'research và evidence đều không đếm được: không -s, và động từ chia số ít.',
          },
        }],
        practice: [
          'Học thuộc 11 danh từ không đếm được ở trên. Đây là danh sách gây lỗi nhiều nhất ở văn học thuật.',
          'Soi 2 bài cũ, tìm mọi danh từ đếm được đang ở số ít mà lẽ ra phải số nhiều.',
        ],
      },
      {
        id: 'e4', n: 4, title: 'Giới từ đi với danh từ và động từ',
        goal: 'Hết lỗi giới từ — lỗi khó tự thấy nhất vì câu vẫn hiểu được.',
        blocks: [{
          explain:
            'Giới từ sai không làm mất nghĩa nên bạn không tự thấy, nhưng giám khảo đếm từng cái. Không có quy '
            + 'tắc — phải học theo cặp. Nhóm hay sai nhất trong văn học thuật:',
          examples: [
            { en: 'research INTO / ON (không phải "about")', vi: '' },
            { en: 'an increase IN unemployment (không phải "of")', vi: '' },
            { en: 'the figure FOR France (không phải "of")', vi: '' },
            { en: 'depend ON · rely ON · focus ON', vi: '' },
            { en: 'consist OF · comprise (KHÔNG có giới từ)', vi: '"comprise of" là sai' },
            { en: 'discuss (KHÔNG có "about") · emphasise (KHÔNG có "on")', vi: 'hai động từ hay bị thêm giới từ thừa' },
            { en: 'the impact ON · the reason FOR · the solution TO', vi: '' },
          ],
          mistake: {
            wrong: 'The report discusses about the increase of crime and emphasises on prevention.',
            right: 'The report discusses the increase in crime and emphasises prevention.',
            why: '"discuss" và "emphasise" KHÔNG có giới từ theo sau; và "increase" đi với "in", không phải "of".',
          },
        }],
        practice: [
          'Lập bảng 20 cặp danh từ/động từ + giới từ hay dùng nhất trong bài của bạn.',
          'Soi 2 bài cũ, kiểm TỪNG giới từ. Đây là loại lỗi phải soát riêng một lượt vì không tự lộ ra.',
        ],
      },
      {
        id: 'e5', n: 5, title: 'Bảng soát 6 lượt cho band 7',
        goal: 'Có quy trình soát bài cuối cùng, mỗi lượt săn đúng một loại lỗi.',
        blocks: [{
          explain:
            'Chặng 1 đã có bảng 8 điểm cho lỗi cơ bản. Ở band 6.5–7.5 danh sách ngắn hơn nhưng phải soát KỸ '
            + 'hơn. Sáu lượt, mỗi lượt một loại, 30 giây một lượt:\n\n'
            + '① Mạo từ — mọi "the" có cần thiết không? Danh từ đếm được số ít có thiếu "a" không?\n'
            + '② Số nhiều — danh từ nói chung đã ở số nhiều chưa? Có -s thừa ở danh từ không đếm được không?\n'
            + '③ Giới từ — từng cái một, đối chiếu bảng của bạn.\n'
            + '④ Hợp chủ–vị — nhất là khi chủ ngữ dài hoặc có mệnh đề chen giữa.\n'
            + '⑤ Thì — có nhất quán không? Số liệu quá khứ có dùng thì quá khứ không?\n'
            + '⑥ Câu dài — có câu nào quá 35 từ không? Có comma splice không?',
          examples: [
            { en: 'Lượt ④ hay bắt được: The number of students who live in halls have risen. → has risen', vi: 'chủ ngữ là "The number", không phải "students"' },
          ],
          mistake: {
            wrong: 'Soát một lượt tìm mọi lỗi.',
            right: 'Sáu lượt, mỗi lượt một loại, tổng 3 phút.',
            why: 'Mắt không bắt được nhiều loại lỗi cùng lúc. Ở band 6.5 lỗi còn lại đều là lỗi kín, phải săn riêng.',
          },
        }],
        practice: [
          'Áp bảng 6 lượt cho 3 bài gần nhất. Ghi lại lượt nào bắt được nhiều lỗi nhất.',
          'Lượt đó chính là lỗi đặc trưng của bạn — thêm vào sổ lỗi và kiểm đầu tiên ở mọi bài sau.',
        ],
      },
    ],
  },
  {
    id: 's4-precision',
    title: 'Dùng từ chính xác',
    subtitle: 'Bài 6–10 · Đúng nghĩa chưa đủ, phải đúng sắc thái',
    icon: '💎',
    lessons: [
      {
        id: 'pr1', n: 6, title: 'Sắc thái mạnh nhẹ của từ đồng nghĩa',
        goal: 'Chọn đúng mức độ, thay vì chọn từ hiếm nhất.',
        blocks: [{
          explain:
            'Ở band 7, dùng từ hiếm SAI ngữ cảnh bị trừ nặng hơn dùng từ thường mà đúng. Từ đồng nghĩa khác '
            + 'nhau ở MỨC ĐỘ, và dùng sai mức độ là lỗi kín mà giám khảo bắt ngay.',
          examples: [
            { en: 'Mức giảm: dip (rất nhẹ) < fall < decline < plummet / collapse (rất mạnh)', vi: '' },
            { en: 'Mức quan trọng: relevant < significant < crucial < indispensable', vi: '' },
            { en: 'Mức chắc chắn: may < is likely to < will probably < will certainly', vi: '' },
            { en: 'Mức xấu: unhelpful < problematic < harmful < catastrophic', vi: '' },
          ],
          mistake: {
            wrong: 'Sales plummeted by 2% last year.',
            right: 'Sales dipped slightly, by 2%, last year.',
            why: '"plummet" là rơi thẳng đứng. Dùng cho mức 2% là sai sắc thái nặng — giám khảo đọc là bạn không nắm nghĩa thật của từ.',
          },
        }],
        practice: [
          'Với 6 từ bạn hay dùng, xếp thang mức độ 4 bậc từ nhẹ tới mạnh.',
          'Soi bài cũ: có chỗ nào bạn dùng từ mạnh cho việc nhỏ không?',
        ],
      },
      {
        id: 'pr2', n: 7, title: 'Cách nói giảm nhẹ (hedging)',
        goal: 'Nêu quan điểm mà không tuyệt đối hoá — dấu hiệu rõ của văn học thuật band 7+.',
        blocks: [{
          explain:
            'Văn học thuật hiếm khi khẳng định tuyệt đối, vì gần như không có gì đúng với mọi trường hợp. Nói '
            + 'giảm nhẹ không phải là nói yếu — nó là nói CHÍNH XÁC về mức độ chắc chắn của mình.',
          examples: [
            { en: 'tends to · is likely to · may well · appears to', vi: 'giảm nhẹ động từ' },
            { en: 'in most cases · broadly speaking · with some exceptions', vi: 'giới hạn phạm vi' },
            { en: 'It could be argued that… · The evidence suggests…', vi: 'giảm nhẹ tuyên bố' },
            { en: 'largely · to a great extent · in part', vi: 'giảm nhẹ mức độ' },
          ],
          mistake: {
            wrong: 'Technology always makes people lazy and destroys communication.',
            right: 'Technology may well reduce certain kinds of effort, and in some contexts it appears to weaken face-to-face communication.',
            why: 'Câu tuyệt đối dễ bị bác bằng một phản ví dụ, nên nó YẾU về lập luận. Câu giảm nhẹ vừa chính xác hơn vừa khó bác hơn.',
          },
        }],
        practice: [
          'Lấy 10 câu khẳng định tuyệt đối trong bài cũ, viết lại có giảm nhẹ.',
          'Đọc lại: câu nào giờ đây khó phản bác hơn? Đó chính là câu mạnh hơn.',
        ],
      },
      {
        id: 'pr3', n: 8, title: 'Bỏ lối viết vòng vo',
        goal: 'Nói cùng một ý bằng ít từ hơn — làm bài rõ hơn và dành chỗ cho ý.',
        blocks: [{
          explain:
            'Ở band 6.5 nhiều người viết dài vì nghĩ dài là hay. Band 7 ngược lại: gọn mà đủ. Ba lối vòng vo '
            + 'hay gặp và cách thay.',
          examples: [
            { en: 'due to the fact that → because', vi: '' },
            { en: 'in spite of the fact that → although', vi: '' },
            { en: 'at this point in time → now / currently', vi: '' },
            { en: 'has the ability to → can', vi: '' },
            { en: 'in the event that → if', vi: '' },
            { en: 'a large number of people → many people', vi: 'đôi khi từ đơn giản lại đúng hơn' },
          ],
          mistake: {
            wrong: 'Due to the fact that there are a large number of people who have the ability to work remotely at this point in time, …',
            right: 'Because many people can now work remotely, …',
            why: '24 từ xuống 7 từ, nghĩa không đổi. Chỗ tiết kiệm được dùng để thêm một ví dụ — thứ thật sự ăn điểm.',
          },
        }],
        practice: [
          'Lấy 1 bài cũ, rút gọn mỗi đoạn xuống còn 80% số từ mà không mất ý nào.',
          'Dùng chỗ tiết kiệm được để thêm một ví dụ cụ thể vào mỗi đoạn thân.',
        ],
      },
      {
        id: 'pr4', n: 9, title: 'Từ nối dùng đúng liều',
        goal: 'Hết lỗi lạm dụng từ nối — lỗi khiến bài đọc như bài mẫu học thuộc.',
        blocks: [{
          explain:
            'Ở band 5.5–6.0, thêm từ nối giúp tăng điểm mạch lạc. Ở band 7 thì ngược lại: mở đầu mọi câu bằng '
            + 'Moreover, Furthermore, In addition là dấu hiệu bài học thuộc, và bị trừ vì "mechanical use of '
            + 'cohesive devices".\n\n'
            + 'Văn tự nhiên nối ý bằng cách lặp lại khái niệm và dùng đại từ, không phải bằng nhãn dán.',
          examples: [
            { en: 'Máy móc: Firstly, … Moreover, … Furthermore, … In addition, … Finally, …', vi: 'năm câu năm nhãn' },
            { en: 'Tự nhiên: The most obvious cost is financial. A second, less visible cost is social. Both of these fall on the same households.', vi: 'nối bằng chính khái niệm' },
          ],
          mistake: {
            wrong: 'Mở đầu mỗi câu trong đoạn bằng một từ nối khác nhau.',
            right: 'Dùng từ nối khi quan hệ giữa hai ý KHÔNG hiển nhiên. Hiển nhiên rồi thì bỏ.',
            why: 'Từ nối là biển chỉ đường. Cắm biển ở mỗi bước chân làm người đọc mệt và cho thấy bạn không tin vào mạch lập luận của mình.',
          },
        }],
        practice: [
          'Lấy 1 đoạn thân bài cũ, XOÁ hết từ nối. Đọc lại — chỗ nào thấy hụt thì mới thêm lại.',
          'Thường bạn sẽ thấy chỉ cần 1–2 từ nối cho cả đoạn thay vì 5.',
        ],
      },
      {
        id: 'pr5', n: 10, title: 'Kết hợp từ ở mức tinh',
        goal: 'Ghép từ như người bản xứ ghép, không chỉ như từ điển cho phép.',
        blocks: [{
          explain:
            'Chặng 3 đã học collocation cơ bản. Ở đây là mức tinh hơn: những cặp mà cả hai cách đều "đúng" '
            + 'nhưng chỉ một cách là tự nhiên trong văn học thuật.',
          examples: [
            { en: 'draw a conclusion (không phải "make a conclusion")', vi: '' },
            { en: 'raise a question / pose a question (không phải "give a question")', vi: '' },
            { en: 'meet a need / address a need (không phải "solve a need")', vi: '' },
            { en: 'a widely held belief (không phải "a wide belief")', vi: '' },
            { en: 'heavily dependent · vastly different · widely available', vi: 'trạng từ đi với tính từ cụ thể' },
            { en: 'a compelling case · a persuasive argument (không đảo được hai tính từ này)', vi: '' },
          ],
          mistake: {
            wrong: 'From this data we can make a conclusion that the policy has a wide support.',
            right: 'From these data we can draw the conclusion that the policy has widespread support.',
            why: 'Ba lỗi tinh: "data" số nhiều trong văn học thuật; "draw" chứ không "make" một kết luận; "widespread support" chứ không "a wide support".',
          },
        }],
        practice: [
          'Học 20 cặp kết hợp tinh hay dùng trong bài của bạn.',
          'Khi không chắc một cặp có tự nhiên không, tra xem người bản xứ dùng cặp nào nhiều hơn — đừng đoán.',
        ],
      },
    ],
  },
  {
    id: 's4-natural',
    title: 'Nói và viết tự nhiên',
    subtitle: 'Bài 11–15 · Ngữ điệu, nối âm, và bài kiểm cuối',
    icon: '🎵',
    lessons: [
      {
        id: 'n1', n: 11, title: 'Ngữ điệu — nói trôi mà đều đều vẫn mất điểm',
        goal: 'Có lên xuống giọng, thứ tiêu chí Pronunciation chấm ở band 7+.',
        blocks: [{
          explain:
            'Ở band 6.5 nhiều người đã nói trôi chảy nhưng ĐỀU MỘT NHỊP, và bị chặn ở Pronunciation. Tiếng Anh '
            + 'nhấn vào từ mang THÔNG TIN MỚI và hạ thấp phần còn lại.',
          examples: [
            { en: 'I did not say she stole the money. (nhấn "I" — người khác nói)', vi: '' },
            { en: 'I did not say she STOLE the money. (nhấn "stole" — tôi nói cô ấy mượn)', vi: 'cùng một câu, năm cách nhấn, năm nghĩa' },
            { en: 'Giọng lên ở câu chưa xong, xuống ở câu đã xong', vi: 'dấu hiệu cho người nghe biết bạn nói tiếp hay đã hết ý' },
          ],
          mistake: {
            wrong: 'Nói đều một nhịp từ đầu tới cuối vì sợ sai.',
            right: 'Nhấn vào từ mang thông tin mới, hạ giọng ở từ đã biết.',
            why: 'Nói đều làm người nghe không biết đâu là ý chính, và bị chấm là "monotonous" — một trong những mô tả trừ điểm ở Pronunciation.',
          },
        }],
        practice: [
          'Đọc một câu năm lần, mỗi lần nhấn một từ khác nhau. Nghe lại xem nghĩa đổi thế nào.',
          'Thu âm 1 phút nói tự do, nghe lại và tự hỏi: có chỗ nào lên xuống giọng không?',
        ],
      },
      {
        id: 'n2', n: 12, title: 'Nối âm và âm yếu',
        goal: 'Nói liền mạch như người bản xứ, và nghe ra được khi họ nói.',
        blocks: [{
          explain:
            'Người bản xứ không đọc rời từng từ. Ba hiện tượng chính — biết chúng vừa giúp nói tự nhiên vừa '
            + 'giúp nghe ra được ở Section 3, 4.',
          examples: [
            { en: 'Nối phụ âm–nguyên âm: an apple → /əˈnæpl/ · pick it up → /pɪkɪtʌp/', vi: '' },
            { en: 'Âm yếu: "of" → /əv/, "to" → /tə/, "and" → /ən/, "a" → /ə/', vi: 'từ chức năng luôn bị đọc nhẹ' },
            { en: 'Nuốt âm: next day → /neksdeɪ/ (mất /t/) · must be → /mʌsbi/', vi: '' },
          ],
          mistake: {
            wrong: 'Đọc rời từng từ cho "rõ ràng".',
            right: 'Nối các từ trong cùng một cụm ý.',
            why: 'Đọc rời nghe như đọc bảng chữ, và cũng khiến bạn không nhận ra chúng khi người khác nói nhanh.',
          },
        }],
        practice: [
          'Chọn 5 câu, đánh dấu mọi chỗ nối âm, đọc chậm rồi tăng dần tốc độ.',
          'Nghe một đoạn bản xứ, chép lại, so xem chỗ nào bạn nghe sót vì nối âm.',
        ],
      },
      {
        id: 'n3', n: 13, title: 'Nói tự nhiên mà vẫn học thuật ở Part 3',
        goal: 'Cân bằng giữa trang trọng và tự nhiên — quá trang trọng cũng bị trừ.',
        blocks: [{
          explain:
            'Nhiều người ở band 6.5 cố nói thật trang trọng ở Part 3 và nghe như đang đọc bài. Speaking chấm '
            + 'khả năng NÓI, và người bản xứ có học vấn vẫn dùng cụm nói chuyện khi bàn chuyện nghiêm túc.',
          examples: [
            { en: 'Tự nhiên mà vẫn học thuật: "I think there is a real tension between those two goals."', vi: '' },
            { en: 'Quá trang trọng, nghe như đọc: "It is incumbent upon governments to ameliorate this situation."', vi: '' },
            { en: 'Cụm nói chuyện dùng được: "the thing is…", "to be fair…", "I mean…", "sort of"', vi: 'dùng vừa phải' },
          ],
          mistake: {
            wrong: 'Nhồi từ hàn lâm vào câu nói để nghe "cao cấp".',
            right: 'Nói như một người có học đang trò chuyện — ý sâu, từ vừa phải.',
            why: 'Từ hàn lâm trong văn nói bị chấm là không tự nhiên. Speaking và Writing có tiêu chuẩn khác nhau về mức trang trọng.',
          },
        }],
        practice: [
          'Thu âm một câu trả lời Part 3, nghe lại: có chỗ nào nghe như đang đọc không?',
          'Viết lại chỗ đó bằng cách bạn thật sự nói khi tranh luận bằng tiếng Việt, rồi dịch sang.',
        ],
      },
      {
        id: 'n4', n: 14, title: 'Quản lý thời gian ở band 7',
        goal: 'Viết Task 2 xong trong 38 phút mà vẫn còn thời gian soát.',
        blocks: [{
          explain:
            'Mốc chặng 4 ghi rõ: "Viết Task 2 xong trong 38 phút mà vẫn còn thời gian đọc soát." Muốn vậy phải '
            + 'đổi cách phân bổ so với chặng trước.\n\n'
            + '5 phút dàn ý — 30 phút viết — 5 phút soát theo bảng 6 lượt ở bài 5.\n\n'
            + 'Điểm mấu chốt: dàn ý phải đủ chi tiết để lúc viết KHÔNG phải nghĩ ý nữa. Vừa viết vừa nghĩ ý là '
            + 'lý do chính khiến người ta hết giờ.',
          examples: [
            { en: 'Dàn ý đủ: mỗi đoạn thân ghi 1 câu chủ đề + 1 ví dụ CỤ THỂ đã nghĩ sẵn', vi: '' },
            { en: 'Dàn ý thiếu: chỉ ghi "đoạn 1: kinh tế, đoạn 2: xã hội"', vi: 'lúc viết vẫn phải nghĩ ví dụ' },
          ],
          mistake: {
            wrong: 'Bỏ 5 phút soát vì "còn thiếu ý".',
            right: 'Dừng viết ở phút 35, dành trọn 5 phút soát.',
            why: 'Ở band 6.5, 5 phút soát bắt được nhiều lỗi vặt hơn giá trị của một ý thêm vào. Mà lỗi vặt mới là thứ đang chặn bạn.',
          },
        }],
        practice: [
          'Viết 5 bài Task 2 có bấm giờ. Bắt buộc dừng viết ở phút 35.',
          'Ghi lại: mỗi lần soát bắt được bao nhiêu lỗi. Con số đó chứng minh 5 phút soát đáng giá.',
        ],
      },
      {
        id: 'n5', n: 15, title: 'Bài kiểm tra cuối — bạn đã 7.5 chưa?',
        goal: 'Tự đánh giá xem đã đạt mục tiêu cuối của cả lộ trình chưa.',
        blocks: [{
          explain:
            'Sáu phép kiểm cuối cùng của cả khoá. Đạt 5/6 là bạn đã ở vùng 7.0–7.5.',
          examples: [
            { en: '1. Writing: tỷ lệ câu KHÔNG LỖI trên 70% qua 3 bài liên tiếp.', vi: 'phép kiểm quan trọng nhất của chặng 4' },
            { en: '2. Sổ lỗi cá nhân: mọi mục đã không tái phạm trong 5 bài gần nhất.', vi: '' },
            { en: '3. Reading: 35+/40 trong đúng 60 phút.', vi: '' },
            { en: '4. Listening: 35+/40, ổn định qua 3 đề.', vi: '' },
            { en: '5. Speaking: Part 3 tranh luận được hai chiều, có ngữ điệu lên xuống, dùng giảm nhẹ tự nhiên.', vi: '' },
            { en: '6. Task 2 xong trong 38 phút và đã soát đủ 6 lượt.', vi: '' },
          ],
          mistake: {
            wrong: 'Đo bằng cảm giác "mình viết hay rồi".',
            right: 'Đếm tỷ lệ câu không lỗi. Đó là con số giám khảo thật sự nhìn ở band 7.',
            why: 'Mô tả band 7 dùng đúng cụm "frequent error-free sentences". Đây là thứ đo được, không phải cảm giác.',
          },
        }],
        practice: [
          'Làm đủ 6 phép kiểm trong một tuần.',
          'Mục nào chưa đạt thì quay lại chủ điểm tương ứng: lỗi vặt → chủ điểm 1, dùng từ → chủ điểm 2, nói → chủ điểm 3.',
          'Đạt 5/6 thì bạn đã đi hết lộ trình. Việc còn lại chỉ là giữ nhịp và thi.',
        ],
      },
    ],
  },
];
