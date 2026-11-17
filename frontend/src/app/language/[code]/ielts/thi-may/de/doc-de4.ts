/**
 * Đề 4 — Academic Reading, GIỮA TẬP 3 (docs/ielts-lo-trinh-0-8.md mục 4.2 · sau Tập 3 Ngày 15). TỰ SOẠN 18/11/2026.
 * Mức band 5.5 — khó hơn Đề 3 một bậc: câu dài hơn, từ vựng B1+ → B2 (convicted, debris, fragments, plentiful, casting…),
 * paraphrase đổi loại từ + đổi cấu trúc + vài ý phải suy ra; Passage 3 là bài LẬP LUẬN (~850 từ) có quan điểm tác giả.
 * Thể loại theo mục 4.2: Tội phạm · Khoa học vũ trụ · Lịch sử. Dạng câu — ưu tiên dạng Tập 3 vừa dạy (N3 TFNG 3 · N5 Headings 2 ·
 * N7 Short answer 2 · N9 Summary hộp từ 2 · N11 MCQ 2 · N13 chọn TWO · N15 Table completion 2 + Short answer):
 *   Passage 1 (tội phạm — lịch sử dấu vân tay):      TFNG · Table completion · Short answer
 *   Passage 2 (vũ trụ — rác không gian):             Matching headings (7 đoạn, 9 tiêu đề) · Summary (hộp từ) · chọn TWO
 *   Passage 3 (lịch sử — máy in của Gutenberg):      YNNG · Matching sentence endings · MCQ (4 lựa chọn)
 * DỮ KIỆN: viết theo kiến thức phổ thông về ba chủ đề, soạn theo trí nhớ — CHƯA đối chiếu lại nguồn trong phiên này (nên soát
 * trước khi dùng làm tài liệu tham khảo): Bertillon (11 số đo, Paris thập niên 1880); Herschel 1858 ở Ấn Độ; Henry Faulds, thư
 * trên Nature 1880; Galton, "Finger Prints" 1892, 1/64 tỉ; vụ Francisca Rojas 1892 + Juan Vucetich; Edward Henry, Fingerprint
 * Bureau 1901; Harry Jackson 1902; phiên toà 1905 (hộp tiền); vụ nhận nhầm của FBI năm 2004 (đánh bom Madrid, giam hai tuần).
 * Rác không gian: Sputnik 10/1957; ước tính của ESA (> 30.000 vật > 10 cm, ~1 triệu mảnh 1–10 cm); ~28.000 km/giờ; vết rỗ cửa sổ
 * tàu con thoi 1983; Kessler 1978; Trung Quốc bắn vệ tinh 2007 (> 3.000 mảnh); va chạm 2/2009 trên Siberia (~2.000 mảnh, gần
 * 800 km); ISS tránh hơn 30 lần; thử lưới + lao móc 2018–2019; quy tắc 25 năm → Mỹ 5 năm (2022). In ấn: Bi Sheng ~1040; sách in
 * chữ kim loại ở Triều Tiên 1377; Kinh Thánh Gutenberg ~1455, khoảng 180 bản, giá ≈ ba năm lương thư ký; vụ kiện với người cho vay (Fust, khoảng 1455 — cùng lúc Kinh Thánh in xong);
 * năm 1500 có máy in ở hơn 250 thị trấn; Luther 1517. Passage 3 là bài QUAN ĐIỂM tự viết (không trích tác giả nào).
 * Mỗi đáp án có `ev` = chuỗi NGUYÊN VĂN trong bài + giải thích tiếng Việt (nêu bẫy, trỏ bài ôn).
 */
import type { DeDoc } from './types';

