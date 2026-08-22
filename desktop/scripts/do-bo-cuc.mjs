/**
 * ============================================================
 * ĐO TRÀN NGANG CỦA MỌI TRANG — chạy: npm run do:bo-cuc
 * ============================================================
 *
 * ─── Vì sao có bộ này ───
 * Người dùng báo cùng MỘT lỗi ba lần, ở ba trang khác nhau: thu nhỏ cửa sổ thì
 * thanh công cụ bị cắt, nút bấm biến mất. Mỗi lần lại phải sửa tay một trang.
 * Nguyên nhân luôn giống nhau — một flex item không có `min-width: 0`, hoặc
 * một hàng nút không có `flex-wrap` — nhưng không có gì bắt được nó trước khi
 * người dùng nhìn thấy.
 *
 * Một dòng luật trong tài liệu thì sẽ bị quên. Một phép kiểm ĐỎ thì không.
 *
 * ─── Nó đo gì ───
 * Mount TỪNG trang thật vào đúng cây vỏ của app (shell > sidebar > main >
 * content), ở nhiều bề rộng cửa sổ, rồi hỏi trình duyệt hai câu:
 *   1. Có phần tử nào rộng hơn khung chứa nó không (`scrollWidth > clientWidth`)?
 *   2. Có nút/điều khiển nào nằm ngoài mép phải của khung không?
 * Câu 2 quan trọng hơn câu 1: `overflow: hidden` làm câu 1 im lặng trong khi
 * nội dung vẫn bị CẮT — đúng cách lỗi này sống sót qua lần vá trước.
 *
 * ─── Nó KHÔNG đo gì ───
 * Không đo màu, không đo khoảng cách, không chụp ảnh so sánh. Chỉ đúng một
 * câu hỏi: ở cửa sổ hẹp, còn nhìn thấy và bấm được mọi thứ không.
 */
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const goc = path.dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const thuMuc = path.join(goc, 'dist/bo-cuc');

if (!fs.existsSync(path.join(thuMuc, 'bo-cuc/trang-thu.html'))) {
  console.error('\x1b[31m✗\x1b[0m Chưa dựng bản đo. Chạy: npm run do:bo-cuc');
  process.exit(1);
}

/** Bề rộng CỬA SỔ để thử. 860 là cỡ người dùng hay kéo về khi xem hai app cạnh nhau. */
const BE_RONG = [1440, 1180, 1000, 860];

