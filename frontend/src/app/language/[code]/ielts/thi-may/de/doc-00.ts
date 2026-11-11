/**
 * Đề 0 — Reading của TEST ĐẦU VÀO (docs/ielts-lo-trinh-0-8.md mục 4.3). TỰ SOẠN 12/11/2026.
 * Bậc thang độ khó: Passage 1 (~600 từ, band 4–5: Sentence · Table · TFNG) · Passage 2 (~800 từ, band 6:
 * Headings · Matching information · Summary) · Passage 3 (~900 từ, band 7–8: YNNG · MCQ hai đáp án · MCQ · Matching endings).
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài (tô sáng khi xem lại) + giải thích tiếng Việt.
 */
import type { DeDoc } from './types';

export const DOC_00: DeDoc = {
  id: 'doc-00',
  kyNang: 'doc',
  ten: 'Placement Test — Academic Reading',
  boDe: 'CuongThai Placement Test',
  capDo: 'Band 4.0 → 8.0 (bậc thang)',
  moTa: 'A short history of the pencil · The return of the night train · Is handwriting worth saving?',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — band 4–5 ════════════════ */
    {
      so: 1,
      tieuDe: 'A Short History of the Pencil',
      phuDe: 'How a lump of black rock found under a fallen tree became the most common writing tool on Earth',
      gioiThieu: 'You should spend about 17 minutes on **Questions 1–13**, which are based on Reading Passage 1 below.',
      doan: [
        { s: 'Few objects are as familiar, or as little noticed, as the pencil. It costs almost nothing, needs no power and works upside down, under water and in freezing cold, which is why astronauts, divers and mountaineers still carry one. Yet the pencil in your drawer is the product of more than four centuries of trial, error and competition between nations.' },
        { s: 'The story begins in the north of England in the 1560s. According to local tradition, a violent storm uprooted trees on a hillside near the village of Borrowdale, and underneath them farmers found a deposit of a soft, black mineral. They quickly discovered that it left a dark mark on anything it touched and began using it to label their sheep. The material was graphite, although at the time people believed it was a form of lead, which is why we still speak of pencil "lead" today. The Borrowdale deposit was unusually pure, and for about two hundred years it was the only large source of solid graphite in the world. It became so valuable that the mine was guarded, and smuggling graphite out of the area was made a serious crime.' },
        { s: 'Early pencils were simply sticks of graphite wrapped in string or sheepskin to keep the user\'s fingers clean. Later, craftsmen in Italy and Germany learned to cut the mineral into thin strips and glue them between two pieces of wood — the basic design we recognise today. However, pure graphite was expensive and increasingly scarce, and attempts to mix the powder with glue or wax produced pencils that were either too soft or too crumbly to be useful.' },
        { s: 'The breakthrough came in France in 1795. Cut off from English supplies by war, the government asked an engineer and painter named Nicolas-Jacques Conté to find a substitute. Conté mixed powdered graphite with fine clay, pressed the mixture into rods and baked them in a kiln. His method had two great advantages. It used far less graphite, so poorer-quality deposits could be used, and by varying the amount of clay he could control how hard or soft the pencil was. More clay produced a harder, lighter line; more graphite a softer, darker one. The grading system still printed on pencils — from 9H, the hardest, to 9B, the softest, with HB in the middle — is a direct descendant of Conté\'s experiments.' },
        { s: 'Two later additions completed the modern pencil. In 1858 an American stationer, Hymen Lipman, was granted a patent for a pencil with a small rubber eraser fixed into one end. The idea proved enormously popular, although the patent was later cancelled by a court, which ruled that joining two existing products did not count as a new invention. The second addition was colour. In 1889 an Austrian firm displayed a luxury pencil painted bright yellow at the Paris World Fair. At the time the finest graphite came from China, where yellow was associated with royalty, and the company chose the colour to suggest quality. Rival manufacturers copied it, and in the United States yellow remains the standard colour for a pencil more than a century later.' },
        { s: 'Despite the arrival of the ballpoint pen in the 1940s and the computer keyboard a few decades later, the pencil has not disappeared. Around fourteen billion are still produced every year, most of them from cedar wood, which is soft enough to sharpen easily but strong enough not to split. Teachers value pencils because mistakes can be removed; artists and architects value the range of tones a single pencil can produce; and examination boards in many countries still insist on them, because the machines that mark answer sheets read graphite more reliably than ink. For an object that began as a way of marking sheep, it has had a remarkable career.' },
      ],
      nhom: [
        {
          id: 'p1-sentence', tu: 1, den: 5, dang: 'sentence',
          huongDan: 'Complete the sentences below.\nChoose **NO MORE THAN TWO WORDS** from the passage for each answer.',
          gioiHan: { tu: 2 },
          dong: [
            'Farmers near Borrowdale first used graphite to mark their [[1]].',
            'In the sixteenth century, people thought graphite was a kind of [[2]].',
            'Taking graphite out of the Borrowdale area illegally became a [[3]].',
            'The first pencils were covered in string or [[4]] to protect the user\'s hands.',
            'Conté\'s pencils needed much less [[5]] than earlier ones.',
          ],
        },
        {
          id: 'p1-table', tu: 6, den: 9, dang: 'table',
          huongDan: 'Complete the table below.\nChoose **ONE WORD AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Key dates in the history of the pencil',
          bang: {
            dau: ['Date', 'Who / where', 'Development'],
            hang: [
              ['1560s', 'farmers near Borrowdale', 'graphite discovered under fallen [[6]]'],
              ['1795', 'Conté, in France', 'graphite mixed with [[7]] and baked'],
              ['[[8]]', 'Hymen Lipman, USA', 'patent for a pencil with an eraser'],
              ['1889', 'a firm from Austria', 'a luxury pencil painted [[9]], shown at the Paris World Fair'],
            ],
          },
        },
        {
          id: 'p1-tfng', tu: 10, den: 13, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 10, s: 'Early attempts to mix graphite powder with glue produced good pencils.' },
            { n: 11, s: 'Lipman\'s patent was eventually cancelled.' },
            { n: 12, s: 'Cedar is more expensive than other kinds of wood used for pencils.' },
            { n: 13, s: 'Marking machines read graphite more reliably than they read ink.' },
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — band 6 ════════════════ */
    {
      so: 2,
      tieuDe: 'The Return of the Night Train',
      phuDe: 'Written off as a relic twenty years ago, the European sleeper train is filling up again',
      gioiThieu: 'You should spend about 20 minutes on **Questions 14–26**, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: 'For much of the twentieth century, the sleeper train was the natural way to travel long distances across Europe. Passengers boarded in the evening, ate in the dining car, slept in a narrow bunk and woke the next morning in another country. By the 1990s, however, the network was shrinking fast. Budget airlines could carry a passenger from Berlin to Rome for the price of a restaurant meal, and new high-speed day trains made many overnight journeys unnecessary. A trip that had once taken a whole night could now be completed in four or five hours, with a meal and a film thrown in. Railway companies, which found the ageing sleeper carriages expensive to maintain and difficult to fill, withdrew one route after another. In 2016 Germany\'s national operator closed its entire night-train business, and many observers assumed that the sleeper had reached the end of the line.' },
        { nhan: 'B', s: 'Yet within a few years the trend had reversed. The Austrian state railway, which had taken over several of the abandoned German routes, found that demand was far stronger than it had expected, and it began ordering new carriages. Its managers had expected the routes to lose money for years; instead, several were profitable within eighteen months. Private operators appeared in Sweden, the Netherlands and France, and by the early 2020s new or restored overnight services connected Vienna with Paris, Stockholm with Hamburg and Brussels with Berlin. Some routes sold out within hours of tickets going on sale. The night train, dismissed as a relic, had become fashionable.' },
        { nhan: 'C', s: 'The most obvious explanation is concern about climate change. A passenger travelling by train is responsible for a small fraction of the carbon emissions of the same journey by air — according to several estimates, less than one tenth. In Sweden the word "flygskam", or flight shame, entered everyday use to describe the embarrassment some people feel about flying for short trips, and its counterpart "tågskryt", meaning train pride, followed close behind. Surveys in several countries show that younger travellers in particular are willing to spend more time, and sometimes more money, in exchange for a lower-carbon route.' },
        { nhan: 'D', s: 'Environmental guilt alone, however, does not fill a train. Operators have also recognised that the sleeper competes not with a flight but with a flight plus a hotel. A traveller who leaves Paris at nine in the evening and arrives in Vienna at ten the next morning has saved the cost of a night\'s accommodation and lost no working time at all. For business travellers this calculation is attractive, and for tourists the journey itself becomes part of the holiday. Modern carriages reflect this shift: the newest designs offer private compartments with their own showers, individual sleeping pods for solo travellers, and breakfast delivered to the door. Some operators have gone further, offering cinema cars, bars with live music and family compartments that convert into playrooms during the evening. The aim is to make the hours on board feel like a hotel stay rather than a form of transport.' },
        { nhan: 'E', s: 'Running an overnight service is nevertheless far harder than it looks. A sleeper carriage carries perhaps a third as many passengers as a day coach of the same length, and it earns money only once a day, whereas a high-speed train can make several return journeys. Track access charges, which operators pay to use the rails, are calculated per kilometre and fall heavily on long-distance routes. A night train from Vienna to Brussels, for example, covers more than a thousand kilometres, and the fee for every one of them must be recovered from a few hundred sleeping passengers. Perhaps the greatest obstacle is the border. Each country has its own signalling systems, safety rules and electrical standards, so a train crossing three frontiers may need three locomotives and three sets of paperwork. One operator estimated that gaining approval to run a new international route took longer than building the carriages for it.' },
        { nhan: 'F', s: 'Governments have started to respond. The European Union has named rail travel a priority in its plans to cut transport emissions, and several national governments now offer direct subsidies to night-train operators or have promised to reduce access charges. Austria and France have each committed money to new rolling stock, and Sweden has paid an operator to run a service to Hamburg that would otherwise not exist. Progress on harmonising technical standards is slow but steady, and a new generation of locomotives able to run under several different electrical systems is removing one of the oldest barriers. Whether the sleeper can become more than a niche remains uncertain; it will never carry the numbers that budget airlines do. But for a growing minority of travellers, going to sleep in one city and waking up in another has once again become the most civilised way to cross a continent.' },
      ],
      nhom: [
        {
          id: 'p2-heading', tu: 14, den: 19, dang: 'heading',
          huongDan: 'Reading Passage 2 has six paragraphs, **A–F**.\nChoose the correct heading for each paragraph from the list of headings below.\nChoose the correct number, **i–ix**.',
          hop: {
            tieuDe: 'List of Headings',
            ds: [
              { k: 'i', t: 'The decline of a once-popular service' },
              { k: 'ii', t: 'An unexpected revival' },
              { k: 'iii', t: 'The practical difficulties of running trains through the night' },
              { k: 'iv', t: 'Travellers who want to reduce their impact on the planet' },
              { k: 'v', t: 'Official support for the sleeper' },
              { k: 'vi', t: 'The sleeper as an alternative to a flight and a hotel' },
              { k: 'vii', t: 'How airlines responded to the new competition' },
              { k: 'viii', t: 'A new type of carriage designed for business travellers only' },
              { k: 'ix', t: 'Passenger complaints about comfort on board' },
            ],
          },
          cau: [
            { n: 14, s: 'Paragraph A' },
            { n: 15, s: 'Paragraph B' },
            { n: 16, s: 'Paragraph C' },
            { n: 17, s: 'Paragraph D' },
            { n: 18, s: 'Paragraph E' },
            { n: 19, s: 'Paragraph F' },
          ],
        },
        {
          id: 'p2-info', tu: 20, den: 23, dang: 'match-info',
          huongDan: 'Reading Passage 2 has six paragraphs, **A–F**.\nWhich paragraph contains the following information?\nWrite the correct letter, **A–F**.\nNB You may use any letter more than once.',
          hop: { ds: 'ABCDEF'.split('').map((k) => ({ k, t: `Paragraph ${k}` })) },
          cau: [
            { n: 20, s: 'a reference to a new word describing a feeling about air travel' },
            { n: 21, s: 'an example of how quickly tickets for some routes were sold' },
            { n: 22, s: 'a comparison between the capacity of two kinds of railway carriage' },
            { n: 23, s: 'a mention of technology that will help trains cross national borders' },
          ],
        },
        {
          id: 'p2-summary', tu: 24, den: 26, dang: 'summary',
          huongDan: 'Complete the summary below.\nChoose **ONE WORD ONLY** from the passage for each answer.',
          gioiHan: { tu: 1 },
          tieuDe: 'Why night trains struggle to make money',
          dong: [
            'A sleeper carriage carries far fewer passengers than a day coach and completes only one [[24]] a day, while a high-speed train can make several. Operators must also pay charges for using the track, which are worked out per [[25]], so long routes are expensive. Crossing borders is complicated because each country has different rules and standards, meaning that one train might require three [[26]] and three sets of documents.',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — band 7–8 ════════════════ */
    {
      so: 3,
      tieuDe: 'Is Handwriting Worth Saving?',
      phuDe: 'A writer weighs the evidence for keeping the pen in the classroom',
      gioiThieu: 'You should spend about 23 minutes on **Questions 27–40**, which are based on Reading Passage 3 below.',
      doan: [
        { s: 'In 2014, Finland announced that its schools would no longer be required to teach joined-up handwriting, and the news travelled around the world with the speed usually reserved for celebrity scandal. Some commentators mourned the death of a civilised skill; others welcomed the end of a pointless ritual. Both reactions, I think, missed the point. The question is not whether handwriting is beautiful or traditional — it is whether it still does anything that typing cannot. Having spent two years reading the research and watching classrooms, I have come to believe that it does, though not for the reasons its defenders usually give.' },
        { s: 'The sentimental case is the weakest. Letters written by hand are said to carry a warmth that an email lacks; signatures express personality; a nation that cannot read its own old documents has lost touch with its past. There is something in each of these claims, but none of them justifies the hundreds of hours that schools devote to the subject. People managed perfectly well to express affection before literacy was widespread, and the number of adults who read eighteenth-century manuscripts for pleasure has always been tiny. Nor is it obvious that children who learn joined-up writing become more thoughtful correspondents; the warmest letters I have ever received were typed. If nostalgia were the only argument, the keyboard would deserve to win.' },
        { s: 'The practical case is stronger, and it rests on how writing by hand affects the brain. When a child forms a letter with a pencil, several things happen at once: the hand follows a shape, the eye checks the result, and the mind holds the sound the letter represents. Brain-imaging studies of young children show that this combination activates reading networks far more strongly than pressing a key does, and children who learn letters by writing them tend to recognise them faster than those who learn by typing. The advantage appears to persist: in one classroom study, children who had practised letters by hand in their first year were still ahead in reading twelve months later. The movement, it seems, is not a detour on the way to literacy but part of the road.' },
        { s: 'The effect does not stop in early childhood. A series of experiments with university students compared those who took lecture notes by hand with those who typed. The typists recorded more words — in some cases almost twice as many — yet when tested a week later, the handwriters remembered the ideas better. The likely explanation is uncomfortable for anyone who prizes efficiency: because writing by hand is slow, students cannot copy everything, so they are forced to decide what matters and to rephrase it in their own words. The typists, able to keep up with the lecturer, became transcribers rather than thinkers. Slowness, in other words, was doing useful work.' },
        { s: 'Sceptics raise two objections, and they deserve answers. The first is that these findings reflect habit rather than anything fundamental: a generation that grows up typing may learn to summarise on a keyboard just as well. This is possible, but so far the evidence does not support it; later studies that trained students to take fewer, more selective typed notes found that most slipped back into transcribing within minutes. The second objection is about time. Every hour spent perfecting the shape of a lower-case g, the argument runs, is an hour not spent on reading, mathematics or learning to code. Here I have more sympathy. Much of what passes for handwriting instruction is in fact instruction in neatness, and neatness has little to do with learning. A child who can write quickly and read back what she has written has the skill; whether her letters slope at the correct angle is a matter for calligraphers.' },
        { s: 'This points to a sensible middle course. Schools should teach children to write by hand fluently and legibly, because the act of forming letters supports reading and because note-taking by hand supports thinking. They should stop, however, treating elegant joined-up script as a goal in itself, and they should stop penalising children whose writing is untidy but clear. Nor should the keyboard be treated as an enemy. For a child with a physical difficulty that makes writing painful, or for an adult drafting a long report, typing is simply the better tool, and pretending otherwise helps nobody. What matters is that children leave school able to do both, and able to choose between them with some sense of when each is appropriate.' },
        { s: 'There is a final reason to hesitate before abandoning the pen, and it is the one I find hardest to measure and most difficult to dismiss. A handwritten page is a record of a process. Crossings-out, arrows and notes in the margin show how a thought developed, in a way that a clean typed document, with every revision silently erased, cannot. Writers, scientists and designers often say that they think on paper and then record on screen. The novelist who drafts in a notebook and the engineer who sketches before opening a design program are describing the same instinct. Whether this is a genuine cognitive advantage or merely a habit of the current generation, I cannot say. But a society that stopped teaching handwriting would be running an experiment on its children whose results would not be known for decades. Finland, incidentally, did not abolish handwriting at all; it dropped the requirement to teach one particular joined-up style while keeping printed letters. The reports of the pen\'s death, it turned out, were greatly exaggerated.' },
      ],
      nhom: [
        {
          id: 'p3-ynng', tu: 27, den: 32, dang: 'ynng',
          huongDan: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nChoose\n**YES** if the statement agrees with the claims of the writer\n**NO** if the statement contradicts the claims of the writer\n**NOT GIVEN** if it is impossible to say what the writer thinks about this',
          cau: [
            { n: 27, s: 'Most people who reacted to the Finnish decision understood the real issue.' },
            { n: 28, s: 'The emotional arguments for handwriting are the least convincing.' },
            { n: 29, s: 'Fewer official documents require a handwritten signature than in the past.' },
            { n: 30, s: 'Students who type their notes usually record more than those who write by hand.' },
            { n: 31, s: 'Handwriting lessons should focus mainly on producing neat, attractive letters.' },
            { n: 32, s: 'Typing is the more suitable option for some people.' },
          ],
        },
        {
          id: 'p3-mcq2', tu: 33, den: 34, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [33, 34],
            s: 'Which TWO of the following does the writer say about the note-taking experiments?',
            chon: [
              { k: 'A', t: 'The students who typed produced a greater quantity of notes.' },
              { k: 'B', t: 'The handwriters performed better in a test taken some days afterwards.' },
              { k: 'C', t: 'The handwriters were given more time to prepare.' },
              { k: 'D', t: 'The typists understood the lectures better at the time.' },
              { k: 'E', t: 'The experiments were carried out with schoolchildren.' },
            ],
          },
        },
        {
          id: 'p3-mcq', tu: 35, den: 37, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            {
              n: 35, s: 'According to the writer, later studies that trained students to type selective notes showed that',
              chon: [
                { k: 'A', t: 'most students soon returned to copying everything.' },
                { k: 'B', t: 'typing can be as effective as handwriting with practice.' },
                { k: 'C', t: 'students took fewer notes but remembered less.' },
                { k: 'D', t: 'the training was too short to have any effect.' },
              ],
            },
            {
              n: 36, s: 'What is the writer\'s response to the argument about time?',
              chon: [
                { k: 'A', t: 'The writer rejects it completely.' },
                { k: 'B', t: 'The writer partly accepts it.' },
                { k: 'C', t: 'The writer thinks it applies only to older students.' },
                { k: 'D', t: 'The writer says it is based on out-of-date research.' },
              ],
            },
            {
              n: 37, s: 'In the final paragraph, the writer suggests that a handwritten page',
              chon: [
                { k: 'A', t: 'is easier to read than a typed one.' },
                { k: 'B', t: 'shows the stages by which an idea was formed.' },
                { k: 'C', t: 'is always produced faster than a typed document.' },
                { k: 'D', t: 'should be kept as a historical record.' },
              ],
            },
          ],
        },
        {
          id: 'p3-ending', tu: 38, den: 40, dang: 'match-ending',
          huongDan: 'Complete each sentence with the correct ending, **A–F**, below.',
          hop: {
            ds: [
              { k: 'A', t: 'forces students to select and rephrase information.' },
              { k: 'B', t: 'makes children\'s writing neater over time.' },
              { k: 'C', t: 'plays a direct part in learning to read.' },
              { k: 'D', t: 'has been proven to improve examination results.' },
              { k: 'E', t: 'may simply be a habit of the present generation.' },
              { k: 'F', t: 'was the main reason Finland changed its policy.' },
            ],
          },
          cau: [
            { n: 38, s: 'Brain-imaging studies suggest that forming letters by hand' },
            { n: 39, s: 'According to the writer, the slowness of handwriting' },
            { n: 40, s: 'The writer admits that the value of thinking on paper' },
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* Passage 1 */
    1: { a: ['sheep'], vi: 'Bài: "began using it to label their sheep". "mark" = paraphrase của "label" ⇒ **sheep**. Đây là câu band 4: từ khoá gần như nguyên văn, chỉ đổi một động từ.', ev: 'began using it to label their sheep' },
    2: { a: ['lead'], vi: '"people believed it was a form of lead" — "a kind of" = "a form of", "thought" = "believed" ⇒ **lead**. Bẫy: "graphite" là chất thật, nhưng câu hỏi hỏi người ta TƯỞNG là gì.', ev: 'at the time people believed it was a form of lead' },
    3: { a: ['serious crime', 'crime'], vi: '"smuggling graphite out of the area was made a serious crime" — "taking… illegally" = "smuggling" ⇒ **serious crime** (2 từ, đúng giới hạn). Viết "crime" cũng được chấp nhận vì khớp ngữ pháp "became a ___".', ev: 'smuggling graphite out of the area was made a serious crime' },
    4: { a: ['sheepskin'], vi: '"wrapped in string or sheepskin to keep the user\'s fingers clean" — "covered in" = "wrapped in", "protect the user\'s hands" = "keep… fingers clean" ⇒ **sheepskin** (một từ, không tách "sheep skin").', ev: 'wrapped in string or sheepskin to keep the user\'s fingers clean' },
    5: { a: ['graphite'], vi: '"It used far less graphite, so poorer-quality deposits could be used" — "much less" = "far less" ⇒ **graphite**. Đừng điền "clay": Conté dùng NHIỀU đất sét hơn, không phải ít hơn.', ev: 'It used far less graphite' },
    6: { a: ['trees'], vi: 'Bảng: "graphite discovered under fallen ___" ⇒ bài: "a violent storm uprooted trees… underneath them farmers found" ⇒ **trees**. "uprooted" = bị bật gốc = "fallen".', ev: 'a violent storm uprooted trees on a hillside near the village of Borrowdale, and underneath them farmers found a deposit' },
    7: { a: ['clay'], vi: '"Conté mixed powdered graphite with fine clay, pressed the mixture into rods and baked them" ⇒ **clay**. "fine clay" là 2 từ — bảng chỉ cho ONE WORD ⇒ chỉ viết "clay".', ev: 'Conté mixed powdered graphite with fine clay' },
    8: { a: ['1858'], vi: 'Hàng Hymen Lipman + bằng sáng chế bút chì có tẩy ⇒ "In 1858 an American stationer, Hymen Lipman, was granted a patent" ⇒ **1858**. Bẫy: 1889 là năm bút chì màu vàng.', ev: 'In 1858 an American stationer, Hymen Lipman, was granted a patent' },
    9: { a: ['yellow'], vi: '"an Austrian firm displayed a luxury pencil painted bright yellow at the Paris World Fair" ⇒ **yellow**. "bright yellow" là 2 từ, vượt ONE WORD ⇒ chỉ "yellow". ("luxury" đã cho sẵn trong bảng — đừng điền lại.)', ev: 'an Austrian firm displayed a luxury pencil painted bright yellow at the Paris World Fair' },
    10: { a: ['FALSE'], vi: 'Bài nói ngược: trộn bột với keo hay sáp "produced pencils that were either too soft or too crumbly to be useful" ⇒ KHÔNG tốt ⇒ **FALSE**.', ev: 'attempts to mix the powder with glue or wax produced pencils that were either too soft or too crumbly to be useful' },
    11: { a: ['TRUE'], vi: '"the patent was later cancelled by a court" — "eventually" = "later" ⇒ **TRUE**.', ev: 'the patent was later cancelled by a court' },
    12: { a: ['NOT GIVEN'], vi: 'Bài chỉ nói gỗ tuyết tùng (cedar) có tính chất phù hợp: "soft enough to sharpen easily but strong enough not to split" — KHÔNG nói gì về GIÁ, cũng không so với loại gỗ nào khác ⇒ **NOT GIVEN**. Bẫy kinh điển: thấy "cedar" được nhắc là chọn TRUE/FALSE. (Phân biệt: nếu bài viết "cedar is cheaper than other woods" thì câu này mới là FALSE.)', ev: 'most of them from cedar wood, which is soft enough to sharpen easily but strong enough not to split' },
    13: { a: ['TRUE'], vi: '"the machines that mark answer sheets read graphite more reliably than ink" ⇒ **TRUE**. Câu hỏi gần nguyên văn, chỉ đổi "marking machines" ↔ "machines that mark answer sheets".', ev: 'the machines that mark answer sheets read graphite more reliably than ink' },

    /* Passage 2 */
    14: { a: ['i'], vi: 'Đoạn A kể thời hoàng kim rồi "the network was shrinking fast… withdrew one route after another… reached the end of the line" ⇒ sự suy tàn của một dịch vụ từng phổ biến ⇒ **i**.', ev: 'By the 1990s, however, the network was shrinking fast.' },
    15: { a: ['ii'], vi: 'Đoạn B: "Yet within a few years the trend had reversed… demand was far stronger than it had expected" ⇒ hồi sinh bất ngờ ⇒ **ii**.', ev: 'Yet within a few years the trend had reversed.' },
    16: { a: ['iv'], vi: 'Đoạn C: lý do khí hậu, "flight shame", người trẻ chịu tốn thời gian/tiền để đi đường ít carbon ⇒ **iv**. Không có tiêu đề nào về hãng bay phản ứng (vii) — bài không nói.', ev: 'The most obvious explanation is concern about climate change.' },
    17: { a: ['vi'], vi: 'Đoạn D: "the sleeper competes not with a flight but with a flight plus a hotel" ⇒ **vi**. Bẫy viii: đoạn có nói thiết kế toa mới, nhưng cho cả khách du lịch lẫn người đi công tác, không phải "business travellers only".', ev: 'the sleeper competes not with a flight but with a flight plus a hotel' },
    18: { a: ['iii'], vi: 'Đoạn E: "Running an overnight service is nevertheless far harder than it looks" rồi liệt kê khó khăn (sức chứa, phí đường ray, biên giới) ⇒ **iii**.', ev: 'Running an overnight service is nevertheless far harder than it looks.' },
    19: { a: ['v'], vi: 'Đoạn F: "Governments have started to respond… direct subsidies… reduce access charges" ⇒ hỗ trợ của nhà nước ⇒ **v**.', ev: 'Governments have started to respond.' },
    20: { a: ['C'], vi: 'Từ mới chỉ cảm giác về việc bay: "flygskam, or flight shame… the embarrassment some people feel about flying" ⇒ đoạn **C**.', ev: 'the word "flygskam", or flight shame, entered everyday use to describe the embarrassment some people feel about flying for short trips' },
    21: { a: ['B'], vi: '"Some routes sold out within hours of tickets going on sale" ⇒ đoạn **B**.', ev: 'Some routes sold out within hours of tickets going on sale.' },
    22: { a: ['E'], vi: 'So sánh sức chứa hai loại toa: "A sleeper carriage carries perhaps a third as many passengers as a day coach of the same length" ⇒ đoạn **E**.', ev: 'A sleeper carriage carries perhaps a third as many passengers as a day coach of the same length' },
    23: { a: ['F'], vi: 'Công nghệ giúp vượt biên giới: "a new generation of locomotives able to run under several different electrical systems is removing one of the oldest barriers" ⇒ đoạn **F**. Đoạn E chỉ nêu VẤN ĐỀ biên giới, không nêu công nghệ giải quyết.', ev: 'a new generation of locomotives able to run under several different electrical systems is removing one of the oldest barriers' },
    24: { a: ['journey'], vi: '"it earns money only once a day, whereas a high-speed train can make several return journeys" ⇒ toa giường nằm chỉ hoàn thành một **journey** mỗi ngày. Chỗ trống đứng sau "one" ⇒ số ít "journey", không chép "journeys".', ev: 'whereas a high-speed train can make several return journeys' },
    25: { a: ['kilometre', 'kilometer'], vi: '"Track access charges… are calculated per kilometre" — "worked out" = "calculated" ⇒ **kilometre** (chính tả Mỹ "kilometer" được chấp nhận).', ev: 'are calculated per kilometre and fall heavily on long-distance routes' },
    26: { a: ['locomotives'], vi: '"a train crossing three frontiers may need three locomotives and three sets of paperwork" — "documents" = "paperwork" ⇒ **locomotives** (số nhiều, đúng như bài).', ev: 'a train crossing three frontiers may need three locomotives and three sets of paperwork' },

    /* Passage 3 */
    27: { a: ['NO'], vi: 'Người viết: "Both reactions, I think, missed the point" — cả hai phe đều KHÔNG hiểu vấn đề thật ⇒ **NO**.', ev: 'Both reactions, I think, missed the point.' },
    28: { a: ['YES'], vi: '"The sentimental case is the weakest" — "emotional arguments" = "sentimental case", "least convincing" = "weakest" ⇒ **YES**.', ev: 'The sentimental case is the weakest.' },
    29: { a: ['NOT GIVEN'], vi: 'Chữ ký chỉ xuất hiện MỘT lần, trong danh sách lý lẽ "tình cảm" mà người viết thuật lại: "signatures express personality". Bài không nói gì về việc giấy tờ chính thức ngày nay có còn cần chữ ký tay hay không ⇒ **NOT GIVEN**. Bẫy: thấy chữ "signatures" trong bài là chọn YES/NO.', ev: 'signatures express personality' },
    30: { a: ['YES'], vi: '"The typists recorded more words — in some cases almost twice as many" ⇒ **YES**.', ev: 'The typists recorded more words — in some cases almost twice as many' },
    31: { a: ['NO'], vi: 'Người viết phản đối: "stop… treating elegant joined-up script as a goal in itself" và "neatness has little to do with learning" ⇒ **NO**.', ev: 'They should stop, however, treating elegant joined-up script as a goal in itself' },
    32: { a: ['YES'], vi: '"For a child with a physical difficulty… or for an adult drafting a long report, typing is simply the better tool" ⇒ **YES**.', ev: 'typing is simply the better tool, and pretending otherwise helps nobody' },
    33: { a: ['A', 'B'], vi: 'Hai điều bài nói về thí nghiệm: người gõ máy ghi NHIỀU chữ hơn (**A**: "recorded more words") và người viết tay nhớ tốt hơn khi kiểm tra một tuần sau (**B**: "when tested a week later… remembered the ideas better"). Thứ tự không quan trọng.', ev: 'The typists recorded more words' },
    34: { a: ['A', 'B'], vi: 'Như câu 33: **A** và **B**. C sai (không nói ai được thêm thời gian); D sai (bài không nói người gõ hiểu bài hơn lúc đó); E sai (thí nghiệm với "university students", không phải học sinh).', ev: 'when tested a week later, the handwriters remembered the ideas better' },
    35: { a: ['A'], vi: '"later studies that trained students to take fewer, more selective typed notes found that most slipped back into transcribing within minutes" ⇒ phần lớn nhanh chóng quay lại chép hết ⇒ **A**.', ev: 'most slipped back into transcribing within minutes' },
    36: { a: ['B'], vi: 'Với luận điểm về thời gian, người viết nói "Here I have more sympathy" rồi thừa nhận phần lớn giờ dạy viết tay chỉ là dạy nét chữ gọn ⇒ chấp nhận MỘT PHẦN ⇒ **B**. Không bác bỏ hoàn toàn (A), không nói gì về tuổi (C) hay nghiên cứu cũ (D).', ev: 'Here I have more sympathy.' },
    37: { a: ['B'], vi: '"A handwritten page is a record of a process. Crossings-out, arrows and notes in the margin show how a thought developed" ⇒ cho thấy các bước hình thành ý ⇒ **B**.', ev: 'Crossings-out, arrows and notes in the margin show how a thought developed' },
    38: { a: ['C'], vi: 'Nghiên cứu hình ảnh não: viết tay "activates reading networks far more strongly… The movement… is not a detour on the way to literacy but part of the road" ⇒ góp phần trực tiếp vào việc học đọc ⇒ **C**.', ev: 'The movement, it seems, is not a detour on the way to literacy but part of the road.' },
    39: { a: ['A'], vi: '"because writing by hand is slow, students cannot copy everything, so they are forced to decide what matters and to rephrase it in their own words" ⇒ **A**.', ev: 'they are forced to decide what matters and to rephrase it in their own words' },
    40: { a: ['E'], vi: '"Whether this is a genuine cognitive advantage or merely a habit of the current generation, I cannot say" ⇒ người viết THỪA NHẬN có thể chỉ là thói quen thế hệ hiện nay ⇒ **E**. D sai: không có bằng chứng về kết quả thi; F sai: Phần Lan đổi chính sách không vì lý do này.', ev: 'Whether this is a genuine cognitive advantage or merely a habit of the current generation, I cannot say.' },
  },
};
