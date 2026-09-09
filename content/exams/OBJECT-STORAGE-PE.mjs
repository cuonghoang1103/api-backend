/**
 * Object Storage — Practical Exam (PE): 5 câu thực hành, mỗi câu 2 điểm.
 *
 * Đề tự soạn, bám sát `content/courses/object-storage/s00…s10`. Khác đề FE (50
 * câu trắc nghiệm, đọc transcript), đề này bắt VIẾT HIỆN VẬT: một bộ ký SigV4
 * và một hàm tải lên dùng đúng URL đã ký, một chính sách bucket cộng CORS ở
 * phạm vi tối thiểu kèm bộ đối soát của chính nó, một lượt multipart chịu được
 * đứt giữa chừng, một bộ quy tắc vòng đời cộng phép tính chi phí, và một bộ
 * chẩn đoán "tải lên xanh mà ảnh vẫn 403".
 *
 * ⚠️ CẢ NĂM CÂU ĐỀU CHẠY ĐƯỢC BẰNG NODE THUẦN, và `scripts/exam-check.mjs`
 * chạy thật cả năm `sampleSolution` rồi so từng byte với `expectedOutput`.
 * KHÔNG câu nào khai `khongChayDuoc` — không câu nào cần mạng, cần tham số
 * dòng lệnh, hay cần `node_modules`. Sân đo cho các câu 1–3 là một máy chủ giả
 * viết trong chính phần đề cho sẵn, và hành vi của nó đã được đối chiếu với
 * một máy chủ S3-compatible SỐNG (xem phần đo bên dưới).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ĐÃ ĐO THẬT NHỮNG GÌ, TRÊN CÁI GÌ
 * ─────────────────────────────────────────────────────────────────────────────
 *   MinIO           RELEASE.2025-09-07T16-13-09Z (go1.24.6, linux/arm64)
 *   @aws-sdk/client-s3            3.1071.0
 *   @aws-sdk/s3-request-presigner 3.1071.0
 *   Node v22.21.0, darwin-arm64, Docker Engine 29.5.3
 *   docker run -d -p 19000:9000 minio/minio server /data
 *
 *  • Câu 1 — chính thuật toán trong `sampleSolution` đã ký một URL với mốc
 *    thời gian HIỆN TẠI rồi PUT thật lên MinIO: gửi đúng `Content-Type:
 *    image/jpeg` thì **200** kèm `ETag "816d87a2afb9612558a638b9d6f45da1"`;
 *    gửi `text/html` lên đúng URL đó thì **403 SignatureDoesNotMatch**. Key
 *    dùng để đo có dấu cách (`users/42/anh dai dien.jpg`) nên nó kiểm luôn
 *    phần mã hoá đường dẫn. Chữ ký trong `expectedOutput` là mốc thời gian
 *    CỐ ĐỊNH `20260901T000000Z` để kết quả tất định.
 *    ⚠️ Chữ ký viết tay KHÔNG trùng chữ ký của `getSignedUrl` cho cùng dữ
 *    liệu vào — đo thật: SDK còn nhét thêm `X-Amz-Content-Sha256`,
 *    `x-amz-checksum-crc32`, `x-amz-sdk-checksum-algorithm` và `x-id` vào
 *    canonical query, nên canonical request khác đi. Cả hai URL đều được máy
 *    chủ chấp nhận. Bộ chấm vì thế chấm theo MÁY CHỦ, không theo SDK.
 *
 *  • Câu 2 — sáu phán quyết của bộ đối soát đã được đối chiếu với sáu lượt
 *    curl ẩn danh thật lên MinIO sau khi nạp đúng chính sách trong đáp án:
 *    `cong-khai/logo.png` **200** · `rieng-tu/hoa-don.pdf` **403** ·
 *    `cong-khai-rieng/logo.png` **403** · `?list-type=2` **403** ·
 *    PUT `cong-khai/xam.png` **403** · DELETE `cong-khai/logo.png` **403**.
 *
 *  • Câu 3 — kho giả trong phần đề cho sẵn sinh ra ETag TRÙNG TỪNG BYTE với
 *    MinIO trên cùng 12 MiB dữ liệu: part 1 `"c2af139a70acc342b4a2c2bf761d712a"`,
 *    part 2 `"8140e8a13cb3389c39f9c9983367879e"`, part 3
 *    `"d763cd3126ce08c68f649705b5eecea7"`, ETag cuối
 *    `"e075f8a7513c211a87f50176e486a1e0-3"`, `ContentLength` 12582912.
 *    Quy tắc "mọi phần trừ phần cuối phải ≥ 5 MiB" cũng đo thật: hoàn tất một
 *    lượt có phần đầu 1 MiB trả **400 EntityTooSmall** kèm nguyên văn
 *    "Your proposed upload is smaller than the minimum allowed object size."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ NHỮNG CHỖ CHỈ DỰA VÀO TÀI LIỆU, CHƯA ĐO ĐƯỢC
 * ─────────────────────────────────────────────────────────────────────────────
 *   – Bảng giá trong câu 4 (lưu trữ 0,015 $/GB-tháng, Class A 4,50 $/triệu,
 *     Class B 0,36 $/triệu) là giá công bố của R2 theo giáo trình. KHÔNG đo
 *     được, nên câu 4 chỉ bắt làm SỐ HỌC trên chính bảng giá đề đưa ra.
 *   – Nhịp quét lifecycle 24–48 giờ của R2: theo tài liệu.
 *   – MinIO TỪ CHỐI một lifecycle rule chỉ có `AbortIncompleteMultipartUpload`
 *     (`InvalidArgument: The XML you provided was not well-formed…`) và chỉ
 *     nhận khi rule đi kèm `Expiration`; theo tài liệu AWS/Cloudflare thì rule
 *     chỉ-abort là hợp lệ. Nên câu 4 KHÔNG nạp rule lên máy chủ nào — nó tính
 *     hiệu lực của rule ngay trong tiến trình, và điều đó đo được tất định.
 *   – MinIO không cài đặt CORS theo bucket (`GetBucketCors` trả 501
 *     NotImplemented) và preflight của nó VỌNG LẠI mọi origin/method được hỏi.
 *     Nên phần CORS của câu 2 KHÔNG kiểm chứng được trên máy chủ; nó được
 *     chấm bằng chính bộ đối soát mà thí sinh viết ra.
 *
 * ⛔ KHÔNG chạm tới bucket R2 thật của dự án. Container MinIO đã `docker rm -f`
 * sau khi đo xong.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/OBJECT-STORAGE-PE.mjs --apply
 */
import { B, c, code, codeQ, rubric } from './_lib/objectstorage-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>How to take this exam.</b></p>' +
  '<ol>' +
  '<li>Create five folders named <code>Q1 … Q5</code>. Each question names the exact file it wants inside its folder and shows a <b>Starter</b> block — copy it in <b>verbatim</b> and write your answer only between the two <code>ĐỀ CHO SẴN</code> markers. Everything above and below those markers is part of the grading; changing it is how you fail a question you actually solved.</li>' +
  '<li>Every file is plain CommonJS and runs with <code>node Qn/&lt;file&gt;.cjs</code> — <b>no npm install, no SDK, no network</b>. The standard library is all you need, and <code>node:crypto</code> is all you need of it. Questions 1 to 3 run against a fake S3 server written into the starter block whose behaviour was checked byte for byte against a real S3-compatible server.</li>' +
  '<li><b>Run everything before you submit.</b> Each question prints a fixed transcript and the "expected output" block is that transcript exactly. A single character out of place is a failed question, so diff it rather than eyeballing it.</li>' +
  '<li>Zip the five folders into <b>one .zip</b> and upload it in the submit box.</li>' +
  '</ol>' +
  '<p><b>How it is graded.</b> Output first — a program that prints something else cannot pass. But this is a storage exam, so the <b>shape</b> of the artifact is graded too: a signature that commits to the wrong set of headers, a policy that grants one action more than it needs, an upload that re-sends a part the server already has, a prefix filter without its trailing slash, or a diagnosis that reads the status code instead of the XML body all cost marks <em>even when the printed output matches</em>. Several questions are written so that a wrong-but-plausible implementation produces the right answer for one case and the wrong one for another — read every line of the transcript, not just the last.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Cách làm bài thi.</b></p>' +
  '<ol>' +
  '<li>Tạo năm thư mục tên <code>Q1 … Q5</code>. Mỗi câu ghi rõ file nào phải nằm trong thư mục của nó và có một khối <b>Mã cho sẵn</b> — chép <b>nguyên văn</b> vào rồi chỉ viết lời giải ở vùng giữa hai mốc <code>ĐỀ CHO SẴN</code>. Mọi thứ nằm trên và dưới hai mốc đó đều là một phần của việc chấm; sửa chúng là cách trượt một câu mà bạn thật ra đã làm được.</li>' +
  '<li>Mọi file đều là CommonJS thuần và chạy bằng <code>node Qn/&lt;tên file&gt;.cjs</code> — <b>không npm install, không SDK, không mạng</b>. Thư viện chuẩn là đủ, và trong đó chỉ cần <code>node:crypto</code>. Câu 1 tới 3 chạy trên một máy chủ S3 giả viết sẵn trong khối mã cho sẵn, mà hành vi của nó đã được đối chiếu từng byte với một máy chủ S3-compatible thật.</li>' +
  '<li><b>Chạy thử mọi thứ trước khi nộp.</b> Mỗi câu in ra một đoạn transcript cố định và khối "kết quả mong đợi" chính là đoạn transcript đó, không sai một chữ. Lệch một ký tự là trượt câu đó, nên hãy diff chứ đừng nhìn bằng mắt.</li>' +
  '<li>Nén năm thư mục thành <b>một file .zip</b> rồi tải lên ô nộp bài.</li>' +
  '</ol>' +
  '<p><b>Chấm thế nào.</b> Kết quả in ra trước — một chương trình in ra thứ khác thì không thể qua. Nhưng đây là bài thi về lưu trữ, nên <b>hình dạng</b> của hiện vật cũng bị chấm: một chữ ký cam kết sai bộ header, một chính sách cấp thừa một hành động, một lượt tải lên gửi lại một phần mà máy chủ vốn đã có, một tiền tố lọc thiếu dấu gạch chéo cuối, hay một chẩn đoán đọc mã trạng thái thay vì đọc khối XML — tất cả đều bị trừ điểm <em>ngay cả khi kết quả in ra khớp</em>. Nhiều câu được viết sao cho một cách cài đặt sai-mà-nghe-hợp-lý sẽ ra đáp án đúng ở ca này và sai ở ca khác — hãy đọc từng dòng của transcript chứ đừng chỉ đọc dòng cuối.</p>' +
  '</div>';

