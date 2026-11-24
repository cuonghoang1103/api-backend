/**
 * Đề 10 — Academic Reading, TẬP 5 · NGÀY 16 (docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 24/11/2026.
 * Mức band 7.5 — khó hơn Đề 8 một bậc: câu dài nhiều tầng mệnh đề, từ C1–C2 (makeshift, pantomime, vindicate, even-handed,
 * scrupulously, apportion, upstream, entail…), paraphrase mức 4 ở gần như mọi câu (đổi cấu trúc + đổi góc nhìn + ý ẩn), tiêu đề
 * đoạn trừu tượng không trùng chữ với đoạn, tỉ lệ bẫy cao ("được nhắc nhưng không phải đáp án" ở mọi nhóm), Passage 3 là bài LẬP
 * LUẬN ngôi thứ nhất ~990 từ: tác giả cho cả hai phe đều đúng một phần, nhượng bộ rồi mới nêu kết luận riêng.
 * Thể loại theo mục 4.2: Địa chất · Ngôn ngữ học · AI & đạo đức. Chín dạng, có đủ các dạng Đề 8 KHÔNG có (diagram, short answer,
 * sentence completion) để ba đề liền nhau phủ rộng:
 *   Passage 1 (địa chất — đọc lòng Trái Đất bằng sóng động đất): TFNG · Diagram labelling · Short answer
 *   Passage 2 (ngôn ngữ học — ngôn ngữ ký hiệu Nicaragua ra đời): Matching headings (7 đoạn, 10 tiêu đề) · Matching features ·
 *                                                                 Sentence completion
 *   Passage 3 (AI & đạo đức — số học của sự công bằng):           YNNG · MCQ (4 lựa chọn) · Summary (hộp từ)
 * KHÔNG trùng đề tài với Đề 0–8 và passage Tập 3–5 (đã grep trong tap-2…tap-5/ngay + thi-may/de: seismic, Lehmann, Mohorovi,
 * inner core, Nicaragua, creole, pidgin, recidiv, ProPublica = 0 kết quả; "sign language" chỉ xuất hiện một lần thoáng qua trong
 * bài giảng ngôn ngữ trẻ em của Đề 4; "Words and worlds" của Đề 5 nói về ngôn ngữ và tư duy — khác đề tài).
 * DỮ KIỆN: kiến thức phổ thông, soạn theo trí nhớ — CHƯA mở nguồn đối chiếu trong phiên này (nên soát trước khi dùng làm tài liệu
 * tham khảo). Địa chất: hố khoan Kola (Liên Xô, khởi công 1970, đích 15 km, dừng ở 12.262 m năm 1989, 180°C so với dự tính khoảng
 * 100°C; giếng dầu khoan xiên sau này DÀI hơn nhưng không sâu hơn theo phương thẳng đứng); vỏ lục địa dày trung bình ~35 km; bán
 * kính Trái Đất ~6.370 km; Oldham 1906 (lõi); Mohorovičić 1909 (động đất phía nam Zagreb, hai nhóm sóng P ⇒ ranh giới vỏ – manti);
 * Gutenberg 1913 (~2.900 km); Jeffreys 1926 (lõi lỏng); Inge Lehmann, động đất New Zealand 1929, bài báo "P′" 1936 (lõi trong), thẻ
 * bìa cứng trong hộp yến mạch (giai thoại do người cháu kể — bài viết "it is said"), mất 1993 thọ 104; lõi trong rắn được xác nhận
 * bằng số liệu sau đó vài chục năm; bán kính lõi trong ~1.220 km; nhiệt độ cỡ bề mặt Mặt Trời (ước lượng). Ngôn ngữ ký hiệu
 * Nicaragua: trung tâm giáo dục đặc biệt ở Managua mở 1977, trường nghề 1980, hơn 400 học sinh điếc sau vài năm; dạy theo lối đọc
 * môi – nói tiếng Tây Ban Nha; Judy Kegl được Bộ Giáo dục mời năm 1986; Ann Senghas so các lứa (trước / sau 1984), nghiên cứu "mèo
 * nuốt quả bóng bowling lăn xuống dốc" đăng 2004 cùng hai đồng tác giả; Susan Goldin-Meadow (home sign); Derek Bickerton (creole
 * Hawaii); Steven Pinker (bản năng ngôn ngữ); Hội Ngôn ngữ học Paris 1866 từ chối nhận bài về nguồn gốc ngôn ngữ. AI: bài điều tra
 * của ProPublica 2016 về điểm rủi ro tái phạm ở một hạt của Florida (hơn 7.000 người, theo dõi hai năm; người da đen KHÔNG tái
 * phạm bị xếp nhầm rủi ro cao gần gấp đôi); công ty đáp bằng tiêu chí "điểm số nghĩa như nhau"; hai nhóm nghiên cứu độc lập chứng
 * minh hai tiêu chí không thể cùng thoả khi tỉ lệ nền khác nhau; "khoảng hai mươi định nghĩa công bằng" là con số ước lượng thường
 * được nhắc. Các đoạn 5–8 của Passage 3 là QUAN ĐIỂM của bài (bài quan điểm tự viết, không phải tổng thuật trung lập).
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE10: DeDoc = {
  id: 'doc-de10',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 10 (Tập 5 · Ngày 16)',
  boDe: 'Đề 10',
  capDo: 'Band 7.5',
  moTa: 'Reading the planet from the outside (what earthquakes reveal about the Earth\'s interior) · A language is born (Nicaraguan Sign Language) · The arithmetic of fairness (can an algorithm be unbiased?)',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — Địa chất: đọc lòng Trái Đất bằng sóng động đất ════════════════ */
    {
      so: 1,
      tieuDe: 'Reading the Planet from the Outside',
      phuDe: 'How earthquakes revealed what no drill will ever reach',
      gioiThieu: 'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      doan: [
        { s: `The travellers in Jules Verne's famous novel reached the centre of the Earth by climbing down the crater of a volcano. Their real counterparts have got nowhere near it. The deepest hole ever made lies on the Kola Peninsula, in the far north-west of Russia, where Soviet engineers began drilling in 1970 with the aim of going down fifteen kilometres. By 1989 they had reached 12,262 metres, and there they stopped. It was not the hardness of the rock that defeated them but heat: at the bottom of the hole the temperature was 180°C, almost twice what had been predicted, and rock that hot behaved less like a solid than like plastic, flowing back into the hole whenever the drill was withdrawn. Oil companies have since drilled wells that are longer, but these run at an angle or sideways; measured straight down, Kola has never been beaten. Yet the crust beneath the continents is, on average, about thirty-five kilometres thick, so the hole penetrates roughly a third of the outermost layer of a planet whose centre lies almost 6,400 kilometres below our feet.` },
        { s: `Nearly everything that is known about what lies beneath has therefore been learned without going there, and the instrument of discovery has been the earthquake. When rock suddenly breaks, energy spreads outwards in waves, of which two kinds travel through the body of the planet. Primary waves, or P waves, squeeze and stretch the material in the direction in which they are moving, and they can cross solids, liquids and gases alike. Secondary waves, or S waves, shake the material from side to side. They are the slower of the two, and, crucially, they cannot pass through a liquid, which offers no resistance to being pushed sideways. Both kinds change speed, and therefore bend, wherever the material around them changes. A record made on the far side of the world is thus a coded account of everything the waves met on their way.` },
        { s: `One of the first to read the code was Richard Oldham, a British geologist who had worked for many years in India. In 1906, comparing records of distant earthquakes, he found that S waves reached stations on the opposite side of the globe far later than they should have done, as though something deep inside had blocked the direct route. The Earth, he concluded, must have a central core made of different material from the rest. Three years later the Croatian scientist Andrija Mohorovičić examined the records of an earthquake near Zagreb, and noticed that stations beyond a certain distance had registered two sets of P waves rather than one. He realised that both came from the same shock. One set had travelled directly through the rocks near the surface, while the other had dived into denser rock below, where waves move faster, and had overtaken it. The boundary he had found, between the crust and the mantle beneath it, is still known by a shortened form of his name: the Moho.` },
        { s: `The outline was filled in quickly. In 1913 Beno Gutenberg, working in Germany, calculated that the core begins about 2,900 kilometres down. In 1926 the English mathematician Harold Jeffreys showed that the core must be liquid, which explained why S waves did not cross it. A liquid core would also bend P waves sharply, much as a lens bends light, and so for any given earthquake there ought to be a broad ring on the distant surface of the globe where no direct P waves arrive at all. This ring became known as the shadow zone.` },
        { s: `It was the shadow zone that troubled Inge Lehmann, who was in charge of Denmark's network of recording stations. The shadow was not completely dark. After a large earthquake in New Zealand in 1929, faint P waves turned up at European stations that lay inside the zone. Lehmann, who kept her data on cardboard cards filed, it is said, in empty oatmeal boxes, worked through the records by hand, and in 1936 she offered an explanation in a paper with one of the shortest titles in the scientific literature: P′. Inside the liquid core, she argued, there is a second, inner core, and it was from the surface of this inner core that the stray waves had been deflected into the shadow.` },
        { s: `That the inner core is solid was suspected from the beginning, but it could not be demonstrated until several decades later, when more sensitive instruments became available. It is a ball of iron and nickel about 1,220 kilometres in radius, and it is thought to be roughly as hot as the surface of the Sun. It remains solid not in spite of its depth but because of it: the pressure at the centre is so great that the atoms cannot move apart, as they must if a metal is to melt. Around it, the liquid metal of the outer core is in constant motion, and it is this motion that generates the planet's magnetic field, without which a compass would be useless.` },
        { s: `Lehmann died in 1993, at the age of 104. Nobody has seen what she discovered, and nobody ever will. The picture of the Earth's interior found in every textbook was assembled entirely from lines traced on paper, by people who reasoned patiently about why a wave had arrived a few seconds late, or had arrived where it had no business to arrive at all.` },
      ],
      nhom: [
        {
          id: 'p1-tfng', tu: 1, den: 6, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 1, s: 'No hole drilled since 1989 has been greater in length than the one at Kola.' },
            { n: 2, s: 'The engineers at Kola had expected the rock at the bottom of the hole to be cooler than it was.' },
            { n: 3, s: 'P waves move through the Earth at a higher speed than S waves.' },
            { n: 4, s: 'Oldham was the first scientist to record earthquake waves with an instrument.' },
            { n: 5, s: 'Mohorovičić believed that the two sets of waves he observed had been produced by two different earthquakes.' },
            { n: 6, s: 'Most scientists rejected Lehmann\'s idea of an inner core when it was first published.' },
          ],
        },
        {
          id: 'p1-diagram', tu: 7, den: 10, dang: 'diagram',
          huongDan: 'Label the diagram below.\nChoose **ONE WORD OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'The interior of the Earth as revealed by earthquake waves',
          hinh: {
            w: 620, h: 400,
            chuThich: 'Cross-section of the Earth (not to scale)',
            ve: [
              // Manti + vỏ, lõi ngoài, lõi trong
              { t: 'circle', x: 230, y: 200, r: 150, nen: '#e9dcc3' },
              { t: 'circle', x: 230, y: 200, r: 82, nen: '#f1c27d' },
              { t: 'circle', x: 230, y: 200, r: 36, nen: '#d98b4a' },
              { t: 'text', x: 230, y: 88, s: 'mantle', co: 12, giua: true, nghieng: true },
              { t: 'text', x: 230, y: 148, s: 'outer core', co: 11, giua: true, nghieng: true },
              { t: 'text', x: 230, y: 204, s: 'inner core', co: 10, giua: true, nghieng: true },
              // Tâm chấn ở đỉnh
              { t: 'text', x: 230, y: 34, s: 'earthquake', co: 12, dam: true, giua: true },
              { t: 'line', d: [[230, 40], [230, 52]], mui: true },
              // Câu 7 — độ sâu đỉnh lõi
              { t: 'line', d: [[402, 104], [296, 148]], mui: true, mau: '#333' },
              { t: 'text', x: 408, y: 92, s: 'the core begins at a depth of about', co: 11 },
              { t: 'o', n: 7, x: 452, y: 114 },
              { t: 'text', x: 506, y: 118, s: 'km', co: 11 },
              // Câu 8 — lõi ngoài lỏng
              { t: 'line', d: [[402, 196], [292, 196]], mui: true, mau: '#333' },
              { t: 'text', x: 408, y: 176, s: 'S waves cannot cross this layer,', co: 11 },
              { t: 'text', x: 408, y: 206, s: 'which is', co: 11 },
              { t: 'o', n: 8, x: 494, y: 202 },
              // Câu 9 — lõi trong rắn vì áp suất
              { t: 'line', d: [[402, 286], [250, 214]], mui: true, mau: '#333' },
              { t: 'text', x: 408, y: 274, s: 'kept solid by the enormous', co: 11 },
              { t: 'o', n: 9, x: 452, y: 296 },
              // Câu 10 — vùng bóng
              { t: 'path', d: 'M 84.5 236.3 A 150 150 0 0 0 133.6 314.9', mau: '#b3312c', day: 7 },
              { t: 'line', d: [[78, 336], [100, 286]], mui: true, mau: '#333' },
              { t: 'text', x: 12, y: 352, s: 'no direct P waves expected here:', co: 11 },
              { t: 'text', x: 12, y: 376, s: 'the', co: 11 },
              { t: 'o', n: 10, x: 80, y: 372 },
              { t: 'text', x: 132, y: 376, s: 'zone', co: 11 },
            ],
          },
        },
        {
          id: 'p1-short', tu: 11, den: 13, dang: 'short',
          huongDan: 'Answer the questions below.\nChoose **NO MORE THAN TWO WORDS** from the passage for each answer.',
          gioiHan: { tu: 2 },
          dong: [
            'What prevented the engineers at Kola from drilling any deeper? [[11]]',
            'In which country did the earthquake occur whose records led Lehmann to her discovery? [[12]]',
            'What is produced by the movement of the outer core? [[13]]',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — Ngôn ngữ học: một ngôn ngữ ra đời ════════════════ */
    {
      so: 2,
      tieuDe: 'A Language is Born',
      phuDe: 'What a group of deaf schoolchildren in Nicaragua taught linguists',
      gioiThieu: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: `Languages do not ordinarily begin. Every tongue spoken today was learned by its speakers from older speakers, who learned it from theirs, in a chain that disappears into prehistory and whose first links are beyond recovery. How a language might come into being where none existed was therefore regarded for a long time as a subject fit for speculation rather than research; in 1866 the leading linguistic society of Paris went so far as to announce that it would accept no more papers on the matter. That makes what happened in Nicaragua in the 1980s all the more remarkable. There, within the lifetime of people who are still alive, a language appeared where there had been none before, and researchers were on hand to watch.` },
        { nhan: 'B', s: `Until the late 1970s, deaf people in Nicaragua had little contact with one another. Most of them lived among hearing relatives, with whom they communicated by means of 'home signs': gestures invented within one family, adequate for everyday needs and understood by nobody outside it. The psychologist Susan Goldin-Meadow, who has studied such systems in several countries, has shown that they are more orderly than might be expected; a child will tend, for example, to arrange gestures in a consistent sequence. But a home-sign system has only one fluent user. It cannot be handed on, and it dies with the person who made it.` },
        { nhan: 'C', s: `The situation changed in 1977, when a centre for special education opened in the capital, Managua. A vocational school for deaf adolescents followed in 1980, and within a few years the two institutions were attended by more than four hundred deaf pupils. Nobody set out to give these pupils a sign language. On the contrary, their teachers, following the method then favoured in much of the world, tried to train them to lip-read and to speak Spanish, and signing was discouraged in the classroom. The lessons achieved very little. In the playground, however, and on the buses that carried them to and from school, the children pooled the gestures that each had brought from home, and a shared, makeshift means of communication arose.` },
        { nhan: 'D', s: `The staff could not follow what their pupils were saying to one another, and in 1986 the Ministry of Education asked for help from Judy Kegl, an American linguist who specialised in sign languages. Kegl began with the adolescents at the vocational school, and what she found there resembled a pidgin, the simplified contact language that arises when adults with no tongue in common have to deal with one another: the vocabulary was shared, but there were few fixed rules, and no two signers did things in quite the same way. It was when she turned to the primary school that she was astonished. The youngest children, who had been exposed to signing for the shortest time, signed faster and more fluently than their elders, and with regularities that the older pupils lacked. They were not simply imitating the model in front of them. They were improving on it.` },
        { nhan: 'E', s: `What that improvement consists of has been examined most closely by Ann Senghas, who has compared successive 'cohorts' of signers: those who entered the community before 1984, and those who arrived later. In a study published in 2004 with two colleagues, signers were shown a cartoon in which a cat, having swallowed a bowling ball, rolls helplessly down a steep street, and were asked to describe it. Hearing Spanish speakers, gesturing as they talked, typically made a single movement, the hand circling as it travelled downwards. So did most signers of the first cohort. The younger signers overwhelmingly did something different: they produced one sign for rolling, and then a separate sign for descending. The event had been broken into parts that could be combined with others, and it is precisely this building of messages out of discrete, reusable elements that distinguishes a language from pantomime, however expressive the pantomime may be.` },
        { nhan: 'F', s: `For some scholars, the conclusion is obvious. The psychologist Steven Pinker cited Nicaragua as the best evidence available that children are born equipped for grammar: given only fragmentary material to work with, they supply the structure themselves. The case also seemed to vindicate the linguist Derek Bickerton, who had argued years earlier, from his study of the creole languages of Hawaii and elsewhere, that when adults produce a pidgin it is their children who turn it into a complete language. The weakness of the argument from creoles had always been that the crucial generation was long dead. In Managua, it was sitting in the classroom.` },
        { nhan: 'G', s: `Others have drawn more cautious lessons. The language was not created by a single generation in a single leap: each cohort learned from the one before and passed on something richer to the next, and the process has not yet come to an end. Nor did the language spring from children's minds in isolation, for isolated home-signers, as Goldin-Meadow's work shows, get only so far. What Nicaragua added was a community of several hundred users, with new learners arriving every year. Age mattered too. Those who joined as adolescents or adults have, on the whole, never mastered the newer forms, however long they have used the language; those who arrived before the age of about ten acquired them without effort. Whether one reads all this as proof of an inborn faculty or of the power of social interaction probably depends on what one believed beforehand. What is not in dispute is that it took both young children and a crowd.` },
      ],
      nhom: [
        {
          id: 'p2-heading', tu: 14, den: 20, dang: 'heading',
          huongDan: 'Reading Passage 2 has seven paragraphs, **A–G**.\nChoose the correct heading for each paragraph from the list of headings below.\nChoose the correct number, **i–x**.',
          hop: {
            tieuDe: 'List of Headings',
            ds: [
              { k: 'i', t: 'A dispute over who deserves the credit' },
              { k: 'ii', t: 'The limits of a system with a single user' },
              { k: 'iii', t: 'Earlier claims apparently confirmed' },
              { k: 'iv', t: 'A question long considered beyond investigation' },
              { k: 'v', t: 'How the language spread to neighbouring countries' },
              { k: 'vi', t: 'One event, two ways of conveying it' },
              { k: 'vii', t: 'The unplanned result of a policy that failed' },
              { k: 'viii', t: 'Why numbers and timing both mattered' },
              { k: 'ix', t: 'Teachers who learned from their pupils' },
              { k: 'x', t: 'Skill found where it was least expected' },
            ],
          },
          cau: [
            { n: 14, s: 'Paragraph A' },
            { n: 15, s: 'Paragraph B' },
            { n: 16, s: 'Paragraph C' },
            { n: 17, s: 'Paragraph D' },
            { n: 18, s: 'Paragraph E' },
            { n: 19, s: 'Paragraph F' },
            { n: 20, s: 'Paragraph G' },
          ],
        },
        {
          id: 'p2-feature', tu: 21, den: 24, dang: 'match-feature',
          huongDan: 'Look at the following statements (Questions 21–24) and the list of researchers below.\nMatch each statement with the correct researcher, **A–E**.',
          hop: {
            tieuDe: 'List of Researchers',
            ds: [
              { k: 'A', t: 'Susan Goldin-Meadow' },
              { k: 'B', t: 'Judy Kegl' },
              { k: 'C', t: 'Ann Senghas' },
              { k: 'D', t: 'Steven Pinker' },
              { k: 'E', t: 'Derek Bickerton' },
            ],
          },
          cau: [
            { n: 21, s: 'had proposed, before the events in Nicaragua, that the young convert a rudimentary system into a full language' },
            { n: 22, s: 'was surprised to find that the newest learners outperformed more experienced ones' },
            { n: 23, s: 'demonstrated that gestures devised within one household show a degree of regularity' },
            { n: 24, s: 'regarded the Nicaraguan case as a sign that humans have a built-in capacity for grammar' },
          ],
        },
        {
          id: 'p2-sentence', tu: 25, den: 26, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          dong: [
            'Apart from the playground, the place where the children first combined their home signs was on [[25]].',
            'In the 2004 study, hearing people and the earliest signers represented the cat\'s journey with one [[26]] of the hand.',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — AI & đạo đức: số học của sự công bằng (bài lập luận) ════════════════ */
    {
      so: 3,
      tieuDe: 'The Arithmetic of Fairness',
      phuDe: 'Why an \'unbiased\' algorithm may be a contradiction in terms',
      gioiThieu: 'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      doan: [
        { s: `When a bank refuses a loan, or a court refuses bail, the decision was until recently made by a person, and a person can be asked for reasons. Increasingly, the decision comes instead from a statistical model that has learned from earlier cases what kind of applicant tends to repay and what kind of defendant tends to reoffend. The advocates of such systems make a claim that is difficult to dismiss: human judges are inconsistent and are swayed by things that ought to be irrelevant, whereas a model at least treats like cases alike. Their opponents reply that a model trained on the record of an unjust past will reproduce that injustice, and will do so with an air of objectivity that it has not earned. I think that both sides are right, and that the most instructive episode in the short history of this debate shows why the argument cannot be settled by better engineering.` },
        { s: `The episode concerns a program used in American courts to estimate how likely a defendant is to commit a further offence. In 2016, journalists at the news organisation ProPublica obtained the scores that had been given to more than seven thousand people arrested in a single county in Florida, and compared them with what those people actually did over the following two years. The result was stark. Among defendants who did not go on to reoffend, black defendants had been wrongly labelled as high-risk almost twice as often as white ones; among those who did reoffend, it was white defendants who had more often been wrongly rated as low-risk. The program, the journalists concluded, was biased.` },
        { s: `The company that made it replied not by disputing these figures but by producing figures of its own. A score, it pointed out, meant the same thing whoever received it: of the defendants rated as high-risk, roughly the same proportion went on to reoffend whether they were black or white. By that test, which is the one most statisticians would have thought of first, the program was scrupulously even-handed. Race, moreover, was not among the pieces of information that it was given.` },
        { s: `Within months, two groups of researchers, working independently, proved that the quarrel could not be resolved, because it was not a quarrel about facts. If two groups differ in how often the predicted outcome actually occurs among them, as the two groups in the Florida records did, then no predictor that makes any mistakes at all, however it is built, can meet both standards at once. Scores that mean the same for everyone entail unequal rates of error, and equal rates of error entail scores that mean different things. This is not a defect in one piece of software. It is arithmetic, and it applies with equal force to a human judge, whose errors have simply never been counted.` },
        { s: `The usual response among engineers has been to treat the matter as one of selecting the right definition. There are by now some twenty formal definitions of fairness in the technical literature, together with software that will measure a model against any of them. I do not doubt the value of such tools; a bias cannot be corrected until it has been measured. But they encourage the belief that fairness is a property of the model. The Florida case suggests otherwise. Whether it is worse to detain a person who would have been harmless than to release one who will do harm, and how many errors of the first kind we will tolerate in order to prevent one of the second, are not questions that have a technical answer. They are the questions that legislatures and courts exist to decide, and they were being decided, in effect, by whoever chose the settings.` },
        { s: `A second difficulty lies upstream of the model altogether. What the program predicted was not crime but rearrest, since arrests are what the records contain. If the police patrol some districts more heavily than others, the residents of those districts will be arrested more often for the same behaviour, and a model that predicts those arrests perfectly will be perfectly faithful to the pattern of policing. Nor does it help to remove the sensitive category from the data, since an address, a school or an employment history will carry much the same information indirectly. Accuracy measured against a distorted record is not a virtue.` },
        { s: `None of this is an argument for handing such decisions back to unaided human judgement. The studies we have of judges, loan officers and recruiters are hardly reassuring, and human beings suffer from one decisive disadvantage when compared with software: their reasoning cannot be inspected, run again on a different set of cases, or corrected at a single stroke. The errors of a model, once someone looks for them, can be counted, published and argued over, which is exactly what happened in Florida. It is a curious feature of the whole controversy that the scandal was possible only because the system was, in this narrow sense, more open to scrutiny than the judges it advised.` },
        { s: `My conclusion is that the demand for 'unbiased' algorithms, understandable though it is, is a demand for something that cannot exist, and that it distracts attention from two demands that can be met. The first is that those who deploy a system should be obliged to state which errors it has been designed to minimise, and at whose expense: a choice that ought to be made in public, by people who can be held to account, and not left to a supplier. The second is that anyone affected by a decision should be able to learn the grounds for it and to contest it before a human being with the authority to overturn it. A system that satisfies both conditions will still make mistakes. But they will be mistakes that we have chosen to risk, and that seems to me to be as much as fairness can mean.` },
      ],
      nhom: [
        {
          id: 'p3-ynng', tu: 27, den: 32, dang: 'ynng',
          huongDan: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nChoose\n**YES** if the statement agrees with the claims of the writer\n**NO** if the statement contradicts the claims of the writer\n**NOT GIVEN** if it is impossible to say what the writer thinks about this',
          cau: [
            { n: 27, s: 'The case made by supporters of decision-making software deserves to be taken seriously.' },
            { n: 28, s: 'The program examined by the journalists was in use in the courts of every American state.' },
            { n: 29, s: 'The company showed that the journalists had made errors in their calculations.' },
            { n: 30, s: 'The mathematical limit identified by the researchers affects human decision-makers as well as software.' },
            { n: 31, s: 'Software that tests a model against definitions of fairness serves no useful purpose.' },
            { n: 32, s: 'Some legislatures have already passed laws specifying which errors such systems should avoid.' },
          ],
        },
        {
          id: 'p3-mcq', tu: 33, den: 36, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            { n: 33, s: 'What did the two groups of researchers mentioned in the fourth paragraph establish?', chon: [
              { k: 'A', t: 'that the program could be redesigned to satisfy both of its critics and its makers' },
              { k: 'B', t: 'that the disagreement had arisen from the way the data were collected' },
              { k: 'C', t: 'that two reasonable requirements cannot both be fulfilled when groups differ' },
              { k: 'D', t: 'that the journalists had been right and the company wrong' },
            ] },
            { n: 34, s: 'What is the writer\'s objection to treating fairness as a matter of choosing the right definition?', chon: [
              { k: 'A', t: 'It makes bias in a model harder to measure.' },
              { k: 'B', t: 'It presents a moral and political choice as though it were a technical one.' },
              { k: 'C', t: 'It requires more definitions than engineers are able to test.' },
              { k: 'D', t: 'It has been rejected by the courts.' },
            ] },
            { n: 35, s: 'What point does the writer make about rearrest in the sixth paragraph?', chon: [
              { k: 'A', t: 'A model may predict it correctly and still reflect how unevenly areas are policed.' },
              { k: 'B', t: 'Records of it are less complete than records of convictions.' },
              { k: 'C', t: 'Its link with race disappears once addresses are removed from the data.' },
              { k: 'D', t: 'The police have come to depend too heavily on predictions of it.' },
            ] },
            { n: 36, s: 'Why does the writer describe the controversy as \'curious\' in the seventh paragraph?', chon: [
              { k: 'A', t: 'Judges turned out to be more accurate than the program.' },
              { k: 'B', t: 'The public showed little interest in the journalists\' findings.' },
              { k: 'C', t: 'The company welcomed the criticism it received.' },
              { k: 'D', t: 'The fault came to light because software is easier to examine than people are.' },
            ] },
          ],
        },
        {
          id: 'p3-summary-box', tu: 37, den: 40, dang: 'summary-box',
          huongDan: 'Complete the summary using the list of words, **A–H**, below.',
          tieuDe: 'The writer\'s conclusion',
          dong: [
            'The writer regards the call for software that is entirely free of bias as [[37]], and proposes two requirements in its place. First, an organisation that uses such a system should have to declare which kinds of error it is intended to reduce. This choice should be made [[38]], by people who are [[39]], and not by the firm that supplies the system. Second, a person affected by a decision should be told the reasons for it and should be able to [[40]] it before someone with the power to reverse it.',
          ],
          hop: {
            ds: [
              { k: 'A', t: 'accountable' },
              { k: 'B', t: 'quickly' },
              { k: 'C', t: 'challenge' },
              { k: 'D', t: 'unrealistic' },
              { k: 'E', t: 'qualified' },
              { k: 'F', t: 'openly' },
              { k: 'G', t: 'accept' },
              { k: 'H', t: 'dangerous' },
            ],
          },
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['FALSE'], vi: `Bài: "Oil companies have since drilled wells that are longer, but these run at an angle or sideways; measured straight down, Kola has never been beaten." — đã có giếng DÀI hơn; Kola chỉ giữ kỷ lục về độ SÂU thẳng đứng ⇒ **FALSE**. Bẫy band 8: câu đề đổi "deepest" thành "greater in length" — người đọc lướt thấy "has never been beaten" là chọn TRUE. 📘 Ôn TFNG band 8 (câu dài, suy luận): Tập 5 Ngày 3.`, ev: `Oil companies have since drilled wells that are longer, but these run at an angle or sideways; measured straight down, Kola has never been beaten.` },
    2: { a: ['TRUE'], vi: `"the temperature was 180°C, almost twice what had been predicted" — nhiệt độ thật gần gấp đôi dự tính ⇒ họ đã tưởng đá NGUỘI hơn ⇒ **TRUE**. Paraphrase đổi góc nhìn: "almost twice what had been predicted" → "had expected… to be cooler than it was".`, ev: `at the bottom of the hole the temperature was 180°C, almost twice what had been predicted` },
    3: { a: ['TRUE'], vi: `Về sóng S: "They are the slower of the two" ⇒ sóng P nhanh hơn ⇒ **TRUE**. Thông tin nằm ở câu nói về sóng S chứ không phải câu nói về sóng P — phải đảo chiều so sánh. Tên gọi "Primary / Secondary" (tới trước / tới sau) cũng xác nhận.`, ev: `They are the slower of the two` },
    4: { a: ['NOT GIVEN'], vi: `Bài chỉ nói Oldham là "One of the first to read the code" và ông SO SÁNH các bản ghi ("comparing records of distant earthquakes") — không hề nói ai là người đầu tiên GHI được sóng bằng máy ⇒ **NOT GIVEN**. Bẫy: chữ "first" có trong bài nhưng gắn với việc ĐỌC (diễn giải), không phải việc ghi.`, ev: `One of the first to read the code was Richard Oldham` },
    5: { a: ['FALSE'], vi: `"He realised that both came from the same shock." — hai nhóm sóng cùng từ MỘT trận động đất, đi hai đường khác nhau ⇒ trái với "two different earthquakes" ⇒ **FALSE**.`, ev: `He realised that both came from the same shock.` },
    6: { a: ['NOT GIVEN'], vi: `Bài kể Lehmann "offered an explanation" năm 1936 rồi nói chuyện lõi trong RẮN phải vài chục năm sau mới chứng minh được — không có thông tin nào về việc giới khoa học đón nhận hay bác bỏ ý tưởng lúc mới công bố ⇒ **NOT GIVEN**. Đừng suy từ "could not be demonstrated until several decades later": câu đó nói về tính RẮN của lõi, không nói về phản ứng của đồng nghiệp.`, ev: `in 1936 she offered an explanation in a paper with one of the shortest titles in the scientific literature` },
    7: { a: ['2,900', '2900'], vi: `Hình: "the core begins at a depth of about ___ km" = "calculated that the core begins about 2,900 kilometres down" ⇒ **2,900**. Bẫy số: 6,400 (tâm Trái Đất), 1,220 (bán kính lõi trong), 35 (độ dày vỏ). 📘 Ôn Diagram labelling: Tập 4 Ngày 17.`, ev: `calculated that the core begins about 2,900 kilometres down` },
    8: { a: ['liquid'], vi: `Hình chỉ vào lõi ngoài: "S waves cannot cross this layer, which is ___" = "Harold Jeffreys showed that the core must be liquid, which explained why S waves did not cross it" ⇒ **liquid**. Đoạn 2 đã chuẩn bị: sóng S "cannot pass through a liquid".`, ev: `showed that the core must be liquid, which explained why S waves did not cross it` },
    9: { a: ['pressure'], vi: `Hình chỉ vào lõi trong: "kept solid by the enormous ___" = "It remains solid not in spite of its depth but because of it: the pressure at the centre is so great that the atoms cannot move apart" ⇒ **pressure**. Bẫy "depth": độ sâu là nguyên nhân gián tiếp, còn thứ "enormous" giữ cho kim loại rắn là áp suất; "heat" là thứ đáng lẽ làm nó chảy.`, ev: `the pressure at the centre is so great that the atoms cannot move apart` },
    10: { a: ['shadow'], vi: `Hình: dải bề mặt xa tâm chấn "no direct P waves expected here: the ___ zone" = "a broad ring… where no direct P waves arrive at all. This ring became known as the shadow zone." ⇒ **shadow**.`, ev: `This ring became known as the shadow zone.` },
    11: { a: ['heat', 'the heat'], vi: `"It was not the hardness of the rock that defeated them but heat" ⇒ **heat**. Câu chẻ phủ định "It was not X… but Y": X (độ cứng của đá) là bẫy. "prevented… from drilling any deeper" = "defeated them". Cũng nhận "the heat". 📘 Ôn Short answer Passage khó: Tập 5 Ngày 7.`, ev: `It was not the hardness of the rock that defeated them but heat` },
    12: { a: ['New Zealand'], vi: `"After a large earthquake in New Zealand in 1929, faint P waves turned up at European stations" ⇒ **New Zealand**. Bẫy "Denmark" (nơi Lehmann làm việc) và "European stations" (nơi GHI được sóng, không phải nơi xảy ra động đất); Zagreb là trận của Mohorovičić.`, ev: `After a large earthquake in New Zealand in 1929` },
    13: { a: ['magnetic field'], vi: `"the liquid metal of the outer core is in constant motion, and it is this motion that generates the planet's magnetic field" ⇒ **magnetic field** (hai từ — đúng giới hạn; "planet's magnetic field" là ba từ, vượt). "produced by the movement" = "this motion that generates".`, ev: `it is this motion that generates the planet's magnetic field` },

    /* ── Passage 2 ── */
    14: { a: ['iv'], vi: `Đoạn A: nguồn gốc ngôn ngữ từng bị coi là "a subject fit for speculation rather than research", hội ngôn ngữ học Paris năm 1866 còn từ chối nhận bài ⇒ **iv** (câu hỏi lâu nay bị coi là không nghiên cứu được). Tiêu đề không trùng chữ nào với đoạn — phải nắm Ý. 📘 Ôn Matching headings bài trừu tượng: Tập 5 Ngày 5, Ngày 9.`, ev: `was therefore regarded for a long time as a subject fit for speculation rather than research` },
    15: { a: ['ii'], vi: `Đoạn B: "home signs" có trật tự nhất định nhưng "has only one fluent user. It cannot be handed on, and it dies with the person who made it" ⇒ **ii** (giới hạn của một hệ thống chỉ có một người dùng). Ý về Goldin-Meadow (có trật tự) chỉ là bước đệm trước "But…".`, ev: `But a home-sign system has only one fluent user.` },
    16: { a: ['vii'], vi: `Đoạn C: chính sách dạy đọc môi – nói tiếng Tây Ban Nha "achieved very little", nhưng ngoài sân chơi và trên xe buýt lũ trẻ tự gộp ký hiệu ⇒ kết quả không ai định trước của một chính sách thất bại ⇒ **vii**. "Nobody set out to give these pupils a sign language" = "unplanned". Bẫy ix: giáo viên KHÔNG học được gì từ học trò (đoạn D: họ không hiểu nổi).`, ev: `Nobody set out to give these pupils a sign language.` },
    17: { a: ['x'], vi: `Đoạn D: Kegl kinh ngạc vì lũ trẻ NHỎ NHẤT, tiếp xúc ít thời gian nhất, lại ra ký hiệu nhanh và có quy tắc hơn ⇒ **x** (kỹ năng ở nơi ít ngờ nhất). Bẫy ix ("Teachers who learned from their pupils"): đoạn chỉ nói giáo viên không theo kịp nên phải mời chuyên gia.`, ev: `The youngest children, who had been exposed to signing for the shortest time, signed faster and more fluently than their elders` },
    18: { a: ['vi'], vi: `Đoạn E: cùng một cảnh con mèo lăn xuống dốc — người nghe + lứa đầu dùng MỘT cử động, lứa sau tách thành HAI ký hiệu nối tiếp ⇒ **vi** (một sự kiện, hai cách diễn đạt).`, ev: `they produced one sign for rolling, and then a separate sign for descending` },
    19: { a: ['iii'], vi: `Đoạn F: Pinker coi đây là bằng chứng tốt nhất cho năng lực ngữ pháp bẩm sinh; trường hợp này "seemed to vindicate" Bickerton, người đã lập luận từ nhiều năm trước ⇒ **iii** (những nhận định trước đó có vẻ được xác nhận). "vindicate" = chứng tỏ ai đó đã đúng; "apparently" trong tiêu đề khớp "seemed to". Bẫy i (tranh giành công lao): không có.`, ev: `The case also seemed to vindicate the linguist Derek Bickerton` },
    20: { a: ['viii'], vi: `Đoạn G: cần một CỘNG ĐỒNG vài trăm người, người mới tới mỗi năm (numbers) + tuổi bắt đầu trước khoảng mười (timing) ⇒ **viii**. Câu kết gói cả hai: "it took both young children and a crowd". Bẫy v (lan sang nước khác): không hề được nhắc.`, ev: `What is not in dispute is that it took both young children and a crowd.` },
    21: { a: ['E'], vi: `"Derek Bickerton, who had argued years earlier, from his study of the creole languages… that when adults produce a pidgin it is their children who turn it into a complete language" ⇒ **E**. "before the events in Nicaragua" = "years earlier"; "a rudimentary system" = "a pidgin"; "the young" = "their children". Bẫy D (Pinker): ông nói SAU, lấy Nicaragua làm bằng chứng. 📘 Ôn Matching features band 8: Tập 5 Ngày 15.`, ev: `who had argued years earlier, from his study of the creole languages of Hawaii and elsewhere, that when adults produce a pidgin it is their children who turn it into a complete language` },
    22: { a: ['B'], vi: `Kegl: "It was when she turned to the primary school that she was astonished. The youngest children… signed faster and more fluently than their elders" ⇒ **B**. "the newest learners" = "exposed to signing for the shortest time"; "outperformed" = "faster and more fluently". Bẫy C (Senghas): bà SO SÁNH các lứa một cách có hệ thống, nhưng người "was surprised" là Kegl.`, ev: `It was when she turned to the primary school that she was astonished.` },
    23: { a: ['A'], vi: `Goldin-Meadow "has shown that they are more orderly than might be expected; a child will tend… to arrange gestures in a consistent sequence" ⇒ **A**. "devised within one household" = "invented within one family"; "a degree of regularity" = "more orderly than might be expected".`, ev: `has shown that they are more orderly than might be expected` },
    24: { a: ['D'], vi: `"Steven Pinker cited Nicaragua as the best evidence available that children are born equipped for grammar" ⇒ **D**. "a built-in capacity" = "born equipped". Phương án C (Senghas) không được dùng — bà mô tả hiện tượng chứ bài không gán cho bà quan điểm bẩm sinh.`, ev: `cited Nicaragua as the best evidence available that children are born equipped for grammar` },
    25: { a: ['buses'], vi: `"In the playground, however, and on the buses that carried them to and from school, the children pooled the gestures that each had brought from home" ⇒ **buses**. "combined" = "pooled". Bẫy "classroom": nơi ký hiệu bị CẤM. 📘 Ôn Sentence completion Passage khó: Tập 5 Ngày 7.`, ev: `on the buses that carried them to and from school` },
    26: { a: ['movement'], vi: `"Hearing Spanish speakers… typically made a single movement, the hand circling as it travelled downwards. So did most signers of the first cohort." ⇒ **movement**. "one ___ of the hand" = "a single movement"; "the earliest signers" = "the first cohort". Bẫy "sign": lứa SAU mới dùng "one sign… a separate sign" (hai ký hiệu).`, ev: `typically made a single movement, the hand circling as it travelled downwards` },

    /* ── Passage 3 ── */
    27: { a: ['YES'], vi: `Tác giả: "The advocates of such systems make a claim that is difficult to dismiss" và sau đó "I think that both sides are right" ⇒ lập luận của phe ủng hộ đáng được coi trọng ⇒ **YES**. "difficult to dismiss" = "deserves to be taken seriously". 📘 Ôn YNNG band 8: Tập 5 Ngày 9.`, ev: `The advocates of such systems make a claim that is difficult to dismiss` },
    28: { a: ['NOT GIVEN'], vi: `Bài chỉ nói "a program used in American courts" và số liệu của "a single county in Florida" — không nói chương trình được dùng ở MỌI bang hay chỉ một số ⇒ **NOT GIVEN**. Bẫy khái quát hoá: "American courts" ≠ "the courts of every American state".`, ev: `The episode concerns a program used in American courts to estimate how likely a defendant is to commit a further offence.` },
    29: { a: ['NO'], vi: `"The company that made it replied not by disputing these figures but by producing figures of its own." — công ty KHÔNG chê số liệu của nhà báo sai, mà đưa ra một phép đo khác ⇒ trái với câu đề ⇒ **NO**.`, ev: `The company that made it replied not by disputing these figures but by producing figures of its own.` },
    30: { a: ['YES'], vi: `"It is arithmetic, and it applies with equal force to a human judge, whose errors have simply never been counted." ⇒ **YES**. "affects human decision-makers as well as software" = "applies with equal force to a human judge".`, ev: `It is arithmetic, and it applies with equal force to a human judge, whose errors have simply never been counted.` },
    31: { a: ['NO'], vi: `"I do not doubt the value of such tools; a bias cannot be corrected until it has been measured." — tác giả công nhận chúng có ích, chỉ phê phán niềm tin mà chúng tạo ra ⇒ trái với "serves no useful purpose" ⇒ **NO**. Bẫy: đoạn này phê phán, nên dễ đoán vội là tác giả phủ nhận công cụ.`, ev: `I do not doubt the value of such tools; a bias cannot be corrected until it has been measured.` },
    32: { a: ['NOT GIVEN'], vi: `Tác giả nói đó là câu hỏi "that legislatures and courts exist to decide" và trên thực tế đang do người chọn thiết lập quyết định — không có thông tin nào về việc đã có cơ quan lập pháp nào ban hành luật như thế hay chưa ⇒ **NOT GIVEN**.`, ev: `They are the questions that legislatures and courts exist to decide, and they were being decided, in effect, by whoever chose the settings.` },
    33: { a: ['C'], vi: `Đoạn 4: khi hai nhóm khác nhau về tỉ lệ kết cục thật, "no predictor that makes any mistakes at all, however it is built, can meet both standards at once" ⇒ **C**. Loại A ("however it is built" — không thiết kế nào làm được); loại B (không phải do cách thu dữ liệu — "it was not a quarrel about facts"); loại D (không bên nào sai về số liệu). 📘 Ôn MCQ suy luận: Tập 4 Ngày 7; thể loại khó: Tập 5 Ngày 11.`, ev: `then no predictor that makes any mistakes at all, however it is built, can meet both standards at once` },
    34: { a: ['B'], vi: `Đoạn 5: các công cụ "encourage the belief that fairness is a property of the model"; nhưng giam nhầm người vô hại tệ hơn hay thả nhầm kẻ nguy hiểm tệ hơn "are not questions that have a technical answer. They are the questions that legislatures and courts exist to decide" ⇒ **B** (biến một lựa chọn đạo đức – chính trị thành chuyện kỹ thuật). Loại A: tác giả nói công cụ GIÚP đo thiên lệch.`, ev: `are not questions that have a technical answer` },
    35: { a: ['A'], vi: `Đoạn 6: "a model that predicts those arrests perfectly will be perfectly faithful to the pattern of policing" ⇒ **A** (dự đoán đúng mà vẫn phản ánh việc tuần tra không đều). Loại C: bỏ thuộc tính nhạy cảm "Nor does it help" — địa chỉ vẫn mang cùng thông tin; B và D không được nói tới.`, ev: `a model that predicts those arrests perfectly will be perfectly faithful to the pattern of policing` },
    36: { a: ['D'], vi: `Đoạn 7: "the scandal was possible only because the system was, in this narrow sense, more open to scrutiny than the judges it advised" ⇒ **D** (lỗi lộ ra vì phần mềm dễ soi hơn con người). Điều "curious" là nghịch lý: thứ bị lên án lại minh bạch hơn thứ nó thay thế. Loại A: bài nói các nghiên cứu về thẩm phán "hardly reassuring".`, ev: `the scandal was possible only because the system was, in this narrow sense, more open to scrutiny than the judges it advised` },
    37: { a: ['D'], vi: `"the demand for 'unbiased' algorithms… is a demand for something that cannot exist" ⇒ **D unrealistic** (phi thực tế). Bẫy H "dangerous": tác giả nói yêu cầu ấy "understandable" và làm lạc hướng chú ý, không nói nó nguy hiểm. 📘 Ôn Summary hộp từ: Tập 4 Ngày 25.`, ev: `is a demand for something that cannot exist` },
    38: { a: ['F'], vi: `"a choice that ought to be made in public" ⇒ **F openly** (công khai) — đổi loại từ: cụm giới từ "in public" → trạng từ "openly". Bẫy B "quickly": không có ý về tốc độ.`, ev: `a choice that ought to be made in public` },
    39: { a: ['A'], vi: `"by people who can be held to account, and not left to a supplier" ⇒ **A accountable** (chịu trách nhiệm giải trình) — đổi cấu trúc bị động "can be held to account" → tính từ. Bẫy E "qualified": bài không đòi người có chuyên môn, mà đòi người phải chịu trách nhiệm.`, ev: `by people who can be held to account, and not left to a supplier` },
    40: { a: ['C'], vi: `"to contest it before a human being with the authority to overturn it" ⇒ **C challenge** ("contest" = "challenge": phản đối, khiếu nại). "someone with the power to reverse it" = "a human being with the authority to overturn it". Bẫy G "accept": ngược nghĩa.`, ev: `to contest it before a human being with the authority to overturn it` },
  },
};
