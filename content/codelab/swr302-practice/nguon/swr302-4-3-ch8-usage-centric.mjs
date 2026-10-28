/**
 * SWR302 · 4.3 — Usage-centric vs product-centric; use cases vs user stories (Wiegers Ch.8 slides 1–11).
 */
import { tn, kiemTuy } from './_chung.mjs';
import { phanLoai, tracNghiem, baiJs, moDun } from './_bai.mjs';

const E1 = phanLoai({
  tieuDe: 'Usage-centric 1 — usage-centric or product-centric?',
  doKho: 'EASY', phut: 5,
  moTa: { en: '<p><b>Usage-centric</b>: understand what users need to accomplish, then derive the functionality. <b>Product-centric</b>: define features you expect will sell — riskier, since you may build features nobody uses. Classify each way of working.</p>', vi: '<p>Hướng sử dụng vs hướng sản phẩm.</p>' },
  cot: 'Approach', luaChon: ['Usage-centric', 'Product-centric'],
  hang: [
    ['"Let’s list the tasks nurses do in a shift and see what the app must support."', 'Usage-centric'],
    ['"Competitors have AI chat — we need AI chat too."', 'Product-centric'],
    ['"For each user class, which goals do they reach with the system?"', 'Usage-centric'],
    ['"Marketing wants 50 features on the box."', 'Product-centric'],
  ],
  giaiThich: '<p>Usage-centric work reveals the necessary functionality, avoids unused features and helps prioritisation.</p>',
  goiY: ['Bắt đầu từ việc người dùng cần làm ⇒ hướng sử dụng.', 'Bắt đầu từ tính năng "bán được" ⇒ hướng sản phẩm.'],
  loiHayGap: ['Sao chép tính năng đối thủ không cần biết ai dùng.', 'Nghĩ hướng sản phẩm luôn tốt hơn.'],
  thuatNgu: tn('useCase', 'userStory'),
  khaiNiem: ['usage-centric requirements'],
});

const E2 = tracNghiem({
  tieuDe: 'Usage-centric 2 — use case and user story',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: '<p>A use case is a sequence of interactions between the system and an external actor that results in an outcome of value for the actor; name it verb + object ("Request a Chemical"). A user story: "As a [type of user], I want [goal] so that [reason]" — it also names the user class and the rationale. With use cases, the BA derives functional requirements and tests; a story is a placeholder for a just-in-time conversation, and epics are split to fit an iteration.</p>', vi: '<p>Use case và user story.</p>' },
  cau: [
    { en: 'Which is a well-named use case?', vi: 'Tên use case nào tốt?', lc: [['a', 'Request a Chemical'], ['b', 'Chemical Module'], ['c', 'Database Access'], ['d', 'Process Stuff']], dap: 'a', giai: ['Strong verb + object, value evident.', 'Động từ mạnh + đối tượng, giá trị rõ.'] },
    { en: 'What does a user story state that a bare use case name does not?', vi: 'User story nêu điều gì mà tên use case trần không có?', lc: [['a', 'The user class and the reason (benefit)'], ['b', 'The database tables'], ['c', 'The test script'], ['d', 'The release date']], dap: 'a', giai: ['"As a … so that …".', '"As a … so that …".'] },
    { en: 'From a use case specification, the BA derives…', vi: 'Từ đặc tả use case, BA suy ra…', lc: [['a', 'functional requirements for developers and tests for testers'], ['b', 'only the UI design'], ['c', 'the project budget'], ['d', 'nothing more']], dap: 'a', giai: ['Figure 8-1.', 'Hình 8-1.'] },
  ],
  goiY: ['Tên use case: động từ + đối tượng.', 'Story nêu vai và lý do.'],
  loiHayGap: ['Đặt tên use case theo module.', 'Coi story là đặc tả đầy đủ.'],
  giaiThich: '<p>Answers: a · a · a.</p>',
  thuatNgu: tn('useCase', 'userStory', 'epic'),
  khaiNiem: ['use cases and user stories'],
});

const E3 = phanLoai({
  tieuDe: 'Usage-centric 3 — questions that find use cases',
  doKho: 'MEDIUM', phut: 5,
  moTa: { en: '<p>Wiegers’ questions to discover use cases: What will the actor use the system for? Will they create, store, change, remove or read data? Will they inform the system of external events? Do they need to be informed of occurrences? For a smart-home system, which question surfaced each use case?</p>', vi: '<p>Câu hỏi để tìm use case. Câu hỏi nào làm lộ ra từng use case của hệ thống nhà thông minh?</p>' },
  cot: 'Question', luaChon: ['What will the actor use the system for?', 'Will they create, change, remove or read data?', 'Will they inform the system of external events?', 'Do they need to be informed of occurrences?'],
  hang: [
    ['Program Vacation Setting (set lights and alarm for a long absence)', 'What will the actor use the system for?'],
    ['Edit Family Member Profile', 'Will they create, change, remove or read data?'],
    ['Report Power Outage (the homeowner tells the system the grid is down)', 'Will they inform the system of external events?'],
    ['Receive Intrusion Alert', 'Do they need to be informed of occurrences?'],
  ],
  giaiThich: '<p>Asking all four questions for every actor is a cheap completeness check.</p>',
  goiY: ['Nhận cảnh báo ⇒ "cần được thông báo".', 'Báo cho hệ thống biết sự kiện ngoài ⇒ "inform the system".'],
  loiHayGap: ['Chỉ hỏi "dùng để làm gì" mà quên dữ liệu và sự kiện.', 'Nhầm hai chiều thông báo.'],
  thuatNgu: tn('useCase', 'actor'),
  khaiNiem: ['finding use cases'],
});

