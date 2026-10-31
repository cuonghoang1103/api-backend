/**
 * Tour Chương 2 của phòng lab mạng (khoá Networking for Developers, 01/11/2026): subnet / route / nat / ipv6 / bgp.
 * Viết cho người mới tinh: thuật ngữ được giải nghĩa ngay lần đầu. Mọi con số lấy từ capture thật của "Internet in a box"
 * (net-lab/engine/capture2.ts) hoặc được nói rõ là TÍNH RA. Trạng thái cuối mỗi tour được kiểm trong tours.test.ts (FINAL).
 */
import type { Tour } from './types';

const step = (n: number, delay = 650) => ({ a: 'player.step', delay, upTo: n });
const TRAP = '2001:0db8:0000:0000:0001:0000:0000:0001';

export const NET2_TOURS: Tour[] = [
  // ───────────────────────── subnet ─────────────────────────
  {
    id: 'subnet-mask', ns: 'net-lab', sim: 'subnet', presets: ['mask'],
    title: ['Address AND mask = network', 'Địa chỉ AND mặt nạ = mạng'],
    summary: ['Turn 192.168.50.77/26 into bits, find its network, broadcast and usable hosts — and check them against cidr.py from the lab.', 'Biến 192.168.50.77/26 thành bit, tìm mạng, broadcast và số máy dùng được — rồi đối chiếu với cidr.py trong lab.'],
    steps: [
      {
        target: 'sn-bits', do: [{ a: 'subnet.preset', v: 'mask' }, { a: 'player.reset' }],
        title: ['32 bits', '32 bit'],
        body: ['An IPv4 address is 32 bits, shown here as 32 small boxes. The four numbers you usually see (like 10.10.1.10) are just these bits in groups of 8.', 'Một địa chỉ IPv4 là 32 bit, ở đây là 32 ô nhỏ. Bốn con số bạn hay thấy (như 10.10.1.10) chỉ là các bit này gom thành nhóm 8.'],
      },
      {
        target: 'sn-input',
        title: ['Your turn: pick an address', 'Đến lượt bạn: chọn một địa chỉ'],
        body: ['Click the button 192.168.50.77 (or type it).', 'Bấm nút 192.168.50.77 (hoặc gõ vào).'],
        task: { text: ['Choose 192.168.50.77.', 'Chọn 192.168.50.77.'], until: (s) => s.subnet?.addr === '192.168.50.77', solve: [{ a: 'subnet.addr', v: '192.168.50.77', delay: 300 }] },
      },
      {
        target: 'sn-prefix',
        title: ['Your turn: the prefix /26', 'Đến lượt bạn: prefix /26'],
        body: ['Drag the slider to /26. “/26” means: the first 26 bits are the NETWORK part (blue), the last 6 bits are the HOST part (orange).', 'Kéo thanh trượt tới /26. “/26” nghĩa là: 26 bit đầu là phần MẠNG (xanh), 6 bit cuối là phần MÁY (cam).'],
        task: { text: ['Set the prefix to /26.', 'Đặt prefix /26.'], until: (s) => s.subnet?.prefix === 26, solve: [{ a: 'subnet.prefix', v: 26, delay: 300 }] },
      },
      {
        target: 'controls',
        title: ['Your turn: the mask and the AND', 'Đến lượt bạn: mặt nạ và phép AND'],
        body: ['Press Step twice. First the mask appears: 26 ones then 6 zeros = 255.255.255.192. Then address AND mask: where the mask has 0, the result is 0.', 'Bấm Bước hai lần. Đầu tiên mặt nạ hiện ra: 26 số 1 rồi 6 số 0 = 255.255.255.192. Rồi địa chỉ AND mặt nạ: chỗ nào mặt nạ là 0 thì kết quả là 0.'],
        task: { text: ['Step to the network row.', 'Bấm Bước tới hàng “mạng”.'], until: (s) => s.subnet?.prefix === 26 && ((s.subnet?.i as number) ?? 0) >= 2, solve: [step(2)] },
      },
      {
        target: 'sn-bits',
        title: ['77 becomes 64', '77 thành 64'],
        body: ['77 = 01001101. Keep the first 2 bits of that octet, wipe the last 6: 01000000 = 64. Network: 192.168.50.64/26.', '77 = 01001101. Giữ 2 bit đầu của octet đó, xoá 6 bit cuối: 01000000 = 64. Mạng: 192.168.50.64/26.'],
      },
      {
        target: 'sn-result',
        title: ['Your turn: broadcast and hosts', 'Đến lượt bạn: broadcast và số máy'],
        body: ['Step to the end. Broadcast = all 6 host bits set to 1 = .127. 2^6 = 64 addresses, minus network and broadcast = 62 usable, .65 to .126.', 'Bấm Bước tới cuối. Broadcast = bật cả 6 bit phần máy thành 1 = .127. 2^6 = 64 địa chỉ, bớt địa chỉ mạng và broadcast = 62 dùng được, từ .65 tới .126.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.subnet?.prefix === 26 && s.subnet?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'sn-cidr',
        title: ['Same as the lab', 'Giống hệt lab'],
        body: ['These five lines are what the lab’s cidr.py printed for 192.168.50.77/26 — the green label says “real capture”. Try /31 and /32 too: no broadcast, 2 and 1 usable addresses.', 'Năm dòng này là thứ cidr.py của lab in ra cho 192.168.50.77/26 — nhãn xanh ghi “capture thật”. Thử cả /31 và /32: không có broadcast, 2 và 1 địa chỉ dùng được.'],
      },
      {
        target: 'where',
        title: ['Where in the computer?', 'Ở đâu trong máy?'],
        body: ['The address and prefix are a few bytes in kernel RAM. The AND is one CPU instruction — done for every packet you send, to decide “neighbour or router?”.', 'Địa chỉ và prefix là vài byte trong RAM của nhân. Phép AND là một lệnh CPU — làm cho mọi gói bạn gửi, để quyết “hàng xóm hay router?”.'],
      },
    ],
    quiz: {
      q: ['How many usable host addresses does 192.168.50.77/26 have?', '192.168.50.77/26 có bao nhiêu địa chỉ máy dùng được?'],
      options: [['62', '62'], ['64', '64'], ['126', '126']],
      answer: 0, why: ['6 host bits ⇒ 64 addresses; the network (.64) and broadcast (.127) addresses cannot be given to a machine.', '6 bit phần máy ⇒ 64 địa chỉ; địa chỉ mạng (.64) và broadcast (.127) không cấp cho máy nào được.'],
    },
  },
  {
    id: 'subnet-vlsm', ns: 'net-lab', sim: 'subnet', presets: ['vlsm'],
    title: ['Split a block: largest first', 'Chia một khối: lớn trước'],
    summary: ['Give LabFlow’s office four subnets out of 10.20.0.0/22, see the 336-address gap of the wrong order, then fix it.', 'Cấp cho văn phòng LabFlow bốn subnet từ 10.20.0.0/22, thấy lỗ hổng 336 địa chỉ của thứ tự sai, rồi sửa.'],
    steps: [
      {
        target: 'sn-needs', do: [{ a: 'subnet.preset', v: 'vlsm' }, { a: 'subnet.order', v: 'given' }, { a: 'player.reset' }],
        title: ['Four networks, one block', 'Bốn mạng, một khối'],
        body: ['iot needs 300 devices, web 100, db 20, mgmt 10. Each subnet must be a power of two in size (plus 2 for network and broadcast) and must START at a multiple of its own size — that is called “aligned”.', 'iot cần 300 thiết bị, web 100, db 20, mgmt 10. Mỗi subnet phải có cỡ là lũy thừa của 2 (cộng 2 cho địa chỉ mạng và broadcast) và phải BẮT ĐẦU ở bội số của chính cỡ nó — gọi là “thẳng hàng”.'],
      },
      {
        target: 'sn-vbar',
        title: ['Your turn: allocate as written', 'Đến lượt bạn: cấp theo thứ tự đã viết'],
        body: ['Press Play or Step to the end. web, db and mgmt fill the start; iot needs a /23 (512 addresses) that must start at a multiple of 512…', 'Bấm Chạy hoặc Bước tới cuối. web, db và mgmt lấp phần đầu; iot cần một /23 (512 địa chỉ) phải bắt đầu ở bội số của 512…'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.subnet?.order === 'given' && s.subnet?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'sn-chia',
        title: ['336 addresses wasted', '336 địa chỉ bị phí'],
        body: ['The real chia.py says it: “gap 10.20.0.176 - 10.20.1.255 (336 addresses skipped)”, and the block is FULL.', 'chia.py thật nói rõ: “gap 10.20.0.176 - 10.20.1.255 (336 địa chỉ bị bỏ qua)”, và khối đã ĐẦY.'],
      },
      {
        target: 'sn-order',
        title: ['Your turn: largest first', 'Đến lượt bạn: lớn trước'],
        body: ['Switch the order to “largest first”.', 'Đổi thứ tự sang “lớn trước”.'],
        task: { text: ['Choose largest first.', 'Chọn lớn trước.'], until: (s) => s.subnet?.order === 'sorted', solve: [{ a: 'subnet.order', v: 'sorted', delay: 300 }] },
      },
      {
        target: 'sn-vbar',
        title: ['Your turn: again', 'Đến lượt bạn: làm lại'],
        body: ['Step to the end again. Big blocks first leave no holes: iot, web, db, mgmt sit back to back, and 336 addresses stay free for later.', 'Bấm Bước tới cuối lần nữa. Khối lớn trước thì không để lại lỗ: iot, web, db, mgmt nằm sát nhau, và 336 địa chỉ còn trống cho sau này.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.subnet?.order === 'sorted' && s.subnet?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'sn-needs',
        title: ['Try your own numbers', 'Thử số của bạn'],
        body: ['Change a host count: the label turns orange “computed” because the lab never ran that plan. Make iot 600 and see the plan stop fitting.', 'Đổi một số máy: nhãn chuyển cam “tính ra” vì lab chưa từng chạy kế hoạch đó. Cho iot 600 và xem kế hoạch không còn vừa.'],
      },
    ],
    quiz: {
      q: ['Why allocate the largest subnet first?', 'Vì sao cấp subnet lớn nhất trước?'],
      options: [['Blocks must start at a multiple of their size; big ones first leave no gaps', 'Khối phải bắt đầu ở bội số của cỡ nó; khối lớn trước thì không để lỗ'], ['Large networks are more important', 'Mạng lớn quan trọng hơn'], ['Routers read them in that order', 'Router đọc theo thứ tự đó']],
      answer: 0, why: ['After small blocks, the next multiple of 512 can be far away — everything in between is skipped.', 'Sau các khối nhỏ, bội số 512 kế tiếp có thể ở rất xa — mọi thứ ở giữa bị bỏ qua.'],
    },
  },

  // ───────────────────────── route ─────────────────────────
  {
    id: 'route-lpm', ns: 'net-lab', sim: 'route', presets: ['lookup'],
    title: ['Longest prefix wins', 'Tiền tố dài nhất thắng'],
    summary: ['Look up destinations in the real routing tables of a laptop, an ISP router and a data-centre router — including a forgotten /32.', 'Tra đích trong bảng định tuyến thật của một laptop, một router nhà mạng và một router trung tâm dữ liệu — kể cả một tuyến /32 bị quên.'],
    steps: [
      {
        target: 'rt-table', do: [{ a: 'route.preset', v: 'lookup' }, { a: 'route.router', v: 'laptop' }, { a: 'route.dst', v: '203.0.113.10' }, { a: 'player.reset' }],
        title: ['The laptop’s table: two lines', 'Bảng của laptop: hai dòng'],
        body: ['“192.168.50.0/24 dev eth0” = my home network, deliver directly. “default via 192.168.50.1” = everything else, give it to the home router.', '“192.168.50.0/24 dev eth0” = mạng nhà tôi, giao thẳng. “default via 192.168.50.1” = mọi thứ còn lại, đưa cho router nhà.'],
      },
      {
        target: 'controls',
        title: ['Your turn: check every line', 'Đến lượt bạn: kiểm từng dòng'],
        body: ['Step to the end for destination 203.0.113.10. Only “default” (/0) matches, so the laptop sends it to 192.168.50.1.', 'Bấm Bước tới cuối với đích 203.0.113.10. Chỉ “default” (/0) khớp, nên laptop gửi cho 192.168.50.1.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.route?.router === 'laptop' && s.route?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'rt-router',
        title: ['Your turn: the ISP’s router', 'Đến lượt bạn: router của nhà mạng'],
        body: ['Choose isp. Its table has lines learned by BGP (“proto bgp”) — and no default route at all.', 'Chọn isp. Bảng của nó có các dòng học bằng BGP (“proto bgp”) — và không có tuyến mặc định nào.'],
        task: { text: ['Choose the router isp.', 'Chọn router isp.'], until: (s) => s.route?.router === 'isp', solve: [{ a: 'route.router', v: 'isp', delay: 300 }] },
      },
      {
        target: 'rt-dst',
        title: ['Your turn: 8.8.8.8', 'Đến lượt bạn: 8.8.8.8'],
        body: ['Pick 8.8.8.8 and step to the end. No line matches and there is no default ⇒ “Network is unreachable” — exactly what the real isp said.', 'Chọn 8.8.8.8 rồi bấm Bước tới cuối. Không dòng nào khớp và không có default ⇒ “Network is unreachable” — đúng như isp thật đã nói.'],
        task: { text: ['Look up 8.8.8.8 at isp to the end.', 'Tra 8.8.8.8 ở isp tới cuối.'], until: (s) => s.route?.router === 'isp' && s.route?.dst === '8.8.8.8' && s.route?.atEnd === true, solve: [{ a: 'route.dst', v: '8.8.8.8', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'rt-router',
        title: ['Your turn: the data centre', 'Đến lượt bạn: trung tâm dữ liệu'],
        body: ['Choose dc and destination 203.0.113.10, LabFlow’s server. Someone left a test route there: “203.0.113.10 via 192.0.2.1”.', 'Chọn dc và đích 203.0.113.10, máy chủ LabFlow. Ai đó để quên một tuyến thử ở đây: “203.0.113.10 via 192.0.2.1”.'],
        task: { text: ['Router dc, destination 203.0.113.10.', 'Router dc, đích 203.0.113.10.'], until: (s) => s.route?.router === 'dc' && s.route?.dst === '203.0.113.10', solve: [{ a: 'route.router', v: 'dc', delay: 300 }, { a: 'route.dst', v: '203.0.113.10', delay: 300 }] },
      },
      {
        target: 'rt-table',
        title: ['Your turn: who wins?', 'Đến lượt bạn: ai thắng?'],
        body: ['Step to the end. Both “203.0.113.0/24 dev dc0” and the forgotten /32 match. /32 is longer ⇒ it wins and sends the packet back to isp.', 'Bấm Bước tới cuối. Cả “203.0.113.0/24 dev dc0” lẫn tuyến /32 bị quên đều khớp. /32 dài hơn ⇒ nó thắng và gửi gói quay về isp.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.route?.router === 'dc' && s.route?.atEnd === true && s.route?.winnerLen === 32, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'rt-forgotten',
        title: ['Longer always wins — even a mistake', 'Dài hơn luôn thắng — kể cả khi nhầm'],
        body: ['The kernel does not judge whether a route is sensible; it only compares lengths. Switch the /32 to “deleted” and the connected /24 wins again (the real `ip route get` after the fix says “dev dc0”).', 'Nhân không xét tuyến có hợp lý không; nó chỉ so độ dài. Chuyển /32 sang “đã xoá” thì /24 nối thẳng lại thắng (`ip route get` thật sau khi sửa ghi “dev dc0”).'],
      },
    ],
    quiz: {
      q: ['dc has “203.0.113.0/24 dev dc0” and “203.0.113.10 via 192.0.2.1”. A packet for 203.0.113.10 uses…', 'dc có “203.0.113.0/24 dev dc0” và “203.0.113.10 via 192.0.2.1”. Gói tới 203.0.113.10 dùng…'],
      options: [['The /32 via 192.0.2.1 — longest prefix', 'Tuyến /32 qua 192.0.2.1 — tiền tố dài nhất'], ['The /24 — it was there first', 'Tuyến /24 — nó có trước'], ['Both, alternately', 'Cả hai, luân phiên']],
      answer: 0, why: ['Among all matching lines the one with the most network bits wins. Order in the table does not matter.', 'Trong mọi dòng khớp, dòng có nhiều bit mạng nhất thắng. Thứ tự trong bảng không quan trọng.'],
    },
  },
  {
    id: 'route-trace', ns: 'net-lab', sim: 'route', presets: ['trace'],
    title: ['traceroute and the silent hop', 'traceroute và chặng im lặng'],
    summary: ['Send probes with TTL 1, 2, 3, 4 and read the real ICMP replies; then make one router silent and learn to read “* * *”.', 'Gửi gói thăm dò với TTL 1, 2, 3, 4 và đọc câu trả lời ICMP thật; rồi cho một router im lặng và học cách đọc “* * *”.'],
    steps: [
      {
        target: 'rt-path', do: [{ a: 'route.preset', v: 'trace' }, { a: 'route.silent', v: false }, { a: 'player.reset' }],
        title: ['Four boxes on the way', 'Bốn hộp trên đường'],
        body: ['laptop → homegw (home router) → isp → dc → server 203.0.113.10. traceroute discovers this list using only the TTL counter.', 'laptop → homegw (router nhà) → isp → dc → máy chủ 203.0.113.10. traceroute tìm ra danh sách này chỉ bằng bộ đếm TTL.'],
      },
      {
        target: 'controls',
        title: ['Your turn: TTL = 1', 'Đến lượt bạn: TTL = 1'],
        body: ['Press Step twice: the first probe dies at homegw (TTL 1 → 0) and homegw answers “Time exceeded” — revealing 192.168.50.1.', 'Bấm Bước hai lần: gói thăm dò đầu tiên chết ở homegw (TTL 1 → 0) và homegw trả lời “Time exceeded” — lộ ra 192.168.50.1.'],
        task: { text: ['Step twice.', 'Bấm Bước hai lần.'], until: (s) => s.route?.silent === false && ((s.route?.i as number) ?? 0) >= 2, solve: [step(2)] },
      },
      {
        target: 'rt-tshark',
        title: ['The real packets', 'Các gói thật'],
        body: ['tshark in the lab: the probe left with TTL 1; the reply arrived with TTL 64. The next replies arrive with 63, 62, 61 — one less per router on the way back.', 'tshark trong lab: gói thăm dò đi với TTL 1; câu trả lời tới với TTL 64. Các câu trả lời sau tới với 63, 62, 61 — mỗi router trên đường về trừ một.'],
      },
      {
        target: 'controls',
        title: ['Your turn: all the way', 'Đến lượt bạn: đi hết đường'],
        body: ['Step to the end. The 4th probe reaches the server, which answers “Port unreachable” — that different answer tells traceroute to stop.', 'Bấm Bước tới cuối. Gói thứ 4 tới máy chủ, máy chủ trả “Port unreachable” — câu trả lời khác đó bảo traceroute dừng.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.route?.silent === false && s.route?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'rt-silent',
        title: ['Your turn: a silent router', 'Đến lượt bạn: một router im lặng'],
        body: ['Many real routers do not send “Time exceeded” (firewall or rate limit). Set “router dc sends Time exceeded” to “no”.', 'Nhiều router thật không gửi “Time exceeded” (tường lửa hoặc giới hạn tốc độ). Đặt “router dc gửi Time exceeded” thành “không”.'],
        task: { text: ['Make dc silent.', 'Cho dc im lặng.'], until: (s) => s.route?.silent === true, solve: [{ a: 'route.silent', v: true, delay: 300 }] },
      },
      {
        target: 'rt-trace',
        title: ['Your turn: run it again', 'Đến lượt bạn: chạy lại'],
        body: ['Step to the end. Hop 3 prints “* * *” — but hop 4 still answers.', 'Bấm Bước tới cuối. Chặng 3 in “* * *” — nhưng chặng 4 vẫn trả lời.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.route?.silent === true && s.route?.atEnd === true && s.route?.reached === true && s.route?.star3 === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'rt-mtr',
        title: ['100% loss that is not loss', 'Mất 100% mà không mất gì'],
        body: ['Real mtr: 100% loss at hop 3, 0% at hop 4, and curl works. Loss that does not continue to the last hop is a router refusing to answer, not your traffic being dropped.', 'mtr thật: mất 100% ở chặng 3, 0% ở chặng 4, và curl vẫn chạy. Mất gói không kéo dài tới chặng cuối là router không chịu trả lời, không phải lưu lượng của bạn bị vứt.'],
      },
    ],
    quiz: {
      q: ['traceroute shows “* * *” at hop 3, but hop 4 (the destination) answers. What does that mean?', 'traceroute in “* * *” ở chặng 3, nhưng chặng 4 (đích) vẫn trả lời. Điều đó nghĩa là gì?'],
      options: [['Router 3 does not reply to TTL-expired probes; traffic passes fine', 'Router 3 không trả lời gói hết TTL; lưu lượng vẫn qua bình thường'], ['Router 3 is down', 'Router 3 đã chết'], ['Packets are lost at hop 3', 'Gói bị mất ở chặng 3']],
      answer: 0, why: ['If router 3 dropped traffic, nothing could reach hop 4. Only the “Time exceeded” message is missing.', 'Nếu router 3 vứt lưu lượng thì không gì tới được chặng 4. Chỉ thiếu thông báo “Time exceeded”.'],
    },
  },

  // ───────────────────────── nat ─────────────────────────
  {
    id: 'nat-home', ns: 'net-lab', sim: 'nat', presets: ['home'],
    title: ['Three connections, one public IP', 'Ba kết nối, một IP công cộng'],
    summary: ['Watch homegw rewrite addresses, write conntrack rows, and resolve a real port collision 41000 → 4734.', 'Xem homegw viết lại địa chỉ, ghi các dòng conntrack, và giải quyết một va chạm cổng thật 41000 → 4734.'],
    steps: [
      {
        target: 'nat-topo', do: [{ a: 'nat.preset', v: 'home' }, { a: 'player.reset' }],
        title: ['Private inside, public outside', 'Bên trong riêng, bên ngoài công cộng'],
        body: ['The laptop (192.168.50.10) and the phone (.11) have private addresses. homegw owns the only public one: 198.51.100.2.', 'Laptop (192.168.50.10) và điện thoại (.11) có địa chỉ riêng. homegw giữ địa chỉ công cộng duy nhất: 198.51.100.2.'],
      },
      {
        target: 'nat-hdr',
        title: ['Your turn: through the router', 'Đến lượt bạn: qua router'],
        body: ['Press Step twice. Compare the packet on lan0 and on wan0: the source IP changed (red), nothing else.', 'Bấm Bước hai lần. So gói trên lan0 và trên wan0: IP nguồn đã đổi (đỏ), ngoài ra không gì đổi.'],
        task: { text: ['Step twice.', 'Bấm Bước hai lần.'], until: (s) => s.nat?.preset === 'home' && ((s.nat?.i as number) ?? 0) >= 2, solve: [step(2)] },
      },
      {
        target: 'nat-conntrack',
        title: ['The router’s notebook', 'Cuốn sổ của router'],
        body: ['conntrack wrote a row: “original” = what the laptop sent, “reply” = what the answer will look like (to 198.51.100.2:41122). When the answer comes, homegw looks it up here.', 'conntrack ghi một dòng: “bộ gốc” = thứ laptop gửi, “bộ trả lời” = câu trả lời sẽ trông thế nào (tới 198.51.100.2:41122). Khi câu trả lời tới, homegw tra ở đây.'],
      },
      {
        target: 'controls',
        title: ['Your turn: same port twice', 'Đến lượt bạn: cùng cổng hai lần'],
        body: ['Keep stepping. The laptop uses source port 41000, then the phone ALSO uses 41000. Stop when homegw reacts.', 'Tiếp tục bấm Bước. Laptop dùng cổng nguồn 41000, rồi điện thoại CŨNG dùng 41000. Dừng khi homegw phản ứng.'],
        task: { text: ['Step until the collision.', 'Bấm Bước tới lúc va chạm.'], until: (s) => s.nat?.collision === true, solve: [step(6)] },
      },
      {
        target: 'nat-hdr',
        title: ['41000 → 4734', '41000 → 4734'],
        body: ['Two answers to 198.51.100.2:41000 could not be told apart, so homegw changed the phone’s PORT too. 4734 is the number the kernel chose in the lab.', 'Hai câu trả lời tới 198.51.100.2:41000 sẽ không phân biệt được, nên homegw đổi luôn CỔNG của điện thoại. 4734 là con số nhân đã chọn trong lab.'],
      },
      {
        target: 'nat-seen',
        title: ['Your turn: finish', 'Đến lượt bạn: hoàn tất'],
        body: ['Step to the end. The server says “you came from 198.51.100.2 port 4734”, yet the phone still thinks it used 41000.', 'Bấm Bước tới cuối. Máy chủ nói “you came from 198.51.100.2 port 4734”, vậy mà điện thoại vẫn tưởng nó dùng 41000.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.nat?.preset === 'home' && s.nat?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'nat-real',
        title: ['The real table', 'Bảng thật'],
        body: ['`conntrack -L` on homegw: three rows, three different reply tuples. One public IP is shared by being picky about ports.', '`conntrack -L` trên homegw: ba dòng, ba bộ trả lời khác nhau. Một IP công cộng được dùng chung nhờ phân biệt bằng cổng.'],
      },
    ],
    quiz: {
      q: ['Why did homegw rewrite the phone’s source port?', 'Vì sao homegw viết lại cổng nguồn của điện thoại?'],
      options: [['Its reply tuple would be identical to the laptop’s', 'Bộ trả lời của nó sẽ trùng với của laptop'], ['Port 41000 is forbidden', 'Cổng 41000 bị cấm'], ['Phones always get new ports', 'Điện thoại luôn được cổng mới']],
      answer: 0, why: ['After NAT both would be 198.51.100.2:41000 → 203.0.113.10:80; answers must map back to exactly one device.', 'Sau NAT cả hai đều là 198.51.100.2:41000 → 203.0.113.10:80; câu trả lời phải về đúng một thiết bị.'],
    },
  },
  {
    id: 'nat-inbound', ns: 'net-lab', sim: 'nat', presets: ['inbound'],
    title: ['Calling into a home: port forwarding', 'Gọi vào trong nhà: mở cổng'],
    summary: ['See why the Internet cannot reach a laptop behind NAT, then add a DNAT rule and make it work.', 'Thấy vì sao Internet không gọi được laptop sau NAT, rồi thêm luật DNAT và làm nó chạy.'],
    steps: [
      {
        target: 'nat-in-topo', do: [{ a: 'nat.preset', v: 'inbound' }, { a: 'nat.dnat', v: false }, { a: 'player.reset' }],
        title: ['A dev server at home', 'Một dev server ở nhà'],
        body: ['The laptop runs a server on port 8080. The machine on the Internet wants to open it.', 'Laptop chạy một server ở cổng 8080. Máy ngoài Internet muốn mở nó.'],
      },
      {
        target: 'controls',
        title: ['Your turn: try both addresses', 'Đến lượt bạn: thử cả hai địa chỉ'],
        body: ['Step to the end: first the private address, then the public one.', 'Bấm Bước tới cuối: trước là địa chỉ riêng, sau là địa chỉ công cộng.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.nat?.preset === 'inbound' && s.nat?.dnat === false && s.nat?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'nat-in-term',
        title: ['Two different failures', 'Hai kiểu thất bại khác nhau'],
        body: ['192.168.50.10: “Network is unreachable” — no router on the Internet knows private addresses. 198.51.100.2:8080: “Connection refused” — it reached homegw, but nothing tells homegw to pass it on.', '192.168.50.10: “Network is unreachable” — không router nào trên Internet biết địa chỉ riêng. 198.51.100.2:8080: “Connection refused” — tới được homegw, nhưng không gì bảo homegw chuyển tiếp.'],
      },
      {
        target: 'nat-dnat',
        title: ['Your turn: open the port', 'Đến lượt bạn: mở cổng'],
        body: ['Press the button: it adds “-j DNAT --to-destination 192.168.50.10:8080” on homegw — rewrite the DESTINATION of packets arriving on port 8080.', 'Bấm nút: nó thêm “-j DNAT --to-destination 192.168.50.10:8080” trên homegw — viết lại ĐÍCH của gói tới cổng 8080.'],
        task: { text: ['Add the DNAT rule.', 'Thêm luật DNAT.'], until: (s) => s.nat?.dnat === true, solve: [{ a: 'nat.dnat', v: true, delay: 300 }] },
      },
      {
        target: 'controls',
        title: ['Your turn: call again', 'Đến lượt bạn: gọi lại'],
        body: ['Step to the end: “hello from the laptop dev server (192.168.50.10:8080)”.', 'Bấm Bước tới cuối: “hello from the laptop dev server (192.168.50.10:8080)”.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.nat?.dnat === true && s.nat?.inboundOk === true && s.nat?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'where',
        title: ['Where in the computer?', 'Ở đâu trong máy?'],
        body: ['The rule and the conntrack rows live in homegw’s kernel RAM — on the box that does the NAT. That is why on 4G (carrier NAT) you cannot open a port: that box belongs to the ISP.', 'Luật và các dòng conntrack nằm trong RAM của nhân homegw — trên đúng hộp làm NAT. Vì thế trên 4G (NAT của nhà mạng) bạn không mở cổng được: hộp đó là của nhà mạng.'],
      },
    ],
    quiz: {
      q: ['Your laptop is on 4G behind carrier-grade NAT. Can you forward a port to it?', 'Laptop của bạn dùng 4G sau NAT của nhà mạng. Bạn mở cổng về nó được không?'],
      options: [['No — the NAT box belongs to the ISP; use IPv6, a tunnel or a VPS', 'Không — hộp NAT là của nhà mạng; dùng IPv6, đường hầm hoặc VPS'], ['Yes, on the phone’s settings', 'Được, trong cài đặt điện thoại'], ['Yes, with a different port number', 'Được, với số cổng khác']],
      answer: 0, why: ['Port forwarding is a DNAT rule on the router that does the NAT. You do not control the ISP’s router (real lab: 198.51.100.200:8080 ⇒ refused).', 'Mở cổng là một luật DNAT trên router làm NAT. Bạn không điều khiển được router của nhà mạng (lab thật: 198.51.100.200:8080 ⇒ refused).'],
    },
  },

  // ───────────────────────── ipv6 ─────────────────────────
  {
    id: 'ipv6-compress', ns: 'net-lab', sim: 'ipv6', presets: ['addr'],
    title: ['Writing IPv6 short: the “::” trap', 'Viết gọn IPv6: bẫy “::”'],
    summary: ['Compress 2001:0db8:0000:0000:0001:0000:0000:0001 by the two rules — and choose correctly between two equal runs of zeros.', 'Viết gọn 2001:0db8:0000:0000:0001:0000:0000:0001 bằng hai luật — và chọn đúng giữa hai dãy số 0 dài bằng nhau.'],
    steps: [
      {
        target: 'v6-groups', do: [{ a: 'ipsix.preset', v: 'addr' }, { a: 'player.reset' }],
        title: ['8 groups of 4 hex digits', '8 nhóm, mỗi nhóm 4 chữ số hex'],
        body: ['IPv6 is 128 bits = 8 groups × 16 bits. Each group is 4 hexadecimal digits (0–9, a–f).', 'IPv6 là 128 bit = 8 nhóm × 16 bit. Mỗi nhóm là 4 chữ số thập lục phân (0–9, a–f).'],
      },
      {
        target: 'v6-input',
        title: ['Your turn: the tricky address', 'Đến lượt bạn: địa chỉ khó'],
        body: ['Choose 2001:0db8:0000:0000:0001:0000:0000:0001.', 'Chọn 2001:0db8:0000:0000:0001:0000:0000:0001.'],
        task: { text: ['Choose the address with two zero runs.', 'Chọn địa chỉ có hai dãy số 0.'], until: (s) => s.ipsix?.addr === TRAP, solve: [{ a: 'ipsix.addr', v: TRAP, delay: 300 }] },
      },
      {
        target: 'controls',
        title: ['Your turn: the two rules', 'Đến lượt bạn: hai luật'],
        body: ['Press Step twice. Rule 1 drops leading zeros (0db8 → db8, 0000 → 0). Rule 2 marks the runs of zero groups in yellow.', 'Bấm Bước hai lần. Luật 1 bỏ số 0 đứng đầu (0db8 → db8, 0000 → 0). Luật 2 tô vàng các dãy nhóm 0.'],
        task: { text: ['Step to rule 2.', 'Bấm Bước tới luật 2.'], until: (s) => s.ipsix?.addr === TRAP && ((s.ipsix?.stage as number) ?? 0) >= 2, solve: [step(2)] },
      },
      {
        target: 'v6-groups',
        title: ['Your turn: which run gets “::”?', 'Đến lượt bạn: dãy nào nhận “::”?'],
        body: ['Two runs, both two groups long. Only ONE “::” is allowed. Click the run that the standard (RFC 5952) picks.', 'Hai dãy, đều dài hai nhóm. Chỉ được MỘT “::”. Bấm vào dãy mà chuẩn (RFC 5952) chọn.'],
        task: { text: ['Click the correct zero run.', 'Bấm đúng dãy số 0.'], until: (s) => s.ipsix?.pickOk === true, solve: [{ a: 'ipsix.pick', v: 2, delay: 400 }], hint: ['Equal length ⇒ the FIRST one.', 'Dài bằng nhau ⇒ dãy ĐẦU TIÊN.'] },
      },
      {
        target: 'controls',
        title: ['Your turn: see the result', 'Đến lượt bạn: xem kết quả'],
        body: ['Press Step once.', 'Bấm Bước một lần.'],
        task: { text: ['Step once.', 'Bấm Bước một lần.'], until: (s) => s.ipsix?.result === '2001:db8::1:0:0:1', solve: [step(1)] },
      },
      {
        target: 'v6-result',
        title: ['2001:db8::1:0:0:1', '2001:db8::1:0:0:1'],
        body: ['Python’s ipaddress in the lab printed exactly this. Not 2001:db8:0:0:1::1 — that is also readable, but the standard says the first run, so everyone writes the same string (important when you compare addresses in logs).', 'ipaddress của Python trong lab in đúng như vậy. Không phải 2001:db8:0:0:1::1 — cách đó cũng đọc được, nhưng chuẩn nói dãy đầu, để ai cũng viết ra cùng một chuỗi (quan trọng khi so địa chỉ trong log).'],
      },
      {
        target: 'controls',
        title: ['Your turn: more of IPv6', 'Đến lượt bạn: thêm về IPv6'],
        body: ['Step to the end: the size of a /64, the link-local address made from a MAC, and NDP, the IPv6 replacement for ARP.', 'Bấm Bước tới cuối: cỡ của một /64, địa chỉ link-local sinh từ MAC, và NDP, thứ thay ARP trong IPv6.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.ipsix?.preset === 'addr' && s.ipsix?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
    ],
    quiz: {
      q: ['Compress 2001:0db8:0000:0000:0001:0000:0000:0001.', 'Viết gọn 2001:0db8:0000:0000:0001:0000:0000:0001.'],
      options: [['2001:db8::1:0:0:1', '2001:db8::1:0:0:1'], ['2001:db8:0:0:1::1', '2001:db8:0:0:1::1'], ['2001:db8::1::1', '2001:db8::1::1']],
      answer: 0, why: ['Two equal runs ⇒ the first gets “::”. Two “::” are never allowed — the length of each would be unknown.', 'Hai dãy bằng nhau ⇒ dãy đầu nhận “::”. Không bao giờ được hai “::” — không biết mỗi cái dài bao nhiêu.'],
    },
  },
  {
    id: 'ipv6-happy', ns: 'net-lab', sim: 'ipv6', presets: ['happy'],
    title: ['Happy Eyeballs: when IPv6 breaks silently', 'Happy Eyeballs: khi IPv6 hỏng lặng lẽ'],
    summary: ['A name with IPv6 and IPv4 addresses, a silently broken IPv6 path, and real fallback times of curl and Node.', 'Một tên có cả địa chỉ IPv6 lẫn IPv4, đường IPv6 hỏng lặng lẽ, và thời gian lùi về IPv4 đo thật của curl và Node.'],
    steps: [
      {
        target: 'v6-dig', do: [{ a: 'ipsix.preset', v: 'happy' }, { a: 'ipsix.broken', v: false }, { a: 'player.reset' }],
        title: ['Two records, one name', 'Hai bản ghi, một tên'],
        body: ['labflow.test has an AAAA record (IPv6) and an A record (IPv4). Clients try IPv6 first.', 'labflow.test có bản ghi AAAA (IPv6) và bản ghi A (IPv4). Client thử IPv6 trước.'],
      },
      {
        target: 'controls',
        title: ['Your turn: a normal day', 'Đến lượt bạn: một ngày bình thường'],
        body: ['Step to the end. IPv6 answers, curl connects over IPv6, the server sees the laptop’s own address — no NAT.', 'Bấm Bước tới cuối. IPv6 trả lời, curl kết nối qua IPv6, máy chủ thấy địa chỉ của chính laptop — không NAT.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.ipsix?.broken === false && s.ipsix?.atEnd === true && s.ipsix?.family === '6', solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'v6-broken',
        title: ['Your turn: break IPv6', 'Đến lượt bạn: làm hỏng IPv6'],
        body: ['Switch “IPv6 path silently broken” on. In the lab the ISP drops every IPv6 packet to the data centre without telling anyone.', 'Bật “đường IPv6 hỏng lặng lẽ”. Trong lab nhà mạng vứt mọi gói IPv6 tới trung tâm dữ liệu mà không báo ai.'],
        task: { text: ['Turn the broken IPv6 path on.', 'Bật đường IPv6 hỏng.'], until: (s) => s.ipsix?.broken === true, solve: [{ a: 'ipsix.broken', v: true, delay: 300 }] },
      },
      {
        target: 'controls',
        title: ['Your turn: watch curl', 'Đến lượt bạn: xem curl'],
        body: ['Step until curl is connected. The IPv6 SYN gets no answer; after 200 ms curl starts an IPv4 attempt in parallel, and that one wins.', 'Bấm Bước tới khi curl kết nối được. SYN IPv6 không được trả lời; sau 200 ms curl mở thêm lần thử IPv4 song song, và lần đó thắng.'],
        task: { text: ['Step until connected.', 'Bấm Bước tới khi kết nối.'], until: (s) => s.ipsix?.broken === true && s.ipsix?.connected === true, solve: [step(3)] },
      },
      {
        target: 'v6-curl',
        title: ['0.210868 s', '0,210868 s'],
        body: ['The real curl: “Trying [2001:db8:d::10]:80…”, “Trying 203.0.113.10:80…”, connected after 0.210868 s. About 0.2 s lost — nobody notices.', 'curl thật: “Trying [2001:db8:d::10]:80…”, “Trying 203.0.113.10:80…”, kết nối sau 0,210868 s. Mất chừng 0,2 s — không ai nhận ra.'],
      },
      {
        target: 'controls',
        title: ['Your turn: other clients', 'Đến lượt bạn: các client khác'],
        body: ['Step to the end: Node 22 (324 ms), Node without autoselection (still waiting at 8 s), curl forced to IPv6 (timeout).', 'Bấm Bước tới cuối: Node 22 (324 ms), Node không autoselection (vẫn chờ ở 8 s), curl ép IPv6 (hết giờ).'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.ipsix?.broken === true && s.ipsix?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'v6-timeline',
        title: ['Broken IPv6 looks like SLOW', 'IPv6 hỏng trông như CHẬM'],
        body: ['No error anywhere — just clients that hang. The kernel alone would wait ~127 s before giving up (computed from tcp_syn_retries = 6). When users say “sometimes the site takes forever”, test with curl -6 and curl -4.', 'Không có lỗi nào — chỉ có client bị treo. Riêng nhân sẽ chờ ~127 s mới bỏ cuộc (tính ra từ tcp_syn_retries = 6). Khi người dùng nói “thỉnh thoảng trang tải mãi”, hãy thử curl -6 và curl -4.'],
      },
    ],
    quiz: {
      q: ['IPv6 is silently broken. A client WITHOUT Happy Eyeballs connects to a dual-stack name. What does the user see?', 'IPv6 hỏng lặng lẽ. Một client KHÔNG có Happy Eyeballs kết nối tới một tên có cả hai giao thức. Người dùng thấy gì?'],
      options: [['A long hang, maybe a timeout', 'Treo rất lâu, có thể hết giờ'], ['An immediate error message', 'Báo lỗi ngay lập tức'], ['Nothing — it uses IPv4 at once', 'Không gì — nó dùng IPv4 ngay']],
      answer: 0, why: ['It tries only the first address (IPv6) and waits for SYN retries — the real Node test was still waiting after 8 s.', 'Nó chỉ thử địa chỉ đầu (IPv6) và chờ các lần gửi lại SYN — bài thử Node thật vẫn đang chờ sau 8 s.'],
    },
  },

  // ───────────────────────── bgp ─────────────────────────
  {
    id: 'bgp-path', ns: 'net-lab', sim: 'bgp', presets: ['announce'],
    title: ['Reading an AS path', 'Đọc một AS path'],
    summary: ['Three networks announce their blocks over BGP; fill the real tables and read who really owns 198.18.0.0/24.', 'Ba mạng quảng bá khối của mình qua BGP; điền các bảng thật và đọc ai thật sự sở hữu 198.18.0.0/24.'],
    steps: [
      {
        target: 'bgp-topo', do: [{ a: 'bgp.preset', v: 'announce' }, { a: 'player.reset' }],
        title: ['Three ASes, one exchange point', 'Ba AS, một điểm trao đổi'],
        body: ['An AS (autonomous system) is a network run by one organisation: an ISP, a data centre, a company. Each has a number: 64500, 64510, 64511. They meet at an IX, a shared switch.', 'Một AS (hệ tự trị) là một mạng do một tổ chức vận hành: nhà mạng, trung tâm dữ liệu, một công ty. Mỗi AS có một số: 64500, 64510, 64511. Chúng gặp nhau ở IX, một công tắc chung.'],
      },
      {
        target: 'bgp-summary',
        title: ['Sessions are up', 'Các phiên đã lên'],
        body: ['isp has a BGP session with dc (192.0.2.3) and with rogue (192.0.2.66). BGP = routers telling neighbours “I can reach these blocks”.', 'isp có một phiên BGP với dc (192.0.2.3) và với rogue (192.0.2.66). BGP = các router báo cho hàng xóm “tôi tới được những khối này”.'],
      },
      {
        target: 'controls',
        title: ['Your turn: announce', 'Đến lượt bạn: quảng bá'],
        body: ['Step to the end. Each AS announces its block; watch the tables of isp and dc fill and the paths grow.', 'Bấm Bước tới cuối. Mỗi AS quảng bá khối của mình; xem bảng của isp và dc được điền và các path dài ra.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.bgp?.preset === 'announce' && s.bgp?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'bgp-dc',
        title: ['Your turn: read a path', 'Đến lượt bạn: đọc một path'],
        body: ['In dc’s table, click the row 198.18.0.0/24. Its path is “64500 64511”.', 'Trong bảng của dc, bấm dòng 198.18.0.0/24. Path của nó là “64500 64511”.'],
        task: { text: ['Click 198.18.0.0/24 in dc’s table.', 'Bấm 198.18.0.0/24 trong bảng của dc.'], until: (s) => s.bgp?.pickedAs === 'dc' && s.bgp?.pickedNet === '198.18.0.0/24', solve: [{ a: 'bgp.pick', v: 'dc|198.18.0.0/24', delay: 400 }] },
      },
      {
        target: 'bgp-path',
        title: ['Origin = the last number', 'AS gốc = số cuối'],
        body: ['Read right to left: 64511 (rogue) created the announcement, 64500 (isp) passed it on to dc. Each AS that forwards adds its number to the front. The next hop is still 192.0.2.66 — on a shared IX, traffic goes straight to rogue.', 'Đọc từ phải sang trái: 64511 (rogue) tạo lời quảng bá, 64500 (isp) chuyển tiếp cho dc. AS nào chuyển tiếp cũng thêm số của mình vào đầu. Next hop vẫn là 192.0.2.66 — trên IX chung, lưu lượng đi thẳng tới rogue.'],
      },
      {
        target: 'where',
        title: ['Where in the computer?', 'Ở đâu trong máy?'],
        body: ['The BGP table lives in the RAM of bgpd, an ordinary program (FRR). Its best routes are copied into the kernel routing table — the one you saw in the route lab.', 'Bảng BGP nằm trong RAM của bgpd, một chương trình bình thường (FRR). Các tuyến tốt nhất được chép xuống bảng định tuyến của nhân — chính bảng bạn đã thấy ở lab định tuyến.'],
      },
    ],
    quiz: {
      q: ['dc sees 198.18.0.0/24 with AS path “64500 64511”. Which AS originated it?', 'dc thấy 198.18.0.0/24 với AS path “64500 64511”. AS nào là gốc?'],
      options: [['64511', '64511'], ['64500', '64500'], ['64510', '64510']],
      answer: 0, why: ['The origin is the LAST number; 64500 only passed it on.', 'AS gốc là số CUỐI; 64500 chỉ chuyển tiếp.'],
    },
  },
  {
    id: 'bgp-hijack', ns: 'net-lab', sim: 'bgp', presets: ['hijack'],
    title: ['A route hijack and how to stop it', 'Một vụ cướp tuyến và cách chặn'],
    summary: ['rogue announces a more specific /25 of LabFlow’s block; see the black hole, fix it with a prefix-list, and meet RPKI with real data.', 'rogue quảng bá một /25 cụ thể hơn trong khối của LabFlow; thấy hố đen, sửa bằng prefix-list, và làm quen RPKI với số liệu thật.'],
    steps: [
      {
        target: 'bgp-topo', do: [{ a: 'bgp.preset', v: 'hijack' }, { a: 'player.reset' }],
        title: ['A normal day', 'Một ngày bình thường'],
        body: ['Users at home reach LabFlow 203.0.113.10 through isp and dc. isp’s table has 203.0.113.0/24 via 192.0.2.3.', 'Người dùng ở nhà tới LabFlow 203.0.113.10 qua isp và dc. Bảng của isp có 203.0.113.0/24 qua 192.0.2.3.'],
      },
      {
        target: 'controls',
        title: ['Your turn: the hijack', 'Đến lượt bạn: vụ cướp'],
        body: ['Press Step twice: rogue announces 203.0.113.0/25 and isp installs it.', 'Bấm Bước hai lần: rogue quảng bá 203.0.113.0/25 và isp cài nó.'],
        task: { text: ['Step until isp sends 203.0.113.10 to rogue.', 'Bấm Bước tới khi isp gửi 203.0.113.10 sang rogue.'], until: (s) => s.bgp?.sawHijack === true && s.bgp?.nextHop === '192.0.2.66', solve: [step(2)] },
      },
      {
        target: 'bgp-isp',
        title: ['Longest prefix, again', 'Lại là tiền tố dài nhất'],
        body: ['Both the /24 (via dc) and the /25 (via rogue) contain 203.0.113.10. /25 is longer ⇒ it wins. BGP itself does not check who owns a block.', 'Cả /24 (qua dc) lẫn /25 (qua rogue) đều chứa 203.0.113.10. /25 dài hơn ⇒ nó thắng. Bản thân BGP không kiểm ai sở hữu một khối.'],
      },
      {
        target: 'controls',
        title: ['Your turn: what users see', 'Đến lượt bạn: người dùng thấy gì'],
        body: ['Step once more.', 'Bấm Bước thêm một lần.'],
        task: { text: ['Step once.', 'Bấm Bước một lần.'], until: (s) => s.bgp?.preset === 'hijack' && ((s.bgp?.i as number) ?? 0) >= 3, solve: [step(1)] },
      },
      {
        target: 'bgp-term',
        title: ['Gone, not slow', 'Biến mất, không phải chậm'],
        body: ['curl times out, traceroute stops after isp, and DNS dies too — LabFlow’s name server 203.0.113.53 is inside the stolen half.', 'curl hết giờ, traceroute dừng sau isp, và DNS cũng chết — máy chủ tên 203.0.113.53 của LabFlow nằm trong nửa bị cướp.'],
      },
      {
        target: 'bgp-filter',
        title: ['Your turn: filter', 'Đến lượt bạn: lọc'],
        body: ['Apply the prefix-list on isp: from AS64511 accept only 198.18.0.0/24 — the block rogue really owns.', 'Áp prefix-list trên isp: từ AS64511 chỉ nhận 198.18.0.0/24 — khối rogue thật sự sở hữu.'],
        task: { text: ['Apply the prefix-list.', 'Áp prefix-list.'], until: (s) => s.bgp?.filter === true && s.bgp?.nextHop === '192.0.2.3', solve: [{ a: 'bgp.filter', v: true, delay: 300 }] },
      },
      {
        target: 'bgp-nexthop',
        title: ['Back via dc', 'Đi lại qua dc'],
        body: ['The /25 is rejected, the real `ip route get` on isp says “via 192.0.2.3” again, and LabFlow opens.', '/25 bị từ chối, `ip route get` thật trên isp lại ghi “via 192.0.2.3”, và LabFlow mở được.'],
      },
      {
        target: 'controls',
        title: ['Your turn: the Internet-scale fix', 'Đến lượt bạn: cách sửa cho cả Internet'],
        body: ['Step to the end to meet RPKI.', 'Bấm Bước tới cuối để gặp RPKI.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.bgp?.filter === true && s.bgp?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'bgp-rpki',
        title: ['RPKI: signed ownership', 'RPKI: quyền sở hữu có chữ ký'],
        body: ['Real RIPEstat data for cuongthai.com: the ROA says AS152992 may originate 160.187.0.0/23, up to /24. Try AS64511 (invalid_asn) and a /25 (invalid_length). Routers that check RPKI drop those.', 'Số liệu RIPEstat thật của cuongthai.com: ROA nói AS152992 được làm gốc cho 160.187.0.0/23, tới /24. Thử AS64511 (invalid_asn) và một /25 (invalid_length). Router có kiểm RPKI sẽ vứt chúng.'],
      },
    ],
    quiz: {
      q: ['The ROA allows AS152992 for 160.187.0.0/23, max length /24. AS152992 announces 160.187.1.0/25. RPKI says…', 'ROA cho phép AS152992 với 160.187.0.0/23, độ dài tối đa /24. AS152992 quảng bá 160.187.1.0/25. RPKI nói…'],
      options: [['invalid_length', 'invalid_length'], ['valid', 'valid'], ['invalid_asn', 'invalid_asn']],
      answer: 0, why: ['Right AS, but /25 is longer than the allowed /24 — exactly the trick of a more-specific hijack.', 'Đúng AS, nhưng /25 dài hơn /24 cho phép — đúng mánh của vụ cướp bằng tiền tố cụ thể hơn.'],
    },
  },
];
