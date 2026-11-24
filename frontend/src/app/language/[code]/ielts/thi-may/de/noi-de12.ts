/**
 * Đề 12 "Final" — Speaking, THI CUỐI TẬP 5 · NGÀY 30 (docs/ielts-lo-trinh-0-8.md mục 4.2: "random từ ngân hàng S07/S08").
 * TỰ SOẠN 24/11/2026.
 * Part 1: Mirrors + Patience — hai chủ đề "lạ" của ngân hàng S07 (nhóm 20 chủ đề hay ra), CHƯA đề thi nào trong Đề 0–11 dùng làm
 * Part 1 (Tập 4 Ngày 30 chỉ ôn mỗi chủ đề một dòng gợi ý; sáu câu hỏi ở đây soạn MỚI, không lặp câu "Do you often look in the
 * mirror?" / "Are you a patient person?") — 6 câu, câu thứ ba của mỗi chủ đề đòi suy luận hoặc so sánh.
 * Part 2: thẻ loại "tình huống / a time when…" của S08 — "a conversation you had with a stranger that you still remember". KHÔNG
 * trùng thẻ nào đã có (đã grep 24/11 mọi "Describe…" trong tap-2…tap-5/ngay + thi-may/de + docs/ielts-tap5-phu: không có thẻ nào về
 * "conversation" hay "stranger"; các thẻ gần nhất — "a person who helped you", "a time you helped someone", "a piece of advice",
 * "a time when you persuaded someone to look at a decision differently" (Đề 9) — khác trọng tâm: thẻ này đòi kể LỜI NÓI và vì sao nó đọng lại).
 * Part 3: 5 câu khó dần fact → nguyên nhân "Why do some…?" → đánh giá mức độ "To what extent…?" → giả định "What would happen
 * if…?" → dự đoán "Do you think… in the future?" — chủ đề "Talking to strangers" → "Trust in society".
 * Nối Tập 5: Part 1 band 8 tự nhiên, có giọng riêng (N3) · ngắt vì nội dung, không vì tìm từ (N2) · Part 2 chi tiết giác quan (N7),
 * đề hiếm (N14), ngữ điệu kể chuyện (N17), sprint Part 2 (N26) · Part 3 phản biện – nhượng bộ – hedging (N6), trừu tượng cấp cao
 * (N13), phản biện giám khảo khéo (N23), sprint Part 3 (N27) · cấu trúc hiếm dùng đúng chỗ (N21) · idiom thưa (N11, N18).
 * `mau`: câu trả lời mẫu band 8.0–8.5; phân tích FC · LR · GRA · P bằng tiếng Việt. Phiên âm theo Anh–Anh; chỉ nêu trọng âm của từ
 * thông dụng. Câu chuyện Part 2 (ông cụ từng làm điện báo viên tàu biển trên chuyến tàu đêm Hà Nội – Vinh) là HƯ CẤU, dựng cho
 * người học là sinh viên IT.
 */
import type { DeNoi } from './types';

