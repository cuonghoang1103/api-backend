/** Networking for Developers · Mục 0 · "Bắt đầu tại đây (2/2)" — sự cố thật, đọc thông báo lỗi, phân loại lỗi curl/nc. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, ra, pre, esc, c } from './_net.mjs';

const LOI = ra('c00-loi').split('\n').filter((d) => d && !d.startsWith('#'));
const lenh = (bat) => LOI[LOI.findIndex((d) => d.startsWith(`$ ${bat}`)) + 1];
const L6 = lenh('curl -sS http://labflow.invalid/');
const L7 = lenh('curl -sS http://10.10.2.20:4999/');
const L28 = lenh('curl -sS --max-time 3');
const LNC = lenh('nc -v -w 1');
const L502 = lenh('curl -sS -o /dev/null -w \'HTTP %{http_code}\\n\'');
const L504 = lenh('curl -sS -o /dev/null -w \'HTTP %{http_code} after');
if (![L6, L7, L28, LNC, L502, L504].every(Boolean)) throw new Error('c00-loi: thiếu dòng');

/* ── 1. Thông báo lỗi ⇒ tầng + công cụ đầu tiên ── */
const TANG = ['DNS — the name did not become an address', 'Nothing listens on that port (an answer: refused)', 'No answer at all (firewall, route, machine off)', 'TLS — certificate dates or chain', 'HTTP from a proxy — the app behind it'];
const CU = ['dig <name>', 'ss -tlnp on the server', 'ping / mtr / firewall rules', 'openssl s_client', 'proxy and application logs'];
const E1 = cs({
  ten: 'Errors 1 — Read the message, name the layer', kho: 'EASY', phut: 8, loai: 'table',
  en: `Every line below was produced for real on the lab client (lab/out/c00-loi), except the certificate line, which is curl's standard wording for an expired certificate. For each message choose what it means and the first command you would run.`,
  vi: `Mọi dòng dưới đây được tạo thật trên máy client của phòng lab (lab/out/c00-loi), trừ dòng chứng chỉ là câu chữ chuẩn của curl khi chứng chỉ hết hạn. Với mỗi thông báo, chọn ý nghĩa và lệnh đầu tiên bạn sẽ chạy.`,
  bang: [bang1('b1', ['Message → meaning → first tool', 'Thông báo → ý nghĩa → công cụ đầu tiên'], [{ ma: 'x', ten: 'Message' }, { ma: 'l', ten: 'What it means', luaChon: TANG }, { ma: 't', ten: 'First thing to run', luaChon: CU }], [
    { o: { x: L6 }, a: { l: TANG[0], t: CU[0] } },
    { o: { x: L7 }, a: { l: TANG[1], t: CU[1] } },
    { o: { x: L28 }, a: { l: TANG[2], t: CU[2] } },
    { o: { x: LNC }, a: { l: TANG[1], t: CU[1] } },
    { o: { x: 'curl: (60) SSL certificate problem: certificate has expired' }, a: { l: TANG[3], t: CU[3] } },
    { o: { x: `${L502} (from nginx, for /hong/)` }, a: { l: TANG[4], t: CU[4] } },
    { o: { x: `${L504} (from nginx, for /cham/api/slow)` }, a: { l: TANG[4], t: CU[4] } },
  ], ['Exit 6 = DNS; exit 7 and nc\'s "Connection refused" = the machine answered but nothing listens on 4999 (curl 8 now says "Could not connect to server", nc still prints the classic words); exit 28 = silence until the 3-second limit; a certificate problem = TLS; 502/504 come from nginx, which is alive — the app behind it is dead/wrong (502) or slower than nginx waits (504, after exactly 1 s).', 'Mã 6 = DNS; mã 7 và "Connection refused" của nc = máy có trả lời nhưng không chương trình nào nghe cổng 4999 (curl 8 nay ghi "Could not connect to server", nc vẫn in câu cổ điển); mã 28 = im lặng tới hết giới hạn 3 giây; lỗi chứng chỉ = TLS; 502/504 do nginx trả — nginx còn sống, ứng dụng phía sau chết/sai (502) hoặc chậm hơn thời gian nginx chờ (504, sau đúng 1 s).'])],
  goiY: [['The curl exit code in brackets already names the layer: 6, 7, 28.', 'Mã thoát của curl trong ngoặc đã gọi tên tầng: 6, 7, 28.'], ['A status code (502, 504) means somebody answered in HTTP — the network path to that somebody worked.', 'Có mã trạng thái (502, 504) nghĩa là có ai đó trả lời bằng HTTP — đường mạng tới người đó đã thông.']],
  loi: [['Treating "refused" and "timed out" as the same problem.', 'Coi "refused" và "timed out" là cùng một vấn đề.'], ['Restarting nginx on a 502 when the dead process is the app behind it.', 'Khởi động lại nginx khi gặp 502 trong khi tiến trình chết là ứng dụng phía sau.']],
  tns: [tn('exit code', 'mã thoát', 'Số chương trình trả về khi kết thúc; curl dùng nó để báo loại lỗi.'), tn('connection refused', 'bị từ chối kết nối'), tn('timed out', 'hết giờ chờ'), tn('502 Bad Gateway', 'cổng nối hỏng', 'Proxy còn sống nhưng server phía sau trả lời sai hoặc không trả lời.')],
  kn: ['reading errors'],
});

