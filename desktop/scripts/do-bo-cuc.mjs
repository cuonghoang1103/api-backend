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
/* 1920 thêm 05/09/2026: người dùng chạy app ở cửa sổ ~2000px và báo mọi trang
   "hẹp ở giữa". Bộ đo cũ dừng ở 1440 nên nó KHÔNG BAO GIỜ thấy được vấn đề đó —
   nó chỉ hỏi "có tràn khi hẹp không", không hỏi "có phí chỗ khi rộng không". */
const BE_RONG = JSON.parse(process.env.CT_RONG ?? 'null') ?? [1920, 1440, 1180, 1000, 860];
/** Cao khung nhìn dùng cho mọi trang — chốt "lớp phủ có nằm trong tầm nhìn không" đo theo nó. */
const innerHeightGia = 900;

/** Bản sao `mocPhamVi` của app, theo giờ MÁY. */
function mocPhamViThu(s, ref = new Date()) {
  const q = (n) => String(n).padStart(2, '0');
  const y = ref.getFullYear();
  if (s === 'today') return `${y}-${q(ref.getMonth() + 1)}-${q(ref.getDate())}`;
  if (s === 'week') {
    const d = new Date(ref); const thu = d.getDay() || 7;
    d.setDate(d.getDate() - (thu - 1));
    return `${d.getFullYear()}-${q(d.getMonth() + 1)}-${q(d.getDate())}`;
  }
  if (s === 'month') return `${y}-${q(ref.getMonth() + 1)}-01`;
  if (s === 'quarter') return `${y}-${q(Math.floor(ref.getMonth() / 3) * 3 + 1)}-01`;
  return `${y}-01-01`;
}

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

/*
 * CÂY SỔ TAY — CÓ TRẠNG THÁI.
 *
 * `POST /notes/subjects` thêm một môn thật vào cây, `DELETE` bỏ nó ra, và lần
 * gọi `/notes/tree` sau đó trả cây ĐÃ ĐỔI. Nhờ vậy chốt "tạo mới phải mở ô đặt
 * tên" và "xoá phải ăn ngay lần bấm đầu" mới đo được điều chúng nói.
 */
let _cay = null;
let _idMoi = 900;
function cayNotes() {
  if (!_cay) {
    _cay = mang(4, (i) => ({
        id: i, name: ['JPD113', 'SWR302', 'JPD123', 'cuongthai.com'][i - 1] ?? `Môn ${i}`,
        color: null, emoji: ['🇯🇵', '📘', '🏛️', '🌐'][i - 1] ?? '📘',
        description: null, sortOrder: i, isPinned: i === 1,
        chapters: mang(i === 2 ? 3 : 1, (k) => ({
          id: i * 100 + k, title: `Chương ${k}`, sortOrder: k,
          notes: mang(2, (n) => ({
            id: i * 1000 + k * 10 + n, title: `Bài ${k}.${n}`, sortOrder: n,
            isPinned: false, isFavorite: false, isArchived: false, needsReview: false,
            updatedAt: '2026-09-01T00:00:00Z',
          })),
        })),
        notes: mang(1, (n) => ({
          id: i * 7000 + n, title: 'Ghi chú rời', sortOrder: n,
          isPinned: i === 1, isFavorite: false, isArchived: false, needsReview: false,
          updatedAt: '2026-09-01T00:00:00Z',
        })),
      }));
  }
  return _cay;
}
function themMonGia(name) {
  const m = { id: ++_idMoi, name: name ?? 'Môn học mới', color: null, emoji: '📘',
              description: null, sortOrder: 99, isPinned: false, chapters: [], notes: [] };
  cayNotes().push(m);
  return m;
}
function xoaMonGia(id) { _cay = cayNotes().filter((m) => m.id !== id); }
function themGhiChuGia(subjectId, chapterId, title) {
  const g = { id: ++_idMoi, title: title ?? 'Ghi chú mới', sortOrder: 99,
              isPinned: false, isFavorite: false, isArchived: false, needsReview: false,
              updatedAt: '2026-09-01T00:00:00Z' };
  const mon = cayNotes().find((m) => m.id === subjectId) ?? cayNotes()[0];
  const chuong = chapterId ? mon.chapters.find((c) => c.id === chapterId) : null;
  (chuong ? chuong.notes : mon.notes).push(g);
  /* Trả về HÌNH DẠNG ĐẦY ĐỦ của một ghi chú: `addNote` gọi `setSelected(res…)`
     và khung soạn thảo đọc `contentJson`. Trả thiếu là trang nổ ở chỗ chẳng
     liên quan gì tới thứ đang đo. */
  return { ...g, subjectId: mon.id, chapterId: chapterId ?? null,
           content: '', contentJson: null, deletedAt: null, tags: [] };
}

