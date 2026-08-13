/**
 * Ảnh → văn bản: phần LỜI DẶN gửi cho model.
 * ─────────────────────────────────────────────────────────────────────────
 * Đây là chỗ quyết định chất lượng của cả tính năng, hơn hẳn phần mã còn lại.
 * Ba điều đã đo được ngày 13/08/2026 và định hình mọi thứ ở đây:
 *
 *  1. Model chép RẤT đúng ký hiệu toán khi được dặn "chép, đừng giải" — trên
 *     ảnh chụp lệch 1,6°, nén JPEG q55, `gpt-5.6-sol` đúng 7/7 bài kể cả
 *     `\sqrt[3]{a^2}`, cận tích phân `π/2`, `ℝ \ {±1}`, vector có mũi tên.
 *  2. Ô ghi chú của người dùng ĐIỀU KHIỂN ĐƯỢC nó thật: bảo "dấu / là phân số,
 *     đổi thành phân số ngang, nhưng 'trang 3/4' thì giữ nguyên" — nó nghe cả
 *     luật lẫn ngoại lệ. Nên ghi chú phải nằm TRONG system prompt, ở CUỐI, chứ
 *     không nhét vào tin nhắn người dùng (dễ bị coi là dữ liệu để chép).
 *  3. Nó vẫn sót khoảng MỘT chỗ nhỏ mỗi trang (lần đo: `S1/S2` không hạ chỉ
 *     số). Vì thế luồng bắt buộc phải có màn xem lại — xem `transcribe.service`.
 *
 * ⚠️ Ví dụ cụ thể trong prompt bị model nhỏ chép NHƯ DỮ LIỆU (đã dính một lần
 * ở chỗ khác). Nên mọi ví dụ dưới đây đều nói bằng LUẬT ("dấu X ⇒ viết thành
 * Y"), không kèm câu mẫu trông giống nội dung đề.
 */

/** Một ô chọn sẵn trong giao diện. `note` được ghép thẳng vào lời dặn. */
export interface SymbolPreset {
  id: string;
  label: string;
  hint: string;
  note: string;
}

export const SYMBOL_PRESETS: SymbolPreset[] = [
  {
    id: 'math',
    label: 'Ký hiệu toán học',
    hint: 'Phân số, căn, mũ, chỉ số, tích phân, ma trận — viết đúng dạng toán',
    note: [
      '- Mọi biểu thức toán viết bằng LaTeX: trong dòng dùng $...$, đứng riêng một dòng dùng $$...$$.',
      '- Phân số LUÔN viết dạng phân số ngang \\dfrac{tử}{mẫu}, không bao giờ để dấu gạch chéo.',
      '- Giữ đúng: cận trên/cận dưới của tích phân và tổng, chỉ số dưới, số mũ, dấu ngoặc lớn bao quanh phân số.',
      '- Các dấu ≤ ≥ ≠ ≈ ∈ ∉ ⊂ ∪ ∩ ± ∞ → ⇒ ⇔ ∀ ∃ viết bằng lệnh LaTeX tương ứng, không thay bằng chữ.',
    ].join('\n'),
  },
  {
    id: 'slash_fraction',
    label: 'Dấu / trong ảnh là phân số',
    hint: 'Đề đánh máy vội viết a/b — đổi thành phân số ngang; số trang kiểu 3/4 giữ nguyên',
    note: [
      '- Trong ảnh, phân số được gõ bằng dấu gạch chéo "/". Hãy đổi thành PHÂN SỐ NGANG \\dfrac{tử}{mẫu}.',
      '- Ngoại lệ, GIỮ NGUYÊN dấu gạch chéo: số trang (trang 3/4), ngày tháng, tỉ số ghi kèm chữ "tỉ lệ", đơn vị kiểu km/h.',
      '- Khi tử hoặc mẫu là cả một cụm trong ngoặc, lấy trọn cụm đó, bỏ cặp ngoặc thừa.',
    ].join('\n'),
  },
  {
    id: 'chemistry',
    label: 'Công thức hoá học',
    hint: 'H₂SO₄, mũi tên phản ứng, hệ số cân bằng',
    note: [
      '- Công thức hoá học viết bằng LaTeX với chỉ số dưới: $H_2SO_4$, $Fe_3O_4$.',
      '- Mũi tên phản ứng dùng \\rightarrow, thuận nghịch dùng \\rightleftharpoons; điều kiện ghi trên mũi tên bằng \\xrightarrow{...}.',
      '- Giữ nguyên hệ số cân bằng và trạng thái (r), (l), (k), (dd) đúng như trong ảnh.',
    ].join('\n'),
  },
  {
    id: 'physics',
    label: 'Vật lý — vector và đơn vị',
    hint: 'Đại lượng vector có mũi tên, đơn vị đi liền số',
    note: [
      '- Đại lượng vector viết \\vec{F}, \\overrightarrow{AB}; độ lớn viết |\\vec{F}|. KHÔNG được bỏ mũi tên.',
      '- Đơn vị giữ nguyên và đứng liền sau số, không đổi hệ đơn vị, không làm tròn.',
    ].join('\n'),
  },
  {
    id: 'geometry',
    label: 'Có hình vẽ (hình học)',
    hint: 'Mô tả lại hình và vẽ lại thành hình nét — xem phần cảnh báo trong giao diện',
    note: [
      '- Ảnh có HÌNH VẼ. Sau phần chữ của mỗi bài có hình, thêm một khối mô tả hình theo mẫu:',
      '  [HÌNH] các điểm, cách nối, nét đứt là cạnh nào, ký hiệu góc vuông ở đâu, số đo ghi trên cạnh nào.',
      '- Mô tả đúng những gì NHÌN THẤY trong hình, không suy diễn thêm tính chất mà hình không thể hiện.',
    ].join('\n'),
  },
  {
    id: 'verbatim',
    label: 'Giữ nguyên hệt như ảnh',
    hint: 'Không đổi ký hiệu, không sửa chính tả — chép y nguyên',
    note: [
      '- Chép Y NGUYÊN từng ký tự như trong ảnh, kể cả cách viết tắt, cách xuống dòng và lỗi chính tả nếu có.',
      '- KHÔNG đổi dấu gạch chéo thành phân số, KHÔNG chuẩn hoá ký hiệu.',
    ].join('\n'),
  },
];

