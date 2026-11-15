/**
 * ch11/_rieng.mjs — hàm dựng bài RIÊNG của Chương 11 (phỏng vấn thử + lộ trình). Đề xuất đưa `bangChamDiem` và
 * `bienBan` vào _chung.mjs nếu khoá khác (interview-prep) cần cùng phiếu chấm — xem _tien-do/ch11.md.
 */
import { lc, baiNay } from '../_chung.mjs';
import { tinhLich } from '../ma/ch11/b1/lo-trinh.vet.mjs';

/** Một bước trong sơ đồ lz-flow. */
export const THE = (k, t, d) => `<div class="lz-step"><span class="lz-k">${k}</span><span class="lz-t">${t}</span><span class="lz-d">${d}</span></div>`;

/* ── Phiếu chấm 4 trục × thang 1–4 (bài 0.8: communication · problem solving · technical competency · testing) ── */
const TRUC = {
  en: [
    ['Communication', [
      'Silent for 5+ minutes at a stretch; starts coding without a single question; the interviewer has to ask "what are you thinking?" more than once.',
      'Talks, but only reads the code aloud ("i goes from 0…") without saying why; 0–1 clarifying questions; long, unfocused answers.',
      'Asks 2+ useful clarifying questions (empty input? duplicates? limits?), states the approach before coding, asks "shall I code this?", takes a hint and uses it.',
      'Everything in 3, plus names a trade-off between two approaches, summarises where they are when switching phase, concise — the interviewer never has to pull.',
    ]],
    ['Problem solving', [
      'No working idea, not even brute force; or needs all three hints and still does not get there.',
      'Gets the brute force; reaches the optimal idea only after hint 2 or 3; complexity missing or wrong.',
      'Brute force → optimal with at most hint 1; states time AND space complexity correctly.',
      'Reaches the optimal idea without hints, explains why it is correct (the invariant), and handles at least one follow-up.',
    ]],
    ['Technical competency', [
      'Code does not run or is not finished; many syntax errors; does not remember basic APIs (Map, a stack, sorting with a comparator).',
      'Code is finished but has a logic bug the interviewer has to point out; names like a, b, tmp; copy-pasted blocks.',
      'Code runs correctly, is readable, uses meaningful names and the right data structures of the language; small slips are self-corrected.',
      'Compact, well-split code with no dead lines, written fast (Easy ≤ 10′ of typing, Medium ≤ 15′), correct on the first run.',
    ]],
    ['Testing', [
      'No testing; says "done" and stops.',
      'Only runs the given example, or traces what the code was <em>meant</em> to do instead of what it does.',
      'Traces one normal example and 2 edge cases (empty / one element / duplicates / negatives) line by line through the actual code; finds the bug if there is one.',
      'Everything in 3, plus picks edge cases <em>on purpose</em> (aimed at the off-by-one, the overflow, the empty stack), states the expected output before tracing, proposes a stress test.',
    ]],
  ],
  vi: [
    ['Communication (giao tiếp)', [
      'Im lặng liền 5 phút trở lên; bắt đầu code mà không hỏi câu nào; người phỏng vấn phải hỏi "bạn đang nghĩ gì?" hơn một lần.',
      'Có nói, nhưng chỉ đọc lại code ("i chạy từ 0…") mà không nói vì sao; hỏi làm rõ 0–1 câu; trả lời dài, lan man.',
      'Hỏi 2 câu làm rõ có ích trở lên (rỗng? trùng? giới hạn?), nói hướng đi trước khi code, hỏi "em code bản này nhé?", nhận gợi ý và dùng được.',
      'Như mức 3, thêm: nêu được đánh đổi giữa hai cách, tóm lại mình đang ở đâu mỗi khi chuyển pha, nói gọn — người phỏng vấn không bao giờ phải "kéo".',
    ]],
    ['Problem solving (giải quyết vấn đề)', [
      'Không có ý tưởng chạy được nào, kể cả vét cạn; hoặc cần đủ ba gợi ý mà vẫn không tới.',
      'Ra được vét cạn; chỉ tới ý tối ưu sau gợi ý 2 hoặc 3; không nói hoặc nói sai độ phức tạp.',
      'Đi từ vét cạn tới tối ưu với tối đa gợi ý 1; nói đúng cả độ phức tạp thời gian LẪN bộ nhớ.',
      'Tự tới ý tối ưu không cần gợi ý, giải thích vì sao đúng (bất biến — invariant), và xử lý được ít nhất một câu hỏi nối tiếp.',
    ]],
    ['Technical competency (năng lực kỹ thuật — code)', [
      'Code không chạy hoặc không xong; sai cú pháp nhiều; không nhớ API cơ bản (Map, stack, sắp xếp có comparator).',
      'Code xong nhưng có lỗi logic người phỏng vấn phải chỉ ra; tên biến a, b, tmp; chép–dán khối lặp.',
      'Code chạy đúng, dễ đọc, tên có nghĩa, dùng đúng cấu trúc dữ liệu của ngôn ngữ; lỗi nhỏ tự phát hiện và tự sửa.',
      'Code gọn, tách hàm hợp lý, không dòng thừa, gõ nhanh (Easy ≤ 10′ gõ, Medium ≤ 15′), đúng ngay lần chạy đầu.',
    ]],
    ['Testing (kiểm thử)', [
      'Không test; nói "xong rồi" là dừng.',
      'Chỉ chạy ví dụ của đề, hoặc chạy tay theo điều code <em>định</em> làm chứ không theo điều code <em>thật sự</em> làm.',
      'Chạy tay một ví dụ thường và 2 ca biên (rỗng / một phần tử / trùng / số âm) qua đúng từng dòng code; tìm ra lỗi nếu có.',
      'Như mức 3, thêm: chọn ca biên CÓ CHỦ Ý (nhắm vào chỗ lệch một, tràn số, ngăn xếp rỗng), nói kết quả mong đợi TRƯỚC khi chạy, đề xuất test ngẫu nhiên đối chiếu.',
    ]],
  ],
};