const BANG = [
    /* ── Sổ tay (Notes) ──
       Để đường này không có mock thì `/notes` vẽ ra "Chưa có môn học nào" —
       tức là cả thanh bên phân cấp (môn → chương → ghi chú), ô đổi tên tại
       chỗ, nút kéo-thả và mọi khác biệt bậc chữ CHƯA TỪNG được đo một lần.
       Đúng cái bẫy ghi ở đầu tệp: trạng thái rỗng là trạng thái dễ qua nhất. */
    /* ⚠️ Cây này là BIẾN, không phải hằng dựng lại mỗi lần gọi.
       Mock tĩnh không đo được "tạo mới" lẫn "xoá": tạo xong gọi lại
       `/notes/tree` vẫn ra cây cũ, nên hàng mới không bao giờ xuất hiện và
       mọi chốt nhắm vào nó đo một thứ không có trên màn hình. */
    [/\/agent\/usage/, () => ({ daDung: 2_400_000, tran: 6_500_000, tranGoc: 6_000_000, giaHan: 500_000,
      conLai: 4_100_000, phanTram: 37, soGio: 5, hoiLucNao: '2026-10-03T05:00:00Z', hoiHetLuc: null,
      coKeyGiaHan: true, tienNgay: { phanTram: 41, catViecNen: false, dungHet: false } })],
    [/\/notes\/tree/, () => ({
      tree: cayNotes(),
      recent: mang(3, (i) => ({ id: i, title: `Vừa mở ${i}`, subjectId: 1, chapterId: null })),
    })],
    /* ── Bốn cây port 24/08/2026 ──
       Endpoint đo bằng cách BẮT LỜI GỌI THẬT (`page.on('request')`) chứ không
       đọc mã đoán. Xếp mẫu CỤ THỂ trước: `/admin/content/projects` cũng khớp
       mẫu `/projects` phía dưới. */
    [/\/maker-lab\/projects/, () => mang(6, (i) => ({ id: i, slug: `du-an-${i}`,
        name: `Dự án phần cứng số ${i}`, title: `Dự án phần cứng số ${i}`,
        summary: 'Mô tả ngắn đủ dài để tràn sang dòng thứ hai như thật.',
        description: 'Mô tả ngắn.',
        /* ⚠️ Khớp `STATUS_META` + `BOARD_LABEL` trong `app/maker-lab/page.tsx`. */
        status: ['PLANNING', 'SOURCING', 'BUILDING', 'TESTING', 'LIVE', 'ARCHIVED'][i - 1],
        board: ['ESP32_S3', 'ESP8266', 'RP2040', 'STM32', 'ARDUINO', 'OTHER'][i - 1], coverUrl: null, thumbnailUrl: null,
        technologies: ['ESP32', 'PlatformIO'], tags: ['ESP32'], updatedAt: '2026-08-20T00:00:00Z' }))],
    [/\/admin\/content\/projects/, () => mang(5, (i) => ({ id: i, slug: `bai-${i}`,
        title: `Dự án nội dung số ${i}`, /* ⚠️ Giá trị PHẢI khớp `CONTENT_STATUS_META` trong `lib/studio-meta.ts` —
           trang tra `META[p.status].emoji`, sai khoá là `undefined.emoji`. */
        status: ['IDEA', 'SCRIPTING', 'FILMING', 'EDITING', 'PUBLISHED'][i - 1],
        /* ⚠️ `TypePill` tra `CONTENT_TYPE_META[type].emoji` — THIẾU HẲN trường
           này thì `undefined.emoji`. Giá trị lấy từ `lib/studio-meta.ts`. */
        type: ['LECTURE', 'TUTORIAL', 'VLOG', 'SHORTS', 'REVIEW'][i - 1],
        platform: 'YOUTUBE', publishAt: '2026-09-01T00:00:00Z', thumbnailUrl: null,
        tags: ['ai'], updatedAt: '2026-08-20T00:00:00Z', notes: null }))],
    [/\/finance\/dashboard/, () => ({ month: '2026-08',
        totalBalance: '125000000', netWorth: '180000000', totalRemainingDebt: '20000000',
        incomeThisMonth: '30000000', expenseThisMonth: '18500000', savingsThisMonth: '11500000',
        spendingVsIncomePct: 62, hasUnconvertedUsd: false,
        fx: { rate: '25400', updatedAt: '2026-08-22T00:00:00Z' },
        wallets: mang(4, (i) => ({ id: i, name: `Ví số ${i}`, type: 'BANK', currency: 'VND',
          balance: `${i * 10000000}`, icon: null, color: '#22c55e', isDefault: i === 1 })),
        budgets: mang(5, (i) => ({ category: { id: i, name: `Nhóm chi ${i}`, icon: null, color: '#f59e0b' },
          budget: '5000000', used: `${i * 800000}`, ratio: i * 0.18, status: 'OK' })),
        cashflow: mang(12, (i) => ({ date: `2026-08-${String(i).padStart(2, '0')}`,
          income: `${i * 200000}`, expense: `${i * 150000}` })),
        expenseByCategory: mang(6, (i) => ({
          category: { id: i, name: `Nhóm chi tiêu số ${i}`, icon: null, color: '#ef4444' },
          total: `${i * 900000}` })),
        upcomingPayments: mang(3, (i) => ({ id: i, debtId: i, lenderName: `Bên cho vay ${i}`,
          lenderType: 'BANK', currency: 'VND', dueDate: '2026-09-05', amountDue: '2000000',
          isOverdue: i === 1 })) })],
    [/\/projects/, () => mang(6, (i) => ({ id: i, slug: `du-an-${i}`,
        title: `Dự án số ${i} với tiêu đề khá dài để thử tràn`,
        name: `Dự án số ${i}`, summary: 'Tóm tắt dự án, dài vừa đủ để tràn dòng.',
        description: 'Tóm tắt dự án.', year: 2024 + (i % 2), role: 'Full-stack',
        status: 'DONE', coverUrl: null, thumbnailUrl: null, url: null,
        technologies: ['TypeScript', 'Node.js'], techStack: ['TypeScript', 'Node.js'],
        tags: ['web'], updatedAt: '2026-08-20T00:00:00Z' }))],
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
    /* ⚠️ Mẫu này phải đứng TRƯỚC `/messages/threads`, nếu không nó bị nuốt:
       `/\/messages\/threads/` khớp luôn cả `/messages/threads/1/messages` và
       trả về DANH SÁCH CUỘC cho chỗ đang chờ danh sách TIN. Hậu quả: mở một
       cuộc ra thì khung tin trống trơn, và bộ đo vẫn báo xanh vì trang không
       tràn — nó chỉ không đo được gì cả. */
    [/\/messages\/threads\/\d+\/messages/, () => [
      { id: 901, threadId: 1, senderId: 2, content: 'Chào bạn, hôm nay học mấy giờ?', createdAt: '2026-08-20T03:05:00Z', sender: nguoi(2) },
      { id: 902, threadId: 1, senderId: 1, content: 'Slot 2 nhé, phòng BE-210.', createdAt: '2026-08-20T03:06:00Z', sender: nguoi(1) },
      { id: 903, threadId: 1, senderId: 2, content: 'Mình gửi bạn đoạn này:\nnpm install\nnpm run dev\n\nChạy thử xem sao.', createdAt: '2026-08-20T03:07:00Z', sender: nguoi(2) },
      { id: 904, threadId: 1, senderId: 1, content: 'Ok để mình thử.', createdAt: '2026-08-20T03:08:00Z', sender: nguoi(1) },
    ]],
    /* `peer` chứ không `participants` — đó là tên trường app desktop đọc. */
    [/\/messages\/threads/, () => mang(5, (i) => ({ id: i, type: 'USER', title: `Cuộc trò chuyện ${i}`,
        lastMessage: { content: 'Tin nhắn gần nhất', senderId: 2, createdAt: '2026-08-20T00:00:00Z' },
        unreadCount: i % 2, peer: nguoi(i + 1), participants: [nguoi(1), nguoi(i + 1)],
        lastMessageAt: '2026-08-20T00:00:00Z', updatedAt: '2026-08-20T00:00:00Z' }))],
    [/\/friends|\/users/, () => mang(6, (i) => nguoi(i))],
    /* `/feed/posts` trả về MỘT MẢNG, không phải `{posts:[…]}` — trang gọi
       `ds.map` thẳng trên `data`. Trả sai hình dạng thì trang hiện thẻ lỗi,
       mà thẻ lỗi có đủ chữ để qua chốt "gần như trống" nên bộ đo vẫn báo XANH. */
    [/\/feed\/posts/, () => mang(4, (i) => ({
      id: i, content: `Bài viết thử số ${i} — một đoạn đủ dài để thấy cách xuống dòng.`,
      author: nguoi(i), createdAt: '2026-08-20T00:00:00Z',
      likeCount: i * 3, commentCount: i, media: [], type: 'POST',
    }))],
    [/\/feed\/trending/, () => mang(3, (i) => ({ id: i, tag: `chude${i}`, postsCount: i * 4 }))],
    [/\/posts|\/feed/, () => ({ posts: mang(4, (i) => ({ id: i, content: `Bài viết ${i}`, author: nguoi(i),
        createdAt: '2026-08-20T00:00:00Z', likeCount: i, commentCount: i, media: [] })),
      pagination: { page: 1, size: 10, total: 4, totalPages: 1 } })],
    [/\/music\/tracks/, () => ({ items: mang(8, (i) => ({ id: i, title: `Bài hát ${i}`, artist: 'Ca sĩ',
        audioUrl: '', coverUrl: null, durationSec: 200 })), total: 8 })],
    /* ⚠️ Mock này viết cho màn NATIVE cũ (một danh sách phẳng) và thiếu gần
       hết các trường. Từ 07/09/2026 desktop dùng lại CÂY WEB, và cây đó chạy
       `for (const t of a.tags)` không chốt ⇒ thiếu `tags` là VỠ CẢ TRANG
       ("a.tags is not iterable"), không phải hiển thị thiếu.
       API thật luôn trả `tags: … ?? []` (techTrends.routes.ts:191) nên đây là
       lỗ hổng của MOCK, không phải lỗi sản phẩm — nhưng một mock nghèo hơn
       API thật thì đo ra kết quả vô nghĩa. Giữ khớp hình dạng thật. */
    [/\/tech-trends\/articles/, () => mang(6, (i) => ({
      id: i, title: `Bài công nghệ ${i}`, slug: `bai-${i}`,
      summary: 'Tóm tắt bài viết.', publishedAt: '2026-08-20T00:00:00Z',
      category: ['AI', 'Backend', 'Frontend'][i % 3],
      tags: ['docker', 'ci'].slice(0, (i % 2) + 1),
      coverEmoji: '📰', codeBlock: null,
      /* Một nửa TƯƠNG ĐỐI, một nửa TUYỆT ĐỐI — đúng hai dạng có thật trong DB
         production. Dạng tương đối là dạng vỡ trên app (origin `app://`), nên
         mock phải có nó thì bộ đo mới chạm tới được. */
      coverImageUrl: i % 2 ? '/deepdives/vue/reactivity-tracking.svg'
                           : 'https://media.cuongthai.com/images/post/u1/a.webp',
      toc: [], readTimeMin: 6, trendingScore: i, isFeatured: i === 0,
      status: 'PUBLISHED', kind: 'ARTICLE', sources: [], author: null,
    }))],
    [/\/tech-trends\/resources/, () => mang(4, (i) => ({
      id: i, title: `Tài nguyên ${i}`, url: 'https://example.com',
      description: 'Mô tả ngắn.', tags: ['tool'], category: 'Tooling',
    }))],
    /* ── CV Builder (22/08/2026) ──
       Mock CŨ ở đây trả một DANH SÁCH CV (`[{id,title,updatedAt}]`) — sai hình
       dạng với cây web: `/cv/profile` trả MỘT hồ sơ có `items`/`skills`/…
       Xếp `completeness` trước `profile`, và cả hai trước mẫu `/cv` chung. */
    [/\/cv\/profile\/completeness/, () => ({ percent: 72,
        checks: mang(7, (i) => ({ key: `k${i}`, label: `Mục cần hoàn thiện số ${i}`, done: i % 2 === 0 })),
        counts: { items: 6, bullets: 18, skills: 12, certifications: 3, languageSkills: 2, documents: 1 } })],
    [/\/cv\/profile/, () => ({ id: 1, userId: 1,
        fullName: 'Nguyễn Văn Cường', headline: 'Kỹ sư phần mềm — Node.js & PostgreSQL',
        email: 'cuong@example.com', phone: '0900000000', location: 'Hà Nội',
        links: { github: 'https://github.com/x', linkedin: 'https://linkedin.com/in/x' },
        photoR2Key: null, dateOfBirth: null,
        summary: 'Tóm tắt nghề nghiệp dài vừa đủ để tràn sang vài dòng như hồ sơ thật.',
        targetRoles: ['Backend Engineer', 'Full-stack Engineer'], seniority: 'MID',
        locationsPref: ['Hà Nội', 'Remote'], remotePref: 'HYBRID',
        items: mang(6, (i) => ({ id: i,
          kind: ['EXPERIENCE', 'PROJECT', 'EDUCATION', 'OPEN_SOURCE', 'AWARD', 'VOLUNTEER'][i - 1],
          title: `Vị trí hoặc dự án số ${i} với tên khá dài để thử tràn`,
          organization: `Công ty số ${i}`, location: 'Hà Nội', employmentType: 'FULL_TIME',
          startDate: '2024-01-01', endDate: i === 1 ? null : '2025-06-01', isCurrent: i === 1,
          url: null, techStack: ['TypeScript', 'Node.js', 'PostgreSQL'],
          context: 'Bối cảnh ngắn của mục này.', gpa: null, sortOrder: i,
          bullets: mang(3, (k) => ({ id: i * 10 + k, itemId: i,
            text: `Gạch đầu dòng số ${k}: mô tả việc đã làm và kết quả đo được, dài như thật.`,
            userStatedFacts: null, verified: k === 1, aiGenerated: k === 3,
            skillsEvidenced: ['Node.js'], strength: ['WEAK', 'OK', 'STRONG'][k - 1], sortOrder: k })) })),
        skills: mang(12, (i) => ({ id: i, name: `Kỹ năng ${i}`,
          category: ['LANGUAGE', 'FRAMEWORK', 'DATABASE', 'INFRA', 'TOOL', 'PRACTICE', 'SOFT'][i % 7],
          proficiency: 'ADVANCED', yearsUsed: 3, sortOrder: i })),
        certifications: mang(3, (i) => ({ id: i, name: `Chứng chỉ số ${i}`, issuer: `Tổ chức ${i}`,
          issuedAt: '2025-01-01', expiresAt: null, credentialUrl: null, sortOrder: i })),
        languageSkills: mang(2, (i) => ({ id: i, language: i === 1 ? 'Tiếng Anh' : 'Tiếng Nhật',
          level: 'B2', note: null, sortOrder: i })) })],
    [/\/cv\/import/, () => mang(3, (i) => ({ id: i, status: 'DONE', source: 'PASTE',
        createdAt: '2026-08-20T00:00:00Z', fileName: `ho-so-${i}.pdf`, error: null }))],
    [/\/cv\/documents/, () => mang(2, (i) => ({ id: i, name: `Tài liệu ${i}`,
        createdAt: '2026-08-20T00:00:00Z' }))],
    /* Trạng thái Pro — `usePro()` hỏi endpoint này. Không có mock thì nó trả
       rỗng và mọi tính năng Pro bị khoá trong bộ đo, che mất đúng nhánh cần đo. */
    [/\/pro\/status|\/pro\/me/, () => ({
      isAdmin: true, isPro: true, effective: true, lifetime: true,
      expiresAt: null, source: 'admin',
    })],
    [/\/academy\/semesters/, () => mang(9, (i) => ({ id: i, name: `Kỳ ${i}`, code: `KY${i}`, ordinal: i }))],
    /* ⚠️ Mock CŨ dừng ở danh sách KỲ — không có môn, nên không có thẻ nào để
       bấm, nên bộ đo CHƯA BAO GIỜ mở tới màn bài học. Và màn bài học mới là
       chỗ gắn `CourseTutor` của web. 09/09/2026 cả trang Học viện chết trong
       bản đã phát hành ("No QueryClient set") mà bộ đo vẫn 42/42 xanh — nó đo
       đúng phần không hỏng. Hai mock dưới đây mở đường tới đó. */
    [/\/courses\/semester\//, () => mang(3, (i) => ({
      id: i, slug: `mon-${i}`, title: `Môn ${i}|||Môn ${i}`, courseCode: `SWT30${i}`,
      thumbnailUrl: null, totalLessons: 2,
      sections: [{ id: i, title: `Chương 1`, lessonCount: 2 }],
    }))],
    [/\/courses\/[a-z0-9-]+$/, () => ({
      id: 1, slug: 'mon-1', title: 'Môn 1|||Môn 1', courseCode: 'SWT301',
      isEnrolled: true,
      sections: [{
        id: 1, title: 'Chương 1|||Chương 1',
        lessons: [
          /* CÓ video: khung phát là thứ chiếm nhiều chỗ nhất trên màn bài học
             và là chỗ vừa vỡ bố cục (09/09/2026, video cao 787px nuốt cả màn
             hình). `videoUrl: null` thì bộ đo không bao giờ dựng nó ra. */
          { id: 1, title: 'Bài 0.1|||Bài 0.1', isFreePreview: true, durationSec: 567,
            content: 'Nội dung bài học.', videoPlatform: 'EMBED',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 2, title: 'Bài 0.2|||Bài 0.2', isFreePreview: true, durationSec: 0,
            content: 'Nội dung bài hai.', videoPlatform: 'EMBED', videoUrl: null },
        ],
      }],
    })],
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
    /* Thời khoá biểu — dựng theo đúng lịch thật trong ảnh người dùng gửi
       (SWT301/FER202/SWR302/JPD123/LAB211), để bảng được đo ở hình dạng thật
       chứ không phải một lịch hai môn cho dễ. */
    [/\/class-schedule\/attendance/, () => ({ items: [
      { id: 1, scheduleId: 1, date: mocPhamViThu('today'), status: 'co' },
      { id: 2, scheduleId: 3, date: mocPhamViThu('today'), status: 'vang' },
    ] })],
    [/\/class-schedule/, () => ({ items: [
      { id: 1, subject: 'Software Testing', classCode: 'SWT301', room: 'DE-412', weekday: 3, startTime: '07:30', endTime: '09:50', remindMinutes: 30, soBuoiVang: 1 },
      { id: 2, subject: 'Front-End', classCode: 'FER202', room: 'DE-324', weekday: 4, startTime: '07:30', endTime: '09:50', remindMinutes: 30, soBuoiVang: 0 },
      { id: 3, subject: 'Software Requirement', classCode: 'SWR302', room: 'BE-201', weekday: 5, startTime: '07:30', endTime: '09:50', remindMinutes: 30, soBuoiVang: 4 },
      { id: 4, subject: 'Tiếng Nhật', classCode: 'JPD123', room: 'DE-C304', weekday: 6, startTime: '07:30', endTime: '09:50', remindMinutes: 30, soBuoiVang: 0 },
      { id: 5, subject: 'Software Requirement', classCode: 'SWR302', room: 'BE-210', weekday: 2, startTime: '10:00', endTime: '12:20', remindMinutes: 30, soBuoiVang: 0 },
      { id: 6, subject: 'Tiếng Nhật', classCode: 'JPD123', room: 'DE-C304', weekday: 3, startTime: '10:00', endTime: '12:20', remindMinutes: 30, soBuoiVang: 2 },
      { id: 7, subject: 'Software Testing', classCode: 'SWT301', room: 'DE-216', weekday: 5, startTime: '10:00', endTime: '12:20', remindMinutes: 30, soBuoiVang: 0 },
      { id: 8, subject: 'Lab OOP', classCode: 'LAB211', room: 'DE-223', weekday: 2, startTime: '12:50', endTime: '15:10', remindMinutes: 30, soBuoiVang: 0 },
      { id: 9, subject: 'Lab OOP', classCode: 'LAB211', room: 'DE-C203', weekday: 5, startTime: '15:20', endTime: '17:40', remindMinutes: 30, soBuoiVang: 0 },
    ] })],
    /* Điểm uy tín (KeHoachNgay) — thiếu mock thì `uyTin.bac.mau` nổ và cả
       `/dashboard` thành trang trắng trong bộ đo (03/10/2026). */
    [/\/dashboard\/uy-tin/, () => ({ diem: 72, moc: 100, so: [],
      bac: { ma: 'kha', ten: 'Khá', mau: '#22c55e', mo: 'Giữ nhịp đều.' } })],
    [/\/dashboard\/ngay/, () => ({ tasks: [] })],
    [/\/dashboard\/thang/, () => ({ ngay: {} })],
    [/\/dashboard$/, () => ({ level: 3, exp: 120, totalExp: 500, streak: 4,
        timeline: mang(24, (i) => ({ hour: i - 1, activity: i % 3 === 0 ? 'hoc' : null })),
        /* Dữ liệu giả phải chạm được vào MỌI nhánh hiển thị mới, nếu không bộ đo
           chỉ chứng minh cái danh sách rỗng cũng vẽ ra được: ưu tiên các mức,
           việc có hạn (trong hạn + quá hạn), có ghi chú, có nhắc, và cả bốn
           phạm vi ngoài "hôm nay". */
        tasks: [
          ...mang(4, (i) => ({
            id: i, scope: 'today', date: (() => { const d = new Date(); const q = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${q(d.getMonth() + 1)}-${q(d.getDate())}`; })(),
            title: `Việc cần làm số ${i}`, done: i % 2 === 0, exp: 25,
            priority: i % 4,
            dueAt: i === 1 ? new Date(Date.now() + 36e5).toISOString()
              : i === 3 ? new Date(Date.now() - 36e5).toISOString() : null,
            note: i === 2 ? 'Ghi chú dài để kiểm dòng chữ không tràn khỏi thẻ.' : null,
            remindAt: i === 1 ? new Date(Date.now() + 18e5).toISOString() : null,
            repeat: i === 2 ? 'daily' : 'none', parentId: null, sortOrder: i,
          })),
          /* Việc CON của việc số 1 — để bộ đo chạm được cả nhánh lồng, thụt lề,
             và bộ đếm "1/2". */
          ...mang(2, (i) => ({
            id: 200 + i, scope: 'today',
            date: (() => { const d = new Date(); const q = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${q(d.getMonth() + 1)}-${q(d.getDate())}`; })(),
            title: `Bước nhỏ ${i + 1}`, done: i === 0, exp: 5,
            priority: 0, dueAt: null, note: null, remindAt: null,
            repeat: 'none', parentId: 1, sortOrder: i,
          })),
          /* Mốc phải khớp `mocPhamVi` phía app (giờ MÁY), nếu không việc bị lọc
             hết và bộ đo lại chứng minh một danh sách rỗng vẽ ra được. */
          ...['week', 'month', 'quarter', 'year'].map((sc, i) => ({
            id: 100 + i, scope: sc, date: mocPhamViThu(sc), title: `Mục tiêu ${sc}`,
            done: false, exp: 25, priority: 0, dueAt: null, note: null, remindAt: null,
          })),
        ],
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
  const cach = tuyen.request().method();

  /* ── Xưởng Remix: AI kèm cặp ──
     Câu trả lời giả CỐ Ý mang cả hai cảnh báo (số lạ + bị cắt): chúng là hai
     khối chữ dài nhất của phần này, và chỉ hiện khi model trả về đúng cờ đó.
     Trả một câu sạch thì hai khối ấy chưa từng được đo lần nào. */
  if (/\/xuong-remix\/trang-thai$/.test(duong)) {
    await tuyen.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { sanSang: true, model: 'claude-sonnet-5' } }),
    });
    return;
  }
  if (/\/xuong-remix\/kem-cap$/.test(duong) && cach === 'POST') {
    await tuyen.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, data: {
        traLoi: [
          '- Bài đang ở -9.4 LUFS, còn thấp hơn mức phát hành của nhạc sàn — nén thêm rồi nâng.',
          '- Dải 8000 Hz đang -31.5 dB, mỏng so với phần trầm ở 63 Hz (-14.2 dB). Nâng phần cao lên.',
          '- Đỉnh thật 0.8 dBTP là ĐÃ VƯỢT 0 — hạ trần bộ hạn biên xuống -1 dBTP trước khi xuất.',
          '- Tin cậy tông chỉ 18%, nên nghe lại bằng tai trước khi dịch tông cả bài.',
        ].join('\n'),
        model: 'claude-sonnet-5',
        soLa: ['200', '3500'],
        biCat: true,
      } }),
    });
    return;
  }

  /* Đẩy bài lên kho Remix (khâu 08). Trả 200 để khối "đã lên kho" hiện ra —
     đó là dòng chữ dài nhất của phần này, và nó chỉ tồn tại sau một lượt đẩy
     thành công. */
  if (/\/music\/tracks$/.test(duong) && cach === 'POST') {
    await tuyen.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { id: 4242, title: 'Bài thử' } }),
    });
    return;
  }

  /* ── Sổ tay: GHI được, không chỉ ĐỌC ──
     Tạo/xoá là hai thao tác người dùng báo hỏng nhiều nhất, và cả hai chỉ đo
     được nếu lần gọi `/notes/tree` KẾ TIẾP phản ánh thay đổi. Mock chỉ-đọc thì
     hàng mới không bao giờ xuất hiện, và chốt nhắm vào nó luôn đỏ với lý do
     sai (hoặc tệ hơn: tự tắt và báo xanh). */
  if (/\/notes\/notes$/.test(duong) && cach === 'POST') {
    let than = {};
    try { than = JSON.parse(tuyen.request().postData() ?? '{}'); } catch { /* body rỗng */ }
    await tuyen.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'ok',
        data: themGhiChuGia(than.subjectId, than.chapterId ?? null, than.title),
        timestamp: '2026-08-22T00:00:00Z' }),
    });
    return;
  }

  if (/\/notes\/subjects(\/\d+)?$/.test(duong) && cach !== 'GET') {
    let du = null;
    if (cach === 'POST') {
      let ten;
      try { ten = JSON.parse(tuyen.request().postData() ?? '{}').name; } catch { /* body rỗng */ }
      du = themMonGia(ten);
    } else if (cach === 'DELETE') {
      xoaMonGia(Number(duong.split('/').pop()));
      du = { ok: true };
    }
    await tuyen.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'ok', data: du, timestamp: '2026-08-22T00:00:00Z' }),
    });
    return;
  }

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

/* `CT_NGOAI_TUYEN=1` (03/10/2026) — dựng trang ở trạng thái MẤT MẠNG: dải
   "🔌 Ngoại tuyến", màu nhấn xanh mòng két, chip model cục bộ. Đọc ở bản giả
   `app-state` (vite.bo-cuc.config.ts) và ở `kiemMang` của cầu nối giả. */
await ctx.addInitScript((matMang) => { globalThis.__CT_ONLINE = !matMang; }, process.env.CT_NGOAI_TUYEN === '1');
/* Chủ đề app mà bản giả app-state báo cho trang (`resolvedTheme`) — trước 03/10/2026
   nó luôn là 'dark', nên `CT_THEME=light` chỉ đổi màu VỎ app còn trang đọc chủ đề từ
   app-state (vd. mục IELTS gắn html.theme-dark) vẫn tối: ảnh chụp sai. */
await ctx.addInitScript((t) => { globalThis.__CT_THEME = t; }, process.env.CT_THEME || 'dark');

/* `CT_THANH_BEN=rong|hep|an` (03/10/2026) — trạng thái thanh bên DỰ ÁN của AI
   Code. Người dùng chụp lỗi ở đúng ba trạng thái này: kéo rộng, kéo hẹp tối
   thiểu (chữ bị cắt mép TRÁI), ẩn hẳn (nút mở lại trôi giữa mép). Bơm thẳng
   vào thiết đặt của bản giả `app-state` (vite.bo-cuc.config.ts). */
await ctx.addInitScript((tb) => {
  globalThis.__CT_SETTINGS = tb === 'hep' ? { aiThanhBenRong: 190 }
    : tb === 'an' ? { aiThanhBenGap: true }
      : tb === 'rong' ? { aiThanhBenRong: 380 } : {};
}, process.env.CT_THANH_BEN ?? '');

