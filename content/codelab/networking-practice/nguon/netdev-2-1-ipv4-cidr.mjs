/** Networking for Developers · 2.1 — IPv4, CIDR, chia subnet: mặt nạ ↔ prefix, mạng/broadcast/host (cả /31, /32), lỗi gõ /16 thay /24 đọc từ output thật, dải đặc biệt; tự viết cidr() như cidr.py và vlsm() như chia.py. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre, ra } from './_net.mjs';

const so = (n) => { const s = String(n); const d = s.replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return [...new Set([s, d, d.replace(/ /g, ','), d.replace(/ /g, '.')])]; };
const KHONG = ['none', '-', 'no broadcast', 'n/a', 'không có'];

/* ── 1. Mặt nạ ↔ prefix ↔ cỡ, và nhị phân ── */
const MASK = { 16: '255.255.0.0', 22: '255.255.252.0', 24: '255.255.255.0', 26: '255.255.255.192', 28: '255.255.255.240', 30: '255.255.255.252', 31: '255.255.255.254', 32: '255.255.255.255' };
const hangMask = (p) => {
  const n = 2 ** (32 - p);
  return { o: { x: `/${p}` }, a: { m: MASK[p], n: so(n), u: so(p <= 30 ? n - 2 : n) } };
};
const BIN = [
  ['10.10.1.10', '00001010.00001010.00000001.00001010', 'the lab client (c21-dia-chi)'],
  ['192.168.50.77', '11000000.10101000.00110010.01001101', 'the /26 example (c21-dia-chi)'],
  ['10.30.0.200', '00001010.00011110.00000000.11001000', 'a server address of Lab 2 (lab2-r1)'],
];
const binDang = (s) => [s, s.replace(/\./g, ' '), s.replace(/\./g, '')];
const E1 = cs({
  ten: 'CIDR 1 — Masks, prefixes and sizes', kho: 'EASY', phut: 12, loai: 'table',
  en: 'A /p prefix means "the first p bits are the network". The mask is p ones followed by 32 − p zeros, written as four bytes. The network then has 2<sup>32−p</sup> addresses; the first (network) and the last (broadcast) are not given to machines — except /31 (a point-to-point link, RFC 3021: both usable) and /32 (exactly one machine). Fill the first table without a calculator, then write three real addresses of the course in binary (8 digits per byte, dots between bytes — exactly as <code>cidr.py</code> prints them).',
  vi: 'Prefix /p nghĩa là "p bit đầu là phần mạng". Mặt nạ là p số 1 rồi 32 − p số 0, viết thành bốn byte. Mạng khi đó có 2<sup>32−p</sup> địa chỉ; địa chỉ đầu (mạng) và cuối (broadcast) không cấp cho máy — trừ /31 (đường điểm-điểm, RFC 3021: dùng được cả hai) và /32 (đúng một máy). Điền bảng đầu không dùng máy tính, rồi viết ba địa chỉ thật của khoá dưới dạng nhị phân (8 chữ số mỗi byte, chấm giữa các byte — đúng như <code>cidr.py</code> in ra).',
  bang: [
    bang1('b1', ['Prefix → mask → number of addresses', 'Prefix → mặt nạ → số địa chỉ'], [{ ma: 'x', ten: 'Prefix' }, { ma: 'm', ten: 'Mask (dotted)' }, { ma: 'n', ten: 'Addresses' }, { ma: 'u', ten: 'Usable hosts' }],
      [16, 22, 24, 26, 28, 30, 31, 32].map(hangMask),
      ['Count the ones byte by byte: /22 = 8 + 8 + 6 ⇒ the third byte is 1111 1100 = 252, so 255.255.252.0; /26 ⇒ the fourth byte is 1100 0000 = 192; /28 ⇒ 1111 0000 = 240. Addresses = 2^(32 − p): /22 ⇒ 2^10 = 1024, /26 ⇒ 64, /28 ⇒ 16. Usable = addresses − 2, except /31 (2: no broadcast is needed on a link with only two ends) and /32 (1). The table in lesson 2.1 lists the same values; /22 is the size of the LabFlow office block 10.20.0.0/22 (1 024 addresses).', 'Đếm số 1 theo từng byte: /22 = 8 + 8 + 6 ⇒ byte thứ ba là 1111 1100 = 252, nên 255.255.252.0; /26 ⇒ byte thứ tư là 1100 0000 = 192; /28 ⇒ 1111 0000 = 240. Số địa chỉ = 2^(32 − p): /22 ⇒ 2^10 = 1024, /26 ⇒ 64, /28 ⇒ 16. Dùng được = số địa chỉ − 2, trừ /31 (2: đường chỉ có hai đầu thì không cần broadcast) và /32 (1). Bảng trong bài 2.1 có đúng các giá trị này; /22 là cỡ khối văn phòng LabFlow 10.20.0.0/22 (1 024 địa chỉ).']),
    bang1('b2', ['Dotted decimal → 32 bits', 'Thập phân có chấm → 32 bit'], [{ ma: 'x', ten: 'Address' }, { ma: 'b', ten: '32 bits (8 per byte, dots between)' }],
      BIN.map(([ip, b, ghi]) => ({ o: { x: `${ip} — ${ghi}` }, a: { b: binDang(b) } })),
      ['Each byte separately, with the weights 128 64 32 16 8 4 2 1, always 8 digits: 10 = 0000 1010; 1 = 0000 0001 (not "1"); 168 = 128 + 32 + 8 = 1010 1000; 77 = 64 + 8 + 4 + 1 = 0100 1101; 30 = 16 + 8 + 4 + 2 = 0001 1110; 200 = 128 + 64 + 8 = 1100 1000. These are the first lines cidr.py printed in the lab.', 'Từng byte riêng, với trọng số 128 64 32 16 8 4 2 1, luôn đủ 8 chữ số: 10 = 0000 1010; 1 = 0000 0001 (không phải "1"); 168 = 128 + 32 + 8 = 1010 1000; 77 = 64 + 8 + 4 + 1 = 0100 1101; 30 = 16 + 8 + 4 + 2 = 0001 1110; 200 = 128 + 64 + 8 = 1100 1000. Đây là các dòng đầu cidr.py đã in trong lab.']),
  ],
  goiY: [['The mask byte that is only partly ones is one of 128, 192, 224, 240, 248, 252, 254 (1 to 7 ones).', 'Byte mặt nạ chỉ có một phần là số 1 luôn là một trong 128, 192, 224, 240, 248, 252, 254 (1 tới 7 số 1).'], ['2^10 = 1024 is worth remembering: every 10 host bits multiply the size by about a thousand.', 'Nên nhớ 2^10 = 1024: cứ 10 bit host là cỡ mạng nhân khoảng một nghìn.']],
  loi: [['Writing 0 usable hosts for a /31 by the "− 2" rule: RFC 3021 makes both addresses usable.', 'Ghi /31 có 0 host dùng được theo luật "− 2": RFC 3021 cho dùng cả hai địa chỉ.'], ['Dropping the leading zeros of a byte (1 instead of 00000001): the network/host split is then in the wrong place.', 'Bỏ số 0 đầu của một byte (1 thay vì 00000001): ranh giới mạng/host khi đó lệch chỗ.']],
  tns: [tn('subnet mask', 'mặt nạ mạng', 'p số 1 rồi các số 0, vd 255.255.255.0 = /24.'), tn('prefix length', 'độ dài tiền tố', 'Số bit phần mạng, chữ số sau dấu /.'), tn('usable hosts', 'số máy dùng được', 'Số địa chỉ trừ địa chỉ mạng và broadcast.'), tn('point-to-point link', 'đường điểm-điểm', 'Đường nối đúng hai thiết bị, vd hai router.')],
  kn: ['subnet mask', 'CIDR'],
});

