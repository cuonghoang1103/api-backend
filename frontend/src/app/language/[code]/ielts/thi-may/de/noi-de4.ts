/**
 * Đề 4 — Speaking, GIỮA TẬP 3 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 3 Ngày 15). TỰ SOẠN 18/11/2026.
 * Part 1: Shopping + Technology (T3 N3 — 12 khung câu hỏi Part 1) — 6 câu · Part 2: Describe a skill (cue card 3 ý + explain) ·
 * Part 3: 5 câu khó dần fact → "Why do you think…?" (T3 N6) → "Do you agree that…?" (T3 N10) → compare → giả định
 * "What would happen if…?" (T3 N15), nối chủ đề "học kỹ năng". Soát 18/11: câu Part 3 cuối đổi "cooking" → "managing money" vì Đề 2 Writing Task 2
 * đã hỏi đúng "should schools teach children to cook?" (tránh trùng đề tài).
 * Khó hơn Đề 3 một bậc: câu hỏi Part 1 có dạng thay đổi / thói quen / ý kiến; Part 3 đòi lập trường có mức độ và điều kiện loại 2.
 * `mau`: câu trả lời mẫu band 6.0–6.5 (đích kế tiếp của người đang ở 5.5) — dùng cấu trúc Tập 3 đã dạy (hiện tại hoàn thành tiếp
 * diễn N1, verb patterns N7, so sánh nâng cao N11, chunks N11, bị động N13, điều kiện loại 2 N15); phân tích FC · LR · GRA · P
 * bằng tiếng Việt. Phiên âm theo Anh–Anh; chỉ nêu trọng âm của những từ thông dụng.
 */
import type { DeNoi } from './types';