const KIEU = { mime: { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' } };

const may = http.createServer((req, res) => {
  const u = decodeURIComponent((req.url ?? '/').split('?')[0]);
  const f = path.join(thuMuc, u === '/' ? 'bo-cuc/trang-thu.html' : u);
  if (!f.startsWith(thuMuc) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
    res.writeHead(404); res.end('không có'); return;
  }
  res.writeHead(200, { 'Content-Type': KIEU.mime[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => may.listen(0, r));
const cong = may.address().port;

const trinh = await chromium.launch();
const ctx = await trinh.newContext();

/*
 * Máy chủ giả + cầu nối giả.
 *
 * Trả dữ liệu THẬT VỀ HÌNH DẠNG, không trả rỗng. Trang rỗng vẽ ra trạng thái
 * "chưa có gì" — mà đó lại là trạng thái ÍT phần tử nhất, tức là trạng thái dễ
 * qua nhất. Muốn bắt được thanh công cụ bị cắt thì phải cho trang đủ dữ liệu để
 * nó vẽ ra thanh công cụ.
 */
const nguoi = (i) => ({ id: i, username: `nguoi${i}`, displayName: `Người dùng ${i}`,
                        fullName: `Người dùng ${i}`, avatarUrl: null });
const mang = (n, f) => Array.from({ length: n }, (_, i) => f(i + 1));

const BANG = [
    /* ── Phỏng vấn (22/08/2026) ──
       Đặt TRƯỚC mọi mẫu khác: `/interview/history` cũng khớp được những mẫu
       rộng phía dưới, và cái khớp đầu tiên thắng. Dữ liệu phải ĐỦ ĐÔNG —
       trang rỗng vẽ ra trạng thái "chưa có gì", vốn là trạng thái ít phần tử
       nhất và dễ qua nhất. */
    /* Báo cáo phải đứng TRƯỚC `sessions/:id`: đường của nó là
       `/interview/sessions/12/report`, tức cũng khớp mẫu phiên. */
    [/\/interview\/sessions\/\d+\/report/, () => ({
        language: 'VI',
        report: { id: 1, sessionId: 1, overallScore: 74, letterGrade: 'B+',
          scoreBreakdown: { self: 78, deterministic: 71, divergence: 7, redFlagTotal: 1,
            answered: 6, total: 6,
            byTopic: mang(5, (i) => ({ topicId: i, topic: `Chủ đề số ${i} tên dài vừa đủ tràn dòng`,
              avgScore: 60 + i * 5, questions: 2, redFlags: i === 3 ? 1 : 0 })) },
          strengths: mang(4, (i) => `Điểm mạnh số ${i}: trình bày mạch lạc, có ví dụ thực tế đi kèm.`),
          weaknesses: mang(4, (i) => `Điểm yếu số ${i}: chưa nêu được đánh đổi khi hệ thống lớn dần.`),
          actionableAdvice: 'Lời khuyên đủ dài để chiếm vài dòng và kiểm được chỗ xuống dòng của khối chữ.',
          hireRecommendation: 'LEAN_HIRE',
          suggestedResources: mang(3, (i) => ({ topicId: i, topic: `Chủ đề ${i}`,
            note: 'Đọc thêm phần này trước buổi phỏng vấn kế tiếp.', sources: [] })) },
        turns: mang(6, (i) => ({ order: i, topic: `Chủ đề ${i}`,
          questionText: `Câu hỏi số ${i}: giải thích cơ chế và nêu đánh đổi trong hệ thống thật.`,
          userAnswer: 'Câu trả lời của người dùng, dài vừa đủ để tràn sang vài dòng như thật.',
          referenceAnswer: 'Đáp án mẫu, cũng dài tương đương.',
          rubric: mang(4, (k) => ({ id: `c${k}`, criterion: `Tiêu chí chấm số ${k}`, weight: 25 })),
          deterministicScore: { mustHit: ['A', 'B'], hit: ['A'], missed: ['B'], score: 70, redFlags: [] },
          selfScore: { total: 78 }, turnScore: { deterministic: 70, self: 78, divergence: 8, grade: 'B' },
          needsReview: i === 2, injectionAttempted: false })) })],
    [/\/interview\/sessions\/\d+/, () => ({ id: 1, status: 'IN_PROGRESS',
        trackName: 'Hướng phỏng vấn có tên khá dài để thử tràn', level: 'MID', language: 'VI',
        engineMode: 'STATIC', focusedMode: false, companyStyle: 'Công ty số 1',
        total: 6, hasReport: false, sttProvider: 'browser', aiAvailable: false,
        turns: mang(6, (i) => ({ order: i,
          questionText: `Câu hỏi số ${i}: giải thích cơ chế, nêu đánh đổi, cho một ví dụ thực tế bạn từng gặp.`,
          type: 'SHORT_ANSWER', answered: i <= 2,
          userAnswer: i <= 2 ? 'Câu trả lời đã gửi, dài vừa đủ để tràn dòng.' : null,
          referenceAnswer: i <= 2 ? 'Đáp án mẫu hiện ra sau khi đã trả lời.' : null,
          rubric: i <= 2 ? mang(4, (k) => ({ id: `c${k}`, criterion: `Tiêu chí số ${k}`, weight: 25 })) : null })) })],
    [/\/interview\/tracks/, () => ({
        domains: mang(4, (i) => ({ id: i, slug: `linh-vuc-${i}`,
          name: `Domain ${i}`, nameVi: `Lĩnh vực số ${i} có tên khá dài`,
          tracks: mang(5, (k) => ({ id: i * 10 + k, slug: `track-${i}-${k}`,
            name: `Track ${k}`, nameVi: `Hướng phỏng vấn số ${k} tên dài vừa đủ tràn dòng`,
            questionCount: 20 + k,
            topics: mang(6, (b) => ({ id: b, slug: `chu-de-${b}`, name: `Topic ${b}`,
              nameVi: `Chủ đề số ${b}` })) })) })),
        companyProfiles: mang(6, (i) => ({ id: i, slug: `cty-${i}`, name: `Công ty số ${i}`,
          styleDescriptor: 'Hỏi sâu về hệ thống, ưu tiên ví dụ thực tế.', rigor: i })),
        aiAvailable: true, aiAllowed: true })],
    [/\/interview\/history/, () => mang(8, (i) => ({ id: i,
        track: `Hướng phỏng vấn số ${i} với tên khá dài`, level: 'MID',
        status: i % 2 ? 'COMPLETED' : 'IN_PROGRESS', engineMode: 'STATIC',
        createdAt: '2026-08-20T00:00:00Z',
        overallScore: i % 2 ? 70 + i : null, letterGrade: i % 2 ? 'B+' : null }))],
    [/\/interview\/mastery/, () => ({ totalCards: 120, totalDue: 14,
        topics: mang(7, (i) => ({ topicId: i, topic: `Chủ đề số ${i} tên dài vừa đủ`,
          total: 20, due: i,
          byMastery: { UNSEEN: 4, SHAKY: 3, LEARNING: 5, SOLID: 6, MASTERED: 2 } })) })],
    [/\/interview\/drill/, () => ({ totalDue: 9,
        cards: mang(9, (i) => ({ cardId: i, concept: `Khái niệm ${i}`, topic: `Chủ đề ${i}`,
          masteryLevel: 'LEARNING', variantGap: false,
          question: { id: i, type: 'SHORT_ANSWER',
            body: `Câu hỏi số ${i}: giải thích cơ chế và đánh đổi của nó trong hệ thống thật.`,
            referenceAnswer: 'Đáp án mẫu đủ dài để chiếm vài dòng trên màn hình.',
            rubric: mang(4, (k) => ({ id: `c${k}`, label: `Tiêu chí ${k}`, weight: 25,
              description: 'Mô tả tiêu chí chấm.' })) } })) })],
    [/\/voice\/series/, () => mang(3, (i) => ({ id: i, title: `Chuỗi số ${i}`, slug: `chuoi-${i}`, postCount: i }))],
    [/\/voice\/posts\//, () => ({ post: null, related: [] })],
    [/\/voice/, () => ({ posts: mang(6, (i) => ({
        id: i, title: `Bài giọng nói số ${i} có tiêu đề khá dài`, slug: `bai-${i}`,
        summary: 'Tóm tắt vừa đủ dài để tràn sang dòng thứ hai như thật.',
        type: 'VLOG', mediaKind: 'YOUTUBE', youtubeId: 'x', thumbnailUrl: null,
        durationSec: 300 + i, tags: ['a'], viewCount: 100 * i, likeCount: i, commentCount: i,
        publishedAt: '2026-08-13T09:00:00Z', series: null, author: nguoi(1) })),
      pagination: { page: 1, size: 12, total: 30, totalPages: 3 } })],
    [/\/messages\/threads/, () => mang(5, (i) => ({ id: i, type: 'USER', title: `Cuộc trò chuyện ${i}`,
        lastMessage: { content: 'Tin nhắn gần nhất', createdAt: '2026-08-20T00:00:00Z' },
        unreadCount: i % 2, participants: [nguoi(1), nguoi(i + 1)], updatedAt: '2026-08-20T00:00:00Z' }))],
    [/\/friends|\/users/, () => mang(6, (i) => nguoi(i))],
    [/\/posts|\/feed/, () => ({ posts: mang(4, (i) => ({ id: i, content: `Bài viết ${i}`, author: nguoi(i),
        createdAt: '2026-08-20T00:00:00Z', likeCount: i, commentCount: i, media: [] })),
      pagination: { page: 1, size: 10, total: 4, totalPages: 1 } })],
    [/\/music\/tracks/, () => ({ items: mang(8, (i) => ({ id: i, title: `Bài hát ${i}`, artist: 'Ca sĩ',
        audioUrl: '', coverUrl: null, durationSec: 200 })), total: 8 })],
    [/\/tech-trends\/articles/, () => mang(6, (i) => ({ id: i, title: `Bài công nghệ ${i}`, slug: `bai-${i}`,
        summary: 'Tóm tắt bài viết.', publishedAt: '2026-08-20T00:00:00Z', category: { name: 'AI' } }))],
    [/\/cv/, () => mang(3, (i) => ({ id: i, title: `CV số ${i}`, updatedAt: '2026-08-20T00:00:00Z' }))],
    [/\/academy\/semesters/, () => mang(9, (i) => ({ id: i, name: `Kỳ ${i}`, code: `KY${i}`, ordinal: i }))],
    [/\/courses\/semester\//, () => mang(5, (i) => ({
        id: i, slug: `mon-${i}`, title: `Course Title ${i}|||Tên môn học số ${i}`,
        courseCode: ['PRF192', 'LAB211', 'CSD201', 'DBI202', 'PRJ301'][i - 1],
        shortDescription: 'Short EN|||Mô tả ngắn của môn, dài vừa đủ để tràn sang dòng thứ hai.',
        thumbnailUrl: null, level: 'INTERMEDIATE', totalLessons: 12, isFree: true,
        sections: mang(3, (k) => ({ id: k, title: `S${k}`, lessonCount: 4, lessons: [] })) }))],
    [/\/courses\/[^/]+$/, () => ({
        id: 1, slug: 'mon-1', title: 'Course|||Môn học', courseCode: 'LAB211',
        shortDescription: 'EN|||Mô tả ngắn', thumbnailUrl: null, level: 'INTERMEDIATE',
        isFree: true, instructorName: 'Cuong03dx',
        whatYouLearn: ['A|||Viết được chương trình Java theo kiến trúc phân tầng', 'B|||Gỡ lỗi'],
        sections: mang(4, (k) => ({ id: k, title: `Section ${k}|||Mục ${k}`, lessonCount: 3,
          lessons: mang(3, (b) => ({ id: k * 10 + b, title: `L${b}|||Bài ${k}.${b}`,
            isFreePreview: k === 1, content: k === 1 ? '<h2>Nội dung</h2><p>Chữ bài học.</p>' : null,
            videoUrl: k === 1 ? 'https://youtu.be/x' : null })) })) })],
    [/\/code-lab\/stats/, () => ({ groups: 12, tracks: 146, modules: 2122, exercises: 12549,
        byDifficulty: [{ _count: 2381, difficulty: 'EASY' }, { _count: 7563, difficulty: 'MEDIUM' },
                       { _count: 2605, difficulty: 'HARD' }] })],
    [/\/code-lab\/groups/, () => mang(3, (i) => ({ id: i, slug: `nhom-${i}`, name: `Nhóm số ${i}`,
        color: '#e11d48',
        tracks: mang(6, (k) => ({ id: i * 10 + k, slug: `track-${i}-${k}`, name: `Lộ trình ${k}`,
          description: '⟦ctv⟧Mô tả lộ trình đủ dài để tràn sang dòng thứ hai như thật.',
          language: 'typescript', level: 'BEGINNER', moduleCount: 16, exerciseCount: 160 })) }))],
    [/\/code-lab\/tracks\//, () => ({ id: 1, slug: 'track-1-1', name: 'Lộ trình thử',
        description: '⟦ctv⟧Mô tả', language: 'sql', level: 'BEGINNER', exerciseCount: 210,
        group: { name: 'CuongThai' },
        modules: mang(4, (k) => ({ id: k, slug: `m${k}`, name: `Mục ${k}`,
          exercises: mang(5, (b) => ({ id: k * 10 + b, slug: `bai-${k}-${b}`,
            title: `Bài tập số ${b} với tiêu đề khá dài`, difficulty: 'EASY', language: 'sql',
            estimatedMinutes: 10, points: 5, solveCount: 3 })) })) })],
    [/\/code-lab\/exercises\//, () => ({ id: 1, slug: 'bai-1', title: 'Bài thử',
        difficulty: 'EASY', language: 'sql', estimatedMinutes: 10, points: 5,
        problemHtml: '<p>Đề bài.</p>', concepts: ['SELECT'], constraints: 'Dùng SELECT *',
        inputSpec: 'Bảng products', outputSpec: 'Mọi cột',
        examplesJson: [{ input: 'a', output: 'b' }],
        starterCodeJson: [{ name: 's.sql', code: 'SELECT' }],
        solutionCodeJson: [{ name: 's.sql', code: 'SELECT *' }],
        hintsJson: ['Gợi ý một', 'Gợi ý hai'], track: { name: 'PostgreSQL', slug: 'postgresql' } })],
    [/\/exams/, () => mang(12, (i) => ({ id: i, code: `FE-D${i}`,
        title: `Exam ${i}|||Đề ${i} — Thi cuối kỳ SP26`, kind: i % 3 === 0 ? 'PE' : 'FE',
        durationMinutes: 60, totalPoints: 10, passMark: 4, questionCount: 50,
        course: { title: 'Programming Fundamentals', slug: 'prf', courseCode: 'PRF192' },
        semester: { name: 'Kỳ 1', ordinal: 1 } }))],
    [/\/courses\?|\/courses$/, () => mang(5, (i) => ({ id: i, slug: `khoa-${i}`,
        title: `Course ${i}|||Khoá học số ${i}`, shortDescription: 'EN|||Mô tả ngắn của khoá.',
        thumbnailUrl: null, level: 'BEGINNER', totalLessons: 54, isFree: true }))],
    [/\/dashboard$/, () => ({ level: 3, exp: 120, totalExp: 500, streak: 4,
        timeline: mang(24, (i) => ({ hour: i - 1, activity: i % 3 === 0 ? 'hoc' : null })),
        tasks: mang(4, (i) => ({ id: i, title: `Việc cần làm số ${i}`, done: i % 2 === 0 })),
        stats: { unreadMessages: 2, notifications: 1, tasksToday: 4, totalExp: 500 } })],
    [/\/pro|\/membership/, () => ({ isPro: true, plan: 'PRO', expiresAt: '2027-01-01T00:00:00Z' })],
  ];

