/**
 * Feature flags — commerce visibility switches.
 *
 * LỊCH SỬ: 13/07/2026 mọi bề mặt thương mại điện tử bị ẨN (không xoá) để
 * chờ đăng ký Bộ Công Thương. 13/09/2026 BẬT LẠI toàn bộ theo yêu cầu của
 * chủ web, kèm một đợt nâng cấp (bắt buộc đăng nhập mới đặt đơn, ví điểm,
 * gói Pro trả phí, chuyển khoản đối soát, tự phục vụ sau bán).
 *
 * ⚠️ Ẩn ở đây CHỈ ẩn GIAO DIỆN. API backend (`/api/v1/shop/*`) vẫn công
 * khai kể cả khi cờ tắt — tắt cờ rồi tưởng web không còn chào bán hàng là
 * hiểu sai. Muốn đóng thật thì phải chặn ở backend.
 *
 * TO DISABLE again: lật cờ về `false`, chạy lại `npm run build` và deploy.
 * Không mất dữ liệu — sản phẩm, đơn hàng, giá khoá học vẫn nguyên trong DB.
 *
 * These are compile-time constants (not env vars) on purpose: one file,
 * one edit, no VPS/GitHub secret to remember. NEXT_PUBLIC_* env would be
 * baked at build time too, so it buys nothing here.
 */

/**
 * Interview Simulator module (/interview + /admin/interview). Phase 2 ships a
 * STATIC self-assessment engine (zero LLM, zero cost). Turn this OFF to hide
 * the whole module (nav entry + routes) instantly — it's fully self-contained.
 */
export const INTERVIEW_ENABLED = true;

/**
 * CV Builder module (/cv + /admin/cv). Honest IT-focused CV builder that
 * shares the Interview module's LLM/quota/Pro plumbing. STATIC (rules-engine)
 * features are free; AI features are quota-gated (later phases). Turn OFF to
 * hide the whole module (nav entry + routes) instantly — self-contained.
 */
export const CV_BUILDER_ENABLED = true;

/** Online shop: /shop pages, product cards, "buy"/"add to cart" buttons. */
export const SHOP_ENABLED = true;

/** Paid course checkout: PayOS/VNPay buttons, price display, discount codes.
 *  When false, courses are FREE-or-ACCESS-CODE only (both kept working).
 *
 *  Bật lại 13/09/2026. Hiện KHÔNG khoá học nào có giá > 0, nên thực tế mọi
 *  khoá vẫn miễn phí — cờ này bật để luồng giá/khuyến mãi/thanh toán sống và
 *  được kiểm thử; đặt giá cho một khoá là nó bán được ngay, không cần deploy. */
export const COURSE_PAYMENT_ENABLED = true;

/** Public contact section on /about (form + email + phone).
 *  Independent from commerce; hidden per the same compliance cleanup. */
export const CONTACT_ENABLED = true;

/** Cart drawer + navbar cart button + /cart /checkout /my-orders routes.
 *  Shown if EITHER commerce path is live (the cart is shared shop⇄academy). */
export const CART_ENABLED = SHOP_ENABLED || COURSE_PAYMENT_ENABLED;

/** Commerce-signalling UI on marketing pages: footer "Thông tin người bán"
 *  (seller name/tax code/address/phone), purchase-policy links, the
 *  e-commerce service tab, and the /shop quick-link. These are exactly the
 *  elements that read as "operating an e-commerce business", so they follow
 *  whether ANY commerce is actually live. */
export const COMMERCE_ENABLED = SHOP_ENABLED || COURSE_PAYMENT_ENABLED;
