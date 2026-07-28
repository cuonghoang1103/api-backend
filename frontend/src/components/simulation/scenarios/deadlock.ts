/**
 * Hệ điều hành · OSG202 — deadlock: hai bên cùng chờ nhau mãi mãi.
 *
 * Deadlock đáng sợ không phải vì khó hiểu, mà vì nó KHÔNG BÁO LỖI. Không có
 * ngoại lệ nào được ném ra, không có dòng log nào đỏ lên. Hai luồng chỉ đơn
 * giản là đứng im, mãi mãi, trong khi CPU rảnh rỗi và mọi thứ trông vẫn "đang
 * chạy". Đó là lý do nó thường được phát hiện bởi người dùng chứ không phải
 * bởi hệ thống giám sát.
 *
 * Bốn điều kiện Coffman phải thoả ĐỒNG THỜI thì deadlock mới xảy ra:
 *   1. Loại trừ tương hỗ  — tài nguyên chỉ một người giữ được.
 *   2. Giữ và chờ         — đang giữ cái này mà vẫn đòi cái kia.
 *   3. Không giành lại được — không ai cướp được tài nguyên từ tay người khác.
 *   4. Chờ vòng tròn      — A chờ B, B chờ A.
 *
 * Ý nghĩa thực tiễn của "đồng thời": phá được MỘT điều kiện là hết deadlock.
 * Và trong thực tế, cái dễ phá nhất luôn là điều kiện thứ tư.
 */

import { Split } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const nodes = [
  { id: 't1', label: 'Luồng A', kind: 'worker' as const, x: 200, y: 170, sublabel: { vi: 'chuyển tiền 1 → 2', en: 'transfer 1 → 2' } },
  { id: 't2', label: 'Luồng B', kind: 'worker' as const, x: 200, y: 430, sublabel: { vi: 'chuyển tiền 2 → 1', en: 'transfer 2 → 1' } },
  { id: 'r1', label: 'Khoá tài khoản 1', kind: 'db' as const, x: 700, y: 170, sublabel: { vi: 'chỉ 1 người giữ được', en: 'exclusive' } },
  { id: 'r2', label: 'Khoá tài khoản 2', kind: 'db' as const, x: 700, y: 430, sublabel: { vi: 'chỉ 1 người giữ được', en: 'exclusive' } },
];

const edges = [
  { id: 'e_t1_r1', from: 't1', to: 'r1' },
  { id: 'e_t1_r2', from: 't1', to: 'r2' },
  { id: 'e_t2_r2', from: 't2', to: 'r2' },
  { id: 'e_t2_r1', from: 't2', to: 'r1' },
];

type Push = (step: Partial<SimStep> & { id: string; title: I18nText; detail: I18nText; duration: number }) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (s) => {
    steps.push({ kind: 'INTERNAL', ...s } as SimStep);
  };
  return { steps, push };
}

/* ── A — DEADLOCK XẢY RA ─────────────────────────────────────── */

