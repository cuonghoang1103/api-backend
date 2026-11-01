/** Networking for Developers · 3.2 — Bản ghi: A/AAAA/CNAME/MX/TXT/CAA/SRV/HTTPS/NS/SOA thật của labflow.test, tên tương đối trong tệp vùng, named-checkzone, primary/secondary + serial; tự viết parseZone() và checkZone(). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, sauLenh, pre, ra } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const S = (tep, lenh) => tr(sauLenh(tep, lenh));
const ZONE = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../courses/networking-for-developers/lab/moi-truong/dns/vung/labflow.test.zone'), 'utf8').replace(/\s+$/, '');
const T = (tep) => tr(ra(tep).split('\n').slice(1)).filter((d) => d.trim());
const HOI = T('c32-hoi');
const NODE = S('c32-node', 'node /tmp/ghi.mjs');
const KIEM = T('c32-kiem').map((d) => d
  .replace('# 1) CNAME ở đỉnh (apex) tên miền — muốn trỏ labflow.test sang tên của CDN', '# 1) a CNAME at the apex — pointing labflow.test at the CDN\'s name')
  .replace('# 2) CNAME đứng chung với bản ghi khác ở cùng một tên', '# 2) a CNAME next to another record with the same name')
  .replace('# 3) MX trỏ thẳng vào một địa chỉ IP thay vì một tên', '# 3) an MX pointing at an IP address instead of a name')
  .replace('# 4) quên DẤU CHẤM CUỐI: tên không có dấu chấm cuối là tên TƯƠNG ĐỐI ⇒ bị ghép thêm tên miền', '# 4) a forgotten FINAL DOT: a name without it is RELATIVE ⇒ the domain gets appended'));
if (KIEM.some((d) => /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(d))) throw new Error('3.2: còn chữ Việt trong khối c32-kiem');
const QUEN = ['# on ns1: move api to the Singapore edge (.11) — and FORGET the serial', '$ grep -E \'IN SOA|^api\' /dnsz/src/labflow.test.zone', ...S('c32-serial-quen', "grep -E 'IN SOA|^api'").slice(0, 2), '$ sed -i \'s/…203.0.113.10/…203.0.113.11/\' …; ky.sh labflow.test && rndc reload labflow.test', 'zone reload queued', '# from the laptop: ask each name server directly', ...T('c32-serial-hoi')];
const SUA = ['# on ns1: bump the serial (YYYYMMDDnn), sign, reload', '$ sed -i \'s/2026110101 3600 600 1209600 300/2026110102 3600 600 1209600 300/\' /dnsz/src/labflow.test.zone', '$ bash /lab/k/moi-truong/dns/ky.sh labflow.test && rndc reload labflow.test', 'zone reload queued', '# ns2\'s log', ...S('c32-ns2-log', 'docker logs nfi-ns2'), '# from the laptop again', ...T('c32-serial-hoi2')];
const AXFR = ['# from the laptop', '$ dig @203.0.113.53 labflow.test AXFR', ...S('c32-axfr', 'dig @203.0.113.53 labflow.test AXFR').filter((d) => d.includes('Transfer failed'))];
const THAT = T('c32-that').map((d) => (d.length > 150 ? `${d.slice(0, 147)}…` : d));
if (HOI.length < 30 || NODE.length < 6 || QUEN.length < 10) throw new Error('3.2: output thật đổi');

/* ── 1. Bản ghi nào trả lời câu hỏi nào ── */
const E1 = cs({
  ten: 'Records 1 — Which record answers which question?', kho: 'EASY', phut: 12,
  en: `Every record type of LabFlow, one question each (lab/out/c32-hoi), then how Node reads them (c32-node):${pre([...HOI, '', '$ node /tmp/ghi.mjs', ...NODE])}`,
  vi: `Mọi loại bản ghi của LabFlow, mỗi loại một câu hỏi (lab/out/c32-hoi), rồi Node đọc chúng thế nào (c32-node):${pre([...HOI, '', '$ node /tmp/ghi.mjs', ...NODE])}`,
  cau: [
    q('c1', ['A mail server wants to deliver to someone@labflow.test. What does it look up, and what does it get?', 'Một máy chủ thư muốn giao thư cho someone@labflow.test. Nó tra gì, và nhận được gì?'], ['MX → the name mail.labflow.test (priority 10), then that name\'s A record', 'A of labflow.test → 203.0.113.10, the web server', 'TXT → "v=spf1 mx -all", which contains the mail server\'s address', 'MX → the address 203.0.113.25 directly'], ['MX always holds a NAME, never an IP; the sender then resolves that name (203.0.113.25). Lower priority wins when there are several.', 'MX luôn chứa một TÊN, không bao giờ là IP; bên gửi sau đó tra tên đó (203.0.113.25). Nếu có nhiều MX, số ưu tiên nhỏ hơn thắng.']),
    q('c2', ['labflow.test has two TXT records. What are they for?', 'labflow.test có hai bản ghi TXT. Chúng để làm gì?'], ['One proves domain ownership to a service, one lists who may send mail (SPF)', 'Both are comments for humans and are ignored by software', 'One stores the website\'s title, one its description', 'They are two halves of one long DNSSEC key'], ['TXT is free text, used as a channel: "labflow-verify=…" is a verification token a service asked you to publish; "v=spf1 mx -all" says only the MX hosts may send mail for the domain. DMARC lives at _dmarc.labflow.test.', 'TXT là chữ tự do, dùng như một kênh: "labflow-verify=…" là mã xác minh một dịch vụ bảo bạn công bố; "v=spf1 mx -all" nói chỉ các máy MX mới được gửi thư cho tên miền. DMARC nằm ở _dmarc.labflow.test.']),
    q('c3', ['What does `0 issue "letsencrypt.org"` (CAA) change?', '`0 issue "letsencrypt.org"` (CAA) thay đổi điều gì?'], ['Certificate authorities other than Let\'s Encrypt must refuse to issue a certificate for labflow.test', 'Browsers accept only Let\'s Encrypt certificates on labflow.test', 'Let\'s Encrypt renews the certificate automatically', 'Nothing until DNSSEC is enabled'], ['CAs must check CAA before issuing. Browsers never read it. No CAA at all (like cuongthai.com) means any CA may issue.', 'CA phải kiểm CAA trước khi cấp. Trình duyệt không bao giờ đọc nó. Không có CAA (như cuongthai.com) nghĩa là CA nào cũng được cấp.']),
    q('c4', ['A connection string says mongodb+srv://db.labflow.test. What does the driver look up?', 'Chuỗi kết nối ghi mongodb+srv://db.labflow.test. Driver tra gì?'], ['SRV _mongodb._tcp.db.labflow.test (hosts + ports) and TXT db.labflow.test (options)', 'A of db.labflow.test, then port 27017 by default', 'MX of labflow.test, because SRV means server', 'NS of db.labflow.test to find the database\'s name server'], ['SRV gives priority, weight, port and target name for each member; the TXT adds replicaSet and authSource. Node prints exactly that from resolveSrv and resolveTxt.', 'SRV cho ưu tiên, trọng số, cổng và tên đích của từng thành viên; TXT thêm replicaSet và authSource. Node in đúng như vậy từ resolveSrv và resolveTxt.']),
    q('c5', ['The NS answer shows TTL 86389 while the zone says 86400. Why?', 'Câu trả lời NS ghi TTL 86389 trong khi vùng ghi 86400. Vì sao?'], ['It came from the resolver\'s cache, which counts the TTL down', 'ns2 has an older copy of the zone with a different TTL', 'dig subtracts the query time from the TTL', 'NS records always lose 11 seconds when signed'], ['The resolver met the NS set 11 seconds earlier while resolving other names. A cached answer shows the time left; the authoritative server always shows the full value (lesson 3.3).', 'Resolver đã gặp bộ NS 11 giây trước khi tra những tên khác. Câu trả lời từ cache cho thấy thời gian còn lại; máy chủ có thẩm quyền luôn cho giá trị đầy đủ (bài 3.3).']),
    q('c6', ['What does the HTTPS record `1 . alpn="h2" ipv4hint=203.0.113.10` give a browser?', 'Bản ghi HTTPS `1 . alpn="h2" ipv4hint=203.0.113.10` cho trình duyệt điều gì?'], ['Before connecting, it learns that the server speaks HTTP/2 and a likely address', 'A redirect from http:// to https:// without a round trip', 'The server\'s TLS certificate, so no handshake is needed', 'Permission to skip DNS for 1 day'], ['RFC 9460: "." = same name, alpn = protocols, hints = addresses. Cloudflare also publishes ech= keys there (see media.cuongthai.com in lesson 3.4).', 'RFC 9460: "." = cùng tên, alpn = giao thức, hint = địa chỉ. Cloudflare còn công bố khoá ech= ở đó (xem media.cuongthai.com ở bài 3.4).']),
  ],
  goiY: [['Read the TYPE column: each type answers one kind of question.', 'Đọc cột TYPE: mỗi loại trả lời một kiểu câu hỏi.'], ['Names that start with an underscore (_dmarc, _mongodb._tcp) are service labels, not hosts.', 'Tên bắt đầu bằng gạch dưới (_dmarc, _mongodb._tcp) là nhãn dịch vụ, không phải máy.']],
  loi: [['Putting an IP address in an MX record.', 'Đặt địa chỉ IP vào bản ghi MX.'], ['Believing CAA is checked by browsers.', 'Tin rằng trình duyệt kiểm CAA.']],
  tns: [tn('MX', 'bản ghi máy chủ thư'), tn('TXT', 'bản ghi chữ'), tn('CAA', 'bản ghi giới hạn nơi cấp chứng chỉ'), tn('SRV', 'bản ghi dịch vụ (máy + cổng)'), tn('HTTPS / SVCB', 'bản ghi gợi ý kết nối')],
  kn: ['DNS record types'],
});

