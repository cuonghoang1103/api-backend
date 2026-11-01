/** Networking for Developers · 3.3 — TTL và cache: đếm ngược, dòng thời gian hạ TTL/đổi IP thật, cache âm + NSEC, cache trong Java/Node, thread pool libuv; tự viết pollResolver() (khớp từng dòng với bản ghi thật) và negativeProbe(). */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre, ra } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const T = (tep) => tr(ra(tep).split('\n').slice(1)).filter((d) => d.trim());
const DEM = T('c33-dem');
const ISPC = T('c33-isp-cache');
const THAT = T('c33-that');
const THEO = T('c33-theo-doc').filter((d) => /^\d\d:\d\d:\d\d/.test(d));
const R3 = T('lab3-r3').filter((d) => /^\d\d:\d\d:\d\d/.test(d));
const gio = (tep) => T(tep).find((d) => /^\d\d:\d\d:\d\d$/.test(d));
const HA = gio('c33-ns-ha'), DOI = gio('c33-ns-doi'), DOI2 = gio('c33-ns-doi2'), R3HA = gio('lab3-r3-ha'), R3DOI = gio('lab3-r3-doi');
const AM = T('c33-am'), AM2 = T('c33-am2'), XOA1 = T('c33-am-xoa1'), AM3B = T('c33-am3b'), XOA2 = T('c33-am-xoa2'), AM3 = T('c33-am3');
const APP = T('c33-app');
const TREO = T('c33-treo'), TREO8 = T('c33-treo8');
if (THEO.length !== 13 || HA !== '16:10:51' || DOI !== '16:11:02' || DOI2 !== '16:13:07' || R3HA !== '17:18:12' || R3DOI !== '17:20:17') throw new Error('3.3: output thật đổi — xem lại đề');

/* ── 1. Đếm ngược ── */
const E1 = cs({
  ten: 'TTL 1 — The countdown, and who keeps the copy', kho: 'EASY', phut: 10,
  en: `Real output (lab/out/c33-dem on the laptop, c33-isp-cache inside the ISP's resolver, c33-that on the real Internet):${pre([...DEM, '', '# inside the resolver', ...ISPC, '', '# the real Internet', ...THAT])}`,
  vi: `Output thật (lab/out/c33-dem trên laptop, c33-isp-cache bên trong resolver nhà mạng, c33-that trên Internet thật):${pre([...DEM, '', '# bên trong resolver', ...ISPC, '', '# Internet thật', ...THAT])}`,
  cau: [
    q('c1', ['Five seconds later the resolver says 115, while ns1 (@203.0.113.53) still says 120. Why?', 'Năm giây sau resolver nói 115, còn ns1 (@203.0.113.53) vẫn nói 120. Vì sao?'], ['The resolver shows the time left on its copy; ns1 shows the full TTL', 'ns1 is slower to update than the resolver, so it lags behind', 'The laptop subtracts the time since the last query', 'The record was changed on ns1 during those 5 seconds'], ['A cache counts down from the TTL it received. The zone\'s own server has no countdown: it publishes the value from the zone file.', 'Cache đếm ngược từ TTL nó nhận được. Máy chủ của chính vùng không đếm ngược: nó công bố giá trị trong tệp vùng.']),
    q('c2', ['The resolver counted 2 queries, 1 cache hit, 1 miss. Which query was the miss?', 'Resolver đếm 2 câu hỏi, 1 trúng, 1 trượt cache. Câu nào trượt?'], ['The first one: the cache was empty, so the resolver had to ask ns1', 'The second one: the TTL had changed', 'The query sent directly to ns1', 'Neither: misses count only failed lookups'], ['A miss = the resolver had to go upstream. The query to @203.0.113.53 never reached the resolver at all.', 'Trượt = resolver phải đi hỏi lên trên. Câu hỏi tới @203.0.113.53 không hề đi qua resolver.']),
    q('c3', ['Cloudflare sets 300 s on cuongthai.com. In the worst case, how long can a resolver keep giving the old IP after a change?', 'Cloudflare đặt 300 s cho cuongthai.com. Trong trường hợp xấu nhất, resolver có thể tiếp tục trả IP cũ bao lâu sau khi đổi?'], ['About 5 minutes, if it fetched the record just before the change', '0 s: Cloudflare pushes changes to every resolver', 'Exactly 300 s for every resolver, no more, no less', '24 hours, because resolvers ignore short TTLs'], ['Each resolver fetched at a different moment, so the delay ranges from 0 to the TTL. Apps and OS caches can add their own layer on top.', 'Mỗi resolver lấy bản ghi ở một thời điểm khác nhau, nên độ trễ chạy từ 0 tới TTL. Ứng dụng và cache của hệ điều hành có thể chồng thêm một lớp.']),
    q('c4', ['The NXDOMAIN answer carries "cuongthai.com. 1800 IN SOA … 1800". For how long may a resolver remember that the name does not exist?', 'Câu trả lời NXDOMAIN kèm "cuongthai.com. 1800 IN SOA … 1800". Resolver được nhớ "tên không tồn tại" bao lâu?'], ['1800 s = 30 minutes: the smaller of the SOA record\'s TTL and its last field', '300 s, the TTL of the A record', '604800 s, the expire field', 'It is never cached: NXDOMAIN is always rechecked'], ['RFC 2308: negative TTL = min(SOA TTL, SOA minimum). Here both are 1800. Create records before anyone queries them.', 'RFC 2308: TTL âm = min(TTL của SOA, trường minimum của SOA). Ở đây cả hai là 1800. Hãy tạo bản ghi trước khi có ai hỏi tới.']),
  ],
  goiY: [['Authoritative = full TTL every time; cache = time left.', 'Có thẩm quyền = TTL đầy đủ mọi lần; cache = thời gian còn lại.'], ['Negative TTL: look at the SOA in the AUTHORITY part of an NXDOMAIN answer.', 'TTL âm: nhìn SOA trong phần AUTHORITY của câu trả lời NXDOMAIN.']],
  loi: [['Expecting every resolver to switch at the same moment.', 'Mong mọi resolver chuyển cùng một lúc.'], ['Forgetting that "does not exist" is cached too.', 'Quên rằng "không tồn tại" cũng được cache.']],
  tns: [tn('cache hit / miss', 'trúng / trượt cache'), tn('remaining TTL', 'TTL còn lại'), tn('negative caching', 'cache âm')],
  kn: ['TTL', 'caching'],
});