/* ── 2. Dải đặc biệt ── */
const E2 = cs({
  ten: 'CIDR 2 — Special ranges and where they bite', kho: 'EASY', phut: 10,
  en: 'Some ranges have a fixed meaning (IANA\'s special-purpose registry). Recognising them saves hours: "169.254" means DHCP failed, "100.64" means your ISP shares your address, documentation ranges are safe to use in examples. Real output from the lab, for question 7:' + pre(['$ docker network inspect bridge -f \'…\'', ...sauLenh('c21-docker', 'docker network inspect bridge')]),
  vi: 'Một số dải có nghĩa cố định (sổ đăng ký mục đích đặc biệt của IANA). Nhận ra chúng tiết kiệm hàng giờ: "169.254" nghĩa là DHCP hỏng, "100.64" nghĩa là nhà mạng dùng chung địa chỉ của bạn, các dải cho tài liệu dùng làm ví dụ an toàn. Output thật trong lab, cho câu 7:' + pre(['$ docker network inspect bridge -f \'…\'', ...sauLenh('c21-docker', 'docker network inspect bridge')]),
  cau: [
    q('c1', ['A classmate\'s laptop shows the address 169.254.23.7 and nothing works. What happened?', 'Laptop của bạn cùng lớp hiện địa chỉ 169.254.23.7 và không gì chạy. Chuyện gì đã xảy ra?'], ['DHCP gave no answer, so the machine picked a link-local address itself', 'The school gave it a public address that the firewall then blocked', 'Docker created a bridge network and took the main network card', 'The ISP moved the laptop behind its carrier-grade NAT range'], ['169.254.0.0/16 is link-local: the operating system gives itself one when DHCP fails. Fix DHCP (or the Wi-Fi join), not the app.', '169.254.0.0/16 là link-local: hệ điều hành tự đặt khi DHCP không trả lời. Sửa DHCP (hoặc việc vào Wi-Fi), không phải sửa ứng dụng.']),
    q('c2', ['Your home router shows its WAN address as 100.72.14.9. What does that tell you?', 'Router nhà bạn hiện địa chỉ WAN là 100.72.14.9. Điều đó cho biết gì?'], ['It is inside 100.64.0.0/10: the ISP does NAT again (CGNAT)', 'It is a normal public address that anyone can connect to', 'It is a private RFC 1918 address used only inside the home', 'It is a documentation address that the ISP gave by mistake'], ['100.64.0.0/10 covers 100.64.0.0 – 100.127.255.255 (RFC 6598, shared address space). Your router is itself behind the ISP\'s NAT — lesson 2.3 explains why you then cannot forward a port.', '100.64.0.0/10 phủ 100.64.0.0 – 100.127.255.255 (RFC 6598, không gian dùng chung). Router của bạn tự nó đứng sau NAT của nhà mạng — bài 2.3 giải thích vì sao khi đó không mở cổng được.']),
    q('c3', ['Which of these addresses is NOT a private (RFC 1918) address?', 'Địa chỉ nào dưới đây KHÔNG phải địa chỉ riêng (RFC 1918)?'], ['172.32.0.5', '172.31.200.1', '10.255.0.1', '192.168.0.254'], ['172.16.0.0/12 means the first 12 bits are fixed: 172.16.0.0 up to 172.31.255.255. 172.32.x.x is just outside — a public address. 10/8 and 192.168/16 are the other two private ranges.', '172.16.0.0/12 nghĩa là 12 bit đầu cố định: từ 172.16.0.0 tới 172.31.255.255. 172.32.x.x nằm ngay bên ngoài — là địa chỉ công cộng. 10/8 và 192.168/16 là hai dải riêng còn lại.']),
    q('c4', ['The course\'s "Internet in a box" uses 192.0.2.0/24, 198.51.100.0/24 and 203.0.113.0/24 as public addresses. Why those?', '"Internet trong một hộp" của khoá dùng 192.0.2.0/24, 198.51.100.0/24 và 203.0.113.0/24 làm địa chỉ công cộng. Vì sao chọn chúng?'], ['They are reserved for documentation (RFC 5737), so they belong to nobody', 'They are the cheapest ranges to rent from the regional registry', 'They are private ranges that every home router already uses', 'They are the ranges that Docker always picks for new networks'], ['RFC 5737 reserves these three /24s for examples, so a lab or a slide can never point at somebody\'s real server.', 'RFC 5737 dành riêng ba khối /24 này cho ví dụ, nên lab hay slide không bao giờ trỏ tới máy chủ thật của ai.']),
    q('c5', ['A cloud firewall rule says "source CIDR 0.0.0.0/0, port 5432". Who may connect?', 'Một luật tường lửa trên cloud ghi "source CIDR 0.0.0.0/0, cổng 5432". Ai được kết nối?'], ['Every IPv4 address on the Internet', 'Only machines inside the same VPC', 'Only the machine with address 0.0.0.0', 'Nobody, because the prefix length is zero'], ['/0 means zero network bits: every address matches. For a database you want your app\'s address with /32, or the VPC range.', '/0 nghĩa là không có bit mạng nào: mọi địa chỉ đều khớp. Với cơ sở dữ liệu, bạn cần địa chỉ ứng dụng của mình với /32, hoặc dải của VPC.']),
    q('c6', ['Before CIDR (1993), a company with 300 machines had to take …', 'Trước CIDR (1993), một công ty có 300 máy phải lấy …'], ['a class B network of 65 534 addresses, wasting most of it', 'a class C network of 254 addresses and leave 46 machines out', 'two class C networks joined into one /23, exactly as today', 'a class A network of 16 million addresses for future growth'], ['Classes were fixed at /8, /16 and /24. 300 does not fit in a class C (254), so the next size was a class B. CIDR allowed any prefix — a /23 (510 hosts) today.', 'Các lớp cố định ở /8, /16 và /24. 300 không vừa lớp C (254), nên cỡ kế tiếp là lớp B. CIDR cho mọi prefix — ngày nay là một /23 (510 host).']),
    q('c7', ['Since a student installed Docker, the school servers in 172.17.5.0/24 cannot be reached, while the Internet works. The most likely cause?', 'Từ khi một bạn cài Docker, máy chủ của trường ở 172.17.5.0/24 không tới được, trong khi Internet vẫn chạy. Nguyên nhân khả dĩ nhất?'], ['Docker\'s bridge 172.17.0.0/16 overlaps it, so packets go into the container network', 'Docker installed a firewall that blocks every school address by default', 'The school servers ban every machine that has Docker installed', 'Docker changed the laptop\'s mask to /16, like the client2 bug'], ['The real output shows the default bridge is 172.17.0.0/16 — it contains 172.17.5.0/24, so the laptop believes those addresses are on docker0. Move Docker with "default-address-pools" in /etc/docker/daemon.json.', 'Output thật cho thấy bridge mặc định là 172.17.0.0/16 — nó chứa 172.17.5.0/24, nên laptop tin các địa chỉ đó ở trên docker0. Dời Docker bằng "default-address-pools" trong /etc/docker/daemon.json.']),
  ],
  goiY: [['Write the ranges as start – end: 172.16/12 is 172.16 – 172.31; 100.64/10 is 100.64 – 100.127.', 'Viết các dải thành đầu – cuối: 172.16/12 là 172.16 – 172.31; 100.64/10 là 100.64 – 100.127.'], ['Two networks overlap when one prefix is inside the other: compare the first bits of the shorter one.', 'Hai mạng chồng nhau khi một prefix nằm trong prefix kia: so các bit đầu của prefix ngắn hơn.']],
  loi: [['Treating every 172.x.x.x address as private.', 'Coi mọi địa chỉ 172.x.x.x là địa chỉ riêng.'], ['Opening 0.0.0.0/0 "just for a test" on a database port.', 'Mở 0.0.0.0/0 "để thử thôi" cho cổng cơ sở dữ liệu.']],
  tns: [tn('private range (RFC 1918)', 'dải riêng', '10/8, 172.16/12, 192.168/16.'), tn('link-local', 'địa chỉ nội liên kết', '169.254/16 — máy tự đặt khi DHCP hỏng.'), tn('CGNAT range', 'dải NAT của nhà mạng', '100.64.0.0/10.'), tn('documentation range', 'dải dành cho tài liệu', 'RFC 5737: 192.0.2/24, 198.51.100/24, 203.0.113/24.')],
  kn: ['special-purpose addresses'],
});