const Q1_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q1/ky-url.cjs — ky mot URL PUT SigV4 bang node:crypto, khong dung SDK.\n' +
  'const crypto = require(\'node:crypto\');\n' +
  '\n' +
  'const THONG_SO = {\n' +
  '  accessKeyId:     \'dethiuser\',\n' +
  '  secretAccessKey: \'dethipass123\',\n' +
  '  region:          \'us-east-1\',\n' +
  '  host:            \'127.0.0.1:19000\',\n' +
  '  bucket:          \'de-thi\',\n' +
  '};\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'const kq = kyUrlTaiLen({\n' +
  '  key: \'users/42/anh dai dien.jpg\',\n' +
  '  contentType: \'image/jpeg\',\n' +
  '  hanGiay: 600,\n' +
  '  mocThoiGian: \'20260901T000000Z\',\n' +
  '});\n' +
  'console.log(\'--- CanonicalRequest ---\');\n' +
  'console.log(kq.yeuCauChuan.replace(/\\n/g, \'\\\\n\'));\n' +
  'console.log(\'--- StringToSign ---\');\n' +
  'console.log(kq.chuoiDeKy.replace(/\\n/g, \'\\\\n\'));\n' +
  'console.log(\'--- Signature ---\');\n' +
  'console.log(kq.chuKy);\n' +
  'console.log(\'--- SignedHeaders ---\');\n' +
  'console.log(kq.headerDuocKy);\n' +
  'console.log(\'--- URL ---\');\n' +
  'console.log(kq.url);\n' +
  'console.log(\'--- typeof taiLen ---\');\n' +
  'console.log(typeof taiLen);\n';

const Q1_SOLUTION =
  'const bam = (d) => crypto.createHash(\'sha256\').update(d).digest(\'hex\');\n' +
  'const km = (k, d) => crypto.createHmac(\'sha256\', k).update(d).digest();\n' +
  '\n' +
  'const maHoa = (s) => encodeURIComponent(s)\n' +
  '  .replace(/[!\'()*]/g, (ch) => \'%\' + ch.charCodeAt(0).toString(16).toUpperCase());\n' +
  'const maHoaKey = (k) => k.split(\'/\').map(maHoa).join(\'/\');\n' +
  '\n' +
  'function kyUrlTaiLen({ key, contentType, hanGiay, mocThoiGian }) {\n' +
  '  const c = THONG_SO;\n' +
  '  const ngay = mocThoiGian.slice(0, 8);\n' +
  '  const pham = `${ngay}/${c.region}/s3/aws4_request`;\n' +
  '\n' +
  '  // Chi ky DUNG hai header: host va content-type. Bo content-type di la\n' +
  '  // nguoi tai len doi duoc kieu noi dung ma chu ky van hop le.\n' +
  '  const headerDuocKy = \'content-type;host\';\n' +
  '\n' +
  '  const truyVan = [\n' +
  '    [\'X-Amz-Algorithm\', \'AWS4-HMAC-SHA256\'],\n' +
  '    [\'X-Amz-Credential\', `${c.accessKeyId}/${pham}`],\n' +
  '    [\'X-Amz-Date\', mocThoiGian],\n' +
  '    [\'X-Amz-Expires\', String(hanGiay)],\n' +
  '    [\'X-Amz-SignedHeaders\', headerDuocKy],\n' +
  '  ];\n' +
  '  // Canonical query: ma hoa tung phan roi SAP XEP theo chuoi da ma hoa.\n' +
  '  const truyVanChuan = truyVan\n' +
  '    .map(([k, v]) => `${maHoa(k)}=${maHoa(v)}`)\n' +
  '    .sort()\n' +
  '    .join(\'&\');\n' +
  '\n' +
  '  const duongDan = `/${c.bucket}/${maHoaKey(key)}`;\n' +
  '  const headerChuan = `content-type:${contentType}\\nhost:${c.host}\\n`;\n' +
  '\n' +
  '  const yeuCauChuan = [\n' +
  '    \'PUT\',\n' +
  '    duongDan,\n' +
  '    truyVanChuan,\n' +
  '    headerChuan,\n' +
  '    headerDuocKy,\n' +
  '    \'UNSIGNED-PAYLOAD\',\n' +
  '  ].join(\'\\n\');\n' +
  '\n' +
  '  const chuoiDeKy = [\n' +
  '    \'AWS4-HMAC-SHA256\',\n' +
  '    mocThoiGian,\n' +
  '    pham,\n' +
  '    bam(yeuCauChuan),\n' +
  '  ].join(\'\\n\');\n' +
  '\n' +
  '  let k = km(\'AWS4\' + c.secretAccessKey, ngay);\n' +
  '  k = km(k, c.region);\n' +
  '  k = km(k, \'s3\');\n' +
  '  k = km(k, \'aws4_request\');\n' +
  '  const chuKy = crypto.createHmac(\'sha256\', k).update(chuoiDeKy).digest(\'hex\');\n' +
  '\n' +
  '  return {\n' +
  '    url: `http://${c.host}${duongDan}?${truyVanChuan}&X-Amz-Signature=${chuKy}`,\n' +
  '    yeuCauChuan,\n' +
  '    chuoiDeKy,\n' +
  '    chuKy,\n' +
  '    headerDuocKy,\n' +
  '  };\n' +
  '}\n' +
  '\n' +
  'async function taiLen(url, duLieu, contentType) {\n' +
  '  const r = await fetch(url, {\n' +
  '    method: \'PUT\',\n' +
  '    // Phai la DUNG chuoi da ky. Lech mot ky tu la 403.\n' +
  '    headers: { \'Content-Type\': contentType },\n' +
  '    body: duLieu,\n' +
  '  });\n' +
  '  return { ma: r.status, etag: r.headers.get(\'etag\') };\n' +
  '}\n';

const Q1_OUTPUT =
  '--- CanonicalRequest ---\n' +
  'PUT\\n/de-thi/users/42/anh%20dai%20dien.jpg\\nX-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dethiuser%2F20260901%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260901T000000Z&X-Amz-Expires=600&X-Amz-SignedHeaders=content-type%3Bhost\\ncontent-type:image/jpeg\\nhost:127.0.0.1:19000\\n\\ncontent-type;host\\nUNSIGNED-PAYLOAD\n' +
  '--- StringToSign ---\n' +
  'AWS4-HMAC-SHA256\\n20260901T000000Z\\n20260901/us-east-1/s3/aws4_request\\n8acf3679c0c32721b2769bb744ef4ecb3ffd4a2c2310e02757421baf6df20a3a\n' +
  '--- Signature ---\n' +
  'bc4bae564287b6c39197051acc356b6286c6236b8969e32c3163426ee351af0e\n' +
  '--- SignedHeaders ---\n' +
  'content-type;host\n' +
  '--- URL ---\n' +
  'http://127.0.0.1:19000/de-thi/users/42/anh%20dai%20dien.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=dethiuser%2F20260901%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260901T000000Z&X-Amz-Expires=600&X-Amz-SignedHeaders=content-type%3Bhost&X-Amz-Signature=bc4bae564287b6c39197051acc356b6286c6236b8969e32c3163426ee351af0e\n' +
  '--- typeof taiLen ---\n' +
  'function\n';

const Q2_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q2/chinh-sach.cjs — chinh sach bucket + CORS o pham vi TOI THIEU.\n' +
  'const BUCKET = \'de-thi-public\';\n' +
  'const GOC_WEB = [\'https://cuongthai.com\', \'https://www.cuongthai.com\'];\n' +
  '\n' +
  '// Sau phep do len bucket that, va sau phep do len CORS that.\n' +
  'const DO_BUCKET = [\n' +
  '  [\'GET\',    \'cong-khai/logo.png\'],\n' +
  '  [\'GET\',    \'rieng-tu/hoa-don.pdf\'],\n' +
  '  [\'GET\',    \'cong-khai-rieng/logo.png\'],\n' +
  '  [\'LIST\',   \'\'],\n' +
  '  [\'PUT\',    \'cong-khai/xam.png\'],\n' +
  '  [\'DELETE\', \'cong-khai/logo.png\'],\n' +
  '];\n' +
  'const DO_CORS = [\n' +
  '  [\'https://cuongthai.com\',     \'PUT\',    [\'content-type\']],\n' +
  '  [\'https://www.cuongthai.com\', \'PUT\',    [\'content-type\']],\n' +
  '  [\'http://cuongthai.com\',      \'PUT\',    [\'content-type\']],\n' +
  '  [\'https://cuongthai.com\',     \'DELETE\', [\'content-type\']],\n' +
  '  [\'https://cuongthai.com\',     \'PUT\',    [\'content-type\', \'x-request-id\']],\n' +
  '];\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'console.log(\'--- bucket policy ---\');\n' +
  'console.log(JSON.stringify(chinhSachBucket(), null, 2));\n' +
  'console.log(\'--- cors ---\');\n' +
  'console.log(JSON.stringify(quyTacCors(), null, 2));\n' +
  'console.log(\'--- doi soat bucket (an danh) ---\');\n' +
  'for (const [hd, key] of DO_BUCKET) {\n' +
  '  console.log(`${hd.padEnd(6)} ${(key || \'(bucket)\').padEnd(26)} ${anDanhDuocPhep(hd, key) ? \'CHO PHEP\' : \'TU CHOI\'}`);\n' +
  '}\n' +
  'console.log(\'--- doi soat cors ---\');\n' +
  'for (const [goc, pt, hs] of DO_CORS) {\n' +
  '  console.log(`${goc.padEnd(28)} ${pt.padEnd(7)} ${hs.join(\',\').padEnd(24)} ${corsChoPhep(goc, pt, hs) ? \'CHO PHEP\' : \'TU CHOI\'}`);\n' +
  '}\n';

const Q2_SOLUTION =
  '// 1) Chinh sach bucket: CHI cap s3:GetObject, CHI duoi mot tien to.\n' +
  '//    Khong cap s3:ListBucket -> khong ai liet ke duoc key, nen mot object\n' +
  '//    rieng tu con khong TIM RA duoc chu chua noi doc duoc.\n' +
  'function chinhSachBucket() {\n' +
  '  return {\n' +
  '    Version: \'2012-10-17\',\n' +
  '    Statement: [\n' +
  '      {\n' +
  '        Sid: \'ChiDocCongKhai\',\n' +
  '        Effect: \'Allow\',\n' +
  '        Principal: { AWS: [\'*\'] },\n' +
  '        Action: [\'s3:GetObject\'],\n' +
  '        Resource: [`arn:aws:s3:::${BUCKET}/cong-khai/*`],\n' +
  '      },\n' +
  '    ],\n' +
  '  };\n' +
  '}\n' +
  '\n' +
  '// 2) CORS: liet ke TUONG MINH goc va header. Dung "*" o AllowedHeaders thi\n' +
  '//    trinh duyet khong dem duoc preflight; thieu MaxAgeSeconds thi moi PUT\n' +
  '//    lai preflight mot lan nua. ExposeHeaders phai co ETag, khong thi\n' +
  '//    response.headers.get(\'etag\') tra null va client tuong upload hong.\n' +
  'function quyTacCors() {\n' +
  '  return [\n' +
  '    {\n' +
  '      AllowedOrigins: GOC_WEB,\n' +
  '      AllowedMethods: [\'GET\', \'HEAD\', \'PUT\'],\n' +
  '      AllowedHeaders: [\'Content-Type\', \'x-amz-content-sha256\', \'x-amz-date\'],\n' +
  '      ExposeHeaders: [\'ETag\'],\n' +
  '      MaxAgeSeconds: 3600,\n' +
  '    },\n' +
  '  ];\n' +
  '}\n' +
  '\n' +
  '// 3) Bo doi soat: mot yeu cau AN DANH duoc phep khi va chi khi co mot cau\n' +
  '//    Allow phu ca hanh dong lan tai nguyen. Khong khop gi = tu choi.\n' +
  'const HANH_DONG = { GET: \'s3:GetObject\', PUT: \'s3:PutObject\',\n' +
  '                    DELETE: \'s3:DeleteObject\', LIST: \'s3:ListBucket\' };\n' +
  '\n' +
  'function khopMau(mau, chuoi) {\n' +
  '  // Chi co dung mot ky tu dai dien la \'*\', va no khop moi thu con lai.\n' +
  '  const sao = mau.indexOf(\'*\');\n' +
  '  if (sao < 0) return mau === chuoi;\n' +
  '  return chuoi.startsWith(mau.slice(0, sao));\n' +
  '}\n' +
  '\n' +
  'function anDanhDuocPhep(hanhDong, key) {\n' +
  '  const can = HANH_DONG[hanhDong];\n' +
  '  const arn = hanhDong === \'LIST\'\n' +
  '    ? `arn:aws:s3:::${BUCKET}`          // ListBucket tro vao CHINH bucket\n' +
  '    : `arn:aws:s3:::${BUCKET}/${key}`;  // con lai tro vao tung object\n' +
  '  return chinhSachBucket().Statement.some((s) =>\n' +
  '    s.Effect === \'Allow\'\n' +
  '    && s.Action.includes(can)\n' +
  '    && s.Resource.some((r) => khopMau(r, arn)));\n' +
  '}\n' +
  '\n' +
  'function corsChoPhep(goc, phuongThuc, headers) {\n' +
  '  return quyTacCors().some((r) =>\n' +
  '    r.AllowedOrigins.includes(goc)                 // so chuoi CHINH XAC\n' +
  '    && r.AllowedMethods.includes(phuongThuc)\n' +
  '    && headers.every((h) => r.AllowedHeaders\n' +
  '        .some((a) => a.toLowerCase() === h.toLowerCase())));  // header khong phan biet hoa thuong\n' +
  '}\n';

const Q2_OUTPUT =
  '--- bucket policy ---\n' +
  '{\n' +
  '  "Version": "2012-10-17",\n' +
  '  "Statement": [\n' +
  '    {\n' +
  '      "Sid": "ChiDocCongKhai",\n' +
  '      "Effect": "Allow",\n' +
  '      "Principal": {\n' +
  '        "AWS": [\n' +
  '          "*"\n' +
  '        ]\n' +
  '      },\n' +
  '      "Action": [\n' +
  '        "s3:GetObject"\n' +
  '      ],\n' +
  '      "Resource": [\n' +
  '        "arn:aws:s3:::de-thi-public/cong-khai/*"\n' +
  '      ]\n' +
  '    }\n' +
  '  ]\n' +
  '}\n' +
  '--- cors ---\n' +
  '[\n' +
  '  {\n' +
  '    "AllowedOrigins": [\n' +
  '      "https://cuongthai.com",\n' +
  '      "https://www.cuongthai.com"\n' +
  '    ],\n' +
  '    "AllowedMethods": [\n' +
  '      "GET",\n' +
  '      "HEAD",\n' +
  '      "PUT"\n' +
  '    ],\n' +
  '    "AllowedHeaders": [\n' +
  '      "Content-Type",\n' +
  '      "x-amz-content-sha256",\n' +
  '      "x-amz-date"\n' +
  '    ],\n' +
  '    "ExposeHeaders": [\n' +
  '      "ETag"\n' +
  '    ],\n' +
  '    "MaxAgeSeconds": 3600\n' +
  '  }\n' +
  ']\n' +
  '--- doi soat bucket (an danh) ---\n' +
  'GET    cong-khai/logo.png         CHO PHEP\n' +
  'GET    rieng-tu/hoa-don.pdf       TU CHOI\n' +
  'GET    cong-khai-rieng/logo.png   TU CHOI\n' +
  'LIST   (bucket)                   TU CHOI\n' +
  'PUT    cong-khai/xam.png          TU CHOI\n' +
  'DELETE cong-khai/logo.png         TU CHOI\n' +
  '--- doi soat cors ---\n' +
  'https://cuongthai.com        PUT     content-type             CHO PHEP\n' +
  'https://www.cuongthai.com    PUT     content-type             CHO PHEP\n' +
  'http://cuongthai.com         PUT     content-type             TU CHOI\n' +
  'https://cuongthai.com        DELETE  content-type             TU CHOI\n' +
  'https://cuongthai.com        PUT     content-type,x-request-id TU CHOI\n';

const Q3_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q3/multipart.cjs — mot luot multipart CHIU DUOC DUT GIUA CHUNG.\n' +
  'const crypto = require(\'node:crypto\');\n' +
  'const TOI_THIEU = 5 * 1024 * 1024;   // moi phan TRU phan cuoi phai >= 5 MiB\n' +
  '\n' +
  '// Kho gia, hanh xu dung nhu mot may chu S3 that (da doi chieu voi may that).\n' +
  'class KhoGia {\n' +
  '  constructor() { this.upload = new Map(); this.object = new Map(); this.nhatKy = []; }\n' +
  '  taoUpload(key) {\n' +
  '    const id = \'u\' + (this.upload.size + 1);\n' +
  '    this.upload.set(id, { key, phan: new Map() });\n' +
  '    this.nhatKy.push(`CreateMultipartUpload ${key} -> ${id}`);\n' +
  '    return id;\n' +
  '  }\n' +
  '  lietKeUpload(key) {\n' +
  '    for (const [id, u] of this.upload) if (u.key === key) return id;\n' +
  '    return null;\n' +
  '  }\n' +
  '  lietKePhan(id) {\n' +
  '    const u = this.upload.get(id);\n' +
  '    this.nhatKy.push(`ListParts ${id} -> ${[...u.phan.keys()].join(\',\') || \'(rong)\'}`);\n' +
  '    return [...u.phan.entries()].map(([so, p]) => ({ so, etag: p.etag, co: p.co }));\n' +
  '  }\n' +
  '  ghiPhan(id, so, du) {\n' +
  '    const u = this.upload.get(id);\n' +
  '    if (this.hong && this.hong === so) { this.nhatKy.push(`UploadPart ${so} -> DUT MANG`); throw new Error(\'mang dut\'); }\n' +
  '    const etag = \'"\' + crypto.createHash(\'md5\').update(du).digest(\'hex\') + \'"\';\n' +
  '    u.phan.set(so, { etag, co: du.length, md5: crypto.createHash(\'md5\').update(du).digest() });\n' +
  '    this.nhatKy.push(`UploadPart ${so} (${du.length} B) -> ${etag}`);\n' +
  '    return etag;\n' +
  '  }\n' +
  '  hoanTat(id, keKhai) {\n' +
  '    const u = this.upload.get(id);\n' +
  '    const sapXep = [...keKhai].sort((a, b) => a.so - b.so);\n' +
  '    for (let i = 0; i < sapXep.length - 1; i++) {\n' +
  '      const p = u.phan.get(sapXep[i].so);\n' +
  '      if (p.co < TOI_THIEU) {\n' +
  '        this.nhatKy.push(\'CompleteMultipartUpload -> 400 EntityTooSmall\');\n' +
  '        const e = new Error(\'Your proposed upload is smaller than the minimum allowed object size.\');\n' +
  '        e.name = \'EntityTooSmall\'; e.ma = 400; throw e;\n' +
  '      }\n' +
  '    }\n' +
  '    const noi = Buffer.concat(sapXep.map((p) => u.phan.get(p.so).md5));\n' +
  '    const etag = \'"\' + crypto.createHash(\'md5\').update(noi).digest(\'hex\') + \'-\' + sapXep.length + \'"\';\n' +
  '    const co = sapXep.reduce((s, p) => s + u.phan.get(p.so).co, 0);\n' +
  '    this.object.set(u.key, { etag, co });\n' +
  '    this.upload.delete(id);\n' +
  '    this.nhatKy.push(`CompleteMultipartUpload ${sapXep.length} phan -> ${etag}`);\n' +
  '    return etag;\n' +
  '  }\n' +
  '}\n' +
  '\n' +
  'const lamDuLieu = (n) => { const b = Buffer.alloc(n); let x = 12345; for (let i = 0; i < n; i++) { x = (x * 1103515245 + 12345) & 0x7fffffff; b[i] = (x >>> 16) & 0xff; } return b; };\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'const DU = lamDuLieu(12 * 1024 * 1024);\n' +
  'const kho = new KhoGia();\n' +
  '\n' +
  'console.log(\'=== 1) phan 1 MiB voi file 12 MiB: phai bi chan TRUOC khi gui ===\');\n' +
  'try { taiLenNoiTiep(kho, \'video/a.mp4\', DU, 1024 * 1024); }\n' +
  'catch (e) { console.log(\'bi chan:\', e.name, \'|\', e.message); }\n' +
  'console.log(\'so lenh da gui:\', kho.nhatKy.length);\n' +
  '\n' +
  'console.log(\'\\n=== 2) luot dau, mang dut o phan 2 ===\');\n' +
  'kho.hong = 2;\n' +
  'try { taiLenNoiTiep(kho, \'video/a.mp4\', DU, 5 * 1024 * 1024); }\n' +
  'catch (e) { console.log(\'dut:\', e.message); }\n' +
  '\n' +
  'console.log(\'\\n=== 3) luot hai, noi tiep ===\');\n' +
  'kho.hong = null;\n' +
  'const kq = taiLenNoiTiep(kho, \'video/a.mp4\', DU, 5 * 1024 * 1024);\n' +
  'console.log(\'noiTiep:\', kq.noiTiep, \'| so phan phai gui lai:\', kq.daGui);\n' +
  'console.log(\'ETag   :\', kq.etag);\n' +
  'console.log(\'object :\', JSON.stringify(kho.object.get(\'video/a.mp4\')));\n' +
  '\n' +
  'console.log(\'\\n=== nhat ky may chu ===\');\n' +
  'for (const d of kho.nhatKy) console.log(\' \', d);\n';

const Q3_SOLUTION =
  'function chiaPhan(duLieu, kichThuoc) {\n' +
  '  const ra = [];\n' +
  '  for (let i = 0; i * kichThuoc < duLieu.length; i++) {\n' +
  '    ra.push({ so: i + 1, du: duLieu.subarray(i * kichThuoc, Math.min((i + 1) * kichThuoc, duLieu.length)) });\n' +
  '  }\n' +
  '  return ra;\n' +
  '}\n' +
  '\n' +
  'function taiLenNoiTiep(kho, key, duLieu, kichThuoc) {\n' +
  '  const phan = chiaPhan(duLieu, kichThuoc);\n' +
  '\n' +
  '  // Chan TRUOC khi ton mot byte nao len mang: neu co tu hai phan tro len ma\n' +
  '  // kich thuoc phan duoi 5 MiB thi Complete se hong o CUOI, sau khi da gui\n' +
  '  // xong toan bo file. Bat loi som la re hon bat loi dung.\n' +
  '  if (phan.length > 1 && kichThuoc < TOI_THIEU) {\n' +
  '    const e = new Error(\'kich thuoc phan phai >= 5 MiB khi co nhieu hon mot phan\');\n' +
  '    e.name = \'PhanQuaNho\';\n' +
  '    throw e;\n' +
  '  }\n' +
  '\n' +
  '  // NOI TIEP: neu con mot upload do dang cho dung key nay thi dung lai no\n' +
  '  // thay vi tao moi. Tao moi la bo lai cac phan cu -> chung nam do va van\n' +
  '  // bi tinh tien cho toi khi mot lifecycle rule abort chung.\n' +
  '  let id = kho.lietKeUpload(key);\n' +
  '  const noiTiep = id !== null;\n' +
  '  if (!noiTiep) id = kho.taoUpload(key);\n' +
  '\n' +
  '  // Phan da co tren may chu thi KHONG gui lai. Doi chieu ca kich thuoc de\n' +
  '  // khong dung lai mot phan ghi do.\n' +
  '  const daCo = new Map(kho.lietKePhan(id).map((p) => [p.so, p]));\n' +
  '  const keKhai = [];\n' +
  '  for (const p of phan) {\n' +
  '    const cu = daCo.get(p.so);\n' +
  '    if (cu && cu.co === p.du.length) { keKhai.push({ so: p.so, etag: cu.etag }); continue; }\n' +
  '    keKhai.push({ so: p.so, etag: kho.ghiPhan(id, p.so, p.du) });\n' +
  '  }\n' +
  '\n' +
  '  // Ban ke phai mang DU so phan va dung thu tu; may chu ghep theo SO PHAN.\n' +
  '  return { etag: kho.hoanTat(id, keKhai), noiTiep, daGui: phan.length - daCo.size };\n' +
  '}\n';

const Q3_OUTPUT =
  '=== 1) phan 1 MiB voi file 12 MiB: phai bi chan TRUOC khi gui ===\n' +
  'bi chan: PhanQuaNho | kich thuoc phan phai >= 5 MiB khi co nhieu hon mot phan\n' +
  'so lenh da gui: 0\n' +
  '\n' +
  '=== 2) luot dau, mang dut o phan 2 ===\n' +
  'dut: mang dut\n' +
  '\n' +
  '=== 3) luot hai, noi tiep ===\n' +
  'noiTiep: true | so phan phai gui lai: 2\n' +
  'ETag   : "e075f8a7513c211a87f50176e486a1e0-3"\n' +
  'object : {"etag":"\\"e075f8a7513c211a87f50176e486a1e0-3\\"","co":12582912}\n' +
  '\n' +
  '=== nhat ky may chu ===\n' +
  '  CreateMultipartUpload video/a.mp4 -> u1\n' +
  '  ListParts u1 -> (rong)\n' +
  '  UploadPart 1 (5242880 B) -> "c2af139a70acc342b4a2c2bf761d712a"\n' +
  '  UploadPart 2 -> DUT MANG\n' +
  '  ListParts u1 -> 1\n' +
  '  UploadPart 2 (5242880 B) -> "8140e8a13cb3389c39f9c9983367879e"\n' +
  '  UploadPart 3 (2097152 B) -> "d763cd3126ce08c68f649705b5eecea7"\n' +
  '  CompleteMultipartUpload 3 phan -> "e075f8a7513c211a87f50176e486a1e0-3"\n';

const Q4_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q4/lifecycle.cjs — quy tac vong doi + tinh chi phi.\n' +
  'const GIA = {           // bang gia R2 cong bo trong giao trinh\n' +
  '  luuTruGBThang: 0.015,\n' +
  '  classATrieu:   4.50,  // PUT / POST / COPY / LIST / DELETE hang loat\n' +
  '  classBTrieu:   0.36,  // GET / HEAD\n' +
  '};\n' +
  'const GiB = 1024 ** 3;\n' +
  '\n' +
  '// Kiem ke that cua bucket: [key, so byte, so ngay tuoi]\n' +
  'const OBJECT = [\n' +
  '  [\'users/42/avatar-1789.jpg\',       120 * 1024,        400],\n' +
  '  [\'users/7/avatar-2001.jpg\',        140 * 1024,          9],\n' +
  '  [\'exports/2026-06-so-lieu.csv\',    3 * GiB,           95],\n' +
  '  [\'exports/2026-08-so-lieu.csv\',    2 * GiB,           31],\n' +
  '  [\'exports/2026-09-so-lieu.csv\',    2 * GiB,            3],\n' +
  '  [\'exports-thang/tong-hop.csv\',     4 * GiB,          500],   // BAO CAO THUONG XUYEN, phai giu\n' +
  '  [\'tmp-24h/xem-truoc-1.png\',        50 * 1024 * 1024,   2],\n' +
  '  [\'tmp-24h/xem-truoc-2.png\',        50 * 1024 * 1024,   0],\n' +
  '];\n' +
  '// Multipart bo do dang: [key, so byte, so ngay ke tu luc khoi tao]\n' +
  'const DO_DANG = [\n' +
  '  [\'video/phim-dai.mp4\',   9 * GiB,  74],\n' +
  '  [\'video/moi-quay.mp4\',   3 * GiB,   2],\n' +
  '];\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'const kq = apDungLifecycle(OBJECT, DO_DANG);\n' +
  'const dl = (n) => (n / GiB).toFixed(3) + \' GiB\';\n' +
  'const $ = (n) => \'$\' + n.toFixed(4);\n' +
  '\n' +
  'console.log(\'--- quy tac ---\');\n' +
  'for (const r of quyTac()) {\n' +
  '  const gi = r.Expiration ? `Expiration.Days=${r.Expiration.Days}`\n' +
  '                          : `AbortIncompleteMultipartUpload.DaysAfterInitiation=${r.AbortIncompleteMultipartUpload.DaysAfterInitiation}`;\n' +
  '  console.log(`  ${r.ID.padEnd(16)} ${r.Status.padEnd(8)} Prefix="${r.Filter.Prefix}" ${gi}`);\n' +
  '}\n' +
  'console.log(\'--- object bi xoa ---\');\n' +
  'for (const [k, co, tuoi, han] of kq.xoa) console.log(`  ${k.padEnd(30)} ${dl(co).padStart(10)}  ${tuoi} ngay >= ${han}`);\n' +
  'console.log(\'--- object duoc giu ---\');\n' +
  'for (const [k, co, tuoi, han] of kq.giu) console.log(`  ${k.padEnd(30)} ${dl(co).padStart(10)}  ${tuoi} ngay  han=${han === null ? \'khong rule nao\' : han}`);\n' +
  'console.log(\'--- multipart ---\');\n' +
  'for (const [k, co, tuoi] of kq.abort)  console.log(`  ABORT ${k.padEnd(24)} ${dl(co).padStart(10)}  ${tuoi} ngay`);\n' +
  'for (const [k, co, tuoi] of kq.conBay) console.log(`  GIU   ${k.padEnd(24)} ${dl(co).padStart(10)}  ${tuoi} ngay`);\n' +
  '\n' +
  'const truoc = tongCo(OBJECT.map((r) => [r[0], r[1]])) + tongCo(DO_DANG.map((r) => [r[0], r[1]]));\n' +
  'const sau   = tongCo(kq.giu) + tongCo(kq.conBay);\n' +
  'console.log(\'--- dung luong bi tinh tien ---\');\n' +
  'console.log(\'  truoc :\', dl(truoc), \'=\', $(tinhChiPhi(truoc)) + \'/thang\');\n' +
  'console.log(\'  sau   :\', dl(sau),   \'=\', $(tinhChiPhi(sau))   + \'/thang\');\n' +
  'console.log(\'  tiet kiem:\', dl(truoc - sau), \'=\', $(tinhChiPhi(truoc) - tinhChiPhi(sau)) + \'/thang\');\n' +
  'const ct = chiPhiDonTay(50000);\n' +
  'console.log(\'--- neu don 50000 key bang script thay vi lifecycle ---\');\n' +
  'console.log(`  DeleteObject tung cai : ${ct.tungCai} request Class A = ${$(ct.tienTungCai)}`);\n' +
  'console.log(`  DeleteObjects theo lo : ${ct.theoLo} request Class A = ${$(ct.tienTheoLo)}`);\n';

const Q4_SOLUTION =
  '// Quy tac. Ba diem an diem: tien to PHAI ket thuc bang \'/\' (khong thi\n' +
  '// \'exports\' nuot luon \'exports-thang/tong-hop.csv\'); rule abort dung\n' +
  '// DaysAfterInitiation chu khong dung Days; va Status phai la \'Enabled\'\n' +
  '// — mot rule \'Disabled\' ngoi im mai mai ma nhin van nhu da cau hinh.\n' +
  'function quyTac() {\n' +
  '  return [\n' +
  '    { ID: \'abort-mpu\',      Status: \'Enabled\', Filter: { Prefix: \'\' },\n' +
  '      AbortIncompleteMultipartUpload: { DaysAfterInitiation: 7 } },\n' +
  '    { ID: \'expire-exports\', Status: \'Enabled\', Filter: { Prefix: \'exports/\' },\n' +
  '      Expiration: { Days: 30 } },\n' +
  '    { ID: \'expire-tmp\',     Status: \'Enabled\', Filter: { Prefix: \'tmp-24h/\' },\n' +
  '      Expiration: { Days: 1 } },\n' +
  '  ];\n' +
  '}\n' +
  '\n' +
  '// Mot object khop moi rule co tien to khop no; khi nhieu rule cung khop\n' +
  '// thi HAN SOM NHAT thang. Rule \'Disabled\' khong duoc tinh.\n' +
  'function hetHanSau(key) {\n' +
  '  let som = null;\n' +
  '  for (const r of quyTac()) {\n' +
  '    if (r.Status !== \'Enabled\') continue;\n' +
  '    if (!r.Expiration) continue;\n' +
  '    if (!key.startsWith(r.Filter.Prefix)) continue;   // so chuoi THUAN, khong co ngu nghia duong dan\n' +
  '    if (som === null || r.Expiration.Days < som) som = r.Expiration.Days;\n' +
  '  }\n' +
  '  return som;\n' +
  '}\n' +
  '\n' +
  'function ngayAbort() {\n' +
  '  for (const r of quyTac()) {\n' +
  '    if (r.Status !== \'Enabled\') continue;\n' +
  '    if (r.AbortIncompleteMultipartUpload) return r.AbortIncompleteMultipartUpload.DaysAfterInitiation;\n' +
  '  }\n' +
  '  return null;\n' +
  '}\n' +
  '\n' +
  'function apDungLifecycle(object, doDang) {\n' +
  '  const xoa = [], giu = [];\n' +
  '  for (const [key, co, tuoi] of object) {\n' +
  '    const han = hetHanSau(key);\n' +
  '    (han !== null && tuoi >= han ? xoa : giu).push([key, co, tuoi, han]);\n' +
  '  }\n' +
  '  const nguong = ngayAbort();\n' +
  '  const abort = [], conBay = [];\n' +
  '  for (const [key, co, tuoi] of doDang) {\n' +
  '    (nguong !== null && tuoi >= nguong ? abort : conBay).push([key, co, tuoi]);\n' +
  '  }\n' +
  '  return { xoa, giu, abort, conBay };\n' +
  '}\n' +
  '\n' +
  'const tongCo = (ds) => ds.reduce((s, r) => s + r[1], 0);\n' +
  '\n' +
  'function tinhChiPhi(soByte) {\n' +
  '  return (soByte / GiB) * GIA.luuTruGBThang;\n' +
  '}\n' +
  '\n' +
  '// Don bang script thi moi lan xoa la mot request Class A. DeleteObjects\n' +
  '// nhan toi 1000 key MOT request, nen so request la tran cua n/1000 —\n' +
  '// khac biet giua 1 request va n request, cung mot viec.\n' +
  'function chiPhiDonTay(soKey) {\n' +
  '  const tungCai = soKey;\n' +
  '  const theoLo   = Math.ceil(soKey / 1000);\n' +
  '  return {\n' +
  '    tungCai, theoLo,\n' +
  '    tienTungCai: (tungCai / 1e6) * GIA.classATrieu,\n' +
  '    tienTheoLo:  (theoLo  / 1e6) * GIA.classATrieu,\n' +
  '  };\n' +
  '}\n';

const Q4_OUTPUT =
  '--- quy tac ---\n' +
  '  abort-mpu        Enabled  Prefix="" AbortIncompleteMultipartUpload.DaysAfterInitiation=7\n' +
  '  expire-exports   Enabled  Prefix="exports/" Expiration.Days=30\n' +
  '  expire-tmp       Enabled  Prefix="tmp-24h/" Expiration.Days=1\n' +
  '--- object bi xoa ---\n' +
  '  exports/2026-06-so-lieu.csv     3.000 GiB  95 ngay >= 30\n' +
  '  exports/2026-08-so-lieu.csv     2.000 GiB  31 ngay >= 30\n' +
  '  tmp-24h/xem-truoc-1.png         0.049 GiB  2 ngay >= 1\n' +
  '--- object duoc giu ---\n' +
  '  users/42/avatar-1789.jpg        0.000 GiB  400 ngay  han=khong rule nao\n' +
  '  users/7/avatar-2001.jpg         0.000 GiB  9 ngay  han=khong rule nao\n' +
  '  exports/2026-09-so-lieu.csv     2.000 GiB  3 ngay  han=30\n' +
  '  exports-thang/tong-hop.csv      4.000 GiB  500 ngay  han=khong rule nao\n' +
  '  tmp-24h/xem-truoc-2.png         0.049 GiB  0 ngay  han=1\n' +
  '--- multipart ---\n' +
  '  ABORT video/phim-dai.mp4        9.000 GiB  74 ngay\n' +
  '  GIU   video/moi-quay.mp4        3.000 GiB  2 ngay\n' +
  '--- dung luong bi tinh tien ---\n' +
  '  truoc : 23.098 GiB = $0.3465/thang\n' +
  '  sau   : 9.049 GiB = $0.1357/thang\n' +
  '  tiet kiem: 14.049 GiB = $0.2107/thang\n' +
  '--- neu don 50000 key bang script thay vi lifecycle ---\n' +
  '  DeleteObject tung cai : 50000 request Class A = $0.2250\n' +
  '  DeleteObjects theo lo : 50 request Class A = $0.0002\n';

const Q5_STARTER =
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  '// Q5/chan-doan.cjs — "tai len xanh ma anh van 403".\n' +
  '// Nam ve, moi ve la BANG CHUNG thu thap duoc, khong phai ket luan.\n' +
  'const VE = [\n' +
  '  {\n' +
  '    ma: \'V1\',\n' +
  '    taiLen: { ma: 200, signedHeaders: \'content-type;host\', luuKieu: \'image/jpeg\' },\n' +
  '    urlPhucVu: \'https://5f0a.r2.cloudflarestorage.com/media/users/42/a.jpg\',\n' +
  '    doc: { ma: 403, code: \'AccessDenied\', message: \'Access Denied.\' },\n' +
  '    chinhSach: [\'arn:aws:s3:::media/cong-khai/*\'],\n' +
  '    key: \'users/42/a.jpg\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'V2\',\n' +
  '    taiLen: { ma: 200, signedHeaders: \'content-type;host\', luuKieu: \'image/jpeg\' },\n' +
  '    urlPhucVu: \'https://media.cuongthai.com/rieng-tu/hoa-don-42.jpg\',\n' +
  '    doc: { ma: 403, code: \'AccessDenied\', message: \'Access Denied.\' },\n' +
  '    chinhSach: [\'arn:aws:s3:::media/cong-khai/*\'],\n' +
  '    key: \'rieng-tu/hoa-don-42.jpg\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'V3\',\n' +
  '    taiLen: { ma: 200, signedHeaders: \'content-type;host\', luuKieu: \'application/pdf\' },\n' +
  '    urlPhucVu: \'https://5f0a.r2.cloudflarestorage.com/media/paid/bai-5.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260901T000000Z&X-Amz-Expires=600&X-Amz-Signature=ab12\',\n' +
  '    doc: { ma: 403, code: \'AccessDenied\', message: \'Request has expired\' },\n' +
  '    chinhSach: [],\n' +
  '    key: \'paid/bai-5.pdf\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'V4\',\n' +
  '    taiLen: { ma: 200, signedHeaders: \'content-type;host\', luuKieu: \'application/pdf\' },\n' +
  '    urlPhucVu: \'https://5f0a.r2.cloudflarestorage.com/media/paid/bai-6.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20260910T101500Z&X-Amz-Expires=600&X-Amz-Signature=cd34\',\n' +
  '    doc: { ma: 403, code: \'SignatureDoesNotMatch\', message: \'The request signature we calculated does not match the signature you provided. Check your key and signing method.\' },\n' +
  '    chinhSach: [],\n' +
  '    key: \'paid/bai-6.pdf\',\n' +
  '  },\n' +
  '  {\n' +
  '    ma: \'V5\',\n' +
  '    taiLen: { ma: 200, signedHeaders: \'host\', luuKieu: \'text/html\' },\n' +
  '    urlPhucVu: \'https://media.cuongthai.com/cong-khai/anh-dai-dien.jpg\',\n' +
  '    doc: { ma: 200, code: null, message: null, kieuTraVe: \'text/html\' },\n' +
  '    chinhSach: [\'arn:aws:s3:::media/cong-khai/*\'],\n' +
  '    key: \'cong-khai/anh-dai-dien.jpg\',\n' +
  '  },\n' +
  '];\n' +
  '\n' +
  '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
  '\n' +
  '\n' +
  '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
  'for (const v of VE) {\n' +
  '  const [ma, viec] = chanDoan(v);\n' +
  '  console.log(`${v.ma}  ${ma.padEnd(14)} ${viec}`);\n' +
  '}\n';

const Q5_SOLUTION =
  'const laUrlDaKy = (u) => u.includes(\'X-Amz-Signature=\');\n' +
  'const laEndpointApi = (u) => /r2\\.cloudflarestorage\\.com/.test(u);\n' +
  'const duocChinhSachPhu = (ds, key) => ds.some((r) => {\n' +
  '  const sao = r.indexOf(\'*\');\n' +
  '  const duoi = r.slice(r.indexOf(\':::\') + 3);          // "media/cong-khai/*"\n' +
  '  const chiKey = duoi.slice(duoi.indexOf(\'/\') + 1);    // "cong-khai/*"\n' +
  '  return sao < 0 ? chiKey === key : key.startsWith(chiKey.slice(0, chiKey.indexOf(\'*\')));\n' +
  '});\n' +
  '\n' +
  'function chanDoan(v) {\n' +
  '  // 0) KHONG phai 403 nao cung la 403, va khong phai 200 nao cung la on.\n' +
  '  //    Chu ky KHONG ky content-type -> nguoi tai len tu dat kieu, va bucket\n' +
  '  //    phuc vu no nhu mot trang. Xanh o moi cho, va do la lo hong.\n' +
  '  if (v.doc.ma === 200 && v.taiLen.signedHeaders === \'host\'\n' +
  '      && v.doc.kieuTraVe === \'text/html\') {\n' +
  '    return [\'XSS_LUU_TRU\',\n' +
  '      "them \'content-type\' vao signableHeaders roi ghi de lai object"];\n' +
  '  }\n' +
  '\n' +
  '  // 1) URL da ky: doc THAN XML, vi hai nguyen nhan khac han nhau deu 403.\n' +
  '  if (laUrlDaKy(v.urlPhucVu)) {\n' +
  '    if (v.doc.message === \'Request has expired\') {\n' +
  '      return [\'URL_HET_HAN\', \'ky lai o moi request, dung luu URL da ky trong DB\'];\n' +
  '    }\n' +
  '    if (v.doc.code === \'SignatureDoesNotMatch\') {\n' +
  '      return [\'CHU_KY_LECH\', \'kiem lech dong ho, chuoi region, va khoa da xoay chua deploy\'];\n' +
  '    }\n' +
  '  }\n' +
  '\n' +
  '  // 2) Endpoint API doi chu ky ma the <img> khong tao noi.\n' +
  '  if (laEndpointApi(v.urlPhucVu) && !laUrlDaKy(v.urlPhucVu)) {\n' +
  '    return [\'SAI_LOAI_URL\', \'tra ve buildPublicUrl(key) — ten mien tuy chinh qua CDN\'];\n' +
  '  }\n' +
  '\n' +
  '  // 3) Ten mien dung roi ma van AccessDenied: chinh sach khong phu key nay.\n' +
  '  if (v.doc.code === \'AccessDenied\' && !duocChinhSachPhu(v.chinhSach, v.key)) {\n' +
  '    return [\'NGOAI_PHAM_VI\',\n' +
  '      \'key nam ngoai tien to duoc cap; chuyen sang tien to cong khai hoac phuc vu bang URL ky ngan han\'];\n' +
  '  }\n' +
  '\n' +
  '  return [\'CHUA_KET_LUAN\', \'thu thap them bang chung\'];\n' +
  '}\n';

const Q5_OUTPUT =
  'V1  SAI_LOAI_URL   tra ve buildPublicUrl(key) — ten mien tuy chinh qua CDN\n' +
  'V2  NGOAI_PHAM_VI  key nam ngoai tien to duoc cap; chuyen sang tien to cong khai hoac phuc vu bang URL ky ngan han\n' +
  'V3  URL_HET_HAN    ky lai o moi request, dung luu URL da ky trong DB\n' +
  'V4  CHU_KY_LECH    kiem lech dong ho, chuoi region, va khoa da xoay chua deploy\n' +
  'V5  XSS_LUU_TRU    them \'content-type\' vao signableHeaders roi ghi de lai object\n';

export default {
  course: { slug: 'object-storage' },
  exams: [
    {
      kind: 'PE',
      peType: 'CODE',
      code: 'PE',
      source: 'SAMPLE',
      sortOrder: 10,
      title: B(
        'Practical Exam — sign it, scope it, resume it, expire it, diagnose it',
        'Thi thực hành — ký nó, thu hẹp nó, nối tiếp nó, cho nó hết hạn, và chẩn nó',
      ),
      description: B(
        'Five practical questions, submitted as a .zip and written in plain Node with no SDK: a SigV4 presigned PUT built from scratch and the upload function that matches it, a bucket policy and CORS rule at minimum scope with the matcher that proves their scope, a multipart upload that survives a network drop and resumes without re-sending what the server already holds, a set of lifecycle rules plus the cost arithmetic they save, and a diagnostic pass over five real "the upload was green and the image is still 403" tickets — chapters 1, 3, 4, 5, 6, 7 and 9.',
        'Năm câu thực hành, nộp dưới dạng .zip và viết bằng Node thuần không SDK: một lệnh PUT ký sẵn SigV4 dựng từ đầu cùng hàm tải lên khớp với nó, một chính sách bucket và một quy tắc CORS ở phạm vi tối thiểu kèm bộ đối soát chứng minh phạm vi ấy, một lượt multipart sống sót qua một cú đứt mạng rồi nối tiếp mà không gửi lại thứ máy chủ vốn đã có, một bộ quy tắc vòng đời cộng phép tính chi phí mà chúng tiết kiệm được, và một lượt chẩn đoán trên năm phiếu báo lỗi thật kiểu "tải lên xanh mà ảnh vẫn 403" — các chương 1, 3, 4, 5, 6, 7 và 9.',
      ),
      durationMinutes: 120,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ── Q1 · chương 3 + 4 ────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q1 — Sign a presigned PUT by hand, and make it refuse the wrong content type (chapters 3 and 4).</b> Write <code>Q1/ky-url.cjs</code> exporting two functions. No SDK: <code>node:crypto</code> and <code>fetch</code> are the whole toolkit.</p>' +
            '<ul>' +
            '<li>' + c('kyUrlTaiLen({ key, contentType, hanGiay, mocThoiGian })') + ' returns <code>{ url, yeuCauChuan, chuoiDeKy, chuKy, headerDuocKy }</code> for a <code>PUT</code>. Build the canonical request, the string-to-sign, the derived signing key and the signature exactly as SigV4 specifies, and put the five <code>X-Amz-*</code> query parameters plus <code>X-Amz-Signature</code> into the URL.</li>' +
            '<li>' + c('taiLen(url, duLieu, contentType)') + ' PUTs the bytes to that URL and returns <code>{ ma, etag }</code> from the response.</li>' +
            '</ul>' +
            '<p>Four details are graded and each one is a way to produce a URL that looks right and is refused by the server:</p>' +
            '<ul>' +
            '<li><b>Which headers the signature commits to.</b> The default presigner signs only <code>host</code>, which is the vulnerability chapter 4 is built around. Sign <code>content-type</code> as well, and note that SigV4 requires the names <b>lowercased and sorted</b>, joined with a semicolon — the value that must appear is ' + c('content-type;host') + ', and the canonical headers block repeats them one per line in that same order, each line ending in a newline, with a further blank line after the block.</li>' +
            '<li><b>The canonical query string.</b> Percent-encode each name and each value <em>first</em>, then sort the resulting <code>name=value</code> pairs. Sorting before encoding gives a different order for these five parameters, and a different order is a different signature.</li>' +
            '<li><b>The path.</b> The test key contains a space. Percent-encode each path segment but <b>not</b> the <code>/</code> separators, so <code>users/42/anh dai dien.jpg</code> becomes <code>users/42/anh%20dai%20dien.jpg</code>.</li>' +
            '<li><b>The payload.</b> A presigned URL cannot hash a body it has not seen, so the last line of the canonical request is the literal <code>UNSIGNED-PAYLOAD</code>.</li>' +
            '</ul>' +
            '<p>The transcript is fixed because <code>mocThoiGian</code> is fixed. Verify by diffing all six blocks, not just the signature.</p>',

            '<p><b>Câu 1 — Tự tay ký một lệnh PUT đã ký sẵn, và làm cho nó TỪ CHỐI sai kiểu nội dung (chương 3 và 4).</b> Hãy viết <code>Q1/ky-url.cjs</code> xuất ra hai hàm. Không SDK: <code>node:crypto</code> và <code>fetch</code> là toàn bộ đồ nghề.</p>' +
            '<ul>' +
            '<li>' + c('kyUrlTaiLen({ key, contentType, hanGiay, mocThoiGian })') + ' trả về <code>{ url, yeuCauChuan, chuoiDeKy, chuKy, headerDuocKy }</code> cho một lệnh <code>PUT</code>. Hãy dựng canonical request, string-to-sign, khoá ký dẫn xuất và chữ ký đúng như SigV4 quy định, rồi đặt năm tham số truy vấn <code>X-Amz-*</code> cộng <code>X-Amz-Signature</code> vào URL.</li>' +
            '<li>' + c('taiLen(url, duLieu, contentType)') + ' PUT các byte lên URL đó và trả về <code>{ ma, etag }</code> lấy từ phản hồi.</li>' +
            '</ul>' +
            '<p>Bốn chi tiết bị chấm, và mỗi cái là một cách tạo ra một URL nhìn thì đúng mà máy chủ từ chối:</p>' +
            '<ul>' +
            '<li><b>Chữ ký cam kết những header nào.</b> Bộ ký sẵn mặc định chỉ ký <code>host</code>, và đó chính là lỗ hổng mà cả chương 4 dựng lên quanh nó. Hãy ký thêm <code>content-type</code>, và lưu ý SigV4 bắt các tên phải <b>viết thường và sắp xếp</b>, nối bằng dấu chấm phẩy — giá trị phải hiện ra là ' + c('content-type;host') + ', còn khối canonical headers thì lặp lại chúng mỗi dòng một cái theo đúng thứ tự đó, mỗi dòng kết thúc bằng một ký tự xuống dòng, và sau cả khối còn thêm một dòng trống nữa.</li>' +
            '<li><b>Chuỗi truy vấn chuẩn.</b> Hãy mã hoá phần trăm từng tên và từng giá trị TRƯỚC, rồi mới sắp xếp các cặp <code>tên=giá trị</code> thu được. Sắp xếp trước rồi mới mã hoá sẽ cho ra một thứ tự khác với năm tham số này, mà thứ tự khác là chữ ký khác.</li>' +
            '<li><b>Đường dẫn.</b> Key dùng để kiểm có một dấu cách. Hãy mã hoá phần trăm từng đoạn đường dẫn nhưng <b>không</b> mã hoá các dấu <code>/</code> ngăn cách, để <code>users/42/anh dai dien.jpg</code> thành <code>users/42/anh%20dai%20dien.jpg</code>.</li>' +
            '<li><b>Phần tải.</b> Một URL ký sẵn không băm nổi một phần thân mà nó chưa nhìn thấy, nên dòng cuối của canonical request là đúng chuỗi <code>UNSIGNED-PAYLOAD</code>.</li>' +
            '</ul>' +
            '<p>Đoạn transcript là cố định vì <code>mocThoiGian</code> cố định. Hãy kiểm bằng cách diff cả sáu khối chứ không chỉ diff cái chữ ký.</p>',
          ),
          starterCode: Q1_STARTER,
          expectedOutput: Q1_OUTPUT,
          sampleSolution: Q1_SOLUTION,
          rubric: rubric([
            ['chuky',
              'The signature matches the expected value byte for byte, which means the canonical request, the string-to-sign, the scope and the four-step key derivation (<code>AWS4</code> + secret, then date, region, <code>s3</code>, <code>aws4_request</code>) are all correct.',
              'Chữ ký khớp giá trị mong đợi từng byte, nghĩa là canonical request, string-to-sign, phạm vi credential và bốn bước dẫn xuất khoá (<code>AWS4</code> + secret, rồi ngày, vùng, <code>s3</code>, <code>aws4_request</code>) đều đúng.',
              0.6],
            ['header',
              '<code>X-Amz-SignedHeaders</code> is <code>content-type;host</code> — lowercased, sorted, semicolon-joined — and the canonical headers block lists the same two in the same order, so an uploader that sends a different content type gets a different signature and is refused rather than silently accepted.',
              '<code>X-Amz-SignedHeaders</code> là <code>content-type;host</code> — viết thường, sắp xếp, nối bằng dấu chấm phẩy — và khối canonical headers liệt kê đúng hai cái đó theo đúng thứ tự ấy, nhờ vậy một bên tải lên gửi kiểu nội dung khác sẽ ra chữ ký khác và bị TỪ CHỐI chứ không được nhận âm thầm.',
              0.5],
            ['mahoa',
              'The canonical query string is built by encoding each name and value and only then sorting the pairs, and the path percent-encodes each segment while leaving the <code>/</code> separators alone, so a key containing a space signs correctly.',
              'Chuỗi truy vấn chuẩn được dựng bằng cách mã hoá từng tên và từng giá trị rồi MỚI sắp xếp các cặp, còn đường dẫn thì mã hoá phần trăm từng đoạn mà để nguyên các dấu <code>/</code> ngăn cách, nhờ vậy một key có dấu cách vẫn ký đúng.',
              0.5],
            ['tailen',
              '<code>taiLen</code> sends exactly the content type that was signed and returns the status and ETag from the response rather than assuming success; nothing hard-codes a URL, and the secret is never printed.',
              '<code>taiLen</code> gửi ĐÚNG cái kiểu nội dung đã được ký và trả về mã trạng thái cùng ETag lấy từ phản hồi chứ không mặc định là thành công; không chỗ nào viết cứng một URL, và phần bí mật không bao giờ được in ra.',
              0.4],
          ]),
        }),

        /* ── Q2 · chương 3 + 5 ────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q2 — A bucket policy and a CORS rule at minimum scope, plus the matcher that proves it (chapters 3 and 5).</b> The bucket <code>de-thi-public</code> serves a public logo under <code>cong-khai/</code> and private invoices under <code>rieng-tu/</code>. The site runs at <code>https://cuongthai.com</code> and <code>https://www.cuongthai.com</code> and uploads directly from the browser. Write <code>Q2/chinh-sach.cjs</code> exporting four functions.</p>' +
            '<ul>' +
            '<li>' + c('chinhSachBucket()') + ' returns the bucket policy document. Grant the least that works: anonymous read of the public prefix only. Do <b>not</b> grant listing — a private object nobody can enumerate is a private object nobody can find.</li>' +
            '<li>' + c('quyTacCors()') + ' returns the CORS rules array. Explicit origins, explicit headers, <code>ExposeHeaders</code> and <code>MaxAgeSeconds</code> all matter, and lesson 5.2 says why each one does.</li>' +
            '<li>' + c('anDanhDuocPhep(hanhDong, key)') + ' answers whether an anonymous request is allowed, by matching the policy you just wrote. Note the two shapes of resource ARN: an object action names <code>bucket/key</code>, while <code>s3:ListBucket</code> names the <b>bucket itself</b>.</li>' +
            '<li>' + c('corsChoPhep(goc, phuongThuc, headers)') + ' answers whether a preflight would pass.</li>' +
            '</ul>' +
            '<p>The eleven verdicts in the transcript are the grade, and several are traps. <code>cong-khai-rieng/logo.png</code> must be refused, so a wildcard that matches by <code>startsWith</code> on the wrong slice will pass one case and fail this one. <code>http://cuongthai.com</code> must be refused, because an origin is scheme + host + port compared literally. And an extra request header must be refused while differing capitalisation must not, because HTTP header names are case-insensitive.</p>' +
            '<p>For reference, the six bucket verdicts were reproduced against a live S3-compatible server with this exact policy loaded: 200, 403, 403, 403, 403, 403 in the order printed.</p>',

            '<p><b>Câu 2 — Một chính sách bucket và một quy tắc CORS ở phạm vi tối thiểu, cộng bộ đối soát chứng minh điều đó (chương 3 và 5).</b> Bucket <code>de-thi-public</code> phục vụ một logo công khai dưới <code>cong-khai/</code> và các hoá đơn riêng tư dưới <code>rieng-tu/</code>. Trang web chạy ở <code>https://cuongthai.com</code> và <code>https://www.cuongthai.com</code> và tải lên trực tiếp từ trình duyệt. Hãy viết <code>Q2/chinh-sach.cjs</code> xuất ra bốn hàm.</p>' +
            '<ul>' +
            '<li>' + c('chinhSachBucket()') + ' trả về tài liệu chính sách bucket. Hãy cấp ít nhất mức còn chạy được: chỉ cho đọc ẩn danh đúng cái tiền tố công khai. <b>Đừng</b> cấp quyền liệt kê — một object riêng tư mà không ai liệt kê ra được là một object riêng tư không ai tìm ra được.</li>' +
            '<li>' + c('quyTacCors()') + ' trả về mảng quy tắc CORS. Origin tường minh, header tường minh, <code>ExposeHeaders</code> và <code>MaxAgeSeconds</code> đều quan trọng, và bài 5.2 nói rõ vì sao từng cái quan trọng.</li>' +
            '<li>' + c('anDanhDuocPhep(hanhDong, key)') + ' trả lời một yêu cầu ẩn danh có được phép không, bằng cách so khớp với chính chính sách bạn vừa viết. Chú ý hai hình dạng của ARN tài nguyên: một hành động trên object thì nêu <code>bucket/key</code>, còn <code>s3:ListBucket</code> thì nêu <b>chính cái bucket</b>.</li>' +
            '<li>' + c('corsChoPhep(goc, phuongThuc, headers)') + ' trả lời một lượt preflight có lọt không.</li>' +
            '</ul>' +
            '<p>Mười một phán quyết trong transcript chính là điểm số, và vài cái là bẫy. <code>cong-khai-rieng/logo.png</code> BẮT BUỘC phải bị từ chối, nên một dấu sao so khớp bằng <code>startsWith</code> trên đoạn cắt sai sẽ lọt ca này và trượt ca kia. <code>http://cuongthai.com</code> BẮT BUỘC phải bị từ chối, vì một origin là scheme + host + port và được so theo nghĩa đen. Còn một header request thừa thì phải bị từ chối trong khi khác nhau về viết hoa thì KHÔNG được từ chối, vì tên header HTTP không phân biệt hoa thường.</p>' +
            '<p>Để đối chiếu, sáu phán quyết về bucket đã được dựng lại trên một máy chủ S3-compatible sống với đúng chính sách này được nạp vào: 200, 403, 403, 403, 403, 403 theo đúng thứ tự in ra.</p>',
          ),
          starterCode: Q2_STARTER,
          expectedOutput: Q2_OUTPUT,
          sampleSolution: Q2_SOLUTION,
          rubric: rubric([
            ['chinhsach',
              'The policy grants exactly one action (<code>s3:GetObject</code>) on exactly one resource pattern (the public prefix), with no <code>s3:ListBucket</code> and no write action anywhere; the printed JSON matches field for field.',
              'Chính sách cấp đúng MỘT hành động (<code>s3:GetObject</code>) trên đúng MỘT mẫu tài nguyên (cái tiền tố công khai), không có <code>s3:ListBucket</code> và không có hành động ghi nào ở bất cứ đâu; khối JSON in ra khớp từng trường.',
              0.5],
            ['cors',
              'The CORS rule lists origins and headers explicitly rather than with <code>*</code>, carries <code>MaxAgeSeconds</code> so a preflight can be cached, and exposes <code>ETag</code> so the client can read it after a PUT instead of concluding the upload failed.',
              'Quy tắc CORS liệt kê origin và header một cách tường minh chứ không dùng <code>*</code>, mang theo <code>MaxAgeSeconds</code> để một lượt preflight lưu đệm được, và phơi ra <code>ETag</code> để client đọc được nó sau một lệnh PUT thay vì kết luận rằng lượt tải lên đã hỏng.',
              0.5],
            ['doisoat',
              'All six bucket verdicts are right, including the two that a careless wildcard gets wrong: <code>cong-khai-rieng/logo.png</code> is refused, and <code>LIST</code> is refused because it is a separate action on the bucket ARN rather than on an object ARN.',
              'Cả sáu phán quyết về bucket đều đúng, kể cả hai cái mà một dấu sao cẩu thả sẽ làm sai: <code>cong-khai-rieng/logo.png</code> bị từ chối, và <code>LIST</code> bị từ chối vì nó là một hành động RIÊNG trên ARN của bucket chứ không phải trên ARN của một object.',
              0.6],
            ['corsdoisoat',
              'All five CORS verdicts are right: the two listed origins pass, <code>http://</code> is refused as a different origin, an unlisted method is refused, and an unlisted request header is refused — while header comparison itself stays case-insensitive.',
              'Cả năm phán quyết về CORS đều đúng: hai origin đã liệt kê thì lọt, <code>http://</code> bị từ chối vì là một origin khác, một phương thức chưa liệt kê bị từ chối, và một header request chưa liệt kê bị từ chối — trong khi bản thân phép so header vẫn không phân biệt hoa thường.',
              0.4],
          ]),
        }),

        /* ── Q3 · chương 1 + 6 ────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q3 — A multipart upload that survives a network drop (chapters 1 and 6).</b> The starter block contains a fake S3 server whose behaviour was checked byte for byte against a real one: part ETags are the MD5 of the part, the final ETag is <code>md5(concatenated part MD5s)</code> with <code>-N</code> appended, and completing an upload whose non-final part is under 5 MiB fails with <code>EntityTooSmall</code>. Write <code>Q3/multipart.cjs</code> exporting ' + c('taiLenNoiTiep(kho, key, duLieu, kichThuoc)') + '.</p>' +
            '<p>The driver calls it three times and every call is graded:</p>' +
            '<ul>' +
            '<li><b>A part size of 1 MiB on a 12 MiB file must be refused before a single byte is sent.</b> The server would accept every <code>UploadPart</code> and only fail at completion, after the whole file has crossed the wire and been paid for — so the check belongs in your function, and the transcript proves it by printing that zero server commands were issued.</li>' +
            '<li><b>A drop at part 2 must leave the upload resumable.</b> The parts already on the server are real stored bytes; abandoning the <code>UploadId</code> and starting a new one leaks them, and only a lifecycle rule will ever clean them up.</li>' +
            '<li><b>The second run must not re-send part 1.</b> Ask the server what it already holds, compare, and send only the difference — the transcript shows exactly two parts re-sent, and a solution that blindly uploads all three prints three.</li>' +
            '</ul>' +
            '<p>Finish by completing with a manifest that carries every part number in order, and return the ETag the server produces. The expected final ETag is ' + c('"e075f8a7513c211a87f50176e486a1e0-3"') + ' — the same value a real S3-compatible server produced for these exact 12 MiB.</p>',

            '<p><b>Câu 3 — Một lượt multipart sống sót qua một cú đứt mạng (chương 1 và 6).</b> Khối mã cho sẵn chứa một máy chủ S3 giả mà hành vi của nó đã được đối chiếu từng byte với một máy chủ thật: ETag của từng phần là MD5 của phần đó, ETag cuối cùng là <code>md5(các MD5 từng phần nối lại)</code> rồi nối thêm <code>-N</code>, và hoàn tất một lượt có phần không-phải-cuối nhỏ hơn 5 MiB thì hỏng với <code>EntityTooSmall</code>. Hãy viết <code>Q3/multipart.cjs</code> xuất ra ' + c('taiLenNoiTiep(kho, key, duLieu, kichThuoc)') + '.</p>' +
            '<p>Bộ chạy gọi nó ba lần và cả ba lần đều bị chấm:</p>' +
            '<ul>' +
            '<li><b>Kích thước phần 1 MiB trên một file 12 MiB phải bị từ chối TRƯỚC khi gửi đi một byte nào.</b> Máy chủ sẽ nhận mọi lệnh <code>UploadPart</code> và chỉ hỏng ở bước hoàn tất, sau khi cả cái file đã băng qua đường dây và đã bị tính tiền — nên phép kiểm ấy thuộc về hàm của bạn, và transcript chứng minh điều đó bằng cách in ra rằng KHÔNG có lệnh nào được gửi tới máy chủ.</li>' +
            '<li><b>Một cú đứt ở phần 2 phải để lại một lượt tải lên nối tiếp được.</b> Những phần đã nằm trên máy chủ là byte thật đã lưu; bỏ cái <code>UploadId</code> đi rồi khởi tạo cái mới là làm rò chúng, và chỉ một lifecycle rule mới bao giờ dọn được chúng.</li>' +
            '<li><b>Lượt chạy thứ hai KHÔNG được gửi lại phần 1.</b> Hãy hỏi máy chủ xem nó đang giữ sẵn những gì, so lại, rồi chỉ gửi phần chênh — transcript hiện đúng hai phần được gửi lại, còn một lời giải cứ thế tải lên cả ba phần thì in ra ba.</li>' +
            '</ul>' +
            '<p>Kết thúc bằng việc hoàn tất với một bản kê mang đủ mọi số thứ tự phần theo đúng thứ tự, rồi trả về cái ETag mà máy chủ sinh ra. ETag cuối cùng mong đợi là ' + c('"e075f8a7513c211a87f50176e486a1e0-3"') + ' — đúng cái giá trị mà một máy chủ S3-compatible thật đã cho ra với chính 12 MiB này.</p>',
          ),
          starterCode: Q3_STARTER,
          expectedOutput: Q3_OUTPUT,
          sampleSolution: Q3_SOLUTION,
          rubric: rubric([
            ['chansom',
              'A part size below 5 MiB on a multi-part file is refused by the function itself, before any server call — the transcript prints zero commands issued, not an <code>EntityTooSmall</code> from the server after the whole file was uploaded.',
              'Một kích thước phần dưới 5 MiB trên một file nhiều phần bị chính hàm đó từ chối, TRƯỚC mọi lời gọi tới máy chủ — transcript in ra số lệnh đã gửi bằng không, chứ không phải một cái <code>EntityTooSmall</code> từ máy chủ sau khi cả file đã được tải lên.',
              0.5],
            ['noitiep',
              'The second run reuses the existing <code>UploadId</code> instead of creating a new one, so the parts already stored are kept rather than leaked as billable orphans that only a lifecycle rule could remove.',
              'Lượt chạy thứ hai dùng lại cái <code>UploadId</code> đang có thay vì tạo mới, nhờ đó những phần đã lưu được giữ lại chứ không bị bỏ rơi thành các mảnh mồ côi vẫn bị tính tiền mà chỉ một lifecycle rule mới gỡ được.',
              0.5],
            ['bosot',
              'It lists what the server already holds and re-sends only the missing parts, comparing size rather than trusting the part number alone; the transcript reports two parts re-sent, and the server log shows part 1 was not uploaded twice.',
              'Nó liệt kê thứ máy chủ đang giữ và chỉ gửi lại những phần còn thiếu, có đối chiếu KÍCH THƯỚC chứ không chỉ tin vào số thứ tự phần; transcript báo hai phần được gửi lại, và nhật ký máy chủ cho thấy phần 1 không bị tải lên hai lần.',
              0.6],
            ['etag',
              'The manifest carries every part number in order and the returned ETag is the server\'s, matching the expected multipart form with its <code>-3</code> suffix and the object\'s length of 12582912 bytes.',
              'Bản kê mang đủ mọi số thứ tự phần theo đúng thứ tự và ETag trả về là ETag CỦA MÁY CHỦ, khớp dạng multipart mong đợi với hậu tố <code>-3</code> và độ dài object 12582912 byte.',
              0.4],
          ]),
        }),

        /* ── Q4 · chương 6 + 7 ────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q4 — Lifecycle rules, and the arithmetic that justifies them (chapters 6 and 7).</b> The starter block holds a real inventory: eight objects with their ages, two abandoned multipart uploads, and the published R2 rates. Write <code>Q4/lifecycle.cjs</code> exporting four functions.</p>' +
            '<ul>' +
            '<li>' + c('quyTac()') + ' returns the lifecycle rules. Abort incomplete multipart uploads after 7 days, expire <code>exports/</code> after 30 days and <code>tmp-24h/</code> after 1 day, and leave <code>users/</code> and <code>exports-thang/tong-hop.csv</code> alone — that last one is a report the business reads every month, and it is 4 GiB, and it is 500 days old.</li>' +
            '<li>' + c('hetHanSau(key)') + ' returns the number of days after which that key expires, or <code>null</code> if no rule covers it. Rules do not stack: when several match, the earliest expiration wins.</li>' +
            '<li>' + c('apDungLifecycle(object, doDang)') + ' returns what is deleted, kept, aborted and still in flight.</li>' +
            '<li>' + c('tinhChiPhi(soByte)') + ' and ' + c('chiPhiDonTay(soKey)') + ' do the money: monthly storage before and after, and what a manual cleanup of 50,000 keys costs one <code>DeleteObject</code> at a time versus batched.</li>' +
            '</ul>' +
            '<p>Three things are being graded that a rule set which merely runs will still get wrong. The <b>trailing slash</b>: a prefix is a literal string comparison, so <code>exports</code> without it eats the monthly report and the transcript will show a 4 GiB object in the wrong list. The <b>abort key</b>: an abandoned upload is not an object and has no <code>Expiration</code>; it needs <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code>, which is why the 9 GiB upload from 74 days ago is the single largest saving here. And <b>Status</b>: a rule saved as <code>Disabled</code> looks configured and does nothing forever, so your evaluator must ignore anything that is not <code>Enabled</code>.</p>',

            '<p><b>Câu 4 — Quy tắc vòng đời, và phép tính biện minh cho chúng (chương 6 và 7).</b> Khối mã cho sẵn giữ một bản kiểm kê thật: tám object kèm tuổi của chúng, hai lượt multipart bị bỏ dở, và bảng giá công bố của R2. Hãy viết <code>Q4/lifecycle.cjs</code> xuất ra bốn hàm.</p>' +
            '<ul>' +
            '<li>' + c('quyTac()') + ' trả về các quy tắc vòng đời. Hãy abort các lượt multipart chưa hoàn tất sau 7 ngày, cho <code>exports/</code> hết hạn sau 30 ngày và <code>tmp-24h/</code> sau 1 ngày, và ĐỪNG đụng tới <code>users/</code> lẫn <code>exports-thang/tong-hop.csv</code> — cái cuối là một báo cáo mà bộ phận kinh doanh đọc hằng tháng, nó nặng 4 GiB, và nó đã 500 ngày tuổi.</li>' +
            '<li>' + c('hetHanSau(key)') + ' trả về số ngày sau đó key ấy hết hạn, hoặc <code>null</code> nếu không rule nào phủ nó. Các rule KHÔNG cộng dồn: khi nhiều rule cùng khớp thì hạn sớm nhất thắng.</li>' +
            '<li>' + c('apDungLifecycle(object, doDang)') + ' trả về những gì bị xoá, được giữ, bị abort, và còn đang bay.</li>' +
            '<li>' + c('tinhChiPhi(soByte)') + ' và ' + c('chiPhiDonTay(soKey)') + ' lo phần tiền: dung lượng tính tiền hằng tháng trước và sau, và một lượt dọn tay 50.000 key tốn bao nhiêu khi gọi <code>DeleteObject</code> từng cái so với khi gom lô.</li>' +
            '</ul>' +
            '<p>Có ba thứ bị chấm mà một bộ rule chỉ cần chạy được vẫn sẽ làm sai. <b>Dấu gạch chéo cuối</b>: một tiền tố là phép so chuỗi nguyên văn, nên <code>exports</code> mà thiếu nó là nuốt luôn cái báo cáo hằng tháng, và transcript sẽ hiện một object 4 GiB nằm nhầm danh sách. <b>Khoá của rule abort</b>: một lượt tải lên bị bỏ dở KHÔNG phải object và không có <code>Expiration</code> nào; nó cần <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code>, và đó là lý do lượt tải lên 9 GiB từ 74 ngày trước lại là khoản tiết kiệm lớn nhất ở đây. Và <b>Status</b>: một rule lưu ở dạng <code>Disabled</code> thì nhìn như đã cấu hình mà chẳng làm gì mãi mãi, nên bộ đánh giá của bạn phải bỏ qua mọi thứ không phải <code>Enabled</code>.</p>',
          ),
          starterCode: Q4_STARTER,
          expectedOutput: Q4_OUTPUT,
          sampleSolution: Q4_SOLUTION,
          rubric: rubric([
            ['tiento',
              'Every filter prefix ends with <code>/</code>, so <code>exports-thang/tong-hop.csv</code> lands in the kept list rather than being expired by a rule that was written for <code>exports/</code>; <code>users/</code> is covered by no rule at all.',
              'Mọi tiền tố lọc đều kết thúc bằng <code>/</code>, nhờ vậy <code>exports-thang/tong-hop.csv</code> rơi vào danh sách được giữ chứ không bị một rule vốn viết cho <code>exports/</code> cho hết hạn; còn <code>users/</code> thì không rule nào phủ.',
              0.5],
            ['abort',
              'Abandoned multipart uploads are handled by <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> rather than by an <code>Expiration</code>, so the 74-day-old 9 GiB upload is aborted while the 2-day-old one is left in flight.',
              'Các lượt multipart bị bỏ dở được xử bằng <code>AbortIncompleteMultipartUpload.DaysAfterInitiation</code> chứ không bằng một <code>Expiration</code>, nhờ vậy lượt 9 GiB đã 74 ngày bị abort còn lượt 2 ngày thì được để yên cho bay tiếp.',
              0.5],
            ['danhgia',
              'The evaluator skips any rule whose <code>Status</code> is not <code>Enabled</code> and takes the earliest expiration when several rules match one key, and every expiry decision uses <code>&gt;=</code> so an object exactly at the boundary is expired.',
              'Bộ đánh giá bỏ qua mọi rule có <code>Status</code> khác <code>Enabled</code> và lấy hạn SỚM NHẤT khi nhiều rule cùng khớp một key, và mọi quyết định hết hạn dùng <code>&gt;=</code> để một object nằm đúng ranh giới thì bị cho hết hạn.',
              0.5],
            ['tien',
              'The money is arithmetic on the given rates, not invented: storage before and after and the monthly saving are computed from the actual byte totals, and the batched-versus-individual delete comparison shows the thousand-fold difference in request count for the same work.',
              'Phần tiền là số học trên chính bảng giá đề cho chứ không phải bịa: dung lượng trước và sau cùng khoản tiết kiệm hằng tháng đều tính từ tổng byte thật, và phép so xoá-theo-lô với xoá-từng-cái cho thấy chênh lệch gấp nghìn lần về số request cho cùng một việc.',
              0.5],
          ]),
        }),

        /* ── Q5 · chương 4 + 9 ────────────────────────────────────── */
        codeQ({
          points: 2,
          language: 'javascript',
          prompt: B(
            '<p><b>Q5 — "The upload was green and the image is still 403" (chapters 4 and 9).</b> Five tickets, all with the same headline and five different causes. The starter block gives the evidence you would actually have collected: what the presigned URL committed to, what the object was stored as, which URL the frontend serves, and what an unauthenticated read returned. Write <code>Q5/chan-doan.cjs</code> exporting ' + c('chanDoan(ve)') + ' returning <code>[ma, viec]</code> — a cause code and one line of action.</p>' +
            '<p>The five codes, and what distinguishes each from the one next to it:</p>' +
            '<ul>' +
            '<li><code>SAI_LOAI_URL</code> — the served URL is the API endpoint, unsigned. A browser cannot produce a SigV4 signature from an <code>&lt;img&gt;</code> tag, so this reads <code>AccessDenied</code> forever.</li>' +
            '<li><code>NGOAI_PHAM_VI</code> — the custom domain is correct but the key sits outside the prefix the policy grants.</li>' +
            '<li><code>URL_HET_HAN</code> — a presigned URL whose signature verified; the body says <code>Request has expired</code>, which means the credentials and the policy are both fine.</li>' +
            '<li><code>CHU_KY_LECH</code> — also a presigned URL, but <code>SignatureDoesNotMatch</code>: the server and the client disagree about the signature itself.</li>' +
            '<li><code>XSS_LUU_TRU</code> — the read returned <b>200</b>, and it is the worst ticket of the five: the presign committed to <code>host</code> only, so the uploader replaced the content type and the bucket now serves an "image" as <code>text/html</code>.</li>' +
            '</ul>' +
            '<p>Two habits are being graded more than the answers. First, <b>read the <code>Message</code>, not just the <code>Code</code></b>: cases 3 and 4 are both 403 <code>AccessDenied</code>-shaped in a console log and lead to completely different rooms — one is a link lifecycle problem, the other is clock skew or a rotated key. Second, <b>a 200 is not a pass</b>: case 5 has no error at all, and the whole point is that nothing in the response status tells you the object is dangerous.</p>',

            '<p><b>Câu 5 — "Tải lên xanh mà ảnh vẫn 403" (chương 4 và 9).</b> Năm phiếu báo lỗi, cùng một dòng tiêu đề và năm nguyên nhân khác nhau. Khối mã cho sẵn đưa ra đúng những bằng chứng mà bạn sẽ thật sự thu thập được: URL ký sẵn đã cam kết những gì, object được lưu ra sao, frontend đang phục vụ URL nào, và một lượt đọc không xác thực trả về cái gì. Hãy viết <code>Q5/chan-doan.cjs</code> xuất ra ' + c('chanDoan(ve)') + ' trả về <code>[ma, viec]</code> — một mã nguyên nhân và một dòng việc cần làm.</p>' +
            '<p>Năm mã, và cái gì phân biệt từng cái với cái nằm cạnh nó:</p>' +
            '<ul>' +
            '<li><code>SAI_LOAI_URL</code> — URL đang phục vụ là endpoint API, chưa ký. Một trình duyệt không tạo nổi chữ ký SigV4 từ một thẻ <code>&lt;img&gt;</code>, nên cái này trả <code>AccessDenied</code> vĩnh viễn.</li>' +
            '<li><code>NGOAI_PHAM_VI</code> — tên miền tuỳ chỉnh đã đúng nhưng cái key nằm ngoài tiền tố mà chính sách cấp quyền.</li>' +
            '<li><code>URL_HET_HAN</code> — một URL ký sẵn mà chữ ký ĐÃ xác minh được; phần thân nói <code>Request has expired</code>, nghĩa là cả thông tin xác thực lẫn chính sách đều ổn.</li>' +
            '<li><code>CHU_KY_LECH</code> — cũng là URL ký sẵn, nhưng <code>SignatureDoesNotMatch</code>: máy chủ và client bất đồng về chính cái chữ ký.</li>' +
            '<li><code>XSS_LUU_TRU</code> — lượt đọc trả về <b>200</b>, và đây là phiếu tệ nhất trong năm phiếu: lượt ký sẵn chỉ cam kết <code>host</code>, nên bên tải lên đã thay kiểu nội dung và giờ bucket đang phục vụ một "tấm ảnh" dưới dạng <code>text/html</code>.</li>' +
            '</ul>' +
            '<p>Có hai thói quen bị chấm nặng hơn cả các đáp án. Một, <b>hãy đọc <code>Message</code> chứ đừng chỉ đọc <code>Code</code></b>: ca 3 và ca 4 trong một dòng log console đều mang hình dạng 403 <code>AccessDenied</code> và dẫn tới hai căn phòng hoàn toàn khác nhau — một cái là vấn đề vòng đời của liên kết, cái kia là lệch đồng hồ hoặc một cái khoá vừa xoay. Hai, <b>một cái 200 không phải một lượt đạt</b>: ca 5 hoàn toàn không có lỗi nào, và toàn bộ mấu chốt là chẳng có gì trong mã trạng thái của phản hồi nói cho bạn biết object đó đang nguy hiểm.</p>',
          ),
          starterCode: Q5_STARTER,
          expectedOutput: Q5_OUTPUT,
          sampleSolution: Q5_SOLUTION,
          rubric: rubric([
            ['nam',
              'All five tickets get the right cause code, and the two presigned-URL cases are separated by the <code>Message</code> field rather than by the status code they share.',
              'Cả năm phiếu đều ra đúng mã nguyên nhân, và hai ca URL ký sẵn được tách nhau bằng trường <code>Message</code> chứ không phải bằng cái mã trạng thái mà chúng dùng chung.',
              0.6],
            ['thutu',
              'The 200 case is caught before anything that keys on an error, so a diagnosis that only ever looks at failures does not miss it; the code recognises it by the combination of a <code>host</code>-only signature and a stored type of <code>text/html</code>.',
              'Ca 200 được bắt TRƯỚC mọi nhánh dựa vào lỗi, nhờ vậy một lượt chẩn đoán chỉ biết nhìn vào các cú hỏng thì không bỏ sót nó; đoạn mã nhận ra nó qua tổ hợp một chữ ký chỉ có <code>host</code> và một kiểu được lưu là <code>text/html</code>.',
              0.5],
            ['phanbiet',
              'The URL classification is done on the URL itself — whether it carries a signature, and whether its host is the API endpoint or the custom domain — so the two <code>AccessDenied</code> tickets are routed to the policy and to the URL builder respectively rather than to the same fix.',
              'Việc phân loại URL được làm trên chính cái URL — nó có mang chữ ký hay không, và host của nó là endpoint API hay tên miền tuỳ chỉnh — nhờ vậy hai phiếu <code>AccessDenied</code> được đưa lần lượt về phía chính sách và về phía bộ dựng URL chứ không cùng đổ về một cách chữa.',
              0.5],
            ['hanhdong',
              'Each action names a concrete change rather than a restatement of the symptom, and the actions are not interchangeable — signing per request, adding a header to <code>signableHeaders</code>, calling the public-URL builder, and checking clock skew each fix exactly one of the five.',
              'Mỗi dòng việc cần làm nêu một thay đổi CỤ THỂ chứ không phải một cách nói lại triệu chứng, và các việc đó không hoán đổi cho nhau được — ký lại ở mỗi request, thêm một header vào <code>signableHeaders</code>, gọi bộ dựng URL công khai, và kiểm lệch đồng hồ, mỗi cái chữa đúng một trong năm ca.',
              0.4],
          ]),
        }),
      ],
    },
  ],
};
