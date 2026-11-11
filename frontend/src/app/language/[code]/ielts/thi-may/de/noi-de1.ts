/**
 * Đề 1 — Speaking, THI CUỐI TẬP 1 (docs/ielts-lo-trinh-0-8.md mục 4.2 · Ngày 15). TỰ SOẠN 12/11/2026.
 * Part 1: Daily routine (Ngày 6, Ngày 10) + Family (Ngày 6) — 6 câu · Part 2: Describe a place you like (cue card 4 ý, khung
 * Part 2 đã nhập ở Ngày 14) · Part 3: 5 câu khó dần fact → opinion → compare → compare (xưa/nay) → hypothesise (Ngày 12, Ngày 14).
 * Câu hỏi dùng từ vựng A2–B1 để người học band 3.5–4.5 HIỂU được câu hỏi; độ khó nằm ở việc trả lời dài và có lý do.
 * `mau`: câu trả lời mẫu band 5.5–6 — CHỈ dùng cấu trúc Tập 1 đã dạy (hiện tại đơn, quá khứ đơn, used to, because/so/when,
 * so sánh hơn) để người học thấy đích kế tiếp vừa tầm; phân tích FC · LR · GRA · P bằng tiếng Việt, xem SAU khi thi.
 */
import type { DeNoi } from './types';