/* ── 3. Mạng, broadcast, host đầu/cuối ── */
const ROWS = [
  ['10.10.1.10/24', '10.10.1.0', '10.10.1.255', '10.10.1.1', '10.10.1.254', 254, 'c21-dia-chi'],
  ['10.10.1.10/16', '10.10.0.0', '10.10.255.255', '10.10.0.1', '10.10.255.254', 65534, 'c21-dia-chi'],
  ['192.168.50.77/26', '192.168.50.64', '192.168.50.127', '192.168.50.65', '192.168.50.126', 62, 'c21-dia-chi'],
  ['10.30.0.200/26', '10.30.0.192', '10.30.0.255', '10.30.0.193', '10.30.0.254', 62, 'lab2-r1'],
  ['203.0.113.10/32', '203.0.113.10', null, '203.0.113.10', '203.0.113.10', 1, 'c21-dia-chi'],
  ['192.0.2.0/31', '192.0.2.0', null, '192.0.2.0', '192.0.2.1', 2, 'c21-dia-chi'],
];
const E3 = cs({
  ten: 'CIDR 3 — Network, broadcast, first and last host by hand', kho: 'MEDIUM', phut: 18, loai: 'table',
  en: 'Network = address AND mask (keep the network bits, set the host bits to 0). Broadcast = network with all host bits 1. Hosts = everything between them. Shortcut for a prefix that ends inside a byte: the block size of that byte is 256 − mask byte, networks start at multiples of it. Every row below was run through <code>cidr.py</code> in the lab (file in brackets) — do it on paper first, then compare. Write "none" for the broadcast of /31 and /32. Real output for the first row:' + pre(sauLenh('c21-dia-chi', 'python3 cidr.py 10.10.1.10/24')),
  vi: 'Mạng = địa chỉ AND mặt nạ (giữ bit mạng, bit host thành 0). Broadcast = mạng với mọi bit host là 1. Host = mọi địa chỉ ở giữa. Mẹo khi prefix kết thúc giữa một byte: cỡ khối của byte đó là 256 − byte mặt nạ, các mạng bắt đầu ở bội số của nó. Mọi dòng dưới đây đã chạy qua <code>cidr.py</code> trong lab (tệp trong ngoặc) — làm ra giấy trước rồi so. Ghi "none" cho broadcast của /31 và /32. Output thật của dòng đầu:' + pre(sauLenh('c21-dia-chi', 'python3 cidr.py 10.10.1.10/24')),
  bang: [bang1('b1', ['Six real addresses', 'Sáu địa chỉ thật'], [{ ma: 'x', ten: 'Address/prefix' }, { ma: 'n', ten: 'Network' }, { ma: 'b', ten: 'Broadcast' }, { ma: 'f', ten: 'First host' }, { ma: 'l', ten: 'Last host' }, { ma: 'u', ten: 'Usable' }],
    ROWS.map(([x, n, b, f, l, u, tep]) => ({ o: { x: `${x} (${tep})` }, a: { n, b: b || KHONG, f, l, u: so(u) } })),
    ['/24 and /16 end on a byte boundary: zero the host bytes, then set them to 255. /26: block size 256 − 192 = 64, so networks start at 0, 64, 128, 192 — 77 is in 64–127 and 200 is in 192–255 (that is the "servers" subnet of Lab 2). The same address 10.10.1.10 with /16 is in a network 256 times bigger: 10.10.0.0 – 10.10.255.255. /32 is one machine (network = first = last = the address), /31 has exactly two addresses and no broadcast — cidr.py prints "broadcast none" for both.', '/24 và /16 kết thúc đúng ranh giới byte: byte host thành 0, rồi thành 255. /26: cỡ khối 256 − 192 = 64, nên các mạng bắt đầu ở 0, 64, 128, 192 — 77 nằm trong 64–127 và 200 nằm trong 192–255 (đó là subnet "servers" của Lab 2). Cùng địa chỉ 10.10.1.10 mà /16 thì nằm trong mạng lớn gấp 256 lần: 10.10.0.0 – 10.10.255.255. /32 là một máy (mạng = đầu = cuối = chính địa chỉ đó), /31 có đúng hai địa chỉ và không có broadcast — cidr.py in "broadcast none" cho cả hai.'])],
  goiY: [['Find the "interesting" byte (where the prefix ends), compute its block size, and find the multiple of the block size just below the address byte.', 'Tìm byte "đáng xét" (nơi prefix kết thúc), tính cỡ khối của nó, rồi tìm bội số của cỡ khối ngay dưới byte của địa chỉ.'], ['Broadcast = next network − 1. First host = network + 1, last host = broadcast − 1 (except /31 and /32).', 'Broadcast = mạng kế tiếp − 1. Host đầu = mạng + 1, host cuối = broadcast − 1 (trừ /31 và /32).']],
  loi: [['Taking 10.10.1.0 as the network of 10.10.1.10/16 — the third byte is a host byte with /16.', 'Lấy 10.10.1.0 làm mạng của 10.10.1.10/16 — với /16 byte thứ ba là byte host.'], ['Giving 192.168.50.77/26 the broadcast 192.168.50.255: that is the /24 broadcast.', 'Cho 192.168.50.77/26 broadcast 192.168.50.255: đó là broadcast của /24.']],
  tns: [tn('bitwise AND', 'phép AND theo bit', '1 AND 1 = 1, còn lại = 0.'), tn('broadcast address', 'địa chỉ broadcast', 'Mọi bit host = 1: "mọi máy trong mạng này".'), tn('block size', 'cỡ khối', '256 − byte mặt nạ: bước nhảy giữa các mạng.')],
  kn: ['subnetting'],
});