export function presetById(id: string): SymbolPreset | undefined {
  return SYMBOL_PRESETS.find((p) => p.id === id);
}

const KHUNG = `Bạn là máy chép lại tài liệu từ ảnh cho giáo viên. Ảnh là trang bài giảng, đề bài hoặc bài tập.

NHIỆM VỤ DUY NHẤT: chép lại nội dung trong ảnh thành văn bản. Bạn KHÔNG giải bài, KHÔNG giải thích, KHÔNG nhận xét, KHÔNG thêm một chữ nào không có trong ảnh.

Quy tắc chung:
- Giữ nguyên tiếng Việt có dấu, giữ nguyên cách đánh số bài và thứ tự trên trang.
- Tiêu đề lớn của trang viết thành dòng bắt đầu bằng "# "; đề mục nhỏ bắt đầu bằng "## ".
- Chữ in đậm trong ảnh viết **như thế này**. Gạch đầu dòng viết bằng "- ".
- Chỗ nào trong ảnh mờ, bị che hoặc không đọc chắc chắn: viết [?] ngay tại chỗ đó thay vì đoán. Đây là luật quan trọng nhất — thà để trống còn hơn bịa ra một con số.
- Không bọc kết quả trong khối \`\`\`; trả về thẳng nội dung đã chép.`;

/**
 * Ghép lời dặn cuối cùng.
 *
 * Thứ tự có chủ đích: khung → luật của các ô đã chọn → ghi chú tự do của người
 * dùng, ĐẶT CUỐI. Cái nào đứng sau thì thắng, và người dùng phải là người nói
 * câu cuối cùng.
 */
export function buildSystemPrompt(opts: { presetIds?: string[]; note?: string; luatHinh?: string }): string {
  const phan: string[] = [KHUNG];

  const luat = (opts.presetIds ?? [])
    .map((id) => presetById(id))
    .filter((p): p is SymbolPreset => !!p)
    .map((p) => p.note);
  if (luat.length) phan.push(`CÁCH VIẾT KÝ HIỆU (bắt buộc):\n${luat.join('\n')}`);

  // Luật về hình đứng TRƯỚC ghi chú người dùng, để người dùng còn đè lên được
  // ("hình trang 2 bỏ qua, chỉ vẽ lại hình trang 1").
  if (opts.luatHinh) phan.push(`VỀ HÌNH VẼ:\n${opts.luatHinh}`);

  const note = (opts.note ?? '').trim();
  if (note) {
    phan.push(
      `GHI CHÚ RIÊNG CỦA NGƯỜI DÙNG — ƯU TIÊN CAO NHẤT, ghi đè mọi luật ở trên nếu mâu thuẫn:\n${note.slice(0, 2000)}`,
    );
  }
  return phan.join('\n\n');
}
