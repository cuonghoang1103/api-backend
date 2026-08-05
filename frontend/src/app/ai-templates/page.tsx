import { redirect } from 'next/navigation';

/**
 * Gốc kho chuyển thẳng sang danh sách Skills.
 *
 * Không dựng thêm một trang tổng quan riêng: nó sẽ là bản sao của
 * `/ai-templates/skills` với cùng bộ thẻ, và hai URL cùng nội dung là thứ
 * Google phạt (nội dung trùng lặp) còn người dùng thì không phân biệt nổi.
 * Một danh sách, một địa chỉ chuẩn.
 */
export default function AiTemplatesIndex() {
  redirect('/ai-templates/skills');
}
