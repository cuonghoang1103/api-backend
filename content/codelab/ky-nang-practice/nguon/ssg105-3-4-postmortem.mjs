/**
 * Kỹ năng nghề · 📝 3.4 — Post-mortem từ sự cố THẬT của cuongthai.com (CLAUDE.md "Known Error Patterns" + mục Docker & Deploy):
 *   18/08/2026 đĩa VPS cạn khi build (cache 7,6 GB, còn 1,8 GB, "no space left on device")
 *   18/08/2026 ảnh backend dựng nhầm Dockerfile (Alpine/musl + engine Prisma glibc) ⇒ API 502 bảy phút
 *   23–25/08/2026 thay nginx.conf bằng mv ⇒ container vẫn đọc inode cũ, hai lần deploy "OK" mà không có hiệu lực
 * Giờ trong dòng thời gian là MINH HOẠ (ghi rõ trong đề); ngày, số đo và cơ chế là thật.
 */
import { moDun, sapXep, phanLoai, tracNghiem, baiJs, kiemVB, LUU_Y, TN } from './_chung.mjs';

const PM1 = sapXep({
  tieuDe: 'Post-mortem 1 — Order the sections and the disk-full timeline',
  doKho: 'EASY', phut: 6,
  moTa: {
    en: '<p>A <b>post-mortem</b> (incident review) is written after something broke, so that it does not break the same way again. Its order is fixed so that a reader in a hurry gets the essentials from the top: what happened and how bad → when → why → what was done → what will change. Order the sections, then the real events of 18/08/2026, when a deploy on the cuongthai.com VPS ran out of disk.</p>',
    vi: '<p><b>Post-mortem</b> (báo cáo sau sự cố) được viết sau khi có thứ hỏng, để nó không hỏng theo cùng một cách nữa. Thứ tự cố định để người đọc vội lấy được điều cốt lõi từ trên xuống: chuyện gì và nặng cỡ nào → khi nào → vì sao → đã làm gì → sẽ thay đổi gì. Sắp các mục, rồi các sự kiện thật ngày 18/08/2026 khi một lần deploy trên VPS cuongthai.com cạn đĩa.</p>',
  },
  cau: [
    {
      en: 'Sections of a post-mortem', vi: 'Các mục của post-mortem',
      dung: ['Summary (2–3 sentences)', 'Impact (who, what, how long, how much)', 'Timeline (detection → recovery)', 'Root cause (5 whys)', 'Resolution and recovery', 'Action items (owner + due date)', 'Lessons learned'],
      giai: ['Summary and impact first for busy readers; the analysis in the middle; commitments at the end.', 'Tóm tắt và ảnh hưởng trước cho người đọc vội; phân tích ở giữa; cam kết ở cuối.'],
    },
    {
      en: 'Timeline of the 18/08/2026 disk incident', vi: 'Dòng thời gian sự cố đĩa 18/08/2026',
      dung: [
        'Over weeks, the Docker build cache grows to 7.6 GB on the disk that also holds Postgres',
        'deploy.sh starts and runs next build on the VPS',
        'Free disk drops to 1.8 GB while next build runs',
        'The deploy dies with “no space left on device”',
        'The build cache is pruned and the deploy is re-run',
        'Builds move to the home machine (deploy-nha.sh); the VPS keeps no build cache',
      ],
      giai: ['Slow cause → trigger → symptom → failure → recovery → prevention.', 'Nguyên nhân âm ỉ → kích hoạt → triệu chứng → hỏng → khôi phục → phòng ngừa.'],
    },
  ],
  goiY: ['Mục "đã xử lý" (khôi phục) đứng trước "việc cần làm" (phòng ngừa).', 'Dòng thời gian bắt đầu từ nguyên nhân âm ỉ, không phải từ lúc thấy lỗi.'],
  loiHayGap: ['Đặt nguyên nhân gốc lên đầu trước khi người đọc biết chuyện gì xảy ra.', 'Dòng thời gian chỉ có lúc hỏng và lúc sửa — mất phần "đã âm ỉ bao lâu".'],
  thuatNgu: [TN.postmortem, TN.impact, { en: 'timeline', vi: 'dòng thời gian sự kiện' }, { en: 'build cache', vi: 'bộ đệm lớp ảnh Docker khi build' }],
  khaiNiem: ['post-mortem structure'],
});