/*
 * ⚠️⚠️ HAI CLIENT KHÁC NHAU CÙNG GỌI API — chặn ở TẦNG MẠNG để phủ cả hai.
 *
 * App desktop có api client riêng; `vite.bo-cuc.config.ts` thay hẳn
 * `auth/session.tsx` bằng một phiên giả trỏ `api.request` vào `window.__giaApi`
 * (module ẢO, sinh lúc dựng — nên `grep __giaApi desktop/src` KHÔNG thấy gì,
 * xem [[feedback_grep_khong_thay_khong_nghia_la_khong_co]]). Đường đó chạy tốt
 * cho mọi trang native.
 *
 * Nhưng những trang DÙNG LẠI MÃ WEB (`/language`, `/interview`…) không đi qua
 * client đó — chúng gọi axios của web, và phiên giả trả `baseUrlForForms()`
 * rỗng nên lời gọi đi tới `/api/v1/...` tương đối ⇒ máy chủ tĩnh trả 404 ⇒
 * trang vẽ ra trạng thái RỖNG. Đúng cái bẫy đầu tệp này cảnh báo: "trang rỗng
 * vẽ ra trạng thái 'chưa có gì' — mà đó lại là trạng thái ÍT phần tử nhất,
 * tức là trạng thái dễ qua nhất". Phát hiện 22/08/2026 khi thêm trang Phỏng
 * vấn: hai màn động vẽ ra "Phiên không tồn tại." / "Chưa có báo cáo." rồi vẫn
 * suýt được tính là qua.
 *
 * `ctx.route` chặn ở tầng mạng nên nó tóm được axios, `fetch`, và cả
 * `__giaApi` (nay cũng đi ra mạng, ngay dưới) — MỘT bảng dữ liệu giả phục vụ
 * cả hai client, thay vì hai bảng phải giữ cho khớp nhau.
 */