function buildDeadlock(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'setup',
    title: { vi: 'Hai giao dịch chuyển tiền ngược chiều nhau', en: 'Two transfers running in opposite directions' },
    detail: {
      vi: 'Luồng A chuyển tiền từ tài khoản 1 sang 2; luồng B chuyển từ 2 sang 1. Cả hai đều làm đúng: khoá cả hai tài khoản trước khi động vào số dư, để không ai đọc phải trạng thái nửa vời. Mã của từng luồng, xét riêng, hoàn toàn không có lỗi.',
      en: 'Thread A transfers from account 1 to 2; thread B from 2 to 1. Both do the right thing: lock both accounts before touching balances so nobody reads a half-finished state. Each thread’s code, taken alone, is entirely correct.',
    },
    duration: 2700,
    at: 't1',
    nodeStates: { t1: 'active', t2: 'active' },
    sfx: 'click',
    log: { vi: 'A: khoá(1) rồi khoá(2) · B: khoá(2) rồi khoá(1)', en: 'A: lock(1) then lock(2) · B: lock(2) then lock(1)' },
  });

  push({
    id: 'grab1',
    title: { vi: 'A lấy được khoá 1, B lấy được khoá 2', en: 'A takes lock 1, B takes lock 2' },
    detail: {
      vi: 'Hai luồng chạy song song nên cả hai đều lấy được khoá đầu tiên của mình. Tới đây vẫn chưa có gì sai — mỗi khoá đúng một chủ, mọi thứ diễn ra như thiết kế. Điều kiện Coffman số 1 (loại trừ tương hỗ) và số 2 (giữ và chờ) vừa được thoả.',
      en: 'Running in parallel, both threads acquire their first lock. Nothing is wrong yet — each lock has exactly one owner, all as designed. Coffman conditions one (mutual exclusion) and two (hold and wait) have just been met.',
    },
    duration: 2900,
    edge: 'e_t1_r1',
    kind: 'TOKEN',
    nodeStates: { r1: 'processing', r2: 'processing' },
    packetLabel: 'khoá(1)',
    alsoInFlight: [{ edge: 'e_t2_r2', at: 0.5, label: 'khoá(2)', kind: 'TOKEN' }],
    sfx: 'lock',
    log: { vi: 'A giữ khoá 1 ✓ · B giữ khoá 2 ✓', en: 'A holds lock 1 ✓ · B holds lock 2 ✓' },
  });

  push({
    id: 'wait',
    title: { vi: 'A đòi khoá 2 — nhưng B đang giữ', en: 'A asks for lock 2 — but B holds it' },
    detail: {
      vi: 'A không thể lấy được, nên nó CHỜ. Và trong lúc chờ, nó vẫn không nhả khoá 1 ra — đây chính là "giữ và chờ", và cũng là chỗ mọi thứ bắt đầu hỏng. Nếu A chịu nhả khoá 1 khi không lấy được khoá 2 thì đã không có chuyện gì.',
      en: 'A cannot have it, so it WAITS. And while waiting it does not release lock 1 — this is "hold and wait", and where things start to break. Had A released lock 1 upon failing to get lock 2, nothing would have happened.',
    },
    duration: 3000,
    edge: 'e_t1_r2',
    kind: 'QUERY',
    nodeStates: { t1: 'waiting' },
    packetLabel: 'đòi khoá(2)',
    sfx: 'blip',
    log: { vi: 'A chờ khoá 2 · vẫn đang giữ khoá 1', en: 'A waits for lock 2 · still holding lock 1' },
  });

  push({
    id: 'cycle',
    title: { vi: 'Và B đòi khoá 1 — vòng tròn khép lại', en: 'And B asks for lock 1 — the circle closes' },
    detail: {
      vi: 'Bây giờ A chờ B, B chờ A. Không ai nhả, không ai cướp được của ai, và không có tác động từ bên ngoài nào có thể phá thế bí này. Bốn điều kiện Coffman đã thoả đủ — kể từ giây phút này, hai luồng đứng im vĩnh viễn.',
      en: 'Now A waits on B and B waits on A. Neither releases, neither can seize from the other, and no outside event can break the tie. All four Coffman conditions are satisfied — from this instant the two threads are frozen forever.',
    },
    duration: 3200,
    edge: 'e_t2_r1',
    kind: 'ERROR',
    nodeStates: { t1: 'error', t2: 'error', r1: 'error', r2: 'error' },
    packetLabel: 'đòi khoá(1)',
    sfx: 'error',
    log: { vi: 'DEADLOCK · A chờ B · B chờ A · không ai nhúc nhích', en: 'DEADLOCK · A waits B · B waits A · nobody moves' },
    teachingNote: {
      vi: 'Chỉ vào vòng tròn: đây là điều kiện thứ 4, và là cái dễ phá nhất trong bốn cái.',
      en: 'Point at the cycle: this is condition four, and the easiest of the four to break.',
    },
  });

  push({
    id: 'silent',
    title: { vi: 'Điều tệ nhất: không có lỗi nào được báo', en: 'The worst part: no error is ever reported' },
    detail: {
      vi: 'Không ngoại lệ, không log, không cảnh báo. CPU rảnh rỗi vì hai luồng đang ngủ chờ khoá, nên biểu đồ giám sát trông rất bình thường. Triệu chứng duy nhất là hai request đó không bao giờ trả lời — và nếu chúng nằm trong bể luồng, thì mỗi lần deadlock lại ăn mất một luồng cho tới khi cả dịch vụ đứng hình.',
      en: 'No exception, no log line, no warning. The CPU is idle because both threads sleep on locks, so monitoring graphs look perfectly healthy. The only symptom is that those two requests never answer — and if they came from a thread pool, each deadlock consumes one more thread until the whole service stops responding.',
    },
    duration: 3100,
    at: 't1',
    kind: 'ERROR',
    nodeStates: { t1: 'error', t2: 'error' },
    sfx: 'buzz',
    log: { vi: 'CPU 0% · không lỗi · 2 request treo vĩnh viễn', en: 'CPU 0% · no errors · 2 requests hung forever' },
  });

  push({
    id: 'detect',
    title: { vi: 'Cách phát hiện: dump luồng và tìm vòng tròn', en: 'How to detect it: dump the threads and find the cycle' },
    detail: {
      vi: '`jstack` với Java hay `py-spy dump` với Python in ra từng luồng đang chờ gì và giữ gì. Máy ảo Java còn tự nhận ra vòng tròn và in thẳng "Found one Java-level deadlock". Với CSDL thì bộ quản lý khoá tự dò và giết một giao dịch làm nạn nhân — nên trong Postgres bạn thấy lỗi "deadlock detected" chứ không bị treo.',
      en: '`jstack` for Java or `py-spy dump` for Python prints what each thread waits on and holds. The JVM even detects the cycle itself and prints "Found one Java-level deadlock". Databases have a lock manager that spots cycles and kills one transaction as the victim — which is why Postgres gives you a "deadlock detected" error instead of hanging.',
    },
    duration: 3000,
    at: 't2',
    nodeStates: { t2: 'active' },
    sfx: 'blip',
    log: { vi: 'jstack → "Found one Java-level deadlock"', en: 'jstack → "Found one Java-level deadlock"' },
  });

  return steps;
}

