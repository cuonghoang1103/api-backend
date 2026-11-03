/**
 * Authentication · Chương 11 · Quiz (10 câu tình huống trên LabFlow ID v0.11). Slug giữ: auth-11-6-quiz.
 * Đáp án rải: A ×3 (câu 1, 5, 9) · B ×2 (câu 3, 8) · C ×3 (câu 2, 6, 10) · D ×2 (câu 4, 7).
 */
export default {
  title: 'Quiz: running it|||Quiz: vận hành nó',
  slug: 'auth-11-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống trên LabFlow ID v0.11 về Chương 11: bí mật tới tiến trình, hỏng nhanh, xoay khoá chồng lấn, rate limit chung + hỏng mở, audit log allow-list, sáu tín hiệu + runbook, mệt mỏi cảnh báo — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Check</span>
<h2>Chapter 11 check</h2>
<p class="lead">Ten scenarios on operating LabFlow ID v0.11. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can get secrets to a process and fail fast on a missing one.</li>
<li>I can rotate a signing key with no mass logout.</li>
<li>I can explain why the rate-limit counter must be shared and fail open.</li>
<li>I can write an audit entry that keeps enough and leaks nothing.</li>
<li>I can route a signal through a runbook and say why paging on everything fails.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Kiểm tra Chương 11</h2>
<p class="lead">Mười tình huống về vận hành LabFlow ID v0.11. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đưa được bí mật tới một tiến trình và hỏng nhanh khi thiếu một cái.</li>
<li>Tôi xoay được một khoá ký mà không đá hàng loạt.</li>
<li>Tôi giải thích được vì sao cái đếm giới hạn tần suất phải chung và hỏng mở.</li>
<li>Tôi viết được một mục audit giữ đủ và không rò gì.</li>
<li>Tôi định tuyến được một tín hiệu qua runbook và nói vì sao page mọi thứ thất bại.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A LabFlow instance boots with SESSION_SECRET unset. What should happen, and why?|||Một instance LabFlow boot với SESSION_SECRET chưa đặt. Nên xảy ra gì, và vì sao?',
        options: [
          'Refuse to start with a clear "missing SESSION_SECRET" error — a loud startup failure beats a 3am 500 deep in a request', 'Start normally and generate a random secret on the fly for this run', 'Start, and log the full environment so an operator can spot the gap', 'Start, and fall back to a hardcoded default secret from the code'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Fail fast at startup; a half-configured process fails later, harder to trace. A random or hardcoded secret is worse — sessions break on restart, or the default is public (11.1). VI: Hỏng nhanh lúc khởi động; một tiến trình nửa-cấu-hình hỏng sau, khó lần hơn. Một secret ngẫu nhiên hay hardcode còn tệ hơn — phiên vỡ khi khởi động lại, hoặc mặc định là công khai (11.1).',
      },
      {
        question: 'A secret was committed to the repo and removed in the next commit. Is it safe now?|||Một bí mật bị commit vào kho và gỡ trong commit sau. Nó an toàn chưa?',
        options: [
          'Yes — the latest commit no longer contains it', 'Yes — as long as the repo is private', 'No — it is in the git history on every clone and fork forever; the only fix is to rotate it', 'No — but only if someone already cloned the repo'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The earlier commit still holds the secret on every clone/fork; editing or private-repo status does not undo that. Rotate the secret (11.1). VI: Commit trước vẫn giữ bí mật trên mọi clone/fork; sửa hay kho riêng không gỡ điều đó. Xoay bí mật (11.1).',
      },
      {
        question: 'You rotate the JWT signing key k1 → k2 by swapping the key and restarting. What breaks?|||Bạn xoay khoá ký JWT k1 → k2 bằng cách tráo khoá và khởi động lại. Cái gì hỏng?',
        options: [
          'Nothing — a restart is the correct way to rotate', 'Every token signed with k1 is instantly invalid, logging out every user; rotate with an overlap (both keys live) instead', 'Only tokens issued in the last minute break', 'The JWKS endpoint stops responding'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A hard swap invalidates all old-key tokens at once. Keep both keys live during an overlap: sign with k2, still verify k1 until its tokens expire, then retire k1 (11.2). VI: Một cú tráo cứng vô hiệu mọi token khoá cũ cùng lúc. Giữ cả hai khoá sống trong một cửa sổ: ký bằng k2, vẫn xác minh k1 tới khi token của nó hết hạn, rồi cho k1 nghỉ (11.2).',
      },
      {
        question: 'During rotation, why publish the new key in JWKS (introduce) before signing with it (activate)?|||Trong lúc xoay, vì sao công bố khoá mới trong JWKS (introduce) trước khi ký bằng nó (activate)?',
        options: [
          'To make the JWKS file smaller', 'Because activate cannot run until introduce completes technically', 'So the old key can be deleted sooner', 'So JWKS clients fetch the new key before they see a token signed with it — otherwise they reject an unknown kid'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: A verifier that has not yet fetched the new key rejects a token with its kid. Introducing first gives every client time to learn it (11.2). VI: Một bộ xác minh chưa lấy khoá mới sẽ từ chối một token mang kid của nó. Giới thiệu trước cho mọi client thời gian học nó (11.2).',
      },
      {
        question: 'Your login limiter is an in-memory counter set to 100/min, running on 4 instances. What is the real limit?|||Bộ giới hạn đăng nhập của bạn là một cái đếm trong bộ nhớ đặt 100/phút, chạy trên 4 instance. Giới hạn thật là bao nhiêu?',
        options: [
          '~400/min — each instance counts only its own share; share one counter in Redis to fix it', 'Exactly 100/min — the load balancer keeps it consistent', '25/min — the limit is divided across instances', 'Unlimited — in-memory counters do not work at all'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Each of 4 nodes allows up to 100 of its ~1/4 of the traffic, so ~400 total. The counter must be shared (Redis) to hold the real limit (11.3). VI: Mỗi trong 4 node cho tới 100 của ~1/4 lưu lượng của nó, nên ~400 tổng. Cái đếm phải chung (Redis) để giữ giới hạn thật (11.3).',
      },
      {
        question: 'Redis (the rate-limit store) goes down. What should the limiter do, and why?|||Redis (kho giới hạn tần suất) sập. Bộ giới hạn nên làm gì, và vì sao?',
        options: [
          'Block all requests until Redis recovers, to stay safe', 'Crash the process so the load balancer removes it', 'Fail open — allow the request — because failing closed turns a cache outage into a total login outage', 'Switch to an in-memory counter per instance'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: A limiter that fails closed blocks every login when the counter cannot be read — the protection becomes the outage. Fail open and lose only the throttle (11.3). VI: Một bộ giới hạn hỏng đóng chặn mọi đăng nhập khi cái đếm không đọc được — bảo vệ thành sự cố. Hỏng mở và chỉ mất cái kìm (11.3).',
      },
      {
        question: 'A teammate logs the full event object "for completeness", including the reset token and new password. What is wrong?|||Một đồng đội log cả object sự kiện "cho đầy đủ", gồm token đặt lại và mật khẩu mới. Sai ở đâu?',
        options: [
          'Nothing — more logging is always better for debugging', 'The log file will simply be too large to store', 'It is slower than logging fewer fields', 'A token and a plaintext password now sit in the log store forever; keep an allow-list of safe fields and drop every secret'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: A logged secret is a second breach, read by everyone with log access and retained for months. Allow-list the safe fields; never log a token, password, cookie or OTP (11.4). VI: Một bí mật bị log là một vụ rò thứ hai, đọc bởi mọi ai có quyền log và giữ hàng tháng. Allow-list các trường an toàn; không bao giờ log một token, mật khẩu, cookie hay OTP (11.4).',
      },
      {
        question: 'Why use an allow-list, not a deny-list, when deciding what an audit entry may contain?|||Vì sao dùng một allow-list, không phải deny-list, khi quyết định một mục audit được chứa gì?',
        options: [
          'An allow-list is faster to evaluate', 'A deny-list misses any new sensitive field a teammate adds later; an allow-list only ever passes the fields you named safe', 'A deny-list cannot handle nested objects', 'An allow-list lets you log more fields overall'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A deny-list blocks only what you listed, so a new field is logged by default; an allow-list is safe by construction — only named fields pass (11.4, 1.5). VI: Một deny-list chỉ chặn cái bạn liệt kê, nên một trường mới được log mặc định; một allow-list an toàn theo cấu trúc — chỉ các trường đặt tên qua (11.4, 1.5).',
      },
      {
        question: 'Monitoring fires a "refresh-reuse spike". What does the runbook do, and why that?|||Giám sát nổ một "đợt tái-dùng-refresh". Runbook làm gì, và vì sao vậy?',
        options: [
          'Page the on-call now — a spike of replayed refresh tokens is an active session-theft campaign that needs a human this minute', 'Ignore it — refresh reuse is expected noise', 'Auto-record it — the stuffing defence already handled it', 'Investigate next business day — it is low priority'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Refresh-reuse means stolen tokens being replayed (Chapter 5); it is one of the two page-worthy signals (the other is a 5xx spike). It needs a human now (11.5). VI: Tái-dùng-refresh nghĩa là token bị trộm đang phát lại (Chương 5); nó là một trong hai tín hiệu đáng-page (cái kia là đợt 5xx). Nó cần một con người ngay (11.5).',
      },
      {
        question: 'Your runbook pages the on-call on every signal, including routine admin actions. What is the risk?|||Runbook của bạn page người trực mọi tín hiệu, gồm cả hành động admin thường lệ. Rủi ro là gì?',
        options: [
          'The pager hardware will wear out', 'Nothing — more alerts mean more safety', 'Alert fatigue: the on-call tunes out the pager and the one real alert is lost — the Chapter 10 fatigue attack, aimed at your own team', 'The audit log fills up with page events'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Paging on everything trains the on-call to ignore the pager, so the real alert is missed. Page only for a human-now; investigate or auto the rest (11.5, 10.4). VI: Page mọi thứ huấn luyện người trực lờ chuông, nên cảnh báo thật bị bỏ lỡ. Page chỉ cho việc-cần-người-ngay; investigate hay auto phần còn lại (11.5, 10.4).',
      },
    ],
  },
};
