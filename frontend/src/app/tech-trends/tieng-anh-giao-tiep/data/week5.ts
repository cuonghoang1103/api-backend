/**
 * TUẦN 5 — Bảo vệ ý kiến (Ngày 21–25). Mở đầu phần NÂNG CAO.
 *
 * Bốn tuần đầu lo "nói được". Từ đây lo "nói có trọng lượng": nêu quan điểm
 * có lập luận, phản biện mà không gây chiến, thuyết phục người khác đổi ý, và
 * giữ được bình tĩnh khi bị hỏi khó. Đây là nhóm câu quyết định bạn có được
 * lắng nghe trong phòng họp hay không.
 */
import type { WeekBlock } from './types';

export const WEEK_5: WeekBlock = {
  week: 5,
  title: 'Bảo vệ ý kiến',
  subtitle:
    'Nêu quan điểm có lập luận, phản biện lịch sự, thuyết phục và xử lý câu hỏi khó — ' +
    'nhóm câu khiến ý kiến của bạn có trọng lượng.',
  days: [
    {
      day: 21,
      icon: '💡',
      title: 'Nêu quan điểm có lập luận',
      goal: 'Nói ra ý kiến kèm lý do và bằng chứng, thay vì chỉ "I think it is good".',
      qa: [
        {
          q: { en: 'What’s your take on this?', vi: 'Bạn nghĩ sao về việc này?', ipa: '/jɔːr teɪk/', note: '"take" = góc nhìn. Tự nhiên hơn "opinion" trong hội thoại.' },
          answers: [
            { en: 'In my view, we should start small and measure the results.', vi: 'Theo tôi, chúng ta nên bắt đầu nhỏ và đo kết quả.', ipa: '/ɪn maɪ vjuː/' },
            { en: 'I’d argue that speed matters more than perfection here.', vi: 'Tôi cho rằng ở đây tốc độ quan trọng hơn sự hoàn hảo.', ipa: '/aɪd ˈɑːɡjuː/', note: '"I\'d argue that…" nghe chắc chắn và có lập luận.' },
            { en: 'Honestly, I’m on the fence. Let me explain why.', vi: 'Thú thật tôi còn phân vân. Để tôi giải thích.', ipa: '/ɒn ðə fens/', note: '"on the fence" = chưa ngả về bên nào.' },
          ],
        },
        {
          q: { en: 'Why do you think so?', vi: 'Vì sao bạn nghĩ vậy?', ipa: '/waɪ duː juː θɪŋk səʊ/' },
          answers: [
            { en: 'Mainly because our users have asked for it three times this month.', vi: 'Chủ yếu vì người dùng đã yêu cầu ba lần trong tháng này.', ipa: '/ˈmeɪnli bɪˈkɒz/', note: 'Lý do kèm SỐ LIỆU luôn thuyết phục hơn cảm tính.' },
            { en: 'Based on what we saw last quarter, it should reduce load by half.', vi: 'Dựa trên những gì thấy quý trước, nó sẽ giảm một nửa tải.', ipa: '/beɪst ɒn/' },
            { en: 'From my experience, this approach breaks under heavy traffic.', vi: 'Theo kinh nghiệm của tôi, cách này sẽ vỡ khi lưu lượng cao.', ipa: '/frɒm maɪ ɪkˈspɪəriəns/' },
          ],
        },
        {
          q: { en: 'Can you back that up?', vi: 'Bạn có gì chứng minh không?', ipa: '/bæk ðæt ʌp/', note: '"back up" = chứng minh, hậu thuẫn bằng dữ liệu.' },
          answers: [
            { en: 'Sure — the logs show a 40% drop after the change.', vi: 'Được — log cho thấy giảm 40% sau khi đổi.', ipa: '/ˈfɔːti pəˈsent/' },
            { en: 'I can pull the numbers and share them after this call.', vi: 'Tôi lấy số liệu và gửi sau cuộc gọi này.', ipa: '/pʊl ðə ˈnʌmbəz/' },
            { en: 'Not with hard data yet, but here’s the reasoning.', vi: 'Chưa có số liệu cứng, nhưng đây là lập luận.', ipa: '/hɑːd ˈdeɪtə/', note: 'Trung thực khi chưa có bằng chứng — vẫn giữ được uy tín.' },
          ],
        },
        {
          q: { en: 'How confident are you about that?', vi: 'Bạn chắc chắn tới mức nào?', ipa: '/ˈkɒnfɪdənt/' },
          answers: [
            { en: 'Fairly confident — I’d say 80%.', vi: 'Khá chắc — khoảng 80%.', ipa: '/ˈfeəli/', note: 'Đưa con số làm câu trả lời đáng tin hơn hẳn.' },
            { en: 'It’s my best guess, but I could be wrong.', vi: 'Đó là phỏng đoán tốt nhất của tôi, nhưng có thể sai.', ipa: '/best ɡes/' },
          ],
        },
        {
          q: { en: 'What would you do in my position?', vi: 'Ở vị trí tôi bạn sẽ làm gì?', ipa: '/ɪn maɪ pəˈzɪʃn/' },
          answers: [
            { en: 'If I were you, I’d ship it and iterate.', vi: 'Nếu là bạn, tôi sẽ phát hành rồi cải tiến dần.', ipa: '/ɪf aɪ wɜː juː/', note: 'Câu điều kiện loại 2: "If I were", KHÔNG phải "If I was".' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Defending a technical choice',
          titleVi: 'Bảo vệ một lựa chọn kỹ thuật',
          lines: [
            { who: 'Lead', en: 'What’s your take on rewriting this module?', vi: 'Bạn nghĩ sao về việc viết lại module này?' },
            { who: 'Cuong', en: 'I’d argue we shouldn’t — at least not now.', vi: 'Tôi cho rằng không nên — ít nhất là chưa lúc này.' },
            { who: 'Lead', en: 'Why do you think so?', vi: 'Vì sao bạn nghĩ vậy?' },
            { who: 'Cuong', en: 'Mainly because it works and it’s not our bottleneck. The slow part is the database.', vi: 'Chủ yếu vì nó vẫn chạy tốt và không phải nút thắt. Chỗ chậm là cơ sở dữ liệu.' },
            { who: 'Lead', en: 'Can you back that up?', vi: 'Bạn có gì chứng minh không?' },
            { who: 'Cuong', en: 'Sure — the logs show 80% of the response time is in queries. I can share them after this call.', vi: 'Được — log cho thấy 80% thời gian phản hồi nằm ở truy vấn. Tôi sẽ gửi sau cuộc gọi.' },
          ],
        },
      ],
      vocab: [
        { en: 'take (n)', ipa: '/teɪk/', vi: 'góc nhìn, ý kiến', pos: 'n' },
        { en: 'back up', ipa: '/bæk ʌp/', vi: 'chứng minh bằng dữ liệu', pos: 'phr' },
        { en: 'on the fence', ipa: '/ɒn ðə fens/', vi: 'còn phân vân', pos: 'phr' },
        { en: 'bottleneck', ipa: '/ˈbɒtlnek/', vi: 'nút thắt cổ chai', pos: 'n' },
        { en: 'reasoning', ipa: '/ˈriːzənɪŋ/', vi: 'lập luận', pos: 'n' },
        { en: 'iterate', ipa: '/ˈɪtəreɪt/', vi: 'cải tiến dần', pos: 'v' },
        { en: 'hard data', ipa: '/hɑːd ˈdeɪtə/', vi: 'số liệu cứng', pos: 'n' },
        { en: 'assumption', ipa: '/əˈsʌmpʃn/', vi: 'giả định', pos: 'n' },
        { en: 'evidence', ipa: '/ˈevɪdəns/', vi: 'bằng chứng', pos: 'n' },
        { en: 'trade-off', ipa: '/ˈtreɪd ɒf/', vi: 'sự đánh đổi', pos: 'n' },
      ],
      grammar: [
        {
          title: 'Câu điều kiện loại 2 — giả định trái thực tế',
          explain:
            'Dùng khi bàn phương án chưa xảy ra hoặc đặt mình vào vị trí người khác. Lưu ý: dùng "were" ' +
            'cho MỌI ngôi, kể cả "I".',
          formula: 'If + S + quá khứ đơn (were), S + would + V',
          examples: [
            { en: 'If I were you, I’d ship it.', vi: 'Nếu là bạn, tôi sẽ phát hành.' },
            { en: 'If we had more time, we would rewrite it.', vi: 'Nếu có thêm thời gian, chúng tôi sẽ viết lại.' },
          ],
          mistake: '❌ "If I was you" — sai trong văn trang trọng. ✅ "If I were you".',
        },
        {
          title: 'Cụm mở đầu ý kiến theo mức chắc chắn',
          explain: 'Chọn cụm đúng với độ chắc chắn của bạn — nói quá chắc rồi sai sẽ mất uy tín.',
          formula:
            'I’m certain… (rất chắc) > I’d argue… / In my view… (có lập luận) > It seems to me… (vừa phải) '
            + '> I might be wrong, but… (dè dặt)',
          examples: [
            { en: 'It seems to me that users prefer the old layout.', vi: 'Với tôi thì có vẻ người dùng thích bố cục cũ hơn.' },
            { en: 'I might be wrong, but this looks like a caching issue.', vi: 'Có thể tôi sai, nhưng cái này giống lỗi bộ đệm.' },
          ],
        },
      ],
      sound: {
        sound: '/ɪə/ và /eə/',
        how: '/ɪə/ trượt từ /ɪ/ sang /ə/ (here). /eə/ trượt từ /e/ sang /ə/ (there). Hai âm rất dễ lẫn.',
        words: [
          { en: 'here', ipa: '/hɪə/', vi: 'ở đây' },
          { en: 'there', ipa: '/ðeə/', vi: 'ở kia' },
          { en: 'idea', ipa: '/aɪˈdɪə/', vi: 'ý tưởng' },
          { en: 'career', ipa: '/kəˈrɪə/', vi: 'sự nghiệp' },
          { en: 'share', ipa: '/ʃeə/', vi: 'chia sẻ' },
        ],
        sentence: { en: 'I’ll share my idea here, not there.', vi: 'Tôi sẽ chia sẻ ý tưởng ở đây, không phải ở kia.' },
        trap: 'Đừng đọc "idea" thành "ai-đia" cụt — âm cuối phải trượt về /ə/.',
      },
      practice: [
        'Chọn một quyết định kỹ thuật bạn từng làm, viết 3 câu bảo vệ nó có kèm số liệu.',
        'Luyện công thức: Ý kiến → "Mainly because…" → "The data shows…".',
        'Viết 5 câu điều kiện loại 2 về công việc của bạn.',
        'Luyện /ɪə/ – /eə/: "here–hair", "beer–bear", "idea–share".',
      ],
    },

    {
      day: 22,
      icon: '⚖️',
      title: 'Phản biện mà không gây chiến',
      goal: 'Không đồng tình nhưng vẫn giữ được quan hệ — kỹ năng khó nhất trong họp.',
      qa: [
        {
          q: { en: 'Do you agree with this plan?', vi: 'Bạn có đồng ý với kế hoạch này không?', ipa: '/əˈɡriː wɪð/' },
          answers: [
            { en: 'I agree with the goal, but I’d question the timeline.', vi: 'Tôi đồng ý mục tiêu, nhưng tôi băn khoăn về tiến độ.', ipa: '/ˈkwestʃən/', note: 'Tách phần ĐỒNG Ý ra trước — người nghe không thấy bị phủ nhận toàn bộ.' },
            { en: 'I see it differently, and here’s why.', vi: 'Tôi nhìn nhận khác, và đây là lý do.', ipa: '/ˈdɪfrəntli/', note: 'Nhẹ hơn nhiều so với "I disagree".' },
            { en: 'Help me understand the reasoning behind this part.', vi: 'Giúp tôi hiểu lập luận đằng sau phần này.', ipa: '/help miː ˌʌndəˈstænd/', note: 'Câu vàng: nghe như đang hỏi, thực chất đang chất vấn.' },
          ],
        },
        {
          q: { en: 'You don’t seem convinced.', vi: 'Có vẻ bạn chưa bị thuyết phục.', ipa: '/kənˈvɪnst/' },
          answers: [
            { en: 'I’m not, to be honest. My concern is the cost.', vi: 'Thú thật là chưa. Điều tôi lo là chi phí.', ipa: '/maɪ kənˈsɜːn ɪz/' },
            { en: 'I’m warming up to it, but I still have questions.', vi: 'Tôi đang dần thấy ổn, nhưng vẫn còn thắc mắc.', ipa: '/ˈwɔːmɪŋ ʌp/' },
          ],
        },
        {
          q: { en: 'What’s your concern exactly?', vi: 'Chính xác thì bạn lo điều gì?', ipa: '/ɪɡˈzæktli/' },
          answers: [
            { en: 'My main worry is that we can’t roll it back easily.', vi: 'Lo lắng chính của tôi là không thể hoàn tác dễ dàng.', ipa: '/rəʊl ɪt bæk/' },
            { en: 'I’m worried we’re solving the wrong problem.', vi: 'Tôi lo chúng ta đang giải sai vấn đề.', ipa: '/rɒŋ ˈprɒbləm/', note: 'Câu phản biện mạnh nhất mà vẫn lịch sự.' },
          ],
        },
        {
          q: { en: 'Fair enough. What would you suggest instead?', vi: 'Hợp lý. Vậy bạn đề xuất gì thay thế?', ipa: '/feər ɪˈnʌf/', note: '"Fair enough" = chấp nhận ý kiến người kia. Rất hay dùng.' },
          answers: [
            { en: 'What if we tried a smaller version first?', vi: 'Hay là thử một bản nhỏ hơn trước?', ipa: '/wɒt ɪf wiː/', note: '"What if…?" đề xuất mà không áp đặt.' },
            { en: 'I’d suggest we run a test before committing.', vi: 'Tôi đề xuất chạy thử trước khi quyết.', ipa: '/kəˈmɪtɪŋ/' },
          ],
        },
        {
          q: { en: 'Let’s agree to disagree.', vi: 'Thôi mình cứ giữ ý kiến của mỗi người vậy.', ipa: '/əˈɡriː tuː ˌdɪsəˈɡriː/', note: 'Cách kết thúc tranh luận mà không ai mất mặt.' },
          answers: [
            { en: 'Sounds good. Let’s revisit this next week.', vi: 'Được. Tuần sau mình bàn lại.', ipa: '/ˌriːˈvɪzɪt/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Disagreeing in a meeting',
          titleVi: 'Phản biện trong buổi họp',
          lines: [
            { who: 'Sarah', en: 'I think we should launch next Friday.', vi: 'Tôi nghĩ ta nên ra mắt thứ Sáu tới.' },
            { who: 'Cuong', en: 'I agree with the goal, but I’d question the timeline.', vi: 'Tôi đồng ý mục tiêu, nhưng tôi băn khoăn về tiến độ.' },
            { who: 'Sarah', en: 'What’s your concern exactly?', vi: 'Chính xác thì bạn lo điều gì?' },
            { who: 'Cuong', en: 'My main worry is that we can’t roll it back easily if something breaks.', vi: 'Lo chính của tôi là không hoàn tác được dễ dàng nếu có sự cố.' },
            { who: 'Sarah', en: 'Fair enough. What would you suggest instead?', vi: 'Hợp lý. Vậy bạn đề xuất gì?' },
            { who: 'Cuong', en: 'What if we released it to 10% of users first?', vi: 'Hay là phát hành cho 10% người dùng trước?' },
            { who: 'Sarah', en: 'That’s reasonable. Let’s do that.', vi: 'Hợp lý đấy. Làm vậy đi.' },
          ],
        },
      ],
      vocab: [
        { en: 'convinced', ipa: '/kənˈvɪnst/', vi: 'bị thuyết phục', pos: 'adj' },
        { en: 'Fair enough', ipa: '/feər ɪˈnʌf/', vi: 'Hợp lý, tôi hiểu', pos: 'phr' },
        { en: 'roll back', ipa: '/rəʊl bæk/', vi: 'hoàn tác', pos: 'phr' },
        { en: 'revisit', ipa: '/ˌriːˈvɪzɪt/', vi: 'bàn lại', pos: 'v' },
        { en: 'reasonable', ipa: '/ˈriːznəbl/', vi: 'hợp lý', pos: 'adj' },
        { en: 'push back', ipa: '/pʊʃ bæk/', vi: 'phản đối, đẩy lùi yêu cầu', pos: 'phr' },
        { en: 'compromise', ipa: '/ˈkɒmprəmaɪz/', vi: 'thoả hiệp', pos: 'n/v' },
        { en: 'valid point', ipa: '/ˈvælɪd pɔɪnt/', vi: 'ý kiến xác đáng', pos: 'n' },
        { en: 'warm up to', ipa: '/wɔːm ʌp tuː/', vi: 'dần thấy ổn với', pos: 'phr' },
      ],
      grammar: [
        {
          title: 'Công thức phản biện 3 lớp',
          explain:
            'Lớp 1 công nhận, lớp 2 nêu lo ngại, lớp 3 đề xuất thay thế. Thiếu lớp 3 thì bạn chỉ đang chê.',
          formula: '[Công nhận] + but/however + [lo ngại cụ thể] + What if / I’d suggest + [phương án]',
          examples: [
            { en: 'I agree with the goal, but the timeline worries me. What if we split it into two phases?', vi: 'Tôi đồng ý mục tiêu, nhưng tiến độ làm tôi lo. Hay là chia làm hai giai đoạn?' },
          ],
          mistake: 'Chỉ nêu lo ngại mà không có phương án → bị xem là cản trở thay vì đóng góp.',
        },
        {
          title: '"What if…?" — đề xuất không áp đặt',
          explain: 'Đặt phương án dưới dạng câu hỏi để người nghe cảm thấy vẫn được quyền quyết.',
          formula: 'What if + S + quá khứ đơn? (giả định) · What if + S + hiện tại? (khả năng thật)',
          examples: [
            { en: 'What if we tried a smaller version first?', vi: 'Hay là thử bản nhỏ hơn trước?' },
            { en: 'What if the server goes down?', vi: 'Nếu máy chủ sập thì sao?' },
          ],
        },
      ],
      sound: {
        sound: '/dʒ/ và /j/',
        how: '/dʒ/ bật ra như "j" trong "job", có rung. /j/ là âm lướt như "y" trong "yes", không bật.',
        words: [
          { en: 'just', ipa: '/dʒʌst/', vi: 'chỉ, vừa mới' },
          { en: 'suggest', ipa: '/səˈdʒest/', vi: 'đề xuất' },
          { en: 'year', ipa: '/jɪə/', vi: 'năm' },
          { en: 'yes', ipa: '/jes/', vi: 'vâng' },
          { en: 'major', ipa: '/ˈmeɪdʒə/', vi: 'chính, lớn' },
        ],
        sentence: { en: 'I just suggest we wait a year.', vi: 'Tôi chỉ đề xuất chờ một năm.' },
        trap: 'Người Việt hay đọc "just" thành "dat". Phải có tiếng bật /dʒ/ ở đầu.',
      },
      practice: [
        'Viết một lời phản biện đủ 3 lớp cho một quyết định bạn không đồng tình.',
        'Học thuộc: "I see it differently", "Help me understand…", "Fair enough", "What if…?".',
        'Tập nói: phản biện một ý kiến trong 30 giây mà không dùng từ "no" hay "wrong".',
      ],
    },

    {
      day: 23,
      icon: '🎯',
      title: 'Thuyết phục & chốt vấn đề',
      goal: 'Đưa người khác đi từ do dự đến đồng ý, rồi chốt thành hành động cụ thể.',
      qa: [
        {
          q: { en: 'Why should we go with your approach?', vi: 'Vì sao nên chọn cách của bạn?', ipa: '/ɡəʊ wɪð/' },
          answers: [
            { en: 'Three reasons: it’s faster, cheaper, and we’ve done it before.', vi: 'Ba lý do: nhanh hơn, rẻ hơn, và chúng ta từng làm rồi.', ipa: '/θriː ˈriːznz/', note: 'Đánh số lý do — người nghe dễ theo và dễ nhớ.' },
            { en: 'The main benefit is that we can ship two weeks earlier.', vi: 'Lợi ích chính là ta phát hành sớm hơn hai tuần.', ipa: '/ˈbenɪfɪt/' },
          ],
        },
        {
          q: { en: 'What’s the risk if we do that?', vi: 'Rủi ro nếu làm vậy là gì?', ipa: '/rɪsk/' },
          answers: [
            { en: 'The main risk is downtime, but we can mitigate it with a staged rollout.', vi: 'Rủi ro chính là gián đoạn, nhưng ta giảm được bằng cách triển khai theo đợt.', ipa: '/ˈmɪtɪɡeɪt/', note: 'Chủ động nêu rủi ro + cách giảm → tăng độ tin cậy rất nhiều.' },
            { en: 'Honestly, the bigger risk is doing nothing.', vi: 'Thú thật, rủi ro lớn hơn là không làm gì.', ipa: '/ˈbɪɡər rɪsk/' },
          ],
        },
        {
          q: { en: 'I’m still not sure.', vi: 'Tôi vẫn chưa chắc.', ipa: '/stɪl nɒt ʃʊər/' },
          answers: [
            { en: 'What would it take to convince you?', vi: 'Cần gì để thuyết phục được bạn?', ipa: '/wɒt wʊd ɪt teɪk/', note: 'Câu cực mạnh — buộc người kia nói ra điều kiện thật của họ.' },
            { en: 'Would a small trial help you decide?', vi: 'Một lần chạy thử nhỏ có giúp bạn quyết được không?', ipa: '/ə smɔːl ˈtraɪəl/' },
          ],
        },
        {
          q: { en: 'Okay, let’s do it.', vi: 'Được, làm thôi.', ipa: '/lets duː ɪt/' },
          answers: [
            { en: 'Great. So to confirm: I’ll start Monday and report back Friday.', vi: 'Tuyệt. Vậy xác nhận lại: tôi bắt đầu thứ Hai và báo cáo thứ Sáu.', ipa: '/tuː kənˈfɜːm/', note: 'LUÔN chốt lại thành hành động + mốc thời gian, nếu không sẽ trôi.' },
            { en: 'Perfect. Who owns which part?', vi: 'Tuyệt. Ai phụ trách phần nào?', ipa: '/huː əʊnz/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Getting a decision made',
          titleVi: 'Chốt một quyết định',
          lines: [
            { who: 'Cuong', en: 'Why should we go with caching? Three reasons: it’s fast to build, cheap, and reversible.', vi: 'Vì sao nên chọn caching? Ba lý do: làm nhanh, rẻ, và hoàn tác được.' },
            { who: 'Client', en: 'What’s the risk?', vi: 'Rủi ro là gì?' },
            { who: 'Cuong', en: 'Stale data for up to five minutes. We can mitigate that with a shorter cache time.', vi: 'Dữ liệu cũ tối đa năm phút. Ta giảm được bằng cách rút ngắn thời gian đệm.' },
            { who: 'Client', en: 'I’m still not sure.', vi: 'Tôi vẫn chưa chắc.' },
            { who: 'Cuong', en: 'What would it take to convince you? Would a one-week trial help?', vi: 'Cần gì để thuyết phục bạn? Một tuần chạy thử có giúp không?' },
            { who: 'Client', en: 'Yes, let’s try that.', vi: 'Được, thử đi.' },
            { who: 'Cuong', en: 'Great. So to confirm: trial starts Monday, we review results next Friday.', vi: 'Tuyệt. Xác nhận lại: chạy thử từ thứ Hai, xem kết quả thứ Sáu tuần sau.' },
          ],
        },
      ],
      vocab: [
        { en: 'mitigate', ipa: '/ˈmɪtɪɡeɪt/', vi: 'giảm thiểu (rủi ro)', pos: 'v' },
        { en: 'benefit', ipa: '/ˈbenɪfɪt/', vi: 'lợi ích', pos: 'n' },
        { en: 'trial', ipa: '/ˈtraɪəl/', vi: 'lần chạy thử', pos: 'n' },
        { en: 'reversible', ipa: '/rɪˈvɜːsəbl/', vi: 'hoàn tác được', pos: 'adj' },
        { en: 'staged rollout', ipa: '/steɪdʒd ˈrəʊlaʊt/', vi: 'triển khai theo đợt', pos: 'n' },
        { en: 'own (a task)', ipa: '/əʊn/', vi: 'phụ trách', pos: 'v' },
        { en: 'stale data', ipa: '/steɪl ˈdeɪtə/', vi: 'dữ liệu cũ', pos: 'n' },
        { en: 'convince', ipa: '/kənˈvɪns/', vi: 'thuyết phục', pos: 'v' },
      ],
      grammar: [
        {
          title: 'Cấu trúc thuyết phục PREP',
          explain:
            'Point (quan điểm) → Reason (lý do) → Example (ví dụ) → Point (nhắc lại). Dùng được cả trong '
            + 'họp lẫn phỏng vấn, giúp câu trả lời có đầu có cuối trong 30 giây.',
          formula: 'Quan điểm → "because…" → "For example…" → "So that’s why…"',
          examples: [
            { en: 'We should cache this, because the query runs 500 times a minute. For example, last week it caused a timeout. So that’s why I’d cache it.', vi: 'Ta nên đệm chỗ này, vì truy vấn chạy 500 lần mỗi phút. Ví dụ tuần trước nó gây hết thời gian chờ. Nên đó là lý do tôi muốn đệm.' },
          ],
        },
        {
          title: 'Câu chốt hành động',
          explain: 'Cuộc họp không có câu chốt thì mọi thứ sẽ trôi. Luôn kết bằng AI làm GÌ, KHI NÀO.',
          formula: 'So to confirm: [ai] will [làm gì] by [khi nào].',
          examples: [
            { en: 'So to confirm: I’ll send the report by Thursday.', vi: 'Xác nhận lại: tôi sẽ gửi báo cáo trước thứ Năm.' },
          ],
        },
      ],
      sound: {
        sound: '/ʒ/',
        how: 'Giống /ʃ/ nhưng CÓ rung cổ họng. Âm hiếm nhưng nằm trong nhiều từ công việc.',
        words: [
          { en: 'decision', ipa: '/dɪˈsɪʒn/', vi: 'quyết định' },
          { en: 'measure', ipa: '/ˈmeʒə/', vi: 'đo lường' },
          { en: 'version', ipa: '/ˈvɜːʒn/', vi: 'phiên bản' },
          { en: 'usually', ipa: '/ˈjuːʒuəli/', vi: 'thường' },
          { en: 'visual', ipa: '/ˈvɪʒuəl/', vi: 'trực quan' },
        ],
        sentence: { en: 'The decision is usually based on measured versions.', vi: 'Quyết định thường dựa trên các phiên bản đã đo.' },
        trap: 'Đừng đọc "decision" thành "đi-si-sần" — âm giữa là /ʒ/ có rung.',
      },
      practice: [
        'Viết một lập luận theo PREP cho một đề xuất kỹ thuật của bạn.',
        'Học thuộc: "What would it take to convince you?" và "So to confirm: …".',
        'Tập chủ động nêu rủi ro + cách giảm cho một dự án bạn đang làm.',
      ],
    },

    {
      day: 24,
      icon: '🛡️',
      title: 'Xử lý câu hỏi khó & bị chất vấn',
      goal: 'Giữ bình tĩnh khi bị hỏi dồn, không biết thì nói không biết mà vẫn giữ uy tín.',
      qa: [
        {
          q: { en: 'Why did this happen on your watch?', vi: 'Vì sao chuyện này xảy ra khi bạn phụ trách?', ipa: '/ɒn jɔːr wɒtʃ/', note: 'Câu chất vấn nặng. Bí quyết: nhận phần trách nhiệm, chuyển sang giải pháp.' },
          answers: [
            { en: 'That’s on me. Here’s what happened and what I’ve changed since.', vi: 'Đó là trách nhiệm của tôi. Đây là chuyện đã xảy ra và điều tôi đã thay đổi.', ipa: '/ðæts ɒn miː/', note: '"That\'s on me" = tôi nhận trách nhiệm. Rất được tôn trọng.' },
            { en: 'We missed it in review. We’ve added a check so it can’t repeat.', vi: 'Chúng tôi bỏ sót lúc duyệt. Đã thêm bước kiểm tra để không tái diễn.', ipa: '/wiːv ˈædɪd/' },
          ],
        },
        {
          q: { en: 'Do you actually know what you’re doing?', vi: 'Bạn có thật sự biết mình đang làm gì không?', ipa: '/ˈæktʃuəli/', note: 'Câu xúc phạm. Đừng phản ứng cảm tính — trả lời bằng dữ kiện.' },
          answers: [
            { en: 'I understand the frustration. Let me walk you through what we’ve done.', vi: 'Tôi hiểu sự bực bội. Để tôi trình bày những gì chúng tôi đã làm.', ipa: '/frʌˈstreɪʃn/', note: 'Công nhận cảm xúc TRƯỚC, rồi mới đưa dữ kiện.' },
            { en: 'Fair question. Here’s the data behind the decision.', vi: 'Câu hỏi hợp lý. Đây là dữ liệu đằng sau quyết định.', ipa: '/feə ˈkwestʃən/' },
          ],
        },
        {
          q: { en: 'Can you guarantee it won’t happen again?', vi: 'Bạn đảm bảo được là sẽ không tái diễn chứ?', ipa: '/ˌɡærənˈtiː/' },
          answers: [
            { en: 'I can’t guarantee zero issues, but I can guarantee we’ll catch it faster.', vi: 'Tôi không đảm bảo được không có sự cố, nhưng đảm bảo sẽ phát hiện nhanh hơn.', ipa: '/ˈzɪərəʊ ˈɪʃuːz/', note: 'KHÔNG hứa điều không giữ được — hứa cái mình kiểm soát được.' },
          ],
        },
        {
          q: { en: 'I need an answer right now.', vi: 'Tôi cần câu trả lời ngay bây giờ.', ipa: '/raɪt naʊ/' },
          answers: [
            { en: 'I don’t have that number in front of me. I’ll send it within the hour.', vi: 'Tôi không có con số đó ngay đây. Tôi sẽ gửi trong vòng một tiếng.', ipa: '/ɪn frʌnt əv miː/', note: 'Bịa số liệu là cách nhanh nhất để mất uy tín vĩnh viễn.' },
            { en: 'The honest answer is: I don’t know yet. Here’s how I’ll find out.', vi: 'Câu trả lời thật là: tôi chưa biết. Đây là cách tôi sẽ tìm ra.', ipa: '/ˈɒnɪst ˈɑːnsər/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Handling an angry client',
          titleVi: 'Xử lý khách hàng đang bực',
          lines: [
            { who: 'Client', en: 'The site was down for an hour. Why did this happen?', vi: 'Trang web sập một tiếng. Vì sao lại thế?' },
            { who: 'Cuong', en: 'I understand the frustration, and that’s on me. Let me explain.', vi: 'Tôi hiểu sự bực bội, và đó là trách nhiệm của tôi. Để tôi giải thích.' },
            { who: 'Client', en: 'Go on.', vi: 'Nói đi.' },
            { who: 'Cuong', en: 'A database connection leak filled the pool. We fixed it in 40 minutes and added monitoring.', vi: 'Rò rỉ kết nối cơ sở dữ liệu làm đầy pool. Chúng tôi sửa trong 40 phút và đã thêm giám sát.' },
            { who: 'Client', en: 'Can you guarantee it won’t happen again?', vi: 'Bạn đảm bảo không tái diễn chứ?' },
            { who: 'Cuong', en: 'I can’t guarantee zero issues, but I can guarantee we’ll catch it in minutes, not hours.', vi: 'Tôi không đảm bảo được không có sự cố, nhưng đảm bảo sẽ phát hiện trong vài phút thay vì vài giờ.' },
          ],
        },
      ],
      vocab: [
        { en: "That's on me", ipa: '/ðæts ɒn miː/', vi: 'Đó là trách nhiệm của tôi', pos: 'phr' },
        { en: 'frustration', ipa: '/frʌˈstreɪʃn/', vi: 'sự bực bội', pos: 'n' },
        { en: 'guarantee', ipa: '/ˌɡærənˈtiː/', vi: 'đảm bảo', pos: 'v' },
        { en: 'walk (someone) through', ipa: '/wɔːk θruː/', vi: 'dẫn qua từng bước', pos: 'phr' },
        { en: 'root cause', ipa: '/ruːt kɔːz/', vi: 'nguyên nhân gốc', pos: 'n' },
        { en: 'accountable', ipa: '/əˈkaʊntəbl/', vi: 'chịu trách nhiệm', pos: 'adj' },
        { en: 'escalate', ipa: '/ˈeskəleɪt/', vi: 'đẩy lên cấp cao hơn', pos: 'v' },
      ],
      grammar: [
        {
          title: 'Công thức xử lý chất vấn: Công nhận → Dữ kiện → Hành động',
          explain:
            'Đừng phản bác cảm xúc của người kia, và đừng phòng thủ. Công nhận cảm xúc, đưa dữ kiện lạnh, '
            + 'rồi kết bằng việc bạn đã/sẽ làm.',
          formula: 'I understand… + [dữ kiện cụ thể] + Here’s what we’ve done/will do…',
          examples: [
            { en: 'I understand the frustration. The outage lasted 40 minutes. We’ve added monitoring so it’s caught in minutes.', vi: 'Tôi hiểu sự bực bội. Gián đoạn kéo dài 40 phút. Chúng tôi đã thêm giám sát để phát hiện trong vài phút.' },
          ],
          mistake: 'Nói "It wasn\'t my fault" ngay đầu → nghe như chối bỏ, dù đúng sự thật.',
        },
        {
          title: 'Nói "không biết" mà vẫn chuyên nghiệp',
          explain: 'Không ai kỳ vọng bạn biết hết. Điều họ đánh giá là bạn có trung thực và có kế hoạch không.',
          formula: 'I don’t have that in front of me + I’ll [hành động] by [thời hạn].',
          examples: [
            { en: 'I don’t know yet, but I’ll find out and reply by end of day.', vi: 'Tôi chưa biết, nhưng tôi sẽ tìm hiểu và trả lời trong hôm nay.' },
          ],
        },
      ],
      sound: {
        sound: 'Ngữ điệu giữ bình tĩnh',
        how:
          'Khi bị chất vấn, hạ THẤP cao độ giọng và nói CHẬM lại. Giọng cao và nhanh nghe như đang '
          + 'phòng thủ; giọng trầm và chậm nghe như đang kiểm soát tình hình.',
        words: [
          { en: 'I understand.', ipa: '/aɪ ˌʌndəˈstænd/', vi: 'Tôi hiểu.' },
          { en: 'Let me explain.', ipa: '/let miː ɪkˈspleɪn/', vi: 'Để tôi giải thích.' },
          { en: "That's on me.", ipa: '/ðæts ɒn miː/', vi: 'Đó là lỗi của tôi.' },
        ],
        sentence: { en: 'I understand. Let me walk you through it.', vi: 'Tôi hiểu. Để tôi trình bày từng bước.' },
        trap: 'Nói nhanh khi bị dồn là phản xạ tự nhiên — phải luyện để CHỦ ĐỘNG chậm lại.',
      },
      practice: [
        'Viết câu trả lời cho "Why did this happen?" theo công thức Công nhận → Dữ kiện → Hành động.',
        'Học thuộc: "That\'s on me", "I understand the frustration", "I don\'t have that in front of me".',
        'Tập nói chậm: đọc một đoạn trả lời với tốc độ chậm hơn bình thường 30%.',
      ],
    },

    {
      day: 25,
      icon: '📋',
      title: 'Tóm tắt & kết luận',
      goal: 'Chốt lại cuộc thảo luận thành kết luận rõ ràng — kỹ năng khiến bạn được xem là người dẫn dắt.',
      qa: [
        {
          q: { en: 'Can you summarize where we are?', vi: 'Bạn tóm tắt xem chúng ta đang ở đâu được không?', ipa: '/ˈsʌməraɪz/' },
          answers: [
            { en: 'Sure. We agreed on A, we’re still deciding B, and C is blocked on the client.', vi: 'Vâng. Chúng ta đã chốt A, còn đang cân nhắc B, và C đang chờ phía khách hàng.', ipa: '/wiː əˈɡriːd ɒn/', note: 'Chia làm ba nhóm: đã chốt / đang bàn / đang chờ. Rất rõ ràng.' },
            { en: 'In short: we’re on track but two days behind.', vi: 'Ngắn gọn: đúng hướng nhưng chậm hai ngày.', ipa: '/ɪn ʃɔːt/' },
          ],
        },
        {
          q: { en: 'What did we decide?', vi: 'Chúng ta đã quyết gì?', ipa: '/dɪˈsaɪd/' },
          answers: [
            { en: 'We decided to go with the staged rollout starting Monday.', vi: 'Chúng ta quyết triển khai theo đợt, bắt đầu thứ Hai.', ipa: '/wiː dɪˈsaɪdɪd tuː/' },
            { en: 'Nothing final yet — we’ll decide after the trial.', vi: 'Chưa chốt hẳn — sẽ quyết sau lần chạy thử.', ipa: '/ˈnʌθɪŋ ˈfaɪnl/' },
          ],
        },
        {
          q: { en: 'Any open questions before we wrap up?', vi: 'Còn câu hỏi nào trước khi kết thúc không?', ipa: '/ræp ʌp/', note: '"wrap up" = kết thúc.' },
          answers: [
            { en: 'One: who’s handling the migration?', vi: 'Một câu: ai phụ trách phần di trú dữ liệu?', ipa: '/ˈhændlɪŋ/' },
            { en: 'None from my side. Thanks everyone.', vi: 'Phía tôi thì không. Cảm ơn mọi người.', ipa: '/frɒm maɪ saɪd/' },
          ],
        },
        {
          q: { en: 'What are the action items?', vi: 'Các đầu việc cần làm là gì?', ipa: '/ˈækʃn ˈaɪtəmz/' },
          answers: [
            { en: 'Three: I’ll set up the trial, Sarah writes the docs, and we review Friday.', vi: 'Ba việc: tôi dựng bản chạy thử, Sarah viết tài liệu, và thứ Sáu chúng ta rà lại.', ipa: '/θriː/', note: 'Mỗi đầu việc phải có TÊN NGƯỜI và MỐC THỜI GIAN.' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Closing a meeting well',
          titleVi: 'Kết thúc buổi họp gọn gàng',
          lines: [
            { who: 'Cuong', en: 'Before we wrap up, can I summarize where we are?', vi: 'Trước khi kết thúc, tôi tóm tắt lại được không?' },
            { who: 'Lead', en: 'Please do.', vi: 'Mời bạn.' },
            { who: 'Cuong', en: 'We agreed on the staged rollout. We’re still deciding the cache duration. And the design is blocked on the client.', vi: 'Chúng ta đã chốt triển khai theo đợt. Còn đang cân nhắc thời gian đệm. Và phần thiết kế đang chờ khách hàng.' },
            { who: 'Lead', en: 'That’s accurate. What are the action items?', vi: 'Chính xác. Các đầu việc là gì?' },
            { who: 'Cuong', en: 'Three: I set up the trial by Monday, Sarah writes the docs by Wednesday, we review together Friday.', vi: 'Ba việc: tôi dựng bản chạy thử trước thứ Hai, Sarah viết tài liệu trước thứ Tư, thứ Sáu cả nhóm rà lại.' },
            { who: 'Lead', en: 'Perfect. Any open questions?', vi: 'Tuyệt. Còn câu hỏi nào không?' },
            { who: 'Cuong', en: 'None from my side. I’ll send the notes after this.', vi: 'Phía tôi không. Tôi sẽ gửi biên bản sau đây.' },
          ],
        },
      ],
      vocab: [
        { en: 'summarize', ipa: '/ˈsʌməraɪz/', vi: 'tóm tắt', pos: 'v' },
        { en: 'wrap up', ipa: '/ræp ʌp/', vi: 'kết thúc', pos: 'phr' },
        { en: 'action item', ipa: '/ˈækʃn ˈaɪtəm/', vi: 'đầu việc cần làm', pos: 'n' },
        { en: 'blocked on', ipa: '/blɒkt ɒn/', vi: 'đang chờ (ai/cái gì)', pos: 'phr' },
        { en: 'in short', ipa: '/ɪn ʃɔːt/', vi: 'ngắn gọn là', pos: 'phr' },
        { en: 'takeaway', ipa: '/ˈteɪkəweɪ/', vi: 'điều đọng lại', pos: 'n' },
        { en: 'recap', ipa: '/ˈriːkæp/', vi: 'nhắc lại tóm tắt', pos: 'n/v' },
        { en: 'accurate', ipa: '/ˈækjərət/', vi: 'chính xác', pos: 'adj' },
      ],
      grammar: [
        {
          title: 'Khung tóm tắt ba nhóm',
          explain:
            'Mọi cuộc thảo luận đều rơi vào ba nhóm. Tóm theo khung này thì không ai còn mơ hồ.',
          formula: 'We agreed on… (đã chốt) · We’re still deciding… (đang bàn) · We’re blocked on… (đang chờ)',
          examples: [
            { en: 'We agreed on the plan, we’re still deciding the budget, and we’re blocked on legal.', vi: 'Đã chốt kế hoạch, còn đang bàn ngân sách, và đang chờ bộ phận pháp lý.' },
          ],
        },
        {
          title: 'Đầu việc phải có chủ và có hạn',
          explain: 'Đầu việc không có tên người thì không ai làm; không có hạn thì không bao giờ xong.',
          formula: '[Tên người] will [động từ] by [mốc thời gian].',
          examples: [
            { en: 'Sarah will write the docs by Wednesday.', vi: 'Sarah sẽ viết tài liệu trước thứ Tư.' },
          ],
        },
      ],
      practice: [
        'Tóm tắt buổi họp gần nhất của bạn theo khung ba nhóm.',
        'Học thuộc: "Before we wrap up…", "In short…", "What are the action items?".',
        'ÔN TUẦN 5: tập một buổi tranh luận giả định 3 phút — nêu quan điểm, bị phản biện, thuyết phục lại, rồi tóm tắt chốt.',
      ],
    },
  ],
};
