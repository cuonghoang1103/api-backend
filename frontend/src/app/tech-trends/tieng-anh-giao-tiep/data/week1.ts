/**
 * TUẦN 1 — Những câu bật ra mỗi ngày (Ngày 1–5).
 *
 * Nguyên tắc chọn câu: chỉ lấy câu người bản xứ THẬT SỰ nói hằng ngày, bỏ
 * hết câu sách giáo khoa kiểu "How do you do?". Mỗi câu hỏi luôn kèm 3–4
 * cách trả lời ở các mức khác nhau (rất ngắn → đầy đủ) để người học chọn
 * đúng câu hợp hoàn cảnh chứ không học vẹt một đáp án.
 */
import type { WeekBlock } from './types';

export const WEEK_1: WeekBlock = {
  week: 1,
  title: 'Những câu bật ra mỗi ngày',
  subtitle:
    'Chào hỏi, giới thiệu bản thân, kể việc trong ngày, chuyện ăn uống và giờ giấc — ' +
    'năm nhóm câu chiếm phần lớn hội thoại đời thường.',
  days: [
    /* ══════════════════ NGÀY 1 ══════════════════ */
    {
      day: 1,
      icon: '👋',
      title: 'Chào hỏi & bắt chuyện',
      goal:
        'Chào và đáp lại lời chào một cách tự nhiên, hỏi thăm rồi giữ cho câu chuyện ' +
        'tiếp tục thay vì đứng hình sau câu "I am fine, thank you".',
      qa: [
        {
          q: { en: 'How are you?', vi: 'Bạn khoẻ không?', ipa: '/haʊ ɑːr juː/', note: 'Câu hỏi xã giao — người ta không thật sự hỏi bệnh tình. Trả lời ngắn rồi hỏi lại.' },
          answers: [
            { en: "I'm good, thanks. How about you?", vi: 'Tôi ổn, cảm ơn. Còn bạn?', ipa: '/aɪm ɡʊd θæŋks/', note: 'Câu trả lời phổ biến nhất. Dùng được mọi lúc.' },
            { en: "Pretty good! You?", vi: 'Khá ổn! Bạn thì sao?', ipa: '/ˈprɪti ɡʊd/', note: 'Thân mật, ngắn gọn.' },
            { en: "Not bad. A bit tired, actually.", vi: 'Cũng được. Thật ra hơi mệt.', ipa: '/nɒt bæd/', note: 'Thành thật một chút — mở ra chuyện để nói tiếp.' },
            { en: "I've been better, to be honest.", vi: 'Thú thật là tôi từng ổn hơn.', ipa: '/aɪv bɪn ˈbetər/', note: 'Cách nói nhẹ nhàng khi đang không vui.' },
          ],
        },
        {
          q: { en: "What's up?", vi: 'Có gì mới không? / Sao thế?', ipa: '/wɒts ʌp/', note: 'RẤT thân mật. Đây là lời chào, KHÔNG phải câu hỏi thật.' },
          answers: [
            { en: 'Not much. You?', vi: 'Không có gì mấy. Bạn thì sao?', ipa: '/nɒt mʌtʃ/', note: 'Đáp chuẩn nhất. Đừng kể lể dài dòng.' },
            { en: 'Same old, same old.', vi: 'Vẫn vậy thôi.', ipa: '/seɪm əʊld/' },
            { en: 'Just working. How about you?', vi: 'Đang làm việc thôi. Còn bạn?', ipa: '/dʒʌst ˈwɜːkɪŋ/' },
          ],
        },
        {
          q: { en: 'How’s it going?', vi: 'Mọi chuyện thế nào?', ipa: '/haʊz ɪt ˈɡəʊɪŋ/' },
          answers: [
            { en: "It's going well, thanks.", vi: 'Ổn cả, cảm ơn.', ipa: '/ɪts ˈɡəʊɪŋ wel/' },
            { en: 'Busy, but good.', vi: 'Bận, nhưng ổn.', ipa: '/ˈbɪzi bʌt ɡʊd/' },
            { en: 'Could be better, honestly.', vi: 'Thú thật là chưa được tốt lắm.', ipa: '/kʊd biː ˈbetər/' },
          ],
        },
        {
          q: { en: 'Long time no see! How have you been?', vi: 'Lâu quá không gặp! Dạo này bạn thế nào?', ipa: '/lɒŋ taɪm nəʊ siː/', note: 'Dùng khi gặp lại người quen sau thời gian dài.' },
          answers: [
            { en: "I've been great, thanks! What about you?", vi: 'Tôi vẫn tốt, cảm ơn! Còn bạn?', ipa: '/aɪv bɪn ɡreɪt/' },
            { en: 'Pretty busy with work lately.', vi: 'Dạo này khá bận việc.', ipa: '/ˈprɪti ˈbɪzi wɪð wɜːk/' },
            { en: "It's been a while! I've been good.", vi: 'Lâu thật rồi! Tôi vẫn ổn.', ipa: '/ɪts bɪn ə waɪl/' },
          ],
        },
        {
          q: { en: 'Nice to meet you.', vi: 'Rất vui được gặp bạn.', ipa: '/naɪs tuː miːt juː/', note: 'CHỈ dùng lần gặp ĐẦU TIÊN. Gặp lại phải nói "Nice to see you".' },
          answers: [
            { en: 'Nice to meet you too.', vi: 'Tôi cũng rất vui được gặp bạn.', ipa: '/naɪs tuː miːt juː tuː/' },
            { en: 'Likewise!', vi: 'Tôi cũng vậy!', ipa: '/ˈlaɪkwaɪz/', note: 'Ngắn, lịch sự, nghe rất tự nhiên.' },
            { en: 'Pleasure to meet you.', vi: 'Hân hạnh được gặp bạn.', ipa: '/ˈpleʒər tuː miːt juː/', note: 'Trang trọng hơn — hợp khi gặp khách hàng.' },
          ],
        },
        {
          q: { en: 'How was your weekend?', vi: 'Cuối tuần của bạn thế nào?', ipa: '/haʊ wɒz jɔːr ˈwiːkend/', note: 'Câu mở đầu sáng thứ Hai ở mọi văn phòng.' },
          answers: [
            { en: 'It was great! I just relaxed at home.', vi: 'Tuyệt lắm! Tôi chỉ nghỉ ngơi ở nhà.', ipa: '/ɪt wɒz ɡreɪt/' },
            { en: 'Pretty quiet. I caught up on sleep.', vi: 'Khá yên tĩnh. Tôi ngủ bù.', ipa: '/kɔːt ʌp ɒn sliːp/', note: '"catch up on sleep" = ngủ bù.' },
            { en: 'I went out with some friends. How about yours?', vi: 'Tôi đi chơi với vài người bạn. Còn cuối tuần của bạn?', ipa: '/aɪ went aʊt/' },
          ],
        },
        {
          q: { en: 'See you later!', vi: 'Hẹn gặp lại nhé!', ipa: '/siː juː ˈleɪtər/' },
          answers: [
            { en: 'See you!', vi: 'Gặp lại sau!', ipa: '/siː juː/' },
            { en: 'Take care!', vi: 'Giữ gìn sức khoẻ nhé!', ipa: '/teɪk keər/' },
            { en: 'Have a good one!', vi: 'Chúc một ngày tốt lành!', ipa: '/hæv ə ɡʊd wʌn/', note: 'Rất tự nhiên, dùng thay "Have a nice day".' },
          ],
        },
        {
          q: { en: "Sorry, I didn't catch that. Could you say it again?", vi: 'Xin lỗi, tôi chưa nghe rõ. Bạn nói lại được không?', ipa: '/aɪ ˈdɪdnt kætʃ ðæt/', note: 'CÂU QUAN TRỌNG NHẤT ngày 1 — học thuộc để không bao giờ đứng hình.' },
          answers: [
            { en: 'Sure — I said…', vi: 'Được chứ — tôi nói là…', ipa: '/ʃʊər/' },
            { en: 'Of course. Let me repeat that.', vi: 'Tất nhiên. Để tôi nhắc lại.', ipa: '/əv kɔːs/' },
          ],
        },
        {
          q: { en: 'Could you speak a little slower, please?', vi: 'Bạn nói chậm lại một chút được không?', ipa: '/spiːk ə ˈlɪtl ˈsləʊər/', note: 'Không có gì phải ngại — người bản xứ rất sẵn lòng.' },
          answers: [
            { en: 'Sure, no problem.', vi: 'Được, không vấn đề gì.', ipa: '/nəʊ ˈprɒbləm/' },
            { en: 'Sorry! Is this better?', vi: 'Xin lỗi! Thế này ổn hơn chứ?', ipa: '/ɪz ðɪs ˈbetər/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Meeting a colleague in the morning',
          titleVi: 'Gặp đồng nghiệp buổi sáng',
          lines: [
            { who: 'Nam', en: 'Morning, Linh! How’s it going?', vi: 'Chào buổi sáng, Linh! Mọi chuyện thế nào?' },
            { who: 'Linh', en: 'Morning! Pretty good, thanks. How about you?', vi: 'Chào buổi sáng! Khá ổn, cảm ơn. Còn cậu?' },
            { who: 'Nam', en: 'Not bad. A bit tired — I stayed up late finishing a task.', vi: 'Cũng được. Hơi mệt — tớ thức khuya làm cho xong việc.' },
            { who: 'Linh', en: 'Oh no. Did you get it done?', vi: 'Ôi không. Cậu làm xong chưa?' },
            { who: 'Nam', en: 'Yeah, finally. Anyway, how was your weekend?', vi: 'Ừ, cuối cùng cũng xong. Mà cuối tuần của cậu thế nào?' },
            { who: 'Linh', en: 'It was great! I just relaxed at home.', vi: 'Tuyệt lắm! Tớ chỉ nghỉ ngơi ở nhà thôi.' },
          ],
        },
        {
          title: 'Meeting someone for the first time',
          titleVi: 'Gặp người mới lần đầu',
          lines: [
            { who: 'A', en: 'Hi, I’m Cuong. Nice to meet you.', vi: 'Chào, tôi là Cường. Rất vui được gặp bạn.' },
            { who: 'B', en: 'Hi Cuong, I’m Sarah. Likewise!', vi: 'Chào Cường, tôi là Sarah. Tôi cũng vậy!' },
            { who: 'A', en: 'Sorry, I didn’t catch that. Could you say your name again?', vi: 'Xin lỗi, tôi chưa nghe rõ. Bạn nói lại tên được không?' },
            { who: 'B', en: 'Sure — Sarah. S-A-R-A-H.', vi: 'Được chứ — Sarah. S-A-R-A-H.' },
            { who: 'A', en: 'Got it. Thanks, Sarah!', vi: 'Tôi hiểu rồi. Cảm ơn Sarah!' },
          ],
        },
      ],
      vocab: [
        { en: 'greet', ipa: '/ɡriːt/', vi: 'chào hỏi', pos: 'v', ex: 'She greeted me with a smile.', exVi: 'Cô ấy chào tôi bằng một nụ cười.' },
        { en: 'actually', ipa: '/ˈæktʃuəli/', vi: 'thật ra', pos: 'adv', ex: "I'm a bit tired, actually.", exVi: 'Thật ra tôi hơi mệt.' },
        { en: 'lately', ipa: '/ˈleɪtli/', vi: 'dạo gần đây', pos: 'adv', ex: "I've been busy lately.", exVi: 'Dạo gần đây tôi khá bận.' },
        { en: 'catch up', ipa: '/kætʃ ʌp/', vi: 'bắt kịp; hàn huyên', pos: 'phr', ex: "Let's catch up soon!", exVi: 'Hôm nào gặp hàn huyên nhé!' },
        { en: 'stay up', ipa: '/steɪ ʌp/', vi: 'thức khuya', pos: 'phr', ex: 'I stayed up late last night.', exVi: 'Tối qua tôi thức khuya.' },
        { en: 'relax', ipa: '/rɪˈlæks/', vi: 'thư giãn', pos: 'v', ex: 'I just relaxed at home.', exVi: 'Tôi chỉ nghỉ ngơi ở nhà.' },
        { en: 'likewise', ipa: '/ˈlaɪkwaɪz/', vi: 'tôi cũng vậy', pos: 'adv' },
        { en: 'take care', ipa: '/teɪk keər/', vi: 'giữ gìn sức khoẻ', pos: 'phr' },
        { en: 'quiet', ipa: '/ˈkwaɪət/', vi: 'yên tĩnh', pos: 'adj' },
        { en: 'colleague', ipa: '/ˈkɒliːɡ/', vi: 'đồng nghiệp', pos: 'n', ex: 'He is my colleague.', exVi: 'Anh ấy là đồng nghiệp của tôi.' },
        { en: 'repeat', ipa: '/rɪˈpiːt/', vi: 'nhắc lại', pos: 'v' },
        { en: 'get something done', ipa: '/ɡet ˈsʌmθɪŋ dʌn/', vi: 'làm xong việc gì', pos: 'phr', ex: 'Did you get it done?', exVi: 'Bạn làm xong chưa?' },
      ],
      grammar: [
        {
          title: 'Thì hiện tại đơn — nói về sự thật và thói quen',
          explain:
            'Dùng khi việc đó đúng nói chung hoặc lặp đi lặp lại: nghề nghiệp, thói quen, sở thích. ' +
            'Đây là thì bạn dùng nhiều nhất khi giới thiệu và kể chuyện đời thường.',
          formula: 'I / You / We / They + V(nguyên thể) · He / She / It + V + -s',
          examples: [
            { en: 'I work as a developer.', vi: 'Tôi làm lập trình viên.' },
            { en: 'She lives in Hanoi.', vi: 'Cô ấy sống ở Hà Nội.' },
            { en: 'We start work at 8 a.m.', vi: 'Chúng tôi bắt đầu làm lúc 8 giờ sáng.' },
          ],
          mistake:
            'Người Việt hay QUÊN chữ "s" ở ngôi thứ ba: ❌ "She live in Hanoi" → ✅ "She lives in Hanoi". ' +
            'Đây là lỗi bị để ý nhiều nhất khi phỏng vấn.',
        },
        {
          title: 'Thì hiện tại hoàn thành — "dạo này", "từ trước tới giờ"',
          explain:
            'Dùng cho việc bắt đầu trong quá khứ và còn kéo dài tới hiện tại. Vì vậy "How have you been?" ' +
            'mới có nghĩa "dạo này bạn thế nào" chứ không phải hỏi một thời điểm cụ thể.',
          formula: 'have / has + V3 (past participle)',
          examples: [
            { en: "I've been busy lately.", vi: 'Dạo này tôi khá bận.' },
            { en: "It's been a while!", vi: 'Lâu rồi nhỉ!' },
            { en: "I've worked here for two years.", vi: 'Tôi làm ở đây được hai năm rồi.' },
          ],
          mistake:
            'Đừng dùng với mốc thời gian đã kết thúc: ❌ "I have seen him yesterday" → ✅ "I saw him yesterday".',
        },
        {
          title: 'Hỏi lại để giữ cuộc trò chuyện',
          explain:
            'Bí quyết để không bị "chết" hội thoại: luôn ném bóng lại. Sau khi trả lời, thêm một câu hỏi ngược.',
          formula: '(Trả lời) + How about you? / What about you? / And you?',
          examples: [
            { en: "I'm good, thanks. How about you?", vi: 'Tôi ổn, cảm ơn. Còn bạn?' },
            { en: 'I went out with friends. What about yours?', vi: 'Tôi đi chơi với bạn. Còn của bạn thì sao?' },
          ],
        },
      ],
      sound: {
        sound: '/θ/',
        how:
          'Đặt đầu lưỡi CHẠM NHẸ vào rìa răng cửa trên rồi thổi hơi ra. Không rung cổ họng. ' +
          'Hãy soi gương: phải thấy đầu lưỡi thò ra một chút.',
        words: [
          { en: 'think', ipa: '/θɪŋk/', vi: 'nghĩ' },
          { en: 'thanks', ipa: '/θæŋks/', vi: 'cảm ơn' },
          { en: 'three', ipa: '/θriː/', vi: 'số ba' },
          { en: 'thing', ipa: '/θɪŋ/', vi: 'thứ, việc' },
          { en: 'through', ipa: '/θruː/', vi: 'xuyên qua' },
        ],
        sentence: { en: 'Thanks — I think there are three things.', vi: 'Cảm ơn — tôi nghĩ có ba việc.' },
        trap:
          'Người Việt hay đọc thành /t/ hoặc /s/: "think" → "tink"/"sink". Hai từ này có nghĩa khác hẳn ' +
          '("sink" là bồn rửa), nên sai âm là sai nghĩa.',
      },
      practice: [
        'Nói to 10 lần câu "I\'m good, thanks. How about you?" cho tới khi bật ra không cần nghĩ.',
        'Ghi âm bản thân đọc đoạn hội thoại "Meeting a colleague in the morning", nghe lại và so với phiên âm.',
        'Tự trả lời câu "How was your weekend?" bằng 3 cách khác nhau.',
        'Luyện âm /θ/ trước gương 2 phút với 5 từ ở trên — phải nhìn thấy đầu lưỡi.',
        'Nhắn tin cho một người bạn bằng tiếng Anh, mở đầu bằng "Long time no see! How have you been?".',
      ],
    },

    /* ══════════════════ NGÀY 2 ══════════════════ */
    {
      day: 2,
      icon: '🙋',
      title: 'Giới thiệu bản thân',
      goal:
        'Nói trọn vẹn về mình trong 30 giây: tên, công việc, nơi sống, sở thích — dùng được cả khi ' +
        'gặp bạn mới lẫn khi mở đầu buổi phỏng vấn.',
      qa: [
        {
          q: { en: "What's your name?", vi: 'Bạn tên gì?', ipa: '/wɒts jɔːr neɪm/' },
          answers: [
            { en: "I'm Cuong. Nice to meet you.", vi: 'Tôi là Cường. Rất vui được gặp bạn.', ipa: '/aɪm/' },
            { en: 'My name is Cuong, but you can call me C.', vi: 'Tôi tên Cường, nhưng bạn có thể gọi tôi là C.', ipa: '/juː kæn kɔːl miː/', note: 'Rất hữu ích khi tên khó đọc với người nước ngoài.' },
          ],
        },
        {
          q: { en: 'Where are you from?', vi: 'Bạn đến từ đâu?', ipa: '/weər ɑːr juː frɒm/' },
          answers: [
            { en: "I'm from Vietnam.", vi: 'Tôi đến từ Việt Nam.', ipa: '/aɪm frɒm/' },
            { en: "I'm Vietnamese. I'm from Ho Chi Minh City.", vi: 'Tôi là người Việt. Tôi ở TP. Hồ Chí Minh.', ipa: '/ˌvjetnəˈmiːz/' },
            { en: "I was born in Hue but I live in Da Nang now.", vi: 'Tôi sinh ra ở Huế nhưng giờ sống ở Đà Nẵng.', ipa: '/aɪ wɒz bɔːn/' },
          ],
        },
        {
          q: { en: 'What do you do?', vi: 'Bạn làm nghề gì?', ipa: '/wɒt duː juː duː/', note: 'Đây là cách hỏi nghề nghiệp thông dụng nhất, KHÔNG phải "What is your job?".' },
          answers: [
            { en: "I'm a software developer.", vi: 'Tôi là lập trình viên.', ipa: '/ˈsɒftweər dɪˈveləpər/' },
            { en: 'I work as a back-end developer at a startup.', vi: 'Tôi làm lập trình viên back-end ở một công ty khởi nghiệp.', ipa: '/aɪ wɜːk æz/' },
            { en: "I'm a developer, and I also make coding videos.", vi: 'Tôi là lập trình viên, và tôi cũng làm video dạy lập trình.', ipa: '/ˈkəʊdɪŋ ˈvɪdiəʊz/' },
          ],
        },
        {
          q: { en: 'How long have you been doing that?', vi: 'Bạn làm việc đó bao lâu rồi?', ipa: '/haʊ lɒŋ hæv juː bɪn/' },
          answers: [
            { en: "About three years now.", vi: 'Khoảng ba năm rồi.', ipa: '/əˈbaʊt θriː jɪəz/' },
            { en: "I've been coding since 2020.", vi: 'Tôi lập trình từ năm 2020.', ipa: '/sɪns/', note: '"since" + mốc thời gian, "for" + khoảng thời gian.' },
            { en: "I'm still pretty new — about six months.", vi: 'Tôi vẫn còn khá mới — khoảng sáu tháng.', ipa: '/stɪl ˈprɪti njuː/' },
          ],
        },
        {
          q: { en: 'Where do you live?', vi: 'Bạn sống ở đâu?', ipa: '/weər duː juː lɪv/' },
          answers: [
            { en: 'I live in Da Nang, in central Vietnam.', vi: 'Tôi sống ở Đà Nẵng, miền Trung Việt Nam.', ipa: '/ˈsentrəl/' },
            { en: 'I live with my family in the city center.', vi: 'Tôi sống với gia đình ở trung tâm thành phố.', ipa: '/ˈsɪti ˈsentər/' },
          ],
        },
        {
          q: { en: 'Do you have any hobbies?', vi: 'Bạn có sở thích gì không?', ipa: '/ˈhɒbiz/' },
          answers: [
            { en: 'I love playing football and watching movies.', vi: 'Tôi thích chơi bóng đá và xem phim.', ipa: '/aɪ lʌv ˈpleɪɪŋ/', note: 'Sau "love/like/enjoy" dùng V-ing.' },
            { en: "I'm into photography these days.", vi: 'Dạo này tôi mê chụp ảnh.', ipa: '/aɪm ˈɪntuː fəˈtɒɡrəfi/', note: '"be into something" = mê cái gì. Rất tự nhiên.' },
            { en: 'Mostly coding, to be honest. It’s my job and my hobby.', vi: 'Thú thật chủ yếu là lập trình. Vừa là nghề vừa là sở thích.', ipa: '/ˈməʊstli/' },
          ],
        },
        {
          q: { en: 'Tell me a little about yourself.', vi: 'Hãy kể một chút về bạn.', ipa: '/tel miː ə ˈlɪtl/', note: 'Câu mở đầu MỌI buổi phỏng vấn. Chuẩn bị sẵn 30 giây.' },
          answers: [
            {
              en: "Sure. My name is Cuong. I'm a back-end developer with three years of experience, mostly with Node.js and PostgreSQL. Right now I'm building a learning platform, and I also make coding videos in my free time.",
              vi: 'Vâng. Tôi tên Cường. Tôi là lập trình viên back-end với ba năm kinh nghiệm, chủ yếu với Node.js và PostgreSQL. Hiện tại tôi đang xây một nền tảng học tập, và tôi cũng làm video dạy lập trình lúc rảnh.',
              note: 'CÔNG THỨC 30 giây: Tên → Nghề + số năm → Công nghệ chính → Đang làm gì → Một điểm thú vị.',
            },
          ],
        },
        {
          q: { en: 'How do you spell your name?', vi: 'Tên bạn viết thế nào?', ipa: '/haʊ duː juː spel/' },
          answers: [
            { en: "It's C-U-O-N-G.", vi: 'Là C-U-O-N-G.', ipa: '/ɪts/' },
            { en: 'Cuong — like "Kwong". C-U-O-N-G.', vi: 'Cường — đọc như "Kwong". C-U-O-N-G.', note: 'Cho người nghe một cách đọc gần đúng trước khi đánh vần.' },
          ],
        },
        {
          q: { en: 'What brings you here?', vi: 'Điều gì đưa bạn tới đây? / Bạn tới đây có việc gì?', ipa: '/wɒt brɪŋz juː hɪər/' },
          answers: [
            { en: "I'm here for a conference.", vi: 'Tôi tới đây dự một hội thảo.', ipa: '/ˈkɒnfərəns/' },
            { en: "I'm just visiting friends.", vi: 'Tôi chỉ đến thăm bạn bè.', ipa: '/ˈvɪzɪtɪŋ/' },
            { en: 'I moved here for work last year.', vi: 'Tôi chuyển tới đây làm việc từ năm ngoái.', ipa: '/aɪ muːvd hɪər/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Introducing yourself at a meetup',
          titleVi: 'Tự giới thiệu ở buổi gặp mặt',
          lines: [
            { who: 'Sarah', en: 'Hi! I don’t think we’ve met. I’m Sarah.', vi: 'Chào! Hình như mình chưa gặp nhau. Tôi là Sarah.' },
            { who: 'Cuong', en: 'Hi Sarah, I’m Cuong. Nice to meet you.', vi: 'Chào Sarah, tôi là Cường. Rất vui được gặp bạn.' },
            { who: 'Sarah', en: 'Nice to meet you too. So, what do you do?', vi: 'Tôi cũng vậy. Vậy bạn làm nghề gì?' },
            { who: 'Cuong', en: 'I’m a back-end developer. I work mostly with Node.js. How about you?', vi: 'Tôi là lập trình viên back-end. Tôi chủ yếu làm với Node.js. Còn bạn?' },
            { who: 'Sarah', en: 'I’m a designer. How long have you been coding?', vi: 'Tôi là nhà thiết kế. Bạn lập trình bao lâu rồi?' },
            { who: 'Cuong', en: 'About three years now. I’m still learning every day.', vi: 'Khoảng ba năm rồi. Tôi vẫn học mỗi ngày.' },
            { who: 'Sarah', en: 'That’s great. Do you have any hobbies outside work?', vi: 'Hay quá. Bạn có sở thích gì ngoài công việc không?' },
            { who: 'Cuong', en: 'I’m into photography these days. And I make coding videos.', vi: 'Dạo này tôi mê chụp ảnh. Và tôi làm video dạy lập trình.' },
          ],
        },
      ],
      vocab: [
        { en: 'experience', ipa: '/ɪkˈspɪəriəns/', vi: 'kinh nghiệm', pos: 'n', ex: 'I have three years of experience.', exVi: 'Tôi có ba năm kinh nghiệm.' },
        { en: 'developer', ipa: '/dɪˈveləpər/', vi: 'lập trình viên', pos: 'n' },
        { en: 'be into (something)', ipa: '/biː ˈɪntuː/', vi: 'mê, hứng thú với', pos: 'phr', ex: "I'm into photography.", exVi: 'Tôi mê chụp ảnh.' },
        { en: 'hobby', ipa: '/ˈhɒbi/', vi: 'sở thích', pos: 'n' },
        { en: 'spell', ipa: '/spel/', vi: 'đánh vần', pos: 'v' },
        { en: 'startup', ipa: '/ˈstɑːtʌp/', vi: 'công ty khởi nghiệp', pos: 'n' },
        { en: 'central', ipa: '/ˈsentrəl/', vi: 'thuộc trung tâm', pos: 'adj' },
        { en: 'conference', ipa: '/ˈkɒnfərəns/', vi: 'hội thảo', pos: 'n' },
        { en: 'move (to a place)', ipa: '/muːv/', vi: 'chuyển tới', pos: 'v' },
        { en: 'free time', ipa: '/friː taɪm/', vi: 'thời gian rảnh', pos: 'n' },
        { en: 'mostly', ipa: '/ˈməʊstli/', vi: 'chủ yếu', pos: 'adv' },
        { en: 'photography', ipa: '/fəˈtɒɡrəfi/', vi: 'nhiếp ảnh', pos: 'n' },
      ],
      grammar: [
        {
          title: '"for" và "since" — hai từ hay bị dùng lẫn',
          explain:
            '"for" đi với KHOẢNG thời gian (bao lâu). "since" đi với MỐC thời gian (từ khi nào). ' +
            'Cả hai thường dùng với hiện tại hoàn thành.',
          formula: 'for + khoảng (two years, six months) · since + mốc (2020, last May)',
          examples: [
            { en: "I've worked here for three years.", vi: 'Tôi làm ở đây được ba năm.' },
            { en: "I've worked here since 2022.", vi: 'Tôi làm ở đây từ năm 2022.' },
          ],
          mistake: '❌ "since three years" → ✅ "for three years". Đây là lỗi kinh điển của người Việt.',
        },
        {
          title: 'Mạo từ a / an / the',
          explain:
            '"a/an" khi nhắc lần đầu hoặc nói chung; "the" khi cả hai đã biết đang nói về cái nào. ' +
            'Tiếng Việt không có mạo từ nên đây là chỗ dễ quên nhất.',
          formula: 'a + phụ âm · an + nguyên âm (a, e, i, o, u) · the + đã xác định',
          examples: [
            { en: "I'm a developer.", vi: 'Tôi là một lập trình viên.' },
            { en: "I'm an engineer.", vi: 'Tôi là một kỹ sư.' },
            { en: 'I live in the city center.', vi: 'Tôi sống ở trung tâm thành phố.' },
          ],
          mistake: '❌ "I am developer" → ✅ "I am a developer". Nghề nghiệp số ít LUÔN cần mạo từ.',
        },
        {
          title: 'Động từ + V-ing sau love / like / enjoy / hate',
          explain: 'Sau các động từ chỉ sở thích, động từ theo sau thường ở dạng V-ing.',
          formula: 'love / like / enjoy / hate + V-ing',
          examples: [
            { en: 'I love playing football.', vi: 'Tôi thích chơi bóng đá.' },
            { en: 'I enjoy watching movies.', vi: 'Tôi thích xem phim.' },
          ],
          mistake: '❌ "I enjoy to watch movies" → ✅ "I enjoy watching movies".',
        },
      ],
      sound: {
        sound: '/ð/',
        how:
          'Vị trí lưỡi GIỐNG HỆT /θ/ (đầu lưỡi chạm rìa răng trên), nhưng CÓ rung cổ họng. ' +
          'Đặt tay lên cổ: phải cảm thấy rung.',
        words: [
          { en: 'this', ipa: '/ðɪs/', vi: 'cái này' },
          { en: 'that', ipa: '/ðæt/', vi: 'cái đó' },
          { en: 'they', ipa: '/ðeɪ/', vi: 'họ' },
          { en: 'there', ipa: '/ðeər/', vi: 'ở đó' },
          { en: 'the', ipa: '/ðə/', vi: '(mạo từ)' },
        ],
        sentence: { en: 'They said that this is the other one.', vi: 'Họ nói cái này là cái kia.' },
        trap: 'Người Việt hay đọc thành /d/ hoặc /z/: "this" → "dis"/"zis". Nghe rất rõ là người nước ngoài.',
      },
      practice: [
        'Viết ra bài giới thiệu 30 giây của riêng bạn theo công thức: Tên → Nghề + số năm → Công nghệ → Đang làm gì → Điểm thú vị.',
        'Đọc to bài đó 5 lần, bấm giờ — phải gói gọn trong 30–40 giây.',
        'Ghi âm và nghe lại: có bỏ sót "a/an" trước nghề nghiệp không?',
        'Luyện cặp /θ/ – /ð/: "think–this", "thing–that", "three–they".',
        'Tập đánh vần tên bạn bằng tiếng Anh cho tới khi trôi chảy.',
      ],
    },

    /* ══════════════════ NGÀY 3 ══════════════════ */
    {
      day: 3,
      icon: '📅',
      title: 'Hôm nay làm gì? — Kể việc trong ngày',
      goal:
        'Kể lại một ngày của bạn từ sáng đến tối, hỏi và trả lời "Hôm nay bạn làm gì?" ở cả ' +
        'thì hiện tại (thói quen) lẫn quá khứ (hôm nay đã làm gì).',
      qa: [
        {
          q: { en: 'What are you doing today?', vi: 'Hôm nay bạn làm gì?', ipa: '/wɒt ɑːr juː ˈduːɪŋ təˈdeɪ/', note: 'Hỏi về KẾ HOẠCH hôm nay (chưa làm hoặc đang làm).' },
          answers: [
            { en: "I'm working from home today.", vi: 'Hôm nay tôi làm việc ở nhà.', ipa: '/ˈwɜːkɪŋ frɒm həʊm/' },
            { en: 'Not much — just some housework.', vi: 'Không nhiều — chỉ vài việc nhà thôi.', ipa: '/ˈhaʊswɜːk/' },
            { en: 'I have a meeting at 10 and then I’m free.', vi: 'Tôi có cuộc họp lúc 10 giờ rồi rảnh.', ipa: '/ə ˈmiːtɪŋ/' },
            { en: "I'm going to the gym later.", vi: 'Lát nữa tôi đi tập gym.', ipa: '/ˈɡəʊɪŋ tuː ðə dʒɪm/' },
          ],
        },
        {
          q: { en: 'What did you do today?', vi: 'Hôm nay bạn đã làm gì?', ipa: '/wɒt dɪd juː duː/', note: 'Hỏi về việc ĐÃ làm — trả lời bằng quá khứ đơn.' },
          answers: [
            { en: 'I worked all day and then cooked dinner.', vi: 'Tôi làm việc cả ngày rồi nấu bữa tối.', ipa: '/aɪ wɜːkt/' },
            { en: 'I fixed a couple of bugs and joined two meetings.', vi: 'Tôi sửa vài lỗi và tham gia hai cuộc họp.', ipa: '/aɪ fɪkst/' },
            { en: 'Honestly, not much. I just rested.', vi: 'Thật ra không nhiều. Tôi chỉ nghỉ ngơi.', ipa: '/aɪ dʒʌst ˈrestɪd/' },
          ],
        },
        {
          q: { en: 'What time do you usually wake up?', vi: 'Bạn thường thức dậy lúc mấy giờ?', ipa: '/weɪk ʌp/' },
          answers: [
            { en: 'I usually wake up at 6:30.', vi: 'Tôi thường dậy lúc 6 giờ 30.', ipa: '/ˈjuːʒuəli/' },
            { en: 'Around 7, but I hit snooze a lot.', vi: 'Khoảng 7 giờ, nhưng tôi hay bấm báo lại.', ipa: '/hɪt snuːz/', note: '"hit snooze" = bấm nút báo lại của đồng hồ.' },
            { en: 'It depends. On weekends I sleep in.', vi: 'Còn tuỳ. Cuối tuần tôi ngủ nướng.', ipa: '/sliːp ɪn/', note: '"sleep in" = ngủ nướng.' },
          ],
        },
        {
          q: { en: 'How do you get to work?', vi: 'Bạn đi làm bằng gì?', ipa: '/haʊ duː juː ɡet tuː wɜːk/' },
          answers: [
            { en: 'I ride my motorbike. It takes about 20 minutes.', vi: 'Tôi đi xe máy. Mất khoảng 20 phút.', ipa: '/ɪt teɪks/' },
            { en: 'I walk — I live nearby.', vi: 'Tôi đi bộ — tôi ở gần đây.', ipa: '/ˈnɪəbaɪ/' },
            { en: 'I work from home, so I just walk to my desk.', vi: 'Tôi làm ở nhà, nên chỉ việc đi tới bàn.', ipa: '/frɒm həʊm/' },
          ],
        },
        {
          q: { en: 'Are you busy right now?', vi: 'Bạn có đang bận không?', ipa: '/ˈbɪzi raɪt naʊ/' },
          answers: [
            { en: 'A little. What do you need?', vi: 'Hơi bận. Bạn cần gì?', ipa: '/ə ˈlɪtl/' },
            { en: 'Not at all. What’s up?', vi: 'Không hề. Có chuyện gì thế?', ipa: '/nɒt æt ɔːl/' },
            { en: 'Kind of — can I get back to you in 10 minutes?', vi: 'Cũng hơi — tôi trả lời bạn sau 10 phút được không?', ipa: '/ɡet bæk tuː juː/', note: '"get back to you" = trả lời lại sau. Cực kỳ hay dùng ở công sở.' },
          ],
        },
        {
          q: { en: 'What are your plans for tonight?', vi: 'Tối nay bạn có kế hoạch gì?', ipa: '/plænz fɔːr təˈnaɪt/' },
          answers: [
            { en: 'Nothing special. Probably just watch something.', vi: 'Không có gì đặc biệt. Chắc chỉ xem gì đó.', ipa: '/ˈnʌθɪŋ ˈspeʃl/' },
            { en: "I'm meeting a friend for dinner.", vi: 'Tôi hẹn bạn ăn tối.', ipa: '/ˈmiːtɪŋ ə frend/', note: 'Hiện tại tiếp diễn dùng cho kế hoạch đã chốt.' },
            { en: 'I need to finish some work, unfortunately.', vi: 'Tiếc là tôi phải làm nốt việc.', ipa: '/ʌnˈfɔːtʃənətli/' },
          ],
        },
        {
          q: { en: 'How was your day?', vi: 'Ngày hôm nay của bạn thế nào?', ipa: '/haʊ wɒz jɔːr deɪ/' },
          answers: [
            { en: 'It was pretty good, thanks.', vi: 'Khá ổn, cảm ơn.', ipa: '/ˈprɪti ɡʊd/' },
            { en: 'Long, honestly. I had back-to-back meetings.', vi: 'Thú thật là dài. Tôi họp liên tục.', ipa: '/bæk tuː bæk/', note: '"back-to-back" = liên tiếp, sát nhau.' },
            { en: 'Productive! I got a lot done.', vi: 'Hiệu quả! Tôi làm được nhiều việc.', ipa: '/prəˈdʌktɪv/' },
          ],
        },
        {
          q: { en: 'Do you have time later?', vi: 'Lát nữa bạn có thời gian không?', ipa: '/hæv taɪm ˈleɪtər/' },
          answers: [
            { en: 'Sure, after 5 works for me.', vi: 'Được, sau 5 giờ thì tôi ổn.', ipa: '/wɜːks fɔːr miː/' },
            { en: "Sorry, I'm tied up all afternoon.", vi: 'Xin lỗi, cả chiều tôi bận kín.', ipa: '/taɪd ʌp/', note: '"be tied up" = bận không dứt ra được.' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Talking about your day',
          titleVi: 'Nói về một ngày của bạn',
          lines: [
            { who: 'Linh', en: 'Hey! How was your day?', vi: 'Này! Ngày hôm nay của cậu thế nào?' },
            { who: 'Nam', en: 'Long, honestly. I had back-to-back meetings all morning.', vi: 'Thú thật là dài. Tớ họp liên tục cả buổi sáng.' },
            { who: 'Linh', en: 'Oh wow. Did you get any work done?', vi: 'Ồ. Cậu có làm được việc gì không?' },
            { who: 'Nam', en: 'A bit. I fixed two bugs after lunch. What about you?', vi: 'Một chút. Tớ sửa hai lỗi sau bữa trưa. Còn cậu?' },
            { who: 'Linh', en: 'Pretty productive! I finished the design early.', vi: 'Khá hiệu quả! Tớ xong bản thiết kế sớm.' },
            { who: 'Nam', en: 'Nice. What are your plans for tonight?', vi: 'Hay đấy. Tối nay cậu có kế hoạch gì?' },
            { who: 'Linh', en: 'Nothing special. Probably just watch something and sleep early.', vi: 'Không có gì đặc biệt. Chắc xem gì đó rồi ngủ sớm.' },
          ],
        },
      ],
      vocab: [
        { en: 'wake up', ipa: '/weɪk ʌp/', vi: 'thức dậy', pos: 'phr' },
        { en: 'sleep in', ipa: '/sliːp ɪn/', vi: 'ngủ nướng', pos: 'phr' },
        { en: 'get to work', ipa: '/ɡet tuː wɜːk/', vi: 'đi tới chỗ làm', pos: 'phr' },
        { en: 'back-to-back', ipa: '/bæk tuː bæk/', vi: 'liên tiếp, sát nhau', pos: 'adj' },
        { en: 'productive', ipa: '/prəˈdʌktɪv/', vi: 'hiệu quả', pos: 'adj' },
        { en: 'be tied up', ipa: '/biː taɪd ʌp/', vi: 'bận kín', pos: 'phr' },
        { en: 'get back to (someone)', ipa: '/ɡet bæk tuː/', vi: 'trả lời lại sau', pos: 'phr' },
        { en: 'housework', ipa: '/ˈhaʊswɜːk/', vi: 'việc nhà', pos: 'n' },
        { en: 'errand', ipa: '/ˈerənd/', vi: 'việc vặt ra ngoài', pos: 'n', ex: 'I have a few errands to run.', exVi: 'Tôi có vài việc vặt phải làm.' },
        { en: 'unfortunately', ipa: '/ʌnˈfɔːtʃənətli/', vi: 'tiếc là', pos: 'adv' },
        { en: 'nearby', ipa: '/ˈnɪəbaɪ/', vi: 'gần đây', pos: 'adj/adv' },
        { en: 'It depends', ipa: '/ɪt dɪˈpendz/', vi: 'Còn tuỳ', pos: 'phr' },
      ],
      grammar: [
        {
          title: 'Hiện tại tiếp diễn — đang làm & kế hoạch đã chốt',
          explain:
            'Hai công dụng: (1) việc đang diễn ra ngay lúc nói; (2) KẾ HOẠCH đã sắp xếp cho tương lai gần. ' +
            'Công dụng thứ hai làm nhiều người bất ngờ nhưng cực kỳ hay dùng.',
          formula: 'am / is / are + V-ing',
          examples: [
            { en: "I'm working from home today.", vi: 'Hôm nay tôi làm ở nhà. (đang diễn ra)' },
            { en: "I'm meeting a friend for dinner.", vi: 'Tôi hẹn bạn ăn tối. (kế hoạch đã chốt)' },
          ],
          mistake: '❌ "I am work from home" → ✅ "I am working from home".',
        },
        {
          title: 'Quá khứ đơn — kể việc đã xong',
          explain:
            'Dùng khi việc đã kết thúc trong quá khứ. Động từ có quy tắc thêm -ed; động từ bất quy tắc phải học thuộc.',
          formula: 'V-ed (có quy tắc) · V2 (bất quy tắc: go→went, do→did, have→had)',
          examples: [
            { en: 'I worked all day.', vi: 'Tôi làm việc cả ngày.' },
            { en: 'I went to the gym yesterday.', vi: 'Hôm qua tôi đi tập gym.' },
            { en: 'I had two meetings this morning.', vi: 'Sáng nay tôi có hai cuộc họp.' },
          ],
          mistake:
            'Sau "did" phải dùng động từ NGUYÊN THỂ: ❌ "Did you went?" → ✅ "Did you go?".',
        },
        {
          title: 'Trạng từ tần suất — đứng ở đâu?',
          explain:
            'always, usually, often, sometimes, rarely, never đứng TRƯỚC động từ thường nhưng SAU động từ "be".',
          formula: 'S + trạng từ + V(thường) · S + be + trạng từ',
          examples: [
            { en: 'I usually wake up at 6:30.', vi: 'Tôi thường dậy lúc 6h30.' },
            { en: 'He is always late.', vi: 'Anh ấy lúc nào cũng trễ.' },
          ],
          mistake: '❌ "I wake up usually at 6:30" → ✅ "I usually wake up at 6:30".',
        },
      ],
      sound: {
        sound: '/v/',
        how:
          'Răng cửa TRÊN chạm nhẹ môi DƯỚI rồi thổi hơi, có rung. Đây KHÔNG phải âm /z/ của tiếng Việt ' +
          'và cũng không phải /f/ (âm /f/ không rung).',
        words: [
          { en: 'very', ipa: '/ˈveri/', vi: 'rất' },
          { en: 'video', ipa: '/ˈvɪdiəʊ/', vi: 'video' },
          { en: 'have', ipa: '/hæv/', vi: 'có' },
          { en: 'value', ipa: '/ˈvæljuː/', vi: 'giá trị' },
          { en: 'available', ipa: '/əˈveɪləbl/', vi: 'có sẵn, rảnh' },
        ],
        sentence: { en: 'I have a very valuable video available.', vi: 'Tôi có một video rất giá trị đang sẵn.' },
        trap: 'Người Việt (nhất là miền Bắc) hay đọc /v/ thành /z/: "very" → "zery". Phải cắn nhẹ môi dưới.',
      },
      practice: [
        'Viết 5 câu kể việc bạn làm hôm nay bằng quá khứ đơn.',
        'Viết 5 câu kể thói quen hằng ngày bằng hiện tại đơn, có dùng trạng từ tần suất.',
        'Nói to trong 60 giây: một ngày của bạn từ sáng đến tối. Ghi âm lại.',
        'Luyện âm /v/: đọc 10 lần "very valuable video".',
        'Tự hỏi và tự trả lời "What did you do today?" mỗi tối trước khi ngủ.',
      ],
    },

    /* ══════════════════ NGÀY 4 ══════════════════ */
    {
      day: 4,
      icon: '🍜',
      title: 'Hôm nay ăn gì? — Chuyện ăn uống',
      goal:
        'Hỏi và trả lời về chuyện ăn uống, gọi món, mời và từ chối lời mời ăn — nhóm câu ' +
        'xuất hiện mỗi ngày và là chủ đề bắt chuyện an toàn nhất.',
      qa: [
        {
          q: { en: 'What do you want to eat?', vi: 'Bạn muốn ăn gì?', ipa: '/wɒt duː juː wɒnt tuː iːt/' },
          answers: [
            { en: 'Anything is fine with me.', vi: 'Gì cũng được với tôi.', ipa: '/ˈeniθɪŋ ɪz faɪn/' },
            { en: "I'm craving noodles.", vi: 'Tôi đang thèm mì.', ipa: '/ˈkreɪvɪŋ/', note: '"crave" = thèm. Rất tự nhiên.' },
            { en: 'How about pho? I know a good place.', vi: 'Phở nhé? Tôi biết một quán ngon.', ipa: '/haʊ əˈbaʊt/' },
            { en: "I don't mind. You pick.", vi: 'Tôi không kén. Bạn chọn đi.', ipa: '/aɪ dəʊnt maɪnd/' },
          ],
        },
        {
          q: { en: 'Have you eaten yet?', vi: 'Bạn ăn chưa?', ipa: '/hæv juː ˈiːtn jet/' },
          answers: [
            { en: 'Not yet. Are you hungry too?', vi: 'Chưa. Bạn cũng đói à?', ipa: '/nɒt jet/' },
            { en: 'Yeah, I just had lunch.', vi: 'Rồi, tôi vừa ăn trưa xong.', ipa: '/aɪ dʒʌst hæd/' },
            { en: "I'm about to. Want to join?", vi: 'Tôi sắp ăn. Muốn ăn cùng không?', ipa: '/əˈbaʊt tuː/', note: '"be about to" = sắp sửa.' },
          ],
        },
        {
          q: { en: 'Are you hungry?', vi: 'Bạn đói không?', ipa: '/ˈhʌŋɡri/' },
          answers: [
            { en: "I'm starving!", vi: 'Tôi đói lả rồi!', ipa: '/ˈstɑːvɪŋ/', note: 'Mạnh hơn "hungry" nhiều.' },
            { en: 'A little bit.', vi: 'Hơi hơi.', ipa: '/ə ˈlɪtl bɪt/' },
            { en: 'Not really, I ate an hour ago.', vi: 'Không hẳn, tôi ăn cách đây một tiếng.', ipa: '/nɒt ˈrɪəli/' },
          ],
        },
        {
          q: { en: 'What would you like to order?', vi: 'Bạn muốn gọi món gì?', ipa: '/wɒt wʊd juː laɪk/', note: 'Câu nhân viên nhà hàng hỏi. "would like" lịch sự hơn "want".' },
          answers: [
            { en: "I'll have the beef noodle soup, please.", vi: 'Cho tôi phở bò.', ipa: '/aɪl hæv/', note: '"I\'ll have…" là cách gọi món chuẩn nhất.' },
            { en: 'Can I get a coffee, please?', vi: 'Cho tôi một cà phê được không?', ipa: '/kæn aɪ ɡet/' },
            { en: 'What do you recommend?', vi: 'Bạn gợi ý món gì?', ipa: '/ˌrekəˈmend/' },
          ],
        },
        {
          q: { en: 'How does it taste?', vi: 'Ăn thấy thế nào?', ipa: '/haʊ dʌz ɪt teɪst/' },
          answers: [
            { en: "It's delicious!", vi: 'Ngon lắm!', ipa: '/dɪˈlɪʃəs/' },
            { en: "It's a bit salty for me.", vi: 'Hơi mặn với tôi.', ipa: '/ˈsɔːlti/' },
            { en: "It's okay, nothing special.", vi: 'Cũng được, không có gì đặc biệt.', ipa: '/ˈnʌθɪŋ ˈspeʃl/' },
          ],
        },
        {
          q: { en: 'Do you want to grab lunch?', vi: 'Đi ăn trưa không?', ipa: '/ɡræb lʌntʃ/', note: '"grab lunch/coffee" = đi ăn/uống nhanh. Rất thông dụng ở công sở.' },
          answers: [
            { en: 'Sure, where do you want to go?', vi: 'Được chứ, bạn muốn đi đâu?', ipa: '/weər duː juː wɒnt/' },
            { en: 'I’d love to, but I’m swamped right now.', vi: 'Tôi rất muốn, nhưng giờ tôi ngập việc.', ipa: '/swɒmpt/', note: '"swamped" = ngập trong việc.' },
            { en: 'Maybe tomorrow? I brought my lunch today.', vi: 'Mai nhé? Hôm nay tôi mang cơm theo.', ipa: '/aɪ brɔːt/' },
          ],
        },
        {
          q: { en: 'Can I get the bill, please?', vi: 'Cho tôi thanh toán được không?', ipa: '/ðə bɪl/', note: 'Anh–Anh dùng "bill", Anh–Mỹ dùng "check".' },
          answers: [
            { en: 'Of course, one moment.', vi: 'Tất nhiên, đợi một chút.', ipa: '/wʌn ˈməʊmənt/' },
            { en: "Let's split it.", vi: 'Chia đôi nhé.', ipa: '/splɪt ɪt/', note: '"split the bill" = chia tiền.' },
            { en: "It's on me today.", vi: 'Hôm nay tôi mời.', ipa: '/ɪts ɒn miː/', note: 'Cách nói "tôi trả" tự nhiên nhất.' },
          ],
        },
        {
          q: { en: 'Do you have any food allergies?', vi: 'Bạn có dị ứng đồ ăn gì không?', ipa: '/ˈælədʒiz/' },
          answers: [
            { en: "No, I eat everything.", vi: 'Không, tôi ăn được hết.', ipa: '/ˈevriθɪŋ/' },
            { en: "I'm allergic to seafood.", vi: 'Tôi dị ứng hải sản.', ipa: '/əˈlɜːdʒɪk/' },
            { en: "I don't eat pork.", vi: 'Tôi không ăn thịt heo.', ipa: '/pɔːk/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Deciding where to eat',
          titleVi: 'Chọn chỗ ăn',
          lines: [
            { who: 'Nam', en: 'Hey, have you eaten yet?', vi: 'Này, cậu ăn chưa?' },
            { who: 'Linh', en: 'Not yet. I’m starving, actually.', vi: 'Chưa. Thật ra tớ đói lả rồi.' },
            { who: 'Nam', en: 'Do you want to grab lunch? What are you craving?', vi: 'Đi ăn trưa không? Cậu thèm gì?' },
            { who: 'Linh', en: 'Anything is fine with me. You pick.', vi: 'Gì cũng được. Cậu chọn đi.' },
            { who: 'Nam', en: 'How about pho? I know a good place nearby.', vi: 'Phở nhé? Tớ biết một quán ngon gần đây.' },
            { who: 'Linh', en: 'Perfect. Let’s go.', vi: 'Tuyệt. Đi thôi.' },
          ],
        },
        {
          title: 'Ordering at a restaurant',
          titleVi: 'Gọi món ở nhà hàng',
          lines: [
            { who: 'Waiter', en: 'Good afternoon. What would you like to order?', vi: 'Chào buổi chiều. Anh/chị muốn gọi món gì ạ?' },
            { who: 'Cuong', en: 'What do you recommend?', vi: 'Bạn gợi ý món nào?' },
            { who: 'Waiter', en: 'The beef noodle soup is very popular.', vi: 'Phở bò rất được ưa chuộng ạ.' },
            { who: 'Cuong', en: 'Great, I’ll have that, please. And a coffee.', vi: 'Tuyệt, cho tôi món đó. Và một cà phê.' },
            { who: 'Waiter', en: 'Anything else?', vi: 'Anh/chị dùng thêm gì không ạ?' },
            { who: 'Cuong', en: 'That’s all, thanks.', vi: 'Vậy thôi, cảm ơn.' },
            { who: 'Cuong', en: 'Excuse me, can I get the bill, please?', vi: 'Xin lỗi, cho tôi thanh toán được không?' },
          ],
        },
      ],
      vocab: [
        { en: 'starving', ipa: '/ˈstɑːvɪŋ/', vi: 'đói lả', pos: 'adj' },
        { en: 'crave', ipa: '/kreɪv/', vi: 'thèm', pos: 'v' },
        { en: 'grab (lunch/coffee)', ipa: '/ɡræb/', vi: 'đi ăn/uống nhanh', pos: 'v' },
        { en: 'delicious', ipa: '/dɪˈlɪʃəs/', vi: 'ngon', pos: 'adj' },
        { en: 'salty', ipa: '/ˈsɔːlti/', vi: 'mặn', pos: 'adj' },
        { en: 'spicy', ipa: '/ˈspaɪsi/', vi: 'cay', pos: 'adj' },
        { en: 'sour', ipa: '/ˈsaʊər/', vi: 'chua', pos: 'adj' },
        { en: 'recommend', ipa: '/ˌrekəˈmend/', vi: 'gợi ý, giới thiệu', pos: 'v' },
        { en: 'bill / check', ipa: '/bɪl/ /tʃek/', vi: 'hoá đơn', pos: 'n' },
        { en: 'split the bill', ipa: '/splɪt ðə bɪl/', vi: 'chia tiền', pos: 'phr' },
        { en: 'allergic to', ipa: '/əˈlɜːdʒɪk tuː/', vi: 'dị ứng với', pos: 'adj' },
        { en: 'swamped', ipa: '/swɒmpt/', vi: 'ngập việc', pos: 'adj' },
        { en: 'be about to', ipa: '/biː əˈbaʊt tuː/', vi: 'sắp sửa', pos: 'phr' },
      ],
      grammar: [
        {
          title: '"would like" — cách nói lịch sự thay cho "want"',
          explain:
            '"want" nghe hơi thẳng. Trong nhà hàng, với khách hàng hoặc người lớn tuổi, dùng "would like" ' +
            '(viết tắt: I\'d like). Theo sau là danh từ hoặc to + V.',
          formula: "S + would like + N / to + V",
          examples: [
            { en: "I'd like a coffee, please.", vi: 'Cho tôi một cà phê.' },
            { en: "I'd like to book a table for two.", vi: 'Tôi muốn đặt bàn cho hai người.' },
          ],
          mistake: '❌ "I would like coffee?" (lên giọng hỏi) → khi GỌI món là câu kể, thêm "please" cho lịch sự.',
        },
        {
          title: 'Danh từ đếm được và không đếm được',
          explain:
            'Đồ ăn thức uống hay là danh từ KHÔNG đếm được: rice, water, coffee, bread. Muốn đếm phải mượn ' +
            'đơn vị: a bowl of rice, a cup of coffee.',
          formula: 'a / an + đếm được · some / a lot of + không đếm được · a [đơn vị] of + không đếm được',
          examples: [
            { en: 'I had a bowl of pho.', vi: 'Tôi ăn một tô phở.' },
            { en: 'Can I get some water?', vi: 'Cho tôi ít nước được không?' },
          ],
          mistake: '❌ "I want two rices" → ✅ "I want two bowls of rice".',
        },
        {
          title: '"How about…?" — cách đề nghị nhẹ nhàng',
          explain: 'Dùng để gợi ý mà không áp đặt. Theo sau là danh từ hoặc V-ing.',
          formula: 'How about + N / V-ing?',
          examples: [
            { en: 'How about pho?', vi: 'Phở nhé?' },
            { en: 'How about going out tonight?', vi: 'Tối nay đi chơi nhé?' },
          ],
        },
      ],
      sound: {
        sound: '/ʃ/ và /tʃ/',
        how:
          '/ʃ/ là âm "s" kéo dài, môi tròn, hơi thoát liên tục (như tiếng suỵt). ' +
          '/tʃ/ có một tiếng bật "t" ở đầu rồi mới tới /ʃ/.',
        words: [
          { en: 'delicious', ipa: '/dɪˈlɪʃəs/', vi: 'ngon' },
          { en: 'she', ipa: '/ʃiː/', vi: 'cô ấy' },
          { en: 'chicken', ipa: '/ˈtʃɪkɪn/', vi: 'thịt gà' },
          { en: 'lunch', ipa: '/lʌntʃ/', vi: 'bữa trưa' },
          { en: 'choose', ipa: '/tʃuːz/', vi: 'chọn' },
        ],
        sentence: { en: 'She chose delicious chicken for lunch.', vi: 'Cô ấy chọn món gà ngon cho bữa trưa.' },
        trap: 'Đừng lẫn "ship" /ʃ/ với "chip" /tʃ/ — nghe khác hẳn với người bản xứ.',
      },
      practice: [
        'Đóng vai: tự gọi một bữa ăn đầy đủ bằng tiếng Anh (món chính + đồ uống + hỏi hoá đơn).',
        'Kể lại bữa ăn gần nhất của bạn bằng 5 câu quá khứ đơn.',
        'Học thuộc 3 cách từ chối lời mời ăn mà vẫn lịch sự.',
        'Luyện cặp /ʃ/ – /tʃ/: "ship–chip", "share–chair", "wash–watch".',
        'Mỗi bữa ăn hôm nay, tự nói thầm tên món và mùi vị bằng tiếng Anh.',
      ],
    },

    /* ══════════════════ NGÀY 5 ══════════════════ */
    {
      day: 5,
      icon: '⏰',
      title: 'Thời gian, ngày tháng & hẹn giờ',
      goal:
        'Nói giờ, hỏi giờ, hẹn lịch và xác nhận thời gian — nền tảng để đặt lịch họp với khách hàng ' +
        'ở phần sau của khoá học.',
      qa: [
        {
          q: { en: 'What time is it?', vi: 'Mấy giờ rồi?', ipa: '/wɒt taɪm ɪz ɪt/' },
          answers: [
            { en: "It's half past two.", vi: 'Hai giờ rưỡi.', ipa: '/hɑːf pɑːst/', note: 'half past 2 = 2:30.' },
            { en: "It's a quarter to five.", vi: 'Năm giờ kém mười lăm (4:45).', ipa: '/ə ˈkwɔːtər tuː/' },
            { en: "It's 9:15.", vi: '9 giờ 15.', ipa: '/naɪn fɪfˈtiːn/', note: 'Cách đọc số trực tiếp — đơn giản và luôn đúng.' },
          ],
        },
        {
          q: { en: 'What time works for you?', vi: 'Mấy giờ thì tiện cho bạn?', ipa: '/wɒt taɪm wɜːks/', note: 'Câu vàng khi hẹn lịch với khách.' },
          answers: [
            { en: '2 p.m. works for me.', vi: '2 giờ chiều thì tiện cho tôi.', ipa: '/wɜːks fɔːr miː/' },
            { en: 'Anytime after 3 is fine.', vi: 'Sau 3 giờ lúc nào cũng được.', ipa: '/ˈenitaɪm/' },
            { en: "I'm free in the morning. Does 10 work?", vi: 'Buổi sáng tôi rảnh. 10 giờ được không?', ipa: '/dʌz ten wɜːk/' },
          ],
        },
        {
          q: { en: 'Are you free tomorrow?', vi: 'Mai bạn rảnh không?', ipa: '/ɑːr juː friː/' },
          answers: [
            { en: 'Yes, I am. What time?', vi: 'Có. Mấy giờ?', ipa: '/wɒt taɪm/' },
            { en: "Sorry, I'm busy tomorrow. How about Friday?", vi: 'Xin lỗi, mai tôi bận. Thứ Sáu được không?', ipa: '/ˈfraɪdeɪ/' },
            { en: 'Let me check my calendar and get back to you.', vi: 'Để tôi xem lịch rồi báo lại bạn.', ipa: '/ˈkælɪndər/' },
          ],
        },
        {
          q: { en: 'When is the meeting?', vi: 'Cuộc họp lúc nào?', ipa: '/wen ɪz ðə ˈmiːtɪŋ/' },
          answers: [
            { en: "It's at 10 a.m. on Monday.", vi: '10 giờ sáng thứ Hai.', ipa: '/æt ten/', note: 'at + giờ · on + thứ/ngày · in + tháng/năm.' },
            { en: "It's in two hours.", vi: 'Hai tiếng nữa.', ipa: '/ɪn tuː ˈaʊəz/' },
            { en: 'It got moved to next week.', vi: 'Nó bị dời sang tuần sau.', ipa: '/ɡɒt muːvd/' },
          ],
        },
        {
          q: { en: 'How long does it take?', vi: 'Mất bao lâu?', ipa: '/haʊ lɒŋ dʌz ɪt teɪk/' },
          answers: [
            { en: 'About 20 minutes.', vi: 'Khoảng 20 phút.', ipa: '/əˈbaʊt/' },
            { en: 'It takes around an hour.', vi: 'Mất khoảng một tiếng.', ipa: '/ɪt teɪks/' },
            { en: 'Not long — 10 minutes or so.', vi: 'Không lâu — chừng 10 phút.', ipa: '/ɔːr səʊ/' },
          ],
        },
        {
          q: { en: 'Can we reschedule?', vi: 'Chúng ta dời lịch được không?', ipa: '/ˌriːˈʃedjuːl/', note: 'Cực kỳ cần khi làm việc với khách nước ngoài.' },
          answers: [
            { en: 'Sure, what day works for you?', vi: 'Được, ngày nào tiện cho bạn?', ipa: '/wɒt deɪ wɜːks/' },
            { en: 'No problem. Let’s move it to Thursday.', vi: 'Không sao. Dời sang thứ Năm nhé.', ipa: '/ˈθɜːzdeɪ/' },
            { en: 'Of course. Sorry for the short notice.', vi: 'Tất nhiên. Xin lỗi vì báo gấp.', ipa: '/ʃɔːt ˈnəʊtɪs/', note: '"short notice" = báo sát giờ.' },
          ],
        },
        {
          q: { en: "I'm running late.", vi: 'Tôi đang bị trễ.', ipa: '/ˈrʌnɪŋ leɪt/', note: 'Câu phải thuộc — dùng khi kẹt xe, họp muộn.' },
          answers: [
            { en: 'No worries, take your time.', vi: 'Không sao, cứ từ từ.', ipa: '/teɪk jɔːr taɪm/' },
            { en: 'How late do you think you’ll be?', vi: 'Bạn nghĩ sẽ trễ bao lâu?', ipa: '/haʊ leɪt/' },
            { en: "Thanks for letting me know.", vi: 'Cảm ơn đã báo tôi.', ipa: '/ˈletɪŋ miː nəʊ/' },
          ],
        },
        {
          q: { en: 'What day is it today?', vi: 'Hôm nay là thứ mấy?', ipa: '/wɒt deɪ ɪz ɪt/' },
          answers: [
            { en: "It's Wednesday.", vi: 'Thứ Tư.', ipa: '/ˈwenzdeɪ/', note: 'Chú ý: "Wednesday" đọc là /ˈwenzdeɪ/, KHÔNG đọc chữ "d" ở giữa.' },
            { en: "It's the 15th of March.", vi: 'Ngày 15 tháng Ba.', ipa: '/ðə fɪfˈtiːnθ/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Scheduling a meeting',
          titleVi: 'Hẹn lịch họp',
          lines: [
            { who: 'Client', en: 'Hi Cuong, are you free tomorrow for a quick call?', vi: 'Chào Cường, mai bạn rảnh gọi nhanh một cuộc không?' },
            { who: 'Cuong', en: 'Let me check my calendar… Yes, I am. What time works for you?', vi: 'Để tôi xem lịch… Vâng, tôi rảnh. Mấy giờ thì tiện cho bạn?' },
            { who: 'Client', en: 'How about 2 p.m. your time?', vi: '2 giờ chiều giờ của bạn nhé?' },
            { who: 'Cuong', en: '2 p.m. works for me. How long will it take?', vi: '2 giờ chiều thì tiện. Cuộc gọi mất bao lâu?' },
            { who: 'Client', en: 'About 30 minutes.', vi: 'Khoảng 30 phút.' },
            { who: 'Cuong', en: 'Perfect. I’ll send you a calendar invite.', vi: 'Tuyệt. Tôi sẽ gửi bạn lời mời lịch.' },
          ],
        },
        {
          title: 'Running late',
          titleVi: 'Báo trễ hẹn',
          lines: [
            { who: 'Cuong', en: 'Hi, I’m so sorry — I’m running late. Traffic is bad.', vi: 'Chào, tôi rất xin lỗi — tôi bị trễ. Kẹt xe quá.' },
            { who: 'Linh', en: 'No worries. How late do you think you’ll be?', vi: 'Không sao. Cậu nghĩ sẽ trễ bao lâu?' },
            { who: 'Cuong', en: 'About 15 minutes. Sorry for the short notice.', vi: 'Khoảng 15 phút. Xin lỗi vì báo gấp.' },
            { who: 'Linh', en: 'That’s fine. Take your time and drive safely.', vi: 'Không sao đâu. Cứ từ từ và đi cẩn thận nhé.' },
          ],
        },
      ],
      vocab: [
        { en: 'reschedule', ipa: '/ˌriːˈʃedjuːl/', vi: 'dời lịch', pos: 'v' },
        { en: 'calendar', ipa: '/ˈkælɪndər/', vi: 'lịch', pos: 'n' },
        { en: 'short notice', ipa: '/ʃɔːt ˈnəʊtɪs/', vi: 'báo gấp', pos: 'n' },
        { en: 'run late', ipa: '/rʌn leɪt/', vi: 'bị trễ', pos: 'phr' },
        { en: 'on time', ipa: '/ɒn taɪm/', vi: 'đúng giờ', pos: 'phr' },
        { en: 'in advance', ipa: '/ɪn ədˈvɑːns/', vi: 'trước, sớm', pos: 'phr', ex: 'Please let me know in advance.', exVi: 'Vui lòng báo tôi trước.' },
        { en: 'deadline', ipa: '/ˈdedlaɪn/', vi: 'hạn chót', pos: 'n' },
        { en: 'appointment', ipa: '/əˈpɔɪntmənt/', vi: 'cuộc hẹn', pos: 'n' },
        { en: 'available', ipa: '/əˈveɪləbl/', vi: 'rảnh, có mặt được', pos: 'adj' },
        { en: 'quarter', ipa: '/ˈkwɔːtər/', vi: 'mười lăm phút', pos: 'n' },
        { en: 'Wednesday', ipa: '/ˈwenzdeɪ/', vi: 'thứ Tư', pos: 'n' },
        { en: 'take your time', ipa: '/teɪk jɔːr taɪm/', vi: 'cứ từ từ', pos: 'phr' },
      ],
      grammar: [
        {
          title: 'Giới từ thời gian: at / on / in',
          explain:
            'Ba giới từ này sai là lộ ngay. Quy tắc: nhỏ nhất dùng "at", ngày dùng "on", lớn nhất dùng "in".',
          formula: 'at + giờ (at 3 p.m.) · on + thứ/ngày (on Monday) · in + tháng/năm/buổi (in May, in the morning)',
          examples: [
            { en: 'The meeting is at 10 a.m.', vi: 'Cuộc họp lúc 10 giờ sáng.' },
            { en: 'I work on Saturdays.', vi: 'Tôi làm việc vào thứ Bảy.' },
            { en: 'I started in 2022.', vi: 'Tôi bắt đầu năm 2022.' },
          ],
          mistake: '❌ "in Monday" → ✅ "on Monday". ❌ "on 3 p.m." → ✅ "at 3 p.m.". Ngoại lệ: "at night".',
        },
        {
          title: 'Cách nói giờ — hai kiểu',
          explain:
            'Kiểu 1 (dễ nhất): đọc thẳng số — "It\'s 9:15". Kiểu 2 (tự nhiên hơn): dùng past/to. ' +
            'Dùng "past" khi phút ≤ 30, dùng "to" khi phút > 30.',
          formula: '[phút] past [giờ] · [phút còn lại] to [giờ tiếp theo]',
          examples: [
            { en: "It's ten past three. (3:10)", vi: 'Ba giờ mười.' },
            { en: "It's half past three. (3:30)", vi: 'Ba giờ rưỡi.' },
            { en: "It's a quarter to four. (3:45)", vi: 'Bốn giờ kém mười lăm.' },
          ],
        },
        {
          title: 'Tương lai: will vs. be going to',
          explain:
            '"will" cho quyết định ngay lúc nói hoặc lời hứa. "be going to" cho dự định đã có sẵn.',
          formula: 'will + V(nguyên thể) · am/is/are going to + V',
          examples: [
            { en: "I'll send you a calendar invite.", vi: 'Tôi sẽ gửi bạn lời mời lịch. (quyết định ngay)' },
            { en: "I'm going to visit my family next week.", vi: 'Tuần sau tôi sẽ về thăm gia đình. (đã định trước)' },
          ],
        },
      ],
      sound: {
        sound: '/w/',
        how:
          'Chu môi tròn lại như sắp huýt sáo rồi bật ra. KHÔNG được để răng chạm môi (đó là /v/).',
        words: [
          { en: 'work', ipa: '/wɜːk/', vi: 'làm việc' },
          { en: 'week', ipa: '/wiːk/', vi: 'tuần' },
          { en: 'what', ipa: '/wɒt/', vi: 'cái gì' },
          { en: 'when', ipa: '/wen/', vi: 'khi nào' },
          { en: 'would', ipa: '/wʊd/', vi: '(trợ động từ)' },
        ],
        sentence: { en: 'What time would work for you this week?', vi: 'Tuần này mấy giờ thì tiện cho bạn?' },
        trap:
          'Người Việt hay lẫn /w/ với /v/: "work" thành "vork". Nhớ: /w/ KHÔNG chạm răng, /v/ CÓ chạm răng.',
      },
      practice: [
        'Đọc to 10 mốc giờ bất kỳ theo cả hai kiểu (số trực tiếp và past/to).',
        'Viết một đoạn hội thoại hẹn lịch họp với khách hàng, dài 6 câu.',
        'Học thuộc 3 câu: "What time works for you?", "Can we reschedule?", "I\'m running late.".',
        'Luyện cặp /w/ – /v/: "wine–vine", "west–vest", "worse–verse".',
        'Ôn lại toàn bộ tuần 1: nói liên tục 2 phút giới thiệu bản thân + kể một ngày + hẹn gặp ai đó.',
      ],
    },
  ],
};
