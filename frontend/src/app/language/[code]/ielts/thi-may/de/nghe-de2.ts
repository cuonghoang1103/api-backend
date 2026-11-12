/**
 * Đề 2 — Listening, sau TẬP 2 NGÀY 12 (docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 12/11/2026.
 * Mức band 4.5: đúng format thật (4 Part × 10 câu, nghe MỘT lần), từ vựng A2–B1, ~130 từ/phút. So với Đề 1: bẫy "đổi ý"
 * dày hơn (T2 N11: actually / in fact / what is different…), Part 3 có nối "giai đoạn – khó khăn" phải nghe paraphrase.
 * Bối cảnh theo mục 4.2: đặt phòng khách sạn · hướng dẫn bảo tàng (sơ đồ, giọng Mỹ — T2 N7) · hai sinh viên làm đồ án nhóm ·
 * bài giảng về ong mật. Chỉ dùng dạng ĐÃ DẠY tới Tập 2 Ngày 12:
 *   Part 1: Form (T1 N7, T2 N1) + Table (T2 N5) · Part 2: MCQ + Plan labelling (T1 N9, T2 N7) ·
 *   Part 3: MCQ + Matching (T1 N11) · Part 4: Note completion (T1 N13).
 *   (CHƯA dùng: chọn TWO, flow-chart — T2 N13; sentence completion / short answer khi nghe — T2 N19.)
 * Bẫy chính: C/K + "double S"; thứ Sáu 15 → thứ Năm 14; 2 đêm → 3 đêm; £65 năm ngoái → £70; trẻ em £5 / người lớn £8;
 * post office → bank; railway station → factory; 120 gửi / 60 tuần đầu / 85 cuối cùng; thứ Hai 10 (thuyết trình) → thứ Sáu 14;
 * six weeks (hè) / several months (thu); water ↔ wax.
 * Dữ kiện ong mật đã đối chiếu 12/11/2026 (Wikipedia: Western honey bee): đàn giữa hè 40.000–80.000 con; ong chúa đẻ tới
 * 2.000 trứng/ngày; ong thợ đều là ong cái, mùa hè sống vài tuần; ong đực không có ngòi; mật hoa ~80% nước, quạt cánh làm khô;
 * ong thợ 1–10 ngày tuổi dọn tổ + nuôi ấu trùng, sau ~10 ngày xây ô tổ, 16–20 ngày nhận/cất mật, sau ~20 ngày đi kiếm ăn.
 * KHÔNG hỏi về điệu nhảy / von Frisch: bài đọc Tập 2 Ngày 10 (học trước Đề 2) đã dạy trọn ⇒ lộ đáp án (bỏ 12/11/2026).
 * Khách sạn, bảo tàng, nhân vật đều HƯ CẤU.
 * Giọng: uk-nu, uk-nam, us-nu, us-nam (đủ 4). `ev` = chuỗi NGUYÊN VĂN trong một lượt lời.
 */
import type { DeNghe } from './types';

