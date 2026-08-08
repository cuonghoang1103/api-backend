/**
 * Case-study 5.2 — Distributed ML Training Platform.
 *
 * A distributed-systems and scheduling project that happens to contain GPUs.
 * Four organising failures: gang-scheduling deadlock, losing 60 hours to one
 * dead node, buying GPUs without gaining speed (the network is the
 * bottleneck), and identical runs producing different results.
 */
import fs from 'node:fs';

const bodyMdx = fs.readFileSync(
  new URL('./distributed-ml-training-platform.md', import.meta.url),
  'utf8',
);
const bodyMdxEn = fs.readFileSync(
  new URL('./distributed-ml-training-platform.en.md', import.meta.url),
  'utf8',
);

export default {
  slug: 'distributed-ml-training-platform',
  title: 'Distributed ML Training Platform',
  titleEn: 'Distributed ML Training Platform',
  description:
    'Nền tảng huấn luyện mô hình trên nhiều GPU: lập lịch theo nhóm, ba kiểu song song, lưu điểm và khôi phục. Huấn luyện trên một GPU là chuyện của một tệp Python; trên 64 GPU thì đặt ra những câu hỏi mà không tài liệu học máy nào trả lời, vì chúng không phải câu hỏi về học máy.',
  descriptionEn:
    'A multi-GPU training platform: gang scheduling, three kinds of parallelism, checkpointing and recovery. Training on one GPU is a Python file; on 64 it raises questions no machine-learning tutorial answers, because they are not machine-learning questions.',
  techStack: [
    'Python', 'PyTorch', 'NCCL', 'Kubernetes', 'Go', 'Ray',
    'Prometheus', 'S3 / Cloudflare R2', 'PostgreSQL', 'gRPC', 'Docker',
  ],
  role: 'Hạ tầng / hệ phân tán (một người)',
  roleEn: 'Infrastructure / distributed systems (solo)',
  duration: '10–12 tuần',
  durationEn: '10–12 weeks',
  status: 'PLANNING',
  category: 'AI',
  difficulty: 'EXPERT',
  projectUrl: null,
  githubUrl: null,
  startDate: null,
  endDate: null,
  isFeatured: false,
  isPublished: true,

  schemaCode: `-- CẤP PHÁT THEO NHÓM: hoặc cấp ĐỦ toàn bộ GPU công việc cần, hoặc KHÔNG
-- CẤP GÌ CẢ. Không có trạng thái giữa.
--
-- Điều này ĐẢO NGƯỢC một trực giác quen thuộc: ở hầu hết hệ thống, cấp dần
-- là tốt vì tận dụng được tài nguyên. Ở đây cấp dần là cách CHẮC CHẮN để
-- lãng phí tài nguyên — hai công việc mỗi cái xin 8 GPU, mỗi cái nhận 4,
-- CẢ HAI chờ nhau vĩnh viễn và 8 GPU đắt tiền nằm không.

CREATE TABLE training_jobs (
    id            TEXT        PRIMARY KEY,
    experiment_id TEXT        NOT NULL REFERENCES experiments(id),
    gpus_required INTEGER     NOT NULL,
    priority      INTEGER     NOT NULL DEFAULT 0,
    -- Lưu điểm rồi nhả GPU biến "thu hồi tài nguyên" từ hành động TÀN NHẪN
    -- thành hành động BÌNH THƯỜNG. Không có nó, mọi công việc ưu tiên thấp
    -- đều phải chạy tới cùng hoặc mất trắng.
    preemptible   BOOLEAN     NOT NULL DEFAULT true,
    status        VARCHAR(16) NOT NULL DEFAULT 'QUEUED',
    -- Không tái lập được từng bit (số thực không kết hợp), nhưng PHẢI trả lời
    -- được "lần chạy này khác lần trước ở chỗ nào".
    git_commit    VARCHAR(40) NOT NULL,
    dataset_hash  VARCHAR(64) NOT NULL,
    library_versions JSONB    NOT NULL,
    hyperparams   JSONB       NOT NULL
);

CREATE TABLE checkpoints (
    job_id      TEXT        NOT NULL REFERENCES training_jobs(id) ON DELETE CASCADE,
    step_number INTEGER     NOT NULL,
    storage_path TEXT       NOT NULL,
    size_bytes  BIGINT      NOT NULL,
    -- Điểm lưu GẦN NHẤT có thể chính là điểm ghi DỞ khi nút chết.
    -- Luôn giữ ít nhất hai, và có cờ hoàn tất để biết cái nào dùng được.
    complete    BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (job_id, step_number)
);

-- Nội dung điểm lưu phải đủ để KHÔI PHỤC THẬT, không chỉ trọng số mô hình:
--   · trọng số mô hình
--   · trạng thái bộ tối ưu
--   · số bước đã chạy
--   · trạng thái bộ sinh số ngẫu nhiên  ← thiếu cái này thì khôi phục xong
--                                          chạy tiếp trên chuỗi dữ liệu KHÁC
--
-- Tần suất lưu là đánh đổi. Điểm cân bằng gần đúng:
--   khoảng lưu ≈ √(2 × thời gian ghi × thời gian trung bình giữa hai lần hỏng)

CREATE TABLE metric_points (
    job_id      TEXT     NOT NULL REFERENCES training_jobs(id) ON DELETE CASCADE,
    step        INTEGER  NOT NULL,
    -- ⚠️ node_id NẰM TRONG KHOÁ CHÍNH — có chủ ý. Chỉ ghi chỉ số tổng hợp
    -- toàn cụm thì KHÔNG BAO GIỜ phát hiện được một nút chậm. Trong song song
    -- dữ liệu, mọi nút đồng bộ ở MỖI bước nên MỘT nút chậm làm chậm TẤT CẢ:
    -- một GPU bị giảm xung do quá nhiệt kéo tụt cả cụm 64 nút, và nó KHÔNG
    -- gây lỗi nào — chỉ làm mọi thứ chậm hơn 20% mà không ai biết vì sao.
    node_id     TEXT     NOT NULL,
    loss_value  REAL,
    -- Mức DÙNG THẬT, không phải mức đã cấp. Cụm cấp phát 100% thường chỉ
    -- thật sự làm việc 30-50%, và phần lớn người vận hành không biết vì họ
    -- chỉ nhìn số GPU đã cấp.
    gpu_util_percent REAL,
    step_duration_ms INTEGER,
    PRIMARY KEY (job_id, step, node_id)
);`,

  schemaCodeEn: `-- GANG SCHEDULING: grant the FULL GPU count a job needs, or grant NOTHING.
-- There is no state in between.
--
-- This INVERTS a familiar instinct: in most systems incremental allocation is
-- good because it keeps resources busy. Here it is a RELIABLE way to waste
-- them — two jobs each requesting 8 GPUs, each granted 4, BOTH waiting
-- forever while eight expensive GPUs sit idle.

CREATE TABLE training_jobs (
    id            TEXT        PRIMARY KEY,
    experiment_id TEXT        NOT NULL REFERENCES experiments(id),
    gpus_required INTEGER     NOT NULL,
    priority      INTEGER     NOT NULL DEFAULT 0,
    -- Checkpoint-then-release turns preemption from a BRUTAL action into a
    -- ROUTINE one. Without it, every low-priority job must either run to
    -- completion or lose everything.
    preemptible   BOOLEAN     NOT NULL DEFAULT true,
    status        VARCHAR(16) NOT NULL DEFAULT 'QUEUED',
    -- Bit-exact reproduction is impossible (floats are not associative), but
    -- you MUST be able to answer "how did this run differ from the last".
    git_commit    VARCHAR(40) NOT NULL,
    dataset_hash  VARCHAR(64) NOT NULL,
    library_versions JSONB    NOT NULL,
    hyperparams   JSONB       NOT NULL
);

CREATE TABLE checkpoints (
    job_id      TEXT        NOT NULL REFERENCES training_jobs(id) ON DELETE CASCADE,
    step_number INTEGER     NOT NULL,
    storage_path TEXT       NOT NULL,
    size_bytes  BIGINT      NOT NULL,
    -- The MOST RECENT checkpoint may be exactly the HALF-WRITTEN file from
    -- when the node died. Always keep at least two, with a completion flag
    -- so you know which is usable.
    complete    BOOLEAN     NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (job_id, step_number)
);

-- Checkpoint contents must be enough to ACTUALLY RESUME, not just weights:
--   · model weights
--   · optimiser state
--   · step count
--   · random number generator state  ← miss this and you resume onto a
--                                       DIFFERENT data ordering
--
-- Frequency is a trade-off. The approximate optimum:
--   interval ≈ √(2 × write time × mean time between failures)

CREATE TABLE metric_points (
    job_id      TEXT     NOT NULL REFERENCES training_jobs(id) ON DELETE CASCADE,
    step        INTEGER  NOT NULL,
    -- ⚠️ node_id IS IN THE PRIMARY KEY, deliberately. With only cluster
    -- aggregates you will NEVER detect one slow node. In data parallelism
    -- every node synchronises at EVERY step, so ONE slow node slows EVERYONE:
    -- a single thermally throttled GPU drags down a 64-node cluster, and it
    -- raises NO error — everything is simply 20% slower and nobody knows why.
    node_id     TEXT     NOT NULL,
    loss_value  REAL,
    -- ACTUAL usage, not allocation. A cluster allocated 100% typically works
    -- at 30-50%, and most operators do not know because they only watch
    -- how many GPUs were handed out.
    gpu_util_percent REAL,
    step_duration_ms INTEGER,
    PRIMARY KEY (job_id, step, node_id)
);`,
  schemaLang: 'sql',

  milestones: [
    {
      phase: 'DESIGN',
      title: 'Cấp phát theo nhóm: đủ hoặc không cấp gì',
      titleEn: 'Gang scheduling: all or nothing',
      description:
        'Bộ lập lịch bình thường cấp tài nguyên khi có sẵn, và với huấn luyện phân tán điều đó tạo bế tắc kinh điển: hai công việc mỗi cái xin 8 GPU, mỗi cái nhận 4, cả hai chờ nhau vĩnh viễn. Cấp dần đảo ngược trực giác quen thuộc — ở đây nó là cách chắc chắn để lãng phí tài nguyên, vì huấn luyện phân tán không chạy được với một phần số nút.',
      descriptionEn:
        'An ordinary scheduler grants resources as they free up, and for distributed training that creates a textbook deadlock: two jobs each requesting 8 GPUs, each granted 4, both waiting forever. Incremental allocation inverts the familiar instinct here — it reliably wastes resources, because distributed training cannot run on a subset of its nodes.',
    },
    {
      phase: 'BACKEND',
      title: 'Đặt chỗ trước và lấp khe',
      titleEn: 'Reservation and backfill',
      description:
        'Công việc cần 64 GPU sẽ không bao giờ tới lượt nếu các công việc 1 GPU liên tục chen vào chỗ vừa trống — cần giữ chỗ dần cho nó. Nhưng trong lúc giữ chỗ, cụm sẽ nằm không rất nhiều nếu không cho công việc ngắn lấp vào, với điều kiện chúng CHẮC CHẮN kết thúc trước thời điểm đủ chỗ.',
      descriptionEn:
        'A job needing 64 GPUs never gets its turn if one-GPU jobs keep taking every freed slot — it needs an accumulating reservation. But while holding it, the cluster idles heavily unless short jobs backfill, on condition they PROVABLY finish before the reservation completes.',
    },
    {
      phase: 'BACKEND',
      title: 'Chọn kiểu song song: dữ liệu trước, phức tạp sau',
      titleEn: 'Choosing parallelism: data first, complexity later',
      description:
        'Song song dữ liệu (mỗi GPU giữ bản sao đầy đủ, chia lô ra, cộng gộp gradient) đúng cho 90% trường hợp. Chỉ khi mô hình không vừa bộ nhớ mới thêm loại khác: song song tensor cho một tầng quá lớn — nhưng nó trao đổi ở MỌI tầng nên chỉ dùng trong cùng một máy; song song đường ống cho nhiều tầng — trao đổi ít nhưng có bọt khí phải chữa bằng lô nhỏ.',
      descriptionEn:
        'Data parallelism (full model copy per GPU, split batch, sum gradients) is right for 90% of cases. Only when the model does not fit add others: tensor parallelism for an oversized layer — but it exchanges at EVERY layer so keep it within one machine; pipeline parallelism for many layers — little exchange but with bubbles that micro-batching fixes.',
    },
    {
      phase: 'BACKEND',
      title: 'Nút thắt là MẠNG: thuật toán gộp vòng tròn và chồng lấn',
      titleEn: 'The bottleneck is the NETWORK: ring reduction and overlap',
      description:
        'Mô hình 1 tỉ tham số ở 16 bit phải trao đổi 2GB mỗi GPU mỗi bước. Tính 100ms mà truyền 200ms thì GPU nằm không hai phần ba thời gian. Cách gộp ngây thơ (mọi nút gửi về một nút chủ) khiến nút chủ nhận N×2GB — càng thêm nút càng chậm. Thuật toán vòng tròn: mỗi nút chỉ nói với hai láng giềng, lưu lượng KHÔNG phụ thuộc N. Cùng kết quả toán học, khác hoàn toàn khả năng mở rộng.',
      descriptionEn:
        'A billion-parameter model at 16-bit exchanges 2GB per GPU per step. With 100ms of computation and 200ms of transfer, GPUs idle two-thirds of the time. Naive reduction (everyone sends to one master) makes that master receive N×2GB — more nodes, slower. Ring reduction has each node talk to two neighbours with traffic INDEPENDENT of N. Same mathematics, entirely different scaling.',
    },
    {
      phase: 'BACKEND',
      title: 'Lưu điểm đủ để khôi phục thật, và ghi bất đồng bộ',
      titleEn: 'Checkpoints complete enough to resume, written asynchronously',
      description:
        'Công việc 64 nút trong 3 ngày thì ít nhất một nút hỏng là gần như chắc chắn — câu hỏi là hỏng thì mất bao nhiêu công. Trọng số mô hình là chưa đủ: phải có cả trạng thái bộ tối ưu, số bước, và trạng thái bộ sinh số ngẫu nhiên, thiếu cái cuối thì khôi phục xong chạy trên chuỗi dữ liệu khác. Ghi 100GB đồng bộ là dừng huấn luyện vài phút — sao chép sang bộ nhớ chủ rồi ghi ở luồng nền.',
      descriptionEn:
        'A 64-node job over 3 days makes at least one failure near-certain — the question is what it costs. Weights are not enough: you need optimiser state, step count, and RNG state, and missing the last resumes onto a different data ordering. Writing 100GB synchronously stalls training for minutes — copy to host memory and write from a background thread.',
    },
    {
      phase: 'BACKEND',
      title: 'Đo mức dùng THẬT, và đo theo TỪNG nút',
      titleEn: 'Measure ACTUAL utilisation, and measure it PER NODE',
      description:
        'Cụm cấp phát 100% thường chỉ làm việc 30-50%. Bốn nguyên nhân: đói dữ liệu (GPU đắt chờ CPU rẻ), chờ đồng bộ gradient, lô quá nhỏ, và chờ nút chậm nhất. Nguyên nhân cuối khó chịu nhất vì nó KHÔNG gây lỗi — chỉ làm mọi thứ chậm 20% mà không ai biết. Phát hiện bằng cách đo thời gian bước theo từng nút và cảnh báo khi lệch khỏi trung vị.',
      descriptionEn:
        'A cluster allocated 100% typically works at 30-50%. Four causes: data starvation (expensive GPUs waiting on cheap CPUs), gradient synchronisation, batches too small, and waiting for the slowest node. The last is the most irritating because it raises NO error — everything is 20% slower and nobody knows. Detect it with per-node step timing and median-deviation alerts.',
    },
    {
      phase: 'BACKEND',
      title: 'Tái lập được: trả lời trung thực là "gần như"',
      titleEn: 'Reproducibility: the honest answer is "approximately"',
      description:
        'Phép cộng số thực không kết hợp, nên gộp gradient từ 64 nút theo thứ tự khác nhau cho kết quả khác ở chữ số cuối và khuếch đại qua hàng nghìn bước — KHÔNG sửa được trừ khi ép thứ tự cố định, và điều đó chậm đáng kể. Nhân tính toán không tất định thì tắt được, thứ tự nạp dữ liệu thì cố định hạt giống được. Điều đáng làm là ghi đủ để GIẢI THÍCH ĐƯỢC.',
      descriptionEn:
        'Floating-point addition is not associative, so summing gradients from 64 nodes in different orders differs in the last digits and amplifies over thousands of steps — NOT fixable without forcing a fixed order, which is considerably slower. Non-deterministic kernels can be disabled and loader ordering can be seeded. What is worth doing is recording enough to EXPLAIN.',
    },
    {
      phase: 'TESTING',
      title: 'Kiểm bằng cách giết nút và làm chậm nút có chủ ý',
      titleEn: 'Verify by killing nodes and deliberately slowing one',
      description:
        'Gửi hai công việc 8 GPU khi chỉ còn 8 — đúng một chạy, không bế tắc. Giết một nút giữa lúc huấn luyện — đường cong mất mát sau khôi phục phải LIỀN MẠCH, không nhảy bậc. Làm hỏng điểm lưu gần nhất — hệ thống dùng điểm trước đó. Làm chậm một nút có chủ ý — hệ thống phải PHÁT HIỆN và cảnh báo chứ không âm thầm chậm.',
      descriptionEn:
        'Submit two 8-GPU jobs with 8 free — exactly one runs, no deadlock. Kill a node mid-training — the loss curve after recovery must be CONTINUOUS with no discontinuity. Corrupt the newest checkpoint — the system falls back. Deliberately slow one node — the system must DETECT and alert rather than quietly degrade.',
    },
  ],

  features: [
    { title: 'Lập lịch cấp phát theo nhóm', titleEn: 'Gang-scheduled allocation', description: 'Đủ toàn bộ GPU hoặc không cấp gì — chống bế tắc từ thiết kế.', descriptionEn: 'The full GPU count or nothing — deadlock prevented by design.', status: 'PLANNED' },
    { title: 'Đặt chỗ trước và lấp khe', titleEn: 'Reservation with backfill', description: 'Việc lớn vẫn tới lượt, cụm không nằm không trong lúc chờ.', descriptionEn: 'Large jobs still get scheduled while the cluster keeps working.', status: 'PLANNED' },
    { title: 'Ba kiểu song song', titleEn: 'Three kinds of parallelism', description: 'Dữ liệu, tensor trong máy, đường ống giữa máy — kết hợp được.', descriptionEn: 'Data, tensor within machines, pipeline across them — combinable.', status: 'PLANNED' },
    { title: 'Gộp gradient vòng tròn có chồng lấn', titleEn: 'Ring reduction with overlap', description: 'Lưu lượng mỗi nút không tăng theo số nút, che phần lớn thời gian truyền.', descriptionEn: 'Per-node traffic independent of node count, hiding most transfer time.', status: 'PLANNED' },
    { title: 'Lưu điểm và khôi phục đầy đủ', titleEn: 'Complete checkpointing and recovery', description: 'Trọng số, bộ tối ưu, số bước, trạng thái ngẫu nhiên — ghi ở luồng nền.', descriptionEn: 'Weights, optimiser, step count and RNG state, written in the background.', status: 'PLANNED' },
    { title: 'Thu hồi tài nguyên có lưu điểm', titleEn: 'Preemption with checkpointing', description: 'Việc ưu tiên thấp nhả GPU mà không mất công đã làm.', descriptionEn: 'Low-priority jobs release GPUs without losing completed work.', status: 'PLANNED' },
    { title: 'Theo dõi mức dùng GPU theo từng nút', titleEn: 'Per-node GPU utilisation tracking', description: 'Phát hiện nút chậm bằng độ lệch khỏi trung vị thời gian bước.', descriptionEn: 'Slow-node detection via deviation from median step time.', status: 'PLANNED' },
    { title: 'Theo dõi thí nghiệm đầy đủ ngữ cảnh', titleEn: 'Experiment tracking with full context', description: 'Mã băm commit, mã băm dữ liệu, phiên bản thư viện, siêu tham số.', descriptionEn: 'Commit hash, dataset hash, library versions and hyperparameters.', status: 'PLANNED' },
  ],

  resources: [
    { title: 'Bringing HPC Techniques to Deep Learning (Baidu ring all-reduce)', titleEn: 'Bringing HPC Techniques to Deep Learning (Baidu ring all-reduce)', url: 'https://andrew.gibiansky.com/blog/machine-learning/baidu-allreduce/', type: 'LINK', description: 'Giải thích vì sao gộp vòng tròn có lưu lượng không phụ thuộc số nút — điểm mấu chốt của khả năng mở rộng.', descriptionEn: 'Why ring reduction has node-count-independent traffic — the crux of scalability.' },
    { title: 'Megatron-LM: Training Multi-Billion Parameter Models', titleEn: 'Megatron-LM: Training Multi-Billion Parameter Models', url: 'https://arxiv.org/abs/1909.08053', type: 'LINK', description: 'Song song tensor trong thực tế, và vì sao nó chỉ hợp trong cùng một máy.', descriptionEn: 'Tensor parallelism in practice, and why it belongs inside one machine.' },
    { title: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models', titleEn: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models', url: 'https://arxiv.org/abs/1910.02054', type: 'LINK', description: 'Chia trạng thái bộ tối ưu ra nhiều nút — cách kéo dài tuổi thọ của song song dữ liệu.', descriptionEn: 'Sharding optimiser state across nodes — how data parallelism is stretched further.' },
    { title: 'Kubernetes — Gang scheduling with Kueue', titleEn: 'Kubernetes — Gang scheduling with Kueue', url: 'https://kueue.sigs.k8s.io/docs/concepts/', type: 'LINK', description: 'Cấp phát theo nhóm, hàng đợi, đặt chỗ trước — trên một bộ điều phối thật.', descriptionEn: 'Gang allocation, queueing and reservation on a real orchestrator.' },
    { title: 'PyTorch — Reproducibility', titleEn: 'PyTorch — Reproducibility', url: 'https://pytorch.org/docs/stable/notes/randomness.html', type: 'LINK', description: 'Chính tài liệu nói rõ những gì KHÔNG tái lập được và cái giá của việc ép tất định.', descriptionEn: 'The documentation stating plainly what is NOT reproducible and what forcing determinism costs.' },
  ],

  coreKnowledge: [
    { vi: 'Lập lịch cấp phát theo nhóm và phòng chống bế tắc tài nguyên', en: 'Gang scheduling and resource deadlock prevention' },
    { vi: 'Ba kiểu song song và tiêu chí chọn giữa chúng', en: 'Three forms of parallelism and the criteria for choosing between them' },
    { vi: 'Nguyên hàm truyền thông tập thể và độ phức tạp của chúng', en: 'Collective communication primitives and their complexity' },
    { vi: 'Khi mạng là nút thắt: chồng lấn, gộp lô, chọn thuật toán', en: 'When the network is the bottleneck: overlap, batching, algorithm choice' },
    { vi: 'Chịu lỗi cho công việc dài: lưu điểm và toán tối ưu tần suất', en: 'Fault tolerance for long jobs: checkpointing and its optimal frequency' },
    { vi: 'Nhận diện nút chậm trong hệ thống đồng bộ chặt', en: 'Detecting stragglers in tightly synchronised systems' },
    { vi: 'Tái lập được trong tính toán số thực song song', en: 'Reproducibility in parallel floating-point computation' },
    { vi: 'Đo mức sử dụng thật thay vì mức cấp phát', en: 'Measuring actual utilisation rather than allocation' },
  ],

  portfolioBonus: [
    { vi: 'Biểu đồ thông lượng theo số GPU, chỉ rõ chỗ mở rộng bắt đầu kém đi', en: 'A throughput-versus-GPU-count chart showing where scaling degrades' },
    { vi: 'Video giết một nút và đường cong mất mát vẫn liền mạch sau khôi phục', en: 'A video killing a node with the loss curve staying continuous after recovery' },
    { vi: 'Thí nghiệm nút chậm: làm chậm một nút và đo ảnh hưởng lên cả cụm', en: 'A straggler experiment: slow one node and measure the cluster-wide effect' },
    { vi: 'So thời gian gộp gradient giữa cách gom về một nút và vòng tròn', en: 'Gradient reduction timed with gather-to-one versus ring' },
    { vi: 'Bảng theo dõi thí nghiệm chỉ ra hai lần chạy khác nhau ở đúng chỗ nào', en: 'An experiment tracker showing exactly where two runs differed' },
  ],

  completionOutcomes: [
    { vi: 'Vận hành được hạ tầng tính toán đắt tiền một cách hiệu quả', en: 'Operate expensive compute infrastructure efficiently' },
    { vi: 'Nhận ra nút thắt thật thay vì tối ưu chỗ không quan trọng', en: 'Identify the real bottleneck instead of optimising the wrong layer' },
    { vi: 'Thiết kế cho sự cố như một điều chắc chắn, không phải khả năng', en: 'Design for failure as a certainty rather than a possibility' },
    { vi: 'Hiểu lập lịch tài nguyên đủ để tránh bế tắc từ thiết kế', en: 'Understand resource scheduling well enough to design deadlock out' },
    { vi: 'Trung thực về giới hạn tái lập của hệ thống mình xây', en: 'Be honest about the reproducibility limits of what you build' },
  ],

  bodyMdx,
  bodyMdxEn,
};
