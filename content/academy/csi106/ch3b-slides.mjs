/**
 * CSI106 · Chương 3 — Data storage & Operations on Data, học theo từng slide: PHẦN B (slide 28–54).
 * Deck 'csi3' (CSI3), 54 slide, ảnh đã render lên CDN images/academy/CSI106/v1/csi3/NNN.webp.
 *
 * Nội dung bám ĐÚNG chữ trích từ CSI_03.pptx của trường (/tmp/csi106-text/csi3.txt, slide 28→54).
 * Các slide chỉ có tiêu đề + hình (36, 37, 38, 39, 40, 42, 43, 44, 45, 47, 48, 49, 50, 51, 53, 54)
 * đã được đọc thẳng từ ảnh đã render để lấy đúng từng con số trong bảng và trong ví dụ.
 *
 * MỌI phép tính trong bài đã được kiểm lại bằng python3 (toán tử &, |, ^, ~, <<, >> trên 8 bit,
 * và struct.pack('>f') cho phần dấu phẩy động của slide 54) trước khi viết ra.
 *
 * Những chỗ SLIDE GỐC SAI hoặc tự mâu thuẫn — đã nêu rõ trong bài, KHÔNG im lặng chép lại
 * và KHÔNG tự ý sửa slide:
 *   · slide 44 mang tiêu đề "Logical Right/Left Circular Shift Operations" nhưng HÌNH bên trên
 *     lại dán nhãn "a. Arithmetic right shift / b. Arithmetic left shift" — đó là hình của
 *     slide 45, không phải hình dịch vòng.
 *   · slide 44 Example 3.8 nói "circular LEFT shift on 10011000" và "bit trái nhất vòng sang
 *     phải", nhưng BỨC HÌNH kèm theo lại là 10011001 → 11001100, tức một phép dịch vòng PHẢI
 *     (và trùng y hệt hình của slide 45). Đáp án đúng của đề bài trên chữ là 00110001.
 *   · slide 43 và slide 44 cùng mang chú thích "Logical shift operations" cho hai hình khác nhau
 *     (Figure 3.5 và Figure 3.6).
 *   · slide 48 và slide 50 CÙNG mang nhãn "Figure 3.8".
 *   · slide 53 chú thích "Figure 3.9 Addition and subtraction of INTEGERS in floating-point
 *     format" — phải là "of REALS" (số thực), chính tiêu đề slide đã ghi đúng là "reals".
 *   · slide 51 và slide 54 CÙNG đánh số "Example 3.11".
 *   · slide 40 viết "Compare the output in this example with the one in Example 4.5" và slide 52
 *     viết "Figure 4.8" — số cũ của Forouzan chương 4, deck này đã đánh lại thành 3.x.
 *   · slide 51 in "SB = SB" vì mất dấu gạch ngang phủ định khi chuyển slide: phải đọc là
 *     S_B ← NOT S_B (đảo dấu của số bị trừ).
 *   · slide 33 và slide 34 vẫn gọi các mục là "4.1 Logic / 4.2 Shift / 4.3 Arithmetic" trong khi
 *     deck đặt tên chương là "3.2 Operations on Data".
 */
import { walk, walkHead } from './_slides.mjs';

const D = 'csi3';

