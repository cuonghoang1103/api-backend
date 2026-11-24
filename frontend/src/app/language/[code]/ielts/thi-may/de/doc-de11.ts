/**
 * Đề 11 — Academic Reading, Tập 5 · Ngày 24 (docs/ielts-lo-trinh-0-8.md mục 4.2). TỰ SOẠN 24/11/2026.
 * Mức band 8.0 — khó hơn Đề 8 một bậc: câu dài nhiều tầng mệnh đề, paraphrase mức 4 ở gần như mọi câu (ý ẩn, đổi cấu trúc + đổi góc
 * nhìn), tiêu đề đoạn trừu tượng không trùng chữ nào với đoạn, mỗi nhóm đều có bẫy "được nhắc nhưng không phải đáp án"; Passage 3 là
 * bài LẬP LUẬN ~960 từ, tác giả ngôi thứ nhất soi lại một ĐỘNG TỪ ("discovered") của lịch sử nghệ thuật, nhượng bộ hai lần rồi mới
 * chốt — người đọc phải tách quan điểm tác giả khỏi quan điểm bị tác giả bác.
 * Thể loại theo mục 4.2: Kinh tế vĩ mô · Thần kinh học · Lịch sử nghệ thuật. 9 dạng:
 *   Passage 1 (kinh tế vĩ mô — cỗ máy nước MONIAC của Bill Phillips):      TFNG · Note completion · Table completion
 *   Passage 2 (thần kinh học — "bản đồ" trong não: place cells, grid cells): Matching information (A–G) · Matching features ·
 *                                                                            Summary (từ trong bài)
 *   Passage 3 (lịch sử nghệ thuật — phối cảnh: phát hiện hay phát minh?):   YNNG · MCQ (4 lựa chọn) · Matching sentence endings
 * BỐN dạng note · table · match-info · summary là bốn dạng Đề 9 + Đề 10 CHƯA dùng ⇒ ba đề liên tiếp 9–10–11 phủ đủ 16 dạng Reading
 * (mục 4.1; test kiểm). Đề 9 và Đề 10 đều đã có Matching headings nên Đề 11 thay bằng Matching information.
 * Nối Tập 5: TFNG band 8 (N3) · note / sentence completion Passage khó (N7) · YNNG (N9) · thể loại khó triết học / kinh tế học (N11) ·
 * matching features / information (N15) · suy luận band 8 & bẫy cuối (N23). Nối Tập 4: sentence endings (N15), summary (N25).
 * KHÔNG trùng đề tài với Đề 0–8 và passage Tập 3–4 (đã grep 24/11: MONIAC, Phillips, hydraulic, place cell, grid cell, hippocamp,
 * Brunelleschi, Alberti, Panofsky = 0 kết quả; "taxi" chỉ có ở hội thoại đời sống).
 * DỮ KIỆN: kiến thức phổ thông, soạn THEO TRÍ NHỚ — CHƯA đối chiếu lại nguồn trong phiên này (nên soát trước khi dùng làm tài liệu
 * tham khảo). MONIAC: A. W. "Bill" Phillips (New Zealand, 1914–1975), học xã hội học ở LSE, trình diễn cỗ máy tháng 11/1949 ở xê-mi-na
 * của LSE, dựng trong ga-ra nhà bà chủ trọ ở Croydon cùng Walter Newlyn, khoảng £400; nước màu = tiền; khoảng 12–14 máy (Cambridge,
 * Oxford, Harvard, Ford, ngân hàng trung ương Guatemala); tên MONIAC đặt ở Mỹ; đường cong Phillips 1958; một máy phục chế ở Cambridge
 * còn chạy. Chỗ đã LÀM MỜ vì không chắc: độ chính xác ("within a few per cent"), nguồn gốc cái mô-tơ ("said to have been salvaged").
 * Bản đồ trong não: Tolman 1948 ("cognitive map"), O'Keefe 1971 (place cells, UCL),
 * May-Britt & Edvard Moser 2005 (grid cells, Trondheim), Nobel 2014; Maguire 2000 (tài xế taxi London), nghiên cứu theo dõi học viên
 * công bố 2011 (79 người, 39 đỗ), tài xế xe buýt 2006; Sea Hero Quest 2016 (hơn 4 triệu người chơi); Spiers 2017 (mô phỏng Soho, 24
 * người). Phối cảnh: Brunelleschi khoảng 1420 (tấm tranh Baptistery, chỉ biết qua tiểu sử viết sau), Alberti 1435; cuộn tranh Trung
 * Hoa thế kỷ XI + lời phê "mái hiên nhìn từ dưới lên" (Thẩm Quát — bài không nêu tên); phần nhận định ở Passage 3 là QUAN ĐIỂM của
 * bài tự viết (gần lập trường Panofsky / Gombrich nhưng không trích ai), không phải tổng thuật trung lập.
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE11: DeDoc = {
  id: 'doc-de11',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 11 (Tập 5 · Ngày 24)',
  boDe: 'Đề 11',
  capDo: 'Band 8.0',
  moTa: 'The economy in a water tank (a hydraulic model of the national economy) · The map inside the head (how the brain knows where it is) · Discovered or devised? (the invention of perspective)',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — Kinh tế vĩ mô: cỗ máy nước của Bill Phillips ════════════════ */
    {
      so: 1,
      tieuDe: 'The Economy in a Water Tank',
      phuDe: 'How an engineer turned student used plumbing to explain the flow of a nation\'s money',
      gioiThieu: 'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      doan: [
        { s: `In November 1949, the members of a seminar at the London School of Economics gathered to watch a demonstration by a man whom few of them knew. Bill Phillips was thirty-five, a mature student from New Zealand who had only just scraped through a degree in sociology, and what he wheeled into the room looked less like a contribution to economics than a piece of plumbing: a frame some two metres high, hung with transparent plastic tanks and pipes, through which pink-coloured water was driven by a motor said to have been salvaged from a wartime bomber. Some of the audience, it was later reported, had come expecting to be amused. Within a year, the inventor had been appointed to the teaching staff.` },
        { s: `Nothing in Phillips's early life had pointed towards a university. Born on a dairy farm in 1914, he left school at fifteen to train as an electrician, and spent several years drifting through Australia, where he worked in a gold mine and hunted crocodiles, before reaching Britain in 1937. During the Second World War he was held for more than three years in a prison camp, where, at considerable risk, he built a radio small enough to be concealed from the guards. When he enrolled at the School after the war, what caught his attention was not his own subject but the new economics of John Maynard Keynes, which treated a nation's income as something that flowed in a circle between households, firms and the state.` },
        { s: `To an engineer, this language of flows and reservoirs was familiar. The economists of the day could describe, with equations, the position in which an economy would eventually settle after, say, a rise in taxation. What they found far more difficult was to show what happened on the way there, since the necessary calculations, performed by hand, were hopelessly slow. Phillips's idea was to let water do the arithmetic. With the help of a friend, the economist Walter Newlyn, he spent the summer of 1949 assembling the machine in a garage belonging to his landlady in Croydon, south of London, at a cost of about £400.` },
        { s: `The principle was simple: water stood for money. At the foot of the machine a pump lifted it to the top, from where it began to fall down a central channel as the nation's income. The first thing to happen to it, as to any income, was that part was drawn off to one side as taxes and held in a tank representing the government, which returned it to the main stream lower down as public spending. A little further on, a second share was diverted into a tank of savings, and re-entered the flow only at the rate at which firms were willing to invest. What remained ran on down the centre as household spending. Near the bottom, some of the stream leaked away to a tank standing for the rest of the world, in payment for imports, while a pipe brought in the money earned by exports. Whatever arrived in the tank at the base was the income available for the next circuit. The operator could alter the rate of tax, or people's willingness to save, by adjusting a series of valves, and the outcome was recorded by a pen which, attached to a float in the lowest tank, traced the changing level of national income on a moving sheet of paper.` },
        { s: `What the machine could do, and equations on a blackboard could not, was to show change as it happened. Open a valve to reduce taxation, and the observer saw the levels in every tank rise and fall, overshoot and settle, over several minutes. Its results were said to agree with the calculated answers to within a few per cent, a degree of precision that was more than adequate at a time when the official statistics themselves were far from exact. It was also, and this was perhaps its greatest value, a superb teaching device. Students who had struggled with the idea that saving and investment are separate decisions, taken by different people, could watch the two flows being regulated by separate valves.` },
        { s: `About a dozen machines were eventually built. Several went to universities, among them Cambridge, Oxford and Harvard; others were bought by a car manufacturer and by the central bank of Guatemala. It was in the United States that the device acquired the name by which it is now known, the MONIAC, apparently in imitation of ENIAC, one of the first electronic computers. The comparison was to prove an unfortunate one. Within a few years, electronic computers could solve the same problems more quickly, more precisely and without the risk of a flood, and one by one the water machines were pushed into storerooms.` },
        { s: `Phillips himself moved on. He became a professor at the School in 1958, the year in which he published the paper for which most economists remember him: a study of almost a century of British records suggesting that when unemployment was low, wages tended to rise more quickly. Yet in one respect the machine has outlived its rivals. Of the handful that survive, one, restored at the University of Cambridge, is still set running for students from time to time, and it still draws a crowd.` },
      ],
      nhom: [
        {
          id: 'p1-tfng', tu: 1, den: 6, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 1, s: 'Phillips had obtained outstanding results in his degree by the time he demonstrated his machine.' },
            { n: 2, s: 'The radio that Phillips built in the prison camp was eventually found by his captors.' },
            { n: 3, s: 'Before the machine existed, economists had no means of working out the final effect of a change in policy.' },
            { n: 4, s: 'Phillips met the whole cost of building the machine out of his own pocket.' },
            { n: 5, s: 'The machine was accurate enough, given the quality of the economic data available in that period.' },
            { n: 6, s: 'The machine was given its present name in America.' },
          ],
        },
        {
          id: 'p1-note', tu: 7, den: 10, dang: 'note',
          huongDan: 'Complete the notes below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'How the machine represented an economy',
          dong: [
            '• water (= money) was raised from the base to the top by a [[7]]',
            '• money collected as [[8]] was held in the government tank and later came back as public spending',
            '• money set aside as [[9]] rejoined the flow only when firms invested it',
            '• money spent on [[10]] drained into a tank representing other countries',
            '• the operator changed conditions by means of valves; a pen drew the level of national income',
          ],
        },
        {
          id: 'p1-table', tu: 11, den: 13, dang: 'table',
          huongDan: 'Complete the table below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Phillips and his machine',
          bang: {
            dau: ['Date', 'Event'],
            hang: [
              ['summer 1949', 'the machine is assembled in a [[11]] in Croydon'],
              ['November 1949', 'the machine is shown to a group of economists in London'],
              ['1950s', 'the machines are gradually replaced by electronic [[12]]'],
              ['1958', 'Phillips is made a [[13]] and publishes his best-known paper'],
            ],
          },
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — Thần kinh học: tấm bản đồ trong đầu ════════════════ */
    {
      so: 2,
      tieuDe: 'The Map Inside the Head',
      phuDe: 'What rats, taxi drivers and a mobile game have revealed about how the brain knows where it is',
      gioiThieu: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: `In the 1940s, the dominant school of American psychology held that an animal finding its way through a maze was merely repeating a chain of movements, each of which had been rewarded in the past. Edward Tolman, working in California, thought otherwise. In one of his experiments, rats that had learned a roundabout route to a food box found the usual path blocked and were offered a choice of new ones; a striking number chose the path that pointed directly at the place where the food lay, which no chain of remembered turns could explain. Tolman concluded, in a paper of 1948, that the animals carried something like a map of their surroundings. The suggestion was received politely and then largely set aside. A map was only a figure of speech as long as nobody could say where in the brain it was kept, or what it was made of.` },
        { nhan: 'B', s: `The first answer came in 1971 from John O'Keefe, an American working at University College London. Rather than examining what whole animals did, O'Keefe recorded the signals of individual nerve cells while rats wandered freely around a box. In a structure deep in the brain called the hippocampus, he came across cells that behaved in a way nobody had predicted. A given cell stayed almost silent until the rat entered one particular patch of floor, whereupon it fired rapidly; a neighbouring cell responded to a different patch, and a third to another. O'Keefe named them 'place cells', and argued that between them they formed exactly the kind of internal chart that Tolman had imagined. For some years, many of his colleagues remained unconvinced.` },
        { nhan: 'C', s: `A chart of that kind, however, is of limited use without some means of judging distance and direction, and the place cells offered no obvious way of supplying one. The missing element was found in 2005 by May-Britt and Edvard Moser, a Norwegian couple who had spent a short time in O'Keefe's laboratory before setting up their own in Trondheim. Recording from a region next to the hippocampus, they found cells which fired not at one location but at many, and when these locations were plotted on a plan of the floor they turned out to lie at the corners of a lattice of triangles, as regular as the pattern on a sheet of graph paper. These 'grid cells' appear to give the brain a scale against which movement can be measured. In 2014 O'Keefe and the Mosers shared a Nobel Prize.` },
        { nhan: 'D', s: `Whether any of this applied to people was a question taken up by Eleanor Maguire, also in London, who saw that the city possessed an unusual group of experts: the drivers of its black taxis, who must memorise some 25,000 streets before they are licensed. In 2000 Maguire reported that the rear part of the hippocampus was larger in these drivers than in other men, and largest in those who had been driving longest. Sceptics pointed out that people born with a generous hippocampus might simply be the ones drawn to the job. Maguire's team therefore followed 79 trainees, scanning them at the outset, when their brains did not differ from those of other people, and again four years later. The region had grown in the 39 who qualified, but not in those who gave up. Nor had an earlier comparison found any such enlargement in drivers of buses, who cover as many miles but follow fixed routes. There was a cost, too: on certain tests of memory for new visual information, the qualified drivers performed worse than the others.` },
        { nhan: 'E', s: `The same regions are among the first to be damaged in Alzheimer's disease, which may be why losing one's way in familiar surroundings is so often an early symptom, appearing before any obvious loss of memory. The difficulty for doctors has been to know what counts as normal for a person of a given age and background. In 2016 a team including Hugo Spiers, another London researcher, addressed the problem with a mobile game in which players steer a boat through a series of mazes. More than four million people took part, providing a standard against which an individual's performance might one day be assessed long before other signs of the illness appear.` },
        { nhan: 'F', s: `If the hippocampus grows with use, it is natural to wonder what happens when its work is handed to a machine. In a study published in 2017, Spiers asked volunteers lying in a scanner to find their way through a simulation of central London. When they planned routes for themselves, the hippocampus became markedly more active each time they entered a new street, and the more options the street offered, the stronger the response. When they merely followed spoken directions of the kind given by a satellite navigation system, no such activity was seen. It would be rash to conclude from this that such devices do lasting harm. The experiment lasted a matter of hours, and the few studies that have tracked habitual users over several years are too small to settle the matter.` },
        { nhan: 'G', s: `The most intriguing possibility raised by recent work is that the brain's cartography is not confined to physical space at all. It has long been puzzling that the hippocampus should be responsible both for recalling what happened last week and for finding the way home. Some researchers now suspect that these are aspects of a single function: that the machinery which evolved to chart territory was later borrowed to arrange other kinds of knowledge, so that facts, moments in time and even social relationships are stored according to how 'near' or 'far' they lie from one another. The evidence is still thin. But if the idea is right, the everyday habit of speaking of close friends, distant relatives and unfamiliar ground in an argument may be rather more than a metaphor.` },
      ],
      nhom: [
        {
          id: 'p2-info', tu: 14, den: 18, dang: 'match-info',
          huongDan: 'Reading Passage 2 has seven paragraphs, **A–G**.\nWhich paragraph contains the following information?\nWrite the correct letter, **A–G**.',
          hop: { ds: 'ABCDEFG'.split('').map((k) => ({ k, t: `Paragraph ${k}` })) },
          cau: [
            { n: 14, s: 'an account of how a rival explanation for a finding was eliminated' },
            { n: 15, s: 'the suggestion that some everyday expressions may reflect the way knowledge is actually organised' },
            { n: 16, s: 'a result that an explanation based on habit was unable to account for' },
            { n: 17, s: 'a warning against reading too much into a small amount of research' },
            { n: 18, s: 'a change of method that led to an observation nobody had expected' },
          ],
        },
        {
          id: 'p2-feature', tu: 19, den: 22, dang: 'match-feature',
          huongDan: 'Look at the following statements (Questions 19–22) and the list of researchers below.\nMatch each statement with the correct researcher or researchers, **A–E**.\nNB You may use any letter only once.',
          hop: {
            tieuDe: 'List of Researchers',
            ds: [
              { k: 'A', t: 'Edward Tolman' },
              { k: 'B', t: 'John O\'Keefe' },
              { k: 'C', t: 'May-Britt and Edvard Moser' },
              { k: 'D', t: 'Eleanor Maguire' },
              { k: 'E', t: 'Hugo Spiers' },
            ],
          },
          cau: [
            { n: 19, s: 'gathered information from a very large number of members of the public' },
            { n: 20, s: 'inferred the existence of an internal map from behaviour alone' },
            { n: 21, s: 'found that one ability may be gained at the expense of another' },
            { n: 22, s: 'met with scepticism after linking the activity of single cells to an animal\'s position' },
          ],
        },
        {
          id: 'p2-summary', tu: 23, den: 26, dang: 'summary',
          huongDan: 'Complete the summary below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Measuring, and losing, the sense of place',
          dong: [
            'Place cells alone could not tell an animal how far it had travelled. The cells discovered by the Mosers fire at points which form a network of [[23]], and this seems to supply a scale. In people, the regions concerned are damaged early in Alzheimer\'s disease, so that a tendency to get lost may be noticed before any clear decline in [[24]]. To establish what is normal, researchers collected results from a [[25]] played by millions of people. Other work suggests that the hippocampus is less active when people depend on spoken [[26]] than when they plan a route for themselves.',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — Lịch sử nghệ thuật: phối cảnh — phát hiện hay phát minh? (bài lập luận) ════════════════ */
    {
      so: 3,
      tieuDe: 'Discovered or Devised?',
      phuDe: 'Why the usual account of how painters learned to show depth may rest on a misleading word',
      gioiThieu: 'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      doan: [
        { s: `Every schoolchild who has drawn a road narrowing towards the horizon has used a technique which, we are told, was 'discovered' in Florence in the early fifteenth century. The verb deserves more attention than it usually receives. One discovers what was already there: a continent, a planet, a law of nature. To say that linear perspective was discovered is to imply that it is simply the correct way of setting down the visible world on a flat surface, and that painters before the Renaissance, and painters outside Europe, had somehow failed to notice it. I want to argue that this implication is at best a half-truth, and that our understanding of the history of art has been distorted by it.` },
        { s: `The story itself is not in dispute. At some point around 1420, the architect Filippo Brunelleschi painted a small panel showing the Baptistery in Florence as it appeared from the doorway of the cathedral opposite. He made a hole in the panel and invited people to stand on the same spot, look through the hole from the back, and hold up a mirror in front of it; when the mirror was lowered, the real building appeared where its painted reflection had been, and the two were said to be indistinguishable. The panel has not survived, and we know of it only from a biography written some decades after Brunelleschi's death. In 1435 the scholar Leon Battista Alberti set out the rules in writing, describing a picture as an open window through which the subject is seen, and within a generation the method had become part of every ambitious painter's training.` },
        { s: `Notice, however, what the demonstration required. The viewer had to use one eye, to keep it perfectly still, and to place it at a single point fixed in advance by the painter. Under those conditions the geometry is unanswerable: light travels in straight lines, and a picture constructed according to Alberti's rules will deliver to that one eye very nearly the same pattern of light as the scene itself. This is why I call the conventional account a half-truth rather than a falsehood. Perspective is not an arbitrary code like the alphabet, which might have been otherwise in every detail. Those critics who, in the twentieth century, declared it to be nothing more than a local habit of Western painters went too far, and the ease with which people brought up in quite different traditions learn to read a photograph counts heavily against them.` },
        { s: `But nobody, outside Brunelleschi's experiment, has ever looked at the world in that way. We have two eyes, not one; they are never at rest, but jump several times a second from one point of interest to another; and we walk round things. What we call seeing a room is not a single snapshot but something assembled over time out of many glances and a good deal of memory. A perspective picture is faithful to one frozen instant of this process, taken from one position, and it buys that fidelity at a price. Objects at the edges of a wide view are stretched in ways that look wrong unless the spectator stands in exactly the right spot, and a painter who wishes to show what lies behind a wall, or both sides of a face, or what happened next, is simply forbidden to do so.` },
        { s: `Seen in this light, the pictorial systems that perspective displaced look less like failures and more like different choices. A Chinese handscroll of the eleventh century, which was unrolled a little at a time, leads the eye through a landscape much as a walker would pass through it, and has no single viewpoint for the good reason that a journey has none. Indeed, one Chinese critic of that period is recorded as having objected to a painter who showed the eaves of buildings as they appear from below, on the grounds that a picture ought to take in the whole of a scene rather than whatever happens to be visible from one spot. The painters of medieval Europe, for their part, made the most important figure the largest, a system that conveys rank at a glance, which is information of a kind that perspective is incapable of recording. To describe such artists as not yet having learned to draw 'correctly' is to judge them by a purpose that was not theirs.` },
        { s: `Why, then, does perspective strike us as so obviously right? Part of the answer, I suspect, lies in the camera. A lens projects the world onto a flat plate from a single point, exactly as Alberti prescribed, and for nearly two centuries we have been surrounded by its products. It is often said that photography proved the Renaissance painters right. It would be more accurate to say that photography was built on the same assumption, and that it has trained us so thoroughly that we now mistake that assumption for vision itself. It is telling that when painters at the beginning of the twentieth century set out to break the habit, among them the Cubists, who showed an object from several sides at once, the public found the results not merely unfamiliar but 'wrong'.` },
        { s: `None of this is intended to belittle the achievement. To have worked out a consistent geometrical method for one kind of picture was a remarkable intellectual feat, and its consequences reached far beyond painting: there are historians who trace a line from it to the technical drawing on which later engineering depended. My objection is only to the word. Perspective was not found lying in nature, waiting to be noticed; it was devised, for particular purposes, by people who valued one kind of truth, namely what a motionless observer sees at a single moment, above others. To call it an invention is not to deny that it works. It is to remember that it was a choice, and that every choice of this kind leaves something out.` },
      ],
      nhom: [
        {
          id: 'p3-ynng', tu: 27, den: 32, dang: 'ynng',
          huongDan: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nChoose\n**YES** if the statement agrees with the claims of the writer\n**NO** if the statement contradicts the claims of the writer\n**NOT GIVEN** if it is impossible to say what the writer thinks about this',
          cau: [
            { n: 27, s: 'The word \'discovered\' suggests that artists of other periods and places had overlooked something.' },
            { n: 28, s: 'Scholars disagree about whether the events described in the second paragraph took place.' },
            { n: 29, s: 'Alberti was present when Brunelleschi demonstrated his panel.' },
            { n: 30, s: 'Perspective is as much a matter of arbitrary agreement as the alphabet is.' },
            { n: 31, s: 'Photography has made it harder for people to see that perspective rests on an assumption.' },
            { n: 32, s: 'The Cubists were directly influenced by the art of other continents.' },
          ],
        },
        {
          id: 'p3-mcq', tu: 33, den: 36, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            { n: 33, s: 'What point does the writer make about the conditions of Brunelleschi\'s demonstration?', chon: [
              { k: 'A', t: 'They were too elaborate for other painters to reproduce.' },
              { k: 'B', t: 'They reveal that the method holds good only for a viewer who is restricted in specific ways.' },
              { k: 'C', t: 'They suggest that his biographer exaggerated what had happened.' },
              { k: 'D', t: 'They were made less strict when Alberti wrote down the rules.' },
            ] },
            { n: 34, s: 'The writer refers to the way people learn to read photographs in order to', chon: [
              { k: 'A', t: 'show that photographs are more accurate than paintings.' },
              { k: 'B', t: 'explain how perspective spread beyond Europe.' },
              { k: 'C', t: 'suggest that twentieth-century critics paid too little attention to photography.' },
              { k: 'D', t: 'challenge the claim that perspective is purely a cultural habit.' },
            ] },
            { n: 35, s: 'According to the fourth paragraph, what is the \'price\' paid by a perspective picture?', chon: [
              { k: 'A', t: 'It has to leave out whatever cannot be seen from one place at one moment.' },
              { k: 'B', t: 'It takes far longer to produce than other kinds of picture.' },
              { k: 'C', t: 'It can be appreciated only by viewers who have been trained.' },
              { k: 'D', t: 'It makes distant objects appear smaller than they really are.' },
            ] },
            { n: 36, s: 'What is the writer\'s main purpose in the passage as a whole?', chon: [
              { k: 'A', t: 'to show that the painters of the Renaissance were less original than is generally believed' },
              { k: 'B', t: 'to argue that the painting of other traditions is superior to that of Europe' },
              { k: 'C', t: 'to question a term that misrepresents the nature of an achievement' },
              { k: 'D', t: 'to explain how the rules of perspective were gradually worked out' },
            ] },
          ],
        },
        {
          id: 'p3-ending', tu: 37, den: 40, dang: 'match-ending',
          huongDan: 'Complete each sentence with the correct ending, **A–F**, below.',
          hop: {
            ds: [
              { k: 'A', t: 'conveys the relative importance of the people it shows.' },
              { k: 'B', t: 'has led people to confuse one way of making pictures with sight itself.' },
              { k: 'C', t: 'matches what is actually seen only from one fixed position.' },
              { k: 'D', t: 'presents a scene as it would unfold for somebody on the move.' },
              { k: 'E', t: 'was rejected by critics as soon as it appeared.' },
              { k: 'F', t: 'depends on the viewer\'s knowledge of geometry.' },
            ],
          },
          cau: [
            { n: 37, s: 'A picture constructed according to Alberti\'s rules' },
            { n: 38, s: 'A Chinese handscroll of the eleventh century' },
            { n: 39, s: 'The system used by the painters of medieval Europe' },
            { n: 40, s: 'The camera' },
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['FALSE'], vi: `Bài: Phillips "had only just scraped through a degree in sociology" — "scrape through" = đỗ vừa sát nút ⇒ trái với "outstanding results" ⇒ **FALSE**. Từ band 8 quyết định cả câu là một cụm động từ; không biết "scrape through" thì dễ chọn NOT GIVEN. 📘 Ôn TFNG band 8: Tập 5 Ngày 3.`, ev: `who had only just scraped through a degree in sociology` },
    2: { a: ['NOT GIVEN'], vi: `Bài chỉ nói ông dựng chiếc radio "at considerable risk… small enough to be concealed from the guards" — đủ nhỏ để GIẤU, không nói cuối cùng có bị phát hiện hay không ⇒ **NOT GIVEN**. Bẫy: "risk" + "guards" khiến người đọc tự viết tiếp câu chuyện (chọn FALSE vì "giấu được" — nhưng "đủ nhỏ để giấu" không khẳng định là không bao giờ bị tìm thấy).`, ev: `he built a radio small enough to be concealed from the guards` },
    3: { a: ['FALSE'], vi: `"The economists of the day could describe, with equations, the position in which an economy would eventually settle" — họ TÍNH ĐƯỢC điểm cuối; cái khó là "what happened on the way there" ⇒ câu đề nói "no means of working out the final effect" ⇒ **FALSE**. Bẫy band 8: đề đổi "quãng đường" thành "kết quả cuối" — đúng chủ đề, sai vế.`, ev: `The economists of the day could describe, with equations, the position in which an economy would eventually settle after, say, a rise in taxation.` },
    4: { a: ['NOT GIVEN'], vi: `Bài cho biết chi phí "at a cost of about £400" và Newlyn GIÚP ("With the help of a friend") — nhưng "help" ở đây không nói là giúp tiền hay giúp công, và không nói ai trả ⇒ **NOT GIVEN**. Đừng suy "ga-ra của bà chủ trọ ⇒ ông nghèo ⇒ có người cho vay".`, ev: `at a cost of about £400` },
    5: { a: ['TRUE'], vi: `"a degree of precision that was more than adequate at a time when the official statistics themselves were far from exact" — "more than adequate" = "accurate enough"; "official statistics… far from exact" = "the quality of the economic data available" ⇒ **TRUE**. Paraphrase mức 4: đổi cả hai vế + đổi cấu trúc (mệnh đề thời gian → "given…").`, ev: `a degree of precision that was more than adequate at a time when the official statistics themselves were far from exact` },
    6: { a: ['TRUE'], vi: `"It was in the United States that the device acquired the name by which it is now known, the MONIAC" — câu chẻ nhấn nơi chốn; "acquired the name by which it is now known" = "was given its present name" ⇒ **TRUE**.`, ev: `It was in the United States that the device acquired the name by which it is now known, the MONIAC` },
    7: { a: ['pump'], vi: `"At the foot of the machine a pump lifted it to the top" — "raised from the base to the top by a ___" ⇒ **pump**. Bẫy "motor" (đoạn 1: nước "was driven by a motor"): từ đó nằm ở phần kể chuyện; câu tả đúng việc ĐƯA NƯỚC LÊN ĐỈNH dùng "pump". 📘 Ôn Note / sentence completion ở passage khó: Tập 5 Ngày 7.`, ev: `At the foot of the machine a pump lifted it to the top` },
    8: { a: ['taxes'], vi: `"part was drawn off to one side as taxes and held in a tank representing the government, which returned it to the main stream lower down as public spending" ⇒ **taxes**. Không điền "taxation" (xuất hiện ở đoạn khác, không nằm trong câu tả dòng chảy) hay "tax" (bài viết "the rate of tax" khi nói về van) — đề bắt chép đúng từ của câu chứa thông tin.`, ev: `part was drawn off to one side as taxes and held in a tank representing the government` },
    9: { a: ['savings'], vi: `"a second share was diverted into a tank of savings, and re-entered the flow only at the rate at which firms were willing to invest" — "set aside" = "diverted into a tank of"; "rejoined the flow only when firms invested it" = "re-entered the flow only at the rate…" ⇒ **savings**.`, ev: `a second share was diverted into a tank of savings` },
    10: { a: ['imports'], vi: `"some of the stream leaked away to a tank standing for the rest of the world, in payment for imports" — "drained into a tank representing other countries" = "leaked away to a tank standing for the rest of the world" ⇒ **imports**. Bẫy "exports": dòng chảy NGƯỢC vào ("a pipe brought in the money earned by exports").`, ev: `in payment for imports` },
    11: { a: ['garage'], vi: `"he spent the summer of 1949 assembling the machine in a garage belonging to his landlady in Croydon" ⇒ **garage**. Bẫy "seminar" / "School": nơi TRÌNH DIỄN (hàng dưới của bảng), không phải nơi lắp. 📘 Ôn dạng hoàn thành (note / table) ở passage khó: Tập 5 Ngày 7.`, ev: `assembling the machine in a garage belonging to his landlady in Croydon` },
    12: { a: ['computers'], vi: `"Within a few years, electronic computers could solve the same problems more quickly… and one by one the water machines were pushed into storerooms" ⇒ **computers** (số nhiều — bảng viết "electronic ___"). Mốc "1950s" trong bảng phải SUY từ "Within a few years" sau 1949 — bài không in con số đó ở câu này.`, ev: `Within a few years, electronic computers could solve the same problems more quickly, more precisely and without the risk of a flood` },
    13: { a: ['professor'], vi: `"He became a professor at the School in 1958, the year in which he published the paper for which most economists remember him" — "is made a ___" = "became a"; "best-known paper" = "the paper for which most economists remember him" ⇒ **professor**. Bẫy "teaching staff" (đoạn 1): đó là 1950, và là hai từ.`, ev: `He became a professor at the School in 1958` },

    /* ── Passage 2 ── */
    14: { a: ['D'], vi: `"a rival explanation… eliminated": đoạn D — người hoài nghi cho rằng người có hải mã to sẵn mới theo nghề ("Sceptics pointed out…"); nhóm Maguire "therefore followed 79 trainees", lúc đầu não họ không khác ai, sau bốn năm vùng đó lớn lên ở người đỗ ⇒ loại bỏ cách giải thích kia ⇒ **D**. Paraphrase mức 4: không chữ nào của câu hỏi có trong đoạn. 📘 Ôn Matching information band 8: Tập 5 Ngày 15.`, ev: `Sceptics pointed out that people born with a generous hippocampus might simply be the ones drawn to the job.` },
    15: { a: ['G'], vi: `Đoạn G, câu cuối: nếu giả thuyết đúng thì "the everyday habit of speaking of close friends, distant relatives and unfamiliar ground in an argument may be rather more than a metaphor" ⇒ **G**. "everyday expressions" = "close friends, distant relatives…"; "the way knowledge is actually organised" = "stored according to how 'near' or 'far'".`, ev: `the everyday habit of speaking of close friends, distant relatives and unfamiliar ground in an argument may be rather more than a metaphor` },
    16: { a: ['A'], vi: `Đoạn A: chuột chọn đường chỉ thẳng tới chỗ có thức ăn, "which no chain of remembered turns could explain" — "an explanation based on habit" = thuyết chuỗi động tác được thưởng ⇒ **A**. Bẫy B: đoạn B cũng có kết quả bất ngờ, nhưng không đặt nó đối lập với thuyết thói quen.`, ev: `which no chain of remembered turns could explain` },
    17: { a: ['F'], vi: `Đoạn F: "It would be rash to conclude from this that such devices do lasting harm. The experiment lasted a matter of hours, and the few studies… are too small to settle the matter." ⇒ **F**. Bẫy E: đoạn E cũng nói về cái CHƯA biết (thế nào là bình thường) nhưng không cảnh báo chuyện suy diễn quá đà.`, ev: `It would be rash to conclude from this that such devices do lasting harm.` },
    18: { a: ['B'], vi: `Đoạn B: "Rather than examining what whole animals did, O'Keefe recorded the signals of individual nerve cells" (đổi phương pháp) → "he came across cells that behaved in a way nobody had predicted" ⇒ **B**. Bẫy C: vợ chồng Moser cũng ghi tín hiệu tế bào nhưng đoạn C không nói họ đổi phương pháp. Đáp án cả nhóm: D, G, A, F, B — đoạn C và E không dùng.`, ev: `he came across cells that behaved in a way nobody had predicted` },
    19: { a: ['E'], vi: `Spiers (đoạn E): trò chơi di động — "More than four million people took part" ⇒ **E**. Bẫy D: Maguire có 79 học viên — "trainees", không phải "members of the public", và không "very large". 📘 Ôn Matching features band 8: Tập 5 Ngày 15.`, ev: `More than four million people took part` },
    20: { a: ['A'], vi: `Tolman (đoạn A): chỉ quan sát chuột chọn đường rồi "concluded… that the animals carried something like a map of their surroundings" — không đo gì trong não ⇒ **A** ("from behaviour alone"). Bẫy B: O'Keefe nói về "internal chart" nhưng bằng tín hiệu tế bào, tức KHÔNG chỉ từ hành vi.`, ev: `Tolman concluded, in a paper of 1948, that the animals carried something like a map of their surroundings.` },
    21: { a: ['D'], vi: `Maguire (đoạn D): "There was a cost, too: on certain tests of memory for new visual information, the qualified drivers performed worse than the others" — giỏi tìm đường nhưng kém ở trí nhớ khác ⇒ **D**. Paraphrase mức 4: "gained at the expense of another" = "a cost, too… performed worse".`, ev: `There was a cost, too: on certain tests of memory for new visual information, the qualified drivers performed worse than the others.` },
    22: { a: ['B'], vi: `O'Keefe (đoạn B): mỗi tế bào phóng điện khi chuột vào MỘT khoảng sàn; "For some years, many of his colleagues remained unconvinced." ⇒ **B**. Bẫy A: ý của Tolman cũng bị gác lại ("received politely and then largely set aside") nhưng ông không ghi hoạt động tế bào; chữ C (vợ chồng Moser) là phương án thừa.`, ev: `For some years, many of his colleagues remained unconvinced.` },
    23: { a: ['triangles'], vi: `Đoạn C: các điểm phóng điện "turned out to lie at the corners of a lattice of triangles" — "a network of ___" = "a lattice of" ⇒ **triangles**. Bẫy "graph" / "paper": chỉ là phép so sánh ("as regular as the pattern on a sheet of graph paper"). 📘 Ôn Summary (từ trong bài): Tập 4 Ngày 25.`, ev: `they turned out to lie at the corners of a lattice of triangles` },
    24: { a: ['memory'], vi: `Đoạn E: lạc đường ở nơi quen là triệu chứng sớm, "appearing before any obvious loss of memory" — "clear decline in ___" = "obvious loss of" ⇒ **memory**.`, ev: `appearing before any obvious loss of memory` },
    25: { a: ['game'], vi: `Đoạn E: "a mobile game in which players steer a boat through a series of mazes. More than four million people took part" ⇒ **game**. Tóm tắt viết "a ___ played by millions" — "played" gọi đúng danh từ; không điền "boat" hay "mazes" (chi tiết của trò chơi).`, ev: `a mobile game in which players steer a boat through a series of mazes` },
    26: { a: ['directions'], vi: `Đoạn F: "When they merely followed spoken directions of the kind given by a satellite navigation system, no such activity was seen." ⇒ **directions**. "depend on" = "merely followed"; "plan a route for themselves" = "planned routes for themselves". Bẫy "options": số lối rẽ của con phố — thuộc vế TỰ tìm đường.`, ev: `When they merely followed spoken directions of the kind given by a satellite navigation system, no such activity was seen.` },

    /* ── Passage 3 ── */
    27: { a: ['YES'], vi: `Đoạn 1: nói phối cảnh được "discovered" là hàm ý rằng "painters before the Renaissance, and painters outside Europe, had somehow failed to notice it" ⇒ khớp "artists of other periods and places had overlooked something" ⇒ **YES**. Lưu ý: tác giả KHÔNG đồng ý với hàm ý ấy, nhưng câu đề chỉ hỏi chữ đó GỢI ra điều gì — đúng như tác giả nói. 📘 Ôn YNNG band 8: Tập 5 Ngày 9.`, ev: `painters before the Renaissance, and painters outside Europe, had somehow failed to notice it` },
    28: { a: ['NO'], vi: `Câu mở đoạn 2: "The story itself is not in dispute." ⇒ trái với "Scholars disagree" ⇒ **NO**. Bẫy: chi tiết "we know of it only from a biography written some decades after" dễ khiến bạn nghĩ câu chuyện bị nghi ngờ — tác giả nêu nguồn mỏng nhưng vẫn khẳng định không ai tranh cãi.`, ev: `The story itself is not in dispute.` },
    29: { a: ['NOT GIVEN'], vi: `Bài chỉ nói năm 1435 Alberti "set out the rules in writing" — không có thông tin ông có mặt ở buổi trình diễn của Brunelleschi hay không ⇒ **NOT GIVEN**. Hai tên đứng gần nhau trong một đoạn không có nghĩa là hai người gặp nhau.`, ev: `In 1435 the scholar Leon Battista Alberti set out the rules in writing` },
    30: { a: ['NO'], vi: `"Perspective is not an arbitrary code like the alphabet, which might have been otherwise in every detail." ⇒ tác giả bác thẳng ⇒ **NO**. Đây là phần NHƯỢNG BỘ của bài (phối cảnh có cơ sở hình học) — người đọc lướt, chỉ nhớ luận điểm chính "phối cảnh là phát minh", sẽ chọn nhầm YES. 📘 Ôn suy luận band 8 & bẫy cuối: Tập 5 Ngày 23.`, ev: `Perspective is not an arbitrary code like the alphabet, which might have been otherwise in every detail.` },
    31: { a: ['YES'], vi: `Đoạn 6: nhiếp ảnh "has trained us so thoroughly that we now mistake that assumption for vision itself" — ta lầm giả định với chính sự nhìn ⇒ khó nhận ra đó là giả định ⇒ **YES**. Paraphrase mức 4 (ý ẩn): bài không có chữ "harder" hay "recognise".`, ev: `it has trained us so thoroughly that we now mistake that assumption for vision itself` },
    32: { a: ['NOT GIVEN'], vi: `Bài chỉ nói phái Lập thể "showed an object from several sides at once" và công chúng thấy "wrong" — không nói họ chịu ảnh hưởng từ nghệ thuật châu lục khác ⇒ **NOT GIVEN**. Bẫy kiến thức ngoài bài: ngoài đời điều này có thể đúng, nhưng YNNG chỉ chấm theo điều TÁC GIẢ viết.`, ev: `among them the Cubists, who showed an object from several sides at once` },
    33: { a: ['B'], vi: `Đoạn 3: người xem phải dùng MỘT mắt, giữ yên, đặt đúng MỘT điểm; "Under those conditions the geometry is unanswerable" ⇒ phương pháp chỉ đúng với người xem bị ràng buộc như thế ⇒ **B**. A, D không được nói; C lấy chi tiết tiểu sử ở đoạn 2 nhưng tác giả không hề nghi người viết tiểu sử. 📘 Ôn MCQ Passage 3: Tập 4 Ngày 7; thể loại khó: Tập 5 Ngày 11.`, ev: `The viewer had to use one eye, to keep it perfectly still, and to place it at a single point fixed in advance by the painter.` },
    34: { a: ['D'], vi: `"Those critics who… declared it to be nothing more than a local habit of Western painters went too far, and the ease with which people brought up in quite different traditions learn to read a photograph counts heavily against them." — việc đọc ảnh là BẰNG CHỨNG chống lại các nhà phê bình đó ⇒ **D**. Câu hỏi "in order to" hỏi CHỨC NĂNG của chi tiết: A, B là điều chi tiết có thể gợi ra nhưng tác giả không dùng nó để nói thế.`, ev: `the ease with which people brought up in quite different traditions learn to read a photograph counts heavily against them` },
    35: { a: ['A'], vi: `Đoạn 4: tranh phối cảnh trung thành với "one frozen instant… taken from one position, and it buys that fidelity at a price"; cái giá: hoạ sĩ muốn vẽ thứ sau bức tường, hai bên khuôn mặt, chuyện xảy ra tiếp theo "is simply forbidden to do so" ⇒ **A**. D là hiện tượng của phối cảnh nhưng tác giả không gọi đó là cái giá; B, C không có trong bài.`, ev: `a painter who wishes to show what lies behind a wall, or both sides of a face, or what happened next, is simply forbidden to do so` },
    36: { a: ['C'], vi: `Mở bài: "The verb deserves more attention"; kết bài: "My objection is only to the word." — cả bài soi lại chữ "discovered" ⇒ **C** (question a term that misrepresents the nature of an achievement). A sai: "None of this is intended to belittle the achievement"; B sai: tác giả chỉ nói các hệ khác là "different choices", không nói hơn; D là nội dung một đoạn, không phải mục đích cả bài.`, ev: `My objection is only to the word.` },
    37: { a: ['C'], vi: `Đoạn 3: người xem phải dùng một mắt, đứng yên, ở đúng một điểm; khi đó tranh dựng theo luật Alberti "will deliver to that one eye very nearly the same pattern of light as the scene itself" ⇒ **C** (chỉ khớp với cái thấy từ MỘT vị trí cố định). Bẫy F: bài nói hình học "is unanswerable", không nói người xem phải BIẾT hình học. 📘 Ôn Matching sentence endings: Tập 4 Ngày 15.`, ev: `a picture constructed according to Alberti's rules will deliver to that one eye very nearly the same pattern of light as the scene itself` },
    38: { a: ['D'], vi: `Đoạn 5: cuộn tranh "leads the eye through a landscape much as a walker would pass through it, and has no single viewpoint for the good reason that a journey has none" ⇒ **D** ("as it would unfold for somebody on the move" — "unfold" còn gợi việc MỞ cuộn tranh từng chút).`, ev: `leads the eye through a landscape much as a walker would pass through it` },
    39: { a: ['A'], vi: `Đoạn 5: hoạ sĩ trung cổ "made the most important figure the largest, a system that conveys rank at a glance" — "rank" = "relative importance" ⇒ **A**. Đừng chọn theo cảm giác "tranh trung cổ = sai phối cảnh": tác giả nói đó là một hệ thống có MỤC ĐÍCH riêng.`, ev: `made the most important figure the largest, a system that conveys rank at a glance` },
    40: { a: ['B'], vi: `Đoạn 6: nhiếp ảnh "was built on the same assumption, and… has trained us so thoroughly that we now mistake that assumption for vision itself" ⇒ **B** ("confuse one way of making pictures with sight itself"). Bẫy E: thứ bị công chúng chê "wrong" là tranh Lập thể, không phải máy ảnh. Đáp án cả nhóm: C, D, A, B — E và F thừa.`, ev: `It would be more accurate to say that photography was built on the same assumption` },
  },
};
