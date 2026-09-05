/**
 * Chặng 5 (7.5 → 8.0) — VIẾT và NÓI.
 *
 * Điểm khác biệt lớn nhất so với bốn chặng trước: ở đây bài mẫu "yếu" KHÔNG
 * phải bài dở. Nó là bài band 7.0 — đúng ngữ pháp, đủ ý, không sai gì đáng
 * kể. Nếu không đặt cạnh bài band 8 thì gần như không ai chỉ ra được nó thiếu
 * gì, và đó chính là lý do rất nhiều người dừng ở 7.0 mà không hiểu vì sao.
 *
 * Mỗi bài mẫu đều kèm phần chỉ rõ ba đến bốn chỗ tạo ra khoảng cách — không
 * phải "từ vựng hay hơn", vì đó không phải sự thật.
 */
import type { WritingTask, SpeakingTopic } from '../types';

/* ══════════════════ VIẾT ══════════════════ */

export const WRITINGS5: WritingTask[] = [
  {
    id: 's5w1',
    task: 'Task 1 (Academic)',
    title: 'Biểu đồ đường — tỷ lệ hộ gia đình tự sửa đồ điện',
    figure: {
      kind: 'line',
      title: 'Proportion of households repairing their own appliances, 1960–2020',
      note: 'Số liệu tự đặt cho bài luyện. Dạng đường nhiều chuỗi là chỗ kỹ năng CHỌN LỌC lộ ra rõ nhất: có 24 con số, và bài band 8 chỉ dùng khoảng sáu.',
      unit: '% hộ gia đình',
      categories: ['1960', '1970', '1980', '1990', '2000', '2010', '2020'],
      series: [
        { name: 'Anh', values: [62, 58, 47, 31, 18, 11, 9] },
        { name: 'Nhật', values: [55, 60, 58, 44, 26, 15, 21] },
        { name: 'Đức', values: [58, 55, 51, 42, 30, 24, 26] },
      ],
    },
    prompt: 'The graph below shows the proportion of households repairing their own appliances in three countries between 1960 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    promptVi: 'Biểu đồ cho biết tỷ lệ hộ gia đình tự sửa đồ điện ở ba nước từ 1960 tới 2020. Tóm tắt bằng cách CHỌN LỌC và tường thuật các đặc điểm chính, có so sánh khi phù hợp.',
    minWords: 150,
    minutes: 20,
    outline: [
      { part: 'Câu mở', what: 'Viết lại đề bằng từ khác. Một câu, không thêm gì.' },
      { part: 'Câu tổng quan', what: 'Xu hướng bao trùm (cả ba đều giảm mạnh) + điểm bất thường (hai nước bật lại sau 2010) + thứ tự cuối kỳ. KHÔNG một con số nào.' },
      { part: 'Thân 1', what: 'Anh — nước giảm sâu nhất và không hồi phục. Dùng 2–3 con số, mỗi con số phục vụ một so sánh.' },
      { part: 'Thân 2', what: 'Nhật và Đức — hai nước có điểm đảo chiều. Nhật là trường hợp đặc biệt: tăng trước rồi mới giảm.' },
    ],
    phrases: [
      { en: 'The graph charts the proportion of households…', vi: 'Biểu đồ thể hiện tỷ lệ hộ gia đình…' },
      { en: 'Overall, all three countries saw a pronounced decline, although…', vi: 'Nhìn chung, cả ba nước đều giảm rõ rệt, mặc dù…' },
      { en: 'the only country to reverse direction', vi: 'nước duy nhất đảo chiều' },
      { en: 'fell to a low of … before recovering to …', vi: 'giảm xuống mức đáy… trước khi hồi lên…' },
      { en: 'having first risen from … to …', vi: 'sau khi ban đầu tăng từ… lên…' },
      { en: 'by which point … had overtaken …', vi: 'tới thời điểm đó… đã vượt qua…' },
      { en: 'a gap of roughly … percentage points', vi: 'khoảng cách chừng… điểm phần trăm' },
    ],
    sample: {
      band: 'Mức 8.0 — chọn lọc rõ, mỗi số phục vụ một so sánh',
      text: 'The graph charts the proportion of households carrying out their own appliance repairs in the UK, Japan and Germany over a sixty-year period.\n\nOverall, all three countries saw a pronounced decline, but the pattern was not uniform: Japan and Germany both reversed direction in the final decade, while the UK continued to fall throughout. Japan is also the only country whose figure rose before it fell, and by 2020 the UK had fallen from first place to a clear last.\n\nThe UK began at 62% and declined without interruption, losing more than half its figure between 1980 and 2000 alone. By 2020 it stood at 9%, less than a sixth of its starting level and well below either comparator.\n\nJapan followed a different path, climbing from 55% to a peak of 60% in 1970 before falling steeply to a low of 15% in 2010. It then recovered to 21%, more than double the UK figure by the end of the period. Germany declined more gradually than either, and its modest rebound after 2010 left it highest of the three, at 26%.',
      note: '181 từ. Bốn dấu hiệu band 8, không cái nào liên quan tới từ vựng khó: (1) OVERVIEW không có một con số nào nhưng nêu đủ xu hướng chung, điểm bất thường và thứ tự cuối kỳ; (2) chỉ dùng 7 trong số 21 con số — đó là "selecting"; (3) mỗi số giữ lại đều đi kèm một so sánh ("less than a sixth of its starting level", "more than double the UK figure by the end of the period"); (4) nhận ra Nhật có hình dạng KHÁC HẲN (tăng trước rồi giảm) chứ không gộp chung "cả ba đều giảm".',
    },
    weakSample: {
      band: 'Mức 7.0 — không sai gì, nhưng liệt kê thay vì chọn lọc',
      text: 'The graph shows the proportion of households repairing their own appliances in three countries from 1960 to 2020.\n\nOverall, the proportion decreased in all three countries. The UK had the biggest decrease from 62% to 9%.\n\nIn 1960, the UK was 62%, Japan was 55% and Germany was 58%. In 1970, the UK fell to 58% while Japan rose to 60% and Germany was 55%. In 1980, the figures were 47%, 58% and 51%. In 1990, they were 31%, 44% and 42%. In 2000, the UK was 18%, Japan was 26% and Germany was 30%.\n\nIn 2010, the UK was 11%, Japan was 15% and Germany was 24%. In 2020, the UK was 9%, Japan was 21% and Germany was 26%. So Germany was the highest in 2020.',
      problems: [
        'Đây là bài KHÔNG SAI GÌ — ngữ pháp đúng, số liệu chính xác, đủ số từ. Nó vẫn chỉ 7.0, và đó là điều cần hiểu.',
        'Overview có chứa số liệu và chỉ nêu được một ý. Thiếu hẳn điểm bất thường (hai nước bật lại) — mà đó mới là đặc điểm chính đáng báo cáo nhất.',
        'Thân bài đọc lại toàn bộ bảng số: 21 con số, không con số nào phục vụ một so sánh. Đây là làm ngược lại chữ "selecting" trong đề.',
        'Bỏ sót việc Nhật TĂNG trước khi giảm — hình dạng khác hẳn hai nước kia, và là chi tiết dễ ăn điểm nhất trong cả biểu đồ.',
        'Lặp cấu trúc "In [năm], X was …%" sáu lần liền → Coherence bị trừ vì bài không có tiến triển, chỉ có danh sách.',
        'Câu cuối bắt đầu bằng "So" — văn nói, không hợp Task 1.',
      ],
    },
    mistakes: [
      { wrong: 'The UK was 62% in 1960.', right: 'The figure for the UK stood at 62% in 1960.', why: 'Một quốc gia không "là" một tỷ lệ phần trăm. Ở band 8, chủ ngữ phải là "the figure/proportion/percentage", không phải tên nước.' },
      { wrong: 'Japan increased 5% between 1960 and 1970.', right: 'Japan rose by 5 percentage points between 1960 and 1970.', why: 'Từ 55% lên 60% là tăng 5 ĐIỂM PHẦN TRĂM, không phải 5%. Đây là lỗi nội dung, và với biểu đồ phần trăm thì nó xuất hiện ở gần như mọi bài band 7.' },
      { wrong: 'Germany was the highest country in 2020.', right: 'Germany recorded the highest figure of the three in 2020.', why: '"highest country" là kết hợp sai — nước không cao thấp, con số mới cao thấp.' },
      { wrong: 'The trend will continue to decrease in the future.', right: '(bỏ hẳn câu này)', why: 'Task 1 tuyệt đối không dự đoán và không bình luận. Câu dự đoán bị tính là nội dung ngoài đề, kéo Task Achievement xuống.' },
    ],
  },
  {
    id: 's5w2',
    task: 'Task 2',
    title: 'Đề Opinion — chính sách dựa trên bằng chứng',
    prompt: 'Governments should only fund social programmes that have been proven effective in scientific trials. To what extent do you agree or disagree? Write at least 250 words.',
    promptVi: 'Chính phủ chỉ nên cấp kinh phí cho những chương trình xã hội đã được chứng minh hiệu quả qua thử nghiệm khoa học. Bạn đồng ý hay không đồng ý tới mức nào?',
    minWords: 250,
    minutes: 40,
    outline: [
      { part: 'Câu lập trường (nháp)', what: 'Viết ra nháp TRƯỚC khi viết bài: "Đồng ý với nguyên tắc, phản đối chữ ONLY vì nó giả định thử nghiệm đo được mọi thứ." Đọc lại câu này trước mỗi đoạn.' },
      { part: 'Mở bài', what: '2 câu: bối cảnh 1 câu + nêu thẳng lập trường 1 câu. Không định nghĩa từ, không "in this modern era".' },
      { part: 'Thân 1 — nhượng bộ có sức nặng', what: 'Vì sao yêu cầu bằng chứng là đúng: nêu MỘT cơ chế cụ thể (tiền công chi cho thứ không hiệu quả là tiền lấy khỏi thứ hiệu quả). Nhượng bộ thật lòng, không cho có lệ.' },
      { part: 'Thân 2 — chỗ chữ ONLY sai', what: 'Thử nghiệm đo được thứ đo được. Chương trình dài hạn và chương trình cho nhóm nhỏ gần như không thể thử nghiệm — quy tắc "chỉ cấp cho cái đã chứng minh" sẽ loại bỏ chúng một cách có hệ thống. Đây là ý mạnh nhất của bài.' },
      { part: 'Kết bài', what: '2 câu, nhắc lại ĐÚNG lập trường ban đầu bằng từ khác. Không cân bằng chung chung.' },
    ],
    phrases: [
      { en: 'The principle behind this proposal is sound, but the word "only" carries more weight than it can bear.', vi: 'Nguyên tắc đằng sau đề xuất này là đúng, nhưng chữ "chỉ" gánh nhiều hơn sức nó chịu được.' },
      { en: 'I would concede that…', vi: 'Tôi thừa nhận rằng…' },
      { en: 'The difficulty is not with the principle but with what it excludes.', vi: 'Khó khăn không nằm ở nguyên tắc mà ở thứ nó loại trừ.' },
      { en: 'A rule of this kind selects systematically against…', vi: 'Một quy tắc kiểu này loại bỏ một cách có hệ thống…' },
      { en: 'evidence of absence is not absence of evidence', vi: 'không có bằng chứng không đồng nghĩa với bằng chứng về sự vô hiệu' },
      { en: 'This is why … rather than …', vi: 'Đây là lý do… chứ không phải…' },
    ],
    sample: {
      band: 'Mức 8.0 — hai ý được kéo sâu, lập trường nhất quán, cơ chế cụ thể thay cho nghiên cứu bịa',
      text: 'Public money spent on a programme that does not work is money taken from one that does, so the demand for evidence is entirely reasonable. The principle behind this proposal is sound; the difficulty lies in the word "only", which assumes that trials can measure everything worth funding.\n\nI would concede that the case for evidence is stronger than it is usually made to sound. Governments face genuine competition between programmes, and without some standard of proof the decision falls to whoever argues most persuasively in the room. Requiring a trial disciplines that process: it forces the sponsor of a scheme to state in advance what success would look like, which is often the first time anyone has been made to do so. Where a programme is short, self-contained and has a measurable outcome — a vaccination campaign, a literacy intervention — there is little excuse for not testing it.\n\nThe difficulty is not with the principle but with what it excludes. A trial measures what can be measured within its own timeframe, and the programmes that matter most are frequently those whose effects appear over decades or accrue to groups too small to produce a statistically significant result. Support for carers, provision for rare disabilities, cultural funding in remote communities — none of these can realistically be tested to the standard the proposal demands. A rule that funds only what has been proven would therefore select systematically against them, not because they fail but because they are hard to study. Absence of evidence would be treated as evidence of absence.\n\nGovernments should demand evidence wherever evidence is obtainable, and should say openly when it is not. What they should not do is mistake the limits of their instruments for the limits of what is worth doing.',
      note: '297 từ. Bốn thứ tạo ra band 8, và không thứ nào là "từ vựng cao cấp": (1) LẬP TRƯỜNG neo vào một chữ cụ thể trong đề ("only") và giữ nguyên từ câu đầu tới câu cuối; (2) đoạn nhượng bộ có SỨC NẶNG THẬT — nó đưa ra một lý lẽ mới cho phía kia ("forces the sponsor to state in advance what success would look like") thay vì nhượng bộ cho có; (3) ý chính được kéo qua bốn bước: nguyên tắc → cơ chế → ba ví dụ cụ thể → hệ quả có tên gọi; (4) câu kết đưa ra một quan sát rộng hơn câu hỏi ("mistake the limits of their instruments for the limits of what is worth doing"). Đếm câu: 13 câu, không câu nào có lỗi.',
    },
    weakSample: {
      band: 'Mức 7.0 — đúng, đủ, mạch lạc, và vẫn không hơn được',
      text: 'In today\'s world, governments have limited budgets and must spend money wisely. I agree that social programmes should be proven effective before receiving funding, although there are some exceptions.\n\nFirstly, scientific trials provide objective evidence. Without them, decisions may be based on opinion rather than fact. Many studies have shown that evidence-based policies are more successful. Therefore, requiring proof is a sensible approach that protects taxpayers\' money.\n\nSecondly, funding ineffective programmes wastes resources. If a programme does not work, the money could be used for education or healthcare instead. This is especially important in developing countries where budgets are very limited.\n\nHowever, there are some disadvantages. Some programmes are difficult to test scientifically. Also, trials take a long time and are expensive. Moreover, some benefits cannot be measured easily.\n\nIn conclusion, I believe that governments should generally fund proven programmes, but they should also consider other factors. Both evidence and judgement are important, and a balance should be found between them.',
      problems: [
        'Bài này KHÔNG SAI GÌ. Ngữ pháp sạch, từ nối đúng, đủ 250 từ, có cả phần phản biện. Nó vẫn là 7.0 — và hiểu vì sao mới là nội dung của cả chặng 5.',
        'Ý nông: bốn ý, mỗi ý 2–3 câu, không ý nào được kéo tới cơ chế cụ thể. Descriptor band 8 đòi "extended and supported"; đây mới chỉ là "relevant".',
        '"Many studies have shown that evidence-based policies are more successful" là ví dụ GIẢ — không kiểm được, và giám khảo nhận ra ngay.',
        'Đoạn phản biện chỉ liệt kê ba câu ngắn ("difficult to test", "take a long time", "cannot be measured") mà không giải thích hệ quả của bất kỳ điều nào. Đây chính là chỗ bài band 8 đặt ý mạnh nhất của mình.',
        'Kết bài cân bằng chung chung ("a balance should be found") — xoá đi lập trường đã nêu ở mở bài. Có thể dán kết bài này vào bất kỳ đề nào, và đó là bằng chứng nó không trả lời đề nào.',
        'Mở bài dùng "In today\'s world" — công thức rỗng, không đóng góp gì và báo hiệu ngay cho giám khảo rằng bài đi theo khuôn.',
        'Từ nối máy móc: Firstly / Secondly / However / Also / Moreover / In conclusion. Ở band 8, mạch lạc đến từ nội dung nối được với nhau, không đến từ nhãn dán đầu câu.',
      ],
    },
    mistakes: [
      { wrong: 'In today\'s world, technology is developing rapidly.', right: '(bỏ hẳn, vào thẳng vấn đề)', why: 'Câu mở rỗng chiếm mất 10–15 từ và không đóng góp gì cho Task Response. Ở band 8, câu đầu tiên đã phải nói một điều gì đó thật.' },
      { wrong: 'Many studies have shown that this approach works.', right: 'Requiring a trial forces the sponsor to state in advance what success would look like.', why: 'Nghiên cứu bịa yếu hơn cơ chế cụ thể ở mọi phương diện. Cơ chế thì người đọc kiểm được bằng lý lẽ; "nhiều nghiên cứu" thì không.' },
      { wrong: 'In conclusion, both sides have advantages, so we should find a balance.', right: 'Governments should demand evidence wherever evidence is obtainable, and should say openly when it is not.', why: 'Kết bài phải nhắc lại đúng lập trường đã nêu. Câu "cân bằng" là dấu hiệu rõ nhất của bài không có lập trường.' },
      { wrong: 'Nhồi Firstly / Secondly / Moreover / Furthermore ở đầu mỗi đoạn.', right: 'Nối bằng nội dung: "The difficulty is not with the principle but with what it excludes."', why: 'Descriptor band 8 cho Coherence là "manages all aspects of cohesion well". Nhãn dán đầu câu là mức band 6–7; band 8 nối bằng ý.' },
    ],
  },
];