/* ── 2. SOA và tên trong tệp vùng ── */
const SOA_TXT = ZONE.split('\n').find((d) => /IN SOA/.test(d));
const Y = ['who to contact / primary server', 'version of the zone', 'how often ns2 checks for a new version', 'retry interval when that check fails', 'when ns2 stops answering without the primary', 'how long a "does not exist" may be cached'];
const E2 = cs({
  ten: 'Records 2 — Read the SOA and the names of a zone file', kho: 'MEDIUM', phut: 15, loai: 'table',
  en: `LabFlow's zone file on ns1 (lab/moi-truong/dns/vung/labflow.test.zone):${pre(ZONE)}In a zone file, <code>@</code> means the zone name (here <code>labflow.test.</code>), a name <b>ending in a dot</b> is complete, and any other name is <b>relative</b>: the zone name is appended.`,
  vi: `Tệp vùng của LabFlow trên ns1 (lab/moi-truong/dns/vung/labflow.test.zone):${pre(ZONE)}Trong tệp vùng, <code>@</code> là tên vùng (ở đây <code>labflow.test.</code>), tên <b>kết thúc bằng dấu chấm</b> là tên đầy đủ, còn mọi tên khác là <b>tên tương đối</b>: bị ghép thêm tên vùng.`,
  bang: [
    bang1('b1', [`The SOA line: ${SOA_TXT.replace(/\s+/g, ' ')}`, 'Dòng SOA'], [{ ma: 'f', ten: 'Field' }, { ma: 'v', ten: 'Value' }, { ma: 'm', ten: 'Meaning', luaChon: Y }], [
      { o: { f: 'MNAME (1st)' }, a: { v: ['ns1.labflow.test.', 'ns1.labflow.test'], m: Y[0] } },
      { o: { f: 'SERIAL (3rd)' }, a: { v: ['2026110101'], m: Y[1] } },
      { o: { f: 'REFRESH (4th)' }, a: { v: ['3600'], m: Y[2] } },
      { o: { f: 'RETRY (5th)' }, a: { v: ['600'], m: Y[3] } },
      { o: { f: 'EXPIRE (6th)' }, a: { v: ['1209600'], m: Y[4] } },
      { o: { f: 'MINIMUM (7th)' }, a: { v: ['300'], m: Y[5] } },
    ], ['The serial is the version number secondaries compare; YYYYMMDDnn is only a convention. EXPIRE 1 209 600 s = 14 days. The last field is no longer a minimum TTL: since RFC 2308 it is the negative-caching TTL (lesson 3.3). The 2nd field, hostmaster.labflow.test., is an e-mail address with the @ written as a dot.', 'Serial là số phiên bản mà máy phụ so sánh; YYYYMMDDnn chỉ là quy ước. EXPIRE 1 209 600 s = 14 ngày. Trường cuối không còn là TTL tối thiểu: từ RFC 2308 nó là TTL của cache âm (bài 3.3). Trường thứ 2, hostmaster.labflow.test., là địa chỉ e-mail với @ viết thành dấu chấm.']),
    bang1('b2', ['Write the full name each zone-file text stands for (with the final dot)', 'Viết tên đầy đủ mà mỗi đoạn chữ trong tệp vùng biểu thị (có dấu chấm cuối)'], [{ ma: 'x', ten: 'Text in the zone file' }, { ma: 'n', ten: 'Full name' }], [
      { o: { x: '@ (owner of the A line)' }, a: { n: ['labflow.test.'] } },
      { o: { x: 'www (owner)' }, a: { n: ['www.labflow.test.'] } },
      { o: { x: '_mongodb._tcp.db (owner)' }, a: { n: ['_mongodb._tcp.db.labflow.test.'] } },
      { o: { x: 'labflow.cdn.test. (target of static)' }, a: { n: ['labflow.cdn.test.'] } },
      { o: { x: 'mail (target of the MX)' }, a: { n: ['mail.labflow.test.'] } },
      { o: { x: 'mail.labflow.test (target written WITHOUT the final dot)' }, a: { n: ['mail.labflow.test.labflow.test.'] } },
    ], ['Relative names save typing and make a zone easy to copy to another domain — but a full name written without its final dot becomes doubled. named-checkzone warns about it (exercise 3); dig would simply answer NXDOMAIN for mail.labflow.test.', 'Tên tương đối đỡ gõ và giúp chép vùng sang tên miền khác dễ — nhưng một tên đầy đủ viết thiếu dấu chấm cuối sẽ bị nhân đôi. named-checkzone cảnh báo chuyện này (bài 3); dig thì chỉ trả NXDOMAIN cho mail.labflow.test.']),
  ],
  goiY: [['SOA order: MNAME RNAME SERIAL REFRESH RETRY EXPIRE MINIMUM.', 'Thứ tự SOA: MNAME RNAME SERIAL REFRESH RETRY EXPIRE MINIMUM.'], ['No final dot ⇒ append "labflow.test.".', 'Không có dấu chấm cuối ⇒ ghép thêm "labflow.test.".']],
  loi: [['Reading the last SOA field as the default TTL of records ($TTL is).', 'Đọc trường SOA cuối là TTL mặc định của bản ghi ($TTL mới là).'], ['Writing a full name in a zone file without its final dot.', 'Viết tên đầy đủ trong tệp vùng mà thiếu dấu chấm cuối.']],
  tns: [tn('SOA', 'bản ghi đầu vùng'), tn('serial', 'số phiên bản vùng'), tn('zone apex / @', 'đỉnh vùng'), tn('$TTL', 'TTL mặc định của tệp vùng')],
  kn: ['zone file', 'SOA'],
});