/* ── 2. Dòng thời gian ── */
const E2 = cs({
  ten: 'TTL 2 — The server move that was done in the wrong order', kho: 'MEDIUM', phut: 15, loai: 'table',
  en: `On ns1 the TTL of api was lowered from 120 to 10 at <b>${HA}</b>, the IP was changed to .11 only 11 s later at <b>${DOI}</b>, and changed back to .10 at <b>${DOI2}</b> (lab/out/c33-ns-ha, c33-ns-doi, c33-ns-doi2). Meanwhile the laptop asked the resolver every 15 s (c33-theo-doc):${pre(THEO)}`,
  vi: `Trên ns1, TTL của api được hạ từ 120 xuống 10 lúc <b>${HA}</b>, IP đổi sang .11 chỉ 11 s sau đó lúc <b>${DOI}</b>, rồi đổi về .10 lúc <b>${DOI2}</b> (lab/out/c33-ns-ha, c33-ns-doi, c33-ns-doi2). Trong lúc đó laptop hỏi resolver 15 s một lần (c33-theo-doc):${pre(THEO)}`,
  bang: [bang1('b1', ['Read the timeline', 'Đọc dòng thời gian'], [{ ma: 'x', ten: 'Question' }, { ma: 'v', ten: 'Answer' }], [
    { o: { x: 'At what time did the resolver fetch the copy it kept until 16:12:32? (HH:MM:SS)' }, a: { v: ['16:10:46'] } },
    { o: { x: 'At what time did that copy expire? (HH:MM:SS)' }, a: { v: ['16:12:46'] } },
    { o: { x: 'First poll that shows .11 (HH:MM:SS)' }, a: { v: ['16:12:47'] } },
    { o: { x: 'Seconds between the IP change and the first .11' }, a: { v: ['105'] } },
    { o: { x: 'Seconds between the second change (16:13:07) and the first .10' }, a: { v: ['10'] } },
    { o: { x: 'TTL that was in the cache when the IP changed at 16:11:02 (the original value, s)' }, a: { v: ['120'] } },
  ], ['The copy fetched at 16:10:46 with TTL 120 lives until 16:12:46, whatever ns1 does in the meantime — lowering the TTL at 16:10:51 changed nothing for it. So the first move took 105 s (16:11:02 → 16:12:47). The second move, made when caches held the 10-s TTL, showed up after 10 s. Rule: worst-case delay = the TTL in caches when you change, so lower the TTL at least one old TTL before the move.', 'Bản lấy lúc 16:10:46 với TTL 120 sống tới 16:12:46, bất kể ns1 làm gì trong lúc đó — hạ TTL lúc 16:10:51 không đổi gì với nó. Nên lần chuyển đầu mất 105 s (16:11:02 → 16:12:47). Lần chuyển thứ hai, làm khi cache đã giữ TTL 10 s, hiện ra sau 10 s. Quy tắc: độ trễ xấu nhất = TTL đang nằm trong cache lúc bạn đổi, nên hãy hạ TTL trước khi chuyển ít nhất một TTL cũ.'])],
  goiY: [['Fetched at the poll where TTL equals the full value; expiry = fetch time + TTL.', 'Lấy về ở lượt hỏi có TTL bằng giá trị đầy đủ; hết hạn = lúc lấy + TTL.'], ['16:11:02 → 16:12:47 = 1 min 45 s.', '16:11:02 → 16:12:47 = 1 phút 45 giây.']],
  loi: [['Changing the IP right after lowering the TTL.', 'Đổi IP ngay sau khi hạ TTL.'], ['Believing the new TTL applies to copies already cached.', 'Tin rằng TTL mới áp dụng cho các bản đã nằm trong cache.']],
  tns: [tn('lower the TTL first', 'hạ TTL trước'), tn('propagation', 'lan truyền (thật ra là hết hạn cache)')],
  kn: ['TTL planning'],
});

