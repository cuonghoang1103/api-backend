/**
 * Kịch bản 8 — Tải file lên bằng presigned URL (Cloudflare R2 / S3).
 *
 * Kịch bản này dựng lại đúng hai lỗ hổng THẬT đã được vá trong dự án ngày
 * 28/07/2026: URL ký không ràng buộc Content-Type, và ảnh "bom giải nén".
 * Cả hai đều thuộc loại nguy hiểm nhất — code chạy đúng, test xanh, không
 * có exception nào, mà hệ thống vẫn thủng.
 */

import { CloudUpload } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'client', label: 'Browser', kind: 'client' as const, x: 100, y: 300, sublabel: { vi: 'Chọn ảnh đại diện', en: 'Picks an avatar' } },
  { id: 'api', label: 'API', kind: 'server' as const, x: 360, y: 300, sublabel: { vi: 'Ký URL · không nhận byte', en: 'Signs URLs · handles no bytes' } },
  { id: 'r2', label: 'Cloudflare R2', kind: 'storage' as const, x: 660, y: 130, sublabel: { vi: 'Object storage', en: 'Object storage' } },
  { id: 'worker', label: 'Image Worker', kind: 'worker' as const, x: 900, y: 300, sublabel: { vi: 'sharp · kiểm + resize', en: 'sharp · verify + resize' } },
  { id: 'db', label: 'PostgreSQL', kind: 'db' as const, x: 660, y: 480, sublabel: { vi: 'media · users', en: 'media · users' } },
];

const edges = [
  { id: 'e_client_api', from: 'client', to: 'api' },
  { id: 'e_client_r2', from: 'client', to: 'r2', curve: -150, label: { vi: 'PUT thẳng, không qua API', en: 'PUT direct, bypasses the API' } },
  { id: 'e_api_r2', from: 'api', to: 'r2' },
  { id: 'e_api_db', from: 'api', to: 'db' },
  { id: 'e_r2_worker', from: 'r2', to: 'worker' },
  { id: 'e_worker_db', from: 'worker', to: 'db' },
];