export const NOI_DE1: DeNoi = {
  id: 'noi-de1',
  kyNang: 'noi',
  ten: 'Speaking — Đề 1 (thi cuối Tập 1)',
  boDe: 'Đề 1',
  capDo: 'Band 3.5 → 4.5',
  moTa: 'Part 1: daily routine · family · Part 2: a place you like to go to in your free time · Part 3: places to relax, public places in cities',
  phut: 12,
  part1: [
    {
      chuDe: 'Daily routine',
      cau: [
        'What time do you usually get up in the morning?',
        'What do you usually do in the evening?',
        'Is your routine at the weekend different from your routine on weekdays?',
      ],
    },
    {
      chuDe: 'Family',
      cau: [
        'How many people are there in your family?',
        'Who are you closest to in your family? Why?',
        'What do you like doing together with your family?',
      ],
    },
  ],
  part2: {
    cueCard: 'Describe a place you like to go to in your free time.\n\nYou should say:\n• where this place is\n• how often you go there\n• what you do there\n\nand explain why you like this place.',
    goiY: [
      'Bạn có 1 phút chuẩn bị — ghi 4 từ khoá cho 4 ý trên thẻ (where · how often · what · why), KHÔNG viết thành câu.',
      'Chọn một nơi THẬT và gần gũi (quán cà phê, công viên, thư viện, sân bóng, nhà bà) — nơi bạn kể được chi tiết: ngồi ở đâu, gọi món gì, đi với ai.',
      'Nói ít nhất 1 phút, cố đến 1,5–2 phút: câu mở "I\'d like to talk about…" → 3 ý theo thẻ → ý "why" nói DÀI NHẤT (2–3 lý do, mỗi lý do thêm một câu giải thích).',
      'Thì: hiện tại đơn cho thói quen ("I go there twice a week", "I usually order…"); thêm một câu quá khứ ("The first time I went there was…") để có hai thì.',
      'Hết ý mà chưa hết giờ? Thêm: lần gần nhất bạn đến đó, hoặc bạn muốn rủ ai đến cùng.',
    ],
    cauChot: [
      'Do your friends like this place too?',
      'Would you like to go there more often?',
    ],
  },
  part3: [
    {
      chuDe: 'Places where people relax',
      cau: [
        'Where do people in your country usually go to relax?',
        'Do you think it is important for a city to have parks and other public places? Why?',
        'Do young people and older people like to go to the same kinds of places?',
      ],
    },
    {
      chuDe: 'Free-time places, past and future',
      cau: [
        'Are the places where people spend their free time today different from the places people went to in the past?',
        'If your city had the money to build one new public place, what do you think it should build?',
      ],
    },
  ],
  mau: [
    {
      part: 1,
      cau: 'Is your routine at the weekend different from your routine on weekdays?',
      band: 'Band 5.5–6',
      s: 'Yes, it\'s quite different. On weekdays I get up at six because my first class starts at seven, so I\'m always in a hurry. But at the weekend I usually sleep until nine, and then I have a long breakfast with my family. In the afternoon I often meet my friends or play football. So I think weekends are much more relaxing for me.',
      phanTich: [
        '**FC (trôi chảy, mạch lạc)**: trả lời thẳng câu hỏi ("Yes, it\'s quite different") rồi so sánh: ngày thường → cuối tuần → câu chốt. Dài 5 câu (~25 giây) — đúng độ dài Part 1 (không một chữ "Yes" trơ trọi, cũng không nói quá 30 giây).',
        '**LR (từ vựng)**: cụm thói quen tự nhiên "get up", "in a hurry", "sleep until nine", "have a long breakfast", "meet my friends"; trạng từ tần suất "always / usually / often" đặt đúng chỗ (trước động từ thường, sau "to be").',
        '**GRA (ngữ pháp)**: hiện tại đơn đúng cho thói quen; câu ghép với "because", "so", "but", "and then"; so sánh hơn "much more relaxing". Không lỗi chia động từ — đây là điều giám khảo nghe đầu tiên ở band 4–5.',
        '**P (phát âm)**: đọc rõ âm cuối "weekdays" /z/, "starts" /ts/, "friends" /dz/; nhấn "QUITE different", "NINE"; xuống giọng ở cuối câu chốt. Lỗi hay gặp: "usually" đọc thiếu âm /ʒ/ — /ˈjuːʒuəli/.',
        '**Muốn lên 6.5**: thêm một cấu trúc đối chiếu ("whereas", "compared with weekdays") và một câu "used to" ("I used to get up early on Saturdays too, but…").',
      ],
    },
    {
      part: 2,
      cau: 'Describe a place you like to go to in your free time.',
      band: 'Band 5.5–6',
      s: 'I\'d like to talk about a small café near my house. It\'s on a quiet street, about five minutes from my home by motorbike.\n\nI go there about twice a week, usually on Saturday morning and one evening after class.\n\nWhen I\'m there, I usually order an iced milk coffee and sit at the table next to the window. Sometimes I do my homework or read a book, and sometimes I just listen to music and watch the people on the street. If my friends are free, we meet there and talk for hours. Last month, I even had my birthday party there with five friends.\n\nI like this place for three reasons. First, it\'s very quiet, so I can concentrate better than at home, where my little brother is always making noise. Second, the owner is really friendly. She remembers my name and my favourite drink. And finally, the café has a lot of plants and old wooden furniture, so it feels warm and comfortable. When I\'m tired or stressed, I go there, and I always feel better afterwards. So that\'s why it\'s my favourite place.',
      phanTich: [
        '**FC**: đi đúng 4 ý trên thẻ theo thứ tự (ở đâu → bao lâu một lần → làm gì → vì sao), mỗi ý một đoạn; ý "why" dài nhất với ba lý do đánh số "First / Second / And finally". Nói chậm, rõ thì bài này khoảng 1,5 phút — đủ yêu cầu. Câu kết "So that\'s why it\'s my favourite place" báo cho giám khảo biết bạn đã xong.',
        '**LR**: từ cụ thể, đời thường nhưng đúng: "iced milk coffee", "next to the window", "wooden furniture", "making noise", "stressed", "afterwards". Band 4 thường chỉ nói "it is nice, it is beautiful" — chi tiết cụ thể là cách dễ nhất để lên band 5.5.',
        '**GRA**: hiện tại đơn cho thói quen; MỘT câu quá khứ đơn ("Last month, I even had my birthday party there") để có hai thì; mệnh đề "where my little brother is always making noise"; so sánh hơn "better than at home"; câu "When / If…". Lỗi hiếm — đúng mô tả band 6: "mix of simple and complex structures".',
        '**P**: ngắt theo cụm: "I usually order an iced milk coffee / and sit at the table / next to the window"; nhấn từ mang nghĩa: QUIet, FRIENDly, COMfortable (3 âm tiết: /ˈkʌmftəbl/); âm cuối "plants" /ts/, "reasons" /z/, "stressed" /st/.',
        '**Muốn lên 6.5–7**: thay "First / Second / finally" bằng câu nối có nội dung ("What I like most is…", "Another thing is…"); thêm cảm xúc và kỷ niệm ("The first time I went there, I…"); dùng 1–2 cụm ít gặp hơn ("a cosy atmosphere", "it\'s my go-to place").',
      ],
    },
    {
      part: 3,
      cau: 'Do you think it is important for a city to have parks and other public places? Why?',
      band: 'Band 5.5–6',
      s: 'Yes, I think it\'s very important. In a big city, most people live in small flats, so they don\'t have a garden or much space at home. A park gives them a place to exercise and to breathe fresh air. Also, public places are free, so everyone can use them, rich or poor. For example, in my city many old people do exercise in the park every morning, and children play there after school. Without parks, I think people would feel more stressed.',
      phanTich: [
        '**FC**: khung trả lời câu nêu quan điểm (Ngày 12): quan điểm ("Yes, I think it\'s very important") → lý do 1 → lý do 2 ("Also…") → ví dụ ("For example…") → câu chốt. Part 3 phải nói về MỌI NGƯỜI nói chung ("most people", "everyone"), không kể chuyện riêng của mình như Part 1.',
        '**LR**: "live in small flats", "breathe fresh air", "public places", "rich or poor", "feel stressed" — đơn giản nhưng chính xác và đúng chủ đề thành phố.',
        '**GRA**: câu ghép với "so" (hai lần — chấp nhận ở band 6), "Without parks, I think people would feel…" là một câu giả định đơn giản nhưng ghi điểm; số nhiều đúng ("parks", "flats", "places").',
        '**P**: nhấn "VEry imPORtant", "FREE", "EVeryone"; phân biệt "live" /lɪv/ (động từ) với "life" /laɪf/; "exercise" /ˈeksəsaɪz/ nhấn âm đầu.',
        '**Muốn lên 6.5–7**: thêm một ý trừu tượng hơn ("parks also bring people together, so neighbours get to know each other") và một từ nối nhượng bộ ("Although land in cities is expensive, …").',
      ],
    },
    {
      part: 3,
      cau: 'If your city had the money to build one new public place, what do you think it should build?',
      band: 'Band 5.5–6',
      s: 'I think it should build a big public library. At the moment, my city only has one library, and it\'s old and very small. Many students want a quiet place to study, but they have to go to cafés, and that costs money. If the city built a modern library with free wifi and a lot of seats, students could study there every day. It would also be good for old people, because they could read newspapers and meet their friends there. So I would choose a library.',
      phanTich: [
        '**FC**: trả lời ngay lựa chọn ("a big public library") → tình hình hiện tại → vấn đề → lợi ích cho HAI nhóm người (students, old people) → câu chốt nhắc lại lựa chọn. Câu hỏi giả định không cần ý "cao siêu" — cần MỘT lựa chọn và lý do rõ.',
        '**LR**: "a quiet place to study", "costs money", "free wifi", "a modern library" — đủ dùng; "At the moment" là cụm chỉ thời gian tự nhiên thay cho "now".',
        '**GRA**: điểm sáng là câu điều kiện loại 2 đúng dạng: "If the city built…, students could study…" + "It would also be good…" — câu hỏi dùng "If your city had…" thì câu trả lời nên giữ "would / could". Tập 1 chưa dạy sâu câu điều kiện loại 2 (sẽ học kỹ ở Tập 2), nên lúc này chỉ cần thuộc khung "If + quá khứ đơn, … would/could + V".',
        '**P**: "library" /ˈlaɪbrəri/ (không đọc "lai-ba-ri" thiếu /r/); "built" /bɪlt/ — rõ âm /lt/ cuối; "would" /wʊd/ — chữ l câm; lên giọng nhẹ ở mệnh đề "If…," rồi xuống ở mệnh đề chính.',
        '**Muốn lên 6.5–7**: thêm một câu cân nhắc phương án khác ("A sports centre would be nice too, but…") để cho thấy bạn so sánh trước khi chọn.',
      ],
    },
  ],
};