export const NOI_DE4: DeNoi = {
  id: 'noi-de4',
  kyNang: 'noi',
  ten: 'Speaking — Đề 4 (giữa Tập 3)',
  boDe: 'Đề 4',
  capDo: 'Band 5.5',
  moTa: 'Part 1: shopping · technology · Part 2: a skill that took you a long time to learn · Part 3: learning skills, practical skills and the future',
  phut: 13,
  part1: [
    {
      chuDe: 'Shopping',
      cau: [
        'Do you enjoy shopping?',
        'Do you prefer shopping online or in real shops? Why?',
        'Have your shopping habits changed in the last few years?',
      ],
    },
    {
      chuDe: 'Technology',
      cau: [
        'What piece of technology do you use most often?',
        'Is there any technology you find difficult to use?',
        'Do you think you spend too much time looking at screens?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a skill that took you a long time to learn.\n\nYou should say:\n• what the skill is\n• when and why you started learning it\n• how you learned it\n\nand explain why it took you a long time to learn.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — ghi 4 từ khoá cho 4 ý trên thẻ (what · when/why · how · why so long), thêm 1 khoảnh khắc cụ thể (lần đầu thất bại, lần đầu làm được).',
      'Chọn MỘT kỹ năng thật, học trong thời gian dài: bơi, lái xe máy, nấu ăn, chơi guitar, gõ mười ngón, nói trước đám đông, lập trình. Kỹ năng có "trước – sau" rõ thì dễ kể.',
      'Thì: quá khứ đơn để kể ("I started…", "I failed…"), "used to" cho thói quen cũ, và hiện tại hoàn thành (tiếp diễn) nếu vẫn đang làm: "I\'ve been swimming twice a week since then." (Tập 3 Ngày 1).',
      'Ý "why it took a long time" nói DÀI NHẤT: 2 lý do (vd. sợ, không có người dạy, tập không đều), mỗi lý do có giải thích. Dùng "The main reason was…", "On top of that, …".',
      'Thêm một câu giả định để ghi điểm ngữ pháp (Tập 3 Ngày 15): "If I had started earlier, it would have been much easier." Câu kết: "So that\'s the skill that took me the longest to learn."',
    ],
    cauChot: [
      'Do you still use this skill now?',
      'Would you like to teach this skill to someone else?',
    ],
  },
  part3: [
    {
      chuDe: 'Learning skills',
      cau: [
        'What practical skills do children in your country usually learn at home?',
        'Why do you think some people learn new skills faster than others?',
        'Do you agree that it is harder to learn a new skill as an adult than as a child?',
      ],
    },
    {
      chuDe: 'Skills and the future',
      cau: [
        'Is it better to learn a skill from a teacher or from online videos?',
        'What would happen if schools stopped teaching practical skills such as managing money?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Have your shopping habits changed in the last few years?',
      band: 'Band 6.0–6.5',
      s: 'Yes, quite a lot, actually. I used to go to the local market or a shopping centre almost every weekend, but these days I buy most things online, especially clothes and books. It\'s partly because I\'m busier now, and partly because it\'s so easy to compare prices on my phone. The only things I still buy in person are shoes, because I need to try them on first.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: trả lời thẳng ("Yes, quite a lot, actually") → TRƯỚC ĐÂY ("I used to…") → BÂY GIỜ ("but these days…") → hai lý do ("partly because… and partly because…") → ngoại lệ. Câu hỏi về thay đổi luôn theo khung xưa – nay – lý do. 4 câu, khoảng 25 giây — vừa đủ cho Part 1.',
        '**LR (từ vựng)**: "shopping habits" được paraphrase bằng hành động cụ thể; "compare prices" (so giá), "in person" (trực tiếp — đối lập với "online"), "try them on" (thử đồ — cụm động từ tách được). "these days" tự nhiên hơn "nowadays" trong văn nói.',
        '**GRA (ngữ pháp)**: "used to go" cho thói quen cũ đã hết; so sánh "busier"; cấu trúc cân đối "partly because…, and partly because…"; mệnh đề quan hệ lược "that": "The only things (that) I still buy in person are shoes" — chủ ngữ số nhiều "things" ⇒ động từ "are".',
        '**P (phát âm)**: "used to" /ˈjuːst tə/ — âm /s/; "clothes" /kləʊðz/ — MỘT âm tiết, không đọc "clo-thes"; "compare" /kəmˈpeə/ nhấn âm hai; nối âm phụ âm–nguyên âm (Tập 3 Ngày 3): "try them‿on", "quite‿a lot".',
        '**Muốn lên 7**: thêm một nhận xét về hệ quả ("so I probably spend more than I used to, to be honest") và một từ ít gặp hơn ("impulse buying", "browse").',
      ],
    },
    {
      part: 2,
      cau: 'Describe a skill that took you a long time to learn.',
      band: 'Band 6.0–6.5',
      s: 'I\'d like to talk about swimming, which is a skill that took me much longer to learn than it should have.\n\nI started when I was about nineteen, in my first year at university. Most of my friends had learned as children, but I grew up in a small town with no swimming pool, so I never had the chance. I decided to learn because my university was near the coast, and I felt embarrassed sitting on the beach while everyone else was in the water.\n\nAt first, I tried to teach myself by watching videos online and copying the movements in the shallow end of the pool. That didn\'t work at all. I could move my arms and legs, but I kept sinking. So after a few months, I joined a beginners\' class for adults, which was held twice a week. The coach was very patient. She made us practise breathing for three whole lessons before we were allowed to swim a single metre.\n\nIt took me nearly two years to swim properly, and I think there were two main reasons. The first was fear. I had almost drowned in a river when I was little, so every time my face went under the water, I panicked. The second reason was that I wasn\'t consistent. During exam periods I stopped going for weeks, and each time I had to start again almost from the beginning. If I had practised regularly, I would have learned much faster.\n\nI finally managed to swim fifty metres without stopping last summer, and it was one of the proudest moments of my life. I\'ve been swimming every week since then. So that\'s the skill that took me the longest to learn.',
      phanTich: [
        '**FC**: đủ 4 ý trên thẻ theo thứ tự (kỹ năng gì → khi nào, vì sao bắt đầu → học thế nào → vì sao lâu), mỗi ý một khối rõ ràng; phần "why it took a long time" dài nhất với khung "there were two main reasons. The first was… The second reason was…". Có trình tự thời gian: "At first… So after a few months… finally…". Nói chậm rõ thì khoảng 2 phút. Câu kết báo đã xong.',
        '**LR**: từ đúng chủ đề học kỹ năng: "teach myself", "copying the movements", "the shallow end", "a beginners\' class", "patient", "consistent", "panicked", "managed to". Cảm xúc cụ thể: "embarrassed", "one of the proudest moments of my life". Band 5 thường chỉ có "difficult / hard / happy".',
        '**GRA**: quá khứ đơn làm nền; quá khứ hoàn thành cho việc xảy ra trước ("had learned as children", "had almost drowned"); verb patterns (Tập 3 Ngày 7): "decided to learn", "tried to teach myself", "kept sinking", "stopped going", "managed to swim"; bị động "was held", "were allowed to"; điều kiện loại 3 "If I had practised regularly, I would have learned much faster" (Ngày 15); hiện tại hoàn thành tiếp diễn "I\'ve been swimming every week since then" (Ngày 1). Đúng mô tả band 6–7: nhiều cấu trúc phức, phần lớn không lỗi.',
        '**P**: "would have" đọc nối /ˈwʊdəv/ (Tập 3 Ngày 15); -ed: "panicked" /ˈpænɪkt/ → /t/, "drowned" /draʊnd/ → /d/ (một âm tiết, không đọc "drown-ded"), "started" /ˈstɑːtɪd/ → /ɪd/; trọng âm: "embarrassed" /ɪmˈbærəst/ âm hai, "consistent" /kənˈsɪstənt/ âm hai, "university" /ˌjuːnɪˈvɜːsəti/ âm ba; ngắt hơi sau cụm mở: "At first, / I tried to teach myself".',
        '**Muốn lên 7**: thêm chi tiết giác quan (mùi clo, nước lạnh), một thành ngữ vừa phải ("it was a steep learning curve") và câu rút ra bài học ("It taught me that being regular matters more than being talented").',
      ],
    },
    {
      part: 3,
      cau: 'Do you agree that it is harder to learn a new skill as an adult than as a child?',
      band: 'Band 6.0–6.5',
      s: 'I agree to some extent, but I think it depends on the skill. For physical skills, like swimming or riding a bike, children definitely have an advantage, because they\'re not afraid of falling or looking silly. Adults worry far more about making mistakes. On the other hand, adults are usually better at organising their learning. They know why they want the skill, so they can practise in a more focused way. For example, my mother learned to use a computer at fifty, and she was faster than I expected because she had a clear goal. So I\'d say it\'s harder for adults in some ways, but certainly not impossible.',
      phanTich: [
        '**FC**: dạng "Do you agree that…?" (Tập 3 Ngày 10) ⇒ đồng ý MỘT PHẦN: "I agree to some extent, but…" → trường hợp đúng (kỹ năng thể chất + lý do) → "On the other hand" + trường hợp ngược lại (người lớn có mục tiêu) → ví dụ → kết luận có mức độ ("in some ways, but certainly not impossible"). Không trả lời "Yes/No" trống không.',
        '**LR**: "to some extent", "have an advantage", "looking silly", "in a more focused way", "a clear goal". Chunks của văn nói (Tập 3 Ngày 11): "I\'d say…", "I think it depends on…". Trạng từ mức độ: "definitely", "usually", "certainly" — giúp lập trường có sắc thái.',
        '**GRA**: so sánh nâng cao (Tập 3 Ngày 11): "far more", "better at", "faster than I expected"; danh động từ sau giới từ: "afraid of falling", "better at organising", "about making mistakes" (Ngày 7); mệnh đề nguyên nhân – kết quả: "They know why they want the skill, so they can…".',
        '**P**: ngữ điệu nhượng bộ (Tập 3 Ngày 10): lên giọng ở "to some extent", ngắt nhẹ, rồi xuống giọng sau "but"; nhấn tương phản "CHILDREN definitely have an advantage… ADULTS worry far more"; "advantage" /ədˈvɑːntɪdʒ/ nhấn âm hai; "organising" /ˈɔːɡənaɪzɪŋ/ nhấn âm đầu.',
        '**Muốn lên 7**: thêm ý trừu tượng ("the brain is more flexible in childhood", "adults have less free time and more responsibilities") và một cấu trúc nhượng bộ ("Even though adults learn more slowly, they tend to remember why they are learning").',
      ],
    },
    {
      part: 3,
      cau: 'What would happen if schools stopped teaching practical skills such as managing money?',
      band: 'Band 6.0–6.5',
      s: 'I think it would cause real problems in the long run. If schools stopped teaching how to manage money, many teenagers would never learn it, because their parents are too busy, or simply don\'t feel comfortable talking about money at home. Those young people would leave school without knowing how to plan a budget, and they could easily fall into debt with credit cards or buy-now-pay-later apps, which is far harder to get out of than to get into. Of course, some people would say that anyone can learn this from videos, and that\'s true for motivated students. But the students who need these skills most are often the ones who wouldn\'t look for them on their own. So if I were in charge of education, I\'d keep those classes.',
      phanTich: [
        '**FC**: câu giả định "What would happen if…?" (Tập 3 Ngày 15) ⇒ khung: hệ quả chung ("it would cause real problems in the long run") → hệ quả 1 + lý do → hệ quả 2 → ý phản đối ("Of course, some people would say that…") → bác lại ("But…") → kết luận giả định. Nêu cả ý ngược rồi bác là dấu hiệu band 6.5+.',
        '**LR**: "in the long run" (về lâu dài), "manage money", "plan a budget" (lập ngân sách), "fall into debt" (rơi vào nợ nần), "motivated students", "on their own" (tự mình), "in charge of" (phụ trách). Đây đều là cụm cố định — học cả cụm, đừng ghép từng từ.',
        '**GRA**: điều kiện loại 2 dùng nhất quán: "If schools stopped…, many teenagers would never learn it", "they could easily fall into debt" (could = khả năng trong tình huống giả định), "if I were in charge…, I\'d keep…" (dùng "were" cho mọi ngôi); từ để hỏi + to-V: "how to manage money", "how to plan a budget"; mệnh đề quan hệ "the students who need these skills most are often the ones who wouldn\'t look for them"; "which" thay cả mệnh đề trước: "…, which is far harder to get out of than to get into".',
        '**P**: "would" trong câu giả định đọc yếu và nối: "it would" /ˈɪt wəd/, "I\'d keep" /aɪd kiːp/ — đừng bỏ âm /d/; "practical" /ˈpræktɪkl/ nhấn âm đầu; "debt" /det/ — chữ "b" câm; "education" /ˌedʒuˈkeɪʃn/ nhấn âm ba; ngắt hơi trước "But" để báo ý bác lại.',
        '**Muốn lên 7**: thêm hệ quả cấp xã hội ("it could widen the gap between families who talk openly about money and those who don\'t") và dùng "might / could" bên cạnh "would" để phân biệt mức chắc chắn.',
      ],
    },
  ],
};
