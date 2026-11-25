/**
 * 4.2 — Tài khoản và đặc quyền (soạn 24/11/2026, agent lgz). Output thật: OUT['s04/tai-khoan'].
 * Số tất định: hidden-user-4720.evtx 17:03:24.224 1102 → CreateHiddenAccount -u 3teamssixf -p Passw0rd → 4728/4720/4722/4738/4724/4732 → 4733/4729/4726 → regedit /s → 4738 (17:03:25.035);
 * UAC 0x0→0x15 (%%2080 %%2082 %%2084), 0x15→0x210 (%%2048 %%2050 %%2089); pwnever 0x10→0x210 (%%2089) rồi 0x210→0x10 (%%2057) cách 2 s; user-4720-4726 05:10:08→05:11:26;
 * admin-4732 Users 05:12:58 → Administrators 05:14:30 → Backup Operators 05:14:44; dirty: 75 sự kiện tài khoản ngày 2018-07-28 (cài Windows), 4672 SYSTEM 2314 / Administrator 35; 4740+4767 = 0 trong bộ mẫu.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '4.2 — Accounts and privileges: 4672, 4720, 4722, 4725, 4726, 4732, 4738, 4740, 4767|||4.2 — Tài khoản và đặc quyền: 4672, 4720, 4722, 4725, 4726, 4732, 4738, 4740, 4767',
  slug: 'log-4-2-tai-khoan-dac-quyen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vòng đời một tài khoản trong log Security: tạo, bật, đặt mật khẩu, đổi cờ, thêm vào nhóm, khoá, mở khoá, xoá; đọc cờ UserAccountControl %%20xx; 4672 đặc quyền đặc biệt — bình thường với quản trị, bất thường với người thường; 4740 khoá tài khoản và cách tìm máy gây khoá. Mổ log thật của công cụ tạo tài khoản ẩn (tài khoản đuôi $ vào Administrators rồi "biến mất"), và phân biệt với lúc cài Windows.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>The account's life story, written by the Security log</h2>
<p class="lead">Attackers who get in want to <em>stay</em> in and to be <em>admin</em>. The two cheapest ways on Windows are to create a new account and to add an account to Administrators. Both leave events — 4720 and 4732 — and a handful of neighbours (4722, 4724, 4738, 4726, 4672) tell the rest of the story. This lesson reads them on a real attack sample and on a normal Windows installation, so you learn what "normal" looks like before calling anything suspicious.</p>

<h3>The everyday picture: HR and the badge office</h3>
<p>HR hires (4720), activates the badge (4722), sets the PIN (4724), changes the job title (4738), gives access to the server room (4732), suspends (4725), fires (4726). Security locks a badge after too many wrong PINs (4740) and unlocks it on request (4767). And every morning the guard notes who walked in with a master key (4672).</p>

${kv([
  ['4720 / 4726', 'User account created / deleted.'],
  ['4722 / 4725', 'Account enabled / disabled.'],
  ['4723 / 4724', 'User changed own password / someone reset a password.'],
  ['4738', 'Account changed (flags, password-never-expires, name…).'],
  ['4781', 'Account renamed.'],
  ['4740 / 4767', 'Account locked out / unlocked.'],
  ['4732 / 4733', 'Member added / removed — local group (Administrators, Remote Desktop Users…).'],
  ['4728 / 4729, 4756', 'Member added / removed — domain global group; 4756 universal group.'],
  ['4731, 4798', 'Local group created; a user’s local group membership was enumerated.'],
  ['4672', 'Special privileges assigned to a new logon (admin-equivalent rights).'],
])}

<h3>Step 1 — a real attack: a hidden admin account in one second</h3>
<p>Public sample <code>hidden-user-4720.evtx</code> (EVTX-to-MITRE-Attack): an attacker who already has an admin account (<code>admmig</code>) runs a tool called CreateHiddenAccount on a file server.</p>
${lenh('s04/tai-khoan', 0)}
<p>Read it line by line:</p>
<ol>
<li><strong>17:03:24.224 — 1102</strong>: the Security log is cleared first (Lesson 4.3). Everything before this moment is gone; this event is the first one in the new log.</li>
<li><strong>4688</strong>: the tool runs, and its <em>command line contains the password</em> (<code>-p Passw0rd</code>). Process-creation logging captures passwords typed on command lines — good for investigators, and a reason why command-line logs are sensitive data (Chapter 16).</li>
<li><strong>4720 → 4722 → 4738 → 4724 → 4732</strong> within 3 ms: account <code>3teamssixf$</code> created, enabled, flags changed, password set, added to <strong>Administrators</strong>. The trailing <code>$</code> makes it look like a computer account and hides it from <code>net user</code>.</li>
<li><strong>4733 → 4729 → 4726</strong>: removed from the groups and <em>deleted</em>, then <strong>regedit /s</strong> imports a .reg file and one last <strong>4738</strong> appears. The tool saved the account's registry data, deleted the account, and wrote the data back: the account works but no longer shows in the user list. The only traces are these events — which is why they must leave the machine quickly (Lesson 4.3).</li>
</ol>

<h3>Step 2 — reading UserAccountControl (%%20xx)</h3>
${lenh('s04/tai-khoan', 1)}
${lenh('s04/tai-khoan', 2)}
<p><code>OldUacValue</code>/<code>NewUacValue</code> are bit masks; <code>UserAccountControl</code> lists what changed as message numbers. Microsoft's own example on the 4738 page (0x15 → 0x211 shown as <code>%%2050 %%2089</code>) gives the rule: <strong>%%(2048 + n)</strong> = bit n turned <em>off</em>, <strong>%%(2080 + n)</strong> = bit n turned <em>on</em>. Bit 0 = "Account Disabled", bit 2 = "Password Not Required", bit 4 = "Normal Account", bit 9 = "Don't Expire Password". So:</p>
<ul>
<li>New account <code>0x15</code> = disabled + password not required + normal (<code>%%2080 %%2082 %%2084</code>) — every new account starts like this before the next steps.</li>
<li><code>0x15 → 0x210</code> = enabled (%%2048), password now required (%%2050), <strong>password never expires</strong> (%%2089).</li>
<li>Sample <code>pwnever-4738.evtx</code>: <code>hack1</code> gets "password never expires" and loses it 2 seconds later (%%2057) — someone testing, or cleaning up after themselves.</li>
</ul>

<h3>Step 3 — two more quick patterns</h3>
${lenh('s04/tai-khoan', 3)}
${lenh('s04/tai-khoan', 4)}
<p>An account named <code>admin-kriss</code> lives 78 seconds — created, used, deleted (ATT&amp;CK T1136.001). One SID is added to Users, then Administrators, then Backup Operators in under two minutes. <em>Backup Operators</em> deserves attention: its members can read any file (including the SAM and NTDS databases) for "backup", so attackers like it almost as much as Administrators.</p>

<h3>Step 4 — what normal looks like</h3>
${lenh('s04/tai-khoan', 5)}
${lenh('s04/tai-khoan', 6)}
<p>On the Windows 10 sample, 75 of the account events happened on <strong>one day</strong> — the day Windows was installed. Setup creates groups (4731), the hidden <code>WDAGUtilityAccount</code>, a temporary <code>defaultuser0</code> (added to Administrators!), disables Administrator and Guest (4725), and renames built-in groups (4781). The Subject is the machine itself (<code>MINWINPC$</code>, <code>WIN-LL0C19JS506$</code>). After that the log is quiet: one password reset in December and the four 4732 of the Entra join seen in Lesson 4.1. Lesson: compare with the machine's own past before alarming; an Administrators change on day 1 is setup, the same change on day 200 at 3 a.m. is a question.</p>

<h3>Step 5 — 4672: who logs on with a master key</h3>
${lenh('s04/tai-khoan', 7)}
${lenh('s04/tai-khoan', 8)}
<p>4672 follows a 4624 when the new session holds sensitive privileges: SeDebugPrivilege (read any process memory — what credential-dumping tools need), SeBackup/SeRestore (read/write any file), SeTakeOwnership, SeLoadDriver, SeImpersonate. SYSTEM and the Desktop Window Manager (<code>DWM-n</code>) get it at every boot; <code>Administrator</code> 35 times. Rule of thumb: 4672 for SYSTEM/admins is expected; 4672 for an account that is supposed to be a normal user means it has become an admin somewhere.</p>

<h3>Step 6 — locked accounts: 4740 and 4767</h3>
${lenh('s04/tai-khoan', 9)}
<p>None of the public samples contains a lockout — the count is 0, and the course will not invent one. You create a real one in Lab 4 (set a lockout threshold in your VM, type a wrong password three times). What to read when you have it:</p>
<ul>
<li>4740 <code>TargetUserName</code> = the locked account; <strong><code>TargetDomainName</code> = Caller Computer Name</strong>, the machine whose bad attempts caused the lock. In a domain, 4740 is written on the domain controller (the PDC emulator sees every lockout).</li>
<li>Typical helpdesk story: "my account keeps locking every morning" → Caller Computer Name is an old phone with the previous password, a mapped drive, or a service on another server.</li>
<li>4767 = someone unlocked it (the Subject tells who).</li>
</ul>

<h3>On your own Windows PC</h3>
<pre><code class="language-powershell"># Run as administrator: every change to local accounts and groups in the last 30 days
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4720,4722,4724,4725,4726,4732,4733,4738,4740,4767,4781; StartTime = (Get-Date).AddDays(-30) } -ErrorAction SilentlyContinue |
  Select-Object TimeCreated, Id, @{n='Text';e={ ($_.Message -split "\`n")[0] }} | Format-Table -AutoSize -Wrap

# Who is in Administrators now — compare with what the log says
Get-LocalGroupMember -Group Administrators</code></pre>

<h3>🛡️ Attacker's corner: create, promote, hide</h3>
<p>ATT&amp;CK T1136.001 (create a local account) and T1098 (account manipulation: add to a privileged group, set "password never expires", reset a password) are among the most common persistence steps after a break-in, because they need no malware — only built-in commands. What they cannot avoid is the Security log: 4720/4732/4738 with the Subject who did it and the <code>SubjectLogonId</code> that leads back to the session (Lesson 4.1). That is why attackers clear the log first (Step 1) — and why the log must be forwarded off the machine before they get there.</p>

<h3>🎤 What an interviewer will ask</h3>
<ul>
<li>"Which events show someone becoming a local admin?" — 4732 with TargetUserName Administrators (domain: 4728/4756 for privileged groups), plus 4672 at their next logon.</li>
<li>"An account keeps getting locked. How do you find the cause?" — 4740 on the DC, field Caller Computer Name; then 4625 on that machine.</li>
<li>"What does 4672 mean and when is it suspicious?" — special privileges at logon; suspicious for an account that should not be admin.</li>
<li>"A user was created and deleted within two minutes. What do you check?" — Subject and its logon session, what ran in between (4688), whether the log was cleared (1102).</li>
</ul>

<h3>At work</h3>
<p>Many companies (and audits like ISO 27001) require a <strong>monthly review of privileged group membership</strong>. Done with logs, it takes ten minutes: list 4732/4728/4756 for Administrators/Domain Admins in the month, match each with a change ticket, and ask about the ones without a ticket. As an intern you may be handed exactly this task — the export plus a short table "who, when, by whom, ticket" is the deliverable.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok"><ol>
<li>In <code>hidden-user-4720.evtx</code>, how many milliseconds passed between creating the account and adding it to Administrators?</li>
<li>Decode <code>NewUacValue 0x10</code> and <code>0x210</code> into words.</li>
<li>In the Windows 10 sample, why is <code>defaultuser0</code> added to Administrators, and should you report it?</li>
</ol>
<p><strong>Pass:</strong> (1) 4720 at 17:03:25.002, 4732 at .004 → about 2 ms; (2) 0x10 = normal account, enabled, password required; 0x210 = the same + password never expires; (3) it is the temporary account Windows setup uses during the first boot (Subject = the machine account, same minute as the other setup events) — normal, do not report, but note it to show you checked.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['4720 / 4726 / 4738', 'Account created / deleted / changed.'],
  ['4732 / 4733', 'Added to / removed from a local group.'],
  ['4740 / 4767', 'Locked out / unlocked; Caller Computer Name = source of the bad attempts.'],
  ['4672', 'Logon with special privileges (SeDebug, SeBackup…).'],
  ['UserAccountControl', 'Bit flags of an account; %%2048+n off, %%2080+n on.'],
  ['Backup Operators', 'Group that can read any file — treat like an admin group.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Creating and promoting accounts always leaves 4720/4732/4738 with the Subject who did it.</li>
<li>Decode UAC flags instead of guessing; "password never expires" on a new account is a flag.</li>
<li>Know the setup-day baseline; judge changes against the machine's own history.</li>
<li>4672 for a non-admin and 4740 with a strange Caller Computer Name are worth a ticket.</li>
</ul>
${nguon('📘', 'Microsoft Learn — 4720(S): A user account was created', 'Fields and what to watch for new accounts', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4720')}
${nguon('📘', 'Microsoft Learn — 4738(S): A user account was changed', 'UserAccountControl example 0x15 → 0x211', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4738')}
${nguon('📘', 'Microsoft Learn — 4740(S): A user account was locked out', 'Caller Computer Name', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4740')}
${nguon('📘', 'Microsoft Learn — 4672(S): Special privileges assigned to new logon', 'The list of sensitive privileges', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4672')}
${nguon('🛡️', 'MITRE ATT&CK T1136.001 — Create Account: Local Account', 'and T1098 Account Manipulation', 'https://attack.mitre.org/techniques/T1136/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-3-xoa-log-chinh-sach', title: 'Lesson 4.3 — Tampering: 1102, 104, 4719, 4616', sub: 'The clear that came first in Step 1', cta: 'Open' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Tiểu sử của một tài khoản, do log Security chép lại</h2>
<p class="lead">Kẻ xâm nhập đã vào được thì muốn <em>ở lại</em> và muốn làm <em>quản trị</em>. Hai cách rẻ nhất trên Windows là tạo một tài khoản mới và thêm một tài khoản vào nhóm Administrators. Cả hai đều để lại sự kiện — 4720 và 4732 — và vài sự kiện hàng xóm (4722, 4724, 4738, 4726, 4672) kể nốt phần còn lại. Bài này đọc chúng trên một mẫu tấn công thật và trên một lần cài Windows bình thường, để bạn biết "bình thường" trông thế nào trước khi gọi cái gì là đáng ngờ.</p>

<h3>Liên tưởng đời thường: phòng nhân sự và bộ phận cấp thẻ</h3>
<p>Nhân sự tuyển người (4720), kích hoạt thẻ (4722), đặt mã PIN (4724), đổi chức danh (4738), cấp quyền vào phòng máy chủ (4732), tạm đình chỉ (4725), cho nghỉ việc (4726). Bảo vệ khoá thẻ khi nhập sai PIN quá nhiều lần (4740) và mở khoá khi có yêu cầu (4767). Và mỗi sáng, bảo vệ ghi lại ai đi vào bằng chìa khoá vạn năng (4672).</p>

${kv([
  ['4720 / 4726', 'Tạo / xoá tài khoản người dùng.'],
  ['4722 / 4725', 'Bật / tắt (vô hiệu hoá) tài khoản.'],
  ['4723 / 4724', 'Người dùng tự đổi mật khẩu / ai đó đặt lại mật khẩu.'],
  ['4738', 'Tài khoản bị thay đổi (cờ, mật khẩu không hết hạn, tên…).'],
  ['4781', 'Tài khoản bị đổi tên.'],
  ['4740 / 4767', 'Tài khoản bị khoá / được mở khoá.'],
  ['4732 / 4733', 'Thêm / bớt thành viên nhóm cục bộ (Administrators, Remote Desktop Users…).'],
  ['4728 / 4729, 4756', 'Thêm / bớt thành viên nhóm global của domain; 4756 nhóm universal.'],
  ['4731, 4798', 'Tạo nhóm cục bộ; thành viên nhóm cục bộ của một người dùng bị liệt kê.'],
  ['4672', 'Gán đặc quyền đặc biệt cho phiên đăng nhập mới (quyền tương đương quản trị).'],
])}

<h3>Bước 1 — một vụ tấn công thật: tài khoản quản trị ẩn trong một giây</h3>
<p>Mẫu công khai <code>hidden-user-4720.evtx</code> (EVTX-to-MITRE-Attack): kẻ tấn công đã có sẵn một tài khoản quản trị (<code>admmig</code>) chạy công cụ CreateHiddenAccount trên một máy chủ tệp.</p>
${lenh('s04/tai-khoan', 0)}
<p>Đọc từng dòng:</p>
<ol>
<li><strong>17:03:24.224 — 1102</strong>: log Security bị xoá trước tiên (Bài 4.3). Mọi thứ trước khoảnh khắc này đã mất; sự kiện này là sự kiện đầu tiên của log mới.</li>
<li><strong>4688</strong>: công cụ chạy, và <em>dòng lệnh của nó chứa luôn mật khẩu</em> (<code>-p Passw0rd</code>). Ghi log tạo tiến trình sẽ bắt cả mật khẩu gõ trên dòng lệnh — tốt cho người điều tra, và cũng là lý do log dòng lệnh là dữ liệu nhạy cảm (Chương 16).</li>
<li><strong>4720 → 4722 → 4738 → 4724 → 4732</strong> trong 3 ms: tài khoản <code>3teamssixf$</code> được tạo, bật, đổi cờ, đặt mật khẩu, thêm vào <strong>Administrators</strong>. Dấu <code>$</code> ở cuối làm nó trông như tài khoản máy và giấu nó khỏi lệnh <code>net user</code>.</li>
<li><strong>4733 → 4729 → 4726</strong>: bị gỡ khỏi các nhóm và bị <em>xoá</em>, rồi <strong>regedit /s</strong> nhập một tệp .reg và xuất hiện một <strong>4738</strong> cuối cùng. Công cụ đã lưu dữ liệu registry của tài khoản, xoá tài khoản, rồi ghi dữ liệu đó trở lại: tài khoản vẫn dùng được nhưng không còn hiện trong danh sách người dùng. Dấu vết duy nhất là chính các sự kiện này — vì thế chúng phải rời khỏi máy càng sớm càng tốt (Bài 4.3).</li>
</ol>

<h3>Bước 2 — đọc UserAccountControl (%%20xx)</h3>
${lenh('s04/tai-khoan', 1)}
${lenh('s04/tai-khoan', 2)}
<p><code>OldUacValue</code>/<code>NewUacValue</code> là mặt nạ bit; <code>UserAccountControl</code> liệt kê những gì đã đổi dưới dạng số hiệu thông điệp. Chính ví dụ của Microsoft ở trang 4738 (0x15 → 0x211 hiển thị thành <code>%%2050 %%2089</code>) cho ta luật: <strong>%%(2048 + n)</strong> = bit n bị <em>tắt</em>, <strong>%%(2080 + n)</strong> = bit n được <em>bật</em>. Bit 0 = "Account Disabled", bit 2 = "Password Not Required", bit 4 = "Normal Account", bit 9 = "Don't Expire Password". Vậy:</p>
<ul>
<li>Tài khoản mới <code>0x15</code> = bị tắt + không cần mật khẩu + tài khoản thường (<code>%%2080 %%2082 %%2084</code>) — tài khoản mới nào cũng bắt đầu như vậy trước các bước tiếp theo.</li>
<li><code>0x15 → 0x210</code> = được bật (%%2048), giờ phải có mật khẩu (%%2050), <strong>mật khẩu không bao giờ hết hạn</strong> (%%2089).</li>
<li>Mẫu <code>pwnever-4738.evtx</code>: <code>hack1</code> được đặt "mật khẩu không hết hạn" rồi bị gỡ 2 giây sau (%%2057) — có người đang thử, hoặc đang dọn dấu vết.</li>
</ul>

<h3>Bước 3 — hai kiểu nhanh nữa</h3>
${lenh('s04/tai-khoan', 3)}
${lenh('s04/tai-khoan', 4)}
<p>Một tài khoản tên <code>admin-kriss</code> sống 78 giây — tạo, dùng, xoá (ATT&amp;CK T1136.001). Một SID được thêm vào Users, rồi Administrators, rồi Backup Operators trong chưa đầy hai phút. <em>Backup Operators</em> đáng để ý: thành viên của nó đọc được mọi tệp (kể cả cơ sở dữ liệu SAM và NTDS) để "sao lưu", nên kẻ tấn công thích nó gần như Administrators.</p>

<h3>Bước 4 — "bình thường" trông thế nào</h3>
${lenh('s04/tai-khoan', 5)}
${lenh('s04/tai-khoan', 6)}
<p>Trên mẫu Windows 10, 75 sự kiện tài khoản xảy ra trong <strong>một ngày</strong> — ngày cài Windows. Trình cài đặt tạo các nhóm (4731), tài khoản ẩn <code>WDAGUtilityAccount</code>, tài khoản tạm <code>defaultuser0</code> (được thêm vào Administrators!), tắt Administrator và Guest (4725), và đổi tên các nhóm có sẵn (4781). Subject là chính cái máy (<code>MINWINPC$</code>, <code>WIN-LL0C19JS506$</code>). Sau đó log yên ắng: một lần đặt lại mật khẩu hồi tháng 12 và bốn lần 4732 của việc nối Entra ID đã gặp ở Bài 4.1. Bài học: so với chính quá khứ của máy trước khi báo động; thay đổi Administrators ở ngày đầu là cài đặt, cùng thay đổi đó ở ngày thứ 200 lúc 3 giờ sáng là một câu hỏi.</p>

<h3>Bước 5 — 4672: ai đăng nhập bằng chìa khoá vạn năng</h3>
${lenh('s04/tai-khoan', 7)}
${lenh('s04/tai-khoan', 8)}
<p>4672 đi sau một 4624 khi phiên mới nắm các đặc quyền nhạy cảm: SeDebugPrivilege (đọc bộ nhớ của mọi tiến trình — thứ mà công cụ trích mật khẩu cần), SeBackup/SeRestore (đọc/ghi mọi tệp), SeTakeOwnership, SeLoadDriver, SeImpersonate. SYSTEM và Desktop Window Manager (<code>DWM-n</code>) nhận nó mỗi lần khởi động; <code>Administrator</code> 35 lần. Luật nhớ nhanh: 4672 cho SYSTEM/quản trị là chuyện thường; 4672 cho một tài khoản lẽ ra là người dùng thường nghĩa là nó đã thành quản trị ở đâu đó.</p>

<h3>Bước 6 — tài khoản bị khoá: 4740 và 4767</h3>
${lenh('s04/tai-khoan', 9)}
<p>Không mẫu công khai nào có sự kiện khoá tài khoản — đếm ra 0, và khoá học sẽ không bịa ra một cái. Bạn tạo cái thật trong Lab 4 (đặt ngưỡng khoá trong máy ảo, gõ sai mật khẩu ba lần). Khi có rồi thì đọc gì:</p>
<ul>
<li>4740 <code>TargetUserName</code> = tài khoản bị khoá; <strong><code>TargetDomainName</code> = Caller Computer Name</strong>, tức máy đã gửi các lần thử sai gây ra việc khoá. Trong domain, 4740 được ghi trên domain controller (PDC emulator thấy mọi lần khoá).</li>
<li>Chuyện quen thuộc ở helpdesk: "sáng nào tài khoản tôi cũng bị khoá" → Caller Computer Name là một điện thoại cũ còn mật khẩu trước, một ổ mạng đã map, hoặc một dịch vụ trên máy chủ khác.</li>
<li>4767 = có người đã mở khoá (Subject cho biết ai).</li>
</ul>

<h3>Trên máy Windows của bạn</h3>
<pre><code class="language-powershell"># Chạy bằng quyền quản trị: mọi thay đổi tài khoản và nhóm cục bộ trong 30 ngày qua
Get-WinEvent -FilterHashtable @{ LogName = 'Security'; Id = 4720,4722,4724,4725,4726,4732,4733,4738,4740,4767,4781; StartTime = (Get-Date).AddDays(-30) } -ErrorAction SilentlyContinue |
  Select-Object TimeCreated, Id, @{n='Text';e={ ($_.Message -split "\`n")[0] }} | Format-Table -AutoSize -Wrap

# Hiện ai đang ở trong Administrators — so với những gì log kể
Get-LocalGroupMember -Group Administrators</code></pre>

<h3>🛡️ Góc hacker: tạo, nâng quyền, giấu</h3>
<p>ATT&amp;CK T1136.001 (tạo tài khoản cục bộ) và T1098 (thao túng tài khoản: thêm vào nhóm đặc quyền, đặt "mật khẩu không hết hạn", đặt lại mật khẩu) là những bước bám trụ phổ biến nhất sau khi xâm nhập, vì chúng không cần mã độc — chỉ cần lệnh có sẵn. Thứ chúng không né được là log Security: 4720/4732/4738 kèm Subject đã làm và <code>SubjectLogonId</code> dẫn ngược về phiên đăng nhập (Bài 4.1). Vì thế kẻ tấn công xoá log trước (Bước 1) — và vì thế log phải được chuyển khỏi máy trước khi chúng kịp làm vậy.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ul>
<li>"Sự kiện nào cho thấy ai đó trở thành quản trị cục bộ?" — 4732 với TargetUserName là Administrators (domain: 4728/4756 cho nhóm đặc quyền), cộng 4672 ở lần đăng nhập kế tiếp của họ.</li>
<li>"Một tài khoản cứ bị khoá. Tìm nguyên nhân thế nào?" — 4740 trên DC, trường Caller Computer Name; rồi 4625 trên máy đó.</li>
<li>"4672 nghĩa là gì và khi nào đáng ngờ?" — đặc quyền đặc biệt lúc đăng nhập; đáng ngờ với tài khoản lẽ ra không phải quản trị.</li>
<li>"Một người dùng được tạo rồi bị xoá trong hai phút. Bạn kiểm tra gì?" — Subject và phiên đăng nhập của nó, cái gì đã chạy ở giữa (4688), log có bị xoá không (1102).</li>
</ul>

<h3>Đi làm thật</h3>
<p>Nhiều công ty (và các đợt đánh giá như ISO 27001) yêu cầu <strong>soát thành viên nhóm đặc quyền hằng tháng</strong>. Làm bằng log thì mất mười phút: liệt kê 4732/4728/4756 vào Administrators/Domain Admins trong tháng, ghép mỗi dòng với một phiếu thay đổi, và hỏi về những dòng không có phiếu. Là thực tập sinh, bạn có thể được giao đúng việc này — sản phẩm là tệp xuất cộng một bảng ngắn "ai, khi nào, do ai, phiếu nào".</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok"><ol>
<li>Trong <code>hidden-user-4720.evtx</code>, từ lúc tạo tài khoản tới lúc thêm vào Administrators mất bao nhiêu mili giây?</li>
<li>Giải mã <code>NewUacValue 0x10</code> và <code>0x210</code> thành lời.</li>
<li>Trong mẫu Windows 10, vì sao <code>defaultuser0</code> được thêm vào Administrators, và có nên báo cáo không?</li>
</ol>
<p><strong>Đạt khi:</strong> (1) 4720 lúc 17:03:25.002, 4732 lúc .004 → khoảng 2 ms; (2) 0x10 = tài khoản thường, đang bật, phải có mật khẩu; 0x210 = như trên + mật khẩu không bao giờ hết hạn; (3) đó là tài khoản tạm mà trình cài Windows dùng trong lần khởi động đầu (Subject là tài khoản máy, cùng phút với các sự kiện cài đặt khác) — bình thường, không báo cáo, nhưng ghi chú lại để cho thấy bạn đã kiểm.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['4720 / 4726 / 4738', 'Tạo / xoá / thay đổi tài khoản.'],
  ['4732 / 4733', 'Thêm vào / gỡ khỏi nhóm cục bộ.'],
  ['4740 / 4767', 'Bị khoá / được mở khoá; Caller Computer Name = nguồn của các lần thử sai.'],
  ['4672', 'Đăng nhập kèm đặc quyền đặc biệt (SeDebug, SeBackup…).'],
  ['UserAccountControl', 'Các cờ bit của tài khoản; %%2048+n là tắt, %%2080+n là bật.'],
  ['Backup Operators', 'Nhóm đọc được mọi tệp — đối xử như nhóm quản trị.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tạo và nâng quyền tài khoản luôn để lại 4720/4732/4738 kèm Subject đã làm.</li>
<li>Giải mã cờ UAC thay vì đoán; "mật khẩu không hết hạn" trên tài khoản mới là một dấu hiệu.</li>
<li>Biết đường nền của ngày cài đặt; xét thay đổi theo chính lịch sử của máy.</li>
<li>4672 cho người không phải quản trị và 4740 với Caller Computer Name lạ đáng mở phiếu.</li>
</ul>
${nguon('📘', 'Microsoft Learn — 4720(S): A user account was created', 'Các trường và điều cần theo dõi ở tài khoản mới', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4720')}
${nguon('📘', 'Microsoft Learn — 4738(S): A user account was changed', 'Ví dụ UserAccountControl 0x15 → 0x211', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4738')}
${nguon('📘', 'Microsoft Learn — 4740(S): A user account was locked out', 'Caller Computer Name', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4740')}
${nguon('📘', 'Microsoft Learn — 4672(S): Special privileges assigned to new logon', 'Danh sách đặc quyền nhạy cảm', 'https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4672')}
${nguon('🛡️', 'MITRE ATT&CK T1136.001 — Create Account: Local Account', 'và T1098 Account Manipulation', 'https://attack.mitre.org/techniques/T1136/001/')}
${lienKet({ khoa: 'log-tu-a-den-z', bai: 'log-4-3-xoa-log-chinh-sach', title: 'Bài 4.3 — Can thiệp: 1102, 104, 4719, 4616', sub: 'Lần xoá log đã xảy ra đầu tiên ở Bước 1', cta: 'Mở bài' })}
</div>
`,
};
