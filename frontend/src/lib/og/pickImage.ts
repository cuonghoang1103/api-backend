/**
 * UX-D — chọn ảnh xem trước cho trang có ảnh riêng (thumbnail khoá học/dự án/bài viết):
 * PNG/JPEG tuyệt đối ⇒ giữ (ảnh tác giả tự chọn); WebP/SVG/không có ⇒ undefined để ảnh động opengraph-image.tsx
 * cùng thư mục (có tiêu đề thật) được dùng — Zalo/Messenger/Outlook không phải lúc nào cũng vẽ được WebP.
 */
export function ogImageOr(image: string | null | undefined, pagePath: string): string[] {
  if (image && /^https?:\/\//.test(image) && /\.(png|jpe?g)(\?|$)/i.test(image)) return [image];
  // Trang đã khai `openGraph` riêng thì Next KHÔNG tự chèn ảnh opengraph-image của segment ⇒ trỏ thẳng vào nó.
  return [`${pagePath.replace(/\/$/, '')}/opengraph-image`];
}

export const OG_SITE = { siteName: 'CuongThai', locale: 'vi_VN' } as const;
