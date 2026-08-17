/**
 * ============================================================
 * BỘ TOOL CỦA AGENT — hợp đồng giữa máy chủ và app desktop
 * ============================================================
 *
 * Đây là bản mô tả DUY NHẤT về những gì agent làm được. App desktop KHÔNG tự
 * khai báo tool: nó chỉ nói mình chạy được nhóm nào (`capabilities`), còn nội
 * dung mô tả thì lấy từ đây. Lý do là thứ sẽ đau nếu làm ngược:
 *
 *   • App tải về máy người dùng và KHÔNG tự cập nhật ngay. Nếu mô tả tool nằm
 *     trong app, thì sửa một câu mô tả cho model hiểu đúng hơn phải chờ phát
 *     hành bản mới và chờ từng người bấm cập nhật. Ở đây thì sửa xong deploy
 *     là mọi bản app cũ cũng hưởng.
 *   • Hai bên tự khai báo riêng là hai bản sao, và bản sao thì sẽ trôi dạt —
 *     đúng bài học đã trả giá bằng `prisma/seed.ts` chép tay lại union enum
 *     (08/08/2026, vỡ seed trên production).
 *
 * ─── HAI VÒNG, KHÁC NHAU Ở CHỖ AI CHẠY ───
 *
 *   ring: 'client'  → chỉ app desktop chạy được (đọc file trên máy người dùng).
 *                     Máy chủ KHÔNG với tới máy người dùng, nên nó chỉ có thể
 *                     chuyển lời gọi về cho app rồi kết thúc lượt.
 *   ring: 'server'  → máy chủ tự chạy tại chỗ (đọc ghi chú trong CSDL). App
 *                     không cần biết gì về API Notes, và một bản app cũ vẫn
 *                     dùng được tool Notes mới thêm.
 *
 * ─── P1 CHỈ ĐỌC ───
 * Không có tool nào ghi file, chạy lệnh, hay sửa ghi chú. Đó là ranh giới có
 * chủ đích của bản đầu tiên, KHÔNG phải chuyện chưa kịp làm. Thêm tool ghi thì
 * phải thêm cả tầng xin phép ở app trước — xem `prompt.ts`.
 */

/** Ai chạy tool này. */
export type ToolRing = 'client' | 'server';

/**
 * Nhóm khả năng mà app khai báo là mình chạy được. Bản app cũ không biết
 * nhóm mới ⇒ máy chủ không đưa tool nhóm đó cho model ⇒ model không bao giờ
 * gọi thứ app không chạy được. Đây là cách để thêm tool mà không làm chết app
 * cũ đang cài trên máy người dùng.
 */
export type AgentCapability = 'fs_read' | 'git_read' | 'fs_write' | 'shell' | 'plan' | 'subagent';

export interface AgentToolDef {
  name: string;
  ring: ToolRing;
  /** Nhóm khả năng phía app. Bỏ trống với tool ring 'server' — máy chủ luôn chạy được. */
  capability?: AgentCapability;
  description: string;
  /** JSON Schema, gửi thẳng cho cổng trong trường `tools[].function.parameters`. */
  parameters: Record<string, unknown>;
}

/**
 * Mô tả tool là PROMPT, không phải tài liệu.
 *
 * Model đọc đúng những dòng này để quyết định gọi cái nào với tham số gì, nên
 * mỗi câu ở đây đáng giá bằng một đoạn prompt hệ thống. Ba thứ luôn phải có:
 * tool này dùng khi nào, cái gì KHÔNG nên dùng nó, và đầu ra bị cắt ra sao —
 * model không biết đầu ra bị cắt thì nó sẽ kết luận trên nửa file mà tưởng là
 * cả file.
 */