export default {
  title: '3.0b — Slide by slide: colour and video, logic operations, masks, shift and arithmetic operations (slides 28–54)|||3.0b — Slide bài giảng: màu & video, phép logic, mặt nạ bit, phép dịch & phép số học (slide 28–54)',
  slug: 'csi106-3-0b-slides-phep-logic-dich-bit',
  type: 'DOCUMENT',
  description: 'Nửa sau Chương 3 của CSI106 (slide 28–54): kết phần lưu trữ ảnh và video (True-Color 24 bit, bảng màu chỉ mục, JPEG/GIF, đồ hoạ vector), rồi vào trọn phần "Operations on Data" — bốn phép logic NOT/AND/OR/XOR ở mức bit và mức mẫu bit, ba việc của mặt nạ bit (xoá bit bằng AND, bật bit bằng OR, lật bit bằng XOR), phép dịch logic – dịch vòng – dịch số học, và phép cộng/trừ số nguyên bù 2, số dấu-và-độ-lớn, số dấu phẩy động. Mỗi ví dụ trên slide được giải từng cột bit rồi mới ra đáp án, mọi phép tính đã kiểm lại bằng máy, và những chỗ slide gốc dán nhầm hình hay đánh trùng số hình đều được chỉ ra thay vì chép lại.',
  content: [
    walkHead(D, 28, 54),
    walk(D, [

      [28, 'Color',
        `<p class="y-chinh">🎯 Two ways to give a pixel a colour: <strong>True-Color</strong> spends 24 bits per pixel and can name 16,777,216 colours; <strong>indexed (palette) colour</strong> spends only 8 bits per pixel and names 256 of them, chosen from that same huge set.</p>
<ul>
<li><strong>Why 24 bits</strong> — one byte for red, one for green, one for blue, each 0–255. The count is 2<sup>24</sup> = 256 × 256 × 256 = 16,777,216. That is the number in the bottom-right of the slide's figure, and it is worth being able to produce it on demand.</li>
<li><strong>Table 3.4 on the slide</strong> — black (0,0,0), red (255,0,0), green (0,255,0), blue (0,0,255), yellow (255,255,0), cyan (0,255,255), magenta (255,0,255), white (255,255,255). Notice yellow = red + green: these are <em>additive</em> primaries (light), not the subtractive primaries of paint.</li>
<li><strong>How indexed colour works</strong> — the file stores a small <em>palette</em> (256 entries, each entry a full 24-bit colour) plus, for every pixel, just an 8-bit <em>index</em> into that palette. The arrows in the figure go index → palette entry → True-Color value.</li>
<li><strong>The saving is exactly 3×</strong> — a 1000 × 1000 image costs 1,000,000 × 3 = 3,000,000 bytes in True-Color, and 1,000,000 × 1 = 1,000,000 bytes plus a 768-byte palette when indexed. That is why GIF (slide 29) is indexed.</li>
<li><strong>The cost</strong> — a photograph of a sunset has far more than 256 distinct colours, so indexing it produces visible banding. Indexed colour suits logos, screenshots and line art; True-Color suits photographs.</li>
</ul>
<p class="meo">💡 Colour depth arithmetic is one line: <em>bytes = width × height × (bits per pixel ÷ 8)</em>. A 1920 × 1080 True-Color frame is 1920 × 1080 × 3 = 6,220,800 bytes ≈ 5.93 MiB — uncompressed. Remember that number when slide 31 starts multiplying frames by seconds.</p>`,
        `<p class="y-chinh">🎯 Hai cách gán màu cho một điểm ảnh: <strong>True-Color</strong> tiêu 24 bit mỗi điểm và gọi tên được 16.777.216 màu; <strong>màu chỉ mục (bảng màu)</strong> chỉ tiêu 8 bit mỗi điểm và gọi tên được 256 màu, chọn ra từ chính cái tập khổng lồ kia.</p>
<ul>
<li><strong>Vì sao 24 bit</strong> — một byte cho đỏ, một cho lục, một cho lam, mỗi kênh 0–255. Số màu là 2<sup>24</sup> = 256 × 256 × 256 = 16.777.216. Đó đúng là con số nằm ở góc dưới bên phải hình trên slide, và bạn nên tự bấm ra được nó bất cứ lúc nào.</li>
<li><strong>Table 3.4 trên slide</strong> — đen (0,0,0), đỏ (255,0,0), lục (0,255,0), lam (0,0,255), vàng (255,255,0), lục lam (0,255,255), đỏ tươi (255,0,255), trắng (255,255,255). Để ý vàng = đỏ + lục: đây là hệ màu <em>cộng</em> (của ánh sáng), không phải hệ màu trừ của sơn vẽ.</li>
<li><strong>Màu chỉ mục chạy thế nào</strong> — tệp lưu một <em>bảng màu</em> nhỏ (256 ô, mỗi ô là một màu 24 bit đầy đủ), còn mỗi điểm ảnh chỉ lưu một <em>chỉ số</em> 8 bit trỏ vào bảng ấy. Các mũi tên trong hình đi theo đúng đường: chỉ số → ô bảng màu → giá trị True-Color.</li>
<li><strong>Tiết kiệm đúng 3 lần</strong> — ảnh 1000 × 1000 tốn 1.000.000 × 3 = 3.000.000 byte nếu True-Color, và 1.000.000 × 1 = 1.000.000 byte cộng bảng màu 768 byte nếu dùng chỉ mục. Đó chính là lý do GIF (slide 29) dùng màu chỉ mục.</li>
<li><strong>Cái giá phải trả</strong> — một bức ảnh hoàng hôn có nhiều hơn 256 màu khác nhau rất xa, nên ép nó xuống bảng màu sẽ thấy rõ các vệt màu loang lổ. Màu chỉ mục hợp với logo, ảnh chụp màn hình, hình nét; True-Color hợp với ảnh chụp.</li>
</ul>
<p class="meo">💡 Phép tính độ sâu màu chỉ có một dòng: <em>số byte = rộng × cao × (số bit mỗi điểm ÷ 8)</em>. Một khung hình 1920 × 1080 True-Color là 1920 × 1080 × 3 = 6.220.800 byte ≈ 5,93 MiB — chưa nén. Nhớ con số ấy, vì slide 31 sắp nhân nó với số khung mỗi giây.</p>`],

      [29, 'Standards for Image Encoding',
        `<p class="y-chinh">🎯 Two de facto standards, and the slide pairs each with the colour scheme of slide 28: <strong>JPEG uses True-Color</strong> and compresses; <strong>GIF uses indexed colour</strong>.</p>
<ul>
<li><strong>JPEG</strong> — Joint Photographic Experts Group, standard published 1992. It keeps 24 bits per pixel but throws away detail the eye is bad at seeing (it transforms 8 × 8 blocks with the DCT and quantises the high-frequency coefficients). It is <em>lossy</em>: saving a JPEG twice degrades it twice. Chapter 15 of Forouzan covers the mechanism.</li>
<li><strong>GIF</strong> — Graphic Interchange Format, CompuServe 1987. Indexed colour, at most 256 colours per image, compressed <em>losslessly</em> with LZW. Supports one transparent index and multiple frames, which is why the internet uses it for animations.</li>
<li><strong>The exam-ready contrast</strong> — JPEG: photographs, millions of colours, lossy, no transparency, no animation. GIF: flat graphics, ≤ 256 colours, lossless, transparency, animation. PNG (not on the slide) is the modern answer: lossless <em>and</em> True-Color <em>and</em> alpha transparency.</li>
<li><strong>The software list</strong> — Photoshop, PhotoImpact, Corel Painter. These are <em>raster</em> editors: they edit the pixel grid itself, which is why enlarging in them makes the picture soft. Slide 30 gives the other family.</li>
<li><strong>Why "de facto"</strong> — the slide chooses the phrase carefully: nobody legislated JPEG and GIF, the market simply settled on them. Compare with a <em>de jure</em> standard such as Unicode (slide 21), which a standards body publishes.</li>
</ul>
<p class="pitfall">⚠️ A frequent exam wrong answer: "GIF compresses more than JPEG". For photographs it is the opposite by a wide margin — GIF must first destroy the photo down to 256 colours and even then its LZW output is usually larger than the JPEG. GIF only wins on images that were already flat-coloured.</p>`,
        `<p class="y-chinh">🎯 Hai chuẩn thực tế, và slide ghép mỗi chuẩn với một cách mã màu của slide 28: <strong>JPEG dùng True-Color</strong> rồi nén; <strong>GIF dùng màu chỉ mục</strong>.</p>
<ul>
<li><strong>JPEG</strong> — Joint Photographic Experts Group, chuẩn công bố năm 1992. Nó giữ 24 bit mỗi điểm ảnh nhưng vứt đi phần chi tiết mà mắt người vốn nhìn kém (biến đổi từng khối 8 × 8 bằng DCT rồi lượng tử hoá các hệ số tần số cao). Nó nén <em>có mất mát</em>: lưu lại một ảnh JPEG hai lần là ảnh xuống cấp hai lần. Chương 15 của Forouzan nói về cơ chế này.</li>
<li><strong>GIF</strong> — Graphic Interchange Format, hãng CompuServe năm 1987. Màu chỉ mục, tối đa 256 màu mỗi ảnh, nén <em>không mất mát</em> bằng LZW. Có một chỉ số trong suốt và nhiều khung hình, nên internet dùng nó để làm ảnh động.</li>
<li><strong>Cặp đối chiếu đủ để thi</strong> — JPEG: ảnh chụp, hàng triệu màu, mất mát, không trong suốt, không động. GIF: hình phẳng, ≤ 256 màu, không mất mát, có trong suốt, có động. PNG (slide không nhắc) là câu trả lời hiện đại: không mất mát <em>và</em> True-Color <em>và</em> có kênh alpha.</li>
<li><strong>Danh sách phần mềm</strong> — Photoshop, PhotoImpact, Corel Painter. Đó là các trình sửa ảnh <em>raster</em>: chúng sửa thẳng lưới điểm ảnh, vì thế phóng to trong đó thì hình bị nhoè. Slide 30 đưa ra họ còn lại.</li>
<li><strong>Vì sao gọi là "de facto"</strong> — slide dùng chữ rất có ý: không ai ra luật bắt dùng JPEG hay GIF, thị trường tự chọn chúng. So với chuẩn <em>de jure</em> như Unicode (slide 21), do một tổ chức tiêu chuẩn công bố.</li>
</ul>
<p class="pitfall">⚠️ Một đáp án sai hay gặp trong đề: "GIF nén khoẻ hơn JPEG". Với ảnh chụp thì ngược lại và ngược rất xa — GIF buộc phải phá bức ảnh xuống còn 256 màu trước đã, mà kết quả LZW của nó thường vẫn to hơn tệp JPEG. GIF chỉ thắng trên những ảnh vốn đã ít màu, phẳng.</p>`],

      [30, 'Vector Graphics',
        `<p class="y-chinh">🎯 Raster graphics has two defects — <strong>big files</strong> and <strong>ugly rescaling</strong> — and vector graphics fixes both by storing the <em>recipe for drawing</em> the picture instead of the picture itself.</p>
<ul>
<li><strong>What is stored for one circle</strong> — the slide lists exactly four things: (1) the radius r and the equation of a circle, (2) the coordinates of the centre, (3) the stroke style and colour, (4) the fill style and colour. Perhaps forty bytes, and it draws at any size.</li>
<li><strong>Why rescaling a raster image is "troublesome"</strong> — enlarging means enlarging the pixels. A 100 × 100 photo shown at 400 × 400 has to invent 15 pixels out of every 16, so it looks soft or blocky. A vector circle at 400 × 400 is simply re-evaluated at the new radius: the edge stays razor-sharp.</li>
<li><strong>The trade-off is the reverse of everything above</strong> — vector graphics cannot represent a photograph. There is no equation for your grandmother's face. Rule of thumb: <em>if a camera or a scanner made it, it is raster; if a human drew it from shapes, it can be vector.</em></li>
<li><strong>Formats</strong> — the slide gives EPS, WMF, AI, CDR. Today's web standard, SVG, is missing from the slide: it is XML, so you can literally open one in a text editor and read the circle's centre and radius as plain text.</li>
<li><strong>Software</strong> — Illustrator, CorelDRAW, Flash. Note the pairing: slide 29 named the raster editors, slide 30 names the vector editors. An exam question of the form "which of these is a vector tool?" is asking you to remember which list a name came from.</li>
</ul>
<p class="meo">💡 The one-sentence test you can apply to any picture: <strong>zoom in hard. If you see squares, it is raster; if the curve stays smooth, it is vector.</strong> That is also why company logos are shipped as vector files — they have to look right both on a business card and on a building.</p>`,
        `<p class="y-chinh">🎯 Đồ hoạ raster có hai nhược điểm — <strong>tệp to</strong> và <strong>phóng to thì xấu</strong> — và đồ hoạ vector chữa cả hai bằng cách lưu <em>công thức để vẽ</em> bức hình thay vì lưu chính bức hình.</p>
<ul>
<li><strong>Lưu gì cho một hình tròn</strong> — slide liệt kê đúng bốn thứ: (1) bán kính r và phương trình đường tròn, (2) toạ độ tâm, (3) kiểu nét và màu nét, (4) kiểu tô và màu tô. Chừng bốn chục byte, mà vẽ được ở mọi kích thước.</li>
<li><strong>Vì sao phóng to ảnh raster là "phiền"</strong> — phóng to nghĩa là phóng to từng điểm ảnh. Ảnh 100 × 100 đem hiện ở 400 × 400 phải bịa ra 15 trên mỗi 16 điểm ảnh, nên nhìn nhoè hoặc vỡ ô vuông. Hình tròn vector ở 400 × 400 chỉ là tính lại với bán kính mới: mép vẫn sắc như dao.</li>
<li><strong>Đánh đổi ngược lại hoàn toàn</strong> — đồ hoạ vector KHÔNG biểu diễn được ảnh chụp. Không có phương trình nào cho khuôn mặt bà bạn. Mẹo phân biệt: <em>máy ảnh hoặc máy quét tạo ra thì là raster; con người vẽ bằng các hình khối thì có thể là vector.</em></li>
<li><strong>Định dạng</strong> — slide đưa EPS, WMF, AI, CDR. Chuẩn của web hiện nay là SVG thì slide thiếu: nó là XML, nên bạn mở thẳng bằng trình soạn thảo văn bản là đọc được tâm và bán kính đường tròn dưới dạng chữ.</li>
<li><strong>Phần mềm</strong> — Illustrator, CorelDRAW, Flash. Để ý cặp đôi: slide 29 kể các trình raster, slide 30 kể các trình vector. Câu hỏi thi dạng "công cụ nào là vector?" thực chất là hỏi bạn nhớ cái tên ấy nằm ở danh sách nào.</li>
</ul>
<p class="meo">💡 Phép thử một câu áp dụng cho mọi bức hình: <strong>phóng thật to lên. Thấy các ô vuông thì là raster; đường cong vẫn mượt thì là vector.</strong> Đó cũng là lý do logo công ty luôn được giao dưới dạng tệp vector — nó phải đẹp cả trên tấm danh thiếp lẫn trên mặt tiền toà nhà.</p>`],

      [31, '3.4 Storing Video',
        `<p class="y-chinh">🎯 One sentence closes the whole chapter on media: <strong>video is images (frames) over time</strong> — information that varies in <em>space</em> (one picture) and in <em>time</em> (a series of pictures).</p>
<ul>
<li><strong>The pattern repeats for the third time</strong> — audio was an analog signal sampled in time (slides 22–25); an image was an analog signal sampled in space (slide 27); video is both at once. Chapter 3 is really one idea applied three times: <em>analog → sample → quantise → encode</em>.</li>
<li><strong>Why the illusion of motion works</strong> — show still frames fast enough and the eye merges them. Cinema settled on 24 frames per second, PAL television on 25, NTSC on 30; games aim for 60 and above because interaction makes stutter obvious.</li>
<li><strong>Do the arithmetic the slide does not do</strong> — one second of uncompressed 1920 × 1080 True-Color video at 30 fps costs 1920 × 1080 × 3 × 30 = 186,624,000 bytes ≈ 178 MiB. A 90-minute film would be about 940 GiB. It plainly does not fit on a disc.</li>
<li><strong>So video is never stored raw</strong> — MPEG and its successors (H.264, H.265, AV1) store one full frame occasionally and, in between, only <em>what changed</em>. A static shot of a talking head barely changes from frame to frame, so the compression ratio reaches 100:1 and more. That is how 940 GiB becomes a 4 GiB file.</li>
<li><strong>Where this chapter ends</strong> — slide 31 is the last slide about <em>storing</em> data. From slide 32 the deck switches to <em>operating on</em> data, which is where the whole of the rest of this lesson lives.</li>
</ul>
<p class="meo">💡 Tie the three media together with one table you write yourself: sampling rate (audio: 44,100 Hz · image: dpi resolution · video: fps), sample size (audio: bit depth · image: colour depth · video: colour depth), total = rate × size. Three rows, and you can derive every media number in the chapter from it.</p>`,
        `<p class="y-chinh">🎯 Một câu khép lại toàn bộ phần media: <strong>video là các bức ảnh (khung hình) theo thời gian</strong> — thông tin biến thiên trong <em>không gian</em> (một bức ảnh) và trong <em>thời gian</em> (một chuỗi ảnh).</p>
<ul>
<li><strong>Cùng một khuôn mẫu, lần thứ ba</strong> — âm thanh là tín hiệu tương tự lấy mẫu theo thời gian (slide 22–25); ảnh là tín hiệu tương tự lấy mẫu theo không gian (slide 27); video là cả hai cùng lúc. Chương 3 thật ra chỉ có một ý áp dụng ba lần: <em>tương tự → lấy mẫu → lượng tử hoá → mã hoá</em>.</li>
<li><strong>Vì sao mắt thấy chuyển động</strong> — chiếu các ảnh tĩnh đủ nhanh thì mắt tự nối chúng lại. Điện ảnh chọn 24 hình/giây, truyền hình PAL 25, NTSC 30; game nhắm 60 trở lên vì có tương tác nên giật là thấy ngay.</li>
<li><strong>Hãy làm phép tính mà slide không làm</strong> — một giây video 1920 × 1080 True-Color 30 hình/giây, chưa nén, tốn 1920 × 1080 × 3 × 30 = 186.624.000 byte ≈ 178 MiB. Một phim 90 phút sẽ vào khoảng 940 GiB. Rõ ràng không nhét vừa cái đĩa nào.</li>
<li><strong>Nên video không bao giờ lưu thô</strong> — MPEG và đám kế tục (H.264, H.265, AV1) thỉnh thoảng mới lưu một khung đầy đủ, còn ở giữa chỉ lưu <em>phần đã đổi</em>. Một cảnh quay tĩnh người nói chuyện gần như không đổi giữa hai khung, nên tỉ số nén lên tới 100:1 và hơn nữa. Đó là cách 940 GiB co lại thành tệp 4 GiB.</li>
<li><strong>Chương này dừng ở đâu</strong> — slide 31 là slide cuối về việc <em>lưu trữ</em> dữ liệu. Từ slide 32 deck chuyển sang <em>thao tác</em> trên dữ liệu, và toàn bộ phần còn lại của bài học này nằm ở đó.</li>
</ul>
<p class="meo">💡 Nối ba loại media lại bằng một bảng bạn tự viết: tốc độ lấy mẫu (âm thanh: 44.100 Hz · ảnh: độ phân giải dpi · video: hình/giây), kích thước mỗi mẫu (âm thanh: độ sâu bit · ảnh: độ sâu màu · video: độ sâu màu), tổng = tốc độ × kích thước. Ba dòng, và bạn suy ra được mọi con số media của cả chương.</p>`],

      [32, '3.2 Operations on Data',
        `<p class="y-chinh">🎯 A section divider, and the hinge of the whole chapter: everything before it asked <em>how do we put data in?</em>, everything after it asks <em>what can we do to the bits once they are there?</em></p>
<ul>
<li><strong>Where this comes from</strong> — it is Forouzan's <em>Chapter 4, Operations on Data</em>, glued on to the end of the deck's Chapter 3. That is why every example is numbered 3.x here while the slides still say "4.1 Logic" on the next slide and "Example 4.5" on slide 40.</li>
<li><strong>Three families, and only three</strong> — logic operations (bit by bit), shift operations (move bits sideways), arithmetic operations (add, subtract, multiply, divide). Slide 33 lists them, slide 34 turns them into objectives, and slides 35–54 work through them in that order.</li>
<li><strong>Why it belongs right after storage</strong> — Chapter 3 spent twenty slides proving that <em>everything</em> in memory is a bit pattern. Once you believe that, "operating on data" can only mean one thing: transforming one bit pattern into another. There is nothing else in the machine to transform.</li>
<li><strong>This is the part with the marks in it</strong> — the storage half is largely definitions; this half is calculation. Exam questions here look like "given 10011001 and 00101110, show the result of XOR" and are marked right or wrong with no partial credit for vocabulary.</li>
<li><strong>It maps 1-to-1 onto C</strong> — every operation from slide 36 to slide 49 exists as an operator in PRF192: <code>~ &amp; | ^ &lt;&lt; &gt;&gt; + -</code>. Learning this section is learning half of C's operator table.</li>
</ul>
<p class="meo">💡 Set yourself one target for this half of the deck: <strong>be able to do any 8-bit operation on paper in under thirty seconds, writing the two operands one above the other.</strong> Speed here comes entirely from the habit of aligning the columns before you start.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục, và là bản lề của cả chương: mọi thứ trước nó hỏi <em>đưa dữ liệu vào bằng cách nào?</em>, mọi thứ sau nó hỏi <em>khi bit đã nằm trong máy rồi thì làm được gì với nó?</em></p>
<ul>
<li><strong>Phần này lấy từ đâu</strong> — đó là <em>Chương 4, Operations on Data</em> của Forouzan, dán vào đuôi Chương 3 của deck. Vì thế mọi ví dụ ở đây đánh số 3.x trong khi slide kế tiếp vẫn ghi "4.1 Logic" và slide 40 vẫn ghi "Example 4.5".</li>
<li><strong>Ba họ, và chỉ ba</strong> — phép logic (từng bit một), phép dịch (đẩy bit sang ngang), phép số học (cộng, trừ, nhân, chia). Slide 33 liệt kê, slide 34 biến chúng thành mục tiêu, và slide 35–54 đi qua đúng thứ tự ấy.</li>
<li><strong>Vì sao nó nằm ngay sau phần lưu trữ</strong> — Chương 3 đã tiêu hai chục slide để chứng minh rằng <em>mọi thứ</em> trong bộ nhớ đều là một mẫu bit. Đã tin điều đó thì "thao tác trên dữ liệu" chỉ có thể nghĩa là: biến một mẫu bit thành một mẫu bit khác. Trong máy không còn gì khác để mà biến đổi.</li>
<li><strong>Đây là nửa có điểm</strong> — nửa lưu trữ phần lớn là định nghĩa; nửa này là tính toán. Câu hỏi thi ở đây trông như "cho 10011001 và 00101110, hãy tính XOR", và chấm đúng/sai dứt khoát, không có điểm an ủi cho việc thuộc thuật ngữ.</li>
<li><strong>Nó ánh xạ 1-1 sang C</strong> — mọi phép từ slide 36 đến slide 49 đều tồn tại dưới dạng toán tử trong PRF192: <code>~ &amp; | ^ &lt;&lt; &gt;&gt; + -</code>. Học phần này là học nửa bảng toán tử của C.</li>
</ul>
<p class="meo">💡 Đặt cho mình đúng một mục tiêu cho nửa deck này: <strong>làm được mọi phép 8 bit trên giấy trong dưới ba mươi giây, bằng cách viết hai toán hạng chồng lên nhau.</strong> Tốc độ ở đây hoàn toàn đến từ thói quen kẻ thẳng cột trước khi tính.</p>`],

      [33, 'Content',
        `<p class="y-chinh">🎯 Three sections, and the order is not arbitrary: <strong>logic → shift → arithmetic</strong>, because arithmetic is built out of the first two.</p>
<ul>
<li><strong>4.1 Logic</strong> (slides 35–40) — NOT, AND, OR, XOR, first on single bits, then applied column by column to whole patterns. This is where bit masks come from, and masks are the most examinable idea in the chapter.</li>
<li><strong>4.2 Shift</strong> (slides 41–45) — logical shift, logical circular shift (rotate), arithmetic shift. Three kinds, and the exam's favourite question is telling them apart.</li>
<li><strong>4.3 Arithmetic operations</strong> (slides 46–54) — addition and subtraction in two's complement, in sign-and-magnitude, and in floating point. Multiplication and division are mentioned but not worked through.</li>
<li><strong>Why the order matters</strong> — an adder circuit is built from XOR gates (the sum bit) and AND gates (the carry bit); a multiply by 2 <em>is</em> a left shift. So sections 4.1 and 4.2 are literally the parts section 4.3 is assembled from.</li>
<li><strong>The numbering, again</strong> — this slide says "4.1/4.2/4.3" while the deck's own title slide said "3.2 Operations on Data". Both refer to the same three sections; do not waste time looking for a section 3.2.1.</li>
</ul>
<p class="pitfall">⚠️ Do not read "Content" slides as filler. In an exam that asks "list the three categories of operations performed on data" — which is objective number one on slide 34 — this slide <em>is</em> the answer, word for word.</p>`,
        `<p class="y-chinh">🎯 Ba mục, và thứ tự không hề tuỳ tiện: <strong>logic → dịch → số học</strong>, vì phép số học được lắp từ hai cái trước.</p>
<ul>
<li><strong>4.1 Logic</strong> (slide 35–40) — NOT, AND, OR, XOR, trước hết trên từng bit đơn, rồi áp từng cột cho cả mẫu bit. Mặt nạ bit sinh ra từ đây, mà mặt nạ là ý dễ ra đề nhất cả chương.</li>
<li><strong>4.2 Shift</strong> (slide 41–45) — dịch logic, dịch vòng logic (rotate), dịch số học. Ba loại, và câu hỏi thi ưa thích nhất là phân biệt chúng.</li>
<li><strong>4.3 Arithmetic operations</strong> (slide 46–54) — cộng trừ trong bù 2, trong dấu-và-độ-lớn, và trong dấu phẩy động. Nhân chia có nhắc nhưng không giải chi tiết.</li>
<li><strong>Vì sao thứ tự quan trọng</strong> — mạch cộng được lắp từ cổng XOR (bit tổng) và cổng AND (bit nhớ); còn nhân 2 <em>chính là</em> một phép dịch trái. Nên mục 4.1 và 4.2 đúng nghĩa đen là các linh kiện dùng để lắp ra mục 4.3.</li>
<li><strong>Lại chuyện đánh số</strong> — slide này ghi "4.1/4.2/4.3" trong khi slide tiêu đề của chính deck ghi "3.2 Operations on Data". Cả hai cùng trỏ vào ba mục ấy; đừng mất công đi tìm một mục 3.2.1.</li>
</ul>
<p class="pitfall">⚠️ Đừng coi slide "Content" là slide lấp chỗ. Với câu hỏi "liệt kê ba loại thao tác thực hiện trên dữ liệu" — đúng mục tiêu số một ở slide 34 — thì slide này <em>chính là</em> đáp án, từng chữ một.</p>`],

      [34, 'Objectives',
        `<p class="y-chinh">🎯 Six objectives, and five of them start with a verb of <em>doing</em>: perform, distinguish, perform, perform, perform. That tells you this half of the chapter is examined with a pen, not with a definition.</p>
<ul>
<li><strong>"List the three categories of operations"</strong> — logic, shift, arithmetic. The only recall objective on the slide; slide 33 is its answer.</li>
<li><strong>"Perform unary and binary logic operations on bit patterns"</strong> — <em>unary</em> means one operand (only NOT); <em>binary</em> means two operands (AND, OR, XOR). The word "binary" here means two-input, not base-2. Slides 37–40.</li>
<li><strong>"Distinguish between logic and arithmetic shift operations"</strong> — the single most-asked question of section 4.2. The answer in one line: a logical shift feeds in a 0; an arithmetic <em>right</em> shift copies the sign bit back in. Slides 43 and 45.</li>
<li><strong>"Perform addition and subtraction … in two's complement"</strong> — slides 47–49. Note that subtraction is never performed: it is converted to an addition.</li>
<li><strong>"Perform addition and subtraction … in sign-and-magnitude"</strong> — slides 50–51, and it is much fussier: signs compared, magnitudes complemented, overflow examined.</li>
<li><strong>"Perform addition and subtraction on reals in floating-point format"</strong> — slides 52–54: de-normalise, align exponents, add as sign-and-magnitude, normalise, round.</li>
</ul>
<p class="meo">💡 Turn these six lines into six worked problems rather than six flashcards. If you can, from a blank sheet, produce one correct example of each — a NOT, an AND, a logical shift, an arithmetic shift, a two's complement addition with overflow, and a floating-point addition — you have finished slides 32–54.</p>`,
        `<p class="y-chinh">🎯 Sáu mục tiêu, và năm trong đó bắt đầu bằng động từ <em>làm</em>: perform, distinguish, perform, perform, perform. Điều đó cho biết nửa chương này thi bằng cây bút, không thi bằng định nghĩa.</p>
<ul>
<li><strong>"Liệt kê ba loại thao tác"</strong> — logic, dịch, số học. Mục tiêu duy nhất thuộc dạng nhớ lại trên slide; đáp án nằm ở slide 33.</li>
<li><strong>"Thực hiện phép logic một ngôi và hai ngôi trên các mẫu bit"</strong> — <em>một ngôi</em> nghĩa là một toán hạng (chỉ có NOT); <em>hai ngôi</em> nghĩa là hai toán hạng (AND, OR, XOR). Chữ "binary" ở đây nghĩa là hai đầu vào, không phải hệ cơ số 2. Slide 37–40.</li>
<li><strong>"Phân biệt dịch logic với dịch số học"</strong> — câu hỏi hay ra nhất của mục 4.2. Đáp án một dòng: dịch logic đẩy số 0 vào; dịch số học <em>phải</em> chép lại bit dấu vào. Slide 43 và 45.</li>
<li><strong>"Thực hiện cộng trừ … trong bù 2"</strong> — slide 47–49. Để ý rằng máy không bao giờ thực sự trừ: nó đổi phép trừ thành phép cộng.</li>
<li><strong>"Thực hiện cộng trừ … trong dấu-và-độ-lớn"</strong> — slide 50–51, và cách này rườm rà hơn nhiều: so dấu, lấy bù độ lớn, xét tràn.</li>
<li><strong>"Thực hiện cộng trừ trên số thực dạng dấu phẩy động"</strong> — slide 52–54: bỏ chuẩn hoá, căn chỉnh số mũ, cộng như dấu-và-độ-lớn, chuẩn hoá lại, làm tròn.</li>
</ul>
<p class="meo">💡 Hãy biến sáu dòng này thành sáu bài tập đã giải, đừng biến thành sáu tấm thẻ học thuộc. Nếu từ tờ giấy trắng bạn viết ra được mỗi loại một ví dụ đúng — một NOT, một AND, một dịch logic, một dịch số học, một phép cộng bù 2 có tràn, và một phép cộng dấu phẩy động — thì slide 32–54 coi như xong.</p>`],

      [35, '1 - Logic Operations',
        `<p class="y-chinh">🎯 A section divider for the first and most reusable family. Everything in slides 36–40 rests on one sentence: <strong>a logic operation on an n-bit pattern is just n copies of the same one-bit operation, run in parallel, one per column.</strong></p>
<ul>
<li><strong>Two levels, and you must keep them apart</strong> — the <em>bit level</em> is the truth table (four rows for a two-input operator); the <em>pattern level</em> is eight of those truth tables applied side by side. Slide 36 states this explicitly, and every example from 37 to 40 demonstrates it.</li>
<li><strong>Four operators, no more</strong> — NOT (unary), AND, OR, XOR (binary). There are formally sixteen possible two-input boolean functions, but every one of them can be written using these, so these are what the hardware provides.</li>
<li><strong>Why "logic"</strong> — because if you read 0 as <em>false</em> and 1 as <em>true</em>, the tables are exactly the logic you already use in an <code>if</code> statement. The machine reuses one idea for both: truth values and bit twiddling.</li>
<li><strong>The real payoff is masking</strong> — slides 38, 39 and 40 each end with a little green box (<em>x AND 0 → 0</em>, <em>x OR 1 → 1</em>, <em>x XOR 1 → NOT x</em>). Those three boxes are the whole theory of bit masks, and they are what the exam actually tests.</li>
<li><strong>In C</strong> — <code>&amp;</code>, <code>|</code>, <code>^</code>, <code>~</code> are these four. Beware: <code>&amp;&amp;</code> and <code>||</code> are the <em>logical</em> operators that work on whole values, not on columns. <code>5 &amp; 2</code> is 0; <code>5 &amp;&amp; 2</code> is 1.</li>
</ul>
<p class="pitfall">⚠️ The single most common mistake in this section is doing the operation on the <em>numbers</em> instead of on the <em>bits</em>. 12 AND 10 is not 8 because "8 is smaller" — it is 8 because 1100 AND 1010 = 1000. Always write the two patterns one above the other first.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục cho họ phép đầu tiên và dùng lại được nhiều nhất. Mọi thứ trong slide 36–40 đứng trên đúng một câu: <strong>một phép logic trên mẫu n bit chỉ là n bản sao của cùng một phép trên một bit, chạy song song, mỗi cột một bản.</strong></p>
<ul>
<li><strong>Hai mức, và phải tách bạch</strong> — <em>mức bit</em> là bảng chân trị (bốn dòng với toán tử hai đầu vào); <em>mức mẫu bit</em> là tám cái bảng chân trị ấy đặt cạnh nhau. Slide 36 nói thẳng điều này, và mọi ví dụ từ 37 tới 40 minh hoạ nó.</li>
<li><strong>Bốn toán tử, không hơn</strong> — NOT (một ngôi), AND, OR, XOR (hai ngôi). Về hình thức có mười sáu hàm boole hai đầu vào, nhưng cái nào cũng viết lại được bằng bốn cái này, nên phần cứng chỉ cung cấp bốn cái này.</li>
<li><strong>Vì sao gọi là "logic"</strong> — vì nếu đọc 0 là <em>sai</em> và 1 là <em>đúng</em> thì mấy cái bảng ấy đúng là thứ logic bạn vẫn dùng trong câu lệnh <code>if</code>. Máy dùng chung một ý cho cả hai việc: giá trị chân lý và nghịch bit.</li>
<li><strong>Cái lợi thật sự là mặt nạ bit</strong> — slide 38, 39 và 40 mỗi slide kết bằng một ô xanh nhỏ (<em>x AND 0 → 0</em>, <em>x OR 1 → 1</em>, <em>x XOR 1 → NOT x</em>). Ba cái ô đó là toàn bộ lý thuyết mặt nạ bit, và đó mới là thứ đề thi hỏi thật.</li>
<li><strong>Trong C</strong> — <code>&amp;</code>, <code>|</code>, <code>^</code>, <code>~</code> chính là bốn cái này. Cẩn thận: <code>&amp;&amp;</code> và <code>||</code> là toán tử <em>luận lý</em>, làm việc trên cả giá trị chứ không trên từng cột. <code>5 &amp; 2</code> bằng 0; còn <code>5 &amp;&amp; 2</code> bằng 1.</li>
</ul>
<p class="pitfall">⚠️ Lỗi phổ biến nhất mục này là làm phép trên <em>con số</em> thay vì trên <em>bit</em>. 12 AND 10 bằng 8 không phải vì "8 nhỏ hơn" — nó bằng 8 vì 1100 AND 1010 = 1000. Luôn viết hai mẫu bit chồng lên nhau trước đã.</p>`],

      [36, '1. Introduction (logic operations)',
        `<p class="y-chinh">🎯 The four truth tables, all on one slide. Learn these sixteen output bits and the rest of section 4.1 is mechanical.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>y</strong></td><td><strong>NOT x</strong></td><td><strong>x AND y</strong></td><td><strong>x OR y</strong></td><td><strong>x XOR y</strong></td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
</table>
<ul>
<li><strong>Read each column as one sentence</strong> — AND: 1 only when <em>both</em> are 1. OR: 0 only when <em>both</em> are 0. XOR: 1 when the two inputs <em>differ</em>. NOT: flip. Three of those four sentences say "only", which is why they are easy to remember.</li>
<li><strong>The slide's exact wording</strong> — "a logic operation at the pattern level is n logic operations, of the same type, at the bit level, where n is the number of bits in the pattern". That is the definition an exam wants back.</li>
<li><strong>Why 0 = false, 1 = true</strong> — the slide states the convention because without it, the word <em>logic</em> would be unjustified. With it, AND/OR/XOR on bits and AND/OR/XOR on propositions are literally the same tables.</li>
<li><strong>The gate symbols matter too</strong> — NOT is a triangle with a bubble, AND is a flat-backed D, OR is a curved-back shield, XOR is OR with an extra curve. A question can show a symbol and ask for the table.</li>
<li><strong>XOR's other name is "difference detector"</strong> — <code>x ^ y</code> is 0 exactly when x equals y. That single fact powers parity bits, error detection, the simplest encryption, and the classic three-line variable swap.</li>
</ul>
<p class="meo">💡 Memory hook in Vietnamese order: AND = "phải cả hai", OR = "chỉ cần một", XOR = "khác nhau thì 1", NOT = "lật". Four phrases, and you never need to redraw a truth table under exam pressure.</p>`,
        `<p class="y-chinh">🎯 Bốn bảng chân trị, gom cả vào một slide. Thuộc mười sáu bit đầu ra này thì phần còn lại của mục 4.1 chỉ là thao tác máy móc.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>y</strong></td><td><strong>NOT x</strong></td><td><strong>x AND y</strong></td><td><strong>x OR y</strong></td><td><strong>x XOR y</strong></td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
</table>
<ul>
<li><strong>Đọc mỗi cột thành một câu</strong> — AND: ra 1 chỉ khi <em>cả hai</em> là 1. OR: ra 0 chỉ khi <em>cả hai</em> là 0. XOR: ra 1 khi hai đầu vào <em>khác nhau</em>. NOT: lật. Ba trong bốn câu ấy có chữ "chỉ khi", nên rất dễ nhớ.</li>
<li><strong>Nguyên văn của slide</strong> — "một phép logic ở mức mẫu bit là n phép logic cùng loại ở mức bit, với n là số bit trong mẫu". Đó là định nghĩa mà đề thi muốn nhận lại.</li>
<li><strong>Vì sao quy ước 0 = sai, 1 = đúng</strong> — slide nêu quy ước này vì thiếu nó thì chữ <em>logic</em> không có cơ sở. Có nó rồi thì AND/OR/XOR trên bit và AND/OR/XOR trên mệnh đề đúng là cùng những cái bảng ấy.</li>
<li><strong>Ký hiệu cổng cũng cần nhớ</strong> — NOT là tam giác có bong bóng, AND là chữ D lưng phẳng, OR là cái khiên lưng cong, XOR là OR thêm một nét cong nữa. Đề có thể vẽ ký hiệu rồi hỏi bảng chân trị.</li>
<li><strong>Tên khác của XOR là "máy dò khác nhau"</strong> — <code>x ^ y</code> bằng 0 đúng khi x bằng y. Chỉ một sự kiện ấy thôi mà chạy được bit chẵn lẻ, phát hiện lỗi, phép mã hoá đơn giản nhất, và mẹo hoán đổi hai biến ba dòng kinh điển.</li>
</ul>
<p class="meo">💡 Mẹo nhớ bằng tiếng Việt: AND = "phải cả hai", OR = "chỉ cần một", XOR = "khác nhau thì 1", NOT = "lật". Bốn cụm từ, và bạn không bao giờ phải vẽ lại bảng chân trị giữa lúc căng thẳng trong phòng thi.</p>`],

      [37, '2. The NOT operator',
        `<p class="y-chinh">🎯 NOT is the only <strong>unary</strong> operator here: one input, one output, and the output is the complement — every 0 becomes 1, every 1 becomes 0.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>NOT x</strong></td></tr>
<tr><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td></tr>
</table>
<p class="nhan">Example 3.3 — apply NOT to the bit pattern 10011000.</p>
<pre>        bit:   7 6 5 4 3 2 1 0
  Input   :    1 0 0 1 1 0 0 0
  NOT     :    ─ ─ ─ ─ ─ ─ ─ ─   (flip every column)
  Output  :    0 1 1 0 0 1 1 1</pre>
<p class="dap-an">✅ Answer: NOT 10011000 = <strong>01100111</strong>. Column by column: 1→0, 0→1, 0→1, 1→0, 1→0, 0→1, 0→1, 0→1.</p>
<ul>
<li><strong>NOT is its own inverse</strong> — NOT(NOT x) = x, always. Nothing is lost, which is why it is the only operation here you can undo without keeping a copy of the original.</li>
<li><strong>It is exactly the one's complement</strong> — the operation Chapter 3 called "one's complementing" (slide 15's first step) is this NOT applied to the whole pattern. Two's complement = NOT then add 1, which is how slide 47 will write it as (B̄ + 1).</li>
<li><strong>Numerically it means x → −x − 1</strong> — on a signed 8-bit value, NOT 00000000 (0) is 11111111 (−1); NOT 00000101 (5) is 11111010 (−6). Verified: in C, <code>~5</code> is −6.</li>
<li><strong>Careful with the word "complement"</strong> — the complement of a <em>bit</em> is the other bit; the complement of a <em>number</em> depends on which complement system you mean. The slide means the bit-level one.</li>
<li><strong>In C</strong> — <code>~x</code>. On an <code>unsigned char</code> holding 0x98 (10011000), <code>~x &amp; 0xFF</code> gives 0x67 = 01100111, which is what we computed. The <code>&amp; 0xFF</code> matters because C promotes the operand to <code>int</code> first.</li>
</ul>
<p class="pitfall">⚠️ Do not confuse <code>~</code> with <code>!</code> in C. <code>~5</code> is −6 (flip all 32 bits); <code>!5</code> is 0 (the logical "not true"). Writing <code>!x</code> where you meant <code>~x</code> compiles silently and gives garbage.</p>`,
        `<p class="y-chinh">🎯 NOT là toán tử <strong>một ngôi</strong> duy nhất ở đây: một đầu vào, một đầu ra, và đầu ra là phần bù — mọi số 0 thành 1, mọi số 1 thành 0.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>NOT x</strong></td></tr>
<tr><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td></tr>
</table>
<p class="nhan">Ví dụ 3.3 — áp dụng NOT lên mẫu bit 10011000.</p>
<pre>        bit:   7 6 5 4 3 2 1 0
  Đầu vào :    1 0 0 1 1 0 0 0
  NOT     :    ─ ─ ─ ─ ─ ─ ─ ─   (lật từng cột)
  Đầu ra  :    0 1 1 0 0 1 1 1</pre>
<p class="dap-an">✅ Đáp án: NOT 10011000 = <strong>01100111</strong>. Từng cột một: 1→0, 0→1, 0→1, 1→0, 1→0, 0→1, 0→1, 0→1.</p>
<ul>
<li><strong>NOT là phép nghịch đảo của chính nó</strong> — NOT(NOT x) = x, luôn luôn. Không mất mát gì, nên đây là phép duy nhất ở đây mà bạn hoàn tác được mà không cần giữ bản gốc.</li>
<li><strong>Nó chính là bù 1</strong> — thao tác mà Chương 3 gọi là "lấy bù 1" (bước đầu ở slide 15) chính là phép NOT áp lên cả mẫu bit. Bù 2 = NOT rồi cộng 1, đúng như cách slide 47 sẽ viết thành (B̄ + 1).</li>
<li><strong>Về mặt số trị nó là x → −x − 1</strong> — với giá trị 8 bit có dấu, NOT 00000000 (0) là 11111111 (−1); NOT 00000101 (5) là 11111010 (−6). Đã kiểm: trong C, <code>~5</code> bằng −6.</li>
<li><strong>Cẩn thận với chữ "phần bù"</strong> — phần bù của một <em>bit</em> là bit còn lại; phần bù của một <em>số</em> còn tuỳ bạn nói hệ bù nào. Slide đang nói nghĩa ở mức bit.</li>
<li><strong>Trong C</strong> — <code>~x</code>. Với một <code>unsigned char</code> chứa 0x98 (10011000) thì <code>~x &amp; 0xFF</code> cho 0x67 = 01100111, đúng cái ta vừa tính. Cái <code>&amp; 0xFF</code> là cần thiết vì C nâng toán hạng lên <code>int</code> trước đã.</li>
</ul>
<p class="pitfall">⚠️ Đừng lẫn <code>~</code> với <code>!</code> trong C. <code>~5</code> bằng −6 (lật cả 32 bit); còn <code>!5</code> bằng 0 (phép "không đúng" luận lý). Viết <code>!x</code> trong khi định viết <code>~x</code> thì trình biên dịch im lặng chấp nhận và bạn nhận về rác.</p>`],

      [38, '3. The AND operator — and unsetting bits with a mask',
        `<p class="y-chinh">🎯 AND is <strong>binary</strong>: output 1 only when both inputs are 1, and 0 in the other three cases. The green box on the slide, <em>x AND 0 → 0</em>, is the entire theory of <strong>unsetting</strong> bits.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>y</strong></td><td><strong>x AND y</strong></td></tr>
<tr><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>1</td></tr>
</table>
<p class="nhan">Example 3.4 — AND the patterns 10011000 and 00101010.</p>
<pre>  Operand 1:   1 0 0 1 1 0 0 0
  Operand 2:   0 0 1 0 1 0 1 0
  AND      :   ───────────────
  Result   :   0 0 0 0 1 0 0 0</pre>
<p class="dap-an">✅ Answer: <strong>00001000</strong>. Only column 3 has a 1 in both operands, so only column 3 survives — exactly what the slide's note says.</p>
<p class="nhan">Masking, job 1 of 3 — UNSET (clear) chosen bits: AND with a mask that holds <strong>0</strong> where you want to erase and <strong>1</strong> where you want to keep.</p>
<pre>  Task: keep only the low 4 bits of 10110011 (throw the high nibble away)
  Value :   1 0 1 1 0 0 1 1
  Mask  :   0 0 0 0 1 1 1 1     (0x0F — zeros erase, ones keep)
  AND   :   ───────────────
  Result:   0 0 0 0 0 0 1 1</pre>
<p class="dap-an">✅ Answer: 10110011 AND 00001111 = <strong>00000011</strong> = 3. Verified with <code>bin(0b10110011 &amp; 0b00001111)</code>. The mask erased bits 7–4 and left bits 3–0 untouched, because <em>x AND 0 = 0</em> and <em>x AND 1 = x</em>.</p>
<ul>
<li><strong>Why a mask can only ever clear</strong> — AND has no row producing 1 from a 0 input, so a masked bit can go 1→0 but never 0→1. AND is the "switch off" tool.</li>
<li><strong>Second worked case — clear one single bit</strong>: turn bit 4 of 10111011 off. Mask = NOT 00010000 = 11101111. 10111011 AND 11101111 = <strong>10101011</strong>. Only the chosen column changed.</li>
<li><strong>The real-world classic</strong> — <code>c &amp; 0b11011111</code> turns an ASCII lowercase letter into uppercase, because 'a' = 01100001 and 'A' = 01000001 differ only in bit 5. Verified: 01100001 AND 11011111 = 01000001 = 'A'.</li>
<li><strong>In C</strong> — <code>x &amp; 0x0F</code> keeps the low nibble; <code>(n &gt;&gt; 8) &amp; 0xFF</code> pulls byte 1 out of a 32-bit integer (for n = 0x12AB34CD that is 0x34); <code>x &amp; 1</code> is the standard test for "is x odd?" because bit 0 is the only bit worth 1.</li>
<li><strong>Testing versus clearing</strong> — the same operation does both. <code>x &amp; mask</code> used as a <em>value</em> clears; used in an <code>if</code> it <em>tests</em> whether any of the masked bits were set.</li>
</ul>
<p class="meo">💡 Remember the mask rule by the shape of the digit: <strong>0 is a hole — whatever falls through it is gone; 1 is a wall — whatever is behind it stays.</strong> That one image gets you AND-masking right every time.</p>`,
        `<p class="y-chinh">🎯 AND là toán tử <strong>hai ngôi</strong>: ra 1 chỉ khi cả hai đầu vào là 1, và ra 0 ở ba trường hợp còn lại. Cái ô xanh trên slide, <em>x AND 0 → 0</em>, chính là toàn bộ lý thuyết của việc <strong>xoá (unset)</strong> bit.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>y</strong></td><td><strong>x AND y</strong></td></tr>
<tr><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>1</td></tr>
</table>
<p class="nhan">Ví dụ 3.4 — AND hai mẫu 10011000 và 00101010.</p>
<pre>  Toán hạng 1:   1 0 0 1 1 0 0 0
  Toán hạng 2:   0 0 1 0 1 0 1 0
  AND        :   ───────────────
  Kết quả    :   0 0 0 0 1 0 0 0</pre>
<p class="dap-an">✅ Đáp án: <strong>00001000</strong>. Chỉ cột số 3 có số 1 ở cả hai toán hạng, nên chỉ cột số 3 sống sót — đúng như ghi chú trên slide.</p>
<p class="nhan">Mặt nạ bit, việc 1 trong 3 — XOÁ những bit được chọn: AND với mặt nạ mang số <strong>0</strong> ở chỗ muốn xoá và số <strong>1</strong> ở chỗ muốn giữ.</p>
<pre>  Đề: chỉ giữ lại 4 bit thấp của 10110011 (vứt nửa byte cao đi)
  Giá trị :   1 0 1 1 0 0 1 1
  Mặt nạ  :   0 0 0 0 1 1 1 1     (0x0F — số 0 xoá, số 1 giữ)
  AND     :   ───────────────
  Kết quả :   0 0 0 0 0 0 1 1</pre>
<p class="dap-an">✅ Đáp án: 10110011 AND 00001111 = <strong>00000011</strong> = 3. Đã kiểm bằng <code>bin(0b10110011 &amp; 0b00001111)</code>. Mặt nạ xoá sạch bit 7–4 và không đụng gì tới bit 3–0, vì <em>x AND 0 = 0</em> còn <em>x AND 1 = x</em>.</p>
<ul>
<li><strong>Vì sao mặt nạ AND chỉ có thể xoá</strong> — bảng AND không có dòng nào cho ra 1 từ một đầu vào 0, nên một bit bị che có thể đi 1→0 chứ không bao giờ 0→1. AND là công cụ "tắt".</li>
<li><strong>Bài tính thứ hai — xoá đúng một bit</strong>: tắt bit 4 của 10111011. Mặt nạ = NOT 00010000 = 11101111. 10111011 AND 11101111 = <strong>10101011</strong>. Chỉ đúng cột được chọn thay đổi.</li>
<li><strong>Bài kinh điển ngoài đời</strong> — <code>c &amp; 0b11011111</code> biến một chữ cái ASCII thường thành chữ hoa, vì 'a' = 01100001 và 'A' = 01000001 chỉ khác nhau ở bit 5. Đã kiểm: 01100001 AND 11011111 = 01000001 = 'A'.</li>
<li><strong>Trong C</strong> — <code>x &amp; 0x0F</code> giữ nửa byte thấp; <code>(n &gt;&gt; 8) &amp; 0xFF</code> rút byte số 1 ra khỏi một số nguyên 32 bit (với n = 0x12AB34CD thì được 0x34); <code>x &amp; 1</code> là cách chuẩn để hỏi "x có lẻ không?", vì bit 0 là bit duy nhất mang giá trị 1.</li>
<li><strong>Kiểm tra khác với xoá</strong> — cùng một phép làm được cả hai. <code>x &amp; mask</code> dùng làm <em>giá trị</em> thì là xoá; đặt trong câu <code>if</code> thì là <em>kiểm tra</em> xem có bit nào trong vùng che đang bật hay không.</li>
</ul>
<p class="meo">💡 Nhớ luật mặt nạ bằng hình dáng chữ số: <strong>số 0 là cái lỗ — cái gì rơi qua là mất; số 1 là bức tường — cái gì nấp sau thì còn nguyên.</strong> Chỉ một hình ảnh đó là bạn không bao giờ làm sai mặt nạ AND.</p>`],

      [39, '4. The OR operator — and setting bits with a mask',
        `<p class="y-chinh">🎯 OR is binary: output 0 only when both inputs are 0, and 1 in the other three cases. The green box, <em>x OR 1 → 1</em>, is the entire theory of <strong>setting</strong> bits.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>y</strong></td><td><strong>x OR y</strong></td></tr>
<tr><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td></tr>
</table>
<p class="nhan">Example 3.5 — OR the patterns 10011001 and 00101110.</p>
<pre>  Operand 1:   1 0 0 1 1 0 0 1
  Operand 2:   0 0 1 0 1 1 1 0
  OR       :   ───────────────
  Result   :   1 0 1 1 1 1 1 1</pre>
<p class="dap-an">✅ Answer: <strong>10111111</strong>. Verified with <code>bin(0b10011001 | 0b00101110)</code>. Only column 6 has 0 in both operands, so only column 6 is 0 in the result — exactly what the slide's note says.</p>
<p class="nhan">Masking, job 2 of 3 — SET chosen bits: OR with a mask that holds <strong>1</strong> where you want to force a 1 and <strong>0</strong> where you want no change.</p>
<pre>  Task: switch bit 2 on in 10011000, leave every other bit alone
  Value :   1 0 0 1 1 0 0 0
  Mask  :   0 0 0 0 0 1 0 0     (0x04 — one 1, in column 2)
  OR    :   ───────────────
  Result:   1 0 0 1 1 1 0 0</pre>
<p class="dap-an">✅ Answer: 10011000 OR 00000100 = <strong>10011100</strong>. Verified with <code>bin(0b10011000 | 0b00000100)</code>. Bit 2 went 0 → 1; the seven other columns are byte-for-byte unchanged, because <em>x OR 0 = x</em>.</p>
<ul>
<li><strong>Why an OR mask can only ever set</strong> — no row of the table produces 0 from a 1 input, so a bit can go 0→1 but never 1→0. OR is the "switch on" tool, the mirror image of AND.</li>
<li><strong>Setting an already-set bit costs nothing</strong> — 10011000 OR 00001000 = 10011000, unchanged, because bit 3 was already 1. OR is <em>idempotent</em>: applying the same mask twice gives the same answer as applying it once. That is why flags can be set blindly, without checking first.</li>
<li><strong>Second worked case — the ASCII twin of slide 38</strong>: 'A' = 01000001 OR 00100000 = 01100001 = 'a'. AND with 11011111 goes up to uppercase, OR with 00100000 goes down to lowercase. Both verified.</li>
<li><strong>Setting several bits at once</strong> — a mask is not limited to one 1. 10000000 OR 00001111 = 10001111 turns on the whole low nibble in one operation.</li>
<li><strong>In C</strong> — <code>flags |= 0x04;</code> is the idiom for "raise flag 4", and it is everywhere in operating-system and hardware code: file-open modes, window styles, permission bits. Read <code>|=</code> as "add this flag".</li>
</ul>
<p class="pitfall">⚠️ The classic exam trap is doing OR when the question said "keep only these bits". Keeping is AND. OR never removes anything, so if your OR answer has fewer 1s than the original operand, you have made an arithmetic slip somewhere.</p>`,
        `<p class="y-chinh">🎯 OR là toán tử hai ngôi: ra 0 chỉ khi cả hai đầu vào là 0, và ra 1 ở ba trường hợp còn lại. Ô xanh <em>x OR 1 → 1</em> chính là toàn bộ lý thuyết của việc <strong>bật (set)</strong> bit.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>y</strong></td><td><strong>x OR y</strong></td></tr>
<tr><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td></tr>
</table>
<p class="nhan">Ví dụ 3.5 — OR hai mẫu 10011001 và 00101110.</p>
<pre>  Toán hạng 1:   1 0 0 1 1 0 0 1
  Toán hạng 2:   0 0 1 0 1 1 1 0
  OR         :   ───────────────
  Kết quả    :   1 0 1 1 1 1 1 1</pre>
<p class="dap-an">✅ Đáp án: <strong>10111111</strong>. Đã kiểm bằng <code>bin(0b10011001 | 0b00101110)</code>. Chỉ cột số 6 có số 0 ở cả hai toán hạng, nên chỉ cột 6 ra 0 — đúng như ghi chú trên slide.</p>
<p class="nhan">Mặt nạ bit, việc 2 trong 3 — BẬT những bit được chọn: OR với mặt nạ mang số <strong>1</strong> ở chỗ muốn ép thành 1 và số <strong>0</strong> ở chỗ muốn giữ nguyên.</p>
<pre>  Đề: bật bit 2 trong 10011000, không đụng tới bit nào khác
  Giá trị :   1 0 0 1 1 0 0 0
  Mặt nạ  :   0 0 0 0 0 1 0 0     (0x04 — đúng một số 1, ở cột 2)
  OR      :   ───────────────
  Kết quả :   1 0 0 1 1 1 0 0</pre>
<p class="dap-an">✅ Đáp án: 10011000 OR 00000100 = <strong>10011100</strong>. Đã kiểm bằng <code>bin(0b10011000 | 0b00000100)</code>. Bit 2 đi từ 0 → 1; bảy cột còn lại giữ nguyên từng bit một, vì <em>x OR 0 = x</em>.</p>
<ul>
<li><strong>Vì sao mặt nạ OR chỉ có thể bật</strong> — không dòng nào trong bảng cho ra 0 từ một đầu vào 1, nên một bit có thể đi 0→1 chứ không bao giờ 1→0. OR là công cụ "bật", đối xứng gương với AND.</li>
<li><strong>Bật một bit vốn đã bật thì không mất gì</strong> — 10011000 OR 00001000 = 10011000, y nguyên, vì bit 3 vốn đã là 1. OR có tính <em>luỹ đẳng</em>: áp cùng một mặt nạ hai lần cho cùng kết quả với áp một lần. Nhờ vậy mà cờ trạng thái cứ bật thẳng, không cần kiểm trước.</li>
<li><strong>Bài tính thứ hai — anh em sinh đôi ASCII của slide 38</strong>: 'A' = 01000001 OR 00100000 = 01100001 = 'a'. AND với 11011111 thì lên chữ hoa, OR với 00100000 thì xuống chữ thường. Cả hai đều đã kiểm.</li>
<li><strong>Bật nhiều bit cùng lúc</strong> — mặt nạ không bị giới hạn một số 1. 10000000 OR 00001111 = 10001111 bật cả nửa byte thấp trong một phép.</li>
<li><strong>Trong C</strong> — <code>flags |= 0x04;</code> là cách viết chuẩn cho "dựng cờ số 4", và nó có mặt khắp mã hệ điều hành lẫn mã phần cứng: chế độ mở tệp, kiểu cửa sổ, bit phân quyền. Đọc <code>|=</code> là "thêm cờ này vào".</li>
</ul>
<p class="pitfall">⚠️ Bẫy thi kinh điển là dùng OR trong khi đề bảo "chỉ giữ lại các bit này". Giữ lại là AND. OR không bao giờ bỏ đi thứ gì, nên nếu kết quả OR của bạn có ÍT số 1 hơn toán hạng ban đầu thì chắc chắn đã tính lệch ở đâu đó.</p>`],

      [40, '5. The XOR operator — and flipping bits with a mask',
        `<p class="y-chinh">🎯 XOR is OR with one row changed: the output is <strong>0 when both inputs are 1</strong>. The green box, <em>x XOR 1 → NOT x</em>, is the entire theory of <strong>flipping</strong> bits.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>y</strong></td><td><strong>x OR y</strong></td><td><strong>x XOR y</strong></td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td><strong>0</strong></td></tr>
</table>
<p class="nhan">Example 3.6 — XOR the same patterns as Example 3.5: 10011001 and 00101110.</p>
<pre>  Operand 1:   1 0 0 1 1 0 0 1
  Operand 2:   0 0 1 0 1 1 1 0
  XOR      :   ───────────────
  Result   :   1 0 1 1 0 1 1 1
  (OR gave :   1 0 1 1 1 1 1 1)</pre>
<p class="dap-an">✅ Answer: <strong>10110111</strong>. Verified with <code>bin(0b10011001 ^ 0b00101110)</code>. Compare with the OR result above: they differ in exactly one column — column 3, where both inputs were 1. That single column is "the effect of exclusion" the slide mentions.</p>
<p class="nhan">Masking, job 3 of 3 — FLIP (toggle) chosen bits: XOR with a mask that holds <strong>1</strong> where you want to invert and <strong>0</strong> where you want no change.</p>
<pre>  Task: invert the high nibble of 10011000, leave the low nibble alone
  Value :   1 0 0 1 1 0 0 0
  Mask  :   1 1 1 1 0 0 0 0     (0xF0 — ones flip, zeros keep)
  XOR   :   ───────────────
  Result:   0 1 1 0 1 0 0 0</pre>
<p class="dap-an">✅ Answer: 10011000 XOR 11110000 = <strong>01101000</strong>. Verified with <code>bin(0b10011000 ^ 0b11110000)</code>. Bits 7–4 each flipped (1→0, 0→1, 0→1, 1→0); bits 3–0 are untouched, because <em>x XOR 0 = x</em>.</p>
<ul>
<li><strong>Three masks, one table</strong> — AND with 0 clears, OR with 1 sets, XOR with 1 flips; and in all three cases the <em>other</em> mask digit leaves the bit alone. Write those three lines on your exam sheet before you start.</li>
<li><strong>XOR is its own inverse</strong> — (x XOR m) XOR m = x, for any mask m. Apply the same toggle twice and you are back where you started, which is why XOR is the basis of the simplest encryption: the same key both encrypts and decrypts.</li>
<li><strong>Second worked case — case toggling</strong>: 'a' = 01100001 XOR 00100000 = 01000001 = 'A', and applying the same mask to 'A' gives 'a' back. One mask, both directions — something neither AND nor OR can do.</li>
<li><strong>Three identities worth knowing</strong> — x XOR x = 00000000, x XOR 0 = x, x XOR 11111111 = NOT x. The last one means you never strictly need the NOT gate. All three verified on 11001010.</li>
<li><strong>In C</strong> — <code>x ^= mask;</code> toggles; <code>a ^= b; b ^= a; a ^= b;</code> swaps two integers with no temporary variable (a cute trick, but write the clear three-line swap in real code).</li>
</ul>
<p class="pitfall">⚠️ The slide says "compare the output with Example 4.5" — that is Forouzan's old chapter numbering; in this deck it means Example 3.5, one slide back. Also note that XOR is <em>not</em> "one or the other but not both" in the everyday English sense when there are more than two inputs: XOR of several bits is actually a <em>parity</em> test — 1 when the number of 1s is odd.</p>`,
        `<p class="y-chinh">🎯 XOR là OR sửa đúng một dòng: kết quả <strong>ra 0 khi cả hai đầu vào đều là 1</strong>. Ô xanh <em>x XOR 1 → NOT x</em> chính là toàn bộ lý thuyết của việc <strong>lật (flip)</strong> bit.</p>
<table>
<tr><td><strong>x</strong></td><td><strong>y</strong></td><td><strong>x OR y</strong></td><td><strong>x XOR y</strong></td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td><strong>0</strong></td></tr>
</table>
<p class="nhan">Ví dụ 3.6 — XOR đúng hai mẫu của Ví dụ 3.5: 10011001 và 00101110.</p>
<pre>  Toán hạng 1:   1 0 0 1 1 0 0 1
  Toán hạng 2:   0 0 1 0 1 1 1 0
  XOR        :   ───────────────
  Kết quả    :   1 0 1 1 0 1 1 1
  (OR cho ra :   1 0 1 1 1 1 1 1)</pre>
<p class="dap-an">✅ Đáp án: <strong>10110111</strong>. Đã kiểm bằng <code>bin(0b10011001 ^ 0b00101110)</code>. So với kết quả OR ở trên: chúng khác nhau đúng một cột — cột số 3, chỗ cả hai đầu vào đều là 1. Đúng một cột ấy là "hiệu ứng loại trừ" mà slide nhắc tới.</p>
<p class="nhan">Mặt nạ bit, việc 3 trong 3 — LẬT những bit được chọn: XOR với mặt nạ mang số <strong>1</strong> ở chỗ muốn đảo và số <strong>0</strong> ở chỗ muốn giữ nguyên.</p>
<pre>  Đề: đảo nửa byte cao của 10011000, giữ nguyên nửa byte thấp
  Giá trị :   1 0 0 1 1 0 0 0
  Mặt nạ  :   1 1 1 1 0 0 0 0     (0xF0 — số 1 lật, số 0 giữ)
  XOR     :   ───────────────
  Kết quả :   0 1 1 0 1 0 0 0</pre>
<p class="dap-an">✅ Đáp án: 10011000 XOR 11110000 = <strong>01101000</strong>. Đã kiểm bằng <code>bin(0b10011000 ^ 0b11110000)</code>. Bit 7–4 lật từng cái (1→0, 0→1, 0→1, 1→0); bit 3–0 không suy suyển, vì <em>x XOR 0 = x</em>.</p>
<ul>
<li><strong>Ba mặt nạ, một bảng</strong> — AND với 0 thì xoá, OR với 1 thì bật, XOR với 1 thì lật; và cả ba trường hợp, chữ số <em>còn lại</em> của mặt nạ đều để yên bit đó. Viết ba dòng ấy ra tờ nháp trước khi bắt đầu làm bài.</li>
<li><strong>XOR là nghịch đảo của chính nó</strong> — (x XOR m) XOR m = x, với mọi mặt nạ m. Lật hai lần thì về chỗ cũ, nên XOR là nền của phép mã hoá đơn giản nhất: cùng một khoá vừa mã hoá vừa giải mã.</li>
<li><strong>Bài tính thứ hai — đổi hoa thường</strong>: 'a' = 01100001 XOR 00100000 = 01000001 = 'A', và áp đúng mặt nạ ấy lên 'A' thì lại ra 'a'. Một mặt nạ, chạy được cả hai chiều — thứ mà AND lẫn OR đều không làm được.</li>
<li><strong>Ba đẳng thức đáng thuộc</strong> — x XOR x = 00000000, x XOR 0 = x, x XOR 11111111 = NOT x. Cái cuối nghĩa là về nguyên tắc bạn không cần tới cổng NOT. Cả ba đã kiểm trên 11001010.</li>
<li><strong>Trong C</strong> — <code>x ^= mask;</code> để lật; <code>a ^= b; b ^= a; a ^= b;</code> hoán đổi hai số nguyên mà không cần biến tạm (mẹo hay, nhưng trong mã thật hãy cứ viết ba dòng hoán đổi rõ ràng).</li>
</ul>
<p class="pitfall">⚠️ Slide ghi "compare the output with Example 4.5" — đó là số chương cũ của Forouzan; trong deck này nó nghĩa là Ví dụ 3.5, ngay slide trước. Cũng để ý: XOR <em>không</em> mang nghĩa "cái này hoặc cái kia nhưng không cả hai" theo kiểu tiếng Anh đời thường khi có hơn hai đầu vào: XOR của nhiều bit thực chất là phép kiểm <em>chẵn lẻ</em> — ra 1 khi số lượng bit 1 là số lẻ.</p>`],

      [41, '2 - Shift Operations',
        `<p class="y-chinh">🎯 A section divider — and the right moment to consolidate masks before the deck moves on, because <strong>masks plus shifts</strong> are what you actually use together in real code.</p>
<p class="nhan">The three mask jobs, all on one 8-bit value, as a single revision block.</p>
<pre>  Start           : 1 0 1 1 0 0 1 1     (0xB3 = 179)
  UNSET high half : AND 0 0 0 0 1 1 1 1  -&gt; 0 0 0 0 0 0 1 1   (3)
  SET   bit 6     : OR  0 1 0 0 0 0 0 0  -&gt; 1 1 1 1 0 0 1 1   (243)
  FLIP  high half : XOR 1 1 1 1 0 0 0 0  -&gt; 0 1 0 0 0 0 1 1   (67)</pre>
<p class="dap-an">✅ All three verified: <code>0b10110011 &amp; 0x0F = 3</code>, <code>0b10110011 | 0x40 = 243</code>, <code>0b10110011 ^ 0xF0 = 67</code>. Notice each one starts from the <em>same</em> value — the operator alone decides whether a bit is erased, forced on, or inverted.</p>
<ul>
<li><strong>Why shifts come next</strong> — a mask can only work on bits where they already sit. To <em>move</em> a field into position — to read byte 2 out of a 32-bit word, or to build a colour from three 8-bit channels — you need to shift as well as mask. <code>(n &gt;&gt; 8) &amp; 0xFF</code> is shift-then-mask; <code>(r &lt;&lt; 16) | (g &lt;&lt; 8) | b</code> is shift-then-set.</li>
<li><strong>Three kinds of shift are coming</strong> — logical shift (slide 43), logical circular shift or rotate (slide 44), arithmetic shift (slide 45). Slide 42 explains why the first two must not be used on signed numbers.</li>
<li><strong>Shifting is the cheapest operation a CPU has</strong> — it is pure wiring: the output wire of bit i is simply connected to the input wire of bit i+1. No carry propagation, no delay. That is why compilers turn <code>x * 8</code> into <code>x &lt;&lt; 3</code>.</li>
<li><strong>Shifts lose information</strong> — unlike NOT and XOR, a shift throws a bit off the end and cannot be undone. Rotate is the exception: nothing is lost, so rotating right by 1 then left by 1 restores the original.</li>
<li><strong>What the exam does with this section</strong> — it gives you one 8-bit pattern and asks for the result of each of the three shift kinds, then asks which of them you may legally use on a negative number. The answer to the last part is: only the arithmetic one.</li>
</ul>
<p class="meo">💡 Write this line at the top of your scratch paper in every bit-manipulation exam: <strong>AND-0 xoá · OR-1 bật · XOR-1 lật · shift để đưa bit vào đúng chỗ</strong>. Four fragments, and they cover every question slides 36–45 can produce.</p>`,
        `<p class="y-chinh">🎯 Slide phân mục — và là lúc hợp lý để chốt lại phần mặt nạ trước khi deck đi tiếp, vì <strong>mặt nạ cộng với phép dịch</strong> mới là thứ bạn dùng chung với nhau trong mã thật.</p>
<p class="nhan">Ba việc của mặt nạ, trên cùng một giá trị 8 bit, gom thành một khối ôn tập.</p>
<pre>  Ban đầu           : 1 0 1 1 0 0 1 1     (0xB3 = 179)
  XOÁ nửa cao       : AND 0 0 0 0 1 1 1 1  -&gt; 0 0 0 0 0 0 1 1   (3)
  BẬT  bit 6        : OR  0 1 0 0 0 0 0 0  -&gt; 1 1 1 1 0 0 1 1   (243)
  LẬT  nửa cao      : XOR 1 1 1 1 0 0 0 0  -&gt; 0 1 0 0 0 0 1 1   (67)</pre>
<p class="dap-an">✅ Cả ba đã kiểm: <code>0b10110011 &amp; 0x0F = 3</code>, <code>0b10110011 | 0x40 = 243</code>, <code>0b10110011 ^ 0xF0 = 67</code>. Để ý cả ba đều xuất phát từ <em>cùng một</em> giá trị — chỉ mình toán tử quyết định bit bị xoá, bị ép bật, hay bị đảo.</p>
<ul>
<li><strong>Vì sao phép dịch đứng ngay sau</strong> — mặt nạ chỉ làm việc được ở đúng chỗ bit đang nằm. Muốn <em>di chuyển</em> một trường vào vị trí — đọc byte số 2 ra khỏi một từ 32 bit, hay ghép một màu từ ba kênh 8 bit — thì phải dịch chứ không chỉ che. <code>(n &gt;&gt; 8) &amp; 0xFF</code> là dịch-rồi-che; <code>(r &lt;&lt; 16) | (g &lt;&lt; 8) | b</code> là dịch-rồi-bật.</li>
<li><strong>Ba loại dịch sắp tới</strong> — dịch logic (slide 43), dịch vòng logic hay rotate (slide 44), dịch số học (slide 45). Slide 42 giải thích vì sao hai loại đầu không được dùng cho số có dấu.</li>
<li><strong>Dịch là phép rẻ nhất mà CPU có</strong> — nó thuần là đi dây: dây ra của bit i nối thẳng vào dây vào của bit i+1. Không lan số nhớ, không độ trễ. Vì thế trình biên dịch đổi <code>x * 8</code> thành <code>x &lt;&lt; 3</code>.</li>
<li><strong>Dịch làm mất thông tin</strong> — khác NOT và XOR, phép dịch hất một bit ra khỏi đầu và không hoàn tác được. Dịch vòng là ngoại lệ: không mất gì, nên xoay phải 1 rồi xoay trái 1 là về đúng bản gốc.</li>
<li><strong>Đề thi làm gì với mục này</strong> — nó cho một mẫu 8 bit rồi bắt tính kết quả của cả ba loại dịch, sau đó hỏi loại nào được phép dùng cho số âm. Đáp án phần cuối: chỉ loại dịch số học.</li>
</ul>
<p class="meo">💡 Hãy viết dòng này lên đầu tờ nháp trong mọi bài thi về thao tác bit: <strong>AND-0 xoá · OR-1 bật · XOR-1 lật · dịch để đưa bit về đúng chỗ</strong>. Bốn mẩu, mà phủ hết mọi câu hỏi mà slide 36–45 có thể đẻ ra.</p>`],
      [42, '1. Introduction (shift operations)',
        `<p class="y-chinh">🎯 Shift operations <strong>move</strong> bits sideways without changing their values, and they split into two families: <strong>logical</strong> shifts (for patterns that are <em>not</em> signed numbers) and <strong>arithmetic</strong> shifts (for patterns that <em>are</em> signed numbers in two's complement).</p>
<ul>
<li><strong>The slide's own reason for the split</strong> — "a logical shift operation is applied to a pattern that does not represent a signed number… the reason is that these shift operations may change the sign of the number that is defined by the leftmost bit". That is the whole argument, and it is worth quoting in an exam answer.</li>
<li><strong>See the danger concretely</strong> — take 10011000. As an unsigned number it is 152; as two's complement it is −104. Shift it logically right by one and you get 01001100: unsigned that is 76, which is 152 ÷ 2 and perfectly sensible; signed that is +76, and a negative number has silently become positive. The bits did nothing wrong; the <em>interpretation</em> broke.</li>
<li><strong>Two logical kinds</strong> — the slide names them: <em>logical shift</em> (a bit falls off one end, a 0 enters the other) and <em>logical circular shift (rotate)</em> (the bit that falls off re-enters at the other end). Slides 43 and 44.</li>
<li><strong>One arithmetic kind, two directions</strong> — arithmetic right shift keeps the sign bit and copies it inwards; arithmetic left shift is the same as the logical left shift. Slide 45.</li>
<li><strong>So there are five operations to tell apart</strong> — logical left, logical right, rotate left, rotate right, arithmetic right (plus arithmetic left, which duplicates logical left). The exam question "distinguish between logical and arithmetic shift operations" is objective number three on slide 34, so expect it.</li>
</ul>
<p class="meo">💡 Fix the three families by what enters on the left when shifting right: <strong>logical shift feeds in a 0 · rotate feeds in the bit that just fell off the right · arithmetic shift feeds in a copy of the sign bit</strong>. Same picture, three different sources for the incoming bit.</p>`,
        `<p class="y-chinh">🎯 Phép dịch <strong>đẩy</strong> các bit sang ngang mà không đổi giá trị của chúng, và chia làm hai họ: dịch <strong>logic</strong> (cho mẫu bit <em>không</em> biểu diễn số có dấu) và dịch <strong>số học</strong> (cho mẫu bit <em>có</em> biểu diễn số có dấu dạng bù 2).</p>
<ul>
<li><strong>Lý do chia đôi, theo chính slide</strong> — "phép dịch logic áp cho mẫu bit không biểu diễn một số có dấu… vì các phép dịch này có thể làm đổi dấu của con số, mà dấu thì do bit trái nhất quy định". Đó là toàn bộ lập luận, và đáng chép lại nguyên văn khi làm bài.</li>
<li><strong>Nhìn thấy mối nguy bằng số cụ thể</strong> — lấy 10011000. Hiểu là số không dấu thì nó là 152; hiểu là bù 2 thì nó là −104. Dịch logic sang phải một bit được 01001100: không dấu là 76, đúng bằng 152 ÷ 2, rất hợp lý; có dấu là +76, và một số âm vừa lặng lẽ biến thành số dương. Bit không làm gì sai; cái vỡ là <em>cách diễn giải</em>.</li>
<li><strong>Hai loại logic</strong> — slide gọi tên: <em>dịch logic</em> (một bit rơi khỏi đầu này, một số 0 đi vào đầu kia) và <em>dịch vòng logic (rotate)</em> (bit rơi ra lại đi vào đầu bên kia). Slide 43 và 44.</li>
<li><strong>Một loại số học, hai chiều</strong> — dịch số học sang phải giữ bit dấu và chép nó vào trong; dịch số học sang trái thì y hệt dịch logic sang trái. Slide 45.</li>
<li><strong>Vậy có năm phép phải phân biệt</strong> — dịch trái logic, dịch phải logic, xoay trái, xoay phải, dịch phải số học (cộng thêm dịch trái số học, trùng với dịch trái logic). Câu hỏi "phân biệt dịch logic với dịch số học" là mục tiêu số ba ở slide 34, nên chắc chắn sẽ gặp.</li>
</ul>
<p class="meo">💡 Chốt ba họ bằng câu hỏi "khi dịch phải thì bên trái có gì đi vào": <strong>dịch logic đẩy số 0 vào · dịch vòng đẩy chính bit vừa rơi ra ở bên phải vào · dịch số học đẩy một bản sao của bit dấu vào</strong>. Cùng một bức tranh, ba nguồn khác nhau cho cái bit đi vào.</p>`],

      [43, '2. Logical Right/Left Shift Operations',
        `<p class="y-chinh">🎯 Figure 3.5 shows the rule in two pictures: whichever way you shift, <strong>the bit at the far end is lost and a 0 enters at the near end</strong>.</p>
<p class="nhan">Example 3.7 — logical <em>left</em> shift on the bit pattern 10011000.</p>
<pre>  Original  :  1 0 0 1 1 0 0 0
               ↙ each bit moves one place left; the leftmost 1 is discarded
  After     :  0 0 1 1 0 0 0 0
                              ↑ a 0 is added on the right</pre>
<p class="dap-an">✅ Answer: <strong>00110000</strong>. Verified with <code>format((0b10011000 &lt;&lt; 1) &amp; 0xFF, '08b')</code>. The discarded bit is the leading 1; the added bit is the trailing 0 — the slide labels both in the figure.</p>
<p class="nhan">The other direction, for completeness — logical <em>right</em> shift on the same pattern.</p>
<pre>  Original  :  1 0 0 1 1 0 0 0
  After     :  0 1 0 0 1 1 0 0
               ↑ a 0 enters here; the rightmost 0 falls off</pre>
<p class="dap-an">✅ Answer: <strong>01001100</strong>. Verified with <code>format(0b10011000 &gt;&gt; 1, '08b')</code>.</p>
<ul>
<li><strong>Read it as unsigned arithmetic and it makes sense</strong> — 10011000 is 152 unsigned. Left: 152 × 2 = 304, which does not fit in 8 bits, so we keep 304 − 256 = 48 = 00110000. Right: 152 ÷ 2 = 76 = 01001100, exact because the discarded bit was 0.</li>
<li><strong>Shifting right discards a remainder</strong> — 153 &gt;&gt; 1 gives 76, not 76.5. The bit that falls off the right <em>is</em> the remainder of the division by 2. Nothing rounds; it is simply dropped.</li>
<li><strong>Shifting by k, not just 1</strong> — shifting left by k multiplies by 2<sup>k</sup>; shifting right by k divides by 2<sup>k</sup>. Shifting an 8-bit pattern by 8 or more leaves nothing but zeros.</li>
<li><strong>Why "logical" here means "unsigned"</strong> — see slide 42: the left shift moved the old bit 6 into the sign position and the right shift forced a 0 into it. Either can change what a signed reading of the pattern means.</li>
<li><strong>In C</strong> — <code>x &lt;&lt; 1</code> and <code>x &gt;&gt; 1</code>. On an <code>unsigned</code> type <code>&gt;&gt;</code> is exactly this logical shift. On a <em>signed</em> type it is the arithmetic shift of slide 45 — the same symbol, two different behaviours, decided by the declared type.</li>
</ul>
<p class="pitfall">⚠️ On paper you have 8 columns; in C you usually have 32. <code>(unsigned char)0x98 &lt;&lt; 1</code> is 0x130, not 0x30, because C promotes the value to <code>int</code> first and nothing falls off. Mask with <code>&amp; 0xFF</code> if you want the 8-bit answer the exam expects.</p>`,
        `<p class="y-chinh">🎯 Figure 3.5 trình bày quy tắc bằng hai bức hình: dịch chiều nào cũng vậy, <strong>bit ở đầu xa bị mất và một số 0 đi vào ở đầu gần</strong>.</p>
<p class="nhan">Ví dụ 3.7 — dịch logic sang <em>trái</em> mẫu bit 10011000.</p>
<pre>  Ban đầu   :  1 0 0 1 1 0 0 0
               ↙ mỗi bit nhích sang trái một ô; số 1 ở trái nhất bị vứt
  Sau dịch  :  0 0 1 1 0 0 0 0
                              ↑ một số 0 được thêm vào bên phải</pre>
<p class="dap-an">✅ Đáp án: <strong>00110000</strong>. Đã kiểm bằng <code>format((0b10011000 &lt;&lt; 1) &amp; 0xFF, '08b')</code>. Bit bị vứt là số 1 dẫn đầu; bit được thêm là số 0 ở cuối — slide dán nhãn cả hai ngay trên hình.</p>
<p class="nhan">Chiều còn lại, cho đủ bộ — dịch logic sang <em>phải</em> cùng mẫu bit đó.</p>
<pre>  Ban đầu   :  1 0 0 1 1 0 0 0
  Sau dịch  :  0 1 0 0 1 1 0 0
               ↑ một số 0 đi vào chỗ này; số 0 ở phải nhất rơi ra</pre>
<p class="dap-an">✅ Đáp án: <strong>01001100</strong>. Đã kiểm bằng <code>format(0b10011000 &gt;&gt; 1, '08b')</code>.</p>
<ul>
<li><strong>Đọc theo số học không dấu là thấy hợp lý ngay</strong> — 10011000 là 152 khi không dấu. Dịch trái: 152 × 2 = 304, không vừa 8 bit, nên còn 304 − 256 = 48 = 00110000. Dịch phải: 152 ÷ 2 = 76 = 01001100, chia hết vì bit bị vứt vốn là 0.</li>
<li><strong>Dịch phải là vứt phần dư</strong> — 153 &gt;&gt; 1 cho 76 chứ không phải 76,5. Cái bit rơi ra ở bên phải <em>chính là</em> phần dư của phép chia cho 2. Không làm tròn gì cả; nó bị bỏ đi.</li>
<li><strong>Dịch k bit chứ không chỉ 1</strong> — dịch trái k bit là nhân với 2<sup>k</sup>; dịch phải k bit là chia cho 2<sup>k</sup>. Dịch một mẫu 8 bit đi 8 bit trở lên thì chỉ còn toàn số 0.</li>
<li><strong>Vì sao "logic" ở đây nghĩa là "không dấu"</strong> — xem slide 42: dịch trái đã đẩy bit 6 cũ lên đúng vị trí dấu, còn dịch phải ép một số 0 vào đó. Cả hai đều có thể làm đổi ý nghĩa của mẫu bit khi đọc như số có dấu.</li>
<li><strong>Trong C</strong> — <code>x &lt;&lt; 1</code> và <code>x &gt;&gt; 1</code>. Với kiểu <code>unsigned</code> thì <code>&gt;&gt;</code> đúng là phép dịch logic này. Với kiểu <em>có dấu</em> thì nó là phép dịch số học của slide 45 — cùng một ký hiệu, hai hành vi khác nhau, do kiểu khai báo quyết định.</li>
</ul>
<p class="pitfall">⚠️ Trên giấy bạn có 8 cột; trong C thường là 32. <code>(unsigned char)0x98 &lt;&lt; 1</code> cho 0x130 chứ không phải 0x30, vì C nâng giá trị lên <code>int</code> trước và chẳng có gì rơi ra cả. Phải <code>&amp; 0xFF</code> nếu muốn đáp án 8 bit như đề thi mong đợi.</p>`],

      [44, '3. Logical Right/Left Circular Shift Operations (Rotate)',
        `<p class="y-chinh">🎯 A circular shift — a <strong>rotate</strong> — loses nothing: the bit that falls off one end is fed straight back in at the other end. It is the only shift you can undo.</p>
<p class="nhan">Example 3.8 as the slide's <em>text</em> states it — circular <em>left</em> shift on 10011000.</p>
<pre>  Original  :  1 0 0 1 1 0 0 0
               └────────────────┐  the leftmost 1 travels round to the right
  After     :  0 0 1 1 0 0 0 1</pre>
<p class="dap-an">✅ Answer to the written question: <strong>00110001</strong>. Verified with <code>((0b10011000 &lt;&lt; 1 | 0b10011000 &gt;&gt; 7) &amp; 0xFF)</code>. Compare with slide 43: the logical left shift of the same pattern gave 00110000 — a rotate differs from it in exactly one bit, the one that was thrown away.</p>
<p class="pitfall">⚠️ <strong>The slide contradicts itself, twice.</strong> (1) The figure at the top carries the labels "a. Arithmetic right shift / b. Arithmetic left shift" — that is slide 45's figure, not a picture of rotation at all; the caption still says "Figure 3.6 Logical shift operations", the same caption Figure 3.5 already used. (2) The worked picture at the bottom shows <em>1 0 0 1 1 0 0 1 → 1 1 0 0 1 1 0 0</em>, which is a circular <em>right</em> shift of 10011001 (the rightmost 1 goes round to the left), not the left rotate of 10011000 that the text asks for — and it is byte-for-byte the same picture as slide 45. Answer the question as written (00110001) and say in one line that the printed figure is the right-rotate of a different pattern. Do not silently copy the picture.</p>
<ul>
<li><strong>The right rotate the picture actually shows</strong> — 10011001 rotated right by 1 is <strong>11001100</strong>, verified. It is worth working through, because the exam may well use the printed figure.</li>
<li><strong>Nothing is lost, so rotation is reversible</strong> — rotate right by 1 then left by 1 returns the original pattern. Rotating an 8-bit pattern 8 times gets you back where you started, which is why "rotate by k" only has 8 distinct outcomes.</li>
<li><strong>Rotate is not multiplication or division</strong> — 10011000 (152) rotated left is 00110001 (49), which is neither 304 nor 76. Rotation has no arithmetic meaning at all; it is a pure re-arrangement.</li>
<li><strong>Where it is used in practice</strong> — checksum and hash functions (MD5, SHA-1 and SHA-256 all rotate), block ciphers, and circular buffers. Rotation mixes bits without losing entropy, which is exactly what a hash needs.</li>
<li><strong>C has no rotate operator</strong> — you build one: <code>(x &lt;&lt; 1) | (x &gt;&gt; 7)</code> for an 8-bit value, then mask with <code>&amp; 0xFF</code>. Modern compilers recognise that idiom and emit the single CPU rotate instruction.</li>
</ul>
<p class="meo">💡 Three shifts, three fates for the bit that leaves: <strong>logical shift — it dies and a 0 replaces it · rotate — it comes back round the other side · arithmetic right shift — it dies but the sign bit is cloned</strong> (slide 45).</p>`,
        `<p class="y-chinh">🎯 Dịch vòng — <strong>rotate</strong> — không làm mất gì: bit rơi khỏi đầu này được nạp thẳng vào đầu kia. Đây là phép dịch duy nhất hoàn tác được.</p>
<p class="nhan">Ví dụ 3.8 theo đúng <em>chữ</em> trên slide — dịch vòng sang <em>trái</em> mẫu 10011000.</p>
<pre>  Ban đầu   :  1 0 0 1 1 0 0 0
               └────────────────┐  số 1 trái nhất đi vòng sang bên phải
  Sau dịch  :  0 0 1 1 0 0 0 1</pre>
<p class="dap-an">✅ Đáp án cho đề bài viết trên slide: <strong>00110001</strong>. Đã kiểm bằng <code>((0b10011000 &lt;&lt; 1 | 0b10011000 &gt;&gt; 7) &amp; 0xFF)</code>. So với slide 43: dịch logic trái cùng mẫu ấy cho 00110000 — dịch vòng khác nó đúng một bit, chính cái bit bị vứt đi.</p>
<p class="pitfall">⚠️ <strong>Slide này tự mâu thuẫn, hai lần.</strong> (1) Hình phía trên mang nhãn "a. Arithmetic right shift / b. Arithmetic left shift" — đó là hình của slide 45, không phải hình dịch vòng; chú thích vẫn ghi "Figure 3.6 Logical shift operations", đúng chú thích mà Figure 3.5 đã dùng. (2) Bức hình giải ở dưới vẽ <em>1 0 0 1 1 0 0 1 → 1 1 0 0 1 1 0 0</em>, tức một phép dịch vòng sang <em>PHẢI</em> của 10011001 (số 1 phải nhất đi vòng sang trái), không phải phép xoay trái 10011000 mà chữ đề bài yêu cầu — và nó giống hệt từng bit bức hình ở slide 45. Hãy trả lời theo đề viết (00110001) rồi ghi một dòng rằng hình in kèm là phép xoay phải của một mẫu bit khác. Đừng lặng lẽ chép lại bức hình.</p>
<ul>
<li><strong>Phép xoay phải mà bức hình thật sự vẽ</strong> — 10011001 xoay phải 1 bit là <strong>11001100</strong>, đã kiểm. Nên làm thử, vì đề thi hoàn toàn có thể lấy đúng bức hình in sẵn ấy.</li>
<li><strong>Không mất gì nên xoay là đảo ngược được</strong> — xoay phải 1 rồi xoay trái 1 là về đúng mẫu ban đầu. Xoay một mẫu 8 bit đủ 8 lần thì quay lại chỗ xuất phát, nên "xoay k bit" chỉ có 8 kết quả khác nhau.</li>
<li><strong>Xoay không phải nhân hay chia</strong> — 10011000 (152) xoay trái ra 00110001 (49), chẳng phải 304 cũng chẳng phải 76. Phép xoay hoàn toàn không mang nghĩa số học; nó thuần là sắp xếp lại.</li>
<li><strong>Dùng ở đâu trong thực tế</strong> — hàm kiểm tổng và hàm băm (MD5, SHA-1, SHA-256 đều xoay), mật mã khối, và bộ đệm vòng. Xoay trộn bit mà không làm mất độ hỗn loạn, đúng thứ một hàm băm cần.</li>
<li><strong>C không có toán tử xoay</strong> — bạn tự ghép: <code>(x &lt;&lt; 1) | (x &gt;&gt; 7)</code> cho giá trị 8 bit, rồi <code>&amp; 0xFF</code>. Trình biên dịch hiện đại nhận ra khuôn mẫu ấy và phát ra đúng một lệnh rotate của CPU.</li>
</ul>
<p class="meo">💡 Ba phép dịch, ba số phận cho cái bit rời đi: <strong>dịch logic — nó chết và một số 0 thế chỗ · dịch vòng — nó quay lại ở đầu bên kia · dịch phải số học — nó chết nhưng bit dấu được nhân bản</strong> (slide 45).</p>`],

      [45, '4. Arithmetic Shift Operations',
        `<p class="y-chinh">🎯 Arithmetic shifts assume the pattern <strong>is</strong> a two's complement signed integer. The slide states the payoff in red: <em>arithmetic right shift divides by two, arithmetic left shift multiplies by two</em> — and the right shift must therefore <strong>keep the sign bit</strong>.</p>
<p class="nhan">Example 3.9 — arithmetic <em>right</em> shift on 10011001, read as two's complement.</p>
<pre>  Original  :  1 0 0 1 1 0 0 1     = −103   (sign bit = 1, so negative)
               │└──────────────→   every bit moves one place right
               └──────────────→   the sign bit is KEPT and also copied inwards
  After     :  1 1 0 0 1 1 0 0     = −52    (rightmost 1 is lost)</pre>
<p class="dap-an">✅ Answer: <strong>11001100</strong>. Verified two ways: <code>format((-103 &gt;&gt; 1) &amp; 0xFF, '08b')</code> gives 11001100, and <code>-103 &gt;&gt; 1</code> gives −52. The slide's own wording, "the leftmost bit is retained and also copied to its right neighbour bit", describes exactly the two 1s now standing at the front.</p>
<p class="nhan">Why the logical shift would have been wrong here.</p>
<pre>  logical right : 1 0 0 1 1 0 0 1  →  0 1 0 0 1 1 0 0  = +76   ✗ sign destroyed
  arithmetic    : 1 0 0 1 1 0 0 1  →  1 1 0 0 1 1 0 0  = −52   ✓ −103 ÷ 2</pre>
<ul>
<li><strong>Where "divide by two" breaks — odd negatives</strong> — −103 ÷ 2 is −51.5, but the shift gave −52, not −51. An arithmetic right shift rounds <em>towards minus infinity</em>, while C's <code>/</code> operator rounds towards zero. Verified: <code>(-5) &gt;&gt; 1</code> is −3 while <code>-5 / 2</code> is −2. For positive values they agree; for odd negatives they differ by one.</li>
<li><strong>Where "multiply by two" breaks — overflow</strong> — 01001000 is +72; shift it left and you get 10010000, which as two's complement is <strong>−112</strong>, not +144. The 8-bit range only reaches +127, so a positive number can be shifted straight into the negative half. Verified.</li>
<li><strong>So the safe statement is conditional</strong> — left shift multiplies by 2 <em>provided the result still fits</em>; right shift divides by 2 <em>provided you accept rounding down</em>. Say it that way in an exam and you will not lose the mark.</li>
<li><strong>Arithmetic left shift = logical left shift</strong> — nothing special happens on the left; a 0 still enters from the right. That is why the slide's figure shows a 0 entering at the right in part (b).</li>
<li><strong>In C</strong> — for a signed <code>int</code>, <code>&gt;&gt;</code> is the arithmetic shift (sign-propagating on every mainstream compiler); for an <code>unsigned</code>, it is the logical one. This is exactly the "same symbol, type decides" trap from slide 43, and it is a real source of bugs.</li>
</ul>
<p class="meo">💡 Sanity check you can do in one second: <strong>an arithmetic right shift can never change the sign.</strong> If your answer starts with a different bit from the original, you have done a logical shift by mistake.</p>`,
        `<p class="y-chinh">🎯 Dịch số học giả định mẫu bit <strong>là</strong> một số nguyên có dấu dạng bù 2. Slide in đậm phần lợi bằng chữ đỏ: <em>dịch phải số học là chia cho hai, dịch trái số học là nhân với hai</em> — và vì thế dịch phải bắt buộc phải <strong>giữ lại bit dấu</strong>.</p>
<p class="nhan">Ví dụ 3.9 — dịch <em>phải</em> số học mẫu 10011001, đọc theo bù 2.</p>
<pre>  Ban đầu   :  1 0 0 1 1 0 0 1     = −103   (bit dấu = 1 nên là số âm)
               │└──────────────→   mọi bit nhích sang phải một ô
               └──────────────→   bit dấu được GIỮ và còn chép sang bên phải
  Sau dịch  :  1 1 0 0 1 1 0 0     = −52    (số 1 ở phải nhất bị mất)</pre>
<p class="dap-an">✅ Đáp án: <strong>11001100</strong>. Đã kiểm hai đường: <code>format((-103 &gt;&gt; 1) &amp; 0xFF, '08b')</code> cho 11001100, và <code>-103 &gt;&gt; 1</code> cho −52. Chính chữ trên slide — "bit trái nhất được giữ lại và còn được chép sang bit kề bên phải" — mô tả đúng hai số 1 đang đứng ở đầu.</p>
<p class="nhan">Vì sao dùng dịch logic ở đây thì sai.</p>
<pre>  dịch logic  : 1 0 0 1 1 0 0 1  →  0 1 0 0 1 1 0 0  = +76   ✗ phá mất dấu
  dịch số học : 1 0 0 1 1 0 0 1  →  1 1 0 0 1 1 0 0  = −52   ✓ −103 ÷ 2</pre>
<ul>
<li><strong>Chỗ "chia cho hai" hỏng — số âm lẻ</strong> — −103 ÷ 2 là −51,5, nhưng phép dịch cho −52 chứ không phải −51. Dịch phải số học làm tròn <em>xuống phía âm vô cực</em>, trong khi toán tử <code>/</code> của C làm tròn về phía 0. Đã kiểm: <code>(-5) &gt;&gt; 1</code> bằng −3 còn <code>-5 / 2</code> bằng −2. Với số dương thì hai cái trùng nhau; với số âm lẻ thì lệch nhau một đơn vị.</li>
<li><strong>Chỗ "nhân với hai" hỏng — tràn số</strong> — 01001000 là +72; dịch trái được 10010000, mà đọc theo bù 2 thì đó là <strong>−112</strong>, không phải +144. Dải 8 bit chỉ với tới +127, nên một số dương có thể bị dịch thẳng sang nửa âm. Đã kiểm.</li>
<li><strong>Nên phát biểu an toàn phải có điều kiện</strong> — dịch trái là nhân 2 <em>với điều kiện kết quả còn vừa chỗ</em>; dịch phải là chia 2 <em>với điều kiện chấp nhận làm tròn xuống</em>. Viết đúng như vậy trong bài thi thì không mất điểm.</li>
<li><strong>Dịch trái số học = dịch trái logic</strong> — bên trái chẳng có gì đặc biệt xảy ra; vẫn một số 0 đi vào từ bên phải. Vì thế hình trên slide, phần (b), vẫn vẽ số 0 đi vào ở bên phải.</li>
<li><strong>Trong C</strong> — với <code>int</code> có dấu thì <code>&gt;&gt;</code> là dịch số học (mọi trình biên dịch phổ thông đều lan bit dấu); với <code>unsigned</code> thì nó là dịch logic. Đây đúng là cái bẫy "cùng ký hiệu, kiểu quyết định" của slide 43, và nó là nguồn lỗi có thật.</li>
</ul>
<p class="meo">💡 Phép thử tỉnh táo làm được trong một giây: <strong>dịch phải số học không bao giờ làm đổi dấu.</strong> Nếu đáp án của bạn bắt đầu bằng một bit khác với bản gốc thì bạn đã lỡ tay làm dịch logic.</p>`],

      [46, '3 - Arithmetic operations',
        `<p class="y-chinh">🎯 The last section divider. Arithmetic means <strong>add, subtract, multiply, divide</strong>, applied to integers and to floating-point numbers — and the deck will show that almost all of it reduces to one operation: <em>addition</em>.</p>
<ul>
<li><strong>Everything collapses into addition</strong> — subtraction becomes addition of a two's complement (slide 47); multiplication can be repeated addition; division can be repeated subtraction, which is repeated addition again. The slide admits this is "not efficient" in practice, but it is why a CPU's arithmetic core is called an <em>adder</em>.</li>
<li><strong>Three storage formats, three procedures</strong> — two's complement integers (slides 47–49), sign-and-magnitude integers (50–51), floating-point reals (52–54). Same four operations, but the <em>algorithm</em> differs because the <em>representation</em> differs.</li>
<li><strong>This is where Chapter 3's first half pays off</strong> — you cannot add two numbers until you know how they are stored. Everything on slides 9–18 (unsigned, sign-and-magnitude, two's complement, floating point) is the prerequisite for this section, which is why the deck put storage first.</li>
<li><strong>Two's complement wins, and here is the reason</strong> — its addition procedure is a single rule with no special cases: add the patterns column by column, discard the final carry, done. Signs look after themselves. Compare the flowchart on slide 48 (three boxes) with the one on slide 50 (a dozen).</li>
<li><strong>What gets tested</strong> — an 8-bit addition with carries written above the columns, plus the overflow question. Five marks, and they are the easiest five marks in the paper if you have practised the column layout.</li>
</ul>
<p class="meo">💡 One sentence for the whole section: <strong>the computer owns exactly one arithmetic circuit — an adder — and every other operation is a trick for feeding it the right operands.</strong></p>`,
        `<p class="y-chinh">🎯 Slide phân mục cuối cùng. Số học nghĩa là <strong>cộng, trừ, nhân, chia</strong>, áp cho số nguyên và cho số dấu phẩy động — và deck sẽ cho thấy gần như tất cả quy về một phép duy nhất: <em>phép cộng</em>.</p>
<ul>
<li><strong>Mọi thứ sụp về phép cộng</strong> — phép trừ thành phép cộng với bù 2 (slide 47); phép nhân có thể là cộng lặp; phép chia có thể là trừ lặp, mà trừ lặp lại là cộng lặp. Slide thừa nhận cách ấy "không hiệu quả" trên thực tế, nhưng đó là lý do lõi số học của CPU được gọi là bộ <em>cộng</em>.</li>
<li><strong>Ba cách lưu, ba quy trình</strong> — số nguyên bù 2 (slide 47–49), số nguyên dấu-và-độ-lớn (50–51), số thực dấu phẩy động (52–54). Cùng bốn phép toán, nhưng <em>thuật toán</em> khác nhau vì <em>cách biểu diễn</em> khác nhau.</li>
<li><strong>Đây là chỗ nửa đầu Chương 3 sinh lời</strong> — không thể cộng hai số khi chưa biết chúng được lưu thế nào. Toàn bộ slide 9–18 (không dấu, dấu-và-độ-lớn, bù 2, dấu phẩy động) là điều kiện cần cho mục này, nên deck mới đặt phần lưu trữ lên trước.</li>
<li><strong>Bù 2 thắng, và đây là lý do</strong> — quy trình cộng của nó là một quy tắc duy nhất, không có trường hợp riêng: cộng hai mẫu bit theo từng cột, bỏ số nhớ cuối cùng, xong. Dấu tự lo lấy thân. So bức lưu đồ ở slide 48 (ba khối) với bức ở slide 50 (cả chục khối).</li>
<li><strong>Thi cái gì</strong> — một phép cộng 8 bit có ghi số nhớ phía trên các cột, cộng thêm câu hỏi tràn số. Năm điểm, và là năm điểm dễ nhất cả đề nếu bạn đã luyện cách kẻ cột.</li>
</ul>
<p class="meo">💡 Một câu cho cả mục: <strong>máy tính chỉ sở hữu đúng một mạch số học — mạch cộng — còn mọi phép khác chỉ là mẹo để đưa đúng toán hạng vào cho nó.</strong></p>`],

      [47, 'Introduction (arithmetic operations) — A − B ↔ A + (B̄ + 1)',
        `<p class="y-chinh">🎯 The boxed formula is the key sentence of the whole section: <strong>A − B ↔ A + (B̄ + 1)</strong>, where B̄ is the one's complement of B and (B̄ + 1) is the two's complement of B. <em>The computer never subtracts.</em></p>
<p class="nhan">Worked check — compute 17 − 22 on 8 bits without subtracting.</p>
<pre>  A          = 0 0 0 1 0 0 0 1      (+17)
  B          = 0 0 0 1 0 1 1 0      (+22)
  B̄  (NOT B) = 1 1 1 0 1 0 0 1
  B̄ + 1      = 1 1 1 0 1 0 1 0      (two's complement of B, = −22)

  A          = 0 0 0 1 0 0 0 1
  +          = 1 1 1 0 1 0 1 0
               ───────────────
  R          = 1 1 1 1 1 0 1 1</pre>
<p class="dap-an">✅ Answer: 11111011. Sign bit is 1, so it is negative; its magnitude is the two's complement of itself, 00000101 = 5, giving <strong>−5</strong> — and indeed 17 − 22 = −5. Verified with <code>format((17 - 22) &amp; 0xFF, '08b')</code>.</p>
<ul>
<li><strong>Why this is such a big win in hardware</strong> — one adder circuit plus a row of NOT gates and a "+1" input does both addition and subtraction. A dedicated subtractor would double the silicon for zero benefit.</li>
<li><strong>The two-step recipe for a two's complement</strong> — invert every bit, then add 1. Slide 15's shortcut is faster by hand: copy bits from the right up to and including the first 1, then flip everything to the left of it. Both give 11101010 from 00010110; check them against each other.</li>
<li><strong>Two's complement of the two's complement is the original</strong> — so the operation is its own inverse, and −(−22) = +22 falls out for free.</li>
<li><strong>The one asymmetric case</strong> — on 8 bits, the two's complement of 10000000 (−128) is 10000000 again. There is no +128, so negating the most negative number overflows. That is the one value that breaks the symmetry, and exam questions like it.</li>
<li><strong>Multiplication and division</strong> — the slide says they <em>can</em> be done by repeated addition/subtraction but that "the procedure is not efficient". Real CPUs use shift-and-add hardware, which is why slide 45's "shift = multiply by two" mattered.</li>
</ul>
<p class="meo">💡 The ASCII art on the slide, <strong>A − B ↔ A + (B̄ + 1)</strong>, is worth copying onto your cheat sheet exactly as it is drawn, overline and all. Every question in slides 48–51 is an application of that one line.</p>`,
        `<p class="y-chinh">🎯 Công thức trong khung đỏ là câu chốt của cả mục: <strong>A − B ↔ A + (B̄ + 1)</strong>, trong đó B̄ là bù 1 của B và (B̄ + 1) là bù 2 của B. <em>Máy tính không bao giờ trừ.</em></p>
<p class="nhan">Bài tính kiểm chứng — tính 17 − 22 trên 8 bit mà không dùng phép trừ.</p>
<pre>  A          = 0 0 0 1 0 0 0 1      (+17)
  B          = 0 0 0 1 0 1 1 0      (+22)
  B̄  (NOT B) = 1 1 1 0 1 0 0 1
  B̄ + 1      = 1 1 1 0 1 0 1 0      (bù 2 của B, tức −22)

  A          = 0 0 0 1 0 0 0 1
  +          = 1 1 1 0 1 0 1 0
               ───────────────
  R          = 1 1 1 1 1 0 1 1</pre>
<p class="dap-an">✅ Đáp án: 11111011. Bit dấu là 1 nên đây là số âm; độ lớn của nó là bù 2 của chính nó, 00000101 = 5, tức <strong>−5</strong> — và đúng là 17 − 22 = −5. Đã kiểm bằng <code>format((17 - 22) &amp; 0xFF, '08b')</code>.</p>
<ul>
<li><strong>Vì sao đây là món hời lớn về phần cứng</strong> — một mạch cộng cộng thêm một hàng cổng NOT và một đầu vào "+1" là làm được cả cộng lẫn trừ. Làm riêng một mạch trừ thì tốn gấp đôi silic mà chẳng lợi gì.</li>
<li><strong>Công thức hai bước lấy bù 2</strong> — đảo mọi bit, rồi cộng 1. Mẹo ở slide 15 nhanh hơn khi làm tay: chép các bit từ phải sang cho tới khi chép xong số 1 đầu tiên, rồi lật hết phần bên trái. Cả hai đều cho 11101010 từ 00010110; hãy dùng cái này đối chiếu cái kia.</li>
<li><strong>Bù 2 của bù 2 là chính nó ban đầu</strong> — nên phép này là nghịch đảo của chính nó, và −(−22) = +22 tự nhiên mà có.</li>
<li><strong>Một trường hợp bất đối xứng duy nhất</strong> — trên 8 bit, bù 2 của 10000000 (−128) lại là 10000000. Không có số +128, nên đổi dấu số âm nhất là tràn. Đó là giá trị duy nhất phá vỡ tính đối xứng, và đề thi rất thích nó.</li>
<li><strong>Phép nhân và phép chia</strong> — slide nói rằng chúng <em>có thể</em> làm bằng cộng/trừ lặp nhưng "quy trình đó không hiệu quả". CPU thật dùng phần cứng dịch-và-cộng, nên chỗ "dịch = nhân hai" ở slide 45 mới quan trọng.</li>
</ul>
<p class="meo">💡 Cái công thức trên slide, <strong>A − B ↔ A + (B̄ + 1)</strong>, đáng chép nguyên xi vào tờ giấy ôn, kể cả dấu gạch ngang trên đầu. Mọi câu hỏi ở slide 48–51 đều là một lần áp dụng đúng dòng ấy.</p>`],

      [48, 'Addition and subtraction of integers in two’s complement (Figure 3.8)',
        `<p class="y-chinh">🎯 The whole two's complement algorithm, as a flowchart with only three boxes: <strong>if the operation is a subtraction, replace B by its two's complement; then add; then stop.</strong></p>
<p class="nhan">Reading the flowchart node by node.</p>
<ul>
<li><strong>Start → the diamond</strong> — the only decision in the entire chart: [Add] or [Subtract]. If it is Add, the arrow jumps straight past the next box.</li>
<li><strong>B ← (B̄ + 1)</strong> — the subtract branch, and the note on the right of the slide spells it out: "(X̄ + 1): Two's complement of X". After this box, the subtract case and the add case are <em>identical</em>.</li>
<li><strong>R ← A + B</strong> — one plain binary addition, column by column, carry to the left. The final carry out of the leftmost column is simply <strong>discarded</strong>.</li>
<li><strong>Stop</strong> — there is no sign handling, no magnitude comparison, no special zero case. Compare with slide 50 and you will understand instantly why every modern machine stores integers this way.</li>
<li><strong>What the chart does NOT show</strong> — overflow detection. The chart quietly assumes the result fits. Slide 49 gives the example; the rule you must add yourself is on that slide.</li>
</ul>
<ul>
<li><strong>Why discarding the final carry is legal</strong> — two's complement arithmetic on n bits is arithmetic modulo 2<sup>n</sup>. The carry out is worth 2<sup>8</sup> = 256, and throwing it away is subtracting 256, which the wrap-around of the representation already accounts for. Example: (−9) + (−5) = 11110111 + 11111011 = 1 11110010; drop the leading carry and 11110010 is −14, which is correct. Verified.</li>
<li><strong>Only one zero</strong> — 00000000, and its two's complement is itself. Sign-and-magnitude has two zeros (slide 13); that alone would be enough reason to prefer this format.</li>
<li><strong>The range is asymmetric</strong> — 8 bits cover −128 to +127, not −127 to +127, precisely because there is no second zero to waste a pattern on.</li>
</ul>
<p class="pitfall">⚠️ This slide and slide 50 are both labelled "Figure 3.8" in the deck, although they show two different flowcharts. If an exam paper cites Figure 3.8, look at what it says next to it: "in two's complement" is this one, "in sign-and-magnitude" is slide 50.</p>`,
        `<p class="y-chinh">🎯 Toàn bộ thuật toán bù 2, vẽ thành lưu đồ chỉ có ba khối: <strong>nếu là phép trừ thì thay B bằng bù 2 của B; rồi cộng; rồi dừng.</strong></p>
<p class="nhan">Đọc lưu đồ theo từng nút.</p>
<ul>
<li><strong>Start → hình thoi</strong> — quyết định duy nhất của cả lưu đồ: [Add] hay [Subtract]. Nếu là Add thì mũi tên nhảy thẳng qua khối kế tiếp.</li>
<li><strong>B ← (B̄ + 1)</strong> — nhánh trừ, và tờ ghi chú bên phải slide nói rõ: "(X̄ + 1): bù 2 của X". Qua khối này rồi thì trường hợp trừ và trường hợp cộng <em>giống hệt nhau</em>.</li>
<li><strong>R ← A + B</strong> — một phép cộng nhị phân bình thường, từng cột một, nhớ sang trái. Số nhớ cuối cùng ra khỏi cột trái nhất thì <strong>vứt đi</strong>.</li>
<li><strong>Stop</strong> — không xử lý dấu, không so độ lớn, không có trường hợp riêng cho số 0. So với slide 50 là bạn hiểu ngay vì sao mọi máy hiện đại đều lưu số nguyên theo cách này.</li>
<li><strong>Cái lưu đồ KHÔNG vẽ</strong> — phát hiện tràn số. Nó lặng lẽ giả định kết quả vừa chỗ. Slide 49 đưa ví dụ; còn quy tắc thì bạn phải tự thêm vào, và nó nằm ở slide đó.</li>
</ul>
<ul>
<li><strong>Vì sao vứt số nhớ cuối là hợp lệ</strong> — số học bù 2 trên n bit là số học theo modulo 2<sup>n</sup>. Số nhớ tràn ra mang giá trị 2<sup>8</sup> = 256, vứt nó đi tức là trừ 256, mà chính cách biểu diễn cuộn vòng đã tính sẵn phần ấy. Ví dụ: (−9) + (−5) = 11110111 + 11111011 = 1 11110010; bỏ số nhớ dẫn đầu thì 11110010 là −14, đúng. Đã kiểm.</li>
<li><strong>Chỉ có một số 0</strong> — 00000000, và bù 2 của nó là chính nó. Dấu-và-độ-lớn có tới hai số 0 (slide 13); riêng điều ấy đã đủ lý do để chọn định dạng này.</li>
<li><strong>Dải giá trị bất đối xứng</strong> — 8 bit phủ từ −128 tới +127, không phải −127 tới +127, đúng vì không còn số 0 thứ hai nào để phí một mẫu bit.</li>
</ul>
<p class="pitfall">⚠️ Slide này và slide 50 cùng mang nhãn "Figure 3.8" trong deck, dù chúng vẽ hai lưu đồ khác nhau. Nếu đề thi trích Figure 3.8 thì hãy nhìn chữ bên cạnh: "in two's complement" là slide này, "in sign-and-magnitude" là slide 50.</p>`],

      [49, 'Addition in two’s complement — Example 3.10, and how to spot overflow',
        `<p class="y-chinh">🎯 Example 3.10: A = 00010001 and B = 00010110 in two's complement; add B to A. The slide's answer is (+17) + (+22) = (+39).</p>
<p class="nhan">The addition, column by column, carries on top — exactly as the slide draws it.</p>
<pre>  Carry :        1
  A     :  0 0 0 1 0 0 0 1      (+17)
+ B     :  0 0 0 1 0 1 1 0      (+22)
          ───────────────
  R     :  0 0 1 0 0 1 1 1      (+39)</pre>
<p class="nhan">Every column in order, so nothing is taken on trust:</p>
<pre>  col 0: 1 + 0           = 1 , carry 0
  col 1: 0 + 1           = 1 , carry 0
  col 2: 0 + 1           = 1 , carry 0
  col 3: 0 + 0           = 0 , carry 0
  col 4: 1 + 1           = 10 → write 0, carry 1
  col 5: 0 + 0 + carry 1 = 1 , carry 0
  col 6: 0 + 0           = 0
  col 7: 0 + 0           = 0   (no carry out)</pre>
<p class="dap-an">✅ Answer: R = <strong>00100111</strong> = 32 + 4 + 2 + 1 = 39. Verified with <code>format(17 + 22, '08b')</code>. The single carry the slide prints above column 5 is the one generated by column 4 — that is the only carry in the whole sum.</p>
<p class="nhan">Overflow — the thing the flowchart on slide 48 leaves out.</p>
<pre>  Rule: adding two numbers of the SAME sign and getting the OTHER sign = overflow.
        Adding two numbers of DIFFERENT signs can never overflow.

  0 1 0 0 0 0 0 0   (+64)
+ 0 1 0 0 0 0 0 0   (+64)
  ───────────────
  1 0 0 0 0 0 0 0   → sign bit 1 = −128, but +64 + +64 = +128</pre>
<p class="dap-an">✅ Answer: the pattern 10000000 is arithmetically <strong>wrong</strong> — it reads as −128 while the true sum is +128, which does not fit in 8 bits (max +127). Two positives produced a negative, so this is <strong>overflow</strong>. Verified. Note there was no carry out of the top column here, which proves the point below.</p>
<ul>
<li><strong>Carry out is NOT overflow</strong> — the most common confusion in the chapter. (−9) + (−5) = 11110111 + 11111011 produces a carry out of the top column, yet the answer 11110010 = −14 is perfectly correct. Conversely +64 + +64 above overflows with <em>no</em> carry out. Verified both ways.</li>
<li><strong>The reliable test</strong> — look at the three sign bits: sign(A), sign(B), sign(R). If sign(A) = sign(B) and sign(R) differs, it overflowed. Nothing else is needed.</li>
<li><strong>Why different signs are always safe</strong> — the true result lies between the two operands in magnitude, so it cannot escape a range that already held both of them.</li>
<li><strong>Hardware does it with one XOR</strong> — overflow = carry into the sign column XOR carry out of the sign column. That is the same XOR you learned on slide 40, wired into the ALU.</li>
<li><strong>In C</strong> — signed overflow is <em>undefined behaviour</em>, so the compiler may assume it never happens and optimise accordingly. Unsigned "overflow" is defined: it wraps modulo 2<sup>n</sup>. A <code>char</code> holding 120 plus 120 really can print −16 on your machine.</li>
</ul>
<p class="meo">💡 The exam sentence to memorise: <strong>"An overflow occurs when the two operands have the same sign and the result has the opposite sign."</strong> One line, and it answers every overflow question in the paper.</p>`,
        `<p class="y-chinh">🎯 Ví dụ 3.10: A = 00010001 và B = 00010110 dạng bù 2; cộng B vào A. Đáp số trên slide là (+17) + (+22) = (+39).</p>
<p class="nhan">Phép cộng, từng cột một, số nhớ ghi phía trên — đúng như slide vẽ.</p>
<pre>  Nhớ   :        1
  A     :  0 0 0 1 0 0 0 1      (+17)
+ B     :  0 0 0 1 0 1 1 0      (+22)
          ───────────────
  R     :  0 0 1 0 0 1 1 1      (+39)</pre>
<p class="nhan">Từng cột theo thứ tự, để không phải tin suông:</p>
<pre>  cột 0: 1 + 0            = 1 , nhớ 0
  cột 1: 0 + 1            = 1 , nhớ 0
  cột 2: 0 + 1            = 1 , nhớ 0
  cột 3: 0 + 0            = 0 , nhớ 0
  cột 4: 1 + 1            = 10 → ghi 0, nhớ 1
  cột 5: 0 + 0 + nhớ 1    = 1 , nhớ 0
  cột 6: 0 + 0            = 0
  cột 7: 0 + 0            = 0   (không có nhớ tràn ra)</pre>
<p class="dap-an">✅ Đáp án: R = <strong>00100111</strong> = 32 + 4 + 2 + 1 = 39. Đã kiểm bằng <code>format(17 + 22, '08b')</code>. Đúng một số nhớ mà slide in phía trên cột 5 chính là số nhớ do cột 4 sinh ra — cả phép cộng chỉ có một số nhớ ấy.</p>
<p class="nhan">Tràn số — thứ mà lưu đồ ở slide 48 bỏ sót.</p>
<pre>  Quy tắc: cộng hai số CÙNG dấu mà ra dấu NGƯỢC LẠI = tràn.
           Cộng hai số KHÁC dấu thì không bao giờ tràn.

  0 1 0 0 0 0 0 0   (+64)
+ 0 1 0 0 0 0 0 0   (+64)
  ───────────────
  1 0 0 0 0 0 0 0   → bit dấu 1 = −128, nhưng +64 + +64 = +128</pre>
<p class="dap-an">✅ Đáp án: mẫu bit 10000000 là <strong>SAI</strong> về mặt số học — nó đọc ra −128 trong khi tổng thật là +128, mà +128 không vừa 8 bit (tối đa +127). Hai số dương đẻ ra một số âm, nên đây là <strong>tràn số</strong>. Đã kiểm. Để ý ở đây KHÔNG có số nhớ nào tràn ra khỏi cột trên cùng, điều đó chứng minh ý ngay dưới đây.</p>
<ul>
<li><strong>Số nhớ tràn ra KHÔNG phải là tràn số</strong> — chỗ nhầm phổ biến nhất cả chương. (−9) + (−5) = 11110111 + 11111011 có sinh số nhớ ra khỏi cột trên cùng, vậy mà đáp án 11110010 = −14 hoàn toàn đúng. Ngược lại +64 + +64 ở trên thì tràn mà <em>không</em> có số nhớ nào tràn ra. Đã kiểm cả hai chiều.</li>
<li><strong>Phép thử đáng tin</strong> — nhìn ba bit dấu: dấu(A), dấu(B), dấu(R). Nếu dấu(A) = dấu(B) mà dấu(R) khác đi thì đã tràn. Không cần gì thêm.</li>
<li><strong>Vì sao khác dấu thì luôn an toàn</strong> — kết quả thật nằm giữa hai toán hạng về độ lớn, nên nó không thể thoát ra khỏi một dải vốn đã chứa được cả hai.</li>
<li><strong>Phần cứng làm việc này bằng một cổng XOR</strong> — tràn = số nhớ ĐI VÀO cột dấu XOR số nhớ ĐI RA khỏi cột dấu. Đúng cái XOR bạn học ở slide 40, đem đi đấu dây trong ALU.</li>
<li><strong>Trong C</strong> — tràn của số có dấu là <em>hành vi không xác định</em>, nên trình biên dịch được phép giả định nó không bao giờ xảy ra và tối ưu theo. Còn "tràn" của số không dấu thì có định nghĩa: nó cuộn vòng theo modulo 2<sup>n</sup>. Một <code>char</code> chứa 120 cộng 120 hoàn toàn có thể in ra −16 trên máy bạn.</li>
</ul>
<p class="meo">💡 Câu phải thuộc để đi thi: <strong>"Tràn số xảy ra khi hai toán hạng cùng dấu mà kết quả mang dấu ngược lại."</strong> Một dòng, trả lời được mọi câu hỏi về tràn trong đề.</p>`],

      [50, 'Addition and subtraction of integers in sign-and-magnitude (Figure 3.8)',
        `<p class="y-chinh">🎯 The same job in sign-and-magnitude, and the flowchart explodes from three boxes to about a dozen. That size difference <em>is</em> the lesson of the slide.</p>
<p class="nhan">The notation box on the right, which you must read first.</p>
<ul>
<li><strong>X<sub>S</sub></strong> = the sign bit of X · <strong>X<sub>M</sub></strong> = the magnitude of X · <strong>X̄</strong> = one's complement of X · <strong>(X̄ + 1)</strong> = two's complement of X · <strong>S</strong> = the 1-bit sign location · <strong>O</strong> = the 1-bit overflow location.</li>
</ul>
<p class="nhan">Walking the chart from Start to Stop.</p>
<ul>
<li><strong>1. Add or subtract?</strong> — on [Subtract], flip the sign of B: B<sub>S</sub> ← NOT B<sub>S</sub>. After that, only addition is left, just as in two's complement.</li>
<li><strong>2. S ← A<sub>S</sub> XOR B<sub>S</sub></strong> — XOR again, doing what it does best: telling you whether two things <em>differ</em>. S = 0 means same sign, S = 1 means different signs.</li>
<li><strong>3a. Same sign (S = 0)</strong> — the right-hand branch: R<sub>M</sub> ← A<sub>M</sub> + B<sub>M</sub>. Magnitudes simply add. If that produces a carry out (O = 1), <em>report overflow</em> — this is the only branch that can overflow, and note the chart ends there with an error, not a number.</li>
<li><strong>3b. Different signs (S = 1)</strong> — the left-hand branch: R<sub>M</sub> ← A<sub>M</sub> + (B̄<sub>M</sub> + 1), i.e. subtract by adding the two's complement of the magnitude. Then the chart checks O: if O = 1 the magnitude is already correct and R<sub>S</sub> ← A<sub>S</sub>; if O = 0 the result came out complemented, so take its two's complement back, R<sub>M</sub> ← (R̄<sub>M</sub> + 1), and the sign is B's: R<sub>S</sub> ← B<sub>S</sub>.</li>
<li><strong>4. Stop</strong> — three different Stop nodes, which is itself a warning sign about the format.</li>
</ul>
<p class="pitfall">⚠️ In this branch, O = 1 means "no borrow, A's magnitude was the bigger one" — it is <em>not</em> an error, unlike the O = 1 on the other branch, where it <em>is</em> an overflow. Same letter, opposite meaning, decided by which side of the chart you are on. Read the branch before you read the flag.</p>
<p class="meo">💡 Compare the two figures side by side and you have the answer to "why do computers use two's complement?" — in two's complement, signs and magnitudes never need to be examined separately, so one adder does everything. This chart is the price of the alternative.</p>`,
        `<p class="y-chinh">🎯 Vẫn công việc ấy nhưng ở dạng dấu-và-độ-lớn, và lưu đồ phình từ ba khối lên cỡ một chục khối. Chính cái chênh lệch kích thước ấy <em>là</em> bài học của slide.</p>
<p class="nhan">Tờ ghi chú ký hiệu bên phải, phải đọc trước đã.</p>
<ul>
<li><strong>X<sub>S</sub></strong> = bit dấu của X · <strong>X<sub>M</sub></strong> = độ lớn của X · <strong>X̄</strong> = bù 1 của X · <strong>(X̄ + 1)</strong> = bù 2 của X · <strong>S</strong> = ô dấu 1 bit · <strong>O</strong> = ô tràn 1 bit.</li>
</ul>
<p class="nhan">Đi bộ qua lưu đồ từ Start tới Stop.</p>
<ul>
<li><strong>1. Cộng hay trừ?</strong> — nếu [Subtract] thì đảo dấu của B: B<sub>S</sub> ← NOT B<sub>S</sub>. Sau đó chỉ còn phép cộng, y như bên bù 2.</li>
<li><strong>2. S ← A<sub>S</sub> XOR B<sub>S</sub></strong> — lại là XOR, làm đúng cái nó giỏi nhất: cho biết hai thứ có <em>khác nhau</em> không. S = 0 là cùng dấu, S = 1 là khác dấu.</li>
<li><strong>3a. Cùng dấu (S = 0)</strong> — nhánh bên phải: R<sub>M</sub> ← A<sub>M</sub> + B<sub>M</sub>. Hai độ lớn cộng thẳng. Nếu sinh số nhớ tràn ra (O = 1) thì <em>báo tràn</em> — đây là nhánh duy nhất có thể tràn, và để ý lưu đồ kết thúc ở đó bằng một lỗi, không phải bằng một con số.</li>
<li><strong>3b. Khác dấu (S = 1)</strong> — nhánh bên trái: R<sub>M</sub> ← A<sub>M</sub> + (B̄<sub>M</sub> + 1), tức là trừ bằng cách cộng bù 2 của độ lớn. Rồi lưu đồ xét O: nếu O = 1 thì độ lớn đã đúng và R<sub>S</sub> ← A<sub>S</sub>; nếu O = 0 thì kết quả ra dạng bù, phải lấy bù 2 ngược lại, R<sub>M</sub> ← (R̄<sub>M</sub> + 1), và dấu lấy theo B: R<sub>S</sub> ← B<sub>S</sub>.</li>
<li><strong>4. Stop</strong> — có tới ba nút Stop khác nhau, tự nó đã là một dấu hiệu cảnh báo về định dạng này.</li>
</ul>
<p class="pitfall">⚠️ Ở nhánh khác dấu, O = 1 nghĩa là "không phải mượn, độ lớn của A lớn hơn" — nó <em>không</em> phải lỗi, khác hẳn O = 1 ở nhánh kia, nơi nó <em>đúng là</em> tràn số. Cùng một chữ cái, nghĩa ngược nhau, tuỳ bạn đang ở nhánh nào. Đọc nhánh trước rồi hãy đọc cờ.</p>
<p class="meo">💡 Đặt hai bức lưu đồ cạnh nhau là có ngay đáp án cho câu "vì sao máy tính dùng bù 2?" — với bù 2, không bao giờ phải tách dấu và độ lớn ra xem riêng, nên một mạch cộng làm hết. Bức lưu đồ này là cái giá của phương án còn lại.</p>`],

      [51, 'Sign-and-magnitude — Example 3.11: (−81) − (−22)',
        `<p class="y-chinh">🎯 A = (1 1010001)<sub>2</sub> and B = (1 0010110)<sub>2</sub> in sign-and-magnitude, 1 sign bit + 7 magnitude bits. Subtract B from A. The slide's answer is (−81) − (−22) = (−59).</p>
<p class="nhan">Step 0 — decode the two operands.</p>
<pre>  A = 1 1010001  → sign 1 (negative), magnitude 1010001 = 64+16+1 = 81  → −81
  B = 1 0010110  → sign 1 (negative), magnitude 0010110 = 16+4+2  = 22  → −22</pre>
<p class="nhan">Step 1 — the operation is Subtract, so flip B's sign: B<sub>S</sub> ← NOT B<sub>S</sub> = 0. (The slide prints this as "S<sub>B</sub> = S<sub>B</sub>" because the overline was lost when the figure was pasted in; read it as "B's sign is complemented".)</p>
<p class="nhan">Step 2 — S ← A<sub>S</sub> XOR B<sub>S</sub> = 1 XOR 0 = <strong>1</strong>, so the signs now differ: take the left branch.</p>
<p class="nhan">Step 3 — R<sub>M</sub> ← A<sub>M</sub> + (B̄<sub>M</sub> + 1), on 7 magnitude bits.</p>
<pre>  B_M        = 0 0 1 0 1 1 0        (22)
  NOT B_M    = 1 1 0 1 0 0 1
  +1         = 1 1 0 1 0 1 0        (two's complement of 22 on 7 bits = 106)

  Overflow →  1                     (carry out of the 7-bit column)
  A_M        = 1 0 1 0 0 0 1        (81)
+            = 1 1 0 1 0 1 0        (106)
             ─────────────
  R_M        = 0 1 1 1 0 1 1        (59)</pre>
<p class="dap-an">✅ Answer: 81 + 106 = 187, and 187 in 8 bits is 1 0111011 — the leading 1 is the overflow bit O, and the 7 bits left are 0111011 = 59. Verified with <code>format(81 + 106, '08b')</code> giving 10111011 and 187 − 128 = 59. Since O = 1, R<sub>M</sub> = 59 is final and R<sub>S</sub> ← A<sub>S</sub> = 1. So R = <strong>1 0111011</strong> = −59, and indeed (−81) − (−22) = −81 + 22 = −59.</p>
<ul>
<li><strong>Why O = 1 means "keep the answer"</strong> — the carry out says A's magnitude was the larger one, so the subtraction 81 − 22 came out positive and the result already carries A's sign. Had B been the larger magnitude, O would be 0 and you would have to complement R<sub>M</sub> back and take B's sign.</li>
<li><strong>Do the mirror case once, by hand</strong> — (−22) − (−81): after the flip the magnitudes are 22 and 81; 22 + (128 − 81 = 47) = 69, no carry out, so O = 0; complement 69 on 7 bits → 128 − 69 = 59; sign ← B<sub>S</sub> = 0. Result +59, which is correct since −22 + 81 = +59.</li>
<li><strong>Two overflow flags, two meanings</strong> — this example's O = 1 is a <em>useful</em> flag, not an error, precisely because we are on the different-signs branch. On the same-signs branch O = 1 would have ended the chart with "Report overflow".</li>
<li><strong>Count the work</strong> — one sign flip, one XOR, one complement, one addition, one flag test, one sign copy: six steps, versus the two steps the same sum would need in two's complement. That is the argument of slide 48 made concrete.</li>
<li><strong>Where sign-and-magnitude still lives</strong> — inside floating-point numbers. The IEEE 754 format of slide 54 stores its sign separately from its mantissa, which is exactly why slide 52 says real addition "is reduced to addition of two integers stored in sign-and-magnitude".</li>
</ul>
<p class="pitfall">⚠️ The deck labels this "Example 3.11" and then labels slide 54 "Example 3.11" as well. Two different problems, one number. Cite them by slide, not by example number.</p>`,
        `<p class="y-chinh">🎯 A = (1 1010001)<sub>2</sub> và B = (1 0010110)<sub>2</sub> dạng dấu-và-độ-lớn, 1 bit dấu + 7 bit độ lớn. Lấy A trừ B. Đáp số trên slide là (−81) − (−22) = (−59).</p>
<p class="nhan">Bước 0 — giải mã hai toán hạng.</p>
<pre>  A = 1 1010001  → dấu 1 (âm), độ lớn 1010001 = 64+16+1 = 81  → −81
  B = 1 0010110  → dấu 1 (âm), độ lớn 0010110 = 16+4+2  = 22  → −22</pre>
<p class="nhan">Bước 1 — phép toán là Trừ, nên đảo dấu của B: B<sub>S</sub> ← NOT B<sub>S</sub> = 0. (Slide in thành "S<sub>B</sub> = S<sub>B</sub>" vì dấu gạch ngang phủ định bị mất lúc dán hình; phải đọc là "lấy bù dấu của B".)</p>
<p class="nhan">Bước 2 — S ← A<sub>S</sub> XOR B<sub>S</sub> = 1 XOR 0 = <strong>1</strong>, tức hai dấu giờ đã khác nhau: đi nhánh bên trái.</p>
<p class="nhan">Bước 3 — R<sub>M</sub> ← A<sub>M</sub> + (B̄<sub>M</sub> + 1), trên 7 bit độ lớn.</p>
<pre>  B_M        = 0 0 1 0 1 1 0        (22)
  NOT B_M    = 1 1 0 1 0 0 1
  +1         = 1 1 0 1 0 1 0        (bù 2 của 22 trên 7 bit = 106)

  Tràn   →    1                     (số nhớ ra khỏi cột thứ 7)
  A_M        = 1 0 1 0 0 0 1        (81)
+            = 1 1 0 1 0 1 0        (106)
             ─────────────
  R_M        = 0 1 1 1 0 1 1        (59)</pre>
<p class="dap-an">✅ Đáp án: 81 + 106 = 187, và 187 viết đủ 8 bit là 1 0111011 — số 1 dẫn đầu chính là bit tràn O, còn 7 bit còn lại là 0111011 = 59. Đã kiểm bằng <code>format(81 + 106, '08b')</code> ra 10111011 và 187 − 128 = 59. Vì O = 1 nên R<sub>M</sub> = 59 là kết quả cuối và R<sub>S</sub> ← A<sub>S</sub> = 1. Vậy R = <strong>1 0111011</strong> = −59, và đúng là (−81) − (−22) = −81 + 22 = −59.</p>
<ul>
<li><strong>Vì sao O = 1 nghĩa là "giữ nguyên đáp án"</strong> — số nhớ tràn ra cho biết độ lớn của A là cái lớn hơn, nên phép trừ 81 − 22 ra số dương và kết quả mang sẵn dấu của A. Nếu B mới là cái lớn hơn thì O sẽ bằng 0 và bạn phải lấy bù R<sub>M</sub> ngược lại rồi lấy dấu của B.</li>
<li><strong>Hãy tự làm trường hợp đối xứng một lần</strong> — (−22) − (−81): sau khi đảo dấu thì hai độ lớn là 22 và 81; 22 + (128 − 81 = 47) = 69, không có số nhớ tràn ra nên O = 0; lấy bù 69 trên 7 bit → 128 − 69 = 59; dấu ← B<sub>S</sub> = 0. Kết quả +59, đúng vì −22 + 81 = +59.</li>
<li><strong>Hai cờ tràn, hai ý nghĩa</strong> — O = 1 trong ví dụ này là một cờ <em>hữu ích</em>, không phải lỗi, đúng vì ta đang ở nhánh khác dấu. Ở nhánh cùng dấu thì O = 1 sẽ kết thúc lưu đồ bằng "Report overflow".</li>
<li><strong>Đếm khối lượng việc</strong> — một lần đảo dấu, một XOR, một lần lấy bù, một phép cộng, một lần xét cờ, một lần chép dấu: sáu bước, so với hai bước mà cùng phép tính ấy cần trong bù 2. Đó là lập luận của slide 48 nói bằng con số cụ thể.</li>
<li><strong>Dấu-và-độ-lớn hiện còn sống ở đâu</strong> — bên trong số dấu phẩy động. Định dạng IEEE 754 của slide 54 lưu dấu tách rời phần định trị, đúng vì thế slide 52 mới nói phép cộng số thực "quy về phép cộng hai số nguyên lưu dạng dấu-và-độ-lớn".</li>
</ul>
<p class="pitfall">⚠️ Deck gán nhãn "Example 3.11" cho slide này rồi gán "Example 3.11" cho cả slide 54. Hai bài toán khác nhau, một con số. Khi trích dẫn thì gọi theo số slide, đừng gọi theo số ví dụ.</p>`],

      [52, 'Arithmetic Operations on Reals',
        `<p class="y-chinh">🎯 All four operations apply to floating-point reals too, but the slide reduces them to things you already know: <strong>multiplication and division of reals are sign-and-magnitude integer operations</strong>, and <strong>addition and subtraction reduce to sign-and-magnitude addition after the decimal points have been aligned</strong>.</p>
<ul>
<li><strong>Why multiplication is the easy one</strong> — in scientific notation, (m<sub>1</sub> × 2<sup>e1</sup>) × (m<sub>2</sub> × 2<sup>e2</sup>) = (m<sub>1</sub> × m<sub>2</sub>) × 2<sup>e1+e2</sup>. Multiply the mantissas, add the exponents, XOR the signs. No alignment needed, because the exponents never have to match.</li>
<li><strong>Why addition is the hard one</strong> — you cannot add 5.75 and 7.0234375 as mantissas until both are expressed with the <em>same</em> exponent. That alignment step is the whole complication, and it is what slide 53's flowchart spends most of its boxes on.</li>
<li><strong>"Combination of sign and mantissa"</strong> — the slide's exact phrase. Glue the sign bit back on to the front of the mantissa and you have precisely a sign-and-magnitude integer, which is why slides 50–51 had to come first. Now the "why is this obsolete format still here?" question has its answer.</li>
<li><strong>"There are some special cases that we have ignored"</strong> — honest of the slide, and here is what it means: infinities, NaN (0 ÷ 0), subnormal numbers near zero, and the rounding rules. IEEE 754 defines all of them; this course does not test them.</li>
<li><strong>The reference "Figure 4.8"</strong> — another leftover from Forouzan's chapter 4 numbering. In this deck the figure is 3.9, on the next slide.</li>
</ul>
<p class="pitfall">⚠️ Floating-point addition is <em>not associative</em>, precisely because of the alignment and rounding steps here. In any language with IEEE doubles, (0.1 + 0.2) + 0.3 and 0.1 + (0.2 + 0.3) can give different bit patterns, and 0.1 + 0.2 is famously not exactly 0.3. This is a consequence of the procedure on this slide, not a bug in your program.</p>
<p class="meo">💡 Line up the four operations by difficulty and the reason becomes memorable: <strong>× and ÷ are easy because exponents just add and subtract; + and − are hard because exponents must first be made equal.</strong> That is the exact opposite of the ordering you are used to from primary school arithmetic.</p>`,
        `<p class="y-chinh">🎯 Cả bốn phép đều áp được cho số thực dấu phẩy động, nhưng slide quy chúng về những thứ bạn đã biết: <strong>nhân và chia số thực là phép trên số nguyên dấu-và-độ-lớn</strong>, còn <strong>cộng và trừ quy về phép cộng dấu-và-độ-lớn sau khi đã căn chỉnh dấu phẩy</strong>.</p>
<ul>
<li><strong>Vì sao phép nhân là phép dễ</strong> — ở dạng khoa học, (m<sub>1</sub> × 2<sup>e1</sup>) × (m<sub>2</sub> × 2<sup>e2</sup>) = (m<sub>1</sub> × m<sub>2</sub>) × 2<sup>e1+e2</sup>. Nhân hai phần định trị, cộng hai số mũ, XOR hai bit dấu. Không cần căn chỉnh gì, vì hai số mũ không bắt buộc phải bằng nhau.</li>
<li><strong>Vì sao phép cộng là phép khó</strong> — không thể cộng 5,75 với 7,0234375 ở mức phần định trị chừng nào hai số chưa được viết với <em>cùng</em> một số mũ. Bước căn chỉnh ấy là toàn bộ chỗ rắc rối, và đó là thứ ngốn phần lớn số khối trong lưu đồ ở slide 53.</li>
<li><strong>"Kết hợp dấu với phần định trị"</strong> — nguyên văn chữ trên slide. Dán bit dấu trở lại phía trước phần định trị là bạn có đúng một số nguyên dấu-và-độ-lớn, nên slide 50–51 mới buộc phải đi trước. Câu hỏi "định dạng lỗi thời này còn ở đây làm gì?" giờ đã có câu trả lời.</li>
<li><strong>"Có một số trường hợp đặc biệt chúng ta đã bỏ qua"</strong> — slide nói thật, và đây là những gì nó ám chỉ: vô cực, NaN (0 ÷ 0), số dưới chuẩn quanh số 0, và các luật làm tròn. IEEE 754 định nghĩa hết; môn này không thi chúng.</li>
<li><strong>Chỗ dẫn "Figure 4.8"</strong> — lại một dấu vết của cách đánh số chương 4 bên Forouzan. Trong deck này hình ấy là 3.9, nằm ở slide kế tiếp.</li>
</ul>
<p class="pitfall">⚠️ Phép cộng dấu phẩy động <em>không có tính kết hợp</em>, đúng vì các bước căn chỉnh và làm tròn ở đây. Trong bất kỳ ngôn ngữ nào dùng số thực IEEE, (0.1 + 0.2) + 0.3 và 0.1 + (0.2 + 0.3) có thể cho hai mẫu bit khác nhau, và 0.1 + 0.2 nổi tiếng là không đúng bằng 0.3. Đó là hệ quả của quy trình trên slide này, không phải lỗi trong chương trình của bạn.</p>
<p class="meo">💡 Xếp bốn phép theo độ khó là nhớ được ngay lý do: <strong>× và ÷ dễ vì số mũ chỉ việc cộng trừ; + và − khó vì phải làm cho hai số mũ bằng nhau trước đã.</strong> Đúng ngược với thứ tự bạn quen từ hồi tiểu học.</p>`],

      [53, 'Addition and subtraction of reals in floating-point format (Figure 3.9)',
        `<p class="y-chinh">🎯 The floating-point addition algorithm as a flowchart. It is the longest chart in the chapter, but it is just <strong>seven stages in a straight line</strong> with two early exits at the top.</p>
<p class="nhan">The seven stages, in order.</p>
<ul>
<li><strong>1. Two early exits</strong> — if A = 0 then R ← B and stop; if B = 0 then R ← A and stop. Adding zero needs none of the machinery below, so the chart shortcuts it.</li>
<li><strong>2. Subtract → flip the sign of the second number</strong> — the same trick as slides 48 and 50. From here only addition remains.</li>
<li><strong>3. De-normalise both numbers</strong> — the yellow note explains it: "add the hidden 1 to both mantissas and increment the exponents". The stored mantissa omits the leading 1 of 1.xxxx to save a bit; you must put it back before you can do arithmetic on it.</li>
<li><strong>4. Align the exponents</strong> — the loop on the left: while the two exponents differ, increment the <em>smaller</em> exponent and shift its mantissa right. Always shift the smaller number, never the larger — shifting the larger one would throw away significant bits.</li>
<li><strong>5. Add the combination of signs and mantissas</strong> — and the yellow note says exactly what this is: "this is addition of two numbers in sign-and-magnitude format", i.e. run the flowchart of slide 50.</li>
<li><strong>6. Overflow? → shift the mantissa right and increment the exponent</strong> — if the sum needed one more bit, give it one by moving the binary point.</li>
<li><strong>7. Normalise, then round the mantissa if needed</strong> — shift until the leading digit is a 1 again, remove that hidden 1, adjust the exponent to match, and drop any bits that no longer fit. <em>This last step is where precision is lost</em>, and it is the root of every floating-point surprise in programming.</li>
</ul>
<p class="pitfall">⚠️ The caption reads "Figure 3.9 Addition and subtraction of <em>integers</em> in floating-point format". The slide's own title says <em>reals</em>, and reals is correct — a floating-point number is by definition not an integer. Read the title, not the caption.</p>
<p class="meo">💡 Compress the chart into seven words you can write from memory: <strong>zero-check · flip · de-normalise · align · add · overflow-fix · normalise-and-round.</strong> If you can recite those seven and say one sentence about each, you can reconstruct the whole figure.</p>`,
        `<p class="y-chinh">🎯 Thuật toán cộng số dấu phẩy động vẽ thành lưu đồ. Đây là bức dài nhất cả chương, nhưng thực chất chỉ là <strong>bảy chặng đi thẳng một mạch</strong> cộng hai lối thoát sớm ở trên đầu.</p>
<p class="nhan">Bảy chặng, theo thứ tự.</p>
<ul>
<li><strong>1. Hai lối thoát sớm</strong> — nếu A = 0 thì R ← B rồi dừng; nếu B = 0 thì R ← A rồi dừng. Cộng với số 0 chẳng cần tới bộ máy phía dưới, nên lưu đồ đi tắt luôn.</li>
<li><strong>2. Nếu là phép trừ thì đảo dấu số thứ hai</strong> — đúng mẹo của slide 48 và 50. Từ đây trở đi chỉ còn phép cộng.</li>
<li><strong>3. Bỏ chuẩn hoá cả hai số</strong> — tờ ghi chú vàng nói rõ: "thêm số 1 ẩn vào cả hai phần định trị và tăng số mũ lên". Phần định trị lưu trong máy đã bỏ số 1 dẫn đầu của 1,xxxx để tiết kiệm một bit; phải trả nó về trước khi tính toán được trên đó.</li>
<li><strong>4. Căn chỉnh số mũ</strong> — vòng lặp bên trái: chừng nào hai số mũ còn khác nhau thì tăng số mũ <em>nhỏ hơn</em> và dịch phải phần định trị của nó. Luôn dịch số nhỏ, không bao giờ dịch số lớn — dịch số lớn là vứt đi những bit có nghĩa.</li>
<li><strong>5. Cộng phần kết hợp dấu và định trị</strong> — và tờ ghi chú vàng nói đúng bản chất: "đây là phép cộng hai số dạng dấu-và-độ-lớn", tức là chạy lại lưu đồ của slide 50.</li>
<li><strong>6. Tràn? → dịch phải phần định trị và tăng số mũ</strong> — nếu tổng cần thêm một bit thì cấp cho nó một bit bằng cách dời dấu phẩy nhị phân.</li>
<li><strong>7. Chuẩn hoá lại, rồi làm tròn phần định trị nếu cần</strong> — dịch cho tới khi chữ số dẫn đầu lại là 1, bỏ cái số 1 ẩn ấy đi, chỉnh số mũ cho khớp, và vứt những bit không còn chỗ. <em>Chính bước cuối này làm mất độ chính xác</em>, và nó là gốc rễ của mọi bất ngờ về số thực trong lập trình.</li>
</ul>
<p class="pitfall">⚠️ Chú thích hình ghi "Figure 3.9 Addition and subtraction of <em>integers</em> in floating-point format". Tiêu đề của chính slide ghi <em>reals</em>, và reals mới đúng — một số dấu phẩy động, theo định nghĩa, không phải số nguyên. Hãy đọc tiêu đề, đừng đọc chú thích.</p>
<p class="meo">💡 Nén cả lưu đồ thành bảy từ bạn viết lại được từ trí nhớ: <strong>xét-số-0 · đảo-dấu · bỏ-chuẩn-hoá · căn-số-mũ · cộng · chữa-tràn · chuẩn-hoá-và-làm-tròn.</strong> Đọc thuộc bảy từ ấy và nói được một câu về mỗi từ là bạn dựng lại được cả bức hình.</p>`],

      [54, 'Floating-point addition — (+5.75) + (−7.0234375)',
        `<p class="y-chinh">🎯 The chapter's final worked example: (+5.75) + (−7.0234375) = −1.2734375, done exactly the way slide 53's flowchart says.</p>
<p class="nhan">Step 1 — store both numbers in IEEE 754 single precision (sign · 8-bit excess-127 exponent · 23-bit mantissa), as the slide's first table shows.</p>
<pre>       S   E          M
  A    0   10000001   01110000000000000000000
  B    1   10000001   11000001100000000000000</pre>
<ul>
<li><strong>Check A</strong> — 5.75 = 101.11<sub>2</sub> = 1.0111 × 2<sup>2</sup>. Sign 0. Exponent 2 + 127 = 129 = 10000001 ✓. Mantissa = the fraction after the hidden 1, i.e. 0111 padded with zeros ✓.</li>
<li><strong>Check B</strong> — 7.0234375 = 111.0000011<sub>2</sub> = 1.110000011 × 2<sup>2</sup> (because 0.0234375 = 3/128 = 0.0000011<sub>2</sub>). Sign 1. Exponent also 129 ✓. Mantissa = 110000011 padded ✓. Both patterns verified against <code>struct.pack('&gt;f', …)</code>.</li>
</ul>
<p class="nhan">Step 2 — de-normalise: put the hidden 1 back and increment each exponent, exactly as the slide's second table shows.</p>
<pre>       S   E          denormalised M (24 bits)
  A    0   10000010   101110000000000000000000
  B    1   10000010   111000001100000000000000</pre>
<p class="nhan">Step 3 — the exponents are already equal (both 10000010 = 130), so no alignment loop is needed. Step 4 — add as sign-and-magnitude: the signs differ, and B's magnitude is the larger, so we compute B<sub>M</sub> − A<sub>M</sub> and keep B's sign.</p>
<pre>  B_M  :  1 1 1 0 0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0
  A_M  :  1 0 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
         ────────────────────────────────────────────────
  R_M  :  0 0 1 0 1 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0   sign = 1 (B's)</pre>
<p class="nhan">Step 5 — normalise: the result has two leading zeros, so shift left twice and drop 2 from the exponent view; the leading 1 becomes the hidden bit again.</p>
<p class="dap-an">✅ Answer: R = <strong>1 01111111 01000110000000000000000</strong>. Decoding it: sign 1 → negative; exponent 01111111 = 127, so the true exponent is 127 − 127 = 0; mantissa 1.0100011<sub>2</sub> = 1 + 1/4 + 1/64 + 1/128 = 1.2734375. Hence R = <strong>−1.2734375</strong>, which is exactly 5.75 − 7.0234375. Every step verified: the three bit patterns come back identical from <code>struct.pack('&gt;f', 5.75)</code>, <code>struct.pack('&gt;f', -7.0234375)</code> and <code>struct.pack('&gt;f', -1.2734375)</code>, and the 24-bit subtraction gives 001010001100000000000000, whose value at this exponent is 1.2734375.</p>
<ul>
<li><strong>Why this example is comfortable</strong> — both numbers had the same exponent, so the alignment loop never ran, and both are exact sums of powers of two, so nothing had to be rounded. That is why the answer is exact to the last digit.</li>
<li><strong>Why a real program is not so lucky</strong> — 0.1 has no finite binary expansion, so storing it already rounds, and adding it to 0.2 rounds again. Every "floating-point is weird" story you will meet in PRF192 is this slide's step 7 doing its job.</li>
<li><strong>The rule you should carry away</strong> — never compare two reals with <code>==</code>. Compare with a tolerance: <code>fabs(a - b) &lt; 1e-9</code>.</li>
<li><strong>Where the chapter ends</strong> — with the whole arc closed: Chapter 3 began by saying all data becomes bit patterns, and it ends by showing that even a decimal number with three fractional digits is, in the end, one 32-bit pattern that a hardware adder can chew.</li>
<li><strong>Exam shape</strong> — you are far more likely to be asked to <em>store</em> a real in floating point (slides 17–18) or to <em>do an integer addition</em> (slide 49) than to run this seven-stage procedure by hand. Know the stages by name; practise the integer arithmetic until it is automatic.</li>
</ul>
<p class="pitfall">⚠️ The slide's visible content stops at "De-normalization results in:" — the alignment, the addition and the normalisation are not shown. Do not assume there is nothing left to do: the steps above are the ones the flowchart on slide 53 requires, and an exam can ask for any of them.</p>`,
        `<p class="y-chinh">🎯 Ví dụ cuối cùng của cả chương: (+5,75) + (−7,0234375) = −1,2734375, làm đúng theo lưu đồ ở slide 53.</p>
<p class="nhan">Bước 1 — lưu cả hai số theo IEEE 754 độ chính xác đơn (dấu · số mũ 8 bit thừa 127 · phần định trị 23 bit), đúng như bảng thứ nhất trên slide.</p>
<pre>       S   E          M
  A    0   10000001   01110000000000000000000
  B    1   10000001   11000001100000000000000</pre>
<ul>
<li><strong>Kiểm A</strong> — 5,75 = 101,11<sub>2</sub> = 1,0111 × 2<sup>2</sup>. Dấu 0. Số mũ 2 + 127 = 129 = 10000001 ✓. Phần định trị là phần thập phân sau số 1 ẩn, tức 0111 rồi đệm số 0 ✓.</li>
<li><strong>Kiểm B</strong> — 7,0234375 = 111,0000011<sub>2</sub> = 1,110000011 × 2<sup>2</sup> (vì 0,0234375 = 3/128 = 0,0000011<sub>2</sub>). Dấu 1. Số mũ cũng 129 ✓. Phần định trị = 110000011 rồi đệm ✓. Cả hai mẫu bit đã đối chiếu với <code>struct.pack('&gt;f', …)</code>.</li>
</ul>
<p class="nhan">Bước 2 — bỏ chuẩn hoá: trả số 1 ẩn về và tăng mỗi số mũ lên một, đúng như bảng thứ hai trên slide.</p>
<pre>       S   E          M đã bỏ chuẩn hoá (24 bit)
  A    0   10000010   101110000000000000000000
  B    1   10000010   111000001100000000000000</pre>
<p class="nhan">Bước 3 — hai số mũ vốn đã bằng nhau (cùng 10000010 = 130) nên không phải chạy vòng căn chỉnh. Bước 4 — cộng theo kiểu dấu-và-độ-lớn: hai dấu khác nhau, mà độ lớn của B lớn hơn, nên ta tính B<sub>M</sub> − A<sub>M</sub> rồi lấy dấu của B.</p>
<pre>  B_M  :  1 1 1 0 0 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0
  A_M  :  1 0 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
         ────────────────────────────────────────────────
  R_M  :  0 0 1 0 1 0 0 0 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0   dấu = 1 (của B)</pre>
<p class="nhan">Bước 5 — chuẩn hoá lại: kết quả có hai số 0 dẫn đầu nên dịch trái hai lần và bớt 2 ở phía số mũ; số 1 dẫn đầu lại trở thành bit ẩn.</p>
<p class="dap-an">✅ Đáp án: R = <strong>1 01111111 01000110000000000000000</strong>. Giải mã: dấu 1 → số âm; số mũ 01111111 = 127 nên số mũ thật là 127 − 127 = 0; phần định trị 1,0100011<sub>2</sub> = 1 + 1/4 + 1/64 + 1/128 = 1,2734375. Vậy R = <strong>−1,2734375</strong>, đúng bằng 5,75 − 7,0234375. Mọi bước đã kiểm: ba mẫu bit trả về y hệt từ <code>struct.pack('&gt;f', 5.75)</code>, <code>struct.pack('&gt;f', -7.0234375)</code> và <code>struct.pack('&gt;f', -1.2734375)</code>, còn phép trừ 24 bit cho 001010001100000000000000, mà giá trị của nó ở số mũ này đúng là 1,2734375.</p>
<ul>
<li><strong>Vì sao ví dụ này dễ chịu</strong> — hai số vốn cùng số mũ nên vòng căn chỉnh không phải chạy, và cả hai đều là tổng đúng của các luỹ thừa 2 nên không phải làm tròn gì. Nhờ vậy đáp án chính xác tới chữ số cuối.</li>
<li><strong>Vì sao chương trình thật không may mắn như thế</strong> — 0,1 không có khai triển nhị phân hữu hạn, nên vừa lưu vào đã làm tròn, cộng với 0,2 lại làm tròn lần nữa. Mọi câu chuyện "số thực kỳ quặc" bạn sẽ gặp ở PRF192 chính là bước 7 của slide này đang làm đúng việc của nó.</li>
<li><strong>Quy tắc cần mang theo</strong> — đừng bao giờ so hai số thực bằng <code>==</code>. Hãy so có sai số: <code>fabs(a - b) &lt; 1e-9</code>.</li>
<li><strong>Chương khép lại ở đâu</strong> — vòng cung đã khép trọn: Chương 3 mở đầu bằng câu mọi dữ liệu đều thành mẫu bit, và kết thúc bằng việc chỉ ra rằng ngay cả một số thập phân lẻ tới bảy chữ số, rốt cuộc, cũng chỉ là một mẫu 32 bit mà mạch cộng phần cứng nhai được.</li>
<li><strong>Dạng đề thi</strong> — khả năng bạn bị hỏi <em>lưu</em> một số thực dạng dấu phẩy động (slide 17–18) hoặc <em>làm một phép cộng số nguyên</em> (slide 49) cao hơn nhiều so với việc phải chạy tay đủ bảy chặng này. Hãy thuộc tên các chặng; và luyện phần số học số nguyên cho tới khi thành phản xạ.</li>
</ul>
<p class="pitfall">⚠️ Phần nhìn thấy được của slide dừng ở dòng "De-normalization results in:" — bước căn chỉnh, bước cộng và bước chuẩn hoá đều không được vẽ ra. Đừng tưởng là hết việc: các bước ở trên đúng là những gì lưu đồ ở slide 53 đòi hỏi, và đề thi có thể hỏi bất kỳ bước nào trong đó.</p>`],

    ]),
  ].join('\n'),
};