await ctx.route('**/api/v1/**', async (tuyen) => {
  const duong = new URL(tuyen.request().url()).pathname;
  const khop = BANG.find(([re]) => re.test(duong));
  /* ⚠️ KHÔNG bịa payload cho đường chưa có mock.
     Bản đầu trả `[]` cho mọi đường không khớp, và nó làm `/notes` NỔ THẬT
     (`NotesSidebar` đọc `.filter` của undefined) — một lỗi do BỘ ĐO tự tạo ra,
     không phải lỗi của trang. Để nguyên đường chưa có mock đi tiếp ra máy chủ
     tĩnh (404) nghĩa là những trang đó hành xử ĐÚNG NHƯ TRƯỚC: thêm mock là
     thêm độ phủ, không bao giờ là thêm lỗi giả. */
  if (!khop) { await tuyen.continue(); return; }
  const payload = khop[1]();
  await tuyen.fulfill({
    status: 200,
    contentType: 'application/json',
    /* Envelope thật của backend (`ApiResponse<T>`): người gọi đọc
       `res.data.data`. Trả trần payload là mọi trang nhận `undefined`. */
    body: JSON.stringify({ success: true, message: 'ok', data: payload, timestamp: '2026-08-22T00:00:00Z' }),
  });
});

await ctx.addInitScript(() => {
  /* API client của chính app desktop (xem chú thích trên). Cho nó đi RA MẠNG
     để `ctx.route` phía Node trả lời, thay vì mang một bản sao bảng dữ liệu
     thứ hai vào trong trang. Người gọi mong nhận payload TRẦN, nên bóc
     envelope ở đây. Đường không có mock vẫn trả về hình dạng rỗng cũ. */
  const RONG = { data: [], items: [], results: [] };
  window.__giaApi = async (duong) => {
    try {
      const d = String(duong ?? '');
      const r = await fetch(`/api/v1${d.startsWith('/') ? d : `/${d}`}`);
      if (!r.ok) return RONG;
      return (await r.json()).data ?? RONG;
    } catch { return RONG; }
  };

  /* Cầu nối Electron giả. Mỗi nhóm trả thứ HỢP KIỂU cho nhóm đó — `undefined`
     ở khắp nơi làm trang nổ ở chỗ chẳng liên quan gì tới bố cục. */
  const RA = {
    getInfo: { version: '0.0.0', platform: 'darwin', apiOrigin: '', pro: true, configured: true,
               soViecConLai: 20, models: [], mucNoLuc: [] },
    getAll: {}, listDownloaded: [], usage: { count: 0, totalBytes: 0 },
    dsCuocDangMo: [], dsPhien: [], phien: [], dsWorktree: [],
    mcpTrangThai: { soTool: 0, server: [], daDung: 0, tran: 200 },
    getStatus: { state: 'idle' }, taoCuoc: 'cuoc-1',
    getWorkspace: { path: null, name: null },
  };
  const nhomGia = new Proxy({}, {
    get: (_t, ten) => async () => (ten in RA ? RA[ten] : undefined),
  });
  window.cuongthai = new Proxy({ on: () => () => {} }, {
    get: (t, nhom) => (nhom === 'on' ? t.on : nhomGia),
  });
});