/* ══════════════════ NÓI ══════════════════ */

export const SPEAKINGS5: SpeakingTopic[] = [
  {
    id: 's5sp1',
    part: 'Part 3',
    title: 'Evidence, policy and what cannot be measured',
    titleVi: 'Bằng chứng, chính sách và những thứ không đo được',
    phrases: [
      { en: 'I would want to qualify that.', vi: 'Tôi xin hạn định lại điều đó.' },
      { en: 'I have not thought about this before, so let me reason through it out loud.', vi: 'Tôi chưa từng nghĩ về chuyện này, để tôi lập luận thành tiếng.' },
      { en: 'That depends on what we mean by …', vi: 'Điều đó tuỳ vào việc ta hiểu… là gì.' },
      { en: 'I suspect the causation runs the other way.', vi: 'Tôi ngờ rằng nhân quả đi theo chiều ngược lại.' },
      { en: 'The honest answer is that I am not sure, but my instinct is …', vi: 'Thành thật thì tôi không chắc, nhưng cảm nhận của tôi là…' },
      { en: 'I think that conflates two different things.', vi: 'Tôi nghĩ điều đó gộp nhầm hai chuyện khác nhau.' },
    ],
    questions: [
      {
        q: 'Should governments make decisions based only on data?',
        qVi: 'Chính phủ có nên ra quyết định chỉ dựa trên dữ liệu không?',
        weak: 'I think data is very important because it is objective and helps governments avoid mistakes. However, they should also consider other factors such as public opinion and expert advice, so a balance is needed.',
        good: 'That depends on what we mean by data, and I think the word hides a decision that has already been made. Every dataset is the result of someone choosing what to count — and things get counted when they are easy to count, not when they matter most. So a government that follows the data faithfully is not being neutral; it is inheriting the priorities of whoever designed the collection. I would still rather have the data than not: the alternative is deciding by whoever argues most confidently in the room, and that is worse. But I think the honest position is that data should constrain decisions rather than make them, and that the interesting question is always what the numbers are quietly leaving out.',
        goodVi: 'Điều đó tuỳ vào việc ta hiểu "dữ liệu" là gì, và tôi nghĩ chính chữ đó che đi một quyết định đã được đưa ra từ trước. Mọi tập dữ liệu đều là kết quả của việc ai đó chọn đếm cái gì — mà thứ được đếm là thứ dễ đếm, không phải thứ quan trọng nhất. Nên một chính phủ đi theo dữ liệu một cách trung thành thì không hề trung lập; nó đang thừa hưởng thứ tự ưu tiên của người đã thiết kế việc thu thập. Dù vậy tôi vẫn muốn có dữ liệu hơn là không: phương án thay thế là quyết định theo người nói tự tin nhất trong phòng, và điều đó tệ hơn. Nhưng tôi nghĩ lập trường thành thật là dữ liệu nên RÀNG BUỘC quyết định chứ không nên ĐƯA RA quyết định, và câu hỏi thú vị luôn là những con số đang âm thầm bỏ sót cái gì.',
        why: 'Câu "yếu" ở đây là câu band 7.0 hoàn chỉnh — đúng, cân bằng, không sai gì. Ba chỗ tạo ra khoảng cách lên band 8: (1) LẬT LẠI chính khái niệm trong câu hỏi ("tuỳ vào việc ta hiểu dữ liệu là gì") thay vì nhận nó như đã cho; (2) nêu được một CƠ CHẾ ("thứ được đếm là thứ dễ đếm") — đây là nội dung thật, không phải cách nói hay hơn; (3) vẫn giữ lập trường sau khi nhượng bộ, và chốt bằng một phân biệt sắc ("ràng buộc" vs "đưa ra quyết định"). Chú ý: không có một từ hiếm nào trong cả câu trả lời.',
      },
      {
        q: 'Do you think people trust official statistics less than they used to?',
        qVi: 'Bạn có nghĩ người ta ngày càng ít tin vào số liệu chính thức không?',
        weak: 'Yes, I think so. Nowadays there is a lot of fake news on social media, so people do not know what to believe. Also, some governments have been dishonest in the past, which damaged public trust.',
        good: 'Probably yes, though I suspect the causation runs the other way from how it is usually told. The standard story is that misinformation arrived and trust collapsed. But statistics became much more visible before they became less trusted — they moved from annual reports that almost nobody read into daily headlines, and anything you see every day, you eventually see disagreeing with your own experience. Someone told that inflation is four per cent while their rent has risen by twenty does not conclude that they have misunderstood the index; they conclude that the number is dishonest. And in a narrow sense they are right, because the index is an average over a basket that is not theirs. So I would say the loss of trust is partly a side effect of transparency, which is an uncomfortable thing to admit, since the remedy people usually propose is more transparency.',
        goodVi: 'Có lẽ đúng, dù tôi ngờ rằng quan hệ nhân quả đi theo chiều ngược với cách người ta thường kể. Câu chuyện tiêu chuẩn là thông tin sai xuất hiện rồi niềm tin sụp đổ. Nhưng số liệu thống kê trở nên DỄ THẤY hơn nhiều trước khi nó bị mất tin — chúng đi từ những báo cáo thường niên gần như không ai đọc vào tiêu đề báo hằng ngày, mà thứ gì bạn thấy mỗi ngày thì rốt cuộc bạn sẽ thấy nó mâu thuẫn với trải nghiệm của chính mình. Một người được bảo rằng lạm phát là bốn phần trăm trong khi tiền thuê nhà của họ tăng hai mươi thì không kết luận rằng mình hiểu sai chỉ số; họ kết luận rằng con số đó không trung thực. Và ở một nghĩa hẹp thì họ đúng, vì chỉ số ấy là trung bình trên một rổ hàng không phải rổ của họ. Nên tôi cho rằng việc mất niềm tin một phần là tác dụng phụ của sự minh bạch — một điều khó chịu khi phải thừa nhận, vì cách chữa mà người ta hay đề xuất lại chính là minh bạch hơn nữa.',
        why: 'Đây là mẫu điển hình của câu trả lời band 8 ở Part 3: (1) mở bằng một HẠN ĐỊNH ("probably yes, though…") thay vì đồng ý thẳng; (2) nêu tên "câu chuyện tiêu chuẩn" rồi phản bác nó — cho thấy bạn biết người khác nghĩ gì; (3) một ví dụ CỤ THỂ có con số (lạm phát 4% vs tiền thuê 20%) thay cho khái quát; (4) câu chốt nêu một nghịch lý ("mất niềm tin là tác dụng phụ của minh bạch"). Về mặt ngôn ngữ, câu dài nhưng chia nhịp rõ — đó là "develops topics coherently", không phải nói nhiều.',
      },
      {
        q: 'Is it possible to measure the quality of education?',
        qVi: 'Có thể đo được chất lượng giáo dục không?',
        weak: 'It is difficult because education has many aspects. Exam results only show part of the picture. We should use different methods to measure it more fairly.',
        good: 'Partly, and I think the honest answer is that we can measure some real things and then let them stand in for the whole, which is a different problem from not measuring at all. Exam results do capture something genuine — working accurately under time pressure is a real skill, and it is not nothing. What they cannot capture is anything that shows up years later, or anything that depends on a student changing their mind, because a change of mind looks identical to inconsistency in any dataset. The trouble is that the measurable part then absorbs all the attention, since that is what schools are judged on. So I would not say quality is unmeasurable; I would say we measure a narrow slice of it accurately and then behave as though the slice were the whole, and that second step is where the damage happens.',
        goodVi: 'Một phần thôi, và tôi nghĩ câu trả lời thành thật là ta đo được một số thứ có thật rồi để chúng thay mặt cho toàn bộ — đó là một vấn đề khác với việc không đo gì cả. Điểm thi có nắm bắt được điều gì đó thật: làm việc chính xác dưới áp lực thời gian là một kỹ năng có thật, và không phải là không đáng gì. Thứ chúng không nắm được là bất cứ điều gì chỉ hiện ra sau nhiều năm, hoặc bất cứ điều gì phụ thuộc vào việc học sinh thay đổi quan điểm — bởi một sự thay đổi quan điểm trông giống hệt sự thiếu nhất quán trong mọi tập dữ liệu. Vấn đề là phần đo được sau đó hút hết sự chú ý, vì đó là thứ trường học bị đánh giá. Nên tôi sẽ không nói chất lượng là không đo được; tôi sẽ nói ta đo chính xác một lát cắt hẹp của nó rồi hành xử như thể lát cắt đó là toàn bộ — và bước thứ hai mới là chỗ gây hại.',
        why: 'Kỹ thuật mạnh nhất ở đây là ĐỔI LẠI CÂU HỎI: người hỏi đưa ra lựa chọn nhị phân (đo được / không đo được), câu trả lời từ chối cả hai và chỉ ra rằng vấn đề thật nằm ở chỗ khác ("bước thứ hai mới là chỗ gây hại"). Đây là dấu hiệu rất rõ của band 8 vì nó cho thấy bạn nhìn ra CẤU TRÚC của vấn đề. Thêm một chi tiết đáng học: câu "a change of mind looks identical to inconsistency in any dataset" là một quan sát sắc mà vẫn dùng toàn từ thường.',
      },
    ],
  },
];