export const NOI_DE12: DeNoi = {
  id: 'noi-de12',
  kyNang: 'noi',
  ten: 'Speaking — Đề 12 (Tập 5 · Ngày 30)',
  boDe: 'Đề 12',
  capDo: 'Band 8.0',
  moTa: 'Part 1: mirrors · patience · Part 2: a conversation with a stranger that you still remember · Part 3: talking to strangers, trust in society',
  phut: 14,
  part1: [
    {
      chuDe: 'Mirrors',
      cau: [
        'How much time do you spend in front of a mirror on a typical day?',
        'Have you ever chosen a mirror for your home, or would you know how to choose one?',
        'Why do you think some people dislike seeing themselves in mirrors or in photos?',
      ],
    },
    {
      chuDe: 'Patience',
      cau: [
        'In what situations do you find it hardest to stay patient?',
        'Were you more patient or less patient when you were a child?',
        'Do you think technology has made people less patient than they used to be?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a conversation you had with a stranger that you still remember.\n\nYou should say:\n• where and when the conversation took place\n• who the person was\n• what the two of you talked about\n\nand explain why this conversation has stayed in your memory.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — chọn MỘT cuộc trò chuyện có bối cảnh rõ (trên tàu, ở quán sửa xe, trong phòng chờ) với một người bạn thật sự KHÔNG quen. Ghi 4 từ khoá cho 4 ý + MỘT câu người đó đã nói (thứ khiến bạn nhớ). Đừng chọn "một người lạ tốt bụng giúp tôi" — đó là thẻ khác (a person who helped you); thẻ này hỏi về LỜI NÓI.',
      'Ý "where and when" = dựng cảnh bằng 2–3 chi tiết giác quan (Tập 5 Ngày 7): toa tàu chật, cửa kính mờ hơi nước, ai đó ngủ gật. Thì: quá khứ tiếp diễn + quá khứ hoàn thành cho nền ("I\'d ended up in a hard seat because the sleepers had sold out").',
      'Ý "who the person was": bạn KHÔNG biết tên — cứ nói thẳng ("a man whose name I never found out"), rồi tả bằng tuổi, một vật họ mang, nghề cũ. Suy đoán bằng "must have been in his seventies", "it turned out…".',
      'Ý "what you talked about": thuật lại bằng lời gián tiếp, đổi động từ tường thuật (asked whether…, it turned out…, he started asking me…, something he said… which was that…). Một câu hành động chen giữa ("he tapped out my name on the armrest") làm câu chuyện sống hơn mười câu "he said".',
      'Ý "why it has stayed in your memory" nói DÀI NHẤT — chỗ lấy band 8: câu chẻ ("What\'s stayed with me isn\'t really… It\'s…"), một thay đổi nó gây ra ở bạn, và một câu điều kiện đảo ngữ để khép ("Had I got the sleeper I wanted, I\'d never have met him").',
    ],
    cauChot: [
      'Did you ever see that person again?',
      'Do you often start conversations with people you don\'t know?',
    ],
  },
  part3: [
    {
      chuDe: 'Talking to strangers',
      cau: [
        'In your country, in what situations do people usually talk to strangers?',
        'Why do some people find it much easier than others to start a conversation with someone they don\'t know?',
        'To what extent has technology changed the way strangers interact in public places?',
      ],
    },
    {
      chuDe: 'Trust in society',
      cau: [
        'What would happen if people stopped trusting strangers altogether?',
        'Do you think people will become more willing or less willing to trust strangers in the future?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Why do you think some people dislike seeing themselves in mirrors or in photos?',
      band: 'Band 8.0–8.5',
      s: 'I think it\'s mostly a question of what you\'re used to. The face you see in the mirror every morning is reversed, so when a photo shows you the right way round, something looks slightly off, and you assume the problem is you rather than the angle. I\'m a bit like that myself — I\'ll happily glance in a mirror on my way out, but put me in front of a full-length one in a clothes shop, under those lights, and I can\'t get out fast enough. So I wouldn\'t call it vanity, or the lack of it. It\'s more that most of us carry around a rather flattering picture of ourselves, and mirrors have a habit of correcting it.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: câu hỏi suy luận ("Why do you think…?") ⇒ mở bằng một luận điểm gọn ("a question of what you\'re used to"), giải thích cơ chế (ảnh gương bị đảo), tự lấy mình làm ví dụ, rồi khép bằng một nhận xét khái quát. Khoảng 35 giây; chỗ ngắt duy nhất nằm ở dấu gạch — ngắt để chèn Ý, không để tìm từ (Tập 5 Ngày 2).',
        '**LR (từ vựng)**: "something looks slightly off" (hơi sai sai), "the right way round", "glance in a mirror", "a full-length one", "I can\'t get out fast enough", "vanity, or the lack of it", "a rather flattering picture", "have a habit of correcting it" (nhân hoá nhẹ). Toàn từ thường dùng nhưng chính xác và có màu — band 8 ở Part 1 không cần từ học thuật (Ngày 3).',
        '**GRA (ngữ pháp)**: mệnh đề danh ngữ "what you\'re used to"; mệnh đề quan hệ rút gọn "The face you see… every morning"; "so when…, something looks…, and you assume…" (chuỗi nhân quả ba vế); "will" chỉ thói quen ("I\'ll happily glance"); mệnh lệnh mang nghĩa điều kiện "put me in front of… and I can\'t…" (= if you put me… — rất tự nhiên trong văn nói, Ngày 11); "It\'s more that…" để chỉnh ý.',
        '**P (phát âm)**: nhấn tương phản "you assume the problem is YOU rather than the ANGle"; trọng âm "reversed" /rɪˈvɜːst/ âm hai, "vanity" /ˈvænəti/ âm đầu, "flattering" /ˈflætərɪŋ/ âm đầu, "correcting" /kəˈrektɪŋ/ âm hai; -ed: "reversed" /t/, "used to" /ˈjuːst tə/ (không phải /juːzd/); nối âm "glance‿in‿a", "get‿out"; hạ giọng và nói nhanh hơn ở phần chèn "under those lights".',
        '**Vì sao là band 8 chứ không phải 7**: band 7 thường trả lời "because they are not confident about their appearance" rồi lặp lại bằng từ khác. Ở đây có một CƠ CHẾ (ảnh đảo chiều), một ví dụ tự giễu và một câu khái quát — ba tầng trong 35 giây. Muốn lên 9: thêm một nhịp phản xạ với câu hỏi ("It\'s a good question, actually — I\'d never asked myself why").',
      ],
    },
    {
      part: 2,
      cau: 'Describe a conversation you had with a stranger that you still remember.',
      band: 'Band 8.0–8.5',
      s: 'I\'d like to tell you about a conversation I had on a night train about two years ago, with a man whose name I never found out.\n\nI was travelling from Hanoi down to Vinh for the Lunar New Year, and I\'d ended up in a hard seat because the sleepers had sold out weeks before. The carriage was packed, the windows were fogged up, and somebody further down was already asleep with a sack of oranges on his lap. The man next to me must have been in his seventies. He had a canvas bag on his knees and, what caught my attention, a very old radio, which he was fiddling with.\n\nI only meant to be polite, so I asked whether he could get a signal. That was all it took. It turned out he\'d spent thirty years as a radio operator on cargo ships, sending messages in Morse code, and when he learned I was studying software engineering, he started asking me questions I couldn\'t answer — how my phone knew where it was, whether anyone still understood how the whole thing worked. At one point he tapped out my name on the armrest and made me tap it back until I got it right. We must have talked for three hours; I\'d planned to sleep.\n\nWhat\'s stayed with me isn\'t really the Morse code, though I can still do my name. It\'s something he said just before he got off, which was that in his day one person could understand the entire machine, and that he felt rather sorry for my generation because we never would. I remember being faintly annoyed at the time. But I\'ve thought about it more often than about most lectures I\'ve sat through, and it\'s part of the reason I started reading about how networks actually work underneath, rather than just using them. Had I got the sleeper I wanted, I\'d never have met him — which is a slightly uncomfortable thought, given how carefully I usually avoid talking to anyone on trains.',
      phanTich: [
        '**FC**: đủ 4 ý theo thứ tự thẻ, mỗi ý một đoạn có câu mở rõ ("I was travelling…", "I only meant to be polite…", "What\'s stayed with me isn\'t really…"). Câu chuyện có điểm xoay ("That was all it took.") và có LỜI NÓI được thuật lại — đúng trọng tâm của thẻ. Chi tiết giác quan (Tập 5 Ngày 7): cửa kính mờ, bao cam trên đùi người ngủ gật, tiếng gõ trên tay ghế. Khoảng 2 phút; kết bằng một nhận xét tự giễu thay cho "That\'s all".',
        '**LR**: "a man whose name I never found out", "ended up in a hard seat", "fogged up", "fiddling with", "That was all it took", "tapped out my name", "the entire machine", "faintly annoyed", "lectures I\'ve sat through", "how networks actually work underneath". Từ chuyên ngành dùng tự nhiên, không giải thích dài: "radio operator", "Morse code", "software engineering". Không có idiom gượng — sự tự nhiên đến từ cụm động từ.',
        '**GRA**: quá khứ hoàn thành cho nền ("I\'d ended up", "had sold out", "he\'d spent thirty years", "I\'d planned to sleep"); suy đoán quá khứ "must have been in his seventies", "We must have talked for three hours"; lời gián tiếp nhiều kiểu ("asked whether he could…", "how my phone knew where it was", "whether anyone still understood…", "which was that… and that…"); câu chẻ đối lập "What\'s stayed with me isn\'t really… It\'s something he said…"; ĐẢO NGỮ điều kiện loại 3 dùng đúng một lần ở chỗ khép: "Had I got the sleeper I wanted, I\'d never have met him" (Ngày 21); mệnh đề bình luận ", which is a slightly uncomfortable thought, given how…".',
        '**P**: ngắt nhóm ý theo nội dung ("The carriage was packed, / the windows were fogged up, / and somebody further down…"); nhấn tương phản "ONE person could understand the enTIRE machine… we NEVer would", "reading about how networks WORK… rather than just USing them"; trọng âm "conversation" /ˌkɒnvəˈseɪʃn/ âm ba, "operator" /ˈɒpəreɪtə/ âm đầu, "engineering" /ˌendʒɪˈnɪərɪŋ/ âm ba, "generation" /ˌdʒenəˈreɪʃn/ âm ba, "uncomfortable" /ʌnˈkʌmftəbl/ (bốn âm tiết, nuốt "or"); -ed: "packed" /t/, "fogged" /d/, "tapped" /t/, "annoyed" /d/; chậm lại ở câu "That was all it took."',
        '**Vì sao là band 8 chứ không phải 7**: phần "why it has stayed in your memory" không dừng ở "because it was interesting" mà nêu một câu nói cụ thể, phản ứng lúc đó (hơi khó chịu) và một thay đổi về sau (đi đọc cách mạng máy tính vận hành). Muốn lên 9: thêm một câu khái quát có hedging nối sang Part 3 ("I suspect we learn more from strangers than we admit, precisely because they have no reason to be tactful").',
      ],
    },
    {
      part: 3,
      cau: 'Why do some people find it much easier than others to start a conversation with someone they don\'t know?',
      band: 'Band 8.0–8.5',
      s: 'I\'d say personality is only part of it, and probably the smaller part. Obviously some people are naturally outgoing, but I think a great deal comes down to practice, and practice depends on where you grew up. Someone raised in a village, or in a family that ran a shop, has spent their whole childhood making small talk with people they half know, so by the age of twenty it costs them nothing. Whereas if you grew up in a flat in a big city, as I did, you were actually taught the opposite — don\'t talk to strangers — and nobody ever formally cancels that instruction. There\'s also the question of what you think is at risk. People who find it hard tend to imagine that the other person will judge them, when in reality that person is usually just relieved that somebody else spoke first. So it looks like confidence, but I suspect it\'s largely habit, plus a more accurate idea of how little can go wrong.',
      phanTich: [
        '**FC**: mở bằng cách HẠ một lời giải thích hiển nhiên ("personality is only part of it, and probably the smaller part") rồi đưa hai nguyên nhân khác loại — thói quen do hoàn cảnh lớn lên, và cách ước lượng rủi ro — mỗi cái có cơ chế, cái đầu có hai ví dụ đối xứng (làng / nhà có cửa hàng ↔ căn hộ thành phố). Câu cuối tổng hợp bằng một đối lập ("looks like confidence… largely habit"). Lập luận có phân loại — đúng yêu cầu Part 3 band 8 (Tập 5 Ngày 6, Ngày 13).',
        '**LR**: "naturally outgoing", "comes down to practice", "making small talk", "people they half know" (quen sơ sơ), "it costs them nothing", "nobody ever formally cancels that instruction" (hài nhẹ, chính xác), "what you think is at risk", "just relieved that somebody else spoke first", "how little can go wrong". Hedging đa dạng: "I\'d say", "probably", "a great deal", "tend to", "I suspect", "largely".',
        '**GRA**: phân từ quá khứ rút gọn "Someone raised in a village"; hiện tại hoàn thành với "their whole childhood"; "Whereas if you grew up…, as I did, you were actually taught…" (đối lập + chèn + bị động); mệnh đề danh ngữ "what you think is at risk"; "when in reality…" (when = trong khi thực tế); "relieved that…"; mệnh đề danh ngữ sau giới từ "idea of how little can go wrong". Không có cấu trúc nào khoe — tất cả đều gánh ý.',
        '**P**: nhấn từ mang lập luận: "only PART of it… the SMALLer part", "it LOOKS like confidence, / but I suspect it\'s largely HABit"; đổi giọng khi trích lời dạy trẻ con ("don\'t talk to strangers") — đều và nhanh hơn; trọng âm "personality" /ˌpɜːsəˈnæləti/ âm ba, "outgoing" /ˈaʊtɡəʊɪŋ/ âm đầu, "instruction" /ɪnˈstrʌkʃn/ âm hai, "relieved" /rɪˈliːvd/ âm hai, "accurate" /ˈækjərət/ âm đầu; âm yếu "than", "that", "to".',
        '**Vì sao là band 8 chứ không phải 7**: band 7 dừng ở "because they are extroverts / introverts". Ở đây người nói bác một phần cách giải thích đó, đưa hai nguyên nhân mới và tự đánh giá cái nào nặng hơn. Muốn lên 9: phản biện nhẹ chính tiền đề ("though I\'m not sure \'easier\' is the right word — some very chatty people are simply better at hiding the effort").',
      ],
    },
    {
      part: 3,
      cau: 'What would happen if people stopped trusting strangers altogether?',
      band: 'Band 8.0–8.5',
      s: 'Well, in the short run I imagine very little would look different, because so much of our trust is now handled by systems rather than by instinct. I get into a car with a driver I\'ve never met because an app shows me his rating, not because I\'ve judged his character. But I think that only hides how much still rests on ordinary trust. Every time you ask someone to watch your bag, or eat food a stranger has cooked, or simply walk down a street without checking who\'s behind you, you\'re relying on it. If that disappeared, everything would have to be verified, and verification is expensive — you\'d need a contract, a camera or a guard for things we currently do for free. Not only would daily life become slower, it would become smaller, because people would retreat into circles of family and old friends, and that\'s precisely the kind of society where it\'s hard for an outsider to get a job or a newcomer to settle. So I don\'t think the result would be chaos so much as a quieter, narrower, more suspicious world — and, I\'d guess, a poorer one.',
      phanTich: [
        '**FC**: câu giả định ⇒ trả lời theo HAI PHA thời gian: ngắn hạn (gần như không đổi — và vì sao) → "But I think that only hides…" (thứ vẫn dựa vào lòng tin) → hệ quả bước một (mọi thứ phải kiểm chứng, tốn kém) → hệ quả bước hai (xã hội co lại, người ngoài khó vào) → kết luận chỉnh lại kỳ vọng ("not chaos so much as…"). Đi tới hệ quả THỨ HAI là dấu hiệu Part 3 band 8 (Tập 5 Ngày 13, Ngày 27).',
        '**LR**: "handled by systems rather than by instinct", "judged his character", "rests on ordinary trust", "verification is expensive", "things we currently do for free", "retreat into circles of family and old friends", "a newcomer to settle", "a quieter, narrower, more suspicious world". Cặp từ đối lập có chủ ý: "slower… smaller", "chaos… quieter". Hedging: "I imagine", "I think", "I\'d guess".',
        '**GRA**: điều kiện loại 2 xuyên suốt ("would look", "would have to be verified", "you\'d need", "would retreat"); ĐẢO NGỮ dùng đúng một lần, đúng chỗ nhấn: "Not only would daily life become slower, it would become smaller" (Ngày 21); "Every time you…, or…, or simply…, you\'re relying on it" (ba vế song song — Ngày 9); mệnh đề danh ngữ "how much still rests on…"; "the kind of society where it\'s hard for an outsider to…"; "not… so much as…" để chỉnh mức độ.',
        '**P**: nhấn tương phản "by SYStems rather than by INstinct", "not only SLOWer… SMALLer"; ngữ điệu liệt kê lên – lên – xuống ở "a contract, / a camera / or a guard" và "quieter, / narrower, / more suspicious"; trọng âm "verification" /ˌverɪfɪˈkeɪʃn/ âm bốn, "verified" /ˈverɪfaɪd/ âm đầu, "instinct" /ˈɪnstɪŋkt/ âm đầu, "suspicious" /səˈspɪʃəs/ âm hai, "precisely" /prɪˈsaɪsli/ âm hai; ngắt trước phần chốt "— and, / I\'d guess, / a poorer one".',
        '**Vì sao là band 8 chứ không phải 7**: người nói không vẽ cảnh hỗn loạn hiển nhiên mà chỉ ra cái giá KINH TẾ và XÃ HỘI của việc thiếu lòng tin, rồi tự điều chỉnh kết luận. Muốn lên 9: tự giới hạn phạm vi ("I\'m talking about everyday trust here; trusting strangers online is a different matter, and there a little more suspicion would probably do us good").',
      ],
    },
  ],
};