await ctx.addInitScript((nn) => {
  /* `CT_NGON_NGU=en` để đo bố cục ở BẢN TIẾNG ANH — chữ hai thứ tiếng dài khác
     nhau, và nhãn nào tràn khỏi nút chỉ lộ ra khi dựng bằng đúng thứ tiếng đó.
     ⚠️ Phải đặt trên `globalThis`, KHÔNG qua `settings.getAll()`: bản giả
     `app-state` trong `vite.bo-cuc.config.ts` thay hẳn provider thật nên nó
     chẳng bao giờ đọc cầu nối. Đo thật: `getAll` trả `{ngonNgu:'en'}` mà thanh
     bên vẫn tiếng Việt. */
  globalThis.__CT_NGON_NGU = nn;
  /* API client của chính app desktop (xem chú thích trên). Cho nó đi RA MẠNG
     để `ctx.route` phía Node trả lời, thay vì mang một bản sao bảng dữ liệu
     thứ hai vào trong trang. Người gọi mong nhận payload TRẦN, nên bóc
     envelope ở đây. Đường không có mock vẫn trả về hình dạng rỗng cũ. */
  /*
   * ⚠️ PHẢI CHUYỂN TIẾP `method` VÀ `body` (sửa 12/09/2026).
   *
   * Bản đầu chỉ nhận đối số thứ NHẤT và luôn `fetch` bằng GET. Hậu quả: mọi
   * lời gọi GHI của trang native — `api.request(d, { method: 'POST', body })`
   * — âm thầm biến thành GET, không khớp mock nào (mock POST kiểm cả
   * `cach === 'POST'`), rơi xuống máy chủ tĩnh, 404, rồi hàm này nuốt lỗi và
   * trả `RONG` như thể mọi thứ bình thường. Trang nhận một object SAI HÌNH
   * DẠNG, và Xưởng Remix nổ ở `traLoiAi.soLa.length` — React 18 gỡ cả cây,
   * nên bộ đo nhìn thấy `#root` TRỐNG mà `pageerror` thì đã bay mất từ lúc
   * nào. Mất một buổi đi tìm ở `useSession`, trong khi lỗi nằm ở BỘ ĐO.
   *
   * Nói rộng hơn: trước hôm nay KHÔNG một đường ghi nào của trang native từng
   * được bộ đo chạm tới. Xem [[feedback_verify_the_checker_before_the_content]].
   */
  const RONG = { data: [], items: [], results: [] };
  window.__giaApi = async (duong, tuyChon) => {
    try {
      const d = String(duong ?? '');
      const o = tuyChon ?? {};
      const r = await fetch(`/api/v1${d.startsWith('/') ? d : `/${d}`}`, {
        method: o.method ?? 'GET',
        /* Giống `client.ts`: chỉ đặt Content-Type khi CÓ thân, và
           `JSON.stringify` nó — mock đọc `postData()` mong chuỗi JSON. */
        headers: o.body === undefined ? {} : { 'Content-Type': 'application/json' },
        ...(o.body === undefined ? {} : { body: JSON.stringify(o.body) }),
      });
      if (!r.ok) return RONG;
      return (await r.json()).data ?? RONG;
    } catch { return RONG; }
  };

  /* Cầu nối Electron giả. Mỗi nhóm trả thứ HỢP KIỂU cho nhóm đó — `undefined`
     ở khắp nơi làm trang nổ ở chỗ chẳng liên quan gì tới bố cục. */
  let demCuoc = 0;
  const RA = {
    getInfo: { version: '0.0.0', platform: 'darwin', apiOrigin: '', pro: true, configured: true,
               soViecConLai: 20, models: [], mucNoLuc: [] },
    getAll: nn ? { ngonNgu: nn } : {},
    listDownloaded: [], usage: { count: 0, totalBytes: 0 },
    /* Xưởng Remix. Trạng thái RỖNG của trang này chỉ có một vùng thả tệp — tức
       là gần như không có gì để đo. Trạng thái ĐÔNG mới là chỗ dễ vỡ: lưới 4 ô
       số đo, dải chip hoà âm, và mười cột phổ có nhãn. `CHUAN_BI` ở dưới thả
       một tệp WAV dựng tại chỗ để đưa trang tới đó. */
    /* ⚠️ KHOÁ PHẢI KHỚP `MucKhoModel` trong `shared/ipc.ts`.
       Bản trước còn gọi là `byte` (tên cũ, đã đổi thành `byteUocTinh` lúc thêm
       lối chọn tệp tay) và thiếu hẳn `coNguonTai`. Hậu quả đúng kiểu bộ đo dối:
       ô model hiện `~NaN MB` — một trạng thái app THẬT không bao giờ tạo ra —
       còn nút `Tải về` thì chưa từng được dựng lần nào, nên hàng HAI NÚT cạnh
       nhau (hàng rộng nhất của cả khối) chưa từng đi qua phép đo. Thấy được
       nhờ nhìn ảnh chụp, không phép kiểm nào đỏ. */
    khoModel: [
      { ma: 'htdemucs-4stem', ten: 'HT-Demucs · 4 stem', byteUocTinh: 316000000,
        moTa: 'Trống, bass, nhạc nền, giọng hát. Bản đầy đủ — chọn cái này để remix sâu.',
        coRoi: true, byteThat: 1260000000, coNguonTai: true },
      /* `coNguonTai: true` cho model này để hàng hai nút được đo. Production
         hiện để `null` cho nó (chưa có đường tải kiểm chứng được), nhưng model
         4 stem lúc CHƯA tải dựng ra đúng hàng ấy — nên đây là trạng thái thật
         của giao diện, chỉ là gắn vào dòng khác cho tiện đo. */
      { ma: 'htdemucs-vocals', ten: 'HT-Demucs · chỉ giọng hát', byteUocTinh: 166000000,
        moTa: 'Chỉ tách giọng, nhẹ hơn 7,6 lần. Đủ cho phần lớn bản remix vinahouse.',
        coRoi: false, byteThat: 0, coNguonTai: true },
    ],
    napBai: { id: '00000000-0000-4000-8000-000000000001', ten: 'Bài thử rất dài để xem tên có tràn ra ngoài ô không.mp3', giay: 254, soKenh: 2,
              duongWav: '/tmp/x/phien/bai-thu/goc.wav' },
    /* Dạng sóng cho bàn làm việc. Dựng số THẬT chứ không mảng rỗng: canvas
       nhận mảng rỗng thì vẽ ra một dải trống, tức là bộ đo nhìn năm ô trắng
       và không bao giờ thấy dải sóng cao lên chạm mép hàng. Biên độ đi theo
       một đường bao có to có nhỏ, giống bố cục một bài nhạc, để chỗ dày nhất
       của dải đúng là chỗ được đo. */
    song: (() => {
      const N = 1400;
      const min = {}, max = {};
      for (const [k, he] of [['goc', 1], ['drums', 0.85], ['bass', 0.7],
                             ['other', 0.55], ['vocals', 0.45]]) {
        const a = new Float32Array(N), b = new Float32Array(N);
        for (let i = 0; i < N; i++) {
          const t = i / N;
          /* Đường bao: vào nhỏ, giữa to, cuối nhỏ dần — cộng một nhịp nhanh
             để dải không phải một khối đặc. */
          const bao = (0.25 + 0.75 * Math.sin(Math.PI * t)) * (0.7 + 0.3 * Math.sin(t * 90));
          const v = Math.min(0.98, he * bao);
          b[i] = v;
          a[i] = -v * 0.92;   // sóng thật không đối xứng
        }
        min[k] = a; max[k] = b;
      }
      return { min, max, giay: 254 };
    })(),
    napBanMau: { ten: 'DJ Tilo - Nonstop 2026.mp3', lufs: -6.8, dinhThat: -0.9, daiDong: 6.1,
                 rongStereo: 0.42,
                 dai: { 31.5: -24.0, 63: -9.8, 125: -8.9, 250: -12.1, 500: -15.0,
                        1000: -17.2, 2000: -19.4, 4000: -21.0, 8000: -23.2, 16000: -33.8 } },
    /* Bản giao cho khâu 08. Dựng một WAV THẬT (im lặng, 0,4 giây) chứ không
       trả mảng rỗng: thẻ <audio> với nguồn hỏng vẽ ra một thanh điều khiển
       khác hẳn thanh bình thường, và lúc đó bộ đo đang đo một thứ người dùng
       không bao giờ thấy. */
    banGiao: (() => {
      /* 95 giây chứ không phải nửa giây: thẻ <audio> chỉ hiện ĐỘ DÀI khi nó
         giải mã được thật, và một tệp 0,4 giây hiện "0:00" y hệt lúc giải mã
         HỎNG. Dài đủ để đồng hồ đọc ra "1:35" thì con số ấy trở thành bằng
         chứng rằng cả đường Uint8Array → File → blob: → <audio> chạy được,
         chứ không chỉ là "thanh điều khiển có vẽ ra". */
      const fs = 8000, n = fs * 95;
      const b = new ArrayBuffer(44 + n * 2);
      const v = new DataView(b);
      const chu = (i, t) => { for (let k = 0; k < t.length; k++) v.setUint8(i + k, t.charCodeAt(k)); };
      chu(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); chu(8, 'WAVE'); chu(12, 'fmt ');
      v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
      v.setUint32(24, fs, true); v.setUint32(28, fs * 2, true); v.setUint16(32, 2, true);
      v.setUint16(34, 16, true); chu(36, 'data'); v.setUint32(40, n * 2, true);
      return { ten: 'Bài thử rất dài để xem tên có tràn ra ngoài ô không (tron).wav',
               byte: new Uint8Array(b), giay: 254, mime: 'audio/wav' };
    })(),
    /* Kho MẪU. Một mẫu CÓ giấy phép và một mẫu MẤT tệp giấy phép: nhánh cảnh
       báo (viền vàng + chữ "mất tệp giấy phép") chỉ tồn tại ở mẫu thứ hai, và
       nó là dòng dài nhất của cả ô. */
    dsMau: [
      { id: 'k1', tep: 'Giọng nữ 128 BPM.wav', duong: '/tmp/x/kho-mau/a.wav',
        byte: 18_400_000, ten: 'Giọng nữ 128 BPM · a cappella', giayPhep: 'cc-by',
        tacGia: 'Một Ai Đó Trên ccMixter', nguon: 'ccMixter',
        url: 'https://ccmixter.org/files/x/12345', themLuc: 1757000000000, coGiayPhep: true },
      { id: 'k2', tep: 'loop khong ro nguon.mp3', duong: '/tmp/x/kho-mau/b.mp3',
        byte: 2_100_000, ten: 'loop khong ro nguon', giayPhep: 'khac',
        tacGia: '', nguon: '', url: '', themLuc: 1756000000000, coGiayPhep: false },
    ],
    /* Kho bài cho dòng thời gian. HAI bài khác nhịp khác tông — bản mashup
       một bài không có gì để ghép, và cũng không dựng ra được làn thứ hai
       (khối cao nhất của khối này). Tên dài có chủ ý. */
    dsBai: [
      { id: '00000000-0000-4000-8000-000000000001',
        ten: 'Bài thử rất dài để xem tên có tràn ra ngoài ô không.mp3',
        giay: 254, duongWav: '/tmp/x/phien/bai-thu/goc.wav',
        bpm: 139.8, tong: 'Am', tongCamelot: '8A',
        duong: ['goc', 'drums', 'bass', 'other', 'vocals'] },
      { id: '00000000-0000-4000-8000-000000000002',
        ten: 'Bài thứ hai để ghép.flac',
        giay: 187, duongWav: '/tmp/x/phien/bai-hai/goc.wav',
        bpm: 124.0, tong: 'F', tongCamelot: '7B',
        duong: ['goc'] },
    ],
    /* Kết quả DỰNG mashup. `boQua` có một mục CÓ CHỦ Ý: dòng cảnh báo đó là
       khối chữ dài nhất của cả phần này, và nó chỉ tồn tại khi có mảnh bị bỏ. */
    dungMashup: {
      duong: '/tmp/x/phien/bai-thu/xuat/ban mashup 128BPM.wav',
      ten: 'ban mashup 128BPM.wav',
      giay: 12.4, daiGiay: 96.5,
      daDung: ['m1', 'm2'],
      boQua: [{ id: 'm3', viSao: 'Phải kéo 0.33 lần — ngoài khoảng nghe được (0.5…2). '
                              + 'Nhịp gốc dò ra 42.0 BPM; nếu con số đó sai thì sửa nó trước.' }],
      dinhTruoc: 1.34, lufs: -7.9, dinhThat: -1.0,
    },
    /* Kết quả XUẤT TỆP. Dòng nó dựng ra mang tên tệp DÀI + ba con số + một nút
       — hàng chữ dài nhất của cả khối chất lượng, nên nó phải được đo. */
    xuatTep: {
      duong: '/tmp/x/phien/bai-thu/Bài thử rất dài để xem tên có tràn ra ngoài ô không (tron).mp3',
      ten: 'Bài thử rất dài để xem tên có tràn ra ngoài ô không (tron).mp3',
      byte: 10_180_224, moTa: 'MP3 320 kbps', giay: 21.7,
    },
    /* Kết quả TÁCH. Thiếu nó thì `ketQua` là null, và cả danh sách stem LẪN
       bàn trộn không bao giờ được dựng ra — hai khối rộng nhất của trang chưa
       từng đi qua bộ đo một lần nào (phát hiện 12/09/2026, khi thêm bàn trộn). */
    tach: {
      thuMuc: '/tmp/x/phien/bai-thu',
      tep: {
        drums: '/tmp/x/phien/bai-thu/drums.wav', bass: '/tmp/x/phien/bai-thu/bass.wav',
        other: '/tmp/x/phien/bai-thu/other.wav', vocals: '/tmp/x/phien/bai-thu/vocals.wav',
      },
      giay: 214,
    },
    master: {
      duong: '/tmp/x/Bài thử (master).wav', tenBanMau: 'DJ Tilo - Nonstop 2026.mp3',
      chinhDb: 4.2, lufsTruoc: -13.6, lufsSau: -6.9, dinhThatSau: -1.0, giay: 8.4,
      /* Danh sách nhận xét DÀI có chủ ý: đây là chỗ dễ vỡ nhất của khối chấm
         bài — hai cột chữ cạnh nhau ở cửa sổ hẹp. Để một hai dòng thì bộ đo
         báo xanh mà chưa hề chạm tới tình huống thật. */
      chamTruoc: [
        'Bài bạn nhỏ hơn bản mẫu 6.7 LU — cần nén và nâng thêm.',
        'Thiếu 8.3 dB ở 8 kHz so với bản mẫu.',
        'Thiếu 5.1 dB ở 4 kHz so với bản mẫu.',
        'Thừa 4.4 dB ở 63 Hz so với bản mẫu.',
        'Ảnh stereo hẹp hơn bản mẫu — nới phần cao ra hai bên, giữ trầm ở giữa.',
      ],
      chamSau: ['Thiếu 3.2 dB ở 16 kHz so với bản mẫu.'],
    },
    /* Bản trộn. `nguonKick: 'nhip'` CÓ CHỦ Ý: đó là nhánh có cảnh báo, tức là
       khối chữ dài nhất của phần này. Trả 'trong' thì dòng cảnh báo chưa từng
       được đo lần nào — cùng lý do câu trả lời AI giả mang sẵn hai cảnh báo. */
    tron: {
      duong: '/tmp/x/Bài thử rất dài để xem tên có tràn không (tron).wav',
      soKick: 0, nguonKick: 'nhip', hoiPhuc: 0.386,
      daTron: ['drums', 'bass', 'other', 'vocals'],
      lufs: -8.1, dinhThat: -1.0, giay: 6.2,
    },
    phanTich: {
      bpm: 139.8, bpmTinCay: 0.72,
      tong: 'Am', tongCamelot: '8A', tongTinCay: 0.18, tongNhi: 'C',
      ghep: [{ ma: '8B', vi: 'Trưởng/thứ song song' }, { ma: '9A', vi: 'Lên một quãng năm' },
             { ma: '7A', vi: 'Xuống một quãng năm' }, { ma: '10A', vi: 'Lên hai bậc' }],
      do: { lufs: -9.4, dinhMau: -0.2, dinhThat: 0.8, daiDong: 9.2, rongStereo: 0.31,
            dai: { 31.5: -28.1, 63: -14.2, 125: -12.8, 250: -15.4, 500: -18.1,
                   1000: -20.3, 2000: -22.7, 4000: -26.1, 8000: -31.5, 16000: -42.9 } },
    },
    dsCuocDangMo: [],
    /* Bảng ghi CÓ NỘI DUNG + lượt ĐANG CHẠY (03/10/2026): câu trả lời dài có
       từ không ngắt được, dòng tool, câu hỏi. `dangChay: true` để thanh "đang
       làm" + nút Dừng cùng được đo, và để dải kế hoạch dở không bật cảnh báo
       "agent đã dừng" (bộ đo coi mọi `.ct-notice` warn là thẻ lỗi). */
    /* Lệnh `/` (03/10/2026) — đủ dữ liệu để `CT_THU_LENH=1` chạy thử từng lệnh. */
    nguCanhChiTiet: { deBai: 900, lichSu: 41_000, ketQuaTool: 260_000, soAnh: 2, byteAnh: 2_400_000,
      tong: 301_900, soTin: 64, soLuot: 7, tongGui: 301_900, tomTat: null },
    compact: { ok: true, soTinDaGop: 40, soLuotDaGop: 5, kyTuTruoc: 301_900, kyTuSau: 62_000,
      xemTruoc: '- Mục tiêu: sửa bố cục AI Code\n- Ràng buộc: đừng đụng frontend/about' },
    chanDoan: [
      { ten: 'Phiên bản app', muc: 'ok', chiTiet: '0.5.150 · darwin-arm64' },
      { ten: 'Mạng', muc: 'ok', chiTiet: 'Có mạng.' },
      { ten: 'Máy chủ', muc: 'ok', chiTiet: 'Trả lời sau 84ms.' },
      { ten: 'AI ngoại tuyến', muc: 'canh', chiTiet: 'Chưa cài.' },
    ],
    datEpCucBo: (_c, bat) => ({ bat }),
    /* Bảng Hook (mở bằng /hooks) — mảng/số như cầu nối thật, không `undefined`. */
    hookDem: 0, hookNhatKy: [], kyNangDs: [], hookChoDuyet: [],
    luuFile: { ok: true },
    /* Không bao giờ xong ⇒ lượt gửi ở bước CHUAN_BI cứ "đang chạy". */
    send: () => new Promise(() => {}),
    /* Mảng, như cầu nối thật — `undefined` làm `guiDi` nổ ở `lenhDuAn.find`. */
    lenhDuAn: [],
    bangGhi: {
      dangChay: false,
      muc: [
        { kieu: 'nguoi', text: 'Bản local đang lỗi build, bạn xem giúp src/renderer/features/chat/AgentMode.tsx và sửa cho tôi nhé' },
        { kieu: 'tool', ten: 'read_file', tomTat: 'src/renderer/features/chat/AgentMode.tsx · 2.377 dòng' },
        { kieu: 'tool', ten: 'grep', tomTat: '"min-width" trong src/renderer/styles.css — 214 kết quả' },
        { kieu: 'may', text: 'Bản local lỗi vì JavaScript không tìm thấy module. Đường dẫn dài không ngắt được: /Users/admin/Downloads/api-backend/desktop/src/renderer/features/chat/AgentMode.tsx\n\n```ts\nconst rongWeb = typeof settings.aiKhungWebRong === "number" ? Math.max(RONG_WEB_MIN, settings.aiKhungWebRong) : 560; // một dòng mã rất dài để thử cuộn ngang\n```\n\n| Tệp | Dòng | Lỗi |\n|---|---|---|\n| AgentMode.tsx | 1205 | thiếu min-width:0 ở flex item chứa khung web bên phải |\n| styles.css | 3860 | overflow-x của bảng ghi |' },
      ],
    },
    /* Danh sách việc đã lưu, NHIỀU DỰ ÁN.
       Để rỗng thì thanh bên chỉ hiện "Chưa có việc nào được lưu" — tức là mọi
       chốt nhắm vào nó (nhóm theo dự án, màu nhóm, tiêu đề dính khi cuộn, nút
       đổi tên) chưa từng chạy một lần nào. Một bộ đo nhìn vào màn hình rỗng
       thì không đo gì cả. */
    dsPhien: [
      { id: 'p1', tieuDe: 'Tạo dự án React với CRA', duAn: 'ett1', luucLuc: 1757000000000, soTinNhan: 12 },
      { id: 'p2', tieuDe: 'Kiểm tra phiên bản Node', duAn: 'project-for-me', luucLuc: 1757000100000, soTinNhan: 4 },
      { id: 'p3', tieuDe: 'Tải tài liệu DBI202 từ trường', duAn: 'de-thi-cac-mon', luucLuc: 1757000200000, soTinNhan: 30 },
      { id: 'p4', tieuDe: 'Bạn kiểm tra file này giúp tôi', duAn: 'api-backend', luucLuc: 1757000300000, soTinNhan: 8 },
      { id: 'p5', tieuDe: 'bạn kiểm tra dự án này', duAn: 'mini-me-robot', luucLuc: 1757000400000, soTinNhan: 6 },
      { id: 'p6', tieuDe: 'Bạn có thể tạo cho tôi đề IELTS', duAn: 'ielts', luucLuc: 1757000500000, soTinNhan: 3 },
      { id: 'p7', tieuDe: 'Mở fuoverflow', duAn: null, luucLuc: 1757000600000, soTinNhan: 2 },
      { id: 'p8', tieuDe: 'Việc đã ghim', duAn: 'api-backend', luucLuc: 1757000700000, soTinNhan: 9, ghim: true },
    ],
    phien: [], dsWorktree: [],
    /* Bộ nhớ agent (26/09/2026): có dữ liệu để bảng Bộ nhớ vẽ ra thật. */
    boNhoDs: [
      { id: 'npm-peer-deps-eresolve', phamVi: 'du_an', loai: 'loi', tieuDe: 'npm install ERESOLVE → dùng --legacy-peer-deps', dauHieu: 'npm install :: npm err! code eresolve', viSao: 'react-day-picker@8 khai peer react<19, dự án dùng react 19.', apDung: 'npm install --legacy-peer-deps; đừng hạ react.', tao: '2026-09-26', sua: '2026-09-26', lanKhop: 3 },
      { id: 'test-dung-vitest-run', phamVi: 'du_an', loai: 'quy_uoc', tieuDe: 'Chạy test bằng npx vitest run (không watch)', viSao: 'npm test mở watch mode và treo.', apDung: 'npx vitest run <file>', tao: '2026-09-26', sua: '2026-09-26', lanKhop: 0 },
      { id: 'may-windows-powershell', phamVi: 'chung', loai: 'moi_truong', tieuDe: 'Máy Windows: lệnh chạy qua cmd.exe, dùng npm.cmd', viSao: 'PowerShell chặn script .ps1.', apDung: 'Gọi npm.cmd / npx.cmd.', tao: '2026-09-26', sua: '2026-09-26', lanKhop: 1 },
    ],
    mcpTrangThai: { soTool: 0, server: [], hanMuc: { daDung: 0, tran: 200 } },
    getStatus: { state: 'idle' },
    /* HÀM, không phải hằng — mỗi tab một id, đúng như `taoCuoc()` thật.
       Trả hằng `'cuoc-1'` thì sáu tab mang cùng một id, và mọi lỗi kiểu
       "trạng thái của tab này rò sang tab kia" trở nên VÔ HÌNH với harness.
       Đúng chuyện đã xảy ra 09/09/2026: vá xong lỗi 6 menu chồng nhau, chạy
       lại vẫn 6 menu — vì bản vá khoá theo `cuocId` mà mock cho chúng trùng. */
    taoCuoc: () => `cuoc-${++demCuoc}`,
    /* CÓ thư mục, không phải `null`.
       Nửa thanh công cụ của AI Code — bộ chọn chế độ quyền, nút bỏ thư mục,
       dải lệnh dự án — chỉ dựng khi `coThuMuc`. Để `null` thì mọi chốt nhắm
       vào chúng bỏ qua IM LẶNG mà harness vẫn báo xanh, đúng chuyện đã xảy ra
       09/09/2026: chốt cửa cảnh báo "Bỏ qua tất cả" viết xong, chạy xanh, mà
       chưa từng chạy một lần nào. */
    getWorkspace: { path: '/tmp/du-an-do-bo-cuc', name: 'du-an-do-bo-cuc' },
    /* AI ngoại tuyến (03/10/2026): máy có bản 30B ⇒ mất mạng là AI Code đổi giao diện. */
    cheDoCode: { ma: 'code', ten: 'Bản lập trình (30B)', nhan: 'chạy trên máy này', vi: '', nenTai: null, choPhepTuDong: true },
    kiemMang: () => ({ online: globalThis.__CT_ONLINE !== false }),
  };
  const nhomGia = new Proxy({}, {
    // Giá trị là HÀM ⇒ gọi nó (mỗi lần một kết quả). Ngược lại trả hằng.
    get: (_t, ten) => async (...tv) => {
      if (!(ten in RA)) return undefined;
      const v = RA[ten];
      return typeof v === 'function' ? v(...tv) : v;
    },
  });
  /* Terminal thật (26/09/2026): nhóm `pty` cần giá trị RIÊNG — các tên hàm
     của nó (`mo`, `ds`, `gui`) quá chung để nhét vào bảng phẳng ở trên, sẽ
     đè lên hàm cùng tên của nhóm khác. Màn hình mẫu có màu ANSI và một lời
     hỏi mật khẩu, để ảnh chụp cho thấy xterm vẽ thật chứ không phải ô trống. */
  let demPty = 0;
  const phienGia = (id, tieuDe, nguon) => ({
    id, cuocId: 'cuoc-1', cwd: '/tmp/du-an-do-bo-cuc', tieuDe, nguon, pty: true, dangChay: true, ma: null, batDau: Date.now(),
  });
  const ptyGia = {
    mayCo: async () => ({ co: true, loi: null }),
    ds: async () => [phienGia('t1', 'ssh deploy@vps', 'agent')],
    mo: async () => ({ ok: true, phien: phienGia(`t${++demPty + 1}`, 'Terminal', 'nguoiDung') }),
    gui: async () => true,
    coLai: async () => {},
    dong: async () => true,
    demTho: async (id) => id === 't1'
      ? '\x1b[32mcuong@mac\x1b[0m:\x1b[34m~/du-an\x1b[0m$ ssh deploy@160.1.2.3\r\n'
        + 'The authenticity of host can\'t be established.\r\n'
        + 'Are you sure you want to continue connecting (yes/no/[fingerprint])? yes\r\n'
        + '\x1b[33mWarning:\x1b[0m Permanently added to the list of known hosts.\r\n'
        + 'deploy@160.1.2.3\'s password: '
      : '\x1b[32mcuong@mac\x1b[0m:\x1b[34m~/du-an\x1b[0m$ ',
  };
  /* `on` GIỮ người nghe (03/10/2026) để bước CHUAN_BI của `/chat` bơm được
     sự kiện agent THẬT (kế hoạch, đầu ra lệnh, dòng tool, chữ dài) — bảng ghi
     trống là trạng thái ít phần tử nhất, dễ qua nhất, và đúng là chỗ người
     dùng chụp lỗi cắt chữ. */
  const nghe = new Map();
  const on = (kenh, f) => {
    if (!nghe.has(kenh)) nghe.set(kenh, new Set());
    nghe.get(kenh).add(f);
    return () => nghe.get(kenh)?.delete(f);
  };
  window.__phatAgent = (e) => {
    for (let i = 1; i <= demCuoc; i += 1) {
      for (const f of nghe.get('agent:event') ?? []) f({ ...e, cuocId: `cuoc-${i}` });
    }
  };
  window.cuongthai = new Proxy({ on }, {
    get: (t, nhom) => (nhom === 'on' ? t.on : nhom === 'pty' ? ptyGia : nhomGia),
  });
}, process.env.CT_NGON_NGU === 'en' ? 'en' : null);

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

