/**
 * Case-study 3.3 — Video Streaming Platform (Netflix-like).
 *
 * Deliberately NOT a repeat of the LMS video chapter. The LMS covered content
 * PROTECTION (HLS segmentation, signed URLs). This one covers the three things
 * that decide whether a streaming service is viable: a per-title bitrate
 * ladder, an ABR switching rule that does not oscillate, and the CDN cache
 * behaviour that writes the bandwidth bill.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./video-streaming-platform-netflix-like.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./video-streaming-platform-netflix-like.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'video-streaming-platform-netflix-like',
  title: 'Video Streaming Platform (Netflix-like)',
  titleEn: 'Video Streaming Platform (Netflix-like)',
  description:
    'Nền tảng xem phim trực tuyến: chuyển mã song song, phát thích ứng theo mạng, gợi ý nội dung. Ba bài toán mà LMS chưa chạm tới — thang bitrate riêng theo từng phim, thuật toán đổi chất lượng không nhấp nháy, và tỉ lệ trúng bộ nhớ đệm CDN quyết định hoá đơn băng thông.',
  descriptionEn:
    'A streaming service: parallel transcoding, network-adaptive playback, content recommendations. Three problems the LMS never touched — a per-title bitrate ladder, a switching algorithm that does not oscillate, and the CDN cache behaviour that writes the bandwidth bill.',
  techStack: [
    'Next.js 15', 'Node.js', 'TypeScript', 'FFmpeg', 'VMAF', 'HLS', 'DASH',
    'PostgreSQL', 'Prisma', 'Redis', 'BullMQ', 'Cloudflare R2', 'hls.js', 'pgvector',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '6–8 tuần',
  durationEn: '6–8 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'ADVANCED',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/video-streaming-platform-netflix-like.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- bitrate_kbps được TÍNH RIÊNG cho từng phim, không lấy từ bảng cố định.
-- Phim hoạt hình phẳng màu đạt chất lượng gần hoàn hảo ở 1.8 Mbps, cảnh
-- hành động nhiều hạt nhiễu vẫn vỡ ở 5 Mbps. Một thang chung nghĩa là
-- vừa lãng phí băng thông vừa cho hình xấu, ở hai loại nội dung khác nhau.

CREATE TABLE video_assets (
    id           TEXT        PRIMARY KEY,
    title_id     TEXT        NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    height       INTEGER     NOT NULL,
    bitrate_kbps INTEGER     NOT NULL,
    -- Điểm chất lượng ĐO ĐƯỢC (0-100), không phải cảm nhận của người mã hoá.
    -- Quy trình: mã hoá thử nhiều bitrate, đo VMAF, lấy bitrate THẤP NHẤT
    -- vẫn đạt ngưỡng (thường ~93). Riêng bước này cắt 30-50% hoá đơn.
    vmaf_score   REAL,
    playlist_path TEXT       NOT NULL,
    status       VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    -- Mã định danh của LƯỢT chuyển mã. Worker chết giữa chừng thì dọn
    -- theo mã này, nếu không kho phình lên vì những lần thử hỏng.
    encode_run_id TEXT,
    UNIQUE (title_id, height)
);

CREATE TABLE watch_states (
    profile_id   TEXT        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title_id     TEXT        NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    position_sec INTEGER     NOT NULL DEFAULT 0,
    completed    BOOLEAN     NOT NULL DEFAULT false,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (profile_id, title_id)
);

-- Bảng này sinh dữ liệu nhanh hơn MỌI bảng khác cộng lại. Đừng ghi từng
-- sự kiện vào database chính — gom ở client, gửi theo lô, và về lâu dài
-- chuyển hẳn sang kho phân tích riêng.
CREATE TABLE play_events (
    id          BIGSERIAL   PRIMARY KEY,
    profile_id  TEXT        NOT NULL,
    title_id    TEXT        NOT NULL,
    type        VARCHAR(16) NOT NULL,
    -- Ba chỉ số cần theo dõi, và chỉ ba:
    --   startup_ms   : bấm phát → khung hình đầu. Ngưỡng là 2 giây.
    --   buffer_ms    : thời gian đứng hình, để tính tỉ lệ giật (<0.5%).
    --   bitrate_kbps : chất lượng người xem THỰC SỰ nhận được.
    startup_ms  INTEGER,
    buffer_ms   INTEGER,
    bitrate_kbps INTEGER,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX play_events_time_idx ON play_events (occurred_at DESC);
CREATE INDEX play_events_title_idx ON play_events (title_id, occurred_at DESC);`,

  schemaCodeEn: `-- bitrate_kbps is COMPUTED per title, never read from a fixed table.
-- Flat animation reaches near-perfect quality at 1.8 Mbps; a grainy action
-- scene still falls apart at 5 Mbps. One shared ladder means wasting
-- bandwidth on one kind of content and degrading the other.

CREATE TABLE video_assets (
    id           TEXT        PRIMARY KEY,
    title_id     TEXT        NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    height       INTEGER     NOT NULL,
    bitrate_kbps INTEGER     NOT NULL,
    -- A MEASURED quality score (0-100), not the encoder operator's opinion.
    -- The process: encode test clips at several bitrates, measure VMAF, take
    -- the LOWEST bitrate still clearing the target (~93). This step alone
    -- cuts 30-50% off the bill.
    vmaf_score   REAL,
    playlist_path TEXT       NOT NULL,
    status       VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    -- An id for the transcode RUN. When a worker dies mid-job, clean up by
    -- this id, or storage grows with every failed attempt.
    encode_run_id TEXT,
    UNIQUE (title_id, height)
);

CREATE TABLE watch_states (
    profile_id   TEXT        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title_id     TEXT        NOT NULL REFERENCES titles(id) ON DELETE CASCADE,
    position_sec INTEGER     NOT NULL DEFAULT 0,
    completed    BOOLEAN     NOT NULL DEFAULT false,
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (profile_id, title_id)
);

-- This table generates data faster than ALL the others combined. Do not write
-- events individually into the primary database — batch client-side, send in
-- bulk, and in the long run move it to separate analytical storage entirely.
CREATE TABLE play_events (
    id          BIGSERIAL   PRIMARY KEY,
    profile_id  TEXT        NOT NULL,
    title_id    TEXT        NOT NULL,
    type        VARCHAR(16) NOT NULL,
    -- Three metrics to track, and only three:
    --   startup_ms   : press play → first frame. The threshold is 2 seconds.
    --   buffer_ms    : stalled time, for rebuffer ratio (<0.5%).
    --   bitrate_kbps : the quality viewers ACTUALLY received.
    startup_ms  INTEGER,
    buffer_ms   INTEGER,
    bitrate_kbps INTEGER,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX play_events_time_idx ON play_events (occurred_at DESC);
CREATE INDEX play_events_title_idx ON play_events (title_id, occurred_at DESC);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Thang bitrate riêng theo từng phim, đo bằng VMAF',
      titleEn: 'A per-title bitrate ladder, validated with VMAF',
      description:
        'Ba mức cố định 1080p/720p/480p sai theo hai chiều ngược nhau cùng lúc: phim hoạt hình phẳng màu ở 5 Mbps là lãng phí gấp ba, còn cảnh hành động nhiều hạt nhiễu ở cùng bitrate thì vẫn vỡ. Mã hoá thử nhiều mức, đo VMAF, lấy bitrate thấp nhất vẫn đạt ngưỡng ~93. Riêng bước này cắt 30–50% hoá đơn băng thông mà người xem không nhận ra khác biệt.',
      descriptionEn:
        'Three fixed levels are wrong in two opposite directions at once: flat animation at 5 Mbps wastes threefold, while a grainy action scene at the same bitrate still falls apart. Encode test clips at several rates, measure VMAF, take the lowest that clears ~93. This step alone cuts 30–50% off the bandwidth bill with no visible difference.',
    },
    {
      phase: 'BACKEND',
      title: 'Chuyển mã song song: cắt tại điểm khoá, chốt tham số một lần',
      titleEn: 'Parallel transcoding: cut on keyframes, fix parameters once',
      description:
        'Phim 2 giờ chuyển mã tuần tự ra 5 mức mất khoảng 8 tiếng. Cắt thành ~120 đoạn 60 giây rồi chạy 20 worker song song còn ~25 phút. Nhưng phải cắt ĐÚNG điểm khoá, nếu không đoạn sau thiếu khung tham chiếu và mối nối bị nháy hình. Và tham số mã hoá phải chốt một lần ở bước phân tích — mỗi worker tự chọn thì độ nét đổi giữa chừng.',
      descriptionEn:
        'Two hours transcoded serially into five levels takes about eight. Split into ~120 sixty-second chunks across 20 workers and it becomes ~25 minutes. But cuts must land ON keyframes, or the following chunk lacks reference frames and the seams flicker. And encode parameters must be fixed once during analysis — let each worker choose and sharpness shifts mid-film.',
      codeBlock:
        '# Hỏi FFmpeg vị trí điểm khoá TRƯỚC khi chia đoạn.\n'
        + 'ffprobe -v error -select_streams v:0 \\\n'
        + '  -show_entries packet=pts_time,flags \\\n'
        + '  -of csv=print_section=0 input.mp4 | grep ",K"\n'
        + '\n'
        + '# Ghép lại bằng ghép mức bit — KHÔNG mã hoá lại lần nữa.\n'
        + 'ffmpeg -f concat -safe 0 -i chunks.txt -c copy output.mp4',
      codeLang: 'bash',
    },
    {
      phase: 'BACKEND',
      title: 'Ký playlist, KHÔNG ký từng lát video',
      titleEn: 'Sign the playlist, NOT each segment',
      description:
        'Ký từng lát nghe an toàn hơn nhưng nó phá sạch bộ nhớ đệm: mỗi người xem một URL khác nhau nên CDN coi là file khác nhau, tỉ lệ trúng về gần 0 và CDN thành đường ống rỗng. Ký playlist — file nhỏ, cá nhân hoá được, hết hạn nhanh — còn lát video là nội dung dùng chung, đặt hạn lưu một năm vì nó không bao giờ đổi. Chi tiết này một mình nó quyết định hoá đơn.',
      descriptionEn:
        'Signing each segment sounds safer but destroys caching: every viewer gets a distinct URL, the CDN treats them as distinct files, hit ratio approaches zero and the CDN becomes an empty pipe. Sign the playlist — small, personalisable, short-lived — and let segments stay shared with a one-year lifetime, since their content never changes. This one detail sets the bill.',
    },
    {
      phase: 'FRONTEND',
      title: 'Đổi chất lượng theo bộ đệm, không theo ước lượng băng thông',
      titleEn: 'Switch on buffer level, not on bandwidth estimates',
      description:
        'Ước lượng băng thông từ chính việc tải của mình là một vòng phản hồi: tải file nặng làm ước lượng tụt, ước lượng tụt làm chọn file nhẹ, file nhẹ làm ước lượng tăng lại — chất lượng nhấp nháy vô tận. Bộ đệm đo hệ quả chứ không đo nguyên nhân. Cần khoảng chết giữa hai ngưỡng, nâng từng bậc nhưng cho phép hạ nhiều bậc, và tính bằng GIÂY chứ không bằng byte.',
      descriptionEn:
        'Estimating bandwidth from your own downloads is a feedback loop: heavy fetches depress the estimate, a low estimate selects light files, light files inflate it again — quality flickers forever. The buffer measures the consequence, not the cause. You need a dead zone between thresholds, single-step increases with multi-step drops, and thresholds in SECONDS rather than bytes.',
      codeBlock:
        'function chooseQuality(bufferSeconds: number, current: number): number {\n'
        + '  if (bufferSeconds < 5)  return Math.max(0, current - 1);   // tụt gấp, hạ ngay\n'
        + '  if (bufferSeconds < 10) return current;                    // chờ ổn định\n'
        + '  if (bufferSeconds > 25) return Math.min(MAX, current + 1); // nâng MỘT bậc\n'
        + '  return current;   // khoảng chết 10-25s chống nhấp nháy\n'
        + '}',
      codeLang: 'typescript',
    },
    {
      phase: 'FRONTEND',
      title: 'Bắt đầu ở chất lượng thấp — người xem bỏ đi sau 2 giây',
      titleEn: 'Start low — viewers leave after two seconds',
      description:
        'Ngưỡng khởi động là một đánh đổi: đợi nhiều giây thì bắt đầu chậm, đợi ít thì dễ giật ngay sau đó. Người xem chịu được vài giây hình xấu nhưng không chịu được vài giây màn hình đen — nên luôn bắt đầu ở mức thấp rồi nâng dần. Thời gian khởi động dưới 2 giây là ngưỡng mà mọi quyết định kỹ thuật trong dự án này cuối cùng đều quy về.',
      descriptionEn:
        'The startup threshold is a trade-off: wait longer and playback starts slowly, wait less and it stalls soon after. Viewers tolerate a few seconds of soft picture but not a few seconds of black screen — so always start low and climb. Two-second startup is the number every technical decision in this project eventually reduces to.',
    },
    {
      phase: 'BACKEND',
      title: 'Thu sự kiện phát — không có nó thì không biết mình tốt hay tệ',
      titleEn: 'Collect playback telemetry — without it you are blind',
      description:
        'Người xem bỏ đi thì im lặng bỏ đi, không ai gửi báo cáo lỗi. Ba chỉ số và chỉ ba: thời gian khởi động (dưới 2 giây ở phân vị 95), tỉ lệ giật (dưới 0,5%), và bitrate trung bình NGƯỜI XEM THẬT SỰ nhận được — không phải bitrate bạn có sẵn. Bảng này sinh dữ liệu nhanh hơn mọi bảng khác cộng lại nên phải gom theo lô và tách sang kho riêng.',
      descriptionEn:
        'Viewers who leave do so silently; nobody files a bug report. Three metrics and only three: startup time (under 2s at p95), rebuffer ratio (under 0.5%), and the average bitrate viewers ACTUALLY received — not what you had available. This table outgrows all the others combined, so batch it and move it to separate storage.',
    },
    {
      phase: 'BACKEND',
      title: 'Gợi ý theo ba bước tăng dần, mỗi bước đều dùng được ngay',
      titleEn: 'Recommendations in three steps, each useful on its own',
      description:
        'Bắt đầu bằng độ phổ biến theo nhóm — không cần học máy và là đường lui bắt buộc khi mọi thứ phía sau hỏng. Rồi lọc cộng tác theo mục ("người xem A cũng xem B") vốn chỉ là một truy vấn SQL có ngưỡng chống nhiễu. Cuối cùng là vector nội dung cho phim mới chưa ai xem. Nhớ hai điều: thiên lệch phổ biến là vòng lặp tự củng cố, và không thử song song thì không biết mới có tốt hơn cũ không.',
      descriptionEn:
        'Start with popularity within a segment — no model needed, and the mandatory fallback when everything downstream fails. Then item-based collaborative filtering ("people who watched A also watched B"), which is just a SQL query with a noise floor. Finally content vectors for titles nobody has watched yet. Remember two things: popularity bias is a self-reinforcing loop, and without a parallel test you cannot tell new from better.',
      codeBlock:
        'SELECT w2.title_id, COUNT(*) AS co_watch\n'
        + '  FROM watch_states w1\n'
        + '  JOIN watch_states w2 ON w1.profile_id = w2.profile_id\n'
        + ' WHERE w1.title_id = $1\n'
        + '   AND w2.title_id <> $1\n'
        + '   AND w1.completed AND w2.completed\n'
        + ' GROUP BY w2.title_id\n'
        + 'HAVING COUNT(*) >= 20          -- dưới ngưỡng này chỉ là trùng hợp\n'
        + ' ORDER BY co_watch DESC\n'
        + ' LIMIT 20;',
      codeLang: 'sql',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách bóp băng thông và đo tỉ lệ trúng đệm',
      titleEn: 'Verify by throttling bandwidth and measuring cache hit ratio',
      description:
        'Bóp xuống 1 Mbps giữa lúc đang xem: chất lượng phải hạ MỘT lần rồi ổn định, không nhấp nháy. Trả về bình thường: nâng dần từng bậc. Đo tỉ lệ trúng đệm CDN sau 24 giờ một phim ra mắt — dưới 90% nghĩa là có gì đó đang phá bộ nhớ đệm. Và chép URL một lát video mở ở máy khác thì PHẢI tải được, vì nó là nội dung dùng chung — playlist mới là thứ hết hạn.',
      descriptionEn:
        'Throttle to 1 Mbps mid-playback: quality must drop ONCE and settle, not flap. Restore it: quality climbs one level at a time. Measure CDN hit ratio 24 hours after a release — below 90% means something is defeating the cache. And copying a segment URL to another machine MUST still work, because it is shared content — the playlist is the part that expires.',
    },
  ],

  features: [
    { title: 'Chuyển mã song song theo đoạn', titleEn: 'Chunk-parallel transcoding', description: 'Cắt tại điểm khoá, 20 worker, ghép bằng ghép mức bit không mã hoá lại.', descriptionEn: 'Keyframe-aligned splits, 20 workers, stitched by stream copy with no re-encode.', status: 'PLANNED' },
    { title: 'Thang bitrate riêng theo từng phim', titleEn: 'Per-title bitrate ladder', description: 'Phân tích độ phức tạp, chọn bitrate thấp nhất vẫn đạt ngưỡng VMAF.', descriptionEn: 'Complexity analysis picking the lowest bitrate that still clears the VMAF target.', status: 'PLANNED' },
    { title: 'Phát thích ứng không nhấp nháy', titleEn: 'Adaptive playback without flapping', description: 'Quyết định theo mức bộ đệm, có khoảng chết, nâng từng bậc.', descriptionEn: 'Buffer-driven decisions with a dead zone and single-step increases.', status: 'PLANNED' },
    { title: 'Nhiều hồ sơ, có hồ sơ trẻ em', titleEn: 'Multiple profiles including kids', description: 'Mức phân loại lọc ngay trong truy vấn danh mục, không lọc ở giao diện.', descriptionEn: 'Maturity rating filtered inside the catalogue query, not in the UI.', status: 'PLANNED' },
    { title: 'Xem tiếp đúng chỗ mọi thiết bị', titleEn: 'Cross-device resume', description: 'Vị trí lưu ở server theo từng hồ sơ, đồng bộ trong vài giây.', descriptionEn: 'Position stored server-side per profile, synced within seconds.', status: 'PLANNED' },
    { title: 'Phụ đề nhiều ngôn ngữ, nhiều bản âm thanh', titleEn: 'Multi-language subtitles and audio tracks', description: 'WebVTT tách khỏi luồng video, chọn được mà không tải lại.', descriptionEn: 'WebVTT separate from the video stream, switchable without a reload.', status: 'PLANNED' },
    { title: 'Gợi ý ba tầng có đường lui', titleEn: 'Three-tier recommendations with a fallback', description: 'Phổ biến → lọc cộng tác → vector nội dung cho phim mới.', descriptionEn: 'Popularity → collaborative filtering → content vectors for new titles.', status: 'PLANNED' },
    { title: 'Bảng đo chất lượng phát thật', titleEn: 'A real playback quality dashboard', description: 'Thời gian khởi động, tỉ lệ giật, bitrate thật người xem nhận được.', descriptionEn: 'Startup time, rebuffer ratio and the bitrate viewers actually received.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Netflix Tech Blog — Per-Title Encode Optimization', titleEn: 'Netflix Tech Blog — Per-Title Encode Optimization', url: 'https://netflixtechblog.com/per-title-encode-optimization-7e99442b62a2', type: 'LINK', description: 'Bài gốc giới thiệu ý tưởng thang bitrate riêng theo nội dung — nền của cả chương đầu bài này.', descriptionEn: 'The original write-up of per-title ladders — the basis of this study\'s opening chapter.' },
    { title: 'VMAF — Video Multi-Method Assessment Fusion', titleEn: 'VMAF — Video Multi-Method Assessment Fusion', url: 'https://github.com/Netflix/vmaf', type: 'REPO', description: 'Công cụ đo chất lượng cảm nhận thành điểm số, thay cho việc tự nhìn bằng mắt.', descriptionEn: 'The tool that turns perceived quality into a score instead of an eyeball judgement.' },
    { title: 'A Buffer-Based Approach to Rate Adaptation (Stanford/Netflix)', titleEn: 'A Buffer-Based Approach to Rate Adaptation (Stanford/Netflix)', url: 'https://web.stanford.edu/class/cs244/papers/sigcomm2014-video.pdf', type: 'PDF', description: 'Bài báo cho thấy vì sao quyết định theo bộ đệm ổn định hơn theo ước lượng băng thông.', descriptionEn: 'The paper showing why buffer-based decisions are more stable than throughput estimates.' },
    { title: 'RFC 8216 — HTTP Live Streaming', titleEn: 'RFC 8216 — HTTP Live Streaming', url: 'https://datatracker.ietf.org/doc/html/rfc8216', type: 'LINK', description: 'Định dạng playlist và cách khai báo nhiều mức chất lượng trong một luồng.', descriptionEn: 'The playlist format and how multiple quality levels are declared in one stream.' },
    { title: 'FFmpeg — Concatenate demuxer', titleEn: 'FFmpeg — Concatenate demuxer', url: 'https://trac.ffmpeg.org/wiki/Concatenate', type: 'LINK', description: 'Ghép các đoạn đã chuyển mã bằng ghép mức bit, không mã hoá lại lần hai.', descriptionEn: 'Stitching transcoded chunks by stream copy rather than re-encoding twice.' },
  ],

  coreKnowledge: [
    { vi: 'Mã hoá video: bitrate, điểm khoá, và vì sao độ phức tạp nội dung quyết định chi phí', en: 'Video encoding: bitrate, keyframes, and why content complexity drives cost' },
    { vi: 'Đo chất lượng cảm nhận bằng số thay vì bằng mắt', en: 'Measuring perceived quality numerically instead of by eye' },
    { vi: 'Phát thích ứng: tín hiệu nào đáng tin, và vì sao vòng phản hồi gây dao động', en: 'Adaptive streaming: which signal to trust, and why feedback loops oscillate' },
    { vi: 'Bộ nhớ đệm CDN: điều gì phá tỉ lệ trúng và vì sao nó là khoản chi lớn nhất', en: 'CDN caching: what destroys hit ratio, and why it is the largest cost line' },
    { vi: 'Xử lý song song có ràng buộc: chia việc ở đúng ranh giới an toàn', en: 'Constrained parallelism: splitting work at the boundaries that are safe to split' },
    { vi: 'Chỉ số chất lượng trải nghiệm: đo cái người dùng cảm nhận, không đo cái mình cung cấp', en: 'Quality-of-experience metrics: measuring what users feel, not what you serve' },
    { vi: 'Hệ gợi ý: lọc cộng tác, khởi đầu lạnh, và thiên lệch về nội dung phổ biến', en: 'Recommenders: collaborative filtering, cold start, and popularity bias' },
    { vi: 'Thu thập dữ liệu sự kiện khối lượng lớn mà không giết database chính', en: 'High-volume event collection without killing the primary database' },
  ],

  portfolioBonus: [
    { vi: 'Bảng so bitrate và điểm VMAF của ba loại nội dung khác nhau trên cùng thang', en: 'A table of bitrate versus VMAF for three content types on the same ladder' },
    { vi: 'Video quay lại việc bóp băng thông và trình phát hạ chất lượng đúng một lần', en: 'A recording of throttling bandwidth with the player dropping exactly once' },
    { vi: 'Biểu đồ tỉ lệ trúng đệm CDN trước và sau khi chuyển từ ký lát sang ký playlist', en: 'A CDN hit-ratio chart before and after moving from segment signing to playlist signing' },
    { vi: 'Số đo thời gian chuyển mã theo số worker, chỉ ra điểm bão hoà', en: 'Transcode time against worker count, showing where it saturates' },
    { vi: 'Bảng đo chất lượng phát chạy thật với dữ liệu của chính người dùng', en: 'A live playback quality dashboard fed by real user data' },
  ],

  completionOutcomes: [
    { vi: 'Hiểu video như một bài toán kỹ thuật lẫn kinh tế, không chỉ là một thẻ HTML', en: 'Understand video as an engineering and economic problem, not just an HTML tag' },
    { vi: 'Thiết kế được hệ thống mà chi phí vận hành là ràng buộc thiết kế', en: 'Design systems where operating cost is a first-class design constraint' },
    { vi: 'Nhận ra vòng phản hồi trong thuật toán điều khiển và biết cách chặn dao động', en: 'Recognise feedback loops in control algorithms and know how to damp oscillation' },
    { vi: 'Chia việc nặng ra chạy song song mà vẫn giữ được tính đúng đắn ở mối nối', en: 'Parallelise heavy work while keeping correctness at the seams' },
    { vi: 'Đo trải nghiệm người dùng bằng số thật, không bằng cảm nhận của người làm', en: 'Measure user experience with real numbers rather than the builder\'s impression' },
  ],

  bodyMdx,
  bodyMdxEn,
};
