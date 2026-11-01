/** Networking for Developers · 3.5 — DNSSEC (chuỗi tin cậy thật, chữ ký hết hạn, secure/insecure/bogus), DoT/DoH trên dây, các kiểu hỏng (NS chết, một trong hai chết, tên miền hết hạn); tự viết rrsigStatus() và dnsVerdict(). */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre, ra } from './_net.mjs';

const tr = (ds) => ds.map((d) => d.replace(/\s+$/, ''));
const T = (tep) => tr(ra(tep).split('\n').slice(1)).filter((d) => d.trim());
const cat = (ds, n = 150) => ds.map((d) => (d.length > n ? `${d.slice(0, n - 3)}…` : d));
const CHUOI = T('c35-chuoi'), HONG = T('c35-hong'), BOGUS = T('c35-isp-bogus'), SUA1 = T('c35-sua-hoi'), SUA2 = T('c35-sua-hoi2');
const RIENG = T('c35-rieng-laptop'), RIENGDOC = T('c35-rieng-doc').filter((d) => !d.startsWith('$ tshark') && !d.startsWith('$'));
const DEAD = T('c35-dead').filter((d) => !d.startsWith('$')), INFRA = T('c35-isp-infra'), MOTNS = T('c35-mot-ns').filter((d) => !d.startsWith('$') && !d.startsWith('#')), HETHAN = T('c35-het-han'), THAT = T('c35-that');
const RRSIG = CHUOI.find((d) => /\tRRSIG\tA /.test(d));
const NOW = HONG.find((d) => /^\d{14}$/.test(d));
const HONG_WIN = /valid from (\d{14}) until (\d{14})/.exec(HONG.join('\n'));
if (!RRSIG || NOW !== '20261101102450' || !HONG_WIN || DEAD.length !== 7) throw new Error('3.5: output thật đổi');

/* ── 1. Chuỗi tin cậy ── */
const E1 = cs({
  ten: 'DNSSEC 1 — Read the real chain of trust', kho: 'MEDIUM', phut: 15,
  en: `labflow.test's chain, read from the bottom up (lab/out/c35-chuoi; long signatures cut):${pre(cat(CHUOI))}`,
  vi: `Chuỗi của labflow.test, đọc từ dưới lên (lab/out/c35-chuoi; chữ ký dài đã cắt):${pre(cat(CHUOI))}`,
  cau: [
    q('c1', ['In the RRSIG line "A 13 2 300 20261201102442 20261101092442 62671 labflow.test. …", what are the two long numbers?', 'Trong dòng RRSIG "A 13 2 300 20261201102442 20261101092442 62671 labflow.test. …", hai con số dài là gì?'], ['Expiration then inception of the signature, in UTC', 'Inception then expiration, in local time', 'The serials of the zone before and after signing', 'Two key tags of the keys that signed it'], ['Order: covered type, algorithm (13 = ECDSA P-256), labels, original TTL, EXPIRATION, INCEPTION, key tag, signer, signature. Here valid for 30 days; someone (or a job) must re-sign before the end.', 'Thứ tự: loại được ký, thuật toán (13 = ECDSA P-256), số nhãn, TTL gốc, HẾT HẠN, BẮT ĐẦU, key tag, người ký, chữ ký. Ở đây hiệu lực 30 ngày; ai đó (hoặc một tác vụ) phải ký lại trước khi hết.']),
    q('c2', ['DNSKEY 256 and DNSKEY 257: what is the difference?', 'DNSKEY 256 và DNSKEY 257: khác nhau gì?'], ['256 signs the records (ZSK); 257 signs the keys (KSK)', '256 is the old key, 257 the new one replacing it', '256 is used for IPv4 records, 257 for IPv6 ones', 'Their lengths: 256 bits and 257 bits'], ['The flags field: 257 has the SEP bit. Splitting the roles lets you change the ZSK often without touching the parent.', 'Trường flags: 257 có bit SEP. Tách vai trò giúp đổi ZSK thường xuyên mà không đụng tới vùng cha.']),
    q('c3', ['The DS at the TLD and the output of dnssec-dsfromkey are equal. What does that prove?', 'DS ở TLD và output của dnssec-dsfromkey bằng nhau. Điều đó chứng minh gì?'], ['The parent vouches for exactly the key that labflow.test publishes', 'The TLD and LabFlow use the same key', 'The zone was transferred correctly to ns2', 'The signature over the A record is valid'], ['DS = hash of the child\'s KSK, published and signed by the parent. Same key tag 30957, same digest — only the space dig inserts differs. Lab 3 breaks this link.', 'DS = băm của KSK vùng con, do vùng cha công bố và ký. Cùng key tag 30957, cùng digest — chỉ khác dấu cách dig chèn vào. Lab 3 làm gãy mắt xích này.']),
    q('c4', ['What anchors the whole chain?', 'Cái gì neo cả chuỗi?'], ['The trust anchor: the root key hash set in the validator', 'The TLD\'s DNSKEY, which every resolver downloads', 'The TLS certificate of the website itself', 'The SOA serial number of the root zone'], ['Everything else is checked; the anchor is trusted without proof. The real root has been signed since 15 July 2010.', 'Mọi thứ khác đều được kiểm; mỏ neo được tin mà không cần chứng minh. Gốc thật được ký từ 15/7/2010.']),
    q('c5', ['delv says "fully validated" for the CNAME and "unsigned answer" for labflow.cdn.test. Why?', 'delv nói "fully validated" cho CNAME và "unsigned answer" cho labflow.cdn.test. Vì sao?'], ['cdn.test has no DS: provably unsigned, which is allowed', 'The CDN\'s signatures expired a few days ago', 'delv cannot follow a CNAME into another zone', 'The CDN signs with a different algorithm'], ['Insecure ≠ bogus: there is a signed proof that no DS exists, so the validator accepts unsigned data for that zone.', 'Insecure ≠ bogus: có bằng chứng được ký rằng không có DS, nên bộ kiểm chấp nhận dữ liệu không ký cho vùng đó.']),
  ],
  goiY: [['RRSIG fields: type alg labels ttl expiration inception keytag signer signature.', 'Các trường RRSIG: type alg labels ttl expiration inception keytag signer signature.'], ['Each link: a signature checked with a key, or a key matched to the DS of the parent.', 'Mỗi mắt xích: một chữ ký kiểm bằng một khoá, hoặc một khoá khớp với DS của vùng cha.']],
  loi: [['Reading the expiration as the inception (expiration comes first).', 'Đọc hết hạn thành bắt đầu (hết hạn đứng trước).'], ['Thinking "unsigned" means broken.', 'Nghĩ "không ký" nghĩa là hỏng.']],
  tns: [tn('RRSIG', 'chữ ký của một bộ bản ghi'), tn('DNSKEY', 'khoá công khai của vùng'), tn('DS', 'băm khoá vùng con, ở vùng cha'), tn('trust anchor', 'mỏ neo tin cậy'), tn('KSK / ZSK', 'khoá ký khoá / khoá ký vùng')],
  kn: ['DNSSEC chain of trust'],
});