/* ── 3. Cache âm ── */
const E3 = cs({
  ten: 'TTL 3 — "It does not exist" is cached too', kho: 'MEDIUM', phut: 14,
  en: `Someone asked for new.labflow.test before it existed; then it was created on ns1 (lab/out/c33-am, c33-am2), then we tried to flush the ISP's resolver (c33-am-xoa1, c33-am3b, c33-am-xoa2, c33-am3):${pre(['# laptop, before the record exists', ...AM, '# (record created on ns1, serial bumped, reloaded)', '# laptop', ...AM2, '', '# ISP resolver: flush only that name', ...XOA1, '# laptop', ...AM3B, '# ISP resolver', ...XOA2, '# laptop', ...AM3])}`,
  vi: `Có người hỏi new.labflow.test trước khi nó tồn tại; rồi nó được tạo trên ns1 (lab/out/c33-am, c33-am2), rồi ta thử xoá cache của resolver nhà mạng (c33-am-xoa1, c33-am3b, c33-am-xoa2, c33-am3):${pre(['# laptop, trước khi có bản ghi', ...AM, '# (tạo bản ghi trên ns1, tăng serial, nạp lại)', '# laptop', ...AM2, '', '# resolver nhà mạng: chỉ xoá đúng tên đó', ...XOA1, '# laptop', ...AM3B, '# resolver nhà mạng', ...XOA2, '# laptop', ...AM3])}`,
  cau: [
    q('c1', ['The zone\'s SOA has TTL 3600 and minimum 300. Why does the NXDOMAIN answer show 300?', 'SOA của vùng có TTL 3600 và minimum 300. Vì sao câu trả lời NXDOMAIN ghi 300?'], ['A negative answer may be cached for min(SOA TTL, minimum) = 300 s', 'The resolver caps every answer at 300 s', '300 is the TTL of the A record that will be created', 'The laptop asked with +ttl=300'], ['The authoritative server already sends the SOA with that smaller TTL. 298 a moment later = the countdown of the "does not exist" memory.', 'Máy chủ có thẩm quyền đã gửi SOA với TTL nhỏ hơn đó. 298 một lúc sau = đếm ngược của trí nhớ "không tồn tại".']),
    q('c2', ['ns1 answers 203.0.113.10, the resolver still NXDOMAIN. What do users of that resolver see, and for how long?', 'ns1 trả lời 203.0.113.10, resolver vẫn NXDOMAIN. Người dùng resolver đó thấy gì, và bao lâu?'], ['"Name not found" for up to the 298 s left, then the new address', 'The new address immediately, because ns1 has it', 'SERVFAIL until the serial reaches every resolver', 'The old address of labflow.test'], ['The resolver will not ask again while its negative entry lives. Checking on the authoritative server (@ns1) shows the truth; checking through a resolver shows the cache.', 'Resolver không hỏi lại khi mục âm còn sống. Kiểm trên máy chủ có thẩm quyền (@ns1) thấy sự thật; kiểm qua resolver thấy cache.']),
    q('c3', ['After "unbound-control flush new.labflow.test" the answer is still NXDOMAIN. Why?', 'Sau "unbound-control flush new.labflow.test" câu trả lời vẫn NXDOMAIN. Vì sao?'], ['Cached NSEC records still prove the name absent (aggressive NSEC)', 'flush only takes effect after the resolver is restarted', 'The laptop keeps its own negative cache of the name', 'ns2 has not copied the new record yet'], ['NSEC says "after mail comes ns1" — so no "new" exists. With aggressive-nsec (RFC 8198) the resolver answers from that proof without asking; flush_zone removed it. This only happens with DNSSEC-signed zones.', 'NSEC nói "sau mail là ns1" — vậy không có "new". Với aggressive-nsec (RFC 8198) resolver trả lời từ bằng chứng đó mà không hỏi; flush_zone gỡ nó đi. Chuyện này chỉ có ở vùng có ký DNSSEC.']),
    q('c4', ['A Let\'s Encrypt DNS-01 check queries _acme-challenge.cuongthai.com before your script published the TXT. What happens next?', 'Phép kiểm DNS-01 của Let\'s Encrypt hỏi _acme-challenge.cuongthai.com trước khi script của bạn công bố TXT. Chuyện gì xảy ra tiếp?'], ['Resolvers keep that NXDOMAIN up to 1800 s: publish and verify first', 'Let\'s Encrypt bypasses caches, so retrying immediately works', 'The TXT replaces the NXDOMAIN in every cache within seconds', 'Nothing happens: TXT records are never cached by resolvers'], ['The negative TTL of cuongthai.com is 1800 s (exercise 1). Order matters: create → dig @kyrie.ns.cloudflare.com → then ask the CA to check.', 'TTL âm của cuongthai.com là 1800 s (bài 1). Thứ tự quan trọng: tạo → dig @kyrie.ns.cloudflare.com → rồi mới bảo CA kiểm.']),
  ],
  goiY: [['Negative TTL = min(SOA TTL, SOA minimum).', 'TTL âm = min(TTL của SOA, minimum của SOA).'], ['Signed zones have NSEC records that cover ranges of names.', 'Vùng có ký có bản ghi NSEC phủ cả một dải tên.']],
  loi: [['Testing a new name through a resolver before creating it.', 'Thử một tên mới qua resolver trước khi tạo nó.'], ['Flushing one name in a signed zone and expecting it to work.', 'Xoá một tên trong vùng có ký và mong nó có tác dụng.']],
  tns: [tn('NXDOMAIN', 'tên không tồn tại'), tn('NSEC', 'bản ghi chứng minh không tồn tại'), tn('aggressive NSEC', 'dùng NSEC đã nhớ để trả lời "không có"')],
  kn: ['negative caching'],
});