/**
 * Phiếu chấm. rieng = { en: [4 câu], vi: [4 câu] } — "mức 4 trên ĐỀ NÀY trông thế nào" cho từng trục (tuỳ chọn).
 */
export function bangChamDiem(lang, rieng = null) {
  const en = lang === 'en';
  const dau = en ? ['Axis', '1 — clear no', '2 — weak', '3 — solid', '4 — strong'] : ['Trục', '1 — không đạt', '2 — yếu', '3 — đạt', '4 — xuất sắc'];
  const hang = TRUC[lang].map(([ten, muc], i) => {
    const them = rieng ? `<br><small><em>${en ? 'On this set: ' : 'Ở bộ này: '}${rieng[lang][i]}</em></small>` : '';
    return `<tr><td><strong>${ten}</strong>${them}</td>${muc.map((m) => `<td>${m}</td>`).join('')}</tr>`;
  }).join('\n');
  return `<table class="bang-cham">\n<thead><tr>${dau.map((d) => `<th>${d}</th>`).join('')}</tr></thead>\n<tbody>\n${hang}\n</tbody></table>`;
}

/** Ngưỡng kết luận (giống nhau ở cả ba bộ). */
export function nguongKetLuan(lang) {
  if (lang === 'en') {
    return `<div class="kv-grid">
  <div class="kv"><span class="k">✅ Hire</span><span class="v">Every axis ≥ 3 (so the total is at least 12/16), <strong>and</strong> problem 1 has working, tested code. (Real companies also have "Strong hire": every axis 4.)</span></div>
  <div class="kv"><span class="k">🟡 Lean hire</span><span class="v">Exactly one axis is 2, the other three ≥ 3, and problem 1 has working code. "Would hire if another round is strong."</span></div>
  <div class="kv"><span class="k">❌ No hire</span><span class="v">Any axis is 1, <strong>or</strong> two or more axes are 2, <strong>or</strong> problem 1 never ran correctly — regardless of the total.</span></div>
</div>`;
  }
  return `<div class="kv-grid">
  <div class="kv"><span class="k">✅ Hire (nhận)</span><span class="v">Mọi trục ≥ 3 (nên tổng ít nhất 12/16), <strong>và</strong> đề 1 có code chạy đúng, đã test. (Công ty thật còn có mức "Strong hire — rất nên nhận": mọi trục đều 4.)</span></div>
  <div class="kv"><span class="k">🟡 Lean hire (nghiêng về nhận)</span><span class="v">Đúng một trục được 2, ba trục còn lại ≥ 3, và đề 1 có code chạy được. Nghĩa là "nhận nếu vòng khác tốt".</span></div>
  <div class="kv"><span class="k">❌ No hire (không nhận)</span><span class="v">Có trục bị 1, <strong>hoặc</strong> từ hai trục trở lên bị 2, <strong>hoặc</strong> đề 1 chưa bao giờ chạy đúng — bất kể tổng điểm bao nhiêu.</span></div>
</div>`;
}

