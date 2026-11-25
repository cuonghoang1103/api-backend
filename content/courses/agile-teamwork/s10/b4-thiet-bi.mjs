/**
 * 10.4 — Thiết bị và mạng (agl-10-4-thiet-bi). Soạn 24/11/2026, agent agl.
 * Chạy thật: scratchpad/agl/lab/ch10/laptop/chay.sh (ảnh đĩa ext4 16 MB, mkfs.ext4 -d, strings/debugfs, openssl enc AES-256 + PBKDF2) → RA.laptop;
 * scratchpad/agl/lab/ch10/wifi/chay.sh trong netns riêng (unshare -rn, tcpdump -Z root, Node 22 http/https cổng 43180/43443) → RA.wifi.
 * Amagasaki 06/2022: NBC News, CBS News, databreaches.net 24/06/2022 (USB dữ liệu ~460.000 cư dân, nhân viên công ty thầu lại của BIPROGY).
 * LastPass 2022: thông báo LastPass 02/2023 — máy tính ở nhà của kỹ sư DevOps bị cài keylogger qua phần mềm media bên thứ ba có lỗ hổng
 * (tên phần mềm "Plex" chỉ là nguồn ẩn danh của Ars Technica ⇒ không khẳng định). SecurityWeek, The Hacker News 02/2023.
 */
import { bang, cl, note, phongVan, thuatNgu, tomTat, giai, cs, ag, ng, vo, bash, out } from '../_chung.mjs';
import { MA, RA } from './_ma.mjs';