/* ── 2. Thứ tự ── */
const E2 = cs({
  ten: 'DNSSEC 2 — The order of the checks, and of the diagnosis', kho: 'MEDIUM', phut: 12, loai: 'order',
  en: `Use the chain of exercise 1 and the checklist of the lesson. Real symptoms of the expired-signature incident (lab/out/c35-hong):${pre(cat(HONG, 170))}`,
  vi: `Dùng chuỗi của bài 1 và danh sách kiểm của bài học. Triệu chứng thật của sự cố chữ ký hết hạn (lab/out/c35-hong):${pre(cat(HONG, 170))}`,
  cau: [
    ord('o1', ['Order the checks a validating resolver makes for labflow.test A, starting from what it already trusts.', 'Xếp các bước kiểm mà resolver kiểm DNSSEC làm cho labflow.test A, bắt đầu từ thứ nó đã tin.'], [
      'The root DNSKEY matches the trust anchor',
      'The DS for test. is signed by the root',
      'test.\'s DNSKEY matches that DS; the DS for labflow.test is signed by test.',
      'labflow.test\'s KSK (257) matches that DS and signs the DNSKEY set',
      'The ZSK (256) verifies the RRSIG over the A record',
    ], ['Top-down from the anchor, one link per level. Fail at any step ⇒ bogus ⇒ SERVFAIL; a missing DS at some step (provably) ⇒ insecure from there down.', 'Từ mỏ neo đi xuống, mỗi cấp một mắt xích. Hỏng ở bước nào ⇒ bogus ⇒ SERVFAIL; thiếu DS (có chứng minh) ở bước nào ⇒ insecure từ đó trở xuống.']),
    ord('o2', ['"Works on my machine, not on yours": order the six checks of the lesson.', '"Máy tôi chạy, máy bạn không": xếp sáu bước kiểm của bài học.'], [
      'What the app gets: getent ahosts name (hosts file, search domains)',
      'Which resolver: resolv.conf, resolvectl status',
      'Each resolver: dig name @resolver (old answer? TTL counting?)',
      'The truth: dig name @ns1 / @ns2 + SOA serial',
      'DNSSEC: compare with +cd and read the EDE',
      'Delegation: dig +trace (NXDOMAIN at the TLD, a slow hop)',
    ], ['From the app outward: first what the program really sees, then each layer that could hold a different answer, until the authoritative servers and the delegation above them.', 'Từ ứng dụng ra ngoài: trước hết thứ chương trình thật sự thấy, rồi từng lớp có thể giữ câu trả lời khác, tới máy chủ có thẩm quyền và ủy quyền phía trên chúng.']),
    ord('o3', ['Order the fix of the expired-signature incident.', 'Xếp các bước sửa sự cố chữ ký hết hạn.'], [
      'Confirm: SERVFAIL without +cd, the address with +cd, EDE 7',
      'Re-sign the zone correctly and bump the serial so ns2 copies it',
      'Check the new RRSIG window on the authoritative server',
      'Wait for (or flush) the bogus cache on resolvers — about 60 s on Unbound',
      'Add monitoring: alert when signatures expire in less than 7 days',
    ], ['Diagnose before touching, fix at the source, verify on the authoritative server, then remember the caches. The last step is what kiem-dns.sh does in Lab 3.', 'Chẩn đoán trước khi động vào, sửa tận gốc, kiểm trên máy chủ có thẩm quyền, rồi nhớ tới cache. Bước cuối là việc kiem-dns.sh làm trong Lab 3.']),
  ],
  goiY: [['A validator starts from the only thing it trusts — the root anchor.', 'Bộ kiểm bắt đầu từ thứ duy nhất nó tin — mỏ neo gốc.'], ['Diagnosis goes from the app outward.', 'Chẩn đoán đi từ ứng dụng ra ngoài.']],
  loi: [['Fixing the zone without bumping the serial: ns2 keeps the bad signatures.', 'Sửa vùng mà không tăng serial: ns2 giữ chữ ký hỏng.'], ['Declaring victory while resolvers still serve the cached bogus answer.', 'Tuyên bố xong trong khi resolver còn trả câu bogus đã cache.']],
  tns: [tn('validation', 'kiểm chứng chữ ký'), tn('+cd (checking disabled)', 'tắt kiểm DNSSEC'), tn('EDE', 'mã lỗi mở rộng')],
  kn: ['DNSSEC validation', 'DNS troubleshooting'],
});

