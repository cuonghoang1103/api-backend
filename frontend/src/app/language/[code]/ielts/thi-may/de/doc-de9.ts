/**
 * Đề 9 — Academic Reading, TẬP 5 · NGÀY 8 (docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 24/11/2026.
 * Mức band 7.0–7.5 — đề ĐẦU của Tập 5, khó hơn Đề 8 nửa bậc: câu nhiều tầng mệnh đề, từ C1 (by-product, renounce, whimpering,
 * conscripted, convergence, refuted, auxiliary, degenerating, hindsight, emotive…), paraphrase mức 4 ở gần hết câu (đổi cấu trúc +
 * đổi góc nhìn + ý phải suy), tiêu đề đoạn TRỪU TƯỢNG không trùng chữ với đoạn, bẫy "có nhắc nhưng không phải đáp án" ở mọi nhóm;
 * Passage 3 là bài LẬP LUẬN triết học ~960 từ, tác giả ngôi thứ nhất đi qua bốn lập trường (Popper → Kuhn → Lakatos → Laudan) rồi
 * mới nêu lập trường riêng — người đọc phải tách "ai nói gì" khỏi "tác giả nghĩ gì".
 * Thể loại theo mục 4.2: Di truyền · Toàn cầu hoá · Triết học khoa học. Đề 8 đã dùng match-info / summary / summary-box ⇒ Đề 9 đổi
 * sang nhóm dạng điền + chọn hai mà Đề 8 KHÔNG có (flow, sentence, mcq2) + dạng chủ lực:
 *   Passage 1 (di truyền — thí nghiệm thuần hoá cáo bạc ở Novosibirsk):  TFNG · Flow-chart · Sentence completion
 *   Passage 2 (toàn cầu hoá — bạc, Manila 1571, "trao đổi Columbus"):    Matching headings (7 đoạn, 10 tiêu đề) · Matching features ·
 *                                                                        Choose TWO
 *   Passage 3 (triết học khoa học — ranh giới khoa học / nguỵ khoa học): MCQ (4 lựa chọn) · YNNG · Matching sentence endings
 * Nối Tập 4 + Tập 5 N1–7: TFNG band 8 (T5 N3) · headings bài trừu tượng (T5 N5, T4 N3) · sentence completion Passage 3 (T5 N7) ·
 * flow-chart (T4 N17) · matching features gán quan điểm cho học giả (T4 N23) · MCQ + Choose TWO (T4 N7) · YNNG (T4 N5) · endings (T4 N15).
 * KHÔNG trùng đề tài với Đề 0–8 và passage Tập 3–4 (đã grep 24/11: Belyaev, silver fox, Columbian, Manila, Potosí, galleon, maize,
 * demarcation, Neptune, Le Verrier, Kuhn, pseudoscience = 0 kết quả; telegraph / container / sand mining / seed bank ĐÃ có ⇒ không dùng).
 * DỮ KIỆN: kiến thức phổ thông, soạn theo trí nhớ — CHƯA đối chiếu lại nguồn trong phiên này (nên soát trước khi dùng làm tài liệu
 * tham khảo). Cáo: Dmitri Belyaev bắt đầu 1959 ở Viện Tế bào học và Di truyền học, Novosibirsk; di truyền học bị cấm thời Lysenko,
 * Belyaev mất chức ở Moskva 1948; Lyudmila Trut; 130 con cáo đầu từ trại lông thú Estonia; chọn theo phản ứng với người, < 20% cáo
 * cái và ít hơn nhiều ở cáo đực; đời 4 vẫy đuôi, đời 6 có lớp "elite", khoảng đời 20 ≈ 1/3; đốm trắng trên trán, tai cụp, đuôi
 * cong, mõm ngắn; hormone stress thấp; Belyaev mất 1985; thập niên 1990 thiếu tiền, bán cáo làm thú cưng; bài của Trut trên
 * American Scientist 1999; phê bình 2019 (Lord và cộng sự): cáo gốc từ trại ở Canada (Prince Edward Island) từ cuối thế kỷ 19.
 * Toàn cầu hoá: Manila do Tây Ban Nha lập 1571; Flynn & Giráldez ("Born with a silver spoon", 1995); galleon Acapulco – Manila;
 * Potosí (mỏ bạc phát hiện 1545, ~4.000 m, ~160.000 dân đầu thế kỷ 17); nhà Minh thu thuế bằng bạc từ thập niên 1570, bạc ở Trung
 * Quốc đắt khoảng gấp đôi châu Âu; lao dịch mita, thuỷ ngân; Alfred Crosby đặt tên "Columbian Exchange" (1972); ngô, khoai lang ở
 * Trung Quốc (đất đồi, xói mòn, lũ); O'Rourke & Williamson: hội tụ giá chỉ từ thập niên 1820; Adam Smith 1776 (hai sự kiện lớn
 * nhất, hệ quả chưa thấy hết). Triết học khoa học: Popper ở Vienna 1919, đoàn quan sát nhật thực của Eddington, Freud / Adler;
 * vụ kiện Arkansas 1982 ("creation science", thẩm phán nêu tính phản nghiệm được); sao Thiên Vương → Le Verrier → sao Hải Vương
 * 1846; "Vulcan" cho sao Thuỷ, thuyết tương đối rộng 1915; Duhem – Quine; Kuhn 1962; Lakatos (chương trình nghiên cứu tiến triển /
 * thoái hoá); Laudan 1983. Phần nhận định ở đoạn 3, 7, 8 của Passage 3 là QUAN ĐIỂM của bài (tự viết), không phải tổng thuật trung lập.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE9: DeDoc = {
  id: 'doc-de9',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 9 (Tập 5 · Ngày 8)',
  boDe: 'Đề 9',
  capDo: 'Band 7.0 → 7.5',
  moTa: 'The foxes of Novosibirsk (an experiment in domestication) · Silver, ships and sweet potatoes (when did globalisation begin?) · Drawing the line (what separates science from pseudoscience?)',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — Di truyền: thí nghiệm thuần hoá cáo ════════════════ */
    {
      so: 1,
      tieuDe: 'The Foxes of Novosibirsk',
      phuDe: 'A sixty-year experiment in turning a wild animal into a tame one',
      gioiThieu: 'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      doan: [
        { s: `In 1959, at a research institute in the Siberian city of Novosibirsk, a geneticist named Dmitri Belyaev began an experiment that he knew he would not live to see completed. Its aim was to repeat, within a human lifetime, a process that had originally taken thousands of years: the transformation of a wild animal into a domestic one. Belyaev was interested above all in the dog. Nobody doubted that dogs were descended from wolves, but nobody could explain why domestic animals of quite different species, including dogs, pigs, cattle and rabbits, had come to share so many features that their wild ancestors lacked, among them patches of white fur, drooping ears and tails that curl upwards. Charles Darwin had noticed the pattern a century earlier and had been unable to account for it.` },
        { s: `Belyaev's suggestion was that early farmers and hunters had not deliberately chosen any of these features. What they had chosen, he argued, was temperament: an animal that panicked or bit could not be kept, and so, generation after generation, only the calmest individuals were allowed to breed. If the physical changes had arrived as an unintended by-product of this preference, then selecting for tameness alone ought to be enough to produce them. It was an idea that could be tested, though not, at that time, openly. Genetics had been condemned in the Soviet Union since the late 1940s as a false science, and Belyaev himself had lost a senior post in Moscow for refusing to renounce it. He therefore presented his project to the authorities as a study of animal physiology, intended to raise the output of the country's fur farms.` },
        { s: `The animal he selected was the silver fox, a dark-coated variety of the red fox that had been bred in cages for its fur for decades without ever becoming tame. From farms in Estonia, he and a young colleague, Lyudmila Trut, who was to run the work from day to day, obtained 130 animals. The procedure they devised was simple and was applied without exception. When the cubs were a month old, an experimenter offered them food by hand while attempting to stroke them, and the test was repeated at monthly intervals until the animals approached maturity. Each fox was then given a score according to how it had responded, and only those that had shown the least fear and aggression became the parents of the next generation. The standard was severe: never more than a fifth of the females qualified, and a far smaller proportion of the males.` },
        { s: `Two precautions were taken to ensure that any change would be inherited rather than learned. The foxes were not trained in any way, and their contact with people was restricted to the brief periods of testing, so that no animal could simply grow accustomed to human company. Later, the researchers went further, exchanging newborn cubs between tame mothers and mothers from an ordinary farm population. The cubs grew up to behave like their biological parents, not like the females that had raised them.` },
        { s: `Results came with a speed that astonished even Belyaev. By the fourth generation, a few cubs were wagging their tails when a person approached. By the sixth, some were whimpering for attention and licking the experimenters' hands, and the team had to create a new category, the 'elite', to describe them. Within twenty generations, such animals made up about a third of the population; today, they are the great majority. More remarkable still was what accompanied the change. Although appearance had played no part in the selection, foxes began to be born with a white star on the forehead, then with floppy ears and curled tails, and eventually with shorter, broader muzzles. Tests showed that the tame animals produced markedly lower levels of the hormones associated with stress, and Belyaev came to believe that selection for behaviour had altered the timing of development itself, so that the foxes kept the characteristics of cubs into adult life.` },
        { s: `Belyaev died in 1985, and the experiment very nearly died a few years after him. When the Soviet Union collapsed, the institute's funding all but disappeared, and Trut was forced to reduce the population sharply; to feed the animals that remained, some foxes were sold abroad as pets. What rescued the project was publicity. An article that Trut wrote for an American science magazine in 1999 brought the foxes to international attention, and with it came foreign collaborators and foreign money. Since then, the animals' DNA has been sequenced, and several regions of the genome that differ consistently between tame and ordinary foxes have been identified.` },
        { s: `The experiment has not escaped criticism. In 2019, a group of biologists pointed out that the founding animals had not been truly wild: their ancestors had been raised on fur farms in Canada since the late nineteenth century, where white markings were already known and where farmers may well have favoured animals that were easier to handle. On this view, some of the famous features were present in the population from the start and merely became more common. The critics also doubted whether a single 'domestication syndrome', shared by all domestic species, exists at all. Few of them, however, dispute the central finding. In a few decades, and by selecting for nothing except behaviour, the Novosibirsk team produced animals that actively seek out human company, and showed that, whatever else domestication involves, it need not take thousands of years.` },
      ],
      nhom: [
        {
          id: 'p1-tfng', tu: 1, den: 6, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose **TRUE** if the statement agrees with the information, **FALSE** if the statement contradicts the information, or **NOT GIVEN** if there is no information on this.',
          cau: [
            { n: 1, s: 'Darwin put forward an explanation for the features that domestic animals have in common.' },
            { n: 2, s: 'Belyaev thought that the people who first kept animals had selected them for the way they behaved.' },
            { n: 3, s: 'Soviet officials were not told the real purpose of the fox experiment.' },
            { n: 4, s: 'The foxes obtained from Estonia were calmer than those kept on other fur farms.' },
            { n: 5, s: 'Male and female foxes were chosen for breeding in equal proportions.' },
            { n: 6, s: 'Most of the foxes sold as pets in the 1990s went to buyers in the United States.' },
          ],
        },
        {
          id: 'p1-flow', tu: 7, den: 10, dang: 'flow',
          huongDan: 'Complete the flow-chart below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'How the foxes were selected and checked',
          dong: [
            '→ from the age of one month, each cub was offered [[7]] by a researcher who also tried to touch it',
            '→ the test was carried out every month, after which each animal was awarded a [[8]]',
            '→ only the animals displaying the lowest levels of fear and [[9]] were allowed to breed',
            '→ later check: newborn cubs were swapped between tame and ordinary [[10]], but still behaved like their biological parents',
          ],
        },
        {
          id: 'p1-sentence', tu: 11, den: 13, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          dong: [
            'The earliest change in the foxes\' appearance was a white mark on the head in the shape of a [[11]].',
            'Tame foxes were found to have smaller quantities of certain [[12]] that are linked to stress.',
            'Critics have noted that the foxes\' ancestors had been farmed in [[13]] long before the experiment began.',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — Toàn cầu hoá bắt đầu từ khi nào? ════════════════ */
    {
      so: 2,
      tieuDe: 'Silver, Ships and Sweet Potatoes',
      phuDe: 'When did globalisation begin?',
      gioiThieu: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: `Ask when globalisation began, and most people will name a recent decade. For some, it arrived with the cheap flights and computer networks of the late twentieth century; for others, with the steamships of the nineteenth. Economists generally favour the later dates, on the grounds that only then did trade become large in relation to what countries produced. Historians, who dislike vague beginnings, have proposed many earlier candidates, but few of them have been as bold as Dennis Flynn and Arturo Giráldez, two scholars who argue that the birth of global trade can be assigned not merely to a century but to a single year: 1571.` },
        { nhan: 'B', s: `That was the year in which Spain founded the city of Manila, in the Philippines. Long before then, caravans and ships had joined Europe, Africa and Asia, and since the voyages of Columbus, Europe had been tied to the Americas. What was missing was a regular route across the Pacific. Manila supplied it. From then on, great ships known as galleons sailed every year from Acapulco, on the coast of Mexico, carrying American silver, and returned loaded with Chinese silk and porcelain. For Flynn and Giráldez, this was the moment at which all the inhabited continents began to exchange goods directly and continuously, and in quantities large enough to matter to each of them. The route was to remain in use, with few interruptions, for almost two and a half centuries.` },
        { nhan: 'C', s: `The cargo was silver because of circumstances at the two ends of the route. In China, where roughly a quarter of the world's people lived, the paper currency had lost its value, and from the 1570s the government insisted that taxes be paid in silver. The country's own mines could not begin to meet the need, with the result that the metal was worth about twice as much there as in Europe. A merchant who could carry silver from one side of the world to the other was, in effect, guaranteed a profit, and the trade went on for as long as that difference lasted. Meanwhile, in 1545, the Spanish had come upon a mountain in the Andes that seemed to be made of the stuff. The town of Potosí, which grew up beside it at an altitude of some 4,000 metres, had by the early seventeenth century around 160,000 inhabitants, more than most of the capitals of Europe.` },
        { nhan: 'D', s: `It is easy to describe this trade in terms of prices and tonnages, and to forget who made it possible. The ore of Potosí was dug out by indigenous men who were conscripted from villages hundreds of kilometres away and sent underground for a week at a time; many were killed by rockfalls, and many more by the mercury with which the metal was separated from the rock. A priest who visited the mines in their early years described them as a mouth of hell, into which great numbers of people entered every year. Nor was the sea much kinder. The eastward crossing from Manila could last six months, and a galleon often reached Mexico having buried a third of its crew on the way.` },
        { nhan: 'E', s: `Goods and people were not all that travelled. In 1972, the historian Alfred Crosby gave the name 'the Columbian Exchange' to something that, he complained, earlier accounts of the period had treated as a footnote: the transfer of plants, animals and diseases between the hemispheres. Its effects in China were profound. Maize and sweet potatoes, both American crops, would grow on dry hillsides where rice could not, and farmers carried them into uplands that had never been cultivated. The extra food supported a rapid growth in population, but the stripping of the slopes also brought erosion, and with it worse floods in the valleys below. In Europe, meanwhile, the potato, another American plant, was to play a comparable part in feeding a growing population. As the writer Charles Mann has put it, ecosystems that had been separate for millions of years were suddenly thrown together.` },
        { nhan: 'F', s: `Not everyone is persuaded that any of this deserves the name of globalisation. The economists Kevin O'Rourke and Jeffrey Williamson accept that ships crossed the oceans in the sixteenth century, but deny that long journeys are the point. A world economy, in their view, exists only when markets are so closely joined that the price of the same commodity in distant places is pulled together. When they examined the records, they found no such convergence before the 1820s. Until then, they argue, intercontinental trade was largely confined to luxuries for the rich, sold by monopolies that kept prices far apart, and the lives of ordinary people were scarcely touched by it. Their test has the merit of being measurable, which the rival account, with its talk of links and influences, is not.` },
        { nhan: 'G', s: `Flynn and Giráldez reply that this standard is too narrow. A Chinese peasant family that survived on sweet potatoes, they point out, had been affected by events on the other side of the world, whatever was happening to the price of grain. It is hard to see how the argument could be settled by further evidence, since the two sides do not disagree about the facts; they disagree about what the term ought to cover. Perhaps the fairest comment was made long before the term existed. Writing in 1776, Adam Smith called the discovery of America and of a sea route to Asia the two greatest events in recorded history, and then added that, in the two or three centuries since, it was impossible for their consequences to have been seen in full.` },
      ],
      nhom: [
        {
          id: 'p2-heading', tu: 14, den: 20, dang: 'heading',
          huongDan: 'Reading Passage 2 has seven paragraphs, **A–G**.\nChoose the correct heading for each paragraph from the list of headings below.\nChoose the correct number, **i–x**.',
          hop: {
            tieuDe: 'List of Headings',
            ds: [
              { k: 'i', t: 'A dispute that turns on a definition' },
              { k: 'ii', t: 'Why one metal travelled so far' },
              { k: 'iii', t: 'The decline of a trading empire' },
              { k: 'iv', t: 'An unusually exact answer to an open question' },
              { k: 'v', t: 'Living cargo and its lasting consequences' },
              { k: 'vi', t: 'The last link in a chain' },
              { k: 'vii', t: 'Those who bore the cost' },
              { k: 'viii', t: 'A stricter test, which the early period fails' },
              { k: 'ix', t: 'Advances that made longer voyages possible' },
              { k: 'x', t: 'How governments tried to limit the trade' },
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
          huongDan: 'Look at the following ideas (Questions 21–24) and the list of people below.\nMatch each idea with the correct person or people, **A–E**.',
          hop: {
            tieuDe: 'List of People',
            ds: [
              { k: 'A', t: 'Dennis Flynn and Arturo Giráldez' },
              { k: 'B', t: 'Alfred Crosby' },
              { k: 'C', t: 'Charles Mann' },
              { k: 'D', t: 'Kevin O\'Rourke and Jeffrey Williamson' },
              { k: 'E', t: 'Adam Smith' },
            ],
          },
          cau: [
            { n: 21, s: 'The movement of living things between continents had been given too little attention.' },
            { n: 22, s: 'What matters is how closely markets are connected, not how far goods are carried.' },
            { n: 23, s: 'A change in what poor families ate is evidence that the world was already linked.' },
            { n: 24, s: 'The full results of an event may not be visible even long after it has happened.' },
          ],
        },
        {
          id: 'p2-mcq2', tu: 25, den: 26, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [25, 26],
            s: 'Which TWO of the following statements does the writer make about American crops in China?',
            chon: [
              { k: 'A', t: 'They could be grown on land that was unsuitable for the traditional crop.' },
              { k: 'B', t: 'They were introduced on the orders of the government.' },
              { k: 'C', t: 'They took the place of rice in the diet of the wealthy.' },
              { k: 'D', t: 'Their cultivation resulted in damage to the environment.' },
              { k: 'E', t: 'They caused the price of grain to fall sharply.' },
            ],
          },
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — Triết học khoa học: ranh giới khoa học ════════════════ */
    {
      so: 3,
      tieuDe: 'Drawing the Line',
      phuDe: 'Is there a test that separates science from its imitations?',
      gioiThieu: 'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      doan: [
        { s: `Almost everyone agrees that astronomy is a science and that astrology is not. Asked to say what the difference consists in, however, most of us hesitate, and the hesitation is not a sign of ignorance: the question has defeated some of the ablest philosophers of the past hundred years. Nor is it of interest to philosophers alone. Judges must decide what may be taught in science lessons, governments which research to pay for, and patients which treatments to trust, and each of these decisions assumes that a line can be drawn somewhere.` },
        { s: `The most celebrated attempt to draw it was made by Karl Popper. As a young man in Vienna in 1919, Popper was struck by a contrast. Einstein's new theory of gravity had just made a prediction that might easily have turned out to be wrong: that light from distant stars would be bent by a precise amount as it passed the sun. An expedition to observe an eclipse found that it was. The psychological theories of Freud and Adler, which were then the talk of the city, ran no comparable risk. Whatever a patient did, however surprising, their supporters could show that the theory had expected it. Popper concluded that this apparent strength was in fact a weakness. A theory that forbids nothing, he reasoned, tells us nothing; what marks a theory as scientific is that some possible observation would refute it.` },
        { s: `Popper's criterion has had a remarkable career outside philosophy. Working scientists like to quote it, and in 1982 an American judge, required to rule on whether a doctrine known as 'creation science' could be taught in the state schools of Arkansas, listed it among the essential characteristics of science. I suspect, though, that its popularity owes more to its convenience than to its accuracy. It is brief, it flatters scientists by presenting them as fearless critics of their own ideas, and it offers anyone who needs one a ready-made test.` },
        { s: `The difficulty is that the history of science does not obey it. In the early nineteenth century, astronomers found that the planet Uranus was not following the path that Newton's laws laid down for it. On a strict reading of Popper, Newton had been refuted. No astronomer drew that conclusion, and it would have been absurd to do so, given how much the theory had already explained. Instead, the Frenchman Urbain Le Verrier supposed that an unseen planet was pulling Uranus off course, and calculated where it must be. In 1846, Neptune was found almost exactly there. Encouraged, Le Verrier turned to a similar irregularity in the orbit of Mercury and proposed another hidden planet, which he named Vulcan. Astronomers searched for it for decades. It did not exist: the irregularity was genuine, and it was accounted for only in 1915, by Einstein. The same manoeuvre had been a triumph on one occasion and a blind alley on the next, and nothing in Popper's rule could have told the astronomers in advance which it would be.` },
        { s: `Behind the episode lies a point of logic. No hypothesis faces the evidence by itself. A prediction follows from a theory only when many further assumptions are added, about the instruments, for instance, or about what else is present in the sky, and when the prediction fails, the failure announces that something is wrong without saying what. Thomas Kuhn, whose study of scientific change appeared in 1962, added that protecting a theory in these circumstances is not a lapse from proper method but the normal state of affairs. Most scientists, most of the time, are not trying to overthrow anything. They are solving puzzles within a framework that they take for granted, and a discipline whose members were for ever challenging its foundations would never get anywhere.` },
        { s: `Imre Lakatos tried to rescue what he could. We should assess, he proposed, not a single theory at a single moment but a whole programme of research as it develops. A programme is progressing if the adjustments made to protect it lead to new predictions which then succeed, as with Neptune, and it is degenerating if they serve only to explain failures away afterwards. This is a real improvement, yet it surrenders the thing that made Popper's test attractive, for the verdict can be delivered only with hindsight. Lakatos himself conceded that a degenerating programme might one day recover, so that nobody could be called irrational for remaining loyal to it. A standard that cannot say when it is time to give up is of little use to a judge who has to decide this afternoon.` },
        { s: `By 1983, the philosopher Larry Laudan felt able to pronounce the whole problem dead. The sciences, he argued, are too various to share any single feature, and the word 'pseudoscience' expresses disapproval without describing anything. For some years, this became the standard view. I do not think that we should accept it. That no sharp boundary exists does not mean that there is no difference: there is no instant at which day turns into night, but noon is not midnight.` },
        { s: `A more promising approach, to my mind, gives up the search for a test that can be applied to theories and looks at the conduct of the people who hold them. Do they invite criticism from outsiders? Do they publish their methods so that others can repeat the work, and revise their claims when the repetition fails? Has the stock of results on which everyone can rely grown over time? Judged in this way, astrology fails, though not for the reason usually given. Its claims can be tested; many of them have been, and they did not survive. It fails because its practitioners carried on exactly as before. That, I think, is what Popper had glimpsed in Vienna. His mistake was to take a virtue of communities for a logical property of theories.` },
      ],
      nhom: [
        {
          id: 'p3-mcq', tu: 27, den: 30, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            { n: 27, s: 'What did Popper notice about the theories of Freud and Adler?', chon: [
              { k: 'A', t: 'They had led to predictions which were later shown to be false.' },
              { k: 'B', t: 'Their supporters were unwilling to discuss them with outsiders.' },
              { k: 'C', t: 'They seemed to be consistent with any behaviour at all.' },
              { k: 'D', t: 'They had borrowed some of their ideas from physics.' },
            ] },
            { n: 28, s: 'The writer describes the search for Vulcan in order to show that', chon: [
              { k: 'A', t: 'astronomers of the period often made careless calculations.' },
              { k: 'B', t: 'a way of defending a theory that had worked once could also fail.' },
              { k: 'C', t: 'Newton\'s laws had already been given up by most scientists.' },
              { k: 'D', t: 'Le Verrier was less able than his reputation suggested.' },
            ] },
            { n: 29, s: 'What does the writer see as the main limitation of Lakatos\'s proposal?', chon: [
              { k: 'A', t: 'It can be applied only to the physical sciences.' },
              { k: 'B', t: 'It takes no account of the history of science.' },
              { k: 'C', t: 'It is too complicated for non-specialists to use.' },
              { k: 'D', t: 'It allows a judgement to be made only after the event.' },
            ] },
            { n: 30, s: 'In the final paragraph, the writer says that astrology is not a science because', chon: [
              { k: 'A', t: 'those who practise it took no notice of unfavourable results.' },
              { k: 'B', t: 'its claims are too vague to be checked.' },
              { k: 'C', t: 'it has never produced a successful prediction.' },
              { k: 'D', t: 'its methods have never been made public.' },
            ] },
          ],
        },
        {
          id: 'p3-ynng', tu: 31, den: 36, dang: 'ynng',
          huongDan: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nChoose **YES** if the statement agrees with the claims of the writer, **NO** if the statement contradicts the claims of the writer, or **NOT GIVEN** if it is impossible to say what the writer thinks about this.',
          cau: [
            { n: 31, s: 'The problem of separating science from non-science has practical consequences.' },
            { n: 32, s: 'Popper\'s test became widely known mainly because it describes accurately what scientists do.' },
            { n: 33, s: 'The judge in the 1982 case came to the wrong decision.' },
            { n: 34, s: 'It was unreasonable of astronomers to keep Newton\'s theory when Uranus failed to behave as expected.' },
            { n: 35, s: 'Kuhn had studied the history of science in greater depth than Popper had.' },
            { n: 36, s: 'The lack of a clear boundary between two things does not prove that they are the same.' },
          ],
        },
        {
          id: 'p3-ending', tu: 37, den: 40, dang: 'match-ending',
          huongDan: 'Complete each sentence with the correct ending, **A–F**, below.',
          hop: {
            ds: [
              { k: 'A', t: 'gives us no information about the world.' },
              { k: 'B', t: 'would be unable to make any progress.' },
              { k: 'C', t: 'is normally abandoned by its supporters at once.' },
              { k: 'D', t: 'does not reveal which of the ideas behind it is mistaken.' },
              { k: 'E', t: 'can be recognised by one essential feature.' },
              { k: 'F', t: 'may nevertheless become successful again.' },
            ],
          },
          cau: [
            { n: 37, s: 'A theory that is compatible with every possible observation' },
            { n: 38, s: 'A prediction that turns out to be false' },
            { n: 39, s: 'A field in which basic principles were constantly questioned' },
            { n: 40, s: 'A research programme that is currently in decline' },
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['FALSE'], vi: `Đoạn 1: Darwin "had noticed the pattern… and had been **unable to account for it**" — ông THẤY hiện tượng nhưng KHÔNG giải thích được ⇒ trái với "put forward an explanation" ⇒ **FALSE**. Bẫy: tên Darwin + "noticed" dễ khiến bạn chọn TRUE khi đọc lướt. 📘 Ôn TFNG band 8: Tập 5 Ngày 3.`, ev: `Charles Darwin had noticed the pattern a century earlier and had been unable to account for it.` },
    2: { a: ['TRUE'], vi: `Đoạn 2: nông dân, thợ săn thời đầu "had not deliberately chosen any of these features. What they had chosen… was **temperament**" (tính khí) — chỉ con điềm tĩnh nhất được sinh sản ⇒ khớp "selected them for the way they behaved" ⇒ **TRUE**. Paraphrase đổi loại từ: temperament → the way they behaved.`, ev: `What they had chosen, he argued, was temperament` },
    3: { a: ['TRUE'], vi: `Đoạn 2: ý tưởng kiểm chứng được "though not, at that time, openly"; ông "presented his project to the authorities as a study of animal physiology, intended to raise the output of the country's fur farms" — tức là khai một mục đích KHÁC ⇒ nhà chức trách không được biết mục đích thật ⇒ **TRUE**. Ý ẩn (mức 4): bài không viết "concealed", bạn phải suy từ "presented… as".`, ev: `He therefore presented his project to the authorities as a study of animal physiology, intended to raise the output of the country's fur farms.` },
    4: { a: ['NOT GIVEN'], vi: `Đoạn 3 chỉ nói 130 con cáo lấy "From farms in Estonia" — KHÔNG so tính khí cáo Estonia với cáo trại khác. Câu trước còn nói cáo bạc nuôi nhiều thập kỷ "without ever becoming tame", nhưng đó là nói chung, không phải phép so sánh giữa các trại ⇒ **NOT GIVEN**. Đừng tự suy "chọn Estonia chắc vì cáo hiền hơn".`, ev: `From farms in Estonia, he and a young colleague, Lyudmila Trut, who was to run the work from day to day, obtained 130 animals.` },
    5: { a: ['FALSE'], vi: `Đoạn 3: "never more than a fifth of the females qualified, and **a far smaller proportion of the males**" — tỉ lệ cáo đực được chọn THẤP hơn nhiều ⇒ trái với "in equal proportions" ⇒ **FALSE**.`, ev: `never more than a fifth of the females qualified, and a far smaller proportion of the males` },
    6: { a: ['NOT GIVEN'], vi: `Đoạn 6: "some foxes were sold **abroad** as pets" — chỉ nói bán ra nước ngoài, không nói nước nào. Bẫy: ngay câu sau có "an American science magazine" và "foreign money" — chữ "American" thuộc về TẠP CHÍ, không phải người mua cáo ⇒ **NOT GIVEN**.`, ev: `some foxes were sold abroad as pets` },
    7: { a: ['food'], vi: `Đoạn 3: "When the cubs were a month old, an experimenter offered them **food** by hand while attempting to stroke them" — "tried to touch it" = "attempting to stroke them" ⇒ **food**. 📘 Ôn flow-chart: Tập 4 Ngày 17.`, ev: `an experimenter offered them food by hand while attempting to stroke them` },
    8: { a: ['score'], vi: `Đoạn 3: "the test was repeated at monthly intervals… Each fox was then given a **score** according to how it had responded" — "was awarded" = "was given" ⇒ **score**. Ô trống đứng sau mạo từ "a" ⇒ danh từ số ít.`, ev: `Each fox was then given a score according to how it had responded` },
    9: { a: ['aggression'], vi: `Đoạn 3: "only those that had shown the least fear and **aggression** became the parents of the next generation" — "displaying the lowest levels of" = "had shown the least"; "allowed to breed" = "became the parents" ⇒ **aggression**.`, ev: `only those that had shown the least fear and aggression became the parents of the next generation` },
    10: { a: ['mothers'], vi: `Đoạn 4: "exchanging newborn cubs between tame **mothers** and mothers from an ordinary farm population" — "swapped" = "exchanging" ⇒ **mothers** (số nhiều). Bẫy "parents / females": hai từ này ở câu sau, nói về kết quả chứ không phải đối tượng được đổi con.`, ev: `exchanging newborn cubs between tame mothers and mothers from an ordinary farm population` },
    11: { a: ['star'], vi: `Đoạn 5: "foxes began to be born with a white **star** on the forehead, then with floppy ears and curled tails, and eventually with shorter, broader muzzles" — "began… then… eventually" cho thứ tự ⇒ thay đổi SỚM NHẤT là đốm trắng hình ngôi sao ⇒ **star**. "on the head" = "on the forehead". 📘 Ôn sentence completion Passage 3: Tập 5 Ngày 7.`, ev: `foxes began to be born with a white star on the forehead` },
    12: { a: ['hormones'], vi: `Đoạn 5: "the tame animals produced markedly lower levels of the **hormones** associated with stress" — "smaller quantities" = "lower levels"; "linked to" = "associated with" ⇒ **hormones**.`, ev: `the tame animals produced markedly lower levels of the hormones associated with stress` },
    13: { a: ['Canada'], vi: `Đoạn 7: nhóm phê bình năm 2019 chỉ ra tổ tiên của đàn cáo "had been raised on fur farms in **Canada** since the late nineteenth century" ⇒ **Canada**. Bẫy "Estonia": nơi Belyaev LẤY cáo (đoạn 3), không phải nơi tổ tiên chúng được nuôi từ trước.`, ev: `their ancestors had been raised on fur farms in Canada since the late nineteenth century` },

    /* ── Passage 2 ── */
    14: { a: ['iv'], vi: `Đoạn A: câu hỏi "toàn cầu hoá bắt đầu khi nào" thường nhận câu trả lời mơ hồ (một thập kỷ, một thế kỷ); Flynn và Giráldez gán cho nó "not merely… a century but… **a single year: 1571**" ⇒ tiêu đề **iv** "An unusually exact answer to an open question". Tiêu đề không trùng chữ nào với đoạn — phải nắm Ý. 📘 Ôn headings bài trừu tượng: Tập 5 Ngày 5, Tập 4 Ngày 3.`, ev: `the birth of global trade can be assigned not merely to a century but to a single year: 1571` },
    15: { a: ['vi'], vi: `Đoạn B: các châu lục khác đã nối với nhau từ trước; "What was missing was a regular route across the Pacific. Manila supplied it." ⇒ Manila là mắt xích CUỐI khép vòng ⇒ **vi** "The last link in a chain". Bẫy ix (tiến bộ kỹ thuật cho hải trình dài): đoạn có tàu galleon nhưng không nói về kỹ thuật.`, ev: `What was missing was a regular route across the Pacific. Manila supplied it.` },
    16: { a: ['ii'], vi: `Đoạn C mở bằng "The cargo was silver because of circumstances at the two ends of the route" rồi giải thích cầu ở Trung Quốc (thuế nộp bằng bạc, giá gấp đôi) và cung ở Potosí ⇒ **ii** "Why one metal travelled so far". Bẫy x: "the government insisted that taxes be paid in silver" có chữ government nhưng đó là tạo cầu, không phải hạn chế buôn bán.`, ev: `The cargo was silver because of circumstances at the two ends of the route.` },
    17: { a: ['vii'], vi: `Đoạn D: "to forget who made it possible" — thợ mỏ bản địa bị cưỡng bức, chết vì sập hầm và thuỷ ngân; thuỷ thủ chết một phần ba trên đường ⇒ **vii** "Those who bore the cost" (cost = cái giá bằng mạng người, không phải tiền). Bẫy: "prices and tonnages" ở câu đầu là thứ đoạn này bảo ĐỪNG chỉ nhìn vào.`, ev: `It is easy to describe this trade in terms of prices and tonnages, and to forget who made it possible.` },
    18: { a: ['v'], vi: `Đoạn E: "the transfer of plants, animals and diseases between the hemispheres" (= living cargo) và hệ quả lâu dài ở Trung Quốc (dân số tăng, xói mòn, lũ) ⇒ **v** "Living cargo and its lasting consequences".`, ev: `the transfer of plants, animals and diseases between the hemispheres` },
    19: { a: ['viii'], vi: `Đoạn F: O'Rourke và Williamson đặt tiêu chuẩn chặt hơn — kinh tế thế giới chỉ có khi giá hội tụ — và "found no such convergence before the 1820s" ⇒ thời kỳ đầu KHÔNG đạt ⇒ **viii** "A stricter test, which the early period fails". Bẫy iii (đế quốc thương mại suy tàn): đoạn có "monopolies" nhưng không nói về suy tàn.`, ev: `When they examined the records, they found no such convergence before the 1820s.` },
    20: { a: ['i'], vi: `Đoạn G: hai phía "do not disagree about the facts; they disagree about what the term ought to cover" ⇒ cuộc tranh cãi xoay quanh ĐỊNH NGHĨA ⇒ **i** "A dispute that turns on a definition" ("turn on" = phụ thuộc vào).`, ev: `the two sides do not disagree about the facts; they disagree about what the term ought to cover` },
    21: { a: ['B'], vi: `Đoạn E: Crosby đặt tên "the Columbian Exchange" cho điều mà — theo lời ông phàn nàn ("he complained") — "earlier accounts of the period had **treated as a footnote**" (coi như chú thích nhỏ = ít được chú ý) — sự di chuyển của cây, con, bệnh giữa hai bán cầu ⇒ **B**. Bẫy C (Charles Mann): cũng ở đoạn E và cũng nói về hệ sinh thái, nhưng Mann chỉ MÔ TẢ hệ quả, không nói nó từng bị xem nhẹ. 📘 Ôn matching features: Tập 4 Ngày 23.`, ev: `earlier accounts of the period had treated as a footnote` },
    22: { a: ['D'], vi: `Đoạn F: O'Rourke và Williamson "deny that long journeys are the point. A world economy… exists only when markets are so closely joined that the price of the same commodity in distant places is pulled together" ⇒ **D**. Paraphrase đổi cấu trúc: "not how far goods are carried" = "deny that long journeys are the point".`, ev: `A world economy, in their view, exists only when markets are so closely joined that the price of the same commodity in distant places is pulled together.` },
    23: { a: ['A'], vi: `Đoạn G: Flynn và Giráldez đáp rằng "A Chinese peasant family that survived on sweet potatoes… had been affected by events on the other side of the world" ⇒ đổi món ăn của nhà nghèo = bằng chứng thế giới đã nối ⇒ **A**. Bẫy B (Crosby): khoai lang nằm ở đoạn E gần tên Crosby, nhưng người DÙNG nó làm bằng chứng cho toàn cầu hoá sớm là Flynn và Giráldez.`, ev: `A Chinese peasant family that survived on sweet potatoes, they point out, had been affected by events on the other side of the world` },
    24: { a: ['E'], vi: `Đoạn G: Adam Smith (1776) "added that, in the two or three centuries since, it was impossible for their consequences to have been seen in full" ⇒ kết quả đầy đủ của một sự kiện có thể chưa thấy được dù đã rất lâu ⇒ **E**.`, ev: `in the two or three centuries since, it was impossible for their consequences to have been seen in full` },
    25: { a: ['A', 'D'], vi: `Hai ý ở đoạn E — (A) "would grow on dry hillsides **where rice could not**" ⇒ trồng được ở đất không hợp cây truyền thống (rice = "the traditional crop"); (D) "the stripping of the slopes also brought **erosion**, and with it worse **floods**" ⇒ hại môi trường. Loại B (không nhắc lệnh của triều đình — "the government" ở đoạn C là chuyện thuế bạc), C (không nói người giàu bỏ gạo), E (giá ngũ cốc chỉ được nhắc ở đoạn G, không nói giảm). 📘 Ôn Choose TWO: Tập 4 Ngày 7.`, ev: `Maize and sweet potatoes, both American crops, would grow on dry hillsides where rice could not` },
    26: { a: ['A', 'D'], vi: `Ý thứ hai của cặp **A, D**: canh tác trên sườn đồi làm đất bị xói mòn và lũ ở thung lũng nặng hơn ⇒ **D** "resulted in damage to the environment". Thứ tự hai chữ không quan trọng; mỗi chữ đúng một điểm.`, ev: `the stripping of the slopes also brought erosion, and with it worse floods in the valleys below` },

    /* ── Passage 3 ── */
    27: { a: ['C'], vi: `Đoạn 2: với thuyết của Freud và Adler, "Whatever a patient did, however surprising, their supporters could show that the theory had expected it" ⇒ thuyết khớp với MỌI hành vi ⇒ **C**. Loại A (chính vì KHÔNG có dự đoán nào có thể sai — "ran no comparable risk"), B (không nói họ từ chối bàn luận), D (Einstein được nhắc để ĐỐI CHIẾU, không phải nguồn vay mượn). 📘 Ôn MCQ Passage 3: Tập 4 Ngày 7.`, ev: `Whatever a patient did, however surprising, their supporters could show that the theory had expected it.` },
    28: { a: ['B'], vi: `Đoạn 4: cùng một cách cứu lý thuyết (giả định một hành tinh chưa thấy) thắng lớn với Neptune rồi thất bại với Vulcan — "The same manoeuvre had been a triumph on one occasion and a blind alley on the next" ⇒ **B**. Câu hỏi MỤC ĐÍCH ("in order to show that"): đừng chọn theo chi tiết. Loại A, D (không chê tính toán hay năng lực của Le Verrier), C (không ai bỏ Newton — "No astronomer drew that conclusion").`, ev: `The same manoeuvre had been a triumph on one occasion and a blind alley on the next` },
    29: { a: ['D'], vi: `Đoạn 6: đề xuất của Lakatos "surrenders the thing that made Popper's test attractive, for the verdict can be delivered **only with hindsight**" ⇒ chỉ phán được SAU khi việc đã rồi ⇒ **D** ("after the event" = "with hindsight"). Loại B: Lakatos chính là người tính tới lịch sử (đánh giá cả chương trình theo thời gian).`, ev: `for the verdict can be delivered only with hindsight` },
    30: { a: ['A'], vi: `Đoạn cuối: chiêm tinh thất bại "though not for the reason usually given. Its claims can be tested; many of them have been, and they did not survive. It fails because its practitioners **carried on exactly as before**" ⇒ người hành nghề phớt lờ kết quả bất lợi ⇒ **A**. Bẫy B là "lý do thường được nêu" mà tác giả BÁC ("Its claims can be tested"); C không được nói; D: việc công bố phương pháp là một câu hỏi chung, không phải kết luận về chiêm tinh.`, ev: `It fails because its practitioners carried on exactly as before.` },
    31: { a: ['YES'], vi: `Đoạn 1: câu hỏi này không chỉ của triết gia — "Judges must decide what may be taught…, governments which research to pay for, and patients which treatments to trust" ⇒ có hệ quả thực tế ⇒ **YES**. 📘 Ôn YNNG: Tập 4 Ngày 5; Tập 5 Ngày 9 sẽ mổ lại nhóm câu này.`, ev: `Nor is it of interest to philosophers alone.` },
    32: { a: ['NO'], vi: `Đoạn 3: "I suspect… that its popularity owes **more to its convenience than to its accuracy**" ⇒ nổi tiếng vì TIỆN, không phải vì đúng ⇒ trái với "mainly because it describes accurately what scientists do" ⇒ **NO**. Bẫy: chữ "accuracy / accurately" xuất hiện ở cả hai nơi — đọc cho hết cấu trúc "more to X than to Y".`, ev: `its popularity owes more to its convenience than to its accuracy` },
    33: { a: ['NOT GIVEN'], vi: `Đoạn 3 chỉ kể thẩm phán năm 1982 "listed it among the essential characteristics of science" — tác giả chê tiêu chí của Popper, nhưng KHÔNG nói phán quyết đúng hay sai (thậm chí không nói phán quyết là gì) ⇒ **NOT GIVEN**. Đừng suy "tiêu chí sai ⇒ phán quyết sai".`, ev: `listed it among the essential characteristics of science` },
    34: { a: ['NO'], vi: `Đoạn 4: không nhà thiên văn nào kết luận Newton bị bác, "and **it would have been absurd to do so**, given how much the theory had already explained" ⇒ giữ thuyết Newton là HỢP LÝ ⇒ trái với "unreasonable" ⇒ **NO**. Phủ định kép: absurd to reject = reasonable to keep.`, ev: `No astronomer drew that conclusion, and it would have been absurd to do so, given how much the theory had already explained.` },
    35: { a: ['NOT GIVEN'], vi: `Đoạn 5 chỉ nói Kuhn có "study of scientific change" xuất bản 1962 — KHÔNG so độ sâu nghiên cứu lịch sử của Kuhn với Popper ⇒ **NOT GIVEN**. Kiến thức ngoài bài (Kuhn là nhà sử học khoa học) không được dùng.`, ev: `Thomas Kuhn, whose study of scientific change appeared in 1962` },
    36: { a: ['YES'], vi: `Đoạn 7: "That no sharp boundary exists does not mean that there is no difference: there is no instant at which day turns into night, but noon is not midnight." ⇒ khớp ⇒ **YES**. Câu đề khái quát hoá ("two things") điều tác giả nói về khoa học / nguỵ khoa học qua ví dụ ngày – đêm.`, ev: `That no sharp boundary exists does not mean that there is no difference` },
    37: { a: ['A'], vi: `Đoạn 2: "A theory that forbids nothing… **tells us nothing**" — "compatible with every possible observation" = "forbids nothing"; "gives us no information" = "tells us nothing" ⇒ **A**. 📘 Ôn sentence endings: Tập 4 Ngày 15.`, ev: `A theory that forbids nothing, he reasoned, tells us nothing` },
    38: { a: ['D'], vi: `Đoạn 5: "when the prediction fails, the failure announces that something is wrong **without saying what**" ⇒ không chỉ ra giả định nào sai ⇒ **D**. Bẫy C ("bị bỏ ngay"): chính là điều lịch sử cho thấy KHÔNG xảy ra.`, ev: `when the prediction fails, the failure announces that something is wrong without saying what` },
    39: { a: ['B'], vi: `Đoạn 5 (Kuhn): "a discipline whose members were for ever challenging its foundations **would never get anywhere**" ⇒ không tiến được ⇒ **B**. "field" = "discipline"; "basic principles" = "foundations"; "constantly questioned" = "for ever challenging".`, ev: `a discipline whose members were for ever challenging its foundations would never get anywhere` },
    40: { a: ['F'], vi: `Đoạn 6: "Lakatos himself conceded that a degenerating programme **might one day recover**" ⇒ chương trình đang suy thoái vẫn có thể thành công trở lại ⇒ **F**. "in decline" = "degenerating". Bẫy E ("một đặc điểm cốt lõi"): là điều Laudan PHỦ NHẬN ở đoạn 7.`, ev: `Lakatos himself conceded that a degenerating programme might one day recover` },
  },
};
