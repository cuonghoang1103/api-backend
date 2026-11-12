/**
 * Đề 2 — Speaking, sau TẬP 2 NGÀY 12 (docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 12/11/2026.
 * Part 1: Hobbies + Weather (T2 N5 kéo dài ý, N9 — 12 chủ đề Part 1) — 6 câu · Part 2: Describe an object (T2 N11; cue card 4 ý) ·
 * Part 3: 5 câu khó dần fact → opinion → compare → compare (xưa/nay) → hypothesise, nối chủ đề "đồ vật – mua sắm".
 * Câu hỏi dùng từ A2–B1 để người học band 4.5 HIỂU được; độ khó nằm ở việc trả lời đủ dài, có lý do + ví dụ.
 * `mau`: câu trả lời mẫu band 5.5 (đích kế tiếp) — CHỈ dùng cấu trúc đã dạy tới Tập 2 Ngày 12 (hiện tại hoàn thành, so sánh,
 * have to / mustn't, will / might, V-ing sau giới từ, because / so / although); phân tích FC · LR · GRA · P bằng tiếng Việt.
 * Phiên âm theo Anh–Anh (Oxford Learner's); chỉ nêu trọng âm của những từ đã tra.
 */
import type { DeNoi } from './types';

export const NOI_DE2: DeNoi = {
  id: 'noi-de2',
  kyNang: 'noi',
  ten: 'Speaking — Đề 2 (Tập 2 · Ngày 12)',
  boDe: 'Đề 2',
  capDo: 'Band 4.5',
  moTa: 'Part 1: hobbies · weather · Part 2: an object you own that is important to you · Part 3: possessions, keeping and buying things',
  phut: 12,
  part1: [
    {
      chuDe: 'Hobbies',
      cau: [
        'What do you like doing in your free time?',
        'Did you have the same hobbies when you were a child?',
        'Is there a new hobby that you would like to try in the future?',
      ],
    },
    {
      chuDe: 'Weather',
      cau: [
        'What is the weather usually like in your hometown?',
        'What kind of weather do you like best? Why?',
        'Does the weather ever change your plans?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe an object you own that is important to you.\n\nYou should say:\n• what it is\n• how you got it\n• what you use it for\n\nand explain why it is important to you.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — ghi 4 từ khoá cho 4 ý trên thẻ (what · how I got it · use · why important), KHÔNG viết thành câu.',
      'Chọn một món đồ THẬT, có câu chuyện (đồng hồ ông tặng, chiếc xe đạp đầu tiên, cây đàn, cuốn sổ) — món có "ai tặng, khi nào" thì dễ nói đủ 2 phút hơn một chiếc điện thoại.',
      'Tả món đồ 2–3 câu trước (màu, chất liệu, cũ/mới): "It\'s a silver watch with a black leather strap." — thứ tự tính từ: ý kiến → kích cỡ → tuổi → màu → chất liệu.',
      'Thì: QUÁ KHỨ ĐƠN cho "how you got it" ("He gave it to me two years ago"); HIỆN TẠI ĐƠN cho "what you use it for"; thêm một câu hiện tại hoàn thành ("I\'ve had it for two years", "I\'ve never lost it").',
      'Ý "why it is important" nói DÀI NHẤT: 2 lý do, mỗi lý do thêm một câu giải thích. Câu kết: "So that\'s why it means a lot to me."',
    ],
    cauChot: [
      'Would you ever sell this object or give it away?',
      'Do your friends have something similar?',
    ],
  },
  part3: [
    {
      chuDe: 'Possessions',
      cau: [
        'What kinds of things do people in your country like to buy for themselves?',
        'Why do some people keep old things that they no longer use?',
        'Do young people and older people care about the same kinds of possessions?',
      ],
    },
    {
      chuDe: 'Owning things, past and future',
      cau: [
        'Do people today own more things than people did in the past?',
        'If people could only keep ten things, do you think they would be happier?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'What do you like doing in your free time?',
      band: 'Band 5.5',
      s: 'I really like playing the guitar. I started about two years ago, when my uncle gave me his old one. I\'m not very good yet, but I practise for about half an hour every evening after dinner. It helps me to relax after a long day at school.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: trả lời thẳng ("I really like playing the guitar") rồi kéo dài bằng 3 ý nhỏ: bắt đầu khi nào → tập thế nào → được gì. 4 câu, khoảng 20 giây — đúng độ dài Part 1. Đây là kỹ thuật "trả lời + thêm when / how often / why" của Tập 2 Ngày 5.',
        '**LR (từ vựng)**: "play the guitar" (nhạc cụ đi với "the"), "practise" (động từ viết với s theo Anh–Anh), "half an hour", "relax after a long day" — đơn giản nhưng tự nhiên và đúng chủ đề.',
        '**GRA (ngữ pháp)**: "like + V-ing" (like playing — Tập 2 Ngày 11); quá khứ đơn "I started… when my uncle gave me…"; hiện tại đơn cho thói quen; "I\'m not very good yet" dùng "yet" đúng chỗ. Chưa có cấu trúc khó, nhưng không lỗi.',
        '**P (phát âm)**: "guitar" /ɡɪˈtɑː/ — nhấn âm tiết THỨ HAI (gi-TAR), không nhấn âm đầu; "practise" /ˈpræktɪs/ nhấn âm đầu; "hour" /ˈaʊə/ — chữ h câm nên nói "half AN hour"; nối âm "half_an_hour".',
        '**Vì sao chưa phải band 6**: ý còn ngắn, chưa có cảm xúc hay chi tiết riêng. Thêm một câu hiện tại hoàn thành ("I\'ve learned about ten songs so far") và một câu so sánh ("It\'s more relaxing than playing video games") là lên 6.',
      ],
    },
    {
      part: 1,
      cau: 'Does the weather ever change your plans?',
      band: 'Band 5.5',
      s: 'Yes, quite often. In my city it rains a lot from May to October, so sometimes I have to cancel a football game with my friends. Last weekend, for example, we wanted to go camping, but there was a big storm, so we stayed at home and watched films instead. Now I always check the weather on my phone before I go out.',
      phanTich: [
        '**FC**: "Yes, quite often" trả lời ngay câu hỏi Yes/No rồi mở rộng: tình hình chung → MỘT ví dụ cụ thể có thời gian ("Last weekend, for example…") → thói quen rút ra. Ví dụ có thật là cách dễ nhất để nói dài mà không lạc đề.',
        '**LR**: "it rains a lot" (động từ "rain", không nói "it has much rain"), "cancel a game", "a big storm", "check the weather", "instead". Band 6 sẽ có thêm cụm như "the rainy season", "it was pouring".',
        '**GRA**: hiện tại đơn (thói quen) + quá khứ đơn (chuyện tuần trước) dùng đúng chỗ; "have to + V"; "before I go out". Câu ghép với "so" / "but" — đủ cho band 5.5; muốn 6 cần thêm "because of the rain", "if it rains, I usually…".',
        '**P**: "weather" /ˈweðə/ — âm giữa là /ð/ (đặt lưỡi giữa hai hàm răng), đừng đọc thành /d/ hay /z/; "cancel" /ˈkænsl/ nhấn âm đầu; "October" /ɒkˈtəʊbə/ nhấn âm thứ hai; lên giọng nhẹ ở "for example," rồi nói tiếp.',
      ],
    },
    {
      part: 2,
      cau: 'Describe an object you own that is important to you.',
      band: 'Band 5.5',
      s: 'I\'d like to talk about my watch. It\'s a silver watch with a black leather strap, and it\'s about fifty years old.\n\nIt was a present from my grandfather. He gave it to me two years ago, when I passed the entrance exam for my high school. He bought it when he was young and wore it every day for a long time, so it\'s much older than me.\n\nI use it every day, of course, to check the time. At school we can\'t use our phones in class, so a watch is very useful, especially during exams. I also wear it when I go out with my friends, because I think it looks nice with any clothes.\n\nThis watch is important to me for two reasons. The first reason is that it reminds me of my grandfather. He lives in the countryside, and I only see him two or three times a year. When I look at the watch, I think about him. The second reason is that it teaches me to be careful. It\'s old, so I have to wind it every morning, and I mustn\'t drop it or get it wet. I\'ve never lost it, and I hope I can give it to my own children one day. So that\'s why it means a lot to me.',
      phanTich: [
        '**FC**: đi đúng 4 ý trên thẻ theo thứ tự (là gì → có từ đâu → dùng làm gì → vì sao quan trọng), mỗi ý một đoạn; ý "why" dài nhất với hai lý do, mỗi lý do có câu giải thích. Nói chậm, rõ thì khoảng 1 phút 40 giây. Câu kết "So that\'s why it means a lot to me" báo cho giám khảo biết bạn đã xong.',
        '**LR**: tả đồ vật đúng thứ tự tính từ: "a silver watch", "a black leather strap" (màu → chất liệu → danh từ); cụm hay: "a present from…", "it reminds me of…", "wind it" (lên dây cót — đọc /waɪnd/, khác "wind" /wɪnd/ là gió), "get it wet", "it means a lot to me".',
        '**GRA**: ba thì dùng đúng việc — quá khứ đơn ("He gave it to me two years ago"), hiện tại đơn (thói quen), hiện tại hoàn thành ("I\'ve never lost it" — Tập 2 Ngày 5); so sánh "much older than me" (Ngày 9); "have to / mustn\'t" (bắt buộc / cấm); mệnh đề "when I passed…", "because I think…". Đủ "mix of simple and complex", ít lỗi.',
        '**P**: "present" danh từ /ˈpreznt/ nhấn âm ĐẦU (động từ "to present" /prɪˈzent/ nhấn âm sau — cặp trọng âm Tập 2 Ngày 11); "leather" /ˈleðə/ có /ð/; "clothes" /kləʊðz/ chỉ MỘT âm tiết (không đọc "clo-thes"); "countryside" /ˈkʌntrisaɪd/ nhấn âm đầu; nói rõ âm cuối "wet" /t/, "lost" /st/.',
        '**Vì sao chưa phải band 6–6.5**: mở đoạn bằng "The first reason is… The second reason is…" còn máy móc; từ vựng cảm xúc ít ("important", "nice"). Thử: "What makes it special is…", "It has sentimental value" (giá trị tình cảm), và thêm một kỷ niệm cụ thể với ông.',
      ],
    },
    {
      part: 3,
      cau: 'Why do some people keep old things that they no longer use?',
      band: 'Band 5.5',
      s: 'I think there are two main reasons. First, some old things have memories. For example, my mother still keeps my baby clothes, although nobody can wear them now. She says they remind her of the time when I was small. Second, some people think they might need the thing again in the future, so they don\'t want to throw it away. My father is like that. He keeps old cables and broken radios in a box. Personally, I think it\'s fine to keep a few special things, but not everything.',
      phanTich: [
        '**FC**: khung Part 3: nêu số lý do ("two main reasons") → lý do 1 + ví dụ → lý do 2 + ví dụ → ý kiến riêng ("Personally, I think…"). Câu hỏi "Why do some people…" hỏi về NGƯỜI TA nói chung — dùng ví dụ người thân để minh hoạ là được, miễn là mở đầu bằng ý chung.',
        '**LR**: "have memories", "remind her of", "throw it away" (cụm động từ: đại từ "it" đứng GIỮA — "throw it away", không nói "throw away it"), "broken radios", "a few special things".',
        '**GRA**: mệnh đề nhượng bộ "although nobody can wear them now"; "might + V" chỉ khả năng; "the time when I was small"; "it\'s fine to keep…" (it + be + tính từ + to V). Số nhiều đúng ("cables", "radios", "things").',
        '**P**: "clothes" /kləʊðz/ một âm tiết; "although" /ɔːlˈðəʊ/ nhấn âm thứ hai; "memories" /ˈmeməriz/ nhấn âm đầu; nhấn "TWO main reasons", "FIRST", "SECOND" để người nghe theo được bố cục.',
        '**Vì sao chưa phải band 6**: hai lý do đều minh hoạ bằng người nhà — band 6 khái quát hơn ("Older people in particular tend to…", "In many families…") và dùng một từ trừu tượng ("sentimental value", "just in case").',
      ],
    },
    {
      part: 3,
      cau: 'If people could only keep ten things, do you think they would be happier?',
      band: 'Band 5.5',
      s: 'Hmm, that\'s an interesting question. I think some people would be happier, because they wouldn\'t have to clean and look after so many things, and they would save money. But for most people, I think it would be very difficult. If I could only keep ten things, I would choose my phone, my laptop, my watch and some clothes, and then I would have no books and no guitar. So I don\'t think the number of things is important. What matters more is whether we really use them.',
      phanTich: [
        '**FC**: "Hmm, that\'s an interesting question" là cách "câu giờ" hợp lệ cho câu hỏi khó (dùng MỘT lần thôi). Sau đó trả lời hai phía: một số người sẽ vui hơn (vì sao) → đa số thì khó (ví dụ bản thân) → kết luận riêng. Câu hỏi giả định không có đáp án đúng — giám khảo nghe cách bạn lập luận.',
        '**LR**: "look after" (chăm sóc, giữ gìn), "save money", "the number of things", "what matters" — vừa sức. Chưa có từ chủ đề như "minimalist", "belongings".',
        '**GRA**: câu hỏi dùng "If people could…, would they…?" (giả định, trái với hiện tại) ⇒ câu trả lời giữ "would / wouldn\'t / could": "some people would be happier", "If I could only keep ten things, I would choose…". Ở mức này chỉ cần thuộc khung "If + quá khứ đơn, … would + V" (Tập 2 mới dạy điều kiện loại 0 và 1 ở Ngày 13; loại 2 học kỹ ở Tập 3). Câu cuối "What matters more is whether…" là câu nhấn mạnh — đưa ý quan trọng ra sau "is".',
        '**P**: "would" /wʊd/ — chữ l câm, dạng yếu trong câu nói nhanh; "wouldn\'t" /ˈwʊdnt/; "difficult" /ˈdɪfɪkəlt/ nhấn âm đầu; "interesting" /ˈɪntrəstɪŋ/ nhấn âm đầu, thường chỉ 3 âm tiết; lên giọng nhẹ ở cuối mệnh đề "If I could only keep ten things," rồi xuống ở mệnh đề chính.',
        '**Vì sao chưa phải band 6**: lập luận dựa vào danh sách đồ của bản thân; thêm một ý khái quát ("People often buy things to feel better, but the feeling doesn\'t last") sẽ thuyết phục hơn.',
      ],
    },
  ],
};