/* ── 4. Cùng mạng hay qua cổng — và lỗi gõ /16 ── */
// Đoạn output thật SAU khi gõ nhầm /16 (giữa hai dòng chú thích của kịch bản lab), nguyên văn.
const T21 = ra('c21-sai-mask').split('\n');
const SAI = T21.slice(T21.findIndex((d) => d.startsWith('# gõ nhầm')) + 1, T21.findIndex((d) => d.startsWith('# sửa lại'))).filter((d) => d.trim());
const GET = ['$ ip route get 10.10.1.11', ...sauLenh('c21-dia-chi', 'ip route get 10.10.1.11').slice(0, 1), '$ ip route get 10.10.1.200', ...sauLenh('c21-dia-chi', 'ip route get 10.10.1.200').slice(0, 1), '$ ip route get 10.10.2.10', ...sauLenh('c21-dia-chi', 'ip route get 10.10.2.10').slice(0, 1)];
if (!SAI.some((d) => d.includes('who-has 10.10.2.10')) || !SAI.some((d) => d.includes('FAILED'))) throw new Error('c21-sai-mask: thiếu dòng ARP/FAILED');
const E4 = cs({
  ten: 'CIDR 4 — "Is it on my network?" and the /16 typo', kho: 'MEDIUM', phut: 15,
  en: `Before sending, a machine applies <b>its own</b> mask to the destination: same network ⇒ ARP for the destination itself; otherwise ⇒ the default gateway. The lab client 10.10.1.10/24 (lab/out/c21-dia-chi):${pre(GET)}Then client2 was configured by hand with the mask typed as /16 instead of /24 (lab/out/c21-sai-mask):${pre(SAI)}`,
  vi: `Trước khi gửi, một máy áp mặt nạ <b>của chính nó</b> lên địa chỉ đích: cùng mạng ⇒ hỏi ARP cho chính đích; khác mạng ⇒ cổng mặc định. Client của lab 10.10.1.10/24 (lab/out/c21-dia-chi):${pre(GET)}Rồi client2 được cấu hình tay với mặt nạ gõ nhầm /16 thay vì /24 (lab/out/c21-sai-mask):${pre(SAI)}`,
  cau: [
    q('c1', ['No machine has 10.10.1.200, yet ip route get shows "dev eth0" with no "via". Why?', 'Không máy nào có 10.10.1.200, vậy mà ip route get ghi "dev eth0" không có "via". Vì sao?'], ['The decision uses only the mask: .200 is inside 10.10.1.0/24, so it is "on-link"', 'The kernel already knows a machine with that address is on the LAN', 'The router 10.10.1.254 answered for it, so no via is needed', 'Every address that starts with 10 is delivered on eth0'], ['Routing decides from the table, not from who exists. Delivery would start with an ARP question that nobody answers.', 'Định tuyến quyết theo bảng, không theo việc ai đang tồn tại. Việc giao sẽ bắt đầu bằng một câu hỏi ARP không ai trả lời.']),
    q('c2', ['With /16, ip route get 10.10.2.10 lost its "via 10.10.1.254". What does client2 do next?', 'Với /16, ip route get 10.10.2.10 mất "via 10.10.1.254". client2 làm gì tiếp theo?'], ['It asks ARP for 10.10.2.10 itself, on a LAN where that server is not', 'It sends the packet to the router anyway, because the gateway is set', 'It sends the packet to the broadcast address 10.10.255.255 instead', 'It asks the DNS server where 10.10.2.10 is located'], ['10.10.2.10 is inside 10.10.0.0/16, so the kernel treats it as a neighbour. The capture shows exactly that: who-has 10.10.2.10 tell 10.10.1.11, again and again.', '10.10.2.10 nằm trong 10.10.0.0/16, nên nhân coi nó là hàng xóm. Bản bắt gói cho thấy đúng thế: who-has 10.10.2.10 tell 10.10.1.11, lặp đi lặp lại.']),
    q('c3', ['ping prints "From 10.10.1.11 … Destination Host Unreachable". Who produced that error?', 'ping in "From 10.10.1.11 … Destination Host Unreachable". Ai tạo ra lỗi đó?'], ['client2\'s own kernel, after its ARP requests got no answer', 'The router 10.10.1.254, which could not reach the server', 'The server 10.10.2.10, which refused the ICMP echo', 'The switch, which had no MAC for the destination'], ['"From 10.10.1.11" is client2 itself: the neighbour entry ended FAILED, so the kernel reports the host unreachable. No router was ever involved.', '"From 10.10.1.11" chính là client2: mục hàng xóm kết thúc ở FAILED, nên nhân báo host không tới được. Không router nào dính vào.']),
    q('c4', ['The capture also contains one line "ARP, Reply 10.10.1.11 is-at 02:00:0a:0a:01:0b". What is it?', 'Bản bắt còn có một dòng "ARP, Reply 10.10.1.11 is-at 02:00:0a:0a:01:0b". Đó là gì?'], ['client2 answering another machine\'s ARP question — background traffic', 'The server finally answering client2\'s question about 10.10.2.10', 'The router announcing that it will forward for 10.10.2.10', 'A gratuitous ARP that fixes the wrong mask automatically'], ['It is a reply about 10.10.1.11 (client2\'s own address), sent by client2. Nothing ever answers "who-has 10.10.2.10" — that is why the entry is FAILED.', 'Đó là trả lời về 10.10.1.11 (địa chỉ của chính client2), do client2 gửi. Không gì trả lời "who-has 10.10.2.10" — vì thế mục đó FAILED.']),
    q('c5', ['With the /16 mask, client2 still reaches 8.8.8.8 on the Internet. Why?', 'Với mặt nạ /16, client2 vẫn tới được 8.8.8.8 trên Internet. Vì sao?'], ['8.8.8.8 is outside 10.10.0.0/16, so it still goes to the default gateway', 'The Internet ignores masks and always routes through the router', 'The DNS server rewrites the mask for addresses outside the LAN', 'The router corrects the mask of every packet that it receives'], ['A wrong mask only breaks the addresses it wrongly includes: 10.10.x.x outside the real /24. Everything else still uses "default via". That is why "the network works" and the bug survives.', 'Mặt nạ sai chỉ làm hỏng những địa chỉ nó bao nhầm: các 10.10.x.x ngoài /24 thật. Mọi thứ khác vẫn đi "default via". Vì thế "mạng vẫn chạy" và lỗi sống sót.']),
    q('c6', ['An intern\'s VM 10.10.1.50 (mask 255.255.0.0, gateway 10.10.1.254) reaches the Internet but not the API 10.10.2.20. The first thing to check?', 'Máy ảo 10.10.1.50 của bạn thực tập (mặt nạ 255.255.0.0, cổng 10.10.1.254) ra Internet được nhưng không tới API 10.10.2.20. Việc đầu tiên cần kiểm?'], ['The mask: ip -br addr and ip route get 10.10.2.20 (no "via" ⇒ /16 bug)', 'The cable: replace it and try again, then call the network team', 'The API: restart it, because the Internet works fine for the VM', 'DNS: the API\'s name probably resolves to a wrong address'], ['With /16 the VM thinks 10.10.2.20 is on its own cable and ARPs for it. Fix the mask to /24 and the route gets "via 10.10.1.254" back.', 'Với /16 máy ảo tưởng 10.10.2.20 ở cùng dây và hỏi ARP cho nó. Sửa mặt nạ về /24 thì tuyến có lại "via 10.10.1.254".']),
  ],
  goiY: [['Read ip route get: "via X" ⇒ through router X; only "dev" ⇒ the kernel thinks the address is on that cable.', 'Đọc ip route get: "via X" ⇒ qua router X; chỉ có "dev" ⇒ nhân nghĩ địa chỉ ở ngay trên dây đó.'], ['Look at who the error comes "From": your own address means your own kernel gave up.', 'Nhìn lỗi đến "From" ai: địa chỉ của chính bạn nghĩa là nhân của bạn đã bỏ cuộc.']],
  loi: [['Blaming the firewall or the server when ip route get has no "via".', 'Đổ cho tường lửa hay máy chủ khi ip route get không có "via".'], ['Concluding "the network is fine" because the Internet works.', 'Kết luận "mạng ổn" vì Internet vẫn chạy.']],
  tns: [tn('on-link', 'cùng đường truyền', 'Đích nằm trong mạng của chính card ⇒ giao thẳng.'), tn('default gateway', 'cổng mặc định'), tn('Destination Host Unreachable', 'không tới được máy đích', 'Ở đây do chính nhân báo khi ARP không có trả lời.')],
  kn: ['local delivery vs gateway', 'wrong mask'],
});