/* ── B — PHÁ VÒNG TRÒN ───────────────────────────────────────── */

function buildFix(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'idea',
    title: { vi: 'Phá một trong bốn điều kiện là đủ', en: 'Breaking any one of the four suffices' },
    detail: {
      vi: 'Bốn điều kiện phải thoả ĐỒNG THỜI, nên chỉ cần làm hỏng một cái là deadlock không xảy ra được nữa. Xét từng cái: bỏ loại trừ tương hỗ thì mất luôn tính đúng đắn; cho phép cướp khoá thì phải viết lại logic khôi phục rất phức tạp; cấm giữ-và-chờ thì phải xin tất cả khoá cùng lúc, khó áp dụng. Còn lại điều kiện thứ tư.',
      en: 'All four must hold SIMULTANEOUSLY, so breaking just one makes deadlock impossible. Consider each: dropping mutual exclusion sacrifices correctness; allowing preemption demands complex rollback logic; forbidding hold-and-wait means acquiring every lock at once, rarely practical. That leaves the fourth.',
    },
    duration: 2900,
    at: 't1',
    nodeStates: { t1: 'active', t2: 'active' },
    sfx: 'click',
    log: { vi: '4 điều kiện phải thoả CÙNG LÚC → phá 1 là xong', en: 'all four must hold AT ONCE → break one and you are done' },
  });

  push({
    id: 'order',
    title: { vi: 'Cách chuẩn: luôn lấy khoá theo cùng một THỨ TỰ', en: 'The standard fix: always take locks in the same ORDER' },
    detail: {
      vi: 'Quy ước: ai cũng khoá tài khoản có số nhỏ trước. Luồng B muốn chuyển 2 → 1 thì vẫn phải khoá 1 trước rồi mới tới 2 — dù thứ tự đó ngược với chiều chuyển tiền. Chỉ một quy ước bằng một dòng mã, mà vòng tròn trở nên bất khả thi về mặt toán học.',
      en: 'The convention: everyone locks the lower-numbered account first. Thread B, transferring 2 → 1, must still lock 1 before 2 — even though that order is the reverse of the money flow. One convention in one line of code, and a cycle becomes mathematically impossible.',
    },
    duration: 3100,
    edge: 'e_t1_r1',
    kind: 'TOKEN',
    nodeStates: { r1: 'processing' },
    packetLabel: 'cả hai: khoá(1) trước',
    sfx: 'lock',
    log: { vi: 'quy ước: luôn khoá theo id tăng dần', en: 'convention: always lock in ascending id order' },
  });

  push({
    id: 'race',
    title: { vi: 'Giờ hai luồng cùng đòi khoá 1 — và đó là chuyện bình thường', en: 'Now both threads want lock 1 — and that is perfectly fine' },
    detail: {
      vi: 'A lấy được, B phải chờ. Nhưng chờ ở đây khác hẳn: B chờ mà KHÔNG giữ khoá nào cả. Nó không chặn ai, nên không thể là một mắt xích trong vòng tròn nào. Đây mới là điểm mấu chốt — không phải "không còn ai phải chờ", mà là "người đang chờ thì tay trắng".',
      en: 'A gets it, B must wait. But this waiting is different: B waits while HOLDING NOTHING. It blocks nobody, so it cannot be a link in any cycle. That is the crux — not "nobody waits any more", but "whoever waits holds nothing".',
    },
    duration: 3100,
    edge: 'e_t2_r1',
    kind: 'QUERY',
    nodeStates: { t2: 'waiting', r1: 'success' },
    packetLabel: 'B chờ, tay trắng',
    sfx: 'blip',
    log: { vi: 'B chờ khoá 1 · B không giữ khoá nào → không thành vòng', en: 'B waits for lock 1 · holding nothing → no cycle possible' },
    teachingNote: {
      vi: 'Câu chốt: chờ không nguy hiểm. Chờ TRONG KHI ĐANG GIỮ mới nguy hiểm.',
      en: 'The key line: waiting is not dangerous. Waiting WHILE HOLDING is.',
    },
  });

  push({
    id: 'flow',
    title: { vi: 'A xong việc, nhả cả hai khoá, B chạy tiếp', en: 'A finishes, releases both locks, B proceeds' },
    detail: {
      vi: 'Hai giao dịch nối đuôi nhau thay vì chạy song song, chậm hơn một chút — nhưng cả hai đều XONG. Đánh đổi này gần như luôn đáng: mất vài mili giây thông lượng để loại bỏ hoàn toàn một lớp lỗi có thể treo cả dịch vụ.',
      en: 'The two transactions run back to back instead of in parallel, slightly slower — but both COMPLETE. That trade is almost always worth it: a few milliseconds of throughput in exchange for eliminating an entire class of bug that can hang the service.',
    },
    duration: 3000,
    edge: 'e_t2_r1',
    kind: 'ACK',
    nodeStates: { t1: 'success', t2: 'success', r1: 'success', r2: 'success' },
    packetLabel: 'B nhận khoá 1',
    sfx: 'success',
    log: { vi: 'A xong → nhả khoá → B chạy → cả hai xong', en: 'A done → releases → B runs → both complete' },
  });

  push({
    id: 'timeout',
    title: { vi: 'Lưới an toàn thứ hai: đặt hạn chờ', en: 'The second safety net: put a timeout on the wait' },
    detail: {
      vi: 'Thứ tự khoá chỉ đúng nếu mọi đoạn mã đều tuân thủ, mà dự án lớn thì khó bảo đảm điều đó. Nên luôn dùng `tryLock(timeout)` thay vì chờ vô hạn: quá hạn thì nhả hết những gì đang giữ, lùi lại một chút rồi thử lại. Deadlock vẫn có thể chớm xảy ra, nhưng nó tự gỡ trong vài trăm mili giây thay vì treo vĩnh viễn.',
      en: 'Lock ordering only works if every code path obeys it, which is hard to guarantee in a large codebase. So always prefer `tryLock(timeout)` over waiting forever: on timeout, release everything held, back off briefly, and retry. A deadlock can still form, but it unwinds itself in a few hundred milliseconds instead of hanging forever.',
    },
    duration: 3100,
    at: 't1',
    nodeStates: { t1: 'active' },
    sfx: 'ping',
    log: { vi: 'tryLock(200ms) → thất bại thì nhả hết + thử lại', en: 'tryLock(200ms) → on failure release all + retry' },
  });

  push({
    id: 'less',
    title: { vi: 'Và cách chắc chắn nhất: bớt khoá đi', en: 'And the surest fix of all: use fewer locks' },
    detail: {
      vi: 'Không có khoá thì không có deadlock. Nhiều bài toán vốn không cần khoá lồng nhau: giao dịch của CSDL đã lo chuyện nguyên tử, hàng đợi tin nhắn biến hai thao tác song song thành tuần tự, và một phép cập nhật nguyên tử duy nhất thay được cả cặp khoá. Trước khi đi tìm thứ tự khoá đúng, hãy hỏi liệu có cần khoá thứ hai không.',
      en: 'No locks, no deadlock. Many problems never needed nested locks at all: a database transaction already provides atomicity, a message queue turns two parallel operations into sequential ones, and a single atomic update can replace a pair of locks entirely. Before hunting for the right lock order, ask whether the second lock is needed at all.',
    },
    duration: 3100,
    at: 't2',
    nodeStates: { t2: 'active' },
    sfx: 'lock',
    log: { vi: 'không khoá lồng nhau = không thể deadlock', en: 'no nested locks = deadlock impossible' },
  });

  return steps;
}

