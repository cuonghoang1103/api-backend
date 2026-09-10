/**
 * Media Processing — Progress Test 2 (chương s04–s07).
 *
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi. Đề giữa kỳ,
 * dễ hơn FE một bậc: hỏi CƠ CHẾ và những con số ỔN ĐỊNH (số byte, số segment,
 * nguyên văn thông báo lỗi, nội dung playlist), không hỏi số đo thời gian.
 *
 * ⚠️ MỌI con số, mọi đoạn terminal và mọi thông báo lỗi dưới đây đều CHẠY THẬT
 * trên đúng bộ công cụ mà đề FE đã dùng:
 *
 *   sharp 0.35.4 · libvips 8.18.6 (aom 3.15.0, webp 1.6.0, heif 1.23.2,
 *   mozjpeg 0826579) · ffmpeg 8.1.2 / ffprobe 8.1.2 (Homebrew, libx264 +
 *   libx265 + libvpx-vp9 + libopus + libmp3lame) · Node v22.21.0 ·
 *   darwin-arm64 · sharp.concurrency() = 8.
 *
 * File mẫu là file TỰ SINH trong một thư mục nháp NGOÀI repo — không đụng
 * `uploads/`, không đụng R2/CDN:
 *   • `clip-720p-10s.mp4` — 3.645.357 B, H.264 High + AAC LC, yuv420p, 30 fps;
 *   • `tone-16k-mono-5s.wav` (160.078 B) và `tone-44k-stereo-5s.wav` (882.078 B);
 *   • `tone-192k.mp3` (121.670 B) và `quiet.mp3` — một tone bị hạ 24 dB;
 *   • `voice.wav` — 8 giây tone có tremolo, 16 kHz mono (256.078 B);
 *   • `dyn.mp3` — một nguồn có dải động thật (LRA đo được 21,60 LU);
 *   • một bậc thang HLS ba bản dựng thật từ clip 10 giây, và một bản VOD
 *     22 giây ở `-hls_time 6`.
 *
 * ⚠️ HAI CHỖ GIÁO TRÌNH KHÁC MÁY — đã đo lại, ĐỀ THEO MÁY. Cả hai đều KHÔNG
 * nằm trong bảy chỗ mà `MEDIA-PROCESSING-FE.mjs` đã ghi:
 *
 *   • **Bài 4.2 đưa ra một luật chẩn đoán: `Normalization Type` phải đọc là
 *     `linear` khi có truyền các giá trị đo, và thấy `dynamic` trong một lượt
 *     hai pass nghĩa là "các giá trị đo vẫn chưa tới được bộ lọc".** Đo thật
 *     trên ffmpeg 8.1.2 thì luật đó SAI theo chiều báo động giả. Trên `dyn.mp3`
 *     (đo được `input_lra = 21.60`), pass 2 có ĐỦ bốn giá trị `measured_*` vẫn
 *     báo **`Normalization Type: Dynamic`** khi mục tiêu là `LRA=11`; đổi đúng
 *     một thứ — mục tiêu `LRA=25`, tức là lớn hơn dải động đo được — thì cùng
 *     lệnh ấy báo **`Linear`**. Nói cách khác `dynamic` cũng xuất hiện khi dải
 *     động của NGUỒN vượt `LRA` mục tiêu, và một nguồn tone phẳng
 *     (`input_lra = 0.00`) thì báo `Dynamic` trong mọi cấu hình đã thử. Phép
 *     kiểm đáng tin vẫn là đo lại độ to của BẢN RA. Câu 8 hỏi đúng chỗ này.
 *
 *   • **Bài 4.1 nói một MP4 có `moov` ở cuối đọc từ `pipe:0` sẽ báo
 *     `Invalid data found when processing input`.** Đo thật trên ffmpeg 8.1.2
 *     thì thông báo là **`stream 0, offset 0x30: partial file`** (rồi
 *     `Last message repeated 1 times`). Kết luận của bài không đổi — cùng file
 *     ấy với `moov` ở ĐẦU thì đọc qua `pipe:0` chạy ngon và trả về một JPEG
 *     62.372 B — nhưng chuỗi để `grep` trong log thì khác. Câu 5 dùng nguyên
 *     văn của máy.
 *
 * ⚠️ NHỮNG SỐ ĐO ĐÃ TRÁNH RA ĐỀ (không ổn định hoặc không tái hiện được):
 *   • **Mọi phép đo THỜI GIAN.** Máy này đang chạy nhiều agent khác. Không có
 *     một con số mili-giây nào trong đề; chỗ nào giáo trình nói bằng thời gian
 *     (81 s so với 19 s của preset, 4,3× thông lượng, 2,7× CPU của HLS) thì câu
 *     hỏi chuyển sang hỏi CƠ CHẾ hoặc hỏi số byte và số object.
 *   • **Tỉ lệ byte của một lượt encode có mất dữ liệu so với công thức.** Đo
 *     thật 8 giây tiếng nói ở `-b:a 24k` bằng libopus: công thức
 *     `bitrate ÷ 8 × giây` cho 24.000 B còn file ra 28.768 B (VBR cộng phần bọc
 *     container Ogg). Vì thế câu 31 gọi thẳng con số ấy là ƯỚC LƯỢNG, và không
 *     câu trắc nghiệm nào bắt đối chiếu byte của một file đã nén với công thức
 *     — chỉ phần PCM, thứ khớp chính xác tới từng byte, mới được đem ra hỏi.
 *   • **`-tune zerolatency` "tốn thêm 10–15% byte"**: trên nguồn tổng hợp của
 *     tôi nó tốn thêm 80% (613.144 B so với 340.248 B). Nguồn tổng hợp chuyển
 *     động mạnh không đại diện ⇒ không ra đề theo con số ấy.
 *   • **`EXT-X-ENDLIST` khi bỏ `-hls_playlist_type vod`**: FE đã ghi nhận rằng
 *     ffmpeg 8.1.2 vẫn ghi `ENDLIST` trong cả hai trường hợp. Đề PT2 không ra
 *     câu nào dựa vào việc thiếu `ENDLIST`; hệ quả THẬT của việc bỏ cờ đó được
 *     đo trên một nguồn dài hơn và để dành cho PT3.
 *   • Dữ kiện phía trình duyệt và giá dịch vụ (hls.js, thuộc tính `<video>`,
 *     giá R2/S3, mốc LUFS của Spotify) là dữ kiện TRÍCH DẪN, không đo được ở
 *     đây — những câu chạm tới chúng đều hỏi cơ chế hoặc hỏi nửa đo được.
 *
 * Phân bố câu theo chương:
 *   s04 âm thanh .................. 8   (q1–q8)
 *   s05 đường ống upload .......... 8   (q9–q16)
 *   s06 chi phí ................... 7   (q17–q23)
 *   s07 streaming ................. 7   (q24–q30)
 *   2 câu lập trình ............... q31 (ngân sách âm thanh) · q32 (số học HLS)
 *
 * Phân bố vị trí đáp án — 28 câu một đáp án + 2 câu "chọn HAI" = 32 lượt chọn,
 * chia A 8 · B 8 · C 8 · D 8. Kiểm bằng:
 *   node -e "import('./content/exams/MEDIA-PROCESSING-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MEDIA-PROCESSING-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/media-exam-kit.mjs';

export default {
  course: { slug: 'media-processing' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 4–7 (audio, the upload pipeline, cost, streaming)',
        'Kiểm tra tiến độ 2 — Chương 4–7 (âm thanh, đường ống upload, chi phí, streaming)',
      ),
      description: B(
        'Second third of the Media Processing course: piping instead of temp files, loudness normalization and the bug that made it do nothing, one door for every upload, key design, what CPU actually costs on a fixed VPS, and when a plain MP4 beats HLS. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba giữa của khoá Media Processing: chảy dòng qua pipe thay vì file tạm, chuẩn hoá độ to và con bug khiến nó không làm gì, một cửa vào duy nhất cho mọi upload, thiết kế key, CPU thật sự tốn bao nhiêu trên một VPS cố định, và khi nào một file MP4 thường thắng HLS. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '4–7'),
      questions: [
        // ── Chương 4 — Âm thanh ─────────────────────────────────────────
        mcq({
          prompt: B(
            'Five 5-second PCM files written by ffmpeg and measured on disk:' + code(
              ' 8 kHz mono     →  80.078 B\n' +
              '16 kHz mono     → 160.078 B\n' +
              '24 kHz mono     → 240.078 B\n' +
              '44,1 kHz stereo → 882.078 B\n' +
              '48 kHz stereo   → 960.078 B',
            ) + 'A voice-note feature currently records at 44,1 kHz stereo. A reviewer proposes 16 kHz mono. What is the argument, and what is the honest limit of it?',
            'Năm file PCM 5 giây do ffmpeg ghi ra và đo trên đĩa:' + code(
              ' 8 kHz mono     →  80.078 B\n' +
              '16 kHz mono     → 160.078 B\n' +
              '24 kHz mono     → 240.078 B\n' +
              '44,1 kHz stereo → 882.078 B\n' +
              '48 kHz stereo   → 960.078 B',
            ) + 'Một tính năng ghi âm giọng nói đang thu ở 44,1 kHz stereo. Một người review đề xuất 16 kHz mono. Lập luận là gì, và giới hạn thật thà của lập luận ấy nằm ở đâu?',
          ),
          options: [
            B(
              'The table shows the constant 78-byte overhead dominates at low rates, so the real saving is smaller than it looks and the change is only worth making above about 30 seconds of audio',
              'Bảng này cho thấy phần dôi 78 byte cố định chi phối ở các tần số thấp, nên phần tiết kiệm thật nhỏ hơn vẻ ngoài và thay đổi chỉ đáng làm với âm thanh dài hơn chừng 30 giây',
            ),
            B(
              'Halving the sample rate halves the bytes and halves the bandwidth, and the reviewer is proposing two halvings at once — the limit is that the ear notices the second one, so mono is the risky half of the change',
              'Giảm một nửa tần số lấy mẫu thì giảm một nửa số byte và giảm một nửa băng thông, và người review đang đề xuất hai lần giảm nửa cùng lúc — giới hạn là tai người nhận ra lần giảm thứ hai, nên chuyển sang mono mới là nửa rủi ro của thay đổi này',
            ),
            B(
              'A sample rate of N can represent frequencies up to N/2, and human speech has almost no energy above 8 kHz — so 16 kHz captures essentially all of a voice while 44,1 kHz stereo stores 5,5× the bytes for content that is not in the signal. The limit: this is a claim about VOICE, and the same change applied to music throws away half the audible band',
              'Một tần số lấy mẫu N biểu diễn được tần số tới N/2, và tiếng nói con người gần như không có năng lượng trên 8 kHz — nên 16 kHz thu được gần trọn một giọng nói trong khi 44,1 kHz stereo lưu gấp 5,5 lần số byte cho phần nội dung không hề có trong tín hiệu. Giới hạn: đây là khẳng định về GIỌNG NÓI, và cũng thay đổi ấy áp lên nhạc là vứt đi nửa dải nghe được',
            ),
            B(
              '16 kHz is what speech-recognition models expect, so the argument is purely about the downstream consumer — in bytes the change is neutral, because a lower sample rate is compensated by a higher bitrate once the file is encoded',
              '16 kHz là thứ các mô hình nhận dạng tiếng nói mong đợi, nên lập luận thuần tuý nằm ở phía tiêu thụ — xét về byte thì thay đổi này trung tính, vì tần số lấy mẫu thấp hơn sẽ được bù bằng bitrate cao hơn khi file được nén',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Nyquist is the whole argument and the numbers line up with it exactly: every row is <code>rate × 2 × channels × 5</code> plus a fixed 78-byte header, so the ratio is a property of the three knobs and nothing else. The repo pins 16 kHz for its robot voice for a second reason worth knowing — the speech model on the way in and the speaker on the way out both want that rate, so nothing has to be resampled — and the corresponding trap is the reverse direction: upsampling a 16 kHz recording to 44,1 kHz invents nothing while multiplying the bytes by 2,75, exactly like upscaling an image.',
            'Nyquist là toàn bộ lập luận và các con số khớp với nó chính xác: dòng nào cũng bằng <code>tần số × 2 × số kênh × 5</code> cộng một header cố định 78 byte, nên tỉ lệ là thuộc tính của ba cái núm vặn chứ không của gì khác. Kho này ghim 16 kHz cho giọng robot vì một lý do thứ hai đáng biết — mô hình tiếng nói ở đầu vào và cái loa ở đầu ra đều muốn đúng tần số ấy, nên chẳng có gì phải lấy mẫu lại — và cái bẫy tương ứng nằm ở chiều ngược lại: nâng một bản thu 16 kHz lên 44,1 kHz chẳng tạo ra thông tin nào mà lại nhân số byte lên 2,75 lần, y hệt việc phóng to một tấm ảnh.',
          ),
        }),

        mcq({
          prompt: B(
            'The repo tries two MP3 decoders in a fixed order, and the comment explains the ordering:' + code(
              'const DECODERS = [\n' +
              "  { bin: 'mpg123', args: (r) => ['-q','--mono','-r',String(r),'-s','-'] },\n" +
              "  { bin: 'ffmpeg', args: (r) => ['-i','pipe:0','-f','s16le','-ac','1','-ar',String(r),'pipe:1'] },\n" +
              ']\n' +
              '\n' +
              'node:22-alpine        ~140 MB\n' +
              '  + ffmpeg (full)     ~220 MB   (+80 MB)\n' +
              '  + mpg123 only     ~141,5 MB   (+1,5 MB)',
            ) + 'What is the ordering buying, and what does it cost?',
            'Kho này thử hai bộ giải mã MP3 theo một thứ tự cố định, và comment giải thích thứ tự ấy:' + code(
              'const DECODERS = [\n' +
              "  { bin: 'mpg123', args: (r) => ['-q','--mono','-r',String(r),'-s','-'] },\n" +
              "  { bin: 'ffmpeg', args: (r) => ['-i','pipe:0','-f','s16le','-ac','1','-ar',String(r),'pipe:1'] },\n" +
              ']\n' +
              '\n' +
              'node:22-alpine        ~140 MB\n' +
              '  + ffmpeg (đầy đủ)   ~220 MB   (+80 MB)\n' +
              '  + chỉ mpg123      ~141,5 MB   (+1,5 MB)',
            ) + 'Thứ tự ấy mua về cái gì, và tốn cái gì?',
          ),
          options: [
            B(
              'It buys speed, because mpg123 decodes MP3 several times faster than ffmpeg — and it costs correctness on unusual bitrates, which is why ffmpeg stays in the list as a fallback for files mpg123 refuses',
              'Nó mua về tốc độ, vì mpg123 giải mã MP3 nhanh hơn ffmpeg vài lần — và cái giá là sai lệch với những bitrate lạ, đó là lý do ffmpeg vẫn nằm trong danh sách để dự phòng cho những file mpg123 từ chối',
            ),
            B(
              'It buys 78,5 MB off every image pull and every deploy, because production installs only mpg123 while a developer machine almost always has ffmpeg and rarely has mpg123 — and it costs the fact that production and development then run DIFFERENT decoders, an assumption about byte-comparable output that is worth testing rather than assuming',
              'Nó mua về 78,5 MB tiết kiệm ở mỗi lượt kéo ảnh và mỗi lần deploy, vì production chỉ cài mpg123 còn máy lập trình viên thì gần như luôn có ffmpeg và hiếm khi có mpg123 — và cái giá là production với development chạy HAI bộ giải mã KHÁC NHAU, một giả định về việc đầu ra so được từng byte mà đáng kiểm chứ không nên mặc nhiên tin',
            ),
            B(
              'It buys a smaller attack surface, because mpg123 parses only MP3 while ffmpeg exposes dozens of demuxers to attacker-controlled bytes — and it costs nothing measurable, since the image size difference is amortised by layer caching',
              'Nó mua về một bề mặt tấn công nhỏ hơn, vì mpg123 chỉ phân tích MP3 còn ffmpeg phơi hàng chục demuxer ra trước đám byte do kẻ tấn công điều khiển — và nó chẳng tốn gì đo được, vì chênh lệch kích thước ảnh được cache tầng bù lại',
            ),
            B(
              'It buys nothing on its own: the order only matters for the first request, after which the working decoder is memoised — and it costs one wasted ENOENT spawn per process start, which is the reason the memoisation exists',
              'Riêng nó thì chẳng mua gì: thứ tự chỉ quan trọng ở lượt request đầu tiên, sau đó bộ giải mã chạy được sẽ được ghi nhớ — và cái giá là một lượt spawn ENOENT lãng phí mỗi lần khởi động tiến trình, đó chính là lý do việc ghi nhớ tồn tại',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A container-size decision written down where the next person will find it. Option D describes something the file genuinely does — a module-level <code>chosen</code> means only the first call pays for the missing binary — but that is the mechanism, not the reason for the order. Option C names a real security benefit that the comment does not claim, and its second half is wrong: 78,5 MB is 78,5 MB on every pull. The cost the comment DOES name is the one worth carrying: two environments, two decoders, and "both emit signed 16-bit PCM at the requested rate so the output is byte-comparable" is an assumption you should have a test for.',
            'Một quyết định về kích thước container được ghi lại đúng chỗ người sau sẽ tìm thấy. Lựa chọn D mô tả một thứ mà file này thật sự làm — một biến <code>chosen</code> ở cấp module khiến chỉ lượt gọi đầu tiên phải trả giá cho tệp nhị phân vắng mặt — nhưng đó là CƠ CHẾ, không phải LÝ DO của thứ tự. Lựa chọn C gọi tên một lợi ích bảo mật có thật mà comment không hề khẳng định, và nửa sau của nó thì sai: 78,5 MB vẫn là 78,5 MB ở mỗi lượt kéo ảnh. Cái giá mà comment CÓ nêu mới là thứ đáng mang theo: hai môi trường, hai bộ giải mã, và câu "cả hai đều phát ra PCM 16 bit có dấu ở đúng tần số yêu cầu nên đầu ra so được từng byte" là một giả định mà bạn nên có một bài test cho nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Decoding MP3 to PCM and re-encoding to Opus, with no intermediate file and no intermediate Buffer:' + code(
              "const decoder = spawn('mpg123', ['-q','--mono','-r','48000','-s','-'])\n" +
              "const encoder = spawn('ffmpeg', ['-f','s16le','-ar','48000','-ac','1','-i','pipe:0',\n" +
              "                                 '-c:a','libopus','-b:a','24k','-f','ogg','pipe:1'])\n" +
              '\n' +
              'decoder.stdout.pipe(encoder.stdin)\n' +
              'decoder.stdin.end(mp3Buffer)\n' +
              "encoder.stdout.on('data', (c) => chunks.push(c))\n" +
              'decoder.stderr.resume()\n' +
              'encoder.stderr.resume()',
            ) + 'Why are the last two lines there, and what does the <code>.pipe()</code> change about memory?',
            'Giải mã MP3 thành PCM rồi encode lại sang Opus, không file trung gian và không Buffer trung gian:' + code(
              "const decoder = spawn('mpg123', ['-q','--mono','-r','48000','-s','-'])\n" +
              "const encoder = spawn('ffmpeg', ['-f','s16le','-ar','48000','-ac','1','-i','pipe:0',\n" +
              "                                 '-c:a','libopus','-b:a','24k','-f','ogg','pipe:1'])\n" +
              '\n' +
              'decoder.stdout.pipe(encoder.stdin)\n' +
              'decoder.stdin.end(mp3Buffer)\n' +
              "encoder.stdout.on('data', (c) => chunks.push(c))\n" +
              'decoder.stderr.resume()\n' +
              'encoder.stderr.resume()',
            ) + 'Hai dòng cuối để làm gì, và <code>.pipe()</code> thay đổi điều gì về bộ nhớ?',
          ),
          options: [
            B(
              'They are there because BOTH children can deadlock on an unread stderr, not just the one you happen to be reading from — and <code>.pipe()</code> moves the PCM through in chunks, so the decoded audio never exists as a whole and peak memory drops from roughly the size of the PCM to roughly the size of the in-flight buffers',
              'Chúng có ở đó vì CẢ HAI tiến trình con đều có thể bế tắc trên một stderr không ai đọc, không riêng cái mà bạn tình cờ đang đọc — và <code>.pipe()</code> đẩy đám PCM đi theo từng mẩu, nên phần âm thanh đã giải mã không bao giờ tồn tại nguyên khối và bộ nhớ đỉnh tụt từ cỡ kích thước PCM xuống cỡ kích thước các mẩu đang trên đường',
            ),
            B(
              'They flush the two stderr streams so the error messages arrive in order, and <code>.pipe()</code> changes nothing about memory — the PCM is still buffered by Node between the two processes, which is what makes the chain reliable',
              'Chúng xả hai luồng stderr để thông báo lỗi tới đúng thứ tự, còn <code>.pipe()</code> không đổi gì về bộ nhớ — đám PCM vẫn được Node gom lại giữa hai tiến trình, và chính điều đó làm cho chuỗi này đáng tin',
            ),
            B(
              'They stop the two children inheriting the parent\'s stderr and interleaving their output, and <code>.pipe()</code> halves memory because only one of the two processes holds a decoded buffer at a time',
              'Chúng ngăn hai tiến trình con thừa hưởng stderr của tiến trình cha và trộn lẫn đầu ra, còn <code>.pipe()</code> giảm một nửa bộ nhớ vì tại một thời điểm chỉ một trong hai tiến trình giữ một buffer đã giải mã',
            ),
            B(
              'They are defensive only: <code>.pipe()</code> already drains everything the decoder writes, so the decoder\'s <code>resume()</code> is redundant and only the encoder\'s is load-bearing',
              'Chúng chỉ mang tính phòng thủ: <code>.pipe()</code> vốn đã rút cạn mọi thứ bộ giải mã ghi ra, nên <code>resume()</code> của bộ giải mã là thừa và chỉ cái của bộ encode mới chịu lực',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Option D is the tempting one and it confuses two different pipes: <code>.pipe()</code> drains <code>stdout</code>, and each child has its own <code>stderr</code> with its own kernel buffer — leave either unread and that child blocks on a write nobody is reading, halfway through a chain. The memory claim is the reason to build it this way at all: the course measured the same 5-minute MP3 three ways, and the streamed chain held only the in-flight chunks while the buffered version held the whole decoded PCM. Option B has the mechanism backwards: <code>.pipe()</code> exists precisely so Node does NOT hold the data.',
            'Lựa chọn D là cái hấp dẫn và nó nhầm lẫn hai cái pipe khác nhau: <code>.pipe()</code> rút cạn <code>stdout</code>, còn mỗi tiến trình con có <code>stderr</code> riêng với bộ đệm nhân riêng — để một trong hai không ai đọc thì tiến trình ấy chặn ở một lệnh ghi không ai đọc, ngay giữa chuỗi. Còn phần khẳng định về bộ nhớ mới là lý do người ta dựng chuỗi kiểu này: giáo trình đã đo cùng một file MP3 dài 5 phút theo ba cách, và chuỗi chảy dòng chỉ giữ những mẩu đang trên đường trong khi bản gom buffer giữ trọn đám PCM đã giải mã. Lựa chọn B hiểu ngược cơ chế: <code>.pipe()</code> tồn tại chính là để Node KHÔNG phải giữ dữ liệu.',
          ),
        }),

        mcq({
          prompt: B(
            'Two details in the repo\'s decoder wrapper:' + code(
              'let settled = false\n' +
              'const done = (e, buf) => { if (settled) return; settled = true; e ? reject(e) : resolve(buf) }\n' +
              '…\n' +
              'const timer = setTimeout(() => {\n' +
              "  ff.kill('SIGKILL')\n" +
              "  done(new Error(`${dec.bin} quá hạn 15s`))\n" +
              '}, 15_000)',
            ) + 'Why <code>settled</code>, and why SIGKILL rather than SIGTERM?',
            'Hai chi tiết trong lớp bọc của bộ giải mã trong kho:' + code(
              'let settled = false\n' +
              'const done = (e, buf) => { if (settled) return; settled = true; e ? reject(e) : resolve(buf) }\n' +
              '…\n' +
              'const timer = setTimeout(() => {\n' +
              "  ff.kill('SIGKILL')\n" +
              "  done(new Error(`${dec.bin} quá hạn 15s`))\n" +
              '}, 15_000)',
            ) + 'Vì sao cần <code>settled</code>, và vì sao SIGKILL chứ không phải SIGTERM?',
          ),
          options: [
            B(
              '<code>settled</code> because a Promise throws if you resolve it twice; SIGKILL because SIGTERM is not delivered to processes started by <code>spawn</code> without a shell',
              '<code>settled</code> vì một Promise sẽ ném lỗi nếu bạn resolve nó hai lần; SIGKILL vì SIGTERM không được gửi tới tiến trình khởi động bằng <code>spawn</code> mà không qua shell',
            ),
            B(
              '<code>settled</code> to make the function synchronous-safe when two callers share one decoder instance; SIGKILL to make sure temp files are removed, since SIGTERM lets the child clean up and it might delete the output',
              '<code>settled</code> để hàm an toàn khi hai bên gọi cùng dùng chung một instance giải mã; SIGKILL để chắc chắn file tạm bị xoá, vì SIGTERM cho phép tiến trình con dọn dẹp và nó có thể xoá mất bản ra',
            ),
            B(
              '<code>settled</code> because <code>&quot;error&quot;</code> and <code>&quot;close&quot;</code> can BOTH fire — settling a Promise twice is a silent no-op, but the surrounding retry loop and timer would run twice; SIGKILL because a child wedged in a native loop can ignore SIGTERM, and the whole point of a timeout is that it fires no matter what',
              '<code>settled</code> vì <code>&quot;error&quot;</code> và <code>&quot;close&quot;</code> đều CÓ THỂ cùng nổ — resolve một Promise lần thứ hai là lệnh rỗng im lặng, nhưng vòng lặp thử lại và cái timer bao quanh thì sẽ chạy hai lần; SIGKILL vì một tiến trình con kẹt trong vòng lặp gốc có thể phớt lờ SIGTERM, mà cả ý nghĩa của một timeout là nó phải nổ bằng mọi giá',
            ),
            B(
              'Neither is necessary on modern Node: <code>close</code> subsumes <code>error</code> since v18, and <code>kill()</code> escalates to SIGKILL automatically after a grace period',
              'Cả hai đều không cần thiết trên Node hiện đại: <code>close</code> đã bao gồm <code>error</code> từ v18, và <code>kill()</code> tự leo thang lên SIGKILL sau một khoảng ân hạn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A double <code>resolve</code> is harmless to the Promise and dangerous to everything around it — a retry loop that runs twice, a slot released twice, a metric counted twice. And SIGTERM is a request; SIGKILL is not. Use SIGTERM when you want the child to flush and exit cleanly, and SIGKILL when the reason you are killing it is that it has stopped responding to requests.',
            'Gọi <code>resolve</code> hai lần thì vô hại với Promise và nguy hiểm với mọi thứ xung quanh nó — một vòng lặp thử lại chạy hai lượt, một suất bị nhả hai lần, một chỉ số bị đếm hai lượt. Còn SIGTERM là một LỜI ĐỀ NGHỊ; SIGKILL thì không. Dùng SIGTERM khi bạn muốn tiến trình con xả bộ đệm rồi thoát sạch sẽ, và dùng SIGKILL khi chính lý do bạn giết nó là vì nó đã ngừng đáp lời đề nghị.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 4.1 says an MP4 with its index at the end, read from <code>pipe:0</code>, fails with <code>Invalid data found when processing input</code>. Run on ffmpeg 8.1.2:' + code(
              'cat front.mp4 | ffmpeg -i pipe:0 -frames:v 1 …  → OK, 62.372 B JPEG\n' +
              'cat end.mp4   | ffmpeg -i pipe:0 -frames:v 1 …  →\n' +
              '  [in#0/mov,mp4,…] stream 0, offset 0x30: partial file\n' +
              '  Last message repeated 1 times\n' +
              '\n' +
              'both files: complete on disk, 3.645.357 B each',
            ) + 'Choose <b>TWO</b> statements this measurement supports.',
            'Bài 4.1 nói một file MP4 có chỉ mục ở cuối, đọc từ <code>pipe:0</code>, sẽ hỏng với <code>Invalid data found when processing input</code>. Chạy thật trên ffmpeg 8.1.2:' + code(
              'cat front.mp4 | ffmpeg -i pipe:0 -frames:v 1 …  → OK, JPEG 62.372 B\n' +
              'cat end.mp4   | ffmpeg -i pipe:0 -frames:v 1 …  →\n' +
              '  [in#0/mov,mp4,…] stream 0, offset 0x30: partial file\n' +
              '  Last message repeated 1 times\n' +
              '\n' +
              'cả hai file: nguyên vẹn trên đĩa, mỗi file 3.645.357 B',
            ) + 'Chọn <b>HAI</b> phát biểu mà phép đo này chứng minh.',
          ),
          options: [
            B(
              'The conclusion of the lesson holds but the STRING does not: on this build the message is "partial file", so a log filter, an alert or an <code>isRetryable()</code> regex written against the book\'s wording silently never matches',
              'Kết luận của bài học thì đúng nhưng CHUỖI thì không: trên bản dựng này thông báo là "partial file", nên một bộ lọc log, một cảnh báo hay một regex trong <code>isRetryable()</code> viết theo đúng câu chữ của sách sẽ âm thầm không bao giờ khớp',
            ),
            B(
              'The word "partial" describes what FFmpeg can REACH, not what is on disk — both files are complete, so an operator who reads this message as a truncated upload will go looking for a bug that does not exist',
              'Chữ "partial" mô tả thứ FFmpeg VỚI TỚI ĐƯỢC, không mô tả thứ nằm trên đĩa — cả hai file đều nguyên vẹn, nên một người vận hành đọc thông báo này thành "upload bị cắt cụt" sẽ đi tìm một con bug không tồn tại',
            ),
            B(
              'The difference between the two rows is the pipe buffer: <code>end.mp4</code> needs more than 64 KB of lookahead to find its index, so raising <code>-probesize</code> makes both rows succeed',
              'Khác biệt giữa hai dòng nằm ở bộ đệm pipe: <code>end.mp4</code> cần nhìn trước hơn 64 KB mới tìm thấy chỉ mục của nó, nên nâng <code>-probesize</code> lên sẽ làm cả hai dòng thành công',
            ),
            B(
              'Adding <code>-movflags +faststart</code> to this READING command fixes row two, since it tells FFmpeg to expect the index at the front of the stream it is handed',
              'Thêm <code>-movflags +faststart</code> vào câu lệnh ĐỌC này sẽ sửa được dòng hai, vì nó bảo FFmpeg mong đợi chỉ mục nằm ở đầu luồng mà nó được đưa',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Two lessons, and only one of them is about MP4. The mechanical one is well covered elsewhere in the course. The one this transcript adds is about quoting error strings: a message is an implementation detail of a version, and anything you match against it — a retry classifier, a log alert, a support runbook — has to be re-derived on the build you actually ship. <code>+faststart</code> is an output muxer flag and can do nothing while reading someone else\'s file, and <code>-probesize</code> raises how much FFmpeg will read looking for streams, which does not help when the bytes it needs are at the other end of a one-way stream.',
            'Hai bài học, và chỉ một trong hai nói về MP4. Bài học cơ học thì các chỗ khác trong khoá đã phủ kỹ. Bài mà đoạn transcript này thêm vào là về việc TRÍCH DẪN chuỗi lỗi: một thông báo là chi tiết cài đặt của một phiên bản, và bất cứ thứ gì bạn đem khớp với nó — một bộ phân loại thử lại, một cảnh báo log, một cuốn sổ tay hỗ trợ — đều phải được dựng lại trên đúng bản dựng mà bạn ship. <code>+faststart</code> là cờ của muxer ĐẦU RA và chẳng làm được gì trong lúc đọc file của người khác, còn <code>-probesize</code> chỉ nâng lượng dữ liệu FFmpeg chịu đọc để dò luồng, thứ không cứu được khi những byte nó cần nằm ở đầu kia của một luồng chảy một chiều.',
          ),
        }),

        mcq({
          prompt: B(
            'Writing, rather than reading, an MP4 over a pipe:' + code(
              'ffmpeg -i clip.mp4 -c copy -f mp4 pipe:1 > out.mp4\n' +
              '  exit 234 · 0 bytes written\n' +
              '  [mp4 @ 0x…] muxer does not support non seekable output\n' +
              '\n' +
              'ffmpeg -i clip.mp4 -c copy -f mp4 -movflags frag_keyframe+empty_moov pipe:1 > out.mp4\n' +
              '  exit 0 · 3.641.059 bytes written',
            ) + 'What did the second flag change?',
            'Việc GHI — chứ không phải đọc — một file MP4 qua pipe:' + code(
              'ffmpeg -i clip.mp4 -c copy -f mp4 pipe:1 > out.mp4\n' +
              '  exit 234 · ghi ra 0 byte\n' +
              '  [mp4 @ 0x…] muxer does not support non seekable output\n' +
              '\n' +
              'ffmpeg -i clip.mp4 -c copy -f mp4 -movflags frag_keyframe+empty_moov pipe:1 > out.mp4\n' +
              '  exit 0 · ghi ra 3.641.059 byte',
            ) + 'Cờ thứ hai đã thay đổi điều gì?',
          ),
          options: [
            B(
              'It disabled the index entirely, producing a headerless raw stream that only FFmpeg can read back',
              'Nó tắt hẳn chỉ mục, tạo ra một luồng thô không header mà chỉ FFmpeg mới đọc lại được',
            ),
            B(
              'It buffered the whole output in memory so the muxer could seek within the buffer instead of within the pipe, which is why the byte count is slightly smaller',
              'Nó gom cả bản ra vào bộ nhớ để muxer tua được bên trong bộ đệm thay vì bên trong pipe, đó là lý do số byte nhỏ hơn một chút',
            ),
            B(
              'It switched the output to a FRAGMENTED MP4: instead of one index written at the end after seeking back, the file becomes a series of self-describing fragments, each starting at a keyframe — so the muxer only ever writes forward',
              'Nó chuyển bản ra sang MP4 PHÂN MẢNH: thay vì một chỉ mục duy nhất ghi ở cuối sau khi tua ngược lại, file trở thành một chuỗi mảnh tự mô tả, mỗi mảnh bắt đầu bằng một frame khoá — nên muxer chỉ ghi tiến về phía trước',
            ),
            B(
              'It made FFmpeg fall back to the Matroska muxer, which supports non-seekable output; the <code>.mp4</code> extension on the redirect target is now misleading',
              'Nó khiến FFmpeg lùi về muxer Matroska, thứ hỗ trợ đầu ra không tua được; phần mở rộng <code>.mp4</code> của file nhận chuyển hướng giờ là gây hiểu nhầm',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A plain MP4 muxer writes the payload, then computes the <code>moov</code> index, then seeks back to place it — which a pipe forbids, hence exit 234 and zero bytes. Fragmented MP4 removes the need to seek by making every fragment carry its own small index. The cost is a little size and a format some older players handle poorly; the gain is that the output becomes a stream, which is also what makes MP4 usable for live delivery. Note that a genuine muxer swap would change the byte count far more than 4.298 B.',
            'Một muxer MP4 thường ghi phần tải trọng, rồi tính chỉ mục <code>moov</code>, rồi TUA NGƯỢC về để đặt nó vào — điều mà một pipe cấm, nên mới có exit 234 và 0 byte. MP4 phân mảnh bỏ được nhu cầu tua bằng cách cho mỗi mảnh mang chỉ mục nhỏ của riêng nó. Cái giá là dôi ra một chút kích thước và một số player cũ xử lý kém; cái được là bản ra trở thành một luồng chảy, và đó cũng chính là thứ khiến MP4 dùng được cho phát trực tiếp. Để ý thêm rằng một lần đổi muxer thật sự sẽ làm số byte lệch nhiều hơn 4.298 B rất nhiều.',
          ),
        }),

        mcq({
          prompt: B(
            'The repo targets <code>I=-14 LUFS</code>, <code>TP=-1,5 dBTP</code>, <code>LRA=11 LU</code>, all overridable by env. Two of those three numbers are worth being able to defend. Which explanation is right?',
            'Kho này đặt mục tiêu <code>I=-14 LUFS</code>, <code>TP=-1,5 dBTP</code>, <code>LRA=11 LU</code>, cả ba đều đổi được bằng biến môi trường. Hai trong ba con số ấy đáng để bạn bảo vệ được. Cách giải thích nào đúng?',
          ),
          options: [
            B(
              '-14 LUFS is where Spotify, YouTube and Amazon Music converged, so matching it means your library plays at the same volume as the rest of a listener\'s day; -1,5 dBTP rather than 0 leaves headroom because a lossy codec reconstructs a waveform that can overshoot the original samples, so an MP3 clips on playback even when the PCM never did',
              '-14 LUFS là chỗ Spotify, YouTube và Amazon Music cùng hội tụ về, nên khớp với nó nghĩa là thư viện của bạn phát ra cùng độ to với phần còn lại trong ngày của người nghe; -1,5 dBTP thay vì 0 chừa lại khoảng dự trữ vì một codec có mất dữ liệu tái tạo một dạng sóng có thể vượt quá các mẫu gốc, nên một file MP3 vẫn xén đỉnh lúc phát dù đám PCM chưa từng xén',
            ),
            B(
              '-14 LUFS is the loudest level at which 16-bit audio stays free of quantisation noise, and -1,5 dBTP is the standard analogue headroom that broadcast desks reserve for the transmitter chain',
              '-14 LUFS là mức to nhất mà âm thanh 16 bit còn sạch nhiễu lượng tử hoá, còn -1,5 dBTP là khoảng dự trữ tương tự tiêu chuẩn mà bàn phát sóng chừa lại cho chuỗi máy phát',
            ),
            B(
              '-14 LUFS is a per-track average that the filter enforces sample by sample, and -1,5 dBTP is what stops the gain from ever exceeding 1,5 dB in either direction on any single sample',
              '-14 LUFS là trung bình theo từng bài mà bộ lọc thi hành trên từng mẫu, còn -1,5 dBTP là thứ ngăn mức gain vượt quá 1,5 dB theo bất kỳ chiều nào trên bất kỳ mẫu đơn lẻ nào',
            ),
            B(
              'Both come from EBU R128 unchanged: the standard specifies -14 LUFS for streaming and -1,5 dBTP as its true-peak ceiling, which is why every platform quotes the same pair',
              'Cả hai đến thẳng từ EBU R128 không đổi: chuẩn ấy quy định -14 LUFS cho streaming và -1,5 dBTP làm trần true peak, đó là lý do nền tảng nào cũng dẫn cùng một cặp',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Option D is the plausible-sounding history and it is wrong in a way worth knowing: EBU R128 is a BROADCAST standard and its target is -23 LUFS, much quieter; -14 is where the streaming platforms independently landed, and Apple Music sits at -16. The true-peak headroom is the more interesting number because it is about a real physical effect: a decoder reconstructs a continuous waveform between the samples, and that waveform can rise above the highest sample — an inter-sample peak — so a file that measures 0 dBFS in PCM can clip audibly once it is an MP3. Note also that every one of these is an env var in this repo, which is the right shape: a target is a product decision, not a constant.',
            'Lựa chọn D là phần lịch sử nghe hợp lý mà sai theo một kiểu đáng biết: EBU R128 là chuẩn PHÁT SÓNG và mục tiêu của nó là -23 LUFS, nhỏ hơn nhiều; -14 là chỗ các nền tảng streaming độc lập cùng dừng lại, còn Apple Music thì ở -16. Khoảng dự trữ true peak mới là con số thú vị hơn vì nó nói về một hiệu ứng vật lý có thật: bộ giải mã tái tạo một dạng sóng liên tục GIỮA các mẫu, và dạng sóng ấy có thể vọt cao hơn cái mẫu cao nhất — một đỉnh liên-mẫu — nên một file đo được 0 dBFS ở dạng PCM vẫn xén đỉnh nghe thấy được khi thành MP3. Cũng để ý rằng trong kho này cả ba đều là biến môi trường, và đó là hình dạng đúng: một mục tiêu là quyết định của sản phẩm, không phải một hằng số.',
          ),
        }),

        mcq({
          prompt: B(
            'The course gives a diagnostic: "<code>Normalization Type</code> should read <code>linear</code> when measured values are supplied … seeing <code>dynamic</code> on a two-pass run means the measured values are still not reaching the filter." Measured on ffmpeg 8.1.2, on a source with real dynamics (<code>input_lra = 21.60</code>), with all four <code>measured_*</code> values supplied in pass 2:' + code(
              'target LRA=11  → Output Integrated -10.1 · Normalization Type: Dynamic\n' +
              'target LRA=25  → Output Integrated -12.8 · Normalization Type: Linear',
            ) + 'What follows?',
            'Giáo trình đưa ra một luật chẩn đoán: "<code>Normalization Type</code> phải đọc là <code>linear</code> khi có truyền các giá trị đo … thấy <code>dynamic</code> trong một lượt hai pass nghĩa là các giá trị đo vẫn chưa tới được bộ lọc." Đo thật trên ffmpeg 8.1.2, trên một nguồn có dải động thật (<code>input_lra = 21.60</code>), pass 2 có ĐỦ bốn giá trị <code>measured_*</code>:' + code(
              'mục tiêu LRA=11  → Output Integrated -10,1 · Normalization Type: Dynamic\n' +
              'mục tiêu LRA=25  → Output Integrated -12,8 · Normalization Type: Linear',
            ) + 'Kéo theo điều gì?',
          ),
          options: [
            B(
              'Only the <code>LRA=25</code> run actually supplied the measured values; the <code>LRA=11</code> run must have had a typo in one of them, which is exactly the failure the diagnostic is designed to catch',
              'Chỉ lượt <code>LRA=25</code> mới thật sự có truyền các giá trị đo; lượt <code>LRA=11</code> chắc chắn gõ sai một giá trị nào đó, và đó đúng là kiểu hỏng mà luật chẩn đoán này sinh ra để bắt',
            ),
            B(
              'The diagnostic gives false alarms: <code>dynamic</code> ALSO appears when the source\'s loudness range exceeds the target <code>LRA</code>, because a single constant gain then cannot satisfy both targets. Only one thing changed between the two runs, and it was the target — not whether the values were passed',
              'Luật chẩn đoán này báo động giả: <code>dynamic</code> CÒN xuất hiện khi dải động của nguồn vượt quá <code>LRA</code> mục tiêu, vì lúc đó một mức gain hằng số duy nhất không thoả được cả hai mục tiêu. Giữa hai lượt chỉ đúng một thứ thay đổi, và đó là MỤC TIÊU — không phải chuyện có truyền giá trị hay không',
            ),
            B(
              'The diagnostic is fine and the measurement is misleading, because <code>LRA=25</code> is outside the legal range for the filter and FFmpeg silently disabled loudness range control, which is what "Linear" reports',
              'Luật chẩn đoán vẫn ổn còn phép đo mới gây hiểu nhầm, vì <code>LRA=25</code> nằm ngoài dải hợp lệ của bộ lọc và FFmpeg đã âm thầm tắt việc kiểm soát dải động, đó chính là thứ "Linear" đang báo',
            ),
            B(
              'Nothing follows for a real pipeline: both runs hit the target, so the <code>Normalization Type</code> line is cosmetic and should be ignored entirely',
              'Chẳng kéo theo gì với một pipeline thật: cả hai lượt đều chạm mục tiêu, nên dòng <code>Normalization Type</code> chỉ là trang trí và nên bỏ qua hoàn toàn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two runs, one variable. The measured values were byte-identical in both, so the word on that line cannot be reporting whether they arrived. What it reports is which strategy the filter chose, and linear is only available when one constant gain can hit the integrated target without violating the true-peak ceiling or the loudness-range target — with <code>input_lra = 21.60</code> against <code>LRA=11</code>, it cannot. A flat tone (<code>input_lra = 0.00</code>) also reported <code>Dynamic</code> in every configuration tried. So do not build an alert on that word. The check that does work is the one the chapter ends on: re-measure the OUTPUT and expect it near the target — the properly normalised file came back at -14,2 LUFS while the fallback re-encode came back at -46,4.',
            'Hai lượt chạy, một biến thay đổi. Các giá trị đo giống hệt nhau từng byte ở cả hai lượt, nên chữ trên dòng ấy không thể đang báo chuyện chúng có tới nơi hay không. Thứ nó báo là bộ lọc đã CHỌN chiến lược nào, và linear chỉ khả dụng khi một mức gain hằng số duy nhất chạm được mục tiêu tích hợp mà không phá trần true peak lẫn mục tiêu dải động — với <code>input_lra = 21,60</code> đối đầu <code>LRA=11</code> thì không thể. Một tone phẳng (<code>input_lra = 0.00</code>) cũng báo <code>Dynamic</code> ở mọi cấu hình đã thử. Vậy đừng dựng cảnh báo trên chữ đó. Phép kiểm chạy được vẫn là thứ chương này kết lại: ĐO LẠI BẢN RA và mong nó gần mục tiêu — file được chuẩn hoá đúng cho về -14,2 LUFS còn bản encode lại theo đường dự phòng cho về -46,4.',
          ),
        }),

        // ── Chương 5 — Đường ống upload ─────────────────────────────────
        mcq({
          prompt: B(
            'The course enforces the one-door rule with two greps in CI:' + code(
              "rg -n --type ts \"from 'sharp'|require\\('sharp'\\)\" src/ | rg -v '^src/storage/'\n" +
              "rg -n --type ts 'getStorageProvider\\(\\)\\.put' src/ | rg -v '^src/storage/uploadService\\.ts'",
            ) + 'A background worker legitimately needs to write a derived file. What is the right move?',
            'Giáo trình ép luật một-cửa-vào bằng hai lệnh grep trong CI:' + code(
              "rg -n --type ts \"from 'sharp'|require\\('sharp'\\)\" src/ | rg -v '^src/storage/'\n" +
              "rg -n --type ts 'getStorageProvider\\(\\)\\.put' src/ | rg -v '^src/storage/uploadService\\.ts'",
            ) + 'Một worker chạy nền có nhu cầu chính đáng phải ghi ra một file dẫn xuất. Nước đi đúng là gì?',
          ),
          options: [
            B(
              'Add the worker\'s path to the <code>rg -v</code> exclusion, since the grep is a convention rather than a control and the worker is trusted code you wrote',
              'Thêm đường dẫn của worker vào phần loại trừ <code>rg -v</code>, vì lệnh grep chỉ là một quy ước chứ không phải chốt chặn, và worker là mã đáng tin do chính bạn viết',
            ),
            B(
              'Replace both greps with a code-review checklist item, because a text search cannot distinguish a legitimate internal writer from a route that bypasses validation',
              'Thay cả hai lệnh grep bằng một mục trong danh sách kiểm tra khi review, vì một phép tìm chuỗi không phân biệt được một bên ghi nội bộ chính đáng với một route đi vòng qua khâu xác thực',
            ),            B(
              'Move the worker out of <code>src/</code> so the grep does not see it, which keeps the check meaningful for request-handling code without blocking background work',
              'Chuyển worker ra ngoài <code>src/</code> để lệnh grep không thấy nó, như vậy phép kiểm vẫn có nghĩa với mã xử lý request mà không chặn phần việc chạy nền',
            ),
            B(
              'Add a function to the upload module that expresses what the worker needs, and call that — an exception in the grep is a hole that no longer has a name, while a new function keeps every guard in one place and stays visible to the next reader',
              'Thêm một hàm vào module upload diễn đạt đúng thứ worker cần, rồi gọi hàm đó — một ngoại lệ trong lệnh grep là một cái lỗ không còn tên gọi, còn một hàm mới thì giữ mọi chốt chặn ở một chỗ và vẫn hiện ra trước mắt người đọc kế tiếp',
            ),

          ],
          correct: 3,
          explanation: EX(
            'The repo already has the model: the video thumbnail path does not write its JPEG straight to storage — it hands it to <code>uploadImage()</code> like any user file, so a generated artefact still gets the pixel budget, the WebP re-encode and the ownership segment. "We generated it" is not the same as "we control its dimensions", and the input to FFmpeg was a user file, so the output inherits that taint. Option B gives up the strongest property a grep has, which is that it does not erode: two lines in CI are cheaper than a convention that survives exactly as long as the person who introduced it.',
            'Kho này vốn đã có sẵn hình mẫu: đường sinh thumbnail video không ghi thẳng file JPEG của nó vào kho lưu trữ — nó đưa file ấy cho <code>uploadImage()</code> như mọi file của người dùng, nên một hiện vật do máy sinh ra vẫn nhận đủ ngân sách pixel, lượt encode lại sang WebP và đoạn quyền sở hữu. "Do bọn tôi tạo ra" không đồng nghĩa với "bọn tôi kiểm soát được kích thước của nó", và đầu vào của FFmpeg vốn là file của người dùng nên bản ra thừa hưởng luôn vết nhiễm ấy. Lựa chọn B vứt bỏ đúng tính chất mạnh nhất mà một lệnh grep có, là nó không bị bào mòn: hai dòng trong CI rẻ hơn một quy ước sống đúng bằng thời gian người đặt ra nó còn ở lại.',
          ),
        }),

        mcq({
          prompt: B(
            '<code>uploadImage()</code> checks in this order: empty file → byte size → (inside <code>optimizeImage</code>) pixel budget → decode. Why does the order matter?',
            '<code>uploadImage()</code> kiểm theo thứ tự này: file rỗng → kích thước byte → (bên trong <code>optimizeImage</code>) ngân sách pixel → giải mã. Vì sao thứ tự lại quan trọng?',
          ),
          options: [
            B(
              'Because a later check can only see what an earlier one let through, so reversing the order would let a corrupt file reach the decoder and throw a less specific error',
              'Vì một phép kiểm sau chỉ nhìn thấy thứ mà phép kiểm trước cho lọt, nên đảo thứ tự sẽ khiến một file hỏng chạm tới bộ giải mã và ném ra một lỗi kém cụ thể hơn',
            ),
            B(
              'Because the guards are ordered by cost — a property read, then a property read, then a header parse, then tens of megabytes — so a flood of bad requests is refused for almost nothing, whereas the reverse order makes every junk upload pay for a full decode first',
              'Vì các chốt chặn được xếp theo CHI PHÍ — một phép đọc thuộc tính, rồi một phép đọc thuộc tính, rồi một lượt đọc header, rồi hàng chục megabyte — nên một trận lũ request rác bị từ chối gần như miễn phí, trong khi thứ tự ngược lại bắt mọi lượt upload rác phải trả tiền cho một lượt giải mã đầy đủ trước',
            ),
            B(
              'Because Express middleware runs in registration order and the byte-size limit is enforced by multer before the handler body executes',
              'Vì middleware của Express chạy theo thứ tự đăng ký và giới hạn byte do multer thi hành trước khi thân handler chạy',
            ),
            B(
              'Because the pixel budget needs <code>metadata()</code>, which needs a non-empty buffer, so the empty check is a hard prerequisite rather than an optimisation',
              'Vì ngân sách pixel cần <code>metadata()</code>, thứ cần một buffer khác rỗng, nên phép kiểm rỗng là điều kiện tiên quyết cứng chứ không phải một tối ưu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The other three are all true statements that miss the point. Under load, the ordering is the difference between refusing junk for the price of a property read and refusing it for the price of 50 MB of RSS. Note the second half of the same boundary: the handler translates <code>ImageOptimizationError</code> into a 400 and anything else into a 500, which is the line that decides whether a corrupt upload wakes someone at 3am.',
            'Ba lựa chọn còn lại đều là những phát biểu đúng mà trượt mất trọng tâm. Dưới tải, thứ tự này là khác biệt giữa việc từ chối rác với giá của một phép đọc thuộc tính và từ chối nó với giá 50 MB RSS. Để ý thêm nửa sau của cùng cái ranh giới ấy: handler dịch <code>ImageOptimizationError</code> thành 400 và mọi thứ khác thành 500, và chính dòng đó quyết định một file upload hỏng có đánh thức ai lúc 3 giờ sáng hay không.',
          ),
        }),

        mcq({
          prompt: B(
            '<code>uploadImage()</code> translates errors at its own boundary:' + code(
              'try {\n' +
              '  optimized = await optimizeImage(input.buffer, input.mimetype)\n' +
              '} catch (err) {\n' +
              '  if (err instanceof ImageOptimizationError) throw new UploadError(err.message, err.code, 400)\n' +
              '  throw new UploadError(`Image optimization failed: ${err.message}`, "OPTIMIZATION_FAILED", 500)\n' +
              '}',
            ) + 'What does getting this <code>instanceof</code> check backwards actually cost?',
            '<code>uploadImage()</code> dịch lỗi ngay tại ranh giới của chính nó:' + code(
              'try {\n' +
              '  optimized = await optimizeImage(input.buffer, input.mimetype)\n' +
              '} catch (err) {\n' +
              '  if (err instanceof ImageOptimizationError) throw new UploadError(err.message, err.code, 400)\n' +
              '  throw new UploadError(`Image optimization failed: ${err.message}`, "OPTIMIZATION_FAILED", 500)\n' +
              '}',
            ) + 'Làm ngược phép kiểm <code>instanceof</code> này thì thật ra tốn cái gì?',
          ),
          options: [
            B(
              'Either your on-call is woken at 3am by someone uploading a corrupt JPEG, or a genuine server fault is reported to the user as "your file is wrong" and never appears in the error budget at all — the class distinction is what decides which of those two you get',
              'Hoặc là người trực bị dựng dậy lúc 3 giờ sáng vì ai đó upload một file JPEG hỏng, hoặc là một sự cố thật của máy chủ bị báo cho người dùng thành "file của bạn sai" và không bao giờ xuất hiện trong ngân sách lỗi — chính việc phân LOẠI lỗi quyết định bạn nhận cái nào trong hai cái đó',
            ),
            B(
              'Nothing operationally: both branches throw an <code>UploadError</code>, and Express maps every thrown error to a 500 unless the route explicitly reads the status field, which this one does not',
              'Chẳng tốn gì về mặt vận hành: cả hai nhánh đều ném <code>UploadError</code>, và Express ánh xạ mọi lỗi ném ra thành 500 trừ khi route đọc tường minh trường trạng thái, mà route này thì không',
            ),
            B(
              'The retry policy: a 400 is not retryable and a 500 is, so reversing the check makes the client retry corrupt files forever and give up on transient faults after one attempt',
              'Chính sách thử lại: mã 400 thì không thử lại còn 500 thì có, nên đảo phép kiểm sẽ khiến client thử lại mãi với file hỏng và bỏ cuộc sau một lần với sự cố tạm thời',
            ),
            B(
              'The error code: <code>err.code</code> is only defined on <code>ImageOptimizationError</code>, so the reversed branch would produce <code>undefined</code> codes and break every log query built on that field',
              'Mã lỗi: <code>err.code</code> chỉ có trên <code>ImageOptimizationError</code>, nên nhánh bị đảo sẽ sinh ra mã <code>undefined</code> và làm hỏng mọi truy vấn log dựng trên trường ấy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The 4xx/5xx line is not decoration — it is the line your alerting is built on, and it separates "the user sent something wrong" from "we are broken". Option C describes a real second-order effect and is the smaller of the two: client retry behaviour matters, but a paging policy that fires on user error is how a team learns to ignore its own alerts. The value of doing this at the boundary is that the inner module does not need to know about HTTP at all — it throws a typed domain error, and one place decides what that means to a caller over the wire.',
            'Cái ranh giới 4xx/5xx không phải trang trí — đó là cái ranh giới mà hệ cảnh báo của bạn dựng lên, và nó tách "người dùng gửi sai" khỏi "bọn tôi đang hỏng". Lựa chọn C mô tả một hiệu ứng bậc hai có thật và là cái nhỏ hơn trong hai cái: hành vi thử lại của client có ý nghĩa, nhưng một chính sách gọi người trực mà nổ vì lỗi của người dùng chính là cách một nhóm học được thói quen phớt lờ cảnh báo của chính mình. Giá trị của việc dịch lỗi ngay tại ranh giới là module bên trong không cần biết gì về HTTP cả — nó ném một lỗi nghiệp vụ có kiểu, và đúng một chỗ quyết định điều đó nghĩa là gì với bên gọi ở đầu dây bên kia.',
          ),
        }),

        mcq({
          prompt: B(
            'The key format is <code>&lt;category&gt;/&lt;u+id&gt;/&lt;timestamp&gt;-&lt;12 hex&gt;&lt;ext&gt;</code>. A reviewer proposes dropping the <code>u42</code> segment because "the database already knows who owns each file". What breaks?',
            'Khuôn key là <code>&lt;danh-mục&gt;/&lt;u+id&gt;/&lt;dấu-thời-gian&gt;-&lt;12 hex&gt;&lt;đuôi&gt;</code>. Một người review đề xuất bỏ đoạn <code>u42</code> vì "cơ sở dữ liệu vốn đã biết ai sở hữu file nào". Cái gì hỏng?',
          ),
          options: [
            B(
              'Lifecycle rules stop working, because they match on prefix and the owner segment is what makes each user\'s objects a single prefix',
              'Các quy tắc vòng đời hết tác dụng, vì chúng khớp theo tiền tố và đoạn chủ sở hữu chính là thứ gom object của mỗi người dùng vào một tiền tố duy nhất',
            ),
            B(
              'Collisions become likely, since the owner segment was contributing entropy that the 12 hex characters alone cannot replace',
              'Đụng key trở nên dễ xảy ra, vì đoạn chủ sở hữu vốn đóng góp phần ngẫu nhiên mà riêng 12 ký tự hex không thay thế được',
            ),
            B(
              'Keys stop sorting chronologically, because the timestamp is no longer the first variable segment and <code>ListObjectsV2</code> orders lexicographically',
              'Key thôi sắp theo thứ tự thời gian, vì dấu thời gian không còn là đoạn biến đổi đầu tiên nữa mà <code>ListObjectsV2</code> thì sắp theo từ điển',
            ),
            B(
              'Nothing immediately, but ownership stops being checkable from the key alone — so <code>keyBelongsToUser(key, 42)</code> becomes a database round trip on every delete, and the day someone forgets that round trip it is an IDOR: anyone can delete anyone else\'s object by URL',
              'Trước mắt thì không gì cả, nhưng quyền sở hữu thôi kiểm được từ chính cái key — nên <code>keyBelongsToUser(key, 42)</code> trở thành một lượt hỏi cơ sở dữ liệu ở mỗi lần xoá, và ngày nào có người quên lượt hỏi ấy thì đó là IDOR: ai cũng xoá được object của người khác bằng URL',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The reviewer is right that the database knows — the point of the path segment is that you no longer have to ASK it. Ownership becomes a string comparison, which is cheap enough to put in front of every operation and hard to forget because it needs no plumbing. The comment in <code>keys.ts</code> names the use case exactly: an orphan-cleanup endpoint that must only delete the caller\'s keys. Option B is arithmetically wrong: 12 hex characters is 2⁴⁸, and the timestamp is already in the name.',
            'Người review đúng ở chỗ cơ sở dữ liệu có biết — ý nghĩa của đoạn đường dẫn ấy là bạn không còn phải HỎI nó nữa. Quyền sở hữu trở thành một phép so chuỗi, rẻ đủ để đặt trước mọi thao tác và khó quên vì nó chẳng cần đấu nối gì. Comment trong <code>keys.ts</code> gọi tên đúng tình huống: một endpoint dọn file mồ côi chỉ được phép xoá key của chính người gọi. Lựa chọn B sai về số học: 12 ký tự hex là 2⁴⁸, và dấu thời gian thì vốn đã nằm trong tên.',
          ),
        }),

        mcq({
          prompt: B(
            'The uploader\'s original filename is thrown away entirely and stored in a database column instead. On download the service signs a URL with:' + code(
              "ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(row.originalName)}`",
            ) + 'Why the <code>filename*=UTF-8\'\'</code> form rather than plain <code>filename=</code>?',
            'Tên file gốc của người upload bị vứt bỏ hoàn toàn và được lưu vào một cột cơ sở dữ liệu. Lúc tải xuống, dịch vụ ký một URL với:' + code(
              "ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(row.originalName)}`",
            ) + 'Vì sao lại dùng dạng <code>filename*=UTF-8\'\'</code> chứ không phải <code>filename=</code> thường?',
          ),
          options: [
            B(
              'Because plain <code>filename=</code> is limited to 64 characters and Vietnamese filenames routinely exceed it once percent-encoded',
              'Vì <code>filename=</code> thường bị giới hạn 64 ký tự mà tên file tiếng Việt thì thường vượt qua ngay khi mã hoá phần trăm',
            ),
            B(
              'Because <code>filename=</code> is only honoured together with <code>inline</code>, and this response uses <code>attachment</code>',
              'Vì <code>filename=</code> chỉ được tôn trọng khi đi cùng <code>inline</code>, mà phản hồi này dùng <code>attachment</code>',
            ),
            B(
              'Because the RFC 5987 form declares the charset explicitly, which is what makes a non-ASCII name — Vietnamese, in this codebase — survive the trip; plain <code>filename=</code> with a UTF-8 string produces mojibake in several browsers',
              'Vì dạng RFC 5987 khai báo bộ ký tự một cách tường minh, và đó là thứ giúp một cái tên phi-ASCII — tiếng Việt, trong kho mã này — sống sót qua đường truyền; <code>filename=</code> thường với một chuỗi UTF-8 cho ra chữ rác trên vài trình duyệt',
            ),
            B(
              'Because only the starred form is signed as part of the SigV4 canonical request, so the unstarred one can be tampered with by anyone holding the URL',
              'Vì chỉ dạng có dấu sao mới được ký như một phần của canonical request SigV4, nên dạng không sao có thể bị bất kỳ ai cầm URL sửa đổi',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The header is a place where the encoding has to be stated rather than assumed, and RFC 5987 is the mechanism for saying it. This is the practical consequence of the key-design rule: the path stays boring ASCII so nothing downstream can be confused by it, and the human-friendly name lives in a column and is applied at serve time. Note also that neither the length nor the disposition type has anything to do with it.',
            'Cái header này là chỗ mà bộ mã hoá phải được NÓI RA chứ không phải được mặc nhiên hiểu, và RFC 5987 là cơ chế để nói. Đây là hệ quả thực dụng của quy tắc thiết kế key: đường dẫn giữ nguyên dạng ASCII buồn tẻ để không có thứ gì phía sau bị nó làm rối, còn cái tên thân thiện với con người thì nằm trong một cột và được áp vào lúc phục vụ. Cũng lưu ý rằng cả độ dài lẫn kiểu disposition đều chẳng liên quan gì tới chuyện này.',
          ),
        }),

        mcq({
          prompt: B(
            'A worker reports encode progress to the UI:' + code(
              "proc.stderr.on('data', (chunk) => {\n" +
              '  const m = String(chunk).match(/out_time_ms=(\\d+)/)\n' +
              '  if (!m) return\n' +
              '  const pct = Math.min(100, (Number(m[1]) / 1e6 / totalSeconds) * 100)\n' +
              '  if (pct - lastReported >= 5) {\n' +
              '    lastReported = pct\n' +
              '    void prisma.attachment.update({ where: { id }, data: { progress: Math.round(pct) } })\n' +
              '  }\n' +
              '})',
            ) + 'Two details here are load-bearing. Which pair?',
            'Một worker báo tiến độ encode lên giao diện:' + code(
              "proc.stderr.on('data', (chunk) => {\n" +
              '  const m = String(chunk).match(/out_time_ms=(\\d+)/)\n' +
              '  if (!m) return\n' +
              '  const pct = Math.min(100, (Number(m[1]) / 1e6 / totalSeconds) * 100)\n' +
              '  if (pct - lastReported >= 5) {\n' +
              '    lastReported = pct\n' +
              '    void prisma.attachment.update({ where: { id }, data: { progress: Math.round(pct) } })\n' +
              '  }\n' +
              '})',
            ) + 'Có hai chi tiết ở đây chịu lực. Cặp nào?',
          ),
          options: [
            B(
              'The <code>void</code> before the Prisma call, which is what stops an unhandled rejection killing the process; and the fact that <code>lastReported</code> is updated BEFORE the await, so two chunks arriving together cannot both pass the threshold',
              'Từ khoá <code>void</code> đứng trước lời gọi Prisma, thứ ngăn một promise bị từ chối không ai bắt giết chết tiến trình; và việc <code>lastReported</code> được cập nhật TRƯỚC lượt await, nên hai mẩu tới cùng lúc không thể cùng vượt ngưỡng',
            ),
            B(
              'That <code>out_time_ms</code> is in microseconds despite its name, so the divide by 1e6 is correcting a unit bug in FFmpeg; and <code>Math.min(100, …)</code>, because a variable-frame-rate source reports a duration longer than the container claims',
              'Rằng <code>out_time_ms</code> tính bằng micro giây dù cái tên nói khác, nên phép chia cho 1e6 đang sửa một lỗi đơn vị của FFmpeg; và <code>Math.min(100, …)</code>, vì một nguồn có tốc độ khung thay đổi sẽ báo thời lượng dài hơn thứ container khai',
            ),
            B(
              'That progress arrives on <code>stderr</code> at all — <code>-progress pipe:2</code> is how FFmpeg emits it in machine-readable form, and the same listener is what drains the pipe the chapter warns about; and the 5% throttle, because FFmpeg emits progress many times a second and a row update per emit saturates the connection pool',
              'Rằng tiến độ về qua <code>stderr</code> — <code>-progress pipe:2</code> là cách FFmpeg phát nó ra ở dạng máy đọc được, và chính cái listener ấy cũng là thứ rút cạn cái pipe mà chương này cảnh báo; và cái ngưỡng 5%, vì FFmpeg phát tiến độ nhiều lần mỗi giây và cập nhật một dòng cho mỗi lần phát sẽ làm nghẽn pool kết nối',
            ),
            B(
              'That the regex is applied per chunk rather than per line, which is what makes it resilient to FFmpeg splitting a progress block across two writes; and the 5% threshold, which matches the granularity most progress bars render',
              'Rằng regex được áp cho từng mẩu chứ không phải từng dòng, và đó là thứ giúp nó chịu được việc FFmpeg cắt một khối tiến độ thành hai lượt ghi; và ngưỡng 5%, trùng với độ mịn mà phần lớn thanh tiến độ hiển thị',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two chapters meet in one handler. The reason <code>execFile</code> is the wrong tool for a ten-minute encode is that it buffers everything and hands it to you at the end, which is no use for progress; <code>spawn</code> plus <code>-progress pipe:2</code> gives you a stream of <code>key=value</code> lines, and reading them is also what keeps the child from blocking on a full pipe. The throttle is the operational half: FFmpeg is generous with progress events, and an unthrottled write-per-event turns one encode into thousands of database round trips. Option A names two real defensive touches that are worth having and are not what makes this work.',
            'Hai chương gặp nhau trong một handler. Lý do <code>execFile</code> là công cụ sai cho một lượt encode mười phút là nó gom hết rồi đưa cho bạn ở cuối, thứ vô dụng với tiến độ; <code>spawn</code> cộng <code>-progress pipe:2</code> cho bạn một dòng chảy các dòng <code>khoá=giá trị</code>, và việc đọc chúng cũng chính là thứ giữ cho tiến trình con không chặn ở một cái pipe đầy. Cái ngưỡng là nửa vận hành: FFmpeg phát sự kiện tiến độ rất hào phóng, và ghi một lượt cho mỗi sự kiện biến một lượt encode thành hàng nghìn lượt đi về với cơ sở dữ liệu. Lựa chọn A gọi tên hai nét phòng thủ có thật, đáng có, và không phải thứ làm cho đoạn này chạy được.',
          ),
        }),

        mcq({
          prompt: B(
            'The upload service persists through an interface rather than an SDK call:' + code(
              'const stored = await getStorageProvider().put(key, buffer, contentType)\n' +
              '// not: await s3.send(new PutObjectCommand({ … }))\n' +
              '\n' +
              'interface StorageProvider { put · get · delete · readStream · keyFromUrl }',
            ) + 'What does that one indirection buy, and what does it cost?',
            'Dịch vụ upload lưu trữ qua một interface chứ không gọi thẳng SDK:' + code(
              'const stored = await getStorageProvider().put(key, buffer, contentType)\n' +
              '// không phải: await s3.send(new PutObjectCommand({ … }))\n' +
              '\n' +
              'interface StorageProvider { put · get · delete · readStream · keyFromUrl }',
            ) + 'Một tầng gián tiếp ấy mua về cái gì, và tốn cái gì?',
          ),
          options: [
            B(
              'It buys retry and backoff in one place, since every provider call goes through the same wrapper — the cost is that a caller can no longer set per-request options the SDK supports',
              'Nó mua về việc thử lại và giãn cách ở một chỗ, vì mọi lời gọi provider đều đi qua cùng một lớp bọc — cái giá là bên gọi không còn đặt được các tuỳ chọn theo từng request mà SDK hỗ trợ',
            ),
            B(
              'It buys nothing structural — R2 is S3-compatible, so the same SDK talks to both — and it costs an extra layer that hides which requests are Class A and which are Class B',
              'Nó chẳng mua về gì về mặt cấu trúc — R2 tương thích S3 nên cùng một SDK nói chuyện được với cả hai — và nó tốn thêm một tầng che mất request nào là Class A và request nào là Class B',
            ),            B(
              'It buys a security boundary: because callers cannot construct an S3 command directly, they cannot set an ACL that makes an object public, which is the most common storage misconfiguration',
              'Nó mua về một ranh giới an ninh: vì bên gọi không dựng được một lệnh S3 trực tiếp, họ không đặt được một ACL biến object thành công khai, thứ lỗi cấu hình kho lưu trữ phổ biến nhất',
            ),
            B(
              'It buys the app running with no cloud account — a filesystem provider for local development and a memory provider for hermetic tests — and it turns a future storage migration into a provider swap plus a backfill rather than a rewrite of every call site; the cost is one small interface to keep honest across implementations',
              'Nó mua về việc ứng dụng chạy được mà không cần tài khoản đám mây nào — một provider dùng hệ thống file cho môi trường phát triển và một provider trong bộ nhớ cho các bài test kín — và nó biến một cuộc di trú kho lưu trữ về sau thành việc thay provider cộng một lượt bù dữ liệu, thay vì viết lại mọi chỗ gọi; cái giá là phải giữ cho một interface nhỏ luôn nhất quán giữa các bản cài đặt',
            ),

          ],
          correct: 3,
          explanation: EX(
            'The strongest of the three benefits is the least glamorous: a new developer clones the repo and runs the app, uploads work, and no credential exists anywhere. Tests get the same property for free and stop needing network or cleanup. Option B is right that R2 speaks S3 and wrong about what the abstraction is for — the local and memory providers are not S3-compatible at all, and they are the point. Option C describes a benefit you could get this way and is not what the interface is doing; the ACL question lives in the provider implementation either way.',
            'Cái mạnh nhất trong ba lợi ích lại là cái kém hào nhoáng nhất: một lập trình viên mới clone kho về rồi chạy ứng dụng, upload chạy được, và chẳng có thông tin đăng nhập nào tồn tại ở đâu. Các bài test được hưởng đúng tính chất ấy miễn phí và thôi cần mạng lẫn thôi cần dọn dẹp. Lựa chọn B đúng ở chỗ R2 nói được giao thức S3 và sai ở chỗ hiểu tầng trừu tượng này để làm gì — provider dùng hệ thống file và provider trong bộ nhớ hoàn toàn không tương thích S3, và chúng mới là trọng tâm. Lựa chọn C mô tả một lợi ích mà bạn CÓ THỂ đạt được theo cách này nhưng không phải việc mà interface này đang làm; câu chuyện ACL nằm trong bản cài đặt của provider dù thế nào đi nữa.',
          ),
        }),

        mcq({
          prompt: B(
            'A job classifier decides which failures deserve a retry:' + code(
              'function isRetryable(err) {\n' +
              '  const msg = String(err?.message ?? "")\n' +
              '  if (/Invalid data found|moov atom not found|Unknown format/i.test(msg)) return false\n' +
              '  if (/ECONNRESET|ETIMEDOUT|503|500|SlowDown/i.test(msg)) return true\n' +
              '  return false\n' +
              '}',
            ) + 'The final <code>return false</code> covers everything unrecognised. Why default to NOT retrying?',
            'Một bộ phân loại job quyết định lỗi nào đáng thử lại:' + code(
              'function isRetryable(err) {\n' +
              '  const msg = String(err?.message ?? "")\n' +
              '  if (/Invalid data found|moov atom not found|Unknown format/i.test(msg)) return false\n' +
              '  if (/ECONNRESET|ETIMEDOUT|503|500|SlowDown/i.test(msg)) return true\n' +
              '  return false\n' +
              '}',
            ) + 'Dòng <code>return false</code> cuối cùng bao trọn mọi thứ chưa nhận ra. Vì sao mặc định là KHÔNG thử lại?',
          ),
          options: [
            B(
              'Because an unrecognised failure retried five times is five times the cost and five times the log noise for a bug you have not diagnosed yet; failing once puts it in front of you',
              'Vì một lỗi chưa nhận ra mà thử lại năm lần là năm lần chi phí và năm lần tiếng ồn trong log cho một con bug bạn còn chưa chẩn đoán; hỏng một lần thì nó nằm ngay trước mặt bạn',
            ),
            B(
              'Because the queue already retries at the transport level, so an application-level retry would multiply the two and produce up to 25 attempts',
              'Vì hàng đợi vốn đã thử lại ở tầng vận chuyển, nên một lượt thử lại ở tầng ứng dụng sẽ nhân hai thứ lên và cho tới 25 lần thử',
            ),
            B(
              'Because retrying is only safe for idempotent jobs, and the classifier has no way to know whether this particular job is idempotent',
              'Vì thử lại chỉ an toàn với những job bất biến, mà bộ phân loại thì không có cách nào biết job cụ thể này có bất biến hay không',
            ),
            B(
              'Because most unrecognised errors in a media pipeline are corrupt inputs, so the statistically correct default matches the first branch',
              'Vì phần lớn lỗi chưa nhận ra trong một đường ống media là do đầu vào hỏng, nên mặc định đúng về mặt thống kê là trùng với nhánh đầu tiên',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Retrying is only ever right when the failure is transient by nature, and an error you have not classified is by definition an error whose nature you do not know. Defaulting to false makes the unknown loud and cheap instead of quiet and expensive. The two named branches are the shape worth copying: a corrupt container will be exactly as corrupt on attempt five, so it fails immediately with the stderr tail attached; infrastructure errors back off. The ambiguous middle — a timeout — is worth exactly one retry.',
            'Thử lại chỉ đúng khi lỗi vốn là tạm thời, mà một lỗi bạn chưa phân loại thì theo định nghĩa là một lỗi bạn chưa biết bản chất. Mặc định là false làm cho cái chưa biết trở nên ồn ào và rẻ, thay vì im lặng và đắt. Hai nhánh có tên là hình dạng đáng chép lại: một container hỏng thì tới lần thử thứ năm vẫn hỏng y như thế, nên nó hỏng ngay kèm phần đuôi stderr; còn lỗi hạ tầng thì lùi lại rồi thử. Vùng lưng chừng mơ hồ — một cú quá hạn — đáng đúng một lần thử lại.',
          ),
        }),

        // ── Chương 6 — Chi phí ──────────────────────────────────────────
        mcq({
          prompt: B(
            'The same workload — 100.000 images and 2.000 short videos a month — priced two ways:' + code(
              'A) fixed VPS, 6 vCPU / 6 GB     ~$48/month flat\n' +
              'B) serverless, per GB-second    ~$2/month at this volume,\n' +
              '   but execution is capped (commonly 15 minutes) and RAM is capped (2–10 GB)',
            ) + 'What decides between them?',
            'Cùng một khối lượng công việc — 100.000 ảnh và 2.000 video ngắn mỗi tháng — được định giá theo hai cách:' + code(
              'A) VPS cố định, 6 vCPU / 6 GB   ~48 $/tháng, phẳng\n' +
              'B) serverless, tính theo GB-giây ~2 $/tháng ở khối lượng này,\n' +
              '   nhưng thời gian chạy bị trần (thường 15 phút) và RAM bị trần (2–10 GB)',
            ) + 'Điều gì quyết định chọn bên nào?',
          ),
          options: [
            B(
              'Volume: below a few hundred thousand operations a month serverless always wins on price, and the crossover is where the fixed VPS becomes cheaper per operation',
              'Khối lượng: dưới vài trăm nghìn thao tác mỗi tháng thì serverless luôn thắng về giá, và điểm giao là chỗ VPS cố định trở nên rẻ hơn tính trên mỗi thao tác',
            ),
            B(
              'Whether you can tolerate a cold start, since that is the only operational difference — the caps are generous enough that no realistic media job approaches them',
              'Việc bạn có chịu được khởi động lạnh hay không, vì đó là khác biệt vận hành duy nhất — các mức trần đủ rộng rãi tới mức không job media thực tế nào chạm tới',
            ),            B(
              'The storage bill, since the two options differ mainly in egress pricing and the compute difference is noise next to a growing bucket',
              'Hoá đơn lưu trữ, vì hai phương án chủ yếu khác nhau ở giá lưu lượng ra còn chênh lệch tính toán chỉ là nhiễu bên cạnh một cái bucket đang phình',
            ),
            B(
              'Whether the load is BURSTY or STEADY — serverless looks dramatically cheaper here because this workload is small and spiky, and inverting that to steady 24/7 load makes the fixed VPS win outright; and separately whether any single job can exceed the execution and memory caps',
              'Tải là DỒN DẬP hay ĐỀU ĐẶN — serverless trông rẻ hơn hẳn ở đây vì khối lượng này nhỏ và giật cục, còn lật ngược lại thành tải đều 24/7 thì VPS cố định thắng tuyệt đối; và tách bạch với đó là liệu có job đơn lẻ nào vượt trần thời gian chạy và trần bộ nhớ hay không',
            ),

          ],
          correct: 3,
          explanation: EX(
            'The question is never "which is cheaper" — it is "is my load bursty or steady", because a metered model prices idle time at zero and a fixed one has already paid for it. And the caps are a real second axis rather than a footnote: a 210-frame screencast fits comfortably, and a 40-minute 4K transcode does not fit inside a 15-minute execution limit at all, which turns a pricing question into an architecture one. Option A gets the shape backwards by making it about volume alone.',
            'Câu hỏi không bao giờ là "cái nào rẻ hơn" — mà là "tải của tôi dồn dập hay đều đặn", vì mô hình tính theo mức dùng định giá thời gian rảnh bằng không còn mô hình cố định thì đã trả tiền cho nó rồi. Và các mức trần là một trục thứ hai có thật chứ không phải một dòng chú thích: một ảnh chụp màn hình 210 frame thì lọt thoải mái, còn một lượt transcode 4K dài 40 phút thì hoàn toàn không lọt vào giới hạn chạy 15 phút, và điều đó biến một câu hỏi về giá thành một câu hỏi về kiến trúc. Lựa chọn A hiểu ngược hình dạng vấn đề khi quy tất cả về khối lượng.',
          ),
        }),

        mcq({
          prompt: B(
            'A six-core VPS runs four transcode workers, each spawning FFmpeg with default settings. Encodes take four times longer than they did with one worker, and nothing finishes sooner. What is the fix?',
            'Một VPS sáu nhân chạy bốn worker transcode, mỗi worker spawn FFmpeg với cấu hình mặc định. Mỗi lượt encode lâu gấp bốn lần so với khi chỉ có một worker, và chẳng có gì xong sớm hơn. Cách sửa là gì?',
          ),
          options: [
            B(
              'Raise the worker count to six so each core owns exactly one worker, which removes the contention by matching the pool to the hardware',
              'Nâng số worker lên sáu để mỗi nhân sở hữu đúng một worker, như vậy khử được tranh chấp bằng cách khớp pool với phần cứng',
            ),
            B(
              'Give FFmpeg <code>-threads</code> explicitly, sized as cores ÷ workers — it defaults to using every core it can see, so four workers ask for 24 threads on a six-core box and everything thrashes; two workers at <code>-threads 3</code> is six threads, fully used, with predictable latency',
              'Truyền <code>-threads</code> tường minh cho FFmpeg, đặt bằng số nhân chia số worker — nó mặc định dùng hết mọi nhân nó thấy, nên bốn worker đòi 24 luồng trên một máy sáu nhân và mọi thứ giẫm lên nhau; hai worker ở <code>-threads 3</code> là sáu luồng, dùng hết, và độ trễ đoán được',
            ),
            B(
              'Move the pool to <code>-preset ultrafast</code>, since contention is a symptom of each encode taking too long and the preset is the fastest lever available',
              'Chuyển pool sang <code>-preset ultrafast</code>, vì tranh chấp là triệu chứng của việc mỗi lượt encode quá lâu và preset là đòn bẩy nhanh nhất có được',
            ),
            B(
              'Set <code>sharp.concurrency(1)</code> so libvips stops competing with FFmpeg for the same cores, which is the only shared resource the two contend for',
              'Đặt <code>sharp.concurrency(1)</code> để libvips thôi tranh nhân với FFmpeg, đó là tài nguyên chung duy nhất mà hai bên giành nhau',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is the Chapter 1 concurrency lesson one level up. Inside one process, <code>sharp.concurrency()</code> × your semaphore is the CPU demand; across a pool, workers × FFmpeg threads is. FFmpeg\'s default of "all cores" is right for a single interactive encode and wrong in every pool, and the tell is exactly this symptom: total throughput unchanged, per-job latency multiplied by the over-subscription factor. Option A makes it worse — six workers × six cores each is 36 threads. Option C changes the quality trade to work around a scheduling bug, which is worth doing for its own reasons and does not fix this one.',
            'Đây là bài học về mức đồng thời của chương 1, nâng lên một tầng. Bên trong một tiến trình thì <code>sharp.concurrency()</code> nhân với semaphore của bạn là nhu cầu CPU; trên cả một pool thì đó là số worker nhân số luồng FFmpeg. Giá trị mặc định "dùng hết nhân" của FFmpeg là đúng cho một lượt encode đơn lẻ có người ngồi chờ và sai trong mọi pool, và dấu hiệu nhận biết đúng là triệu chứng này: tổng thông lượng không đổi, còn độ trễ mỗi job bị nhân lên đúng bằng hệ số đặt quá tay. Lựa chọn A làm mọi thứ tệ hơn — sáu worker nhân sáu nhân mỗi cái là 36 luồng. Lựa chọn C đổi phép đánh đổi chất lượng để đi vòng qua một lỗi lập lịch, việc đó đáng làm vì lý do riêng của nó và không sửa được lỗi này.',
          ),
        }),

        mcq({
          prompt: B(
            'Two savings are proposed for the same pipeline: (a) switch the video preset so each encode is several times faster, (b) stop generating two of the five image variants because nobody requests them. Which is worth more over a year, and why?',
            'Hai phương án tiết kiệm được đề xuất cho cùng một pipeline: (a) đổi preset video để mỗi lượt encode nhanh hơn vài lần, (b) thôi sinh hai trong năm variant ảnh vì chẳng ai xin chúng. Cái nào giá trị hơn xét trên một năm, và vì sao?',
          ),
          options: [
            B(
              'Neither, until the compression ratio is measured — the savings cannot be compared without knowing how large the two dropped variants actually are',
              'Không cái nào, chừng nào tỉ lệ nén chưa được đo — không thể so hai phần tiết kiệm khi chưa biết hai variant bị bỏ thật ra lớn cỡ nào',
            ),            B(
              '(a), because throughput is the binding constraint on a fixed VPS and storage is comparatively cheap at these volumes',
              '(a), vì thông lượng mới là ràng buộc quyết định trên một VPS cố định còn dung lượng thì tương đối rẻ ở quy mô này',
            ),
            B(
              'They are equivalent: both remove the same encode, so the CPU and the storage saving are two views of one number',
              'Hai cái tương đương: cả hai đều bỏ đi cùng một lượt encode, nên phần tiết kiệm CPU và phần tiết kiệm dung lượng là hai góc nhìn của cùng một con số',
            ),
            B(
              '(b), because CPU is spent once and never again, while storage is charged every single month — so a variant you stop generating keeps paying you back, and a faster encode pays you once',
              '(b), vì CPU tiêu một lần rồi thôi, còn dung lượng thì bị tính tiền mỗi tháng — nên một variant bạn thôi sinh ra cứ trả lại tiền mãi, còn một lượt encode nhanh hơn chỉ trả lại một lần',
            ),

          ],
          correct: 3,
          explanation: EX(
            'The asymmetry is the whole point of Chapter 6. An encode you ran last year costs you nothing today; a byte you stored last year costs you again this month and every month after. Option B is a real consideration when the queue is behind right now — throughput is what is failing, and the preset is the fastest lever — but the question asked about a year, and over a year the cumulative axis wins. Option C is wrong in an interesting way: (b) removes the encode AND the storage, so it dominates (a) on both axes rather than tying with it.',
            'Tính bất đối xứng ấy chính là toàn bộ ý của chương 6. Một lượt encode bạn chạy năm ngoái hôm nay không tốn gì; một byte bạn lưu năm ngoái thì tháng này lại tính tiền, và mọi tháng sau nữa. Lựa chọn B là một cân nhắc có thật khi hàng đợi đang tồn đọng NGAY LÚC NÀY — thông lượng mới là thứ đang hỏng, và preset là cái đòn bẩy nhanh nhất — nhưng câu hỏi hỏi về một năm, và trên một năm thì cái trục tích luỹ thắng. Lựa chọn C sai theo một cách thú vị: (b) bỏ được CẢ lượt encode LẪN phần dung lượng, nên nó trội hơn (a) trên cả hai trục chứ không hoà.',
          ),
        }),

        mcq({
          prompt: B(
            'Chapter 6 proposes one log line per media operation:' + code(
              "logger.info('[media] op', { kind, op, ms, bytesIn, bytesOut })",
            ) + 'Which capacity question can you answer from these four fields WITHOUT adding any further instrumentation?',
            'Chương 6 đề xuất một dòng log cho mỗi thao tác media:' + code(
              "logger.info('[media] op', { kind, op, ms, bytesIn, bytesOut })",
            ) + 'Câu hỏi năng lực nào bạn trả lời được từ bốn trường này mà KHÔNG cần thêm bất kỳ thiết bị đo nào?',
          ),
          options: [
            B(
              'How many concurrent decodes were in flight at the moment of the p99, which is what sizes the concurrency gate',
              'Có bao nhiêu lượt giải mã đang chạy đồng thời tại thời điểm của p99, đó là thứ dùng để đặt kích thước cho chốt đồng thời',
            ),
            B(
              'The peak RSS of each operation, since <code>bytesIn</code> is a reliable proxy for the decoded pixel buffer',
              'RSS đỉnh của từng thao tác, vì <code>bytesIn</code> là một đại lượng thay thế đáng tin cho bộ đệm pixel đã giải mã',
            ),
            B(
              'Whether a given output ever gets viewed, which is what decides between the upload-time and on-demand architectures',
              'Một bản ra cụ thể có bao giờ được xem hay không, đó là thứ quyết định giữa kiến trúc lúc-upload và on-demand',
            ),
            B(
              'What fraction of a single core the pipeline consumed today — <code>sum(ms) ÷ 86400 × 100</code> — which is the number that says how close to capacity you are before the queue starts growing',
              'Đường ống hôm nay đã tiêu bao nhiêu phần trăm của MỘT nhân — <code>sum(ms) ÷ 86400 × 100</code> — chính là con số cho biết bạn còn cách ngưỡng năng lực bao xa trước khi hàng đợi bắt đầu phình',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Four fields, several derived metrics: <code>sum(ms)</code> per day is CPU-seconds consumed; divided by 86.400 it is the fraction of a core; <code>sum(bytesOut)</code> is the storage growth rate; <code>avg(bytesOut ÷ bytesIn)</code> answers "is the optimizer still working?" — the regression signal from Chapter 5; and <code>p99(ms)</code> by <code>op</code> tells you which operation owns the tail. Option B is the exact mistake the whole course argues against: bytes on the wire do not predict pixels in RAM, and a 776.180-byte PNG is the counter-example.',
            'Bốn trường, nhiều chỉ số suy ra được: <code>sum(ms)</code> mỗi ngày là số CPU-giây đã tiêu; chia cho 86.400 thì ra phần của một nhân; <code>sum(bytesOut)</code> là tốc độ phình dung lượng; <code>avg(bytesOut ÷ bytesIn)</code> trả lời "bộ tối ưu còn chạy không?" — đúng tín hiệu hồi quy của chương 5; và <code>p99(ms)</code> theo <code>op</code> cho biết thao tác nào đang chiếm cái đuôi. Lựa chọn B chính là sai lầm mà cả khoá này phản đối: số byte trên dây không dự báo được số pixel trong RAM, và cái file PNG 776.180 byte là phản ví dụ.',
          ),
        }),

        mcq({
          prompt: B(
            'The course\'s Chapter 6 table records "phone portrait, WebP q80, 1200 px wide → 412 KB". The same settings on the synthetic photo used to build these exams measured <b>49.246 B</b>. Same encoder, same version, same quality, same output width. What is the correct conclusion?',
            'Bảng ở chương 6 của giáo trình ghi "ảnh chân dung điện thoại, WebP q80, rộng 1200 px → 412 KB". Cũng những cài đặt ấy trên tấm ảnh tổng hợp dùng để dựng bộ đề này đo được <b>49.246 B</b>. Cùng encoder, cùng phiên bản, cùng quality, cùng chiều rộng đầu ra. Kết luận đúng là gì?',
          ),
          options: [
            B(
              'One of the two runs must be misconfigured, because a factor of 8 cannot come from content alone at a fixed quality and a fixed output size',
              'Một trong hai lượt chạy chắc chắn cấu hình sai, vì một hệ số 8 không thể chỉ đến từ nội dung khi quality và kích thước đầu ra đều cố định',
            ),
            B(
              'Content dominates: the amount of detail in the frame decides how many bytes a lossy encoder needs, so a published ratio describes somebody else\'s corpus and a storage projection built on it can be wrong by a large factor in either direction',
              'Nội dung mới là thứ quyết định: lượng chi tiết trong khung hình định đoạt một encoder có mất dữ liệu cần bao nhiêu byte, nên một tỉ lệ được công bố chỉ mô tả kho ảnh của người khác, và một dự báo dung lượng dựng trên nó có thể sai lệch rất nhiều theo cả hai chiều',
            ),
            B(
              'The synthetic source is not a valid benchmark input, so no conclusion can be drawn until the measurement is repeated on real camera photos',
              'Nguồn tổng hợp không phải đầu vào benchmark hợp lệ, nên không rút được kết luận nào cho tới khi đo lại trên ảnh máy ảnh thật',
            ),
            B(
              'The difference is the mozjpeg encoder: the course figure includes it and the measurement here does not, which accounts for most of the gap',
              'Khác biệt nằm ở encoder mozjpeg: con số của giáo trình có tính nó còn phép đo ở đây thì không, và điều đó giải thích phần lớn khoảng cách',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The course itself measured a 4,4× spread across a photo, a product shot on white, and a code screenshot at identical settings — flat regions compress to almost nothing, detailed ones do not. Option C has a grain of truth and overstates it: a synthetic source is fine for measuring a MECHANISM (does the flag apply, does the frame count survive), which is what this deck uses it for, and unsuitable for predicting YOUR storage bill — which is exactly why Chapter 6 hands you a harness instead of a table. Option D is a category error: mozjpeg is a JPEG encoder and has nothing to do with a WebP row.',
            'Chính giáo trình đã đo được khoảng chênh 4,4 lần giữa một tấm ảnh chụp, một tấm chụp sản phẩm trên nền trắng và một ảnh chụp màn hình mã nguồn ở cùng cài đặt — vùng phẳng nén còn gần như không gì, vùng chi tiết thì không. Lựa chọn C đúng một phần và nói quá lên: một nguồn tổng hợp hoàn toàn ổn để đo một CƠ CHẾ (cái cờ có tác dụng không, số frame có sống sót không), và đó chính là việc bộ đề này dùng nó, còn nó thì không hợp để dự báo hoá đơn dung lượng CỦA BẠN — mà đó đúng là lý do chương 6 đưa cho bạn một bộ đo thay vì một cái bảng. Lựa chọn D nhầm phạm trù: mozjpeg là một encoder JPEG và chẳng liên quan gì tới một dòng WebP.',
          ),
        }),

        mcq({
          prompt: B(
            'The benchmark harness in Chapter 6 runs each configuration three times and keeps the MEDIAN, explicitly not the mean. Why?',
            'Bộ đo trong chương 6 chạy mỗi cấu hình ba lượt rồi giữ TRUNG VỊ, và nói rõ là không lấy trung bình cộng. Vì sao?',
          ),
          options: [
            B(
              'Because the mean of three is undefined when one run fails, whereas the median discards the failed run automatically',
              'Vì trung bình cộng của ba lượt không xác định được khi một lượt hỏng, còn trung vị thì tự động loại bỏ lượt hỏng',
            ),
            B(
              'Because libvips caches its thread pool between runs, so the second and third runs are systematically faster and averaging them hides that',
              'Vì libvips giữ cache thread pool giữa các lượt, nên lượt thứ hai và thứ ba nhanh hơn một cách có hệ thống và lấy trung bình sẽ che mất điều đó',
            ),
            B(
              'Because the median is the only statistic that is stable under the concurrency this course measured, and the mean would require at least thirty samples to converge',
              'Vì trung vị là thống kê duy nhất ổn định dưới mức đồng thời mà khoá này đo, còn trung bình cộng cần ít nhất ba mươi mẫu mới hội tụ',
            ),
            B(
              'Because the first run pays for lazy module loading and a cold thread pool, and any run can collide with whatever else the box is doing — a median throws out both the warm-up and the one unlucky sample, while one outlier drags a mean to a value no run actually produced',
              'Vì lượt đầu phải trả cho việc nạp module chậm và một thread pool còn lạnh, và lượt nào cũng có thể va phải thứ khác mà máy đang chạy — trung vị vứt bỏ cả phần khởi động lẫn một mẫu xui xẻo, còn một giá trị lạc thì kéo trung bình cộng tới một con số mà chẳng lượt nào thật sự đạt được',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two contaminants, one fix. And it is exactly why this whole deck avoids timing numbers: the machine these exams were measured on is running several other agents, so even a median of three would not be honest. Where the course states a ratio in seconds, the questions here ask about the mechanism or about the byte count instead. If you want the tail rather than the centre, report p99 separately — do not let it contaminate the central estimate.',
            'Hai nguồn nhiễu, một cách sửa. Và đó đúng là lý do cả bộ đề này tránh mọi con số thời gian: cỗ máy đo bộ đề này đang chạy vài agent khác, nên ngay cả trung vị của ba lượt cũng sẽ không trung thực. Chỗ nào giáo trình nêu một tỉ số tính bằng giây thì câu hỏi ở đây chuyển sang hỏi cơ chế hoặc hỏi số byte. Muốn cái đuôi thay vì cái tâm thì hãy báo p99 riêng — đừng để nó làm nhiễu ước lượng ở tâm.',
          ),
        }),

        mcq({
          prompt: B(
            'A pipeline\'s median image encode is fast and its p99 is many times slower. A developer proposes shaving 20 ms off the median path. What does Chapter 6 say about that priority?',
            'Trung vị thời gian encode ảnh của một đường ống thì nhanh còn p99 thì chậm gấp nhiều lần. Một lập trình viên đề xuất cắt 20 ms khỏi đường trung vị. Chương 6 nói gì về ưu tiên đó?',
          ),
          options: [
            B(
              'Correct: the median is what most users experience, so improving it improves the most requests',
              'Đúng: trung vị là thứ phần lớn người dùng trải nghiệm, nên cải thiện nó là cải thiện nhiều request nhất',
            ),
            B(
              'Wrong, because the p99 of an image pipeline is dominated by network time to the object store rather than by encoding, so neither number is actionable',
              'Sai, vì p99 của một đường ống ảnh bị chi phối bởi thời gian mạng tới kho object chứ không phải bởi việc encode, nên chẳng con số nào hành động được',
            ),
            B(
              'Wrong for the reason that matters: the tail IS the capacity limit — the 0,1% of uploads that are 200-frame GIFs are what fills a worker and stalls the queue, and 20 ms off an already-fast path is invisible',
              'Sai vì đúng cái lý do quan trọng: CÁI ĐUÔI CHÍNH LÀ giới hạn năng lực — 0,1% số lượt upload là những file GIF 200 frame mới là thứ lấp đầy một worker và làm nghẽn hàng đợi, còn 20 ms cắt khỏi một đường vốn đã nhanh thì vô hình',
            ),
            B(
              'Correct but incomplete: both should be optimised, and the median first because a p99 fix usually requires an architecture change',
              'Đúng nhưng chưa đủ: cả hai đều nên tối ưu, và làm trung vị trước vì sửa p99 thường đòi thay đổi kiến trúc',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Sort your operation log by <code>ms</code> descending and fix the top of that list. The reason is arithmetic rather than aesthetic: a worker occupied by one pathological input is a worker not draining the queue, so the tail sets throughput while the median only sets how a healthy request feels. Chapter 2\'s 210-frame screencast is the concrete case — legitimate content, orders of magnitude more work than a photo, and exactly the thing a per-request budget has to see coming.',
            'Hãy sắp log thao tác theo <code>ms</code> giảm dần rồi sửa từ đầu danh sách xuống. Lý do là số học chứ không phải thẩm mỹ: một worker bị một đầu vào bệnh hoạn chiếm chỗ là một worker không rút được hàng đợi, nên cái đuôi định đoạt thông lượng còn trung vị chỉ định đoạt cảm giác của một request khoẻ mạnh. Cái ảnh chụp màn hình 210 frame ở chương 2 là ca cụ thể — nội dung hợp lệ, khối lượng việc hơn một tấm ảnh vài bậc độ lớn, và đúng là thứ mà một ngân sách theo request phải nhìn thấy từ trước.',
          ),
        }),

        // ── Chương 7 — Streaming ────────────────────────────────────────
        mcq({
          prompt: B(
            'Progressive video is stored with a year-long immutable cache:' + code(
              "await provider.put(key, buffer, 'video/mp4', {\n" +
              "  cacheControl: 'public, max-age=31536000, immutable',\n" +
              '})\n' +
              '\n' +
              'key = video/u42/1735689600000-a3f9c2b17e4d.mp4',
            ) + 'What makes a one-year <code>immutable</code> safe here, given that a user may later replace the video on that post?',
            'Video dạng tuần tự được lưu kèm một chỉ thị cache bất biến dài một năm:' + code(
              "await provider.put(key, buffer, 'video/mp4', {\n" +
              "  cacheControl: 'public, max-age=31536000, immutable',\n" +
              '})\n' +
              '\n' +
              'key = video/u42/1735689600000-a3f9c2b17e4d.mp4',
            ) + 'Điều gì làm cho một chỉ thị <code>immutable</code> dài một năm ở đây là an toàn, khi mà người dùng về sau vẫn có thể thay video của bài viết đó?',
          ),
          options: [
            B(
              'The key carries a millisecond timestamp and twelve hex characters of randomness, so a replacement is a different object at a different URL — the old URL keeps serving the old bytes, correctly, and nothing ever has to be invalidated',
              'Cái key mang một dấu thời gian mili giây và mười hai ký tự hex ngẫu nhiên, nên một bản thay thế là một object KHÁC ở một URL KHÁC — cái URL cũ vẫn phục vụ đúng đám byte cũ, và chẳng bao giờ phải xoá cache của thứ gì',
            ),
            B(
              'The <code>immutable</code> directive only applies to conditional revalidation, so a browser still re-checks with <code>If-None-Match</code> on a hard reload and picks up the replacement within one round trip',
              'Chỉ thị <code>immutable</code> chỉ áp cho việc kiểm lại có điều kiện, nên trình duyệt vẫn kiểm lại bằng <code>If-None-Match</code> khi tải lại cứng và nhận được bản thay thế sau một lượt đi về',
            ),
            B(
              'Object stores drop <code>immutable</code> on overwrite, so the moment the user replaces the file the edge treats it as stale — the year applies only while the object is untouched',
              'Kho object bỏ <code>immutable</code> khi có ghi đè, nên ngay khi người dùng thay file thì edge coi nó là cũ — con số một năm chỉ áp dụng chừng nào object chưa bị đụng tới',
            ),
            B(
              'Video is the exception: because playback uses Range requests, each request is a partial response and partial responses are never stored under a long TTL by any CDN',
              'Video là ngoại lệ: vì việc phát dùng Range request, mỗi lượt xin là một phản hồi từng phần, và phản hồi từng phần thì không CDN nào lưu dưới một TTL dài',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Cache immutability and key design are the same decision seen twice. A year-long <code>immutable</code> is only ever safe when the URL is a function of the content, and Lesson 5.2\'s key builder makes that true by construction — timestamp plus <code>crypto.randomBytes(6)</code> means a re-upload cannot land on the same path. Get the key wrong (reuse a stable name like <code>u42/avatar.jpg</code>) and the same header becomes a year of serving a photo the user already replaced, with no way to fix it short of a purge. Note this is exactly the property a LIVE manifest does not have, which is why it gets <code>max-age</code> of one segment instead.',
            'Tính bất biến của cache và thiết kế key là cùng MỘT quyết định nhìn từ hai phía. Một chỉ thị <code>immutable</code> dài một năm chỉ an toàn khi URL là một hàm của NỘI DUNG, và hàm dựng key ở bài 5.2 làm cho điều đó đúng theo thiết kế — dấu thời gian cộng <code>crypto.randomBytes(6)</code> nghĩa là một lượt upload lại không thể rơi trúng cùng đường dẫn. Đặt key sai (dùng lại một cái tên cố định kiểu <code>u42/avatar.jpg</code>) thì cũng cái header ấy trở thành một năm phục vụ tấm ảnh mà người dùng đã thay từ lâu, và không có cách sửa nào ngoài xoá cache thủ công. Để ý rằng đây đúng là tính chất mà một manifest TRỰC TIẾP không có, và đó là lý do nó chỉ được <code>max-age</code> bằng một segment.',
          ),
        }),

        mcq({
          prompt: B(
            'A three-rendition HLS ladder built from a 10-second clip produced 19 objects; the same content as one progressive MP4 is 1. Choose <b>TWO</b> operational consequences of that difference.',
            'Một bậc thang HLS ba bản dựng từ một clip 10 giây cho ra 19 object; cùng nội dung ấy ở dạng một file MP4 tuần tự là 1 object. Chọn <b>HAI</b> hệ quả vận hành của khác biệt đó.',
          ),
          options: [
            B(
              'The failure mode changes shape: a missing progressive file is one obvious 404, while ONE missing segment out of hundreds stalls playback mid-way, only for the viewers who reach that timestamp, while the manifest and every other segment return 200 and your monitoring looks perfect',
              'Kiểu hỏng đổi hình dạng: một file tuần tự bị thiếu là một mã 404 hiển nhiên, còn MỘT segment thiếu trong hàng trăm cái thì làm việc phát khựng giữa chừng, và chỉ với những người xem chạm tới đúng mốc ấy, trong khi manifest cùng mọi segment khác đều trả 200 và hệ giám sát của bạn trông hoàn hảo',
            ),
            B(
              'Deleting a video stops being a single key and becomes a whole prefix, and orphan detection has to work on prefixes rather than on keys — a reconciliation written against one-object-per-video silently stops finding anything',
              'Xoá một video thôi là chuyện một cái key và trở thành chuyện cả một tiền tố, và việc dò file mồ côi phải làm việc trên tiền tố chứ không trên key — một lượt đối soát viết theo giả định mỗi video một object sẽ âm thầm thôi tìm thấy gì',
            ),
            B(
              'Viewers download 19 objects instead of 1, so the per-viewer request count rises with the segment count and a short clip becomes more expensive to serve than to store',
              'Người xem tải 19 object thay vì 1, nên số request của mỗi người xem tăng theo số segment và một clip ngắn trở nên tốn kém khi phục vụ hơn là khi lưu trữ',
            ),
            B(
              'The manifest must be revalidated on every segment fetch, because a player cannot know whether the ladder changed between segments — which is why HLS origins see roughly twice the request rate of a progressive origin',
              'Manifest phải được kiểm lại ở mỗi lượt lấy segment, vì player không biết được bậc thang có đổi giữa hai segment hay không — đó là lý do origin của HLS nhận lượng request cao gấp đôi so với origin phục vụ file tuần tự',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Option C is arithmetically wrong in a way worth spotting: a viewer downloads ONE rendition, so a 10-second clip at 2-second segments is 5 segments plus 2 playlists, not 19 — the 19 is what you STORE and therefore what you WRITE, which is where the Class A cost lands. Option D describes VOD behaviour that does not happen: a VOD manifest is marked complete, so a player fetches it once. The two that do bite are the ones that change your operational procedures rather than your bill — a partial upload leaves a stream that plays for forty seconds and then stops, for some viewers, some of the time.',
            'Lựa chọn C sai về số học theo một kiểu đáng nhận ra: một người xem tải MỘT bản, nên một clip 10 giây ở segment 2 giây là 5 segment cộng 2 playlist, không phải 19 — con số 19 là thứ bạn LƯU và do đó là thứ bạn GHI, và đó là chỗ chi phí Class A rơi vào. Lựa chọn D mô tả một hành vi VOD không hề xảy ra: một manifest VOD được đánh dấu là đã hoàn tất, nên player lấy nó đúng một lần. Hai cái thật sự cắn là hai cái làm đổi QUY TRÌNH VẬN HÀNH của bạn chứ không đổi hoá đơn — một lượt upload dở dang để lại một luồng phát được bốn mươi giây rồi dừng, với một số người xem, vào một số lúc.',
          ),
        }),

        mcq({
          prompt: B(
            'The player-side code for an HLS stream:' + code(
              "if (video.canPlayType('application/vnd.apple.mpegurl')) {\n" +
              '  video.src = src\n' +
              '} else {\n' +
              "  const { default: Hls } = await import('hls.js')     // ~150 KB\n" +
              '  if (Hls.isSupported()) { const hls = new Hls({ maxBufferLength: 30 })\n' +
              '    hls.loadSource(src); hls.attachMedia(video) }\n' +
              '}',
            ) + 'Why is the <code>import()</code> dynamic rather than a top-level import?',
            'Đoạn mã phía player cho một luồng HLS:' + code(
              "if (video.canPlayType('application/vnd.apple.mpegurl')) {\n" +
              '  video.src = src\n' +
              '} else {\n' +
              "  const { default: Hls } = await import('hls.js')     // ~150 KB\n" +
              '  if (Hls.isSupported()) { const hls = new Hls({ maxBufferLength: 30 })\n' +
              '    hls.loadSource(src); hls.attachMedia(video) }\n' +
              '}',
            ) + 'Vì sao lại là <code>import()</code> động thay vì một lệnh import ở cấp cao nhất?',
          ),
          options: [
            B(
              'Because hls.js must not be evaluated before <code>canPlayType</code> has run — loading it eagerly registers its own media-source handlers and Safari then routes native HLS through the library',
              'Vì hls.js không được phép chạy trước khi <code>canPlayType</code> chạy xong — nạp nó sớm sẽ đăng ký các handler media-source của chính nó và Safari khi đó sẽ đẩy luồng HLS gốc qua thư viện',
            ),
            B(
              'Because Media Source Extensions are only available in a secure context, and a dynamic import is what defers the feature check until after the page has confirmed HTTPS',
              'Vì Media Source Extensions chỉ dùng được trong một ngữ cảnh bảo mật, và import động là thứ hoãn phép kiểm tính năng lại tới sau khi trang xác nhận đã dùng HTTPS',
            ),            B(
              'Because hls.js needs the <code>&lt;video&gt;</code> element to exist before it is constructed, and a top-level import runs before the DOM is parsed',
              'Vì hls.js cần phần tử <code>&lt;video&gt;</code> tồn tại trước khi nó được khởi tạo, mà một lệnh import ở cấp cao nhất thì chạy trước khi DOM được phân tích',
            ),
            B(
              'Because Safari plays HLS natively and never needs the library at all, so a dynamic import means roughly 150 KB is never downloaded by the share of the audience on iOS — which for a Vietnamese consumer app is a large share',
              'Vì Safari phát HLS gốc và hoàn toàn không cần tới thư viện, nên một lệnh import động nghĩa là chừng 150 KB không bao giờ được tải về bởi phần khán giả dùng iOS — mà với một ứng dụng tiêu dùng ở Việt Nam thì đó là một phần lớn',
            ),

          ],
          correct: 3,
          explanation: EX(
            'A payload decision, made where the audience actually is. HLS is Apple\'s format and Safari on both desktop and iOS plays it from a plain <code>src</code> with no JavaScript at all; every other browser needs Media Source Extensions and therefore a library. Writing the import at the top of the module would ship it to everyone including the majority who cannot use it. Option A is a real category of bug in other libraries and not this one — hls.js does not hijack native playback — and options B and C describe constraints that do not exist.',
            'Một quyết định về kích thước gói, đưa ra ngay tại chỗ khán giả thật sự ở. HLS là format của Apple và Safari trên cả máy bàn lẫn iOS phát nó từ một thuộc tính <code>src</code> thuần, không cần JavaScript nào; mọi trình duyệt khác cần Media Source Extensions và do đó cần một thư viện. Viết lệnh import ở đầu module sẽ đẩy nó tới tay tất cả mọi người, kể cả phần đa số không dùng tới. Lựa chọn A là một loại lỗi có thật ở vài thư viện khác chứ không phải ở thư viện này — hls.js không cướp quyền phát gốc — còn lựa chọn B và C mô tả những ràng buộc không tồn tại.',
          ),
        }),

        mcq({
          prompt: B(
            'A 22-second source is segmented at <code>-hls_time 6</code>. The playlist ffmpeg wrote:' + code(
              '#EXT-X-TARGETDURATION:6\n' +
              '#EXTINF:6.000000,  seg-00000.ts\n' +
              '#EXTINF:6.000000,  seg-00001.ts\n' +
              '#EXTINF:6.000000,  seg-00002.ts\n' +
              '#EXTINF:4.000000,  seg-00003.ts',
            ) + 'Which statement about <code>EXT-X-TARGETDURATION</code> is right?',
            'Một nguồn 22 giây được cắt segment ở <code>-hls_time 6</code>. Playlist mà ffmpeg ghi ra:' + code(
              '#EXT-X-TARGETDURATION:6\n' +
              '#EXTINF:6.000000,  seg-00000.ts\n' +
              '#EXTINF:6.000000,  seg-00001.ts\n' +
              '#EXTINF:6.000000,  seg-00002.ts\n' +
              '#EXTINF:4.000000,  seg-00003.ts',
            ) + 'Phát biểu nào về <code>EXT-X-TARGETDURATION</code> là ĐÚNG?',
          ),
          options: [
            B(
              'It is the average <code>EXTINF</code> rounded to the nearest integer, which is why 22 ÷ 4 = 5,5 came out as 6',
              'Đó là trung bình của các <code>EXTINF</code> làm tròn tới số nguyên gần nhất, và đó là lý do 22 ÷ 4 = 5,5 ra thành 6',
            ),
            B(
              'It is the requested <code>-hls_time</code> copied verbatim, so a segment that overruns because a keyframe landed late would not be reflected in it',
              'Đó là giá trị <code>-hls_time</code> chép nguyên xi, nên một segment bị dài quá vì frame khoá rơi muộn sẽ không được phản ánh vào đó',
            ),
            B(
              'It is the LONGEST segment, rounded UP to a whole number of seconds — players use it to size their startup buffer, typically three segments, which is why 6-second targets start more slowly than 2-second ones',
              'Đó là segment DÀI NHẤT, làm tròn LÊN thành số giây nguyên — player dùng nó để định cỡ bộ đệm khởi động, thường là ba segment, và đó là lý do mục tiêu 6 giây khởi động chậm hơn mục tiêu 2 giây',
            ),
            B(
              'It is the number of segments a player must download before starting, which the RFC fixes at three but ffmpeg exposes as a tunable',
              'Đó là số segment mà player phải tải xong trước khi bắt đầu, con số mà RFC ấn định là ba nhưng ffmpeg cho chỉnh',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The measured playlist rules out the average (which would be 5,5 → 6 by luck here, but 5 if the last segment were 2 s) and rules out "copied verbatim" only if you know that a late keyframe can push a segment past the request — which is exactly why the field is defined as a maximum. The practical consequence is the buffer arithmetic: three segments of 6 s is roughly 18 s of startup buffer, and 2-second targets start much faster at the price of tripling your object count and your Class A cost. Six is the usual VOD compromise.',
            'Playlist đã đo loại được phương án trung bình (ở đây may mà 5,5 → 6, nhưng sẽ là 5 nếu segment cuối dài 2 s) và chỉ loại được phương án "chép nguyên xi" nếu bạn biết rằng một frame khoá rơi muộn có thể đẩy một segment vượt quá giá trị đã xin — mà đó đúng là lý do trường này được định nghĩa là một giá trị TỐI ĐA. Hệ quả thực dụng là phép tính bộ đệm: ba segment 6 giây là chừng 18 giây đệm khởi động, còn mục tiêu 2 giây thì khởi động nhanh hơn nhiều với cái giá là gấp ba số object và gấp ba chi phí Class A. Sáu là thoả hiệp thường thấy cho VOD.',
          ),
        }),

        mcq({
          prompt: B(
            'A team is choosing between a plain <code>&lt;video src="clip.mp4"&gt;</code> and an HLS ladder for 90-second clips. Which list correctly names what the plain tag gives them that HLS makes them rebuild?',
            'Một nhóm đang chọn giữa một thẻ <code>&lt;video src="clip.mp4"&gt;</code> thuần và một bậc thang HLS cho các clip 90 giây. Danh sách nào gọi tên ĐÚNG những thứ mà thẻ thuần cho họ và HLS bắt họ dựng lại?',
          ),
          options: [
            B(
              'Adaptive bitrate, CDN caching and seeking — all three are native to the <code>&lt;video&gt;</code> element and all three have to be re-implemented by a JavaScript player',
              'Thích ứng bitrate, cache CDN và tua — cả ba đều là tính năng gốc của phần tử <code>&lt;video&gt;</code> và cả ba đều phải được một player JavaScript cài đặt lại',
            ),
            B(
              'Native controls on every platform — fullscreen, picture-in-picture, AirPlay, casting, playback speed, captions — plus the fact that the tag works with JavaScript disabled, in an RSS reader, in an email preview and in a scraper',
              'Bộ điều khiển gốc trên mọi nền tảng — toàn màn hình, hình-trong-hình, AirPlay, truyền màn hình, tốc độ phát, phụ đề — cộng với việc thẻ ấy chạy được cả khi JavaScript bị tắt, trong một trình đọc RSS, trong bản xem trước của email và trước một con bọ thu thập dữ liệu',
            ),
            B(
              'Byte-range seeking and immutable caching, since HLS segments cannot carry a long <code>Cache-Control</code> and every seek must re-fetch the manifest first',
              'Tua theo khoảng byte và cache bất biến, vì segment HLS không mang được một <code>Cache-Control</code> dài và mỗi lần tua đều phải lấy lại manifest trước',
            ),
            B(
              'Nothing meaningful: outside Safari an HLS stream is played by the same <code>&lt;video&gt;</code> element through Media Source Extensions, so every native control and every caching property carries across unchanged',
              'Chẳng có gì đáng kể: ngoài Safari thì một luồng HLS vẫn do chính phần tử <code>&lt;video&gt;</code> phát thông qua Media Source Extensions, nên mọi nút điều khiển gốc và mọi tính chất cache đều được mang sang nguyên vẹn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Option A puts adaptive bitrate on the wrong side — that is the one thing a single file cannot do and the only thing HLS is buying. Option C is wrong twice: segments ARE immutable and deserve a year, and a VOD manifest is fetched once. Option D is the most defensible wrong answer and it understates the work: the element is the same, but everything the player wires up around it — how a seek maps to a segment, how captions are sourced, how a quality menu is built — is now yours. The zero-JavaScript property in the correct answer is a real reach and accessibility gain, not a purist point.',
            'Lựa chọn A đặt việc thích ứng bitrate nhầm phía — đó chính là thứ DUY NHẤT mà một file đơn không làm được và là thứ duy nhất HLS mua về. Lựa chọn C sai hai lần: segment ĐÚNG LÀ bất biến và xứng đáng cache một năm, còn manifest VOD thì chỉ được lấy một lần. Lựa chọn D là câu trả lời sai dễ bảo vệ nhất và nó đánh giá thấp khối lượng việc: phần tử thì vẫn là phần tử ấy, nhưng mọi thứ mà player đấu nối quanh nó — một lượt tua ánh xạ sang segment nào, phụ đề lấy từ đâu, menu chọn chất lượng dựng ra sao — giờ là việc của bạn. Còn tính chất không-cần-JavaScript trong đáp án đúng là một lợi ích thật về khả năng tiếp cận và độ phủ, không phải một ý kiến thuần tuý học thuật.',
          ),
        }),

        mcq({
          prompt: B(
            'Object counts for the same segment length, at two content lengths:' + code(
              '2-minute clip,  3 renditions, 6 s segments   ~ 20 × 3 + 4  =  64 objects\n' +
              '90-minute film, 3 renditions, 6 s segments   ~900 × 3 + 4  = 2.704 objects',
            ) + 'The course calls the first number a cost and the second one fine. Why is the same arithmetic a problem in one case and not the other?',
            'Số object với cùng độ dài segment, ở hai độ dài nội dung:' + code(
              'clip 2 phút,  3 bản, segment 6 s   ~ 20 × 3 + 4  =  64 object\n' +
              'phim 90 phút, 3 bản, segment 6 s   ~900 × 3 + 4  = 2.704 object',
            ) + 'Giáo trình gọi con số đầu là một cái giá và con số sau là bình thường. Vì sao cùng một phép tính lại là vấn đề ở ca này và không phải vấn đề ở ca kia?',
          ),
          options: [
            B(
              'Because a 2-minute clip will never perform a mid-playback rendition switch, so the 64 objects buy a feature that is never exercised — whereas 2.704 objects buy adaptation for a viewer on a train for an hour and a half, which is exactly the case HLS was designed for',
              'Vì một clip 2 phút sẽ không bao giờ đổi bản giữa chừng, nên 64 object mua về một tính năng chẳng bao giờ được dùng tới — trong khi 2.704 object mua về khả năng thích ứng cho một người xem ngồi trên tàu suốt một tiếng rưỡi, và đó đúng là trường hợp mà HLS được thiết kế cho',
            ),
            B(
              'Because object-storage pricing has a per-object floor, so small objects are penalised and a 90-minute film has segments large enough to clear it while a 2-minute clip does not',
              'Vì giá kho object có một mức sàn tính theo từng object, nên object nhỏ bị phạt, và một bộ phim 90 phút có segment đủ lớn để vượt mức sàn ấy còn một clip 2 phút thì không',
            ),
            B(
              'Because the cost is per object per MONTH, and a film is viewed for far longer than a clip, so the storage cost is amortised across more viewing minutes in the second case',
              'Vì chi phí tính theo từng object mỗi THÁNG, và một bộ phim được xem lâu hơn một clip rất nhiều, nên chi phí lưu trữ được phân bổ trên nhiều phút xem hơn ở ca thứ hai',
            ),
            B(
              'Because a 90-minute film would exceed the manifest size limit as a single progressive file, so HLS is the only option and its cost is not a choice',
              'Vì một bộ phim 90 phút vượt quá giới hạn kích thước manifest nếu để ở dạng một file tuần tự duy nhất, nên HLS là phương án duy nhất và cái giá của nó không phải một lựa chọn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The object count is not a cost you evaluate on its own — it is a price, and a price is only wrong when the thing it buys is not wanted. A short clip on a feed is watched to the end or abandoned within seconds; there is no window in which the network degrades and a rendition switch saves the viewing. Ninety minutes is nothing but such windows. The threshold the course gives is under two minutes progressive, over ten HLS, and the honest test in between is whether a viewer on a degrading connection would rather see 360p than a spinner. Option D invents a limit that does not exist — a progressive MP4 has no size ceiling and the browser Range-fetches it either way.',
            'Số object không phải một cái giá bạn đánh giá tách rời — nó là MỨC GIÁ, và một mức giá chỉ sai khi thứ nó mua về không ai cần. Một clip ngắn trên feed thì hoặc xem hết hoặc bỏ ngang trong vài giây; chẳng có cửa sổ thời gian nào để mạng xấu đi và một lần đổi bản cứu được lượt xem. Chín mươi phút thì toàn là những cửa sổ như thế. Ngưỡng mà giáo trình đưa ra là dưới hai phút dùng tuần tự, trên mười phút dùng HLS, và phép thử thật thà ở khoảng giữa là hỏi xem một người xem trên đường truyền đang xấu đi muốn thấy 360p hay muốn thấy vòng xoay chờ. Lựa chọn D bịa ra một giới hạn không tồn tại — một file MP4 tuần tự không có trần kích thước và trình duyệt thì vẫn tải theo Range dù thế nào.',
          ),
        }),

        mcq({
          prompt: B(
            'A feed shows twenty short videos per screen. The markup is:' + code(
              '<video src="…mp4" poster="…webp" preload="metadata" controls playsinline></video>',
            ) + 'Which claim about these attributes is correct?',
            'Một feed hiển thị hai mươi video ngắn mỗi màn hình. Đoạn mã là:' + code(
              '<video src="…mp4" poster="…webp" preload="metadata" controls playsinline></video>',
            ) + 'Khẳng định nào về những thuộc tính này là ĐÚNG?',
          ),
          options: [
            B(
              '<code>preload="metadata"</code> is the risky one here: it still opens twenty connections, and <code>preload="none"</code> is the only safe setting on a feed',
              '<code>preload="metadata"</code> mới là thứ rủi ro ở đây: nó vẫn mở hai mươi kết nối, và <code>preload="none"</code> là cấu hình an toàn duy nhất trên một feed',
            ),
            B(
              '<code>playsinline</code> is redundant on a feed, because it only affects autoplaying muted videos and these have <code>controls</code>',
              '<code>playsinline</code> là thừa trên một feed, vì nó chỉ ảnh hưởng tới video tự phát ở chế độ tắt tiếng mà mấy cái này thì có <code>controls</code>',
            ),
            B(
              '<code>poster</code> is doing more perceived-performance work than any codec choice in the course: with <code>preload="metadata"</code> no frames are fetched, so without a poster the feed is twenty black rectangles until each video is played',
              '<code>poster</code> đang làm nhiều việc cho cảm giác nhanh hơn bất kỳ lựa chọn codec nào trong khoá này: với <code>preload="metadata"</code> thì không frame nào được tải, nên không có poster thì feed là hai mươi hình chữ nhật đen cho tới khi từng video được bấm phát',
            ),
            B(
              '<code>controls</code> forces the browser to download the first segment so the scrub bar can be drawn, which is why <code>preload</code> is overridden on every browser',
              '<code>controls</code> buộc trình duyệt tải segment đầu để vẽ được thanh tua, và đó là lý do <code>preload</code> bị ghi đè trên mọi trình duyệt',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>preload="metadata"</code> fetches only enough header for the duration and the controls — a few hundred KB, not the video — which is exactly what a feed of twenty wants; <code>preload="auto"</code> would start twenty downloads. The consequence is that no frame is ever decoded, so the poster is the only image the user sees, and a feed of instant thumbnails feels fast even though nothing has loaded. <code>playsinline</code> is not redundant: without it iOS takes video fullscreen on play, which is almost never what a feed wants.',
            '<code>preload="metadata"</code> chỉ tải đủ phần header để biết thời lượng và vẽ thanh điều khiển — vài trăm KB, không phải video — đúng thứ một feed hai mươi cái cần; <code>preload="auto"</code> sẽ khởi động hai mươi lượt tải. Hệ quả là chẳng frame nào được giải mã cả, nên poster là tấm ảnh duy nhất người dùng thấy, và một feed hiện thumbnail tức thì cho cảm giác nhanh dù chưa có gì được nạp. <code>playsinline</code> không thừa: thiếu nó thì iOS đưa video lên toàn màn hình khi bấm phát, và đó gần như không bao giờ là thứ một feed muốn.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — The three numbers that decide an audio file (chapter 4).</b> Implement two functions.</p>' +
            '<p><code>byteWav(rate, ch, giay)</code> returns <code>{ tai, file }</code> — the raw 16-bit PCM payload, and the payload plus <code>WAV_HEADER</code>. The 78-byte constant was measured: every <code>pcm_s16le</code> WAV ffmpeg 8.1.2 wrote came out at exactly <code>rate × 2 × channels × seconds + 78</code>, across five different rate/channel combinations.</p>' +
            '<p><code>keHoach(v)</code> picks a target for one job and returns <code>{ codec, rate, ch, bitrate, byte, viec, lyDo }</code>. Start from <code>DICH[v.loai]</code> and then apply, in this order, the three "never upward" rules from Lesson 4.3 — each one that fires pushes a tag onto <code>lyDo</code>:</p>' +
            '<ul>' +
            '<li>Never resample UP: if <code>nguon.rate</code> is below the target rate, use the source rate and push <code>rate-nguon-thap-hon</code>.</li>' +
            '<li>Never invent channels: take <code>min(target, source)</code>, and push <code>nguon-mono</code> when that lowers it.</li>' +
            '<li>Never re-encode UP: if the source has a bitrate at all and it is below the target, use the source bitrate and push <code>bitrate-nguon-thap-hon</code>.</li>' +
            '</ul>' +
            '<p>Then decide the work. If the source is already compressed, already in the target codec, and needs no reduction (<code>bitrate ≤</code> target and <code>rate ≤</code> target), the answer is <code>GIU-NGUYEN</code> — push <code>nguon-da-dat-dich</code>, and report the SOURCE codec, rate, channels and bitrate rather than the target. Otherwise it is <code>ENCODE</code>. Either way <code>byte</code> is <code>Math.round(bitrate ÷ 8 × giay)</code> using whichever bitrate you reported.</p>' +
            '<p>Keep the given data and the printing loops exactly as they are.</p>',

            '<p><b>Câu 31 — Ba con số quyết định một file âm thanh (chương 4).</b> Hãy cài đặt hai hàm.</p>' +
            '<p><code>byteWav(rate, ch, giay)</code> trả về <code>{ tai, file }</code> — phần tải trọng PCM 16 bit thô, và tải trọng cộng <code>WAV_HEADER</code>. Hằng số 78 byte là đo thật: mọi file WAV <code>pcm_s16le</code> mà ffmpeg 8.1.2 ghi ra đều đúng bằng <code>rate × 2 × số kênh × số giây + 78</code>, trên năm tổ hợp tần số/kênh khác nhau.</p>' +
            '<p><code>keHoach(v)</code> chọn đích cho một công việc và trả về <code>{ codec, rate, ch, bitrate, byte, viec, lyDo }</code>. Hãy bắt đầu từ <code>DICH[v.loai]</code> rồi áp, theo đúng thứ tự này, ba luật "không bao giờ đi lên" của bài 4.3 — mỗi luật nổ thì đẩy một nhãn vào <code>lyDo</code>:</p>' +
            '<ul>' +
            '<li>Không bao giờ lấy mẫu LÊN: nếu <code>nguon.rate</code> thấp hơn tần số đích thì dùng tần số nguồn và đẩy <code>rate-nguon-thap-hon</code>.</li>' +
            '<li>Không bao giờ bịa ra kênh: lấy <code>min(đích, nguồn)</code>, và đẩy <code>nguon-mono</code> khi phép đó làm giảm số kênh.</li>' +
            '<li>Không bao giờ encode LÊN: nếu nguồn có bitrate và bitrate ấy thấp hơn đích thì dùng bitrate nguồn và đẩy <code>bitrate-nguon-thap-hon</code>.</li>' +
            '</ul>' +
            '<p>Rồi quyết định phần việc. Nếu nguồn đã nén sẵn, đã đúng codec đích, và không cần hạ gì nữa (<code>bitrate ≤</code> đích và <code>rate ≤</code> đích) thì kết quả là <code>GIU-NGUYEN</code> — đẩy <code>nguon-da-dat-dich</code>, và báo codec, tần số, số kênh, bitrate CỦA NGUỒN chứ không phải của đích. Ngược lại là <code>ENCODE</code>. Dù đường nào thì <code>byte</code> cũng là <code>Math.round(bitrate ÷ 8 × giay)</code> tính theo đúng bitrate mà bạn đã báo.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và hai vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const WAV_HEADER = 78;                 // đo thật trên ffmpeg 8.1.2, pcm_s16le\n' +
            "const DICH = { thoai: { codec: 'libopus', rate: 16000, ch: 1, bitrate: 24000 },\n" +
            "               nhac:  { codec: 'libmp3lame', rate: 44100, ch: 2, bitrate: 192000 } };\n\n" +
            'const VIEC = [\n' +
            "  { ten: 'ghi-am-dien-thoai.wav', loai: 'thoai', giay: 8,\n" +
            "    nguon: { codec: 'pcm_s16le', rate: 16000, ch: 1, bitrate: null } },\n" +
            "  { ten: 'ghi-am-studio.wav',     loai: 'thoai', giay: 8,\n" +
            "    nguon: { codec: 'pcm_s16le', rate: 48000, ch: 2, bitrate: null } },\n" +
            "  { ten: 'thoai-8k.opus',         loai: 'thoai', giay: 30,\n" +
            "    nguon: { codec: 'libopus', rate: 8000, ch: 1, bitrate: 12000 } },\n" +
            "  { ten: 'thoai-32k.opus',        loai: 'thoai', giay: 30,\n" +
            "    nguon: { codec: 'libopus', rate: 24000, ch: 1, bitrate: 32000 } },\n" +
            "  { ten: 'bai-hat-320.mp3',       loai: 'nhac',  giay: 213,\n" +
            "    nguon: { codec: 'libmp3lame', rate: 44100, ch: 2, bitrate: 320000 } },\n" +
            "  { ten: 'bai-hat-128.mp3',       loai: 'nhac',  giay: 213,\n" +
            "    nguon: { codec: 'libmp3lame', rate: 44100, ch: 2, bitrate: 128000 } },\n" +
            '];\n\n' +
            'const PCM = [\n' +
            '  { rate: 16000, ch: 1, giay: 5 },\n' +
            '  { rate: 44100, ch: 2, giay: 5 },\n' +
            '  { rate: 48000, ch: 2, giay: 5 },\n' +
            '  { rate: 8000,  ch: 1, giay: 5 },\n' +
            '  { rate: 24000, ch: 1, giay: 5 },\n' +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function byteWav(rate, ch, giay) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function keHoach(v) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const p of PCM) {\n' +
            '  const b = byteWav(p.rate, p.ch, p.giay);\n' +
            '  console.log(`PCM ${p.rate} Hz ${p.ch}ch ${p.giay}s -> tai ${b.tai} B, file ${b.file} B`);\n' +
            '}\n' +
            'for (const v of VIEC) {\n' +
            '  const k = keHoach(v);\n' +
            '  console.log(\n' +
            "    `${v.ten} | ${k.codec} ${k.rate} ${k.ch}ch ${k.bitrate ?? '-'} | uoc ${k.byte} B | ${k.viec}` +\n" +
            "    (k.lyDo.length ? ' <- ' + k.lyDo.join(',') : ''),\n" +
            '  );\n' +
            '}\n',
          expectedOutput:
            'PCM 16000 Hz 1ch 5s -> tai 160000 B, file 160078 B\n' +
            'PCM 44100 Hz 2ch 5s -> tai 882000 B, file 882078 B\n' +
            'PCM 48000 Hz 2ch 5s -> tai 960000 B, file 960078 B\n' +
            'PCM 8000 Hz 1ch 5s -> tai 80000 B, file 80078 B\n' +
            'PCM 24000 Hz 1ch 5s -> tai 240000 B, file 240078 B\n' +
            'ghi-am-dien-thoai.wav | libopus 16000 1ch 24000 | uoc 24000 B | ENCODE\n' +
            'ghi-am-studio.wav | libopus 16000 1ch 24000 | uoc 24000 B | ENCODE\n' +
            'thoai-8k.opus | libopus 8000 1ch 12000 | uoc 45000 B | GIU-NGUYEN <- rate-nguon-thap-hon,bitrate-nguon-thap-hon,nguon-da-dat-dich\n' +
            'thoai-32k.opus | libopus 16000 1ch 24000 | uoc 90000 B | ENCODE\n' +
            'bai-hat-320.mp3 | libmp3lame 44100 2ch 192000 | uoc 5112000 B | ENCODE\n' +
            'bai-hat-128.mp3 | libmp3lame 44100 2ch 128000 | uoc 3408000 B | GIU-NGUYEN <- bitrate-nguon-thap-hon,nguon-da-dat-dich',
          sampleSolution:
            'function byteWav(rate, ch, giay) {\n' +
            '  const tai = rate * 2 * ch * giay;      // 16 bit = 2 byte mỗi mẫu mỗi kênh\n' +
            '  return { tai, file: tai + WAV_HEADER };\n' +
            '}\n\n' +
            'function keHoach(v) {\n' +
            '  const dich = DICH[v.loai];\n' +
            '  const n = v.nguon;\n' +
            '  const lyDo = [];\n\n' +
            '  // Không bao giờ lấy mẫu LÊN: nâng tần số không tạo ra thông tin nào\n' +
            '  // mà chỉ nhân số byte lên.\n' +
            '  let rate = dich.rate;\n' +
            "  if (n.rate < rate) { rate = n.rate; lyDo.push('rate-nguon-thap-hon'); }\n\n" +
            '  // Không bao giờ tách một nguồn mono thành stereo.\n' +
            '  let ch = Math.min(dich.ch, n.ch);\n' +
            "  if (ch < dich.ch) lyDo.push('nguon-mono');\n\n" +
            '  // Không bao giờ encode LÊN bitrate cao hơn nguồn đã nén: encoder thứ hai\n' +
            '  // tái tạo trung thành vết nén của encoder thứ nhất rồi thêm vết của mình.\n' +
            '  let bitrate = dich.bitrate;\n' +
            "  if (n.bitrate !== null && n.bitrate < bitrate) { bitrate = n.bitrate; lyDo.push('bitrate-nguon-thap-hon'); }\n\n" +
            '  // Nguồn đã nén, đã đúng codec, và không cần hạ gì nữa thì đừng đụng vào.\n' +
            '  const daDat = n.bitrate !== null && n.codec === dich.codec &&\n' +
            '                n.bitrate <= dich.bitrate && n.rate <= dich.rate;\n' +
            "  const viec = daDat ? 'GIU-NGUYEN' : 'ENCODE';\n" +
            "  if (daDat) lyDo.push('nguon-da-dat-dich');\n\n" +
            '  const codec = daDat ? n.codec : dich.codec;\n' +
            '  const byte = daDat\n' +
            '    ? Math.round(n.bitrate / 8 * v.giay)\n' +
            '    : Math.round(bitrate / 8 * v.giay);\n\n' +
            '  return { codec, rate: daDat ? n.rate : rate, ch: daDat ? n.ch : ch,\n' +
            '           bitrate: daDat ? n.bitrate : bitrate, byte, viec, lyDo };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — The arithmetic behind an HLS ladder (chapter 7).</b> Implement three functions. Every rule was checked against playlists ffmpeg 8.1.2 actually wrote.</p>' +
            '<p><code>bacThangCho(caoNguon)</code> — the rungs of <code>BAC_THANG</code> that are at or below the source height. Never produce a rendition taller than its source; that is the same rule as <code>withoutEnlargement</code> in chapter 1.</p>' +
            '<p><code>hls(nguon)</code> returns <code>{ bac, soSegment, extinfCuoi, targetDuration, soObject, header }</code>:</p>' +
            '<ul>' +
            '<li><code>bac</code> — the kept rung NAMES, in order.</li>' +
            '<li><code>soSegment</code> — <code>Math.ceil(giay / hlsTime)</code>.</li>' +
            '<li><code>extinfCuoi</code> — the duration of the LAST segment: the remainder, or a full <code>hlsTime</code> when the split is exact.</li>' +
            '<li><code>targetDuration</code> — an INTEGER, the longest segment rounded UP.</li>' +
            '<li><code>soObject</code> — every rendition contributes its <code>.ts</code> files plus one media playlist, and the whole ladder adds one master playlist. Verified: a 10-second source at <code>hls_time 2</code> with three renditions produced exactly 19 files on disk.</li>' +
            '<li><code>header</code> — the first six lines of a VOD media playlist, in the exact order ffmpeg emits them: <code>#EXTM3U</code>, the version 6 line, the target-duration line, <code>#EXT-X-MEDIA-SEQUENCE:0</code>, <code>#EXT-X-PLAYLIST-TYPE:VOD</code>, <code>#EXT-X-INDEPENDENT-SEGMENTS</code>.</li>' +
            '</ul>' +
            '<p><code>khuyenNghi(giay)</code> — <code>PROGRESSIVE</code> up to and including 120 s, <code>HLS</code> from 600 s, <code>TUY-XET</code> in between.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Phần số học đằng sau một bậc thang HLS (chương 7).</b> Hãy cài đặt ba hàm. Mọi luật đều đã đối chiếu với playlist mà ffmpeg 8.1.2 thật sự ghi ra.</p>' +
            '<p><code>bacThangCho(caoNguon)</code> — những bậc trong <code>BAC_THANG</code> có chiều cao bằng hoặc thấp hơn nguồn. Đừng bao giờ sinh một bản cao hơn nguồn của nó; đó cũng chính là luật <code>withoutEnlargement</code> của chương 1.</p>' +
            '<p><code>hls(nguon)</code> trả về <code>{ bac, soSegment, extinfCuoi, targetDuration, soObject, header }</code>:</p>' +
            '<ul>' +
            '<li><code>bac</code> — TÊN các bậc được giữ, theo thứ tự.</li>' +
            '<li><code>soSegment</code> — <code>Math.ceil(giay / hlsTime)</code>.</li>' +
            '<li><code>extinfCuoi</code> — thời lượng của segment CUỐI: phần dư, hoặc trọn một <code>hlsTime</code> khi chia hết.</li>' +
            '<li><code>targetDuration</code> — một số NGUYÊN, là segment dài nhất làm tròn LÊN.</li>' +
            '<li><code>soObject</code> — mỗi bản đóng góp các file <code>.ts</code> của nó cộng một media playlist, và cả bậc thang thêm một master playlist. Đã kiểm: một nguồn 10 giây ở <code>hls_time 2</code> với ba bản cho ra đúng 19 file trên đĩa.</li>' +
            '<li><code>header</code> — sáu dòng đầu của một media playlist VOD, đúng thứ tự ffmpeg phát ra: <code>#EXTM3U</code>, dòng version 6, dòng target-duration, <code>#EXT-X-MEDIA-SEQUENCE:0</code>, <code>#EXT-X-PLAYLIST-TYPE:VOD</code>, <code>#EXT-X-INDEPENDENT-SEGMENTS</code>.</li>' +
            '</ul>' +
            '<p><code>khuyenNghi(giay)</code> — <code>PROGRESSIVE</code> cho tới và bao gồm 120 s, <code>HLS</code> từ 600 s trở lên, <code>TUY-XET</code> ở khoảng giữa.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const BAC_THANG = [\n' +
            "  { ten: '360p',  cao: 360,  crf: 26, banthong: 520000  },\n" +
            "  { ten: '480p',  cao: 480,  crf: 24, banthong: 883000  },\n" +
            "  { ten: '720p',  cao: 720,  crf: 23, banthong: 2774000 },\n" +
            "  { ten: '1080p', cao: 1080, crf: 22, banthong: 5200000 },\n" +
            '];\n\n' +
            'const NGUON = [\n' +
            "  { ten: 'clip-720p-10s.mp4',  giay: 10,   cao: 720,  hlsTime: 2 },\n" +
            "  { ten: 'testsrc-22s.mp4',    giay: 22,   cao: 360,  hlsTime: 6 },\n" +
            "  { ten: 'feed-clip-15s.mp4',  giay: 15,   cao: 1080, hlsTime: 6 },\n" +
            "  { ten: 'bai-giang-42p.mp4',  giay: 2520, cao: 1080, hlsTime: 6 },\n" +
            "  { ten: 'phim-90p.mp4',       giay: 5400, cao: 720,  hlsTime: 6 },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function bacThangCho(caoNguon) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function hls(nguon) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function khuyenNghi(giay) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const n of NGUON) {\n' +
            '  const h = hls(n);\n' +
            '  console.log(\n' +
            "    `${n.ten} ${n.giay}s ${n.cao}p hls_time=${n.hlsTime} | bac ${h.bac.join('+') || '(khong)'} | ` +\n" +
            '    `${h.soSegment} segment, EXTINF cuoi ${h.extinfCuoi.toFixed(3)} | TARGETDURATION ${h.targetDuration} | ` +\n' +
            '    `${h.soObject} object | ${khuyenNghi(n.giay)}`,\n' +
            '  );\n' +
            '}\n' +
            "console.log('--- media playlist header cua clip-720p-10s.mp4');\n" +
            'for (const dong of hls(NGUON[0]).header) console.log(dong);\n',
          expectedOutput:
            'clip-720p-10s.mp4 10s 720p hls_time=2 | bac 360p+480p+720p | 5 segment, EXTINF cuoi 2.000 | TARGETDURATION 2 | 19 object | PROGRESSIVE\n' +
            'testsrc-22s.mp4 22s 360p hls_time=6 | bac 360p | 4 segment, EXTINF cuoi 4.000 | TARGETDURATION 6 | 6 object | PROGRESSIVE\n' +
            'feed-clip-15s.mp4 15s 1080p hls_time=6 | bac 360p+480p+720p+1080p | 3 segment, EXTINF cuoi 3.000 | TARGETDURATION 6 | 17 object | PROGRESSIVE\n' +
            'bai-giang-42p.mp4 2520s 1080p hls_time=6 | bac 360p+480p+720p+1080p | 420 segment, EXTINF cuoi 6.000 | TARGETDURATION 6 | 1685 object | HLS\n' +
            'phim-90p.mp4 5400s 720p hls_time=6 | bac 360p+480p+720p | 900 segment, EXTINF cuoi 6.000 | TARGETDURATION 6 | 2704 object | HLS\n' +
            '--- media playlist header cua clip-720p-10s.mp4\n' +
            '#EXTM3U\n' +
            '#EXT-X-VERSION:6\n' +
            '#EXT-X-TARGETDURATION:2\n' +
            '#EXT-X-MEDIA-SEQUENCE:0\n' +
            '#EXT-X-PLAYLIST-TYPE:VOD\n' +
            '#EXT-X-INDEPENDENT-SEGMENTS',
          sampleSolution:
            'function bacThangCho(caoNguon) {\n' +
            '  // Không bao giờ sinh một bậc CAO HƠN nguồn: phóng to không thêm thông tin,\n' +
            '  // chỉ thêm byte. Cùng luật với withoutEnlargement của chương 1.\n' +
            '  return BAC_THANG.filter((b) => b.cao <= caoNguon);\n' +
            '}\n\n' +
            'function hls(nguon) {\n' +
            '  const bac = bacThangCho(nguon.cao);\n' +
            '  const soSegment = Math.ceil(nguon.giay / nguon.hlsTime);\n' +
            '  const du = nguon.giay - (soSegment - 1) * nguon.hlsTime;\n' +
            '  const extinfCuoi = du > 0 ? du : nguon.hlsTime;\n' +
            '  // TARGETDURATION là số NGUYÊN, làm tròn LÊN của segment dài nhất.\n' +
            '  const targetDuration = Math.ceil(Math.max(nguon.hlsTime, extinfCuoi));\n' +
            '  // Mỗi bậc: soSegment file .ts + 1 playlist; cộng 1 master playlist.\n' +
            '  const soObject = bac.length * (soSegment + 1) + 1;\n\n' +
            '  // Sáu dòng đầu của một media playlist VOD, đúng thứ tự ffmpeg 8.1.2 ghi ra.\n' +
            '  const header = [\n' +
            "    '#EXTM3U',\n" +
            "    '#EXT-X-VERSION:6',\n" +
            '    `#EXT-X-TARGETDURATION:${targetDuration}`,\n' +
            "    '#EXT-X-MEDIA-SEQUENCE:0',\n" +
            "    '#EXT-X-PLAYLIST-TYPE:VOD',\n" +
            "    '#EXT-X-INDEPENDENT-SEGMENTS',\n" +
            '  ];\n\n' +
            '  return { bac: bac.map((b) => b.ten), soSegment, extinfCuoi, targetDuration, soObject, header };\n' +
            '}\n\n' +
            'function khuyenNghi(giay) {\n' +
            "  if (giay <= 120) return 'PROGRESSIVE';\n" +
            "  if (giay >= 600) return 'HLS';\n" +
            "  return 'TUY-XET';\n" +
            '}\n',
        }),
      ],
    },
  ],
};
