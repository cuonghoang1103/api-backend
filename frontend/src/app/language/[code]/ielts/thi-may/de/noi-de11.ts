/**
 * Đề 11 — Speaking, Tập 5 · Ngày 24 (docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 24/11/2026.
 * Part 1: Numbers + Clothes (Part 1 band 8 tự nhiên, idiom khéo — T5 N3) — 6 câu · Part 2: Describe an achievement — thẻ "một thành
 * tựu bạn từng nghĩ mình không làm nổi" (Part 2 band 8 chi tiết cảm quan — T5 N7; đề hiếm — N14; KHÔNG trùng thẻ Đề 4 "a skill that
 * took you a long time to learn", Đề 5 "a positive change", Đề 9 "a time when you persuaded someone to look at a decision differently") · Part 3: 5 câu khó dần fact → nguyên
 * nhân "Why do some…?" → đánh giá mức độ "To what extent…?" → giả định "What would happen if…?" → dự đoán "Do you think… in the
 * future?" (Part 3 band 8 phản biện, nhượng bộ, hedging — T5 N6; trừu tượng cấp cao — N13; phản biện giám khảo khéo — N23).
 * Khó hơn Đề 8 một bậc: Part 1 có câu so sánh thế hệ và câu suy luận; Part 3 đòi lập luận chuỗi có nhượng bộ và tự giới hạn phạm vi.
 * `mau`: câu trả lời mẫu band 8.0–8.5 — ngắt vì NỘI DUNG chứ không vì tìm từ (T5 N2), cấu trúc phức tự nhiên + ellipsis (N11), ba
 * cấu trúc hiếm dùng đúng chỗ (đảo ngữ, câu chẻ, điều kiện hỗn hợp — N21), idiom thưa (N11, N18); phân tích FC · LR · GRA · P bằng
 * tiếng Việt. Phiên âm theo Anh–Anh; chỉ nêu trọng âm của những từ thông dụng. Câu chuyện Part 2 (buổi nói chuyện kỹ thuật bằng
 * tiếng Anh) là HƯ CẤU, dựng cho người học là sinh viên IT.
 */
import type { DeNoi } from './types';

