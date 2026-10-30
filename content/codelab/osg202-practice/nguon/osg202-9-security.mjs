/**
 * OSG202 · Chương 9 — Bảo mật: nguyên tắc, entropy mật khẩu, ma trận truy cập (ACL / capability).
 */
import { doiDau, KHOA, bi, hai, giai, tab, tinh, mc, tn } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Security 1 — Principles, attacks and defences (concepts)',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on operating-system security.</p>', '<p>Năm câu về bảo mật hệ điều hành.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['The CIA triad of security goals stands for …', 'Bộ ba mục tiêu bảo mật CIA là …'], [['a', 'Confidentiality, Integrity, Availability'], ['b', 'Control, Identity, Authorization'], ['c', 'Cryptography, Isolation, Auditing'], ['d', 'Capability, Inheritance, ACL']], 'a', ['Keep data secret, unmodified and accessible.', 'Giữ dữ liệu bí mật, không bị sửa và truy cập được.']),
    mc('c2', ['A TOCTOU (time-of-check to time-of-use) bug is …', 'Lỗi TOCTOU (time-of-check to time-of-use) là …'], [['a', 'a race: the state checked is changed before the checked state is used'], ['b', 'a buffer overflow caused by a missing check on the length'], ['c', 'a weak password that is checked once and reused later'], ['d', 'a disk error that shows up between a write and a read']], 'a', ['Example: access() says a file is OK, then an attacker swaps it with a symlink before open().', 'Ví dụ: access() báo tệp ổn, rồi kẻ tấn công đổi nó thành symlink trước open().']),
    mc('c3', ['SQL injection happens because …', 'SQL injection xảy ra vì …'], [['a', 'user input is concatenated into a query and interpreted as code'], ['b', 'the database is too slow to validate each query in time'], ['c', 'passwords are hashed, so the server compares the wrong text'], ['d', 'the query is cached and replayed for a different user']], 'a', ['Defence: parameterised queries (data never becomes code).', 'Phòng thủ: truy vấn tham số hoá (dữ liệu không bao giờ thành mã).']),
    mc('c4', ['Which defence makes the addresses of stack, heap and libraries unpredictable?', 'Biện pháp nào làm địa chỉ stack, heap và thư viện khó đoán?'], [['a', 'ASLR (address space layout randomisation)'], ['b', 'DEP (data execution prevention)'], ['c', 'CFI (control-flow integrity)'], ['d', 'Stack canaries (guard values)']], 'a', ['It makes return-to-libc and ROP attacks harder.', 'Nó làm các tấn công return-to-libc và ROP khó hơn.']),
    mc('c5', ['setuid root programs are dangerous because …', 'Chương trình setuid root nguy hiểm vì …'], [['a', 'a bug in them gives an attacker root rights'], ['b', 'they run slower because of extra permission checks'], ['c', 'they cannot read the files of ordinary users'], ['d', 'they use more memory than normal programs']], 'a', ['They run with the owner’s privileges regardless of who started them.', 'Chúng chạy với quyền của chủ sở hữu bất kể ai khởi động.']),
  ],
  goiY: ['Think CIA for goals; least privilege for design.', 'Injection = data interpreted as code.'],
  loiHayGap: ['Thinking encryption alone provides integrity.', 'Treating TOCTOU as a buffer overflow.'],
  thuatNgu: [tn('ASLR', 'ngẫu nhiên hoá bố cục không gian địa chỉ'), tn('setuid', 'chạy với quyền của chủ tệp')],
  khaiNiem: ['security goals', 'TOCTOU', 'injection', 'ASLR'],
});

const pw = [[26, 8, 'lowercase, 8 characters'], [62, 8, 'letters + digits, 8 characters'], [26, 12, 'lowercase, 12 characters'], [94, 16, 'printable ASCII, 16 characters'], [2048, 4, '4 random words from a 2048-word list']];
const bits = (c, l) => l * Math.log2(c);
const E2 = tinh({
  tieuDe: 'Security 2 — Password entropy',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>A random secret of length L over an alphabet of C symbols has entropy L × log₂(C) bits (a brute-force search needs on average 2^(bits−1) tries). Give the entropy in bits rounded to 1 decimal.</p>', '<p>Một bí mật ngẫu nhiên dài L trên bảng ký tự C ký hiệu có entropy L × log₂(C) bit (tìm vét cạn trung bình cần 2^(bit−1) lần thử). Cho entropy theo bit, làm tròn 1 chữ số thập phân.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Entropy', 'Entropy'),
    cot: [{ ma: 'p', ten: 'Secret' }, { ma: 'e', ten: 'Entropy (bits)' }],
    hang: pw.map(([, , n], i) => ({ ma: `p${i}`, o: { p: n } })),
    dapAn: Object.fromEntries(pw.map(([c, l], i) => [`p${i}.e`, [bits(c, l).toFixed(1), String(+bits(c, l).toFixed(1))]])),
    giaiThich: giai(pw.map(([c, l, n]) => `${n}: ${l}×log2(${c}) = ${bits(c, l).toFixed(1)}`).join('; ') + '. Length beats complexity: 12 lowercase letters (56.4 bits) beat 8 mixed ones (47.6 bits).', pw.map(([c, l, n]) => `${l}×log2(${c}) = ${bits(c, l).toFixed(1)}`).join('; ') + '. Độ dài thắng độ phức tạp: 12 chữ thường (56,4 bit) hơn 8 ký tự hỗn hợp (47,6 bit).'),
  }],
  goiY: ['log₂(26) = 4.70, log₂(62) = 5.95, log₂(94) = 6.55.', 'Multiply by the length.'],
  loiHayGap: ['Using log₁₀ instead of log₂.', 'Computing C^L and calling it “bits”.'],
  giaiThich: '<p>' + pw.map(([c, l]) => bits(c, l).toFixed(1)).join(' · ') + ' bits.</p>',
  thuatNgu: [tn('entropy', 'độ bất định của bí mật tính bằng bit')],
  khaiNiem: ['password entropy'],
});