export const DOC_DE4: DeDoc = {
  id: 'doc-de4',
  kyNang: 'doc',
  ten: 'Academic Reading — Đề 4 (giữa Tập 3)',
  boDe: 'Đề 4',
  capDo: 'Band 5.5',
  moTa: 'The mark of the criminal (fingerprints) · Cleaning up the sky (space debris) · The slow revolution (the printing press)',
  phut: 60,
  phan: [
    /* ════════════════ PASSAGE 1 — tội phạm ════════════════ */
    {
      so: 1,
      tieuDe: 'The Mark of the Criminal',
      phuDe: 'How the lines on our fingertips became evidence in court',
      gioiThieu: 'You should spend about 20 minutes on **Questions 1–13**, which are based on Reading Passage 1 below.',
      doan: [
        { s: `For as long as there have been police, there has been the problem of proving who a person really is. In the nineteenth century, a criminal who had been arrested before could simply give a false name, and nobody could be sure of the truth. Photographs helped a little, but faces change, and searching through thousands of pictures took days. In the 1880s, the Paris police adopted a system invented by a clerk named Alphonse Bertillon, in which eleven parts of each prisoner's body, including the head, the left foot and the middle finger, were carefully measured and recorded on a card. The method worked, but it was slow, it required trained staff, and two officers measuring the same man often produced different figures.` },
        { s: `The solution, it turned out, was at the end of everyone's fingers. The fine lines on the fingertips had been noticed long before: in ancient China, people pressed their fingers into clay to seal documents. But the idea of using these marks to identify individuals appeared only in the nineteenth century. In 1858, William Herschel, a British official working in India, asked a local businessman to press his hand in ink onto a contract. Herschel's aim was simply to frighten the man out of denying his signature later. Over the following years, however, he collected many prints, including his own, and noticed that they did not change as a person grew older.` },
        { s: `The first person to suggest that fingerprints might catch criminals was Henry Faulds, a Scottish doctor working at a hospital in Tokyo. Faulds became interested when he saw the marks left by potters' fingers on ancient pots. In 1880, he published a letter in the scientific journal Nature, proposing that prints left at the scene of a crime could lead the police to the guilty person. He had already tested the idea himself: when the hospital was broken into, he compared the prints left behind with those of a member of staff whom the police had arrested, and showed that the man was innocent. When Faulds returned to Britain, he offered to help the London police set up a fingerprint office. The offer was refused.` },
        { s: `What the police needed was proof that no two people shared the same print, and a practical way of searching a large collection. The first was supplied by the scientist Francis Galton. In his book Finger Prints, published in 1892, Galton calculated that the chance of two individuals having identical prints was about one in 64 billion. He also described the basic patterns, known as loops, whorls and arches, that are still used today.` },
        { s: `In the same year, on the other side of the world, fingerprints solved their first murder. In a small town in Argentina, two children were found dead in their home. Their mother, Francisca Rojas, accused a neighbour, who continued to say that he was innocent even after hours of questioning. Then an officer noticed a thumb mark in blood on a door. A piece of the wood was cut out and sent to Juan Vucetich, a police official who had begun collecting prisoners' prints the year before. The mark matched the mother's right thumb. Faced with this evidence, she confessed. Argentina soon became the first country to give up body measurements and rely on fingerprints alone.` },
        { s: `Britain followed. Edward Henry, a senior police officer in India, worked out a system of classification that allowed a single card to be found quickly among many thousands. In 1901, he opened the Fingerprint Bureau at Scotland Yard, the headquarters of the London police. The following year, a burglar named Harry Jackson, who had left his thumb print on a freshly painted window sill, became the first person in Britain to be convicted on fingerprint evidence. In 1905, the method was accepted in a British murder trial for the first time, when two brothers were found guilty after a print was discovered on an empty cash box.` },
        { s: `Today, computers can compare a print with millions of others in seconds, a search that once took trained officers weeks. Yet the final decision is still made by a human expert, and experts can be wrong. In 2004, the FBI wrongly linked an American lawyer to a bombing in Madrid because part of a print from the scene looked very similar to his; he was held for two weeks before the mistake was admitted. Cases like this are rare, but they are a reminder that a fingerprint is evidence to be weighed, not a proof that cannot be questioned.` },
      ],
      nhom: [
        {
          id: 'p1-tfng', tu: 1, den: 6, dang: 'tfng',
          huongDan: 'Do the following statements agree with the information given in Reading Passage 1?\nChoose\n**TRUE** if the statement agrees with the information\n**FALSE** if the statement contradicts the information\n**NOT GIVEN** if there is no information on this',
          cau: [
            { n: 1, s: 'Before fingerprints were used, photographs gave the police a quick way of identifying prisoners.' },
            { n: 2, s: 'Bertillon\'s system depended on measuring different parts of a prisoner\'s body.' },
            { n: 3, s: 'Bertillon was later employed by police forces outside France.' },
            { n: 4, s: 'Herschel first took a handprint in order to identify a criminal.' },
            { n: 5, s: 'Herschel found that a person\'s fingerprints remain the same with age.' },
            { n: 6, s: 'Faulds received payment for the letter that appeared in Nature.' },
          ],
        },
        {
          id: 'p1-table', tu: 7, den: 10, dang: 'table',
          huongDan: 'Complete the table below.\nChoose **ONE WORD AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 1, so: true },
          tieuDe: 'Steps towards fingerprint evidence',
          bang: {
            dau: ['Year', 'Person', 'Country', 'Contribution'],
            hang: [
              ['1880', 'Henry Faulds', 'Japan', 'proposed using prints found where a crime took place; first noticed finger marks on old [[7]]'],
              ['1892', 'Francis Galton', 'Britain', 'wrote a [[8]] showing how unlikely it was for two people to have the same print'],
              ['1892', 'Juan Vucetich', 'Argentina', 'identified a murderer from a mark left on a [[9]]'],
              ['[[10]]', 'Edward Henry', 'Britain', 'started a fingerprint office for the London police'],
            ],
          },
        },
        {
          id: 'p1-short', tu: 11, den: 13, dang: 'short',
          huongDan: 'Answer the questions below.\nChoose **NO MORE THAN TWO WORDS AND/OR A NUMBER** from the passage for each answer.',
          gioiHan: { tu: 2, so: true },
          dong: [
            'On which part of a building did Harry Jackson leave a print? [[11]]',
            'What object carried the print that was used as evidence in the 1905 trial? [[12]]',
            'For how long was an American lawyer kept by the authorities in 2004? [[13]]',
          ],
        },
      ],
    },

    /* ════════════════ PASSAGE 2 — khoa học vũ trụ ════════════════ */
    {
      so: 2,
      tieuDe: 'Cleaning Up the Sky',
      phuDe: 'Sixty years of space flight have left a cloud of rubbish around the Earth. Can anything be done about it?',
      gioiThieu: 'You should spend about 20 minutes on **Questions 14–26**, which are based on Reading Passage 2 below.',
      doan: [
        { nhan: 'A', s: `When the Soviet Union launched Sputnik 1 in October 1957, the space around the Earth was empty. It is not empty now. Every rocket that has left the ground since then has left something behind: empty fuel tanks, dead satellites, bolts, lens covers, even a glove dropped by an astronaut. The European Space Agency estimates that more than 30,000 objects larger than ten centimetres are now circling the planet, together with about a million pieces between one and ten centimetres across. Only a small part of this cloud consists of working satellites. The rest is rubbish.` },
        { nhan: 'B', s: `It might seem that a piece of metal the size of a coin could do little harm. The danger lies in its speed. Objects in low orbit travel at about 28,000 kilometres an hour, roughly ten times faster than a bullet. At that speed, a collision with something no bigger than a cherry can destroy a satellite, and even smaller things matter. In 1983, the crew of an American space shuttle found a small pit in one of their windows. It had been made by a flake of paint. The window had to be replaced.` },
        { nhan: 'C', s: `The scientist who first understood where this could lead was Donald Kessler, who worked for NASA. In 1978, he pointed out that when two objects in orbit collide, they do not simply disappear: they break into hundreds of smaller pieces, each of which can hit something else. If there were enough objects in orbit, Kessler argued, one crash would cause another, and that would cause more, until some regions of space became too dangerous to use. Nobody would need to launch anything new for the process to continue. At the time, few people took much notice.` },
        { nhan: 'D', s: `Three decades later, his prediction began to look uncomfortably accurate. In 2007, China tested a weapon by firing a missile at one of its own old weather satellites. The test succeeded, and created more than 3,000 pieces large enough to be followed from the ground, the largest amount of debris ever produced by a single event. Then, in February 2009, an American communications satellite that was still in use ran into a Russian military satellite that had stopped working years before. The crash took place almost 800 kilometres above Siberia and produced around 2,000 large fragments. It was the first time that two complete satellites had hit each other, and the company operating the working satellite had received no warning that it was about to happen.` },
        { nhan: 'E', s: `For the moment, the main defence is to watch. Radar stations on the ground follow every object larger than about ten centimetres and calculate where each one is going. When a piece of debris is expected to pass too close, the operators of a satellite are told, and they can fire its engines and move it out of the way. The International Space Station has had to do this more than thirty times. On a few occasions, the warning has come too late for that, and the astronauts have been ordered to shelter inside the spacecraft that would carry them home. Each of these movements uses fuel, and so shortens the working life of the satellite.` },
        { nhan: 'F', s: `Watching, however, does not make the rubbish go away, and engineers have begun to test ways of collecting it. Some have suggested magnets or lasers. In 2018, a small satellite built by a British-led team was released from the space station to try two simpler ideas. In the first experiment, it threw a net over a small target and caught it. In the second, a few months later, it fired a harpoon into a metal panel. The idea is that a captured object can then be dragged down towards the Earth until it burns up in the atmosphere. Both tests worked, although a real dead satellite, which may be as big as a bus and turning over and over, will be far harder to catch.` },
        { nhan: 'G', s: `Most experts believe that it is cheaper not to create rubbish than to clean it up. For many years, an international guideline has said that a satellite should be brought down within 25 years of finishing its work; in 2022, the United States reduced this to five years for the companies that it licenses. New satellites are increasingly designed to fall back and burn up when their job is done. But the number of launches is rising fast, a single company now operates several thousand satellites, and a guideline is not a law. Above all, nobody has yet agreed who should pay to remove the thousands of dead objects that are already there, many of which were launched by governments or companies that no longer exist.` },
      ],
      nhom: [
        {
          id: 'p2-heading', tu: 14, den: 20, dang: 'heading',
          huongDan: 'Reading Passage 2 has seven paragraphs, **A–G**.\nChoose the correct heading for each paragraph from the list of headings below.\nChoose the correct number, **i–ix**.',
          hop: {
            tieuDe: 'List of Headings',
            ds: [
              { k: 'i', t: 'Experiments in catching rubbish' },
              { k: 'ii', t: 'A warning about a chain reaction' },
              { k: 'iii', t: 'The rising cost of launching satellites' },
              { k: 'iv', t: 'Why size is not what matters' },
              { k: 'v', t: 'Prevention, and a question that remains unanswered' },
              { k: 'vi', t: 'Where the rubbish came from and how much there is' },
              { k: 'vii', t: 'A disagreement between two space agencies' },
              { k: 'viii', t: 'Two events that proved a scientist right' },
              { k: 'ix', t: 'How spacecraft are kept safe at present' },
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
          id: 'p2-summary', tu: 21, den: 24, dang: 'summary-box',
          huongDan: 'Complete the summary using the list of words, **A–H**, below.',
          tieuDe: 'Dealing with space debris',
          dong: [
            'At present, pieces of debris are followed from the Earth by means of [[21]]. If one of them is going to come dangerously near, a spacecraft can change its [[22]], although this reduces the time for which it can remain in use. Engineers are also looking for ways of removing debris. A team led from Britain has successfully caught a target in a [[23]] and hit another with a harpoon. An object that has been captured in this way could then be pulled downwards and destroyed by the heat of the [[24]].',
          ],
          hop: {
            ds: [
              { k: 'A', t: 'atmosphere' }, { k: 'B', t: 'engine' }, { k: 'C', t: 'magnet' }, { k: 'D', t: 'net' },
              { k: 'E', t: 'ocean' }, { k: 'F', t: 'position' }, { k: 'G', t: 'radar' }, { k: 'H', t: 'shape' },
            ],
          },
        },
        {
          id: 'p2-mcq2', tu: 25, den: 26, dang: 'mcq2',
          huongDan: 'Choose **TWO** letters, **A–E**.',
          nhieu: {
            ns: [25, 26],
            s: 'Which TWO of the following statements are true of the collision that took place in 2009?',
            chon: [
              { k: 'A', t: 'It happened above the sea.' },
              { k: 'B', t: 'One of the satellites involved was no longer working.' },
              { k: 'C', t: 'The owners of the satellites knew in advance that it would happen.' },
              { k: 'D', t: 'Nothing like it had happened between two whole satellites before.' },
              { k: 'E', t: 'It created more debris than any earlier event.' },
            ],
          },
        },
      ],
    },

    /* ════════════════ PASSAGE 3 — lịch sử (bài lập luận) ════════════════ */
    {
      so: 3,
      tieuDe: 'The Slow Revolution',
      phuDe: 'The printing press is often said to have changed Europe overnight. The real story is more interesting',
      gioiThieu: 'You should spend about 20 minutes on **Questions 27–40**, which are based on Reading Passage 3 below.',
      doan: [
        { s: `Ask almost anyone to name the most important invention of the last thousand years, and there is a good chance that they will choose the printing press. The usual story is simple and dramatic. Around 1450, in the German city of Mainz, a goldsmith called Johannes Gutenberg found a way to print with movable metal letters. Books, which had been copied slowly by hand, suddenly became cheap and plentiful; knowledge escaped from the control of the Church and the rich; and the modern world was born. It is an attractive story, and parts of it are true. In my view, however, it gives one man and one machine far too much credit, and it hides what actually happened.` },
        { s: `To begin with, Gutenberg did not invent printing. Chinese craftsmen had been printing whole pages from carved wooden blocks for centuries, and a Chinese inventor, Bi Sheng, made movable type from baked clay in about 1040. In Korea, a book was printed with movable metal type in 1377, more than seventy years before Gutenberg's Bible, and it still exists. What Gutenberg achieved was to bring several things together: a method of casting large numbers of identical metal letters, an ink that would stick to metal, and a press adapted from the kind used for making wine. That combination was a real achievement. But it is better described as a brilliant piece of engineering than as an idea that came from nowhere.` },
        { s: `Nor did print make books cheap overnight. Gutenberg's famous Bible, completed in about 1455, was a luxury product. Only around 180 copies were made, and each one cost roughly what a clerk could earn in three years. The project did not even make its inventor rich: at about the time the Bibles were finished, Gutenberg lost a court case against the man who had lent him the money, and with it much of his equipment. For decades afterwards, printers copied the appearance of handwritten books as closely as they could, because that was what customers trusted. Many buyers still paid artists to add coloured decoration by hand.` },
        { s: `It is true that the new technology spread with remarkable speed. By 1500, there were presses in more than 250 European towns, and they had produced millions of books. Yet who was reading them? In most of Europe at that time, probably fewer than one person in ten could read at all. Print did not create a reading public by itself. That took schools, and schools took another three hundred years to reach most children. The people who benefited first were those who could already read: priests, lawyers, merchants and scholars.` },
        { s: `Those who believe in the sudden revolution usually point to the religious conflicts of the sixteenth century. When Martin Luther attacked the practices of the Church in 1517, his words were printed and reprinted, and within a few weeks they were being read all over Germany. Without the press, it is said, his protest would have been forgotten. There is something in this. But the argument forgets that most of Luther's supporters could not read his pamphlets. They heard his ideas in sermons, in songs and in conversations in the marketplace. Print was one voice among many, and it was powerful mainly because it worked together with the spoken word, not because it replaced it.` },
        { s: `Finally, the traditional story suggests that the handwritten book simply disappeared. It did not. For at least two centuries after Gutenberg, people went on copying texts by hand: poems that were meant for a few friends, music, letters of news for wealthy subscribers, and anything that the authorities might not allow a printer to publish. A handwritten copy could be produced quietly, in a single room, without a heavy machine that officials could find and close down. Old technologies seldom vanish when a new one arrives. More often they find a smaller job that they do better.` },
        { s: `None of this means that printing was unimportant. Over the long term, it changed how knowledge was stored and checked. Because hundreds of identical copies of a book existed, scholars in different countries could discuss the same page of the same text and correct each other's mistakes, something that had been almost impossible when every copy was slightly different. Maps, tables of numbers and scientific drawings could be reproduced without the errors that copyists introduced. These were enormous changes. They were also slow ones, and they depended on paper mills, postal services, schools and universities as much as on the press itself.` },
        { s: `Why does it matter how we tell the story? Because we are living through another period in which a new technology is said to be changing everything at once. The history of print suggests that we should be careful with such claims. Great inventions do transform societies, but they rarely do it alone, they rarely do it quickly, and the old ways of doing things usually survive far longer than anyone expects.` },
      ],
      nhom: [
        {
          id: 'p3-ynng', tu: 27, den: 32, dang: 'ynng',
          huongDan: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nChoose\n**YES** if the statement agrees with the claims of the writer\n**NO** if the statement contradicts the claims of the writer\n**NOT GIVEN** if it is impossible to say what the writer thinks about this',
          cau: [
            { n: 27, s: 'The popular account of Gutenberg\'s invention is entirely false.' },
            { n: 28, s: 'Korean printers had learned about movable type from China.' },
            { n: 29, s: 'Gutenberg\'s work should be regarded as an impressive technical accomplishment.' },
            { n: 30, s: 'Early printers wanted their books to look different from handwritten ones.' },
            { n: 31, s: 'Printing spread quickly mainly because town governments supported it.' },
            { n: 32, s: 'The first people to gain from printed books were those who were already literate.' },
          ],
        },
        {
          id: 'p3-ending', tu: 33, den: 36, dang: 'match-ending',
          huongDan: 'Complete each sentence with the correct ending, **A–F**, below.',
          hop: {
            ds: [
              { k: 'A', t: 'disappeared within a few years of the first presses.' },
              { k: 'B', t: 'printed texts long before Gutenberg was born.' },
              { k: 'C', t: 'made a large profit from the sale of books.' },
              { k: 'D', t: 'cost far more than most people could afford.' },
              { k: 'E', t: 'took centuries to reach the majority of children.' },
              { k: 'F', t: 'lost a great deal as a result of a legal dispute.' },
            ],
          },
          cau: [
            { n: 33, s: 'Craftsmen in China' },
            { n: 34, s: 'The Gutenberg Bible' },
            { n: 35, s: 'Gutenberg himself' },
            { n: 36, s: 'Education in schools' },
          ],
        },
        {
          id: 'p3-mcq', tu: 37, den: 40, dang: 'mcq',
          huongDan: 'Choose the correct letter, **A, B, C** or **D**.',
          cau: [
            {
              n: 37, s: 'What is the writer\'s main point about the spread of Luther\'s ideas?',
              chon: [
                { k: 'A', t: 'Printing played no real part in it.' },
                { k: 'B', t: 'It depended on ordinary people learning to read.' },
                { k: 'C', t: 'It would have happened faster without the Church.' },
                { k: 'D', t: 'Print mattered chiefly in combination with speech.' },
              ],
            },
            {
              n: 38, s: 'According to the writer, one reason why people continued to copy texts by hand was that',
              chon: [
                { k: 'A', t: 'printed books were full of mistakes.' },
                { k: 'B', t: 'it was easier to do without being noticed.' },
                { k: 'C', t: 'it cost less than printing a long book.' },
                { k: 'D', t: 'most copyists refused to work for printers.' },
              ],
            },
            {
              n: 39, s: 'What does the writer say about the existence of many identical copies of a book?',
              chon: [
                { k: 'A', t: 'It allowed scholars far apart to work on exactly the same text.' },
                { k: 'B', t: 'It meant that scholars no longer needed to travel.' },
                { k: 'C', t: 'It made maps much cheaper to buy.' },
                { k: 'D', t: 'It reduced the importance of universities.' },
              ],
            },
            {
              n: 40, s: 'Why does the writer believe that the history of printing is relevant today?',
              chon: [
                { k: 'A', t: 'It shows that new technologies usually do harm.' },
                { k: 'B', t: 'It proves that great inventions are soon forgotten.' },
                { k: 'C', t: 'It encourages caution about what is claimed for new technology.' },
                { k: 'D', t: 'It explains why older technologies are superior.' },
              ],
            },
          ],
        },
      ],
    },
  ],

  dapAn: {
    /* ── Passage 1 ── */
    1: { a: ['FALSE'], vi: `Bài: "Photographs helped a little, but faces change, and searching through thousands of pictures took days." — tìm ảnh mất NHIỀU NGÀY ⇒ trái với "a quick way" ⇒ **FALSE**. Bẫy: "helped a little" dễ khiến chọn TRUE nếu không đọc hết câu. 📘 Ôn TFNG: Tập 3 Ngày 3.`, ev: `Photographs helped a little, but faces change, and searching through thousands of pictures took days.` },
    2: { a: ['TRUE'], vi: `"eleven parts of each prisoner's body, including the head, the left foot and the middle finger, were carefully measured and recorded on a card" — "depended on measuring different parts" khớp (đổi bị động → danh động từ) ⇒ **TRUE**.`, ev: `in which eleven parts of each prisoner's body, including the head, the left foot and the middle finger, were carefully measured and recorded on a card` },
    3: { a: ['NOT GIVEN'], vi: `Bài chỉ nói cảnh sát PARIS áp dụng hệ thống của Bertillon và nêu nhược điểm của nó; không có câu nào nói ông sau đó làm việc cho cảnh sát nước khác ⇒ **NOT GIVEN**. Đừng suy diễn từ việc hệ thống "worked".`, ev: `In the 1880s, the Paris police adopted a system invented by a clerk named Alphonse Bertillon` },
    4: { a: ['FALSE'], vi: `"Herschel's aim was simply to frighten the man out of denying his signature later." — mục đích là doạ để người đó không chối chữ ký trên HỢP ĐỒNG, không phải nhận dạng tội phạm ⇒ **FALSE**. Người đầu tiên nghĩ tới việc bắt tội phạm là Faulds (đoạn 3).`, ev: `Herschel's aim was simply to frighten the man out of denying his signature later.` },
    5: { a: ['TRUE'], vi: `"he collected many prints, including his own, and noticed that they did not change as a person grew older" — "remain the same with age" = "did not change as a person grew older" (đổi phủ định → khẳng định) ⇒ **TRUE**.`, ev: `noticed that they did not change as a person grew older` },
    6: { a: ['NOT GIVEN'], vi: `Bài chỉ nói Faulds "published a letter in the scientific journal Nature" — không hề nhắc tiền nhuận bút ⇒ **NOT GIVEN**. Bẫy: câu cuối đoạn có "offer… refused" nhưng đó là lời đề nghị với cảnh sát London, không liên quan.`, ev: `In 1880, he published a letter in the scientific journal Nature` },
    7: { a: ['pots'], vi: `"Faulds became interested when he saw the marks left by potters' fingers on ancient pots." — "old" = "ancient"; "first noticed finger marks" = "saw the marks left by… fingers" ⇒ **pots** (số nhiều). Đừng điền "potters" (thợ gốm — người, không phải vật mang dấu). 📘 Ôn Table completion: Tập 3 Ngày 15.`, ev: `Faulds became interested when he saw the marks left by potters' fingers on ancient pots.` },
    8: { a: ['book'], vi: `"In his book Finger Prints, published in 1892, Galton calculated that the chance of two individuals having identical prints was about one in 64 billion." — "wrote a…" ⇒ **book**; "how unlikely" = "one in 64 billion". Bẫy: "letter" là của Faulds (hàng trên).`, ev: `In his book Finger Prints, published in 1892, Galton calculated that the chance of two individuals having identical prints was about one in 64 billion.` },
    9: { a: ['door'], vi: `"Then an officer noticed a thumb mark in blood on a door. A piece of the wood was cut out and sent to Juan Vucetich" ⇒ **door**. "wood" là chất liệu của mảnh cắt ra, nhưng sau "left on a…" cần vật mang dấu: cánh cửa.`, ev: `Then an officer noticed a thumb mark in blood on a door.` },
    10: { a: ['1901'], vi: `"In 1901, he opened the Fingerprint Bureau at Scotland Yard, the headquarters of the London police." — "started a fingerprint office" = "opened the Fingerprint Bureau" ⇒ **1901**. Bẫy: 1902 (Harry Jackson) và 1905 (phiên toà giết người) đứng ngay sau.`, ev: `In 1901, he opened the Fingerprint Bureau at Scotland Yard, the headquarters of the London police.` },
    11: { a: ['window sill', 'windowsill', 'a window sill'], vi: `"a burglar named Harry Jackson, who had left his thumb print on a freshly painted window sill" ⇒ **window sill** (bệ cửa sổ — hai từ, đúng giới hạn). "freshly painted" là tính chất, không cần chép. 📘 Ôn Short answer: Tập 3 Ngày 7 + 15.`, ev: `who had left his thumb print on a freshly painted window sill` },
    12: { a: ['cash box', 'a cash box', 'cashbox'], vi: `"two brothers were found guilty after a print was discovered on an empty cash box" ⇒ **cash box**. Giới hạn HAI từ ⇒ không viết "an empty cash box" (4 từ — mất điểm dù đúng ý).`, ev: `when two brothers were found guilty after a print was discovered on an empty cash box` },
    13: { a: ['two weeks', '2 weeks'], vi: `"he was held for two weeks before the mistake was admitted" — "kept by the authorities" = "was held" ⇒ **two weeks**. Bẫy: "in seconds" và "weeks" ở đầu đoạn nói về tốc độ tra cứu, không phải thời gian bị giam.`, ev: `he was held for two weeks before the mistake was admitted` },

    /* ── Passage 2 ── */
    14: { a: ['vi'], vi: `Đoạn A: từ Sputnik 1957, mỗi lần phóng đều để lại thứ gì đó (bình nhiên liệu, vệ tinh chết, bu-lông…) = NGUỒN GỐC; ước tính 30.000 vật + một triệu mảnh = SỐ LƯỢNG ⇒ **vi**. Bẫy iii: đoạn có nhắc tên lửa, phóng — nhưng không nói gì về CHI PHÍ. 📘 Ôn Matching headings: Tập 2 Ngày 12, Tập 3 Ngày 5.`, ev: `Every rocket that has left the ground since then has left something behind` },
    15: { a: ['iv'], vi: `Đoạn B: mảnh kim loại cỡ đồng xu tưởng vô hại — "The danger lies in its speed"; một vảy sơn cũng làm rỗ cửa sổ tàu con thoi ⇒ điều quan trọng không phải KÍCH THƯỚC mà là tốc độ ⇒ **iv**. Tiêu đề diễn đạt bằng phủ định ("not what matters") — phải hiểu ý, không dò từ.`, ev: `The danger lies in its speed.` },
    16: { a: ['ii'], vi: `Đoạn C: Kessler (1978) chỉ ra một vụ va chạm sinh ra các mảnh gây vụ khác, rồi vụ khác nữa = phản ứng dây chuyền; "few people took much notice" = lời CẢNH BÁO ⇒ **ii**. Bẫy viii: đoạn này mới là dự đoán, chưa có sự kiện nào chứng minh.`, ev: `one crash would cause another, and that would cause more, until some regions of space became too dangerous to use` },
    17: { a: ['viii'], vi: `Đoạn D mở bằng "his prediction began to look uncomfortably accurate" rồi kể HAI sự kiện (2007 Trung Quốc bắn vệ tinh, 2009 hai vệ tinh đâm nhau) ⇒ "Two events that proved a scientist right" ⇒ **viii**. Bẫy vii: có hai nước (Mỹ, Nga) nhưng không có bất đồng giữa hai cơ quan vũ trụ.`, ev: `Three decades later, his prediction began to look uncomfortably accurate.` },
    18: { a: ['ix'], vi: `Đoạn E: "For the moment, the main defence is to watch" — radar theo dõi, vệ tinh và trạm ISS né tránh, phi hành gia trú ẩn = cách giữ an toàn HIỆN NAY ⇒ **ix** ("at present" = "For the moment").`, ev: `For the moment, the main defence is to watch.` },
    19: { a: ['i'], vi: `Đoạn F: "engineers have begun to test ways of collecting it" — thử lưới, thử lao móc, "Both tests worked" ⇒ **i** ("experiments" = "tests"; "catching" = "collecting / caught").`, ev: `Watching, however, does not make the rubbish go away, and engineers have begun to test ways of collecting it.` },
    20: { a: ['v'], vi: `Đoạn G: "it is cheaper not to create rubbish than to clean it up" + quy tắc 25 năm / 5 năm = PHÒNG NGỪA; câu cuối "nobody has yet agreed who should pay" = câu hỏi CHƯA có lời đáp ⇒ **v**. Bẫy iii: "cheaper", "pay" nói về chi phí DỌN rác, không phải chi phí phóng vệ tinh.`, ev: `Above all, nobody has yet agreed who should pay to remove the thousands of dead objects that are already there` },
    21: { a: ['G'], vi: `"Radar stations on the ground follow every object larger than about ten centimetres" — "followed from the Earth by means of…" ⇒ **G (radar)**. 📘 Ôn Summary có hộp từ: Tập 1 Ngày 14, Tập 3 Ngày 9.`, ev: `Radar stations on the ground follow every object larger than about ten centimetres and calculate where each one is going.` },
    22: { a: ['F'], vi: `"they can fire its engines and move it out of the way" — "move it out of the way" = thay đổi VỊ TRÍ ⇒ **F (position)**. Bẫy B (engine): bài có "fire its engines" nhưng tàu không "change its engine"; H (shape) không được nhắc. Vế sau của câu tóm tắt = "shortens the working life of the satellite".`, ev: `When a piece of debris is expected to pass too close, the operators of a satellite are told, and they can fire its engines and move it out of the way.` },
    23: { a: ['D'], vi: `"In the first experiment, it threw a net over a small target and caught it." ⇒ **D (net)**. Bẫy C (magnet): nam châm mới chỉ được ĐỀ XUẤT ("Some have suggested magnets or lasers"), chưa ai thử.`, ev: `In the first experiment, it threw a net over a small target and caught it.` },
    24: { a: ['A'], vi: `"a captured object can then be dragged down towards the Earth until it burns up in the atmosphere" — "pulled downwards and destroyed by the heat" = "dragged down… burns up" ⇒ **A (atmosphere)**. Bẫy E (ocean): không có chỗ nào nói rơi xuống biển.`, ev: `The idea is that a captured object can then be dragged down towards the Earth until it burns up in the atmosphere.` },
    25: { a: ['B', 'D'], vi: `Hai ý ĐÚNG về vụ 2009 là **B** và **D** (thứ tự nào cũng được). **B**: "a Russian military satellite that had stopped working years before" = một trong hai vệ tinh không còn hoạt động. Loại A: vụ va chạm ở trên Siberia (đất liền), không phải trên biển. 📘 Ôn chọn TWO: Tập 3 Ngày 13.`, ev: `ran into a Russian military satellite that had stopped working years before` },
    26: { a: ['B', 'D'], vi: `**D**: "It was the first time that two complete satellites had hit each other" = chưa từng xảy ra giữa hai vệ tinh nguyên vẹn ("whole" = "complete"). Loại C: công ty vận hành vệ tinh còn hoạt động "had received no warning" — không ai biết trước; loại E: lượng mảnh lớn nhất từ một sự kiện là vụ thử năm 2007 (hơn 3.000 so với khoảng 2.000).`, ev: `It was the first time that two complete satellites had hit each other, and the company operating the working satellite had received no warning that it was about to happen.` },

    /* ── Passage 3 ── */
    27: { a: ['NO'], vi: `Tác giả: "It is an attractive story, and parts of it are true." — một PHẦN là đúng ⇒ trái với "entirely false" ⇒ **NO**. Từ cực đoan "entirely" là dấu hiệu cần kiểm; tác giả chỉ cho rằng câu chuyện đề cao quá mức một người và một cỗ máy. 📘 Ôn YNNG: Tập 2 Ngày 20.`, ev: `It is an attractive story, and parts of it are true.` },
    28: { a: ['NOT GIVEN'], vi: `Bài nêu hai sự kiện riêng: Bi Sheng (Trung Quốc, khoảng 1040) và cuốn sách in chữ kim loại ở Triều Tiên (1377) — KHÔNG nói thợ in Triều Tiên có học từ Trung Quốc hay không ⇒ **NOT GIVEN**. Hai câu đứng cạnh nhau không có nghĩa là có quan hệ nhân quả.`, ev: `In Korea, a book was printed with movable metal type in 1377, more than seventy years before Gutenberg's Bible, and it still exists.` },
    29: { a: ['YES'], vi: `"That combination was a real achievement. But it is better described as a brilliant piece of engineering than as an idea that came from nowhere." — "impressive technical accomplishment" = "a real achievement… a brilliant piece of engineering" ⇒ **YES**. Tác giả hạ vai trò "phát minh" nhưng VẪN khen thành tựu kỹ thuật.`, ev: `But it is better described as a brilliant piece of engineering than as an idea that came from nowhere.` },
    30: { a: ['NO'], vi: `"printers copied the appearance of handwritten books as closely as they could, because that was what customers trusted" — họ cố làm cho GIỐNG, ngược với "look different" ⇒ **NO**.`, ev: `For decades afterwards, printers copied the appearance of handwritten books as closely as they could, because that was what customers trusted.` },
    31: { a: ['NOT GIVEN'], vi: `Tác giả công nhận công nghệ lan nhanh ("spread with remarkable speed", hơn 250 thị trấn năm 1500) nhưng không nêu NGUYÊN NHÂN, càng không nhắc chính quyền thị trấn ⇒ **NOT GIVEN**. Nửa đầu câu hỏi đúng, nửa sau không có trong bài — kiểu bẫy "đúng một nửa".`, ev: `It is true that the new technology spread with remarkable speed.` },
    32: { a: ['YES'], vi: `"The people who benefited first were those who could already read: priests, lawyers, merchants and scholars." — "gain from" = "benefited"; "already literate" = "could already read" ⇒ **YES**.`, ev: `The people who benefited first were those who could already read: priests, lawyers, merchants and scholars.` },
    33: { a: ['B'], vi: `"Chinese craftsmen had been printing whole pages from carved wooden blocks for centuries" (trước Gutenberg) ⇒ **B** "printed texts long before Gutenberg was born". Mọi đoạn kết đều ở quá khứ đơn nên không loại được bằng ngữ pháp — phải dựa vào nội dung. 📘 Ôn Matching sentence endings: Tập 2 Ngày 18.`, ev: `Chinese craftsmen had been printing whole pages from carved wooden blocks for centuries` },
    34: { a: ['D'], vi: `"was a luxury product… each one cost roughly what a clerk could earn in three years" ⇒ **D** "cost far more than most people could afford" (suy ra từ ba năm lương). Bẫy A: thứ bị cho là "biến mất" là sách chép tay — và tác giả nói nó KHÔNG biến mất.`, ev: `Only around 180 copies were made, and each one cost roughly what a clerk could earn in three years.` },
    35: { a: ['F'], vi: `"Gutenberg lost a court case against the man who had lent him the money, and with it much of his equipment" — "a legal dispute" = "a court case"; "lost a great deal" = "much of his equipment" ⇒ **F**. Bẫy C: "The project did not even make its inventor rich" — ngược hẳn với "made a large profit".`, ev: `Gutenberg lost a court case against the man who had lent him the money, and with it much of his equipment` },
    36: { a: ['E'], vi: `"That took schools, and schools took another three hundred years to reach most children." — "centuries" = "three hundred years"; "the majority of children" = "most children" ⇒ **E**.`, ev: `That took schools, and schools took another three hundred years to reach most children.` },
    37: { a: ['D'], vi: `"Print was one voice among many, and it was powerful mainly because it worked together with the spoken word, not because it replaced it." — "chiefly in combination with speech" = "mainly because it worked together with the spoken word" ⇒ **D**. Loại A: tác giả thừa nhận "There is something in this"; loại B: phần lớn người ủng hộ KHÔNG biết đọc; C không được nhắc. 📘 Ôn MCQ: Tập 3 Ngày 11.`, ev: `Print was one voice among many, and it was powerful mainly because it worked together with the spoken word, not because it replaced it.` },
    38: { a: ['B'], vi: `"A handwritten copy could be produced quietly, in a single room, without a heavy machine that officials could find and close down." — "without being noticed" = "quietly… [không có máy để] officials could find" ⇒ **B**. A, C, D: bài không nói sách in nhiều lỗi, không so giá, không nhắc người chép từ chối làm cho thợ in.`, ev: `A handwritten copy could be produced quietly, in a single room, without a heavy machine that officials could find and close down.` },
    39: { a: ['A'], vi: `"Because hundreds of identical copies of a book existed, scholars in different countries could discuss the same page of the same text and correct each other's mistakes" — "far apart" = "in different countries"; "exactly the same text" = "the same page of the same text" ⇒ **A**. Bẫy C: bản đồ được in KHÔNG LỖI, bài không nói rẻ hơn; D ngược: thay đổi còn PHỤ THUỘC vào đại học.`, ev: `Because hundreds of identical copies of a book existed, scholars in different countries could discuss the same page of the same text and correct each other's mistakes` },
    40: { a: ['C'], vi: `"we are living through another period in which a new technology is said to be changing everything at once. The history of print suggests that we should be careful with such claims." — "encourages caution about what is claimed" = "should be careful with such claims" ⇒ **C**. Loại A, D: tác giả không nói công nghệ mới có hại hay công nghệ cũ tốt hơn — chỉ nói cái cũ tồn tại lâu hơn ta tưởng.`, ev: `The history of print suggests that we should be careful with such claims.` },
  },
};