export const NGHE_DE2: DeNghe = {
  id: 'nghe-de2',
  kyNang: 'nghe',
  ten: 'Listening — Đề 2 (Tập 2 · Ngày 12)',
  boDe: 'Đề 2',
  capDo: 'Band 4.5',
  moTa: 'Booking a hotel room · Museum introduction & ground-floor plan · Two students review a group project · Lecture on honeybees',
  phut: 30,
  phan: [
    /* ════════════════ PART 1 — đặt phòng khách sạn ════════════════ */
    {
      so: 1,
      tieuDe: 'Harbour View Hotel — booking a room',
      dan: 'Part 1. You will hear a man telephoning a hotel to book a room. First, you have some time to look at questions 1 to 10.',
      boiCanh: 'Ông Daniel gọi điện đặt phòng đôi ở khách sạn Harbour View. Chú ý: đánh vần họ (C hay K, "double S"), ngày đến ĐÃ ĐỔI, số đêm ĐÃ ĐỔI, số di động, lý do chuyến đi; phần bảng: giá phòng năm nay (không phải năm ngoái), phòng có gì / không có gì, giá bữa sáng người lớn (không phải trẻ em), bãi đỗ xe ở đâu.',
      docTruoc: 30,
      loi: [
        { ai: 'Receptionist', giong: 'uk-nu', s: 'Good morning, Harbour View Hotel. Emma speaking. How can I help you?' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'Hello. I\'d like to book a double room for next month, please.' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'Certainly. Can I take your name first?' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'Yes, it\'s Daniel Kessler.' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'Is that Kessler with a C or with a K?' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'With a K. That\'s K, E, double S, L, E, R.' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'K, E, double S, L, E, R. Thank you, Mr Kessler. And when would you like to arrive?' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'On Friday the fifteenth of July. Oh, wait a minute. Sorry, my wife has changed our plans. We\'re coming a day earlier now, so that\'s Thursday the fourteenth.' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'The fourteenth of July. No problem. And how many nights will you stay?' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'Well, I wanted two nights at first, but we\'d like to see a little of the town as well. So let\'s say three nights, please.' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'Three nights. So you will leave on Sunday the seventeenth. Can I have a contact number?' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'Of course. My mobile number is 07911 426 380.' },
        { ai: 'Receptionist', giong: 'uk-nu', s: '07911 426 380. Lovely. Are you coming on business, Mr Kessler, or is it a holiday?' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'Neither, really. An old friend from university is getting married in your town, so we\'re coming for the wedding.' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'Oh, how nice. A wedding. I\'ll make a note of that. Now, let me tell you about our rooms. We have two kinds of double room. The standard double is at the back of the hotel. Last year it was sixty-five pounds a night, but the price is now seventy pounds.' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'Seventy pounds. OK. And what is the room like?' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'It\'s quite small, but it\'s very quiet. I should tell you that it doesn\'t have a bath. There is a shower, though.' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'A shower is fine for us. What\'s the other kind of room?' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'That\'s the sea-view double. It\'s ninety-five pounds a night. Those rooms are on the top floor, and each one has a small balcony, so you can sit outside and look at the harbour.' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'A balcony! My wife would love that. Let\'s take the sea-view room.' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'Good choice. Now, breakfast is not included in the price. It costs eight pounds per person. For children under ten, it\'s five pounds.' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'Eight pounds each. That\'s fine. We haven\'t got any children with us. One more thing. We\'re coming by car. Is there anywhere to park?' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'Yes, we have a free car park for guests. It isn\'t next to the hotel, though. A lot of people look for it beside the post office, but it\'s actually behind the bank, on the other side of the street.' },
        { ai: 'Daniel', giong: 'uk-nam', s: 'Behind the bank. I\'ll remember that. Thank you very much for your help.' },
        { ai: 'Receptionist', giong: 'uk-nu', s: 'You\'re welcome, Mr Kessler. We look forward to seeing you in July.' },
      ],
      nhom: [
        {
          id: 'n1-form', tu: 1, den: 5, dang: 'form',
          huongDan: 'Complete the form below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Harbour View Hotel — Booking Form',
          dong: [
            'Type of room: double',
            'Guest\'s name: Daniel [[1]]',
            'Date of arrival: [[2]] July',
            'Number of nights: [[3]]',
            'Mobile phone: [[4]]',
            'Reason for visit: a friend\'s [[5]]',
          ],
        },
        {
          id: 'n1-table', tu: 6, den: 10, dang: 'table',
          huongDan: 'Complete the table below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Rooms and services',
          bang: {
            dau: ['Room / service', 'Cost', 'Notes'],
            hang: [
              ['Standard double', '£[[6]] per night', 'at the back of the hotel; has a [[7]] but no bath'],
              ['Sea-view double', '£95 per night', 'on the top floor; has a small [[8]]'],
              ['Breakfast', '£[[9]] per adult', 'not included in the room price'],
              ['Car park', 'free for guests', 'behind the [[10]]'],
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 2 — giới thiệu bảo tàng + sơ đồ tầng trệt ════════════════ */
    {
      so: 2,
      tieuDe: 'Castleford Museum — information for visitors',
      dan: 'Part 2. You will hear a guide giving information to a group of visitors at the entrance of a museum. First, you have some time to look at questions 11 to 20.',
      boiCanh: 'Maria, hướng dẫn viên bảo tàng Castleford (giọng Mỹ), giới thiệu toà nhà, điều MỚI trong tháng này, điều KHÔNG được làm trong phòng trưng bày, nên bắt đầu từ đâu; rồi tả sơ đồ tầng trệt. Bạn đứng ngoài cổng ở Museum Street (phía dưới sơ đồ) và đi vào: "on your left / right" tính theo hướng đi vào.',
      docTruoc: 40,
      loi: [
        { ai: 'Maria', giong: 'us-nu', s: 'Good morning, everyone, and welcome to Castleford Museum. My name is Maria. Before you go in, I\'d like to give you some information about the museum and show you where everything is.' },
        { ai: 'Maria', giong: 'us-nu', s: 'First, a little about the building. It is more than a hundred and fifty years old. Because of the tall clock tower, a lot of visitors think that it was once a railway station. In fact, it was built as a factory. Shoes and boots were made here until 1970, and the museum opened ten years later.' },
        { ai: 'Maria', giong: 'us-nu', s: 'Now, some practical things. A ticket still costs six pounds, the same as last year, and guided tours are still only on Saturdays and Sundays. What is different this month is our opening hours. On Fridays, we now stay open until nine in the evening, so you can come after work.' },
        { ai: 'Maria', giong: 'us-nu', s: 'Inside the galleries, please feel free to take photographs. We only ask you not to use a flash. You may also keep your bag with you if it is a small one. What we do not allow in the galleries is food or drink. If you are hungry or thirsty, please use the café.' },
        { ai: 'Maria', giong: 'us-nu', s: 'Where should you begin? Well, most people go straight up to the top floor, because that is where the famous old cars are. Others wait for a tour. My advice is different. Before you do anything else, watch our short film. It is only ten minutes long, and it tells the story of the town. After that, everything else in the museum will make more sense.' },
        { ai: 'Maria', giong: 'us-nu', s: 'Now let me show you where things are on the ground floor. Please look at the plan. We are standing outside the entrance on Museum Street. When you go in, the ticket desk is directly in front of you.' },
        { ai: 'Maria', giong: 'us-nu', s: 'If you have a heavy coat or an umbrella, you can leave it in the cloakroom. That is the first room on your left, just inside the entrance. The gift shop is on the other side, immediately on your right as you go in. People usually visit it at the end, on their way out.' },
        { ai: 'Maria', giong: 'us-nu', s: 'Now, walk past the ticket desk into the main hall. In the middle of the hall, you will see a big steam engine. The cinema room, where the film is shown, is on the left-hand side of the hall, next to the cloakroom. The room opposite the cinema room, on the right-hand side, is the toilets.' },
        { ai: 'Maria', giong: 'us-nu', s: 'At the back of the hall, there are three more places. In the far left corner is the children\'s activity room, where young visitors can draw and build models. The café is in the opposite corner, on the far right. It has doors that open onto the garden, so in summer you can take your coffee outside.' },
        { ai: 'Maria', giong: 'us-nu', s: 'And finally, to go up to the other floors, you can take the lift. It is in the middle of the back wall, between the children\'s activity room and the café. Thank you for listening, and enjoy your visit.' },
      ],
      nhom: [
        {
          id: 'n2-mcq', tu: 11, den: 14, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 11, s: 'The museum building was first used as', chon: [{ k: 'A', t: 'a railway station.' }, { k: 'B', t: 'a factory.' }, { k: 'C', t: 'a school.' }] },
            { n: 12, s: 'What is new at the museum this month?', chon: [{ k: 'A', t: 'It is open later on Fridays.' }, { k: 'B', t: 'Tickets are cheaper.' }, { k: 'C', t: 'There are guided tours every day.' }] },
            { n: 13, s: 'In the galleries, visitors are not allowed to', chon: [{ k: 'A', t: 'take photographs.' }, { k: 'B', t: 'carry a small bag.' }, { k: 'C', t: 'eat or drink.' }] },
            { n: 14, s: 'What does the guide advise visitors to do first?', chon: [{ k: 'A', t: 'watch a film' }, { k: 'B', t: 'go to the top floor' }, { k: 'C', t: 'join a guided tour' }] },
          ],
        },
        {
          id: 'n2-map', tu: 15, den: 20, dang: 'map',
          huongDan: 'Label the plan below.\nWrite the correct letter, **A–H**, next to Questions 15–20.',
          tieuDe: 'Castleford Museum — ground floor',
          hop: { ds: 'ABCDEFGH'.split('').map((k) => ({ k, t: k })) },
          cau: [
            { n: 15, s: 'Cloakroom' },
            { n: 16, s: 'Gift shop' },
            { n: 17, s: 'Cinema room' },
            { n: 18, s: 'Children\'s activity room' },
            { n: 19, s: 'Café' },
            { n: 20, s: 'Lift' },
          ],
          hinh: {
            w: 560, h: 430,
            chuThich: 'Plan of the ground floor (not to scale). You enter from Museum Street, at the bottom of the plan.',
            ve: [
              // Toà nhà
              { t: 'rect', x: 70, y: 30, w: 420, h: 310, nen: '#f7f7f2', bo: 2 },
              // Sáu phòng dọc hai tường + một ô giữa tường sau
              { t: 'rect', x: 70, y: 250, w: 100, h: 90, nen: '#ffffff', bo: 1 },
              { t: 'rect', x: 70, y: 140, w: 100, h: 110, nen: '#ffffff', bo: 1 },
              { t: 'rect', x: 70, y: 30, w: 100, h: 110, nen: '#ffffff', bo: 1 },
              { t: 'rect', x: 390, y: 250, w: 100, h: 90, nen: '#ffffff', bo: 1 },
              { t: 'rect', x: 390, y: 140, w: 100, h: 110, nen: '#ffffff', bo: 1 },
              { t: 'rect', x: 390, y: 30, w: 100, h: 110, nen: '#ffffff', bo: 1 },
              { t: 'rect', x: 240, y: 30, w: 80, h: 50, nen: '#ffffff', bo: 1 },
              // Quầy vé + đầu máy hơi nước giữa sảnh
              { t: 'rect', x: 235, y: 268, w: 90, h: 34, nen: '#dbe7f3', nhan: 'Ticket desk' },
              { t: 'rect', x: 225, y: 160, w: 110, h: 50, nen: '#e4ddd0', nhan: 'Steam engine' },
              { t: 'text', x: 280, y: 125, s: 'MAIN HALL', co: 12, dam: true, giua: true },
              // Vườn ngoài toà nhà (bên phải, phía sau)
              { t: 'rect', x: 495, y: 30, w: 60, h: 110, nen: '#dcebd2', nhan: 'Garden' },
              // Một khu ngoài toà nhà bên trái
              { t: 'rect', x: 5, y: 250, w: 60, h: 90, nen: '#ffffff', bo: 1 },
              // Cổng + mũi tên đi vào
              { t: 'rect', x: 250, y: 333, w: 60, h: 14, nen: '#f7f7f2', bo: 0 },
              { t: 'line', d: [[280, 388], [280, 348]], mui: true },
              { t: 'text', x: 280, y: 326, s: 'entrance', co: 11, giua: true, nghieng: true },
              // Đường Museum Street
              { t: 'rect', x: 0, y: 392, w: 560, h: 30, nen: '#e6e6e6', bo: 0 },
              { t: 'text', x: 280, y: 412, s: 'MUSEUM STREET', co: 12, dam: true, giua: true },
              // Chữ cái
              { t: 'chu', k: 'A', x: 120, y: 295 },
              { t: 'chu', k: 'B', x: 120, y: 195 },
              { t: 'chu', k: 'C', x: 120, y: 85 },
              { t: 'chu', k: 'D', x: 440, y: 295 },
              { t: 'chu', k: 'E', x: 440, y: 195 },
              { t: 'chu', k: 'F', x: 440, y: 85 },
              { t: 'chu', k: 'G', x: 280, y: 55 },
              { t: 'chu', k: 'H', x: 35, y: 295 },
            ],
          },
        },
      ],
    },

    /* ════════════════ PART 3 — hai sinh viên rà lại đồ án nhóm ════════════════ */
    {
      so: 3,
      tieuDe: 'A group project on food waste',
      dan: 'Part 3. You will hear two students, Lucy and Sam, talking about the report for their group project on food waste. First, you have some time to look at questions 21 to 30.',
      boiCanh: 'Lucy và Sam rà lại báo cáo đồ án nhóm (rác thải thức ăn ở căng-tin trường) cho Dr Patel. Chú ý: lý do THẬT khi chọn đề tài, số người trả lời CUỐI CÙNG, kết quả gây bất ngờ, đề xuất hai người cùng đồng ý, hạn nộp BÁO CÁO (khác ngày thuyết trình); phần nối: mỗi giai đoạn gặp MỘT khó khăn — nghe cả điều bị loại ("that didn\'t take long", "on time", "by myself").',
      docTruoc: 40,
      loi: [
        { ai: 'Sam', giong: 'us-nam', s: 'Hi, Lucy. Shall we go through our project report for Dr Patel?' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Yes, let\'s. We should start with the introduction. We have to explain why we chose food waste in the university canteen as our topic.' },
        { ai: 'Sam', giong: 'us-nam', s: 'Right. Did Dr Patel suggest it? I can\'t remember.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'No, he let every group choose freely. And there was very little information about it online, actually. It was my idea, because I have a part-time job in the canteen. Every day I see how much food goes into the bin.' },
        { ai: 'Sam', giong: 'us-nam', s: 'Of course. I\'ll write that down. Next, the questionnaire. How many students answered it in the end?' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Well, we sent it to a hundred and twenty students. After the first week, only sixty had replied.' },
        { ai: 'Sam', giong: 'us-nam', s: 'But then we sent a reminder, didn\'t we?' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Yes, and the final number was eighty-five.' },
        { ai: 'Sam', giong: 'us-nam', s: 'Eighty-five. That\'s enough for a small study. Now, the results. What was the most interesting thing?' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'For me, it was the reason why students leave food on their plates. I expected them to say that the food doesn\'t taste good.' },
        { ai: 'Sam', giong: 'us-nam', s: 'Me too. And I thought they would complain about the prices.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'But only a few people said those things. Most students told us that the portions are too big. They simply can\'t finish their meals.' },
        { ai: 'Sam', giong: 'us-nam', s: 'That was a real surprise. So what should the canteen do? We need to make a suggestion at the end of the report.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Some students wanted lower prices, but that doesn\'t solve the problem of waste. And I don\'t think that changing the menu will help.' },
        { ai: 'Sam', giong: 'us-nam', s: 'I agree. What about two sizes of meal, a small one and a large one? Then people can choose how much they want.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Yes, let\'s suggest that. It\'s simple, and it\'s cheap for the canteen.' },
        { ai: 'Sam', giong: 'us-nam', s: 'Good. And when do we have to hand in the report? Is it Monday the tenth?' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'No, Monday the tenth is the presentation. The report has to be in by Friday the fourteenth.' },
        { ai: 'Sam', giong: 'us-nam', s: 'Oh, good, a few extra days. Can\'t we have until the twenty-first? Another group told me they had more time.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Dr Patel only gives extra time to students who are ill. So it\'s the fourteenth for us.' },
        { ai: 'Sam', giong: 'us-nam', s: 'OK. Now, Dr Patel also wants us to write about the problems we had at each stage of the project.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Well, we had a problem right at the beginning, when we were choosing the topic. I wanted food waste, and you wanted to do something about sport.' },
        { ai: 'Sam', giong: 'us-nam', s: 'Yes, and we just couldn\'t agree. In the end, we had to toss a coin!' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'And I won. Then we wrote the questionnaire. That didn\'t take long, and it didn\'t cost anything, because we put it online.' },
        { ai: 'Sam', giong: 'us-nam', s: 'True, but our first questionnaire had thirty questions. When Dr Patel saw it, he said it was too long, and he told us to cut it to fifteen.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Yes, we had to write it again. After that, we collected the answers. We planned to do that in one week.' },
        { ai: 'Sam', giong: 'us-nam', s: 'And it took three weeks, because people were so slow to reply.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Then I analysed the results. I finished that part on time, but the computer program was so complicated. I had never used it before, and I didn\'t know how to make a chart.' },
        { ai: 'Sam', giong: 'us-nam', s: 'You should have asked me for help.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'I know, but I learned how to do it by myself in the end. And what about the slides for the presentation? You made those.' },
        { ai: 'Sam', giong: 'us-nam', s: 'Don\'t remind me. My laptop broke on Sunday night, and half of the slides disappeared. I had to make them all over again.' },
        { ai: 'Lucy', giong: 'uk-nu', s: 'Poor you. Well, at least we have plenty to write about.' },
      ],
      nhom: [
        {
          id: 'n3-mcq', tu: 21, den: 25, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 21, s: 'Why did the students choose food waste as their topic?', chon: [{ k: 'A', t: 'Their tutor suggested it.' }, { k: 'B', t: 'There was a lot of information about it.' }, { k: 'C', t: 'Lucy had seen the problem at work.' }] },
            { n: 22, s: 'How many students answered the questionnaire in the end?', chon: [{ k: 'A', t: '60' }, { k: 'B', t: '85' }, { k: 'C', t: '120' }] },
            { n: 23, s: 'What is the main reason why students leave food on their plates?', chon: [{ k: 'A', t: 'They are given too much food.' }, { k: 'B', t: 'They do not like the taste.' }, { k: 'C', t: 'They think the food is too expensive.' }] },
            { n: 24, s: 'What will Lucy and Sam suggest in their report?', chon: [{ k: 'A', t: 'lower prices' }, { k: 'B', t: 'a different menu' }, { k: 'C', t: 'meals in two sizes' }] },
            { n: 25, s: 'When must the students hand in their report?', chon: [{ k: 'A', t: 'on Monday the 10th' }, { k: 'B', t: 'on Friday the 14th' }, { k: 'C', t: 'on Friday the 21st' }] },
          ],
        },
        {
          id: 'n3-match', tu: 26, den: 30, dang: 'match-feature',
          huongDan: 'What problem did the students have at each stage of their project?\nChoose **FIVE** answers from the box and write the correct letter, **A–G**, next to Questions 26–30.',
          hop: {
            tieuDe: 'Problems',
            ds: [
              { k: 'A', t: 'It took longer than they had planned.' },
              { k: 'B', t: 'Their tutor asked them to change it.' },
              { k: 'C', t: 'It cost more than they expected.' },
              { k: 'D', t: 'The software was difficult to use.' },
              { k: 'E', t: 'They could not agree with each other.' },
              { k: 'F', t: 'Some of their work was lost.' },
              { k: 'G', t: 'They needed help from another student.' },
            ],
          },
          cau: [
            { n: 26, s: 'choosing the topic' },
            { n: 27, s: 'writing the questionnaire' },
            { n: 28, s: 'collecting the answers' },
            { n: 29, s: 'analysing the results' },
            { n: 30, s: 'preparing the slides' },
          ],
        },
      ],
    },

    /* ════════════════ PART 4 — bài giảng về ong mật ════════════════ */
    {
      so: 4,
      tieuDe: 'Lecture — the honeybee',
      dan: 'Part 4. You will hear part of a lecture about honeybees. First, you have some time to look at questions 31 to 40.',
      boiCanh: 'Bài giảng nhập môn về ong mật: tổ chức của một đàn (ong chúa, ong đực, ong thợ), ong thợ chia việc theo tuổi thế nào, cách làm mật và vì sao ong quan trọng. Chú ý cặp dễ lẫn: six weeks (ong sinh mùa hè) / several months (ong sinh mùa thu); water (thành phần mật hoa) / wax (sáp làm ô tổ) — CẢ HAI đều là đáp án, theo đúng thứ tự nghe.',
      docTruoc: 45,
      loi: [
        { ai: 'Lecturer', giong: 'uk-nam', s: 'Good afternoon. In this lecture, I am going to talk about an insect that all of you know, but that few people really understand: the honeybee. I will describe how a colony of bees is organised, how the workers share the jobs in the hive, and how bees make honey.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'Let\'s start with the colony. Honeybees live together in large groups. In the middle of summer, a single colony may contain fifty thousand bees. However, there is only one queen. She is larger than the other bees, and her job is to lay all the eggs. In early summer, she can lay up to two thousand of them every day.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'A colony also has some male bees, which are called drones. Drones have an easy life. They do no work in the hive, and they do not collect food. They cannot sting, either, so they cannot protect the colony.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'All the other bees are workers, and every worker is female. As the name suggests, the workers do everything. Their lives are short. A worker that is born in summer lives for only about six weeks. A worker born in autumn can live for several months, because she rests inside the hive during the winter.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'A worker\'s job changes as she gets older. A young worker stays inside. Her first job is to clean the hive. She also feeds the baby bees. When she is a little older, she helps to build new cells and to store the food that other workers bring back. Only after about three weeks does she begin to fly outside and look for food herself.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'So how is honey made? The workers visit flowers and collect a sweet liquid called nectar. They carry it back to the hive. But nectar is not yet honey. It is about eighty per cent water, so it is very thin. Back in the hive, the bees put the nectar into small cells made of wax. Then they move their wings very fast. This moves the air and dries the nectar. When it is thick enough, the bees close the cell, and the honey is ready. They will eat it during the winter.' },
        { ai: 'Lecturer', giong: 'uk-nam', s: 'Finally, why are bees important to us? It is not only because of honey. When bees fly from flower to flower, they carry pollen from one plant to another. Many plants need this before they can produce food. Without bees, we would have much less fruit. Apples, for example, would be very hard to grow. That is why farmers are worried when their bees become ill. We will look at the reasons for that next week.' },
      ],
      nhom: [
        {
          id: 'n4-note', tu: 31, den: 40, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'The honeybee',
          dong: [
            '## The colony',
            '• a summer colony may have 50,000 bees but only one [[31]]',
            '• her job: to lay all the [[32]]',
            '• male bees (drones) do no work and cannot [[33]]',
            '## Workers',
            '• every worker is [[34]]',
            '• a worker born in summer lives for about six [[35]]',
            '• a young worker\'s first job: to [[36]] the hive',
            '## Making honey',
            '• nectar is about 80% [[37]]',
            '• nectar is put into small cells made of [[38]]',
            '• bees dry the nectar by moving their [[39]] quickly',
            '## Why bees matter',
            '• without bees, there would be much less [[40]] (e.g. apples)',
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Part 1 ── */
    1: { a: ['Kessler'], vi: `Lễ tân hỏi "with a C or with a K?" — Daniel: "With a K. That's K, E, double S, L, E, R." ⇒ **Kessler**. "double S" = hai chữ S liền nhau (SS). Lễ tân đọc lại đúng từng chữ để bạn kiểm. 📘 Ôn nghe đánh vần + Form completion: Tập 1 Ngày 7, Tập 2 Ngày 1.`, ev: `With a K. That's K, E, double S, L, E, R.` },
    2: { a: ['14', '14th', 'fourteenth'], vi: `Daniel nói "Friday the fifteenth" rồi sửa ngay: "We're coming a day earlier now, so that's Thursday the fourteenth." ⇒ **14**. Bẫy đổi ý: con số nghe TRƯỚC (15) bị bỏ; "Oh, wait a minute. Sorry…" là tín hiệu sắp sửa lại. Ngày 17 là ngày RỜI đi. 📘 Ôn bẫy đổi ý: Tập 2 Ngày 11.`, ev: `We're coming a day earlier now, so that's Thursday the fourteenth.` },
    3: { a: ['3', 'three'], vi: `"I wanted two nights at first, but… So let's say three nights, please." ⇒ **3**. "at first… but" báo ý đầu bị thay. Lễ tân xác nhận: "Three nights."`, ev: `So let's say three nights, please.` },
    4: { a: ['07911 426 380', '07911426380'], vi: `"My mobile number is 07911 426 380." — lễ tân đọc lại y nguyên ⇒ **07911 426 380**. Ghi đủ 11 chữ số; cả dãy tính là MỘT số nên hợp lệ với "ONE WORD AND/OR A NUMBER".`, ev: `My mobile number is 07911 426 380.` },
    5: { a: ['wedding'], vi: `Lễ tân hỏi "on business… or is it a holiday?" — Daniel: "Neither, really… so we're coming for the wedding." ⇒ **wedding**. "Neither" phủ định CẢ HAI phương án vừa nghe; đáp án đến sau đó. Chính tả: hai chữ d.`, ev: `An old friend from university is getting married in your town, so we're coming for the wedding.` },
    6: { a: ['70', 'seventy'], vi: `"Last year it was sixty-five pounds a night, but the price is now seventy pounds." ⇒ **70**. Bẫy giá cũ / giá mới ("Last year… but… now"). £95 là giá phòng nhìn ra biển — đã in sẵn trong bảng. Phân biệt seventy /ˈsevnti/ (70) với seventeen /ˌsevnˈtiːn/ (17). 📘 Ôn Table completion khi nghe: Tập 2 Ngày 5.`, ev: `Last year it was sixty-five pounds a night, but the price is now seventy pounds.` },
    7: { a: ['shower'], vi: `"it doesn't have a bath. There is a shower, though." ⇒ **shower**. Bảng viết "has a ___ but no bath" — "bath" là thứ KHÔNG có và đã in sẵn. "though" ở cuối câu = "tuy nhiên".`, ev: `There is a shower, though.` },
    8: { a: ['balcony'], vi: `"Those rooms are on the top floor, and each one has a small balcony" ⇒ **balcony** (ban công). Daniel nhắc lại: "A balcony!". Chính tả: b-a-l-c-o-n-y.`, ev: `Those rooms are on the top floor, and each one has a small balcony, so you can sit outside and look at the harbour.` },
    9: { a: ['8', 'eight'], vi: `"It costs eight pounds per person. For children under ten, it's five pounds." ⇒ **8**. Bảng hỏi giá cho NGƯỜI LỚN ("per adult") — £5 là của trẻ em dưới 10 tuổi; "ten" là tuổi, không phải giá.`, ev: `It costs eight pounds per person.` },
    10: { a: ['bank'], vi: `"A lot of people look for it beside the post office, but it's actually behind the bank" ⇒ **bank**. Bẫy: "post office" là nơi người ta TƯỞNG — "but… actually" báo đáp án thật. Daniel nhắc lại: "Behind the bank."`, ev: `A lot of people look for it beside the post office, but it's actually behind the bank, on the other side of the street.` },

    /* ── Part 2 ── */
    11: { a: ['B'], vi: `"a lot of visitors think that it was once a railway station. In fact, it was built as a factory." ⇒ **B**. A là điều khách TƯỞNG ("visitors think… In fact…"); C không được nhắc. 📘 Ôn MCQ Part 2: Tập 1 Ngày 9 · từ báo hiệu "In fact": Tập 2 Ngày 11.`, ev: `In fact, it was built as a factory.` },
    12: { a: ['A'], vi: `Vé "still costs six pounds" (không rẻ hơn ⇒ loại B); tour "still only on Saturdays and Sundays" (không phải hằng ngày ⇒ loại C). "What is different this month is our opening hours. On Fridays, we now stay open until nine in the evening" ⇒ **A**. Từ "still" = vẫn như cũ.`, ev: `On Fridays, we now stay open until nine in the evening, so you can come after work.` },
    13: { a: ['C'], vi: `Chụp ảnh ĐƯỢC ("please feel free to take photographs" — chỉ không dùng flash); túi nhỏ ĐƯỢC mang. "What we do not allow in the galleries is food or drink." ⇒ **C**. Bẫy: "not to use a flash" có chữ "not" nhưng lựa chọn A nói "take photographs" nói chung — việc đó vẫn được phép.`, ev: `What we do not allow in the galleries is food or drink.` },
    14: { a: ['A'], vi: `"most people go straight up to the top floor" (B) và "Others wait for a tour" (C) là việc NGƯỜI KHÁC làm. "My advice is different. Before you do anything else, watch our short film." ⇒ **A**. "Before you do anything else" = "first".`, ev: `Before you do anything else, watch our short film.` },
    15: { a: ['A'], vi: `"the cloakroom. That is the first room on your left, just inside the entrance." — đi vào từ phía dưới sơ đồ, phòng ĐẦU TIÊN bên TRÁI, sát cửa ⇒ **A**. 📘 Ôn Map / plan labelling: Tập 2 Ngày 7 — xác định điểm đứng và hướng đi trước khi nghe.`, ev: `That is the first room on your left, just inside the entrance.` },
    16: { a: ['D'], vi: `"The gift shop is on the other side, immediately on your right as you go in." — đối diện phòng gửi đồ, bên PHẢI ngay cửa ⇒ **D**.`, ev: `The gift shop is on the other side, immediately on your right as you go in.` },
    17: { a: ['B'], vi: `"The cinema room… is on the left-hand side of the hall, next to the cloakroom." — bên trái, cạnh phòng gửi đồ (A) ⇒ **B**. Phòng đối diện bên phải (E) là nhà vệ sinh — không có trong câu hỏi.`, ev: `The cinema room, where the film is shown, is on the left-hand side of the hall, next to the cloakroom.` },
    18: { a: ['C'], vi: `"At the back of the hall… In the far left corner is the children's activity room" — góc XA bên TRÁI (phía trong cùng) ⇒ **C**.`, ev: `In the far left corner is the children's activity room, where young visitors can draw and build models.` },
    19: { a: ['F'], vi: `"The café is in the opposite corner, on the far right. It has doors that open onto the garden" — góc xa bên PHẢI, cạnh khu vườn (đã ghi sẵn trên sơ đồ) ⇒ **F**.`, ev: `The café is in the opposite corner, on the far right.` },
    20: { a: ['G'], vi: `"It is in the middle of the back wall, between the children's activity room and the café." — giữa tường sau, giữa C và F ⇒ **G**. H (ngoài toà nhà) không được nhắc tới.`, ev: `It is in the middle of the back wall, between the children's activity room and the café.` },

    /* ── Part 3 ── */
    21: { a: ['C'], vi: `Dr Patel KHÔNG gợi ý ("he let every group choose freely" ⇒ loại A); thông tin trên mạng RẤT ÍT ("very little information" ⇒ loại B). "It was my idea, because I have a part-time job in the canteen. Every day I see how much food goes into the bin." ⇒ **C**. 📘 Ôn MCQ Part 3: Tập 1 Ngày 11.`, ev: `It was my idea, because I have a part-time job in the canteen.` },
    22: { a: ['B'], vi: `Ba con số: 120 = số người ĐƯỢC GỬI; 60 = số trả lời sau tuần đầu; "the final number was eighty-five" ⇒ **B (85)**. Câu hỏi có "in the end" = "final".`, ev: `Yes, and the final number was eighty-five.` },
    23: { a: ['A'], vi: `Lucy tưởng là do vị (B), Sam tưởng là do giá (C) — "But only a few people said those things. Most students told us that the portions are too big." — "given too much food" = "the portions are too big" ⇒ **A**.`, ev: `Most students told us that the portions are too big.` },
    24: { a: ['C'], vi: `Giảm giá "doesn't solve the problem of waste" (loại A); đổi thực đơn "I don't think… will help" (loại B). Sam: "What about two sizes of meal…?" — Lucy: "Yes, let's suggest that." ⇒ **C**. Đáp án là phương án CẢ HAI đồng ý.`, ev: `What about two sizes of meal, a small one and a large one?` },
    25: { a: ['B'], vi: `"Monday the tenth is the presentation. The report has to be in by Friday the fourteenth." ⇒ **B**. Ngày 10 là buổi THUYẾT TRÌNH; ngày 21 chỉ dành cho sinh viên bị ốm ("So it's the fourteenth for us").`, ev: `The report has to be in by Friday the fourteenth.` },
    26: { a: ['E'], vi: `Chọn đề tài: Lucy muốn rác thải thức ăn, Sam muốn thể thao — "we just couldn't agree. In the end, we had to toss a coin!" ⇒ **E**. 📘 Ôn Matching khi nghe: Tập 1 Ngày 11 — các giai đoạn được nói ĐÚNG thứ tự câu hỏi; lựa chọn là lời diễn đạt lại.`, ev: `Yes, and we just couldn't agree.` },
    27: { a: ['B'], vi: `Viết bảng hỏi: "That didn't take long" (loại A), "it didn't cost anything" (loại C). "When Dr Patel saw it, he said it was too long, and he told us to cut it to fifteen." — thầy yêu cầu sửa ⇒ **B**. Bẫy: "too long" ở đây là bảng hỏi quá DÀI (30 câu), không phải mất nhiều thời gian.`, ev: `When Dr Patel saw it, he said it was too long, and he told us to cut it to fifteen.` },
    28: { a: ['A'], vi: `Thu câu trả lời: "We planned to do that in one week." — "And it took three weeks" ⇒ lâu hơn kế hoạch ⇒ **A**.`, ev: `And it took three weeks, because people were so slow to reply.` },
    29: { a: ['D'], vi: `Phân tích: "I finished that part on time (loại A), but the computer program was so complicated." ⇒ phần mềm khó dùng ⇒ **D**. Bẫy G: Sam nói "You should have asked me for help" nhưng Lucy tự làm ("by myself") ⇒ không cần ai giúp.`, ev: `I finished that part on time, but the computer program was so complicated.` },
    30: { a: ['F'], vi: `Làm slide: "My laptop broke on Sunday night, and half of the slides disappeared." — "some of their work was lost" = "half of the slides disappeared" ⇒ **F**.`, ev: `My laptop broke on Sunday night, and half of the slides disappeared.` },

    /* ── Part 4 ── */
    31: { a: ['queen'], vi: `"a single colony may contain fifty thousand bees. However, there is only one queen." ⇒ **queen** (ong chúa). "However" báo ý đối lập: rất đông nhưng chỉ MỘT. 📘 Ôn Note completion Part 4: Tập 1 Ngày 13 — đọc các tiêu đề nhỏ để theo kịp bài giảng.`, ev: `However, there is only one queen.` },
    32: { a: ['eggs'], vi: `"her job is to lay all the eggs" ⇒ **eggs**. Động từ "lay" (đẻ) gần như chỉ đi với "eggs" — đoán được loại từ trước khi nghe.`, ev: `She is larger than the other bees, and her job is to lay all the eggs.` },
    33: { a: ['sting'], vi: `"They do no work in the hive, and they do not collect food. They cannot sting, either" ⇒ **sting** (đốt). Ghi chú đã có "do no work and cannot ___" nên cần ĐỘNG TỪ nguyên mẫu; "collect" không hợp vì thiếu tân ngữ.`, ev: `They cannot sting, either, so they cannot protect the colony.` },
    34: { a: ['female'], vi: `"All the other bees are workers, and every worker is female." ⇒ **female** (cái). Bẫy: "male" vừa được nhắc ở đoạn trước cho ong đực (drones).`, ev: `All the other bees are workers, and every worker is female.` },
    35: { a: ['weeks'], vi: `"A worker that is born in summer lives for only about six weeks. A worker born in autumn can live for several months" ⇒ **weeks**. Ghi chú hỏi ong sinh MÙA HÈ; "months" là của ong sinh mùa thu.`, ev: `A worker that is born in summer lives for only about six weeks.` },
    36: { a: ['clean'], vi: `"A young worker stays inside. Her first job is to clean the hive. She also feeds the baby bees." ⇒ **clean** (dọn). Ghi chú "first job: to ___ the hive" cần ĐỘNG TỪ nguyên mẫu. Bẫy: "feeds" là việc làm THÊM ("also") và tân ngữ là "the baby bees", không phải "the hive"; "build" là việc của ong lớn hơn một chút và tân ngữ là "new cells".`, ev: `Her first job is to clean the hive.` },
    37: { a: ['water'], vi: `"It is about eighty per cent water, so it is very thin." ⇒ **water**. Hai đáp án liền nhau bắt đầu bằng âm /w/ (water → wax): nghe kỹ từ đứng ngay sau "eighty per cent".`, ev: `It is about eighty per cent water, so it is very thin.` },
    38: { a: ['wax'], vi: `"Back in the hive, the bees put the nectar into small cells made of wax." ⇒ **wax** (sáp ong). Ghi chú đổi sang bị động "nectar is put into small cells made of ___". Bẫy: "water" vừa nghe ở câu trước là thành phần của mật hoa, không phải chất liệu ô tổ.`, ev: `Back in the hive, the bees put the nectar into small cells made of wax.` },
    39: { a: ['wings'], vi: `"Then they move their wings very fast. This moves the air and dries the nectar." — "quickly" = "very fast" ⇒ **wings** (cánh).`, ev: `Then they move their wings very fast.` },
    40: { a: ['fruit'], vi: `"Without bees, we would have much less fruit. Apples, for example, would be very hard to grow." ⇒ **fruit**. Ví dụ "apples" trong ghi chú khớp câu ngay sau. Bẫy: "honey" và "food" cũng được nhắc, nhưng câu "Without bees, we would have much less…" kết thúc bằng "fruit".`, ev: `Without bees, we would have much less fruit.` },
  },
};
