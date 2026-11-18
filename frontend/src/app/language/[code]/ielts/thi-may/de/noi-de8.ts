/**
 * Đề 8 — Speaking, THI CUỐI TẬP 4 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 4 Ngày 30). TỰ SOẠN 18/11/2026.
 * Part 1: Plants + Noise (ôn 30 chủ đề Part 1 + idiom — T4 N30; Part 1 band 7 chi tiết + từ ít gặp — N2) — 6 câu · Part 2: Describe a
 * piece of advice (đề Part 2 TRỪU TƯỢNG "a law, a piece of advice" — T4 N26; kể có câu chuyện nhỏ N6, N14) · Part 3: 5 câu khó dần
 * fact → nguyên nhân "Why do some…?" (N15) → đánh giá "Is it ever…?" (N23 giá trị, đạo đức) → giả định "What would happen if…?"
 * (N19 phản thực tế) → dự đoán có hedging "Do you think… in the future?" (N7), nối chủ đề "lời khuyên".
 * Khó hơn Đề 7 nửa bậc: Part 1 có câu so sánh và câu về thái độ của chính mình; Part 3 có câu đạo đức (có nên nói dối để an ủi khi
 * khuyên), câu giả định và câu về AI — đòi lập luận chuỗi, nêu mức độ và nhượng bộ. `mau`: câu trả lời mẫu band 7.5–8.0 (đích Tập 5
 * của người đang ở 7.0) — dùng cấu trúc Tập 4 (cụm danh từ phức N1, phân từ N5, câu chẻ + đảo ngữ N7, mệnh đề danh ngữ N11, hedging
 * N13, điều kiện hỗn hợp N19, ellipsis + tag N23, subjunctive N27, idiom đúng register N18 + N30); phân tích FC · LR · GRA · P bằng
 * tiếng Việt. Phiên âm theo Anh–Anh; chỉ nêu trọng âm của những từ thông dụng.
 */
import type { DeNoi } from './types';