/* ── 3. secure / insecure / bogus ── */
const TT = ['secure', 'insecure', 'bogus'];
const KQ = ['answer with ad', 'answer without ad', 'SERVFAIL'];
const CO = ['yes', 'no'];
const E3 = cs({
  ten: 'DNSSEC 3 — Secure, insecure or bogus?', kho: 'MEDIUM', phut: 14, loai: 'table',
  en: `Lab and real Internet (lab/out/c35-hong, c35-isp-bogus, c35-sua-hoi, c35-sua-hoi2, c35-that):${pre([...cat(HONG, 170), '# after re-signing correctly', ...SUA1, '# on the ISP resolver', ...BOGUS, '# laptop', ...SUA2, '', '# real Internet', ...cat(THAT, 170)])}`,
  vi: `Lab và Internet thật (lab/out/c35-hong, c35-isp-bogus, c35-sua-hoi, c35-sua-hoi2, c35-that):${pre([...cat(HONG, 170), '# sau khi ký lại đúng', ...SUA1, '# trên resolver nhà mạng', ...BOGUS, '# laptop', ...SUA2, '', '# Internet thật', ...cat(THAT, 170)])}`,
  bang: [bang1('b1', ['Classify each name, as seen through a validating resolver', 'Phân loại từng tên, nhìn qua một resolver có kiểm DNSSEC'], [{ ma: 'x', ten: 'Name (moment)' }, { ma: 's', ten: 'State', luaChon: TT }, { ma: 'r', ten: 'Validating resolver returns', luaChon: KQ }, { ma: 'c', ten: 'Does +cd return the address?', luaChon: CO }, { ma: 'e', ten: 'EDE code (or none)' }], [
    { o: { x: 'labflow.test (signatures expired)' }, a: { s: 'bogus', r: 'SERVFAIL', c: 'yes', e: ['7'] } },
    { o: { x: 'labflow.test (after re-signing + flush)' }, a: { s: 'secure', r: 'answer with ad', c: 'yes', e: ['none', '-', '—'] } },
    { o: { x: 'cloudflare.com' }, a: { s: 'secure', r: 'answer with ad', c: 'yes', e: ['none', '-', '—'] } },
    { o: { x: 'dnssec-failed.org' }, a: { s: 'bogus', r: 'SERVFAIL', c: 'yes', e: ['9'] } },
    { o: { x: 'cuongthai.com' }, a: { s: 'insecure', r: 'answer without ad', c: 'yes', e: ['none', '-', '—'] } },
  ], ['+cd always returns the data — DNSSEC never deletes records, it only refuses to vouch for them. "Works with +cd, fails without" is the signature of a DNSSEC problem. EDE 7 = Signature Expired, EDE 9 = DNSKEY Missing (the DS points to a key that is not published). cuongthai.com has no DS: insecure, answered without ad. Right after the fix the resolver still had the bogus result cached (val-bogus-ttl 60 s).', '+cd luôn trả dữ liệu — DNSSEC không bao giờ xoá bản ghi, nó chỉ từ chối bảo lãnh. "Chạy với +cd, hỏng khi không có" là dấu hiệu của sự cố DNSSEC. EDE 7 = Signature Expired, EDE 9 = DNSKEY Missing (DS trỏ tới một khoá không được công bố). cuongthai.com không có DS: insecure, trả lời không có ad. Ngay sau khi sửa, resolver vẫn còn cache kết quả bogus (val-bogus-ttl 60 s).'])],
  goiY: [['ad flag = secure; SERVFAIL that disappears with +cd = bogus; no DS = insecure.', 'Cờ ad = secure; SERVFAIL biến mất khi có +cd = bogus; không có DS = insecure.'], ['The EDE number is printed right after "EDE:".', 'Số EDE in ngay sau "EDE:".']],
  loi: [['Calling an unsigned domain "broken".', 'Gọi tên miền không ký là "hỏng".'], ['Concluding "the server is down" from a SERVFAIL without trying +cd.', 'Kết luận "máy chủ chết" từ một SERVFAIL mà không thử +cd.']],
  tns: [tn('secure / insecure / bogus', 'an toàn / không ký / hỏng'), tn('val-bogus-ttl', 'thời gian nhớ kết quả bogus'), tn('ad flag', 'cờ đã xác thực')],
  kn: ['DNSSEC states'],
});