/* ── 4. Cache trong ứng dụng, thread pool ── */
const E4 = cs({
  ten: 'TTL 4 — Caches inside your app, and Node\'s thread pool', kho: 'MEDIUM', phut: 14,
  en: `Five lookups one second apart from Java and from Node, counting the questions that left the laptop (lab/out/c33-app); then four lookups of names whose server never answers, plus a file read (c33-treo, c33-treo8):${pre([...APP, '', ...TREO, '', ...TREO8])}`,
  vi: `Năm lần tra cách nhau một giây từ Java và từ Node, đếm câu hỏi thật sự rời laptop (lab/out/c33-app); rồi bốn lần tra những tên mà máy chủ không bao giờ trả lời, cộng một lần đọc tệp (c33-treo, c33-treo8):${pre([...APP, '', ...TREO, '', ...TREO8])}`,
  cau: [
    q('c1', ['Java sent 2 DNS questions for 5 lookups, Node sent 5. Why?', 'Java gửi 2 câu hỏi DNS cho 5 lần tra, Node gửi 5. Vì sao?'], ['The JVM caches successful lookups (30 s by default); Node has no DNS cache', 'Java uses TCP and Node uses UDP', 'Node asks for IPv6 only', 'Java asks the authoritative server directly'], ['Java asked once (A + AAAA = 2 packets) and answered four times from memory in under 2 ms. Node calls getaddrinfo every time.', 'Java hỏi một lần (A + AAAA = 2 gói) và trả lời bốn lần từ bộ nhớ dưới 2 ms. Node gọi getaddrinfo mỗi lần.']),
    q('c2', ['A Java service still calls the old IP an hour after a DNS change. What is the likely setting?', 'Một dịch vụ Java vẫn gọi IP cũ một giờ sau khi đổi DNS. Cấu hình nào có khả năng nhất?'], ['networkaddress.cache.ttl=-1 (cache forever) in java.security', 'The default of 30 seconds', 'The DNS TTL of 300 s', 'Keep-alive disabled in the HTTP client'], ['-1 means "until restart", whatever DNS says. Set it explicitly in containers, for example 30–60.', '-1 nghĩa là "tới khi khởi động lại", bất kể DNS nói gì. Hãy đặt rõ trong container, ví dụ 30–60.']),
    q('c3', ['With the default pool, lookups ended at 10 s, 10 s, 20 s, 20 s. Why not all at 10 s?', 'Với pool mặc định, các lần tra kết thúc ở 10 s, 10 s, 20 s, 20 s. Vì sao không cùng ở 10 s?'], ['Slow work like getaddrinfo may use only half of the 4 threads', 'The resolver answers only two questions at a time', 'Node deliberately sends its DNS questions one by one', 'The second pair asked a different, slower server'], ['libuv caps "slow I/O" at (threads + 1) / 2 = 2 of 4, keeping room for file work — which is why readFile finished in 72 ms. With UV_THREADPOOL_SIZE=8, four lookups fit and all ended at 10 s.', 'libuv giới hạn "I/O chậm" ở (số luồng + 1) / 2 = 2 trên 4, chừa chỗ cho việc đọc tệp — vì thế readFile xong trong 72 ms. Với UV_THREADPOOL_SIZE=8, bốn lần tra lọt hết và cùng xong ở 10 s.']),
    q('c4', ['Where do the 10 s per lookup come from?', '10 s mỗi lần tra từ đâu ra?'], ['The stub gives up waiting on a resolver stuck on a dead server', 'Node\'s default HTTP timeout, applied to every lookup', 'The TTL of the dead.test records, counted down', 'The time the file read took to finish first'], ['The resolver keeps trying the dead server; the stub gives up (EAI_AGAIN = "try again"). Lesson 3.5 measures the resolver side: 20 s, then an instant SERVFAIL.', 'Resolver cứ thử máy chủ chết; stub bỏ cuộc (EAI_AGAIN = "thử lại sau"). Bài 3.5 đo phía resolver: 20 s, rồi SERVFAIL tức thì.']),
  ],
  goiY: [['Count the tshark lines: that is what really left the laptop.', 'Đếm dòng tshark: đó là thứ thật sự rời laptop.'], ['The thread pool has 4 threads, and slow work may take at most half of them.', 'Thread pool có 4 luồng, và việc chậm được dùng tối đa một nửa.']],
  loi: [['Assuming every runtime respects the DNS TTL.', 'Mặc định mọi runtime đều tôn trọng TTL của DNS.'], ['Blaming the event loop when lookups wait for the thread pool.', 'Đổ lỗi cho event loop khi các lần tra phải chờ thread pool.']],
  tns: [tn('getaddrinfo', 'hàm tra tên của hệ điều hành'), tn('libuv thread pool', 'nhóm luồng của Node'), tn('EAI_AGAIN', 'lỗi tra tên tạm thời')],
  kn: ['app-level DNS caching'],
});