export const L104 = (en) => {
  const t = (a, b) => (en ? a : b);
  return vo(en, 'Chapter 10 · Information security at work', 'Chương 10 · An ninh thông tin khi đi làm', `
<h2>${t('10.4 — Devices and networks: USB, VPN, public Wi-Fi — and losing your laptop', '10.4 — Thiết bị và mạng: USB, VPN, Wi-Fi công cộng — và khi mất laptop')}</h2>
<p class="lead">${t(
    'The company laptop arrives with things you cannot change: USB storage blocked, a VPN client, disk encryption, an agent that reports to IT. Interns often see these as annoyances to work around. This lesson shows — with two small experiments you can rerun — what each one protects against, and gives you the playbook for the day a laptop is lost or stolen, which happens in every large company every month.',
    'Laptop công ty giao tới có những thứ bạn không đổi được: chặn ổ USB, phần mềm VPN, mã hoá ổ đĩa, một agent báo cáo về IT. Thực tập sinh hay coi chúng là phiền phức cần lách. Bài này cho thấy — bằng hai thí nghiệm nhỏ bạn chạy lại được — mỗi thứ chống lại điều gì, và đưa bạn kịch bản xử lý ngày laptop bị mất hay bị trộm, chuyện tháng nào cũng xảy ra ở công ty lớn.')}</p>

<h3>${t('USB: why it is blocked — the Amagasaki case (2022)', 'USB: vì sao bị chặn — vụ Amagasaki (2022)')}</h3>
<p>${t(
    'In June 2022 the city of Amagasaki (Hyōgo, Japan) announced that a USB stick holding personal data of about 460,000 residents — essentially the whole city, including addresses and bank details of households receiving benefits — had been lost. It was carried by an employee of a company several layers down the subcontracting chain of the IT vendor BIPROGY, who took it out of the office to do data transfer work, went drinking after work and lost his bag. The stick was found a few days later; the city received tens of thousands of calls, and the vendor\'s president had to apologise publicly. Officials said he was authorised to access the data, but not to copy it to a USB stick or take it outside.',
    'Tháng 6/2022, thành phố Amagasaki (Hyōgo, Nhật) thông báo một chiếc USB chứa dữ liệu cá nhân của khoảng 460.000 cư dân — gần như cả thành phố, gồm địa chỉ và thông tin tài khoản ngân hàng của các hộ nhận trợ cấp — đã bị mất. Người mang nó là nhân viên của một công ty nằm vài tầng dưới chuỗi thầu lại của nhà cung cấp IT BIPROGY; anh ta mang USB ra khỏi văn phòng để làm việc chuyển dữ liệu, tan làm đi nhậu rồi mất túi. Vài ngày sau USB được tìm thấy; thành phố nhận hàng chục nghìn cuộc gọi, chủ tịch công ty vendor phải xin lỗi công khai. Phía chính quyền cho biết anh ta có quyền truy cập dữ liệu, nhưng không được phép chép ra USB hay mang ra ngoài.')}
${ng('https://www.nbcnews.com/news/world/worker-japan-loses-usb-entire-city-amagasaki-data-night-colleagues-rcna35227', 'NBC News, 06/2022')} · ${ng('https://databreaches.net/2022/06/24/usb-devices-with-personal-data-of-all-460000-amagasaki-residents-lost', 'databreaches.net, 24/06/2022')}</p>
<p>${t(
    'Every element of that story is an outsourcing story: a vendor, a subcontractor, a "just for today" shortcut. USB blocking exists so that the shortcut is not available. USB also works the other way — a stick found in the car park or handed out at an event can carry malware that runs when plugged in. If you need to move data, ask for the approved channel.',
    'Mọi chi tiết trong chuyện này đều là chuyện outsourcing: một vendor, một công ty thầu lại, một lối tắt "chỉ hôm nay thôi". Chặn USB là để lối tắt đó không tồn tại. USB còn nguy hiểm theo chiều ngược lại — một chiếc nhặt được ở bãi xe hay được phát ở sự kiện có thể chứa mã độc tự chạy khi cắm vào. Cần chuyển dữ liệu thì xin kênh được duyệt.')}</p>

<h3>${t('Disk encryption: what the thief gets (run for real)', 'Mã hoá ổ đĩa: kẻ trộm lấy được gì (chạy thật)')}</h3>
<p>${t('Login passwords do not protect a disk: a thief removes it (or boots from a USB) and reads the raw bytes. We build a small ext4 disk image with a project folder, then search it the way a thief would — before and after encryption:', 'Mật khẩu đăng nhập không bảo vệ ổ đĩa: kẻ trộm tháo ổ ra (hoặc khởi động từ USB) rồi đọc thẳng từng byte. Ta dựng một ảnh đĩa ext4 nhỏ có thư mục dự án, rồi tìm trong đó đúng như kẻ trộm — trước và sau khi mã hoá:')}</p>
${bash(MA.laptop)}
${out(RA.laptop)}
<p>${t(
    'Unencrypted, the patient row and the database password are readable directly, and <code>debugfs</code> even lists the folder. Encrypted, the same image contains nothing recognisable except a header, and a wrong password gets nowhere. Full-disk encryption does this for the whole drive: BitLocker (Windows), FileVault (macOS), LUKS (Linux). Check the status:',
    'Không mã hoá, dòng bệnh nhân và mật khẩu database đọc được ngay, <code>debugfs</code> còn liệt kê cả thư mục. Đã mã hoá, cùng ảnh đĩa không còn gì nhận ra được ngoài phần đầu tệp, và đoán sai mật khẩu thì không đi tới đâu. Mã hoá toàn ổ đĩa làm việc này cho cả ổ: BitLocker (Windows), FileVault (macOS), LUKS (Linux). Kiểm trạng thái:')}</p>
${bash(`# Windows (PowerShell chạy quyền admin)
manage-bde -status C:
# macOS
fdesetup status
# Linux: phân vùng mã hoá hiện FSTYPE = crypto_LUKS
lsblk -o NAME,FSTYPE,MOUNTPOINT`)}
${note(t('Encryption protects a <em>powered-off</em> laptop. A sleeping laptop with the disk unlocked is much weaker — shut down (or hibernate) when you carry it home, and lock the screen whenever you stand up (lesson 10.2).', 'Mã hoá bảo vệ laptop <em>đã tắt</em>. Laptop đang ngủ với ổ đã mở khoá yếu hơn nhiều — tắt máy (hoặc ngủ đông) khi mang về nhà, và khoá màn hình mỗi lần đứng dậy (bài 10.2).'))}

<h3>${t('Public Wi-Fi: what a sniffer sees (run for real)', 'Wi-Fi công cộng: kẻ nghe lén thấy gì (chạy thật)')}</h3>
<p>${t('On café or hotel Wi-Fi, other people on the same network — or whoever runs a fake hotspot with the same name ("evil twin") — can capture your traffic. We reproduce it safely inside an isolated network namespace on one machine: a fake login server, a sniffer, and the same password sent once over HTTP and once over HTTPS.', 'Trên Wi-Fi quán cà phê hay khách sạn, người khác cùng mạng — hoặc kẻ dựng điểm phát giả cùng tên ("evil twin") — có thể bắt lưu lượng của bạn. Ta tái hiện an toàn trong một không gian mạng cô lập trên một máy: một máy chủ đăng nhập giả, một kẻ nghe lén, và cùng một mật khẩu gửi một lần qua HTTP, một lần qua HTTPS.')}</p>
${bash(MA.wifi)}
${out(RA.wifi)}
<p>${t(
    'Over HTTP the sniffer reads the password in plain text; over HTTPS it sees only encrypted bytes. But HTTPS on a public network still leaks which <em>sites</em> you visit (DNS and the server name in the TLS handshake), cannot stop you from typing a password into a fake captive portal, and does nothing for internal tools that use plain HTTP. That is why company policy says: work traffic only through the company VPN. How TLS works: ',
    'Qua HTTP kẻ nghe lén đọc được mật khẩu dạng chữ thường; qua HTTPS chỉ thấy các byte đã mã hoá. Nhưng HTTPS trên mạng công cộng vẫn lộ bạn vào <em>trang nào</em> (DNS và tên máy chủ trong bắt tay TLS), không ngăn được bạn gõ mật khẩu vào một trang đăng nhập Wi-Fi giả, và vô dụng với công cụ nội bộ dùng HTTP thường. Vì vậy chính sách công ty ghi: lưu lượng công việc chỉ đi qua VPN công ty. TLS hoạt động thế nào: ')}${cs('networking-for-developers', 'netdev-6-1-tls-la-gi', t('Networking 6.1', 'Mạng 6.1'))}; ${t('VPN for developers', 'VPN cho lập trình viên')}: ${cs('networking-for-developers', 'netdev-14-4-vpn', t('Networking 14.4', 'Mạng 14.4'))}.</p>
${bang([t('Rule', 'Quy tắc'), t('Reason', 'Lý do')], [
    [t('Connect the VPN <em>before</em> opening any work tool', 'Bật VPN <em>trước</em> khi mở bất kỳ công cụ công việc nào'), t('Internal systems are often reachable only through it, and it protects traffic on untrusted networks', 'Hệ thống nội bộ thường chỉ vào được qua VPN, và VPN bảo vệ lưu lượng trên mạng không tin cậy')],
    [t('Prefer your phone\'s hotspot to unknown Wi-Fi', 'Ưu tiên điểm phát từ điện thoại hơn Wi-Fi lạ'), t('You control it; no strangers on the network', 'Bạn kiểm soát nó; không có người lạ trong mạng')],
    [t('Ignore certificate warnings? Never on work sites', 'Bỏ qua cảnh báo chứng chỉ? Không bao giờ với trang công việc'), t('A warning on a known site on public Wi-Fi is exactly what interception looks like', 'Cảnh báo ở một trang quen trên Wi-Fi công cộng chính là dấu hiệu bị chặn giữa đường')],
    [t('No split tunnelling tricks to "make it faster"', 'Không tự chỉnh để lách VPN "cho nhanh"'), t('IT configured it deliberately; ask if something is slow', 'IT cấu hình có chủ đích; chậm thì hỏi IT')],
  ])}

<h3>${t('Personal devices: the LastPass lesson (2022)', 'Thiết bị cá nhân: bài học LastPass (2022)')}</h3>
<p>${t(
    'In 2022 the password-manager company LastPass was breached twice. In its 2023 update it explained the second stage: attackers targeted the <strong>home computer</strong> of one of only four senior DevOps engineers with access to a critical corporate vault, exploited a vulnerable third-party media software package on it, installed a keylogger and captured the engineer\'s master password as it was typed after MFA. With valid credentials, they reached the company\'s cloud storage and backups of customer vault data. Nothing was "hacked" at the office.',
    'Năm 2022, công ty trình quản lý mật khẩu LastPass bị xâm nhập hai đợt. Trong bản cập nhật năm 2023, họ giải thích giai đoạn hai: kẻ tấn công nhắm vào <strong>máy tính ở nhà</strong> của một trong bốn kỹ sư DevOps cấp cao có quyền vào một kho bí mật quan trọng của công ty, khai thác một phần mềm media bên thứ ba có lỗ hổng trên máy đó, cài keylogger và bắt được mật khẩu chủ khi kỹ sư gõ sau bước MFA. Có thông tin đăng nhập hợp lệ, chúng vào được kho lưu trữ đám mây và bản sao lưu dữ liệu kho mật khẩu của khách hàng. Không có gì bị "tấn công" ở văn phòng cả.')}
${ng('https://www.securityweek.com/lastpass-says-devops-engineer-home-computer-hacked/', 'SecurityWeek, 02/2023')} · ${ng('https://thehackernews.com/2023/02/lastpass-reveals-second-attack.html', 'The Hacker News, 02/2023')}</p>
<p>${t('Your home PC runs games, cracked tools, extensions and family members\' downloads. That is why "do project work only on company-managed devices unless explicitly allowed" is a rule, and why logging into the company e-mail or Git server from a friend\'s laptop or a printing shop computer is forbidden.', 'Máy ở nhà của bạn chạy game, phần mềm crack, extension và đủ thứ người nhà tải về. Vì vậy mới có quy tắc "chỉ làm việc dự án trên thiết bị công ty quản lý, trừ khi được cho phép rõ ràng", và cấm đăng nhập email hay máy chủ Git công ty từ laptop của bạn bè hay máy ở tiệm in.')}</p>

<h3>${t('Lost or stolen laptop: the first hour', 'Mất hoặc bị trộm laptop: giờ đầu tiên')}</h3>
${bang([t('When', 'Khi nào'), t('What', 'Làm gì'), t('Why', 'Vì sao')], [
    [t('Minute 0–15', 'Phút 0–15'), t('Call/message the IT or security hotline and your leader. Say: which device, when and where last seen, which projects and data were on it, whether it was powered off or sleeping.', 'Gọi/nhắn đường dây IT hoặc an ninh và leader. Nói rõ: thiết bị nào, lần cuối thấy ở đâu lúc nào, có dự án và dữ liệu gì, đang tắt hay đang ngủ.'), t('IT can lock or wipe it remotely (MDM) and kill sessions — but only once they know', 'IT có thể khoá hoặc xoá từ xa (MDM) và cắt phiên — nhưng chỉ khi họ biết')],
    [t('Minute 15–60', 'Phút 15–60'), t('Following IT\'s instructions: change the SSO password from another trusted device, sign out all sessions, revoke tokens and SSH keys that lived on that laptop (lesson 10.5).', 'Theo hướng dẫn IT: đổi mật khẩu SSO từ một thiết bị tin cậy khác, đăng xuất mọi phiên, thu hồi token và SSH key từng nằm trên laptop đó (bài 10.5).'), t('A stolen session cookie or token works even if the attacker never learns the password — CircleCI 2023, lesson 10.7', 'Cookie phiên hay token bị lấy vẫn dùng được dù kẻ gian không biết mật khẩu — CircleCI 2023, bài 10.7')],
    [t('Same day', 'Trong ngày'), t('Police report if stolen (the company may need it); written incident report; list personal accounts that were logged in.', 'Trình báo công an nếu bị trộm (công ty có thể cần); viết báo cáo sự cố; liệt kê tài khoản cá nhân đã đăng nhập trên máy.'), t('Evidence for insurance, the customer and the ISMS records', 'Bằng chứng cho bảo hiểm, khách hàng và hồ sơ ISMS')],
    [t('Never', 'Không bao giờ'), t('Wait a day hoping it turns up; hide it because you took it somewhere you should not have.', 'Chờ một ngày mong nó tự xuất hiện; giấu vì đã mang nó tới chỗ không nên.'), t('Hiding is what turns a lost device into a disciplinary case', 'Giấu là điều biến chuyện mất thiết bị thành chuyện kỷ luật')],
  ])}
${cl('tip', t('Prepare now, not on the bus: save the IT hotline in your phone, know which accounts live on your laptop (lab 10.8 builds that list), and keep your phone\'s 2FA recovery codes somewhere that is not the laptop.', 'Chuẩn bị ngay bây giờ, đừng đợi lúc ở trên xe buýt: lưu số đường dây IT vào điện thoại, biết những tài khoản nào nằm trên laptop (lab 10.8 lập danh sách này), và cất mã khôi phục 2FA ở nơi không phải laptop.'))}

<h3>${t('Situation: the laptop stayed on the bus', 'Tình huống: laptop ở lại trên xe buýt')}</h3>
<p>${t(
    '18:40, you step off bus 32 and realise the backpack with the company laptop is still on the seat. Call the bus company (lost property) <em>and</em> the IT hotline in the same five minutes — not one after the other. Tell IT it was shut down and encrypted (if it was); they will still revoke sessions as a precaution. If the bag comes back tomorrow, IT inspects the device before you use it again. Your leader learns about it from you, tonight — not from IT next week.',
    '18:40, bạn xuống xe buýt số 32 và nhận ra ba lô có laptop công ty vẫn nằm trên ghế. Gọi nhà xe (bộ phận đồ thất lạc) <em>và</em> đường dây IT trong cùng năm phút — không làm lần lượt. Báo IT máy đã tắt và đã mã hoá (nếu đúng vậy); họ vẫn sẽ thu hồi phiên để đề phòng. Nếu mai lấy lại được túi, IT kiểm tra máy trước khi bạn dùng lại. Leader biết chuyện từ chính bạn, ngay tối nay — không phải từ IT vào tuần sau.')}</p>

<h3>${t('Exercise', 'Bài tập')}</h3>
<ol>
<li>${t('Run the disk experiment again with a file inside a sub-sub-folder. Does <code>strings</code> still find it? Why?', 'Chạy lại thí nghiệm ổ đĩa với tệp nằm trong thư mục con cấp hai. <code>strings</code> có còn tìm thấy không? Vì sao?')}</li>
<li>${t('In the Wi-Fi experiment, what does the sniffer still learn about the HTTPS request?', 'Trong thí nghiệm Wi-Fi, kẻ nghe lén vẫn biết được gì về request HTTPS?')}</li>
<li>${t('Your friend lends you their laptop to "quickly check the customer\'s reply on webmail". OK?', 'Bạn bè cho mượn laptop để "kiểm nhanh email trả lời của khách trên webmail". Được không?')}</li>
</ol>
${giai(t('Answers', 'Đáp án'), `<ol>
<li>${t('Yes — folders are just metadata; file contents are bytes on the disk wherever the folder is. Only encryption changes that.', 'Có — thư mục chỉ là siêu dữ liệu; nội dung tệp vẫn là các byte trên đĩa dù nằm ở thư mục nào. Chỉ mã hoá mới thay đổi điều đó.')}</li>
<li>${t('Source and destination addresses and ports, timing and sizes; on the real internet also the server name (SNI) and the DNS lookup.', 'Địa chỉ và cổng nguồn/đích, thời điểm và kích thước; trên Internet thật còn có tên máy chủ (SNI) và truy vấn DNS.')}</li>
<li>${t('No — an unmanaged device may have a keylogger (LastPass), and the session may be left behind in its browser.', 'Không — thiết bị không do công ty quản lý có thể có keylogger (LastPass), và phiên đăng nhập có thể bị bỏ lại trong trình duyệt của máy đó.')}</li>
</ol>`)}

${phongVan([
    [t('Why do companies block USB storage?', 'Vì sao công ty chặn ổ USB?'), t('To stop uncontrolled copying of data out (and malware in); data should move only through approved, logged channels — e.g. the Amagasaki 2022 incident.', 'Để chặn việc chép dữ liệu ra ngoài không kiểm soát (và mã độc đi vào); dữ liệu chỉ nên đi qua kênh được duyệt, có nhật ký — ví dụ vụ Amagasaki 2022.')],
    [t('Is HTTPS enough on public Wi-Fi?', 'Trên Wi-Fi công cộng, HTTPS có đủ không?'), t('It protects content, but leaks metadata, does not protect plain-HTTP internal tools or fake portals; use the company VPN.', 'Nó bảo vệ nội dung nhưng vẫn lộ siêu dữ liệu, không bảo vệ công cụ nội bộ dùng HTTP thường hay trang đăng nhập giả; hãy dùng VPN công ty.')],
    [t('You lost your work laptop. Walk me through what you do.', 'Bạn làm mất laptop công ty. Kể từng bước bạn làm.'), t('Report to IT/security and my leader within minutes with details; follow instructions to revoke sessions, passwords, tokens and keys; police report if stolen; written incident report.', 'Báo IT/an ninh và leader trong vài phút kèm chi tiết; làm theo hướng dẫn thu hồi phiên, mật khẩu, token và key; trình báo công an nếu bị trộm; viết báo cáo sự cố.')],
  ], en)}

${thuatNgu([
    [t('Full-disk encryption (FDE)', 'Mã hoá toàn ổ đĩa (FDE)'), t('BitLocker / FileVault / LUKS — data unreadable without the key when powered off', 'BitLocker / FileVault / LUKS — tắt máy thì không đọc được dữ liệu nếu thiếu khoá')],
    ['MDM', t('Mobile device management — lets IT enforce settings, lock and wipe devices remotely', 'Quản lý thiết bị di động — cho IT áp cấu hình, khoá và xoá máy từ xa')],
    ['VPN', t('Encrypted tunnel from your device into the company network', 'Đường hầm mã hoá từ thiết bị của bạn vào mạng công ty')],
    ['Evil twin', t('Fake Wi-Fi access point with the same name as a real one', 'Điểm phát Wi-Fi giả mang cùng tên với điểm phát thật')],
    [t('Captive portal', 'Captive portal (trang đăng nhập Wi-Fi)'), t('Login page a Wi-Fi network shows before granting internet', 'Trang đăng nhập mạng Wi-Fi hiện ra trước khi cho vào Internet')],
    ['Keylogger', t('Malware that records keystrokes', 'Mã độc ghi lại mọi phím bạn gõ')],
  ], en)}

${tomTat([
    t('USB blocks, VPN and disk encryption each stop a specific, real failure — do not work around them.', 'Chặn USB, VPN và mã hoá ổ đĩa đều chặn một kiểu sự cố có thật — đừng tìm cách lách.'),
    t('Unencrypted disks give up everything; encrypted ones give up nothing — when powered off.', 'Ổ không mã hoá lộ mọi thứ; ổ đã mã hoá không lộ gì — khi máy đã tắt.'),
    t('HTTPS hides content, not everything; public Wi-Fi ⇒ VPN or phone hotspot.', 'HTTPS che nội dung, không che mọi thứ; Wi-Fi công cộng ⇒ VPN hoặc điểm phát điện thoại.'),
    t('Project work only on managed devices — LastPass was breached through a home PC.', 'Chỉ làm việc dự án trên thiết bị được quản lý — LastPass bị xâm nhập qua một máy ở nhà.'),
    t('Lost device: report within minutes, revoke, document. Never wait, never hide.', 'Mất thiết bị: báo trong vài phút, thu hồi, ghi lại. Không chờ, không giấu.'),
  ], en)}
<p>${t('Next', 'Tiếp theo')}: ${ag('agl-10-5-tai-khoan', t('10.5 — personal account hygiene', '10.5 — vệ sinh tài khoản cá nhân'))}.</p>
`);
};
