/**
 * Đề 6 — Speaking (đầu Tập 4, band 6.0 → 7.5; docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 12/11/2026.
 * Ghép với `nghe-01` · `doc-01` · `viet-01` thành bộ `bo-06`.
 * Part 1: Art + Neighbours (6 câu) · Part 2: Describe an important decision you made (cue card 4 ý) · Part 3: 5 câu khó dần
 * fact → opinion → evaluate → compare (xưa/nay) → hypothesise về việc ra quyết định.
 * `mau`: câu trả lời mẫu band 7–7.5 + phân tích FC · LR · GRA · P bằng tiếng Việt — người học chỉ xem SAU khi thi.
 */
import type { DeNoi } from './types';

export const NOI_06: DeNoi = {
  id: 'noi-06',
  kyNang: 'noi',
  ten: 'Speaking — Test 1',
  boDe: 'Đề 6',
  capDo: 'Band 6 → 7.5',
  moTa: 'Part 1: art · neighbours · Part 2: an important decision you made · Part 3: how people make decisions, advice, choice and technology',
  phut: 13,
  part1: [
    {
      chuDe: 'Art',
      cau: [
        'Did you enjoy art lessons when you were at school?',
        'Do you ever visit art galleries or exhibitions? Why or why not?',
        'What kind of pictures or paintings would you like to have in your home?',
      ],
    },
    {
      chuDe: 'Neighbours',
      cau: [
        'How well do you know the people who live near you?',
        'What do you think makes someone a good neighbour?',
        'Have you ever had a problem with a neighbour?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe an important decision you made.\n\nYou should say:\n• what the decision was\n• when you made it\n• how you made the decision\n\nand explain why it was an important decision for you.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — ghi 4 từ khoá cho 4 ý trên thẻ (what · when · how · why), không viết câu.',
      'Chọn MỘT quyết định có "trước" và "sau" rõ ràng (chọn ngành, đổi việc, chuyển nhà, bỏ một thói quen, từ chối một lời mời) — để có chuyện mà kể chứ không chỉ nêu tên quyết định.',
      'Ý "how" là chỗ ghi điểm: bạn đã cân nhắc những gì, hỏi ai, do dự bao lâu, điều gì khiến bạn chốt. Dùng ngôn ngữ cân nhắc: "I was torn between…", "what tipped the balance was…", "I weighed up…".',
      'Thì: quá khứ đơn + quá khứ hoàn thành cho bối cảnh ("I\'d been working there for two years"); kết bằng hiện tại hoàn thành / điều kiện loại 3 ("If I hadn\'t…, I wouldn\'t…") để nói kết quả đến nay.',
      'Nói đủ 2 phút: mở 1 câu → what + when (20″) → how (50″) → why (40″) → một câu nhìn lại.',
    ],
    cauChot: [
      'Do you think you made the right decision?',
      'Did anyone disagree with your decision at the time?',
    ],
  },
  part3: [
    {
      chuDe: 'Making personal decisions',
      cau: [
        'What important decisions do young people in your country usually have to make?',
        'Is it better to make important decisions alone or to ask other people for advice?',
        'Some people say that having too many choices makes it harder to decide. Do you agree?',
      ],
    },
    {
      chuDe: 'Decisions, information and technology',
      cau: [
        'How is the way people make decisions today different from the past, now that so much information is available online?',
        'If more of the important decisions in companies were made by computer programs rather than by people, what effects might that have?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'What do you think makes someone a good neighbour?',
      band: 'Band 7–7.5',
      s: 'For me, it mostly comes down to being considerate. I don\'t need my neighbours to be my best friends, but I do appreciate it when they keep the noise down late at night or let you know in advance if they\'re having some work done. The couple next door to us are a good example — they once took in a parcel for me and kept an eye on our flat while we were away, without being asked. So I\'d say a good neighbour is someone who respects your space but is there when it counts.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: nêu tiêu chí ngay ("it mostly comes down to being considerate"), giới hạn kỳ vọng ("I don\'t need… but I do appreciate…"), ví dụ thật, rồi câu chốt đúc kết. Liền mạch, không dùng từ nối kiểu bài viết.',
        '**LR (từ vựng)**: collocation và cụm tự nhiên: "comes down to", "considerate", "keep the noise down", "let you know in advance", "having some work done", "took in a parcel", "kept an eye on", "when it counts". Đây là mật độ cụm tự nhiên của band 7+.',
        '**GRA (ngữ pháp)**: nhấn mạnh với "do" ("I do appreciate it"), cấu trúc nhờ vả "having some work done", mệnh đề thời gian "while we were away", giới từ + danh động từ bị động "without being asked", mệnh đề quan hệ ở câu chốt ("someone who respects…"). Không lỗi.',
        '**P (phát âm)**: nhấn tương phản "BEST friends" ↔ "DO appreciate"; "considerate" /kənˈsɪdərət/ — đuôi /ət/, không đọc /eɪt/; nối âm "kept‿an‿eye‿on"; xuống giọng dứt khoát ở "when it counts".',
      ],
    },
    {
      part: 2,
      cau: 'Describe an important decision you made.',
      band: 'Band 7–7.5',
      s: 'I\'d like to talk about my decision to leave a stable job and go back to studying, which I made about three years ago.\n\nAt the time, I\'d been working as an accountant at a logistics company for nearly two years. The salary was decent and my parents were very proud of it, but if I\'m honest, I was bored stiff. What I really enjoyed was the small amount of programming I did to automate our spreadsheets, and I\'d started teaching myself to code in the evenings.\n\nThe decision itself took me months. I was torn between security and doing something I actually cared about. I made a list of pros and cons, which didn\'t help much, because the two columns came out almost equal. In the end, what tipped the balance was a conversation with an older colleague. She told me that she\'d had the same doubts at my age, had stayed, and had regretted it ever since. That really hit home. I also worked out that I had enough savings to survive for about a year, so the risk felt manageable rather than reckless.\n\nSo I handed in my notice and enrolled on a one-year software course. My parents were quite upset at first — they thought I was throwing away a good position — and I\'ll admit the first few months were tough, because everyone in the class seemed to be younger and faster than me.\n\nLooking back, though, it was important for two reasons. Obviously it changed my career: I now work as a developer and I genuinely look forward to Mondays. But more than that, it taught me that I can live with uncertainty. If I hadn\'t taken that step, I think I\'d still be wondering what might have been.',
      phanTich: [
        '**FC**: đủ 2 phút, đi đúng 4 ý (what + when → bối cảnh → how → hệ quả → why) và có đoạn "nhìn lại". Chuyển đoạn bằng câu có nội dung: "The decision itself took me months", "In the end, what tipped the balance was…", "Looking back, though…". Kể có xung đột (ổn định ↔ đam mê) nên mạch tự nhiên, không phải liệt kê.',
        '**LR**: ngôn ngữ cân nhắc chính xác: "torn between", "pros and cons", "tipped the balance", "hit home", "manageable rather than reckless", "handed in my notice", "throwing away a good position", "live with uncertainty", "what might have been". Idiom "bored stiff" dùng đúng ngữ cảnh. Band 8 cần thêm 1–2 cụm tinh hơn nữa ("a leap of faith", "second-guess myself").',
        '**GRA**: quá khứ hoàn thành tiếp diễn ("I\'d been working… for nearly two years"), quá khứ hoàn thành trong lời kể lại ("she\'d had the same doubts…, had stayed, and had regretted it"), câu chẻ dạng What… (pseudo-cleft: "What I really enjoyed was…", "what tipped the balance was…"), điều kiện hỗn hợp ở câu cuối ("If I hadn\'t taken that step, I\'d still be wondering what might have been"). Dải cấu trúc rộng, gần như không lỗi ⇒ 7–7.5.',
        '**P**: chunking rõ: "I was torn / between security / and doing something I actually cared about"; nhấn tương phản "manageable rather than RECKless"; ngữ điệu xuống rồi ngừng trước "That really hit home"; âm cuối -ed: "regretted" /ɪd/, "enrolled" /d/, "worked out" /t/; "accountant" /əˈkaʊntənt/ nhấn âm 2.',
        '**Vì sao chưa phải band 8**: vài cụm còn an toàn ("quite upset", "really enjoyed"); band 8 (LR) cần dùng từ ít gặp và thành ngữ một cách khéo léo, đều tay trên CẢ bài chứ không dồn vào vài chỗ; về P, band 8 duy trì nhấn và ngữ điệu linh hoạt suốt 2 phút — chỉ bản ghi âm thật mới chấm được tiêu chí này.',
      ],
    },
    {
      part: 3,
      cau: 'Is it better to make important decisions alone or to ask other people for advice?',
      band: 'Band 7–7.5',
      s: 'I think the two aren\'t really opposites. Asking for advice is sensible, because other people can spot risks you\'re too close to see — particularly people who\'ve been through something similar. But there\'s a difference between collecting opinions and handing over the decision. If you ask ten people, you\'ll get ten answers, and at that point advice just becomes noise. So my view is: consult a few people whose judgement you trust, but make the final call yourself, because you\'re the one who has to live with the consequences.',
      phanTich: [
        '**FC**: không chọn một trong hai mà tái định nghĩa câu hỏi ("the two aren\'t really opposites") — cách xử lý đặc trưng band 7+; lập luận 3 bước: lợi ích của lời khuyên → giới hạn → nguyên tắc đúc kết. Không ngập ngừng tìm từ.',
        '**LR**: "spot risks", "too close to see", "been through something similar", "handing over the decision", "advice just becomes noise", "make the final call", "live with the consequences" — chính xác, giàu hình ảnh mà không khoa trương.',
        '**GRA**: mệnh đề quan hệ lược đại từ ("risks [that] you\'re too close to see") và mệnh đề với "whose" ("people whose judgement you trust"), điều kiện loại 1 tổng quát, cấu trúc nhấn mạnh "you\'re the one who has to…", dấu hai chấm khẩu ngữ "my view is: …". Không lỗi.',
        '**P**: nhấn tương phản "colLECTing opinions" ↔ "HANDing over the decision" (collecting /kəˈlektɪŋ/ — trọng âm âm 2); "ten PEOple… ten ANswers"; ngừng ngắn sau "So my view is" để báo kết luận; "consequences" /ˈkɒnsɪkwənsɪz/ nhấn âm đầu.',
      ],
    },
    {
      part: 3,
      cau: 'If more of the important decisions in companies were made by computer programs rather than by people, what effects might that have?',
      band: 'Band 7–7.5',
      s: 'I imagine it would cut both ways. On the plus side, a program doesn\'t get tired or play favourites, so routine decisions — who gets a loan, which supplier to use — might well become faster and more consistent. The danger, I think, is accountability. When a manager makes a bad call, you know who to hold responsible; when an algorithm does, everyone can shrug and blame the system. There\'s also the question of data: if the program has learned from past decisions that were unfair, it would simply repeat that unfairness, only more efficiently. So I\'d expect companies to end up with some kind of hybrid, where software makes the recommendation but a person still has to sign it off.',
      phanTich: [
        '**FC**: mở bằng luận điểm hai mặt ("it would cut both ways") rồi triển khai có trật tự: lợi → rủi ro 1 (trách nhiệm) → rủi ro 2 (dữ liệu) → dự đoán. Dùng dấu ngừng thay cho từ nối máy móc; câu chốt đưa ra dự báo cụ thể chứ không lặp lại ý.',
        '**LR**: từ trừu tượng dùng chuẩn: "accountability", "consistent", "algorithm", "hybrid", "sign it off"; cụm tự nhiên: "cut both ways", "play favourites", "makes a bad call", "hold responsible", "shrug and blame the system". Hedging tinh: "I imagine", "might well", "I\'d expect".',
        '**GRA**: giữ nhất quán thức giả định theo câu hỏi ("would cut", "might well become", "would simply repeat"); đối xứng "When a manager…; when an algorithm does, …" (thay thế bằng trợ động từ "does" để khỏi lặp "makes a bad call"); mệnh đề quan hệ "decisions that were unfair", "a hybrid, where software makes…". Không lỗi.',
        '**P**: nhấn cặp đối lập "MANager" ↔ "ALgorithm", "SOFTware" ↔ "PERson" (recommendation /ˌrekəmenˈdeɪʃn/ — trọng âm chính ở "-DA-"; phrasal verb "sign it OFF" nhấn tiểu từ); "accountability" /əˌkaʊntəˈbɪləti/ — trọng âm chính ở "-BIL-"; hạ giọng ở "only more efficiently" để tạo sắc thái mỉa nhẹ.',
      ],
    },
  ],
};