/* ── 2. Refused vs timeout, 502 vs 504 ── */
const E2 = cs({
  ten: 'Errors 2 — An answer or silence?', kho: 'MEDIUM', phut: 10,
  en: `Use the real output of the lab client to answer.${pre([`$ curl -sS http://10.10.2.20:4999/`, L7, `$ curl -sS --max-time 3 http://10.10.9.9/`, L28, `$ curl -sS -o /dev/null -w 'HTTP %{http_code} after %{time_total}s\\n' http://10.10.2.10/cham/api/slow`, L504])}`,
  vi: `Dùng output thật của máy client trong phòng lab để trả lời.${pre([`$ curl -sS http://10.10.2.20:4999/`, L7, `$ curl -sS --max-time 3 http://10.10.9.9/`, L28, `$ curl -sS -o /dev/null -w 'HTTP %{http_code} after %{time_total}s\\n' http://10.10.2.10/cham/api/slow`, L504])}`,
  cau: [
    q('c1', ['The refusal came back "after 0 ms" while the timeout took 3002 ms. Why?', 'Lời từ chối về "sau 0 ms" còn timeout mất 3002 ms. Vì sao?'], ['A refusal is an answer; a timeout is silence until the limit', 'The refused machine is closer than the silent machine', 'curl retries a refused connection many times very fast', 'The timeout machine was busy sending a very large reply'], ['10.10.2.20 is up and its kernel immediately answers "nobody listens on 4999". 10.10.9.9 never answers, so curl waits the whole --max-time of 3 s. That difference is the most useful clue in network debugging.', '10.10.2.20 đang chạy và kernel của nó trả lời ngay "không ai nghe cổng 4999". 10.10.9.9 không bao giờ trả lời nên curl chờ đủ --max-time 3 s. Khác biệt đó là manh mối hữu ích nhất khi gỡ lỗi mạng.']),
    q('c2', ['Is the machine 10.10.2.20 switched on?', 'Máy 10.10.2.20 có đang bật không?'], ['Yes — something on it answered the connection attempt', 'No — "Could not connect" means the machine is off', 'Unknown — curl never contacted that machine at all', 'No — DNS could not find the machine by its name'], ['To refuse, a kernel must be running and must send a reply (a TCP RST). A switched-off machine produces silence, i.e. a timeout. Curl 8 words it "Could not connect to server"; nc still prints "Connection refused".', 'Muốn từ chối thì kernel phải đang chạy và gửi trả lời (TCP RST). Máy tắt chỉ cho im lặng, tức timeout. curl 8 ghi "Could not connect to server"; nc vẫn in "Connection refused".']),
    q('c3', ['nginx answered 504 after 1.001 s for /cham/. What does that tell you?', 'nginx trả 504 sau 1,001 s cho /cham/. Điều đó cho biết gì?'], ['The app behind nginx was slower than nginx agreed to wait', 'The app behind nginx crashed before it received anything', 'The DNS lookup of 10.10.2.10 failed after one second', 'The client network dropped the reply for one second'], ['The lab endpoint takes 3 seconds while nginx waits only 1 — so nginx gives up and answers 504 Gateway Timeout itself. A crashed or wrong app gives 502 instead (/hong/ points at a port with no listener).', 'Endpoint trong lab mất 3 giây trong khi nginx chỉ chờ 1 giây — nên nginx bỏ cuộc và tự trả 504 Gateway Timeout. Ứng dụng chết hoặc sai cho 502 (/hong/ trỏ vào cổng không ai nghe).']),
    q('c4', ['ssh to your cloud server times out from the school network but works at home. The most likely cause is …', 'ssh tới server cloud bị timeout ở mạng trường nhưng ở nhà chạy được. Nguyên nhân khả dĩ nhất là …'], ['the school firewall silently drops outgoing port 22', 'the server refuses connections from school addresses', 'the school DNS gives the wrong address for the server', 'the server certificate is not trusted on school Wi-Fi'], ['Silence (timeout), not a refusal: a firewall in the middle drops the packets without answering. A refusal would come from the server itself and would also happen at home. This is the real story from the lesson (September 2026).', 'Im lặng (timeout), không phải từ chối: tường lửa ở giữa vứt gói mà không trả lời. Từ chối sẽ đến từ chính server và ở nhà cũng bị. Đây là chuyện thật trong bài (tháng 9/2026).']),
    q('c5', ['Demo day: the back end runs app.listen(3000, \'127.0.0.1\'); the projector laptop calls it and gets "connection refused". Why?', 'Ngày demo: back end chạy app.listen(3000, \'127.0.0.1\'); laptop máy chiếu gọi tới và bị "connection refused". Vì sao?'], ['127.0.0.1 means "only this machine" may connect', '127.0.0.1 is a public address that the school blocks', 'Port 3000 is reserved, so no program may listen on it', 'The projector laptop has no route to any 127 address'], ['A server bound to 127.0.0.1 listens only on the loopback interface; packets arriving on the Wi-Fi card find no listener on port 3000, so the kernel refuses. Fix: listen on 0.0.0.0 and open the firewall (lesson 1.5).', 'Server gắn vào 127.0.0.1 chỉ nghe trên giao diện loopback; gói đến qua card Wi-Fi không thấy ai nghe cổng 3000 nên kernel từ chối. Cách sửa: nghe trên 0.0.0.0 và mở tường lửa (bài 1.5).']),
  ],
  goiY: [['Ask first: did ANYTHING answer? An answer comes back fast; silence costs the whole wait.', 'Hỏi trước: có AI trả lời không? Câu trả lời về nhanh; im lặng tốn trọn thời gian chờ.'], ['A status code always comes from someone who is alive; 502 vs 504 is "wrong answer" vs "too slow".', 'Mã trạng thái luôn đến từ ai đó còn sống; 502 vs 504 là "trả lời sai" vs "quá chậm".']],
  loi: [['Concluding "the server is down" from a refusal — a refusal proves the machine is up.', 'Kết luận "server chết" từ một lời từ chối — từ chối chứng tỏ máy đang chạy.'], ['Raising the client timeout to "fix" a 504 that nginx produced itself.', 'Tăng timeout phía client để "sửa" lỗi 504 mà chính nginx sinh ra.']],
  tns: [tn('RST (reset)', 'gói đặt lại kết nối', 'Gói TCP kernel gửi khi không ai nghe cổng — người gọi thấy "refused".'), tn('firewall', 'tường lửa'), tn('loopback', 'giao diện vòng lặp', '127.0.0.1 — chỉ chính máy này.')],
  kn: ['refused vs timeout', '502 vs 504'],
});