/* ── 4. DoT/DoH và các kiểu hỏng ── */
const E4 = cs({
  ten: 'DNSSEC 4 — Encrypted DNS, and three failures you will meet', kho: 'MEDIUM', phut: 15,
  en: `Real output (lab/out/c35-rieng-laptop, c35-rieng-doc, c35-dead, c35-isp-infra, c35-mot-ns, c35-het-han):${pre(['# the same question three ways', ...RIENG, '# what the home router saw', ...RIENGDOC, '', '# dead.test: its only name server never answers; 7 new names, 20 s limit', ...DEAD, '# on the ISP resolver', ...cat(INFRA, 170), '', '# ns2 stopped: query time per round (cache and server memory flushed each time)', ...MOTNS, '', '# an expired domain', ...HETHAN])}`,
  vi: `Output thật (lab/out/c35-rieng-laptop, c35-rieng-doc, c35-dead, c35-isp-infra, c35-mot-ns, c35-het-han):${pre(['# cùng một câu hỏi theo ba cách', ...RIENG, '# thứ router nhà nhìn thấy', ...RIENGDOC, '', '# dead.test: máy chủ tên duy nhất không bao giờ trả lời; 7 tên mới, giới hạn 20 s', ...DEAD, '# trên resolver nhà mạng', ...cat(INFRA, 170), '', '# ns2 đã tắt: thời gian mỗi vòng (mỗi lần đều xoá cache và trí nhớ về máy chủ)', ...MOTNS, '', '# một tên miền hết hạn', ...HETHAN])}`,
  cau: [
    q('c1', ['What can someone on the path (ISP, café Wi-Fi) still learn from the DoT and DoH queries?', 'Người đứng giữa đường (nhà mạng, Wi-Fi quán cà phê) vẫn biết được gì từ các câu hỏi DoT và DoH?'], ['That you talk to that resolver, on port 853 or 443, and the sizes — not the names', 'The names, because DNS is never encrypted', 'Nothing at all, not even the resolver\'s address', 'The answers, but not the questions'], ['Plain DNS showed "query name: labflow.test". DoT/DoH show only a TLS hello and encrypted bytes. DoH on 443 looks like any HTTPS. The resolver itself still sees everything — and TLS does not prove the answer is genuine: that is DNSSEC\'s job.', 'DNS thường hiện "query name: labflow.test". DoT/DoH chỉ hiện TLS hello và byte đã mã hoá. DoH trên 443 trông như mọi HTTPS khác. Chính resolver vẫn thấy hết — và TLS không chứng minh câu trả lời là thật: đó là việc của DNSSEC.']),
    q('c2', ['The first three users waited 20 s and got nothing; the next ones got SERVFAIL in 0.0 s. Why the change?', 'Ba người đầu chờ 20 s và không nhận gì; những người sau nhận SERVFAIL trong 0,0 s. Vì sao thay đổi?'], ['The resolver now remembers .99 as dead and fails at once', 'The name server came back to life and refused the queries', 'The laptop cached the failure for later queries', 'dig switched to TCP after three failures'], ['dump_infra: rto 24064 ms, "ttl 840" left of infra-host-ttl 900. A dead name server first makes users hang, then fail fast — both look like "the site is down".', 'dump_infra: rto 24064 ms, "ttl 840" còn lại của infra-host-ttl 900. Máy chủ tên chết lúc đầu làm người dùng treo, rồi hỏng nhanh — cả hai đều trông như "trang chết".']),
    q('c3', ['With ns2 stopped, some rounds took ~380 ms or ~1.1 s and others 1–2 ms. What happens?', 'Khi ns2 đã tắt, có vòng mất ~380 ms hay ~1,1 s, có vòng 1–2 ms. Chuyện gì xảy ra?'], ['Trying ns2 first costs a timeout before ns1 answers', 'ns1 is overloaded on every second round', 'The laptop retries every second query it sends', 'The TTL of api changes between rounds'], ['A second name server keeps the domain up, but a dead one still costs latency until resolvers learn to avoid it. That is "slow, sometimes" — Lab 3\'s incident A.', 'Máy chủ tên thứ hai giữ tên miền sống, nhưng máy chết vẫn tốn độ trễ cho tới khi resolver biết tránh nó. Đó là "chậm, lúc có lúc không" — sự cố A của Lab 3.']),
    q('c4', ['www.oldshop.test returns NXDOMAIN and the TLD sends its own SOA. What happened to the domain?', 'www.oldshop.test trả NXDOMAIN và TLD gửi SOA của chính nó. Tên miền đã ra sao?'], ['It expired: the TLD no longer delegates it', 'Its two name servers are down', 'Its DNSSEC signatures expired yesterday', 'The ISP\'s resolver blocked the domain'], ['+trace stops at the TLD: no NS for oldshop.test any more. Nothing on your servers can fix it — renew the domain (and set auto-renew).', '+trace dừng ở TLD: không còn NS cho oldshop.test. Không gì trên máy chủ của bạn sửa được — gia hạn tên miền (và bật tự gia hạn).']),
  ],
  goiY: [['DoT = TLS on 853, DoH = HTTPS on 443.', 'DoT = TLS trên 853, DoH = HTTPS trên 443.'], ['Resolvers remember which name servers do not answer (the infra cache).', 'Resolver nhớ máy chủ tên nào không trả lời (cache hạ tầng).']],
  loi: [['Believing DoH makes answers trustworthy.', 'Tin rằng DoH làm câu trả lời đáng tin.'], ['Debugging a "random" slowness without asking each name server directly.', 'Gỡ một sự chậm "ngẫu nhiên" mà không hỏi thẳng từng máy chủ tên.']],
  tns: [tn('DoT / DoH', 'DNS qua TLS / qua HTTPS'), tn('infra cache', 'cache hạ tầng của resolver'), tn('lame / dead name server', 'máy chủ tên hỏng / chết'), tn('domain expiry', 'tên miền hết hạn')],
  kn: ['encrypted DNS', 'DNS failure modes'],
});

