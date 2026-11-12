/**
 * Đề 3 — Listening, THI CUỐI TẬP 2 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Ngày 24). TỰ SOẠN 12/11/2026.
 * Mức band 5.0: đúng format thật (4 Part × 10 câu, nghe MỘT lần), từ vựng B1, ~130 từ/phút; nhiều bẫy đổi ý hơn Đề 2 và Part 3–4
 * dùng các dạng Tập 2 dạy ở nửa sau. Bối cảnh theo mục 4.2: hỏi khoá học buổi tối · tour đi bộ trong thành phố · phỏng vấn một
 * sinh viên (đài phát thanh trường) · bài giảng về thuỷ triều.
 *   Part 1: Table (T2 N5) + Form (T2 N1) · Part 2: MCQ + Matching địa điểm–đặc điểm (T2 N13, N15) ·
 *   Part 3: MCQ + chọn TWO + Flow-chart (T2 N13) · Part 4: Note + Sentence completion + Short answer (T2 N19).
 * Bẫy chính: £95 năm ngoái → £105; laptop (không cần) → camera; Monday kỳ trước → Wednesday; dictionary (không cần) → book;
 * 16 chỗ / 12 học viên; Hill → Mill; khai giảng 14 → buổi đầu 15; cash → card; advertisement → neighbour; 3 giờ → 2,5 giờ;
 * umbrella → shoes; café → food market; "oldest building" (không phải nhà thờ) → cây cầu; TV + tạp chí London → ở nhà;
 * gọi người lạ / dậy sớm → viết nhanh; camera, teamwork (không) → headlines + facts; 12 giờ → 12 giờ 25 phút; season → "to jump".
 * Dữ kiện thuỷ triều đã đối chiếu 12/11/2026 (Wikipedia: Tide · Rance Tidal Power Station): Newton giải thích năm 1687; hai lần
 * triều lên mỗi ngày, cách nhau ~12 giờ 25 phút; lực triều của Mặt Trời ≈ 46% của Mặt Trăng; triều cường (spring) lúc trăng non +
 * trăng tròn, "spring" = bật/nhảy lên, không phải mùa xuân; triều kém (neap); vịnh Fundy (Canada) ~16 m; Địa Trung Hải phần lớn biên độ < 0,5 m;
 * nhà máy điện thuỷ triều lớn đầu tiên: La Rance, tây bắc Pháp, 1966, còn hoạt động. Trường, thành phố Wexley, tờ Dunmore Gazette
 * và mọi nhân vật đều HƯ CẤU.
 * Giọng: us-nu, uk-nam, uk-nu, us-nam (đủ 4). `ev` = chuỗi NGUYÊN VĂN trong một lượt lời.
 */
import type { DeNghe } from './types';