export const NOI_DE11: DeNoi = {
  id: 'noi-de11',
  kyNang: 'noi',
  ten: 'Speaking — Đề 11 (Tập 5 · Ngày 24)',
  boDe: 'Đề 11',
  capDo: 'Band 8.0',
  moTa: 'Part 1: numbers · clothes · Part 2: an achievement you did not think you were capable of · Part 3: recognising achievement, success and society',
  phut: 14,
  part1: [
    {
      chuDe: 'Numbers',
      cau: [
        'Are you good at remembering numbers, such as phone numbers or dates?',
        'Do you have a number that is special to you in some way?',
        'Do you think people need to be as good with numbers today as their parents were?',
      ],
    },
    {
      chuDe: 'Clothes',
      cau: [
        'How much attention do you pay to what you wear?',
        'Have your tastes in clothes changed since you were a teenager?',
        'Do you think you can tell much about a person from their clothes?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe an achievement that you did not think you were capable of.\n\nYou should say:\n• what you achieved\n• why you doubted that you could do it\n• what you did in order to succeed\n\nand explain how this achievement changed the way you see yourself.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — chọn MỘT thành tựu CỤ THỂ, có ngày giờ, có người chứng kiến (một buổi thuyết trình, một cuộc chạy, một sản phẩm chạy được), đừng chọn thứ kéo dài mơ hồ ("I improved my English"). Ghi 4 từ khoá cho 4 ý + MỘT chi tiết giác quan (Tập 5 Ngày 7): bạn thấy / nghe / cảm gì ngay TRƯỚC lúc bắt đầu.',
      'Ý "why you doubted" phải có LÝ DO THẬT, kể bằng một cảnh nhỏ trong quá khứ (quá khứ hoàn thành: "I\'d once frozen in front of…"), không chỉ "I was not confident". Sự nghi ngờ càng cụ thể thì thành tựu càng có sức nặng.',
      'Ý "what you did" = quá trình có 2–3 bước và MỘT trở ngại giữa chừng. Thì: quá khứ đơn cho chuỗi việc; "would" cho việc lặp lại ("I\'d record myself… and I\'d wince"); quá khứ tiếp diễn cho bối cảnh.',
      'Ý "how it changed the way you see yourself" nói DÀI NHẤT và trừu tượng nhất — đây là chỗ lấy band 8: một câu chẻ ("What it changed wasn\'t my English so much as…"), một điều kiện hỗn hợp ("If I hadn\'t…, I\'d still be…"), kết bằng một nhận xét về bản thân có hedging ("I suspect…").',
      'Idiom dùng MỘT lần, đúng register nói (Tập 5 Ngày 11): "my mind went blank", "it was a weight off my shoulders", "out of my depth". Ngắt giọng ở chỗ CHUYỂN Ý, không ngắt giữa cụm để tìm từ (Ngày 2) — thà nói chậm một nhịp ở đầu ý mới.',
    ],
    cauChot: [
      'Do the people close to you know about this achievement?',
      'Would you set yourself a similar challenge again?',
    ],
  },
  part3: [
    {
      chuDe: 'Recognising achievement',
      cau: [
        'What kinds of achievement are most admired in your country?',
        'Why do some people play down their own achievements?',
        'To what extent should schools reward effort rather than results?',
      ],
    },
    {
      chuDe: 'Success and society',
      cau: [
        'What would happen if schools and companies stopped ranking people altogether?',
        'Do you think the way society defines success will change in the future?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Do you have a number that is special to you in some way?',
      band: 'Band 8.0–8.5',
      s: 'I wouldn\'t call myself superstitious, but I do have a soft spot for seventeen. It was the number on my shirt when I played football at school — not because I chose it; it was simply the only one left in my size — and somehow it stuck. I still catch myself picking seat seventeen on a bus or setting an alarm for six seventeen rather than quarter past, which makes no sense whatsoever. I think that\'s the point, really. It doesn\'t bring me luck or anything like that; it\'s just a small private joke between me and my younger self.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: phủ nhận nhẹ rồi trả lời thẳng ("I wouldn\'t call myself superstitious, but I do have…"), kể NGUỒN GỐC bằng một chi tiết thật thà (số duy nhất còn vừa cỡ), cho hai ví dụ hiện tại, rồi tự bình luận ("which makes no sense whatsoever… I think that\'s the point, really"). Khoảng 30–35 giây; chỗ ngắt duy nhất nằm ở dấu gạch — tức ngắt vì chèn Ý, không vì tìm từ (Tập 5 Ngày 2).',
        '**LR (từ vựng)**: "have a soft spot for" (có cảm tình đặc biệt với — idiom duy nhất, đúng register), "somehow it stuck", "catch myself + V-ing", "makes no sense whatsoever", "a small private joke between me and my younger self". Band 8 ở Part 1 = từ thường dùng CHÍNH XÁC và có màu, không phải từ học thuật (Ngày 3).',
        '**GRA (ngữ pháp)**: "do" nhấn mạnh ("I do have a soft spot"); "not because… ; it was simply…"; "the only one left in my size" (mệnh đề quan hệ rút gọn); "catch myself picking… or setting…" (song song — Ngày 9); mệnh đề quan hệ bình luận cả câu ", which makes no sense whatsoever"; ellipsis văn nói "or anything like that" (Ngày 11).',
        '**P (phát âm)**: trọng âm "superstitious" /ˌsuːpəˈstɪʃəs/ âm ba; "seventeen" nhấn âm CUỐI khi đứng một mình (/ˌsevnˈtiːn/) nhưng chuyển về âm đầu trước danh từ ("SEVenteen people") — đừng để nghe thành "seventy"; nhấn tương phản "six SEVenteen rather than QUARter past"; nối âm "soft‿spot", "left‿in"; hạ giọng ở phần chèn giữa hai gạch.',
        '**Vì sao là band 8 chứ không phải 7**: câu trả lời có GIỌNG riêng (tự giễu nhẹ), không có câu nào "an toàn" kiểu "Yes, my special number is seven because it is lucky". Muốn lên 9: thêm một nhịp phản xạ với giám khảo ("Odd question to be asked, actually — nobody ever has").',
      ],
    },
    {
      part: 2,
      cau: 'Describe an achievement that you did not think you were capable of.',
      band: 'Band 8.0–8.5',
      s: 'I\'d like to talk about the first time I gave a technical talk in English, which, a couple of years ago, I\'d have told you was simply beyond me.\n\nIt was at a monthly meet-up for software developers in my city. About sixty people, twenty minutes, and a question-and-answer session at the end. A friend who helps to organise it had more or less put my name down without asking, because I\'d fixed a rather nasty bug in an open-source library and he thought people would want to hear how.\n\nMy doubts weren\'t really about the content. They went back to school. I\'d once frozen completely in front of my class during an English presentation — my mind went blank, and I stood there for what felt like a full minute, listening to the ceiling fan. Ever since, I\'d taken it for granted that I was someone who could write English but not speak it in public.\n\nSo I prepared in a way I never had before. I wrote the talk out, then threw the script away and reduced it to six words on a card, one for each section. Every evening for three weeks I\'d record myself on my phone, and I\'d wince at the playback and do it again. The hardest part was the questions, because you can\'t rehearse those, so I asked two colleagues to interrupt me with the most awkward ones they could think of.\n\nOn the night itself, my hands were actually shaking when I plugged in my laptop. But about two minutes in, somebody laughed at a joke I\'d almost cut, and after that it felt strangely like a conversation.\n\nWhat it changed wasn\'t my English so much as the story I tell about myself. I\'d always treated that moment at school as evidence of what I was like. Now I see it as evidence of what happens when you don\'t prepare. If my friend hadn\'t put my name down, I suspect I\'d still be telling people that I\'m just not a public speaker.',
      phanTich: [
        '**FC**: đủ 4 ý theo thứ tự thẻ, mỗi ý một đoạn có câu mở rõ ("My doubts weren\'t really about the content.", "So I prepared in a way I never had before.", "What it changed wasn\'t…"). Câu chuyện có DIỄN BIẾN và điểm xoay (tiếng cười ở phút thứ hai). Chi tiết giác quan (Tập 5 Ngày 7): tiếng quạt trần lúc đứng hình, bàn tay run khi cắm máy. Khoảng 2 phút; không có câu đệm kiểu "That\'s all I want to say".',
        '**LR**: "simply beyond me" (quá sức tôi), "put my name down", "a rather nasty bug", "frozen completely", "my mind went blank" (idiom duy nhất — Ngày 11), "taken it for granted that", "threw the script away", "wince at the playback", "the most awkward ones they could think of", "the story I tell about myself". Từ chuyên ngành dùng tự nhiên, không giải thích dài: "open-source library", "question-and-answer session".',
        '**GRA**: quá khứ hoàn thành cho nền ("I\'d fixed…", "I\'d once frozen…", "a joke I\'d almost cut"); "would" cho việc lặp lại ("I\'d record myself… and I\'d wince… and do it again"); "I\'d have told you" (giả định về quá khứ); câu chẻ đối lập "What it changed wasn\'t my English so much as the story…" (Ngày 21); ellipsis "in a way I never had [prepared] before" (Ngày 11); điều kiện HỖN HỢP "If my friend hadn\'t put my name down, I suspect I\'d still be telling people…"; cụm danh từ rời làm bối cảnh "About sixty people, twenty minutes, and a question-and-answer session at the end."',
        '**P**: ngắt nhóm ý theo nội dung ("About sixty people, / twenty minutes, / and a question-and-answer session at the end."); nhấn tương phản "could WRITE English but not SPEAK it", "evidence of what I was LIKE… evidence of what happens when you don\'t prePARE"; trọng âm "technical" /ˈteknɪkl/ âm đầu, "developers" /dɪˈveləpəz/ âm hai, "rehearse" /rɪˈhɜːs/ âm hai, "colleagues" /ˈkɒliːɡz/ âm đầu, "evidence" /ˈevɪdəns/ âm đầu; -ed: "fixed" /t/, "prepared" /d/, "laughed" /t/; chậm lại và hạ giọng ở câu "my mind went blank".',
        '**Vì sao là band 8 chứ không phải 7**: phần "changed the way you see yourself" không dừng ở "I became more confident" mà nêu được một THAY ĐỔI CÁCH DIỄN GIẢI (cùng một ký ức, hai cách đọc). Muốn lên 9: thêm một câu khái quát có hedging nối sang Part 3 ("I suspect a lot of what we call lack of talent is really lack of rehearsal").',
      ],
    },
    {
      part: 3,
      cau: 'Why do some people play down their own achievements?',
      band: 'Band 8.0–8.5',
      s: 'I think there are a couple of quite different things going on. In some cases it\'s cultural. In Vietnam, and I imagine in much of East Asia, you\'re brought up to believe that talking about your own success is in poor taste, so even people who are privately very proud will say "oh, I was just lucky". That\'s not really modesty; it\'s manners. But there\'s another kind which is more genuine, and more troubling, where people honestly can\'t see what they\'ve done as an achievement at all. Rarely do they compare themselves with where they started; they compare themselves with the best person in the room, and by that standard nothing ever counts. And then, to be fair, there\'s a third, more calculating reason: if you lower expectations, nobody can accuse you of arrogance, and nobody\'s disappointed next time. So what looks like the same behaviour can come from politeness, insecurity or strategy, and I suspect it\'s often a mixture of all three.',
      phanTich: [
        '**FC**: mở bằng câu báo cấu trúc ("a couple of quite different things going on") rồi tách BA nguyên nhân có nhãn rõ: văn hoá → tâm lý → tính toán; mỗi cái có cơ chế, cái đầu có ví dụ lời nói thật. Câu cuối tổng hợp bằng ba danh từ ("politeness, insecurity or strategy") và một hedging. Lập luận chuỗi có phân loại — đúng yêu cầu Part 3 band 8 (Tập 5 Ngày 6, Ngày 13).',
        '**LR**: "play down", "in poor taste" (kém tế nhị), "privately very proud", "That\'s not really modesty; it\'s manners" (đối lập hai danh từ gần nghĩa — sắc thái, Ngày 6), "more troubling", "by that standard nothing ever counts", "a more calculating reason", "lower expectations", "accuse you of arrogance". Không có từ hiếm vô nghĩa; mỗi từ trừu tượng đều gánh một ý.',
        '**GRA**: bị động "you\'re brought up to believe that…"; chủ ngữ V-ing "talking about your own success is in poor taste"; mệnh đề quan hệ "where people honestly can\'t see what they\'ve done as…"; ĐẢO NGỮ dùng đúng một lần, đúng chỗ nhấn: "Rarely do they compare themselves with where they started" (Ngày 21); điều kiện loại 1 khái quát "if you lower expectations, nobody can accuse you…"; mệnh đề danh ngữ làm chủ ngữ "what looks like the same behaviour can come from…".',
        '**P**: nhấn tương phản "That\'s not really MODesty; / it\'s MANners"; ngữ điệu liệt kê đi lên – lên – xuống ở "politeness, / insecurity / or strategy"; trọng âm "achievement" /əˈtʃiːvmənt/ âm hai, "cultural" /ˈkʌltʃərəl/ âm đầu, "calculating" /ˈkælkjuleɪtɪŋ/ âm đầu, "arrogance" /ˈærəɡəns/ âm đầu, "insecurity" /ˌɪnsɪˈkjʊərəti/ âm ba; đổi giọng khi trích lời ("oh, I was just lucky") — nhẹ và nhanh hơn.',
        '**Vì sao là band 8 chứ không phải 7**: band 7 thường cho MỘT nguyên nhân rồi lặp lại bằng từ khác; ở đây ba nguyên nhân khác LOẠI và người nói tự đánh giá ("to be fair", "more genuine, and more troubling"). Muốn lên 9: phản biện nhẹ chính câu hỏi ("though I\'d question whether it\'s always a problem — a little understatement makes people easier to work with").',
      ],
    },
    {
      part: 3,
      cau: 'What would happen if schools and companies stopped ranking people altogether?',
      band: 'Band 8.0–8.5',
      s: 'My first instinct is to say it would be a relief, but I\'m not sure it would last. In the short term, I think you\'d see less anxiety, particularly among teenagers, and probably more willingness to try things you might be bad at, because failing wouldn\'t be recorded anywhere. That would be a real gain. The trouble is that the demand for rankings doesn\'t come only from institutions; it comes from the people who have to choose. A university with five thousand applicants for two hundred places still has to pick somehow, and if there were no grades to go on, I suspect it would fall back on things that are even less fair, such as which school you went to or who your parents know. So, paradoxically, abolishing rankings might end up favouring the well connected. What I\'d rather see is fewer rankings and better ones: assessment that tells you what you can do, not merely where you stand in a queue.',
      phanTich: [
        '**FC**: câu giả định (What would happen if…?) ⇒ mở bằng phản ứng đầu tiên rồi tự nghi ngờ ("but I\'m not sure it would last") — báo trước cấu trúc hai pha: ngắn hạn (lợi) → "The trouble is…" (cơ chế phản tác dụng, có ví dụ số tròn) → nghịch lý ("So, paradoxically…") → đề xuất của mình ("What I\'d rather see is…"). Nhượng bộ thật ("That would be a real gain") trước khi phản biện — Tập 5 Ngày 6, Ngày 23.',
        '**LR**: "My first instinct", "it would be a relief", "willingness to try things you might be bad at", "the demand for rankings", "fall back on" (đành dựa vào), "who your parents know", "paradoxically", "favouring the well connected", "where you stand in a queue" (ẩn dụ gọn cho thứ hạng). Hedging đa dạng: "I\'m not sure", "probably", "I suspect", "might end up".',
        '**GRA**: điều kiện loại 2 xuyên suốt ("it would be… you\'d see… wouldn\'t be recorded"); "if there were no grades to go on" (were + nguyên mẫu sau danh từ); câu chẻ "What I\'d rather see is fewer rankings and better ones"; cấu trúc "not only… ; it comes from…" tách bằng chấm phẩy; "would rather + V"; mệnh đề quan hệ "assessment that tells you what you can do, not merely where you stand" (hai mệnh đề danh ngữ song song — Ngày 9).',
        '**P**: nhấn từ mang lập luận: "it comes from the people who have to CHOOSE", "even LESS fair", "FEWer rankings and BETter ones"; ngắt trước và sau trạng từ bình luận ("So, / paradoxically, / abolishing rankings…"); trọng âm "paradoxically" /ˌpærəˈdɒksɪkli/ âm ba, "anxiety" /æŋˈzaɪəti/ âm hai, "applicants" /ˈæplɪkənts/ âm đầu, "assessment" /əˈsesmənt/ âm hai; âm yếu "would" → /wəd/, "it\'d".',
        '**Vì sao là band 8 chứ không phải 7**: người nói không chọn phe (tốt / xấu) mà theo HỆ QUẢ tới bước thứ hai (bỏ xếp hạng ⇒ phải chọn bằng thứ khác ⇒ bất công hơn) rồi mới nêu quan điểm. Muốn lên 9: thêm một câu tự giới hạn phạm vi ("I\'m thinking mainly of education here; in sport, of course, ranking is the whole point").',
      ],
    },
  ],
};