const WHY = [
  'The backend container kept restarting after the image swap',
  'The Prisma engine in the image was built for glibc, but the image base was Alpine (musl)',
  'The image was built from the default Dockerfile instead of Dockerfile.backend that compose uses',
  'The new deploy script ran docker build . without -f, outside compose',
  'Nothing checked that the image could start before it was pushed and swapped in',
];
const PM2 = phanLoai({
  tieuDe: 'Post-mortem 2 — 5 whys of the 502 that lasted seven minutes',
  doKho: 'MEDIUM', phut: 8,
  moTa: {
    en: '<p>On 18/08/2026 a deploy of cuongthai.com was green at every step — build, push, swap — and then the API answered <b>HTTP 502 for seven minutes</b>. Ask “why?” until you reach something you can change so it never happens again. Put each answer on the right step of the chain.</p>',
    vi: '<p>Ngày 18/08/2026 một lần deploy cuongthai.com xanh ở mọi bước — build, đẩy, tráo — rồi API trả <b>HTTP 502 suốt bảy phút</b>. Hỏi "vì sao?" tới khi chạm thứ có thể thay đổi để nó không bao giờ lặp lại. Đặt mỗi câu trả lời vào đúng bậc của chuỗi.</p>',
  },
  cotCau: 'Question',
  cot: 'Answer',
  luaChon: WHY,
  hang: [
    ['Why 1 — Why did the API return 502?', WHY[0], 'Vì sao API trả 502?'],
    ['Why 2 — Why did the container keep restarting?', WHY[1], 'Vì sao container khởi động lại liên tục?'],
    ['Why 3 — Why did the image carry the wrong engine?', WHY[2], 'Vì sao ảnh mang engine sai?'],
    ['Why 4 — Why the wrong Dockerfile?', WHY[3], 'Vì sao dùng nhầm Dockerfile?'],
    ['Why 5 — Why did it reach production?', WHY[4], 'Vì sao nó lọt tới production?'],
  ],
  giaiBang: ['The root cause is not “someone forgot -f” (a person) but “no check that the image runs” (a missing safety net). The real fix added both: the correct -f AND a libc ↔ engine check before pushing. Lesson recorded: a green build does not mean a runnable image.', 'Nguyên nhân gốc không phải "ai đó quên -f" (một người) mà là "không có chốt kiểm ảnh chạy được" (thiếu lưới an toàn). Bản sửa thật thêm cả hai: đúng -f VÀ chốt kiểm libc ↔ engine trước khi đẩy. Bài học: build xanh không có nghĩa là ảnh chạy được.'],
  goiY: ['Mỗi câu trả lời là nguyên nhân trực tiếp của câu ngay trên nó.', 'Bậc cuối phải là thứ quy trình thay đổi được, không phải một người.'],
  loiHayGap: ['Dừng ở bậc 3 ("dùng nhầm Dockerfile") — sửa xong vẫn có thể lọt kiểu lỗi khác.', 'Viết bậc 5 là "người viết script bất cẩn" — đổ lỗi, không sửa được gì.'],
  giaiThich: '<p>Restart loop → glibc engine on musl → default Dockerfile → no -f → no runnability check.</p>',
  thuatNgu: [TN.fiveWhys, TN.rootCause, { en: 'musl vs glibc', vi: 'hai thư viện C khác nhau — Alpine dùng musl, Debian/Ubuntu dùng glibc' }],
  khaiNiem: ['5 whys', 'root cause'],
});