export const uploadScenario: Scenario = {
  id: 'upload',
  name: { vi: 'Tải file lên bằng presigned URL', en: 'Presigned URL file upload' },
  tagline: {
    vi: 'Vì sao file KHÔNG nên đi qua API của bạn — và hai lỗ hổng thật đã vá trong dự án này: Content-Type không được ký, và ảnh bom giải nén.',
    en: 'Why files should never pass through your API — plus two real vulnerabilities patched in this project: an unsigned Content-Type, and a decompression-bomb image.',
  },
  icon: CloudUpload,
  accent: '#f59e0b',
  lesson: {
    course: 'nodejs',
    code: '10.1',
    slug: 'nodejs-10-1-nhan-file-multipart',
    title: { vi: 'Nhận file: multipart, base64, và cái giá phải trả', en: 'Receiving files: multipart, base64 and the cost' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'flow',
      label: { vi: 'Kiến trúc', en: 'Architecture' },
      defaultValue: 'presign',
      choices: [
        { value: 'presign', label: 'Presigned URL', color: '#34d399', hint: { vi: 'Byte đi thẳng tới R2', en: 'Bytes go straight to R2' } },
        { value: 'proxy', label: 'Đẩy qua API', color: '#f43f5e', hint: { vi: 'API gánh toàn bộ băng thông', en: 'The API carries every byte' } },
      ],
    },
    {
      id: 'threat',
      label: { vi: 'Tình huống', en: 'Case' },
      defaultValue: 'none',
      choices: [
        { value: 'none', label: 'Bình thường', color: '#34d399' },
        { value: 'mime', label: 'Đánh tráo Content-Type', color: '#f43f5e', hint: { vi: 'Lỗ hổng thật, đã vá 28/07', en: 'Real vulnerability, patched 2026-07-28' } },
        { value: 'bomb', label: 'Ảnh bom giải nén', color: '#fb923c', hint: { vi: '4 KB → 1,6 GB RAM', en: '4 KB → 1.6 GB of RAM' } },
      ],
    },
  ],

  build({ flow = 'presign', threat = 'none' }) {
    const steps: SimStep[] = [];

    /* ── Nhánh đẩy file qua API (cách sai ở quy mô lớn) ────────── */
    if (flow === 'proxy') {
      steps.push({
        id: 'proxy-post',
        edge: 'e_client_api',
        kind: 'POST',
        duration: 2400,
        latencyMs: 8400,
        packetLabel: 'multipart 24 MB',
        title: { vi: 'Đẩy 24 MB qua API', en: 'Push 24 MB through the API' },
        detail: {
          vi: 'Toàn bộ file chảy qua tiến trình Node. Nghe thì đơn giản, nhưng hãy nhân lên: 50 người cùng tải ảnh 24 MB là 1,2 GB đi qua RAM và băng thông của một chiếc VPS 8 GB. Node chỉ có một luồng chính — trong lúc nó bận nhận byte thì mọi request khác phải xếp hàng.',
          en: 'The entire file flows through the Node process. Sounds simple, until you multiply: fifty concurrent 24 MB uploads is 1.2 GB through the RAM and bandwidth of one 8 GB VPS. Node has a single main thread — while it is busy receiving bytes, every other request queues behind it.',
        },
        nodeStates: { client: 'active', api: 'processing' },
        sfx: 'swoosh',
        teachingNote: {
          vi: 'Hỏi lớp: "API của bạn có nên là đường ống dẫn nước không?" — nó nên là bộ điều phối, không phải bộ vận chuyển.',
          en: 'Ask: "should your API be a water pipe?" — it should be a coordinator, not a courier.',
        },
      });
      steps.push({
        id: 'proxy-forward',
        edge: 'e_api_r2',
        kind: 'POST',
        duration: 1600,
        latencyMs: 5200,
        packetLabel: 'chuyển tiếp 24 MB',
        title: { vi: 'API lại chuyển tiếp 24 MB sang R2', en: 'The API forwards the same 24 MB to R2' },
        detail: {
          vi: 'Cùng một khối dữ liệu đi qua mạng HAI lần và qua RAM của bạn một lần. Bạn trả tiền băng thông gấp đôi, chịu độ trễ gấp đôi, và ôm thêm rủi ro hết bộ nhớ. Presigned URL sinh ra để xoá bỏ chính chặng thừa này.',
          en: 'The same payload crosses the network TWICE and passes through your RAM once. You pay double the bandwidth, wear double the latency and take on an out-of-memory risk. Presigned URLs exist precisely to delete this redundant hop.',
        },
        nodeStates: { r2: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'proxy-done',
        edge: 'e_client_api',
        reverse: true,
        kind: 'RESPONSE',
        duration: 1200,
        status: 201,
        packetLabel: '201 Created',
        title: { vi: 'Xong — nhưng đã tốn gấp đôi', en: 'Done — at twice the cost' },
        detail: {
          vi: 'Cách này chỉ chấp nhận được khi file nhỏ (dưới ~1 MB) hoặc khi bạn BẮT BUỘC phải kiểm nội dung trước khi lưu. Còn lại, hãy chuyển sang presigned URL và xem nhánh kia.',
          en: 'This is acceptable only for small files (under ~1 MB) or when you genuinely must inspect the content before storing it. Otherwise switch to presigned URLs and watch the other branch.',
        },
        nodeStates: { api: 'success', client: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── Xin URL ký sẵn ───────────────────────────────────────── */
    steps.push({
      id: 'ask',
      edge: 'e_client_api',
      kind: 'POST',
      duration: 1200,
      latencyMs: 42,
      packetLabel: 'POST /uploads/presign',
      title: { vi: 'Xin một URL ký sẵn', en: 'Ask for a presigned URL' },
      detail: {
        vi: 'Client chưa gửi byte nào của file — nó chỉ khai báo ý định: tên file, kiểu MIME, kích thước. Đây là lúc DUY NHẤT server còn quyền quyết định, nên mọi kiểm tra phải nằm ở đây. Sau khi URL được ký thì server hết đường can thiệp.',
        en: 'The client has not sent a single byte of the file — it only declares intent: filename, MIME type, size. This is the ONLY moment the server still holds power, so every check belongs here. Once the URL is signed, the server has no further say.',
      },
      payload: { filename: 'avatar.png', contentType: 'image/png', sizeBytes: 2_411_302 },
      nodeStates: { client: 'active', api: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'validate',
      at: 'api',
      kind: 'INTERNAL',
      duration: 1400,
      latencyMs: 3,
      title: { vi: 'Kiểm trước khi ký — chốt chặn quan trọng nhất', en: 'Validate before signing — the checkpoint that matters most' },
      detail: {
        vi: 'Bốn việc phải làm: (1) người dùng đã đăng nhập và có quyền tải lên; (2) MIME nằm trong danh sách TRẮNG (liệt kê cái được phép, không liệt kê cái bị cấm); (3) kích thước dưới trần; (4) TỰ SINH tên đối tượng, không dùng tên do client gửi — tên client gửi có thể là "../../index.html". URL chỉ sống 5 phút.',
        en: 'Four things: (1) the user is authenticated and allowed to upload; (2) the MIME type is on an ALLOW-list (enumerate what is permitted, never what is forbidden); (3) the size is under the cap; (4) the object key is generated SERVER-SIDE, never taken from the client — a client-supplied name can be "../../index.html". The URL lives five minutes.',
      },
      payload: {
        key: 'avatars/2026/07/u1-9f2c1a7e.png',
        allowedMime: ['image/png', 'image/jpeg', 'image/webp'],
        maxBytes: 10_485_760,
        expiresIn: 300,
      },
      nodeStates: { api: 'success' },
      sfx: 'lock',
    });

    steps.push({
      id: 'sign',
      edge: 'e_client_api',
      reverse: true,
      kind: 'TOKEN',
      duration: 1200,
      status: 200,
      packetLabel: 'URL ký sẵn',
      title: {
        vi: threat === 'mime' ? 'Trả URL — nhưng chữ ký THIẾU Content-Type' : 'Trả URL đã ký, có ràng buộc Content-Type',
        en: threat === 'mime' ? 'Return the URL — but the signature OMITS Content-Type' : 'Return the signed URL, with Content-Type bound in',
      },
      detail: {
        vi:
          threat === 'mime'
            ? 'Đây chính là lỗ hổng thật của dự án. Chữ ký chỉ bao gồm đường dẫn và hạn dùng, KHÔNG bao gồm Content-Type. Nghĩa là URL này cho phép tải lên bất cứ thứ gì, không riêng ảnh PNG. Server đã kiểm MIME rất cẩn thận ở bước trước — nhưng kiểm xong rồi không ký vào thì kết quả kiểm chẳng ràng buộc được ai.'
            : 'Chữ ký bao gồm cả Content-Type. Đây là chi tiết một dòng nhưng quyết định: nó biến kết quả kiểm ở bước trước thành một điều kiện mà R2 sẽ tự cưỡng chế. Ký cái gì thì cái đó mới được bảo vệ — kiểm mà không ký bằng thừa.',
        en:
          threat === 'mime'
            ? 'This is the project\'s real vulnerability. The signature covers the path and the expiry but NOT the Content-Type. Meaning this URL accepts anything at all, not just a PNG. The server validated the MIME type very carefully one step ago — but a check that is not folded into the signature binds nobody.'
            : 'The signature covers Content-Type as well. It is a one-line detail that decides everything: it turns the previous step\'s check into a condition R2 itself will enforce. Only what you sign is protected — validating without signing is theatre.',
      },
      headers:
        threat === 'mime'
          ? { 'X-Signed-Headers': 'host' }
          : { 'X-Signed-Headers': 'host;content-type', 'X-Amz-Expires': '300' },
      nodeStates: { client: 'success', api: threat === 'mime' ? 'error' : 'success' },
      sfx: threat === 'mime' ? 'buzz' : 'ping',
      teachingNote:
        threat === 'mime'
          ? {
              vi: 'Điểm dừng đắt nhất kịch bản: "đã kiểm rồi mà vẫn thủng". Nguyên nhân là kết quả kiểm không được đưa vào chữ ký, nên không ai bị ràng buộc bởi nó.',
              en: 'The scenario\'s most valuable pause: "we validated and were still breached." The check never entered the signature, so nothing was bound by it.',
            }
          : undefined,
    });

    /* ── Tải thẳng lên R2 ─────────────────────────────────────── */
    steps.push({
      id: 'put',
      edge: 'e_client_r2',
      kind: threat === 'mime' ? 'DELETE' : 'PUT',
      duration: 1700,
      latencyMs: 1900,
      packetLabel:
        threat === 'mime' ? 'PUT text/html 😈' : threat === 'bomb' ? 'PUT 4 KB (20000×20000)' : 'PUT image/png 2,4 MB',
      title: {
        vi: threat === 'mime' ? 'Kẻ tấn công đổi Content-Type thành text/html' : 'Byte đi THẲNG tới R2 — không chạm API',
        en: threat === 'mime' ? 'The attacker switches Content-Type to text/html' : 'Bytes go STRAIGHT to R2 — the API is untouched',
      },
      detail: {
        vi:
          threat === 'mime'
            ? 'URL ký sẵn vẫn còn hạn, nhưng người tải lên thay Content-Type thành text/html và gửi một trang HTML chứa mã JavaScript. Vì chữ ký không phủ header này nên R2 không có gì để từ chối — nó lưu đúng như được yêu cầu.'
            : 'Hãy nhìn đường cong này: nó nối thẳng trình duyệt tới R2, không đi qua API. Đó là toàn bộ giá trị của presigned URL — API của bạn không nhìn thấy một byte nào của file, không tốn RAM, không tốn băng thông, và có thể phục vụ hàng nghìn lượt tải lên cùng lúc mà vẫn nhàn.',
        en:
          threat === 'mime'
            ? 'The presigned URL is still valid, but the uploader swaps Content-Type to text/html and sends an HTML page containing JavaScript. Because the signature does not cover that header, R2 has nothing to refuse on — it stores exactly what it was asked to.'
            : 'Follow that curve: it connects the browser directly to R2, bypassing the API. That is the whole point of a presigned URL — your API never sees a byte of the file, spends no RAM, no bandwidth, and can sit idle through thousands of concurrent uploads.',
      },
      headers: threat === 'mime' ? { 'Content-Type': 'text/html' } : { 'Content-Type': 'image/png' },
      nodeStates: { r2: threat === 'mime' ? 'error' : 'processing', api: 'idle' },
      sfx: threat === 'mime' ? 'error' : 'swoosh',
    });

    if (threat === 'mime') {
      steps.push({
        id: 'stored-xss',
        at: 'r2',
        kind: 'ERROR',
        duration: 1600,
        title: { vi: 'Trang HTML nằm trên tên miền CDN của bạn', en: 'An HTML page now lives on your CDN domain' },
        detail: {
          vi: 'File được phục vụ từ media.cuongthai.com với Content-Type text/html, nên trình duyệt sẽ THỰC THI nó. Kẻ tấn công gửi link cho người dùng đã đăng nhập, script chạy dưới tên miền của bạn, đọc được cookie và localStorage của miền đó. Đây là stored XSS, và nó không cần một dòng code lỗi nào ở phía backend.',
          en: 'The file is served from media.cuongthai.com with Content-Type text/html, so the browser will EXECUTE it. The attacker sends the link to a logged-in user, the script runs under your domain and can read that domain\'s cookies and localStorage. That is stored XSS, and it required no buggy backend code at all.',
        },
        payload: { url: 'https://media.cuongthai.com/avatars/2026/07/u1-9f2c1a7e.png', servedAs: 'text/html', risk: 'stored XSS' },
        nodeStates: { r2: 'error' },
        sfx: 'error',
      });
      steps.push({
        id: 'fix-mime',
        edge: 'e_api_r2',
        kind: 'RESPONSE',
        duration: 1600,
        title: { vi: 'Cách vá: ký cả Content-Type', en: 'The fix: sign the Content-Type too' },
        detail: {
          vi: 'Đưa content-type vào danh sách header được ký. Từ đó, tải lên với kiểu khác chữ ký là R2 trả 403 — không cần thêm bất kỳ đoạn kiểm tra nào ở phía bạn, chính R2 cưỡng chế. Nên làm kèm hai lớp nữa: đặt Content-Disposition: attachment cho file người dùng tải lên, và phục vụ chúng từ một tên miền RIÊNG không dùng chung cookie với ứng dụng chính.',
          en: 'Add content-type to the signed-headers list. From then on, uploading a different type than signed gets a 403 straight from R2 — no extra check on your side, the storage enforces it. Pair it with two more layers: set Content-Disposition: attachment on user uploads, and serve them from a SEPARATE domain that shares no cookies with the main app.',
        },
        payload: { signedHeaders: 'host;content-type', onMismatch: '403 SignatureDoesNotMatch' },
        nodeStates: { r2: 'success', api: 'success' },
        sfx: 'lock',
      });
      return steps;
    }

    steps.push({
      id: 'notify',
      edge: 'e_client_api',
      kind: 'POST',
      duration: 1200,
      latencyMs: 38,
      packetLabel: 'POST /uploads/complete',
      title: { vi: 'Client báo "đã tải xong"', en: 'Client reports "upload finished"' },
      detail: {
        vi: 'Vì API không tham gia vào việc truyền file, nó cần được báo. Và tuyệt đối KHÔNG tin lời báo này: server phải tự gọi HEAD lên R2 để xác nhận đối tượng có thật, đúng kích thước, đúng kiểu. Client nói gì cũng chỉ là gợi ý.',
        en: 'Because the API took no part in the transfer, it needs to be told. And it must NOT trust what it is told: the server should HEAD the object on R2 to confirm it exists, with the expected size and type. Anything the client says is a hint, never a fact.',
      },
      payload: { key: 'avatars/2026/07/u1-9f2c1a7e.png' },
      nodeStates: { api: 'processing', client: 'idle' },
      sfx: 'blip',
    });

    steps.push({
      id: 'enqueue',
      edge: 'e_r2_worker',
      kind: 'EVENT',
      duration: 1300,
      packetLabel: 'job: xử lý ảnh',
      title: { vi: 'Đẩy việc xử lý sang worker', en: 'Hand processing off to a worker' },
      detail: {
        vi: 'Người dùng đã có thể đi tiếp. Việc nặng (kiểm ảnh, tạo 4 kích cỡ, chuyển webp) chạy nền — đúng mô hình của kịch bản Microservices. Ảnh gốc tạm thời chưa hiển thị công khai cho tới khi worker duyệt xong.',
        en: 'The user can move on. The heavy work (validating the image, generating four sizes, converting to webp) runs in the background — the same pattern as the Microservices scenario. The original stays non-public until the worker has cleared it.',
      },
      nodeStates: { worker: 'processing' },
      sfx: 'swoosh',
    });

    if (threat === 'bomb') {
      steps.push({
        id: 'bomb',
        at: 'worker',
        kind: 'ERROR',
        duration: 1800,
        latencyMs: 12000,
        title: { vi: 'Ảnh 4 KB nở ra 1,6 GB trong RAM', en: 'A 4 KB image expands to 1.6 GB of RAM' },
        detail: {
          vi: 'File PNG chỉ 4 KB nên vượt qua mọi kiểm tra kích thước. Nhưng bên trong khai báo 20.000 × 20.000 điểm ảnh. Khi sharp giải nén: 20000 × 20000 × 4 byte = 1,6 GB. VPS 8 GB có vài worker chạy song song là hết bộ nhớ, tiến trình bị hệ điều hành giết (exit 137), hàng đợi tắc.',
          en: 'The PNG is only 4 KB, so it passes every size check. But its header declares 20,000 × 20,000 pixels. When sharp decompresses: 20000 × 20000 × 4 bytes = 1.6 GB. With a few workers in parallel on an 8 GB VPS the memory is gone, the OS kills the process (exit 137) and the queue backs up.',
        },
        payload: { fileBytes: 4096, declaredPixels: 400_000_000, decompressedBytes: 1_600_000_000, ratio: '390000:1' },
        nodeStates: { worker: 'error' },
        sfx: 'error',
        log: { vi: 'Killed process 8821 (node) total-vm:2.1GB · exit 137', en: 'Killed process 8821 (node) total-vm:2.1GB · exit 137' },
        teachingNote: {
          vi: 'Bài học chung: giới hạn theo BYTE là chưa đủ, phải giới hạn theo thứ SẼ NỞ RA. Cùng nguyên lý với zip bomb và XML billion-laughs.',
          en: 'The general lesson: limiting BYTES is not enough, you must limit what those bytes EXPAND INTO. Same principle as zip bombs and the XML billion-laughs attack.',
        },
      });
      steps.push({
        id: 'fix-bomb',
        edge: 'e_worker_db',
        kind: 'RESPONSE',
        duration: 1500,
        title: { vi: 'Cách vá: chặn theo SỐ ĐIỂM ẢNH, không theo dung lượng', en: 'The fix: cap PIXELS, not bytes' },
        detail: {
          vi: 'sharp có tuỳ chọn limitInputPixels — đặt trần (ví dụ 100 triệu điểm ảnh) thì nó từ chối NGAY khi đọc header, trước khi cấp phát một byte bộ nhớ nào. Kèm theo: đọc metadata trước để kiểm width/height, đặt trần bộ nhớ cho container worker, và đưa file hỏng vào DLQ thay vì thử lại vô tận.',
          en: 'sharp exposes limitInputPixels — set a ceiling (say 100 million pixels) and it refuses at header-parse time, before allocating a single byte. Alongside it: read metadata first to check width/height, cap the worker container\'s memory, and route poisoned files to a DLQ instead of retrying forever.',
        },
        payload: { limitInputPixels: 100_000_000, onExceed: 'reject before allocation', containerMemLimit: '512m' },
        nodeStates: { worker: 'success', db: 'success' },
        sfx: 'lock',
      });
      return steps;
    }

    steps.push({
      id: 'process',
      at: 'worker',
      kind: 'INTERNAL',
      duration: 1500,
      latencyMs: 3100,
      title: { vi: 'Kiểm thật rồi mới tạo các kích cỡ', en: 'Verify for real, then generate the sizes' },
      detail: {
        vi: 'Bước kiểm quan trọng nhất diễn ra ở đây, không phải ở phần mở rộng tên file: đọc "số phép thuật" trong vài byte đầu để biết đây có đúng là PNG không. Đuôi .png và header Content-Type đều do người tải lên tự khai — chỉ nội dung file mới là sự thật.',
        en: 'The check that counts happens here, not on the file extension: read the magic bytes at the head of the file to confirm it really is a PNG. Both the .png suffix and the Content-Type header are claims made by the uploader — only the bytes are evidence.',
      },
      payload: { magic: '89 50 4E 47', format: 'png', width: 1024, height: 1024, variants: ['128w', '256w', '512w', '1024w'] },
      nodeStates: { worker: 'success' },
      sfx: 'ping',
    });

    steps.push({
      id: 'record',
      edge: 'e_worker_db',
      kind: 'POST',
      duration: 1200,
      latencyMs: 11,
      packetLabel: 'INSERT media',
      title: { vi: 'Ghi bản ghi và công khai ảnh', en: 'Record the row and publish the image' },
      detail: {
        vi: 'CSDL chỉ lưu KHOÁ đối tượng, không lưu URL đầy đủ. Đổi tên miền CDN sau này chỉ là đổi một biến môi trường, thay vì phải chạy UPDATE trên hàng triệu dòng.',
        en: 'The database stores the object KEY, never a full URL. Changing CDN domain later becomes an environment-variable edit instead of an UPDATE across millions of rows.',
      },
      payload: { id: 9921, key: 'avatars/2026/07/u1-9f2c1a7e.png', width: 1024, height: 1024, status: 'READY' },
      nodeStates: { db: 'success' },
      sfx: 'click',
    });

    steps.push({
      id: 'done',
      edge: 'e_api_db',
      reverse: true,
      kind: 'RESPONSE',
      duration: 1200,
      status: 200,
      packetLabel: 'ảnh sẵn sàng',
      title: { vi: 'Hoàn tất — API chưa từng chạm vào file', en: 'Done — the API never touched the file' },
      detail: {
        vi: 'Nhìn lại toàn cảnh: API chỉ ký một URL và ghi một dòng dữ liệu. 2,4 MB byte đi thẳng từ trình duyệt tới R2. Kiến trúc này giữ nguyên hiệu năng dù file 5 MB hay 5 GB — vì phần tốn kém không bao giờ chạm tới máy chủ của bạn.',
        en: 'Step back and look: the API signed one URL and wrote one row. All 2.4 MB went browser-to-R2 directly. This shape performs identically whether the file is 5 MB or 5 GB — because the expensive part never touches your server.',
      },
      nodeStates: { api: 'success', client: 'success' },
      sfx: 'success',
    });

    return steps;
  },
};