/* ── 5. rrsigStatus() ── */
/** Dòng RRSIG (output dig) + giờ UTC "YYYYMMDDHHMMSS" (+ độ lệch đồng hồ cho phép, giây) ⇒ trạng thái chữ ký. */
function rrsigStatus(line, nowUtc, skew) {
  var w = String(line).trim().split(/\s+/);
  var i = w.indexOf('RRSIG');
  var t = function (s) { return Date.UTC(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8), +s.slice(8, 10), +s.slice(10, 12), +s.slice(12, 14)) / 1000; };
  var exp = t(w[i + 5]), inc = t(w[i + 6]), now = t(nowUtc), k = skew || 0;
  var status = now > exp + k ? 'expired' : (now < inc - k ? 'not yet valid' : 'valid');
  return {
    covers: w[i + 1], algorithm: Number(w[i + 2]), keyTag: Number(w[i + 7]), signer: w[i + 8],
    inception: w[i + 6], expiration: w[i + 5],
    status: status,
    daysLeft: Math.round((exp - now) / 86400 * 10) / 10,
  };
}
// Bản hết hạn: DỰNG lại dòng RRSIG từ đúng các trường thật mà c35-hong in ra (valid from … until …), phần còn lại lấy từ c35-chuoi.
const RRSIG_HONG = RRSIG.replace(/\t(A 13 2 300) \d{14} \d{14} /, `\t$1 ${HONG_WIN[2]} ${HONG_WIN[1]} `);
const CF = THAT.find((d) => /\tRRSIG\t/.test(d));
const E5 = jsBai({
  ten: 'DNSSEC 5 — Write rrsigStatus(): is this signature still valid?', kho: 'MEDIUM', phut: 22,
  en: `<p>The incident of the lesson in one function. A real RRSIG (lab/out/c35-chuoi) and the real moment of the incident (<code>date -u</code> in c35-hong: <code>${NOW}</code>):</p>${pre(cat([RRSIG], 200))}
<p>Write <code>rrsigStatus(line, nowUtc, skew)</code>. <code>line</code> is a dig answer line of type RRSIG; after the word <code>RRSIG</code> come: covered type, algorithm, labels, original TTL, <b>expiration</b>, <b>inception</b>, key tag, signer, signature. Times are UTC <code>YYYYMMDDHHMMSS</code>. Return:</p>
<pre>{ covers, algorithm, keyTag, signer, inception, expiration, status, daysLeft }</pre>
<ul><li><code>algorithm</code> and <code>keyTag</code> are numbers; inception/expiration stay strings;</li>
<li><code>status</code>: <code>"expired"</code> if now &gt; expiration + skew, <code>"not yet valid"</code> if now &lt; inception − skew, else <code>"valid"</code> (<code>skew</code> in seconds, default 0 — Unbound allows up to 86 400);</li>
<li><code>daysLeft</code> = (expiration − now) in days, one decimal, negative when past.</li></ul>
<p>Hidden cases: the incident's signature (expired two days before, rebuilt from the real fields c35-hong printed), the real cloudflare.com signature, and the one-day-skew trap the lesson describes.</p>`,
  vi: `<p>Sự cố của bài học gói trong một hàm. Một RRSIG thật (lab/out/c35-chuoi) và thời điểm thật của sự cố (<code>date -u</code> trong c35-hong: <code>${NOW}</code>):</p>${pre(cat([RRSIG], 200))}
<p>Viết <code>rrsigStatus(line, nowUtc, skew)</code>. <code>line</code> là một dòng trả lời dig loại RRSIG; sau chữ <code>RRSIG</code> lần lượt là: loại được ký, thuật toán, số nhãn, TTL gốc, <b>hết hạn</b>, <b>bắt đầu</b>, key tag, người ký, chữ ký. Thời gian là UTC <code>YYYYMMDDHHMMSS</code>. Trả về:</p>
<pre>{ covers, algorithm, keyTag, signer, inception, expiration, status, daysLeft }</pre>
<ul><li><code>algorithm</code> và <code>keyTag</code> là số; inception/expiration giữ dạng chuỗi;</li>
<li><code>status</code>: <code>"expired"</code> nếu now &gt; expiration + skew, <code>"not yet valid"</code> nếu now &lt; inception − skew, ngược lại <code>"valid"</code> (<code>skew</code> tính bằng giây, mặc định 0 — Unbound cho tới 86 400);</li>
<li><code>daysLeft</code> = (expiration − now) tính bằng ngày, một chữ số thập phân, âm khi đã qua.</li></ul>
<p>Ca ẩn: chữ ký của sự cố (hết hạn hai ngày trước, dựng lại từ đúng các trường thật c35-hong in ra), chữ ký thật của cloudflare.com, và cái bẫy lệch đồng hồ một ngày mà bài học kể.</p>`,
  dauVao: ['line — an RRSIG answer line; nowUtc — "YYYYMMDDHHMMSS"; skew — seconds (optional).', 'line — dòng trả lời RRSIG; nowUtc — "YYYYMMDDHHMMSS"; skew — giây (tuỳ chọn).'],
  dauRa: ['{ covers, algorithm, keyTag, signer, inception, expiration, status, daysLeft }', '{ covers, algorithm, keyTag, signer, inception, expiration, status, daysLeft }'],
  goiY: [['Find the index of the word "RRSIG" and count from there: the line may start with a name and TTL of any width.', 'Tìm vị trí chữ "RRSIG" rồi đếm từ đó: dòng có thể bắt đầu bằng tên và TTL dài ngắn tuỳ ý.'], ['Date.UTC(year, month − 1, day, h, m, s) gives milliseconds; divide by 1000.', 'Date.UTC(năm, tháng − 1, ngày, giờ, phút, giây) cho mili giây; chia 1000.']],
  loi: [['Swapping expiration and inception (expiration comes first).', 'Đảo hết hạn với bắt đầu (hết hạn đứng trước).'], ['Parsing the time as local time with new Date(…): use UTC.', 'Đọc thời gian theo giờ máy với new Date(…): phải dùng UTC.'], ['Forgetting the skew on the inception side.', 'Quên độ lệch ở phía bắt đầu.']],
  gt: ['A DNSSEC zone carries an expiry date on every record set; if the signing job dies, the zone breaks on a schedule, for everyone behind a validating resolver, while servers and network look healthy. Checking "days left" on the authoritative server is the cheapest monitor there is — Lab 3\'s checker alerts below 7 days. The skew explains why validators fail a little after the written date.', 'Vùng DNSSEC mang một ngày hết hạn trên mỗi bộ bản ghi; nếu tác vụ ký chết, vùng hỏng đúng hẹn, với mọi người đứng sau resolver có kiểm DNSSEC, trong khi máy chủ và mạng vẫn khoẻ. Kiểm "còn bao nhiêu ngày" trên máy chủ có thẩm quyền là cách giám sát rẻ nhất — bộ kiểm của Lab 3 báo động khi dưới 7 ngày. Độ lệch giải thích vì sao bộ kiểm hỏng muộn hơn ngày ghi một chút.'],
  kn: ['RRSIG validity', 'monitoring'],
  tns: [tn('inception / expiration', 'thời điểm bắt đầu / hết hạn'), tn('clock skew', 'độ lệch đồng hồ'), tn('re-signing', 'ký lại')],
  dau: `/** RRSIG line + "YYYYMMDDHHMMSS" (+ skew seconds) ⇒ { covers, algorithm, keyTag, signer, inception, expiration, status, daysLeft } */
function rrsigStatus(line, nowUtc, skew) {
  // Write your solution here
  return { status: 'valid' };
}
`,
  giai: nguon(rrsigStatus),
  cases: [
    { goi: goi('rrsigStatus', RRSIG, NOW), moTa: ['Real: a fresh signature at the moment of the incident', 'Thật: chữ ký mới ở thời điểm sự cố'] },
    { goi: goi('rrsigStatus', RRSIG, '20261201102442'), moTa: ['Same signature, exactly at its expiration second', 'Cùng chữ ký, đúng giây hết hạn'] },
    { goi: goi('rrsigStatus', RRSIG_HONG, NOW), an: true },
    { goi: goi('rrsigStatus', RRSIG_HONG, '20261031000000', 86400), an: true },
    { goi: goi('rrsigStatus', RRSIG_HONG, NOW, 86400), an: true },
    { goi: goi('rrsigStatus', CF, NOW), an: true },
    { goi: goi('rrsigStatus', RRSIG, '20261101080000', 3600), an: true },
  ],
});