const LOAI = ['Prevent', 'Detect', 'Mitigate'];
const PM3 = phanLoai({
  tieuDe: 'Post-mortem 3 — Prevent, detect or mitigate?',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>Good action items cover three layers: <b>prevent</b> (the failure cannot happen this way again), <b>detect</b> (if it happens, we notice in seconds instead of days), <b>mitigate</b> (when it happens, recovery is fast and small). These are real measures from the three cuongthai.com incidents. Classify each.</p>',
    vi: '<p>Việc cần làm tốt phủ ba lớp: <b>ngăn</b> (lỗi không thể xảy ra theo cách này nữa), <b>phát hiện</b> (nếu xảy ra, biết trong vài giây thay vì vài ngày), <b>giảm nhẹ</b> (khi xảy ra, khôi phục nhanh và ít thiệt hại). Đây là các biện pháp thật từ ba sự cố của cuongthai.com. Phân loại từng cái.</p>',
  },
  cotCau: 'Action',
  cot: 'Layer',
  luaChon: LOAI,
  hang: [
    ['Overwrite nginx.conf in place (cat new > conf) instead of mv', LOAI[0], 'Ghi đè tại chỗ thay vì mv'],
    ['After writing, compare sha256 on the host with sha256sum inside the container; stop on mismatch', LOAI[1], 'So sha256 trên host với bên trong container'],
    ['If nginx -t fails, put the previous config back automatically', LOAI[2], 'nginx -t hỏng thì tự trả bản cũ về'],
    ['Build images on the home machine so the VPS keeps no build cache', LOAI[0], 'Build ở máy nhà để VPS không giữ cache'],
    ['Smoke-test core API routes after each deploy and fail on 404', LOAI[1], 'Smoke-test các route chính sau deploy, 404 thì báo hỏng'],
    ['Re-tag the previous image and recreate the backend (about 40 seconds)', LOAI[2], 'Gắn lại tag ảnh cũ và dựng lại backend (~40 giây)'],
    ['Check libc ↔ Prisma engine before pushing the image', LOAI[0], 'Kiểm libc ↔ engine Prisma trước khi đẩy ảnh'],
    ['Weekly cron job reclaims VPS disk space', LOAI[0], 'Cron hằng tuần dọn đĩa VPS'],
  ],
  giaiBang: ['A check BEFORE the change reaches production prevents; a check AFTER detects; a fast way back mitigates. Note the libc check runs before the push, so it prevents the bad image from ever being swapped in.', 'Chốt kiểm TRƯỚC khi thay đổi tới production là ngăn; kiểm SAU là phát hiện; đường lui nhanh là giảm nhẹ. Chốt libc chạy trước khi đẩy nên nó ngăn ảnh hỏng được tráo vào.'],
  goiY: ['Hỏi: biện pháp này chạy trước, sau, hay trong lúc sự cố?', 'Một lệnh khôi phục nhanh là giảm nhẹ, không phải ngăn.'],
  loiHayGap: ['Chỉ viết việc "ngăn" — lần sau hỏng kiểu khác vẫn không ai biết.', 'Coi smoke-test sau deploy là ngăn (nó chỉ phát hiện, sau khi đã lên).'],
  giaiThich: '<p>Prevent · Detect · Mitigate · Prevent · Detect · Mitigate · Prevent · Prevent.</p>',
  thuatNgu: [TN.actionItem, { en: 'smoke test', vi: 'kiểm nhanh vài đường chính sau khi lên bản' }, { en: 'mitigation', vi: 'giảm nhẹ thiệt hại' }],
  khaiNiem: ['action items'],
});