/* ── 3. Chuỗi tới được + dòng thời gian YouTube ── */
const E3 = cs({
  ten: 'Errors 3 — The reachability chain, in order', kho: 'MEDIUM', phut: 8, loai: 'order',
  en: 'A user only sees the first broken link of a chain. Put the links in the order a request needs them, then put the real YouTube incident of 24 February 2008 (times in UTC) in order.',
  vi: 'Người dùng chỉ thấy mắt xích hỏng đầu tiên của một chuỗi. Sắp các mắt xích theo thứ tự một request cần chúng, rồi sắp sự cố YouTube thật ngày 24/02/2008 (giờ UTC).',
  cau: [
    ord('o1', ['Reachability is a chain', 'Khả năng tới được là một chuỗi'], [
      'Name → address (DNS)',
      'A route to that address (routing)',
      'A connection to the port (TCP)',
      'A certificate the client trusts (TLS)',
      'A valid answer from the application (HTTP)',
    ], ['name → route → connection → certificate → application. Check the links in this order before blaming anyone; Chapter 11 turns it into a checklist.', 'tên → tuyến → kết nối → chứng chỉ → ứng dụng. Kiểm từng mắt xích theo thứ tự này trước khi đổ lỗi cho ai; Chương 11 biến nó thành danh sách kiểm.']),
    ord('o2', ['YouTube, 24 February 2008', 'YouTube, 24/02/2008'], [
      '18:47 — Pakistan Telecom\'s route for 208.65.153.0/24 leaks to the Internet',
      '20:07 — YouTube announces the same /24 itself',
      '20:18 — YouTube announces two more specific /25 routes, which win',
      '21:01 — the bad route is withdrawn',
    ], ['The /24 from YouTube only tied with the hijacked /24; the two /25 routes were more specific than anything Pakistan Telecom announced, so routers everywhere preferred them — "the most specific route wins" (lesson 2.2).', '/24 do YouTube thông báo chỉ hoà với /24 bị chiếm; hai tuyến /25 cụ thể hơn mọi tuyến Pakistan Telecom thông báo, nên router khắp nơi chọn chúng — "tuyến cụ thể nhất thắng" (bài 2.2).']),
  ],
  goiY: [['You cannot open a connection before you know the address, and you cannot check a certificate before there is a connection.', 'Không thể mở kết nối khi chưa biết địa chỉ, và không thể kiểm chứng chỉ khi chưa có kết nối.'], ['For YouTube: the fix that finally worked was the most specific route.', 'Với YouTube: cách sửa cuối cùng có tác dụng là tuyến cụ thể nhất.']],
  loi: [['Putting TLS before TCP: TLS runs over an existing TCP connection.', 'Đặt TLS trước TCP: TLS chạy trên một kết nối TCP đã có.'], ['Thinking the /24 announcement alone fixed YouTube.', 'Nghĩ riêng thông báo /24 đã cứu được YouTube.']],
  tns: [tn('route', 'tuyến đường'), tn('more specific route', 'tuyến cụ thể hơn', 'Tiền tố dài hơn, vd /25 cụ thể hơn /24.'), tn('reachability', 'khả năng tới được')],
  kn: ['troubleshooting order'],
});