const DOM = ['D1', 'D2', 'D3']; const OBJ = ['F1', 'F2', 'P1'];
const MAT = { D1: { F1: 'r', F2: '', P1: '' }, D2: { F1: 'rw', F2: 'r', P1: 'w' }, D3: { F1: '', F2: 'rw', P1: 'w' } };
const acl = (o) => DOM.filter((d) => MAT[d][o]).map((d) => `${d}:${MAT[d][o]}`).join(',');
const cap = (d) => OBJ.filter((o) => MAT[d][o]).map((o) => `${o}:${MAT[d][o]}`).join(',');
const E3 = tinh({
  tieuDe: 'Security 3 — From the access matrix to ACLs and capability lists',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi(`<p>The protection matrix (domains × objects; empty = no access):</p>${tab(['', ...OBJ], DOM.map((d) => [d, ...OBJ.map((o) => MAT[d][o] || '—')]))}<p>Write the ACL of each object (columns) as <code>domain:rights</code> pairs in domain order, separated by commas, and the capability list of each domain (rows) as <code>object:rights</code> pairs in object order.</p>`,
    `<p>Ma trận bảo vệ (miền × đối tượng; trống = không truy cập):</p>${tab(['', ...OBJ], DOM.map((d) => [d, ...OBJ.map((o) => MAT[d][o] || '—')]))}<p>Viết ACL của mỗi đối tượng (cột) thành các cặp <code>miền:quyền</code> theo thứ tự miền, cách nhau bằng dấu phẩy, và danh sách capability của mỗi miền (hàng) thành các cặp <code>đối tượng:quyền</code> theo thứ tự đối tượng.</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('ACL (by column) and capability list (by row)', 'ACL (theo cột) và capability (theo hàng)'),
    cot: [{ ma: 'q', ten: 'Question' }, { ma: 'a', ten: 'Answer' }],
    hang: [['f1', 'ACL of F1'], ['f2', 'ACL of F2'], ['p1', 'ACL of P1'], ['d1', 'Capabilities of D1'], ['d2', 'Capabilities of D2'], ['d3', 'Capabilities of D3']].map(([m, q]) => ({ ma: m, o: { q } })),
    dapAn: { 'f1.a': acl('F1'), 'f2.a': acl('F2'), 'p1.a': acl('P1'), 'd1.a': cap('D1'), 'd2.a': cap('D2'), 'd3.a': cap('D3') },
    giaiThich: giai('ACL = a column, stored with the object: ' + OBJ.map((o) => `${o} → ${acl(o)}`).join('; ') + '. Capability list = a row, held by the domain: ' + DOM.map((d) => `${d} → ${cap(d)}`).join('; ') + '.', 'ACL = một cột, lưu cùng đối tượng: ' + OBJ.map((o) => `${o} → ${acl(o)}`).join('; ') + '. Danh sách capability = một hàng, do miền giữ: ' + DOM.map((d) => `${d} → ${cap(d)}`).join('; ') + '.'),
  }],
  goiY: ['Column = ACL, row = capabilities.', 'Skip the empty cells.'],
  loiHayGap: ['Swapping rows and columns.', 'Listing domains with no rights.'],
  giaiThich: '<p>' + [acl('F1'), acl('F2'), acl('P1')].join(' · ') + ' / ' + [cap('D1'), cap('D2'), cap('D3')].join(' · ') + '</p>',
  thuatNgu: [tn('ACL', 'danh sách kiểm soát truy cập'), tn('capability', 'vé quyền do chủ thể nắm giữ'), tn('protection domain', 'miền bảo vệ')],
  khaiNiem: ['access matrix', 'ACL', 'capabilities'],
});

export default doiDau({
  slug: 'osg202-9-security',
  ten: '9.1 Security: principles, entropy, ACLs and capabilities',
  khoa: KHOA,
  baiHoc: 'osg202-on-ch9',
  de: [E1, E2, E3],
});
