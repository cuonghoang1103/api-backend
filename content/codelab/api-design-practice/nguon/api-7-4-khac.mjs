/** API Design · 7.5 — GraphQL và gRPC: độ sâu query (chống query đắt), varint của Protobuf (output thật trên LabFlow). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'GraphQL & gRPC 1 — What the measurements showed', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 7.5 (the same LabFlow data via REST /v2, GraphQL on :4001 and gRPC on :50051).',
  vi: 'Những điều từ bài 7.5 (cùng dữ liệu LabFlow qua REST /v2, GraphQL ở :4001 và gRPC ở :50051).',
  cau: [
    q('c1', ['The dashboard data: GraphQL 1 request / 838 B. REST needed …', 'Dữ liệu bảng điều khiển: GraphQL 1 request / 838 B. REST cần …'],
      ['7 requests and 3,335 B — every endpoint returns its full view', '1 request and 838 B — REST and GraphQL send the same bytes', '3 requests and 400 B — REST responses are always smaller', '20 requests and 30 KB — one request per booking returned'],
      ['1 for the labs + 3 for devices + 3 for bookings. Round trips matter more than bytes on mobile.', '1 cho danh sách phòng + 3 cho thiết bị + 3 cho lượt đặt. Trên di động, lượt đi-về đắt hơn byte.']),
    q('c2', ['With DataLoader the deep query made 3 database calls. What was still a problem?', 'Có DataLoader, query sâu chỉ hỏi CSDL 3 lần. Điều gì vẫn là vấn đề?'],
      ['The response was still 385 KB — clients control the cost; limit depth/complexity', 'DataLoader shares its cache between all users, so data leaks across requests', 'The server answered 500 because the query was nested too deeply', 'Nothing — DataLoader removes every cost of deep queries'],
      ['Without DataLoader: 2,524 calls. DataLoader fixes N+1, not the size of what a client may ask for. It must be created per request.', 'Không có DataLoader: 2.524 lần. DataLoader chữa N+1, không chữa kích thước thứ client được xin. Nó phải tạo mỗi request một cái.']),
    q('c3', ['Protobuf was 53% of JSON for 100 bookings. After gzip?', 'Với 100 lượt đặt, Protobuf bằng 53% JSON. Sau gzip thì sao?'],
      ['Almost equal: 1,089 B JSON vs 944 B Protobuf', 'Protobuf became 10× smaller than JSON', 'JSON became smaller than Protobuf', 'gzip cannot compress Protobuf at all'],
      ['Repetitive data compresses well in both. Size alone is rarely the reason to choose gRPC; strict contracts and streaming are.', 'Dữ liệu lặp nén tốt ở cả hai. Chỉ kích thước thì hiếm khi là lý do chọn gRPC; hợp đồng chặt và streaming mới là lý do.']),
    q('c4', ['In labflow.proto, which change breaks old clients?', 'Trong labflow.proto, thay đổi nào làm gãy client cũ?'],
      ['Changing the number of field status from 6 to 8', 'Renaming field lab_id to labId_code', 'Adding a new field note = 8', 'Adding a new enum value NO_SHOW = 4'],
      ['The field number travels on the wire; names do not. Reserve deleted numbers. New fields and values are preserved as unknown by old code.', 'Số của trường đi trên dây; tên thì không. Reserved các số đã xoá. Trường và giá trị mới được code cũ giữ lại như dữ liệu lạ.']),
  ],
  goiY: [['Which numbers were measured, and with what caveat?', 'Số nào đã đo, và kèm lưu ý gì?'], ['What travels on the wire in Protobuf: names or numbers?', 'Thứ đi trên dây ở Protobuf: tên hay số?']],
  loi: [['Thinking DataLoader limits query cost.', 'Nghĩ rằng DataLoader giới hạn chi phí query.'], ['Thinking a proto field name is what travels on the wire.', 'Nghĩ tên trường proto là thứ đi trên dây.']],
  tns: [tn('round trip', 'một lượt đi-về request/response'), tn('wire format', 'dạng byte thật đi trên mạng')],
  kn: ['GraphQL', 'gRPC'],
});

function queryDepth(query) {
  let depth = 0, max = 0, inString = false;
  for (let i = 0; i < query.length; i++) {
    const ch = query[i];
    if (inString) { if (ch === '\\') i++; else if (ch === '"') inString = false; continue; }
    if (ch === '"') inString = true;
    else if (ch === '#') { while (i < query.length && query[i] !== '\n') i++; }
    else if (ch === '{') max = Math.max(max, ++depth);
    else if (ch === '}') depth--;
  }
  return max;
}
const E2 = jsBai({
  ten: 'GraphQL & gRPC 2 — Write queryDepth(query): reject expensive GraphQL queries', kho: 'MEDIUM', phut: 15,
  en: `<p>Return the maximum nesting depth of selection sets (<code>{ … }</code>) in a GraphQL query string. Braces inside string literals (<code>"…"</code>, with <code>\\"</code> escapes) and comments (<code>#</code> to end of line) do not count. <code>{ labs { name } }</code> has depth 2.</p>`,
  vi: `<p>Trả về độ sâu lồng lớn nhất của các khối chọn trường (<code>{ … }</code>) trong một query GraphQL. Dấu ngoặc trong chuỗi (<code>"…"</code>, có <code>\\"</code> thoát) và trong chú thích (<code>#</code> tới hết dòng) không tính. <code>{ labs { name } }</code> có độ sâu 2.</p>`,
  dauVao: ['query — a GraphQL document as a string', 'query — một tài liệu GraphQL dạng chuỗi'],
  dauRa: ['an integer', 'một số nguyên'],
  goiY: [['Count +1 on {, −1 on }, remember the maximum.', 'Cộng 1 ở {, trừ 1 ở }, nhớ giá trị lớn nhất.'], ['Skip characters while inside a string.', 'Bỏ qua ký tự khi đang ở trong chuỗi.']],
  loi: [['Counting braces inside string arguments like "a{b".', 'Đếm cả ngoặc trong tham số chuỗi như "a{b".'], ['Returning the final depth (0) instead of the maximum.', 'Trả độ sâu cuối (0) thay vì lớn nhất.']],
  gt: ['The deep query of lesson 7.5 has depth 7 and produced 2,524 database calls; a server limit of 4 rejects it before any resolver runs.', 'Query sâu của bài 7.5 có độ sâu 7 và gây 2.524 lần hỏi CSDL; giới hạn 4 ở server từ chối nó trước khi resolver nào chạy.'],
  kn: ['GraphQL', 'security'],
  tns: [tn('selection set', 'khối { } liệt kê trường cần lấy'), tn('depth limit', 'giới hạn độ sâu query')],
  dau: `/** maximum nesting depth of a GraphQL query */