export const NGHE_DE3: DeNghe = {
  id: 'nghe-de3',
  kyNang: 'nghe',
  ten: 'Listening — Đề 3 (thi cuối Tập 2)',
  boDe: 'Đề 3',
  capDo: 'Band 5.0',
  moTa: 'Enquiry about evening courses · Walking tour of an old city · Radio interview with a journalism student · Lecture on tides',
  phut: 30,
  phan: [
    /* ════════════════ PART 1 — hỏi khoá học buổi tối ════════════════ */
    {
      so: 1,
      tieuDe: 'Northfield College — evening courses',
      dan: 'Part 1. You will hear a woman telephoning a college to ask about evening courses. First, you have some time to look at questions 1 to 10.',
      boiCanh: 'Carla gọi đến trường Northfield hỏi ba khoá học buổi tối rồi đăng ký một khoá. Chú ý: học phí NĂM NAY, thứ phải mang / phải mua (và thứ KHÔNG cần), ngày học kỳ NÀY, sĩ số tối đa; phần phiếu: đánh vần họ, tên đường (Hill hay Mill), ngày buổi học ĐẦU TIÊN (khác ngày khai giảng), cách trả tiền, nghe về trường từ ai.',
      docTruoc: 30,
      loi: [
        { ai: 'Tom', giong: 'uk-nam', s: 'Good afternoon, Northfield College, evening courses. Tom speaking.' },
        { ai: 'Carla', giong: 'us-nu', s: 'Hi. I\'m calling to ask about your evening courses this fall. I\'ve seen three on your website that I like, but I have some questions.' },
        { ai: 'Tom', giong: 'uk-nam', s: 'Of course. Which courses are you interested in?' },
        { ai: 'Carla', giong: 'us-nu', s: 'First, photography. Is that on Tuesday evenings?' },
        { ai: 'Tom', giong: 'uk-nam', s: 'That\'s right. Tuesdays, from seven to nine.' },
        { ai: 'Carla', giong: 'us-nu', s: 'And the website says it costs £95 for the term.' },
        { ai: 'Tom', giong: 'uk-nam', s: 'Ah, I\'m afraid that\'s last year\'s price. This year it\'s £105.' },
        { ai: 'Carla', giong: 'us-nu', s: '£105. OK. Do I need to bring anything? A laptop, for example?' },
        { ai: 'Tom', giong: 'uk-nam', s: 'No, we have computers in the classroom. But you do need to bring your own camera. The college doesn\'t have any for students to borrow.' },
        { ai: 'Carla', giong: 'us-nu', s: 'That\'s fine. I have a good camera. Now, the second one is Italian for beginners. That\'s on Mondays, isn\'t it?' },
        { ai: 'Tom', giong: 'uk-nam', s: 'It was on Mondays last term. But the teacher has changed, so this term it\'s on Wednesdays, from half past six to half past eight.' },
        { ai: 'Carla', giong: 'us-nu', s: 'Wednesdays. Hmm. And the price?' },
        { ai: 'Tom', giong: 'uk-nam', s: '£110. And you will have to buy the course book. Some students ask about a dictionary, but you really don\'t need one at this level.' },
        { ai: 'Carla', giong: 'us-nu', s: 'OK, just the book. And the last one is the cooking course, on Thursdays.' },
        { ai: 'Tom', giong: 'uk-nam', s: 'Yes, World Cooking. That\'s £150, which sounds a lot, but it includes all the food. It\'s very popular, and the numbers are limited. The kitchen has space for sixteen people, but the teacher only takes twelve students, so that she can help everybody.' },
        { ai: 'Carla', giong: 'us-nu', s: 'Twelve. I see. Well, I think the cooking course is too expensive for me anyway. I\'d like to sign up for photography, please.' },
        { ai: 'Tom', giong: 'uk-nam', s: 'Lovely. Let me take your details. What\'s your name?' },
        { ai: 'Carla', giong: 'us-nu', s: 'Carla Jensen. That\'s J, E, N, S, E, N.' },
        { ai: 'Tom', giong: 'uk-nam', s: 'J, E, N, S, E, N. And your address?' },
        { ai: 'Carla', giong: 'us-nu', s: '14 Mill Road.' },
        { ai: 'Tom', giong: 'uk-nam', s: 'Sorry, was that Hill Road?' },
        { ai: 'Carla', giong: 'us-nu', s: 'No, Mill, with an M. M, I, double L.' },
        { ai: 'Tom', giong: 'uk-nam', s: 'Mill Road. Thank you. Now, the term begins on Monday the 14th of September, but as your class is on a Tuesday, your first lesson will be on the 15th.' },
        { ai: 'Carla', giong: 'us-nu', s: 'The 15th of September. Great. How do I pay? Can I bring cash on the first evening?' },
        { ai: 'Tom', giong: 'uk-nam', s: 'I\'m afraid we don\'t take cash any more. You can pay online by bank transfer, or by card over the phone.' },
        { ai: 'Carla', giong: 'us-nu', s: 'Then I\'ll pay by card now, if that\'s OK.' },
        { ai: 'Tom', giong: 'uk-nam', s: 'Perfect. One last question, for our records. How did you hear about the college? Was it our advertisement in the newspaper?' },
        { ai: 'Carla', giong: 'us-nu', s: 'No, I didn\'t see that. Actually, my neighbour told me about it. She did a painting course with you last year and loved it.' },
        { ai: 'Tom', giong: 'uk-nam', s: 'Oh, that\'s nice to hear. Right, I\'ll just take your card details.' },
      ],
      nhom: [
        {
          id: 'n1-table', tu: 1, den: 5, dang: 'table',
          huongDan: 'Complete the table below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Evening courses',
          bang: {
            dau: ['Course', 'Day and time', 'Cost per term', 'Notes'],
            hang: [
              ['Photography', 'Tuesday, 7–9 p.m.', '£[[1]]', 'students must bring a [[2]]'],
              ['Italian for beginners', '[[3]], 6.30–8.30 p.m.', '£110', 'students must buy the course [[4]]'],
              ['World Cooking', 'Thursday', '£150 (food included)', 'no more than [[5]] students in the class'],
            ],
          },
        },
        {
          id: 'n1-form', tu: 6, den: 10, dang: 'form',
          huongDan: 'Complete the form below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Northfield College — Registration Form',
          dong: [
            'Course chosen: Photography',
            'Name: Carla [[6]]',
            'Address: 14 [[7]] Road',
            'Date of first class: [[8]] September',
            'Method of payment: by [[9]]',
            'Heard about the college from: a [[10]]',
          ],
        },
      ],
    },

    /* ════════════════ PART 2 — tour đi bộ trong thành phố cổ ════════════════ */
    {
      so: 2,
      tieuDe: 'A walking tour of Wexley',
      dan: 'Part 2. You will hear a guide talking to a group of tourists at the start of a walking tour of an old city. First, you have some time to look at questions 11 to 20.',
      boiCanh: 'Helen, hướng dẫn viên, nói về kế hoạch buổi đi bộ tham quan phố cổ Wexley rồi giới thiệu 5 điểm sẽ ghé. Chú ý: thời lượng HÔM NAY (không phải thường lệ), thứ CẦN mang, chỗ nghỉ giải lao hôm nay, nơi CẤM chụp ảnh, việc phải làm khi lạc; phần nối: mỗi địa điểm một đặc điểm — nghe cả điều bị phủ định ("that isn\'t true", "you do have to pay", "nobody has ever…").',
      docTruoc: 40,
      loi: [
        { ai: 'Helen', giong: 'uk-nu', s: 'Good morning, everyone, and welcome to Wexley. My name is Helen, and I am your guide for today\'s walking tour of the old city. Before we set off, let me tell you about the plan for the day.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'The tour usually lasts three hours. Today, however, the cathedral tower is closed for repairs, so we will not be climbing it, and the tour will take two and a half hours. We will finish back here in the market square at about half past twelve.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'Now, the weather. The forecast said rain this morning, but as you can see, the sun has come out, so you will not need your umbrellas. It is warm too, so you can leave your coats on the coach. What you will need is comfortable shoes. Many of the streets in the old city are made of stone, and they are quite hard to walk on.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'At about eleven o\'clock, we will stop for a break. On most of my tours, we go to a café by the river. But today is Saturday, and on Saturdays there is a wonderful food market in the Corn Hall. So that is where we will have our break. You can try the local cheese and bread there. There is also a tea room in the castle, but it is rather expensive.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'A word about photographs. You may take pictures everywhere in the streets, in the castle, and inside the cathedral too, as long as you do not use a flash. The only place where photography is not allowed is the art gallery. Please keep your cameras in your bags there.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'And if you get lost, don\'t worry. Please don\'t try to phone me, because my phone often has no signal in the old streets. Don\'t go back to the coach, either, because the driver will not be there. Just come back to the clock tower here in the market square and wait. I will come and find you.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'Now, let me tell you about some of the places we are going to see. We will begin with the cathedral. Many visitors believe that it is the oldest building in Wexley, but that isn\'t true. What makes it interesting is its roof. In 1829, a terrible fire destroyed the roof and most of the windows, and it took thirty years to repair the building.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'From the cathedral, we will walk up the hill to the castle. I have to say, there isn\'t much left inside it, and you do have to pay five pounds to go in. But it is worth it. From the top of the castle walls, you get the best view of the city, and on a clear day like today you can see all the way to the sea.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'After that, we go down to the river and the old bridge. It doesn\'t look very special, but it was built almost nine hundred years ago, a century before the cathedral. Nothing else in the city is as old as that.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'Next to the bridge is the city museum. It is quite small, and I have heard that they are planning to build a new section next year. One good thing is that it doesn\'t cost anything to go in, so do have a look if you have time after the tour.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'And our last stop is Weavers\' Lane, a narrow street of tiny shops. People often say that it looks like a street in a film, although as far as I know nobody has ever made a film there. The shops sell things that are made locally, such as pottery and woollen scarves. If you want to take presents home for your family, this is the place to get them.' },
        { ai: 'Helen', giong: 'uk-nu', s: 'Right. Is everybody ready? Then let\'s go.' },
      ],
      nhom: [
        {
          id: 'n2-mcq', tu: 11, den: 15, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 11, s: 'How long will today\'s tour last?', chon: [{ k: 'A', t: 'two hours' }, { k: 'B', t: 'two and a half hours' }, { k: 'C', t: 'three hours' }] },
            { n: 12, s: 'What does the guide say the visitors will need today?', chon: [{ k: 'A', t: 'an umbrella' }, { k: 'B', t: 'a warm coat' }, { k: 'C', t: 'comfortable shoes' }] },
            { n: 13, s: 'Where will the group have a break today?', chon: [{ k: 'A', t: 'at a food market' }, { k: 'B', t: 'at a café by the river' }, { k: 'C', t: 'in the castle tea room' }] },
            { n: 14, s: 'Where are visitors not allowed to take photographs?', chon: [{ k: 'A', t: 'in the cathedral' }, { k: 'B', t: 'in the castle' }, { k: 'C', t: 'in the art gallery' }] },
            { n: 15, s: 'What should visitors do if they get lost?', chon: [{ k: 'A', t: 'go to the clock tower' }, { k: 'B', t: 'return to the coach' }, { k: 'C', t: 'telephone the guide' }] },
          ],
        },
        {
          id: 'n2-match', tu: 16, den: 20, dang: 'match-feature',
          huongDan: 'What does the guide say about each of the following places?\nChoose **FIVE** answers from the box and write the correct letter, **A–G**, next to Questions 16–20.',
          hop: {
            tieuDe: 'Comments',
            ds: [
              { k: 'A', t: 'It is free to go in.' },
              { k: 'B', t: 'It is the oldest structure in the city.' },
              { k: 'C', t: 'It has the best view of the city.' },
              { k: 'D', t: 'It was badly damaged by fire.' },
              { k: 'E', t: 'It has been used in a film.' },
              { k: 'F', t: 'It is a good place to buy presents.' },
              { k: 'G', t: 'It has recently been made bigger.' },
            ],
          },
          cau: [
            { n: 16, s: 'the cathedral' },
            { n: 17, s: 'the castle' },
            { n: 18, s: 'the old bridge' },
            { n: 19, s: 'the city museum' },
            { n: 20, s: 'Weavers\' Lane' },
          ],
        },
      ],
    },

    /* ════════════════ PART 3 — phỏng vấn sinh viên về kỳ thực tập ở toà báo ════════════════ */
    {
      so: 3,
      tieuDe: 'Campus Radio — interview about a work placement',
      dan: 'Part 3. You will hear a student radio presenter called Mark interviewing Priya, a journalism student, about her work placement at a local newspaper. First, you have some time to look at questions 21 to 30.',
      boiCanh: 'Mark (đài phát thanh sinh viên) phỏng vấn Priya, sinh viên báo chí năm hai, về ba tháng thực tập ở tờ báo địa phương Dunmore Gazette. Chú ý: lý do CUỐI CÙNG khiến cô chọn tờ báo, việc làm trong tuần ĐẦU, điều khó NHẤT, nhận xét về tổng biên tập; HAI kỹ năng tiến bộ (hai kỹ năng khác bị phủ định trước); lưu đồ một ngày làm báo theo đúng thứ tự.',
      docTruoc: 40,
      loi: [
        { ai: 'Mark', giong: 'us-nam', s: 'Hello, and welcome to Campus Radio. I\'m Mark, and my guest today is Priya, a second-year journalism student who has just finished a three-month work placement at a local newspaper, the Dunmore Gazette. Welcome, Priya.' },
        { ai: 'Priya', giong: 'uk-nu', s: 'Thanks, Mark.' },
        { ai: 'Mark', giong: 'us-nam', s: 'So, why did you choose the Gazette? Was it your first choice?' },
        { ai: 'Priya', giong: 'uk-nu', s: 'Not really. First I wrote to a television company, but they never replied. Then my tutor recommended a magazine in London, but I couldn\'t afford to rent a room there. The Gazette\'s office is ten minutes from my parents\' house, so I could live at home for three months. That\'s what decided it.' },
        { ai: 'Mark', giong: 'us-nam', s: 'Very sensible. And what was your first week like? Were you writing news stories from day one?' },
        { ai: 'Priya', giong: 'uk-nu', s: 'I wish! I thought I would be out interviewing people. In fact, for the whole of the first week, I sat at a desk and read other reporters\' articles, looking for spelling mistakes.' },
        { ai: 'Mark', giong: 'us-nam', s: 'That sounds a bit boring.' },
        { ai: 'Priya', giong: 'uk-nu', s: 'It was, but I learned a lot about how news stories are written.' },
        { ai: 'Mark', giong: 'us-nam', s: 'What was the most difficult thing about the job?' },
        { ai: 'Priya', giong: 'uk-nu', s: 'Before I started, I was worried about telephoning strangers. But after a couple of days, that was fine. And I didn\'t mind the early mornings, even though we started at eight. No, the hardest thing was writing fast. At university, we have a week to write an article. At the Gazette, I sometimes had one hour.' },
        { ai: 'Mark', giong: 'us-nam', s: 'Wow. And what about your boss, the editor? I\'ve heard that editors can be quite frightening.' },
        { ai: 'Priya', giong: 'uk-nu', s: 'People told me that he was unfriendly, and he does look very serious. But he always found time to read my work, and he told me exactly what was wrong with it and how to make it better. I\'ve never had such helpful advice.' },
        { ai: 'Mark', giong: 'us-nam', s: 'So which skills did you improve most?' },
        { ai: 'Priya', giong: 'uk-nu', s: 'Well, not photography. The Gazette has its own photographer, so I never touched a camera. And I worked alone most of the time, so I can\'t say I learned much about teamwork. But I\'m much better at writing headlines now. A good headline has to be short and clear, and that\'s harder than it sounds.' },
        { ai: 'Mark', giong: 'us-nam', s: 'Anything else?' },
        { ai: 'Priya', giong: 'uk-nu', s: 'Yes, checking facts. Every name, every date, every number has to be checked twice. I used to be quite careless about that. I\'m not any more.' },
        { ai: 'Mark', giong: 'us-nam', s: 'Now, tell our listeners how a story actually gets into the newspaper. What happens during the day?' },
        { ai: 'Priya', giong: 'uk-nu', s: 'OK. The day starts at eight o\'clock with a meeting. The editor and all the reporters sit down together and choose the stories for that day\'s paper.' },
        { ai: 'Mark', giong: 'us-nam', s: 'And then you go out and find people to talk to?' },
        { ai: 'Priya', giong: 'uk-nu', s: 'That\'s what I imagined. But actually, most interviews are done by phone, because it\'s so much quicker. Reporters only go out for the really big stories.' },
        { ai: 'Mark', giong: 'us-nam', s: 'I see. And when the story is written?' },
        { ai: 'Priya', giong: 'uk-nu', s: 'It goes to the editor. He reads it, and he nearly always makes it shorter, because there is never enough space on the page. After that, a photograph is added, and someone checks the whole page one last time.' },
        { ai: 'Mark', giong: 'us-nam', s: 'And when does the paper have to be finished?' },
        { ai: 'Priya', giong: 'uk-nu', s: 'At four o\'clock, the finished pages are sent to the printer. By six, the Gazette is in the shops.' },
        { ai: 'Mark', giong: 'us-nam', s: 'Fascinating. Priya, thank you very much.' },
      ],
      nhom: [
        {
          id: 'n3-mcq', tu: 21, den: 24, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B** or **C**.',
          cau: [
            { n: 21, s: 'Why did Priya choose the Dunmore Gazette for her placement?', chon: [{ k: 'A', t: 'Her tutor recommended it.' }, { k: 'B', t: 'She was able to live at home.' }, { k: 'C', t: 'It was her first choice.' }] },
            { n: 22, s: 'What did Priya do during her first week?', chon: [{ k: 'A', t: 'She checked other people\'s articles.' }, { k: 'B', t: 'She wrote news stories.' }, { k: 'C', t: 'She interviewed local people.' }] },
            { n: 23, s: 'What did Priya find most difficult?', chon: [{ k: 'A', t: 'getting up early' }, { k: 'B', t: 'phoning people she did not know' }, { k: 'C', t: 'writing quickly' }] },
            { n: 24, s: 'What does Priya say about the editor?', chon: [{ k: 'A', t: 'He was too busy to help her.' }, { k: 'B', t: 'He gave her very useful advice.' }, { k: 'C', t: 'He was unfriendly to her.' }] },
          ],
        },
        {
          id: 'n3-mcq2', tu: 25, den: 26, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [25, 26],
            s: 'Which TWO skills does Priya say she improved during her placement?',
            chon: [
              { k: 'A', t: 'taking photographs' },
              { k: 'B', t: 'writing headlines' },
              { k: 'C', t: 'working in a team' },
              { k: 'D', t: 'speaking in public' },
              { k: 'E', t: 'checking facts' },
            ],
          },
        },
        {
          id: 'n3-flow', tu: 27, den: 30, dang: 'flow',
          huongDan: 'Complete the flow-chart below.\nWrite **ONE WORD ONLY** for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'A day at the Dunmore Gazette',
          dong: [
            '→ 8 a.m.: the editor and the reporters have a [[27]] to choose the day\'s stories',
            '→ reporters collect information; most interviews are done by [[28]]',
            '→ the editor reads each story and usually makes it [[29]]',
            '→ a photograph is added, and the whole page is checked',
            '→ 4 p.m.: the finished pages go to the [[30]]',
          ],
        },
      ],
    },

    /* ════════════════ PART 4 — bài giảng về thuỷ triều ════════════════ */
    {
      so: 4,
      tieuDe: 'Lecture — the tides',
      dan: 'Part 4. You will hear part of a lecture about the tides. First, you have some time to look at questions 31 to 40.',
      boiCanh: 'Bài giảng nhập môn về thuỷ triều: nguyên nhân (Mặt Trăng, Mặt Trời), vì sao có triều lớn / triều nhỏ, nơi triều cao nhất, và thuỷ triều ảnh hưởng tới con người thế nào (tàu thuyền, nguy hiểm, năng lượng). Chú ý: "not exactly twelve hours", tên "spring" KHÔNG liên quan mùa xuân, từ được đánh vần, và ưu điểm ↔ nhược điểm của điện thuỷ triều.',
      docTruoc: 45,
      loi: [
        { ai: 'Lecturer', giong: 'us-nu', s: 'Good morning, everyone. Today, we are going to look at something that anybody who has spent a day at the beach has noticed: the tides. Twice a day, the sea rises up the beach, and twice a day it goes back down again. I am going to explain why this happens, why some tides are bigger than others, and how tides affect people.' },
        { ai: 'Lecturer', giong: 'us-nu', s: 'Let\'s begin with the cause. People in ancient times already knew that the tides were connected with the Moon, but they did not know why. The first person who explained it correctly was Isaac Newton, in 1687. The explanation is gravity. The Moon\'s gravity pulls on the Earth, and because water can move easily, the water in the oceans is pulled towards the Moon. This creates a kind of hill of water on the side of the Earth that faces the Moon and, for reasons that I will not go into today, a second hill on the opposite side.' },
        { ai: 'Lecturer', giong: 'us-nu', s: 'Now, the Earth is turning all the time. As it turns, each coast passes through both of these hills of water. That is why most places have two high tides and two low tides each day. But here is a detail that surprises many people. The time between one high tide and the next is not exactly twelve hours. It is about twelve hours and twenty-five minutes. So the tides arrive nearly an hour later each day.' },
        { ai: 'Lecturer', giong: 'us-nu', s: 'The Sun also pulls on the oceans. The Sun is much bigger than the Moon, of course, but it is very much further away, so its effect on the tides is less than half as strong.' },
        { ai: 'Lecturer', giong: 'us-nu', s: 'When the Sun, the Earth and the Moon are in a straight line, the Sun and the Moon pull together. This happens at the time of a new moon and a full moon, and it gives us especially large tides. We call them spring tides. Be careful: the name has nothing to do with the season. It comes from an old word that means "to jump". About a week later, the Sun and the Moon are pulling in different directions, and the tides are small. These are called neap tides. I will spell that for you: N, E, A, P.' },
        { ai: 'Lecturer', giong: 'us-nu', s: 'The size of the tide also depends on the shape of the coast. In most of the Mediterranean Sea, the difference between high tide and low tide is less than half a metre. But in the Bay of Fundy, on the east coast of Canada, the water can rise by sixteen metres. That is the height of a five-storey building. Those are the highest tides in the world.' },
        { ai: 'Lecturer', giong: 'us-nu', s: 'So why do tides matter? First, for ships. Large ships can only enter some ports at high tide, when the water is deep enough. For this reason, tide tables, which give the times of the tides, are published a year or more in advance. Second, tides can be dangerous. Every year, visitors walking on wide beaches are surprised by how quickly the sea comes in, and they find themselves cut off from the land.' },
        { ai: 'Lecturer', giong: 'us-nu', s: 'And finally, tides can give us energy. As the water flows in and out, it can turn machines that produce electricity. The first large power station of this kind was opened in 1966 in the north-west of France, and it is still working today. Unlike the wind, the tides are completely reliable: we know exactly when they will come. The main disadvantage is cost. Building the stations is extremely expensive. We will talk more about ocean energy next week.' },
      ],
      nhom: [
        {
          id: 'n4-note', tu: 31, den: 35, dang: 'note',
          huongDan: 'Complete the notes below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'The tides',
          dong: [
            '## The cause of tides',
            '• first explained correctly by Isaac Newton in [[31]]',
            '• the Moon\'s [[32]] pulls the water of the oceans towards it',
            '• time between two high tides: about 12 hours and [[33]] minutes',
            '## Big and small tides',
            '• the Sun\'s effect on tides is less than [[34]] as strong as the Moon\'s',
            '• spring tides: at the time of a new moon and a [[35]] moon',
          ],
        },
        {
          id: 'n4-sentence', tu: 36, den: 38, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nWrite **ONE WORD AND/OR A NUMBER** for each answer.',
          gioiHan: { tu: 1, so: true },
          dong: [
            'The small tides that come about a week after spring tides are known as [[36]] tides.',
            'In the Bay of Fundy in Canada, the sea can rise by [[37]] metres.',
            'The times of the tides are given in tide [[38]], which are published long in advance.',
          ],
        },
        {
          id: 'n4-short', tu: 39, den: 40, dang: 'short',
          huongDan: 'Answer the questions below.\nWrite **NO MORE THAN TWO WORDS** for each answer.',
          gioiHan: { tu: 2 },
          dong: [
            'In which country was the first large tidal power station built? [[39]]',
            'What is the main disadvantage of tidal power stations? [[40]]',
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Part 1 ── */
    1: { a: ['105'], vi: `Carla đọc trên web là £95 — Tom: "I'm afraid that's last year's price. This year it's £105." ⇒ **105**. Bẫy giá cũ / giá mới; Carla nhắc lại "£105". (£110 là khoá tiếng Ý, £150 là khoá nấu ăn — đã in sẵn.) 📘 Ôn Table completion khi nghe: Tập 2 Ngày 5.`, ev: `This year it's £105.` },
    2: { a: ['camera'], vi: `Carla hỏi có cần laptop không — "No, we have computers in the classroom. But you do need to bring your own camera." ⇒ **camera**. Bẫy: "laptop" bị phủ định ngay ("No"); "do need" là cách nhấn mạnh thứ THẬT SỰ cần.`, ev: `But you do need to bring your own camera.` },
    3: { a: ['Wednesday', 'Wednesdays'], vi: `"It was on Mondays last term. But… this term it's on Wednesdays" ⇒ **Wednesday**. Bẫy "last term / this term": thứ Hai là của kỳ trước. Chính tả: W-e-d-n-e-s-day (chữ d đầu câm). 📘 Ôn bẫy đổi ý: Tập 2 Ngày 11.`, ev: `But the teacher has changed, so this term it's on Wednesdays, from half past six to half past eight.` },
    4: { a: ['book'], vi: `"you will have to buy the course book. Some students ask about a dictionary, but you really don't need one" ⇒ **book**. Bẫy: "dictionary" là thứ KHÔNG cần. Carla chốt lại: "OK, just the book."`, ev: `And you will have to buy the course book.` },
    5: { a: ['12', 'twelve'], vi: `"The kitchen has space for sixteen people, but the teacher only takes twelve students" ⇒ **12**. Bảng hỏi sĩ số tối đa của LỚP ("no more than… students in the class") — 16 là sức chứa của bếp. Carla nhắc lại: "Twelve."`, ev: `The kitchen has space for sixteen people, but the teacher only takes twelve students, so that she can help everybody.` },
    6: { a: ['Jensen'], vi: `"Carla Jensen. That's J, E, N, S, E, N." — Tom đọc lại đúng từng chữ ⇒ **Jensen**. Cặp dễ lẫn: J /dʒeɪ/ – G /dʒiː/ và E /iː/ – I /aɪ/. 📘 Ôn Form completion: Tập 2 Ngày 1.`, ev: `Carla Jensen. That's J, E, N, S, E, N.` },
    7: { a: ['Mill'], vi: `Tom nghe nhầm "Hill Road?" — Carla sửa: "No, Mill, with an M. M, I, double L." ⇒ **Mill**. Bẫy âm đầu /h/ – /m/: người hỏi nói SAI để bạn phải nghe phần sửa.`, ev: `No, Mill, with an M. M, I, double L.` },
    8: { a: ['15', '15th', 'fifteenth'], vi: `"the term begins on Monday the 14th of September, but as your class is on a Tuesday, your first lesson will be on the 15th" ⇒ **15**. Phiếu hỏi ngày BUỔI HỌC ĐẦU TIÊN, không phải ngày khai giảng (14).`, ev: `your first lesson will be on the 15th` },
    9: { a: ['card'], vi: `Tiền mặt không nhận ("we don't take cash any more"); có hai cách: chuyển khoản hoặc thẻ — Carla: "Then I'll pay by card now" ⇒ **card**. Đáp án là cách Carla CHỌN, không phải mọi cách được nêu ("bank transfer" hai từ cũng không hợp giới hạn).`, ev: `Then I'll pay by card now, if that's OK.` },
    10: { a: ['neighbour', 'neighbor'], vi: `Tom đoán "our advertisement in the newspaper?" — Carla: "No, I didn't see that. Actually, my neighbour told me about it." ⇒ **neighbour** (chấp nhận cả chính tả Mỹ "neighbor"). "Actually" báo đáp án thật.`, ev: `Actually, my neighbour told me about it.` },

    /* ── Part 2 ── */
    11: { a: ['B'], vi: `"The tour usually lasts three hours. Today, however, … the tour will take two and a half hours." ⇒ **B**. C (3 giờ) là thời lượng THƯỜNG LỆ; "Today, however" báo thay đổi. 📘 Ôn MCQ Part 2: Tập 1 Ngày 9, Tập 2 Ngày 15.`, ev: `Today, however, the cathedral tower is closed for repairs, so we will not be climbing it, and the tour will take two and a half hours.` },
    12: { a: ['C'], vi: `Ô không cần ("you will not need your umbrellas"), áo khoác để lại trên xe ("leave your coats on the coach"). "What you will need is comfortable shoes." ⇒ **C**.`, ev: `What you will need is comfortable shoes.` },
    13: { a: ['A'], vi: `Quán cà phê ven sông là chỗ nghỉ của "most of my tours" (B); phòng trà trong lâu đài "rather expensive" (C). "But today is Saturday… there is a wonderful food market in the Corn Hall. So that is where we will have our break." ⇒ **A**.`, ev: `So that is where we will have our break.` },
    14: { a: ['C'], vi: `Được chụp ở đường phố, lâu đài và cả trong nhà thờ (miễn không dùng flash). "The only place where photography is not allowed is the art gallery." ⇒ **C**.`, ev: `The only place where photography is not allowed is the art gallery.` },
    15: { a: ['A'], vi: `Không gọi điện (điện thoại mất sóng — loại C), không về xe (tài xế không ở đó — loại B). "Just come back to the clock tower here in the market square and wait." ⇒ **A**.`, ev: `Just come back to the clock tower here in the market square and wait.` },
    16: { a: ['D'], vi: `Nhà thờ: nhiều người TƯỞNG nó cổ nhất — "but that isn't true" (loại B). "In 1829, a terrible fire destroyed the roof and most of the windows" ⇒ bị hoả hoạn tàn phá ⇒ **D**. 📘 Ôn Matching khi nghe: Tập 2 Ngày 13 — địa điểm được nói đúng thứ tự câu hỏi; lựa chọn là lời diễn đạt lại.`, ev: `In 1829, a terrible fire destroyed the roof and most of the windows, and it took thirty years to repair the building.` },
    17: { a: ['C'], vi: `Lâu đài: phải trả 5 bảng ("you do have to pay" ⇒ loại A). "From the top of the castle walls, you get the best view of the city" ⇒ **C**.`, ev: `From the top of the castle walls, you get the best view of the city` },
    18: { a: ['B'], vi: `Cầu cổ: "it was built almost nine hundred years ago, a century before the cathedral. Nothing else in the city is as old as that." — không gì cổ bằng = cổ nhất ⇒ **B**. Lựa chọn dùng "structure" (công trình) vì cầu không phải "building".`, ev: `Nothing else in the city is as old as that.` },
    19: { a: ['A'], vi: `Bảo tàng: "it doesn't cost anything to go in" = miễn phí ⇒ **A**. Bẫy G: họ mới "are planning to build a new section next year" — CHƯA xây, nên không phải "has recently been made bigger".`, ev: `One good thing is that it doesn't cost anything to go in` },
    20: { a: ['F'], vi: `Weavers' Lane: "If you want to take presents home for your family, this is the place to get them." ⇒ **F**. Bẫy E: phố "looks like a street in a film" nhưng "nobody has ever made a film there".`, ev: `If you want to take presents home for your family, this is the place to get them.` },

    /* ── Part 3 ── */
    21: { a: ['B'], vi: `Không phải lựa chọn đầu ("Not really" ⇒ loại C); giảng viên giới thiệu một TẠP CHÍ ở London, không phải tờ Gazette (loại A). "The Gazette's office is ten minutes from my parents' house, so I could live at home… That's what decided it." ⇒ **B**. 📘 Ôn MCQ Part 3: Tập 2 Ngày 13.`, ev: `The Gazette's office is ten minutes from my parents' house, so I could live at home for three months.` },
    22: { a: ['A'], vi: `"I thought I would be out interviewing people (C — chỉ là điều cô TƯỞNG). In fact, for the whole of the first week, I sat at a desk and read other reporters' articles, looking for spelling mistakes." ⇒ **A**. "In fact" báo sự thật.`, ev: `In fact, for the whole of the first week, I sat at a desk and read other reporters' articles, looking for spelling mistakes.` },
    23: { a: ['C'], vi: `Gọi cho người lạ: lo trước, nhưng "after a couple of days, that was fine" (loại B); dậy sớm: "I didn't mind" (loại A). "No, the hardest thing was writing fast." — "most difficult" = "hardest", "quickly" = "fast" ⇒ **C**.`, ev: `No, the hardest thing was writing fast.` },
    24: { a: ['B'], vi: `"People told me that he was unfriendly" là lời NGƯỜI KHÁC (loại C); "he always found time to read my work" (loại A). "I've never had such helpful advice." ⇒ **B**.`, ev: `I've never had such helpful advice.` },
    25: { a: ['B', 'E'], vi: `Hai kỹ năng tiến bộ: (1) "I'm much better at writing headlines now" ⇒ **B**. Trước đó Priya loại hai thứ: nhiếp ảnh ("not photography… I never touched a camera" — A) và làm việc nhóm ("I can't say I learned much about teamwork" — C). D (nói trước đám đông) không được nhắc. 📘 Ôn chọn TWO: Tập 2 Ngày 13 — hai đáp án chấm rời, thứ tự nào cũng được.`, ev: `But I'm much better at writing headlines now.` },
    26: { a: ['B', 'E'], vi: `(2) Mark hỏi "Anything else?" — "Yes, checking facts. Every name, every date, every number has to be checked twice." ⇒ **E**. Cặp đáp án là **B và E**.`, ev: `Yes, checking facts.` },
    27: { a: ['meeting'], vi: `"The day starts at eight o'clock with a meeting. The editor and all the reporters sit down together and choose the stories" ⇒ **meeting**. 📘 Ôn Flow-chart khi nghe: Tập 2 Ngày 13 — các bước theo đúng thứ tự lời nói; nghe mốc giờ (eight o'clock, four o'clock).`, ev: `The day starts at eight o'clock with a meeting.` },
    28: { a: ['phone', 'telephone'], vi: `Mark đoán phóng viên ra ngoài gặp người — Priya: "That's what I imagined. But actually, most interviews are done by phone" ⇒ **phone**. "But actually" báo sự thật.`, ev: `But actually, most interviews are done by phone, because it's so much quicker.` },
    29: { a: ['shorter'], vi: `"He reads it, and he nearly always makes it shorter, because there is never enough space" — "usually" = "nearly always" ⇒ **shorter**. Giữ đúng dạng so sánh ("short" là sai).`, ev: `He reads it, and he nearly always makes it shorter, because there is never enough space on the page.` },
    30: { a: ['printer', 'printers'], vi: `"At four o'clock, the finished pages are sent to the printer." — "go to" = "are sent to" ⇒ **printer** (nhà in). Bẫy: "shops" là nơi báo có mặt lúc SÁU giờ.`, ev: `At four o'clock, the finished pages are sent to the printer.` },

    /* ── Part 4 ── */
    31: { a: ['1687'], vi: `"The first person who explained it correctly was Isaac Newton, in 1687." ⇒ **1687** (đọc "sixteen eighty-seven"). 📘 Ôn Part 4 (Note · Sentence · Short answer): Tập 2 Ngày 19.`, ev: `The first person who explained it correctly was Isaac Newton, in 1687.` },
    32: { a: ['gravity'], vi: `"The explanation is gravity. The Moon's gravity pulls on the Earth… the water in the oceans is pulled towards the Moon." ⇒ **gravity** (lực hấp dẫn). Ghi chú "the Moon's ___ pulls the water" lặp gần nguyên cấu trúc câu trong bài giảng.`, ev: `The Moon's gravity pulls on the Earth` },
    33: { a: ['25', 'twenty-five'], vi: `"The time between one high tide and the next is not exactly twelve hours. It is about twelve hours and twenty-five minutes." ⇒ **25**. "12 hours" đã in sẵn; "nearly an hour later each day" là hệ quả, không phải đáp án.`, ev: `It is about twelve hours and twenty-five minutes.` },
    34: { a: ['half'], vi: `"its effect on the tides is less than half as strong" ⇒ **half**. Mặt Trời to hơn nhưng ở xa hơn rất nhiều nên sức hút lên thuỷ triều yếu hơn.`, ev: `so its effect on the tides is less than half as strong` },
    35: { a: ['full'], vi: `"This happens at the time of a new moon and a full moon, and it gives us especially large tides. We call them spring tides." ⇒ **full** (trăng tròn).`, ev: `This happens at the time of a new moon and a full moon, and it gives us especially large tides.` },
    36: { a: ['neap'], vi: `"About a week later… the tides are small. These are called neap tides. I will spell that for you: N, E, A, P." ⇒ **neap**. Từ lạ được ĐÁNH VẦN — đúng như thi thật: nghe đánh vần là biết đó là đáp án. Bẫy: "spring" là triều LỚN.`, ev: `These are called neap tides.` },
    37: { a: ['16', 'sixteen'], vi: `"in the Bay of Fundy, on the east coast of Canada, the water can rise by sixteen metres" ⇒ **16**. Phân biệt sixteen /ˌsɪksˈtiːn/ (16) với sixty /ˈsɪksti/ (60). "less than half a metre" là của Địa Trung Hải; "five-storey" là hình ảnh so sánh.`, ev: `the water can rise by sixteen metres` },
    38: { a: ['tables'], vi: `"tide tables, which give the times of the tides, are published a year or more in advance" — "long in advance" = "a year or more in advance" ⇒ **tables** (bảng thuỷ triều; số nhiều).`, ev: `For this reason, tide tables, which give the times of the tides, are published a year or more in advance.` },
    39: { a: ['France'], vi: `"The first large power station of this kind was opened in 1966 in the north-west of France" ⇒ **France**. Bẫy: Canada vừa được nhắc ở phần triều cao nhất — không liên quan nhà máy điện.`, ev: `The first large power station of this kind was opened in 1966 in the north-west of France, and it is still working today.` },
    40: { a: ['cost', 'the cost'], vi: `"Unlike the wind, the tides are completely reliable (ƯU điểm)… The main disadvantage is cost. Building the stations is extremely expensive." ⇒ **cost**. Câu hỏi lặp đúng cụm "main disadvantage" — nghe cụm đó là bắt đáp án ngay sau. Viết đúng từ NGHE ĐƯỢC: "expensive" là tính từ ở câu sau, "building cost" là cụm tự ghép (bài không nói) — không nhận.`, ev: `The main disadvantage is cost.` },
  },
};
