/**
 * CSI106 · Chương 3 — Data storage & Operations on Data, học theo từng slide:
 * PHẦN A (slide 1–27) — kiểu dữ liệu, lưu trữ SỐ (nguyên & thực), VĂN BẢN, ÂM THANH,
 * và mở đầu phần ẢNH. Deck 'csi3' (CSI3), 54 slide.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_03.pptx của trường (/tmp/csi106-text/csi3.txt,
 * slide 1→27). Các slide chỉ có HÌNH (5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18,
 * 20, 21, 23, 25, 27) đã được đọc thẳng từ ảnh render để lấy đúng từng con số
 * trong vòng tròn tràn số, từng dãy bit và từng ô bảng.
 *
 * MỌI con số dưới đây đã được kiểm lại bằng python3 trước khi viết:
 *   · bù 2 của 00110100 → 11001100 và chiều ngược lại ✓ (int/bin/~ & 0xFF)
 *   · miền 8 bit −128…127, và 10000000 tự bù 2 ra chính nó ✓
 *   · IEEE 754 single: 5.75 → 0 10000001 01110000000000000000000 = 40B80000 ✓
 *     (struct.pack('>f', 5.75).hex()); 0 10000010 10010000000000000000000 → 12,5 ✓
 *     và −7,0234375 → C0E0C000 (dùng cho slide 54 của deck) ✓
 *   · 1920×1080×24 bit = 49.766.400 bit = 6.220.800 B = 6,2208 MB = 5,93 MiB ✓
 *   · CD 44,1 kHz × 16 bit × 2 kênh = 1.411.200 bps = 10,584 MB/phút ✓
 *     ⚠ slide 26 ghi 705.600 bps — đó là MỘT kênh (44100×16), đã nêu rõ trong bài
 *   · UTF-8: "Tiếng Việt" = 10 ký tự nhưng 14 byte; ế/ệ/ữ = 3 byte, à/â/ă/đ = 2 byte ✓
 *   · ASCII: C=67=1000011, A=65=1000001, T=84=1010100, S=83=1010011 ✓ khớp hình slide 20
 *   · 4 bit không dấu: 11+9 = 20 → 20 mod 16 = 4 = 0100 ✓ khớp vòng tròn slide 12
 *   ⚠ slide 17 của trường ghi "23.7 … the integral part is 27" — sai, phải là 23.
 *     Đã nêu rõ trong bài, KHÔNG im lặng chép lại và KHÔNG tự sửa slide.
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi3';

export default {
  title: '3.0a — Slide by slide: Data types, storing numbers, text and audio (slides 1–27)|||3.0a — Slide bài giảng: Kiểu dữ liệu, lưu trữ số, văn bản và âm thanh (slide 1–27)',
  slug: 'csi106-3-0a-slides-luu-tru-du-lieu',
  type: 'DOCUMENT',
  description: 'Nửa đầu chương 3 (slide 1–27) của CSI106, ứng với CLO3: năm kiểu dữ liệu và mẫu bit chung, lưu trữ số nguyên (không dấu, dấu-lượng, bù 2 với bảng chạy tay hai chiều và giải thích vì sao một byte có −128 mà không có +128), lưu trữ số thực bằng dấu chấm động chuẩn IEEE 754 làm trọn hai chiều, rồi lưu trữ văn bản (ASCII 7 bit so với Unicode/UTF-8, đếm byte thật của chuỗi tiếng Việt), âm thanh (lấy mẫu, lượng tử hoá, mã hoá, tốc độ bit) và mở đầu phần ảnh. Mọi phép tính đều đã kiểm lại bằng máy; một chỗ slide gốc ghi sai được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 1, 27),
    walk(D, [

      [1, '3.1 Data storage',
        `<p class="y-chinh">🎯 The title slide of Chapter 3. Chapter 2 taught you how to convert a number between decimal, binary, octal and hexadecimal. Chapter 3 asks the next question: once it is binary, <strong>how does the machine actually keep it</strong> — and how does it keep things that are not numbers at all?</p>
<ul>
<li><strong>Where this chapter sits</strong> — Chapter 1 gave the von Neumann model (memory holds both data and program). Chapter 2 gave the number systems. Chapter 3 fills memory with real content: numbers, text, audio, images, video. Chapter 4 onwards will process what is stored here.</li>
<li><strong>The single idea of the whole chapter</strong> — memory can hold exactly one kind of thing, a string of 0s and 1s. So every data type must be <em>encoded</em> into bits on the way in and <em>decoded</em> on the way out. All five sections of the chapter are just five different encodings.</li>
<li><strong>Why "storage" is a separate topic from "numbers"</strong> — 7 in binary is 111 and that is arithmetic. But storing 7 means choosing a <em>width</em> (8 bits? 32?), a <em>sign convention</em>, and a <em>position for the decimal point</em>. Those three choices are what this chapter is about.</li>
<li><strong>The deck is two chapters glued together</strong> — slides 1–31 are "3.1 Data storage", slides 32–54 are "3.2 Operations on Data". This lesson covers slides 1–27; the second half (logic, shift, arithmetic operations) comes later.</li>
<li><strong>Exam weight</strong> — this is the CLO3 chapter and it is the most calculation-heavy part of CSI106. Expect "store −35 in 8-bit two's complement", "what decimal is this 32-bit pattern", "how many MB is this image".</li>
</ul>
<p class="meo">💡 Hold one sentence for the whole chapter: <em>a bit pattern has no meaning by itself — the meaning comes from the agreement about how to read it</em>. The same byte <code>01000001</code> is 65 to a math routine and the letter A to a text editor. Slide 7 draws exactly that.</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề của chương 3. Chương 2 dạy bạn đổi một con số qua lại giữa thập phân, nhị phân, bát phân, thập lục phân. Chương 3 hỏi câu tiếp theo: khi đã ra nhị phân rồi thì <strong>máy CẤT nó như thế nào</strong> — và cất ra sao những thứ vốn không phải số?</p>
<ul>
<li><strong>Chỗ đứng của chương này</strong> — chương 1 cho mô hình von Neumann (bộ nhớ chứa cả dữ liệu lẫn chương trình). Chương 2 cho các hệ đếm. Chương 3 đổ nội dung thật vào bộ nhớ: số, văn bản, âm thanh, ảnh, video. Từ chương 4 trở đi mới xử lý những thứ được cất ở đây.</li>
<li><strong>Ý duy nhất của cả chương</strong> — bộ nhớ chỉ giữ được đúng một loại thứ: một dãy 0 và 1. Nên mọi kiểu dữ liệu đều phải được <em>mã hoá</em> thành bit lúc vào và <em>giải mã</em> lúc ra. Năm phần của chương chỉ là năm cách mã hoá khác nhau.</li>
<li><strong>Vì sao "lưu trữ" là chuyện khác với "số học"</strong> — 7 trong nhị phân là 111, đó là số học. Nhưng LƯU 7 thì phải chọn <em>bề rộng</em> (8 bit? 32 bit?), chọn <em>quy ước dấu</em>, và chọn <em>chỗ đặt dấu chấm thập phân</em>. Ba lựa chọn đó chính là nội dung chương này.</li>
<li><strong>Deck này là hai chương dán vào nhau</strong> — slide 1–31 là "3.1 Data storage", slide 32–54 là "3.2 Operations on Data". Bài này đi slide 1–27; nửa sau (phép logic, dịch bit, số học) học sau.</li>
<li><strong>Trọng số thi</strong> — đây là chương của CLO3 và là phần nhiều phép tính nhất của CSI106. Đề hay hỏi kiểu "lưu −35 ở bù 2 8 bit", "dãy 32 bit này là số thập phân nào", "ảnh này chiếm bao nhiêu MB".</li>
</ul>
<p class="meo">💡 Giữ một câu cho suốt chương: <em>một mẫu bit tự nó KHÔNG có nghĩa — nghĩa đến từ thoả thuận về cách đọc nó</em>. Cùng một byte <code>01000001</code>, với bộ tính toán là số 65, với trình soạn thảo là chữ A. Slide 7 vẽ đúng điều đó.</p>`],

      [2, 'Content',
        `<p class="y-chinh">🎯 The three sections of the first half of the deck: <strong>3.1 Data types</strong>, <strong>3.2 Storing Numbers</strong>, <strong>3.3 Storing Text, Media, Image, Video</strong>. Slides 1–27 of this lesson walk exactly this list, in order.</p>
<ul>
<li><strong>3.1 Data types</strong> (slides 4–7) — the short part: what kinds of data exist, and the claim that all of them become the same thing inside. Three slides, but it carries the idea the other two sections depend on.</li>
<li><strong>3.2 Storing Numbers</strong> (slides 8–18) — the long, calculation-heavy part. It splits in two: <em>integers</em> (fixed point: unsigned, sign-and-magnitude, two's complement) and <em>reals</em> (floating point).</li>
<li><strong>3.3 Storing Text, Media, Image, Video</strong> (slides 19–31) — four encodings in a row: text by code tables (ASCII, Unicode), audio by sampling + quantization + encoding, images by raster or vector, video as images over time. Slides 1–27 reach as far as the beginning of images.</li>
<li><strong>Why numbers get eleven slides and video gets one</strong> — numbers are the only data type the CPU can do arithmetic on. Text, audio and images are stored and moved, but not computed on directly, so their encodings are simpler.</li>
<li><strong>The hidden fourth part</strong> — compression. The deck mentions it twice (MP3 on slide 26, JPEG on slide 29) and points to Chapter 15 both times. You still need to know the words <em>lossy</em> and <em>lossless</em> for the exam.</li>
</ul>
<p class="meo">💡 Use this slide as a revision checklist: if you can explain, without notes, one sentence per bullet plus one worked example per bullet, the chapter is done. There are only three bullets, so it is a fast self-test.</p>`,
        `<p class="y-chinh">🎯 Ba mục của nửa đầu deck: <strong>3.1 Data types</strong>, <strong>3.2 Storing Numbers</strong>, <strong>3.3 Storing Text, Media, Image, Video</strong>. Slide 1–27 của bài này đi đúng danh sách ấy, đúng thứ tự.</p>
<ul>
<li><strong>3.1 Kiểu dữ liệu</strong> (slide 4–7) — phần ngắn: có những loại dữ liệu nào, và khẳng định rằng tất cả chúng vào bên trong đều hoá thành một thứ giống nhau. Chỉ ba slide, nhưng nó mang cái ý mà hai phần kia dựa vào.</li>
<li><strong>3.2 Lưu trữ số</strong> (slide 8–18) — phần dài, nhiều phép tính nhất. Nó lại tách làm đôi: <em>số nguyên</em> (dấu chấm cố định: không dấu, dấu-lượng, bù 2) và <em>số thực</em> (dấu chấm động).</li>
<li><strong>3.3 Lưu trữ văn bản, ảnh, âm thanh, video</strong> (slide 19–31) — bốn cách mã hoá nối nhau: văn bản bằng bảng mã (ASCII, Unicode), âm thanh bằng lấy mẫu + lượng tử hoá + mã hoá, ảnh bằng raster hoặc vector, video là chuỗi ảnh theo thời gian. Slide 1–27 đi tới đúng chỗ mở đầu phần ảnh.</li>
<li><strong>Vì sao số được mười một slide còn video chỉ một</strong> — số là kiểu dữ liệu DUY NHẤT mà CPU làm được phép tính lên. Văn bản, âm thanh, ảnh thì chỉ cất và chuyển đi, không tính trực tiếp, nên cách mã hoá đơn giản hơn nhiều.</li>
<li><strong>Phần thứ tư bị giấu</strong> — nén dữ liệu. Deck nhắc hai lần (MP3 ở slide 26, JPEG ở slide 29) và cả hai lần đều đẩy sang chương 15. Nhưng đi thi vẫn phải thuộc hai chữ <em>có mất mát</em> và <em>không mất mát</em>.</li>
</ul>
<p class="meo">💡 Dùng slide này làm bảng kiểm ôn tập: nếu bạn nói được, không nhìn tài liệu, một câu cho mỗi gạch đầu dòng cộng một ví dụ đã giải cho mỗi gạch, thì chương này xong. Chỉ có ba gạch nên tự kiểm rất nhanh.</p>`],

      [3, 'Objectives',
        `<p class="y-chinh">🎯 Seven objectives, and they map one-to-one onto the seven things an exam can ask. Read them as a question list, not as decoration: <em>list five data types · integers · reals · text · audio · images · video</em>.</p>
<ul>
<li><strong>"List five different data types"</strong> — numbers, text, audio, image, video. One mark, always free, never skip it. Slide 5 draws the same five in a tree.</li>
<li><strong>"Describe how integers are stored"</strong> — the biggest objective: three representations (unsigned, sign-and-magnitude, two's complement), each with its own range and its own overflow behaviour. Slides 10–16.</li>
<li><strong>"Describe how reals are stored"</strong> — floating point: a sign, a shifter (exponent) and a fixed-point number (mantissa). Slides 17–18, plus the IEEE 754 detail the exam expects.</li>
<li><strong>"Using one of the various encoding systems"</strong> — note the wording for text: you are expected to name a system (ASCII, extended ASCII, Unicode) and say how many bits it uses per symbol, not just say "letters become numbers".</li>
<li><strong>"Sampling, quantization and encoding"</strong> — three words, in that order, for audio. They are the three steps of analog-to-digital conversion and slides 23, 24, 25 give one slide each. Memorise the order; questions often ask "which step rounds the value?" (quantization).</li>
<li><strong>"Raster and vector graphics schemes"</strong> — two named schemes for images, with their trade-off (file size and rescaling). Slides 27–30.</li>
<li><strong>"Video as a representation of images changing in time"</strong> — one sentence, one slide (31). The cheapest objective in the chapter.</li>
</ul>
<p class="pitfall">⚠️ The objectives all start with "describe" — so written answers are graded on <em>vocabulary</em>. Saying "the computer turns sound into numbers" earns little; saying "sampling takes S values per second, quantization rounds each to an integer, encoding writes each as B bits, so the bit rate is S × B" earns the mark.</p>`,
        `<p class="y-chinh">🎯 Bảy mục tiêu, và chúng khớp một-một với bảy thứ đề thi có thể hỏi. Hãy đọc nó như danh sách câu hỏi, đừng đọc như trang trí: <em>kể năm kiểu dữ liệu · số nguyên · số thực · văn bản · âm thanh · ảnh · video</em>.</p>
<ul>
<li><strong>"Kể năm kiểu dữ liệu khác nhau"</strong> — số, văn bản, âm thanh, ảnh, video. Một điểm, luôn luôn cho không, đừng bao giờ bỏ. Slide 5 vẽ đúng năm cái đó thành một cây.</li>
<li><strong>"Mô tả cách lưu số nguyên"</strong> — mục tiêu lớn nhất: ba cách biểu diễn (không dấu, dấu-lượng, bù 2), mỗi cách có miền giá trị riêng và kiểu tràn số riêng. Slide 10–16.</li>
<li><strong>"Mô tả cách lưu số thực"</strong> — dấu chấm động: một dấu, một bộ dịch (số mũ) và một số dấu chấm cố định (phần định trị). Slide 17–18, cộng thêm phần IEEE 754 mà đề thi vẫn đòi.</li>
<li><strong>"Dùng MỘT trong các hệ mã hoá"</strong> — để ý cách ra đề cho văn bản: người ta đòi bạn gọi tên một hệ (ASCII, ASCII mở rộng, Unicode) và nói nó dùng bao nhiêu bit cho mỗi ký hiệu, chứ không phải chỉ nói "chữ biến thành số".</li>
<li><strong>"Lấy mẫu, lượng tử hoá và mã hoá"</strong> — ba chữ, đúng thứ tự ấy, cho âm thanh. Đó là ba bước chuyển tương tự sang số, và slide 23, 24, 25 mỗi bước một slide. Thuộc thứ tự, vì đề hay hỏi "bước nào làm tròn giá trị?" (lượng tử hoá).</li>
<li><strong>"Hai sơ đồ raster và vector"</strong> — hai cách có tên cho ảnh, kèm chỗ đánh đổi (kích thước tệp và phóng to). Slide 27–30.</li>
<li><strong>"Video là biểu diễn của ảnh thay đổi theo thời gian"</strong> — một câu, một slide (31). Mục tiêu rẻ nhất chương.</li>
</ul>
<p class="pitfall">⚠️ Mọi mục tiêu đều bắt đầu bằng "describe" — nên câu trả lời tự luận được chấm theo <em>từ vựng</em>. Viết "máy tính biến âm thanh thành số" được rất ít điểm; viết "lấy mẫu lấy S giá trị mỗi giây, lượng tử hoá làm tròn từng giá trị thành số nguyên, mã hoá ghi mỗi giá trị bằng B bit, nên tốc độ bit là S × B" mới ăn trọn điểm.</p>`],

      [4, '1 - Data Types',
        `<p class="y-chinh">🎯 A one-line section divider opening part 1. Everything from here to slide 7 answers a single question: <em>what kinds of data are there, and what happens to them at the door of the computer?</em></p>
<ul>
<li><strong>Why a whole section for "types"</strong> — because the surprise of the chapter lives here: there are five very different kinds of data outside the machine, and exactly <em>one</em> kind inside it. Sections 3.2 and 3.3 are then just the conversion recipes.</li>
<li><strong>Three slides, three claims</strong> — slide 5: data comes in five forms. Slide 6: inside, everything is a bit pattern. Slide 7: the same bit pattern means different things depending on which program reads it.</li>
<li><strong>The word "type" here is not the programming word</strong> — in PRF192 a "data type" is <code>int</code> or <code>char</code>. Here it means a <em>category of information</em>: a song, a photograph, a paragraph. Do not mix the two meanings in an answer.</li>
<li><strong>What this section does NOT cover</strong> — no conversion is done yet. No binary is written. It is pure vocabulary and framing, which is why it is only three slides long and why it is easy marks.</li>
<li><strong>Link forward</strong> — the five boxes of slide 5 become the section headings of the rest of the chapter, in the same order. If you can name the five, you can name the chapter's structure.</li>
</ul>
<p class="meo">💡 A divider slide is still worth ten seconds in revision: it tells you which of the three parts a later slide belongs to, which is exactly what you need when a question says "in which step of storing audio…".</p>`,
        `<p class="y-chinh">🎯 Một slide ngăn phần, chỉ một dòng, mở phần 1. Từ đây tới slide 7 chỉ trả lời đúng một câu hỏi: <em>có những loại dữ liệu nào, và chúng bị làm gì ngay ở cửa vào máy tính?</em></p>
<ul>
<li><strong>Vì sao dành hẳn một phần cho "kiểu"</strong> — vì cái bất ngờ của cả chương nằm ở đây: bên ngoài máy có năm loại dữ liệu rất khác nhau, còn bên trong máy chỉ có ĐÚNG MỘT loại. Phần 3.2 và 3.3 sau đó chỉ là các công thức chuyển đổi.</li>
<li><strong>Ba slide, ba khẳng định</strong> — slide 5: dữ liệu có năm dạng. Slide 6: vào trong, mọi thứ là một mẫu bit. Slide 7: cùng một mẫu bit lại mang nghĩa khác nhau tuỳ chương trình nào đọc nó.</li>
<li><strong>Chữ "kiểu" ở đây KHÔNG phải chữ kiểu của lập trình</strong> — trong PRF192, "kiểu dữ liệu" là <code>int</code> hay <code>char</code>. Ở đây nó nghĩa là <em>loại thông tin</em>: một bài hát, một tấm ảnh, một đoạn văn. Đừng trộn hai nghĩa này trong bài làm.</li>
<li><strong>Phần này KHÔNG làm gì</strong> — chưa đổi cái gì sang nhị phân cả. Thuần từ vựng và khung nhìn, nên nó chỉ dài ba slide và nên nó là phần dễ ăn điểm.</li>
<li><strong>Nối về sau</strong> — năm cái hộp của slide 5 chính là các tiêu đề mục của phần còn lại, theo đúng thứ tự đó. Kể được năm cái hộp là kể được cấu trúc cả chương.</li>
</ul>
<p class="meo">💡 Slide ngăn phần vẫn đáng mười giây lúc ôn: nó cho biết một slide phía sau thuộc phần nào trong ba phần — đúng thứ bạn cần khi đề hỏi "ở bước nào của việc lưu âm thanh…".</p>`],

      [5, '1 - Introduction',
        `<p class="y-chinh">🎯 One sentence plus Figure 3.1: <strong>data today comes in different forms including numbers, text, audio, image and video</strong> — and the green box gives the collective noun: when information contains all of them, the industry calls it <strong>multimedia</strong>.</p>
<ul>
<li><strong>The tree, exactly as drawn</strong> — one yellow root box <em>Data</em>, five children: <em>Numbers · Text · Audio · Images · Video</em>. Learn the order; it is the order the chapter uses and the order an exam list is expected in.</li>
<li><strong>Why five and not three</strong> — the split is by <em>what the data is a measurement of</em>. Numbers and text are <strong>discrete</strong> (countable symbols). Audio, images and video are <strong>continuous</strong> in the real world and must be sampled before they can be counted. That single distinction explains why sections 3.2 and 3.3 look so different.</li>
<li><strong>Audio varies in time, images vary in space</strong> — slide 22 says it for audio, slide 27 for images: the two are the same maths on different axes. Video, the fifth box, varies in <em>both</em>: space inside each frame, time across frames.</li>
<li><strong>"Multimedia" is the exam word</strong> — the green box defines it as information that contains numbers, text, images, audio <em>and</em> video together. A single JPEG is not multimedia; a web page with text, photos and a video clip is.</li>
<li><strong>Nothing here is about storage yet</strong> — this slide only classifies. The claim that all five collapse into one representation is the next slide, and it is the more surprising half.</li>
</ul>
<p class="meo">💡 Remember the five with the shape of a video call: you see <em>images</em> moving (<em>video</em>), you hear <em>audio</em>, the chat box holds <em>text</em>, and the connection statistics are <em>numbers</em>. One familiar scene contains all five.</p>`,
        `<p class="y-chinh">🎯 Một câu cộng Hình 3.1: <strong>dữ liệu ngày nay đến dưới nhiều dạng, gồm số, văn bản, âm thanh, ảnh và video</strong> — còn cái hộp xanh lá cho danh từ gọi chung: khi thông tin chứa đủ cả những thứ ấy, ngành máy tính gọi là <strong>đa phương tiện (multimedia)</strong>.</p>
<ul>
<li><strong>Cái cây, đúng như hình vẽ</strong> — một hộp gốc màu vàng <em>Data</em>, năm hộp con: <em>Numbers · Text · Audio · Images · Video</em>. Hãy thuộc đúng thứ tự này; chương đi theo thứ tự đó và đề thi cũng chờ bạn liệt kê theo thứ tự đó.</li>
<li><strong>Vì sao năm chứ không phải ba</strong> — cách chia dựa vào <em>dữ liệu là phép đo của cái gì</em>. Số và văn bản là thứ <strong>rời rạc</strong> (đếm được từng ký hiệu). Âm thanh, ảnh, video ngoài đời là thứ <strong>liên tục</strong>, phải lấy mẫu rồi mới đếm được. Chỉ một phân biệt đó giải thích vì sao phần 3.2 và 3.3 trông khác hẳn nhau.</li>
<li><strong>Âm thanh biến thiên theo THỜI GIAN, ảnh biến thiên theo KHÔNG GIAN</strong> — slide 22 nói điều đó cho âm thanh, slide 27 nói cho ảnh: hai thứ là cùng một bài toán trên hai trục khác nhau. Video, cái hộp thứ năm, biến thiên theo <em>cả hai</em>: không gian trong từng khung hình, thời gian giữa các khung hình.</li>
<li><strong>"Multimedia" là chữ đi thi</strong> — hộp xanh định nghĩa nó là thông tin chứa số, văn bản, ảnh, âm thanh <em>và</em> video cùng lúc. Một tấm JPEG đơn lẻ KHÔNG phải multimedia; một trang web có chữ, ảnh và một đoạn phim thì mới là.</li>
<li><strong>Chưa có gì về lưu trữ ở đây</strong> — slide này mới chỉ phân loại. Khẳng định "cả năm loại đều sập về một cách biểu diễn duy nhất" nằm ở slide sau, và đó mới là nửa gây bất ngờ.</li>
</ul>
<p class="meo">💡 Nhớ năm loại bằng hình ảnh một cuộc gọi video: bạn nhìn thấy <em>ảnh</em> chuyển động (<em>video</em>), nghe thấy <em>âm thanh</em>, khung chat chứa <em>văn bản</em>, còn thống kê đường truyền là <em>số</em>. Một cảnh quen thuộc chứa đủ cả năm.</p>`],

      [6, '2. Data Inside the Computer',
        `<p class="y-chinh">🎯 The central claim of the chapter, in one line: <strong>all data types are transformed into a uniform representation when stored, and transformed back when retrieved</strong>. That uniform representation is a <strong>bit pattern</strong> — a sequence of 0s and 1s. Figure 3.2 shows one: <code>1000101011111</code>.</p>
<ul>
<li><strong>Bit</strong> — "binary digit". The symbol 0 or 1, and the <em>smallest unit of data that can be stored in a computer</em>. That exact phrase is an exam definition; write it word for word.</li>
<li><strong>Bit pattern</strong> — a sequence, or string, of bits. No fixed length is implied: 3 bits, 13 bits and 64 bits are all bit patterns.</li>
<li><strong>Byte</strong> — a bit pattern of exactly <strong>8 bits</strong>. This is the one number in the slide you must never get wrong, because every capacity calculation later in the chapter divides by 8.</li>
<li><strong>Why "uniform" matters physically</strong> — memory is built from cells with two stable states (charged / not charged, magnetised one way or the other). A device with two states can store exactly one bit. Building hardware with five different kinds of storage for five kinds of data would be absurd; building one kind and encoding everything into it is cheap.</li>
<li><strong>"Transformed back when retrieved" is half the sentence</strong> — encoding is useless without the matching decoding. If a file is written as UTF-8 and read as ASCII, the bits are intact and the text is still ruined. Most "corrupted file" experiences are this, not damaged bits.</li>
<li><strong>Counting check</strong> — with <em>n</em> bits you can form 2<sup>n</sup> distinct patterns. 1 bit gives 2, 4 bits give 16, one byte gives 256, and 32 bits give 4,294,967,296. Table 3.3 on slide 21 is exactly this table read backwards.</li>
</ul>
<p class="pitfall">⚠️ Careful with "bit" versus "byte" and their symbols: <strong>b</strong> = bit, <strong>B</strong> = byte. A 100 Mbps line moves 100 million <em>bits</em> per second = 12.5 MB per second. Writing the wrong letter is an eight-fold error and the marker will see it instantly.</p>`,
        `<p class="y-chinh">🎯 Khẳng định trung tâm của cả chương, gói trong một dòng: <strong>mọi kiểu dữ liệu đều được chuyển về một cách biểu diễn ĐỒNG NHẤT khi cất vào máy, và chuyển ngược lại khi lấy ra</strong>. Cách biểu diễn đồng nhất đó là một <strong>mẫu bit</strong> — một dãy các số 0 và 1. Hình 3.2 cho một mẫu: <code>1000101011111</code>.</p>
<ul>
<li><strong>Bit</strong> — viết tắt của "binary digit" (chữ số nhị phân). Ký hiệu 0 hoặc 1, và là <em>đơn vị dữ liệu NHỎ NHẤT có thể lưu trong máy tính</em>. Đúng cụm chữ đó là một định nghĩa đi thi; hãy chép nguyên văn.</li>
<li><strong>Mẫu bit (bit pattern)</strong> — một dãy, một chuỗi bit. Không ngụ ý độ dài cố định: 3 bit, 13 bit hay 64 bit đều là mẫu bit cả.</li>
<li><strong>Byte</strong> — một mẫu bit dài đúng <strong>8 bit</strong>. Đây là con số duy nhất trong slide mà bạn tuyệt đối không được nhớ sai, vì mọi phép tính dung lượng về sau của chương đều chia cho 8.</li>
<li><strong>Vì sao "đồng nhất" là chuyện của phần cứng</strong> — bộ nhớ làm từ những ô có hai trạng thái ổn định (có tích điện / không, nhiễm từ chiều này / chiều kia). Một linh kiện hai trạng thái thì lưu được đúng một bit. Chế tạo năm loại bộ nhớ khác nhau cho năm loại dữ liệu là chuyện vô lý; chế một loại rồi mã hoá mọi thứ vào đó thì rẻ.</li>
<li><strong>"Chuyển ngược lại khi lấy ra" là NỬA còn lại của câu</strong> — mã hoá mà không có phép giải mã khớp với nó thì vô dụng. Một tệp ghi bằng UTF-8 mà đọc bằng ASCII thì bit vẫn còn nguyên vẹn nhưng chữ vẫn hỏng. Phần lớn chuyện "tệp bị lỗi phông" mà bạn gặp là chuyện này, chứ không phải bit bị hỏng.</li>
<li><strong>Phép đếm cần thuộc</strong> — với <em>n</em> bit thì tạo được 2<sup>n</sup> mẫu khác nhau. 1 bit cho 2 mẫu, 4 bit cho 16, một byte cho 256, và 32 bit cho 4.294.967.296. Bảng 3.3 ở slide 21 chính là bảng này đọc theo chiều ngược.</li>
</ul>
<p class="pitfall">⚠️ Cẩn thận chữ "bit" với chữ "byte" và ký hiệu của chúng: <strong>b</strong> = bit, <strong>B</strong> = byte. Đường truyền 100 Mbps chuyển 100 triệu <em>bit</em> mỗi giây = 12,5 MB mỗi giây. Viết nhầm chữ là sai lệch tám lần và người chấm nhìn ra ngay.</p>`],

      [7, '3. Storage of Different Data Types',
        `<p class="y-chinh">🎯 A picture with no prose, and it is the most important picture in the chapter. Five rows, five different inputs — and <strong>the same eight bits, <code>01000001</code>, arrive in memory in every single row</strong>.</p>
<ul>
<li><strong>Read the five rows</strong> — <em>a number</em> 65 goes through a <em>math routine</em>; <em>a character</em> "A" typed on the keyboard goes through a <em>text editor</em>; <em>part of an image</em> through an <em>image recorder</em>; <em>part of a song</em> through a <em>music recorder</em>; <em>part of a film</em> through a <em>video recorder</em>. Every arrow ends at a grey memory box holding <code>01000001</code>.</li>
<li><strong>What the middle column really is</strong> — the yellow "Program" box is the <em>encoder</em>. It is software, not hardware, and it is the only thing that knows which of the five meanings the bits are supposed to carry.</li>
<li><strong>The consequence, stated plainly</strong> — a bit pattern in memory carries <strong>no type information</strong>. There is no hidden label saying "this byte is a letter". The type is remembered by the program, or by the file extension, or by a header — never by the byte itself.</li>
<li><strong>Why <code>01000001</code> for both 65 and "A"</strong> — that is not a coincidence, it is the ASCII table: the code of "A" is 65 (verified: <code>ord('A')</code> = 65 = <code>1000001</code> in 7 bits, padded to <code>01000001</code> in 8). So "the number 65" and "the letter A" really are the same byte.</li>
<li><strong>This is where "file type" comes from</strong> — rename a .jpg to .txt and nothing in the bytes changes; only the program chosen to decode them changes, and the result is garbage on screen. Same bits, wrong decoder.</li>
<li><strong>Link to the von Neumann model</strong> — Chapter 1 said memory holds data <em>and</em> instructions with no distinction. This slide is the same idea one level down: even among data, the distinctions are in the interpretation, not in the storage.</li>
</ul>
<p class="dap-an">✅ Answer to the question this slide is really asking: <em>what does <code>01000001</code> mean?</em> — It means 65, or "A", or a pixel intensity, or a sound sample, or a piece of a frame. Without knowing which program wrote it, the honest answer is <strong>"the question cannot be answered"</strong>.</p>
<p class="meo">💡 One-line summary for the exam: <em>the computer stores bits; the program stores the meaning</em>.</p>`,
        `<p class="y-chinh">🎯 Một hình vẽ không kèm câu chữ nào, và đó là hình quan trọng nhất chương. Năm hàng, năm đầu vào hoàn toàn khác nhau — mà <strong>vào tới bộ nhớ thì hàng nào cũng ra đúng tám bit <code>01000001</code></strong>.</p>
<ul>
<li><strong>Đọc năm hàng</strong> — <em>một con số</em> 65 đi qua <em>bộ tính toán (math routine)</em>; <em>một ký tự</em> "A" gõ từ bàn phím đi qua <em>trình soạn thảo</em>; <em>một phần của ảnh</em> đi qua <em>bộ ghi ảnh</em>; <em>một phần của bài hát</em> qua <em>bộ ghi nhạc</em>; <em>một phần của bộ phim</em> qua <em>bộ ghi video</em>. Mọi mũi tên đều kết thúc ở một hộp bộ nhớ xám chứa <code>01000001</code>.</li>
<li><strong>Cột ở giữa thực chất là gì</strong> — cái hộp vàng "Program" chính là <em>bộ mã hoá</em>. Nó là phần mềm chứ không phải phần cứng, và nó là thứ DUY NHẤT biết dãy bit kia đang phải mang nghĩa nào trong năm nghĩa.</li>
<li><strong>Hệ quả, nói thẳng ra</strong> — một mẫu bit nằm trong bộ nhớ <strong>không mang theo thông tin về kiểu</strong>. Không có cái nhãn ẩn nào ghi "byte này là một chữ cái". Kiểu được nhớ bởi chương trình, hoặc bởi phần mở rộng tên tệp, hoặc bởi phần đầu tệp — không bao giờ bởi chính cái byte.</li>
<li><strong>Vì sao <code>01000001</code> vừa là 65 vừa là "A"</strong> — đó không phải trùng hợp, đó là bảng ASCII: mã của "A" là 65 (đã kiểm: <code>ord('A')</code> = 65 = <code>1000001</code> ở 7 bit, đệm thành <code>01000001</code> ở 8 bit). Nên "số 65" và "chữ A" đúng là cùng một byte thật.</li>
<li><strong>Đây là chỗ sinh ra khái niệm "loại tệp"</strong> — đổi tên một tệp .jpg thành .txt thì trong ruột không byte nào đổi cả; chỉ đổi cái chương trình được chọn để giải mã, và kết quả là một màn hình đầy rác. Cùng bit, sai bộ giải mã.</li>
<li><strong>Nối về mô hình von Neumann</strong> — chương 1 nói bộ nhớ chứa dữ liệu <em>và</em> lệnh mà không phân biệt. Slide này là đúng ý đó lùi thêm một bậc: ngay trong nội bộ dữ liệu, sự phân biệt nằm ở cách diễn giải, không nằm ở cách cất.</li>
</ul>
<p class="dap-an">✅ Trả lời câu hỏi mà slide này thật sự đang hỏi: <em><code>01000001</code> nghĩa là gì?</em> — Nó là 65, hoặc "A", hoặc độ sáng một điểm ảnh, hoặc một mẫu âm thanh, hoặc một mẩu khung hình. Nếu không biết chương trình nào đã ghi nó, câu trả lời trung thực là <strong>"không trả lời được"</strong>.</p>
<p class="meo">💡 Một dòng tóm tắt để đi thi: <em>máy tính lưu BIT, còn chương trình lưu Ý NGHĨA</em>.</p>`],

      [8, '2 - Storing Numbers',
        `<p class="y-chinh">🎯 The divider that opens the longest and most examinable section of the chapter: slides 9–18, storing numbers. From here on there is arithmetic on every slide.</p>
<ul>
<li><strong>Why numbers are hard when text is easy</strong> — a letter only needs a lookup table. A number needs a table <em>and</em> must still support addition, subtraction and comparison after being stored. The representation is chosen to make the hardware cheap, not to look tidy.</li>
<li><strong>The two questions of the section</strong> — slide 9 states them: <em>how to store the sign</em>, and <em>how to show the decimal point</em>. Every slide up to 18 answers one of those two.</li>
<li><strong>The split that follows</strong> — fixed point (the decimal point never moves: integers, slides 10–16) versus floating point (the decimal point is allowed to move: reals, slides 17–18).</li>
<li><strong>Three ways to store a sign, one winner</strong> — sign-and-magnitude (slide 13), one's complement (in the textbook, skipped by this deck) and two's complement (slides 15–16). Real machines use two's complement, and you need to be able to say <em>why</em>, not just <em>which</em>.</li>
<li><strong>What you will be asked to do</strong> — convert decimal to a stored pattern, convert a pattern back, give the range for <em>n</em> bits, and decide whether a given operation overflows. Four skills, and all four appear in the next nine slides.</li>
</ul>
<p class="meo">💡 Before starting, fix the vocabulary: <em>fixed point</em> = the point has a fixed, agreed position (for integers, immediately to the right of the last bit); <em>floating point</em> = the position is stored in the number itself. That is the whole difference between slides 10–16 and 17–18.</p>`,
        `<p class="y-chinh">🎯 Slide ngăn mở ra phần dài nhất và ra đề nhiều nhất của chương: slide 9–18, lưu trữ số. Từ đây trở đi slide nào cũng có phép tính.</p>
<ul>
<li><strong>Vì sao số thì khó mà chữ thì dễ</strong> — một chữ cái chỉ cần một bảng tra. Một con số thì cần bảng tra <em>và</em> sau khi cất vẫn phải cộng, trừ, so sánh được. Cách biểu diễn được chọn để mạch điện RẺ, chứ không phải để nhìn cho gọn mắt.</li>
<li><strong>Hai câu hỏi của cả phần</strong> — slide 9 nêu rõ: <em>lưu DẤU thế nào</em>, và <em>thể hiện DẤU CHẤM thập phân thế nào</em>. Mọi slide tới 18 đều đang trả lời một trong hai câu đó.</li>
<li><strong>Chỗ rẽ sau đó</strong> — dấu chấm cố định (dấu chấm không bao giờ dịch: số nguyên, slide 10–16) so với dấu chấm động (dấu chấm được phép dịch: số thực, slide 17–18).</li>
<li><strong>Ba cách lưu dấu, một kẻ thắng</strong> — dấu-lượng (slide 13), bù 1 (có trong giáo trình, deck này bỏ qua) và bù 2 (slide 15–16). Máy thật dùng bù 2, và bạn phải nói được <em>vì sao</em>, chứ không chỉ nói <em>cái nào</em>.</li>
<li><strong>Bạn sẽ bị bắt làm gì</strong> — đổi thập phân sang mẫu bit đã lưu, đọc ngược mẫu bit về thập phân, nêu miền giá trị với <em>n</em> bit, và xét một phép tính có tràn hay không. Bốn kỹ năng, và cả bốn đều nằm trong chín slide tới.</li>
</ul>
<p class="meo">💡 Trước khi vào, chốt từ vựng: <em>dấu chấm cố định</em> = dấu chấm nằm ở một vị trí đã thoả thuận, không đổi (với số nguyên là ngay bên phải bit cuối cùng); <em>dấu chấm động</em> = vị trí ấy được lưu ngay trong chính con số. Đó là toàn bộ khác biệt giữa slide 10–16 và 17–18.</p>`],

      [9, '1. Introduction',
        `<p class="y-chinh">🎯 The slide states the plan for the section: a number is first converted to binary (that was Chapter 2), <strong>but two issues remain</strong> — <em>1. how to store the sign</em> and <em>2. how to show the decimal point</em>.</p>
<ul>
<li><strong>Issue 1, the sign</strong> — binary conversion produces only magnitude. 5 is 101 and −5 is also 101 plus a minus sign that exists on paper and nowhere in the memory cell. Since a cell holds only 0 or 1, the minus sign must itself be encoded as bits. Slides 11–16 give three ways.</li>
<li><strong>Issue 2, the decimal point</strong> — the same problem: there is no third symbol "." in memory. The position of the point must either be <em>agreed in advance</em> or <em>written down as a number</em>.</li>
<li><strong>The two answers, named</strong> — <strong>fixed-point</strong> (agreed in advance) and <strong>floating-point</strong> (written down). The slide is explicit: the first stores a number as an <em>integer</em> — without a fractional part; the second stores it as a <em>real</em> — with a fractional part.</li>
<li><strong>Do not read "fixed point" as "integers only"</strong> — in general, fixed point means the point sits at an agreed place which need not be at the end; some embedded systems keep 8 bits of fraction. In this course, however, fixed point is always used for integers, exactly as the slide says.</li>
<li><strong>Why this matters more than it looks</strong> — these two issues explain every strange behaviour students meet later: why <code>int</code> and <code>float</code> are different types, why 2,147,483,647 + 1 is negative, and why 0.1 + 0.2 is not 0.3.</li>
</ul>
<p class="pitfall">⚠️ A very common wrong answer: "the computer stores the minus sign as a character". It does not. Inside a numeric variable there is no character at all — only bits, one of which is <em>interpreted</em> as the sign. A minus character exists only when the number is printed as text.</p>`,
        `<p class="y-chinh">🎯 Slide nêu kế hoạch của cả phần: số được đổi sang nhị phân trước (chuyện đó là chương 2), <strong>nhưng còn hai vấn đề chưa xử lý</strong> — <em>1. lưu DẤU của số thế nào</em> và <em>2. thể hiện DẤU CHẤM thập phân thế nào</em>.</p>
<ul>
<li><strong>Vấn đề 1, cái dấu</strong> — phép đổi sang nhị phân chỉ ra được phần độ lớn. 5 là 101 mà −5 cũng là 101 kèm một dấu trừ chỉ tồn tại trên giấy chứ không tồn tại trong ô nhớ. Vì ô nhớ chỉ giữ được 0 hoặc 1, cái dấu trừ ấy buộc phải được mã hoá thành bit. Slide 11–16 cho ba cách.</li>
<li><strong>Vấn đề 2, dấu chấm thập phân</strong> — cùng một khó khăn: trong bộ nhớ không có ký hiệu thứ ba nào tên là ".". Vị trí dấu chấm hoặc phải được <em>thoả thuận trước</em>, hoặc phải được <em>ghi lại thành một con số</em>.</li>
<li><strong>Hai câu trả lời, có tên</strong> — <strong>dấu chấm cố định (fixed-point)</strong> (thoả thuận trước) và <strong>dấu chấm động (floating-point)</strong> (ghi lại). Slide nói thẳng: cách đầu lưu con số dưới dạng <em>số nguyên</em> — không có phần lẻ; cách sau lưu dưới dạng <em>số thực</em> — có phần lẻ.</li>
<li><strong>Đừng hiểu "dấu chấm cố định" thành "chỉ dành cho số nguyên"</strong> — nói chung, dấu chấm cố định nghĩa là dấu chấm nằm ở một chỗ đã thoả thuận, chỗ đó không nhất thiết ở cuối; một số hệ nhúng giữ hẳn 8 bit phần lẻ. Nhưng trong môn này, dấu chấm cố định luôn dùng cho số nguyên, đúng như slide viết.</li>
<li><strong>Vì sao chuyện này quan trọng hơn vẻ ngoài của nó</strong> — hai vấn đề đó giải thích mọi hành vi kỳ quặc mà sinh viên gặp về sau: vì sao <code>int</code> và <code>float</code> là hai kiểu khác nhau, vì sao 2.147.483.647 + 1 lại ra số âm, và vì sao 0,1 + 0,2 không bằng 0,3.</li>
</ul>
<p class="pitfall">⚠️ Một câu trả lời sai rất hay gặp: "máy tính lưu dấu trừ như một ký tự". Không hề. Bên trong một biến số KHÔNG có ký tự nào cả — chỉ có bit, mà một trong số đó được <em>diễn giải</em> là dấu. Ký tự dấu trừ chỉ xuất hiện lúc in con số ra thành chữ.</p>`],

      [10, '2. Storing Integers',
        `<p class="y-chinh">🎯 Definition and consequence: <strong>integers are whole numbers</strong> (no fractional part), so the decimal point is always in the same place — <em>immediately to the right of the least significant (rightmost) bit</em> — and therefore <strong>fixed-point representation is used to store an integer</strong>.</p>
<ul>
<li><strong>The examples on the slide</strong> — 134 and −125 are integers; 134.23 and −0.235 are not. Note that "integer" includes negatives and zero; it is not the same as "natural number".</li>
<li><strong>The picture underneath</strong> — 16 cells holding <code>0110111000010110</code> with a black dot drawn just past the right edge and labelled <em>Decimal point (assumed position)</em>. The word <strong>assumed</strong> is the whole point: the dot is drawn on the slide but is <em>not stored</em>. It costs zero bits because everyone agrees where it is.</li>
<li><strong>Verify the pattern</strong> — reading <code>0110111000010110</code> as an unsigned 16-bit integer gives 28,182. Reading the same bits as a signed 16-bit two's complement integer gives the same 28,182, because the leftmost bit is 0.</li>
<li><strong>Why "fixed" is free and "floating" is not</strong> — a fixed point needs no bits. A floating point must spend bits saying where it went (slide 18). That is why an <code>int</code> uses all 32 bits for value while a <code>float</code> spends 9 of its 32 on sign and exponent.</li>
<li><strong>What the slide has NOT solved yet</strong> — the sign. This slide only fixed the point. Slides 11–16 spend six slides on the sign, which tells you where the difficulty really was.</li>
<li><strong>Connect to programming</strong> — in C, <code>int</code>, <code>short</code>, <code>long</code> differ only in how many cells the box has. Same fixed point, same encoding, different width, therefore different range.</li>
</ul>
<p class="meo">💡 Picture an integer as a row of boxes with a dot painted on the wall at the right-hand end. The dot never moves, so nobody has to write it down — that is exactly what "fixed point" buys you.</p>`,
        `<p class="y-chinh">🎯 Định nghĩa và hệ quả: <strong>số nguyên là số không có phần lẻ</strong>, nên dấu chấm thập phân luôn ở cùng một chỗ — <em>ngay bên phải bit có trọng số nhỏ nhất (bit ngoài cùng bên phải)</em> — và do đó <strong>người ta dùng biểu diễn dấu chấm cố định để lưu số nguyên</strong>.</p>
<ul>
<li><strong>Ví dụ ngay trên slide</strong> — 134 và −125 là số nguyên; 134,23 và −0,235 thì không. Chú ý "số nguyên" bao gồm cả số âm và số 0; nó KHÔNG đồng nghĩa với "số tự nhiên".</li>
<li><strong>Hình bên dưới</strong> — 16 ô chứa <code>0110111000010110</code>, kèm một chấm đen vẽ ngay sát mép phải, chú thích là <em>Decimal point (assumed position)</em> — dấu chấm ở vị trí GIẢ ĐỊNH. Chữ <strong>giả định</strong> mới là toàn bộ ý: cái chấm được vẽ trên slide nhưng <em>không hề được lưu</em>. Nó tốn 0 bit, vì ai cũng đã đồng ý nó nằm ở đâu.</li>
<li><strong>Kiểm lại dãy bit</strong> — đọc <code>0110111000010110</code> như số nguyên 16 bit không dấu thì được 28.182. Đọc đúng dãy đó như số nguyên 16 bit có dấu dạng bù 2 thì vẫn là 28.182, vì bit trái nhất bằng 0.</li>
<li><strong>Vì sao "cố định" thì miễn phí còn "động" thì không</strong> — dấu chấm cố định không tốn bit nào. Dấu chấm động thì phải tiêu bit để ghi lại nó đã dịch đi đâu (slide 18). Đó là lý do một <code>int</code> dùng trọn 32 bit cho giá trị, còn một <code>float</code> phải chi 9 trong 32 bit cho dấu và số mũ.</li>
<li><strong>Thứ slide này CHƯA giải quyết</strong> — cái dấu. Slide này mới chỉ cố định dấu chấm. Slide 11–16 tiêu hẳn sáu slide cho cái dấu, nghĩa là chỗ khó thật sự nằm ở đó.</li>
<li><strong>Nối sang lập trình</strong> — trong C, <code>int</code>, <code>short</code>, <code>long</code> khác nhau chỉ ở số ô của cái hộp. Cùng dấu chấm cố định, cùng cách mã hoá, khác bề rộng, nên khác miền giá trị.</li>
</ul>
<p class="meo">💡 Hình dung một số nguyên là một hàng ô, với một chấm sơn sẵn lên tường ở đầu bên phải. Cái chấm không bao giờ dịch, nên không ai phải ghi nó xuống — đó chính là thứ "dấu chấm cố định" mua được cho bạn.</p>`],

      [11, 'Unsigned Representation',
        `<p class="y-chinh">🎯 The simplest of the three schemes: an <strong>unsigned integer can never be negative</strong>, so no bit is spent on a sign and every bit carries value. Two steps: <em>1. change the integer to binary; 2. if there are fewer than n bits, add 0s on the LEFT</em>.</p>
<ul>
<li><strong>Example 3.1, fully worked</strong> — store 7 in an 8-bit location. Step 1: 7 in binary is <code>111</code> (4 + 2 + 1). Step 2: that is 3 bits, we need 8, so add 8 − 3 = <strong>five</strong> zeros on the left.</li>
<li><strong>Why the zeros go on the LEFT</strong> — leading zeros do not change a value (007 = 7) but trailing zeros multiply it by 2 each time. Putting them on the right would store <code>11100000</code> = 224, which is 7 × 32.</li>
<li><strong>The range, and how to state it</strong> — with <em>n</em> bits: from 0 to 2<sup>n</sup> − 1. For n = 8 that is 0…255; for n = 16, 0…65,535; for n = 32, 0…4,294,967,295. The count of representable values is 2<sup>n</sup>, one more than the largest value.</li>
<li><strong>The slide's phrase "between 0 and positive infinity"</strong> — that describes the mathematical idea of an unsigned integer, not what a real location can hold. In a fixed n-bit cell the ceiling is 2<sup>n</sup> − 1, which is what the very next slide is about.</li>
<li><strong>Where you meet this in practice</strong> — <code>unsigned int</code> in C, array indices, memory addresses, RGB colour components (0…255 in one byte), file sizes. Anything that cannot be negative should be unsigned, because that doubles the top of the range for free.</li>
</ul>
<p class="dap-an">✅ Answer for Example 3.1: 7 = <code>111</code><sub>2</sub> → padded to eight bits → <strong><code>00000111</code></strong>. (Check: 0+0+0+0+0+4+2+1 = 7 ✓.)</p>
<p class="pitfall">⚠️ Exam trap: "store 200 in 8 bits unsigned" is fine (200 ≤ 255) but "store 200 in 8 bits signed" overflows, because signed 8-bit stops at 127. Always check the range against the <em>scheme being asked for</em>, not just against the bit count.</p>`,
        `<p class="y-chinh">🎯 Cách đơn giản nhất trong ba cách: <strong>số nguyên không dấu không bao giờ âm</strong>, nên không tốn bit nào cho dấu và mọi bit đều mang giá trị. Hai bước: <em>1. đổi số sang nhị phân; 2. nếu chưa đủ n bit thì thêm các số 0 vào BÊN TRÁI</em>.</p>
<ul>
<li><strong>Ví dụ 3.1, giải trọn</strong> — lưu 7 vào ô nhớ 8 bit. Bước 1: 7 sang nhị phân là <code>111</code> (4 + 2 + 1). Bước 2: mới có 3 bit, cần 8 bit, nên thêm 8 − 3 = <strong>năm</strong> số 0 vào bên trái.</li>
<li><strong>Vì sao thêm 0 vào BÊN TRÁI</strong> — số 0 đứng đầu không làm đổi giá trị (007 = 7), còn số 0 thêm vào đuôi thì mỗi cái nhân đôi giá trị. Thêm bên phải sẽ thành <code>11100000</code> = 224, tức là 7 × 32.</li>
<li><strong>Miền giá trị, và cách viết cho đúng</strong> — với <em>n</em> bit: từ 0 đến 2<sup>n</sup> − 1. Với n = 8 là 0…255; n = 16 là 0…65.535; n = 32 là 0…4.294.967.295. Số lượng giá trị biểu diễn được là 2<sup>n</sup>, nhiều hơn giá trị lớn nhất đúng một đơn vị.</li>
<li><strong>Câu "từ 0 tới dương vô cùng" trên slide</strong> — đó là mô tả khái niệm toán học của số không dấu, không phải thứ một ô nhớ thật chứa nổi. Trong một ô n bit cố định, trần là 2<sup>n</sup> − 1, và đó đúng là nội dung slide ngay sau.</li>
<li><strong>Gặp nó ở đâu ngoài đời</strong> — <code>unsigned int</code> trong C, chỉ số mảng, địa chỉ bộ nhớ, ba thành phần màu RGB (0…255 trong một byte), kích thước tệp. Thứ gì không thể âm thì nên để không dấu, vì như thế trần của miền giá trị tăng gấp đôi mà không tốn gì.</li>
</ul>
<p class="dap-an">✅ Đáp án ví dụ 3.1: 7 = <code>111</code><sub>2</sub> → đệm đủ tám bit → <strong><code>00000111</code></strong>. (Kiểm lại: 0+0+0+0+0+4+2+1 = 7 ✓.)</p>
<p class="pitfall">⚠️ Bẫy đề thi: "lưu 200 vào 8 bit không dấu" thì được (200 ≤ 255) nhưng "lưu 200 vào 8 bit CÓ DẤU" thì tràn, vì 8 bit có dấu dừng ở 127. Luôn đối chiếu miền giá trị với <em>đúng cách biểu diễn mà đề hỏi</em>, đừng chỉ nhìn số bit.</p>`],

      [12, 'Overflow in unsigned integers',
        `<p class="y-chinh">🎯 What happens when the number does not fit: with only four bits the largest storable value is 2<sup>4</sup> − 1 = 15, so anything above 15 <strong>overflows</strong> — the value does not get clipped, it <em>wraps around</em>.</p>
<ul>
<li><strong>Read the figure, top half</strong> — a number line with 0…15 marked <em>Representable integer</em> and everything from 16 upwards highlighted yellow as <em>Overflow</em>. The boundary is not arbitrary: it is exactly 2<sup>n</sup>.</li>
<li><strong>Read the figure, bottom half</strong> — a clock face with sixteen positions, 0000 at the top going clockwise to 1111. A dot sits at 11 and an arrow labelled <em>Add 9 units</em> sweeps round to land on 4, with the number 20 written in purple where the answer "should" have been.</li>
<li><strong>Work the example</strong> — 11 + 9 = 20. In four bits: <code>1011</code> + <code>1001</code> = <code>10100</code>, five bits. The leftmost 1 has nowhere to live and is discarded, leaving <code>0100</code> = 4. Checked by hand and by machine: 20 mod 16 = 4.</li>
<li><strong>Why a circle is the right picture</strong> — n-bit unsigned arithmetic is arithmetic <em>modulo 2<sup>n</sup></em>. After the largest value comes the smallest, exactly like 11 o'clock plus 2 hours being 1 o'clock. Nothing is "broken"; the hardware is doing precisely what it was built to do.</li>
<li><strong>The dangerous part</strong> — most processors do not stop and do not warn. A counter at 65,535 incremented once becomes 0, and the program carries on happily with the wrong number. This class of bug has grounded aircraft and crashed rockets.</li>
<li><strong>How to avoid it</strong> — choose a wider type, check before adding, or use a language that traps overflow. You cannot "detect it afterwards" from the result alone: 4 is a perfectly ordinary value.</li>
</ul>
<p class="dap-an">✅ Answer: 11 + 9 in 4-bit unsigned = <strong>4</strong> (<code>0100</code>), not 20. The carry out of the top bit is lost, and the result is 20 mod 16.</p>
<p class="pitfall">⚠️ The slide text prints "larger than 24 − 1 = 15" because the superscript was lost when the file was converted. Read it as <strong>2<sup>4</sup> − 1 = 15</strong>. If you copy it as "24 − 1" you get 23 and the whole answer collapses.</p>`,
        `<p class="y-chinh">🎯 Chuyện gì xảy ra khi con số không vừa ô: chỉ có bốn bit thì giá trị lớn nhất lưu được là 2<sup>4</sup> − 1 = 15, nên bất cứ thứ gì lớn hơn 15 đều <strong>tràn số</strong> — và giá trị không bị cắt cụt, nó <em>quay vòng</em>.</p>
<ul>
<li><strong>Đọc hình, nửa trên</strong> — một trục số với 0…15 ghi <em>Representable integer</em> (biểu diễn được), còn từ 16 trở lên tô vàng ghi <em>Overflow</em>. Ranh giới không tuỳ tiện: nó đúng bằng 2<sup>n</sup>.</li>
<li><strong>Đọc hình, nửa dưới</strong> — một mặt đồng hồ mười sáu vị trí, 0000 ở đỉnh rồi chạy theo chiều kim đồng hồ tới 1111. Một chấm đặt ở 11 và một mũi tên ghi <em>Add 9 units</em> quét vòng qua để dừng ở 4, với số 20 viết màu tím ngay chỗ đáng lẽ là đáp án.</li>
<li><strong>Giải ví dụ</strong> — 11 + 9 = 20. Trong bốn bit: <code>1011</code> + <code>1001</code> = <code>10100</code>, ra năm bit. Số 1 ngoài cùng bên trái không có chỗ chứa nên bị vứt, còn lại <code>0100</code> = 4. Đã kiểm cả bằng tay lẫn bằng máy: 20 chia 16 dư 4.</li>
<li><strong>Vì sao vẽ hình TRÒN mới đúng</strong> — số học không dấu n bit chính là số học <em>modulo 2<sup>n</sup></em>. Sau giá trị lớn nhất là giá trị nhỏ nhất, y như 11 giờ cộng 2 tiếng thành 1 giờ. Không có gì "hỏng" cả; phần cứng đang làm đúng thứ nó được chế ra để làm.</li>
<li><strong>Chỗ nguy hiểm</strong> — phần lớn bộ xử lý không dừng lại và không báo gì. Một bộ đếm đang ở 65.535, tăng thêm một cái thành 0, và chương trình vui vẻ đi tiếp với con số sai. Loại lỗi này từng làm máy bay phải nằm đất và làm tên lửa nổ.</li>
<li><strong>Tránh thế nào</strong> — chọn kiểu rộng hơn, kiểm tra trước khi cộng, hoặc dùng ngôn ngữ biết bắt lỗi tràn. Bạn KHÔNG thể "phát hiện sau" chỉ bằng cách nhìn kết quả: số 4 là một giá trị hết sức bình thường.</li>
</ul>
<p class="dap-an">✅ Đáp án: 11 + 9 ở 4 bit không dấu = <strong>4</strong> (<code>0100</code>), không phải 20. Bit nhớ tràn ra khỏi bit cao nhất bị mất, kết quả là 20 mod 16.</p>
<p class="pitfall">⚠️ Chữ trên slide in ra thành "larger than 24 − 1 = 15" vì chỉ số trên bị rụng lúc chuyển đổi tệp. Phải đọc là <strong>2<sup>4</sup> − 1 = 15</strong>. Chép nguyên "24 − 1" thì ra 23 và cả bài sụp.</p>`],

      [13, 'Sign-and-Magnitude Representation',
        `<p class="y-chinh">🎯 The first way to store a sign, and the most intuitive one: split the unsigned range <strong>0 … 2<sup>n</sup> − 1 into two equal halves</strong> — the first half is the positive integers, the second half the negative ones. <strong>The leftmost bit defines the sign: 0 means positive, 1 means negative.</strong></p>
<ul>
<li><strong>Read the strip on the slide</strong> — sixteen 4-bit patterns in two boxes. Left box: <code>0000 0001 0010 0011 0100 0101 0110 0111</code> labelled 0, 1, 2, 3, 4, 5, 6, 7. Right box (shaded): <code>1000 1001 1010 1011 1100 1101 1110 1111</code> labelled −0, −1, −2, −3, −4, −5, −6, −7.</li>
<li><strong>How to read a pattern</strong> — leftmost bit = sign, the remaining n − 1 bits = magnitude, read as a plain unsigned number. <code>1101</code> is sign 1 (negative) and magnitude <code>101</code> = 5, so it is −5.</li>
<li><strong>How to write a number</strong> — take the absolute value, convert to binary, pad to n − 1 bits, then put 0 or 1 in front. Example: −5 in 8 bits → |−5| = 5 = <code>101</code> → pad to 7 bits <code>0000101</code> → prefix 1 → <strong><code>10000101</code></strong>.</li>
<li><strong>The range</strong> — with n bits: from −(2<sup>n−1</sup> − 1) to +(2<sup>n−1</sup> − 1). For 4 bits that is −7…+7; for 8 bits, −127…+127. Note it is <em>symmetric</em>, unlike two's complement.</li>
<li><strong>The defect the slide itself points at</strong> — "there are two different representations for zero": <code>0000</code> is +0 and <code>1000</code> is −0. So sixteen patterns represent only <strong>fifteen</strong> distinct values. One pattern is wasted.</li>
<li><strong>The defect the slide does not mention, and it is worse</strong> — addition does not work bit by bit. <code>0011</code> (+3) + <code>1011</code> (−3) added as plain binary gives <code>1110</code> = −6 in this scheme, not 0. Hardware would need to compare signs, compare magnitudes, decide to add or subtract, and fix the sign — a whole extra circuit.</li>
</ul>
<p class="dap-an">✅ Worked: −5 in 8-bit sign-and-magnitude = <code>10000101</code>. Read back: sign bit 1 → negative; magnitude <code>0000101</code> = 5 → value −5 ✓.</p>
<p class="meo">💡 Sign-and-magnitude is how <em>humans</em> write numbers: a sign then a size. That is why it feels natural and why it is examined — and also why it is not what machines use. It is still alive in one place you will meet on slide 18: the sign bit of IEEE 754.</p>`,
        `<p class="y-chinh">🎯 Cách lưu dấu đầu tiên, và cũng là cách trực giác nhất: chia đôi miền không dấu <strong>0 … 2<sup>n</sup> − 1 thành hai nửa BẰNG NHAU</strong> — nửa đầu là số dương, nửa sau là số âm. <strong>Bit trái nhất quy định dấu: 0 là dương, 1 là âm.</strong></p>
<ul>
<li><strong>Đọc dải bit trên slide</strong> — mười sáu mẫu 4 bit trong hai khung. Khung trái: <code>0000 0001 0010 0011 0100 0101 0110 0111</code> ghi 0, 1, 2, 3, 4, 5, 6, 7. Khung phải (tô nền): <code>1000 1001 1010 1011 1100 1101 1110 1111</code> ghi −0, −1, −2, −3, −4, −5, −6, −7.</li>
<li><strong>Đọc một mẫu bit thế nào</strong> — bit trái nhất là dấu, n − 1 bit còn lại là độ lớn, đọc như một số không dấu bình thường. <code>1101</code> có dấu 1 (âm) và độ lớn <code>101</code> = 5, vậy nó là −5.</li>
<li><strong>Viết một con số thế nào</strong> — lấy trị tuyệt đối, đổi sang nhị phân, đệm đủ n − 1 bit, rồi gắn 0 hoặc 1 lên đầu. Ví dụ: −5 ở 8 bit → |−5| = 5 = <code>101</code> → đệm đủ 7 bit <code>0000101</code> → gắn 1 lên đầu → <strong><code>10000101</code></strong>.</li>
<li><strong>Miền giá trị</strong> — với n bit: từ −(2<sup>n−1</sup> − 1) đến +(2<sup>n−1</sup> − 1). Với 4 bit là −7…+7; với 8 bit là −127…+127. Chú ý nó <em>đối xứng</em>, khác hẳn bù 2.</li>
<li><strong>Khuyết điểm chính slide chỉ ra</strong> — "có HAI cách biểu diễn khác nhau cho số 0": <code>0000</code> là +0 còn <code>1000</code> là −0. Vậy mười sáu mẫu bit chỉ biểu diễn được <strong>mười lăm</strong> giá trị khác nhau. Một mẫu bị phí.</li>
<li><strong>Khuyết điểm slide KHÔNG nhắc, mà nó còn nặng hơn</strong> — phép cộng không chạy theo từng bit được. <code>0011</code> (+3) cộng <code>1011</code> (−3) theo lối nhị phân thường ra <code>1110</code>, tức −6 trong hệ này, chứ không ra 0. Phần cứng sẽ phải so dấu, so độ lớn, quyết định cộng hay trừ, rồi chỉnh lại dấu — thêm hẳn một mạch điện nữa.</li>
</ul>
<p class="dap-an">✅ Bài đã giải: −5 ở dấu-lượng 8 bit = <code>10000101</code>. Đọc ngược: bit dấu 1 → âm; độ lớn <code>0000101</code> = 5 → giá trị −5 ✓.</p>
<p class="meo">💡 Dấu-lượng chính là cách <em>con người</em> viết số: một cái dấu rồi tới độ lớn. Vì thế nó cảm giác tự nhiên, và vì thế nó ra đề — cũng vì thế nó KHÔNG phải thứ máy dùng. Nó vẫn sống ở đúng một chỗ mà bạn sẽ gặp ở slide 18: bit dấu của IEEE 754.</p>`],

      [14, 'Overflow in sign-and-magnitude representation',
        `<p class="y-chinh">🎯 Sign-and-magnitude has <strong>two</strong> overflow zones, one at each end, because the range is symmetric. With 4 bits the representable band is −7 … +7, and the slide shows both a <em>negative overflow</em> and a <em>positive overflow</em> escaping it.</p>
<ul>
<li><strong>Read part a (the line)</strong> — from left: yellow <em>Negative overflow</em>, then green <em>Presentable (negative)</em> from −7 to −1, then white <em>Presentable (nonnegative)</em> from ±0 to 7, then yellow <em>Positive overflow</em>. Note the tick is written <strong>±0</strong>, a reminder that both zeros sit at that one spot.</li>
<li><strong>Read part b, negative overflow</strong> — the dot starts at −5 and the arrow <em>subtract 7 units</em> sweeps anticlockwise; the purple label reads −12. But −12 is outside −7…+7, so it cannot be stored.</li>
<li><strong>Read part c, positive overflow</strong> — the dot starts at +5 and <em>add 6 units</em> sweeps to a purple 11. Again 11 is beyond +7 and cannot be stored.</li>
<li><strong>Why two zones and not one</strong> — unsigned integers start at 0, so they can only fall off the top. Signed integers have a top <em>and</em> a bottom, so both directions can fail. The exam phrasing is "positive overflow" and "negative overflow"; some books say "overflow" and "underflow" for the same two things.</li>
<li><strong>What happens physically</strong> — the machine still produces some pattern by wrapping the circle. Going 6 steps clockwise from 5 on that 4-bit wheel lands on the pattern <code>1011</code>, which sign-and-magnitude reads as −3. So +5 + 6 gives −3: not just wrong, wrongly signed.</li>
<li><strong>How to spot overflow on paper</strong> — compare the true mathematical answer with the range. |−12| &gt; 7 and 11 &gt; 7, so both overflow. No bit-level trick is needed for this scheme; just compute and compare.</li>
</ul>
<p class="dap-an">✅ Answers: −5 − 7 = −12 → <strong>negative overflow</strong> (below −7). +5 + 6 = +11 → <strong>positive overflow</strong> (above +7). Both are unstorable in 4-bit sign-and-magnitude.</p>
<p class="pitfall">⚠️ Do not carry the numbers from this slide over to the next one. On slide 16 the same arrows appear (subtract 7, add 6) but the dots start at different places and the band is −8…+7, because two's complement has one extra negative. Same picture, different limits — the exam likes to mix them up.</p>`,
        `<p class="y-chinh">🎯 Dấu-lượng có <strong>hai</strong> vùng tràn, mỗi đầu một vùng, vì miền giá trị đối xứng. Với 4 bit, dải biểu diễn được là −7 … +7, và slide vẽ cả một lần <em>tràn âm</em> lẫn một lần <em>tràn dương</em> vọt ra khỏi dải đó.</p>
<ul>
<li><strong>Đọc phần a (trục số)</strong> — từ trái sang: vàng <em>Negative overflow</em>, rồi xanh lá <em>Presentable (negative)</em> từ −7 tới −1, rồi trắng <em>Presentable (nonnegative)</em> từ ±0 tới 7, rồi vàng <em>Positive overflow</em>. Để ý vạch được ghi là <strong>±0</strong>, nhắc rằng cả hai số 0 cùng nằm đúng một chỗ ấy.</li>
<li><strong>Đọc phần b, tràn âm</strong> — chấm xuất phát ở −5 và mũi tên <em>subtract 7 units</em> quét ngược chiều kim đồng hồ; nhãn tím ghi −12. Nhưng −12 nằm ngoài −7…+7 nên không lưu được.</li>
<li><strong>Đọc phần c, tràn dương</strong> — chấm xuất phát ở +5 và <em>add 6 units</em> quét tới số 11 màu tím. Lại một lần nữa 11 vượt quá +7 nên không lưu được.</li>
<li><strong>Vì sao hai vùng chứ không phải một</strong> — số không dấu bắt đầu từ 0 nên chỉ rơi ra được ở phía trên. Số có dấu có cả trần <em>lẫn</em> sàn, nên hỏng được cả hai chiều. Cách gọi trong đề là "positive overflow" và "negative overflow"; vài sách gọi hai thứ đó là "overflow" và "underflow".</li>
<li><strong>Thực tế máy làm gì</strong> — nó vẫn sinh ra một mẫu bit nào đó bằng cách quay vòng. Đi 6 bước theo chiều kim đồng hồ từ 5 trên bánh xe 4 bit ấy thì dừng ở mẫu <code>1011</code>, mà dấu-lượng đọc <code>1011</code> là −3. Vậy +5 + 6 ra −3: không chỉ sai số, mà sai cả dấu.</li>
<li><strong>Phát hiện tràn trên giấy thế nào</strong> — so đáp án toán học thật với miền giá trị. |−12| &gt; 7 và 11 &gt; 7 nên cả hai đều tràn. Với hệ này không cần mẹo bit nào cả; cứ tính rồi so.</li>
</ul>
<p class="dap-an">✅ Đáp án: −5 − 7 = −12 → <strong>tràn âm</strong> (dưới −7). +5 + 6 = +11 → <strong>tràn dương</strong> (trên +7). Cả hai đều không lưu được ở dấu-lượng 4 bit.</p>
<p class="pitfall">⚠️ Đừng bê số của slide này sang slide sau. Ở slide 16 cũng hai mũi tên ấy (trừ 7, cộng 6) nhưng chấm xuất phát ở chỗ khác và dải là −8…+7, vì bù 2 có dư ra một số âm. Cùng một hình, khác giới hạn — đề thi rất thích trộn hai cái này.</p>`],

      [15, 'Two’s Complementing',
        `<p class="y-chinh">🎯 The operation the whole of modern computing rests on. The slide gives the <em>shortcut</em> rule: <strong>copy bits from the right until a 1 has been copied; then flip all the remaining bits.</strong> Example 3.10 takes the two's complement of <code>00110100</code>.</p>
<ul>
<li><strong>Two rules, same answer</strong> — the classic rule is <em>flip every bit, then add 1</em>; the slide's rule is <em>copy up to and including the first 1 from the right, then flip the rest</em>. The second is the first with the carry already done in your head, which is why it is faster on paper.</li>
<li><strong>Work Example 3.10 with the slide's rule</strong> — <code>00110100</code>. From the right: copy <code>0</code>, copy <code>0</code>, copy <code>1</code> (a 1 has now been copied, stop copying). The remaining left part <code>00110</code> is flipped to <code>11001</code>. Result: <code>11001</code> + <code>100</code> = <strong><code>11001100</code></strong>, which is exactly the highlighted black cells on the slide.</li>
<li><strong>Same example with the classic rule, as a cross-check</strong> — see the table below. Both roads reach <code>11001100</code>.</li>
</ul>
<table>
<tr><th>Step</th><th>Bits</th><th>Value</th></tr>
<tr><td>Original integer</td><td><code>00110100</code></td><td>+52</td></tr>
<tr><td>Flip every bit (one's complement)</td><td><code>11001011</code></td><td>—</td></tr>
<tr><td>Add 1</td><td><code>11001100</code></td><td><strong>−52</strong></td></tr>
</table>
<p>And the reverse direction, which is how you <em>read</em> a stored negative number:</p>
<table>
<tr><th>Step</th><th>Bits</th><th>Value</th></tr>
<tr><td>Stored pattern</td><td><code>11001100</code></td><td>negative (leftmost bit 1)</td></tr>
<tr><td>Flip every bit</td><td><code>00110011</code></td><td>—</td></tr>
<tr><td>Add 1</td><td><code>00110100</code></td><td>52 → so the pattern is <strong>−52</strong></td></tr>
</table>
<ul>
<li><strong>Why it is self-inverse</strong> — taking the two's complement twice returns the original pattern, as the slide's phrase "two's complementing once" hints. That is the property that lets one circuit do both negation directions.</li>
<li><strong>Why hardware loves it</strong> — with two's complement, <em>subtraction is addition</em>: A − B is computed as A + (two's complement of B). One adder circuit serves both operations, and there is no sign comparison anywhere. Slide 47 of this deck says exactly that.</li>
</ul>
<p class="dap-an">✅ Answer to Example 3.10: two's complement of <code>00110100</code> is <strong><code>11001100</code></strong>. (Verified by machine: 52 flipped is 203 = <code>11001011</code>, plus 1 is 204 = <code>11001100</code>, and 204 − 256 = −52 ✓.)</p>
<p class="pitfall">⚠️ Two's complementing is an <em>operation on bits</em>, not a synonym for "negative". Applying it to <code>00110100</code> (+52) yields −52, but applying it to <code>11001100</code> (−52) yields +52. The operation means "negate", and it works in both directions.</p>`,
        `<p class="y-chinh">🎯 Phép toán mà toàn bộ máy tính hiện đại dựa lên. Slide cho luật <em>rút gọn</em>: <strong>chép các bit từ bên PHẢI sang cho tới khi vừa chép được một số 1; rồi LẬT toàn bộ các bit còn lại.</strong> Ví dụ 3.10 lấy bù 2 của <code>00110100</code>.</p>
<ul>
<li><strong>Hai luật, một đáp án</strong> — luật cổ điển là <em>lật hết mọi bit rồi cộng 1</em>; luật của slide là <em>chép tới hết số 1 đầu tiên tính từ phải, rồi lật phần còn lại</em>. Luật thứ hai chính là luật thứ nhất với phép cộng đã nhẩm sẵn trong đầu, nên viết tay nhanh hơn.</li>
<li><strong>Giải ví dụ 3.10 bằng luật của slide</strong> — <code>00110100</code>. Từ phải sang: chép <code>0</code>, chép <code>0</code>, chép <code>1</code> (đã chép được một số 1, dừng chép). Phần còn lại bên trái là <code>00110</code>, lật thành <code>11001</code>. Kết quả: <code>11001</code> ghép <code>100</code> = <strong><code>11001100</code></strong>, đúng những ô đen được tô đậm trên slide.</li>
<li><strong>Làm lại ví dụ ấy bằng luật cổ điển để đối chiếu</strong> — xem bảng dưới. Hai đường đều tới <code>11001100</code>.</li>
</ul>
<table>
<tr><th>Bước</th><th>Dãy bit</th><th>Giá trị</th></tr>
<tr><td>Số gốc</td><td><code>00110100</code></td><td>+52</td></tr>
<tr><td>Lật toàn bộ bit (bù 1)</td><td><code>11001011</code></td><td>—</td></tr>
<tr><td>Cộng 1</td><td><code>11001100</code></td><td><strong>−52</strong></td></tr>
</table>
<p>Và chiều ngược lại, tức là cách bạn <em>đọc</em> một số âm đã lưu:</p>
<table>
<tr><th>Bước</th><th>Dãy bit</th><th>Giá trị</th></tr>
<tr><td>Mẫu bit đã lưu</td><td><code>11001100</code></td><td>âm (bit trái nhất bằng 1)</td></tr>
<tr><td>Lật toàn bộ bit</td><td><code>00110011</code></td><td>—</td></tr>
<tr><td>Cộng 1</td><td><code>00110100</code></td><td>bằng 52 → vậy mẫu bit là <strong>−52</strong></td></tr>
</table>
<ul>
<li><strong>Vì sao nó tự nghịch đảo</strong> — lấy bù 2 hai lần thì quay về mẫu bit ban đầu, đúng như cụm chữ "two's complementing ONCE" trên slide đang gợi ý. Chính tính chất đó cho phép một mạch điện làm được cả hai chiều đổi dấu.</li>
<li><strong>Vì sao phần cứng mê nó</strong> — với bù 2, <em>phép trừ chính là phép cộng</em>: A − B được tính thành A + (bù 2 của B). Một mạch cộng phục vụ cả hai phép, và không chỗ nào phải so dấu. Slide 47 của chính deck này nói đúng câu ấy.</li>
</ul>
<p class="dap-an">✅ Đáp án ví dụ 3.10: bù 2 của <code>00110100</code> là <strong><code>11001100</code></strong>. (Đã kiểm bằng máy: 52 lật bit ra 203 = <code>11001011</code>, cộng 1 ra 204 = <code>11001100</code>, và 204 − 256 = −52 ✓.)</p>
<p class="pitfall">⚠️ Lấy bù 2 là một <em>phép toán trên bit</em>, không phải từ đồng nghĩa của chữ "âm". Áp dụng vào <code>00110100</code> (+52) thì ra −52, nhưng áp dụng vào <code>11001100</code> (−52) thì ra +52. Phép này nghĩa là "đổi dấu", và nó chạy cả hai chiều.</p>`],

      [16, 'Overflow in two’s complement representation',
        `<p class="y-chinh">🎯 The same two-circle picture as slide 14, but with the band that real computers use: <strong>−8 … +7 for four bits</strong>. And the green box states the prize: <strong>there is only ONE zero in two's complement notation.</strong></p>
<ul>
<li><strong>Read part a</strong> — the number line runs: yellow negative overflow, then <em>Presentable (negative)</em> starting at <strong>−8</strong> (not −7), then <em>Presentable (nonnegative)</em> 0 … 7, then yellow positive overflow. Compare with slide 14: the negative side gained one value and the "±0" tick became a plain "0".</li>
<li><strong>Read the two wheels</strong> — left: the dot sits at −3, arrow <em>subtract 7 units</em>, purple result −10, outside the band → negative overflow. Right: dot at 5, arrow <em>add 6 units</em>, purple result 11, outside the band → positive overflow. Both verified by hand: −3 − 7 = −10 &lt; −8 ✓ and 5 + 6 = 11 &gt; 7 ✓.</li>
<li><strong>The range, memorised as a formula</strong> — with n bits, two's complement covers <strong>−2<sup>n−1</sup> … 2<sup>n−1</sup> − 1</strong>. So 4 bits → −8…7, 8 bits → −128…127, 16 bits → −32,768…32,767, 32 bits → −2,147,483,648…2,147,483,647. Those last two are the <code>short</code> and <code>int</code> limits you already met in PRF192.</li>
</ul>
<p class="nhan">Why there is one extra negative — the counting argument, step by step</p>
<ul>
<li><strong>Step 1</strong> — n bits give 2<sup>n</sup> patterns. For n = 8 that is 256 patterns, and each must name a different value (no waste, that is the point of two's complement).</li>
<li><strong>Step 2</strong> — exactly one pattern is spent on zero: <code>00000000</code>. Unlike sign-and-magnitude there is no second zero, because two's complementing <code>00000000</code> gives back <code>00000000</code>.</li>
<li><strong>Step 3</strong> — 256 − 1 = 255 patterns remain for non-zero values, and 255 is odd. An odd number cannot split evenly into positives and negatives, so one side must get one more.</li>
<li><strong>Step 4</strong> — the leftmost bit decides the sign, and 128 patterns begin with 1 while only 128 begin with 0, one of which is zero. So the negatives get 128 and the positives get 127: <strong>−128 … +127</strong>.</li>
<li><strong>Step 5, the punchline</strong> — <code>10000000</code> is −128, and there is no pattern left for +128. Verified on the machine: two's complementing <code>10000000</code> gives <code>01111111</code> + 1 = <code>10000000</code> again — the one value that is its own negative.</li>
</ul>
<p class="dap-an">✅ Answers: (a) −3 − 7 = −10, below −8 → <strong>negative overflow</strong>. (b) 5 + 6 = 11, above 7 → <strong>positive overflow</strong>. (c) In one byte the range is <strong>−128 … +127</strong>, so −128 exists but +128 does not.</p>
<p class="pitfall">⚠️ The consequence in real code: in C, <code>abs(-128)</code> on an 8-bit signed value gives −128, not 128, because the answer has nowhere to live. The same thing happens with <code>INT_MIN</code> in 32 bits. This is a genuine bug class, not a curiosity.</p>
<p class="meo">💡 Three sentences to carry into the exam: <em>two's complement has one zero · one extra negative · and subtraction becomes addition</em>. Those three are exactly why it beat sign-and-magnitude and one's complement.</p>`,
        `<p class="y-chinh">🎯 Vẫn hình hai vòng tròn như slide 14, nhưng với dải mà máy tính thật dùng: <strong>−8 … +7 cho bốn bit</strong>. Và cái hộp xanh lá nói ra phần thưởng: <strong>trong ký pháp bù 2 chỉ có DUY NHẤT một số 0.</strong></p>
<ul>
<li><strong>Đọc phần a</strong> — trục số chạy: vàng tràn âm, rồi <em>Presentable (negative)</em> bắt đầu từ <strong>−8</strong> (chứ không phải −7), rồi <em>Presentable (nonnegative)</em> 0 … 7, rồi vàng tràn dương. So với slide 14: phía âm được thêm một giá trị và vạch "±0" đã thành "0" trơn.</li>
<li><strong>Đọc hai bánh xe</strong> — trái: chấm ở −3, mũi tên <em>subtract 7 units</em>, kết quả tím −10, nằm ngoài dải → tràn âm. Phải: chấm ở 5, mũi tên <em>add 6 units</em>, kết quả tím 11, ngoài dải → tràn dương. Đã kiểm tay: −3 − 7 = −10 &lt; −8 ✓ và 5 + 6 = 11 &gt; 7 ✓.</li>
<li><strong>Miền giá trị, thuộc dưới dạng công thức</strong> — với n bit, bù 2 phủ <strong>−2<sup>n−1</sup> … 2<sup>n−1</sup> − 1</strong>. Vậy 4 bit → −8…7, 8 bit → −128…127, 16 bit → −32.768…32.767, 32 bit → −2.147.483.648…2.147.483.647. Hai con số cuối chính là giới hạn của <code>short</code> và <code>int</code> mà bạn đã gặp ở PRF192.</li>
</ul>
<p class="nhan">Vì sao dư ra MỘT số âm — lập luận đếm, từng bước</p>
<ul>
<li><strong>Bước 1</strong> — n bit cho 2<sup>n</sup> mẫu. Với n = 8 là 256 mẫu, và mỗi mẫu phải gọi tên một giá trị khác nhau (không phí cái nào, đó mới là điểm mạnh của bù 2).</li>
<li><strong>Bước 2</strong> — đúng một mẫu bị tiêu cho số 0: <code>00000000</code>. Khác dấu-lượng, ở đây không có số 0 thứ hai, vì lấy bù 2 của <code>00000000</code> lại ra chính <code>00000000</code>.</li>
<li><strong>Bước 3</strong> — còn 256 − 1 = 255 mẫu cho các giá trị khác 0, mà 255 là số LẺ. Số lẻ thì không chia đôi đều cho dương và âm được, nên một phía buộc phải nhiều hơn một cái.</li>
<li><strong>Bước 4</strong> — bit trái nhất quyết định dấu, và có 128 mẫu bắt đầu bằng 1 trong khi cũng 128 mẫu bắt đầu bằng 0 nhưng một trong số đó là số 0. Vậy phía âm được 128 cái còn phía dương được 127: <strong>−128 … +127</strong>.</li>
<li><strong>Bước 5, câu chốt</strong> — <code>10000000</code> là −128, và không còn mẫu nào cho +128 nữa. Đã kiểm bằng máy: lấy bù 2 của <code>10000000</code> ra <code>01111111</code> + 1 = lại <code>10000000</code> — giá trị duy nhất mà số đối của nó là chính nó.</li>
</ul>
<p class="dap-an">✅ Đáp án: (a) −3 − 7 = −10, dưới −8 → <strong>tràn âm</strong>. (b) 5 + 6 = 11, trên 7 → <strong>tràn dương</strong>. (c) Trong một byte, miền giá trị là <strong>−128 … +127</strong>, nên có −128 nhưng KHÔNG có +128.</p>
<p class="pitfall">⚠️ Hệ quả trong mã thật: trong C, <code>abs(-128)</code> trên một giá trị 8 bit có dấu trả về −128 chứ không phải 128, vì đáp án không có chỗ chứa. Điều y hệt xảy ra với <code>INT_MIN</code> ở 32 bit. Đây là một lớp lỗi có thật, không phải chuyện lạ cho vui.</p>
<p class="meo">💡 Ba câu mang vào phòng thi: <em>bù 2 chỉ có một số 0 · dư ra một số âm · và phép trừ hoá thành phép cộng</em>. Đúng ba điều đó là lý do nó thắng dấu-lượng và bù 1.</p>`],

      [17, 'Storing Reals',
        `<p class="y-chinh">🎯 The section switches from integers to reals: <strong>a real is a number with an integral part and a fractional part</strong>. The green box gives the warning that the next slide answers: <em>reals with very large integral parts or very small fractional parts should not be stored in fixed-point representation.</em></p>
<ul>
<li><strong>Example 3.1 on this slide, worked</strong> — a decimal fixed-point system with 14 digits left of the point and 2 digits right, 16 digits in total. Try to store 1.00234: the system keeps 1.00 and the "234" falls off the end. The number is not wrong by much, but the <strong>precision</strong> is gone and it cannot be recovered.</li>
<li><strong>The symmetric failure</strong> — the same 16-digit system also cannot store 123,456,789,012,345,678 (18 integral digits). One layout cannot serve both very large and very small; that is the trap of a fixed layout.</li>
<li><strong>Why the fix is to move the point</strong> — all 16 digits are still there, they are just in the wrong place. If the system could record "the point is 5 places to the left", the same 16 digits would hold a very different magnitude. That single idea is floating point, and it is slide 18.</li>
<li><strong>Accuracy versus precision, since the slide uses both words</strong> — <em>accuracy</em> is how close the stored value is to the true one; <em>precision</em> is how many significant digits survive. Storing 1.00234 as 1.00 loses precision; storing it as 1.10 would lose accuracy.</li>
<li><strong>This is not only a decimal story</strong> — in binary the same thing happens and it is why 0.1 cannot be stored exactly. Measured: 0.1 written into a 32-bit float and read back is 0.10000000149011612. The binary expansion of one tenth never terminates, exactly like one third in decimal.</li>
</ul>
<p class="dap-an">✅ Answer for Example 3.1: 1.00234 in a 14+2 digit fixed-point system is stored as <strong>1.00</strong> — the fractional digits beyond two places are lost, so precision, not magnitude, is what fails.</p>
<p class="pitfall">⚠️ The slide contains a typo: it says "23.7 is a real number — the integral part is <strong>27</strong> and the fractional part is 7/10". The integral part of 23.7 is <strong>23</strong>, not 27 (23 + 7/10 = 23.7 ✓; 27 + 7/10 = 27.7 ✗). Read it as 23, and do not copy the 27 into an exam answer.</p>`,
        `<p class="y-chinh">🎯 Phần học chuyển từ số nguyên sang số thực: <strong>số thực là số có phần nguyên và phần lẻ</strong>. Hộp xanh lá nêu lời cảnh báo mà slide sau sẽ trả lời: <em>số thực có phần nguyên rất lớn, hoặc phần lẻ rất nhỏ, thì KHÔNG nên lưu bằng dấu chấm cố định.</em></p>
<ul>
<li><strong>Giải ví dụ 3.1 ngay trên slide</strong> — một hệ dấu chấm cố định trong hệ thập phân, 14 chữ số bên trái dấu chấm và 2 chữ số bên phải, tổng 16 chữ số. Thử lưu 1,00234: hệ giữ lại 1,00 còn phần "234" rơi mất. Con số không sai lệch nhiều, nhưng <strong>độ chính xác (precision)</strong> đã mất và không lấy lại được.</li>
<li><strong>Cú hỏng đối xứng</strong> — cũng hệ 16 chữ số ấy không lưu nổi 123.456.789.012.345.678 (18 chữ số phần nguyên). Một cách bố trí không phục vụ được cả cái rất lớn lẫn cái rất nhỏ; đó chính là cái bẫy của bố trí cứng.</li>
<li><strong>Vì sao cách chữa là CHO DẤU CHẤM DỊCH</strong> — đủ 16 chữ số vẫn còn đó, chỉ là đang nằm sai chỗ. Nếu hệ ghi lại được câu "dấu chấm đã dịch sang trái 5 chỗ" thì cùng 16 chữ số ấy chứa được một độ lớn hoàn toàn khác. Đúng một ý đó là dấu chấm động, và đó là slide 18.</li>
<li><strong>Accuracy khác precision, vì slide dùng cả hai chữ</strong> — <em>accuracy (độ đúng)</em> là giá trị lưu được gần giá trị thật tới đâu; <em>precision (độ chính xác)</em> là còn giữ được bao nhiêu chữ số có nghĩa. Lưu 1,00234 thành 1,00 là mất precision; lưu thành 1,10 mới là mất accuracy.</li>
<li><strong>Đây không chỉ là chuyện của hệ thập phân</strong> — trong nhị phân điều y hệt xảy ra, và đó là lý do 0,1 không lưu chính xác được. Đo thật: ghi 0,1 vào một float 32 bit rồi đọc ra được 0,10000000149011612. Khai triển nhị phân của một phần mười không bao giờ dừng, y như một phần ba trong hệ thập phân.</li>
</ul>
<p class="dap-an">✅ Đáp án ví dụ 3.1: 1,00234 trong hệ dấu chấm cố định 14+2 chữ số được lưu thành <strong>1,00</strong> — các chữ số lẻ từ vị trí thứ ba trở đi bị mất, nên thứ hỏng là độ chính xác chứ không phải độ lớn.</p>
<p class="pitfall">⚠️ Slide có một chỗ GÕ SAI: nó viết "23.7 là số thực — phần nguyên là <strong>27</strong> và phần lẻ là 7/10". Phần nguyên của 23,7 là <strong>23</strong>, không phải 27 (23 + 7/10 = 23,7 ✓; 27 + 7/10 = 27,7 ✗). Hãy đọc là 23, và đừng chép số 27 vào bài thi.</p>`],

      [18, 'Floating-Point Representation for a Real number',
        `<p class="y-chinh">🎯 The answer to slide 17: let the point move, and write down how far it moved. A floating-point number has <strong>three parts — a sign, a shifter and a fixed-point number</strong> (the coloured boxes on the slide). In IEEE 754 vocabulary those are the <em>sign bit</em>, the <em>biased exponent</em> and the <em>mantissa</em>.</p>
<ul>
<li><strong>Example 3.2, the slide's own case</strong> — 7,425,000,000,000,000,000,000.00 is written as +7.425 × 10<sup>21</sup>. Twenty-two digits became four significant digits plus a shifter. Sign = +, shifter = 21, fixed-point number = 7.425.</li>
<li><strong>Normalisation, the rule that makes it unique</strong> — in decimal, exactly one non-zero digit is kept left of the point (7.425, never 74.25 or 0.7425). In binary the same rule always produces a leading <strong>1</strong>, because 1 is the only non-zero binary digit. Since that 1 is always there, IEEE 754 does not store it — the famous <em>hidden bit</em>, worth one free bit of precision.</li>
<li><strong>Why the exponent is stored "biased" rather than in two's complement</strong> — adding 127 turns the range −126…+127 into 1…254, all non-negative. That lets the hardware compare two floats by comparing them as if they were plain integers, which makes sorting and comparison circuits trivial.</li>
</ul>
<p class="nhan">The 32-bit layout (IEEE 754 single precision) — what the three boxes become</p>
<table>
<tr><th>Part</th><th>Bits</th><th>Meaning</th></tr>
<tr><td>Sign (S)</td><td>1</td><td>0 = positive, 1 = negative (sign-and-magnitude, as on slide 13)</td></tr>
<tr><td>Exponent (E)</td><td>8</td><td>stored value = real exponent + <strong>bias 127</strong>; stored range 1…254</td></tr>
<tr><td>Mantissa (M)</td><td>23</td><td>the digits after the hidden leading 1</td></tr>
</table>
<p>Double precision is the same shape at 64 bits: 1 + 11 + 52, with bias 1023.</p>
<p class="nhan">Direction 1 — decimal to 32 bits, worked completely: store +5.75</p>
<ul>
<li><strong>Step 1, sign</strong> — positive, so S = <code>0</code>.</li>
<li><strong>Step 2, convert to binary</strong> — 5 = <code>101</code>; 0.75 = 0.5 + 0.25 = <code>.11</code>. So 5.75 = <code>101.11</code><sub>2</sub>.</li>
<li><strong>Step 3, normalise</strong> — move the point 2 places left: <code>1.0111</code> × 2<sup>2</sup>. The real exponent is 2.</li>
<li><strong>Step 4, bias the exponent</strong> — 2 + 127 = 129 = <code>10000001</code>.</li>
<li><strong>Step 5, mantissa</strong> — drop the hidden leading 1, keep <code>0111</code>, pad right to 23 bits: <code>01110000000000000000000</code>.</li>
<li><strong>Step 6, assemble</strong> — <code>0 10000001 01110000000000000000000</code>.</li>
</ul>
<p class="dap-an">✅ +5.75 stored as 32-bit IEEE 754 = <code>01000000101110000000000000000000</code> = <code>40B80000</code> in hex. (Verified on the machine: the byte encoding of 5.75 as a 32-bit float really is 40B80000.)</p>
<p class="nhan">Direction 2 — 32 bits back to decimal, worked completely</p>
<ul>
<li><strong>Given</strong> — <code>0 10000010 10010000000000000000000</code>.</li>
<li><strong>Step 1, sign</strong> — S = 0 → the number is positive.</li>
<li><strong>Step 2, exponent</strong> — <code>10000010</code> = 130; real exponent = 130 − 127 = <strong>3</strong>.</li>
<li><strong>Step 3, mantissa</strong> — put the hidden 1 back: 1.<code>1001</code> = 1 + 1/2 + 1/16 = 1.5625.</li>
<li><strong>Step 4, combine</strong> — 1.5625 × 2<sup>3</sup> = 1.5625 × 8 = 12.5.</li>
</ul>
<p class="dap-an">✅ <code>01000001010010000000000000000000</code> = <strong>+12.5</strong>. (Verified by decoding those four bytes as a 32-bit float: 12.5.)</p>
<p class="pitfall">⚠️ Three traps in one place: (1) do not forget the hidden 1 when decoding — leaving it out turns 12.5 into 4.5; (2) subtract the bias when decoding and <em>add</em> it when encoding, never the same direction twice; (3) 23 mantissa bits give only about 7 decimal significant digits, so a float cannot hold 123456789 exactly. When a question says "why is the result slightly wrong", this is the reason.</p>`,
        `<p class="y-chinh">🎯 Câu trả lời cho slide 17: cho dấu chấm được DỊCH, rồi ghi lại nó đã dịch bao xa. Một số dấu chấm động gồm <strong>ba phần — một DẤU, một BỘ DỊCH (shifter) và một SỐ dấu chấm cố định</strong> (ba hộp màu trên slide). Trong từ vựng IEEE 754 thì đó là <em>bit dấu</em>, <em>số mũ lệch (biased exponent)</em> và <em>phần định trị (mantissa)</em>.</p>
<ul>
<li><strong>Ví dụ 3.2, chính ví dụ của slide</strong> — 7.425.000.000.000.000.000.000,00 được viết thành +7,425 × 10<sup>21</sup>. Hai mươi hai chữ số rút còn bốn chữ số có nghĩa cộng một bộ dịch. Dấu = +, bộ dịch = 21, số dấu chấm cố định = 7,425.</li>
<li><strong>Chuẩn hoá — luật làm cho cách viết là DUY NHẤT</strong> — trong hệ thập phân, giữ đúng một chữ số khác 0 bên trái dấu chấm (7,425, không bao giờ 74,25 hay 0,7425). Trong nhị phân, cùng luật ấy luôn cho chữ số đầu là <strong>1</strong>, vì 1 là chữ số khác 0 duy nhất của nhị phân. Vì số 1 đó lúc nào cũng có, IEEE 754 KHÔNG lưu nó — đó là <em>bit ẩn</em> trứ danh, lời không một bit độ chính xác.</li>
<li><strong>Vì sao số mũ lưu kiểu LỆCH chứ không lưu kiểu bù 2</strong> — cộng thêm 127 biến miền −126…+127 thành 1…254, toàn số không âm. Nhờ vậy phần cứng so sánh hai số thực bằng cách so như so hai số nguyên thường, làm mạch sắp xếp và so sánh cực kỳ đơn giản.</li>
</ul>
<p class="nhan">Bố trí 32 bit (IEEE 754 độ chính xác đơn) — ba cái hộp kia hoá thành gì</p>
<table>
<tr><th>Phần</th><th>Số bit</th><th>Ý nghĩa</th></tr>
<tr><td>Dấu (S)</td><td>1</td><td>0 = dương, 1 = âm (đúng kiểu dấu-lượng của slide 13)</td></tr>
<tr><td>Số mũ (E)</td><td>8</td><td>giá trị lưu = số mũ thật + <strong>độ lệch 127</strong>; miền lưu 1…254</td></tr>
<tr><td>Phần định trị (M)</td><td>23</td><td>các chữ số đứng sau số 1 ẩn ở đầu</td></tr>
</table>
<p>Độ chính xác kép cũng hình dạng ấy nhưng 64 bit: 1 + 11 + 52, độ lệch 1023.</p>
<p class="nhan">Chiều 1 — từ thập phân sang 32 bit, giải trọn: lưu +5,75</p>
<ul>
<li><strong>Bước 1, dấu</strong> — số dương nên S = <code>0</code>.</li>
<li><strong>Bước 2, đổi sang nhị phân</strong> — 5 = <code>101</code>; 0,75 = 0,5 + 0,25 = <code>,11</code>. Vậy 5,75 = <code>101.11</code><sub>2</sub>.</li>
<li><strong>Bước 3, chuẩn hoá</strong> — dịch dấu chấm sang trái 2 chỗ: <code>1.0111</code> × 2<sup>2</sup>. Số mũ thật là 2.</li>
<li><strong>Bước 4, làm lệch số mũ</strong> — 2 + 127 = 129 = <code>10000001</code>.</li>
<li><strong>Bước 5, phần định trị</strong> — bỏ số 1 ẩn ở đầu, giữ <code>0111</code>, đệm 0 về bên phải cho đủ 23 bit: <code>01110000000000000000000</code>.</li>
<li><strong>Bước 6, ghép lại</strong> — <code>0 10000001 01110000000000000000000</code>.</li>
</ul>
<p class="dap-an">✅ +5,75 lưu ở IEEE 754 32 bit = <code>01000000101110000000000000000000</code> = <code>40B80000</code> ở hệ thập lục. (Đã kiểm bằng máy: mã byte của 5,75 dưới dạng float 32 bit đúng là 40B80000.)</p>
<p class="nhan">Chiều 2 — từ 32 bit về thập phân, giải trọn</p>
<ul>
<li><strong>Cho</strong> — <code>0 10000010 10010000000000000000000</code>.</li>
<li><strong>Bước 1, dấu</strong> — S = 0 → số dương.</li>
<li><strong>Bước 2, số mũ</strong> — <code>10000010</code> = 130; số mũ thật = 130 − 127 = <strong>3</strong>.</li>
<li><strong>Bước 3, phần định trị</strong> — gắn lại số 1 ẩn: 1,<code>1001</code> = 1 + 1/2 + 1/16 = 1,5625.</li>
<li><strong>Bước 4, ghép</strong> — 1,5625 × 2<sup>3</sup> = 1,5625 × 8 = 12,5.</li>
</ul>
<p class="dap-an">✅ <code>01000001010010000000000000000000</code> = <strong>+12,5</strong>. (Đã kiểm bằng cách giải mã bốn byte ấy thành float 32 bit: ra 12,5.)</p>
<p class="pitfall">⚠️ Ba cái bẫy nằm cùng một chỗ: (1) đừng quên số 1 ẩn lúc giải mã — bỏ sót nó thì 12,5 thành 4,5; (2) lúc giải mã phải TRỪ độ lệch còn lúc mã hoá phải CỘNG, không bao giờ cùng chiều hai lần; (3) 23 bit định trị chỉ cho khoảng 7 chữ số thập phân có nghĩa, nên một float không giữ chính xác được 123456789. Khi đề hỏi "vì sao kết quả lệch một chút", lý do nằm ở đây.</p>`],

      [19, '3 - Storing Text, Media, Image, Video',
        `<p class="y-chinh">🎯 The divider for the last section of the first half: four data types, four encodings, slides 20–31. Numbers are finished; from here nothing is computed on, only stored and reproduced.</p>
<ul>
<li><strong>What changes from section 2</strong> — for numbers, the encoding had to survive arithmetic. Here it only has to survive being written and read back. That freedom is why text can use a simple lookup table and why audio can afford to throw information away.</li>
<li><strong>The four parts and their slides</strong> — 3.1 Storing Text (20–21), 3.2 Storing Audio (22–26), 3.3 Storing Images (27–30), 3.4 Storing Video (31). This lesson covers the first two in full and the opening of images.</li>
<li><strong>The recurring pattern you will see three times</strong> — <em>sample the continuous thing → round each sample to an integer → write the integers as bits → compress</em>. Audio does it in time, images do it in space, video does both. Learn it once and the three sections collapse into one.</li>
<li><strong>Text is the odd one out</strong> — it is already discrete, so there is nothing to sample. It only needs an agreed table mapping symbols to numbers, which is why it takes two slides while audio takes five.</li>
<li><strong>Where compression enters</strong> — every one of these four types is too big raw. The chapter names the standards (MP3, JPEG, GIF) and pushes the mechanism to Chapter 15, but the words <em>lossy</em> and <em>lossless</em> are examinable here.</li>
</ul>
<p class="meo">💡 The section is easier than section 2 but has more vocabulary. Make a four-column table while you read: <em>type · how it is sampled · what one sample is called · which standard compresses it</em>. Audio: time / sample / MP3. Image: space / pixel / JPEG. Fill the rest as you go.</p>`,
        `<p class="y-chinh">🎯 Slide ngăn cho mục cuối của nửa đầu deck: bốn kiểu dữ liệu, bốn cách mã hoá, slide 20–31. Phần số đã xong; từ đây không còn tính toán gì nữa, chỉ cất và phát lại.</p>
<ul>
<li><strong>Khác gì so với phần 2</strong> — với số, cách mã hoá còn phải sống sót qua các phép tính. Ở đây nó chỉ cần sống sót qua việc ghi vào rồi đọc ra. Chính sự thoải mái đó khiến văn bản chỉ cần một bảng tra đơn giản, và khiến âm thanh dám vứt bớt thông tin.</li>
<li><strong>Bốn phần và slide tương ứng</strong> — 3.1 Lưu văn bản (20–21), 3.2 Lưu âm thanh (22–26), 3.3 Lưu ảnh (27–30), 3.4 Lưu video (31). Bài này đi trọn hai phần đầu và mở đầu phần ảnh.</li>
<li><strong>Cái khuôn lặp lại ba lần mà bạn sẽ thấy</strong> — <em>lấy mẫu thứ liên tục → làm tròn từng mẫu thành số nguyên → ghi các số nguyên thành bit → nén</em>. Âm thanh làm theo thời gian, ảnh làm theo không gian, video làm cả hai. Thuộc một lần là ba mục gộp lại thành một.</li>
<li><strong>Văn bản là ngoại lệ</strong> — nó vốn đã rời rạc nên không có gì để lấy mẫu. Nó chỉ cần một bảng thoả thuận ánh xạ ký hiệu sang số, nên chỉ tốn hai slide trong khi âm thanh tốn năm.</li>
<li><strong>Nén vào chỗ nào</strong> — cả bốn kiểu này để thô đều quá lớn. Chương gọi tên các chuẩn (MP3, JPEG, GIF) rồi đẩy cơ chế sang chương 15, nhưng hai chữ <em>có mất mát</em> và <em>không mất mát</em> thì ra đề ngay ở đây.</li>
</ul>
<p class="meo">💡 Mục này dễ hơn mục 2 nhưng nhiều từ vựng hơn. Vừa đọc vừa kẻ một bảng bốn cột: <em>kiểu · lấy mẫu theo cái gì · một mẫu gọi là gì · chuẩn nào nén nó</em>. Âm thanh: thời gian / sample / MP3. Ảnh: không gian / pixel / JPEG. Còn lại điền dần.</p>`],

      [20, '3.1 Storing Text',
        `<p class="y-chinh">🎯 Text is a <strong>sequence of symbols</strong>, and symbols are countable — so storing text needs no sampling, only a <strong>bit pattern per symbol</strong>. The figure spells "CATS" as four 7-bit patterns.</p>
<ul>
<li><strong>Count what English needs</strong> — the slide counts 26 uppercase, 26 lowercase, "nine symbols (0,1,2,…,9)" for digits, plus punctuation, plus blank, newline and tab for alignment and readability. That is already well over 64 symbols, so 6 bits is not enough and 7 bits is the natural size.</li>
<li><strong>The core rule</strong> — with n bits you can name 2<sup>n</sup> symbols; conversely, to name k symbols you need at least ceil(log<sub>2</sub> k) bits. This is the same counting as slide 6, applied to an alphabet instead of to numbers.</li>
<li><strong>Read the figure, verified character by character</strong> — C = <code>1000011</code>, A = <code>1000001</code>, T = <code>1010100</code>, S = <code>1010011</code>. Converted to decimal: 67, 65, 84, 83 — exactly the ASCII codes of C, A, T, S (checked on the machine).</li>
<li><strong>Useful anchors instead of memorising the table</strong> — "A" = 65, "a" = 97 (32 more, i.e. one bit different: bit 6), "0" = 48, space = 32. From those four you can derive almost any code in an exam: "Z" = 65 + 25 = 90, "9" = 48 + 9 = 57.</li>
<li><strong>Why uppercase and lowercase differ by exactly 32</strong> — 32 is 2<sup>5</sup>, so switching case flips a single bit. That is why <code>c | 32</code> lowercases and <code>c &amp; ~32</code> uppercases an ASCII letter in one machine instruction. A deliberate design choice, not a coincidence.</li>
<li><strong>The consequence for storage size</strong> — "CATS" is 4 symbols × 7 bits = 28 bits, or 4 bytes if each symbol is padded to a byte, which is what real systems do. Text is by far the cheapest media type: an entire novel is about 1 MB, less than one photograph.</li>
</ul>
<p class="dap-an">✅ "CATS" in 7-bit ASCII = <code>1000011 1000001 1010100 1010011</code> = decimal 67, 65, 84, 83 ✓, and 4 bytes when stored one symbol per byte.</p>
<p class="pitfall">⚠️ The slide says "nine symbols (0, 1, 2, …, 9)" — there are <strong>ten</strong> digits, 0 through 9. Count them: 0,1,2,3,4,5,6,7,8,9. Do not repeat the nine in an exam answer.</p>`,
        `<p class="y-chinh">🎯 Văn bản là một <strong>dãy các ký hiệu</strong>, mà ký hiệu thì đếm được — nên lưu văn bản không cần lấy mẫu gì cả, chỉ cần <strong>một mẫu bit cho mỗi ký hiệu</strong>. Hình vẽ đánh vần "CATS" thành bốn mẫu 7 bit.</p>
<ul>
<li><strong>Đếm xem tiếng Anh cần bao nhiêu</strong> — slide đếm 26 chữ hoa, 26 chữ thường, "chín ký hiệu (0,1,2,…,9)" cho chữ số, cộng dấu câu, cộng dấu cách, xuống dòng và tab để canh lề cho dễ đọc. Chừng đó đã vượt xa 64 ký hiệu, nên 6 bit không đủ và 7 bit là cỡ tự nhiên.</li>
<li><strong>Luật cốt lõi</strong> — với n bit thì gọi tên được 2<sup>n</sup> ký hiệu; ngược lại, muốn gọi tên k ký hiệu thì cần ít nhất là trần của log<sub>2</sub> k bit. Vẫn đúng phép đếm của slide 6, chỉ là áp lên bảng chữ cái thay vì lên con số.</li>
<li><strong>Đọc hình, đã kiểm từng ký tự</strong> — C = <code>1000011</code>, A = <code>1000001</code>, T = <code>1010100</code>, S = <code>1010011</code>. Đổi sang thập phân: 67, 65, 84, 83 — đúng mã ASCII của C, A, T, S (đã kiểm bằng máy).</li>
<li><strong>Mấy cái mốc để khỏi phải học thuộc cả bảng</strong> — "A" = 65, "a" = 97 (hơn 32, tức lệch đúng một bit: bit thứ 6), "0" = 48, dấu cách = 32. Từ bốn mốc đó suy ra gần như mọi mã trong đề: "Z" = 65 + 25 = 90, "9" = 48 + 9 = 57.</li>
<li><strong>Vì sao chữ hoa và chữ thường lệch đúng 32</strong> — vì 32 là 2<sup>5</sup>, nên đổi hoa/thường chỉ lật đúng một bit. Đó là lý do <code>c | 32</code> biến chữ thành thường còn <code>c &amp; ~32</code> biến thành hoa, mỗi phép đúng một lệnh máy. Đây là chủ ý thiết kế, không phải trùng hợp.</li>
<li><strong>Hệ quả về dung lượng</strong> — "CATS" là 4 ký hiệu × 7 bit = 28 bit, hoặc 4 byte nếu mỗi ký hiệu được đệm cho tròn một byte, và hệ thật đều làm thế. Văn bản là loại dữ liệu RẺ nhất: nguyên một cuốn tiểu thuyết khoảng 1 MB, còn ít hơn một tấm ảnh chụp.</li>
</ul>
<p class="dap-an">✅ "CATS" ở ASCII 7 bit = <code>1000011 1000001 1010100 1010011</code> = thập phân 67, 65, 84, 83 ✓, và chiếm 4 byte khi lưu mỗi ký hiệu một byte.</p>
<p class="pitfall">⚠️ Slide viết "nine symbols (0, 1, 2, …, 9)" — chữ số có <strong>MƯỜI</strong> cái, từ 0 tới 9. Đếm lại: 0,1,2,3,4,5,6,7,8,9. Đừng chép lại con số chín vào bài thi.</p>`],

      [21, 'Codes',
        `<p class="y-chinh">🎯 The named code systems: <strong>ASCII uses 7 bits per symbol, Extended ASCII uses 8, and Unicode uses 32 bits to represent up to 2<sup>32</sup> symbols</strong>. The slide's key sentence: <em>ASCII and extended ASCII are parts of Unicode.</em></p>
<ul>
<li><strong>ASCII, 7 bits</strong> — 2<sup>7</sup> = <strong>128</strong> symbols, codes 0…127. Enough for English letters, digits, punctuation and control codes, and nothing else. No accents, no Greek, no Chinese — and no Vietnamese.</li>
<li><strong>Extended ASCII, 8 bits</strong> — 2<sup>8</sup> = <strong>256</strong> symbols. The extra 128 slots were filled differently by every region, producing dozens of incompatible "code pages". Vietnamese had VNI, TCVN3, VISCII — the reason old documents still open as gibberish.</li>
<li><strong>Unicode, one table for everything</strong> — a single code point per symbol across all writing systems, so the code page problem disappears. Table 3.3 on the slide is the same counting as always: 2 symbols → 1 bit, 16 → 4, 128 → 7, 256 → 8, 65,536 → 16, 4,294,967,296 → 32.</li>
<li><strong>Why nobody stores 32 bits per letter</strong> — English text would quadruple in size for nothing. So Unicode is written with a <strong>variable-length encoding</strong>, and in practice that is <strong>UTF-8</strong>: 1 byte for ASCII characters, 2 for most Latin accents, 3 for Vietnamese tone-marked letters and CJK, 4 for emoji.</li>
</ul>
<p class="nhan">Counting the bytes of a Vietnamese string — measured, not guessed</p>
<ul>
<li><strong>The string "Tiếng Việt"</strong> — 10 characters including the space, but <strong>14 bytes</strong> in UTF-8. Per character: T=1, i=1, <strong>ế=3</strong>, n=1, g=1, space=1, V=1, i=1, <strong>ệ=3</strong>, t=1. The two tone-marked vowels cost 3 bytes each.</li>
<li><strong>"Xin chào"</strong> — 8 characters, <strong>9 bytes</strong>: every letter is 1 byte except <strong>à = 2 bytes</strong>.</li>
<li><strong>The pattern</strong> — plain accents (à, â, ă, đ, ơ) take 2 bytes; letters carrying both a vowel mark and a tone (ế, ệ, ữ) take 3. In the same UTF-8 encoding, an emoji takes 4.</li>
<li><strong>Compare the encodings for "Tiếng Việt"</strong> — ASCII: impossible, the characters do not exist in it. UTF-8: 14 bytes. UTF-16: 20 bytes. UTF-32: 40 bytes. UTF-8 wins for this text and wins by far more for pure English.</li>
</ul>
<p class="dap-an">✅ Answers: ASCII holds <strong>128</strong> symbols (7 bits), extended ASCII <strong>256</strong> (8 bits), Unicode up to <strong>4,294,967,296</strong> (32 bits). "Tiếng Việt" is <strong>10 characters but 14 bytes</strong> in UTF-8 — verified by measuring the encoded length.</p>
<p class="pitfall">⚠️ Two traps. (1) The slide prints "up to 232 symbols" because the superscript was lost — it is <strong>2<sup>32</sup></strong>, and Table 3.3 confirms it with 4,294,967,296. (2) "Number of characters" is not "number of bytes" outside ASCII. A field limited to 20 <em>bytes</em> holds only about 7 Vietnamese tone-marked letters, which is why text gets truncated mid-word in badly written forms.</p>`,
        `<p class="y-chinh">🎯 Các hệ mã có tên: <strong>ASCII dùng 7 bit cho mỗi ký hiệu, ASCII mở rộng dùng 8, còn Unicode dùng 32 bit để biểu diễn tới 2<sup>32</sup> ký hiệu</strong>. Câu then chốt của slide: <em>ASCII và ASCII mở rộng là các phần NẰM TRONG Unicode.</em></p>
<ul>
<li><strong>ASCII, 7 bit</strong> — 2<sup>7</sup> = <strong>128</strong> ký hiệu, mã 0…127. Đủ cho chữ cái tiếng Anh, chữ số, dấu câu và các mã điều khiển, và hết. Không có dấu thanh, không có tiếng Hy Lạp, không có chữ Hán — và KHÔNG có tiếng Việt.</li>
<li><strong>ASCII mở rộng, 8 bit</strong> — 2<sup>8</sup> = <strong>256</strong> ký hiệu. 128 ô thêm ra được mỗi vùng lãnh thổ nhét một kiểu, đẻ ra hàng chục "bảng mã" không tương thích nhau. Tiếng Việt từng có VNI, TCVN3, VISCII — đó là lý do tài liệu cũ mở ra vẫn thành một mớ ký tự lạ.</li>
<li><strong>Unicode, một bảng cho tất cả</strong> — mỗi ký hiệu của mọi hệ chữ viết có đúng một mã, nên chuyện bảng mã biến mất. Bảng 3.3 trên slide vẫn là phép đếm quen thuộc: 2 ký hiệu → 1 bit, 16 → 4, 128 → 7, 256 → 8, 65.536 → 16, 4.294.967.296 → 32.</li>
<li><strong>Vì sao không ai lưu 32 bit cho mỗi chữ cái</strong> — văn bản tiếng Anh sẽ phình gấp bốn mà chẳng được gì. Nên Unicode được ghi bằng một <strong>cách mã hoá độ dài thay đổi</strong>, và trên thực tế đó là <strong>UTF-8</strong>: 1 byte cho ký tự ASCII, 2 byte cho phần lớn chữ Latin có dấu, 3 byte cho chữ tiếng Việt có dấu thanh và chữ Hán–Nhật–Hàn, 4 byte cho emoji.</li>
</ul>
<p class="nhan">Đếm byte của một chuỗi tiếng Việt — đo thật, không đoán</p>
<ul>
<li><strong>Chuỗi "Tiếng Việt"</strong> — 10 ký tự kể cả dấu cách, nhưng <strong>14 byte</strong> trong UTF-8. Từng ký tự: T=1, i=1, <strong>ế=3</strong>, n=1, g=1, dấu cách=1, V=1, i=1, <strong>ệ=3</strong>, t=1. Hai nguyên âm mang dấu thanh mỗi cái tốn 3 byte.</li>
<li><strong>"Xin chào"</strong> — 8 ký tự, <strong>9 byte</strong>: mọi chữ đều 1 byte, trừ <strong>à = 2 byte</strong>.</li>
<li><strong>Quy luật</strong> — dấu phụ trơn (à, â, ă, đ, ơ) tốn 2 byte; chữ vừa có dấu mũ/móc vừa có dấu thanh (ế, ệ, ữ) tốn 3 byte. Cũng trong UTF-8, một emoji tốn 4 byte.</li>
<li><strong>So các cách mã hoá cho "Tiếng Việt"</strong> — ASCII: không thể, những ký tự ấy không tồn tại trong nó. UTF-8: 14 byte. UTF-16: 20 byte. UTF-32: 40 byte. UTF-8 thắng với chuỗi này, và thắng đậm hơn nữa với văn bản thuần tiếng Anh.</li>
</ul>
<p class="dap-an">✅ Đáp án: ASCII chứa <strong>128</strong> ký hiệu (7 bit), ASCII mở rộng <strong>256</strong> (8 bit), Unicode tới <strong>4.294.967.296</strong> (32 bit). "Tiếng Việt" là <strong>10 ký tự nhưng 14 byte</strong> trong UTF-8 — đã đo bằng cách lấy độ dài sau khi mã hoá.</p>
<p class="pitfall">⚠️ Hai cái bẫy. (1) Slide in ra "up to 232 symbols" vì chỉ số trên bị rụng — phải là <strong>2<sup>32</sup></strong>, và Bảng 3.3 xác nhận bằng con số 4.294.967.296. (2) "Số ký tự" KHÔNG phải "số byte" một khi ra khỏi ASCII. Một trường dữ liệu giới hạn 20 <em>byte</em> chỉ chứa nổi khoảng 7 chữ tiếng Việt có dấu thanh, và đó là lý do chữ bị cắt cụt giữa từ trong những biểu mẫu viết ẩu.</p>`],

      [22, '3.2 Storing Audio',
        `<p class="y-chinh">🎯 The problem statement for audio: <strong>audio is a representation of sound or music, it is NOT countable, it is analog data, and it varies with time</strong>. Figure 3.3 shows a smooth curve — and that curve is the reason the next three slides exist.</p>
<ul>
<li><strong>The sentence that matters most</strong> — "even if we were able to measure all its values in a period of time, we could not store them, as we would need an <em>infinite</em> number of memory locations". Between any two instants there is another instant, so a continuous signal has infinitely many values in any interval, however short.</li>
<li><strong>Analog versus digital, defined properly</strong> — <em>analog</em> means the value varies continuously and can take any value in a range; <em>digital</em> means it takes only separated, countable values. Text and numbers were born digital. Sound is not, so it must be converted.</li>
<li><strong>Why sound is analog physically</strong> — it is air pressure changing over time. A microphone turns pressure into a voltage that follows the same smooth shape. Nothing in that chain is made of steps.</li>
<li><strong>"Varies with time" is the axis that matters</strong> — remember slide 5: audio varies in <em>time</em>, images vary in <em>space</em>. Everything in slides 23–26 is the mathematics of chopping up a time axis; slides 27–30 will do the same mathematics on two space axes.</li>
<li><strong>The three-step answer, announced here</strong> — since storing everything is impossible, store <em>some</em> values (sampling, slide 23), round each one (quantization, slide 24), write them as bits (encoding, slide 25). Then compress (slide 26).</li>
<li><strong>What is inevitably lost</strong> — an analog-to-digital conversion can never be perfectly reversible, because infinite information went in and finite information came out. The engineering question is not "how to lose nothing" but "how to lose only what the ear cannot hear".</li>
</ul>
<p class="meo">💡 A picture for the exam: imagine drawing a smooth curve on graph paper, then being allowed to record only the squares it passes through. Finer squares give a better copy and a bigger file. That trade-off is literally all of slides 23–26.</p>`,
        `<p class="y-chinh">🎯 Phát biểu bài toán cho âm thanh: <strong>âm thanh là biểu diễn của tiếng động hay âm nhạc, nó KHÔNG đếm được, nó là dữ liệu tương tự (analog), và nó biến thiên theo thời gian</strong>. Hình 3.3 vẽ một đường cong trơn — và chính đường cong đó là lý do ba slide sau tồn tại.</p>
<ul>
<li><strong>Câu quan trọng nhất</strong> — "kể cả khi đo được MỌI giá trị của nó trong một khoảng thời gian, ta vẫn không lưu được, vì sẽ cần VÔ HẠN ô nhớ". Giữa hai thời điểm bất kỳ luôn còn một thời điểm nữa, nên một tín hiệu liên tục có vô hạn giá trị trong mọi khoảng, dù khoảng đó ngắn cỡ nào.</li>
<li><strong>Analog và digital, định nghĩa cho chuẩn</strong> — <em>analog (tương tự)</em> nghĩa là giá trị biến thiên liên tục, nhận được mọi giá trị trong một dải; <em>digital (số)</em> nghĩa là nó chỉ nhận những giá trị tách rời, đếm được. Văn bản và con số sinh ra đã là digital. Âm thanh thì không, nên phải chuyển đổi.</li>
<li><strong>Vì sao âm thanh là analog xét về vật lý</strong> — nó là áp suất không khí thay đổi theo thời gian. Một cái micro biến áp suất thành điện áp đi theo đúng hình dạng trơn ấy. Không mắt xích nào trong chuỗi đó được làm bằng các bậc thang.</li>
<li><strong>"Biến thiên theo thời gian" là cái trục đáng nhớ</strong> — nhớ lại slide 5: âm thanh biến thiên theo <em>thời gian</em>, ảnh biến thiên theo <em>không gian</em>. Toàn bộ slide 23–26 là toán học của việc chặt nhỏ một trục thời gian; slide 27–30 sẽ làm đúng phép toán ấy trên hai trục không gian.</li>
<li><strong>Câu trả lời ba bước, được báo trước ở đây</strong> — vì lưu tất cả là bất khả, hãy lưu <em>một số</em> giá trị (lấy mẫu, slide 23), làm tròn từng giá trị (lượng tử hoá, slide 24), ghi chúng thành bit (mã hoá, slide 25). Rồi nén (slide 26).</li>
<li><strong>Thứ chắc chắn mất</strong> — một phép chuyển tương tự sang số không bao giờ đảo ngược hoàn hảo được, vì thông tin vào là vô hạn còn thông tin ra là hữu hạn. Câu hỏi kỹ thuật không phải "làm sao không mất gì" mà là "làm sao chỉ mất đúng phần tai người không nghe thấy".</li>
</ul>
<p class="meo">💡 Một hình để nhớ đi thi: tưởng tượng vẽ một đường cong trơn lên giấy kẻ ô, rồi chỉ được phép ghi lại những ô mà nó đi qua. Ô càng nhỏ thì bản sao càng giống mà tệp càng to. Đúng cái đánh đổi đó là toàn bộ slide 23–26.</p>`],

      [23, 'Sampling',
        `<p class="y-chinh">🎯 Step 1 of 3: <strong>sampling means selecting a finite number of points on the analog signal, measuring their values, and recording them.</strong> Figure 3.4 shows a curve crossed by ten vertical sticks, captioned <em>Ten sample values in one second</em>.</p>
<ul>
<li><strong>Read the figure exactly</strong> — the vertical axis runs from <em>Minimum</em> through 0 to <em>Maximum</em>, the horizontal axis is time with <em>1 Second</em> marked at the right edge, and ten black dots sit where the sticks meet the curve. Only those ten numbers are kept; the curve itself is thrown away.</li>
<li><strong>Sampling rate, the term to use</strong> — the number of samples per second, S, measured in hertz. Ten samples per second is 10 Hz. Real audio uses 44,100 Hz, which is 4,410 times finer than the figure.</li>
<li><strong>What happens if the rate is too low</strong> — the ten dots in the figure genuinely miss several peaks of the drawn curve; a reconstruction from them would be a different, slower-looking wave. That failure has a name, <em>aliasing</em>, and it is what makes a badly sampled recording sound wrong rather than merely rough.</li>
<li><strong>How the right rate is chosen</strong> — the Nyquist rule: sample at least twice the highest frequency present. Human hearing tops out near 20 kHz, so 2 × 20,000 = 40,000 samples per second is the floor, and CD audio uses 44,100 with a margin. That is where the 44.1 kHz on slide 26 comes from, and it is not an arbitrary number.</li>
<li><strong>The cost is linear and immediate</strong> — doubling the sampling rate doubles the file. Every quality decision in this chapter is paid for in bytes, on the spot.</li>
<li><strong>The same idea, renamed, in the image section</strong> — slide 27 says sampling an image is called <em>scanning</em> and the samples are called <em>pixels</em>, and the rate is called <em>resolution</em>. Three new words, one old concept.</li>
</ul>
<p class="dap-an">✅ From the figure: S = <strong>10 samples per second</strong>. Telephone speech uses 8,000; CD audio uses 44,100 — and 44,100 comes from 2 × 20 kHz (the top of human hearing) plus a safety margin.</p>
<p class="pitfall">⚠️ Sampling and quantization are two different steps and exams love to swap them. Sampling chooses <em>when</em> to measure (positions on the time axis); quantization decides <em>how precisely</em> to write down the value (positions on the vertical axis). Slide 23 is horizontal, slide 24 is vertical.</p>`,
        `<p class="y-chinh">🎯 Bước 1 trong 3: <strong>lấy mẫu nghĩa là chọn ra một số HỮU HẠN điểm trên tín hiệu tương tự, đo giá trị của chúng, rồi ghi lại.</strong> Hình 3.4 vẽ một đường cong bị mười cái que dọc cắt qua, chú thích <em>Ten sample values in one second</em> — mười giá trị mẫu trong một giây.</p>
<ul>
<li><strong>Đọc hình cho đúng</strong> — trục dọc chạy từ <em>Minimum</em> qua 0 tới <em>Maximum</em>, trục ngang là thời gian với vạch <em>1 Second</em> ở mép phải, và mười chấm đen nằm đúng chỗ que chạm đường cong. Chỉ mười con số ấy được giữ lại; bản thân đường cong bị vứt đi.</li>
<li><strong>Tần số lấy mẫu, chữ phải dùng</strong> — số mẫu mỗi giây, ký hiệu S, đo bằng hertz. Mười mẫu mỗi giây là 10 Hz. Âm thanh thật dùng 44.100 Hz, tức mịn hơn hình vẽ 4.410 lần.</li>
<li><strong>Chuyện gì xảy ra nếu lấy mẫu quá thưa</strong> — mười cái chấm trong hình quả thật bỏ sót vài đỉnh của đường cong được vẽ; dựng lại từ chúng sẽ ra một sóng khác, trông chậm hơn. Cú hỏng đó có tên là <em>aliasing</em>, và nó khiến một bản ghi lấy mẫu ẩu nghe SAI chứ không chỉ nghe thô.</li>
<li><strong>Chọn tần số đúng thế nào</strong> — luật Nyquist: lấy mẫu ít nhất gấp đôi tần số cao nhất có trong tín hiệu. Tai người nghe tới cỡ 20 kHz, nên 2 × 20.000 = 40.000 mẫu mỗi giây là sàn, và đĩa CD dùng 44.100 để có biên an toàn. Con số 44,1 kHz ở slide 26 sinh ra từ đó, nó không hề tuỳ tiện.</li>
<li><strong>Cái giá là tuyến tính và trả ngay</strong> — tăng gấp đôi tần số lấy mẫu thì tệp to gấp đôi. Mọi quyết định về chất lượng trong chương này đều phải trả bằng byte, trả ngay tại chỗ.</li>
<li><strong>Cũng ý đó, đổi tên, ở phần ảnh</strong> — slide 27 nói lấy mẫu một tấm ảnh thì gọi là <em>quét (scanning)</em>, các mẫu gọi là <em>điểm ảnh (pixel)</em>, còn tần số lấy mẫu gọi là <em>độ phân giải (resolution)</em>. Ba chữ mới, một khái niệm cũ.</li>
</ul>
<p class="dap-an">✅ Từ hình: S = <strong>10 mẫu mỗi giây</strong>. Thoại điện thoại dùng 8.000; âm thanh CD dùng 44.100 — và 44.100 đến từ 2 × 20 kHz (ngưỡng trên của tai người) cộng thêm biên an toàn.</p>
<p class="pitfall">⚠️ Lấy mẫu và lượng tử hoá là HAI bước khác nhau và đề thi rất thích tráo chúng. Lấy mẫu chọn <em>KHI NÀO</em> đo (vị trí trên trục thời gian); lượng tử hoá quyết định <em>ghi lại giá trị chính xác tới đâu</em> (vị trí trên trục dọc). Slide 23 là chiều ngang, slide 24 là chiều dọc.</p>`],

      [24, 'Quantization',
        `<p class="y-chinh">🎯 Step 2 of 3: the measured value of each sample is a <strong>real number</strong>, and reals are expensive — so <strong>quantization rounds each sample to the closest integer</strong>. The slide's own examples: 17.2 rounds down to 17, and 17.7 rounds up to 18.</p>
<ul>
<li><strong>Why rounding at all</strong> — the slide says it plainly: it is <em>simpler to use an unsigned integer (a bit pattern) for each sample</em>. A real would need floating point, 32 bits per sample and slow arithmetic, for a measurement whose last digits are noise anyway.</li>
<li><strong>Bit depth is the control knob</strong> — the number of bits per sample, B, fixes how many levels the vertical axis is cut into: 2<sup>B</sup>. With B = 8 there are 256 levels; with B = 16 there are <strong>65,536</strong>; with B = 24 there are 16,777,216. CD audio uses 16.</li>
<li><strong>Quantization error, quantified</strong> — rounding to the nearest level means the error is at most <em>half</em> a level. More levels means smaller steps means smaller error. The error never disappears, which is the price of turning analog into digital.</li>
<li><strong>What the error sounds like</strong> — a faint hiss riding on the signal, loudest where the music is quietest. At 8 bits it is clearly audible; at 16 bits it sits below the noise of the room you are listening in, which is exactly why 16 was chosen.</li>
<li><strong>Do not confuse the two numbers</strong> — the <em>sampling rate</em> (40,000 in the slide's running example) is how many samples; the <em>bit depth</em> (16) is how big each sample is. The first is a count, the second is a width, and slide 25 multiplies them together.</li>
<li><strong>The slide's "40,000 real values for each one second sample"</strong> — read it as "40,000 values per second", i.e. a sampling rate of 40,000 Hz. It is the same example that reappears on slide 25.</li>
</ul>
<p class="dap-an">✅ Worked: 17.2 → <strong>17</strong>; 17.7 → <strong>18</strong>. With bit depth B = 16 the signal is cut into 2<sup>16</sup> = <strong>65,536</strong> levels, and the maximum rounding error is half a level.</p>
<p class="meo">💡 Remember the pair with one sentence: <em>sampling decides how many photographs you take of the wave; quantization decides how many colours each photograph is allowed</em>. Both can be made finer, and both cost storage.</p>`,
        `<p class="y-chinh">🎯 Bước 2 trong 3: giá trị đo được của mỗi mẫu là một <strong>số thực</strong>, mà số thực thì đắt — nên <strong>lượng tử hoá làm tròn mỗi mẫu về số nguyên gần nhất</strong>. Chính ví dụ của slide: 17,2 làm tròn xuống thành 17, còn 17,7 làm tròn lên thành 18.</p>
<ul>
<li><strong>Vì sao phải làm tròn</strong> — slide nói thẳng: <em>dùng một số nguyên không dấu (một mẫu bit) cho mỗi mẫu thì ĐƠN GIẢN hơn</em>. Số thực sẽ cần dấu chấm động, 32 bit mỗi mẫu và phép tính chậm, cho một phép đo mà mấy chữ số cuối vốn đã là nhiễu.</li>
<li><strong>Độ sâu bit là cái núm vặn</strong> — số bit mỗi mẫu, ký hiệu B, quyết định trục dọc bị chia làm bao nhiêu mức: 2<sup>B</sup>. Với B = 8 có 256 mức; với B = 16 có <strong>65.536</strong> mức; với B = 24 có 16.777.216 mức. Âm thanh CD dùng 16.</li>
<li><strong>Sai số lượng tử hoá, tính ra con số</strong> — làm tròn về mức gần nhất nghĩa là sai số tối đa bằng <em>một nửa</em> mức. Càng nhiều mức thì bậc càng nhỏ, sai số càng nhỏ. Sai số không bao giờ biến mất, đó là cái giá của việc biến tương tự thành số.</li>
<li><strong>Sai số ấy nghe ra sao</strong> — một tiếng xì nhẹ bám theo tín hiệu, nghe rõ nhất ở những đoạn nhạc êm nhất. Ở 8 bit nó nghe thấy rõ; ở 16 bit nó nằm dưới cả tiếng ồn của căn phòng bạn đang ngồi nghe, và đó đúng là lý do người ta chọn 16.</li>
<li><strong>Đừng lẫn hai con số</strong> — <em>tần số lấy mẫu</em> (40.000 trong ví dụ xuyên suốt của slide) là lấy bao nhiêu mẫu; <em>độ sâu bit</em> (16) là mỗi mẫu to bao nhiêu. Cái đầu là số lượng, cái sau là bề rộng, và slide 25 sẽ nhân hai cái đó với nhau.</li>
<li><strong>Câu "40.000 giá trị thực cho mỗi mẫu một giây" trên slide</strong> — hãy đọc là "40.000 giá trị mỗi giây", tức tần số lấy mẫu 40.000 Hz. Vẫn đúng ví dụ ấy quay lại ở slide 25.</li>
</ul>
<p class="dap-an">✅ Giải: 17,2 → <strong>17</strong>; 17,7 → <strong>18</strong>. Với độ sâu bit B = 16, tín hiệu bị chia thành 2<sup>16</sup> = <strong>65.536</strong> mức, và sai số làm tròn lớn nhất bằng nửa mức.</p>
<p class="meo">💡 Nhớ cặp đôi này bằng một câu: <em>lấy mẫu quyết định bạn chụp bao nhiêu tấm ảnh của sóng; lượng tử hoá quyết định mỗi tấm ảnh được dùng bao nhiêu màu</em>. Cả hai đều làm mịn thêm được, và cả hai đều tốn dung lượng.</p>`],

      [25, 'Encoding',
        `<p class="y-chinh">🎯 Step 3 of 3, and the formula the exam wants: with <strong>B bits per sample</strong> and <strong>S samples per second</strong>, one second of audio needs <strong>S × B bits</strong>, and that product is the <strong>bit rate R</strong>. The slide's blue line: 40,000 × 16 = <strong>640,000 bits per second</strong>.</p>
<ul>
<li><strong>Check the slide's arithmetic</strong> — 40,000 × 16 = 640,000 ✓. In bytes that is 640,000 / 8 = 80,000 B per second = 80 kB/s, so one minute of that signal is 4,800,000 bytes = <strong>4.8 MB</strong>.</li>
<li><strong>The signed-or-shifted remark</strong> — the slide notes that some systems assign positive and negative values to samples while others shift the whole curve up and use only positive values. Both work; the second lets the samples be stored as plain unsigned integers, which is why slide 24 said "unsigned integer".</li>
<li><strong>The full formula for real audio</strong> — add channels: <em>bit rate = S × B × C</em>. Mono is C = 1, stereo C = 2. The slide's 640,000 is a one-channel figure; forgetting C is the commonest mistake in these questions.</li>
<li><strong>Everything about audio size is one multiplication</strong> — rate × depth × channels × seconds ÷ 8 = bytes. Every audio question in this chapter is that one line with different numbers.</li>
</ul>
<p class="nhan">CD quality, computed end to end (all figures checked on a machine)</p>
<ul>
<li><strong>Bit rate</strong> — 44,100 samples/s × 16 bits × 2 channels = <strong>1,411,200 bits/s</strong> = 1,411.2 kbps.</li>
<li><strong>Bytes per second</strong> — 1,411,200 / 8 = <strong>176,400 B/s</strong>.</li>
<li><strong>Per minute</strong> — 176,400 × 60 = 10,584,000 bytes = <strong>10.584 MB per minute</strong> (10.09 MiB if you divide by 1024 twice).</li>
<li><strong>A 4-minute song</strong> — about <strong>42.3 MB</strong> raw. A 74-minute CD holds roughly 783 MB, which is why an audio CD is quoted at 700 MB and not more.</li>
<li><strong>Why compression is not optional</strong> — the same song as a 128 kbps MP3 is 128,000 × 60 / 8 = 960,000 B per minute, about <strong>0.96 MB/minute</strong>: an <strong>11-fold</strong> reduction (1,411,200 / 128,000 = 11.03). That ratio is why a phone holds a music library at all.</li>
</ul>
<p class="dap-an">✅ Answers: the slide's example gives R = 40,000 × 16 = <strong>640,000 bps</strong> = 80 kB/s = 4.8 MB per minute. CD stereo gives R = <strong>1,411,200 bps</strong> = 10.584 MB per minute.</p>
<p class="pitfall">⚠️ Watch the units in the final answer. Bit rate is in <em>bits</em> per second; file size is in <em>bytes</em>. Divide by 8 exactly once. A common exam answer of 5,644,800 MB instead of 10.584 MB per minute is this division being forgotten or done twice.</p>`,
        `<p class="y-chinh">🎯 Bước 3 trong 3, và là công thức đề thi muốn có: với <strong>B bit mỗi mẫu</strong> và <strong>S mẫu mỗi giây</strong>, một giây âm thanh cần <strong>S × B bit</strong>, và tích đó gọi là <strong>tốc độ bit R</strong>. Dòng màu xanh của slide: 40.000 × 16 = <strong>640.000 bit mỗi giây</strong>.</p>
<ul>
<li><strong>Kiểm lại phép tính của slide</strong> — 40.000 × 16 = 640.000 ✓. Đổi ra byte là 640.000 / 8 = 80.000 B mỗi giây = 80 kB/s, nên một phút tín hiệu ấy là 4.800.000 byte = <strong>4,8 MB</strong>.</li>
<li><strong>Ghi chú về giá trị có dấu hay đã dịch</strong> — slide lưu ý rằng có hệ gán cho mẫu cả giá trị dương lẫn âm, có hệ thì dịch cả đường cong lên trên rồi chỉ dùng giá trị dương. Cách nào cũng chạy; cách thứ hai cho phép lưu mẫu bằng số nguyên KHÔNG DẤU thuần tuý, và đó là lý do slide 24 nói "số nguyên không dấu".</li>
<li><strong>Công thức đầy đủ cho âm thanh thật</strong> — thêm số kênh: <em>tốc độ bit = S × B × C</em>. Đơn kênh (mono) là C = 1, nổi (stereo) là C = 2. Con số 640.000 của slide là số của MỘT kênh; quên mất C là lỗi phổ biến nhất trong dạng bài này.</li>
<li><strong>Mọi chuyện về dung lượng âm thanh chỉ là một phép nhân</strong> — tần số × độ sâu × số kênh × số giây ÷ 8 = số byte. Mọi câu hỏi âm thanh trong chương này đều là đúng một dòng đó với các con số khác nhau.</li>
</ul>
<p class="nhan">Chất lượng CD, tính trọn từ đầu tới cuối (mọi con số đã kiểm bằng máy)</p>
<ul>
<li><strong>Tốc độ bit</strong> — 44.100 mẫu/s × 16 bit × 2 kênh = <strong>1.411.200 bit/s</strong> = 1.411,2 kbps.</li>
<li><strong>Byte mỗi giây</strong> — 1.411.200 / 8 = <strong>176.400 B/s</strong>.</li>
<li><strong>Mỗi phút</strong> — 176.400 × 60 = 10.584.000 byte = <strong>10,584 MB mỗi phút</strong> (10,09 MiB nếu chia cho 1024 hai lần).</li>
<li><strong>Một bài hát 4 phút</strong> — khoảng <strong>42,3 MB</strong> ở dạng thô. Một đĩa CD 74 phút chứa cỡ 783 MB, và đó là lý do đĩa CD âm thanh được ghi là 700 MB chứ không hơn.</li>
<li><strong>Vì sao nén KHÔNG phải tuỳ chọn</strong> — cũng bài hát ấy ở dạng MP3 128 kbps là 128.000 × 60 / 8 = 960.000 B mỗi phút, tức khoảng <strong>0,96 MB/phút</strong>: giảm <strong>11 lần</strong> (1.411.200 / 128.000 = 11,03). Đúng tỉ lệ đó là lý do một cái điện thoại chứa nổi cả một kho nhạc.</li>
</ul>
<p class="dap-an">✅ Đáp án: ví dụ của slide cho R = 40.000 × 16 = <strong>640.000 bps</strong> = 80 kB/s = 4,8 MB mỗi phút. CD nổi hai kênh cho R = <strong>1.411.200 bps</strong> = 10,584 MB mỗi phút.</p>
<p class="pitfall">⚠️ Coi chừng đơn vị ở đáp án cuối. Tốc độ bit tính bằng <em>bit</em> mỗi giây; dung lượng tệp tính bằng <em>byte</em>. Chia cho 8 đúng MỘT lần. Kiểu đáp án 5.644.800 MB thay vì 10,584 MB mỗi phút chính là do quên chia, hoặc chia hai lần.</p>`],

      [26, 'Standards for Sound Encoding',
        `<p class="y-chinh">🎯 The named standard: <strong>MP3 (MPEG Layer 3)</strong>, a modification of the MPEG video compression method. The slide gives its parameters — <strong>44,100 samples per second, 16 bits per sample, giving a signal of 705,600 bits per second</strong> — which is then compressed by <strong>discarding information the human ear cannot detect: lossy compression</strong>, as opposed to <strong>lossless</strong>.</p>
<ul>
<li><strong>Check the slide's number</strong> — 44,100 × 16 = 705,600 ✓ exactly. But note what that figure is: it is <strong>one channel</strong>. Stereo CD-quality audio is 44,100 × 16 × 2 = 1,411,200 bits per second. The slide computed the mono rate; both numbers are correct, they just answer different questions, so say which one you mean in an exam.</li>
<li><strong>Lossy compression, defined</strong> — information is permanently thrown away and the original cannot be reconstructed. MP3 uses <em>psychoacoustics</em>: a quiet tone right after a loud one is inaudible (masking), so it is simply not stored. The ear never notices what it could not have heard.</li>
<li><strong>Lossless compression, defined</strong> — nothing is lost; the original file comes back bit for bit. It works by removing <em>redundancy</em>, not detail. FLAC and ALAC for audio, PNG for images, ZIP for anything.</li>
<li><strong>The ratios, measured</strong> — lossy MP3 at 128 kbps is about <strong>11 times</strong> smaller than raw CD stereo. Lossless FLAC typically reaches only about 2 times. The difference is exactly the information MP3 decided you would not miss.</li>
<li><strong>When to use which, the exam answer</strong> — <em>lossy</em> for final consumption of media a human will only look at or listen to (music, photos, video streams). <strong>Lossless</strong> for anything that will be edited again, archived, or where every bit matters: master recordings, medical images, program code, text, databases, ZIP archives.</li>
<li><strong>The rule that decides it in one sentence</strong> — if losing a detail nobody can perceive is acceptable, lossy is a bargain; if the data will be processed by a machine rather than perceived by a person, lossy is unacceptable. Compressing an executable file lossily would simply break it.</li>
</ul>
<p class="dap-an">✅ Answers: 44,100 × 16 = <strong>705,600 bps</strong> for one channel, and 1,411,200 bps for stereo. MP3 is <strong>lossy</strong> (JPEG too); FLAC, PNG and ZIP are <strong>lossless</strong>.</p>
<p class="pitfall">⚠️ Never re-encode a lossy file into another lossy format, and never "restore" one by saving it at a higher bit rate. The discarded information is gone; a second pass only throws away more. Each generation of an MP3 re-saved as MP3 sounds measurably worse, and no setting brings it back.</p>`,
        `<p class="y-chinh">🎯 Chuẩn có tên: <strong>MP3 (MPEG Layer 3)</strong>, một biến thể của phương pháp nén video MPEG. Slide cho các tham số của nó — <strong>44.100 mẫu mỗi giây, 16 bit mỗi mẫu, cho tín hiệu 705.600 bit mỗi giây</strong> — rồi nén lại bằng cách <strong>vứt bỏ thông tin mà tai người không nhận ra được: nén CÓ MẤT MÁT (lossy)</strong>, đối lập với <strong>nén KHÔNG MẤT MÁT (lossless)</strong>.</p>
<ul>
<li><strong>Kiểm con số của slide</strong> — 44.100 × 16 = 705.600 ✓ đúng chằn chặn. Nhưng để ý con số ấy là gì: nó là của <strong>MỘT kênh</strong>. Âm thanh nổi chất lượng CD là 44.100 × 16 × 2 = 1.411.200 bit mỗi giây. Slide tính tốc độ bit của bản đơn kênh; cả hai con số đều đúng, chỉ là trả lời hai câu hỏi khác nhau, nên đi thi phải nói rõ mình đang nói con số nào.</li>
<li><strong>Nén có mất mát, định nghĩa</strong> — thông tin bị vứt bỏ vĩnh viễn, không dựng lại được bản gốc. MP3 dùng <em>tâm lý âm học</em>: một âm nhỏ đi ngay sau một âm lớn thì tai không nghe ra (hiệu ứng che lấp), nên nó đơn giản là không được lưu. Tai chẳng bao giờ nhận ra thứ mà đằng nào nó cũng không nghe được.</li>
<li><strong>Nén không mất mát, định nghĩa</strong> — không mất gì; bản gốc trở về đúng từng bit. Nó chạy bằng cách bỏ <em>phần dư thừa</em>, chứ không bỏ chi tiết. FLAC và ALAC cho âm thanh, PNG cho ảnh, ZIP cho mọi thứ.</li>
<li><strong>Tỉ lệ, đã tính</strong> — MP3 có mất mát ở 128 kbps nhỏ hơn CD nổi thô khoảng <strong>11 lần</strong>. FLAC không mất mát thường chỉ đạt khoảng 2 lần. Chênh lệch đó đúng bằng phần thông tin mà MP3 đã quyết định rằng bạn sẽ không thấy thiếu.</li>
<li><strong>Khi nào dùng cái nào, câu trả lời đi thi</strong> — <em>có mất mát</em> cho khâu tiêu thụ cuối của thứ mà người ta chỉ nhìn hoặc nghe (nhạc, ảnh chụp, video phát trực tuyến). <strong>Không mất mát</strong> cho thứ còn sửa tiếp, thứ đem lưu trữ, hoặc thứ mà từng bit đều quan trọng: bản thu gốc, ảnh y khoa, mã chương trình, văn bản, cơ sở dữ liệu, tệp nén ZIP.</li>
<li><strong>Luật quyết định gói trong một câu</strong> — nếu mất một chi tiết mà không ai cảm nhận được là chấp nhận được thì nén có mất mát là món hời; còn nếu dữ liệu sẽ được MÁY xử lý chứ không phải NGƯỜI cảm nhận thì nén có mất mát là không thể chấp nhận. Nén một tệp chạy được theo kiểu có mất mát thì đơn giản là làm hỏng nó.</li>
</ul>
<p class="dap-an">✅ Đáp án: 44.100 × 16 = <strong>705.600 bps</strong> cho một kênh, và 1.411.200 bps cho hai kênh nổi. MP3 là <strong>có mất mát</strong> (JPEG cũng vậy); FLAC, PNG và ZIP là <strong>không mất mát</strong>.</p>
<p class="pitfall">⚠️ Đừng bao giờ mã hoá lại một tệp đã mất mát sang một định dạng mất mát khác, và đừng bao giờ "phục hồi" nó bằng cách lưu lại ở tốc độ bit cao hơn. Thông tin đã vứt là mất hẳn; lượt thứ hai chỉ vứt thêm. Mỗi đời một tệp MP3 được lưu lại thành MP3 là một lần nghe tệ đi đo được, và không thiết lập nào kéo nó về được.</p>`],

      [27, '3.3 Storing Images',
        `<p class="y-chinh">🎯 Images are stored by <strong>two different techniques: raster graphics and vector graphics</strong>. This slide sets up raster: a photograph is analog data like audio, except <strong>the intensity (colour) varies in SPACE instead of in TIME</strong>, so it must be sampled too — and here sampling is called <strong>scanning</strong>, the samples are called <strong>pixels</strong>, the rate is called <strong>resolution</strong>, and the bits per sample are called <strong>colour depth</strong>.</p>
<ul>
<li><strong>The whole slide is slide 23 and 24 with new names</strong> — build the mapping once and the section is free: sampling → scanning · sample → pixel · sampling rate → resolution · bit depth → colour depth. The mathematics does not change at all.</li>
<li><strong>Resolution, as the slide defines it</strong> — "how many pixels we should record for each square or linear inch". That is the dots-per-inch sense (a scanner at 300 dpi). In everyday speech "resolution" also means the total pixel count of an image, such as 1920 × 1080. Both meanings appear in exams; read which one is being asked.</li>
<li><strong>Colour depth</strong> — the number of bits used to represent one pixel. 1 bit gives black and white, 8 bits give 256 levels or 256 palette colours, <strong>24 bits give True-Color</strong> (slide 28) with 2<sup>24</sup> = 16,777,216 colours = 256 reds × 256 greens × 256 blues.</li>
<li><strong>Two knobs, two axes</strong> — resolution controls the two space axes, colour depth controls the value axis. Raising either raises quality and file size together, exactly as sampling rate and bit depth did for audio.</li>
</ul>
<p class="nhan">The size of one raw image, computed (all figures checked on a machine)</p>
<ul>
<li><strong>The formula</strong> — bytes = width × height × colour depth ÷ 8.</li>
<li><strong>A Full-HD photo, 1920 × 1080, True-Color 24 bits</strong> — pixels: 1920 × 1080 = <strong>2,073,600</strong>. Bits: 2,073,600 × 24 = <strong>49,766,400</strong>. Bytes: ÷ 8 = <strong>6,220,800</strong> = <strong>6.22 MB</strong> (5.93 MiB if you divide by 1024 twice).</li>
<li><strong>The same picture at 8-bit indexed colour</strong> — 2,073,600 bytes = 2.07 MB, exactly one third, because 8 bits is one third of 24. That is what slide 29's GIF buys, and what it costs in colours: 256 instead of 16.7 million.</li>
<li><strong>Why JPEG exists</strong> — 6.22 MB per photograph fills a phone in a few hundred shots. JPEG at a typical setting brings the same image to roughly 0.6 MB, about <strong>10 times</strong> smaller, by discarding fine detail the eye is poor at seeing — the same lossy bargain as MP3 on slide 26.</li>
<li><strong>And why video needs it even more</strong> — the same frame 25 times a second is 1920 × 1080 × 3 × 25 = <strong>155.5 MB per second</strong> raw, about <strong>840 GB</strong> for a 90-minute film. A DVD would hold 30 seconds of it. Real 1080p video at 5 Mbps stores that film in about 3.4 GB — a compression ratio near 250.</li>
</ul>
<p class="dap-an">✅ A 1920 × 1080 True-Color image = 2,073,600 pixels × 24 bits = 49,766,400 bits = <strong>6,220,800 bytes ≈ 6.22 MB</strong> uncompressed. At 8-bit colour depth the same image is <strong>2.07 MB</strong>.</p>
<p class="pitfall">⚠️ Two decimal-versus-binary traps. (1) 6,220,800 bytes is <strong>6.22 MB</strong> if MB means 10<sup>6</sup> bytes, but <strong>5.93 MiB</strong> if you divide by 1024 twice — state which convention you used and you cannot be marked wrong. (2) Divide by 8 to go from bits to bytes exactly once; colour depth is given in <em>bits</em> per pixel, not bytes.</p>`,
        `<p class="y-chinh">🎯 Ảnh được lưu bằng <strong>hai kỹ thuật khác nhau: đồ hoạ raster và đồ hoạ vector</strong>. Slide này dựng nền cho raster: một tấm ảnh chụp là dữ liệu tương tự y như âm thanh, chỉ khác ở chỗ <strong>cường độ (màu) biến thiên theo KHÔNG GIAN thay vì theo THỜI GIAN</strong>, nên nó cũng phải lấy mẫu — và ở đây lấy mẫu gọi là <strong>quét (scanning)</strong>, các mẫu gọi là <strong>điểm ảnh (pixel)</strong>, tần số gọi là <strong>độ phân giải (resolution)</strong>, còn số bit mỗi mẫu gọi là <strong>độ sâu màu (colour depth)</strong>.</p>
<ul>
<li><strong>Cả slide này là slide 23 và 24 với tên mới</strong> — lập bảng ánh xạ một lần là cả mục này thành miễn phí: lấy mẫu → quét · mẫu → điểm ảnh · tần số lấy mẫu → độ phân giải · độ sâu bit → độ sâu màu. Phần toán không đổi một chút nào.</li>
<li><strong>Độ phân giải, theo đúng định nghĩa của slide</strong> — "ghi bao nhiêu điểm ảnh cho mỗi inch vuông hoặc mỗi inch dài". Đó là nghĩa chấm-trên-inch (máy quét 300 dpi). Trong lời nói thường ngày, "độ phân giải" còn có nghĩa là tổng số điểm ảnh của tấm ảnh, kiểu 1920 × 1080. Cả hai nghĩa đều ra đề; đọc kỹ xem đề đang hỏi nghĩa nào.</li>
<li><strong>Độ sâu màu</strong> — số bit dùng để biểu diễn một điểm ảnh. 1 bit cho đen trắng, 8 bit cho 256 mức xám hoặc 256 màu trong bảng, <strong>24 bit cho True-Color</strong> (slide 28) với 2<sup>24</sup> = 16.777.216 màu = 256 mức đỏ × 256 mức lục × 256 mức lam.</li>
<li><strong>Hai cái núm, hai trục</strong> — độ phân giải điều khiển hai trục không gian, độ sâu màu điều khiển trục giá trị. Vặn cái nào lên thì chất lượng và dung lượng cùng tăng, y hệt tần số lấy mẫu và độ sâu bit ở phần âm thanh.</li>
</ul>
<p class="nhan">Dung lượng một tấm ảnh thô, tính ra số (mọi con số đã kiểm bằng máy)</p>
<ul>
<li><strong>Công thức</strong> — số byte = rộng × cao × độ sâu màu ÷ 8.</li>
<li><strong>Một ảnh Full-HD 1920 × 1080, True-Color 24 bit</strong> — số điểm ảnh: 1920 × 1080 = <strong>2.073.600</strong>. Số bit: 2.073.600 × 24 = <strong>49.766.400</strong>. Số byte: ÷ 8 = <strong>6.220.800</strong> = <strong>6,22 MB</strong> (5,93 MiB nếu chia cho 1024 hai lần).</li>
<li><strong>Cũng tấm ảnh ấy ở màu chỉ mục 8 bit</strong> — 2.073.600 byte = 2,07 MB, đúng một phần ba, vì 8 bit bằng một phần ba của 24 bit. Đó là thứ định dạng GIF ở slide 29 mua được, và cái giá phải trả là số màu: 256 thay vì 16,7 triệu.</li>
<li><strong>Vì sao JPEG tồn tại</strong> — 6,22 MB mỗi tấm ảnh thì vài trăm kiểu là đầy điện thoại. JPEG ở mức thiết lập thông thường kéo cũng tấm ảnh ấy xuống cỡ 0,6 MB, nhỏ hơn khoảng <strong>10 lần</strong>, bằng cách vứt những chi tiết li ti mà mắt vốn nhìn kém — đúng món hời có mất mát như MP3 ở slide 26.</li>
<li><strong>Và vì sao video còn cần nén hơn nữa</strong> — cũng khung hình ấy 25 lần mỗi giây là 1920 × 1080 × 3 × 25 = <strong>155,5 MB mỗi giây</strong> ở dạng thô, tức khoảng <strong>840 GB</strong> cho một bộ phim 90 phút. Một đĩa DVD chứa được 30 giây của nó. Video 1080p thật ở 5 Mbps lưu cả bộ phim đó trong khoảng 3,4 GB — tỉ lệ nén gần 250 lần.</li>
</ul>
<p class="dap-an">✅ Một ảnh 1920 × 1080 True-Color = 2.073.600 điểm ảnh × 24 bit = 49.766.400 bit = <strong>6.220.800 byte ≈ 6,22 MB</strong> khi chưa nén. Ở độ sâu màu 8 bit, cũng ảnh ấy là <strong>2,07 MB</strong>.</p>
<p class="pitfall">⚠️ Hai cái bẫy thập phân so với nhị phân. (1) 6.220.800 byte là <strong>6,22 MB</strong> nếu MB nghĩa là 10<sup>6</sup> byte, nhưng là <strong>5,93 MiB</strong> nếu chia cho 1024 hai lần — nói rõ bạn dùng quy ước nào thì không ai chấm sai bạn được. (2) Chia cho 8 để đổi bit sang byte đúng MỘT lần; độ sâu màu được cho bằng <em>bit</em> trên điểm ảnh, không phải byte.</p>`],

    ]),
  ].join('\n'),
};