/** Mẫu biên bản sau buổi thử — chép ra sổ (bảng chữ, không phải mã). */
export function bienBan(lang, boSo) {
  const en = lang === 'en';
  const r = en ? [
    ['Date · set · interviewer', `__/__/2026 · mock set ${boSo} · (name of the classmate)`],
    ['Problem 1 — timestamps', 'brute force said at __′ · optimal idea at __′ · code finished at __′ · tests finished at __′ · hints used: 0 / 1 / 2 / 3'],
    ['Problem 2 — timestamps', 'same five fields'],
    ['Scores (1–4)', 'Communication __ · Problem solving __ · Technical __ · Testing __ ⇒ Hire / Lean hire / No hire'],
    ['Evidence for each score', 'one observed fact per axis, with the minute ("at 14′ coded for 4 minutes without a word")'],
    ['Three biggest mistakes', '→ three lines in the error log: date · problem · pattern · what went wrong · next review date'],
    ['One thing that went well', 'keep doing it next time'],
    ['What I study this week', 'the lesson that fixes mistake #1 (from the "Fixing lesson" column of lesson 11.5)'],
    ['Review dates for both problems', '+1d · +3d · +7d · +14d (lesson 11.1 ladder; a failed review resets to +1d)'],
  ] : [
    ['Ngày · bộ · người phỏng vấn', `__/__/2026 · bộ thử ${boSo} · (tên bạn cùng lớp)`],
    ['Đề 1 — mốc thời gian', 'nói vét cạn ở phút __ · ra ý tối ưu ở phút __ · code xong ở phút __ · test xong ở phút __ · số gợi ý đã dùng: 0 / 1 / 2 / 3'],
    ['Đề 2 — mốc thời gian', 'năm ô như trên'],
    ['Điểm (1–4)', 'Giao tiếp __ · Giải quyết vấn đề __ · Code __ · Test __ ⇒ Hire / Lean hire / No hire'],
    ['Bằng chứng cho từng điểm', 'mỗi trục một sự việc quan sát được, kèm phút ("phút 14 gõ liền 4 phút không nói gì")'],
    ['Ba lỗi lớn nhất', '→ ba dòng vào sổ lỗi: ngày · đề · mẫu · sai ở đâu · ngày ôn tiếp'],
    ['Một điều làm tốt', 'giữ nguyên ở buổi sau'],
    ['Tuần này học lại gì', 'bài chữa lỗi số 1 (lấy ở cột "Bài chữa" của bài 11.5)'],
    ['Ngày ôn cho cả hai đề', '+1 · +3 · +7 · +14 ngày (thang của bài 11.1; ôn hỏng thì về +1)'],
  ];
  return `<table>\n<thead><tr><th>${en ? 'Field' : 'Mục'}</th><th>${en ? 'What to write' : 'Ghi gì'}</th></tr></thead>\n<tbody>\n` +
    r.map(([a, b]) => `<tr><td><strong>${a}</strong></td><td>${b}</td></tr>`).join('\n') + `\n</tbody></table>`;
}