/* ── 3. named-checkzone ── */
const E3 = cs({
  ten: 'Records 3 — named-checkzone and four classic mistakes', kho: 'MEDIUM', phut: 12,
  en: `Check a zone <b>before</b> loading it. The correct file, then four broken copies (lab/out/c32-kiem):${pre(KIEM)}`,
  vi: `Kiểm vùng <b>trước khi</b> nạp. Tệp đúng, rồi bốn bản hỏng (lab/out/c32-kiem):${pre(KIEM)}`,
  cau: [
    q('c1', ['Why may labflow.test itself not be a CNAME to the CDN?', 'Vì sao chính labflow.test không được là CNAME sang CDN?'], ['A CNAME must be the only record at its name, and the apex must hold SOA and NS', 'CNAME records are only allowed for names that start with www', 'The CDN refuses CNAMEs from domains it does not own', 'CNAMEs cannot point to a different TLD'], ['The five errors are the lines that share the name labflow.test (SOA, NS, A, MX, TXT…). That is why providers offer "ALIAS"/"CNAME flattening" at the apex: they resolve the target themselves and publish A records.', 'Năm lỗi là các dòng cùng tên labflow.test (SOA, NS, A, MX, TXT…). Vì thế các nhà cung cấp có "ALIAS"/"CNAME flattening" ở đỉnh vùng: họ tự tra đích rồi công bố bản ghi A.']),
    q('c2', ['In mistake 2 the zone did not load at all. What does that mean in production?', 'Ở lỗi 2 vùng không nạp được. Điều đó nghĩa gì khi chạy thật?'], ['Reloading would leave the old zone or none: check first', 'The server loads it and silently drops the api line', 'Resolvers fix the conflict by choosing the CNAME', 'Nothing: named-checkzone is stricter than real servers'], ['named refuses the same file named-checkzone refuses. Always: edit a copy, check, then reload — the order Lab 3 asks for.', 'named từ chối đúng tệp mà named-checkzone từ chối. Luôn: sửa một bản sao, kiểm, rồi mới nạp lại — đúng thứ tự Lab 3 yêu cầu.']),
    q('c3', ['Mistakes 3 and 4 printed "OK". Is the zone fine?', 'Lỗi 3 và 4 vẫn in "OK". Vùng có ổn không?'], ['No: it loads, but mail breaks — read the warnings', 'Yes: OK means every record has been checked and is correct', 'Yes, warnings only concern performance', 'No: OK means the zone was not loaded'], ['OK only means "loadable". The warnings say the MX target has no address — mail servers would fail to deliver. In CI, fail on warnings too.', 'OK chỉ nghĩa là "nạp được". Cảnh báo nói đích của MX không có địa chỉ — máy chủ thư sẽ không giao được. Trong CI, hãy coi cảnh báo cũng là lỗi.']),
    q('c4', ['Where does "mail.labflow.test.labflow.test" come from?', '"mail.labflow.test.labflow.test" từ đâu ra?'], ['The target was written without a final dot, so the zone name was appended', 'The resolver appended its search domain', 'ns2 copied the zone twice', 'named adds the domain to every MX for safety'], ['Relative name + origin. The fix is one character: the final dot.', 'Tên tương đối + tên vùng. Sửa bằng đúng một ký tự: dấu chấm cuối.']),
    q('c5', ['The real cuongthai.com has `MX 10 fwd1.porkbun.com.` and no CAA (lab/out/c32-that). What do they mean?', 'cuongthai.com thật có `MX 10 fwd1.porkbun.com.` và không có CAA (lab/out/c32-that). Chúng nghĩa là gì?'], ['Mail is handled by Porkbun\'s forwarders; any CA may issue certificates for the domain', 'Porkbun hosts the website; certificates are disabled', 'Mail goes to the VPS 160.187.1.208; only Let\'s Encrypt may issue', 'The domain cannot receive mail without a CAA record'], ['MX names an outside service, which is normal; the A record still points to the VPS. Adding a CAA record is a cheap hardening step.', 'MX trỏ tới một dịch vụ bên ngoài, điều bình thường; bản ghi A vẫn trỏ về VPS. Thêm bản ghi CAA là bước gia cố rẻ.']),
  ],
  goiY: [['"CNAME and other data" = two kinds of record at one name, one of them a CNAME.', '"CNAME and other data" = hai loại bản ghi ở cùng một tên, một trong đó là CNAME.'], ['A warning is still a problem; OK only means the file could be loaded.', 'Cảnh báo vẫn là vấn đề; OK chỉ nghĩa là tệp nạp được.']],
  loi: [['Putting a CNAME at the apex.', 'Đặt CNAME ở đỉnh vùng.'], ['Ignoring warnings because the last line says OK.', 'Bỏ qua cảnh báo vì dòng cuối ghi OK.']],
  tns: [tn('named-checkzone', 'công cụ kiểm tệp vùng'), tn('apex', 'đỉnh vùng'), tn('CNAME flattening / ALIAS', 'làm phẳng CNAME')],
  kn: ['zone validation'],
});

