/**
 * TUẦN 2 — Sống và xoay xở (Ngày 6–10).
 *
 * Tuần 1 lo phần "chào và nói về mình". Tuần 2 lo phần "xoay xở được ngoài
 * đời": bắt chuyện bằng thời tiết, nói về người thân, kể sở thích, mua bán
 * và hỏi đường. Đây là bộ câu giúp bạn sống sót ở nước ngoài mà không cần
 * ai phiên dịch.
 */
import type { WeekBlock } from './types';

export const WEEK_2: WeekBlock = {
  week: 2,
  title: 'Sống và xoay xở',
  subtitle:
    'Thời tiết, gia đình, sở thích, mua sắm và hỏi đường — nhóm câu giúp bạn tự lo được ' +
    'mọi tình huống đời thường.',
  days: [
    /* ══════════════════ NGÀY 6 ══════════════════ */
    {
      day: 6,
      icon: '🌤️',
      title: 'Thời tiết & bắt chuyện',
      goal:
        'Dùng thời tiết để mở đầu và kéo dài câu chuyện với bất kỳ ai — chủ đề an toàn nhất ' +
        'trong mọi nền văn hoá nói tiếng Anh.',
      qa: [
        {
          q: { en: "What's the weather like today?", vi: 'Hôm nay thời tiết thế nào?', ipa: '/ˈweðər laɪk/', note: 'Chú ý cấu trúc "What is … like?" = hỏi tính chất.' },
          answers: [
            { en: "It's sunny and warm.", vi: 'Nắng và ấm.', ipa: '/ˈsʌni ənd wɔːm/' },
            { en: "It's raining pretty hard.", vi: 'Mưa khá to.', ipa: '/ˈreɪnɪŋ/' },
            { en: "It's freezing out there!", vi: 'Ngoài kia lạnh cóng!', ipa: '/ˈfriːzɪŋ/', note: 'Mạnh hơn "cold" rất nhiều.' },
            { en: "It's humid and sticky.", vi: 'Ẩm và oi bức.', ipa: '/ˈhjuːmɪd/', note: 'Rất đúng với thời tiết Việt Nam.' },
          ],
        },
        {
          q: { en: 'Nice weather today, isn’t it?', vi: 'Hôm nay thời tiết đẹp nhỉ?', ipa: '/ˈɪznt ɪt/', note: 'Câu hỏi đuôi — cách bắt chuyện với người lạ kinh điển.' },
          answers: [
            { en: 'Yes, it’s lovely!', vi: 'Vâng, đẹp thật!', ipa: '/ˈlʌvli/' },
            { en: 'It really is. Finally some sunshine.', vi: 'Đúng thật. Cuối cùng cũng có nắng.', ipa: '/ˈsʌnʃaɪn/' },
            { en: 'Yeah, but it’s supposed to rain later.', vi: 'Ừ, nhưng nghe nói lát nữa mưa.', ipa: '/səˈpəʊzd tuː/', note: '"be supposed to" = được cho là, dự kiến.' },
          ],
        },
        {
          q: { en: 'Is it going to rain?', vi: 'Trời sắp mưa à?', ipa: '/ˈɡəʊɪŋ tuː reɪn/' },
          answers: [
            { en: 'I think so. Look at those clouds.', vi: 'Tôi nghĩ vậy. Nhìn mấy đám mây kìa.', ipa: '/klaʊdz/' },
            { en: 'The forecast says yes.', vi: 'Dự báo nói là có.', ipa: '/ˈfɔːkɑːst/' },
            { en: 'Hopefully not. I forgot my umbrella.', vi: 'Mong là không. Tôi quên mang ô.', ipa: '/ʌmˈbrelə/' },
          ],
        },
        {
          q: { en: 'What’s your favorite season?', vi: 'Mùa bạn thích nhất là gì?', ipa: '/ˈsiːzn/' },
          answers: [
            { en: 'Autumn, definitely. It’s cool and dry.', vi: 'Chắc chắn là mùa thu. Mát và khô.', ipa: '/ˈɔːtəm/' },
            { en: 'I love spring because everything is green.', vi: 'Tôi thích mùa xuân vì mọi thứ đều xanh.', ipa: '/sprɪŋ/' },
            { en: 'Not summer — it’s too hot here.', vi: 'Không phải mùa hè — ở đây nóng quá.', ipa: '/tuː hɒt/' },
          ],
        },
        {
          q: { en: 'How’s the weather where you are?', vi: 'Chỗ bạn thời tiết thế nào?', ipa: '/weər juː ɑːr/', note: 'Câu mở đầu tuyệt vời khi họp online với khách nước ngoài.' },
          answers: [
            { en: 'It’s about 30 degrees and sunny here.', vi: 'Ở đây khoảng 30 độ và nắng.', ipa: '/dɪˈɡriːz/' },
            { en: 'Rainy season just started here in Vietnam.', vi: 'Mùa mưa vừa bắt đầu ở Việt Nam.', ipa: '/ˈreɪni ˈsiːzn/' },
          ],
        },
        {
          q: { en: 'Do you prefer hot or cold weather?', vi: 'Bạn thích thời tiết nóng hay lạnh?', ipa: '/prɪˈfɜːr/' },
          answers: [
            { en: 'I prefer cold weather. I can always wear more.', vi: 'Tôi thích lạnh hơn. Lạnh thì mặc thêm được.', ipa: '/weər mɔːr/' },
            { en: 'Hot, definitely. I hate being cold.', vi: 'Chắc chắn là nóng. Tôi ghét bị lạnh.', ipa: '/aɪ heɪt/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Small talk in the elevator',
          titleVi: 'Bắt chuyện trong thang máy',
          lines: [
            { who: 'A', en: 'Nice weather today, isn’t it?', vi: 'Hôm nay thời tiết đẹp nhỉ?' },
            { who: 'B', en: 'It really is. Finally some sunshine!', vi: 'Đúng thật. Cuối cùng cũng có nắng!' },
            { who: 'A', en: 'Yeah, but the forecast says it’s going to rain later.', vi: 'Ừ, nhưng dự báo nói lát nữa mưa.' },
            { who: 'B', en: 'Oh no, and I forgot my umbrella again.', vi: 'Ôi không, tôi lại quên mang ô rồi.' },
            { who: 'A', en: 'Same here. Well, have a good one!', vi: 'Tôi cũng vậy. Thôi, chúc một ngày tốt lành!' },
          ],
        },
      ],
      vocab: [
        { en: 'sunny', ipa: '/ˈsʌni/', vi: 'nắng', pos: 'adj' },
        { en: 'cloudy', ipa: '/ˈklaʊdi/', vi: 'nhiều mây', pos: 'adj' },
        { en: 'humid', ipa: '/ˈhjuːmɪd/', vi: 'ẩm', pos: 'adj' },
        { en: 'freezing', ipa: '/ˈfriːzɪŋ/', vi: 'lạnh cóng', pos: 'adj' },
        { en: 'boiling', ipa: '/ˈbɔɪlɪŋ/', vi: 'nóng như thiêu', pos: 'adj' },
        { en: 'forecast', ipa: '/ˈfɔːkɑːst/', vi: 'dự báo', pos: 'n' },
        { en: 'umbrella', ipa: '/ʌmˈbrelə/', vi: 'ô, dù', pos: 'n' },
        { en: 'season', ipa: '/ˈsiːzn/', vi: 'mùa', pos: 'n' },
        { en: 'degree', ipa: '/dɪˈɡriː/', vi: 'độ (nhiệt độ)', pos: 'n' },
        { en: 'be supposed to', ipa: '/səˈpəʊzd tuː/', vi: 'được cho là, dự kiến', pos: 'phr' },
        { en: 'prefer', ipa: '/prɪˈfɜːr/', vi: 'thích hơn', pos: 'v' },
        { en: 'storm', ipa: '/stɔːm/', vi: 'bão', pos: 'n' },
      ],
      grammar: [
        {
          title: 'Câu hỏi đuôi (tag questions)',
          explain:
            'Thêm một câu hỏi ngắn ở cuối để mời người kia đồng tình. Quy tắc: mệnh đề khẳng định → đuôi phủ định, và ngược lại.',
          formula: 'S + V(khẳng định), + trợ động từ phủ định + S? · S + V(phủ định), + trợ động từ + S?',
          examples: [
            { en: "It's a nice day, isn't it?", vi: 'Hôm nay đẹp trời nhỉ?' },
            { en: "You're a developer, aren't you?", vi: 'Bạn là lập trình viên đúng không?' },
            { en: "It isn't cold, is it?", vi: 'Trời không lạnh, đúng không?' },
          ],
          mistake: 'Đuôi phải NGƯỢC dấu với mệnh đề chính: ❌ "It\'s nice, is it?" → ✅ "It\'s nice, isn\'t it?".',
        },
        {
          title: '"It" giả chủ ngữ khi nói thời tiết',
          explain:
            'Tiếng Anh BẮT BUỘC có chủ ngữ. Nói về thời tiết, giờ giấc, khoảng cách thì dùng "it" dù nó không chỉ vật gì cụ thể.',
          formula: 'It + be + tính từ / It + V-ing',
          examples: [
            { en: "It's raining.", vi: 'Trời đang mưa.' },
            { en: "It's 30 degrees today.", vi: 'Hôm nay 30 độ.' },
          ],
          mistake: '❌ "Today rain" / "Is raining" → ✅ "It\'s raining today". Tiếng Việt bỏ chủ ngữ được, tiếng Anh thì không.',
        },
      ],
      sound: {
        sound: '/r/',
        how:
          'Cuộn nhẹ đầu lưỡi lên phía vòm miệng nhưng KHÔNG chạm vào đâu cả, môi hơi tròn. ' +
          'Đây không phải âm "r" rung của tiếng Việt.',
        words: [
          { en: 'rain', ipa: '/reɪn/', vi: 'mưa' },
          { en: 'really', ipa: '/ˈrɪəli/', vi: 'thật sự' },
          { en: 'return', ipa: '/rɪˈtɜːn/', vi: 'trả về' },
          { en: 'array', ipa: '/əˈreɪ/', vi: 'mảng (lập trình)' },
          { en: 'right', ipa: '/raɪt/', vi: 'đúng, bên phải' },
        ],
        sentence: { en: 'It really rained hard right around three.', vi: 'Trời mưa thật to đúng khoảng ba giờ.' },
        trap: 'Đừng rung lưỡi như "r" tiếng Việt. Lưỡi cuộn và KHÔNG chạm vòm miệng.',
      },
      practice: [
        'Mỗi sáng mở cửa sổ, tự nói một câu về thời tiết bằng tiếng Anh.',
        'Viết 5 câu hỏi đuôi về thời tiết và tự trả lời.',
        'Luyện âm /r/: đọc 10 lần "really rainy right".',
        'Tập bắt chuyện: viết đoạn hội thoại 5 câu bắt đầu bằng thời tiết rồi chuyển sang chủ đề khác.',
      ],
    },

    /* ══════════════════ NGÀY 7 ══════════════════ */
    {
      day: 7,
      icon: '👨‍👩‍👧',
      title: 'Gia đình & bạn bè',
      goal: 'Nói về người thân, mô tả tính cách và ngoại hình, kể chuyện gia đình một cách tự nhiên.',
      qa: [
        {
          q: { en: 'Do you have any siblings?', vi: 'Bạn có anh chị em không?', ipa: '/ˈsɪblɪŋz/', note: '"siblings" = anh chị em nói chung, không phân biệt giới.' },
          answers: [
            { en: 'Yes, I have an older brother and a younger sister.', vi: 'Có, tôi có một anh trai và một em gái.', ipa: '/ˈəʊldər ˈbrʌðər/' },
            { en: "No, I'm an only child.", vi: 'Không, tôi là con một.', ipa: '/ˈəʊnli tʃaɪld/' },
            { en: "There are three of us — I'm the middle one.", vi: 'Nhà tôi ba anh em — tôi là con giữa.', ipa: '/ðə ˈmɪdl wʌn/' },
          ],
        },
        {
          q: { en: 'Do you live with your family?', vi: 'Bạn sống với gia đình à?', ipa: '/lɪv wɪð/' },
          answers: [
            { en: 'Yes, I live with my parents.', vi: 'Vâng, tôi sống với bố mẹ.', ipa: '/ˈpeərənts/' },
            { en: "No, I live on my own.", vi: 'Không, tôi sống một mình.', ipa: '/ɒn maɪ əʊn/' },
            { en: 'I share an apartment with a friend.', vi: 'Tôi ở chung căn hộ với một người bạn.', ipa: '/əˈpɑːtmənt/' },
          ],
        },
        {
          q: { en: 'What does your father do?', vi: 'Bố bạn làm nghề gì?', ipa: '/wɒt dʌz/' },
          answers: [
            { en: "He's a teacher.", vi: 'Bố tôi là giáo viên.', ipa: '/ˈtiːtʃər/' },
            { en: "He's retired now.", vi: 'Bố tôi nghỉ hưu rồi.', ipa: '/rɪˈtaɪəd/' },
            { en: 'He runs a small business.', vi: 'Bố tôi kinh doanh nhỏ.', ipa: '/rʌnz ə ˈbɪznəs/' },
          ],
        },
        {
          q: { en: 'What is she like?', vi: 'Cô ấy là người thế nào? (tính cách)', ipa: '/wɒt ɪz ʃiː laɪk/', note: 'Hỏi TÍNH CÁCH. Khác với "What does she look like?" = hỏi NGOẠI HÌNH.' },
          answers: [
            { en: "She's really kind and patient.", vi: 'Cô ấy rất tốt bụng và kiên nhẫn.', ipa: '/ˈpeɪʃnt/' },
            { en: "She's funny — she makes everyone laugh.", vi: 'Cô ấy hài hước — làm ai cũng cười.', ipa: '/ˈfʌni/' },
            { en: "She can be a bit stubborn sometimes.", vi: 'Đôi khi cô ấy hơi bướng.', ipa: '/ˈstʌbən/' },
          ],
        },
        {
          q: { en: 'What does he look like?', vi: 'Anh ấy trông thế nào? (ngoại hình)', ipa: '/lʊk laɪk/' },
          answers: [
            { en: "He's tall with short black hair.", vi: 'Anh ấy cao, tóc đen ngắn.', ipa: '/tɔːl/' },
            { en: 'He wears glasses and has a beard.', vi: 'Anh ấy đeo kính và để râu.', ipa: '/ˈɡlɑːsɪz/' },
          ],
        },
        {
          q: { en: 'Are you close to your family?', vi: 'Bạn có thân với gia đình không?', ipa: '/kləʊs tuː/', note: 'Chú ý: "close" ở đây đọc /kləʊs/ (thân thiết), không phải /kləʊz/ (đóng).' },
          answers: [
            { en: 'Yes, very. We talk every day.', vi: 'Rất thân. Chúng tôi nói chuyện mỗi ngày.', ipa: '/ˈevri deɪ/' },
            { en: 'We’re close, but I don’t see them often.', vi: 'Chúng tôi thân, nhưng tôi ít gặp họ.', ipa: '/ˈɒfn/' },
          ],
        },
        {
          q: { en: 'How did you two meet?', vi: 'Hai bạn quen nhau thế nào?', ipa: '/haʊ dɪd juː tuː miːt/' },
          answers: [
            { en: 'We went to university together.', vi: 'Chúng tôi học đại học cùng nhau.', ipa: '/ˌjuːnɪˈvɜːsəti/' },
            { en: 'We used to work at the same company.', vi: 'Chúng tôi từng làm cùng công ty.', ipa: '/juːst tuː/', note: '"used to" = từng (nay không còn).' },
            { en: 'We met through a mutual friend.', vi: 'Chúng tôi quen qua một người bạn chung.', ipa: '/ˈmjuːtʃuəl/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Talking about family',
          titleVi: 'Nói chuyện về gia đình',
          lines: [
            { who: 'Sarah', en: 'Do you have any siblings?', vi: 'Bạn có anh chị em không?' },
            { who: 'Cuong', en: 'Yes, I have an older brother and a younger sister. How about you?', vi: 'Có, tôi có một anh trai và một em gái. Còn bạn?' },
            { who: 'Sarah', en: "I'm an only child, actually. What's your brother like?", vi: 'Thật ra tôi là con một. Anh trai bạn là người thế nào?' },
            { who: 'Cuong', en: 'He’s really kind, but he can be a bit stubborn sometimes.', vi: 'Anh ấy rất tốt bụng, nhưng đôi khi hơi bướng.' },
            { who: 'Sarah', en: 'Ha! Are you close to him?', vi: 'Haha! Bạn có thân với anh ấy không?' },
            { who: 'Cuong', en: 'Yes, very. We talk almost every day.', vi: 'Rất thân. Gần như ngày nào chúng tôi cũng nói chuyện.' },
          ],
        },
      ],
      vocab: [
        { en: 'siblings', ipa: '/ˈsɪblɪŋz/', vi: 'anh chị em', pos: 'n' },
        { en: 'only child', ipa: '/ˈəʊnli tʃaɪld/', vi: 'con một', pos: 'n' },
        { en: 'parents', ipa: '/ˈpeərənts/', vi: 'bố mẹ', pos: 'n' },
        { en: 'relative', ipa: '/ˈrelətɪv/', vi: 'họ hàng', pos: 'n' },
        { en: 'retired', ipa: '/rɪˈtaɪəd/', vi: 'đã nghỉ hưu', pos: 'adj' },
        { en: 'patient', ipa: '/ˈpeɪʃnt/', vi: 'kiên nhẫn', pos: 'adj' },
        { en: 'stubborn', ipa: '/ˈstʌbən/', vi: 'bướng bỉnh', pos: 'adj' },
        { en: 'generous', ipa: '/ˈdʒenərəs/', vi: 'hào phóng', pos: 'adj' },
        { en: 'outgoing', ipa: '/ˌaʊtˈɡəʊɪŋ/', vi: 'hướng ngoại', pos: 'adj' },
        { en: 'shy', ipa: '/ʃaɪ/', vi: 'nhút nhát', pos: 'adj' },
        { en: 'mutual friend', ipa: '/ˈmjuːtʃuəl frend/', vi: 'bạn chung', pos: 'n' },
        { en: 'used to', ipa: '/juːst tuː/', vi: 'từng (nay không còn)', pos: 'phr' },
      ],
      grammar: [
        {
          title: '"What is he like?" vs "What does he look like?"',
          explain:
            'Hai câu rất giống nhau nhưng hỏi hai thứ khác hẳn. Nhầm là trả lời lạc đề ngay.',
          formula: 'What + be + S + like? → TÍNH CÁCH · What + do/does + S + look like? → NGOẠI HÌNH',
          examples: [
            { en: 'What is she like? — She’s kind and funny.', vi: 'Cô ấy tính thế nào? — Tốt bụng và hài hước.' },
            { en: 'What does she look like? — She’s tall with long hair.', vi: 'Cô ấy trông thế nào? — Cao, tóc dài.' },
          ],
        },
        {
          title: '"used to" — thói quen trong quá khứ',
          explain: 'Diễn tả việc từng làm thường xuyên trong quá khứ nhưng nay không còn.',
          formula: 'used to + V(nguyên thể)',
          examples: [
            { en: 'I used to play football every weekend.', vi: 'Tôi từng chơi bóng mỗi cuối tuần.' },
            { en: 'We used to work at the same company.', vi: 'Chúng tôi từng làm cùng công ty.' },
          ],
          mistake: '❌ "I used to playing" → ✅ "I used to play". Sau "used to" là động từ NGUYÊN THỂ.',
        },
        {
          title: 'Sở hữu cách với \'s',
          explain: 'Thêm \'s vào sau người sở hữu. Với danh từ số nhiều đã có "s" thì chỉ thêm dấu phẩy trên.',
          formula: "người + 's + vật · người số nhiều (s) + ' + vật",
          examples: [
            { en: "My brother's job is interesting.", vi: 'Công việc của anh trai tôi thú vị.' },
            { en: "My parents' house is in Hue.", vi: 'Nhà bố mẹ tôi ở Huế.' },
          ],
        },
      ],
      sound: {
        sound: '/l/ cuối từ (dark L)',
        how:
          'Khi /l/ đứng CUỐI từ, gốc lưỡi phải nâng lên phía sau, đầu lưỡi chạm lợi trên. Nghe nặng hơn /l/ đầu từ.',
        words: [
          { en: 'well', ipa: '/wel/', vi: 'tốt' },
          { en: 'call', ipa: '/kɔːl/', vi: 'gọi' },
          { en: 'people', ipa: '/ˈpiːpl/', vi: 'mọi người' },
          { en: 'available', ipa: '/əˈveɪləbl/', vi: 'có sẵn' },
          { en: 'skill', ipa: '/skɪl/', vi: 'kỹ năng' },
        ],
        sentence: { en: 'Well, all the people call me a skillful developer.', vi: 'Ừ thì, mọi người đều gọi tôi là lập trình viên có kỹ năng.' },
        trap: 'Người Việt hay NUỐT /l/ cuối: "call" thành "co", "well" thành "oeo". Phải chạm lưỡi lên lợi.',
      },
      practice: [
        'Vẽ sơ đồ gia đình bạn và mô tả từng người bằng 2 câu tiếng Anh.',
        'Viết 5 câu dùng "used to" kể việc bạn từng làm hồi nhỏ.',
        'Phân biệt: viết 2 câu trả lời cho "What is your best friend like?" và "What does your best friend look like?".',
        'Luyện /l/ cuối: đọc chậm "well – call – people – skill – available", chú ý chạm lưỡi.',
      ],
    },

    /* ══════════════════ NGÀY 8 ══════════════════ */
    {
      day: 8,
      icon: '🎬',
      title: 'Sở thích & giải trí',
      goal: 'Kể về sở thích, phim ảnh, âm nhạc, thể thao — và biết hỏi lại để câu chuyện kéo dài.',
      qa: [
        {
          q: { en: 'What do you do in your free time?', vi: 'Lúc rảnh bạn làm gì?', ipa: '/friː taɪm/' },
          answers: [
            { en: 'I usually read or watch movies.', vi: 'Tôi thường đọc sách hoặc xem phim.', ipa: '/ˈjuːʒuəli/' },
            { en: 'I go to the gym a few times a week.', vi: 'Tôi tới phòng gym vài lần một tuần.', ipa: '/ə fjuː taɪmz/' },
            { en: 'Honestly, I mostly code side projects.', vi: 'Thú thật, tôi chủ yếu code dự án phụ.', ipa: '/saɪd ˈprɒdʒekts/' },
          ],
        },
        {
          q: { en: 'What kind of music do you listen to?', vi: 'Bạn nghe nhạc thể loại gì?', ipa: '/wɒt kaɪnd əv/' },
          answers: [
            { en: 'Mostly pop and a bit of rock.', vi: 'Chủ yếu nhạc pop và một chút rock.', ipa: '/ˈməʊstli/' },
            { en: 'I listen to lo-fi while I work.', vi: 'Tôi nghe lo-fi lúc làm việc.', ipa: '/waɪl aɪ wɜːk/' },
            { en: 'A bit of everything, really.', vi: 'Thật ra thể loại gì tôi cũng nghe.', ipa: '/ə bɪt əv ˈevriθɪŋ/' },
          ],
        },
        {
          q: { en: 'Have you seen any good movies lately?', vi: 'Dạo này bạn có xem phim nào hay không?', ipa: '/hæv juː siːn/' },
          answers: [
            { en: 'Yes! I watched a great documentary last week.', vi: 'Có! Tuần trước tôi xem một phim tài liệu rất hay.', ipa: '/ˌdɒkjuˈmentri/' },
            { en: 'Not really. I don’t have much time these days.', vi: 'Không hẳn. Dạo này tôi không có nhiều thời gian.', ipa: '/ðiːz deɪz/' },
            { en: 'I’m watching a series right now — it’s addictive.', vi: 'Tôi đang xem một series — gây nghiện lắm.', ipa: '/əˈdɪktɪv/' },
          ],
        },
        {
          q: { en: 'Do you play any sports?', vi: 'Bạn có chơi môn thể thao nào không?', ipa: '/pleɪ ˈeni spɔːts/' },
          answers: [
            { en: 'I play badminton on weekends.', vi: 'Tôi chơi cầu lông vào cuối tuần.', ipa: '/ˈbædmɪntən/' },
            { en: 'Not really, but I run sometimes.', vi: 'Không hẳn, nhưng thỉnh thoảng tôi chạy bộ.', ipa: '/aɪ rʌn/' },
            { en: 'I used to play football, but not anymore.', vi: 'Tôi từng chơi bóng đá, nhưng giờ thì không.', ipa: '/nɒt ˌeniˈmɔːr/' },
          ],
        },
        {
          q: { en: 'What are you into these days?', vi: 'Dạo này bạn mê cái gì?', ipa: '/ˈɪntuː/' },
          answers: [
            { en: 'I’m really into photography lately.', vi: 'Dạo này tôi mê chụp ảnh lắm.', ipa: '/fəˈtɒɡrəfi/' },
            { en: 'I’ve been learning to cook.', vi: 'Tôi đang học nấu ăn.', ipa: '/lɜːnɪŋ tuː kʊk/' },
          ],
        },
        {
          q: { en: 'How was it?', vi: 'Nó thế nào? (phim/buổi đi chơi…)', ipa: '/haʊ wɒz ɪt/' },
          answers: [
            { en: 'It was amazing! You should watch it.', vi: 'Tuyệt vời! Bạn nên xem thử.', ipa: '/əˈmeɪzɪŋ/' },
            { en: 'It was okay, nothing special.', vi: 'Cũng được, không có gì đặc biệt.', ipa: '/ˈnʌθɪŋ ˈspeʃl/' },
            { en: 'Honestly, kind of boring.', vi: 'Thú thật là hơi chán.', ipa: '/ˈbɔːrɪŋ/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Chatting about hobbies',
          titleVi: 'Trò chuyện về sở thích',
          lines: [
            { who: 'A', en: 'So what do you do in your free time?', vi: 'Vậy lúc rảnh bạn làm gì?' },
            { who: 'B', en: 'I’m really into photography lately. How about you?', vi: 'Dạo này tôi mê chụp ảnh. Còn bạn?' },
            { who: 'A', en: 'Nice! I mostly watch movies. Have you seen any good ones lately?', vi: 'Hay đấy! Tôi chủ yếu xem phim. Dạo này bạn có xem phim nào hay không?' },
            { who: 'B', en: 'Yes, I watched a documentary last week. It was amazing.', vi: 'Có, tuần trước tôi xem một phim tài liệu. Tuyệt vời lắm.' },
            { who: 'A', en: 'What was it about?', vi: 'Phim nói về gì?' },
            { who: 'B', en: 'It was about street photographers in Tokyo. You should watch it.', vi: 'Về các nhiếp ảnh gia đường phố ở Tokyo. Bạn nên xem thử.' },
          ],
        },
      ],
      vocab: [
        { en: 'documentary', ipa: '/ˌdɒkjuˈmentri/', vi: 'phim tài liệu', pos: 'n' },
        { en: 'addictive', ipa: '/əˈdɪktɪv/', vi: 'gây nghiện', pos: 'adj' },
        { en: 'boring', ipa: '/ˈbɔːrɪŋ/', vi: 'chán', pos: 'adj' },
        { en: 'amazing', ipa: '/əˈmeɪzɪŋ/', vi: 'tuyệt vời', pos: 'adj' },
        { en: 'side project', ipa: '/saɪd ˈprɒdʒekt/', vi: 'dự án phụ', pos: 'n' },
        { en: 'series', ipa: '/ˈsɪəriːz/', vi: 'phim nhiều tập', pos: 'n' },
        { en: 'badminton', ipa: '/ˈbædmɪntən/', vi: 'cầu lông', pos: 'n' },
        { en: 'work out', ipa: '/wɜːk aʊt/', vi: 'tập thể dục', pos: 'phr' },
        { en: 'hang out', ipa: '/hæŋ aʊt/', vi: 'đi chơi, tụ tập', pos: 'phr' },
        { en: 'take up', ipa: '/teɪk ʌp/', vi: 'bắt đầu một sở thích', pos: 'phr', ex: 'I took up running last year.', exVi: 'Năm ngoái tôi bắt đầu chạy bộ.' },
      ],
      grammar: [
        {
          title: 'Tính từ -ed và -ing — chỗ sai kinh điển',
          explain:
            '-ing mô tả TÍNH CHẤT của sự vật (nó gây ra cảm giác gì). -ed mô tả CẢM GIÁC của người. ' +
            'Nói sai câu này là người nghe bật cười.',
          formula: 'Vật + -ing (boring, interesting) · Người + -ed (bored, interested)',
          examples: [
            { en: 'The movie was boring.', vi: 'Bộ phim chán.' },
            { en: 'I was bored during the movie.', vi: 'Tôi thấy chán khi xem phim.' },
            { en: "I'm interested in photography.", vi: 'Tôi hứng thú với nhiếp ảnh.' },
          ],
          mistake: '❌ "I am boring" nghĩa là "Tôi là người nhàm chán"! Muốn nói "tôi thấy chán" phải là "I am bored".',
        },
        {
          title: 'Hiện tại hoàn thành tiếp diễn — việc đang kéo dài',
          explain: 'Nhấn mạnh việc bắt đầu trong quá khứ, vẫn đang tiếp tục và có thể còn tiếp.',
          formula: 'have / has been + V-ing',
          examples: [
            { en: "I've been learning to cook.", vi: 'Tôi đang học nấu ăn (một thời gian rồi).' },
            { en: "He's been working here for two years.", vi: 'Anh ấy làm ở đây được hai năm rồi.' },
          ],
        },
      ],
      sound: {
        sound: '/iː/ và /ɪ/',
        how:
          '/iː/ là âm DÀI, môi kéo ngang như đang cười. /ɪ/ NGẮN, môi thả lỏng, hàm hơi mở hơn. ' +
          'Khác biệt độ dài này đổi hẳn nghĩa của từ.',
        words: [
          { en: 'sheep', ipa: '/ʃiːp/', vi: 'con cừu' },
          { en: 'ship', ipa: '/ʃɪp/', vi: 'con tàu' },
          { en: 'seat', ipa: '/siːt/', vi: 'chỗ ngồi' },
          { en: 'sit', ipa: '/sɪt/', vi: 'ngồi' },
          { en: 'leave', ipa: '/liːv/', vi: 'rời đi' },
        ],
        sentence: { en: 'Please sit in this seat and leave the ship.', vi: 'Hãy ngồi vào ghế này và rời con tàu.' },
        trap: 'Người Việt hay đọc mọi "i" thành /i/ ngắn. "beach" đọc sai thành /ɪ/ ra một từ rất thô tục — phải kéo dài /iː/.',
      },
      practice: [
        'Viết 5 câu về sở thích của bạn, mỗi câu dùng một cấu trúc khác nhau (like V-ing, be into, take up…).',
        'Tự sửa: viết 3 câu dùng đúng cặp -ed/-ing (interested/interesting, bored/boring, tired/tiring).',
        'Kể lại bộ phim gần nhất bạn xem trong 60 giây, có dùng "It was about…".',
        'Luyện cặp /iː/ – /ɪ/: "sheep–ship", "seat–sit", "feel–fill".',
      ],
    },

    /* ══════════════════ NGÀY 9 ══════════════════ */
    {
      day: 9,
      icon: '🛒',
      title: 'Mua sắm & giá cả',
      goal: 'Hỏi giá, thử đồ, mặc cả, đổi trả — tự đi mua sắm ở nước ngoài mà không cần ai đi cùng.',
      qa: [
        {
          q: { en: 'How much is this?', vi: 'Cái này bao nhiêu tiền?', ipa: '/haʊ mʌtʃ ɪz ðɪs/' },
          answers: [
            { en: "It's 200,000 dong.", vi: '200 nghìn đồng.', ipa: '/ɪts/' },
            { en: "It's on sale — 30% off.", vi: 'Đang giảm giá — bớt 30%.', ipa: '/ɒn seɪl/' },
            { en: 'That one is 15 dollars.', vi: 'Cái đó 15 đô.', ipa: '/ˈdɒlərz/' },
          ],
        },
        {
          q: { en: 'Can I try it on?', vi: 'Tôi thử được không?', ipa: '/traɪ ɪt ɒn/', note: '"try on" chỉ dùng cho quần áo, giày dép.' },
          answers: [
            { en: 'Of course. The fitting room is over there.', vi: 'Tất nhiên. Phòng thử đồ ở đằng kia.', ipa: '/ˈfɪtɪŋ ruːm/' },
            { en: 'Sure, what size do you need?', vi: 'Được chứ, bạn cần cỡ nào?', ipa: '/wɒt saɪz/' },
          ],
        },
        {
          q: { en: 'Do you have this in a different size?', vi: 'Cái này có cỡ khác không?', ipa: '/ˈdɪfrənt saɪz/' },
          answers: [
            { en: 'Let me check. What size are you looking for?', vi: 'Để tôi kiểm tra. Bạn tìm cỡ nào?', ipa: '/ˈlʊkɪŋ fɔːr/' },
            { en: "Sorry, that's the only one left.", vi: 'Xin lỗi, chỉ còn đúng cái đó.', ipa: '/ðə ˈəʊnli wʌn left/' },
            { en: 'We have it in medium and large.', vi: 'Chúng tôi có cỡ vừa và lớn.', ipa: '/ˈmiːdiəm/' },
          ],
        },
        {
          q: { en: "That's a bit expensive. Can you give me a discount?", vi: 'Hơi đắt. Bạn giảm giá được không?', ipa: '/ˈdɪskaʊnt/' },
          answers: [
            { en: 'I can do 10% off.', vi: 'Tôi giảm được 10%.', ipa: '/ten pəˈsent ɒf/' },
            { en: "Sorry, the price is fixed.", vi: 'Xin lỗi, giá cố định.', ipa: '/fɪkst/' },
          ],
        },
        {
          q: { en: 'Do you take cards?', vi: 'Bạn có nhận thẻ không?', ipa: '/teɪk kɑːdz/' },
          answers: [
            { en: 'Yes, we accept all major cards.', vi: 'Có, chúng tôi nhận mọi loại thẻ phổ biến.', ipa: '/əkˈsept/' },
            { en: 'Sorry, cash only.', vi: 'Xin lỗi, chỉ nhận tiền mặt.', ipa: '/kæʃ ˈəʊnli/' },
          ],
        },
        {
          q: { en: "I'm just looking, thanks.", vi: 'Tôi chỉ xem thôi, cảm ơn.', ipa: '/dʒʌst ˈlʊkɪŋ/', note: 'Câu lịch sự để từ chối nhân viên bán hàng.' },
          answers: [
            { en: 'Sure, let me know if you need anything.', vi: 'Được, cần gì cứ gọi tôi.', ipa: '/let miː nəʊ/' },
          ],
        },
        {
          q: { en: 'Can I get a refund?', vi: 'Tôi hoàn tiền được không?', ipa: '/ˈriːfʌnd/' },
          answers: [
            { en: 'Do you have the receipt?', vi: 'Bạn có hoá đơn không?', ipa: '/rɪˈsiːt/', note: 'Chú ý: "receipt" KHÔNG đọc chữ "p".' },
            { en: 'We can exchange it, but no refunds.', vi: 'Chúng tôi đổi được, nhưng không hoàn tiền.', ipa: '/ɪksˈtʃeɪndʒ/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Buying a shirt',
          titleVi: 'Mua một chiếc áo',
          lines: [
            { who: 'Staff', en: 'Hi! Can I help you find anything?', vi: 'Chào bạn! Tôi giúp bạn tìm gì được không?' },
            { who: 'Cuong', en: "I'm just looking, thanks. …Actually, how much is this shirt?", vi: 'Tôi chỉ xem thôi, cảm ơn. …À, chiếc áo này bao nhiêu?' },
            { who: 'Staff', en: "It's 450,000 dong. It's on sale — 20% off.", vi: '450 nghìn đồng. Đang giảm giá — bớt 20%.' },
            { who: 'Cuong', en: 'Can I try it on?', vi: 'Tôi thử được không?' },
            { who: 'Staff', en: 'Of course. The fitting room is over there.', vi: 'Tất nhiên. Phòng thử đồ ở đằng kia.' },
            { who: 'Cuong', en: 'Do you have this in a different size? It’s a bit tight.', vi: 'Cái này có cỡ khác không? Hơi chật.' },
            { who: 'Staff', en: 'Let me check… Yes, we have a large.', vi: 'Để tôi kiểm tra… Có, chúng tôi có cỡ lớn.' },
            { who: 'Cuong', en: 'Perfect, I’ll take it. Do you take cards?', vi: 'Tuyệt, tôi lấy cái này. Bạn có nhận thẻ không?' },
          ],
        },
      ],
      vocab: [
        { en: 'on sale', ipa: '/ɒn seɪl/', vi: 'đang giảm giá', pos: 'phr' },
        { en: 'discount', ipa: '/ˈdɪskaʊnt/', vi: 'giảm giá', pos: 'n' },
        { en: 'receipt', ipa: '/rɪˈsiːt/', vi: 'hoá đơn', pos: 'n', ex: 'Do you have the receipt?', exVi: 'Bạn có hoá đơn không?' },
        { en: 'refund', ipa: '/ˈriːfʌnd/', vi: 'hoàn tiền', pos: 'n' },
        { en: 'exchange', ipa: '/ɪksˈtʃeɪndʒ/', vi: 'đổi hàng', pos: 'v' },
        { en: 'fitting room', ipa: '/ˈfɪtɪŋ ruːm/', vi: 'phòng thử đồ', pos: 'n' },
        { en: 'try on', ipa: '/traɪ ɒn/', vi: 'thử (quần áo)', pos: 'phr' },
        { en: 'expensive', ipa: '/ɪkˈspensɪv/', vi: 'đắt', pos: 'adj' },
        { en: 'cheap', ipa: '/tʃiːp/', vi: 'rẻ', pos: 'adj' },
        { en: 'afford', ipa: '/əˈfɔːd/', vi: 'đủ tiền mua', pos: 'v', ex: "I can't afford it.", exVi: 'Tôi không đủ tiền mua.' },
        { en: 'tight', ipa: '/taɪt/', vi: 'chật', pos: 'adj' },
        { en: 'loose', ipa: '/luːs/', vi: 'rộng', pos: 'adj' },
      ],
      grammar: [
        {
          title: 'How much vs. How many',
          explain: '"How much" cho danh từ KHÔNG đếm được (tiền, nước, thời gian). "How many" cho đếm được.',
          formula: 'How much + N không đếm được · How many + N số nhiều',
          examples: [
            { en: 'How much is this?', vi: 'Cái này bao nhiêu tiền?' },
            { en: 'How many shirts do you want?', vi: 'Bạn muốn mấy chiếc áo?' },
          ],
          mistake: '❌ "How many money" → ✅ "How much money".',
        },
        {
          title: 'So sánh hơn và nhất',
          explain:
            'Tính từ NGẮN (1 âm tiết): thêm -er/-est. Tính từ DÀI (2+ âm tiết): dùng more/most.',
          formula: 'ngắn + er/est · more/most + dài · than (hơn cái gì)',
          examples: [
            { en: 'This one is cheaper than that one.', vi: 'Cái này rẻ hơn cái kia.' },
            { en: 'This is the most expensive shirt here.', vi: 'Đây là chiếc áo đắt nhất ở đây.' },
          ],
          mistake: '❌ "more cheaper" → ✅ "cheaper". Không dùng "more" cùng với "-er".',
        },
      ],
      sound: {
        sound: '/æ/',
        how: 'Mở miệng rộng theo chiều NGANG, hạ hàm xuống. Nằm giữa "a" và "e" của tiếng Việt.',
        words: [
          { en: 'cash', ipa: '/kæʃ/', vi: 'tiền mặt' },
          { en: 'bag', ipa: '/bæɡ/', vi: 'túi' },
          { en: 'have', ipa: '/hæv/', vi: 'có' },
          { en: 'class', ipa: '/klæs/', vi: 'lớp học' },
          { en: 'app', ipa: '/æp/', vi: 'ứng dụng' },
        ],
        sentence: { en: 'I have cash in that black bag.', vi: 'Tôi có tiền mặt trong cái túi đen đó.' },
        trap: 'Đừng đọc /æ/ thành "e": "bad" không phải "bed", "man" không phải "men".',
      },
      practice: [
        'Đóng vai người mua: viết hội thoại mua một món đồ từ đầu đến lúc trả tiền.',
        'Học thuộc 3 câu sống còn: "How much is this?", "Can I try it on?", "Do you take cards?".',
        'Viết 5 câu so sánh giá hai món đồ.',
        'Luyện /æ/: đọc 10 lần "I have cash in that black bag".',
      ],
    },

    /* ══════════════════ NGÀY 10 ══════════════════ */
    {
      day: 10,
      icon: '🗺️',
      title: 'Hỏi đường & di chuyển',
      goal: 'Hỏi đường, hiểu chỉ dẫn, đi taxi/xe buýt, làm thủ tục sân bay — tự đi lại ở nơi xa lạ.',
      qa: [
        {
          q: { en: 'Excuse me, how do I get to the train station?', vi: 'Xin lỗi, tôi tới ga tàu bằng cách nào?', ipa: '/haʊ duː aɪ ɡet tuː/', note: 'Luôn mở đầu bằng "Excuse me" khi hỏi người lạ.' },
          answers: [
            { en: 'Go straight and turn left at the corner.', vi: 'Đi thẳng rồi rẽ trái ở góc đường.', ipa: '/ɡəʊ streɪt/' },
            { en: "It's about a 10-minute walk from here.", vi: 'Đi bộ khoảng 10 phút từ đây.', ipa: '/ə ten ˈmɪnɪt wɔːk/' },
            { en: 'Sorry, I’m not from around here.', vi: 'Xin lỗi, tôi không phải người ở đây.', ipa: '/nɒt frɒm əˈraʊnd hɪər/' },
          ],
        },
        {
          q: { en: 'Is it far from here?', vi: 'Có xa đây không?', ipa: '/ɪz ɪt fɑːr/' },
          answers: [
            { en: 'No, it’s just around the corner.', vi: 'Không, ngay góc đường thôi.', ipa: '/əˈraʊnd ðə ˈkɔːnər/' },
            { en: 'Yes, you should take a taxi.', vi: 'Có, bạn nên đi taxi.', ipa: '/teɪk ə ˈtæksi/' },
            { en: "It's about 2 kilometers away.", vi: 'Cách khoảng 2 km.', ipa: '/kɪˈlɒmɪtəz/' },
          ],
        },
        {
          q: { en: 'Which bus goes to the airport?', vi: 'Xe buýt nào đi sân bay?', ipa: '/wɪtʃ bʌs/' },
          answers: [
            { en: 'Take bus number 12.', vi: 'Đi xe buýt số 12.', ipa: '/teɪk bʌs ˈnʌmbər/' },
            { en: 'You need to transfer at the next stop.', vi: 'Bạn phải đổi xe ở trạm kế tiếp.', ipa: '/trænsˈfɜːr/' },
          ],
        },
        {
          q: { en: 'Could you take me to this address, please?', vi: 'Bạn chở tôi tới địa chỉ này được không?', ipa: '/əˈdres/', note: 'Câu dùng với tài xế taxi.' },
          answers: [
            { en: 'Sure, hop in.', vi: 'Được, lên xe đi.', ipa: '/hɒp ɪn/' },
            { en: 'That’ll be about 30 minutes in traffic.', vi: 'Kẹt xe thì khoảng 30 phút.', ipa: '/ˈtræfɪk/' },
          ],
        },
        {
          q: { en: 'Am I on the right track?', vi: 'Tôi đi đúng đường chứ?', ipa: '/ðə raɪt træk/' },
          answers: [
            { en: 'Yes, keep going straight.', vi: 'Đúng rồi, cứ đi thẳng.', ipa: '/kiːp ˈɡəʊɪŋ/' },
            { en: 'No, you went too far. Turn back.', vi: 'Không, bạn đi quá rồi. Quay lại đi.', ipa: '/tɜːn bæk/' },
          ],
        },
        {
          q: { en: "I'm lost. Can you help me?", vi: 'Tôi bị lạc. Bạn giúp tôi được không?', ipa: '/aɪm lɒst/' },
          answers: [
            { en: 'Of course. Where are you trying to go?', vi: 'Tất nhiên. Bạn muốn đi đâu?', ipa: '/ˈtraɪɪŋ tuː ɡəʊ/' },
            { en: 'Let me show you on the map.', vi: 'Để tôi chỉ bạn trên bản đồ.', ipa: '/ɒn ðə mæp/' },
          ],
        },
      ],
      dialogues: [
        {
          title: 'Asking for directions',
          titleVi: 'Hỏi đường',
          lines: [
            { who: 'Cuong', en: 'Excuse me, how do I get to the train station?', vi: 'Xin lỗi, tôi tới ga tàu bằng cách nào?' },
            { who: 'Local', en: 'Go straight for two blocks, then turn left.', vi: 'Đi thẳng hai dãy nhà rồi rẽ trái.' },
            { who: 'Cuong', en: 'Is it far from here?', vi: 'Có xa đây không?' },
            { who: 'Local', en: 'No, it’s about a 10-minute walk.', vi: 'Không, đi bộ khoảng 10 phút.' },
            { who: 'Cuong', en: 'Great. And is there a bus I could take?', vi: 'Tuyệt. Có xe buýt nào tôi đi được không?' },
            { who: 'Local', en: 'Yes, bus number 12 stops right there.', vi: 'Có, xe buýt số 12 dừng ngay chỗ kia.' },
            { who: 'Cuong', en: 'Thank you so much for your help!', vi: 'Cảm ơn bạn rất nhiều!' },
          ],
        },
      ],
      vocab: [
        { en: 'go straight', ipa: '/ɡəʊ streɪt/', vi: 'đi thẳng', pos: 'phr' },
        { en: 'turn left / right', ipa: '/tɜːn left/', vi: 'rẽ trái / phải', pos: 'phr' },
        { en: 'corner', ipa: '/ˈkɔːnər/', vi: 'góc đường', pos: 'n' },
        { en: 'block', ipa: '/blɒk/', vi: 'dãy nhà (đơn vị đo đường)', pos: 'n' },
        { en: 'traffic', ipa: '/ˈtræfɪk/', vi: 'giao thông, kẹt xe', pos: 'n' },
        { en: 'transfer', ipa: '/trænsˈfɜːr/', vi: 'đổi xe/chuyến', pos: 'v' },
        { en: 'get lost', ipa: '/ɡet lɒst/', vi: 'bị lạc', pos: 'phr' },
        { en: 'nearby', ipa: '/ˈnɪəbaɪ/', vi: 'gần đây', pos: 'adj' },
        { en: 'across from', ipa: '/əˈkrɒs frɒm/', vi: 'đối diện', pos: 'prep' },
        { en: 'next to', ipa: '/nekst tuː/', vi: 'bên cạnh', pos: 'prep' },
        { en: 'between', ipa: '/bɪˈtwiːn/', vi: 'ở giữa', pos: 'prep' },
        { en: 'boarding pass', ipa: '/ˈbɔːdɪŋ pɑːs/', vi: 'thẻ lên máy bay', pos: 'n' },
      ],
      grammar: [
        {
          title: 'Câu mệnh lệnh — dùng để chỉ đường',
          explain: 'Bỏ chủ ngữ, bắt đầu ngay bằng động từ nguyên thể. Thêm "please" cho lịch sự.',
          formula: 'V(nguyên thể) + … · Don\'t + V + …',
          examples: [
            { en: 'Go straight and turn left.', vi: 'Đi thẳng rồi rẽ trái.' },
            { en: "Don't turn right at the corner.", vi: 'Đừng rẽ phải ở góc đường.' },
          ],
        },
        {
          title: 'Giới từ chỉ vị trí',
          explain: 'Nhóm giới từ này xuất hiện trong mọi lời chỉ đường. Học một lần dùng mãi.',
          formula: 'in front of · behind · next to · across from · between A and B · on the corner of',
          examples: [
            { en: "The bank is across from the hotel.", vi: 'Ngân hàng đối diện khách sạn.' },
            { en: "It's between the café and the bookstore.", vi: 'Nó nằm giữa quán cà phê và hiệu sách.' },
          ],
        },
        {
          title: 'Câu hỏi lịch sự với "Could you…?"',
          explain:
            'Khi nhờ người lạ, dùng "Could you…?" thay vì "Can you…?" — lịch sự hơn hẳn và nghe rất chuyên nghiệp.',
          formula: 'Could you + V(nguyên thể) + …, please?',
          examples: [
            { en: 'Could you take me to this address, please?', vi: 'Bạn chở tôi tới địa chỉ này được không?' },
            { en: 'Could you say that again, please?', vi: 'Bạn nói lại được không?' },
          ],
        },
      ],
      sound: {
        sound: '/əʊ/',
        how: 'Nguyên âm đôi: bắt đầu ở /ə/ rồi TRƯỢT sang /ʊ/, môi tròn dần lại. Đây là hai âm nối liền, không phải một âm "ô".',
        words: [
          { en: 'go', ipa: '/ɡəʊ/', vi: 'đi' },
          { en: 'code', ipa: '/kəʊd/', vi: 'mã' },
          { en: 'know', ipa: '/nəʊ/', vi: 'biết' },
          { en: 'road', ipa: '/rəʊd/', vi: 'con đường' },
          { en: 'close', ipa: '/kləʊz/', vi: 'đóng' },
        ],
        sentence: { en: 'I know I should go down this road.', vi: 'Tôi biết tôi nên đi xuống con đường này.' },
        trap: 'Người Việt hay đọc thành "ô" cụt: "go" thành "gô". Phải có sự trượt từ /ə/ sang /ʊ/.',
      },
      practice: [
        'Mở bản đồ, tự chỉ đường từ nhà bạn tới nơi làm việc bằng tiếng Anh.',
        'Học thuộc 4 câu: "Excuse me, how do I get to…?", "Is it far from here?", "I\'m lost", "Could you help me?".',
        'Viết 5 câu dùng giới từ vị trí mô tả các địa điểm quanh nhà bạn.',
        'Luyện /əʊ/: đọc 10 lần "I know the code on that road".',
        'ÔN TUẦN 2: nói liên tục 2 phút — thời tiết hôm nay, gia đình bạn, sở thích, món vừa mua và đường tới chỗ làm.',
      ],
    },
  ],
};
