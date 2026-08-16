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
export type AgentCapability = 'fs_read' | 'git_read';

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
export const ALL_CAPABILITIES: readonly AgentCapability[] = ['fs_read', 'git_read'];

export function parseCapabilities(raw: unknown): AgentCapability[] {
  if (!Array.isArray(raw)) return [];
  const ok = new Set<string>(ALL_CAPABILITIES);
  return raw.filter((c): c is AgentCapability => typeof c === 'string' && ok.has(c));
}
