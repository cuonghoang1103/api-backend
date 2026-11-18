/**
 * Đề 7 — Academic Reading, GIỮA TẬP 4 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 4 Ngày 15). TỰ SOẠN 18/11/2026.
 * Mức band 6.5 — khó hơn Đề 5 một bậc rưỡi: câu dài nhiều mệnh đề, từ vựng B2+/C1 (formidable, acclaimed, scepticism, threshold,
 * inescapable, electorate, prophecy…), paraphrase mức 3–4 gần như ở mọi câu (đổi cấu trúc, ý ẩn), tỉ lệ bẫy "được nhắc nhưng
 * không phải đáp án" cao; Passage 3 là bài LẬP LUẬN trừu tượng (~900 từ), tác giả phản biện một quan điểm phổ biến ở ngôi thứ nhất.
 * Thể loại theo mục 4.2: Tâm lý · Nghệ thuật · Dân số. Dạng câu — ưu tiên dạng Tập 4 Ngày 1–15 (N3 Headings 3 · N5 TFNG/YNNG bẫy
 * band 7 · N7 MCQ một & nhiều đáp án · N15 Matching sentence endings 2) + ba dạng mà Đề 5 và Đề 6 CHƯA có (table, flow-chart,
 * short answer) để ba đề liền nhau phủ đủ dạng:
 *   Passage 1 (tâm lý — thói quen hình thành trong bao lâu):  TFNG · Table completion · Short answer
 *   Passage 2 (nghệ thuật — vụ tranh giả Vermeer của Han van Meegeren): Matching headings (7 đoạn A–G, 10 tiêu đề) · Flow-chart · chọn TWO
 *   Passage 3 (dân số — nỗi sợ dân số giảm):                  YNNG · MCQ (4 lựa chọn) · Matching sentence endings
 * KHÔNG trùng đề tài với Đề 0–6 và các passage Tập 3–4 (đã grep: Meegeren, Vermeer, Lally, Maltz, Malthus, Ehrlich = 0 kết quả).
 * DỮ KIỆN: viết theo kiến thức phổ thông, soạn theo trí nhớ — CHƯA đối chiếu lại nguồn trong phiên này (nên soát trước khi dùng
 * làm tài liệu tham khảo). Thói quen: Maxwell Maltz (bác sĩ phẫu thuật thẩm mỹ, sách 1960, "a minimum of about 21 days"); William
 * James 1890; Wendy Wood (nhật ký từng giờ, ~43% hành động là thói quen; bỏng ngô cũ một tuần ở rạp; sinh viên chuyển trường);
 * Phillippa Lally, UCL (công bố trực tuyến 2009, 96 người, 12 tuần, trung bình 66 ngày, 18 → 254 ngày, vận động lâu gấp ~1,5 lần,
 * lỡ một ngày không sao). Van Meegeren: sinh 1889, học kiến trúc; The Supper at Emmaus 1937, Abraham Bredius khen là kiệt tác,
 * một bảo tàng Rotterdam mua; nhựa tổng hợp + nướng lò ~2 giờ, lăn toan, mực đen; Göring đổi 137 bức tranh năm 1942; bị bắt tháng
 * 5/1945; vẽ một "Vermeer" mới trước nhân chứng; uỷ ban Paul Coremans; án một năm tháng 11/1947, mất cuối tháng 12/1947 vì đau tim;
 * Vermeer còn khoảng 35 bức. Dân số: Malthus 1798, Ehrlich 1968, mức sinh thay thế 2,1, khoảng 2/3 dân số thế giới sống ở nước dưới
 * mức này, Hàn Quốc dưới 1, LHQ dự báo đỉnh hơn 10 tỉ vào thập niên 2080; dân số tuổi lao động Nhật giảm từ thập niên 1990. Câu
 * về sản lượng trên đầu người tuổi lao động của Nhật và nhận định về chính sách khuyến sinh là LẬP LUẬN của bài (có nguồn kinh tế
 * học ủng hộ nhưng còn tranh luận) — Passage 3 là bài QUAN ĐIỂM tự viết, không phải tổng thuật trung lập.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE7: DeDoc = {
  id: 'doc-de7',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 7 (giữa Tập 4)',
  boDe: 'Đề 7',
  capDo: 'Band 6.5',
  moTa: 'Sixty-six days (how long a habit takes to form) · The man who fooled the experts (a famous art forgery) · The fear of fewer (is a falling population a disaster?)',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — Tâm lý: thói quen hình thành trong bao lâu ════════════════ */
    {
      so: 1,
      tieuDe: 'Sixty-Six Days',
      phuDe: 'What research really says about how long it takes to form a habit',
      gioiThieu: 'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      doan: [
        { s: `Ask how long it takes to form a new habit, and many people will answer without hesitation: twenty-one days. The figure appears in self-help books, on fitness websites and in advertisements for everything from language courses to diet plans. It is precise, it is encouraging, and it has almost no scientific basis.` },
        { s: `The number can be traced to Maxwell Maltz, an American plastic surgeon. In a book published in 1960, Maltz remarked that his patients generally needed a minimum of about twenty-one days to become used to their new faces after an operation, and that people who had lost an arm or a leg went on feeling it for a similar length of time. He was describing how long it took to adjust to a change in one's body, not how long it took to learn a new behaviour, and he had carried out no experiment of any kind. Nevertheless, the book sold in its millions, and as later writers repeated the observation, the cautious words 'a minimum of about' quietly disappeared.` },
        { s: `Psychologists had been interested in habit long before Maltz. As early as 1890, the American thinker William James argued that the greater part of daily life is governed by habit, which spares us the effort of deciding each small action afresh. More than a century later, the psychologist Wendy Wood put a figure on James's claim. She asked a group of students to keep a diary and to note down, once an hour, what they were doing and what they were thinking about. Roughly 43 per cent of the actions they recorded were performed almost every day and in the same place, usually while the person's mind was on something else entirely.` },
        { s: `The question of how long a habit takes to form was finally put to the test by Phillippa Lally and her colleagues at University College London, whose results first appeared in 2009. They recruited 96 volunteers, each of whom chose one simple action connected with eating, drinking or physical activity — eating a piece of fruit with lunch, for instance, or running for fifteen minutes before dinner — and tried to carry it out daily for twelve weeks. Every day, the volunteers logged on to a website to report whether they had performed the action and to rate how automatic it had felt, that is, how far they had done it without having to remind themselves.` },
        { s: `On average, it took 66 days for a behaviour to become as automatic as it was ever going to be. The average, however, concealed enormous variation: the fastest volunteer reached that point in 18 days, while for the slowest the researchers calculated that 254 days would be needed — far longer than the study itself lasted. Much depended on the action. Drinking a glass of water after breakfast became automatic quickly, whereas habits that involved exercise took about one and a half times as long as those connected with food or drink. The most reassuring finding concerned mistakes. Missing a single day made no measurable difference to the final result, although volunteers who were inconsistent more generally were less likely to succeed.` },
        { s: `Why does repetition work? According to Wood, a habit is not really a decision at all, but a link in memory between a situation and a response. Each time an action is repeated in the same setting, the link grows stronger, until the setting alone is enough to trigger the behaviour. This explains a striking result from another of her studies, in which people arriving at a cinema were handed boxes of popcorn that was a week old. Those who rarely ate popcorn at the cinema left most of it. Those who habitually did so ate just as much of the stale popcorn as they would have eaten of a fresh box, although they admitted afterwards that they had not enjoyed it. Their hands, it seems, had been responding to the cinema, not to the taste.` },
        { s: `The same reasoning suggests when habits are easiest to change. If a habit is tied to its surroundings, then new surroundings should weaken it, and research on students who transferred from one university to another found exactly this: their old routines, whether of taking exercise or of watching television, survived the move only when the new environment closely resembled the old one. For anyone hoping to adopt a better habit, then, the evidence offers three pieces of advice. Attach the new action to something that you already do every day; begin at a moment when your routine has been disrupted in any case, such as after moving house; and expect the process to take about two months rather than three weeks — and possibly a great deal longer.` },
      ],
      nhom: [
        {
          id: 'p1-tfng', tu: 1, den: 6, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 1, s: 'The belief that a habit is formed in twenty-one days is backed by a large amount of research.' },
            { n: 2, s: 'Maltz\'s remark was based on what he had noticed in the people he treated.' },
            { n: 3, s: 'Maltz later objected to the way in which other writers had reported his words.' },
            { n: 4, s: 'The students in Wood\'s diary study were often thinking about something unrelated while they carried out their habitual actions.' },
            { n: 5, s: 'The volunteers in Lally\'s study were all told to practise the same action.' },
            { n: 6, s: 'The volunteers in Lally\'s study received payment for taking part.' },
          ],
        },
        {
          id: 'p1-table', tu: 7, den: 10, dang: 'table',
          huongDan: 'Complete the table below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Three studies of habit',
          bang: {
            dau: ['Study', 'What the participants did', 'What was found'],
            hang: [
              ['Wood: daily life', 'wrote in a [[7]] every hour, giving their actions and thoughts', 'approximately 43% of actions were habits'],
              ['Lally: forming a habit', 'repeated one action daily and reported on a [[8]]', 'average of 66 days; habits involving [[9]] were the slowest to form'],
              ['Wood: the cinema', 'were given [[10]] which was no longer fresh', 'regular eaters consumed the usual amount'],
            ],
          },
        },
        {
          id: 'p1-short', tu: 11, den: 13, dang: 'short',
          huongDan: 'Answer the questions below.\nChoose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 2, so: true },
          dong: [
            'What was Maxwell Maltz\'s profession? [[11]]',
            'How many days did the quickest volunteer in Lally\'s study need to form a habit? [[12]]',
            'Which change in a person\'s life is mentioned as a suitable time to start a new habit? [[13]]',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — Nghệ thuật: Han van Meegeren và những bức "Vermeer" giả ════════════════ */
    {
      so: 2,
      tieuDe: 'The Man Who Fooled the Experts',
      phuDe: 'How a disappointed painter produced the most famous forgeries of the twentieth century',
      gioiThieu: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: `In May 1945, a few weeks after the liberation of the Netherlands, two officers called at the Amsterdam home of a wealthy painter and art dealer named Han van Meegeren. They had been tracing the history of a picture found in the private collection of Hermann Göring, one of the most powerful men in Nazi Germany: Christ with the Adulteress, a previously unknown work by the seventeenth-century Dutch master Johannes Vermeer. The trail of sales led back to van Meegeren. Selling a national treasure to the enemy was treason, and treason could carry the death penalty. After several weeks in prison, van Meegeren produced an astonishing defence. The picture was not a national treasure at all, he declared. He had painted it himself.` },
        { nhan: 'B', s: `Van Meegeren had been born in 1889 and had trained as an architect before turning to painting. His early exhibitions sold well, but he worked in the manner of the old masters at a time when modern art was sweeping across Europe, and critics dismissed his pictures as skilful imitations with nothing original to say. He never forgave them. By his own account, his purpose in turning to forgery was not profit: he would paint a 'Vermeer' so fine that the experts acclaimed it, and would then reveal the truth and make fools of them all. Whatever his first intentions may have been, the revelation never came. The money, it turned out, was too good.` },
        { nhan: 'C', s: `The technical difficulty was formidable. Oil paint takes decades to harden completely, and the usual way of checking the age of a picture was simple: a little alcohol rubbed on the surface will dissolve new paint but leave old paint untouched. Van Meegeren spent years searching for a way round this. He bought genuine seventeenth-century pictures of little value and scraped off the paint, which left him with an old canvas. He ground his own colours from the materials that Vermeer had used, including a costly blue made from the stone lapis lazuli. His great discovery was to mix these colours with a synthetic resin instead of oil. When the finished picture was baked in an oven for about two hours, its surface became as hard as that of a painting three centuries old. Finally, he rolled the canvas over a tube to produce a network of fine cracks, and rubbed black ink into them to imitate the dirt of three hundred years.` },
        { nhan: 'D', s: `His first major forgery, The Supper at Emmaus, was completed in 1937. Cleverly, he did not copy any existing picture. Scholars had long suspected that Vermeer, of whose work only about thirty-five examples survive, must have painted religious scenes early in his career which had since been lost, and van Meegeren supplied exactly what they were hoping to discover. The painting was shown to Abraham Bredius, then the most respected authority on Dutch art, who pronounced it not merely genuine but Vermeer's masterpiece. A museum in Rotterdam bought it for a sum equal to several million euros today, and crowds queued to admire it.` },
        { nhan: 'E', s: `More 'Vermeers' followed, and they made van Meegeren one of the richest men in the country. Yet the later pictures are far cruder than the first: the faces are heavy and the figures stiff. That they were accepted at all owed much to the war. Museums had hidden their real Vermeers in shelters for safety, so that no comparison could be made, and buyers competed in secrecy and in haste, anxious that such treasures should not be lost to the nation. It was one of these inferior works that Göring acquired in 1942, handing over 137 paintings from his own collection in exchange.` },
        { nhan: 'F', s: `Faced in 1945 with officials who refused to believe his confession, van Meegeren proposed a test: he would paint a new 'Vermeer' while guards looked on. Over the following months, in the presence of witnesses, he did so. A scientific commission led by the Belgian chemist Paul Coremans then examined the disputed pictures and detected the synthetic resin, a material that had not existed before the twentieth century. The charge of treason was dropped. In November 1947, van Meegeren was convicted of forgery and fraud, and was given a sentence of one year. He never served it, for he died of a heart attack at the end of the following month. By then, according to opinion polls, he had become one of the most popular men in the Netherlands: the trickster who had cheated Göring.` },
        { nhan: 'G', s: `The affair remains an uncomfortable one for the art world. To modern eyes, The Supper at Emmaus looks less like a Vermeer than like a painting of the 1930s — the faces, it has often been remarked, resemble those of the film stars of the period — and visitors wonder how anybody was deceived. The answer seems to be that every generation sees the past through its own taste, and that a forger who shares that taste is invisible to his contemporaries; only when fashion moves on does the forgery begin to show its age. If that is so, the lesson is a troubling one. The forgeries that hang undetected today are, by definition, the ones that still look right to us.` },
      ],
      nhom: [
        {
          id: 'p2-heading', tu: 14, den: 20, dang: 'heading',
          huongDan: 'Reading Passage 2 has seven paragraphs, **A–G**.\nChoose the correct heading for each paragraph from the list of headings below.\nChoose the correct number, **i–x**.',
          hop: {
            tieuDe: 'List of Headings',
            ds: [
              { k: 'i', t: 'A demonstration carried out under supervision' },
              { k: 'ii', t: 'Conditions that discouraged close examination' },
              { k: 'iii', t: 'The financial losses suffered by museums' },
              { k: 'iv', t: 'A charge more serious than fraud' },
              { k: 'v', t: 'A weakness that only a later age can see' },
              { k: 'vi', t: 'Defeating a test of age' },
              { k: 'vii', t: 'Satisfying an existing expectation' },
              { k: 'viii', t: 'A wish to settle a score' },
              { k: 'ix', t: 'The first doubts expressed by scholars' },
              { k: 'x', t: 'Vermeer\'s own working methods' },
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
          id: 'p2-flow', tu: 21, den: 24, dang: 'flow',
          huongDan: 'Complete the flow-chart below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'How van Meegeren made a \'Vermeer\'',
          dong: [
            '→ cheap pictures from the seventeenth century were bought and their paint removed, to obtain an old [[21]]',
            '→ colours were prepared by hand and combined with a man-made [[22]] in place of oil',
            '→ the completed picture was heated in an [[23]] to harden it',
            '→ the picture was rolled so that cracks appeared; these were filled with black [[24]]',
          ],
        },
        {
          id: 'p2-mcq2', tu: 25, den: 26, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [25, 26],
            s: 'Which TWO of the following statements are true of The Supper at Emmaus?',
            chon: [
              { k: 'A', t: 'It was a copy of a painting by Vermeer that had been lost.' },
              { k: 'B', t: 'It was less skilfully painted than the forgeries that came after it.' },
              { k: 'C', t: 'It was highly praised by a leading specialist.' },
              { k: 'D', t: 'It was the picture that came into Göring\'s possession.' },
              { k: 'E', t: 'It showed the kind of subject that Vermeer was thought to have painted when young.' },
            ],
          },
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — Dân số: nỗi sợ dân số giảm (bài lập luận) ════════════════ */
    {
      so: 3,
      tieuDe: 'The Fear of Fewer',
      phuDe: 'Is a falling population the disaster that many now predict?',
      gioiThieu: 'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      doan: [
        { s: `For most of the last two centuries, the fear attached to population was the fear of too many. In 1798, the English clergyman Thomas Malthus argued that human numbers would always tend to grow faster than the supply of food, so that hunger was the natural condition of mankind. In 1968, the American biologist Paul Ehrlich opened a best-selling book with the announcement that the battle to feed humanity had already been lost, and that hundreds of millions of people would starve during the following decade. Both men were mistaken, and for the same reason: each assumed that the trends of his own day would continue indefinitely. Food production outran population, and then — a development that neither had foreseen — families almost everywhere began to shrink.` },
        { s: `Today the anxiety runs in the opposite direction. Roughly two-thirds of the world's people now live in countries where the average woman has fewer than the 2.1 children that are needed to keep a population stable in the long run. In South Korea, the figure has fallen below one. The United Nations expects the number of human beings to reach a peak of a little over ten billion in the 2080s and then to begin, slowly, to decline. Newspapers that once warned of a 'population bomb' now write of a 'demographic winter', and governments from Seoul to Budapest offer couples money to have children.` },
        { s: `It would be foolish to dismiss these worries, but I believe that they deserve the same scepticism that the old ones turned out to merit. The central argument concerns what economists call the dependency ratio: as births fall and lives lengthen, a shrinking band of workers must support a growing number of pensioners. Stated like that, the arithmetic seems inescapable. Yet the calculation rests on a definition, not on a fact of nature. It counts everyone over sixty-five as dependent and everyone between fifteen and sixty-four as productive, as though a threshold chosen for the pension schemes of an earlier age, when few people lived long enough to collect anything, described the capacities of people now. Nor does the usual figure record what has been saved: a society with few children spends less on schools, and frees parents, above all mothers, for paid work.` },
        { s: `A second argument holds that ageing societies must lose their capacity for invention, since new ideas are supposed to come from the young. The evidence here is thinner than is generally supposed. It is true that mathematicians and poets often do their finest work early; but in fields that depend on accumulated experience — medicine, law, engineering, the management of large organisations — performance peaks much later. What matters for a country's prosperity is in any case not the number of its workers but what each of them produces, and nothing in the record suggests that productivity must fall when the workforce does. Japan, whose working-age population has been shrinking since the 1990s, is routinely held up as a warning. Measured by output per person of working age, however, its economy has grown about as fast as those of other rich countries over the same period. The country looks stagnant only if one insists on counting the total.` },
        { s: `None of this means that decline is free of cost. Adjustment is hardest where the fall is steepest: a fertility rate of 1.7 presents a manageable problem and a rate below one a severe one, and it is misleading to discuss the two under the same heading. Rural regions empty first, leaving the old behind in villages that can no longer support a shop or a doctor. And pension systems designed on the assumption of perpetual growth will have to be redesigned, which no electorate enjoys. These are real difficulties. They are, however, difficulties of organisation rather than of survival, and they arrive slowly enough to be planned for — which is more than could be said of the famines that Malthus predicted.` },
        { s: `What I find most questionable is the conviction that governments can, or should, reverse the trend. The record of policies intended to raise the birth rate is poor. Generous payments tend to change the timing of births rather than their number: couples have the child that they already intended to have a little sooner, and the statistics show a brief rise followed by a fall. This should not surprise us. Fertility has fallen wherever women have gained an education and a real choice about the shape of their lives, and it is hard to regard that as a problem awaiting a cure. A policy that helps people to have the children they say they want — by making housing and childcare affordable, for instance — can be defended on its own terms. A policy that treats the birth rate as a target to be met treats citizens as a means to an end.` },
        { s: `The deeper error, it seems to me, is the one that Malthus and Ehrlich made: mistaking a projection for a prophecy. A forecast for the year 2100 is a statement about the decisions of people who have not yet been born, made on the assumption that they will behave as we do. Demographers themselves are the first to say so; it is their readers who forget. A smaller population will bring problems that we can already name and others that we cannot. But a species that has spent two hundred years being wrong about its own numbers might, by now, have learned to hold its predictions lightly.` },
      ],
      nhom: [
        {
          id: 'p3-ynng', tu: 27, den: 32, dang: 'ynng',
          huongDan: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nChoose\n**YES** if the statement agrees with the claims of the writer\n**NO** if the statement contradicts the claims of the writer\n**NOT GIVEN** if it is impossible to say what the writer thinks about this',
          cau: [
            { n: 27, s: 'Malthus and Ehrlich went wrong in the same way.' },
            { n: 28, s: 'Ehrlich\'s book attracted more readers than any earlier work on population.' },
            { n: 29, s: 'The dependency ratio reflects a natural feature of human ageing.' },
            { n: 30, s: 'Japan\'s economic record has been misjudged because of the measure that is normally used.' },
            { n: 31, s: 'The countryside will feel the effects of population decline later than the cities.' },
            { n: 32, s: 'Payments to parents have produced better results in Europe than in Asia.' },
          ],
        },
        {
          id: 'p3-mcq', tu: 33, den: 36, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            { n: 33, s: 'What is the writer\'s main point about Malthus and Ehrlich in the first paragraph?', chon: [
              { k: 'A', t: 'They exaggerated the danger in order to attract attention.' },
              { k: 'B', t: 'They took it for granted that existing patterns would last.' },
              { k: 'C', t: 'They refused to accept evidence that families were becoming smaller.' },
              { k: 'D', t: 'They underestimated how quickly hunger would spread.' },
            ] },
            { n: 34, s: 'What does the writer suggest about the age of sixty-five?', chon: [
              { k: 'A', t: 'It is the point at which most people\'s abilities begin to fail.' },
              { k: 'B', t: 'It differs considerably from one country to another.' },
              { k: 'C', t: 'It ought to be removed from official statistics altogether.' },
              { k: 'D', t: 'It was fixed in circumstances that no longer apply.' },
            ] },
            { n: 35, s: 'The writer compares fertility rates of 1.7 and below one in order to show that', chon: [
              { k: 'A', t: 'situations of very different seriousness are wrongly treated as one.' },
              { k: 'B', t: 'forecasts of population are rarely accurate.' },
              { k: 'C', t: 'most countries have nothing to be concerned about.' },
              { k: 'D', t: 'numbers are falling most rapidly in rural areas.' },
            ] },
            { n: 36, s: 'What is the writer\'s attitude to policies designed to raise the birth rate?', chon: [
              { k: 'A', t: 'They would succeed if governments continued them for longer.' },
              { k: 'B', t: 'They are necessary because pension systems cannot be changed.' },
              { k: 'C', t: 'They are acceptable only when the aim is to support what people themselves want.' },
              { k: 'D', t: 'They have worked well in a small number of wealthy countries.' },
            ] },
          ],
        },
        {
          id: 'p3-ending', tu: 37, den: 40, dang: 'match-ending',
          huongDan: 'Complete each sentence with the correct ending, **A–F**, below.',
          hop: {
            ds: [
              { k: 'A', t: 'mainly affect the moment at which children are born.' },
              { k: 'B', t: 'tends to be done best relatively late in life.' },
              { k: 'C', t: 'have been abandoned by most of the governments that tried them.' },
              { k: 'D', t: 'depends on choices that will be made by future generations.' },
              { k: 'E', t: 'leaves out the money that is saved when there are fewer children.' },
              { k: 'F', t: 'should be left for individual families to decide.' },
            ],
          },
          cau: [
            { n: 37, s: 'The usual calculation of the dependency ratio' },
            { n: 38, s: 'Work that relies on long experience' },
            { n: 39, s: 'Sums of money offered to parents' },
            { n: 40, s: 'A long-range population forecast' },
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['FALSE'], vi: `Đoạn 1: con số 21 ngày "is precise, it is encouraging, and it has almost no scientific basis" — gần như KHÔNG có cơ sở khoa học, trái hẳn với "backed by a large amount of research" ⇒ **FALSE**. Bẫy: con số xuất hiện ở rất NHIỀU nơi (sách, website, quảng cáo) — nhiều nơi nhắc không phải là nhiều nghiên cứu. 📘 Ôn TFNG bẫy band 7: Tập 4 Ngày 5.`, ev: `It is precise, it is encouraging, and it has almost no scientific basis.` },
    2: { a: ['TRUE'], vi: `"Maltz remarked that his patients generally needed a minimum of about twenty-one days to become used to their new faces" — "the people he treated" = "his patients"; "what he had noticed" = một nhận xét (remarked), không phải thí nghiệm ⇒ **TRUE**. Câu sau ("he had carried out no experiment of any kind") càng xác nhận: đây chỉ là quan sát.`, ev: `Maltz remarked that his patients generally needed a minimum of about twenty-one days to become used to their new faces after an operation` },
    3: { a: ['NOT GIVEN'], vi: `Bài chỉ nói các tác giả SAU lặp lại nhận xét và mấy chữ thận trọng "a minimum of about" lặng lẽ biến mất. KHÔNG có thông tin nào về việc Maltz phản ứng (phản đối, đồng ý, hay không biết) ⇒ **NOT GIVEN**. Bẫy band 7: nửa đầu câu hỏi (lời ông bị thuật sai) CÓ trong bài, nửa sau (ông phản đối) thì không — "đúng một nửa" không phải TRUE.`, ev: `as later writers repeated the observation, the cautious words 'a minimum of about' quietly disappeared` },
    4: { a: ['TRUE'], vi: `"…were performed almost every day and in the same place, usually while the person's mind was on something else entirely" — "often thinking about something unrelated" = "usually… mind was on something else entirely" ⇒ **TRUE**. "usually" ↔ "often": mức độ khớp, không bị đẩy lên "always".`, ev: `usually while the person's mind was on something else entirely` },
    5: { a: ['FALSE'], vi: `"They recruited 96 volunteers, each of whom chose one simple action" — MỖI người tự CHỌN một hành động (ăn trái cây, chạy 15 phút…), không phải tất cả được giao cùng một việc ⇒ **FALSE**. Hai điểm trái: "chose" ≠ "were told"; "each… one action" (mỗi người một việc khác) ≠ "the same action".`, ev: `They recruited 96 volunteers, each of whom chose one simple action connected with eating, drinking or physical activity` },
    6: { a: ['NOT GIVEN'], vi: `Bài tả tình nguyện viên làm gì (chọn hành động, báo cáo trên website mỗi ngày trong 12 tuần) nhưng không hề nhắc tới tiền công hay phần thưởng ⇒ **NOT GIVEN**. "volunteers" không đủ để suy ra là không được trả tiền — người tham gia nghiên cứu thường vẫn nhận thù lao; đừng dùng suy đoán thay cho thông tin trong bài.`, ev: `Every day, the volunteers logged on to a website to report whether they had performed the action` },
    7: { a: ['diary'], vi: `"She asked a group of students to keep a diary and to note down, once an hour, what they were doing and what they were thinking about." — bảng: "wrote in a ___ every hour, giving their actions and thoughts" ⇒ **diary**. "every hour" = "once an hour"; "actions and thoughts" = "what they were doing and… thinking about". 📘 Ôn Table completion: Tập 3 Ngày 15.`, ev: `She asked a group of students to keep a diary and to note down, once an hour, what they were doing and what they were thinking about.` },
    8: { a: ['website'], vi: `"Every day, the volunteers logged on to a website to report whether they had performed the action" — bảng: "repeated one action daily and reported on a ___" ⇒ **website**.`, ev: `Every day, the volunteers logged on to a website to report whether they had performed the action` },
    9: { a: ['exercise'], vi: `"habits that involved exercise took about one and a half times as long as those connected with food or drink" — "the slowest to form" = "took… one and a half times as long" (so sánh ngầm, không có chữ "slowest" trong bài) ⇒ **exercise**. Bẫy: "water" — uống nước sau bữa sáng là thói quen hình thành NHANH.`, ev: `habits that involved exercise took about one and a half times as long as those connected with food or drink` },
    10: { a: ['popcorn'], vi: `"people arriving at a cinema were handed boxes of popcorn that was a week old" — "no longer fresh" = "a week old" / "stale" ⇒ **popcorn**. "were given" = "were handed". Cột kết quả "regular eaters consumed the usual amount" = "ate just as much of the stale popcorn as they would have eaten of a fresh box".`, ev: `people arriving at a cinema were handed boxes of popcorn that was a week old` },
    11: { a: ['plastic surgeon', 'surgeon', 'a plastic surgeon', 'a surgeon'], vi: `"Maxwell Maltz, an American plastic surgeon" ⇒ **plastic surgeon** (bác sĩ phẫu thuật thẩm mỹ). Hai từ, đúng giới hạn; không thêm "American" (thành ba từ — vượt giới hạn là sai dù đúng ý). 📘 Ôn Short answer: Tập 3 Ngày 7.`, ev: `The number can be traced to Maxwell Maltz, an American plastic surgeon.` },
    12: { a: ['18', 'eighteen', '18 days', 'eighteen days'], vi: `"the fastest volunteer reached that point in 18 days, while for the slowest… 254 days" — "quickest" = "fastest" ⇒ **18**. Ba con số dễ lẫn: 66 = trung bình; 254 = người CHẬM nhất (ước tính); 21 = con số huyền thoại.`, ev: `the fastest volunteer reached that point in 18 days` },
    13: { a: ['moving house', 'a move', 'moving'], vi: `"begin at a moment when your routine has been disrupted in any case, such as after moving house" — "a suitable time to start" = "begin at a moment when…"; "change in a person's life" = nếp sinh hoạt bị xáo trộn ⇒ **moving house**. Ý này nối với nghiên cứu sinh viên chuyển trường ở đầu đoạn: môi trường mới làm thói quen cũ yếu đi.`, ev: `begin at a moment when your routine has been disrupted in any case, such as after moving house` },

    /* ── Passage 2 ── */
    14: { a: ['iv'], vi: `Đoạn A: van Meegeren bị truy vì bán "báu vật quốc gia" cho kẻ thù — "treason, and treason could carry the death penalty"; để thoát, ông nhận mình là kẻ làm tranh GIẢ. Tội phản quốc nặng hơn nhiều so với tội lừa đảo ⇒ **iv** (A charge more serious than fraud). Bẫy i: đoạn A chỉ có lời KHAI, cuộc "trình diễn" có giám sát nằm ở đoạn F. 📘 Ôn Matching headings 3 (ý ẩn): Tập 4 Ngày 3.`, ev: `Selling a national treasure to the enemy was treason, and treason could carry the death penalty.` },
    15: { a: ['viii'], vi: `Đoạn B: giới phê bình chê tranh ông là bắt chước, "He never forgave them"; mục đích làm giả "was not profit" mà để các chuyên gia khen rồi "make fools of them all" = trả đũa ⇒ **viii** (A wish to settle a score — "settle a score" = trả mối hận). Tiêu đề không có chữ nào trùng với đoạn: phải hiểu Ý. Bẫy ix: giới học giả ở đây CHÊ tranh thật của ông, không phải nghi ngờ tranh giả.`, ev: `He never forgave them.` },
    16: { a: ['vi'], vi: `Đoạn C: phép thử tuổi tranh là bôi cồn (sơn mới tan, sơn cũ không); ông mất nhiều năm tìm cách "round this" — toan cũ, nhựa tổng hợp, nướng lò, vết nứt + mực ⇒ **vi** (Defeating a test of age). Bẫy x: đoạn có nhắc vật liệu Vermeer dùng (lapis lazuli) nhưng chỉ một chi tiết; đoạn nói về cách làm của VAN MEEGEREN.`, ev: `Van Meegeren spent years searching for a way round this.` },
    17: { a: ['vii'], vi: `Đoạn D: học giả vốn NGHI Vermeer từng vẽ tranh tôn giáo thời trẻ đã thất lạc; van Meegeren "supplied exactly what they were hoping to discover" ⇒ đáp ứng một kỳ vọng CÓ SẴN ⇒ **vii**. Bẫy iii: bảo tàng trả một khoản lớn, nhưng đoạn không nói về "thiệt hại tài chính" — một chi tiết không làm nên tiêu đề.`, ev: `van Meegeren supplied exactly what they were hoping to discover` },
    18: { a: ['ii'], vi: `Đoạn E: tranh sau thô hơn nhiều, vậy mà vẫn lọt — "owed much to the war": tranh Vermeer thật bị cất trong hầm nên "no comparison could be made", người mua tranh nhau "in secrecy and in haste" ⇒ hoàn cảnh khiến không ai soi kỹ ⇒ **ii**. Bẫy iii: Göring đổi 137 bức tranh — vẫn không phải "bảo tàng thiệt hại".`, ev: `Museums had hidden their real Vermeers in shelters for safety, so that no comparison could be made` },
    19: { a: ['i'], vi: `Đoạn F: quan chức không tin lời khai ⇒ ông đề nghị vẽ một "Vermeer" mới "while guards looked on… in the presence of witnesses" ⇒ **i** (A demonstration carried out under supervision). Phần sau (uỷ ban Coremans, bản án, cái chết) là hệ quả; ý mở đoạn và chi phối cả đoạn là cuộc chứng minh.`, ev: `he would paint a new 'Vermeer' while guards looked on` },
    20: { a: ['v'], vi: `Đoạn G: ngày nay bức tranh trông như tranh thập niên 1930; "only when fashion moves on does the forgery begin to show its age" — điểm yếu mà người ĐƯƠNG THỜI không thấy, chỉ thế hệ sau thấy ⇒ **v**. Bẫy ix: "visitors wonder how anybody was deceived" là người xem NGÀY NAY, không phải "những nghi ngờ đầu tiên của học giả".`, ev: `only when fashion moves on does the forgery begin to show its age` },
    21: { a: ['canvas'], vi: `"He bought genuine seventeenth-century pictures of little value and scraped off the paint, which left him with an old canvas." — "cheap" = "of little value"; "their paint removed" = "scraped off the paint" ⇒ **canvas** (vải toan). 📘 Ôn Flow-chart: Tập 3 Ngày 17.`, ev: `He bought genuine seventeenth-century pictures of little value and scraped off the paint, which left him with an old canvas.` },
    22: { a: ['resin'], vi: `"His great discovery was to mix these colours with a synthetic resin instead of oil." — "man-made" = "synthetic"; "combined with" = "mix… with"; "in place of" = "instead of" ⇒ **resin** (nhựa). Không điền "synthetic": ô trống đứng SAU "man-made" nên cần danh từ.`, ev: `His great discovery was to mix these colours with a synthetic resin instead of oil.` },
    23: { a: ['oven'], vi: `"When the finished picture was baked in an oven for about two hours, its surface became as hard as that of a painting three centuries old." — "heated" = "baked"; "the completed picture" = "the finished picture" ⇒ **oven**. Mạo từ "an" trước ô trống báo từ bắt đầu bằng nguyên âm.`, ev: `When the finished picture was baked in an oven for about two hours` },
    24: { a: ['ink'], vi: `"he rolled the canvas over a tube to produce a network of fine cracks, and rubbed black ink into them" — "filled with" = "rubbed… into them" ⇒ **ink**. Bẫy: "dirt" — mực dùng để GIẢ LÀM bụi bẩn 300 năm; thứ ông bôi vào là mực.`, ev: `rubbed black ink into them to imitate the dirt of three hundred years` },
    25: { a: ['C', 'E'], vi: `(C) "Abraham Bredius, then the most respected authority on Dutch art, who pronounced it not merely genuine but Vermeer's masterpiece" — "a leading specialist" = "the most respected authority". (E) học giả cho rằng Vermeer hẳn đã vẽ "religious scenes early in his career" và ông cung cấp đúng thứ đó. Loại A: "he did not copy any existing picture"; loại B: tranh SAU mới thô hơn ("the later pictures are far cruder than the first"); loại D: Göring mua Christ with the Adulteress ⇒ **C, E** (thứ tự nào cũng được). 📘 Ôn chọn nhiều đáp án: Tập 4 Ngày 7.`, ev: `who pronounced it not merely genuine but Vermeer's masterpiece` },
    26: { a: ['C', 'E'], vi: `Đáp án thứ hai của cặp 25–26: (E) "Scholars had long suspected that Vermeer… must have painted religious scenes early in his career which had since been lost" — "when young" = "early in his career"; "was thought to have painted" = "had long suspected that… must have painted". Bẫy A dùng lại đúng chữ "lost": tranh tôn giáo bị cho là THẤT LẠC, nhưng bức Emmaus không chép lại bức nào cả ⇒ **C, E**.`, ev: `must have painted religious scenes early in his career which had since been lost` },

    /* ── Passage 3 ── */
    27: { a: ['YES'], vi: `"Both men were mistaken, and for the same reason: each assumed that the trends of his own day would continue indefinitely." — "went wrong in the same way" = "mistaken… for the same reason" ⇒ **YES**. Đoạn cuối nhắc lại: "the one that Malthus and Ehrlich made". 📘 Ôn YNNG bẫy band 7: Tập 4 Ngày 5.`, ev: `Both men were mistaken, and for the same reason: each assumed that the trends of his own day would continue indefinitely.` },
    28: { a: ['NOT GIVEN'], vi: `Bài chỉ gọi sách của Ehrlich là "a best-selling book" — bán chạy, nhưng KHÔNG so với bất kỳ cuốn nào trước đó (kể cả tiểu luận của Malthus) ⇒ **NOT GIVEN**. Bẫy so sánh ngầm: "best-selling" không có nghĩa "bán chạy NHẤT từ trước tới nay trong đề tài này".`, ev: `Paul Ehrlich opened a best-selling book with the announcement that the battle to feed humanity had already been lost` },
    29: { a: ['NO'], vi: `"Yet the calculation rests on a definition, not on a fact of nature." — tác giả nói tỉ lệ phụ thuộc dựa trên một ĐỊNH NGHĨA (ngưỡng 65 tuổi do con người đặt), KHÔNG phải một sự thật tự nhiên ⇒ trái với "reflects a natural feature of human ageing" ⇒ **NO**.`, ev: `Yet the calculation rests on a definition, not on a fact of nature.` },
    30: { a: ['YES'], vi: `Nhật thường bị nêu làm lời cảnh báo; nhưng "Measured by output per person of working age… its economy has grown about as fast as those of other rich countries… The country looks stagnant only if one insists on counting the total." — đổi thước đo thì kết luận đổi ⇒ thành tích bị đánh giá sai vì thước đo thường dùng (tổng sản lượng) ⇒ **YES**. Ý ẩn: không có chữ "misjudged" hay "measure" trong bài.`, ev: `The country looks stagnant only if one insists on counting the total.` },
    31: { a: ['NO'], vi: `"Rural regions empty first, leaving the old behind in villages…" — nông thôn vắng người TRƯỚC, tức chịu tác động SỚM hơn, trái với "later than the cities" ⇒ **NO**. Bài không dùng chữ "cities" — nhưng "first" đủ để phủ định "later".`, ev: `Rural regions empty first, leaving the old behind in villages that can no longer support a shop or a doctor.` },
    32: { a: ['NOT GIVEN'], vi: `Tác giả nói chung rằng thành tích của chính sách khuyến sinh "is poor" và tiền trợ cấp chỉ đổi THỜI ĐIỂM sinh. Seoul và Budapest được nhắc ở đoạn 2 như hai nơi trả tiền cho các cặp đôi, nhưng KHÔNG có so sánh kết quả giữa châu Âu và châu Á ⇒ **NOT GIVEN**. Bẫy: hai địa danh thuộc hai châu lục dễ gợi ra một phép so sánh không hề có trong bài.`, ev: `The record of policies intended to raise the birth rate is poor.` },
    33: { a: ['B'], vi: `"each assumed that the trends of his own day would continue indefinitely" — "took it for granted" = "assumed"; "existing patterns would last" = "the trends of his own day would continue" ⇒ **B**. A: bài không nói họ cố ý phóng đại; C: gia đình thu nhỏ là điều "neither had foreseen" (không lường trước), không phải có bằng chứng mà từ chối; D: ngược — họ đánh giá QUÁ CAO nạn đói. 📘 Ôn MCQ Passage 3: Tập 4 Ngày 7.`, ev: `each assumed that the trends of his own day would continue indefinitely` },
    34: { a: ['D'], vi: `"as though a threshold chosen for the pension schemes of an earlier age, when few people lived long enough to collect anything, described the capacities of people now" — ngưỡng 65 được chọn cho một thời KHÁC (ít ai sống tới lúc lĩnh lương hưu), nay không còn đúng ⇒ **D**. A ngược ý tác giả; B không được nhắc; C quá mạnh — tác giả phê phán cách dùng ngưỡng, không đòi bỏ khỏi thống kê.`, ev: `as though a threshold chosen for the pension schemes of an earlier age, when few people lived long enough to collect anything, described the capacities of people now` },
    35: { a: ['A'], vi: `"a fertility rate of 1.7 presents a manageable problem and a rate below one a severe one, and it is misleading to discuss the two under the same heading" — hai tình huống nặng nhẹ rất khác nhau bị gộp chung ("under the same heading" = "treated as one"; "misleading" = "wrongly") ⇒ **A**. C nói quá: 1,7 "manageable" chứ không phải "nothing to be concerned about", và không phải "most countries"; D: nông thôn ở câu SAU, là ý khác.`, ev: `it is misleading to discuss the two under the same heading` },
    36: { a: ['C'], vi: `Tác giả phân biệt hai loại chính sách: giúp người dân có số con họ MUỐN (nhà ở, giữ trẻ vừa túi tiền) "can be defended on its own terms"; còn coi tỉ suất sinh là chỉ tiêu thì "treats citizens as a means to an end" ⇒ chỉ chấp nhận được khi nhằm hỗ trợ mong muốn của chính người dân ⇒ **C**. A, D trái với "The record… is poor"; B: tác giả nói hệ thống lương hưu SẼ phải thiết kế lại.`, ev: `A policy that helps people to have the children they say they want — by making housing and childcare affordable, for instance — can be defended on its own terms.` },
    37: { a: ['E'], vi: `"Nor does the usual figure record what has been saved: a society with few children spends less on schools" — "leaves out" = "Nor does… record"; "the money that is saved when there are fewer children" = "what has been saved… spends less on schools" ⇒ **E**. 📘 Ôn Matching sentence endings 2: Tập 4 Ngày 15.`, ev: `Nor does the usual figure record what has been saved: a society with few children spends less on schools` },
    38: { a: ['B'], vi: `"in fields that depend on accumulated experience — medicine, law, engineering… — performance peaks much later" — "relies on long experience" = "depend on accumulated experience"; "done best relatively late in life" = "performance peaks much later" ⇒ **B**. Bẫy: nhà toán học và nhà thơ làm việc hay nhất khi TRẺ — nhưng đó là nhóm đối lập.`, ev: `performance peaks much later` },
    39: { a: ['A'], vi: `"Generous payments tend to change the timing of births rather than their number" — "the moment at which children are born" = "the timing of births" ⇒ **A**. Về ngữ pháp, chủ ngữ số nhiều "Sums of money" chỉ hợp với A hoặc C ("affect" / "have been"); C sai vì bài không nói các chính phủ đã BỎ chính sách — Seoul và Budapest vẫn đang trả tiền.`, ev: `Generous payments tend to change the timing of births rather than their number` },
    40: { a: ['D'], vi: `"A forecast for the year 2100 is a statement about the decisions of people who have not yet been born" — "long-range forecast" = "forecast for the year 2100"; "choices… by future generations" = "decisions of people who have not yet been born" ⇒ **D**. Bẫy F ("should be left for individual families to decide") nghe hợp với giọng bài, nhưng đó là điều nên để gia đình quyết định — số con — chứ không phải một bản DỰ BÁO.`, ev: `A forecast for the year 2100 is a statement about the decisions of people who have not yet been born` },
  },
};