export const AGENT_TOOLS: readonly AgentToolDef[] = [
  // ─── Vòng 1: máy của người dùng ────────────────────────────────
  {
    name: 'list_dir',
    ring: 'client',
    capability: 'fs_read',
    description:
      'Liệt kê file và thư mục con tại một đường dẫn trong dự án. Dùng để dò cấu trúc trước khi đọc. ' +
      'Bỏ qua node_modules, .git và những thứ .gitignore đã loại. Kết quả cắt ở 300 mục.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Đường dẫn TƯƠNG ĐỐI so với gốc dự án. Gốc là "." hoặc "".' },
      },
      required: ['path'],
    },
  },
  {
    name: 'read_file',
    ring: 'client',
    capability: 'fs_read',
    description:
      'Đọc nội dung một file, trả về kèm số dòng ở đầu mỗi dòng. ' +
      'MẶC ĐỊNH chỉ đọc 800 dòng đầu — file dài hơn sẽ bị CẮT và cuối kết quả có ghi rõ còn bao nhiêu dòng. ' +
      'Cần phần sau thì gọi lại với offset. Đừng đoán nội dung phần bị cắt.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Đường dẫn TƯƠNG ĐỐI so với gốc dự án.' },
        offset: { type: 'integer', description: 'Bắt đầu từ dòng số mấy (1 là dòng đầu). Mặc định 1.' },
        limit: { type: 'integer', description: 'Đọc bao nhiêu dòng. Mặc định 800, tối đa 2000.' },
      },
      required: ['path'],
    },
  },
  {
    name: 'grep',
    ring: 'client',
    capability: 'fs_read',
    description:
      'Tìm một BIỂU THỨC CHÍNH QUY trong nội dung file, trả về dạng đường-dẫn:số-dòng:nội-dung. ' +
      'Đây là cách nhanh nhất để tìm nơi định nghĩa một hàm/biến — nhanh hơn nhiều so với đọc lần lượt từng file. ' +
      'Kết quả cắt ở 200 dòng. ' +
      'LƯU Ý tiếng Việt: \\b không khớp chữ có dấu, nên tìm từ tiếng Việt thì đừng dùng \\b.',
    parameters: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Biểu thức chính quy.' },
        path: { type: 'string', description: 'Chỉ tìm trong thư mục con này. Bỏ trống = cả dự án.' },
        glob: { type: 'string', description: 'Chỉ tìm trong file khớp mẫu, ví dụ "*.ts".' },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'glob',
    ring: 'client',
    capability: 'fs_read',
    description:
      'Tìm file theo MẪU TÊN, ví dụ "src/**/*.service.ts". Dùng khi biết file tên gì nhưng không biết nằm đâu. ' +
      'Kết quả sắp theo lần sửa gần nhất, cắt ở 200 file.',
    parameters: {
      type: 'object',
      properties: { pattern: { type: 'string', description: 'Mẫu glob, tương đối so với gốc dự án.' } },
      required: ['pattern'],
    },
  },
  {
    name: 'git_status',
    ring: 'client',
    capability: 'git_read',
    description:
      'Nhánh hiện tại, và danh sách file đang sửa dở / chưa theo dõi. ' +
      'Gọi cái này trước khi trả lời câu hỏi kiểu "tôi đang làm gì dở".',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'git_diff',
    ring: 'client',
    capability: 'git_read',
    description:
      'Nội dung thay đổi chưa commit, dạng unified diff. Kết quả cắt ở 1500 dòng — diff to thì truyền path để thu hẹp.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Chỉ xem diff của đường dẫn này. Bỏ trống = tất cả.' },
        staged: { type: 'boolean', description: 'true = phần đã git add. Mặc định false.' },
      },
    },
  },

  // ─── Vòng 1b: SỬA file (P2) — mỗi lần ghi đều phải được người dùng duyệt ──
  //
  // Nguyên thuỷ là THAY CHUỖI, không phải unified diff và cũng không phải ghi
  // đè cả file:
  //   • diff cần số dòng, mà model đếm dòng sai thường xuyên — và sai một dòng
  //     là vá vào chỗ khác chứ không phải báo lỗi;
  //   • ghi đè cả file bắt model chép lại nguyên văn phần nó không định sửa,
  //     tốn tiền theo kích thước file và thỉnh thoảng đánh rơi vài dòng.
  // Thay chuỗi thì sai là KHÔNG KHỚP, mà không khớp thì không ghi gì cả. Hỏng
  // ồn ào bao giờ cũng hơn hỏng im lặng.
  {
    name: 'edit_file',
    ring: 'client',
    capability: 'fs_write',
    description:
      'Sửa một đoạn trong file có sẵn: thay old_text bằng new_text. ' +
      'old_text phải khớp CHÍNH XÁC từng ký tự, kể cả thụt lề và xuống dòng — hãy đọc file bằng read_file ngay trước khi sửa, đừng dựa vào trí nhớ. ' +
      'old_text cũng phải DUY NHẤT trong file; nếu đoạn đó xuất hiện nhiều lần, lấy thêm dòng phía trên/dưới cho đủ riêng biệt. ' +
      'Người dùng phải DUYỆT thì mới ghi. Bị từ chối là chuyện bình thường: đừng gọi lại y hệt, hãy hỏi họ muốn khác chỗ nào. ' +
      'Mỗi lần gọi sửa MỘT chỗ — nhiều chỗ thì gọi nhiều lần để người dùng duyệt từng cái.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Đường dẫn TƯƠNG ĐỐI so với gốc dự án.' },
        old_text: { type: 'string', description: 'Đoạn văn bản hiện có, chép chính xác từ file.' },
        new_text: { type: 'string', description: 'Đoạn thay thế. Để chuỗi rỗng nghĩa là XOÁ đoạn đó.' },
      },
      required: ['path', 'old_text', 'new_text'],
    },
  },
  {
    name: 'create_file',
    ring: 'client',
    capability: 'fs_write',
    description:
      'Tạo file MỚI kèm nội dung. Báo lỗi nếu file đã tồn tại — muốn đổi file có sẵn thì dùng edit_file. ' +
      'Thư mục cha còn thiếu sẽ được tạo theo. Cũng cần người dùng duyệt.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Đường dẫn TƯƠNG ĐỐI so với gốc dự án.' },
        content: { type: 'string', description: 'Toàn bộ nội dung file.' },
      },
      required: ['path', 'content'],
    },
  },

  // ─── Vòng 1c: CHẠY LỆNH (P3) ───────────────────────────────────
  {
    name: 'run_command',
    ring: 'client',
    capability: 'shell',
    description:
      'Chạy một lệnh shell trong thư mục dự án và trả về đầu ra kèm mã thoát. ' +
      'Dùng để CHẠY BỘ KIỂM và tự xác nhận việc mình vừa sửa: `npm test`, `npx tsc --noEmit`, `npm run build`, `pytest`. ' +
      'Người dùng phải DUYỆT từng lệnh, và họ nhìn thấy nguyên văn chuỗi lệnh — nên hãy viết lệnh ngắn, rõ, làm ĐÚNG MỘT việc. ' +
      'KHÔNG chạy lệnh xoá, cài gói, git commit/push, hay tải gì từ Internet: người dùng sẽ từ chối và bạn mất một lượt. ' +
      'KHÔNG dùng lệnh để đọc file — đã có read_file, và những file bị chặn thì chặn là có lý do. ' +
      'Lệnh chạy KHÔNG có bàn phím: thứ gì hỏi lại người dùng sẽ treo tới khi hết giờ. Thêm cờ không-hỏi (ví dụ `--yes`) nếu cần. ' +
      'Đầu ra bị cắt ở khoảng 24.000 ký tự (giữ đầu và đuôi, bỏ khúc giữa).',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Lệnh đầy đủ, chạy từ gốc dự án.' },
        timeout_seconds: { type: 'integer', description: 'Trần thời gian. Mặc định 120, tối đa 600.' },
      },
      required: ['command'],
    },
  },

  // ─── Kế hoạch (P4) — không chạm đĩa, chỉ vẽ lên màn hình ────────
  //
  // Tool này KHÔNG làm gì trên máy: nó chỉ đẩy một danh sách việc lên giao
  // diện. Nhưng nó đổi hẳn cảm giác dùng — một việc 20 bước mà không có danh
  // sách thì người dùng chỉ thấy tool chạy lộn xộn và không biết còn bao lâu.
  // Nó cũng làm agent làm việc có thứ tự hơn: viết kế hoạch ra buộc nó chia
  // việc trước khi lao vào bước đầu tiên.
  {
    name: 'cap_nhat_ke_hoach',
    ring: 'client',
    capability: 'plan',
    description:
      'Công bố (hoặc cập nhật) danh sách việc cần làm, hiện lên màn hình cho người dùng theo dõi. ' +
      'GỌI NGAY khi việc cần từ 3 bước trở lên, TRƯỚC khi bắt tay làm — kế hoạch viết sau khi làm xong thì vô dụng. ' +
      'Gửi LẠI TOÀN BỘ danh sách mỗi lần cập nhật (không gửi phần thêm), với trạng thái mới nhất của từng mục. ' +
      'Đánh dấu "dang" cho ĐÚNG MỘT việc tại một thời điểm, và đổi sang "xong" ngay khi làm xong việc đó — ' +
      'đừng dồn tới cuối mới cập nhật, vì lúc đó người dùng đã ngồi nhìn một danh sách đứng im suốt cả lượt. ' +
      'Việc đơn giản một bước thì ĐỪNG dùng tool này.',
    parameters: {
      type: 'object',
      properties: {
        viec: {
          type: 'array',
          description: 'Toàn bộ danh sách, theo thứ tự làm.',
          items: {
            type: 'object',
            properties: {
              ten: { type: 'string', description: 'Việc cần làm, một câu ngắn.' },
              trangThai: { type: 'string', enum: ['chua', 'dang', 'xong'], description: 'chua | dang | xong' },
            },
            required: ['ten', 'trangThai'],
          },
        },
      },
      required: ['viec'],
    },
  },

  // ─── Việc phụ (sub-agent) ──────────────────────────────────────
  //
  // ⚠️ SUB-AGENT NHÂN TOKEN LÊN, KHÔNG CHIA RA. Mỗi việc phụ mang ngữ cảnh
  // riêng của nó, nên ba việc phụ là ba hội thoại phải trả tiền song song. Nó
  // CHỈ đáng khi câu hỏi cần dò nhiều hướng độc lập trên một repo lớn — thứ mà
  // agent chính làm tuần tự thì tốn nhiều bước hơn hẳn.
  //
  // Vì thế mô tả dưới đây nói rõ KHI NÀO ĐỪNG DÙNG, và nói trước cả hai con số
  // trần. Model không biết trần thì nó sẽ đâm vào trần rồi mới biết.
  {
    name: 'giao_viec_phu',
    ring: 'client',
    capability: 'subagent',
    description:
      'Giao một việc TÌM HIỂU độc lập cho một agent phụ, nhận về bản tóm tắt. ' +
      'Agent phụ CHỈ ĐỌC (không sửa file, không chạy lệnh, không giao việc tiếp) và tối đa 10 bước. ' +
      'DÙNG KHI: cần dò nhiều hướng độc lập nhau trên repo lớn — ví dụ "tìm mọi nơi xử lý thanh toán" song song với "tìm mọi nơi ghi log". ' +
      'ĐỪNG DÙNG KHI: việc chỉ cần vài lần grep/read (tự làm rẻ hơn nhiều), hoặc khi các bước phụ thuộc nhau — agent phụ không thấy hội thoại của bạn và không nói chuyện được với nhau. ' +
      'Tối đa 3 việc phụ cho MỘT câu hỏi của người dùng. Mỗi việc phụ tốn hạn mức như một lượt riêng, nên hãy viết nhiệm vụ THẬT CỤ THỂ: nói rõ cần tìm gì và muốn nhận lại gì.',
    parameters: {
      type: 'object',
      properties: {
        nhiem_vu: {
          type: 'string',
          description: 'Nhiệm vụ đầy đủ, tự đứng một mình được — agent phụ KHÔNG thấy hội thoại của bạn.',
        },
      },
      required: ['nhiem_vu'],
    },
  },

  // ─── Vòng 2: Notes (máy chủ tự chạy) ───────────────────────────
  {
    name: 'notes_search',
    ring: 'server',
    description:
      'Tìm trong GHI CHÚ CÁ NHÂN của người dùng trên cuongthai.com (không phải file trong dự án). ' +
      'Dùng khi câu hỏi nhắc tới kế hoạch, quyết định, việc cần làm, hay "tôi đã ghi ở đâu đó". ' +
      'Trả về danh sách id + tiêu đề + đoạn trích; muốn đọc cả bài thì gọi tiếp notes_read với id. ' +
      'CÁCH TÌM CHO TRÚNG: đây là so khớp CHUỖI CON theo đúng mặt chữ, KHÔNG phải tìm theo ngữ nghĩa. ' +
      'Hãy đưa MỘT cụm ngắn và đặc trưng ("Cầu Vồng"), đừng đưa cả câu hỏi hay cụm nhiều từ ("hạn chót dự án Cầu Vồng là ngày nào") — cụm càng dài càng dễ trượt. ' +
      'Trượt hai lần liên tiếp thì ĐỪNG thử từ khoá thứ ba: gọi notes_tree để xem người dùng thật sự có những gì.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Từ khoá. Tìm cả trong tiêu đề lẫn nội dung.' },
        tag: { type: 'string', description: 'Lọc thêm theo thẻ.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'notes_read',
    ring: 'server',
    description:
      'Đọc TOÀN VĂN một ghi chú theo id (lấy id từ notes_search hoặc notes_tree). ' +
      'Trả về chữ thuần đã bỏ thẻ HTML, kèm thẻ và danh sách liên kết. Cắt ở 12000 ký tự.',
    parameters: {
      type: 'object',
      properties: { id: { type: 'integer', description: 'id của ghi chú.' } },
      required: ['id'],
    },
  },
  {
    name: 'notes_tree',
    ring: 'server',
    description:
      'Cây môn học → chương → ghi chú của người dùng. Dùng để biết họ đang có những sổ gì trước khi tìm. ' +
      'Chỉ trả tiêu đề và id, không trả nội dung.',
    parameters: { type: 'object', properties: {} },
  },
];

