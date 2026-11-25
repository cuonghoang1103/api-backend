/**
 * 9.4 — Mã hoá, mã hoá theo trường và kiểm toán (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s09-4-ma-hoa'] (kịch bản demo/s09/s09-4-ma-hoa.txt; MongoDB 8.0.38 Community, Node 22 + mongodb 7.9.1 + mongodb-client-encryption 7.2.2).
 * Khối: 0 email/sđt đọc thẳng được trong tệp .wt · 1 "kẻ đứng giữa" (_demo/node/s09-nghe-len.mjs) thấy insert/0901000001 khi KHÔNG TLS · 2 tự làm CA (tls/tao-chung-chi.sh)
 * · 3 mongod 8.0 từ chối TLS thiếu tlsCAFile (SERVER-72839) · 4 requireTLS + tlsCAFile + tlsAllowConnectionsWithoutCertificates · 5 client không TLS bị đóng
 * · 6 --tls không CA ⇒ self-signed · 7 sai tên máy ⇒ altnames · 8 có TLS ⇒ kẻ đứng giữa không thấy chữ nào · 9 CSFLE tường minh (_demo/csfle/ma-hoa.mjs)
 * · 10 DBA thấy Binary subtype 6 · 11 Community không có auditLog · 12–15 profiler level 2 + filter làm vết "ai xoá gì" (user, client, appName; capped 1 MiB).
 * Khoá TLS/CA sinh lại mỗi lượt bằng tls/tao-chung-chi.sh — KHÔNG kéo ca.key/may-chu.* về repo. CMK "local" sinh ngẫu nhiên trong tiến trình (chỉ để lab).
 * Kiểm trùng: TLS tổng quát ở khoá networking/web-security (liên kết), ở đây chỉ phần MongoDB.
 * Nguồn GET kiểm 24/11/2026: MongoDB Docs configure-ssl, security-encryption-at-rest, csfle, queryable-encryption (equality, range, prefix/suffix/substring), auditing;
 * jira SERVER-72839 (thông báo lỗi chính máy chủ in ra).
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's09-4-ma-hoa';

const CSFLE = `// Trích _demo/csfle/ma-hoa.mjs — mã hoá TƯỜNG MINH (chạy được trên Community)
const kms = { local: { key: randomBytes(96) } };        // ✘ chỉ cho lab — production: CMK nằm trong KMS (AWS/Azure/GCP KMS, KMIP)
const ce = new ClientEncryption(client, { keyVaultNamespace: 'ch9_kms.__keyVault', kmsProviders: kms });
const dek = await ce.createDataKey('local', { keyAltNames: ['khach-pii'] });   // khoá dữ liệu, cất trong __keyVault ĐÃ bị CMK mã hoá

const XD = 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic';  // cùng đầu vào ⇒ cùng bản mã ⇒ tìm bằng nhau được
const NN = 'AEAD_AES_256_CBC_HMAC_SHA_512-Random';         // mỗi lần một bản mã ⇒ không tìm được, an toàn hơn
await kh.insertOne({ _id: 1, ten: 'An',
  sdt:  await ce.encrypt('0901000001',   { keyId: dek, algorithm: XD }),
  cccd: await ce.encrypt('046203001234', { keyId: dek, algorithm: NN }) });

// Client có khoá: tự GIẢI mã khi đọc (bypassAutoEncryption: chỉ giải mã tự động, mã hoá vẫn tường minh)
const coKhoa = new MongoClient(URI, { autoEncryption: { keyVaultNamespace: 'ch9_kms.__keyVault', kmsProviders: kms, bypassAutoEncryption: true } });
await coKhoa.db('ch9_pii').collection('khach').findOne({ sdt: await ce.encrypt('0901000002', { keyId: dek, algorithm: XD }) });`;

const VET = `// Vết nghiệp vụ trong chính ứng dụng — chạy được ở mọi bản MongoDB, ghi "ai, làm gì, trên cái gì, lúc nào, trước/sau"
async function ghiVet(session, { ai, viec, doiTuong, truoc, sau, ip }) {
  await db.collection('nhatKyKiemToan').insertOne(
    { luc: new Date(), ai, viec, doiTuong, truoc, sau, ip },
    { session });                                            // cùng transaction với thao tác chính (Bài 6.2): có cả hai hoặc không có gì
}
// User của API chỉ có quyền insert trên nhatKyKiemToan (không update/remove) ⇒ API bị chiếm cũng không xoá được dấu vết.`;

export default {
  title: '9.4 — Encryption, field-level encryption and auditing|||9.4 — Mã hoá, mã hoá theo trường và kiểm toán',
  slug: 'mgo-9-4-ma-hoa-kiem-toan',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Ba nơi dữ liệu bị đọc trộm và cách chặn từng nơi, chạy thật trên MongoDB 8.0 Community: trên ĐĨA (email, số điện thoại đọc thẳng được bằng grep trong tệp .wt — Community không có mã hoá lúc lưu, phải mã hoá ổ đĩa/bản sao lưu), trên ĐƯỜNG TRUYỀN (một proxy "kẻ đứng giữa" tí hon thấy nguyên lệnh insert và số điện thoại; bật requireTLS với CA tự làm thì không thấy chữ nào; các lỗi TLS hay gặp: thiếu tlsCAFile, chứng chỉ tự ký, sai tên máy) và ngay TRONG DATABASE (mã hoá theo trường phía client CSFLE: DBA chỉ thấy Binary subtype 6, Deterministic tìm được còn Random thì không, mất khoá chính hay xoá DEK là mất dữ liệu vĩnh viễn — crypto-shredding). Kiểm toán: auditLog chỉ có ở Enterprise/Atlas (Community báo "unrecognised option"); thay thế bằng profiler có bộ lọc ghi user + IP + appName, và nhật ký kiểm toán nghiệp vụ ghi trong cùng transaction.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Encryption, field-level encryption and auditing</h2>
<p class="lead">Authentication (Lesson 9.2) decides who may <em>ask</em> the server for data. But data also lives in places where nobody asks the server: in files on a disk, in bytes on a network cable, in a backup copied to someone's laptop. This lesson looks at each place on our lab — what an outsider actually sees there — and closes it: TLS on the wire, disk and backup encryption at rest, client-side field-level encryption for the few fields that even the DBA must not read. Then the question every security review ends with: <strong>can you show who did what?</strong></p>

<h3>An everyday picture: a letter</h3>
<p>A letter can be read in three places: in the mailbox (at rest), in the postman's bag (in transit), or by whoever opens it at the destination (in use). An envelope protects the bag. A locked mailbox protects the box. And if the letter is written in a code that only the intended reader knows, it is safe even when the mailbox, the bag and the sorting office are all compromised — that is field-level encryption. A logbook at the post office ("who signed for what, when") is auditing.</p>

<h3>1. At rest: what is in the data files</h3>
${lenh(K, 0)}
<p>Each collection is a WiredTiger file under <code>/data/db</code>. A plain <code>grep</code> on the file finds the customer's email and phone number — snappy compression (Lesson 1.4) is not encryption. Whoever gets that disk, a VM snapshot, or a copy of the Docker volume reads the data without ever talking to mongod, so authentication doesn't help. MongoDB Community has <strong>no built-in encryption at rest</strong>; the encrypted storage engine is part of Enterprise and Atlas (where it is on by default). In Community, encrypt below the database: LUKS/dm-crypt on Linux, encrypted cloud disks (EBS, Persistent Disk), BitLocker — and encrypt backups (Chapter 10), because <code>mongodump</code> output is plaintext BSON.</p>
${nguon('📘', 'MongoDB Docs — Encryption at Rest', 'WiredTiger encrypted storage engine (Enterprise), KMIP key management; filesystem/disk encryption alternatives', 'https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/')}

<h3>2. In transit: what a man in the middle sees</h3>
${lenh(K, 1)}
<p><code>s09-nghe-len.mjs</code> is a tiny TCP proxy that forwards traffic and prints any readable text it sees — exactly what someone on the same café Wi-Fi, a compromised machine on the same LAN, or a misconfigured cloud network could log. Without TLS, the MongoDB wire protocol carries the command name (<code>insert</code>), the database, the filter and the phone number <code>0901000001</code> in both directions. SCRAM (Lesson 9.2) protected the password, not the data that followed.</p>

<h3>3. Turning on TLS — and the errors you will meet</h3>
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
<p>The script makes a small internal CA and a server certificate whose Subject Alternative Names are <code>localhost</code>, <code>mgo-tls</code> and <code>127.0.0.1</code> — the names clients will use. MongoDB 8.0 refuses to start with only a certificate: "TLS without specifying a chain of trust is no longer supported" — you must give <code>--tlsCAFile</code>. Once a CA file is set, mongod also <em>requires client certificates</em> by default (mutual TLS); <code>--tlsAllowConnectionsWithoutCertificates</code> keeps password logins working. In production, x.509 client certificates are an option for services (Lesson 9.2 §7).</p>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
<p>Three errors you will see on real projects: a client without TLS simply has its connection closed; a client with TLS that doesn't trust our CA gets "self-signed certificate in certificate chain"; a client using a name that is not in the certificate gets "Hostname/IP does not match certificate's altnames". With the CA file and a matching name, it works — and the same proxy now sees no readable text at all.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>tlsAllowInvalidCertificates=true</code> to "make it work".</strong> It silences the second error by accepting <em>any</em> certificate, including one presented by an attacker in the middle: the connection is encrypted, to the wrong party. The fix is to give the client the CA (<code>tlsCAFile</code>) and to connect with a name that the certificate lists. On Atlas, the CA is a public one already trusted by every OS, which is why <code>mongodb+srv://</code> URIs need no extra file.</p>
</div>
${nguon('📘', 'MongoDB Docs — Configure mongod and mongos for TLS/SSL', 'requireTLS, tlsCertificateKeyFile, tlsCAFile, client certificates', 'https://www.mongodb.com/docs/manual/tutorial/configure-ssl/')}

<h3>4. In use: client-side field-level encryption (CSFLE)</h3>
<p>TLS and disk encryption protect data from outsiders. They do not protect it from anyone who can query the database: a DBA, a support engineer with read access, a stolen API credential, a backup restored on a test server. For a few fields — national ID numbers (CCCD), health data, bank details — the requirement is often "the database never sees the plaintext". The driver encrypts those fields <em>before</em> sending; the server stores only ciphertext.</p>
${ma('js', CSFLE)}
${lenh(K, 9)}
${lenh(K, 10)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">CMK (customer master key)</span><span class="lz-t">lives in a KMS, never in the database</span><span class="lz-d">here a random 96-byte "local" key — lab only</span></div>
  <div class="lz-step"><span class="lz-k">DEK (data encryption key)</span><span class="lz-t">stored in __keyVault, itself encrypted by the CMK</span><span class="lz-d">"envelope encryption": rotate the CMK without re-encrypting data</span></div>
  <div class="lz-step"><span class="lz-k">Deterministic</span><span class="lz-t">same input ⇒ same ciphertext</span><span class="lz-d">equality queries work; reveals which rows share a value</span></div>
  <div class="lz-step"><span class="lz-k">Random</span><span class="lz-t">new ciphertext every time</span><span class="lz-d">no queries; use for fields you never search by</span></div>
</div>
<p>Read the output from top to bottom. A normal client — the DBA, a backup — sees <code>Binary subtype 6</code> (82 and 98 bytes) and cannot find the phone number by its plaintext. A client with the key finds customer 2 by an encrypted phone number and gets plaintext back. Deterministic encryption produced identical ciphertexts; Random did not. With a different master key, decryption fails ("HMAC validation failure"). After deleting the DEK, the data is gone for everyone — this is <strong>crypto-shredding</strong>: to honour "delete my data", destroy that customer's key and every copy in every backup becomes unreadable.</p>
<p>What runs where matters for your project: <em>explicit</em> encryption (as above) works on Community; <em>automatic</em> encryption driven by a JSON schema needs Enterprise or Atlas. <strong>Queryable Encryption</strong>, the newer scheme, keeps fields encrypted while supporting equality and range queries (recent versions add prefix, suffix and substring) — design for it when you know you'll need to search encrypted fields. The cost is real: no sorting, no arbitrary aggregation on those fields, bigger documents, and losing the CMK means losing the data.</p>
${nguon('📘', 'MongoDB Docs — Client-Side Field Level Encryption', 'explicit vs automatic encryption, deterministic vs random, key vault, KMS providers', 'https://www.mongodb.com/docs/manual/core/csfle/')}
${nguon('📘', 'MongoDB Docs — Queryable Encryption', 'searchable encryption: equality, range, prefix, suffix, substring', 'https://www.mongodb.com/docs/manual/core/queryable-encryption/')}

<h3>5. Auditing: who did what</h3>
${lenh(K, 11)}
<p>MongoDB's built-in <code>auditLog</code> (every authentication, user change, DDL and optionally every CRUD operation, with the user and client IP) is an Enterprise/Atlas feature — the Community binary doesn't even know the option. On Community you combine three cheaper sources:</p>
${lenh(K, 12)}
${lenh(K, 13)}
${lenh(K, 14)}
${lenh(K, 15)}
<p>(1) The <strong>profiler</strong> with a filter: here only <code>remove</code> and <code>update</code> operations are recorded, each with the authenticated user (<code>ctshopApi@ctshop</code>), client IP, application name and the filter used. It is a capped collection of 1 MiB — old entries roll off — and it costs a write per operation, so keep the filter narrow and copy entries elsewhere if you need history. (2) The mongod <strong>log</strong>: authentication successes and failures with IP (Lesson 9.2 §5), shipped to a log system. (3) An <strong>application audit trail</strong> for business events — the most useful one in practice, because it records "who" as the end user, not the API account:</p>
${ma('js', VET)}
${nguon('📘', 'MongoDB Docs — Auditing', 'auditLog destinations, filters, events (Enterprise / Atlas)', 'https://www.mongodb.com/docs/manual/core/auditing/')}

<h3>🕵️ Attacker's view: the copy nobody watches</h3>
<p>Many large data leaks never touched the production database: they came from a backup in an open bucket, an old VM snapshot, a developer's dump on a laptop, a test server restored from production. Authentication protects none of those. Disk/backup encryption protects stolen media; CSFLE protects the most sensitive fields even in a stolen backup; and an audit trail is what lets you answer, afterwards, "which records did they read?" — often the question regulators and customers ask first.</p>

<h3>💼 On the job</h3>
<p>Foreign clients of outsourcing companies (Japan, Europe, the US) often send a security questionnaire before go-live: "Is data encrypted in transit? at rest? Which fields contain personal data and how are they protected? Can you produce access logs for 90 days?" Answers you can now give with evidence: TLS required (the log line "Ingress TLS handshake complete"), disk and backup encryption (cloud disk settings), CSFLE for CCCD and bank numbers with keys in the cloud KMS, profiler/app audit trail shipped to the log system with a retention policy. Writing "yes" without evidence is how projects fail audits.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"We enabled authentication. Is the data encrypted?"</strong> — No: authentication is about who may query. In transit needs TLS; at rest needs disk/storage encryption; in use needs CSFLE/Queryable Encryption.</li>
<li><strong>"Why not just use tlsAllowInvalidCertificates?"</strong> — It accepts any certificate, so a man in the middle can present his own; you get encryption to the attacker. Distribute the CA and use names in the certificate's SAN.</li>
<li><strong>"Deterministic or random field encryption?"</strong> — Deterministic if you must query by equality (phone, email), accepting that equal values are visible as equal; random for everything you never search by.</li>
<li><strong>"How do you implement 'right to be forgotten' when backups are immutable?"</strong> — Crypto-shredding: encrypt each subject's data with its own key; delete the key and the data in every backup becomes unreadable.</li>
<li><strong>"How do you know who deleted an order on Community edition?"</strong> — Profiler with a filter on remove/update (user, IP, appName), mongod logs, and an application audit collection written in the same transaction, insert-only for the API account.</li>
</ol>

<h3>🧪 Practice (45 minutes)</h3>
<div class="callout ok"><ol>
<li>Run <code>tls/tao-chung-chi.sh</code>, start <code>mgo-tls</code> as in §3 and connect from Node with <code>tls: true, tlsCAFile</code>. Then remove <code>tlsCAFile</code> from the client: which error do you get from the driver?</li>
<li>Run the proxy against the plain container and log in with a <em>password</em> (any auth container from 9.2). Does the password appear? Explain from §5 of Lesson 9.2.</li>
<li>Extend <code>ma-hoa.mjs</code>: add a field <code>soTaiKhoan</code> encrypted Random, and try to find a customer by it. What happens, and what would you do if the business needs that search?</li>
<li>Design the audit trail for "change order status" in CT Shop: fields, indexes, retention, and the role of the API account.</li>
</ol>
${loiGiai('Suggested answers', `<p>1. With the CA: connects. Without it: <code>MongoServerSelectionError</code> wrapping "self-signed certificate in certificate chain" — same as mongosh in §3.</p>
<p>2. No — SCRAM sends a salted proof, not the password. Measured on the lab: the proxy shows the user name (<code>admin.quantri</code>), the <code>saslStart</code>/<code>SCRAM-SHA-256</code>/<code>r=…</code> messages, then <code>insert</code> and the phone number in clear; the password string appears 0 times. That is why TLS is still required.</p>
<p>3. The search returns nothing — a plaintext value never equals random ciphertext, and encrypting the search value gives a different ciphertext each time. If the business must search by it: use Deterministic (accepting equality leakage), or Queryable Encryption, or a separate keyed hash (HMAC) of the value as a lookup field.</p>
<p>4. <code>{ luc, ai: { userId, ten }, viec: 'doi-trang-thai', doiTuong: { loai: 'don', id }, truoc: 'PAID', sau: 'SHIPPED', ip, requestId }</code>; index <code>{ 'doiTuong.id': 1, luc: -1 }</code> and <code>{ 'ai.userId': 1, luc: -1 }</code>; TTL or monthly archive per policy (e.g. 1 year); written in the same transaction; API role has insert only on this collection.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Encryption in transit / at rest / in use', 'On the network (TLS) / on disk and backups / even while stored and queried in the database (CSFLE, QE).'],
  ['requireTLS, tlsCAFile', 'Reject non-TLS connections; the CA used to verify certificates (required by mongod 8.0 with TLS).'],
  ['SAN (Subject Alternative Name)', 'Names/IPs a certificate is valid for; the client checks the host it dialled is listed.'],
  ['CSFLE', 'Client-side field-level encryption: the driver encrypts selected fields; the server stores BSON Binary subtype 6.'],
  ['CMK / DEK', 'Master key in a KMS / data keys in the key vault encrypted by the CMK (envelope encryption).'],
  ['Crypto-shredding', 'Deleting a key to make all data encrypted with it, in every copy, unreadable.'],
  ['auditLog vs profiler', 'Enterprise/Atlas audit system / Community profiler (capped system.profile) usable with a filter.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>Authentication is not encryption. Check three places: disk, wire, database.</li>
<li>Community stores plaintext in .wt files and dumps: encrypt disks and backups.</li>
<li>TLS: requireTLS + CA file; clients trust the CA and use a name in the SAN; never tlsAllowInvalidCertificates.</li>
<li>CSFLE for the few fields even the DBA must not read; deterministic for equality search, random otherwise; protect the CMK like the data itself.</li>
<li>Auditing on Community = filtered profiler + logs + an insert-only application audit trail.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Mã hoá, mã hoá theo trường và kiểm toán</h2>
<p class="lead">Xác thực (Bài 9.2) quyết định ai được <em>hỏi</em> máy chủ lấy dữ liệu. Nhưng dữ liệu còn nằm ở những nơi chẳng ai cần hỏi máy chủ: trong tệp trên ổ đĩa, trong byte chạy trên dây mạng, trong bản sao lưu bị chép về laptop của ai đó. Bài này xem từng nơi trên lab của ta: người ngoài thật sự thấy gì ở đó, rồi đóng từng chỗ lại. Đó là TLS trên đường truyền, mã hoá ổ đĩa và bản sao lưu khi lưu trữ, và mã hoá theo trường phía client cho vài trường mà đến DBA cũng không được đọc. Cuối cùng là câu hỏi mọi buổi soát bảo mật đều hỏi: <strong>bạn có chỉ ra được ai đã làm gì không?</strong></p>

<h3>Hình ảnh đời thường: một lá thư</h3>
<p>Một lá thư có thể bị đọc ở ba nơi: trong hộp thư (lúc lưu trữ), trong túi của bưu tá (trên đường đi), hoặc bởi người mở nó ở nơi nhận (lúc sử dụng). Phong bì bảo vệ chặng trong túi. Hộp thư có khoá bảo vệ chặng nằm trong hộp. Còn nếu lá thư được viết bằng mật mã chỉ người nhận đúng mới hiểu, thì nó vẫn an toàn kể cả khi hộp thư, túi thư và bưu cục đều bị chiếm. Đó là mã hoá theo trường. Cuốn sổ ở bưu cục ghi "ai ký nhận gì, lúc nào" chính là kiểm toán.</p>

<h3>1. Lúc lưu trữ: trong tệp dữ liệu có gì</h3>
${lenh(K, 0)}
<p>Mỗi collection là một tệp WiredTiger trong <code>/data/db</code>. Chỉ cần <code>grep</code> trên tệp là thấy email và số điện thoại của khách. Nén snappy (Bài 1.4) không phải mã hoá. Ai có được ổ đĩa, bản chụp máy ảo, hay một bản chép của Docker volume đều đọc được dữ liệu mà không cần nói chuyện với mongod, nên xác thực chẳng giúp gì. MongoDB Community <strong>không có sẵn mã hoá lúc lưu</strong>; bộ máy lưu trữ có mã hoá thuộc bản Enterprise và Atlas (Atlas bật sẵn). Với Community, hãy mã hoá ở tầng dưới database: LUKS/dm-crypt trên Linux, ổ đĩa đám mây có mã hoá (EBS, Persistent Disk), BitLocker. Và mã hoá cả bản sao lưu (Chương 10), vì output của <code>mongodump</code> là BSON dạng thô.</p>
${nguon('📘', 'MongoDB Docs — Encryption at Rest', 'bộ máy lưu trữ WiredTiger có mã hoá (Enterprise), quản lý khoá KMIP; phương án mã hoá hệ thống tệp/ổ đĩa', 'https://www.mongodb.com/docs/manual/core/security-encryption-at-rest/')}

<h3>2. Trên đường truyền: kẻ đứng giữa thấy gì</h3>
${lenh(K, 1)}
<p><code>s09-nghe-len.mjs</code> là một proxy TCP tí hon: chuyển tiếp lưu lượng và in ra mọi đoạn chữ đọc được. Đó đúng là thứ mà một người dùng chung Wi-Fi quán cà phê, một máy bị chiếm trong cùng mạng LAN, hay một mạng đám mây cấu hình sai có thể ghi lại. Không có TLS, giao thức của MongoDB mang theo tên lệnh (<code>insert</code>), tên database, bộ lọc và số điện thoại <code>0901000001</code> theo cả hai chiều. SCRAM (Bài 9.2) chỉ bảo vệ mật khẩu, không bảo vệ dữ liệu đi sau đó.</p>

<h3>3. Bật TLS — và những lỗi bạn sẽ gặp</h3>
${lenh(K, 2)}
${lenh(K, 3)}
${lenh(K, 4)}
<p>Script tạo một CA nội bộ nhỏ và một chứng chỉ máy chủ có Subject Alternative Name (SAN) là <code>localhost</code>, <code>mgo-tls</code> và <code>127.0.0.1</code>, tức các tên mà client sẽ dùng. MongoDB 8.0 không chịu khởi động nếu chỉ có chứng chỉ: "TLS without specifying a chain of trust is no longer supported", nên bạn phải đưa thêm <code>--tlsCAFile</code>. Khi đã có tệp CA, mongod mặc định <em>đòi luôn chứng chỉ của client</em> (TLS hai chiều). Tham số <code>--tlsAllowConnectionsWithoutCertificates</code> giữ cho đăng nhập bằng mật khẩu vẫn chạy. Ở production, chứng chỉ x.509 cho client là một lựa chọn cho các service (Bài 9.2 mục 7).</p>
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
<p>Ba lỗi bạn sẽ gặp ở dự án thật. Client không dùng TLS thì bị đóng kết nối. Client có TLS nhưng không tin CA của ta thì nhận "self-signed certificate in certificate chain". Client dùng một tên không có trong chứng chỉ thì nhận "Hostname/IP does not match certificate's altnames". Có tệp CA và đúng tên thì chạy được. Lúc này cũng chính proxy kia không đọc được chữ nào nữa.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — thêm <code>tlsAllowInvalidCertificates=true</code> cho "chạy được".</strong> Nó dập lỗi thứ hai bằng cách chấp nhận <em>mọi</em> chứng chỉ, kể cả chứng chỉ do kẻ đứng giữa đưa ra. Kết nối vẫn được mã hoá, nhưng là mã hoá với sai người. Cách sửa đúng là đưa CA cho client (<code>tlsCAFile</code>) và kết nối bằng một tên có trong chứng chỉ. Trên Atlas, CA là CA công cộng mà mọi hệ điều hành đã tin sẵn, vì thế URI <code>mongodb+srv://</code> không cần thêm tệp nào.</p>
</div>
${nguon('📘', 'MongoDB Docs — Configure mongod and mongos for TLS/SSL', 'requireTLS, tlsCertificateKeyFile, tlsCAFile, chứng chỉ client', 'https://www.mongodb.com/docs/manual/tutorial/configure-ssl/')}

<h3>4. Lúc sử dụng: mã hoá theo trường phía client (CSFLE)</h3>
<p>TLS và mã hoá ổ đĩa bảo vệ dữ liệu khỏi người ngoài. Chúng không bảo vệ dữ liệu khỏi bất kỳ ai truy vấn được database: một DBA, một kỹ sư hỗ trợ có quyền đọc, một thông tin đăng nhập API bị đánh cắp, hay một bản sao lưu khôi phục lên máy test. Với vài trường như số CCCD, dữ liệu sức khoẻ, thông tin ngân hàng, yêu cầu thường là "database không bao giờ thấy bản rõ". Driver mã hoá các trường đó <em>trước khi</em> gửi đi, và máy chủ chỉ lưu bản mã.</p>
${ma('js', CSFLE)}
${lenh(K, 9)}
${lenh(K, 10)}
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">CMK (khoá chính)</span><span class="lz-t">nằm trong KMS, không bao giờ nằm trong database</span><span class="lz-d">ở đây là khoá "local" 96 byte ngẫu nhiên — chỉ dùng cho lab</span></div>
  <div class="lz-step"><span class="lz-k">DEK (khoá dữ liệu)</span><span class="lz-t">cất trong __keyVault, bản thân nó đã bị CMK mã hoá</span><span class="lz-d">"mã hoá phong bì": đổi CMK mà không phải mã hoá lại dữ liệu</span></div>
  <div class="lz-step"><span class="lz-k">Deterministic</span><span class="lz-t">cùng đầu vào ⇒ cùng bản mã</span><span class="lz-d">tìm bằng nhau được; lộ việc hàng nào có cùng giá trị</span></div>
  <div class="lz-step"><span class="lz-k">Random</span><span class="lz-t">mỗi lần một bản mã mới</span><span class="lz-d">không tìm được; dùng cho trường không bao giờ dùng để tìm</span></div>
</div>
<p>Đọc output từ trên xuống. Client thường (DBA, bản sao lưu) chỉ thấy <code>Binary subtype 6</code> (82 và 98 byte), và không tìm được số điện thoại bằng bản rõ. Client có khoá tìm ra khách số 2 bằng số điện thoại đã mã hoá, và nhận lại bản rõ. Mã Deterministic cho hai bản mã giống hệt nhau, Random thì không. Dùng một khoá chính khác thì giải mã thất bại ("HMAC validation failure"). Sau khi xoá DEK, dữ liệu mất với tất cả mọi người. Đây gọi là <strong>crypto-shredding</strong>: muốn đáp ứng yêu cầu "xoá dữ liệu của tôi", chỉ cần huỷ khoá của khách đó, và mọi bản chép trong mọi bản sao lưu đều thành không đọc được.</p>
<p>Chạy được ở đâu là điều quan trọng với dự án của bạn. Mã hoá <em>tường minh</em> (như trên) chạy được trên Community. Mã hoá <em>tự động</em> theo một JSON schema thì cần Enterprise hoặc Atlas. <strong>Queryable Encryption</strong> là cơ chế mới hơn, giữ trường ở dạng mã hoá mà vẫn hỗ trợ tìm bằng nhau và tìm theo khoảng (bản gần đây thêm tiền tố, hậu tố và chuỗi con). Hãy thiết kế theo nó khi biết chắc mình cần tìm trên trường mã hoá. Cái giá là có thật: không sắp xếp được, không aggregation tuỳ ý trên các trường đó, tài liệu to hơn, và mất CMK là mất dữ liệu.</p>
${nguon('📘', 'MongoDB Docs — Client-Side Field Level Encryption', 'mã hoá tường minh vs tự động, deterministic vs random, key vault, nhà cung cấp KMS', 'https://www.mongodb.com/docs/manual/core/csfle/')}
${nguon('📘', 'MongoDB Docs — Queryable Encryption', 'mã hoá tìm kiếm được: bằng nhau, khoảng, tiền tố, hậu tố, chuỗi con', 'https://www.mongodb.com/docs/manual/core/queryable-encryption/')}

<h3>5. Kiểm toán: ai đã làm gì</h3>
${lenh(K, 11)}
<p><code>auditLog</code> có sẵn của MongoDB ghi mọi lần xác thực, mọi thay đổi user, mọi lệnh DDL và tuỳ chọn cả mọi thao tác CRUD, kèm user và IP của client. Nhưng đó là tính năng của Enterprise/Atlas: bản Community còn không biết tham số này là gì. Trên Community, ta ghép ba nguồn rẻ hơn:</p>
${lenh(K, 12)}
${lenh(K, 13)}
${lenh(K, 14)}
${lenh(K, 15)}
<p>(1) <strong>Profiler</strong> có bộ lọc: ở đây chỉ ghi các thao tác <code>remove</code> và <code>update</code>, mỗi dòng kèm user đã xác thực (<code>ctshopApi@ctshop</code>), IP client, tên ứng dụng và bộ lọc đã dùng. Đây là một capped collection 1 MiB, mục cũ sẽ bị đẩy ra. Mỗi thao tác tốn thêm một lần ghi, nên giữ bộ lọc thật hẹp, và chép các mục ra nơi khác nếu cần lưu lâu. (2) <strong>Log</strong> của mongod: các lần xác thực thành công và thất bại kèm IP (Bài 9.2 mục 5), đẩy về hệ thống log. (3) <strong>Nhật ký kiểm toán của ứng dụng</strong> cho các sự kiện nghiệp vụ. Thực tế đây là nguồn hữu ích nhất, vì nó ghi "ai" là người dùng cuối, chứ không phải tài khoản của API:</p>
${ma('js', VET)}
${nguon('📘', 'MongoDB Docs — Auditing', 'đích ghi auditLog, bộ lọc, các sự kiện (Enterprise / Atlas)', 'https://www.mongodb.com/docs/manual/core/auditing/')}

<h3>🕵️ Góc hacker: bản chép không ai trông</h3>
<p>Nhiều vụ lộ dữ liệu lớn chưa bao giờ chạm vào database production. Dữ liệu lộ ra từ một bản sao lưu trong bucket để mở, một bản chụp máy ảo cũ, một bản dump trên laptop của lập trình viên, hay một máy test khôi phục từ production. Xác thực không bảo vệ được chỗ nào trong số đó. Mã hoá ổ đĩa và bản sao lưu bảo vệ khi thiết bị bị lấy cắp. CSFLE bảo vệ các trường nhạy cảm nhất ngay cả trong bản sao lưu bị lấy cắp. Còn nhật ký kiểm toán là thứ giúp bạn trả lời, sau sự cố, câu "chúng đã đọc những bản ghi nào?". Đó thường là câu đầu tiên cơ quan quản lý và khách hàng hỏi.</p>

<h3>💼 Đi làm</h3>
<p>Khách nước ngoài của các công ty outsourcing (Nhật, châu Âu, Mỹ) hay gửi một bảng câu hỏi bảo mật trước ngày chạy thật: "Dữ liệu có mã hoá trên đường truyền không? Lúc lưu trữ thì sao? Trường nào chứa dữ liệu cá nhân và được bảo vệ thế nào? Có xuất được log truy cập 90 ngày không?". Giờ bạn trả lời được kèm bằng chứng: bắt buộc TLS (dòng log "Ingress TLS handshake complete"), mã hoá ổ đĩa và bản sao lưu (cấu hình ổ đĩa đám mây), CSFLE cho CCCD và số tài khoản với khoá đặt trong KMS của đám mây, profiler và nhật ký kiểm toán ứng dụng đẩy về hệ thống log có chính sách lưu giữ. Trả lời "có" mà không kèm bằng chứng là cách các dự án trượt kỳ kiểm tra.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Chúng tôi đã bật xác thực. Vậy dữ liệu đã được mã hoá chưa?"</strong> — Chưa. Xác thực là chuyện ai được truy vấn. Trên đường truyền cần TLS; lúc lưu cần mã hoá ổ đĩa/bộ lưu trữ; lúc sử dụng cần CSFLE hoặc Queryable Encryption.</li>
<li><strong>"Sao không dùng luôn tlsAllowInvalidCertificates?"</strong> — Nó chấp nhận mọi chứng chỉ, nên kẻ đứng giữa đưa chứng chỉ của hắn ra là xong; bạn được mã hoá, nhưng là mã hoá với kẻ tấn công. Hãy phân phát CA và dùng tên có trong SAN của chứng chỉ.</li>
<li><strong>"Mã hoá trường kiểu deterministic hay random?"</strong> — Deterministic nếu buộc phải tìm bằng nhau (số điện thoại, email), chấp nhận việc lộ ra các giá trị giống nhau; random cho mọi trường không bao giờ dùng để tìm.</li>
<li><strong>"Làm 'quyền được lãng quên' thế nào khi bản sao lưu không sửa được?"</strong> — Crypto-shredding: mã hoá dữ liệu của mỗi người bằng khoá riêng; xoá khoá là dữ liệu trong mọi bản sao lưu thành không đọc được.</li>
<li><strong>"Trên bản Community, làm sao biết ai đã xoá một đơn hàng?"</strong> — Profiler lọc remove/update (user, IP, appName), log của mongod, và một collection kiểm toán của ứng dụng ghi trong cùng transaction, tài khoản API chỉ có quyền insert vào đó.</li>
</ol>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>tls/tao-chung-chi.sh</code>, dựng <code>mgo-tls</code> như mục 3, rồi kết nối từ Node với <code>tls: true, tlsCAFile</code>. Sau đó bỏ <code>tlsCAFile</code> khỏi client: driver báo lỗi gì?</li>
<li>Chạy proxy trước một container không TLS, rồi đăng nhập bằng <em>mật khẩu</em> (dùng container có auth nào ở Bài 9.2 cũng được). Mật khẩu có hiện ra không? Giải thích bằng mục 5 của Bài 9.2.</li>
<li>Mở rộng <code>ma-hoa.mjs</code>: thêm trường <code>soTaiKhoan</code> mã hoá kiểu Random, rồi thử tìm khách theo trường đó. Chuyện gì xảy ra, và bạn làm gì nếu nghiệp vụ cần tìm như vậy?</li>
<li>Thiết kế nhật ký kiểm toán cho thao tác "đổi trạng thái đơn" của CT Shop: các trường, index, thời gian lưu giữ, và vai trò của tài khoản API.</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. Có CA thì kết nối được. Không có thì nhận <code>MongoServerSelectionError</code> bọc lỗi "self-signed certificate in certificate chain", giống mongosh ở mục 3.</p>
<p>2. Không. SCRAM gửi một bằng chứng có muối chứ không gửi mật khẩu. Đo thật trên lab: proxy thấy tên user (<code>admin.quantri</code>), các thông điệp <code>saslStart</code>/<code>SCRAM-SHA-256</code>/<code>r=…</code>, rồi thấy rõ <code>insert</code> và số điện thoại; chuỗi mật khẩu xuất hiện 0 lần. Vì vậy vẫn bắt buộc phải có TLS.</p>
<p>3. Không tìm ra gì: giá trị rõ không bao giờ bằng bản mã random, và mã hoá giá trị tìm kiếm cũng ra một bản mã khác mỗi lần. Nếu nghiệp vụ buộc phải tìm: dùng Deterministic (chấp nhận lộ phép so bằng), hoặc Queryable Encryption, hoặc thêm một trường tra cứu là giá trị băm có khoá (HMAC) của giá trị đó.</p>
<p>4. <code>{ luc, ai: { userId, ten }, viec: 'doi-trang-thai', doiTuong: { loai: 'don', id }, truoc: 'PAID', sau: 'SHIPPED', ip, requestId }</code>; index <code>{ 'doiTuong.id': 1, luc: -1 }</code> và <code>{ 'ai.userId': 1, luc: -1 }</code>; TTL hoặc lưu trữ theo tháng tuỳ chính sách (ví dụ 1 năm); ghi trong cùng transaction; vai trò API chỉ có quyền insert trên collection này.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Mã hoá trên đường truyền / lúc lưu / lúc sử dụng', 'Trên mạng (TLS) / trên đĩa và bản sao lưu / ngay cả khi đang lưu và được truy vấn trong database (CSFLE, QE).'],
  ['requireTLS, tlsCAFile', 'Từ chối kết nối không TLS; CA dùng để kiểm chứng chỉ (mongod 8.0 bắt buộc khi bật TLS).'],
  ['SAN (Subject Alternative Name)', 'Các tên/IP mà chứng chỉ hợp lệ; client kiểm tên máy mình gọi có trong danh sách không.'],
  ['CSFLE', 'Mã hoá theo trường phía client: driver mã hoá các trường được chọn; máy chủ lưu BSON Binary subtype 6.'],
  ['CMK / DEK', 'Khoá chính trong KMS / khoá dữ liệu trong key vault, được CMK mã hoá (mã hoá phong bì).'],
  ['Crypto-shredding', 'Xoá khoá để mọi dữ liệu mã hoá bằng nó, ở mọi bản chép, đều thành không đọc được.'],
  ['auditLog vs profiler', 'Hệ thống kiểm toán của Enterprise/Atlas / profiler của Community (capped system.profile) dùng kèm bộ lọc.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Xác thực không phải mã hoá. Soát ba nơi: đĩa, đường truyền, database.</li>
<li>Community lưu bản rõ trong tệp .wt và bản dump: mã hoá ổ đĩa và bản sao lưu.</li>
<li>TLS: requireTLS + tệp CA; client tin CA và dùng tên có trong SAN; không bao giờ dùng tlsAllowInvalidCertificates.</li>
<li>CSFLE cho vài trường đến DBA cũng không được đọc; deterministic khi cần tìm bằng nhau, còn lại random; giữ CMK cẩn thận như chính dữ liệu.</li>
<li>Kiểm toán trên Community = profiler có lọc + log + nhật ký kiểm toán ứng dụng chỉ-insert.</li>
</ul>
</div>
`,
};