/*
 * ─── CHUẨN BỊ: đưa trang vào trạng thái RỘNG NHẤT nó có thể ───
 *
 * Bài học đắt: bản đầu chỉ mở trang rồi đo, và nó báo XANH cho `/chat` NGAY CẢ
 * KHI đã gỡ bản vá `min-width: 0` — vì trang mới mở chỉ có MỘT tab, mà lỗi thì
 * cần bốn tab trở lên mới lộ. Một bộ kiểm luôn xanh thì không gác gì cả.
 *
 * Nên mỗi trang có quyền khai một bước đưa nó tới trạng thái đông nhất: mở
 * thêm tab, bung bộ lọc, mở thanh bên. Trang nào không khai thì đo như lúc mở.
 */
/*
 * Chờ tới khi trang có NỘI DUNG THẬT, thay cho mốc chờ cứng 1200ms.
 *
 * Đo 22/08/2026: `/interview/session/1` còn là "Đang vào phòng…" ở 1200ms và
 * chỉ đủ nội dung ở ~2500ms; `/interview/report/1` thì nằm ngay sát mốc nên
 * lúc xanh lúc đỏ. Cả hai KHÔNG hỏng — bộ đo chụp quá sớm. Một phép kiểm lúc
 * xanh lúc đỏ còn tệ hơn một phép kiểm đỏ hẳn: người ta chạy lại cho tới khi
 * nó xanh.
 *
 * ⚠️ `{timeout}` phải là đối số THỨ BA của `waitForFunction`. Đặt ở vị trí thứ
 * hai thì nó thành tham số của HÀM, và timeout rơi về mặc định 30s.
 */