export const NOI_DE8: DeNoi = {
  id: 'noi-de8',
  kyNang: 'noi',
  ten: 'Speaking — Đề 8 (thi cuối Tập 4)',
  boDe: 'Đề 8',
  capDo: 'Band 7.0',
  moTa: 'Part 1: plants · noise · Part 2: a piece of advice you received that was useful · Part 3: giving and taking advice, advice in the future',
  phut: 14,
  part1: [
    {
      chuDe: 'Plants',
      cau: [
        'Do you keep any plants at home?',
        'Were plants or gardens important in the place where you grew up?',
        'Why do you think so many people living in cities like to grow plants?',
      ],
    },
    {
      chuDe: 'Noise',
      cau: [
        'Is the area where you live noisy or quiet?',
        'What kinds of noise do you find most annoying?',
        'Do you find it easier to concentrate in silence or with some background noise?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a piece of advice you received that turned out to be useful.\n\nYou should say:\n• who gave you the advice\n• what the advice was\n• what situation you were in at the time\n\nand explain why the advice turned out to be useful.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — đề TRỪU TƯỢNG (Tập 4 Ngày 26) ⇒ phải "neo" vào MỘT câu chuyện cụ thể: một người, một câu nói nguyên văn, một thời điểm. Ghi 4 từ khoá cho 4 ý (who · what · situation · why useful) + câu nói đó bằng tiếng Anh.',
      'Lời khuyên dễ kể nhất là lời khuyên bạn ĐÃ KHÔNG muốn nghe lúc đầu: "đừng học ngành chỉ vì bạn bè học", "ngủ đi rồi mai quyết", "hỏi khi không hiểu, đừng giả vờ hiểu". Có sự kháng cự ⇒ có diễn biến ⇒ ý 4 dài và tự nhiên.',
      'Thì: quá khứ đơn + quá khứ hoàn thành cho bối cảnh ("I had just failed…"); câu tường thuật cho lời khuyên ("She told me that… / She suggested that I…" — subjunctive: "suggested that I take…", Tập 4 Ngày 27); hiện tại hoàn thành cho tác dụng kéo dài tới giờ ("I\'ve followed it ever since").',
      'Ý "why it turned out to be useful" nói DÀI NHẤT: nêu hệ quả ngay lúc đó + hệ quả lâu dài + một điều kiện hỗn hợp (Tập 4 Ngày 19): "If I hadn\'t listened to her, I\'d probably still be…". Có thể thêm một câu thừa nhận ("At the time I thought it was rather obvious…").',
      'Một idiom đúng register nói (Tập 4 Ngày 18, Ngày 30), dùng MỘT lần, không nhồi: "sleep on it", "it went in one ear and out the other", "I took it with a pinch of salt", "it stuck with me". Câu kết: "So it\'s a small piece of advice, but it\'s probably shaped more of my decisions than anything I learnt at school."',
    ],
    cauChot: [
      'Have you ever given the same advice to anyone else?',
      'Do you usually follow the advice that people give you?',
    ],
  },
  part3: [
    {
      chuDe: 'Giving and taking advice',
      cau: [
        'Who do young people in your country usually turn to when they need advice?',
        'Why do some people find it difficult to accept advice, even when it is good?',
        'Is it ever acceptable to give someone advice that you would not follow yourself?',
      ],
    },
    {
      chuDe: 'Advice in the future',
      cau: [
        'What would happen if people relied entirely on the internet for advice about their health?',
        'Do you think people will trust advice from artificial intelligence more than advice from other people in the future?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Do you find it easier to concentrate in silence or with some background noise?',
      band: 'Band 7.5–8.0',
      s: 'Oddly enough, I can\'t stand complete silence. If the room\'s totally quiet, I start noticing every tiny sound — the fridge humming, someone\'s footsteps upstairs — and it\'s far more distracting than a steady background hum. So when I\'ve got something demanding to do, I\'ll usually head for a café, or put on some instrumental music, nothing with lyrics, because the moment there are words I find myself following them instead of my own thoughts. Having said that, it depends on the task. For proofreading, I need it quiet, I\'m afraid — there\'s no way round it.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: trả lời thẳng bằng một ý hơi bất ngờ ("Oddly enough, I can\'t stand complete silence") rồi giải thích CƠ CHẾ (yên quá thì nghe thấy mọi tiếng nhỏ), nêu cách làm cụ thể (quán cà phê, nhạc không lời + lý do), cuối cùng một giới hạn ("Having said that, it depends on the task") có ví dụ. Khoảng 35–40 giây, mạch ý tự nhiên, không lặp lại câu hỏi.',
        '**LR (từ vựng)**: "can\'t stand" (không chịu nổi), "the fridge humming", "a steady background hum", "something demanding", "head for a café", "instrumental music", "lyrics", "proofreading", "there\'s no way round it" (không tránh được). Từ ít gặp nhưng tự nhiên — band 7+ không cần chữ hiếm, cần chữ ĐÚNG ngữ cảnh. Cụm chuyển ý văn nói: "Oddly enough", "Having said that".',
        '**GRA (ngữ pháp)**: điều kiện loại 1 "If the room\'s totally quiet, I start noticing…"; so sánh "far more distracting than…"; "will" chỉ thói quen "I\'ll usually head for…"; mệnh đề thời gian "the moment there are words"; "find myself + V-ing"; ellipsis văn nói (Tập 4 Ngày 23) "nothing with lyrics", "I need it quiet, I\'m afraid".',
        '**P (phát âm)**: âm /h/ đầu từ rõ trong "hum", "humming", "head"; "distracting" /dɪˈstræktɪŋ/ nhấn âm hai; "instrumental" /ˌɪnstrəˈmentl/ nhấn âm ba; "lyrics" /ˈlɪrɪks/; nối âm "head‿for‿a café", "put‿on"; nhấn tương phản "I can\'t stand COMPLETE silence… for PROOFreading, I need it quiet".',
        '**Muốn lên band 8.5**: thêm một chi tiết rất riêng (tên một loại âm thanh nền bạn dùng — tiếng mưa, tiếng quán) và một câu tự giễu ngắn ("which probably says more about my attention span than about noise").',
      ],
    },
    {
      part: 2,
      cau: 'Describe a piece of advice you received that turned out to be useful.',
      band: 'Band 7.5–8.0',
      s: 'I\'d like to talk about something my grandmother told me when I was about seventeen, which at the time I almost ignored.\n\nThe situation was this. I\'d just got my results for the end-of-year exams, and they were much worse than I\'d hoped, particularly in maths, which I\'d always considered my strongest subject. I was furious with myself, and that same evening I announced to the whole family that I was going to drop maths altogether and switch to a completely different set of subjects.\n\nMost of my family argued with me, which only made me more determined. My grandmother, though, didn\'t argue at all. She just said, very calmly, "Never make a big decision on the day you feel worst. Sleep on it for a week, and if you still feel the same, then do it." Honestly, I thought it was rather an old-fashioned thing to say, and it nearly went in one ear and out the other. But because she\'d asked so little of me — just a week — I agreed.\n\nAnd of course, a week later I felt completely different. Once I\'d calmed down and actually looked at the papers, I could see that I\'d lost most of my marks through careless mistakes rather than through not understanding the material. So I stayed with maths, and it\'s now a big part of my degree. If I hadn\'t listened to her, I\'d probably be studying something I had no real interest in.\n\nWhat makes the advice so useful, though, is that it applies to almost everything. I\'ve used that "one-week rule" before quitting a job, before ending an argument with a friend by text, even before buying an expensive phone, and it\'s saved me from a lot of regret. So it\'s a small piece of advice, but it\'s probably shaped more of my decisions than anything I learnt at school.',
      phanTich: [
        '**FC**: đủ 4 ý theo thứ tự hợp lý (giới thiệu → bối cảnh → ai khuyên và khuyên gì → vì sao hữu ích), và câu chuyện có DIỄN BIẾN rõ: cơn giận → cả nhà phản đối → bà chỉ xin một tuần → một tuần sau khác hẳn → hệ quả lâu dài. Chuyển ý tự nhiên: "The situation was this.", "My grandmother, though, …", "And of course, a week later…", "What makes the advice so useful, though, is…". Ý cuối dài nhất và mở rộng sang nhiều tình huống — đúng yêu cầu "explain" của đề trừu tượng (Tập 4 Ngày 26).',
        '**LR**: "drop maths altogether", "switch to", "furious with myself", "only made me more determined", "sleep on it" (để qua đêm rồi quyết), "went in one ear and out the other" (nghe tai này ra tai kia — idiom dùng đúng một lần, đúng register nói, Tập 4 Ngày 18), "careless mistakes", "saved me from a lot of regret", "shaped more of my decisions". Lời khuyên được TRÍCH NGUYÊN VĂN — cách làm câu chuyện sống động.',
        '**GRA**: quá khứ hoàn thành cho bối cảnh "I\'d just got my results… than I\'d hoped", "which I\'d always considered…"; mệnh đề quan hệ không xác định ", which at the time I almost ignored", ", which only made me more determined"; "Once I\'d calmed down"; đối lập "through careless mistakes rather than through not understanding"; điều kiện HỖN HỢP (Tập 4 Ngày 19) "If I hadn\'t listened to her, I\'d probably be studying…" (quá khứ → hiện tại); câu chẻ "What makes the advice so useful… is that…"; hiện tại hoàn thành cho tác dụng tới nay "I\'ve used…", "it\'s saved me…".',
        '**P**: ngữ điệu kể chuyện — hạ giọng, chậm lại khi trích lời bà ("Never make a big decision / on the day you feel worst."), nhấn từ khoá "WORST", "a WEEK"; trọng âm "determined" /dɪˈtɜːmɪnd/ âm hai (âm /ɜː/ dài), "furious" /ˈfjʊəriəs/ âm đầu, "altogether" /ˌɔːltəˈɡeðə/ âm ba, "regret" /rɪˈɡret/ âm hai; -ed: "announced" /t/, "argued" /d/, "calmed" /d/ (chữ "l" câm: /kɑːmd/).',
        '**Muốn lên band 8.5–9**: thêm một chi tiết giác quan / hình ảnh của khoảnh khắc (bà nói khi đang tưới cây ngoài ban công) và một câu khái quát có hedging ở cuối ("I suspect most bad decisions are made in the first hour after bad news").',
      ],
    },
    {
      part: 3,
      cau: 'Is it ever acceptable to give someone advice that you would not follow yourself?',
      band: 'Band 7.5–8.0',
      s: 'I\'d say yes, in some cases, although it depends on why you wouldn\'t follow it. If the reason is simply that you lack the willpower — telling a friend to stop smoking while you smoke yourself, say — then the advice is still perfectly sound. It may come across as hypocritical, but the facts don\'t change because the person stating them is weak. In fact, someone who\'s struggled with a habit can sometimes give more honest advice than someone who never had it. Where I think it becomes unacceptable is when you wouldn\'t follow the advice because you know it\'s bad for you — recommending a risky investment you\'d never put your own money into, for instance. That\'s not hypocrisy any more; it\'s a kind of dishonesty. So the test, for me, is whether you\'d be comfortable explaining your own reasons to the person you\'re advising.',
      phanTich: [
        '**FC**: câu hỏi đạo đức (Tập 4 Ngày 23) ⇒ nêu lập trường có MỨC ĐỘ ngay câu đầu ("yes, in some cases, although it depends on why…") rồi tách HAI trường hợp theo một tiêu chí rõ (thiếu ý chí ↔ biết là có hại), mỗi trường hợp có ví dụ, cuối cùng gói lại bằng một "phép thử" ("So the test, for me, is…"). "it depends" ở đây CÓ điều kiện cụ thể — khác hẳn "it depends" để né câu hỏi.',
        '**LR**: "lack the willpower", "perfectly sound" (hoàn toàn đúng đắn), "come across as hypocritical" (có vẻ đạo đức giả), "struggled with a habit", "a risky investment", "put your own money into", "a kind of dishonesty". Từ trừu tượng dài dùng đúng (Ngày 23): "hypocritical / hypocrisy", "dishonesty", "comfortable explaining".',
        '**GRA**: điều kiện + mệnh đề danh ngữ "it depends on why you wouldn\'t follow it" (Ngày 11); câu chẻ "Where I think it becomes unacceptable is when…" (Ngày 7); "would" giả định xuyên suốt "you\'d never put your own money into"; mệnh đề quan hệ rút gọn "the person stating them"; so sánh "more honest advice than someone who never had it"; "whether you\'d be comfortable + V-ing".',
        '**P**: nhấn tương phản ý (Tập 4 Ngày 11): "it\'s not HYPOCRISY any more; it\'s a kind of DISHONESTY"; trọng âm "hypocritical" /ˌhɪpəˈkrɪtɪkl/ âm ba, "hypocrisy" /hɪˈpɒkrəsi/ âm hai (hai từ cùng gốc, trọng âm khác nhau), "acceptable" /əkˈseptəbl/ âm hai, "investment" /ɪnˈvestmənt/ âm hai; ngắt nhóm ý trước ví dụ: "…perfectly sound. / It may come across as hypocritical, / but the facts don\'t change…".',
        '**Muốn lên band 8.5–9**: thêm một nhượng bộ – phản bác ngắn ("Some would say you lose the right to advise once you don\'t practise it yourself, but that would leave very few people qualified to give advice at all") và một đảo ngữ ("Only when you\'re hiding your real reasons does it cross the line").',
      ],
    },
    {
      part: 3,
      cau: 'Do you think people will trust advice from artificial intelligence more than advice from other people in the future?',
      band: 'Band 7.5–8.0',
      s: 'For certain kinds of advice, I suspect they already do, to be honest. If you want to know how to fix a leaking tap or what a medical term means, an AI is quick, patient and never makes you feel stupid for asking, so it\'s easy to see why people go to it first. And as these systems get more accurate, that trust is likely to grow. But I\'d be surprised if it replaced human advice altogether, at least for the decisions that really matter. When someone\'s deciding whether to change career or end a relationship, what they want isn\'t only information. It\'s the sense that the person advising them has something at stake — that they know you, and that they\'ll still be around if it goes wrong. A machine can\'t offer that, however clever it becomes. So my guess is that we\'ll end up dividing advice into two kinds: the factual, which we\'ll increasingly hand over to AI, and the personal, which we won\'t.',
      phanTich: [
        '**FC**: dạng dự đoán tương lai (Tập 4 Ngày 7) ⇒ mở bằng một nhận định về HIỆN TẠI có dè dặt ("I suspect they already do") làm căn cứ → lý do (nhanh, kiên nhẫn, không làm người hỏi thấy ngốc) → xu hướng ("is likely to grow") → giới hạn ("But I\'d be surprised if…") có hai ví dụ cụ thể → kết luận chia hai loại lời khuyên. Lập luận chuỗi có nhượng bộ — đúng chất band 7.5+.',
        '**LR**: "a leaking tap", "never makes you feel stupid for asking", "replaced… altogether", "the decisions that really matter", "has something at stake" (có gì đó để mất — có trách nhiệm), "still be around if it goes wrong", "hand over to" (giao lại cho). Hedging đa dạng (Ngày 13): "I suspect", "is likely to", "I\'d be surprised if", "at least for", "my guess is".',
        '**GRA**: điều kiện "If you want to know how to… or what…" với hai mệnh đề danh ngữ (Ngày 11); "as these systems get more accurate" (as = khi mà, tương quan); điều kiện loại 2 dè dặt "I\'d be surprised if it replaced…"; mệnh đề danh ngữ làm chủ ngữ "what they want isn\'t only information"; nhượng bộ rút gọn "however clever it becomes"; ellipsis cuối câu (Ngày 23) "and the personal, which we won\'t [hand over]".',
        '**P**: ngắt ý theo cấu trúc hai vế: "the FACTUAL, / which we\'ll increasingly hand over to AI, / and the PERSONAL, / which we won\'t."; trọng âm "artificial" /ˌɑːtɪˈfɪʃl/ âm ba, "accurate" /ˈækjərət/ âm đầu (đuôi /ət/), "relationship" /rɪˈleɪʃnʃɪp/ âm hai, "increasingly" /ɪnˈkriːsɪŋli/ âm hai; nối âm "end‿up", "hand‿over"; âm yếu "to be honest" /tə bi ˈɒnɪst/.',
        '**Muốn lên band 8.5–9**: thêm một so sánh lịch sử ngắn ("much as people came to trust satellite navigation over their own sense of direction") và một câu nêu rủi ro cụ thể có dè dặt ("the danger, arguably, is that we\'ll stop noticing which kind of question we\'re asking").',
      ],
    },
  ],
};
