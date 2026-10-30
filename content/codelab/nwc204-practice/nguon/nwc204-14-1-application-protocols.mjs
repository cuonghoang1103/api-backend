/** NWC204 · 14.1 — DNS, HTTP and DHCP. */
import { doiDau, KHOA, tinh, q, ord, bang1, tn, cs, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'Apps 1 — DNS, HTTP, DHCP concepts', kho: 'EASY', phut: 8,
  en: 'Core application-layer protocols.', vi: 'Các giao thức tầng ứng dụng cốt lõi.',
  cau: [
    q('c1', ['A DNS “A” record maps a name to …', 'Bản ghi DNS “A” ánh xạ tên sang …'], ['an IPv4 address', 'an IPv6 address', 'a mail server', 'another name'], ['AAAA = IPv6, MX = mail, CNAME = alias, NS = name server, PTR = reverse.', 'AAAA = IPv6, MX = mail, CNAME = bí danh, NS = máy chủ tên, PTR = ngược.']),
    q('c2', ['DNS normally uses …', 'DNS thường dùng …'], ['UDP port 53 (TCP for big answers)', 'TCP port 80 (UDP for small answers)', 'UDP port 67 (TCP for big answers)', 'TCP port 25 (UDP for zone transfers)'], ['Short queries fit in one UDP datagram.', 'Truy vấn ngắn vừa trong một datagram UDP.']),
    q('c3', ['HTTP status code 404 means …', 'Mã trạng thái HTTP 404 nghĩa là …'], ['the resource was not found', 'the server crashed', 'the client must log in', 'the request was redirected'], ['5xx = server errors, 4xx = client errors, 3xx = redirects, 2xx = success.', '5xx = lỗi server, 4xx = lỗi client, 3xx = chuyển hướng, 2xx = thành công.']),
    q('c4', ['The four DHCP messages are …', 'Bốn thông điệp DHCP là …'], ['Discover, Offer, Request, Acknowledge', 'Hello, Offer, Accept, Acknowledge', 'Request, Offer, Discover, Acknowledge', 'SYN, SYN-ACK, ACK, FIN'], ['“DORA”. Discover and Request are broadcasts.', '“DORA”. Discover và Request là broadcast.']),
    q('c5', ['A DHCP lease gives a client …', 'Một lease DHCP cấp cho client …'], ['IP address, mask, gateway and DNS server for a limited time', 'only an IP address, kept forever once it has been given', 'a MAC address, a mask and a gateway for a limited time', 'a domain name, registered for as long as the client is on'], ['The client renews at 50% of the lease time.', 'Client gia hạn ở 50% thời gian lease.']),
  ],
  goiY: ['DNS = names, DHCP = addresses, HTTP = web.', 'DHCP uses UDP 67 (server) and 68 (client).'],
  loi: ['Confusing 4xx and 5xx.', 'Thinking DNS runs over TCP only.'],
  tn: [tn('lease', 'thời hạn cấp phát')], kn: ['DNS', 'DHCP', 'HTTP'],
});

const E2 = tinh({
  tieuDe: 'Apps 2 — Order DNS and DHCP exchanges', doKho: 'MEDIUM', phut: 10,
  moTa: mt('Put each exchange in order.', 'Sắp thứ tự từng cuộc trao đổi.'),
  loai: 'order',
  cauHoi: [
    ord('q1', ['Recursive DNS lookup of www.example.com (empty caches)', 'Tra DNS đệ quy www.example.com (cache rỗng)'], ['The client asks its recursive resolver', 'The resolver asks a root server and gets the .com name servers', 'The resolver asks a .com TLD server and gets example.com’s name servers', 'The resolver asks the example.com authoritative server and gets the A record', 'The resolver caches the answer and returns it to the client'], ['Root → TLD → authoritative; the resolver does the legwork and caches.', 'Root → TLD → authoritative; resolver làm việc nặng và lưu cache.'], 2),
    ord('q2', ['DHCP', 'DHCP'], ['Client broadcasts DHCPDISCOVER', 'Server unicasts/broadcasts DHCPOFFER', 'Client broadcasts DHCPREQUEST for the offered address', 'Server sends DHCPACK confirming the lease'], ['D-O-R-A.', 'D-O-R-A.'], 1),
  ],
  goiY: ['DNS goes from general (root) to specific.', 'DHCP spells DORA.'],
  loiHayGap: ['Asking the authoritative server before the TLD.', 'Skipping the Request step after the Offer.'],
  thuatNgu: [tn('resolver', 'bộ phân giải'), tn('authoritative', 'có thẩm quyền')], khaiNiem: ['DNS resolution', 'DORA'],
});

const E3 = tinh({
  tieuDe: 'Apps 3 — Protocol, port and transport', doKho: 'MEDIUM', phut: 8,
  moTa: mt('Fill the default port number and transport protocol of each service.', 'Điền số cổng mặc định và giao thức vận chuyển của từng dịch vụ.'),
  loai: 'table',
  bang: [bang1('b1', ['Services', 'Dịch vụ'], [{ ma: 's', ten: 'Service' }, { ma: 'p', ten: 'Port', luaChon: ['22', '25', '53', '67', '80', '110', '123', '143', '443', '3389'] }, { ma: 't', ten: 'Transport', luaChon: ['TCP', 'UDP', 'TCP and UDP'] }],
    [['HTTP', '80', 'TCP'], ['HTTPS', '443', 'TCP'], ['SSH', '22', 'TCP'], ['DNS', '53', 'TCP and UDP'], ['DHCP server', '67', 'UDP'], ['NTP', '123', 'UDP'], ['SMTP', '25', 'TCP'], ['RDP', '3389', 'TCP']].map(([s, p, t]) => ({ o: { s }, a: { p: [p], t: [t] } })),
    ['DNS uses UDP for queries and TCP for large replies; DHCP and NTP are UDP; the rest are TCP.', 'DNS dùng UDP cho truy vấn và TCP cho phản hồi lớn; DHCP và NTP là UDP; còn lại là TCP.'])],
  goiY: ['Think “is a handshake worth it?” — small request/response protocols use UDP.', 'DNS does both.'],
  loiHayGap: ['Saying DNS is TCP only.', 'Mixing port 25 (SMTP) with 110 (POP3).'],
  thuatNgu: [tn('well-known port', 'cổng quen thuộc')], khaiNiem: ['ports'],
});

export default doiDau({ slug: 'nwc204-14-1-application-protocols', ten: '14.1 DNS, HTTP and DHCP', khoa: KHOA, baiHoc: 'nwc204-14-2-web-email-dns-dhcp-chia-se-tep', de: [E1, E2, E3] });