/** Bảng "câu ứng viên hỏi → câu người phỏng vấn trả lời". dong = [[hỏi, đáp], …]. */
export function bangHoiDap(lang, dong) {
  const dau = lang === 'en' ? ['If the candidate asks…', 'You answer'] : ['Nếu ứng viên hỏi…', 'Bạn trả lời'];
  return `<table>\n<thead><tr><th>${dau[0]}</th><th>${dau[1]}</th></tr></thead>\n<tbody>\n` +
    dong.map(([h, d]) => `<tr><td>${h}</td><td>${d}</td></tr>`).join('\n') + `\n</tbody></table>`;
}

/** Bảng 3 gợi ý theo bậc. dong = [[khiNao, nguyenVan, giaDiem], …]. */
export function bangGoiY(lang, dong) {
  const dau = lang === 'en' ? ['Hint', 'Give it when…', 'Say exactly', 'What it costs'] : ['Gợi ý', 'Đưa khi…', 'Nói nguyên văn', 'Cái giá'];
  return `<table>\n<thead><tr>${dau.map((d) => `<th>${d}</th>`).join('')}</tr></thead>\n<tbody>\n` +
    dong.map(([k, n, g], i) => `<tr><td><strong>${i + 1}</strong></td><td>${k}</td><td><em>${n}</em></td><td>${g}</td></tr>`).join('\n') + `\n</tbody></table>`;
}

