/**
 * Đề 9 — Speaking, TẬP 5 · NGÀY 8 (docs/ielts-lo-trinh-0-8.md mục 4.2: Photography, Celebrations · thẻ Part 2 tình huống
 * trừu tượng). TỰ SOẠN 24/11/2026. Soát chéo 24/11: thẻ cũ "a time you changed your mind" TRÙNG thẻ luyện Tập 4 Ngày 30 ⇒ đổi sang
 * "a time when you persuaded someone to look at a decision differently" (đã grep tap-2…5 + thi-may/de: chưa thẻ nào về persuade).
 * Part 1: Photography + Celebrations — 6 câu, mỗi chủ đề có một câu hỏi "vì sao / xu hướng" để người band 7 phải nói được một ý
 * riêng chứ không chỉ kể thói quen (T5 N3 "Part 1 band 8: tự nhiên, idiom khéo") · Part 2: thẻ "persuaded someone to look at a
 * decision differently" — đề tình huống + trừu tượng: phải kể được người kia định làm gì, LỜI mình đã nói, và CƠ CHẾ khiến lời đó có
 * tác dụng (T4 N26
 * khung NEO → NỀN → CẢNH → CÂN; T5 N7 "Part 2 band 8 — chi tiết cảm quan, giọng kể") · Part 3: 5 câu khó dần fact → nguyên nhân
 * "Why do some…?" → mức độ "To what extent…?" → giả định "What would happen if…?" → dự đoán "Do you think… in the future?", nối
 * chủ đề "đổi ý kiến / thuyết phục" (T5 N6 "Part 3 band 8: phản biện, nhượng bộ, hedging").
 * Khó hơn Đề 8 nửa bậc: Part 3 hỏi về tâm lý (vì sao khó nhận sai), chính trị (chính khách đổi lập trường), mạng xã hội — đòi tách
 * trường hợp theo một tiêu chí, nhượng bộ rồi phản bác, và kết bằng một "phép thử". `mau`: câu trả lời mẫu band 8.0–8.5 (đích của
 * Tập 5): ngắt vì NỘI DUNG chứ không vì tìm từ (T5 N2), cấu trúc phức tự nhiên — câu chẻ, đảo ngữ điều kiện "Had I…", so sánh
 * kép "the more… the higher…", ellipsis; idiom dùng MỘT lần, đúng chỗ. Phân tích FC · LR · GRA · P bằng tiếng Việt; phiên âm
 * theo Anh–Anh, chỉ nêu trọng âm của những từ thông dụng. Mổ đề này: Tập 5 Ngày 10.
 */
import type { DeNoi } from './types';

