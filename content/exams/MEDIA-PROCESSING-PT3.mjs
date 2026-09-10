/**
 * Media Processing — Progress Test 3 (chương s08–s10).
 *
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi. Đề giữa kỳ,
 * dễ hơn FE một bậc: hỏi CƠ CHẾ và những con số ỔN ĐỊNH (nội dung playlist,
 * số frame theo loại, số file còn lại trên đĩa), không hỏi số đo thời gian.
 *
 * Ba chương cuối mỏng hơn ba chương đầu — s08 có một bài nội dung, s09 có hai,
 * s10 là bài tổng kết cả khoá — nên phần s10 của đề rút dữ kiện từ toàn khoá,
 * đúng như bài 10.1 làm.
 *
 * ⚠️ MỌI con số, mọi đoạn terminal và mọi playlist dưới đây đều CHẠY THẬT trên
 * đúng bộ công cụ mà đề FE đã dùng:
 *
 *   sharp 0.35.4 · libvips 8.18.6 (aom 3.15.0, webp 1.6.0, heif 1.23.2,
 *   mozjpeg 0826579) · ffmpeg 8.1.2 / ffprobe 8.1.2 (Homebrew, libx264 +
 *   libx265 + libvpx-vp9 + libopus + libmp3lame) · Node v22.21.0 ·
 *   darwin-arm64 · sharp.concurrency() = 8.
 *
 * File mẫu là file TỰ SINH trong một thư mục nháp NGOÀI repo — không đụng
 * `uploads/`, không đụng R2/CDN: các nguồn `testsrc2` 10/22/30 giây,
 * `clip-720p-10s.mp4` (3.645.357 B), một GIF động 48 frame 480×270
 * (345.659 B), một PNG 1280×720 từ `testsrc2` (96.453 B), tám bản một tấm ảnh
 * 4032×3024 mang EXIF Orientation 1–8, và một bậc thang HLS ba bản dựng thật.
 *
 * ⚠️ HAI CHỖ GIÁO TRÌNH KHÁC MÁY — đã đo lại, ĐỀ THEO MÁY. Cả hai đều KHÔNG
 * nằm trong bảy chỗ mà `MEDIA-PROCESSING-FE.mjs` đã ghi:
 *
 *   • **Bài 7.2 nói bỏ `-hls_playlist_type vod` thì playlist thiếu
 *     `#EXT-X-ENDLIST` nên player coi một file đã xong là luồng trực tiếp.**
 *     FE đã ghi nhận rằng trên ffmpeg 8.1.2 CẢ HAI playlist đều kết thúc bằng
 *     `#EXT-X-ENDLIST`, và kết luận rằng khác biệt duy nhất là dòng
 *     `#EXT-X-PLAYLIST-TYPE:VOD`. Đo lại trên một nguồn **DÀI HƠN** — 30 giây ở
 *     `-hls_time 2`, tức 15 segment thay vì 5 — cho thấy khác biệt LỚN HƠN THẾ,
 *     và nó mới là thứ thật sự làm hỏng: không có cờ đó thì `hls_list_size`
 *     giữ giá trị mặc định **5**, nên playlist chỉ liệt kê **năm segment cuối**
 *     và mở đầu bằng `#EXT-X-MEDIA-SEQUENCE:10`. Hai mươi giây đầu của video
 *     ĐƠN GIẢN LÀ KHÔNG CÓ TRONG PLAYLIST. Clip 10 giây mà FE đo vừa đúng
 *     5 segment nên hiện tượng này bị che mất. Câu 6 hỏi đúng phép đo này.
 *
 *   • **Bài 8.1 nói `-tune zerolatency` "tắt B-frame và lookahead, tốn thêm
 *     khoảng 10–15% byte".** Chiều thì đúng và cơ chế thì đúng — đo trên một
 *     nguồn `testsrc2` 5 giây, bản mặc định có `I=1 P=50 B=99` và
 *     `has_b_frames=2`, còn bản `-tune zerolatency` có `I=1 P=149 B=0` và
 *     `has_b_frames=0`. Nhưng **độ lớn thì không**: 613.144 B so với 340.248 B,
 *     tức là **+80%**, không phải 10–15%. Nguồn tổng hợp chuyển động mạnh không
 *     đại diện cho video thật, nên câu 4 chỉ hỏi thứ ĐẾM ĐƯỢC là số frame theo
 *     loại, và KHÔNG ra đề theo tỉ lệ byte.
 *
 * ⚠️ NHỮNG SỐ ĐO ĐÃ TRÁNH RA ĐỀ (không ổn định hoặc không tái hiện được):
 *   • **Mọi phép đo THỜI GIAN.** Máy này đang chạy nhiều agent khác. Không có
 *     một con số mili-giây nào trong đề. Những con số độ trễ trong đề (0,5 s
 *     mã hoá, 0,3 s CDN…) là THAM SỐ CỦA BÀI TOÁN cho sẵn để tính, không phải
 *     số đo trên máy này — câu 2 và câu 31 nói rõ điều đó.
 *   • **Tỉ lệ byte của `-tune zerolatency`** — xem trên.
 *   • **Chi phí thật của một SFU WebRTC theo số người tham gia**: không dựng
 *     được ở đây, nên câu 8 hỏi HÌNH DẠNG của hệ thống (có CDN được không, chi
 *     phí theo ai) chứ không hỏi con số.
 *   • Dữ kiện phía trình duyệt, giá dịch vụ và mốc độ trễ của từng tầng là dữ
 *     kiện TRÍCH DẪN — những câu chạm tới chúng đều hỏi cơ chế.
 *
 * Phân bố câu theo chương:
 *   s08 live và thời gian thực .... 10  (q1–q10)
 *   s09 chẩn đoán ................. 10  (q11–q20)
 *   s10 tổng kết cả khoá .......... 10  (q21–q30)
 *   2 câu lập trình ............... q31 (cửa sổ trượt live) · q32 (khẳng định đầu ra)
 *
 * Phân bố vị trí đáp án — 28 câu một đáp án + 2 câu "chọn HAI" = 32 lượt chọn,
 * chia A 8 · B 8 · C 8 · D 8. Kiểm bằng:
 *   node -e "import('./content/exams/MEDIA-PROCESSING-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>q.kind==='MCQ').forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/MEDIA-PROCESSING-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/media-exam-kit.mjs';

export default {
  course: { slug: 'media-processing' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 8–10 (live media, the diagnosis cookbook, and what survived measurement)',
        'Kiểm tra tiến độ 3 — Chương 8–10 (media trực tiếp, sách công thức chẩn đoán, và những gì sống sót qua phép đo)',
      ),
      description: B(
        'Final third of the Media Processing course: the three latency tiers and what each one costs, live HLS as a sliding window, the symptom-to-cause table, the bugs that return HTTP 200, and the rules and measurements the whole course reduces to. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá Media Processing: ba tầng độ trễ và cái giá của từng tầng, HLS trực tiếp như một cửa sổ trượt, bảng từ triệu chứng tới nguyên nhân, những bug trả về HTTP 200, và tập luật cùng những con số mà cả khoá rút gọn lại thành. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '8–10'),
      questions: [
        // ── Chương 8 — Live và thời gian thực ───────────────────────────
        mcq({
          prompt: B(
            'The three live architectures, with one row deliberately wrong:' + code(
              'TIER   LATENCY      PROTOCOL          SERVER NEEDED        SCALES ON\n' +
              '────  ──────────   ───────────────   ──────────────────   ──────────────\n' +
              'A      15-45 s      HLS / DASH        none beyond storage  a CDN, flat cost\n' +
              'B      2-6 s        LL-HLS            an origin that can   a CDN, more\n' +
              '                                     serve partial segs   origin pressure\n' +
              'C      100-500 ms   WebRTC            an SFU, stateful     a CDN, flat cost\n',
            ) + 'Which cell is wrong, and why does it matter more than the others would?',
            'Ba kiến trúc phát trực tiếp, trong đó có một ô cố ý sai:' + code(
              'TẦNG   ĐỘ TRỄ       GIAO THỨC         CẦN MÁY CHỦ GÌ       CO GIÃN NHỜ\n' +
              '────  ──────────   ───────────────   ──────────────────   ──────────────\n' +
              'A      15-45 s      HLS / DASH        không cần gì ngoài   một CDN, chi phí\n' +
              '                                     kho lưu trữ          phẳng\n' +
              'B      2-6 s        LL-HLS            một origin phục vụ   một CDN, áp lực\n' +
              '                                     được segment từng    lên origin nhiều\n' +
              '                                     phần                 hơn\n' +
              'C      100-500 ms   WebRTC            một SFU, có trạng    một CDN, chi phí\n' +
              '                                     thái                 phẳng\n',
            ) + 'Ô nào sai, và vì sao nó quan trọng hơn những ô khác nếu chúng sai?',
          ),
          options: [
            B(
              'Tier C does not ride a CDN at all — media flows between endpoints as packets, never as cacheable files, so the cost scales PER PARTICIPANT and a 50-person room is 50 inbound streams and up to 2.450 outbound forwards. That is the cell that turns an easy scaling story into a hard one, and it is the one people carry over from the tier above by habit',
              'Tầng C hoàn toàn không đi trên CDN — media chảy giữa các đầu cuối dưới dạng gói tin, không bao giờ dưới dạng file cache được, nên chi phí co giãn THEO TỪNG NGƯỜI THAM GIA và một phòng 50 người là 50 luồng vào cùng tới 2.450 lượt chuyển tiếp ra. Đó là cái ô biến một câu chuyện co giãn dễ thành một câu chuyện khó, và cũng là cái ô người ta hay mang theo từ tầng trên xuống theo thói quen',
            ),
            B(
              'Tier A\'s latency is wrong — 15-45 s describes DASH, while HLS with the standard 6-second segments lands at 8-12 s, and the gap is what makes Tier B unnecessary for most products',
              'Độ trễ của tầng A sai — 15-45 s là mô tả cho DASH, còn HLS với segment 6 giây tiêu chuẩn thì rơi vào 8-12 s, và chính khoảng cách ấy làm cho tầng B trở nên không cần thiết với phần lớn sản phẩm',
            ),
            B(
              'Tier B\'s server requirement is wrong — LL-HLS is served from ordinary object storage exactly like Tier A, and the only difference is the segment length written by the encoder',
              'Yêu cầu máy chủ của tầng B sai — LL-HLS được phục vụ từ kho object bình thường y hệt tầng A, và khác biệt duy nhất là độ dài segment mà bộ encode ghi ra',
            ),
            B(
              'Tier A\'s server column is wrong — an HLS live stream needs an origin process to rewrite the rolling playlist, so "none beyond storage" understates the infrastructure by one long-running service',
              'Cột máy chủ của tầng A sai — một luồng HLS trực tiếp cần một tiến trình origin để ghi lại cái playlist đang trượt, nên "không cần gì ngoài kho lưu trữ" nói thiếu mất một dịch vụ chạy thường trực',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Tiers A and B both put files on a CDN and inherit its economics; Tier C has no files, so there is nothing to cache and nothing to fan out cheaply. That single property is what makes WebRTC an order of magnitude more expensive and what makes capacity something you plan in advance rather than something that just works — plus a TURN relay for the 10-20% of connections that cannot reach each other directly and whose bandwidth you pay for. Option D is close to a fair objection: the encoder does write the playlist, but it is the encoder, not a separate scaled tier, and the distinction the table is drawing is about what has to SCALE.',
            'Tầng A và B đều đặt file lên một CDN và thừa hưởng kinh tế học của nó; tầng C thì không có file nào, nên chẳng có gì để cache và chẳng có gì để nhân bản ra rẻ tiền. Đúng một tính chất ấy làm cho WebRTC đắt hơn một bậc độ lớn và làm cho năng lực trở thành thứ phải dự trù trước chứ không phải thứ tự nhiên chạy được — cộng thêm một TURN relay cho 10-20% số kết nối không tự tìm được tới nhau và bạn phải trả băng thông cho chúng. Lựa chọn D gần với một phản biện công bằng: bộ encode đúng là có ghi playlist, nhưng đó là bộ encode chứ không phải một tầng riêng phải co giãn, và điều mà cái bảng đang phân biệt là thứ gì phải CO GIÃN.',
          ),
        }),

        mcq({
          prompt: B(
            'A Tier-1 HLS pipeline is budgeted with these numbers (the segment length and the player buffer are configuration; the rest are stated as the design assumes them):' + code(
              'capture + encode                    0,5 s\n' +
              'fill one segment                    hls_time\n' +
              'upload the segment to the origin    0,5 s\n' +
              'CDN pull on first request           0,3 s\n' +
              "player buffers N segments           N × hls_time",
            ) + 'Which term dominates, and what is the only way to reduce it without a protocol change?',
            'Một đường ống HLS tầng 1 được dự trù bằng những con số này (độ dài segment và độ sâu bộ đệm của player là cấu hình; phần còn lại là giả thiết thiết kế):' + code(
              'thu + mã hoá                        0,5 s\n' +
              'lấp đầy một segment                 hls_time\n' +
              'đẩy segment lên origin              0,5 s\n' +
              'CDN kéo về ở lượt xin đầu tiên      0,3 s\n' +
              "player đệm N segment                N × hls_time",
            ) + 'Số hạng nào chi phối, và cách duy nhất để giảm nó mà không đổi giao thức là gì?',
          ),
          options: [
            B(
              'The segment upload, because it is serial with the fill and therefore adds directly; moving the origin closer to the encoder is the standard fix',
              'Lượt đẩy segment lên origin, vì nó nối tiếp với việc lấp đầy nên cộng thẳng vào; đưa origin lại gần bộ encode hơn là cách sửa tiêu chuẩn',
            ),            B(
              'The CDN pull, because it happens once per segment per edge and there are many edges; pre-warming the CDN removes it entirely',
              'Lượt CDN kéo về, vì nó xảy ra một lần cho mỗi segment ở mỗi edge và edge thì nhiều; làm nóng CDN trước sẽ khử hẳn nó',
            ),
            B(
              'The encode, because <code>-tune zerolatency</code> is what removes the multi-frame lookahead delay and nothing else in the list is under your control',
              'Lượt mã hoá, vì <code>-tune zerolatency</code> là thứ khử được độ trễ do nhìn trước nhiều frame, và không thứ nào khác trong danh sách nằm trong tầm kiểm soát của bạn',
            ),
            B(
              'The player buffer, because it is <code>N × hls_time</code> and N is typically 3 — shortening the segment shrinks BOTH that term and the fill term, at the price of tripling the object count and the manifest refresh rate',
              'Bộ đệm của player, vì nó là <code>N × hls_time</code> và N thường bằng 3 — rút ngắn segment sẽ co CẢ số hạng đó LẪN số hạng lấp đầy, với cái giá là gấp ba số object và gấp ba tần suất làm mới manifest',
            ),

          ],
          correct: 3,
          explanation: EX(
            'Put numbers in: at <code>hls_time</code> 6 and N = 3, the buffer alone is 18 s against 1,3 s for everything except the fill. At <code>hls_time</code> 2 the same pipeline is 6 s of buffer plus 2 s of fill. The segment length appears twice in the sum, which is why it is the lever — and the cost is that a 2-second target triples the object count and the Class A charges, and makes every player refresh the manifest three times as often. Not all players let you go below three buffered segments, which is why the protocol change (LL-HLS with partial segments) exists at all.',
            'Hãy thay số vào: với <code>hls_time</code> bằng 6 và N bằng 3 thì riêng bộ đệm đã là 18 s so với 1,3 s của mọi thứ trừ phần lấp đầy. Với <code>hls_time</code> bằng 2 thì cũng đường ống ấy là 6 s đệm cộng 2 s lấp đầy. Độ dài segment xuất hiện HAI lần trong tổng, và đó là lý do nó là đòn bẩy — còn cái giá là mục tiêu 2 giây làm gấp ba số object và gấp ba khoản Class A, đồng thời khiến mọi player làm mới manifest nhiều gấp ba. Không phải player nào cũng cho hạ xuống dưới ba segment đệm, và đó chính là lý do việc đổi giao thức (LL-HLS với segment từng phần) tồn tại.',
          ),
        }),

        mcq({
          prompt: B(
            'A live-commerce product needs viewers 2-4 seconds behind rather than 25, so the team moves from HLS to LL-HLS. What does that change require, beyond shorter segments?',
            'Một sản phẩm bán hàng trực tiếp cần người xem chậm 2-4 giây thay vì 25 giây, nên nhóm chuyển từ HLS sang LL-HLS. Thay đổi ấy đòi hỏi gì, ngoài việc segment ngắn đi?',
          ),
          options: [
            B(
              'A WebRTC signalling path, because below about five seconds the player must negotiate directly with the encoder rather than fetching over HTTP',
              'Một đường signalling của WebRTC, vì dưới khoảng năm giây thì player phải thương lượng trực tiếp với bộ encode chứ không lấy qua HTTP nữa',
            ),
            B(
              'Nothing structural — shortening <code>-hls_time</code> to 1 or 2 seconds and reducing the player buffer is the whole change, which is why LL-HLS is described as a configuration rather than a protocol',
              'Chẳng đòi hỏi gì về cấu trúc — rút <code>-hls_time</code> xuống 1 hay 2 giây và giảm bộ đệm của player là toàn bộ thay đổi, và đó là lý do LL-HLS được mô tả như một cấu hình chứ không phải một giao thức',
            ),
            B(
              'An ORIGIN that can serve PARTIAL segments — a piece of a segment that is still being written — because below a few seconds you cannot wait for a segment to be complete before publishing it; the CDN still works, but the origin is no longer just a bucket',
              'Một ORIGIN phục vụ được segment TỪNG PHẦN — một mẩu của segment còn đang được ghi — vì dưới vài giây thì bạn không thể chờ một segment hoàn tất rồi mới công bố; CDN thì vẫn dùng được, nhưng origin không còn chỉ là một cái bucket nữa',
            ),
            B(
              'A second encoder, because the low-latency ladder must be produced in parallel with the standard one so players that do not support LL-HLS can fall back',
              'Một bộ encode thứ hai, vì bậc thang độ trễ thấp phải được dựng song song với bậc thang tiêu chuẩn để những player không hỗ trợ LL-HLS còn có chỗ lùi về',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Tier 1\'s single largest latency term is "you cannot publish a segment until it is complete", and shortening the segment only shrinks that term — it never removes it, and it multiplies your object count while doing so. LL-HLS attacks the term itself by publishing partial segments and letting a player block on a playlist reload until the next part exists, which is why the origin has to do something a static bucket cannot. That is the whole reason the course calls Tier 1 → Tier 2 "a re-encode and an origin change" rather than a settings tweak, and Tier 2 → Tier 3 a rewrite.',
            'Số hạng độ trễ lớn nhất của tầng 1 là "không thể công bố một segment trước khi nó hoàn tất", và rút ngắn segment chỉ làm nhỏ số hạng ấy đi — nó không bao giờ khử được, mà lại nhân số object lên trong lúc làm vậy. LL-HLS đánh thẳng vào chính số hạng đó bằng cách công bố segment từng phần và cho player chờ ngay trong một lượt tải lại playlist cho tới khi phần tiếp theo xuất hiện, và đó là lý do origin phải làm được thứ mà một cái bucket tĩnh không làm nổi. Đó cũng là toàn bộ lý do giáo trình gọi bước tầng 1 sang tầng 2 là "encode lại cộng đổi origin" chứ không phải chỉnh vài cấu hình, còn tầng 2 sang tầng 3 là viết lại.',
          ),
        }),

        mcq({
          prompt: B(
            'The same 5-second source encoded twice, and every frame\'s <code>pict_type</code> counted with ffprobe:' + code(
              'default            I=1  P=50   B=99    has_b_frames=2\n' +
              '-tune zerolatency  I=1  P=149  B=0     has_b_frames=0',
            ) + 'What does the B-frame count have to do with latency?',
            'Cùng một nguồn 5 giây được encode hai lần, và <code>pict_type</code> của từng frame được đếm bằng ffprobe:' + code(
              'mặc định           I=1  P=50   B=99    has_b_frames=2\n' +
              '-tune zerolatency  I=1  P=149  B=0     has_b_frames=0',
            ) + 'Số lượng B-frame liên quan gì tới độ trễ?',
          ),
          options: [
            B(
              'B-frames are larger than P-frames, so removing them shrinks each segment and a smaller segment uploads faster — the latency saving is a bandwidth saving',
              'B-frame lớn hơn P-frame, nên bỏ chúng đi làm mỗi segment nhỏ lại và segment nhỏ hơn thì đẩy lên nhanh hơn — phần tiết kiệm độ trễ chính là phần tiết kiệm băng thông',
            ),
            B(
              'A B-frame is predicted from frames on BOTH sides of it, so the encoder must hold future frames before it can emit the current one — <code>has_b_frames=2</code> is literally a two-frame delay built into the encode, and zerolatency trades it away',
              'Một B-frame được dự đoán từ các frame ở CẢ HAI PHÍA của nó, nên encoder phải giữ lại các frame tương lai trước khi phát ra được frame hiện tại — <code>has_b_frames=2</code> đúng nghĩa là một độ trễ hai frame nằm sẵn trong lượt encode, và zerolatency đánh đổi nó đi',
            ),
            B(
              'B-frames cannot start a segment, so a stream containing them needs more keyframes, and more keyframes is what costs the extra latency',
              'B-frame không mở đầu được một segment, nên một luồng có chúng cần nhiều frame khoá hơn, và nhiều frame khoá hơn chính là thứ tốn thêm độ trễ',
            ),
            B(
              'The counts show the encoder switched to a different profile; the latency saving comes from the profile change and the B-frame count is a side effect of it',
              'Các con số cho thấy encoder đã chuyển sang một profile khác; phần tiết kiệm độ trễ đến từ việc đổi profile còn số B-frame chỉ là hệ quả phụ',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The 150 frames are conserved: 99 B-frames become P-frames, and <code>has_b_frames</code> goes from 2 to 0. That field IS the delay — it is how many frames the decoder (and the encoder) must hold to reorder correctly. Bidirectional prediction is also what makes B-frames CHEAPER than P-frames, not larger, so option A has the size relationship backwards: this encode came out bigger without them. The measured size penalty here was +80%, far above the 10–15% the course quotes, but the source is high-motion synthetic video and that figure should not be carried to real content.',
            '150 frame được bảo toàn: 99 B-frame biến thành P-frame, và <code>has_b_frames</code> đi từ 2 xuống 0. Chính cái trường ấy LÀ độ trễ — nó là số frame mà bộ giải mã (và bộ mã hoá) phải giữ để sắp lại thứ tự cho đúng. Dự đoán hai chiều cũng chính là thứ khiến B-frame RẺ HƠN P-frame chứ không lớn hơn, nên lựa chọn A nói ngược quan hệ kích thước: lượt encode này ra TO HƠN khi không có chúng. Mức phạt kích thước đo được ở đây là +80%, cao hơn hẳn con số 10–15% mà giáo trình nêu, nhưng nguồn là video tổng hợp chuyển động mạnh và con số đó không nên mang sang nội dung thật.',
          ),
        }),

        mcq({
          prompt: B(
            'A product ships on Tier 1 (HLS on a CDN, viewers ~25 s behind) and later needs Tier 2 (~3 s), then Tier 3 (conversation). Which description of the two migrations is right?',
            'Một sản phẩm ra mắt ở tầng 1 (HLS trên CDN, người xem chậm ~25 s) rồi về sau cần tầng 2 (~3 s), sau nữa là tầng 3 (hội thoại). Mô tả nào về hai cuộc di trú ấy là đúng?',
          ),
          options: [
            B(
              'Both are incremental: each tier is the previous one with shorter segments and a smaller buffer, so the migration is a settings change plus a player upgrade in each case',
              'Cả hai đều tăng dần: mỗi tầng là tầng trước với segment ngắn hơn và bộ đệm nhỏ hơn, nên mỗi cuộc di trú là một lần đổi cấu hình cộng một lần nâng cấp player',
            ),
            B(
              'Tier 1 → Tier 2 is a re-encode plus an origin change, because the shape of the delivery is the same and only the origin gains a new capability; Tier 2 → Tier 3 is a rewrite, because there stop being files at all — different transport, different server, different cost model, and a CDN that no longer applies',
              'Tầng 1 sang tầng 2 là encode lại cộng đổi origin, vì hình dạng của việc phân phối vẫn thế và chỉ origin có thêm một khả năng mới; tầng 2 sang tầng 3 là viết lại, vì từ đó không còn file nào nữa — khác vận chuyển, khác máy chủ, khác mô hình chi phí, và một CDN không còn áp dụng được',
            ),
            B(
              'Both are rewrites: HTTP delivery and peer delivery share no components, and LL-HLS is a peer protocol wearing an HTTP costume, which is why partial segments need a persistent connection',
              'Cả hai đều là viết lại: phân phối qua HTTP và phân phối ngang hàng không dùng chung linh kiện nào, còn LL-HLS là một giao thức ngang hàng khoác áo HTTP, đó là lý do segment từng phần cần một kết nối thường trực',
            ),
            B(
              'Tier 1 → Tier 2 is the rewrite (the manifest format changes incompatibly) and Tier 2 → Tier 3 is incremental, because an SFU can transcode its own output to LL-HLS and keep the existing player working',
              'Tầng 1 sang tầng 2 mới là viết lại (định dạng manifest đổi không tương thích) còn tầng 2 sang tầng 3 thì tăng dần, vì một SFU có thể transcode chính đầu ra của nó sang LL-HLS và giữ nguyên player đang có',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Option D is the interesting near-miss: an SFU transcoding out to LL-HLS is exactly the hybrid the chapter recommends for live commerce — host on Tier 3, audience on Tier 2 — but that is a system you BUILD alongside, not a migration path that carries your Tier 2 stack forward. The asymmetry is worth internalising before you choose a tier: within the HTTP tiers you are changing configuration and one component; crossing into WebRTC you are giving up files, and with them the CDN, the flat cost, and the ability to be surprised by 100.000 viewers.',
            'Lựa chọn D là cái suýt đúng thú vị: một SFU transcode ra LL-HLS đúng là kiến trúc lai mà chương này khuyến nghị cho bán hàng trực tiếp — người dẫn ở tầng 3, khán giả ở tầng 2 — nhưng đó là một hệ thống bạn DỰNG THÊM bên cạnh, không phải một đường di trú mang được ngăn xếp tầng 2 của bạn đi tiếp. Tính bất đối xứng ấy đáng ghi nhớ TRƯỚC khi chọn tầng: trong phạm vi các tầng HTTP thì bạn đang đổi cấu hình và một thành phần; bước sang WebRTC là bạn từ bỏ file, và cùng với file là CDN, là chi phí phẳng, và là khả năng bị bất ngờ bởi 100.000 người xem.',
          ),
        }),

        mcq({
          prompt: B(
            'A finished 30-second file is segmented WITHOUT <code>-hls_playlist_type vod</code>, and the resulting playlist is diffed against the one produced WITH it:' + code(
              'with vod      MEDIA-SEQUENCE:0 · PLAYLIST-TYPE:VOD · 15 entries · ENDLIST\n' +
              'without vod   MEDIA-SEQUENCE:10 ·  (no type line)  ·  5 entries · ENDLIST\n' +
              '\n' +
              'both: 15 .ts files on disk',
            ) + 'Choose <b>TWO</b> statements the measurement supports.',
            'Một file đã hoàn tất dài 30 giây được cắt segment mà KHÔNG có <code>-hls_playlist_type vod</code>, rồi playlist thu được đem so với bản CÓ cờ đó:' + code(
              'có vod       MEDIA-SEQUENCE:0 · PLAYLIST-TYPE:VOD · 15 mục · ENDLIST\n' +
              'không có vod MEDIA-SEQUENCE:10 · (không có dòng type) ·  5 mục · ENDLIST\n' +
              '\n' +
              'cả hai: 15 file .ts trên đĩa',
            ) + 'Chọn <b>HAI</b> phát biểu mà phép đo này chứng minh.',
          ),
          options: [
            B(
              'Without the flag <code>hls_list_size</code> keeps its default of 5, so the playlist is a sliding window even though the source was finite — twenty of the thirty seconds are simply not listed, while all 15 segment files sit on disk unreferenced',
              'Không có cờ đó thì <code>hls_list_size</code> giữ mặc định là 5, nên playlist là một cửa sổ trượt dù nguồn là hữu hạn — hai mươi trong ba mươi giây đơn giản là KHÔNG được liệt kê, trong khi cả 15 file segment nằm trên đĩa mà không ai tham chiếu',
            ),
            B(
              'The failure would not have shown up on a 10-second source at this segment length, because five segments is exactly what the default window holds — a shorter test file hides the whole effect',
              'Kiểu hỏng này sẽ KHÔNG lộ ra trên một nguồn 10 giây ở cùng độ dài segment, vì năm segment đúng bằng sức chứa của cửa sổ mặc định — một file thử ngắn hơn che mất toàn bộ hiện tượng',
            ),
            B(
              'Since both playlists end with <code>#EXT-X-ENDLIST</code>, the flag has no effect on this build of ffmpeg and can be dropped from the VOD recipe',
              'Vì cả hai playlist đều kết thúc bằng <code>#EXT-X-ENDLIST</code>, cái cờ ấy không có tác dụng gì trên bản dựng ffmpeg này và bỏ khỏi công thức VOD được',
            ),
            B(
              'The unflagged playlist is what a player would treat as live, so it will poll the manifest forever waiting for segments that will never arrive',
              'Playlist không có cờ là thứ mà player sẽ coi là luồng trực tiếp, nên nó sẽ hỏi lại manifest mãi mãi để chờ những segment không bao giờ tới',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'The course predicts a missing <code>ENDLIST</code>; ffmpeg 8.1.2 writes it either way, which rules out the live-polling option — a player reading the unflagged file sees an ended stream, just a very short one. What actually breaks is bigger and duller: the default <code>hls_list_size 5</code> truncates the playlist, so two thirds of the video is unreachable. The "drop the flag" option draws the wrong lesson from the same fact: the flag matters more than the course said, not less. And the short-fixture option is the methodological point worth keeping — the effect is invisible whenever the test clip fits inside the default window, which is exactly why a 10-second fixture reported "the only difference is one line".',
            'Giáo trình dự đoán sẽ thiếu <code>ENDLIST</code>; ffmpeg 8.1.2 ghi nó trong cả hai trường hợp, và điều đó loại phương án nói rằng player sẽ hỏi lại mãi — một player đọc file không có cờ sẽ thấy một luồng đã kết thúc, chỉ là rất ngắn. Thứ thật sự hỏng thì lớn hơn và nhạt nhẽo hơn: mặc định <code>hls_list_size 5</code> cắt cụt playlist, nên hai phần ba video không với tới được. Phương án "bỏ cờ đi được" rút ra bài học ngược từ cùng một sự việc: cái cờ ấy QUAN TRỌNG HƠN giáo trình nói, chứ không phải kém đi. Còn phương án về file thử ngắn là điểm phương pháp đáng giữ — hiện tượng này vô hình mỗi khi clip thử lọt gọn trong cửa sổ mặc định, và đó đúng là lý do một file mẫu 10 giây báo về rằng "khác biệt duy nhất là một dòng".',
          ),
        }),

        mcq({
          prompt: B(
            'The live command deliberately omits <code>-hls_playlist_type vod</code>, so the stream is never declared complete. Yet the playlist left behind by a real 30-second live-style run ends like this:' + code(
              '#EXT-X-MEDIA-SEQUENCE:9\n' +
              '#EXTINF:2.000000,\n' +
              'seg-00014.ts\n' +
              '#EXT-X-ENDLIST',
            ) + 'Why is <code>#EXT-X-ENDLIST</code> there, and what would a genuinely live encoder produce?',
            'Câu lệnh phát trực tiếp cố ý bỏ <code>-hls_playlist_type vod</code> để luồng không bao giờ bị khai là đã hoàn tất. Vậy mà playlist còn lại sau một lượt chạy kiểu-trực-tiếp dài 30 giây lại kết thúc thế này:' + code(
              '#EXT-X-MEDIA-SEQUENCE:9\n' +
              '#EXTINF:2.000000,\n' +
              'seg-00014.ts\n' +
              '#EXT-X-ENDLIST',
            ) + 'Vì sao có <code>#EXT-X-ENDLIST</code> ở đó, và một bộ encode trực tiếp thật sự sẽ cho ra cái gì?',
          ),
          options: [
            B(
              'Because the input was a finite 30-second file, so the muxer reached the end and closed cleanly — writing ENDLIST is what a clean close DOES. A real live source never ends, so the muxer never closes and the tag never appears; the flag\'s absence is about not DECLARING the playlist a complete VOD, not about suppressing a tag on shutdown',
              'Vì đầu vào là một file hữu hạn dài 30 giây, nên muxer chạm tới cuối và đóng lại sạch sẽ — ghi ENDLIST chính là VIỆC mà một lượt đóng sạch sẽ làm. Một nguồn trực tiếp thật thì không bao giờ kết thúc, nên muxer không bao giờ đóng và cái thẻ ấy không bao giờ xuất hiện; việc thiếu cái cờ kia nói về chuyện không KHAI playlist là một bản VOD hoàn chỉnh, chứ không phải chuyện chặn một cái thẻ lúc tắt',
            ),
            B(
              'Because <code>-hls_flags delete_segments</code> implies a finite stream — a window that discards segments is by definition bounded — so ffmpeg writes ENDLIST to tell players the discarded segments will not return',
              'Vì <code>-hls_flags delete_segments</code> ngầm hiểu luồng là hữu hạn — một cửa sổ có vứt bỏ segment thì theo định nghĩa là có giới hạn — nên ffmpeg ghi ENDLIST để báo cho player rằng các segment đã bị bỏ sẽ không quay lại',
            ),
            B(
              'Because ENDLIST is written whenever <code>#EXT-X-MEDIA-SEQUENCE</code> is non-zero: the tag pair is what tells a player it has joined a stream in progress rather than at the start',
              'Vì ENDLIST được ghi mỗi khi <code>#EXT-X-MEDIA-SEQUENCE</code> khác 0: cặp thẻ ấy là thứ báo cho player biết nó vào một luồng đang chạy dở chứ không phải vào từ đầu',
            ),
            B(
              'Because ffmpeg 8.1.2 always writes ENDLIST, which is why the course\'s advice about the flag is obsolete on this build and the tag can no longer be used to tell a live playlist from a VOD one',
              'Vì ffmpeg 8.1.2 luôn luôn ghi ENDLIST, và đó là lý do lời khuyên của giáo trình về cái cờ ấy đã lỗi thời trên bản dựng này và người ta không còn dùng cái thẻ đó để phân biệt playlist trực tiếp với playlist VOD được nữa',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The measurement is real and the inference people draw from it usually is not. ENDLIST means "this playlist will not grow", and a muxer that has consumed its whole input knows that to be true — a camera or an RTMP push does not, so it keeps appending and the tag never gets written. Option D over-generalises exactly the way the course warns about elsewhere: the tag DOES still distinguish live from VOD in production, because in production the live input has not ended. The way to test a live pipeline honestly is to interrupt it while it is running, not to feed it a file and read the tombstone.',
            'Phép đo là thật còn suy luận mà người ta thường rút ra từ nó thì thường không. ENDLIST nghĩa là "playlist này sẽ không dài thêm nữa", và một muxer đã ngốn hết đầu vào của nó thì biết điều đó là đúng — một cái camera hay một luồng RTMP đẩy vào thì không, nên nó cứ nối thêm và cái thẻ ấy không bao giờ được ghi. Lựa chọn D khái quát hoá quá tay đúng theo kiểu mà giáo trình cảnh báo ở chỗ khác: cái thẻ ấy VẪN phân biệt được trực tiếp với VOD ở production, vì ở production thì đầu vào trực tiếp chưa kết thúc. Cách kiểm một đường ống trực tiếp một cách thật thà là NGẮT nó giữa chừng, chứ không phải cho nó ăn một cái file rồi đi đọc bia mộ.',
          ),
        }),

        mcq({
          prompt: B(
            'Below roughly two seconds of latency, HTTP segment delivery stops working and WebRTC becomes the only option. What does that switch cost you, in the SHAPE of the system rather than in dollars?',
            'Dưới khoảng hai giây độ trễ thì việc giao segment qua HTTP hết chạy được và WebRTC thành lựa chọn duy nhất. Cú chuyển ấy tốn của bạn cái gì, xét theo HÌNH DẠNG của hệ thống chứ không phải theo tiền?',
          ),
          options: [
            B(
              'You lose the ability to record, since there is no segment on disk at any point and the stream exists only in transit',
              'Bạn mất khả năng ghi lại, vì không có segment nào nằm trên đĩa ở bất kỳ thời điểm nào và luồng chỉ tồn tại trong lúc truyền',
            ),
            B(
              'You lose adaptive bitrate, because WebRTC sends a single encoding and the receiver cannot switch renditions mid-call',
              'Bạn mất khả năng thích ứng bitrate, vì WebRTC gửi một bản mã hoá duy nhất và bên nhận không đổi bản giữa cuộc gọi được',
            ),
            B(
              'You lose reliability, because UDP retransmits lost packets at the application layer and the retransmission budget is what sets the latency floor',
              'Bạn mất tính tin cậy, vì UDP gửi lại gói mất ở tầng ứng dụng và ngân sách gửi lại chính là thứ định ra sàn độ trễ',
            ),
            B(
              'You lose the CDN entirely — a CDN caches files and there are no files — so you now run and scale a stateful media server whose cost grows with participants, plus a TURN relay for the connections that cannot reach each other directly',
              'Bạn mất hẳn CDN — CDN cache file mà ở đây không có file nào — nên giờ bạn phải chạy và co giãn một máy chủ media có trạng thái, chi phí của nó tăng theo số người tham gia, cộng thêm một TURN relay cho những kết nối không tự tìm được tới nhau',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The CDN is the thing you are giving up, and it is the thing that made Tier 1 scale to millions at flat cost. Option C gets UDP backwards: a lost packet is CONCEALED rather than retransmitted, precisely because a late packet is useless in a conversation — that is the design, not a defect. Options A and B are both false as stated (recording is done on the SFU; simulcast and SVC give WebRTC layer switching). The honest summary the chapter ends on: do not build Tier 3 unless the product is conversational.',
            'CDN chính là thứ bạn đang từ bỏ, và nó chính là thứ khiến tầng 1 co giãn tới hàng triệu với chi phí phẳng. Lựa chọn C hiểu ngược về UDP: một gói bị mất sẽ được CHE ĐI chứ không gửi lại, đúng vì một gói tới muộn thì vô dụng trong một cuộc hội thoại — đó là thiết kế, không phải khiếm khuyết. Lựa chọn A và B đều sai như đã phát biểu (việc ghi lại thì làm ở SFU; simulcast và SVC cho WebRTC đổi lớp được). Câu tổng kết thật thà mà chương này khép lại: đừng dựng tầng 3 trừ khi sản phẩm là hội thoại.',
          ),
        }),

        mcq({
          prompt: B(
            'A live-commerce product runs the hybrid the chapter recommends: host over WebRTC into an SFU, transcoded out to LL-HLS on a CDN for the audience, with chat over a separate WebSocket. Why is it acceptable that chat is near-instant while video is a few seconds behind?',
            'Một sản phẩm bán hàng trực tiếp chạy đúng kiến trúc lai mà chương này khuyến nghị: người dẫn đi qua WebRTC vào một SFU, transcode ra LL-HLS trên CDN cho khán giả, còn chat đi qua một WebSocket riêng. Vì sao việc chat gần như tức thì trong khi video chậm vài giây lại chấp nhận được?',
          ),
          options: [
            B(
              'Because chat messages are timestamped and the client delays rendering them to match the video position, which is what makes the two feel synchronous',
              'Vì tin nhắn chat có dấu thời gian và client trì hoãn việc hiển thị để khớp với vị trí video, đó là thứ khiến hai bên cảm thấy đồng bộ',
            ),
            B(
              'Because chat and video do not have to match exactly — only closely enough that reactions still make sense; two to four seconds is tolerable and twenty-five is not, which is the whole reason the audience gets LL-HLS rather than plain HLS',
              'Vì chat và video KHÔNG cần khớp chính xác — chỉ cần đủ gần để các phản ứng vẫn có nghĩa; hai tới bốn giây thì chịu được còn hai mươi lăm giây thì không, và đó chính là lý do khán giả nhận LL-HLS chứ không phải HLS thường',
            ),
            B(
              'Because the audience is passive, so the ordering of chat relative to video has no observable consequence for anyone except the host',
              'Vì khán giả là bên thụ động, nên thứ tự của chat so với video không gây hệ quả quan sát được cho ai ngoài người dẫn',
            ),
            B(
              'Because WebSocket and LL-HLS share the same CDN path, so both are delayed by the same edge latency and the gap cancels out',
              'Vì WebSocket và LL-HLS đi chung một đường CDN, nên cả hai chịu cùng độ trễ ở edge và khoảng cách triệt tiêu nhau',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The requirement is not synchronisation, it is plausibility: a viewer must not read "he just held up the red one" before seeing the red one. That is what makes the combination — not the video alone — push the design from Tier 1 to Tier 2. Option A describes a real technique that some products use, but it is not why the architecture is acceptable; it is one way to improve it. Option D is simply untrue — a WebSocket to your own server does not ride the HLS CDN path.',
            'Yêu cầu ở đây không phải là ĐỒNG BỘ, mà là HỢP LÝ: một người xem không được đọc "anh ấy vừa giơ cái màu đỏ lên" trước khi thấy cái màu đỏ. Chính điều đó — chứ không phải riêng video — đẩy thiết kế từ tầng 1 sang tầng 2. Lựa chọn A mô tả một kỹ thuật có thật mà vài sản phẩm dùng, nhưng nó không phải lý do kiến trúc này chấp nhận được; nó là một cách để cải thiện. Lựa chọn D thì đơn giản là sai — một WebSocket tới máy chủ của chính bạn không đi qua đường CDN của HLS.',
          ),
        }),

        mcq({
          prompt: B(
            'The live command pairs <code>-g 60 -keyint_min 60 -sc_threshold 0</code> with <code>-hls_time 2</code> on a 30 fps source. Measured on a comparable encode:' + code(
              'pinned  (-g 60 -keyint_min 60 -sc_threshold 0)  keyframes at 0  2  4  6  8\n' +
              'free    (no GOP flags)                          keyframes at 0  8,333',
            ) + 'What is <code>-sc_threshold 0</code> specifically doing that the other two flags are not?',
            'Câu lệnh trực tiếp ghép <code>-g 60 -keyint_min 60 -sc_threshold 0</code> với <code>-hls_time 2</code> trên một nguồn 30 fps. Đo trên một lượt encode tương đương:' + code(
              'ghim  (-g 60 -keyint_min 60 -sc_threshold 0)  frame khoá tại 0  2  4  6  8\n' +
              'tự do (không cờ GOP nào)                      frame khoá tại 0  8,333',
            ) + '<code>-sc_threshold 0</code> làm cụ thể việc gì mà hai cờ kia không làm?',
          ),
          options: [
            B(
              'It sets the maximum GOP length, while <code>-g</code> sets the minimum; together they force the interval to be exactly 60 frames',
              'Nó đặt độ dài GOP tối đa, còn <code>-g</code> đặt tối thiểu; hai cái cùng nhau ép khoảng cách đúng bằng 60 frame',
            ),
            B(
              'It suppresses the scene-change B-frame promotion, which on a live stream would otherwise reintroduce the reordering delay that <code>-tune zerolatency</code> removed',
              'Nó chặn việc nâng cấp B-frame khi đổi cảnh, thứ mà trên một luồng trực tiếp sẽ mang trở lại độ trễ sắp thứ tự mà <code>-tune zerolatency</code> vừa gỡ đi',
            ),
            B(
              'It disables the rate-control lookahead, which is what allows the encoder to place a keyframe retroactively once it has seen the next GOP',
              'Nó tắt việc nhìn trước của bộ điều khiển tốc độ, thứ cho phép encoder đặt frame khoá hồi tố sau khi nó đã thấy GOP kế tiếp',
            ),
            B(
              'It disables scene-change detection, which would otherwise insert EXTRA keyframes at unpredictable moments — <code>-g</code> and <code>-keyint_min</code> only pin the regular interval, they do not stop the encoder adding more',
              'Nó tắt việc dò đổi cảnh, thứ mà nếu bật sẽ chèn THÊM frame khoá vào những thời điểm không đoán trước được — <code>-g</code> và <code>-keyint_min</code> chỉ ghim khoảng cách đều đặn, chúng không ngăn encoder chèn thêm',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three flags, one goal, and they attack different halves of it. <code>-g</code> and <code>-keyint_min</code> squeeze the regular interval to exactly 60 frames from both ends; <code>-sc_threshold 0</code> stops the encoder from being helpful and inserting an extra keyframe when the picture changes a lot. Leave it out and the interval is right but not exclusive, so segments in different renditions can still begin at different places — which is the thing that only shows up on a bad network, in production, months later.',
            'Ba cờ, một mục tiêu, và chúng đánh vào hai nửa khác nhau của mục tiêu ấy. <code>-g</code> và <code>-keyint_min</code> siết khoảng cách đều về đúng 60 frame từ cả hai phía; <code>-sc_threshold 0</code> ngăn encoder tỏ ra hữu ích mà chèn thêm một frame khoá khi hình đổi nhiều. Bỏ nó ra thì khoảng cách vẫn đúng nhưng không còn độc quyền, nên segment ở các bản khác nhau vẫn có thể bắt đầu ở những chỗ khác nhau — và đó là thứ chỉ lộ ra trên một đường mạng tệ, ở production, vài tháng sau.',
          ),
        }),

        // ── Chương 9 — Chẩn đoán ────────────────────────────────────────
        mcq({
          prompt: B(
            'The cookbook boils down to four commands:' + code(
              '1  ffprobe -v error -show_entries stream=codec_name,width,height,pix_fmt … -of json IN\n' +
              "2  ffprobe -v trace -i IN 2>&1 | grep -m1 -o 'type:.moov.*'\n" +
              '3  node -e "…sharp(f).metadata()…"\n' +
              '4  curl -sI URL | grep -iE \'content-type|accept-ranges|cache-control\'',
            ) + 'A report says "the feed shows a black rectangle where a video should be, and it never starts playing". Which command comes FIRST and what would settle it?',
            'Sách công thức rút gọn lại còn bốn câu lệnh:' + code(
              '1  ffprobe -v error -show_entries stream=codec_name,width,height,pix_fmt … -of json IN\n' +
              "2  ffprobe -v trace -i IN 2>&1 | grep -m1 -o 'type:.moov.*'\n" +
              '3  node -e "…sharp(f).metadata()…"\n' +
              '4  curl -sI URL | grep -iE \'content-type|accept-ranges|cache-control\'',
            ) + 'Một báo cáo nói "feed hiện một hình chữ nhật đen ở chỗ đáng lẽ là video, và nó không bao giờ bắt đầu phát". Câu lệnh nào chạy TRƯỚC và nó chốt được điều gì?',
          ),
          options: [
            B(
              'Command 2, because a black rectangle that never starts is the classic <code>moov</code>-at-the-end symptom and finding the atom near the tail settles it in one line',
              'Câu lệnh 2, vì một hình chữ nhật đen không bao giờ bắt đầu là triệu chứng kinh điển của <code>moov</code> nằm ở cuối, và tìm thấy cái atom ấy gần đuôi file là chốt xong trong một dòng',
            ),
            B(
              'Command 4, because "never starts playing" is compatible with a correct file served with the wrong <code>Content-Type</code> or without <code>Accept-Ranges</code>, and a header check is cheaper than fetching the object at all',
              'Câu lệnh 4, vì "không bao giờ bắt đầu phát" hoàn toàn có thể xảy ra với một file đúng đắn nhưng được phục vụ sai <code>Content-Type</code> hoặc thiếu <code>Accept-Ranges</code>, và kiểm header thì rẻ hơn cả việc tải object về',
            ),
            B(
              'Command 4 — but only to confirm the object exists; the symptom names a rendering problem, so the real answer comes from reproducing it in a browser with the network tab open',
              'Câu lệnh 4 — nhưng chỉ để xác nhận object có tồn tại; triệu chứng nói về một vấn đề hiển thị, nên câu trả lời thật đến từ việc tái hiện nó trên trình duyệt với tab Network mở sẵn',
            ),
            B(
              'Command 1, because the black rectangle is a decode failure and <code>pix_fmt</code> is the field that explains a black frame',
              'Câu lệnh 1, vì hình chữ nhật đen là một lỗi giải mã và <code>pix_fmt</code> là trường giải thích được một khung hình đen',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The ordering rule is headers before bytes, because the headers are cheaper and they explain a surprising share of the table — a wrong <code>Content-Type</code>, a missing <code>Accept-Ranges</code>, a <code>Cache-Control</code> that pinned something. Only when they come back clean is it worth fetching the object and asking commands 1 and 2 what it is. Options A and D both name plausible causes and both start by assuming the file is at fault; on a feed with <code>preload="metadata"</code> and no <code>poster</code>, a black rectangle is also just what a correct video looks like before anyone presses play, which is the fifth possibility the header check does not rule out and a screenshot of the markup does.',
            'Quy tắc thứ tự là header trước byte, vì header rẻ hơn và chúng giải thích một phần đáng ngạc nhiên của cái bảng — một <code>Content-Type</code> sai, một <code>Accept-Ranges</code> thiếu, một <code>Cache-Control</code> ghim cứng thứ gì đó. Chỉ khi chúng trả về sạch thì mới đáng tải object về rồi hỏi câu lệnh 1 và 2 xem nó là cái gì. Lựa chọn A và D đều gọi tên những nguyên nhân hợp lý và đều bắt đầu bằng cách giả định cái file có lỗi; còn trên một feed dùng <code>preload="metadata"</code> mà không có <code>poster</code> thì một hình chữ nhật đen cũng chính là dáng vẻ của một video HOÀN TOÀN ĐÚNG trước khi có ai bấm phát, và đó là khả năng thứ năm mà phép kiểm header không loại được còn một ảnh chụp đoạn mã thì loại được.',
          ),
        }),

        mcq({
          prompt: B(
            'Four symptoms from the cookbook. Which one is NOT explained by a response header?' + code(
              'A  a live stream freezes after ~12 s for every viewer, origin healthy\n' +
              'B  a video takes 40 seconds to start playing\n' +
              'C  seeking re-downloads the video from the beginning\n' +
              'D  a .png key renders in Chrome and is refused by a stricter client',
            ),
            'Bốn triệu chứng trong sách công thức. Cái nào KHÔNG được giải thích bởi một header phản hồi?' + code(
              'A  một luồng trực tiếp đứng hình sau ~12 s với mọi người xem, origin vẫn khoẻ\n' +
              'B  một video mất 40 giây mới bắt đầu phát\n' +
              'C  tua thì tải lại video từ đầu\n' +
              'D  một key .png hiện được trên Chrome và bị một client nghiêm ngặt hơn từ chối',
            ),
          ),
          options: [
            B('A — that one is the <code>Cache-Control</code> on the live manifest, which a CDN honours by pinning a playlist that changes every two seconds', 'A — cái đó là <code>Cache-Control</code> trên manifest trực tiếp, thứ mà CDN tôn trọng bằng cách ghim cứng một playlist vốn đổi sau mỗi hai giây'),
            B('C — that one is a <code>200</code> where a <code>206</code> and a matching <code>Content-Range</code> belonged, and a status line is part of the response head', 'C — cái đó là một mã <code>200</code> ở chỗ đáng lẽ phải là <code>206</code> kèm một <code>Content-Range</code> khớp, và dòng trạng thái là một phần của phần đầu phản hồi'),
            B('B — that one is the <code>moov</code> atom at the end of the file, which is inside the bytes rather than in any header, and the fix is <code>-movflags +faststart</code> at encode time', 'B — cái đó là atom <code>moov</code> nằm ở cuối file, thứ nằm TRONG đám byte chứ không nằm ở header nào, và cách sửa là <code>-movflags +faststart</code> lúc encode'),
            B('D — that one is a key-naming decision in the upload service, which surfaces as the <code>Content-Type</code> the object store derives from the extension', 'D — cái đó là một quyết định đặt tên key trong dịch vụ upload, và nó lộ ra ở <code>Content-Type</code> mà kho object suy từ phần mở rộng'),
          ],
          correct: 2,
          explanation: EX(
            'A is <code>Cache-Control</code>, C is the <code>206</code>-versus-<code>200</code> pair with its <code>Content-Range</code>, and D shows up as the served <code>Content-Type</code> — <code>curl -I</code> reveals all three. B is the one that lives in the file: the browser has to reach the index before it can decode anything, and no header can move it. That is why the diagnosis order is headers first (they are cheaper) but the file probe is what settles the residue.',
            'A là <code>Cache-Control</code>, C là cặp <code>206</code> so với <code>200</code> cùng cái <code>Content-Range</code> của nó, còn D lộ ra ở <code>Content-Type</code> được phục vụ — <code>curl -I</code> phơi bày cả ba. B mới là cái nằm trong chính cái file: trình duyệt phải chạm tới chỉ mục rồi mới giải mã được gì, và không header nào dời nó đi được. Đó là lý do thứ tự chẩn đoán là kiểm header trước (vì rẻ hơn) nhưng lượt probe file mới là thứ chốt phần còn lại.',
          ),
        }),

        mcq({
          prompt: B(
            'The cookbook insists on reproducing a symptom on ONE file, by hand, before touching the pipeline. What does that actually buy?',
            'Sách công thức nhấn mạnh phải tái hiện triệu chứng trên MỘT file, bằng tay, trước khi đụng vào đường ống. Điều đó thật ra mua về cái gì?',
          ),
          options: [
            B(
              'It proves the file is the cause rather than the pipeline, because a symptom that survives isolation must be a property of the input rather than of the code around it',
              'Nó chứng minh cái file là nguyên nhân chứ không phải đường ống, vì một triệu chứng sống sót qua việc cô lập thì phải là thuộc tính của đầu vào chứ không phải của đám mã bao quanh',
            ),            B(
              'It guarantees the bug is deterministic, since a single file processed on its own cannot exhibit a race condition and every run therefore produces the same artifact',
              'Nó bảo đảm con bug là tất định, vì một file đơn lẻ xử lý riêng thì không thể biểu hiện một điều kiện tranh chấp, nên lượt chạy nào cũng cho ra cùng một hiện vật',
            ),
            B(
              'It lets you attach a debugger and step through the transform, which is impossible once the work has moved into a queued worker process on another machine',
              'Nó cho phép bạn gắn trình gỡ lỗi và chạy từng bước qua phép biến đổi, thứ không làm được khi phần việc đã chuyển vào một tiến trình worker xếp hàng trên một máy khác',
            ),
            B(
              'It removes the pipeline from the equation: a bug that reproduces in a one-line script is a bug you can fix in minutes, while the same bug observed only through the full upload path mixes in multer, the storage provider, the CDN and the browser',
              'Nó gạt đường ống ra khỏi bài toán: một con bug tái hiện được trong một script một dòng là con bug bạn sửa trong vài phút, còn cũng con bug ấy mà chỉ quan sát qua toàn bộ đường upload thì trộn lẫn cả multer, storage provider, CDN và trình duyệt',
            ),

          ],
          correct: 3,
          explanation: EX(
            'Isolation is about the number of systems in the frame, not about determinism or tooling. Option A inverts the logic: reproducing in isolation shows the bug does not NEED the pipeline, which most often means the transform itself is wrong — the input is the trigger, not the cause. Pair it with the fourth rule and you get the fastest path there is: run the same probe on a file that works, and the diff between the two outputs is usually the answer.',
            'Việc cô lập nói về SỐ HỆ THỐNG nằm trong khung hình, không nói về tính tất định hay công cụ. Lựa chọn A lật ngược lập luận: tái hiện được khi cô lập cho thấy con bug KHÔNG CẦN tới đường ống, và điều đó thường nghĩa là chính phép biến đổi mới sai — đầu vào là cái kích hoạt, không phải nguyên nhân. Ghép nó với quy tắc thứ tư thì bạn có con đường nhanh nhất: chạy đúng lượt probe ấy trên một file chạy được, và cái diff giữa hai kết quả thường chính là câu trả lời.',
          ),
        }),

        mcq({
          prompt: B(
            'A key ends in <code>.png</code>. Which of these can you conclude from that alone?',
            'Một cái key kết thúc bằng <code>.png</code>. Chỉ từ điều đó bạn kết luận được gì?',
          ),
          options: [
            B(
              'That the bytes are a PNG, since the upload service derives the key from the output format and therefore cannot produce a mismatched extension',
              'Rằng đám byte là PNG, vì dịch vụ upload suy key từ format đầu ra nên không thể sinh ra một phần mở rộng lệch',
            ),
            B(
              'That the object store will serve it as <code>image/png</code>, which is enough to know how a browser will treat it even if the bytes are something else',
              'Rằng kho object sẽ phục vụ nó dưới dạng <code>image/png</code>, và bấy nhiêu đủ để biết trình duyệt sẽ đối xử với nó ra sao dù đám byte là thứ khác',
            ),
            B(
              'That it was not produced by <code>uploadImage()</code>, which always writes <code>.webp</code> — so the extension is a reliable signal about the code path even though it says nothing about the pixels',
              'Rằng nó không do <code>uploadImage()</code> sinh ra, vì hàm đó luôn ghi <code>.webp</code> — nên phần mở rộng là một tín hiệu đáng tin về NHÁNH MÃ dù nó chẳng nói gì về đám pixel',
            ),
            B(
              'Nothing about the bytes at all: a <code>.png</code> key can hold WebP, a <code>.jpg</code> can be a mislabelled video, a <code>.mp4</code> can be a MOV. Every diagnosis starts by asking the file what it is, not by reading its name',
              'Chẳng kết luận được gì về đám byte: một key <code>.png</code> có thể chứa WebP, một file <code>.jpg</code> có thể là một video dán nhãn sai, một file <code>.mp4</code> có thể là MOV. Mọi lượt chẩn đoán bắt đầu bằng việc HỎI file xem nó là gì, không phải bằng việc đọc tên nó',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Option B is the more dangerous half-truth: the store really will serve what the key implies, and that is precisely the failure — bytes and label disagree and the label wins on the wire. Option C reasons from one function to the whole system and is the kind of inference that breaks the moment any route bypasses the door. The habit that never lets you down is the probe: <code>metadata()</code> or <code>ffprobe</code> on the actual object.',
            'Lựa chọn B là nửa sự thật nguy hiểm hơn: kho object đúng là sẽ phục vụ theo thứ mà cái key ngụ ý, và đó CHÍNH LÀ kiểu hỏng — đám byte và cái nhãn nói khác nhau, và cái nhãn thắng trên đường truyền. Lựa chọn C suy từ một hàm ra cả hệ thống, và đó là kiểu suy luận vỡ ngay khi có một route đi vòng qua cái cửa. Thói quen không bao giờ phụ bạn là lượt probe: <code>metadata()</code> hoặc <code>ffprobe</code> trên chính cái object đó.',
          ),
        }),

        mcq({
          prompt: B(
            'The fourth and last ordering rule in the cookbook is "compare against a known-good file": run the same <code>ffprobe</code> on one that works, and diff the two outputs. Why is that placed AFTER reproducing on a single file rather than before?',
            'Quy tắc thứ tự thứ tư và cũng là cuối cùng trong sách công thức là "đối chiếu với một file biết là tốt": chạy đúng lượt <code>ffprobe</code> ấy trên một file chạy được, rồi diff hai kết quả. Vì sao nó được xếp SAU bước tái hiện trên một file đơn lẻ chứ không phải trước?',
          ),
          options: [
            B(
              'Because you cannot know which file is "known-good" until you have a reproduction to compare it against — the reproduction is what defines the symptom precisely enough for a second file to be a control rather than just another file',
              'Vì bạn không thể biết file nào là "biết là tốt" cho tới khi có một ca tái hiện để đem so — chính ca tái hiện mới định nghĩa triệu chứng đủ chính xác để một file thứ hai trở thành một đối chứng chứ không phải chỉ là một file khác',
            ),
            B(
              'Because a diff of two <code>ffprobe</code> outputs is only meaningful when both files came from the same encoder version, and the reproduction step is where you pin the version',
              'Vì diff hai kết quả <code>ffprobe</code> chỉ có nghĩa khi cả hai file đến từ cùng một phiên bản encoder, và bước tái hiện chính là chỗ bạn ghim phiên bản',
            ),
            B(
              'Because the diff is expensive: <code>ffprobe</code> on two large files is slower than the transform itself, so it is worth doing only once the cheaper steps have failed to explain the symptom',
              'Vì phép diff đắt: chạy <code>ffprobe</code> trên hai file lớn còn chậm hơn chính phép biến đổi, nên chỉ đáng làm khi các bước rẻ hơn đã không giải thích được triệu chứng',
            ),
            B(
              'Because a known-good file proves nothing on its own — the same output on both files would only mean the bug is in the pipeline, and by that point the reproduction has already told you that',
              'Vì một file biết là tốt tự nó chẳng chứng minh gì — cùng một kết quả trên cả hai file chỉ nghĩa là con bug nằm trong đường ống, mà tới lúc đó thì ca tái hiện đã nói cho bạn điều ấy rồi',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The rule is doing something subtler than "get more data". A diff is only informative if the two files differ in exactly the way you care about; grab a random working file first and the output differs in a dozen irrelevant fields — different duration, different bitrate, different profile — and you are back to reasoning about which difference matters. Reproducing first tells you what the symptom depends on, which is what lets you choose a control that differs in one thing. Option D is a real limitation and it is why the rule reads "compare", not "prove": the diff narrows the search, and something still has to decide which line in it is the answer.',
            'Quy tắc này làm một việc tinh tế hơn là "lấy thêm dữ liệu". Một phép diff chỉ có thông tin khi hai file khác nhau đúng theo cái cách bạn quan tâm; vớ đại một file chạy được rồi đem so thì kết quả sẽ khác nhau ở cả chục trường vô can — khác thời lượng, khác bitrate, khác profile — và bạn lại quay về việc lập luận xem khác biệt nào mới đáng kể. Tái hiện trước sẽ cho bạn biết triệu chứng phụ thuộc vào cái gì, và đó là thứ giúp bạn chọn được một đối chứng chỉ khác đúng một thứ. Lựa chọn D nêu một hạn chế có thật và đó là lý do quy tắc viết là "đối chiếu" chứ không phải "chứng minh": phép diff thu hẹp phạm vi tìm kiếm, còn việc quyết định dòng nào trong đó là câu trả lời thì vẫn cần ai đó làm.',
          ),
        }),

        mcq({
          prompt: B(
            'The loudness feature is re-checked by measuring the OUTPUT of both code paths:' + code(
              'ffmpeg -i <output>.mp3 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary -f null -\n' +
              '\n' +
              'two-pass with measured values   Input Integrated: -14,2 LUFS\n' +
              'the fallback re-encode          Input Integrated: -46,4 LUFS',
            ) + 'Why is this check worth more than the one the feature already had?',
            'Tính năng độ to được kiểm lại bằng cách đo BẢN RA của cả hai nhánh mã:' + code(
              'ffmpeg -i <bản ra>.mp3 -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary -f null -\n' +
              '\n' +
              'hai pass có truyền giá trị đo   Input Integrated: -14,2 LUFS\n' +
              'đường dự phòng encode lại       Input Integrated: -46,4 LUFS',
            ) + 'Vì sao phép kiểm này giá trị hơn phép kiểm mà tính năng vốn đã có?',
          ),
          options: [
            B(
              'Because it runs after the upload rather than during it, so it cannot slow the request path down',
              'Vì nó chạy sau lượt upload chứ không phải trong lúc upload, nên nó không làm chậm đường request',
            ),
            B(
              'Because it uses the same filter as pass 1, so any bug in the filter itself would cancel out between the two runs and only a real difference survives',
              'Vì nó dùng cùng bộ lọc với pass 1, nên mọi con bug nằm trong chính bộ lọc sẽ triệt tiêu giữa hai lượt và chỉ một khác biệt thật mới sống sót',
            ),
            B(
              'Because it spans the whole pipeline including the parts that swallowed an error: pass 1 measured the INPUT correctly and told you nothing about whether pass 2 ran, whereas re-reading the artifact you produced is 32 LU away from the failure',
              'Vì nó trải khắp đường ống, kể cả những đoạn đã nuốt mất lỗi: pass 1 đo ĐẦU VÀO hoàn toàn đúng và chẳng nói gì về việc pass 2 có chạy hay không, còn đọc lại chính hiện vật mình vừa tạo thì cách kiểu hỏng ấy tới 32 LU',
            ),
            B(
              'Because <code>print_format=summary</code> reports <code>Normalization Type</code>, which is the field that distinguishes a two-pass run from a fallback',
              'Vì <code>print_format=summary</code> có báo <code>Normalization Type</code>, và đó là trường phân biệt được một lượt hai pass với một lượt dự phòng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The feature already measured something — pass 1 produced correct LUFS numbers that went into the API response, so anyone asking "is the measurement working?" got a yes. The numbers were simply never applied. Only a property of the OUTPUT can span a pipeline whose middle swallowed an error, and here the two paths are 32 LU apart, which no threshold discussion can blur. Option D is a trap this deck has already sprung: <code>Normalization Type</code> reads <code>Dynamic</code> in plenty of correct two-pass runs, so an alert built on it fires on healthy files.',
            'Tính năng ấy vốn đã đo một thứ gì đó — pass 1 cho ra những con số LUFS đúng đắn và chúng đi vào phản hồi API, nên ai hỏi "phép đo có chạy không?" đều nhận được câu trả lời có. Chỉ là những con số ấy chưa bao giờ được ÁP vào. Chỉ một thuộc tính của BẢN RA mới trải được qua một đường ống mà khúc giữa đã nuốt mất lỗi, và ở đây hai nhánh cách nhau 32 LU, một khoảng cách mà không cuộc tranh luận về ngưỡng nào làm mờ đi được. Lựa chọn D là cái bẫy mà bộ đề này đã bung ra rồi: <code>Normalization Type</code> báo <code>Dynamic</code> trong khối lượt hai pass hoàn toàn đúng đắn, nên một cảnh báo dựng trên nó sẽ nổ trên cả file khoẻ mạnh.',
          ),
        }),

        mcq({
          prompt: B(
            'Chapter 9 gives a three-question review checklist. The second question is: "What does the <code>catch</code> block turn a failure into?" What is the intended answer when the catch is CORRECT?',
            'Chương 9 đưa ra một danh sách ba câu hỏi để review. Câu thứ hai là: "Khối <code>catch</code> biến một thất bại thành cái gì?" Câu trả lời mong muốn khi khối catch ấy ĐÚNG là gì?',
          ),
          options: [
            B(
              'It should re-throw after logging, because swallowing an error is what created both repo bugs and the only correct catch is one that adds context',
              'Nó nên ném lại sau khi ghi log, vì nuốt lỗi chính là thứ tạo ra cả hai con bug trong kho, và khối catch đúng duy nhất là khối chỉ bổ sung ngữ cảnh',
            ),
            B(
              'Non-fatal is often exactly right — a missing thumbnail should not cost the user their upload — but then the fallback must be COUNTED, because a path expected to be rare that fires on 100% of requests is only a signal if something is counting',
              'Không-gây-chết thường là đúng — một thumbnail bị thiếu không nên làm người dùng mất luôn lượt upload — nhưng khi đó đường dự phòng phải được ĐẾM, vì một nhánh lẽ ra hiếm mà nổ trên 100% số request thì chỉ thành tín hiệu khi có thứ gì đó đang đếm',
            ),
            B(
              'It should convert the error into an HTTP 4xx so the client can retry, since a media failure is almost always caused by the input',
              'Nó nên đổi lỗi thành một mã HTTP 4xx để client thử lại, vì một sự cố media gần như luôn do đầu vào gây ra',
            ),
            B(
              'It should be removed entirely: a media pipeline should fail loudly, and every fallback in the course turned out to be hiding a defect',
              'Nên bỏ nó đi hẳn: một đường ống media nên hỏng cho ầm ĩ, và mọi đường dự phòng trong khoá này rốt cuộc đều đang che giấu một khiếm khuyết',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both repo fallbacks were correct in intent and wrong only in instrumentation. The thumbnail one genuinely should be non-fatal — an FFmpeg codec it cannot handle costs the user a thumbnail, not their video. What was missing is a counter: a <code>warn</code> line in a log nobody greps is invisible, while a counter on a dashboard makes "the primary path never runs" obvious at a glance. Option D throws away a good design to fix a missing metric; option C would turn a server-side failure into a user-blaming status code.',
            'Cả hai đường dự phòng trong kho đều ĐÚNG về ý định và chỉ sai ở khâu đo đạc. Đường thumbnail đúng là nên không-gây-chết — một codec mà FFmpeg không xử lý được thì làm người dùng mất một cái thumbnail, không phải mất video. Thứ còn thiếu là một BỘ ĐẾM: một dòng <code>warn</code> trong cái log không ai grep là vô hình, còn một bộ đếm trên bảng theo dõi làm cho "nhánh chính chưa từng chạy" lộ ra chỉ trong một cái liếc. Lựa chọn D vứt bỏ một thiết kế tốt để sửa một chỉ số bị thiếu; lựa chọn C thì biến một sự cố phía máy chủ thành một mã trạng thái đổ lỗi cho người dùng.',
          ),
        }),

        mcq({
          prompt: B(
            'The first of the three review questions in Chapter 9 is: <b>"If this silently did the WRONG thing, what would be different?"</b> What is the intended use of an answer of "nothing observable"?',
            'Câu đầu tiên trong ba câu hỏi review ở chương 9 là: <b>"Nếu đoạn này âm thầm làm SAI, thì sẽ có gì khác đi?"</b> Câu trả lời "chẳng có gì quan sát được" thì dùng để làm gì?',
          ),
          options: [
            B(
              'It means the code is not worth reviewing further, because a change with no observable consequence cannot break anything a user notices',
              'Nó nghĩa là đoạn mã ấy không đáng review tiếp, vì một thay đổi không có hệ quả quan sát được thì không thể làm hỏng thứ gì người dùng nhận ra',
            ),
            B(
              'It means the module needs more logging, and the reviewer should ask for a log line at each branch so the code path becomes traceable',
              'Nó nghĩa là module ấy cần thêm log, và người review nên yêu cầu một dòng log ở mỗi nhánh để nhánh mã trở nên truy vết được',
            ),
            B(
              'It is the finding itself: the question is a detector, and "nothing" is a positive result — it says this code can fail without anything anywhere going red, so the review has located a place where a bug could live indefinitely and the next step is to make ONE property of the output observable',
              'Chính nó là PHÁT HIỆN: câu hỏi ấy là một cái máy dò, và "chẳng có gì" là một kết quả DƯƠNG TÍNH — nó nói rằng đoạn mã này hỏng được mà chẳng có gì ở đâu chuyển đỏ, nên buổi review vừa định vị được một chỗ mà một con bug sống vô thời hạn, và bước tiếp theo là làm cho MỘT thuộc tính của đầu ra trở nên quan sát được',
            ),
            B(
              'It means the failure mode is already handled elsewhere, since a silent difference implies a fallback is absorbing it — the reviewer should go find that fallback and confirm it is correct',
              'Nó nghĩa là kiểu hỏng ấy đã được xử lý ở chỗ khác, vì một khác biệt âm thầm ngụ ý có một đường dự phòng đang hấp thụ nó — người review nên đi tìm đường dự phòng ấy và xác nhận nó đúng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The question is phrased as a hypothetical and used as an instrument: you are not asking whether the code is wrong, you are asking whether wrongness would be visible. Every defect in this course answers "nothing" — the sideways photo, the flattened GIF, the unnormalised track, the exploited thumbnail — and each one then lived in production. Option B is the reflex the chapter argues against: more logging does not help if nobody compares the log to the intent, and the fix is one assertion on the artefact, not ten lines of trace.',
            'Câu hỏi được viết dưới dạng giả định và được dùng như một dụng cụ đo: bạn không hỏi đoạn mã có sai không, bạn hỏi rằng nếu nó sai thì cái sai ấy có NHÌN THẤY ĐƯỢC không. Mọi khiếm khuyết trong khoá này đều trả lời "chẳng có gì" — tấm ảnh nằm nghiêng, cái GIF bị dẹp, bài hát chưa chuẩn hoá, cái thumbnail bị khai thác — và rồi từng cái một sống ở production. Lựa chọn B là phản xạ mà chương này phản đối: thêm log không cứu được nếu chẳng ai đem log so với ý định, và cách sửa là MỘT phép khẳng định trên hiện vật, không phải mười dòng vết chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague debugs a rendering problem entirely in Chrome DevTools and concludes "the file is broken". What is wrong with that conclusion, procedurally?',
            'Một đồng nghiệp gỡ lỗi một vấn đề hiển thị hoàn toàn trong Chrome DevTools rồi kết luận "cái file hỏng rồi". Xét về quy trình, kết luận ấy sai chỗ nào?',
          ),
          options: [
            B(
              'Chrome caches aggressively, so the object being inspected may be an older version and the conclusion may be about a file that no longer exists',
              'Chrome cache rất mạnh tay, nên object đang được soi có thể là một bản cũ và kết luận có thể đang nói về một file không còn tồn tại',
            ),
            B(
              'DevTools cannot show the <code>moov</code> atom position, which is the single most common cause of the symptoms in the video half of the table',
              'DevTools không hiện được vị trí atom <code>moov</code>, thứ là nguyên nhân phổ biến nhất của các triệu chứng ở nửa video của cái bảng',
            ),
            B(
              '"It looks wrong in Chrome" conflates four systems — the file, the served headers, the CDN and the renderer — so the observation cannot distinguish between them; downloading the object and probing it separates four systems into one',
              '"Nhìn trên Chrome thấy sai" gộp chung bốn hệ thống — cái file, các header được phục vụ, CDN và bộ dựng hình — nên quan sát ấy không phân biệt được chúng với nhau; tải object về rồi probe nó sẽ tách bốn hệ thống thành một',
            ),
            B(
              'Chrome is more permissive than Safari, so a file that renders there may still fail elsewhere — the conclusion is too optimistic rather than too pessimistic',
              'Chrome dễ tính hơn Safari, nên một file hiện được ở đó vẫn có thể hỏng chỗ khác — kết luận ấy lạc quan quá chứ không phải bi quan quá',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The problem is not that the browser lies; it is that it reports the composition of four independent systems and gives you one verdict. The cookbook\'s answer is to collapse the frame: fetch the object, run <code>ffprobe</code> or <code>metadata()</code> on it, and you now have a statement about the bytes alone. Options A and D are true observations about browsers and would both be worth mentioning in a review — but they refine the same procedure rather than replacing it.',
            'Vấn đề không phải trình duyệt nói dối; vấn đề là nó báo cáo HỢP THÀNH của bốn hệ thống độc lập rồi đưa cho bạn một phán quyết duy nhất. Câu trả lời của sách công thức là thu hẹp khung hình lại: tải object về, chạy <code>ffprobe</code> hoặc <code>metadata()</code> trên nó, và giờ bạn có một phát biểu chỉ về đám byte. Lựa chọn A và D là những quan sát đúng về trình duyệt và đều đáng nhắc trong một buổi review — nhưng chúng tinh chỉnh chính cái quy trình ấy chứ không thay thế nó.',
          ),
        }),

        mcq({
          prompt: B(
            'The symptom "roughly 40% of uploaded photos are sideways" is in the cookbook. Which single command confirms the cause before any code is changed?',
            'Triệu chứng "khoảng 40% ảnh upload lên bị nằm nghiêng" nằm trong sách công thức. Câu lệnh duy nhất nào xác nhận nguyên nhân trước khi sửa bất kỳ dòng mã nào?',
          ),
          options: [
            B(
              '<code>sharp(f).metadata()</code> on a failing INPUT: an <code>orientation</code> of 5, 6, 7 or 8 says the pixels are stored turned, which combined with an output that is wider than it is tall pins it on a missing <code>.rotate()</code>',
              '<code>sharp(f).metadata()</code> trên một file ĐẦU VÀO bị lỗi: giá trị <code>orientation</code> bằng 5, 6, 7 hay 8 nói rằng đám pixel được lưu ở trạng thái đã xoay, và kết hợp với một bản ra rộng hơn cao thì chốt được là thiếu <code>.rotate()</code>',
            ),
            B(
              '<code>sharp(out).metadata()</code> on the OUTPUT: an <code>orientation</code> of <code>undefined</code> proves the tag was stripped, which is the defect',
              '<code>sharp(bảnRa).metadata()</code> trên BẢN RA: giá trị <code>orientation</code> bằng <code>undefined</code> chứng minh cái thẻ đã bị gỡ, và đó là khiếm khuyết',
            ),
            B(
              '<code>curl -I</code> on the served URL: the <code>Content-Type</code> tells you whether the re-encode happened at all, and a photo that skipped it keeps its original orientation handling',
              '<code>curl -I</code> trên URL được phục vụ: <code>Content-Type</code> cho biết lượt encode lại có xảy ra hay không, và một tấm ảnh bỏ qua nó thì vẫn giữ cách xử lý hướng xoay ban đầu',
            ),
            B(
              '<code>exiftool -Orientation</code> on the output: if the tag survived, the browser is at fault for ignoring it and the fix belongs in CSS',
              '<code>exiftool -Orientation</code> trên bản ra: nếu cái thẻ còn sống thì lỗi thuộc về trình duyệt vì đã phớt lờ nó, và cách sửa nằm ở CSS',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The input is where the evidence is. Option B is a real measurement — the output really does come back with <code>orientation: undefined</code>, because Sharp strips metadata by default — but on its own it proves nothing: a correctly rotated output has no orientation tag either, and should not. It is the pair that identifies the bug: a source turned 90° (5–8) plus an output that kept the stored aspect. Option D suggests the fix that does not survive contact with reality — WebP and AVIF orientation support is inconsistent, and any downstream re-encode drops the tag again. Apply the rotation to the pixels.',
            'Bằng chứng nằm ở ĐẦU VÀO. Lựa chọn B là một phép đo có thật — bản ra đúng là trả về <code>orientation: undefined</code>, vì Sharp mặc định gỡ metadata — nhưng riêng nó thì chẳng chứng minh gì: một bản ra được xoay ĐÚNG cũng không có thẻ orientation, và không nên có. Chính cái CẶP mới nhận diện được con bug: một nguồn bị xoay 90° (5–8) cộng với một bản ra giữ nguyên tỉ lệ đang lưu. Lựa chọn D gợi ý một cách sửa không sống nổi khi chạm thực tế — hỗ trợ orientation của WebP và AVIF không nhất quán, và bất kỳ lượt encode lại nào phía sau cũng vứt cái thẻ ấy lần nữa. Hãy áp phép xoay vào chính đám pixel.',
          ),
        }),

        // ── Chương 10 — Tổng kết cả khoá ────────────────────────────────
        mcq({
          prompt: B(
            'One rule in the RECEIVING block reads "never derive a filesystem path from a user-supplied filename". Compared with sanitising the filename, what does that rule buy?',
            'Một luật trong nhóm NHẬN FILE viết "đừng bao giờ suy một đường dẫn hệ thống file từ tên file do người dùng cung cấp". So với việc làm sạch tên file, luật ấy mua về cái gì?',
          ),
          options: [
            B(
              'It is a fix you cannot get subtly wrong. Every denylist of shell metacharacters is missing something — a newline, <code>$()</code>, a backtick, a locale-dependent character — so each sanitiser is correct until the next payload; generating the path from <code>randomUUID()</code> removes the user\'s bytes from the path entirely and there is nothing left to be incomplete about',
              'Đó là một cách sửa mà bạn không thể làm sai một cách tinh vi. Mọi danh sách cấm ký tự đặc biệt của shell đều thiếu thứ gì đó — một dấu xuống dòng, <code>$()</code>, một dấu huyền ngược, một ký tự phụ thuộc locale — nên mỗi bộ lọc đều đúng cho tới payload kế tiếp; sinh đường dẫn bằng <code>randomUUID()</code> gỡ hẳn byte của người dùng ra khỏi đường dẫn và chẳng còn gì để mà thiếu sót nữa',
            ),
            B(
              'It is faster and more predictable: a UUID is one call of constant cost while a sanitiser has to scan a name of unbounded length, and on an upload path that already reads a header and a pixel budget per file, every constant-time step you can substitute for a scan is worth taking',
              'Nó nhanh hơn và đoán trước được hơn: một UUID là một lời gọi có chi phí hằng số còn một bộ lọc phải quét một cái tên dài không giới hạn, và trên một đường upload vốn đã phải đọc một header cùng một ngân sách pixel cho mỗi file thì mỗi bước hằng số mà bạn thay được cho một lượt quét đều đáng lấy',
            ),
            B(
              'It removes the need for an argv array, since a path that provably contains no metacharacters is safe to interpolate into a shell string — the two rules cover the same ground from opposite ends, so a team that has adopted one can drop the other and keep the same guarantee',
              'Nó khử được nhu cầu dùng mảng argv, vì một đường dẫn chứng minh được là không chứa ký tự đặc biệt thì nội suy vào một chuỗi shell là an toàn — hai luật ấy phủ cùng một vùng từ hai đầu ngược nhau, nên một nhóm đã theo luật này thì bỏ luật kia đi mà vẫn giữ nguyên bảo đảm',
            ),
            B(
              'It preserves a usable extension, which FFmpeg needs in order to choose a demuxer for the input and a muxer for the output — a sanitiser that strips too aggressively can leave a name that FFmpeg refuses to open at all, turning a security fix into a functional regression',
              'Nó giữ lại một phần mở rộng dùng được, thứ mà FFmpeg cần để chọn demuxer cho đầu vào và muxer cho đầu ra — một bộ lọc gọt quá tay có thể để lại một cái tên mà FFmpeg từ chối mở, biến một bản vá bảo mật thành một bước lùi về chức năng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Option C is the dangerous one and it is exactly the reasoning that keeps this class of bug alive: the rules are LAYERS, not alternatives. Use argv so no shell exists, AND keep the user\'s bytes out of the path so there is nothing to escape even if someone later adds a shell. Option D also has its facts backwards — FFmpeg sniffs the container from the bytes, not from the suffix, so <code>randomUUID() + ".mp4"</code> works for every input it can read, which is precisely why removing the user\'s extension costs nothing.',
            'Lựa chọn C là cái nguy hiểm và nó đúng là lối lập luận giữ cho họ lỗi này sống mãi: các luật ấy là những TẦNG, không phải các phương án thay thế nhau. Hãy dùng argv để không có shell nào tồn tại, VÀ giữ byte của người dùng ra khỏi đường dẫn để chẳng có gì phải thoát kể cả khi về sau có ai đó thêm một cái shell vào. Lựa chọn D cũng nói ngược sự thật — FFmpeg đánh hơi container từ đám byte chứ không từ cái đuôi, nên <code>randomUUID() + ".mp4"</code> chạy được với mọi đầu vào mà nó đọc được, và đó chính là lý do bỏ phần mở rộng của người dùng chẳng tốn gì.',
          ),
        }),

        mcq({
          prompt: B(
            'Chapter 10 ends with a provenance section separating what was RUN, what was reasoned about, and what was cited. Why does the course bother?',
            'Chương 10 khép lại bằng một mục xuất xứ, tách bạch thứ gì đã được CHẠY, thứ gì chỉ được lập luận, và thứ gì là trích dẫn. Vì sao giáo trình lại bận tâm tới chuyện đó?',
          ),
          options: [
            B(
              'Because a benchmark is only reproducible if the exact tool versions are stated, and the provenance section is where those versions live',
              'Vì một phép đo chỉ tái lập được khi nêu rõ phiên bản công cụ, và mục xuất xứ chính là nơi chứa những phiên bản ấy',
            ),
            B(
              'Because measurements are legally distinguishable from citations, and a technical document that mixes them cannot be used as evidence in a post-incident review',
              'Vì phép đo và trích dẫn khác nhau về mặt pháp lý, và một tài liệu kỹ thuật trộn lẫn hai thứ thì không dùng làm bằng chứng trong một buổi rà soát sau sự cố được',
            ),
            B(
              'Because the reasoned-about figures are the least reliable, so flagging them tells the reader which sections to skip',
              'Vì những con số chỉ được lập luận là kém tin cậy nhất, nên đánh dấu chúng là để nói cho người đọc biết phần nào nên bỏ qua',
            ),
            B(
              'Because a reader who knows which figures were run knows which ones to re-derive on their own corpus, and which ones to re-check against the linked source because they change over time',
              'Vì một người đọc biết con số nào đã được chạy thật thì biết con số nào cần tự dựng lại trên kho ảnh của mình, và con số nào cần kiểm lại theo nguồn đã dẫn vì chúng thay đổi theo thời gian',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three categories, three different actions. The measured Sharp and FFmpeg figures came from a harness you can re-run — and should, because your corpus is not the one they were taken on. The two repo bugs were verified structurally rather than end to end, which is checkable reasoning and worth confirming after deploy. And R2 prices, browser-support percentages and the EBU R128 specification are cited: they change, and the linked source is where the current value lives. Option C inverts the intent — the reasoned sections are the ones to check, not skip.',
            'Ba nhóm, ba hành động khác nhau. Những con số Sharp và FFmpeg đo được đến từ một bộ đo mà bạn chạy lại được — và NÊN chạy lại, vì kho ảnh của bạn không phải kho mà chúng được đo trên đó. Hai con bug trong kho thì được xác minh về mặt cấu trúc chứ không phải đầu-cuối, đó là lập luận kiểm được và đáng xác nhận lại sau khi deploy. Còn giá R2, tỉ lệ hỗ trợ của trình duyệt và đặc tả EBU R128 là trích dẫn: chúng thay đổi, và nguồn đã dẫn mới là nơi chứa giá trị hiện hành. Lựa chọn C lật ngược ý định — những phần được lập luận là phần cần KIỂM, không phải phần nên bỏ qua.',
          ),
        }),

        mcq({
          prompt: B(
            'One of the four things the course says to carry away is "the format decides more than the settings". The same 1200-px output on this machine:' + code(
              'jpeg q=80 (default encoder)   74.164 B\n' +
              'jpeg q=80 mozjpeg: true       63.613 B\n' +
              'webp q=80 effort: 4           49.246 B\n' +
              'webp q=80 effort: 6           48.194 B',
            ) + 'Which reading of that claim do these four rows support?',
            'Một trong bốn điều mà giáo trình dặn mang theo là "format quyết định nhiều hơn các cài đặt". Cùng một bản ra rộng 1200 px trên máy này:' + code(
              'jpeg q=80 (encoder mặc định)  74.164 B\n' +
              'jpeg q=80 mozjpeg: true       63.613 B\n' +
              'webp q=80 effort: 4           49.246 B\n' +
              'webp q=80 effort: 6           48.194 B',
            ) + 'Bốn dòng này ủng hộ cách đọc nào của khẳng định ấy?',
          ),
          options: [
            B(
              'That tuning is pointless once the format is chosen, since rows three and four differ by only 2% — the encoder settings are noise and the only decision that matters is JPEG versus WebP',
              'Rằng việc tinh chỉnh là vô nghĩa một khi đã chọn format, vì dòng ba và dòng bốn chỉ chênh 2% — cài đặt của encoder chỉ là nhiễu và quyết định duy nhất có ý nghĩa là JPEG hay WebP',
            ),
            B(
              'That the best result available INSIDE JPEG (63.613 B, and that already costs a different encoder) is still 29% worse than an untuned WebP at the same quality number — so choose the container first, then tune inside it, because tuning cannot cross the gap the format creates',
              'Rằng kết quả tốt nhất có thể đạt được BÊN TRONG JPEG (63.613 B, và con số ấy đã phải đổi hẳn encoder mới có) vẫn tệ hơn 29% so với một file WebP chưa tinh chỉnh ở cùng con số quality — nên hãy chọn container trước rồi mới tinh chỉnh bên trong nó, vì việc tinh chỉnh không vượt qua nổi khoảng cách mà format tạo ra',
            ),
            B(
              'That the quality numbers are comparable across formats, since both rows use q=80 and the difference is therefore purely a property of the two compression algorithms',
              'Rằng các con số quality so được giữa các format, vì cả hai dòng đều dùng q=80 nên khác biệt thuần tuý là tính chất của hai thuật toán nén',
            ),
            B(
              'That WebP should replace JPEG everywhere, since it wins at every setting measured and there is no case in the course where the older format comes out ahead',
              'Rằng WebP nên thay JPEG ở mọi nơi, vì nó thắng ở mọi cài đặt đã đo và trong khoá này không có ca nào format cũ hơn về trước',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read it as a ceiling: JPEG at its best here is still above WebP at its laziest. That is what "the format decides more" means operationally — you can spend a different encoder and a chunk of CPU inside JPEG and not reach where WebP starts. Option C makes the mistake the course warns about twice: quality scales are per-format and mean nothing across them, which is the same trap as copying WebP\'s 80 onto AVIF. Option D overreaches on a course that measured a screenshot where lossless PNG competes and an already-optimised source where re-encoding came out larger. And option A discards a real 22% spread across the effort dial measured earlier — tuning still pays, it just cannot rescue the wrong format.',
            'Hãy đọc nó như một cái TRẦN: JPEG ở mức tốt nhất tại đây vẫn nằm trên WebP ở mức lười nhất. Đó là ý nghĩa vận hành của câu "format quyết định nhiều hơn" — bạn có thể đổi hẳn encoder và tiêu một mớ CPU bên trong JPEG mà vẫn không chạm tới chỗ WebP bắt đầu. Lựa chọn C mắc đúng sai lầm mà giáo trình cảnh báo hai lần: thang quality là của riêng từng format và chẳng có nghĩa gì khi so chéo, cùng một cái bẫy với việc chép số 80 của WebP sang AVIF. Lựa chọn D nói quá trong một khoá đã đo được một ảnh chụp màn hình nơi PNG không mất dữ liệu cạnh tranh được, và một nguồn vốn đã tối ưu nơi encode lại ra to hơn. Còn lựa chọn A thì vứt bỏ một khoảng chênh 22% có thật trên núm effort đã đo trước đó — tinh chỉnh vẫn có lãi, nó chỉ không cứu nổi một format sai.',
          ),
        }),

        mcq({
          prompt: B(
            'Two habits are prescribed as the remedies for the two real defects. Choose <b>TWO</b> statements that correctly describe what each habit does.',
            'Hai thói quen được kê ra làm phương thuốc cho hai khiếm khuyết có thật. Chọn <b>HAI</b> phát biểu mô tả ĐÚNG việc mà từng thói quen làm được.',
          ),
          options: [
            B(
              'Passing an argv array does not merely fix the loudnorm filter string — it makes that bug UNREPRESENTABLE, because the argument boundary stops being an invisible space and becomes a comma a reviewer can see',
              'Truyền một mảng argv không chỉ sửa cái chuỗi bộ lọc loudnorm — nó làm cho con bug ấy KHÔNG DIỄN ĐẠT ĐƯỢC nữa, vì ranh giới giữa các tham số thôi là một dấu cách vô hình và trở thành một dấu phẩy mà người review nhìn thấy',
            ),
            B(
              'Counting a fallback rather than logging it converts "the primary path never ran" from an archaeology project into a number on a dashboard — the fallback itself was the right design in both cases, and the missing piece was the counter',
              'Đếm một đường dự phòng thay vì chỉ ghi log biến "nhánh chính chưa từng chạy" từ một cuộc khai quật thành một con số trên bảng theo dõi — bản thân đường dự phòng là thiết kế ĐÚNG trong cả hai ca, và mảnh còn thiếu là cái bộ đếm',
            ),
            B(
              'Passing an argv array would also have prevented the command injection from producing a valid thumbnail, which is what made the exploited request indistinguishable from a normal one',
              'Truyền một mảng argv cũng sẽ ngăn được việc con bug tiêm lệnh vẫn tạo ra một cái thumbnail hợp lệ, và chính điều đó khiến một request bị khai thác không phân biệt được với một request bình thường',
            ),
            B(
              'Counting the fallback would have surfaced the injection too, since an exploited upload takes the <code>catch { return null }</code> branch and would have shown up as an elevated fallback rate',
              'Đếm đường dự phòng cũng sẽ làm lộ con bug tiêm lệnh, vì một lượt upload bị khai thác đi vào nhánh <code>catch { return null }</code> và sẽ hiện ra dưới dạng tỉ lệ dự phòng tăng cao',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Each remedy is precise about which defect it addresses, and the two wrong options blur exactly that. Option C confuses removing the shell with changing the output: argv stops the injected command from running, and the thumbnail is still produced correctly — that is the point, FFmpeg was doing its job either way. Option D is the sharper trap: an exploited request SUCCEEDS. FFmpeg ran, the injected command ran, both returned, and nothing took the <code>catch</code>. A fallback counter is a fine instrument for the loudnorm class and blind to this one, which is why the course also says that from the application\'s perspective nothing went wrong.',
            'Mỗi phương thuốc nói rất chính xác nó chữa cho khiếm khuyết nào, và hai lựa chọn sai làm mờ đúng chỗ đó. Lựa chọn C nhầm việc bỏ shell với việc đổi đầu ra: argv chặn không cho câu lệnh bị tiêm chạy, còn cái thumbnail thì vẫn được tạo ra đúng đắn — và đó chính là điểm mấu chốt, FFmpeg vẫn làm đúng việc của nó trong cả hai trường hợp. Lựa chọn D là cái bẫy sắc hơn: một request bị khai thác THÀNH CÔNG. FFmpeg chạy, câu lệnh bị tiêm cũng chạy, cả hai đều trả về, và chẳng có gì rơi vào <code>catch</code>. Một bộ đếm đường dự phòng là dụng cụ tốt cho họ lỗi loudnorm và mù tịt trước họ lỗi này, và đó là lý do giáo trình còn nói thêm rằng đứng từ góc nhìn của ứng dụng thì chẳng có gì sai cả.',
          ),
        }),

        mcq({
          prompt: B(
            'The injection payload survived two upload-validation gates that were working correctly:' + code(
              "DANGEROUS_EXT = /\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i\n" +
              '\n' +
              'name = clip.mp4";touch INJECTION_PROOF;#\n' +
              "Content-Type: video/mp4",
            ) + 'Why is it correct to say the gates were not at fault?',
            'Payload tiêm lệnh sống sót qua hai cổng xác thực upload vốn đang chạy đúng:' + code(
              "DANGEROUS_EXT = /\\.(html?|xhtml|svg|js|mjs|xml|php|phtml)$/i\n" +
              '\n' +
              'tên = clip.mp4";touch INJECTION_PROOF;#\n' +
              "Content-Type: video/mp4",
            ) + 'Vì sao nói hai cổng ấy không có lỗi là đúng?',
          ),
          options: [
            B(
              'Because the regex is anchored with <code>$</code> and the payload ends in <code>#</code>, so it is a bug in the anchor: removing <code>$</code> would have caught it and should be the fix',
              'Vì regex neo bằng <code>$</code> mà payload kết thúc bằng <code>#</code>, nên đó là lỗi của cái neo: bỏ <code>$</code> đi sẽ bắt được nó và đó nên là cách sửa',
            ),
            B(
              'Because the gates are advisory: they document intent and the actual enforcement was always meant to happen in the storage provider',
              'Vì hai cổng ấy chỉ mang tính khuyến nghị: chúng ghi lại ý định còn việc thi hành thật thì vốn dĩ được giao cho storage provider',
            ),
            B(
              'Because neither gate was ever designed to sanitise a filename for SHELL use — they answer "is this active content?" — and that is the right call: filenames should never reach a shell in the first place',
              'Vì không cổng nào được thiết kế để làm sạch một tên file cho việc dùng trong SHELL — chúng trả lời câu hỏi "đây có phải nội dung chạy được không?" — và đó là quyết định đúng: tên file lẽ ra không bao giờ được chạm tới một cái shell',
            ),
            B(
              'Because the payload was a valid video and both gates correctly accepted valid videos; the failure was in <code>path.extname</code>, which should not return a string containing a quote character',
              'Vì payload đúng là một video hợp lệ và cả hai cổng đều nhận đúng những video hợp lệ; lỗi nằm ở <code>path.extname</code>, thứ lẽ ra không nên trả về một chuỗi có chứa dấu nháy',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Option A is the seductive one — it identifies a true mechanical detail and proposes a denylist patch. Every denylist of shell metacharacters is missing something: a newline, a <code>$()</code>, a backtick, a locale-dependent character. Widening the regex would have blocked this payload and the next one would be different. The fix that cannot be got subtly wrong is to remove the user\'s bytes from the path entirely — generate it from <code>randomUUID()</code> — and to pass argv so no shell exists. <code>path.extname</code> is behaving exactly as documented; blaming it is blaming the wrong layer.',
            'Lựa chọn A là cái quyến rũ — nó chỉ ra một chi tiết cơ học đúng rồi đề xuất một bản vá kiểu danh sách cấm. Mọi danh sách cấm ký tự đặc biệt của shell đều thiếu thứ gì đó: một dấu xuống dòng, một <code>$()</code>, một dấu huyền ngược, một ký tự phụ thuộc locale. Nới cái regex ra sẽ chặn được payload này và payload kế tiếp sẽ khác. Cách sửa mà bạn không thể làm sai một cách tinh vi là gỡ hẳn byte của người dùng ra khỏi đường dẫn — sinh nó bằng <code>randomUUID()</code> — và truyền argv để không có shell nào tồn tại. <code>path.extname</code> đang hành xử đúng như tài liệu mô tả; đổ lỗi cho nó là đổ lỗi nhầm tầng.',
          ),
        }),

        mcq({
          prompt: B(
            'Three places a transcode runs, and three presets. Which mapping does the course argue for, and what is the reasoning in each case?',
            'Ba chỗ mà một lượt transcode chạy, và ba preset. Ánh xạ nào là thứ giáo trình lập luận cho, và lý do ở từng trường hợp là gì?',
          ),
          options: [
            B(
              'ultrafast for archives, veryfast for hero content, slow for user-facing queues — the queue is where quality matters most because the user is waiting for the result and will judge it',
              'ultrafast cho kho lưu trữ, veryfast cho nội dung chủ lực, slow cho hàng đợi phục vụ người dùng — hàng đợi là chỗ chất lượng quan trọng nhất vì người dùng đang chờ kết quả và sẽ đánh giá nó',
            ),
            B(
              'medium everywhere, because it is the libx264 default and any deviation trades a known quality point for an unmeasured gain',
              'medium ở mọi nơi, vì đó là mặc định của libx264 và mọi sai lệch khỏi nó là đánh đổi một mức chất lượng đã biết lấy một khoản lợi chưa đo',
            ),
            B(
              'ultrafast when the encode must keep up with real time or will be replaced later, veryfast for user-facing background queues (within about 14% of medium\'s size at a fraction of the CPU, so the worker pool clears a backlog several times faster), and slow only for content that ships enough times to repay ten minutes of CPU',
              'ultrafast khi lượt encode phải theo kịp thời gian thực hoặc sẽ bị thay bằng bản khác về sau, veryfast cho hàng đợi nền phục vụ người dùng (kích thước chỉ hơn medium chừng 14% với một phần nhỏ CPU, nên pool worker rút hết tồn đọng nhanh hơn nhiều lần), và slow chỉ dành cho nội dung được phát đủ nhiều lần để hoàn lại mười phút CPU',
            ),
            B(
              'veryslow for everything that is stored, since storage is cumulative and CPU is spent once — the 10% size saving compounds every month while the encode cost does not',
              'veryslow cho mọi thứ được lưu lại, vì dung lượng là tích luỹ còn CPU chỉ tiêu một lần — khoản tiết kiệm 10% kích thước cộng dồn hằng tháng còn chi phí encode thì không',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Option A inverts the reasoning: a user waiting on a queue wants their video to APPEAR, and a size difference in the teens is invisible to them while a four-fold difference in queue-clearing rate is not. Option D is the most interesting wrong answer because its premise is one the course itself argues — storage is cumulative, CPU is not — and it still lands wrong: <code>veryslow</code> buys about 10% for many times the CPU, so on a fixed VPS you would be trading throughput you do not have for storage you can buy. That trade only pays when the bytes ship often enough, which is why the rule names the condition rather than the preset.',
            'Lựa chọn A lật ngược lập luận: một người dùng đang chờ hàng đợi thì muốn video của họ XUẤT HIỆN, và một khoảng chênh kích thước cỡ mười mấy phần trăm thì họ không thấy, còn một khoảng chênh gấp bốn lần về tốc độ rút hàng đợi thì họ thấy. Lựa chọn D là câu trả lời sai thú vị nhất vì tiền đề của nó là thứ chính giáo trình lập luận — dung lượng là tích luỹ, CPU thì không — vậy mà nó vẫn sai: <code>veryslow</code> mua về chừng 10% với cái giá gấp nhiều lần CPU, nên trên một VPS cố định thì bạn đang đem đổi thông lượng mà bạn không có để lấy dung lượng mà bạn mua được. Phép đổi ấy chỉ có lãi khi số byte được phát đi đủ thường xuyên, và đó là lý do quy tắc gọi tên ĐIỀU KIỆN chứ không gọi tên preset.',
          ),
        }),

        mcq({
          prompt: B(
            'Two flags appear in every video recipe in the course and both fix bugs that reproduce only on someone else\'s device:' + code(
              '-pix_fmt yuv420p\n' +
              '-movflags +faststart',
            ) + 'Which pair of symptoms do they prevent?',
            'Hai cờ xuất hiện trong mọi công thức video của khoá này và cả hai đều sửa những lỗi chỉ tái hiện trên thiết bị của người khác:' + code(
              '-pix_fmt yuv420p\n' +
              '-movflags +faststart',
            ) + 'Chúng ngăn được cặp triệu chứng nào?',
          ),
          options: [
            B(
              '"The video is black on iPhone but fine on my laptop", and "the video takes tens of seconds to start on large files"',
              '"Video đen thui trên iPhone nhưng ổn trên laptop", và "video mất hàng chục giây mới bắt đầu phát với file lớn"',
            ),
            B(
              '"The video has no seek bar", and "seeking re-downloads from the beginning"',
              '"Video không có thanh tua", và "tua thì tải lại từ đầu"',
            ),
            B(
              '"Rendition switching glitches on mobile", and "one segment is missing and playback stalls mid-way"',
              '"Đổi bản bị vỡ hình trên di động", và "một segment bị thiếu và việc phát khựng giữa chừng"',
            ),
            B(
              '"The upload succeeded but no thumbnail appeared", and "the file plays in VLC but not in the browser"',
              '"Upload thành công mà không có thumbnail", và "file phát được trên VLC mà không phát được trên trình duyệt"',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both symptoms are expensive to debug precisely because they need hardware or a file size you may not have to hand. Safari and QuickTime decode only 4:2:0 chroma in H.264, so a <code>yuv422p</code> or <code>yuv444p</code> output plays perfectly in VLC and Chrome and shows a black screen on every Apple device. And without <code>+faststart</code> the <code>moov</code> index is written at the END, so a browser must buffer toward the last byte before it can start. Option B belongs to <code>-hls_playlist_type vod</code> and to the <code>206</code> rule; option C belongs to keyframe pinning and to HLS operations.',
            'Cả hai triệu chứng đều tốn kém để gỡ đúng vì chúng cần phần cứng hoặc một kích thước file mà bạn có thể không sẵn có. Safari và QuickTime chỉ giải mã được chroma 4:2:0 trong H.264, nên một bản ra <code>yuv422p</code> hay <code>yuv444p</code> phát ngon lành trên VLC và Chrome rồi hiện màn hình đen trên mọi thiết bị Apple. Còn không có <code>+faststart</code> thì chỉ mục <code>moov</code> được ghi ở CUỐI, nên trình duyệt phải đệm tới tận byte cuối rồi mới bắt đầu được. Lựa chọn B thuộc về <code>-hls_playlist_type vod</code> và về luật <code>206</code>; lựa chọn C thuộc về việc ghim frame khoá và về vận hành HLS.',
          ),
        }),

        mcq({
          prompt: B(
            'The course\'s key rule is <code>&lt;category&gt;/&lt;u+id&gt;/&lt;timestamp&gt;-&lt;random&gt;&lt;OUTPUT extension&gt;</code>, with the user\'s filename in a database column. Which claim about this is FALSE?',
            'Luật đặt key của khoá này là <code>&lt;danh-mục&gt;/&lt;u+id&gt;/&lt;dấu-thời-gian&gt;-&lt;ngẫu-nhiên&gt;&lt;đuôi ĐẦU RA&gt;</code>, còn tên file của người dùng thì nằm trong một cột cơ sở dữ liệu. Khẳng định nào về chuyện này là SAI?',
          ),
          options: [
            B(
              'The category prefix decides which lifecycle policies are even expressible, since rules match on prefix',
              'Tiền tố danh mục quyết định những chính sách vòng đời nào thậm chí còn DIỄN ĐẠT được, vì các quy tắc khớp theo tiền tố',
            ),
            B(
              'Discarding the filename removes an information-disclosure channel: a public URL containing a document title leaks the contents to anyone who sees the link',
              'Vứt bỏ tên file loại được một kênh lộ thông tin: một URL công khai chứa tiêu đề tài liệu sẽ làm lộ nội dung cho bất kỳ ai nhìn thấy đường dẫn',
            ),
            B(
              'The twelve hex characters exist purely to avoid two uploads colliding in the same millisecond; nothing else in the design depends on them',
              'Mười hai ký tự hex tồn tại thuần tuý để hai lượt upload trong cùng một mili giây không đụng nhau; không thứ gì khác trong thiết kế phụ thuộc vào chúng',
            ),
            B(
              'The scheme is the one thing you cannot change later without rewriting every URL you have handed out, which is why it lives in its own file with its rules at the top',
              'Khuôn key là thứ duy nhất bạn không đổi được về sau nếu không viết lại mọi URL đã phát ra, và đó là lý do nó nằm trong một file riêng với các luật ghi ngay đầu file',
            ),
          ],
          correct: 2,
          explanation: EX(
            'That is the trap from chapter 5. The builder is deliberately non-deterministic — <code>Date.now()</code> plus <code>crypto.randomBytes(6)</code> — which is exactly right for user uploads and exactly wrong inside a retryable job: a redelivered job writes a second complete set of variants under fresh keys, the database points at the newest, and the earlier set becomes storage nothing references. Worker outputs must be derived from the INPUT key so a retry overwrites rather than duplicates. The other three statements are all correct.',
            'Đó chính là cái bẫy của chương 5. Hàm dựng key CỐ Ý không xác định — <code>Date.now()</code> cộng <code>crypto.randomBytes(6)</code> — và đó đúng cho ảnh người dùng upload, sai đúng chỗ khi nằm trong một job có thể chạy lại: một job được giao lại sẽ ghi ra một bộ variant hoàn chỉnh thứ hai dưới những key mới, cơ sở dữ liệu trỏ vào bộ mới nhất, còn bộ cũ trở thành dung lượng không ai tham chiếu. Bản ra của worker phải được suy từ key ĐẦU VÀO để một lượt chạy lại GHI ĐÈ chứ không nhân đôi. Ba phát biểu còn lại đều đúng.',
          ),
        }),

        mcq({
          prompt: B(
            'Chapter 10 lists what the course deliberately left out: DRM, per-title encoding, AV1 in production, subtitles, and image ML. Why does a summary chapter bother saying what it does not cover?',
            'Chương 10 liệt kê những thứ khoá này cố ý bỏ ra ngoài: DRM, encode theo từng nội dung, AV1 ở production, phụ đề, và ML trên ảnh. Vì sao một chương tổng kết lại bận tâm nói ra thứ nó KHÔNG bao phủ?',
          ),
          options: [
            B(
              'Because a scope statement is what lets a reader estimate how long the material will take, which is standard practice for technical courses',
              'Vì một tuyên bố phạm vi là thứ giúp người đọc ước lượng tài liệu sẽ mất bao lâu để học, và đó là thông lệ của các khoá kỹ thuật',
            ),            B(
              'Because each omitted topic is a paid module, and the list is the course roadmap rather than a caveat',
              'Vì mỗi chủ đề bị bỏ ra là một học phần trả phí, và cái danh sách ấy là lộ trình khoá học chứ không phải một lời rào trước',
            ),
            B(
              'Because those five topics are the ones where the repo\'s implementation is known to be wrong, so the list doubles as a bug backlog',
              'Vì năm chủ đề ấy là những chỗ mà cách cài đặt trong kho đã biết là sai, nên danh sách ấy kiêm luôn vai trò một danh mục bug cần sửa',
            ),
            B(
              'Because a reader who mistakes the covered ground for the whole field will apply a rule outside the conditions it was measured under — the course has no data on those topics, and saying so is what stops its numbers being quoted where they do not apply',
              'Vì một người đọc nhầm phần đã bao phủ là toàn bộ lĩnh vực sẽ áp một quy tắc ra ngoài điều kiện mà nó được đo — khoá này không có dữ liệu về những chủ đề ấy, và nói thẳng ra chính là thứ ngăn các con số của nó bị trích dẫn ở chỗ chúng không áp dụng được',
            ),

          ],
          correct: 3,
          explanation: EX(
            'It is the same discipline as the provenance section, applied to coverage rather than to figures. The course has real measurements for WebP quality curves and x264 presets, and none at all for AV1 encode economics or subtitle authoring — and the reason each was left out is stated (AV1\'s encoder is slow enough to belong in a background tier and its hardware decode story is uneven; per-title encoding is real and only pays off at catalogue scale). Knowing where the data stops is what stops you extending a conclusion past it.',
            'Đây là cùng một kỷ luật với mục xuất xứ, chỉ áp cho phạm vi thay vì cho những con số. Khoá này có phép đo thật cho đường cong quality của WebP và cho preset của x264, và hoàn toàn không có gì cho kinh tế của việc encode AV1 hay việc soạn phụ đề — và lý do bỏ từng thứ ra đều được nêu (encoder của AV1 chậm tới mức thuộc về tầng chạy nền và câu chuyện giải mã bằng phần cứng của nó thì không đồng đều; encode theo từng nội dung là có thật và chỉ có lãi ở quy mô một kho nội dung lớn). Biết dữ liệu dừng ở đâu là thứ ngăn bạn kéo dài một kết luận vượt qua chỗ đó.',
          ),
        }),

        mcq({
          prompt: B(
            'One sentence is offered as the thread running through the entire course. Which is it?',
            'Có một câu được nêu là sợi chỉ xuyên suốt cả khoá học. Câu nào?',
          ),
          options: [
            B(
              'Choose the container first and tune inside it, because the format decides more than the settings do',
              'Hãy chọn container trước rồi mới tinh chỉnh bên trong nó, vì format quyết định nhiều hơn các cài đặt',
            ),
            B(
              'Never build a shell string, because every media pipeline eventually invokes an external tool on user-influenced input',
              'Đừng bao giờ dựng một chuỗi shell, vì đường ống media nào rồi cũng gọi một công cụ ngoài trên đầu vào chịu ảnh hưởng của người dùng',
            ),
            B(
              'Check pixels rather than bytes, because that is the only budget that predicts memory and the only one an attacker cannot cheat',
              'Hãy kiểm PIXEL chứ đừng kiểm byte, vì đó là ngân sách duy nhất dự báo được bộ nhớ và là ngân sách duy nhất kẻ tấn công không lách được',
            ),
            B(
              'Assert a property of the OUTPUT rather than trusting that the function returned — it is what both real bugs needed, what a green exit code cannot give you, and what every measurement in the course was ultimately doing',
              'Hãy khẳng định một thuộc tính của BẢN RA thay vì tin rằng hàm đã trả về — đó là thứ mà cả hai con bug thật đều cần, là thứ một mã thoát bằng 0 không cho bạn được, và là thứ mà mọi phép đo trong khoá này rốt cuộc đều đang làm',
            ),
          ],
          correct: 3,
          explanation: EX(
            'All four are rules the course states and the first three are load-bearing, but only one is the thread. Every chapter ends up there: <code>metadata()</code> on the result rather than a successful return, <code>ffprobe</code> on the artifact rather than a zero exit code, re-measuring loudness rather than reading the log, comparing <code>pages</code> in against <code>pages</code> out, watching the compression ratio in aggregate. In media a green exit code proves almost nothing — the loudness bug, the lost GIF frames and the sideways photo all produced a structurally valid file and a successful return.',
            'Cả bốn đều là luật mà giáo trình nêu và ba luật đầu đều chịu lực, nhưng chỉ một cái là SỢI CHỈ. Chương nào rồi cũng dẫn tới đó: gọi <code>metadata()</code> trên kết quả thay vì tin vào một lượt trả về thành công, chạy <code>ffprobe</code> trên hiện vật thay vì tin một mã thoát bằng 0, đo lại độ to thay vì đọc log, so <code>pages</code> vào với <code>pages</code> ra, theo dõi tỉ lệ nén trên tổng thể. Trong media thì một mã thoát bằng 0 gần như không chứng minh được gì — con bug độ to, những frame GIF bị mất và tấm ảnh nằm nghiêng đều sinh ra một file hợp lệ về cấu trúc và một lượt trả về thành công.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — A live HLS window, on paper (chapter 8).</b> Implement four functions. Every rule below was checked against a real 30-second live encode run with <code>-hls_time 2 -hls_list_size 6 -hls_flags delete_segments</code>.</p>' +
            '<p><code>playlist(daGhi, ch)</code> — given how many segments have been written, return <code>{ mediaSequence, muc }</code>. A live playlist is a SLIDING WINDOW holding the last <code>listSize</code> segments; <code>mediaSequence</code> is the index of the first one still listed. Names are <code>seg-00000.ts</code>, five digits, zero padded.</p>' +
            '<p><code>conLaiTrenDia(daGhi, ch)</code> — the segment filenames still on disk, oldest first. Measured: with 15 written and <code>listSize</code> 6, SEVEN files survive (<code>seg-00008</code> … <code>seg-00014</code>) — the deletion lags the window by exactly one segment.</p>' +
            '<p><code>doTre(ch)</code> — the end-to-end latency budget, returning <code>{ maHoa, daySegment, lenOrigin, cdn, dem, tong }</code>. <code>daySegment</code> is <code>hlsTime</code> (a segment cannot be published before it is complete) and <code>dem</code> is <code>demSegment × hlsTime</code>. The other three terms come straight from the config. These are the PROBLEM\'s numbers, not a measurement of this machine.</p>' +
            '<p><code>cacheControl(loai, ch)</code> — <code>segment</code> and <code>manifest-vod</code> are immutable and get <code>public, max-age=31536000, immutable</code>; <code>manifest-live</code> gains an entry every <code>hlsTime</code> seconds and gets <code>public, max-age=&lt;hlsTime&gt;</code>.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 31 — Một cửa sổ HLS trực tiếp, tính trên giấy (chương 8).</b> Hãy cài đặt bốn hàm. Mọi luật dưới đây đều đã đối chiếu với một lượt encode trực tiếp thật dài 30 giây chạy với <code>-hls_time 2 -hls_list_size 6 -hls_flags delete_segments</code>.</p>' +
            '<p><code>playlist(daGhi, ch)</code> — cho biết đã ghi xong bao nhiêu segment, trả về <code>{ mediaSequence, muc }</code>. Một playlist trực tiếp là CỬA SỔ TRƯỢT giữ <code>listSize</code> segment mới nhất; <code>mediaSequence</code> là chỉ số của segment đầu tiên còn được liệt kê. Tên có dạng <code>seg-00000.ts</code>, năm chữ số, đệm số 0.</p>' +
            '<p><code>conLaiTrenDia(daGhi, ch)</code> — tên các file segment còn trên đĩa, cũ trước. Đo thật: với 15 segment đã ghi và <code>listSize</code> bằng 6 thì BẢY file sống sót (<code>seg-00008</code> … <code>seg-00014</code>) — việc xoá trễ hơn cửa sổ đúng một segment.</p>' +
            '<p><code>doTre(ch)</code> — ngân sách độ trễ đầu-cuối, trả về <code>{ maHoa, daySegment, lenOrigin, cdn, dem, tong }</code>. <code>daySegment</code> bằng <code>hlsTime</code> (không thể công bố một segment chưa hoàn tất) và <code>dem</code> bằng <code>demSegment × hlsTime</code>. Ba số hạng còn lại lấy thẳng từ cấu hình. Đây là những con số CỦA ĐỀ BÀI, không phải số đo trên máy này.</p>' +
            '<p><code>cacheControl(loai, ch)</code> — <code>segment</code> và <code>manifest-vod</code> là bất biến nên nhận <code>public, max-age=31536000, immutable</code>; <code>manifest-live</code> thì cứ <code>hlsTime</code> giây lại có thêm một mục nên nhận <code>public, max-age=&lt;hlsTime&gt;</code>.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CAU_HINH = { hlsTime: 2, listSize: 6, demSegment: 3, giayLenOrigin: 0.5, giayCdn: 0.3, giayMaHoa: 0.5 };\n' +
            'const MOC = [1, 3, 6, 7, 15];          // số segment đã ghi xong tại mỗi mốc\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function playlist(daGhi, ch) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function conLaiTrenDia(daGhi, ch) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function doTre(ch) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function cacheControl(loai, ch) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const n of MOC) {\n' +
            '  const p = playlist(n, CAU_HINH);\n' +
            '  const d = conLaiTrenDia(n, CAU_HINH);\n' +
            '  console.log(\n' +
            "    `da ghi ${String(n).padStart(2)} | MEDIA-SEQUENCE:${p.mediaSequence} | playlist ${p.muc.join(' ') || '(rong)'} | ` +\n" +
            '    `dia ${d.length} file (${d[0]}..${d[d.length - 1]})`,\n' +
            '  );\n' +
            '}\n' +
            'const t = doTre(CAU_HINH);\n' +
            'console.log(`do tre: ma hoa ${t.maHoa} + day segment ${t.daySegment} + len origin ${t.lenOrigin} + cdn ${t.cdn} + dem ${t.dem} = ${t.tong} s`);\n' +
            "for (const loai of ['segment', 'manifest-vod', 'manifest-live']) {\n" +
            '  console.log(`${loai}: ${cacheControl(loai, CAU_HINH)}`);\n' +
            '}\n',
          expectedOutput:
            'da ghi  1 | MEDIA-SEQUENCE:0 | playlist seg-00000.ts | dia 1 file (seg-00000.ts..seg-00000.ts)\n' +
            'da ghi  3 | MEDIA-SEQUENCE:0 | playlist seg-00000.ts seg-00001.ts seg-00002.ts | dia 3 file (seg-00000.ts..seg-00002.ts)\n' +
            'da ghi  6 | MEDIA-SEQUENCE:0 | playlist seg-00000.ts seg-00001.ts seg-00002.ts seg-00003.ts seg-00004.ts seg-00005.ts | dia 6 file (seg-00000.ts..seg-00005.ts)\n' +
            'da ghi  7 | MEDIA-SEQUENCE:1 | playlist seg-00001.ts seg-00002.ts seg-00003.ts seg-00004.ts seg-00005.ts seg-00006.ts | dia 7 file (seg-00000.ts..seg-00006.ts)\n' +
            'da ghi 15 | MEDIA-SEQUENCE:9 | playlist seg-00009.ts seg-00010.ts seg-00011.ts seg-00012.ts seg-00013.ts seg-00014.ts | dia 7 file (seg-00008.ts..seg-00014.ts)\n' +
            'do tre: ma hoa 0.5 + day segment 2 + len origin 0.5 + cdn 0.3 + dem 6 = 9.3 s\n' +
            'segment: public, max-age=31536000, immutable\n' +
            'manifest-vod: public, max-age=31536000, immutable\n' +
            'manifest-live: public, max-age=2',
          sampleSolution:
            'function playlist(daGhi, ch) {\n' +
            '  // Playlist trực tiếp là một CỬA SỔ TRƯỢT: chỉ giữ listSize segment mới nhất.\n' +
            '  const dau = Math.max(0, daGhi - ch.listSize);\n' +
            '  const muc = [];\n' +
            "  for (let i = dau; i < daGhi; i++) muc.push(`seg-${String(i).padStart(5, '0')}.ts`);\n" +
            '  // MEDIA-SEQUENCE là chỉ số của segment ĐẦU TIÊN còn trong playlist — nó cho\n' +
            '  // player biết nó đã bỏ lỡ bao nhiêu, và nó KHÔNG bao giờ lùi lại.\n' +
            '  return { mediaSequence: dau, muc };\n' +
            '}\n\n' +
            'function conLaiTrenDia(daGhi, ch) {\n' +
            '  // delete_segments xoá TRỄ một segment so với cửa sổ: đo thật, 15 segment với\n' +
            '  // listSize 6 để lại 7 file (seg-00008 … seg-00014), không phải 6.\n' +
            '  const dau = Math.max(0, daGhi - ch.listSize - 1);\n' +
            '  const ra = [];\n' +
            "  for (let i = dau; i < daGhi; i++) ra.push(`seg-${String(i).padStart(5, '0')}.ts`);\n" +
            '  return ra;\n' +
            '}\n\n' +
            'function doTre(ch) {\n' +
            '  const daySegment = ch.hlsTime;              // không thể công bố một segment chưa đầy\n' +
            '  const dem = ch.demSegment * ch.hlsTime;     // player đệm demSegment segment mới phát\n' +
            '  const tong = ch.giayMaHoa + daySegment + ch.giayLenOrigin + ch.giayCdn + dem;\n' +
            '  return { maHoa: ch.giayMaHoa, daySegment, lenOrigin: ch.giayLenOrigin, cdn: ch.giayCdn, dem, tong };\n' +
            '}\n\n' +
            'function cacheControl(loai, ch) {\n' +
            '  // seg-00042.ts không bao giờ đổi nội dung ⇒ bất biến, cache một năm.\n' +
            "  if (loai === 'segment') return 'public, max-age=31536000, immutable';\n" +
            '  // Một manifest VOD cũng bất biến khi lượt encode đã xong.\n' +
            "  if (loai === 'manifest-vod') return 'public, max-age=31536000, immutable';\n" +
            '  // Một manifest TRỰC TIẾP đổi sau mỗi segment ⇒ chỉ được cache đúng một segment.\n' +
            '  return `public, max-age=${ch.hlsTime}`;\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Which assertion would have caught it (chapter 9).</b> Every artifact below returned normally and answered HTTP 200; two of them are broken anyway. Implement three functions.</p>' +
            '<p><code>doc(hienVat, duong)</code> — resolve a two-level path such as <code>&quot;ra.cao&quot;</code> against an artifact record.</p>' +
            '<p><code>phanLoai(pk)</code> — return <code>&quot;MANH&quot;</code> if the check asserts a property of the OUTPUT (either side of the comparison reads from <code>ra.</code>), otherwise <code>&quot;YEU&quot;</code>. A check that only reads <code>goi.</code> or <code>vao.</code> is weak by construction: "the function returned", "HTTP 200" and "the input was under the cap" are all TRUE in both of the real bugs this course found.</p>' +
            '<p><code>danhGia(pk, hienVat)</code> — return <code>&quot;DAT&quot;</code>, <code>&quot;HONG&quot;</code> or <code>&quot;BOQUA&quot;</code>. A check may carry a <code>chiKhi</code> precondition in the same shape as the check itself; when the precondition is false the check says NOTHING about this artifact and must be skipped rather than counted as a failure. On the right-hand side, a string matching <code>&lt;vao|ra|goi&gt;.&lt;field&gt;</code> is another path to resolve; anything else is a literal. Support <code>===</code>, <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> and <code>&gt;=</code>.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Phép khẳng định nào lẽ ra đã bắt được nó (chương 9).</b> Mọi hiện vật dưới đây đều trả về bình thường và đáp HTTP 200; hai trong số đó vẫn hỏng. Hãy cài đặt ba hàm.</p>' +
            '<p><code>doc(hienVat, duong)</code> — phân giải một đường dẫn hai tầng kiểu <code>&quot;ra.cao&quot;</code> trên một bản ghi hiện vật.</p>' +
            '<p><code>phanLoai(pk)</code> — trả về <code>&quot;MANH&quot;</code> nếu phép kiểm khẳng định một thuộc tính của ĐẦU RA (một trong hai vế của phép so đọc từ <code>ra.</code>), ngược lại trả <code>&quot;YEU&quot;</code>. Một phép kiểm chỉ đọc <code>goi.</code> hay <code>vao.</code> thì yếu theo bản chất: "hàm đã trả về", "HTTP 200" và "đầu vào dưới trần" đều ĐÚNG trong cả hai con bug thật mà khoá này tìm ra.</p>' +
            '<p><code>danhGia(pk, hienVat)</code> — trả về <code>&quot;DAT&quot;</code>, <code>&quot;HONG&quot;</code> hoặc <code>&quot;BOQUA&quot;</code>. Một phép kiểm có thể mang điều kiện <code>chiKhi</code> với hình dạng y như chính phép kiểm; khi điều kiện ấy sai thì phép kiểm KHÔNG NÓI GÌ về hiện vật này và phải được bỏ qua, chứ không được tính là hỏng. Ở vế phải, một chuỗi khớp <code>&lt;vao|ra|goi&gt;.&lt;trường&gt;</code> là một đường dẫn nữa cần phân giải; mọi thứ khác là hằng số. Hỗ trợ <code>===</code>, <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> và <code>&gt;=</code>.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Mỗi hiện vật: `vao` là thứ đo được trên ĐẦU VÀO, `ra` trên ĐẦU RA,\n' +
            '// `goi` là thứ quan sát được về LỜI GỌI (nó có ném lỗi không, mã HTTP nào).\n' +
            'const HIEN_VAT = {\n' +
            "  'chan-dung-o6.jpg': {\n" +
            '    vao: { rong: 4032, cao: 3024, trang: 1, byte: 4038620, orientation: 6 },\n' +
            '    ra:  { rong: 1200, cao: 900,  trang: 1, byte: 264000 },\n' +
            '    goi: { nemLoi: false, http: 200 },\n' +
            '  },\n' +
            "  'chan-dung-da-va.jpg': {\n" +
            '    vao: { rong: 4032, cao: 3024, trang: 1, byte: 4038620, orientation: 6 },\n' +
            '    ra:  { rong: 1200, cao: 1600, trang: 1, byte: 264000 },\n' +
            '    goi: { nemLoi: false, http: 200 },\n' +
            '  },\n' +
            "  'phan-ung.gif': {\n" +
            '    vao: { rong: 480, cao: 270, trang: 48, byte: 345659, orientation: 1 },\n' +
            '    ra:  { rong: 480, cao: 270, trang: 1,  byte: 5214 },\n' +
            '    goi: { nemLoi: false, http: 200 },\n' +
            '  },\n' +
            "  'phan-ung-da-va.gif': {\n" +
            '    vao: { rong: 480, cao: 270, trang: 48, byte: 345659, orientation: 1 },\n' +
            '    ra:  { rong: 480, cao: 270, trang: 48, byte: 207060 },\n' +
            '    goi: { nemLoi: false, http: 200 },\n' +
            '  },\n' +
            "  'anh-man-hinh.png': {\n" +
            '    vao: { rong: 1280, cao: 720, trang: 1, byte: 96453, orientation: 1 },\n' +
            '    ra:  { rong: 1280, cao: 720, trang: 1, byte: 96734 },\n' +
            '    goi: { nemLoi: false, http: 200 },\n' +
            '  },\n' +
            '};\n\n' +
            'const PHEP_KIEM = [\n' +
            "  { ten: 'khong-nem-loi',  trai: 'goi.nemLoi', phep: '===', phai: false },\n" +
            "  { ten: 'http-200',       trai: 'goi.http',   phep: '===', phai: 200 },\n" +
            "  { ten: 'vao-duoi-tran',  trai: 'vao.rong',   phep: '<=',  phai: 10000 },\n" +
            "  { ten: 'ra-dung-huong',  trai: 'ra.cao',     phep: '>',   phai: 'ra.rong',\n" +
            "    chiKhi: { trai: 'vao.orientation', phep: '>=', phai: 5 } },\n" +
            "  { ten: 'giu-du-frame',   trai: 'ra.trang',   phep: '===', phai: 'vao.trang' },\n" +
            "  { ten: 'ra-nho-hon-vao', trai: 'ra.byte',    phep: '<',   phai: 'vao.byte' },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function doc(hienVat, duong) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function phanLoai(pk) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function danhGia(pk, hienVat) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "for (const pk of PHEP_KIEM) console.log(`${pk.ten.padEnd(15)} ${phanLoai(pk)}`);\n" +
            "console.log('---');\n" +
            "const MANH = PHEP_KIEM.filter((pk) => phanLoai(pk) === 'MANH');\n" +
            'for (const [ten, hv] of Object.entries(HIEN_VAT)) {\n' +
            '  const kq = MANH.map((pk) => `${pk.ten}=${danhGia(pk, hv)}`);\n' +
            "  const hong = kq.filter((k) => k.endsWith('HONG')).length;\n" +
            "  console.log(`${ten.padEnd(21)} ${kq.join(' ')} -> ${hong ? 'BAT DUOC LOI' : 'sach'}`);\n" +
            '}\n',
          expectedOutput:
            'khong-nem-loi   YEU\n' +
            'http-200        YEU\n' +
            'vao-duoi-tran   YEU\n' +
            'ra-dung-huong   MANH\n' +
            'giu-du-frame    MANH\n' +
            'ra-nho-hon-vao  MANH\n' +
            '---\n' +
            'chan-dung-o6.jpg      ra-dung-huong=HONG giu-du-frame=DAT ra-nho-hon-vao=DAT -> BAT DUOC LOI\n' +
            'chan-dung-da-va.jpg   ra-dung-huong=DAT giu-du-frame=DAT ra-nho-hon-vao=DAT -> sach\n' +
            'phan-ung.gif          ra-dung-huong=BOQUA giu-du-frame=HONG ra-nho-hon-vao=DAT -> BAT DUOC LOI\n' +
            'phan-ung-da-va.gif    ra-dung-huong=BOQUA giu-du-frame=DAT ra-nho-hon-vao=DAT -> sach\n' +
            'anh-man-hinh.png      ra-dung-huong=BOQUA giu-du-frame=DAT ra-nho-hon-vao=HONG -> BAT DUOC LOI',
          sampleSolution:
            'function doc(hienVat, duong) {\n' +
            '  // "ra.cao" -> hienVat.ra.cao. Chỉ hai tầng, không cần gì phức tạp hơn.\n' +
            "  const [o, truong] = duong.split('.');\n" +
            '  return hienVat[o][truong];\n' +
            '}\n\n' +
            "const LA_DUONG = (v) => typeof v === 'string' && /^(vao|ra|goi)\\.[a-zA-Z]+$/.test(v);\n\n" +
            'function phanLoai(pk) {\n' +
            '  // Một phép kiểm chỉ MẠNH khi nó khẳng định một thuộc tính của ĐẦU RA.\n' +
            '  // "hàm đã trả về" và "HTTP 200" đúng trong CẢ HAI bug thật của khoá này, nên\n' +
            '  // chúng không phân biệt được bản chạy đúng với bản hỏng. Một phép kiểm chỉ\n' +
            '  // đọc ĐẦU VÀO cũng vậy: nó xác thực đầu vào chứ không xác minh đầu ra.\n' +
            "  const veDauRa = (d) => typeof d === 'string' && d.startsWith('ra.');\n" +
            "  return veDauRa(pk.trai) || veDauRa(pk.phai) ? 'MANH' : 'YEU';\n" +
            '}\n\n' +
            'function soSanh(trai, phep, phai) {\n' +
            '  switch (phep) {\n' +
            "    case '===': return trai === phai;\n" +
            "    case '<':   return trai < phai;\n" +
            "    case '<=':  return trai <= phai;\n" +
            "    case '>':   return trai > phai;\n" +
            "    case '>=':  return trai >= phai;\n" +
            '    default:    throw new Error(`phep la: ${phep}`);\n' +
            '  }\n' +
            '}\n\n' +
            'function chay(dk, hienVat) {\n' +
            '  const trai = doc(hienVat, dk.trai);\n' +
            '  // Vế phải là một ĐƯỜNG DẪN khi nó có dạng "<o>.<truong>"; còn lại là hằng số.\n' +
            '  const phai = LA_DUONG(dk.phai) ? doc(hienVat, dk.phai) : dk.phai;\n' +
            '  return soSanh(trai, dk.phep, phai);\n' +
            '}\n\n' +
            'function danhGia(pk, hienVat) {\n' +
            '  // Điều kiện áp dụng đứng trước: một phép kiểm không nói gì về hiện vật này\n' +
            '  // thì phải BỎ QUA, chứ không được tính là hỏng.\n' +
            "  if (pk.chiKhi && !chay(pk.chiKhi, hienVat)) return 'BOQUA';\n" +
            "  return chay(pk, hienVat) ? 'DAT' : 'HONG';\n" +
            '}\n',
        }),
      ],
    },
  ],
};
