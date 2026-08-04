/**
 * TUẦN 3 — Cảm xúc & xã giao (Ngày 11–15).
 *
 * Đây là tuần khiến tiếng Anh của bạn nghe "có người" chứ không như máy dịch:
 * biết than mệt, biết an ủi, biết từ chối mà không mất lòng, biết xin lỗi và
 * nhờ vả. Người bản xứ đánh giá độ tự nhiên chủ yếu qua nhóm câu này.
 */
import type { WeekBlock } from './types';

export const WEEK_3: WeekBlock = {
  week: 3,
  title: 'Cảm xúc & xã giao',
  subtitle:
    'Nói cảm xúc, sức khoẻ, gọi điện, hẹn hò gặp gỡ, xin lỗi và nhờ vả — nhóm câu làm ' +
    'tiếng Anh của bạn nghe như người thật.',
  days: [
    /* ══════════════════ NGÀY 11 ══════════════════ */
    {
      day: 11,
      icon: '😊',
      title: 'Cảm xúc & sức khoẻ',
      goal: 'Nói được bạn đang cảm thấy thế nào, hỏi thăm và an ủi người khác đúng cách.',
      qa: [
        {
          q: { en: 'Are you okay?', vi: 'Bạn ổn không?', ipa: '/ɑːr juː əʊˈkeɪ/' },
          answers: [
            { en: "Yeah, I'm fine. Just tired.", vi: 'Ừ, tôi ổn. Chỉ hơi mệt thôi.', ipa: '/dʒʌst ˈtaɪəd/' },
            { en: "Not really, I'm a bit stressed.", vi: 'Không hẳn, tôi hơi căng thẳng.', ipa: '/strest/' },
            { en: "I'm okay, thanks for asking.", vi: 'Tôi ổn, cảm ơn bạn đã hỏi.', ipa: '/θæŋks fɔːr ˈɑːskɪŋ/' },
          ],
        },
        {
          q: { en: 'How are you feeling?', vi: 'Bạn thấy trong người thế nào?', ipa: '/ˈfiːlɪŋ/', note: 'Hỏi khi biết người kia đang ốm hoặc buồn.' },
          answers: [
            { en: 'Much better, thanks.', vi: 'Đỡ hơn nhiều rồi, cảm ơn.', ipa: '/mʌtʃ ˈbetər/' },
            { en: 'Still not great, to be honest.', vi: 'Thú thật vẫn chưa ổn lắm.', ipa: '/stɪl nɒt ɡreɪt/' },
            { en: "I've got a headache.", vi: 'Tôi bị đau đầu.', ipa: '/ˈhedeɪk/' },
          ],
        },
        {
          q: { en: "What's wrong?", vi: 'Có chuyện gì vậy?', ipa: '/wɒts rɒŋ/' },
          answers: [
            { en: "Nothing serious, don't worry.", vi: 'Không có gì nghiêm trọng, đừng lo.', ipa: '/ˈsɪəriəs/' },
            { en: "I'm just overwhelmed with work.", vi: 'Tôi chỉ đang quá tải công việc.', ipa: '/ˌəʊvəˈwelmd/' },
            { en: "I didn't sleep well last night.", vi: 'Tối qua tôi ngủ không ngon.', ipa: '/sliːp wel/' },
          ],
        },
        {
          q: { en: "I'm so happy for you!", vi: 'Tôi mừng cho bạn quá!', ipa: '/ˈhæpi fɔːr juː/' },
          answers: [
            { en: 'Thank you! That means a lot.', vi: 'Cảm ơn bạn! Điều đó có ý nghĩa lắm.', ipa: '/ðæt miːnz ə lɒt/' },
            { en: "Thanks! I'm really excited.", vi: 'Cảm ơn! Tôi rất phấn khích.', ipa: '/ɪkˈsaɪtɪd/' },
          ],
        },
        {
          q: { en: "I'm sorry to hear that.", vi: 'Tôi rất tiếc khi nghe điều đó.', ipa: '/sɒri tuː hɪər/', note: 'Câu an ủi chuẩn mực nhất. Học thuộc.' },
          answers: [
            { en: 'Thanks. I appreciate it.', vi: 'Cảm ơn. Tôi trân trọng điều đó.', ipa: '/əˈpriːʃieɪt/' },
            { en: "It's okay. These things happen.", vi: 'Không sao. Chuyện đó vẫn xảy ra mà.', ipa: '/ˈhæpn/' },
          ],
        },
        {
          q: { en: 'You look tired. Are you getting enough sleep?', vi: 'Trông bạn mệt. Bạn ngủ đủ không?', ipa: '/ɪˈnʌf sliːp/' },
          answers: [
            { en: "Honestly, no. I've been working late.", vi: 'Thú thật là không. Tôi làm khuya suốt.', ipa: '/ˈwɜːkɪŋ leɪt/' },
            { en: "I know. I need to take a break.", vi: 'Tôi biết. Tôi cần nghỉ ngơi.', ipa: '/teɪk ə breɪk/' },
          ],
        },
        {
          q: { en: 'Take care of yourself.', vi: 'Giữ gìn sức khoẻ nhé.', ipa: '/teɪk keər əv jɔːˈself/' },
          answers: [
            { en: 'I will, thanks. You too.', vi: 'Tôi sẽ vậy, cảm ơn. Bạn cũng thế.', ipa: '/juː tuː/' },
            { en: 'Thanks, I’ll get some rest.', vi: 'Cảm ơn, tôi sẽ nghỉ ngơi.', ipa: '/ɡet sʌm rest/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Checking on a friend',
          titleVi: 'Hỏi thăm bạn bè',
          lines: [
            { who: 'Linh', en: 'Hey, are you okay? You look tired.', vi: 'Này, cậu ổn không? Trông cậu mệt quá.' },
            { who: 'Nam', en: 'Not really. I’m a bit overwhelmed with work.', vi: 'Không hẳn. Tớ hơi quá tải công việc.' },
            { who: 'Linh', en: 'I’m sorry to hear that. Are you getting enough sleep?', vi: 'Tớ rất tiếc. Cậu ngủ đủ không?' },
            { who: 'Nam', en: 'Honestly, no. I’ve been working late every night.', vi: 'Thú thật là không. Tối nào tớ cũng làm khuya.' },
            { who: 'Linh', en: 'You need to take a break. Take care of yourself.', vi: 'Cậu cần nghỉ ngơi. Giữ gìn sức khoẻ nhé.' },
            { who: 'Nam', en: 'Thanks. I appreciate it. I’ll get some rest this weekend.', vi: 'Cảm ơn. Tớ trân trọng lắm. Cuối tuần tớ sẽ nghỉ.' },
          ],
        },
      ],
      vocab: [
        { en: 'stressed', ipa: '/strest/', vi: 'căng thẳng', pos: 'adj' },
        { en: 'overwhelmed', ipa: '/ˌəʊvəˈwelmd/', vi: 'quá tải', pos: 'adj' },
        { en: 'exhausted', ipa: '/ɪɡˈzɔːstɪd/', vi: 'kiệt sức', pos: 'adj' },
        { en: 'excited', ipa: '/ɪkˈsaɪtɪd/', vi: 'phấn khích', pos: 'adj' },
        { en: 'nervous', ipa: '/ˈnɜːvəs/', vi: 'hồi hộp, lo lắng', pos: 'adj' },
        { en: 'relieved', ipa: '/rɪˈliːvd/', vi: 'nhẹ nhõm', pos: 'adj' },
        { en: 'headache', ipa: '/ˈhedeɪk/', vi: 'đau đầu', pos: 'n' },
        { en: 'appreciate', ipa: '/əˈpriːʃieɪt/', vi: 'trân trọng', pos: 'v' },
        { en: 'take a break', ipa: '/teɪk ə breɪk/', vi: 'nghỉ giải lao', pos: 'phr' },
        { en: 'cheer up', ipa: '/tʃɪər ʌp/', vi: 'vui lên', pos: 'phr' },
        { en: 'feel under the weather', ipa: '/ˈʌndər ðə ˈweðər/', vi: 'thấy không khoẻ', pos: 'phr' },
      ],
      grammar: [
        {
          title: '"look / feel / sound" + tính từ',
          explain:
            'Nhóm động từ giác quan đi thẳng với TÍNH TỪ, không cần "like" (trừ khi theo sau là danh từ).',
          formula: 'S + look/feel/sound + tính từ · S + look/feel/sound like + danh từ',
          examples: [
            { en: 'You look tired.', vi: 'Trông bạn mệt.' },
            { en: 'That sounds great!', vi: 'Nghe hay đấy!' },
            { en: 'You look like your brother.', vi: 'Bạn trông giống anh trai bạn.' },
          ],
          mistake: '❌ "You look like tired" → ✅ "You look tired".',
        },
        {
          title: 'Cách nói giảm nhẹ để lịch sự',
          explain:
            'Người bản xứ hiếm khi nói thẳng điều tiêu cực. Họ chèn "a bit", "kind of", "not really", ' +
            '"to be honest" để làm mềm câu.',
          formula: 'a bit / kind of / a little + tính từ tiêu cực',
          examples: [
            { en: "I'm a bit stressed.", vi: 'Tôi hơi căng thẳng. (thay vì "I am very stressed")' },
            { en: "It's kind of boring.", vi: 'Nó hơi chán.' },
            { en: 'Not really, to be honest.', vi: 'Thú thật là không hẳn.' },
          ],
        },
      ],
      sound: {
        sound: '/ə/ (schwa)',
        how:
          'Âm YẾU nhất và PHỔ BIẾN nhất tiếng Anh. Miệng thả lỏng hoàn toàn, phát ra tiếng "ơ" rất nhẹ, ' +
          'rất nhanh. Mọi âm tiết KHÔNG nhấn đều có xu hướng biến thành /ə/.',
        words: [
          { en: 'about', ipa: '/əˈbaʊt/', vi: 'khoảng' },
          { en: 'problem', ipa: '/ˈprɒbləm/', vi: 'vấn đề' },
          { en: 'computer', ipa: '/kəmˈpjuːtər/', vi: 'máy tính' },
          { en: 'support', ipa: '/səˈpɔːt/', vi: 'hỗ trợ' },
          { en: 'develop', ipa: '/dɪˈveləp/', vi: 'phát triển' },
        ],
        sentence: { en: "The computer developer supports about seven problems.", vi: 'Lập trình viên máy tính hỗ trợ khoảng bảy vấn đề.' },
        trap:
          'Người Việt đọc RÕ mọi âm tiết nên nghe rất "cứng". Bí quyết nghe tự nhiên: nhấn mạnh âm tiết chính, ' +
          'NUỐT NHẸ các âm còn lại thành /ə/.',
      },
      practice: [
        'Viết 5 câu mô tả cảm xúc của bạn hôm nay, mỗi câu dùng một tính từ khác nhau.',
        'Học thuộc 2 câu an ủi: "I\'m sorry to hear that" và "That means a lot".',
        'Tập nói giảm nhẹ: viết lại 3 câu thẳng thừng thành câu mềm hơn bằng "a bit"/"kind of".',
        'Luyện schwa: đọc "computer – develop – support – problem", chỉ nhấn ĐÚNG một âm tiết mỗi từ.',
      ],
    },

    /* ══════════════════ NGÀY 12 ══════════════════ */
    {
      day: 12,
      icon: '📞',
      title: 'Gọi điện & nhắn tin',
      goal: 'Nghe/gọi điện thoại tự tin — nhóm kỹ năng khó nhất vì không có khẩu hình để đoán.',
      qa: [
        {
          q: { en: 'Hello, this is Cuong speaking.', vi: 'Alo, Cường đây ạ.', ipa: '/ðɪs ɪz/', note: 'Trên điện thoại dùng "This is…", KHÔNG dùng "I am…".' },
          answers: [
            { en: 'Hi Cuong, this is Sarah from ABC Company.', vi: 'Chào Cường, tôi là Sarah từ công ty ABC.', ipa: '/frɒm/' },
          ],
        },
        {
          q: { en: 'Can I speak to Mr. Nam, please?', vi: 'Cho tôi gặp anh Nam được không?', ipa: '/spiːk tuː/' },
          answers: [
            { en: 'Speaking.', vi: 'Tôi đây.', ipa: '/ˈspiːkɪŋ/', note: 'Một từ duy nhất — nghĩa là "chính tôi đang nói".' },
            { en: 'Hold on a moment, please.', vi: 'Vui lòng giữ máy một lát.', ipa: '/həʊld ɒn/' },
            { en: "He's not available right now. Can I take a message?", vi: 'Anh ấy hiện không có mặt. Tôi nhắn lại được không?', ipa: '/teɪk ə ˈmesɪdʒ/' },
          ],
        },
        {
          q: { en: 'Sorry, the line is breaking up. Can you hear me?', vi: 'Xin lỗi, đường truyền bị ngắt quãng. Bạn nghe tôi được không?', ipa: '/ˈbreɪkɪŋ ʌp/', note: 'CỰC KỲ hữu ích khi họp online.' },
          answers: [
            { en: "Yes, I can hear you now.", vi: 'Vâng, giờ tôi nghe được rồi.', ipa: '/hɪər juː/' },
            { en: "You're cutting out. Let me call you back.", vi: 'Bạn bị ngắt tiếng. Để tôi gọi lại.', ipa: '/ˈkʌtɪŋ aʊt/' },
          ],
        },
        {
          q: { en: 'Could you speak up a little?', vi: 'Bạn nói to hơn chút được không?', ipa: '/spiːk ʌp/' },
          answers: [
            { en: 'Sure, is this better?', vi: 'Được, thế này ổn hơn chứ?', ipa: '/ɪz ðɪs ˈbetər/' },
          ],
        },
        {
          q: { en: 'When would be a good time to call you back?', vi: 'Khi nào gọi lại cho bạn thì tiện?', ipa: '/kɔːl juː bæk/' },
          answers: [
            { en: 'Anytime after 3 p.m. works.', vi: 'Sau 3 giờ chiều lúc nào cũng được.', ipa: '/ˈenitaɪm/' },
            { en: 'Could you try tomorrow morning?', vi: 'Bạn thử gọi sáng mai được không?' },
          ],
        },
        {
          q: { en: 'Thanks for calling. Talk to you soon.', vi: 'Cảm ơn bạn đã gọi. Nói chuyện sau nhé.', ipa: '/tɔːk tuː juː suːn/' },
          answers: [
            { en: 'You too. Have a good day!', vi: 'Bạn cũng vậy. Chúc một ngày tốt lành!', ipa: '/hæv ə ɡʊd deɪ/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'A business phone call',
          titleVi: 'Cuộc gọi công việc',
          lines: [
            { who: 'Cuong', en: 'Hello, this is Cuong speaking.', vi: 'Alo, Cường đây ạ.' },
            { who: 'Sarah', en: 'Hi Cuong, this is Sarah from ABC Company. Do you have a minute?', vi: 'Chào Cường, tôi là Sarah từ công ty ABC. Bạn rảnh một phút không?' },
            { who: 'Cuong', en: 'Sure, go ahead.', vi: 'Được chứ, bạn nói đi.' },
            { who: 'Sarah', en: 'I wanted to check on the project timeline…', vi: 'Tôi muốn hỏi về tiến độ dự án…' },
            { who: 'Cuong', en: 'Sorry, the line is breaking up. Could you speak up a little?', vi: 'Xin lỗi, đường truyền bị ngắt. Bạn nói to hơn chút được không?' },
            { who: 'Sarah', en: 'Is this better? I said — how is the timeline looking?', vi: 'Thế này ổn hơn chứ? Tôi hỏi là — tiến độ thế nào rồi?' },
            { who: 'Cuong', en: 'Much better, thanks. We’re on track to finish by Friday.', vi: 'Tốt hơn nhiều, cảm ơn. Chúng tôi đang đúng tiến độ, xong trước thứ Sáu.' },
            { who: 'Sarah', en: 'Great. Thanks for the update. Talk to you soon.', vi: 'Tuyệt. Cảm ơn đã cập nhật. Nói chuyện sau nhé.' },
          ],
        },
      ],
      vocab: [
        { en: 'hold on', ipa: '/həʊld ɒn/', vi: 'giữ máy', pos: 'phr' },
        { en: 'break up (line)', ipa: '/breɪk ʌp/', vi: 'ngắt quãng (đường truyền)', pos: 'phr' },
        { en: 'cut out', ipa: '/kʌt aʊt/', vi: 'mất tiếng', pos: 'phr' },
        { en: 'speak up', ipa: '/spiːk ʌp/', vi: 'nói to lên', pos: 'phr' },
        { en: 'call back', ipa: '/kɔːl bæk/', vi: 'gọi lại', pos: 'phr' },
        { en: 'take a message', ipa: '/teɪk ə ˈmesɪdʒ/', vi: 'nhắn lại', pos: 'phr' },
        { en: 'on track', ipa: '/ɒn træk/', vi: 'đúng tiến độ', pos: 'phr' },
        { en: 'go ahead', ipa: '/ɡəʊ əˈhed/', vi: 'cứ nói đi', pos: 'phr' },
        { en: 'available', ipa: '/əˈveɪləbl/', vi: 'có mặt, rảnh', pos: 'adj' },
        { en: 'update', ipa: '/ˈʌpdeɪt/', vi: 'cập nhật', pos: 'n' },
      ],
      grammar: [
        {
          title: 'Câu gián tiếp — thuật lại lời người khác',
          explain:
            'Khi nhắn lại lời ai đó, động từ thường lùi một thì và đại từ phải đổi theo.',
          formula: 'S + said (that) + S + V(lùi thì)',
          examples: [
            { en: 'She said she would call back.', vi: 'Cô ấy nói sẽ gọi lại.' },
            { en: 'He said he was busy.', vi: 'Anh ấy nói anh ấy bận.' },
          ],
          mistake: '❌ "She said she will call" → ✅ "She said she would call".',
        },
        {
          title: 'Cụm động từ (phrasal verbs) trong điện thoại',
          explain:
            'Điện thoại dùng dày đặc phrasal verb. Học nguyên cụm chứ đừng dịch từng từ.',
          formula: 'hold on · call back · speak up · cut out · break up · hang up · pick up',
          examples: [
            { en: 'Hold on a moment.', vi: 'Giữ máy một lát.' },
            { en: "Don't hang up yet.", vi: 'Đừng cúp máy vội.' },
          ],
        },
      ],
      sound: {
        sound: 'Nối âm (linking)',
        how:
          'Người bản xứ NỐI phụ âm cuối từ trước với nguyên âm đầu từ sau. Đây là lý do bạn nghe ' +
          'không kịp dù biết hết từ.',
        words: [
          { en: 'pick it up', ipa: '/pɪ-kɪ-tʌp/', vi: 'nhặt nó lên' },
          { en: 'hold on', ipa: '/həʊl-dɒn/', vi: 'giữ máy' },
          { en: 'check it out', ipa: '/tʃe-kɪ-taʊt/', vi: 'xem thử đi' },
          { en: 'an hour', ipa: '/ə-ˈnaʊər/', vi: 'một giờ' },
          { en: 'not at all', ipa: '/nɒ-tə-tɔːl/', vi: 'không có gì' },
        ],
        sentence: { en: 'Hold on, let me check it out in an hour.', vi: 'Giữ máy nhé, một tiếng nữa tôi xem thử.' },
        trap: 'Đừng đọc rời từng từ. Hãy đọc cả cụm như MỘT từ dài.',
      },
      practice: [
        'Học thuộc 5 câu điện thoại: "This is … speaking", "Speaking", "Hold on", "The line is breaking up", "Talk to you soon".',
        'Gọi cho một người bạn và nói 2 phút hoàn toàn bằng tiếng Anh.',
        'Nghe một podcast tiếng Anh 5 phút, chú ý chỗ họ NỐI ÂM.',
        'Luyện nối âm: đọc nhanh "pick it up", "check it out", "not at all".',
      ],
    },

    /* ══════════════════ NGÀY 13 ══════════════════ */
    {
      day: 13,
      icon: '🤝',
      title: 'Lời mời, hẹn gặp & từ chối',
      goal: 'Mời ai đó, nhận lời, và đặc biệt: TỪ CHỐI mà không làm mất lòng.',
      qa: [
        {
          q: { en: 'Would you like to join us for dinner?', vi: 'Bạn có muốn đi ăn tối với chúng tôi không?', ipa: '/wʊd juː laɪk tuː dʒɔɪn/' },
          answers: [
            { en: "I'd love to! What time?", vi: 'Tôi rất muốn! Mấy giờ?', ipa: '/aɪd lʌv tuː/' },
            { en: 'That sounds great. Count me in.', vi: 'Nghe hay đấy. Tính tôi một suất.', ipa: '/kaʊnt miː ɪn/' },
            { en: "I'd love to, but I already have plans.", vi: 'Tôi rất muốn, nhưng tôi có hẹn rồi.', ipa: '/ɔːlˈredi/', note: 'CÔNG THỨC TỪ CHỐI: cảm ơn + lý do + gợi ý dịp khác.' },
          ],
        },
        {
          q: { en: 'Are you free this weekend?', vi: 'Cuối tuần này bạn rảnh không?', ipa: '/friː ðɪs ˈwiːkend/' },
          answers: [
            { en: 'Yes! What did you have in mind?', vi: 'Có! Bạn định làm gì?', ipa: '/hæv ɪn maɪnd/' },
            { en: "Saturday works, but Sunday I'm busy.", vi: 'Thứ Bảy thì được, Chủ nhật tôi bận.', ipa: '/ˈsætədeɪ/' },
            { en: "Sorry, I'm tied up this weekend. Maybe next time?", vi: 'Xin lỗi, cuối tuần này tôi bận kín. Lần sau nhé?', ipa: '/nekst taɪm/' },
          ],
        },
        {
          q: { en: 'Do you want to hang out sometime?', vi: 'Hôm nào đi chơi không?', ipa: '/hæŋ aʊt/' },
          answers: [
            { en: 'Sure, let’s do it!', vi: 'Được, làm thôi!', ipa: '/lets duː ɪt/' },
            { en: 'Definitely. Just let me know when.', vi: 'Chắc chắn rồi. Cứ báo tôi khi nào.', ipa: '/ˈdefɪnətli/' },
          ],
        },
        {
          q: { en: 'Can you make it on Friday?', vi: 'Thứ Sáu bạn tới được không?', ipa: '/meɪk ɪt/', note: '"make it" = tới được, đến được.' },
          answers: [
            { en: 'Yes, I can make it.', vi: 'Được, tôi tới được.', ipa: '/aɪ kæn meɪk ɪt/' },
            { en: "Sorry, I can't make it on Friday. How about Saturday?", vi: 'Xin lỗi, thứ Sáu tôi không tới được. Thứ Bảy nhé?', ipa: '/aɪ kɑːnt/' },
          ],
        },
        {
          q: { en: 'Something came up. Can we reschedule?', vi: 'Có việc đột xuất. Dời lịch được không?', ipa: '/keɪm ʌp/', note: '"something came up" = có việc phát sinh. Lý do lịch sự và an toàn nhất.' },
          answers: [
            { en: 'No problem at all. When works for you?', vi: 'Không sao cả. Khi nào thì tiện cho bạn?', ipa: '/wen wɜːks/' },
            { en: 'Sure, just let me know.', vi: 'Được, cứ báo tôi.', ipa: '/let miː nəʊ/' },
          ],
        },
        {
          q: { en: 'Thanks for the invite!', vi: 'Cảm ơn vì lời mời!', ipa: '/ðə ɪnˈvaɪt/' },
          answers: [
            { en: 'Of course! Hope you can come.', vi: 'Không có gì! Mong bạn tới được.', ipa: '/həʊp juː kæn kʌm/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Inviting and politely declining',
          titleVi: 'Mời và từ chối lịch sự',
          lines: [
            { who: 'Linh', en: 'Hey, would you like to join us for dinner tonight?', vi: 'Này, tối nay đi ăn tối với bọn tớ không?' },
            { who: 'Nam', en: 'I’d love to, but I already have plans. Sorry!', vi: 'Tớ rất muốn, nhưng tớ có hẹn rồi. Xin lỗi nhé!' },
            { who: 'Linh', en: 'No worries! Are you free this weekend instead?', vi: 'Không sao! Vậy cuối tuần này cậu rảnh không?' },
            { who: 'Nam', en: 'Saturday works for me. What did you have in mind?', vi: 'Thứ Bảy thì được. Cậu định làm gì?' },
            { who: 'Linh', en: 'Maybe coffee and a movie?', vi: 'Cà phê rồi xem phim nhé?' },
            { who: 'Nam', en: 'Sounds great. Count me in!', vi: 'Nghe hay đấy. Tính tớ một suất!' },
          ],
        },
      ],
      vocab: [
        { en: 'count me in', ipa: '/kaʊnt miː ɪn/', vi: 'tính tôi một suất', pos: 'phr' },
        { en: 'make it', ipa: '/meɪk ɪt/', vi: 'tới được', pos: 'phr' },
        { en: 'something came up', ipa: '/ˈsʌmθɪŋ keɪm ʌp/', vi: 'có việc đột xuất', pos: 'phr' },
        { en: 'have plans', ipa: '/hæv plænz/', vi: 'có hẹn rồi', pos: 'phr' },
        { en: 'hang out', ipa: '/hæŋ aʊt/', vi: 'đi chơi', pos: 'phr' },
        { en: 'invite', ipa: '/ɪnˈvaɪt/', vi: 'lời mời', pos: 'n' },
        { en: 'have in mind', ipa: '/hæv ɪn maɪnd/', vi: 'định, nghĩ tới', pos: 'phr' },
        { en: 'definitely', ipa: '/ˈdefɪnətli/', vi: 'chắc chắn rồi', pos: 'adv' },
        { en: 'maybe next time', ipa: '/nekst taɪm/', vi: 'lần sau nhé', pos: 'phr' },
      ],
      grammar: [
        {
          title: 'Công thức TỪ CHỐI lịch sự (3 bước)',
          explain:
            'Người bản xứ gần như không bao giờ nói "No" trống không. Luôn theo ba bước: ' +
            '(1) tỏ ý muốn, (2) nêu lý do ngắn, (3) đề xuất dịp khác.',
          formula: "I'd love to, but + [lý do]. + How about / Maybe [dịp khác]?",
          examples: [
            { en: "I'd love to, but I already have plans. Maybe next week?", vi: 'Tôi rất muốn, nhưng tôi có hẹn rồi. Tuần sau nhé?' },
            { en: "That sounds fun, but I'm tied up. Can we do it another time?", vi: 'Nghe vui đấy, nhưng tôi bận kín. Dịp khác nhé?' },
          ],
          mistake: 'Nói cụt "No, I am busy" nghe rất lạnh lùng và dễ mất lòng.',
        },
        {
          title: '"Would you like…?" vs "Do you want…?"',
          explain:
            'Cùng nghĩa nhưng khác mức lịch sự. Với khách hàng, người lớn tuổi, người mới quen → dùng "Would you like".',
          formula: 'Would you like + to V / N? (lịch sự) · Do you want + to V? (thân mật)',
          examples: [
            { en: 'Would you like to join us?', vi: 'Bạn có muốn tham gia cùng chúng tôi không?' },
            { en: 'Do you want to grab a coffee?', vi: 'Đi cà phê không?' },
          ],
        },
      ],
      sound: {
        sound: '/eɪ/',
        how: 'Nguyên âm đôi: bắt đầu ở /e/ rồi trượt lên /ɪ/. Miệng khép dần lại.',
        words: [
          { en: 'make', ipa: '/meɪk/', vi: 'làm' },
          { en: 'later', ipa: '/ˈleɪtər/', vi: 'sau này' },
          { en: 'today', ipa: '/təˈdeɪ/', vi: 'hôm nay' },
          { en: 'update', ipa: '/ˈʌpdeɪt/', vi: 'cập nhật' },
          { en: 'available', ipa: '/əˈveɪləbl/', vi: 'rảnh' },
        ],
        sentence: { en: 'Are you available to make it later today?', vi: 'Bạn có rảnh để tới muộn hơn hôm nay không?' },
        trap: 'Đừng đọc thành "ê" cụt. Phải có sự trượt: /e/ → /ɪ/.',
      },
      practice: [
        'Viết 3 lời mời khác nhau và 3 cách từ chối theo công thức 3 bước.',
        'Nhắn tin mời một người bạn đi cà phê hoàn toàn bằng tiếng Anh.',
        'Học thuộc: "I\'d love to, but…", "Count me in", "Something came up".',
        'Luyện /eɪ/: đọc "make – later – today – available".',
      ],
    },

    /* ══════════════════ NGÀY 14 ══════════════════ */
    {
      day: 14,
      icon: '🙏',
      title: 'Xin lỗi, cảm ơn & nhờ vả',
      goal: 'Nhờ người khác giúp một cách lịch sự, xin lỗi đúng mức, cảm ơn nhiều kiểu khác nhau.',
      qa: [
        {
          q: { en: 'Could you do me a favor?', vi: 'Bạn giúp tôi một việc được không?', ipa: '/duː miː ə ˈfeɪvər/', note: 'Cách mở lời nhờ vả chuẩn nhất.' },
          answers: [
            { en: 'Sure, what do you need?', vi: 'Được chứ, bạn cần gì?', ipa: '/wɒt duː juː niːd/' },
            { en: 'Of course, what’s up?', vi: 'Tất nhiên, chuyện gì thế?', ipa: '/wɒts ʌp/' },
            { en: 'I’d like to help, but I’m swamped right now.', vi: 'Tôi muốn giúp, nhưng giờ tôi ngập việc.', ipa: '/swɒmpt/' },
          ],
        },
        {
          q: { en: 'Would you mind helping me with this?', vi: 'Bạn giúp tôi việc này có phiền không?', ipa: '/wʊd juː maɪnd/', note: 'BẪY: trả lời "No" nghĩa là ĐỒNG Ý (không phiền).' },
          answers: [
            { en: 'Not at all!', vi: 'Không phiền chút nào!', ipa: '/nɒt æt ɔːl/', note: '= "Tôi sẵn lòng giúp".' },
            { en: "Of course not, I'd be happy to help.", vi: 'Tất nhiên không, tôi rất sẵn lòng.', ipa: '/ˈhæpi tuː help/' },
          ],
        },
        {
          q: { en: "I'm sorry, that was my fault.", vi: 'Tôi xin lỗi, đó là lỗi của tôi.', ipa: '/maɪ fɔːlt/' },
          answers: [
            { en: "It's okay, don't worry about it.", vi: 'Không sao, đừng bận tâm.', ipa: '/dəʊnt ˈwʌri/' },
            { en: 'No harm done.', vi: 'Không có thiệt hại gì đâu.', ipa: '/nəʊ hɑːm dʌn/' },
            { en: 'These things happen. Let’s fix it.', vi: 'Chuyện đó vẫn xảy ra. Sửa thôi.', ipa: '/lets fɪks ɪt/' },
          ],
        },
        {
          q: { en: 'Thank you so much for your help.', vi: 'Cảm ơn bạn rất nhiều vì đã giúp.', ipa: '/fɔːr jɔːr help/' },
          answers: [
            { en: "You're welcome!", vi: 'Không có gì!', ipa: '/jɔːr ˈwelkəm/' },
            { en: 'No problem at all.', vi: 'Không vấn đề gì cả.', ipa: '/nəʊ ˈprɒbləm/' },
            { en: 'Happy to help!', vi: 'Rất vui được giúp!', ipa: '/ˈhæpi tuː help/' },
            { en: 'Anytime!', vi: 'Lúc nào cũng được!', ipa: '/ˈenitaɪm/' },
          ],
        },
        {
          q: { en: 'Sorry to bother you, but do you have a minute?', vi: 'Xin lỗi làm phiền, bạn có một phút không?', ipa: '/ˈbɒðər juː/', note: 'Câu mở lời khi cần cắt ngang ai đó.' },
          answers: [
            { en: 'Sure, what’s up?', vi: 'Được, chuyện gì thế?', ipa: '/ʃʊər/' },
            { en: 'Can it wait 10 minutes? I’m in the middle of something.', vi: 'Đợi 10 phút được không? Tôi đang dở việc.', ipa: '/ɪn ðə ˈmɪdl/' },
          ],
        },
        {
          q: { en: 'I really appreciate it.', vi: 'Tôi thật sự trân trọng điều đó.', ipa: '/əˈpriːʃieɪt/', note: 'Mức cảm ơn cao hơn "thank you" — dùng khi ai đó giúp việc lớn.' },
          answers: [
            { en: "Don't mention it.", vi: 'Có gì đâu.', ipa: '/dəʊnt ˈmenʃn ɪt/' },
            { en: 'Glad I could help.', vi: 'Mừng vì tôi giúp được.', ipa: '/ɡlæd aɪ kʊd help/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Asking a colleague for help',
          titleVi: 'Nhờ đồng nghiệp giúp đỡ',
          lines: [
            { who: 'Cuong', en: 'Sorry to bother you, but do you have a minute?', vi: 'Xin lỗi làm phiền, cậu có một phút không?' },
            { who: 'Linh', en: 'Sure, what’s up?', vi: 'Được, chuyện gì thế?' },
            { who: 'Cuong', en: 'Would you mind helping me with this bug? I’ve been stuck for an hour.', vi: 'Cậu giúp tớ cái lỗi này có phiền không? Tớ kẹt cả tiếng rồi.' },
            { who: 'Linh', en: 'Not at all. Let me take a look.', vi: 'Không phiền chút nào. Để tớ xem thử.' },
            { who: 'Cuong', en: 'Thank you so much. I really appreciate it.', vi: 'Cảm ơn cậu nhiều lắm. Tớ thật sự trân trọng.' },
            { who: 'Linh', en: 'Happy to help! Anytime.', vi: 'Rất vui được giúp! Lúc nào cũng được.' },
          ],
        },
      ],
      vocab: [
        { en: 'do someone a favor', ipa: '/duː ˈsʌmwʌn ə ˈfeɪvər/', vi: 'giúp ai một việc', pos: 'phr' },
        { en: 'Would you mind…?', ipa: '/wʊd juː maɪnd/', vi: 'Bạn có phiền…?', pos: 'phr' },
        { en: 'bother', ipa: '/ˈbɒðər/', vi: 'làm phiền', pos: 'v' },
        { en: 'fault', ipa: '/fɔːlt/', vi: 'lỗi', pos: 'n' },
        { en: 'appreciate', ipa: '/əˈpriːʃieɪt/', vi: 'trân trọng', pos: 'v' },
        { en: 'be stuck', ipa: '/biː stʌk/', vi: 'bị kẹt, tắc', pos: 'phr' },
        { en: 'take a look', ipa: '/teɪk ə lʊk/', vi: 'xem thử', pos: 'phr' },
        { en: 'in the middle of something', ipa: '/ɪn ðə ˈmɪdl/', vi: 'đang dở việc', pos: 'phr' },
        { en: "Don't mention it", ipa: '/dəʊnt ˈmenʃn ɪt/', vi: 'Có gì đâu', pos: 'phr' },
      ],
      grammar: [
        {
          title: 'Thang lịch sự khi nhờ vả',
          explain:
            'Cùng một việc nhờ, mức lịch sự tăng dần. Với sếp hoặc khách hàng, hãy dùng mức cao nhất.',
          formula:
            'Can you…? (bình thường) < Could you…? (lịch sự) < Would you mind + V-ing? (rất lịch sự) ' +
            '< I was wondering if you could… (cực kỳ lịch sự)',
          examples: [
            { en: 'Can you help me?', vi: 'Giúp tôi được không?' },
            { en: 'Could you help me, please?', vi: 'Bạn giúp tôi được không ạ?' },
            { en: 'Would you mind helping me?', vi: 'Bạn giúp tôi có phiền không?' },
            { en: 'I was wondering if you could take a look at this.', vi: 'Không biết bạn có thể xem giúp tôi cái này không.' },
          ],
        },
        {
          title: 'Trả lời "Would you mind…?" — bẫy ngược',
          explain:
            '"Mind" nghĩa là "phiền". Nên trả lời "No" = "Không phiền" = ĐỒNG Ý. Trả lời "Yes" là TỪ CHỐI.',
          formula: 'Đồng ý → No / Not at all / Of course not · Từ chối → Actually, I\'m a bit busy…',
          examples: [
            { en: 'Would you mind waiting? — Not at all.', vi: 'Bạn đợi có phiền không? — Không phiền chút nào.' },
          ],
          mistake: 'Nhiều người Việt trả lời "Yes" khi muốn đồng ý → người nghe hiểu là bạn TỪ CHỐI.',
        },
      ],
      sound: {
        sound: 'Trọng âm từ (word stress)',
        how:
          'Mỗi từ nhiều âm tiết có MỘT âm tiết được nhấn: đọc to hơn, dài hơn, cao hơn. ' +
          'Nhấn sai chỗ thì người nghe không hiểu, dù phát âm từng âm đúng.',
        words: [
          { en: 'apPREciate', ipa: '/əˈpriːʃieɪt/', vi: 'trân trọng' },
          { en: 'deVElop', ipa: '/dɪˈveləp/', vi: 'phát triển' },
          { en: 'comPUter', ipa: '/kəmˈpjuːtər/', vi: 'máy tính' },
          { en: 'proFEssional', ipa: '/prəˈfeʃənl/', vi: 'chuyên nghiệp' },
          { en: 'DAtabase', ipa: '/ˈdeɪtəbeɪs/', vi: 'cơ sở dữ liệu' },
        ],
        sentence: { en: 'I appreciate professional developers.', vi: 'Tôi trân trọng những lập trình viên chuyên nghiệp.' },
        trap:
          'Tiếng Việt mỗi âm tiết đều đều nên người Việt hay đọc phẳng. Hãy CỐ Ý nhấn mạnh một âm tiết ' +
          'và đọc lướt phần còn lại.',
      },
      practice: [
        'Viết cùng một lời nhờ ở cả 4 mức lịch sự.',
        'Học thuộc 4 cách đáp lại lời cảm ơn.',
        'Luyện trọng âm: gõ 5 từ dài vào từ điển, nghe và đánh dấu âm tiết được nhấn.',
        'Nhờ đồng nghiệp một việc bằng tiếng Anh hôm nay (nhắn tin cũng được).',
      ],
    },

    /* ══════════════════ NGÀY 15 ══════════════════ */
    {
      day: 15,
      icon: '💬',
      title: 'Giữ cuộc trò chuyện & xử lý khi bí',
      goal:
        'Bí quyết nói chuyện lâu mà không bị "chết": câu câu giờ, hỏi lại, đổi chủ đề, ' +
        'và diễn đạt vòng khi quên từ.',
      qa: [
        {
          q: { en: "How do you say … in English?", vi: '… nói tiếng Anh thế nào?', ipa: '/haʊ duː juː seɪ/', note: 'Câu cứu cánh khi bạn không biết từ.' },
          answers: [
            { en: 'You can say "deadline".', vi: 'Bạn có thể nói là "deadline".', ipa: '/juː kæn seɪ/' },
            { en: "I think it's called a 'receipt'.", vi: 'Tôi nghĩ nó gọi là "receipt".', ipa: '/ɪts kɔːld/' },
          ],
        },
        {
          q: { en: "What's the word for … ?", vi: 'Từ chỉ … là gì?', ipa: '/ðə wɜːd fɔːr/' },
          answers: [
            { en: 'Do you mean "invoice"?', vi: 'Ý bạn là "invoice" phải không?', ipa: '/duː juː miːn/' },
          ],
        },
        {
          q: { en: "Let me think about that for a second.", vi: 'Để tôi nghĩ một chút.', ipa: '/fɔːr ə ˈsekənd/', note: 'CÂU CÂU GIỜ — dùng thay vì im lặng lúng túng.' },
          answers: [
            { en: 'Take your time.', vi: 'Cứ từ từ.', ipa: '/teɪk jɔːr taɪm/' },
          ],
        },
        {
          q: { en: "That's a good question.", vi: 'Đó là một câu hỏi hay.', ipa: '/ə ɡʊd ˈkwestʃən/', note: 'Câu câu giờ số 1 trong phỏng vấn — cho bạn 2 giây để nghĩ.' },
          answers: [
            { en: 'Take your time.', vi: 'Cứ thong thả.', ipa: '/teɪk jɔːr taɪm/' },
          ],
        },
        {
          q: { en: 'What do you mean by that?', vi: 'Ý bạn là sao?', ipa: '/wɒt duː juː miːn/' },
          answers: [
            { en: 'I mean… let me put it another way.', vi: 'Ý tôi là… để tôi diễn đạt cách khác.', ipa: '/əˈnʌðər weɪ/' },
            { en: 'In other words, we should wait.', vi: 'Nói cách khác, chúng ta nên đợi.', ipa: '/ɪn ˈʌðər wɜːdz/' },
          ],
        },
        {
          q: { en: 'By the way, how is your project going?', vi: 'Nhân tiện, dự án của bạn thế nào rồi?', ipa: '/baɪ ðə weɪ/', note: '"By the way" = cách đổi chủ đề mượt mà nhất.' },
          answers: [
            { en: "It's going well, thanks for asking.", vi: 'Đang ổn, cảm ơn bạn đã hỏi.', ipa: '/ˈɡəʊɪŋ wel/' },
            { en: 'Slowly, but we’re getting there.', vi: 'Hơi chậm, nhưng đang tiến triển.', ipa: '/ˈɡetɪŋ ðeər/' },
          ],
        },
        {
          q: { en: "Anyway, I should get going.", vi: 'Dù sao thì, tôi nên đi đây.', ipa: '/ˈeniweɪ/', note: 'Cách kết thúc cuộc trò chuyện lịch sự.' },
          answers: [
            { en: 'Sure, it was nice talking to you!', vi: 'Được, rất vui được nói chuyện với bạn!', ipa: '/naɪs ˈtɔːkɪŋ/' },
            { en: 'Of course. Let’s catch up soon.', vi: 'Tất nhiên. Hôm nào gặp lại nhé.', ipa: '/kætʃ ʌp suːn/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Keeping a conversation alive',
          titleVi: 'Giữ cho câu chuyện tiếp tục',
          lines: [
            { who: 'Sarah', en: 'So how long have you been coding?', vi: 'Vậy bạn lập trình bao lâu rồi?' },
            { who: 'Cuong', en: "That's a good question… about three years now.", vi: 'Câu hỏi hay đấy… khoảng ba năm rồi.' },
            { who: 'Sarah', en: 'Nice! What got you into it?', vi: 'Hay đấy! Điều gì đưa bạn tới nghề này?' },
            { who: 'Cuong', en: 'Hmm, let me think about that for a second. I built a small game and got hooked.', vi: 'Hmm, để tôi nghĩ một chút. Tôi làm một game nhỏ rồi mê luôn.' },
            { who: 'Sarah', en: 'That’s cool. What’s the word for… when a program stops working?', vi: 'Hay đấy. Từ chỉ… khi một chương trình ngừng chạy là gì nhỉ?' },
            { who: 'Cuong', en: 'Do you mean "crash"?', vi: 'Ý bạn là "crash" phải không?' },
            { who: 'Sarah', en: 'Yes, exactly! By the way, are you working on anything now?', vi: 'Đúng rồi! Nhân tiện, bạn đang làm gì không?' },
            { who: 'Cuong', en: 'Yes, a learning platform. Anyway, I should get going — nice talking to you!', vi: 'Có, một nền tảng học tập. Thôi tôi phải đi đây — rất vui được nói chuyện!' },
          ],
        },
      ],
      vocab: [
        { en: 'By the way', ipa: '/baɪ ðə weɪ/', vi: 'Nhân tiện', pos: 'phr' },
        { en: 'In other words', ipa: '/ɪn ˈʌðər wɜːdz/', vi: 'Nói cách khác', pos: 'phr' },
        { en: 'Anyway', ipa: '/ˈeniweɪ/', vi: 'Dù sao thì', pos: 'adv' },
        { en: 'Actually', ipa: '/ˈæktʃuəli/', vi: 'Thật ra', pos: 'adv' },
        { en: 'get hooked', ipa: '/ɡet hʊkt/', vi: 'mê, nghiện', pos: 'phr' },
        { en: 'get going', ipa: '/ɡet ˈɡəʊɪŋ/', vi: 'đi đây', pos: 'phr' },
        { en: 'catch up', ipa: '/kætʃ ʌp/', vi: 'gặp hàn huyên', pos: 'phr' },
        { en: 'put it another way', ipa: '/pʊt ɪt əˈnʌðər weɪ/', vi: 'diễn đạt cách khác', pos: 'phr' },
        { en: 'What I mean is…', ipa: '/wɒt aɪ miːn ɪz/', vi: 'Ý tôi là…', pos: 'phr' },
      ],
      grammar: [
        {
          title: 'Diễn đạt vòng khi quên từ (paraphrasing)',
          explain:
            'KHÔNG cần biết mọi từ. Khi quên, hãy mô tả nó. Đây là kỹ năng quan trọng hơn cả việc thuộc từ vựng.',
          formula: "It's a thing you use to… · It's like a… but… · It's when you…",
          examples: [
            { en: "It's a thing you use to open bottles.", vi: 'Nó là thứ bạn dùng để mở chai. (= bottle opener)' },
            { en: "It's like a phone but bigger.", vi: 'Nó giống điện thoại nhưng to hơn. (= tablet)' },
            { en: "It's when a program stops suddenly.", vi: 'Là khi chương trình dừng đột ngột. (= crash)' },
          ],
        },
        {
          title: 'Từ nối câu chuyện',
          explain:
            'Dùng từ nối để câu chuyện có mạch, nghe trôi chảy chứ không rời rạc.',
          formula: 'First… · Then… · After that… · Finally… · But… · So… · Because…',
          examples: [
            { en: 'First I checked the logs, then I found the bug, and finally I fixed it.', vi: 'Đầu tiên tôi xem log, rồi tìm ra lỗi, và cuối cùng sửa nó.' },
          ],
        },
      ],
      sound: {
        sound: 'Ngữ điệu câu hỏi (intonation)',
        how:
          'Câu hỏi Yes/No → LÊN giọng cuối câu. Câu hỏi Wh- (what, where, how) → XUỐNG giọng cuối câu. ' +
          'Sai ngữ điệu khiến câu hỏi nghe như câu ra lệnh.',
        words: [
          { en: 'Are you okay? ↗', ipa: '/ɑːr juː əʊˈkeɪ/', vi: 'Bạn ổn không? (lên giọng)' },
          { en: 'Where do you live? ↘', ipa: '/weər duː juː lɪv/', vi: 'Bạn sống ở đâu? (xuống giọng)' },
          { en: 'Do you have time? ↗', ipa: '/duː juː hæv taɪm/', vi: 'Bạn có thời gian không? (lên)' },
          { en: 'What time is it? ↘', ipa: '/wɒt taɪm ɪz ɪt/', vi: 'Mấy giờ rồi? (xuống)' },
        ],
        sentence: { en: 'Are you free? ↗ … What time works for you? ↘', vi: 'Bạn rảnh không? … Mấy giờ tiện cho bạn?' },
        trap: 'Người Việt hay lên giọng ở MỌI câu hỏi. Câu Wh- phải XUỐNG giọng mới tự nhiên.',
      },
      practice: [
        'Học thuộc 4 câu câu giờ: "That\'s a good question", "Let me think about that", "In other words", "By the way".',
        'Tập diễn đạt vòng: chọn 5 đồ vật quanh bạn, mô tả chúng bằng tiếng Anh mà KHÔNG dùng tên gọi.',
        'Luyện ngữ điệu: đọc 5 câu hỏi Yes/No (lên giọng) và 5 câu Wh- (xuống giọng).',
        'ÔN TUẦN 3: nói 3 phút liên tục — kể cảm xúc hôm nay, gọi một cuộc điện thoại giả định, mời ai đó đi chơi và nhờ một việc.',
      ],
    },
  ],
};