const choNoiDung = async (p) => {
  await p.waitForFunction(
    () => (document.querySelector('.ct-content')?.textContent ?? '').trim().length > 80,
    undefined,
    { timeout: 8000 },
  ).catch(() => { /* hết giờ thì cứ đo — để phép kiểm nói ra, đừng giấu */ });
};

const CHUAN_BI = {
  '/interview/session/1': choNoiDung,
  '/interview/report/1': choNoiDung,
  '/chat': async (p) => {
    // Bật chế độ Lập trình rồi mở thêm tab: đây đúng là thao tác người dùng
    // làm khi họ báo lỗi ("tôi ấn tạo task mới thì nó lại bị").
    await p.click('.ct-segment-nut:has-text("Lập trình")').catch(() => {});
    await p.waitForTimeout(400);
    for (let i = 0; i < 5; i += 1) {
      await p.click('.ct-tab-them', { timeout: 1500 }).catch(() => {});
      await p.waitForTimeout(120);
    }
  },
  '/notes': async (p) => {
    // Gập cột Sổ tay rồi mở lại — nút này phải có mặt và phải đổi được trạng
    // thái, nếu không thì bản vá "cột che hết nội dung" chỉ nằm trên giấy.
    const nut = p.locator('button[aria-label*="cột Sổ tay"]').first();
    if (await nut.count()) {
      await nut.click({ force: true }).catch(() => {});
      await p.waitForTimeout(300);
    }
  },
  '/code-lab': async (p) => {
    // Mở một lộ trình: cây mục + hàng bài tập chỉ tồn tại ở tầng đó.
    await p.click('.ct-cl-track', { timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(700);
  },
  '/exam': async (p) => {
    // Bung dải lọc theo môn — hàng chip dài nhất của trang này.
    await p.click('.ct-gn-chip button:nth-child(2)', { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(300);
  },
  '/roadmap': async (p) => {
    // Bấm vào một lộ trình: chứng minh bảng tra khớp `/roadmap/:slug` và cây
    // web nhận được tham số. Không bấm thì chỉ kiểm được trang danh sách.
    await p.click('a[href^="/roadmap/"]', { timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(900);
  },
  '/language': async (p) => {
    // Cùng lý do: mở một ngôn ngữ để đi qua `/language/:code`.
    await p.click('a[href^="/language/"]', { timeout: 4000 }).catch(() => {});
    await p.waitForTimeout(900);
  },
  '/ai-templates': async (p) => {
    // Mở tấm chi tiết — cột thứ ba chỉ tồn tại khi có mẫu được chọn.
    await p.click('.ct-mau-the', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(300);
  },
};

const DUONG = JSON.parse(process.env.CT_TRANG ?? 'null')
  ?? ['/academy', '/courses', '/code-lab', '/exam', '/dashboard', '/feed', '/messages',
      '/friends', '/chat', '/cv', '/music', '/notes', '/pro', '/tech-trends',
      '/ai-templates', '/voice',
      /* Bốn trang DÙNG LẠI của web (20/08/2026). Chúng đáng kiểm hơn cả những
         trang viết tay: bố cục do mã web quyết, mà mã web viết cho cửa sổ
         trình duyệt rộng — `min-h-screen`, lưới nhiều cột, canvas 1920px. */
      '/algorithms', '/simulation', '/roadmap', '/language',
      /* Và một trang CON, để chắc bảng tra `dinhTuyenWeb` khớp thật chứ không
         chỉ đúng trong test đơn vị. `ja` có thật: `/api/v1/my-language` trả 6
         ngôn ngữ, đo ngày 20/08/2026. */
      '/language/ja',
      /* Phỏng vấn (22/08/2026) — cây web thứ năm. Đo cả ba màn KHÔNG cần id:
         trang chọn (lưới nhiều cột + form dài), lịch sử, và phòng luyện.
         Hai màn còn lại (`session/:id`, `report/:id`) cần một phiên có thật
         nên không đo được ở đây; chúng đi qua cùng một bảng tra và cùng một
         lớp bọc, và có phép kiểm đơn vị riêng trong `dinhTuyenWeb.test.ts`. */
      '/interview', '/interview/history', '/interview/drill',
      /* Hai màn ĐỘNG. Chúng là hai màn NẶNG NHẤT của cây (762 và 360 dòng) và
         là chỗ người dùng ngồi lâu nhất, nên bỏ qua vì "cần phiên thật" là bỏ
         đúng phần đáng đo. Máy chủ giả ở trên trả phiên 6 câu + báo cáo đầy đủ,
         nên chúng vẽ ra trạng thái ĐÔNG chứ không phải màn rỗng. */
      '/interview/session/1', '/interview/report/1'];

let hong = 0;
const bang = [];

for (const duong of DUONG) {
  const loi = [];
  for (const rong of BE_RONG) {
    const p = await ctx.newPage();
    const loiTrang = [];
    p.on('pageerror', (e) => loiTrang.push(`${e.message} @ ${(e.stack ?? '').split('\n')[1]?.trim() ?? '?'}`.slice(0, 200)));
    p.on('console', (m) => { if (m.type() === 'error') loiTrang.push(m.text().slice(0, 200)); });
    await p.setViewportSize({ width: rong, height: 900 });
    await p.goto(`http://127.0.0.1:${cong}/bo-cuc/trang-thu.html?trang=${encodeURIComponent(duong)}`);
    await p.waitForTimeout(1200);
    if (CHUAN_BI[duong]) { await CHUAN_BI[duong](p); await p.waitForTimeout(400); }

    const kq = await p.evaluate(() => {
      const noi = document.querySelector('.ct-content');
      if (!noi) return { loi: 'không thấy .ct-content' };
      const khung = noi.getBoundingClientRect();

      /* Điều khiển NÀO nằm ngoài mép phải. Chỉ xét thứ người dùng bấm/đọc
         được — bỏ phần tử ẩn và phần tử nằm trong vùng CUỘN NGANG cố ý
         (thanh tab), vì cuộn được thì không phải là mất. */
      const trongVungCuon = (e) => {
        for (let n = e.parentElement; n && n !== noi; n = n.parentElement) {
          const ox = getComputedStyle(n).overflowX;
          if (ox === 'auto' || ox === 'scroll') return true;
        }
        return false;
      };

      const loBenPhai = [];
      for (const e of noi.querySelectorAll('button, a, input, select, textarea, [role="tab"]')) {
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (trongVungCuon(e)) continue;
        if (r.right > khung.right + 1 || r.left < khung.left - 1) {
          loBenPhai.push(`${e.className || e.tagName}: "${(e.textContent ?? '').trim().slice(0, 24)}"`);
        }
      }

      return {
        tranTrang: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        tranNoi: noi.scrollWidth - noi.clientWidth,
        loBenPhai: [...new Set(loBenPhai)].slice(0, 4),
        soLo: loBenPhai.length,
        /* Đếm để BIẾT trang có vẽ ra gì không. Một trang trắng thì không có gì
           lọt ra ngoài khung, và phép kiểm sẽ XANH vì lý do hoàn toàn sai —
           đúng cái bẫy [[feedback_phep_kiem_dat_vi_ly_do_sai]]. */
        soDieuKhien: noi.querySelectorAll('button, a, input, select, textarea, [role="tab"]').length,
        soChu: (noi.textContent ?? '').trim().length,
      };
    });

    await p.close();

    if (kq.loi) {
      loi.push(`${rong}px: ${kq.loi}${loiTrang.length ? ` — lỗi: ${loiTrang[0]}` : ''}`);
      continue;
    }
    /* CHỐT CHỐNG XANH-GIẢ. Trang không vẽ ra gì thì mọi phép đo bên dưới đều
       đúng một cách vô nghĩa. Coi là HỎNG, không phải đạt. */
    if (kq.soDieuKhien < 2 && kq.soChu < 40) {
      loi.push(`${rong}px: trang gần như TRỐNG (${kq.soDieuKhien} điều khiển, ${kq.soChu} ký tự)`
        + `${loiTrang.length ? ` — lỗi: ${loiTrang[0]}` : ' — không có lỗi JS, có thể là trạng thái rỗng thật'}`);
      continue;
    }
    if (kq.tranTrang > 0) loi.push(`${rong}px: cả trang tràn ${kq.tranTrang}px`);
    if (kq.soLo > 0) loi.push(`${rong}px: ${kq.soLo} điều khiển lọt ra ngoài khung — ${kq.loBenPhai.join(' · ')}`);
  }

  const dat = loi.length === 0;
  if (!dat) hong += 1;
  bang.push({ duong, dat, loi });
  console.log(`${dat ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m'} ${duong}`);
  for (const d of loi) console.log(`    \x1b[2m${d}\x1b[0m`);
}

await trinh.close();
may.close();

console.log(`\n${bang.length - hong}/${bang.length} trang chịu được cửa sổ hẹp`);
if (hong > 0) {
  console.log('\nLuật: mọi flex item chứa nội dung trang phải có `min-width: 0`,');
  console.log('và mọi hàng nút phải có `flex-wrap: wrap`. Xem AGENTS.md mục "Bố cục".');
}
process.exit(hong > 0 ? 1 : 0);
