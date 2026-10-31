/**
 * Kịch bản hướng dẫn từng bước cho phòng lab mạng (/net-lab — khoá Networking for Developers, 31/10/2026).
 * Viết cho người mới tinh về mạng: mỗi thuật ngữ (MAC, TTL, checksum, cổng…) được giải nghĩa ngay lần đầu gặp.
 * Mọi con số trong lời thoại lấy từ capture thật của lab (engine/capture.ts) hoặc được nói rõ là TÍNH RA.
 */
import type { Tour } from './types';

const step = (n: number, delay = 650) => ({ a: 'player.step', delay, upTo: n });

export const NET_TOURS: Tour[] = [
  // ───────────────────────── encap ─────────────────────────
  {
    id: 'encap-layers', ns: 'net-lab', sim: 'encap', presets: ['http'],
    title: ['One request, four envelopes', 'Một request, bốn lớp phong bì'],
    summary: ['Follow the real 149-byte GET /api/hello from curl, down through TCP, IP and Ethernet, across the router and up to nginx.', 'Theo request thật GET /api/hello 149 byte từ curl, đi xuống qua TCP, IP, Ethernet, qua router rồi lên tới nginx.'],
    steps: [
      {
        target: 'en-stack', do: [{ a: 'encap.mode', v: 'http' }, { a: 'player.reset' }],
        title: ['Three machines, each a stack of layers', 'Ba máy, mỗi máy một chồng tầng'],
        body: ['Left: the client running curl. Middle: a router. Right: the web server running nginx. Inside each machine the network is a stack of layers; the red dashed line separates your program (user space) from the kernel (the operating system).', 'Trái: client chạy curl. Giữa: một router. Phải: máy web chạy nginx. Bên trong mỗi máy, mạng là một chồng tầng; vạch đỏ đứt tách chương trình của bạn (không gian người dùng) khỏi nhân (hệ điều hành).'],
      },
      {
        target: 'en-env',
        title: ['Your turn: let TCP wrap it', 'Đến lượt bạn: để TCP bọc nó'],
        body: ['Press Step twice. First curl hands its 83 bytes of text to the kernel, then TCP puts a 32-byte header in front — like putting a letter into an envelope.', 'Bấm Bước hai lần. Đầu tiên curl trao 83 byte chữ cho nhân, rồi TCP đặt một header 32 byte phía trước — như bỏ lá thư vào phong bì.'],
        task: { text: ['Step until the orange TCP envelope appears.', 'Bấm Bước tới khi phong bì TCP màu cam hiện ra.'], until: (s) => s.encap?.mode === 'http' && ((s.encap?.layers as number) ?? 0) >= 2, solve: [step(2)] },
      },
      {
        target: 'en-hex',
        title: ['Your turn: read a real byte', 'Đến lượt bạn: đọc một byte thật'],
        body: ['These are the real bytes captured in the lab, coloured by layer. Step once more (IP adds its envelope), then click the cyan byte “40” in the second row — byte number 22.', 'Đây là các byte thật bắt được trong lab, tô màu theo tầng. Bấm Bước thêm một lần (IP thêm phong bì của nó), rồi bấm vào byte xanh “40” ở hàng thứ hai — byte số 22.'],
        task: { text: ['Step once, then click byte 22 (value 40).', 'Bấm Bước một lần, rồi bấm byte 22 (giá trị 40).'], until: (s) => s.encap?.sel === 'ip.ttl' && ((s.encap?.layers as number) ?? 0) >= 3, solve: [{ a: 'player.seek', v: 3, delay: 300 }, { a: 'encap.pick', v: 'ip.ttl', delay: 500 }] },
      },
      {
        target: 'en-field',
        title: ['0x40 = 64 = TTL', '0x40 = 64 = TTL'],
        body: ['That byte is the TTL, “time to live”: a counter every router lowers by 1. At 0 the packet is thrown away, so a packet caught in a loop cannot circle forever. Hex 40 is 4 × 16 = 64.', 'Byte đó là TTL, “thời gian sống”: một bộ đếm mà router nào cũng trừ 1. Về 0 thì gói bị vứt, nên một gói lạc vào vòng lặp không thể chạy mãi. Hex 40 là 4 × 16 = 64.'],
      },
      {
        target: 'en-ruler', do: [{ a: 'player.seek', v: 4 }, { a: 'encap.pick', v: 'eth.dst', delay: 300 }],
        title: ['14 + 20 + 32 + 83 = 149', '14 + 20 + 32 + 83 = 149'],
        body: ['Ethernet adds the outermost 14 bytes. Its destination MAC — the hardware address of a network card — is the ROUTER’s card, not the web server: Ethernet only ever carries a frame to the next box on the same network.', 'Ethernet thêm 14 byte ngoài cùng. MAC đích của nó — địa chỉ phần cứng của một card mạng — là card của ROUTER, không phải máy web: Ethernet chỉ chở frame tới hộp kế tiếp trong cùng một mạng.'],
      },
      {
        target: 'controls',
        title: ['Your turn: follow it to nginx', 'Đến lượt bạn: theo nó tới nginx'],
        body: ['Keep pressing Step (or Play). Watch the router swap the Ethernet envelope, then the web server peel the layers off in reverse order until nginx reads exactly the 83 bytes curl wrote.', 'Tiếp tục bấm Bước (hoặc Chạy). Xem router thay phong bì Ethernet, rồi máy web bóc từng lớp theo thứ tự ngược lại tới khi nginx đọc đúng 83 byte curl đã viết.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.encap?.mode === 'http' && s.encap?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'where',
        title: ['Where in the computer?', 'Ở đâu trong máy?'],
        body: ['Every step said where it happens: curl in user-space memory, the socket buffer in kernel RAM, kernel TCP/IP code on a CPU core, the network chip, the cable. In the Docker lab the “cable” is a virtual bridge inside the host’s kernel.', 'Mỗi bước đều nói nó xảy ra ở đâu: curl trong bộ nhớ không gian người dùng, bộ đệm socket trong RAM của nhân, mã TCP/IP của nhân trên một lõi CPU, chip mạng, sợi dây. Ở lab Docker, “dây” là một cầu ảo bên trong nhân của máy chủ.'],
      },
    ],
    quiz: {
      q: ['The frame leaving the client is addressed (destination MAC) to…', 'Frame rời client được gửi (MAC đích) tới…'],
      options: [['The router — the next box on the local network', 'Router — hộp kế tiếp trong mạng cục bộ'], ['The web server 10.10.2.10', 'Máy web 10.10.2.10'], ['Everyone (broadcast)', 'Mọi người (phát rộng)']],
      answer: 0, why: ['MAC addresses only work inside one network. The IP header carries the final destination; the Ethernet header only the next hop.', 'Địa chỉ MAC chỉ có tác dụng trong một mạng. Header IP mang đích cuối cùng; header Ethernet chỉ mang chặng kế tiếp.'],
    },
  },
  {
    id: 'encap-hop', ns: 'net-lab', sim: 'encap', presets: ['hop'],
    title: ['What does a router change?', 'Router đổi những gì?'],
    summary: ['Guess which fields change between the two sides of the router, then compare with the real captures from both sides.', 'Đoán trường nào đổi giữa hai phía router, rồi so với capture thật ở cả hai phía.'],
    steps: [
      {
        target: 'en-stack', do: [{ a: 'encap.mode', v: 'hop' }],
        title: ['The same packet, captured twice', 'Cùng một gói, bắt hai lần'],
        body: ['In the lab we ran tcpdump on the client’s network AND on the web server’s network while one request went through the router. Same packet — but is it byte-for-byte the same on both sides?', 'Trong lab ta chạy tcpdump ở mạng của client VÀ ở mạng của máy web trong lúc một request đi qua router. Cùng một gói — nhưng hai phía có giống nhau từng byte không?'],
      },
      {
        target: 'en-hop',
        title: ['Your turn: guess every row', 'Đến lượt bạn: đoán từng dòng'],
        body: ['For each field choose “changes” or “stays”. Hint: a router works at the IP layer — it needs the IP header to decide where to send the packet, and never looks at TCP or HTTP.', 'Với mỗi trường chọn “đổi” hoặc “giữ”. Gợi ý: router làm việc ở tầng IP — nó cần header IP để quyết định gửi gói đi đâu, và không bao giờ nhìn vào TCP hay HTTP.'],
        task: { text: ['Answer all 10 rows.', 'Trả lời đủ 10 dòng.'], until: (s) => s.encap?.mode === 'hop' && s.encap?.predicted === s.encap?.fields, solve: [{ a: 'encap.predictAll', delay: 400 }] },
      },
      {
        target: 'controls',
        title: ['Your turn: through the router', 'Đến lượt bạn: đi qua router'],
        body: ['Press Step twice and read what the router does inside: drop the old Ethernet envelope, look at the destination IP, lower the TTL, recompute the checksum, wrap a new envelope.', 'Bấm Bước hai lần và đọc router làm gì bên trong: vứt phong bì Ethernet cũ, nhìn IP đích, giảm TTL, tính lại checksum, bọc phong bì mới.'],
        task: { text: ['Step to the far side.', 'Bấm Bước tới phía bên kia.'], until: (s) => ((s.encap?.i as number) ?? 0) >= 2, solve: [step(2)] },
      },
      {
        target: 'en-reveal',
        title: ['Your turn: reveal', 'Đến lượt bạn: mở đáp án'],
        body: ['Press “Reveal the far side”. Each row shows the value tshark measured on the web server’s side and whether you were right.', 'Bấm “Mở phía bên kia”. Mỗi dòng hiện giá trị tshark đo được ở phía máy web và bạn đoán đúng hay sai.'],
        task: { text: ['Reveal the answers.', 'Mở đáp án.'], until: (s) => s.encap?.revealed === true, solve: [{ a: 'encap.reveal', delay: 400 }] },
      },
      {
        target: 'en-hex', do: [{ a: 'encap.side', v: 'web' }],
        title: ['15 bytes rewritten, 134 untouched', '15 byte viết lại, 134 byte nguyên vẹn'],
        body: ['The router rewrote 15 bytes: both MAC addresses (12), the TTL (1: 64 → 63) and the IP checksum (2: 0x3c52 → 0x3d52). Red outlines mark the bytes whose value really differs — only 6, because the lab’s MACs look alike (02:00:0a:0a:…). The other 134 bytes crossed the router untouched.', 'Router viết lại 15 byte: hai địa chỉ MAC (12), TTL (1: 64 → 63) và checksum IP (2: 0x3c52 → 0x3d52). Viền đỏ đánh dấu các byte có giá trị thật sự khác — chỉ 6, vì MAC của lab trông giống nhau (02:00:0a:0a:…). 134 byte còn lại đi qua router nguyên vẹn.'],
      },
      {
        target: 'en-score',
        title: ['Why the checksum changed', 'Vì sao checksum đổi'],
        body: ['A checksum is a small sum of the header bytes so the receiver can spot corruption. TTL is inside the IP header, so when TTL changes the sum must be recomputed — every router does this for every packet.', 'Checksum là một tổng nhỏ của các byte header để bên nhận phát hiện hư hỏng. TTL nằm trong header IP, nên khi TTL đổi thì tổng phải tính lại — router nào cũng làm việc này cho mọi gói.'],
      },
    ],
    quiz: {
      q: ['Which field does EVERY router on the path change?', 'Trường nào MỌI router trên đường đều đổi?'],
      options: [['TTL (and therefore the IP checksum)', 'TTL (và vì thế cả checksum IP)'], ['The destination IP', 'IP đích'], ['The TCP source port', 'Cổng nguồn TCP']],
      answer: 0, why: ['IP addresses and ports are end-to-end (only NAT rewrites them). TTL drops by one per hop — traceroute is built on exactly that.', 'Địa chỉ IP và cổng là đầu-cuối (chỉ NAT mới viết lại). TTL giảm một ở mỗi chặng — traceroute dựng đúng trên điều đó.'],
    },
  },
  {
    id: 'encap-mtu', ns: 'net-lab', sim: 'encap', presets: ['mtu'],
    title: ['Big responses: MTU, MSS and the 4057-byte “packet”', 'Câu trả lời lớn: MTU, MSS và “gói” 4057 byte'],
    summary: ['Cut a real 3991-byte response into segments, see why 1448 and not 1460, and why captures can show packets bigger than the MTU.', 'Cắt câu trả lời thật 3991 byte thành các đoạn, thấy vì sao 1448 chứ không phải 1460, và vì sao capture có thể thấy gói lớn hơn MTU.'],
    steps: [
      {
        target: 'en-mtu', do: [{ a: 'encap.mode', v: 'mtu' }, { a: 'encap.mtu', v: 1500 }, { a: 'encap.offload', v: false }],
        title: ['1500 − 20 − 20 − 12 = 1448', '1500 − 20 − 20 − 12 = 1448'],
        body: ['MTU (maximum transmission unit) = the biggest IP packet a link carries: 1500 bytes on Ethernet. Take away 20 for IP and 20 for TCP: MSS = 1460 bytes of data. But Linux adds 12 bytes of TCP timestamps to every segment, so 1448 really fit.', 'MTU (đơn vị truyền tối đa) = gói IP lớn nhất một đường nối chở được: 1500 byte trên Ethernet. Bớt 20 cho IP và 20 cho TCP: MSS = 1460 byte dữ liệu. Nhưng Linux thêm 12 byte timestamp TCP vào mọi đoạn, nên thật ra chỉ vừa 1448.'],
      },
      {
        target: 'en-segs',
        title: ['Your turn: send the response', 'Đến lượt bạn: gửi câu trả lời'],
        body: ['Press Step until all segments have left: 1448 + 1448 + 1095 = 3991 bytes.', 'Bấm Bước tới khi mọi đoạn đã đi: 1448 + 1448 + 1095 = 3991 byte.'],
        task: { text: ['Send every segment.', 'Gửi hết các đoạn.'], until: (s) => s.encap?.mode === 'mtu' && s.encap?.offload === false && s.encap?.atEnd === true, solve: [step(3)] },
      },
      {
        target: 'en-real',
        title: ['The real capture agrees', 'Capture thật khớp'],
        body: ['With offloading switched off in the lab, tshark saw exactly these frames: 1514, 1514 and 1161 bytes (66 bytes of headers each), each acknowledged by the client.', 'Khi tắt offload trong lab, tshark thấy đúng các frame này: 1514, 1514 và 1161 byte (mỗi frame 66 byte header), cái nào cũng được client xác nhận.'],
      },
      {
        target: 'en-offload',
        title: ['Your turn: the default setting', 'Đến lượt bạn: cài đặt mặc định'],
        body: ['Now switch segmentation offload ON — that is how Linux normally runs.', 'Giờ BẬT segmentation offload — Linux bình thường chạy như vậy.'],
        task: { text: ['Turn offload on.', 'Bật offload.'], until: (s) => s.encap?.offload === true, solve: [{ a: 'encap.offload', v: true, delay: 300 }] },
      },
      {
        target: 'en-segs',
        title: ['Your turn: one giant packet?', 'Đến lượt bạn: một gói khổng lồ?'],
        body: ['Press Step once. The kernel now hands down ONE 4057-byte segment — and tcpdump, which watches before the cut, prints a “packet” far bigger than the MTU. The network card (TSO) or the driver (GSO) cuts it into normal frames afterwards.', 'Bấm Bước một lần. Nhân giờ trao xuống MỘT đoạn 4057 byte — và tcpdump, đứng xem trước chỗ cắt, in ra một “gói” lớn hơn MTU nhiều. Card mạng (TSO) hoặc driver (GSO) cắt nó thành frame bình thường sau đó.'],
        task: { text: ['Step once.', 'Bấm Bước một lần.'], until: (s) => s.encap?.offload === true && ((s.encap?.i as number) ?? 0) >= 1, solve: [step(1)] },
      },
      {
        target: 'en-mtu',
        title: ['Your turn: inside a VPN', 'Đến lượt bạn: bên trong VPN'],
        body: ['Choose MTU 1420, typical inside a WireGuard tunnel. The numbers update — and the orange label says “computed”: this case was not captured in the lab.', 'Chọn MTU 1420, hay gặp bên trong đường hầm WireGuard. Các con số đổi theo — và nhãn cam ghi “tính ra”: trường hợp này lab không bắt gói.'],
        task: { text: ['Pick MTU 1420.', 'Chọn MTU 1420.'], until: (s) => s.encap?.mtu === 1420, solve: [{ a: 'encap.mtu', v: 1420, delay: 300 }] },
      },
    ],
    quiz: {
      q: ['A full TCP segment here carries 1448 bytes, not the MSS of 1460. Why?', 'Một đoạn TCP đầy ở đây chở 1448 byte chứ không phải MSS 1460. Vì sao?'],
      options: [['12 bytes of TCP timestamp options in every segment', '12 byte tuỳ chọn timestamp TCP trong mọi đoạn'], ['The Ethernet header', 'Header Ethernet'], ['The router takes 12 bytes', 'Router lấy mất 12 byte']],
      answer: 0, why: ['MSS assumes a bare 20-byte TCP header. Timestamps make it 32 bytes, leaving 1448 for data.', 'MSS giả định header TCP trần 20 byte. Timestamp làm nó thành 32 byte, còn lại 1448 cho dữ liệu.'],
    },
  },

  // ───────────────────────── arp ─────────────────────────
  {
    id: 'arp-lan', ns: 'net-lab', sim: 'arp', presets: ['lan'],
    title: ['ARP: asking the whole network', 'ARP: hỏi cả mạng'],
    summary: ['An empty cache, a broadcast question, a direct answer and a switch learning ports — on real tcpdump lines.', 'Bộ đệm trống, một câu hỏi phát rộng, một câu trả lời gửi thẳng và công tắc học cổng — trên dòng tcpdump thật.'],
    steps: [
      {
        target: 'arp-topo', do: [{ a: 'arp.preset', v: 'lan' }],
        title: ['Three machines, one switch', 'Ba máy, một công tắc'],
        body: ['Each box shows an IP address (the address across networks) and a MAC address (the hardware address of its network card, valid only here). The switch in the middle connects them; in the Docker lab it is a virtual bridge.', 'Mỗi hộp ghi một địa chỉ IP (địa chỉ xuyên qua các mạng) và một địa chỉ MAC (địa chỉ phần cứng của card mạng, chỉ có giá trị ở đây). Công tắc ở giữa nối chúng lại; trong lab Docker nó là một cầu ảo.'],
      },
      {
        target: 'arp-route', do: [{ a: 'player.seek', v: 1 }],
        title: ['Same network ⇒ deliver it ourselves', 'Cùng mạng ⇒ tự giao'],
        body: ['client wants to ping 10.10.1.11. The routing table says 10.10.1.0/24 is “our” network, so no router is needed — but to build an Ethernet frame we need client2’s MAC, and the cache is empty.', 'client muốn ping 10.10.1.11. Bảng định tuyến nói 10.10.1.0/24 là mạng “của mình”, nên không cần router — nhưng để dựng frame Ethernet ta cần MAC của client2, mà bộ đệm đang trống.'],
      },
      {
        target: 'arp-topo',
        title: ['Your turn: ask everyone', 'Đến lượt bạn: hỏi mọi người'],
        body: ['Press Step. The question “who has 10.10.1.11?” goes to ff:ff:ff:ff:ff:ff, the broadcast address. Watch the switch copy it to every other port.', 'Bấm Bước. Câu hỏi “ai có 10.10.1.11?” đi tới ff:ff:ff:ff:ff:ff, địa chỉ phát rộng. Xem công tắc chép nó ra mọi cổng khác.'],
        task: { text: ['Send the ARP request.', 'Gửi câu hỏi ARP.'], until: (s) => s.arp?.kind === 'arp-req', solve: [step(1)] },
      },
      {
        target: 'arp-tcpdump',
        title: ['The real capture', 'Capture thật'],
        body: ['These lines are what tcpdump printed in the lab. The request appears twice, 25 µs apart: the second copy is our own broadcast echoed back by Docker Desktop’s virtual switch (it shows as inbound with tcpdump -Q in) — not a second question.', 'Đây là những dòng tcpdump in ra trong lab. Câu hỏi xuất hiện hai lần, cách 25 µs: bản thứ hai là chính lời phát rộng của ta bị công tắc ảo của Docker Desktop vọng lại (thấy là gói ĐẾN với tcpdump -Q in) — không phải câu hỏi thứ hai.'],
      },
      {
        target: 'arp-fdb',
        title: ['Your turn: the switch learns', 'Đến lượt bạn: công tắc học'],
        body: ['Press Step twice. client2 recognises its IP and answers straight to the asker. The switch writes down which port each MAC came from — next time it will not need to flood.', 'Bấm Bước hai lần. client2 nhận ra IP của mình và trả lời thẳng cho người hỏi. Công tắc ghi lại mỗi MAC đến từ cổng nào — lần sau nó không cần phát tràn.'],
        task: { text: ['Step until the reply is sent.', 'Bấm Bước tới khi câu trả lời được gửi.'], until: (s) => s.arp?.kind === 'arp-rep', solve: [step(2)] },
      },
      {
        target: 'arp-caches',
        title: ['Your turn: finish the ping', 'Đến lượt bạn: hoàn tất ping'],
        body: ['Step to the end. The cache now says 10.10.1.11 → 02:00:0a:0a:01:0b, REACHABLE, and the ping goes only to port 2.', 'Bấm Bước tới cuối. Bộ đệm giờ ghi 10.10.1.11 → 02:00:0a:0a:01:0b, REACHABLE, và gói ping chỉ đi ra cổng 2.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.arp?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
    ],
    quiz: {
      q: ['How is the ARP REPLY sent?', 'Câu TRẢ LỜI ARP được gửi thế nào?'],
      options: [['Straight to the asker’s MAC (unicast)', 'Thẳng tới MAC người hỏi (gửi thẳng)'], ['To everyone (broadcast)', 'Tới mọi người (phát rộng)'], ['Through the router', 'Qua router']],
      answer: 0, why: ['The question carried the asker’s MAC, so the answer can go directly — see the real line “02:00:0a:0a:01:0b > 02:00:0a:0a:01:0a”.', 'Câu hỏi đã mang MAC của người hỏi, nên câu trả lời đi thẳng được — xem dòng thật “02:00:0a:0a:01:0b > 02:00:0a:0a:01:0a”.'],
    },
  },
  {
    id: 'arp-gateway', ns: 'net-lab', sim: 'arp', presets: ['gateway'],
    title: ['Another network? ARP for the router', 'Mạng khác? ARP hỏi router'],
    summary: ['Ping a machine behind the router and see that ARP asks for the ROUTER’s MAC, while the IP still says the web server.', 'Ping một máy sau router và thấy ARP hỏi MAC của ROUTER, trong khi IP vẫn ghi máy web.'],
    steps: [
      {
        target: 'arp-topo', do: [{ a: 'arp.preset', v: 'gateway' }],
        title: ['The web server is not on this wire', 'Máy web không ở trên dây này'],
        body: ['10.10.2.10 lives on 10.10.2.0/24, behind the router’s other card. If client shouted “who has 10.10.2.10?”, nobody here could answer.', '10.10.2.10 nằm ở 10.10.2.0/24, sau card thứ hai của router. Nếu client hét “ai có 10.10.2.10?”, ở đây không ai trả lời được.'],
      },
      {
        target: 'arp-route', do: [{ a: 'player.seek', v: 1 }],
        title: ['The routing table decides first', 'Bảng định tuyến quyết định trước'],
        body: ['Not in 10.10.1.0/24 ⇒ the default route: “via 10.10.1.254”. So the next hop is the router, and THAT is the IP we need a MAC for.', 'Không thuộc 10.10.1.0/24 ⇒ đường mặc định: “via 10.10.1.254”. Vậy chặng kế tiếp là router, và ĐÓ mới là IP ta cần tìm MAC.'],
      },
      {
        target: 'arp-tcpdump',
        title: ['Your turn: who-has 10.10.1.254', 'Đến lượt bạn: who-has 10.10.1.254'],
        body: ['Press Step and read the real line: the question is about 10.10.1.254. 10.10.2.10 never appears in any ARP on this network.', 'Bấm Bước và đọc dòng thật: câu hỏi là về 10.10.1.254. 10.10.2.10 không hề xuất hiện trong ARP nào ở mạng này.'],
        task: { text: ['Send the ARP request.', 'Gửi câu hỏi ARP.'], until: (s) => s.arp?.kind === 'arp-req', solve: [step(1)] },
      },
      {
        target: 'arp-frame',
        title: ['Your turn: the ping frame', 'Đến lượt bạn: frame ping'],
        body: ['Step until the ping itself leaves. Look at the card below the diagram.', 'Bấm Bước tới khi chính gói ping đi. Nhìn tấm thẻ dưới sơ đồ.'],
        task: { text: ['Step to the ICMP frame.', 'Bấm Bước tới frame ICMP.'], until: (s) => s.arp?.kind === 'icmp' && s.arp?.ipDst === '10.10.2.10', solve: [step(2)] },
      },
      {
        target: 'arp-frame',
        title: ['MAC = next hop, IP = destination', 'MAC = chặng kế, IP = đích'],
        body: ['In this ONE frame: destination MAC 02:00:0a:0a:01:fe (the router), destination IP 10.10.2.10 (the web server). That is the whole idea of routing: the envelope is readdressed at every hop, the letter inside is not.', 'Trong MỘT frame này: MAC đích 02:00:0a:0a:01:fe (router), IP đích 10.10.2.10 (máy web). Đó là toàn bộ ý tưởng định tuyến: phong bì được ghi lại địa chỉ ở mỗi chặng, lá thư bên trong thì không.'],
      },
      {
        target: 'arp-caches',
        title: ['Your turn: to the end', 'Đến lượt bạn: tới cuối'],
        body: ['Step to the end: the reply comes back from the router’s MAC, then the router checks our entry with a unicast question, and the final `ip neigh` shows the router — never the web server.', 'Bấm Bước tới cuối: câu trả lời quay về từ MAC của router, rồi router kiểm mục của ta bằng một câu hỏi gửi thẳng, và `ip neigh` cuối cùng có router — không bao giờ có máy web.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.arp?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
    ],
    quiz: {
      q: ['To ping 10.10.2.10 (another network), client sends an ARP request for…', 'Để ping 10.10.2.10 (mạng khác), client gửi câu hỏi ARP cho…'],
      options: [['10.10.1.254 — its gateway', '10.10.1.254 — cổng ra (gateway) của nó'], ['10.10.2.10', '10.10.2.10'], ['No ARP is needed', 'Không cần ARP']],
      answer: 0, why: ['ARP only works on the local network. To leave it, you need the MAC of the router named in the routing table.', 'ARP chỉ hoạt động trong mạng cục bộ. Muốn ra ngoài, bạn cần MAC của router mà bảng định tuyến chỉ ra.'],
    },
  },

  // ───────────────────────── socket ─────────────────────────
  {
    id: 'socket-demux', ns: 'net-lab', sim: 'socket', presets: ['demux'],
    title: ['Many connections, one port 80', 'Nhiều kết nối, một cổng 80'],
    summary: ['Watch the kernel route every arriving segment to the right socket by four numbers, with a live ss table — then send your own.', 'Xem nhân đưa mỗi đoạn tới đúng socket bằng bốn con số, kèm bảng ss sống — rồi tự gửi một đoạn.'],
    steps: [
      {
        target: 'sk-ss', do: [{ a: 'sock.mode', v: 'demux' }],
        title: ['One listening socket', 'Một socket nghe'],
        body: ['A socket is the kernel’s object for one end of a conversation. nginx has one LISTENING socket on 0.0.0.0:80 — “port 80 on any of my addresses”. A port is just a number that picks one program’s socket inside a machine.', 'Socket là đối tượng của nhân cho một đầu của cuộc trò chuyện. nginx có một socket NGHE ở 0.0.0.0:80 — “cổng 80 trên mọi địa chỉ của tôi”. Cổng chỉ là một con số chọn socket của một chương trình trong một máy.'],
      },
      {
        target: 'sk-match',
        title: ['Your turn: a client knocks', 'Đến lượt bạn: một khách gõ cửa'],
        body: ['Press Step. A SYN (“let’s connect”) arrives from 10.10.1.10:50228. The table compares it with every socket: nobody has this exact conversation yet, so the listener takes it.', 'Bấm Bước. Một SYN (“kết nối nhé”) tới từ 10.10.1.10:50228. Bảng so nó với từng socket: chưa ai có đúng cuộc trò chuyện này, nên socket nghe nhận.'],
        task: { text: ['Step once.', 'Bấm Bước một lần.'], until: (s) => s.sock?.via === 'listener', solve: [step(1)] },
      },
      {
        target: 'sk-ss',
        title: ['Your turn: accept()', 'Đến lượt bạn: accept()'],
        body: ['Press Step twice: the handshake finishes (the new socket waits in the accept queue — see Recv-Q of LISTEN become 1), then nginx calls accept() and gets a brand-new file descriptor for it.', 'Bấm Bước hai lần: bắt tay xong (socket mới chờ trong hàng accept — Recv-Q của LISTEN thành 1), rồi nginx gọi accept() và nhận một file descriptor mới tinh cho nó.'],
        task: { text: ['Step until nginx accepts.', 'Bấm Bước tới khi nginx accept.'], until: (s) => ((s.sock?.i as number) ?? 0) >= 3, solve: [step(2)] },
      },
      {
        target: 'sk-match',
        title: ['Your turn: the second tab', 'Đến lượt bạn: tab thứ hai'],
        body: ['Keep stepping until data arrives from the SECOND tab (port 50230). Same client IP, same server IP and port — only the source port differs, and that is enough.', 'Tiếp tục bấm Bước tới khi dữ liệu tới từ tab THỨ HAI (cổng 50230). Cùng IP client, cùng IP và cổng máy chủ — chỉ cổng nguồn khác, và thế là đủ.'],
        task: { text: ['Step to the data from :50230.', 'Bấm Bước tới dữ liệu từ :50230.'], until: (s) => s.sock?.via === 'established' && s.sock?.segFlags === 'DATA' && s.sock?.hitPeer === '10.10.1.10:50230', solve: [step(12, 500)] },
      },
      {
        target: 'sk-try',
        title: ['Your turn: send one yourself', 'Đến lượt bạn: tự gửi một đoạn'],
        body: ['Pick “10.10.1.11:51000”, choose “data”, port 80, and press Send. Which socket gets it?', 'Chọn “10.10.1.11:51000”, chọn “dữ liệu”, cổng 80, rồi bấm Gửi. Socket nào nhận?'],
        task: { text: ['Send data from 10.10.1.11:51000 to port 80.', 'Gửi dữ liệu từ 10.10.1.11:51000 tới cổng 80.'], until: (s) => s.sock?.probeVia === 'established' && s.sock?.probeSrc === '10.10.1.11:51000', solve: [{ a: 'sock.probe', v: '10.10.1.11:51000|DATA|80', delay: 400 }] },
      },
      {
        target: 'sk-try',
        title: ['Your turn: a closed door', 'Đến lượt bạn: một cánh cửa đóng'],
        body: ['Now send a SYN to port 81, where nobody listens. The kernel answers RST — the “Connection refused” you have seen in error messages.', 'Giờ gửi một SYN tới cổng 81, nơi không ai nghe. Nhân trả RST — chính là “Connection refused” bạn từng thấy trong thông báo lỗi.'],
        task: { text: ['Send a SYN to port 81.', 'Gửi SYN tới cổng 81.'], until: (s) => s.sock?.probeVia === 'rst' && s.sock?.probePort === 81, solve: [{ a: 'sock.probe', v: '10.10.1.11:51000|SYN|81', delay: 400 }] },
      },
    ],
    quiz: {
      q: ['Two tabs of one browser talk to the same server on port 80. What tells their sockets apart?', 'Hai tab của một trình duyệt nói chuyện với cùng máy chủ ở cổng 80. Điều gì phân biệt socket của chúng?'],
      options: [['The client’s source port', 'Cổng nguồn của client'], ['The server port', 'Cổng của máy chủ'], ['Nothing — they share one socket', 'Không gì cả — chúng dùng chung một socket']],
      answer: 0, why: ['A connection is identified by all four numbers. The kernel gave each tab a different ephemeral source port.', 'Một kết nối được nhận diện bằng cả bốn con số. Nhân cấp cho mỗi tab một cổng nguồn tạm khác nhau.'],
    },
  },
  {
    id: 'socket-bind', ns: 'net-lab', sim: 'socket', presets: ['bind'],
    title: ['“Works on my machine”: 127.0.0.1 vs 0.0.0.0', '“Chạy trên máy tôi mà”: 127.0.0.1 hay 0.0.0.0'],
    summary: ['See who can reach an API listening on 127.0.0.1 inside Docker, and fix it.', 'Xem ai với tới được một API nghe ở 127.0.0.1 bên trong Docker, rồi sửa.'],
    steps: [
      {
        target: 'sk-bind', do: [{ a: 'sock.mode', v: 'bind' }, { a: 'sock.bind', v: '127.0.0.1' }],
        title: ['app.listen(3000, \'127.0.0.1\')', 'app.listen(3000, \'127.0.0.1\')'],
        body: ['The API in the container listens on 127.0.0.1 — the loopback address, which means “this machine talking to itself”. It is a common default in development configs.', 'API trong container nghe ở 127.0.0.1 — địa chỉ loopback, nghĩa là “máy này tự nói với chính nó”. Đây là mặc định hay gặp trong cấu hình lúc phát triển.'],
      },
      {
        target: 'sk-callers',
        title: ['Your turn: four callers', 'Đến lượt bạn: bốn nơi gọi'],
        body: ['Press Play or step to the end. Four callers try port 3000, each arriving through a different door.', 'Bấm Chạy hoặc bấm Bước tới cuối. Bốn nơi thử gọi cổng 3000, mỗi nơi đi vào qua một cửa khác.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.sock?.mode === 'bind' && s.sock?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'sk-host',
        title: ['The classic Docker bug', 'Lỗi Docker kinh điển'],
        body: ['docker run -p 3000:3000 forwards your laptop’s port into the container’s eth0 (that rewrite is called DNAT). But nobody listens on eth0 — only on lo. So it works when you run Node on your laptop, and fails the moment you put it in a container.', 'docker run -p 3000:3000 chuyển cổng của laptop vào eth0 của container (phép viết lại đó gọi là DNAT). Nhưng không ai nghe ở eth0 — chỉ nghe ở lo. Nên chạy Node trên laptop thì được, cho vào container là hỏng ngay.'],
      },
      {
        target: 'sk-bind',
        title: ['Your turn: fix it', 'Đến lượt bạn: sửa nó'],
        body: ['Switch the app to listen on 0.0.0.0 — “every address this machine has”.', 'Đổi ứng dụng sang nghe ở 0.0.0.0 — “mọi địa chỉ máy này có”.'],
        task: { text: ['Listen on 0.0.0.0.', 'Nghe ở 0.0.0.0.'], until: (s) => s.sock?.bind === '0.0.0.0', solve: [{ a: 'sock.bind', v: '0.0.0.0', delay: 300 }] },
      },
      {
        target: 'sk-callers',
        title: ['Your turn: try again', 'Đến lượt bạn: thử lại'],
        body: ['Step to the end again. All four callers should get in now.', 'Bấm Bước tới cuối lần nữa. Giờ cả bốn nơi đều phải vào được.'],
        task: { text: ['Go to the last step.', 'Đi tới bước cuối.'], until: (s) => s.sock?.bind === '0.0.0.0' && s.sock?.atEnd === true && s.sock?.okCount === 4, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'sk-ifaces',
        title: ['Two doors, one socket', 'Hai cửa, một socket'],
        body: ['0.0.0.0 puts the socket behind both lo and eth0. If you only want it reachable from inside the Docker network, binding the container’s own IP also works — but then 127.0.0.1 inside the container is refused.', '0.0.0.0 đặt socket sau cả lo lẫn eth0. Nếu chỉ muốn với tới được từ trong mạng Docker, bind đúng IP của container cũng được — nhưng khi đó 127.0.0.1 bên trong container lại bị từ chối.'],
      },
    ],
    quiz: {
      q: ['Your API works with `node server.js` but `docker run -p 3000:3000` gives “connection reset”. Most likely fix?', 'API chạy được với `node server.js` nhưng `docker run -p 3000:3000` báo “connection reset”. Cách sửa khả dĩ nhất?'],
      options: [['Listen on 0.0.0.0 instead of 127.0.0.1', 'Nghe ở 0.0.0.0 thay vì 127.0.0.1'], ['Use port 80', 'Dùng cổng 80'], ['Restart Docker', 'Khởi động lại Docker']],
      answer: 0, why: ['Inside the container, 127.0.0.1 is the container’s own loopback; traffic from -p arrives on eth0.', 'Bên trong container, 127.0.0.1 là loopback của riêng container; lưu lượng từ -p đi vào qua eth0.'],
    },
  },

  // ───────────────────────── waterfall ─────────────────────────
  {
    id: 'waterfall-phases', ns: 'net-lab', sim: 'waterfall', presets: ['cold'],
    title: ['Press Enter: five phases', 'Bấm Enter: năm chặng'],
    summary: ['Reveal DNS, TCP, TLS, waiting and download from a real curl run, avoid the cumulative-number trap, and see what distance does.', 'Mở dần DNS, TCP, TLS, chờ và tải về từ một lần chạy curl thật, tránh bẫy số cộng dồn, và thấy khoảng cách làm gì.'],
    steps: [
      {
        target: 'wf-preset', do: [{ a: 'wf.preset', v: 'cold' }, { a: 'wf.run', v: 0 }, { a: 'wf.cum', v: false }],
        title: ['A real measurement', 'Một lần đo thật'],
        body: ['curl -w can print timestamps of each phase. These are real numbers from a laptop in Hanoi to cuongthai.com, first visit.', 'curl -w in được mốc thời gian của từng chặng. Đây là số thật từ một laptop ở Hà Nội tới cuongthai.com, lần truy cập đầu.'],
      },
      {
        target: 'wf-chart',
        title: ['Your turn: reveal the phases', 'Đến lượt bạn: mở từng chặng'],
        body: ['Press Step five times and read each phase: find the IP (DNS), open a TCP connection, set up encryption (TLS), wait for the server, download.', 'Bấm Bước năm lần và đọc từng chặng: tìm IP (DNS), mở kết nối TCP, dựng mã hoá (TLS), chờ máy chủ, tải về.'],
        task: { text: ['Reveal all five phases.', 'Mở đủ năm chặng.'], until: (s) => s.wf?.atEnd === true, solve: [step(5, 500)] },
      },
      {
        target: 'wf-cum',
        title: ['Your turn: the trap', 'Đến lượt bạn: cái bẫy'],
        body: ['Switch to “what curl says”. curl prints CUMULATIVE times: time_appconnect = 0.056536 means TLS ended 56.5 ms after the start. TLS itself took 56.5 − 39.9 = 16.6 ms.', 'Chuyển sang “curl nói”. curl in thời gian CỘNG DỒN: time_appconnect = 0.056536 nghĩa là TLS xong lúc 56,5 ms tính từ đầu. Bản thân TLS chỉ mất 56,5 − 39,9 = 16,6 ms.'],
        task: { text: ['Show what curl says.', 'Hiện số curl nói.'], until: (s) => s.wf?.cum === true, solve: [{ a: 'wf.cum', v: true, delay: 300 }] },
      },
      {
        target: 'wf-preset',
        title: ['Your turn: a reused connection', 'Đến lượt bạn: kết nối dùng lại'],
        body: ['Pick “reused connection”: the second URL curl fetched on the same connection.', 'Chọn “dùng lại kết nối”: URL thứ hai curl lấy trên cùng kết nối.'],
        task: { text: ['Open the reused-connection run.', 'Mở lần chạy dùng lại kết nối.'], until: (s) => s.wf?.preset === 'warm', solve: [{ a: 'wf.preset', v: 'warm', delay: 300 }] },
      },
      {
        target: 'wf-chart',
        title: ['Your turn: three phases vanish', 'Đến lượt bạn: ba chặng biến mất'],
        body: ['Step to the end. DNS, TCP and TLS are 0 — curl reports connect = 0 and appconnect = 0. That is why keep-alive and HTTP/2 matter: the setup is paid once.', 'Bấm Bước tới cuối. DNS, TCP và TLS bằng 0 — curl báo connect = 0 và appconnect = 0. Vì vậy keep-alive và HTTP/2 quan trọng: phần dựng kết nối chỉ trả một lần.'],
        task: { text: ['Go to the last phase.', 'Đi tới chặng cuối.'], until: (s) => s.wf?.preset === 'warm' && s.wf?.atEnd === true, solve: [{ a: 'player.end', delay: 400 }] },
      },
      {
        target: 'wf-rtt',
        title: ['Your turn: move the server away', 'Đến lượt bạn: dời máy chủ ra xa'],
        body: ['RTT (round-trip time) = how long a packet takes to go there and back. Drag it to 150 ms — roughly Hanoi to Europe. In this computed model DNS, TCP, TLS and waiting each cost a round trip: distance quickly dominates the server’s 15 ms of work.', 'RTT (thời gian đi-về) = một gói đi tới đó và quay lại mất bao lâu. Kéo lên 150 ms — đại khái Hà Nội tới châu Âu. Trong mô hình tính ra này, DNS, TCP, TLS và chờ đều tốn một vòng đi-về: khoảng cách nhanh chóng lấn át 15 ms máy chủ làm việc.'],
        task: { text: ['Set RTT to 150 ms or more.', 'Đặt RTT từ 150 ms trở lên.'], until: (s) => ((s.wf?.rtt as number) ?? 0) >= 150, solve: [{ a: 'wf.rtt', v: 150, delay: 300 }] },
      },
    ],
    quiz: {
      q: ['curl prints time_connect = 0.039891 and time_appconnect = 0.056536. How long did the TLS handshake take?', 'curl in time_connect = 0.039891 và time_appconnect = 0.056536. Bắt tay TLS mất bao lâu?'],
      options: [['About 16.6 ms', 'Khoảng 16,6 ms'], ['56.5 ms', '56,5 ms'], ['96.4 ms', '96,4 ms']],
      answer: 0, why: ['The values are cumulative from the start: subtract the previous mark.', 'Các giá trị cộng dồn từ lúc bắt đầu: trừ đi mốc trước.'],
    },
  },
];