/* ── 4. Suy luận về các sự cố ── */
const E4 = cs({
  ten: 'Errors 4 — What the outages teach a developer', kho: 'HARD', phut: 12,
  en: 'Reason about the incidents in the lesson. Every wrong option is something people really say during outages.',
  vi: 'Suy luận về các sự cố trong bài. Mọi phương án sai đều là câu người ta thật sự nói khi có sự cố.',
  cau: [
    q('c1', ['Slack rolled back its DNSSEC change and things got worse. Why?', 'Slack rút lại thay đổi DNSSEC và tình hình còn tệ hơn. Vì sao?'], ['Resolvers had already cached part of the new configuration', 'Rolling back DNS always deletes the domain for a day', 'The old configuration had expired certificates inside', 'Routers kept the new DNS records in their own tables'], ['DNS answers are cached, sometimes for hours. Part of the new setup was already in resolvers\' caches, so the rollback produced a mix that failed. A DNS change is not instantly reversible (lesson 3.3).', 'Câu trả lời DNS được lưu đệm, đôi khi hàng giờ. Một phần cấu hình mới đã nằm trong bộ đệm của máy phân giải, nên rút lại tạo ra hỗn hợp hỏng. Thay đổi DNS không đảo ngược tức thì được (bài 3.3).']),
    q('c2', ['During the Facebook outage public resolvers got about 30 times their usual queries. Why?', 'Trong sự cố Facebook, máy phân giải công cộng nhận khoảng 30 lần số truy vấn thường ngày. Vì sao?'], ['Every app and browser kept retrying the failed lookups', 'Attackers used the outage to flood the resolvers', 'Facebook moved all its DNS to the public resolvers', 'Users switched to other sites that were slower'], ['Failed lookups are not cached for long, and clients retry: billions of devices asking again and again. Retries without back-off multiply load during an outage — a lesson for your own retry code.', 'Tra cứu thất bại không được lưu lâu, và client thử lại: hàng tỷ thiết bị hỏi đi hỏi lại. Thử lại không giãn cách làm tải tăng gấp bội khi có sự cố — bài học cho code thử lại của chính bạn.']),
    q('c3', ['After the seven incidents, which statement matches the lesson\'s pattern?', 'Sau bảy sự cố, câu nào khớp với quy luật của bài?'], ['Problems usually live in routing, DNS, TLS or the app', 'Problems usually live in cables and Wi-Fi hardware', 'Problems usually come from the users\' own laptops', 'Problems usually come from the servers being down'], ['Two routing, four DNS, one TLS, one app behind a proxy — never the cable. And in almost every case the servers were up; what failed was a link of the chain in front of them.', 'Hai định tuyến, bốn DNS, một TLS, một ứng dụng sau proxy — không lần nào là cáp. Và gần như mọi lần server vẫn chạy; thứ hỏng là một mắt xích phía trước chúng.']),
    q('c4', ['The AWS us-east-1 DynamoDB endpoint got an empty DNS record. Clients could not …', 'Endpoint DynamoDB ở us-east-1 của AWS bị một bản ghi DNS rỗng. Client không thể …'], ['turn the endpoint name into an address to connect to', 'verify the endpoint certificate after connecting', 'send more than one request per TCP connection', 'reach the Internet through their own provider'], ['With no address in the answer, the very first link (name → address) breaks; nothing after it can start. Many services that depend on DynamoDB failed with it.', 'Câu trả lời không có địa chỉ thì mắt xích đầu tiên (tên → địa chỉ) gãy; không gì phía sau bắt đầu được. Nhiều dịch vụ phụ thuộc DynamoDB hỏng theo.']),
    q('c5', ['On 18 August 2026 cuongthai.com returned 502 for seven minutes. Which check would have found the culprit fastest?', 'Ngày 18/08/2026 cuongthai.com trả 502 suốt bảy phút. Phép kiểm nào tìm ra thủ phạm nhanh nhất?'], ['The API container\'s status and logs behind nginx', 'A DNS lookup of cuongthai.com from a laptop', 'A new TLS certificate for the cuongthai.com name', 'A ping to the VPS from the developer\'s laptop'], ['502 = the proxy is alive and the name, route, connection and certificate all worked — so look behind the proxy. The API container was crash-looping because of a wrong base image.', '502 = proxy còn sống, tên, tuyến, kết nối và chứng chỉ đều ổn — nên nhìn phía sau proxy. Container API đang khởi động lại liên tục vì sai ảnh nền.']),
  ],
  goiY: [['Ask which link of the chain broke, and whether a cache could keep the problem alive.', 'Hỏi mắt xích nào gãy, và bộ đệm có thể giữ vấn đề sống lâu hơn không.'], ['A status code from a proxy means every link up to the proxy worked.', 'Mã trạng thái từ proxy nghĩa là mọi mắt xích tới proxy đều thông.']],
  loi: [['"The server is up, so it must be the user\'s network."', '"Server còn chạy, vậy chắc là mạng của người dùng."'], ['Assuming a DNS rollback is instant.', 'Cho rằng rút lại thay đổi DNS là tức thì.']],
  tns: [tn('DNSSEC', 'chữ ký số cho DNS'), tn('resolver', 'máy phân giải DNS'), tn('back-off', 'giãn cách thử lại', 'Mỗi lần thử lại chờ lâu hơn lần trước.')],
  kn: ['outages', 'caching'],
});

