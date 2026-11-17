/**
 * Đề 4 — Listening, GIỮA TẬP 3 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 3 Ngày 15). TỰ SOẠN 18/11/2026.
 * Mức band 5.5 — khó hơn Đề 3 một bậc: ~150 từ/phút (lượt lời dài hơn, ít câu đệm), từ vựng B1+ → B2, đáp án thường đứng SAU
 * một hoặc hai phương án bị bác bỏ, paraphrase đổi loại từ / đổi cấu trúc (không chỉ đồng nghĩa); Part 3 có BA người nói.
 * Bối cảnh theo mục 4.2: thuê xe (giọng US) · bản đồ khu bảo tồn · thảo luận một bài báo · bài giảng "ngôn ngữ trẻ em" (giọng CA).
 *   Part 1: Table + Form (T2 N5, N1; T3 N1 giọng trộn) · Part 2: MCQ + Map (T3 N4, N12) ·
 *   Part 3: MCQ + Matching, 3 người nói (T3 N8) · Part 4: Note + Sentence completion (T3 N13).
 * Bẫy chính: $32 (thuê từ một tuần) → $38; 4 chỗ ngồi / 2 va-li; 100 dặm một ngày → unlimited miles; $70 mùa hè → $62;
 * airport (phụ phí $50) → downtown; hạ cánh 13 → nhận xe 14; a week → 6 ngày; brother → wife; farmland / cattle → sand and gravel;
 * visitor centre (3 năm trước) / bãi xe thứ hai (chưa được phép) → boardwalk; dogs + bikes được phép → rời lối đi; dusk (sách) →
 * sau bình minh; bài mới nhất / đồng tình → cách dùng bằng chứng; 72 công ty (đã biết) → chỉ 3 quay lại; sáu tháng (đủ dài) →
 * công ty TỰ NGUYỆN; tóm tắt / video → hỏi cả lớp; email thầy (đã biết 15 phút) → làm slide; consonants → vowels; toys → animals;
 * 500 → 50; louder → slowly; video → người thật.
 * Dữ kiện ngôn ngữ trẻ em là kiến thức giáo trình phổ biến (cooing ~2 tháng, babbling ~6 tháng, từ đầu tiên ~12 tháng, ~50 từ lúc
 * 18 tháng, "word spurt", câu hai từ ~2 tuổi, lỗi "goed / mouses"; "wug test" của Jean Berko năm 1958 — con wug là sinh vật giống
 * chim; Janet Werker (Vancouver): trẻ 10–12 tháng thôi phân biệt âm ngoại ngữ; Patricia Kuhl: trẻ 9 tháng học âm tiếng Quan thoại
 * từ người thật, không học được từ video) — soạn theo trí nhớ, CHƯA đối chiếu lại nguồn trong phiên này. Hãng Sunrise Car Rental,
 * khu bảo tồn Heron Lake, sông Ash, bài báo về tuần làm việc bốn ngày (72 công ty — cố ý KHÁC số của thử nghiệm thật ở Anh năm 2022 để không lẫn với dữ kiện thật) và mọi nhân vật đều HƯ CẤU. Đã soát 18/11: "vài giờ tuổi" → "vài ngày tuổi" (thí nghiệm DeCasper & Fifer dùng trẻ < 3 ngày tuổi); bỏ khẳng định quá mạnh "người lớn không nói to hơn".
 * Giọng: us-nu, us-nam, uk-nam, uk-nu, ca-nu (5 giọng). `ev` = chuỗi NGUYÊN VĂN trong một lượt lời.
 */
import type { DeNghe } from './types';