export const deadlockScenario: Scenario = {
  id: 'deadlock',
  name: { vi: 'Deadlock — hai bên cùng chờ nhau mãi mãi', en: 'Deadlock — both sides waiting forever' },
  tagline: {
    vi: 'Hai luồng đều viết đúng, mỗi luồng xét riêng không có lỗi nào — nhưng chạy cùng lúc thì đứng im vĩnh viễn. Không ngoại lệ, không log, CPU 0%: mọi biểu đồ giám sát đều trông bình thường.',
    en: 'Two threads, both correct in isolation — yet run together they freeze forever. No exception, no log, CPU at 0%: every monitoring graph looks perfectly healthy.',
  },
  icon: Split,
  accent: '#f43f5e',
  group: 'os',
  nodes,
  edges,
  options: [
    {
      id: 'view',
      label: { vi: 'Tình huống', en: 'Situation' },
      defaultValue: 'lock',
      choices: [
        {
          value: 'lock',
          label: 'Deadlock xảy ra',
          fullLabel: 'Bốn điều kiện Coffman khép lại',
          color: '#f43f5e',
          hint: { vi: 'không lỗi, không log, CPU 0%', en: 'no error, no log, 0% CPU' },
        },
        {
          value: 'fix',
          label: 'Phá vòng tròn',
          fullLabel: 'Thứ tự khoá, hạn chờ, bớt khoá',
          color: '#34d399',
          hint: { vi: 'chờ mà tay trắng thì vô hại', en: 'waiting while holding nothing is harmless' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'fix' ? buildFix() : buildDeadlock()),
};
