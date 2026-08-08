/**
 * Case-study 2.3 — Learning Management System.
 *
 * Three requirements that look small and rewrite the architecture: video that
 * cannot be pirated, progress that cannot be faked, and certificates that a
 * third party can verify. The interval-based progress model (int4range +
 * range_agg) is the piece most LMS clones get wrong.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./learning-management-system.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./learning-management-system.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'learning-management-system',
  title: 'Learning Management System (LMS)',
  titleEn: 'Learning Management System (LMS)',
  description:
    'Nền tảng học trực tuyến có thu phí. Ba yêu cầu tưởng nhỏ đổi hoàn toàn kiến trúc: video không được tải lậu (bốn mức bảo vệ), tiến độ không thể gian lận (lưu khoảng đã xem chứ không phải phần trăm client khai), và chứng chỉ mà nhà tuyển dụng xác minh được.',
  descriptionEn:
    'A paid online-course platform. Three small-sounding requirements rewrite the architecture: video that resists piracy (four protection levels), progress that cannot be faked (watched intervals rather than a client-declared percentage), and certificates an employer can verify.',
  techStack: [
    'Next.js 15', 'Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis',
    'FFmpeg', 'HLS', 'Cloudflare R2', 'Stripe', 'hls.js',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '3–4 tuần',
  durationEn: '3–4 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/learning-management-system.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Tiến độ học lưu bằng KHOẢNG ĐÃ XEM, không phải một con số
-- phần trăm do client khai. Client gửi progress=100 là bất kỳ ai
-- cũng lấy được chứng chỉ bằng một lệnh fetch.

CREATE TABLE watch_intervals (
    id        BIGSERIAL PRIMARY KEY,
    user_id   TEXT      NOT NULL,
    lesson_id TEXT      NOT NULL,
    -- int4range: Postgres có sẵn kiểu khoảng và toán tử gộp, nên
    -- "đã xem thật bao nhiêu giây" là MỘT truy vấn chứ không phải
    -- một vòng lặp trong ứng dụng. Tua đi tua lại thì các khoảng
    -- chồng nhau tự gộp, không cộng dồn sai.
    range     int4range NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GiST là loại chỉ mục cho kiểu khoảng (B-tree không dùng được).
CREATE INDEX watch_intervals_lookup_idx
    ON watch_intervals USING GIST (range);
CREATE INDEX watch_intervals_user_lesson_idx
    ON watch_intervals (user_id, lesson_id);

-- Tổng thời lượng đã xem, ĐÃ TRỪ phần xem lại:
--   SELECT SUM(upper(r) - lower(r)) FROM (
--     SELECT unnest(range_agg(range)) AS r FROM watch_intervals
--      WHERE user_id = $1 AND lesson_id = $2) merged;
-- Bài 600 giây coi là xong khi tổng đạt ~540 (90%).

CREATE TABLE enrollments (
    id           TEXT        PRIMARY KEY,
    user_id      TEXT        NOT NULL,
    course_id    TEXT        NOT NULL,
    -- Kiểm CẢ status khi cấp quyền xem video: người đã hoàn tiền
    -- vẫn còn dòng ghi danh nhưng KHÔNG còn quyền.
    status       VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    UNIQUE (user_id, course_id)
);

CREATE TABLE quiz_attempts (
    id           TEXT        PRIMARY KEY,
    quiz_id      TEXT        NOT NULL,
    user_id      TEXT        NOT NULL,
    answers      JSONB       NOT NULL DEFAULT '{}',
    score        REAL,
    -- Mốc giờ nằm ở SERVER. Đếm giờ ở client thì tải lại trang là
    -- đếm lại từ đầu, và chỉnh đồng hồ máy là có thêm thời gian.
    started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ
);

CREATE TABLE certificates (
    id            TEXT        PRIMARY KEY,
    enrollment_id TEXT        NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    public_code   VARCHAR(16) NOT NULL UNIQUE,
    -- HMAC nội dung: sửa tên trên ảnh chứng chỉ thì mã băm không
    -- khớp, và trang xác minh nói rõ "đã bị chỉnh sửa".
    content_hash  VARCHAR(64) NOT NULL,
    issued_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
  schemaCodeEn: `-- Progress is stored as WATCHED INTERVALS, not a percentage the client
-- declares. If the client posts progress=100, anyone can collect a
-- certificate with a single fetch call.

CREATE TABLE watch_intervals (
    id        BIGSERIAL PRIMARY KEY,
    user_id   TEXT      NOT NULL,
    lesson_id TEXT      NOT NULL,
    -- int4range: Postgres ships a range type and merge operators, so
    -- "how many seconds were really watched" is ONE query rather than a
    -- loop in application code. Rewatching merges overlapping ranges
    -- instead of double-counting.
    range     int4range NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GiST is the index type for range columns (B-tree cannot do it).
CREATE INDEX watch_intervals_lookup_idx
    ON watch_intervals USING GIST (range);
CREATE INDEX watch_intervals_user_lesson_idx
    ON watch_intervals (user_id, lesson_id);

-- Total watched time with rewatches counted once:
--   SELECT SUM(upper(r) - lower(r)) FROM (
--     SELECT unnest(range_agg(range)) AS r FROM watch_intervals
--      WHERE user_id = $1 AND lesson_id = $2) merged;
-- A 600-second lesson counts as complete at ~540 (90%).

CREATE TABLE enrollments (
    id           TEXT        PRIMARY KEY,
    user_id      TEXT        NOT NULL,
    course_id    TEXT        NOT NULL,
    -- Check the status too when granting video access: a refunded user
    -- still has an enrolment row but NO longer has access.
    status       VARCHAR(16) NOT NULL DEFAULT 'ACTIVE',
    enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    UNIQUE (user_id, course_id)
);

CREATE TABLE quiz_attempts (
    id           TEXT        PRIMARY KEY,
    quiz_id      TEXT        NOT NULL,
    user_id      TEXT        NOT NULL,
    answers      JSONB       NOT NULL DEFAULT '{}',
    score        REAL,
    -- The timestamp lives on the SERVER. A client-side timer restarts on
    -- page reload, and changing the system clock buys extra time.
    started_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ
);

CREATE TABLE certificates (
    id            TEXT        PRIMARY KEY,
    enrollment_id TEXT        NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    public_code   VARCHAR(16) NOT NULL UNIQUE,
    -- HMAC of the content: edit the name on the certificate image and the
    -- hash stops matching, so the verify page reports it as altered.
    content_hash  VARCHAR(64) NOT NULL,
    issued_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Bảo vệ video: bốn mức, và chọn mức nào là quyết định kinh doanh',
      titleEn: 'Video protection: four levels, and the choice is a business one',
      description:
        'URL ký có hạn chặn chia sẻ link nhưng không chặn tải về. HLS cắt lát chặn tải một file nhưng không chặn script ghép. AES-128 chặn người dùng phổ thông. DRM chặn gần hết nhưng tốn kém. Với khoá học vài trăm nghìn, mức 2 là đủ — nó chặn nguồn thất thoát lớn nhất là chia sẻ link vô tình.',
      descriptionEn:
        'Signed expiring URLs stop link sharing but not downloading. HLS segmentation stops single-file grabs but not reassembly scripts. AES-128 stops ordinary users. DRM stops nearly everyone but costs a lot. For a modestly priced course, level 2 is enough — it blocks the biggest leak, which is casual link sharing.',
    },
    {
      phase: 'BACKEND',
      title: 'Playlist ký theo người dùng, kiểm cả trạng thái ghi danh',
      titleEn: 'Per-user signed playlists, with enrolment status checked',
      description:
        'Chữ ký nhúng userId nên khi một link bị rò rỉ, log truy cập cho biết TÀI KHOẢN NÀO đã chia sẻ — xử lý được nguồn thay vì chỉ vá lỗ. Và phải kiểm status: ACTIVE, không chỉ "có ghi danh không", nếu không người đã hoàn tiền vẫn xem được.',
      descriptionEn:
        'The signature embeds userId, so when a link leaks the access log names the ACCOUNT that shared it — you address the source rather than patching the hole. And check status: ACTIVE, not merely "is enrolled", or refunded users keep watching.',
      codeBlock:
        '// Kiểm CẢ trạng thái: người đã hoàn tiền vẫn còn dòng ghi danh.\n'
        + 'const enrolled = await prisma.enrollment.findFirst({\n'
        + '  where: {\n'
        + '    userId: req.user.id,\n'
        + '    courseId: lesson.chapter.courseId,\n'
        + "    status: 'ACTIVE',\n"
        + '  },\n'
        + '  select: { id: true },\n'
        + '});\n'
        + "if (!enrolled) throw new AppError('Bạn chưa ghi danh khoá học này', 403);",
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Tiến độ: lưu khoảng đã xem, không lưu phần trăm',
      titleEn: 'Progress: store watched intervals, not a percentage',
      description:
        'Client gửi progress=100 thì bất kỳ ai cũng lấy được chứng chỉ bằng một lệnh fetch. Ghi từng khoảng với giới hạn 30 giây mỗi nhịp, rồi dùng range_agg của Postgres để gộp — người tua nhanh không đạt, người xem thật đạt kể cả khi tua lại vài đoạn.',
      descriptionEn:
        'If the client posts progress=100, anyone collects a certificate with one fetch. Record each interval with a 30-second cap per heartbeat, then merge with Postgres range_agg — scrubbers do not qualify, genuine viewers do even after replaying parts.',
      codeBlock:
        '-- Tổng thời lượng ĐÃ XEM, đã trừ phần xem lại.\n'
        + 'SELECT SUM(upper(r) - lower(r))\n'
        + 'FROM (\n'
        + '  SELECT unnest(range_agg(range)) AS r\n'
        + '  FROM watch_intervals\n'
        + '  WHERE user_id = $1 AND lesson_id = $2\n'
        + ') merged;',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Bài kiểm tra: mốc giờ ở server, đáp án không xuống client',
      titleEn: 'Quizzes: server-side timing, answers never leave the server',
      description:
        'Đếm giờ ở client thì tải lại trang là đếm lại từ đầu. Ghi startedAt lúc bắt đầu, kiểm lúc nộp, cộng 10 giây khoan dung cho độ trễ mạng để người bấm nộp giây cuối không bị trượt oan. Và rất nhiều LMS tự viết gửi cả đáp án rồi ẩn bằng CSS — mở tab Network là thấy hết.',
      descriptionEn:
        'A client timer restarts on page reload. Record startedAt at the beginning, check at submission, and add a 10-second grace margin so a last-second submit is not failed by network latency. And plenty of hand-rolled systems ship the answers and hide them with CSS — the Network tab reveals everything.',
    },
    {
      phase: 'BACKEND',
      title: 'Chứng chỉ xác minh được bằng HMAC nội dung',
      titleEn: 'Certificates verified by a content HMAC',
      description:
        'Ảnh PNG có tên người học không chứng minh gì — ai cũng sửa được bằng trình chỉnh ảnh. Băm nội dung bằng khoá bí mật của hệ thống, kèm mã tra cứu công khai. Nhà tuyển dụng nhập mã, thấy đúng dữ liệu đã ký; sửa một ký tự là trang xác minh báo không hợp lệ.',
      descriptionEn:
        'A PNG with a name proves nothing — anyone can edit it. HMAC the content with a system secret and issue a public lookup code. An employer enters the code and sees the signed data; change one character and the verify page reports it invalid.',
    },
    {
      phase: 'FRONTEND',
      title: 'Trình phát tiếp đúng chỗ, hoạt động xuyên thiết bị',
      titleEn: 'A player that resumes correctly across devices',
      description:
        'Tiến độ nằm ở server chứ không ở localStorage, nên xem dở trên máy tính rồi mở điện thoại là tiếp đúng chỗ. Nhịp gửi mỗi 15 giây (không phải mỗi giây — tốn băng thông vô ích), và gửi thêm một nhịp cuối khi người dùng đóng tab.',
      descriptionEn:
        'Progress lives on the server rather than in localStorage, so stopping on a laptop and resuming on a phone lands in the right place. Heartbeats every 15 seconds (not every second — pointless bandwidth), plus a final beat when the tab closes.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách tự tấn công hệ thống của mình',
      titleEn: 'Verify by attacking your own system',
      description:
        'Chép link video rồi mở ở cửa sổ ẩn danh sau 6 phút — phải hỏng. Gọi thẳng API tiến độ với 3600 giây — phải bị từ chối. Tua nhanh hết video — tiến độ KHÔNG được đạt mức hoàn thành. Hoàn tiền một ghi danh — video phải tắt ngay lập tức.',
      descriptionEn:
        'Copy a video URL and open it incognito six minutes later — it must fail. Call the progress API with 3600 seconds — it must be rejected. Scrub to the end — progress must NOT reach completion. Refund an enrolment — video access must stop immediately.',
    },
  ],

  features: [
    { title: 'Khoá học nhiều chương, nhiều loại bài', titleEn: 'Courses with chapters and mixed lesson types', description: 'Video, văn bản và bài kiểm tra trong cùng một dòng chảy học.', descriptionEn: 'Video, text and quizzes in one learning flow.', status: 'PLANNED' },
    { title: 'Phát video HLS có bảo vệ', titleEn: 'Protected HLS playback', description: 'Playlist ký ngắn hạn, nhúng userId để truy được nguồn rò rỉ.', descriptionEn: 'Short-lived signed playlists embedding userId to trace leaks.', status: 'PLANNED' },
    { title: 'Tiến độ chống gian lận', titleEn: 'Tamper-resistant progress', description: 'Ghi khoảng đã xem, gộp bằng range_agg, giới hạn 30 giây mỗi nhịp.', descriptionEn: 'Watched intervals merged with range_agg, capped at 30 seconds per heartbeat.', status: 'PLANNED' },
    { title: 'Tiếp tục đúng chỗ trên mọi thiết bị', titleEn: 'Cross-device resume', description: 'Tiến độ ở server, không phải localStorage.', descriptionEn: 'Progress lives on the server, not in localStorage.', status: 'PLANNED' },
    { title: 'Bài kiểm tra tự chấm có giới hạn giờ', titleEn: 'Auto-graded timed quizzes', description: 'Mốc giờ ở server, đáp án chỉ trả về sau khi nộp.', descriptionEn: 'Server-side timing; answers returned only after submission.', status: 'PLANNED' },
    { title: 'Chứng chỉ xác minh công khai', titleEn: 'Publicly verifiable certificates', description: 'HMAC nội dung + trang /verify/:code cho nhà tuyển dụng.', descriptionEn: 'A content HMAC plus a /verify/:code page for employers.', status: 'PLANNED' },
    { title: 'Ghi danh có phí, hoàn tiền 7 ngày', titleEn: 'Paid enrolment with 7-day refunds', description: 'Hoàn tiền chuyển status sang REFUNDED và cắt quyền xem ngay.', descriptionEn: 'A refund flips status to REFUNDED and revokes access immediately.', status: 'PLANNED' },
    { title: 'Hỏi đáp theo từng bài học', titleEn: 'Per-lesson Q&A', description: 'Câu hỏi neo vào mốc thời gian trong video.', descriptionEn: 'Questions anchored to a timestamp in the video.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'PostgreSQL — Range Types', titleEn: 'PostgreSQL — Range Types', url: 'https://www.postgresql.org/docs/current/rangetypes.html', type: 'LINK', description: 'int4range, range_agg và chỉ mục GiST — nền của cách tính tiến độ ở đây.', descriptionEn: 'int4range, range_agg and GiST indexes — the basis of the progress model here.' },
    { title: 'RFC 8216 — HTTP Live Streaming', titleEn: 'RFC 8216 — HTTP Live Streaming', url: 'https://datatracker.ietf.org/doc/html/rfc8216', type: 'LINK', description: 'Định dạng .m3u8 và cách khai báo khoá mã hoá cho từng lát.', descriptionEn: 'The .m3u8 format and how per-segment encryption keys are declared.' },
    { title: 'hls.js', titleEn: 'hls.js', url: 'https://github.com/video-dev/hls.js', type: 'REPO', description: 'Trình phát HLS cho trình duyệt không hỗ trợ sẵn (tức là mọi trình duyệt trừ Safari).', descriptionEn: 'An HLS player for browsers without native support (that is, everything except Safari).' },
    { title: 'FFmpeg — segment muxer', titleEn: 'FFmpeg — segment muxer', url: 'https://ffmpeg.org/ffmpeg-formats.html#segment_002c-stream_005fsegment_002c-ssegment', type: 'LINK', description: 'Lệnh cắt video thành lát và sinh playlist.', descriptionEn: 'The commands that split video into segments and generate the playlist.' },
  ],

  coreKnowledge: [
    { vi: 'Kiểu khoảng của Postgres và toán tử gộp — công cụ đúng cho bài toán tiến độ', en: 'Postgres range types and merge operators — the right tool for progress tracking' },
    { vi: 'HLS: playlist, lát video, và các mức bảo vệ nội dung', en: 'HLS: playlists, segments, and content-protection levels' },
    { vi: 'URL ký có hạn: cơ chế, và vì sao nên nhúng danh tính người dùng', en: 'Signed expiring URLs: how they work, and why to embed the viewer identity' },
    { vi: 'Nguyên tắc "không tin dữ liệu client" áp dụng cho tiến độ và thời gian', en: 'The "never trust the client" rule applied to progress and timing' },
    { vi: 'HMAC và tính toàn vẹn dữ liệu: chứng minh nội dung chưa bị sửa', en: 'HMAC and data integrity: proving content has not been altered' },
    { vi: 'Kiểm quyền theo trạng thái, không chỉ theo sự tồn tại của bản ghi', en: 'Authorising on state, not merely on the existence of a row' },
    { vi: 'Chỉ mục GiST: khi nào B-tree không dùng được', en: 'GiST indexes: when B-tree cannot do the job' },
    { vi: 'Xử lý video bằng FFmpeg: cắt lát, nhiều độ phân giải, thumbnail', en: 'Video processing with FFmpeg: segmenting, renditions, thumbnails' },
  ],

  portfolioBonus: [
    { vi: 'Trang xác minh chứng chỉ chạy thật, người xem tự nhập mã kiểm tra được', en: 'A working certificate verification page anyone can test with a code' },
    { vi: 'Chứng minh chống gian lận: video quay lại việc tua nhanh KHÔNG được tính hoàn thành', en: 'Anti-cheat proof: a recording showing that scrubbing does NOT complete a lesson' },
    { vi: 'Biểu đồ tỉ lệ hoàn thành theo từng bài, chỉ ra chỗ học viên bỏ cuộc', en: 'A per-lesson completion chart showing where learners drop off' },
    { vi: 'So sánh chi phí băng thông trước và sau khi chuyển sang HLS', en: 'A bandwidth cost comparison before and after moving to HLS' },
    { vi: 'Mục "Mô hình đe doạ" trong README: liệt kê cách tấn công và cách chặn', en: 'A "Threat model" section in the README listing each attack and its defence' },
  ],

  completionOutcomes: [
    { vi: 'Bảo vệ nội dung số ở mức phù hợp với giá trị của nó, không thừa không thiếu', en: 'Protect digital content at a level proportional to its value' },
    { vi: 'Thiết kế cơ chế đo lường mà người dùng không giả mạo được', en: 'Design measurement that users cannot fake' },
    { vi: 'Dùng đúng kiểu dữ liệu của Postgres thay vì mô phỏng lại trong ứng dụng', en: 'Use the right Postgres data type instead of reimplementing it in application code' },
    { vi: 'Xử lý và phân phối video ở quy mô sản phẩm thật', en: 'Process and deliver video at genuine product scale' },
    { vi: 'Phát hành tài liệu có tính pháp lý (chứng chỉ) mà bên thứ ba tin được', en: 'Issue documents with real-world weight that third parties can trust' },
  ],

  bodyMdx,
  bodyMdxEn,
};