/* ── Lộ trình (bài 11.1) ──────────────────────────────────────────────────────────────────────────────── */
// Bảng tra cố định (KHÔNG import dsa-interview.mjs: nó import chính chương này ⇒ vòng lặp import). _kiem.mjs kiểm mọi slug.
const BAI = {
  '0-8': ['dsa-0-8-bat-dau-tai-day', 'S1'], '0-9': ['dsa-0-9-bat-dau-khi-khong-co', 'S2'], '0-1': ['dsa-0-1-big-o', '0.1'],
  '0-2': ['dsa-0-2-khung', '0.2'], '0-3': ['dsa-0-3-quiz', '0.3'],
  '1-1': ['dsa-1-1-hash-map', '1.1'], '1-2': ['dsa-1-2-prefix-sum', '1.2'], '1-3': ['dsa-1-3-sap-xep', '1.3'],
  '1-5': ['dsa-1-5-bit', '1.4'], '1-4': ['dsa-1-4-luyen', '1.5'], '1-6': ['dsa-1-6-quiz', '1.6'],
  '2-1': ['dsa-2-1-hai-con-tro', '2.1'], '2-2': ['dsa-2-2-cua-so', '2.2'], '2-3': ['dsa-2-3-nhanh-cham', '2.3'],
  '2-4': ['dsa-2-4-luyen', '2.4'], '2-5': ['dsa-2-5-quiz', '2.5'],
  '3-1': ['dsa-3-1-stack', '3.1'], '3-2': ['dsa-3-2-queue', '3.2'], '3-3': ['dsa-3-3-linked-list', '3.3'],
  '3-4': ['dsa-3-4-luyen', '3.4'], '3-5': ['dsa-3-5-quiz', '3.5'],
  '4-1': ['dsa-4-1-co-ban', '4.1'], '4-2': ['dsa-4-2-xoay', '4.2'], '4-3': ['dsa-4-3-khong-gian-dap-an', '4.3'],
  '4-4': ['dsa-4-4-luyen', '4.4'], '4-5': ['dsa-4-5-quiz', '4.5'],
  '5-1': ['dsa-5-1-duyet', '5.1'], '5-2': ['dsa-5-2-de-quy', '5.2'], '5-3': ['dsa-5-3-bst', '5.3'],
  '5-5': ['dsa-5-5-trie', '5.4'], '5-4': ['dsa-5-4-luyen', '5.5'], '5-6': ['dsa-5-6-quiz', '5.6'],
  '6-1': ['dsa-6-1-heap', '6.1'], '6-2': ['dsa-6-2-trung-vi', '6.2'], '6-3': ['dsa-6-3-khoang', '6.3'], '6-4': ['dsa-6-4-luyen', '6.4'],
  '7-1': ['dsa-7-1-bieu-dien', '7.1'], '7-2': ['dsa-7-2-bfs-dfs', '7.2'], '7-3': ['dsa-7-3-topo', '7.3'], '7-4': ['dsa-7-4-dijkstra', '7.4'],
  '8-1': ['dsa-8-1-mau', '8.1'], '8-2': ['dsa-8-2-to-hop', '8.2'], '8-3': ['dsa-8-3-cat-nhanh', '8.3'],
  '9-1': ['dsa-9-1-nhap-mon', '9.1'], '9-2': ['dsa-9-2-mot-chieu', '9.2'], '9-3': ['dsa-9-3-hai-chieu', '9.3'],
  '9-4': ['dsa-9-4-nhan-dien', '9.4'], '9-5': ['dsa-9-5-greedy', '9.5'], '9-6': ['dsa-9-6-luyen', '9.6'],
  '10-1': ['dsa-10-1-noi', '10.1'], '10-2': ['dsa-10-2-code-sach', '10.2'], '10-3': ['dsa-10-3-test', '10.3'], '10-4': ['dsa-10-4-online', '10.4'],
  '11-2': ['dsa-11-2-thu-1', '11.2'], '11-3': ['dsa-11-3-thu-2', '11.3'], '11-5': ['dsa-11-5-thu-3', '11.4'],
  '11-4': ['dsa-11-4-tong-ket', '11.5'], '11-6': ['dsa-11-6-kiem-tra-cuoi-khoa', '11.6'],
};
function tra(ngan, lang) {
  const b = BAI[ngan];
  if (!b) throw new Error(`lộ trình: chưa khai bài ${ngan}`);
  const so = b[1] === 'S1' ? (lang === 'en' ? 'Start 1/2' : 'Bắt đầu 1/2') : b[1] === 'S2' ? (lang === 'en' ? 'Start 2/2' : 'Bắt đầu 2/2') : b[1];
  return { slug: b[0], so };
}
const THU = { en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], vi: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'] };
const CV = {
  en: ['CV: first draft, one page', 'CV: project bullets with numbers', 'GitHub: pin 3 repos, write READMEs', 'CV: a friend reads it in 30 s', 'LinkedIn + the school portal profile', 'CV: final PDF, file name, links tested'],
  vi: ['CV: bản nháp một trang', 'CV: gạch đầu dòng dự án có số liệu', 'GitHub: ghim 3 repo, viết README', 'CV: nhờ bạn đọc trong 30 giây', 'LinkedIn + hồ sơ trên cổng của trường', 'CV: bản PDF cuối, tên tệp, bấm thử mọi link'],
};
const MOC = {
  en: {
    1: 'Checkpoint 1: an Easy hash-map problem in ≤ 15′, said out loud; quizzes 0.3 and 1.6 ≥ 7/10.',
    2: 'Checkpoint 2: a Medium two-pointer / window problem from cold in ≤ 25′; LC 20 in ≤ 10′.',
    3: 'Checkpoint 3: write the binary-search template from memory, correct first time; a Medium tree problem ≤ 25′.',
    4: 'Checkpoint 4 = SUBMIT THE APPLICATION. One Medium heap or interval problem ≤ 25′.',
    5: 'Checkpoint 5: mock 1 at "Lean hire" or better; an OA-style problem reads stdin correctly first time.',
    6: 'Checkpoint 6: mocks 2 and 3 at "Hire"; final exam 11.6 ≥ 18/24.',
  },
  vi: {
    1: 'Mốc 1: một đề Easy hash map ≤ 15′, nói to; quiz 0.3 và 1.6 ≥ 7/10.',
    2: 'Mốc 2: một đề Medium hai con trỏ / cửa sổ làm "nguội" (không xem lại trước) ≤ 25′; LC 20 ≤ 10′.',
    3: 'Mốc 3: viết khuôn tìm nhị phân từ trí nhớ, đúng ngay lần đầu; một đề Medium về cây ≤ 25′.',
    4: 'Mốc 4 = NỘP HỒ SƠ. Một đề Medium heap hoặc khoảng ≤ 25′.',
    5: 'Mốc 5: buổi thử 1 đạt "Lean hire" trở lên; một đề kiểu OA đọc stdin đúng ngay lần đầu.',
    6: 'Mốc 6: buổi thử 2 và 3 đạt "Hire"; bài thi cuối khoá 11.6 ≥ 18/24.',
  },
};

