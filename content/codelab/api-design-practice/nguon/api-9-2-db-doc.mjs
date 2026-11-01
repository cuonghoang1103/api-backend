/** API Design · 9.3 — Đọc-sau-ghi với replica: LSN, token nhất quán (output thật bài 9.3). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Read-after-write 1 — The note that vanished', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 9.3 (PostgreSQL 18 primary :55432, streaming replica :55433 with a 2 s apply delay).',
  vi: 'Những điều từ bài 9.3 (PostgreSQL 18 primary :55432, replica streaming :55433 trễ áp dụng 2 giây).',
  cau: [
    q('c1', ['Right after POST created note_2, GET /v2/notes/note_2 answered 404. Why?', 'Ngay sau khi POST tạo note_2, GET /v2/notes/note_2 trả 404. Vì sao?'],
      ['The read went to the replica, which had not applied the commit yet', 'The POST was rolled back by the replica', 'The 404 was cached by the browser', 'The note id is only valid after one minute'],
      ['2.5 s later the same GET was 200. Nothing was broken; the copy was behind.', '2,5 giây sau cùng GET ra 200. Không gì hỏng; bản sao chỉ chậm.']),
    q('c2', ['The first read after creating the lab_notes table returned 500. What does that teach?', 'Lần đọc đầu sau khi tạo bảng lab_notes trả 500. Điều đó dạy gì?'],
      ['Schema changes lag too: wait for replicas before shipping code that reads the new table from them', 'Replicas cannot store tables created after they started', 'CREATE TABLE must always run on the replica first', '500 is the correct status for a missing table'],
      ['“relation does not exist” on the replica: migrate, wait for catch-up, then deploy the readers.', '“relation does not exist” trên replica: migrate, chờ đuổi kịp, rồi mới triển khai phần đọc.']),
    q('c3', ['Which fix also covers the user’s OTHER devices and later screens?', 'Cách sửa nào lo được cả thiết bị KHÁC và các màn hình sau của người dùng?'],
      ['A consistency token from the write, sent back on reads', 'Returning the created note in the 201 body', 'Retrying the GET three times immediately', 'Disabling the HTTP cache with no-store'],
      ['The 201 body covers only the screen that wrote. The token (an LSN) lets any read demand “at least this version”.', 'Body 201 chỉ lo màn hình vừa ghi. Token (một LSN) cho mọi lần đọc đòi “ít nhất là phiên bản này”.']),
  ],
  goiY: [['Where did each request go?', 'Mỗi request đi tới đâu?'], ['What does the token carry?', 'Token mang gì?']],
  loi: [['Sending every read to the primary.', 'Đẩy mọi lần đọc về primary.'], ['Blaming the API code for replication lag.', 'Đổ lỗi cho code API vì độ trễ nhân bản.']],
  tns: [tn('replication lag', 'độ trễ nhân bản'), tn('read-your-writes', 'đọc thấy cái mình vừa ghi')],
  kn: ['consistency'],
});

function lsnAtLeast(replay, token) {
  const toNum = (lsn) => {
    const m = /^([0-9A-Fa-f]{1,8})\/([0-9A-Fa-f]{1,8})$/.exec(lsn);
    if (!m) return null;
    return parseInt(m[1], 16) * 2 ** 32 + parseInt(m[2], 16);
  };
  const a = toNum(replay), b = toNum(token);
  if (a === null || b === null) return null;
  return a >= b;
}
const E2 = jsBai({
  ten: 'Read-after-write 2 — Write lsnAtLeast(replay, token)', kho: 'MEDIUM', phut: 12,
  en: `<p>A PostgreSQL LSN is written <code>X/Y</code>: two hexadecimal numbers (up to 8 digits each), the high and low 32 bits of a 64-bit position. Return whether the replica’s replay position <code>replay</code> is at or after <code>token</code> — the check behind <code>LabFlow-Consistency</code>. A malformed value ⇒ <code>null</code>.</p>`,
  vi: `<p>LSN của PostgreSQL viết dạng <code>X/Y</code>: hai số thập lục phân (tối đa 8 chữ số mỗi số), là 32 bit cao và 32 bit thấp của một vị trí 64 bit. Trả về việc vị trí đã áp dụng của replica <code>replay</code> có bằng hoặc sau <code>token</code> không — đúng phép kiểm đứng sau <code>LabFlow-Consistency</code>. Giá trị sai dạng ⇒ <code>null</code>.</p>`,
  dauVao: ['replay, token — strings like "0/12025438"', 'replay, token — chuỗi dạng "0/12025438"'],
  dauRa: ['true | false | null', 'true | false | null'],
  goiY: [['Compare the high part first, then the low part.', 'So phần cao trước, rồi phần thấp.'], ['parseInt(x, 16) reads hexadecimal.', 'parseInt(x, 16) đọc số thập lục phân.']],
  loi: [['Comparing the strings — "0/9" > "0/12025438" as text.', 'So chuỗi — "0/9" > "0/12025438" theo chữ.'], ['Ignoring the part before the slash.', 'Bỏ qua phần trước dấu gạch.']],
  gt: ['In lesson 9.3 the token was 0/12025438; the replica answered pg_last_wal_replay_lsn() >= token only after it had replayed the write.', 'Ở bài 9.3 token là 0/12025438; replica chỉ trả pg_last_wal_replay_lsn() >= token sau khi đã áp dụng lệnh ghi.'],
  kn: ['consistency', 'PostgreSQL'],
  tns: [tn('LSN', 'vị trí trong WAL'), tn('hexadecimal', 'thập lục phân')],
  dau: `/** has the replica replayed at least up to token? */
function lsnAtLeast(replay, token) {
  // Write your solution here
  return replay >= token;
}
`,
  giai: '// Reference solution\n' + nguon(lsnAtLeast),
  cases: [
    { goi: goi('lsnAtLeast', '0/12025438', '0/12025438'), moTa: ['Caught up exactly', 'Vừa đuổi kịp'] },
    { goi: goi('lsnAtLeast', '0/9FFFFFF', '0/12025438'), moTa: ['Still behind (text comparison would lie)', 'Còn chậm (so chữ sẽ nói sai)'] },
    { goi: goi('lsnAtLeast', '1/0', '0/FFFFFFFF'), an: true },
    { goi: goi('lsnAtLeast', '0/12025438', 'abc'), an: true },
    { goi: goi('lsnAtLeast', '0/1A', '0/9'), an: true },
  ],
});

export default doiDau({ slug: 'api-9-2-db-doc', ten: '9.3 Read-after-write: replicas and stale reads', khoa: KHOA, baiHoc: 'api-9-2-db-doc', de: [E1, E2] });