const PM4 = tracNghiem({
  tieuDe: 'Post-mortem 4 — Blameless summaries and impact statements',
  doKho: 'MEDIUM', phut: 6,
  moTa: {
    en: '<p>A post-mortem is <b>blameless</b>: it assumes people acted reasonably with what they knew, and looks for the gap in the system that let a reasonable action cause harm. It is also <b>precise about impact</b>: who was affected, how, for how long. Choose the best sentence each time.</p>',
    vi: '<p>Post-mortem là <b>không đổ lỗi</b>: giả định mọi người hành động hợp lý với thông tin họ có, và tìm lỗ hổng của hệ thống đã để một hành động hợp lý gây hại. Nó cũng <b>chính xác về ảnh hưởng</b>: ai bị, bị thế nào, bao lâu. Chọn câu tốt nhất.</p>',
  },
  cau: [
    { en: 'Summary of the nginx incident', vi: 'Tóm tắt sự cố nginx', lc: [['a', '“The deploy script was badly written.”'], ['b', '“For two deploys (23–25/08), nginx config changes reported OK but never took effect: the file was replaced with mv, and the single-file bind mount kept serving the old inode.”'], ['c', '“Nginx had a problem.”'], ['d', '“Someone should have tested it.”']], dap: 'b', giai: ['Duration, the misleading signal (“OK”), the mechanism — no person.', 'Thời gian, tín hiệu đánh lừa ("OK"), cơ chế — không có người bị nêu.'] },
    { en: 'Impact of the 18/08 502 incident', vi: 'Ảnh hưởng của sự cố 502 ngày 18/08', lc: [['a', '“The site was down for a while.”'], ['b', '“Every API request returned HTTP 502 for about 7 minutes; the web pages loaded but could not log in or load data.”'], ['c', '“Users were very angry.”'], ['d', '“Not much impact.”']], dap: 'b', giai: ['What failed, the scope, the duration, what users experienced.', 'Cái gì hỏng, phạm vi, thời lượng, người dùng trải qua gì.'] },
    { en: 'A blameless “contributing factor”', vi: 'Một "yếu tố góp phần" không đổ lỗi', lc: [['a', '“The developer forgot the -f flag.”'], ['b', '“Building outside compose required repeating the Dockerfile name by hand, and nothing compared it with the compose file.”'], ['c', '“The developer is new.”'], ['d', '“Bad luck.”']], dap: 'b', giai: ['Describe the condition that made the mistake easy, not the person who made it.', 'Mô tả điều kiện khiến sai sót dễ xảy ra, không phải người mắc sai sót.'] },
    { en: 'Lesson from the nginx incident', vi: 'Bài học từ sự cố nginx', lc: [['a', '“Be more careful.”'], ['b', '“‘Written’ is not ‘in effect’: verify a change from where it is consumed (inside the container), not where it was written.”'], ['c', '“Never use nginx.”'], ['d', '“Do not deploy on Mondays.”']], dap: 'b', giai: ['A lesson is a reusable rule, not an emotion.', 'Bài học là quy tắc dùng lại được, không phải cảm xúc.'] },
  ],
  goiY: ['Câu tốt có cơ chế + con số; không có tên người, không có tính từ chê.', '"Cẩn thận hơn" không phải bài học — không kiểm được.'],
  loiHayGap: ['Viết tóm tắt như lời xin lỗi.', 'Ảnh hưởng ghi "không đáng kể" mà không đo.'],
  thuatNgu: [TN.blameless, TN.impact, { en: 'contributing factor', vi: 'yếu tố góp phần gây sự cố' }, { en: 'bind mount', vi: 'gắn tệp/thư mục của máy chủ vào container' }],
  khaiNiem: ['blameless culture'],
});

