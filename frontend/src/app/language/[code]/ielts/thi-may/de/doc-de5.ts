/**
 * Đề 5 — Academic Reading, THI CUỐI TẬP 3 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 3 Ngày 30). TỰ SOẠN 18/11/2026.
 * Mức band 6.0 — khó hơn Đề 4 một bậc: paraphrase mức 3–4 (đổi cấu trúc, ý phải suy ra), nhiều câu bẫy "được nhắc tới nhưng
 * không phải đáp án", từ vựng B2 (forger, abandoned, obstacles, prey, exaggeration, oblige…); Passage 3 là bài LẬP LUẬN trừu
 * tượng (~900 từ) có quan điểm tác giả ở ngôi thứ nhất.
 * Thể loại theo mục 4.2: Kinh tế · Sinh học · Ngôn ngữ. Dạng câu — ưu tiên các dạng nửa sau Tập 3 (N17 Diagram · N19 Matching
 * information 2 · N21 Matching features 2 · N23 YNNG 2 · N25 Summary từ trong bài 2 + Sentence completion) + N3 TFNG · N11 MCQ:
 *   Passage 1 (kinh tế — lịch sử tiền giấy):            TFNG · Sentence completion · Diagram labelling
 *   Passage 2 (sinh học — dơi định vị bằng tiếng vang): Matching information (7 đoạn A–G) · Matching features (6 nhà khoa học) · Summary
 *   Passage 3 (ngôn ngữ — ngôn ngữ có định hình tư duy?): YNNG · MCQ (4 lựa chọn) · Matching sentence endings
 * Cùng Đề 4 (heading, summary-box, mcq2, table, short) hai đề liền nhau phủ 14/16 dạng; KHÔNG trùng đề tài với Đề 0–4, Đề 6.
 * DỮ KIỆN: viết theo kiến thức phổ thông, soạn theo trí nhớ — CHƯA đối chiếu lại nguồn trong phiên này (nên soát trước khi dùng
 * làm tài liệu tham khảo): tiền xu Lydia ~600 TCN (hợp kim vàng–bạc tự nhiên); tiền sắt Tứ Xuyên, biên lai của thương nhân, triều
 * đình nhà Tống tiếp quản năm 1024; Marco Polo tả tiền giấy vỏ dâu của Hốt Tất Liệt; Trung Quốc bỏ tiền giấy giữa thế kỷ 15;
 * Thuỵ Điển: tấm đồng gần 20 kg, Johan Palmstruch phát hành giấy bạc 1661, ngân hàng sụp, ông bị tù; Mỹ
 * bỏ đổi đô-la ra vàng năm 1971 (đã soát 18/11: câu 6 cũ "Palmstruch ở tù tới chết" bị thay — sử sách ghi ông được thả năm 1670, chết 1671, nên câu NOT GIVEN ấy dễ làm người biết sử chọn FALSE); Úc phát hành tiền nhựa đầu tiên năm 1988; Thuỵ Điển nay ít dùng tiền mặt. Dơi: Spallanzani
 * (thập niên 1790, cú và dơi, dơi mù vẫn bắt mồi), Charles Jurine (bịt tai bằng sáp), Cuvier (xúc giác, không làm thí nghiệm),
 * Hiram Maxim 1912 (sau vụ Titanic, âm quá THẤP), Hamilton Hartridge 1920 (âm quá CAO), Donald Griffin + Robert Galambos 1938
 * với máy của G. W. Pierce ở Harvard, tên gọi "echolocation", chuyện một nhà khoa học nắm vai Galambos mà lắc; ~10 tiếng/giây
 * khi tìm mồi → tới 200 tiếng/giây lúc bắt; cơ tai giữa co lại; bướm đêm có tai, bướm hổ phát tiếng lách cách; gậy siêu âm cho
 * người mù. Ngôn ngữ: Whorf (thanh tra bảo hiểm cháy nổ, tiếng Hopi, thập niên 1930), Ekkehart Malotki 1983, tiếng Guugu
 * Yimithirr dùng phương hướng la bàn, thí nghiệm màu xanh tiếng Nga công bố 2007 (lợi thế mất khi phải nhẩm số), ý của Roman
 * Jakobson (diễn đạt lại, không trích nguyên văn). Passage 3 là bài QUAN ĐIỂM tự viết.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE5: DeDoc = {
  id: 'doc-de5',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 5 (thi cuối Tập 3)',
  boDe: 'Đề 5',
  capDo: 'Band 6.0',
  moTa: 'The paper promise (the history of banknotes) · Seeing with sound (how bats find their way) · Words and worlds (does language shape thought?)',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — Kinh tế: lịch sử tiền giấy ════════════════ */
    {
      so: 1,
      tieuDe: 'The Paper Promise',
      phuDe: 'How a piece of paper came to be worth more than the material it is printed on',
      gioiThieu: 'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      doan: [
        { s: `For most of history, money was something that had value in itself. In many parts of Africa and Asia, people paid for goods with cowrie shells. The first coins, which were produced in the kingdom of Lydia, in what is now Turkey, in about 600 BC, were small lumps of a natural mixture of gold and silver. A coin was worth exactly what the metal in it was worth. The idea that a piece of paper, which costs almost nothing to make, could be exchanged for a horse or a house would have seemed ridiculous.` },
        { s: `The idea was born in China, and it began as the answer to a practical problem. Around the year 1000, the coins used in the province of Sichuan were made of iron, and they were so heavy that a merchant making a large purchase needed a cart to carry his money. Merchants therefore began to leave their coins with shopkeepers whom they trusted, and the shopkeepers gave them a paper receipt in return. Before long, the receipts themselves were being passed from hand to hand as payment, since everybody knew that they could be turned back into coins. In 1024, the government took control of the system and started to print notes of its own. These were the first official banknotes in the world.` },
        { s: `When the Italian traveller Marco Polo reached China in the thirteenth century, paper money amazed him. He described how the ruler, Kublai Khan, had notes made from the bark of mulberry trees, each one marked with a red seal, and how people all over the empire accepted them as if they were pure gold. But the system had a weakness. Paper is cheap, and a government that is short of money can simply print more. Later rulers could not resist doing so. As the number of notes rose, each one bought less, and by the middle of the fifteenth century the Chinese had lost confidence in paper money so completely that it was given up. Silver took its place.` },
        { s: `Europe came to paper money late, and for much the same reason as Sichuan. In seventeenth-century Sweden, coins were made of copper, and the largest of them was a plate that weighed almost twenty kilograms. In 1661, a banker in Stockholm called Johan Palmstruch began to issue paper notes that could be exchanged for metal at his bank. They were the first banknotes in Europe, and they were an immediate success. Unfortunately, Palmstruch then repeated the mistake of the Chinese rulers: he issued more notes than he had metal to pay for. When large numbers of customers asked for their coins, the bank failed, and Palmstruch was sent to prison.` },
        { s: `For the next three centuries, most paper money remained a promise of this kind: in theory, the owner of a note could exchange it for a fixed amount of gold or silver. That link was finally cut in 1971, when the United States announced that its dollars could no longer be exchanged for gold. Since then, a banknote has been worth something only because everybody agrees that it is.` },
        { s: `Because a note is only as good as people's trust in it, the greatest enemy of paper money is the forger, and modern notes are designed to be as hard to copy as possible. Hold a typical note up to the light, and a second, paler face appears in the empty space beside the main portrait. This is the watermark, which is formed in the paper while it is being made and cannot be printed on afterwards. A thin metal thread, which is woven into the paper, runs from the top edge of the note to the bottom. In one corner there is a shiny patch known as a hologram, on which the picture changes when the note is tilted. Finally, the large numbers that show the value of the note are printed in a thick, raised ink that can be felt with a fingertip.` },
        { s: `The latest development is to give up paper itself. In 1988, Australia became the first country to issue a note made of plastic. Plastic notes last far longer than paper ones and can include a transparent window that is extremely difficult to forge. Many other countries have since followed Australia's example. Whether notes of any kind have a long future is less certain. In Sweden, most payments are now made by card or by phone, and cash is used for only a small share of purchases. It would be a neat ending to the story if the country that gave Europe its first banknotes were also the first to stop using them.` },
      ],
      nhom: [
        {
          id: 'p1-tfng', tu: 1, den: 6, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 1, s: 'The earliest coins were made of pure gold.' },
            { n: 2, s: 'In Sichuan, paper receipts were being used as money before the government printed any notes.' },
            { n: 3, s: 'Marco Polo took examples of Chinese paper money home with him.' },
            { n: 4, s: 'China stopped using paper money after its notes had fallen in value.' },
            { n: 5, s: 'People were unwilling to use Palmstruch\'s notes when they first appeared.' },
            { n: 6, s: 'Palmstruch\'s notes were more popular in Stockholm than in other parts of Sweden.' },
          ],
        },
        {
          id: 'p1-sentence', tu: 7, den: 9, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nChoose **ONE WORD AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 1, so: true },
          dong: [
            'The heaviest coin in seventeenth-century Sweden was a plate made of [[7]].',
            'The connection between banknotes and gold was finally broken in [[8]].',
            'The first country to produce banknotes made of [[9]] was Australia.',
          ],
        },
        {
          id: 'p1-diagram', tu: 10, den: 13, dang: 'diagram',
          huongDan: 'Label the diagram below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'How a modern banknote is protected against forgery',
          hinh: {
            w: 560, h: 330,
            chuThich: 'Sơ đồ một tờ tiền hiện đại điển hình (tự vẽ, không mô phỏng tờ tiền thật nào)',
            ve: [
              // Tờ tiền
              { t: 'rect', x: 70, y: 96, w: 420, h: 160, nen: '#f3f6ee', bo: 1.5 },
              // Chân dung chính
              { t: 'circle', x: 190, y: 170, r: 44, nen: '#c9d6c2' },
              { t: 'text', x: 190, y: 174, s: 'main portrait', co: 10, giua: true, nghieng: true },
              // Hình bóng mờ (watermark)
              { t: 'circle', x: 316, y: 170, r: 34, nen: '#fafbf7' },
              // Sợi kim loại chạy dọc
              { t: 'line', d: [[392, 96], [392, 256]], dut: true, day: 2.5, mau: '#6b6b6b' },
              // Mảng lấp lánh ở góc
              { t: 'rect', x: 436, y: 108, w: 40, h: 32, nen: '#d7e4f5', bo: 1 },
              // Số mệnh giá
              { t: 'text', x: 106, y: 240, s: '50', co: 26, dam: true, giua: true },
              // Nhãn 10 — watermark
              { t: 'line', d: [[316, 70], [316, 134]], mui: true, mau: '#333' },
              { t: 'text', x: 232, y: 22, s: 'paler face, seen when the note is', co: 11, nghieng: true },
              { t: 'text', x: 232, y: 38, s: 'held up to the light:', co: 11, nghieng: true },
              { t: 'o', n: 10, x: 316, y: 56 },
              // Nhãn 11 — thread
              { t: 'line', d: [[392, 284], [392, 258]], mui: true, mau: '#333' },
              { t: 'text', x: 300, y: 304, s: 'metal', co: 12 },
              { t: 'o', n: 11, x: 374, y: 300 },
              { t: 'text', x: 416, y: 304, s: '(top to bottom)', co: 11, nghieng: true },
              // Nhãn 12 — hologram
              { t: 'line', d: [[488, 87], [464, 106]], mui: true, mau: '#333' },
              { t: 'text', x: 430, y: 38, s: 'shiny patch – picture', co: 11, nghieng: true },
              { t: 'text', x: 430, y: 52, s: 'changes when tilted:', co: 11, nghieng: true },
              { t: 'o', n: 12, x: 504, y: 72 },
              // Nhãn 13 — ink
              { t: 'line', d: [[106, 284], [106, 250]], mui: true, mau: '#333' },
              { t: 'text', x: 8, y: 304, s: 'value printed in raised', co: 11, nghieng: true },
              { t: 'o', n: 13, x: 176, y: 300 },
            ],
          },
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — Sinh học: dơi định vị bằng tiếng vang ════════════════ */
    {
      so: 2,
      tieuDe: 'Seeing with Sound',
      phuDe: 'The long search for the secret of how bats find their way in the dark',
      gioiThieu: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: `On a summer evening, a single bat may catch several hundred insects in an hour. It does so in almost total darkness, at high speed, twisting between branches without ever touching one. How bats manage this was a mystery that took scientists about a hundred and fifty years to solve, and the story of the search shows how difficult it is to investigate a sense that human beings do not have.` },
        { nhan: 'B', s: `The first serious experiments were carried out in the 1790s by an Italian priest and scientist, Lazzaro Spallanzani. He had noticed that his pet owl became helpless when its candle went out, and flew into the walls, whereas bats in the same dark room flew perfectly. Curious, Spallanzani covered the eyes of some bats and, in later experiments, blinded them. They avoided obstacles as easily as before. He even released blinded bats outdoors and caught them again several days later: their stomachs were as full of insects as those of normal bats. Whatever was guiding the animals, it was not sight.` },
        { nhan: 'C', s: `A Swiss surgeon, Charles Jurine, read about this work and tried something different. He blocked the ears of his bats with wax, and found that they now crashed into everything in their path. Spallanzani repeated the experiment and got the same result. He was forced towards a conclusion that he himself found hard to accept: bats needed their ears in order to 'see'. Yet the room in which they flew seemed completely silent. What could they be listening to? Neither man could say, and their critics had an easy target. Georges Cuvier, the most respected zoologist in Europe, announced that bats simply felt their way, using a delicate sense of touch in their wings. He had not carried out a single experiment on the subject. All the same, his opinion was accepted, and the findings of Spallanzani and Jurine were forgotten for more than a century.` },
        { nhan: 'D', s: `The idea of sound returned for an unexpected reason. In 1912, after the passenger ship Titanic struck an iceberg and sank, the engineer Hiram Maxim suggested that ships could avoid such accidents by sending out sounds and listening for the echoes that came back from objects ahead. Bats, he added, probably did exactly this, using sounds too low for the human ear to detect. Maxim was right about the echoes and wrong about the pitch. In 1920, an English scientist, Hamilton Hartridge, proposed the opposite: that the sounds were too high for us to hear. Neither man could prove his case, however, because no instrument existed that was able to pick up such sounds.` },
        { nhan: 'E', s: `The proof came in 1938. Donald Griffin, a student at Harvard University, learned that a physics professor there, G. W. Pierce, had built a machine which turned very high sounds into sounds that people could hear. Griffin carried a cage of bats to Pierce's laboratory, and the loudspeaker filled the room with noise. Working with another student, Robert Galambos, he then showed that a bat whose mouth was covered was just as helpless as one whose ears were blocked. The animals were producing the sounds themselves and steering by the echoes. Griffin later gave this ability the name by which it is still known: echolocation. Not everyone was ready for the news. When the two young men first described their results at a scientific meeting, one well-known scientist was so unwilling to believe them that he took Galambos by the shoulders and shook him.` },
        { nhan: 'F', s: `We now know a good deal about how the system works. A hunting bat sends out short bursts of sound at frequencies far above the limit of human hearing. While it is searching, it produces about ten calls a second. Once it has detected an insect, the rate climbs steeply, and in the final moment before the catch there may be 200 calls a second. From the time that each echo takes to return, the bat judges the distance of its prey; from small changes in the pitch of the echo, it can tell how fast the insect is moving. The calls are extremely loud, and a bat would deafen itself if it heard them at full strength. To prevent this, it tightens a tiny muscle in its ear at the instant of each call, and relaxes it again in time to hear the echo.` },
        { nhan: 'G', s: `The insects are not helpless, however. Many moths have developed simple ears that are sensitive to exactly the frequencies that bats use. When such a moth hears a bat approaching, it turns and flies away; when the bat is very close, the moth folds its wings and drops towards the ground. Some tiger moths go further and produce rapid clicks of their own, which appear to confuse the bat as it attacks. Human beings have recently begun to learn from this contest. Engineers have used the same principle to design walking sticks for blind people, which send out high-pitched sounds and warn the user when an echo returns from an object ahead.` },
      ],
      nhom: [
        {
          id: 'p2-info', tu: 14, den: 18, dang: 'match-info',
          huongDan: 'Reading Passage 2 has seven paragraphs, **A–G**.\nWhich paragraph contains the following information?\nWrite the correct letter, **A–G**.',
          hop: { ds: 'ABCDEFG'.split('').map((k) => ({ k, t: `Paragraph ${k}` })) },
          cau: [
            { n: 14, s: 'an explanation of how a bat avoids damaging its own hearing' },
            { n: 15, s: 'a reference to a disaster that led to a new suggestion about bats' },
            { n: 16, s: 'an example of an opinion that was believed although it had never been tested' },
            { n: 17, s: 'a mention of equipment designed for people who are unable to see' },
            { n: 18, s: 'a description of a physical reaction to a piece of scientific news' },
          ],
        },
        {
          id: 'p2-feature', tu: 19, den: 23, dang: 'match-feature',
          huongDan: 'Look at the following statements (Questions 19–23) and the list of people below.\nMatch each statement with the correct person, **A–F**.',
          hop: {
            tieuDe: 'List of People',
            ds: [
              { k: 'A', t: 'Lazzaro Spallanzani' },
              { k: 'B', t: 'Charles Jurine' },
              { k: 'C', t: 'Georges Cuvier' },
              { k: 'D', t: 'Hiram Maxim' },
              { k: 'E', t: 'Hamilton Hartridge' },
              { k: 'F', t: 'Donald Griffin' },
            ],
          },
          cau: [
            { n: 19, s: 'He suggested that bats make sounds which are too high-pitched for people to hear.' },
            { n: 20, s: 'He demonstrated that bats could still find food when they had lost the use of their eyes.' },
            { n: 21, s: 'He claimed that bats find their way by means of their wings.' },
            { n: 22, s: 'He was the first to discover what happened when bats were prevented from hearing.' },
            { n: 23, s: 'He invented the term that is now used for the bats\' ability.' },
          ],
        },
        {
          id: 'p2-summary', tu: 24, den: 26, dang: 'summary',
          huongDan: 'Complete the summary below.\nChoose **ONE WORD AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'How a bat hunts',
          dong: [
            'When a bat is looking for food, it makes roughly ten calls every second, but just before it catches an insect this figure may reach [[24]]. The bat works out the [[25]] of the insect from the length of time that passes before an echo comes back. Because its calls are so loud, the bat protects itself by using a small [[26]] in its ear whenever it calls.',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — Ngôn ngữ: ngôn ngữ có định hình tư duy? ════════════════ */
    {
      so: 3,
      tieuDe: 'Words and Worlds',
      phuDe: 'Does the language we speak decide how we think?',
      gioiThieu: 'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      doan: [
        { s: `Few ideas about language are as attractive as the belief that people who speak differently must also think differently. It appears in magazine articles about the 'untranslatable' words of other cultures, and in the frequently repeated claim that the Inuit peoples of the Arctic have dozens, or even hundreds, of words for snow. Linguists have been pointing out for decades that this claim is a wild exaggeration. It survives, I suspect, not because anyone has checked it but because it tells us something we would like to be true: that every language is a separate world.` },
        { s: `The modern form of the idea is usually traced to Benjamin Lee Whorf, an American who earned his living as an inspector for a fire insurance company and studied languages in his spare time. In the 1930s, Whorf examined Hopi, a language spoken in Arizona, and announced that it contained no words or grammatical forms that referred to time as speakers of English understand it. From this he drew a dramatic conclusion. A Hopi speaker, he argued, did not simply talk about time in a different way but experienced it differently. On this view, a language is a kind of prison: we are able to think only those thoughts for which our mother tongue provides the means.` },
        { s: `It was an exciting theory, and it was wrong. Whorf's knowledge of Hopi came largely from one speaker, who was living in New York. When the linguist Ekkehart Malotki published a detailed study of the language in 1983, he filled hundreds of pages with Hopi expressions for days, seasons, yesterday and tomorrow. More generally, the strong form of the theory fails a simple test. If we could not think anything for which our language lacked a word, we could never learn anything new, and translation would be impossible. Nor would anyone have had the common experience of knowing exactly what they mean and being unable to find the word for it. By the 1970s, most linguists regarded the whole subject as an embarrassment and preferred not to discuss it.` },
        { s: `In my view, that reaction went too far. To say that language is not a prison is not to say that it has no influence at all. From the 1990s onwards, a new generation of researchers began to look for smaller effects, and to test them in experiments instead of simply drawing conclusions from grammar books, as Whorf had done. What they have found is far more modest than Whorf's vision but, unlike his, it rests on evidence.` },
        { s: `Consider space. Speakers of English usually describe the position of things in relation to their own bodies: the cup is to the left of the plate. Speakers of Guugu Yimithirr, an Aboriginal language of northern Australia, use the points of the compass instead. The cup is to the west of the plate, and they will warn you about an ant on your south leg. In order to speak the language at all, they have to know at every moment where north is, whether they are indoors, in the dark or in an unfamiliar place. Tests show that they do know, with an accuracy that outsiders find hard to believe. Nobody suggests that speakers of English are incapable of learning the compass points, or that speakers of Guugu Yimithirr are born with a special gift. The difference is one of habit. A language that requires you to pay attention to something thousands of times a day makes you very good at noticing it.` },
        { s: `Colour provides a second example. Russian has no single word for blue. It treats light blue and dark blue as separate basic colours, as different from each other as green and blue are for a speaker of English. In an experiment published in 2007, volunteers were asked to tell similar shades of blue apart as quickly as they could. The Russian speakers were faster when the two shades fell on opposite sides of their light–dark boundary than when both belonged to the same category; the English speakers showed no such difference. Interestingly, the Russians' advantage disappeared when they had to repeat a string of numbers silently during the task, which kept the language areas of the mind busy. The effect is real, then, but it should be kept in proportion. It amounts to a fraction of a second, and English speakers can see both blues perfectly well.` },
        { s: `What should we conclude? The linguist Roman Jakobson offered what still seems to me the best summary: languages differ less in what they allow their speakers to say than in what they oblige them to say. An English speaker who mentions a neighbour does not have to reveal whether the neighbour is a man or a woman. A speaker of French or German has no choice, because the word itself must be either masculine or feminine. Every language pushes the attention of its speakers towards certain details and lets others pass unnoticed. A language, in other words, is not a prison but a lens. It does not prevent us from seeing anything, but it does encourage us to look in a particular direction.` },
        { s: `This modest conclusion will disappoint those who hoped for separate worlds. It ought to please everybody else. If Whorf had been right, speakers of different languages could never fully understand one another, and learning a foreign language would be almost pointless. Because he was wrong, the opposite is true. Another language cannot give us a new mind, but it can show us what our own language has trained us to ignore. That seems to me a good enough reason to learn one.` },
      ],
      nhom: [
        {
          id: 'p3-ynng', tu: 27, den: 32, dang: 'ynng',
          huongDan: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nChoose\n**YES** if the statement agrees with the claims of the writer\n**NO** if the statement contradicts the claims of the writer\n**NOT GIVEN** if it is impossible to say what the writer thinks about this',
          cau: [
            { n: 27, s: 'The story about Inuit words for snow remains popular because people find it appealing.' },
            { n: 28, s: 'The study of languages was Whorf\'s main occupation.' },
            { n: 29, s: 'Whorf\'s ideas about Hopi were influenced by his work in insurance.' },
            { n: 30, s: 'Malotki\'s research confirmed what Whorf had said about the Hopi language.' },
            { n: 31, s: 'Researchers since the 1990s have used a more reliable method than Whorf did.' },
            { n: 32, s: 'Speakers of Guugu Yimithirr find European languages difficult to learn.' },
          ],
        },
        {
          id: 'p3-mcq', tu: 33, den: 36, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            { n: 33, s: 'The writer mentions the experience of being unable to find the right word in order to show that', chon: [
              { k: 'A', t: 'translation between two languages is never exact.' },
              { k: 'B', t: 'a thought can exist without the words to express it.' },
              { k: 'C', t: 'most people know fewer words than they believe.' },
              { k: 'D', t: 'new ideas are hard to learn in a foreign language.' },
            ] },
            { n: 34, s: 'What point does the writer make about speakers of Guugu Yimithirr?', chon: [
              { k: 'A', t: 'They are born with a sense of direction that other people lack.' },
              { k: 'B', t: 'They have no way of understanding the idea of left and right.' },
              { k: 'C', t: 'They become confused about direction when they are inside buildings.' },
              { k: 'D', t: 'Their skill is the result of the constant practice that their language demands.' },
            ] },
            { n: 35, s: 'What does the writer say about the colour experiment of 2007?', chon: [
              { k: 'A', t: 'The Russian speakers\' advantage depended on their being free to use language in their heads.' },
              { k: 'B', t: 'The English speakers were unable to see any difference between light and dark blue.' },
              { k: 'C', t: 'The Russian speakers were quicker than the English speakers in every part of the test.' },
              { k: 'D', t: 'The size of the effect was greater than the researchers had expected.' },
            ] },
            { n: 36, s: 'What is the writer\'s conclusion in the final paragraph?', chon: [
              { k: 'A', t: 'Whorf\'s central claim deserves more respect than it receives today.' },
              { k: 'B', t: 'People who speak different languages can never completely understand each other.' },
              { k: 'C', t: 'Learning a foreign language makes us aware of things that our own language leads us to overlook.' },
              { k: 'D', t: 'Studying another language completely changes the way a person thinks.' },
            ] },
          ],
        },
        {
          id: 'p3-ending', tu: 37, den: 40, dang: 'match-ending',
          huongDan: 'Complete each sentence with the correct ending, **A–F**, below.',
          hop: {
            ds: [
              { k: 'A', t: 'are forced to give information that speakers of English may leave out.' },
              { k: 'B', t: 'usually explain where things are by referring to their own bodies.' },
              { k: 'C', t: 'had more words for time than speakers of English.' },
              { k: 'D', t: 'did not experience time in the same way as speakers of English.' },
              { k: 'E', t: 'divide into two what English treats as a single colour.' },
              { k: 'F', t: 'find it impossible to learn the points of the compass.' },
            ],
          },
          cau: [
            { n: 37, s: 'Whorf claimed that speakers of Hopi' },
            { n: 38, s: 'Speakers of English' },
            { n: 39, s: 'Speakers of Russian' },
            { n: 40, s: 'Speakers of French or German' },
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['FALSE'], vi: `Bài: những đồng xu đầu tiên "were small lumps of a natural mixture of gold and silver" — hợp kim vàng LẪN bạc, không phải vàng nguyên chất ⇒ **FALSE**. Bẫy: cụm "pure gold" có thật trong bài nhưng nằm ở đoạn 3 (người ta nhận tiền giấy "as if they were pure gold") — thấy từ quen đừng vội chọn TRUE. 📘 Ôn TFNG band 6: Tập 3 Ngày 3.`, ev: `were small lumps of a natural mixture of gold and silver` },
    2: { a: ['TRUE'], vi: `Trình tự trong đoạn 2: chủ tiệm đưa biên lai giấy → "Before long, the receipts themselves were being passed from hand to hand as payment" → MÃI TỚI "In 1024, the government took control of the system and started to print notes of its own". Biên lai được dùng như tiền TRƯỚC khi triều đình in ⇒ **TRUE**. Paraphrase đổi cấu trúc: "used as money" = "passed from hand to hand as payment".`, ev: `Before long, the receipts themselves were being passed from hand to hand as payment, since everybody knew that they could be turned back into coins.` },
    3: { a: ['NOT GIVEN'], vi: `Bài chỉ nói Marco Polo "described" tiền giấy (làm từ vỏ dâu, có dấu đỏ, được nhận như vàng) — KHÔNG có câu nào nói ông mang tiền giấy về Ý hay không ⇒ **NOT GIVEN**. Đừng suy "ông tả kỹ thế chắc có mang về" — đó là suy diễn ngoài bài.`, ev: `He described how the ruler, Kublai Khan, had notes made from the bark of mulberry trees, each one marked with a red seal, and how people all over the empire accepted them as if they were pure gold.` },
    4: { a: ['TRUE'], vi: `"As the number of notes rose, each one bought less (= mất giá), and by the middle of the fifteenth century the Chinese had lost confidence in paper money so completely that it was given up." — "stopped using" = "was given up"; "had fallen in value" = "each one bought less" ⇒ **TRUE**. Paraphrase mức 3–4: không có chữ "value" nào trong câu gốc.`, ev: `As the number of notes rose, each one bought less, and by the middle of the fifteenth century the Chinese had lost confidence in paper money so completely that it was given up.` },
    5: { a: ['FALSE'], vi: `"They were the first banknotes in Europe, and they were an immediate success." — thành công NGAY, tức người ta sẵn lòng dùng ⇒ trái với "unwilling… when they first appeared" ⇒ **FALSE**. Bẫy: ngân hàng sụp đổ là chuyện VỀ SAU ("then repeated the mistake…"), không phải lúc giấy bạc mới ra.`, ev: `They were the first banknotes in Europe, and they were an immediate success.` },
    6: { a: ['NOT GIVEN'], vi: `Bài chỉ nói ngân hàng của Palmstruch ở Stockholm và giấy bạc "were an immediate success" — KHÔNG so sánh Stockholm với nơi nào khác ở Thuỵ Điển ⇒ **NOT GIVEN**. Câu hỏi ghép một chi tiết có thật (Stockholm, giấy bạc được ưa chuộng) với một phép SO SÁNH bài không hề làm — khuôn NOT GIVEN điển hình. Đừng nhầm với câu 5 (FALSE): câu 5 trái với "immediate success", câu 6 thì bài không đủ thông tin.`, ev: `In 1661, a banker in Stockholm called Johan Palmstruch began to issue paper notes that could be exchanged for metal at his bank.` },
    7: { a: ['copper'], vi: `"In seventeenth-century Sweden, coins were made of copper, and the largest of them was a plate that weighed almost twenty kilograms." — "the heaviest coin" = "the largest of them… weighed almost twenty kilograms" ⇒ **copper**. Bẫy: "iron" là tiền của Tứ Xuyên (đoạn 2); "metal" quá chung, không chỉ ra chất liệu. 📘 Ôn Sentence completion: Tập 3 Ngày 9 + 25.`, ev: `In seventeenth-century Sweden, coins were made of copper, and the largest of them was a plate that weighed almost twenty kilograms.` },
    8: { a: ['1971'], vi: `"That link was finally cut in 1971, when the United States announced that its dollars could no longer be exchanged for gold." — "the connection… was finally broken" = "That link was finally cut" ⇒ **1971**. Bẫy năm: 1024 (triều đình Trung Quốc in tiền), 1661 (giấy bạc Thuỵ Điển), 1988 (tiền nhựa).`, ev: `That link was finally cut in 1971, when the United States announced that its dollars could no longer be exchanged for gold.` },
    9: { a: ['plastic'], vi: `"In 1988, Australia became the first country to issue a note made of plastic." — "produce banknotes" = "issue a note" ⇒ **plastic**. Câu hỏi đảo trật tự (chất liệu trước, tên nước sau) nhưng thông tin giữ nguyên.`, ev: `In 1988, Australia became the first country to issue a note made of plastic.` },
    10: { a: ['watermark'], vi: `Nhãn: khuôn mặt nhạt hơn, thấy khi soi tờ tiền lên ánh sáng. Bài: "Hold a typical note up to the light, and a second, paler face appears… This is the watermark" ⇒ **watermark** (viết liền, một từ). Đừng điền "portrait" — đó là hình chính, đã in sẵn trên sơ đồ. 📘 Ôn Diagram labelling: Tập 3 Ngày 17.`, ev: `This is the watermark, which is formed in the paper while it is being made and cannot be printed on afterwards.` },
    11: { a: ['thread'], vi: `Nhãn "metal ___ (top to bottom)". Bài: "A thin metal thread, which is woven into the paper, runs from the top edge of the note to the bottom." ⇒ **thread** (sợi chỉ kim loại). Ô trống đứng sau "metal" ⇒ cần danh từ mà "metal" bổ nghĩa.`, ev: `A thin metal thread, which is woven into the paper, runs from the top edge of the note to the bottom.` },
    12: { a: ['hologram'], vi: `Nhãn: mảng lấp lánh, hình đổi khi nghiêng tờ tiền. Bài: "In one corner there is a shiny patch known as a hologram, on which the picture changes when the note is tilted." ⇒ **hologram**. "known as…" là tín hiệu giới thiệu thuật ngữ — đáp án thường đứng ngay sau.`, ev: `In one corner there is a shiny patch known as a hologram, on which the picture changes when the note is tilted.` },
    13: { a: ['ink'], vi: `Nhãn "value printed in raised ___". Bài: "the large numbers that show the value of the note are printed in a thick, raised ink that can be felt with a fingertip" ⇒ **ink**. Bẫy: "numbers" là thứ ĐƯỢC in (đã có trong nhãn dưới dạng "value"), còn ô trống hỏi in BẰNG gì.`, ev: `Finally, the large numbers that show the value of the note are printed in a thick, raised ink that can be felt with a fingertip.` },

    /* ── Passage 2 ── */
    14: { a: ['F'], vi: `Đoạn F: tiếng kêu rất to, dơi sẽ tự làm điếc mình — "To prevent this, it tightens a tiny muscle in its ear at the instant of each call" = cách dơi tránh làm hỏng thính giác của chính nó ⇒ **F**. Bẫy: đoạn C cũng nói về TAI dơi nhưng là tai bị người bịt sáp. 📘 Ôn Matching information: Tập 3 Ngày 19.`, ev: `To prevent this, it tightens a tiny muscle in its ear at the instant of each call, and relaxes it again in time to hear the echo.` },
    15: { a: ['D'], vi: `Đoạn D: "In 1912, after the passenger ship Titanic struck an iceberg and sank, the engineer Hiram Maxim suggested…" — "a disaster" = vụ đắm tàu Titanic; "a new suggestion about bats" = "Bats, he added, probably did exactly this" ⇒ **D**. Câu hỏi không nhắc tên tàu hay tên người — phải tự nhận ra "disaster".`, ev: `In 1912, after the passenger ship Titanic struck an iceberg and sank, the engineer Hiram Maxim suggested that ships could avoid such accidents by sending out sounds and listening for the echoes that came back from objects ahead.` },
    16: { a: ['C'], vi: `Đoạn C: Cuvier tuyên bố dơi dùng xúc giác; "He had not carried out a single experiment on the subject. All the same, his opinion was accepted" — ý kiến được tin dù CHƯA TỪNG kiểm chứng ⇒ **C**. Bẫy: đoạn D có hai giả thuyết chưa chứng minh được (Maxim, Hartridge) nhưng bài không nói chúng được chấp nhận.`, ev: `He had not carried out a single experiment on the subject. All the same, his opinion was accepted, and the findings of Spallanzani and Jurine were forgotten for more than a century.` },
    17: { a: ['G'], vi: `Đoạn G: "Engineers have used the same principle to design walking sticks for blind people" — "equipment" = "walking sticks"; "people who are unable to see" = "blind people" ⇒ **G**. Bẫy: đoạn B nói về DƠI bị làm mù, không phải thiết bị cho người.`, ev: `Engineers have used the same principle to design walking sticks for blind people, which send out high-pitched sounds and warn the user when an echo returns from an object ahead.` },
    18: { a: ['E'], vi: `Đoạn E: khi hai sinh viên trình bày kết quả, "one well-known scientist was so unwilling to believe them that he took Galambos by the shoulders and shook him" — nắm vai mà lắc = phản ứng BẰNG HÀNH ĐỘNG ("physical") trước một tin khoa học ⇒ **E**. Bẫy C: Cuvier cũng không tin Spallanzani và Jurine, nhưng ông chỉ "announced" (tuyên bố) — không có hành động nào. Phải suy từ việc làm cụ thể (paraphrase mức 4).`, ev: `When the two young men first described their results at a scientific meeting, one well-known scientist was so unwilling to believe them that he took Galambos by the shoulders and shook him.` },
    19: { a: ['E'], vi: `"In 1920, an English scientist, Hamilton Hartridge, proposed the opposite: that the sounds were too high for us to hear." ⇒ **E**. Bẫy chính: Maxim (D) cũng nói về âm thanh người không nghe được, nhưng là âm quá THẤP ("too low for the human ear") — bài nói rõ ông "wrong about the pitch". 📘 Ôn Matching features: Tập 3 Ngày 21.`, ev: `In 1920, an English scientist, Hamilton Hartridge, proposed the opposite: that the sounds were too high for us to hear.` },
    20: { a: ['A'], vi: `Spallanzani thả dơi đã bị làm mù ra ngoài rồi bắt lại: "their stomachs were as full of insects as those of normal bats" — vẫn kiếm được mồi dù không còn nhìn được ⇒ **A**. "had lost the use of their eyes" = "blinded"; "find food" = dạ dày đầy côn trùng (ý phải suy ra).`, ev: `He even released blinded bats outdoors and caught them again several days later: their stomachs were as full of insects as those of normal bats.` },
    21: { a: ['C'], vi: `"Georges Cuvier… announced that bats simply felt their way, using a delicate sense of touch in their wings." — "by means of their wings" = "sense of touch in their wings" ⇒ **C**. "claimed" hợp với việc ông chỉ tuyên bố mà không thí nghiệm.`, ev: `Georges Cuvier, the most respected zoologist in Europe, announced that bats simply felt their way, using a delicate sense of touch in their wings.` },
    22: { a: ['B'], vi: `Jurine "blocked the ears of his bats with wax, and found that they now crashed into everything in their path" — rồi mới tới "Spallanzani repeated the experiment". Người ĐẦU TIÊN là Jurine ⇒ **B**. Bẫy: Spallanzani (A) cũng làm thí nghiệm này nhưng là người lặp lại; chữ "first" trong câu hỏi quyết định.`, ev: `He blocked the ears of his bats with wax, and found that they now crashed into everything in their path.` },
    23: { a: ['F'], vi: `"Griffin later gave this ability the name by which it is still known: echolocation." — "invented the term that is now used" = "gave this ability the name by which it is still known" ⇒ **F**. Maxim (D) không được dùng — danh sách có 6 người cho 5 câu.`, ev: `Griffin later gave this ability the name by which it is still known: echolocation.` },
    24: { a: ['200'], vi: `Tóm tắt: lúc tìm mồi khoảng mười tiếng mỗi giây, ngay trước khi bắt con số này lên tới… Bài: "in the final moment before the catch there may be 200 calls a second" ⇒ **200**. Số "ten" đã in sẵn trong tóm tắt. 📘 Ôn Summary completion (từ trong bài): Tập 3 Ngày 25.`, ev: `Once it has detected an insect, the rate climbs steeply, and in the final moment before the catch there may be 200 calls a second.` },
    25: { a: ['distance'], vi: `"From the time that each echo takes to return, the bat judges the distance of its prey" — "works out" = "judges"; "the length of time that passes before an echo comes back" = "the time that each echo takes to return"; "the insect" = "its prey" ⇒ **distance**. Bẫy: TỐC ĐỘ con mồi ("how fast") được suy từ cao độ của tiếng vang, không phải từ thời gian.`, ev: `From the time that each echo takes to return, the bat judges the distance of its prey; from small changes in the pitch of the echo, it can tell how fast the insect is moving.` },
    26: { a: ['muscle'], vi: `"it tightens a tiny muscle in its ear at the instant of each call" — "small" = "tiny"; "whenever it calls" = "at the instant of each call" ⇒ **muscle**. Cần danh từ số ít sau "a small".`, ev: `To prevent this, it tightens a tiny muscle in its ear at the instant of each call, and relaxes it again in time to hear the echo.` },

    /* ── Passage 3 ── */
    27: { a: ['YES'], vi: `Tác giả: lời đồn ấy "survives, I suspect, not because anyone has checked it but because it tells us something we would like to be true" — tồn tại vì nó nói điều ta MUỐN tin = người ta thấy nó hấp dẫn ⇒ **YES**. "I suspect" cho biết đây là quan điểm của tác giả — đúng thứ dạng YNNG hỏi. 📘 Ôn Yes/No/Not Given 2: Tập 3 Ngày 23.`, ev: `It survives, I suspect, not because anyone has checked it but because it tells us something we would like to be true: that every language is a separate world.` },
    28: { a: ['NO'], vi: `Whorf "earned his living as an inspector for a fire insurance company and studied languages in his spare time" — nghề chính là thanh tra bảo hiểm, ngôn ngữ chỉ là việc lúc rảnh ⇒ trái với "main occupation" ⇒ **NO**.`, ev: `an American who earned his living as an inspector for a fire insurance company and studied languages in his spare time` },
    29: { a: ['NOT GIVEN'], vi: `Bài có nhắc nghề bảo hiểm của Whorf VÀ ý tưởng của ông về tiếng Hopi, nhưng KHÔNG nói hai thứ ảnh hưởng tới nhau ⇒ **NOT GIVEN**. Bẫy "hai mẩu thông tin có thật, mối liên hệ thì không" — khuôn NOT GIVEN khó nhất ở band 6.`, ev: `In the 1930s, Whorf examined Hopi, a language spoken in Arizona, and announced that it contained no words or grammatical forms that referred to time as speakers of English understand it.` },
    30: { a: ['NO'], vi: `Whorf nói tiếng Hopi không có từ chỉ thời gian; Malotki "filled hundreds of pages with Hopi expressions for days, seasons, yesterday and tomorrow" — tức BÁC BỎ, không xác nhận ⇒ **NO**. Tác giả còn nói thẳng: "it was wrong".`, ev: `When the linguist Ekkehart Malotki published a detailed study of the language in 1983, he filled hundreds of pages with Hopi expressions for days, seasons, yesterday and tomorrow.` },
    31: { a: ['YES'], vi: `Thế hệ mới "test them in experiments instead of simply drawing conclusions from grammar books, as Whorf had done" và kết quả của họ "unlike his, it rests on evidence" — tác giả coi cách làm của họ đáng tin hơn ⇒ **YES**. "a more reliable method" là ý tổng hợp từ hai mệnh đề, không có nguyên chữ trong bài.`, ev: `From the 1990s onwards, a new generation of researchers began to look for smaller effects, and to test them in experiments instead of simply drawing conclusions from grammar books, as Whorf had done.` },
    32: { a: ['NOT GIVEN'], vi: `Bài nói người nói tiếng ANH không phải là không học được phương hướng la bàn, và người Guugu Yimithirr không có "năng khiếu bẩm sinh" — nhưng KHÔNG hề bàn chuyện họ học ngôn ngữ châu Âu khó hay dễ ⇒ **NOT GIVEN**.`, ev: `Nobody suggests that speakers of English are incapable of learning the compass points, or that speakers of Guugu Yimithirr are born with a special gift.` },
    33: { a: ['B'], vi: `Lập luận đoạn 3: nếu không thể nghĩ điều ngôn ngữ thiếu từ thì… "Nor would anyone have had the common experience of knowing exactly what they mean and being unable to find the word for it." Biết rõ mình muốn nói gì (CÓ ý nghĩ) mà chưa có từ ⇒ ý nghĩ tồn tại không cần từ ⇒ **B**. A: bài nói dịch sẽ "impossible" NẾU thuyết đúng — tức thực tế dịch được. C, D không được nhắc. 📘 Ôn MCQ loại 3 đáp án sai: Tập 3 Ngày 11.`, ev: `Nor would anyone have had the common experience of knowing exactly what they mean and being unable to find the word for it.` },
    34: { a: ['D'], vi: `"The difference is one of habit. A language that requires you to pay attention to something thousands of times a day makes you very good at noticing it." ⇒ **D** (kỹ năng đến từ luyện tập liên tục mà ngôn ngữ đòi hỏi). A bị bác thẳng ("Nobody suggests… born with a special gift"); C trái bài (họ biết hướng bắc "whether they are indoors, in the dark…"); B không có trong bài.`, ev: `A language that requires you to pay attention to something thousands of times a day makes you very good at noticing it.` },
    35: { a: ['A'], vi: `"the Russians' advantage disappeared when they had to repeat a string of numbers silently during the task, which kept the language areas of the mind busy" — khi phần ngôn ngữ của trí óc bận, lợi thế mất ⇒ lợi thế phụ thuộc vào việc được dùng ngôn ngữ trong đầu ⇒ **A**. B trái bài ("English speakers can see both blues perfectly well"); C: bài so người Nga với CHÍNH HỌ (khác nhóm màu / cùng nhóm màu), không nói họ nhanh hơn người Anh ở mọi phần; D không được nhắc — hiệu ứng chỉ "a fraction of a second".`, ev: `Interestingly, the Russians' advantage disappeared when they had to repeat a string of numbers silently during the task, which kept the language areas of the mind busy.` },
    36: { a: ['C'], vi: `Đoạn cuối: "Another language cannot give us a new mind, but it can show us what our own language has trained us to ignore." — "makes us aware of things… our own language leads us to overlook" ⇒ **C**. D bị phủ định ở vế đầu ("cannot give us a new mind"); B là hệ quả NẾU Whorf đúng — mà ông sai ("the opposite is true"); A trái lập trường cả bài.`, ev: `Another language cannot give us a new mind, but it can show us what our own language has trained us to ignore.` },
    37: { a: ['D'], vi: `"A Hopi speaker, he argued, did not simply talk about time in a different way but experienced it differently." — "claimed" = "argued"; "did not experience time in the same way" = "experienced it differently" ⇒ **D**. Bẫy C ("có NHIỀU từ chỉ thời gian hơn tiếng Anh"): Whorf nói điều NGƯỢC lại — tiếng Hopi "contained no words or grammatical forms that referred to time"; người tìm ra hàng trăm trang từ chỉ thời gian là Malotki, không phải Whorf (và câu hỏi hỏi điều WHORF khẳng định). 📘 Ôn Matching sentence endings: Tập 2 Ngày 18.`, ev: `A Hopi speaker, he argued, did not simply talk about time in a different way but experienced it differently.` },
    38: { a: ['B'], vi: `"Speakers of English usually describe the position of things in relation to their own bodies" — "explain where things are" = "describe the position of things"; "by referring to" = "in relation to" ⇒ **B**. Bẫy F: bài nói ĐIỀU NGƯỢC LẠI — không ai cho rằng người nói tiếng Anh không học được phương hướng la bàn.`, ev: `Speakers of English usually describe the position of things in relation to their own bodies: the cup is to the left of the plate.` },
    39: { a: ['E'], vi: `"Russian has no single word for blue. It treats light blue and dark blue as separate basic colours" — một màu của tiếng Anh (blue) thành HAI màu cơ bản trong tiếng Nga ⇒ **E**. Đáp án là ý tổng hợp của hai câu liền nhau.`, ev: `It treats light blue and dark blue as separate basic colours, as different from each other as green and blue are for a speaker of English.` },
    40: { a: ['A'], vi: `Người nói tiếng Anh "does not have to reveal whether the neighbour is a man or a woman. A speaker of French or German has no choice" — "are forced to give information" = "has no choice"; "may leave out" = "does not have to reveal" ⇒ **A**. Đây là ví dụ cho ý của Jakobson: ngôn ngữ khác nhau ở điều chúng BUỘC ta nói.`, ev: `A speaker of French or German has no choice, because the word itself must be either masculine or feminine.` },
  },
};