export const NOI_DE9: DeNoi = {
  id: 'noi-de9',
  kyNang: 'noi',
  ten: 'Speaking — Đề 9 (Tập 5 · Ngày 8)',
  boDe: 'Đề 9',
  capDo: 'Band 7.0 → 7.5',
  moTa: 'Part 1: photography · celebrations · Part 2: a time when you persuaded someone to look at a decision differently · Part 3: changing opinions, persuasion and public debate',
  phut: 14,
  part1: [
    {
      chuDe: 'Photography',
      cau: [
        'Do you take a lot of photographs?',
        'Do you prefer taking photographs of people or of places?',
        'Why do you think some people rarely look at the photographs they have taken?',
      ],
    },
    {
      chuDe: 'Celebrations',
      cau: [
        'What do people in your country usually celebrate?',
        'How do you usually celebrate good news of your own?',
        'Do you think celebrations are becoming more or less important in people\'s lives?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a time when you persuaded someone to look at a decision differently.\n\nYou should say:\n• who the person was\n• what they had decided to do\n• what you said to them\n\nand explain why your words made a difference.',
    goiY: [
      'Bạn có 1 phút chuẩn bị. Đề tình huống + trừu tượng ⇒ chọn MỘT quyết định cụ thể của một người cụ thể, có hai phương án rõ (chọn nơi thực tập, chọn ngành, mua xe hay không, một cách làm trong nhóm…) chứ đừng chọn "quan điểm về cuộc sống". Ghi 4 từ khoá cho 4 ý: WHO · DECIDED · SAID · WHY.',
      'Ý 2 phải làm người nghe TIN người kia đã quyết rất chắc: nêu lý lẽ của họ bằng giọng chắc chắn ("To her mind it was obvious…", "She was absolutely set on…"). Thuyết phục chỉ đáng kể khi điểm xuất phát rõ — và thuật lý lẽ của họ cho tử tế, đừng biến họ thành người ngốc.',
      'Ý 3 là "cảnh" của bài: dựng lại lời bạn đã nói, tốt nhất là MỘT câu trích trực tiếp + một ví dụ bạn kể. Thì: quá khứ đơn cho cuộc nói chuyện; quá khứ hoàn thành cho điều xảy ra trước đó ("I\'d spent the whole summer…"); tường thuật gián tiếp xen trực tiếp.',
      'Ý "why your words made a difference" nói DÀI NHẤT và nói về CƠ CHẾ, không chỉ "because I was right": bạn đổi CÂU HỎI, đưa bằng chứng họ chưa có, hay để họ tự quyết? Kết bằng kết quả + một đảo ngữ điều kiện (Tập 4 Ngày 7, Tập 5 Ngày 13): "Had I simply told her she was wrong, I doubt she\'d have…".',
      'Một cụm văn nói đúng register, dùng MỘT lần (Tập 5 Ngày 3): "talk someone out of…", "back someone up", "her reasoning fell apart", "hold out for…". Câu khép là một nhận xét khái quát về chính bạn hoặc về cách người ta đổi ý — không kết bằng "That\'s all".',
    ],
    cauChot: [
      'Do you find it easy to persuade other people?',
      'Did that person ever tell you what they thought of your advice?',
    ],
  },
  part3: [
    {
      chuDe: 'Changing opinions',
      cau: [
        'How do people in your country usually react when someone disagrees with them in public?',
        'Why do some people find it so hard to admit that they were wrong?',
        'To what extent should politicians be criticised for changing their position on an issue?',
      ],
    },
    {
      chuDe: 'Persuasion and public debate',
      cau: [
        'What would happen if social media showed people only opinions that were different from their own?',
        'Do you think it will become easier or harder to change people\'s minds in the future?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Why do you think some people rarely look at the photographs they have taken?',
      band: 'Band 8.0–8.5',
      s: 'I think it\'s partly because taking them costs nothing now. When my parents had a film camera, every shot was a decision, so the photos that came back were few enough to put in an album and actually look at. Whereas I\'ve got something like twenty thousand on my phone, most of them near-identical, and the thought of going through them is frankly exhausting. I also suspect that, for a lot of us, the point isn\'t really the picture any more — it\'s the act of taking it, a way of telling yourself you were there. So the photo\'s done its job the moment you\'ve pressed the button.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: câu hỏi "vì sao" ở Part 1 ⇒ trả lời bằng HAI lý do có quan hệ với nhau (chụp không tốn gì ⇒ quá nhiều ảnh; mục đích đã chuyển từ tấm ảnh sang hành động chụp), mỗi lý do có một hình ảnh cụ thể (máy phim của bố mẹ, hai mươi nghìn ảnh trong điện thoại), khép bằng một câu đúc kết. Khoảng 35–40 giây; chỗ ngừng duy nhất là ngừng để NGHĨ ý (trước "I also suspect"), không phải để tìm từ — đúng mô tả band 8 (Tập 5 Ngày 2).',
        '**LR (từ vựng)**: "every shot was a decision", "few enough to put in an album", "near-identical", "going through them", "frankly exhausting", "the act of taking it", "done its job". Không có từ hiếm phô trương; cái đắt là sự CHÍNH XÁC và cách nói cô đọng. Hedging tự nhiên: "partly because", "something like", "I also suspect", "for a lot of us".',
        '**GRA (ngữ pháp)**: quá khứ – hiện tại đối chiếu "When my parents had… every shot was… Whereas I\'ve got…"; "few enough to + V"; danh động từ làm chủ ngữ "taking them costs nothing"; cấu trúc nhấn "the point isn\'t really the picture any more — it\'s the act of taking it"; hiện tại hoàn thành với "the moment" ("the photo\'s done its job the moment you\'ve pressed the button").',
        '**P (phát âm)**: nhấn tương phản "my PARents had a FILM camera… whereas I\'VE got…"; "photograph" /ˈfəʊtəɡrɑːf/ nhấn âm đầu nhưng "photography" /fəˈtɒɡrəfi/ nhấn âm hai — đừng lẫn; "identical" /aɪˈdentɪkl/ âm hai; "exhausting" /ɪɡˈzɔːstɪŋ/ (h câm); nối âm "put‿in‿an‿album", "look‿at"; hạ giọng ở câu đúc kết cuối.',
        '**Muốn chắc band 8.5**: thêm nửa câu tự giễu ("which is a slightly depressing thought, now I say it out loud") — giám khảo band 8 nghe được thái độ của người nói qua ngữ điệu, không chỉ nội dung (Tập 5 Ngày 6).',
      ],
    },
    {
      part: 2,
      cau: 'Describe a time when you persuaded someone to look at a decision differently.',
      band: 'Band 8.0–8.5',
      s: 'I\'d like to talk about the time I talked my younger cousin out of a decision about her internship. This was about a year ago, when she was in her third year at university and I\'d been working as a developer for a couple of years.\n\nShe was absolutely set on getting into one of the big technology companies. To her mind it was obvious: a famous name on your CV opens doors, and anything else was second best. So when a small firm of about fifteen people offered her a place, she\'d more or less decided to turn it down and keep waiting.\n\nWe were having coffee, and I could tell she expected me to back her up and tell her to hold out for the big name. Instead, I asked her a question she couldn\'t answer: "In three months, what do you actually want to be able to do that you can\'t do now?" Then I told her that in my own internship, at a large company, I\'d spent the whole summer fixing the wording on one settings page, whereas a friend of mine at a tiny start-up had been handed a real feature in the second week, simply because there was nobody else to do it.\n\nI think what made the difference was that I never told her what to choose. I didn\'t argue with her answer at all; I just shifted the question, from "which looks better?" to "where will I learn more?" — and once she looked at it that way, her original reasoning fell apart rather quickly. As she put it herself a few days later, she\'d been choosing a logo, not a job.\n\nSo she took the small firm. It was chaotic, by her own account, but by the end she\'d shipped something that real customers used, and she\'d made every mistake there was to make. Had I simply told her she was wrong, I doubt she\'d have listened at all. And I suppose the broader lesson for me was that people change their minds far more readily when you ask them a good question than when you give them a good answer.',
      phanTich: [
        '**FC**: đủ 4 ý đúng thứ tự thẻ (là ai → định làm gì → mình nói gì → vì sao lời đó có tác dụng) và có DIỄN BIẾN: lập trường của cô em nói rất chắc → cuộc cà phê → câu hỏi cô không trả lời được → ví dụ mình kể → cơ chế → kết quả → bài học. Chuyển ý bằng mốc tự nhiên, không đánh số: "This was about a year ago…", "We were having coffee…", "Instead, …", "I think what made the difference was…", "So she took the small firm." Khoảng 2 phút ở tốc độ nói tự nhiên; câu cuối khép bài bằng một nhận xét khái quát.',
        '**LR**: "talked my younger cousin out of", "absolutely set on", "opens doors", "second best", "turn it down", "back her up", "hold out for the big name" (cố chờ), "been handed a real feature", "shifted the question", "her original reasoning fell apart", "choosing a logo, not a job" (hình ảnh riêng — không phải thành ngữ học thuộc), "shipped something", "far more readily". Từ band 8 = từ ĐÚNG và có màu sắc cá nhân.',
        '**GRA**: quá khứ hoàn thành đặt nền "I\'d been working…", "she\'d more or less decided…", "I\'d spent the whole summer fixing…", "had been handed" (bị động QKHT); mệnh đề quan hệ rút gọn "a question she couldn\'t answer"; câu chẻ "what made the difference was that I never told her what to choose"; đối lập "whereas"; tường thuật "As she put it herself, she\'d been choosing…"; ĐẢO NGỮ điều kiện loại 3 "Had I simply told her she was wrong, I doubt she\'d have listened at all"; so sánh song song "when you ask them a good question than when you give them a good answer".',
        '**P**: câu trích (câu hỏi mình đặt cho cô em) nói chậm lại, tách hai nhịp và lên giọng nhẹ ở "ACtually": "In three months, / what do you ACtually want to be able to do / that you CAN\'T do now?"; nhấn tương phản "which LOOKS better… where will I LEARN more", "a LOgo, not a JOB", "a good QUEStion… a good ANswer"; trọng âm "internship" /ˈɪntɜːnʃɪp/ âm đầu, "technology" /tekˈnɒlədʒi/ âm hai, "developer" /dɪˈveləpə/ âm hai, "chaotic" /keɪˈɒtɪk/ (ch = /k/); -ed: "offered" /d/, "decided" /ɪd/, "shipped" /t/.',
        '**Muốn chắc band 8.5–9**: thêm MỘT chi tiết cảm quan của khoảnh khắc cô em không trả lời được (cốc cà phê nguội đi trong lúc cô ngồi im) và hạ tốc độ ở hai câu then chốt — ở band 9, khoảng lặng trước "she\'d been choosing a logo, not a job" cũng là một phần của câu trả lời (Tập 5 Ngày 13 "pause mang nghĩa"). Lưu ý: đừng kể thành chuyện "mình đúng, người kia sai" — người nghe tin câu chuyện thuyết phục hơn khi bạn thuật lý lẽ của người kia cho tử tế.',
      ],
    },
    {
      part: 3,
      cau: 'Why do some people find it so hard to admit that they were wrong?',
      band: 'Band 8.0–8.5',
      s: 'I think the main reason is that we tend to treat our opinions as part of who we are, rather than as conclusions we happen to have reached. So when someone shows that the opinion\'s mistaken, it doesn\'t feel like being corrected on a fact; it feels like a small attack on your character, and the natural response is to defend yourself. There\'s also the social side of it. If you\'ve argued for something loudly, in front of colleagues, say, backing down means losing face, and the more publicly you\'ve committed yourself, the higher that price is. Oddly enough, I\'d say it\'s often the most knowledgeable people who struggle most, because they\'re so used to being right. Not that it\'s impossible, of course — it just seems to be much easier in private, when nobody\'s keeping score.',
      phanTich: [
        '**FC**: câu hỏi nguyên nhân ⇒ hai nguyên nhân ở hai tầng (tâm lý cá nhân: ý kiến = bản sắc; xã hội: mất mặt), mỗi nguyên nhân có CƠ CHẾ chứ không chỉ gọi tên, rồi một nhận xét ngược trực giác ("Oddly enough… the most knowledgeable people"), cuối cùng một giới hạn ("Not that it\'s impossible…"). Lập luận chuỗi, không lặp câu hỏi, không "Firstly / Secondly".',
        '**LR**: "treat our opinions as part of who we are", "conclusions we happen to have reached", "being corrected on a fact", "an attack on your character", "backing down" (lùi bước), "losing face", "committed yourself", "that price", "keeping score" (ghi điểm hơn thua). "losing face" dùng đúng một lần, đúng ngữ cảnh — idiom khéo là idiom người nghe không nhận ra là idiom (Tập 5 Ngày 11).',
        '**GRA**: "rather than as + N + mệnh đề quan hệ rút gọn"; bị động danh động từ "being corrected"; so sánh kép "the more publicly you\'ve committed yourself, the higher that price is"; câu chẻ "it\'s often the most knowledgeable people who struggle most"; "be used to + V-ing"; ellipsis văn nói "Not that it\'s impossible, of course"; mệnh đề thời gian "when nobody\'s keeping score".',
        '**P**: ngắt nhóm ý quanh dấu chấm phẩy: "it DOESN\'T feel like being corrected on a FACT; / it feels like a small attack on your CHAracter"; trọng âm "conclusions" /kənˈkluːʒnz/ âm hai, "character" /ˈkærəktə/ âm đầu (ch = /k/), "colleagues" /ˈkɒliːɡz/ âm đầu, "knowledgeable" /ˈnɒlɪdʒəbl/ âm đầu (k câm), "publicly" /ˈpʌblɪkli/ (KHÔNG phải "publically"); lên giọng nhẹ ở "say," rồi nói tiếp.',
        '**Muốn chắc band 8.5–9**: thêm một nhượng bộ ngắn về khác biệt văn hoá hoặc thế hệ có hedging ("I wouldn\'t want to generalise, but in more hierarchical workplaces the cost of backing down is probably higher still").',
      ],
    },
    {
      part: 3,
      cau: 'To what extent should politicians be criticised for changing their position on an issue?',
      band: 'Band 8.0–8.5',
      s: 'Far less than they usually are, in my view, although it does depend on what prompted the change. If the evidence has moved on — the economic situation\'s different, or a policy plainly hasn\'t worked — then changing course is exactly what we\'d want from anyone in a responsible position, and it\'s rather perverse that we call it weakness. What does deserve criticism, I think, is a change that follows the opinion polls rather than the facts, where the politician\'s said one thing to get elected and another to stay popular. The difficulty is that from the outside the two can look identical. So perhaps the fair test is whether they\'re willing to explain the change: someone who says "I was wrong, and here\'s what I\'ve learnt" has earned a hearing, whereas someone who simply pretends they never held the earlier view hasn\'t.',
      phanTich: [
        '**FC**: câu hỏi mức độ "To what extent…?" ⇒ câu đầu nêu MỨC ĐỘ ngay ("Far less than they usually are") kèm điều kiện ("it does depend on what prompted the change") → tách HAI trường hợp theo một tiêu chí (đổi vì bằng chứng ↔ đổi vì thăm dò dư luận) → thừa nhận chỗ khó ("from the outside the two can look identical") → đề xuất một "phép thử". Đây là khuôn phản biện – nhượng bộ – kết luận của Tập 5 Ngày 6.',
        '**LR**: "what prompted the change", "the evidence has moved on", "changing course", "rather perverse" (khá ngược đời), "follows the opinion polls", "to stay popular", "the fair test", "has earned a hearing" (xứng đáng được lắng nghe), "held the earlier view". Từ vựng chính trị vừa đủ, không lạm dụng thuật ngữ; hedging: "in my view", "I think", "perhaps".',
        '**GRA**: so sánh rút gọn mở câu "Far less than they usually are"; nhấn bằng trợ động từ "it does depend", "What does deserve criticism… is…" (câu chẻ + do nhấn mạnh — Tập 5 Ngày 13); điều kiện với chêm giải thích giữa hai gạch ngang; mệnh đề quan hệ "where the politician\'s said one thing… and another…"; mệnh đề danh ngữ "whether they\'re willing to explain"; ellipsis cuối câu "…the earlier view hasn\'t [earned a hearing]".',
        '**P**: nhấn trợ động từ để tạo tương phản: "it DOES depend", "What DOES deserve criticism"; cặp đối "the POLLS rather than the FACTS", "one thing to get eLECted and another to stay POPular"; trọng âm "politicians" /ˌpɒləˈtɪʃnz/ âm ba, "criticised" /ˈkrɪtɪsaɪzd/ âm đầu, "perverse" /pəˈvɜːs/ âm hai, "identical" /aɪˈdentɪkl/ âm hai; câu trích "I was WRONG, / and here\'s what I\'ve LEARNT" nói chậm, hạ giọng.',
        '**Muốn chắc band 8.5–9**: thêm một ví dụ khái quát không nêu tên ("a government that reverses a tax it introduced a year earlier") và một câu về trách nhiệm của cử tri / báo chí ("part of the blame lies with us, since we punish honesty about mistakes more than the mistakes themselves").',
      ],
    },
  ],
};