export const NGHE_DE4: DeNghe = {
  id: 'nghe-de4',
  kyNang: 'nghe',
  ten: 'Listening — Đề 4 (giữa Tập 3)',
  boDe: 'Đề 4',
  capDo: 'Band 5.5',
  moTa: 'Renting a car (US) · Nature reserve talk & map · Three speakers discuss a journal article · Lecture on how children learn language (Canadian speaker)',
  phut: 30,
  phan: [
    /* ════════════════ PART 1 — thuê xe (giọng Mỹ) ════════════════ */
    {
      so: 1,
      tieuDe: 'Sunrise Car Rental — telephone booking',
      dan: 'Part 1. You will hear a man telephoning a car rental company to book a car. First, you have some time to look at questions 1 to 10.',
      boiCanh: 'Ryan gọi hãng Sunrise Car Rental (Mỹ) hỏi ba loại xe rồi đặt một chiếc. Cả hai nói giọng Mỹ, dùng từ Mỹ: gas (xăng), trunk (cốp), cab (taxi), license. Chú ý: giá áp dụng cho ĐÚNG số ngày anh thuê, sức chứa hành lý (không phải số ghế), giá khuyến mãi; phần phiếu: nơi nhận xe, ngày NHẬN xe (không phải ngày hạ cánh), số ngày, người lái thứ hai.',
      docTruoc: 30,
      loi: [
        { ai: 'Dana', giong: 'us-nu', s: `Thank you for calling Sunrise Car Rental. This is Dana. How can I help you today?` },
        { ai: 'Ryan', giong: 'us-nam', s: `Hi, Dana. I'm flying into Portland next month with my family, and I'd like to rent a car. Could you tell me what you have available?` },
        { ai: 'Dana', giong: 'us-nu', s: `Sure. We have three main types. The cheapest is our economy car. It's small, but it's very good on gas.` },
        { ai: 'Ryan', giong: 'us-nam', s: `Your website says that one is $32 a day. Is that right?` },
        { ai: 'Dana', giong: 'us-nu', s: `$32 is the rate if you keep the car for a week or longer. For a shorter rental, it's $38 a day.` },
        { ai: 'Ryan', giong: 'us-nam', s: `I see. And how much luggage does it take? There'll be three of us.` },
        { ai: 'Dana', giong: 'us-nu', s: `Honestly, not much. There are seats for four people, but the trunk only has room for two suitcases.` },
        { ai: 'Ryan', giong: 'us-nam', s: `Hmm, that could be a problem. What's the next size up?` },
        { ai: 'Dana', giong: 'us-nu', s: `That's the midsize, at $45 a day. The trunk is a lot bigger. And with the midsize you get unlimited miles, so you can drive as far as you like and pay nothing extra. With the economy car, you only get a hundred miles a day.` },
        { ai: 'Ryan', giong: 'us-nam', s: `That's good to know, because we're planning to drive all the way down the coast. Do you have anything larger?` },
        { ai: 'Dana', giong: 'us-nu', s: `We have an SUV. In summer it's normally $70 a day, but there's a special offer on at the moment, so I can give it to you for $62.` },
        { ai: 'Ryan', giong: 'us-nam', s: `And is insurance included in that?` },
        { ai: 'Dana', giong: 'us-nu', s: `Basic insurance is included with all our cars. The only special rule for the SUV is that you have to bring it back with a full tank. If you don't, we charge you for the gas, and our price is pretty high.` },
        { ai: 'Ryan', giong: 'us-nam', s: `OK. Well, the SUV is more than we need. I'll take the midsize.` },
        { ai: 'Dana', giong: 'us-nu', s: `Good choice. Let me get some details from you. Can I have your name, please?` },
        { ai: 'Ryan', giong: 'us-nam', s: `Ryan Kowalski. That's K, O, W, A, L, S, K, I.` },
        { ai: 'Dana', giong: 'us-nu', s: `K, O, W, A, L, S, K, I. Got it. And will you be picking the car up at the airport?` },
        { ai: 'Ryan', giong: 'us-nam', s: `That was my plan. Is there a problem with that?` },
        { ai: 'Dana', giong: 'us-nu', s: `No problem at all, but I should tell you that there's an extra fee of $50 at the airport office. If you collect the car from our downtown office, you don't pay that.` },
        { ai: 'Ryan', giong: 'us-nam', s: `Our hotel is downtown anyway. We'll take a cab from the airport, and I'll pick the car up downtown.` },
        { ai: 'Dana', giong: 'us-nu', s: `Perfect. And what date do you need it from?` },
        { ai: 'Ryan', giong: 'us-nam', s: `We land on the evening of June thirteenth, but we won't need a car that night. So let's say the morning of the fourteenth.` },
        { ai: 'Dana', giong: 'us-nu', s: `June fourteenth. And how long would you like it for? A week?` },
        { ai: 'Ryan', giong: 'us-nam', s: `That's what I thought at first, but our flight home is on the twentieth, so we only need it for six days.` },
        { ai: 'Dana', giong: 'us-nu', s: `Six days. That's fine. Now, will anyone else be driving?` },
        { ai: 'Ryan', giong: 'us-nam', s: `Yes. My brother was going to share the driving, but he can't come with us now. So it'll be my wife.` },
        { ai: 'Dana', giong: 'us-nu', s: `OK. There's usually a charge of ten dollars a day for a second driver, but we don't charge for a husband or wife. She'll just need to show her license when you pick up the car.` },
        { ai: 'Ryan', giong: 'us-nam', s: `Great. That all sounds good.` },
        { ai: 'Dana', giong: 'us-nu', s: `Then I'll send you an email to confirm everything. Thanks for choosing Sunrise, Mr Kowalski.` },
      ],
      nhom: [
        {
          id: 'n1-table', tu: 1, den: 5, dang: 'table',
          huongDan: 'Complete the table below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Sunrise Car Rental — types of car',
          bang: {
            dau: ['Type of car', 'Cost per day', 'Notes'],
            hang: [
              ['Economy', '$[[1]] (rentals of under a week)', 'four seats, but space for only two [[2]]'],
              ['Midsize', '$45', 'larger trunk; price includes unlimited [[3]]'],
              ['SUV', '$[[4]] (special offer)', 'customers must return it with a full [[5]]'],
            ],
          },
        },
        {
          id: 'n1-form', tu: 6, den: 10, dang: 'form',
          huongDan: 'Complete the form below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Sunrise Car Rental — Booking Form',
          dong: [
            'Car chosen: Midsize',
            'Customer\'s name: Ryan [[6]]',
            'Pick-up location: the [[7]] office',
            'Pick-up date: [[8]] June',
            'Length of rental: [[9]] days',
            'Second driver: the customer\'s [[10]]',
          ],
        },
      ],
    },

    /* ════════════════ PART 2 — khu bảo tồn Heron Lake (bản đồ) ════════════════ */
    {
      so: 2,
      tieuDe: 'Heron Lake Nature Reserve',
      dan: 'Part 2. You will hear a ranger talking to a group of new volunteers at a nature reserve. First, you have some time to look at questions 11 to 20.',
      boiCanh: 'Callum, kiểm lâm của khu bảo tồn Heron Lake, giới thiệu khu bảo tồn cho nhóm tình nguyện viên mới rồi chỉ các địa điểm trên bản đồ. Chú ý: đất TRƯỚC KIA dùng làm gì, thứ gì MỚI trong năm nay, điều duy nhất bị cấm, giờ xem rái cá Ở ĐÂY (khác sách hướng dẫn); phần bản đồ: bắt đầu từ visitor centre, đi vòng hồ theo chiều kim đồng hồ.',
      docTruoc: 40,
      loi: [
        { ai: 'Callum', giong: 'uk-nam', s: `Good morning, everyone, and thank you for giving up your Saturday to join us as volunteers at Heron Lake. My name's Callum, and I'm one of the rangers here. Before we go outside, I'd like to tell you a little about the reserve and show you where things are.` },
        { ai: 'Callum', giong: 'uk-nam', s: `People often assume that this land used to be farmland, like everything around it. In fact, for nearly forty years a company dug sand and gravel out of the ground here. When the company left, the holes slowly filled with water, and that's how the lake was formed. You will see cattle on the reserve today, but we brought those in ourselves, to keep the grass short.` },
        { ai: 'Callum', giong: 'uk-nam', s: `Now, some of you may have visited before, so let me tell you what has changed. The visitor centre isn't new, of course. That opened three years ago. What we finished this spring is the wooden boardwalk, which lets you cross the marsh without getting your feet wet. We'd also like a second car park, but we're still waiting for permission, so that won't happen this year.` },
        { ai: 'Callum', giong: 'uk-nam', s: `A word about the rules, because visitors will ask you. Dogs are welcome, as long as they are kept on a lead. Bicycles are fine too, on the main track. The one thing we never allow is leaving the marked paths. Many of our birds nest on the ground, and a single careless step can destroy a nest.` },
        { ai: 'Callum', giong: 'uk-nam', s: `The animals everybody wants to see are the otters. Most guidebooks will tell you to look for otters at dusk. That may be true elsewhere, but ours are most active just after sunrise, so tell visitors to come as early as they can. By the middle of the day, the otters are asleep, and nobody sees anything.` },
        { ai: 'Callum', giong: 'uk-nam', s: `Right, please look at the map. We're in the visitor centre, at the bottom, just above the car park. The space right beside the visitor centre, on the left, is only where staff leave their vehicles. To reach the bird hide, take the path that goes left around the lake. The hide is the first thing you come to, on the edge of the water, just before the marsh begins.` },
        { ai: 'Callum', giong: 'uk-nam', s: `Visitors often ask where they can eat their sandwiches. The picnic area isn't by the lake, because food attracts rats. It's beside the car park, on the east side.` },
        { ai: 'Callum', giong: 'uk-nam', s: `If you carry on along the path, past the marsh, you come to the river at the top of the map. The otter viewing platform is on this side of the river, a short distance to the west of the bridge.` },
        { ai: 'Callum', giong: 'uk-nam', s: `Now cross the bridge. The wildflower meadow is on the far side of the river, and it's the only part of the reserve that lies north of it. It looks its best in June.` },
        { ai: 'Callum', giong: 'uk-nam', s: `Come back over the bridge and keep following the path around the lake. At the north-east corner, a narrow path leads away from the water into the trees. The outdoor classroom is at the end of that path, in the middle of the woodland. School groups use it most weekdays.` },
        { ai: 'Callum', giong: 'uk-nam', s: `And finally, the boat shed, where we keep the tools that you'll be using today. That's further down the east side of the lake, right on the shore, where the woodland meets the water. So, let's walk over there now and get started.` },
      ],
      nhom: [
        {
          id: 'n2-mcq', tu: 11, den: 14, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 11, s: 'What was the land used for before it became a nature reserve?', chon: [{ k: 'A', t: 'growing crops' }, { k: 'B', t: 'digging out sand and gravel' }, { k: 'C', t: 'keeping cattle' }] },
            { n: 12, s: 'What is new at the reserve this year?', chon: [{ k: 'A', t: 'a boardwalk across the marsh' }, { k: 'B', t: 'a visitor centre' }, { k: 'C', t: 'a second car park' }] },
            { n: 13, s: 'What are visitors to the reserve not allowed to do?', chon: [{ k: 'A', t: 'bring a dog' }, { k: 'B', t: 'ride a bicycle' }, { k: 'C', t: 'walk off the paths' }] },
            { n: 14, s: 'According to the ranger, when is the best time to see otters at Heron Lake?', chon: [{ k: 'A', t: 'early in the morning' }, { k: 'B', t: 'around midday' }, { k: 'C', t: 'in the evening' }] },
          ],
        },
        {
          id: 'n2-map', tu: 15, den: 20, dang: 'map',
          huongDan: 'Label the map below.\nWrite the correct letter, **A–H**, next to Questions 15–20.',
          tieuDe: 'Heron Lake Nature Reserve',
          hop: { ds: 'ABCDEFGH'.split('').map((k) => ({ k, t: k })) },
          cau: [
            { n: 15, s: 'Bird hide' },
            { n: 16, s: 'Picnic area' },
            { n: 17, s: 'Otter viewing platform' },
            { n: 18, s: 'Wildflower meadow' },
            { n: 19, s: 'Outdoor classroom' },
            { n: 20, s: 'Boat shed' },
          ],
          hinh: {
            w: 560, h: 440,
            chuThich: 'Map of the reserve (not to scale). North is at the top. You start at the visitor centre.',
            ve: [
              // Sông Ash chạy ngang phía bắc + cầu
              { t: 'rect', x: 0, y: 62, w: 560, h: 26, nen: '#cfe3f2', bo: 0 },
              { t: 'text', x: 70, y: 80, s: 'River Ash', co: 11, nghieng: true },
              { t: 'rect', x: 264, y: 56, w: 32, h: 38, nen: '#e4ddd0', bo: 1 },
              { t: 'text', x: 322, y: 52, s: 'Bridge', co: 11, giua: true },
              // Đầm lầy (tây) + rừng (đông)
              { t: 'rect', x: 18, y: 135, w: 112, h: 160, nen: '#e3ecd6', bo: 0 },
              { t: 'text', x: 74, y: 160, s: 'Marsh', co: 12, dam: true, giua: true },
              { t: 'rect', x: 432, y: 105, w: 116, h: 200, nen: '#cfe2c3', bo: 0 },
              { t: 'text', x: 490, y: 285, s: 'Woodland', co: 12, dam: true, giua: true },
              // Hồ
              { t: 'path', d: 'M170,215 a110,70 0 1,0 220,0 a110,70 0 1,0 -220,0', nen: '#cfe3f2', mau: '#7da7c7', day: 1 },
              { t: 'text', x: 280, y: 220, s: 'LAKE', co: 13, dam: true, giua: true },
              // Lối đi vòng hồ + lối qua cầu + lối vào rừng
              { t: 'line', d: [[280, 330], [165, 305], [140, 215], [165, 125], [280, 110], [395, 125], [420, 215], [395, 305], [280, 330]], dut: true },
              { t: 'line', d: [[280, 110], [280, 94]], dut: true },
              { t: 'line', d: [[280, 56], [280, 34]], dut: true },
              { t: 'line', d: [[395, 125], [490, 150]], dut: true },
              // Visitor centre + bãi xe
              { t: 'rect', x: 232, y: 332, w: 96, h: 34, nen: '#dbe7f3', nhan: 'Visitor centre' },
              { t: 'rect', x: 222, y: 386, w: 116, h: 40, nen: '#e6e6e6', nhan: 'Car park' },
              // Hướng bắc
              { t: 'line', d: [[530, 48], [530, 16]], mui: true },
              { t: 'text', x: 516, y: 30, s: 'N', co: 12, dam: true },
              // Chữ cái
              { t: 'chu', k: 'A', x: 196, y: 350 },
              { t: 'chu', k: 'B', x: 208, y: 290 },
              { t: 'chu', k: 'C', x: 74, y: 225 },
              { t: 'chu', k: 'D', x: 205, y: 106 },
              { t: 'chu', k: 'E', x: 340, y: 28 },
              { t: 'chu', k: 'F', x: 410, y: 262 },
              { t: 'chu', k: 'G', x: 502, y: 152 },
              { t: 'chu', k: 'H', x: 372, y: 406 },
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 3 — thảo luận một bài báo (3 người nói) ════════════════ */
    {
      so: 3,
      tieuDe: 'Seminar preparation — discussing an article',
      dan: 'Part 3. You will hear a tutor and two business students, Maya and Leo, discussing an article about the four-day working week. First, you have some time to look at questions 21 to 30.',
      boiCanh: 'Thầy Reed giao cho hai sinh viên Maya và Leo thuyết trình về một bài báo nói về thử nghiệm "tuần làm việc bốn ngày" ở 72 công ty. Ba người nói: phân biệt giọng thầy (nam, Anh), Maya (nữ, Anh), Leo (nam, Mỹ). Chú ý: lý do THẬT thầy chọn bài, điều làm Maya BẤT NGỜ, điểm yếu theo Leo; nhận xét về TỪNG phần của bài báo; cách mở đầu buổi thuyết trình và việc Leo sẽ làm.',
      docTruoc: 40,
      loi: [
        { ai: 'Dr Reed', giong: 'uk-nam', s: `Come in, both of you. So, you're presenting the article on the four-day working week at next Thursday's seminar. Have you both read it?` },
        { ai: 'Maya', giong: 'uk-nu', s: `Yes, twice. Can I ask why you picked this one, Dr Reed? Is it because it's the latest research?` },
        { ai: 'Dr Reed', giong: 'uk-nam', s: `Not at all. It's two years old, and more recent studies exist. And I didn't choose it because I agree with the writer, either. I'm not sure that I do. I chose it because it's a very clear example of how a writer uses evidence to support an argument, and that's what I'd like the class to think about.` },
        { ai: 'Leo', giong: 'us-nam', s: `That makes sense. Maya, what did you think of the trial itself?` },
        { ai: 'Maya', giong: 'uk-nu', s: `Well, I already knew that seventy-two companies had taken part, because it was in the news at the time. And the workers' pay stayed exactly the same, which is the whole idea. What I didn't expect was that, when the trial ended, only three of the companies returned to a five-day week. I found that amazing.` },
        { ai: 'Leo', giong: 'us-nam', s: `Me too. But I do have a problem with it. It isn't the length of the trial. Six months seems reasonable to me. And the writer clearly visited several of the workplaces. My problem is that every one of those companies volunteered. They already believed in the idea before they began, so of course they were pleased with the results.` },
        { ai: 'Dr Reed', giong: 'uk-nam', s: `That's a fair point, Leo. Now, I have to go to a meeting, so I'll leave you two to plan. Go through the article section by section.` },
        { ai: 'Maya', giong: 'uk-nu', s: `Thanks, Dr Reed. OK, Leo. Let's start with the introduction. I loved the story about the factory manager who was sure the idea would fail.` },
        { ai: 'Leo', giong: 'us-nam', s: `Yeah, it made me laugh. To be honest, it's the one part of the article that's fun to read. Everything after it is pretty dry.` },
        { ai: 'Maya', giong: 'uk-nu', s: `Agreed. Then there's the background section, on the history of working hours. I checked the figures in it. They all come from a survey carried out more than twelve years ago. Working life has changed so much since then.` },
        { ai: 'Leo', giong: 'us-nam', s: `Right, so we can't really rely on that part. What about the description of the trial?` },
        { ai: 'Maya', giong: 'uk-nu', s: `It isn't too long, but there are so many numbers and percentages packed into one paragraph that I had to read it three times before I understood it.` },
        { ai: 'Leo', giong: 'us-nam', s: `Same here. I got completely lost. A simple table would have helped. Now, the interviews. I expected those to be the most convincing part of the article.` },
        { ai: 'Maya', giong: 'uk-nu', s: `And they weren't?` },
        { ai: 'Leo', giong: 'us-nam', s: `Well, the quotes are nice. But look at who the writer talked to: managers and full-time office staff. Nobody asked the part-time workers, and they're the people whose hours were most difficult to organize.` },
        { ai: 'Maya', giong: 'uk-nu', s: `Good point. I hadn't noticed that. And the conclusion?` },
        { ai: 'Leo', giong: 'us-nam', s: `At least it doesn't just repeat the results. But it's four lines! I wanted to know what the writer thinks governments should do next, and there's almost nothing.` },
        { ai: 'Maya', giong: 'uk-nu', s: `Yes, there was room for a lot more. OK, so how do we begin the presentation?` },
        { ai: 'Leo', giong: 'us-nam', s: `With a short summary of the article?` },
        { ai: 'Maya', giong: 'uk-nu', s: `Everyone will have read it, so that might be boring. What about a video clip from one of the companies?` },
        { ai: 'Leo', giong: 'us-nam', s: `Remember last time? The projector in that room wouldn't play any sound. I don't want to risk it.` },
        { ai: 'Maya', giong: 'uk-nu', s: `True. Then why don't we open by asking the class whether they would accept a four-day week if it meant longer days? Just a show of hands.` },
        { ai: 'Leo', giong: 'us-nam', s: `I like that. It gets people involved right away. Let's do that, and put the summary second.` },
        { ai: 'Maya', giong: 'uk-nu', s: `Great. Before we meet again, I'll find a second article that we can compare with this one. Could you email Dr Reed and ask how long we've got?` },
        { ai: 'Leo', giong: 'us-nam', s: `There's no need. He told us in class: fifteen minutes. I'll make a start on the slides instead.` },
        { ai: 'Maya', giong: 'uk-nu', s: `Perfect. See you on Monday, then.` },
      ],
      nhom: [
        {
          id: 'n3-mcq-a', tu: 21, den: 23, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 21, s: 'Why did Dr Reed choose this article for the seminar?', chon: [{ k: 'A', t: 'It was published very recently.' }, { k: 'B', t: 'He agrees with its conclusions.' }, { k: 'C', t: 'It shows how evidence can be used.' }] },
            { n: 22, s: 'What surprised Maya about the trial?', chon: [{ k: 'A', t: 'the number of companies that took part' }, { k: 'B', t: 'how few companies went back to five days' }, { k: 'C', t: 'what happened to the workers\' pay' }] },
            { n: 23, s: 'What does Leo think is the main weakness of the trial?', chon: [{ k: 'A', t: 'The companies had chosen to take part.' }, { k: 'B', t: 'It did not last long enough.' }, { k: 'C', t: 'The writer did not see the workplaces.' }] },
          ],
        },
        {
          id: 'n3-match', tu: 24, den: 28, dang: 'match-feature',
          huongDan: 'What do the students say about each section of the article?\nChoose **FIVE** answers from the box and write the correct letter, **A–G**, next to Questions 24–28.',
          hop: {
            tieuDe: 'Comments',
            ds: [
              { k: 'A', t: 'It is difficult to follow.' },
              { k: 'B', t: 'It is the most convincing part.' },
              { k: 'C', t: 'It leaves out an important group of people.' },
              { k: 'D', t: 'It should have been longer.' },
              { k: 'E', t: 'It repeats information given earlier.' },
              { k: 'F', t: 'It uses information that is out of date.' },
              { k: 'G', t: 'It is more entertaining than the other sections.' },
            ],
          },
          cau: [
            { n: 24, s: 'the introduction' },
            { n: 25, s: 'the background section' },
            { n: 26, s: 'the description of the trial' },
            { n: 27, s: 'the interviews' },
            { n: 28, s: 'the conclusion' },
          ],
        },
        {
          id: 'n3-mcq-b', tu: 29, den: 30, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 29, s: 'How do Maya and Leo decide to begin their presentation?', chon: [{ k: 'A', t: 'by summarising the article' }, { k: 'B', t: 'by showing a short video' }, { k: 'C', t: 'by asking the class a question' }] },
            { n: 30, s: 'What will Leo do before the students\' next meeting?', chon: [{ k: 'A', t: 'look for another article' }, { k: 'B', t: 'begin preparing the slides' }, { k: 'C', t: 'send an email to the tutor' }] },
          ],
        },
      ],
    },

    /* ════════════════ PART 4 — bài giảng: trẻ em học nói thế nào (giọng Canada) ════════════════ */
    {
      so: 4,
      tieuDe: 'Lecture — How children learn language',
      dan: 'Part 4. You will hear part of a lecture about how young children learn their first language. First, you have some time to look at questions 31 to 40.',
      boiCanh: 'Một giảng viên người Canada giảng về cách trẻ nhỏ học tiếng mẹ đẻ: trước khi nói từ đầu tiên, những từ đầu tiên, ngữ pháp, rồi vai trò của người lớn. Bài giảng không có ai hỏi lại — nghe các mốc tuổi (two months, six months, twelve months, eighteen months) để biết đang ở dòng ghi chú nào. Chú ý bẫy: phụ âm / nguyên âm, toys / animals, 500 / 50, louder / slowly.',
      docTruoc: 45,
      loi: [
        { ai: 'Lecturer', giong: 'ca-nu', s: `Good afternoon. Today we're looking at one of the most remarkable things that human beings do. Within about four years, and without any formal teaching, almost every child learns to speak the language around them. How does that happen?` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `Let's begin before the first word. Learning actually starts before birth. Tests show that newborn babies, only a few days old, already prefer their mother's voice to that of any other woman. They have been listening to it for months.` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `At around two months, babies begin what we call cooing. These are soft, happy sounds, and they consist mainly of vowels. Consonants come later. By about six months, we hear babbling, where the baby repeats a syllable again and again: ba-ba-ba, da-da-da. Interestingly, deaf babies whose parents use sign language babble too. They do it with their hands.` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `Something else happens in the first year. A six-month-old baby can hear the difference between sounds from any language in the world. But research carried out here in Canada, in Vancouver, showed that by ten to twelve months babies stop noticing differences that don't matter in their own language. In a sense, they become specialists.` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `The first real word usually appears at about twelve months. You might expect first words to be the names of toys. In fact, apart from the people around them and food, what children name most often is animals: dog, cat, duck.` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `Progress is slow to begin with. At eighteen months, a typical child can say about fifty words. Not five hundred, as some parents hope, but fifty. Then comes what researchers call the word spurt, when children suddenly start learning several new words every day.` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `Around the age of two, words are joined together into two-word sentences, like 'more juice' or 'daddy gone'. And soon after that, children start making some very interesting mistakes. They say 'goed' instead of 'went', and 'mouses' instead of 'mice'. No adult says these things, so the child cannot be copying. These errors show us that children are working out the rules of the language for themselves.` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `This was demonstrated in a famous experiment in 1958, known as the wug test. Children were shown a drawing of an imaginary bird and told, 'This is a wug.' Then they saw two of them, and the researcher said, 'Now there are two…' Most four-year-olds answered 'wugs', a word they had never heard before.` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `So what part do adults play? All over the world, adults change the way they talk when they speak to a baby. The pitch of the voice goes up. People often believe that they talk more loudly as well, but recordings show that loudness hardly changes. What they do is speak more slowly, and this seems to help babies to find where one word ends and the next begins.` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `But the language has to come from a human being. In one well-known study, nine-month-old American babies spent twelve sessions with a Chinese speaker, who played with them and read to them, and they learned to recognize the sounds of Chinese. A second group watched exactly the same sessions as a video. They learned nothing at all.` },
        { ai: 'Lecturer', giong: 'ca-nu', s: `What does this mean for parents? The message from the research is quite simple. Children do not need expensive toys or special programs. What helps them most is ordinary, everyday conversation, in which the adult and the child take turns. Next week, we'll look at children who grow up with two languages.` },
      ],
      nhom: [
        {
          id: 'n4-note', tu: 31, den: 36, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'How children learn their first language',
          dong: [
            '## Before the first word',
            '• newborn babies already prefer their mother\'s [[31]]',
            '• 2 months: \'cooing\' – soft sounds made up mostly of [[32]]',
            '• 6 months: \'babbling\' – deaf babies babble using their [[33]]',
            '• 10–12 months: babies no longer notice sound differences that are not important in their own language',
            '## First words',
            '• about 12 months: first word – usually names of people, food or [[34]]',
            '• 18 months: about [[35]] words; after this, the \'word spurt\'',
            '## Grammar',
            '• about age 2: two-word sentences, e.g. \'more juice\'',
            '• mistakes such as \'goed\' and \'mouses\' prove that children are discovering [[36]], not copying adults',
          ],
        },
        {
          id: 'n4-sentence', tu: 37, den: 40, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          dong: [
            'In the 1958 \'wug test\', children looked at a picture of an invented [[37]].',
            'When adults talk to babies, their voices become higher and they speak more [[38]].',
            'In one study, babies learned foreign sounds from a real person but not from a [[39]].',
            'According to the lecturer, what helps children most is everyday [[40]].',
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Part 1 ── */
    1: { a: ['38'], vi: `Ryan đọc trên web $32 — Dana: "$32 is the rate if you keep the car for a week or longer. For a shorter rental, it's $38 a day." Bảng ghi "rentals of under a week" = "a shorter rental" ⇒ **38**. Bẫy giá có ĐIỀU KIỆN: $32 chỉ dành cho thuê từ một tuần (và cuối bài Ryan thuê 6 ngày). 📘 Ôn Table completion khi nghe: Tập 2 Ngày 5; bẫy đổi ý: Tập 3 Ngày 9.`, ev: `For a shorter rental, it's $38 a day.` },
    2: { a: ['suitcases'], vi: `"There are seats for four people, but the trunk only has room for two suitcases." ⇒ **suitcases** (số nhiều vì sau "two" — viết "suitcase" là mất điểm). "trunk" = cốp xe (Anh–Anh: boot). Bảng đã in sẵn "four seats, but…" ⇒ đáp án đứng sau "but".`, ev: `There are seats for four people, but the trunk only has room for two suitcases.` },
    3: { a: ['miles'], vi: `"with the midsize you get unlimited miles, so you can drive as far as you like and pay nothing extra" ⇒ **miles**. Bẫy: "a hundred miles a day" là giới hạn của xe ECONOMY — ô trống cần danh từ sau "unlimited", không phải con số.`, ev: `And with the midsize you get unlimited miles, so you can drive as far as you like and pay nothing extra.` },
    4: { a: ['62'], vi: `"In summer it's normally $70 a day, but there's a special offer on at the moment, so I can give it to you for $62." ⇒ **62**. Bảng ghi "(special offer)" ⇒ lấy giá khuyến mãi, không lấy giá thường lệ $70. "normally… but…" là khuôn bẫy quen thuộc.`, ev: `In summer it's normally $70 a day, but there's a special offer on at the moment, so I can give it to you for $62.` },
    5: { a: ['tank'], vi: `"The only special rule for the SUV is that you have to bring it back with a full tank." — "return it" = "bring it back" ⇒ **tank** (bình xăng). Đừng điền "gas": "a full gas" sai ngữ pháp.`, ev: `The only special rule for the SUV is that you have to bring it back with a full tank.` },
    6: { a: ['Kowalski'], vi: `"Ryan Kowalski. That's K, O, W, A, L, S, K, I." — Dana đọc lại đúng từng chữ ⇒ **Kowalski**. Giọng Mỹ đọc chữ A /eɪ/, I /aɪ/ như Anh–Anh; chú ý W "double-u" và hai chữ K. 📘 Ôn Form completion: Tập 2 Ngày 1; giọng trộn: Tập 3 Ngày 1.`, ev: `Ryan Kowalski. That's K, O, W, A, L, S, K, I.` },
    7: { a: ['downtown'], vi: `Ryan định nhận xe ở sân bay ("That was my plan") — Dana báo phụ phí $50 ở sân bay; Ryan đổi ý: "We'll take a cab from the airport, and I'll pick the car up downtown." ⇒ **downtown** (viết liền). "airport" là kế hoạch BAN ĐẦU đã bị thay.`, ev: `We'll take a cab from the airport, and I'll pick the car up downtown.` },
    8: { a: ['14', '14th', 'fourteenth'], vi: `"We land on the evening of June thirteenth, but we won't need a car that night. So let's say the morning of the fourteenth." ⇒ **14**. Phiếu hỏi ngày NHẬN XE, không phải ngày hạ cánh (13). Cặp dễ lẫn khi nghe: thirteenth / fourteenth (và 20 "twentieth" là ngày bay về). 📘 Ôn số liệu khi nghe: Tập 3 Ngày 5.`, ev: `So let's say the morning of the fourteenth.` },
    9: { a: ['6', 'six'], vi: `Dana gợi ý "A week?" — Ryan: "That's what I thought at first, but our flight home is on the twentieth, so we only need it for six days." ⇒ **6**. "at first… but…" báo đổi ý. (Cũng vì 6 ngày < một tuần nên giá $32 ở câu 1 không áp dụng.)`, ev: `That's what I thought at first, but our flight home is on the twentieth, so we only need it for six days.` },
    10: { a: ['wife'], vi: `"My brother was going to share the driving, but he can't come with us now. So it'll be my wife." ⇒ **wife**. Bẫy "was going to… but…": anh trai là kế hoạch đã HUỶ. Dana xác nhận: "we don't charge for a husband or wife".`, ev: `So it'll be my wife.` },

    /* ── Part 2 ── */
    11: { a: ['B'], vi: `"People often assume that this land used to be farmland… In fact, for nearly forty years a company dug sand and gravel out of the ground here." ⇒ **B**. A (trồng trọt) là điều người ta TƯỞNG — "In fact" bác bỏ; C: bò có thật nhưng do khu bảo tồn đưa vào SAU này ("we brought those in ourselves"). 📘 Ôn MCQ Part 2: Tập 3 Ngày 4.`, ev: `In fact, for nearly forty years a company dug sand and gravel out of the ground here.` },
    12: { a: ['A'], vi: `"The visitor centre isn't new… That opened three years ago. What we finished this spring is the wooden boardwalk" ⇒ **A**. B đã có từ ba năm trước; C mới là mong muốn, còn chờ giấy phép ("that won't happen this year"). Cả ba phương án đều được nhắc — phải nghe MỐC THỜI GIAN của từng thứ.`, ev: `What we finished this spring is the wooden boardwalk, which lets you cross the marsh without getting your feet wet.` },
    13: { a: ['C'], vi: `"Dogs are welcome, as long as they are kept on a lead. Bicycles are fine too… The one thing we never allow is leaving the marked paths." — "walk off the paths" = "leaving the marked paths" ⇒ **C**. A và B đều ĐƯỢC phép (có điều kiện). "The one thing…" báo đáp án.`, ev: `The one thing we never allow is leaving the marked paths.` },
    14: { a: ['A'], vi: `"Most guidebooks will tell you to look for otters at dusk. That may be true elsewhere, but ours are most active just after sunrise" — "early in the morning" = "just after sunrise" ⇒ **A**. C (buổi tối = dusk) là lời SÁCH, không phải lời kiểm lâm về hồ này; B: giữa ngày rái cá ngủ. Câu hỏi ghi rõ "According to the ranger… at Heron Lake".`, ev: `That may be true elsewhere, but ours are most active just after sunrise, so tell visitors to come as early as they can.` },
    15: { a: ['B'], vi: `Từ visitor centre "take the path that goes left around the lake. The hide is the first thing you come to, on the edge of the water, just before the marsh begins." ⇒ **B** (sát mép nước ở góc tây nam của hồ, trước khi lối đi vào vùng đầm lầy). Bẫy: A nằm sát bên trái visitor centre nhưng đó chỉ là chỗ nhân viên để xe; C nằm TRONG đầm lầy. 📘 Ôn Map labelling: Tập 2 Ngày 7, Tập 3 Ngày 4 + 12.`, ev: `The hide is the first thing you come to, on the edge of the water, just before the marsh begins.` },
    16: { a: ['H'], vi: `"The picnic area isn't by the lake, because food attracts rats. It's beside the car park, on the east side." ⇒ **H** (bên phải bãi xe — bản đồ có mũi tên N chỉ lên, nên đông = bên phải). Bẫy: người nghe dễ đoán chỗ ăn ở ven hồ (B, F) — bị phủ định ngay.`, ev: `It's beside the car park, on the east side.` },
    17: { a: ['D'], vi: `Đi tiếp qua đầm lầy tới con sông ở phía trên bản đồ: "The otter viewing platform is on this side of the river, a short distance to the west of the bridge." ⇒ **D** (bờ nam của sông, bên trái cây cầu). E ở bờ BÊN KIA sông nên loại.`, ev: `The otter viewing platform is on this side of the river, a short distance to the west of the bridge.` },
    18: { a: ['E'], vi: `"Now cross the bridge. The wildflower meadow is on the far side of the river, and it's the only part of the reserve that lies north of it." ⇒ **E** — chữ duy nhất nằm phía bắc con sông.`, ev: `The wildflower meadow is on the far side of the river, and it's the only part of the reserve that lies north of it.` },
    19: { a: ['G'], vi: `Quay lại qua cầu, đi tiếp vòng hồ: "At the north-east corner, a narrow path leads away from the water into the trees. The outdoor classroom is at the end of that path, in the middle of the woodland." ⇒ **G** (cuối lối mòn, giữa rừng). F cũng ở phía đông nhưng nằm sát MÉP NƯỚC.`, ev: `The outdoor classroom is at the end of that path, in the middle of the woodland.` },
    20: { a: ['F'], vi: `"the boat shed… That's further down the east side of the lake, right on the shore, where the woodland meets the water." ⇒ **F** (bờ đông của hồ, chỗ rừng chạm nước). "further down" = đi tiếp xuống phía nam so với lối rẽ vào rừng.`, ev: `That's further down the east side of the lake, right on the shore, where the woodland meets the water.` },

    /* ── Part 3 ── */
    21: { a: ['C'], vi: `Maya đoán "the latest research?" — thầy: "Not at all. It's two years old… And I didn't choose it because I agree with the writer, either… I chose it because it's a very clear example of how a writer uses evidence to support an argument" ⇒ **C**. A và B đều bị chính thầy bác bỏ trước khi nêu lý do thật. 📘 Ôn Part 3 ba người nói: Tập 3 Ngày 8.`, ev: `I chose it because it's a very clear example of how a writer uses evidence to support an argument, and that's what I'd like the class to think about.` },
    22: { a: ['B'], vi: `"I already knew that seventy-two companies had taken part… And the workers' pay stayed exactly the same… What I didn't expect was that… only three of the companies returned to a five-day week." — "surprised" = "didn't expect"; "how few… went back" = "only three… returned" ⇒ **B**. A: cô đã biết từ trước; C: lương không đổi, không có gì bất ngờ.`, ev: `What I didn't expect was that, when the trial ended, only three of the companies returned to a five-day week.` },
    23: { a: ['A'], vi: `"It isn't the length of the trial. Six months seems reasonable to me. And the writer clearly visited several of the workplaces. My problem is that every one of those companies volunteered." — "had chosen to take part" = "volunteered" ⇒ **A**. B và C bị Leo loại lần lượt rồi mới nói "My problem is…".`, ev: `My problem is that every one of those companies volunteered.` },
    24: { a: ['G'], vi: `Phần mở bài: Maya thích câu chuyện ông quản đốc; Leo: "it made me laugh. To be honest, it's the one part of the article that's fun to read. Everything after it is pretty dry." — "more entertaining than the other sections" = "the one part… that's fun to read" ⇒ **G**. 📘 Ôn Matching khi nghe: Tập 2 Ngày 15, Tập 3 Ngày 8.`, ev: `To be honest, it's the one part of the article that's fun to read.` },
    25: { a: ['F'], vi: `Phần bối cảnh: "I checked the figures in it. They all come from a survey carried out more than twelve years ago. Working life has changed so much since then." — "out of date" = số liệu hơn 12 năm trước, nay đã khác ⇒ **F**. Leo chốt: "we can't really rely on that part".`, ev: `They all come from a survey carried out more than twelve years ago.` },
    26: { a: ['A'], vi: `Phần mô tả thử nghiệm: "It isn't too long, but there are so many numbers and percentages packed into one paragraph that I had to read it three times before I understood it." Leo: "I got completely lost." — "difficult to follow" ⇒ **A**. Bẫy D: "It isn't too long" nói về độ dài nhưng KHÔNG phải ý "lẽ ra nên dài hơn".`, ev: `It isn't too long, but there are so many numbers and percentages packed into one paragraph that I had to read it three times before I understood it.` },
    27: { a: ['C'], vi: `Phần phỏng vấn: Leo TƯỞNG đây là phần thuyết phục nhất (bẫy B — "I expected…", rồi "the quotes are nice. But…"). Nhận xét thật: "Nobody asked the part-time workers, and they're the people whose hours were most difficult to organize." — "leaves out an important group" ⇒ **C**.`, ev: `Nobody asked the part-time workers, and they're the people whose hours were most difficult to organize.` },
    28: { a: ['D'], vi: `Phần kết: "At least it doesn't just repeat the results (loại E). But it's four lines! I wanted to know what the writer thinks governments should do next, and there's almost nothing." Maya: "there was room for a lot more." — "should have been longer" ⇒ **D**.`, ev: `I wanted to know what the writer thinks governments should do next, and there's almost nothing.` },
    29: { a: ['C'], vi: `Ba phương án lần lượt: tóm tắt (Maya: "that might be boring") → video (Leo: máy chiếu không ra tiếng, "I don't want to risk it") → Maya: "why don't we open by asking the class whether they would accept a four-day week…?" — Leo: "I like that… Let's do that, and put the summary second." ⇒ **C**. Tóm tắt vẫn có nhưng đứng THỨ HAI.`, ev: `Then why don't we open by asking the class whether they would accept a four-day week if it meant longer days?` },
    30: { a: ['B'], vi: `Maya sẽ tìm bài báo thứ hai (A là việc của MAYA) và nhờ Leo email thầy — Leo: "There's no need. He told us in class: fifteen minutes. I'll make a start on the slides instead." — "begin preparing" = "make a start on" ⇒ **B**. "instead" báo việc thay thế cho C.`, ev: `I'll make a start on the slides instead.` },

    /* ── Part 4 ── */
    31: { a: ['voice'], vi: `"newborn babies, only a few days old, already prefer their mother's voice to that of any other woman" ⇒ **voice**. Ghi chú giữ nguyên cụm "prefer their mother's…" — nghe đúng cụm đó là bắt được. 📘 Ôn Note completion Part 4: Tập 3 Ngày 13.`, ev: `Tests show that newborn babies, only a few days old, already prefer their mother's voice to that of any other woman.` },
    32: { a: ['vowels'], vi: `"These are soft, happy sounds, and they consist mainly of vowels. Consonants come later." — "made up mostly of" = "consist mainly of" ⇒ **vowels** (nguyên âm; số nhiều). Bẫy: "consonants" (phụ âm) đến SAU, không thuộc giai đoạn cooing.`, ev: `These are soft, happy sounds, and they consist mainly of vowels.` },
    33: { a: ['hands'], vi: `"deaf babies whose parents use sign language babble too. They do it with their hands." — "using their" = "with their" ⇒ **hands** (số nhiều). Mốc nghe: "six months… babbling… deaf babies".`, ev: `They do it with their hands.` },
    34: { a: ['animals'], vi: `"You might expect first words to be the names of toys. In fact, apart from the people around them and food, what children name most often is animals: dog, cat, duck." ⇒ **animals**. Bẫy "You might expect… In fact…": "toys" là điều ta TƯỞNG. Ghi chú đã có "people, food" ⇒ ô trống là nhóm thứ ba.`, ev: `In fact, apart from the people around them and food, what children name most often is animals: dog, cat, duck.` },
    35: { a: ['50', 'fifty'], vi: `"At eighteen months, a typical child can say about fifty words. Not five hundred, as some parents hope, but fifty." ⇒ **50**. Giảng viên nêu cả con số sai (500) để nhấn — cặp fifty / five hundred; "eighteen months" là mốc của dòng ghi chú. 📘 Ôn số liệu khi nghe: Tập 3 Ngày 5.`, ev: `At eighteen months, a typical child can say about fifty words.` },
    36: { a: ['rules'], vi: `"No adult says these things, so the child cannot be copying. These errors show us that children are working out the rules of the language for themselves." — "prove" = "show us"; "discovering" = "working out" ⇒ **rules** (số nhiều). Paraphrase đổi cả động từ lẫn cấu trúc — mức band 5.5–6.`, ev: `These errors show us that children are working out the rules of the language for themselves.` },
    37: { a: ['bird'], vi: `"Children were shown a drawing of an imaginary bird and told, 'This is a wug.'" — "looked at a picture" = "were shown a drawing"; "invented" = "imaginary" ⇒ **bird**. Đừng điền "wug": đó là TÊN đặt cho con vật, và câu hỏi cần một danh từ chỉ loài. 📘 Ôn Sentence completion khi nghe: Tập 2 Ngày 19.`, ev: `Children were shown a drawing of an imaginary bird and told, 'This is a wug.'` },
    38: { a: ['slowly'], vi: `"The pitch of the voice goes up. People often believe that they talk more loudly as well, but recordings show that loudness hardly changes. What they do is speak more slowly" ⇒ **slowly**. Bẫy: "loudly" là điều người ta TIN nhưng băng ghi âm cho thấy độ to hầu như không đổi. Cần trạng từ sau "speak more…" (không viết "slow").`, ev: `What they do is speak more slowly, and this seems to help babies to find where one word ends and the next begins.` },
    39: { a: ['video'], vi: `Nhóm một học từ người nói tiếng Trung thật; "A second group watched exactly the same sessions as a video. They learned nothing at all." — "not from a…" ⇒ **video**. Câu hỏi đảo thứ tự: người thật (học được) trước, video (không học được) sau.`, ev: `A second group watched exactly the same sessions as a video.` },
    40: { a: ['conversation'], vi: `"Children do not need expensive toys or special programs. What helps them most is ordinary, everyday conversation, in which the adult and the child take turns." ⇒ **conversation**. Câu hỏi lặp đúng cụm "What helps… most" — đáp án đứng ngay sau "everyday". Bẫy: "toys", "programs" là thứ KHÔNG cần.`, ev: `What helps them most is ordinary, everyday conversation, in which the adult and the child take turns.` },
  },
};