/* ── 4. Primary/secondary và serial ── */
const E4 = cs({
  ten: 'Records 4 — Two name servers, one serial', kho: 'MEDIUM', phut: 14,
  en: `ns1 (203.0.113.53) is the primary; ns2 (203.0.113.54) copies the zone. Real output (lab/out/c32-axfr, c32-serial-quen, c32-serial-hoi, c32-serial-sua, c32-ns2-log, c32-serial-hoi2):${pre([...AXFR, '', ...QUEN, '', ...SUA])}And the real Internet (c32-that):${pre(THAT)}`,
  vi: `ns1 (203.0.113.53) là máy chính; ns2 (203.0.113.54) chép vùng. Output thật (lab/out/c32-axfr, c32-serial-quen, c32-serial-hoi, c32-serial-sua, c32-ns2-log, c32-serial-hoi2):${pre([...AXFR, '', ...QUEN, '', ...SUA])}Và Internet thật (c32-that):${pre(THAT)}`,
  cau: [
    q('c1', ['The laptop\'s AXFR failed. Why is that the right behaviour?', 'AXFR của laptop thất bại. Vì sao đó là hành vi đúng?'], ['AXFR copies the whole zone; only the secondary (allow-transfer) should get it', 'AXFR only works over TCP and dig used UDP', 'The laptop asked the wrong server: AXFR goes to the root', 'AXFR is disabled when DNSSEC is on'], ['An open AXFR hands anyone the full list of your names (internal hosts included). ns2 is allowed and holds the same serial.', 'AXFR mở cho ai cũng được là trao danh sách đủ mọi tên của bạn (cả máy nội bộ). ns2 được phép và giữ cùng serial.']),
    q('c2', ['After the change without a serial bump, ns1 says .11 and ns2 says .10. What do users get?', 'Sau khi đổi mà không tăng serial, ns1 nói .11 còn ns2 nói .10. Người dùng nhận gì?'], ['A mix: users whose resolver asks ns2 get the old IP', 'Everyone gets .11, because resolvers prefer the primary ns1', 'Everyone gets .10 until the TTL expires', 'SERVFAIL, because the two servers disagree'], ['Resolvers spread queries over all NS. ns2 compares serials, sees the same number and keeps its old copy — until EXPIRE, two weeks later. The symptom is a "random" mix.', 'Resolver rải câu hỏi cho mọi NS. ns2 so serial, thấy cùng số và giữ bản cũ — tới EXPIRE, hai tuần sau. Triệu chứng là một mớ "ngẫu nhiên".']),
    q('c3', ['How did ns2 learn about serial 2026110102 within milliseconds?', 'ns2 biết serial 2026110102 trong vài mili giây bằng cách nào?'], ['ns1 sent it a NOTIFY; ns2 saw a larger serial and transferred the zone', 'ns2 checks every second (REFRESH)', 'The laptop\'s query told ns2 that a new version existed', 'rndc reload copies the file to ns2 directly'], ['"notify from 203.0.113.53: serial 2026110102", then "Transfer completed: 74 records, 5141 bytes". Without NOTIFY, ns2 would check after REFRESH = 3600 s.', '"notify from 203.0.113.53: serial 2026110102", rồi "Transfer completed: 74 records, 5141 bytes". Không có NOTIFY, ns2 sẽ kiểm sau REFRESH = 3600 s.']),
    q('c4', ['The zone file has 23 records but the transfer moved 74. Why?', 'Tệp vùng có 23 bản ghi mà lượt chép chuyển 74. Vì sao?'], ['The zone is signed: RRSIG, NSEC and DNSKEY records travel too', 'ns2 asked for every record three times', 'The 74 include the root and TLD records', 'AXFR counts each byte of TXT records separately'], ['DNSSEC (lesson 3.5) adds a signature per record set, NSEC links between names and the keys. You saw it filtered out with grep -v.', 'DNSSEC (bài 3.5) thêm một chữ ký cho mỗi bộ bản ghi, các liên kết NSEC giữa các tên và các khoá. Bạn đã thấy chúng bị lọc bằng grep -v.']),
    q('c5', ['cuongthai.com\'s serial is 2418592525. Is something wrong?', 'Serial của cuongthai.com là 2418592525. Có gì sai không?'], ['No: YYYYMMDDnn is only a convention; Cloudflare uses its own counter', 'Yes: a serial must be a date, so secondaries ignore it', 'Yes: it is larger than 2^31 and will wrap tomorrow', 'No: Cloudflare stores the expiry date of the domain there'], ['Only "bigger = newer" matters (with serial arithmetic for wrap-around, RFC 1982). Managed DNS bumps it for you on every change.', 'Chỉ có "lớn hơn = mới hơn" là quan trọng (kèm phép tính serial khi quay vòng, RFC 1982). DNS được quản lý tự tăng nó mỗi lần đổi.']),
    q('c6', ['ANY to Cloudflare\'s server returned only `HINFO "RFC8482"`. What does that tell you?', 'Hỏi ANY tới máy chủ của Cloudflare chỉ nhận `HINFO "RFC8482"`. Điều đó cho biết gì?'], ['Servers may refuse to list everything: ask for each type you need', 'cuongthai.com has only one record', 'The domain is broken and must be re-created', 'ANY works only with AXFR permission'], ['RFC 8482 lets servers answer ANY minimally — ANY was abused for amplification attacks. Tools that relied on ANY to "see all records" no longer work.', 'RFC 8482 cho máy chủ trả lời ANY tối giản — ANY từng bị lạm dụng cho tấn công khuếch đại. Công cụ dựa vào ANY để "xem mọi bản ghi" không còn dùng được.']),
  ],
  goiY: [['Secondaries copy only when the serial grows.', 'Máy phụ chỉ chép khi serial tăng.'], ['Ask each name server directly (@203.0.113.53, @203.0.113.54) to bypass caches.', 'Hỏi thẳng từng máy chủ tên (@203.0.113.53, @203.0.113.54) để bỏ qua cache.']],
  loi: [['Changing a record without bumping the serial.', 'Đổi bản ghi mà không tăng serial.'], ['Testing only the primary after a change.', 'Chỉ thử máy chính sau khi đổi.']],
  tns: [tn('primary / secondary', 'máy chính / máy phụ'), tn('AXFR', 'chép trọn vùng'), tn('NOTIFY', 'báo có phiên bản mới'), tn('serial arithmetic', 'phép so serial có quay vòng')],
  kn: ['zone transfer'],
});