/** Tra nhanh theo tên. */
const BY_NAME = new Map(AGENT_TOOLS.map((t) => [t.name, t]));

export function toolByName(name: string): AgentToolDef | undefined {
  return BY_NAME.get(name);
}

/**
 * Bộ tool gửi cho cổng, dạng OpenAI function-calling.
 *
 * Tool ring 'server' LUÔN có mặt. Tool ring 'client' chỉ có mặt khi app khai
 * báo chạy được nhóm đó — không khai thì model không nhìn thấy, nên nó không
 * thể gọi thứ app sẽ không biết làm gì.
 */
export function toolsForGateway(capabilities: readonly AgentCapability[]): Array<{
  type: 'function';
  function: { name: string; description: string; parameters: Record<string, unknown> };
}> {
  const have = new Set(capabilities);
  return AGENT_TOOLS.filter((t) => t.ring === 'server' || (t.capability && have.has(t.capability))).map((t) => ({
    type: 'function' as const,
    function: { name: t.name, description: t.description, parameters: t.parameters },
  }));
}

/** Danh sách nhóm khả năng hợp lệ — dùng để lọc phần app gửi lên. */
export const ALL_CAPABILITIES: readonly AgentCapability[] = ['fs_read', 'git_read', 'fs_write', 'shell', 'plan', 'subagent'];

export function parseCapabilities(raw: unknown): AgentCapability[] {
  if (!Array.isArray(raw)) return [];
  const ok = new Set<string>(ALL_CAPABILITIES);
  return raw.filter((c): c is AgentCapability => typeof c === 'string' && ok.has(c));
}
