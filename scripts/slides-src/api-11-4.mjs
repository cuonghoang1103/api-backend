/**
 * api-11-4 — API Design · Chapter 11 · Lesson 11.4 "Interview: a news feed" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s11-phong-van.mjs › api-11-3-feed-chat. Output = chạy thật interview/feed/fanout.mjs trên Redis 8.2.
 */
import { lamDeck, sql, http, two, box, cards, vsd } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 11 — The API design interview', bai: '11.4' };

export const deck = { key: 'api-11-4', code: 'API 11.4', title: 'A news feed', sub: 'Fan-out on write, on read, or both' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'Interview: a news feed', sub: 'Push or pull — measured on Redis<br>with a 100,000-follower page.' },

  { t: 'Clarify, then the contract', body: two(box('🎤 The facts that decide the design', 'One-way follow · newest first · a student follows ~150 accounts · the official page has <b>100,000</b> followers (≈ 670×) · live “new posts” would be nice.', 'lam'), box('Must never happen', 'A post from someone I blocked; a deleted post still shown. Out of scope: ranking, comments, media.', 'do2')) + sql(`POST   /v1/posts                 Idempotency-Key   201 + Location      422 · 429
DELETE /v1/posts/{id}                              204                 404 (also: not mine)
GET    /v1/feed?limit=20&cursor=…                  200 {data, page.next}   400 bad cursor
GET    /v1/users/{id}/posts?cursor=…               200 {data, page.next}
PUT    /v1/me/following/{userId}                   204 (idempotent)    404
DELETE /v1/me/following/{userId}                   204`, { lang: 'plaintext', sm: true }) + box('Opaque cursor', 'The client never learns whether it is a time, an id or a score — so ranking can arrive next year without /v2.', 'xanh') },

  { t: 'Push vs pull, measured', body: http(`$ node interview/feed/fanout.mjs write
fan-out khi GHI: một bài đăng ⇒ ghi vào timeline của mọi người theo dõi
người đăng                 theo dõi   lệnh Redis   thời gian   bộ nhớ Redis
bạn sinh viên                  150          300      13.9 ms   +0 MB
CLB lớn                     10,000       20,000      64.8 ms   +0.8 MB
trang FPTU chính thức      100,000      200,000     542.8 ms   +7.1 MB
đọc feed (1 ZRANGE, 20 bài): 0.178 ms/lần (trung bình 1.000 lần)`, { sm: true, title: 'push: one write per follower' }) + http(`$ node interview/feed/fanout.mjs read
fan-out khi ĐỌC: bài chỉ ghi MỘT lần; người đọc trộn bài của những người mình theo dõi
ghi một bài: 1 lệnh ZADD, bất kể bao nhiêu người theo dõi
người đọc theo dõi   lệnh Redis/lần đọc   thời gian/lần đọc
                10                   10           0.37 ms
               150                  150           1.94 ms
             1,000                1,000          16.72 ms`, { sm: true, title: 'pull: one read per followed account' }) + two(box('Push', 'Reads are one command. The big page costs 200,000 commands, ~0.5 s (465–543 ms, two runs) and 7.1 MB — every post.', 'do2'), box('Pull', 'Posting is one command. Every read pays per followed account: 1,000 ⇒ 7.7–16.7 ms (two runs) — and reads are 100× more frequent.', 'do2')) },

  { t: 'The hybrid', giua: true, body: http(`$ node interview/feed/fanout.mjs hybrid
lai: người thường ĐẨY lúc ghi; tài khoản > 10.000 người theo dõi được KÉO lúc đọc
đọc feed = 1 timeline + 3 tài khoản lớn = 4 lệnh, 0.677 ms/lần; trang đầu có 20 bài
trang FPTU (100.000 người theo dõi) đăng bài: 1 lệnh, 1.33 ms`, { sm: true, wrap: true }) + cards([
    ['Push for normal accounts', 'Friends’ posts are already in my timeline: 1 command.'],
    ['Pull for big accounts', 'Above a threshold (say 10,000 followers): read and merge at read time.'],
    ['The cost', 'Two code paths and a threshold someone must choose — say it as a number and how you would move it.'],
  ]) + box('Measured', 'Read: 4 commands, 0.16–0.68 ms over two runs. The big page posts with one command.', 'xanh') },

  { t: 'Pages that move while you read', body: http(`$ node interview/feed/fanout.mjs page
phân trang feed khi có bài mới chen vào giữa hai lần tải
trang 1:            1000030 1000029 1000028 1000027 1000026 1000025 1000024 1000023 1000022 1000021
trang 2 theo offset: 1000021 1000020 1000019 1000018 1000017 1000016 1000015 1000014 1000013 1000012   ⇒ lặp lại 1 bài: 1000021
trang 2 theo cursor: 1000020 1000019 1000018 1000017 1000016 1000015 1000014 1000013 1000012 1000011   ⇒ lặp lại 0 bài (cursor = 1000021)`, { sm: true, wrap: true }) + vsd('<p><code class="i">ZRANGE tl:1 10 19 REV</code> — a new post shifts everything by one: “why do I see this again?”</p>', '<p><code class="i">ZRANGE tl:1 (1000021 -inf BYSCORE REV LIMIT 0 10</code> — strictly older than the last item seen: immune to new posts.</p>', '✗ offset=10', '✓ cursor “older than X”') + box('Same lesson as Chapter 3', 'The score must be unique (here the post id), or ties need the id as a tie-breaker (3.2).', 'lam') },

  { t: 'Follow-ups and summary', giua: true, body: cards([
    ['Unfollow / block', 'Filter at read time against the follow list — correct immediately; clean the timeline in the background.'],
    ['Deleted post in 10,000 timelines', 'Timelines hold ids; hydration drops missing rows; a page may return 19 of 20 (limit is a maximum).'],
    ['“3 new posts” live', 'SSE (10.4: ~1 ms vs 1.1 s for polling); the event says “new posts, newest id X”, then a normal GET /v1/feed.'],
  ]) + `<ul><li>Push: 1 command per read; <b>200,000</b> commands and 7.1 MB per post of a 100,000-follower page</li><li>Pull: 1 command per post; 1,000 follows ⇒ <b>7.7–16.7 ms</b> on every read · hybrid: 4 commands, 0.16–0.68 ms</li><li>Offset repeated a post; the cursor did not</li></ul>` + box('Next', '11.5 — chat: retries that duplicate messages, clocks that disagree.', 'lam') },
]);