function queryDepth(query) {
  // Write your solution here
  return query.split('{').length - 1;
}
`,
  giai: '// Reference solution\n' + nguon(queryDepth),
  cases: [
    { goi: goi('queryDepth', '{ labs { name devices { name status } bookings(limit: 3) { start status } } }'), moTa: ['The dashboard query', 'Query bảng điều khiển'] },
    { goi: goi('queryDepth', '{ labs { bookings(limit: 20) { lab { bookings(limit: 20) { lab { bookings(limit: 20) { id } } } } } } }'), moTa: ['The deep query (lesson 7.5)', 'Query sâu (bài 7.5)'] },
    { goi: goi('queryDepth', '{ lab(id: "lab_{99}") { name } }'), an: true, moTa: ['Braces in a string', 'Ngoặc trong chuỗi'] },
    { goi: goi('queryDepth', '{ labs { name } # { { {\n }'), an: true, moTa: ['A comment', 'Chú thích'] },
    { goi: goi('queryDepth', '{ a { b } c { d { e } } }'), an: true },
    { goi: goi('queryDepth', '{ lab(id: "a\\"{") { name } }'), an: true },
  ],
});

function varint(n) {
  const out = [];
  do {
    let b = n % 128;
    n = Math.floor(n / 128);
    if (n > 0) b += 128;
    out.push(b);
  } while (n > 0);
  return out;
}
const E3 = jsBai({
  ten: 'GraphQL & gRPC 3 — Write varint(n): how Protobuf writes a number', kho: 'MEDIUM', phut: 15,
  en: `<p>Protocol Buffers store integers as <strong>varints</strong>: 7 bits per byte, least significant group first; every byte except the last has its top bit (128) set. Return the bytes for a non-negative integer <code>n</code> (up to 2<sup>53</sup>) as an array of numbers. <code>300</code> ⇒ <code>[172, 2]</code>.</p>`,
  vi: `<p>Protocol Buffers lưu số nguyên dạng <strong>varint</strong>: mỗi byte 7 bit, nhóm thấp nhất trước; mọi byte trừ byte cuối có bit cao nhất (128) bật. Trả về các byte của số nguyên không âm <code>n</code> (tới 2<sup>53</sup>) dạng mảng số. <code>300</code> ⇒ <code>[172, 2]</code>.</p>`,
  dauVao: ['n — a non-negative integer', 'n — số nguyên không âm'],
  dauRa: ['array of bytes (0–255)', 'mảng byte (0–255)'],
  goiY: [['n % 128 is the low 7 bits; Math.floor(n / 128) shifts right by 7.', 'n % 128 là 7 bit thấp; Math.floor(n / 128) dịch phải 7 bit.'], ['0 is one byte: [0].', '0 là một byte: [0].']],
  loi: [['Using >> on big numbers (32-bit in JavaScript).', 'Dùng >> với số lớn (JavaScript chỉ 32 bit).'], ['Setting the top bit on the last byte too.', 'Bật cả bit cao ở byte cuối.']],
  gt: ['Small numbers take one byte (status = 1), which is part of why 100 bookings were 9,132 B in Protobuf vs 17,170 B in JSON.', 'Số nhỏ chỉ tốn một byte (status = 1) — một phần lý do 100 lượt đặt chỉ 9.132 B ở Protobuf so với 17.170 B ở JSON.'],
  kn: ['gRPC', 'binary encoding'],
  tns: [tn('varint', 'số nguyên độ dài thay đổi'), tn('continuation bit', 'bit báo còn byte phía sau')],
  dau: `/** Protobuf varint bytes of n */
function varint(n) {
  // Write your solution here
  return [n % 256];
}
`,
  giai: '// Reference solution\n' + nguon(varint),
  cases: [
    { goi: goi('varint', 300), moTa: ['The example from the Protobuf docs', 'Ví dụ trong tài liệu Protobuf'] },
    { goi: goi('varint', 1), moTa: ['status = PENDING', 'status = PENDING'] },
    { goi: goi('varint', 0), an: true },
    { goi: goi('varint', 127), an: true },
    { goi: goi('varint', 128), an: true },
    { goi: goi('varint', 4294967296), an: true, moTa: ['Beyond 32 bits', 'Vượt 32 bit'] },
  ],
});

export default doiDau({ slug: 'api-7-4-khac', ten: '7.5 GraphQL and gRPC', khoa: KHOA, baiHoc: 'api-7-4-khac', de: [E1, E2, E3] });
