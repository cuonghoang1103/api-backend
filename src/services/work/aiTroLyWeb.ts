/**
 * CT Work — trợ lý web "làm được mọi việc như trên web" (28/10/2026). MỘT chỗ cho hai luật dùng chung:
 *
 * 1. VIỆC TRÊN MÁY NGƯỜI DÙNG (chạy JUnit/Playwright/SQL, sửa code, git commit/pull/push, đọc tệp không có trên máy chủ):
 *    trợ lý web KHÔNG làm được — code nằm trên máy người dùng. Câu trả lời chuẩn (`cauMayCucBo`) + lời dặn trong system
 *    prompt (`khoiMayCucBo`) + bộ nhận diện (`laViecMayCucBo`) để nhắc model dùng đúng câu đó. Câu đổi theo VỎ đang chạy:
 *    trình duyệt ⇒ "mở app desktop CuongThai (AI Code) hoặc CuongMini CLI"; app CuongThai ⇒ "mở AI Code ngay trong app";
 *    app CT Work riêng (không có AI Code) ⇒ như trình duyệt.
 *
 * 2. KHÔNG BỊA KẾT QUẢ CHẠY TEST: trợ lý soạn test case / UTCID từ yêu cầu, code đọc được, dữ liệu người dùng đưa — nhưng
 *    không bao giờ tự điền Passed/Failed, actual result, ngày chạy, người chạy cho test chưa ai chạy. Lời gọi lệnh mà GHI
 *    kết quả chạy (`ghiKetQuaChay`) chỉ áp dụng được khi người bấm XÁC NHẬN "tôi đã chạy các test này" (server chặn,
 *    `WORK_AI_CONFIRM_RAN`) — thẻ đề xuất hiện ô xác nhận đó.
 *
 * File THUẦN (không DB, không LLM). Test: aiTroLyWeb.test.ts.
 */

/** Trợ lý đang được hỏi từ đâu. iOS/ứng dụng cũ không gửi ⇒ 'web'. */
export type VoTroLy = 'web' | 'desktop' | 'ctwork-desktop';

export function voTroLy(v: unknown): VoTroLy {
  return v === 'desktop' || v === 'ctwork-desktop' ? v : 'web';
}

/** Nơi làm việc trên máy, theo vỏ — dùng trong câu chuẩn. */
function noiLam(vo: VoTroLy, lang: 'vi' | 'en'): string {
  if (vo === 'desktop') return lang === 'vi' ? 'mở **AI Code** ngay trong app này (thanh bên trái)' : 'open **AI Code** right in this app (left sidebar)';
  return lang === 'vi'
    ? 'mở **app desktop CuongThai (mục AI Code)** hoặc **CuongMini CLI**'
    : 'open the **CuongThai desktop app (AI Code)** or the **CuongMini CLI**';
}

/**
 * CÂU CHUẨN khi việc cần máy của người dùng. Một chỗ duy nhất — system prompt và test cùng đọc từ đây.
 * Ví dụ (web): "Phần này mình không làm được trên web vì code nằm trên máy bạn — bạn mở **app desktop CuongThai (mục AI
 * Code)** hoặc **CuongMini CLI** rồi kết nối CT Work (`/ctwork`) nhé."
 */
export function cauMayCucBo(vo: VoTroLy = 'web', lang: 'vi' | 'en' = 'vi'): string {
  return lang === 'vi'
    ? `Phần này mình không làm được trên web vì code nằm trên máy bạn — bạn ${noiLam(vo, 'vi')} rồi kết nối CT Work (\`/ctwork\`) nhé.`
    : `I can't do this part from the web because the code is on your computer — ${noiLam(vo, 'en')} and connect CT Work (\`/ctwork\`).`;
}

/** Lời dặn cho system prompt: khi nào dùng câu chuẩn, và gợi ý ĐÚNG lệnh cần gõ ở AI Code / CLI. */
export function khoiMayCucBo(vo: VoTroLy, projectRef: string): string {
  return `LOCAL-MACHINE TASKS — you run on the CT Work SERVER and cannot touch the user's computer: running tests (JUnit, Playwright, Jest, pytest, SQL scripts), building or running the app, editing local code, git commit/pull/push/merge on their machine, or reading files that are not in CT Work. For such a request (or the part of a request that needs it):
- Say it with this exact sentence (Vietnamese question): "${cauMayCucBo(vo, 'vi')}" — English question: "${cauMayCucBo(vo, 'en')}"
- Then give exactly what to type there, in a fenced block: first \`/ctwork\` (connects CT Work), then ONE ready-to-paste request naming the project ${projectRef} and the concrete item (test class/function, Report 5.1 function, sheet, issue key, branch), e.g. "Chạy JUnit cho UserServiceTest, rồi ghi kết quả P/F vào Report 5.1 hàm UserService.register của dự án ${projectRef}".
- Still do everything that CAN be done here (read the issue/test sheet, draft cases, propose CT Work changes).`;
}