/* ── 5. VLSM bằng tay ── */
const CHIA = sauLenh('c21-chia', 'python3 chia.py 10.20.0.0/22 iot');
const CHIA_G = sauLenh('c21-chia', 'python3 chia.py --as-given');
const E5 = cs({
  ten: 'CIDR 5 — Plan the LabFlow office by hand (VLSM)', kho: 'MEDIUM', phut: 20, loai: 'table',
  en: 'LabFlow gets <code>10.20.0.0/22</code> (1 024 addresses) for IoT 300, web 100, db 20, mgmt 10. Method: sort largest first; each need takes the smallest block that holds hosts + 2; place it at the next free address that is a <b>multiple of its own size</b> (alignment). Fill the plan, then do the same needs in the order someone typed them (web, db, mgmt, iot) and count the hole. Afterwards, compare with the real <code>chia.py</code> output (shown after Submit in the explanation).',
  vi: 'LabFlow nhận <code>10.20.0.0/22</code> (1 024 địa chỉ) cho IoT 300, web 100, db 20, mgmt 10. Cách làm: xếp lớn trước; mỗi nhu cầu lấy khối nhỏ nhất chứa đủ số máy + 2; đặt nó ở địa chỉ trống kế tiếp là <b>bội số của chính cỡ nó</b> (căn lề). Điền kế hoạch, rồi làm cùng các nhu cầu theo thứ tự ai đó gõ (web, db, mgmt, iot) và đếm lỗ hổng. Sau đó so với output <code>chia.py</code> thật (hiện trong giải thích sau khi Nộp).',
  bang: [
    bang1('b1', ['Largest first', 'Lớn trước'], [{ ma: 'x', ten: 'Need' }, { ma: 's', ten: 'Block size (addresses)' }, { ma: 'p', ten: 'Prefix' }, { ma: 'n', ten: 'Subnet (network/prefix)' }, { ma: 'b', ten: 'Broadcast' }], [
      { o: { x: 'iot — 300 hosts' }, a: { s: ['512'], p: ['/23', '23'], n: ['10.20.0.0/23'], b: ['10.20.1.255'] } },
      { o: { x: 'web — 100 hosts' }, a: { s: ['128'], p: ['/25', '25'], n: ['10.20.2.0/25'], b: ['10.20.2.127'] } },
      { o: { x: 'db — 20 hosts' }, a: { s: ['32'], p: ['/27', '27'], n: ['10.20.2.128/27'], b: ['10.20.2.159'] } },
      { o: { x: 'mgmt — 10 hosts' }, a: { s: ['16'], p: ['/28', '28'], n: ['10.20.2.160/28'], b: ['10.20.2.175'] } },
    ], [`300 + 2 = 302 needs 512 = 2^9 ⇒ /23; 102 ⇒ 128 ⇒ /25; 22 ⇒ 32 ⇒ /27; 12 ⇒ 16 ⇒ /28. Placed back to back, every block is already aligned: the real tool printed${pre(CHIA)}`, `300 + 2 = 302 cần 512 = 2^9 ⇒ /23; 102 ⇒ 128 ⇒ /25; 22 ⇒ 32 ⇒ /27; 12 ⇒ 16 ⇒ /28. Đặt liền nhau, khối nào cũng đã đúng căn lề: công cụ thật in ra${pre(CHIA)}`]),
    bang1('b2', ['In the order given: web, db, mgmt, iot', 'Theo thứ tự gõ: web, db, mgmt, iot'], [{ ma: 'x', ten: 'Need' }, { ma: 'n', ten: 'Subnet (network/prefix)' }], [
      { o: { x: 'web — 100 hosts' }, a: { n: ['10.20.0.0/25'] } },
      { o: { x: 'db — 20 hosts' }, a: { n: ['10.20.0.128/27'] } },
      { o: { x: 'mgmt — 10 hosts' }, a: { n: ['10.20.0.160/28'] } },
      { o: { x: 'iot — 300 hosts' }, a: { n: ['10.20.2.0/23'] } },
      { o: { x: 'Addresses skipped before iot (the gap)' }, a: { n: ['336'] } },
    ], [`After mgmt the next free address is 10.20.0.176, but a /23 must start at a multiple of 512 addresses: 10.20.0.0 or 10.20.2.0. So iot jumps to 10.20.2.0 and 10.20.0.176 – 10.20.1.255 (512 − 176 = 336 addresses) stays empty. Same total used (688), but now the block is full. Real output:${pre(CHIA_G)}`, `Sau mgmt, địa chỉ trống kế tiếp là 10.20.0.176, nhưng một /23 phải bắt đầu ở bội số của 512 địa chỉ: 10.20.0.0 hoặc 10.20.2.0. Nên iot nhảy tới 10.20.2.0 và 10.20.0.176 – 10.20.1.255 (512 − 176 = 336 địa chỉ) bỏ trống. Tổng dùng vẫn vậy (688), nhưng giờ khối đã đầy. Output thật:${pre(CHIA_G)}`]),
  ],
  goiY: [['Smallest power of two ≥ hosts + 2: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024. Prefix = 32 − (number of host bits).', 'Lũy thừa nhỏ nhất của hai ≥ số máy + 2: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024. Prefix = 32 − (số bit host).'], ['Count addresses from the start of the block: 10.20.2.0 is address number 512 (two full /24s).', 'Đếm địa chỉ từ đầu khối: 10.20.2.0 là địa chỉ thứ 512 (hai /24 đầy).']],
  loi: [['Forgetting the 2 reserved addresses: 254 hosts fit a /24 (256), 255 hosts do not.', 'Quên 2 địa chỉ dành riêng: 254 máy vừa một /24 (256), 255 máy thì không.'], ['Placing the /23 at 10.20.0.176 (not aligned): a router would read 10.20.0.176/23 as the network 10.20.0.0/23.', 'Đặt /23 ở 10.20.0.176 (không căn lề): router sẽ đọc 10.20.0.176/23 thành mạng 10.20.0.0/23.']],
  tns: [tn('VLSM', 'mặt nạ độ dài thay đổi', 'Nhiều subnet khác cỡ trong một khối.'), tn('alignment', 'căn lề', 'Một khối cỡ N phải bắt đầu ở bội số của N.'), tn('gap', 'lỗ hổng', 'Địa chỉ bị bỏ trống để khối sau được căn lề.')],
  kn: ['VLSM'],
});

