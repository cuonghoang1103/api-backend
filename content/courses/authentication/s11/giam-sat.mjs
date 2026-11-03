/**
 * Authentication · Chương 11 · 11.5 — Sáu tín hiệu, và cuốn runbook cho lúc một cái nổ. Slug giữ: auth-11-5-giam-sat.
 * Code THẬT từ _ma.mjs (src/ops/triage.js) + output demo11/signals.mjs (LabFlow ID v0.11).
 */
import G from '../giang/auth-11-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('📒', 'OWASP — Logging Cheat Sheet', 'Logging for detection and monitoring — the signals this runbook acts on (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html'),
  nguon('🛡️', 'OWASP — Denial of Service Cheat Sheet', 'Detecting abuse signals and responding without self-inflicted outages (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('📒', 'OWASP — Logging Cheat Sheet', 'Logging để phát hiện và giám sát — các tín hiệu runbook này hành động theo (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html'),
  nguon('🛡️', 'OWASP — Denial of Service Cheat Sheet', 'Phát hiện tín hiệu lạm dụng và phản ứng không gây sự cố cho mình (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html'),
].join('\n');

export default {
  title: '11.5 — Six signals, and the runbook for when one fires|||11.5 — Sáu tín hiệu, và cuốn runbook cho lúc một cái nổ',
  slug: 'auth-11-5-giam-sat',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Bạn không giám sát được mọi thứ, nên giám sát các tín hiệu nghĩa là một cú tấn công hay một sự cố. SÁU cái mang phần lớn giá trị cho một dịch vụ danh tính, mỗi cái là một con số với một ngưỡng (không phải cảm giác): đợt tái-dùng-refresh (token trộm phát lại — Ch5), đợt 5xx (dịch vụ hỏng), đăng nhập từ nước mới, tỷ lệ mật-khẩu-đã-lộ (dấu hiệu nhồi — Ch10), đợt đăng-nhập-sai, hành động admin. runbook định tuyến mỗi cái tới một trong BỐN: PAGE (đánh thức người ngay), INVESTIGATE (nhìn ngay, không page), AUTO (hệ thống đã phản ứng, chỉ ghi), IGNORE (ồn mong đợi). Page CHỈ cho việc-cần-người-ngay (tái-dùng, 5xx). triage() mặc định tín hiệu LẠ là INVESTIGATE (không bao giờ IGNORE — cái không lường là cái đáng xem). Page MỌI THỨ (runbook "yếu") huấn luyện người trực tắt chuông — cú tấn công mệt mỏi Ch10 trong đội. runbook có BƯỚC, không chỉ một route. Theo OWASP Logging + DoS.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>Six signals, and the runbook for when one fires</h2>
<p class="lead">You cannot watch everything, so watch the signals that mean an attack or an outage. Six carry most of the value for an identity service, and each maps to a written decision — a runbook — so the 3am response is prepared, not improvised. The hardest part is not detection; it is responding to the right things and staying quiet about the rest.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> name the six signals worth watching; route each through a runbook to page, investigate, auto or ignore; and explain why paging on everything is the real failure.</p>
</div>

<h3>The six signals</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Refresh-reuse spike</span><span class="lz-lnote">Stolen refresh tokens being replayed (Chapter 5) — an active session-theft campaign.</span></div>
  <div class="lz-layer"><span class="lz-lname">5xx spike</span><span class="lz-lnote">The service itself is failing — logins are down.</span></div>
  <div class="lz-layer"><span class="lz-lname">New-country logins</span><span class="lz-lnote">Logins from a new location — travel, or the start of a takeover.</span></div>
  <div class="lz-layer"><span class="lz-lname">Breached-password rate</span><span class="lz-lnote">Users submitting known-breached passwords — a stuffing tell (Chapter 10).</span></div>
  <div class="lz-layer"><span class="lz-lname">Failed-login burst</span><span class="lz-lnote">A burst of failures — the stuffing defence already throttled it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Admin actions</span><span class="lz-lnote">An administrator changed something — expected, recorded, reviewed.</span></div>
</div>
<p>Each is a measurable number with a threshold, not a vibe — "refresh-reuse events per minute over X", not "something feels off".</p>

<h3>Four actions, and the runbook</h3>
<p>The runbook routes each signal to one of four actions. It is one small function:</p>
${ma('javascript', CODE.triage)}
${ra(OUT['115-signals'])}
<p>Reuse-spike and 5xx-spike <strong>page</strong> — they need a human this minute. New-country and breached-rate <strong>investigate</strong> — look now, but do not wake anyone. Failed-login-burst and admin-action are <strong>auto</strong> — the stuffing defence (Chapter 10) and the audit log already handled them, so just record. Most signals are not a page.</p>

<h3>An unknown signal is not ignored</h3>
<p>Notice <code>triage()</code> defaults an unknown signal to <code>investigate</code>, never <code>ignore</code>. A new signal nobody has classified yet gets a human look, not silence — because the one you did not plan for is exactly the one worth seeing. Fail toward attention. (A nameless signal — a bug in the signal pipeline itself — is the only thing that is ignored.)</p>

<h3>Alert fatigue is the enemy</h3>
<p>The "yeu" runbook pages on everything. Within a week the on-call silences the pager, and the one real alert is lost in the noise. This is the Chapter 10 fatigue attack — now aimed at your own team, and self-inflicted. Page rarely, so that a page always means something; everything else is investigate or auto. A runbook that pages on routine admin actions is as broken as one that ignores token reuse.</p>

<h3>The runbook has steps, not just a route</h3>
<p>Beyond "page or not", each signal's runbook entry says what to <em>do</em>: for refresh-reuse, revoke the token family and force re-auth (Chapter 5); for a 5xx spike, check the database and the key rotation (11.2); for new-country logins, confirm with the user and offer to revoke sessions (Chapter 5's device list). The decision function routes; the written runbook guides the response. And every signal is an earlier chapter seen from operations — running it well is knowing which defence each signal is telling you about.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — monitoring without a response plan.</strong> A dashboard full of graphs nobody is paged on is theatre; an alert with no written next step produces a panicked, improvised 3am. The value is the <em>runbook</em> — the decision (page/investigate/auto) and the steps — decided in daylight, not the dashboard. If a signal has no runbook entry, it is not yet being monitored, only displayed.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"What do you monitor on an auth service?"</strong> — Refresh-reuse, 5xx rate, new-country logins, breached-password rate, failed-login bursts, admin actions — each with a threshold and a runbook action.</li>
<li><strong>"What should you page on?"</strong> — Only a human-now: active token theft (reuse spike) and the service being down (5xx spike). Page on everything and the team goes deaf.</li>
<li><strong>"What does an unknown or new signal do?"</strong> — Investigate by default, never ignore — the unplanned one is the one worth seeing.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Run <code>node demo11/signals.mjs</code>. Which two signals page, and why those two specifically?</li>
<li>Why does a failed-login burst route to <code>auto</code> rather than <code>page</code>?</li>
<li>Why does an unknown signal default to <code>investigate</code> and not <code>ignore</code>?</li>
</ol>
<p><strong>Solution:</strong> (1) refresh-reuse spike and 5xx spike — they both need a human this minute: an active session-theft campaign and the service being down. (2) the Chapter 10 stuffing defence already throttled the burst; the on-call does not need to wake up for something the system handled — just record it. (3) a signal nobody classified yet might be the attack you did not plan for; sending it to a human look, not silence, fails toward attention.</p>
<p><strong>Done when:</strong> you can route each signal to the right action, page only for a human-now, and send the unknown to investigate.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">signal</span><span class="v">A measurable number with a threshold that means attack or outage.</span></div>
  <div class="kv"><span class="k">runbook</span><span class="v">The written decision and steps for when a signal fires.</span></div>
  <div class="kv"><span class="k">page / investigate / auto / ignore</span><span class="v">The four actions a signal routes to.</span></div>
  <div class="kv"><span class="k">alert fatigue</span><span class="v">Paging so often the on-call tunes it out — the 10.4 attack on your team.</span></div>
  <div class="kv"><span class="k">fail toward attention</span><span class="v">Default an unknown signal to investigate, never ignore.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Watch six signals, each a number with a threshold, not a vibe.</li>
<li>Route each through the runbook to page / investigate / auto / ignore.</li>
<li>Page only for a human-now (reuse spike, 5xx spike); most signals are not a page.</li>
<li>Default the unknown to investigate, never ignore; a nameless signal is ignored.</li>
<li>Never page on everything, or the team goes deaf — the 10.4 fatigue attack, self-inflicted.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-5-2-xoay-vong', title: 'Back to 5.2 — refresh reuse, the signal behind the page', sub: 'There, detecting a replayed refresh token and revoking its family. Here, a spike of exactly that detection is the one signal that pages the on-call. The defence of 5.2 becomes the top alarm of operations. One mechanism, two chapters.', cta: 'OPEN LESSON 5.2 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Sáu tín hiệu, và cuốn runbook cho lúc một cái nổ</h2>
<p class="lead">Bạn không giám sát được mọi thứ, nên giám sát các tín hiệu nghĩa là một cú tấn công hay một sự cố. Sáu cái mang phần lớn giá trị cho một dịch vụ danh tính, và mỗi cái ánh xạ tới một quyết định viết sẵn — một runbook — để phản ứng lúc 3h sáng được chuẩn bị, không ứng biến. Phần khó nhất không phải phát hiện; nó là phản ứng với đúng thứ và giữ im lặng về phần còn lại.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> gọi tên sáu tín hiệu đáng giám sát; định tuyến mỗi cái qua một runbook tới page, investigate, auto hay ignore; và giải thích vì sao page mọi thứ mới là thất bại thật.</p>
</div>

<h3>Sáu tín hiệu</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đợt tái-dùng-refresh</span><span class="lz-lnote">Token refresh bị trộm đang phát lại (Chương 5) — một chiến dịch cắp-phiên đang diễn ra.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đợt 5xx</span><span class="lz-lnote">Dịch vụ tự nó đang hỏng — đăng nhập đang chết.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đăng nhập từ nước mới</span><span class="lz-lnote">Đăng nhập từ một vị trí mới — du lịch, hoặc khởi đầu một cú chiếm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tỷ lệ mật-khẩu-đã-lộ</span><span class="lz-lnote">Người dùng gửi mật khẩu đã-biết-lộ — một dấu hiệu nhồi (Chương 10).</span></div>
  <div class="lz-layer"><span class="lz-lname">Đợt đăng-nhập-sai</span><span class="lz-lnote">Một đợt sai — phòng thủ nhồi đã kìm nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hành động admin</span><span class="lz-lnote">Một admin đổi cái gì đó — mong đợi, ghi lại, soát.</span></div>
</div>
<p>Mỗi cái là một con số đo được với một ngưỡng, không phải một cảm giác — "sự kiện tái-dùng-refresh mỗi phút trên X", không phải "có cái gì không ổn".</p>

<h3>Bốn hành động, và runbook</h3>
<p>Runbook định tuyến mỗi tín hiệu tới một trong bốn hành động. Nó là một hàm nhỏ:</p>
${ma('javascript', CODE.triage)}
${ra(OUT['115-signals'])}
<p>Đợt tái-dùng và đợt 5xx <strong>page</strong> — chúng cần một con người ngay phút này. Nước-mới và tỷ-lệ-đã-lộ <strong>investigate</strong> — nhìn ngay, nhưng không đánh thức ai. Đợt đăng-nhập-sai và hành-động-admin là <strong>auto</strong> — phòng thủ nhồi (Chương 10) và nhật ký kiểm toán đã xử lý, nên chỉ ghi. Phần lớn tín hiệu không phải một page.</p>

<h3>Một tín hiệu lạ không bị bỏ qua</h3>
<p>Chú ý <code>triage()</code> mặc định một tín hiệu lạ là <code>investigate</code>, không bao giờ <code>ignore</code>. Một tín hiệu mới chưa ai phân loại nhận một cái nhìn của con người, không phải sự im lặng — vì cái bạn không lường trước đúng là cái đáng xem. Hỏng về phía chú ý. (Một tín hiệu không tên — một lỗi trong chính đường ống tín hiệu — là thứ duy nhất bị bỏ qua.)</p>

<h3>Mệt mỏi cảnh báo là kẻ thù</h3>
<p>Runbook "yếu" page mọi thứ. Trong một tuần người trực tắt chuông, và cái cảnh báo thật duy nhất lạc trong tiếng ồn. Đây là cú tấn công mệt mỏi Chương 10 — giờ nhắm vào chính đội bạn, và tự gây. Page hiếm, để một page luôn nghĩa là có chuyện; mọi thứ khác là investigate hay auto. Một runbook page các hành động admin thường lệ thì hỏng y như một cái bỏ qua việc tái dùng token.</p>

<h3>Runbook có bước, không chỉ một route</h3>
<p>Ngoài "page hay không", mục runbook của mỗi tín hiệu nói LÀM GÌ: với tái-dùng-refresh, thu hồi họ token và buộc xác thực lại (Chương 5); với một đợt 5xx, kiểm cơ sở dữ liệu và việc xoay khoá (11.2); với đăng nhập nước mới, xác nhận với người dùng và mời thu hồi phiên (danh sách thiết bị Chương 5). Hàm quyết định định tuyến; runbook viết hướng dẫn phản ứng. Và mỗi tín hiệu là một chương trước nhìn từ vận hành — vận hành tốt là biết mỗi tín hiệu đang nói với bạn về phòng thủ nào.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — giám sát không có kế hoạch phản ứng.</strong> Một dashboard đầy đồ thị không ai bị page là kịch; một cảnh báo không có bước-tiếp viết sẵn tạo ra một 3h sáng hoảng loạn, ứng biến. Giá trị là <em>runbook</em> — quyết định (page/investigate/auto) và các bước — quyết lúc ban ngày, không phải cái dashboard. Nếu một tín hiệu không có mục runbook, nó chưa được giám sát, chỉ được hiển thị.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Bạn giám sát gì trên một dịch vụ xác thực?"</strong> — Tái-dùng-refresh, tỷ lệ 5xx, đăng nhập nước mới, tỷ lệ mật-khẩu-đã-lộ, đợt đăng-nhập-sai, hành động admin — mỗi cái một ngưỡng và một hành động runbook.</li>
<li><strong>"Bạn nên page cái gì?"</strong> — Chỉ việc-cần-người-ngay: trộm token đang diễn ra (đợt tái-dùng) và dịch vụ đang chết (đợt 5xx). Page mọi thứ thì đội điếc.</li>
<li><strong>"Một tín hiệu lạ hay mới làm gì?"</strong> — Investigate mặc định, không bao giờ ignore — cái không lường là cái đáng xem.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Chạy <code>node demo11/signals.mjs</code>. Hai tín hiệu nào page, và vì sao đúng hai cái đó?</li>
<li>Vì sao một đợt đăng-nhập-sai định tuyến tới <code>auto</code> thay vì <code>page</code>?</li>
<li>Vì sao một tín hiệu lạ mặc định là <code>investigate</code> và không <code>ignore</code>?</li>
</ol>
<p><strong>Lời giải:</strong> (1) đợt tái-dùng-refresh và đợt 5xx — cả hai cần một con người ngay phút này: một chiến dịch cắp-phiên đang diễn ra và dịch vụ đang chết. (2) phòng thủ nhồi Chương 10 đã kìm đợt đó; người trực không cần thức dậy vì cái hệ thống đã xử lý — chỉ ghi nó. (3) một tín hiệu chưa ai phân loại có thể là cú tấn công bạn không lường; đưa nó tới một cái nhìn của con người, không phải sự im lặng, hỏng về phía chú ý.</p>
<p><strong>Đạt khi:</strong> bạn định tuyến được mỗi tín hiệu tới đúng hành động, page chỉ cho việc-cần-người-ngay, và đưa cái lạ tới investigate.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">signal (tín hiệu)</span><span class="v">Một con số đo được với một ngưỡng, nghĩa là tấn công hay sự cố.</span></div>
  <div class="kv"><span class="k">runbook</span><span class="v">Quyết định và các bước viết sẵn cho lúc một tín hiệu nổ.</span></div>
  <div class="kv"><span class="k">page / investigate / auto / ignore</span><span class="v">Bốn hành động một tín hiệu định tuyến tới.</span></div>
  <div class="kv"><span class="k">alert fatigue (mệt mỏi cảnh báo)</span><span class="v">Page nhiều tới mức người trực lờ đi — cú tấn công 10.4 vào đội bạn.</span></div>
  <div class="kv"><span class="k">fail toward attention</span><span class="v">Mặc định một tín hiệu lạ là investigate, không bao giờ ignore.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Giám sát sáu tín hiệu, mỗi cái một con số với một ngưỡng, không phải một cảm giác.</li>
<li>Định tuyến mỗi cái qua runbook tới page / investigate / auto / ignore.</li>
<li>Page chỉ cho một việc-cần-người-ngay (đợt tái-dùng, đợt 5xx); phần lớn tín hiệu không phải một page.</li>
<li>Mặc định cái lạ là investigate, không bao giờ ignore; một tín hiệu không tên thì bị bỏ qua.</li>
<li>Không bao giờ page mọi thứ, nếu không đội điếc — cú tấn công mệt mỏi 10.4, tự gây.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-5-2-xoay-vong', title: 'Quay lại 5.2 — tái dùng refresh, tín hiệu sau cái page', sub: 'Ở đó, phát hiện một token refresh phát lại và thu hồi họ của nó. Ở đây, một đợt của đúng cái phát hiện đó là tín hiệu duy nhất page người trực. Phòng thủ của 5.2 thành báo động hàng đầu của vận hành. Một cơ chế, hai chương.', cta: 'MỞ BÀI 5.2 →' })}
</div>
`,
};