/* ─────────────── PM5 — viết post-mortem nginx dạng có cấu trúc ─────────────── */
const DAU_PM = `// Write the post-mortem of the nginx bind-mount incident (23–25/08/2026), from the log in the statement.
// Times in "YYYY-MM-DD HH:MM". Write in English or Vietnamese.

const POSTMORTEM = {
  title: '',
  summary: '',     // ≤ 60 words, contains at least one number
  impact: '',      // who/what was affected, for how long — at least 2 numbers
  timeline: [
    // { time: '2026-08-23 10:00', event: '' },
  ],
  rootCause: '',   // the mechanism
  whys: [
    // 'Why 1 …', 'Why 2 …', …
  ],
  resolution: '',
  actionItems: [
    // { action: '', owner: '', due: 'YYYY-MM-DD', type: 'prevent' | 'detect' | 'mitigate' },
  ],
  lessons: [],
};
`;
const GIAI_PM = `// Post-mortem — nginx config changes "deployed" but never in effect (23–25/08/2026).
// Times are illustrative (the real log has dates, not minutes); facts, numbers and mechanism are real.

const POSTMORTEM = {
  title: 'nginx config changes reported OK for 2 deploys but never took effect',
  summary: 'For 2 deploys between 23/08 and 25/08, step 6c of deploy-nha.sh reported KQ=OK while production nginx kept serving the old config: HTTP/2 stayed off and cache headers stayed no-store.',
  impact: 'The intended cache rules for 94 MB of /playground assets never applied, so browsers re-downloaded them on every visit; 12 logo SVG files and robot.json were also refetched on each navigation. HTTP/2 stayed off on production for about 2 days.',
  timeline: [
    { time: '2026-08-23 10:00', event: 'Step 6c is added to deploy-nha.sh to sync nginx/nginx.conf, run nginx -t and reload.' },
    { time: '2026-08-23 10:20', event: 'Deploy 1: step 6c prints KQ=OK; curl -I still shows no-store and no HTTP/2.' },
    { time: '2026-08-25 09:00', event: 'Deploy 2 with a new config: KQ=OK again, headers unchanged.' },
    { time: '2026-08-25 09:30', event: 'Investigation: sha256 of the host file differs from sha256sum inside the container.' },
    { time: '2026-08-25 10:00', event: 'Cause found: the file was replaced with mv; the container still reads the old inode.' },
    { time: '2026-08-25 10:30', event: 'Fix deployed: overwrite in place + host/container sha256 check; HTTP/2 and cache headers confirmed with curl -I.' },
  ],
  rootCause: 'nginx.conf is a single-file bind mount, and Docker binds a single file by inode when the container starts. Step 6c replaced the file with mv, which points the host path to a new inode, so the container kept reading the old one; nginx -t and reload checked and reloaded the old config.',
  whys: [
    'Why did the new headers not appear? Because nginx inside the container still used the old config.',
    'Why the old config? Because the container read the old inode of nginx.conf.',
    'Why the old inode? Because step 6c replaced the file with mv, creating a new inode on the host.',
    'Why did nobody notice for 2 deploys? Because the step verified the config with nginx -t and reload, which only see what the container sees, and both reported OK.',
    'Why was that the only check? Because the step checked that the file was written, not that the container was reading it.',
  ],
  resolution: 'The deploy step now overwrites the file in place (cat new > nginx.conf) and compares the sha256 on the host with sha256sum inside the container; on mismatch it restores the previous config and stops.',
  actionItems: [
    { action: 'Write bind-mounted single files in place; never mv, rsync, sed -i or editor save-as', owner: 'deploy maintainer', due: '2026-08-26', type: 'prevent' },
    { action: 'Compare host sha256 with docker exec sha256sum after every config write; stop on mismatch', owner: 'deploy maintainer', due: '2026-08-26', type: 'detect' },
    { action: 'Keep the previous config and restore it automatically when nginx -t or the hash check fails', owner: 'deploy maintainer', due: '2026-08-27', type: 'mitigate' },
    { action: 'Add curl -I checks of HTTP/2 and cache headers to the post-deploy smoke test', owner: 'deploy maintainer', due: '2026-08-30', type: 'detect' },
  ],
  lessons: [
    'Written is not in effect: verify a change where it is consumed (inside the container).',
    'A success message from a check that reads the old state is worse than no check.',
  ],
};
`;
const PM5 = baiJs({
  tieuDe: 'Post-mortem 5 — Write the nginx post-mortem (structured)',
  doKho: 'HARD', phut: 40,
  moTa: {
    en: `<p>Write the post-mortem of a real cuongthai.com incident as a structured object. The facts (from the project’s incident log):</p>
<ul>
<li><b>23/08/2026</b> — step 6c is added to <code>deploy-nha.sh</code>: copy <code>nginx/nginx.conf</code> to the VPS, run <code>nginx -t</code>, then <code>reload</code>. Goal: HTTP/2 and real cache headers (the <code>/playground</code> assets, 94 MB, were served <code>no-store</code>; 12 logo SVGs and <code>robot.json</code> were refetched on every navigation).</li>
<li><b>Two deploys in a row</b> report <code>KQ=OK</code> — <code>nginx -t</code> green, <code>reload</code> green — but HTTP/2 is still off and every cache header is still <code>no-store</code>.</li>
<li><b>25/08/2026</b> — cause: the step replaced the file with <code>mv</code>. <code>nginx.conf</code> is a <b>single-file bind mount</b>, and Docker binds a single file <b>by inode</b> when the container starts. <code>mv</code> points the host path to a new inode; the container keeps reading the old one, so <code>nginx -t</code> tests the old config and <code>reload</code> reloads it.</li>
<li><b>Fix</b>: overwrite in place (<code>cat new &gt; conf</code>; never <code>mv</code>/<code>rsync</code>/<code>sed -i</code>/editor save-as) and compare <code>sha256</code> on the host with <code>docker exec … sha256sum</code> inside the container; on mismatch restore the old file and stop.</li>
</ul>
<p>The log has dates, not times — use <b>illustrative</b> times in the timeline and say so in a comment. Fill <code>POSTMORTEM</code>:</p>
<ul><li><code>summary</code> ≤ 60 words with a number; <code>impact</code> with ≥ 2 numbers; no vague words in either;</li>
<li><code>timeline</code> ≥ 5 entries <code>{ time: 'YYYY-MM-DD HH:MM', event }</code> in chronological order, from 23/08 to 25/08;</li>
<li><code>rootCause</code> explains the mechanism (mentions <b>inode</b> and <b>mv</b>);</li>
<li><code>whys</code> ≥ 4 steps of at least 6 words each; no blame words anywhere;</li>
<li><code>actionItems</code> ≥ 3, each with action, owner (a role is fine), due date after the incident, and type; at least one <code>prevent</code> and one <code>detect</code>, and at least one action verifies the file <b>inside the container</b> (sha256 / docker exec);</li>
<li><code>resolution</code> and ≥ 1 <code>lessons</code> filled.</li></ul>`,
    vi: `<p>Viết post-mortem của một sự cố thật của cuongthai.com dưới dạng đối tượng có cấu trúc. Sự việc (từ nhật ký sự cố của dự án): 23/08 thêm bước 6c vào <code>deploy-nha.sh</code> (chép <code>nginx.conf</code>, <code>nginx -t</code>, <code>reload</code>) để bật HTTP/2 và header cache thật (94 MB tài nguyên <code>/playground</code> đang <code>no-store</code>; 12 logo SVG và <code>robot.json</code> tải lại mỗi lần chuyển trang). Hai lần deploy liền báo <code>KQ=OK</code> nhưng HTTP/2 vẫn tắt, header vẫn <code>no-store</code>. 25/08 tìm ra: bước đó thay tệp bằng <code>mv</code>; <code>nginx.conf</code> là bind-mount MỘT TỆP, Docker gắn theo <b>inode</b> lúc container khởi động; <code>mv</code> trỏ đường dẫn sang inode mới, container vẫn đọc inode cũ, nên <code>nginx -t</code> kiểm và <code>reload</code> nạp lại config cũ. Sửa: ghi đè tại chỗ + so <code>sha256</code> trên host với bên trong container, lệch thì trả bản cũ và dừng.</p>
<p>Nhật ký chỉ có ngày — dùng giờ <b>minh hoạ</b> và ghi chú rõ. Điền <code>POSTMORTEM</code> theo các yêu cầu ở bản tiếng Anh: tóm tắt ≤ 60 từ có số; ảnh hưởng ≥ 2 con số; không từ mơ hồ; dòng thời gian ≥ 5 mốc đúng thứ tự từ 23/08 tới 25/08; nguyên nhân gốc nói tới inode và mv; ≥ 4 bậc "vì sao", không từ đổ lỗi; ≥ 3 việc cần làm có người, hạn sau sự cố, loại — có ít nhất một prevent, một detect, và một việc kiểm tệp <b>bên trong container</b>; có resolution và bài học.</p>`,
  },
  yeuCau: [
    LUU_Y,
    { en: 'owner can be a role (“deploy maintainer”) — a post-mortem assigns work, it does not name culprits.', vi: 'owner có thể là vai trò ("người giữ script deploy") — post-mortem giao việc, không gọi tên thủ phạm.' },
  ],
  viDu: [{ input: "timeline: [{ time: '2026-08-25 10:00', event: '…' }, { time: '2026-08-23 10:00', event: '…' }]", output: '✗ Timeline — entries are not in chronological order|||✗ Timeline — các mốc không theo thứ tự thời gian', explanation: 'Sort by time; the incident starts on 23/08.|||Sắp theo thời gian; sự cố bắt đầu 23/08.' }],
  goiY: [
    'Viết rootCause trước: một câu về bind-mount theo inode, một câu về mv, một câu về vì sao nginx -t vẫn xanh.',
    'Năm "vì sao" đi từ triệu chứng (header không đổi) xuống tới thiếu chốt kiểm (chỉ kiểm "đã ghi", không kiểm "container đọc được").',
    'Việc cần làm: prevent = ghi đè tại chỗ; detect = so sha256 host ↔ container; mitigate = tự trả bản cũ.',
  ],
  loiHayGap: [
    'Nguyên nhân gốc là "nginx lỗi" hoặc "script sai" — không nêu cơ chế inode.',
    'Việc cần làm không có hạn hoặc không có người — không ai làm.',
    'Ảnh hưởng "trang chậm hơn" — không có số (94 MB, 2 lần deploy, ~2 ngày).',
    'Viết "người viết script bất cẩn" trong 5 whys.',
  ],
  giaiThich: {
    en: '<p>The model answer keeps every claim checkable: the summary names the duration (2 deploys, 23–25/08), the misleading signal (KQ=OK) and the visible symptom; the impact quantifies what the fix was supposed to deliver; the whys end on a missing check, not a person; the action items cover prevent / detect / mitigate, with a role as owner. The general lesson — <i>“written” is not “in effect”</i> — is the same one this project learned with sshd drop-ins and with Next.js headers swallowed by nginx.</p>',
    vi: '<p>Bài mẫu giữ mọi khẳng định kiểm được: tóm tắt nêu thời lượng (2 lần deploy, 23–25/08), tín hiệu đánh lừa (KQ=OK) và triệu chứng thấy được; ảnh hưởng đo cái bản sửa lẽ ra mang lại; các "vì sao" kết thúc ở một chốt kiểm thiếu, không ở một người; việc cần làm phủ ngăn / phát hiện / giảm nhẹ, owner là vai trò. Bài học chung — <i>"đã ghi" không phải "đã có hiệu lực"</i> — cũng là bài học dự án này rút ra với drop-in sshd và với header của Next.js bị nginx nuốt.</p>',
  },
  thuatNgu: [TN.postmortem, TN.rootCause, TN.fiveWhys, TN.actionItem, TN.blameless, { en: 'inode', vi: 'mã định danh của tệp trong hệ thống tệp — đổi tên bằng mv tạo inode mới cho đường dẫn' }, { en: 'single-file bind mount', vi: 'gắn MỘT tệp của máy chủ vào container — gắn theo inode lúc khởi động' }],
  khaiNiem: ['post-mortem writing'],
  tep: { 'postmortem.js': [DAU_PM, GIAI_PM] },
  kiem: [
    kiemVB({ en: 'All sections filled', vi: 'Đủ mọi mục' }, () => { const p = POSTMORTEM; const s = ['title', 'summary', 'impact', 'rootCause', 'resolution'].filter((k) => !__V.s(p[k]).trim()); const a = ['timeline', 'whys', 'actionItems', 'lessons'].filter((k) => !Array.isArray(p[k]) || !p[k].length); const t = s.concat(a); return t.length ? 'empty: ' + t.join(', ') : 'OK'; }),
    kiemVB({ en: 'Summary ≤ 60 words with a number; impact with ≥ 2 numbers; no vague words', vi: 'Tóm tắt ≤ 60 từ có số; ảnh hưởng ≥ 2 con số; không từ mơ hồ' }, () => { const p = POSTMORTEM; const n = __V.w(p.summary); if (!n || n > 60) return 'summary has ' + n + ' words'; if (!__V.nums(p.summary).length) return 'summary has no number'; if (__V.nums(p.impact).length < 2) return 'impact needs at least 2 numbers'; const v = __V.vague(p.summary + ' ' + p.impact); return v.length ? 'vague words: ' + v.join(', ') : 'OK'; }),
    kiemVB({ en: 'Timeline: ≥ 5 entries, valid times, chronological, 23/08 → 25/08', vi: 'Dòng thời gian: ≥ 5 mốc, giờ hợp lệ, đúng thứ tự, 23/08 → 25/08' }, () => { const t = POSTMORTEM.timeline; if (!Array.isArray(t) || t.length < 5) return 'need at least 5 entries'; for (let i = 0; i < t.length; i++) { if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(__V.s(t[i] && t[i].time))) return 'entry ' + i + ' time must be YYYY-MM-DD HH:MM'; if (__V.w(t[i].event) < 4) return 'entry ' + i + ' event is too short'; if (i && t[i].time < t[i - 1].time) return 'entries are not in chronological order (' + t[i - 1].time + ' then ' + t[i].time + ')'; } if (t[0].time.slice(0, 10) !== '2026-08-23') return 'the incident starts on 2026-08-23'; return t[t.length - 1].time.slice(0, 10) === '2026-08-25' ? 'OK' : 'the timeline should end on 2026-08-25 (fix confirmed)'; }),
    kiemVB({ en: 'Root cause names the mechanism (inode, mv)', vi: 'Nguyên nhân gốc nêu cơ chế (inode, mv)' }, () => { const r = __V.low(POSTMORTEM.rootCause); return /inode/.test(r) && /(^|[^a-z])mv([^a-z]|$)/.test(r) ? 'OK' : 'explain WHY: the single-file bind mount follows the inode, and mv created a new one'; }),
    kiemVB({ en: '5 whys: ≥ 4 steps, ≥ 6 words each, blameless', vi: '5 whys: ≥ 4 bậc, mỗi bậc ≥ 6 từ, không đổ lỗi' }, () => { const w = POSTMORTEM.whys; if (!Array.isArray(w) || w.length < 4) return 'need at least 4 whys'; const ngan = w.findIndex((x) => __V.w(x) < 6); if (ngan >= 0) return 'why ' + (ngan + 1) + ' is too short'; const all = JSON.stringify(POSTMORTEM); const b = __V.blame(all); return b.length ? 'blame words: ' + b.join(', ') : 'OK'; }),
    kiemVB({ en: 'Action items: owner, due date after the incident, type; prevent + detect', vi: 'Việc cần làm: người, hạn sau sự cố, loại; có prevent + detect' }, () => { const a = POSTMORTEM.actionItems; if (!Array.isArray(a) || a.length < 3) return 'need at least 3 action items'; for (let i = 0; i < a.length; i++) { const x = a[i] || {}; if (__V.w(x.action) < 3) return 'item ' + i + ' has no real action'; if (!__V.s(x.owner).trim()) return 'item ' + i + ' has no owner'; if (!/^\d{4}-\d{2}-\d{2}$/.test(__V.s(x.due)) || x.due < '2026-08-25') return 'item ' + i + ' due date must be YYYY-MM-DD on/after 2026-08-25'; if (['prevent', 'detect', 'mitigate'].indexOf(x.type) < 0) return 'item ' + i + ' type must be prevent | detect | mitigate'; } const ty = a.map((x) => x.type); return ty.indexOf('prevent') >= 0 && ty.indexOf('detect') >= 0 ? 'OK' : 'need at least one prevent and one detect'; }),
    kiemVB({ en: 'One action verifies the file inside the container', vi: 'Một việc kiểm tệp bên trong container' }, () => { const a = POSTMORTEM.actionItems || []; return a.some((x) => /sha256|docker exec|inside the container|bên trong container/i.test(__V.s(x && x.action))) ? 'OK' : 'add the check that would have caught it: compare the file as the CONTAINER sees it'; }, { an: true }),
  ],
  boYeu: [
    { ten: 'nguyên nhân gốc chung chung', tep: { 'postmortem.js': GIAI_PM.replace(/rootCause: '[^']*'/, "rootCause: 'The deploy script had a bug in the nginx step, so the config was not applied correctly.'") }, phaiTruot: ['Root cause'] },
    { ten: 'dòng thời gian lộn xộn', tep: { 'postmortem.js': GIAI_PM.replace("{ time: '2026-08-23 10:20'", "{ time: '2026-08-25 23:59'") }, phaiTruot: ['Timeline'] },
    { ten: 'đổ lỗi trong 5 whys', tep: { 'postmortem.js': GIAI_PM.replace("'Why was that the only check? Because the step checked that the file was written, not that the container was reading it.'", "'Why was that the only check? Because the person who wrote the step was careless.'") }, phaiTruot: ['blameless'] },
    { ten: 'việc cần làm không có hạn', tep: { 'postmortem.js': GIAI_PM.replace(/due: '2026-08-26'/g, "due: ''") }, phaiTruot: ['Action items'] },
    { ten: 'ảnh hưởng không có số', tep: { 'postmortem.js': GIAI_PM.replace(/impact: '[^']*'/, "impact: 'Pages were slower than they should be and some headers were wrong.'") }, phaiTruot: ['impact with'] },
  ],
});

export default moDun({
  slug: 'ssg105-3-4-postmortem',
  ten: '3.4 Post-mortems from real cuongthai.com incidents',
  moTaModule: 'Thứ tự mục post-mortem và dòng thời gian sự cố đĩa VPS 18/08, 5 whys của lần API 502 bảy phút (ảnh Alpine + engine Prisma glibc), phân loại việc cần làm ngăn/phát hiện/giảm nhẹ, câu tóm tắt và ảnh hưởng không đổ lỗi, rồi tự viết post-mortem sự cố nginx bind-mount theo inode (chấm cấu trúc).',
  baiHoc: 'ssg105-3-1-writing',
  de: [PM1, PM2, PM3, PM4, PM5],
});
