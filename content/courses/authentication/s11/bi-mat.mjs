/**
 * Authentication · Chương 11 · 11.1 — Bí mật: đưa chúng tới tiến trình mà không đụng vào kho mã. Slug giữ: auth-11-1-bi-mat. Bài đầu chương.
 * Code THẬT từ _ma.mjs (src/secrets/load.js) + output demo11/secrets.mjs (LabFlow ID v0.11).
 */
import G from '../giang/auth-11-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('🔑', 'OWASP — Secrets Management Cheat Sheet', 'How secrets reach a process, where they live, and rotation — the basis of this lesson (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'),
  nguon('📦', 'The Twelve-Factor App — III. Config', 'Config that varies between deploys lives in the environment, not the code (read 04/11/2026).', 'https://12factor.net/config'),
].join('\n');
const NGUON_VI = [
  nguon('🔑', 'OWASP — Secrets Management Cheat Sheet', 'Bí mật tới một tiến trình ra sao, sống ở đâu, và xoay — nền của bài này (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'),
  nguon('📦', 'The Twelve-Factor App — III. Config', 'Cấu hình thay đổi giữa các lần deploy sống trong môi trường, không trong mã (đọc 04/11/2026).', 'https://12factor.net/config'),
].join('\n');

export default {
  title: '11.1 — Secrets: getting them to the process without touching the repo|||11.1 — Bí mật: đưa chúng tới tiến trình mà không đụng vào kho mã',
  slug: 'auth-11-1-bi-mat',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Chương 1–10 dựng và tấn công dịch vụ; hai chương cuối VẬN HÀNH nó. Bí mật (URL CSDL, khoá ký, session secret) phải tới tiến trình từ MÔI TRƯỜNG — .env của VPS, một trình quản lý bí mật — tiêm lúc khởi động, không bao giờ commit (Twelve-Factor). loadConfig() kiểm bí mật bắt buộc lúc KHỞI ĐỘNG ⇒ thiếu một cái là lỗi khởi động ồn ào, rõ ("thiếu DATABASE_URL, SESSION_SECRET"), từ chối chạy nửa-cấu-hình thay vì một 500 bí ẩn sau. redactedConfig() cho banner khởi động hiện cấu hình nào ĐƯỢC ĐẶT ([set]) mà không bao giờ GIÁ TRỊ (không postgres://…:pw@…). Một bí mật commit một lần là trong lịch sử git VĨNH VIỄN (mọi clone/fork) ⇒ xoay là cách sửa duy nhất; .gitignore .env + gitleaks (Chương 1). Prod: /opt/cuonghoangdev/.env sống qua deploy. Một nguồn sự thật mỗi bí mật; thiết kế để một vụ rò là một lần XOAY (11.2). Theo OWASP Secrets Management + Twelve-Factor.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Secrets: getting them to the process without touching the repo</h2>
<p class="lead">Chapters 1 through 10 built the service and attacked it. The last two run it. The first thing running it needs is secrets — the database URL, the signing key, the session secret — and the one rule that matters: they must reach the process without ever living in the repo, because a secret committed once is in the git history forever.</p>

<div class="callout ok">
<p><strong>After Chapter 11 you can:</strong> get secrets to a process safely, rotate a key with no mass logout, rate-limit traffic that is spread across instances, write an audit log that leaks nothing, and route monitoring signals through a runbook. Lab 11 grades the audit log and the runbook.</p>
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>load secrets from the environment and fail fast on a missing one;</li>
<li>log a startup banner that shows which config is set without printing any value;</li>
<li>explain why a committed secret is forever, and design so a leak is a rotation.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> the most common serious leak is not a clever exploit — it is a secret in a git repo. Everything you built is undone the moment the signing key is in a public history.</p>
</div>

<h3>The environment, not the code</h3>
<p>Secrets come from the environment the process runs in — the VPS <code>.env</code>, a secrets manager — injected at start, never committed. This is the Twelve-Factor rule: config that varies between deploys (and secrets always do) lives in the environment, not the source. The code reads from <code>process.env</code> and holds nothing itself.</p>

<h3>Fail fast on a missing secret</h3>
<p><code>loadConfig()</code> checks the required secrets at <em>start</em>, and a missing one is a loud, clear startup failure — not a mysterious 500 three hours later, deep inside a request, when a query finally runs:</p>
${ma('javascript', CODE.secrets)}
<p>It returns the <code>missing</code> list so the caller can refuse to start. Half-configured is worse than not started: a process that boots without <code>SESSION_SECRET</code> will happily serve traffic until the first session is signed, then fail in a way that is hard to trace back to the cause.</p>

<h3>The banner you can log</h3>
<p>At startup you want to log <em>which</em> config loaded, to catch a missing or misspelled variable — but never <em>what</em> it is. <code>redactedConfig()</code> shows each secret as <code>[set]</code> or <code>[MISSING]</code>, never its value:</p>
${ra(OUT['111-secrets'])}
<p>The banner proves the config is complete at a glance, and no secret value touched the log. (Contrast a naive <code>console.log(config)</code>, which would print <code>DATABASE_URL: "postgres://labflow:s3cr3t-pw@db/labflow"</code> — the database password, now in your logs.)</p>

<h3>Why the repo is forever</h3>
<p>A secret committed once is in the git history on every clone and fork, even after you "delete" it in a later commit — the old commit still has it. The only real fix is to <em>rotate the secret</em>, not edit the file. So the rule is never let it in: <code>.gitignore</code> the <code>.env</code>, and scan with gitleaks (Chapter 1) in CI so a committed secret fails the build before it is pushed.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>NEXT_PUBLIC_</code> and other build-time leaks.</strong> A secret baked into a frontend bundle is shipped to every browser — it is not a secret at all. Third-party API keys must stay server-side, read from runtime env, behind an authenticated proxy (the GIPHY pattern). "It is in an env var" is not enough; it must be an env var the <em>server</em> reads, never one compiled into client code.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Where do secrets come from?"</strong> — The environment (VPS env file, a secrets manager), injected at start; never the repo. Twelve-Factor config.</li>
<li><strong>"What happens if a required secret is missing?"</strong> — The process fails fast at startup with a clear message, rather than running half-configured and 500-ing later.</li>
<li><strong>"A secret got committed — now what?"</strong> — Rotate it. It is in the git history forever; editing the file does not remove it from past commits, clones or forks.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo11/secrets.mjs</code>. What does a process with two secrets unset do, and what exactly does the safe startup banner show for <code>DATABASE_URL</code>?</li>
<li>Why is failing fast at startup better than letting the process boot without a secret?</li>
<li>A teammate removes a committed API key in a new commit. Is the key safe now? What is the real fix?</li>
</ol>
<p><strong>Solution:</strong> (1) it reports <code>missing: ["DATABASE_URL","SESSION_SECRET"]</code> and refuses to start; the banner shows <code>"DATABASE_URL":"[set]"</code>, never the connection string with its password. (2) a half-configured process fails later, deep in a request, hard to trace; a startup failure is immediate and names the cause. (3) no — the key is still in the earlier commit on every clone/fork; the real fix is to rotate the key.</p>
<p><strong>Done when:</strong> you load secrets from the environment, fail fast on a missing one, and never print a secret value in a log.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">secret</span><span class="v">A value that grants access (DB URL, signing key, session secret) and must never reach the repo.</span></div>
  <div class="kv"><span class="k">fail fast</span><span class="v">Refuse to start when a required secret is missing, with a clear message.</span></div>
  <div class="kv"><span class="k">redacted banner</span><span class="v">A startup log showing which config is set (<code>[set]</code>) without any value.</span></div>
  <div class="kv"><span class="k">Twelve-Factor config</span><span class="v">Config that varies between deploys lives in the environment, not the code.</span></div>
  <div class="kv"><span class="k">rotation</span><span class="v">Replacing a secret — the only real fix after a leak (11.2).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Secrets reach the process from the environment, never the repo (Twelve-Factor).</li>
<li>Fail fast on a missing required secret; a half-configured process fails worse, later.</li>
<li>Log a redacted banner — which config is set, never its value.</li>
<li>A committed secret is forever on every clone/fork; rotate it, do not just edit the file.</li>
<li>One source of truth per secret; design so a leak is a rotation, not a rebuild.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-1-5-bi-mat-ro-o-dau', title: 'Back to 1.5 — where secrets leak', sub: 'There, the five places a secret escapes (logs, error objects, git, bundles, env dumps) and the allow-list redactor. Here, keeping it out of the repo and the startup log in the first place. One discipline, two chapters.', cta: 'OPEN LESSON 1.5 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Bí mật: đưa chúng tới tiến trình mà không đụng vào kho mã</h2>
<p class="lead">Chương 1 tới 10 dựng dịch vụ và tấn công nó. Hai chương cuối vận hành nó. Thứ đầu tiên việc vận hành cần là bí mật — URL cơ sở dữ liệu, khoá ký, session secret — và một luật quan trọng nhất: chúng phải tới tiến trình mà không bao giờ sống trong kho mã, vì một bí mật commit một lần là trong lịch sử git vĩnh viễn.</p>

<div class="callout ok">
<p><strong>Học xong Chương 11 bạn làm được:</strong> đưa bí mật tới một tiến trình an toàn, xoay một khoá mà không đá hàng loạt, giới hạn tần suất lưu lượng trải qua nhiều instance, viết một nhật ký kiểm toán không rò gì, và định tuyến các tín hiệu giám sát qua một runbook. Lab 11 chấm nhật ký kiểm toán và runbook.</p>
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>nạp bí mật từ môi trường và hỏng nhanh khi thiếu một cái;</li>
<li>log một banner khởi động hiện cấu hình nào được đặt mà không in giá trị nào;</li>
<li>giải thích vì sao một bí mật đã commit là vĩnh viễn, và thiết kế để một vụ rò là một lần xoay.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> vụ rò nghiêm trọng phổ biến nhất không phải một khai thác tinh vi — nó là một bí mật trong một kho git. Mọi thứ bạn dựng tan biến ngay khi khoá ký nằm trong một lịch sử công khai.</p>
</div>

<h3>Môi trường, không phải mã</h3>
<p>Bí mật đến từ môi trường tiến trình chạy — <code>.env</code> của VPS, một trình quản lý bí mật — tiêm lúc khởi động, không bao giờ commit. Đây là luật Twelve-Factor: cấu hình thay đổi giữa các lần deploy (và bí mật thì luôn thay đổi) sống trong môi trường, không trong mã nguồn. Mã đọc từ <code>process.env</code> và tự giữ không gì.</p>

<h3>Hỏng nhanh khi thiếu một bí mật</h3>
<p><code>loadConfig()</code> kiểm các bí mật bắt buộc lúc <em>khởi động</em>, và một cái thiếu là một lỗi khởi động ồn ào, rõ ràng — không phải một 500 bí ẩn ba giờ sau, sâu trong một request, khi một truy vấn cuối cùng chạy:</p>
${ma('javascript', CODE.secrets)}
<p>Nó trả danh sách <code>missing</code> để người gọi từ chối khởi động. Nửa-cấu-hình tệ hơn không khởi động: một tiến trình boot mà không có <code>SESSION_SECRET</code> sẽ vui vẻ phục vụ lưu lượng tới khi phiên đầu tiên được ký, rồi hỏng theo cách khó lần ngược về nguyên nhân.</p>

<h3>Banner bạn log được</h3>
<p>Lúc khởi động bạn muốn log cấu hình nào <em>đã nạp</em>, để bắt một biến thiếu hay gõ sai — nhưng không bao giờ nó là <em>cái gì</em>. <code>redactedConfig()</code> hiện mỗi bí mật là <code>[set]</code> hay <code>[MISSING]</code>, không bao giờ giá trị của nó:</p>
${ra(OUT['111-secrets'])}
<p>Banner chứng minh cấu hình đã đủ trong một cái liếc, và không giá trị bí mật nào chạm log. (Đối lập một <code>console.log(config)</code> ngây thơ, sẽ in <code>DATABASE_URL: "postgres://labflow:s3cr3t-pw@db/labflow"</code> — mật khẩu cơ sở dữ liệu, giờ trong log của bạn.)</p>

<h3>Vì sao kho mã là vĩnh viễn</h3>
<p>Một bí mật commit một lần là trong lịch sử git trên mọi clone và fork, kể cả sau khi bạn "xoá" nó trong một commit sau — commit cũ vẫn có nó. Cách sửa thật duy nhất là <em>xoay bí mật</em>, không phải sửa tệp. Nên luật là không bao giờ để nó lọt vào: <code>.gitignore</code> cái <code>.env</code>, và quét bằng gitleaks (Chương 1) trong CI để một bí mật commit làm hỏng build trước khi nó được push.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>NEXT_PUBLIC_</code> và các vụ rò lúc build khác.</strong> Một bí mật nướng vào một bundle frontend được ship tới mọi trình duyệt — nó không còn là một bí mật. Khoá API bên thứ ba phải ở phía máy chủ, đọc từ env lúc chạy, sau một proxy có xác thực (mẫu GIPHY). "Nó ở trong một env var" là chưa đủ; nó phải là một env var <em>máy chủ</em> đọc, không bao giờ một cái biên dịch vào mã client.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bí mật đến từ đâu?"</strong> — Môi trường (tệp env của VPS, một trình quản lý bí mật), tiêm lúc khởi động; không bao giờ kho mã. Cấu hình Twelve-Factor.</li>
<li><strong>"Nếu một bí mật bắt buộc thiếu thì sao?"</strong> — Tiến trình hỏng nhanh lúc khởi động với một thông điệp rõ, thay vì chạy nửa-cấu-hình và 500 sau.</li>
<li><strong>"Một bí mật đã bị commit — giờ sao?"</strong> — Xoay nó. Nó trong lịch sử git vĩnh viễn; sửa tệp không gỡ nó khỏi các commit, clone hay fork cũ.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo11/secrets.mjs</code>. Một tiến trình với hai bí mật chưa đặt làm gì, và banner khởi động an toàn hiện chính xác cái gì cho <code>DATABASE_URL</code>?</li>
<li>Vì sao hỏng nhanh lúc khởi động tốt hơn để tiến trình boot mà không có một bí mật?</li>
<li>Một đồng đội gỡ một API key đã commit trong một commit mới. Khoá an toàn chưa? Cách sửa thật là gì?</li>
</ol>
<p><strong>Lời giải:</strong> (1) nó báo <code>missing: ["DATABASE_URL","SESSION_SECRET"]</code> và từ chối khởi động; banner hiện <code>"DATABASE_URL":"[set]"</code>, không bao giờ chuỗi kết nối với mật khẩu của nó. (2) một tiến trình nửa-cấu-hình hỏng sau, sâu trong một request, khó lần; một lỗi khởi động là tức thì và gọi tên nguyên nhân. (3) không — khoá vẫn trong commit trước trên mọi clone/fork; cách sửa thật là xoay khoá.</p>
<p><strong>Đạt khi:</strong> bạn nạp bí mật từ môi trường, hỏng nhanh khi thiếu một cái, và không bao giờ in một giá trị bí mật trong một log.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">secret (bí mật)</span><span class="v">Một giá trị cấp truy cập (URL DB, khoá ký, session secret) và không bao giờ được tới kho mã.</span></div>
  <div class="kv"><span class="k">fail fast (hỏng nhanh)</span><span class="v">Từ chối khởi động khi một bí mật bắt buộc thiếu, với một thông điệp rõ.</span></div>
  <div class="kv"><span class="k">redacted banner</span><span class="v">Một log khởi động hiện cấu hình nào được đặt (<code>[set]</code>) mà không giá trị nào.</span></div>
  <div class="kv"><span class="k">Twelve-Factor config</span><span class="v">Cấu hình thay đổi giữa các lần deploy sống trong môi trường, không trong mã.</span></div>
  <div class="kv"><span class="k">rotation (xoay)</span><span class="v">Thay một bí mật — cách sửa thật duy nhất sau một vụ rò (11.2).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Bí mật tới tiến trình từ môi trường, không bao giờ kho mã (Twelve-Factor).</li>
<li>Hỏng nhanh khi thiếu một bí mật bắt buộc; một tiến trình nửa-cấu-hình hỏng tệ hơn, sau.</li>
<li>Log một banner đã che — cấu hình nào được đặt, không bao giờ giá trị của nó.</li>
<li>Một bí mật đã commit là vĩnh viễn trên mọi clone/fork; xoay nó, đừng chỉ sửa tệp.</li>
<li>Một nguồn sự thật mỗi bí mật; thiết kế để một vụ rò là một lần xoay, không phải một lần dựng lại.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-1-5-bi-mat-ro-o-dau', title: 'Quay lại 1.5 — bí mật rò ở đâu', sub: 'Ở đó, năm chỗ một bí mật thoát ra (log, object lỗi, git, bundle, dump env) và bộ che theo allow-list. Ở đây, giữ nó khỏi kho mã và log khởi động ngay từ đầu. Một kỷ luật, hai chương.', cta: 'MỞ BÀI 1.5 →' })}
</div>
`,
};
