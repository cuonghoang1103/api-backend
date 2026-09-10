/**
 * Media Processing — Progress Test 1 (chương s00–s03).
 *
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi. Đề giữa kỳ,
 * dễ hơn FE một bậc: nó hỏi CƠ CHẾ và những con số ỔN ĐỊNH (kích thước, số
 * frame, pixel format, nguyên văn thông báo lỗi), không hỏi số đo thời gian.
 *
 * ⚠️ MỌI con số, mọi đoạn terminal và mọi thông báo lỗi dưới đây đều CHẠY THẬT
 * trên đúng bộ công cụ mà đề FE đã dùng:
 *
 *   sharp 0.35.4 · libvips 8.18.6 (aom 3.15.0, webp 1.6.0, heif 1.23.2,
 *   mozjpeg 0826579, rsvg 2.62.91) · ffmpeg 8.1.2 / ffprobe 8.1.2 (Homebrew,
 *   libx264 + libx265 + libvpx-vp9 + libopus + libmp3lame) · Node v22.21.0 ·
 *   darwin-arm64 · sharp.concurrency() = 8.
 *
 * File mẫu là file TỰ SINH trong một thư mục nháp NGOÀI repo — không đụng
 * `uploads/`, không đụng R2/CDN:
 *   • `photo-4032x3024.jpg` (1.480.022 B) dựng bằng `mandelbrot` của lavfi;
 *   • `land-1600x900.jpg`, `port-900x1600.jpg`, `avatar-400.png` rút từ nó;
 *   • `orient-1..8.jpg` — tám bản cùng một ảnh, chỉ khác thẻ EXIF Orientation;
 *   • `bomb-16000.png` — PNG một màu 16000×16000, đúng **776.180 B**;
 *   • `anim-48.gif` — GIF động 48 frame 480×270 từ `testsrc` (345.659 B);
 *   • `screen-1280x720.png` từ `testsrc2` (96.453 B);
 *   • `evil.svg` — SVG hợp lệ có kèm `<script>`;
 *   • `clip-720p-10s.mp4` (3.645.357 B) và `clip-360p-3min.mp4` từ `testsrc2`.
 *
 * ⚠️ HAI CHỖ GIÁO TRÌNH KHÁC MÁY — đã đo lại, ĐỀ THEO MÁY. Cả hai đều KHÔNG
 * nằm trong bảy chỗ mà `MEDIA-PROCESSING-FE.mjs` đã ghi:
 *
 *   • **Bài 2.2 nói phải tự truyền `loop` và `delay` sang bản WebP, nếu không
 *     "Sharp writes its own defaults, which usually means an infinite loop at a
 *     uniform frame delay".** Đo thật trên sharp 0.35.4: encode
 *     `sharp(gif, { animated: true }).webp({ quality: 75 })` KHÔNG truyền gì
 *     cả, và bản ra vẫn giữ nguyên **cả 48 giá trị `delay`** (…40,40,50,40…
 *     giống hệt nguồn, so sánh bằng `JSON.stringify` cho `true`) lẫn `loop`
 *     (thử tiếp với một GIF `loop: 3` — bản WebP ra cũng `loop: 3`). Truyền
 *     tay không sai, nhưng nó KHÔNG còn là thứ quyết định frame chạy đúng nhịp.
 *     Câu 20 hỏi đúng phép đo này.
 *
 *   • **Bài 1.3 mô tả `withoutEnlargement` như "một tầng nữa của cùng lời hứa"
 *     và chỉ minh hoạ bằng resize theo width.** Đo thật 648 tổ hợp
 *     (9 nguồn × 5 `fit` × 6 khung × có/không cờ, cộng các ca một chiều):
 *     với `fit: 'cover'` và `'fill'` mà nêu CẢ hai chiều, cờ này kẹp **từng
 *     TRỤC một cách độc lập** — `640×360` xin `cover 500×500` ra
 *     **`500×360`**, chứ không phải "bỏ qua resize" và cũng không phải
 *     `500×500`. Với `fit: 'contain'` thì cờ gần như vô hiệu: khung vẫn ra
 *     đúng kích thước xin, phần thiếu là nền. Câu 11 và câu 31 hỏi đúng chỗ này.
 *
 * ⚠️ NHỮNG SỐ ĐO ĐÃ TRÁNH RA ĐỀ (không ổn định hoặc không tái hiện được):
 *   • **Mọi phép đo THỜI GIAN.** Máy này đang chạy nhiều agent khác, nên không
 *     có một con số mili-giây nào trong đề. Chỗ nào giáo trình nói bằng thời
 *     gian (tỉ số 318× của `-ss`, 3,5× của effort, 200× của stream copy) thì
 *     câu hỏi chuyển sang hỏi CƠ CHẾ hoặc hỏi thứ đo được là kích thước file.
 *   • **Nhánh `LARGER` của `formatSavings()`**: file JPEG nhỏ đã tối ưu sẵn
 *     (`small-320.jpg`, 6.921 B) qua pipeline vẫn ra NHỎ HƠN (5.964 B, -14%).
 *     Không tái hiện được ca "re-encode phình ra" ⇒ không ra đề.
 *   • **"PNG thắng WebP trên ảnh chụp màn hình"**: đo trên `screen-1280x720.png`
 *     thì WebP q80 ra 28.082 B còn PNG level 9 ra 96.734 B. Không tái hiện được
 *     (FE cũng đã ghi nhận điều này) ⇒ không ra đề.
 *   • **Điểm gãy của thang `effort`**: trên ảnh mẫu này 0→2 tiết kiệm 19% còn
 *     2→6 chỉ tiết kiệm 4% (62.206 B ở effort 0, 48.194 B ở effort 6), nên
 *     "knee ở 4" của giáo trình không đo lại được đúng vị trí. Không câu nào
 *     trong đề hỏi tới thang `effort` — cả vị trí điểm gãy lẫn chiều của thang
 *     đều để lại đây, trong phần chú thích này, thay vì thành một câu hỏi.
 *   • Dữ kiện phía trình duyệt và giá dịch vụ (Safari chỉ giải mã 4:2:0, giá
 *     R2/S3, tỉ lệ 40% ảnh điện thoại xoay) là dữ kiện TRÍCH DẪN — những câu
 *     chạm tới chúng đều hỏi cơ chế hoặc hỏi nửa đo được của vấn đề.
 *
 * Phân bố câu theo chương:
 *   s00 vì sao xử lý media ........ 5   (q1–q5)
 *   s01 nền tảng Sharp ............ 9   (q6–q14)
 *   s02 Sharp trong production .... 8   (q15–q22)
 *   s03 FFmpeg từ Node ............ 8   (q23–q30)
 *   2 câu lập trình ............... q31 (Sharp resize/fit) · q32 (EXIF 1–8)
 *
 * Phân bố vị trí đáp án — 28 câu một đáp án + 2 câu "chọn HAI" = 32 lượt chọn,
 * chia A 8 · B 8 · C 8 · D 8. Kiểm bằng:
 *   node -e "import('./content/exams/MEDIA-PROCESSING-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MEDIA-PROCESSING-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/media-exam-kit.mjs';

export default {
  course: { slug: 'media-processing' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 0–3 (formats, Sharp, Sharp in production, FFmpeg from Node)',
        'Kiểm tra tiến độ 1 — Chương 0–3 (format, Sharp, Sharp trong production, FFmpeg từ Node)',
      ),
      description: B(
        'First third of the Media Processing course: picking a format, where the work happens, the lazy Sharp pipeline, metadata() as a gate, resize and EXIF, SVG and animation, encoder tuning, and calling FFmpeg without a shell. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba đầu của khoá Media Processing: chọn format, xử lý ở đâu, pipeline lười của Sharp, metadata() làm cổng chặn, resize và EXIF, SVG và ảnh động, tinh chỉnh encoder, và gọi FFmpeg mà không qua shell. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–3'),
      questions: [
        // ── Chương 0 — Vì sao xử lý media ───────────────────────────────
        mcq({
          prompt: B(
            'The same 4032×3024 source, reduced to 1200 px wide, encoded five ways on this machine:' + code(
              'webp     q=80 effort=4        49.246 B\n' +
              'avif     q=50 effort=4        35.028 B\n' +
              'jpeg     q=80 (plain)         74.164 B\n' +
              'jpeg     q=80 mozjpeg:true    63.613 B\n' +
              'png      compressionLevel=9   1.058.526 B',
            ) + 'Which reading of the PNG row is correct?',
            'Cùng một nguồn 4032×3024, thu về rộng 1200 px, encode năm kiểu trên máy này:' + code(
              'webp     q=80 effort=4        49.246 B\n' +
              'avif     q=50 effort=4        35.028 B\n' +
              'jpeg     q=80 (plain)         74.164 B\n' +
              'jpeg     q=80 mozjpeg:true    63.613 B\n' +
              'png      compressionLevel=9   1.058.526 B',
            ) + 'Cách đọc nào về dòng PNG là ĐÚNG?',
          ),
          options: [
            B(
              'PNG lost because <code>compressionLevel: 9</code> is the wrong dial — raising it to the maximum and adding <code>effort: 10</code> would bring the file down into WebP territory, since both formats ultimately run the same zlib pass over the same pixels',
              'PNG thua vì <code>compressionLevel: 9</code> là núm sai — đẩy nó lên tối đa và thêm <code>effort: 10</code> sẽ kéo file xuống ngang WebP, bởi cả hai format rốt cuộc đều chạy cùng một lượt zlib trên cùng đám pixel',
            ),
            B(
              'PNG is larger because Sharp had to add an alpha channel that the JPEG source did not have, and four channels instead of three is where the extra bytes went',
              'PNG lớn hơn vì Sharp phải thêm kênh alpha mà nguồn JPEG không có, và bốn kênh thay vì ba chính là chỗ số byte dôi ra',
            ),
            B(
              'The PNG row is an artefact of the synthetic source; on a real camera photo PNG lands within about 20% of JPEG because real sensor noise compresses the same way in both encoders',
              'Dòng PNG là hệ quả của việc nguồn là ảnh tổng hợp; trên ảnh máy ảnh thật thì PNG chỉ hơn JPEG chừng 20% vì nhiễu cảm biến thật nén giống nhau ở cả hai encoder',
            ),
            B(
              'PNG is lossless, so it must describe every one of the 1200×900 pixels exactly; on a photograph, where almost no two neighbouring pixels are identical, that is 21× the WebP file. PNG belongs to exact-pixel graphics, not to photos',
              'PNG là nén không mất dữ liệu, nên nó phải mô tả chính xác từng pixel trong 1200×900; trên một tấm ảnh chụp, nơi gần như không có hai pixel cạnh nhau giống hệt, con số đó là 21 lần file WebP. PNG dành cho đồ hoạ đúng-từng-pixel, không dành cho ảnh chụp',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, not guessed. Lossy encoders are allowed to throw information away and they throw away exactly the information a photograph is full of — tiny gradations nobody can name. Lossless PNG may not, so a 1200×900 photo costs 1.058.526 B while the same pixels as WebP q80 cost 49.246 B. Note the mozjpeg row too: <code>jpeg({ mozjpeg: true })</code> at the same quality measured 63.613 B against plain JPEG\'s 74.164 B — 14% smaller for one boolean.',
            'Đo thật, không đoán. Encoder có mất dữ liệu được phép vứt bớt thông tin, và thứ nó vứt đúng là thứ một tấm ảnh chụp có đầy — những chuyển sắc nhỏ không ai gọi tên được. PNG không mất dữ liệu thì không được phép vứt, nên một tấm 1200×900 tốn 1.058.526 B trong khi cùng đám pixel đó ở WebP q80 chỉ tốn 49.246 B. Để ý cả dòng mozjpeg: <code>jpeg({ mozjpeg: true })</code> ở cùng quality đo được 63.613 B so với 74.164 B của JPEG thường — nhỏ hơn 14% chỉ nhờ một giá trị boolean.',
          ),
        }),

        mcq({
          prompt: B(
            'A route accepts a file the client posted as <code>Content-Type: image/png</code> with the filename <code>logo.png</code>. Handed the same bytes, Sharp reports:' + code(
              "await sharp(buf).metadata()\n" +
              "→ { format: 'svg', mediaType: 'image/svg+xml', width: 100, height: 100, density: 72 }",
            ) + 'What does that tell you, and what follows from it?',
            'Một route nhận một file mà client gửi lên với <code>Content-Type: image/png</code> và tên <code>logo.png</code>. Đưa đúng đám byte đó cho Sharp:' + code(
              "await sharp(buf).metadata()\n" +
              "→ { format: 'svg', mediaType: 'image/svg+xml', width: 100, height: 100, density: 72 }",
            ) + 'Điều đó nói lên cái gì, và kéo theo cái gì?',
          ),
          options: [
            B(
              'Sharp guessed from the <code>.png</code> filename and got it wrong; passing <code>{ failOn: &quot;none&quot; }</code> makes it read the real header instead of the name',
              'Sharp đoán theo tên file <code>.png</code> và đoán sai; truyền <code>{ failOn: &quot;none&quot; }</code> sẽ khiến nó đọc header thật thay vì đọc tên',
            ),
            B(
              'Nothing useful — <code>metadata()</code> only parses the header, and a header can be forged as easily as a MIME type, so the answer still has to come from the full decode',
              'Chẳng nói lên gì hữu ích — <code>metadata()</code> chỉ đọc header, mà header thì giả mạo dễ ngang MIME type, nên câu trả lời vẫn phải đến từ lượt decode đầy đủ',
            ),
            B(
              'Both the MIME type and the filename are client-controlled and both are wrong here; Sharp sniffed the actual bytes. The upload guard therefore cannot rely on either signal alone, and this particular file is an SVG arriving under a PNG disguise',
              'Cả MIME type lẫn tên file đều do client đặt và ở đây cả hai đều sai; Sharp đọc chính đám byte. Nên chốt chặn upload không thể tin riêng tín hiệu nào, và cái file cụ thể này là một SVG đội lốt PNG',
            ),
            B(
              'The file is a PNG that happens to contain an embedded SVG preview thumbnail, which is what Sharp latched onto; the outer container is still a legitimate PNG and is safe to store',
              'File là một PNG có nhúng sẵn một ảnh xem trước dạng SVG, và Sharp bắt trúng cái đó; lớp vỏ ngoài vẫn là PNG hợp lệ và lưu lại là an toàn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Chapter 0 states the rule and Chapter 2 turns it into a security control: the extension and the MIME header are two strings the client typed, and neither is evidence. The bytes are. <code>metadata()</code> reads the magic bytes and the header, costs microseconds, and here it says <code>format: &quot;svg&quot;</code> — which is precisely the format the repo rejects, because an SVG is XML that can carry <code>&lt;script&gt;</code>.',
            'Chương 0 nêu quy tắc và chương 2 biến nó thành một chốt chặn an ninh: phần mở rộng và header MIME là hai chuỗi do client gõ, và không cái nào là bằng chứng. Đám byte mới là bằng chứng. <code>metadata()</code> đọc magic byte cùng header, tốn vài micro giây, và ở đây nó nói <code>format: &quot;svg&quot;</code> — đúng cái format mà kho này từ chối, vì SVG là XML và XML mang được <code>&lt;script&gt;</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A product has a hot feed: essentially every image uploaded is viewed within minutes, by many people. Someone proposes the on-demand + CDN architecture because "we only encode what is actually looked at". What is the specific cost of that choice on this workload?',
            'Một sản phẩm có feed nóng: gần như mọi ảnh upload lên đều được xem trong vài phút, và nhiều người xem. Có người đề xuất kiến trúc on-demand + CDN vì "chỉ encode đúng thứ có người xem". Cái giá cụ thể của lựa chọn ấy trên tải này là gì?',
          ),
          options: [
            B(
              'Storage grows faster than with upload-time processing, because the originals are kept alongside every generated variant instead of replacing them',
              'Dung lượng lưu trữ phình nhanh hơn so với xử lý lúc upload, vì bản gốc được giữ song song với mọi variant sinh ra thay vì thay thế chúng',
            ),
            B(
              'On-demand cannot apply the EXIF rotation, because the rotation has to happen before the file is stored and on-demand stores the original untouched',
              'On-demand không áp được phép xoay EXIF, vì phép xoay phải xảy ra trước khi lưu file, mà on-demand thì lưu bản gốc nguyên vẹn',
            ),
            B(
              'The cache-miss encode lands on a real user for every variant that has not been generated yet, so on a hot feed nearly every first view pays the encode latency instead of nearly none of them',
              'Lượt encode khi cache trượt rơi trúng một người dùng thật với mọi variant chưa được sinh, nên trên một feed nóng thì gần như MỌI lượt xem đầu tiên phải trả độ trễ encode, thay vì gần như không lượt nào',
            ),
            B(
              'The pixel budget from Chapter 1 stops working, because the guard runs at upload time and on-demand has no upload-time step at all',
              'Ngân sách pixel của chương 1 hết tác dụng, vì chốt chặn chạy lúc upload mà on-demand thì không có bước lúc upload nào cả',
            ),
          ],
          correct: 2,
          explanation: EX(
            'On-demand wins when most uploads are never viewed — the long-tail library. Its saving is exactly the encodes it never performs, and a hot feed performs all of them anyway, so the saving disappears while the cache-miss latency stays. The course states it plainly: "Every image gets viewed immediately (hot feed) — the first-view latency lands on every user." The other three options describe things on-demand handles fine: it still rotates (at generation time), it still keeps one original plus cached variants, and the pixel budget moves to the generation step rather than vanishing.',
            'On-demand thắng khi phần lớn ảnh upload chẳng ai xem — thư viện đuôi dài. Cái nó tiết kiệm chính là những lượt encode nó không phải chạy, mà một feed nóng thì chạy hết chúng, nên phần tiết kiệm biến mất còn độ trễ cache-trượt thì ở lại. Giáo trình nói thẳng: "Every image gets viewed immediately (hot feed) — the first-view latency lands on every user." Ba lựa chọn còn lại mô tả những thứ on-demand xử lý được: nó vẫn xoay (lúc sinh ảnh), nó vẫn giữ một bản gốc cộng các variant trong cache, và ngân sách pixel chuyển sang bước sinh ảnh chứ không biến mất.',
          ),
        }),

        mcq({
          prompt: B(
            'Chapter 0 costs one workload two ways: 100.000 photos a month, 5 variants each, of which only 30% of the photos are ever viewed, at an average of 2 variants when they are.' + code(
              'Upload-time / background   500.000 variants generated\n' +
              'On-demand + cache           60.000 variants generated',
            ) + 'Choose <b>TWO</b> statements that the comparison actually supports.',
            'Chương 0 tính chi phí một workload theo hai cách: 100.000 ảnh mỗi tháng, 5 variant mỗi ảnh, mà chỉ 30% số ảnh có người xem, và khi có người xem thì trung bình chỉ 2 variant được dùng.' + code(
              'Xử lý lúc upload / job nền   sinh ra 500.000 variant\n' +
              'On-demand + cache             sinh ra  60.000 variant',
            ) + 'Chọn <b>HAI</b> phát biểu mà phép so sánh này thật sự chứng minh được.',
          ),
          options: [
            B(
              'Background-job processing removes the wasted variants, because the worker can see which ones will be requested before it encodes them',
              'Xử lý bằng job nền loại bỏ được phần variant lãng phí, vì worker nhìn thấy được variant nào sẽ có người xin trước khi nó encode',
            ),
            B(
              'Upload-time and background-job generate exactly the same set of variants; moving to a queue changes WHO waits, not HOW MUCH work is done',
              'Xử lý lúc upload và job nền sinh ra đúng cùng một tập variant; chuyển sang hàng đợi chỉ đổi AI phải chờ, không đổi KHỐI LƯỢNG việc phải làm',
            ),
            B(
              'The 440.000 variants nobody asks for cost storage every month forever, whereas the CPU that produced them was spent once — so skipping a variant is worth more over time than encoding it faster',
              '440.000 variant không ai xin tốn dung lượng lưu trữ mỗi tháng, vĩnh viễn, trong khi CPU sinh ra chúng chỉ tốn một lần — nên bỏ hẳn một variant có giá trị theo thời gian lớn hơn là encode nó nhanh hơn',
            ),
            B(
              'On-demand is therefore the correct architecture for this workload regardless of the traffic shape, since 60.000 is smaller than 500.000 under every possible viewing pattern',
              'Vậy on-demand là kiến trúc đúng cho workload này bất kể hình dạng lưu lượng, vì 60.000 nhỏ hơn 500.000 với mọi kiểu xem có thể có',
            ),
          ],
          correct: [1, 2],
          explanation: EX(
            'The queue moves the wait off the request; it does not make the work smaller — both rows still generate 500.000 variants, and a worker cannot know in advance which will be requested. What the numbers really argue is the asymmetry from Chapter 6: CPU is spent once, storage is charged every month, so the variant you never generate keeps paying you back. And the last option overreaches — the 30%-viewed figure is an input, and the previous question is the case where it is 100%.',
            'Hàng đợi đẩy phần chờ ra khỏi request; nó không làm việc nhỏ đi — cả hai dòng vẫn sinh 500.000 variant, và worker thì không thể biết trước cái nào sẽ có người xin. Thứ mà những con số này thật sự nói là tính bất đối xứng của chương 6: CPU tiêu một lần, dung lượng tính tiền mỗi tháng, nên cái variant bạn không bao giờ sinh ra cứ trả lại tiền mãi. Còn lựa chọn cuối thì nói quá — con số 30% là một GIẢ THIẾT đầu vào, và câu ngay trước đó chính là trường hợp nó bằng 100%.',
          ),
        }),

        mcq({
          prompt: B(
            'The repo sends synthesised speech to an ESP32 robot. TTS returns MP3 (~6 KB a sentence); the code decodes it to raw 16 kHz mono PCM (~120 KB a sentence) and ships the PCM over WiFi. Twenty times the bytes, on purpose. What makes that the right call?',
            'Kho này gửi giọng nói tổng hợp xuống một robot ESP32. TTS trả về MP3 (~6 KB một câu); mã giải mã nó thành PCM thô 16 kHz mono (~120 KB một câu) rồi đẩy PCM qua WiFi. Gấp hai mươi lần số byte, một cách cố ý. Điều gì làm cho lựa chọn đó là đúng?',
          ),
          options: [
            B(
              'PCM at 16 kHz is higher fidelity than the MP3 it came from, so the extra bytes buy audible quality on the robot speaker',
              'PCM ở 16 kHz trung thực hơn cái MP3 mà nó được giải ra, nên số byte dôi thêm mua được chất lượng nghe thấy được trên loa robot',
            ),
            B(
              'The 120 KB is about 0,1 s over WiFi, while an MP3 decoder on the microcontroller means a library, a ring buffer in PSRAM, and a class of timing bug — the metric that mattered was engineering time on the device, not bandwidth',
              '120 KB tương đương chừng 0,1 s qua WiFi, trong khi một bộ giải mã MP3 trên vi điều khiển nghĩa là thêm một thư viện, một ring buffer trong PSRAM, và cả một họ lỗi định thời — chỉ số thật sự quyết định là thời gian kỹ thuật trên thiết bị, không phải băng thông',
            ),
            B(
              'The ESP32 cannot receive a file larger than a few kilobytes over HTTP, so MP3 would have to be chunked while PCM can be streamed straight to I2S',
              'ESP32 không nhận nổi file lớn hơn vài kilobyte qua HTTP, nên MP3 sẽ phải cắt thành nhiều mẩu còn PCM thì chảy thẳng vào I2S được',
            ),
            B(
              'MP3 is patent-encumbered on embedded devices, so shipping a decoder in the firmware would have been a licensing problem',
              'MP3 vướng bằng sáng chế trên thiết bị nhúng, nên nhét một bộ giải mã vào firmware sẽ là vấn đề bản quyền',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Decoding never adds information — the PCM carries exactly what the MP3 carried, at 20× the size. The comment in <code>src/services/makerlab/audio.ts</code> says the quiet part out loud: 120 KB over WiFi is about a tenth of a second, and one MP3-decoder bug cost an entire evening. Format choice is a trade across several axes, and bytes is only one of them. The upgrade path was deliberately left open — both ends already negotiate an <code>audio</code> field in the <code>hello</code> packet.',
            'Giải mã không bao giờ thêm thông tin — đám PCM mang đúng thứ mà MP3 mang, với kích thước gấp 20 lần. Comment trong <code>src/services/makerlab/audio.ts</code> nói thẳng phần ít ai nói: 120 KB qua WiFi là chừng một phần mười giây, còn một con bug của bộ giải mã MP3 đã ngốn trọn một buổi tối. Chọn format là một phép đánh đổi trên nhiều trục, và số byte chỉ là một trục. Đường nâng cấp thì cố ý để ngỏ — hai đầu vốn đã thoả thuận sẵn một trường <code>audio</code> trong gói <code>hello</code>.',
          ),
        }),

        // ── Chương 1 — Nền tảng Sharp ───────────────────────────────────
        mcq({
          prompt: B(
            'The same JPEG is read two ways on sharp 0.35.4 and the returned key lists are compared:' + code(
              "await sharp('photo.jpg').metadata()\n" +
              '  format, mediaType, width, height, space, channels, depth, density,\n' +
              '  chromaSubsampling, isProgressive, isPalette, hasProfile, hasAlpha, autoOrient\n' +
              '\n' +
              "await sharp(readFileSync('photo.jpg')).metadata()\n" +
              '  format, mediaType, size, width, height, space, channels, depth, density,\n' +
              '  chromaSubsampling, isProgressive, isPalette, hasProfile, hasAlpha, autoOrient\n' +
              '\n' +
              'size = 1480022 · the file on disk = 1480022',
            ) + 'Why does one call have <code>size</code> and the other not?',
            'Cùng một file JPEG được đọc theo hai cách trên sharp 0.35.4, và danh sách khoá trả về được đem so:' + code(
              "await sharp('photo.jpg').metadata()\n" +
              '  format, mediaType, width, height, space, channels, depth, density,\n' +
              '  chromaSubsampling, isProgressive, isPalette, hasProfile, hasAlpha, autoOrient\n' +
              '\n' +
              "await sharp(readFileSync('photo.jpg')).metadata()\n" +
              '  format, mediaType, size, width, height, space, channels, depth, density,\n' +
              '  chromaSubsampling, isProgressive, isPalette, hasProfile, hasAlpha, autoOrient\n' +
              '\n' +
              'size = 1480022 · file trên đĩa = 1480022',
            ) + 'Vì sao một lượt gọi có <code>size</code> còn lượt kia thì không?',
          ),
          options: [
            B(
              'Reading from a path makes Sharp stream the file lazily, so the total length is genuinely unknown until the last byte is pulled, and reporting it would require a full read',
              'Đọc theo đường dẫn khiến Sharp chảy dòng file một cách lười, nên tổng độ dài thật sự chưa biết được cho tới byte cuối, và báo nó ra sẽ đòi một lượt đọc đầy đủ',
            ),
            B(
              'It is a bug fixed in libvips 8.19; on this build the path form silently drops several fields including <code>size</code>, <code>orientation</code> and <code>exif</code>',
              'Đó là một lỗi đã sửa ở libvips 8.19; trên bản dựng này dạng đường dẫn âm thầm bỏ mất vài trường, gồm <code>size</code>, <code>orientation</code> và <code>exif</code>',
            ),
            B(
              '<code>size</code> means the size of the DECODED image in memory, which is only computable once a Buffer has been materialised; from a path the decode has not happened yet',
              '<code>size</code> nghĩa là kích thước của ảnh ĐÃ GIẢI MÃ trong bộ nhớ, mà thứ đó chỉ tính được khi đã có một Buffer; từ đường dẫn thì lượt giải mã chưa xảy ra',
            ),
            B(
              '<code>size</code> is the length of the input Sharp was handed. Given a Buffer, that is <code>buffer.length</code> and is free; given a path, Sharp did not receive the bytes and does not <code>stat()</code> the file for you — so the field is simply absent',
              '<code>size</code> là độ dài của đầu vào mà Sharp được đưa cho. Khi đầu vào là Buffer thì đó chính là <code>buffer.length</code>, miễn phí; khi đầu vào là đường dẫn thì Sharp không nhận đám byte và cũng không <code>stat()</code> file hộ bạn — nên trường đó đơn giản là không có',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured on both forms of the same file. <code>metadata()</code> is header-only either way — the point of Lesson 1.2 — and <code>size</code> is not a header field at all: it is the length of what you passed in. Do not build a byte guard on it. If you need the file size from a path, <code>fs.stat()</code> it; if you need the pixel budget, that is <code>width × height</code>, which IS in the header and is the only number that catches a decompression bomb.',
            'Đo trên cả hai dạng của cùng một file. <code>metadata()</code> chỉ đọc header trong cả hai trường hợp — đó là ý của bài 1.2 — và <code>size</code> vốn không phải trường trong header: nó là độ dài của thứ bạn truyền vào. Đừng dựng chốt chặn theo byte trên nó. Cần kích thước file từ một đường dẫn thì gọi <code>fs.stat()</code>; cần ngân sách pixel thì đó là <code>width × height</code>, thứ CÓ trong header và là con số duy nhất bắt được một quả bom giải nén.',
          ),
        }),

        mcq({
          prompt: B(
            'A multi-variant helper decodes once and forks per size:' + code(
              'const SIZES = [400, 800, 1600]\n' +
              'const base = sharp(input, { limitInputPixels: 100_000_000 })\n' +
              'const meta = await base.metadata()\n' +
              '\n' +
              'const wanted = SIZES.filter((w) => w <= meta.width)      // <- this line\n' +
              'await Promise.all(wanted.map((width) => base.clone()\n' +
              '  .resize({ width, withoutEnlargement: true })\n' +
              '  .rotate().webp({ quality: 80 }).toBuffer()))',
            ) + 'On a 600-px-wide source, what would change if the filter line were deleted?',
            'Một hàm sinh nhiều variant giải mã một lần rồi rẽ nhánh theo từng cỡ:' + code(
              'const SIZES = [400, 800, 1600]\n' +
              'const base = sharp(input, { limitInputPixels: 100_000_000 })\n' +
              'const meta = await base.metadata()\n' +
              '\n' +
              'const wanted = SIZES.filter((w) => w <= meta.width)      // <- dòng này\n' +
              'await Promise.all(wanted.map((width) => base.clone()\n' +
              '  .resize({ width, withoutEnlargement: true })\n' +
              '  .rotate().webp({ quality: 80 }).toBuffer()))',
            ) + 'Trên một nguồn rộng 600 px, xoá dòng lọc đó đi thì có gì thay đổi?',
          ),
          options: [
            B(
              'Two extra 600×450 files would be produced and stored under 800 and 1600 keys — <code>withoutEnlargement</code> stops the BLUR but it does not stop the FILE, so you pay storage and a write operation for two duplicates of a variant you already have',
              'Sẽ có thêm hai file 600×450 được sinh ra và lưu dưới key 800 và 1600 — <code>withoutEnlargement</code> chặn được ĐỘ MỜ nhưng không chặn được CÁI FILE, nên bạn trả tiền lưu trữ và một thao tác ghi cho hai bản sao của một variant vốn đã có',
            ),
            B(
              'Two extra files would be produced at 800×600 and 1600×1200, visibly soft, because <code>withoutEnlargement</code> only applies when both a width and a height are given',
              'Sẽ có thêm hai file ở 800×600 và 1600×1200, mờ trông thấy, vì <code>withoutEnlargement</code> chỉ có tác dụng khi nêu cả chiều rộng lẫn chiều cao',
            ),
            B(
              'Nothing at all: <code>withoutEnlargement</code> makes the two oversized entries no-ops, so <code>Promise.all</code> resolves with one buffer instead of three',
              'Không có gì cả: <code>withoutEnlargement</code> làm hai mục quá cỡ trở thành lệnh rỗng, nên <code>Promise.all</code> trả về một buffer thay vì ba',
            ),
            B(
              'The <code>clone()</code> calls would start competing for the same decoded input, so the second and third variants would read a pipeline that has already been consumed and throw',
              'Các lời gọi <code>clone()</code> sẽ tranh nhau cùng một đầu vào đã giải mã, nên variant thứ hai và thứ ba sẽ đọc một pipeline đã bị tiêu thụ rồi và ném lỗi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two guards that sound alike and do different jobs. <code>withoutEnlargement</code> is about the PIXELS: it refuses to interpolate, so the output stays 600×450 and stays sharp. The <code>SIZES.filter</code> is about the WORK: it refuses to run the encode at all. Without it you spend CPU on two encodes, a write operation on two objects, and monthly storage on two files that are byte-for-byte the same picture as the 400 variant is derived from — and any code that later picks "the 1600 variant" gets a 600-px image. Filter the list against <code>metadata.width</code> before the loop, which is one line and costs a header read you were already doing.',
            'Hai chốt chặn nghe giống nhau mà làm hai việc khác nhau. <code>withoutEnlargement</code> nói về PIXEL: nó từ chối nội suy, nên bản ra giữ nguyên 600×450 và giữ được độ nét. Còn <code>SIZES.filter</code> nói về CÔNG VIỆC: nó từ chối chạy lượt encode ngay từ đầu. Không có nó thì bạn tiêu CPU cho hai lượt encode, một thao tác ghi cho hai object, và tiền lưu trữ hằng tháng cho hai file mà về mặt hình ảnh chẳng khác gì nhau — rồi bất kỳ đoạn mã nào về sau chọn "bản 1600" đều nhận về một tấm ảnh rộng 600 px. Hãy lọc danh sách theo <code>metadata.width</code> TRƯỚC vòng lặp, chỉ một dòng, và nó tốn đúng một lượt đọc header mà bạn vốn đã làm.',
          ),
        }),

        mcq({
          prompt: B(
            'On this machine <code>sharp.concurrency()</code> returns <b>8</b>. A service adds an application-level gate of 4 simultaneous <code>toBuffer()</code> calls. What is the relationship between the two numbers?',
            'Trên máy này <code>sharp.concurrency()</code> trả về <b>8</b>. Một dịch vụ thêm một chốt ở tầng ứng dụng cho phép tối đa 4 lời gọi <code>toBuffer()</code> chạy đồng thời. Quan hệ giữa hai con số ấy là gì?',
          ),
          options: [
            B(
              'They are the same dial expressed twice; the gate of 4 overrides the libvips setting, so at most 4 threads ever run',
              'Chúng là cùng một núm vặn nói hai lần; chốt 4 đè lên cấu hình của libvips, nên nhiều nhất chỉ có 4 luồng từng chạy',
            ),
            B(
              '<code>concurrency()</code> counts Node worker threads, so 8 of them plus the gate means the event loop is blocked by up to 4 decodes at a time',
              '<code>concurrency()</code> đếm số Node worker thread, nên 8 cái cộng với cái chốt nghĩa là event loop bị chặn bởi tối đa 4 lượt giải mã cùng lúc',
            ),
            B(
              'They multiply: <code>concurrency()</code> is native libvips threads used <i>per operation</i>, the gate is how many operations run at once, so the worst case is 4 × 8 = 32 threads competing for CPU',
              'Chúng NHÂN với nhau: <code>concurrency()</code> là số luồng libvips gốc dùng cho MỖI phép, còn cái chốt là số phép chạy cùng lúc, nên ca xấu nhất là 4 × 8 = 32 luồng tranh CPU',
            ),
            B(
              'The gate is redundant: because libvips threads are native and do not block the event loop, unbounded concurrent decodes cost nothing extra',
              'Cái chốt là thừa: vì luồng libvips là luồng gốc và không chặn event loop, nên để số lượt giải mã đồng thời không giới hạn cũng chẳng tốn thêm gì',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two independent dials, and the CPU pressure is their product. libvips threads are native, so they genuinely do not block the event loop — which is exactly why they are easy to over-subscribe: nothing in Node pushes back. The pixel budget caps the cost of ONE image; the gate caps how many of those costs stack at the same instant; <code>sharp.concurrency(n)</code> caps how wide each one spreads. You need all three sized against the same box.',
            'Hai núm vặn độc lập, và áp lực CPU là TÍCH của chúng. Luồng libvips là luồng gốc nên đúng là chúng không chặn event loop — mà chính vì thế chúng rất dễ bị đặt quá tay: chẳng có gì trong Node đẩy ngược lại. Ngân sách pixel chặn chi phí của MỘT tấm ảnh; cái chốt chặn số chi phí đó chồng lên nhau cùng lúc; <code>sharp.concurrency(n)</code> chặn độ rộng của từng lượt. Cả ba phải được đặt theo cùng một cỗ máy.',
          ),
        }),

        mcq({
          prompt: B(
            'A thumbnail pipeline uses <code>resize(800, 800, { fit: &quot;cover&quot; })</code> and support keeps reporting portraits with the subject\'s head cut off. Which change addresses it, and what does it cost?',
            'Một đường ống sinh thumbnail dùng <code>resize(800, 800, { fit: &quot;cover&quot; })</code> và bộ phận hỗ trợ liên tục báo có những tấm ảnh dọc bị cắt mất đầu người trong ảnh. Thay đổi nào xử lý được, và nó tốn gì?',
          ),
          options: [
            B(
              'Switch to <code>fit: &quot;contain&quot;</code>, which never crops — the cost is letterbox bars whose colour you control with <code>background</code>, and an output that is mostly empty for a tall portrait',
              'Chuyển sang <code>fit: &quot;contain&quot;</code>, thứ không bao giờ cắt — cái giá là viền đệm mà bạn chọn màu bằng <code>background</code>, và một bản ra phần lớn là chỗ trống với một tấm ảnh dọc cao',
            ),
            B(
              'Add <code>position</code>: <code>&quot;top&quot;</code> is the cheap fix for portraits because heads sit near the top, and <code>sharp.strategy.attention</code> is the general one for unpredictable user photos — it costs extra CPU per image because libvips scans for the most salient region before cropping',
              'Thêm <code>position</code>: <code>&quot;top&quot;</code> là cách sửa rẻ cho ảnh chân dung vì đầu người nằm gần mép trên, còn <code>sharp.strategy.attention</code> là cách tổng quát cho ảnh người dùng khó đoán — nó tốn thêm CPU cho mỗi ảnh vì libvips phải quét tìm vùng nổi bật nhất trước khi cắt',
            ),
            B(
              'Add <code>withoutEnlargement: true</code>, which stops <code>cover</code> scaling the portrait up before it crops and therefore keeps the head inside the frame',
              'Thêm <code>withoutEnlargement: true</code>, thứ ngăn <code>cover</code> phóng to tấm ảnh dọc trước khi cắt nên giữ được cái đầu trong khung',
            ),
            B(
              'Call <code>.rotate()</code> before the resize: the heads are being cropped because the EXIF orientation has not been applied, so <code>cover</code> is cropping the wrong axis',
              'Gọi <code>.rotate()</code> trước phép resize: đầu người bị cắt vì hướng xoay EXIF chưa được áp, nên <code>cover</code> đang cắt nhầm trục',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The default crop is centred, which is right about four times out of five and wrong in a specific, predictable way on portraits. <code>position</code> takes a named edge or a strategy: <code>attention</code> biases toward luminance frequency and saturation (faces, subjects) and <code>entropy</code> toward the region with the most detail, which suits landscapes and textures better than people. Option A is a real alternative with a real cost and is the right answer for a slot where nothing may be lost; option C confuses a guard against upscaling with a choice about WHERE to crop; option D describes a genuine bug that produces sideways photos, not decapitated ones.',
            'Phép cắt mặc định lấy chính giữa, đúng chừng bốn trên năm lần và sai theo một kiểu cụ thể, đoán trước được với ảnh chân dung. <code>position</code> nhận một mép có tên hoặc một chiến lược: <code>attention</code> nghiêng về tần số độ sáng và độ bão hoà (khuôn mặt, chủ thể) còn <code>entropy</code> nghiêng về vùng nhiều chi tiết nhất, hợp với phong cảnh và bề mặt hơn là hợp với người. Lựa chọn A là một phương án thay thế có thật với cái giá có thật và là đáp án đúng cho một ô mà không được phép mất gì; lựa chọn C nhầm một chốt chặn chống phóng to với một lựa chọn về việc cắt Ở ĐÂU; lựa chọn D mô tả một con bug có thật nhưng nó tạo ra ảnh nằm nghiêng, không phải ảnh mất đầu.',
          ),
        }),

        mcq({
          prompt: B(
            'Two sources, same request, measured:' + code(
              "1600x900  .resize(500, 500, { fit: 'inside'  })  → 500x281\n" +
              "1600x900  .resize(500, 500, { fit: 'outside' })  → 889x500\n" +
              " 900x1600 .resize(500, 500, { fit: 'inside'  })  → 281x500\n" +
              " 900x1600 .resize(500, 500, { fit: 'outside' })  → 500x889",
            ) + 'Which single rule generates all four rows?',
            'Hai nguồn, cùng một yêu cầu, đo thật:' + code(
              "1600x900  .resize(500, 500, { fit: 'inside'  })  → 500x281\n" +
              "1600x900  .resize(500, 500, { fit: 'outside' })  → 889x500\n" +
              " 900x1600 .resize(500, 500, { fit: 'inside'  })  → 281x500\n" +
              " 900x1600 .resize(500, 500, { fit: 'outside' })  → 500x889",
            ) + 'Quy tắc DUY NHẤT nào sinh ra được cả bốn dòng?',
          ),
          options: [
            B(
              'The scale is chosen per axis: the width uses <code>500 / sourceWidth</code> and the height uses <code>500 / sourceHeight</code>, then <code>inside</code> keeps the width result and <code>outside</code> keeps the height result',
              'Hệ số được chọn riêng cho từng trục: chiều rộng dùng <code>500 / rộngNguồn</code> còn chiều cao dùng <code>500 / caoNguồn</code>, rồi <code>inside</code> giữ kết quả của chiều rộng và <code>outside</code> giữ kết quả của chiều cao',
            ),
            B(
              'Both modes fit the box exactly and then trim transparent padding, which is why the reported dimensions differ from 500×500 even though the canvas is 500×500',
              'Cả hai chế độ đều lấp vừa khung rồi cắt bỏ phần đệm trong suốt, đó là lý do kích thước báo về khác 500×500 dù canvas vẫn là 500×500',
            ),
            B(
              '<code>inside</code> shrinks the longer edge to 500 and <code>outside</code> grows the shorter edge to 500; the other edge is then rounded to the nearest even number so that a later H.264 encode does not fail',
              '<code>inside</code> co cạnh dài về 500 còn <code>outside</code> kéo cạnh ngắn lên 500; cạnh còn lại sau đó được làm tròn về số chẵn gần nhất để một lượt encode H.264 về sau không hỏng',
            ),
            B(
              'One scale factor is applied to both axes; <code>inside</code> takes <code>min(500/w, 500/h)</code> and <code>outside</code> takes <code>max(500/w, 500/h)</code>, then both dimensions are multiplied by it and rounded',
              'MỘT hệ số duy nhất được áp cho cả hai trục; <code>inside</code> lấy <code>min(500/w, 500/h)</code> còn <code>outside</code> lấy <code>max(500/w, 500/h)</code>, rồi cả hai chiều đều được nhân với nó và làm tròn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Check it against the numbers: for 1600×900 the two candidate scales are 500/1600 = 0,3125 and 500/900 = 0,5556. <code>inside</code> takes the smaller (0,3125) → 500 × 281 (900 × 0,3125 = 281,25, rounded). <code>outside</code> takes the larger (0,5556) → 889 × 500 (1600 × 0,5556 = 888,9, rounded). One scale, both axes, <code>Math.round</code>. Question 31 asks you to implement exactly this and checks it against sharp.',
            'Thử lại với chính những con số ấy: với 1600×900 thì hai hệ số ứng viên là 500/1600 = 0,3125 và 500/900 = 0,5556. <code>inside</code> lấy cái nhỏ hơn (0,3125) → 500 × 281 (900 × 0,3125 = 281,25, làm tròn). <code>outside</code> lấy cái lớn hơn (0,5556) → 889 × 500 (1600 × 0,5556 = 888,9, làm tròn). Một hệ số, hai trục, <code>Math.round</code>. Câu 31 bắt bạn cài đặt đúng điều này và đối chiếu với sharp thật.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on sharp 0.35.4 across 648 combinations. Three of them:' + code(
              " 400x400  .resize({ width: 1200, withoutEnlargement: true })                    → 400x400\n" +
              " 640x360  .resize(500, 500,   { fit: 'cover',  withoutEnlargement: true })      → 500x360\n" +
              " 900x1600 .resize(2000, 2000, { fit: 'contain', withoutEnlargement: true })     → 2000x2000",
            ) + 'What does the middle row show that the first row does not?',
            'Đo thật trên sharp 0.35.4 với 648 tổ hợp. Ba trong số đó:' + code(
              " 400x400  .resize({ width: 1200, withoutEnlargement: true })                    → 400x400\n" +
              " 640x360  .resize(500, 500,   { fit: 'cover',  withoutEnlargement: true })      → 500x360\n" +
              " 900x1600 .resize(2000, 2000, { fit: 'contain', withoutEnlargement: true })     → 2000x2000",
            ) + 'Dòng giữa cho thấy điều gì mà dòng đầu không cho thấy?',
          ),
          options: [
            B(
              'That the flag is ignored whenever a <code>fit</code> is named explicitly, which is why 500×360 came back scaled at all',
              'Rằng cái cờ bị bỏ qua mỗi khi có nêu <code>fit</code> tường minh, đó là lý do 500×360 vẫn ra kết quả đã co lại',
            ),
            B(
              'That with both dimensions given, the flag clamps each AXIS independently — the width shrinks to 500 because 500 &lt; 640, the height stays 360 because 500 &gt; 360 — rather than cancelling the resize outright',
              'Rằng khi nêu cả hai chiều, cái cờ kẹp TỪNG TRỤC một cách độc lập — chiều rộng co về 500 vì 500 &lt; 640, chiều cao giữ 360 vì 500 &gt; 360 — chứ không huỷ hẳn phép resize',
            ),
            B(
              'That <code>cover</code> refuses to crop when the flag is present, so the output keeps the source aspect ratio and 500×360 is simply 640×360 scaled by 500/640',
              'Rằng <code>cover</code> từ chối cắt khi có cờ, nên kết quả giữ nguyên tỉ lệ của nguồn và 500×360 chỉ là 640×360 nhân với 500/640',
            ),
            B(
              'That the flag rounds the output to the nearest multiple of the source aspect denominator, which for 16:9 gives 500×360 rather than 500×281',
              'Rằng cái cờ làm tròn kết quả về bội gần nhất của mẫu số tỉ lệ nguồn, mà với 16:9 thì cho ra 500×360 chứ không phải 500×281',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Note that 500×360 is NOT 640×360 scaled — a uniform scale by 500/640 would give 500×281. The output is <code>min(500, 640) × min(500, 360)</code>: the box itself is clamped per axis, and then <code>cover</code> fills that clamped box as usual. The <code>contain</code> row is the other surprise: the flag barely applies there, because the canvas is whatever you asked for and the image simply sits inside it. The repo sidesteps all of this by passing width only, which has one obvious meaning.',
            'Để ý rằng 500×360 KHÔNG phải 640×360 co lại — một hệ số đều bằng 500/640 sẽ cho 500×281. Kết quả là <code>min(500, 640) × min(500, 360)</code>: chính cái khung bị kẹp theo từng trục, rồi <code>cover</code> lấp đầy cái khung đã kẹp ấy như thường lệ. Dòng <code>contain</code> là bất ngờ còn lại: cờ gần như vô hiệu ở đó, vì canvas là đúng thứ bạn xin và tấm ảnh chỉ nằm gọn bên trong. Kho này né hết chuyện này bằng cách chỉ truyền width, thứ chỉ có đúng một nghĩa.',
          ),
        }),

        mcq({
          prompt: B(
            'Four runs on the same photo, whose EXIF Orientation tag is 1 (the "no transform needed" value, about 55% of real uploads):' + code(
              "sharp('orient-1.jpg').rotate()      → 4032x3024\n" +
              "sharp('orient-1.jpg').rotate(90)    → 3024x4032\n" +
              "sharp('orient-6.jpg').rotate()      → 3024x4032\n" +
              "sharp('avatar-400.png').rotate()    → 400x400   (PNG, no EXIF at all)",
            ) + 'A colleague proposes <code>.rotate(90)</code> "so the sideways photos get fixed". What happens?',
            'Bốn lượt chạy trên cùng tấm ảnh, có thẻ EXIF Orientation bằng 1 (giá trị "không cần biến đổi gì", chiếm chừng 55% ảnh upload thật):' + code(
              "sharp('orient-1.jpg').rotate()      → 4032x3024\n" +
              "sharp('orient-1.jpg').rotate(90)    → 3024x4032\n" +
              "sharp('orient-6.jpg').rotate()      → 3024x4032\n" +
              "sharp('avatar-400.png').rotate()    → 400x400   (PNG, không có EXIF nào)",
            ) + 'Một đồng nghiệp đề xuất <code>.rotate(90)</code> "để mấy tấm nằm nghiêng được sửa". Chuyện gì xảy ra?',
          ),
          options: [
            B(
              'It fixes orientation 6 and leaves the rest alone, because <code>rotate(90)</code> is applied only when an EXIF orientation tag is present at all',
              'Nó sửa được orientation 6 và không đụng những cái còn lại, vì <code>rotate(90)</code> chỉ được áp khi có mặt một thẻ EXIF orientation nào đó',
            ),
            B(
              'It turns every image 90° regardless of its tag, so the 55% that were already upright — and the PNGs, which have no tag to consult — all land sideways. A fixed angle can never be the fix for "some photos are rotated"',
              'Nó xoay MỌI tấm ảnh 90° bất kể thẻ của tấm ấy, nên 55% vốn đã đứng đúng — cùng các file PNG, thứ chẳng có thẻ nào để tra — đều nằm nghiêng hết. Một góc cố định không bao giờ là cách sửa cho "một số ảnh bị xoay"',
            ),
            B(
              'It does nothing on files whose orientation is 1, because Sharp compares the requested angle against the tag and skips the rotation when they disagree',
              'Nó không làm gì với những file có orientation bằng 1, vì Sharp so góc được yêu cầu với thẻ và bỏ qua phép xoay khi hai bên không khớp',
            ),
            B(
              'It fixes orientations 6 and 8 but breaks 3, since 180° needs two applications of the same 90° rotation and Sharp only applies one',
              'Nó sửa được orientation 6 và 8 nhưng làm hỏng 3, vì 180° cần hai lần áp cùng phép xoay 90° mà Sharp chỉ áp một lần',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The transcript settles it: <code>rotate(90)</code> on an orientation-1 file produced 3024×4032 — it turned a correct photo onto its side. <code>rotate()</code> with NO argument is a different operation entirely: it reads each file\'s own tag and applies whatever that tag says, which is a no-op for orientation 1 and for a PNG (which cannot carry the tag). One call, correct for all eight values and for files that have no value.',
            'Đoạn transcript kết luận thay: <code>rotate(90)</code> trên một file orientation 1 cho ra 3024×4032 — nó vật một tấm ảnh vốn đúng sang nằm nghiêng. <code>rotate()</code> KHÔNG tham số là một phép hoàn toàn khác: nó đọc thẻ của chính từng file rồi áp đúng thứ thẻ ấy nói, tức là không làm gì với orientation 1 và với PNG (vốn không mang được thẻ). Một lời gọi, đúng cho cả tám giá trị lẫn cho những file chẳng có giá trị nào.',
          ),
        }),

        mcq({
          prompt: B(
            'A pipeline re-encodes an upload to WebP but forgets <code>.rotate()</code>. Measured on a 4032×3024 photo tagged orientation 6:' + code(
              "input:  orientation = 6, stored 4032x3024, autoOrient = { width: 3024, height: 4032 }\n" +
              "output: 4032x3024, and metadata(output).orientation = undefined",
            ) + 'Why is this worse than simply "the photo is sideways"?',
            'Một pipeline encode lại ảnh upload sang WebP nhưng quên <code>.rotate()</code>. Đo thật trên một tấm 4032×3024 gắn thẻ orientation 6:' + code(
              "vào:  orientation = 6, lưu 4032x3024, autoOrient = { width: 3024, height: 4032 }\n" +
              "ra:   4032x3024, và metadata(bản ra).orientation = undefined",
            ) + 'Vì sao chuyện này tệ hơn là chỉ "tấm ảnh bị nằm nghiêng"?',
          ),
          options: [
            B(
              'Because the tag is gone from the output, the instruction to rotate no longer exists anywhere — the sideways pixels are now the whole truth, and no viewer, CSS rule or later re-encode can recover the intended orientation',
              'Vì cái thẻ đã biến mất khỏi bản ra, chỉ dẫn "hãy xoay" không còn tồn tại ở đâu nữa — đám pixel nằm nghiêng giờ là toàn bộ sự thật, và không trình xem, quy tắc CSS hay lượt encode lại nào về sau lấy lại được hướng đúng',
            ),
            B(
              'Because WebP stores orientation in a different tag than JPEG, so the value 6 was silently rewritten as 1 and will now actively fight any correction you apply',
              'Vì WebP lưu orientation ở một thẻ khác với JPEG, nên giá trị 6 bị âm thầm ghi lại thành 1 và giờ sẽ chống lại mọi phép sửa mà bạn áp vào',
            ),
            B(
              'Because <code>autoOrient</code> reports 3024×4032 while the file is 4032×3024, the two fields now disagree and Sharp will refuse to open the output at all',
              'Vì <code>autoOrient</code> báo 3024×4032 trong khi file là 4032×3024, hai trường ấy giờ mâu thuẫn và Sharp sẽ từ chối mở bản ra',
            ),
            B(
              'Because the output is 4032 px wide it exceeds the 1200 px cap, so the real defect is the missing resize rather than the missing rotation',
              'Vì bản ra rộng 4032 px nên nó vượt trần 1200 px, vậy khiếm khuyết thật là thiếu phép resize chứ không phải thiếu phép xoay',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two things happened, and only the second is permanent. The pixels were not rotated — recoverable, if the tag survived. But Sharp strips metadata by default (a deliberate privacy choice: EXIF carries GPS), so the output carries no orientation at all: <code>undefined</code>, measured. Applying the rotation to the pixels is what makes the file correct everywhere and forever; keeping the tag instead is fragile, because the next tool that re-encodes drops it again.',
            'Có hai chuyện xảy ra, và chỉ chuyện thứ hai là vĩnh viễn. Đám pixel chưa được xoay — vẫn cứu được, nếu cái thẻ còn sống. Nhưng Sharp mặc định gỡ metadata (một lựa chọn riêng tư có chủ đích: EXIF mang cả toạ độ GPS), nên bản ra không còn orientation nào cả: <code>undefined</code>, đo thật. Áp phép xoay vào chính đám pixel mới là thứ làm cho file đúng ở mọi nơi và mãi mãi; giữ lại cái thẻ thì mong manh, vì công cụ kế tiếp encode lại sẽ vứt nó lần nữa.',
          ),
        }),

        mcq({
          prompt: B(
            'A 776.180-byte PNG describing 16000×16000 pixels is read three ways with an explicit budget:' + code(
              "sharp(buf, { limitInputPixels: 100_000_000 }).metadata()\n" +
              '  → Error: Input image exceeds pixel limit\n' +
              "sharp(buf, { limitInputPixels: 100_000_000 }).resize(200).toBuffer()\n" +
              '  → Error: Input image exceeds pixel limit\n' +
              'sharp(buf).metadata()                     (no budget)\n' +
              '  → { width: 16000, height: 16000 }',
            ) + 'Choose <b>TWO</b> statements the transcript supports.',
            'Một file PNG 776.180 byte mô tả 16000×16000 pixel được đọc ba cách với một ngân sách tường minh:' + code(
              "sharp(buf, { limitInputPixels: 100_000_000 }).metadata()\n" +
              '  → Error: Input image exceeds pixel limit\n' +
              "sharp(buf, { limitInputPixels: 100_000_000 }).resize(200).toBuffer()\n" +
              '  → Error: Input image exceeds pixel limit\n' +
              'sharp(buf).metadata()                     (không ngân sách)\n' +
              '  → { width: 16000, height: 16000 }',
            ) + 'Chọn <b>HAI</b> phát biểu mà đoạn transcript này chứng minh.',
          ),
          options: [
            B(
              'The option is enforced while the HEADER is read, not only during the decode: row one never reaches a pixel, which is why a budget on the constructor is not merely a backstop for the explicit check',
              'Tuỳ chọn này được thi hành ngay khi ĐỌC HEADER, không chỉ trong lúc giải mã: dòng một chưa hề chạm tới một pixel nào, và đó là lý do một ngân sách đặt ở constructor không đơn thuần là lưới đỡ cho phép kiểm tường minh',
            ),
            B(
              'The budget counts INPUT pixels, so <code>resize(200)</code> cannot rescue it — however small you ask the output to be, the source has to be decoded before it can be shrunk',
              'Ngân sách này đếm pixel ĐẦU VÀO, nên <code>resize(200)</code> không cứu được — bạn xin bản ra nhỏ tới đâu cũng vậy, nguồn vẫn phải được giải mã trước khi co lại được',
            ),
            B(
              'Row three proves the default limit is unset, since a build with a default would have refused a 256-megapixel file there too',
              'Dòng ba chứng minh giới hạn mặc định đang bị tắt, vì một bản dựng có mặc định thì cũng đã từ chối một file 256 megapixel ở đó rồi',
            ),
            B(
              'Because the message is identical in rows one and two, the guard runs twice on the same data and the explicit header check in the repo is therefore redundant',
              'Vì thông báo ở dòng một và dòng hai giống hệt nhau, chốt chặn chạy hai lần trên cùng dữ liệu và phép kiểm header tường minh trong kho vì thế là thừa',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Row three is the interesting non-answer: Sharp DOES ship a default of 268.402.689 px (0x3FFF²), which is comfortably above 256 MP — so the bomb sails through the default and row three tells you nothing about the option being unset, only that the default is far too generous for a web upload path. Rows one and two are the useful ones: the limit lands at the header read, and it is an INPUT budget, so no output size can talk you out of it. The repo keeps the option AND a separate header check because they fail differently — the option gives a generic message, and the explicit check gives the route layer a clear 400 while costing nothing.',
            'Dòng ba là cái "không phải đáp án" thú vị: Sharp CÓ một giá trị mặc định là 268.402.689 px (0x3FFF²), cao hơn 256 MP khá nhiều — nên quả bom lọt qua mặc định, và dòng ba chẳng nói gì về việc tuỳ chọn có bị tắt hay không, nó chỉ nói rằng mặc định ấy rộng rãi quá mức đối với một đường upload web. Dòng một và dòng hai mới là hai dòng hữu ích: giới hạn ập xuống ngay lúc đọc header, và nó là ngân sách ĐẦU VÀO, nên không kích thước đầu ra nào nói đỡ được cho bạn. Kho này giữ CẢ tuỳ chọn LẪN một phép kiểm header riêng vì hai thứ hỏng theo hai kiểu — tuỳ chọn cho thông báo chung chung, còn phép kiểm tường minh cho tầng route một mã 400 rõ ràng mà chẳng tốn gì.',
          ),
        }),

        // ── Chương 2 — Sharp trong production ───────────────────────────
        mcq({
          prompt: B(
            'A 257-byte file is uploaded. It renders a blue circle in every viewer, and Sharp handles it happily:' + code(
              "await sharp(file).metadata()\n" +
              "→ { format: 'svg', mediaType: 'image/svg+xml', width: 100, height: 100, density: 72 }\n" +
              '\n' +
              "const png = await sharp(file).png().toBuffer()\n" +
              "png.length            → 1124\n" +
              "png.includes('script') → false",
            ) + 'The source contained a <code>&lt;script&gt;</code> tag. What does the rasterisation prove, and what does it not?',
            'Một file 257 byte được upload lên. Nó vẽ ra một hình tròn xanh ở mọi trình xem, và Sharp xử lý nó ngon lành:' + code(
              "await sharp(file).metadata()\n" +
              "→ { format: 'svg', mediaType: 'image/svg+xml', width: 100, height: 100, density: 72 }\n" +
              '\n' +
              "const png = await sharp(file).png().toBuffer()\n" +
              "png.length            → 1124\n" +
              "png.includes('script') → false",
            ) + 'Nguồn của nó có chứa một thẻ <code>&lt;script&gt;</code>. Việc raster hoá chứng minh được gì, và KHÔNG chứng minh được gì?',
          ),
          options: [
            B(
              'It proves Sharp is a sanitiser for SVG: once the file has passed through <code>.png()</code>, the stored object is pixels and the upload path is safe by construction',
              'Nó chứng minh Sharp là một bộ làm sạch cho SVG: một khi file đã đi qua <code>.png()</code>, object được lưu là pixel và đường upload an toàn theo thiết kế',
            ),
            B(
              'It proves nothing about safety, because Sharp rasterises through librsvg, and running librsvg on untrusted XML is itself the risk — entity expansion, XXE, and remote references',
              'Nó chẳng chứng minh gì về an toàn, vì Sharp raster hoá thông qua librsvg, mà chạy librsvg trên XML không đáng tin CHÍNH LÀ rủi ro — bung entity, XXE, và tham chiếu từ xa',
            ),
            B(
              'The 1.124-byte PNG genuinely is safe — the script is gone from those pixels — but that only helps if the original <code>.svg</code> is DESTROYED; keeping it on the CDN "just in case" leaves the attack surface exactly as it was',
              'Cái PNG 1.124 byte đúng là an toàn — script đã biến mất khỏi đám pixel đó — nhưng điều ấy chỉ có ích nếu bản <code>.svg</code> gốc bị XOÁ HẲN; giữ nó trên CDN "phòng khi cần" thì bề mặt tấn công vẫn nguyên như cũ',
            ),
            B(
              'It proves the file was never dangerous: a script inside an SVG cannot execute in any modern browser, which is why the rasterisation found nothing to remove',
              'Nó chứng minh file chưa từng nguy hiểm: một script nằm trong SVG không chạy được ở bất kỳ trình duyệt hiện đại nào, đó là lý do lượt raster hoá chẳng tìm thấy gì để gỡ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The rasterised PNG really is inert; that part is measured. The gap is elsewhere: rasterising is not sanitising unless the source stops existing, because the attack is a victim navigating <i>directly</i> to the stored <code>.svg</code> URL on your media origin. Option B is a real concern and the course lists it, but it is a reason to be careful about rasterising, not a description of what this transcript shows. This repo takes the option with no bypass: reject SVG at two independent gates.',
            'Cái PNG đã raster hoá đúng là vô hại; phần đó đã đo. Lỗ hổng nằm chỗ khác: raster hoá không phải làm sạch trừ khi bản nguồn thôi tồn tại, vì đòn tấn công là một nạn nhân điều hướng THẲNG tới URL <code>.svg</code> đang lưu trên media origin của bạn. Lựa chọn B là một lo ngại có thật và giáo trình có nêu, nhưng đó là lý do phải cẩn thận khi raster hoá, không phải điều đoạn transcript này cho thấy. Kho này chọn phương án không có đường vòng: từ chối SVG ở hai cổng độc lập.',
          ),
        }),

        mcq({
          prompt: B(
            'Your product genuinely needs user-supplied vector logos, so rejecting SVG is not available. Which combination is the course\'s answer, and what is the role of each part?',
            'Sản phẩm của bạn thật sự cần logo dạng vector do người dùng gửi lên, nên phương án từ chối SVG không dùng được. Tổ hợp nào là câu trả lời của giáo trình, và vai trò của từng phần là gì?',
          ),
          options: [
            B(
              'Serve every SVG with <code>Content-Disposition: attachment</code> and nothing else — a file the browser downloads instead of rendering cannot execute, which makes the sanitiser and the origin split unnecessary',
              'Phục vụ mọi file SVG kèm <code>Content-Disposition: attachment</code> và không cần gì thêm — một file mà trình duyệt tải xuống thay vì hiển thị thì không chạy được, nên bộ làm sạch và việc tách origin trở nên thừa',
            ),
            B(
              'Rasterise on upload and store only the PNG, then re-vectorise on demand — this keeps the scalability the customer asked for while never storing markup, which is the only combination with no bypass',
              'Raster hoá lúc upload rồi chỉ lưu bản PNG, sau đó vector hoá lại khi cần — cách này giữ được tính co giãn mà khách hàng yêu cầu mà không bao giờ lưu markup, và đó là tổ hợp duy nhất không có đường vòng',
            ),
            B(
              'Sanitise with DOMPurify on write (and again on read if you ever inline it), serve from a cookie-less origin under <code>Content-Security-Policy: default-src &quot;none&quot;</code>, and keep the sanitiser current — the sanitiser is the primary control and the origin plus CSP is defence in depth, never the other way round',
              'Làm sạch bằng DOMPurify lúc GHI (và lúc ĐỌC nữa nếu có khi nào bạn nhúng thẳng vào trang), phục vụ từ một origin không có cookie kèm <code>Content-Security-Policy: default-src &quot;none&quot;</code>, và giữ cho bộ làm sạch luôn mới — bộ làm sạch là chốt chặn CHÍNH còn origin cùng CSP là phòng thủ theo lớp, không bao giờ ngược lại',
            ),
            B(
              'Keep the <code>DANGEROUS_MIME</code> entry but drop <code>DANGEROUS_EXT</code>, so a correctly-declared <code>image/svg+xml</code> is refused while a file the client mislabels still gets through and can be rasterised safely on the server',
              'Giữ mục <code>DANGEROUS_MIME</code> nhưng bỏ <code>DANGEROUS_EXT</code>, để một file khai đúng <code>image/svg+xml</code> bị từ chối còn một file mà client dán nhãn sai vẫn lọt qua và được raster hoá an toàn trên máy chủ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The three defences are ranked by strength, and the ranking matters more than the list: rejection has no bypass, sanitising has a bypass history you manage by keeping the library current, and the origin split plus CSP is what limits the damage when the first two fail. Treating the third as primary is the common mistake — a sandboxed media origin means a script that DOES run has nothing to steal, which is worth having and is not a control. Option A is defence in depth mistaken for a control too, and it also breaks the feature: a logo you must download is not a logo you can render. Option D deliberately keeps a hole the repo closes: the client controls both signals, so you reject if EITHER fires.',
            'Ba tầng phòng thủ được xếp theo độ mạnh, và chính THỨ TỰ mới quan trọng hơn cái danh sách: từ chối thì không có đường vòng, làm sạch thì có một lịch sử bị vượt qua mà bạn quản lý bằng cách giữ thư viện luôn mới, còn tách origin cộng CSP là thứ giới hạn thiệt hại khi hai tầng trên thủng. Coi tầng thứ ba là tầng chính là sai lầm phổ biến — một media origin bị cô lập nghĩa là một script CÓ chạy được thì cũng chẳng có gì để lấy, điều đó đáng có nhưng nó không phải một chốt chặn. Lựa chọn A cũng là nhầm phòng thủ theo lớp thành chốt chặn, và nó còn làm hỏng chính tính năng: một cái logo mà phải tải về thì không phải cái logo hiển thị được. Lựa chọn D cố ý để hở đúng chỗ mà kho này bịt: client điều khiển cả hai tín hiệu, nên phải từ chối khi MỘT TRONG HAI khớp.',
          ),
        }),

        mcq({
          prompt: B(
            'The repo\'s guard skips the per-bucket family check when the MIME is empty or <code>application/octet-stream</code>:' + code(
              "const unknownMime = mime === '' || mime === 'application/octet-stream'\n" +
              'if (!unknownMime) {\n' +
              "  const family = bucket.split('/')[0]\n" +
              "  if (family === 'images' && !mime.startsWith('image/')) throw new UploadError(…)\n" +
              '}',
            ) + 'Does that hole let an SVG through, and why is the tension resolved this way?',
            'Chốt chặn của kho này bỏ qua phép kiểm họ-theo-bucket khi MIME rỗng hoặc là <code>application/octet-stream</code>:' + code(
              "const unknownMime = mime === '' || mime === 'application/octet-stream'\n" +
              'if (!unknownMime) {\n' +
              "  const family = bucket.split('/')[0]\n" +
              "  if (family === 'images' && !mime.startsWith('image/')) throw new UploadError(…)\n" +
              '}',
            ) + 'Cái lỗ đó có cho SVG lọt không, và vì sao mâu thuẫn lại được giải quyết theo cách này?',
          ),
          options: [
            B(
              'Yes, and it is a known accepted risk — the team decided a rejected mobile upload is worse than an occasional stored SVG, and compensates with a strict CSP on the media origin',
              'Có, và đó là một rủi ro được chấp nhận có ý thức — nhóm quyết rằng từ chối nhầm một lượt upload từ điện thoại còn tệ hơn thỉnh thoảng lưu một file SVG, và bù lại bằng một CSP nghiêm ngặt trên media origin',
            ),
            B(
              'Yes, but only for buckets outside <code>images/</code>; the images family is checked separately by Sharp, which rejects any input it identifies as SVG',
              'Có, nhưng chỉ với những bucket ngoài <code>images/</code>; họ images được kiểm riêng bởi Sharp, thứ từ chối mọi đầu vào mà nó nhận ra là SVG',
            ),
            B(
              'No, because <code>application/octet-stream</code> is itself in <code>DANGEROUS_MIME</code>, so the branch is unreachable in practice',
              'Không, vì bản thân <code>application/octet-stream</code> nằm trong <code>DANGEROUS_MIME</code>, nên nhánh này thực tế không bao giờ chạy tới',
            ),
            B(
              'No: the unconditional dangerous-MIME and dangerous-extension block runs BEFORE this code and is never skipped, so only the family check is relaxed — and the stored Content-Type is later derived from the extension, so an octet-stream upload can never be served as HTML',
              'Không: khối chặn MIME-nguy-hiểm và phần-mở-rộng-nguy-hiểm chạy TRƯỚC đoạn này và không bao giờ bị bỏ qua, nên chỉ có phép kiểm họ được nới — và Content-Type lưu lại về sau được suy từ phần mở rộng, nên một file octet-stream không bao giờ được phục vụ dưới dạng HTML',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three separate decisions make this safe. The dangerous list is unconditional, so <code>image/svg+xml</code> and <code>*.svg</code> die regardless of what else the client claimed. Only the softer "does the MIME match the bucket family" check is skipped, because mobile Safari genuinely sends <code>application/octet-stream</code> for real photos and rejecting those would break the product. And the stored Content-Type comes from the extension rather than the client\'s claim, so the file can never be served back as active content.',
            'Ba quyết định riêng biệt làm cho chỗ này an toàn. Danh sách nguy hiểm là vô điều kiện, nên <code>image/svg+xml</code> và <code>*.svg</code> chết bất kể client khai gì thêm. Chỉ phép kiểm mềm hơn "MIME có khớp họ của bucket không" mới bị bỏ qua, vì Safari trên điện thoại thật sự gửi <code>application/octet-stream</code> cho ảnh thật và từ chối chúng là làm hỏng sản phẩm. Còn Content-Type được lưu thì lấy từ phần mở rộng chứ không lấy từ lời khai của client, nên file không bao giờ được trả về dưới dạng nội dung chạy được.',
          ),
        }),

        mcq({
          prompt: B(
            'A team decides to accept SVG after all, and rasterise it server-side rather than storing the vector. Which risk does that decision INTRODUCE rather than remove?',
            'Một nhóm rốt cuộc quyết định vẫn nhận SVG, và raster hoá phía máy chủ thay vì lưu bản vector. Quyết định ấy THÊM VÀO rủi ro nào, chứ không phải gỡ bỏ?',
          ),
          options: [
            B(
              'Stored XSS on the media origin, because the rasterised PNG inherits the SVG\'s Content-Type',
              'Stored XSS trên media origin, vì bản PNG raster hoá thừa hưởng Content-Type của SVG',
            ),
            B(
              'Loss of scalability, since a rasterised icon no longer scales — which is real, but is a product problem rather than a security one',
              'Mất tính co giãn, vì một icon đã raster hoá thì không phóng to được nữa — điều này có thật, nhưng là vấn đề sản phẩm chứ không phải bảo mật',
            ),
            B(
              'A decompression bomb, because an SVG declaring <code>width=&quot;100000&quot;</code> will rasterise to 10 gigapixels and no pixel budget can see it in advance',
              'Một quả bom giải nén, vì một SVG khai <code>width=&quot;100000&quot;</code> sẽ raster hoá thành 10 gigapixel và không ngân sách pixel nào nhìn thấy trước được',
            ),            B(
              'You now run librsvg, cairo and pango — C code with a CVE history — over attacker-controlled XML, which brings entity expansion, XXE and remote-reference SSRF onto your server\'s network position',
              'Bạn giờ chạy librsvg, cairo và pango — mã C từng có lịch sử CVE — trên XML do kẻ tấn công điều khiển, kéo theo bung entity, XXE và SSRF qua tham chiếu từ xa ngay tại vị trí mạng của máy chủ bạn',
            ),

          ],
          correct: 3,
          explanation: EX(
            'Rejecting the file means the XML is never parsed. Rasterising means it is, by a stack of C libraries, on your server, with your network access and your environment variables — which on this deployment include database credentials and R2 keys. A <code>&lt;!ENTITY&gt;</code> chain expands 1 KB into gigabytes; <code>&lt;image xlink:href="http://internal-service/"&gt;</code> is SSRF if the rasteriser fetches it. Modern librsvg blocks the worst of these by default, and "by default" is a thing you verify in your own build rather than assume. Option C is wrong on the last clause: an SVG\'s declared width IS in the header, so a pixel budget sees it exactly as it sees a PNG\'s.',
            'Từ chối file nghĩa là XML không bao giờ được phân tích. Raster hoá nghĩa là nó ĐƯỢC phân tích, bởi một chồng thư viện C, trên máy chủ của bạn, với quyền truy cập mạng và biến môi trường của bạn — mà trên bản triển khai này thì bao gồm cả thông tin đăng nhập cơ sở dữ liệu lẫn khoá R2. Một chuỗi <code>&lt;!ENTITY&gt;</code> bung 1 KB thành hàng gigabyte; <code>&lt;image xlink:href="http://internal-service/"&gt;</code> là SSRF nếu bộ raster hoá đi tải nó. librsvg hiện đại chặn phần tệ nhất theo mặc định, và "theo mặc định" là thứ phải KIỂM trên chính bản dựng của mình chứ không phải mặc nhiên tin. Lựa chọn C sai ở vế cuối: chiều rộng khai trong SVG NẰM trong header, nên ngân sách pixel nhìn thấy nó y như nhìn thấy của một file PNG.',
          ),
        }),

        mcq({
          prompt: B(
            'A 48-frame, 480×270 animated GIF (345.659 B) is put through three pipelines and each output is read back:' + code(
              "sharp(gif).webp({ quality: 75 })                        → pages=1   5.214 B\n" +
              "sharp(gif).webp({ quality: 75, animated: true })        → pages=1   5.214 B\n" +
              "sharp(gif, { animated: true }).webp({ quality: 75 })    → pages=48  207.060 B",
            ) + 'What do the first two rows have in common, and what is the practical danger?',
            'Một file GIF động 48 frame, 480×270 (345.659 B) được đưa qua ba pipeline và mỗi kết quả được đọc lại:' + code(
              "sharp(gif).webp({ quality: 75 })                        → pages=1   5.214 B\n" +
              "sharp(gif).webp({ quality: 75, animated: true })        → pages=1   5.214 B\n" +
              "sharp(gif, { animated: true }).webp({ quality: 75 })    → pages=48  207.060 B",
            ) + 'Hai dòng đầu giống nhau ở điểm nào, và mối nguy thực tế là gì?',
          ),
          options: [
            B(
              'Both are correct: WebP stores animation in a sidecar chunk that <code>metadata()</code> cannot see, so <code>pages=1</code> is a reporting limitation rather than data loss',
              'Cả hai đều đúng: WebP lưu hình động trong một khối phụ mà <code>metadata()</code> không thấy được, nên <code>pages=1</code> là hạn chế của việc báo cáo chứ không phải mất dữ liệu',
            ),            B(
              'Both threw and fell back to a single-frame encode, which is why the byte counts match; the thrown error is logged at <code>debug</code> level and is easy to miss',
              'Cả hai đều ném lỗi rồi lùi về một lượt encode một frame, đó là lý do số byte trùng nhau; lỗi ném ra được ghi ở mức <code>debug</code> nên rất dễ bỏ sót',
            ),
            B(
              'Both kept all 48 frames but wrote them as a single composited page, so <code>pages</code> reads 1 while the animation is technically still present in the file',
              'Cả hai đều giữ đủ 48 frame nhưng ghi chúng thành một trang đã ghép chồng, nên <code>pages</code> báo 1 trong khi về mặt kỹ thuật hình động vẫn còn trong file',
            ),
            B(
              'Both wrote frame 1 only and produced byte-identical output, because the option belongs to the CONSTRUCTOR — passing it to the encoder is accepted without complaint and does nothing, which makes the "fix" indistinguishable from the bug',
              'Cả hai đều chỉ ghi frame 1 và cho ra kết quả giống hệt nhau từng byte, vì option đó thuộc về CONSTRUCTOR — truyền nó cho encoder thì được nhận không một lời phàn nàn và chẳng làm gì, khiến "bản vá" trông không khác gì con bug',
            ),

          ],
          correct: 3,
          explanation: EX(
            'Byte-identical, measured: 5.214 B both times. This is the shape that makes the bug survive a review — a developer who has read that <code>animated: true</code> is the fix, applies it to the encoder, sees no error, and ships. The check that actually catches it is on the output: <code>metadata(out).pages</code> must equal <code>metadata(in).pages</code>. That is the Chapter 9 rule in miniature — assert a property of the artifact, not that the call returned.',
            'Giống hệt nhau từng byte, đo thật: 5.214 B cả hai lần. Đây chính là hình dạng khiến con bug sống sót qua review — một lập trình viên đã đọc rằng <code>animated: true</code> là cách sửa, áp nó vào encoder, không thấy lỗi nào, và ship. Phép kiểm thật sự bắt được nó nằm ở đầu ra: <code>metadata(bảnRa).pages</code> phải bằng <code>metadata(bảnVào).pages</code>. Đó là quy tắc của chương 9 thu nhỏ — hãy khẳng định một thuộc tính của hiện vật, đừng khẳng định rằng lời gọi đã trả về.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 2.2 says you must pass <code>loop</code> and <code>delay</code> through to the WebP encoder or Sharp writes its own defaults — "usually an infinite loop at a uniform frame delay". Measured on sharp 0.35.4 with nothing passed through:' + code(
              "src  delay = [40,40,50,40,40,40,40,40,50,40, … 48 values]  loop = 0\n" +
              "out  delay = [40,40,50,40,40,40,40,40,50,40, … 48 values]  loop = 0\n" +
              "JSON.stringify(src.delay) === JSON.stringify(out.delay)  → true\n" +
              '\n' +
              'and with a source re-tagged loop = 3:  out loop = 3',
            ) + 'What is the correct conclusion?',
            'Bài 2.2 nói phải truyền <code>loop</code> và <code>delay</code> sang encoder WebP, nếu không Sharp sẽ tự ghi mặc định của nó — "thường là lặp vô hạn với nhịp frame đều nhau". Đo thật trên sharp 0.35.4 mà KHÔNG truyền gì:' + code(
              "nguồn delay = [40,40,50,40,40,40,40,40,50,40, … 48 giá trị]  loop = 0\n" +
              "bản ra delay = [40,40,50,40,40,40,40,40,50,40, … 48 giá trị]  loop = 0\n" +
              "JSON.stringify(nguồn.delay) === JSON.stringify(bảnRa.delay)  → true\n" +
              '\n' +
              'và với một nguồn gắn lại loop = 3:  bản ra loop = 3',
            ) + 'Kết luận đúng là gì?',
          ),
          options: [
            B(
              'The measurement is invalid because the source happened to have a near-uniform delay, and "uniform" is exactly what the default would produce — the two are indistinguishable here',
              'Phép đo này không có giá trị vì nguồn tình cờ có nhịp gần như đều, mà "đều" đúng là thứ giá trị mặc định sẽ tạo ra — hai bên ở đây không phân biệt được',
            ),
            B(
              'On this version the textbook is out of date: both <code>loop</code> and per-frame <code>delay</code> survive the re-encode untouched. Passing them explicitly is still harmless, but it is no longer the thing that keeps the timing correct',
              'Trên phiên bản này thì giáo trình đã lỗi thời: cả <code>loop</code> lẫn <code>delay</code> từng frame đều sống sót qua lượt encode lại mà không suy suyển. Truyền tay vẫn vô hại, nhưng nó không còn là thứ giữ cho nhịp chạy đúng',
            ),
            B(
              'Sharp preserved them only because the output format is also WebP; converting to animated GIF or AVIF would reset both fields to their defaults',
              'Sharp giữ được chúng chỉ vì format đầu ra cũng là WebP; chuyển sang GIF động hay AVIF sẽ đặt lại cả hai trường về giá trị mặc định',
            ),
            B(
              'The fields were preserved because <code>{ animated: true }</code> implies <code>withMetadata()</code>, so the whole metadata block including EXIF and ICC came across as well',
              'Các trường ấy được giữ vì <code>{ animated: true }</code> ngầm bật <code>withMetadata()</code>, nên cả khối metadata gồm EXIF và ICC cũng theo sang',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read the delay array before dismissing the measurement: it is <b>not</b> uniform — the repeating <code>…40, 40, 50…</code> pattern is preserved position by position across all 48 entries, and the comparison is a byte-for-byte <code>JSON.stringify</code> equality, not an eyeball. A second run on a source deliberately re-tagged <code>loop: 3</code> came out <code>loop: 3</code>, which a "default to infinite" would not. So the course\'s advice is now belt-and-braces rather than load-bearing. It still costs nothing, and the durable habit is the one it was teaching: check the property on the OUTPUT rather than trusting either the docs or this explanation.',
            'Hãy đọc mảng delay trước khi bác bỏ phép đo: nó KHÔNG đều — mẫu lặp <code>…40, 40, 50…</code> được giữ đúng từng vị trí trên cả 48 phần tử, và phép so là <code>JSON.stringify</code> bằng nhau từng byte chứ không phải nhìn bằng mắt. Lượt đo thứ hai trên một nguồn cố ý gắn lại <code>loop: 3</code> cho ra <code>loop: 3</code>, thứ mà một giá trị "mặc định lặp vô hạn" sẽ không cho. Vậy lời khuyên của giáo trình giờ là lớp bảo hiểm thứ hai chứ không còn là thứ chịu lực. Nó vẫn chẳng tốn gì, và thói quen bền vững chính là thứ nó đang dạy: hãy kiểm thuộc tính trên BẢN RA, đừng tin tài liệu, mà cũng đừng tin lời giải thích này.',
          ),
        }),

        mcq({
          prompt: B(
            'The WebP quality dial swept on one 1200-px-wide photo, effort fixed at 4:' + code(
              'q=50   32.700 B      q=85   58.586 B\n' +
              'q=60   36.664 B      q=90   74.880 B\n' +
              'q=70   40.002 B      q=95   98.686 B\n' +
              'q=75   41.928 B      q=100  157.712 B\n' +
              'q=80   49.246 B',
            ) + 'A team currently ships q=95 and is asked to justify it. What does the curve say?',
            'Núm quality của WebP được quét trên một tấm ảnh rộng 1200 px, effort cố định bằng 4:' + code(
              'q=50   32.700 B      q=85   58.586 B\n' +
              'q=60   36.664 B      q=90   74.880 B\n' +
              'q=70   40.002 B      q=95   98.686 B\n' +
              'q=75   41.928 B      q=100  157.712 B\n' +
              'q=80   49.246 B',
            ) + 'Một nhóm đang ship ở q=95 và bị yêu cầu giải trình. Đường cong này nói gì?',
          ),
          options: [
            B(
              'Going 80 → 95 costs 2× the bytes; the interval where each extra point of quality is cheap ends around 80–85, and above it the curve turns steeply upward for differences that are hard to see on a phone',
              'Đi từ 80 lên 95 tốn gấp 2 lần số byte; khoảng mà mỗi điểm quality tăng thêm còn rẻ kết thúc quanh 80–85, và trên đó đường cong dựng đứng lên để đổi lấy khác biệt khó thấy trên màn hình điện thoại',
            ),
            B(
              'q=95 is defensible because the jump from 95 to 100 is far larger than the jump from 80 to 95, so 95 is the last point before the real cliff',
              'q=95 bảo vệ được vì bước nhảy từ 95 lên 100 lớn hơn hẳn bước nhảy từ 80 lên 95, nên 95 là điểm cuối cùng trước cái vực thật sự',
            ),
            B(
              'The curve is roughly linear from 50 to 95, so quality is priced fairly across the whole range and 95 is no worse a deal than 80',
              'Đường cong gần như tuyến tính từ 50 tới 95, nên quality được định giá công bằng trên cả dải và 95 chẳng phải món hời tệ hơn 80',
            ),
            B(
              'Nothing useful, because quality and file size are not comparable across sources; the only valid conclusion needs an SSIM column next to each row',
              'Chẳng nói lên gì hữu ích, vì quality và kích thước file không so được giữa các nguồn khác nhau; kết luận có giá trị duy nhất phải có thêm cột SSIM cạnh mỗi dòng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read the differences rather than the levels: 50 → 80 costs 16.546 B for thirty points of quality, while 80 → 95 costs 49.440 B for fifteen. Same content, same encoder, same size — the second half of the dial is three times the price per point and buys differences that are hard to see on the device most people are using. That shape is why 80 is the repo\'s <code>WEBP_QUALITY</code> and why it is the default in most published pipelines. Option D has half a point — the absolute numbers do move with content, which is why Chapter 6 hands you the harness to re-run this on your own corpus — but the SHAPE is the finding, and it is visible here.',
            'Hãy đọc HIỆU, đừng đọc mức: từ 50 lên 80 tốn 16.546 B cho ba mươi điểm quality, còn từ 80 lên 95 tốn 49.440 B cho mười lăm điểm. Cùng nội dung, cùng encoder, cùng kích thước — nửa sau của núm vặn đắt gấp ba lần trên mỗi điểm và mua về những khác biệt khó thấy trên đúng thiết bị mà phần lớn người dùng đang cầm. Chính hình dạng ấy là lý do 80 là <code>WEBP_QUALITY</code> của kho này và là mặc định trong hầu hết pipeline được công bố. Lựa chọn D đúng một nửa — các con số tuyệt đối có thay đổi theo nội dung, và đó là lý do chương 6 đưa cho bạn bộ đo để chạy lại trên chính kho ảnh của mình — nhưng HÌNH DẠNG mới là phát hiện, và nó hiện rõ ở đây.',
          ),
        }),

        mcq({
          prompt: B(
            'The same 1200-px-wide output encoded as JPEG four ways on this machine:' + code(
              'jpeg q=80  (default encoder)   74.164 B\n' +
              'jpeg q=80  mozjpeg: true       63.613 B\n' +
              'jpeg q=85  mozjpeg: true       74.166 B\n' +
              'webp q=80  effort: 4           49.246 B',
            ) + 'What do the first three rows argue for, and what does the fourth add?',
            'Cùng một bản ra rộng 1200 px được encode thành JPEG theo bốn cách trên máy này:' + code(
              'jpeg q=80  (encoder mặc định)  74.164 B\n' +
              'jpeg q=80  mozjpeg: true       63.613 B\n' +
              'jpeg q=85  mozjpeg: true       74.166 B\n' +
              'webp q=80  effort: 4           49.246 B',
            ) + 'Ba dòng đầu ủng hộ điều gì, và dòng thứ tư thêm vào điều gì?',
          ),
          options: [
            B(
              '<code>mozjpeg: true</code> is a different encoder for the same format: measured 14% smaller at identical quality, and row three shows what that buys — you can spend the saving on quality instead and land back at the original size with a better picture. Row four is the separate, larger decision: the format itself is worth more than any tuning inside it',
              '<code>mozjpeg: true</code> là một encoder KHÁC cho cùng một format: đo được nhỏ hơn 14% ở cùng quality, và dòng ba cho thấy phần tiết kiệm ấy mua được gì — bạn tiêu nó vào chất lượng và quay lại đúng kích thước ban đầu với một tấm ảnh đẹp hơn. Dòng bốn là quyết định riêng và lớn hơn: bản thân FORMAT đáng giá hơn mọi phép tinh chỉnh bên trong nó',
            ),
            B(
              '<code>mozjpeg: true</code> is a quality preset, not an encoder — rows two and three are the same encoder at two quality points, and the 14% gap is simply the quality curve between 80 and 85 read backwards',
              '<code>mozjpeg: true</code> là một preset chất lượng chứ không phải một encoder — dòng hai và dòng ba là cùng một encoder ở hai mức quality, và khoảng cách 14% chỉ là đường cong quality giữa 80 và 85 đọc ngược lại',
            ),
            B(
              'Rows one and two differ because mozjpeg writes progressive JPEG by default, so the saving is a container-layout effect and disappears once both are written baseline',
              'Dòng một và dòng hai khác nhau vì mozjpeg mặc định ghi JPEG progressive, nên phần tiết kiệm là hiệu ứng của bố cục container và biến mất khi cả hai được ghi ở dạng baseline',
            ),
            B(
              'The table argues against mozjpeg: 14% is inside the run-to-run spread of a lossy encoder, and row three confirms it by landing within two bytes of row one',
              'Bảng này phản đối mozjpeg: 14% nằm trong khoảng dao động giữa các lượt chạy của một encoder có mất dữ liệu, và dòng ba xác nhận điều đó khi rơi cách dòng một đúng hai byte',
            ),
          ],
          correct: 0,
          explanation: EX(
            'mozjpeg is Mozilla\'s JPEG encoder wired in behind one boolean; it produces a file any JPEG decoder reads, and the course puts the saving at 5–10% while this measurement came out at 14,2% — a reminder that published ratios are content-dependent in both directions. Row three is the reframing worth remembering: 63.613 B at q80 and 74.166 B at q85 means the option can be spent as bytes OR as quality. Option D misreads the two-byte coincidence: a lossy encoder is deterministic, so re-running row one gives 74.164 B every time — row three is not noise, it is a different quality setting that happens to land two bytes away.',
            'mozjpeg là bộ encode JPEG của Mozilla được đấu vào sau đúng một giá trị boolean; nó cho ra một file mà mọi bộ giải mã JPEG đều đọc được, và giáo trình đặt phần tiết kiệm ở mức 5–10% trong khi phép đo này ra 14,2% — một lời nhắc rằng tỉ lệ được công bố phụ thuộc nội dung theo cả hai chiều. Dòng ba là cách nhìn lại đáng nhớ: 63.613 B ở q80 và 74.166 B ở q85 nghĩa là tuỳ chọn ấy tiêu được thành BYTE HOẶC thành CHẤT LƯỢNG. Lựa chọn D đọc sai sự trùng hợp hai byte: một encoder có mất dữ liệu là tất định, nên chạy lại dòng một lần nào cũng ra 74.164 B — dòng ba không phải nhiễu, nó là một mức quality khác mà tình cờ rơi cách đó hai byte.',
          ),
        }),

        // ── Chương 3 — FFmpeg từ Node ───────────────────────────────────
        mcq({
          prompt: B(
            'Four ways to run FFmpeg from Node. Which row is wrong?' + code(
              'API                          Shell?   Args      Buffers all output?\n' +
              '───────────────────────────  ───────  ────────  ───────────────────\n' +
              'A  exec(cmd)                   yes     string     yes (maxBuffer)\n' +
              'B  execFile(bin, argv[])        no     array      yes (maxBuffer)\n' +
              'C  spawn(bin, argv[])           no     array      no — you stream it\n' +
              'D  spawn(bin, argv, {shell:true})  no  array      no — you stream it',
            ),
            'Bốn cách chạy FFmpeg từ Node. Dòng nào SAI?' + code(
              'API                          Shell?   Tham số   Gom hết output?\n' +
              '───────────────────────────  ───────  ────────  ───────────────────\n' +
              'A  exec(cmd)                   có      chuỗi      có (maxBuffer)\n' +
              'B  execFile(bin, argv[])       không    mảng       có (maxBuffer)\n' +
              'C  spawn(bin, argv[])          không    mảng       không — bạn tự chảy dòng\n' +
              'D  spawn(bin, argv, {shell:true})  không  mảng     không — bạn tự chảy dòng',
            ),
          ),
          options: [
            B('Row A — <code>exec</code> does not use a shell on Linux, only on Windows', 'Dòng A — <code>exec</code> không dùng shell trên Linux, chỉ dùng trên Windows'),
            B('Row B — <code>execFile</code> streams rather than buffering, which is why it is the recommended default', 'Dòng B — <code>execFile</code> chảy dòng chứ không gom, đó là lý do nó là mặc định được khuyến nghị'),
            B('Row C — <code>spawn</code> takes a single string, exactly like <code>exec</code>', 'Dòng C — <code>spawn</code> nhận một chuỗi duy nhất, y hệt <code>exec</code>'),
            B('Row D — <code>shell: true</code> puts a shell back in, which is the entire point of the option and the reason it is the worst of both worlds', 'Dòng D — <code>shell: true</code> đặt shell trở lại, đó chính là mục đích của tuỳ chọn ấy và là lý do nó gộp cái dở của cả hai phía'),
          ],
          correct: 3,
          explanation: EX(
            'A, B and C are as described. D is the trap: the option is named after exactly what it does — the argv array is joined and handed to <code>/bin/sh</code>, so you get shell parsing back while your code still <i>looks</i> like the safe argv form. If you genuinely need a shell pipeline, build it deliberately and sanitise hard; otherwise <code>execFile</code> for short jobs and <code>spawn</code> for long ones, both with an array. One more reason <code>exec</code> is wrong for FFmpeg specifically: it buffers everything in memory against a <code>maxBuffer</code>, and FFmpeg is chatty on stderr.',
            'A, B và C đúng như mô tả. D là cái bẫy: tuỳ chọn được đặt tên đúng theo thứ nó làm — mảng argv bị nối lại rồi đưa cho <code>/bin/sh</code>, nên bạn nhận lại toàn bộ việc phân tích của shell trong khi mã của bạn vẫn TRÔNG như dạng argv an toàn. Nếu thật sự cần một pipeline shell thì hãy dựng có chủ đích và lọc thật kỹ; còn không thì <code>execFile</code> cho việc ngắn và <code>spawn</code> cho việc dài, cả hai đều dùng mảng. Thêm một lý do <code>exec</code> sai riêng với FFmpeg: nó gom hết vào bộ nhớ theo một <code>maxBuffer</code>, mà FFmpeg thì rất lắm lời trên stderr.',
          ),
        }),

        mcq({
          prompt: B(
            'Thumbnails work in the dev container and quietly stop working in production weeks after a deploy. The repo has this:' + code(
              'export async function isVideoThumbnailingAvailable() {\n' +
              '  try {\n' +
              '    await execAsync(`${FFMPEG_PATH} -version`, { timeout: 5000 })\n' +
              '    return true\n' +
              '  } catch { return false }\n' +
              '}',
            ) + 'Why does this function exist, and what does its result deserve?',
            'Thumbnail chạy tốt trong container dev rồi âm thầm ngừng chạy ở production vài tuần sau một lần deploy. Kho này có sẵn hàm sau:' + code(
              'export async function isVideoThumbnailingAvailable() {\n' +
              '  try {\n' +
              '    await execAsync(`${FFMPEG_PATH} -version`, { timeout: 5000 })\n' +
              '    return true\n' +
              '  } catch { return false }\n' +
              '}',
            ) + 'Vì sao hàm này tồn tại, và kết quả của nó xứng đáng được xử lý thế nào?',
          ),
          options: [
            B(
              'It exists because FFmpeg is a SYSTEM dependency rather than an npm one — present in the dev image and absent from a slim production image unless someone added it to the Dockerfile — and the result belongs in a loud startup probe, because as a per-upload check it only ever produces a warning nobody reads',
              'Nó tồn tại vì FFmpeg là phụ thuộc của HỆ ĐIỀU HÀNH chứ không phải của npm — có trong ảnh dev và vắng trong một ảnh production tinh gọn trừ khi có ai đó thêm nó vào Dockerfile — và kết quả của nó thuộc về một lượt thăm dò lúc khởi động có ghi log to rõ, vì nếu chỉ kiểm theo từng lượt upload thì nó chỉ sinh ra một cảnh báo không ai đọc',
            ),
            B(
              'It exists to detect a version mismatch, since <code>-version</code> is the only flag whose output is stable across builds, and the result should gate which argv shape the service uses',
              'Nó tồn tại để phát hiện lệch phiên bản, vì <code>-version</code> là cờ duy nhất có đầu ra ổn định giữa các bản dựng, và kết quả nên dùng để chọn dạng argv mà dịch vụ sẽ dùng',
            ),
            B(
              'It exists as a health check for the container orchestrator, and the result should fail the readiness probe so a node without FFmpeg never receives traffic',
              'Nó tồn tại như một phép kiểm sức khoẻ cho bộ điều phối container, và kết quả nên làm hỏng readiness probe để một node không có FFmpeg không bao giờ nhận lưu lượng',
            ),
            B(
              'It exists because <code>execAsync</code> caches the binary path after the first successful call, so the probe is what warms that cache and the result itself is incidental',
              'Nó tồn tại vì <code>execAsync</code> ghi nhớ đường dẫn nhị phân sau lần gọi thành công đầu tiên, nên lượt thăm dò này chính là thứ làm nóng bộ nhớ ấy còn kết quả thì chỉ là phụ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The gap between "works on my machine" and "works in the image" is exactly the gap between an npm dependency and a system one, and it opens silently: nothing in <code>package.json</code> records that this service needs a binary. The thumbnail path is non-fatal by design, so an FFmpeg that is simply not installed costs every user a thumbnail and produces one warn line per upload — technically correct and operationally invisible. Run the probe once at startup and log loudly. Option C is a reasonable extension of the same idea and is wrong as stated: a missing thumbnail is cosmetic, so refusing all traffic to the node is a much larger outage than the one you are preventing.',
            'Khoảng cách giữa "máy tôi chạy được" và "trong ảnh chạy được" đúng bằng khoảng cách giữa một phụ thuộc npm và một phụ thuộc hệ điều hành, và nó mở ra một cách âm thầm: chẳng có gì trong <code>package.json</code> ghi lại rằng dịch vụ này cần một tệp nhị phân. Đường sinh thumbnail vốn được thiết kế là không-gây-chết, nên một FFmpeg đơn giản là chưa cài sẽ làm mọi người dùng mất thumbnail và sinh ra một dòng warn mỗi lượt upload — đúng về mặt kỹ thuật và vô hình về mặt vận hành. Hãy chạy lượt thăm dò một lần lúc khởi động và ghi log thật to. Lựa chọn C là một mở rộng hợp lý của cùng ý tưởng và sai như đã phát biểu: thiếu một cái thumbnail chỉ là chuyện thẩm mỹ, nên chặn hết lưu lượng vào node là một sự cố lớn hơn nhiều so với thứ bạn đang phòng.',
          ),
        }),

        mcq({
          prompt: B(
            'The fixed code is handed the same hostile filename, as an argv element:' + code(
              "await execFileAsync('ffmpeg',\n" +
              "  ['-y','-hide_banner','-loglevel','error',\n" +
              "   '-i', 'fx/clip.mp4\";touch INJECTION_PROOF;#',\n" +
              "   '-frames:v','1','out/x.jpg'])",
            ) + code(
              'stderr: [in#0] Error opening input: No such file or directory\n' +
              '        Error opening input file fx/clip.mp4";touch INJECTION_PROOF;#.\n' +
              'exit:   254\n' +
              "fs.existsSync('INJECTION_PROOF')  → false",
            ) + 'What is the significant part of this transcript?',
            'Mã đã vá được đưa cho đúng cái tên file thù địch ấy, dưới dạng một phần tử argv:' + code(
              "await execFileAsync('ffmpeg',\n" +
              "  ['-y','-hide_banner','-loglevel','error',\n" +
              "   '-i', 'fx/clip.mp4\";touch INJECTION_PROOF;#',\n" +
              "   '-frames:v','1','out/x.jpg'])",
            ) + code(
              'stderr: [in#0] Error opening input: No such file or directory\n' +
              '        Error opening input file fx/clip.mp4";touch INJECTION_PROOF;#.\n' +
              'exit:   254\n' +
              "fs.existsSync('INJECTION_PROOF')  → false",
            ) + 'Phần đáng chú ý của đoạn transcript này là gì?',
          ),
          options: [
            B(
              'The non-zero exit code — it shows FFmpeg detected the injection attempt and refused to proceed, which is the behaviour the <code>-loglevel error</code> flag enables',
              'Mã thoát khác 0 — nó cho thấy FFmpeg đã phát hiện âm mưu tiêm và từ chối tiếp tục, đúng hành vi mà cờ <code>-loglevel error</code> bật lên',
            ),
            B(
              'That the vulnerability is only partly closed: the file was not created this time, but a payload using <code>$()</code> instead of <code>;</code> would still reach a shell through <code>execFile</code>',
              'Rằng lỗ hổng mới đóng được một phần: lần này file không được tạo ra, nhưng một payload dùng <code>$()</code> thay cho <code>;</code> vẫn sẽ chạm tới shell thông qua <code>execFile</code>',
            ),
            B(
              'That <code>execFileAsync</code> escaped the quotes and semicolons before passing them on, which is what argv arrays do and what makes them safe',
              'Rằng <code>execFileAsync</code> đã thoát các dấu nháy và chấm phẩy trước khi truyền tiếp, đó là việc mảng argv làm và là điều làm cho chúng an toàn',
            ),
            B(
              'FFmpeg echoed the name back verbatim, semicolons and quotes included, and reported it as a missing FILE. There was no shell to parse it, so the metacharacters were just characters — and no <code>INJECTION_PROOF</code> was created',
              'FFmpeg lặp lại nguyên văn cái tên, kèm cả dấu chấm phẩy lẫn dấu nháy, và báo nó là một FILE không tồn tại. Không có shell nào để phân tích nó, nên các ký tự đặc biệt chỉ là ký tự — và không có <code>INJECTION_PROOF</code> nào được tạo ra',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Note carefully that nothing was escaped. There is no escaping in the argv form and none is needed — each array element becomes exactly one entry in the child\'s <code>argv</code>, and no <code>/bin/sh</code> exists to interpret anything. FFmpeg therefore did the only correct thing: it treated the whole string as a filename, failed to open it, and exited 254. A name with <code>$()</code>, a newline or a backtick would produce the identical outcome. The exit code is not evidence of detection — it is the ordinary "input not found" code.',
            'Hãy chú ý rằng KHÔNG có gì được thoát cả. Dạng argv không có việc thoát ký tự và cũng không cần — mỗi phần tử của mảng trở thành đúng một mục trong <code>argv</code> của tiến trình con, và chẳng có <code>/bin/sh</code> nào tồn tại để diễn giải bất cứ thứ gì. Vì thế FFmpeg làm đúng cái duy nhất đúng: coi cả chuỗi là một tên file, mở không được, và thoát với mã 254. Một cái tên chứa <code>$()</code>, một dấu xuống dòng hay một dấu huyền ngược cũng cho kết quả y hệt. Mã thoát không phải bằng chứng của việc phát hiện — nó là mã "không tìm thấy đầu vào" bình thường.',
          ),
        }),

        mcq({
          prompt: B(
            'A thumbnail worker takes the input URL from a database row. Someone adds a flag and re-runs it against a local file to see what it does:' + code(
              'ffmpeg -protocol_whitelist https,tls,tcp -i fx/clip-720p-10s.mp4 …',
            ) + code(
              "[file @ 0x…] Protocol 'file' not on whitelist 'https,tls,tcp'!\n" +
              '[in#0 @ 0x…] Error opening input: Invalid argument',
            ) + 'What class of problem does that flag address?',
            'Một worker sinh thumbnail lấy URL đầu vào từ một dòng cơ sở dữ liệu. Có người thêm một cờ rồi chạy lại trên một file cục bộ để xem nó làm gì:' + code(
              'ffmpeg -protocol_whitelist https,tls,tcp -i fx/clip-720p-10s.mp4 …',
            ) + code(
              "[file @ 0x…] Protocol 'file' not on whitelist 'https,tls,tcp'!\n" +
              '[in#0 @ 0x…] Error opening input: Invalid argument',
            ) + 'Cái cờ đó xử lý loại vấn đề nào?',
          ),
          options: [
            B(
              'Command injection: it prevents a filename containing shell metacharacters from being interpreted, which makes it an alternative to using <code>execFile</code>',
              'Tiêm lệnh: nó ngăn một tên file chứa ký tự đặc biệt của shell bị diễn giải, khiến nó thành một lựa chọn thay cho việc dùng <code>execFile</code>',
            ),
            B(
              'Decompression bombs: restricting protocols also restricts the demuxers FFmpeg will load, and the malicious-container class travels through exotic demuxers',
              'Bom giải nén: hạn chế giao thức cũng hạn chế những demuxer mà FFmpeg sẽ nạp, và họ container độc hại đi qua đúng các demuxer lạ ấy',
            ),
            B(
              'Server-side request forgery and local file disclosure: FFmpeg speaks <code>file:</code>, <code>http:</code>, <code>concat:</code> and dozens more, so an attacker-influenced input string could otherwise be pointed at <code>file:///etc/passwd</code> or at an internal service from your server\'s network position',
              'Giả mạo yêu cầu phía máy chủ và lộ file cục bộ: FFmpeg nói được <code>file:</code>, <code>http:</code>, <code>concat:</code> và hàng chục giao thức khác, nên một chuỗi đầu vào chịu ảnh hưởng của kẻ tấn công có thể bị trỏ vào <code>file:///etc/passwd</code> hoặc vào một dịch vụ nội bộ ngay từ vị trí mạng của máy chủ bạn',
            ),
            B(
              'Expired presigned URLs: whitelisting <code>https</code> makes FFmpeg retry a 403 over TLS instead of failing immediately, which is what the <code>tls</code> entry is for',
              'URL ký sẵn hết hạn: cho <code>https</code> vào danh sách trắng khiến FFmpeg thử lại một mã 403 qua TLS thay vì hỏng ngay, đó là công dụng của mục <code>tls</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The transcript shows the mechanism directly: with <code>file</code> off the list, a perfectly ordinary local path is refused. That is the point — you are narrowing what an input string is allowed to mean. It is orthogonal to injection (which <code>execFile</code> solves by removing the shell) and orthogonal to pixel budgets. Reach for it whenever the input is a URL that anything outside your code can influence.',
            'Đoạn transcript cho thấy cơ chế ngay: bỏ <code>file</code> khỏi danh sách thì một đường dẫn cục bộ hết sức bình thường cũng bị từ chối. Đó chính là ý — bạn đang thu hẹp phạm vi ý nghĩa mà một chuỗi đầu vào được phép mang. Nó vuông góc với chuyện tiêm lệnh (thứ mà <code>execFile</code> giải quyết bằng cách bỏ hẳn shell) và vuông góc với ngân sách pixel. Hãy dùng nó bất cứ khi nào đầu vào là một URL mà thứ gì ngoài mã của bạn có thể tác động vào.',
          ),
        }),

        mcq({
          prompt: B(
            'One frame extracted from the same clip at five values of <code>-q:v</code>:' + code(
              '-q:v 2    62.806 B\n' +
              '-q:v 5    41.811 B\n' +
              '-q:v 10   28.530 B\n' +
              '-q:v 20   19.103 B\n' +
              '-q:v 31   15.238 B',
            ) + 'A reviewer says "the thumbnail is huge, raise <code>-q:v</code> to 2 to compress it more". What is wrong?',
            'Một frame được trích từ cùng một clip với năm giá trị <code>-q:v</code>:' + code(
              '-q:v 2    62.806 B\n' +
              '-q:v 5    41.811 B\n' +
              '-q:v 10   28.530 B\n' +
              '-q:v 20   19.103 B\n' +
              '-q:v 31   15.238 B',
            ) + 'Một người review nói "thumbnail to quá, đẩy <code>-q:v</code> lên 2 để nén mạnh hơn". Sai chỗ nào?',
          ),
          options: [
            B(
              'Nothing is wrong — 2 is indeed the strongest compression, but the gain over 5 is small enough that the change is not worth making',
              'Không sai gì cả — 2 đúng là mức nén mạnh nhất, chỉ là phần lợi so với 5 nhỏ tới mức không đáng đổi',
            ),
            B(
              'The scale runs the other way: for MJPEG output <code>-q:v</code> is a quantiser where 2 is the BEST quality and 31 the worst, so "raising it to 2" is lowering it, and it makes the file four times larger',
              'Thang chạy ngược lại: với đầu ra MJPEG thì <code>-q:v</code> là một hệ số lượng tử hoá mà 2 là chất lượng TỐT NHẤT còn 31 là tệ nhất, nên "đẩy lên 2" thực ra là hạ xuống, và nó làm file to gấp bốn lần',
            ),
            B(
              '<code>-q:v</code> only applies to video streams; for a single extracted frame the correct flag is <code>-qscale</code>, and the numbers above came from an ignored option',
              '<code>-q:v</code> chỉ áp cho luồng video; với một frame đơn được trích ra thì cờ đúng là <code>-qscale</code>, và những con số trên đến từ một tuỳ chọn bị bỏ qua',
            ),
            B(
              'The reviewer confused it with CRF: <code>-q:v</code> is a bitrate in kbps, so 2 means 2 kbps and would produce a file too corrupt to open',
              'Người review nhầm nó với CRF: <code>-q:v</code> là một bitrate tính bằng kbps, nên 2 nghĩa là 2 kbps và sẽ cho ra một file hỏng tới mức không mở được',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The measurement settles the direction with no ambiguity: 2 → 62.806 B, 31 → 15.238 B. Lower is better quality and bigger, exactly like <code>-crf</code> for libx264 and exactly UNLIKE Sharp\'s <code>quality</code>, where higher is better. Three scales in one course, two of them inverted relative to intuition — which is why the habit worth keeping is to encode both ends of any scale you are unsure of and look at the bytes.',
            'Phép đo chốt lại chiều của thang, không còn chỗ mơ hồ: 2 → 62.806 B, 31 → 15.238 B. Số nhỏ hơn nghĩa là chất lượng cao hơn và file to hơn, y hệt <code>-crf</code> của libx264 và NGƯỢC hẳn với <code>quality</code> của Sharp, nơi số lớn hơn là tốt hơn. Ba cái thang trong cùng một khoá, hai trong số đó ngược với trực giác — và đó là lý do thói quen đáng giữ là encode cả hai đầu của bất kỳ thang nào bạn chưa chắc, rồi nhìn số byte.',
          ),
        }),

        mcq({
          prompt: B(
            'The same 10-second 720p clip re-encoded at four CRF values, preset held at <code>veryfast</code>:' + code(
              'crf=18   4.489.351 B\n' +
              'crf=23   3.045.931 B\n' +
              'crf=28   1.471.730 B\n' +
              'crf=32     979.816 B',
            ) + 'Why does the course recommend <code>-crf</code> over <code>-b:v</code> for web video?',
            'Cùng một clip 720p dài 10 giây được encode lại ở bốn giá trị CRF, preset giữ ở <code>veryfast</code>:' + code(
              'crf=18   4.489.351 B\n' +
              'crf=23   3.045.931 B\n' +
              'crf=28   1.471.730 B\n' +
              'crf=32     979.816 B',
            ) + 'Vì sao giáo trình khuyên dùng <code>-crf</code> thay cho <code>-b:v</code> với video web?',
          ),
          options: [
            B(
              'Because CRF produces a smaller file at every quality level, as the table shows — constant bitrate cannot reach 979.816 B on a 10-second clip at all',
              'Vì CRF cho ra file nhỏ hơn ở mọi mức chất lượng, như bảng cho thấy — bitrate cố định thì không thể chạm tới 979.816 B trên một clip 10 giây',
            ),
            B(
              'Because <code>-b:v</code> is deprecated in ffmpeg 8 and now emits a warning that pollutes the stderr you have to drain',
              'Vì <code>-b:v</code> đã bị loại bỏ trong ffmpeg 8 và giờ in ra một cảnh báo làm bẩn đúng cái stderr mà bạn phải rút cạn',
            ),
            B(
              'Because CRF pins the QUALITY and lets the bitrate float, so a static scene is cheap and a complex one gets the bits it needs — whereas a constant bitrate wastes bits on the static parts and starves the complex ones',
              'Vì CRF ghim CHẤT LƯỢNG và để bitrate trôi, nên một cảnh tĩnh thì rẻ còn một cảnh phức tạp được cấp đủ bit — trong khi bitrate cố định thì phí bit ở đoạn tĩnh và bỏ đói đoạn phức tạp',
            ),
            B(
              'Because CRF is the only mode that guarantees the output will be under a known size, which is what a storage budget needs',
              'Vì CRF là chế độ duy nhất bảo đảm bản ra nằm dưới một kích thước biết trước, đúng thứ mà một ngân sách lưu trữ cần',
            ),
          ],
          correct: 2,
          explanation: EX(
            'CRF says "hold this quality, spend whatever bitrate it takes", which is almost always what a web pipeline wants. The trade is stated honestly in option D, inverted: CRF gives you no size guarantee at all — the same setting on a different source produces a different file, which is why a storage projection needs a measurement rather than a formula. Note the asymmetry in the table too: 23 → 18 costs 1,47× the bytes for a difference most viewers cannot name, while 23 → 28 more than halves the file for one they can.',
            'CRF nói "giữ nguyên chất lượng này, tốn bao nhiêu bitrate cũng được", và đó gần như luôn là thứ một pipeline web muốn. Cái giá được nói thật trong lựa chọn D, chỉ là bị lật ngược: CRF không hề bảo đảm kích thước — cùng một cấu hình trên một nguồn khác cho ra một file khác, và đó là lý do một dự báo dung lượng cần một phép ĐO chứ không phải một công thức. Cũng để ý sự bất đối xứng trong bảng: từ 23 xuống 18 tốn 1,47 lần số byte để đổi lấy khác biệt phần lớn người xem không gọi tên được, còn từ 23 lên 28 thì giảm hơn một nửa file để đổi lấy khác biệt họ gọi tên được.',
          ),
        }),

        mcq({
          prompt: B(
            'A production ladder gives each rung a different CRF:' + code(
              "{ name: '360p',  height: 360,  crf: 26 }\n" +
              "{ name: '720p',  height: 720,  crf: 23 }\n" +
              "{ name: '1080p', height: 1080, crf: 22 }",
            ) + 'Why does the SMALLEST rendition get the HIGHEST crf number?',
            'Một bậc thang production đặt cho mỗi bậc một CRF khác nhau:' + code(
              "{ name: '360p',  height: 360,  crf: 26 }\n" +
              "{ name: '720p',  height: 720,  crf: 23 }\n" +
              "{ name: '1080p', height: 1080, crf: 22 }",
            ) + 'Vì sao bản NHỎ NHẤT lại nhận số crf CAO NHẤT?',
          ),
          options: [
            B(
              'Because a 360p frame has a ninth of the pixels of 1080p, so compression artifacts are physically smaller on screen and far less visible — spending crf 22 there buys detail the resolution has already thrown away',
              'Vì một frame 360p chỉ có một phần chín số pixel của 1080p, nên vết nén nhỏ hơn về mặt vật lý trên màn hình và khó thấy hơn nhiều — tiêu crf 22 ở đó là mua lấy chi tiết mà chính độ phân giải đã vứt đi',
            ),
            B(
              'Because the 360p rung is served to mobile clients, where bandwidth is the binding constraint, and the CRF gradient is the only place to express that preference',
              'Vì bậc 360p được phục vụ cho client di động, nơi băng thông là ràng buộc quyết định, và độ dốc CRF là chỗ duy nhất để nói lên ưu tiên ấy',
            ),
            B(
              'Because libx264 interprets CRF relative to the frame size, so crf 26 at 360p and crf 22 at 1080p ask the encoder for the same absolute quality',
              'Vì libx264 diễn giải CRF theo kích thước frame, nên crf 26 ở 360p và crf 22 ở 1080p là xin encoder cùng một mức chất lượng tuyệt đối',
            ),
            B(
              'Because HLS requires each rung\'s BANDWIDTH to differ by at least 2×, and the CRF gradient is how you hit that spacing',
              'Vì HLS đòi BANDWIDTH của mỗi bậc phải cách nhau ít nhất 2 lần, và độ dốc CRF là cách để đạt được khoảng cách ấy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'CRF is a perceptual target, and perception depends on how large an artifact is on the retina. The same blocking that is obvious across a 1080p frame is a few pixels across at 360p and vanishes. Option C sounds plausible and is false — CRF is not normalised by resolution; the gradient is a human decision, not an encoder behaviour. Option D is false too: HLS has no such requirement, though 1,5–2× spacing between rungs is a common authoring guideline for a different reason (so the adaptation algorithm has a meaningful step to take).',
            'CRF là một mục tiêu cảm nhận, và cảm nhận phụ thuộc vào việc một vết nén to bao nhiêu trên võng mạc. Cùng một vết vỡ khối rõ mồn một trên khung 1080p thì ở 360p chỉ rộng vài pixel và biến mất. Lựa chọn C nghe hợp lý và sai — CRF KHÔNG được chuẩn hoá theo độ phân giải; độ dốc kia là một quyết định của con người, không phải hành vi của encoder. Lựa chọn D cũng sai: HLS không có yêu cầu đó, dù khoảng cách 1,5–2 lần giữa các bậc là một hướng dẫn soạn thảo phổ biến vì một lý do khác (để thuật toán thích ứng có một bước nhảy đủ nghĩa).',
          ),
        }),

        mcq({
          prompt: B(
            'The thumbnail extractor ends like this:' + code(
              '} catch (err) {\n' +
              "  logger.warn('[video] thumbnail extraction failed (non-fatal)', { … })\n" +
              '  return null\n' +
              '} finally {\n' +
              '  try { if (inputWritten) await fs.unlink(inputPath) } catch {}\n' +
              '  try { if (outputExists) await fs.unlink(outputPath) } catch {}\n' +
              '}',
            ) + 'Two decisions are worth copying here. Which pair?',
            'Bộ trích thumbnail kết thúc như sau:' + code(
              '} catch (err) {\n' +
              "  logger.warn('[video] thumbnail extraction failed (non-fatal)', { … })\n" +
              '  return null\n' +
              '} finally {\n' +
              '  try { if (inputWritten) await fs.unlink(inputPath) } catch {}\n' +
              '  try { if (outputExists) await fs.unlink(outputPath) } catch {}\n' +
              '}',
            ) + 'Có hai quyết định ở đây đáng chép lại. Cặp nào?',
          ),
          options: [
            B(
              'Returning <code>null</code> rather than throwing, so a codec FFmpeg cannot handle costs the user a thumbnail and not their upload; and cleaning up in <code>finally</code> behind boolean flags, so every path — success, FFmpeg failure and timeout — unlinks, without <code>unlink</code> on a file that was never created throwing over the original error',
              'Trả về <code>null</code> thay vì ném lỗi, để một codec mà FFmpeg không xử lý được chỉ làm người dùng mất cái thumbnail chứ không mất lượt upload; và dọn dẹp trong <code>finally</code> có cờ boolean canh, để MỌI nhánh — thành công, FFmpeg hỏng và quá hạn — đều xoá file, mà không để <code>unlink</code> trên một file chưa từng được tạo ném đè lên lỗi gốc',
            ),
            B(
              'Logging at <code>warn</code> rather than <code>error</code>, which keeps the alerting quiet for an expected failure; and swallowing the <code>unlink</code> errors, which guarantees the <code>finally</code> block itself can never change the return value',
              'Ghi log ở mức <code>warn</code> thay vì <code>error</code>, giữ cho hệ cảnh báo im lặng với một kiểu hỏng vốn được dự liệu; và nuốt các lỗi của <code>unlink</code>, bảo đảm rằng chính khối <code>finally</code> không bao giờ đổi được giá trị trả về',
            ),
            B(
              'Attaching the original filename to the log line, which is what makes the failure reproducible; and unlinking the INPUT before the output, so a full disk cannot block the cleanup of the larger of the two files',
              'Đính tên file gốc vào dòng log, đó là thứ làm cho kiểu hỏng này tái hiện được; và xoá file ĐẦU VÀO trước file đầu ra, để một cái đĩa đầy không chặn được việc dọn file lớn hơn trong hai file',
            ),
            B(
              'Returning <code>null</code> so the caller can distinguish "no thumbnail" from "an empty thumbnail"; and using <code>fs.unlink</code> rather than <code>fs.rm</code>, which would follow a symlink an attacker could have planted at the temp path',
              'Trả về <code>null</code> để bên gọi phân biệt được "không có thumbnail" với "một thumbnail rỗng"; và dùng <code>fs.unlink</code> thay vì <code>fs.rm</code>, thứ sẽ đi theo một symlink mà kẻ tấn công có thể đã cài ở đường dẫn tạm',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Non-fatal is the right semantics for a cosmetic artefact, and the <code>finally</code> shape is what makes temp files an invariant rather than a habit. The two <code>try {} catch {}</code> wrappers inside it are load-bearing for a specific reason: an <code>unlink</code> that throws because the file was never written would replace the real error with a much less useful one. Option B describes true mechanics and draws the wrong conclusion from the first half — chapter 9 argues that a <code>warn</code> nobody counts is exactly where a 100%-broken primary path can live, so the log level is the part of this design that still needs a metric next to it.',
            'Không-gây-chết là ngữ nghĩa đúng cho một hiện vật mang tính thẩm mỹ, và hình dạng của khối <code>finally</code> là thứ biến việc dọn file tạm thành một bất biến chứ không phải một thói quen. Hai lớp bọc <code>try {} catch {}</code> bên trong nó chịu lực vì một lý do cụ thể: một lệnh <code>unlink</code> ném lỗi vì file chưa từng được ghi sẽ thay thế lỗi thật bằng một lỗi vô dụng hơn nhiều. Lựa chọn B mô tả đúng cơ chế nhưng rút ra kết luận sai từ nửa đầu — chương 9 lập luận rằng một dòng <code>warn</code> không ai đếm chính là chỗ mà một nhánh chính hỏng 100% có thể sống lâu dài, nên mức log lại đúng là phần của thiết kế này còn thiếu một chỉ số bên cạnh.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — The geometry of <code>resize()</code> (chapter 1).</b> Implement <code>kichThuocRa(nguon, yc)</code>: given a source <code>{ rong, cao }</code> and a request object shaped like Sharp\'s <code>resize()</code> options, return the OUTPUT <code>{ rong, cao }</code> — the numbers <code>info.width</code> / <code>info.height</code> would report.</p>' +
            '<p>Every rule below was measured against sharp 0.35.4 over 648 combinations; the expected output for these sixteen cases was produced by running real Sharp.</p>' +
            '<ul>' +
            '<li>Neither <code>width</code> nor <code>height</code> given → the source, untouched.</li>' +
            '<li>Exactly one given → one scale factor from that axis, applied to both; <code>fit</code> plays no part.</li>' +
            '<li><code>fit: &quot;inside&quot;</code> → one scale = <code>min(width/rong, height/cao)</code>; <code>fit: &quot;outside&quot;</code> → <code>max(…)</code>. Apply it to both axes.</li>' +
            '<li><code>fit: &quot;contain&quot;</code> → the output is exactly the box asked for; the shortfall is background.</li>' +
            '<li><code>fit: &quot;cover&quot;</code> (the DEFAULT when <code>fit</code> is absent) → also exactly the box, reached by cropping.</li>' +
            '<li><code>withoutEnlargement: true</code> clamps the scale to at most 1 in the scale-based branches. In the box-based branches (<code>cover</code>) it clamps <b>each axis independently</b>: <code>min(width, rong) × min(height, cao)</code> — measured, and not what most people expect. It does <b>not</b> apply to <code>contain</code>, whose canvas is whatever you asked for.</li>' +
            '<li>Round with <code>Math.round</code>.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are. Do not install anything and do not <code>require(&quot;sharp&quot;)</code> — this is the arithmetic, on paper.</p>',

            '<p><b>Câu 31 — Hình học của <code>resize()</code> (chương 1).</b> Hãy cài đặt <code>kichThuocRa(nguon, yc)</code>: cho một nguồn <code>{ rong, cao }</code> và một object yêu cầu có hình dạng đúng như tuỳ chọn <code>resize()</code> của Sharp, trả về kích thước ĐẦU RA <code>{ rong, cao }</code> — chính hai con số mà <code>info.width</code> / <code>info.height</code> sẽ báo.</p>' +
            '<p>Mọi luật dưới đây đều đã đo trên sharp 0.35.4 với 648 tổ hợp; kết quả mong đợi của mười sáu ca này do chạy Sharp thật mà ra.</p>' +
            '<ul>' +
            '<li>Không nêu <code>width</code> lẫn <code>height</code> → giữ nguyên nguồn.</li>' +
            '<li>Nêu đúng một chiều → một hệ số lấy từ trục đó, áp cho cả hai; <code>fit</code> không có vai trò gì.</li>' +
            '<li><code>fit: &quot;inside&quot;</code> → một hệ số = <code>min(width/rong, height/cao)</code>; <code>fit: &quot;outside&quot;</code> → <code>max(…)</code>. Áp cho cả hai trục.</li>' +
            '<li><code>fit: &quot;contain&quot;</code> → kết quả đúng bằng khung đã xin; phần thiếu là nền.</li>' +
            '<li><code>fit: &quot;cover&quot;</code> (MẶC ĐỊNH khi không nêu <code>fit</code>) → cũng đúng bằng khung, đạt được bằng cách cắt.</li>' +
            '<li><code>withoutEnlargement: true</code> kẹp hệ số xuống tối đa bằng 1 ở những nhánh tính theo hệ số. Ở nhánh tính theo khung (<code>cover</code>) thì nó kẹp <b>từng trục một cách độc lập</b>: <code>min(width, rong) × min(height, cao)</code> — đo thật, và không phải thứ phần lớn mọi người nghĩ. Nó <b>không</b> áp cho <code>contain</code>, vì canvas của <code>contain</code> là đúng thứ bạn xin.</li>' +
            '<li>Làm tròn bằng <code>Math.round</code>.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả. Không cài thêm gì và KHÔNG <code>require(&quot;sharp&quot;)</code> — đây là phần số học, làm trên giấy.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const NGUON = {\n' +
            "  'photo-4032x3024.jpg': { rong: 4032, cao: 3024 },\n" +
            "  'land-1600x900.jpg':   { rong: 1600, cao: 900  },\n" +
            "  'port-900x1600.jpg':   { rong: 900,  cao: 1600 },\n" +
            "  'avatar-400.png':      { rong: 400,  cao: 400  },\n" +
            "  'clip-640x360.png':    { rong: 640,  cao: 360  },\n" +
            '};\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function kichThuocRa(nguon, yc) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CA = [\n' +
            "  { file: 'land-1600x900.jpg',   yc: { width: 500, height: 500, fit: 'cover' } },\n" +
            "  { file: 'land-1600x900.jpg',   yc: { width: 500, height: 500, fit: 'contain' } },\n" +
            "  { file: 'land-1600x900.jpg',   yc: { width: 500, height: 500, fit: 'inside' } },\n" +
            "  { file: 'land-1600x900.jpg',   yc: { width: 500, height: 500, fit: 'outside' } },\n" +
            "  { file: 'port-900x1600.jpg',   yc: { width: 500, height: 500, fit: 'inside' } },\n" +
            "  { file: 'port-900x1600.jpg',   yc: { width: 500, height: 500, fit: 'outside' } },\n" +
            "  { file: 'photo-4032x3024.jpg', yc: { width: 1200 } },\n" +
            "  { file: 'photo-4032x3024.jpg', yc: { height: 1200 } },\n" +
            "  { file: 'photo-4032x3024.jpg', yc: {} },\n" +
            "  { file: 'avatar-400.png',      yc: { width: 1200 } },\n" +
            "  { file: 'avatar-400.png',      yc: { width: 1200, withoutEnlargement: true } },\n" +
            "  { file: 'port-900x1600.jpg',   yc: { width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true } },\n" +
            "  { file: 'port-900x1600.jpg',   yc: { width: 2000, height: 2000, fit: 'contain', withoutEnlargement: true } },\n" +
            "  { file: 'clip-640x360.png',    yc: { width: 500, height: 500, fit: 'cover', withoutEnlargement: true } },\n" +
            "  { file: 'land-1600x900.jpg',   yc: { width: 2000, height: 500, fit: 'cover', withoutEnlargement: true } },\n" +
            "  { file: 'photo-4032x3024.jpg', yc: { width: 300, height: 900, fit: 'outside', withoutEnlargement: true } },\n" +
            '];\n' +
            'for (const { file, yc } of CA) {\n' +
            '  const n = NGUON[file];\n' +
            '  const r = kichThuocRa(n, yc);\n' +
            '  console.log(`${file} ${n.rong}x${n.cao} ${JSON.stringify(yc)} -> ${r.rong}x${r.cao}`);\n' +
            '}\n',
          expectedOutput:
            'land-1600x900.jpg 1600x900 {"width":500,"height":500,"fit":"cover"} -> 500x500\n' +
            'land-1600x900.jpg 1600x900 {"width":500,"height":500,"fit":"contain"} -> 500x500\n' +
            'land-1600x900.jpg 1600x900 {"width":500,"height":500,"fit":"inside"} -> 500x281\n' +
            'land-1600x900.jpg 1600x900 {"width":500,"height":500,"fit":"outside"} -> 889x500\n' +
            'port-900x1600.jpg 900x1600 {"width":500,"height":500,"fit":"inside"} -> 281x500\n' +
            'port-900x1600.jpg 900x1600 {"width":500,"height":500,"fit":"outside"} -> 500x889\n' +
            'photo-4032x3024.jpg 4032x3024 {"width":1200} -> 1200x900\n' +
            'photo-4032x3024.jpg 4032x3024 {"height":1200} -> 1600x1200\n' +
            'photo-4032x3024.jpg 4032x3024 {} -> 4032x3024\n' +
            'avatar-400.png 400x400 {"width":1200} -> 1200x1200\n' +
            'avatar-400.png 400x400 {"width":1200,"withoutEnlargement":true} -> 400x400\n' +
            'port-900x1600.jpg 900x1600 {"width":2000,"height":2000,"fit":"inside","withoutEnlargement":true} -> 900x1600\n' +
            'port-900x1600.jpg 900x1600 {"width":2000,"height":2000,"fit":"contain","withoutEnlargement":true} -> 2000x2000\n' +
            'clip-640x360.png 640x360 {"width":500,"height":500,"fit":"cover","withoutEnlargement":true} -> 500x360\n' +
            'land-1600x900.jpg 1600x900 {"width":2000,"height":500,"fit":"cover","withoutEnlargement":true} -> 1600x500\n' +
            'photo-4032x3024.jpg 4032x3024 {"width":300,"height":900,"fit":"outside","withoutEnlargement":true} -> 1200x900',
          sampleSolution:
            'function kichThuocRa(nguon, yc) {\n' +
            '  const { rong: w, cao: h } = nguon;\n' +
            "  const fit = yc.fit ?? 'cover';\n" +
            '  const khongPhongTo = yc.withoutEnlargement === true;\n' +
            '  const tw = yc.width ?? null;\n' +
            '  const th = yc.height ?? null;\n\n' +
            '  // Không nêu chiều nào thì không đụng tới ảnh.\n' +
            '  if (tw === null && th === null) return { rong: w, cao: h };\n\n' +
            '  // Chỉ một chiều: tỉ lệ giữ nguyên, fit không có vai trò gì.\n' +
            '  if (tw === null || th === null) {\n' +
            '    let s = tw !== null ? tw / w : th / h;\n' +
            '    if (khongPhongTo && s > 1) s = 1;\n' +
            '    return { rong: Math.round(w * s), cao: Math.round(h * s) };\n' +
            '  }\n\n' +
            '  // inside / outside: MỘT hệ số cho cả hai trục, không cắt không đệm.\n' +
            "  if (fit === 'inside' || fit === 'outside') {\n" +
            "    let s = fit === 'inside' ? Math.min(tw / w, th / h) : Math.max(tw / w, th / h);\n" +
            '    if (khongPhongTo && s > 1) s = 1;\n' +
            '    return { rong: Math.round(w * s), cao: Math.round(h * s) };\n' +
            '  }\n\n' +
            '  // contain: canvas luôn đúng kích thước xin, phần thiếu là nền —\n' +
            '  // withoutEnlargement không đụng tới nó (đo thật).\n' +
            "  if (fit === 'contain') return { rong: tw, cao: th };\n\n" +
            '  // cover: ra đúng khung, nhưng withoutEnlargement kẹp TỪNG TRỤC.\n' +
            '  if (khongPhongTo) return { rong: Math.min(tw, w), cao: Math.min(th, h) };\n' +
            '  return { rong: tw, cao: th };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — EXIF Orientation 1–8, and what a missing <code>.rotate()</code> writes into your database (chapter 1).</b> Implement two functions.</p>' +
            '<p><code>phepBien(orientation)</code> returns <code>{ lat, xoay }</code> — whether the image must be mirrored horizontally, and how many degrees clockwise it must then be turned. The eight values were verified pixel by pixel against <code>sharp().rotate()</code> on a deliberately asymmetric 4×3 image; <b>5 and 7 are not the pair most people guess</b>. Any missing or unknown value means <code>{ lat: false, xoay: 0 }</code>.</p>' +
            '<p><code>ketQua(anh)</code> takes <code>{ ten, orientation, rong, cao }</code> — <code>rong</code>/<code>cao</code> are the STORED pixels — and returns</p>' +
            code('{ lat, xoay, hienThi, coRotate, quenRotate, sai }') +
            '<ul>' +
            '<li><code>hienThi</code> — the dimensions a correct viewer shows: the axes swap when and only when <code>xoay</code> is 90 or 270.</li>' +
            '<li><code>coRotate</code> — <code>hienThi</code> after the pipeline\'s width cap: if the width exceeds <code>TRAN_RONG</code>, scale both axes by <code>TRAN_RONG / width</code> and <code>Math.round</code> the height; otherwise leave it alone.</li>' +
            '<li><code>quenRotate</code> — the same cap applied to the STORED dimensions, i.e. what a pipeline that forgot <code>.rotate()</code> would store.</li>' +
            '<li><code>sai</code> — <code>true</code> when those two differ.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not <code>require(&quot;sharp&quot;)</code>.</p>',

            '<p><b>Câu 32 — EXIF Orientation 1–8, và thứ mà một lời gọi <code>.rotate()</code> bị quên ghi vào cơ sở dữ liệu của bạn (chương 1).</b> Hãy cài đặt hai hàm.</p>' +
            '<p><code>phepBien(orientation)</code> trả về <code>{ lat, xoay }</code> — ảnh có phải lật ngang không, và sau đó phải xoay bao nhiêu độ theo chiều kim đồng hồ. Tám giá trị đã được đối chiếu từng pixel với <code>sharp().rotate()</code> trên một ảnh 4×3 cố ý bất đối xứng; <b>5 và 7 không phải cặp mà phần lớn mọi người đoán</b>. Giá trị thiếu hoặc lạ thì cho <code>{ lat: false, xoay: 0 }</code>.</p>' +
            '<p><code>ketQua(anh)</code> nhận <code>{ ten, orientation, rong, cao }</code> — <code>rong</code>/<code>cao</code> là pixel ĐANG LƯU — và trả về</p>' +
            code('{ lat, xoay, hienThi, coRotate, quenRotate, sai }') +
            '<ul>' +
            '<li><code>hienThi</code> — kích thước mà một trình xem đúng đắn hiển thị: hai trục đảo chỗ khi và chỉ khi <code>xoay</code> bằng 90 hoặc 270.</li>' +
            '<li><code>coRotate</code> — <code>hienThi</code> sau khi qua trần chiều rộng của pipeline: nếu chiều rộng vượt <code>TRAN_RONG</code> thì nhân cả hai trục với <code>TRAN_RONG / chiềuRộng</code> và <code>Math.round</code> chiều cao; không vượt thì giữ nguyên.</li>' +
            '<li><code>quenRotate</code> — cũng cái trần ấy nhưng áp lên kích thước ĐANG LƯU, tức là thứ mà một pipeline quên <code>.rotate()</code> sẽ lưu lại.</li>' +
            '<li><code>sai</code> — <code>true</code> khi hai thứ đó khác nhau.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và KHÔNG <code>require(&quot;sharp&quot;)</code>.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const TRAN_RONG = 1200;\n' +
            'const ANH = [\n' +
            "  { ten: 'orient-1.jpg', orientation: 1, rong: 4032, cao: 3024 },\n" +
            "  { ten: 'orient-2.jpg', orientation: 2, rong: 4032, cao: 3024 },\n" +
            "  { ten: 'orient-3.jpg', orientation: 3, rong: 4032, cao: 3024 },\n" +
            "  { ten: 'orient-4.jpg', orientation: 4, rong: 4032, cao: 3024 },\n" +
            "  { ten: 'orient-5.jpg', orientation: 5, rong: 4032, cao: 3024 },\n" +
            "  { ten: 'orient-6.jpg', orientation: 6, rong: 4032, cao: 3024 },\n" +
            "  { ten: 'orient-7.jpg', orientation: 7, rong: 4032, cao: 3024 },\n" +
            "  { ten: 'orient-8.jpg', orientation: 8, rong: 4032, cao: 3024 },\n" +
            "  { ten: 'avatar.png',   orientation: undefined, rong: 400, cao: 400 },\n" +
            "  { ten: 'wide-o6.jpg',  orientation: 6, rong: 1000, cao: 3000 },\n" +
            "  { ten: 'tiny-o8.jpg',  orientation: 8, rong: 300,  cao: 200  },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function phepBien(orientation) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function ketQua(anh) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const a of ANH) {\n' +
            '  const r = ketQua(a);\n' +
            '  console.log(\n' +
            "    `${a.ten} o=${a.orientation ?? '-'} | ${r.lat ? 'lat' : '---'} ${String(r.xoay).padStart(3)} | ` +\n" +
            '    `hien ${r.hienThi.rong}x${r.hienThi.cao} | co-rotate ${r.coRotate.rong}x${r.coRotate.cao} | ` +\n' +
            "    `quen-rotate ${r.quenRotate.rong}x${r.quenRotate.cao} | ${r.sai ? 'SAI' : 'OK'}`,\n" +
            '  );\n' +
            '}\n',
          expectedOutput:
            'orient-1.jpg o=1 | ---   0 | hien 4032x3024 | co-rotate 1200x900 | quen-rotate 1200x900 | OK\n' +
            'orient-2.jpg o=2 | lat   0 | hien 4032x3024 | co-rotate 1200x900 | quen-rotate 1200x900 | OK\n' +
            'orient-3.jpg o=3 | --- 180 | hien 4032x3024 | co-rotate 1200x900 | quen-rotate 1200x900 | OK\n' +
            'orient-4.jpg o=4 | lat 180 | hien 4032x3024 | co-rotate 1200x900 | quen-rotate 1200x900 | OK\n' +
            'orient-5.jpg o=5 | lat 270 | hien 3024x4032 | co-rotate 1200x1600 | quen-rotate 1200x900 | SAI\n' +
            'orient-6.jpg o=6 | ---  90 | hien 3024x4032 | co-rotate 1200x1600 | quen-rotate 1200x900 | SAI\n' +
            'orient-7.jpg o=7 | lat  90 | hien 3024x4032 | co-rotate 1200x1600 | quen-rotate 1200x900 | SAI\n' +
            'orient-8.jpg o=8 | --- 270 | hien 3024x4032 | co-rotate 1200x1600 | quen-rotate 1200x900 | SAI\n' +
            'avatar.png o=- | ---   0 | hien 400x400 | co-rotate 400x400 | quen-rotate 400x400 | OK\n' +
            'wide-o6.jpg o=6 | ---  90 | hien 3000x1000 | co-rotate 1200x400 | quen-rotate 1000x3000 | SAI\n' +
            'tiny-o8.jpg o=8 | --- 270 | hien 200x300 | co-rotate 200x300 | quen-rotate 300x200 | SAI',
          sampleSolution:
            '// Bảng đã đối chiếu TỪNG PIXEL với sharp 0.35.4 trên một ảnh 4×3 bất đối\n' +
            '// xứng: LẬT NGANG TRƯỚC, rồi mới xoay theo chiều kim đồng hồ. Chỗ dễ sai là\n' +
            '// 5 và 7 — 5 là (lật, 270) chứ không phải (lật, 90).\n' +
            'const BANG = {\n' +
            '  1: { lat: false, xoay: 0 },\n' +
            '  2: { lat: true,  xoay: 0 },\n' +
            '  3: { lat: false, xoay: 180 },\n' +
            '  4: { lat: true,  xoay: 180 },\n' +
            '  5: { lat: true,  xoay: 270 },\n' +
            '  6: { lat: false, xoay: 90 },\n' +
            '  7: { lat: true,  xoay: 90 },\n' +
            '  8: { lat: false, xoay: 270 },\n' +
            '};\n\n' +
            'function phepBien(orientation) {\n' +
            '  return BANG[orientation] ?? { lat: false, xoay: 0 };\n' +
            '}\n\n' +
            'function capRong(rong, cao) {\n' +
            '  if (rong <= TRAN_RONG) return { rong, cao };\n' +
            '  const s = TRAN_RONG / rong;\n' +
            '  return { rong: TRAN_RONG, cao: Math.round(cao * s) };\n' +
            '}\n\n' +
            'function ketQua(anh) {\n' +
            '  const { lat, xoay } = phepBien(anh.orientation);\n' +
            '  const daoTruc = xoay === 90 || xoay === 270;\n' +
            '  const hienThi = daoTruc\n' +
            '    ? { rong: anh.cao, cao: anh.rong }\n' +
            '    : { rong: anh.rong, cao: anh.cao };\n\n' +
            '  const coRotate = capRong(hienThi.rong, hienThi.cao);\n' +
            '  const quenRotate = capRong(anh.rong, anh.cao);\n' +
            '  const sai = coRotate.rong !== quenRotate.rong || coRotate.cao !== quenRotate.cao;\n\n' +
            '  return { lat, xoay, hienThi, coRotate, quenRotate, sai };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
