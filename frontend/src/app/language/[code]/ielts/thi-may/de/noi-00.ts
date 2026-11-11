/**
 * Đề 0 — Speaking của TEST ĐẦU VÀO (docs/ielts-lo-trinh-0-8.md mục 4.3). TỰ SOẠN 12/11/2026.
 * Part 1: Work/Study + Hometown (6 câu) · Part 2: Describe a person you admire (cue card chuẩn) · Part 3: 4 câu khó dần
 * fact → opinion → compare → hypothesise. Giám khảo AI hỏi theo thứ tự; không nói được 20 giây ⇒ chuyển câu, band 3.0.
 * `mau`: câu trả lời mẫu band 7 + phân tích FC · LR · GRA · P bằng tiếng Việt — người học chỉ xem SAU khi thi.
 */
import type { DeNoi } from './types';

export const NOI_00: DeNoi = {
  id: 'noi-00',
  kyNang: 'noi',
  ten: 'Placement Test — Speaking',
  boDe: 'CuongThai Placement Test',
  capDo: 'Band 4.0 → 8.0 (bậc thang)',
  moTa: 'Part 1: work or study · hometown · Part 2: a person you admire · Part 3: role models, fame and admiration',
  phut: 13,
  part1: [
    {
      chuDe: 'Work or study',
      cau: [
        'Do you work or are you a student?',
        'What do you like most about your work or your studies?',
        'Is there anything you would like to change about your typical working or studying day?',
      ],
    },
    {
      chuDe: 'Hometown',
      cau: [
        'Where is your hometown, and what is it like?',
        'What do people in your hometown usually do at the weekend?',
        'Has your hometown changed much since you were a child?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a person you admire.\n\nYou should say:\n• who this person is\n• how you know about this person\n• what this person has done\n\nand explain why you admire this person.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — ghi 4 từ khoá cho 4 ý trên thẻ, không viết câu.',
      'Người đó có thể là người thân, thầy cô, đồng nghiệp hoặc người nổi tiếng — chọn người bạn kể được CHI TIẾT (một việc cụ thể họ đã làm).',
      'Nói đủ 1,5–2 phút: mở (1 câu giới thiệu) → 3 ý theo thẻ → lý do (ít nhất 2 lý do, mỗi lý do kèm ví dụ ngắn).',
      'Dùng thì quá khứ cho việc họ đã làm, hiện tại cho tính cách, và một câu "If I could…" / "What I admire most is…" để đa dạng cấu trúc.',
    ],
    cauChot: [
      'Would you like to be more like this person in the future?',
      'Do other people you know also admire this person?',
    ],
  },
  part3: [
    {
      chuDe: 'Role models in society',
      cau: [
        'What kinds of people are most admired in your country today?',
        'Do you think famous people make good role models for young people? Why or why not?',
      ],
    },
    {
      chuDe: 'Admiration, past and future',
      cau: [
        'How are the people that young people admire today different from the people their parents admired?',
        'If there were no celebrities at all, who do you think young people would look up to instead?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Has your hometown changed much since you were a child?',
      band: 'Band 7',
      s: 'Yes, quite a lot, actually. When I was little, Bien Hoa was basically an industrial town — lots of factories and not much else — and the river was pretty polluted. Over the last ten years or so, they\'ve cleaned up the riverside and built a long walkway along it, so now it\'s where everyone goes in the evening. The downside is that it\'s become much more crowded, and the traffic is honestly worse than it used to be. But on balance I\'d say it\'s changed for the better.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: trả lời trực tiếp ("Yes, quite a lot") rồi mở rộng theo trình tự thời gian (trước → nay → mặt trái → kết luận); từ nối hội thoại tự nhiên ("actually", "the downside is", "on balance") thay cho "Firstly/Secondly".',
        '**LR (từ vựng)**: cụm tự nhiên "basically", "not much else", "cleaned up", "changed for the better"; từ chủ đề đúng ("industrial town", "polluted", "riverside", "walkway", "crowded"). Band 8 sẽ thêm một cụm ít gặp hơn ("it\'s been given a new lease of life").',
        '**GRA (ngữ pháp)**: trộn thì đúng — quá khứ ("was", "used to be"), hiện tại hoàn thành ("they\'ve cleaned up… built"), hiện tại ("it\'s where everyone goes"); so sánh "worse than it used to be"; câu phức với "so", "and". Không lỗi.',
        '**P (phát âm)**: nhấn từ mang nghĩa ("inDUStrial", "polLUted", "CROWded"); ngữ điệu xuống ở cuối "for the better"; nối âm "cleaned‿up", "lots‿of". Tránh bỏ âm cuối "-ed" trong "polluted", "crowded" (lỗi phổ biến của người Việt).',
      ],
    },
    {
      part: 2,
      cau: 'Describe a person you admire.',
      band: 'Band 7',
      s: 'The person I\'d like to talk about is my aunt, Hoa, who is my mother\'s younger sister. I\'ve known her my whole life, obviously, but I only really started to admire her when I was a teenager and understood what she\'d been through.\n\nShe\'s a maths teacher at a secondary school in a small town, and she\'s been doing that job for about twenty-five years. What makes her special, though, is something she did outside school. About ten years ago she noticed that a lot of children in her area were dropping out before they finished secondary school, mainly because their families needed them to work. So she started a free evening class in her own living room — just three or four students at first — where they could catch up on what they\'d missed. Over the years it grew, and now it\'s a proper community centre with volunteer teachers, and dozens of her former students have gone on to university, which would have been unthinkable for them before.\n\nThere are two reasons I admire her so much. The first is her persistence. She didn\'t have any funding or support at the beginning; she just kept going, year after year, even when people told her it was a waste of time. The second is that she\'s incredibly modest about it. If you met her, you\'d never guess she\'d done any of this — she\'d probably just ask about your family.\n\nI suppose what I really admire is that she changed real people\'s lives without ever expecting anything in return. If I can do even a fraction of that in my own career, I\'ll be happy.',
      phanTich: [
        '**FC**: đủ ~2 phút, đi đúng 4 ý trên thẻ theo thứ tự (ai → biết thế nào → đã làm gì → vì sao); có chuyển ý rõ ("What makes her special, though…", "There are two reasons…", "I suppose what I really admire is…"); kể một việc CỤ THỂ (lớp tối trong phòng khách) thay vì khen chung chung.',
        '**LR**: cụm tự nhiên "what she\'d been through", "dropping out", "catch up on", "gone on to university", "a waste of time", "a fraction of that"; từ ít gặp dùng đúng chỗ: "persistence", "unthinkable", "modest". Band 8 cần thêm 1–2 idiom chính xác ("she never blew her own trumpet").',
        '**GRA**: quá khứ hoàn thành ("what she\'d been through", "what they\'d missed"), hiện tại hoàn thành tiếp diễn ("she\'s been doing that job"), mệnh đề quan hệ không xác định ("my aunt, Hoa, who is…"), điều kiện loại 2 ("If you met her, you\'d never guess"), điều kiện loại 1 ở câu kết. Hầu như không lỗi — đúng mô tả band 7 "frequently produces error-free sentences".',
        '**P**: ngắt theo cụm ý (chunking) — "So she started a free evening class / in her own living room / just three or four students at first"; nhấn tương phản "FREE evening class", "her OWN living room"; âm cuối -ed phải rõ: "started" /ɪd/, "missed" và "noticed" /t/. Giọng lên nhẹ ở liệt kê "funding or support" rồi xuống ở "year after year".',
      ],
    },
    {
      part: 3,
      cau: 'Do you think famous people make good role models for young people? Why or why not?',
      band: 'Band 7',
      s: 'It really depends on the person, but on the whole I\'m a bit sceptical. The problem with celebrities is that young people only ever see the finished product — the award, the perfect photo — and not the years of work, or the failures, that came before it. So they end up admiring the result rather than the process, and that\'s not very useful as a model for your own life. Having said that, there are exceptions. Some athletes, for instance, are very open about their training and their setbacks, and I think that kind of honesty genuinely can inspire teenagers. So I\'d say famous people can be good role models, but only if what they show is the effort and not just the success.',
      phanTich: [
        '**FC**: cấu trúc trả lời Part 3 chuẩn — nêu lập trường có mức độ ("on the whole I\'m a bit sceptical") → giải thích cơ chế → nhượng bộ ("Having said that, there are exceptions") → ví dụ → chốt lại có điều kiện. Không ngắt dài, không lặp từ.',
        '**LR**: ngôn ngữ trừu tượng đúng chỗ: "the finished product", "the result rather than the process", "setbacks", "genuinely", "sceptical"; từ nối lập luận tự nhiên ("Having said that", "for instance", "So I\'d say"). Band 8 sẽ có một cụm sắc hơn ("a curated version of their lives").',
        '**GRA**: nhiều cấu trúc phức linh hoạt — mệnh đề quan hệ ("the failures… that came before it"), "end up + V-ing", nhấn mạnh với "only ever", "not… but…" ở câu cuối; modal có sắc thái ("can inspire", "I\'d say"). Không lỗi.',
        '**P**: nhấn từ tương phản "FINISHED product", "reSULT rather than the PROcess", "EFfort and not just the sucCESS"; ngữ điệu xuống ở "sceptical" để tỏ thái độ; "sceptical" đọc /ˈskeptɪkl/ (không đọc /s/ ở "sc-").',
      ],
    },
    {
      part: 3,
      cau: 'If there were no celebrities at all, who do you think young people would look up to instead?',
      band: 'Band 7',
      s: 'That\'s an interesting one. I imagine they\'d go back to admiring the people around them — a teacher, an older cousin, maybe a local business owner who\'d done well. In a way that might be healthier, because those people are reachable; you can actually ask them how they did it. On the other hand, I suspect that something like celebrity would appear anyway. Even without film stars or footballers, the most talented or confident people in a school or a town would probably become the ones everyone wants to copy. So I don\'t think the need for role models would disappear — it would just become more local.',
      phanTich: [
        '**FC**: xử lý câu giả định không ngập ngừng — câu mở đệm tự nhiên ("That\'s an interesting one") rồi vào thẳng; hai hướng suy luận (người xung quanh / "celebrity" tự xuất hiện) và một câu chốt khái quát.',
        '**LR**: "look up to", "reachable", "done well", "the need for role models", "become more local" — chính xác, không khoa trương; dùng "I imagine / I suspect / probably" để điều tiết độ chắc (hedging) — dấu hiệu band 7+.',
        '**GRA**: điều kiện loại 2 giữ nhất quán suốt câu trả lời ("they\'d go back", "would appear", "would probably become"); quá khứ hoàn thành trong mệnh đề quan hệ ("who\'d done well"); đưa trạng ngữ lên đầu câu để nhấn mạnh ("Even without film stars or footballers, …"). Không lỗi.',
        '**P**: tone units rõ: "In a way / that might be healthier / because those people are reachable"; nhấn "REACHable", "LOcal"; ngữ điệu lên ở "On the other hand" để báo đổi hướng, xuống dứt khoát ở "more local".',
      ],
    },
  ],
};