/* ── 5. parseZone() ── */
/** Tên trong tệp vùng ⇒ tên đầy đủ (có dấu chấm cuối). */
function absName(name, origin) {
  var o = origin.replace(/\.$/, '') + '.';
  if (name === '@') return o;
  if (name.slice(-1) === '.') return name;
  return name + '.' + o;
}
/** Tệp vùng đơn giản (mỗi bản ghi một dòng) ⇒ [{ name, ttl, type, data }] với mọi tên đã viết đầy đủ. */
function parseZone(text, origin) {
  var ttl = null, out = [];
  var TARGET_LAST = { CNAME: 1, NS: 1, MX: 1, SRV: 1, PTR: 1 };
  String(text).split('\n').forEach(function (raw) {
    var line = '', inQ = false;
    for (var i = 0; i < raw.length; i++) {                     // cut the comment, but not a ";" inside quotes
      var ch = raw[i];
      if (ch === '"') inQ = !inQ;
      if (ch === ';' && !inQ) break;
      line += ch;
    }
    line = line.trim();
    if (!line) return;
    var w = line.split(/\s+/);
    if (w[0] === '$TTL') { ttl = Number(w[1]); return; }
    var name = absName(w[0], origin), k = 1, recTtl = ttl;
    if (/^\d+$/.test(w[k])) recTtl = Number(w[k++]);
    if (w[k] === 'IN') k++;
    var type = w[k++];
    var rest = line.split(/\s+/).slice(k);
    if (TARGET_LAST[type]) rest[rest.length - 1] = absName(rest[rest.length - 1], origin);
    if (type === 'SOA') { rest[0] = absName(rest[0], origin); rest[1] = absName(rest[1], origin); }
    out.push({ name: name, ttl: recTtl, type: type, data: rest.join(' ') });
  });
  return out;
}
const ORIGIN = 'labflow.test';
const ZONE_DOI = (a, b) => ZONE.replace(a, b);
const Z_CHAM = ZONE_DOI(/^@ {14}IN MX {3}10 mail$/m, '@              IN MX   10 mail.labflow.test');
const Z_TTL = `$TTL 3600\n@ IN SOA ns1 hostmaster 7 3600 600 1209600 60\n@ IN NS ns1.example.net.\nwww IN A 192.0.2.80 ; web\n$TTL 60\nmail 3600 IN A 192.0.2.25\n_sip._udp IN SRV 10 60 5060 sip\nsip IN A 192.0.2.5\nnote IN TXT "a;b" "c ; d" ; real comment`;
const E5 = jsBai({
  ten: 'Records 5 — Write parseZone(): turn a zone file into full records', kho: 'MEDIUM', phut: 28,
  en: `<p>Write <code>parseZone(text, origin)</code> for zone files that have one record per line, like LabFlow's real file:</p>${pre(ZONE)}
<p>Return <code>[{ name, ttl, type, data }]</code> in file order:</p>
<ul><li>comments start at <code>;</code> — but a <code>;</code> <b>inside double quotes</b> is text (look at the DMARC line); empty lines are skipped;</li>
<li><code>$TTL n</code> sets the default TTL for the lines that follow;</li>
<li>a line is <code>owner [ttl] [IN] TYPE data…</code>: the owner is <code>@</code> (= origin), a full name ending in <code>.</code>, or a relative name (append the origin); the optional number is the TTL;</li>
<li><code>name</code> is always the full name with the final dot; <code>data</code> is the remaining words joined by one space, where the <b>last word</b> of CNAME, NS, MX, SRV and PTR is a name and becomes a full name too, and the first two words of SOA as well.</li></ul>
<p>Example: <code>@ IN MX 10 mail</code> ⇒ <code>{ name: "labflow.test.", ttl: 300, type: "MX", data: "10 mail.labflow.test." }</code>. Hidden cases: the broken copy of c32-kiem (the forgotten final dot) and a <b>constructed</b> zone with two <code>$TTL</code> lines and quotes containing <code>;</code>.</p>`,
  vi: `<p>Viết <code>parseZone(text, origin)</code> cho tệp vùng mỗi dòng một bản ghi, như tệp thật của LabFlow:</p>${pre(ZONE)}
<p>Trả về <code>[{ name, ttl, type, data }]</code> theo thứ tự trong tệp:</p>
<ul><li>chú thích bắt đầu từ <code>;</code> — nhưng <code>;</code> <b>nằm trong ngoặc kép</b> là chữ (xem dòng DMARC); dòng trống bỏ qua;</li>
<li><code>$TTL n</code> đặt TTL mặc định cho các dòng phía sau;</li>
<li>một dòng là <code>owner [ttl] [IN] TYPE data…</code>: owner là <code>@</code> (= origin), tên đầy đủ kết thúc bằng <code>.</code>, hoặc tên tương đối (ghép origin); con số tuỳ chọn là TTL;</li>
<li><code>name</code> luôn là tên đầy đủ có dấu chấm cuối; <code>data</code> là các chữ còn lại nối bằng một dấu cách, trong đó <b>chữ cuối</b> của CNAME, NS, MX, SRV và PTR là một tên và cũng thành tên đầy đủ, hai chữ đầu của SOA cũng vậy.</li></ul>
<p>Ví dụ: <code>@ IN MX 10 mail</code> ⇒ <code>{ name: "labflow.test.", ttl: 300, type: "MX", data: "10 mail.labflow.test." }</code>. Ca ẩn: bản hỏng của c32-kiem (quên dấu chấm cuối) và một vùng <b>dựng</b> có hai dòng <code>$TTL</code> và ngoặc kép chứa <code>;</code>.</p>`,
  dauVao: ['text — zone file; origin — e.g. "labflow.test".', 'text — tệp vùng; origin — ví dụ "labflow.test".'],
  dauRa: ['Array of { name, ttl, type, data }.', 'Mảng { name, ttl, type, data }.'],
  goiY: [['Write absName(name, origin) first: "@" ⇒ origin + ".", ends with "." ⇒ unchanged, else name + "." + origin + ".".', 'Viết absName(name, origin) trước: "@" ⇒ origin + ".", kết thúc bằng "." ⇒ giữ nguyên, ngược lại name + "." + origin + ".".'], ['Strip comments character by character, flipping an "inside quotes" flag at every ".', 'Cắt chú thích từng ký tự, đảo cờ "đang trong ngoặc kép" mỗi lần gặp ".']],
  loi: [['Cutting at the first ";" and losing half of the DMARC record.', 'Cắt ở dấu ";" đầu tiên và mất nửa bản ghi DMARC.'], ['Treating the TTL as mandatory: most lines have none.', 'Coi TTL là bắt buộc: phần lớn các dòng không có.'], ['Expanding names inside TXT data.', 'Mở rộng tên nằm trong dữ liệu TXT.']],
  gt: ['A zone file is shorthand: relative names, an implicit TTL and comments. Every tool (named, dig\'s AXFR output, your provider\'s API) works with the expanded form, so the bugs you meet — a doubled domain, the wrong TTL, a TXT cut in half — all live in this expansion step. Parsing it yourself is the quickest way to see why the final dot matters.', 'Tệp vùng là cách viết tắt: tên tương đối, TTL ngầm định và chú thích. Mọi công cụ (named, output AXFR của dig, API của nhà cung cấp) làm việc với dạng đã mở rộng, nên các lỗi bạn gặp — tên miền bị nhân đôi, TTL sai, TXT bị cắt đôi — đều nằm ở bước mở rộng này. Tự phân tích là cách nhanh nhất để thấy vì sao dấu chấm cuối quan trọng.'],
  kn: ['zone file', 'relative names'],
  tns: [tn('origin', 'tên gốc của vùng'), tn('owner name', 'tên chủ của bản ghi'), tn('resource record', 'bản ghi tài nguyên')],
  dau: `/** zone file ⇒ [{ name, ttl, type, data }] with full names */
function parseZone(text, origin) {
  // Write your solution here
  return [];
}
`,
  giai: nguon(absName, parseZone),
  cases: [
    { goi: `${goi('parseZone', ZONE, ORIGIN)}.slice(0, 6)`, moTa: ['Real zone: SOA, NS and the first A records', 'Vùng thật: SOA, NS và các bản ghi A đầu'] },
    { goi: `${goi('parseZone', ZONE, ORIGIN)}.filter(function (r) { return r.type === 'MX' || r.type === 'CNAME' || r.name === '_dmarc.labflow.test.'; })`, moTa: ['Real zone: MX, CNAMEs and the DMARC TXT (";" inside quotes)', 'Vùng thật: MX, CNAME và TXT DMARC (";" trong ngoặc kép)'] },
    { goi: `${goi('parseZone', ZONE, ORIGIN)}.length`, moTa: ['Real zone: how many records', 'Vùng thật: bao nhiêu bản ghi'] },
    { goi: goi('parseZone', ZONE, ORIGIN), an: true },
    { goi: `${goi('parseZone', Z_CHAM, ORIGIN)}.filter(function (r) { return r.type === 'MX'; })`, an: true },
    { goi: goi('parseZone', Z_TTL, 'example.org'), an: true },
  ],
});

