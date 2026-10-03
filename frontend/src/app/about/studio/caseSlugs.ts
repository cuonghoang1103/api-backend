/**
 * Bản đồ nhỏ "sản phẩm → case study" — tách khỏi `cases.ts` để trang
 * /about/studio chỉ kéo vài chục byte này vào gói JS, không kéo cả năm bài
 * case study (chữ của chúng chỉ nằm ở trang /about/studio/case/<slug>).
 *
 * Khoá là `Product.id` trong `content.ts`. Đổi slug ở đây = đổi URL đã công bố.
 */
export const CASE_SLUG_BY_PRODUCT: Record<string, string> = {
  site: 'cuongthai-com',
  ctwork: 'ct-work',
  desktop: 'cuongthai-desktop',
  ios: 'cuongthai-ios',
  labflow: 'labflow-ai',
};

export function caseHref(productId: string): string | null {
  const slug = CASE_SLUG_BY_PRODUCT[productId];
  return slug ? `/about/studio/case/${slug}` : null;
}