const E4 = baiJs({
  tieuDe: 'Usage-centric 4 — turn a use case name into a user story',
  doKho: 'MEDIUM', phut: 8,
  moTa: { en: '<p>For each use case of a library system write the equivalent user story in <code>STORIES</code> (keys UC1–UC3): <b>UC1</b> "Reserve a Book" (primary actor: member), <b>UC2</b> "Renew a Loan" (member), <b>UC3</b> "Record a Returned Book" (librarian). Each must follow "As a &lt;role&gt;, I want &lt;goal&gt; so that &lt;benefit&gt;", name the primary actor of the use case as the role, and keep the use case’s goal.</p>', vi: '<p>Viết user story tương đương cho ba use case thư viện; vai là actor chính, giữ mục tiêu của use case.</p>' },
  yeuCau: [{ en: 'The benefit must be a real reason, not a repetition of the goal.', vi: 'Lợi ích phải là lý do thật, không lặp lại mục tiêu.' }],
  viDu: [{ input: 'Reserve a Book (member)', output: 'As a member, I want to reserve a book that is on loan so that I can borrow it as soon as it is returned.', explanation: '|||' }],
  tep: { 'stories.js': ["const STORIES = { UC1: '', UC2: '', UC3: '' };\n", "const STORIES = {\n  UC1: 'As a member, I want to reserve a book that is on loan so that I can borrow it as soon as it is returned.',\n  UC2: 'As a member, I want to renew my loan online so that I can keep reading without visiting the library.',\n  UC3: 'As a librarian, I want to record a returned book so that it becomes available to the next reader.',\n};\n"] },
  kiem: (function () {
    var ca = [['UC1', 'member', 'reserv'], ['UC2', 'member', 'renew'], ['UC3', 'librarian', 'return']];
    return ca.map(function (c, i) {
      return kiemTuy({ en: c[0] + ' — form, role and goal', vi: c[0] + ' — mẫu, vai và mục tiêu' }, new Function(`
        if (typeof STORIES === 'undefined' || !STORIES) return 'STORIES is missing';
        var t = String(STORIES.${c[0]} || '').trim(), m = /^as an? ([^,]+?),? i want (to )?(.+?) so that (.+)$/i.exec(t);
        if (!m) return 'use "As a <role>, I want <goal> so that <benefit>"';
        if (!/${c[1]}/i.test(m[1])) return 'the role is the primary actor: ${c[1]}';
        if (!/${c[2]}/i.test(m[3])) return 'keep the goal of the use case (${c[2]}…)';
        var b = m[4].replace(/[.]$/, '').trim();
        if (b.split(/\\s+/).length < 4) return 'the benefit is too short — say why it matters';
        if (/${c[2]}/i.test(b) && b.split(/\\s+/).length < 7) return 'the benefit repeats the goal — give the real reason';
        return 'OK';`), i === 2 ? { an: true } : {});
    });
  })(),
  goiY: ['Vai = actor chính của use case.', 'Lợi ích trả lời "để làm gì".'],
  loiHayGap: ['"so that I can reserve a book" — lặp lại mục tiêu.', 'Vai là "the system".'],
  giaiThich: '<p>A use case name gives the goal; the story adds the user class and the reason — the very things a use case keeps in its actor and description fields.</p>',
  thuatNgu: tn('userStory', 'useCase', 'primaryActor'),
  khaiNiem: ['use cases and user stories'],
  boYeu: [{ ten: 'lợi ích lặp lại mục tiêu', tep: { 'stories.js': "const STORIES = { UC1: 'As a member, I want to reserve a book so that I reserve a book.', UC2: 'As a user, I want to renew a loan so that it is renewed.', UC3: 'As the system, I want to record a return so that ok.' };\n" } }],
});

export default moDun({
  slug: 'swr302-4-3-ch8-usage-centric',
  ten: '4.3 Usage-centric requirements: use cases and user stories',
  moTaModule: 'Hướng sử dụng vs hướng sản phẩm, use case và user story khác nhau ở đâu, câu hỏi tìm use case, tự chuyển ba use case thư viện thành user story có chấm.',
  de: [E1, E2, E3, E4],
});
