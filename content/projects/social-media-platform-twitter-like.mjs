/**
 * Case-study 2.4 — Social Media Platform (Twitter-like).
 *
 * The first project in the roadmap where ONE write can touch a million rows.
 * Everything here follows from that: fan-out on write vs on read, the celebrity
 * threshold that forces a hybrid, and why the cursor needs a tiebreaker.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./social-media-platform-twitter-like.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./social-media-platform-twitter-like.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'social-media-platform-twitter-like',
  title: 'Social Media Platform (Twitter-like)',
  titleEn: 'Social Media Platform (Twitter-like)',
  description:
    'Mạng xã hội với dòng thời gian, theo dõi, hashtag và chủ đề thịnh hành. Dự án đầu tiên trong lộ trình mà MỘT thao tác ghi có thể chạm tới một triệu dòng — nên toàn bộ kiến trúc xoay quanh câu hỏi: khi bạn đăng bài, người viết trả giá hay người đọc trả giá?',
  descriptionEn:
    'A social network with timelines, follows, hashtags and trending topics. The first project in the roadmap where ONE write can touch a million rows — so the whole architecture turns on a single question: when you post, does the writer pay or does the reader pay?',
  techStack: [
    'Next.js 15', 'Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Redis',
    'BullMQ', 'Socket.IO', 'MeiliSearch', 'Cloudflare R2', 'TanStack Query',
  ],
  role: 'Full-stack (một người)',
  roleEn: 'Full-stack (solo)',
  duration: '4–5 tuần',
  durationEn: '4–5 weeks',
  status: 'PLANNING',
  category: 'Web',
  difficulty: 'INTERMEDIATE',
  thumbnailUrl: 'https://media.cuongthai.com/images/projects/social-media-platform-twitter-like.webp',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- Bộ đếm là CỘT LƯU SẴN, không phải COUNT(*). Trang cá nhân nào
-- cũng hiện số người theo dõi; đếm thật mỗi lần mở trang là quét hàng
-- triệu dòng cho một con số không ai kiểm chứng tới từng đơn vị.

CREATE TABLE users (
    id              TEXT        PRIMARY KEY,
    username        CITEXT      NOT NULL UNIQUE,
    display_name    TEXT        NOT NULL,
    verified        BOOLEAN     NOT NULL DEFAULT false,
    follower_count  INTEGER     NOT NULL DEFAULT 0,
    following_count INTEGER     NOT NULL DEFAULT 0,
    -- Cờ quyết định CHIẾN LƯỢC ĐẨY. Trên ngưỡng thì KHÔNG đẩy bài vào
    -- hộp thư người theo dõi nữa — người đọc tự truy vấn và trộn.
    is_celebrity    BOOLEAN     NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
    id            TEXT        PRIMARY KEY,
    author_id     TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content       TEXT        NOT NULL,
    parent_id     TEXT        REFERENCES posts(id) ON DELETE CASCADE,
    repost_of_id  TEXT        REFERENCES posts(id) ON DELETE SET NULL,
    like_count    INTEGER     NOT NULL DEFAULT 0,
    reply_count   INTEGER     NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chỉ mục KÉP theo đúng thứ tự con trỏ phân trang. Thiếu cột id ở đây
-- thì các bài trùng mốc thời gian sẽ bị lặp hoặc bị bỏ sót khi cuộn.
CREATE INDEX posts_timeline_idx ON posts (created_at DESC, id DESC);
CREATE INDEX posts_author_idx   ON posts (author_id, created_at DESC);

CREATE TABLE follows (
    follower_id  TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_id, following_id)
);
-- Đẩy bài cần "ai đang theo dõi tôi" — chiều ngược với khoá chính.
CREATE INDEX follows_reverse_idx ON follows (following_id, follower_id);

CREATE TABLE likes (
    user_id    TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id    TEXT        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Khoá chính kép để DATABASE từ chối lượt thích thứ hai, thay vì
    -- tầng ứng dụng đọc-rồi-mới-ghi (và thua khi có hai request cùng lúc).
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE notifications (
    id           BIGSERIAL   PRIMARY KEY,
    user_id      TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         VARCHAR(16) NOT NULL,
    -- group_key gom mọi lượt thích của CÙNG một bài vào MỘT dòng.
    -- Không có nó, bài 200 lượt thích sinh 200 dòng và bảng tin vô dụng.
    group_key    TEXT        NOT NULL,
    post_id      TEXT        REFERENCES posts(id) ON DELETE CASCADE,
    actor_count  INTEGER     NOT NULL DEFAULT 1,
    last_actor_id TEXT       REFERENCES users(id) ON DELETE SET NULL,
    read         BOOLEAN     NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, group_key)
);
CREATE INDEX notifications_inbox_idx
    ON notifications (user_id, read, created_at DESC);`,

  schemaCodeEn: `-- Counters are STORED COLUMNS, not COUNT(*). Every profile page shows a
-- follower count; counting it for real on each view scans millions of rows
-- for a number nobody verifies to the unit.

CREATE TABLE users (
    id              TEXT        PRIMARY KEY,
    username        CITEXT      NOT NULL UNIQUE,
    display_name    TEXT        NOT NULL,
    verified        BOOLEAN     NOT NULL DEFAULT false,
    follower_count  INTEGER     NOT NULL DEFAULT 0,
    following_count INTEGER     NOT NULL DEFAULT 0,
    -- This flag selects the FAN-OUT STRATEGY. Above the threshold we stop
    -- pushing posts into follower inboxes — readers query and merge instead.
    is_celebrity    BOOLEAN     NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE posts (
    id            TEXT        PRIMARY KEY,
    author_id     TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content       TEXT        NOT NULL,
    parent_id     TEXT        REFERENCES posts(id) ON DELETE CASCADE,
    repost_of_id  TEXT        REFERENCES posts(id) ON DELETE SET NULL,
    like_count    INTEGER     NOT NULL DEFAULT 0,
    reply_count   INTEGER     NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- A COMPOSITE index matching the pagination cursor exactly. Without the id
-- column, posts sharing a timestamp duplicate or vanish while scrolling.
CREATE INDEX posts_timeline_idx ON posts (created_at DESC, id DESC);
CREATE INDEX posts_author_idx   ON posts (author_id, created_at DESC);

CREATE TABLE follows (
    follower_id  TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (follower_id, following_id)
);
-- Fan-out asks "who follows me" — the opposite direction to the primary key.
CREATE INDEX follows_reverse_idx ON follows (following_id, follower_id);

CREATE TABLE likes (
    user_id    TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id    TEXT        NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- A composite primary key so the DATABASE rejects the second like, rather
    -- than application code reading-then-writing (and losing a concurrent race).
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE notifications (
    id           BIGSERIAL   PRIMARY KEY,
    user_id      TEXT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type         VARCHAR(16) NOT NULL,
    -- group_key folds every like on the SAME post into ONE row. Without it a
    -- 200-like post writes 200 rows and the notification feed is useless.
    group_key    TEXT        NOT NULL,
    post_id      TEXT        REFERENCES posts(id) ON DELETE CASCADE,
    actor_count  INTEGER     NOT NULL DEFAULT 1,
    last_actor_id TEXT       REFERENCES users(id) ON DELETE SET NULL,
    read         BOOLEAN     NOT NULL DEFAULT false,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, group_key)
);
CREATE INDEX notifications_inbox_idx
    ON notifications (user_id, read, created_at DESC);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Chọn phía trả giá: đọc hay ghi, và vì sao câu trả lời là "cả hai"',
      titleEn: 'Choosing which side pays: read or write, and why the answer is "both"',
      description:
        'Tỉ lệ đọc/ghi khoảng 100:1 nên phía đáng tối ưu là đọc — tức đẩy bài vào hộp thư sẵn có lúc ghi. Nhưng chiến lược đó chết ở tài khoản mười triệu người theo dõi. Đặt một ngưỡng, dưới ngưỡng thì đẩy, trên ngưỡng thì để người đọc tự truy vấn rồi trộn. Phép lai chạy được vì một người theo dõi hàng nghìn tài khoản nhưng chỉ vài chục cái vượt ngưỡng.',
      descriptionEn:
        'At roughly 100:1 reads to writes, reads are the side worth optimising — which means pushing posts into prebuilt inboxes at write time. That strategy then dies on a ten-million-follower account. Set a threshold: push below it, let readers query and merge above it. The hybrid works because a person follows thousands of accounts but only a few dozen sit above the line.',
    },
    {
      phase: 'BACKEND',
      title: 'Đẩy hộp thư ở worker nền, chia lô theo con trỏ',
      titleEn: 'Fan-out in a background worker, batched by cursor',
      description:
        'Kể cả 9.000 lệnh đẩy cũng không thuộc về vòng đời một HTTP request. Ghi bài xong trả lời ngay, đẩy giao cho hàng đợi. Trong worker chia lô 5.000 và phân trang bằng con trỏ id — dùng skip là bắt Postgres đếm qua nửa triệu dòng rồi vứt đi.',
      descriptionEn:
        'Even 9,000 pushes do not belong in an HTTP request lifecycle. Write the post, respond, hand fan-out to a queue. In the worker, batch at 5,000 and paginate by id cursor — skip makes Postgres count through half a million rows and throw them away.',
      codeBlock:
        '// Đẩy id bài, KHÔNG đẩy nội dung: đẩy nội dung nghĩa là một bài\n'
        + '// bị nhân bản một triệu lần, và sửa bài xong thì cả triệu bản cũ.\n'
        + 'const pipeline = redis.pipeline();\n'
        + 'for (const f of batch) {\n'
        + '  pipeline.lpush(`timeline:${f.followerId}`, postId);\n'
        + '  pipeline.ltrim(`timeline:${f.followerId}`, 0, 799);\n'
        + '}\n'
        + 'await pipeline.exec();\n'
        + '\n'
        + 'cursor = batch[batch.length - 1].id;   // KHÔNG dùng skip',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Bộ đếm thích: để ràng buộc unique quyết định',
      titleEn: 'Like counters: let the unique constraint decide',
      description:
        'Đọc-rồi-mới-ghi thua khi có hai request cùng lúc — cả hai đều thấy "chưa thích" và cùng cộng. Dùng ON CONFLICT DO NOTHING kèm RETURNING, rồi chỉ tăng bộ đếm khi thật sự có dòng mới. Đây là lần thứ năm trong lộ trình cùng một nguyên tắc xuất hiện dưới một cú pháp khác.',
      descriptionEn:
        'Read-then-write loses under concurrency — both requests see "not liked" and both increment. Use ON CONFLICT DO NOTHING with RETURNING, and increment only when a row was actually inserted. This is the fifth appearance of one principle in a new syntax.',
      codeBlock:
        '-- Đã thích rồi thì không dòng nào trả về, UPDATE khớp 0 dòng.\n'
        + 'WITH inserted AS (\n'
        + '    INSERT INTO likes (user_id, post_id)\n'
        + '    VALUES ($1, $2)\n'
        + '    ON CONFLICT (user_id, post_id) DO NOTHING\n'
        + '    RETURNING post_id\n'
        + ')\n'
        + 'UPDATE posts\n'
        + '   SET like_count = like_count + 1\n'
        + ' WHERE id IN (SELECT post_id FROM inserted);',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Phân trang theo con trỏ có khoá phụ',
      titleEn: 'Cursor pagination with a tiebreaker',
      description:
        'OFFSET hỏng vì bài mới chèn vào đầu trong lúc người dùng đang cuộn — bài đã đọc hiện lại. Con trỏ chữa được, nhưng created_at không duy nhất: nhiều bài trùng tới mili giây sẽ bị bỏ sót. So sánh cặp (created_at, id) và đặt chỉ mục kép đúng thứ tự đó.',
      descriptionEn:
        'OFFSET breaks because new posts arrive at the top while the user scrolls, so seen posts reappear. A cursor fixes that, but created_at is not unique: posts sharing a millisecond get skipped. Compare the tuple (created_at, id) and index in exactly that order.',
      codeBlock:
        'SELECT * FROM posts\n'
        + ' WHERE (created_at, id) < ($1, $2)\n'
        + ' ORDER BY created_at DESC, id DESC\n'
        + ' LIMIT 20;',
      codeLang: 'sql',
    },
    {
      phase: 'BACKEND',
      title: 'Thịnh hành = tỉ lệ tăng, không phải tổng số',
      titleEn: 'Trending means growth rate, not lifetime total',
      description:
        'Sắp theo tổng lượt dùng cho ra bảng xếp hạng đứng yên nhiều tháng. So số lượt giờ này với trung bình sáu giờ trước, đếm số NGƯỜI duy nhất bằng HyperLogLog để một tài khoản spam 500 bài chỉ tính là một, và đặt ngưỡng sàn để hashtag đi từ 1 lên 20 không lên bảng.',
      descriptionEn:
        'Ordering by lifetime totals produces a leaderboard that does not move for months. Compare this hour against the previous six-hour average, count unique PEOPLE with HyperLogLog so one account spamming 500 posts counts once, and add an absolute floor so a 1-to-20 hashtag does not qualify.',
      codeBlock:
        "const bucket = `trend:${Math.floor(Date.now() / 3_600_000)}`;\n"
        + 'await redis.pfadd(`${bucket}:${tag}`, userId);   // đếm NGƯỜI, không đếm bài\n'
        + 'await redis.expire(`${bucket}:${tag}`, 86_400);\n'
        + '\n'
        + '// +1 ở mẫu số để hashtag hoàn toàn mới không chia cho 0.\n'
        + 'const score = countThisHour / (avgPrevious6Hours + 1);',
      codeLang: 'typescript',
    },
    {
      phase: 'BACKEND',
      title: 'Thông báo gộp theo groupKey, và đừng bắn socket từng cái',
      titleEn: 'Notifications collapsed by groupKey, and never one socket event each',
      description:
        'Bài 200 lượt thích không được sinh 200 dòng thông báo. Upsert theo (userId, groupKey) rồi tăng actorCount, hiển thị "Minh và 199 người khác". Bài lan truyền còn tạo hàng nghìn sự kiện mỗi giây tới cùng một người — gom trong cửa sổ vài giây rồi bắn một lần, nếu không trình duyệt của họ đứng hình vì chính thông báo.',
      descriptionEn:
        'A 200-like post must not produce 200 notification rows. Upsert on (userId, groupKey), increment actorCount, render "Minh and 199 others". A viral post also aims thousands of events per second at one user — batch within a few seconds and emit once, or their browser freezes because of the notifications themselves.',
    },
    {
      phase: 'FRONTEND',
      title: 'Cuộn vô hạn và cập nhật lạc quan',
      titleEn: 'Infinite scroll and optimistic updates',
      description:
        'Người dùng phải thấy bài của mình ngay khi bấm Đăng, dù việc đẩy còn đang chạy nền — client tự chèn vào đầu danh sách rồi hoà lại khi server trả về. Dòng thời gian nạp tác giả theo lô một lần thay vì hỏi riêng từng bài, nếu không 20 bài thành 20 truy vấn.',
      descriptionEn:
        'A user must see their own post the instant they press Post, even while fan-out is still running — the client inserts it optimistically and reconciles when the server responds. The timeline hydrates authors in one batch instead of per post, or 20 posts become 20 queries.',
    },
    {
      phase: 'TESTING',
      title: 'Đo bằng tài khoản đông người theo dõi và request đồng thời',
      titleEn: 'Measure with a high-follower account and concurrent requests',
      description:
        'Tạo tài khoản 100.000 người theo dõi rồi đăng bài — API phải trả dưới 200ms. Bắn 50 request thích cùng lúc — bộ đếm phải tăng đúng 1. Cuộn mười trang trong lúc một tài khoản khác đang đăng — không bài nào lặp. Tắt hẳn Redis — dòng thời gian vẫn phải trả về nhờ đường lui truy vấn DB.',
      descriptionEn:
        'Create a 100,000-follower account and post — the API must return in under 200ms. Fire 50 concurrent likes — the counter must move by exactly 1. Scroll ten pages while another account posts — nothing duplicates. Kill Redis outright — the timeline must still return through the DB fallback.',
    },
  ],

  features: [
    { title: 'Đăng bài, trả lời lồng nhau, đăng lại và trích dẫn', titleEn: 'Posts, threaded replies, reposts and quotes', description: 'Một bảng posts tự tham chiếu cho cả ba quan hệ.', descriptionEn: 'A single self-referencing posts table covers all three relationships.', status: 'PLANNED' },
    { title: 'Dòng thời gian lai đẩy–kéo', titleEn: 'Hybrid push–pull timeline', description: 'Đẩy cho tài khoản thường, truy vấn trực tiếp cho tài khoản trên ngưỡng.', descriptionEn: 'Push for ordinary accounts, direct query for accounts above the threshold.', status: 'PLANNED' },
    { title: 'Theo dõi hai chiều có bộ đếm sẵn', titleEn: 'Follow graph with denormalised counters', description: 'Chỉ mục ngược để trả lời "ai đang theo dõi tôi" lúc đẩy bài.', descriptionEn: 'A reverse index answers "who follows me" during fan-out.', status: 'PLANNED' },
    { title: 'Thích và đánh dấu chống trùng ở tầng database', titleEn: 'Likes and bookmarks deduplicated in the database', description: 'Khoá chính kép cộng ON CONFLICT, không đọc-rồi-ghi.', descriptionEn: 'Composite key plus ON CONFLICT, never read-then-write.', status: 'PLANNED' },
    { title: 'Hashtag và nhắc tên tự nhận diện', titleEn: 'Hashtag and mention extraction', description: 'Phân tích lúc đăng, lưu quan hệ thay vì tìm chuỗi lúc đọc.', descriptionEn: 'Parsed at write time into relations, rather than string-matched on read.', status: 'PLANNED' },
    { title: 'Chủ đề thịnh hành theo cửa sổ trượt', titleEn: 'Sliding-window trending topics', description: 'Tỉ lệ tăng theo giờ, đếm người duy nhất bằng HyperLogLog.', descriptionEn: 'Hourly growth rate with unique-actor counts via HyperLogLog.', status: 'PLANNED' },
    { title: 'Thông báo tức thời có gộp', titleEn: 'Aggregated real-time notifications', description: 'Một dòng cho mỗi bài, đếm số người, bắn socket theo cửa sổ.', descriptionEn: 'One row per post, actor counts, socket emissions batched by window.', status: 'PLANNED' },
    { title: 'Tìm kiếm người dùng, bài viết, hashtag', titleEn: 'Search across users, posts and hashtags', description: 'Chỉ mục ngoài để truy vấn tìm kiếm không đụng vào database chính.', descriptionEn: 'An external index keeps search traffic off the primary database.', status: 'PLANNED' },
    { title: 'Cuộn vô hạn không lặp, không mất bài', titleEn: 'Infinite scroll with no duplicates or gaps', description: 'Con trỏ theo cặp (created_at, id) với chỉ mục kép tương ứng.', descriptionEn: 'A tuple cursor on (created_at, id) backed by a matching composite index.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Redis — Pipelining', titleEn: 'Redis — Pipelining', url: 'https://redis.io/docs/latest/develop/use/pipelining/', type: 'LINK', description: 'Vì sao N lệnh trong một vòng mạng khác hẳn N vòng mạng — nền của bước đẩy hộp thư.', descriptionEn: 'Why N commands in one round trip differ fundamentally from N round trips — the basis of the fan-out step.' },
    { title: 'Redis — HyperLogLog', titleEn: 'Redis — HyperLogLog', url: 'https://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs/', type: 'LINK', description: 'Đếm số người duy nhất với 12KB và sai số 0,8% — đủ chính xác cho bảng thịnh hành.', descriptionEn: 'Unique-actor counts in 12KB at 0.8% error — accurate enough for a trending list.' },
    { title: 'PostgreSQL — Row comparison', titleEn: 'PostgreSQL — Row comparison', url: 'https://www.postgresql.org/docs/current/functions-comparisons.html#ROW-WISE-COMPARISON', type: 'LINK', description: 'So sánh cặp (created_at, id) trực tiếp trong WHERE, và nó dùng được chỉ mục kép.', descriptionEn: 'Comparing (created_at, id) as a tuple in WHERE, and how it still uses the composite index.' },
    { title: 'PostgreSQL — INSERT ... ON CONFLICT', titleEn: 'PostgreSQL — INSERT ... ON CONFLICT', url: 'https://www.postgresql.org/docs/current/sql-insert.html#SQL-ON-CONFLICT', type: 'LINK', description: 'Kèm RETURNING là cách để biết dòng có thật sự được chèn hay không.', descriptionEn: 'Combined with RETURNING, this is how you learn whether a row was really inserted.' },
    { title: 'BullMQ', titleEn: 'BullMQ', url: 'https://docs.bullmq.io/', type: 'LINK', description: 'Hàng đợi nền trên Redis: thử lại, chia lô, giới hạn tốc độ cho bước đẩy.', descriptionEn: 'A Redis-backed job queue: retries, batching and rate limits for the fan-out step.' },
  ],

  coreKnowledge: [
    { vi: 'Fan-out on write và fan-out on read: đánh đổi, và vì sao hệ thống thật dùng cả hai', en: 'Fan-out on write vs on read: the trade-off, and why real systems use both' },
    { vi: 'Bất đối xứng đọc/ghi: chọn phía nào để tối ưu dựa trên số đo, không dựa cảm tính', en: 'Read/write asymmetry: choosing which side to optimise from measurements, not instinct' },
    { vi: 'Phân trang theo con trỏ và vì sao khoá sắp xếp phải duy nhất', en: 'Cursor pagination and why the sort key must be unique' },
    { vi: 'Bộ đếm lưu sẵn: khi nào nên phi chuẩn hoá và cái giá phải trả', en: 'Denormalised counters: when to trade normal form away, and what it costs' },
    { vi: 'Hàng đợi nền: chia lô, thử lại, và tính lặp lại được', en: 'Background queues: batching, retries, and idempotency' },
    { vi: 'Cấu trúc dữ liệu xác suất: HyperLogLog cho bài toán đếm số lượng lớn', en: 'Probabilistic data structures: HyperLogLog for large-scale counting' },
    { vi: 'Gộp thông báo: thiết kế cho sự chú ý của con người, không chỉ cho dữ liệu', en: 'Notification aggregation: designing for human attention, not just for data' },
    { vi: 'Redis Lists và Sorted Sets: chọn đúng kiểu cho hộp thư và bảng xếp hạng', en: 'Redis Lists and Sorted Sets: picking the right type for inboxes and leaderboards' },
  ],

  portfolioBonus: [
    { vi: 'Biểu đồ đo độ trễ đăng bài trước và sau khi chuyển đẩy sang worker nền', en: 'A latency chart for posting, before and after moving fan-out to a background worker' },
    { vi: 'Mục README giải thích ngưỡng người nổi tiếng: con số bao nhiêu và vì sao chọn số đó', en: 'A README section on the celebrity threshold: the number chosen and the reasoning behind it' },
    { vi: 'Kịch bản tải mô phỏng tài khoản một triệu người theo dõi, kèm số đo thật', en: 'A load-test scenario simulating a million-follower account, with real measurements' },
    { vi: 'Video quay lại việc bấm thích liên tục mà bộ đếm vẫn đúng', en: 'A recording of rapid repeated likes with the counter staying correct' },
    { vi: 'So sánh bảng thịnh hành theo tổng số và theo tỉ lệ tăng trên cùng dữ liệu', en: 'A side-by-side trending list by lifetime total vs by growth rate on the same data' },
  ],

  completionOutcomes: [
    { vi: 'Nhận ra bất đối xứng đọc/ghi và thiết kế theo phía đắt hơn', en: 'Recognise read/write asymmetry and design around the expensive side' },
    { vi: 'Biết khi nào một chiến lược duy nhất là không đủ, và cách chia dữ liệu theo phân khúc', en: 'Know when one strategy is not enough, and how to segment data instead' },
    { vi: 'Đưa việc nặng ra khỏi vòng đời request mà không làm hỏng trải nghiệm', en: 'Move heavy work out of the request lifecycle without degrading the experience' },
    { vi: 'Viết truy vấn phân trang đúng trên dữ liệu đang thay đổi liên tục', en: 'Write correct pagination over data that is changing underneath you' },
    { vi: 'Chấp nhận sai số có kiểm soát khi độ chính xác tuyệt đối không đáng giá', en: 'Accept bounded error where exactness is not worth its price' },
  ],

  bodyMdx,
  bodyMdxEn,
};