/* ── 6. dnsVerdict() ── */
/** Output dig (không +cd) và output dig +cd +short ⇒ trạng thái, EDE và nguyên nhân sơ bộ. */
function dnsVerdict(plain, cdShort) {
  var txt = String(plain);
  var st = /status: ([A-Z]+)/.exec(txt);
  var e = /EDE: (\d+) \(([^)]+)\)/.exec(txt);
  var timedOut = /timed out|no servers could be reached/.test(txt);
  var cdAddr = String(cdShort || '').split('\n').some(function (l) { return /^\d{1,3}(\.\d{1,3}){3}$|^[0-9a-f:]+:[0-9a-f:]*$/i.test(l.trim()); });
  var status = st ? st[1] : null;
  var cause;
  if (!status) cause = timedOut ? 'unreachable' : 'unknown';
  else if (status === 'NOERROR') cause = 'ok';
  else if (status === 'NXDOMAIN') cause = 'no such name';
  else if (status === 'SERVFAIL') cause = cdAddr ? 'dnssec' : 'server failure';
  else cause = 'other';
  return { status: status, ede: e ? { code: Number(e[1]), name: e[2] } : null, cause: cause };
}
const HONG_PLAIN = HONG.slice(1, 3).join('\n');
const HONG_CD = HONG[4];
const DF = THAT.filter((d) => /status|EDE/.test(d) && !d.startsWith('$')).join('\n');
const DF_CD = THAT[THAT.findIndex((d) => d.startsWith('$ dig +cd +short dnssec-failed.org')) + 1];
const R5 = T('lab3-r5-laptop');
const R5_PLAIN = R5.slice(1, 3).join('\n');
const R5_CD = R5[4];
const TIMEOUT = T('lab3-r4-laptop').filter((d) => !d.startsWith('$') && /timed out|no servers/.test(d)).join('\n');
const HET = T('c35-het-han').filter((d) => !d.startsWith('$') && /status/.test(d)).join('\n');
if (!/SERVFAIL/.test(HONG_PLAIN) || HONG_CD !== '203.0.113.10' || !/EDE: 9/.test(DF) || !/^\d/.test(DF_CD) || !/EDE: 6/.test(R5_PLAIN) || !TIMEOUT) throw new Error('3.5: dữ liệu dnsVerdict đổi');
const E6 = jsBai({
  ten: 'DNSSEC 6 — Write dnsVerdict(): is it DNSSEC, the name, or the server?', kho: 'MEDIUM', phut: 22,
  en: `<p>The fastest triage of a DNS failure needs two commands: <code>dig name</code> and <code>dig +cd +short name</code>. Real outputs (lab/out/c35-hong):</p>${pre(['$ dig labflow.test | grep -E \'status|EDE\'', ...HONG.slice(1, 3), '$ dig +cd +short labflow.test', HONG_CD])}
<p>Write <code>dnsVerdict(plain, cdShort)</code> returning <code>{ status, ede, cause }</code>:</p>
<ul><li><code>status</code> — the word after <code>status:</code>, or <code>null</code> if there is none;</li>
<li><code>ede</code> — from a line like <code>; EDE: 7 (Signature Expired): …</code> ⇒ <code>{ code: 7, name: "Signature Expired" }</code>, else <code>null</code>;</li>
<li><code>cause</code> — <code>"ok"</code> for NOERROR, <code>"no such name"</code> for NXDOMAIN, for SERVFAIL <code>"dnssec"</code> when <code>cdShort</code> contains an IP address on a line of its own and <code>"server failure"</code> otherwise; with no status, <code>"unreachable"</code> if the text says "timed out" or "no servers could be reached", else <code>"unknown"</code>; any other status ⇒ <code>"other"</code>.</li></ul>
<p>Hidden cases, all real: dnssec-failed.org through 1.1.1.1 (EDE 9), Lab 3's incident B (EDE 6, DS ≠ key), a dead ns3 that times out, the expired domain oldshop.test, and a SERVFAIL whose +cd answer is empty.</p>`,
  vi: `<p>Phân loại nhanh nhất một lỗi DNS cần hai lệnh: <code>dig name</code> và <code>dig +cd +short name</code>. Output thật (lab/out/c35-hong):</p>${pre(['$ dig labflow.test | grep -E \'status|EDE\'', ...HONG.slice(1, 3), '$ dig +cd +short labflow.test', HONG_CD])}
<p>Viết <code>dnsVerdict(plain, cdShort)</code> trả về <code>{ status, ede, cause }</code>:</p>
<ul><li><code>status</code> — chữ sau <code>status:</code>, hoặc <code>null</code> nếu không có;</li>
<li><code>ede</code> — từ dòng dạng <code>; EDE: 7 (Signature Expired): …</code> ⇒ <code>{ code: 7, name: "Signature Expired" }</code>, ngược lại <code>null</code>;</li>
<li><code>cause</code> — <code>"ok"</code> với NOERROR, <code>"no such name"</code> với NXDOMAIN, với SERVFAIL là <code>"dnssec"</code> khi <code>cdShort</code> có một địa chỉ IP đứng riêng một dòng và <code>"server failure"</code> nếu không; không có status thì <code>"unreachable"</code> nếu chữ có "timed out" hoặc "no servers could be reached", ngược lại <code>"unknown"</code>; status khác ⇒ <code>"other"</code>.</li></ul>
<p>Ca ẩn, đều là thật: dnssec-failed.org qua 1.1.1.1 (EDE 9), sự cố B của Lab 3 (EDE 6, DS ≠ khoá), ns3 chết bị hết giờ, tên miền hết hạn oldshop.test, và một SERVFAIL mà câu trả lời +cd rỗng.</p>`,
  dauVao: ['plain — dig output (any part of it); cdShort — dig +cd +short output.', 'plain — output dig (một phần cũng được); cdShort — output dig +cd +short.'],
  dauRa: ['{ status, ede, cause }', '{ status, ede, cause }'],
  goiY: [['Two regular expressions do most of the work: /status: ([A-Z]+)/ and /EDE: (\\d+) \\(([^)]+)\\)/.', 'Hai biểu thức chính quy làm gần hết việc: /status: ([A-Z]+)/ và /EDE: (\\d+) \\(([^)]+)\\)/.'], ['+cd +short prints one answer per line; a line that is an address means the data exists.', '+cd +short in mỗi câu trả lời một dòng; dòng là địa chỉ nghĩa là dữ liệu có tồn tại.']],
  loi: [['Calling every SERVFAIL "the server is down".', 'Gọi mọi SERVFAIL là "máy chủ chết".'], ['Reading the EDE text after the first colon as the name: the name is inside the parentheses.', 'Đọc chữ EDE sau dấu hai chấm đầu thành tên: tên nằm trong ngoặc tròn.']],
  gt: ['SERVFAIL hides very different problems. The +cd comparison splits them in one step: if the data comes back with checking disabled, the records exist and the failure is validation — a signature, a key or a DS — not the server, the network or the name. EDE then names the exact link that broke. That is steps 5 and 6 of the lesson\'s checklist as code.', 'SERVFAIL che những vấn đề rất khác nhau. Phép so +cd tách chúng trong một bước: nếu dữ liệu trả về khi tắt kiểm, bản ghi có tồn tại và cái hỏng là khâu kiểm — chữ ký, khoá hay DS — chứ không phải máy chủ, mạng hay tên. EDE sau đó gọi tên chính xác mắt xích đã gãy. Đó là bước 5 và 6 trong danh sách kiểm của bài học, viết thành mã.'],
  kn: ['DNS troubleshooting'],
  tns: [tn('SERVFAIL', 'máy chủ không trả lời được'), tn('EDE 6 / 7 / 9', 'DNSSEC Bogus / Signature Expired / DNSKEY Missing'), tn('triage', 'phân loại nhanh')],
  dau: `/** dig output + dig +cd +short output ⇒ { status, ede, cause } */
function dnsVerdict(plain, cdShort) {
  // Write your solution here
  return { status: null, ede: null, cause: 'unknown' };
}
`,
  giai: nguon(dnsVerdict),
  cases: [
    { goi: goi('dnsVerdict', HONG_PLAIN, HONG_CD), moTa: ['Real: the expired signatures', 'Thật: chữ ký hết hạn'] },
    { goi: goi('dnsVerdict', SUA2.filter((d) => !d.startsWith('$')).join('\n'), '203.0.113.10'), moTa: ['Real: after the fix', 'Thật: sau khi sửa'] },
    { goi: goi('dnsVerdict', DF, DF_CD), an: true },
    { goi: goi('dnsVerdict', R5_PLAIN, R5_CD), an: true },
    { goi: goi('dnsVerdict', TIMEOUT, ''), an: true },
    { goi: goi('dnsVerdict', HET, ''), an: true },
    { goi: goi('dnsVerdict', DEAD[3], ''), an: true },
  ],
});

export default doiDau({ slug: 'netdev-3-5-dns-an-toan', ten: '3.5 DNSSEC, DoH/DoT and DNS failure modes', khoa: KHOA, baiHoc: 'netdev-3-5-dns-an-toan', de: [E1, E2, E3, E4, E5, E6] });
