/**
 * Không gian tên của các "phòng lab trực quan" nhúng được vào bài học. Tệp này CỐ Ý không import gì: trang học dùng nó
 * để hỏi "bài này có khối mô phỏng nào không" mà không kéo cả danh mục mô phỏng vào gói JS ban đầu.
 *
 * Mỗi không gian tên `ns` dùng đúng một mẫu class trong HTML bài học (qua được sanitizeHtml, không có script):
 *   <div class="<ns> <ns>-sim-<tên> <ns>-p-<preset>"><p class="<ns>-cap">… link mở toàn màn hình …</p></div>
 */
export const LAB_NAMESPACES = ['os-lab', 'cpu-lab'] as const;
export type LabNs = (typeof LAB_NAMESPACES)[number];
/** 'div.os-lab, div.cpu-lab' */
export const LAB_SELECTOR = LAB_NAMESPACES.map((ns) => `div.${ns}`).join(', ');