/* ── 5. Tự viết: phân loại thông báo lỗi ── */
function classifyCurlError(text) {
  var t = String(text);
  // 1. A 502/504 from a proxy. Checked FIRST, because "504 Gateway Time-out" contains "time" and would
  //    otherwise look like a network timeout. Accepted forms: "HTTP 502", "HTTP/1.1 504 ...", "returned error: 502",
  //    or the reason phrases "Bad Gateway" / "Gateway Time-out" / "Gateway Timeout".
  if (/HTTP(\/[\d.]+)?\s+50[24]\b/i.test(t) || /returned error:\s*50[24]\b/i.test(t) || /bad gateway|gateway time-?out/i.test(t)) return 'http-proxy';
  // 2. curl names the failure with its exit code: "curl: (N) ...".
  var m = /curl: \((\d+)\)/.exec(t);
  if (m) {
    var byCode = { 6: 'dns', 7: 'refused', 28: 'timeout', 35: 'tls', 60: 'tls' };
    return byCode[Number(m[1])] || 'unknown';
  }
  // 3. Other tools (nc, ssh, Node.js): keywords, in this order.
  var low = t.toLowerCase();
  if (/could not resolve|enotfound|name or service not known|temporary failure in name resolution/.test(low)) return 'dns';
  if (/certificate|ssl|tls/.test(low)) return 'tls';
  if (/timed out|etimedout|timeout/.test(low)) return 'timeout';
  if (/refused|econnrefused|could not connect|couldn't connect/.test(low)) return 'refused';
  return 'unknown';
}
const CA = [
  [L6], [L7], [L28], [LNC], [L502], [L504],
  // ẩn: câu chữ chuẩn của curl bản cũ, curl -f, nginx, nc, ssh và Node.js (không phải số đo)
  ['curl: (7) Failed to connect to localhost port 3000 after 0 ms: Couldn\'t connect to server', 1],
  ['curl: (22) The requested URL returned error: 502', 1],
  ['<html><head><title>504 Gateway Time-out</title></head>', 1],
  ['curl: (60) SSL certificate problem: unable to get local issuer certificate', 1],
  ['curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to cuongthai.com:443', 1],
  ['nc: connect to 10.10.9.9 port 80 (tcp) timed out: Operation now in progress', 1],
  ['nc: connect to 10.10.2.20 port 504 (tcp) failed: Connection refused', 1],
  ['ssh: connect to host 160.187.1.208 port 22: Connection timed out', 1],
  ['ssh: Could not resolve hostname vps: Name or service not known', 1],
  ['Error: getaddrinfo ENOTFOUND labflow.invalid', 1],
  ['Error: connect ECONNREFUSED 127.0.0.1:5432', 1],
  ['Error: connect ETIMEDOUT 10.10.9.9:80', 1],
  ['Error: certificate has expired', 1],
  ['HTTP/1.1 404 Not Found', 1],
  ['curl: (52) Empty reply from server', 1],
];
const E5 = jsBai({
  ten: 'Errors 5 — Write classifyCurlError(text)', kho: 'HARD', phut: 25,
  en: `<p>On-call, the first minute is reading the error. Write <code>classifyCurlError(text)</code> that takes ONE line printed by curl, nc, ssh or a Node.js program and returns which link of the chain failed:</p>
<p><code>'dns'</code> · <code>'refused'</code> · <code>'timeout'</code> · <code>'tls'</code> · <code>'http-proxy'</code> · <code>'unknown'</code></p>
<p>Apply the rules <b>in this order</b> — the first rule that matches decides:</p>
<ol>
<li><b>Proxy status.</b> An HTTP status 502 or 504 — written <code>HTTP 502</code>, <code>HTTP/1.1 504 …</code>, <code>HTTP/2 502</code>, <code>… returned error: 502</code> — or the reason phrases <code>Bad Gateway</code>, <code>Gateway Time-out</code>, <code>Gateway Timeout</code> ⇒ <code>'http-proxy'</code>.</li>
<li><b>curl exit code.</b> The line contains <code>curl: (N)</code>: 6 ⇒ <code>'dns'</code>, 7 ⇒ <code>'refused'</code>, 28 ⇒ <code>'timeout'</code>, 35 or 60 ⇒ <code>'tls'</code>, any other N ⇒ <code>'unknown'</code>.</li>
<li><b>Keywords</b> (ignore upper/lower case), checked in this order: <code>could not resolve</code>, <code>ENOTFOUND</code>, <code>Name or service not known</code>, <code>Temporary failure in name resolution</code> ⇒ <code>'dns'</code>; <code>certificate</code>, <code>SSL</code>, <code>TLS</code> ⇒ <code>'tls'</code>; <code>timed out</code>, <code>ETIMEDOUT</code>, <code>timeout</code> ⇒ <code>'timeout'</code>; <code>refused</code>, <code>ECONNREFUSED</code>, <code>could not connect</code>, <code>couldn't connect</code> ⇒ <code>'refused'</code>.</li>
<li>Anything else (an HTTP 200 or 404, an empty reply…) ⇒ <code>'unknown'</code> — the network path worked or the clue is not in the line.</li>
</ol>
<p>The visible cases are the six real lines from the lab (lab/out/c00-loi):</p>${pre([L6, L7, L28, LNC, L502, L504])}<p>The hidden cases use the standard wording of older curl versions, <code>curl -f</code>, an nginx error page, nc, ssh and Node.js — the messages you will meet at work.</p>`,
  vi: `<p>Khi trực sự cố, phút đầu tiên là đọc lỗi. Viết <code>classifyCurlError(text)</code> nhận MỘT dòng do curl, nc, ssh hoặc một chương trình Node.js in ra và trả về mắt xích nào hỏng:</p>
<p><code>'dns'</code> · <code>'refused'</code> · <code>'timeout'</code> · <code>'tls'</code> · <code>'http-proxy'</code> · <code>'unknown'</code></p>
<p>Áp các luật <b>theo đúng thứ tự này</b> — luật đầu tiên khớp sẽ quyết định:</p>
<ol>
<li><b>Mã trạng thái của proxy.</b> Mã HTTP 502 hoặc 504 — dạng <code>HTTP 502</code>, <code>HTTP/1.1 504 …</code>, <code>HTTP/2 502</code>, <code>… returned error: 502</code> — hoặc cụm <code>Bad Gateway</code>, <code>Gateway Time-out</code>, <code>Gateway Timeout</code> ⇒ <code>'http-proxy'</code>.</li>
<li><b>Mã thoát của curl.</b> Dòng chứa <code>curl: (N)</code>: 6 ⇒ <code>'dns'</code>, 7 ⇒ <code>'refused'</code>, 28 ⇒ <code>'timeout'</code>, 35 hoặc 60 ⇒ <code>'tls'</code>, N khác ⇒ <code>'unknown'</code>.</li>
<li><b>Từ khoá</b> (không phân biệt hoa thường), xét theo thứ tự: <code>could not resolve</code>, <code>ENOTFOUND</code>, <code>Name or service not known</code>, <code>Temporary failure in name resolution</code> ⇒ <code>'dns'</code>; <code>certificate</code>, <code>SSL</code>, <code>TLS</code> ⇒ <code>'tls'</code>; <code>timed out</code>, <code>ETIMEDOUT</code>, <code>timeout</code> ⇒ <code>'timeout'</code>; <code>refused</code>, <code>ECONNREFUSED</code>, <code>could not connect</code>, <code>couldn't connect</code> ⇒ <code>'refused'</code>.</li>
<li>Còn lại (HTTP 200 hay 404, trả lời rỗng…) ⇒ <code>'unknown'</code> — đường mạng đã thông hoặc manh mối không nằm trong dòng này.</li>
</ol>
<p>Các ca hiện là sáu dòng thật trong phòng lab (lab/out/c00-loi):</p>${pre([L6, L7, L28, LNC, L502, L504])}<p>Các ca ẩn dùng câu chữ chuẩn của curl bản cũ, <code>curl -f</code>, trang lỗi của nginx, nc, ssh và Node.js — những thông báo bạn sẽ gặp khi đi làm.</p>`,
  dauVao: ['text — one line of output (a string).', 'text — một dòng output (chuỗi).'],
  dauRa: ['One of the six strings \'dns\', \'refused\', \'timeout\', \'tls\', \'http-proxy\', \'unknown\'.', 'Một trong sáu chuỗi \'dns\', \'refused\', \'timeout\', \'tls\', \'http-proxy\', \'unknown\'.'],
  rangBuoc: [['The rules are applied in the order given; the first match wins.', 'Áp luật theo thứ tự đã cho; luật khớp đầu tiên thắng.'], ['A port number such as 504 inside "port 504" is NOT an HTTP status.', 'Số cổng như 504 trong "port 504" KHÔNG phải mã trạng thái HTTP.']],
  goiY: [
    ['Start with rule 2 (a regular expression /curl: \\((\\d+)\\)/ and a small lookup object); it already solves the first three lab lines.', 'Bắt đầu với luật 2 (biểu thức chính quy /curl: \\((\\d+)\\)/ và một object tra cứu nhỏ); nó đã giải được ba dòng lab đầu tiên.'],
    ['Then rule 1. Why must it come before the keywords? Look at "504 Gateway Time-out": it contains "time".', 'Rồi tới luật 1. Vì sao nó phải đứng trước từ khoá? Nhìn "504 Gateway Time-out": nó chứa chữ "time".'],
    ['For the status, require the word HTTP (or "returned error:") right before 502/504, so that "port 504" does not match. Lower-case the text once for the keyword rules.', 'Với mã trạng thái, đòi chữ HTTP (hoặc "returned error:") đứng ngay trước 502/504, để "port 504" không khớp. Chuyển chữ thường một lần cho các luật từ khoá.'],
  ],
  loi: [
    ['Checking for "time" or "timeout" before the HTTP status: "504 Gateway Time-out" becomes \'timeout\', yet the network worked and nginx answered.', 'Tìm "time" hay "timeout" trước mã HTTP: "504 Gateway Time-out" thành \'timeout\', trong khi mạng vẫn thông và nginx đã trả lời.'],
    ['Searching for a bare "504" anywhere: "port 504 … Connection refused" is then misread as a proxy error.', 'Tìm "504" trần ở mọi chỗ: "port 504 … Connection refused" bị đọc nhầm thành lỗi proxy.'],
    ['Matching "connect" for refused: "connect ETIMEDOUT" and "Connection timed out" both contain it.', 'Khớp chữ "connect" cho refused: cả "connect ETIMEDOUT" lẫn "Connection timed out" đều chứa nó.'],
  ],
  gt: ['The order of the rules encodes what is most certain. A status code proves somebody answered in HTTP, so it beats every word in the line. A curl exit code is curl\'s own verdict, so it beats any wording (which changes between curl versions — "Couldn\'t connect" vs "Could not connect"). Keywords are the fallback for tools without codes, and their order matters too: a TLS message may contain "connect", and many timeouts contain "connection". The regular expression for the status requires "HTTP" or "returned error:" in front of the number, which is why the nc line about port 504 stays \'refused\'.', 'Thứ tự luật mã hoá điều chắc chắn nhất. Mã trạng thái chứng tỏ có ai đó trả lời bằng HTTP, nên nó thắng mọi chữ trong dòng. Mã thoát của curl là phán quyết của chính curl, nên nó thắng mọi câu chữ (vốn đổi giữa các bản curl — "Couldn\'t connect" vs "Could not connect"). Từ khoá là phương án dự phòng cho công cụ không có mã, và thứ tự của chúng cũng quan trọng: thông báo TLS có thể chứa "connect", nhiều timeout chứa "connection". Biểu thức cho mã trạng thái đòi "HTTP" hoặc "returned error:" đứng trước con số, vì thế dòng nc về cổng 504 vẫn là \'refused\'.'],
  kn: ['error classification', 'regular expressions'],
  tns: [tn('exit code', 'mã thoát'), tn('regular expression', 'biểu thức chính quy'), tn('reason phrase', 'cụm lý do', 'Chữ đi sau mã HTTP, vd "Bad Gateway".'), tn('on-call', 'trực sự cố')],
  dau: `/**
 * Return 'dns' | 'refused' | 'timeout' | 'tls' | 'http-proxy' | 'unknown'.
 * Rules, in order: 1) HTTP 502/504 from a proxy  2) curl exit code  3) keywords  4) 'unknown'.
 */
function classifyCurlError(text) {
  // Write your solution here
  return 'unknown';
}
`,
  giai: '// Reference solution\n' + nguon(classifyCurlError),
  cases: CA.map(([t, an]) => ({ goi: goi('classifyCurlError', t), ...(an ? { an: true } : {}) })),
  vdGt: ['curl exit code 6 = the name did not become an address.', 'Mã thoát 6 của curl = tên không đổi được thành địa chỉ.'],
});
void esc; void c;

export default doiDau({ slug: 'netdev-0-9-bat-dau-hoc-xong', ten: 'Start here 2/2 — Real outages and reading errors', khoa: KHOA, baiHoc: 'netdev-0-9-bat-dau-hoc-xong', de: [E1, E2, E3, E4, E5] });
