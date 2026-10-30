/** CEA201 · N3.1 — Speculative execution and the Spectre / Meltdown class of side channels (khái niệm, phòng thủ). */
import { doiDau, KHOA, bi, hai, giai, tinh, mc, q, tn, ord } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Speculation 1 — Side channels from speculative execution: concepts',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions about why speculation can leak data, and how systems defend.</p>', '<p>Câu hỏi khái niệm về việc thực hiện suy đoán có thể làm lộ dữ liệu thế nào và cách phòng thủ.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A speculative instruction that turns out to be on the wrong path is discarded. What survives?', 'Một lệnh suy đoán hoá ra nằm sai đường sẽ bị huỷ. Cái gì còn lại?'], ['Micro-architectural state such as cache contents', 'The architectural registers', 'The program counter', 'The memory values written by the instruction'], ['Rollback restores the architectural state, not the cache; that residue is the side channel.', 'Rollback khôi phục trạng thái kiến trúc, không khôi phục cache; phần dư đó là kênh phụ.']),
    q('c2', ['A cache timing side channel works because …', 'Kênh phụ thời gian cache hoạt động vì …'], ['an access to a cached line is measurably faster than a miss', 'the cache encrypts data', 'the clock changes with the data', 'the operating system reports addresses'], ['An attacker infers which lines were touched by timing later accesses.', 'Kẻ tấn công suy ra dòng nào đã được chạm bằng cách đo thời gian các truy cập sau.']),
    q('c3', ['Which is a software mitigation for bounds-check bypass?', 'Biện pháp phần mềm nào chống bỏ qua kiểm tra biên?'], ['Insert a speculation barrier or mask the index so out-of-bounds speculation reads nothing useful', 'Increase the clock rate', 'Disable the keyboard', 'Use a bigger disk'], ['Fences, index masking or retpolines limit what speculation can reach.', 'Rào chắn, che chỉ số hay retpoline giới hạn những gì suy đoán với tới.']),
    q('c4', ['Meltdown-class attacks are mitigated in the OS mainly by …', 'Các tấn công kiểu Meltdown được hệ điều hành giảm thiểu chủ yếu bằng …'], ['separating kernel and user page tables (kernel page-table isolation)', 'adding more RAM', 'turning off the cache', 'shortening the pipeline'], ['Kernel memory is simply not mapped while user code runs.', 'Bộ nhớ nhân đơn giản là không được ánh xạ khi mã người dùng chạy.']),
    q('c5', ['Why is the performance feature itself, not a bug in one program, the root cause?', 'Vì sao chính tính năng tăng hiệu năng, chứ không phải lỗi của một chương trình, là gốc rễ?'], ['Speculation changes shared micro-architectural state before the checks complete', 'The compiler is wrong', 'The OS scheduler is wrong', 'The network is insecure'], ['Hardware must be fixed or restricted, software can only reduce exposure.', 'Phải sửa/giới hạn phần cứng, phần mềm chỉ giảm mức phơi bày.']),
  ],
  goiY: ['Architectural state is rolled back; micro-architectural state is not.', 'Think about what an attacker can observe: time.'],
  loiHayGap: ['Believing a squashed instruction leaves no trace at all.', 'Believing the problem is only in one vendor’s CPU.'],
  thuatNgu: [tn('side channel', 'kênh phụ'), tn('speculative execution', 'thực hiện suy đoán')],
  khaiNiem: ['speculative execution', 'side channels'],
});

const E2 = tinh({
  tieuDe: 'Speculation 2 — Order the stages of a bounds-check-bypass leak (concept level)',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>This is the conceptual sequence of a Spectre-variant-1 style leak (no code). Put the stages in order.</p>', '<p>Đây là chuỗi khái niệm của một vụ rò kiểu Spectre biến thể 1 (không có mã). Sắp các giai đoạn theo thứ tự.</p>'),
  loai: 'order',
  cauHoi: [ord('q1', ['Stages of a bounds-check-bypass leak', 'Các giai đoạn của vụ rò do bỏ qua kiểm tra biên'], ['The attacker runs the victim code many times with valid indices so the branch predictor learns “the bounds check passes”', 'The attacker supplies an out-of-bounds index and evicts the data needed to resolve the check, so the check resolves slowly', 'The processor speculates past the check and executes the loads using the out-of-bounds index', 'A secret-dependent cache line is brought into the cache by the speculative load', 'The processor discovers the misprediction and discards the speculative results; registers are restored but the cache line stays', 'The attacker times accesses to the candidate cache lines and infers the secret from the one that is fast'], ['Training, mis-speculation, residue in the cache, then timing: the defence breaks any link of the chain (barriers, masking, isolation, timer coarsening).', 'Huấn luyện, suy đoán sai, dấu vết trong cache, rồi đo thời gian: phòng thủ cắt bất kỳ mắt xích nào (rào chắn, che chỉ số, cô lập, làm thô bộ đếm giờ).'], 2)],
  goiY: ['The predictor must be trained before it can be fooled.', 'The measurement comes last.'],
  loiHayGap: ['Placing the timing measurement before the speculation.', 'Believing the architectural registers keep the secret.'],
  thuatNgu: [tn('branch predictor training', 'huấn luyện bộ dự đoán')],
  khaiNiem: ['Spectre v1'],
});

export default doiDau({
  slug: 'cea201-n3-1-spectre-meltdown',
  ten: '18.1 Speculative execution & Spectre / Meltdown',
  khoa: KHOA,
  baiHoc: 'cea201-n3-1-spectre-meltdown',
  de: [E1, E2],
});
void hai; void giai; void mc;
