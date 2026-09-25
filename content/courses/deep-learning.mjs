/**
 * Deep Learning with PyTorch — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 25/09/2026 (công khai ngay theo cách làm
 * của 11 khoá khung trước — status PUBLISHED, bài chưa soạn hiện "Đang soạn"), chi tiết soạn sau. Nằm trong lộ trình ở
 * ~/Documents/LO-TRINH-HOC.md. Nối tiếp khoá Machine Learning Fundamentals. Xem _chung/khung.mjs.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'ai', name: 'AI & Tự động hoá', icon: 'Sparkles', sortOrder: 6 },
  course: {
    slug: 'deep-learning',
    title: 'Deep Learning with PyTorch',
    level: 'ADVANCED',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/deep-learning.png?v=1',
    shortDescription: 'Tensors, autograd, neural networks, CNNs, attention and transformers, training on GPU, fine-tuning with Hugging Face (LoRA/PEFT), running models locally, and serving a fine-tuned model as an API.|||Tensor, autograd, mạng nơ-ron, CNN, attention và transformer, huấn luyện trên GPU, fine-tune với Hugging Face (LoRA/PEFT), chạy model cục bộ, và đưa model đã fine-tune thành một API.',
    description: 'Khoá Deep Learning đi từ nền tảng PyTorch tới việc thực sự fine-tune và phục vụ một mô hình. Nội dung: tensor và autograd (cơ chế tính đạo hàm tự động làm nền cho mọi thứ), xây mạng nơ-ron với nn.Module, vòng lặp huấn luyện (loss function, optimizer, scheduler), mạng tích chập (CNN) cho ảnh, mô hình chuỗi và cơ chế attention, kiến trúc transformer (self-attention, positional encoding — chính nền tảng của các LLM hiện nay), huấn luyện trên GPU (CUDA/MPS, mixed precision), fine-tune model có sẵn từ Hugging Face bằng LoRA/PEFT (hiệu quả hơn fine-tune toàn bộ tham số), chạy model cục bộ (quantization, inference không cần cloud), tới đưa một model đã fine-tune ra thành một API phục vụ thật. Yêu cầu hiểu ML cổ điển trước — khoá này không dạy lại train/test split hay overfitting từ đầu.',
    whatYouLearn: 'Hiểu tensor và autograd đủ sâu để không còn coi PyTorch là "hộp đen"; tự viết mạng nơ-ron bằng nn.Module và vòng lặp huấn luyện từ đầu; huấn luyện CNN cho bài toán ảnh; hiểu cơ chế attention và kiến trúc transformer — nền tảng của các LLM hiện đại; huấn luyện hiệu quả trên GPU với mixed precision; fine-tune một model có sẵn bằng LoRA/PEFT thay vì huấn luyện lại từ đầu; chạy model cục bộ và hiểu quantization; và đóng gói một model đã fine-tune thành một API có thể gọi từ ứng dụng thật.',
    requirements: 'Đã học khoá Machine Learning Fundamentals của CuongThai (train/test split, overfitting, đánh giá mô hình — khoá này không dạy lại). Biết Python ở mức khoá Python for Backend & AI (numpy, class, decorator). Cần một GPU để huấn luyện nhanh (NVIDIA có CUDA, hoặc Apple Silicon có MPS); không có GPU vẫn học được toàn bộ khái niệm và huấn luyện được mô hình nhỏ trên CPU, chỉ chậm hơn.',
    documentsNote: 'Tài liệu chính: docs.pytorch.org (PyTorch chính thức) • huggingface.co/docs/transformers • huggingface.co/docs/peft (LoRA) • huggingface.co/docs/datasets • Bài báo "Attention Is All You Need" (Vaswani et al., 2017) cho phần transformer.',
  },
  sections: khung('dl', [
    ['Section 0 — Deep learning vs classical ML', 'Mục 0 — Deep learning khác ML cổ điển ở đâu', 'Khi nào cần mạng nơ-ron sâu, và cách chuẩn bị GPU cho khoá này.', [
      ['bat-dau-tai-day', 'Start here (1/2) — What deep learning is, a brief history, and why it powers today’s AI', 'Bắt đầu tại đây (1/2) — Deep learning là gì, lịch sử ngắn gọn, và vì sao nó chạy AI hiện nay', 'Mạng nơ-ron nhiều lớp học đặc trưng tự động, không cần thiết kế feature tay · AlexNet 2012 → Transformer 2017 → LLM hiện nay: một dòng chảy liên tục · Vì sao ảnh, âm thanh, văn bản phi cấu trúc cần deep learning thay vì ML cổ điển · Câu hỏi phỏng vấn hay gặp'],
      ['bat-dau-khi-khong-co', 'Start here (2/2) — When classical ML is the wrong tool, and how to study this course', 'Bắt đầu tại đây (2/2) — Khi nào ML cổ điển là công cụ sai, và cách học khoá này', 'Ví dụ: feature engineering tay cho ảnh không bao giờ bắt kịp CNN học tự động · Chi phí thật của deep learning: dữ liệu nhiều hơn, tính toán nặng hơn · Lộ trình: tensor/autograd → mạng nơ-ron → CNN → attention/transformer → GPU → fine-tune → chạy cục bộ → phục vụ API'],
      ['chuan-bi-gpu', 'Setting up: PyTorch, CUDA/MPS, and checking your GPU', 'Chuẩn bị: PyTorch, CUDA/MPS, và kiểm tra GPU', 'uv add torch theo đúng hướng dẫn cho hệ điều hành/GPU · torch.cuda.is_available() / torch.backends.mps.is_available() · Không có GPU vẫn học được — mọi ví dụ có bản chạy CPU'],
      ['tensor-dau-tien', 'Your first tensors', 'Tensor đầu tiên', 'torch.tensor và so sánh nhanh với ndarray của numpy · .to(device) chuyển tensor giữa CPU và GPU · dtype và vì sao float32 là mặc định phổ biến'],
    ]],
    ['Chapter 1 — Tensors and autograd', 'Chương 1 — Tensor và autograd', 'Cơ chế tính đạo hàm tự động — nền của mọi thứ trong PyTorch.', [
      ['tensor-operations', 'Tensor operations and shapes', 'Phép toán tensor và shape', 'Broadcasting giống numpy · reshape/view/permute và bẫy contiguous · Phép toán trên GPU chạy song song hàng loạt'],
      ['autograd-co-che', 'How autograd tracks operations', 'Autograd theo dõi phép toán thế nào', 'requires_grad=True bật theo dõi gradient · Computation graph xây dựng động (dynamic graph) trong lúc chạy forward · .backward() tính gradient ngược lại toàn bộ graph'],
      ['gradient-thuc-hanh', 'Computing gradients by hand, then by autograd', 'Tính gradient bằng tay, rồi bằng autograd', 'Một hàm một biến đơn giản: tính đạo hàm tay rồi so với .grad · torch.no_grad() khi không cần theo dõi gradient (lúc inference) · Xoá gradient (.zero_grad()) giữa các bước — lỗi quên bước này rất phổ biến'],
      ['optimizer-gioi-thieu', 'A first look at optimizers', 'Nhìn nhanh qua optimizer', 'SGD cập nhật tham số theo hướng ngược gradient · Learning rate ảnh hưởng thế nào (minh hoạ trực quan) · torch.optim.SGD/Adam giới thiệu, đào sâu ở Chương 3'],
    ]],
    ['Chapter 2 — Building neural networks', 'Chương 2 — Xây mạng nơ-ron', 'nn.Module, layer, và hàm kích hoạt.', [
      ['nn-module', 'nn.Module and defining a network', 'nn.Module và định nghĩa một mạng', '__init__ khai báo layer, forward định nghĩa luồng dữ liệu · nn.Linear cho fully-connected layer · Đếm số tham số của một mạng'],
      ['activation', 'Activation functions', 'Hàm kích hoạt', 'ReLU và vì sao nó phổ biến hơn sigmoid ở lớp ẩn · Vai trò của phi tuyến tính — không có nó mạng nhiều lớp cũng chỉ tương đương một lớp tuyến tính · GELU (dùng nhiều trong transformer, giới thiệu trước khi tới Chương 7)'],
      ['loss-function', 'Loss functions', 'Hàm mất mát', 'MSELoss cho hồi quy, CrossEntropyLoss cho phân loại · Vì sao CrossEntropyLoss đã gồm sẵn softmax bên trong (bẫy hay gặp) · Chọn loss đúng bài toán, giống chọn metric ở khoá Machine Learning'],
      ['forward-backward', 'The forward/backward/step cycle', 'Chu trình forward/backward/step', 'forward tính output và loss · loss.backward() tính gradient · optimizer.step() cập nhật tham số — ba bước lặp lại mỗi vòng huấn luyện'],
    ]],
    ['Chapter 3 — The training loop', 'Chương 3 — Vòng lặp huấn luyện', 'Optimizer, scheduler, và huấn luyện một mạng thật trên dữ liệu thật.', [
      ['dataset-dataloader', 'Dataset and DataLoader', 'Dataset và DataLoader', 'torch.utils.data.Dataset tuỳ biến · DataLoader cho batch, shuffle, và tải dữ liệu song song (num_workers) · Chia train/validation giống nguyên tắc đã học ở khoá Machine Learning'],
      ['optimizer-sau', 'Optimizers in depth: SGD, Adam, AdamW', 'Đào sâu optimizer: SGD, Adam, AdamW', 'Momentum giúp SGD hội tụ ổn định hơn · Adam/AdamW thích ứng learning rate cho từng tham số · AdamW là lựa chọn mặc định phổ biến hiện nay (kể cả cho fine-tune LLM)'],
      ['lr-scheduler', 'Learning rate schedulers', 'Bộ lập lịch learning rate', 'Giảm learning rate dần theo epoch (step, cosine) · Warmup ở đầu huấn luyện, đặc biệt quan trọng khi fine-tune transformer · Ảnh hưởng của scheduler tới độ ổn định huấn luyện'],
      ['theo-doi-huan-luyen', 'Tracking a training run', 'Theo dõi một lượt huấn luyện', 'Log loss theo epoch/batch · Nhận diện overfitting qua đồ thị train loss vs validation loss (nối lại khoá Machine Learning) · Lưu checkpoint để không mất tiến độ khi huấn luyện dài'],
    ]],
    ['Chapter 4 — CNNs for images', 'Chương 4 — CNN cho ảnh', 'Mạng tích chập: kiến trúc từng thống trị thị giác máy tính.', [
      ['conv-layer', 'Convolutional layers, intuitively', 'Lớp tích chập, hiểu một cách trực giác', 'Filter/kernel trượt qua ảnh để phát hiện đặc trưng cục bộ (cạnh, hoạ tiết) · Chia sẻ tham số làm CNN hiệu quả hơn fully-connected cho ảnh · stride và padding'],
      ['pooling', 'Pooling and downsampling', 'Pooling và giảm kích thước', 'MaxPool giữ đặc trưng nổi bật nhất, giảm kích thước · Vì sao giảm kích thước dần qua các lớp · Global average pooling trước lớp phân loại cuối'],
      ['cnn-architecture', 'A small CNN architecture end to end', 'Một kiến trúc CNN nhỏ từ đầu tới cuối', 'Xếp chồng conv → activation → pooling nhiều lần · Flatten trước lớp fully-connected cuối · Đếm và hiểu shape qua từng lớp'],
      ['transfer-learning-cnn', 'Transfer learning with pretrained CNNs', 'Transfer learning với CNN đã huấn luyện sẵn', 'torchvision.models tải model đã huấn luyện trên ImageNet · Đóng băng phần lớn lớp, chỉ huấn luyện lại lớp cuối cho bài toán mới · Vì sao transfer learning thường tốt hơn huấn luyện từ đầu với dữ liệu nhỏ'],
    ]],
    ['Chapter 5 — Sequences and attention', 'Chương 5 — Chuỗi và attention', 'Từ RNN tới cơ chế attention giải quyết giới hạn của nó.', [
      ['rnn-gioi-han', 'RNNs and their limitations', 'RNN và giới hạn của nó', 'RNN xử lý chuỗi tuần tự, nhớ trạng thái qua các bước · Vấn đề gradient biến mất trên chuỗi dài (vanishing gradient) · LSTM/GRU cải thiện nhưng không giải quyết triệt để'],
      ['attention-truc-giac', 'Attention, intuitively', 'Attention, hiểu một cách trực giác', 'Thay vì nén cả chuỗi vào một trạng thái, "nhìn lại" toàn bộ chuỗi có trọng số · Query, key, value — vai trò của từng thành phần · Ví dụ trực quan: từ nào trong câu quan trọng với từ đang xét'],
      ['self-attention', 'Self-attention step by step', 'Self-attention từng bước', 'Tính điểm attention giữa mọi cặp vị trí trong chuỗi · Softmax chuẩn hoá điểm thành trọng số · Multi-head attention: nhiều "góc nhìn" song song'],
      ['tu-viet-attention', 'Implementing self-attention from scratch', 'Tự cài đặt self-attention từ đầu', 'Viết một lớp self-attention tối giản bằng PyTorch thuần · So sánh với nn.MultiheadAttention có sẵn · Kiểm shape đầu vào/đầu ra khớp kỳ vọng'],
    ]],
    ['Chapter 6 — Transformers', 'Chương 6 — Transformer', 'Kiến trúc nền tảng của các LLM hiện nay.', [
      ['positional-encoding', 'Positional encoding: why order matters', 'Positional encoding: vì sao thứ tự quan trọng', 'Self-attention tự thân không biết thứ tự token · Positional encoding (sin/cos hoặc học được) đưa vị trí vào biểu diễn · Vì sao đây là chi tiết dễ bị bỏ sót nhưng quan trọng'],
      ['transformer-block', 'A transformer block: attention + feed-forward', 'Một khối transformer: attention + feed-forward', 'Attention rồi tới feed-forward network, xen kẽ residual connection · Layer normalization giữ huấn luyện ổn định · Xếp chồng nhiều khối tạo thành mạng sâu'],
      ['encoder-decoder', 'Encoder-only, decoder-only, and encoder-decoder', 'Chỉ encoder, chỉ decoder, và encoder-decoder', 'BERT kiểu encoder-only cho hiểu văn bản · GPT/Claude kiểu decoder-only cho sinh văn bản · Khi nào kiến trúc encoder-decoder (dịch máy) vẫn được dùng'],
      ['tu-transformer-den-llm', 'From this transformer to the LLMs you call via API', 'Từ transformer này tới các LLM bạn gọi qua API', 'Cùng kiến trúc nền, khác biệt chủ yếu là quy mô (tham số, dữ liệu) · Nối lại khoá LLM Apps: giờ đã hiểu bên trong "hộp đen" đó vận hành thế nào · Vì sao hiểu attention giúp viết prompt tốt hơn (độ dài ngữ cảnh, vị trí thông tin quan trọng)'],
    ]],
    ['Chapter 7 — Training on GPU', 'Chương 7 — Huấn luyện trên GPU', 'Dùng đúng phần cứng, đúng cách, để huấn luyện nhanh và không hết bộ nhớ.', [
      ['device-management', 'Moving models and data to the GPU', 'Chuyển model và dữ liệu lên GPU', '.to(device) cho cả model lẫn từng batch dữ liệu · Lỗi thường gặp: tensor trên CPU và GPU không tính toán được với nhau · torch.cuda.empty_cache() và khi nào thực sự cần'],
      ['mixed-precision', 'Mixed precision training', 'Huấn luyện với độ chính xác hỗn hợp (mixed precision)', 'float16/bfloat16 giảm bộ nhớ và tăng tốc trên GPU hỗ trợ · torch.autocast và GradScaler · Đánh đổi: nhanh hơn, tốn ít bộ nhớ hơn, độ chính xác số học giảm nhẹ'],
      ['gradient-accumulation', 'Gradient accumulation for larger effective batches', 'Gradient accumulation để mô phỏng batch lớn hơn', 'Khi GPU không đủ bộ nhớ cho batch mong muốn · Cộng dồn gradient qua nhiều batch nhỏ trước khi step · Đánh đổi giữa batch size và bộ nhớ GPU'],
      ['het-bo-nho', 'Debugging out-of-memory errors', 'Debug lỗi hết bộ nhớ GPU', 'CUDA out of memory: nguyên nhân phổ biến nhất · Giảm batch size, bật mixed precision, hoặc gradient accumulation · Theo dõi bộ nhớ GPU đang dùng bằng nvidia-smi/torch.cuda.memory_summary'],
    ]],
    ['Chapter 8 — Fine-tuning with Hugging Face', 'Chương 8 — Fine-tune với Hugging Face', 'Không huấn luyện lại từ đầu — tinh chỉnh một model đã có sẵn.', [
      ['transformers-lib', 'Loading pretrained models with transformers', 'Tải model đã huấn luyện sẵn với thư viện transformers', 'AutoModel/AutoTokenizer tải model theo tên từ Hugging Face Hub · Tokenizer: biến văn bản thành token, khớp đúng model đã chọn · Chạy inference với model đã tải trước khi nghĩ tới fine-tune'],
      ['full-finetune-van-de', 'Why full fine-tuning is expensive', 'Vì sao fine-tune toàn bộ tham số tốn kém', 'Model hiện đại có hàng tỷ tham số — cập nhật hết cần rất nhiều bộ nhớ GPU · Nguy cơ catastrophic forgetting khi fine-tune toàn bộ trên tập dữ liệu nhỏ · Đây là lý do LoRA/PEFT ra đời'],
      ['lora-peft', 'LoRA and PEFT', 'LoRA và PEFT', 'LoRA: chỉ huấn luyện một ma trận nhỏ hạng thấp (low-rank) chèn thêm, đóng băng phần còn lại · Thư viện peft của Hugging Face áp LoRA vào model có sẵn chỉ với vài dòng code · Giảm mạnh bộ nhớ và thời gian huấn luyện so với fine-tune toàn bộ'],
      ['finetune-thuc-hanh', 'Fine-tuning a small model end to end', 'Fine-tune một model nhỏ từ đầu tới cuối', 'Chọn một model nhỏ và một tập dữ liệu vừa sức GPU đang có · Trainer của Hugging Face hoặc vòng lặp tự viết từ Chương 3 · Đánh giá trước/sau fine-tune để chứng minh nó thực sự cải thiện'],
    ]],
    ['Chapter 9 — Running models locally', 'Chương 9 — Chạy model cục bộ', 'Không phải lúc nào cũng cần gọi API cloud.', [
      ['quantization', 'Quantization: smaller, faster, slightly less precise', 'Quantization: nhỏ hơn, nhanh hơn, giảm nhẹ độ chính xác', 'Giảm độ chính xác số (float32 → int8/int4) để giảm kích thước model · Đánh đổi giữa dung lượng/tốc độ và chất lượng đầu ra · Khi nào quantization đáng giá cho việc chạy cục bộ'],
      ['inference-cuc-bo', 'Local inference without a cloud API', 'Suy luận cục bộ không cần API cloud', 'Chạy model đã fine-tune trực tiếp trên máy có GPU · Ưu điểm: không tốn phí API, dữ liệu không rời khỏi máy · Nhược điểm: cần phần cứng đủ mạnh, không dễ scale như API cloud'],
      ['ggml-gioi-thieu', 'A note on llama.cpp-style local runtimes', 'Ghi chú về runtime cục bộ kiểu llama.cpp', 'Định dạng model tối ưu cho CPU/GPU tiêu dùng (giới thiệu khái niệm, không đào sâu cài đặt) · Khi nào runtime chuyên dụng này hợp lý hơn PyTorch thuần cho việc chạy inference · Đây là lựa chọn phổ biến cho việc tự host model ngoài cloud'],
      ['khi-nao-local-hop-ly', 'When local beats an API, and when it does not', 'Khi nào chạy cục bộ tốt hơn API, khi nào không', 'Chi phí một lần (phần cứng) vs chi phí liên tục (API theo lượt gọi) · Độ trễ mạng vs độ trễ tính toán cục bộ · Riêng tư dữ liệu là lý do phổ biến nhất để chọn chạy cục bộ'],
    ]],
    ['Chapter 10 — Capstone: fine-tune and serve', 'Chương 10 — Dự án cuối khoá: fine-tune và phục vụ model', 'Ráp toàn bộ: fine-tune, đánh giá, và đưa ra một API dùng được.', [
      ['chon-bai-toan', 'Choosing a task and a base model', 'Chọn bài toán và model gốc', 'Một bài toán cụ thể (phân loại văn bản, tóm tắt ngắn, hoặc tương tự) · Chọn model gốc vừa sức GPU đang có · Chuẩn bị tập dữ liệu fine-tune nhỏ nhưng sạch'],
      ['finetune-capstone', 'Fine-tuning with LoRA and evaluating it', 'Fine-tune bằng LoRA và đánh giá', 'Áp dụng lại quy trình Chương 8 trên bài toán đã chọn · So sánh kết quả trước/sau fine-tune bằng chỉ số cụ thể (nối lại khoá Machine Learning) · Lưu lại adapter LoRA (nhẹ hơn nhiều so với lưu cả model)'],
      ['dua-ra-api', 'Serving the fine-tuned model as an API', 'Đưa model đã fine-tune ra thành một API', 'Bọc model trong một endpoint FastAPI (nối lại khoá FastAPI) · Tải model một lần lúc khởi động, không tải lại mỗi request · Giới hạn độ dài input/output và timeout hợp lý'],
      ['tong-ket', 'Wrap-up: from tensors to a served model', 'Tổng kết: từ tensor tới một model đang phục vụ thật', 'Checklist năng lực cả khoá · Nhìn lại toàn bộ chuỗi AI trên trang này: Python → ML → Deep Learning → LLM Apps/RAG/AI Agents dùng chính các model được huấn luyện theo cách này · Bước tiếp theo nếu muốn đào sâu một hướng cụ thể (thị giác máy tính, NLP, hoặc huấn luyện quy mô lớn)'],
    ]],
  ]),
};