/* ── 6. Tự viết: cidr(s) ── */
function cidr(s) {
  var parts = String(s).split('/');
  if (parts.length !== 2 || !/^\d{1,2}$/.test(parts[1]) || Number(parts[1]) > 32) throw new RangeError('expected a.b.c.d/0-32: ' + s);
  var bytes = parts[0].split('.');
  if (bytes.length !== 4) throw new RangeError('an IPv4 address has 4 bytes: ' + s);
  var ip = 0;
  bytes.forEach(function (b) {
    if (!/^\d{1,3}$/.test(b) || Number(b) > 255) throw new RangeError('a byte is 0-255: ' + b);
    ip = ip * 256 + Number(b);                       // 32-bit number, kept positive (no << in JavaScript)
  });
  var p = Number(parts[1]);
  var size = Math.pow(2, 32 - p);                    // addresses in the network
  var net = Math.floor(ip / size) * size;            // = ip AND mask: clear the host bits
  var bcast = net + size - 1;                        // host bits all 1
  function dotted(n) { return [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256].join('.'); }
  var small = p >= 31;                               // /31: point-to-point (RFC 3021) · /32: one machine — no broadcast
  return {
    network: dotted(net),
    mask: dotted(4294967296 - size),                 // p ones then zeros
    broadcast: small ? null : dotted(bcast),
    first: dotted(small ? net : net + 1),
    last: dotted(small ? bcast : bcast - 1),
    usable: small ? size : size - 2,
    addresses: size,
  };
}
const E6 = jsBai({
  ten: 'CIDR 6 — Write cidr(s) like cidr.py', kho: 'HARD', phut: 30,
  en: `<p>The lab tool <code>cidr.py</code> does subnet math the way you did it by hand. Real run (lab/out/c21-dia-chi):</p>${pre(sauLenh('c21-dia-chi', 'python3 cidr.py 192.168.50.77/26'))}<p>Write <code>cidr(s)</code>: <code>s</code> is <code>"a.b.c.d/p"</code>. Return</p>
<pre>{ network, mask, broadcast, first, last, usable, addresses }</pre>
<ul>
<li><code>network</code>, <code>mask</code>, <code>broadcast</code>, <code>first</code>, <code>last</code> — dotted strings; <code>usable</code>, <code>addresses</code> — numbers.</li>
<li>For p ≤ 30: first = network + 1, last = broadcast − 1, usable = addresses − 2.</li>
<li>For /31 and /32: <code>broadcast: null</code>, first = network, last = the last address, usable = addresses (cidr.py prints "broadcast none").</li>
<li>Throw a <code>RangeError</code> when the input is not a valid address/prefix (a byte above 255, a prefix above 32, not four bytes).</li>
</ul>
<p>Visible cases are real runs from the lab. Hidden cases include /16, /31, a Lab 2 server address, /0 and /12, and broken input.</p>`,
  vi: `<p>Công cụ lab <code>cidr.py</code> tính subnet đúng như cách bạn làm tay. Lượt chạy thật (lab/out/c21-dia-chi):</p>${pre(sauLenh('c21-dia-chi', 'python3 cidr.py 192.168.50.77/26'))}<p>Viết <code>cidr(s)</code>: <code>s</code> là <code>"a.b.c.d/p"</code>. Trả về</p>
<pre>{ network, mask, broadcast, first, last, usable, addresses }</pre>
<ul>
<li><code>network</code>, <code>mask</code>, <code>broadcast</code>, <code>first</code>, <code>last</code> — chuỗi dạng chấm; <code>usable</code>, <code>addresses</code> — số.</li>
<li>Với p ≤ 30: first = network + 1, last = broadcast − 1, usable = addresses − 2.</li>
<li>Với /31 và /32: <code>broadcast: null</code>, first = network, last = địa chỉ cuối, usable = addresses (cidr.py in "broadcast none").</li>
<li>Ném <code>RangeError</code> khi đầu vào không phải địa chỉ/prefix hợp lệ (byte lớn hơn 255, prefix lớn hơn 32, không đủ bốn byte).</li>
</ul>
<p>Ca hiện là các lượt chạy thật trong lab. Ca ẩn có /16, /31, một địa chỉ máy chủ của Lab 2, /0 và /12, và đầu vào hỏng.</p>`,
  yc: [['Return the object; do not print it.', 'Trả về object, đừng in ra.'], ['Throw RangeError for invalid input.', 'Ném RangeError khi đầu vào sai.']],
  dauVao: ['s — a string "a.b.c.d/p".', 's — chuỗi "a.b.c.d/p".'],
  dauRa: ['{ network, mask, broadcast, first, last, usable, addresses }', '{ network, mask, broadcast, first, last, usable, addresses }'],
  goiY: [
    ['Turn the address into one number: n = n·256 + byte, four times. Size = 2^(32 − p).', 'Đổi địa chỉ thành một số: n = n·256 + byte, bốn lần. Cỡ = 2^(32 − p).'],
    ['network = Math.floor(n / size) · size is exactly "AND with the mask"; broadcast = network + size − 1; mask = 2^32 − size.', 'network = Math.floor(n / size) · size chính là "AND với mặt nạ"; broadcast = network + size − 1; mask = 2^32 − size.'],
    ['Back to dotted: Math.floor(n / 16777216) % 256, then / 65536, / 256, and n % 256.', 'Đổi lại dạng chấm: Math.floor(n / 16777216) % 256, rồi / 65536, / 256, và n % 256.'],
  ],
  loi: [
    ['Building the mask with 0xffffffff << (32 − p): JavaScript shifts are 32-bit and signed, so /0 and every address above 128.0.0.0 come out wrong (negative numbers).', 'Dựng mặt nạ bằng 0xffffffff << (32 − p): phép dịch của JavaScript là 32 bit có dấu, nên /0 và mọi địa chỉ trên 128.0.0.0 ra sai (số âm).'],
    ['Applying "− 2" to /31 and /32: you get 0 and −1 usable hosts.', 'Áp "− 2" cho /31 và /32: ra 0 và −1 host dùng được.'],
    ['Only handling prefixes that end on a byte (/8, /16, /24) by cutting the string.', 'Chỉ xử lý prefix kết thúc đúng byte (/8, /16, /24) bằng cách cắt chuỗi.'],
  ],
  gt: ['An IPv4 address is one 32-bit number, so all the work is arithmetic on that number: the network is the address rounded down to a multiple of the network size (the same as AND with the mask), the broadcast is the last address before the next network, and the hosts lie between them. Doing it with division instead of bit shifts keeps every value positive for the whole range 0.0.0.0/0 to /32 — JavaScript\'s bit operators work on signed 32-bit integers. The /31 and /32 special cases follow RFC 3021 and match what cidr.py and Python\'s ipaddress print.', 'Địa chỉ IPv4 là một số 32 bit, nên mọi việc là số học trên số đó: mạng là địa chỉ làm tròn xuống bội số của cỡ mạng (giống AND với mặt nạ), broadcast là địa chỉ cuối trước mạng kế tiếp, các host nằm giữa. Dùng phép chia thay phép dịch bit giữ mọi giá trị dương trên cả dải từ 0.0.0.0/0 tới /32 — toán tử bit của JavaScript làm việc trên số nguyên 32 bit có dấu. Trường hợp đặc biệt /31 và /32 theo RFC 3021 và khớp với cidr.py và ipaddress của Python.'],
  kn: ['CIDR arithmetic'],
  tns: [tn('dotted decimal', 'thập phân có chấm'), tn('RangeError', 'lỗi giá trị ngoài miền', 'Lỗi JavaScript dùng khi đối số nằm ngoài miền cho phép.'), tn('RFC 3021', 'chuẩn dùng /31 cho đường điểm-điểm')],
  dau: `/** "a.b.c.d/p" ⇒ { network, mask, broadcast, first, last, usable, addresses } like cidr.py */
function cidr(s) {
  // Write your solution here
  return { network: null, mask: null, broadcast: null, first: null, last: null, usable: 0, addresses: 0 };
}
`,
  giai: '// Reference solution\n' + nguon(cidr),
  cases: [
    { goi: goi('cidr', '10.10.1.10/24'), moTa: ['The lab client 10.10.1.10/24 (c21-dia-chi)', 'Client của lab 10.10.1.10/24 (c21-dia-chi)'] },
    { goi: goi('cidr', '192.168.50.77/26'), moTa: ['192.168.50.77/26 (c21-dia-chi)', '192.168.50.77/26 (c21-dia-chi)'] },
    { goi: goi('cidr', '203.0.113.10/32'), moTa: ['203.0.113.10/32 — one machine (c21-dia-chi)', '203.0.113.10/32 — một máy (c21-dia-chi)'] },
    { goi: goi('cidr', '10.10.1.10/16'), an: true },
    { goi: goi('cidr', '192.0.2.0/31'), an: true },
    { goi: goi('cidr', '10.30.0.200/26'), an: true },
    { goi: goi('cidr', '10.10.1.50/16'), an: true },
    { goi: goi('cidr', '0.0.0.0/0'), an: true },
    { goi: goi('cidr', '172.31.255.255/12'), an: true },
    { goi: goi('cidr', '203.0.113.77/28'), an: true },
    { goi: goi('cidr', '10.10.1.300/24'), nem: 'RangeError', an: true },
    { goi: goi('cidr', '10.10.1.10/33'), nem: 'RangeError', an: true },
    { goi: goi('cidr', '10.10.1/24'), nem: 'RangeError', an: true },
  ],
});