/** Bảng lộ trình từng ngày. ke = B hoặc A (ma/ch11/b1/lo-trinh.vet.mjs). */
export function bangLoTrinh(ke, lang) {
  const en = lang === 'en';
  const dau = en ? ['Day', 'Date', 'Learn', 'New problems (anchor first)', 'Review (computed: anchor + 1/3/7/14 days)', 'Note']
    : ['Ngày', 'Lịch', 'Học', 'Đề mới (đề neo đứng đầu)', 'Ôn (tự tính: đề neo + 1/3/7/14 ngày)', 'Ghi chú'];
  const hang = tinhLich(ke).map((n) => {
    const bai = (n.bai || []).map((b) => { const t = tra(b, lang); return `<a href="${baiNay(t.slug)}">${t.so}</a>`; }).join(' · ');
    const de = (n.de || []).map((d) => lc(d[0], d[1], d[2], d[3])).join('<br>');
    const on = n.on.map((o) => `LC ${o.de[0]} <small>(+${o.k})</small>`).join(' · ') || '—';
    const ghi = [];
    if (n.loai === 'on') ghi.push(en ? '🔁 Weekly review: chapter quiz, redo 3 error-log problems' : '🔁 Ôn tuần: quiz chương, làm lại 3 đề trong sổ lỗi');
    if (n.thuNho) ghi.push(en ? `🎤 Warm-up mock 20′ with a classmate: ${lc(290, 'word-pattern', 'Word Pattern', 'Easy')}` : `🎤 Phỏng vấn thử khởi động 20′ với bạn: ${lc(290, 'word-pattern', 'Word Pattern', 'Easy')}`);
    if (n.loai === 'thu') ghi.push(en ? '🎤 Mock interview 45′ + 15′ debrief (no new problems)' : '🎤 Phỏng vấn thử 45′ + 15′ rút kinh nghiệm (không đề mới)');
    if (n.loai === 'nop') ghi.push(en ? '📮 Submit the OJT application; light review only' : '📮 Nộp hồ sơ OJT; chỉ ôn nhẹ');
    if (n.cv) ghi.push(`📄 ${CV[lang][n.cv - 1]} (+30′)`);
    if (n.moc) ghi.push(`🏁 ${MOC[lang][n.moc]}`);
    return `<tr><td>${n.so}</td><td>${THU[lang][n.thu]} ${n.ngay}</td><td>${bai || '—'}</td><td>${de || '—'}</td><td>${on}</td><td>${ghi.join('<br>') || ''}</td></tr>`;
  }).join('\n');
  return `<table class="bang-lo-trinh">\n<thead><tr>${dau.map((d) => `<th>${d}</th>`).join('')}</tr></thead>\n<tbody>\n${hang}\n</tbody></table>`;
}
