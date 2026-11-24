/**
 * Đề 8 — Speaking, THI CUỐI TẬP 4 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 4 Ngày 30). TỰ SOẠN 18/11/2026.
 * Part 1: Plants + Noise (ôn 30 chủ đề Part 1 + idiom — T4 N30; Part 1 band 7 chi tiết + từ ít gặp — N2) — 6 câu · Part 2: Describe a
 * piece of advice — từ 24/11 là lời khuyên từ SÁCH / VIDEO / PODCAST làm đổi một thói quen (đổi để không trùng thẻ + bài mẫu N26) (đề Part 2 TRỪU TƯỢNG "a law, a piece of advice" — T4 N26; kể có câu chuyện nhỏ N6, N14) · Part 3: 5 câu khó dần
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
  moTa: 'Part 1: plants · noise · Part 2: a piece of advice from a book, video or podcast that changed a habit · Part 3: advice from the media, advice in the future',
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
    cueCard: 'Describe a piece of advice you came across in a book, a video or a podcast that changed one of your habits.\n\nYou should say:\n• where you came across the advice\n• what the advice was\n• how you put it into practice\n\nand explain how it changed your habit.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — đề TRỪU TƯỢNG (Tập 4 Ngày 26) ⇒ "neo" vào MỘT nguồn cụ thể: loại nguồn (podcast, video, sách), lúc nào bạn gặp nó, và câu nói gần nguyên văn bằng tiếng Anh. Ghi 4 từ khoá cho 4 ý (where · what · practice · how it changed) + MỘT con số trước/sau (giờ dùng điện thoại, số trang đọc mỗi ngày…).',
      'KHÁC thẻ Ngày 26 (lời khuyên từ một NGƯỜI quen, chuyện “không nghe lúc đầu”): ở đây nguồn là sách / video / podcast và trọng tâm là một THÓI QUEN đổi ra sao. Đừng bê nguyên bài kể của Ngày 26 — mượn khung NEO → NỀN → CẢNH → CÂN thì được, nhưng cảnh và kết phải nói về thói quen.',
      'Thì: quá khứ đơn cho lúc nghe lời khuyên và lúc làm thử; "would" cho thói quen cũ lặp lại ("I\'d sit down… and within five minutes I\'d be scrolling…"); quá khứ hoàn thành cho điều xảy ra trước ("which had been showing over five hours a day"); hiện tại hoàn thành cho tác dụng kéo dài tới giờ ("I\'ve since used the same trick…").',
      'Ý "how it changed your habit" nói DÀI NHẤT: khó khăn mấy ngày đầu + điều bất ngờ + con số trước/sau + một điều kiện hỗn hợp (Tập 4 Ngày 19): "If I hadn\'t heard that episode, I suspect I\'d still be…". Kết bằng một nhận xét khái quát vì sao lời khuyên có tác dụng (ôn Đề 7 Passage 1: thói quen gắn với hoàn cảnh).',
      'Một idiom đúng register nói (Tập 4 Ngày 18, Ngày 30), dùng MỘT lần: "it stuck with me", "old habits die hard", "easier said than done". Câu chẻ cho điểm nhấn (Ngày 7): "What I hadn\'t expected was how quickly…".',
    ],
    cauChot: [
      'Do you often look for advice in books or online?',
      'Have you passed this advice on to anyone else?',
    ],
  },
  part3: [
    {
      chuDe: 'Advice from the media',
      cau: [
        'Where do people in your country usually look for advice about money or health?',
        'Why do some people trust advice from social media influencers more than advice from experts?',
        'Is it ever acceptable to give someone advice that you would not follow yourself?',
      ],
    },
    {
      chuDe: 'Advice in the future',
      cau: [
        'What would happen if everyone followed the same popular advice about diet and exercise?',
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
      cau: 'Describe a piece of advice you came across in a book, a video or a podcast that changed one of your habits.',
      band: 'Band 7.5–8.0',
      s: 'The piece of advice I want to talk about didn\'t come from anyone I know personally. I came across it in a podcast about concentration, which I was listening to on the bus about a year ago, mainly to pass the time.\n\nThe guest was a psychologist, and at one point she said something that really stuck with me: "If you want to stop doing something, don\'t rely on willpower — just make it slightly harder to do." Her example was exactly my problem. Most of us, she said, don\'t check our phones because we\'ve decided to, but simply because they\'re within reach.\n\nAt the time I was revising for my final exams, and to be honest, I was getting very little done. I\'d sit down with my notes, and within five minutes I\'d be scrolling through videos without quite knowing how I\'d got there. So that evening I tried it. Before I started work, I switched my phone off and left it in a drawer in the kitchen — not hidden, just far enough away that fetching it meant getting up and walking downstairs.\n\nThe first couple of days were surprisingly uncomfortable; I kept reaching for my pocket. But what I hadn\'t expected was how quickly the urge faded once the phone simply wasn\'t there. My screen-time app, which had been showing over five hours a day, dropped to under two within about three weeks, and I was getting through roughly twice as much revision.\n\nLooking back, what made the advice so useful was that it didn\'t ask me to become a more disciplined person, which I\'d tried and failed to do many times. It just changed my surroundings. If I hadn\'t heard that episode, I suspect I\'d still be blaming myself for a lack of willpower. I\'ve since used the same trick for snacks, too — they live on the top shelf now.',
      phanTich: [
        '**FC**: đủ 4 ý theo thứ tự thẻ (nguồn → lời khuyên → làm thử → thay đổi), câu chuyện có DIỄN BIẾN: thói quen cũ → làm thử ngay tối đó → mấy ngày đầu khó → bất ngờ → con số sau ba tuần → nhận xét vì sao có tác dụng. Chuyển ý tự nhiên, không đánh số: "At the time…", "So that evening I tried it.", "But what I hadn\'t expected…", "Looking back, …". Câu cuối hài hước nhẹ (đồ ăn vặt trên kệ cao) khép bài mà không cần "That\'s all".',
        '**LR**: "pass the time", "stuck with me", "rely on willpower", "within reach", "getting very little done", "scrolling through videos", "fetching it", "the urge faded", "getting through… revision", "a more disciplined person", "blaming myself for a lack of willpower". Idiom duy nhất "it stuck with me" — đúng register nói, không nhồi (Tập 4 Ngày 18, Ngày 30). Không có chữ hiếm vô nghĩa: từ band 8 là từ ĐÚNG ngữ cảnh.',
        '**GRA**: "would" cho thói quen cũ "I\'d sit down… I\'d be scrolling"; quá khứ hoàn thành "how I\'d got there", "which had been showing over five hours a day" (mệnh đề quan hệ không xác định + QKHT tiếp diễn); câu chẻ "what I hadn\'t expected was how quickly…" và "what made the advice so useful was that…" (Ngày 7); "not because… but simply because…"; phân từ "Looking back, …" (Ngày 5); điều kiện HỖN HỢP "If I hadn\'t heard that episode, I suspect I\'d still be blaming myself" (Ngày 19); hiện tại hoàn thành "I\'ve since used".',
        '**P**: trích lời khuyên chậm lại, hạ giọng, ngắt hai nhịp ("don\'t rely on WILLpower — / just make it slightly HARDER to do"); trọng âm "psychologist" /saɪˈkɒlədʒɪst/ âm hai (p câm), "concentration" /ˌkɒnsnˈtreɪʃn/ âm ba, "uncomfortable" /ʌnˈkʌmftəbl/ âm hai, "disciplined" /ˈdɪsəplɪnd/ âm đầu; -ed: "switched" /t/, "dropped" /t/, "tried" /d/; nối âm "left‿it‿in‿a drawer", "kept‿reaching".',
        '**Muốn lên band 8.5–9**: thêm một chi tiết giác quan của khoảnh khắc nghe lời khuyên (chuyến xe buýt mưa, đang định tắt podcast) và một câu khái quát có hedging ("I suspect most of our habits are decided by where things are rather than by what we want").',
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