/* ── 5. pollResolver(): mô phỏng cache, khớp bản ghi thật ── */
/** Resolver có cache: trả lời từng lượt hỏi, theo các lần đổi trên máy chủ có thẩm quyền. */
function pollResolver(changes, polls) {
  var sec = function (s) { var p = s.split(':').map(Number); return p[0] * 3600 + p[1] * 60 + p[2]; };
  var auth = function (t) {                                           // the record ns1 serves at second t
    var cur = null;
    changes.forEach(function (c) { if (sec(c.at) <= t) cur = c; });
    return cur;
  };
  var cache = null;                                                   // { ip, ttl, at }
  return polls.map(function (p) {
    var t = sec(p);
    if (!cache || t - cache.at > cache.ttl) {                         // empty, or expired (0 s left is still served)
      var r = auth(t);
      cache = { ip: r.ip, ttl: r.ttl, at: t };
    }
    return { at: p, ttl: cache.ttl - (t - cache.at), ip: cache.ip };
  });
}
const docTheo = (ds) => ds.map((d) => { const w = d.split(/\s+/); return { at: w[0], ttl: Number(w[2]), ip: w[3] }; });
const MOVE1 = [{ at: '00:00:00', ip: '203.0.113.10', ttl: 120 }, { at: HA, ip: '203.0.113.10', ttl: 10 }, { at: DOI, ip: '203.0.113.11', ttl: 10 }, { at: DOI2, ip: '203.0.113.10', ttl: 10 }];
const POLLS1 = docTheo(THEO).map((x) => x.at);
const MOVE2 = [{ at: '00:00:00', ip: '203.0.113.10', ttl: 120 }, { at: R3HA, ip: '203.0.113.10', ttl: 10 }, { at: R3DOI, ip: '203.0.113.11', ttl: 10 }];
const POLLS2 = docTheo(R3).map((x) => x.at);
if (JSON.stringify(pollResolver(MOVE1, POLLS1)) !== JSON.stringify(docTheo(THEO))) throw new Error('3.3: mô phỏng không khớp c33-theo-doc');
// Lab 3: khớp 34 dòng thật, trừ đúng một dòng lệch 1 s (lượt 17:19:50 thật ra chạy lúc ~17:19:50.9, đồng hồ in giây chẵn).
const LECH = pollResolver(MOVE2, POLLS2).map((x, i) => [x, docTheo(R3)[i]]).filter(([a, b]) => JSON.stringify(a) !== JSON.stringify(b));
if (LECH.length !== 1 || LECH[0][0].at !== '17:19:50' || LECH[0][0].ttl - LECH[0][1].ttl !== 1) throw new Error('3.3: mô phỏng không khớp lab3-r3');
const E5 = jsBai({
  ten: 'TTL 5 — Write pollResolver(): reproduce the real timeline', kho: 'HARD', phut: 30,
  en: `<p>Write a tiny caching resolver and check it against reality. The real poll of exercise 2 (lab/out/c33-theo-doc):</p>${pre(THEO)}
<p><code>pollResolver(changes, polls)</code>:</p>
<ul><li><code>changes</code> — what the authoritative server serves from a given moment, in time order: <code>[{ at: "HH:MM:SS", ip, ttl }]</code>;</li>
<li><code>polls</code> — the times a client asks the resolver, in order;</li>
<li>return one <code>{ at, ttl, ip }</code> per poll: <code>ttl</code> = the time left on the cached copy.</li></ul>
<p>Cache rules (Unbound's, as measured): the cache starts empty; on a poll, if there is no copy or the copy is <b>older than its TTL</b> (more than <code>ttl</code> seconds since it was fetched), fetch the record the authoritative server serves at that second; a copy with exactly <b>0 s</b> left is still served (Lab 3 shows "TTL 0"). Nothing else refreshes the cache.</p>
<p>The visible case feeds the real changes (${HA} TTL → 10, ${DOI} → .11, ${DOI2} → .10) and the real poll times; your output must equal the 13 real lines. The hidden case is the real Lab 3 timeline (5-s polls, TTL lowered at ${R3HA}, IP changed at ${R3DOI}) — 34 real lines including the "TTL 0" ones. The model matches all of them but one, by 1 s: the poll printed as 17:19:50 really ran at about 17:19:50.9 (the clock prints whole seconds), so the real resolver said 19 where whole-second arithmetic says 20. The checker expects the whole-second answer.</p>`,
  vi: `<p>Viết một resolver có cache tí hon rồi đối chiếu với thực tế. Lượt hỏi thật của bài 2 (lab/out/c33-theo-doc):</p>${pre(THEO)}
<p><code>pollResolver(changes, polls)</code>:</p>
<ul><li><code>changes</code> — thứ máy chủ có thẩm quyền phục vụ kể từ một thời điểm, theo thứ tự thời gian: <code>[{ at: "HH:MM:SS", ip, ttl }]</code>;</li>
<li><code>polls</code> — các thời điểm client hỏi resolver, theo thứ tự;</li>
<li>trả về mỗi lượt hỏi một <code>{ at, ttl, ip }</code>: <code>ttl</code> = thời gian còn lại của bản trong cache.</li></ul>
<p>Luật cache (của Unbound, như đã đo): cache ban đầu rỗng; ở mỗi lượt hỏi, nếu chưa có bản nào hoặc bản đó <b>đã quá TTL</b> (hơn <code>ttl</code> giây kể từ lúc lấy), lấy bản ghi mà máy chủ có thẩm quyền phục vụ ở giây đó; bản còn đúng <b>0 s</b> vẫn được trả (Lab 3 có "TTL 0"). Không có gì khác làm mới cache.</p>
<p>Ca hiện đưa vào các lần đổi thật (${HA} TTL → 10, ${DOI} → .11, ${DOI2} → .10) và các thời điểm hỏi thật; output phải bằng đúng 13 dòng thật. Ca ẩn là dòng thời gian thật của Lab 3 (hỏi 5 s một lần, hạ TTL lúc ${R3HA}, đổi IP lúc ${R3DOI}) — 34 dòng thật, có cả các dòng "TTL 0". Mô hình khớp tất cả trừ một dòng, lệch 1 s: lượt in là 17:19:50 thật ra chạy khoảng 17:19:50.9 (đồng hồ in giây chẵn), nên resolver thật nói 19 trong khi tính theo giây chẵn ra 20. Máy chấm chờ đáp án tính theo giây chẵn.</p>`,
  dauVao: ['changes — [{ at, ip, ttl }] in time order; polls — ["HH:MM:SS", …].', 'changes — [{ at, ip, ttl }] theo thứ tự thời gian; polls — ["HH:MM:SS", …].'],
  dauRa: ['[{ at, ttl, ip }], one per poll.', '[{ at, ttl, ip }], mỗi lượt hỏi một phần tử.'],
  goiY: [['Convert "HH:MM:SS" to seconds once; keep the cache as { ip, ttl, fetchedAt }.', 'Đổi "HH:MM:SS" ra giây một lần; giữ cache dạng { ip, ttl, fetchedAt }.'], ['The record served at second t is the last change whose time is ≤ t.', 'Bản ghi được phục vụ ở giây t là lần đổi cuối cùng có thời điểm ≤ t.']],
  loi: [['Refreshing when 0 s are left: Lab 3 shows a copy served with TTL 0.', 'Làm mới khi còn 0 s: Lab 3 cho thấy bản còn TTL 0 vẫn được trả.'], ['Applying a change to the cached copy immediately — caches do not hear about changes.', 'Áp lần đổi vào bản trong cache ngay lập tức — cache không hề nghe tin có đổi.']],
  gt: ['A cache is a pure function of when it fetched and what the server said at that moment: nothing pushes changes to it. That is why the model reproduces both real timelines exactly, and why "DNS propagation" is really "cache expiry" — the worst case is decided by the TTL already cached at the moment you change, not by the TTL you set.', 'Cache là một hàm thuần của lúc nó lấy về và thứ máy chủ nói ở lúc đó: không có gì đẩy thay đổi tới nó. Vì thế mô hình tái hiện chính xác cả hai dòng thời gian thật, và vì thế "DNS lan truyền" thật ra là "cache hết hạn" — trường hợp xấu nhất do TTL đã nằm trong cache lúc bạn đổi quyết định, không phải TTL bạn đặt.'],
  kn: ['TTL', 'cache expiry'],
  tns: [tn('fetch', 'lấy bản ghi từ máy chủ'), tn('expiry', 'hết hạn'), tn('propagation', 'lan truyền')],
  dau: `/** changes [{ at, ip, ttl }], polls ["HH:MM:SS"] ⇒ [{ at, ttl, ip }] */
function pollResolver(changes, polls) {
  // Write your solution here
  return [];
}
`,
  giai: nguon(pollResolver),
  cases: [
    { goi: goi('pollResolver', MOVE1, POLLS1), moTa: ['Real timeline of c33-theo-doc (13 lines)', 'Dòng thời gian thật của c33-theo-doc (13 dòng)'] },
    { goi: goi('pollResolver', [{ at: '10:00:00', ip: '192.0.2.1', ttl: 30 }], ['10:00:05', '10:00:20', '10:00:35', '10:00:36']), moTa: ['One record, TTL 30: served with 0 s left, refetched after', 'Một bản ghi, TTL 30: còn 0 s vẫn trả, quá hạn mới lấy lại'] },
    { goi: goi('pollResolver', MOVE2, POLLS2), an: true },
    { goi: goi('pollResolver', [{ at: '08:00:00', ip: '192.0.2.1', ttl: 3600 }, { at: '08:00:10', ip: '192.0.2.2', ttl: 60 }], ['08:00:05', '08:30:00', '09:00:05', '09:00:06', '09:01:06', '09:01:07']), an: true },
  ],
});