/* ── 7. Tự viết: vlsm(block, needs) như chia.py ── */
function vlsm(block, needs, asGiven) {
  function toNum(a) { return a.split('.').reduce(function (n, b) { return n * 256 + Number(b); }, 0); }
  function dotted(n) { return [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256].join('.'); }
  var bp = block.split('/');
  var total = Math.pow(2, 32 - Number(bp[1]));
  var start0 = toNum(bp[0]);
  var list = needs.slice();                                   // never sort the caller's array
  if (!asGiven) list.sort(function (a, b) { return b.hosts - a.hosts; });   // largest first; ties keep their order (stable sort)
  var next = start0, end = start0 + total, subnets = [], gaps = [];
  for (var i = 0; i < list.length; i++) {
    var need = list[i];
    var bits = 0;
    while (Math.pow(2, bits) < need.hosts + 2) bits++;        // + 2: network and broadcast are never given to a machine
    var size = Math.pow(2, bits), p = 32 - bits;
    var start = Math.ceil(next / size) * size;                // a block starts at a multiple of its own size
    if (start + size > end) return { ok: false, name: need.name, prefix: p, size: size };
    if (start > next) gaps.push({ from: dotted(next), to: dotted(start - 1), size: start - next });
    subnets.push({ name: need.name, hosts: need.hosts, subnet: dotted(start) + '/' + p, first: dotted(start + 1), last: dotted(start + size - 2), broadcast: dotted(start + size - 1), usable: size - 2 });
    next = start + size;
  }
  var used = subnets.reduce(function (s, x) { return s + x.usable + 2; }, 0);
  return { ok: true, subnets: subnets, gaps: gaps, used: used, total: total, nextFree: next < end ? dotted(next) : null };
}
const N = (o) => Object.entries(o).map(([name, hosts]) => ({ name, hosts }));
const E7 = jsBai({
  ten: 'CIDR 7 — Write vlsm(block, needs) like chia.py', kho: 'HARD', phut: 40,
  en: `<p><code>chia.py</code> splits a block into subnets of different sizes and checks itself. Real runs (lab/out/c21-chia):</p>${pre(['$ python3 chia.py 10.20.0.0/22 iot=300 web=100 db=20 mgmt=10', ...CHIA, '$ python3 chia.py --as-given 10.20.0.0/22 web=100 db=20 mgmt=10 iot=300', ...CHIA_G, '$ python3 chia.py 10.20.0.0/24 iot=300', ...sauLenh('c21-chia', 'python3 chia.py 10.20.0.0/24')])}<p>Write <code>vlsm(block, needs, asGiven)</code>. <code>block</code> is a network like <code>"10.20.0.0/22"</code>; <code>needs</code> is <code>[{ name, hosts }]</code> (hosts ≥ 1); <code>asGiven</code> (optional) = keep the order given instead of sorting.</p>
<ol>
<li>Unless <code>asGiven</code>: sort largest <code>hosts</code> first; needs with the same size keep their order. Do not change the caller's array.</li>
<li>Each need gets the smallest block of 2<sup>k</sup> addresses with 2<sup>k</sup> ≥ hosts + 2 (prefix 32 − k).</li>
<li>It starts at the next free address rounded <b>up</b> to a multiple of its size. Skipped addresses become a gap <code>{ from, to, size }</code>.</li>
<li>If it would end past the block ⇒ stop and return <code>{ ok: false, name, prefix, size }</code> for that need.</li>
<li>Otherwise return <code>{ ok: true, subnets, gaps, used, total, nextFree }</code>: each subnet <code>{ name, hosts, subnet: "a.b.c.d/p", first, last, broadcast, usable }</code>; <code>used</code> = addresses in all subnets; <code>total</code> = block size; <code>nextFree</code> = the next free address, or <code>null</code> when the block is full.</li>
</ol>
<p>The three visible cases are the three real runs above. Hidden cases: the practice plan of lesson 2.1 (10.40.0.0/23), the Lab 2 office plan (10.30.0.0/23), ties, a 1-host need, a block filled exactly, and an "as given" plan that stops halfway.</p>`,
  vi: `<p><code>chia.py</code> chia một khối thành các subnet khác cỡ và tự kiểm. Các lượt chạy thật (lab/out/c21-chia):</p>${pre(['$ python3 chia.py 10.20.0.0/22 iot=300 web=100 db=20 mgmt=10', ...CHIA, '$ python3 chia.py --as-given 10.20.0.0/22 web=100 db=20 mgmt=10 iot=300', ...CHIA_G, '$ python3 chia.py 10.20.0.0/24 iot=300', ...sauLenh('c21-chia', 'python3 chia.py 10.20.0.0/24')])}<p>Viết <code>vlsm(block, needs, asGiven)</code>. <code>block</code> là một mạng như <code>"10.20.0.0/22"</code>; <code>needs</code> là <code>[{ name, hosts }]</code> (hosts ≥ 1); <code>asGiven</code> (tuỳ chọn) = giữ thứ tự đã cho thay vì sắp xếp.</p>
<ol>
<li>Nếu không có <code>asGiven</code>: sắp <code>hosts</code> lớn trước; nhu cầu cùng cỡ giữ nguyên thứ tự. Không sửa mảng của người gọi.</li>
<li>Mỗi nhu cầu lấy khối nhỏ nhất 2<sup>k</sup> địa chỉ với 2<sup>k</sup> ≥ hosts + 2 (prefix 32 − k).</li>
<li>Khối bắt đầu ở địa chỉ trống kế tiếp làm tròn <b>lên</b> bội số của cỡ nó. Địa chỉ bị bỏ qua thành một lỗ hổng <code>{ from, to, size }</code>.</li>
<li>Nếu khối vượt quá cuối khối lớn ⇒ dừng và trả <code>{ ok: false, name, prefix, size }</code> cho nhu cầu đó.</li>
<li>Ngược lại trả <code>{ ok: true, subnets, gaps, used, total, nextFree }</code>: mỗi subnet <code>{ name, hosts, subnet: "a.b.c.d/p", first, last, broadcast, usable }</code>; <code>used</code> = số địa chỉ của mọi subnet; <code>total</code> = cỡ khối; <code>nextFree</code> = địa chỉ trống kế tiếp, hoặc <code>null</code> khi khối đã đầy.</li>
</ol>
<p>Ba ca hiện là ba lượt chạy thật ở trên. Ca ẩn: kế hoạch thực hành của bài 2.1 (10.40.0.0/23), kế hoạch văn phòng của Lab 2 (10.30.0.0/23), nhu cầu cùng cỡ, nhu cầu 1 máy, khối được lấp vừa khít, và một kế hoạch "theo thứ tự gõ" dừng giữa chừng.</p>`,
  dauVao: ['block — "a.b.c.d/p" (a network address); needs — [{ name, hosts }]; asGiven — optional boolean.', 'block — "a.b.c.d/p" (địa chỉ mạng); needs — [{ name, hosts }]; asGiven — boolean tuỳ chọn.'],
  dauRa: ['{ ok: true, subnets, gaps, used, total, nextFree } or { ok: false, name, prefix, size }', '{ ok: true, subnets, gaps, used, total, nextFree } hoặc { ok: false, name, prefix, size }'],
  goiY: [
    ['Work with numbers, as in cidr(): next = the first address of the block, end = next + total.', 'Làm việc với số, như trong cidr(): next = địa chỉ đầu của khối, end = next + total.'],
    ['Rounding up to a multiple: start = Math.ceil(next / size) · size. A gap exists when start > next.', 'Làm tròn lên bội số: start = Math.ceil(next / size) · size. Có lỗ hổng khi start > next.'],
    ['Sort a copy: needs.slice().sort((a, b) => b.hosts − a.hosts). Array sort is stable in modern JavaScript, so ties keep their order.', 'Sắp một bản sao: needs.slice().sort((a, b) => b.hosts − a.hosts). Sắp xếp mảng trong JavaScript hiện đại là ổn định, nên nhu cầu bằng nhau giữ thứ tự.'],
  ],
  loi: [
    ['Forgetting the + 2: a need of 126 hosts fits a /25 (128), one of 127 does not.', 'Quên + 2: nhu cầu 126 máy vừa một /25 (128), 127 máy thì không.'],
    ['Placing each block right after the previous one without aligning it — the "as given" case then has no gap and a wrong /23.', 'Đặt mỗi khối ngay sau khối trước mà không căn lề — ca "theo thứ tự gõ" khi đó không có lỗ hổng và ra một /23 sai.'],
    ['Sorting the caller\'s needs array in place.', 'Sắp xếp ngay trên mảng needs của người gọi.'],
  ],
  gt: ['Sorting largest first works because block sizes are powers of two: when every block placed so far is at least as big as the next one, the next free address is automatically a multiple of the next size, so no address is wasted. Placing in another order forces the big block to jump to its alignment boundary — the 336-address gap of the real run. The "does not fit" check must happen per need, after alignment, which is exactly when chia.py stops with "no aligned /23 left".', 'Xếp lớn trước chạy được vì cỡ khối là lũy thừa của hai: khi mọi khối đã đặt đều lớn ít nhất bằng khối kế tiếp, địa chỉ trống kế tiếp tự động là bội số của cỡ kế tiếp, nên không phí địa chỉ nào. Đặt theo thứ tự khác buộc khối lớn nhảy tới ranh giới căn lề của nó — lỗ hổng 336 địa chỉ trong lượt chạy thật. Phép kiểm "không vừa" phải làm cho từng nhu cầu, sau khi căn lề, đúng lúc chia.py dừng với "no aligned /23 left".'],
  kn: ['VLSM', 'alignment'],
  tns: [tn('stable sort', 'sắp xếp ổn định', 'Phần tử bằng nhau giữ thứ tự ban đầu.'), tn('alignment', 'căn lề'), tn('next free address', 'địa chỉ trống kế tiếp')],
  dau: `/**
 * block: "10.20.0.0/22"   needs: [{ name: 'iot', hosts: 300 }, …]   asGiven: optional
 * ⇒ { ok: true, subnets, gaps, used, total, nextFree }  or  { ok: false, name, prefix, size }
 */
function vlsm(block, needs, asGiven) {
  // Write your solution here
  return { ok: true, subnets: [], gaps: [], used: 0, total: 0, nextFree: null };
}
`,
  giai: '// Reference solution\n' + nguon(vlsm),
  cases: [
    { goi: goi('vlsm', '10.20.0.0/22', N({ iot: 300, web: 100, db: 20, mgmt: 10 })), moTa: ['chia.py 10.20.0.0/22 iot=300 web=100 db=20 mgmt=10 (real)', 'chia.py 10.20.0.0/22 iot=300 web=100 db=20 mgmt=10 (thật)'] },
    { goi: goi('vlsm', '10.20.0.0/22', N({ web: 100, db: 20, mgmt: 10, iot: 300 }), true), moTa: ['chia.py --as-given … (real): the 336-address gap', 'chia.py --as-given … (thật): lỗ hổng 336 địa chỉ'] },
    { goi: goi('vlsm', '10.20.0.0/24', N({ iot: 300 })), moTa: ['chia.py 10.20.0.0/24 iot=300 (real): does not fit', 'chia.py 10.20.0.0/24 iot=300 (thật): không vừa'] },
    { goi: goi('vlsm', '10.40.0.0/23', N({ wifi: 200, cameras: 40, servers: 25, printers: 5 })), an: true },
    { goi: goi('vlsm', '10.30.0.0/23', N({ wifi: 120, servers: 50, cameras: 25, printers: 6, vpn: 60 })), an: true },
    { goi: goi('vlsm', '192.168.0.0/24', N({ a: 30, b: 60, c: 30, d: 60 })), an: true },
    { goi: goi('vlsm', '10.0.0.0/29', N({ link1: 1, link2: 2 })), an: true },
    { goi: goi('vlsm', '10.0.0.0/24', N({ x: 126, y: 126 })), an: true },
    { goi: goi('vlsm', '10.0.0.0/24', N({ small: 10, big: 200 }), true), an: true },
    { goi: `(function () { var n = [{ name: 'a', hosts: 5 }, { name: 'b', hosts: 50 }]; vlsm('10.1.0.0/24', n); return n.map(function (x) { return x.name; }); })()`, an: true, moTa: ['Hidden: the caller\'s array is not reordered', 'Ẩn: mảng của người gọi không bị đổi thứ tự'] },
  ],
});

export default doiDau({ slug: 'netdev-2-1-ipv4-cidr', ten: '2.1 IPv4, CIDR and subnetting by hand', khoa: KHOA, baiHoc: 'netdev-2-1-ipv4-cidr', de: [E1, E2, E3, E4, E5, E6, E7] });
