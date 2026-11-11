/**
 * Đề 1 — Academic Reading, THI CUỐI TẬP 1 (docs/ielts-lo-trinh-0-8.md mục 4.2 · Ngày 15). TỰ SOẠN 12/11/2026.
 * Mức band 3.5–4.5: ĐÚNG FORMAT thật (3 passage · 40 câu · 60 phút) nhưng từ vựng A2–B1, câu ngắn, paraphrase chủ yếu ở
 * mức đồng nghĩa / đổi loại từ. Chỉ dùng các dạng Tập 1 ĐÃ DẠY:
 *   Passage 1 (đời sống đô thị — đèn giao thông): Sentence (N4) · Table (N8) · TFNG (N12)
 *   Passage 2 (giáo dục — lớp học đảo ngược):     Matching features (N10) · Flow-chart (N6) · Sentence (N4)
 *   Passage 3 (công nghệ dễ — mã vạch & mã QR):   TFNG (N12) · Short answer (N2) · Summary có hộp từ (N14)
 * Dữ kiện lịch sử (London 1868, Cleveland 1914, Detroit 1920, Ampelmann 1961; Woodland & Silver 1948–1952, Troy 26/6/1974,
 * QR 1994) là dữ kiện thật, viết lại bằng lời mới. Trường Brookside và các nhân vật ở Passage 2 là HƯ CẤU.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE1: DeDoc = {
  id: 'doc-de1',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 1 (thi cuối Tập 1)',
  boDe: 'Đề 1',
  capDo: 'Band 3.5 → 4.5',
  moTa: 'The story of the traffic light · Turning the classroom upside down · The barcode: lines that changed shopping',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — đời sống đô thị ════════════════ */
    {
      so: 1,
      tieuDe: 'The Story of the Traffic Light',
      phuDe: 'The signal that controls our streets is older than the car',
      gioiThieu: 'You should spend about 20 minutes on **Questions 1–13**, which are based on Reading Passage 1 below.',
      doan: [
        { s: `Every day, millions of drivers, cyclists and pedestrians stop and go because of three coloured lights. Traffic lights are so common that most of us hardly notice them. It may be surprising to learn, then, that the first traffic signal is more than 150 years old. In fact, it was built before the car was even invented.` },
        { s: `In the 1860s, the streets of London were crowded with horses, carriages and people on foot, and accidents were common. A railway engineer called John Peake Knight had an idea. He suggested that the city should use a signal like the ones on the railways. In December 1868, his signal was put up outside the Houses of Parliament. During the day, it had long arms that moved up and down to tell traffic when to stop. At night, when the arms could not be seen, it showed red and green gas lamps instead. A police officer stood beside the signal and changed it by hand. Unfortunately, the experiment ended badly. Early in 1869, gas escaped from the signal and it exploded, and the police officer was badly hurt. The signal was soon taken away, and London did not try the idea again for many years.` },
        { s: `The next steps were taken in the United States, where the number of cars was growing fast. In 1914, one of the first electric traffic signals was installed at a busy street corner in Cleveland, Ohio. It had only two colours, red and green. It also had a buzzer, which made a loud noise to warn drivers that the lights were about to change. However, two colours were not enough. Drivers could not see any warning before the light turned red, so many of them could not stop in time. In 1920, a police officer in Detroit named William Potts solved this problem by adding a third light, yellow, between the red and the green. The yellow light showed drivers that the red light was coming. His signal could also control traffic coming from four directions at the same time, and other cities soon copied it.` },
        { s: `These early electric signals still needed a person to operate them. During the 1920s, engineers began to add timers, so that the lights changed automatically after a fixed number of seconds. This saved money, because cities no longer had to pay police officers to stand at every crossing. But timers had one weakness: people sometimes had to wait at a red light although the other road was completely empty. Later, engineers found an answer. They placed sensors under the surface of the road. These sensors can tell when a vehicle is waiting, so the lights change only when it is necessary.` },
        { s: `People on foot needed signals of their own. The first ones simply showed words such as "WALK" and "DON'T WALK". Later, many countries replaced the words with pictures: a red figure standing still and a green figure walking. Pictures are easier for children to understand, and also for visitors who cannot read the local language. The most famous figure comes from East Berlin. In 1961, a traffic psychologist called Karl Peglau designed a little man wearing a hat, known in German as the "Ampelmann". After Germany became one country again in 1990, the government planned to replace him with the standard figure used in the west. Many people protested, however, and the little man was saved. Today, his picture appears on T-shirts, bags and cups in souvenir shops all over Berlin.` },
        { s: `Traffic lights are still changing today. Many now have a countdown display, which shows how many seconds are left before the light changes. Some make a sound, so that blind people know when it is safe to cross. The old light bulbs have been replaced by LED lamps, which use much less electricity and last for many years. In some cities, the lights are connected to a central computer. Using cameras, the computer watches the traffic and changes the timing of the lights to keep vehicles moving. Engineers are even testing systems in which cars and traffic lights can send messages to each other. Whatever happens in the future, however, the three colours – red, yellow and green – will probably stay with us.` },
      ],
      nhom: [
        {
          id: 'p1-sentence', tu: 1, den: 4, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          dong: [
            'Knight took the idea for his street signal from the signals used on the [[1]].',
            'After dark, the London signal showed red and green [[2]] lamps.',
            'The signal in Cleveland had a [[3]] to tell drivers that the lights would soon change.',
            'The signal designed by Potts could direct traffic from four [[4]] at once.',
          ],
        },
        {
          id: 'p1-table', tu: 5, den: 9, dang: 'table',
          huongDan: 'Complete the table below.\nChoose **ONE WORD AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Later improvements to traffic signals',
          bang: {
            dau: ['Improvement', 'When / where', 'Details'],
            hang: [
              ['timers', '1920s', 'lights changed after a fixed number of [[5]]; cities saved [[6]] because fewer police officers were needed'],
              ['sensors', 'later; under the road', 'they know when a [[7]] is waiting'],
              ['the "Ampelmann"', 'East Berlin, [[8]]', 'a little man with a [[9]]; saved after protests'],
            ],
          },
        },
        {
          id: 'p1-tfng', tu: 10, den: 13, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 10, s: 'Cars were already common in London when the first traffic signal was built.' },
            { n: 11, s: 'John Peake Knight was well paid for designing the London signal.' },
            { n: 12, s: 'A yellow light was added to give drivers a warning before the red light.' },
            { n: 13, s: 'LED lamps cost less to buy than the old light bulbs.' },
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — giáo dục ════════════════ */
    {
      so: 2,
      tieuDe: 'Turning the Classroom Upside Down',
      phuDe: 'In a "flipped" classroom, students meet new ideas at home and practise them at school',
      gioiThieu: 'You should spend about 20 minutes on **Questions 14–26**, which are based on Reading Passage 2 below.',
      doan: [
        { s: `In a traditional lesson, the teacher stands at the front of the room and explains a new topic. The students listen and take notes. Later, at home, they practise alone by doing homework. This pattern has hardly changed for more than a hundred years. In a "flipped classroom", however, the order is turned upside down. Students first meet new ideas at home, usually by watching a short video. Class time is then used for practice, with the teacher there to help.` },
        { s: `The idea became widely known after 2007, when two teachers at a school in Colorado, in the United States, began to record their chemistry lessons. At first, the recordings were only for students who had been absent. But the teachers soon noticed something interesting: students who had been in class were watching the videos too, because they wanted to go over the lesson again. Since then, schools in many countries have tried the method.` },
        { s: `How does a flipped lesson work? David Osei, who teaches maths at Brookside School in the north of England, describes his week. First, he records a video of about ten minutes and puts it on the school website. At home, his students watch the video. They can stop it or repeat any part, and they write down any questions they have. They then complete a short online quiz. Before the lesson, Mr Osei looks at the results of the quiz to see which points were difficult. In class, there is a short discussion of the students' questions. After that, the students solve problems in small groups, while the teacher walks around the room and helps anyone who is stuck. Finally, the students write a summary of what they have learned in their notebooks.` },
        { s: `Mr Osei says the biggest change is in how he uses his time. "I used to talk for forty minutes while thirty students sat in silence," he says. "Now I speak to every student at least once in each lesson." He admits, however, that the method was hard work at the start. "In the first year, I spent most of my weekends making videos," he says.` },
        { s: `The students have noticed a difference too. Sofia Rossi, who is fifteen, likes being able to watch the difficult parts again. "In a normal lesson, I was too shy to ask the teacher to repeat something," she explains. "With a video, I can play it three times and nobody knows." But she adds that the system only works if everyone prepares. "Some of my classmates don't watch the videos," she says, "and then they can't join in the group work."` },
        { s: `The head teacher of Brookside, Helen Marsh, supports the method but sees some problems. "Not every family has a fast internet connection or a quiet place to study," she says. For this reason, the school now opens its computer room for an hour before lessons begin, so that students can watch the videos there. Mrs Marsh also points out that flipped lessons do not suit every subject. "They work very well in maths and science," she says, "but our art and sports teachers have not found them helpful."` },
        { s: `What do researchers think? Dr Laura Benton, from a university in Scotland, followed students at twelve schools for three years. She found that test results were a little better, on average, in flipped classes. The biggest improvement was among weaker students, perhaps because they received more help from the teacher. However, Dr Benton warns that the video is not the important part. "If the teacher just hands out worksheets in class, nothing has really changed," she says. "What matters most is what students do in the classroom." She also believes that the method is more suitable for teenagers than for young children, who often find it hard to work without an adult.` },
        { s: `At Brookside, the experiment will continue. When the school asked parents for their opinion, most of them said they were happy with the new lessons, although some were worried at first about the extra time their children spent looking at screens. Next year, the school plans to use the method in history and geography as well. The flipped classroom is not magic, but it has given teachers like Mr Osei something valuable: time to teach each student.` },
      ],
      nhom: [
        {
          id: 'p2-feature', tu: 14, den: 19, dang: 'match-feature',
          huongDan: 'Look at the following statements (Questions 14–19) and the list of people below.\nMatch each statement with the correct person, **A–D**.\nNB You may use any letter more than once.',
          hop: {
            tieuDe: 'List of People',
            ds: [
              { k: 'A', t: 'David Osei' },
              { k: 'B', t: 'Helen Marsh' },
              { k: 'C', t: 'Laura Benton' },
              { k: 'D', t: 'Sofia Rossi' },
            ],
          },
          cau: [
            { n: 14, s: 'The activities in class are more important than the videos.' },
            { n: 15, s: 'Preparing the materials took a lot of free time at the beginning.' },
            { n: 16, s: 'Asking a teacher to explain something again can be embarrassing.' },
            { n: 17, s: 'Flipped lessons are more useful in some school subjects than in others.' },
            { n: 18, s: 'Students who have not prepared at home cannot take part properly in class.' },
            { n: 19, s: 'Some families do not have the technology or the space that students need at home.' },
          ],
        },
        {
          id: 'p2-flow', tu: 20, den: 23, dang: 'flow',
          huongDan: 'Complete the flow-chart below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'A flipped maths lesson at Brookside School',
          dong: [
            '→ The teacher records a short video and puts it on the school [[20]].',
            '→ At home, students watch the video and note down their [[21]].',
            '→ Students do a short online [[22]], and the teacher checks the results before the lesson.',
            '→ In class, there is a discussion. Then students solve problems in small [[23]].',
            '→ The teacher helps anyone who is stuck. At the end, students write a summary.',
          ],
        },
        {
          id: 'p2-sentence', tu: 24, den: 26, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          dong: [
            'The two teachers in Colorado made recordings of their [[24]] lessons.',
            'In Dr Benton\'s study, the students who improved most were the [[25]] ones.',
            'Next year, Brookside will also use flipped lessons in history and [[26]].',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — công nghệ dễ ════════════════ */
    {
      so: 3,
      tieuDe: 'The Barcode: Lines That Changed Shopping',
      phuDe: 'How an idea drawn in the sand ended up on almost every product in the world',
      gioiThieu: 'You should spend about 20 minutes on **Questions 27–40**, which are based on Reading Passage 3 below.',
      doan: [
        { s: `Look at almost any product in a shop – a carton of milk, a book, a pair of shoes – and you will find a small square of black and white lines. A machine reads this barcode in less than a second, with a short "beep". We hear that sound so often that we no longer notice it. Yet the barcode took more than twenty-five years to travel from an idea to the supermarket.` },
        { s: `The story begins in 1948 in Philadelphia, in the United States. A student called Bernard Silver happened to hear a conversation at his college. The president of a local supermarket company was asking a senior person at the college for help. His shops needed a way to record each product automatically when customers paid, because typing every price by hand was slow and caused mistakes. The college was not interested, but Silver was. He described the problem to his friend Norman Joseph Woodland, and the two young men decided to work on it together.` },
        { s: `Woodland found the answer in an unusual place. He had moved to Florida, and one day he was sitting on a beach, thinking about Morse code, the system of dots and dashes that he had learned as a boy. He pushed his fingers into the sand and pulled them towards him, drawing a set of lines. Suddenly he understood: thin and thick lines could carry information in the same way as dots and dashes. In 1952, they received a patent for their invention. It showed a set of straight lines, but it also showed a second design that was not made of lines at all. It was a set of circles, one inside another, like a target. The advantage of this shape was that a machine could read it from any direction.` },
        { s: `Unfortunately, the invention was ahead of its time. To read the code, a shop needed a small, strong light and a cheap computer, and neither existed in the early 1950s. The solution to the first problem was the laser, which was not invented until 1960. Woodland and Silver sold their patent for only 15,000 dollars, and Silver died in 1963 without ever seeing a barcode in a shop.` },
        { s: `In the early 1970s, American supermarkets finally agreed that all their products should carry the same kind of code. The design they chose came from the computer company IBM, where Woodland now worked. It used straight lines instead of circles, because lines were easier to print clearly on packets. On 26 June 1974, in a supermarket in the town of Troy, Ohio, the new system was used for the first time. The first product to be scanned was a packet of chewing gum, which cost 67 cents. That packet of gum was later given to a museum in Washington.` },
        { s: `The barcode did not become popular overnight. Scanners were expensive, so shops did not want to buy them until most products had codes. Food companies, on the other hand, did not want to print codes until most shops had scanners. For several years, the system spread very slowly. Some customers were unhappy too. When barcodes arrived, shops stopped putting a price label on every item, and shoppers complained that they could no longer check what they were paying. In the end, though, the advantages were clear. Queues moved faster, there were fewer mistakes, and for the first time managers knew exactly what they had sold and what they needed to order.` },
        { s: `In 1994, a Japanese engineer called Masahiro Hara took the idea a step further. His company made parts for cars, and every box of parts in its factories carried a barcode. But an ordinary barcode can only hold about twenty letters or numbers. This was not enough information, so workers had to scan several codes on every box. Hara's answer was a square pattern of black and white dots that could hold thousands of characters. He called it the QR code – QR means "quick response". Three large squares in its corners tell the scanner where the code begins, so it can be read at high speed from any angle. Hara has said that the idea for the pattern came from the black and white stones of a board game that he played in his lunch breaks.` },
        { s: `Hara's company decided that the QR code should be free to use, and it did not ask other companies for money. At first, the code was used mainly in factories. Everything changed when mobile phones with cameras appeared. Suddenly anyone could read a QR code, and the pattern began to appear on posters, tickets and bills. During 2020 and 2021, many restaurants even replaced their paper menus with a QR code on the table. More than fifty years after that first packet of chewing gum, black and white patterns are part of everyday life – and most of us never think about the people who invented them.` },
      ],
      nhom: [
        {
          id: 'p3-tfng', tu: 27, den: 32, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 3?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 27, s: 'Bernard Silver found out about the supermarket company\'s problem by chance.' },
            { n: 28, s: 'Woodland had his idea while he was working in a laboratory.' },
            { n: 29, s: 'The round design in the patent could be read from any direction.' },
            { n: 30, s: 'The chewing gum was the cheapest thing that the customer in Troy bought.' },
            { n: 31, s: 'Most shops started using barcodes soon after 1974.' },
            { n: 32, s: 'Some shoppers complained when price labels were removed from products.' },
          ],
        },
        {
          id: 'p3-short', tu: 33, den: 35, dang: 'short',
          huongDan: 'Answer the questions below.\nChoose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 2, so: true },
          dong: [
            'Which system of dots and dashes was Woodland thinking about on the beach? [[33]]',
            'In which year did Woodland and Silver receive a patent? [[34]]',
            'Which invention of 1960 made it possible to read barcodes? [[35]]',
          ],
        },
        {
          id: 'p3-summary', tu: 36, den: 40, dang: 'summary-box',
          huongDan: 'Complete the summary using the list of words, **A–I**, below.',
          tieuDe: 'The QR code',
          dong: [
            'The QR code was invented in Japan in 1994 by an engineer whose company produced car [[36]]. Ordinary barcodes could not store enough [[37]], so employees had to scan several of them. The new code has three large squares in its corners, and for this reason it can be read at great [[38]] from any angle. The company decided that the code should be [[39]] for everybody to use. In its early years, the code was found mostly in [[40]], but camera phones later brought it to the general public.',
          ],
          hop: {
            ds: [
              { k: 'A', t: 'colours' }, { k: 'B', t: 'factories' }, { k: 'C', t: 'free' }, { k: 'D', t: 'information' }, { k: 'E', t: 'money' },
              { k: 'F', t: 'parts' }, { k: 'G', t: 'restaurants' }, { k: 'H', t: 'shops' }, { k: 'I', t: 'speed' },
            ],
          },
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['railways', 'railway'], vi: `Bài: "He suggested that the city should use a signal like the ones on the railways." Câu hỏi đổi "use a signal like the ones on…" thành "took the idea… from the signals used on the…" ⇒ **railways**. Bẫy: "Parliament" là NƠI ĐẶT tín hiệu, không phải nguồn ý tưởng; "railway engineer" là nghề của Knight — câu hỏi cần danh từ sau "on the". 📘 Ôn dạng Sentence Completion: Ngày 4.`, ev: 'He suggested that the city should use a signal like the ones on the railways.' },
    2: { a: ['gas'], vi: `"At night… it showed red and green gas lamps instead." — "After dark" = "At night" ⇒ **gas**. Ô trống đứng giữa "green" và "lamps" nên cần một từ bổ nghĩa cho "lamps". Đừng điền "long" (đó là "long arms" — dùng BAN NGÀY).`, ev: 'At night, when the arms could not be seen, it showed red and green gas lamps instead.' },
    3: { a: ['buzzer'], vi: `"It also had a buzzer, which made a loud noise to warn drivers that the lights were about to change." — "tell drivers… would soon change" = "warn drivers… were about to change" ⇒ **buzzer** (còi kêu). Chép đúng chính tả: hai chữ z.`, ev: 'It also had a buzzer, which made a loud noise to warn drivers that the lights were about to change.' },
    4: { a: ['directions'], vi: `"His signal could also control traffic coming from four directions at the same time" — "direct" = "control", "at once" = "at the same time" ⇒ **directions** (số nhiều vì đứng sau "four"; viết "direction" là sai ngữ pháp ⇒ mất điểm).`, ev: 'His signal could also control traffic coming from four directions at the same time' },
    5: { a: ['seconds'], vi: `Bảng, hàng "timers": bài viết "the lights changed automatically after a fixed number of seconds" ⇒ **seconds**. Giữ nguyên số nhiều như trong bài. 📘 Ôn dạng Table Completion: Ngày 8 — đọc tiêu đề cột trước, rồi dò theo hàng.`, ev: 'the lights changed automatically after a fixed number of seconds' },
    6: { a: ['money'], vi: `"This saved money, because cities no longer had to pay police officers to stand at every crossing." — "fewer police officers were needed" = "no longer had to pay police officers" ⇒ **money**. Bẫy: "time" nghe hợp lý nhưng bài KHÔNG nói tiết kiệm thời gian.`, ev: 'This saved money, because cities no longer had to pay police officers to stand at every crossing.' },
    7: { a: ['vehicle'], vi: `"These sensors can tell when a vehicle is waiting" — "know" = "can tell" ⇒ **vehicle**. Phải chép đúng từ trong bài: "car" không xuất hiện ở câu này nên không được chấp nhận (dạng completion bắt chép nguyên văn).`, ev: 'These sensors can tell when a vehicle is waiting' },
    8: { a: ['1961'], vi: `"In 1961, a traffic psychologist called Karl Peglau designed a little man" ⇒ **1961**. Bẫy: 1990 là năm nước Đức thống nhất và người ta ĐỊNH BỎ hình này — không phải năm nó ra đời.`, ev: 'In 1961, a traffic psychologist called Karl Peglau designed a little man wearing a hat' },
    9: { a: ['hat'], vi: `"a little man wearing a hat" — bảng viết "a little man with a ___" ("with" = "wearing") ⇒ **hat**.`, ev: 'designed a little man wearing a hat' },
    10: { a: ['FALSE'], vi: `Bài nói tín hiệu đầu tiên "was built before the car was even invented", và đường phố London lúc đó đầy "horses, carriages and people on foot". Câu hỏi nói ô tô ĐÃ phổ biến ⇒ trái ngược ⇒ **FALSE**. 📘 Ôn dạng TFNG: Ngày 12 — FALSE là khi bài nói ĐIỀU NGƯỢC LẠI.`, ev: 'In fact, it was built before the car was even invented.' },
    11: { a: ['NOT GIVEN'], vi: `Bài chỉ nói Knight là kỹ sư đường sắt, "had an idea" và tín hiệu của ông được dựng năm 1868. KHÔNG có chữ nào về tiền công (được trả nhiều, ít hay không được trả) ⇒ **NOT GIVEN**. Đừng chọn FALSE: FALSE cần bài nói ngược lại (ví dụ "he was not paid").`, ev: 'A railway engineer called John Peake Knight had an idea.' },
    12: { a: ['TRUE'], vi: `"Drivers could not see any warning before the light turned red… William Potts solved this problem by adding a third light, yellow… The yellow light showed drivers that the red light was coming." — "give drivers a warning before the red light" = "showed drivers that the red light was coming" ⇒ **TRUE**. (Còi "buzzer" ở Cleveland là cảnh báo bằng TIẾNG; đèn vàng là cảnh báo NHÌN THẤY được.)`, ev: 'The yellow light showed drivers that the red light was coming.' },
    13: { a: ['NOT GIVEN'], vi: `Bài nói đèn LED "use much less electricity and last for many years" (tốn ít điện, bền) — KHÔNG nói GIÁ MUA rẻ hơn hay đắt hơn bóng cũ ⇒ **NOT GIVEN**. Bẫy kinh điển: "ít tốn điện" ≠ "rẻ hơn khi mua"; đừng tự suy luận thêm.`, ev: 'The old light bulbs have been replaced by LED lamps, which use much less electricity and last for many years.' },

    /* ── Passage 2 ── */
    14: { a: ['C'], vi: `Dr Laura Benton: "the video is not the important part… What matters most is what students do in the classroom." = hoạt động trên lớp quan trọng hơn video ⇒ **C**. 📘 Ôn dạng Matching Features: Ngày 10 — khoanh tên người trước, đọc quanh tên, một người có thể dùng nhiều lần.`, ev: '"What matters most is what students do in the classroom."' },
    15: { a: ['A'], vi: `David Osei: "In the first year, I spent most of my weekends making videos" — "preparing the materials" = "making videos", "free time" = "weekends", "at the beginning" = "in the first year" ⇒ **A**.`, ev: '"In the first year, I spent most of my weekends making videos,"' },
    16: { a: ['D'], vi: `Sofia Rossi: "I was too shy to ask the teacher to repeat something" — "embarrassing" ≈ "too shy", "explain something again" = "repeat something" ⇒ **D**.`, ev: '"In a normal lesson, I was too shy to ask the teacher to repeat something,"' },
    17: { a: ['B'], vi: `Helen Marsh: "flipped lessons do not suit every subject. They work very well in maths and science… but our art and sports teachers have not found them helpful." ⇒ **B**. Bẫy: Dr Benton cũng nói phương pháp hợp với một NHÓM hơn nhóm khác — nhưng đó là theo TUỔI (teenagers / young children), không phải theo MÔN.`, ev: 'Mrs Marsh also points out that flipped lessons do not suit every subject.' },
    18: { a: ['D'], vi: `Sofia Rossi: "Some of my classmates don't watch the videos… and then they can't join in the group work." — "have not prepared at home" = "don't watch the videos", "cannot take part" = "can't join in" ⇒ **D** (dùng D lần thứ hai — đề đã báo "may use any letter more than once").`, ev: '"and then they can\'t join in the group work."' },
    19: { a: ['B'], vi: `Helen Marsh: "Not every family has a fast internet connection or a quiet place to study" — "technology" = "internet connection", "space" = "a quiet place to study" ⇒ **B**. Bẫy: Dr Benton nói trẻ nhỏ khó tự học khi không có người lớn — đó là chuyện tính tự giác, không phải thiếu thiết bị hay chỗ học.`, ev: '"Not every family has a fast internet connection or a quiet place to study,"' },
    20: { a: ['website'], vi: `"he records a video of about ten minutes and puts it on the school website" ⇒ **website**. 📘 Ôn dạng Flow-chart: Ngày 6 — sơ đồ đi ĐÚNG thứ tự bài đọc, tìm các từ chỉ trình tự (First, then, Before, After that, Finally).`, ev: 'First, he records a video of about ten minutes and puts it on the school website.' },
    21: { a: ['questions'], vi: `"they write down any questions they have" — "note down" = "write down" ⇒ **questions** (số nhiều như trong bài).`, ev: 'they write down any questions they have' },
    22: { a: ['quiz'], vi: `"They then complete a short online quiz." — "do" = "complete" ⇒ **quiz**. Bước sau trong sơ đồ ("the teacher checks the results") khớp câu "Mr Osei looks at the results of the quiz" ⇒ chắc chắn đúng chỗ.`, ev: 'They then complete a short online quiz.' },
    23: { a: ['groups'], vi: `"the students solve problems in small groups" ⇒ **groups**. Đừng điền "notebooks" — đó là chỗ viết tóm tắt ở bước cuối.`, ev: 'the students solve problems in small groups' },
    24: { a: ['chemistry'], vi: `"two teachers at a school in Colorado… began to record their chemistry lessons" ⇒ **chemistry**. Bẫy: "maths" là môn của thầy Osei ở Anh, không phải của hai giáo viên ở Colorado.`, ev: 'began to record their chemistry lessons' },
    25: { a: ['weaker'], vi: `"The biggest improvement was among weaker students" — "improved most" = "the biggest improvement" ⇒ **weaker**. Chép đúng dạng so sánh "weaker" (không phải "weak").`, ev: 'The biggest improvement was among weaker students' },
    26: { a: ['geography'], vi: `"Next year, the school plans to use the method in history and geography as well." ⇒ **geography**. Bẫy: "maths and science" là các môn ĐANG dùng tốt; "art and sports" là các môn KHÔNG thấy hữu ích.`, ev: 'Next year, the school plans to use the method in history and geography as well.' },

    /* ── Passage 3 ── */
    27: { a: ['TRUE'], vi: `"Bernard Silver happened to hear a conversation at his college." — "happened to hear" = tình cờ nghe được = "by chance" ⇒ **TRUE**. Cụm "happen to + V" là chìa khoá của câu này.`, ev: 'A student called Bernard Silver happened to hear a conversation at his college.' },
    28: { a: ['FALSE'], vi: `Bài: "one day he was sitting on a beach, thinking about Morse code" — ý tưởng đến khi ông ngồi trên BÃI BIỂN, không phải khi làm việc trong phòng thí nghiệm ⇒ **FALSE**.`, ev: 'one day he was sitting on a beach, thinking about Morse code' },
    29: { a: ['TRUE'], vi: `Bằng sáng chế có một mẫu thứ hai là các vòng tròn lồng nhau ("round design" = "a set of circles… like a target"), và "The advantage of this shape was that a machine could read it from any direction." ⇒ **TRUE**.`, ev: 'The advantage of this shape was that a machine could read it from any direction.' },
    30: { a: ['NOT GIVEN'], vi: `Bài chỉ nói gói kẹo cao su là món ĐẦU TIÊN được quét và giá 67 xu. Không có thông tin về các món khác người khách mua, nên không biết nó có phải món RẺ NHẤT không ⇒ **NOT GIVEN**. Bẫy: "first" (đầu tiên) ≠ "cheapest" (rẻ nhất).`, ev: 'The first product to be scanned was a packet of chewing gum, which cost 67 cents.' },
    31: { a: ['FALSE'], vi: `"The barcode did not become popular overnight… For several years, the system spread very slowly." — câu hỏi nói phần lớn cửa hàng dùng NGAY sau 1974 ⇒ trái ngược ⇒ **FALSE**.`, ev: 'For several years, the system spread very slowly.' },
    32: { a: ['TRUE'], vi: `"shops stopped putting a price label on every item, and shoppers complained that they could no longer check what they were paying" — "price labels were removed" = "stopped putting a price label" ⇒ **TRUE**.`, ev: 'shops stopped putting a price label on every item, and shoppers complained that they could no longer check what they were paying' },
    33: { a: ['Morse code', 'Morse'], vi: `"thinking about Morse code, the system of dots and dashes that he had learned as a boy" ⇒ **Morse code** (2 từ, đúng giới hạn). 📘 Ôn dạng Short answer: Ngày 2 — gạch từ để hỏi (Which system) rồi tìm đúng loại thông tin; trả lời bằng TỪ TRONG BÀI, không viết cả câu.`, ev: 'thinking about Morse code, the system of dots and dashes that he had learned as a boy' },
    34: { a: ['1952'], vi: `"In 1952, they received a patent for their invention." ⇒ **1952**. Bẫy: 1948 là năm câu chuyện bắt đầu; 1963 là năm Silver mất; 1974 là lần quét đầu tiên.`, ev: 'In 1952, they received a patent for their invention.' },
    35: { a: ['laser', 'the laser', 'lasers'], vi: `"The solution to the first problem was the laser, which was not invented until 1960." ⇒ **(the) laser**. Bẫy: "a cheap computer" cũng là thứ còn thiếu, nhưng bài không gắn nó với năm 1960.`, ev: 'The solution to the first problem was the laser, which was not invented until 1960.' },
    36: { a: ['F'], vi: `"His company made parts for cars" — tóm tắt đổi thành "produced car ___" ⇒ **F (parts)**. 📘 Ôn dạng Summary có hộp từ: Ngày 14 — đoán LOẠI TỪ của ô trống trước (ở đây: danh từ), rồi mới dò bài.`, ev: 'His company made parts for cars' },
    37: { a: ['D'], vi: `"an ordinary barcode can only hold about twenty letters or numbers. This was not enough information" — "store" = "hold" ⇒ **D (information)**. "money" (E) không liên quan: mã vạch chứa thông tin, không chứa tiền.`, ev: 'This was not enough information, so workers had to scan several codes on every box.' },
    38: { a: ['I'], vi: `"so it can be read at high speed from any angle" — "at great ___" = "at high speed" ⇒ **I (speed)**.`, ev: 'so it can be read at high speed from any angle' },
    39: { a: ['C'], vi: `"Hara's company decided that the QR code should be free to use" ⇒ **C (free)**. Đây là ô duy nhất cần TÍNH TỪ (sau "should be") — trong hộp chỉ có "free" là tính từ.`, ev: 'decided that the QR code should be free to use' },
    40: { a: ['B'], vi: `"At first, the code was used mainly in factories." — "In its early years" = "At first", "mostly" = "mainly" ⇒ **B (factories)**. Bẫy: "restaurants" (G) chỉ dùng mã QR từ 2020–2021, tức là RẤT MUỘN; "shops" (H) gắn với mã vạch thường, không phải mã QR thời kỳ đầu.`, ev: 'At first, the code was used mainly in factories.' },
  },
};