/* ── 6. negativeProbe(): cache âm ── */
/** Một máy thăm dò hỏi một tên trước khi nó được tạo: kết quả từng lượt, và lượt đầu tiên thấy được. */
function negativeProbe(o) {
  var w = o.soa.trim().split(/\s+/);                                   // name ttl IN SOA mname rname serial refresh retry expire minimum
  var neg = Math.min(Number(w[1]), Number(w[w.length - 1]));
  if (o.cap !== undefined) neg = Math.min(neg, o.cap);
  var cachedAt = null, firstOk = null;
  var results = o.probes.map(function (t) {
    if (cachedAt !== null && t - cachedAt <= neg) return 'NXDOMAIN';   // still remembered
    if (t >= o.createdAt) { if (firstOk === null) firstOk = t; cachedAt = null; return 'NOERROR'; }
    cachedAt = t;
    return 'NXDOMAIN';
  });
  return { negTtl: neg, results: results, firstOk: firstOk };
}
const SOA_LAB = 'labflow.test.		3600	IN	SOA	ns1.labflow.test. hostmaster.labflow.test. 2026110101 3600 600 1209600 300';
const SOA_CT = THAT.find((d) => /IN\s+SOA/.test(d));
const moi60 = (n) => Array.from({ length: n }, (_, i) => i * 60);
const E6 = jsBai({
  ten: 'TTL 6 — Write negativeProbe(): when does a new name become visible?', kho: 'MEDIUM', phut: 20,
  en: `<p>A monitoring probe (or a certificate tool) asks a resolver for a name every so often; the name is created at some second. Write <code>negativeProbe({ soa, probes, createdAt, cap })</code>:</p>
<ul><li><code>soa</code> — the zone's SOA record line as the authoritative server serves it (e.g. LabFlow's <code>${SOA_LAB.replace(/\t+/g, ' ')}</code>, or the real cuongthai.com one: <code>${SOA_CT.replace(/\t+/g, ' ')}</code>);</li>
<li>negative TTL = min(the SOA record's TTL — the 2nd word —, the SOA minimum — the last word —), and also ≤ <code>cap</code> if given (resolvers have a ceiling, e.g. Unbound's cache-max-negative-ttl);</li>
<li><code>probes</code> — seconds when the resolver is asked (ascending); <code>createdAt</code> — the second the record appears on the authoritative server;</li>
<li>at each probe: if the resolver holds a negative entry that is at most <code>negTtl</code> seconds old ⇒ <code>"NXDOMAIN"</code> (from cache); otherwise it asks: name exists (<code>t &gt;= createdAt</code>) ⇒ <code>"NOERROR"</code>, else <code>"NXDOMAIN"</code> and the entry is cached from <code>t</code>.</li></ul>
<p>Return <code>{ negTtl, results, firstOk }</code> — <code>firstOk</code> = the first probe second with NOERROR, or <code>null</code>. Real lesson case (lab/out/c33-am, c33-am2): asked at 0, created at 1, asked again at 2 ⇒ <code>{ negTtl: 300, results: ["NXDOMAIN", "NXDOMAIN"], firstOk: null }</code> — the resolver showed 298 s left.</p>`,
  vi: `<p>Một máy giám sát (hay công cụ cấp chứng chỉ) hỏi resolver một tên theo chu kỳ; tên được tạo ở một giây nào đó. Viết <code>negativeProbe({ soa, probes, createdAt, cap })</code>:</p>
<ul><li><code>soa</code> — dòng bản ghi SOA của vùng như máy chủ có thẩm quyền phục vụ (ví dụ của LabFlow <code>${SOA_LAB.replace(/\t+/g, ' ')}</code>, hoặc của cuongthai.com thật: <code>${SOA_CT.replace(/\t+/g, ' ')}</code>);</li>
<li>TTL âm = min(TTL của bản ghi SOA — chữ thứ 2 —, minimum của SOA — chữ cuối —), và ≤ <code>cap</code> nếu có (resolver có trần, ví dụ cache-max-negative-ttl của Unbound);</li>
<li><code>probes</code> — các giây resolver được hỏi (tăng dần); <code>createdAt</code> — giây bản ghi xuất hiện trên máy chủ có thẩm quyền;</li>
<li>ở mỗi lượt: nếu resolver đang giữ một mục âm chưa quá <code>negTtl</code> giây ⇒ <code>"NXDOMAIN"</code> (từ cache); ngược lại nó hỏi: tên đã có (<code>t &gt;= createdAt</code>) ⇒ <code>"NOERROR"</code>, chưa có ⇒ <code>"NXDOMAIN"</code> và mục được cache từ <code>t</code>.</li></ul>
<p>Trả <code>{ negTtl, results, firstOk }</code> — <code>firstOk</code> = giây đầu tiên có NOERROR, hoặc <code>null</code>. Ca thật của bài (lab/out/c33-am, c33-am2): hỏi lúc 0, tạo lúc 1, hỏi lại lúc 2 ⇒ <code>{ negTtl: 300, results: ["NXDOMAIN", "NXDOMAIN"], firstOk: null }</code> — resolver báo còn 298 s.</p>`,
  dauVao: ['{ soa, probes, createdAt, cap? }', '{ soa, probes, createdAt, cap? }'],
  dauRa: ['{ negTtl, results, firstOk }', '{ negTtl, results, firstOk }'],
  goiY: [['Split the SOA line on whitespace: word 2 is the record TTL, the last word is the minimum.', 'Tách dòng SOA theo khoảng trắng: chữ 2 là TTL của bản ghi, chữ cuối là minimum.'], ['Keep only one thing in memory: the second the negative entry was cached (or null).', 'Chỉ cần nhớ một thứ: giây mục âm được cache (hoặc null).']],
  loi: [['Using the SOA minimum alone and forgetting the SOA record\'s own TTL.', 'Chỉ dùng minimum của SOA mà quên TTL của chính bản ghi SOA.'], ['Re-caching on every NXDOMAIN served from cache — the clock does not restart.', 'Cache lại mỗi lần trả NXDOMAIN từ cache — đồng hồ không chạy lại từ đầu.']],
  gt: ['One early question is enough to hide a new name for the whole negative TTL: for cuongthai.com a record created 30 s after a probe stays invisible for 31 minutes. That is why the order "create, verify on the authoritative server, then let anyone query" matters, and why a shorter SOA minimum helps zones that create names often.', 'Chỉ một câu hỏi sớm là đủ giấu một tên mới suốt TTL âm: với cuongthai.com, bản ghi tạo 30 s sau một lượt thăm dò sẽ vô hình 31 phút. Vì thế thứ tự "tạo, kiểm trên máy chủ có thẩm quyền, rồi mới cho người khác hỏi" quan trọng, và vì thế SOA minimum ngắn hơn có ích cho vùng hay tạo tên mới.'],
  kn: ['negative caching'],
  tns: [tn('negative TTL', 'TTL âm'), tn('probe', 'lượt thăm dò'), tn('cache-max-negative-ttl', 'trần TTL âm của resolver')],
  dau: `/** { soa, probes, createdAt, cap? } ⇒ { negTtl, results, firstOk } */
function negativeProbe(o) {
  // Write your solution here
  return { negTtl: 0, results: [], firstOk: null };
}
`,
  giai: nguon(negativeProbe),
  cases: [
    { goi: goi('negativeProbe', { soa: SOA_LAB, probes: [0, 2], createdAt: 1 }), moTa: ['Real: the lesson\'s new.labflow.test', 'Thật: new.labflow.test của bài học'] },
    { goi: goi('negativeProbe', { soa: SOA_LAB, probes: [0, 2, 300, 301], createdAt: 1 }), moTa: ['Same zone: visible only after 300 s', 'Cùng vùng: chỉ thấy sau 300 s'] },
    { goi: goi('negativeProbe', { soa: SOA_CT, probes: moi60(40), createdAt: 30 }), an: true },
    { goi: goi('negativeProbe', { soa: SOA_CT, probes: moi60(40), createdAt: 30, cap: 900 }), an: true },
    { goi: goi('negativeProbe', { soa: 'example.org. 60 IN SOA ns1.example.org. h.example.org. 9 3600 600 1209600 3600', probes: [0, 30, 61, 200], createdAt: 100 }), an: true },
    { goi: goi('negativeProbe', { soa: SOA_LAB, probes: [5, 10], createdAt: 0 }), an: true },
  ],
});

export default doiDau({ slug: 'netdev-3-3-ttl-cache', ten: '3.3 TTL, caching and why DNS changes are slow', khoa: KHOA, baiHoc: 'netdev-3-3-ttl-cache', de: [E1, E2, E3, E4, E5, E6] });