/**
 * Câu hỏi có vẻ là việc trên máy người dùng không (để nhắc model dùng câu chuẩn). Chỉ là GỢI Ý cho model — không chặn gì,
 * nên thà bắt dư một chút: model vẫn tự quyết phần nào làm được trên web.
 */
export function laViecMayCucBo(text: string): boolean {
  const s = text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase();
  return [
    /\b(junit|playwright|jest|pytest|mocha|vitest|cypress|selenium|maven|gradle|mvn|npm (run|test|install)|npx|dotnet test)\b/,
    /\bgit (commit|push|pull|merge|rebase|checkout|clone|stash|add)\b/,
    /\b(commit|push|pull) (code|len|ve|giup|cho)\b/,
    /\b(chay|run) (thu |lai )?(test|unit test|testcase|test case|script|sql|code|app|project|du an|lenh)\b/,
    /\b(sua|fix|edit|refactor) (code|file|ham|class)\b.*\b(may|local|o may|tren may)\b/,
    /\b(tren may (toi|minh|em)|o may (toi|minh|em)|tren may tinh|local machine|my (laptop|machine|computer))\b/,
    /\b(doc|mo|read|open) (file|tep|thu muc|folder) .*(tren may|o may|local|my computer)\b/,
  ].some((r) => r.test(s));
}

// ─── Không bịa kết quả chạy test ─────────────────────────────────

/** Lời dặn cho system prompt (một khối, mọi câu hỏi có thể ghi dữ liệu). */
export const KHOI_KET_QUA_THAT = `TEST RESULTS ARE EVIDENCE — never invent them. You may design and fill test cases, UTCID rows/marks, procedures, test data and expected results from the requirements, the code you can read (code_read), CT Work data or what the user gives. But execution results — Passed/Failed (P/F), actual result, executed date, "Executed By", round status, evidence, defect ids from a run — may ONLY come from the user (in this conversation or an attached file) or from existing CT Work records. If the user asks you to "fill the results" and gave none: say plainly that you cannot invent results nobody ran, then offer the honest options — (1) draft the cases now with the result columns EMPTY, (2) run them with AI Code / CuongMini CLI (see LOCAL-MACHINE TASKS) which records the real results. A proposal that records results is shown with a "I really ran these tests" check the user must tick.`;

const co = (v: unknown) => v !== undefined && v !== null && v !== '';
const mang = (v: unknown): Array<Record<string, unknown>> => (Array.isArray(v) ? v.filter((x): x is Record<string, unknown> => !!x && typeof x === 'object') : []);

/**
 * Lời gọi lệnh này có GHI KẾT QUẢ CHẠY test không (P/F, actual, ngày chạy, người chạy, trạng thái vòng/lượt chạy). Xoá kết
 * quả (null) hay chỉ đổi loại/ghi chú thì không. Danh sách lệnh nằm ở đây, test khoá danh sách.
 */
export function ghiKetQuaChay(command: string, args: Record<string, unknown>): boolean {
  switch (command) {
    case 'fpt_unit_record_results':
      return mang(args.results).some((r) => co(r.result) || co(r.executedAt) || co(r.defectId));
    case 'fpt_unit_add_cases':
      return mang(args.cases).some((c) => co(c.result) || co(c.executedAt));
    case 'fpt_unit_update_function':
      return co(args.executedBy);
    case 'fpt_it_record_round':
      return mang(args.results).some((r) => (co(r.status) && r.status !== 'Pending') || co(r.actual) || co(r.tester));
    case 'fpt_it_update_cases':
      return mang(args.cases).some((c) => co(c.actual) || co(c.evidence));
    case 'test_run_record':
      return (co(args.status) && !['TODO', 'IN_PROGRESS'].includes(String(args.status)))
        || mang(args.steps).some((s) => (co(s.status) && s.status !== 'TODO') || co(s.actual));
    default:
      return false;
  }
}

export const LENH_GHI_KET_QUA = ['fpt_unit_record_results', 'fpt_unit_add_cases', 'fpt_unit_update_function', 'fpt_it_record_round', 'fpt_it_update_cases', 'test_run_record'] as const;

export const CAU_CAN_XAC_NHAN_DA_CHAY = 'Đề xuất này ghi KẾT QUẢ CHẠY test (Passed/Failed, ngày chạy, người chạy…). Chỉ áp dụng khi bạn đã thật sự chạy các test này — tick "Tôi đã chạy các test này" rồi bấm Apply. / This records test EXECUTION results — tick "I really ran these tests" first.';