/**
 * WAV 44,1 kHz stereo 1 giây, dựng bằng tay.
 *
 * Trang Xưởng Remix giải mã tệp bằng `decodeAudioData` của chính Chromium, nên
 * phải là âm thanh THẬT — một bộ đệm rỗng sẽ bị từ chối và trang đứng ở trạng
 * thái rỗng, đúng thứ ta đang cố thoát khỏi.
 */
function wavThu() {
  const fs = 44100, n = fs, soKenh = 2;
  const buf = Buffer.alloc(44 + n * soKenh * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * soKenh * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(soKenh, 22); buf.writeUInt32LE(fs, 24);
  buf.writeUInt32LE(fs * soKenh * 2, 28); buf.writeUInt16LE(soKenh * 2, 32);
  buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * soKenh * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.round(Math.sin((2 * Math.PI * 220 * i) / fs) * 12000);
    buf.writeInt16LE(v, 44 + i * 4);
    buf.writeInt16LE(v, 44 + i * 4 + 2);
  }
  return buf;
}

const CHUAN_BI = {
  /* Đưa Xưởng Remix tới trạng thái ĐÔNG: nạp một bài rồi mới đo.
     Trạng thái rỗng chỉ có vùng thả tệp — đo nó là đo một trang trắng. */
  '/xuong-remix': async (p) => {
    await p.setInputFiles('#xuong-remix-tep', {
      name: 'bai-thu.wav', mimeType: 'audio/wav', buffer: wavThu(),
    }).catch(() => {});
    await p.waitForTimeout(900);
    /* Nạp thêm BẢN MẪU rồi bấm Master: khối chấm bài là hai cột chữ cạnh nhau,
       chỉ tồn tại sau hai thao tác, và nó là phần dễ vỡ nhất của cả trang ở
       cửa sổ hẹp. Không lái tới đây thì bộ đo không bao giờ nhìn thấy nó. */
    await p.setInputFiles('#xuong-remix-tep-mau', {
      name: 'ban-mau.wav', mimeType: 'audio/wav', buffer: wavThu(),
    }).catch(() => {});
    await p.waitForTimeout(700);
    await p.click('button:has-text("Master")', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(500);
    await p.click('button:has-text("Mổ xẻ bài này")', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(500);
    /* Tách stem — mở ra danh sách 4 stem VÀ bàn trộn. Cả hai chỉ tồn tại sau
       bước này, nên trước 12/09/2026 chúng chưa từng được đo. */
    await p.click('button:has-text("Tách 4 stem")', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(600);
    /* Bàn trộn: bốn hàng × bốn thanh trượt. Không bấm "Trộn lại" thì khối kết
       quả (mang dòng cảnh báo dài nhất của phần này) không được dựng ra. */
    await p.click('button:has-text("Trộn lại")', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(500);
    /* Khâu 08: thanh nghe thử, ô tên bài, và khối "đã lên kho" chỉ tồn tại
       sau hai cú bấm này. Thanh <audio> của Chromium có bề rộng tối thiểu
       riêng, nên nó đúng là thứ dễ làm tràn cột hẹp nhất của cả trang. */
    await p.click('button:has-text("Nghe thử")', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(300);
    await p.click('button:has-text("Đẩy lên bàn DJ")', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(600);
    /* Khối chất lượng: tám nút cuộn ngang + một dòng "đã ghi" mang tên tệp
       dài. Không bấm Xuất thì dòng đó không tồn tại. */
    await p.click('button:has-text("Xuất tệp")', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(400);

    /* Dòng thời gian: thả ba mảnh của HAI bài rồi bấm Dựng. Không thả thì cả
       khối chỉ là một dòng chữ "bấm một đường ở trên" — làn, mảnh, thước, và
       bảng chi tiết đều không tồn tại, tức chưa từng đi qua bộ đo. */
    /* Chỉ số 0 và 1 là hai ĐƯỜNG của bài THỨ NHẤT (nó có 5 đường), chỉ số 5 là
       bài THỨ HAI. Bấm ba nút đầu thì cả ba mảnh cùng một bài ⇒ chỉ một làn,
       và làn thứ hai — thứ duy nhất chứng minh bố cục nhiều làn chịu được —
       chưa từng được dựng. Chốt tự kiểm bên dưới bắt đúng chuyện này. */
    for (const n of [0, 1, 5]) {
      await p.locator('.ct-xr-dtg-nut').nth(n).click({ timeout: 2000 })
        .catch(() => {});
      await p.waitForTimeout(120);
    }
    await p.locator('.ct-xr-dtg-manh').first().click({ timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(150);
    await p.click('button:has-text("Dựng bản")', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(500);

    /* ⚠️ TỰ KIỂM VIỆC CỦA CHÍNH BƯỚC NÀY.
       Mọi thao tác trên đều `.catch(() => {})`, nên một selector đổi tên là
       cả bước chuẩn bị im lặng không làm gì — và bộ đo vẫn báo XANH, trên một
       trang chỉ có vùng thả tệp. Đúng cái bẫy đã ghi ở đầu tệp này (09/09/2026:
       "chốt viết xong, chạy xanh, mà chưa từng chạy một lần nào").
       Ném lỗi ở đây thì nó thành đỏ ngay, kèm lý do. */
    const coBan = await p.locator('.ct-xr-transport').count();
    const soLan = await p.locator('.ct-xr-lan').count();
    /* ⚠️ ĐẾM THẺ CANVAS LÀ PHÉP KIỂM LUÔN XANH.
       `<canvas>` tồn tại trong DOM kể cả khi nó rộng 0 điểm ảnh, kể cả khi
       chưa vẽ gì — y hệt cái bẫy thẻ <audio> ngay dưới đây. Nếu CSS không cho
       nó bề rộng thì `Song.tsx` thoát sớm ở `if (rong === 0) return`, dải sóng
       trắng trơn, và bộ đo vẫn báo đủ 4 dải. Nên phải ĐỌC ĐIỂM ẢNH: đếm số
       điểm không trong suốt trên dải đầu tiên. */
    const soDiem = soLan
      ? await p.locator('.ct-xr-song-canvas').first().evaluate((o) => {
        const g = o.getContext('2d');
        if (!g || o.width === 0 || o.height === 0) return 0;
        const d = g.getImageData(0, 0, o.width, o.height).data;
        let n = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
        return n;
      }).catch(() => 0)
      : 0;
    if (soLan && soDiem < 500) {
      throw new Error(
        `dải sóng có thẻ canvas nhưng gần như KHÔNG vẽ gì (${soDiem} điểm ảnh). `
        + 'Hoặc CSS không cho canvas bề rộng, hoặc dữ liệu dạng sóng rỗng.',
      );
    }

    const soCl = await p.locator('.ct-xr-cl-nut').count();
    /* Bàn trộn giờ là bốn cột đứng + một cột tổng, mỗi cột ba núm xoay. Đếm
       núm chứ không đếm cột: cột rỗng vẫn là một cột, còn núm thì chỉ có khi
       `NumXoay` thật sự dựng ra. 4 đường × 3 núm = 12. */
    const soMau = await p.locator('.ct-xr-km-o').count();
    const coCanh = await p.locator('.ct-xr-km-o[data-canh]').count();
    const soManh = await p.locator('.ct-xr-dtg-manh').count();
    const soLanDtg = await p.locator('.ct-xr-dtg-lan').count();
    const coChiTiet = await p.locator('.ct-xr-dtg-chitiet').count();
    const soNum = await p.locator('.ct-xr-num-o').count();
    const soCot = await p.locator('.ct-xr-bt-cot').count();
    const coCham = await p.locator('.ct-xr-cham').count();
    const coLuoi = await p.locator('.ct-xr-luoi').count();
    const coAi = await p.locator('.ct-xr-tra-loi').count();
    const coTron = await p.locator('.ct-xr-tron-ra').count();
    const coStem = await p.locator('.ct-xr-stem-o').count();
    const coNghe = await p.locator('.ct-xr-nghe').count();
    /* Không chỉ đếm thẻ: đọc `duration` để chắc trình duyệt GIẢI MÃ được.
       Thẻ <audio> với nguồn hỏng vẫn tồn tại trong DOM và vẫn vẽ ra thanh
       điều khiển, nên đếm thẻ là phép kiểm gần như luôn xanh. */
    const dai = coNghe
      ? await p.locator('.ct-xr-nghe').first().evaluate((e) => e.duration).catch(() => 0)
      : 0;
    if (coNghe && !(dai > 1)) {
      throw new Error(
        `thẻ nghe thử có mặt nhưng KHÔNG giải mã được (duration=${dai}). `
        + 'Đường Uint8Array → File → blob: đã hỏng ở đâu đó.',
      );
    }
    if (!coCham || !coLuoi || !coAi || !coTron || coStem < 4 || !coNghe
        || !coBan || soLan < 4 || soCl < 8 || soNum < 12 || soCot < 5
        || soManh < 3 || soLanDtg < 2 || !coChiTiet || soMau < 2 || !coCanh) {
      throw new Error(
        `chuẩn bị /xuong-remix KHÔNG tới được trạng thái đông `
        + `(lưới số đo: ${coLuoi}, khối chấm bài: ${coCham}, câu trả lời AI: ${coAi}, `
        + `bản trộn: ${coTron}, ô stem: ${coStem}/4, thanh nghe: ${coNghe}, `
        + `transport: ${coBan}, dải track: ${soLan}/4, nút chất lượng: ${soCl}/8, `
        + `núm xoay: ${soNum}/12, cột bàn trộn: ${soCot}/5, `
        + `mảnh: ${soManh}/3, làn dòng thời gian: ${soLanDtg}/2, `
        + `bảng chi tiết mảnh: ${coChiTiet}, mẫu: ${soMau}/2, `
        + `mẫu cảnh báo: ${coCanh}). `
        + 'Selector hay luồng trang đã đổi — sửa bước CHUAN_BI trước khi tin kết quả.',
      );
    }

    /* Cuộn về ĐẦU sau khi chuẩn bị xong. Chuỗi thao tác trên kết thúc ở cuối
       trang, nên ảnh chụp `fullPage` chỉ ra phần đáy — mà `.ct-content` cuộn
       riêng nên `fullPage` không cứu được. Bàn làm việc nằm trên cùng, tức là
       thứ duy nhất KHÔNG bao giờ lọt vào ảnh, đúng lúc nó là thứ cần nhìn. */
    await p.evaluate((sel) => {
      if (sel) document.querySelector(sel)?.scrollIntoView({ block: 'start' });
      else document.querySelector('.ct-content')?.scrollTo(0, 0);
    }, process.env.CT_CUON ?? '');
    await p.waitForTimeout(200);
  },
  /* Mở bảng chọn hoạt động trên dải 24 giờ. Nó từng bị khối "Đi nhanh" vẽ đè
     (lỗi tầng xếp, 07/09/2026) — mà bộ đo chỉ nhìn trang lúc TĨNH thì không
     bao giờ thấy, vì bảng đó chỉ tồn tại sau một cú bấm. */
  /* Trang tin nhắn: mở một cuộc ra thì mới có bong bóng để đo. `CT_MENU=1`
     bật luôn menu tuỳ chọn của một tin — nó ẩn cho tới khi rê chuột, nên ảnh
     chụp trang lúc tĩnh KHÔNG BAO GIỜ thấy nó. */
  '/messages': async (p) => {
    await p.click('.ct-tn-cuoc', { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(500);
    if (process.env.CT_MENU) {
      const hang = p.locator('.ct-tn-tin').nth(2);
      await hang.hover({ timeout: 2000 }).catch(() => {});
      await hang.locator('.ct-tn-menu-nut').click({ timeout: 2000 }).catch(() => {});
      await p.waitForTimeout(300);
    }
  },
  '/dashboard': async (p) => {
    /* `CT_LICH=1` ⇒ đo BẢNG SOẠN LỊCH thay vì trang nền. Nó là một lớp phủ
       `position: fixed`, nên nó che trang — không đo chung một lượt được.
       Chạy riêng: CT_TRANG='["/dashboard"]' CT_LICH=1 npm run do:bo-cuc
       Prep này đi hết đường DÁN chứ không chỉ mở hộp: chỗ dễ vỡ bố cục nhất
       là bảng xem trước sau khi đọc, lúc nó đã có hàng chục dòng. */
    if (process.env.CT_LICH) {
      await p.click('.ct-lich-sua', { timeout: 3000 }).catch(() => {});
      await p.waitForTimeout(400);
      /* Neo bằng `data-ct`, KHÔNG bằng chữ trên nút. Nhãn đi qua `dich()` nên
         `:has-text("Dán từ FAP")` trượt sạch ở bản tiếng Anh — và vì nó nằm
         trong `.catch()`, nó trượt IM LẶNG rồi báo một lỗi chẳng liên quan ở
         bước sau. */
      await p.click('[data-ct="dan-fap"]', { timeout: 2000 }).catch(() => {});
      await p.fill('.ct-soan-dan textarea', [
        '\tMON 07/09\tTUE 08/09\tWED 09/09\tTHU 10/09\tFRI 11/09',
        'Slot 1\tSWT301-View Materials at DE-412 (7:30-9:50) Meet URL\t\tSWT301-View Materials at DE-412 (7:30-9:50)\t\t',
        'Slot 2\t\tFER202-View Materials at DE-324 (10:00-12:20)\t\tFER202-View Materials at DE-324 (10:00-12:20)\t',
        'Slot 3\tJPD123-View Materials at BE-101 (12:50-15:10)\t\t\t\tLAB211-View Materials at AL-R201 (12:50-15:10)',
        'Slot 4\tSWR302-View Materials at DE-208 (Not yet)\t\t\t\t',
      ].join('\n')).catch(() => {});
      await p.click('.ct-soan-dan button', { timeout: 2000 }).catch(() => {});
      await p.waitForTimeout(400);
      return;
    }

    /* `CT_NHANH=1` ⇒ đo ô NHẬP NHANH (nơi kết quả quét ảnh đổ vào). Cố ý trộn
       dòng ĐÚNG với dòng SAI: bản xem trước phải hiện cả hai, và cái dễ vỡ bố
       cục nhất là hàng câu lỗi nằm cạnh hàng bình thường.
       Chạy riêng: CT_TRANG='["/dashboard"]' CT_NHANH=1 npm run do:bo-cuc */
    if (process.env.CT_NHANH) {
      await p.click('.ct-lich-sua', { timeout: 3000 }).catch(() => {});
      await p.waitForTimeout(400);
      await p.click('[data-ct="nhap-nhanh"]', { timeout: 2000 }).catch(() => {});
      await p.fill('.ct-soan-dan textarea', [
        '# kỳ thu 2026',
        '2 | 2 | SWR302 | BE-210',
        '3 | 1 | SWT301 | DE-412',
        '5 | 9 | MAD101',
        'lung tung',
        '6 | 3 | JPD123 | DE-C304',
      ].join('\n')).catch(() => {});
      await p.waitForTimeout(300);
      return;
    }
    if (process.env.CT_DASH_TOP === '1') {
      await p.locator('.ct-workspace').waitFor();
      const details = p.locator('.ct-workspace-add-plan');
      if (await details.getAttribute('open') !== null) throw new Error('Form kế hoạch phải thu gọn mặc định');
      await details.locator('summary').click();
      if (await details.getAttribute('open') === null) throw new Error('Không mở được form kế hoạch');
      await details.locator('summary').click();
      await p.evaluate(() => { document.querySelector('.ct-content')?.scrollTo(0, 0); });
      return;
    }
    await p.click('.ct-tq-dong button', { timeout: 2000 }).catch(() => {});
    await p.waitForTimeout(350);
    /* Dải 24 giờ phải LUÔN có đúng 24 cột, không cột nào rộng 0.
       07/09/2026: ô buổi học đặt vào cùng hàng 1 với vị trí cột xác định nên
       được lưới xếp TRƯỚC; 24 ô giờ tự xếp sau nhảy qua chỗ đã bị chiếm rồi
       tràn ra CỘT ẨN — lưới thành 30 cột, 6 ô giờ cuối rộng 0px và hai nhãn
       "18"/"21" chồng lên nhau ở mép phải. Nhìn ảnh chụp thì nó chỉ là hai
       chữ số dính nhau, dễ bỏ qua; đo thì lộ ngay. Tôi đã đoán sai nguyên
       nhân hai lần trước khi chịu đo. */
    const luoi = await p.evaluate(() => {
      const d = document.querySelector('.ct-tq-dong');
      if (!d) return null;
      const cot = getComputedStyle(d).gridTemplateColumns.split(' ').filter(Boolean);
      const rong = [...d.querySelectorAll('.ct-tq-gio')]
        .map((e) => Math.round(e.getBoundingClientRect().width));
      return { soCot: cot.length, soNut: rong.length, deo: rong.filter((w) => w === 0).length };
    });
    if (luoi && (luoi.soCot !== 24 || luoi.deo > 0)) {
      throw new Error(
        `Dải 24 giờ vỡ lưới: ${luoi.soCot} cột (phải 24), ${luoi.deo}/${luoi.soNut} ô giờ rộng 0px. `
        + 'Ô giờ phải có `gridColumn` TƯỜNG MINH — xem chú thích ở DashboardPage.tsx.',
      );
    }
  },
  /* MỌI trang dùng lại mã web đều phải chờ nội dung, không chỉ hai màn động.
     Chúng nạp chậm bằng `import()` RỒI mới gọi API, nên mốc 1200ms bắt trúng
     chữ "Đang mở …" tuỳ máy và tuỳ bề rộng — đo được: `/interview` xanh ở
     1440/1180/1000px nhưng đỏ ở 860px, cùng một lần chạy. */
  ...Object.fromEntries([
    '/interview', '/interview/history', '/interview/drill',
    '/interview/session/1', '/interview/report/1',
    '/cv', '/cv/profile', '/cv/import', '/cv/intake', '/cv/target', '/cv/xem',
    '/language', '/language/ja', '/roadmap',
    /* Gói của Xưởng mô phỏng hơn 1MB — mốc chờ CỨNG 1200ms bắt trúng chữ
       "Đang mở…" khi máy bận hoặc khi gói lớn thêm. Nó vốn xanh và đỏ lên
       vì lý do chẳng liên quan gì tới bố cục. */
    '/simulation', '/algorithms', '/notes',
    '/maker-lab', '/creator', '/projects', '/exp-hub',
    '/finance', '/forum', '/saved', '/profile',
    '/projects/search', '/finance/debts/calendar',
  ].map((d) => [d, choNoiDung])),
  /* Nút "Xem toàn màn hình" chỉ tồn tại khi CÓ bài đang phát, nên bộ đo nhìn
     trang lúc tĩnh không bao giờ chạm tới nó. Bấm một bài rồi bấm nút, và
     kiểm xem lớp phủ có thật sự hiện ra không. */
  '/music': async (p) => {
    await p.click('.ct-trk-art', { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(700);

    /* Màn "Đang phát toàn cảnh" PHẢI là một lớp phủ `fixed` nằm trong khung
       nhìn. 07/09/2026 nó im lặng hỏng: `.ct-music > *:not(.ct-canh)
       { position: relative }` (thêm sau, nên đè) biến nó thành khối trong
       luồng, tụt 1231px xuống dưới màn hình. Lớp phủ VẪN dựng ra, vẫn
       `visible`, vẫn `opacity: 1` — chỉ là không ai nhìn thấy. Nút trông
       như chết mà không có lỗi nào để lần.
       Nút chỉ tồn tại khi CÓ bài đang phát, nên phải bấm một bài trước. */
    const nut = await p.$('.ct-np-mo');
    if (nut) {
      await nut.click().catch(() => {});
      await p.waitForTimeout(500);
      const tmh = await p.evaluate(() => {
        const e = document.querySelector('.ct-nowfull');
        if (!e) return { co: false };
        const r = e.getBoundingClientRect();
        return { co: true, position: getComputedStyle(e).position, top: Math.round(r.top) };
      });
      if (!tmh.co || tmh.position !== 'fixed' || tmh.top > innerHeightGia) {
        throw new Error(
          `Màn "Xem toàn màn hình" không phủ được: ${JSON.stringify(tmh)}. `
          + 'Kiểm quy tắc `.ct-music > *` có đè `position: fixed` không.',
        );
      }
      await p.keyboard.press('Escape').catch(() => {});
      await p.click('.ct-nowfull-back', { timeout: 1500 }).catch(() => {});
      await p.waitForTimeout(300);
    }

    /* Máy chủ giả không có tiếng thật nên cú bấm phát ở trên luôn đẻ ra thẻ
       "Không phát được…". Đó là hệ quả của PHÉP ĐO, không phải lỗi của trang —
       để nguyên thì chốt "trang không được hiện thẻ lỗi" đỏ mãi, và một phép
       kiểm đỏ triền miên là phép kiểm không ai đọc nữa. Dọn nó đi. */
    await p.click('.ct-notice[data-tone="err"] button', { timeout: 1500 }).catch(() => {});
    await p.waitForTimeout(250);
  },
  /* Đi HẾT đường tới màn bài học: mở kỳ → mở môn → mở bài. Chỉ ở đó
     `CourseTutor` (mã web) mới được gắn, và nó là thứ kéo theo `usePro()` →
     `useQuery`. Thiếu `QueryClientProvider` thì cả trang chết, mà nhìn trang
     Học viện lúc TĨNH thì không thấy gì. */
  '/academy': async (p) => {
    await p.waitForTimeout(500);
    await p.click('.ct-hv-ky-dau', { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(300);
    await p.click('.ct-hv-the', { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(500);
    await p.click('.ct-hv-bai', { timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(600);
  },
  '/chat': async (p) => {
    // Bật chế độ Lập trình rồi mở thêm tab: đây đúng là thao tác người dùng
    // làm khi họ báo lỗi ("tôi ấn tạo task mới thì nó lại bị").
    /* Chọn theo THUỘC TÍNH, không theo chữ: `:has-text("Lập trình")` trượt ngay
       khi giao diện sang tiếng Anh, và trượt im lặng vì có `.catch`. */
    await p.click('.ct-segment-nut[data-che-do="code"]').catch(() => {});
    await p.waitForTimeout(400);
    for (let i = 0; i < 5; i += 1) {
      await p.click('.ct-tab-them', { timeout: 1500 }).catch(() => {});
      await p.waitForTimeout(120);
    }


    /* Cửa cảnh báo của chế độ "Bỏ qua tất cả" PHẢI hiện ra và PHẢI nằm trong
       khung nhìn. Nó là thứ duy nhất đứng giữa model và `rm -rf` — một lớp phủ
       dựng ra nhưng tụt khỏi màn hình ở đây nghĩa là người dùng bấm một mục
       menu rồi thấy KHÔNG GÌ XẢY RA, và tệ hơn: nếu có ngày ai đổi thứ tự
       thành "đổi chế độ trước, hỏi sau" thì chế độ đã bật mà cảnh báo vô hình.
       Ảnh chụp trang lúc TĨNH không thấy được — cửa này chỉ tồn tại sau HAI cú
       bấm. Xem [[feedback_quy_tac_css_chan_dau_cho_moi_con]]. */
    /* ─── Cửa cảnh báo của chế độ "Bỏ qua tất cả" ───
       Nó là thứ duy nhất đứng giữa model và `rm -rf`, và nó chỉ tồn tại sau
       HAI cú bấm — ảnh chụp trang lúc tĩnh không thấy được.

       BẮT BUỘC, không `if (tìm thấy thì kiểm)`. Bản đầu viết `if (nutQuyen)`,
       tôi làm cửa cảnh báo VÔ HÌNH rồi chạy lại, và harness vẫn xanh: nút
       không có (mock để `getWorkspace.path = null`) nên chốt tự tắt. Một chốt
       tự tắt khi không tìm thấy thứ nó gác thì không gác gì cả.
       Xem [[feedback_phep_kiem_dat_vi_ly_do_sai]]. */
    /* `:visible` — với 6 tab thì có 6 nút trong DOM, và `p.$()` trả về cái ĐẦU
       TIÊN, tức nút của một tab đang bị ẩn. Bấm nó thì không có menu nào mở ra
       và chốt đỏ với lý do sai hoàn toàn. */
    const nutQuyen = p.locator('[data-nut="chedoquyen"]:visible').first();
    if (await nutQuyen.count() === 0) {
      throw new Error('Không thấy nút chọn chế độ quyền ([data-nut="chedoquyen"]) đang HIỆN ở /chat.');
    }
    await nutQuyen.click({ timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(250);
    /* ĐÚNG MỘT menu. Với 6 tab mở, khoá `useMoRieng` dùng chung từng cho ra
       SÁU menu chồng nhau, và cú bấm rơi vào menu của tab khác — tab đó đổi
       quyền còn tab đang xem thì không. Chốt này canh đúng chuyện đó. */
    const soMenu = await p.evaluate(() => document.querySelectorAll('.ct-chedo-menu').length);
    if (soMenu !== 1) {
      throw new Error(`Mở bộ chọn chế độ quyền ra ${soMenu} menu (phải đúng 1). `
        + 'Khoá `useMoRieng` có kèm `cuocId` không?');
    }

    /* Bấm bằng DOM chứ không `p.click`: `p.click` cuộn phần tử vào tầm nhìn
       trước, mà menu này đóng theo BẤT KỲ sự kiện `scroll` nào (listener
       capture trên window) — nên nó tự đóng rồi Playwright chờ một phần tử đã
       biến mất. Đó là hệ quả của cách ĐO, không phải lỗi của trang. Nên kiểm
       "bấm tới được" bằng `elementFromPoint` riêng, rồi mới kích hoạt. */
    const bam = await p.evaluate(() => {
      const muc = document.querySelector('.ct-chedo-muc[data-bac="4"]');
      if (!muc) return { loi: `menu mở nhưng không có mục bậc 4 (có ${document.querySelectorAll('.ct-chedo-muc').length} mục)` };
      const r = muc.getBoundingClientRect();
      if (r.width < 40 || r.top < 0 || r.bottom > window.innerHeight) {
        return { loi: `mục "Bỏ qua tất cả" nằm ngoài khung nhìn: ${JSON.stringify({ t: Math.round(r.top), b: Math.round(r.bottom), vh: window.innerHeight })}` };
      }
      // Điểm giữa mục phải THUỘC VỀ chính mục đó — không bị thẻ khác phủ lên.
      const tren = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      if (!muc.contains(tren)) return { loi: `có thứ khác che mục: ${tren?.tagName}.${tren?.className}` };
      muc.click();
      return { loi: null };
    });
    if (bam.loi) throw new Error(`Chế độ "Bỏ qua tất cả": ${bam.loi}`);
    await p.waitForTimeout(300);

    const cb = await p.evaluate(() => {
      const e = document.querySelector('.ct-chedo-canhbao');
      if (!e) return { co: false };
      const r = e.getBoundingClientRect();
      const nut = e.querySelector('.ct-btn-nguy');
      return {
        co: true,
        rong: Math.round(r.width),
        tren: Math.round(r.top),
        duoi: Math.round(r.bottom),
        hien: getComputedStyle(e).visibility,
        coNutDongY: !!nut,
        // Nút đồng ý phải THẤY được, không chỉ tồn tại: thẻ có `overflow-y`
        // nên nội dung dài đẩy nó ra ngoài là chuyện có thật.
        nutTrongThe: nut ? nut.getBoundingClientRect().bottom <= r.bottom + 1 : false,
      };
    });
    if (!cb.co || cb.hien !== 'visible' || cb.rong < 200
        || cb.tren < 0 || cb.duoi > innerHeightGia || !cb.coNutDongY || !cb.nutTrongThe) {
      throw new Error(
        `Cửa cảnh báo "Bỏ qua tất cả" không dùng được: ${JSON.stringify(cb)}. `
        + 'Đây là chốt duy nhất trước khi agent được chạy lệnh nguy hiểm.',
      );
    }
    // Huỷ — KHÔNG để chế độ đó bật trong ảnh chụp của các bước sau.
    await p.keyboard.press('Escape').catch(() => {});
    await p.waitForTimeout(200);

    /* ─── Nhóm dự án gập/mở ở thanh bên (26/09/2026) ───
       BẮT BUỘC như cửa cảnh báo ở trên: gập/mở chỉ lộ ra sau cú bấm, ảnh tĩnh
       không thấy được nó có chạy hay không. Kiểm bốn điều: mặc định gập · bấm
       chuột mở · phím Enter/Space đảo · gõ tìm tự mở rồi xoá tìm thì gập lại.
       `inert` phải đi cùng `aria-expanded`: nhóm gập mà thân không `inert` thì
       phím Tab vẫn chui vào những nút không nhìn thấy. */
    const nhomTB = async (ten) => p.evaluate((t) => {
      const nut = [...document.querySelectorAll('.ct-tb-nhom-nut')]
        .find((n) => n.querySelector('.ct-tb-nhom-ten')?.textContent === t);
      const than = nut && document.getElementById(nut.getAttribute('aria-controls') ?? '');
      return nut ? { mo: nut.getAttribute('aria-expanded'), inert: than?.inert ?? null } : null;
    }, ten);
    const nutTB = (ten) => p.locator('.ct-tb-nhom-nut').filter({
      has: p.locator('.ct-tb-nhom-ten', { hasText: new RegExp(`^${ten}$`) }),
    }).first();
    const kiemTB = async (buoc, ten, mong) => {
      const s = await nhomTB(ten);
      if (!s || s.mo !== String(mong) || s.inert !== !mong) {
        throw new Error(`Thanh bên — ${buoc}: nhóm "${ten}" mong ${mong ? 'MỞ' : 'GẬP'}, thấy ${JSON.stringify(s)}`);
      }
    };
    /* Cột hẹp ⇒ thanh bên là LỚP PHỦ (03/10/2026): mở nó bằng dải bên trái
       trước khi kiểm, rồi cất đi (Esc) để phần đo phía sau thấy khung AI. */
    const daiHep = p.locator('.ct-tb-mo[data-chi-hep]');
    const laHep = (await daiHep.count()) > 0 && await daiHep.first().isVisible();
    if (laHep) { await daiHep.first().click(); await p.waitForTimeout(250); }
    if (process.env.CT_THANH_BEN !== 'an') {
    await kiemTB('mặc định', 'ett1', false);
    await nutTB('ett1').click({ timeout: 2000 });
    await p.waitForTimeout(300);
    await kiemTB('bấm chuột', 'ett1', true);
    await nutTB('ett1').focus();
    await p.keyboard.press('Enter');
    await p.waitForTimeout(150);
    await kiemTB('phím Enter', 'ett1', false);
    await p.keyboard.press('Space');
    await p.waitForTimeout(150);
    await kiemTB('phím Space', 'ett1', true);
    await p.fill('.ct-tb-tim input', 'IELTS');
    await p.waitForTimeout(200);
    await kiemTB('đang tìm', 'ielts', true);
    await p.fill('.ct-tb-tim input', '');
    await p.waitForTimeout(350);
    await kiemTB('xoá tìm', 'ielts', false);
    await kiemTB('xoá tìm (giữ lựa chọn đã nhớ)', 'ett1', true);
    }
    if (laHep) {
      await p.keyboard.press('Escape');
      await p.waitForTimeout(200);
      const conMo = await p.evaluate(() => document.querySelector('.ct-tb[data-phu-mo="true"]') !== null);
      if (conMo) throw new Error('Lớp phủ thanh bên không cất đi khi bấm Esc.');
    }

    /* ─── TERMINAL THẬT (26/09/2026) ───
       Mở khung Terminal rồi ĐÒI thấy xterm vẽ ra CHỮ — không chỉ một khung
       rỗng. PTY giả (`ptyGia`) trả sẵn một màn hình có lời hỏi mật khẩu. Để
       khung MỞ khi đo, nên phép đo tràn ngang ở dưới cũng soi luôn nó. */
    // CHỈ tab đang hiện: sáu tab đều dựng, năm cái ẩn bằng CSS.
    const tabHien = p.locator('.ct-tab-noi[data-hien="true"]');
    await tabHien.locator('.ct-agent-bar button', { hasText: 'Terminal' }).first().click();
    await tabHien.locator('.ct-tt .xterm-screen').first().waitFor({ timeout: 5000 });
    await p.waitForTimeout(400);
    const chuTerm = await p.evaluate(() => document.querySelector('.ct-tab-noi[data-hien="true"] .ct-tt .ct-tt-o[data-hien="true"] .xterm-rows')?.textContent ?? '');
    if (!/password/.test(chuTerm)) {
      throw new Error(`Khung Terminal mở nhưng xterm KHÔNG vẽ nội dung phiên (đọc được: "${chuTerm.slice(0, 80)}").`);
    }

    /* ─── BỘ NHỚ (26/09/2026): mở bảng, ĐÒI thấy đủ bài học mẫu. ─── */
    /* Cột hẹp ⇒ nút Bộ nhớ nằm trong menu "⋯" (03/10/2026). Đi đúng đường
       người dùng đi: thấy nút thì bấm nút, không thì mở "⋯" rồi chọn mục. */
    const nutBoNho = tabHien.locator('.ct-agent-bar button', { hasText: 'Bộ nhớ' }).first();
    if (await nutBoNho.isVisible()) await nutBoNho.click();
    else {
      await tabHien.locator('[data-nut="them"]').first().click({ timeout: 3000 });
      await tabHien.locator('.ct-agent-them-bang [data-muc="bonho"]').first().click({ timeout: 3000 });
    }
    await p.waitForTimeout(300);
    const soBai = await tabHien.locator('.ct-bn-ds > li').count();
    if (soBai !== 3) throw new Error(`Bảng Bộ nhớ không vẽ đủ bài học mẫu (thấy ${soBai}/3).`);
    await tabHien.locator('.ct-bn-dau').first().click();
    await p.waitForTimeout(200);
    if (!(await tabHien.locator('.ct-bn-than').count())) throw new Error('Bấm một bài học mà không mở ra phần thân.');
    await p.keyboard.press('Escape').catch(() => {});
    /*
     * `CT_THU_LENH=1` (03/10/2026) — CHẠY THẬT từng lệnh `/` trên giao diện:
     * gõ vào ô soạn, Enter, rồi đòi thấy đúng thứ lệnh đó phải làm (câu trả
     * lời, tấm vừa mở). Bộ đo bố cục chỉ hỏi "có tràn không"; đây hỏi "lệnh
     * có làm gì không" — một lệnh chỉ hiện chữ là lệnh không tồn tại.
     */
    if (process.env.CT_THU_LENH === '1') {
      const o = tabHien.locator('textarea.ct-agent-o').first();
      const traLoi = async () => (await tabHien.locator('.ct-lenh-traloi').first().textContent().catch(() => '')) ?? '';
      /* Dấu cách cuối = đã gõ xong tên lệnh ⇒ bảng gợi ý không mở (nó mà mở thì
         Enter là CHỌN gợi ý chứ không chạy lệnh — đúng thiết kế). */
      const go = async (lenh) => {
        await o.fill(`${lenh} `);
        await o.press('Enter');
        await p.waitForTimeout(350);
      };
      const ket = [];
      const doi = async (ten, ok) => { ket.push(`${ok ? '✓' : '✗'} ${ten}`); if (!ok) throw new Error(`Lệnh ${ten} không làm đúng việc.`); };
      await go('/help'); await doi('/help', /\/compact[\s\S]*\/doctor/.test(await traLoi()));
      await go('/context'); await doi('/context', /Kết quả tool \+ tham số/.test(await traLoi()));
      await go('/usage'); await doi('/usage', /Key gia hạn/.test(await traLoi()) && (await tabHien.locator('.ct-lenh-traloi .ct-duphong').count()) > 0);
      await go('/status'); await doi('/status', /Cổng: cổng chính/.test(await traLoi()));
      await go('/doctor'); await doi('/doctor', /Chẩn đoán/.test(await traLoi()));
      await go('/compact giữ tên file'); await doi('/compact', /Đã gộp/.test(await traLoi()) && (await tabHien.locator('.ct-notice[data-tone="info"]', { hasText: '/compact' }).count()) > 0);
      await go('/effort rất cao'); await doi('/effort', /Rất cao/.test(await traLoi()));
      await go('/model gpt sol'); await doi('/model <tên>', /GPT 6 Sol/.test(await traLoi()));
      await go('/rewind'); await doi('/rewind', /Quay về câu hỏi nào/.test(await traLoi()));
      await go('/resume'); await doi('/resume', /Việc đã lưu/.test(await traLoi()));
      await go('/export'); await doi('/export', /Đã xuất/.test(await traLoi()));
      await go('/offline'); await doi('/offline', /giờ chạy bằng/.test(await traLoi()) && (await tabHien.locator('.ct-chip-cucbo').count()) > 0);
      await go('/offline'); await doi('/offline (tắt)', /quay về AI máy chủ/.test(await traLoi()));
      await go('/cost'); await doi('/cost', /Chi phí việc này/.test(await traLoi()));
      await go('/memory'); await doi('/memory', (await tabHien.locator('.ct-bn-bang').count()) > 0);
      await p.keyboard.press('Escape');
      await go('/mcp'); await doi('/mcp', (await tabHien.locator('.ct-mcp-bang').count()) > 0);
      await p.keyboard.press('Escape');
      await go('/hooks'); await doi('/hooks', (await tabHien.locator('.ct-mcp-bang').count()) > 0);
      await p.keyboard.press('Escape');
      await go('/model'); await doi('/model', (await tabHien.locator('.ct-chonmm-bang').count()) > 0);
      await p.keyboard.press('Escape');
      await go('/plan thêm nút xuất PDF'); await doi('/plan', /\/plan thêm nút xuất PDF/.test((await tabHien.locator('.ct-agent-nguoi').last().textContent()) ?? ''));
      console.log(`      lệnh /: ${ket.join(' · ')}`);
      return;
    }
    await p.keyboard.press('Escape').catch(() => {});
    /* GỬI một câu để lượt ĐANG CHẠY (cầu nối giả `send` không bao giờ xong):
       thanh "đang làm", nút Dừng, hàng chờ cùng được đo. Làm SAU các chốt ở
       trên vì lúc đang chạy bộ chọn chế độ quyền bị khoá — đúng thiết kế. */
    await tabHien.locator('textarea.ct-agent-o').first().fill('Sửa giúp tôi bố cục thanh công cụ khi cửa sổ hẹp');
    await tabHien.locator('[data-nut="gui"]').first().click({ timeout: 3000 });
    await p.waitForTimeout(200);
    if (process.env.CT_GO_LOI) console.log('DEBUG', await p.evaluate(() => ({ nguoi: document.querySelectorAll('.ct-tab-noi[data-hien="true"] .ct-agent-nguoi').length, dung: document.querySelectorAll('.ct-tab-noi[data-hien="true"] .ct-agent-dung').length, o: document.querySelector('.ct-tab-noi[data-hien="true"] textarea.ct-agent-o')?.value })));
    /* Bơm một lượt agent ĐÔNG (03/10/2026): dải kế hoạch có bước đang làm,
       dòng tool có chi tiết, khối đầu ra lệnh có dòng rất dài, hạn mức + vòng
       ngữ cảnh. Đây là đúng những khối người dùng chụp bị cắt mép phải. */
    await p.evaluate(() => {
      const phat = window.__phatAgent;
      if (!phat) return;
      phat({ loai: 'batDau', model: 'sonnet-5', buoc: 7, tranBuoc: 30 });
      phat({ loai: 'keHoach', viec: [
        { ten: 'Đọc cấu trúc thanh công cụ AI Code', trangThai: 'xong' },
        { ten: 'Tìm flex item thiếu min-width:0 trong styles.css', trangThai: 'xong' },
        { ten: 'Sửa bố cục co giãn theo @container cho thanh công cụ và ô nhập', trangThai: 'dang' },
        { ten: 'Chạy npm run do:bo-cuc ở 4 bề rộng', trangThai: 'cho' },
        { ten: 'Chụp ảnh trước/sau', trangThai: 'cho' },
      ] });
      phat({ loai: 'toolBatDau', id: 't1', ten: 'run_command', vong: 'may' });
      phat({ loai: 'tool', id: 't1', ten: 'run_command', vong: 'may', tomTat: 'npm run typecheck — 2 lỗi',
        chiTiet: 'src/renderer/features/chat/AgentMode.tsx(1205,7): error TS2322: Type string is not assignable to type number.' });
      phat({ loai: 'lenhRa', mau: '$ npm run build\n> cuongthai-desktop@0.5.150 build\nvite v5 building for production...\n' + 'x'.repeat(30) + '/Users/admin/Downloads/api-backend/desktop/node_modules/.vite/deps/chunk-ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.js (một dòng log rất dài không có chỗ ngắt để thử tràn ngang)\n✓ 2377 modules transformed.\n' });
      phat({ loai: 'toolBatDau', id: 't2', ten: 'edit_file', vong: 'may' });
      phat({ loai: 'xong', tienUsd: 0.042, soFileDaSua: 2, daLuoc: 0,
        hanMuc: { daDung: 2_400_000, tran: 6_000_000, phanTram: 40, hoiLucNao: '2026-10-03T12:00:00Z' },
        nguCanh: { kyTu: 412_000, tran: 600_000, phanTram: 69, soLuotDaBo: 2 } });
    });
    await p.waitForTimeout(300);
    /* `CT_CHE_DO=chat` ⇒ sau khi đo đủ AI Code, chuyển sang Trò chuyện để đo +
       chụp chế độ đó ở cùng bề rộng (03/10/2026 — đề giao sửa CẢ Chat). */
    if (process.env.CT_CHE_DO === 'chat') {
      await p.click('.ct-segment-nut[data-che-do="chat"]');
      await p.waitForTimeout(500);
    }
  },
  '/notes': async (p) => {
    const demHang = () => p.evaluate(() =>
      [...document.querySelectorAll('.notes-theme-root .group')]
        .filter((e) => e.querySelector('button') && e.offsetHeight > 20).length);

    const truoc = await demHang();
    if (truoc < 4) throw new Error(`Cây Sổ tay chỉ có ${truoc} hàng — mock \`/notes/tree\` hỏng?`);

    /* Gập cột Sổ tay RỒI MỞ LẠI.
       ⚠️ Bản cũ chỉ bấm MỘT lần dù chú thích ghi "rồi mở lại" — nên cột nằm
       gập suốt phần còn lại của phép đo, và mọi chốt nhắm vào cây bên trong
       nó đo một thứ không có trên màn hình. Đo thật: 21 hàng trước khi bấm,
       0 hàng sau. */
    const nut = p.locator('button[aria-label*="cột Sổ tay"]').first();
    if (await nut.count()) {
      await nut.click({ force: true }).catch(() => {});
      await p.waitForTimeout(300);
      const khiGap = await demHang();
      if (khiGap >= truoc) throw new Error(`Bấm gập cột Sổ tay mà cây vẫn còn ${khiGap} hàng.`);
      await nut.click({ force: true }).catch(() => {});
      await p.waitForTimeout(300);
      const khiMo = await demHang();
      if (khiMo < 4) throw new Error(`Mở lại cột Sổ tay mà chỉ còn ${khiMo} hàng.`);
    }

    /* ─── ĐỔI TÊN PHẢI MỞ Ô NGAY KHI BẤM BÚT CHÌ ───
       Đây là cái nút đã CHẾT CÂM trên bản desktop suốt thời gian dài: nó gọi
       `window.prompt`, mà Electron thì NÉM `prompt() is not supported` — bấm
       vào không có gì xảy ra, không lỗi nào hiện ra.

       Chốt này bấm THẬT rồi đòi thấy ô nhập. Đo được vì bộ đo chạy đúng bản
       renderer của desktop; `tsc` và grep không nói được nút có mở ô hay không. */
    const hangDau = p.locator('.notes-theme-root .group').first();
    await hangDau.hover().catch(() => {});
    await p.waitForTimeout(200);
    /* Từ 26/09/2026 (cây Sổ tay "gọn") KHÔNG còn nút bút chì trên hàng: đổi tên
       bằng NHẤP ĐÚP vào tên, hoặc menu "Tuỳ chọn cho …" → "Đổi tên". Chốt cũ đi
       tìm nút bút chì nên đỏ suốt từ đó — đỏ vì bộ kiểm lỗi thời, không phải vì
       app (đo 04/10/2026). Nay kiểm CẢ HAI lối, lối nào cũng phải mở ô nhập
       ngay và focus vào nó. */
    const kiemOSua = async (loi) => {
      await p.waitForTimeout(250);
      const oSua = await p.evaluate(() => {
        const o = document.querySelector('.notes-theme-root input[aria-label="Đổi tên"]');
        if (!o) return { co: false };
        return { co: true, focus: document.activeElement === o };
      });
      if (!oSua.co) {
        throw new Error(`${loi} mà KHÔNG mở ô nhập — \`window.prompt\` quay lại? `
          + '(Electron ném `prompt() is not supported`, nên nút chết câm.)');
      }
      if (!oSua.focus) throw new Error(`${loi}: ô đổi tên mở ra nhưng KHÔNG được focus — gõ ngay là mất chữ.`);
      await p.keyboard.press('Escape').catch(() => {});
      await p.waitForTimeout(150);
    };
    /* Hàng ĐẦU có thể là "Hộp thư" — cố ý không đổi tên được — nên lấy hàng đầu
       tiên CÓ tên nhấp-đúp-để-đổi-tên. */
    const hangDoiTen = p.locator('.notes-theme-root .group')
      .filter({ has: p.locator('button[title*="nhấp đúp để đổi tên"]') }).first();
    if (await hangDoiTen.count() === 0) throw new Error('Cây Sổ tay không có hàng nào đổi tên được.');
    const nhan = hangDoiTen.locator('button[title*="nhấp đúp để đổi tên"]').first();
    await nhan.dblclick({ force: true }).catch(() => {});
    await kiemOSua('Nhấp đúp vào tên');
    await hangDoiTen.hover().catch(() => {});
    const nutMenu = hangDoiTen.locator('button[aria-label^="Tuỳ chọn cho"]').first();
    if (await nutMenu.count() === 0) throw new Error('Hàng đầu cây Sổ tay không có nút "Tuỳ chọn cho …".');
    await nutMenu.click({ force: true }).catch(() => {});
    await p.waitForTimeout(250);
    const mucDoiTen = p.getByRole('menuitem', { name: 'Đổi tên' }).first();
    const mucDoiTen2 = p.locator('button', { hasText: 'Đổi tên' }).first();
    if (await mucDoiTen.count()) await mucDoiTen.click({ force: true });
    else if (await mucDoiTen2.count()) await mucDoiTen2.click({ force: true });
    else throw new Error('Menu "Tuỳ chọn" của hàng không có mục "Đổi tên".');
    await kiemOSua('Menu → Đổi tên');

    /* ─── TẠO MỚI ⇒ MỞ Ô ĐẶT TÊN · XOÁ ⇒ ĂN NGAY LẦN BẤM ĐẦU ───
       Hai lỗi người dùng báo 10/09/2026, đo trong MỘT mạch để mục vừa tạo
       cũng chính là mục bị xoá — cây gốc giữ nguyên cho các chốt phía sau.

       • "tạo 1 tài liệu mới, tôi ấn vào đổi tên không được": nguyên nhân là
         THỨ TỰ — `refreshTree()` dựng hàng mới TRƯỚC khi cờ `vuaTao` được đặt,
         mà `Row` đọc cờ bằng `useState` (chỉ đọc lần đầu, im lặng bỏ qua mọi
         lần đổi sau).
       • "xoá phải spam 2 lần": đo được MỘT cú bấm ⇒ MỘT `confirm` ⇒ MỘT lời
         gọi DELETE, nên đường bấm đúng; chốt này canh phần còn lại — hàng có
         thật sự biến khỏi cây sau đúng một lần bấm không. */
    {
      /* Từ đợt thiết kế lại 26/09: tạo đi qua nút "Mới ▾" → menu, mở một ô ĐẶT
         TÊN trước (không còn hàng "Môn học mới" mặc định) — Enter mới tạo thật,
         Esc huỷ mà không để lại rác. */
      const demHangTruoc = await demHang();
      const nutMoi = p.locator('.notes-theme-root button[aria-haspopup="menu"]', { hasText: 'Mới' }).first();
      if (await nutMoi.count() === 0) throw new Error('Không thấy nút "Mới ▾" của Sổ tay.');
      const chonMuc = async (nhan) => {
        await nutMoi.click({ force: true });
        await p.waitForTimeout(300);
        const muc = p.locator(`[role="menuitem"]:has-text("${nhan}"), button:has-text("${nhan}")`).first();
        if (await muc.count() === 0) throw new Error(`Menu "Mới" không có mục "${nhan}".`);
        await muc.click({ force: true });
      };
      const oTen = async (goiY, cho) => {
        await p.waitForTimeout(cho);
        return p.evaluate((g) => {
          const o = document.querySelector(`.notes-theme-root input[placeholder="${g}"]`);
          return o ? { co: true, focus: document.activeElement === o, ai: document.activeElement?.className?.slice(0, 60) ?? '' } : { co: false };
        }, goiY);
      };

      await chonMuc('Môn mới');
      let o = await oTen('Tên môn mới…', 500);
      if (!o.co) throw new Error('Chọn "Môn mới" mà KHÔNG mở ô đặt tên.');
      if (!o.focus) throw new Error('Ô đặt tên môn mở ra nhưng KHÔNG được focus — gõ ngay là mất chữ.');
      await p.keyboard.press('Escape');
      await p.waitForTimeout(300);
      if ((await oTen('Tên môn mới…', 0)).co) throw new Error('Esc không đóng ô đặt tên môn.');
      if ((await demHang()) !== demHangTruoc) throw new Error('Huỷ đặt tên mà cây vẫn đổi số hàng — tạo rác?');

      const tenMon = `Đo bố cục ${Date.now().toString(36)}`;
      await chonMuc('Môn mới');
      await oTen('Tên môn mới…', 400);
      await p.keyboard.type(tenMon);
      await p.keyboard.press('Enter');
      await p.waitForTimeout(1300);
      const hangMoi = p.locator('.notes-theme-root .group', { hasText: tenMon }).first();
      if (await hangMoi.count() === 0) throw new Error(`Gõ tên + Enter mà cây không có môn "${tenMon}".`);
      if ((await demHang()) <= demHangTruoc) throw new Error('Tạo môn mới mà cây không dài ra.');

      /* ─── TẠO TRANG: chờ ĐỦ LÂU rồi mới hỏi tiêu điểm ───
         Khung soạn thảo TipTap tự chiếm focus ở khung hình sau; hỏi ngay thì
         xanh oan. Đi qua menu của chính môn vừa tạo — "Mới ▾ → Trang mới" phụ
         thuộc ngữ cảnh đang chọn nên không chắc trúng môn này. */
      await hangMoi.hover().catch(() => {});
      await hangMoi.locator('button[aria-label^="Tuỳ chọn cho"]').first().click({ force: true });
      await p.waitForTimeout(300);
      await p.locator('[role="menuitem"]:has-text("Tạo trang trong môn"), button:has-text("Tạo trang trong môn")').first().click({ force: true });
      o = await oTen('Tên trang mới…', 1400);
      if (!o.co) throw new Error('"Tạo trang trong môn" mà không mở ô đặt tên.');
      if (!o.focus) {
        throw new Error(`Ô đặt tên trang mới MẤT tiêu điểm (đang ở: ${o.ai}) — gõ tên là mất chữ.`);
      }
      await p.keyboard.press('Escape');
      await p.waitForTimeout(300);

      /* Xoá đúng môn vừa tạo: MỘT cú bấm ⇒ MỘT confirm ⇒ MỘT DELETE ⇒ hàng biến
         mất ("xoá phải spam 2 lần"). `confirm` bị thay để đo không cần người. */
      const truocKhiXoa = await demHang();
      const soDelete = [];
      const demXoa = (r) => { if (r.method() === 'DELETE') soDelete.push(r.url()); };
      p.on('request', demXoa);
      await p.evaluate(() => {
        globalThis.__demConfirm = 0;
        window.confirm = () => { globalThis.__demConfirm += 1; return true; };
      });
      await hangMoi.hover().catch(() => {});
      await p.waitForTimeout(200);
      await hangMoi.locator('button[aria-label^="Tuỳ chọn cho"]').first().click({ force: true });
      await p.waitForTimeout(300);
      const mucXoa = p.locator('[role="menuitem"]:has-text("Xoá môn"), button:has-text("Xoá môn")').first();
      if (await mucXoa.count() === 0) throw new Error('Menu của môn không có mục "Xoá môn".');
      await mucXoa.click({ force: true });
      await p.waitForTimeout(1000);
      p.off('request', demXoa);

      const demC = await p.evaluate(() => globalThis.__demConfirm);
      const sauKhiXoa = await demHang();
      if (demC !== 1) throw new Error(`Một cú bấm Xoá mà \`confirm\` hiện ${demC} lần.`);
      if (soDelete.length !== 1) throw new Error(`Một cú bấm Xoá mà gửi ${soDelete.length} lời gọi DELETE.`);
      if (sauKhiXoa >= truocKhiXoa) {
        throw new Error(
          `Xoá MỘT lần mà cây vẫn còn ${sauKhiXoa} hàng (trước khi bấm: ${truocKhiXoa}) — `
          + 'hàng không biến mất sau một cú bấm, đúng thứ người dùng phải "spam 2 lần".',
        );
      }
    }

    /* ─── CHỦ ĐỀ TỐI CỦA NOTES ───
       Notes có bộ chuyển chủ đề RIÊNG (Trắng/Tối/Nâu), mặc định Trắng — khác
       chủ đề của app. Nên mọi phép đo trước giờ chỉ nhìn bản SÁNG, và một lỗi
       chỉ-ở-tối là vô hình.

       Đúng chuyện đã xảy ra: hàng trong cây có `hover:bg-slate-100
       dark:bg-white/[0.04]` — bản tối THIẾU tiền tố `hover:`, nên mọi hàng
       mang nền xám THƯỜNG TRỰC và cả danh sách thành một bức tường ô hộp.
       Sáng thì đúng, tối thì sai, và không ai thấy vì bộ đo đứng ở bản sáng. */
    await p.locator('.notes-theme-root button:has-text("Tối")').first()
      .click({ timeout: 3000 }).catch(() => {});
    await p.waitForTimeout(350);

    const nen = await p.evaluate(() => {
      const hang = [...document.querySelectorAll('.notes-theme-root .group')]
        .filter((e) => e.querySelector('button') && e.offsetHeight > 20);
      // KHÔNG rê chuột: đo đúng trạng thái NGHỈ. Hàng nghỉ mà đã có nền thì rê
      // vào cũng chẳng có gì đổi — và đó là cái làm mất sạch phản hồi.
      const mau = hang.slice(0, 8).map((e) => getComputedStyle(e).backgroundColor);
      return {
        soHang: hang.length,
        mau,
        soCoNen: mau.filter((m) => m !== 'rgba(0, 0, 0, 0)' && m !== 'transparent').length,
      };
    });
    if (nen.soHang < 4) throw new Error(`Sau khi đổi chủ đề, cây Sổ tay còn ${nen.soHang} hàng.`);
    /* Cho phép ĐÚNG MỘT hàng có nền (hàng đang chọn). Nhiều hơn nghĩa là nền
       thường trực đã quay lại. */
    if (nen.soCoNen > 1) {
      throw new Error(
        `${nen.soCoNen}/8 hàng Sổ tay có nền khi KHÔNG rê chuột — thiếu tiền tố `
        + `\`hover:\` ở biến thể dark? ${JSON.stringify(nen.mau)}`,
      );
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
      /* CV Builder (22/08/2026) — cây web thứ sáu, 9 màn. Đo 6 màn không cần
         id; `/cv/builder/:id` cần một bản CV có thật nên để phép kiểm đơn vị lo. */
      '/cv', '/cv/profile', '/cv/import', '/cv/intake', '/cv/target', '/cv/xem',
      /* Hai màn ĐỘNG. Chúng là hai màn NẶNG NHẤT của cây (762 và 360 dòng) và
         là chỗ người dùng ngồi lâu nhất, nên bỏ qua vì "cần phiên thật" là bỏ
         đúng phần đáng đo. Máy chủ giả ở trên trả phiên 6 câu + báo cáo đầy đủ,
         nên chúng vẽ ra trạng thái ĐÔNG chứ không phải màn rỗng. */
      '/interview/session/1', '/interview/report/1',
      /* Mười cây cuối (22/08/2026). Đo GỐC của từng cây, cộng bốn đường TĨNH
         từng đụng ĐỘNG — nếu bảng tra xếp sai thứ tự thì chúng mở ra trang
         chi tiết rỗng chứ không phải trang danh sách, và chỉ nhìn mới biết. */
      /* Xưởng Remix — trang dày đặc nút và một lưới 4 ô số đo, đúng loại dễ vỡ
         nhất ở cột hẹp 860px. Bộ đo chỉ thấy trạng thái RỖNG (chưa nạp bài);
         phần bảng số đo và dải phổ phải kiểm bằng tay với một bài thật. */
      '/xuong-remix',
      '/maker-lab', '/creator', '/projects', '/exp-hub',
      '/finance', '/forum', '/saved', '/profile',
      '/projects/search', '/finance/debts/calendar'];

let hong = 0;
const bang = [];

for (const duong of DUONG) {
  const loi = [];
  for (const rong of BE_RONG) {
    const p = await ctx.newPage();
    const loiTrang = [];
    p.on('pageerror', (e) => process.env.CT_GO_LOI && console.log('PAGEERR', e.message, (e.stack ?? '').split('\n').slice(0,4).join(' / ')));
    p.on('pageerror', (e) => loiTrang.push(`${e.message} @ ${(e.stack ?? '').split('\n')[1]?.trim() ?? '?'}`.slice(0, 200)));
    p.on('console', (m) => { if (m.type() === 'error') loiTrang.push(m.text().slice(0, 200)); });
    await p.setViewportSize({ width: rong, height: 900 });
    await p.goto(`http://127.0.0.1:${cong}/bo-cuc/trang-thu.html?trang=${encodeURIComponent(duong)}`);
    await p.waitForTimeout(1200);
    /* Bước chuẩn bị hỏng thì GHI ĐỎ rồi vẫn chụp + đo (03/10/2026). Bản cũ để
       lỗi bay thẳng ra ngoài: cả lượt đo chết, không còn ảnh nào để nhìn xem
       trang hỏng thế nào — đúng lúc cần ảnh nhất. Vẫn ĐỎ, không nuốt. */
    if (CHUAN_BI[duong]) {
      try { await CHUAN_BI[duong](p); } catch (e) {
        loi.push(`${rong}px: bước CHUẨN BỊ hỏng — ${String(e?.message ?? e).split('\n')[0].slice(0, 200)}`);
      }
      await p.waitForTimeout(400);
    }

    /* `CT_CHUP=<thư mục>` ⇒ chụp lại từng trang ở từng bề rộng. Bộ đo này chỉ
       trả lời "có tràn không"; nó KHÔNG trả lời được "trông có ổn không" — mà
       đó lại là câu hỏi hay được hỏi nhất khi vừa dựng lại một trang. */
    /* Bản TIẾNG ANH: thanh bên không được còn chữ có dấu.
       Đây là phép kiểm trên CHỮ ĐÃ DỰNG, mạnh hơn kiểm từ điển: nó bắt cả
       trường hợp có bản dịch nhưng quên bọc `t()` — chuỗi ấy hiện tiếng Việt
       giữa giao diện tiếng Anh mà không lỗi nào nổi lên, vì `t()` cố ý trả về
       câu gốc để không bao giờ có ô trống. */
    if (process.env.CT_NGON_NGU === 'en') {
      const sot = await p.evaluate(() => {
        const CO_DAU = /[\u00C0-\u1EF9]/;
        return [...document.querySelectorAll('.ct-nav-label, .ct-nav-group > *:first-child')]
          .map((e) => e.textContent.trim())
          .filter((c) => CO_DAU.test(c));
      });
      if (sot.length) {
        /* ⚠️ Phải đẩy vào `loi`, KHÔNG phải `loiTrang`. `loiTrang` chỉ được
           IN RA kèm theo khi đã có lỗi tràn (dòng ~1080) — tự nó không làm
           trang đỏ. Bản đầu của chốt này đẩy vào `loiTrang` và nó im lặng cho
           qua: gỡ hẳn một mục từ điển ra, bộ đo vẫn báo XANH. */
        loi.push(`${rong}px: bản tiếng Anh còn chữ Việt trong thanh bên — ${sot.join(' · ')}`);
      }
    }
    if (process.env.CT_CHUP) {
      /* `CT_THEME=dark` để xem đúng thứ người dùng thấy. App mặc định nền TỐI,
         còn trang thử thì không — chụp bản sáng rồi kết luận "trông ổn" là kiểm
         một giao diện gần như không ai nhìn thấy. */
      if (process.env.CT_THEME) {
        await p.evaluate((t) => document.documentElement.setAttribute('data-ct-theme', t), process.env.CT_THEME);
        await p.waitForTimeout(250);
      }
      const ten = `${duong.replace(/\//g, '_') || '_goc'}@${rong}.png`;
      /* `CT_CHUP_O='<bộ chọn>'` ⇒ chụp ĐÚNG một khối thay vì cả trang.
         Vì sao cần: `fullPage` trên trang này chụp cả cây vỏ, và `.ct-content`
         cuộn riêng nên khối cần xem thường nằm ngoài khung — tệ hơn, prep của
         vài trang lại cuộn đi chỗ khác sau đó. `locator.screenshot()` tự cuộn
         tới phần tử nên nó không phụ thuộc vào prep đã cuộn tới đâu. */
      if (process.env.CT_CHUP_O) {
        const o = p.locator(process.env.CT_CHUP_O).first();
        if (await o.count() > 0) {
          await o.screenshot({ path: `${process.env.CT_CHUP}/${ten}` }).catch(() => {});
        } else {
          // Im lặng bỏ qua là đúng cái bẫy "bộ kiểm trượt mà báo xanh".
          console.log(`         \x1b[33m!\x1b[0m CT_CHUP_O không khớp phần tử nào ở ${rong}px: ${process.env.CT_CHUP_O}`);
        }
      } else {
        await p.screenshot({ path: `${process.env.CT_CHUP}/${ten}`, fullPage: true }).catch(() => {});
      }
    }

    const kq = await p.evaluate(() => {
      const noi = document.querySelector('.ct-content');
      if (!noi) return { loi: 'không thấy .ct-content' };
      const khung = noi.getBoundingClientRect();
      /* Thẻ lỗi trong luồng. Lớp thật là `.ct-notice` với `data-tone` err/warn
         — KHÔNG phải `.ct-loi` như tôi đoán lúc đầu; đoán tên lớp rồi viết chốt
         quanh nó là cách tạo ra một chốt không bao giờ bắt được gì. */
      const oLoi = [...noi.querySelectorAll('.ct-notice[data-tone="err"], .ct-notice[data-tone="warn"]')]
        .find((e) => e.getBoundingClientRect().height > 0);
      const theLoi = oLoi ? (oLoi.textContent ?? '').trim() : null;

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

      /* Lớp phủ `position: fixed` phủ CẢ CỬA SỔ, kể cả chỗ thanh bên đang
         đứng — nên nó cố tình nằm ngoài khung nội dung, và so nó với khung ấy
         là báo nhầm. Đo ngày 07/09/2026: bảng soạn lịch vừa khít, ảnh chụp
         sạch, mà bộ đo vẫn kêu 2 nút "lọt ra ngoài khung" ở 860px chỉ vì
         chúng đứng bên TRÁI mép khung. Thứ nằm trong lớp phủ phải so với
         VIEWPORT. Xem [[feedback_verify_the_checker_before_the_content]]. */
      const trongLopPhu = (e) => {
        for (let n = e; n && n !== document.documentElement; n = n.parentElement) {
          if (getComputedStyle(n).position === 'fixed') return true;
        }
        return false;
      };
      const manHinh = { left: 0, right: document.documentElement.clientWidth };

      const loBenPhai = [];
      for (const e of noi.querySelectorAll('button, a, input, select, textarea, [role="tab"]')) {
        const r = e.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (trongVungCuon(e)) continue;
        const k = trongLopPhu(e) ? manHinh : khung;
        if (r.right > k.right + 1 || r.left < k.left - 1) {
          loBenPhai.push(`${e.className || e.tagName}: "${(e.textContent ?? '').trim().slice(0, 24)}"`);
        }
      }

      /*
       * CẮT TRONG KHUNG LỒNG (03/10/2026) — chỉ cho trang AI (`.ct-ai-term`).
       *
       * Hai chốt trên KHÔNG thấy được ba lỗi người dùng chụp ở AI Code:
       *   • nút bị cắt bởi một tổ tiên `overflow: hidden` NẰM TRONG khung (cột
       *     `.ct-ai-than`) — nút vẫn trong mép `.ct-content` nên chốt 2 im;
       *   • chữ trong bảng ghi bị đẩy lệch trái (mất ký tự đầu) — bảng ghi cuộn
       *     dọc nên `overflowX` tính ra `auto` và `trongVungCuon` bỏ qua TẤT CẢ;
       *   • thanh bên kéo hẹp cắt chữ mép TRÁI — chốt 2 chỉ so mép phải.
       * Nên ở đây: mọi điều khiển + mọi khối chữ của AI phải nằm TRỌN trong
       * tổ tiên gần nhất có cắt (hidden/clip/auto), trừ vùng CỐ Ý cuộn ngang
       * (`[data-cuon-ngang]`, thanh tab, khối mã/bảng/đầu ra lệnh).
       */
      const catLong = [];
      if (document.querySelector('.ct-ai-term')) {
        const CO_Y_CUON = '[data-cuon-ngang], .ct-tabs, .ct-tt-tabs, pre, table, .ct-ma, .ct-diff, .ct-bang-cuon, .xterm';
        const sel = '.ct-ai-than button, .ct-ai-than input, .ct-ai-than textarea, '
          + '.ct-agent-may, .ct-agent-nguoi, .ct-agent-tool, .ct-lenh-ra, .ct-kehoach, .ct-tb-nhom h3, .ct-tb-tongquan, .ct-dang-lam';
        for (const e of noi.querySelectorAll(sel)) {
          const r = e.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (e.closest(CO_Y_CUON) && e.closest(CO_Y_CUON) !== e) continue;
          if (trongLopPhu(e)) continue;
          for (let n = e.parentElement; n && n !== noi; n = n.parentElement) {
            const cs = getComputedStyle(n);
            if (cs.overflowX === 'visible') continue;
            if (n.matches(CO_Y_CUON)) break;
            const k = n.getBoundingClientRect();
            /* Viền trái/phải + thanh cuộn dọc không tính là "trong". */
            const trai = k.left + n.clientLeft - 1;
            const phai = k.left + n.clientLeft + n.clientWidth + 1;
            if (r.left < trai || r.right > phai) {
              catLong.push(`${(e.className || e.tagName).toString().split(' ')[0]} "${(e.textContent ?? '').trim().slice(0, 20)}" cắt bởi ${(n.className || n.tagName).toString().split(' ')[0]}`);
            }
            break;
          }
        }
        /* Bảng ghi / thanh bên bị đẩy lệch ngang (scrollLeft ≠ 0) = chữ mất đầu. */
        for (const n of noi.querySelectorAll('.ct-agent-scroll, .ct-tb-ds, .ct-agent, .ct-ai-than')) {
          if (n.getBoundingClientRect().width === 0) continue;
          if (n.scrollLeft > 0) catLong.push(`${n.className.split(' ')[0]} bị cuộn ngang lệch ${n.scrollLeft}px`);
          if (n.scrollWidth > n.clientWidth + 1) catLong.push(`${n.className.split(' ')[0]} rộng hơn khung ${n.scrollWidth - n.clientWidth}px`);
        }
      }

      return {
        catLong: [...new Set(catLong)].slice(0, 5),
        soCatLong: catLong.length,
        tranTrang: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        tranNoi: noi.scrollWidth - noi.clientWidth,
        loBenPhai: [...new Set(loBenPhai)].slice(0, 4),
        soLo: loBenPhai.length,
        /* Đếm để BIẾT trang có vẽ ra gì không. Một trang trắng thì không có gì
           lọt ra ngoài khung, và phép kiểm sẽ XANH vì lý do hoàn toàn sai —
           đúng cái bẫy [[feedback_phep_kiem_dat_vi_ly_do_sai]]. */
        soDieuKhien: noi.querySelectorAll('button, a, input, select, textarea, [role="tab"]').length,
        soChu: (noi.textContent ?? '').trim().length,
        chuDau: (noi.textContent ?? '').trim().slice(0, 120),
        theLoi,
      };
    });

    await p.close();

    if (kq.loi) {
      loi.push(`${rong}px: ${kq.loi}${loiTrang.length ? ` — lỗi: ${loiTrang[0]}` : ''}`);
      continue;
    }
    /* ⚠️⚠️ CHỐT CHỐNG XANH-GIẢ, LỚP HAI — thêm 24/08/2026.
     *
     * `TrangWeb.tsx` nay có RANH GIỚI LỖI: trang nổ thì nó vẽ ra khối "Trang
     * gặp lỗi" kèm thông điệp. Đó là cải thiện cho NGƯỜI DÙNG (trước là màn
     * hình trắng câm) nhưng nó LÀM MÙ BỘ ĐO NÀY: khối đó có đủ chữ để qua chốt
     * "gần như TRỐNG" bên dưới.
     *
     * Đo thật: bộ đo báo 45/45 XANH trong khi `/repos`, `/games`, `/creator`,
     * `/saved` đều đang hiện "Trang gặp lỗi". Suýt phát hành như thế.
     *
     * Bài học: thêm một ranh giới lỗi là thêm một cách để bộ kiểm nói dối.
     * Chốt này phải đi CÙNG ranh giới đó, không phải sau. */
    /* ⚠️ CHỐT CHỐNG XANH-GIẢ, LỚP BA — thêm 05/09/2026.
     *
     * Trang tự bắt lỗi và vẽ một THẺ LỖI trong luồng (`.ct-loi`) thì nó KHÔNG
     * rơi vào ranh giới lỗi, KHÔNG trống, và bộ đo cho qua. Đo thật: `/feed`
     * báo ✓ trong khi màn hình chỉ có đúng dòng "ds.map is not a function".
     * Cùng bài học với hai lớp dưới: mỗi lần thêm một cách hiển thị lỗi là
     * thêm một cách để bộ kiểm nói dối. */
    if (kq.theLoi) {
      loi.push(`${rong}px: trang hiện THẺ LỖI — ${kq.theLoi.slice(0, 110)}`);
      continue;
    }
    if (/^Trang gặp lỗi|^Không tìm thấy/.test(kq.chuDau)) {
      loi.push(`${rong}px: RANH GIỚI LỖI bắt được — trang không dựng nổi: ${kq.chuDau.slice(0, 90)}`);
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
    if (kq.soCatLong > 0) loi.push(`${rong}px: ${kq.soCatLong} phần tử AI bị cắt trong khung lồng — ${kq.catLong.join(' · ')}`);
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
