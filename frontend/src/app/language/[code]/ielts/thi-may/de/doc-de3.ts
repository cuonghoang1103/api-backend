/**
 * Đề 3 — Academic Reading, THI CUỐI TẬP 2 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Ngày 24). TỰ SOẠN 12/11/2026.
 * Mức band 5.0: đúng format thật (3 passage · 40 câu · 60 phút), từ vựng B1, paraphrase đồng nghĩa + đổi loại từ + đổi cấu trúc
 * (chủ động ↔ bị động), Passage 3 là bài NÊU QUAN ĐIỂM để hỏi Yes/No/Not Given. Dùng các dạng Tập 2 dạy ở nửa sau
 * (N16 Matching information · N18 Matching sentence endings · N20 YNNG · N22 Diagram) + dạng đã học trước đó:
 *   Passage 1 (du lịch — London Eye):            Diagram label · Sentence completion · TFNG
 *   Passage 2 (thể thao — lịch sử marathon):     Matching information · Summary (từ trong bài) · Short answer
 *   Passage 3 (truyền thông — tin nhanh/tin chậm): YNNG · Matching sentence endings · MCQ (4 lựa chọn)
 *   (CHƯA dùng MCQ chọn nhiều đáp án — Tập 3 Ngày 13 mới dạy.)
 * DỮ KIỆN THẬT đã đối chiếu 12/11/2026 (Wikipedia: London Eye · Marathon): cao 135 m; Marks & Barfield; cuộc thi 1993 không
 * có giải, hai người thế chấp nhà để theo dự án; khung chữ A một bên + cáp; 32 khoang, 25 người/khoang, đánh số 1–33 bỏ 13; ráp nằm trên sông, nâng 2°/giờ tới 65° rồi
 * giữ một tuần; thép Anh – gia công Hà Lan, cáp Ý, khoang Pháp; khai trương 31/12/1999 không chở khách, công chúng 3/2000;
 * ~30 phút/vòng; cao nhất thế giới tới 2006; giấy phép 5 năm → vĩnh viễn 2002; >3 triệu khách/năm. Marathon: 490 TCN;
 * Bréal + cúp bạc; 1896 Spyridon Louis (người gánh nước) 2:58:50, 17 người xuất phát; 1908 Windsor Castle, 26 dặm 385 yard;
 * chuẩn hoá 1921; Bobbi Gibb 1966; Kathrine Switzer 1967 ("K. V. Switzer"); Boston nhận nữ 1972; Olympic nữ 1984 Los Angeles,
 * Joan Benoit 2:24:52; Kipchoge 1:59:40, Vienna, 10/2019, không được công nhận kỷ lục; >800 giải/năm; 1904 St Louis 32 xuất phát /
 * 14 về đích; kỷ lục nữ 3:19 (1964) → 2:22:43 (1983); New York 1970: 127 người, chạy vòng trong Central Park, nay >50.000 về đích.
 * London Eye bổ sung: đường kính 120 m; 0,9 km/giờ; 1.600 khách/giờ; tầm nhìn ~40 km (londoneye.com); The Shard 2013.
 * Passage 3 là bài QUAN ĐIỂM tự viết; Dr Hannah Reeve và nghiên cứu 200 người là HƯ CẤU (phục vụ câu hỏi).
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE3: DeDoc = {
  id: 'doc-de3',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 3 (thi cuối Tập 2)',
  boDe: 'Đề 3',
  capDo: 'Band 5.0',
  moTa: 'A wheel for a new century (the London Eye) · The long road of the marathon · Why slow news matters',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — du lịch ════════════════ */
    {
      so: 1,
      tieuDe: 'A Wheel for a New Century',
      phuDe: 'The London Eye was planned as a temporary attraction. A quarter of a century later, it is still turning',
      gioiThieu: 'You should spend about 20 minutes on **Questions 1–13**, which are based on Reading Passage 1 below.',
      doan: [
        { s: `Every year, more than three million people queue on the south bank of the River Thames to take a slow ride into the sky. The London Eye, a giant observation wheel 135 metres high, has become one of the best-known sights in Britain. On a clear day, passengers at the top can see for about 40 kilometres. Yet when it was first suggested, many people thought that it would never be built – and it was only meant to stand for five years.` },
        { s: `The story began in 1993, when a newspaper and an architecture organisation held a competition. They asked for designs for a new landmark to celebrate the year 2000. Two London architects, David Marks and Julia Barfield, who were husband and wife, sent in their idea for a great wheel beside the river. The judges, however, were not satisfied with any of the designs, and no winner was chosen. Marks and Barfield refused to give up. They believed in their wheel so strongly that they borrowed money against their own home, and they spent the next few years looking for investors and for a place to put it.` },
        { s: `The design was unusual. Most big wheels, such as those at fairs, are held up on both sides. The London Eye, which is 120 metres across, is supported on one side only, by a huge A-shaped frame that leans towards the water. This means that nothing stands between the passengers and the river. At the centre of the wheel is the hub. Steel cables run from the hub to the rim, the outer circle of the wheel, just like the thin wires in a bicycle wheel. The passengers ride in 32 glass capsules. On older wheels, the cabins hang inside the structure, which blocks part of the view. Here, the capsules are fixed to the outside of the rim, so passengers can see in every direction.` },
        { s: `Building the wheel was an international project. The steel came from Britain and was cut and shaped in the Netherlands. The cables were made in Italy, the hub was made in the Czech Republic, and the capsules were built in France. The parts of the wheel were carried up the Thames on boats and put together lying flat, on platforms in the river. Then the wheel was slowly lifted, at about two degrees an hour, until it reached an angle of 65 degrees. It stayed in that position for a week while engineers prepared the second stage of the lift.` },
        { s: `The Prime Minister officially opened the London Eye on 31 December 1999, but there were no passengers that night. A technical problem with the capsules had been found, and the public had to wait until March 2000 for their first ride. Since then, the wheel has hardly stopped. It turns so slowly – at less than one kilometre an hour, so that one full circle takes about half an hour – that people can simply walk on and off while it is moving. It only stops when disabled or elderly passengers need extra time. Each capsule holds up to 25 people, who are free to walk around inside. The capsules are numbered from 1 to 33; because some people believe that 13 is unlucky, there is no capsule with that number. In one hour, about 1,600 people can take the ride.` },
        { s: `When it opened, the London Eye was the tallest observation wheel in the world. It lost that title in 2006 to a wheel in China, and taller ones have been built since. For a few more years, it remained the highest public viewing point in London, until a platform opened near the top of a new skyscraper, the Shard, in 2013. But height is not the reason for its success. The local council had at first given permission for only five years. The wheel was so popular, however, that in 2002 the council agreed that it could stay permanently. Today it appears in films, on postcards and in countless holiday photographs of London. A structure that the competition judges did not want has become one of the symbols of the city.` },
      ],
      nhom: [
        {
          id: 'p1-diagram', tu: 1, den: 4, dang: 'diagram',
          huongDan: 'Label the diagram below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'The structure of the London Eye',
          hinh: {
            w: 560, h: 360,
            chuThich: 'Sơ đồ đơn giản của London Eye nhìn từ phía sông (tự vẽ, không theo tỷ lệ)',
            ve: [
              // Sông + bờ
              { t: 'rect', x: 0, y: 305, w: 560, h: 55, nen: '#cfe3f2', bo: 0 },
              { t: 'text', x: 470, y: 338, s: 'River Thames', co: 12, nghieng: true },
              // Khung chữ A (hai chân từ trục xuống bờ)
              { t: 'line', d: [[230, 160], [165, 305]], day: 7, mau: '#7a7a7a' },
              { t: 'line', d: [[230, 160], [295, 305]], day: 7, mau: '#7a7a7a' },
              { t: 'line', d: [[196, 236], [264, 236]], day: 5, mau: '#7a7a7a' },
              // Vành + nan (cáp)
              { t: 'circle', x: 230, y: 160, r: 110 },
              { t: 'circle', x: 230, y: 160, r: 106 },
              { t: 'line', d: [[230, 160], [340, 160]], day: 0.8 },
              { t: 'line', d: [[230, 160], [325, 215]], day: 0.8 },
              { t: 'line', d: [[230, 160], [285, 255]], day: 0.8 },
              { t: 'line', d: [[230, 160], [230, 270]], day: 0.8 },
              { t: 'line', d: [[230, 160], [175, 255]], day: 0.8 },
              { t: 'line', d: [[230, 160], [135, 215]], day: 0.8 },
              { t: 'line', d: [[230, 160], [120, 160]], day: 0.8 },
              { t: 'line', d: [[230, 160], [135, 105]], day: 0.8 },
              { t: 'line', d: [[230, 160], [175, 65]], day: 0.8 },
              { t: 'line', d: [[230, 160], [230, 50]], day: 0.8 },
              { t: 'line', d: [[230, 160], [285, 65]], day: 0.8 },
              { t: 'line', d: [[230, 160], [325, 105]], day: 0.8 },
              // Trục giữa
              { t: 'circle', x: 230, y: 160, r: 11, nen: '#555555' },
              { t: 'text', x: 246, y: 150, s: 'hub', co: 12, dam: true },
              // Các khoang ngoài vành
              { t: 'circle', x: 351, y: 160, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 335, y: 221, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 291, y: 265, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 230, y: 281, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 169, y: 265, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 125, y: 221, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 109, y: 160, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 125, y: 99, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 169, y: 55, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 230, y: 39, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 291, y: 55, r: 8, nen: '#dbe7f3' },
              { t: 'circle', x: 335, y: 99, r: 8, nen: '#dbe7f3' },
              // Nhãn 1 — khoang
              { t: 'line', d: [[398, 50], [345, 94]], mui: true, mau: '#333' },
              { t: 'text', x: 404, y: 40, s: 'glass', co: 12 },
              { t: 'o', n: 1, x: 478, y: 36 },
              { t: 'text', x: 404, y: 64, s: 'for passengers (32 in total)', co: 11, nghieng: true },
              // Nhãn 2 — vành
              { t: 'line', d: [[398, 132], [341, 150]], mui: true, mau: '#333' },
              { t: 'text', x: 404, y: 112, s: 'the outer circle of the wheel:', co: 11, nghieng: true },
              { t: 'o', n: 2, x: 440, y: 134 },
              // Nhãn 3 — cáp
              { t: 'line', d: [[398, 210], [292, 194]], mui: true, mau: '#333' },
              { t: 'text', x: 404, y: 216, s: 'steel', co: 12 },
              { t: 'o', n: 3, x: 476, y: 212 },
              { t: 'text', x: 404, y: 240, s: 'from the hub to the outer circle', co: 11, nghieng: true },
              // Nhãn 4 — khung chữ A
              { t: 'line', d: [[92, 268], [176, 268]], mui: true, mau: '#333' },
              { t: 'text', x: 8, y: 248, s: 'A-shaped', co: 12 },
              { t: 'o', n: 4, x: 44, y: 270 },
              { t: 'text', x: 8, y: 298, s: '(one side only)', co: 11, nghieng: true },
            ],
          },
        },
        {
          id: 'p1-sentence', tu: 5, den: 7, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nChoose **ONE WORD AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 1, so: true },
          dong: [
            'The parts of the wheel were transported along the river on [[5]].',
            'During the lift, the wheel was held at an angle of 65 degrees for a [[6]].',
            'A single capsule can carry a maximum of [[7]] passengers.',
          ],
        },
        {
          id: 'p1-tfng', tu: 8, den: 13, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 8, s: 'The design by Marks and Barfield won first prize in the 1993 competition.' },
            { n: 9, s: 'Marks and Barfield put their own home at risk to continue with the project.' },
            { n: 10, s: 'The British government paid most of the cost of building the wheel.' },
            { n: 11, s: 'Members of the public rode on the wheel on the night of 31 December 1999.' },
            { n: 12, s: 'Most passengers on the London Eye are visitors from other countries.' },
            { n: 13, s: 'The London Eye is no longer the tallest observation wheel in the world.' },
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — thể thao ════════════════ */
    {
      so: 2,
      tieuDe: 'The Long Road of the Marathon',
      phuDe: 'How a legend from ancient Greece became a race for everyone',
      gioiThieu: 'You should spend about 20 minutes on **Questions 14–26**, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: `Every year, more than 800 marathons are held around the world, and huge numbers of ordinary people run a distance that was once thought to be dangerous even for trained athletes. The race is named after a place in Greece, and its story begins – if the legend is true – with a single runner. In 490 BC, the army of Athens defeated a Persian army near the village of Marathon. According to the legend, a messenger ran all the way to Athens with the news. He cried, "We have won!" and then fell down dead.` },
        { nhan: 'B', s: `For more than two thousand years, nobody thought of turning this story into a sport. Then, in the 1890s, plans were made for the first modern Olympic Games, which were held in Athens in 1896. A French professor, Michel Bréal, suggested a race from Marathon to the Olympic stadium, a distance of about 40 kilometres, and he offered a silver cup to the winner. Seventeen runners started. The Greek public badly wanted a Greek to win, and they were not disappointed. The race was won by Spyridon Louis, a young man who earned his living by carrying water. When he entered the stadium, two Greek princes ran beside him to the finishing line. He finished in just under three hours and became a national hero.` },
        { nhan: 'C', s: `The first Olympic marathons were all about 40 kilometres long, but the exact distance changed from one Games to the next. Conditions could be terrible: at the Games of 1904 in St Louis, the runners had to compete on dusty roads in great heat, and fewer than half of them finished. The length that runners know today – 42.195 kilometres – comes from the London Olympics of 1908. The organisers planned a route of 26 miles from Windsor Castle to the stadium. They then added part of a lap of the track, 385 yards, so that the race would end in front of the seats of the royal family. In 1921, this strange figure was fixed as the official distance for all marathons.` },
        { nhan: 'D', s: `For most of the twentieth century, the marathon was for men only. Officials claimed that women's bodies were too weak for such a long race. Women runners knew better. In 1966, an American, Bobbi Gibb, waited behind a bush near the start of the famous Boston Marathon, joined the runners and finished ahead of most of the men. The next year, Kathrine Switzer entered the same race. On the entry form she wrote only her initials, "K. V. Switzer", so the organisers did not realise that she was a woman, and she was given an official number. During the race, an angry official ran after her and tried to pull the number off her shirt, but she got away and reached the finish. Photographs of the moment appeared in newspapers around the world.` },
        { nhan: 'E', s: `Change came slowly. The Boston Marathon officially accepted women in 1972, and other big races followed. Women soon showed what they could do: between the middle of the 1960s and the early 1980s, the fastest time for a woman fell from more than three hours to less than two and a half. It was not until 1984, in Los Angeles, that women were able to run a marathon at the Olympic Games. The winner, Joan Benoit of the United States, finished in 2 hours 24 minutes. Although her race was longer than the one in 1896, she was more than half an hour faster than Spyridon Louis.` },
        { nhan: 'F', s: `Meanwhile, the marathon had left the world of top athletes behind. In the 1970s, a "running boom" began in the United States, and city marathons opened their streets to anyone who wanted to try. The New York City Marathon, for example, began in 1970 with only 127 runners, who ran several times around a park; today, more than 50,000 people finish it. The biggest races, such as those in New York, London and Berlin, each attract tens of thousands of runners, and many of them collect money for charity. At the front, the athletes keep getting faster. In October 2019, in Vienna, the Kenyan runner Eliud Kipchoge ran the distance in 1 hour 59 minutes and 40 seconds. It was the first time that anyone had run a marathon in under two hours. However, it was not accepted as an official world record, because he ran in a special event without other competitors and was helped by teams of pacemakers, who took turns to run in front of him. Most runners, of course, are not thinking about records. For them, as for the messenger of the legend, the aim is simply to reach the end.` },
      ],
      nhom: [
        {
          id: 'p2-info', tu: 14, den: 19, dang: 'match-info',
          huongDan: 'Reading Passage 2 has six paragraphs, **A–F**.\nWhich paragraph contains the following information?\nWrite the correct letter, **A–F**.',
          hop: { ds: 'ABCDEF'.split('').map((k) => ({ k, t: `Paragraph ${k}` })) },
          cau: [
            { n: 14, s: 'an explanation of why a fast time was not officially recognised' },
            { n: 15, s: 'a mention of a prize that was offered by one person' },
            { n: 16, s: 'an account of an event that may not really have happened' },
            { n: 17, s: 'a description of how a runner avoided being recognised as a woman' },
            { n: 18, s: 'the reason why a race was made a little longer' },
            { n: 19, s: 'a comparison between the times of two Olympic winners' },
          ],
        },
        {
          id: 'p2-summary', tu: 20, den: 22, dang: 'summary',
          huongDan: 'Complete the summary below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'The first Olympic marathon',
          dong: [
            'The idea of a race from Marathon to Athens came from a French [[20]], who also provided a prize. Seventeen runners took part in 1896. The winner, Spyridon Louis, was a young Greek whose job was carrying [[21]]. After his victory, the whole country thought of him as a [[22]].',
          ],
        },
        {
          id: 'p2-short', tu: 23, den: 26, dang: 'short',
          huongDan: 'Answer the questions below.\nChoose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 2, so: true },
          dong: [
            'Where did the 1908 Olympic marathon start? [[23]]',
            'In which year did 42.195 kilometres become the official distance? [[24]]',
            'What did an official try to remove from Kathrine Switzer\'s shirt? [[25]]',
            'In which city did Eliud Kipchoge run the marathon distance in under two hours? [[26]]',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — truyền thông (bài nêu quan điểm) ════════════════ */
    {
      so: 3,
      tieuDe: 'Why Slow News Matters',
      phuDe: 'A journalist argues that getting the news faster has not made us wiser',
      gioiThieu: 'You should spend about 20 minutes on **Questions 27–40**, which are based on Reading Passage 3 below.',
      doan: [
        { s: `A hundred years ago, news arrived once a day, when the morning newspaper landed on the doorstep. Fifty years ago, most families also watched the evening news on television. People had time to think about what they had read or heard before the next news arrived. Today, news never stops. It reaches us through our phones at every hour of the day and night, often before reporters have had time to check what really happened. Many people believe that this makes us the best-informed generation in history. I think they are mistaken.` },
        { s: `It is true that we see more news than ever before. But seeing is not the same as understanding. In my view, a person who reads twenty short headlines on a phone often knows less at the end of the day than someone who has read one long article carefully. A headline tells us that something has happened. It rarely tells us why it happened, or what is likely to happen next. Yet surveys suggest that most of us now read little more than the headline before we move on to the next story. The same is true of the short videos that many young people now use as their main source of news: they are easy to watch, but thirty seconds is not long enough to explain a war or an election.` },
        { s: `The speed of modern news creates a second problem: mistakes. When a big story breaks, every news website wants to be first, and being first has become more important than being right. Early reports of an accident or a storm are frequently wrong about the most basic facts, such as the number of people who were hurt. The mistakes are usually corrected a few hours later. Unfortunately, by then the first version has been shared thousands of times, and few people ever see the correction. I have seen this happen many times in my own work as a journalist.` },
        { s: `News companies are not entirely to blame for this situation. Journalists are not bad people; the problem is the way in which the business now works. Most of them no longer earn much money from selling newspapers. Instead, they depend on advertising, and advertisers pay according to the number of people who click on a story. As a result, editors choose the stories that will attract the most clicks, and these are usually stories that make readers angry or afraid. Good news, and slow changes that take years, receive very little attention. Readers are therefore left with the feeling that the world is more dangerous than it actually is.` },
        { s: `There is also a cost to our health. A psychologist whom I interviewed for this article, Dr Hannah Reeve, asked two hundred adults to switch off all the news alerts on their phones for one month. They were still allowed to read or watch the news once a day, at a time that they chose. At the end of the month, most of them reported that they felt calmer and slept better. More surprisingly, when they were given a short test on recent events, they did just as well as people who had kept their alerts on. In other words, the alerts had been adding stress without adding knowledge. Dr Reeve told me that she had expected the opposite result.` },
        { s: `Some journalists have reacted to these problems by starting what they call "slow news". Instead of publishing hundreds of stories a day, a slow-news organisation may publish only three or four. Its reporters wait until the facts are clear, and then explain the background in detail. One magazine in Britain even prints its stories three months after the events have happened. Such organisations are usually paid for by their readers rather than by advertisers, so they do not need to chase clicks. So far, their audiences are small, and I doubt that slow news will ever replace the fast kind. People will always want to know immediately when something important happens.` },
        { s: `Nevertheless, I believe that we can all learn something from the idea. We do not have to give up our phones. We can, however, decide when we read the news, instead of letting the news decide for us. We can choose one or two sources that we trust and ignore the rest. And when a dramatic story appears, we can wait a day before we share it. None of this is difficult, and none of it costs anything. Schools could help too, by teaching children how to judge whether a news story can be trusted. The news will go on getting faster. That does not mean that we have to.` },
      ],
      nhom: [
        {
          id: 'p3-ynng', tu: 27, den: 32, dang: 'ynng',
          huongDan: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nChoose\n**YES** if the statement agrees with the claims of the writer\n**NO** if the statement contradicts the claims of the writer\n**NOT GIVEN** if it is impossible to say what the writer thinks about this',
          cau: [
            { n: 27, s: 'People today are better informed than any earlier generation.' },
            { n: 28, s: 'Reading one long article can teach a person more than reading many headlines.' },
            { n: 29, s: 'Television news is more reliable than news on websites.' },
            { n: 30, s: 'News companies are fully responsible for the present situation.' },
            { n: 31, s: 'Slow news is unlikely to take the place of fast news.' },
            { n: 32, s: 'Governments should punish websites that publish false stories.' },
          ],
        },
        {
          id: 'p3-ending', tu: 33, den: 36, dang: 'match-ending',
          huongDan: 'Complete each sentence with the correct ending, **A–F**, below.',
          hop: {
            ds: [
              { k: 'A', t: 'are paid for mainly by their readers.' },
              { k: 'B', t: 'prefer stories that make people angry or afraid.' },
              { k: 'C', t: 'knew as much about recent events as other people.' },
              { k: 'D', t: 'often get basic facts wrong.' },
              { k: 'E', t: 'stopped following the news completely.' },
              { k: 'F', t: 'already attract more readers than fast news.' },
            ],
          },
          cau: [
            { n: 33, s: 'The first news reports published after an accident or a storm' },
            { n: 34, s: 'Editors who depend on money from advertising' },
            { n: 35, s: 'The people in Dr Reeve\'s study who turned off their news alerts' },
            { n: 36, s: 'Slow-news organisations' },
          ],
        },
        {
          id: 'p3-mcq', tu: 37, den: 40, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            {
              n: 37, s: 'What does the writer say about the corrections to early news reports?',
              chon: [
                { k: 'A', t: 'They are published several days later.' },
                { k: 'B', t: 'Not many people notice them.' },
                { k: 'C', t: 'They often contain new mistakes.' },
                { k: 'D', t: 'News websites refuse to publish them.' },
              ],
            },
            {
              n: 38, s: 'According to the writer, what effect do stories chosen for clicks have on readers?',
              chon: [
                { k: 'A', t: 'They lose interest in the news.' },
                { k: 'B', t: 'They stop trusting advertisers.' },
                { k: 'C', t: 'They want to read more good news.' },
                { k: 'D', t: 'They think the world is less safe than it really is.' },
              ],
            },
            {
              n: 39, s: 'During Dr Reeve\'s study, the participants',
              chon: [
                { k: 'A', t: 'could still follow the news once a day.' },
                { k: 'B', t: 'were not allowed to use their phones.' },
                { k: 'C', t: 'had to read a newspaper every morning.' },
                { k: 'D', t: 'were tested on the news every week.' },
              ],
            },
            {
              n: 40, s: 'What is the writer\'s main message in the final paragraph?',
              chon: [
                { k: 'A', t: 'People should stop reading the news on their phones.' },
                { k: 'B', t: 'Slow news will soon become more popular than fast news.' },
                { k: 'C', t: 'Readers should take control of how they receive the news.' },
                { k: 'D', t: 'Dramatic stories should never be shared.' },
              ],
            },
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['capsules', 'capsule'], vi: `"The passengers ride in 32 glass capsules." — nhãn ghi "glass ___ for passengers (32 in total)" ⇒ **capsules** (khoang kính). Bẫy: "cabins" là buồng của các vòng quay ĐỜI CŨ ("On older wheels, the cabins hang inside…"), không phải của London Eye. 📘 Ôn Diagram label completion: Tập 2 Ngày 22 — tìm đoạn MÔ TẢ cấu tạo (đoạn 3), đối chiếu từng nhãn với lời tả.`, ev: `The passengers ride in 32 glass capsules.` },
    2: { a: ['rim'], vi: `"Steel cables run from the hub to the rim, the outer circle of the wheel" — bài tự giải thích "rim" = "the outer circle of the wheel", đúng lời ghi trên sơ đồ ⇒ **rim** (vành). Cách bài định nghĩa một từ khó ngay sau dấu phẩy là manh mối rất hay gặp.`, ev: `the rim, the outer circle of the wheel` },
    3: { a: ['cables'], vi: `"Steel cables run from the hub to the rim" — nhãn: "steel ___ from the hub to the outer circle" ⇒ **cables** (dây cáp). Bẫy: "wires" chỉ là hình ảnh SO SÁNH với bánh xe đạp ("just like the thin wires in a bicycle wheel"), không phải bộ phận của London Eye.`, ev: `Steel cables run from the hub to the rim` },
    4: { a: ['frame'], vi: `"The London Eye, which is 120 metres across, is supported on one side only, by a huge A-shaped frame that leans towards the water." — nhãn: "A-shaped ___ (one side only)" ⇒ **frame** (khung).`, ev: `by a huge A-shaped frame that leans towards the water` },
    5: { a: ['boats'], vi: `"The parts of the wheel were carried up the Thames on boats" — "transported along the river" = "carried up the Thames" ⇒ **boats**. Bẫy: "platforms" là nơi LẮP RÁP (put together… on platforms), không phải phương tiện chở. 📘 Ôn Sentence completion: Tập 1 Ngày 4, Tập 2 Ngày 14.`, ev: `The parts of the wheel were carried up the Thames on boats and put together lying flat, on platforms in the river.` },
    6: { a: ['week'], vi: `"until it reached an angle of 65 degrees. It stayed in that position for a week" — "was held at an angle of 65 degrees" = "stayed in that position" ⇒ **week**. Bẫy: "hour" thuộc cụm "two degrees an hour" (TỐC ĐỘ nâng), không phải thời gian giữ.`, ev: `It stayed in that position for a week while engineers prepared the second stage of the lift.` },
    7: { a: ['25'], vi: `"Each capsule holds up to 25 people" — "a maximum of" = "up to" ⇒ **25**. Bẫy số: 32 là số khoang; 33 là số đánh cao nhất; 13 là số bị bỏ.`, ev: `Each capsule holds up to 25 people, who are free to walk around inside.` },
    8: { a: ['FALSE'], vi: `"The judges, however, were not satisfied with any of the designs, and no winner was chosen." — cuộc thi KHÔNG có ai thắng ⇒ câu nói "won first prize" trái với bài ⇒ **FALSE**. 📘 Ôn TFNG: Tập 2 Ngày 6.`, ev: `The judges, however, were not satisfied with any of the designs, and no winner was chosen.` },
    9: { a: ['TRUE'], vi: `"Marks and Barfield refused to give up… they borrowed money against their own home" — vay tiền bằng cách thế chấp chính ngôi nhà mình = "put their own home at risk"; "continue with the project" = "refused to give up" ⇒ **TRUE**. (Dữ kiện thật: hai vợ chồng thế chấp lại nhà — Wikipedia "London Eye".)`, ev: `They believed in their wheel so strongly that they borrowed money against their own home` },
    10: { a: ['NOT GIVEN'], vi: `Bài chỉ nói hai kiến trúc sư vay tiền bằng nhà mình và "spent the next few years looking for investors" — KHÔNG nói tiền cuối cùng đến từ đâu (chính phủ, công ty hay ngân hàng) ⇒ **NOT GIVEN**. Chi tiết Thủ tướng đến khai trương không cho biết ai trả tiền — đừng suy diễn.`, ev: `they spent the next few years looking for investors and for a place to put it` },
    11: { a: ['FALSE'], vi: `"The Prime Minister officially opened the London Eye on 31 December 1999, but there were no passengers that night." — đêm đó KHÔNG có hành khách; công chúng phải chờ đến tháng 3/2000 ⇒ **FALSE**.`, ev: `but there were no passengers that night` },
    12: { a: ['NOT GIVEN'], vi: `Bài nói mỗi năm hơn ba triệu người đến và vòng quay xuất hiện trong ảnh du lịch, nhưng KHÔNG có số liệu nào về việc khách đến từ nước ngoài hay trong nước ⇒ **NOT GIVEN**. Bẫy: nghe "hợp lý" không có nghĩa là bài có viết.`, ev: `Every year, more than three million people queue on the south bank of the River Thames to take a slow ride into the sky.` },
    13: { a: ['TRUE'], vi: `"When it opened, the London Eye was the tallest observation wheel in the world. It lost that title in 2006 to a wheel in China, and taller ones have been built since." — "is no longer the tallest" = "lost that title" ⇒ **TRUE**.`, ev: `It lost that title in 2006 to a wheel in China, and taller ones have been built since.` },

    /* ── Passage 2 ── */
    14: { a: ['F'], vi: `Đoạn F: thành tích 1:59:40 của Kipchoge "was not accepted as an official world record, because he ran in a special event without other competitors and was helped by teams of pacemakers" — có chữ "because" ⇒ đây là LỜI GIẢI THÍCH ⇒ **F**. 📘 Ôn Matching information: Tập 2 Ngày 16 — câu hỏi KHÔNG theo thứ tự bài; gạch loại thông tin cần tìm (an explanation / a mention / a comparison…).`, ev: `However, it was not accepted as an official world record, because he ran in a special event without other competitors` },
    15: { a: ['B'], vi: `Đoạn B: Michel Bréal "offered a silver cup to the winner" — "a prize… offered by one person" = chiếc cúp bạc do một mình ông tặng ⇒ **B**.`, ev: `he offered a silver cup to the winner` },
    16: { a: ['A'], vi: `Đoạn A: "its story begins – if the legend is true – with a single runner" và "According to the legend, a messenger ran all the way to Athens" — "may not really have happened" = "if the legend is true" ⇒ **A**. Bẫy: đoạn F cũng nhắc "the messenger of the legend" nhưng chỉ nhắc lại, không KỂ sự việc.`, ev: `its story begins – if the legend is true – with a single runner` },
    17: { a: ['D'], vi: `Đoạn D: Switzer "wrote only her initials, "K. V. Switzer", so the organisers did not realise that she was a woman" — "avoided being recognised as a woman" ⇒ **D**. (Bobbi Gibb ở cùng đoạn thì nấp sau bụi cây — cũng là đoạn D.)`, ev: `so the organisers did not realise that she was a woman` },
    18: { a: ['C'], vi: `Đoạn C: ban tổ chức thêm 385 yard "so that the race would end in front of the seats of the royal family" — "so that…" nêu LÝ DO cuộc đua dài thêm một chút ⇒ **C**.`, ev: `so that the race would end in front of the seats of the royal family` },
    19: { a: ['E'], vi: `Đoạn E: Joan Benoit (vô địch Olympic 1984) "was more than half an hour faster than Spyridon Louis" (vô địch Olympic 1896) — so sánh thời gian của HAI nhà vô địch ⇒ **E**. Bẫy: đoạn B có thời gian của Louis nhưng không so với ai.`, ev: `she was more than half an hour faster than Spyridon Louis` },
    20: { a: ['professor'], vi: `"A French professor, Michel Bréal, suggested a race from Marathon to the Olympic stadium… and he offered a silver cup" — "The idea… came from" = "suggested" ⇒ **professor**. 📘 Ôn Summary completion (từ trong bài): Tập 2 Ngày 2.`, ev: `A French professor, Michel Bréal, suggested a race from Marathon to the Olympic stadium` },
    21: { a: ['water'], vi: `"a young man who earned his living by carrying water" — "whose job was" = "earned his living by" ⇒ **water**.`, ev: `a young man who earned his living by carrying water` },
    22: { a: ['hero'], vi: `"He finished in just under three hours and became a national hero." — "the whole country thought of him as" = "became a national" ⇒ **hero**. Ô trống đứng sau "a" nên cần danh từ số ít; "national" là tính từ, không điền được.`, ev: `He finished in just under three hours and became a national hero.` },
    23: { a: ['Windsor Castle'], vi: `"The organisers planned a route of 26 miles from Windsor Castle to the stadium." ⇒ **Windsor Castle** (2 từ — đúng giới hạn). Bẫy: "the stadium" là nơi KẾT THÚC. 📘 Ôn Short answer: Tập 2 Ngày 8.`, ev: `The organisers planned a route of 26 miles from Windsor Castle to the stadium.` },
    24: { a: ['1921'], vi: `"In 1921, this strange figure was fixed as the official distance for all marathons." ⇒ **1921**. Bẫy: 1908 là năm con số này XUẤT HIỆN lần đầu, chưa phải năm nó thành chuẩn chính thức.`, ev: `In 1921, this strange figure was fixed as the official distance for all marathons.` },
    25: { a: ['the number', 'number', 'her number', 'official number'], vi: `"an angry official ran after her and tried to pull the number off her shirt" — "remove from" = "pull… off" ⇒ **(the) number** (số báo danh). Nhận cả "official number" (2 từ, cũng có trong bài: "she was given an official number").`, ev: `tried to pull the number off her shirt` },
    26: { a: ['Vienna'], vi: `"In October 2019, in Vienna, the Kenyan runner Eliud Kipchoge ran the distance in 1 hour 59 minutes and 40 seconds." ⇒ **Vienna**. Bẫy: New York, London, Berlin là ví dụ về các giải đông người nhất, không liên quan đến Kipchoge.`, ev: `In October 2019, in Vienna, the Kenyan runner Eliud Kipchoge ran the distance in 1 hour 59 minutes and 40 seconds.` },

    /* ── Passage 3 ── */
    27: { a: ['NO'], vi: `"Many people believe that this makes us the best-informed generation in history. I think they are mistaken." — đó là điều NHIỀU NGƯỜI tin; tác giả nói thẳng họ SAI ⇒ câu hỏi trái với quan điểm tác giả ⇒ **NO**. 📘 Ôn Yes/No/Not Given: Tập 2 Ngày 20 — phân biệt ý của "many people" với ý của NGƯỜI VIẾT (I think / In my view / I believe / I doubt).`, ev: `I think they are mistaken.` },
    28: { a: ['YES'], vi: `"In my view, a person who reads twenty short headlines on a phone often knows less at the end of the day than someone who has read one long article carefully." — người đọc MỘT bài dài biết nhiều hơn người đọc nhiều tiêu đề ⇒ khớp ⇒ **YES**.`, ev: `In my view, a person who reads twenty short headlines on a phone often knows less at the end of the day than someone who has read one long article carefully.` },
    29: { a: ['NOT GIVEN'], vi: `Tác giả nhắc bản tin tối trên tivi (50 năm trước) và nói các trang tin hay sai vì muốn nhanh — nhưng KHÔNG hề so sánh độ tin cậy của tivi với trang web ⇒ **NOT GIVEN**. Đừng chọn YES chỉ vì tác giả chê trang web: chê A không có nghĩa là khen B.`, ev: `When a big story breaks, every news website wants to be first, and being first has become more important than being right.` },
    30: { a: ['NO'], vi: `"News companies are not entirely to blame for this situation." — "not entirely to blame" = KHÔNG hoàn toàn có lỗi; câu hỏi nói "fully responsible" (chịu TOÀN BỘ trách nhiệm) ⇒ trái ngược ⇒ **NO**. Chú ý từ chỉ mức độ: entirely / fully.`, ev: `News companies are not entirely to blame for this situation.` },
    31: { a: ['YES'], vi: `"I doubt that slow news will ever replace the fast kind." — "I doubt that… will ever replace" = tôi không tin là sẽ thay thế được = "is unlikely to take the place of" ⇒ **YES**. Bẫy: thấy "doubt" (nghi ngờ) dễ chọn NO — nhưng câu hỏi ĐÃ mang nghĩa phủ định ("unlikely"), nên hai bên khớp nhau.`, ev: `I doubt that slow news will ever replace the fast kind.` },
    32: { a: ['NOT GIVEN'], vi: `Cả bài không nhắc đến chính phủ hay việc xử phạt. Các đề xuất của tác giả chỉ dành cho NGƯỜI ĐỌC (chọn giờ đọc tin, chọn nguồn, chờ một ngày rồi mới chia sẻ) và cho NHÀ TRƯỜNG (dạy cách đánh giá tin) ⇒ không biết tác giả nghĩ gì về việc phạt ⇒ **NOT GIVEN**.`, ev: `We can choose one or two sources that we trust and ignore the rest.` },
    33: { a: ['D'], vi: `"Early reports of an accident or a storm are frequently wrong about the most basic facts" (vì "every news website wants to be first") — "often get basic facts wrong" = "frequently wrong about the most basic facts" ⇒ **D**. Các đuôi khác không hợp NGHĨA với "những bản tin đầu tiên": bản tin không "prefer stories" (B), không "được độc giả trả tiền" (A), không "đã theo kịp tin tức" (C, E), và bản tin đầu chính là tin NHANH nên F vô nghĩa. 📘 Ôn Matching sentence endings: Tập 2 Ngày 18 — các NỬA ĐẦU đi theo thứ tự bài; tìm chỗ của nửa đầu trước, rồi chọn đuôi đúng Ý (không chỉ đúng ngữ pháp).`, ev: `Early reports of an accident or a storm are frequently wrong about the most basic facts, such as the number of people who were hurt.` },
    34: { a: ['B'], vi: `"they depend on advertising… As a result, editors choose the stories that will attract the most clicks, and these are usually stories that make readers angry or afraid." ⇒ **B**. Bẫy D ("often get basic facts wrong"): bài nói BẢN TIN ĐẦU hay sai, không nói biên tập viên làm sai; câu hỏi gắn "depend on money from advertising" ⇒ đoạn 4 ⇒ chọn đuôi nói về việc CHỌN tin.`, ev: `editors choose the stories that will attract the most clicks, and these are usually stories that make readers angry or afraid` },
    35: { a: ['C'], vi: `"when they were given a short test on recent events, they did just as well as people who had kept their alerts on" — "knew as much… as other people" = "did just as well as" ⇒ **C**. Bẫy E: họ KHÔNG bỏ hẳn tin tức — vẫn được đọc/xem "once a day".`, ev: `they did just as well as people who had kept their alerts on` },
    36: { a: ['A'], vi: `"Such organisations are usually paid for by their readers rather than by advertisers" ⇒ **A**. Bẫy F ("already attract more readers than fast news"): bài nói ngược lại — "So far, their audiences are small, and I doubt that slow news will ever replace the fast kind".`, ev: `Such organisations are usually paid for by their readers rather than by advertisers, so they do not need to chase clicks.` },
    37: { a: ['B'], vi: `"by then the first version has been shared thousands of times, and few people ever see the correction" — "not many people notice" = "few people ever see" ⇒ **B**. A sai: lỗi được sửa "a few hours later" (vài GIỜ, không phải vài ngày). C, D không được nhắc. 📘 Ôn MCQ: Tập 2 Ngày 10.`, ev: `few people ever see the correction` },
    38: { a: ['D'], vi: `"Readers are therefore left with the feeling that the world is more dangerous than it actually is." — "less safe than it really is" = "more dangerous than it actually is" (đổi tính từ sang từ trái nghĩa + đảo chiều so sánh) ⇒ **D**. C là bẫy: bài nói tin tốt ÍT được chú ý, không nói người đọc muốn đọc thêm tin tốt.`, ev: `Readers are therefore left with the feeling that the world is more dangerous than it actually is.` },
    39: { a: ['A'], vi: `"They were still allowed to read or watch the news once a day, at a time that they chose." ⇒ **A**. B sai: chỉ tắt THÔNG BÁO tin tức, không cấm dùng điện thoại. D sai: chỉ có MỘT bài kiểm tra ngắn vào cuối tháng.`, ev: `They were still allowed to read or watch the news once a day, at a time that they chose.` },
    40: { a: ['C'], vi: `Đoạn cuối: "We can, however, decide when we read the news, instead of letting the news decide for us." — tự mình quyết định cách nhận tin ⇒ **C**. A sai ("We do not have to give up our phones"); B trái với đoạn trước ("I doubt that slow news will ever replace…"); D quá mức: tác giả chỉ khuyên CHỜ một ngày rồi mới chia sẻ, không phải "never".`, ev: `We can, however, decide when we read the news, instead of letting the news decide for us.` },
  },
};
