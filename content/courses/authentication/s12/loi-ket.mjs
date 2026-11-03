/**
 * Authentication · Chương 12 · 12.5 — Nên dựng cái gì trước, và điều gì đã THẬT SỰ thay đổi. Slug giữ: auth-12-5-loi-ket. Bài kết khoá.
 * Dùng output cuối khoá (bản tham khảo 100/100) làm minh hoạ "cả khoá, chạy như một kẻ thù".
 */
import G from '../giang/auth-12-5.mjs';
import { ra, lienKet, nguon } from '../_slides.mjs';
import { OUT } from './_ma.mjs';

const NGUON_EN = [
  nguon('🔐', 'OWASP — Authentication Cheat Sheet', 'The current consensus on building auth — prefer vetted libraries and passkeys (read 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('📏', 'NIST SP 800-63B — Digital Identity Guidelines', 'Where authenticator assurance is heading — phishing resistance first (read 04/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
].join('\n');
const NGUON_VI = [
  nguon('🔐', 'OWASP — Authentication Cheat Sheet', 'Đồng thuận hiện tại về dựng xác thực — ưu tiên thư viện đã kiểm và passkey (đọc 04/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'),
  nguon('📏', 'NIST SP 800-63B — Hướng dẫn danh tính số', 'Nơi mức bảo đảm authenticator đang hướng tới — kháng lừa đảo trước tiên (đọc 04/11/2026).', 'https://pages.nist.gov/800-63-4/sp800-63b.html'),
].join('\n');

export default {
  title: '12.5 — What to build first, and what actually changed|||12.5 — Nên dựng cái gì trước, và điều gì đã THẬT SỰ thay đổi',
  slug: 'auth-12-5-loi-ket',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Bài kết: mười hai chương dựng một dịch vụ danh tính từ một mật khẩu tới production. Câu trả lời thật đầu tiên: với phần lớn hệ thống, ĐỪNG tự cuộn xác thực — dùng một thư viện/provider đã kiểm; khoá này dạy cách nó chạy để bạn CHỌN, CẤU HÌNH, DEBUG đúng, không phải ship mật mã của mình. Khi dựng: băm + phiên trước (Ch2–3), token nếu cần (4–5), vòng đời (6), MFA (7), liên kết (8); PHÂN QUYỀN TỪ NGÀY ĐẦU (9) — thêm sau là một lần viết lại. Điều THẬT SỰ đổi: passkey (kháng lừa đảo — gỡ mật khẩu + relay cùng lúc, cải thiện lớn nhất một thập kỷ) và tấn công TỰ ĐỘNG ở quy mô (nhồi/AiTM/fatigue bán như dịch vụ). Các HẰNG SỐ không đổi: băm chậm có muối, không tin đầu vào kể cả token đã giải, từ-chối-mặc-định, bí mật khỏi kho, một thông điệp mọi tài khoản, đo đừng đoán. Dự án cuối LabFlow ID v1.0 = cả khoá chấm bởi ~12 tấn công (tham khảo 100/100). Kể theo STAR cho CV. Theo OWASP Authentication + NIST SP 800-63B.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>What to build first, and what actually changed</h2>
<p class="lead">Twelve chapters built an identity service from a single password to a production system under attack. The closing lesson steps back: if you start a new system tomorrow, what do you build first, in what order — and what has genuinely changed about authentication that you need to know, versus what has held constant since the first chapter.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong> decide when to build auth versus adopt it; order the pieces so authorization is never an afterthought; and name what changed (passkeys, automated attacks) and what did not (the primitives).</p>
</div>

<h3>Do not build it from scratch</h3>
<p>The first honest answer: for most systems, do not hand-roll authentication — use a vetted library or an identity provider. This course taught you how it works so that you can <em>choose</em>, <em>configure</em> and <em>debug</em> one correctly, not so that you ship your own crypto. Understanding is the goal; reimplementation rarely is. The teams who get breached are usually the ones who rolled their own without understanding the attacks — which is exactly what the previous eleven chapters were about.</p>

<h3>The order that matters</h3>
<p>When you do build or assemble: passwords hashed correctly and sessions first (Chapters 2–3), then tokens if you need them (4–5), then the account lifecycle (6), then MFA (7), then federation if the product needs it (8). And <strong>authorization from day one</strong> (Chapter 9), not bolted on later. The single most expensive mistake is adding the gate last: retrofitting deny-by-default onto a system that fell open is a rewrite, not a patch.</p>

<h3>What actually changed</h3>
<p>Two things genuinely shifted the ground. <strong>Passkeys</strong> (Chapter 7) are phishing-resistant by construction: they remove the password and defeat the AiTM relay (Chapter 10) at once — the single biggest improvement to real-world auth in a decade. Offer them, default to them where you can; the password is the legacy, not the plan. And <strong>the attacks are automated now</strong> (Chapter 10): credential stuffing, AiTM kits and MFA-fatigue are sold as services and run at volume. Defence is no longer "a strong password" — it is breached-password blocking, origin-bound factors, and rate limits that survive a fleet.</p>

<h3>What did not change</h3>
<p>The primitives of Chapter 1 still hold: hash passwords with a slow, salted function; never trust input, including a decoded token; deny by default; keep secrets out of the repo; one message for every account; measure, do not guess. The tools got better and the attackers got faster, but the foundations are the same ones you built on in the first week.</p>

<h3>The capstone: the whole course, under attack</h3>
<p>The final project is LabFlow ID v1.0 — everything wired together and graded by roughly twelve real attack scenarios, one per chapter. The reference, with every decision wired to the hardened module, resists all of them:</p>
${ra(OUT['cuoi-tham-khao'])}
<p>A weak build scores low on the attacks it misses; the reference scores 100. It is the course, run end to end the way an adversary would — and passing it means you can build it, break it, and fix it.</p>

<div class="pitfall co-tieu-de">
<p><strong>Trap — treating "I built it once" as "I should always build it".</strong> Building LabFlow ID taught you the mechanisms; it did not make hand-rolled auth the right default for production. The lesson of building your own is to respect how much a good library or provider is doing for you — and to be the person on the team who can configure and debug it correctly, because you have seen every attack it defends.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>"Should we build our own auth?"</strong> — Usually no — adopt a vetted library/provider; build the understanding to choose and operate it well. Hand-rolled crypto is where breaches live.</li>
<li><strong>"What is the biggest change in auth recently?"</strong> — Passkeys: phishing-resistant credentials that remove the password and the relay at once; and the industrialisation of attacks (stuffing, AiTM).</li>
<li><strong>"What do you order first when building auth?"</strong> — Hashing and sessions, then tokens, then lifecycle and MFA — with authorization from day one, never retrofitted.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>A new product needs login next sprint. What is your default recommendation, and what does this course let you do that someone without it cannot?</li>
<li>Name one thing that genuinely changed about authentication and one that did not.</li>
<li>Run <code>node scripts/cham-cuoi-khoa.mjs sub-cuoi/tham-khao</code>. For any three scenarios, name the attack each defends against.</li>
</ol>
<p><strong>Solution:</strong> (1) adopt a vetted library or provider; the course lets you choose, configure and debug it correctly — and recognise when its defaults are unsafe — because you have seen every attack it defends. (2) changed: passkeys (phishing resistance) and automated attacks at scale; unchanged: slow salted hashing, deny-by-default, never trusting input, secrets out of the repo. (3) e.g. alg:none → token forgery (Ch4), IDOR cross-tenant → broken access control (Ch9), audit-log leak → a logged secret becoming a second breach (Ch11).</p>
<p><strong>Done when:</strong> you can justify building vs adopting, order the pieces with authorization first, and explain each capstone defence by its attack.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">build vs adopt</span><span class="v">Understand auth to choose and operate a vetted one — rarely to ship your own crypto.</span></div>
  <div class="kv"><span class="k">authorization from day one</span><span class="v">Build the one gate before features; retrofitting it is a rewrite.</span></div>
  <div class="kv"><span class="k">phishing resistance</span><span class="v">Passkeys — the biggest real change; the password is the legacy.</span></div>
  <div class="kv"><span class="k">industrialised attacks</span><span class="v">Stuffing, AiTM, MFA-fatigue sold as services, run at volume.</span></div>
  <div class="kv"><span class="k">the constants</span><span class="v">Slow salted hashing, deny-by-default, never trust input, secrets out of the repo.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Do not hand-roll auth for production — understand it to choose, configure and debug one.</li>
<li>Build in order, with authorization from day one, never bolted on later.</li>
<li>What changed: passkeys (phishing resistance) and automated attacks at scale.</li>
<li>What did not: the Chapter 1 primitives — slow salted hashing, deny by default, never trust input, measure.</li>
<li>The capstone is the whole course under attack; passing it means you can build it, break it, and fix it.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'authentication', bai: 'auth-7-4-passkey', title: 'Back to 7.4 — passkeys, the thing that changed', sub: 'There, building a passkey and proving it resists a wrong-origin assertion. Here, why that property is the single biggest shift in real-world authentication — the password is the legacy you now know how to replace.', cta: 'OPEN LESSON 7.4 →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Nên dựng cái gì trước, và điều gì đã THẬT SỰ thay đổi</h2>
<p class="lead">Mười hai chương dựng một dịch vụ danh tính từ một mật khẩu đơn lẻ tới một hệ thống production dưới tấn công. Bài kết lùi lại: nếu bạn bắt đầu một hệ mới ngày mai, bạn dựng cái gì trước, theo thứ tự nào — và điều gì đã thật sự thay đổi về xác thực mà bạn cần biết, so với cái đã giữ hằng từ chương đầu.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong> quyết định khi nào dựng xác thực so với dùng nó; xếp các mảnh để phân quyền không bao giờ là một thứ nghĩ sau; và gọi tên cái đã đổi (passkey, tấn công tự động) và cái không (các nguyên thuỷ).</p>
</div>

<h3>Đừng tự dựng từ đầu</h3>
<p>Câu trả lời thật đầu tiên: với phần lớn hệ thống, đừng tự cuộn xác thực — dùng một thư viện đã kiểm hay một nhà cung cấp danh tính. Khoá này dạy bạn cách nó chạy để bạn <em>chọn</em>, <em>cấu hình</em> và <em>debug</em> một cái đúng, không phải để bạn ship mật mã của mình. Hiểu là mục tiêu; viết lại hiếm khi là. Các đội bị thủng thường là những đội tự cuộn mà không hiểu các cú tấn công — đúng là cái mười một chương trước nói về.</p>

<h3>Thứ tự quan trọng</h3>
<p>Khi bạn dựng hay lắp: mật khẩu băm đúng và phiên trước (Chương 2–3), rồi token nếu cần (4–5), rồi vòng đời tài khoản (6), rồi MFA (7), rồi liên kết nếu sản phẩm cần (8). Và <strong>phân quyền từ ngày đầu</strong> (Chương 9), không gắn thêm sau. Lỗi tốn kém nhất là thêm cổng sau cùng: trang bị lại từ-chối-mặc-định cho một hệ đã rơi-về-mở là một lần viết lại, không phải một bản vá.</p>

<h3>Điều thật sự thay đổi</h3>
<p>Hai thứ thật sự dịch chuyển nền. <strong>Passkey</strong> (Chương 7) kháng lừa đảo theo cấu trúc: chúng gỡ bỏ mật khẩu và đánh bại relay AiTM (Chương 10) cùng lúc — cải thiện lớn nhất cho xác thực thực tế trong một thập kỷ. Mời chúng, mặc định chúng khi có thể; mật khẩu là di sản, không phải kế hoạch. Và <strong>các cú tấn công tự động rồi</strong> (Chương 10): nhồi tín vật, bộ AiTM và mệt-mỏi-MFA được bán như dịch vụ và chạy ở quy mô lớn. Phòng thủ không còn là "một mật khẩu mạnh" — nó là chặn mật-khẩu-đã-lộ, yếu tố gắn-origin, và giới hạn tần suất sống nổi với một cụm.</p>

<h3>Điều không đổi</h3>
<p>Các nguyên thuỷ của Chương 1 vẫn giữ: băm mật khẩu bằng một hàm chậm, có muối; không bao giờ tin đầu vào, kể cả một token đã giải; từ chối mặc định; giữ bí mật khỏi kho mã; một thông điệp cho mọi tài khoản; đo, đừng đoán. Công cụ tốt hơn và kẻ tấn công nhanh hơn, nhưng các nền tảng là cùng những cái bạn dựng lên trong tuần đầu.</p>

<h3>Dự án cuối: cả khoá, dưới tấn công</h3>
<p>Dự án cuối là LabFlow ID v1.0 — mọi thứ nối lại và chấm bởi khoảng mười hai kịch bản tấn công thật, mỗi cái một chương. Bản tham khảo, với mọi quyết định nối tới module đã cứng, kháng tất cả:</p>
${ra(OUT['cuoi-tham-khao'])}
<p>Một build yếu đạt thấp ở các cú tấn công nó bỏ sót; bản tham khảo đạt 100. Nó là cả khoá, chạy từ đầu tới cuối như một kẻ thù sẽ làm — và qua nó nghĩa là bạn dựng được, phá được, và sửa được.</p>

<div class="pitfall co-tieu-de">
<p><strong>Bẫy — coi "tôi đã dựng một lần" là "tôi nên luôn dựng".</strong> Dựng LabFlow ID dạy bạn các cơ chế; nó không làm xác thực tự-cuộn thành mặc định đúng cho production. Bài học của việc tự dựng là tôn trọng một thư viện hay nhà cung cấp tốt đang làm bao nhiêu cho bạn — và làm người trong đội cấu hình và debug nó đúng được, vì bạn đã thấy mọi cú tấn công nó phòng.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Chúng ta nên tự dựng xác thực không?"</strong> — Thường không — dùng một thư viện/nhà cung cấp đã kiểm; dựng sự hiểu để chọn và vận hành nó tốt. Mật mã tự-cuộn là nơi các vụ thủng sống.</li>
<li><strong>"Thay đổi lớn nhất về xác thực gần đây là gì?"</strong> — Passkey: tín vật kháng lừa đảo gỡ mật khẩu và relay cùng lúc; và sự công-nghiệp-hoá các cú tấn công (nhồi, AiTM).</li>
<li><strong>"Bạn xếp cái gì trước khi dựng xác thực?"</strong> — Băm và phiên, rồi token, rồi vòng đời và MFA — với phân quyền từ ngày đầu, không bao giờ trang bị lại.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Một sản phẩm mới cần đăng nhập sprint tới. Khuyến nghị mặc định của bạn là gì, và khoá này cho bạn làm được gì mà người không có nó không?</li>
<li>Gọi tên một thứ thật sự đổi về xác thực và một thứ không.</li>
<li>Chạy <code>node scripts/cham-cuoi-khoa.mjs sub-cuoi/tham-khao</code>. Với ba kịch bản bất kỳ, gọi tên cú tấn công mỗi cái phòng.</li>
</ol>
<p><strong>Lời giải:</strong> (1) dùng một thư viện hay nhà cung cấp đã kiểm; khoá cho bạn chọn, cấu hình và debug nó đúng — và nhận ra khi mặc định của nó không an toàn — vì bạn đã thấy mọi cú tấn công nó phòng. (2) đổi: passkey (kháng lừa đảo) và tấn công tự động ở quy mô; không đổi: băm chậm có muối, từ-chối-mặc-định, không tin đầu vào, bí mật khỏi kho. (3) vd alg:none → giả token (Ch4), IDOR khác tenant → kiểm soát truy cập hỏng (Ch9), rò nhật ký → một bí mật bị log thành vụ rò thứ hai (Ch11).</p>
<p><strong>Đạt khi:</strong> bạn biện minh được dựng so với dùng, xếp các mảnh với phân quyền trước, và giải thích được mỗi phòng thủ cuối khoá bằng cú tấn công của nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">build vs adopt (dựng so với dùng)</span><span class="v">Hiểu xác thực để chọn và vận hành một cái đã kiểm — hiếm khi để ship mật mã của mình.</span></div>
  <div class="kv"><span class="k">phân quyền từ ngày đầu</span><span class="v">Dựng một cổng trước các tính năng; trang bị lại nó là một lần viết lại.</span></div>
  <div class="kv"><span class="k">phishing resistance (kháng lừa đảo)</span><span class="v">Passkey — thay đổi thật lớn nhất; mật khẩu là di sản.</span></div>
  <div class="kv"><span class="k">tấn công công-nghiệp-hoá</span><span class="v">Nhồi, AiTM, mệt-mỏi-MFA bán như dịch vụ, chạy ở quy mô lớn.</span></div>
  <div class="kv"><span class="k">các hằng số</span><span class="v">Băm chậm có muối, từ-chối-mặc-định, không tin đầu vào, bí mật khỏi kho.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đừng tự cuộn xác thực cho production — hiểu nó để chọn, cấu hình và debug một cái.</li>
<li>Dựng theo thứ tự, với phân quyền từ ngày đầu, không bao giờ gắn thêm sau.</li>
<li>Cái đã đổi: passkey (kháng lừa đảo) và tấn công tự động ở quy mô.</li>
<li>Cái không đổi: các nguyên thuỷ Chương 1 — băm chậm có muối, từ chối mặc định, không tin đầu vào, đo.</li>
<li>Dự án cuối là cả khoá dưới tấn công; qua nó nghĩa là bạn dựng được, phá được, và sửa được.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'authentication', bai: 'auth-7-4-passkey', title: 'Quay lại 7.4 — passkey, thứ đã thay đổi', sub: 'Ở đó, dựng một passkey và chứng minh nó kháng một assertion sai origin. Ở đây, vì sao tính chất đó là dịch chuyển lớn nhất trong xác thực thực tế — mật khẩu là di sản bạn giờ biết cách thay.', cta: 'MỞ BÀI 7.4 →' })}
</div>
`,
};
