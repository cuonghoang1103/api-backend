/**
 * Tour Chương 14 của phòng lab mạng (khoá Networking for Developers, 14/11/2026): wifi (Wi-Fi trường, đăng ký MAC, địa chỉ riêng) và
 * block (mạng trường chặn gì). Viết cho người mới tinh, có liên tưởng đời thường; mọi con số là của lab "Wi-Fi trường trong một hộp"
 * (net-lab/engine/capture14.ts) hoặc được nói rõ là TÍNH RA. Trạng thái cuối mỗi tour được kiểm trong tours.test.ts (FINAL).
 */
import type { Tour } from './types';

const step = (n: number, delay = 650) => ({ a: 'player.step', delay, upTo: n });

export const NET14_TOURS: Tour[] = [
  // ───────────────────────── wifi ─────────────────────────
  {
    id: 'wifi-register', ns: 'net-lab', sim: 'wifi', presets: ['register'],
    title: ['Join, get an IP, meet the login page', 'Vào mạng, nhận IP, gặp trang đăng nhập'],
    summary: ['Follow a MacBook onto the registration SSID: DHCP in four packets, the captive-portal probe, and the line the controller writes when you log in.', 'Theo một MacBook vào SSID đăng ký: DHCP trong bốn gói, câu hỏi dò trang đăng nhập, và dòng bộ điều khiển ghi lại khi bạn đăng nhập.'],
    steps: [
      {
        target: 'wifi-topo', do: [{ a: 'wifi.preset', v: 'register' }, { a: 'wifi.mode', v: 'fixed' }, { a: 'player.reset' }],
        title: ['The school network', 'Mạng của trường'],
        body: ['Left: the MacBook. Middle: the access point + controller (it hands out IPs, answers DNS, shows the login page, and runs the firewall). Right: the Internet. Under each laptop you see the MAC it is using right now.', 'Trái: MacBook. Giữa: điểm phát + bộ điều khiển (cấp IP, trả lời DNS, hiện trang đăng nhập, chạy tường lửa). Phải: Internet. Dưới mỗi laptop là MAC nó đang dùng lúc này.'],
      },
      {
        target: 'wifi-mode',
        title: ['Private Wi-Fi address: Fixed', 'Địa chỉ Wi-Fi riêng: Cố định'],
        body: ['This is the macOS default on WPA2/WPA3 networks: one made-up MAC per network. Like a motorbike that wears a different number plate at every car park.', 'Đây là mặc định của macOS với mạng WPA2/WPA3: mỗi mạng một MAC "bịa". Như chiếc xe máy mỗi bãi gửi lại đeo một biển số khác.'],
      },
      {
        target: 'controls',
        title: ['Your turn: DHCP in four packets', 'Đến lượt bạn: DHCP trong bốn gói'],
        body: ['Press Step until the Ack. Discover ("anyone giving addresses?"), Offer, Request, Ack — like asking the dorm front desk for a room.', 'Bấm Bước tới khi tới Ack. Discover ("ai đang phát địa chỉ?"), Offer, Request, Ack — như hỏi lễ tân ký túc xá xin phòng.'],
        task: { text: ['Step to the DHCP Ack.', 'Bấm tới DHCP Ack.'], until: (s) => s.wifi?.preset === 'register' && ((s.wifi?.i as number) ?? 0) >= 3, solve: [step(3)] },
      },
      {
        target: 'wifi-term',
        title: ['A lease of 7200 seconds', 'Hợp đồng thuê 7200 giây'],
        body: ['These are the real lines from the lab: the laptop now has 10.20.1.177 for 2 hours. The IP is borrowed — it is not what the school registers.', 'Đây là các dòng thật từ lab: laptop có 10.20.1.177 trong 2 giờ. IP chỉ đi mượn — không phải thứ trường đăng ký.'],
      },
      {
        target: 'controls',
        title: ['Your turn: the probe', 'Đến lượt bạn: câu hỏi dò'],
        body: ['Step twice. macOS fetches captive.apple.com over HTTP and gets a 302 instead of "Success" ⇒ the login window opens. Over HTTPS: a certificate error.', 'Bấm Bước hai lần. macOS tải captive.apple.com qua HTTP và nhận 302 thay vì "Success" ⇒ cửa sổ đăng nhập bật lên. Qua HTTPS: lỗi chứng chỉ.'],
        task: { text: ['Step to the HTTPS certificate error.', 'Bấm tới lỗi chứng chỉ HTTPS.'], until: (s) => ((s.wifi?.i as number) ?? 0) >= 5, solve: [step(2)] },
      },
      {
        target: 'wifi-reg',
        title: ['Your turn: log in', 'Đến lượt bạn: đăng nhập'],
        body: ['Step once more. Watch the table: the controller writes SE12345 ↔ the MAC of the frame that carried your login — not your name, not your IP.', 'Bấm Bước thêm một lần. Xem bảng: bộ điều khiển ghi SE12345 ↔ MAC của frame chở lời đăng nhập — không phải tên, không phải IP.'],
        task: { text: ['Log in (last step).', 'Đăng nhập (bước cuối).'], until: (s) => s.wifi?.regMac === '26:3a:91:c4:5e:10' && s.wifi?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'where',
        title: ['Where in the computer?', 'Ở đâu trong máy?'],
        body: ['The list "account ↔ MAC" and the firewall rules live in the RAM of the controller. Your laptop\'s Wi-Fi chip has a factory MAC, but the driver can send another one — that is all a private address is.', 'Danh sách "tài khoản ↔ MAC" và luật tường lửa nằm trong RAM của bộ điều khiển. Chip Wi-Fi của laptop có MAC nhà máy, nhưng driver có thể gửi một MAC khác — địa chỉ riêng chỉ là vậy.'],
      },
    ],
    quiz: {
      q: ['What does the controller remember when you log in?', 'Bộ điều khiển nhớ gì khi bạn đăng nhập?'],
      options: [['Your account and the MAC of your frame', 'Tài khoản và MAC của frame'], ['Your IP address', 'Địa chỉ IP của bạn'], ['Your laptop\'s brand', 'Hãng laptop']],
      answer: 0, why: ['It only sees the source MAC of the frame; IPs change with every lease.', 'Nó chỉ thấy MAC nguồn của frame; IP đổi theo từng lease.'],
    },
  },
  {
    id: 'wifi-private', ns: 'net-lab', sim: 'wifi', presets: ['private'],
    title: ['Why "registered" still means "blocked"', 'Vì sao "đã đăng ký" mà vẫn "bị chặn"'],
    summary: ['Reproduce the real bug: a private Wi-Fi address gives SSID 2 a different MAC. Then fix it with one switch.', 'Tái hiện lỗi thật: địa chỉ Wi-Fi riêng làm SSID 2 thấy một MAC khác. Rồi sửa bằng một công tắc.'],
    steps: [
      {
        target: 'wifi-mode', do: [{ a: 'wifi.preset', v: 'private' }, { a: 'wifi.mode', v: 'fixed' }, { a: 'player.reset' }],
        title: ['Fixed: one MAC per network', 'Cố định: mỗi mạng một MAC'],
        body: ['The MacBook registered on SSID 1 with 26:3a:91:c4:5e:10. Now it moves to SSID 2, the one with Internet.', 'MacBook đã đăng ký ở SSID 1 với 26:3a:91:c4:5e:10. Giờ nó sang SSID 2, mạng có Internet.'],
      },
      {
        target: 'controls',
        title: ['Your turn: go to SSID 2', 'Đến lượt bạn: sang SSID 2'],
        body: ['Play to the end and read the explanation box after each step.', 'Chạy tới cuối và đọc ô giải thích sau mỗi bước.'],
        task: { text: ['Run the scenario to the end.', 'Chạy kịch bản tới cuối.'], until: (s) => s.wifi?.preset === 'private' && s.wifi?.mode === 'fixed' && s.wifi?.atEnd === true, solve: [{ a: 'player.end', delay: 500 }] },
      },
      {
        target: 'wifi-status',
        title: ['Blocked — and nothing says why', 'Bị chặn — và chẳng gì nói lý do'],
        body: ['On SSID 2 the card used 9a:7f:02:b8:41:6d. Second hex character "a" ⇒ a private address. The controller only knows 26:3a:… ⇒ "device not registered".', 'Ở SSID 2, card dùng 9a:7f:02:b8:41:6d. Ký tự hex thứ hai là "a" ⇒ địa chỉ riêng. Bộ điều khiển chỉ biết 26:3a:… ⇒ "thiết bị chưa đăng ký".'],
      },
      {
        target: 'wifi-mode',
        title: ['Your turn: turn it Off', 'Đến lượt bạn: Tắt nó'],
        body: ['Set "Private Wi-Fi address" to Off — on a real Mac: System Settings → Wi-Fi → Details… → Private Wi-Fi Address. Do it for BOTH school SSIDs.', 'Đặt "Địa chỉ Wi-Fi riêng" = Tắt — trên Mac thật: Cài đặt hệ thống → Wi-Fi → Chi tiết… → Địa chỉ Wi-Fi riêng. Làm cho CẢ HAI SSID của trường.'],
        task: { text: ['Choose Off.', 'Chọn Tắt.'], until: (s) => s.wifi?.mode === 'off', solve: [{ a: 'wifi.mode', v: 'off', delay: 300 }] },
      },
      {
        target: 'controls',
        title: ['Your turn: try again', 'Đến lượt bạn: thử lại'],
        body: ['Run it to the end again. Same hardware MAC on both SSIDs ⇒ one registration covers both.', 'Chạy lại tới cuối. Cùng MAC phần cứng trên cả hai SSID ⇒ một lần đăng ký phủ cả hai.'],
        task: { text: ['Run to the end with Off.', 'Chạy tới cuối với Tắt.'], until: (s) => s.wifi?.mode === 'off' && s.wifi?.macNet === 'ok' && s.wifi?.atEnd === true, solve: [{ a: 'player.end', delay: 500 }] },
      },
      {
        target: 'wifi-mode',
        title: ['And Rotating?', 'Còn Luân phiên?'],
        body: ['Try Rotating yourself: macOS picks a new private address every 2 weeks (Windows "Change daily": every day) — it works, then one day it stops. The address "2 weeks later" in this lab is computed.', 'Tự thử Luân phiên: macOS chọn địa chỉ riêng mới sau mỗi 2 tuần (Windows "Change daily": mỗi ngày) — đang chạy rồi một ngày nọ thì thôi. Địa chỉ "2 tuần sau" trong lab này là tính ra.'],
      },
    ],
    quiz: {
      q: ['Your MAC is 9a:7f:02:b8:41:6d. Factory or private?', 'MAC của bạn là 9a:7f:02:b8:41:6d. Nhà máy hay riêng?'],
      options: [['Private — the 2nd hex character is a', 'Riêng — ký tự hex thứ hai là a'], ['Factory — it starts with 9', 'Nhà máy — nó bắt đầu bằng 9'], ['You cannot tell', 'Không biết được']],
      answer: 0, why: ['2, 6, A or E in the 2nd position ⇒ the "locally administered" bit is 1.', '2, 6, A hoặc E ở vị trí thứ hai ⇒ bit "tự quản" bằng 1.'],
    },
  },
  {
    id: 'wifi-clone', ns: 'net-lab', sim: 'wifi', presets: ['clone'],
    title: ['One account, two laptops', 'Một tài khoản, hai laptop'],
    summary: ['See why the second laptop kicks the first, and what really happens when two machines share one MAC.', 'Thấy vì sao laptop thứ hai đá laptop thứ nhất, và chuyện thật sự xảy ra khi hai máy chung một MAC.'],
    steps: [
      {
        target: 'wifi-reg', do: [{ a: 'wifi.preset', v: 'clone' }, { a: 'player.reset' }],
        title: ['One line per account', 'Mỗi tài khoản một dòng'],
        body: ['The controller keeps exactly one MAC per account — like a parking card that opens the gate for one number plate.', 'Bộ điều khiển giữ đúng một MAC cho mỗi tài khoản — như thẻ gửi xe chỉ mở cổng cho một biển số.'],
      },
      {
        target: 'controls',
        title: ['Your turn: Windows logs in', 'Đến lượt bạn: Windows đăng nhập'],
        body: ['Step twice. The Windows laptop logs in with the same account and the Mac is kicked out.', 'Bấm Bước hai lần. Laptop Windows đăng nhập cùng tài khoản và Mac bị đá ra.'],
        task: { text: ['Step until the Mac is kicked.', 'Bấm tới khi Mac bị đá.'], until: (s) => s.wifi?.macNet === 'kicked', solve: [step(2)] },
      },
      {
        target: 'controls',
        title: ['Your turn: the copy-cat', 'Đến lượt bạn: máy chép MAC'],
        body: ['Run to the end. A third machine copies the Windows MAC: same IP, past the login page — then watch the switch table.', 'Chạy tới cuối. Một máy thứ ba chép MAC của Windows: cùng IP, qua luôn trang đăng nhập — rồi xem bảng của switch.'],
        task: { text: ['Run to the end.', 'Chạy tới cuối.'], until: (s) => s.wifi?.preset === 'clone' && s.wifi?.atEnd === true, solve: [{ a: 'player.end', delay: 500 }] },
      },
      {
        target: 'wifi-fdb',
        title: ['84 flips in 5 seconds', '84 lần lật trong 5 giây'],
        body: ['The switch learns "this MAC is behind this port" from every frame. Two cards, one MAC ⇒ it changes its mind back and forth, and packets reach the wrong laptop, which answers with a TCP reset.', 'Switch học "MAC này ở sau cổng này" từ mọi frame. Hai card, một MAC ⇒ nó đổi ý qua lại, gói tới nhầm laptop, laptop đó trả TCP reset.'],
      },
      {
        target: 'wifi-term',
        title: ['Ping lied', 'Ping nói dối'],
        body: ['Both downloads died, yet ping showed 0% loss. Never judge a network by ping alone. And copying a MAC to skip the login is exactly what an attacker would do — registration by MAC is weak security.', 'Cả hai lượt tải chết, vậy mà ping báo mất 0%. Đừng đánh giá mạng chỉ bằng ping. Và chép MAC để khỏi đăng nhập đúng là việc kẻ tấn công làm — đăng ký theo MAC là lớp bảo mật yếu.'],
      },
    ],
    quiz: {
      q: ['Two laptops share a MAC. Downloads break but ping is fine. Why?', 'Hai laptop chung MAC. Tải tệp hỏng mà ping ổn. Vì sao?'],
      options: [['The switch table flips; data reaches the wrong laptop, which sends RST', 'Bảng switch lật; dữ liệu tới nhầm laptop, laptop đó gửi RST'], ['The Wi-Fi is too slow', 'Wi-Fi quá chậm'], ['DHCP ran out of addresses', 'DHCP hết địa chỉ']],
      answer: 0, why: ['Ping replies come back within microseconds and win the race; long TCP transfers do not.', 'Trả lời ping về trong vài micro giây nên thắng cuộc đua; truyền TCP dài thì không.'],
    },
  },
  // ───────────────────────── block ─────────────────────────
  {
    id: 'block-web', ns: 'net-lab', sim: 'block', presets: ['web'],
    title: ['DNS filter vs SNI filter', 'Lọc DNS và lọc SNI'],
    summary: ['Two ways a school blocks a website, and the different error each one gives.', 'Hai cách trường chặn một trang web, và lỗi khác nhau mỗi cách sinh ra.'],
    steps: [
      {
        target: 'blk-rules', do: [{ a: 'block.preset', v: 'web' }],
        title: ['The school\'s rules', 'Luật của trường'],
        body: ['Two rules are on: a DNS filter (a phone book with phim.test crossed out) and an SNI filter (a postman reading "social.test" on the envelope).', 'Hai luật đang bật: lọc DNS (danh bạ gạch tên phim.test) và lọc SNI (người đưa thư đọc chữ "social.test" ngoài phong bì).'],
      },
      {
        target: 'controls',
        title: ['Your turn: a film site', 'Đến lượt bạn: trang phim'],
        body: ['Run the request to phim.test to the end. It dies at the very first stop that matters: DNS.', 'Chạy request tới phim.test đến cuối. Nó chết ngay trạm đầu tiên có ý nghĩa: DNS.'],
        task: { text: ['Run phim.test to the end.', 'Chạy phim.test tới cuối.'], until: (s) => s.block?.req === 'phim' && s.block?.stop === 'dns' && s.block?.atEnd === true, solve: [{ a: 'block.req', v: 'phim' }, { a: 'player.end', delay: 500 }] },
      },
      {
        target: 'blk-term',
        title: ['NXDOMAIN', 'NXDOMAIN'],
        body: ['"Could not resolve host" — the real lab line. Nothing was ever sent to the site. Asking another DNS would get around it, which is why schools also block outside DNS.', '"Could not resolve host" — dòng thật của lab. Chưa gói nào tới trang. Hỏi DNS khác là qua, vì thế trường chặn luôn DNS ra ngoài.'],
      },
      {
        target: 'blk-req',
        title: ['Your turn: social.test over HTTPS', 'Đến lượt bạn: social.test qua HTTPS'],
        body: ['Pick the social site over HTTPS and run it. DNS answers fine — the name is visible later, in the TLS ClientHello.', 'Chọn mạng xã hội qua HTTPS rồi chạy. DNS trả lời bình thường — cái tên lộ ra muộn hơn, trong ClientHello của TLS.'],
        task: { text: ['Run social.test (HTTPS) to the end.', 'Chạy social.test (HTTPS) tới cuối.'], until: (s) => s.block?.req === 'social' && s.block?.stop === 'sni' && s.block?.atEnd === true, solve: [{ a: 'block.req', v: 'social' }, { a: 'player.end', delay: 500 }] },
      },
      {
        target: 'blk-hit',
        title: ['An instant reset', 'Bị reset ngay'],
        body: ['The firewall found the bytes "social.test" and answered with a TCP reset. news.test lives on the SAME IP and still works: this is blocking by name, not by address. HTTPS hides the page, not the site name.', 'Tường lửa thấy chuỗi "social.test" và trả TCP reset. news.test ở CÙNG IP vẫn chạy: đây là chặn theo tên, không theo địa chỉ. HTTPS giấu trang, không giấu tên trang.'],
      },
    ],
    quiz: {
      q: ['A site resets instantly over HTTPS, while another site on the same IP works. Mechanism?', 'Một trang bị reset ngay qua HTTPS, trang khác cùng IP vẫn chạy. Cơ chế?'],
      options: [['SNI filter', 'Lọc SNI'], ['DNS filter', 'Lọc DNS'], ['IP blacklist', 'Danh sách đen IP']],
      answer: 0, why: ['Same IP rules out IP blocking; DNS resolved fine; the name in the ClientHello is what differs.', 'Cùng IP nên không phải chặn IP; DNS vẫn trả lời; thứ khác nhau là tên trong ClientHello.'],
    },
  },
  {
    id: 'block-hotspot', ns: 'net-lab', sim: 'block', presets: ['hotspot'],
    title: ['How a network spots your hotspot', 'Mạng nhận ra điểm phát của bạn thế nào'],
    summary: ['The phone hides behind the laptop\'s NAT — same MAC, same IP — but not behind its TTL.', 'Điện thoại núp sau NAT của laptop — cùng MAC, cùng IP — nhưng không núp được sau TTL.'],
    steps: [
      {
        target: 'blk-ttl', do: [{ a: 'block.preset', v: 'hotspot' }],
        title: ['Same MAC, same IP', 'Cùng MAC, cùng IP'],
        body: ['Real capture on the controller: two SYN packets from 8c:8d:28:4e:7a:12 / 10.20.2.159 — one with TTL 64 (the laptop), one with TTL 63 (the phone, routed by the laptop).', 'Bắt thật trên bộ điều khiển: hai gói SYN từ 8c:8d:28:4e:7a:12 / 10.20.2.159 — một TTL 64 (laptop), một TTL 63 (điện thoại, do laptop định tuyến).'],
      },
      {
        target: 'controls',
        title: ['Your turn: no TTL rule yet', 'Đến lượt bạn: chưa có luật TTL'],
        body: ['Run the phone\'s request to the end: it passes every checkpoint.', 'Chạy request của điện thoại tới cuối: nó qua hết mọi trạm.'],
        task: { text: ['Run to the end.', 'Chạy tới cuối.'], until: (s) => s.block?.req === 'phone' && s.block?.ok === true && s.block?.atEnd === true, solve: [{ a: 'player.end', delay: 500 }] },
      },
      {
        target: 'blk-rules',
        title: ['Your turn: switch on the TTL rule', 'Đến lượt bạn: bật luật TTL'],
        body: ['Turn on "Drop TTL 63/127". In the lab it sits in PREROUTING — by the FORWARD chain the router has already lowered the TTL, and our first try blocked the laptop instead.', 'Bật "Bỏ TTL 63/127". Ở lab nó nằm ở PREROUTING — tới chuỗi FORWARD thì router đã trừ TTL rồi, và lần thử đầu của ta đã chặn nhầm laptop.'],
        task: { text: ['Turn on the TTL rule.', 'Bật luật TTL.'], until: (s) => String(s.block?.rules ?? '').includes('ttl'), solve: [{ a: 'block.on', v: 'ttl', delay: 300 }] },
      },
      {
        target: 'controls',
        title: ['Your turn: try again', 'Đến lượt bạn: thử lại'],
        body: ['Run it again: the phone is dropped — even its DNS question ("Resolving timed out").', 'Chạy lại: điện thoại bị bỏ — kể cả câu hỏi DNS ("Resolving timed out").'],
        task: { text: ['Run to the end.', 'Chạy tới cuối.'], until: (s) => s.block?.stop === 'ttl' && s.block?.atEnd === true, solve: [{ a: 'player.end', delay: 500 }] },
      },
    ],
    quiz: {
      q: ['Why does the phone arrive with TTL 63?', 'Vì sao điện thoại tới với TTL 63?'],
      options: [['The laptop routes its packets and lowers TTL by one', 'Laptop định tuyến gói của nó và trừ TTL đi một'], ['Phones always use 63', 'Điện thoại luôn dùng 63'], ['The Wi-Fi is weak', 'Sóng Wi-Fi yếu']],
      answer: 0, why: ['Every router lowers TTL by 1; phones start at 64 like Linux and macOS.', 'Mọi router trừ TTL đi 1; điện thoại bắt đầu từ 64 như Linux và macOS.'],
    },
  },
  {
    id: 'block-game', ns: 'net-lab', sim: 'block', presets: ['game'],
    title: ['Why games and SSH die', 'Vì sao game và SSH chết'],
    summary: ['A TCP-only network with a short list of open ports: games (UDP) go silent, SSH on 22 times out, SSH on 993 still answers.', 'Mạng chỉ cho TCP với vài cổng được mở: game (UDP) im lặng, SSH ở 22 hết giờ, SSH ở 993 vẫn trả lời.'],
    steps: [
      {
        target: 'blk-rules', do: [{ a: 'block.preset', v: 'game' }],
        title: ['Three blunt rules', 'Ba luật thô'],
        body: ['Blacklist the VPN IP; open only TCP 80/443/587/993 (web and mail); drop all UDP. Like a building that opens only four doors.', 'Danh sách đen IP VPN; chỉ mở TCP 80/443/587/993 (web và email); bỏ mọi UDP. Như toà nhà chỉ mở bốn cửa.'],
      },
      {
        target: 'controls',
        title: ['Your turn: the game', 'Đến lượt bạn: trò chơi'],
        body: ['Run the game request (UDP 27015). UDP has no handshake, so the drop is pure silence.', 'Chạy request của game (UDP 27015). UDP không bắt tay nên bị bỏ thì chỉ là im lặng.'],
        task: { text: ['Run the game to the end.', 'Chạy game tới cuối.'], until: (s) => s.block?.req === 'game' && s.block?.stop === 'port' && s.block?.atEnd === true, solve: [{ a: 'player.end', delay: 500 }] },
      },
      {
        target: 'blk-req',
        title: ['Your turn: SSH on 993', 'Đến lượt bạn: SSH ở 993'],
        body: ['Pick "SSH on port 993" and run it. The same server, a door the school must keep open for email — developers use exactly this (lesson 14.3).', 'Chọn "SSH ở cổng 993" rồi chạy. Cùng máy chủ, một cửa trường buộc phải mở cho email — lập trình viên dùng đúng cách này (bài 14.3).'],
        task: { text: ['Run SSH 993 to the end.', 'Chạy SSH 993 tới cuối.'], until: (s) => s.block?.req === 'ssh993' && s.block?.ok === true && s.block?.atEnd === true, solve: [{ a: 'block.req', v: 'ssh993' }, { a: 'player.end', delay: 500 }] },
      },
    ],
    quiz: {
      q: ['A game fails on school Wi-Fi but its shop page loads. Most likely?', 'Game không chơi được trên Wi-Fi trường nhưng trang cửa hàng vẫn mở. Khả năng cao nhất?'],
      options: [['UDP or its ports are blocked', 'UDP hoặc cổng của nó bị chặn'], ['DNS is broken', 'DNS hỏng'], ['The phone is not registered', 'Điện thoại chưa đăng ký']],
      answer: 0, why: ['The shop is HTTPS on TCP 443, which is open; the match uses UDP on its own ports.', 'Trang cửa hàng là HTTPS trên TCP 443, vốn được mở; trận đấu dùng UDP ở cổng riêng.'],
    },
  },

  // ───────────────────────── tunnel (14.3) ─────────────────────────
  {
    id: 'tunnel-port', ns: 'net-lab', sim: 'tunnel', presets: ['port'],
    title: ['22 or 993? Let the laptop decide', '22 hay 993? Để laptop tự quyết'],
    summary: ['Reproduce the real mistake — a Match block that is true but comes too late — then fix it and take the same laptop home.', 'Tái hiện lỗi thật — khối Match đúng nhưng đến quá muộn — rồi sửa nó và mang cùng laptop về nhà.'],
    steps: [
      {
        target: 'tun-topo', do: [{ a: 'tunnel.preset', v: 'port' }, { a: 'tunnel.place', v: 'school' }, { a: 'tunnel.order', v: 'last' }, { a: 'player.reset' }],
        title: ['Laptop, school firewall, VPS', 'Laptop, tường lửa trường, VPS'],
        body: ['The school opens only TCP 80/443/587/993. The VPS answers SSH on 22 (ssh.socket) and on 993 (a separate ssh993.service). Like a building whose main gate is locked at night while the mail door stays open.', 'Trường chỉ mở TCP 80/443/587/993. VPS trả lời SSH ở 22 (ssh.socket) và ở 993 (một ssh993.service riêng). Như toà nhà khoá cổng chính ban đêm còn cửa thư từ vẫn mở.'],
      },
      {
        target: 'tun-config',
        title: ['The config, as first written', 'Config, như lúc mới viết'],
        body: ['A Match block says "if my address is 10.20.2.x, use Port 993". But it sits AFTER Host vps, which already says Port 22. ssh keeps the FIRST value it meets.', 'Khối Match nói "nếu địa chỉ của mình là 10.20.2.x thì dùng Port 993". Nhưng nó đứng SAU Host vps, vốn đã nói Port 22. ssh giữ giá trị ĐẦU TIÊN nó gặp.'],
      },
      {
        target: 'controls',
        title: ['Your turn: connect from school', 'Đến lượt bạn: nối từ trường'],
        body: ['Run it to the end and read where the SYN dies.', 'Chạy tới cuối và đọc xem gói SYN chết ở đâu.'],
        task: { text: ['Run the scenario to the end.', 'Chạy kịch bản tới cuối.'], until: (s) => s.tunnel?.preset === 'port' && s.tunnel?.order === 'last' && s.tunnel?.atEnd === true, solve: [{ a: 'player.end', delay: 500 }] },
      },
      {
        target: 'tun-term',
        title: ['The real timeout', 'Lần hết giờ thật'],
        body: ['This line is the lab\'s real output: port 22 times out. Nothing tells you "blocked" — the packet just vanished at the firewall.', 'Dòng này là output thật của lab: cổng 22 hết giờ. Chẳng gì báo "bị chặn" — gói chỉ biến mất ở tường lửa.'],
      },
      {
        target: 'tun-opts',
        title: ['Your turn: move Match to the top', 'Đến lượt bạn: đưa Match lên đầu'],
        body: ['Choose "first in the file" and run again.', 'Chọn "đầu tệp" rồi chạy lại.'],
        task: { text: ['Put Match first and run to the end.', 'Đưa Match lên đầu và chạy tới cuối.'], until: (s) => s.tunnel?.order === 'first' && s.tunnel?.place === 'school' && s.tunnel?.port === 993 && s.tunnel?.atEnd === true, solve: [{ a: 'tunnel.order', v: 'first' }, { a: 'player.end', delay: 600 }] },
      },
      {
        target: 'tun-opts',
        title: ['Your turn: take the laptop home', 'Đến lượt bạn: mang laptop về nhà'],
        body: ['Same file, at home (192.168.1.x). The Match test fails, so ssh uses 22 — nothing to type differently.', 'Cùng tệp, ở nhà (192.168.1.x). Phép thử của Match thất bại nên ssh dùng 22 — không phải gõ gì khác.'],
        task: { text: ['Switch to "at home" and run to the end.', 'Chuyển sang "ở nhà" và chạy tới cuối.'], until: (s) => s.tunnel?.place === 'home' && s.tunnel?.order === 'first' && s.tunnel?.port === 22 && s.tunnel?.atEnd === true, solve: [{ a: 'tunnel.place', v: 'home' }, { a: 'player.end', delay: 600 }] },
      },
      {
        target: 'where',
        title: ['Where in the computer?', 'Ở đâu trong máy?'],
        body: ['ssh is an ordinary process; it reads ~/.ssh/config every time it starts. On the VPS, port 22 belongs to PID 1 (systemd) until a connection arrives.', 'ssh là một tiến trình bình thường; nó đọc ~/.ssh/config mỗi lần chạy. Trên VPS, cổng 22 thuộc PID 1 (systemd) cho tới khi có kết nối.'],
      },
    ],
    quiz: {
      q: ['Match (Port 993) is at the END of ~/.ssh/config, after Host vps (Port 22). At school, ssh uses…', 'Match (Port 993) ở CUỐI ~/.ssh/config, sau Host vps (Port 22). Ở trường, ssh dùng…'],
      options: [['22 — the first value wins', '22 — giá trị đầu tiên thắng'], ['993 — the last value wins', '993 — giá trị cuối thắng'], ['both, in turn', 'cả hai, lần lượt']],
      answer: 0, why: ['For each option ssh keeps the first value obtained; Host vps set Port 22 earlier.', 'Với mỗi tuỳ chọn ssh giữ giá trị lấy được đầu tiên; Host vps đã đặt Port 22 trước.'],
    },
  },
  {
    id: 'tunnel-forward', ns: 'net-lab', sim: 'tunnel', presets: ['forward'],
    title: ['-L pulls, -R pushes', '-L kéo về, -R đẩy ra'],
    summary: ['Open the VPS\'s database on your laptop, then show the demo on your laptop to a friend — and see why the first -R is refused.', 'Mở CSDL của VPS trên laptop, rồi khoe bản demo trên laptop cho bạn — và thấy vì sao lần -R đầu bị từ chối.'],
    steps: [
      {
        target: 'tun-topo', do: [{ a: 'tunnel.preset', v: 'forward' }, { a: 'tunnel.fwd', v: 'L' }, { a: 'player.reset' }],
        title: ['A database that never faces the Internet', 'Một CSDL không bao giờ ra Internet'],
        body: ['Redis on the VPS listens on 127.0.0.1 only — as it should. -L makes a door on your laptop that comes out INSIDE the VPS.', 'Redis trên VPS chỉ nghe 127.0.0.1 — đúng như nên thế. -L làm một cánh cửa trên laptop đi ra BÊN TRONG VPS.'],
      },
      {
        target: 'controls',
        title: ['Your turn: -L', 'Đến lượt bạn: -L'],
        body: ['Step through: direct timeout, the tunnel, redis-cli to the laptop\'s own port, PONG.', 'Bấm qua từng bước: gọi thẳng hết giờ, đường hầm, redis-cli vào chính cổng của laptop, PONG.'],
        task: { text: ['Run -L to the end.', 'Chạy -L tới cuối.'], until: (s) => s.tunnel?.preset === 'forward' && s.tunnel?.fwd === 'L' && s.tunnel?.tone === 'ok' && s.tunnel?.atEnd === true, solve: [{ a: 'player.end', delay: 500 }] },
      },
      {
        target: 'tun-listen',
        title: ['Who listens, who exits', 'Ai nghe, ai đi ra'],
        body: ['-L: the laptop listens, the VPS opens the real connection. -R: the other way round.', '-L: laptop nghe, VPS mở kết nối thật. -R: ngược lại.'],
      },
      {
        target: 'tun-opts',
        title: ['Your turn: -R for your demo', 'Đến lượt bạn: -R cho bản demo'],
        body: ['Choose -R 8080:localhost:3000 and run it. Will your friend at home see the demo?', 'Chọn -R 8080:localhost:3000 rồi chạy. Bạn ở nhà có xem được demo không?'],
        task: { text: ['Run -R to the end.', 'Chạy -R tới cuối.'], until: (s) => s.tunnel?.fwd === 'R' && s.tunnel?.tone === 'bad' && s.tunnel?.atEnd === true, solve: [{ a: 'tunnel.fwd', v: 'R' }, { a: 'player.end', delay: 600 }] },
      },
      {
        target: 'tun-opts',
        title: ['Your turn: allow it on purpose', 'Đến lượt bạn: cho phép có chủ đích'],
        body: ['The server must allow GatewayPorts; then -R 0.0.0.0:8080. Remember to close it after the demo.', 'Máy chủ phải cho GatewayPorts; rồi -R 0.0.0.0:8080. Nhớ đóng nó sau buổi demo.'],
        task: { text: ['Run -R 0.0.0.0 to the end.', 'Chạy -R 0.0.0.0 tới cuối.'], until: (s) => s.tunnel?.fwd === 'R0' && s.tunnel?.tone === 'ok' && s.tunnel?.atEnd === true, solve: [{ a: 'tunnel.fwd', v: 'R0' }, { a: 'player.end', delay: 600 }] },
      },
    ],
    quiz: {
      q: ['Your friend gets "connection refused" on vps.example:8080 after your ssh -R 8080:localhost:3000. Why?', 'Bạn ở nhà bị "từ chối kết nối" ở vps.example:8080 sau lệnh ssh -R 8080:localhost:3000 của bạn. Vì sao?'],
      options: [['The forward listens on the VPS\'s 127.0.0.1 only', 'Đường hầm chỉ nghe 127.0.0.1 của VPS'], ['The school blocks 8080', 'Trường chặn cổng 8080'], ['The demo is down', 'Bản demo đã tắt']],
      answer: 0, why: ['Remote forwards bind to loopback unless the server allows GatewayPorts.', 'Đường hầm ngược nghe trên loopback trừ khi máy chủ cho GatewayPorts.'],
    },
  },
  {
    id: 'tunnel-socks', ns: 'net-lab', sim: 'tunnel', presets: ['socks'],
    title: ['-D: a proxy through the VPS — and its leaks', '-D: proxy qua VPS — và những chỗ rò'],
    summary: ['Pass the SNI block through SOCKS, catch a DNS leak (socks5 vs socks5h), and see a stranger use a SOCKS left open.', 'Qua chặn SNI bằng SOCKS, bắt một chỗ rò DNS (socks5 và socks5h), và thấy người lạ dùng SOCKS bị để mở.'],
    steps: [
      {
        target: 'tun-topo', do: [{ a: 'tunnel.preset', v: 'socks' }, { a: 'tunnel.req', v: 'direct' }, { a: 'player.reset' }],
        title: ['The SNI rule from 14.2 is still on', 'Luật SNI của 14.2 vẫn bật'],
        body: ['social.test over HTTPS is reset at the school firewall: it reads the name in the ClientHello.', 'social.test qua HTTPS bị reset ở tường lửa trường: nó đọc tên trong ClientHello.'],
      },
      {
        target: 'controls',
        title: ['Your turn: direct', 'Đến lượt bạn: gọi thẳng'],
        body: ['Run the direct request to the end.', 'Chạy request gọi thẳng tới cuối.'],
        task: { text: ['Run it to the end.', 'Chạy tới cuối.'], until: (s) => s.tunnel?.preset === 'socks' && s.tunnel?.req === 'direct' && s.tunnel?.atEnd === true, solve: [{ a: 'player.end', delay: 500 }] },
      },
      {
        target: 'tun-opts',
        title: ['Your turn: through SOCKS (socks5h)', 'Đến lượt bạn: qua SOCKS (socks5h)'],
        body: ['Now the same site through ssh -D 1080, with the name sent to the VPS.', 'Giờ cùng trang đó qua ssh -D 1080, gửi cái tên sang VPS.'],
        task: { text: ['Run socks5h social.test to the end.', 'Chạy socks5h social.test tới cuối.'], until: (s) => s.tunnel?.req === 'socks5h' && s.tunnel?.tone === 'ok' && s.tunnel?.atEnd === true, solve: [{ a: 'tunnel.req', v: 'socks5h' }, { a: 'player.end', delay: 600 }] },
      },
      {
        target: 'tun-opts',
        title: ['Your turn: the leak', 'Đến lượt bạn: chỗ rò'],
        body: ['Choose "socks5 phim.test": curl resolves the name on the laptop, through the school DNS.', 'Chọn "socks5 phim.test": curl phân giải tên trên laptop, qua DNS của trường.'],
        task: { text: ['Run socks5 phim.test to the end.', 'Chạy socks5 phim.test tới cuối.'], until: (s) => s.tunnel?.req === 'socks5' && s.tunnel?.tone === 'bad' && s.tunnel?.atEnd === true, solve: [{ a: 'tunnel.req', v: 'socks5' }, { a: 'player.end', delay: 600 }] },
      },
      {
        target: 'tun-sees',
        title: ['What the school sees', 'Trường thấy gì'],
        body: ['With the leak: a DNS question for phim.test. With socks5h: only flows to the VPS on 993.', 'Khi rò: một câu hỏi DNS cho phim.test. Với socks5h: chỉ có các luồng tới VPS ở 993.'],
      },
      {
        target: 'tun-opts',
        title: ['Your turn: the SOCKS left open', 'Đến lượt bạn: SOCKS bị để mở'],
        body: ['Choose the stranger: -D 0.0.0.0:1081 by mistake, and someone on the same Wi-Fi uses it.', 'Chọn người lạ: lỡ mở -D 0.0.0.0:1081, và một người cùng Wi-Fi dùng nó.'],
        task: { text: ['Run the stranger to the end.', 'Chạy kịch bản người lạ tới cuối.'], until: (s) => s.tunnel?.req === 'stranger' && s.tunnel?.atEnd === true, solve: [{ a: 'tunnel.req', v: 'stranger' }, { a: 'player.end', delay: 600 }] },
      },
    ],
    quiz: {
      q: ['curl --socks5 127.0.0.1:1080 http://phim.test/ fails at school while --socks5-hostname works. Why?', 'curl --socks5 127.0.0.1:1080 http://phim.test/ hỏng ở trường còn --socks5-hostname chạy. Vì sao?'],
      options: [['socks5 resolves the name locally — the school DNS blocks it', 'socks5 phân giải tên tại chỗ — DNS trường chặn nó'], ['The proxy is down', 'Proxy đã tắt'], ['phim.test has no IP', 'phim.test không có IP']],
      answer: 0, why: ['With socks5 the client resolves; with socks5h (hostname) the proxy resolves.', 'Với socks5 máy khách phân giải; với socks5h (hostname) proxy phân giải.'],
    },
  },
];
