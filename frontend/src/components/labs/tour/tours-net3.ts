/**
 * Tour Chương 3 của phòng lab mạng (khoá Networking for Developers, 01/11/2026): dns / zone / ttl / anycast / dnssec.
 * Viết cho người mới tinh: thuật ngữ giải nghĩa ngay lần đầu. Mọi con số lấy từ capture thật của lab DNS (net-lab/engine/capture3.ts)
 * hoặc được nói rõ là TÍNH RA. Trạng thái cuối mỗi tour được kiểm trong tours.test.ts (FINAL).
 */
import type { Tour } from './types';

const step = (n: number, delay = 650) => ({ a: 'player.step', delay, upTo: n });

export const NET3_TOURS: Tour[] = [
  // ───────────────────────── dns ─────────────────────────
  {
    id: 'dns-trace', ns: 'net-lab', sim: 'dns', presets: ['trace'],
    title: ['One lookup, nine questions', 'Một lần tra, chín câu hỏi'],
    summary: ['Replay every packet the ISP’s resolver sent to answer www.labflow.test — then see the second lookup cost nothing.', 'Phát lại từng gói resolver nhà mạng gửi để trả lời www.labflow.test — rồi thấy lần tra thứ hai không tốn gì.'],
    steps: [
      {
        target: 'dns-topo', do: [{ a: 'dns.preset', v: 'trace' }, { a: 'player.reset' }],
        title: ['Four roles', 'Bốn vai'],
        body: ['The laptop’s stub asks ONE resolver. The resolver walks the tree: root (knows the TLDs), TLD .test (knows the domains), and LabFlow’s ns1/ns2 (own the records).', 'Stub trên laptop hỏi MỘT resolver. Resolver đi dọc cây: máy chủ gốc (biết các TLD), TLD .test (biết các tên miền), và ns1/ns2 của LabFlow (giữ bản ghi).'],
      },
      {
        target: 'controls',
        title: ['Your turn: priming and the root', 'Đến lượt bạn: mồi và máy chủ gốc'],
        body: ['Press Step four times. First the resolver checks the root list, then asks the root about “test” — not the full name (QNAME minimisation).', 'Bấm Bước bốn lần. Đầu tiên resolver kiểm danh sách máy chủ gốc, rồi hỏi máy chủ gốc về “test” — không phải cả cái tên (QNAME minimisation).'],
        task: { text: ['Step to the root’s referral.', 'Bấm Bước tới lời giới thiệu của máy chủ gốc.'], until: (s) => s.dns?.preset === 'trace' && ((s.dns?.i as number) ?? 0) >= 4, solve: [step(4)] },
      },
      {
        target: 'dns-capture',
        title: ['A referral', 'Một lời giới thiệu'],
        body: ['“referral” = no answer, but “ask ns1.nic.test, here is its address (glue)”. The same happens one level down at the TLD.', '“referral” = không có câu trả lời, mà là “hãy hỏi ns1.nic.test, đây là địa chỉ của nó (glue)”. Ở TLD, cấp dưới, cũng y như vậy.'],
      },
      {
        target: 'controls',
        title: ['Your turn: the owner’s answer', 'Đến lượt bạn: câu trả lời của chính chủ'],
        body: ['Keep stepping until LabFlow’s server answers with the flag aa (authoritative answer).', 'Tiếp tục bấm Bước tới khi máy chủ của LabFlow trả lời kèm cờ aa (trả lời có thẩm quyền).'],
        task: { text: ['Step to the aa answer.', 'Bấm Bước tới câu trả lời aa.'], until: (s) => ((s.dns?.i as number) ?? 0) >= 8, solve: [step(8)] },
      },
      {
        target: 'dns-kpi',
        title: ['Your turn: the cost, and the cache', 'Đến lượt bạn: cái giá, và cache'],
        body: ['Go to the end. The first lookup sent 9 questions upstream (with 3 DNSKEY fetches for DNSSEC). The second one: answered from the cache, 0 questions.', 'Đi tới cuối. Lần tra đầu gửi 9 câu ra ngoài (có 3 lần lấy DNSKEY cho DNSSEC). Lần thứ hai: trả lời từ cache, 0 câu.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.dns?.cacheHit === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'where',
        title: ['Where in the computer?', 'Ở đâu trong máy?'],
        body: ['The resolver’s cache is a hash table in the RAM of one process (Unbound). Each question is one small UDP packet to port 53.', 'Cache của resolver là một bảng băm trong RAM của một tiến trình (Unbound). Mỗi câu hỏi là một gói UDP nhỏ tới cổng 53.'],
      },
    ],
    quiz: {
      q: ['Why did the root server only see “test”, not “www.labflow.test”?', 'Vì sao máy chủ gốc chỉ thấy “test”, không thấy “www.labflow.test”?'],
      options: [['QNAME minimisation: each server gets only the part of the name it needs', 'QNAME minimisation: mỗi máy chủ chỉ nhận phần tên nó cần'], ['The root cannot store long names', 'Máy chủ gốc không lưu được tên dài'], ['DNSSEC hides the rest of the name', 'DNSSEC giấu phần còn lại của tên']],
      answer: 0, why: ['RFC 9156: the root only needs to say who runs .test, so the resolver does not reveal the website you visit.', 'RFC 9156: máy chủ gốc chỉ cần nói ai vận hành .test, nên resolver không để lộ bạn vào trang nào.'],
    },
  },
  {
    id: 'dns-stub', ns: 'net-lab', sim: 'dns', presets: ['stub'],
    title: ['dig says .10, my app goes to .11', 'dig nói .10, app lại tới .11'],
    summary: ['/etc/hosts beats DNS for every program that uses getaddrinfo; search + ndots adds hidden lookups.', '/etc/hosts thắng DNS với mọi chương trình dùng getaddrinfo; search + ndots thêm các lần tra ngầm.'],
    steps: [
      {
        target: 'dns-stub-table', do: [{ a: 'dns.preset', v: 'stub' }, { a: 'dns.hosts', v: true }, { a: 'dns.ndots', v: true }],
        title: ['Two answers for one name', 'Hai câu trả lời cho một tên'],
        body: ['A forgotten line “203.0.113.11 labflow.test” in /etc/hosts. getent, curl and Node’s dns.lookup (getaddrinfo) get .11; dig and dns.resolve4 (DNS only) get .10. Real lab output.', 'Một dòng bị quên “203.0.113.11 labflow.test” trong /etc/hosts. getent, curl và dns.lookup của Node (getaddrinfo) nhận .11; dig và dns.resolve4 (chỉ DNS) nhận .10. Output thật trong lab.'],
      },
      {
        target: 'dns-stub-opts',
        title: ['Your turn: remove the line', 'Đến lượt bạn: gỡ dòng đó'],
        body: ['Click the /etc/hosts button to remove the line. Now every tool agrees.', 'Bấm nút /etc/hosts để gỡ dòng đó. Giờ mọi công cụ đều thống nhất.'],
        task: { text: ['Remove the hosts line.', 'Gỡ dòng hosts.'], until: (s) => s.dns?.hosts === false, solve: [{ a: 'dns.hosts', v: false, delay: 300 }] },
      },
      {
        target: 'dns-ndots',
        title: ['Hidden lookups', 'Các lần tra ngầm'],
        body: ['With “search labflow.test” and ndots:5 (Kubernetes uses ndots:5), labflow.cdn.test is first tried as labflow.cdn.test.labflow.test → NXDOMAIN. One wasted round trip per lookup.', 'Với “search labflow.test” và ndots:5 (Kubernetes dùng ndots:5), labflow.cdn.test bị thử trước dưới dạng labflow.cdn.test.labflow.test → NXDOMAIN. Mỗi lần tra phí một lượt đi về.'],
      },
      {
        target: 'dns-stub-opts',
        title: ['Your turn: no search domain', 'Đến lượt bạn: bỏ tên miền search'],
        body: ['Turn the search/ndots option off: every name is asked once (computed). In code, a final dot (labflow.cdn.test.) has the same effect.', 'Tắt tuỳ chọn search/ndots: mỗi tên chỉ hỏi một lần (tính ra). Trong code, dấu chấm cuối (labflow.cdn.test.) cho cùng hiệu quả.'],
        task: { text: ['Turn search + ndots off.', 'Tắt search + ndots.'], until: (s) => s.dns?.ndots === false && s.dns?.wasted === 0, solve: [{ a: 'dns.ndots', v: false, delay: 300 }] },
      },
    ],
    quiz: {
      q: ['dig shows the new IP but your Node app still connects to the old one. What do you check first?', 'dig cho thấy IP mới nhưng app Node vẫn kết nối IP cũ. Bạn kiểm gì trước?'],
      options: [['getent ahosts <name> and /etc/hosts — dns.lookup uses getaddrinfo', 'getent ahosts <tên> và /etc/hosts — dns.lookup dùng getaddrinfo'], ['The DNSSEC signatures', 'Chữ ký DNSSEC'], ['The TTL on the authoritative server', 'TTL trên máy chủ authoritative']],
      answer: 0, why: ['dig speaks DNS directly; Node’s dns.lookup (and http, fetch) go through getaddrinfo, which reads /etc/hosts first.', 'dig nói DNS trực tiếp; dns.lookup của Node (và http, fetch) đi qua getaddrinfo, thứ đọc /etc/hosts trước.'],
    },
  },
  // ───────────────────────── zone ─────────────────────────
  {
    id: 'zone-records', ns: 'net-lab', sim: 'zone', presets: ['records'],
    title: ['The records a developer touches', 'Những bản ghi lập trình viên đụng tới'],
    summary: ['CNAME, MX and SRV: what each is for and the rule that comes with it — with real dig answers.', 'CNAME, MX và SRV: mỗi cái dùng làm gì và quy tắc đi kèm — với câu trả lời dig thật.'],
    steps: [
      {
        target: 'zone-types', do: [{ a: 'zone.preset', v: 'records' }],
        title: ['Eleven types', 'Mười một loại'],
        body: ['Each button is a record type of labflow.test; the panel shows the real dig answer.', 'Mỗi nút là một loại bản ghi của labflow.test; khung bên dưới là câu trả lời dig thật.'],
      },
      {
        target: 'zone-types',
        title: ['Your turn: CNAME to a CDN', 'Đến lượt bạn: CNAME sang CDN'],
        body: ['Click CNAME→CDN. static.labflow.test points to the CDN’s own name; the resolver follows it and returns the CDN’s address — with the CDN’s much shorter TTL.', 'Bấm CNAME→CDN. static.labflow.test trỏ tới tên riêng của CDN; resolver đi theo và trả về địa chỉ của CDN — với TTL ngắn hơn nhiều của CDN.'],
        task: { text: ['Pick CNAME→CDN.', 'Chọn CNAME→CDN.'], until: (s) => s.zone?.pick === 'CDN', solve: [{ a: 'zone.pick', v: 'CDN', delay: 300 }] },
      },
      {
        target: 'zone-types',
        title: ['Your turn: mail', 'Đến lượt bạn: thư'],
        body: ['Click MX. It names a host (mail.labflow.test) — never an IP, never a CNAME.', 'Bấm MX. Nó gọi tên một máy (mail.labflow.test) — không bao giờ là IP, không bao giờ là CNAME.'],
        task: { text: ['Pick MX.', 'Chọn MX.'], until: (s) => s.zone?.pick === 'MX', solve: [{ a: 'zone.pick', v: 'MX', delay: 300 }] },
      },
      {
        target: 'zone-answer',
        title: ['Your turn: mongodb+srv', 'Đến lượt bạn: mongodb+srv'],
        body: ['Click SRV: host + port for _mongodb._tcp.db.labflow.test — exactly what a mongodb+srv:// string makes the driver look up.', 'Bấm SRV: máy + cổng cho _mongodb._tcp.db.labflow.test — đúng thứ chuỗi mongodb+srv:// khiến driver đi tra.'],
        task: { text: ['Pick SRV.', 'Chọn SRV.'], until: (s) => s.zone?.pick === 'SRV', solve: [{ a: 'zone.pick', v: 'SRV', delay: 300 }] },
      },
    ],
    quiz: {
      q: ['Why can’t labflow.test itself (the apex) be a CNAME?', 'Vì sao chính labflow.test (đỉnh) không thể là CNAME?'],
      options: [['A CNAME cannot coexist with other records, and the apex always has SOA and NS', 'CNAME không đứng chung được với bản ghi khác, mà đỉnh luôn có SOA và NS'], ['CNAMEs are too slow', 'CNAME quá chậm'], ['Only Cloudflare allows CNAMEs', 'Chỉ Cloudflare cho phép CNAME']],
      answer: 0, why: ['Providers work around it with CNAME flattening / ALIAS, which publishes plain A records at the apex.', 'Nhà cung cấp lách bằng CNAME flattening / ALIAS, công bố bản ghi A thường ở đỉnh.'],
    },
  },
  {
    id: 'zone-serial', ns: 'net-lab', sim: 'zone', presets: ['serial'],
    title: ['The forgotten serial', 'Quên tăng serial'],
    summary: ['Change a record on the primary without bumping the SOA serial and watch the two name servers disagree — then fix it.', 'Sửa một bản ghi trên máy chính mà không tăng serial SOA và xem hai máy chủ tên nói khác nhau — rồi sửa.'],
    steps: [
      {
        target: 'zone-servers', do: [{ a: 'zone.preset', v: 'serial' }, { a: 'zone.reset' }],
        title: ['Primary and secondary', 'Máy chính và máy phụ'],
        body: ['ns1 holds the zone file; ns2 copies it (AXFR) when ns1’s serial is LARGER than its own.', 'ns1 giữ tệp vùng; ns2 chép nó (AXFR) khi serial của ns1 LỚN HƠN serial của nó.'],
      },
      {
        target: 'zone-serial-btns',
        title: ['Your turn: edit without the serial', 'Đến lượt bạn: sửa mà quên serial'],
        body: ['Click the first button: api moves to .11 on ns1, serial unchanged.', 'Bấm nút đầu: api chuyển sang .11 trên ns1, serial giữ nguyên.'],
        task: { text: ['Edit api on ns1.', 'Sửa api trên ns1.'], until: (s) => s.zone?.phase === 1, solve: [{ a: 'zone.edit', delay: 300 }] },
      },
      {
        target: 'zone-serial-term',
        title: ['Half the users', 'Một nửa người dùng'],
        body: ['ns1 says .11, ns2 says .10 — same serial 2026110101. A resolver asks either one, so users get one answer or the other.', 'ns1 nói .11, ns2 nói .10 — cùng serial 2026110101. Resolver hỏi máy nào cũng được, nên người dùng nhận câu này hoặc câu kia.'],
      },
      {
        target: 'zone-serial-btns',
        title: ['Your turn: bump the serial', 'Đến lượt bạn: tăng serial'],
        body: ['Click “bump the serial + reload”: ns1 sends NOTIFY, ns2 sees a larger serial and transfers the zone.', 'Bấm “tăng serial + nạp lại”: ns1 gửi NOTIFY, ns2 thấy serial lớn hơn và chép vùng.'],
        task: { text: ['Bump the serial.', 'Tăng serial.'], until: (s) => s.zone?.synced === true && s.zone?.phase === 2, solve: [{ a: 'zone.bump', delay: 300 }] },
      },
    ],
    quiz: {
      q: ['ns1 and ns2 answer differently but show the same serial. What happened?', 'ns1 và ns2 trả lời khác nhau nhưng cùng serial. Chuyện gì đã xảy ra?'],
      options: [['A record was changed on ns1 without increasing the serial', 'Một bản ghi được sửa trên ns1 mà không tăng serial'], ['ns2 is hacked', 'ns2 bị tấn công'], ['The TTL is too short', 'TTL quá ngắn']],
      answer: 0, why: ['Secondaries copy only when the serial grows; managed DNS bumps it for you, your own BIND does not.', 'Máy phụ chỉ chép khi serial tăng; DNS được quản lý sẵn tự tăng, BIND tự chạy thì không.'],
    },
  },
  // ───────────────────────── ttl ─────────────────────────
  {
    id: 'ttl-change', ns: 'net-lab', sim: 'ttl', presets: ['change'],
    title: ['Moving a server: the order matters', 'Chuyển máy chủ: thứ tự quyết định'],
    summary: ['Lower the TTL and change the IP right away (old IP for ~1 min 45 s, measured) — or wait the old TTL first.', 'Hạ TTL rồi đổi IP ngay (IP cũ còn ~1 phút 45 giây, đo thật) — hay chờ hết TTL cũ trước.'],
    steps: [
      {
        target: 'ttl-order', do: [{ a: 'ttl.preset', v: 'change' }, { a: 'ttl.order', v: 'wrong' }, { a: 'ttl.oldTtl', v: 120 }],
        title: ['The wrong order', 'Sai thứ tự'],
        body: ['TTL lowered 120 → 10, IP changed 11 s later. A cache that already had the record keeps counting down the OLD 120.', 'Hạ TTL 120 → 10, đổi IP 11 s sau. Một cache đã có bản ghi vẫn đếm ngược TTL CŨ 120.'],
      },
      {
        target: 'ttl-theo',
        title: ['Measured', 'Đo thật'],
        body: ['The laptop got .11 only at 16:12:47 — the IP had changed at 16:11:02. 104 s computed for this cache; the 15-second poll saw it after 105 s.', 'Laptop chỉ nhận .11 lúc 16:12:47 — IP đã đổi lúc 16:11:02. Tính ra 104 s cho cache này; lượt hỏi 15 giây thấy nó sau 105 s.'],
      },
      {
        target: 'ttl-order',
        title: ['Your turn: the right order', 'Đến lượt bạn: đúng thứ tự'],
        body: ['Pick “lower TTL, wait the old TTL, then change”. Now every cache holds the 10 s TTL when the IP changes.', 'Chọn “hạ TTL, chờ hết TTL cũ, rồi đổi”. Giờ lúc đổi IP mọi cache đã giữ TTL 10 s.'],
        task: { text: ['Choose the right order.', 'Chọn đúng thứ tự.'], until: (s) => s.ttl?.order === 'right' && s.ttl?.worst === 10, solve: [{ a: 'ttl.order', v: 'right', delay: 300 }] },
      },
      {
        target: 'ttl-order',
        title: ['Your turn: a long TTL', 'Đến lượt bạn: TTL dài'],
        body: ['Set the old TTL to 3600 s with the right order: still 10 s at most — you just waited longer before changing.', 'Đặt TTL cũ 3600 s với đúng thứ tự: vẫn tối đa 10 s — bạn chỉ phải chờ lâu hơn trước khi đổi.'],
        task: { text: ['Old TTL 3600.', 'TTL cũ 3600.'], until: (s) => s.ttl?.oldTtl === 3600 && s.ttl?.order === 'right' && s.ttl?.worst === 10, solve: [{ a: 'ttl.oldTtl', v: 3600, delay: 300 }] },
      },
    ],
    quiz: {
      q: ['TTL was 3600. You lower it to 60 and change the IP five minutes later. Worst-case old answers after the change?', 'TTL là 3600. Bạn hạ xuống 60 rồi năm phút sau đổi IP. Câu trả lời cũ tệ nhất kéo dài bao lâu sau khi đổi?'],
      options: [['About 55 minutes', 'Khoảng 55 phút'], ['60 seconds', '60 giây'], ['5 minutes', '5 phút']],
      answer: 0, why: ['A cache that fetched just before the lowering keeps the record 3600 s: 3600 − 300 = 3300 s ≈ 55 min after the change.', 'Một cache lấy ngay trước lúc hạ TTL giữ bản ghi 3600 s: 3600 − 300 = 3300 s ≈ 55 phút sau khi đổi.'],
    },
  },
  {
    id: 'ttl-negative', ns: 'net-lab', sim: 'ttl', presets: ['negative'],
    title: ['“It does not exist” — after you created it', '“Không tồn tại” — sau khi bạn đã tạo'],
    summary: ['Negative caching for min(SOA TTL, minimum) seconds, and why flushing one name is not enough in a signed zone.', 'Cache âm trong min(TTL của SOA, minimum) giây, và vì sao xoá một tên là chưa đủ trong vùng có ký.'],
    steps: [
      {
        target: 'ttl-neg-term', do: [{ a: 'ttl.preset', v: 'negative' }, { a: 'player.reset' }],
        title: ['Asked too early', 'Hỏi quá sớm'],
        body: ['new.labflow.test was asked before it existed: NXDOMAIN with the zone’s SOA. Negative TTL = min(3600, 300) = 300 s.', 'new.labflow.test bị hỏi trước khi tồn tại: NXDOMAIN kèm SOA của vùng. TTL âm = min(3600, 300) = 300 s.'],
      },
      {
        target: 'controls',
        title: ['Your turn: create it', 'Đến lượt bạn: tạo nó'],
        body: ['Press Step: the record is created on ns1 — but the resolver still says NXDOMAIN (298 s left).', 'Bấm Bước: bản ghi được tạo trên ns1 — nhưng resolver vẫn nói NXDOMAIN (còn 298 s).'],
        task: { text: ['Step once.', 'Bấm Bước một lần.'], until: (s) => s.ttl?.preset === 'negative' && ((s.ttl?.i as number) ?? 0) >= 1, solve: [step(1)] },
      },
      {
        target: 'controls',
        title: ['Your turn: flush one name', 'Đến lượt bạn: xoá một tên'],
        body: ['Step twice: flush the name, ask again… still NXDOMAIN. The signed zone’s NSEC record proves the gap (aggressive NSEC).', 'Bấm Bước hai lần: xoá tên đó, hỏi lại… vẫn NXDOMAIN. Bản ghi NSEC có chữ ký của vùng chứng minh khoảng trống (aggressive NSEC).'],
        task: { text: ['Step to “still NXDOMAIN”.', 'Bấm Bước tới “vẫn NXDOMAIN”.'], until: (s) => ((s.ttl?.i as number) ?? 0) >= 3, solve: [step(3)] },
      },
      {
        target: 'ttl-neg-kpi',
        title: ['Your turn: flush the zone', 'Đến lượt bạn: xoá cả vùng'],
        body: ['Go to the end: flushing the whole zone removes the NSEC proof and the name resolves.', 'Đi tới cuối: xoá cả vùng thì bằng chứng NSEC mất và tên phân giải được.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.ttl?.resolved === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
    ],
    quiz: {
      q: ['Cloudflare’s SOA for cuongthai.com ends in 1800. A monitor queried a new name before you created it. Worst case?', 'SOA của Cloudflare cho cuongthai.com kết thúc bằng 1800. Một đầu dò hỏi tên mới trước khi bạn tạo. Tệ nhất là bao lâu?'],
      options: [['30 minutes of NXDOMAIN on resolvers that cached it', '30 phút NXDOMAIN ở các resolver đã cache'], ['None, new records appear instantly', 'Không có, bản ghi mới hiện ngay'], ['24 hours', '24 giờ']],
      answer: 0, why: ['Negative answers live for min(SOA TTL, minimum) — 1800 s here. Create records before anybody asks for them.', 'Câu trả lời âm sống min(TTL của SOA, minimum) — ở đây 1800 s. Hãy tạo bản ghi trước khi có ai hỏi.'],
    },
  },
  // ───────────────────────── anycast ─────────────────────────
  {
    id: 'anycast-withdraw', ns: 'net-lab', sim: 'anycast', presets: ['anycast'],
    title: ['One address, two cities', 'Một địa chỉ, hai thành phố'],
    summary: ['See which site each network reaches for 198.19.1.1, then withdraw Hanoi and watch the failover.', 'Xem mỗi mạng tới điểm nào cho 198.19.1.1, rồi rút Hà Nội và xem chuyển dự phòng.'],
    steps: [
      {
        target: 'any-topo', do: [{ a: 'anycast.preset', v: 'anycast' }, { a: 'anycast.pop', v: true }],
        title: ['Same prefix, two announcements', 'Cùng dải, hai lời quảng bá'],
        body: ['pop1 (Hanoi) and pop2 (Singapore) both carry 198.19.1.1 and announce 198.19.1.0/24 with BGP. The laptop at home reaches pop1, the server in the DC reaches pop2.', 'pop1 (Hà Nội) và pop2 (Singapore) đều mang 198.19.1.1 và quảng bá 198.19.1.0/24 bằng BGP. Laptop ở nhà tới pop1, máy chủ trong DC tới pop2.'],
      },
      {
        target: 'any-who',
        title: ['“Which copy are you?”', '“Anh là bản nào?”'],
        body: ['The id.server question in the CHAOS class — the same trick the real root servers answer. Real output from both sides.', 'Câu hỏi id.server ở lớp CHAOS — đúng mánh mà máy chủ gốc thật trả lời. Output thật từ cả hai phía.'],
      },
      {
        target: 'any-btn',
        title: ['Your turn: withdraw Hanoi', 'Đến lượt bạn: rút Hà Nội'],
        body: ['Click the button: pop1 stops announcing.', 'Bấm nút: pop1 ngừng quảng bá.'],
        task: { text: ['Withdraw pop1.', 'Rút pop1.'], until: (s) => s.anycast?.pop1Up === false && s.anycast?.home === 'pop2', solve: [{ a: 'anycast.pop', v: false, delay: 300 }] },
      },
      {
        target: 'any-who',
        title: ['One second', 'Một giây'],
        body: ['Real timeline: pop1 withdrew at 16:22:56; at 16:22:57 the laptop was answered by pop2. No new IP, no TTL.', 'Dòng thời gian thật: pop1 rút lúc 16:22:56; lúc 16:22:57 laptop đã được pop2 trả lời. Không IP mới, không TTL.'],
      },
    ],
    quiz: {
      q: ['Why do root servers and 1.1.1.1 use anycast?', 'Vì sao máy chủ gốc và 1.1.1.1 dùng anycast?'],
      options: [['Users reach the nearest copy, and a failed site is routed around in seconds', 'Người dùng tới bản gần nhất, và điểm hỏng bị định tuyến vòng qua trong vài giây'], ['It encrypts DNS', 'Nó mã hoá DNS'], ['It removes the need for TTLs', 'Nó khỏi cần TTL']],
      answer: 0, why: ['Anycast is plain routing: the same prefix from many sites; BGP picks the nearest and drops withdrawn ones.', 'Anycast chỉ là định tuyến: cùng một dải từ nhiều điểm; BGP chọn điểm gần nhất và bỏ điểm đã rút.'],
    },
  },
  {
    id: 'anycast-geodns', ns: 'net-lab', sim: 'anycast', presets: ['geodns'],
    title: ['GeoDNS follows the resolver', 'GeoDNS đi theo resolver'],
    summary: ['The CDN’s DNS picks an edge by the asking resolver’s address — which is not always where the user is.', 'DNS của CDN chọn máy biên theo địa chỉ resolver đi hỏi — không phải lúc nào cũng là nơi người dùng ở.'],
    steps: [
      {
        target: 'geo-kpi', do: [{ a: 'anycast.preset', v: 'geodns' }, { a: 'anycast.via', v: 'isp' }],
        title: ['From Vietnam', 'Từ Việt Nam'],
        body: ['Through the ISP resolver (source 192.0.2.1), the CDN’s view “vn” answers the Hanoi edge 203.0.113.10.', 'Qua resolver nhà mạng (nguồn 192.0.2.1), view “vn” của CDN trả máy biên Hà Nội 203.0.113.10.'],
      },
      {
        target: 'geo-via',
        title: ['Your turn: from the datacenter', 'Đến lượt bạn: từ trung tâm dữ liệu'],
        body: ['Pick “DC machine via pop2”: the question now comes from Singapore.', 'Chọn “máy DC qua pop2”: câu hỏi giờ đến từ Singapore.'],
        task: { text: ['Choose the DC machine.', 'Chọn máy DC.'], until: (s) => s.anycast?.via === 'pop2' && s.anycast?.edge === '203.0.113.11', solve: [{ a: 'anycast.via', v: 'pop2', delay: 300 }] },
      },
      {
        target: 'geo-via',
        title: ['Your turn: the trap', 'Đến lượt bạn: cái bẫy'],
        body: ['Pick “laptop, pop1 down ⇒ pop2”: the user is still in Vietnam but gets the Singapore edge.', 'Chọn “laptop, pop1 sập ⇒ pop2”: người dùng vẫn ở Việt Nam mà nhận máy biên Singapore.'],
        task: { text: ['Choose the laptop after pop1 fails.', 'Chọn laptop sau khi pop1 hỏng.'], until: (s) => s.anycast?.via === 'pop2vn' && s.anycast?.edge === '203.0.113.11', solve: [{ a: 'anycast.via', v: 'pop2vn', delay: 300 }] },
      },
      {
        target: 'geo-term',
        title: ['ECS', 'ECS'],
        body: ['EDNS Client Subnet (RFC 7871) would pass part of the user’s address to the CDN — at a privacy cost; 1.1.1.1 deliberately does not send it.', 'EDNS Client Subnet (RFC 7871) sẽ gửi một phần địa chỉ người dùng cho CDN — đổi lại quyền riêng tư; 1.1.1.1 cố ý không gửi.'],
      },
    ],
    quiz: {
      q: ['What does a GeoDNS authoritative server see?', 'Máy chủ authoritative GeoDNS thấy gì?'],
      options: [['The address of the resolver that asks', 'Địa chỉ của resolver đi hỏi'], ['The user’s GPS location', 'Vị trí GPS của người dùng'], ['The user’s browser language', 'Ngôn ngữ trình duyệt của người dùng']],
      answer: 0, why: ['Unless the resolver adds ECS, all the authoritative server knows is the resolver’s IP.', 'Trừ khi resolver thêm ECS, máy chủ authoritative chỉ biết IP của resolver.'],
    },
  },
  // ───────────────────────── dnssec ─────────────────────────
  {
    id: 'dnssec-chain', ns: 'net-lab', sim: 'dnssec', presets: ['chain'],
    title: ['A chain of trust, link by link', 'Chuỗi tin cậy, từng mắt xích'],
    summary: ['From the root anchor to LabFlow’s A record: each parent publishes the hash of its child’s key.', 'Từ mỏ neo gốc tới bản ghi A của LabFlow: mỗi vùng cha công bố mã băm khoá của vùng con.'],
    steps: [
      {
        target: 'sec-chain', do: [{ a: 'dnssec.preset', v: 'chain' }, { a: 'player.reset' }],
        title: ['Trusted without proof', 'Tin không cần chứng minh'],
        body: ['The resolver starts from ONE key it trusts: the root’s, configured as a trust anchor.', 'Resolver bắt đầu từ MỘT khoá nó tin: khoá của vùng gốc, cấu hình làm mỏ neo tin cậy.'],
      },
      {
        target: 'controls',
        title: ['Your turn: down to LabFlow’s DS', 'Đến lượt bạn: xuống tới DS của LabFlow'],
        body: ['Press Step three times: root → DS of test → DS of labflow.test → the hash we compute ourselves. Same digest: the parent vouches for the key.', 'Bấm Bước ba lần: gốc → DS của test → DS của labflow.test → mã băm ta tự tính. Cùng mã băm: vùng cha bảo lãnh cho khoá.'],
        task: { text: ['Step to the DS check.', 'Bấm Bước tới phép kiểm DS.'], until: (s) => s.dnssec?.preset === 'chain' && ((s.dnssec?.i as number) ?? 0) >= 3, solve: [step(3)] },
      },
      {
        target: 'sec-chain-term',
        title: ['Two keys', 'Hai khoá'],
        body: ['257 = key-signing key (the one the DS points to); 256 = zone-signing key (signs the records). The busy key can change without touching the parent.', '257 = khoá ký khoá (khoá mà DS trỏ tới); 256 = khoá ký vùng (ký các bản ghi). Khoá làm việc nhiều có thể đổi mà không đụng tới vùng cha.'],
      },
      {
        target: 'controls',
        title: ['Your turn: validated', 'Đến lượt bạn: đã kiểm qua'],
        body: ['Go to the end: the resolver sets ad, delv says “fully validated”; cdn.test (no DS) is “unsigned” — insecure but allowed.', 'Đi tới cuối: resolver bật ad, delv nói “fully validated”; cdn.test (không DS) là “unsigned” — insecure nhưng được chấp nhận.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.dnssec?.validated === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
    ],
    quiz: {
      q: ['What does a DS record at the parent contain?', 'Bản ghi DS ở vùng cha chứa gì?'],
      options: [['A hash of the child zone’s key-signing key', 'Mã băm khoá ký khoá của vùng con'], ['The child’s private key', 'Khoá bí mật của vùng con'], ['The child’s IP addresses', 'Địa chỉ IP của vùng con']],
      answer: 0, why: ['dnssec-dsfromkey computed the same digest the TLD publishes — that link is what breaks if you change the key without updating the DS.', 'dnssec-dsfromkey tính ra đúng mã băm TLD công bố — mắt xích này đứt nếu đổi khoá mà không cập nhật DS.'],
    },
  },
  {
    id: 'dnssec-expired', ns: 'net-lab', sim: 'dnssec', presets: ['expired'],
    title: ['The signatures expired at 3 a.m.', 'Chữ ký hết hạn lúc 3 giờ sáng'],
    summary: ['SERVFAIL with EDE 7, the +cd test, a fix that does not work at once, and flush_bogus.', 'SERVFAIL kèm EDE 7, phép thử +cd, một lần sửa chưa có tác dụng ngay, và flush_bogus.'],
    steps: [
      {
        target: 'sec-exp-btns', do: [{ a: 'dnssec.preset', v: 'expired' }, { a: 'dnssec.cd', v: false }],
        title: ['A dead cron job', 'Một tác vụ cron đã chết'],
        body: ['Signatures have an end date. If the job that re-signs the zone stops, the zone keeps serving signatures that expire.', 'Chữ ký có ngày hết hạn. Nếu tác vụ ký lại vùng ngừng chạy, vùng vẫn phục vụ những chữ ký sẽ hết hạn.'],
      },
      {
        target: 'sec-exp-btns',
        title: ['Your turn: let them expire', 'Đến lượt bạn: để chúng hết hạn'],
        body: ['Click the first button. SERVFAIL, EDE 7 “Signature Expired” — while server, network and records are fine.', 'Bấm nút đầu. SERVFAIL, EDE 7 “Signature Expired” — trong khi máy chủ, mạng và bản ghi đều ổn.'],
        task: { text: ['Let the signatures expire.', 'Để chữ ký hết hạn.'], until: (s) => s.dnssec?.phase === 1 && s.dnssec?.answer === 'SERVFAIL', solve: [{ a: 'dnssec.expire', delay: 300 }] },
      },
      {
        target: 'sec-exp-btns',
        title: ['Your turn: the +cd test', 'Đến lượt bạn: phép thử +cd'],
        body: ['Turn on +cd (checking disabled): the address comes back. Works with +cd, fails without ⇒ DNSSEC.', 'Bật +cd (tắt kiểm): địa chỉ quay về. Chạy với +cd, hỏng khi không có ⇒ DNSSEC.'],
        task: { text: ['Use +cd.', 'Dùng +cd.'], until: (s) => s.dnssec?.cd === true && s.dnssec?.answer === 'NOERROR', solve: [{ a: 'dnssec.cd', v: true, delay: 300 }] },
      },
      {
        target: 'sec-exp-btns',
        title: ['Your turn: re-sign', 'Đến lượt bạn: ký lại'],
        body: ['Turn +cd off and re-sign the zone. Still SERVFAIL: the resolver remembers bogus answers for 60 s (val-bogus-ttl).', 'Tắt +cd và ký lại vùng. Vẫn SERVFAIL: resolver nhớ câu bogus trong 60 s (val-bogus-ttl).'],
        task: { text: ['Re-sign without +cd.', 'Ký lại, không có +cd.'], until: (s) => s.dnssec?.phase === 2 && s.dnssec?.cd === false, solve: [{ a: 'dnssec.cd', v: false, delay: 200 }, { a: 'dnssec.resign', delay: 300 }] },
      },
      {
        target: 'sec-exp-kpi',
        title: ['Your turn: flush_bogus', 'Đến lượt bạn: flush_bogus'],
        body: ['Clear the bogus entries on the resolver you run. On public resolvers you wait.', 'Xoá các mục bogus trên resolver của bạn. Với resolver công cộng thì phải chờ.'],
        task: { text: ['Flush the bogus cache.', 'Xoá cache bogus.'], until: (s) => s.dnssec?.phase === 3 && s.dnssec?.answer === 'NOERROR', solve: [{ a: 'dnssec.flush', delay: 300 }] },
      },
    ],
    quiz: {
      q: ['dig returns SERVFAIL, dig +cd returns the address. What kind of problem is it?', 'dig trả SERVFAIL, dig +cd trả về địa chỉ. Đây là loại lỗi gì?'],
      options: [['DNSSEC validation (signatures or chain)', 'Kiểm DNSSEC (chữ ký hoặc chuỗi)'], ['The web server is down', 'Máy chủ web sập'], ['The record was deleted', 'Bản ghi bị xoá']],
      answer: 0, why: ['+cd asks the resolver to skip validation; if that makes it work, the data is there and the signatures are the problem.', '+cd bảo resolver bỏ qua bước kiểm; nếu nhờ vậy mà chạy, dữ liệu vẫn còn và lỗi nằm ở chữ ký.'],
    },
  },
];
