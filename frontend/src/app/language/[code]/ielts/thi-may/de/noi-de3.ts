/**
 * Đề 3 — Speaking, THI CUỐI TẬP 2 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Ngày 24). TỰ SOẠN 12/11/2026.
 * Part 1: Food + Travel (T2 N9 — 12 chủ đề Part 1) — 6 câu · Part 2: Describe an event (T2 N15; cue card 4 ý) ·
 * Part 3: 5 câu khó dần fact → opinion → compare → compare (xưa/nay, T2 N21) → hypothesise, nối chủ đề "sự kiện – lễ hội".
 * Câu hỏi dùng từ B1 để người học band 5.0 hiểu ngay; độ khó nằm ở Part 2 đủ 2 phút và Part 3 trả lời có lý do + ví dụ + so sánh.
 * `mau`: câu trả lời mẫu band 5.5–6.0 (đích kế tiếp) — dùng cấu trúc Tập 2 đã dạy (used to / would, quá khứ tiếp diễn + while,
 * mệnh đề quan hệ xác định, so sánh, bị động quá khứ, điều kiện loại 1); phân tích FC · LR · GRA · P bằng tiếng Việt.
 * Phiên âm theo Anh–Anh (Oxford Learner's); chỉ nêu trọng âm của những từ đã tra.
 */
import type { DeNoi } from './types';