/* ── 6. checkZone() ── */
const REC = (ztext) => parseZone(ztext, ORIGIN);
/** Ba kiểm của named-checkzone mà bài 3.2 gặp — trên bản ghi đã mở rộng. */
function checkZone(records, origin) {
  var o = origin.replace(/\.$/, '') + '.';
  var bare = function (n) { return n.replace(/\.$/, ''); };
  var types = {};
  records.forEach(function (r) { (types[r.name] = types[r.name] || []).push(r.type); });
  var msgs = [];
  Object.keys(types).forEach(function (n) {
    var t = types[n];
    if (t.indexOf('CNAME') >= 0 && t.some(function (x) { return x !== 'CNAME' && x !== 'RRSIG' && x !== 'NSEC'; })) msgs.push(bare(n) + ': CNAME and other data');
  });
  records.forEach(function (r) {
    if (r.type !== 'MX' && r.type !== 'NS' && r.type !== 'SRV') return;
    var w = r.data.split(' '), target = w[w.length - 1];
    if (r.type === 'MX' && /^\d{1,3}(\.\d{1,3}){3}\.?$/.test(target)) { msgs.push("'" + target + "': MX is an address"); return; }
    var inZone = target === o || target.slice(-(o.length + 1)) === '.' + o;
    var hasAddr = (types[target] || []).some(function (x) { return x === 'A' || x === 'AAAA'; });
    if (inZone && !hasAddr) msgs.push(bare(r.name) + '/' + r.type + " '" + bare(target) + "' has no address records (A or AAAA)");
  });
  return msgs.filter(function (m, i) { return msgs.indexOf(m) === i; }).sort();
}
const R_THAT = REC(ZONE);
const R_APEX = REC(ZONE_DOI(/^@ {14}IN A {4}203\.0\.113\.10$/m, '@              IN CNAME labflow.cdn.test.'));
const R_CHUNG = REC(`${ZONE}\napi            IN CNAME labflow.test.`);
const R_MX = REC(ZONE_DOI(/^@ {14}IN MX {3}10 mail$/m, '@              IN MX   10 203.0.113.25.'));
const R_CHAM = REC(Z_CHAM);
const R_LAB3 = REC(`${ZONE}\nstatus         IN CNAME labflow.cdn.test.\n@              IN MX   20 mail2\n@              IN NS   ns3\n_sip._tcp      IN SRV  0 0 5060 sip`);
if (R_APEX.filter((r) => r.type === 'CNAME' && r.name === 'labflow.test.').length !== 1) throw new Error('3.2: dựng bản apex hỏng');
const E6 = jsBai({
  ten: 'Records 6 — Write checkZone(): catch the mistakes before reload', kho: 'HARD', phut: 30,
  en: `<p>Reproduce three checks of <code>named-checkzone</code> on records already expanded by <code>parseZone()</code> (exercise 5). The real messages (lab/out/c32-kiem):</p>${pre(KIEM)}
<p>Write <code>checkZone(records, origin)</code> returning the <b>unique messages sorted alphabetically</b> (an empty array for a clean zone). Names in messages have <b>no</b> final dot:</p>
<ul><li>a name that has a CNAME <b>and</b> any other type (RRSIG and NSEC excepted) ⇒ <code>"&lt;name&gt;: CNAME and other data"</code>, once per name;</li>
<li>an MX whose target is an IPv4 address (with or without a final dot) ⇒ <code>"'&lt;target as written&gt;': MX is an address"</code>, and no other check for that record;</li>
<li>an MX, NS or SRV whose target (the last word of data) is <b>inside the zone</b> — equal to the origin or ending in <code>.&lt;origin&gt;.</code> — but has no A or AAAA record ⇒ <code>"&lt;owner&gt;/&lt;TYPE&gt; '&lt;target&gt;' has no address records (A or AAAA)"</code>. Targets outside the zone are not checked.</li></ul>
<p>Cases are built from the real zone file exactly as c32-kiem did with sed (apex CNAME, CNAME next to A, MX to an address, forgotten dot), plus a <b>constructed</b> launch change with an NS and an SRV pointing to names that have no address.</p>`,
  vi: `<p>Làm lại ba phép kiểm của <code>named-checkzone</code> trên các bản ghi đã được <code>parseZone()</code> mở rộng (bài 5). Thông báo thật (lab/out/c32-kiem):</p>${pre(KIEM)}
<p>Viết <code>checkZone(records, origin)</code> trả về <b>các thông báo không trùng, xếp theo bảng chữ cái</b> (mảng rỗng nếu vùng sạch). Tên trong thông báo <b>không</b> có dấu chấm cuối:</p>
<ul><li>một tên có CNAME <b>và</b> bất kỳ loại nào khác (trừ RRSIG và NSEC) ⇒ <code>"&lt;tên&gt;: CNAME and other data"</code>, mỗi tên một lần;</li>
<li>MX có đích là địa chỉ IPv4 (có hoặc không có dấu chấm cuối) ⇒ <code>"'&lt;đích như đã viết&gt;': MX is an address"</code>, và không kiểm gì thêm cho bản ghi đó;</li>
<li>MX, NS hoặc SRV có đích (chữ cuối của data) <b>nằm trong vùng</b> — bằng origin hoặc kết thúc bằng <code>.&lt;origin&gt;.</code> — mà không có bản ghi A hay AAAA ⇒ <code>"&lt;owner&gt;/&lt;TYPE&gt; '&lt;đích&gt;' has no address records (A or AAAA)"</code>. Đích ngoài vùng không kiểm.</li></ul>
<p>Các ca dựng từ tệp vùng thật đúng như c32-kiem đã làm bằng sed (CNAME ở đỉnh, CNAME cạnh A, MX trỏ vào địa chỉ, quên dấu chấm), cùng một thay đổi ra mắt <b>dựng</b> có NS và SRV trỏ tới tên không có địa chỉ.</p>`,
  dauVao: ['records — [{ name, ttl, type, data }] with full names; origin — "labflow.test".', 'records — [{ name, ttl, type, data }] với tên đầy đủ; origin — "labflow.test".'],
  dauRa: ['Sorted array of unique messages.', 'Mảng thông báo không trùng, đã xếp.'],
  goiY: [['Group types by name first: { "api.labflow.test.": ["A"], … }.', 'Gom loại theo tên trước: { "api.labflow.test.": ["A"], … }.'], ['"Inside the zone" is a suffix test on full names — careful: "xlabflow.test." does not end with ".labflow.test.".', '"Trong vùng" là phép thử hậu tố trên tên đầy đủ — cẩn thận: "xlabflow.test." không kết thúc bằng ".labflow.test.".']],
  loi: [['Reporting the CNAME conflict once per record instead of once per name.', 'Báo xung đột CNAME một lần cho mỗi bản ghi thay vì mỗi tên.'], ['Checking targets outside the zone (fwd1.porkbun.com.) against your own records.', 'Kiểm đích ngoài vùng (fwd1.porkbun.com.) với bản ghi của chính bạn.'], ['Leaving the final dot in the message names.', 'Để nguyên dấu chấm cuối trong tên ở thông báo.']],
  gt: ['These are the mistakes that break real domains silently: a zone that does not load, mail that bounces because MX points to nothing, a delegation to a name without an address. Running such checks in CI before every reload — the same idea as kiem-dns.sh in Lab 3 — turns an outage into a red build.', 'Đây là những lỗi làm hỏng tên miền thật một cách âm thầm: vùng không nạp được, thư bị trả lại vì MX trỏ vào khoảng không, ủy quyền cho một tên không có địa chỉ. Chạy các phép kiểm như vậy trong CI trước mỗi lần nạp lại — cùng ý tưởng với kiem-dns.sh của Lab 3 — biến một sự cố thành một bản dựng đỏ.'],
  kn: ['zone validation', 'CI checks'],
  tns: [tn('in-zone / out-of-zone', 'trong vùng / ngoài vùng'), tn('lint', 'kiểm lỗi tĩnh')],
  dau: `/** expanded records ⇒ sorted unique messages, like named-checkzone */
function checkZone(records, origin) {
  // Write your solution here
  return [];
}
`,
  giai: nguon(checkZone),
  cases: [
    { goi: goi('checkZone', R_THAT, ORIGIN), moTa: ['The real zone: clean', 'Vùng thật: sạch'] },
    { goi: goi('checkZone', R_APEX, ORIGIN), moTa: ['Mistake 1: CNAME at the apex', 'Lỗi 1: CNAME ở đỉnh vùng'] },
    { goi: goi('checkZone', R_CHAM, ORIGIN), moTa: ['Mistake 4: forgotten final dot', 'Lỗi 4: quên dấu chấm cuối'] },
    { goi: goi('checkZone', R_CHUNG, ORIGIN), an: true },
    { goi: goi('checkZone', R_MX, ORIGIN), an: true },
    { goi: goi('checkZone', R_LAB3, ORIGIN), an: true },
    { goi: goi('checkZone', [{ name: 'xlabflow.test.', ttl: 300, type: 'A', data: '192.0.2.1' }, { name: 'labflow.test.', ttl: 300, type: 'NS', data: 'ns.xlabflow.test.' }], ORIGIN), an: true },
  ],
});

export default doiDau({ slug: 'netdev-3-2-ban-ghi', ten: '3.2 Record types that developers touch', khoa: KHOA, baiHoc: 'netdev-3-2-ban-ghi', de: [E1, E2, E3, E4, E5, E6] });