export const SPEAKING_RULES5: { title: string; body: string }[] = [
  { title: 'Được phép dừng để NGHĨ, không được dừng để TÌM TỪ', body: 'Descriptor band 8 nói thẳng: "hesitation is usually content-related, and only rarely to search for language". Học thuộc 5 câu câu giờ hợp lệ ("That is an interesting way to put it — let me think about the second half") là cách rẻ nhất để mọi chỗ dừng của bạn rơi vào loại được chấp nhận.' },
  { title: 'Lật lại khái niệm trong câu hỏi', body: '"That depends on what we mean by data" — kỹ thuật mạnh nhất ở Part 3. Nó cho thấy bạn nhìn ra cấu trúc của vấn đề chứ không chỉ có ý kiến về nó, và nó mua thêm cho bạn vài giây suy nghĩ hoàn toàn hợp lệ.' },
  { title: 'Từ chối lựa chọn nhị phân khi nó sai', body: 'Câu hỏi Part 3 hay đưa ra hai phương án ("đo được hay không đo được"). Band 7 chọn một. Band 8 chỉ ra rằng câu hỏi thật nằm ở chỗ khác — nhưng phải chỉ ra được chỗ khác đó là gì, nếu không thì thành né câu hỏi.' },
  { title: 'Một ví dụ cụ thể có số ăn đứt ba khái quát', body: '"Lạm phát 4% trong khi tiền thuê nhà tăng 20%" làm được việc mà ba câu khái quát không làm nổi. Chuẩn bị sẵn 5–6 con số thật về Việt Nam (dân số đô thị, tuổi trung bình, tỷ lệ dùng smartphone) — chúng dùng được cho hàng chục chủ đề.' },
  { title: 'Giữ giọng Việt được, nhưng phải giữ phụ âm cuối', body: 'Descriptor band 8 Pronunciation là "L1 accent has minimal effect on intelligibility" — không đòi bỏ giọng. Thứ thật sự ảnh hưởng, theo đúng thứ tự: phụ âm cuối (mất /s/ là mất ngữ pháp), trọng âm từ, rồi ngữ điệu câu. Giọng vùng miền gần như không tính.' },
  { title: 'Câu chốt phải rộng hơn câu hỏi', body: 'Kết thúc bằng một quan sát giải thích được điều gì đó ngoài phạm vi được hỏi ("mất niềm tin là tác dụng phụ của minh bạch"). Đây là thứ phân biệt 8.0 với 7.5 — và nó nằm ở nội dung, không nằm ở từ vựng.' },
];