export const NOI_DE3: DeNoi = {
  id: 'noi-de3',
  kyNang: 'noi',
  ten: 'Speaking — Đề 3 (thi cuối Tập 2)',
  boDe: 'Đề 3',
  capDo: 'Band 5.0',
  moTa: 'Part 1: food · travel · Part 2: an event you attended and enjoyed · Part 3: public events, celebrations past and present',
  phut: 13,
  part1: [
    {
      chuDe: 'Food',
      cau: [
        'What kind of food do you like most?',
        'Do you prefer eating at home or eating out?',
        'Is there any food you didn\'t like as a child but like now?',
      ],
    },
    {
      chuDe: 'Travel',
      cau: [
        'Do you like travelling?',
        'How do you usually travel when you go on holiday?',
        'Which place would you like to visit in the future? Why?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe an event you attended that you enjoyed.\n\nYou should say:\n• what the event was\n• when and where it took place\n• who you went with\n\nand explain why you enjoyed it.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — ghi 4 từ khoá cho 4 ý trên thẻ (what · when/where · who · why), thêm 2–3 chi tiết cảm giác (nhìn thấy gì, nghe gì, ăn gì).',
      'Chọn MỘT sự kiện thật, đã qua (đám cưới, lễ hội, buổi hoà nhạc, trận bóng, lễ tốt nghiệp) — sự kiện có nhiều việc diễn ra thì dễ kể theo trình tự: First… Then… After that… In the end….',
      'Thì: QUÁ KHỨ ĐƠN là chính ("It took place…", "we arrived…"); thêm bị động quá khứ ("The party was held in…") và một câu quá khứ tiếp diễn ("While we were driving home, …") — Tập 2 Ngày 21.',
      'Ý "why you enjoyed it" nói DÀI NHẤT: 2 lý do, mỗi lý do có giải thích; so sánh với một lần khác ("In the city, weddings usually…, but…") để có câu phức.',
      'Câu kết báo hiệu đã xong: "So it\'s a day that I\'ll remember for a long time." Nếu còn giờ: thêm chuyện vui / sự cố nhỏ hôm đó.',
    ],
    cauChot: [
      'Would you like to go to an event like this again?',
      'Did the people you went with enjoy it too?',
    ],
  },
  part3: [
    {
      chuDe: 'Public events',
      cau: [
        'What kinds of public events are popular in your country?',
        'Why do you think people enjoy going to big events such as festivals or concerts?',
        'Is it better to watch a big event live or on a screen at home?',
      ],
    },
    {
      chuDe: 'Celebrations, past and future',
      cau: [
        'Are celebrations in your country different now from when your grandparents were young?',
        'If your town could hold a big international event, do you think it would be good for the town?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Is there any food you didn\'t like as a child but like now?',
      band: 'Band 5.5–6.0',
      s: 'Yes, definitely — bitter melon. When I was little, my mum often cooked bitter melon soup, and I used to hate it because of the taste. I always left it in the bowl. But a few years ago I tried it again at my grandmother\'s house, and I was surprised that I liked it. Now I actually ask my mum to make it, especially in summer, because it\'s really refreshing.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: trả lời ngay ("Yes, definitely — bitter melon") rồi kể theo ba mốc thời gian: hồi nhỏ → vài năm trước → bây giờ. Trình tự thời gian là cách kéo dài ý tự nhiên nhất cho câu hỏi "xưa – nay". 5 câu, khoảng 25 giây.',
        '**LR (từ vựng)**: "bitter melon" (mướp đắng / khổ qua), "because of the taste", "left it in the bowl", "refreshing" (mát, sảng khoái — hay hơn "good"). "actually" ở đây = "thật ra, không ngờ là".',
        '**GRA (ngữ pháp)**: "I used to hate it" — thói quen/trạng thái trong quá khứ nay không còn (Tập 2 Ngày 21); quá khứ đơn cho sự việc ("I tried it again", "I was surprised that I liked it"); hiện tại đơn cho bây giờ. Ba mốc — ba thì dùng đúng.',
        '**P (phát âm)**: "used to" đọc /ˈjuːst tə/ — âm /s/, KHÔNG phải /z/ như động từ "use" /juːz/; ba cách đọc -ed (Tập 2 Ngày 21): "cooked" /kʊkt/ → /t/, "tried" /traɪd/ → /d/, "surprised" /səˈpraɪzd/ → /d/; "refreshing" /rɪˈfreʃɪŋ/ nhấn âm thứ hai.',
        '**Muốn lên 6.5**: thêm một câu so sánh ("It\'s not as bitter as I remembered") và một từ tả vị ("a slightly bitter aftertaste").',
      ],
    },
    {
      part: 2,
      cau: 'Describe an event you attended that you enjoyed.',
      band: 'Band 5.5–6.0',
      s: 'I\'d like to talk about my cousin\'s wedding, which I went to last December.\n\nIt took place in my father\'s home village, about two hours from the city where I live. I went there with my parents and my younger sister. We left early in the morning, and when we arrived, the whole street was already decorated with flowers and red lanterns.\n\nThe wedding party was held in a big tent in front of my uncle\'s house. There were about three hundred guests, so it was really crowded and noisy. First, the two families gave short speeches, and then everybody had lunch together. The food was delicious, especially the grilled fish. After lunch, there was live music, and many guests went up on the stage to sing. My uncle even made me sing a song, which was quite embarrassing because I\'m a terrible singer.\n\nI enjoyed this event for two main reasons. The first is that I met a lot of relatives who I hadn\'t seen for years. Some of my cousins have moved to other cities, so it\'s rare for all of us to be in the same place. We talked and laughed for hours. The other reason is the atmosphere. In the city, weddings are usually held in hotels and they finish in two hours, but in the village the celebration lasted all day, and everyone was so relaxed and friendly. While we were driving home that evening, my sister and I were already talking about who would get married next. So it\'s a day that I\'ll remember for a long time.',
      phanTich: [
        '**FC**: đủ 4 ý trên thẻ theo thứ tự (sự kiện gì → khi nào, ở đâu → đi với ai → vì sao thích), phần kể có trình tự rõ: "First… and then… After lunch…". Ý "why" dài nhất, hai lý do đều có giải thích. Nói chậm, rõ thì gần 2 phút — đạt yêu cầu Part 2. Câu kết "So it\'s a day that I\'ll remember for a long time" báo đã xong.',
        '**LR**: từ đúng chủ đề sự kiện: "took place", "was decorated with", "guests", "gave short speeches", "live music", "relatives", "the atmosphere", "the celebration lasted all day". Tính từ cảm xúc: "delicious", "embarrassing", "relaxed and friendly". Band 5 thường chỉ có "fun / happy / nice".',
        '**GRA**: quá khứ đơn làm nền; bị động quá khứ "was held", "was decorated" (đúng dạng be + V3); mệnh đề quan hệ "which I went to", "who I hadn\'t seen for years" (kèm quá khứ hoàn thành — việc xảy ra TRƯỚC đám cưới); quá khứ tiếp diễn với "while": "While we were driving home…, my sister and I were already talking…" (Tập 2 Ngày 21); đối chiếu "In the city…, but in the village…". Đúng mô tả GRA band 6: "a mix of simple and complex structures" (band 6 còn cho phép lỗi ở câu phức; bài mẫu này ít lỗi hơn mức đó).',
        '**P**: ba cách đọc -ed: "decorated" /ˈdekəreɪtɪd/ → /ɪd/ (sau âm /t/), "moved" /muːvd/ → /d/, "laughed" /lɑːft/ → /t/; trọng âm: "embarrassing" /ɪmˈbærəsɪŋ/ nhấn âm thứ hai, "relatives" /ˈrelətɪvz/ và "atmosphere" /ˈætməsfɪə/ nhấn âm đầu, "celebration" /ˌselɪˈbreɪʃn/ nhấn âm thứ ba; ngắt hơi sau cụm thời gian: "After lunch, / there was live music".',
        '**Muốn lên 6.5–7**: thay "The first is… The other reason is…" bằng câu dẫn có nội dung ("What I liked most was…"); thêm chi tiết giác quan (mùi, tiếng nhạc) và một câu cảm nhận sâu hơn ("It reminded me how close my family is").',
      ],
    },
    {
      part: 3,
      cau: 'Is it better to watch a big event live or on a screen at home?',
      band: 'Band 5.5–6.0',
      s: 'It depends on the event, but in general I think being there is better. When you\'re in a stadium or at a concert, you can feel the excitement of the crowd, and that\'s something a screen can\'t give you. On the other hand, watching at home is much cheaper and more comfortable. You can see everything clearly, and you don\'t have to queue or travel. For example, my father prefers to watch football on TV because he says the view is better than in the stadium. So for a special event I would choose to go, but for ordinary matches the TV is good enough.',
      phanTich: [
        '**FC**: câu hỏi so sánh ⇒ khung "It depends…, but in general…" → lợi của phương án A → "On the other hand" + lợi của phương án B → ví dụ → kết luận có điều kiện ("for a special event… but for ordinary matches…"). Bàn CẢ HAI phía rồi mới chọn là cách trả lời câu so sánh ở Part 3.',
        '**LR**: "the excitement of the crowd", "queue" (xếp hàng — đọc /kjuː/), "the view", "good enough", "ordinary matches". "It depends on…" là cụm mở đầu rất hữu ích — nhớ có "on".',
        '**GRA**: danh động từ làm chủ ngữ ("being there is better", "watching at home is much cheaper" — Tập 2 Ngày 11); so sánh hơn với "much" ("much cheaper and more comfortable" — Ngày 9); "don\'t have to" (không cần phải); mệnh đề quan hệ lược "that": "something (that) a screen can\'t give you".',
        '**P**: "comfortable" /ˈkʌmftəbl/ — 3 âm tiết, nhấn âm đầu; "excitement" /ɪkˈsaɪtmənt/ nhấn âm thứ hai; "stadium" /ˈsteɪdiəm/; nhấn tương phản: "being THERE is better… watching at HOME is cheaper".',
        '**Muốn lên 6.5–7**: thêm ý trừu tượng hơn ("a shared experience", "you feel part of something bigger") và một cấu trúc nhượng bộ ("Even though tickets are expensive, …").',
      ],
    },
    {
      part: 3,
      cau: 'Are celebrations in your country different now from when your grandparents were young?',
      band: 'Band 5.5–6.0',
      s: 'Yes, I think they\'ve changed a lot. My grandmother told me that when she was young, people used to prepare everything themselves. For example, before the New Year holiday, the whole family would spend days making traditional cakes together. Nowadays, most people are too busy, so they just buy them in a supermarket. Celebrations are also bigger and more expensive than before, with fireworks and big concerts. In some ways that\'s more exciting, but I think the old way brought families closer together.',
      phanTich: [
        '**FC**: khung so sánh xưa – nay (Tập 2 Ngày 21): trả lời thẳng ("they\'ve changed a lot") → NGÀY XƯA (used to / would + ví dụ) → "Nowadays…" → nhận xét riêng cân bằng hai mặt ("In some ways… but I think…").',
        '**LR**: "prepare everything themselves", "traditional cakes", "fireworks", "brought families closer together" (cụm hay, đáng học thuộc). "Nowadays" viết liền, đừng nói "in nowadays".',
        '**GRA**: "used to prepare" và "would spend days making…" — cả hai chỉ thói quen trong quá khứ; "would" chỉ dùng cho HÀNH ĐỘNG lặp lại, không dùng cho trạng thái (✗ "would be poor"). "spend + thời gian + V-ing"; "too busy"; so sánh "bigger and more expensive than before"; hiện tại hoàn thành "they\'ve changed" cho thay đổi kéo tới hiện tại.',
        '**P**: "celebrations" /ˌselɪˈbreɪʃnz/ nhấn âm thứ ba; "traditional" /trəˈdɪʃənl/ nhấn âm thứ hai; "fireworks" /ˈfaɪəwɜːks/ nhấn âm đầu; "would" /wʊd/ — chữ l câm; "used to" /ˈjuːst tə/.',
        '**Muốn lên 6.5–7**: thêm nguyên nhân của sự thay đổi ("because more people live in cities and work long hours") và một từ khái quát ("commercialised", "a sense of community").',
      ],
    },
  ],
};
